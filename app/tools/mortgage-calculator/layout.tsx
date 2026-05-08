import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Punt',
  description:
    'Calculate Irish mortgage repayments, Central Bank affordability limits, and total interest paid over the full term.',
};

export default function MortgageCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
