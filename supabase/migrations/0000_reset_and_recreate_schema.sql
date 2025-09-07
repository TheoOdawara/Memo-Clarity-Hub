-- Reset and recreate minimal schema for MemoClarity MVP
-- WARNING: This will DROP the demo tables created by the previous migrations (test_attempts, test_actions, tests).
-- Make a backup before running if you care about existing data.

-- ---------------------------
-- Backup helper (run manually before executing main script)
-- ---------------------------
-- Example: export counts to verify content before drop
-- select 'test_attempts', count(*) from public.test_attempts;
-- select 'test_actions', count(*) from public.test_actions;

-- ---------------------------
-- DROP existing policies and tables (idempotent)
-- ---------------------------
-- Drop tables first (this removes dependent policies automatically) — safe if they don't exist
drop table if exists public.test_actions cascade;
drop table if exists public.test_attempts cascade;
drop table if exists public.tests cascade;

-- Note: we do NOT drop auth schema or other Supabase system objects.

-- ---------------------------
-- Recreate extension + tables + RLS + policies
-- ---------------------------

create extension if not exists "pgcrypto";

create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  test_id uuid references public.tests(id) on delete set null,
  seed text,
  client_score int,
  server_score int,
  status text default 'pending',
  meta jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.test_actions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.test_attempts(id) on delete cascade,
  action_order int not null,
  action_payload jsonb not null,
  created_at timestamptz default now()
);

alter table public.test_attempts enable row level security;
alter table public.test_actions enable row level security;

-- Policies (use auth.uid()::uuid to compare properly)
create policy "Insert own attempts" on public.test_attempts
  for insert
  with check (auth.role() = 'authenticated' AND auth.uid()::uuid = user_id);

create policy "Select own attempts" on public.test_attempts
  for select
  using (auth.role() = 'authenticated' AND auth.uid()::uuid = user_id);

create policy "Update own attempts" on public.test_attempts
  for update
  using (auth.role() = 'authenticated' AND auth.uid()::uuid = user_id)
  with check (auth.uid()::uuid = user_id);

create policy "Insert actions for own attempt" on public.test_actions
  for insert
  with check (auth.role() = 'authenticated' AND exists (select 1 from public.test_attempts t where t.id = attempt_id and t.user_id = auth.uid()::uuid));

create policy "Select actions for own attempt" on public.test_actions
  for select
  using (exists (select 1 from public.test_attempts t where t.id = attempt_id and t.user_id = auth.uid()::uuid));

-- Final verification queries (run after script to confirm)
-- select 'tables', table_name from information_schema.tables where table_schema='public' and table_name in ('tests','test_attempts','test_actions');
-- select * from pg_policies where tablename in ('test_attempts','test_actions');

-- End of reset+recreate script
