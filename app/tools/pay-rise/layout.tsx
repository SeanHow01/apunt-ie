import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pay Rise Calculator — Punt',
  description:
    'See exactly how much of a pay rise you keep after Irish PAYE, USC, and PRSI — and compare before and after take-home pay.',
};

export default function PayRiseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
