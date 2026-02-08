import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('should render applied status', () => {
    render(<Badge status="applied" />);
    expect(screen.getByText('Aplikowano')).toBeInTheDocument();
  });

  it('should render offer status', () => {
    render(<Badge status="offer" />);
    expect(screen.getByText('Oferta')).toBeInTheDocument();
  });

  it('should render rejected status', () => {
    render(<Badge status="rejected" />);
    expect(screen.getByText('Odrzucone')).toBeInTheDocument();
  });

  it('should render hr_interview status', () => {
    render(<Badge status="hr_interview" />);
    expect(screen.getByText('Rozmowa HR')).toBeInTheDocument();
  });

  it('should render tech_interview status', () => {
    render(<Badge status="tech_interview" />);
    expect(screen.getByText('Rozmowa Techniczna')).toBeInTheDocument();
  });

  it('should have correct styles', () => {
    const { container } = render(<Badge status="applied" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('inline-block');
  });
});

