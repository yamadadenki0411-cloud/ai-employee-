"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EMPLOYEE_TEMPLATES } from "@/lib/employeeTemplates";

export function HireEmployeeButton() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleHire(roleType: string) {
    setError(null);
    setLoading(roleType);

    const template = EMPLOYEE_TEMPLATES.find((t) => t.role_type === roleType);
    if (!template) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("ログイン情報を確認できませんでした");
      setLoading(null);
      return;
    }

    const { error: insertError } = await supabase.from("employees").insert({
      user_id: user.id,
      role_type: template.role_type,
      name: template.name,
      system_prompt: template.system_prompt,
      avatar_emoji: template.avatar_emoji,
    });

    setLoading(null);

    if (insertError) {
      setError("採用に失敗しました。時間をおいて再度お試しください。");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        + 採用する
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                AI社員を採用する
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {EMPLOYEE_TEMPLATES.map((t) => (
                <button
                  key={t.role_type}
                  onClick={() => handleHire(t.role_type)}
                  disabled={loading !== null}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-brand-500 disabled:opacity-50"
                >
                  <span className="text-2xl">{t.avatar_emoji}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-slate-900">
                      {t.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {t.description}
                    </span>
                  </span>
                  {loading === t.role_type && (
                    <span className="text-xs text-slate-400">採用中</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
