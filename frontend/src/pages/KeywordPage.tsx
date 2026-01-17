import { useState } from 'react';
import { Button, Input, ErrorMessage, KeywordResultSkeleton } from '@/components/ui';
import { useKeywordAnalysis } from '@/hooks/useKeywordAnalysis';
import { useYoutuberRanking } from '@/hooks/useYoutuberRanking';
import KeywordResultCard from '@/components/keyword/KeywordResultCard';
import RelatedKeywordList from '@/components/keyword/RelatedKeywordList';
import YouTuberRankingList from '@/components/keyword/YouTuberRankingList';

/**
 * 키워드 분석 페이지
 *
 * 키워드를 입력받아 분석하고 결과를 표시합니다.
 */
export default function KeywordPage() {
  const [keyword, setKeyword] = useState('');
  const [searchedKeyword, setSearchedKeyword] = useState('');
  const { mutate, data, isPending, error } = useKeywordAnalysis();

  // 유튜버 순위 조회 (검색된 키워드가 있을 때만)
  const { data: rankings, isLoading: isRankingLoading } = useYoutuberRanking({
    keyword: searchedKeyword,
    topN: 10,
    enabled: !!searchedKeyword,
  });

  const handleAnalyze = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      setSearchedKeyword(trimmedKeyword);
      mutate({ keyword: trimmedKeyword });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const handleRelatedKeywordClick = (relatedKeyword: string) => {
    setKeyword(relatedKeyword);
    setSearchedKeyword(relatedKeyword);
    mutate({ keyword: relatedKeyword });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">키워드 분석</h1>
        <p className="mt-2 text-slate-600">
          키워드를 입력하여 검색량, 경쟁도, 추천도를 분석하세요
        </p>
      </div>

      {/* 입력 폼 */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="분석할 키워드를 입력하세요 (예: 파이썬 강의)"
            aria-label="키워드 입력"
            className="w-full"
          />
        </div>
        <Button
          variant="primary"
          onClick={handleAnalyze}
          isLoading={isPending}
          disabled={isPending || !keyword.trim()}
          aria-label="분석하기"
        >
          {isPending ? '분석 중...' : '분석하기'}
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isPending && <KeywordResultSkeleton />}

      {/* 에러 상태 */}
      {error && (
        <ErrorMessage
          title="분석 실패"
          message={error.message || '키워드 분석 중 오류가 발생했습니다.'}
        />
      )}

      {/* 분석 결과 */}
      {data && !isPending && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              "{data.keyword}" 분석 결과
            </h2>
            <KeywordResultCard metrics={data.metrics} />
          </div>

          <RelatedKeywordList
            keywords={data.related_keywords}
            onKeywordClick={handleRelatedKeywordClick}
          />

          {/* 유튜버 순위 */}
          <YouTuberRankingList
            rankings={rankings || []}
            isLoading={isRankingLoading}
          />

          {/* 분석 시간 */}
          <p className="text-center text-sm text-slate-500">
            분석 시간: {new Date(data.analyzed_at).toLocaleString('ko-KR')}
          </p>
        </div>
      )}

      {/* 초기 상태 안내 */}
      {!data && !isPending && !error && (
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center">
          <p className="text-slate-600">
            위 입력란에 키워드를 입력하고 분석하기 버튼을 클릭하세요
          </p>
        </div>
      )}
    </div>
  );
}
