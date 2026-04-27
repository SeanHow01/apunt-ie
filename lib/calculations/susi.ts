/**
 * SUSI eligibility estimator — Student Universal Support Ireland.
 *
 * Grant year: 2025/26 (income assessed from tax year 2024).
 * Source: susi.ie — Means Assessment, Income Thresholds for 2025/26.
 *
 * This is an estimate only. SUSI's actual assessment considers many additional
 * factors not modelled here (siblings in college, income disregards, etc.).
 * Always check susi.ie for the definitive position.
 *
 * Income thresholds increase by €4,830 for each additional dependent household
 * member beyond the base case of 1 (the applicant alone).
 */

export const SUSI_GRANT_YEAR = '2025/26';
export const SUSI_INCOME_YEAR = 2024;

/** Threshold increment per additional dependent household member (beyond 1) */
export const DEPENDENT_INCREMENT = 4_830;

/**
 * Non-adjacent (living > 45 km from college, or in approved rented accommodation)
 * Annual maintenance grant amounts.
 */
export const NON_ADJACENT_AMOUNTS = {
  specialRate: 6_009,
  standardRate: 3_210,
  partialRate75: 2_407,
  partialRate50: 1_605,
  partialRate25: 803,
} as const;

/**
 * Adjacent (living at home or within 45 km of college)
 * Annual maintenance grant amounts.
 */
export const ADJACENT_AMOUNTS = {
  specialRate: 2_425,
  standardRate: 1_560,
  partialRate75: 1_170,
  partialRate50: 780,
  partialRate25: 390,
} as const;

/**
 * Base income thresholds for 1 dependent household member.
 * For each additional member (2nd, 3rd…): add DEPENDENT_INCREMENT to each threshold.
 */
export const BASE_THRESHOLDS = {
  /** Household income at or below this → special rate grant */
  specialRate: 24_500,
  /** Household income at or below this → standard rate grant */
  standardRate: 46_790,
  /** Household income at or below this → 75% partial grant */
  partialRate75: 52_435,
  /** Household income at or below this → 50% partial grant */
  partialRate50: 56_100,
  /** Household income at or below this → 25% partial grant */
  partialRate25: 59_650,
  /** Above this: no grant */
  upperLimit: 62_000,
} as const;

export type GrantBand =
  | 'special'
  | 'standard'
  | 'partial75'
  | 'partial50'
  | 'partial25'
  | 'none';

export type SUSIInputs = {
  /** Total reckonable household income from tax year 2024 (€) */
  householdIncome: number;
  /** Total number of dependent household members (including the student applicant) */
  dependents: number;
  /** Whether the student lives within 45 km of their college */
  adjacent: boolean;
  /** Whether the student is attending full-time (part-time grants are smaller) */
  fullTime: boolean;
};

export type SUSIResult = {
  band: GrantBand;
  /** Estimated annual maintenance grant (€0 if not eligible) */
  estimatedGrant: number;
  /** The effective income threshold for this household */
  effectiveThreshold: number;
  /** How far the household income is below/above the standard rate threshold */
  incomeHeadroom: number;
  /** True if they should apply */
  shouldApply: boolean;
  /** Label for the band, suitable for display */
  bandLabel: string;
};

type Thresholds = {
  specialRate: number;
  standardRate: number;
  partialRate75: number;
  partialRate50: number;
  partialRate25: number;
  upperLimit: number;
};

/** Compute effective thresholds for a given number of dependents */
function effectiveThresholds(dependents: number): Thresholds {
  const extra = Math.max(0, dependents - 1) * DEPENDENT_INCREMENT;
  return {
    specialRate: BASE_THRESHOLDS.specialRate + extra,
    standardRate: BASE_THRESHOLDS.standardRate + extra,
    partialRate75: BASE_THRESHOLDS.partialRate75 + extra,
    partialRate50: BASE_THRESHOLDS.partialRate50 + extra,
    partialRate25: BASE_THRESHOLDS.partialRate25 + extra,
    upperLimit: BASE_THRESHOLDS.upperLimit + extra,
  };
}

function grantAmount(band: GrantBand, adjacent: boolean): number {
  const amounts = adjacent ? ADJACENT_AMOUNTS : NON_ADJACENT_AMOUNTS;
  switch (band) {
    case 'special': return amounts.specialRate;
    case 'standard': return amounts.standardRate;
    case 'partial75': return amounts.partialRate75;
    case 'partial50': return amounts.partialRate50;
    case 'partial25': return amounts.partialRate25;
    default: return 0;
  }
}

const BAND_LABELS: Record<GrantBand, string> = {
  special: 'Special rate',
  standard: 'Standard rate',
  partial75: 'Partial rate (75%)',
  partial50: 'Partial rate (50%)',
  partial25: 'Partial rate (25%)',
  none: 'Not eligible',
};

export function calcSUSI(inputs: SUSIInputs): SUSIResult {
  const { householdIncome, dependents, adjacent, fullTime } = inputs;
  const thresholds = effectiveThresholds(Math.max(1, dependents));

  let band: GrantBand;
  let effectiveThreshold: number;

  if (householdIncome <= thresholds.specialRate) {
    band = 'special';
    effectiveThreshold = thresholds.specialRate;
  } else if (householdIncome <= thresholds.standardRate) {
    band = 'standard';
    effectiveThreshold = thresholds.standardRate;
  } else if (householdIncome <= thresholds.partialRate75) {
    band = 'partial75';
    effectiveThreshold = thresholds.partialRate75;
  } else if (householdIncome <= thresholds.partialRate50) {
    band = 'partial50';
    effectiveThreshold = thresholds.partialRate50;
  } else if (householdIncome <= thresholds.partialRate25) {
    band = 'partial25';
    effectiveThreshold = thresholds.partialRate25;
  } else {
    band = 'none';
    effectiveThreshold = thresholds.upperLimit;
  }

  let estimatedGrant = grantAmount(band, adjacent);

  // Part-time students receive a reduced grant (approximately half)
  if (!fullTime && band !== 'none') {
    estimatedGrant = Math.round(estimatedGrant * 0.5);
  }

  return {
    band,
    estimatedGrant,
    effectiveThreshold,
    incomeHeadroom: effectiveThreshold - householdIncome,
    shouldApply: band !== 'none',
    bandLabel: BAND_LABELS[band],
  };
}
