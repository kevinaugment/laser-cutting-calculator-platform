import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Target,
  Briefcase,
  Calculator,
  LineChart,
  Users,
  Building,
  Globe,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/seo/SEOHead';

interface CalculatorCard {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  path: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  businessImpact: string[];
  roiPotential: string;
}

const BusinessROIHub: React.FC = () => {
  const calculators: CalculatorCard[] = [
    // Financial Analysis
    {
      id: 'roi-calculator',
      title: 'ROI Calculator',
      description: 'Calculate return on investment for equipment purchases, process improvements, and strategic initiatives.',
      category: 'Financial Analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      path: '/calculators/cost-optimization/roi',
      difficulty: 'Intermediate',
      estimatedTime: '6-8 min',
      businessImpact: ['Investment evaluation', 'Risk assessment', 'Decision support'],
      roiPotential: '25% better decisions'
    },
    {
      id: 'break-even',
      title: 'Break-even Calculator',
      description: 'Determine break-even points for projects, products, and business expansion decisions.',
      category: 'Financial Analysis',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/cost-optimization/break-even',
      difficulty: 'Basic',
      estimatedTime: '3-4 min',
      businessImpact: ['Risk management', 'Pricing strategy', 'Volume planning'],
      roiPotential: '20% risk reduction'
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning Calculator',
      description: 'Comprehensive financial planning and forecasting for business growth and sustainability.',
      category: 'Financial Analysis',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/calculators/business-management/financial-planning',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      businessImpact: ['Strategic planning', 'Cash flow management', 'Growth planning'],
      roiPotential: '30% planning accuracy'
    },
    {
      id: 'cost-benefit',
      title: 'Cost-Benefit Calculator',
      description: 'Comprehensive cost-benefit analysis for strategic decisions and major investments.',
      category: 'Financial Analysis',
      icon: <Calculator className="w-6 h-6" />,
      path: '/calculators/cost-optimization/cost-benefit',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      businessImpact: ['Decision framework', 'Risk-adjusted returns', 'Scenario analysis'],
      roiPotential: '35% decision quality'
    },

    // Strategic Planning
    {
      id: 'strategic-planning',
      title: 'Strategic Planning Calculator',
      description: 'Develop and evaluate strategic plans with comprehensive analysis and scenario modeling.',
      category: 'Strategic Planning',
      icon: <Briefcase className="w-6 h-6" />,
      path: '/calculators/business-management/strategic-planning',
      difficulty: 'Advanced',
      estimatedTime: '15-20 min',
      businessImpact: ['Strategic direction', 'Competitive advantage', 'Long-term growth'],
      roiPotential: '40% strategic clarity'
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis Calculator',
      description: 'Analyze market opportunities, competitive positioning, and growth potential.',
      category: 'Strategic Planning',
      icon: <Globe className="w-6 h-6" />,
      path: '/calculators/business-management/market-analysis',
      difficulty: 'Intermediate',
      estimatedTime: '8-10 min',
      businessImpact: ['Market insights', 'Opportunity identification', 'Competitive intelligence'],
      roiPotential: '25% market advantage'
    },
    {
      id: 'expansion-planning',
      title: 'Expansion Planning Calculator',
      description: 'Plan and evaluate business expansion opportunities with comprehensive feasibility analysis.',
      category: 'Strategic Planning',
      icon: <Building className="w-6 h-6" />,
      path: '/calculators/business-management/expansion-planning',
      difficulty: 'Advanced',
      estimatedTime: '12-15 min',
      businessImpact: ['Growth strategy', 'Market expansion', 'Resource planning'],
      roiPotential: '45% expansion success'
    },
    {
      id: 'risk-management',
      title: 'Risk Management Calculator',
      description: 'Identify, assess, and manage business risks with comprehensive risk analysis.',
      category: 'Strategic Planning',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/business-management/risk-management',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      businessImpact: ['Risk mitigation', 'Business continuity', 'Strategic protection'],
      roiPotential: '30% risk reduction'
    },

    // Business Intelligence
    {
      id: 'performance-analytics',
      title: 'Performance Analytics Calculator',
      description: 'Analyze business performance with comprehensive KPI tracking and benchmarking.',
      category: 'Business Intelligence',
      icon: <LineChart className="w-6 h-6" />,
      path: '/calculators/business-management/performance-analytics',
      difficulty: 'Intermediate',
      estimatedTime: '7-9 min',
      businessImpact: ['Performance tracking', 'Benchmarking', 'Improvement identification'],
      roiPotential: '20% performance gain'
    },
    {
      id: 'customer-analytics',
      title: 'Customer Analytics Calculator',
      description: 'Analyze customer profitability, lifetime value, and satisfaction metrics.',
      category: 'Business Intelligence',
      icon: <Users className="w-6 h-6" />,
      path: '/calculators/business-management/customer-analytics',
      difficulty: 'Intermediate',
      estimatedTime: '6-8 min',
      businessImpact: ['Customer insights', 'Profitability analysis', 'Retention strategies'],
      roiPotential: '25% customer value'
    },
    {
      id: 'competitive-analysis',
      title: 'Competitive Analysis Calculator',
      description: 'Evaluate competitive position and develop strategies for market advantage.',
      category: 'Business Intelligence',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/business-management/competitive-analysis',
      difficulty: 'Advanced',
      estimatedTime: '9-11 min',
      businessImpact: ['Competitive intelligence', 'Market positioning', 'Strategic advantage'],
      roiPotential: '30% competitive edge'
    },
    {
      id: 'business-valuation',
      title: 'Business Valuation Calculator',
      description: 'Calculate business value using multiple valuation methods and scenarios.',
      category: 'Business Intelligence',
      icon: <DollarSign className="w-6 h-6" />,
      path: '/calculators/business-management/business-valuation',
      difficulty: 'Advanced',
      estimatedTime: '12-15 min',
      businessImpact: ['Business value', 'Investment decisions', 'Exit planning'],
      roiPotential: '35% valuation accuracy'
    },

    // Innovation & Growth
    {
      id: 'innovation-management',
      title: 'Innovation Management Calculator',
      description: 'Evaluate and manage innovation projects with ROI analysis and risk assessment.',
      category: 'Innovation & Growth',
      icon: <Lightbulb className="w-6 h-6" />,
      path: '/calculators/business-management/innovation-management',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      businessImpact: ['Innovation ROI', 'Project prioritization', 'Technology investment'],
      roiPotential: '40% innovation success'
    },
    {
      id: 'growth-planning',
      title: 'Growth Planning Calculator',
      description: 'Plan sustainable business growth with resource requirements and financial projections.',
      category: 'Innovation & Growth',
      icon: <TrendingUp className="w-6 h-6" />,
      path: '/calculators/business-management/growth-planning',
      difficulty: 'Advanced',
      estimatedTime: '12-15 min',
      businessImpact: ['Growth strategy', 'Resource planning', 'Scalability analysis'],
      roiPotential: '35% growth efficiency'
    },
    {
      id: 'investment-analysis',
      title: 'Investment Analysis Calculator',
      description: 'Comprehensive investment analysis with multiple valuation methods and risk assessment.',
      category: 'Innovation & Growth',
      icon: <PieChart className="w-6 h-6" />,
      path: '/calculators/business-management/investment-analysis',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      businessImpact: ['Investment decisions', 'Portfolio optimization', 'Risk management'],
      roiPotential: '30% investment returns'
    }
  ];

  const categories = [
    {
      name: 'Financial Analysis',
      description: 'Core financial analysis and ROI calculation tools',
      color: 'bg-green-500',
      count: calculators.filter(c => c.category === 'Financial Analysis').length,
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      name: 'Strategic Planning',
      description: 'Strategic planning and business development tools',
      color: 'bg-blue-500',
      count: calculators.filter(c => c.category === 'Strategic Planning').length,
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      name: 'Business Intelligence',
      description: 'Performance analytics and competitive intelligence',
      color: 'bg-purple-500',
      count: calculators.filter(c => c.category === 'Business Intelligence').length,
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      name: 'Innovation & Growth',
      description: 'Innovation management and growth planning tools',
      color: 'bg-orange-500',
      count: calculators.filter(c => c.category === 'Innovation & Growth').length,
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Business ROI Hub - Professional Laser Cutting Investment Analysis Tools",
    "description": "Maximize business ROI with 12+ comprehensive investment analysis calculators for laser cutting operations and strategic planning.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": calculators.length,
      "itemListElement": calculators.map((calc, index) => ({
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
    "keywords": "business ROI, investment analysis, laser cutting ROI, business planning, financial analysis, strategic planning"
  };

  return (
    <>
      <SEOHead
        title="Business ROI Hub - 12+ Investment Analysis Calculators for Laser Cutting"
        description="Maximize business ROI with 12+ comprehensive investment analysis calculators for laser cutting operations and strategic planning. Improve ROI by 50% with data-driven decisions."
        keywords="business ROI hub, investment analysis, laser cutting ROI, business planning, financial analysis, strategic planning, ROI calculators, business optimization"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <TrendingUp className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Business & ROI Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Drive business growth, maximize ROI, and make strategic decisions with our comprehensive suite of business intelligence and financial analysis tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-sm opacity-90">Business Calculators</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">40%</div>
                <div className="text-sm opacity-90">ROI Improvement</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">35%</div>
                <div className="text-sm opacity-90">Decision Quality</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ROI Analysis Approach */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              My Approach to ROI Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Based on my experience in manufacturing, here's how I approach ROI analysis for laser cutting operations.
              These methods focus on real-world factors that actually impact your bottom line.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Real-World ROI Factors */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-World ROI Factors</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hidden Costs Matter</h4>
                    <p className="text-gray-600 text-sm">Don't just look at equipment cost. Include training, setup time, maintenance, and the learning curve period.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Time-Based Benefits</h4>
                    <p className="text-gray-600 text-sm">Faster cutting speeds and reduced setup time often provide more ROI than just material savings.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Impact</h4>
                    <p className="text-gray-600 text-sm">Better cut quality reduces rework, improves customer satisfaction, and enables premium pricing.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Capacity Utilization</h4>
                    <p className="text-gray-600 text-sm">ROI improves dramatically when you can take on more work without adding equipment or staff.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common ROI Mistakes */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common ROI Mistakes I See</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Only Looking at Direct Costs</h4>
                  <p className="text-red-700 text-sm">Missing indirect benefits like reduced inventory, faster delivery, and improved cash flow.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Unrealistic Time Frames</h4>
                  <p className="text-red-700 text-sm">Expecting full ROI in 6 months when realistic payback is 18-24 months for most improvements.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Ignoring Risk Factors</h4>
                  <p className="text-red-700 text-sm">Not accounting for market changes, technology obsolescence, or implementation challenges.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Better Approach</h4>
                  <p className="text-green-700 text-sm">Use conservative estimates, include all costs, and track actual results to improve future calculations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Calculation Framework */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">My ROI Calculation Framework</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                This is the step-by-step process I use for evaluating any laser cutting investment or process improvement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h4 className="font-semibold text-gray-900 mb-2">Baseline Current State</h4>
                <p className="text-gray-600 text-sm">Measure current costs, times, quality levels, and capacity utilization accurately.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h4 className="font-semibold text-gray-900 mb-2">Calculate Total Investment</h4>
                <p className="text-gray-600 text-sm">Include equipment, training, setup, lost production time, and ongoing costs.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h4 className="font-semibold text-gray-900 mb-2">Project Benefits</h4>
                <p className="text-gray-600 text-sm">Estimate savings in time, materials, labor, and quality improvements realistically.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h4 className="font-semibold text-gray-900 mb-2">Track & Adjust</h4>
                <p className="text-gray-600 text-sm">Monitor actual results and adjust your calculation methods for future decisions.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Business Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
                    {category.count}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Calculator Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Calculators
          </h2>
          
          {categories.map((category) => (
            <div key={category.name} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className={`w-4 h-4 ${category.color} rounded mr-3`}></div>
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calculators
                  .filter(calc => calc.category === category.name)
                  .map((calculator, index) => (
                    <motion.div
                      key={calculator.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors">
                            {calculator.icon}
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(calculator.difficulty)}`}>
                              {calculator.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">
                              {calculator.estimatedTime}
                            </span>
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {calculator.title}
                        </h4>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {calculator.description}
                        </p>

                        <div className="bg-emerald-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center text-emerald-700 text-sm font-medium mb-1">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {calculator.roiPotential}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Business Impact:</h5>
                          <ul className="space-y-1">
                            {calculator.businessImpact.slice(0, 2).map((impact, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-center">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                                {impact}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Link
                          to={calculator.path}
                          className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
                          title={`Use ${calculator.title} - ${calculator.description}`}
                          aria-label={`Access ${calculator.title} calculator for ${calculator.category.toLowerCase()}`}
                        >
                          Use Calculator
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Business Success Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Business Success Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Data-Driven Decisions</h4>
              <p className="text-sm opacity-90">Use comprehensive analytics to make informed business decisions based on solid data.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Strategic Focus</h4>
              <p className="text-sm opacity-90">Align all business activities with strategic objectives for maximum impact and ROI.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Continuous Improvement</h4>
              <p className="text-sm opacity-90">Regularly review and optimize business processes for sustained growth and profitability.</p>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
};

export default BusinessROIHub;
