import { http, HttpResponse } from 'msw';

export const commentHandlers = [
  http.post('/api/v1/comments/analyze', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        video_info: {
          video_id: (body as { video_url: string }).video_url?.split('v=')[1] || 'test123',
          title: '테스트 비디오',
          channel_title: '테스트 채널',
          view_count: 10000,
          comment_count: 500,
          published_at: new Date(Date.now() - 2592000000).toISOString(),
        },
        frequent_words: [
          { word: '좋아요', count: 50, percentage: 10 },
          { word: '감사', count: 30, percentage: 6 },
          { word: '유익', count: 25, percentage: 5 },
          { word: '최고', count: 20, percentage: 4 },
        ],
        viewer_requests: [
          {
            text: '다음 영상도 이런 주제로 부탁드려요',
            like_count: 100,
            author: 'user1',
            published_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            text: '시리즈로 만들어주세요',
            like_count: 85,
            author: 'user2',
            published_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ],
        sentiment: {
          positive: 0.7,
          neutral: 0.2,
          negative: 0.1,
          total_analyzed: 500,
        },
        analyzed_at: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/v1/comments/history', () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: [
          {
            id: '1',
            video_id: 'abc123',
            video_title: '첫 번째 분석 비디오',
            comment_count: 500,
            analyzed_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            video_id: 'def456',
            video_title: '두 번째 분석 비디오',
            comment_count: 300,
            analyzed_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ],
        total: 2,
      },
    });
  }),
];
