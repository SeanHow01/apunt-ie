'use client';
import { forwardRef } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-sans font-semibold ' +
      'rounded-[var(--radius-md)] transition-all duration-150 cursor-pointer ' +
      'focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<string, string> = {
      primary:
        'bg-[var(--accent)] text-[var(--accent-ink)] shadow-sm hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm',
      secondary:
        'border border-[var(--rule)] text-[var(--ink)] bg-transparent hover:bg-[var(--ink)] hover:text-[var(--bg)] hover:border-[var(--ink)]',
      ghost:
        'text-[var(--ink-2)] bg-transparent hover:text-[var(--ink)] hover:underline hover:[text-underline-offset:4px]',
    };

    const sizes: Record<string, string> = {
      sm: 'text-sm px-4 py-2',
      md: 'text-base px-6 py-3',
      lg: 'text-lg px-8 py-4',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            <path
              d="M14 8a6 6 0 0 0-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
