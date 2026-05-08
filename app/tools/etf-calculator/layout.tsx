import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ETF Investment Calculator — Punt',
  description:
    'Model the growth of Irish ETF investments over time, including deemed disposal tax every 8 years and the 41% exit tax on gains.',
};

export default function EtfCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
