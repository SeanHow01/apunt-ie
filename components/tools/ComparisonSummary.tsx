'use client';

import type { LoanOutput, LoanComparison } from '@/lib/loans';
import { formatEuro } from '@/lib/tax';

type Props = {
  labelA: string;
  labelB: string;
  outputA: LoanOutput;
  outputB: LoanOutput;
  comparison: LoanComparison;
};

type ComparisonRowProps = {
  rowLabel: string;
  valueA: number;
  valueB: number;
  diffCents: number;
  labelA: string;
  labelB: string;
};

function ComparisonRow({
  rowLabel,
  valueA,
  valueB,
  diffCents,
  labelA,
  labelB,
}: ComparisonRowProps) {
  const total = valueA + valueB;
  const flexA = total > 0 ? valueA / total : 0.5;
  const flexB = total > 0 ? valueB / total : 0.5;

  // diffCents = B - A (positive means B is higher, so A is lower)
  const aIsLower = diffCents > 0;
  const bIsLower = diffCents < 0;
  const absDiffCents = Math.abs(diffCents);
  const absDiffPct = total > 0 ? Math.abs((diffCents / valueA) * 100) : 0;

  const displayLabelA = labelA || 'Loan A';
  const displayLabelB = labelB || 'Loan B';

  return (
    <div className="flex flex-col gap-3">
      {/* Row eyebrow label */}
      <span
        className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] leading-none"
        style={{ color: 'var(--ink-2)' }}
      >
        {rowLabel}
      </span>

      {/* Values side by side */}
      <div className="flex items-baseline gap-4">
        <div className="flex-1">
          <p
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5"
            style={{ color: 'var(--ink-2)' }}
          >
            {displayLabelA}
          </p>
          <p
            className="font-sans text-base font-semibold tabular-nums"
            style={{ color: 'var(--ink)' }}
          >
            {formatEuro(valueA / 100)}
          </p>
        </div>
        <div
          style={{
            width: '1px',
            height: '32px',
            backgroundColor: 'var(--rule)',
            flexShrink: 0,
          }}
        />
        <div className="flex-1">
          <p
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5"
            style={{ color: 'var(--ink-2)' }}
          >
            {displayLabelB}
          </p>
          <p
            className="font-sans text-base font-semibold tabular-nums"
            style={{ color: 'var(--ink)' }}
          >
            {formatEuro(valueB / 100)}
          </p>
        </div>
      </div>

      {/* Proportional bars */}
      <div
        className="flex w-full overflow-hidden"
        style={{ height: '8px', borderRadius: '2px', gap: '2px' }}
        role="img"
        aria-label={`${displayLabelA}: ${formatEuro(valueA / 100)}, ${displayLabelB}: ${formatEuro(valueB / 100)}`}
      >
        <div
          style={{
            flex: flexA,
            backgroundColor: 'var(--accent)',
            opacity: 0.7,
          }}
        />
        <div
          style={{
            flex: flexB,
            backgroundColor: 'var(--ink-2)',
            opacity: 0.25,
          }}
        />
      </div>

      {/* Direction statement */}
      {absDiffCents > 0 && (
        <p
          className="font-sans text-xs"
          style={{ color: 'var(--ink-2)' }}
        >
          {aIsLower ? displayLabelA : bIsLower ? displayLabelB : null}
          {' pays '}
          <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
            {formatEuro(absDiffCents / 100)}
          </span>
          {' less'}
          {absDiffPct > 0 && (
            <span> ({absDiffPct.toFixed(1)}% difference)</span>
          )}
        </p>
      )}

      {absDiffCents === 0 && (
        <p
          className="font-sans text-xs"
          style={{ color: 'var(--ink-2)' }}
        >
          Both loans have the same {rowLabel.toLowerCase()}.
        </p>
      )}
    </div>
  );
}

export function ComparisonSummary({
  labelA,
  labelB,
  outputA,
  outputB,
  comparison,
}: Props) {
  const displayLabelA = labelA || 'Loan A';
  const displayLabelB = labelB || 'Loan B';

  return (
    <div className="flex flex-col gap-6">
      {/* Regulatory paragraph */}
      <p
        className="font-display italic text-sm leading-relaxed"
        style={{ color: 'var(--ink-2)' }}
      >
        A lower monthly payment isn't always cheaper overall. A longer term usually means
        smaller monthly payments but more interest paid in total. This tool compares the
        numbers — the right choice depends on your full picture, which this tool can't see.
      </p>

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* Monthly payment row */}
      <ComparisonRow
        rowLabel="Monthly payment"
        valueA={outputA.monthlyPaymentCents}
        valueB={outputB.monthlyPaymentCents}
        diffCents={comparison.monthlyDiffCents}
        labelA={displayLabelA}
        labelB={displayLabelB}
      />

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* Total interest row */}
      <ComparisonRow
        rowLabel="Total interest"
        valueA={outputA.totalInterestCents}
        valueB={outputB.totalInterestCents}
        diffCents={comparison.totalInterestDiffCents}
        labelA={displayLabelA}
        labelB={displayLabelB}
      />

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* Total repaid row */}
      <ComparisonRow
        rowLabel="Total repaid"
        valueA={outputA.totalRepaidCents}
        valueB={outputB.totalRepaidCents}
        diffCents={comparison.totalRepaidDiffCents}
        labelA={displayLabelA}
        labelB={displayLabelB}
      />

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* Disclaimer */}
      <p
        className="font-sans italic text-xs"
        style={{ color: 'var(--ink-2)' }}
      >
        This is a comparison of the numbers you entered, not a recommendation.
      </p>
    </div>
  );
}
