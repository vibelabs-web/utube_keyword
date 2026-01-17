import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Header from '@/components/Header';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Header', () => {
  it('renders logo/title', () => {
    render(<Header />, { wrapper });
    expect(screen.getByText(/ViewPulse/i)).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    render(<Header />, { wrapper });
    expect(screen.getByRole('link', { name: /키워드 분석/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /댓글 분석/i })).toBeInTheDocument();
  });

  it('highlights active tab based on current route', () => {
    render(
      <MemoryRouter initialEntries={['/keywords']}>
        <Header />
      </MemoryRouter>
    );

    const keywordLink = screen.getByRole('link', { name: /키워드 분석/i });
    const commentLink = screen.getByRole('link', { name: /댓글 분석/i });

    // Active tab should have primary text color
    expect(keywordLink).toHaveClass('text-primary');
    expect(commentLink).not.toHaveClass('text-primary');
  });

  it('has accessible navigation landmarks', () => {
    render(<Header />, { wrapper });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has proper ARIA labels', () => {
    render(<Header />, { wrapper });
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label');
  });

  it('renders logo link to home', () => {
    render(<Header />, { wrapper });
    const logoLink = screen.getByRole('link', { name: /홈으로 이동/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('applies responsive container classes', () => {
    const { container } = render(<Header />, { wrapper });
    const headerContainer = container.querySelector('.container');
    expect(headerContainer).toBeInTheDocument();
  });
});
