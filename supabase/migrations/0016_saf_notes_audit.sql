-- supabase/migrations/0016_saf_notes_audit.sql

create table public.saf_staff_notes (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.saf_applications(id) on delete cascade,
  staff_user_id   uuid not null references auth.users(id),
  note            text not null,
  created_at      timestamptz not null default now()
);

alter table public.saf_staff_notes enable row level security;

create policy "staff manage notes"
  on public.saf_staff_notes for all
  using (
    exists (
      select 1 from public.saf_applications a
      join public.saf_staff_users s on s.institution = a.institution
      where a.id = saf_staff_notes.application_id
      and s.user_id = auth.uid()
    )
  );

create table public.saf_audit_log (
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

alter table public.saf_audit_log enable row level security;

create policy "students read own audit log"
  on public.saf_audit_log for select
  using (
    exists (
      select 1 from public.saf_applications
      where id = saf_audit_log.application_id
      and user_id = auth.uid()
    )
  );

create policy "staff read institution audit log"
  on public.saf_audit_log for select
  using (
    exists (
      select 1 from public.saf_applications a
      join public.saf_staff_users s on s.institution = a.institution
      where a.id = saf_audit_log.application_id
      and s.user_id = auth.uid()
    )
  );

create policy "insert audit log"
  on public.saf_audit_log for insert
  with check (true);
