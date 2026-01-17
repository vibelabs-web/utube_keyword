import { Spinner } from '@/components/ui/Loading';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

/**
 * Loading overlay with optional progress indicator
 *
 * Displays a centered loading spinner with message and optional progress bar.
 * Used for showing analysis progress or long-running operations.
 *
 * @example
 * ```tsx
 * <LoadingOverlay isLoading={true} message="분석 중..." progress={50} />
 * ```
 */
export default function LoadingOverlay({
  isLoading,
  message = '분석 중...',
  progress
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      role="status"
      aria-busy="true"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg">
        <div aria-hidden="true">
          <Spinner size="lg" />
        </div>
        <p className="text-lg font-medium text-gray-700">{message}</p>

        {progress !== undefined && (
          <div className="w-48">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>진행률</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
