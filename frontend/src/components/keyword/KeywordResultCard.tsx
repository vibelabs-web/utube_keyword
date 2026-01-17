import { Card, CardBody } from '@/components/ui';
import type { KeywordMetrics } from '@/types';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
  testId?: string;
}

function MetricCard({ title, value, subtitle, color, testId }: MetricCardProps) {
  const bgColors = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
  };

  return (
    <Card className={cn(bgColors[color], 'border')} data-testid={testId}>
      <CardBody>
        <h3 className="mb-2 text-sm font-medium text-slate-600">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        )}
      </CardBody>
    </Card>
  );
}

interface KeywordResultCardProps {
  metrics: KeywordMetrics;
}

/**
 * 키워드 분석 결과 메트릭 카드
 *
 * 검색량, 경쟁도, 추천도를 3열 그리드로 표시합니다.
 * 각 메트릭은 값에 따라 색상이 달라집니다.
 */
export default function KeywordResultCard({ metrics }: KeywordResultCardProps) {
  const formatNumber = (num: number) => num.toLocaleString('ko-KR');
  const formatPercentage = (num: number) => `${Math.round(num * 100)}%`;

  const getCompetitionColor = (value: number): 'green' | 'yellow' | 'red' => {
    if (value < 0.4) return 'green';
    if (value < 0.7) return 'yellow';
    return 'red';
  };

  const getRecommendationColor = (value: number): 'green' | 'yellow' | 'red' => {
    if (value >= 0.7) return 'green';
    if (value >= 0.4) return 'yellow';
    return 'red';
  };

  const getCompetitionSubtitle = (value: number): string => {
    if (value < 0.4) return '경쟁이 낮아요! 진입하기 좋습니다';
    if (value < 0.7) return '경쟁이 적당해요';
    return '경쟁이 치열해요';
  };

  const getRecommendationSubtitle = (value: number): string => {
    if (value >= 0.7) return '추천 키워드! 좋은 선택입니다';
    if (value >= 0.4) return '보통 - 검토가 필요합니다';
    return '비추천 - 다른 키워드를 고려하세요';
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        title="검색량"
        value={formatNumber(metrics.search_volume)}
        subtitle="월 평균 검색 수"
        color="blue"
        testId="search-volume-card"
      />
      <MetricCard
        title="경쟁도"
        value={formatPercentage(metrics.competition)}
        subtitle={getCompetitionSubtitle(metrics.competition)}
        color={getCompetitionColor(metrics.competition)}
        testId="competition-card"
      />
      <MetricCard
        title="추천도"
        value={formatPercentage(metrics.recommendation_score)}
        subtitle={getRecommendationSubtitle(metrics.recommendation_score)}
        color={getRecommendationColor(metrics.recommendation_score)}
        testId="recommendation-card"
      />
    </div>
  );
}
