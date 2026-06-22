import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { EmployeeCard } from "@/components/EmployeeCard";
import { Employee, UserProfile } from "@/types";
import { HireEmployeeButton } from "./HireEmployeeButton";

export default async function DashboardPage() {
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

  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Employee[]>();

  const hasApiKey = !!profile?.openai_api_key;

  return (
    <main className="min-h-screen bg-slate-50">
      <Header displayName={profile?.display_name} />

      <div className="mx-auto max-w-6xl px-6 py-10">
        {!hasApiKey && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            ⚠️ OpenAI APIキーが未設定です。AI社員とチャットするには
            <a href="/settings" className="mx-1 font-medium underline">
              設定ページ
            </a>
            でAPIキーを登録してください。
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              雇用中のAI社員
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {employees?.length ?? 0}名のAI社員が在籍しています
            </p>
          </div>
          <HireEmployeeButton />
        </div>

        {employees && employees.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {employees.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <p className="text-4xl">🏢</p>
            <p className="mt-4 font-medium text-slate-700">
              まだAI社員を雇用していません
            </p>
            <p className="mt-1 text-sm text-slate-500">
              右上の「採用する」からAI社員を雇いましょう
            </p>
          </div>
        )}
      </div>
    </main>
  );
}