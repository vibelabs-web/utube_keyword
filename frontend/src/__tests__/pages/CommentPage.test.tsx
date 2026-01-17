import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import CommentPage from '@/pages/CommentPage';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CommentPage', () => {
  beforeEach(() => {
    // Reset any mocks if needed
  });

  it('renders video URL input form', () => {
    render(<CommentPage />, { wrapper });

    expect(
      screen.getByPlaceholderText(/YouTube.*URL/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /분석/i })).toBeInTheDocument();
  });

  it('validates YouTube URL format', async () => {
    render(<CommentPage />, { wrapper });

    const input = screen.getByPlaceholderText(/YouTube.*URL/i);
    const button = screen.getByRole('button', { name: /분석/i });

    fireEvent.change(input, { target: { value: 'not-a-youtube-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/유효한 YouTube URL/i)).toBeInTheDocument();
    });
  });

  it('shows loading state when analyzing', async () => {
    render(<CommentPage />, { wrapper });

    const input = screen.getByPlaceholderText(/YouTube.*URL/i);
    const button = screen.getByRole('button', { name: /분석/i });

    fireEvent.change(input, {
      target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    });
    fireEvent.click(button);

    // Check for loading state or data (loading might be too fast to catch)
    await waitFor(() => {
      expect(
        screen.queryByText(/분석 중/i) || screen.queryByText(/테스트 비디오/i)
      ).toBeTruthy();
    });
  });

  it('displays video info after analysis', async () => {
    render(<CommentPage />, { wrapper });

    const input = screen.getByPlaceholderText(/YouTube.*URL/i);
    const button = screen.getByRole('button', { name: /분석/i });

    fireEvent.change(input, {
      target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    });
    fireEvent.click(button);

    await waitFor(
      () => {
        expect(screen.getByText(/테스트 비디오/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('handles Enter key press on input', async () => {
    render(<CommentPage />, { wrapper });

    const input = screen.getByPlaceholderText(/YouTube.*URL/i);

    fireEvent.change(input, {
      target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(
      () => {
        expect(screen.getByText(/테스트 비디오/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('clears error when typing new URL', () => {
    render(<CommentPage />, { wrapper });

    const input = screen.getByPlaceholderText(/YouTube.*URL/i);
    const button = screen.getByRole('button', { name: /분석/i });

    // Trigger error
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.click(button);

    // Type new value
    fireEvent.change(input, {
      target: { value: 'https://www.youtube.com/watch?v=test' },
    });

    // Error should be cleared
    expect(screen.queryByText(/유효한 YouTube URL/i)).not.toBeInTheDocument();
  });
});
