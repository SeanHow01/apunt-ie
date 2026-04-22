# Punt

**Your money, explained properly.**

A financial literacy web app for Irish university students. Built for a pilot with two universities, to be demonstrated to the HEA, Department of Finance, and MABS.

---

## Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS v4** (`@theme inline` configuration)
- **Supabase** (`@supabase/ssr`) — auth, Postgres, RLS
- **Zod** — form validation
- **Lucide React** — icons
- **pnpm** — package manager

---

## Setup

### 1. Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Supabase CLI (`npm install -g supabase`) — for local development
- A Supabase project (cloud or local)

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase dashboard under **Project Settings → API**.

### 4. Run the database migration

**Cloud (recommended for the pilot):**

1. Go to your Supabase dashboard → SQL Editor
2. Paste the contents of `supabase/migrations/0001_init.sql`
3. Run it

**Local Supabase:**

```bash
supabase start
supabase db reset
```

This runs the migration and seeds the institutions and modules.

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase schema overview

| Table | Purpose |
|---|---|
| `profiles` | User first name, institution, theme preference |
| `institutions` | Seeded list of Irish HEIs (12 institutions) |
| `modules` | Lesson metadata (6 modules seeded) |
| `user_progress` | Per-user step progress and completion |
| `fireup_completions` | Self-attested FiRe Up course completion |

All tables have Row Level Security enabled. Users can only read and write their own rows.

---

## Adding a new lesson module

1. **Create the content file**

   Add `content/modules/your-module-id.ts` following the pattern in `content/types.ts`:

   ```ts
   import type { Module } from '@/content/types';

   const yourModule: Module = {
     id: 'your-module-id',
     title: 'Your module title',
     subtitle: 'A short subtitle',
     durationMinutes: 4,
     steps: [
       {
         id: 'step-1',
         label: 'Step one',
         body: 'Plain, warm, second-person prose.',
       },
     ],
     closingLine: 'A calm closing line shown on the completion screen.',
   };

   export default yourModule;
   ```

2. **Register it in the index**

   Edit `content/modules/index.ts` — import the new module and add it to the `modules` array.

3. **Add a row in the `modules` table**

   ```sql
   insert into public.modules (id, ordinal, title, subtitle, duration_minutes, tag, steps_count)
   values ('your-module-id', 7, 'Your module title', 'A short subtitle', 4, null, 3);
   ```

   The `ordinal` controls display order on the home screen.

That's it. No other changes needed — the lesson page (`/lessons/[id]`) loads content dynamically from the registry.

---

## Theming system

See [docs/themes.md](docs/themes.md) for a full explanation of the theme architecture and how to add a fifth theme.

---

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon (public) key |

---

## For a university running this live

To deploy for a university cohort:

1. Create a Supabase project
2. Run `supabase/migrations/0001_init.sql` in the SQL editor
3. Set the two env vars above in your Vercel project settings
4. Deploy to Vercel (`vercel deploy`)
5. Share the URL with students — they self-register with their university email

No further configuration is required. Each user's data is isolated by Row Level Security.

---

## Deployment

```bash
pnpm build
```

Deploy to Vercel by connecting the GitHub repository. Build command: `pnpm build`, output directory: `.next`.
