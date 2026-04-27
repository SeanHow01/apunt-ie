/**
 * Irish financial calendar — key annual tax, savings, and deadline dates.
 * Events are fixed to a calendar year and shown month-by-month.
 *
 * Sources: Revenue.ie, susi.ie, Citizens Information, Central Bank of Ireland.
 */

export type CalendarCategory =
  | 'tax'
  | 'savings'
  | 'deadline'
  | 'benefits'
  | 'planning'
  | 'budget';

export type CalendarEvent = {
  id: string;
  /** Day of month (1-based). Null for month-level events with no fixed date. */
  day: number | null;
  /** Human-readable date label, e.g. "31 January" or "Mid-October" */
  dateLabel: string;
  title: string;
  description: string;
  category: CalendarCategory;
  /** Whether this is especially high-priority / consequential */
  important: boolean;
  /** Internal Punt link */
  href?: string;
  /** External government/regulatory link */
  externalHref?: string;
};

export type CalendarMonth = {
  month: number; // 1-based
  name: string;
  events: CalendarEvent[];
};

export const CATEGORY_LABELS: Record<CalendarCategory, string> = {
  tax: 'Tax',
  savings: 'Savings',
  deadline: 'Deadline',
  benefits: 'Benefits',
  planning: 'Planning',
  budget: 'Budget',
};

/** Events grouped by month (1 = January … 12 = December) */
const RAW_EVENTS: Array<CalendarEvent & { month: number }> = [

  // ── January ────────────────────────────────────────────────────────────────
  {
    id: 'jan-new-year',
    month: 1, day: 1,
    dateLabel: '1 January',
    title: 'New tax year begins',
    description: 'Budget changes take effect: new USC bands, PRSI rate, and tax credits. Check your first payslip carefully.',
    category: 'tax',
    important: true,
    href: '/calculator',
  },
  {
    id: 'jan-cgt-deadline',
    month: 1, day: 31,
    dateLabel: '31 January',
    title: 'CGT payment deadline (Aug–Dec gains)',
    description: 'Capital Gains Tax on disposals made between 1 August and 31 December of the previous year must be paid by 31 January. Late payment attracts interest.',
    category: 'deadline',
    important: true,
    externalHref: 'https://www.revenue.ie/en/gains-gifts-and-inheritance/cgt-for-individuals/payment-of-cgt.aspx',
  },
  {
    id: 'jan-payslip',
    month: 1, day: null,
    dateLabel: 'First payday',
    title: 'Check your January payslip',
    description: 'Verify new tax credits and USC bands are applied correctly. Emergency tax indicators on your payslip should say "Cumulative".',
    category: 'tax',
    important: false,
    href: '/lessons/payslip',
  },

  // ── February ───────────────────────────────────────────────────────────────
  {
    id: 'feb-p21',
    month: 2, day: null,
    dateLabel: 'From February',
    title: 'Request a P21 / Income Tax Statement',
    description: 'If you overpaid tax last year, log into myAccount on Revenue.ie and request a P21 review — refunds are usually processed within days.',
    category: 'tax',
    important: false,
    externalHref: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/income-and-employment/p21-balancing-statement/index.aspx',
  },
  {
    id: 'feb-lpt',
    month: 2, day: null,
    dateLabel: 'February',
    title: 'Local Property Tax (LPT) — annual notice',
    description: 'Revenue sends LPT notices in February for property owners. Confirm your payment method is set up before the March deadline.',
    category: 'tax',
    important: false,
    externalHref: 'https://www.revenue.ie/en/property/local-property-tax/index.aspx',
  },

  // ── March ──────────────────────────────────────────────────────────────────
  {
    id: 'mar-lpt-deadline',
    month: 3, day: 21,
    dateLabel: '21 March',
    title: 'LPT single payment or phased debit deadline',
    description: 'If you pay Local Property Tax in full or by annual direct debit, the mandate must be in place by 21 March.',
    category: 'deadline',
    important: true,
    externalHref: 'https://www.revenue.ie/en/property/local-property-tax/index.aspx',
  },
  {
    id: 'mar-rent-credit',
    month: 3, day: null,
    dateLabel: 'March',
    title: 'Claim the rent tax credit if you haven\'t',
    description: 'Renters can claim €1,000/year (or €2,000 jointly assessed). Claim via myAccount — 2024 and 2025 years are currently claimable.',
    category: 'benefits',
    important: false,
    externalHref: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/housing/rent-credit/index.aspx',
  },

  // ── April ──────────────────────────────────────────────────────────────────
  {
    id: 'apr-q1-review',
    month: 4, day: null,
    dateLabel: 'April',
    title: 'Q1 financial review',
    description: 'Three months of data is enough to see spending patterns. Review your budget categories and emergency fund progress.',
    category: 'planning',
    important: false,
  },
  {
    id: 'apr-susi-prep',
    month: 4, day: null,
    dateLabel: 'April–May',
    title: 'Prepare for SUSI grant applications',
    description: 'SUSI opens in May. Start gathering household income documents (2024 tax statements, P60s) for the grant application.',
    category: 'benefits',
    important: false,
    href: '/tools/susi-estimator',
  },

  // ── May ────────────────────────────────────────────────────────────────────
  {
    id: 'may-susi-opens',
    month: 5, day: null,
    dateLabel: 'Late May',
    title: 'SUSI applications open',
    description: 'The Student Universal Support Ireland grant portal typically opens in late April/May. Apply as early as possible — processing takes 6–8 weeks.',
    category: 'benefits',
    important: true,
    href: '/tools/susi-estimator',
    externalHref: 'https://www.susi.ie',
  },
  {
    id: 'may-pension-check',
    month: 5, day: null,
    dateLabel: 'May',
    title: 'Review auto-enrolment contributions',
    description: 'Check your pension pot statement from your provider. Confirm your contribution level and fund choice match your goals.',
    category: 'savings',
    important: false,
    href: '/lessons/auto-enrolment',
  },

  // ── June ───────────────────────────────────────────────────────────────────
  {
    id: 'jun-susi-deadline',
    month: 6, day: null,
    dateLabel: 'June–July',
    title: 'SUSI application deadline',
    description: 'SUSI applications typically close in June or July. Missing the deadline means no grant for the academic year.',
    category: 'deadline',
    important: true,
    externalHref: 'https://www.susi.ie',
  },
  {
    id: 'jun-midyear',
    month: 6, day: null,
    dateLabel: 'June',
    title: 'Mid-year tax position check',
    description: 'If you\'ve had a pay rise, side income, or bonus, project your full-year tax liability now. Preliminary tax is due in October.',
    category: 'tax',
    important: false,
    href: '/calculator',
  },

  // ── July ───────────────────────────────────────────────────────────────────
  {
    id: 'jul-cgt-annual',
    month: 7, day: null,
    dateLabel: 'July',
    title: 'Review CGT annual exemption usage',
    description: 'You have a €1,270 CGT exemption each year. If you have investment gains, disposing of assets before year-end uses this exemption.',
    category: 'tax',
    important: false,
    href: '/tools/etf-calculator',
  },

  // ── August ────────────────────────────────────────────────────────────────
  {
    id: 'aug-back-to-college',
    month: 8, day: null,
    dateLabel: 'August',
    title: 'Back-to-college budget',
    description: 'Registration fees, rent deposits, books — map out the academic year cash flow. SUSI payments typically start in October.',
    category: 'planning',
    important: false,
  },
  {
    id: 'aug-new-job',
    month: 8, day: null,
    dateLabel: 'August–September',
    title: 'New starters: avoid emergency tax',
    description: 'Starting a new job? Register your new employment with Revenue on myAccount before your first payslip to avoid emergency tax.',
    category: 'tax',
    important: true,
    href: '/tools/emergency-tax',
    externalHref: 'https://www.revenue.ie/en/jobs-and-pensions/starting-your-first-job/index.aspx',
  },

  // ── September ─────────────────────────────────────────────────────────────
  {
    id: 'sep-budget-watch',
    month: 9, day: null,
    dateLabel: 'September',
    title: 'Budget season begins',
    description: 'Budget 2027 is announced in October. Pre-Budget submissions are published in September — watch for changes to USC, income tax bands, and pension rules.',
    category: 'budget',
    important: false,
  },
  {
    id: 'sep-pension-avc',
    month: 9, day: null,
    dateLabel: 'September',
    title: 'Last chance to top up pension for prior year',
    description: 'Additional Voluntary Contributions (AVCs) can be claimed against the previous year\'s income, but must be made before 31 October. Check your age-band limit.',
    category: 'savings',
    important: true,
    href: '/lessons/auto-enrolment',
  },

  // ── October ───────────────────────────────────────────────────────────────
  {
    id: 'oct-budget',
    month: 10, day: null,
    dateLabel: 'Mid-October',
    title: 'Budget Day',
    description: 'The Minister for Finance announces Budget 2027. Key areas to watch: income tax bands, USC rates, PRSI, pension limits, and housing measures.',
    category: 'budget',
    important: true,
    href: '/calculator',
  },
  {
    id: 'oct-self-assessed',
    month: 10, day: 31,
    dateLabel: '31 October',
    title: 'Self-assessed income tax deadline',
    description: 'If you\'re self-employed or have non-PAYE income over €5,000, your income tax return AND preliminary tax for the following year are both due 31 October.',
    category: 'deadline',
    important: true,
    externalHref: 'https://www.revenue.ie/en/self-assessment-and-self-employment/filing-your-tax-return/index.aspx',
  },
  {
    id: 'oct-cgt-jan-nov',
    month: 10, day: 31,
    dateLabel: '31 October',
    title: 'CGT payment — January to October gains',
    description: 'Capital Gains Tax on disposals from 1 January to 30 November is due 15 December. Begin calculating now.',
    category: 'deadline',
    important: true,
    externalHref: 'https://www.revenue.ie/en/gains-gifts-and-inheritance/cgt-for-individuals/payment-of-cgt.aspx',
  },
  {
    id: 'oct-pension-avc-deadline',
    month: 10, day: 31,
    dateLabel: '31 October',
    title: 'Pension AVC deadline — relief against prior year income',
    description: 'Make Additional Voluntary Contributions before 31 October to claim tax relief against the previous year\'s income. Age-based limits apply.',
    category: 'savings',
    important: true,
    href: '/lessons/auto-enrolment',
  },

  // ── November ──────────────────────────────────────────────────────────────
  {
    id: 'nov-ros',
    month: 11, day: 12,
    dateLabel: '12 November',
    title: 'ROS extended filing deadline',
    description: 'If you file your income tax return via Revenue Online Service (ROS), the extended deadline is typically 12 November. A 5–10% surcharge applies for late filing.',
    category: 'deadline',
    important: true,
    externalHref: 'https://www.revenue.ie/en/self-assessment-and-self-employment/filing-your-tax-return/index.aspx',
  },
  {
    id: 'nov-year-end-tax',
    month: 11, day: null,
    dateLabel: 'November',
    title: 'Year-end tax planning',
    description: 'Review: medical receipts, remote working log, unclaimed credits, and any capital losses to offset against gains before 31 December.',
    category: 'tax',
    important: false,
    href: '/calculator',
  },

  // ── December ──────────────────────────────────────────────────────────────
  {
    id: 'dec-cgt-deadline',
    month: 12, day: 15,
    dateLabel: '15 December',
    title: 'CGT payment deadline (Oct–Nov gains)',
    description: 'Capital Gains Tax on disposals between 1 October and 30 November is due 15 December. Pay online via myAccount to avoid interest.',
    category: 'deadline',
    important: true,
    externalHref: 'https://www.revenue.ie/en/gains-gifts-and-inheritance/cgt-for-individuals/payment-of-cgt.aspx',
  },
  {
    id: 'dec-pension',
    month: 12, day: 31,
    dateLabel: '31 December',
    title: 'Pension contribution deadline for this year',
    description: 'Contributions must be made by 31 December to count for the current tax year\'s relief (unless claiming against prior year income using the October AVC window).',
    category: 'savings',
    important: true,
    href: '/lessons/auto-enrolment',
  },
  {
    id: 'dec-annual-review',
    month: 12, day: null,
    dateLabel: 'December',
    title: 'Annual financial review',
    description: 'One honest review a year: net worth, savings rate, emergency fund, biggest spending categories. Set targets for the new year.',
    category: 'planning',
    important: false,
  },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function getCalendar(): CalendarMonth[] {
  return MONTH_NAMES.map((name, idx) => {
    const month = idx + 1;
    const events = RAW_EVENTS
      .filter((e) => e.month === month)
      .sort((a, b) => (a.day ?? 32) - (b.day ?? 32)); // nulls (no fixed date) go after dated events
    return { month, name, events };
  });
}

export function getCurrentMonthIndex(): number {
  return new Date().getMonth(); // 0-based
}
