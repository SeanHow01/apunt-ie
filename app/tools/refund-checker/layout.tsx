import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tax Refund Checker — Punt',
  description:
    "Estimate whether you're owed a tax refund from Revenue Ireland and find out how to claim it back through myAccount.",
};

export default function RefundCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
