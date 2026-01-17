import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RequestList from '@/components/comment/RequestList';

const mockRequests = [
  {
    text: '다음 영상 해주세요!',
    like_count: 100,
    author: 'user1',
    published_at: '2024-01-15T12:00:00Z'
  },
  {
    text: '파이썬 강의 부탁드려요',
    like_count: 50,
    author: 'user2',
    published_at: '2024-01-16T12:00:00Z'
  },
];

describe('RequestList', () => {
  it('renders all viewer requests', () => {
    render(<RequestList requests={mockRequests} />);
    expect(screen.getByText(/다음 영상 해주세요/)).toBeInTheDocument();
    expect(screen.getByText(/파이썬 강의 부탁드려요/)).toBeInTheDocument();
  });

  it('displays like count', () => {
    render(<RequestList requests={mockRequests} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('displays author name', () => {
    render(<RequestList requests={mockRequests} />);
    expect(screen.getByText(/user1/)).toBeInTheDocument();
    expect(screen.getByText(/user2/)).toBeInTheDocument();
  });

  it('displays published date', () => {
    render(<RequestList requests={mockRequests} />);
    const dates = screen.getAllByText(/2024/);
    expect(dates.length).toBeGreaterThan(0);
  });

  it('shows empty state when no requests', () => {
    render(<RequestList requests={[]} />);
    expect(screen.getByText(/요청사항이 없습니다/i)).toBeInTheDocument();
  });

  it('limits display to top 5 requests', () => {
    const manyRequests = Array.from({ length: 10 }, (_, i) => ({
      text: `요청 ${i + 1}`,
      like_count: 100 - i,
      author: `user${i + 1}`,
      published_at: '2024-01-15T12:00:00Z'
    }));

    render(<RequestList requests={manyRequests} />);

    // First 5 should be visible
    expect(screen.getByText('요청 1')).toBeInTheDocument();
    expect(screen.getByText('요청 5')).toBeInTheDocument();

    // 6th should not be visible
    expect(screen.queryByText('요청 6')).not.toBeInTheDocument();
  });
});
