import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Rule } from '@/components/ui/Rule';
import { DiffView } from './DiffView';
import { RestoreButton } from './RestoreButton';

const SOURCE_TYPE_LABELS: Record<string, string> = {
  manual_draft: 'Manual draft',
  manual_edit: 'Manual edit',
  published: 'Published',
  ai_draft: 'AI draft',
  restored: 'Restored from version',
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticleHistoryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: article }, { data: versions }] = await Promise.all([
    supabase.from('articles').select('id, title').eq('id', id).single(),
    supabase
      .from('article_versions')
      .select('*')
      .eq('article_id', id)
      .order('version_number', { ascending: false }),
  ]);

  if (!article) notFound();

  return (
    <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Back link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href={`/admin/news/${id}/edit`}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            color: 'var(--ink-2)',
            textDecoration: 'none',
          }}
        >
          ← Edit article
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Eyebrow>Version history</Eyebrow>
        <h1
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '2rem',
            fontWeight: 400,
            color: 'var(--ink)',
            marginTop: '0.5rem',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          {article.title}
        </h1>
      </div>

      <div style={{ marginBottom: '2rem' }}><Rule /></div>

      {/* Version list */}
      {!versions || versions.length === 0 ? (
        <p
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', fontStyle: 'italic' }}
        >
          No versions recorded yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {versions.map((version, i) => {
            // The version after this one in the list (i.e. the previous version chronologically)
            const olderVersion = versions[i + 1];

            return (
              <div
                key={version.id}
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                {/* Version header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'var(--surface)',
                    borderBottom: '1px solid var(--rule)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      className="font-sans font-semibold"
                      style={{ fontSize: '0.9375rem', color: 'var(--ink)' }}
                    >
                      Version {version.version_number}
                    </span>
                    <span
                      className="font-sans text-xs uppercase tracking-wide font-medium px-2 py-0.5"
                      style={{
                        color: 'var(--ink-2)',
                        border: '1px solid var(--rule)',
                        borderRadius: '2px',
                      }}
                    >
                      {SOURCE_TYPE_LABELS[version.source_type] ?? version.source_type}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <span
                      className="font-sans text-sm"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {version.created_at
                        ? new Date(version.created_at).toLocaleString('en-IE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                    {/* Don't show Restore on the most recent version */}
                    {i > 0 && (
                      <RestoreButton versionId={version.id} articleId={id} />
                    )}
                  </div>
                </div>

                {/* Version content summary */}
                <div style={{ padding: '1rem' }}>
                  <div style={{ marginBottom: olderVersion ? '1rem' : 0 }}>
                    <p
                      className="font-sans text-sm"
                      style={{ color: 'var(--ink-2)', marginBottom: '0.25rem' }}
                    >
                      <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Title:</strong>{' '}
                      {version.title}
                    </p>
                    {version.summary && (
                      <p
                        className="font-sans text-sm"
                        style={{ color: 'var(--ink-2)', marginBottom: 0 }}
                      >
                        <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>Summary:</strong>{' '}
                        {version.summary}
                      </p>
                    )}
                  </div>

                  {/* Diff vs previous version */}
                  {olderVersion && (
                    <div>
                      <p
                        className="font-sans text-xs font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--ink-2)', marginBottom: '0.5rem' }}
                      >
                        Changes vs. version {olderVersion.version_number}
                      </p>
                      <DiffView
                        oldContent={olderVersion.content_md ?? ''}
                        newContent={version.content_md ?? ''}
                      />
                    </div>
                  )}

                  {/* No diff for the oldest version — just show a note */}
                  {!olderVersion && (
                    <p
                      className="font-sans text-xs"
                      style={{ color: 'var(--ink-2)', fontStyle: 'italic', marginTop: '0.5rem' }}
                    >
                      Initial version — no previous version to diff against.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
