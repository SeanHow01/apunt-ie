-- Migration: add institution_name text column to profiles
--
-- The original schema has institution_id (UUID FK → institutions) which is
-- intended for a future proper lookup / SSO integration. For the MVP pilot
-- we collect the institution name as plain text on sign-up and in settings.
-- The UUID FK column is left in place — do not remove it. Once SSO or a
-- proper institution picker is built, populate institution_id from this value
-- and deprecate institution_name.

alter table public.profiles
  add column if not exists institution_name text;
