/**
 * YouTube Comment Analysis - Error Message Utilities
 *
 * Provides type-safe error messages for different API error types
 */

export type ErrorType =
  | 'network'
  | 'quota_exceeded'
  | 'invalid_api_key'
  | 'video_not_found'
  | 'comments_disabled'
  | 'server_error'
  | 'unknown';

interface ErrorInfo {
  title: string;
  message: string;
  suggestion?: string;
}

/**
 * Error message catalog
 * Maps error types to user-friendly messages
 */
export const errorMessages: Record<ErrorType, ErrorInfo> = {
  network: {
    title: '네트워크 오류',
    message: '서버에 연결할 수 없습니다.',
    suggestion: '인터넷 연결을 확인하고 다시 시도해주세요.',
  },
  quota_exceeded: {
    title: 'API 할당량 초과',
    message: 'YouTube API 일일 할당량이 초과되었습니다.',
    suggestion: '내일 다시 시도하거나 API 키를 확인해주세요.',
  },
  invalid_api_key: {
    title: 'API 키 오류',
    message: 'YouTube API 키가 유효하지 않습니다.',
    suggestion: '설정에서 API 키를 확인해주세요.',
  },
  video_not_found: {
    title: '영상을 찾을 수 없음',
    message: '요청한 YouTube 영상을 찾을 수 없습니다.',
    suggestion: 'URL이 올바른지 확인해주세요.',
  },
  comments_disabled: {
    title: '댓글 비활성화',
    message: '이 영상은 댓글이 비활성화되어 있습니다.',
    suggestion: '다른 영상을 분석해보세요.',
  },
  server_error: {
    title: '서버 오류',
    message: '서버에서 오류가 발생했습니다.',
    suggestion: '잠시 후 다시 시도해주세요.',
  },
  unknown: {
    title: '알 수 없는 오류',
    message: '예상치 못한 오류가 발생했습니다.',
    suggestion: '문제가 계속되면 관리자에게 문의해주세요.',
  },
};

/**
 * Get error information by error type
 * @param errorType - The type of error
 * @returns Error information with title, message, and suggestion
 */
export function getErrorInfo(errorType: ErrorType): ErrorInfo {
  return errorMessages[errorType] || errorMessages.unknown;
}
