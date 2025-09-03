/**
 * Blog Post List Component
 * Displays and manages list of blog posts with filtering and actions
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { BlogPost, BlogPostStatus, ContentQuery } from '../../types/content';

export interface BlogPostListProps {
  posts: BlogPost[];
  loading?: boolean;
  selectedPosts?: string[];
  onPostSelect?: (postId: string) => void;
  onPostEdit?: (post: BlogPost) => void;
  onPostDelete?: (postId: string) => void;
  onPostStatusChange?: (postId: string, status: BlogPostStatus) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onBulkAction?: (action: string, postIds: string[]) => void;
  view?: 'list' | 'grid' | 'table';
  onViewChange?: (view: 'list' | 'grid' | 'table') => void;
  className?: string;
}

export function BlogPostList({
  posts,
  loading = false,
  selectedPosts = [],
  onPostSelect,
  onPostEdit,
  onPostDelete,
  onPostStatusChange,
  onSelectionChange,
  onBulkAction,
  view = 'list',
  onViewChange,
  className = '',
}: BlogPostListProps) {
  const { theme } = useTheme();
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Handle post selection
  const handlePostSelection = useCallback((postId: string, selected: boolean) => {
    const newSelection = selected
      ? [...selectedPosts, postId]
      : selectedPosts.filter(id => id !== postId);
    
    onSelectionChange?.(newSelection);
  }, [selectedPosts, onSelectionChange]);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    const newSelection = selected ? posts.map(p => p.id) : [];
    onSelectionChange?.(newSelection);
  }, [posts, onSelectionChange]);

  // Handle bulk actions
  const handleBulkAction = useCallback((action: string) => {
    if (selectedPosts.length > 0) {
      onBulkAction?.(action, selectedPosts);
    }
  }, [selectedPosts, onBulkAction]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (status: BlogPostStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-500">Get started by creating your first blog post.</p>
      </div>
    );
  }

  return (
    <div className={`blog-post-list ${className}`}>
      {/* Header with view controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Bulk selection */}
          {onSelectionChange && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPosts.length === posts.length && posts.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                {selectedPosts.length > 0 ? `${selectedPosts.length} selected` : 'Select all'}
              </span>
            </div>
          )}

          {/* Bulk actions */}
          {selectedPosts.length > 0 && onBulkAction && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkAction(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Bulk Actions</option>
                <option value="publish">Publish</option>
                <option value="draft">Move to Draft</option>
                <option value="archive">Archive</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          )}
        </div>

        {/* View controls */}
        {onViewChange && (
          <div className="flex items-center gap-1 border rounded-md p-1">
            <button
              onClick={() => onViewChange('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => onViewChange('grid')}
              className={`p-2 rounded ${view === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewChange('table')}
              className={`p-2 rounded ${view === 'table' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Table view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Post list */}
      {view === 'table' ? (
        <TableView
          posts={posts}
          selectedPosts={selectedPosts}
          onPostSelection={handlePostSelection}
          onPostEdit={onPostEdit}
          onPostDelete={onPostDelete}
          onPostStatusChange={onPostStatusChange}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      ) : view === 'grid' ? (
        <GridView
          posts={posts}
          selectedPosts={selectedPosts}
          onPostSelection={handlePostSelection}
          onPostEdit={onPostEdit}
          onPostDelete={onPostDelete}
          onPostStatusChange={onPostStatusChange}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      ) : (
        <ListView
          posts={posts}
          selectedPosts={selectedPosts}
          onPostSelection={handlePostSelection}
          onPostEdit={onPostEdit}
          onPostDelete={onPostDelete}
          onPostStatusChange={onPostStatusChange}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
}

// List View Component
interface ViewProps {
  posts: BlogPost[];
  selectedPosts: string[];
  onPostSelection?: (postId: string, selected: boolean) => void;
  onPostEdit?: (post: BlogPost) => void;
  onPostDelete?: (postId: string) => void;
  onPostStatusChange?: (postId: string, status: BlogPostStatus) => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: BlogPostStatus) => string;
}

function ListView({
  posts,
  selectedPosts,
  onPostSelection,
  onPostEdit,
  onPostDelete,
  onPostStatusChange,
  formatDate,
  getStatusColor,
}: ViewProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {onPostSelection && (
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => onPostSelection(post.id, e.target.checked)}
                  className="mt-1 rounded border-gray-300"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {post.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </div>
                
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-2" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>By {post.author?.name || 'Unknown'}</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                  {post.viewCount && <span>{post.viewCount} views</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {onPostEdit && (
                <button
                  onClick={() => onPostEdit(post)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded"
                  title="Edit post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {onPostDelete && (
                <button
                  onClick={() => onPostDelete(post.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded"
                  title="Delete post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Grid View Component
function GridView({ posts, selectedPosts, onPostSelection, onPostEdit, onPostDelete, formatDate, getStatusColor }: ViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {post.featuredImage && (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
          
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                {post.status}
              </span>
              
              {onPostSelection && (
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => onPostSelection(post.id, e.target.checked)}
                  className="rounded border-gray-300"
                />
              )}
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>By {post.author?.name || 'Unknown'}</span>
              <span>{formatDate(post.updatedAt)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {post.readingTime && <span>{post.readingTime} min read</span>}
                {post.viewCount && <span>{post.viewCount} views</span>}
              </div>
              
              <div className="flex items-center gap-1">
                {onPostEdit && (
                  <button
                    onClick={() => onPostEdit(post)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="Edit post"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                
                {onPostDelete && (
                  <button
                    onClick={() => onPostDelete(post.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Delete post"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Table View Component
function TableView({ posts, selectedPosts, onPostSelection, onPostEdit, onPostDelete, onPostStatusChange, formatDate, getStatusColor }: ViewProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {onPostSelection && (
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                />
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views
            </th>
            <th className="w-24 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              {onPostSelection && (
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={(e) => onPostSelection(post.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </td>
              )}
              <td className="px-4 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {post.title}
                  </div>
                  {post.excerpt && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {post.excerpt}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                {onPostStatusChange ? (
                  <select
                    value={post.status}
                    onChange={(e) => onPostStatusChange(post.id, e.target.value as BlogPostStatus)}
                    className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(post.status)}`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {post.author?.name || 'Unknown'}
              </td>
              <td className="px-4 py-4 text-sm text-gray-500">
                {formatDate(post.updatedAt)}
              </td>
              <td className="px-4 py-4 text-sm text-gray-500">
                {post.viewCount || 0}
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {onPostEdit && (
                    <button
                      onClick={() => onPostEdit(post)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Edit post"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                  
                  {onPostDelete && (
                    <button
                      onClick={() => onPostDelete(post.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete post"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
