import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SentimentChart from '@/components/comment/SentimentChart';

const mockSentiment = {
  positive: 0.6,
  neutral: 0.3,
  negative: 0.1,
  total_analyzed: 100,
};

describe('SentimentChart', () => {
  it('renders sentiment percentages', () => {
    render(<SentimentChart sentiment={mockSentiment} />);
    expect(screen.getByText('60%')).toBeInTheDocument(); // 긍정
    expect(screen.getByText('30%')).toBeInTheDocument(); // 중립
    expect(screen.getByText('10%')).toBeInTheDocument(); // 부정
  });

  it('displays total analyzed count', () => {
    render(<SentimentChart sentiment={mockSentiment} />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('shows progress bars with correct widths', () => {
    render(<SentimentChart sentiment={mockSentiment} />);
    const positiveBar = screen.getByTestId('positive-bar');
    const neutralBar = screen.getByTestId('neutral-bar');
    const negativeBar = screen.getByTestId('negative-bar');

    expect(positiveBar).toHaveStyle({ width: '60%' });
    expect(neutralBar).toHaveStyle({ width: '30%' });
    expect(negativeBar).toHaveStyle({ width: '10%' });
  });

  it('shows labels for each sentiment', () => {
    render(<SentimentChart sentiment={mockSentiment} />);
    expect(screen.getByText('긍정')).toBeInTheDocument();
    expect(screen.getByText('중립')).toBeInTheDocument();
    expect(screen.getByText('부정')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const zeroSentiment = {
      positive: 0,
      neutral: 0,
      negative: 1,
      total_analyzed: 50,
    };

    render(<SentimentChart sentiment={zeroSentiment} />);
    const zeroPercentages = screen.getAllByText('0%');
    expect(zeroPercentages.length).toBe(2); // positive and neutral
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('rounds percentages correctly', () => {
    const decimalSentiment = {
      positive: 0.336, // rounds to 34%
      neutral: 0.333, // rounds to 33%
      negative: 0.331, // rounds to 33%
      total_analyzed: 100,
    };

    render(<SentimentChart sentiment={decimalSentiment} />);
    const thirtyThree = screen.getAllByText('33%');
    expect(thirtyThree.length).toBe(2); // neutral and negative
    expect(screen.getByText('34%')).toBeInTheDocument();
  });
});
