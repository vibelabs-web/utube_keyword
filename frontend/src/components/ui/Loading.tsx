import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Spinner component for loading states
 * Accessible loading indicator with ARIA attributes
 */
export const Spinner = ({ className, size = 'md' }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-primary border-r-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingOverlayProps {
  message?: string;
}

/**
 * Full-screen loading overlay
 * Used for page-level loading states
 */
export const LoadingOverlay = ({ message = 'Loading...' }: LoadingOverlayProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-message"
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-surface p-8 shadow-lg">
        <Spinner size="lg" />
        <p id="loading-message" className="text-sm font-medium text-slate-700">
          {message}
        </p>
      </div>
    </div>
  );
};

/**
 * Simple loading component for inline use
 */
export const Loading = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  return (
    <div className="flex items-center justify-center p-4" role="status" aria-live="polite">
      <Spinner size={size} />
    </div>
  );
};
