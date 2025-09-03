/**
 * SEOOptimizer Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../../../theme';
import { SEOOptimizer } from '../../../components/cms/SEOOptimizer';
import { BlogPost, ContentSEO } from '../../../types/content';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('SEOOptimizer', () => {
  const mockPost: Partial<BlogPost> = {
    id: 'test-post',
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    excerpt: 'This is a test blog post excerpt for testing purposes.',
    content: '<p>This is the content of the test blog post. It contains enough text to be considered for SEO analysis.</p>',
  };

  const mockSEO: ContentSEO = {
    title: 'Test SEO Title',
    description: 'Test SEO description for the blog post',
    keywords: ['test', 'blog', 'seo'],
  };

  const mockOnSEOChange = vi.fn();

  beforeEach(() => {
    mockOnSEOChange.mockClear();
  });

  it('renders SEO optimizer with basic fields', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('SEO Optimization')).toBeInTheDocument();
    expect(screen.getByLabelText(/SEO Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meta Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Focus Keywords/)).toBeInTheDocument();
  });

  it('displays current SEO values', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test SEO Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test SEO description for the blog post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test, blog, seo')).toBeInTheDocument();
  });

  it('shows character counts for title and description', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('(14/60)')).toBeInTheDocument(); // Title character count
    expect(screen.getByText('(38/160)')).toBeInTheDocument(); // Description character count (actual length)
  });

  it('handles SEO field changes', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    const titleInput = screen.getByLabelText(/SEO Title/);
    fireEvent.change(titleInput, { target: { value: 'Updated SEO Title' } });

    expect(mockOnSEOChange).toHaveBeenCalledWith({
      ...mockSEO,
      title: 'Updated SEO Title',
    });
  });

  it('handles keyword changes', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    const keywordsInput = screen.getByLabelText(/Focus Keywords/);
    fireEvent.change(keywordsInput, { target: { value: 'new, keywords, list' } });

    expect(mockOnSEOChange).toHaveBeenCalledWith({
      ...mockSEO,
      keywords: ['new', 'keywords', 'list'],
    });
  });

  it('displays SEO score', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    // Should display a numeric score
    const scoreElement = screen.getByText(/^\d+$/);
    expect(scoreElement).toBeInTheDocument();
  });

  it('shows advanced SEO fields when expanded', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    const advancedButton = screen.getByText('Advanced SEO Settings');
    fireEvent.click(advancedButton);

    expect(screen.getByLabelText(/Open Graph Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Open Graph Image URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Twitter Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Canonical URL/)).toBeInTheDocument();
  });

  it('displays search engine preview', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Search Engine Preview')).toBeInTheDocument();
    expect(screen.getByText('Test SEO Title')).toBeInTheDocument();

    // Use more specific selector for preview content
    const previewSection = screen.getByText('Search Engine Preview').closest('div');
    expect(previewSection).toHaveTextContent('Test SEO description for the blog post');
  });

  it('shows suggestions for SEO fields', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    // Should show suggestions under each field
    expect(screen.getByText(/Include your main keyword near the beginning/)).toBeInTheDocument();
    expect(screen.getByText(/Keep it under 60 characters/)).toBeInTheDocument();
    expect(screen.getByText(/Keep it between 150-160 characters/)).toBeInTheDocument();
  });

  it('handles empty SEO data', () => {
    const emptySEO: ContentSEO = {
      title: '',
      description: '',
      keywords: [],
    };

    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={emptySEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    // Check specific fields by their labels
    expect(screen.getByLabelText(/SEO Title/)).toHaveValue('');
    expect(screen.getByLabelText(/Meta Description/)).toHaveValue('');
    expect(screen.getByLabelText(/Focus Keywords/)).toHaveValue('');
    expect(screen.getByText('(0/60)')).toBeInTheDocument();
    expect(screen.getByText('(0/160)')).toBeInTheDocument();
  });

  it('uses post data as fallback for preview', () => {
    const emptySEO: ContentSEO = {
      title: '',
      description: '',
      keywords: [],
    };

    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={emptySEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    // Should use post title and excerpt as fallback in preview
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog post excerpt for testing purposes.')).toBeInTheDocument();
  });

  it('handles advanced field changes', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    // Expand advanced fields
    const advancedButton = screen.getByText('Advanced SEO Settings');
    fireEvent.click(advancedButton);

    // Change Open Graph title
    const ogTitleInput = screen.getByLabelText(/Open Graph Title/);
    fireEvent.change(ogTitleInput, { target: { value: 'OG Title' } });

    expect(mockOnSEOChange).toHaveBeenCalledWith({
      ...mockSEO,
      ogTitle: 'OG Title',
    });
  });

  it('handles robot settings checkboxes', () => {
    render(
      <TestWrapper>
        <SEOOptimizer
          post={mockPost}
          seo={mockSEO}
          onSEOChange={mockOnSEOChange}
        />
      </TestWrapper>
    );

    // Expand advanced fields
    const advancedButton = screen.getByText('Advanced SEO Settings');
    fireEvent.click(advancedButton);

    // Toggle no index checkbox
    const noIndexCheckbox = screen.getByLabelText(/No Index/);
    fireEvent.click(noIndexCheckbox);

    expect(mockOnSEOChange).toHaveBeenCalledWith({
      ...mockSEO,
      noIndex: true,
    });
  });
});
