import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export default function Year3Page() {
  const year = getYear('3');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
