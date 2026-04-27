import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export default function Year1Page() {
  const year = getYear('1');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
