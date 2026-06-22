import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * service roleキーを使うクライアント。RLSを完全にバイパスする。
 * 用途を限定すること(例: demo_usageのIPレート制限記録のみ)。
 * 絶対にブラウザへ露出させないこと(SUPABASE_SERVICE_ROLE_KEYはサーバー専用環境変数)。
 */
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
