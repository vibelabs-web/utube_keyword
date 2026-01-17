import { Card } from '@/components/ui';
import type { YouTuberRanking } from '@/hooks/useYoutuberRanking';

interface YouTuberRankingListProps {
  rankings: YouTuberRanking[];
  isLoading?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function getRankBadgeColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-yellow-400 text-yellow-900';
    case 2:
      return 'bg-gray-300 text-gray-800';
    case 3:
      return 'bg-amber-600 text-white';
    default:
      return 'bg-slate-200 text-slate-700';
  }
}

function YouTuberRankingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="w-12 h-12 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="text-right space-y-2">
            <div className="h-4 bg-slate-200 rounded w-16" />
            <div className="h-3 bg-slate-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function YouTuberRankingList({
  rankings,
  isLoading,
}: YouTuberRankingListProps) {
  if (isLoading) {
    return (
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          인기 유튜버 순위
        </h3>
        <YouTuberRankingSkeleton />
      </Card>
    );
  }

  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        인기 유튜버 순위
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        이 키워드로 가장 높은 평균 조회수를 기록한 유튜버
      </p>

      <div className="space-y-3">
        {rankings.map((youtuber) => (
          <a
            key={youtuber.channel_id}
            href={`https://youtube.com/channel/${youtuber.channel_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-red-300 hover:shadow-md"
          >
            {/* 순위 뱃지 */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${getRankBadgeColor(youtuber.rank)}`}
            >
              {youtuber.rank}
            </div>

            {/* 채널 썸네일 */}
            <img
              src={youtuber.thumbnail_url || '/placeholder-channel.png'}
              alt={youtuber.channel_title}
              className="h-12 w-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="40">?</text></svg>';
              }}
            />

            {/* 채널 정보 */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 truncate">
                {youtuber.channel_title}
              </h4>
              <p className="text-sm text-slate-500 truncate">
                구독자 {formatNumber(youtuber.subscriber_count)}명 · 영상 {youtuber.video_count_for_keyword}개
              </p>
            </div>

            {/* 통계 */}
            <div className="text-right">
              <p className="font-semibold text-red-600">
                평균 {formatNumber(youtuber.avg_views_per_video)}회
              </p>
              <p className="text-xs text-slate-500 truncate max-w-[150px]" title={youtuber.top_video_title}>
                Top: {formatNumber(youtuber.top_video_views)}회
              </p>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}
