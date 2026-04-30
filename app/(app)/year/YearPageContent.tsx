import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { modules } from '@/content/modules/index';
import type { YearData, YearCallout } from '@/lib/years';

const CALLOUT_STYLES: Record<YearCallout['kind'], { borderColor: string; label: string }> = {
  info:    { borderColor: 'var(--rule)',   label: 'Note' },
  tip:     { borderColor: 'var(--accent)', label: 'Tip' },
  warning: { borderColor: '#C17F24',       label: 'Heads up' },
};

type Props = {
  year: YearData;
};

export function YearPageContent({ year }: Props) {
  const yearModules = year.moduleIds
    .map((id) => modules.find((m) => m.id === id))
    .filter((m): m is (typeof modules)[number] => m !== undefined);

  // Adjacent years for previous/next navigation
  const yearIds = ['graduate', '1', '2', '3'];
  const currentIdx = yearIds.indexOf(year.id);
  const prevId = currentIdx > 0 ? yearIds[currentIdx - 1] : null;
  const nextId = currentIdx < yearIds.length - 1 ? yearIds[currentIdx + 1] : null;

  return (
    <AppShell>
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 max-w-4xl mx-auto w-full">

        {/* Back to index */}
        <Link
          href="/year"
          className="font-sans inline-block mb-6"
          style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          &larr; All years
        </Link>

        {/* Hero */}
        <header className="mb-10">
          <div className="mb-3">
            <Eyebrow>{year.label}</Eyebrow>
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl leading-tight mb-3"
            style={{
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              fontFamily: 'Instrument Serif, serif',
            }}
          >
            {year.headline}
          </h1>
          <p
            className="font-sans text-base leading-relaxed"
            style={{ color: 'var(--ink-2)', maxWidth: '55ch' }}
          >
            {year.description}
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-3 lg:gap-x-10 lg:items-start">

          {/* Modules — left 2/3 */}
          <section className="lg:col-span-2 mb-10 lg:mb-0">
            <h2
              className="font-display text-2xl leading-tight mb-1"
              style={{
                fontFamily: 'Instrument Serif, serif',
                color: 'var(--ink)',
                letterSpacing: '-0.01em',
              }}
            >
              Start with these lessons
            </h2>
            <p
              className="font-sans text-sm mb-5"
              style={{ color: 'var(--ink-2)' }}
            >
              Curated for {year.label.toLowerCase()}.
            </p>

            <div
              style={{
                border: '1px solid var(--rule)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              {yearModules.map((mod, idx) => (
                <Link
                  key={mod.id}
                  href={`/lessons/${mod.id}`}
                  className="block no-underline group"
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: idx > 0 ? '1px solid var(--rule)' : 'none',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  {/* Ordinal */}
                  <span
                    className="font-display italic flex-shrink-0 mt-0.5"
                    style={{
                      fontFamily: 'Instrument Serif, serif',
                      fontSize: '1.125rem',
                      color: 'var(--accent)',
                      opacity: 0.6,
                      minWidth: '1.25rem',
                    }}
                  >
                    {idx + 1}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      className="font-display text-base leading-snug mb-0.5 group-hover:opacity-80 transition-opacity"
                      style={{
                        fontFamily: 'Instrument Serif, serif',
                        color: 'var(--ink)',
                      }}
                    >
                      {mod.title}
                    </p>
                    <p
                      className="font-sans text-sm"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {mod.subtitle}
                    </p>
                  </div>

                  <span
                    className="font-sans text-xs flex-shrink-0 mt-1"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    {mod.durationMinutes} min
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Tools — right 1/3 */}
          <section className="lg:col-span-1">
            <h2
              className="font-display text-2xl leading-tight mb-1"
              style={{
                fontFamily: 'Instrument Serif, serif',
                color: 'var(--ink)',
                letterSpacing: '-0.01em',
              }}
            >
              Useful right now
            </h2>
            <p
              className="font-sans text-sm mb-5"
              style={{ color: 'var(--ink-2)' }}
            >
              Tools relevant to this stage.
            </p>

            <div className="flex flex-col gap-3">
              {year.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="block no-underline group"
                  style={{
                    border: '1px solid var(--rule)',
                    borderRadius: '4px',
                    padding: '1rem 1.125rem',
                    textDecoration: 'none',
                  }}
                >
                  <p
                    className="font-display text-base leading-snug mb-1 group-hover:opacity-80 transition-opacity"
                    style={{
                      fontFamily: 'Instrument Serif, serif',
                      color: 'var(--ink)',
                    }}
                  >
                    {tool.title}
                  </p>
                  <p
                    className="font-sans text-sm leading-relaxed"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    {tool.description}
                  </p>
                  <p
                    className="font-sans text-xs mt-2 font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    Open &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* Worth knowing callouts */}
        {year.callouts && year.callouts.length > 0 && (
          <>
            <Rule className="my-10" />
            <section>
              <h2
                className="font-display text-2xl leading-tight mb-5"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                }}
              >
                Worth knowing
              </h2>
              <div className="flex flex-col gap-3">
                {year.callouts.map((callout, idx) => {
                  const style = CALLOUT_STYLES[callout.kind];
                  return (
                    <div
                      key={idx}
                      style={{
                        borderLeft: `3px solid ${style.borderColor}`,
                        paddingLeft: '1rem',
                        paddingTop: '0.125rem',
                        paddingBottom: '0.125rem',
                      }}
                    >
                      <p
                        className="font-sans text-xs font-semibold uppercase tracking-widest mb-1"
                        style={{ color: 'var(--ink-2)' }}
                      >
                        {style.label}
                      </p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                        {callout.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Previous / next year navigation */}
        <Rule className="my-10" />
        <nav
          className="flex justify-between gap-4"
          aria-label="Year navigation"
        >
          {/* Left side: earlier stage link, or "All years" on Year 1 */}
          {prevId ? (
            <Link
              href={`/year/${prevId}`}
              className="font-sans text-sm"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              &larr; Earlier stage
            </Link>
          ) : (
            <Link
              href="/year"
              className="font-sans text-sm"
              style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
            >
              &larr; All years
            </Link>
          )}

          {/* Right side: only when a next stage exists */}
          {nextId ? (
            <Link
              href={`/year/${nextId}`}
              className="font-sans text-sm"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              Next stage &rarr;
            </Link>
          ) : (
            <span />
          )}
        </nav>

      </div>
    </AppShell>
  );
}
