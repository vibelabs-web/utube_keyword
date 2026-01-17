import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RelatedKeywordList from '@/components/keyword/RelatedKeywordList';

const mockKeywords = [
  { keyword: '파이썬 기초', search_volume: 1200, competition: 0.4 },
  { keyword: '파이썬 문법', search_volume: 800, competition: 0.6 },
  { keyword: '파이썬 입문', search_volume: 600, competition: 0.3 },
];

describe('RelatedKeywordList', () => {
  it('renders all related keywords', () => {
    render(
      <RelatedKeywordList keywords={mockKeywords} onKeywordClick={() => {}} />
    );
    expect(screen.getByText('파이썬 기초')).toBeInTheDocument();
    expect(screen.getByText('파이썬 문법')).toBeInTheDocument();
    expect(screen.getByText('파이썬 입문')).toBeInTheDocument();
  });

  it('calls onKeywordClick when keyword is clicked', () => {
    const handleClick = vi.fn();
    render(
      <RelatedKeywordList keywords={mockKeywords} onKeywordClick={handleClick} />
    );

    fireEvent.click(screen.getByText('파이썬 기초'));
    expect(handleClick).toHaveBeenCalledWith('파이썬 기초');
  });

  it('displays competition badge with correct color for low competition', () => {
    render(
      <RelatedKeywordList
        keywords={[{ keyword: '테스트', search_volume: 100, competition: 0.2 }]}
        onKeywordClick={() => {}}
      />
    );
    const badges = screen.getAllByTestId('competition-badge');
    expect(badges[0]).toHaveClass('bg-green-100');
  });

  it('displays competition badge with correct color for medium competition', () => {
    render(
      <RelatedKeywordList
        keywords={[{ keyword: '테스트', search_volume: 100, competition: 0.5 }]}
        onKeywordClick={() => {}}
      />
    );
    const badges = screen.getAllByTestId('competition-badge');
    expect(badges[0]).toHaveClass('bg-yellow-100');
  });

  it('displays competition badge with correct color for high competition', () => {
    render(
      <RelatedKeywordList
        keywords={[{ keyword: '테스트', search_volume: 100, competition: 0.8 }]}
        onKeywordClick={() => {}}
      />
    );
    const badges = screen.getAllByTestId('competition-badge');
    expect(badges[0]).toHaveClass('bg-red-100');
  });

  it('shows empty state when no keywords', () => {
    render(<RelatedKeywordList keywords={[]} onKeywordClick={() => {}} />);
    expect(screen.getByText(/관련 키워드가 없습니다/i)).toBeInTheDocument();
  });

  it('displays all three keywords with proper badges', () => {
    render(
      <RelatedKeywordList keywords={mockKeywords} onKeywordClick={() => {}} />
    );
    const badges = screen.getAllByTestId('competition-badge');
    expect(badges.length).toBe(3);
  });

  it('shows competition label as text', () => {
    render(
      <RelatedKeywordList
        keywords={[{ keyword: '테스트', search_volume: 100, competition: 0.2 }]}
        onKeywordClick={() => {}}
      />
    );
    expect(screen.getByText('낮음')).toBeInTheDocument();
  });

  it('renders as buttons for accessibility', () => {
    render(
      <RelatedKeywordList keywords={mockKeywords} onKeywordClick={() => {}} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has focus styles for keyboard navigation', () => {
    render(
      <RelatedKeywordList keywords={mockKeywords} onKeywordClick={() => {}} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('focus:ring-2');
  });
});
