import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
}

/**
 * Error message component with optional retry button
 *
 * Features:
 * - Error icon (optional)
 * - Title and message
 * - Retry button (optional)
 * - Accessible ARIA attributes
 * - Clean, non-intrusive design
 */
export const ErrorMessage = ({
  title = 'Error',
  message,
  onRetry,
  showIcon = true,
  className,
  ...props
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-4',
        className
      )}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="flex-shrink-0" aria-hidden="true">
            <svg
              className="h-5 w-5 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>

          {onRetry && (
            <div className="mt-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={onRetry}
                className="!border-red-300 !text-red-700 hover:!bg-red-100"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Inline error message (compact version)
 */
export const InlineError = ({ message, className }: { message: string; className?: string }) => {
  return (
    <div
      className={cn('flex items-center gap-2 text-sm text-red-600', className)}
      role="alert"
    >
      <svg
        className="h-4 w-4 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};
