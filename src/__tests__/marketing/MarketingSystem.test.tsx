/**
 * Marketing System Tests
 * Tests for SEO, analytics, and marketing components
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MarketingSEOHead } from '../../components/seo/MarketingSEOHead';
import { MarketingAnalytics, useMarketingAnalytics } from '../../components/analytics/MarketingAnalytics';
import { 
  generateSitemap, 
  generateRobotsTxt, 
  SitemapUtils 
} from '../../utils/sitemapGenerator';
import { 
  TARGET_KEYWORDS, 
  PAGE_SEO_CONFIG, 
  SEO_UTILS 
} from '../../config/seo';
import BlogPage from '../../pages/BlogPage';

// Test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <HelmetProvider>
        {children}
      </HelmetProvider>
    </BrowserRouter>
  );
}

// Mock component to test analytics hook
function TestAnalyticsComponent() {
  const analytics = useMarketingAnalytics();
  
  return (
    <div>
      <button 
        data-testid="track-calculator"
        onClick={() => analytics.trackCalculatorUsage('laser-cutting-cost', { material: 'steel' })}
      >
        Track Calculator
      </button>
      <button 
        data-testid="track-feature"
        onClick={() => analytics.trackFeatureUsage('export', 'pdf')}
      >
        Track Feature
      </button>
      <button 
        data-testid="track-conversion"
        onClick={() => analytics.trackConversion('signup_completed', 19)}
      >
        Track Conversion
      </button>
    </div>
  );
}

describe('SEO Configuration', () => {
  describe('Target Keywords', () => {
    it('should have primary keywords with search volume data', () => {
      expect(TARGET_KEYWORDS.primary).toHaveLength(5);
      
      const laserCuttingCalculator = TARGET_KEYWORDS.primary.find(
        k => k.keyword === 'laser cutting calculator'
      );
      
      expect(laserCuttingCalculator).toBeDefined();
      expect(laserCuttingCalculator?.volume).toBe(2400);
      expect(laserCuttingCalculator?.difficulty).toBe('medium');
    });

    it('should have secondary and long-tail keywords', () => {
      expect(TARGET_KEYWORDS.secondary.length).toBeGreaterThan(0);
      expect(TARGET_KEYWORDS.longTail.length).toBeGreaterThan(0);
      
      // Check for specific long-tail keyword
      const howToCalculate = TARGET_KEYWORDS.longTail.find(
        k => k.keyword === 'how to calculate laser cutting cost'
      );
      expect(howToCalculate).toBeDefined();
    });
  });

  describe('Page SEO Configuration', () => {
    it('should have SEO config for all main pages', () => {
      expect(PAGE_SEO_CONFIG.home).toBeDefined();
      expect(PAGE_SEO_CONFIG.calculators).toBeDefined();
      expect(PAGE_SEO_CONFIG.pricing).toBeDefined();
      expect(PAGE_SEO_CONFIG.features).toBeDefined();
    });

    it('should have proper structured data for home page', () => {
      const homeConfig = PAGE_SEO_CONFIG.home;
      
      expect(homeConfig.structuredData['@type']).toBe('WebApplication');
      expect(homeConfig.structuredData.name).toBe('Laser Cutting Calculator Platform');
      expect(homeConfig.structuredData.aggregateRating).toBeDefined();
    });

    it('should have pricing structured data with offers', () => {
      const pricingConfig = PAGE_SEO_CONFIG.pricing;
      
      expect(pricingConfig.structuredData['@type']).toBe('Product');
      expect(pricingConfig.structuredData.offers).toHaveLength(3);
      
      const freeOffer = pricingConfig.structuredData.offers[0];
      expect(freeOffer.name).toBe('Free Plan');
      expect(freeOffer.price).toBe('0');
    });
  });

  describe('SEO Utilities', () => {
    it('should generate proper titles', () => {
      const title = SEO_UTILS.generateTitle('Test Page');
      expect(title).toBe('Test Page | Laser Cutting Calculator Platform');
      
      const titleWithSiteName = SEO_UTILS.generateTitle('Test | Laser Cutting Calculator Platform');
      expect(titleWithSiteName).toBe('Test | Laser Cutting Calculator Platform');
    });

    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(200);
      const truncated = SEO_UTILS.generateDescription(longDescription, 160);
      
      expect(truncated.length).toBeLessThanOrEqual(160);
      expect(truncated.endsWith('...')).toBe(true);
    });

    it('should generate canonical URLs correctly', () => {
      const canonical = SEO_UTILS.generateCanonicalUrl('/pricing');
      expect(canonical).toBe('https://lasercalc.com/pricing');
      
      const canonicalWithSlash = SEO_UTILS.generateCanonicalUrl('pricing');
      expect(canonicalWithSlash).toBe('https://lasercalc.com/pricing');
    });

    it('should generate breadcrumbs from path', () => {
      const breadcrumbs = SEO_UTILS.generateBreadcrumbs('/calculators/laser-cutting-cost');
      
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].name).toBe('Home');
      expect(breadcrumbs[1].name).toBe('Calculators');
      expect(breadcrumbs[2].name).toBe('Laser cutting cost');
    });
  });
});

describe('MarketingSEOHead Component', () => {
  it('should render without errors', () => {
    render(
      <TestWrapper>
        <MarketingSEOHead
          title="Test Page"
          description="Test description"
          keywords={['test', 'seo']}
        />
      </TestWrapper>
    );
    
    // Component should render without throwing
    expect(true).toBe(true);
  });

  it('should set basic meta tags', () => {
    render(
      <TestWrapper>
        <MarketingSEOHead
          title="Test Page"
          description="Test description for SEO"
          keywords={['laser cutting', 'calculator', 'test']}
          canonical="/test"
        />
      </TestWrapper>
    );

    // Check if title is set (Helmet manages this)
    expect(document.title).toContain('Test Page');
  });

  it('should include structured data when provided', () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Test Page'
    };

    render(
      <TestWrapper>
        <MarketingSEOHead
          title="Test Page"
          description="Test description"
          structuredData={structuredData}
        />
      </TestWrapper>
    );

    // Check if structured data script is added
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThan(0);
  });
});

describe('Sitemap Generation', () => {
  const testConfig = {
    baseUrl: 'https://test.com',
    lastmod: '2024-01-01',
    excludePaths: [],
    includeDynamic: true
  };

  it('should generate valid XML sitemap', () => {
    const sitemap = generateSitemap(testConfig);
    
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(sitemap).toContain('</urlset>');
    expect(sitemap).toContain('<loc>https://test.com/</loc>');
  });

  it('should include calculator URLs when dynamic is enabled', () => {
    const sitemap = generateSitemap(testConfig);
    
    expect(sitemap).toContain('/calculators/laser-cutting-cost');
    expect(sitemap).toContain('/calculators/cutting-time-estimator');
  });

  it('should exclude specified paths', () => {
    const configWithExclusions = {
      ...testConfig,
      excludePaths: ['/contact']
    };
    
    const sitemap = generateSitemap(configWithExclusions);
    expect(sitemap).not.toContain('/contact');
  });

  it('should generate proper robots.txt', () => {
    const robotsTxt = generateRobotsTxt(testConfig);
    
    expect(robotsTxt).toContain('User-agent: *');
    expect(robotsTxt).toContain('Allow: /');
    expect(robotsTxt).toContain('Sitemap: https://test.com/sitemap.xml');
    expect(robotsTxt).toContain('Disallow: /admin/');
  });

  it('should generate calculator URLs correctly', () => {
    const calculatorUrls = SitemapUtils.generateCalculatorUrls('https://test.com', '2024-01-01');
    
    expect(calculatorUrls.length).toBeGreaterThan(0);
    
    const costCalculator = calculatorUrls.find(url => 
      url.loc === '/calculators/laser-cutting-cost'
    );
    
    expect(costCalculator).toBeDefined();
    expect(costCalculator?.priority).toBe(0.8);
    expect(costCalculator?.changefreq).toBe('weekly');
  });
});

describe('Marketing Analytics', () => {
  beforeEach(() => {
    // Mock gtag
    (window as any).gtag = vi.fn();
    (window as any).dataLayer = [];
  });

  afterEach(() => {
    cleanup();
    delete (window as any).gtag;
    delete (window as any).dataLayer;
  });

  it('should render analytics provider without errors', () => {
    render(
      <TestWrapper>
        <MarketingAnalytics userId="test-user" userProperties={{ user_type: 'pro' }}>
          <div>Test Content</div>
        </MarketingAnalytics>
      </TestWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide analytics functions through hook', () => {
    render(
      <TestWrapper>
        <MarketingAnalytics>
          <TestAnalyticsComponent />
        </MarketingAnalytics>
      </TestWrapper>
    );

    expect(screen.getByTestId('track-calculator')).toBeInTheDocument();
    expect(screen.getByTestId('track-feature')).toBeInTheDocument();
    expect(screen.getByTestId('track-conversion')).toBeInTheDocument();
  });
});

describe('Blog Page', () => {
  it('should render blog page without errors', () => {
    render(
      <TestWrapper>
        <BlogPage />
      </TestWrapper>
    );

    expect(screen.getByText('Laser Cutting Expertise Hub')).toBeInTheDocument();
    expect(screen.getByText('Featured Articles')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('should display sample blog posts', () => {
    render(
      <TestWrapper>
        <BlogPage />
      </TestWrapper>
    );

    expect(screen.getByText('Complete Guide to Laser Cutting Cost Optimization')).toBeInTheDocument();
    expect(screen.getByText('Laser Parameter Optimization: Science Behind Perfect Cuts')).toBeInTheDocument();
  });

  it('should have search functionality', () => {
    render(
      <TestWrapper>
        <BlogPage />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/Search articles/);
    expect(searchInput).toBeInTheDocument();
  });

  it('should display categories and tags', () => {
    render(
      <TestWrapper>
        <BlogPage />
      </TestWrapper>
    );

    expect(screen.getByText('Cost Optimization')).toBeInTheDocument();
    expect(screen.getByText('Technical Education')).toBeInTheDocument();
    expect(screen.getByText('Quality Control')).toBeInTheDocument();
  });
});
