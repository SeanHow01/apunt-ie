import { describe, it, expect } from 'vitest';
import { calculateLoan, compareLoans } from './loans';

const TOLERANCE = 200; // ±200 cents (€2)

function withinTolerance(actual: number, expected: number, tolerance = TOLERANCE): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

describe('calculateLoan', () => {
  it('€5,000 at 9% APR over 36 months', () => {
    const result = calculateLoan({
      principalCents: 500000,
      termMonths: 36,
      aprBps: 900,
    });
    expect(withinTolerance(result.monthlyPaymentCents, 15900)).toBe(true);
    expect(withinTolerance(result.totalInterestCents, 72400)).toBe(true);
    expect(result.totalRepaidCents).toBe(result.monthlyPaymentCents * 36);
    expect(result.totalInterestCents).toBe(result.totalRepaidCents - 500000);
  });

  it('€10,000 at 6% APR over 60 months', () => {
    const result = calculateLoan({
      principalCents: 1000000,
      termMonths: 60,
      aprBps: 600,
    });
    expect(withinTolerance(result.monthlyPaymentCents, 19334)).toBe(true);
    expect(withinTolerance(result.totalInterestCents, 160040)).toBe(true);
    expect(result.totalRepaidCents).toBe(result.monthlyPaymentCents * 60);
  });

  it('€1,000 at 0% APR over 12 months', () => {
    const result = calculateLoan({
      principalCents: 100000,
      termMonths: 12,
      aprBps: 0,
    });
    expect(withinTolerance(result.monthlyPaymentCents, 8333)).toBe(true);
    expect(result.totalInterestCents).toBe(0);
    expect(result.monthlyRate).toBe(0);
  });

  it('returns all zeros when termMonths is 0', () => {
    const result = calculateLoan({
      principalCents: 500000,
      termMonths: 0,
      aprBps: 900,
    });
    expect(result.monthlyPaymentCents).toBe(0);
    expect(result.totalRepaidCents).toBe(0);
    expect(result.totalInterestCents).toBe(0);
    expect(result.breakdown.firstMonth.interestCents).toBe(0);
    expect(result.breakdown.firstMonth.principalCents).toBe(0);
  });

  it('returns all zeros when principalCents is 0', () => {
    const result = calculateLoan({
      principalCents: 0,
      termMonths: 36,
      aprBps: 900,
    });
    expect(result.monthlyPaymentCents).toBe(0);
    expect(result.totalRepaidCents).toBe(0);
    expect(result.totalInterestCents).toBe(0);
  });
});

describe('compareLoans', () => {
  it('computes diffs and percentages correctly', () => {
    const a = calculateLoan({ principalCents: 500000, termMonths: 36, aprBps: 900 });
    const b = calculateLoan({ principalCents: 500000, termMonths: 60, aprBps: 900 });

    const cmp = compareLoans(a, b);

    // B has lower monthly but higher total interest
    expect(cmp.monthlyDiffCents).toBeLessThan(0);
    expect(cmp.totalInterestDiffCents).toBeGreaterThan(0);
    expect(cmp.totalRepaidDiffCents).toBeGreaterThan(0);

    // percentage diffs should be consistent with cent diffs
    expect(Math.sign(cmp.monthlyDiffPct)).toBe(Math.sign(cmp.monthlyDiffCents));
    expect(Math.sign(cmp.totalInterestDiffPct)).toBe(Math.sign(cmp.totalInterestDiffCents));
  });

  it('returns 0 percentage diffs when base loan has zero interest', () => {
    const a = calculateLoan({ principalCents: 100000, termMonths: 12, aprBps: 0 });
    const b = calculateLoan({ principalCents: 100000, termMonths: 12, aprBps: 500 });

    const cmp = compareLoans(a, b);
    expect(cmp.totalInterestDiffPct).toBe(0); // a.totalInterest is 0, so pct is 0
  });
});
