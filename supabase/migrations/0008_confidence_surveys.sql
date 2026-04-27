-- Migration 0008: Confidence surveys
-- Stores user self-reported confidence scores after completing a lesson module.
-- Score is 1–5 (1 = not at all confident, 5 = very confident).
-- One row per user per module (upsert on duplicate).

create table if not exists confidence_surveys (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  module_id     text not null,
  score         integer not null check (score between 1 and 5),
  submitted_at  timestamptz not null default now(),
  -- Allow re-submission (updating confidence after revisiting)
  unique (user_id, module_id)
);

-- Indexes
create index if not exists confidence_surveys_user_idx on confidence_surveys(user_id);

-- Row-level security
alter table confidence_surveys enable row level security;

-- Users can insert their own survey responses
create policy "Users can insert own confidence surveys"
  on confidence_surveys for insert
  with check (auth.uid() = user_id);

-- Users can update their own survey responses (re-submission)
create policy "Users can update own confidence surveys"
  on confidence_surveys for update
  using (auth.uid() = user_id);

-- Users can read their own survey responses
create policy "Users can read own confidence surveys"
  on confidence_surveys for select
  using (auth.uid() = user_id);
