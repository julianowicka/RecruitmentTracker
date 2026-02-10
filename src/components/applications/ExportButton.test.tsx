import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButton } from './ExportButton';
import type { Application } from '../../api/applications';

// Mock dla URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

const mockApplications: Application[] = [
  {
    id: 1,
    company: 'Test Company',
    role: 'Developer',
    status: 'applied',
    link: 'https://test.com',
    salaryMin: 10000,
    salaryMax: 15000,
    tags: '["Remote"]',
    rating: 4,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('ExportButton', () => {
  it('should render export button', () => {
    render(<ExportButton applications={mockApplications} />);
    expect(screen.getByText(/Eksportuj/i)).toBeInTheDocument();
  });

  it('should show menu when clicked', async () => {
    render(<ExportButton applications={mockApplications} />);
    
    const button = screen.getByText(/Eksportuj/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Eksportuj do CSV/i)).toBeInTheDocument();
      expect(screen.getByText(/Eksportuj do JSON/i)).toBeInTheDocument();
    });
  });

  it('should close menu when backdrop is clicked', async () => {
    render(<ExportButton applications={mockApplications} />);
    
    const button = screen.getByText(/Eksportuj/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Eksportuj do CSV/i)).toBeInTheDocument();
    });

    // Kliknij backdrop (fixed div)
    const backdrop = document.querySelector('.fixed');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByText(/Eksportuj do CSV/i)).not.toBeInTheDocument();
    });
  });

  it('should show alert when no data to export', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<ExportButton applications={[]} />);
    
    const button = screen.getByText(/Eksportuj/i);
    fireEvent.click(button);
    
    fireEvent.click(screen.getByText(/Eksportuj do CSV/i));
    
    expect(alertSpy).toHaveBeenCalledWith('Brak danych do eksportu!');
    alertSpy.mockRestore();
  });
});


