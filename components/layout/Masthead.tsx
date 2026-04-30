'use client';
import Link from 'next/link';
import { Settings } from 'lucide-react';

export function Masthead({ greeting }: { greeting: string }) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: '1px solid var(--rule)' }}
    >
      <p
        className="font-sans text-sm font-medium"
        style={{ color: 'var(--ink-2)' }}
      >
        {greeting}
      </p>
      <Link
        href="/settings"
        aria-label="Settings"
        className="focus-visible:outline-none focus-visible:ring-2 rounded"
        style={{ color: 'var(--ink-2)' }}
      >
        <Settings size={18} strokeWidth={1.5} />
      </Link>
    </header>
  );
}
