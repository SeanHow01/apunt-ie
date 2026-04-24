import { createClient } from '@/lib/supabase/server';
import { ThemeProvider } from '@/lib/theme-provider';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { redirect } from 'next/navigation';
import type { ThemeId } from '@/lib/themes';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: profile } = await supabase
    .from('profiles')
    .select('theme, first_name')
    .eq('id', user.id)
    .single();

  const theme = (profile?.theme ?? 'punt') as ThemeId;

  return (
    <ThemeProvider initialTheme={theme}>
      <Sidebar />
      {children}
      <MobileTabBar />
    </ThemeProvider>
  );
}
