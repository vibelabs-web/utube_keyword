import { useMutation } from '@tanstack/react-query';
import { analyzeKeyword } from '@/services/keywordApi';

/**
 * 키워드 분석 훅
 *
 * @example
 * const { mutate, data, isPending, error } = useKeywordAnalysis();
 * mutate({ keyword: '파이썬 강의' });
 */
export function useKeywordAnalysis() {
  return useMutation({
    mutationFn: analyzeKeyword,
  });
}
