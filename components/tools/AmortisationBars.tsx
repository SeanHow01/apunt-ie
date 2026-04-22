'use client';

import type { LoanOutput } from '@/lib/loans';
import { formatEuro } from '@/lib/tax';

type Props = {
  breakdown: LoanOutput['breakdown'];
  termMonths: number;
};

type BarRowProps = {
  label: string;
  interestCents: number;
  principalCents: number;
};

function BarRow({ label, interestCents, principalCents }: BarRowProps) {
  const total = interestCents + principalCents;
  const interestFlex = total > 0 ? interestCents / total : 0;
  const principalFlex = total > 0 ? principalCents / total : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="font-sans text-xs font-medium"
        style={{ color: 'var(--ink-2)' }}
      >
        {label}
      </span>

      <div
        className="flex w-full overflow-hidden"
        style={{ height: '20px', borderRadius: '2px', gap: '2px' }}
        role="img"
        aria-label={`${label}: ${formatEuro(interestCents / 100)} interest, ${formatEuro(principalCents / 100)} principal`}
      >
        <div
          style={{
            flex: interestFlex,
            backgroundColor: 'var(--accent)',
            opacity: 0.85,
            minWidth: interestFlex > 0 ? '2px' : '0',
          }}
        />
        <div
          style={{
            flex: principalFlex,
            backgroundColor: 'var(--ink-2)',
            opacity: 0.2,
            minWidth: principalFlex > 0 ? '2px' : '0',
          }}
        />
      </div>

      <p
        className="font-sans text-xs tabular-nums"
        style={{ color: 'var(--ink-2)' }}
      >
        {formatEuro(interestCents / 100)} interest
        {' / '}
        {formatEuro(principalCents / 100)} principal
      </p>
    </div>
  );
}

export function AmortisationBars({ breakdown, termMonths }: Props) {
  const { firstMonth, midMonth, finalMonth } = breakdown;

  const allZero =
    firstMonth.interestCents === 0 &&
    firstMonth.principalCents === 0 &&
    midMonth.interestCents === 0 &&
    midMonth.principalCents === 0 &&
    finalMonth.interestCents === 0 &&
    finalMonth.principalCents === 0;

  if (allZero) return null;

  const midMonthNumber = Math.floor(termMonths / 2);

  return (
    <div className="flex flex-col gap-5">
      {/* Legend */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--accent)',
              opacity: 0.85,
              borderRadius: '2px',
              flexShrink: 0,
            }}
          />
          <span
            className="font-sans text-xs"
            style={{ color: 'var(--ink-2)' }}
          >
            Interest
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: 'var(--ink-2)',
              opacity: 0.2,
              borderRadius: '2px',
              border: '1px solid var(--rule)',
              flexShrink: 0,
            }}
          />
          <span
            className="font-sans text-xs"
            style={{ color: 'var(--ink-2)' }}
          >
            Principal
          </span>
        </div>
      </div>

      <BarRow
        label="Month 1"
        interestCents={firstMonth.interestCents}
        principalCents={firstMonth.principalCents}
      />

      <BarRow
        label={`Month ${midMonthNumber}`}
        interestCents={midMonth.interestCents}
        principalCents={midMonth.principalCents}
      />

      <BarRow
        label="Final month"
        interestCents={finalMonth.interestCents}
        principalCents={finalMonth.principalCents}
      />
    </div>
  );
}
