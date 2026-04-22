-- Users are handled by Supabase auth.users; we add a profile table.

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  type text check (type in ('university','tu','college','private')),
  active boolean default true
);

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  first_name text,
  institution_id uuid references public.institutions(id),
  theme text default 'craic' check (theme in ('craic','punt','bob','ledger')),
  created_at timestamptz default now()
);

create table public.modules (
  id text primary key,
  ordinal int not null,
  title text not null,
  subtitle text,
  duration_minutes int not null,
  tag text,
  steps_count int not null
);

create table public.user_progress (
  user_id uuid references auth.users on delete cascade,
  module_id text references public.modules(id),
  current_step int default 0,
  completed boolean default false,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  primary key (user_id, module_id)
);

create table public.fireup_completions (
  user_id uuid primary key references auth.users on delete cascade,
  self_attested_at timestamptz,
  verified_at timestamptz,
  certificate_url text
);

-- RLS
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.fireup_completions enable row level security;
alter table public.institutions enable row level security;
alter table public.modules enable row level security;

create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "read own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "upsert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "update own progress" on public.user_progress for update using (auth.uid() = user_id);

create policy "read own fireup" on public.fireup_completions for select using (auth.uid() = user_id);
create policy "upsert own fireup" on public.fireup_completions for insert with check (auth.uid() = user_id);
create policy "update own fireup" on public.fireup_completions for update using (auth.uid() = user_id);

create policy "read institutions" on public.institutions for select using (true);
create policy "read modules" on public.modules for select using (true);

-- Seed institutions (Irish HEIs)
insert into public.institutions (name, short_name, type) values
  ('University College Dublin', 'UCD', 'university'),
  ('Trinity College Dublin', 'TCD', 'university'),
  ('University College Cork', 'UCC', 'university'),
  ('University of Galway', 'UoG', 'university'),
  ('Maynooth University', 'MU', 'university'),
  ('Dublin City University', 'DCU', 'university'),
  ('University of Limerick', 'UL', 'university'),
  ('Technological University Dublin', 'TU Dublin', 'tu'),
  ('Munster Technological University', 'MTU', 'tu'),
  ('Atlantic Technological University', 'ATU', 'tu'),
  ('South East Technological University', 'SETU', 'tu'),
  ('Technological University of the Shannon', 'TUS', 'tu');

-- Seed modules
insert into public.modules (id, ordinal, title, subtitle, duration_minutes, tag, steps_count) values
  ('payslip', 1, 'Your payslip, line by line', 'PAYE, USC, PRSI and what they pay for', 3, 'essential', 5),
  ('auto-enrolment', 2, 'The new pension, explained', 'Auto-enrolment and what it means for you', 4, 'new', 6),
  ('rent', 3, 'Rent, deposits and your rights', 'What a landlord can and cannot do', 5, 'popular', 5),
  ('help-to-buy', 4, 'Help-to-Buy, plainly', 'How the scheme actually works', 4, null, 4),
  ('susi', 5, 'SUSI grants, without the headache', 'Who qualifies and how to apply', 3, null, 4),
  ('investing', 6, 'Your first fifty euro invested', 'A calm introduction, no stock tips', 6, null, 5);
