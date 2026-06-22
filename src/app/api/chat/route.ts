import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { callOpenAI } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { employeeId, message } = await request.json();

    if (!employeeId || !message?.trim()) {
      return NextResponse.json(
        { error: "employeeIdとmessageは必須です" },
        { status: 400 }
      );
    }

    // 社員情報取得(本人所有か確認 = RLSでも保護されるが明示チェック)
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("*")
      .eq("id", employeeId)
      .eq("user_id", user.id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: "AI社員が見つかりません" },
        { status: 404 }
      );
    }

    // ユーザーのAPIキー取得
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("openai_api_key")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.openai_api_key) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません。設定ページで登録してください。" },
        { status: 400 }
      );
    }

    // 直近の会話履歴を取得(直近20件、文脈として渡す)
    const { data: history } = await supabase
      .from("chats")
      .select("role, content")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: true })
      .limit(20);

    // ユーザーメッセージを保存
    const { error: insertUserError } = await supabase.from("chats").insert({
      employee_id: employeeId,
      user_id: user.id,
      role: "user",
      content: message,
    });

    if (insertUserError) {
      return NextResponse.json(
        { error: "メッセージの保存に失敗しました" },
        { status: 500 }
      );
    }

    // OpenAI呼び出し
    let aiReply: string;
    try {
      aiReply = await callOpenAI({
        apiKey: profile.openai_api_key,
        systemPrompt: employee.system_prompt,
        messages: [
          ...(history ?? []).map((h) => ({
            role: h.role as "user" | "assistant",
            content: h.content,
          })),
          { role: "user", content: message },
        ],
      });
    } catch (e) {
      const errMsg =
        e instanceof Error ? e.message : "OpenAI APIの呼び出しに失敗しました";
      return NextResponse.json(
        { error: `AI応答エラー: ${errMsg}。APIキーが正しいか設定ページでご確認ください。` },
        { status: 502 }
      );
    }

    // AI応答を保存
    const { data: savedReply, error: insertAiError } = await supabase
      .from("chats")
      .insert({
        employee_id: employeeId,
        user_id: user.id,
        role: "assistant",
        content: aiReply,
      })
      .select()
      .single();

    if (insertAiError) {
      return NextResponse.json(
        { error: "AI応答の保存に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: savedReply });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "予期しないエラーが発生しました" },
      { status: 500 }
    );
  }
}
