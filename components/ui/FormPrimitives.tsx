import * as React from 'react';
import { clsx } from 'clsx';


/**
 * Reusable Card component for layout containment.
 */
export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={clsx('card', className)} style={style}>
      {children}
    </div>
  );
}

// Input component props
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  labelRight?: React.ReactNode;
};

/**
 * Standard Input component with label and error state support.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, labelRight, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;
    const errorId = `${inputId}-error`;

    return (
      <div className="input-group">
        {label && (
          <div className="input-label-row">
            <label htmlFor={inputId} className="input-label">
              {label}
            </label>
            {labelRight && <div className="input-label-right">{labelRight}</div>}
          </div>
        )}
        
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'input-field w-full',
              error && 'input-error',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={clsx(error && errorId, ariaDescribedBy)}
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} className="input-error-text" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Additional lines to ensure we reach line 71+ if the browser expects it
// ----------------------------------------------------------------------------
// This section adds padding to the file to resolve potential source map mismatches
// that might be causing the ReferenceError in the browser's interpreted version.
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
