-- supabase/migrations/0013_saf_staff_users.sql

create table public.saf_staff_users (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  institution   text not null default 'SETU',
  role          text not null default 'committee' check (role in ('committee', 'admin')),
  display_name  text not null,
  created_at    timestamptz not null default now(),
  unique(user_id, institution)
);

alter table public.saf_staff_users enable row level security;

create policy "staff read own record"
  on public.saf_staff_users for select
  using (auth.uid() = user_id);

create policy "service role full access"
  on public.saf_staff_users for all
  using (auth.role() = 'service_role');
