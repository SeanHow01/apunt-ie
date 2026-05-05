-- supabase/migrations/0015_saf_documents.sql

create type public.document_type as enum (
  'bank_statement',
  'susi_letter',
  'evidence_of_difficulty',
  'receipt_invoice',
  'other'
);

create type public.scan_status as enum (
  'pending',
  'scanning',
  'clean',
  'rejected',
  'error'
);

create table public.saf_documents (
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

alter table public.saf_documents enable row level security;

create policy "students manage own documents"
  on public.saf_documents for all
  using (
    exists (
      select 1 from public.saf_applications
      where id = saf_documents.application_id
      and user_id = auth.uid()
    )
  );

create policy "staff read institution documents"
  on public.saf_documents for select
  using (
    exists (
      select 1 from public.saf_applications a
      join public.saf_staff_users s on s.institution = a.institution
      where a.id = saf_documents.application_id
      and s.user_id = auth.uid()
    )
  );
