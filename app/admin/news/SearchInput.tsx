'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const val = e.target.value.trim();
      if (val) {
        params.set('q', val);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <input
      type="search"
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder="Search articles…"
      style={{
        border: '1px solid var(--rule)',
        padding: '8px 12px',
        background: 'var(--surface)',
        color: 'var(--ink)',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.875rem',
        outline: 'none',
        borderRadius: '2px',
        width: '16rem',
      }}
    />
  );
}
