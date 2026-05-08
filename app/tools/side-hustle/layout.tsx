import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Side Hustle Tax Calculator — Punt',
  description:
    'Calculate how much Irish tax you owe on freelance or side income — PAYE, USC, PRSI, and what to set aside for your self-assessment return.',
};

export default function SideHustleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
