'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { createClient } from '@/lib/supabase/client';

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

        {/* Heading */}
        <h1
          className="font-display text-4xl sm:text-5xl leading-tight mb-4"
          style={{
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
            fontFamily: 'Instrument Serif, serif',
          }}
        >
          FiRe Up Financial Wellbeing
        </h1>

        {/* Framing */}
        <p
          className="font-sans text-base leading-relaxed mb-3"
          style={{ color: 'var(--ink)', maxWidth: '65ch' }}
        >
          MABS runs a free financial wellbeing course for Irish students called FiRe Up. Here&rsquo;s what it covers and how to access it.
        </p>
        <p
          className="font-sans text-sm leading-relaxed mb-8"
          style={{ color: 'var(--ink-2)', maxWidth: '65ch' }}
        >
          This course is provided by MABS (Money Advice and Budgeting Service) and Atlantic Technological University. Punt is independent.
        </p>

        <Rule className="mb-8" />

        {/* Content sections */}
        <div className="flex flex-col gap-6 mb-8" style={{ maxWidth: '65ch' }}>
          <div>
            <p className="font-sans text-sm font-semibold mb-2" style={{ color: 'var(--ink)' }}>
              What you&rsquo;ll learn
            </p>
            <ul className="font-sans text-sm leading-relaxed flex flex-col gap-1.5" style={{ color: 'var(--ink-2)', listStyle: 'none', padding: 0, margin: 0 }}>
              <li>— Money mindset: understanding your relationship with money</li>
              <li>— Budgeting in practice: planning income and expenses</li>
              <li>— Debt and credit: how they work and how to manage them</li>
              <li>— Saving and investing for your future</li>
            </ul>
          </div>

          <div>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              How long it takes
            </p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              Around 90 minutes, self-paced and split into short modules. You can complete it in one sitting or spread it over a few days.
            </p>
          </div>

          <div>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>
              Why we recommend it
            </p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              FiRe Up covers budgeting, debt, and financial planning in a structured 90-minute course with a digital badge on completion. It&rsquo;s a solid foundation — and Punt is designed to be the year-round reference you come back to after it.
            </p>
          </div>
        </div>

        {/* Status / CTAs */}
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
              <p className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
                Attested on {formattedDate}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Primary CTA: find out more at mabs.ie */}
            <a
              href="https://www.mabs.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-medium"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              Find out more at mabs.ie &rarr;
            </a>

            {/* Secondary CTA: self-attest completion */}
            <Button variant="ghost" onClick={handleOpenModal}>
              I&rsquo;ve completed FiRe Up
            </Button>
          </div>
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

        {/* Independence disclaimer */}
        <p
          className="font-sans text-xs mt-10 leading-relaxed"
          style={{
            color: 'var(--ink-2)',
            maxWidth: '65ch',
            borderTop: '1px solid var(--rule)',
            paddingTop: '1rem',
          }}
        >
          FiRe Up is a MABS and ATU programme. Punt has no formal affiliation with MABS or ATU. We reference this course because it&rsquo;s a free, quality resource for Irish students.
        </p>

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
          <p className="font-sans text-base" style={{ color: 'var(--surface)' }}>
            Saving...
          </p>
        </div>
      )}
    </AppShell>
  );
}
