import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export const metadata: Metadata = {
  title: 'Final Year — Punt',
  description:
    'Prepare for life after college — auto-enrolment, Help to Buy, and understanding your finances before your first full-time job.',
};

export default function Year3Page() {
  const year = getYear('3');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
