# Theming system

Craic ships four themes. Any component can be restyled entirely by switching the active theme — no theme-specific component variants exist.

---

## How it works

### 1. CSS variables

Every colour in the app is a CSS variable. They are set on the `<html>` element by the `ThemeProvider`. The defaults (craic theme) are in `app/globals.css` as a fallback:

```css
:root {
  --bg: #F5EDD8;
  --surface: #FFFFFF;
  --ink: #2A1A14;
  --ink-2: #4A2C1E;
  --accent: #B85C38;
  --accent-ink: #F5EDD8;
  --rule: rgba(42, 26, 20, 0.15);
  --shell-bg: linear-gradient(180deg, #2A1A14 0%, #1A0F0B 100%);
}
```

### 2. Theme definitions

Each theme is defined as a TypeScript object in `lib/themes.ts`:

```ts
type Theme = {
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
  radius: 'sharp' | 'soft' | 'pill';
  numerals: 'roman' | 'arabic' | 'mono';
};
```

### 3. ThemeProvider

`lib/theme-provider.tsx` is a client component that:

- Reads the initial theme from `initialTheme` prop (set from the user's Supabase profile in the app layout)
- Reconciles with `localStorage` after mount
- Injects CSS variables onto `document.documentElement` on every theme change
- Exposes `useTheme()` hook returning `{ theme, setTheme }`

### 4. Tailwind v4 integration

`app/globals.css` uses `@theme inline` to map Tailwind tokens to CSS variable references:

```css
@theme inline {
  --font-display: var(--font-instrument-serif), serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-dm-mono), ui-monospace, monospace;
}
```

Components use `style={{ color: 'var(--ink)' }}` for colour (most reliable with Tailwind v4 and runtime CSS vars), and Tailwind utilities for layout and spacing.

---

## The four themes

### 1. Craic (default)

| Token | Value |
|---|---|
| bg | `#F5EDD8` — warm cream paper |
| surface | `#FFFFFF` |
| ink | `#2A1A14` — deep brown-black |
| ink-2 | `#4A2C1E` — softer brown |
| accent | `#B85C38` — burnt orange |
| Display font | Fraunces |
| Body font | Inter |
| Radius | Sharp (0/2/4px) |
| Numerals | Roman (i, ii, iii...) |

Aesthetic: editorial small-press magazine, warm, Irish-literary.

### 2. Punt

| Token | Value |
|---|---|
| bg | `#FAF7F2` — off-white |
| ink | `#1A1A1A` — near-black |
| accent | `#E94F37` — red |
| Display font | Fraunces |
| Radius | Soft (4/8/12px) |
| Numerals | Arabic |

Aesthetic: classical broadsheet newspaper.

### 3. Bob

| Token | Value |
|---|---|
| bg | `#FFFBF5` — warm cream |
| ink | `#1A2E1F` — dark green |
| accent | `#2EAF6F` — green |
| Display font | DM Sans (heavy) |
| Radius | Pill (20px/9999px) |
| Numerals | Arabic |

Aesthetic: friendly, modern, credit-union energy.

### 4. Ledger

| Token | Value |
|---|---|
| bg | `#F5F2EB` — cream paper |
| ink | `#0A0E1A` — navy |
| accent | `#0A0E1A` — navy (monochrome) |
| Display font | Inter |
| Mono font | DM Mono (for numbers) |
| Radius | Sharp |
| Numerals | Mono |

Aesthetic: minimalist, accountant-serious.

---

## Adding a fifth theme

1. **Add the font** (if new) in `app/layout.tsx`:

   ```ts
   import { YourFont } from 'next/font/google';
   const yourFont = YourFont({ ... variable: '--font-your-font', display: 'swap' });
   ```

   Add the variable to the `<html>` className list.

2. **Define the theme** in `lib/themes.ts`:

   ```ts
   {
     id: 'your-theme' as const,
     name: 'Your Theme',
     fonts: { display: 'Your Font', body: 'Inter' },
     colors: {
       bg: '#...',
       surface: '#...',
       ink: '#...',
       ink2: '#...',
       accent: '#...',
       accentInk: '#...',
       rule: 'rgba(...)',
       shellBg: 'linear-gradient(...)',
     },
     radius: 'sharp',
     numerals: 'arabic',
   }
   ```

3. **Update the ThemeId type** to include the new id:

   ```ts
   export type ThemeId = 'craic' | 'punt' | 'bob' | 'ledger' | 'your-theme';
   ```

4. **Update the Supabase check constraint** in a new migration:

   ```sql
   alter table public.profiles 
     drop constraint profiles_theme_check,
     add constraint profiles_theme_check 
       check (theme in ('craic','punt','bob','ledger','your-theme'));
   ```

5. **That's it.** The settings page theme switcher reads from the `themes` array automatically, so it will show the new tile without any UI changes.

---

## Accessibility notes

- All four themes pass WCAG 2.2 AA contrast for body text (`ink` on `bg`)
- The accent colour is used sparingly; it never carries meaning alone — always paired with text or structure
- The focus ring uses `var(--accent)` (2px, with 2px offset) across all themes
