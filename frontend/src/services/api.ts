import axios from 'axios';
import type { ApiResponse, CommentAnalysisRequest, CommentAnalysisResponse } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 추후 인증 토큰 추가 가능
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * 댓글 분석 API
 */
export const commentApi = {
  /**
   * 댓글 분석 요청
   */
  async analyze(data: CommentAnalysisRequest): Promise<ApiResponse<CommentAnalysisResponse>> {
    const response = await api.post<ApiResponse<CommentAnalysisResponse>>('/comments/analyze', data);
    return response.data;
  },

  /**
   * 분석 결과 조회
   */
  async getAnalysis(videoId: string): Promise<ApiResponse<CommentAnalysisResponse>> {
    const response = await api.get<ApiResponse<CommentAnalysisResponse>>(`/comments/analysis/${videoId}`);
    return response.data;
  },
};

export default api;
