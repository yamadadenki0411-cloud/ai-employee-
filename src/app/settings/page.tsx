import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { UserProfile } from "@/types";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
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

  return (
    <main className="min-h-screen bg-slate-50">
      <Header displayName={profile?.display_name} />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900">設定</h1>
        <p className="mt-1 text-sm text-slate-500">
          アカウント情報とOpenAI APIキーを管理します
        </p>

        <SettingsForm profile={profile} email={user.email ?? ""} />
      </div>
    </main>
  );
}
