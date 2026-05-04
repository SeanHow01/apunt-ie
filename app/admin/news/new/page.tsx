// Future: AI-assisted drafting tab. Data model already supports it
// (see article_versions.source_type='ai_draft'). Out of scope for this build.
'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { marked } from 'marked';
import { ARTICLE_CATEGORIES, ARTICLE_TYPES, MODULE_OPTIONS } from '@/lib/constants';
import { createArticle } from '../actions';

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--rule)',
  padding: '10px 12px',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.9375rem',
  outline: 'none',
  borderRadius: '2px',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--ink)',
  marginBottom: '6px',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calcReadingMinutes(text: string): number {
  if (!text.trim()) return 1;
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
}

type Source = { title: string; url: string; publication: string; date: string };

const emptySource = (): Source => ({ title: '', url: '', publication: '', date: '' });

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState(ARTICLE_CATEGORIES[0].value);
  const [articleType, setArticleType] = useState(ARTICLE_TYPES[0].value);
  const [relatedModules, setRelatedModules] = useState<string[]>([]);
  const [sources, setSources] = useState<Source[]>([emptySource()]);
  const [contentMd, setContentMd] = useState('');
  const [readingMinutes, setReadingMinutes] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setTitle(val);
      if (!slugManual) setSlug(slugify(val));
    },
    [slugManual],
  );

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManual(true);
    setSlug(e.target.value);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContentMd(val);
    setReadingMinutes(calcReadingMinutes(val));
  }, []);

  const handleModuleToggle = (id: string) => {
    setRelatedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const updateSource = (i: number, field: keyof Source, value: string) => {
    setSources((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };

  const removeSource = (i: number) => {
    setSources((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addSource = () => setSources((prev) => [...prev, emptySource()]);

  const getFormData = () => ({
    title,
    slug,
    summary,
    content_md: contentMd,
    category,
    article_type: articleType,
    related_module_ids: relatedModules,
    sources,
    reading_minutes: readingMinutes,
  });

  const handleSaveDraft = async () => {
    setSaving(true);
    setError('');
    try {
      const { id } = await createArticle(getFormData());
      router.push(`/admin/news/${id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSaving(false);
    }
  };

  const handleSaveAndPreview = async () => {
    setSaving(true);
    setError('');
    try {
      const { id } = await createArticle(getFormData());
      window.open(`/news/${slug}?preview=true`, '_blank');
      router.push(`/admin/news/${id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
      setSaving(false);
    }
  };

  const previewHtml = contentMd ? (marked(contentMd) as string) : '';

  return (
    <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Back link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/admin/news"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            color: 'var(--ink-2)',
            textDecoration: 'none',
          }}
        >
          ← Articles
        </Link>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: '2.25rem',
          fontWeight: 400,
          color: 'var(--ink)',
          marginBottom: '2rem',
          letterSpacing: '-0.02em',
        }}
      >
        New article
      </h1>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '2px',
            color: '#dc2626',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title */}
        <div>
          <label style={labelStyle} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Article title"
            style={inputStyle}
          />
        </div>

        {/* Slug */}
        <div>
          <label style={labelStyle} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            placeholder="article-slug"
            style={inputStyle}
          />
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8125rem',
              color: 'var(--ink-2)',
              marginTop: '4px',
            }}
          >
            Auto-generated from title. Edit to override.
          </p>
        </div>

        {/* Summary */}
        <div>
          <label style={labelStyle} htmlFor="summary">
            Summary{' '}
            <span
              style={{
                fontWeight: 400,
                color: summary.length > 280 ? '#dc2626' : 'var(--ink-2)',
              }}
            >
              ({summary.length}/280)
            </span>
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            maxLength={280}
            placeholder="Brief summary shown in article listings…"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Category + Article type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle} htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              style={inputStyle}
            >
              {ARTICLE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle} htmlFor="article_type">
              Article type
            </label>
            <select
              id="article_type"
              value={articleType}
              onChange={(e) => setArticleType(e.target.value as typeof articleType)}
              style={inputStyle}
            >
              {ARTICLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Related modules */}
        <div>
          <span style={labelStyle}>Related modules</span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
              gap: '0.5rem',
            }}
          >
            {MODULE_OPTIONS.map((mod) => (
              <label
                key={mod.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--rule)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  backgroundColor: relatedModules.includes(mod.id)
                    ? 'var(--surface)'
                    : 'transparent',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--ink)',
                }}
              >
                <input
                  type="checkbox"
                  checked={relatedModules.includes(mod.id)}
                  onChange={() => handleModuleToggle(mod.id)}
                  style={{ accentColor: 'var(--accent)' }}
                />
                {mod.title}
              </label>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div>
          <span style={labelStyle}>Sources</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sources.map((source, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--rule)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div>
                    <label
                      style={{ ...labelStyle, fontSize: '0.8125rem' }}
                      htmlFor={`source-title-${i}`}
                    >
                      Title
                    </label>
                    <input
                      id={`source-title-${i}`}
                      type="text"
                      value={source.title}
                      onChange={(e) => updateSource(i, 'title', e.target.value)}
                      placeholder="Source title"
                      style={{ ...inputStyle, fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label
                      style={{ ...labelStyle, fontSize: '0.8125rem' }}
                      htmlFor={`source-url-${i}`}
                    >
                      URL
                    </label>
                    <input
                      id={`source-url-${i}`}
                      type="url"
                      value={source.url}
                      onChange={(e) => updateSource(i, 'url', e.target.value)}
                      placeholder="https://…"
                      style={{ ...inputStyle, fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label
                      style={{ ...labelStyle, fontSize: '0.8125rem' }}
                      htmlFor={`source-pub-${i}`}
                    >
                      Publication
                    </label>
                    <input
                      id={`source-pub-${i}`}
                      type="text"
                      value={source.publication}
                      onChange={(e) => updateSource(i, 'publication', e.target.value)}
                      placeholder="e.g. Revenue.ie"
                      style={{ ...inputStyle, fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label
                      style={{ ...labelStyle, fontSize: '0.8125rem' }}
                      htmlFor={`source-date-${i}`}
                    >
                      Date
                    </label>
                    <input
                      id={`source-date-${i}`}
                      type="date"
                      value={source.date}
                      onChange={(e) => updateSource(i, 'date', e.target.value)}
                      style={{ ...inputStyle, fontSize: '0.875rem' }}
                    />
                  </div>
                </div>
                {sources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSource(i)}
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Remove source
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSource}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.875rem',
                color: 'var(--ink-2)',
                background: 'none',
                border: '1px dashed var(--rule)',
                borderRadius: '2px',
                padding: '0.625rem 1rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              + Add source
            </button>
          </div>
        </div>

        {/* Reading time */}
        <div>
          <label style={labelStyle} htmlFor="reading_minutes">
            Reading time (minutes)
          </label>
          <input
            id="reading_minutes"
            type="number"
            min={1}
            value={readingMinutes}
            onChange={(e) => setReadingMinutes(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ ...inputStyle, width: '8rem' }}
          />
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8125rem',
              color: 'var(--ink-2)',
              marginTop: '4px',
            }}
          >
            Auto-calculated from word count. Override if needed.
          </p>
        </div>

        {/* Content — split editor/preview */}
        <div>
          <span style={labelStyle}>Content (Markdown)</span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              alignItems: 'start',
            }}
            className="max-md:grid-cols-1"
          >
            <textarea
              value={contentMd}
              onChange={handleContentChange}
              placeholder="Write in Markdown…"
              style={{
                ...inputStyle,
                minHeight: '400px',
                resize: 'vertical',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              }}
            />
            <div
              style={{
                minHeight: '400px',
                padding: '10px 12px',
                border: '1px solid var(--rule)',
                borderRadius: '2px',
                backgroundColor: 'var(--surface)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.9375rem',
                color: 'var(--ink)',
                lineHeight: 1.7,
                overflowY: 'auto',
              }}
            >
              {previewHtml ? (
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              ) : (
                <span style={{ color: 'var(--ink-2)', fontStyle: 'italic' }}>
                  Preview will appear here…
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--rule)',
          }}
        >
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || !title || !slug}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--ink)',
              color: 'var(--bg)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '2px',
              cursor: saving || !title || !slug ? 'not-allowed' : 'pointer',
              opacity: saving || !title || !slug ? 0.5 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            type="button"
            onClick={handleSaveAndPreview}
            disabled={saving || !title || !slug}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              color: 'var(--ink-2)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 500,
              border: 'none',
              borderRadius: '2px',
              cursor: saving || !title || !slug ? 'not-allowed' : 'pointer',
              opacity: saving || !title || !slug ? 0.5 : 1,
            }}
          >
            Save and preview
          </button>
        </div>
      </div>
    </main>
  );
}
