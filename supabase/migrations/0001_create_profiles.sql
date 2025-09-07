-- Migration: create profiles table + updated_at trigger + RLS
-- Idempotent: safe to re-run in Supabase SQL editor

create table if not exists public.profiles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null unique,
  username text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- Trigger function to update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Enable RLS and create minimal policies
alter table public.profiles enable row level security;

drop policy if exists "Select own profile" on public.profiles;
create policy "Select own profile" on public.profiles
  for select
  using (auth.uid()::uuid = user_id);

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile" on public.profiles
  for update
  using (auth.uid()::uuid = user_id)
  with check (auth.uid()::uuid = user_id);

drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile" on public.profiles
  for insert
  with check (auth.uid()::uuid = user_id);

-- Notes:
-- - The service_role key bypasses RLS; server-side processes can write without extra policies.
-- - If you prefer the frontend to never insert profiles, tighten the INSERT policy to allow only server-side inserts.
