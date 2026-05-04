import Link from 'next/link';
import { getCurrentMonthActions, TAG_LABELS, type ActionTag } from '@/lib/monthly-actions';

const TAG_COLOURS: Record<ActionTag, string> = {
  tax: 'var(--accent)',
  savings: '#2E7D52',
  planning: '#1565C0',
  deadline: '#B71C1C',
  admin: '#555',
  benefits: '#6A1B9A',
};

export function MonthlyActionsTile() {
  const { monthName, actions } = getCurrentMonthActions();

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--rule)',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.125rem',
            lineHeight: 1.2,
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {monthName} actions
        </h2>
        <span
          className="font-sans"
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--ink-2)',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {actions.length} this month
        </span>
      </div>

      {/* Action rows */}
      <div>
        {actions.map((action, idx) => {
          const tagColour = TAG_COLOURS[action.tag];
          const href = action.href ?? action.externalHref;
          const isExternal = !action.href && !!action.externalHref;

          const content = (
            <div
              style={{
                padding: '0.875rem 1rem',
                borderTop: idx > 0 ? '1px solid var(--rule)' : 'none',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.25rem',
              }}
            >
              {/* Tag + title row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  className="font-sans"
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: tagColour,
                    flexShrink: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {TAG_LABELS[action.tag]}
                </span>
                <span
                  className="font-sans"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--ink)',
                    lineHeight: 1.35,
                  }}
                >
                  {action.title}
                </span>
              </div>

              {/* Description */}
              <p
                className="font-sans"
                style={{
                  fontSize: '0.8125rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-2)',
                  margin: 0,
                }}
              >
                {action.description}
              </p>
            </div>
          );

          if (!href) return <div key={action.id}>{content}</div>;

          if (isExternal) {
            return (
              <a
                key={action.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={action.id}
              href={href}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
