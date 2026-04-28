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

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <a
          href="https://www.mabs.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div>
            <p
              className="font-sans text-sm font-semibold"
              style={{ color: 'var(--ink)', marginBottom: '0.125rem' }}
            >
              MABS &rarr;
            </p>
            <p
              className="font-sans text-xs"
              style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}
            >
              Free money advice &amp; budgeting service
            </p>
          </div>
        </a>

        <div
          style={{
            width: '1px',
            backgroundColor: 'var(--rule)',
            flexShrink: 0,
            alignSelf: 'stretch',
          }}
          aria-hidden="true"
        />

        <a
          href="https://www.ccpc.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div>
            <p
              className="font-sans text-sm font-semibold"
              style={{ color: 'var(--ink)', marginBottom: '0.125rem' }}
            >
              CCPC &rarr;
            </p>
            <p
              className="font-sans text-xs"
              style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}
            >
              Consumer &amp; financial product comparisons
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
