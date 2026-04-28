/**
 * Salary sacrifice calculations for Irish tax-exempt schemes.
 *
 * Both Bike-to-Work and Tax Saver Commuter work by reducing gross salary
 * before tax, so the employee saves PAYE + USC + PRSI on the sacrificed amount.
 *
 * Tax saving = total_deductions(salary) − total_deductions(salary − sacrifice)
 * Net cost   = sacrifice_amount − tax_saving
 */

import { calcNet } from '@/lib/tax';

/** Scheme caps per current Revenue rules (updated April 2026) */
export const BIKE_TO_WORK_CAP_STANDARD = 1_500; // standard & cargo bikes
export const BIKE_TO_WORK_CAP_EBIKE = 3_000;    // pedelecs / e-bikes
export const TAX_SAVER_MAX = 10_000;             // no statutory cap; practical upper limit
export const BIKE_CYCLE_YEARS = 4;               // once every 4 years per employer

/** Common commuter pass presets (approximate 2025/26 annual costs) */
export const COMMUTER_PRESETS = [
  { label: 'Dublin Bus (annual)', value: 1_100 },
  { label: 'Luas cross-city (annual)', value: 1_470 },
  { label: 'DART (annual)', value: 1_510 },
  { label: 'Rail + Bus (combo)', value: 2_100 },
] as const;

export type SacrificeResult = {
  sacrificeAmount: number;
  taxSaving: number;
  netCost: number;
  effectiveDiscountPct: number; // e.g. 40.5 → "40.5%"
  monthlySaving: number;
};

/**
 * Calculate savings from a salary sacrifice scheme.
 *
 * @param grossAnnual  Annual gross salary (€)
 * @param sacrifice    Amount being sacrificed (€, pre-capped by caller)
 */
export function calcSacrifice(grossAnnual: number, sacrifice: number): SacrificeResult {
  if (sacrifice <= 0 || grossAnnual <= 0) {
    return {
      sacrificeAmount: 0,
      taxSaving: 0,
      netCost: 0,
      effectiveDiscountPct: 0,
      monthlySaving: 0,
    };
  }

  const before = calcNet(grossAnnual);
  const after = calcNet(Math.max(0, grossAnnual - sacrifice));

  const deductionsBefore = before.paye + before.usc + before.prsi;
  const deductionsAfter = after.paye + after.usc + after.prsi;

  const taxSaving = Math.round(deductionsBefore - deductionsAfter);
  const netCost = Math.max(0, sacrifice - taxSaving);
  const effectiveDiscountPct = Math.round((taxSaving / sacrifice) * 1000) / 10; // 1dp
  const monthlySaving = Math.round((taxSaving / 12) * 100) / 100;

  return {
    sacrificeAmount: sacrifice,
    taxSaving,
    netCost,
    effectiveDiscountPct,
    monthlySaving,
  };
}
