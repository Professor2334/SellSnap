import * as React from 'react';
import { clsx } from 'clsx';
import { AlertTriangle } from 'lucide-react';

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
  labelRight?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, labelRight, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && (
          <div className="input-label-row">
            <label htmlFor={id} className="input-label">
              {label}
            </label>
            {labelRight && <div className="input-label-right">{labelRight}</div>}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={clsx('input-field', error && 'input-error', className)}
          {...props}
        />
        {error && (
          <p className="input-error-text">
            <AlertTriangle size={14} style={{ marginRight: '4px' }} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
