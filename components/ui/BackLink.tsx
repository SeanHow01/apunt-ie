import Link from 'next/link';

/**
 * BackLink — the editorial back-affordance used at the top of every secondary
 * page. Mono uppercase, ink-3 by default, accent on hover. Matches the homepage
 * masthead chrome.
 */
export function BackLink({ href, label = 'Punt' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="font-mono uppercase no-underline transition-colors hover:[color:var(--accent)]"
      style={{
        fontSize: '0.6875rem',
        letterSpacing: '0.14em',
        color: 'var(--ink-3)',
        display: 'inline-block',
      }}
    >
      ← {label}
    </Link>
  );
}
