-- supabase/migrations/0014_saf_applications.sql

create type public.saf_status as enum (
  'draft',
  'submitted',
  'under_review',
  'awaiting_info',
  'approved',
  'rejected'
);

create type public.saf_reason as enum (
  'loss_of_employment',
  'bereavement',
  'illness',
  'accommodation_costs',
  'family_income_drop',
  'course_costs',
  'lone_parent',
  'other'
);

create table public.saf_applications (
  id                    uuid primary key default gen_random_uuid(),
  reference_number      text unique not null,
  user_id               uuid not null references auth.users(id) on delete cascade,
  institution           text not null default 'SETU',
  campus                text,
  course                text,
  year_of_study         text,
  study_type            text check (study_type in ('full_time', 'part_time')),
  status                public.saf_status not null default 'draft',
  reason_category       public.saf_reason,
  reason_other          text,
  circumstances         text,
  amount_requested      numeric(10,2),
  amount_awarded        numeric(10,2),
  monthly_income        jsonb default '{}',
  monthly_expenses      jsonb default '{}',
  iban_encrypted        text,
  iban_last_four        text,
  bank_name             text,
  submitted_at          timestamptz,
  decided_at            timestamptz,
  decided_by            uuid references auth.users(id),
  info_requested_at     timestamptz,
  info_requested_note   text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger saf_applications_updated_at
  before update on public.saf_applications
  for each row execute function update_updated_at();

create sequence public.saf_reference_seq start 1;

create or replace function generate_saf_reference()
returns text language plpgsql as $$
begin
  return 'SAF-' || extract(year from now())::text || '-' ||
         lpad(nextval('public.saf_reference_seq')::text, 5, '0');
end;
$$;

alter table public.saf_applications enable row level security;

create policy "students own applications"
  on public.saf_applications for all
  using (auth.uid() = user_id);

create policy "staff read institution applications"
  on public.saf_applications for select
  using (
    exists (
      select 1 from public.saf_staff_users
      where user_id = auth.uid()
      and institution = saf_applications.institution
    )
  );

create policy "staff update applications"
  on public.saf_applications for update
  using (
    exists (
      select 1 from public.saf_staff_users
      where user_id = auth.uid()
      and institution = saf_applications.institution
    )
  )
  with check (
    exists (
      select 1 from public.saf_staff_users
      where user_id = auth.uid()
      and institution = saf_applications.institution
    )
  );
