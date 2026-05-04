import type { Module } from '@/content/types';

const payslip: Module = {
  id: 'payslip',
  title: 'Your payslip, line by line',
  subtitle: 'PAYE, USC, PRSI and what they pay for',
  durationMinutes: 3,
  steps: [
    {
      id: 'gross',
      label: 'Gross pay',
      body: 'This is what the job pays before anyone takes a cut. Your salary, written on your contract, divided by twelve.',
      highlight: 'gross',
    },
    {
      id: 'paye',
      label: 'PAYE',
      body: 'Pay As You Earn is income tax, collected by your employer on behalf of Revenue. The standard rate is 20% on the first €44,000, then 40% above that.',
      highlight: 'paye',
      callout: {
        kind: 'tip',
        text: 'Your tax credits reduce this amount. Most workers have standard credits worth about €4,000 a year — so the first €20,000 of your income is effectively tax-free.',
      },
    },
    {
      id: 'usc',
      label: 'USC',
      body: 'The Universal Social Charge is a separate tax on income. It starts at 0.5% and rises to 8% on earnings above €70,044. If you earn €13,000 or less, you pay none.',
      highlight: 'usc',
    },
    {
      id: 'prsi',
      label: 'PRSI',
      body: 'Pay Related Social Insurance is 4.1% of your gross pay. It funds your state pension, maternity benefit, and illness benefit — it is building a record of entitlements in your name.',
      highlight: 'prsi',
    },
    {
      id: 'net',
      label: 'Net pay',
      body: 'This is what lands in your account. Everything else on the payslip is an explanation of how you got here from gross.',
      highlight: 'net',
      callout: {
        kind: 'info',
        text: "If you've ever been on emergency tax — or if any of the credits on your Tax Credit Certificate look wrong — you may be owed a refund for previous years. The \"Tax you might be owed\" module covers how to check and claim.",
      },
    },
  ],
  closingLine: 'You now know exactly where your money goes before it reaches you.',
  lastReviewed: 'April 2026',
  reviewNote: 'Budget 2026 rates — PAYE cutoff €44,000, credits €4,000, PRSI 4.1%, USC bands verified.',
};

export default payslip;
