'use client';

import { ThemeProvider } from '@/lib/theme-provider';
import { AppShell } from '@/components/layout/AppShell';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

export function ToolsThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Sidebar />
      <AppShell>{children}</AppShell>
      <MobileTabBar />
    </ThemeProvider>
  );
}
