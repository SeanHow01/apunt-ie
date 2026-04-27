-- Migration 0010: Add cohort_id to profiles
-- Tracks which /join/[institution] URL the user arrived from.
-- Populated at sign-up if a cohort query param is present.
-- Used for institutional reporting and personalised content.

alter table public.profiles
  add column if not exists cohort_id text;

-- Index for cohort-level queries (e.g. admin dashboard by institution)
create index if not exists profiles_cohort_idx on public.profiles(cohort_id)
  where cohort_id is not null;
