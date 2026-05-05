import Link from 'next/link'
import { getCalendar, getCurrentMonthIndex, CATEGORY_LABELS, type CalendarCategory } from '@/lib/calendar'
import { getSetuEventsForMonth } from '@/lib/setu/calendar-setu'
import SetuCalendarPrintButton from './SetuCalendarPrintButton'

const CATEGORY_COLOURS: Record<CalendarCategory, string> = {
  tax:      'var(--accent)',
  savings:  'oklch(0.40 0.12 145)',
  deadline: 'oklch(0.40 0.12 20)',
  benefits: 'oklch(0.40 0.10 300)',
  planning: 'oklch(0.40 0.10 245)',
  budget:   'oklch(0.45 0.12 60)',
}

export default function SetuCalendarPage() {
  const months = getCalendar()
  const currentMonthIdx = getCurrentMonthIndex()

  // Default to October (index 9) if in summer, otherwise current month
  const defaultIdx = currentMonthIdx >= 8 ? currentMonthIdx : 9

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>
            SETU · FINANCIAL CALENDAR
          </p>
          <h1 className="font-display italic" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>
            Key dates for the year
          </h1>
          <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', marginTop: '0.375rem' }}>
            National tax deadlines plus SETU-specific fund dates.
          </p>
        </div>
        <SetuCalendarPrintButton />
      </div>

      {/* Month tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2rem' }}>
        {months.map((month, idx) => {
          const setuEvents = getSetuEventsForMonth(month.month)
          const hasUrgent = setuEvents.some(e => e.urgent)
          return (
            <a
              key={month.month}
              href={`#month-${month.month}`}
              className="font-sans"
              style={{
                fontSize: '0.8125rem',
                padding: '0.375rem 0.75rem',
                border: '1px solid var(--rule)',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: idx === defaultIdx ? 'var(--setu-primary)' : 'var(--ink-2)',
                backgroundColor: idx === defaultIdx ? 'var(--setu-primary-light)' : 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {month.name.slice(0, 3)}
              {hasUrgent && <span style={{ fontSize: '0.5rem', color: 'var(--accent)' }}>⚡</span>}
            </a>
          )
        })}
      </div>

      {/* Month sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {months.map((month) => {
          const setuEvents = getSetuEventsForMonth(month.month)
          const hasNational = month.events.length > 0
          const hasSetu = setuEvents.length > 0

          if (!hasNational && !hasSetu) return null

          return (
            <section key={month.month} id={`month-${month.month}`} aria-labelledby={`month-${month.month}-heading`}>
              <h2
                id={`month-${month.month}-heading`}
                className="font-display italic"
                style={{ fontSize: '1.375rem', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--rule)' }}
              >
                {month.name}
              </h2>

              {/* National events */}
              {hasNational && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {month.events.map((event) => (
                    <div
                      key={event.id}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '0.875rem 1rem',
                        border: `1px solid ${event.important ? 'oklch(0.82 0.09 20)' : 'var(--rule)'}`,
                        borderLeft: `3px solid ${CATEGORY_COLOURS[event.category]}`,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--paper)',
                      }}
                    >
                      <div style={{ minWidth: '4.5rem', flexShrink: 0 }}>
                        <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: 0 }}>{event.dateLabel}</p>
                        <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.1em', color: CATEGORY_COLOURS[event.category], margin: '0.125rem 0 0' }}>
                          {CATEGORY_LABELS[event.category]}
                        </p>
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <p className="font-sans font-semibold" style={{ fontSize: '0.9375rem', color: 'var(--ink)', margin: '0 0 0.25rem' }}>
                          {event.title}
                          {event.important && <span style={{ marginLeft: '0.375rem', fontSize: '0.75rem', color: 'oklch(0.40 0.12 20)' }}>⚠</span>}
                        </p>
                        <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>{event.description}</p>
                        {(event.href || event.externalHref) && (
                          <Link
                            href={event.href ?? event.externalHref!}
                            className="font-sans"
                            style={{ fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none', marginTop: '0.375rem', display: 'inline-block' }}
                          >
                            {event.href ? 'Open in Punt →' : 'External link →'}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SETU divider */}
              {hasSetu && hasNational && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
                  <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--setu-primary-border)' }} />
                  <span className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--setu-primary)', whiteSpace: 'nowrap' }}>
                    SETU SPECIFIC
                  </span>
                  <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--setu-primary-border)' }} />
                </div>
              )}

              {/* SETU events */}
              {hasSetu && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {setuEvents.map((event, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '0.875rem 1rem',
                        border: `1px solid ${event.urgent ? 'var(--setu-primary-border)' : 'var(--rule)'}`,
                        borderLeft: `3px solid ${event.urgent ? 'var(--setu-primary)' : 'var(--setu-primary-border)'}`,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: event.urgent ? 'var(--setu-primary-light)' : 'var(--paper)',
                      }}
                    >
                      <div style={{ minWidth: '4.5rem', flexShrink: 0 }}>
                        <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: 0 }}>
                          {event.date}{event.approximate ? '*' : ''}
                        </p>
                        {event.fund && (
                          <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--setu-primary)', margin: '0.125rem 0 0' }}>
                            {event.fund}
                          </p>
                        )}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <p className="font-sans font-semibold" style={{ fontSize: '0.9375rem', color: 'var(--ink)', margin: '0 0 0.25rem' }}>
                          {event.urgent && <span style={{ marginRight: '0.375rem' }}>⚡</span>}
                          {event.title}
                        </p>
                        <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>{event.desc}</p>
                        {event.link && (
                          <Link
                            href={event.link}
                            className="font-sans"
                            style={{ fontSize: '0.8125rem', color: 'var(--setu-accent)', textDecoration: 'none', marginTop: '0.375rem', display: 'inline-block' }}
                          >
                            {event.link.startsWith('/') ? 'Open in Punt →' : 'External link →'}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <p className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '2rem', fontStyle: 'italic' }}>
        * Approximate date — confirm with SETU Student Services.
      </p>
    </div>
  )
}
