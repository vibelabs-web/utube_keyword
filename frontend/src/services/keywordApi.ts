import api from './api';
import type { KeywordAnalyzeRequest, KeywordAnalyzeResponse } from '@/types';

/**
 * 키워드 분석 API
 */
export async function analyzeKeyword(
  request: KeywordAnalyzeRequest
): Promise<KeywordAnalyzeResponse> {
  const response = await api.post('/v1/keywords/analyze', request);
  return response.data.data;
}
