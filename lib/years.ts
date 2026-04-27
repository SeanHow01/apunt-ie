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

export type YearData = {
  id: string;
  label: string;
  headline: string;
  description: string;
  moduleIds: string[];
  tools: YearTool[];
};

export const years: YearData[] = [
  {
    id: '1',
    label: 'Year 1',
    headline: 'First job. First payslip.',
    description:
      'Your first year of work brings more financial decisions than any year before it. Here is what to understand first.',
    moduleIds: ['payslip', 'auto-enrolment', 'loans'],
    tools: [
      {
        title: 'Take-home pay calculator',
        href: '/calculator',
        description: 'See exactly what your salary works out to after tax.',
      },
    ],
  },
  {
    id: '2',
    label: 'Year 2',
    headline: 'Settled in, building up.',
    description:
      "By year two you have a clearer picture of your income. Now it's about renting well, managing credit, and starting to save.",
    moduleIds: ['rent', 'loans', 'auto-enrolment'],
    tools: [
      {
        title: 'Loan calculator',
        href: '/tools/loan-calculator',
        description: 'Work out the true cost of borrowing before you sign.',
      },
    ],
  },
  {
    id: '3',
    label: 'Year 3',
    headline: 'Thinking further ahead.',
    description:
      "You're earning, saving, and starting to think about property or investing. The decisions you make now compound.",
    moduleIds: ['investing', 'help-to-buy', 'rent'],
    tools: [
      {
        title: 'Mortgage calculator',
        href: '/tools/mortgage-calculator',
        description: 'Get a sense of what you can afford to borrow.',
      },
      {
        title: 'Take-home pay calculator',
        href: '/calculator',
        description: 'Budget around what actually lands in your account.',
      },
    ],
  },
  {
    id: 'graduate',
    label: 'Graduates',
    headline: 'From student to earner.',
    description:
      'The jump from college to work is full of financial firsts. Here is what to understand — and in what order.',
    moduleIds: ['susi', 'payslip', 'auto-enrolment', 'loans'],
    tools: [
      {
        title: 'Take-home pay calculator',
        href: '/calculator',
        description: 'What does your graduate salary actually pay out?',
      },
    ],
  },
];

export function getYear(id: string): YearData | undefined {
  return years.find((y) => y.id === id);
}
