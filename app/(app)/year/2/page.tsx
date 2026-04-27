import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export default function Year2Page() {
  const year = getYear('2');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
