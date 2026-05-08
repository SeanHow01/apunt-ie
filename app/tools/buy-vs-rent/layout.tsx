import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buy vs Rent Calculator — Punt',
  description:
    'Compare the long-term financial cost of buying versus renting in Ireland. Factor in mortgage rates, rent increases, stamp duty, and opportunity cost.',
};

export default function BuyVsRentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
