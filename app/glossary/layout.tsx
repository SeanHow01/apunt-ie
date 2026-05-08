import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Glossary — Punt',
  description:
    'Plain-English definitions for Irish financial terms — PAYE, USC, PRSI, SUSI, pension, CGT, and more.',
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
