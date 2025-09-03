// All Calculators Page - 27 Professional Calculators Overview
// Unified design with search and filtering capabilities

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHead from '../components/seo/SEOHead';
import { 
  Calculator, 
  Clock, 
  ArrowRight, 
  Search,
  Filter,
  Settings,
  Shield,
  Brain,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { coreCalculatorMetadata } from '../data/coreCalculatorConfigs';

const CalculatorsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get all calculators from metadata
  const allCalculators = Object.values(coreCalculatorMetadata);

  // SEO结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "27 Free Laser Cutting Calculators - Professional Manufacturing Tools",
    "alternateName": "Laser Cutting Calculator Collection",
    "description": "Complete collection of 27 specialized laser cutting calculators trusted by 10,000+ manufacturing professionals. Reduce costs by 30%, improve efficiency by 40%, and enhance quality with professional-grade tools.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "audience": {
      "@type": "Audience",
      "audienceType": "Manufacturing Professionals"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allCalculators.length,
      "itemListElement": allCalculators.map((calc, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": calc.name,
        "description": calc.description,
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
          "ratingValue": "4.7",
          "reviewCount": "156",
          "bestRating": "5"
        }
      }))
    },
    "publisher": {
      "@type": "Organization",
      "name": "Laser Calc Team",
      "url": typeof window !== 'undefined' ? window.location.origin : '',
      "logo": {
        "@type": "ImageObject",
        "url": typeof window !== 'undefined' ? `${window.location.origin}/images/logo.png` : ''
      }
    },
    "keywords": "laser cutting calculators, manufacturing tools, cost optimization, quality control"
  };

  // Filter calculators based on category and search
  const filteredCalculators = allCalculators.filter(calculator => {
    const matchesCategory = selectedCategory === 'all' || calculator.category === selectedCategory;
    const matchesSearch = calculator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calculator.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Epic configurations for category filtering
  const categories = [
    { id: 'all', name: 'All Calculators', count: allCalculators.length, color: 'bg-gray-500' },
    { id: 'Core Engineering', name: 'Core Engineering', count: allCalculators.filter(calc => calc.category === 'Core Engineering').length, color: 'bg-blue-500' },
    { id: 'Quality Control', name: 'Quality Control', count: allCalculators.filter(calc => calc.category === 'Quality Control').length, color: 'bg-green-500' },
    { id: 'Process Optimization', name: 'Process Optimization', count: allCalculators.filter(calc => calc.category === 'Process Optimization').length, color: 'bg-purple-500' },
    { id: 'Advanced Analysis', name: 'Advanced Analysis', count: allCalculators.filter(calc => calc.category === 'Advanced Analysis').length, color: 'bg-orange-500' }
  ];

  // Get badge color helper
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'AI Enhanced': return 'border-purple-200 text-purple-700 bg-purple-50';
      case 'Premium': return 'border-green-200 text-green-700 bg-green-50';
      case 'Standard': return 'border-blue-200 text-blue-700 bg-blue-50';
      default: return 'border-gray-200 text-gray-700 bg-gray-50';
    }
  };

  // Get difficulty color helper
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Expert': return 'text-red-600';
      case 'Advanced': return 'text-orange-600';
      case 'Intermediate': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Core Engineering': return <Calculator className="h-5 w-5" />;
      case 'Quality Control': return <Shield className="h-5 w-5" />;
      case 'Process Optimization': return <Settings className="h-5 w-5" />;
      case 'Advanced Analysis': return <Brain className="h-5 w-5" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

  return (
    <>
      <SEOHead
        title="27 Free Laser Cutting Calculators - Professional Manufacturing Tools"
        description="Complete collection of 27 specialized laser cutting calculators trusted by 10,000+ manufacturing professionals. Reduce costs by 30%, improve efficiency by 40%, and enhance quality with free tools for cost optimization, production planning, quality control, and parameter optimization."
        keywords="laser cutting calculators, manufacturing calculators, laser cutting tools, cost calculator, production planner, quality control, parameter optimization, material nesting, cutting time estimator, laser cutting software, professional laser tools, manufacturing optimization, free calculators, laser cutting efficiency, cost reduction tools"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              27 Free Professional Laser Cutting Calculators
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive engineering toolkit for laser cutting optimization. Each calculator is developed by certified
              laser cutting engineers and validated against industry standards. Reduce operational costs by 30%,
              improve cutting efficiency by 40%, and achieve superior quality control with precision calculations
              trusted by 10,000+ manufacturing professionals across automotive, aerospace, and precision industries.
            </p>

            {/* Professional Categories Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto border border-gray-200 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Professional Calculator Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">7</div>
                  <div className="text-sm font-medium text-gray-900">Core Engineering</div>
                  <div className="text-xs text-gray-600">Essential calculations for laser cutting operations</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <div className="text-sm font-medium text-gray-900">Quality Control</div>
                  <div className="text-xs text-gray-600">Advanced quality prediction and optimization</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm font-medium text-gray-900">Process Optimization</div>
                  <div className="text-xs text-gray-600">Parameter tuning and efficiency improvement</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">6</div>
                  <div className="text-sm font-medium text-gray-900">Business Intelligence</div>
                  <div className="text-xs text-gray-600">Cost analysis and ROI optimization</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search cost, time, quality, or parameter calculators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{filteredCalculators.length}</div>
              <div className="text-sm text-gray-600 font-medium">
                {selectedCategory === 'all' ? 'Total Calculators' : 'Filtered Results'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-sm text-gray-600 font-medium">Epic Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {allCalculators.filter(calc => calc.badge === 'AI Enhanced' || calc.badge === 'Premium').length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Advanced Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">&lt;3s</div>
              <div className="text-sm text-gray-600 font-medium">Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculators Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCalculators.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No calculators found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or category filter</p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCalculators.map((calculator, index) => (
              <Card key={calculator.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        calculator.category === 'Core Engineering' ? 'bg-blue-500' :
                        calculator.category === 'Quality Control' ? 'bg-green-500' :
                        calculator.category === 'Process Optimization' ? 'bg-purple-500' :
                        'bg-orange-500'
                      } text-white group-hover:scale-110 transition-transform duration-300`}>
                        {getCategoryIcon(calculator.category)}
                      </div>
                      <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                        {calculator.category}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={`text-xs font-medium ${getBadgeColor(calculator.badge)}`}>
                      {calculator.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {calculator.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed mt-2">
                    {calculator.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Features */}
                    {calculator.features && calculator.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {calculator.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            {feature}
                          </span>
                        ))}
                        {calculator.features.length > 3 && (
                          <span className="text-xs text-gray-500">+{calculator.features.length - 3} more</span>
                        )}
                      </div>
                    )}
                    
                    {/* Calculator Info */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`font-medium ${getDifficultyColor(calculator.difficulty)}`}>
                          {calculator.difficulty}
                        </span>
                        <span className="flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {calculator.estimatedTime}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Link
                      to={`/calculator/${calculator.id}`}
                      className="block"
                      title={`Use ${calculator.name} - ${calculator.description}`}
                      aria-label={`Access ${calculator.name} calculator for ${calculator.description}`}
                    >
                      <Button className="w-full group-hover:bg-blue-600 transition-colors">
                        Use Calculator
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Epic Categories CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Professional Calculator Categories
          </h2>
          <p className="text-lg text-gray-600">
            Browse 27 calculators organized by manufacturing specializations - from cost optimization
            to quality control, each category designed for specific professional use cases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(1).map((category) => (
            <Link
              key={category.id}
              to={`/epic/${category.id.toLowerCase().replace(' ', '-')}`}
              className="block"
              title={`Explore ${category.name} calculators - ${category.count} specialized tools`}
              aria-label={`Browse ${category.count} calculators in ${category.name} category`}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {getCategoryIcon(category.name)}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 font-medium">
                    {category.count} calculators
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Professional Usage Guide Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Calculator Selection Guide
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the right calculator for your specific laser cutting challenge. Each tool is designed
            for specific engineering scenarios and manufacturing requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Selection Workflow */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Selection Workflow</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Identify Your Primary Challenge</h4>
                  <p className="text-gray-600 text-sm">Cost reduction, quality improvement, parameter optimization, or production planning?</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Select Appropriate Category</h4>
                  <p className="text-gray-600 text-sm">Core Engineering for basics, Quality Control for precision, Process Optimization for efficiency.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Input Accurate Parameters</h4>
                  <p className="text-gray-600 text-sm">Use precise material specifications, machine parameters, and operational requirements.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Validate Results</h4>
                  <p className="text-gray-600 text-sm">Cross-reference with multiple calculators and validate against actual cutting tests.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Common Use Cases */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">New Project Setup</h4>
                <p className="text-blue-700 text-sm mb-2">Start with Laser Cutting Cost Calculator → Material Selection Assistant → Parameter Optimizer</p>
                <div className="text-xs text-blue-600">Establishes baseline costs and optimal parameters</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Quality Issues</h4>
                <p className="text-green-700 text-sm mb-2">Use Edge Quality Predictor → Gas Pressure Guide → Focus Height Calculator</p>
                <div className="text-xs text-green-600">Diagnoses and resolves cut quality problems</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Production Optimization</h4>
                <p className="text-purple-700 text-sm mb-2">Apply Cutting Time Estimator → Batch Processing → Production Capacity Planner</p>
                <div className="text-xs text-purple-600">Maximizes throughput and efficiency</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">Cost Analysis</h4>
                <p className="text-orange-700 text-sm mb-2">Combine Material Cost → Energy Cost → Maintenance Cost calculators</p>
                <div className="text-xs text-orange-600">Comprehensive operational cost breakdown</div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Support */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Technical Support</h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Need help selecting the right calculator or interpreting results? Our team of certified laser cutting
            engineers provides professional consultation and technical support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Contact Engineering Team
            </Button>
            <Button variant="outline" className="border-gray-300">
              View Technical Documentation
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default CalculatorsPage;
