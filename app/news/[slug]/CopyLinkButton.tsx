'use client';

import { useState } from 'react';

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silent fail
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="font-sans"
      style={{
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: copied ? 'var(--accent)' : 'var(--ink-2)',
        border: '1px solid var(--rule)',
        padding: '4px 12px',
        borderRadius: '2px',
        background: 'transparent',
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
