'use client';

import type { LoanOutput } from '@/lib/loans';
import { formatEuro } from '@/lib/tax';

type Props = {
  output: LoanOutput | null;
  principalCents: number;
  compact?: boolean;
};

export function LoanResults({ output, principalCents, compact = false }: Props) {
  if (!output) {
    return (
      <p
        className="font-sans text-sm"
        style={{ color: 'var(--ink-2)' }}
      >
        Enter loan details above.
      </p>
    );
  }

  const { monthlyPaymentCents, totalRepaidCents, totalInterestCents } = output;

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {/* Monthly payment */}
        <div>
          <p
            className="font-sans text-xs font-semibold uppercase tracking-[0.15em] mb-0.5"
            style={{ color: 'var(--ink-2)' }}
          >
            Monthly payment
          </p>
          <p
            className="font-display text-2xl tabular-nums"
            style={{ color: 'var(--ink)' }}
          >
            {formatEuro(monthlyPaymentCents / 100)}
            <span
              className="font-sans text-sm font-normal ml-1"
              style={{ color: 'var(--ink-2)' }}
            >
              / month
            </span>
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '12px' }} className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>
              Total cost of credit
            </span>
            <span
              className="font-sans text-sm font-semibold tabular-nums"
              style={{ color: 'var(--ink)' }}
            >
              {formatEuro(totalRepaidCents / 100)}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>
              Total interest
            </span>
            <span
              className="font-sans text-sm tabular-nums"
              style={{ color: 'var(--ink-2)' }}
            >
              {formatEuro(totalInterestCents / 100)}
            </span>
          </div>
        </div>

        <p
          className="font-display italic text-xs"
          style={{ color: 'var(--ink-2)' }}
        >
          Based on the details entered above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Monthly payment — headline */}
      <div>
        <p
          className="font-sans text-xs font-semibold uppercase tracking-[0.15em] mb-1"
          style={{ color: 'var(--ink-2)' }}
        >
          Monthly payment
        </p>
        <p
          className="font-display text-4xl tabular-nums leading-none"
          style={{ color: 'var(--ink)' }}
        >
          {formatEuro(monthlyPaymentCents / 100)}
          <span
            className="font-sans text-base font-normal ml-2"
            style={{ color: 'var(--ink-2)' }}
          >
            / month
          </span>
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      {/* Total repaid */}
      <div>
        <p
          className="font-sans text-xs font-semibold uppercase tracking-[0.15em] mb-1"
          style={{ color: 'var(--ink-2)' }}
        >
          Total cost of credit
        </p>
        <p
          className="font-sans text-xl font-semibold tabular-nums"
          style={{ color: 'var(--ink)' }}
        >
          {formatEuro(totalRepaidCents / 100)}{' '}
          <span
            className="font-sans text-sm font-normal"
            style={{ color: 'var(--ink-2)' }}
          >
            total repaid
          </span>
        </p>
      </div>

      {/* Total interest */}
      <div>
        <p
          className="font-sans text-base tabular-nums"
          style={{ color: 'var(--ink-2)' }}
        >
          {formatEuro(totalInterestCents / 100)}{' '}
          <span className="font-sans text-sm">in interest</span>
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--rule)' }} />

      <p
        className="font-display italic text-sm"
        style={{ color: 'var(--ink-2)' }}
      >
        Based on the details entered above.
      </p>
    </div>
  );
}
