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
      className="p-6 sm:p-8"
      style={{ border: '1px solid var(--rule)' }}
    >
      {/* Header */}
      <div className="mb-4">
        <Eyebrow>With compliments of MABS</Eyebrow>
      </div>

      <h3
        className="font-display text-xl sm:text-2xl leading-snug mb-4"
        style={{ color: 'var(--ink)' }}
      >
        FiRe Up Financial Wellbeing
      </h3>

      <div style={{ borderTop: '1px solid var(--rule)' }} className="pt-4">
        {completed ? (
          <>
            <p
              className="font-sans text-sm leading-relaxed"
              style={{ color: 'var(--ink-2)' }}
            >
              Completed
              {completedAt ? (
                <> on {formatDate(completedAt)}</>
              ) : null}
            </p>
          </>
        ) : (
          <>
            <p
              className="font-sans text-sm leading-relaxed mb-6"
              style={{ color: 'var(--ink-2)' }}
            >
              A free online course from MABS that builds practical money skills in under two hours.
              Work through it at your own pace, then confirm completion here.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleAttest}
                disabled={loading}
              >
                {loading ? 'Saving...' : "I've completed FiRe Up"}
              </Button>

              {/* TODO(mabs-partnership): replace with real MABS Canvas URL once partnership confirmed */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer noopener"
                className="font-sans text-sm underline underline-offset-2"
                style={{ color: 'var(--ink-2)' }}
              >
                Take the course on Canvas &rarr;
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
