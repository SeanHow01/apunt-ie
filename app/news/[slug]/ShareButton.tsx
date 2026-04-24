'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';

type Props = {
  title: string;
  text: string;
};

export function ShareButton({ title, text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      // Mobile: trigger the native OS share sheet
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch {
        // User dismissed the share sheet — ignore (DOMException: AbortError)
      }
    } else {
      // Desktop / unsupported: copy URL to clipboard and show brief confirmation
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard write failed (permissions denied etc.) — ignore silently
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="font-sans text-sm inline-flex items-center gap-1.5 hover:underline underline-offset-2"
      style={{
        color: 'var(--ink-2)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <Share2 size={14} strokeWidth={1.5} aria-hidden="true" />
      <span>{copied ? 'Link copied' : 'Share this article'}</span>
    </button>
  );
}
