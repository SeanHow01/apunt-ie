'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { type Theme, type ThemeId, getTheme } from '@/lib/themes';

// Storage key kept as 'craic-theme' for localStorage backward-compat with early users
const STORAGE_KEY = 'craic-theme';

// ---------------------------------------------------------------------------
// CSS variable injection
// ---------------------------------------------------------------------------

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Colour tokens — match the CSS variable names used throughout components
  root.style.setProperty('--bg', theme.colors.bg);
  root.style.setProperty('--surface', theme.colors.surface);
  root.style.setProperty('--ink', theme.colors.ink);
  root.style.setProperty('--ink-2', theme.colors.ink2);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-ink', theme.colors.accentInk);
  root.style.setProperty('--rule', theme.colors.rule);
  root.style.setProperty('--shell-bg', theme.colors.shellBg);

  // Border radius tokens
  const radii = resolveRadii(theme.radius);
  root.style.setProperty('--radius-sm', radii.sm);
  root.style.setProperty('--radius-md', radii.md);
  root.style.setProperty('--radius-lg', radii.lg);

  // Data attribute for any CSS selectors that need it
  root.setAttribute('data-theme', theme.id);
}

function resolveRadii(radius: Theme['radius']): {
  sm: string;
  md: string;
  lg: string;
} {
  switch (radius) {
    case 'sharp':
      return { sm: '0px', md: '2px', lg: '4px' };
    case 'soft':
      return { sm: '4px', md: '8px', lg: '12px' };
    case 'pill':
      return { sm: '20px', md: '9999px', lg: '9999px' };
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: ThemeId, onUpdate?: () => Promise<void>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  children: ReactNode;
  /** Pass the user's saved ThemeId from a server-rendered profile to avoid flash. */
  initialTheme?: ThemeId;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  // Use initialTheme for the first render so SSR and client agree, preventing
  // hydration mismatches. We reconcile with localStorage after mount.
  const [themeId, setThemeId] = useState<ThemeId>(initialTheme ?? 'punt');

  // After mount: reconcile with localStorage (user may have changed it locally)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const validIds: ThemeId[] = ['craic', 'punt', 'bob', 'ledger'];
    if (stored && validIds.includes(stored)) {
      setThemeId(stored);
    } else if (initialTheme) {
      localStorage.setItem(STORAGE_KEY, initialTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply CSS variables to <html> whenever theme changes
  useEffect(() => {
    applyTheme(getTheme(themeId));
  }, [themeId]);

  function setTheme(id: ThemeId, onUpdate?: () => Promise<void>) {
    setThemeId(id);
    localStorage.setItem(STORAGE_KEY, id);
    // Fire-and-forget Supabase update — never blocks the UI
    onUpdate?.().catch(console.error);
  }

  return (
    <ThemeContext.Provider value={{ theme: getTheme(themeId), setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
