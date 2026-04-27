/**
 * Monthly financial actions — curated, Ireland-specific tasks for each calendar month.
 * Surfaces 3-4 time-sensitive actions relevant to young Irish adults.
 */

export type ActionTag = 'tax' | 'savings' | 'planning' | 'deadline' | 'admin' | 'benefits';

export type MonthlyAction = {
  id: string;
  title: string;
  description: string;
  tag: ActionTag;
  /** Internal Punt link if relevant */
  href?: string;
  /** External link (Revenue, SUSI, etc.) */
  externalHref?: string;
};

/**
 * Tag colours use CSS variables — rendered by the component.
 * Exported so the component can map tag → label.
 */
export const TAG_LABELS: Record<ActionTag, string> = {
  tax: 'Tax',
  savings: 'Savings',
  planning: 'Planning',
  deadline: 'Deadline',
  admin: 'Admin',
  benefits: 'Benefits',
};

/** Actions indexed by month number (0 = January … 11 = December) */
const MONTHLY_ACTIONS: Record<number, MonthlyAction[]> = {
  // January
  0: [
    {
      id: 'jan-payslip',
      title: 'Check your first payslip of the year',
      description:
        'January payslips reflect new tax credits and USC bands. Verify your tax credit certificate matches what Revenue shows in myAccount.',
      tag: 'tax',
      href: '/lessons/payslip',
    },
    {
      id: 'jan-pension',
      title: 'Review your pension contributions',
      description:
        'A good time to increase your contribution if you got a pay rise — you have until 31 October to claim relief on last year\'s contributions too.',
      tag: 'savings',
      href: '/lessons/auto-enrolment',
    },
    {
      id: 'jan-cgt',
      title: 'Pay CGT on gains made Aug–Dec last year',
      description:
        'The CGT payment deadline for disposals in the August–December period of the previous year is 31 January. Late payment attracts interest.',
      tag: 'deadline',
      externalHref: 'https://www.revenue.ie/en/gains-gifts-and-inheritance/cgt-for-individuals/payment-of-cgt.aspx',
    },
    {
      id: 'jan-budget',
      title: 'Check what Budget 2026 changes affect you',
      description:
        'New USC bands, PRSI changes, and credits kicked in from 1 January. Use the take-home calculator to see your updated net pay.',
      tag: 'planning',
      href: '/calculator',
    },
  ],

  // February
  1: [
    {
      id: 'feb-p60',
      title: 'Request your P21 / Income Tax Statement',
      description:
        'If you think you overpaid tax last year, log in to myAccount on Revenue.ie and request a P21 review — refunds are usually processed within days.',
      tag: 'tax',
      externalHref: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/income-and-employment/p21-balancing-statement/index.aspx',
    },
    {
      id: 'feb-savings',
      title: 'Set a savings goal for Q1',
      description:
        'February is a good checkpoint. Are you on track to hit your first quarter savings target? Even €50/month builds an emergency fund over time.',
      tag: 'savings',
    },
    {
      id: 'feb-direct-debits',
      title: 'Audit your direct debits and subscriptions',
      description:
        'Annual subscription renewals from Christmas sign-ups often hit in January/February. Cancel what you don\'t use before the next cycle.',
      tag: 'admin',
    },
    {
      id: 'feb-lpt',
      title: 'Check your Local Property Tax status',
      description:
        'If you own property, confirm your LPT is set up for the year. Phase payment options must be arranged by March.',
      tag: 'tax',
      externalHref: 'https://www.revenue.ie/en/property/local-property-tax/index.aspx',
    },
  ],

  // March
  2: [
    {
      id: 'mar-lpt-deadline',
      title: 'LPT phased payment deadline (property owners)',
      description:
        'If you pay LPT by direct debit in instalments, the mandate must be in place by late March. Single payment or annual debit due 21 March.',
      tag: 'deadline',
      externalHref: 'https://www.revenue.ie/en/property/local-property-tax/index.aspx',
    },
    {
      id: 'mar-tax-credits',
      title: 'Claim any outstanding tax reliefs',
      description:
        'Flat-rate expenses, remote working relief, medical expenses, rent tax credit — log into myAccount to check you haven\'t missed a claim.',
      tag: 'tax',
      externalHref: 'https://www.revenue.ie/en/jobs-and-pensions/starting-your-first-job/overview-of-tax-credits-and-reliefs.aspx',
    },
    {
      id: 'mar-emergency-fund',
      title: 'Q1 review: is your emergency fund on track?',
      description:
        'A three-month buffer is the standard target. Calculate what three months of essential spending looks like and compare to your savings.',
      tag: 'planning',
    },
    {
      id: 'mar-rent-credit',
      title: 'Claim the rent tax credit if eligible',
      description:
        'Renters can claim €1,000 (single) or €2,000 (jointly assessed) per year. Claim online for the prior year via myAccount.',
      tag: 'benefits',
      externalHref: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/housing/rent-credit/index.aspx',
    },
  ],

  // April
  3: [
    {
      id: 'apr-payslip-review',
      title: 'Check your Q1 payslips for errors',
      description:
        'Three months in — a good time to check that your cumulative PAYE, USC, and PRSI figures are tracking correctly against your expected annual tax.',
      tag: 'tax',
      href: '/tools/payslip-checker',
    },
    {
      id: 'apr-susi-prep',
      title: 'SUSI applications open in May — start gathering documents',
      description:
        'The Student Universal Support Ireland grant opens annually in May. Gather your household income details (2024 earnings) and CAO offer confirmation now.',
      tag: 'benefits',
      externalHref: 'https://www.susi.ie',
    },
    {
      id: 'apr-pension-check',
      title: 'Check your auto-enrolment opt-out window',
      description:
        'If you opted out of auto-enrolment, you can re-enrol now. Each contribution gets matched by your employer and topped up by the State.',
      tag: 'savings',
      href: '/lessons/auto-enrolment',
    },
    {
      id: 'apr-remote-work',
      title: 'Track your remote working days',
      description:
        'You can claim €3.20/day tax-free for remote working expenses. Keep a record now so you don\'t have to estimate it in October.',
      tag: 'tax',
      externalHref: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/income-and-employment/e-working-and-tax/index.aspx',
    },
  ],

  // May
  4: [
    {
      id: 'may-susi',
      title: 'Apply for SUSI grant (applications now open)',
      description:
        'SUSI applications typically open in late April/May. Household income threshold for 2026 is up to €62,000 depending on family size and course.',
      tag: 'benefits',
      href: '/tools/susi-estimator',
      externalHref: 'https://www.susi.ie',
    },
    {
      id: 'may-mid-year-savings',
      title: 'Five months in — track spending patterns',
      description:
        'Bank apps now show 5 months of data. Identify your three biggest discretionary categories and decide if they reflect your priorities.',
      tag: 'planning',
    },
    {
      id: 'may-deposit-interest',
      title: 'Check your savings account rate',
      description:
        'Rates change frequently. Check if your bank has updated their demand deposit or term deposit rates — switching takes minutes.',
      tag: 'savings',
    },
    {
      id: 'may-remote-cert',
      title: 'Submit e-worker certificate if applicable',
      description:
        'Some employers require an annual declaration of remote working days for the tax-free €3.20/day reimbursement. Check with HR.',
      tag: 'admin',
    },
  ],

  // June
  5: [
    {
      id: 'jun-midyear-tax',
      title: 'Mid-year tax position check',
      description:
        'If you\'ve had a salary increase, bonus, or side income, project your full-year tax liability now. Pay preliminary tax in October to avoid interest.',
      tag: 'tax',
      href: '/calculator',
    },
    {
      id: 'jun-susi-deadline',
      title: 'SUSI deadline approaching — complete your application',
      description:
        'SUSI applications typically close in June/July. Missing the deadline means waiting until next year.',
      tag: 'deadline',
      externalHref: 'https://www.susi.ie',
    },
    {
      id: 'jun-pension-mid',
      title: 'Check pension fund performance and charges',
      description:
        'Mid-year is a good time to review your pension fund choice. Even a 0.5% difference in annual management charges compounds significantly over decades.',
      tag: 'savings',
      href: '/lessons/auto-enrolment',
    },
    {
      id: 'jun-budget',
      title: 'Plan for summer spending',
      description:
        'Holidays, weddings, festivals — summer spending spikes are predictable. Set a cap now to protect your September emergency fund.',
      tag: 'planning',
    },
  ],

  // July
  6: [
    {
      id: 'jul-payrise',
      title: 'Got a pay rise? Model the tax impact',
      description:
        'A rise that pushes you above the €44,000 standard rate cutoff means the marginal euro is taxed at 40% + USC + PRSI. Know your real take-home.',
      tag: 'tax',
      href: '/tools/pay-rise',
    },
    {
      id: 'jul-medical',
      title: 'Keep medical receipts — you can claim at year end',
      description:
        'Medical expenses over €100 per claim attract 20% tax relief (not 40%). Log receipts on Revenue\'s myAccount as you go.',
      tag: 'tax',
      externalHref: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/health-and-age/health-expenses/index.aspx',
    },
    {
      id: 'jul-mortgage-review',
      title: 'Review your mortgage rate (if on a tracker or variable)',
      description:
        'ECB rate decisions affect tracker mortgages immediately. Check if fixing for 2–5 years makes sense given current rates.',
      tag: 'planning',
      href: '/tools/mortgage-calculator',
    },
    {
      id: 'jul-emergency',
      title: 'Restock your emergency fund after summer',
      description:
        'If summer spending dipped into your buffer, now\'s the time to rebuild. Target 3 months\' essential expenses in an accessible account.',
      tag: 'savings',
    },
  ],

  // August
  7: [
    {
      id: 'aug-return-to-work',
      title: 'Review your tax credits for new job starters',
      description:
        'Starting a new job? Ensure Revenue has your PPSN linked and your tax credits transferred. Emergency tax is painful and takes time to recover.',
      tag: 'tax',
      href: '/tools/emergency-tax',
    },
    {
      id: 'aug-cgt-plan',
      title: 'CGT planning — use your annual exemption',
      description:
        'The €1,270 annual CGT exemption resets each year. If you have investments with gains, disposing before year end uses this exemption.',
      tag: 'tax',
      href: '/tools/etf-calculator',
    },
    {
      id: 'aug-college-budget',
      title: 'College costs arriving? Build your academic year budget',
      description:
        'Registration fees, rent, books, and food. Map out the next 9 months of costs now before they creep up on you.',
      tag: 'planning',
    },
    {
      id: 'aug-bank-holiday',
      title: 'Automate savings before the new term chaos begins',
      description:
        'Set up a standing order for the day after payday. Automating savings before you see the money is the most effective habit.',
      tag: 'savings',
    },
  ],

  // September
  8: [
    {
      id: 'sep-budget-watch',
      title: 'Budget 2027 is next month — note what changes affect you',
      description:
        'The Budget is announced in October. Follow the headlines and update your take-home calculator once the new rates are confirmed.',
      tag: 'planning',
      href: '/calculator',
    },
    {
      id: 'sep-form12',
      title: 'File Form 12 if you have other income',
      description:
        'Rental income, freelance payments, or investment returns outside of PAYE must be declared. The online deadline is November.',
      tag: 'deadline',
      externalHref: 'https://www.revenue.ie/en/self-assessment-and-self-employment/filing-your-tax-return/index.aspx',
    },
    {
      id: 'sep-pension-avc',
      title: 'Top up your pension before the October deadline',
      description:
        'Additional Voluntary Contributions (AVCs) made before 31 October can be claimed against last year\'s income. Check your age band relief limit.',
      tag: 'savings',
      href: '/lessons/auto-enrolment',
    },
    {
      id: 'sep-rent-credit',
      title: 'Verify your 2025 rent tax credit claim',
      description:
        'The rent tax credit is worth €1,000/year for renters. If you haven\'t claimed 2025\'s yet, do it via myAccount now.',
      tag: 'benefits',
      externalHref: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/housing/rent-credit/index.aspx',
    },
  ],

  // October
  9: [
    {
      id: 'oct-self-assessed',
      title: 'Self-assessed tax return deadline — 31 October',
      description:
        'If you\'re self-employed or have non-PAYE income, your income tax return and preliminary tax payment for next year are both due 31 October.',
      tag: 'deadline',
      externalHref: 'https://www.revenue.ie/en/self-assessment-and-self-employment/filing-your-tax-return/index.aspx',
    },
    {
      id: 'oct-cgt-payment',
      title: 'Pay CGT on gains made Jan–October',
      description:
        'Capital Gains Tax on disposals made between 1 January and 30 November is due 15 December. Start calculating now.',
      tag: 'deadline',
      externalHref: 'https://www.revenue.ie/en/gains-gifts-and-inheritance/cgt-for-individuals/payment-of-cgt.aspx',
    },
    {
      id: 'oct-budget',
      title: 'Budget announced — check the calculator',
      description:
        'New tax bands and credits come into effect 1 January. Use the take-home calculator to see what your 2027 net pay will look like.',
      tag: 'planning',
      href: '/calculator',
    },
    {
      id: 'oct-pension-relief',
      title: 'Last chance: pension AVC relief against 2025 income',
      description:
        'Additional pension contributions made before 31 October 2026 can be offset against 2025 income. Check your age-based relief limit.',
      tag: 'savings',
      href: '/lessons/auto-enrolment',
    },
  ],

  // November
  10: [
    {
      id: 'nov-ros-deadline',
      title: 'ROS tax return deadline — 12 November (online filers)',
      description:
        'If you file your income tax return via ROS, the extended deadline is usually 12 November. Do not miss it — a surcharge of 5–10% applies.',
      tag: 'deadline',
      externalHref: 'https://www.revenue.ie/en/self-assessment-and-self-employment/filing-your-tax-return/index.aspx',
    },
    {
      id: 'nov-year-end-planning',
      title: 'Year-end tax planning — three opportunities remaining',
      description:
        'Review: pension contributions, medical receipts, remote working log, and any CGT disposals. Three options remain before 31 December.',
      tag: 'tax',
      href: '/calculator',
    },
    {
      id: 'nov-christmas',
      title: 'Set a Christmas budget — today',
      description:
        'Gifts, travel, nights out — Christmas spending is predictable. Capping it now prevents January debt.',
      tag: 'planning',
    },
    {
      id: 'nov-mortgage-rates',
      title: 'Shop mortgage rates before the new year',
      description:
        'January is one of the busiest switching periods. If you\'re on a variable rate, compare fixed rates now to get ahead of the queue.',
      tag: 'planning',
      href: '/tools/mortgage-calculator',
    },
  ],

  // December
  11: [
    {
      id: 'dec-cgt-deadline',
      title: 'CGT payment deadline — 15 December',
      description:
        'Capital Gains Tax on disposals between 1 October and 30 November is due 15 December. Pay online via myAccount to avoid interest.',
      tag: 'deadline',
      externalHref: 'https://www.revenue.ie/en/gains-gifts-and-inheritance/cgt-for-individuals/payment-of-cgt.aspx',
    },
    {
      id: 'dec-year-end-pension',
      title: 'Last chance to maximise pension for 2026',
      description:
        'Pension contributions must be made by 31 December for 2026 tax relief (unless claiming against prior year income). Top up now.',
      tag: 'savings',
      href: '/lessons/auto-enrolment',
    },
    {
      id: 'dec-review',
      title: 'Annual financial review — 15 minutes',
      description:
        'Check: net worth, emergency fund, savings rate, biggest spending categories. One honest look a year is worth months of daily tracking.',
      tag: 'planning',
    },
    {
      id: 'dec-new-year',
      title: 'Prepare for January\'s new rates',
      description:
        'Budget 2027 changes take effect 1 January. Update your take-home calculator with the new bands and set new savings targets.',
      tag: 'tax',
      href: '/calculator',
    },
  ],
};

/**
 * Returns the 3–4 curated actions for the given calendar month (0 = January).
 */
export function getActionsForMonth(monthIndex: number): MonthlyAction[] {
  return MONTHLY_ACTIONS[monthIndex] ?? MONTHLY_ACTIONS[0];
}

/**
 * Returns the actions for the current calendar month (server-side safe).
 */
export function getCurrentMonthActions(): { monthName: string; actions: MonthlyAction[] } {
  const now = new Date();
  const monthIndex = now.getMonth();
  const monthName = now.toLocaleString('en-IE', { month: 'long' });
  return {
    monthName,
    actions: getActionsForMonth(monthIndex),
  };
}
