/**
 * SEO Optimizer Component
 * Advanced SEO analysis and optimization tools for content
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../theme';
import { ContentSEO, BlogPost } from '../../types/content';

export interface SEOOptimizerProps {
  post: Partial<BlogPost>;
  seo: ContentSEO;
  onSEOChange: (seo: ContentSEO) => void;
  className?: string;
}

interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

interface SEOSuggestion {
  field: string;
  message: string;
  example?: string;
}

export function SEOOptimizer({
  post,
  seo,
  onSEOChange,
  className = '',
}: SEOOptimizerProps) {
  const { theme } = useTheme();
  const [analysis, setAnalysis] = useState<SEOAnalysis>({ score: 0, issues: [], suggestions: [] });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Analyze SEO when post or seo changes
  useEffect(() => {
    const newAnalysis = analyzeSEO(post, seo);
    setAnalysis(newAnalysis);
  }, [post, seo]);

  // Handle SEO field changes
  const handleSEOChange = useCallback((field: keyof ContentSEO, value: any) => {
    const updatedSEO = { ...seo, [field]: value };
    onSEOChange(updatedSEO);
  }, [seo, onSEOChange]);

  // Generate suggestions
  const generateSuggestions = useCallback((field: keyof ContentSEO) => {
    switch (field) {
      case 'title':
        return [
          'Include your main keyword near the beginning',
          'Keep it under 60 characters for best display',
          'Make it compelling and click-worthy',
        ];
      case 'description':
        return [
          'Include your main keyword naturally',
          'Keep it between 150-160 characters',
          'Write a compelling summary that encourages clicks',
        ];
      case 'keywords':
        return [
          'Focus on 3-5 relevant keywords',
          'Include long-tail variations',
          'Research competitor keywords',
        ];
      default:
        return [];
    }
  }, []);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get score background
  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className={`seo-optimizer ${className}`}>
      <div className="bg-white border rounded-lg p-6">
        {/* SEO Score */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Optimization</h3>
            <p className="text-sm text-gray-600">
              Optimize your content for search engines
            </p>
          </div>
          
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${getScoreBackground(analysis.score)}`}>
            <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}
            </span>
          </div>
        </div>

        {/* SEO Issues */}
        {analysis.issues.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Issues to Fix</h4>
            <div className="space-y-2">
              {analysis.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-md ${
                    issue.type === 'error' ? 'bg-red-50 border border-red-200' :
                    issue.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    issue.type === 'error' ? 'bg-red-500 text-white' :
                    issue.type === 'warning' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {issue.type === 'error' ? '!' : issue.type === 'warning' ? '⚠' : 'i'}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      issue.type === 'error' ? 'text-red-800' :
                      issue.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {issue.field}: {issue.message}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Impact: {issue.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic SEO Fields */}
        <div className="space-y-6">
          {/* SEO Title */}
          <div>
            <label htmlFor="seo-title" className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
              <span className="text-gray-500 ml-1">({(seo.title || '').length}/60)</span>
            </label>
            <input
              id="seo-title"
              type="text"
              value={seo.title || ''}
              onChange={(e) => handleSEOChange('title', e.target.value)}
              placeholder={post.title || 'Enter SEO title...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              maxLength={60}
            />
            <div className="mt-2 space-y-1">
              {generateSuggestions('title').map((suggestion, index) => (
                <p key={index} className="text-xs text-gray-500">• {suggestion}</p>
              ))}
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label htmlFor="seo-description" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
              <span className="text-gray-500 ml-1">({(seo.description || '').length}/160)</span>
            </label>
            <textarea
              id="seo-description"
              value={seo.description || ''}
              onChange={(e) => handleSEOChange('description', e.target.value)}
              placeholder={post.excerpt || 'Enter meta description...'}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              maxLength={160}
            />
            <div className="mt-2 space-y-1">
              {generateSuggestions('description').map((suggestion, index) => (
                <p key={index} className="text-xs text-gray-500">• {suggestion}</p>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label htmlFor="seo-keywords" className="block text-sm font-medium text-gray-700 mb-2">
              Focus Keywords
            </label>
            <input
              id="seo-keywords"
              type="text"
              value={seo.keywords?.join(', ') || ''}
              onChange={(e) => handleSEOChange('keywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="mt-2 space-y-1">
              {generateSuggestions('keywords').map((suggestion, index) => (
                <p key={index} className="text-xs text-gray-500">• {suggestion}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced SEO Fields */}
        <div className="mt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span>Advanced SEO Settings</span>
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-6 border-t pt-6">
              {/* Open Graph */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="og-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Title
                  </label>
                  <input
                    id="og-title"
                    type="text"
                    value={seo.ogTitle || ''}
                    onChange={(e) => handleSEOChange('ogTitle', e.target.value)}
                    placeholder={seo.title || post.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="og-image" className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Image URL
                  </label>
                  <input
                    id="og-image"
                    type="url"
                    value={seo.ogImage || ''}
                    onChange={(e) => handleSEOChange('ogImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="og-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph Description
                </label>
                <textarea
                  id="og-description"
                  value={seo.ogDescription || ''}
                  onChange={(e) => handleSEOChange('ogDescription', e.target.value)}
                  placeholder={seo.description || post.excerpt || ''}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Twitter Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="twitter-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Title
                  </label>
                  <input
                    id="twitter-title"
                    type="text"
                    value={seo.twitterTitle || ''}
                    onChange={(e) => handleSEOChange('twitterTitle', e.target.value)}
                    placeholder={seo.ogTitle || seo.title || post.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="twitter-image" className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Image URL
                  </label>
                  <input
                    id="twitter-image"
                    type="url"
                    value={seo.twitterImage || ''}
                    onChange={(e) => handleSEOChange('twitterImage', e.target.value)}
                    placeholder={seo.ogImage || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Canonical URL */}
              <div>
                <label htmlFor="canonical-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  id="canonical-url"
                  type="url"
                  value={seo.canonicalUrl || ''}
                  onChange={(e) => handleSEOChange('canonicalUrl', e.target.value)}
                  placeholder={`https://example.com/blog/${post.slug || ''}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Robot Settings */}
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={seo.noIndex || false}
                    onChange={(e) => handleSEOChange('noIndex', e.target.checked)}
                    className="mr-2 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">No Index (hide from search engines)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={seo.noFollow || false}
                    onChange={(e) => handleSEOChange('noFollow', e.target.checked)}
                    className="mr-2 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">No Follow (don't follow links)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* SEO Preview */}
        <div className="mt-6 border-t pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Search Engine Preview</h4>
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {seo.title || post.title || 'Your Post Title'}
            </div>
            <div className="text-green-700 text-sm mt-1">
              {seo.canonicalUrl || `https://example.com/blog/${post.slug || 'your-post-slug'}`}
            </div>
            <div className="text-gray-600 text-sm mt-2">
              {seo.description || post.excerpt || 'Your post description will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SEO Analysis Function
function analyzeSEO(post: Partial<BlogPost>, seo: ContentSEO): SEOAnalysis {
  const issues: SEOIssue[] = [];
  let score = 100;

  // Title analysis
  if (!seo.title && !post.title) {
    issues.push({
      type: 'error',
      field: 'Title',
      message: 'Missing SEO title',
      impact: 'high',
    });
    score -= 20;
  } else {
    const title = seo.title || post.title || '';
    if (title.length > 60) {
      issues.push({
        type: 'warning',
        field: 'Title',
        message: 'Title is too long (over 60 characters)',
        impact: 'medium',
      });
      score -= 10;
    } else if (title.length < 30) {
      issues.push({
        type: 'info',
        field: 'Title',
        message: 'Title could be longer for better SEO',
        impact: 'low',
      });
      score -= 5;
    }
  }

  // Description analysis
  if (!seo.description && !post.excerpt) {
    issues.push({
      type: 'error',
      field: 'Description',
      message: 'Missing meta description',
      impact: 'high',
    });
    score -= 20;
  } else {
    const description = seo.description || post.excerpt || '';
    if (description.length > 160) {
      issues.push({
        type: 'warning',
        field: 'Description',
        message: 'Meta description is too long (over 160 characters)',
        impact: 'medium',
      });
      score -= 10;
    } else if (description.length < 120) {
      issues.push({
        type: 'info',
        field: 'Description',
        message: 'Meta description could be longer',
        impact: 'low',
      });
      score -= 5;
    }
  }

  // Keywords analysis
  if (!seo.keywords || seo.keywords.length === 0) {
    issues.push({
      type: 'warning',
      field: 'Keywords',
      message: 'No focus keywords defined',
      impact: 'medium',
    });
    score -= 15;
  } else if (seo.keywords.length > 5) {
    issues.push({
      type: 'info',
      field: 'Keywords',
      message: 'Too many keywords - focus on 3-5 main ones',
      impact: 'low',
    });
    score -= 5;
  }

  // Content analysis
  if (!post.content || post.content.length < 300) {
    issues.push({
      type: 'warning',
      field: 'Content',
      message: 'Content is too short for good SEO (under 300 words)',
      impact: 'medium',
    });
    score -= 10;
  }

  const suggestions: SEOSuggestion[] = [
    {
      field: 'title',
      message: 'Include your main keyword near the beginning of the title',
      example: 'How to [Keyword] - Complete Guide 2024',
    },
    {
      field: 'description',
      message: 'Write a compelling meta description that includes your keyword',
      example: 'Learn [keyword] with our step-by-step guide. Includes tips, examples, and best practices.',
    },
  ];

  return {
    score: Math.max(0, score),
    issues,
    suggestions,
  };
}
