import { useMutation } from '@tanstack/react-query';
import { analyzeComments } from '@/services/commentApi';
import type { CommentAnalyzeRequest, CommentAnalyzeResponse } from '@/types';

/**
 * Custom hook for comment analysis
 *
 * Provides mutation for analyzing YouTube video comments
 * with loading, error, and success states
 *
 * @returns TanStack Query mutation object
 */
export function useCommentAnalysis() {
  return useMutation<CommentAnalyzeResponse, Error, CommentAnalyzeRequest>({
    mutationFn: analyzeComments,
    onSuccess: (data) => {
      console.log('Comment analysis completed:', data.video_info.title);
    },
    onError: (error) => {
      console.error('Comment analysis failed:', error.message);
    },
  });
}
