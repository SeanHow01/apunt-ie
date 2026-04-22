create table public.saved_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  gross_annual_cents bigint not null,
  net_annual_cents bigint not null,
  tax_year text not null,
  calculation_type text not null check (calculation_type in ('take_home', 'loan')),
  label text,
  created_at timestamptz default now()
);

create index saved_calculations_user_id_type_created on public.saved_calculations (user_id, calculation_type, created_at desc);

alter table public.saved_calculations enable row level security;

create policy "read own saved calculations" on public.saved_calculations for select using (auth.uid() = user_id);
create policy "insert own saved calculations" on public.saved_calculations for insert with check (auth.uid() = user_id);
create policy "update own saved calculations" on public.saved_calculations for update using (auth.uid() = user_id);
create policy "delete own saved calculations" on public.saved_calculations for delete using (auth.uid() = user_id);
