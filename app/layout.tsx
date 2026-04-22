import type { Metadata, Viewport } from 'next';
import {
  Instrument_Serif,
  Inter,
  Fraunces,
  DM_Sans,
  DM_Mono,
} from 'next/font/google';
import './globals.css';

/*
 * All theme fonts loaded upfront.
 * Acceptable cost for MVP; each theme's display font is available immediately on switch.
 */
const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Punt — Your money, explained properly.',
  description:
    'A financial literacy guide for Irish university students. Payslips, pensions, rent, grants — explained plainly.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Punt',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A1A1A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        instrumentSerif.variable,
        inter.variable,
        fraunces.variable,
        dmSans.variable,
        dmMono.variable,
      ].join(' ')}
    >
      <body>{children}</body>
    </html>
  );
}
