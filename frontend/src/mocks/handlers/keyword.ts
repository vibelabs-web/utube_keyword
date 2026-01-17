import { http, HttpResponse } from 'msw';

export const keywordHandlers = [
  http.post('/api/v1/keywords/analyze', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: {
        keyword: (body as { keyword: string }).keyword,
        metrics: {
          search_volume: 1500,
          competition: 0.6,
          recommendation_score: 0.75,
        },
        related_keywords: [
          { keyword: '관련 키워드 1', search_volume: 800, competition: 0.4 },
          { keyword: '관련 키워드 2', search_volume: 600, competition: 0.5 },
        ],
        analyzed_at: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/v1/keywords/history', () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: [
          {
            id: '1',
            keyword: '유튜브 SEO',
            search_volume: 2000,
            competition: 0.7,
            analyzed_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '2',
            keyword: '콘텐츠 마케팅',
            search_volume: 1500,
            competition: 0.6,
            analyzed_at: new Date(Date.now() - 172800000).toISOString(),
          },
        ],
        total: 2,
      },
    });
  }),
];
