import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { getCalendar, getCurrentMonthIndex, CATEGORY_LABELS, type CalendarCategory } from '@/lib/calendar';
import CalendarPrintButton from './CalendarPrintButton';

export const metadata: Metadata = {
  title: 'Financial Calendar — Punt',
  description: 'Irish financial deadlines, tax dates, and savings milestones for the full year.',
};

const CATEGORY_COLOURS: Record<CalendarCategory, string> = {
  tax: 'var(--accent)',
  savings: '#2E7D52',
  deadline: '#B71C1C',
  benefits: '#6A1B9A',
  planning: '#1565C0',
  budget: '#E65100',
};

export default function CalendarPage() {
  const months = getCalendar();
  const currentMonthIdx = getCurrentMonthIndex(); // 0-based

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 md:py-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 print:mb-4">
          <div>
            <p
              className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 print:hidden"
              style={{ color: 'var(--ink-2)' }}
            >
              Irish financial calendar
            </p>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              Key dates for the year
            </h1>
            <p
              className="font-sans text-sm mt-2 print:text-xs"
              style={{ color: 'var(--ink-2)' }}
            >
              Tax deadlines, grants, and planning milestones — all in one place.
            </p>
          </div>
          <CalendarPrintButton />
        </div>

        {/* Month jump nav (hidden in print) */}
        <nav
          className="flex flex-wrap gap-1.5 mb-8 print:hidden"
          aria-label="Jump to month"
        >
          {months.map(({ month, name }) => (
            <a
              key={month}
              href={`#month-${month}`}
              className="font-sans text-xs font-medium"
              style={{
                padding: '0.25rem 0.625rem',
                border: '1px solid var(--rule)',
                borderRadius: '2px',
                textDecoration: 'none',
                backgroundColor:
                  month === currentMonthIdx + 1 ? 'var(--accent)' : 'var(--surface)',
                color:
                  month === currentMonthIdx + 1 ? 'var(--accent-ink)' : 'var(--ink-2)',
              }}
            >
              {name.slice(0, 3)}
            </a>
          ))}
        </nav>

        {/* Months */}
        <div className="flex flex-col gap-10 print:gap-6">
          {months.map(({ month, name, events }) => {
            if (events.length === 0) return null;
            const isCurrent = month === currentMonthIdx + 1;

            return (
              <section key={month} id={`month-${month}`}>
                {/* Month heading */}
                <div
                  className="flex items-baseline gap-3 mb-3 pb-2"
                  style={{ borderBottom: `2px solid ${isCurrent ? 'var(--accent)' : 'var(--rule)'}` }}
                >
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      letterSpacing: '-0.02em',
                      color: isCurrent ? 'var(--accent)' : 'var(--ink)',
                      margin: 0,
                    }}
                  >
                    {name}
                  </h2>
                  {isCurrent && (
                    <span
                      className="font-sans text-xs font-semibold uppercase tracking-widest print:hidden"
                      style={{ color: 'var(--accent)' }}
                    >
                      This month
                    </span>
                  )}
                </div>

                {/* Events */}
                <div className="flex flex-col">
                  {events.map((event, idx) => {
                    const colour = CATEGORY_COLOURS[event.category];
                    const href = event.href;
                    const extHref = event.externalHref;

                    return (
                      <div
                        key={event.id}
                        style={{
                          padding: '0.875rem 0',
                          borderTop: idx > 0 ? '1px solid var(--rule)' : 'none',
                          display: 'grid',
                          gridTemplateColumns: '5rem 1fr',
                          gap: '0 1rem',
                          alignItems: 'start',
                        }}
                      >
                        {/* Date column */}
                        <div>
                          <span
                            className="font-sans text-xs"
                            style={{
                              color: event.important ? 'var(--ink)' : 'var(--ink-2)',
                              fontWeight: event.important ? 600 : 400,
                              lineHeight: 1.5,
                            }}
                          >
                            {event.dateLabel}
                          </span>
                        </div>

                        {/* Content column */}
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: '0.5rem',
                              flexWrap: 'wrap',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {/* Category tag */}
                            <span
                              className="font-sans"
                              style={{
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: colour,
                                flexShrink: 0,
                              }}
                            >
                              {CATEGORY_LABELS[event.category]}
                            </span>

                            {/* Title */}
                            <span
                              className="font-sans text-sm"
                              style={{
                                color: 'var(--ink)',
                                fontWeight: event.important ? 600 : 500,
                                lineHeight: 1.35,
                              }}
                            >
                              {event.title}
                            </span>
                          </div>

                          {/* Description */}
                          <p
                            className="font-sans text-xs"
                            style={{
                              color: 'var(--ink-2)',
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            {event.description}
                          </p>

                          {/* Links */}
                          {(href ?? extHref) && (
                            <div
                              className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 print:hidden"
                            >
                              {href && (
                                <Link
                                  href={href}
                                  className="font-sans text-xs"
                                  style={{ color: 'var(--accent)', textDecoration: 'none' }}
                                >
                                  Open in Punt &rarr;
                                </Link>
                              )}
                              {extHref && (
                                <a
                                  href={extHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-sans text-xs"
                                  style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
                                >
                                  Revenue.ie &rarr;
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mt-10 pt-5 print:mt-6"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          <p
            className="font-sans text-xs italic"
            style={{ color: 'var(--ink-2)', lineHeight: 1.65 }}
          >
            Dates are indicative for 2026. Revenue may adjust exact deadlines; always
            confirm at{' '}
            <a
              href="https://www.revenue.ie"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              Revenue.ie
            </a>
            {' '}before acting.
          </p>
        </div>

      </div>
    </AppShell>
  );
}
