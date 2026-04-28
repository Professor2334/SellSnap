import * as React from 'react';
import { clsx } from 'clsx';

// Card Component
export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={clsx('card', className)} style={style}>
      {children}
    </div>
  );
}

// Input Component
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={clsx('input-field', error && 'input-error', className)}
          {...props}
        />
        {error && <p className="input-error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
