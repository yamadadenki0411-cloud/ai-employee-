import Link from "next/link";

export function Header({ displayName }: { displayName?: string | null }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🏢</span>
          <span className="font-bold text-slate-900">AI社員</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
            ダッシュボード
          </Link>
          <Link href="/settings" className="text-slate-600 hover:text-slate-900">
            設定
          </Link>
          {displayName && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              {displayName}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
