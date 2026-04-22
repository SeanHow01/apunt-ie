'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { restoreVersion } from '../../actions';

export function RestoreButton({
  versionId,
  articleId,
}: {
  versionId: string;
  articleId: string;
}) {
  const router = useRouter();
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restoreVersion(versionId, articleId);
      router.push(`/admin/news/${articleId}/edit`);
    } catch {
      setRestoring(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRestore}
      disabled={restoring}
      style={{
        padding: '6px 14px',
        backgroundColor: 'transparent',
        color: 'var(--ink-2)',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.8125rem',
        fontWeight: 500,
        border: '1px solid var(--rule)',
        borderRadius: '2px',
        cursor: restoring ? 'not-allowed' : 'pointer',
        opacity: restoring ? 0.5 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {restoring ? 'Restoring…' : 'Restore'}
    </button>
  );
}
