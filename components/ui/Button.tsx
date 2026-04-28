import * as React from 'react';
import { clsx } from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
    const baseStyles = 'btn';
    const variantStyles = `btn-${variant}`;
    const sizeStyles = `btn-${size}`;
    const widthStyles = fullWidth ? 'btn-full' : '';

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles, sizeStyles, widthStyles, className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
