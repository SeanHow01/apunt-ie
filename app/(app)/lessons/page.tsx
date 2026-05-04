import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/layout/AppShell';
import { Masthead } from '@/components/layout/Masthead';
import { ArticleList } from '@/components/home/ArticleList';
import { Rule } from '@/components/ui/Rule';
import { getGreeting } from '@/lib/copy';
import { modules } from '@/content/modules/index';

export const dynamic = 'force-dynamic';

export default async function LessonsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user!.id)
    .single();

  const { data: progressRows } = await supabase
    .from('user_progress')
    .select('module_id, current_step, completed')
    .eq('user_id', user!.id);

  const progressMap = new Map(
    (progressRows ?? []).map((row) => [
      row.module_id,
      { currentStep: row.current_step ?? 0, completed: row.completed ?? false },
    ])
  );

  const greeting = getGreeting(profile?.first_name ?? null);

  const moduleItems = modules.map((mod, idx) => {
    const prog = progressMap.get(mod.id) ?? null;
    return {
      id: mod.id,
      ordinal: idx + 1,
      title: mod.title,
      subtitle: mod.subtitle,
      durationMinutes: mod.durationMinutes,
      tag: null as string | null,
      progress: prog,
    };
  });

  return (
    <AppShell>
      <Masthead greeting={greeting} />

      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 md:py-10">
        {/* Header */}
        <header className="mb-6">
          <h1
            className="font-display text-4xl sm:text-5xl leading-tight mb-2"
            style={{
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
            }}
          >
            All lessons
          </h1>
          <p className="font-sans text-base" style={{ color: 'var(--ink-2)' }}>
            Eight modules on the financial basics every Irish student should know.
          </p>
        </header>

        <Rule className="mb-6" />

        <ArticleList modules={moduleItems} />
      </div>
    </AppShell>
  );
}
