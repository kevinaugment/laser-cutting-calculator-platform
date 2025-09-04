/**
 * SEO Configuration for Marketing & Growth
 * Comprehensive SEO settings optimized for search rankings and user acquisition
 */

// Target keywords by priority and search volume
export const TARGET_KEYWORDS = {
  primary: [
    { keyword: 'laser cutting calculator', volume: 2400, difficulty: 'medium' },
    { keyword: 'laser cutting cost calculator', volume: 1200, difficulty: 'low' },
    { keyword: 'laser cutting time calculator', volume: 800, difficulty: 'low' },
    { keyword: 'laser parameter calculator', volume: 600, difficulty: 'medium' },
    { keyword: 'laser cutting speed calculator', volume: 500, difficulty: 'low' }
  ],
  secondary: [
    { keyword: 'laser cutting optimization', volume: 400, difficulty: 'medium' },
    { keyword: 'laser cutting material calculator', volume: 350, difficulty: 'low' },
    { keyword: 'laser cutting efficiency calculator', volume: 300, difficulty: 'low' },
    { keyword: 'laser cutting quality calculator', volume: 250, difficulty: 'low' },
    { keyword: 'laser cutting gas calculator', volume: 200, difficulty: 'low' }
  ],
  longTail: [
    { keyword: 'how to calculate laser cutting cost', volume: 400, difficulty: 'low' },
    { keyword: 'laser cutting parameter optimization', volume: 300, difficulty: 'medium' },
    { keyword: 'laser cutting time estimation', volume: 250, difficulty: 'low' },
    { keyword: 'laser cutting material selection', volume: 200, difficulty: 'low' },
    { keyword: 'laser cutting power calculation', volume: 180, difficulty: 'low' }
  ]
};

// Page-specific SEO configurations
export const PAGE_SEO_CONFIG = {
  home: {
    title: 'Professional Laser Cutting Calculator Platform | 27 Free Tools',
    description: 'Free professional laser cutting calculators for cost analysis, time estimation, parameter optimization, and quality control. Used by 10,000+ manufacturing professionals worldwide.',
    keywords: [
      'laser cutting calculator',
      'laser cutting cost calculator',
      'manufacturing calculator',
      'laser cutting tools',
      'professional laser cutting'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Laser Cutting Calculator Platform',
      description: 'Professional laser cutting calculator platform with 27 specialized calculators',
      applicationCategory: 'CalculatorApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
        bestRating: '5',
        worstRating: '1'
      }
    }
  },
  
  calculators: {
    title: 'All Laser Cutting Calculators | 27 Professional Tools',
    description: 'Complete collection of 27 professional laser cutting calculators. Cost analysis, time estimation, parameter optimization, quality control, and production planning tools.',
    keywords: [
      'laser cutting calculators',
      'manufacturing calculators',
      'laser cutting tools collection',
      'professional calculators',
      'laser cutting software'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Laser Cutting Calculators Collection',
      description: '27 professional laser cutting calculators for manufacturing optimization',
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: 27,
        itemListElement: [] // Will be populated dynamically
      }
    }
  },
  
  pricing: {
    title: 'Pricing Plans | Professional Laser Cutting Calculator Platform',
    description: 'Choose the perfect plan for your laser cutting needs. Free tier with 5 calculators, Professional plan with all 27 calculators, and Enterprise plan with team features.',
    keywords: [
      'laser cutting calculator pricing',
      'subscription plans',
      'professional laser tools',
      'enterprise laser software',
      'calculator pricing tiers'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Laser Cutting Calculator Platform',
      description: 'Professional laser cutting calculator platform with subscription plans',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Plan',
          price: '0',
          priceCurrency: 'USD',
          description: '5 core calculators with basic features'
        },
        {
          '@type': 'Offer',
          name: 'Professional Plan',
          price: '19',
          priceCurrency: 'USD',
          description: 'All 27 calculators with advanced features'
        },
        {
          '@type': 'Offer',
          name: 'Enterprise Plan',
          price: '99',
          priceCurrency: 'USD',
          description: 'Everything plus team collaboration and API access'
        }
      ]
    }
  },
  
  features: {
    title: 'Features | Advanced Laser Cutting Calculator Platform',
    description: 'Discover advanced features of our laser cutting calculator platform: real-time calculations, parameter optimization, cost analysis, quality prediction, and more.',
    keywords: [
      'laser cutting calculator features',
      'calculator platform features',
      'laser cutting optimization',
      'manufacturing tools features',
      'professional calculator features'
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Laser Cutting Calculator Features',
      description: 'Advanced features for professional laser cutting calculations',
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'Laser Cutting Calculator Platform',
        featureList: [
          'Real-time calculations',
          'Parameter optimization',
          'Cost analysis',
          'Quality prediction',
          'Export functionality',
          'Mobile responsive',
          'Team collaboration',
          'API access'
        ]
      }
    }
  }
};

// Calculator-specific SEO templates
export const CALCULATOR_SEO_TEMPLATES = {
  cost: {
    titleTemplate: '{name} | Free Laser Cutting Cost Calculator',
    descriptionTemplate: 'Calculate laser cutting costs accurately with our professional {name}. Free tool for material costs, labor, overhead, and total project pricing.',
    keywords: ['laser cutting cost', 'cost calculator', 'pricing calculator', 'manufacturing cost']
  },
  
  time: {
    titleTemplate: '{name} | Laser Cutting Time Calculator',
    descriptionTemplate: 'Estimate laser cutting time with precision using our {name}. Optimize production schedules and improve efficiency.',
    keywords: ['cutting time', 'time estimation', 'production planning', 'efficiency calculator']
  },
  
  parameter: {
    titleTemplate: '{name} | Laser Parameter Optimization Tool',
    descriptionTemplate: 'Optimize laser cutting parameters with our professional {name}. Improve quality, reduce costs, and maximize efficiency.',
    keywords: ['laser parameters', 'parameter optimization', 'laser settings', 'cutting optimization']
  },
  
  quality: {
    titleTemplate: '{name} | Laser Cutting Quality Calculator',
    descriptionTemplate: 'Predict and improve laser cutting quality with our {name}. Professional tool for quality control and optimization.',
    keywords: ['cutting quality', 'quality control', 'quality prediction', 'laser cutting quality']
  }
};

// Meta tag configurations
export const META_TAG_CONFIG = {
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  googlebot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  bingbot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
  themeColor: '#2563eb',
  msapplicationTileColor: '#2563eb',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'default',
  appleMobileWebAppTitle: 'Laser Calc',
  applicationName: 'Laser Cutting Calculator Platform',
  msapplicationTooltip: 'Professional Laser Cutting Calculators',
  msapplicationStarturl: '/',
  msapplicationNavbuttonColor: '#2563eb'
};

// Open Graph configurations
export const OPEN_GRAPH_CONFIG = {
  siteName: 'Laser Cutting Calculator Platform',
  type: 'website',
  locale: 'en_US',
  imageWidth: 1200,
  imageHeight: 630,
  imageType: 'image/png',
  twitterCard: 'summary_large_image',
  twitterSite: '@lasercalc',
  twitterCreator: '@lasercalc'
};

// Structured data templates
export const STRUCTURED_DATA_TEMPLATES = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Laser Cutting Calculator Platform',
    url: 'https://lasercalc.com',
    logo: 'https://lasercalc.com/images/logo.png',
    description: 'Professional laser cutting calculator platform for manufacturing optimization',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-LASER-CALC',
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://twitter.com/lasercalc',
      'https://linkedin.com/company/lasercalc',
      'https://youtube.com/@lasercalc'
    ]
  },
  
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Laser Cutting Calculator Platform',
    url: 'https://lasercalc.com',
    description: 'Professional laser cutting calculators for manufacturing optimization',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://lasercalc.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  },
  
  breadcrumbList: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [] // Will be populated dynamically
  }
};

// SEO utility functions
export const SEO_UTILS = {
  generateTitle: (title: string, siteName: string = 'Laser Cutting Calculator Platform'): string => {
    return title.includes(siteName) ? title : `${title} | ${siteName}`;
  },
  
  generateDescription: (description: string, maxLength: number = 160): string => {
    return description.length > maxLength 
      ? `${description.substring(0, maxLength - 3)}...`
      : description;
  },
  
  generateKeywords: (keywords: string[], maxKeywords: number = 10): string => {
    return keywords.slice(0, maxKeywords).join(', ');
  },
  
  generateCanonicalUrl: (path: string, baseUrl: string = 'https://lasercalc.com'): string => {
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  },
  
  generateBreadcrumbs: (path: string): any[] => {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lasercalc.com'
      }
    ];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        '@type': 'ListItem',
        position: index + 2,
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
        item: `https://lasercalc.com${currentPath}`
      });
    });
    
    return breadcrumbs;
  }
};

// Performance optimization settings
export const PERFORMANCE_CONFIG = {
  preloadFonts: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ],
  
  prefetchPages: [
    '/calculators',
    '/pricing',
    '/features'
  ],
  
  preconnectDomains: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ],
  
  criticalCSS: {
    inline: true,
    extract: true,
    minify: true
  }
};

export default {
  TARGET_KEYWORDS,
  PAGE_SEO_CONFIG,
  CALCULATOR_SEO_TEMPLATES,
  META_TAG_CONFIG,
  OPEN_GRAPH_CONFIG,
  STRUCTURED_DATA_TEMPLATES,
  SEO_UTILS,
  PERFORMANCE_CONFIG
};
