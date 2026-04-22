import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { SearchInput } from './SearchInput';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'var(--ink-2)',
    pending_review: 'var(--accent)',
    published: '#16a34a',
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

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
] as const;

type SearchParams = Promise<{ status?: string; q?: string }>;

export default async function AdminNewsPage({ searchParams }: { searchParams: SearchParams }) {
  const { status = '', q = '' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('articles')
    .select('id, title, status, category, published_at, updated_at')
    .order('updated_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (q) query = query.ilike('title', `%${q}%`);

  const { data: articles } = await query;

  return (
    <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1
            className="font-display"
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '2.25rem',
              fontWeight: 400,
              color: 'var(--ink)',
              marginTop: '0.5rem',
              marginBottom: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Articles
          </h1>
        </div>
        <div style={{ paddingTop: '0.25rem' }}>
          <Link href="/admin/news/new">
            <Button variant="primary" size="sm">
              + New article
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((filter) => {
            const active = status === filter.value;
            const href = filter.value
              ? `/admin/news?status=${filter.value}${q ? `&q=${encodeURIComponent(q)}` : ''}`
              : `/admin/news${q ? `?q=${encodeURIComponent(q)}` : ''}`;
            return (
              <Link
                key={filter.value}
                href={href}
                style={{
                  padding: '4px 12px',
                  borderRadius: '2px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                  backgroundColor: active ? 'var(--ink)' : 'var(--surface)',
                  color: active ? 'var(--bg)' : 'var(--ink-2)',
                  border: '1px solid var(--rule)',
                }}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <SearchInput defaultValue={q} />
      </div>

      <Rule className="mb-5" />

      {/* Table */}
      {articles && articles.length > 0 ? (
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
                {['Title', 'Status', 'Category', 'Published', 'Updated'].map((col) => (
                  <th
                    key={col}
                    className="font-sans text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: 'var(--ink-2)',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((article, i) => (
                <tr
                  key={article.id}
                  style={{ borderTop: i > 0 ? '1px solid var(--rule)' : 'none' }}
                >
                  <td style={{ padding: '0.75rem 1rem', maxWidth: '20rem' }}>
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
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <StatusBadge status={article.status} />
                  </td>
                  <td
                    className="font-sans text-sm"
                    style={{ color: 'var(--ink-2)', padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}
                  >
                    {article.category
                      ? article.category.charAt(0).toUpperCase() + article.category.slice(1)
                      : '—'}
                  </td>
                  <td
                    className="font-sans text-sm"
                    style={{ color: 'var(--ink-2)', padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}
                  >
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString('en-IE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td
                    className="font-sans text-sm"
                    style={{ color: 'var(--ink-2)', padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}
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
        <div
          style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            border: '1px solid var(--rule)',
            borderRadius: '2px',
          }}
        >
          <p
            className="font-sans text-sm"
            style={{ color: 'var(--ink-2)', fontStyle: 'italic', margin: 0 }}
          >
            {q || status ? 'No articles match your filters.' : 'No articles yet.'}
          </p>
        </div>
      )}
    </main>
  );
}
