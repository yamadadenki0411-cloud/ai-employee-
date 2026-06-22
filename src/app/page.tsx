import Link from "next/link";

const FEATURED_ROLES = [
  {
    emoji: "💼",
    name: "営業AI",
    tagline: "商談・提案の手を止めない",
    tasks: [
      "営業メール・提案文の作成",
      "価格交渉時の切り返しトーク",
      "見込み顧客への優先順位付け",
    ],
  },
  {
    emoji: "📈",
    name: "マーケAI",
    tagline: "集客の打ち手を切らさない",
    tasks: [
      "SNS投稿文・広告コピーの作成",
      "SEO記事の構成案・タイトル案",
      "集客施策の壁打ち相手",
    ],
  },
  {
    emoji: "💻",
    name: "開発AI",
    tagline: "実装と判断のボトルネックを解消",
    tasks: [
      "コードの実装・レビュー",
      "バグ調査・原因の切り分け",
      "技術選定の相談",
    ],
  },
];

const OTHER_ROLES = [
  { emoji: "🎧", name: "CS AI" },
  { emoji: "🧑‍💼", name: "人事AI" },
  { emoji: "🧮", name: "経理AI" },
  { emoji: "⚖️", name: "法務AI" },
  { emoji: "🎨", name: "デザインAI" },
  { emoji: "✍️", name: "ライターAI" },
  { emoji: "🗂️", name: "秘書AI" },
];

export default function Home() {
  return (
    <main>
      {/* ヘッダー */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <span className="font-bold text-slate-900">AI社員</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/demo" className="text-slate-600 hover:text-slate-900">
              無料体験
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
            >
              無料で始める
            </Link>
          </nav>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-700">
            チャットで仕事を依頼できるAIチーム
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            採用面接も研修も不要。
            <br />
            今すぐ働けるAI社員を雇おう
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-slate-600">
            営業・マーケ・開発など10種類のAI社員に、チャットで仕事を依頼するだけ。
            24時間いつでも、追加採用コストなしで人手不足を解消します。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/demo"
              className="w-full rounded-xl border border-brand-600 px-8 py-3 text-center font-medium text-brand-600 transition hover:bg-brand-50 sm:w-auto"
            >
              ログイン不要で体験する
            </Link>
            <Link
              href="/login"
              className="w-full rounded-xl bg-brand-600 px-8 py-3 text-center font-medium text-white transition hover:bg-brand-700 sm:w-auto"
            >
              無料で始める
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            クレジットカード登録不要・1分で開始できます
          </p>
        </div>
      </section>

      {/* AI社員とは */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              AI社員とは何か
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              「AI社員」は、職種ごとに最適化されたAIに、人間の社員と同じようにチャットで仕事を依頼できるサービスです。
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              採用や教育にかかる時間とコストをかけずに、営業資料の作成、SNS運用、コードレビューといった実務をその場で任せられます。雇用関係の縛りもなく、必要に応じて随時AI社員を追加・削除できます。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">こんな課題に</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>・営業資料や返信文を作る時間がない</li>
              <li>・SNS運用を任せられる人がいない</li>
              <li>・ちょっとしたコード相談をする相手がいない</li>
              <li>・専門人材を雇うほどではないが手が足りない</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3職種詳細 */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            すぐに任せられるAI社員
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            まずはこの3名から。営業AIは無料体験も可能です。
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FEATURED_ROLES.map((role) => (
              <div
                key={role.name}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl">
                    {role.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {role.name}
                    </h3>
                    <p className="text-xs text-slate-400">{role.tagline}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                  {role.tasks.map((task) => (
                    <li key={task}>・{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 残り7種類 */}
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="text-center text-sm font-medium text-slate-500">
              他にも7種類のAI社員が在籍中
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {OTHER_ROLES.map((role) => (
                <span
                  key={role.name}
                  className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600"
                >
                  <span>{role.emoji}</span>
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* デモCTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          まずは営業AIを試してみませんか
        </h2>
        <p className="mt-3 text-slate-600">
          ログイン不要、1日5回まで無料。営業メールや提案書のたたき台をその場で作成します。
        </p>
        <Link
          href="/demo"
          className="mt-8 inline-block rounded-xl bg-brand-600 px-10 py-3.5 font-medium text-white transition hover:bg-brand-700"
        >
          今すぐ無料体験する
        </Link>
      </section>

      {/* 最終CTA */}
      <section className="bg-brand-600 py-16 text-center text-white">
        <h2 className="text-2xl font-bold">
          無料登録で、すべてのAI社員を雇用しよう
        </h2>
        <p className="mt-2 text-brand-50">
          クレジットカード登録不要・1分で開始できます
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-white px-10 py-3.5 font-medium text-brand-600 transition hover:bg-brand-50"
        >
          無料で始める
        </Link>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © 2026 AI社員
      </footer>
    </main>
  );
}