import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  CardSkeleton,
  MetricCardSkeleton,
  KeywordResultSkeleton,
  CommentResultSkeleton
} from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders with default styles', () => {
    render(<Skeleton />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('bg-gray-200');
  });

  it('accepts custom className', () => {
    render(<Skeleton className="w-32 h-8" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('w-32');
    expect(skeleton).toHaveClass('h-8');
  });

  it('renders as different elements via as prop', () => {
    render(<Skeleton as="span" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.tagName).toBe('SPAN');
  });

  it('renders as div by default', () => {
    render(<Skeleton />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.tagName).toBe('DIV');
  });
});

describe('CardSkeleton', () => {
  it('renders skeleton card structure', () => {
    render(<CardSkeleton />);
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });

  it('renders default 2 content lines', () => {
    render(<CardSkeleton />);
    const lines = screen.getAllByTestId('skeleton-line');
    expect(lines).toHaveLength(2);
  });

  it('renders multiple content lines when specified', () => {
    render(<CardSkeleton lines={3} />);
    const lines = screen.getAllByTestId('skeleton-line');
    expect(lines).toHaveLength(3);
  });

  it('renders with proper styling', () => {
    render(<CardSkeleton />);
    const card = screen.getByTestId('card-skeleton');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('rounded-lg');
  });
});

describe('MetricCardSkeleton', () => {
  it('renders metric card skeleton', () => {
    render(<MetricCardSkeleton />);
    expect(screen.getByTestId('metric-skeleton')).toBeInTheDocument();
  });

  it('has proper card structure', () => {
    render(<MetricCardSkeleton />);
    const skeleton = screen.getByTestId('metric-skeleton');
    expect(skeleton).toHaveClass('bg-white');
    expect(skeleton).toHaveClass('rounded-lg');
  });
});

describe('KeywordResultSkeleton', () => {
  it('renders keyword result skeleton layout', () => {
    render(<KeywordResultSkeleton />);
    expect(screen.getAllByTestId('metric-skeleton')).toHaveLength(3);
  });

  it('renders metric cards and content skeleton', () => {
    render(<KeywordResultSkeleton />);
    expect(screen.getAllByTestId('metric-skeleton')).toHaveLength(3);
    expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
  });
});

describe('CommentResultSkeleton', () => {
  it('renders comment result skeleton layout', () => {
    render(<CommentResultSkeleton />);
    expect(screen.getAllByTestId('card-skeleton').length).toBeGreaterThanOrEqual(1);
  });

  it('renders multiple card skeletons', () => {
    render(<CommentResultSkeleton />);
    const cards = screen.getAllByTestId('card-skeleton');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
