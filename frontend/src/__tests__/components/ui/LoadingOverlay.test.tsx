import { render, screen } from '@testing-library/react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders when isLoading is true', () => {
    render(<LoadingOverlay isLoading={true} />);
    expect(screen.getByText(/분석 중/i)).toBeInTheDocument();
  });

  it('does not render when isLoading is false', () => {
    render(<LoadingOverlay isLoading={false} />);
    expect(screen.queryByText(/분석 중/i)).not.toBeInTheDocument();
  });

  it('displays custom message', () => {
    render(<LoadingOverlay isLoading={true} message="데이터 수집 중..." />);
    expect(screen.getByText('데이터 수집 중...')).toBeInTheDocument();
  });

  it('shows progress when provided', () => {
    render(<LoadingOverlay isLoading={true} progress={50} />);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('displays progress bar with correct width', () => {
    const { container } = render(<LoadingOverlay isLoading={true} progress={75} />);
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('has accessible attributes', () => {
    render(<LoadingOverlay isLoading={true} />);
    const overlay = screen.getByRole('status');
    expect(overlay).toHaveAttribute('aria-busy', 'true');
  });

  it('has aria-label with message', () => {
    render(<LoadingOverlay isLoading={true} message="로딩 중..." />);
    const overlay = screen.getByRole('status');
    expect(overlay).toHaveAttribute('aria-label', '로딩 중...');
  });

  it('does not show progress when not provided', () => {
    render(<LoadingOverlay isLoading={true} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('shows 0% progress correctly', () => {
    render(<LoadingOverlay isLoading={true} progress={0} />);
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it('shows 100% progress correctly', () => {
    render(<LoadingOverlay isLoading={true} progress={100} />);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });
});
