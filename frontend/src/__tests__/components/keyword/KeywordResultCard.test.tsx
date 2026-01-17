import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KeywordResultCard from '@/components/keyword/KeywordResultCard';

const mockMetrics = {
  search_volume: 15000,
  competition: 0.65,
  recommendation_score: 0.78,
};

describe('KeywordResultCard', () => {
  it('renders three metric cards', () => {
    render(<KeywordResultCard metrics={mockMetrics} />);
    expect(screen.getByText(/검색량/i)).toBeInTheDocument();
    expect(screen.getByText(/경쟁도/i)).toBeInTheDocument();
    expect(screen.getByText(/추천도/i)).toBeInTheDocument();
  });

  it('displays formatted search volume', () => {
    render(<KeywordResultCard metrics={mockMetrics} />);
    // 15,000 형식으로 표시
    expect(screen.getByText('15,000')).toBeInTheDocument();
  });

  it('displays competition as percentage', () => {
    render(<KeywordResultCard metrics={mockMetrics} />);
    // 65% 표시
    expect(screen.getByText(/65%/)).toBeInTheDocument();
  });

  it('displays recommendation score as percentage', () => {
    render(<KeywordResultCard metrics={mockMetrics} />);
    // 78% 표시
    expect(screen.getByText(/78%/)).toBeInTheDocument();
  });

  it('shows appropriate color for high recommendation', () => {
    render(
      <KeywordResultCard
        metrics={{ ...mockMetrics, recommendation_score: 0.8 }}
      />
    );
    // 높은 추천도는 녹색 계열
    const card = screen.getByTestId('recommendation-card');
    expect(card).toHaveClass('bg-green-50');
  });

  it('shows appropriate color for medium recommendation', () => {
    render(
      <KeywordResultCard
        metrics={{ ...mockMetrics, recommendation_score: 0.5 }}
      />
    );
    const card = screen.getByTestId('recommendation-card');
    expect(card).toHaveClass('bg-yellow-50');
  });

  it('shows appropriate color for low recommendation', () => {
    render(
      <KeywordResultCard
        metrics={{ ...mockMetrics, recommendation_score: 0.3 }}
      />
    );
    const card = screen.getByTestId('recommendation-card');
    expect(card).toHaveClass('bg-red-50');
  });

  it('shows appropriate color for low competition', () => {
    render(<KeywordResultCard metrics={{ ...mockMetrics, competition: 0.3 }} />);
    // 낮은 경쟁도는 녹색 계열 (좋음)
    const card = screen.getByTestId('competition-card');
    expect(card).toHaveClass('bg-green-50');
  });

  it('shows appropriate color for medium competition', () => {
    render(<KeywordResultCard metrics={{ ...mockMetrics, competition: 0.5 }} />);
    const card = screen.getByTestId('competition-card');
    expect(card).toHaveClass('bg-yellow-50');
  });

  it('shows appropriate color for high competition', () => {
    render(<KeywordResultCard metrics={{ ...mockMetrics, competition: 0.8 }} />);
    const card = screen.getByTestId('competition-card');
    expect(card).toHaveClass('bg-red-50');
  });

  it('displays helpful subtitle for low competition', () => {
    render(<KeywordResultCard metrics={{ ...mockMetrics, competition: 0.3 }} />);
    expect(screen.getByText(/경쟁이 낮아요/i)).toBeInTheDocument();
  });

  it('displays helpful subtitle for high recommendation', () => {
    render(
      <KeywordResultCard
        metrics={{ ...mockMetrics, recommendation_score: 0.8 }}
      />
    );
    expect(screen.getByText(/추천 키워드/i)).toBeInTheDocument();
  });
});
