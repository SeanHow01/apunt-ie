/**
 * Buy vs Rent comparison calculator.
 * Pure functions only — no React, no side effects.
 *
 * Model:
 *   Buyer:  pays deposit + stamp duty + legal fees upfront, then monthly mortgage + maintenance.
 *           Net position = equity − upfront costs − total mortgage paid − total maintenance.
 *
 *   Renter: invests the equivalent upfront costs at the investment return rate.
 *           Net position = invested capital − total rent paid.
 *
 * Breakeven year: first year where buy net position ≥ rent net position.
 *
 * Stamp duty (Ireland):
 *   1% on first €1,000,000 of residential property value.
 *   2% on the balance above €1,000,000.
 * Source: Revenue.ie (Finance Act 2017 as amended).
 */

export const STAMP_DUTY_THRESHOLD = 1_000_000;
export const STAMP_DUTY_RATE_BELOW = 0.01;
export const STAMP_DUTY_RATE_ABOVE = 0.02;
export const LEGAL_FEES_ESTIMATE = 2_500; // conveyancing estimate, excl. VAT

export type BuyVsRentInputs = {
  /** Property purchase price, € */
  propertyPrice: number;
  /** Deposit as a percentage of property price, e.g. 10 for 10% */
  depositPct: number;
  /** Annual mortgage interest rate, e.g. 4 for 4% */
  mortgageRatePct: number;
  /** Mortgage term in years */
  mortgageTermYears: number;
  /** Annual property price growth rate, e.g. 3 for 3% */
  propertyGrowthPct: number;
  /** Annual maintenance cost as % of current property value, e.g. 1 for 1% */
  maintenancePct: number;
  /** Current monthly rent, € */
  monthlyRent: number;
  /** Annual rent increase rate, e.g. 2 for 2% */
  rentIncreasePct: number;
  /** Annual return rate if renter invests the upfront costs, e.g. 5 for 5% */
  investmentReturnPct: number;
  /** How many years to model (1–30) */
  years: number;
};

export type YearlySnapshot = {
  year: number;
  /** Property equity (value − remaining balance) */
  buyEquity: number;
  /** equity − upfrontCosts − totalMortgagePaid − totalMaintenance */
  buyNetPosition: number;
  /** Invested capital (upfront costs compounded) */
  rentInvestedCapital: number;
  /** investedCapital − totalRentPaid */
  rentNetPosition: number;
};

export type BuyVsRentResult = {
  deposit: number;
  stampDuty: number;
  legalFees: number;
  upfrontCosts: number;
  mortgagePrincipal: number;
  monthlyMortgagePayment: number;
  snapshots: YearlySnapshot[];
  /** First year where buyNetPosition ≥ rentNetPosition, or null if never within the period */
  breakevenYear: number | null;
};

export function calcStampDuty(price: number): number {
  const below = Math.min(price, STAMP_DUTY_THRESHOLD) * STAMP_DUTY_RATE_BELOW;
  const above = Math.max(0, price - STAMP_DUTY_THRESHOLD) * STAMP_DUTY_RATE_ABOVE;
  return below + above;
}

export function calcMonthlyPayment(principal: number, annualRatePct: number, termYears: number): number {
  const monthlyRate = annualRatePct / 100 / 12;
  const n = termYears * 12;
  if (monthlyRate === 0) return principal / n;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);
}

export function calcBuyVsRent(inputs: BuyVsRentInputs): BuyVsRentResult {
  const {
    propertyPrice,
    depositPct,
    mortgageRatePct,
    mortgageTermYears,
    propertyGrowthPct,
    maintenancePct,
    monthlyRent,
    rentIncreasePct,
    investmentReturnPct,
    years,
  } = inputs;

  // ── Upfront costs ──────────────────────────────────────────────────────────
  const deposit = propertyPrice * (depositPct / 100);
  const stampDuty = calcStampDuty(propertyPrice);
  const legalFees = LEGAL_FEES_ESTIMATE;
  const upfrontCosts = deposit + stampDuty + legalFees;

  // ── Mortgage ───────────────────────────────────────────────────────────────
  const mortgagePrincipal = propertyPrice - deposit;
  const monthlyMortgagePayment = calcMonthlyPayment(
    mortgagePrincipal,
    mortgageRatePct,
    mortgageTermYears,
  );
  const monthlyRate = mortgageRatePct / 100 / 12;

  const propertyGrowthRate = propertyGrowthPct / 100;
  const rentIncreaseRate = rentIncreasePct / 100;
  const investmentReturn = investmentReturnPct / 100;

  // ── Year-by-year simulation ────────────────────────────────────────────────
  let balance = mortgagePrincipal;
  let totalMortgagePaid = 0;
  let totalMaintenance = 0;
  let totalRentPaid = 0;
  // Renter invests the buyer's upfront costs from day 0
  let investedCapital = upfrontCosts;

  const snapshots: YearlySnapshot[] = [];
  let breakevenYear: number | null = null;

  for (let y = 1; y <= years; y++) {
    // BUY: amortise 12 mortgage payments for this year
    if (y <= mortgageTermYears) {
      for (let m = 0; m < 12; m++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyMortgagePayment - interestPayment;
        balance = Math.max(0, balance - principalPayment);
        totalMortgagePaid += monthlyMortgagePayment;
      }
    }
    // After mortgageTerm: balance = 0, no more payments

    // Property value at end of year Y
    const propertyValue = propertyPrice * Math.pow(1 + propertyGrowthRate, y);
    const buyEquity = propertyValue - balance;

    // Annual maintenance (% of current property value)
    totalMaintenance += propertyValue * (maintenancePct / 100);

    const buyNetPosition = buyEquity - upfrontCosts - totalMortgagePaid - totalMaintenance;

    // RENT: annual rent grows each year
    const yearlyRent = monthlyRent * 12 * Math.pow(1 + rentIncreaseRate, y - 1);
    totalRentPaid += yearlyRent;

    // Invested capital compounds annually
    investedCapital *= 1 + investmentReturn;

    const rentNetPosition = investedCapital - totalRentPaid;

    if (breakevenYear === null && buyNetPosition >= rentNetPosition) {
      breakevenYear = y;
    }

    snapshots.push({
      year: y,
      buyEquity,
      buyNetPosition,
      rentNetPosition,
      rentInvestedCapital: investedCapital,
    });
  }

  return {
    deposit,
    stampDuty,
    legalFees,
    upfrontCosts,
    mortgagePrincipal,
    monthlyMortgagePayment,
    snapshots,
    breakevenYear,
  };
}
