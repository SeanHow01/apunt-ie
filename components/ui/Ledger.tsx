/**
 * Ledger — the ruled mono table used to display calculation outputs.
 *
 * Lifted directly from the hero module preview on the homepage: 1px rules
 * between rows, mono labels left, mono values right. A row with
 * `primary: true` gets the accent treatment and a 1px ink rule above it —
 * used for totals / net figures (e.g. the "NET" line on a payslip).
 *
 * Three sizes:
 *   sm — homepage-preview density (default for previews)
 *   md — page-scale density (default for in-app calculator output)
 *   lg — hero-scale density (rarely used; tools pages)
 */

export type LedgerRow = {
  label: string;
  value: string;
  primary?: boolean;
};

type Size = 'sm' | 'md' | 'lg';

const SIZE_TOKENS: Record<
  Size,
  {
    padY: string;
    labelSize: string;
    valueSize: string;
    primaryValueSize: string;
    containerPad: string;
    labelTracking: string;
  }
> = {
  sm: {
    padY: '0.25rem',
    labelSize: '0.625rem',
    valueSize: '0.75rem',
    primaryValueSize: '0.875rem',
    containerPad: '0.75rem 0.875rem',
    labelTracking: '0.08em',
  },
  md: {
    padY: '0.5rem',
    labelSize: '0.6875rem',
    valueSize: '0.9375rem',
    primaryValueSize: '1.125rem',
    containerPad: '0.875rem 1rem',
    labelTracking: '0.1em',
  },
  lg: {
    padY: '0.75rem',
    labelSize: '0.75rem',
    valueSize: '1.0625rem',
    primaryValueSize: '1.5rem',
    containerPad: '1.125rem 1.25rem',
    labelTracking: '0.12em',
  },
};

export function Ledger({
  rows,
  size = 'md',
}: {
  rows: LedgerRow[];
  size?: Size;
}) {
  const t = SIZE_TOKENS[size];

  // Partition: non-primary rows render first, primary rows after a 1px ink rule.
  const standard = rows.filter((r) => !r.primary);
  const primary = rows.filter((r) => r.primary);

  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-sm)',
        padding: t.containerPad,
      }}
    >
      {standard.map((row, i) => (
        <div
          key={`${row.label}-${i}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: `${t.padY} 0`,
            borderBottom:
              i < standard.length - 1 || primary.length > 0
                ? '1px solid var(--rule)'
                : 'none',
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: t.labelSize,
              color: 'var(--ink-3)',
              letterSpacing: t.labelTracking,
            }}
          >
            {row.label}
          </span>
          <span
            className="font-mono tabular-nums"
            style={{ fontSize: t.valueSize, color: 'var(--ink-2)' }}
          >
            {row.value}
          </span>
        </div>
      ))}

      {primary.map((row, i) => (
        <div
          key={`primary-${row.label}-${i}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: `calc(${t.padY} + 0.125rem)`,
            paddingBottom: t.padY,
            marginTop: i === 0 ? '0.125rem' : 0,
            borderTop: i === 0 ? '1px solid var(--ink)' : '1px solid var(--rule)',
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: t.labelSize,
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: t.labelTracking,
            }}
          >
            {row.label}
          </span>
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize: t.primaryValueSize,
              fontWeight: 700,
              color: 'var(--accent)',
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
