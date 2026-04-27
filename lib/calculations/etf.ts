/**
 * ETF and investment trust tax calculations — Irish tax rules.
 *
 * UCITS ETFs (most mainstream index funds):
 *  • Exit tax of 41% on all gains (no CGT annual exemption, no indexation)
 *  • 8-year deemed disposal rule: every 8 years you are treated as having sold
 *    and repurchased all units. Tax is due on the gain at that point, and your
 *    cost basis resets to the market value.
 *
 * Investment trusts / direct shares:
 *  • Capital Gains Tax (CGT) at 33% on disposal
 *  • Annual CGT exemption of €1,270 applies in the year of sale
 *  • No deemed disposal rule
 *
 * This model:
 *  - Lump-sum investment only (no ongoing contributions)
 *  - Growth-only (no dividends distributed separately)
 *  - Deemed disposal taxes are paid from outside the portfolio; the portfolio
 *    itself continues to compound at the stated rate
 *
 * TODO(pre-pilot): verify 41% rate, €1,270 exemption, and 8-year rule against
 * current Revenue.ie guidance before pilot launch.
 */

export const ETF_EXIT_TAX_RATE = 0.41;
export const CGT_RATE = 0.33;
export const CGT_ANNUAL_EXEMPTION = 1270;
export const DEEMED_DISPOSAL_CYCLE = 8; // years

export type DeemedDisposalEvent = {
  year: number;
  portfolioValue: number;
  costBasisAtEvent: number;
  gainSinceLastEvent: number;
  taxDue: number;
  newCostBasis: number;
};

export type ETFResult = {
  /** Final portfolio value before exit tax. */
  finalValue: number;
  totalInvested: number;
  totalGrossGain: number;
  /** Deemed disposal events at years 8, 16, 24, ... (within the period). */
  deemedDisposals: DeemedDisposalEvent[];
  /** Exit tax payable on the remaining gain at final disposal. */
  finalExitTax: number;
  /** Sum of all deemed disposal taxes + final exit tax. */
  totalTaxPaid: number;
  /** finalValue − totalTaxPaid */
  netAfterTax: number;
  /** totalTaxPaid / totalGrossGain (percentage of gains taken as tax). */
  effectiveTaxRatePct: number;
};

export type InvestmentTrustResult = {
  finalValue: number;
  totalInvested: number;
  totalGrossGain: number;
  /** €1,270 CGT exemption (capped to actual gain). */
  cgtExemptionApplied: number;
  taxableGain: number;
  taxPaid: number;
  netAfterTax: number;
  effectiveTaxRatePct: number;
};

/**
 * Calculate UCITS ETF outcome including 8-year deemed disposal events.
 *
 * @param initial - lump sum invested (€)
 * @param annualGrowthPct - annual growth rate (e.g. 7 = 7%)
 * @param years - holding period
 */
export function calcETF(
  initial: number,
  annualGrowthPct: number,
  years: number,
): ETFResult {
  const g = annualGrowthPct / 100;
  const deemedDisposals: DeemedDisposalEvent[] = [];
  let costBasis = initial;
  let totalDeemedTax = 0;

  // Process deemed disposal events at multiples of 8 within the holding period
  for (
    let year = DEEMED_DISPOSAL_CYCLE;
    year < years;
    year += DEEMED_DISPOSAL_CYCLE
  ) {
    const portfolioValue = initial * Math.pow(1 + g, year);
    const gainSinceLastEvent = portfolioValue - costBasis;

    if (gainSinceLastEvent > 0) {
      const taxDue = gainSinceLastEvent * ETF_EXIT_TAX_RATE;
      totalDeemedTax += taxDue;

      deemedDisposals.push({
        year,
        portfolioValue: Math.round(portfolioValue),
        costBasisAtEvent: Math.round(costBasis),
        gainSinceLastEvent: Math.round(gainSinceLastEvent),
        taxDue: Math.round(taxDue),
        newCostBasis: Math.round(portfolioValue),
      });

      costBasis = portfolioValue; // cost basis resets to current market value
    }
  }

  const finalValue = initial * Math.pow(1 + g, years);
  const finalGain = finalValue - costBasis;
  const finalExitTax = finalGain > 0 ? finalGain * ETF_EXIT_TAX_RATE : 0;
  const totalTaxPaid = totalDeemedTax + finalExitTax;
  const totalGrossGain = finalValue - initial;
  const netAfterTax = finalValue - totalTaxPaid;
  const effectiveTaxRatePct =
    totalGrossGain > 0 ? (totalTaxPaid / totalGrossGain) * 100 : 0;

  return {
    finalValue: Math.round(finalValue),
    totalInvested: Math.round(initial),
    totalGrossGain: Math.round(totalGrossGain),
    deemedDisposals,
    finalExitTax: Math.round(finalExitTax),
    totalTaxPaid: Math.round(totalTaxPaid),
    netAfterTax: Math.round(netAfterTax),
    effectiveTaxRatePct: Math.round(effectiveTaxRatePct * 10) / 10,
  };
}

/**
 * Calculate investment trust / direct shares outcome at CGT rates.
 *
 * @param initial - lump sum invested (€)
 * @param annualGrowthPct - annual growth rate (e.g. 7 = 7%)
 * @param years - holding period
 */
export function calcInvestmentTrust(
  initial: number,
  annualGrowthPct: number,
  years: number,
): InvestmentTrustResult {
  const g = annualGrowthPct / 100;
  const finalValue = initial * Math.pow(1 + g, years);
  const totalGrossGain = finalValue - initial;
  const cgtExemptionApplied = Math.min(totalGrossGain, CGT_ANNUAL_EXEMPTION);
  const taxableGain = Math.max(0, totalGrossGain - cgtExemptionApplied);
  const taxPaid = taxableGain * CGT_RATE;
  const netAfterTax = finalValue - taxPaid;
  const effectiveTaxRatePct =
    totalGrossGain > 0 ? (taxPaid / totalGrossGain) * 100 : 0;

  return {
    finalValue: Math.round(finalValue),
    totalInvested: Math.round(initial),
    totalGrossGain: Math.round(totalGrossGain),
    cgtExemptionApplied: Math.round(cgtExemptionApplied),
    taxableGain: Math.round(taxableGain),
    taxPaid: Math.round(taxPaid),
    netAfterTax: Math.round(netAfterTax),
    effectiveTaxRatePct: Math.round(effectiveTaxRatePct * 10) / 10,
  };
}
