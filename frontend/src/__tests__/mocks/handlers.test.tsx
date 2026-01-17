import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('MSW Handlers', () => {
  describe('Keyword API', () => {
    it('should return keyword analysis result', async () => {
      const response = await axios.post('/api/v1/keywords/analyze', {
        keyword: '유튜브 SEO',
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('keyword', '유튜브 SEO');
      expect(response.data.data.metrics).toHaveProperty('search_volume');
      expect(response.data.data.metrics).toHaveProperty('competition');
      expect(response.data.data.related_keywords).toBeInstanceOf(Array);
    });

    it('should return keyword history', async () => {
      const response = await axios.get('/api/v1/keywords/history');

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.items).toBeInstanceOf(Array);
      expect(response.data.data.items.length).toBeGreaterThan(0);
      expect(response.data.data.items[0]).toHaveProperty('keyword');
      expect(response.data.data.items[0]).toHaveProperty('search_volume');
    });
  });

  describe('Comment API', () => {
    it('should return comment analysis result', async () => {
      const response = await axios.post('/api/v1/comments/analyze', {
        video_url: 'https://youtube.com/watch?v=abc123',
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('video_info');
      expect(response.data.data.video_info).toHaveProperty('video_id');
      expect(response.data.data).toHaveProperty('frequent_words');
      expect(response.data.data.frequent_words).toBeInstanceOf(Array);
      expect(response.data.data).toHaveProperty('viewer_requests');
      expect(response.data.data).toHaveProperty('sentiment');
    });

    it('should return comment analysis history', async () => {
      const response = await axios.get('/api/v1/comments/history');

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.items).toBeInstanceOf(Array);
      expect(response.data.data.items.length).toBeGreaterThan(0);
      expect(response.data.data.items[0]).toHaveProperty('video_id');
      expect(response.data.data.items[0]).toHaveProperty('video_title');
    });
  });

  describe('Data Structure Validation', () => {
    it('should have correct sentiment structure', async () => {
      const response = await axios.post('/api/v1/comments/analyze', {
        video_url: 'https://youtube.com/watch?v=test',
      });

      const { sentiment } = response.data.data;
      expect(sentiment).toHaveProperty('positive');
      expect(sentiment).toHaveProperty('neutral');
      expect(sentiment).toHaveProperty('negative');
      expect(sentiment).toHaveProperty('total_analyzed');
      expect(sentiment.positive + sentiment.neutral + sentiment.negative).toBeCloseTo(1, 1);
    });

    it('should have correct video info structure', async () => {
      const response = await axios.post('/api/v1/comments/analyze', {
        video_url: 'https://youtube.com/watch?v=xyz789',
      });

      const { video_info } = response.data.data;
      expect(video_info).toHaveProperty('video_id');
      expect(video_info).toHaveProperty('title');
      expect(video_info).toHaveProperty('channel_title');
      expect(video_info).toHaveProperty('view_count');
      expect(video_info).toHaveProperty('comment_count');
      expect(typeof video_info.view_count).toBe('number');
      expect(typeof video_info.comment_count).toBe('number');
    });
  });
});
