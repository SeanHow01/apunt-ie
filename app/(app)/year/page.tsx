import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { years } from '@/lib/years';

export default function YearIndexPage() {
  return (
    <AppShell>
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 max-w-4xl mx-auto w-full">

        <header className="mb-10">
          <div className="mb-3">
            <Eyebrow>Your year</Eyebrow>
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl leading-tight mb-3"
            style={{
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              fontFamily: 'Instrument Serif, serif',
            }}
          >
            Every year brings new money questions.
          </h1>
          <p className="font-sans text-base" style={{ color: 'var(--ink-2)', maxWidth: '55ch' }}>
            Pick the stage that matches where you are. Each page curates the lessons and
            tools that matter most right now.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {years.map((year) => (
            <Link
              key={year.id}
              href={`/year/${year.id}`}
              className="block no-underline group"
              style={{
                border: '1px solid var(--rule)',
                borderRadius: '4px',
                padding: '1.5rem',
                textDecoration: 'none',
              }}
            >
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--accent)' }}
              >
                {year.label}
              </p>
              <h2
                className="font-display text-xl leading-snug mb-2 group-hover:opacity-80 transition-opacity"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  color: 'var(--ink)',
                }}
              >
                {year.headline}
              </h2>
              <p
                className="font-sans text-sm leading-relaxed"
                style={{ color: 'var(--ink-2)' }}
              >
                {year.description}
              </p>
              <p
                className="font-sans text-sm mt-3 font-medium group-hover:underline underline-offset-2"
                style={{ color: 'var(--accent)' }}
              >
                {year.moduleIds.length} lessons &rarr;
              </p>
            </Link>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
