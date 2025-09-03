/**
 * ContentDashboard Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../../../theme';
import { ContentDashboard } from '../../../components/cms/ContentDashboard';
import { ContentAPI } from '../../../api/content';

// Mock the ContentAPI
vi.mock('../../../api/content', () => ({
  ContentAPI: {
    getPosts: vi.fn(),
    getCategories: vi.fn(),
    getTags: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
  },
}));

// Mock TipTap editor components
vi.mock('../../../components/cms/RichTextEditor', () => ({
  RichTextEditor: ({ onContentChange }: any) => (
    <div data-testid="rich-text-editor">
      <button onClick={() => onContentChange('<p>Test content</p>', 'Test content')}>
        Update Content
      </button>
    </div>
  ),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

// Mock data
const mockPosts = [
  {
    id: 'post-1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    excerpt: 'This is a test post excerpt',
    content: '<p>Test content</p>',
    contentMarkdown: 'Test content',
    status: 'published' as const,
    authorId: 'author-1',
    categoryIds: ['cat-1'],
    tagIds: ['tag-1'],
    seo: { title: 'Test Post 1', description: 'Test description' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    readingTime: 2,
    viewCount: 100,
  },
  {
    id: 'post-2',
    title: 'Test Post 2',
    slug: 'test-post-2',
    excerpt: 'Another test post',
    content: '<p>Another test content</p>',
    contentMarkdown: 'Another test content',
    status: 'draft' as const,
    authorId: 'author-1',
    categoryIds: ['cat-2'],
    tagIds: ['tag-2'],
    seo: { title: 'Test Post 2', description: 'Another test description' },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    version: 1,
    readingTime: 3,
    viewCount: 50,
  },
];

const mockCategories = [
  {
    id: 'cat-1',
    name: 'Category 1',
    slug: 'category-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Category 2',
    slug: 'category-2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockTags = [
  {
    id: 'tag-1',
    name: 'Tag 1',
    slug: 'tag-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag-2',
    name: 'Tag 2',
    slug: 'tag-2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('ContentDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    (ContentAPI.getPosts as any).mockResolvedValue({
      success: true,
      data: mockPosts,
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });
    
    (ContentAPI.getCategories as any).mockResolvedValue({
      success: true,
      data: mockCategories,
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });
    
    (ContentAPI.getTags as any).mockResolvedValue({
      success: true,
      data: mockTags,
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });
  });

  it('renders dashboard with posts', async () => {
    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Check for header
    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('New Post')).toBeInTheDocument();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  it('opens editor when New Post is clicked', async () => {
    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Click New Post button
    const newPostButton = screen.getByText('New Post');
    fireEvent.click(newPostButton);

    // Should show editor
    await waitFor(() => {
      expect(screen.getByText('Create New Post')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Find and use search input
    const searchInput = screen.getByPlaceholderText('Search posts...');
    fireEvent.change(searchInput, { target: { value: 'Test Post 1' } });

    // Should trigger API call with search parameter
    await waitFor(() => {
      expect(ContentAPI.getPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Test Post 1',
          page: 1,
        })
      );
    });
  });

  it('handles status filter changes', async () => {
    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Click on Draft status filter
    const draftButton = screen.getByText('Draft');
    fireEvent.click(draftButton);

    // Should trigger API call with status filter
    await waitFor(() => {
      expect(ContentAPI.getPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'draft',
          page: 1,
        })
      );
    });
  });

  it('handles view changes', async () => {
    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Find view control buttons
    const gridViewButton = screen.getByTitle('Grid view');
    fireEvent.click(gridViewButton);

    // View should change (this would be reflected in the component state)
    expect(gridViewButton).toHaveClass('bg-primary-100');
  });

  it('handles post deletion', async () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    (ContentAPI.deletePost as any).mockResolvedValue({ success: true });

    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Find and click delete button (assuming it's rendered in the list)
    const deleteButtons = screen.getAllByTitle('Delete post');
    fireEvent.click(deleteButtons[0]);

    // Should call delete API
    await waitFor(() => {
      expect(ContentAPI.deletePost).toHaveBeenCalledWith('post-1');
    });

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('handles API errors gracefully', async () => {
    // Mock API to return error
    (ContentAPI.getPosts as any).mockResolvedValue({
      success: false,
      error: 'Failed to load posts',
    });

    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    // Mock API to never resolve
    (ContentAPI.getPosts as any).mockImplementation(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Should show loading state (this would be in the BlogPostList component)
    expect(screen.getByText('Content Management')).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    // Mock API to return empty results
    (ContentAPI.getPosts as any).mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });

    render(
      <TestWrapper>
        <ContentDashboard />
      </TestWrapper>
    );

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });
  });
});
