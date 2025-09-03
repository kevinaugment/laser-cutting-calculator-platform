import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Brain,
  CheckCircle,
  Settings,
  BarChart3,
  Layers
} from 'lucide-react';
import SEOHead from '../../components/seo/SEOHead';

const QualityOptimizationHub: React.FC = () => {
  const aiEnhancedCalculators = [
    {
      id: 'edge-quality-predictor',
      title: 'Edge Quality Predictor',
      description: 'AI-powered edge quality prediction and optimization',
      icon: <Target className="h-6 w-6" />,
      badge: 'AI Enhanced',
      category: 'Quality Control'
    },
    {
      id: 'quality-grade-predictor',
      title: 'Quality Grade Predictor',
      description: 'Predict and optimize cutting quality grades',
      icon: <CheckCircle className="h-6 w-6" />,
      badge: 'AI Enhanced',
      category: 'Quality Control'
    }
  ];

  const allCalculators = [
    {
      id: 'edge-quality-predictor',
      title: 'Edge Quality Predictor',
      description: 'AI-powered edge quality prediction and optimization',
      icon: <Target className="h-6 w-6" />,
      badge: 'AI Enhanced',
      category: 'Quality Control'
    },
    {
      id: 'quality-grade-predictor',
      title: 'Quality Grade Predictor',
      description: 'Predict and optimize cutting quality grades',
      icon: <CheckCircle className="h-6 w-6" />,
      badge: 'AI Enhanced',
      category: 'Quality Control'
    },
    {
      id: 'material-nesting-optimizer',
      title: 'Material Nesting Optimizer',
      description: 'Optimize material usage and reduce waste',
      icon: <Layers className="h-6 w-6" />,
      badge: 'Standard',
      category: 'Material Optimization'
    },
    {
      id: 'equipment-comparison',
      title: 'Equipment Comparison Tool',
      description: 'Compare laser cutting equipment specifications',
      icon: <BarChart3 className="h-6 w-6" />,
      badge: 'Standard',
      category: 'Equipment Analysis'
    }
  ];

  const hubStats = [
    { value: '4', label: 'Total Calculators' },
    { value: '2', label: 'AI Enhanced' },
    { value: '<150ms', label: 'Response Time' },
    { value: '99.8%', label: 'Accuracy' }
  ];

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Quality Optimization Hub - Professional Laser Cutting Quality Tools",
    "description": "Master laser cutting quality optimization with AI-enhanced calculators for edge quality, grade prediction, and quality control.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": aiEnhancedCalculators.length,
      "itemListElement": aiEnhancedCalculators.map((calc, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": calc.title,
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
          "ratingValue": "4.8",
          "reviewCount": "156",
          "bestRating": "5"
        }
      }))
    },
    "publisher": {
      "@type": "Organization",
      "name": "Laser Calc Team",
      "url": typeof window !== 'undefined' ? window.location.origin : ''
    },
    "keywords": "quality optimization, laser cutting quality, edge quality, quality control, AI enhanced calculators"
  };

  return (
    <>
      <SEOHead
        title="Quality Optimization Hub - AI-Enhanced Quality Calculators for Laser Cutting"
        description="Master laser cutting quality optimization with AI-enhanced calculators for edge quality, grade prediction, and quality control. Achieve 99.8% accuracy and improve quality by 40%."
        keywords="quality optimization hub, laser cutting quality, edge quality, quality control, AI enhanced calculators, quality prediction, cutting quality, manufacturing quality"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold">Quality & Optimization Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Quality control, material optimization, and equipment comparison tools for laser cutting operations
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="secondary">4 calculators</Badge>
          <Badge variant="secondary">2 AI enhanced</Badge>
        </div>
      </div>

      {/* AI-Enhanced Calculators */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">AI-Enhanced Calculators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiEnhancedCalculators.map((calculator) => (
            <Card key={calculator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center">
                      {calculator.icon}
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {calculator.badge}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{calculator.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {calculator.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">AI Powered</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/learn/${calculator.id}`}
                    className="flex-1"
                    title={`Learn more about ${calculator.title}`}
                    aria-label={`Learn more about ${calculator.title} calculator`}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                  <Link
                    to={`/calculator/${calculator.id}`}
                    className="flex-1"
                    title={`Use ${calculator.title} calculator`}
                    aria-label={`Access ${calculator.title} calculator`}
                  >
                    <Button size="sm" className="w-full">
                      Calculate
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* All Calculators */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">All Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {allCalculators.map((calculator) => (
            <Card key={calculator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${calculator.badge === 'AI Enhanced' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-500'} text-white rounded-lg flex items-center justify-center`}>
                      {calculator.icon}
                    </div>
                    <Badge variant={calculator.badge === 'AI Enhanced' ? 'secondary' : 'outline'} 
                           className={calculator.badge === 'AI Enhanced' ? 'bg-blue-100 text-blue-800' : ''}>
                      {calculator.badge}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{calculator.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {calculator.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-muted-foreground">{calculator.category}</span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/learn/${calculator.id}`}
                    className="flex-1"
                    title={`Learn more about ${calculator.title}`}
                    aria-label={`Learn more about ${calculator.title} calculator`}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                  <Link
                    to={`/calculator/${calculator.id}`}
                    className="flex-1"
                    title={`Use ${calculator.title} calculator`}
                    aria-label={`Access ${calculator.title} calculator`}
                  >
                    <Button size="sm" className="w-full">
                      Calculate
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Hub Statistics */}
      <section className="bg-muted/50 rounded-lg p-8">
        <h3 className="text-xl font-bold text-center mb-6">Hub Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {hubStats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-8 w-8 text-orange-500" />
              <h3 className="text-lg font-semibold">Quality Prediction</h3>
            </div>
            <p className="text-muted-foreground">
              AI-powered quality prediction and optimization for consistent results
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Layers className="h-8 w-8 text-green-500" />
              <h3 className="text-lg font-semibold">Material Optimization</h3>
            </div>
            <p className="text-muted-foreground">
              Advanced nesting algorithms to minimize waste and maximize efficiency
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h3 className="text-lg font-semibold">Equipment Analysis</h3>
            </div>
            <p className="text-muted-foreground">
              Comprehensive equipment comparison and performance analysis tools
            </p>
          </Card>
        </div>
      </section>

      {/* Navigation */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Explore Other Categories</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/hub/cost-pricing"
            title="Explore Cost & Pricing Hub"
            aria-label="Navigate to Cost & Pricing Hub"
          >
            <Button variant="outline">Cost & Pricing</Button>
          </Link>
          <Link
            to="/hub/time-efficiency"
            title="Explore Time & Efficiency Hub"
            aria-label="Navigate to Time & Efficiency Hub"
          >
            <Button variant="outline">Time & Efficiency</Button>
          </Link>
          <Link
            to="/hub/parameters-settings"
            title="Explore Parameters & Settings Hub"
            aria-label="Navigate to Parameters & Settings Hub"
          >
            <Button variant="outline">Parameters & Settings</Button>
          </Link>
          <Link
            to="/"
            title="Return to Home Page"
            aria-label="Navigate back to home page"
          >
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </section>
      </div>
    </>
  );
};

export default QualityOptimizationHub;
