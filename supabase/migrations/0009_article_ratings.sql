-- Migration 0009: Article ratings (anonymous "Was this helpful?" feedback)
-- Anonymous session-based; session_id is a UUID stored in the reader's localStorage.
-- One rating per article per session (unique constraint).

create table if not exists article_ratings (
  id          uuid primary key default gen_random_uuid(),
  article_id  text not null,           -- article slug
  session_id  text not null,           -- anonymous session UUID from client localStorage
  helpful     boolean not null,
  rated_at    timestamptz not null default now(),
  unique (article_id, session_id)
);

-- Indexes
create index if not exists article_ratings_article_idx on article_ratings(article_id);

-- Row-level security — open to anonymous reads and inserts (no auth required)
alter table article_ratings enable row level security;

-- Anyone (including anon Supabase key) can insert a rating
create policy "Anyone can submit article ratings"
  on article_ratings for insert
  with check (true);

-- Anyone can read ratings (so we can show helpful counts publicly)
create policy "Anyone can read article ratings"
  on article_ratings for select
  using (true);
