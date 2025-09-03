/**
 * Content Filters Component
 * Search and filter controls for content management
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../theme';
import { ContentQuery, BlogPostStatus, ContentCategory, ContentTag } from '../../types/content';

export interface ContentFiltersProps {
  query: ContentQuery;
  categories: ContentCategory[];
  tags: ContentTag[];
  onQueryChange: (query: ContentQuery) => void;
  className?: string;
}

export function ContentFilters({
  query,
  categories,
  tags,
  onQueryChange,
  className = '',
}: ContentFiltersProps) {
  const { theme } = useTheme();
  const [searchInput, setSearchInput] = useState(query.search || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== query.search) {
        onQueryChange({ ...query, search: searchInput, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, query, onQueryChange]);

  // Handle filter changes
  const handleFilterChange = useCallback((field: keyof ContentQuery, value: any) => {
    onQueryChange({ ...query, [field]: value, page: 1 });
  }, [query, onQueryChange]);

  // Handle status filter
  const handleStatusChange = useCallback((status: BlogPostStatus | 'all') => {
    const statusValue = status === 'all' ? undefined : status;
    handleFilterChange('status', statusValue);
  }, [handleFilterChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchInput('');
    onQueryChange({
      page: 1,
      limit: query.limit,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });
  }, [query.limit, onQueryChange]);

  // Check if any filters are active
  const hasActiveFilters = !!(
    query.search ||
    query.status ||
    query.categoryId ||
    query.tagId ||
    query.authorId ||
    query.dateFrom ||
    query.dateTo
  );

  return (
    <div className={`content-filters ${className}`}>
      <div className="bg-white border rounded-lg p-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search posts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
              showAdvancedFilters || hasActiveFilters
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {[
                    query.search,
                    query.status,
                    query.categoryId,
                    query.tagId,
                    query.authorId,
                    query.dateFrom,
                    query.dateTo,
                  ].filter(Boolean).length}
                </span>
              )}
            </div>
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Quick Status Filters */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
          {[
            { value: 'all', label: 'All' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'archived', label: 'Archived' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value as BlogPostStatus | 'all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                (status.value === 'all' && !query.status) || query.status === status.value
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={query.categoryId || ''}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <select
                  value={query.tagId || ''}
                  onChange={(e) => handleFilterChange('tagId', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={query.sortBy || 'updatedAt'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="updatedAt">Last Modified</option>
                  <option value="createdAt">Date Created</option>
                  <option value="publishedAt">Date Published</option>
                  <option value="title">Title</option>
                  <option value="viewCount">View Count</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={query.sortOrder || 'desc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            {/* Date Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={query.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={query.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          
          {query.search && (
            <FilterTag
              label={`Search: "${query.search}"`}
              onRemove={() => {
                setSearchInput('');
                handleFilterChange('search', undefined);
              }}
            />
          )}
          
          {query.status && (
            <FilterTag
              label={`Status: ${query.status}`}
              onRemove={() => handleFilterChange('status', undefined)}
            />
          )}
          
          {query.categoryId && (
            <FilterTag
              label={`Category: ${categories.find(c => c.id === query.categoryId)?.name || 'Unknown'}`}
              onRemove={() => handleFilterChange('categoryId', undefined)}
            />
          )}
          
          {query.tagId && (
            <FilterTag
              label={`Tag: ${tags.find(t => t.id === query.tagId)?.name || 'Unknown'}`}
              onRemove={() => handleFilterChange('tagId', undefined)}
            />
          )}
          
          {query.dateFrom && (
            <FilterTag
              label={`From: ${query.dateFrom}`}
              onRemove={() => handleFilterChange('dateFrom', undefined)}
            />
          )}
          
          {query.dateTo && (
            <FilterTag
              label={`To: ${query.dateTo}`}
              onRemove={() => handleFilterChange('dateTo', undefined)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Filter Tag Component
interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:text-primary-900 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}
