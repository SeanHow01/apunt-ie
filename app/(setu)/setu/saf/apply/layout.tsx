import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAF Application — Punt',
  description:
    "Apply for emergency financial support through SETU's Student Assistance Fund (SAF). Complete your application online.",
};

export default function SafApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
