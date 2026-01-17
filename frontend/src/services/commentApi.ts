import api from './api';
import type { CommentAnalyzeRequest, CommentAnalyzeResponse } from '@/types';

/**
 * Comment Analysis API Service
 *
 * Handles all comment analysis related API calls
 */

/**
 * Analyzes comments from a YouTube video
 *
 * @param request - The comment analysis request containing video URL
 * @returns The analysis response with video info, keywords, and sentiment
 */
export async function analyzeComments(
  request: CommentAnalyzeRequest
): Promise<CommentAnalyzeResponse> {
  const response = await api.post<{ success: boolean; data: CommentAnalyzeResponse }>(
    '/v1/comments/analyze',
    request
  );

  if (!response.data.success || !response.data.data) {
    throw new Error('Failed to analyze comments');
  }

  return response.data.data;
}

/**
 * Fetches comment analysis history
 *
 * @returns List of previous analyses
 */
export async function getCommentHistory(): Promise<unknown> {
  const response = await api.get('/v1/comments/history');
  return response.data.data;
}
