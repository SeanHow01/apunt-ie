import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payslip Checker — Punt',
  description:
    'Check whether your Irish payslip deductions are correct. Enter your gross pay and verify PAYE, USC, PRSI, and pension are right.',
};

export default function PayslipCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
