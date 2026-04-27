/**
 * Pension contribution calculations — Irish tax rules.
 *
 * Key rules:
 *  • Employee pension contributions receive income tax (PAYE) relief at marginal rate.
 *  • USC and PRSI are still calculated on gross salary — no relief on these.
 *  • Maximum relief is capped as a % of net relevant earnings, by age (Revenue.ie).
 *  • There is an earnings ceiling of €115,000 for relief purposes.
 *
 * TODO(pre-pilot): verify rates and caps against Revenue.ie guidance before launch.
 */

export type AgeBand =
  | 'under30'
  | '30to39'
  | '40to49'
  | '50to54'
  | '55to59'
  | '60plus';

export const AGE_BAND_LABELS: Record<AgeBand, string> = {
  under30: 'Under 30',
  '30to39': '30–39',
  '40to49': '40–49',
  '50to54': '50–54',
  '55to59': '55–59',
  '60plus': '60 or over',
};

/** Max employee pension contribution as % of net relevant earnings, by age. Revenue.ie. */
export const AGE_BAND_RELIEF_PCT: Record<AgeBand, number> = {
  under30: 15,
  '30to39': 20,
  '40to49': 25,
  '50to54': 30,
  '55to59': 35,
  '60plus': 40,
};

export type AutoEnrolPhase = 1 | 2 | 3 | 4;

export const PHASE_LABELS: Record<AutoEnrolPhase, string> = {
  1: 'Phase 1 (2025–27)',
  2: 'Phase 2 (2028–29)',
  3: 'Phase 3 (2030–31)',
  4: 'Phase 4 (2033+)',
};

/** Auto-enrolment contribution rates per phase (as decimals). */
export const AUTO_ENROL_RATES: Record<
  AutoEnrolPhase,
  { employee: number; employer: number; state: number }
> = {
  1: { employee: 0.015, employer: 0.015, state: 0.005 },
  2: { employee: 0.03, employer: 0.03, state: 0.01 },
  3: { employee: 0.045, employer: 0.045, state: 0.015 },
  4: { employee: 0.06, employer: 0.06, state: 0.02 },
};

/** Revenue earnings ceiling for pension relief purposes (2026). */
export const PENSION_EARNINGS_CAP = 115_000;

export type PensionBreakdown = {
  /** Annual employee pension contribution (may be capped by age or earnings ceiling). */
  employeeContribution: number;
  /** Annual employer contribution (0 for custom/own-pension mode). */
  employerContribution: number;
  /** Annual state contribution (auto-enrolment only). */
  stateContribution: number;
  /** Total annual going into the pot. */
  totalPotContribution: number;
  /** Annual PAYE saving from relief. Actual delta — handles threshold crossing correctly. */
  payeSaving: number;
  /** True cost to employee after tax relief. */
  trueCost: number;
  /** True: contribution was limited by the age-band ceiling. */
  cappedByAge: boolean;
  /** True: gross exceeded €115,000 earnings cap. */
  cappedByEarnings: boolean;
  /** The age-band max percentage that applies. */
  maxEmployeeContribPct: number;
};

/**
 * Compute pension contribution breakdown.
 *
 * @param gross              - annual gross salary
 * @param employeePct        - employee contribution as whole number (e.g. 5 = 5%)
 * @param employerPct        - employer contribution as whole number
 * @param statePct           - state contribution as whole number
 * @param ageBand            - age band (determines max relief ceiling)
 * @param payeWithPension    - PAYE after pension deduction (caller provides, from calcNet on taxable income)
 * @param payeWithoutPension - PAYE on gross without pension
 */
export function calcPension(params: {
  gross: number;
  employeePct: number;
  employerPct: number;
  statePct: number;
  ageBand: AgeBand;
  payeWithPension: number;
  payeWithoutPension: number;
}): PensionBreakdown {
  const {
    gross,
    employeePct,
    employerPct,
    statePct,
    ageBand,
    payeWithPension,
    payeWithoutPension,
  } = params;

  const cappedEarnings = Math.min(gross, PENSION_EARNINGS_CAP);
  const cappedByEarnings = gross > PENSION_EARNINGS_CAP;
  const maxReliefPct = AGE_BAND_RELIEF_PCT[ageBand];
  const maxEmployeeContrib = (cappedEarnings * maxReliefPct) / 100;

  const uncappedEmployeeContrib = (gross * employeePct) / 100;
  const cappedByAge = uncappedEmployeeContrib > maxEmployeeContrib;
  const employeeContribution = Math.min(uncappedEmployeeContrib, maxEmployeeContrib);

  const employerContribution = (gross * employerPct) / 100;
  const stateContribution = (gross * statePct) / 100;
  const totalPotContribution =
    employeeContribution + employerContribution + stateContribution;

  // Use actual PAYE delta — handles the 20%/40% threshold crossing correctly
  const payeSaving = payeWithoutPension - payeWithPension;
  const trueCost = employeeContribution - payeSaving;

  return {
    employeeContribution: Math.round(employeeContribution),
    employerContribution: Math.round(employerContribution),
    stateContribution: Math.round(stateContribution),
    totalPotContribution: Math.round(totalPotContribution),
    payeSaving: Math.round(payeSaving),
    trueCost: Math.round(trueCost),
    cappedByAge,
    cappedByEarnings,
    maxEmployeeContribPct: maxReliefPct,
  };
}
