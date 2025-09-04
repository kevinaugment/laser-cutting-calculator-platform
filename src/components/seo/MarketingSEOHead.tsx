/**
 * Marketing SEO Head Component
 * Enhanced SEO component optimized for marketing and growth
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  SEO_UTILS, 
  META_TAG_CONFIG, 
  OPEN_GRAPH_CONFIG, 
  STRUCTURED_DATA_TEMPLATES,
  PERFORMANCE_CONFIG 
} from '../../config/seo';

interface MarketingSEOHeadProps {
  // Basic SEO
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  
  // Twitter
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  
  // Structured Data
  structuredData?: object | object[];
  breadcrumbs?: boolean;
  
  // Performance
  preloadResources?: string[];
  prefetchPages?: string[];
  
  // Marketing specific
  noIndex?: boolean;
  priority?: 'high' | 'medium' | 'low';
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  
  // A/B Testing
  experimentId?: string;
  variant?: string;
}

export function MarketingSEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  breadcrumbs = false,
  preloadResources = [],
  prefetchPages = [],
  noIndex = false,
  priority = 'medium',
  changeFreq = 'weekly',
  experimentId,
  variant
}: MarketingSEOHeadProps) {
  
  // Generate optimized meta content
  const optimizedTitle = SEO_UTILS.generateTitle(title);
  const optimizedDescription = SEO_UTILS.generateDescription(description);
  const optimizedKeywords = SEO_UTILS.generateKeywords(keywords);
  const canonicalUrl = canonical ? SEO_UTILS.generateCanonicalUrl(canonical) : undefined;
  
  // Current URL for Open Graph
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Default images
  const defaultOgImage = '/images/og/laser-calc-og-default.png';
  const finalOgImage = ogImage || defaultOgImage;
  const finalTwitterImage = twitterImage || finalOgImage;
  
  // Robots directive
  const robotsContent = noIndex 
    ? 'noindex, nofollow' 
    : META_TAG_CONFIG.robots;
  
  // Generate breadcrumb structured data if requested
  const breadcrumbData = breadcrumbs && typeof window !== 'undefined'
    ? {
        ...STRUCTURED_DATA_TEMPLATES.breadcrumbList,
        itemListElement: SEO_UTILS.generateBreadcrumbs(window.location.pathname)
      }
    : null;
  
  // Combine structured data
  const allStructuredData = [
    STRUCTURED_DATA_TEMPLATES.organization,
    STRUCTURED_DATA_TEMPLATES.website,
    breadcrumbData,
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [])
  ].filter(Boolean);
  
  // Performance resources
  const allPreloadResources = [...PERFORMANCE_CONFIG.preloadFonts, ...preloadResources];
  const allPrefetchPages = [...PERFORMANCE_CONFIG.prefetchPages, ...prefetchPages];
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {optimizedKeywords && <meta name="keywords" content={optimizedKeywords} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={META_TAG_CONFIG.googlebot} />
      <meta name="bingbot" content={META_TAG_CONFIG.bingbot} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content={META_TAG_CONFIG.viewport} />
      <meta name="theme-color" content={META_TAG_CONFIG.themeColor} />
      <meta name="msapplication-TileColor" content={META_TAG_CONFIG.msapplicationTileColor} />
      <meta name="apple-mobile-web-app-capable" content={META_TAG_CONFIG.appleMobileWebAppCapable} />
      <meta name="apple-mobile-web-app-status-bar-style" content={META_TAG_CONFIG.appleMobileWebAppStatusBarStyle} />
      <meta name="apple-mobile-web-app-title" content={META_TAG_CONFIG.appleMobileWebAppTitle} />
      <meta name="application-name" content={META_TAG_CONFIG.applicationName} />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || optimizedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content={OPEN_GRAPH_CONFIG.imageWidth.toString()} />
      <meta property="og:image:height" content={OPEN_GRAPH_CONFIG.imageHeight.toString()} />
      <meta property="og:image:type" content={OPEN_GRAPH_CONFIG.imageType} />
      <meta property="og:site_name" content={OPEN_GRAPH_CONFIG.siteName} />
      <meta property="og:locale" content={OPEN_GRAPH_CONFIG.locale} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={OPEN_GRAPH_CONFIG.twitterCard} />
      <meta name="twitter:site" content={OPEN_GRAPH_CONFIG.twitterSite} />
      <meta name="twitter:creator" content={OPEN_GRAPH_CONFIG.twitterCreator} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || optimizedDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Laser Cutting Calculator Platform" />
      <meta name="publisher" content="Laser Cutting Calculator Platform" />
      <meta name="copyright" content="© 2024 Laser Cutting Calculator Platform" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Sitemap Priority and Change Frequency */}
      <meta name="priority" content={priority === 'high' ? '1.0' : priority === 'medium' ? '0.8' : '0.6'} />
      <meta name="changefreq" content={changeFreq} />
      
      {/* A/B Testing Meta Tags */}
      {experimentId && <meta name="experiment-id" content={experimentId} />}
      {variant && <meta name="experiment-variant" content={variant} />}
      
      {/* Preconnect to External Domains */}
      {PERFORMANCE_CONFIG.preconnectDomains.map(domain => (
        <link key={domain} rel="preconnect" href={domain} />
      ))}
      
      {/* Preload Critical Resources */}
      {allPreloadResources.map(resource => (
        <link 
          key={resource} 
          rel="preload" 
          href={resource}
          as={resource.includes('.css') ? 'style' : resource.includes('.js') ? 'script' : 'font'}
          crossOrigin={resource.includes('fonts') ? 'anonymous' : undefined}
        />
      ))}
      
      {/* Prefetch Important Pages */}
      {allPrefetchPages.map(page => (
        <link key={page} rel="prefetch" href={page} />
      ))}
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Language and Locale */}
      <html lang="en" />
      <meta httpEquiv="content-language" content="en" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Microsoft Tiles */}
      <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Additional Performance Hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="address=no" />
      
      {/* Rich Snippets Support */}
      <meta name="thumbnail" content={finalOgImage} />
      <meta name="subject" content="Laser Cutting Calculator Platform" />
      <meta name="summary" content={optimizedDescription} />
      <meta name="classification" content="Business" />
      <meta name="category" content="Manufacturing Tools" />
      <meta name="coverage" content="Worldwide" />
      
      {/* Social Media Optimization */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      <meta name="pinterest-rich-pin" content="true" />
      <meta name="linkedin:owner" content="laser-cutting-calculator-platform" />
      
      {/* Analytics and Tracking Preparation */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="bing-site-verification" content="your-bing-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
    </Helmet>
  );
}

export default MarketingSEOHead;
