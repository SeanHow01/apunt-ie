'use server';

import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Create the public.profiles row for a newly signed-up user.
 *
 * Why a server action with the admin client?
 * When Supabase has "Confirm email" enabled, supabase.auth.signUp() returns the
 * new auth user but no session. The browser client therefore has no auth.uid(),
 * and the "insert own profile" RLS policy (auth.uid() = id) blocks the insert.
 * Calling this server action uses the service-role admin client which bypasses
 * RLS, so the profile is created reliably regardless of session state.
 */
export async function createUserProfile(params: {
  userId: string;
  firstName: string;
  institutionName: string;
  cohortId: string | null;
}): Promise<{ ok: true } | { error: string }> {
  if (!params.userId) return { error: 'Missing user id' };

  const admin = createAdminClient();
  const { error } = await admin.from('profiles').upsert(
    {
      id: params.userId,
      first_name: params.firstName,
      institution_name: params.institutionName,
      institution_id: null,
      cohort_id: params.cohortId,
      theme: 'punt',
    },
    { onConflict: 'id' },
  );

  if (error) return { error: error.message };
  return { ok: true };
}
