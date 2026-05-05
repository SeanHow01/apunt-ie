-- setu-schema-combined.sql
-- Idempotent — safe to run even if partially applied.
-- Paste entire file into Supabase SQL Editor and run.

-- ── Types ────────────────────────────────────────────────────────────────────

do $$ begin
  create type public.saf_status as enum (
    'draft', 'submitted', 'under_review', 'awaiting_info', 'approved', 'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.saf_reason as enum (
    'loss_of_employment', 'bereavement', 'illness', 'accommodation_costs',
    'family_income_drop', 'course_costs', 'lone_parent', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_type as enum (
    'bank_statement', 'susi_letter', 'evidence_of_difficulty', 'receipt_invoice', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.scan_status as enum (
    'pending', 'scanning', 'clean', 'rejected', 'error'
  );
exception when duplicate_object then null; end $$;

-- ── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.saf_staff_users (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  institution   text not null default 'SETU',
  role          text not null default 'committee' check (role in ('committee', 'admin')),
  display_name  text not null,
  created_at    timestamptz not null default now(),
  unique(user_id, institution)
);

create table if not exists public.saf_applications (
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

create table if not exists public.saf_documents (
  id                    uuid primary key default gen_random_uuid(),
  application_id        uuid not null references public.saf_applications(id) on delete cascade,
  document_type         public.document_type not null,
  file_name             text not null,
  file_path             text not null,
  file_size             bigint not null,
  mime_type             text not null,
  scan_status           public.scan_status not null default 'pending',
  scan_completed_at     timestamptz,
  uploaded_at           timestamptz not null default now()
);

create table if not exists public.saf_staff_notes (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.saf_applications(id) on delete cascade,
  staff_user_id   uuid not null references auth.users(id),
  note            text not null,
  created_at      timestamptz not null default now()
);

create table if not exists public.saf_audit_log (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.saf_applications(id),
  actor_id        uuid references auth.users(id),
  actor_type      text not null check (actor_type in ('student', 'staff', 'system')),
  action          text not null,
  from_status     text,
  to_status       text,
  metadata        jsonb default '{}',
  created_at      timestamptz not null default now()
);

-- ── Functions & triggers ─────────────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists saf_applications_updated_at on public.saf_applications;
create trigger saf_applications_updated_at
  before update on public.saf_applications
  for each row execute function update_updated_at();

create sequence if not exists public.saf_reference_seq start 1;

create or replace function generate_saf_reference()
returns text language plpgsql as $$
begin
  return 'SAF-' || extract(year from now())::text || '-' ||
         lpad(nextval('public.saf_reference_seq')::text, 5, '0');
end;
$$;

-- ── RLS ──────────────────────────────────────────────────────────────────────

alter table public.saf_staff_users  enable row level security;
alter table public.saf_applications enable row level security;
alter table public.saf_documents    enable row level security;
alter table public.saf_staff_notes  enable row level security;
alter table public.saf_audit_log    enable row level security;

-- saf_staff_users
drop policy if exists "staff read own record"     on public.saf_staff_users;
drop policy if exists "service role full access"  on public.saf_staff_users;
create policy "staff read own record"    on public.saf_staff_users for select using (auth.uid() = user_id);
create policy "service role full access" on public.saf_staff_users for all    using (auth.role() = 'service_role');

-- saf_applications
drop policy if exists "students own applications"          on public.saf_applications;
drop policy if exists "staff read institution applications" on public.saf_applications;
drop policy if exists "staff update applications"          on public.saf_applications;
create policy "students own applications"
  on public.saf_applications for all using (auth.uid() = user_id);
create policy "staff read institution applications"
  on public.saf_applications for select
  using (exists (select 1 from public.saf_staff_users where user_id = auth.uid() and institution = saf_applications.institution));
create policy "staff update applications"
  on public.saf_applications for update
  using (exists (select 1 from public.saf_staff_users where user_id = auth.uid() and institution = saf_applications.institution))
  with check (exists (select 1 from public.saf_staff_users where user_id = auth.uid() and institution = saf_applications.institution));

-- saf_documents
drop policy if exists "students manage own documents"   on public.saf_documents;
drop policy if exists "staff read institution documents" on public.saf_documents;
create policy "students manage own documents"
  on public.saf_documents for all
  using (exists (select 1 from public.saf_applications where id = saf_documents.application_id and user_id = auth.uid()));
create policy "staff read institution documents"
  on public.saf_documents for select
  using (exists (
    select 1 from public.saf_applications a
    join public.saf_staff_users s on s.institution = a.institution
    where a.id = saf_documents.application_id and s.user_id = auth.uid()
  ));

-- saf_staff_notes
drop policy if exists "staff manage notes" on public.saf_staff_notes;
create policy "staff manage notes"
  on public.saf_staff_notes for all
  using (exists (
    select 1 from public.saf_applications a
    join public.saf_staff_users s on s.institution = a.institution
    where a.id = saf_staff_notes.application_id and s.user_id = auth.uid()
  ));

-- saf_audit_log
drop policy if exists "students read own audit log"     on public.saf_audit_log;
drop policy if exists "staff read institution audit log" on public.saf_audit_log;
drop policy if exists "insert audit log"                on public.saf_audit_log;
create policy "students read own audit log"
  on public.saf_audit_log for select
  using (exists (select 1 from public.saf_applications where id = saf_audit_log.application_id and user_id = auth.uid()));
create policy "staff read institution audit log"
  on public.saf_audit_log for select
  using (exists (
    select 1 from public.saf_applications a
    join public.saf_staff_users s on s.institution = a.institution
    where a.id = saf_audit_log.application_id and s.user_id = auth.uid()
  ));
create policy "insert audit log" on public.saf_audit_log for insert with check (true);

-- ── Storage ──────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'saf-documents', 'saf-documents', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "students upload own documents" on storage.objects;
drop policy if exists "students read own documents"   on storage.objects;
drop policy if exists "staff read saf documents"      on storage.objects;

create policy "students upload own documents"
  on storage.objects for insert
  with check (bucket_id = 'saf-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "students read own documents"
  on storage.objects for select
  using (bucket_id = 'saf-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "staff read saf documents"
  on storage.objects for select
  using (bucket_id = 'saf-documents' and exists (select 1 from public.saf_staff_users where user_id = auth.uid()));
