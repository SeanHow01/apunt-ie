import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ArticleNotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm flex flex-col">

        <div className="mb-12">
          <Link
            href="/news"
            className="font-sans text-sm"
            style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
          >
            &larr; All news
          </Link>
        </div>

        <h1
          className="font-display text-3xl leading-tight mb-3"
          style={{
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            fontFamily: 'Instrument Serif, serif',
          }}
        >
          Article not found.
        </h1>

        <p
          className="font-sans text-base mb-8"
          style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}
        >
          This article doesn&rsquo;t exist or may have moved.
        </p>

        <Link href="/news">
          <Button variant="primary">All news &rarr;</Button>
        </Link>

      </div>
    </main>
  );
}
