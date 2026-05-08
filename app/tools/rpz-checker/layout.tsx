import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent Pressure Zone Checker — Punt',
  description:
    'Check if your rental property is in a Rent Pressure Zone (RPZ) and calculate the maximum legal rent increase under Irish law.',
};

export default function RpzCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
