export type LenderType = 'credit_union' | 'bank' | 'hire_purchase' | 'bnpl' | 'other';

export type LoanInput = {
  principalCents: number;  // e.g. 500000 for €5,000
  termMonths: number;
  aprBps: number;          // e.g. 950 for 9.5%
};

export type AmortMonthBreakdown = {
  interestCents: number;
  principalCents: number;
};

export type LoanOutput = {
  monthlyPaymentCents: number;
  totalRepaidCents: number;
  totalInterestCents: number;
  monthlyRate: number;  // decimal, e.g. 0.0075
  breakdown: {
    firstMonth: AmortMonthBreakdown;
    midMonth: AmortMonthBreakdown;
    finalMonth: AmortMonthBreakdown;
  };
};

export type LoanComparison = {
  monthlyDiffCents: number;       // b.monthly - a.monthly (positive means B is higher)
  totalInterestDiffCents: number; // b.totalInterest - a.totalInterest
  totalRepaidDiffCents: number;   // b.totalRepaid - a.totalRepaid
  monthlyDiffPct: number;         // percentage diff relative to a
  totalInterestDiffPct: number;
  totalRepaidDiffPct: number;
};

const ZERO_BREAKDOWN: AmortMonthBreakdown = { interestCents: 0, principalCents: 0 };

function computeBreakdown(
  principalCents: number,
  monthlyPaymentCents: number,
  monthlyRate: number,
  k: number, // 1-based month number
): AmortMonthBreakdown {
  // Balance before payment k:
  // B_k = P*(1+r)^(k-1) - payment * ((1+r)^(k-1) - 1) / r
  const factor = Math.pow(1 + monthlyRate, k - 1);
  const balanceBefore = principalCents * factor - monthlyPaymentCents * (factor - 1) / monthlyRate;
  const interestCents = Math.round(balanceBefore * monthlyRate);
  const principalSplit = monthlyPaymentCents - interestCents;
  return { interestCents, principalCents: principalSplit };
}

function computeFinalBreakdown(
  principalCents: number,
  monthlyPaymentCents: number,
  monthlyRate: number,
  termMonths: number,
): AmortMonthBreakdown {
  // Remaining balance after n-1 payments
  const n = termMonths;
  const factor = Math.pow(1 + monthlyRate, n - 1);
  const remainingBalance = principalCents * factor - monthlyPaymentCents * (factor - 1) / monthlyRate;
  // Interest on remaining balance
  let interestCents = Math.round(remainingBalance * monthlyRate);
  // Cap so principal split is never negative
  const maxInterest = Math.round(remainingBalance);
  if (interestCents > maxInterest) interestCents = maxInterest;
  const principalSplit = Math.round(remainingBalance) - interestCents;
  return { interestCents, principalCents: principalSplit };
}

export function calculateLoan(input: LoanInput): LoanOutput {
  const { principalCents, termMonths, aprBps } = input;

  const zeros: LoanOutput = {
    monthlyPaymentCents: 0,
    totalRepaidCents: 0,
    totalInterestCents: 0,
    monthlyRate: 0,
    breakdown: {
      firstMonth: ZERO_BREAKDOWN,
      midMonth: ZERO_BREAKDOWN,
      finalMonth: ZERO_BREAKDOWN,
    },
  };

  if (termMonths <= 0 || principalCents <= 0) return zeros;

  if (aprBps === 0) {
    const monthlyPaymentCents = Math.round(principalCents / termMonths);
    const totalRepaidCents = monthlyPaymentCents * termMonths;
    const midMonth = Math.floor(termMonths / 2);
    return {
      monthlyPaymentCents,
      totalRepaidCents,
      totalInterestCents: 0,
      monthlyRate: 0,
      breakdown: {
        firstMonth: { interestCents: 0, principalCents: monthlyPaymentCents },
        midMonth: { interestCents: 0, principalCents: monthlyPaymentCents },
        finalMonth: { interestCents: 0, principalCents: monthlyPaymentCents },
      },
    };
  }

  const monthlyRate = aprBps / 10000 / 12;
  const rn = Math.pow(1 + monthlyRate, termMonths);
  const monthlyPaymentCents = Math.round(principalCents * monthlyRate * rn / (rn - 1));
  const totalRepaidCents = monthlyPaymentCents * termMonths;
  const totalInterestCents = totalRepaidCents - principalCents;

  const midMonthIndex = Math.floor(termMonths / 2);

  const firstMonth = computeBreakdown(principalCents, monthlyPaymentCents, monthlyRate, 1);
  const midMonth = computeBreakdown(principalCents, monthlyPaymentCents, monthlyRate, midMonthIndex);
  const finalMonth = computeFinalBreakdown(principalCents, monthlyPaymentCents, monthlyRate, termMonths);

  return {
    monthlyPaymentCents,
    totalRepaidCents,
    totalInterestCents,
    monthlyRate,
    breakdown: { firstMonth, midMonth, finalMonth },
  };
}

export function compareLoans(a: LoanOutput, b: LoanOutput): LoanComparison {
  const pct = (diff: number, base: number) => (base === 0 ? 0 : (diff / base) * 100);

  const monthlyDiffCents = b.monthlyPaymentCents - a.monthlyPaymentCents;
  const totalInterestDiffCents = b.totalInterestCents - a.totalInterestCents;
  const totalRepaidDiffCents = b.totalRepaidCents - a.totalRepaidCents;

  return {
    monthlyDiffCents,
    totalInterestDiffCents,
    totalRepaidDiffCents,
    monthlyDiffPct: pct(monthlyDiffCents, a.monthlyPaymentCents),
    totalInterestDiffPct: pct(totalInterestDiffCents, a.totalInterestCents),
    totalRepaidDiffPct: pct(totalRepaidDiffCents, a.totalRepaidCents),
  };
}
