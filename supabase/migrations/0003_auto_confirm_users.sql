-- Migration: auto-confirm existing users and auto-confirm future signups
-- WARNING: This will mark users as email_confirmed. Intended for dev/demo environments.

-- Confirm existing users (idempotent)
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;

-- NOTE: Creating functions/triggers in the `auth` schema requires elevated (service_role) privileges
-- and will often fail when executed from the SQL Editor as a non-admin role (permission denied).
-- If you want automatic confirmation on future signups, run the trigger/function creation below from a
-- privileged environment (Supabase CLI or psql using the service_role key) or implement a server-side
-- process that sets `email_confirmed_at` for new users.

/*
-- Privileged-only example (run with service_role privileges):
create or replace function auth.set_email_confirmed_before_insert()
returns trigger as $$
begin
  if new.email_confirmed_at is null then
    new.email_confirmed_at := now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_email_confirmed_before_insert on auth.users;
create trigger set_email_confirmed_before_insert
  before insert on auth.users
  for each row
  execute function auth.set_email_confirmed_before_insert();
*/
