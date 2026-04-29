'use client';

import { useState } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';

type Props = {
  completed: boolean;
  completedAt: string | null; // ISO date string
  onAttest: () => Promise<void>;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function FiReUpCard({ completed, completedAt, onAttest }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAttest() {
    setLoading(true);
    try {
      await onAttest();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="p-6"
      style={{ border: '1px solid var(--rule)' }}
    >
      {/*
       * Mobile: stacked (single column)
       * Desktop (lg+): horizontal 5-column grid — text left (3/5), CTAs right (2/5)
       * lg:items-center vertically centres the two columns so the card stays compact
       * (~120-140px height) rather than stretching to match a tall text block.
       */}
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8 lg:items-center">

        {/* Left — eyebrow, title, description */}
        <div className="lg:col-span-3">
          <div className="mb-2">
            <Eyebrow>Free course · MABS + ATU</Eyebrow>
          </div>

          <h3
            className="font-display text-xl leading-snug mb-2"
            style={{ color: 'var(--ink)' }}
          >
            FiRe Up Financial Wellbeing
          </h3>

          {completed ? (
            <p className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
              Completed
              {completedAt ? <> on {formatDate(completedAt)}</> : null}
            </p>
          ) : (
            <p
              className="font-sans text-sm leading-relaxed"
              style={{ color: 'var(--ink-2)' }}
            >
              A free online course from MABS that builds practical money skills
              in under two hours. Work through it at your own pace, then confirm
              completion here.
            </p>
          )}
        </div>

        {/* Right — CTAs (hidden when completed) */}
        {!completed && (
          <div className="lg:col-span-2 mt-5 lg:mt-0 flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleAttest}
              disabled={loading}
            >
              {loading ? 'Saving...' : "I've completed FiRe Up"}
            </Button>

            <a
              href="https://www.mabs.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm underline underline-offset-2"
              style={{ color: 'var(--ink-2)' }}
            >
              Find out more at mabs.ie &rarr;
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
