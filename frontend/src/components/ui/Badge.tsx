import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

/**
 * Badge component for status indicators and labels
 *
 * Features:
 * - Four semantic variants: default, success, warning, error
 * - Two sizes: sm, md
 * - Pill shape with appropriate padding
 * - Accessible color contrast
 */
export const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: BadgeProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
