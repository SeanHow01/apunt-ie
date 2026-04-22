import type { StepHighlight } from '@/content/types';

type Props = {
  highlight: StepHighlight;
};

type PayslipRow = {
  key: StepHighlight & string;
  label: string;
  amount: string;
};

const ROWS: PayslipRow[] = [
  { key: 'gross', label: 'Gross Pay',  amount: '€3,333' },
  { key: 'paye',  label: 'PAYE',       amount: '− €412'  },
  { key: 'usc',   label: 'USC',        amount: '− €89'   },
  { key: 'prsi',  label: 'PRSI',       amount: '− €137'  },
  { key: 'net',   label: 'Net Pay',    amount: '€2,695'  },
];

export function PayslipVisual({ highlight }: Props) {
  return (
    <div
      className="w-full font-sans text-sm"
      style={{ border: '1px solid var(--rule)' }}
      role="table"
      aria-label="Example payslip"
    >
      {/* Header row */}
      <div
        className="flex justify-between items-center px-4 py-2"
        style={{ borderBottom: '1px solid var(--rule)' }}
        role="row"
      >
        <span
          className="font-sans font-semibold uppercase tracking-[0.12em] text-[10px]"
          style={{ color: 'var(--ink-2)' }}
          role="columnheader"
        >
          Your payslip
        </span>
        <span
          className="font-sans font-semibold uppercase tracking-[0.12em] text-[10px]"
          style={{ color: 'var(--ink-2)' }}
          role="columnheader"
        >
          Monthly
        </span>
      </div>

      {/* Data rows */}
      {ROWS.map((row, idx) => {
        const isHighlighted = highlight === row.key;
        const isLast = idx === ROWS.length - 1;
        const isNet = row.key === 'net';

        const rowStyle: React.CSSProperties = isHighlighted
          ? { backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }
          : { backgroundColor: 'transparent', color: 'var(--ink)' };

        return (
          <div
            key={row.key}
            style={{
              ...rowStyle,
              ...(isLast ? {} : { borderBottom: '1px solid var(--rule)' }),
            }}
            className="flex justify-between items-center px-4 py-3"
            role="row"
            aria-selected={isHighlighted}
          >
            <span
              role="cell"
              className={isNet ? 'font-semibold' : ''}
            >
              {row.label}
            </span>
            <span
              role="cell"
              className={`font-mono tabular-nums tracking-tight ${isNet ? 'font-semibold' : ''}`}
            >
              {row.amount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
