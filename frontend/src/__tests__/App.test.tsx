import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('ViewPulse')).toBeInTheDocument();
  });

  it('displays keyword analysis page by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '키워드 분석' })).toBeInTheDocument();
  });

  it('shows navigation links', () => {
    render(<App />);
    const navLinks = screen.getAllByText('키워드 분석');
    expect(navLinks.length).toBeGreaterThan(0);
    expect(screen.getByText('댓글 분석')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    render(<App />);
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('shows keyword input on homepage', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/키워드를 입력/i)).toBeInTheDocument();
  });

  it('renders Header component', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
