-- 0004_news.sql
-- Adds news/CMS tables: articles, article_versions
-- Also adds role column to profiles for admin gating.
--
-- After running this migration, assign yourself admin role:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'YOUR_EMAIL');

-- Add admin role flag to profiles
alter table public.profiles add column if not exists role text default 'user' check (role in ('user', 'admin'));

-- Articles table
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  content_md text not null,
  category text not null check (category in ('banking', 'pensions', 'tax', 'housing', 'investing', 'benefits', 'general')),
  article_type text not null check (article_type in ('news', 'explainer', 'news_and_explainer')),
  related_module_ids text[] default '{}',
  sources jsonb default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'published', 'archived')),
  reading_minutes int default 3,
  published_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index articles_status_published_at on public.articles (status, published_at desc);
create index articles_slug on public.articles (slug);
create index articles_category on public.articles (category);

-- Article version history
create table public.article_versions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles on delete cascade,
  version_number int not null,
  title text not null,
  summary text not null,
  content_md text not null,
  source_type text not null check (source_type in ('manual_draft', 'manual_edit', 'ai_draft', 'published')),
  ai_source_input text,
  edited_by uuid references auth.users,
  created_at timestamptz default now()
);

create index article_versions_article_id on public.article_versions (article_id, version_number);

-- RLS
alter table public.articles enable row level security;
alter table public.article_versions enable row level security;

create policy "published articles are public" on public.articles
  for select using (status = 'published');

create policy "admins can read all articles" on public.articles
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "admins can insert articles" on public.articles
  for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "admins can update articles" on public.articles
  for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "admins can delete articles" on public.articles
  for delete using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "admins can access versions" on public.article_versions
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
