/**
 * SupportStrip — co-branding strip linking to MABS and CCPC.
 *
 * MABS (Money Advice and Budgeting Service): free, confidential money advice
 * for people in financial difficulty. Funded by the Department of Social Protection.
 *
 * CCPC (Competition and Consumer Protection Commission): independent body with
 * a consumer protection mandate; publishes impartial financial product comparisons.
 *
 * Server Component — no client state needed.
 */

type Props = {
  /** Visual variant. 'subtle' = muted border, 'prominent' = accent tint border. */
  variant?: 'subtle' | 'prominent';
};

export function SupportStrip({ variant = 'subtle' }: Props) {
  const isProminent = variant === 'prominent';

  return (
    <div
      style={{
        border: `1px solid ${isProminent ? 'var(--accent)' : 'var(--rule)'}`,
        borderRadius: '4px',
        padding: '1rem 1.25rem',
        backgroundColor: isProminent
          ? 'color-mix(in srgb, var(--accent) 4%, transparent)'
          : 'var(--surface)',
      }}
    >
      <p
        className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--ink-2)' }}
      >
        Independent support
      </p>

      <p
        className="font-sans text-xs mb-3"
        style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}
      >
        Punt is an educational tool, not a financial advisory service. If you need
        personalised advice or are in financial difficulty, these free services can help.
      </p>

      {/*
       * Two-column grid on sm+; single column on xs.
       * Avoids the flex-wrap vertical-divider bug where the 1px divider
       * would wrap to its own line between the two link blocks on narrow screens.
       */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.875rem',
        }}
      >
        <a
          href="https://www.mabs.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--rule)',
            borderRadius: '4px',
            backgroundColor: 'var(--bg)',
            display: 'block',
          }}
        >
          <p
            className="font-sans text-sm font-semibold mb-0.5"
            style={{ color: 'var(--ink)' }}
          >
            MABS &rarr;
          </p>
          <p
            className="font-sans text-xs"
            style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}
          >
            Free money advice &amp; budgeting service
          </p>
        </a>

        <a
          href="https://www.ccpc.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--rule)',
            borderRadius: '4px',
            backgroundColor: 'var(--bg)',
            display: 'block',
          }}
        >
          <p
            className="font-sans text-sm font-semibold mb-0.5"
            style={{ color: 'var(--ink)' }}
          >
            CCPC &rarr;
          </p>
          <p
            className="font-sans text-xs"
            style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}
          >
            Consumer &amp; financial product comparisons
          </p>
        </a>
      </div>
    </div>
  );
}
