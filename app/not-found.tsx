import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';

export default async function NotFound() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const homeHref = user ? '/home' : '/';
  const lessonsHref = user ? '/lessons' : '/sign-up';

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm flex flex-col">

        {/* Logo */}
        <div className="mb-16">
          <Link href={homeHref} style={{ textDecoration: 'none' }}>
            <span
              className="font-display italic text-2xl"
              style={{
                color: 'var(--accent)',
                fontFamily: 'Instrument Serif, serif',
                letterSpacing: '-0.02em',
              }}
            >
              Punt
            </span>
          </Link>
        </div>

        {/* 404 */}
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--ink-2)' }}
        >
          404
        </p>

        <h1
          className="font-display text-4xl sm:text-5xl leading-tight mb-4"
          style={{
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            fontFamily: 'Instrument Serif, serif',
          }}
        >
          We can&rsquo;t find that page.
        </h1>

        <div className="flex flex-col gap-3 mt-6">
          <Link href={homeHref} className="w-full">
            <Button variant="primary" className="w-full">
              Go to home &rarr;
            </Button>
          </Link>
          <Link href={lessonsHref} className="w-full">
            <Button variant="ghost" className="w-full">
              All lessons &rarr;
            </Button>
          </Link>
          <Link href="/news" className="w-full">
            <Button variant="ghost" className="w-full">
              What&rsquo;s happening &rarr;
            </Button>
          </Link>
        </div>

        <p
          className="font-sans text-xs mt-12"
          style={{ color: 'var(--ink-2)', letterSpacing: '0.05em' }}
        >
          Independent · No bank affiliation · Irish system specific
        </p>

      </div>
    </main>
  );
}
