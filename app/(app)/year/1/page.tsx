import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export const metadata: Metadata = {
  title: 'First Year — Punt',
  description:
    'Financial essentials for first-year students — SUSI grants, renting, part-time work, and making your student budget work.',
};

export default function Year1Page() {
  const year = getYear('1');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
