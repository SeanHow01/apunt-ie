-- Migration 0012: Drop theme column from profiles
-- The multi-theme system has been removed. Punt uses a single brand identity.
-- The theme column is no longer read or written by the application.

alter table public.profiles
  drop column if exists theme;
