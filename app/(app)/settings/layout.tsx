import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings — Punt',
  description: 'Manage your Punt profile, institution, and account settings.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
