import type { Metadata } from 'next';
import { getModule } from '@/content/modules/index';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mod = getModule(id);
  if (!mod) return { title: 'Lesson — Punt' };
  return {
    title: `${mod.title} — Punt`,
    description: mod.subtitle,
  };
}

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
