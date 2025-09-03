import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Home, Calculator } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

const NotFoundPage: React.FC = () => {
  // 结构化数据 - WebPage with error status
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "404 - Page Not Found",
    "description": "The requested page could not be found. Explore our laser cutting calculators and tools to find what you need.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "mainEntity": {
      "@type": "Thing",
      "name": "404 Error",
      "description": "Page not found error with helpful navigation options"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": typeof window !== 'undefined' ? window.location.origin : ''
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "404 Error"
        }
      ]
    }
  };

  return (
    <>
      <SEOHead
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Explore our comprehensive laser cutting calculators and tools to find what you need for your manufacturing projects."
        keywords="404 error, page not found, laser cutting calculators, manufacturing tools, cost calculator, time estimator"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        robots="noindex, follow"
        structuredData={structuredData}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold text-muted-foreground mb-4">404</CardTitle>
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Go to Homepage</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/calculator/laser-cutting-cost" className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Start Calculating</span>
                </Link>
              </Button>
            </div>
            
            {/* What You Might Be Looking For */}
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">What You Might Be Looking For</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Cost Estimation</h4>
                    <p className="text-sm text-blue-700 mb-2">Need to quote a laser cutting job?</p>
                    <Link
                      to="/calculator/laser-cutting-cost"
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      → Laser Cutting Cost Calculator
                    </Link>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Time Planning</h4>
                    <p className="text-sm text-green-700 mb-2">How long will this job take?</p>
                    <Link
                      to="/calculator/cutting-time-estimator"
                      className="text-sm text-green-600 hover:underline font-medium"
                    >
                      → Cutting Time Estimator
                    </Link>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Machine Settings</h4>
                    <p className="text-sm text-purple-700 mb-2">Optimize your laser parameters?</p>
                    <Link
                      to="/calculator/laser-parameter-optimizer"
                      className="text-sm text-purple-600 hover:underline font-medium"
                    >
                      → Parameter Optimizer
                    </Link>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Material Choice</h4>
                    <p className="text-sm text-orange-700 mb-2">Which material should you use?</p>
                    <Link
                      to="/calculator/material-selection-assistant"
                      className="text-sm text-orange-600 hover:underline font-medium"
                    >
                      → Material Selection Assistant
                    </Link>
                  </div>
                </div>
              </div>

              {/* Browse by Category */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Browse by Category</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/hub/cost-pricing"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">$</div>
                    <div>
                      <div className="font-medium text-gray-900">Cost & Pricing</div>
                      <div className="text-sm text-gray-600">8 calculators</div>
                    </div>
                  </Link>
                  <Link
                    to="/hub/parameters-settings"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">⚙</div>
                    <div>
                      <div className="font-medium text-gray-900">Parameters & Settings</div>
                      <div className="text-sm text-gray-600">5 calculators</div>
                    </div>
                  </Link>
                  <Link
                    to="/hub/quality-optimization"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">✓</div>
                    <div>
                      <div className="font-medium text-gray-900">Quality Optimization</div>
                      <div className="text-sm text-gray-600">7 calculators</div>
                    </div>
                  </Link>
                  <Link
                    to="/hub/time-efficiency"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">⏱</div>
                    <div>
                      <div className="font-medium text-gray-900">Time & Efficiency</div>
                      <div className="text-sm text-gray-600">7 calculators</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Need Help? */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900">Need Help Finding Something?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you can't find what you're looking for, try browsing all calculators or contact me for help.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to="/calculators"
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    → View All 27 Calculators
                  </Link>
                  <Link
                    to="/contact"
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    → Contact for Support
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default NotFoundPage;
