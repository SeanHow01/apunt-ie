'use client';
import { forwardRef } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-sans font-semibold transition-opacity focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: '',
      secondary: '',
      ghost: '',
    };

    const sizes = {
      sm: 'text-sm px-4 py-2',
      md: 'text-base px-6 py-3',
      lg: 'text-base px-8 py-4',
    };

    // Use inline styles for theme-aware colors
    const variantStyle: React.CSSProperties =
      variant === 'primary'
        ? {
            backgroundColor: 'var(--ink)',
            color: 'var(--bg)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }
        : variant === 'secondary'
        ? {
            backgroundColor: 'transparent',
            color: 'var(--ink)',
            border: '1px solid var(--ink)',
          }
        : {
            backgroundColor: 'transparent',
            color: 'var(--ink-2)',
          };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        style={variantStyle}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
