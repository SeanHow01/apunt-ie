-- Migration: saved_loans table for loan calculator/comparison tool
-- Users can save loan calculations and reload them in the comparison tool.
-- amount stored in cents (bigint), APR stored in basis points (int) to avoid
-- floating-point precision issues.

create table public.saved_loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  label text not null,
  amount_cents bigint not null,
  term_months int not null,
  apr_bps int not null,
  lender_type text check (lender_type in ('credit_union','bank','hire_purchase','bnpl','other')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.saved_loans enable row level security;

create policy "read own saved loans" on public.saved_loans
  for select using (auth.uid() = user_id);
create policy "insert own saved loans" on public.saved_loans
  for insert with check (auth.uid() = user_id);
create policy "update own saved loans" on public.saved_loans
  for update using (auth.uid() = user_id);
create policy "delete own saved loans" on public.saved_loans
  for delete using (auth.uid() = user_id);

-- Reshuffle ordinals to make room for loans at position 3
update public.modules set ordinal = 4 where id = 'rent';
update public.modules set ordinal = 5 where id = 'help-to-buy';
update public.modules set ordinal = 6 where id = 'susi';
update public.modules set ordinal = 7 where id = 'investing';

-- Insert loans module at ordinal 3
insert into public.modules (id, ordinal, title, subtitle, duration_minutes, tag, steps_count)
values ('loans', 3, 'Before you sign', 'A plain guide to loans, borrowing, and what it really costs.', 7, 'essential', 8)
on conflict (id) do update set
  ordinal = excluded.ordinal,
  title = excluded.title,
  subtitle = excluded.subtitle,
  duration_minutes = excluded.duration_minutes,
  tag = excluded.tag,
  steps_count = excluded.steps_count;
