'use client';
import { forwardRef } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, id, className = '', style, ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const ariaDescribedBy = [helperText && !error ? helperId : '', error ? errorId : '']
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`} style={style}>
        <label
          htmlFor={inputId}
          className="font-sans"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)', display: 'block' }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? 'true' : undefined}
          className="font-sans focus-ring"
          style={{
            width: '100%',
            border: `1px solid ${error ? 'var(--accent)' : 'var(--rule)'}`,
            padding: '10px 12px',
            background: 'var(--paper)',
            color: 'var(--ink)',
            fontSize: '1rem',
            outline: 'none',
            borderRadius: 'var(--radius-sm)',
            ...({} as React.CSSProperties),
          }}
          {...props}
        />
        {helperText && !error && (
          <p
            id={helperId}
            className="font-sans"
            style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: 0 }}
          >
            {helperText}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="font-sans"
            style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500, margin: 0 }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
