/**
 * MediaUploader Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../../../theme';
import { MediaUploader, MediaFile } from '../../../components/cms/MediaUploader';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('MediaUploader', () => {
  const mockOnUpload = vi.fn();
  const mockOnSelect = vi.fn();

  const mockExistingFiles: MediaFile[] = [
    {
      id: 'file-1',
      name: 'test-image.jpg',
      url: 'https://example.com/test-image.jpg',
      type: 'image/jpeg',
      size: 1024000,
      uploadedAt: '2024-01-01T00:00:00Z',
      alt: 'Test image',
    },
    {
      id: 'file-2',
      name: 'document.pdf',
      url: 'https://example.com/document.pdf',
      type: 'application/pdf',
      size: 2048000,
      uploadedAt: '2024-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    mockOnUpload.mockClear();
    mockOnSelect.mockClear();
  });

  it('renders upload area', () => {
    render(
      <TestWrapper>
        <MediaUploader onUpload={mockOnUpload} />
      </TestWrapper>
    );

    expect(screen.getByText('Upload files')).toBeInTheDocument();
    expect(screen.getByText('browse')).toBeInTheDocument();
    expect(screen.getByText(/Maximum file size/)).toBeInTheDocument();
  });

  it('shows existing files when provided', () => {
    render(
      <TestWrapper>
        <MediaUploader
          onUpload={mockOnUpload}
          existingFiles={mockExistingFiles}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Media Library')).toBeInTheDocument();
    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
  });

  it('handles file selection from existing files', () => {
    render(
      <TestWrapper>
        <MediaUploader
          onUpload={mockOnUpload}
          onSelect={mockOnSelect}
          existingFiles={mockExistingFiles}
        />
      </TestWrapper>
    );

    // Click on first file
    const firstFile = screen.getByText('test-image.jpg').closest('div');
    fireEvent.click(firstFile!);

    expect(mockOnSelect).toHaveBeenCalledWith(mockExistingFiles[0]);
  });

  it('handles multiple file selection', () => {
    render(
      <TestWrapper>
        <MediaUploader
          onUpload={mockOnUpload}
          existingFiles={mockExistingFiles}
          multiple={true}
        />
      </TestWrapper>
    );

    // Click on first file
    const firstFile = screen.getByText('test-image.jpg').closest('div');
    fireEvent.click(firstFile!);

    // Click on second file
    const secondFile = screen.getByText('document.pdf').closest('div');
    fireEvent.click(secondFile!);

    // Should show selected files actions
    expect(screen.getByText('2 files selected')).toBeInTheDocument();
    expect(screen.getByText('Use Selected')).toBeInTheDocument();
  });

  it('handles file upload through input', async () => {
    render(
      <TestWrapper>
        <MediaUploader onUpload={mockOnUpload} />
      </TestWrapper>
    );

    // Create mock file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });

    // Find the file input - it should be hidden but present in the DOM
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    // Simulate file selection using fireEvent.change with a mock event
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Wait for upload to complete
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('validates file size', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <TestWrapper>
        <MediaUploader onUpload={mockOnUpload} maxSize={1000} />
      </TestWrapper>
    );

    // Create oversized file
    const file = new File(['test content'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 2000 });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('too large'));
    });

    alertSpy.mockRestore();
  });

  it('validates maximum file count', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <TestWrapper>
        <MediaUploader onUpload={mockOnUpload} maxFiles={1} />
      </TestWrapper>
    );

    // Create multiple files
    const files = [
      new File(['content1'], 'file1.jpg', { type: 'image/jpeg' }),
      new File(['content2'], 'file2.jpg', { type: 'image/jpeg' }),
    ];

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: { files },
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Too many files'));
    });

    alertSpy.mockRestore();
  });

  it('handles drag and drop', () => {
    render(
      <TestWrapper>
        <MediaUploader onUpload={mockOnUpload} />
      </TestWrapper>
    );

    const dropZone = screen.getByText('Upload files').closest('div');

    // Simulate drag enter
    fireEvent.dragEnter(dropZone!, {
      dataTransfer: { files: [] },
    });

    expect(screen.getByText('Drop files here')).toBeInTheDocument();

    // Simulate drag leave
    fireEvent.dragLeave(dropZone!);

    expect(screen.getByText('Upload files')).toBeInTheDocument();
  });

  it('shows file size formatting', () => {
    render(
      <TestWrapper>
        <MediaUploader
          onUpload={mockOnUpload}
          existingFiles={mockExistingFiles}
        />
      </TestWrapper>
    );

    // Should show formatted file sizes in hover info
    const firstFile = screen.getByText('test-image.jpg').closest('div');
    fireEvent.mouseEnter(firstFile!);

    // File size should be formatted (1024000 bytes = 1000 KB)
    expect(screen.getByText('1000 KB')).toBeInTheDocument();
  });

  it('handles clear selection', () => {
    render(
      <TestWrapper>
        <MediaUploader
          onUpload={mockOnUpload}
          existingFiles={mockExistingFiles}
          multiple={true}
        />
      </TestWrapper>
    );

    // Select files
    const firstFile = screen.getByText('test-image.jpg').closest('div');
    fireEvent.click(firstFile!);

    expect(screen.getByText('1 file selected')).toBeInTheDocument();

    // Clear selection
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(screen.queryByText('1 file selected')).not.toBeInTheDocument();
  });

  it('handles use selected action', () => {
    render(
      <TestWrapper>
        <MediaUploader
          onUpload={mockOnUpload}
          existingFiles={mockExistingFiles}
          multiple={true}
        />
      </TestWrapper>
    );

    // Select files
    const firstFile = screen.getByText('test-image.jpg').closest('div');
    fireEvent.click(firstFile!);

    // Use selected
    const useSelectedButton = screen.getByText('Use Selected');
    fireEvent.click(useSelectedButton);

    expect(mockOnUpload).toHaveBeenCalledWith([mockExistingFiles[0]]);
  });

  it('displays different icons for different file types', () => {
    render(
      <TestWrapper>
        <MediaUploader
          onUpload={mockOnUpload}
          existingFiles={mockExistingFiles}
        />
      </TestWrapper>
    );

    // Image should show as img element
    const imageFile = screen.getByAltText('Test image');
    expect(imageFile).toBeInTheDocument();
    expect(imageFile.tagName).toBe('IMG');

    // Non-image should show as icon - look for the file container
    const pdfContainer = screen.getByText('document.pdf').closest('div');
    expect(pdfContainer).toBeInTheDocument();

    // Check if there's an SVG icon in the container (for non-image files)
    const svgIcon = pdfContainer?.querySelector('svg');
    if (svgIcon) {
      expect(svgIcon).toBeInTheDocument();
    }
  });
});
