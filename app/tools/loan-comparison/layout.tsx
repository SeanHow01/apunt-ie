import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan Comparison Tool — Punt',
  description:
    'Compare two loans side by side — monthly repayments, total interest, and overall cost. Find the cheaper option before you sign.',
};

export default function LoanComparisonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
