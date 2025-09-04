/**
 * Blog Page Component
 * Content marketing hub for laser cutting education and industry insights
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Video,
  Download,
  Star,
  Eye,
  MessageCircle
} from 'lucide-react';
import { MarketingSEOHead } from '../components/seo/MarketingSEOHead';

// Blog post interface
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishedAt: Date;
  readTime: number;
  views: number;
  comments: number;
  featured: boolean;
  image: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Sample blog posts data
const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Complete Guide to Laser Cutting Cost Optimization',
    slug: 'laser-cutting-cost-optimization-guide',
    excerpt: 'Learn proven strategies to reduce laser cutting costs by up to 30% while maintaining quality. Comprehensive guide covering material selection, parameter optimization, and workflow efficiency.',
    content: '',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: '/images/authors/sarah-chen.jpg',
      bio: 'Manufacturing Engineer with 15+ years in laser cutting optimization'
    },
    category: 'Cost Optimization',
    tags: ['cost reduction', 'optimization', 'efficiency', 'ROI'],
    publishedAt: new Date('2024-01-15'),
    readTime: 12,
    views: 2847,
    comments: 23,
    featured: true,
    image: '/images/blog/cost-optimization-guide.jpg',
    seo: {
      title: 'Complete Guide to Laser Cutting Cost Optimization | Reduce Costs by 30%',
      description: 'Learn proven strategies to reduce laser cutting costs by up to 30% while maintaining quality. Expert tips on material selection, parameter optimization, and workflow efficiency.',
      keywords: ['laser cutting cost optimization', 'reduce laser cutting costs', 'manufacturing cost reduction', 'laser cutting efficiency']
    }
  },
  {
    id: '2',
    title: 'Laser Parameter Optimization: Science Behind Perfect Cuts',
    slug: 'laser-parameter-optimization-science',
    excerpt: 'Deep dive into the physics and engineering principles behind optimal laser cutting parameters. Understanding power, speed, gas pressure, and focus relationships.',
    content: '',
    author: {
      name: 'Michael Rodriguez',
      avatar: '/images/authors/michael-rodriguez.jpg',
      bio: 'Laser Systems Engineer and Technical Consultant'
    },
    category: 'Technical Education',
    tags: ['parameters', 'optimization', 'physics', 'engineering'],
    publishedAt: new Date('2024-01-10'),
    readTime: 15,
    views: 1923,
    comments: 18,
    featured: true,
    image: '/images/blog/parameter-optimization.jpg',
    seo: {
      title: 'Laser Parameter Optimization: Science Behind Perfect Cuts',
      description: 'Deep dive into the physics and engineering principles behind optimal laser cutting parameters. Master power, speed, gas pressure, and focus relationships.',
      keywords: ['laser parameter optimization', 'laser cutting parameters', 'laser cutting science', 'optimal cutting parameters']
    }
  },
  {
    id: '3',
    title: 'Quality Control in Laser Cutting: Preventing Common Defects',
    slug: 'laser-cutting-quality-control-defects',
    excerpt: 'Comprehensive guide to identifying, preventing, and solving common laser cutting quality issues. From dross formation to edge quality optimization.',
    content: '',
    author: {
      name: 'Jennifer Liu',
      avatar: '/images/authors/jennifer-liu.jpg',
      bio: 'Quality Assurance Manager in Precision Manufacturing'
    },
    category: 'Quality Control',
    tags: ['quality control', 'defects', 'troubleshooting', 'edge quality'],
    publishedAt: new Date('2024-01-05'),
    readTime: 10,
    views: 1654,
    comments: 15,
    featured: false,
    image: '/images/blog/quality-control.jpg',
    seo: {
      title: 'Quality Control in Laser Cutting: Preventing Common Defects',
      description: 'Comprehensive guide to identifying, preventing, and solving common laser cutting quality issues. Expert tips on dross formation and edge quality optimization.',
      keywords: ['laser cutting quality control', 'laser cutting defects', 'edge quality', 'dross formation']
    }
  }
];

// Blog categories
const BLOG_CATEGORIES = [
  { id: 'all', name: 'All Posts', count: 24 },
  { id: 'cost-optimization', name: 'Cost Optimization', count: 8 },
  { id: 'technical-education', name: 'Technical Education', count: 12 },
  { id: 'quality-control', name: 'Quality Control', count: 6 },
  { id: 'industry-insights', name: 'Industry Insights', count: 4 },
  { id: 'case-studies', name: 'Case Studies', count: 3 }
];

// Popular tags
const POPULAR_TAGS = [
  'optimization', 'cost reduction', 'quality control', 'parameters',
  'efficiency', 'troubleshooting', 'materials', 'automation',
  'ROI', 'best practices', 'case study', 'tutorial'
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let posts = SAMPLE_POSTS;

    // Filter by search query
    if (searchQuery) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      posts = posts.filter(post =>
        post.category.toLowerCase().replace(' ', '-') === selectedCategory
      );
    }

    // Filter by tag
    if (selectedTag) {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }

    return posts;
  }, [searchQuery, selectedCategory, selectedTag]);

  const featuredPosts = SAMPLE_POSTS.filter(post => post.featured);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Laser Cutting Calculator Blog',
    description: 'Expert insights, tutorials, and industry news for laser cutting professionals',
    url: 'https://lasercalc.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Laser Cutting Calculator Platform',
      logo: 'https://lasercalc.com/images/logo.png'
    },
    blogPost: SAMPLE_POSTS.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://lasercalc.com/blog/${post.slug}`,
      datePublished: post.publishedAt.toISOString(),
      author: {
        '@type': 'Person',
        name: post.author.name
      },
      image: `https://lasercalc.com${post.image}`,
      wordCount: post.readTime * 200 // Estimate based on read time
    }))
  };

  return (
    <>
      <MarketingSEOHead
        title="Expert Laser Cutting Blog | Tutorials, Tips & Industry Insights"
        description="Learn from laser cutting experts with our comprehensive blog. Cost optimization guides, technical tutorials, quality control tips, and industry insights for manufacturing professionals."
        keywords={[
          'laser cutting blog',
          'laser cutting tutorials',
          'manufacturing blog',
          'laser cutting tips',
          'cost optimization guides',
          'quality control tutorials'
        ]}
        structuredData={structuredData}
        canonical="/blog"
        priority="high"
        changeFreq="daily"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Laser Cutting Expertise Hub
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Learn from industry experts with comprehensive guides, tutorials, and insights 
                to optimize your laser cutting operations and boost profitability.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, tutorials, and guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {BLOG_CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-400">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTag === tag
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get weekly insights and tutorials delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button className="w-full bg-white text-blue-600 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Posts */}
              {selectedCategory === 'all' && !searchQuery && !selectedTag && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredPosts.map(post => (
                      <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-200 relative">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/blog/placeholder.jpg';
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{post.publishedAt.toLocaleDateString()}</span>
                            <Clock className="w-4 h-4 ml-4 mr-1" />
                            <span>{post.readTime} min read</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                            <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-8 h-8 rounded-full mr-3"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/authors/default-avatar.jpg';
                                }}
                              />
                              <span className="text-sm text-gray-700">{post.author.name}</span>
                            </div>
                            <Link
                              to={`/blog/${post.slug}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' ? 'Latest Articles' : 
                     BLOG_CATEGORIES.find(cat => cat.id === selectedCategory)?.name || 'Articles'}
                  </h2>
                  <span className="text-gray-500">
                    {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-6">
                  {filteredPosts.map(post => (
                    <article key={post.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/blog/placeholder.jpg';
                              }}
                            />
                          </div>
                        </div>
                        <div className="md:w-2/3">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium mr-3">
                              {post.category}
                            </span>
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{post.publishedAt.toLocaleDateString()}</span>
                            <Clock className="w-4 h-4 ml-4 mr-1" />
                            <span>{post.readTime} min read</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>{post.views.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                            <Link
                              to={`/blog/${post.slug}`}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                            >
                              Read Article
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Load More Articles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
