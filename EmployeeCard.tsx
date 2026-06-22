import Link from "next/link";
import { Employee } from "@/types";

const ROLE_LABEL: Record<string, string> = {
  sales: "営業",
  marketing: "マーケティング",
  engineer: "開発",
  cs: "カスタマーサポート",
  hr: "人事",
  finance: "経理",
  legal: "法務",
  designer: "デザイン",
  writer: "ライター",
  secretary: "秘書",
};

export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Link
      href={`/employee/${employee.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl">
          {employee.avatar_emoji}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{employee.name}</p>
          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {ROLE_LABEL[employee.role_type] ?? employee.role_type}
          </span>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-slate-500">
        {employee.system_prompt.split("\n")[0]}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <span
          className={`text-xs ${
            employee.status === "active" ? "text-green-600" : "text-slate-400"
          }`}
        >
          ● {employee.status === "active" ? "稼働中" : "停止中"}
        </span>
        <span className="text-sm font-medium text-brand-600 group-hover:underline">
          チャットを開く →
        </span>
      </div>
    </Link>
  );
}
