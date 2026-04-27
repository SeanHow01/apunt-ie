import { notFound } from 'next/navigation';
import { getYear } from '@/lib/years';
import { YearPageContent } from '../YearPageContent';

export default function YearGraduatePage() {
  const year = getYear('graduate');
  if (!year) notFound();
  return <YearPageContent year={year} />;
}
