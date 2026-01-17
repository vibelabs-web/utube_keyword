import { Button } from '@/components/ui';
import { type ErrorType, getErrorInfo } from '@/utils/errorMessages';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  errorType?: ErrorType;
  onClose: () => void;
  onRetry?: () => void;
}

/**
 * ErrorModal Component
 *
 * A modal dialog for displaying errors with contextual messages
 * based on error types. Follows Apple HIG accessibility guidelines.
 *
 * Features:
 * - Type-safe error messages
 * - Optional retry action
 * - Backdrop overlay
 * - Full keyboard support (Escape to close)
 * - ARIA dialog attributes
 * - Custom or predefined error messages
 *
 * @example
 * ```tsx
 * <ErrorModal
 *   isOpen={true}
 *   errorType="network"
 *   onClose={handleClose}
 *   onRetry={handleRetry}
 * />
 * ```
 */
export default function ErrorModal({
  isOpen,
  title,
  message,
  errorType,
  onClose,
  onRetry,
}: ErrorModalProps) {
  if (!isOpen) return null;

  // Get error info from errorType or use custom title/message
  const errorInfo = errorType ? getErrorInfo(errorType) : null;
  const displayTitle = title || errorInfo?.title || '오류 발생';
  const displayMessage = message || errorInfo?.message || '알 수 없는 오류가 발생했습니다.';
  const suggestion = errorInfo?.suggestion;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-title"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        // Close on Escape key
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 id="error-title" className="text-xl font-bold text-center mb-2 text-slate-900">
          {displayTitle}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-2">{displayMessage}</p>

        {/* Suggestion */}
        {suggestion && (
          <p className="text-sm text-gray-500 text-center mb-6">{suggestion}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              재시도
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
