import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SUSI Grant Estimator — Punt',
  description:
    'Estimate your SUSI student grant based on reckonable income, course type, and distance from home. See which band you may qualify for.',
};

export default function SusiEstimatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
