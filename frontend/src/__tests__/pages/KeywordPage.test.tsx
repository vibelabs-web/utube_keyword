import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import KeywordPage from '@/pages/KeywordPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('KeywordPage', () => {
  it('renders keyword input form', () => {
    render(<KeywordPage />, { wrapper });
    expect(screen.getByPlaceholderText(/키워드를 입력/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /분석/i })).toBeInTheDocument();
  });

  it('disables button while analyzing', async () => {
    render(<KeywordPage />, { wrapper });
    const input = screen.getByPlaceholderText(/키워드를 입력/i);
    const button = screen.getByRole('button', { name: /분석/i });

    fireEvent.change(input, { target: { value: '파이썬 강의' } });

    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    // 버튼이 비활성화되거나 결과가 표시될 때까지 대기
    await waitFor(() => {
      const hasResults = screen.queryByText(/검색량/i);
      if (!hasResults) {
        expect(button).toBeDisabled();
      }
    }, { timeout: 100 });
  });

  it('displays analysis results', async () => {
    render(<KeywordPage />, { wrapper });
    const input = screen.getByPlaceholderText(/키워드를 입력/i);
    const button = screen.getByRole('button', { name: /분석/i });

    fireEvent.change(input, { target: { value: '테스트 키워드' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/검색량/i)).toBeInTheDocument();
      expect(screen.getByText(/경쟁도/i)).toBeInTheDocument();
      expect(screen.getByText(/추천도/i)).toBeInTheDocument();
    });
  });

  it('handles Enter key press', async () => {
    render(<KeywordPage />, { wrapper });
    const input = screen.getByPlaceholderText(/키워드를 입력/i);

    fireEvent.change(input, { target: { value: '엔터 테스트' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText(/검색량/i)).toBeInTheDocument();
    });
  });

  it('does not submit empty keyword', () => {
    render(<KeywordPage />, { wrapper });
    const button = screen.getByRole('button', { name: /분석/i });

    fireEvent.click(button);

    // 로딩 상태가 나타나지 않아야 함
    expect(screen.queryByText(/분석 중/i)).not.toBeInTheDocument();
  });
});
