import Link from 'next/link';

type Props = {
  title: string;
  subtitle: string;
  href: string;
  decorativeChar?: string;
};

export function ToolCard({ title, subtitle, href, decorativeChar = '€' }: Props) {
  return (
    <Link href={href} className="block no-underline">
      <div
        className="relative overflow-hidden p-6 sm:p-8"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }}
      >
        {/* Decorative corner character */}
        <span
          className="font-display italic absolute right-4 top-2 select-none text-[7rem] leading-none pointer-events-none"
          style={{ color: 'var(--accent-ink)', opacity: 0.18 }}
          aria-hidden="true"
        >
          {decorativeChar}
        </span>

        {/* Eyebrow */}
        <span
          className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] leading-none block mb-4"
          style={{ color: 'var(--accent-ink)', opacity: 0.7 }}
        >
          Tool
        </span>

        {/* Title */}
        <h2
          className="font-display text-xl sm:text-2xl leading-snug mb-2 max-w-[26ch]"
          style={{ color: 'var(--accent-ink)' }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p
          className="font-sans text-sm leading-relaxed max-w-[34ch]"
          style={{ color: 'var(--accent-ink)', opacity: 0.8 }}
        >
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
