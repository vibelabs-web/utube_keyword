import { Badge } from '@/components/ui';
import type { RelatedKeyword } from '@/types';

interface RelatedKeywordListProps {
  keywords: RelatedKeyword[];
  onKeywordClick: (keyword: string) => void;
}

/**
 * 관련 키워드 리스트 컴포넌트
 *
 * 클릭 가능한 관련 키워드 목록을 칩 형태로 표시합니다.
 */
export default function RelatedKeywordList({
  keywords,
  onKeywordClick,
}: RelatedKeywordListProps) {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">관련 키워드가 없습니다</p>
      </div>
    );
  }

  const getCompetitionVariant = (
    competition: number
  ): 'success' | 'warning' | 'error' => {
    if (competition < 0.4) return 'success';
    if (competition < 0.7) return 'warning';
    return 'error';
  };

  const getCompetitionLabel = (competition: number): string => {
    if (competition < 0.4) return '낮음';
    if (competition < 0.7) return '보통';
    return '높음';
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-4 font-semibold text-slate-900">관련 키워드</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((item, index) => (
          <button
            key={index}
            onClick={() => onKeywordClick(item.keyword)}
            className="group flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2
                       transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2
                       focus:ring-blue-500"
            type="button"
          >
            <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600">
              {item.keyword}
            </span>
            <Badge
              variant={getCompetitionVariant(item.competition)}
              size="sm"
              data-testid="competition-badge"
            >
              {getCompetitionLabel(item.competition)}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
