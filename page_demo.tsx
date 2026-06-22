import Link from "next/link";
import { DemoChatWindow } from "@/components/DemoChatWindow";

export const metadata = {
  title: "営業AIを無料体験 | AI社員",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <span className="font-bold text-slate-900">AI社員</span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            無料登録
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="text-center">
          <p className="inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
            ログイン不要・1日5回まで無料体験
          </p>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            営業AIに今すぐ仕事を頼んでみる
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            実際の操作感をそのまま体験できます。会員登録すれば、マーケAI・開発AIなど10種類のAI社員が使い放題になります。
          </p>
        </div>

        <div className="mt-8" style={{ height: 560 }}>
          <DemoChatWindow />
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <p className="font-semibold text-slate-900">
            気に入ったら無料登録してすべての機能を使いましょう
          </p>
          <p className="mt-1 text-sm text-slate-500">
            営業AI・マーケAI・開発AIなど10種類のAI社員を雇用できます
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-xl bg-brand-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            無料で始める
          </Link>
        </div>
      </div>
    </main>
  );
}
