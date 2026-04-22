import { createClient } from '@/lib/supabase/server';
import { ThemeProvider } from '@/lib/theme-provider';
import { redirect } from 'next/navigation';
import type { ThemeId } from '@/lib/themes';
import { AdminSidebar } from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: profile } = await supabase
    .from('profiles')
    .select('theme, role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/home');

  const theme = (profile?.theme ?? 'punt') as ThemeId;

  return (
    <ThemeProvider initialTheme={theme}>
      <AdminSidebar />
      {/* Content area offset by sidebar */}
      <div className="md:pl-56" style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
