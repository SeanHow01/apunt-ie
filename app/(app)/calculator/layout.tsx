import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Take-home Pay Calculator — Punt',
  description:
    'Calculate your Irish take-home pay after PAYE, USC, and PRSI. Supports annual salaries and hourly rates, pension auto-enrolment, and Budget 2026 rates.',
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
