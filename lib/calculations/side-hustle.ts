/**
 * Side hustle tax calculator — Ireland.
 * Models the additional tax liability from non-PAYE income (freelance,
 * self-employment, rental, etc.) on top of a PAYE salary.
 *
 * Key Irish rules modelled:
 *
 * PAYE income tax (Budget 2026):
 *   - Standard rate 20% on first €44,000 (single person)
 *   - Higher rate 40% above that
 *   - Credits: personal + PAYE = €4,000
 *
 * Non-PAYE income additions:
 *   - Added to PAYE income for marginal rate calculation
 *   - USC applies at marginal rate on total income
 *   - PRSI: Class S (self-employed) at 4% on non-PAYE income
 *     (vs PAYE Class A 4.1% — Class S has a lower rate but no employer contribution)
 *   - No PAYE credit on self-employed income
 *
 * Self-assessment obligation:
 *   - A Form 11 (self-assessed return) is required if non-PAYE income > €5,000/year
 *     OR if total gross income > €50,000/year
 *   - Preliminary tax must be paid by 31 October (90% of current year liability)
 *
 * Sources: Revenue.ie (Income Tax, USC, PRSI Class S guidance).
 */

import { calcNet } from '@/lib/tax';

export const FORM_11_THRESHOLD = 5_000; // non-PAYE income above which Form 11 required
export const TOTAL_INCOME_FORM_11_THRESHOLD = 50_000; // total income threshold
export const CLASS_S_PRSI_RATE = 0.04; // self-employed PRSI rate
export const PRELIMINARY_TAX_RATE = 0.9; // 90% of current year liability

export type SideHustleInputs = {
  /** Annual gross PAYE salary */
  payeSalary: number;
  /** Annual non-PAYE income (freelance, consultancy, rental, etc.) */
  sideIncome: number;
};

export type SideHustleResult = {
  /** Tax on PAYE salary alone */
  payeOnlyTax: number;
  payeOnlyNet: number;

  /** Tax on combined income */
  combinedTax: number;
  combinedNet: number;

  /** Additional income tax on side hustle (marginal PAYE rate) */
  additionalPaye: number;
  /** Additional USC on side hustle (at marginal rate) */
  additionalUsc: number;
  /** Class S PRSI on side hustle income */
  classSPrsi: number;
  /** Total additional tax from side hustle */
  totalAdditionalTax: number;
  /** Take-home from side income after all additional taxes */
  sideIncomeNetTakeHome: number;
  /** Effective tax rate on side income */
  effectiveSideRatePct: number;

  /** Marginal PAYE rate that applies to the first €1 of side income */
  marginalPayeRate: number;
  /** Marginal USC rate that applies to the first €1 of side income */
  marginalUscRate: number;

  /** Whether Form 11 (self-assessment) is required */
  requiresForm11: boolean;
  /** Reason(s) Form 11 is required (for display) */
  form11Reasons: string[];

  /** Preliminary tax amount (90% of current year additional liability) */
  preliminaryTax: number;
};

/** Calculate marginal PAYE rate at a given gross income */
function marginalPayeRate(gross: number): number {
  return gross < 44_000 ? 0.2 : 0.4;
}

/** Calculate marginal USC rate at a given gross income */
function marginalUscRate(gross: number): number {
  if (gross <= 12_012) return 0.005;
  if (gross <= 27_382) return 0.02;
  if (gross <= 70_044) return 0.04;
  return 0.08;
}

/** Estimate additional PAYE on side income (handles band crossings) */
function calcAdditionalPaye(payeSalary: number, sideIncome: number): number {
  const payeOnly = calcNet(payeSalary);
  const combined = calcNet(payeSalary + sideIncome);
  return combined.paye - payeOnly.paye;
}

/** Estimate additional USC on side income */
function calcAdditionalUsc(payeSalary: number, sideIncome: number): number {
  const payeOnly = calcNet(payeSalary);
  const combined = calcNet(payeSalary + sideIncome);
  return combined.usc - payeOnly.usc;
}

export function calcSideHustle(inputs: SideHustleInputs): SideHustleResult {
  const { payeSalary, sideIncome } = inputs;
  const totalIncome = payeSalary + sideIncome;

  // Tax on PAYE salary alone
  const payeOnly = calcNet(payeSalary);

  // Combined income — used for PAYE + USC calculation
  const combined = calcNet(totalIncome);

  // Additional PAYE on side income
  const additionalPaye = combined.paye - payeOnly.paye;
  // Additional USC on side income
  const additionalUsc = combined.usc - payeOnly.usc;
  // Class S PRSI on side income
  const classSPrsi = Math.round(sideIncome * CLASS_S_PRSI_RATE);

  const totalAdditionalTax = additionalPaye + additionalUsc + classSPrsi;
  const sideIncomeNetTakeHome = Math.max(0, sideIncome - totalAdditionalTax);

  const effectiveSideRatePct =
    sideIncome > 0 ? Math.round((totalAdditionalTax / sideIncome) * 1000) / 10 : 0;

  const combinedTax = payeOnly.paye + additionalPaye + payeOnly.usc + additionalUsc + classSPrsi;
  const combinedNet = totalIncome - combinedTax;

  // Marginal rates at the salary level (applicable to first euro of side income)
  const mPaye = marginalPayeRate(payeSalary);
  const mUsc = marginalUscRate(payeSalary);

  // Form 11 obligation
  const form11Reasons: string[] = [];
  if (sideIncome > FORM_11_THRESHOLD) {
    form11Reasons.push(`Non-PAYE income exceeds €${FORM_11_THRESHOLD.toLocaleString()}`);
  }
  if (totalIncome > TOTAL_INCOME_FORM_11_THRESHOLD) {
    form11Reasons.push(`Total income exceeds €${TOTAL_INCOME_FORM_11_THRESHOLD.toLocaleString()}`);
  }
  const requiresForm11 = form11Reasons.length > 0;

  // Preliminary tax = 90% of total additional liability
  const preliminaryTax = Math.round(totalAdditionalTax * PRELIMINARY_TAX_RATE);

  return {
    payeOnlyTax: payeOnly.paye + payeOnly.usc + payeOnly.prsi,
    payeOnlyNet: payeOnly.net,
    combinedTax,
    combinedNet,
    additionalPaye,
    additionalUsc,
    classSPrsi,
    totalAdditionalTax,
    sideIncomeNetTakeHome,
    effectiveSideRatePct,
    marginalPayeRate: mPaye,
    marginalUscRate: mUsc,
    requiresForm11,
    form11Reasons,
    preliminaryTax,
  };
}
