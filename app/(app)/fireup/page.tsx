'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { fireupExplainer } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';

// TODO(mabs-partnership): Wire up real MABS/Canvas API verification here when partnership is confirmed.
// Call verify() to set verified_at once the integration is live.
async function verify(userId: string): Promise<void> {
  /* stub: future MABS/Canvas API integration */
  void userId;
}

type Status = 'idle' | 'confirming' | 'saving' | 'done' | 'error';

export default function FireUpPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);

      const { data: row } = await supabase
        .from('fireup_completions')
        .select('self_attested_at')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (row?.self_attested_at) {
        setAlreadyCompleted(true);
        setCompletedAt(row.self_attested_at);
      }
    });
  }, []);

  async function handleConfirm() {
    if (!userId) return;
    setStatus('saving');
    try {
      const supabase = createClient();
      await supabase.from('fireup_completions').upsert({
        user_id: userId,
        self_attested_at: new Date().toISOString(),
      });
      setAlreadyCompleted(true);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  function handleOpenModal() {
    setStatus('confirming');
  }

  function handleCancelModal() {
    setStatus('idle');
  }

  const formattedDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-IE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <AppShell>
      <div className="flex-1 flex flex-col px-6 py-10 md:px-8 w-full max-w-lg md:max-w-2xl md:mx-auto">

        {/* Eyebrow */}
        <div className="mb-4">
          <Eyebrow>With compliments of MABS</Eyebrow>
        </div>

        {/* Heading */}
        <h1
          className="font-display text-4xl sm:text-5xl leading-tight mb-6"
          style={{
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            fontFamily: 'Instrument Serif, serif',
          }}
        >
          FiRe Up Financial Wellbeing
        </h1>

        <Rule className="mb-8" />

        {/* Explainer */}
        <p
          className="font-sans text-base leading-relaxed mb-8"
          style={{ color: 'var(--ink)', maxWidth: '65ch' }}
        >
          {fireupExplainer}
        </p>

        {/* External link to course */}
        <div className="mb-10">
          {/* TODO(mabs-partnership): replace with real MABS Canvas URL once partnership confirmed */}
          <a
            href="#"
            target="_blank"
            rel="noreferrer noopener"
            className="font-sans text-sm underline underline-offset-2"
            style={{ color: 'var(--ink)' }}
          >
            Take the FiRe Up course on Canvas &rarr;
          </a>
        </div>

        {/* Status / CTA */}
        {status === 'done' || alreadyCompleted ? (
          <div
            className="p-6"
            style={{
              border: '1px solid var(--rule)',
              borderRadius: '2px',
              backgroundColor: 'var(--surface)',
            }}
          >
            <p
              className="font-sans text-base font-medium mb-1"
              style={{ color: 'var(--ink)' }}
            >
              Completion recorded. Well done.
            </p>
            {formattedDate && (
              <p
                className="font-sans text-sm"
                style={{ color: 'var(--ink-2)' }}
              >
                Attested on {formattedDate}
              </p>
            )}
          </div>
        ) : (
          <Button variant="primary" onClick={handleOpenModal}>
            I&rsquo;ve completed FiRe Up
          </Button>
        )}

        {/* Error */}
        {status === 'error' && (
          <p
            className="font-sans text-sm mt-4"
            role="alert"
            style={{ color: 'var(--accent)' }}
          >
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      {/* Confirmation modal */}
      {status === 'confirming' && (
        <div
          className="fixed inset-0 flex items-center justify-center px-6 z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="w-full max-w-sm p-8"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--rule)',
              borderRadius: '2px',
            }}
          >
            <h2
              id="modal-title"
              className="font-display text-2xl leading-snug mb-4"
              style={{
                color: 'var(--ink)',
                fontFamily: 'Instrument Serif, serif',
                letterSpacing: '-0.02em',
              }}
            >
              Are you sure?
            </h2>
            <p
              className="font-sans text-sm leading-relaxed mb-8"
              style={{ color: 'var(--ink-2)' }}
            >
              By confirming, you&rsquo;re attesting that you have completed the FiRe Up course.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" onClick={handleConfirm}>
                Yes, confirm
              </Button>
              <Button variant="ghost" onClick={handleCancelModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Saving overlay */}
      {status === 'saving' && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <p
            className="font-sans text-base"
            style={{ color: 'var(--surface)' }}
          >
            Saving...
          </p>
        </div>
      )}
    </AppShell>
  );
}
