'use client';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex items-start justify-center md:block md:pl-56"
      style={{ background: 'var(--shell-bg)' }}
    >
      <div
        className="w-full max-w-lg md:max-w-none min-h-screen flex flex-col pb-20 md:pb-0"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {children}
      </div>
    </div>
  );
}
