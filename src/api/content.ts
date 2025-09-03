/**
 * Content Management API
 * File-based content management system with CRUD operations
 */

import { 
  BlogPost, 
  ContentCategory, 
  ContentTag, 
  ContentQuery, 
  ContentAPIResponse, 
  ContentListResponse,
  ContentSearchResult,
  BlogAuthor,
  ContentRevision
} from '../types/content';
import { generateSlug, calculateReadingTime, extractExcerpt, generateTableOfContents } from '../utils/markdown';

// Mock data storage (in production, this would be replaced with actual file system operations)
let blogPosts: BlogPost[] = [];
let categories: ContentCategory[] = [];
let tags: ContentTag[] = [];
let authors: BlogAuthor[] = [];
let revisions: ContentRevision[] = [];

// Initialize with some default data
initializeDefaultData();

/**
 * Content Management API Implementation
 */
export class ContentAPI {
  // Blog Posts
  static async createPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<ContentAPIResponse<BlogPost>> {
    try {
      const now = new Date().toISOString();
      const id = generateId();
      
      // Generate slug if not provided
      const slug = postData.slug || generateSlug(postData.title);
      
      // Ensure slug is unique
      const uniqueSlug = await ensureUniqueSlug(slug);
      
      // Calculate reading time and extract excerpt
      const readingTime = calculateReadingTime(postData.content);
      const excerpt = postData.excerpt || extractExcerpt(postData.content);
      
      // Generate table of contents
      const tableOfContents = generateTableOfContents(postData.contentMarkdown);
      
      const post: BlogPost = {
        ...postData,
        id,
        slug: uniqueSlug,
        excerpt,
        readingTime,
        tableOfContents,
        version: 1,
        createdAt: now,
        updatedAt: now,
        viewCount: 0,
      };
      
      blogPosts.push(post);
      
      // Create initial revision
      await this.createRevision(post, 'Initial version');
      
      return {
        success: true,
        data: post,
        message: 'Blog post created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create blog post',
      };
    }
  }
  
  static async updatePost(id: string, updates: Partial<BlogPost>): Promise<ContentAPIResponse<BlogPost>> {
    try {
      const postIndex = blogPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        return {
          success: false,
          error: 'Blog post not found',
        };
      }
      
      const existingPost = blogPosts[postIndex];
      const now = new Date().toISOString();
      
      // Update slug if title changed
      let slug = updates.slug || existingPost.slug;
      if (updates.title && updates.title !== existingPost.title) {
        slug = generateSlug(updates.title);
        slug = await ensureUniqueSlug(slug, id);
      }
      
      // Recalculate reading time and excerpt if content changed
      let readingTime = existingPost.readingTime;
      let excerpt = updates.excerpt || existingPost.excerpt;
      let tableOfContents = existingPost.tableOfContents;
      
      if (updates.content || updates.contentMarkdown) {
        const content = updates.content || existingPost.content;
        const contentMarkdown = updates.contentMarkdown || existingPost.contentMarkdown;
        
        readingTime = calculateReadingTime(content);
        excerpt = updates.excerpt || extractExcerpt(content);
        tableOfContents = generateTableOfContents(contentMarkdown);
      }
      
      const updatedPost: BlogPost = {
        ...existingPost,
        ...updates,
        slug,
        excerpt,
        readingTime,
        tableOfContents,
        version: existingPost.version + 1,
        updatedAt: now,
      };
      
      blogPosts[postIndex] = updatedPost;
      
      // Create revision if content changed
      if (updates.content || updates.contentMarkdown || updates.title) {
        await this.createRevision(updatedPost, 'Content updated');
      }
      
      return {
        success: true,
        data: updatedPost,
        message: 'Blog post updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update blog post',
      };
    }
  }
  
  static async deletePost(id: string): Promise<ContentAPIResponse<void>> {
    try {
      const postIndex = blogPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        return {
          success: false,
          error: 'Blog post not found',
        };
      }
      
      blogPosts.splice(postIndex, 1);
      
      // Remove associated revisions
      revisions = revisions.filter(r => r.postId !== id);
      
      return {
        success: true,
        message: 'Blog post deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete blog post',
      };
    }
  }
  
  static async getPost(id: string): Promise<ContentAPIResponse<BlogPost>> {
    try {
      const post = blogPosts.find(p => p.id === id);
      if (!post) {
        return {
          success: false,
          error: 'Blog post not found',
        };
      }
      
      // Populate related data
      const populatedPost = await this.populatePostData(post);
      
      return {
        success: true,
        data: populatedPost,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get blog post',
      };
    }
  }
  
  static async getPosts(query: ContentQuery = {}): Promise<ContentListResponse<BlogPost>> {
    try {
      let filteredPosts = [...blogPosts];
      
      // Apply filters
      if (query.status) {
        const statuses = Array.isArray(query.status) ? query.status : [query.status];
        filteredPosts = filteredPosts.filter(p => statuses.includes(p.status));
      }
      
      if (query.categoryId) {
        filteredPosts = filteredPosts.filter(p => p.categoryIds.includes(query.categoryId!));
      }
      
      if (query.tagId) {
        filteredPosts = filteredPosts.filter(p => p.tagIds.includes(query.tagId!));
      }
      
      if (query.authorId) {
        filteredPosts = filteredPosts.filter(p => p.authorId === query.authorId);
      }
      
      if (query.search) {
        const searchTerm = query.search.toLowerCase();
        filteredPosts = filteredPosts.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.content.toLowerCase().includes(searchTerm) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm))
        );
      }
      
      if (query.dateFrom) {
        filteredPosts = filteredPosts.filter(p => p.createdAt >= query.dateFrom!);
      }
      
      if (query.dateTo) {
        filteredPosts = filteredPosts.filter(p => p.createdAt <= query.dateTo!);
      }
      
      // Apply sorting
      const sortBy = query.sortBy || 'updatedAt';
      const sortOrder = query.sortOrder || 'desc';
      
      filteredPosts.sort((a, b) => {
        let aValue: any = a[sortBy as keyof BlogPost];
        let bValue: any = b[sortBy as keyof BlogPost];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
      
      // Apply pagination
      const page = query.page || 1;
      const limit = query.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      // Populate related data for each post
      const populatedPosts = await Promise.all(
        paginatedPosts.map(post => this.populatePostData(post))
      );
      
      return {
        success: true,
        data: populatedPosts,
        pagination: {
          page,
          limit,
          total: filteredPosts.length,
          totalPages: Math.ceil(filteredPosts.length / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        error: error instanceof Error ? error.message : 'Failed to get blog posts',
      };
    }
  }
  
  // Categories
  static async createCategory(categoryData: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentAPIResponse<ContentCategory>> {
    try {
      const now = new Date().toISOString();
      const id = generateId();
      const slug = categoryData.slug || generateSlug(categoryData.name);
      
      const category: ContentCategory = {
        ...categoryData,
        id,
        slug,
        createdAt: now,
        updatedAt: now,
      };
      
      categories.push(category);
      
      return {
        success: true,
        data: category,
        message: 'Category created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create category',
      };
    }
  }
  
  static async getCategories(): Promise<ContentListResponse<ContentCategory>> {
    try {
      return {
        success: true,
        data: categories,
        pagination: {
          page: 1,
          limit: categories.length,
          total: categories.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        error: error instanceof Error ? error.message : 'Failed to get categories',
      };
    }
  }
  
  // Tags
  static async createTag(tagData: Omit<ContentTag, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentAPIResponse<ContentTag>> {
    try {
      const now = new Date().toISOString();
      const id = generateId();
      const slug = tagData.slug || generateSlug(tagData.name);
      
      const tag: ContentTag = {
        ...tagData,
        id,
        slug,
        createdAt: now,
        updatedAt: now,
      };
      
      tags.push(tag);
      
      return {
        success: true,
        data: tag,
        message: 'Tag created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create tag',
      };
    }
  }
  
  static async getTags(): Promise<ContentListResponse<ContentTag>> {
    try {
      return {
        success: true,
        data: tags,
        pagination: {
          page: 1,
          limit: tags.length,
          total: tags.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        error: error instanceof Error ? error.message : 'Failed to get tags',
      };
    }
  }
  
  // Search
  static async searchContent(searchQuery: string, filters: Partial<ContentQuery> = {}): Promise<ContentListResponse<ContentSearchResult>> {
    try {
      const results: ContentSearchResult[] = [];
      const query = searchQuery.toLowerCase();
      
      // Search blog posts
      for (const post of blogPosts) {
        let relevanceScore = 0;
        let highlightedContent = '';
        
        if (post.title.toLowerCase().includes(query)) {
          relevanceScore += 10;
        }
        
        if (post.content.toLowerCase().includes(query)) {
          relevanceScore += 5;
          // Extract highlighted snippet
          const contentLower = post.content.toLowerCase();
          const index = contentLower.indexOf(query);
          if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(post.content.length, index + query.length + 50);
            highlightedContent = post.content.substring(start, end);
          }
        }
        
        if (relevanceScore > 0) {
          results.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            type: 'post',
            relevanceScore,
            highlightedContent,
          });
        }
      }
      
      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      return {
        success: true,
        data: results,
        pagination: {
          page: 1,
          limit: results.length,
          total: results.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        error: error instanceof Error ? error.message : 'Failed to search content',
      };
    }
  }
  
  // Helper methods
  private static async populatePostData(post: BlogPost): Promise<BlogPost> {
    const author = authors.find(a => a.id === post.authorId);
    const postCategories = categories.filter(c => post.categoryIds.includes(c.id));
    const postTags = tags.filter(t => post.tagIds.includes(t.id));
    
    return {
      ...post,
      author,
      categories: postCategories,
      tags: postTags,
    };
  }
  
  private static async createRevision(post: BlogPost, changeDescription: string): Promise<void> {
    const revision: ContentRevision = {
      id: generateId(),
      postId: post.id,
      version: post.version,
      title: post.title,
      content: post.content,
      contentMarkdown: post.contentMarkdown,
      authorId: post.authorId,
      createdAt: new Date().toISOString(),
      changeDescription,
    };
    
    revisions.push(revision);
  }
}

// Helper functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (blogPosts.some(p => p.slug === slug && p.id !== excludeId)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

function initializeDefaultData(): void {
  // Initialize default author
  const defaultAuthor: BlogAuthor = {
    id: 'author-1',
    name: 'Laser Cutting Expert',
    email: 'expert@lasercalc.com',
    bio: 'Professional laser cutting specialist with 10+ years of experience',
  };
  authors.push(defaultAuthor);
  
  // Initialize default categories
  const defaultCategories: ContentCategory[] = [
    {
      id: 'cat-1',
      name: 'Tutorials',
      slug: 'tutorials',
      description: 'Step-by-step guides and tutorials',
      color: '#3B82F6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-2',
      name: 'Tips & Tricks',
      slug: 'tips-tricks',
      description: 'Professional tips and best practices',
      color: '#10B981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  categories.push(...defaultCategories);
  
  // Initialize default tags
  const defaultTags: ContentTag[] = [
    {
      id: 'tag-1',
      name: 'Beginner',
      slug: 'beginner',
      description: 'Content suitable for beginners',
      color: '#F59E0B',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tag-2',
      name: 'Advanced',
      slug: 'advanced',
      description: 'Advanced techniques and concepts',
      color: '#EF4444',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  tags.push(...defaultTags);
}
