/**
 * Primary sources used across Punt's content and calculators.
 *
 * Each entry describes the source, its URL, and what Punt uses it for.
 */

export type Source = {
  name: string;
  url: string;
  description: string;
  usedFor: string[];
};

export const primarySources: Source[] = [
  {
    name: 'Revenue.ie',
    url: 'https://www.revenue.ie',
    description: "Ireland's tax authority. The primary reference for all income tax, USC, and PRSI rates, bands, and credits.",
    usedFor: [
      'PAYE rates and cut-off points',
      'USC bands and exemptions',
      'PRSI class A rates',
      'Tax credits (personal, PAYE, PRSI)',
      'Pension contribution relief limits by age',
      'Help to Buy scheme eligibility and rebate mechanics',
    ],
  },
  {
    name: 'Department of Social Protection',
    url: 'https://www.gov.ie/en/organisation/department-of-social-protection/',
    description:
      'The government department responsible for social welfare, PRSI, and the auto-enrolment pension scheme.',
    usedFor: [
      'Auto-enrolment phase rates and timelines',
      'PRSI class definitions',
      'Social welfare entitlements',
    ],
  },
  {
    name: 'SUSI (Student Universal Support Ireland)',
    url: 'https://www.susi.ie',
    description:
      "Ireland's central student grant authority. All grant eligibility criteria, reckonable income thresholds, and award amounts come directly from SUSI's published guidelines.",
    usedFor: [
      'Adjacency and non-adjacency grant rates',
      'Income thresholds and reckonable income rules',
      'Postgraduate and part-time eligibility',
      'Application deadlines and documentation requirements',
    ],
  },
  {
    name: 'Residential Tenancies Board (RTB)',
    url: 'https://www.rtb.ie',
    description:
      'The statutory body that regulates the rental sector in Ireland. All tenant rights, notice periods, and Rent Pressure Zone rules are sourced here.',
    usedFor: [
      'Notice periods for rent increases and terminations',
      'Rent Pressure Zone rules and rent increase limits',
      'Deposit protection rules',
      'Dispute resolution process',
    ],
  },
  {
    name: 'Central Bank of Ireland',
    url: 'https://www.centralbank.ie',
    description:
      "Ireland's financial regulator. Source for mortgage lending rules, APR definitions, and consumer credit regulations.",
    usedFor: [
      'Mortgage loan-to-value and loan-to-income limits',
      'APR calculation methodology',
      'Consumer credit regulations',
    ],
  },
  {
    name: 'Citizens Information',
    url: 'https://www.citizensinformation.ie',
    description:
      "The Irish government's public information service. Used to cross-reference explanations of rights, entitlements, and financial processes.",
    usedFor: [
      'Employment rights and entitlements',
      'Social welfare eligibility',
      'Housing rights and obligations',
      'General financial rights',
    ],
  },
  {
    name: 'MABS (Money Advice and Budgeting Service)',
    url: 'https://www.mabs.ie',
    description:
      "Ireland's free money advice service, and Punt's partner organisation. MABS guidance informs the practical framing of financial topics throughout the platform.",
    usedFor: [
      'Practical money management guidance',
      'FiRe Up Financial Wellbeing course',
      'Debt and credit advice framing',
    ],
  },
  {
    name: 'CCPC (Competition and Consumer Protection Commission)',
    url: 'https://www.ccpc.ie',
    description:
      "Ireland's consumer protection body. Provides plain-English financial guides and comparison tools used as a reference for consumer credit content.",
    usedFor: [
      'Loan and credit card comparisons',
      'Consumer rights in financial products',
      'Moneylender regulations',
    ],
  },
];
