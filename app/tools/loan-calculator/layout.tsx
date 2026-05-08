import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan Calculator — Punt',
  description:
    'Calculate monthly repayments, total interest, and the true cost of any personal loan in Ireland.',
};

export default function LoanCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
