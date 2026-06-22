import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { getDemoReply } from "@/lib/demoResponses";

const DAILY_LIMIT = 5;

function getClientIp(request: NextRequest): string {
  // Vercel/多くのプロキシ環境ではx-forwarded-forの先頭がクライアントIP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "メッセージを入力してください" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const supabase = createServiceRoleClient();

    // 過去24時間の利用回数をチェック
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("demo_usage")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("used_at", since);

    if (countError) {
      console.error(countError);
      return NextResponse.json(
        { error: "デモの利用状況確認に失敗しました" },
        { status: 500 }
      );
    }

    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `デモ体験は1日${DAILY_LIMIT}回までです。続けて使うには無料登録してください。`,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    // 利用記録
    await supabase.from("demo_usage").insert({ ip_address: ip });

    // 固定応答を返す(OpenAI呼び出しなし、API費用ゼロ)
    const reply = getDemoReply(message);

    // 模擬的な「考えている感」を出すための遅延(UX向上、コストへの影響なし)
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      reply,
      remaining: DAILY_LIMIT - (count ?? 0) - 1,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "予期しないエラーが発生しました" },
      { status: 500 }
    );
  }
}