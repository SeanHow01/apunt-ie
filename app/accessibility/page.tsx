import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Rule } from '@/components/ui/Rule';

export const metadata: Metadata = {
  title: 'Accessibility | Punt',
  description:
    'Punt accessibility statement — our commitment to WCAG 2.1 AA standards, known limitations, and how to contact us about accessibility barriers.',
};

type Section = {
  heading: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    heading: 'Our commitment',
    content: (
      <p>
        Punt aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
        We believe financial education should be available to everyone, regardless of how they
        access the web. This statement was last reviewed in <strong>April 2026</strong>.
      </p>
    ),
  },
  {
    heading: 'Measures taken',
    content: (
      <ul>
        <li>Colour contrast ratios of at least 4.5:1 for body text and 3:1 for large text throughout the app.</li>
        <li>All interactive elements — buttons, links, form controls — are keyboard accessible and have visible focus indicators.</li>
        <li>Semantic HTML5 elements used throughout (<code>main</code>, <code>nav</code>, <code>article</code>, <code>section</code>, <code>header</code>, <code>footer</code>).</li>
        <li>WAI-ARIA labels on non-obvious controls (e.g. progress bars, icon-only buttons, chart regions).</li>
        <li>No content flashes more than three times per second.</li>
        <li>All meaningful images have descriptive <code>alt</code> text; decorative images have empty <code>alt=""</code>.</li>
        <li>Text can be resized up to 200% without loss of content or functionality.</li>
        <li>Lessons are navigable with keyboard alone; focus is managed between steps.</li>
      </ul>
    ),
  },
  {
    heading: 'Technical approach',
    content: (
      <>
        <p>
          Punt is built with Next.js 16 (React), TypeScript, and Tailwind CSS. We use CSS custom
          properties for theming — colour meaning is never conveyed by colour alone. A dark mode
          is available via system preference or the in-app settings panel.
        </p>
        <p>
          We test with keyboard navigation, browser zoom at 200%, and macOS VoiceOver. We aim
          to test with NVDA on Windows periodically.
        </p>
      </>
    ),
  },
  {
    heading: 'Known limitations',
    content: (
      <ul>
        <li>
          <strong>SVG charts</strong> (ETF calculator, buy-vs-rent visualiser) currently lack
          a text-based data table alternative. We plan to add summary tables in a future update.
        </li>
        <li>
          <strong>Third-party links</strong> (Revenue.ie, RTB, MABS, etc.) are outside our
          control and may not meet the same accessibility standards.
        </li>
        <li>
          <strong>Complex sliders</strong> on calculator tools are operable by keyboard but do
          not announce live values to all screen readers in every browser combination. Number
          inputs are provided as alternatives where possible.
        </li>
      </ul>
    ),
  },
  {
    heading: 'Feedback and contact',
    content: (
      <p>
        If you experience an accessibility barrier on Punt, or if a page is not working as
        expected with your assistive technology, please contact us at{' '}
        <a href="mailto:hello@punt.ie">hello@punt.ie</a> with the subject line
        "Accessibility". We aim to respond within 5 business days.
      </p>
    ),
  },
  {
    heading: 'Formal complaints',
    content: (
      <p>
        If you are not satisfied with our response, you may contact the{' '}
        <a href="https://www.ihrec.ie" target="_blank" rel="noopener noreferrer">
          Irish Human Rights and Equality Commission (IHREC)
        </a>{' '}
        or make a complaint to the{' '}
        <a href="https://www.ombudsman.ie" target="_blank" rel="noopener noreferrer">
          Office of the Ombudsman
        </a>
        .
      </p>
    ),
  },
];

export default function AccessibilityPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: '42rem',
          margin: '0 auto',
          padding: '3rem 1.5rem',
        }}
      >
        {/* Back */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            href="/"
            className="font-sans"
            style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'none' }}
          >
            &larr; Back to Punt
          </Link>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <Eyebrow>Punt</Eyebrow>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: 'var(--ink)',
            margin: '0.25rem 0 0.5rem',
          }}
        >
          Accessibility statement
        </h1>

        <p
          className="font-display italic"
          style={{
            fontSize: '1.125rem',
            color: 'var(--ink-2)',
            margin: '0 0 1.5rem',
          }}
        >
          Financial education should work for everyone.
        </p>

        <Rule className="mb-8" />

        {/* Sections */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {sections.map(({ heading, content }) => (
            <section key={heading}>
              <h2
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                  margin: '0 0 0.75rem',
                }}
              >
                {heading}
              </h2>
              <div
                className="font-sans text-sm"
                style={{
                  color: 'var(--ink-2)',
                  lineHeight: 1.7,
                }}
              >
                <style>{`
                  /* Scoped prose styles */
                  .a11y-prose p { margin: 0 0 0.75rem; }
                  .a11y-prose p:last-child { margin-bottom: 0; }
                  .a11y-prose ul { margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.375rem; }
                  .a11y-prose li { line-height: 1.65; }
                  .a11y-prose a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
                  .a11y-prose code { font-family: monospace; font-size: 0.85em; background: var(--surface); padding: 0.1em 0.3em; border-radius: 3px; }
                  .a11y-prose strong { color: var(--ink); font-weight: 600; }
                `}</style>
                <div className="a11y-prose">{content}</div>
              </div>
            </section>
          ))}
        </div>

        <Rule className="my-8" />

        <p
          className="font-sans text-xs italic"
          style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}
        >
          This statement was prepared in accordance with the European Union (Accessibility of
          Websites and Mobile Applications of Public Sector Bodies) Regulations 2020, to the
          extent applicable to private-sector educational services. It was last reviewed{' '}
          <strong style={{ color: 'var(--ink)' }}>April 2026</strong>.
        </p>
      </div>
    </main>
  );
}
