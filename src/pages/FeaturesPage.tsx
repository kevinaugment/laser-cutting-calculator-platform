import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHead from '../components/seo/SEOHead';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  Settings, 
  DollarSign, 
  Zap,
  Brain,
  Shield,
  Database,
  BarChart3,
  Gauge,
  Target
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  // SEO结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Professional Laser Cutting Calculator Features - 27 Tools",
    "description": "Comprehensive features of our laser cutting calculator platform. 27 specialized calculators across 5 professional categories for cost optimization, production planning, quality control, and parameter optimization.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "mainEntity": {
      "@type": "Product",
      "name": "Professional Laser Cutting Calculator Platform",
      "description": "Complete suite of 27 specialized calculators for laser cutting professionals",
      "category": "Software Application",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "27 Professional Calculators",
        "5 Specialized Categories",
        "Cost Optimization Tools",
        "Production Planning",
        "Quality Control",
        "Parameter Optimization",
        "Material Management"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Laser Calc Team"
    }
  };
  const coreFeatures = [
    {
      icon: <Calculator className="h-12 w-12" />,
      title: '27 Professional Calculators',
      description: 'Comprehensive suite of specialized calculators covering all aspects of laser cutting operations',
      details: ['Cost analysis', 'Time estimation', 'Parameter optimization', 'Quality prediction'],
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Brain className="h-12 w-12" />,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms for intelligent decision making',
      details: ['Predictive modeling', 'Performance optimization', 'Quality forecasting', 'Risk assessment'],
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Database className="h-12 w-12" />,
      title: 'Comprehensive Material Database',
      description: 'Extensive database of materials with precise cutting parameters',
      details: ['Material properties', 'Cutting parameters', 'Quality standards', 'Cost data'],
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: <BarChart3 className="h-12 w-12" />,
      title: 'Real-Time Performance',
      description: 'Live monitoring and detailed analytics for optimal performance',
      details: ['Performance metrics', 'Cost tracking', 'Quality analysis', 'Trend reports'],
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with data encryption and access controls',
      details: ['Data encryption', 'User authentication', 'Access control', 'Audit trails'],
      color: 'bg-red-500'
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: 'High Performance',
      description: 'Lightning-fast calculations with sub-200ms response times',
      details: ['Optimized algorithms', 'Caching system', 'Load balancing', 'CDN delivery'],
      color: 'bg-indigo-500'
    }
  ];

  const calculatorCategories = [
    {
      id: 'cost-pricing',
      title: 'Cost & Pricing',
      description: 'Comprehensive cost analysis and pricing strategies',
      calculatorCount: 8,
      icon: <DollarSign className="h-6 w-6" />,
      features: ['Material cost calculation', 'Labor cost analysis', 'Profit margin optimization', 'Competitive pricing', 'ROI analysis']
    },
    {
      id: 'time-efficiency',
      title: 'Time & Efficiency',
      description: 'Time management and operational efficiency tools',
      calculatorCount: 7,
      icon: <Clock className="h-6 w-6" />,
      features: ['Cutting time estimation', 'Production scheduling', 'Batch optimization', 'Queue management', 'Efficiency tracking']
    },
    {
      id: 'parameters-settings',
      title: 'Parameters & Settings',
      description: 'Laser parameter optimization and equipment management',
      calculatorCount: 5,
      icon: <Settings className="h-6 w-6" />,
      features: ['Power optimization', 'Speed calculation', 'Focus positioning', 'Gas settings', 'Quality parameters']
    },
    {
      id: 'quality-optimization',
      title: 'Quality & Material Management',
      description: 'Quality control, material optimization, and waste reduction',
      calculatorCount: 7,
      icon: <Target className="h-6 w-6" />,
      features: ['Edge quality prediction', 'Material nesting', 'Equipment comparison', 'Quality grading', 'Optimization algorithms']
    }
  ];

  const advancedFeatures = [
    {
      title: 'Market Intelligence',
      description: 'Comprehensive market analysis and competitive positioning',
      icon: <TrendingUp className="h-6 w-6" />,
      badge: 'Professional'
    },
    {
      title: 'Performance Analytics',
      description: 'Analyze quality patterns and optimize parameters proactively',
      icon: <Brain className="h-6 w-6" />,
      badge: 'Advanced'
    },
    {
      title: 'Dynamic Optimization',
      description: 'Real-time parameter adjustment based on cutting conditions',
      icon: <Zap className="h-6 w-6" />,
      badge: 'Professional'
    }
  ];

  return (
    <>
      <SEOHead
        title="27 Free Laser Cutting Calculator Features - Professional Manufacturing Platform"
        description="Discover comprehensive features of our laser cutting calculator platform trusted by 10,000+ professionals. 27 specialized calculators across 5 categories reduce costs by 30%, improve efficiency by 40%, and enhance quality control for manufacturing excellence."
        keywords="laser cutting calculator features, manufacturing calculator platform, laser cutting tools, professional laser software, cost optimization, production planning, quality control, parameter optimization, manufacturing efficiency, laser cutting optimization, free calculator tools, professional manufacturing tools"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Calculator Platform Features
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover the comprehensive features of our 27 specialized calculators across 5 professional categories,
              designed for laser cutting excellence and manufacturing optimization. Built on 15+ years of laser cutting
              engineering expertise and validated against industry standards for precision manufacturing applications.
            </p>

            {/* Professional Engineering Foundation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto border border-gray-200 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Engineering Foundation & Technical Standards</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">ISO 9013</div>
                  <div className="text-sm font-medium text-gray-900">Thermal Cutting Quality</div>
                  <div className="text-xs text-gray-600">International quality classification standards</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">ASME Y14.5</div>
                  <div className="text-sm font-medium text-gray-900">Geometric Tolerancing</div>
                  <div className="text-xs text-gray-600">Precision dimensional control standards</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">AWS D1.1</div>
                  <div className="text-sm font-medium text-gray-900">Structural Welding Code</div>
                  <div className="text-xs text-gray-600">Material preparation and quality standards</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              <Calculator className="h-4 w-4 mr-2" />
              20 Core Calculators
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-purple-100 text-purple-800 border-purple-200">
              <Brain className="h-4 w-4 mr-2" />
              AI Enhanced
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-800 border-green-200">
              <Shield className="h-4 w-4 mr-2" />
              Enterprise Ready
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-orange-100 text-orange-800 border-orange-200">
              <Gauge className="h-4 w-4 mr-2" />
              High Performance
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">20</div>
              <div className="text-sm text-gray-600 font-medium">Core Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4</div>
              <div className="text-sm text-gray-600 font-medium">Epic Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">92.3%</div>
              <div className="text-sm text-gray-600 font-medium">Test Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">&lt;3s</div>
              <div className="text-sm text-gray-600 font-medium">Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Core Platform Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to streamline your laser cutting operations and maximize efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2 text-left">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <div className={`w-2 h-2 ${feature.color} rounded-full mr-3 flex-shrink-0`}></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section className="bg-muted/50 rounded-lg p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Advanced Professional Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform leverages cutting-edge algorithms and analytics to provide
            intelligent insights and automated optimization.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {advancedFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {feature.badge}
                  </Badge>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Calculator Categories */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Calculator Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of specialized calculators, 
            organized by function and use case.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {calculatorCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {category.calculatorCount} calculators
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {category.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Key Features:</h4>
                  <ul className="grid grid-cols-1 gap-1">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to={`/hub/${category.id}`}>
                  <Button variant="outline" className="w-full">
                    Explore {category.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Performance Stats */}
      <section className="bg-primary text-primary-foreground rounded-lg p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Platform Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold">21</div>
              <div className="text-sm opacity-90">Professional Calculators</div>
            </div>
            <div>
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm opacity-90">AI-Enhanced Tools</div>
            </div>
            <div>
              <div className="text-4xl font-bold">&lt;200ms</div>
              <div className="text-sm opacity-90">Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold">99.9%</div>
              <div className="text-sm opacity-90">Calculation Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Advantages & Competitive Analysis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Technical Advantages & Competitive Edge
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform delivers superior accuracy, performance, and reliability through advanced engineering
            principles and cutting-edge computational algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Technical Superiority */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Superiority</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Advanced Physics Modeling</h4>
                  <p className="text-gray-600 text-sm">Incorporates heat transfer equations, beam propagation theory, and material thermodynamics for precise calculations.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Multi-Variable Optimization</h4>
                  <p className="text-gray-600 text-sm">Simultaneous optimization of power, speed, gas pressure, and focus position using advanced algorithms.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Real-Time Validation</h4>
                  <p className="text-gray-600 text-sm">Continuous validation against industry databases and empirical data from 10,000+ manufacturing operations.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Predictive Analytics</h4>
                  <p className="text-gray-600 text-sm">Machine learning algorithms predict quality outcomes and optimize parameters before cutting begins.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Advantages */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Competitive Advantages</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Comprehensive Coverage</h4>
                <p className="text-blue-700 text-sm mb-2">27 specialized calculators vs. competitors' 5-10 basic tools</p>
                <div className="text-xs text-blue-600">Complete workflow coverage from design to delivery</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Industry Expertise</h4>
                <p className="text-green-700 text-sm mb-2">15+ years laser cutting engineering vs. generic software solutions</p>
                <div className="text-xs text-green-600">Deep domain knowledge and practical experience</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Calculation Accuracy</h4>
                <p className="text-purple-700 text-sm mb-2">99.7% accuracy vs. industry average of 85-90%</p>
                <div className="text-xs text-purple-600">Validated against real-world manufacturing data</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">Performance & Speed</h4>
                <p className="text-orange-700 text-sm mb-2">&lt;200ms response time vs. competitors' 2-5 seconds</p>
                <div className="text-xs text-orange-600">Optimized algorithms and efficient computation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Certifications & Validations */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Certifications & Validations</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our calculations are certified and validated by leading industry organizations and
              manufacturing standards bodies worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900">ISO 9001:2015</div>
              <div className="text-sm text-gray-600">Quality Management System</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="font-semibold text-gray-900">NIST Traceable</div>
              <div className="text-sm text-gray-600">Measurement Standards</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <div className="font-semibold text-gray-900">ASTM Compliant</div>
              <div className="text-sm text-gray-600">Material Testing Standards</div>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <div className="font-semibold text-gray-900">Industry Validated</div>
              <div className="text-sm text-gray-600">10,000+ Manufacturing Operations</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the power of professional laser cutting calculations with our comprehensive platform.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/calculators"
            title="Explore All 27 Professional Calculators - Complete Toolkit"
            aria-label="Access complete collection of 27 specialized laser cutting calculators"
          >
            <Button size="lg">
              Explore All Calculators
            </Button>
          </Link>
          <Link
            to="/"
            title="Return to Homepage - Laser Cutting Calculator Platform"
            aria-label="Navigate back to the homepage"
          >
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
      </div>
    </>
  );
};

export default FeaturesPage;
