import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools | Punt',
  description:
    'Free financial calculators for workers in Ireland — take-home pay, mortgage, loan comparison, ETF, RPZ checker, payslip checker, salary sacrifice, and more.',
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
