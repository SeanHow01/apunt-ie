'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Masthead } from '@/components/layout/Masthead';
import { Rule } from '@/components/ui/Rule';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { createClient } from '@/lib/supabase/client';
import { getGreeting } from '@/lib/copy';

const INSTITUTIONS = [
  'ATU — Atlantic Technological University',
  'DCU — Dublin City University',
  'Dublin Business School',
  'Griffith College',
  'IADT — Institute of Art, Design and Technology',
  'MIC — Mary Immaculate College',
  'MTU — Munster Technological University',
  'Maynooth University',
  'NCAD — National College of Art and Design',
  'RCSI — Royal College of Surgeons in Ireland',
  'SETU — South East Technological University',
  'TU Dublin — Technological University Dublin',
  'TUS — Technological University of the Shannon',
  'UCC — University College Cork',
  'UCD — University College Dublin',
  'UL — University of Limerick',
  'University of Galway',
  'TCD — Trinity College Dublin',
  'Other',
] as const;

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--rule)',
  padding: '10px 12px',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '1rem',
  outline: 'none',
  borderRadius: '2px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--ink)',
  marginBottom: '6px',
};

export default function SettingsPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [institution, setInstitution] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, institution_name')
        .eq('id', data.user.id)
        .single();

      const name = profile?.first_name ?? '';
      setFirstName(name);
      setInstitution(profile?.institution_name ?? '');
      setGreeting(getGreeting(name));
    });
  }, []);

  async function handleDetailsSave(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setDetailsSaving(true);
    setDetailsSaved(false);
    try {
      const supabase = createClient();
      await supabase
        .from('profiles')
        .update({ first_name: firstName, institution_name: institution })
        .eq('id', userId);
      setDetailsSaved(true);
      setGreeting(getGreeting(firstName));
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } finally {
      setDetailsSaving(false);
    }
  }

  async function handleSignOut() {
    setSignOutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <AppShell>
      <Masthead greeting={greeting} />

      <div className="flex-1 flex flex-col px-6 py-8 gap-12 md:px-8 md:max-w-2xl md:mx-auto md:w-full">

        {/* ── Section 1: Your details ─────────────────────────── */}
        <section>
          <Eyebrow className="mb-6">Your details</Eyebrow>

          <form onSubmit={handleDetailsSave} className="max-w-sm flex flex-col gap-5">
            {/* First name */}
            <div>
              <label htmlFor="firstName" style={labelStyle}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setDetailsSaved(false);
                }}
                style={inputStyle}
              />
            </div>

            {/* Institution */}
            <div>
              <label htmlFor="institution" style={labelStyle}>
                Institution
              </label>
              <select
                id="institution"
                value={institution}
                onChange={(e) => {
                  setInstitution(e.target.value);
                  setDetailsSaved(false);
                }}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="">Select your college or university</option>
                {INSTITUTIONS.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                type="submit"
                disabled={detailsSaving}
              >
                {detailsSaving ? 'Saving...' : 'Save details'}
              </Button>
              {toastVisible && (
                <p
                  className="font-sans text-sm font-medium transition-opacity duration-300"
                  style={{ color: 'var(--accent)' }}
                >
                  Saved ✓
                </p>
              )}
            </div>
          </form>
        </section>

        <Rule />

        {/* ── Section 2: Account ──────────────────────────────── */}
        <section>
          <Eyebrow className="mb-6">Account</Eyebrow>
          <Button
            variant="secondary"
            onClick={handleSignOut}
            disabled={signOutLoading}
          >
            {signOutLoading ? 'Signing out...' : 'Sign out'}
          </Button>
        </section>

      </div>
    </AppShell>
  );
}
