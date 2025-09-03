/**
 * Content Analytics Component
 * Display content performance metrics and insights
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../theme';
import { BlogPost } from '../../types/content';

export interface ContentAnalyticsProps {
  posts: BlogPost[];
  className?: string;
}

interface AnalyticsData {
  totalPosts: number;
  totalViews: number;
  averageReadingTime: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  topPosts: BlogPost[];
  categoryStats: { name: string; count: number; views: number }[];
  tagStats: { name: string; count: number; views: number }[];
  monthlyStats: { month: string; posts: number; views: number }[];
}

export function ContentAnalytics({ posts, className = '' }: ContentAnalyticsProps) {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Calculate analytics data
  const analyticsData = useMemo((): AnalyticsData => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        cutoffDate.setFullYear(2000); // Include all posts
    }

    const filteredPosts = posts.filter(post => 
      new Date(post.createdAt) >= cutoffDate
    );

    // Basic stats
    const totalPosts = filteredPosts.length;
    const totalViews = filteredPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const averageReadingTime = filteredPosts.reduce((sum, post) => sum + (post.readingTime || 0), 0) / totalPosts || 0;
    
    const publishedPosts = filteredPosts.filter(p => p.status === 'published').length;
    const draftPosts = filteredPosts.filter(p => p.status === 'draft').length;
    const scheduledPosts = filteredPosts.filter(p => p.status === 'scheduled').length;

    // Top posts by views
    const topPosts = [...filteredPosts]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);

    // Category stats
    const categoryMap = new Map<string, { count: number; views: number }>();
    filteredPosts.forEach(post => {
      post.categories?.forEach(category => {
        const existing = categoryMap.get(category.name) || { count: 0, views: 0 };
        categoryMap.set(category.name, {
          count: existing.count + 1,
          views: existing.views + (post.viewCount || 0),
        });
      });
    });
    
    const categoryStats = Array.from(categoryMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.views - a.views);

    // Tag stats
    const tagMap = new Map<string, { count: number; views: number }>();
    filteredPosts.forEach(post => {
      post.tags?.forEach(tag => {
        const existing = tagMap.get(tag.name) || { count: 0, views: 0 };
        tagMap.set(tag.name, {
          count: existing.count + 1,
          views: existing.views + (post.viewCount || 0),
        });
      });
    });
    
    const tagStats = Array.from(tagMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Monthly stats
    const monthlyMap = new Map<string, { posts: number; views: number }>();
    filteredPosts.forEach(post => {
      const date = new Date(post.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthlyMap.get(monthKey) || { posts: 0, views: 0 };
      monthlyMap.set(monthKey, {
        posts: existing.posts + 1,
        views: existing.views + (post.viewCount || 0),
      });
    });
    
    const monthlyStats = Array.from(monthlyMap.entries())
      .map(([month, stats]) => ({ month, ...stats }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    return {
      totalPosts,
      totalViews,
      averageReadingTime,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      topPosts,
      categoryStats,
      tagStats,
      monthlyStats,
    };
  }, [posts, timeRange]);

  // Format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format month
  const formatMonth = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };

  return (
    <div className={`content-analytics ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Analytics</h2>
            <p className="text-gray-600 mt-1">
              Insights and performance metrics for your content
            </p>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalViews)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Reading Time</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(analyticsData.averageReadingTime)}m</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.publishedPosts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analyticsData.publishedPosts}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{analyticsData.draftPosts}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.scheduledPosts}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Posts */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
            <div className="space-y-4">
              {analyticsData.topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-sm text-gray-500">{formatNumber(post.viewCount || 0)} views</p>
                  </div>
                </div>
              ))}
              {analyticsData.topPosts.length === 0 && (
                <p className="text-gray-500 text-center py-4">No posts with views yet</p>
              )}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
            <div className="space-y-4">
              {analyticsData.categoryStats.slice(0, 5).map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.count} posts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatNumber(category.views)}</p>
                    <p className="text-sm text-gray-500">views</p>
                  </div>
                </div>
              ))}
              {analyticsData.categoryStats.length === 0 && (
                <p className="text-gray-500 text-center py-4">No categories yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {analyticsData.tagStats.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag.name}
                <span className="text-xs text-gray-500">
                  {tag.count} • {formatNumber(tag.views)} views
                </span>
              </span>
            ))}
            {analyticsData.tagStats.length === 0 && (
              <p className="text-gray-500">No tags yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
