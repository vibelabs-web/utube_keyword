import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorModal from '@/components/ui/ErrorModal';

describe('ErrorModal', () => {
  const mockOnClose = vi.fn();
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error title and message', () => {
    render(
      <ErrorModal
        isOpen={true}
        title="오류 발생"
        message="서버에 연결할 수 없습니다"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('오류 발생')).toBeInTheDocument();
    expect(screen.getByText('서버에 연결할 수 없습니다')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <ErrorModal
        isOpen={false}
        title="오류"
        message="메시지"
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByText('오류')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <ErrorModal
        isOpen={true}
        title="오류"
        message="메시지"
        onClose={mockOnClose}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /닫기/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders retry button when onRetry is provided', () => {
    render(
      <ErrorModal
        isOpen={true}
        title="오류"
        message="메시지"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );
    expect(screen.getByRole('button', { name: /재시도/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    render(
      <ErrorModal
        isOpen={true}
        title="오류"
        message="메시지"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /재시도/i }));
    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('shows quota exceeded message for quota error', () => {
    render(
      <ErrorModal
        isOpen={true}
        errorType="quota_exceeded"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText(/API 할당량/i)).toBeInTheDocument();
  });

  it('shows network error message for network error', () => {
    render(
      <ErrorModal
        isOpen={true}
        errorType="network"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText(/네트워크/i)).toBeInTheDocument();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(
      <ErrorModal
        isOpen={true}
        title="오류"
        message="메시지"
        onClose={mockOnClose}
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'error-title');
  });

  it('displays suggestion when provided via errorType', () => {
    render(
      <ErrorModal
        isOpen={true}
        errorType="network"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText(/인터넷 연결을 확인/i)).toBeInTheDocument();
  });

  it('prioritizes custom title over errorType title', () => {
    render(
      <ErrorModal
        isOpen={true}
        title="커스텀 제목"
        errorType="network"
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('커스텀 제목')).toBeInTheDocument();
    expect(screen.queryByText('네트워크 오류')).not.toBeInTheDocument();
  });
});
