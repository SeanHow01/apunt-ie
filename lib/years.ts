/**
 * Year landing page data.
 *
 * Each year represents a stage in a young person's financial life.
 * Modules are listed in the order they're most useful for that stage.
 */

export type YearTool = {
  title: string;
  href: string;
  description: string;
};

export type YearCallout = {
  kind: 'info' | 'warning' | 'tip';
  text: string;
};

export type YearData = {
  id: string;
  label: string;
  headline: string;
  description: string;
  moduleIds: string[];
  tools: YearTool[];
  callouts?: YearCallout[];
};

export const years: YearData[] = [
  {
    id: '1',
    label: 'First Year',
    headline: 'Getting your financial footing.',
    description:
      'Starting college brings your first real financial decisions — SUSI, renting, part-time work, and working out what you can afford.',
    moduleIds: ['susi', 'rent', 'loans'],
    tools: [
      {
        title: 'Take-home pay calculator',
        href: '/calculator',
        description: 'See what part-time work income looks like after tax.',
      },
    ],
    callouts: [
      {
        kind: 'tip',
        text: 'SUSI applications open every April. Missing the deadline can cost you a full year of grant support.',
      },
      {
        kind: 'tip',
        text: "If you're working part-time and earning over €5,000 in a year, you may need to file a tax return — and you may be owed a refund.",
      },
      {
        kind: 'info',
        text: "Your college's Student Assistance Fund is separate from SUSI and can help with unexpected costs. Ask your student services office.",
      },
    ],
  },
  {
    id: '2',
    label: 'Second Year',
    headline: 'Building better money habits.',
    description:
      "You have a better sense of what things cost now. Time to understand your payslip and how credit actually works.",
    moduleIds: ['payslip', 'loans', 'rent'],
    tools: [
      {
        title: 'Take-home pay calculator',
        href: '/calculator',
        description: 'See exactly what your wages work out to after tax.',
      },
      {
        title: 'Loan calculator',
        href: '/tools/loan-calculator',
        description: 'Work out the true cost of borrowing before you sign.',
      },
    ],
    callouts: [
      {
        kind: 'warning',
        text: 'If your employer puts you on emergency tax, contact Revenue immediately via MyAccount. You can reclaim overpaid tax in the same year.',
      },
      {
        kind: 'tip',
        text: 'The Rent Tax Credit is worth up to €1,000 per year for eligible renters. Claim it through Revenue\'s MyAccount.',
      },
      {
        kind: 'info',
        text: 'A credit union account is worth opening before you need to borrow — membership length affects what you can access later.',
      },
    ],
  },
  {
    id: '3',
    label: 'Final Year',
    headline: 'Getting ready for what comes next.',
    description:
      "Final year is when financial decisions start having longer-term consequences. Auto-enrolment and Help to Buy are worth understanding before your first job.",
    moduleIds: ['auto-enrolment', 'help-to-buy', 'investing'],
    tools: [
      {
        title: 'Take-home pay calculator',
        href: '/calculator',
        description: 'Model your net pay including pension contributions.',
      },
      {
        title: 'Mortgage calculator',
        href: '/tools/mortgage-calculator',
        description: 'Get a sense of what you can afford to borrow.',
      },
    ],
    callouts: [
      {
        kind: 'info',
        text: "Auto-enrolment is automatic from your first job if you're aged 23–60 and earn over €20,000. You can opt out after 6 months.",
      },
      {
        kind: 'info',
        text: 'Help to Buy gives first-time buyers up to €30,000 back on a new build. You need to have paid sufficient income tax first — starting earlier helps.',
      },
      {
        kind: 'tip',
        text: 'Starting pension contributions at 23 versus 33 can roughly double your pot at retirement due to compound growth over a longer horizon.',
      },
    ],
  },
  {
    id: 'graduate',
    label: 'Graduate Year',
    headline: 'Your first real payslip.',
    description:
      'The graduate year is where everything on Punt becomes concrete. First payslip, first pension contribution, first rental contract on your own.',
    moduleIds: ['payslip', 'auto-enrolment', 'rent'],
    tools: [
      {
        title: 'Take-home pay calculator',
        href: '/calculator',
        description: 'What does your graduate salary actually pay out?',
      },
      {
        title: 'Loan comparison',
        href: '/tools/loan-comparison',
        description: 'Compare personal loan options side by side.',
      },
    ],
    callouts: [
      {
        kind: 'warning',
        text: 'Check your Tax Credit Certificate on MyAccount before your first payslip. Missing credits mean you\'re overpaying income tax from day one.',
      },
      {
        kind: 'info',
        text: 'Your P60 no longer exists. Revenue now updates your record in real time — your Employment Detail Summary is on MyAccount each January.',
      },
      {
        kind: 'tip',
        text: "If your employer offers pension matching, not contributing up to the match limit is equivalent to turning down part of your salary.",
      },
    ],
  },
];

export function getYear(id: string): YearData | undefined {
  return years.find((y) => y.id === id);
}
