/**
 * Content Management Dashboard
 * Main interface for managing blog posts, categories, and tags
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../theme';
import { 
  BlogPost, 
  ContentCategory, 
  ContentTag, 
  ContentQuery, 
  BlogPostStatus,
  ContentDashboardState 
} from '../../types/content';
import { ContentAPI } from '../../api/content';
import { BlogPostList } from './BlogPostList';
import { ContentFilters } from './ContentFilters';
import { ContentEditor } from './ContentEditor';

export interface ContentDashboardProps {
  className?: string;
}

export function ContentDashboard({ className = '' }: ContentDashboardProps) {
  const { theme } = useTheme();
  
  // Dashboard state
  const [state, setState] = useState<ContentDashboardState>({
    posts: [],
    categories: [],
    tags: [],
    loading: false,
    selectedPosts: [],
    filters: {
      page: 1,
      limit: 10,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    },
    view: 'list',
  });

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | undefined>();
  const [editorLoading, setEditorLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    loadPosts();
  }, [state.filters]);

  // Load all data
  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const [postsResult, categoriesResult, tagsResult] = await Promise.all([
        ContentAPI.getPosts(state.filters),
        ContentAPI.getCategories(),
        ContentAPI.getTags(),
      ]);

      if (postsResult.success && categoriesResult.success && tagsResult.success) {
        setState(prev => ({
          ...prev,
          posts: postsResult.data,
          categories: categoriesResult.data,
          tags: tagsResult.data,
          loading: false,
        }));
        
        setPagination(postsResult.pagination);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load data',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      }));
    }
  }, [state.filters]);

  // Load posts only
  const loadPosts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await ContentAPI.getPosts(state.filters);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          posts: result.data,
          loading: false,
        }));
        
        setPagination(result.pagination);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load posts',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load posts',
      }));
    }
  }, [state.filters]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ContentQuery) => {
    setState(prev => ({
      ...prev,
      filters: newFilters,
    }));
  }, []);

  // Handle view change
  const handleViewChange = useCallback((view: 'list' | 'grid' | 'table') => {
    setState(prev => ({ ...prev, view }));
  }, []);

  // Handle post selection
  const handlePostSelection = useCallback((selectedIds: string[]) => {
    setState(prev => ({ ...prev, selectedPosts: selectedIds }));
  }, []);

  // Handle post edit
  const handlePostEdit = useCallback((post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  }, []);

  // Handle new post
  const handleNewPost = useCallback(() => {
    setEditingPost(undefined);
    setShowEditor(true);
  }, []);

  // Handle post save
  const handlePostSave = useCallback(async (postData: Partial<BlogPost>) => {
    setEditorLoading(true);
    
    try {
      let result;
      
      if (editingPost?.id) {
        // Update existing post
        result = await ContentAPI.updatePost(editingPost.id, postData);
      } else {
        // Create new post
        result = await ContentAPI.createPost(postData as any);
      }
      
      if (result.success) {
        setShowEditor(false);
        setEditingPost(undefined);
        loadPosts(); // Reload posts
      } else {
        throw new Error(result.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      // Handle error (show toast, etc.)
    } finally {
      setEditorLoading(false);
    }
  }, [editingPost, loadPosts]);

  // Handle post delete
  const handlePostDelete = useCallback(async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      const result = await ContentAPI.deletePost(postId);
      
      if (result.success) {
        loadPosts(); // Reload posts
      } else {
        throw new Error(result.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      // Handle error (show toast, etc.)
    }
  }, [loadPosts]);

  // Handle post status change
  const handlePostStatusChange = useCallback(async (postId: string, status: BlogPostStatus) => {
    try {
      const result = await ContentAPI.updatePost(postId, { status });
      
      if (result.success) {
        loadPosts(); // Reload posts
      } else {
        throw new Error(result.error || 'Failed to update post status');
      }
    } catch (error) {
      console.error('Failed to update post status:', error);
      // Handle error (show toast, etc.)
    }
  }, [loadPosts]);

  // Handle bulk actions
  const handleBulkAction = useCallback(async (action: string, postIds: string[]) => {
    if (!confirm(`Are you sure you want to ${action} ${postIds.length} post(s)?`)) {
      return;
    }
    
    try {
      const promises = postIds.map(postId => {
        switch (action) {
          case 'publish':
            return ContentAPI.updatePost(postId, { status: 'published' });
          case 'draft':
            return ContentAPI.updatePost(postId, { status: 'draft' });
          case 'archive':
            return ContentAPI.updatePost(postId, { status: 'archived' });
          case 'delete':
            return ContentAPI.deletePost(postId);
          default:
            return Promise.resolve({ success: false, error: 'Unknown action' });
        }
      });
      
      const results = await Promise.all(promises);
      const failed = results.filter(r => !r.success);
      
      if (failed.length === 0) {
        setState(prev => ({ ...prev, selectedPosts: [] }));
        loadPosts(); // Reload posts
      } else {
        console.error('Some operations failed:', failed);
        // Handle partial failure
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      // Handle error (show toast, etc.)
    }
  }, [loadPosts]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    handleFiltersChange({ ...state.filters, page });
  }, [state.filters, handleFiltersChange]);

  // Show editor
  if (showEditor) {
    return (
      <ContentEditor
        post={editingPost}
        categories={state.categories}
        tags={state.tags}
        onSave={handlePostSave}
        onCancel={() => {
          setShowEditor(false);
          setEditingPost(undefined);
        }}
        isLoading={editorLoading}
        className={className}
      />
    );
  }

  return (
    <div className={`content-dashboard ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your blog posts, categories, and tags
            </p>
          </div>
          
          <button
            onClick={handleNewPost}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </div>
          </button>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{state.error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <ContentFilters
          query={state.filters}
          categories={state.categories}
          tags={state.tags}
          onQueryChange={handleFiltersChange}
          className="mb-6"
        />

        {/* Post List */}
        <BlogPostList
          posts={state.posts}
          loading={state.loading}
          selectedPosts={state.selectedPosts}
          onSelectionChange={handlePostSelection}
          onPostEdit={handlePostEdit}
          onPostDelete={handlePostDelete}
          onPostStatusChange={handlePostStatusChange}
          onBulkAction={handleBulkAction}
          view={state.view}
          onViewChange={handleViewChange}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      page === pagination.page
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
