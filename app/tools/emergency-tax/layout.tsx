import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Tax Checker — Punt',
  description:
    "Find out if you're on emergency tax and how to fix it. Step-by-step guide to registering with Revenue and reclaiming overpaid tax.",
};

export default function EmergencyTaxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
