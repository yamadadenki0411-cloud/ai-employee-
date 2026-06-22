-- ============================================
-- AI社員 MVP データベーススキーマ
-- Supabase SQL Editorで実行してください
-- ============================================

-- 1. users (Supabase Authのauth.usersと1:1で紐づくプロフィール)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  plan text default 'free',           -- free, pro, business
  openai_api_key text,                -- ユーザー自身のOpenAI APIキー(MVPは平文。本番化前に暗号化必須)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. employees (雇用したAI社員)
-- role_typeは10種類まで拡張可能な設計。種類を増やす場合はCHECK制約に追加するだけでよい。
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  role_type text not null check (role_type in (
    'sales',        -- 営業AI
    'marketing',    -- マーケAI
    'engineer',     -- 開発AI
    'cs',           -- カスタマーサポートAI
    'hr',           -- 人事AI
    'finance',      -- 経理AI
    'legal',        -- 法務AI
    'designer',     -- デザインAI
    'writer',       -- ライターAI
    'secretary'     -- 秘書AI
  )),
  name text not null,
  system_prompt text not null,
  avatar_emoji text default '🤖',
  status text default 'active' check (status in ('active', 'paused')),
  created_at timestamptz default now()
);

-- 3. chats (チャットメッセージ履歴)
create table public.chats (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- インデックス(チャット履歴取得のパフォーマンス対策)
create index idx_employees_user_id on public.employees(user_id);
create index idx_chats_employee_id_created_at on public.chats(employee_id, created_at);

-- 4. demo_usage (ログイン不要デモのIP単位レート制限記録)
-- RLS対象外(サーバーのservice roleからのみ書き込む想定。クライアント直アクセス不可)
create table public.demo_usage (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  used_at timestamptz default now()
);

create index idx_demo_usage_ip_used_at on public.demo_usage(ip_address, used_at);

-- demo_usageはservice role経由のみ操作する前提でRLSを有効化し、ポリシーは作らない(=完全拒否)
alter table public.demo_usage enable row level security;

-- ============================================
-- RLS(Row Level Security) — 必須。他人のデータが見えるのを防ぐ
-- ============================================
alter table public.users enable row level security;
alter table public.employees enable row level security;
alter table public.chats enable row level security;

create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);
create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

create policy "employees_all_own" on public.employees
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "chats_all_own" on public.chats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================
-- 新規ユーザー登録時にusersテーブルへ自動でプロフィール作成
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
