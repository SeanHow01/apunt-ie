'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/** Key used to store the anonymous session UUID in localStorage */
const SESSION_KEY = 'punt_session_id';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

type Props = {
  articleId: string; // article slug
};

type RatingStatus = 'idle' | 'submitting' | 'done' | 'already-rated' | 'error';

export function ArticleRating({ articleId }: Props) {
  const [status, setStatus] = useState<RatingStatus>('idle');
  const [choice, setChoice] = useState<boolean | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // Resolve session ID on mount and check if already rated
  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);

    // Check if already rated (silently — don't block)
    const supabase = createClient();
    supabase
      .from('article_ratings')
      .select('helpful')
      .eq('article_id', articleId)
      .eq('session_id', sid)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setChoice(data.helpful);
          setStatus('already-rated');
        }
      });
  }, [articleId]);

  async function handleRate(helpful: boolean) {
    if (status !== 'idle' || !sessionId) return;
    setChoice(helpful);
    setStatus('submitting');

    try {
      const supabase = createClient();
      const { error } = await supabase.from('article_ratings').insert({
        article_id: articleId,
        session_id: sessionId,
        helpful,
      });

      if (error?.code === '23505') {
        // Unique constraint violation — already rated from this session
        setStatus('already-rated');
      } else if (error) {
        throw error;
      } else {
        setStatus('done');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done' || status === 'already-rated') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
          Was this helpful?
        </span>
        <span
          className="font-sans text-sm font-medium"
          style={{ color: 'var(--accent)' }}
        >
          {choice ? '👍 Yes' : '👎 No'} — thanks for the feedback.
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
        Unable to save rating — thanks anyway.
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
        Was this helpful?
      </span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          disabled={status === 'submitting'}
          onClick={() => handleRate(true)}
          className="font-sans text-sm"
          style={{
            padding: '0.375rem 0.875rem',
            border: '1px solid var(--rule)',
            borderRadius: '2px',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink)',
            cursor: status === 'submitting' ? 'wait' : 'pointer',
          }}
        >
          👍 Yes
        </button>
        <button
          type="button"
          disabled={status === 'submitting'}
          onClick={() => handleRate(false)}
          className="font-sans text-sm"
          style={{
            padding: '0.375rem 0.875rem',
            border: '1px solid var(--rule)',
            borderRadius: '2px',
            backgroundColor: 'var(--surface)',
            color: 'var(--ink)',
            cursor: status === 'submitting' ? 'wait' : 'pointer',
          }}
        >
          👎 No
        </button>
      </div>
    </div>
  );
}
