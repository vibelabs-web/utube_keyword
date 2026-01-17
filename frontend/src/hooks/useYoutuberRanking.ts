import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface YouTuberRanking {
  rank: number;
  channel_id: string;
  channel_title: string;
  thumbnail_url: string;
  subscriber_count: number;
  total_views: number;
  video_count_for_keyword: number;
  avg_views_per_video: number;
  top_video_title: string;
  top_video_views: number;
}

interface UseYoutuberRankingOptions {
  keyword: string;
  maxResults?: number;
  topN?: number;
  enabled?: boolean;
}

export function useYoutuberRanking({
  keyword,
  maxResults = 50,
  topN = 10,
  enabled = true,
}: UseYoutuberRankingOptions) {
  return useQuery({
    queryKey: ['youtuber-ranking', keyword, maxResults, topN],
    queryFn: async (): Promise<YouTuberRanking[]> => {
      const params = new URLSearchParams({
        query: keyword,
        max_results: maxResults.toString(),
        top_n: topN.toString(),
      });
      const response = await api.get(`/v1/youtube/youtubers/ranking?${params}`);
      return response.data;
    },
    enabled: enabled && !!keyword.trim(),
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}
