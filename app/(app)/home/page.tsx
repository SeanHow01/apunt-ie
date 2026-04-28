import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Masthead } from '@/components/layout/Masthead';
import { ContinueCard } from '@/components/home/ContinueCard';
import { ArticleList } from '@/components/home/ArticleList';
import { ToolCard } from '@/components/home/ToolCard';
import { MonthlyActionsTile } from '@/components/home/MonthlyActionsTile';
import { ModuleProgressBar } from '@/components/home/ModuleProgressBar';
import { getGreeting, partnerLine } from '@/lib/copy';
import { modules } from '@/content/modules/index';
import HomeFireUpAttest from './HomeFireUpAttest';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, theme')
    .eq('id', user.id)
    .single();

  // Fetch all progress rows for this user
  const { data: progressRows } = await supabase
    .from('user_progress')
    .select('module_id, current_step, completed, completed_at')
    .eq('user_id', user.id);

  // Fetch FiRe Up completion
  const { data: fireupRow } = await supabase
    .from('fireup_completions')
    .select('self_attested_at')
    .eq('user_id', user.id)
    .maybeSingle();

  // Fetch 3 most recent published articles for "This week" card
  const { data: thisWeekArticles } = await supabase
    .from('articles')
    .select('id, slug, title, category, reading_minutes, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  // Build a map of progress by module id
  const progressMap = new Map(
    (progressRows ?? []).map((row) => [
      row.module_id,
      { currentStep: row.current_step ?? 0, completed: row.completed ?? false },
    ])
  );

  // Determine in-progress module: has started but not completed
  const inProgressProgress = (progressRows ?? []).find(
    (row) => !row.completed && (row.current_step ?? 0) > 0
  );
  const inProgressModule = inProgressProgress
    ? modules.find((m) => m.id === inProgressProgress.module_id) ?? null
    : null;

  const greeting = getGreeting(profile?.first_name ?? null);

  // Shape segments for the progress bar
  const progressSegments = modules.map((mod) => {
    const prog = progressMap.get(mod.id);
    return {
      id: mod.id,
      title: mod.title,
      completed: prog?.completed ?? false,
      inProgress: !prog?.completed && (prog?.currentStep ?? 0) > 0,
    };
  });

  // Shape module list for ArticleList
  const moduleItems = modules.map((mod, idx) => {
    const prog = progressMap.get(mod.id) ?? null;
    return {
      id: mod.id,
      ordinal: idx + 1,
      title: mod.title,
      subtitle: mod.subtitle,
      durationMinutes: mod.durationMinutes,
      tag: null,
      progress: prog,
    };
  });

  const fireupCompleted = !!fireupRow;
  const fireupCompletedAt = fireupRow?.self_attested_at ?? null;

  return (
    <AppShell>
      <Masthead greeting={greeting} />

      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 md:py-10">
        {/*
         * Layout — mobile: flex-col, sections stack in DOM order.
         * Desktop (lg+): 3-column CSS grid, DOM order matches visual order
         * so no lg:order-* overrides are needed.
         *
         * DOM / visual order (both mobile and desktop):
         *   1. Hero "Start here" card  — full width (col-span-3)
         *   2. FiRe Up card            — full width (col-span-3), horizontal on lg+
         *   3. This week               — full width (col-span-3)
         *   4. Curriculum list         — left 2/3   (col-span-2)
         *   5. Tool cards              — right 1/3  (col-span-1)
         *   6. Footer                  — full width (col-span-3)
         */}
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8 lg:gap-y-10">

          {/* 1. Hero ContinueCard — full width */}
          <section className="lg:col-span-3">
            <ContinueCard
              moduleTitle={inProgressModule?.title ?? null}
              moduleId={inProgressModule?.id ?? null}
              currentStep={inProgressProgress?.current_step ?? 0}
              totalSteps={inProgressModule?.steps.length ?? 0}
            />
          </section>

          {/* 2. FiRe Up — full width, horizontal layout on desktop */}
          <section className="lg:col-span-3">
            <HomeFireUpAttest
              userId={user.id}
              completed={fireupCompleted}
              completedAt={fireupCompletedAt}
            />
          </section>

          {/* 3. Monthly actions — full width */}
          <section className="lg:col-span-3">
            <MonthlyActionsTile />
          </section>

          {/* 4. This week — full width */}
          {thisWeekArticles && thisWeekArticles.length > 0 && (
            <section className="lg:col-span-3">
              <h2
                className="font-display text-xl sm:text-2xl mb-4 leading-tight"
                style={{
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                  fontFamily: 'Instrument Serif, serif',
                }}
              >
                This week
              </h2>
              <div
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                {thisWeekArticles.map((article, idx) => (
                  <a
                    key={article.id}
                    href={`/news/${article.slug}`}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      borderTop: idx > 0 ? '1px solid var(--rule)' : 'none',
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.5rem',
                        marginBottom: '0.125rem',
                      }}
                    >
                      {article.category && (
                        <span
                          className="font-sans uppercase"
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            color: 'var(--accent)',
                            flexShrink: 0,
                          }}
                        >
                          {article.category}
                        </span>
                      )}
                    </div>
                    <span
                      className="font-display"
                      style={{
                        fontFamily: 'Instrument Serif, serif',
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        color: 'var(--ink)',
                        display: 'block',
                      }}
                    >
                      {article.title}
                    </span>
                    {article.reading_minutes && (
                      <span
                        className="font-sans"
                        style={{ fontSize: '0.75rem', color: 'var(--ink-2)', marginTop: '0.125rem', display: 'block' }}
                      >
                        {article.reading_minutes} min read
                      </span>
                    )}
                  </a>
                ))}
                <div
                  style={{
                    borderTop: '1px solid var(--rule)',
                    padding: '0.625rem 1rem',
                  }}
                >
                  <a
                    href="/news"
                    className="font-sans"
                    style={{ fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}
                  >
                    All news &rarr;
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* 4. Curriculum — left 2/3 */}
          <section className="lg:col-span-2">
            <h2
              className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4"
              style={{
                fontFamily: 'Instrument Serif, serif',
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}
            >
              The curriculum
            </h2>
            <ModuleProgressBar segments={progressSegments} />
            <ArticleList modules={moduleItems} />
          </section>

          {/* 5. Tool cards — right 1/3 */}
          <section className="lg:col-span-1">
            <div className="flex flex-col gap-4">
              <ToolCard
                title="Take-home pay calculator"
                subtitle="See what Budget 2026 means for your wages"
                href="/calculator"
                decorativeChar="€"
              />
              <ToolCard
                title="Loan calculator &amp; comparison"
                subtitle="Work out the true cost of borrowing before you sign"
                href="/tools/loan-calculator"
                decorativeChar="£"
              />
            </div>
          </section>

          {/* 6. Footer — full width */}
          <footer className="pt-4 lg:col-span-3" style={{ borderTop: '1px solid var(--rule)' }}>
            {/* Nav links */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              {[
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/glossary', label: 'Glossary' },
                { href: '/sources', label: 'Sources' },
                { href: '/methodology', label: 'Methodology' },
                { href: '/privacy', label: 'Privacy' },
                { href: '/terms', label: 'Terms' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="font-sans text-xs"
                  style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
                >
                  {label}
                </a>
              ))}
            </div>
            <p
              className="font-sans italic text-xs mb-1"
              style={{ color: 'var(--ink-2)' }}
            >
              {partnerLine}
            </p>
            <p className="font-sans text-xs" style={{ color: 'var(--ink-2)', opacity: 0.6 }}>
              © 2026 Punt
            </p>
          </footer>

        </div>
      </div>
    </AppShell>
  );
}
