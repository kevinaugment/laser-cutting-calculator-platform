import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  author?: string;
  robots?: string;
  canonical?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = import.meta.env.VITE_SITE_NAME || 'Laser Cutting Calculator Platform',
  author = import.meta.env.VITE_SITE_AUTHOR || 'Laser Calc Team',
  robots = 'index, follow',
  canonical,
  structuredData
}) => {
  // 构建完整的title
  const fullTitle = title 
    ? `${title} | ${siteName}`
    : siteName;

  // 获取当前URL
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // 默认图片
  const defaultImage = '/images/laser-calc-og-image.jpg';
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      {/* 基础Meta标签 */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      
      {/* Viewport and Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Laser Calc" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph标签 */}
      <meta property="og:title" content={title || siteName} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteName} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      {import.meta.env.VITE_TWITTER_HANDLE && (
        <meta name="twitter:site" content={import.meta.env.VITE_TWITTER_HANDLE} />
      )}
      
      {/* 结构化数据 */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* 语言 */}
      <html lang={import.meta.env.VITE_SITE_LANGUAGE || 'en'} />
    </Helmet>
  );
};

export default SEOHead;
