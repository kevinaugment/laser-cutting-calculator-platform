/**
 * Content Management System Types
 * Type definitions for blog posts, categories, and content management
 */

// Blog post status types
export type BlogPostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

// Content category
export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Content tag
export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// SEO metadata for content
export interface ContentSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

// Blog post author
export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

// Blog post content
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentMarkdown: string;
  status: BlogPostStatus;
  
  // Metadata
  authorId: string;
  author?: BlogAuthor;
  categoryIds: string[];
  categories?: ContentCategory[];
  tagIds: string[];
  tags?: ContentTag[];
  
  // SEO
  seo: ContentSEO;
  
  // Publishing
  publishedAt?: string;
  scheduledAt?: string;
  
  // System fields
  createdAt: string;
  updatedAt: string;
  version: number;
  
  // Media
  featuredImage?: string;
  images?: string[];
  
  // Analytics
  viewCount?: number;
  readingTime?: number;
  
  // Content structure
  tableOfContents?: ContentTOCItem[];
}

// Table of contents item
export interface ContentTOCItem {
  id: string;
  title: string;
  level: number;
  anchor: string;
  children?: ContentTOCItem[];
}

// Content revision for version control
export interface ContentRevision {
  id: string;
  postId: string;
  version: number;
  title: string;
  content: string;
  contentMarkdown: string;
  authorId: string;
  createdAt: string;
  changeDescription?: string;
}

// Content search result
export interface ContentSearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: 'post' | 'category' | 'tag';
  relevanceScore: number;
  highlightedContent?: string;
}

// Content management API responses
export interface ContentAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContentListResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// Content management filters and queries
export interface ContentQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogPostStatus | BlogPostStatus[];
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

// Content management operations
export interface ContentOperations {
  // Blog posts
  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<ContentAPIResponse<BlogPost>>;
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<ContentAPIResponse<BlogPost>>;
  deletePost: (id: string) => Promise<ContentAPIResponse<void>>;
  getPost: (id: string) => Promise<ContentAPIResponse<BlogPost>>;
  getPosts: (query?: ContentQuery) => Promise<ContentListResponse<BlogPost>>;
  
  // Categories
  createCategory: (category: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContentAPIResponse<ContentCategory>>;
  updateCategory: (id: string, updates: Partial<ContentCategory>) => Promise<ContentAPIResponse<ContentCategory>>;
  deleteCategory: (id: string) => Promise<ContentAPIResponse<void>>;
  getCategories: () => Promise<ContentListResponse<ContentCategory>>;
  
  // Tags
  createTag: (tag: Omit<ContentTag, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ContentAPIResponse<ContentTag>>;
  updateTag: (id: string, updates: Partial<ContentTag>) => Promise<ContentAPIResponse<ContentTag>>;
  deleteTag: (id: string) => Promise<ContentAPIResponse<void>>;
  getTags: () => Promise<ContentListResponse<ContentTag>>;
  
  // Search
  searchContent: (query: string, filters?: Partial<ContentQuery>) => Promise<ContentListResponse<ContentSearchResult>>;
  
  // Media
  uploadImage: (file: File, alt?: string) => Promise<ContentAPIResponse<{ url: string; alt?: string }>>;
  deleteImage: (url: string) => Promise<ContentAPIResponse<void>>;
}

// Content editor state
export interface ContentEditorState {
  post: Partial<BlogPost>;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved?: string;
  errors: Record<string, string>;
  mode: 'edit' | 'preview';
}

// Content management dashboard state
export interface ContentDashboardState {
  posts: BlogPost[];
  categories: ContentCategory[];
  tags: ContentTag[];
  loading: boolean;
  error?: string;
  selectedPosts: string[];
  filters: ContentQuery;
  view: 'list' | 'grid' | 'table';
}
