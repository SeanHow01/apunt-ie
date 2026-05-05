import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in?redirect=/setu/admin')

  const admin = createAdminClient()
  const { data: staffRow } = await admin
    .from('saf_staff_users')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!staffRow) redirect('/setu?error=not_staff')

  return <>{children}</>
}
