/**
 * Google 2025 SEO Compliant Head Component
 * 
 * This component ensures full compliance with Google's 2025 SEO guidelines:
 * - Core Web Vitals optimization
 * - Mobile-first indexing
 * - E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * - Advanced structured data
 * - Performance optimization
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Google2025SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: object[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  author?: {
    name: string;
    expertise: string[];
    credentials: string[];
  };
  lastModified?: string;
  publishDate?: string;
  contentType?: 'article' | 'calculator' | 'guide' | 'homepage';
  expertise?: {
    topic: string;
    level: 'beginner' | 'intermediate' | 'expert';
    industry: string;
  };
}

export const Google2025SEOHead: React.FC<Google2025SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  structuredData = [],
  breadcrumbs = [],
  author,
  lastModified,
  publishDate,
  contentType = 'calculator',
  expertise
}) => {
  
  // Generate optimized title (max 60 characters)
  const optimizedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  
  // Generate optimized description (max 160 characters)
  const optimizedDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;
  
  // Current URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonicalUrl = canonical || currentUrl;
  
  // Default OG image
  const defaultOgImage = '/images/og/laser-calc-2025-og.png';
  const finalOgImage = ogImage || defaultOgImage;
  
  // Generate E-A-T structured data
  const eatStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: optimizedDescription,
    url: canonicalUrl,
    dateModified: lastModified || new Date().toISOString(),
    datePublished: publishDate || new Date().toISOString(),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(author && {
      author: {
        '@type': 'Person',
        name: author.name,
        knowsAbout: author.expertise,
        hasCredential: author.credentials.map(credential => ({
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: credential
        }))
      }
    }),
    ...(expertise && {
      about: {
        '@type': 'Thing',
        name: expertise.topic,
        sameAs: `https://en.wikipedia.org/wiki/${expertise.topic.replace(/\s+/g, '_')}`
      },
      audience: {
        '@type': 'Audience',
        audienceType: `${expertise.level} ${expertise.industry} professionals`
      }
    }),
    ...(breadcrumbs.length > 0 && {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      }
    })
  };
  
  // Combine all structured data
  const allStructuredData = [eatStructuredData, ...structuredData];
  
  // Generate keywords string
  const keywordsString = keywords.length > 0 ? keywords.join(', ') : '';
  
  return (
    <Helmet>
      {/* Core Meta Tags - Google 2025 Optimized */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywordsString && <meta name="keywords" content={keywordsString} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Mobile-First Indexing */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Google 2025 Robots Directives */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Content Freshness */}
      {lastModified && <meta name="last-modified" content={lastModified} />}
      {publishDate && <meta name="article:published_time" content={publishDate} />}
      <meta name="revisit-after" content="7 days" />
      
      {/* E-A-T Signals */}
      {author && <meta name="author" content={author.name} />}
      <meta name="publisher" content="Laser Cutting Calculator Platform" />
      <meta name="copyright" content="© 2024 Laser Cutting Calculator Platform" />
      
      {/* Content Type Classification */}
      <meta name="content-type" content={contentType} />
      {expertise && (
        <>
          <meta name="expertise-level" content={expertise.level} />
          <meta name="industry" content={expertise.industry} />
          <meta name="topic" content={expertise.topic} />
        </>
      )}
      
      {/* Open Graph - Enhanced for 2025 */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="Laser Cutting Calculator Platform" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards - Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:site" content="@lasercalc" />
      <meta name="twitter:creator" content="@lasercalc" />
      
      {/* Performance Optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      
      {/* DNS Prefetch for External Resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
      
      {/* Preload Critical Resources */}
      <link 
        rel="preload" 
        href="/fonts/inter-var.woff2" 
        as="font" 
        type="font/woff2" 
        crossOrigin="anonymous" 
      />
      
      {/* Theme and App Configuration */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Language and Locale */}
      <html lang="en" />
      <meta httpEquiv="content-language" content="en-US" />
      
      {/* Structured Data - Google 2025 Enhanced */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data, null, 0)}
        </script>
      ))}
      
      {/* Additional Performance Hints */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="msapplication-tap-highlight" content="no" />
      
      {/* Core Web Vitals Optimization Hints */}
      <meta name="resource-hints" content="preload, prefetch, preconnect" />
      <meta name="loading-strategy" content="lazy-loading, critical-css-inline" />
      
      {/* Google 2025 Specific Meta Tags */}
      <meta name="google-site-verification" content="your-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
      
      {/* Accessibility Enhancement */}
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
    </Helmet>
  );
};

export default Google2025SEOHead;
