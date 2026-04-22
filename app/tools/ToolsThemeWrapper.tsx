'use client';

import { ThemeProvider } from '@/lib/theme-provider';
import { AppShell } from '@/components/layout/AppShell';

export function ToolsThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  );
}
