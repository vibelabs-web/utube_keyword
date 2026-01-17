import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Loading';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Button component with multiple variants and sizes
 * Follows YouTube-inspired design system with primary red color
 *
 * Features:
 * - Three variants: primary, secondary, ghost
 * - Three sizes: sm, md, lg
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Full accessibility support
 * - Smooth hover/active transitions
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-dark active:scale-98',
      secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:scale-98',
      ghost: 'text-slate-700 hover:bg-slate-100 active:scale-98',
    };

    const sizeClasses = {
      sm: 'text-sm px-3 py-1.5 rounded-md gap-1.5',
      md: 'text-base px-4 py-2 rounded-lg gap-2',
      lg: 'text-lg px-6 py-3 rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Spinner size={size === 'sm' ? 'sm' : 'md'} className="!text-current" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
