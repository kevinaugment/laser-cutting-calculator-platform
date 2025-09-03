/**
 * Content Editor Component
 * Complete blog post editor with metadata, SEO, and publishing controls
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../theme';
import { BlogPost, ContentCategory, ContentTag, BlogPostStatus, ContentSEO } from '../../types/content';
import { RichTextEditor } from './RichTextEditor';
import { SEOOptimizer } from './SEOOptimizer';
import { PublishScheduler } from './PublishScheduler';
import { generateSlug, calculateReadingTime, extractExcerpt } from '../../utils/markdown';

export interface ContentEditorProps {
  post?: Partial<BlogPost>;
  categories: ContentCategory[];
  tags: ContentTag[];
  onSave: (post: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ContentEditor({
  post,
  categories,
  tags,
  onSave,
  onCancel,
  isLoading = false,
  className = '',
}: ContentEditorProps) {
  const { theme } = useTheme();
  
  // Editor state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    contentMarkdown: '',
    status: 'draft',
    categoryIds: [],
    tagIds: [],
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
    ...post,
  });
  
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown' | 'preview'>('wysiwyg');
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'publish'>('content');

  // Update form data when post prop changes
  useEffect(() => {
    if (post) {
      setFormData(prev => ({ ...prev, ...post }));
    }
  }, [post]);

  // Handle form field changes
  const handleFieldChange = useCallback((field: keyof BlogPost, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title
      if (field === 'title' && value && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      
      // Auto-generate SEO title from title
      if (field === 'title' && value && (!prev.seo?.title || prev.seo.title === prev.title)) {
        updated.seo = {
          ...prev.seo,
          title: value,
        };
      }
      
      return updated;
    });
    
    setIsDirty(true);
    
    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Handle SEO field changes
  const handleSEOChange = useCallback((field: keyof ContentSEO, value: any) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
    setIsDirty(true);
  }, []);

  // Handle content changes from rich text editor
  const handleContentChange = useCallback((html: string, markdown: string) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        content: html,
        contentMarkdown: markdown,
      };
      
      // Auto-generate excerpt if not manually set
      if (!prev.excerpt || prev.excerpt === extractExcerpt(prev.content || '')) {
        updated.excerpt = extractExcerpt(html);
      }
      
      // Auto-generate SEO description if not manually set
      if (!prev.seo?.description || prev.seo.description === prev.excerpt) {
        updated.seo = {
          ...prev.seo,
          description: extractExcerpt(html, 160),
        };
      }
      
      return updated;
    });
    setIsDirty(true);
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.slug?.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = useCallback(async (status?: BlogPostStatus) => {
    if (!validateForm()) {
      return;
    }
    
    const postData = {
      ...formData,
      status: status || formData.status,
      readingTime: calculateReadingTime(formData.content || ''),
    };
    
    try {
      await onSave(postData);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  }, [formData, onSave, validateForm]);

  // Handle publish
  const handlePublish = useCallback(() => {
    handleSave('published');
  }, [handleSave]);

  // Handle draft save
  const handleSaveDraft = useCallback(() => {
    handleSave('draft');
  }, [handleSave]);

  // Handle status change from publish scheduler
  const handleStatusChange = useCallback((status: BlogPostStatus, publishedAt?: string) => {
    setFormData(prev => ({
      ...prev,
      status,
      publishedAt,
    }));
    setIsDirty(true);
  }, []);

  return (
    <div className={`content-editor ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {post?.id ? 'Edit Post' : 'Create New Post'}
            </h1>
            {isDirty && (
              <p className="text-sm text-orange-600 mt-1">
                You have unsaved changes
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'content', label: 'Content', icon: '📝' },
              { id: 'seo', label: 'SEO', icon: '🔍' },
              { id: 'publish', label: 'Publish', icon: '🚀' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'content' | 'seo' | 'publish')}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter post title..."
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                id="slug"
                type="text"
                value={formData.slug || ''}
                onChange={(e) => handleFieldChange('slug', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="url-friendly-slug"
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt || ''}
                onChange={(e) => handleFieldChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Brief description of the post..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to auto-generate from content
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                content={formData.content || ''}
                contentMarkdown={formData.contentMarkdown || ''}
                onContentChange={handleContentChange}
                mode={editorMode}
                onModeChange={setEditorMode}
                placeholder="Start writing your post..."
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content}</p>
              )}
            </div>


          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Status</h3>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => handleFieldChange('status', e.target.value as BlogPostStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Categories */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds?.includes(category.id) || false}
                      onChange={(e) => {
                        const categoryIds = formData.categoryIds || [];
                        if (e.target.checked) {
                          handleFieldChange('categoryIds', [...categoryIds, category.id]);
                        } else {
                          handleFieldChange('categoryIds', categoryIds.filter(id => id !== category.id));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tagIds?.includes(tag.id) || false}
                      onChange={(e) => {
                        const tagIds = formData.tagIds || [];
                        if (e.target.checked) {
                          handleFieldChange('tagIds', [...tagIds, tag.id]);
                        } else {
                          handleFieldChange('tagIds', tagIds.filter(id => id !== tag.id));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reading Time */}
            {formData.content && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Reading Time</h3>
                <p className="text-sm text-gray-600">
                  {calculateReadingTime(formData.content)} min read
                </p>
              </div>
            )}
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <SEOOptimizer
            post={formData}
            seo={formData.seo || { title: '', description: '', keywords: [] }}
            onSEOChange={handleSEOChange}
          />
        )}

        {/* Publish Tab */}
        {activeTab === 'publish' && (
          <PublishScheduler
            post={formData}
            onStatusChange={handleStatusChange}
            onSave={handleSaveDraft}
            onPublish={handlePublish}
          />
        )}
      </div>
    </div>
  );
}
