"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";

export function SettingsForm({
  profile,
  email,
}: {
  profile: UserProfile | null;
  email: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [apiKey, setApiKey] = useState(profile?.openai_api_key ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("ログイン情報を確認できませんでした");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        display_name: displayName,
        openai_api_key: apiKey,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      setError("保存に失敗しました。時間をおいて再度お試しください。");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="mt-8 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">アカウント情報</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              表示名
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">OpenAI APIキー</h2>
        <p className="mt-1 text-sm text-slate-500">
          AI社員はこのAPIキーを使って応答します。料金はOpenAIから直接ご自身に請求されます。
        </p>

        <div className="mt-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            autoComplete="off"
          />
          <p className="mt-2 text-xs text-slate-400">
            APIキーは
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-brand-600 underline"
            >
              OpenAIのAPIキー管理ページ
            </a>
            から発行できます。
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          保存しました
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存する"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-slate-400 hover:text-red-500"
        >
          ログアウト
        </button>
      </div>
    </form>
  );
}