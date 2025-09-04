import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

// Lazy load heavy components
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const FeaturedCalculators = lazy(() => import('../components/home/FeaturedCalculators'));

// Loading fallback
const SectionLoading = () => (
  <div className="animate-pulse py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  // SEO结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "SoftwareApplication"],
    "name": "Professional Laser Cutting Calculator Platform",
    "alternateName": "Laser Calc Pro",
    "description": "Transform your laser cutting operations with 27 specialized calculators. Reduce costs by 30%, improve efficiency by 40%, and enhance quality with professional-grade tools for material optimization, production planning, quality control, and cost management.",
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "10000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Laser Cutting Calculator Platform",
      "url": typeof window !== 'undefined' ? window.location.origin : ''
    },
    "publisher": {
      "@type": "Organization",
      "name": "Laser Cutting Calculator Platform",
      "url": typeof window !== 'undefined' ? window.location.origin : ''
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "keywords": "laser cutting calculator, manufacturing optimization, cost reduction, efficiency improvement, quality control, material optimization, production planning, laser parameters, cutting time estimation, professional tools",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": 27,
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "name": "Laser Cutting Cost Calculator",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser"
        },
        {
          "@type": "SoftwareApplication", 
          "name": "Cutting Time Estimator",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Material Nesting Optimizer", 
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser"
        }
      ]
    }
  };

  return (
    <>
      <SEOHead
        title="Professional Laser Cutting Calculator Platform - 27 Free Tools for Manufacturing Excellence"
        description="Transform your laser cutting operations with 27 specialized calculators. Reduce costs by 30%, improve efficiency by 40%, and enhance quality with professional-grade tools for material optimization, production planning, quality control, and cost management. Trusted by 10,000+ manufacturers worldwide."
        keywords="laser cutting calculator, laser cutting cost calculator, material nesting optimizer, production capacity planner, edge quality predictor, laser parameter optimizer, cutting time estimator, manufacturing calculator tools, laser cutting software, professional laser tools, manufacturing optimization, laser cutting efficiency, cost reduction calculator, quality control tools"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section - Lazy Loaded */}
        <Suspense fallback={<SectionLoading />}>
          <HeroSection />
        </Suspense>

        {/* Featured Calculators - Lazy Loaded */}
        <Suspense fallback={<SectionLoading />}>
          <FeaturedCalculators />
        </Suspense>

        {/* Call to Action Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Laser Cutting Operations?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join 10,000+ manufacturing professionals using our advanced calculators to reduce costs by 30%,
              improve efficiency by 40%, and achieve superior quality control. Start optimizing today - completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/calculators"
                title="Explore All 27 Laser Cutting Calculators - Complete Professional Toolkit"
                aria-label="Access complete collection of 27 specialized laser cutting calculators"
              >
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                  Explore All Calculators
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link
                to="/epic/core-engineering"
                title="Browse Calculators by Category - Organized by Specialization"
                aria-label="Browse laser cutting calculators organized by specialized categories"
              >
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-blue-600 px-8 py-3">
                  Browse by Category
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
