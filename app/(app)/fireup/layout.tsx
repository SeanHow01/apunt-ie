import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started — Punt',
  description: 'Complete your Punt setup and start your financial literacy journey.',
};

export default function FireUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
