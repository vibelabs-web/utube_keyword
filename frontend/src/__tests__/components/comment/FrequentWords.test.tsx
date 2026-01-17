import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FrequentWords from '@/components/comment/FrequentWords';

const mockWords = [
  { word: '좋아요', count: 50, percentage: 10 },
  { word: '감사', count: 30, percentage: 6 },
  { word: '추천', count: 20, percentage: 4 },
];

describe('FrequentWords', () => {
  it('renders all frequent words', () => {
    render(<FrequentWords words={mockWords} />);
    expect(screen.getByText('좋아요')).toBeInTheDocument();
    expect(screen.getByText('감사')).toBeInTheDocument();
    expect(screen.getByText('추천')).toBeInTheDocument();
  });

  it('displays count for each word', () => {
    render(<FrequentWords words={mockWords} />);
    expect(screen.getByText('50회')).toBeInTheDocument();
    expect(screen.getByText('30회')).toBeInTheDocument();
  });

  it('shows ranking numbers', () => {
    render(<FrequentWords words={mockWords} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays percentage for each word', () => {
    render(<FrequentWords words={mockWords} />);
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('6%')).toBeInTheDocument();
    expect(screen.getByText('4%')).toBeInTheDocument();
  });

  it('shows empty state when no words', () => {
    render(<FrequentWords words={[]} />);
    expect(screen.getByText(/분석된 단어가 없습니다/i)).toBeInTheDocument();
  });

  it('limits display to top 10 words', () => {
    const manyWords = Array.from({ length: 15 }, (_, i) => ({
      word: `단어${i + 1}`,
      count: 100 - i,
      percentage: 10 - i * 0.5,
    }));

    render(<FrequentWords words={manyWords} />);

    // First 10 should be visible
    expect(screen.getByText('단어1')).toBeInTheDocument();
    expect(screen.getByText('단어10')).toBeInTheDocument();

    // 11th should not be visible
    expect(screen.queryByText('단어11')).not.toBeInTheDocument();
  });
});
