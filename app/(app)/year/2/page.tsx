import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export const metadata: Metadata = {
  title: 'Second Year — Punt',
  description:
    'Build better money habits — understanding your payslip, claiming tax back, and managing credit as a second-year student.',
};

export default function Year2Page() {
  const year = getYear('2');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
