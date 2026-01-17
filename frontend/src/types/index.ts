/**
 * API 공통 응답 타입
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 키워드 분석 결과
 */
export interface KeywordAnalysis {
  keyword: string;
  count: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  percentage?: number;
}

/**
 * 댓글 데이터
 */
export interface Comment {
  id: string;
  author: string;
  text: string;
  likes: number;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

/**
 * 댓글 분석 요청
 */
export interface CommentAnalysisRequest {
  videoUrl: string;
  maxResults?: number;
}

/**
 * 댓글 분석 API 요청 (백엔드 스네이크 케이스)
 */
export interface CommentAnalyzeRequest {
  video_url: string;
  max_results?: number;
}

/**
 * 댓글 분석 응답
 */
export interface CommentAnalysisResponse {
  videoId: string;
  videoTitle: string;
  totalComments: number;
  comments: Comment[];
  keywords: KeywordAnalysis[];
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  analyzedAt: string;
}

/**
 * 댓글 분석 API 응답 (백엔드 스네이크 케이스)
 */
export interface CommentAnalyzeResponse {
  video_info: {
    video_id: string;
    title: string;
    channel_title: string;
    view_count: number;
    comment_count: number;
  };
  frequent_words: Array<{
    word: string;
    count: number;
    percentage: number;
  }>;
  viewer_requests: Array<{
    text: string;
    like_count: number;
    author: string;
  }>;
  viewer_questions: Array<{
    text: string;
    like_count: number;
    author: string;
  }>;
  top_comments: Array<{
    text: string;
    like_count: number;
    author: string;
  }>;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    total_analyzed: number;
  } | null;
  analyzed_at: string;
}

/**
 * 페이지네이션 정보
 */
export interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * 키워드 분석 요청
 */
export interface KeywordAnalyzeRequest {
  keyword: string;
}

/**
 * 키워드 메트릭
 */
export interface KeywordMetrics {
  search_volume: number;
  competition: number;
  recommendation_score: number;
}

/**
 * 관련 키워드
 */
export interface RelatedKeyword {
  keyword: string;
  search_volume: number;
  competition: number;
}

/**
 * 키워드 분석 응답
 */
export interface KeywordAnalyzeResponse {
  keyword: string;
  metrics: KeywordMetrics;
  related_keywords: RelatedKeyword[];
  analyzed_at: string;
}
