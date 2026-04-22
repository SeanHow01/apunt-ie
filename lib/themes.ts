export type ThemeId = 'craic' | 'punt' | 'bob' | 'ledger';
export type ThemeRadius = 'sharp' | 'soft' | 'pill';
export type ThemeNumerals = 'roman' | 'arabic' | 'mono';

export type Theme = {
  id: ThemeId;
  name: string;
  fonts: { display: string; body: string; mono?: string };
  colors: {
    bg: string;
    surface: string;
    ink: string;
    ink2: string;
    accent: string;
    accentInk: string;
    rule: string;
    shellBg: string;
  };
  radius: ThemeRadius;
  numerals: ThemeNumerals;
};

export const themes: Theme[] = [
  {
    id: 'craic',
    name: 'Craic',
    fonts: { display: 'Instrument Serif', body: 'Inter' },
    colors: {
      bg: '#F5EDD8',
      surface: '#FFFFFF',
      ink: '#2A1A14',
      ink2: '#4A2C1E',
      accent: '#B85C38',
      accentInk: '#F5EDD8',
      rule: 'rgba(42,26,20,0.15)',
      shellBg: 'linear-gradient(180deg, #2A1A14 0%, #1A0F0B 100%)',
    },
    radius: 'sharp',
    numerals: 'roman',
  },
  {
    id: 'punt',
    name: 'Punt',
    fonts: { display: 'Fraunces', body: 'Inter' },
    colors: {
      bg: '#FAF7F2',
      surface: '#FFFFFF',
      ink: '#1A1A1A',
      ink2: '#3A3A3A',
      accent: '#E94F37',
      accentInk: '#FAF7F2',
      rule: 'rgba(26,26,26,0.15)',
      shellBg: 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)',
    },
    radius: 'soft',
    numerals: 'arabic',
  },
  {
    id: 'bob',
    name: 'Bob',
    fonts: { display: 'DM Sans', body: 'DM Sans' },
    colors: {
      bg: '#FFFBF5',
      surface: '#FFFFFF',
      ink: '#1A2E1F',
      ink2: '#2D4A34',
      accent: '#2EAF6F',
      accentInk: '#FFFBF5',
      rule: 'rgba(26,46,31,0.15)',
      shellBg: 'linear-gradient(180deg, #1A2E1F 0%, #0D1F12 100%)',
    },
    radius: 'pill',
    numerals: 'arabic',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    fonts: { display: 'Inter', body: 'Inter', mono: 'DM Mono' },
    colors: {
      bg: '#F5F2EB',
      surface: '#FFFFFF',
      ink: '#0A0E1A',
      ink2: '#1E2540',
      accent: '#0A0E1A',
      accentInk: '#F5F2EB',
      rule: 'rgba(10,14,26,0.15)',
      shellBg: 'linear-gradient(180deg, #0A0E1A 0%, #060810 100%)',
    },
    radius: 'sharp',
    numerals: 'mono',
  },
];

export const defaultTheme = themes[1]; // Punt is the master brand

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) ?? defaultTheme;
}
