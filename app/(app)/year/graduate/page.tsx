import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export const metadata: Metadata = {
  title: 'Graduate — Punt',
  description:
    'Financial milestones for recent graduates — your first full-time payslip, pension auto-enrolment, and long-term money planning.',
};

export default function YearGraduatePage() {
  const year = getYear('graduate');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
