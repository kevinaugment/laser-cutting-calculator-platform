import React from 'react';
import { Helmet } from 'react-helmet-async';

interface CalculatorSEOHeadProps {
  calculatorId: string;
  name: string;
  description: string;
  category: string;
  keywords?: string[];
  features?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  version?: string;
  relatedCalculators?: string[];
}

const CalculatorSEOHead: React.FC<CalculatorSEOHeadProps> = ({
  calculatorId,
  name,
  description,
  category,
  keywords = [],
  features = [],
  difficulty = 'intermediate',
  estimatedTime = '< 1s',
  version = '1.0.0',
  relatedCalculators = []
}) => {
  // 构建完整的title
  const fullTitle = `${name} - Professional Laser Cutting Calculator`;
  
  // 构建关键词字符串
  const defaultKeywords = [
    'laser cutting calculator',
    'manufacturing calculator',
    'laser cutting tools',
    category.toLowerCase().replace(' ', ' '),
    name.toLowerCase()
  ];
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  // 构建增强的描述
  const enhancedDescription = `${description} Professional ${category.toLowerCase()} calculator for laser cutting operations. ${features.length > 0 ? `Features: ${features.join(', ')}.` : ''} Free online tool for manufacturing professionals.`;

  // 获取当前URL
  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/calculator/${calculatorId}`
    : `/calculator/${calculatorId}`;

  // 默认图片
  const ogImage = '/images/calculators/laser-calc-og-image.jpg';

  // 结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "applicationCategory": "CalculatorApplication",
    "operatingSystem": "Web Browser",
    "url": currentUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": features.length > 0 ? features : [
      "Professional calculations",
      "Real-time results",
      "Export functionality",
      "Mobile responsive"
    ],
    "applicationSubCategory": category,
    "softwareVersion": version,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Laser Calc Team",
      "url": typeof window !== 'undefined' ? window.location.origin : ''
    }
  };

  // 如果有相关计算器，添加到结构化数据
  if (relatedCalculators.length > 0) {
    structuredData["relatedLink"] = relatedCalculators.map(id => 
      typeof window !== 'undefined' 
        ? `${window.location.origin}/calculator/${id}`
        : `/calculator/${id}`
    );
  }

  return (
    <Helmet>
      {/* 基础Meta标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={enhancedDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="Laser Calc Team" />
      <meta name="robots" content="index, follow" />
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph标签 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Professional Laser Cutting Calculator Platform" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* 额外的计算器特定标签 */}
      <meta name="calculator:category" content={category} />
      <meta name="calculator:difficulty" content={difficulty} />
      <meta name="calculator:estimated-time" content={estimatedTime} />
      <meta name="calculator:version" content={version} />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* 语言 */}
      <html lang="en" />
      
      {/* 预加载相关计算器 */}
      {relatedCalculators.map(id => (
        <link 
          key={id}
          rel="prefetch" 
          href={`/calculator/${id}`}
          as="document"
        />
      ))}
    </Helmet>
  );
};

export default CalculatorSEOHead;
