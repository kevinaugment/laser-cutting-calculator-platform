/**
 * XML Sitemap Generator
 * Generates dynamic XML sitemaps for SEO optimization
 */

import { ALL_CALCULATORS } from '../config/pricing';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
}

interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
}

interface SitemapConfig {
  baseUrl: string;
  lastmod: string;
  excludePaths?: string[];
  includeDynamic?: boolean;
}

// Static pages configuration
const STATIC_PAGES: SitemapUrl[] = [
  {
    loc: '/',
    changefreq: 'daily',
    priority: 1.0,
    images: [
      {
        loc: '/images/og/laser-calc-home-og.png',
        caption: 'Laser Cutting Calculator Platform Homepage',
        title: 'Professional Laser Cutting Calculators'
      }
    ]
  },
  {
    loc: '/calculators',
    changefreq: 'weekly',
    priority: 0.9,
    images: [
      {
        loc: '/images/og/laser-calc-calculators-og.png',
        caption: 'All 27 Professional Laser Cutting Calculators',
        title: 'Complete Calculator Collection'
      }
    ]
  },
  {
    loc: '/pricing',
    changefreq: 'monthly',
    priority: 0.8,
    images: [
      {
        loc: '/images/og/laser-calc-pricing-og.png',
        caption: 'Laser Cutting Calculator Pricing Plans',
        title: 'Subscription Plans and Pricing'
      }
    ]
  },
  {
    loc: '/features',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: '/contact',
    changefreq: 'yearly',
    priority: 0.5
  },
  {
    loc: '/privacy',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    loc: '/terms',
    changefreq: 'yearly',
    priority: 0.3
  }
];

// Calculator categories for dynamic sitemap generation
const CALCULATOR_CATEGORIES = {
  'cost-analysis': {
    name: 'Cost Analysis',
    priority: 0.9,
    changefreq: 'weekly' as const,
    calculators: [
      'laser-cutting-cost',
      'competitive-pricing-analyzer',
      'project-quoting-calculator',
      'profit-margin-calculator',
      'energy-cost-calculator',
      'gas-consumption-calculator'
    ]
  },
  'time-efficiency': {
    name: 'Time & Efficiency',
    priority: 0.8,
    changefreq: 'weekly' as const,
    calculators: [
      'cutting-time-estimator',
      'production-capacity-planner',
      'batch-processing-calculator',
      'job-queue-optimizer',
      'piercing-time-calculator',
      'setup-time-calculator'
    ]
  },
  'technical-parameters': {
    name: 'Technical Parameters',
    priority: 0.8,
    changefreq: 'weekly' as const,
    calculators: [
      'laser-parameter-optimizer',
      'power-speed-matching',
      'gas-pressure-setting',
      'focus-height-calculator',
      'frequency-setting-assistant',
      'multiple-pass-calculator',
      'kerf-width-calculator',
      'beam-quality-calculator'
    ]
  },
  'quality-control': {
    name: 'Quality Control',
    priority: 0.8,
    changefreq: 'weekly' as const,
    calculators: [
      'edge-quality-predictor',
      'warping-risk-calculator',
      'burn-mark-preventer',
      'dross-formation-calculator',
      'tolerance-stack-calculator',
      'heat-affected-zone-calculator',
      'quality-grade-calculator'
    ]
  }
};

// Generate calculator URLs
function generateCalculatorUrls(baseUrl: string, lastmod: string): SitemapUrl[] {
  const calculatorUrls: SitemapUrl[] = [];
  
  // Individual calculator pages
  ALL_CALCULATORS.forEach(calculatorId => {
    calculatorUrls.push({
      loc: `/calculators/${calculatorId}`,
      lastmod,
      changefreq: 'weekly',
      priority: 0.8,
      images: [
        {
          loc: `/images/calculators/${calculatorId}-og.png`,
          caption: `${calculatorId.replace('-', ' ')} Calculator`,
          title: `Professional ${calculatorId.replace('-', ' ')} Tool`
        }
      ]
    });
  });
  
  // Category hub pages
  Object.entries(CALCULATOR_CATEGORIES).forEach(([categoryId, category]) => {
    calculatorUrls.push({
      loc: `/calculators/category/${categoryId}`,
      lastmod,
      changefreq: category.changefreq,
      priority: category.priority,
      images: [
        {
          loc: `/images/categories/${categoryId}-og.png`,
          caption: `${category.name} Calculators`,
          title: `Professional ${category.name} Tools`
        }
      ]
    });
  });
  
  return calculatorUrls;
}

// Generate blog URLs (if blog system is implemented)
function generateBlogUrls(baseUrl: string, lastmod: string): SitemapUrl[] {
  // This would be populated from your blog/CMS system
  // For now, return static blog structure
  return [
    {
      loc: '/blog',
      changefreq: 'daily',
      priority: 0.7
    },
    {
      loc: '/blog/category/tutorials',
      changefreq: 'weekly',
      priority: 0.6
    },
    {
      loc: '/blog/category/industry-news',
      changefreq: 'daily',
      priority: 0.6
    },
    {
      loc: '/blog/category/case-studies',
      changefreq: 'monthly',
      priority: 0.6
    }
  ];
}

// Generate XML sitemap content
export function generateSitemap(config: SitemapConfig): string {
  const { baseUrl, lastmod, excludePaths = [], includeDynamic = true } = config;
  
  let allUrls: SitemapUrl[] = [...STATIC_PAGES];
  
  // Add dynamic URLs if requested
  if (includeDynamic) {
    allUrls = [
      ...allUrls,
      ...generateCalculatorUrls(baseUrl, lastmod),
      ...generateBlogUrls(baseUrl, lastmod)
    ];
  }
  
  // Filter out excluded paths
  allUrls = allUrls.filter(url => !excludePaths.includes(url.loc));
  
  // Generate XML
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';
  const urlsetClose = '</urlset>';
  
  const urlElements = allUrls.map(url => {
    const fullUrl = `${baseUrl}${url.loc}`;
    const lastmodDate = url.lastmod || lastmod;
    
    let urlXml = `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmodDate}</lastmod>`;
    
    if (url.changefreq) {
      urlXml += `
    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority) {
      urlXml += `
    <priority>${url.priority}</priority>`;
    }
    
    // Add image information
    if (url.images && url.images.length > 0) {
      url.images.forEach(image => {
        urlXml += `
    <image:image>
      <image:loc>${baseUrl}${image.loc}</image:loc>`;
        
        if (image.caption) {
          urlXml += `
      <image:caption>${escapeXml(image.caption)}</image:caption>`;
        }
        
        if (image.title) {
          urlXml += `
      <image:title>${escapeXml(image.title)}</image:title>`;
        }
        
        urlXml += `
    </image:image>`;
      });
    }
    
    urlXml += `
  </url>`;
    
    return urlXml;
  }).join('\n');
  
  return `${xmlHeader}
${urlsetOpen}
${urlElements}
${urlsetClose}`;
}

// Generate robots.txt content
export function generateRobotsTxt(config: SitemapConfig): string {
  const { baseUrl } = config;
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-calculators.xml
Sitemap: ${baseUrl}/sitemap-blog.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

# Allow important directories
Allow: /images/
Allow: /icons/
Allow: /calculators/
Allow: /blog/

# Block specific file types
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.txt$
Disallow: /*.log$

# SEO-friendly directives
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /`;
}

// Generate sitemap index for large sites
export function generateSitemapIndex(config: SitemapConfig): string {
  const { baseUrl, lastmod } = config;
  
  const sitemaps = [
    {
      loc: `${baseUrl}/sitemap-main.xml`,
      lastmod
    },
    {
      loc: `${baseUrl}/sitemap-calculators.xml`,
      lastmod
    },
    {
      loc: `${baseUrl}/sitemap-blog.xml`,
      lastmod
    }
  ];
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const sitemapIndexClose = '</sitemapindex>';
  
  const sitemapElements = sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n');
  
  return `${xmlHeader}
${sitemapIndexOpen}
${sitemapElements}
${sitemapIndexClose}`;
}

// Utility function to escape XML characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Export utility functions
export const SitemapUtils = {
  generateSitemap,
  generateRobotsTxt,
  generateSitemapIndex,
  generateCalculatorUrls,
  generateBlogUrls,
  STATIC_PAGES,
  CALCULATOR_CATEGORIES
};

export default {
  generateSitemap,
  generateRobotsTxt,
  generateSitemapIndex,
  SitemapUtils
};
