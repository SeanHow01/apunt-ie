import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Salary Sacrifice Calculator — Punt',
  description:
    'Calculate how salary sacrifice pension contributions reduce your gross pay, income tax, and USC bill in Ireland.',
};

export default function SalarySacrificeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
