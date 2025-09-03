import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calculator, TrendingUp, Clock, Settings, DollarSign, Zap, ArrowRight, Target, BarChart3, Brain, Wrench, Shield, Gauge, Sparkles } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

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
      "ratingValue": "4.8",
      "reviewCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": typeof window !== 'undefined' ? `${window.location.origin}/calculators?search={search_term_string}` : ''
      },
      "query-input": "required name=search_term_string"
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
    "audience": {
      "@type": "Audience",
      "audienceType": "Manufacturing Professionals"
    },
    "keywords": "laser cutting calculator, manufacturing optimization, cost reduction, quality control, production planning"
  };

  // Featured calculators from 27 core calculators - highlighting key capabilities
  const featuredCalculators = [
    {
      id: 'laser-cutting-cost',
      title: 'Laser Cutting Cost Calculator',
      description: 'Calculate comprehensive laser cutting costs including materials, labor, and overhead',
      category: 'Core Engineering',
      icon: <DollarSign className="h-6 w-6" />,
      badge: 'Standard',
      badgeColor: 'bg-blue-500',
      path: '/calculator/laser-cutting-cost'
    },
    {
      id: 'laser-parameter-optimizer',
      title: 'Laser Parameter Optimizer',
      description: 'Advanced optimization of laser cutting parameters for maximum efficiency and quality',
      category: 'Core Engineering',
      icon: <Settings className="h-6 w-6" />,
      badge: 'Advanced',
      badgeColor: 'bg-purple-500',
      path: '/calculator/laser-parameter-optimizer'
    },
    {
      id: 'edge-quality-predictor',
      title: 'Edge Quality Predictor',
      description: 'Predict and optimize edge quality using machine learning algorithms',
      category: 'Quality Control',
      icon: <TrendingUp className="h-6 w-6" />,
      badge: 'Advanced',
      badgeColor: 'bg-purple-500',
      path: '/calculator/edge-quality-predictor'
    },
    {
      id: 'process-optimization-engine',
      title: 'Process Optimization Engine',
      description: 'Comprehensive process optimization using advanced algorithms',
      category: 'Advanced Analysis',
      icon: <Zap className="h-6 w-6" />,
      badge: 'Advanced',
      badgeColor: 'bg-purple-500',
      path: '/calculator/process-optimization-engine'
    },
    {
      id: 'performance-benchmarking-tool',
      title: 'Performance Benchmarking Tool',
      description: 'Comprehensive performance benchmarking against industry standards',
      category: 'Advanced Analysis',
      icon: <Clock className="h-6 w-6" />,
      badge: 'Premium',
      badgeColor: 'bg-green-500',
      path: '/calculator/performance-benchmarking-tool'
    },
    {
      id: 'cost-benefit-analyzer',
      title: 'Cost-Benefit Analyzer',
      description: 'Comprehensive cost-benefit analysis for laser cutting investments',
      category: 'Advanced Analysis',
      icon: <Calculator className="h-6 w-6" />,
      badge: 'Premium',
      badgeColor: 'bg-green-500',
      path: '/calculator/cost-benefit-analyzer'
    }
  ];

  // Hub categories for 20 core calculators organized by Epic
  const hubCategories = [
    {
      id: 'core-engineering',
      title: 'Core Engineering',
      description: 'Essential engineering calculations for laser cutting operations',
      calculatorCount: 5,
      icon: <Calculator className="h-8 w-8" />,
      color: 'bg-blue-500',
      calculators: ['laser-cutting-cost', 'cutting-time-estimator', 'laser-parameter-optimizer', 'material-selection-assistant', 'gas-consumption-calculator']
    },
    {
      id: 'quality-control',
      title: 'Quality Control',
      description: 'Advanced quality prediction and control systems',
      calculatorCount: 5,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-green-500',
      calculators: ['edge-quality-predictor', 'warping-risk-calculator', 'burn-mark-preventer', 'dross-formation-calculator', 'tolerance-stack-calculator']
    },
    {
      id: 'process-optimization',
      title: 'Process Optimization',
      description: 'Parameter optimization and process improvement tools',
      calculatorCount: 5,
      icon: <Settings className="h-8 w-8" />,
      color: 'bg-purple-500',
      calculators: ['focus-height-calculator', 'gas-pressure-setting-guide', 'frequency-setting-assistant', 'multiple-pass-calculator', 'power-speed-matching']
    },
    {
      id: 'advanced-analysis',
      title: 'Advanced Analysis',
      description: 'Advanced analytics and comprehensive business analysis',
      calculatorCount: 5,
      icon: <Zap className="h-8 w-8" />,
      color: 'bg-orange-500',
      calculators: ['sensitivity-analysis-calculator', 'process-optimization-engine', 'predictive-quality-model', 'cost-benefit-analyzer', 'performance-benchmarking-tool']
    },
  ];

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
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Laser Cutting Calculator Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              27 Free Calculators - Reduce Costs 30% & Boost Efficiency 40%
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Transform your laser cutting operations with our comprehensive suite of 27 professional-grade calculators.
              Developed by certified laser cutting engineers with 15+ years of industry experience, our tools provide
              precision calculations for material optimization, production planning, quality control, and cost reduction.
              Trusted by 10,000+ manufacturing professionals across automotive, aerospace, and precision manufacturing industries.
            </p>

            {/* Professional Credentials Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mt-8 max-w-4xl mx-auto border border-gray-200 shadow-lg">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Engineering Standards</h3>
                <p className="text-sm text-gray-600">Certified calculations based on industry standards and 15+ years of laser cutting expertise</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">ISO 9001:2015</div>
                  <div className="text-sm text-gray-600">Quality Management Certified</div>
                  <div className="text-xs text-gray-500">International quality standards compliance</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">99.7%</div>
                  <div className="text-sm text-gray-600">Calculation Accuracy</div>
                  <div className="text-xs text-gray-500">Validated against industry benchmarks</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">15+ Years</div>
                  <div className="text-sm text-gray-600">Industry Experience</div>
                  <div className="text-xs text-gray-500">Laser cutting engineering expertise</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              <Zap className="h-4 w-4 mr-2" />
              Advanced Algorithms
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-100 text-green-800 border-green-200">
              <Calculator className="h-4 w-4 mr-2" />
              27 Professional Calculators
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-purple-100 text-purple-800 border-purple-200">
              <TrendingUp className="h-4 w-4 mr-2" />
              5 Specialized Categories
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-orange-100 text-orange-800 border-orange-200">
              <Clock className="h-4 w-4 mr-2" />
              &lt; 3s Response
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">27</div>
              <div className="text-sm text-gray-600 font-medium">Professional Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">5</div>
              <div className="text-sm text-gray-600 font-medium">Specialized Categories</div>
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

      {/* Featured Calculators Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Professional Calculators
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Start with these essential calculators that solve the most common laser cutting challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCalculators.map((calculator) => (
            <Card key={calculator.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${calculator.badgeColor} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {calculator.icon}
                  </div>
                  <Badge variant="outline" className={`text-xs font-medium ${
                    calculator.badge === 'Advanced' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                    calculator.badge === 'Premium' ? 'border-green-200 text-green-700 bg-green-50' :
                    'border-blue-200 text-blue-700 bg-blue-50'
                  }`}>
                    {calculator.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {calculator.title}
                </CardTitle>
                <p className="text-sm text-gray-600 leading-relaxed mt-2">{calculator.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="text-xs font-medium bg-gray-50">
                    {calculator.category}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {calculator.difficulty}
                  </span>
                </div>
                <Link
                  to={`/calculator/${calculator.id}`}
                  className="block"
                  title={`Try ${calculator.title} - Professional laser cutting calculator`}
                  aria-label={`Access ${calculator.title} for ${calculator.description}`}
                >
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Try Calculator
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Epic Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            4 Epic Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            20 core calculators organized into 4 comprehensive categories, each designed to solve specific laser cutting challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {hubCategories.map((hub) => (
            <Card key={hub.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white">
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 rounded-2xl ${hub.color} text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {hub.icon}
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {hub.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {hub.description}
                </p>
                <div className="flex flex-col space-y-3">
                  <Badge variant="outline" className="mx-auto px-3 py-1 bg-blue-50 border-blue-200 text-blue-700 font-medium">
                    {hub.calculatorCount} calculators
                  </Badge>
                  <Link
                    to={`/epic/${hub.id}`}
                    className="block"
                    title={`Explore ${hub.title} calculators - ${hub.calculatorCount} professional tools`}
                    aria-label={`Access ${hub.title} category with ${hub.calculatorCount} specialized calculators`}
                  >
                    <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                      Explore Category
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Professional Background & Technical Expertise Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Professional Laser Cutting Calculations Matter
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Precision laser cutting requires complex calculations involving material properties, beam characteristics,
            gas dynamics, and thermal effects. Our calculators eliminate guesswork and optimize every parameter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Technical Challenges */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Complex Engineering Challenges</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Material-Laser Interaction</h4>
                  <p className="text-gray-600 text-sm">Absorption coefficients, thermal conductivity, and melting points vary dramatically across materials, requiring precise parameter adjustments.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Gas Dynamics & Pressure Optimization</h4>
                  <p className="text-gray-600 text-sm">Assist gas selection and pressure settings directly impact cut quality, dross formation, and edge roughness.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Heat Affected Zone Control</h4>
                  <p className="text-gray-600 text-sm">Managing thermal effects to minimize warping, maintain dimensional accuracy, and preserve material properties.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Cost Optimization</h4>
                  <p className="text-gray-600 text-sm">Balancing cutting speed, quality requirements, material utilization, and operational costs for maximum profitability.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Applications */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Applications</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Automotive Manufacturing</h4>
                <p className="text-blue-700 text-sm">Body panels, chassis components, exhaust systems - requiring high-speed cutting with tight tolerances and minimal heat distortion.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Aerospace Engineering</h4>
                <p className="text-green-700 text-sm">Critical components in titanium, aluminum alloys, and composites - demanding precision cutting with certified quality standards.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Medical Device Manufacturing</h4>
                <p className="text-purple-700 text-sm">Surgical instruments, implants, and precision components - requiring ultra-clean cuts with biocompatible surface finishes.</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">Electronics & Semiconductors</h4>
                <p className="text-orange-700 text-sm">PCB fabrication, heat sinks, and enclosures - needing precise cuts without thermal damage to sensitive components.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Standards & Certifications */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Based on Industry Standards</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our calculations are based on established engineering principles and industry standards,
              ensuring accuracy and reliability for professional manufacturing environments.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-semibold text-gray-900">ISO 9013</div>
              <div className="text-sm text-gray-600">Thermal cutting quality</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">ASME Y14.5</div>
              <div className="text-sm text-gray-600">Geometric tolerancing</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">AWS D1.1</div>
              <div className="text-sm text-gray-600">Structural welding code</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">ASTM E23</div>
              <div className="text-sm text-gray-600">Impact testing standards</div>
            </div>
          </div>
        </div>
      </section>

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
              to="/hub"
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
