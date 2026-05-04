'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  userId: string | null;
  moduleId: string;
  moduleName: string;
};

const SCORES = [1, 2, 3, 4, 5] as const;
type Score = (typeof SCORES)[number];

const SCORE_LABELS: Record<Score, string> = {
  1: 'Not at all',
  2: 'Slightly',
  3: 'Somewhat',
  4: 'Fairly',
  5: 'Very',
};

const SCORE_MESSAGES: Record<Score, string> = {
  1: "That's helpful to know — revisit the lesson anytime, and check the glossary for any terms that felt unclear.",
  2: "Worth re-reading a section or two. The glossary and related tools can help reinforce the concepts.",
  3: "Good start. Try one of the related tools to see the concepts in action with your own numbers.",
  4: 'Solid. You\'re in good shape — keep going with the next lesson.',
  5: 'Excellent. You\'ve got this. Pass it on — explaining a concept to someone else is the best way to lock it in.',
};

type Status = 'idle' | 'submitting' | 'done' | 'error';

export function ConfidenceSurvey({ userId, moduleId, moduleName }: Props) {
  const [selected, setSelected] = useState<Score | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(score: Score) {
    setSelected(score);
    if (!userId) {
      setStatus('done');
      return;
    }
    setStatus('submitting');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('confidence_surveys').upsert({
        user_id: userId,
        module_id: moduleId,
        score,
        submitted_at: new Date().toISOString(),
      });
      if (error) throw error;
      setStatus('done');
    } catch {
      // Non-blocking: show done anyway, don't break the completion flow
      setStatus('done');
    }
  }

  if (status === 'done' && selected !== null) {
    return (
      <div
        style={{
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <p
          className="font-sans text-sm font-medium mb-1"
          style={{ color: 'var(--ink)' }}
        >
          {SCORE_LABELS[selected]} confident — thanks.
        </p>
        <p
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}
        >
          {SCORE_MESSAGES[selected]}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        borderRadius: '4px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      <p
        className="font-sans text-sm font-medium mb-3"
        style={{ color: 'var(--ink)' }}
      >
        How confident do you feel about{' '}
        <span style={{ color: 'var(--accent)' }}>{moduleName}</span> now?
      </p>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
        role="group"
        aria-label="Confidence rating"
      >
        {SCORES.map((score) => (
          <button
            key={score}
            type="button"
            disabled={status === 'submitting'}
            onClick={() => handleSubmit(score)}
            aria-label={`${score} — ${SCORE_LABELS[score]} confident`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.625rem 0.75rem',
              border: '1px solid var(--rule)',
              borderRadius: '4px',
              backgroundColor:
                selected === score ? 'var(--accent)' : 'var(--bg)',
              color: selected === score ? 'var(--accent-ink)' : 'var(--ink)',
              cursor: status === 'submitting' ? 'wait' : 'pointer',
              minWidth: '3.25rem',
              transition: 'background-color 0.1s ease, border-color 0.1s ease',
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: '1.25rem',
                lineHeight: 1,
                color: 'inherit',
              }}
            >
              {score}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: selected === score ? 'var(--accent-ink)' : 'var(--ink-2)',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                textAlign: 'center',
              }}
            >
              {SCORE_LABELS[score]}
            </span>
          </button>
        ))}
      </div>

      <p
        className="font-sans text-xs mt-2"
        style={{ color: 'var(--ink-2)' }}
      >
        1 = not at all confident &mdash; 5 = very confident
      </p>
    </div>
  );
}
