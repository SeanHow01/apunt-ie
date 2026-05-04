type Props = {
  term: string;
  pos?: string;
  definition: string;
  seeAlso?: string[] | null;
  id?: string;
};

export function GlossaryCard({ term, pos, definition, seeAlso, id }: Props) {
  return (
    <div id={id} style={{ borderBottom: '1px solid var(--rule)', padding: '1rem 0' }}>
      {/* Term + PoS */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
        <span
          className="font-display"
          style={{ fontSize: '1.0625rem', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.2 }}
        >
          {term}
        </span>
        {pos && (
          <span
            className="font-mono italic"
            style={{ fontSize: '0.625rem', color: 'var(--ink-3)', letterSpacing: '0.04em' }}
          >
            {pos}
          </span>
        )}
      </div>
      {/* Definition */}
      <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>
        {definition}
      </p>
      {/* See also */}
      {seeAlso && seeAlso.length > 0 && (
        <p
          className="font-sans"
          style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: '0.375rem 0 0', fontStyle: 'italic' }}
        >
          See also: {seeAlso.join(', ')}
        </p>
      )}
    </div>
  );
}
