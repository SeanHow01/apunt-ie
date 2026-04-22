import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'var(--ink-2)',
    pending_review: 'var(--accent)',
    published: '#16a34a', // green — fixed color since this is semantic
    archived: 'var(--rule)',
  };
  const color = colors[status] ?? 'var(--ink-2)';
  return (
    <span
      className="font-sans text-xs uppercase tracking-wide font-medium px-2 py-0.5"
      style={{
        color,
        border: `1px solid ${color}`,
        borderRadius: '2px',
      }}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts for each status
  const [{ count: draftCount }, { count: pendingCount }, { count: publishedCount }] =
    await Promise.all([
      supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft'),
      supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_review'),
      supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published'),
    ]);

  // Recent articles
  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(10);

  return (
    <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Eyebrow>Admin</Eyebrow>
        <h1
          className="font-display"
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '2.25rem',
            fontWeight: 400,
            color: 'var(--ink)',
            marginTop: '0.5rem',
            marginBottom: '0',
            letterSpacing: '-0.02em',
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Action */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/news/new">
          <Button variant="primary" size="sm">
            + New article
          </Button>
        </Link>
      </div>

      <Rule className="mb-8" />

      {/* Status count cards */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Drafts', count: draftCount ?? 0, color: 'var(--ink-2)' },
          { label: 'Pending review', count: pendingCount ?? 0, color: 'var(--accent)' },
          { label: 'Published', count: publishedCount ?? 0, color: '#16a34a' },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            style={{
              flex: '1 1 10rem',
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--rule)',
              borderRadius: '2px',
            }}
          >
            <div
              className="font-sans text-sm"
              style={{ color: 'var(--ink-2)', marginBottom: '0.5rem' }}
            >
              {label}
            </div>
            <div
              className="font-sans font-semibold"
              style={{ fontSize: '2rem', color, lineHeight: 1 }}
            >
              {count}
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{ marginBottom: '2rem' }}>
        <h2
          className="font-sans font-semibold"
          style={{ fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '1rem' }}
        >
          Recent activity
        </h2>

        {recentArticles && recentArticles.length > 0 ? (
          <div
            style={{
              border: '1px solid var(--rule)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  {['Title', 'Status', 'Updated'].map((col) => (
                    <th
                      key={col}
                      className="font-sans text-xs font-semibold uppercase tracking-wide"
                      style={{
                        color: 'var(--ink-2)',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article, i) => (
                  <tr
                    key={article.id}
                    style={{
                      borderTop: i > 0 ? '1px solid var(--rule)' : 'none',
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Link
                        href={`/admin/news/${article.id}/edit`}
                        style={{
                          fontFamily: 'Inter, system-ui, sans-serif',
                          fontSize: '0.9375rem',
                          color: 'var(--ink)',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <StatusBadge status={article.status} />
                    </td>
                    <td
                      className="font-sans text-sm"
                      style={{ color: 'var(--ink-2)', padding: '0.75rem 1rem' }}
                    >
                      {article.updated_at
                        ? new Date(article.updated_at).toLocaleDateString('en-IE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p
            className="font-sans text-sm"
            style={{ color: 'var(--ink-2)', fontStyle: 'italic' }}
          >
            No articles yet.
          </p>
        )}
      </div>

      <Rule className="mt-10 mb-6" />

      {/* Tip box */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--rule)',
          borderRadius: '2px',
        }}
      >
        <p
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}
        >
          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Tip:</strong> Draft articles
          in Claude Pro using the Punt writing guide (docs/writing-guide.md), then paste into
          the editor here.
        </p>
      </div>
    </main>
  );
}
