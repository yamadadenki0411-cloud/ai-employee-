import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatMessage, Employee, UserProfile } from "@/types";

export default async function EmployeeChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single<UserProfile>();

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single<Employee>();

  if (!employee) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("chats")
    .select("*")
    .eq("employee_id", id)
    .order("created_at", { ascending: true })
    .returns<ChatMessage[]>();

  return (
    <main className="flex h-screen flex-col bg-slate-50">
      <Header displayName={profile?.display_name} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              ← 一覧
            </Link>
            <span className="text-2xl">{employee.avatar_emoji}</span>
            <div>
              <p className="font-semibold text-slate-900">{employee.name}</p>
              <p className="text-xs text-slate-400">
                {employee.status === "active" ? "稼働中" : "停止中"}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-1 overflow-hidden">
          <ChatWindow employee={employee} initialMessages={messages ?? []} />
        </div>
      </div>
    </main>
  );
}
