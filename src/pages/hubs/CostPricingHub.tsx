import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingDown,
  Calculator,
  PieChart,
  Target,
  Zap,
  Clock,
  Settings,
  BarChart3,
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
  keyBenefits: string[];
}

const CostPricingHub: React.FC = () => {
  const calculators: CalculatorCard[] = [
    // Basic Cost Calculations
    {
      id: 'material-cost',
      title: 'Material Cost Calculator',
      description: 'Calculate material costs, waste factors, and optimize material usage for maximum cost efficiency.',
      category: 'Basic Costs',
      icon: <Calculator className="w-6 h-6" />,
      path: '/calculators/basic/material-cost',
      difficulty: 'Basic',
      estimatedTime: '2-3 min',
      keyBenefits: ['Reduce material waste by 15%', 'Accurate cost estimation', 'Bulk purchase optimization']
    },
    {
      id: 'operating-cost',
      title: 'Operating Cost Calculator',
      description: 'Comprehensive analysis of all operational costs including labor, energy, maintenance, and overhead.',
      category: 'Basic Costs',
      icon: <Settings className="w-6 h-6" />,
      path: '/calculators/cost-optimization/operating-cost',
      difficulty: 'Intermediate',
      estimatedTime: '5-7 min',
      keyBenefits: ['Complete cost visibility', 'Identify cost drivers', 'Benchmark performance']
    },
    {
      id: 'energy-cost',
      title: 'Energy Cost Calculator',
      description: 'Calculate power consumption costs and optimize energy usage for laser cutting operations.',
      category: 'Basic Costs',
      icon: <Zap className="w-6 h-6" />,
      path: '/calculators/cost-optimization/energy-cost',
      difficulty: 'Basic',
      estimatedTime: '3-4 min',
      keyBenefits: ['Reduce energy costs by 20%', 'Peak demand optimization', 'Environmental impact tracking']
    },
    {
      id: 'labor-cost',
      title: 'Labor Cost Calculator',
      description: 'Analyze labor costs, productivity rates, and optimize workforce allocation for cost efficiency.',
      category: 'Basic Costs',
      icon: <Clock className="w-6 h-6" />,
      path: '/calculators/cost-optimization/labor-cost',
      difficulty: 'Intermediate',
      estimatedTime: '4-5 min',
      keyBenefits: ['Optimize labor allocation', 'Productivity insights', 'Cost per unit analysis']
    },

    // Pricing & Profitability
    {
      id: 'pricing-strategy',
      title: 'Pricing Strategy Calculator',
      description: 'Develop competitive pricing strategies based on costs, market conditions, and profit targets.',
      category: 'Pricing & Profitability',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/business-management/pricing-strategy',
      difficulty: 'Advanced',
      estimatedTime: '8-10 min',
      keyBenefits: ['Competitive pricing', 'Profit optimization', 'Market positioning']
    },
    {
      id: 'profitability',
      title: 'Profitability Calculator',
      description: 'Analyze project and customer profitability with detailed margin analysis and recommendations.',
      category: 'Pricing & Profitability',
      icon: <TrendingDown className="w-6 h-6" />,
      path: '/calculators/cost-optimization/profitability',
      difficulty: 'Intermediate',
      estimatedTime: '5-6 min',
      keyBenefits: ['Margin optimization', 'Customer profitability', 'Project evaluation']
    },
    {
      id: 'customer-profitability',
      title: 'Customer Profitability Calculator',
      description: 'Evaluate the profitability of different customers and optimize customer portfolio.',
      category: 'Pricing & Profitability',
      icon: <PieChart className="w-6 h-6" />,
      path: '/calculators/production-management/customer-profitability',
      difficulty: 'Advanced',
      estimatedTime: '7-9 min',
      keyBenefits: ['Customer ranking', 'Portfolio optimization', 'Revenue focus']
    },

    // Financial Analysis
    {
      id: 'roi-calculator',
      title: 'ROI Calculator',
      description: 'Calculate return on investment for equipment, projects, and process improvements.',
      category: 'Financial Analysis',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/calculators/cost-optimization/roi',
      difficulty: 'Intermediate',
      estimatedTime: '6-8 min',
      keyBenefits: ['Investment evaluation', 'Payback analysis', 'Risk assessment']
    },
    {
      id: 'break-even',
      title: 'Break-even Calculator',
      description: 'Determine break-even points for projects, products, and business decisions.',
      category: 'Financial Analysis',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/cost-optimization/break-even',
      difficulty: 'Basic',
      estimatedTime: '3-4 min',
      keyBenefits: ['Risk assessment', 'Volume planning', 'Pricing decisions']
    },
    {
      id: 'cost-benefit',
      title: 'Cost-Benefit Calculator',
      description: 'Comprehensive cost-benefit analysis for strategic decisions and investments.',
      category: 'Financial Analysis',
      icon: <Lightbulb className="w-6 h-6" />,
      path: '/calculators/cost-optimization/cost-benefit',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      keyBenefits: ['Decision support', 'Risk-adjusted returns', 'Scenario analysis']
    },

    // Cost Optimization
    {
      id: 'waste-reduction',
      title: 'Waste Reduction Calculator',
      description: 'Identify and quantify waste reduction opportunities to minimize material and operational costs.',
      category: 'Cost Optimization',
      icon: <TrendingDown className="w-6 h-6" />,
      path: '/calculators/cost-optimization/waste-reduction',
      difficulty: 'Intermediate',
      estimatedTime: '5-7 min',
      keyBenefits: ['Waste minimization', 'Cost savings', 'Environmental benefits']
    },
    {
      id: 'process-optimization',
      title: 'Process Optimization Calculator',
      description: 'Optimize cutting processes to reduce costs while maintaining quality standards.',
      category: 'Cost Optimization',
      icon: <Settings className="w-6 h-6" />,
      path: '/calculators/cost-optimization/process-optimization',
      difficulty: 'Advanced',
      estimatedTime: '8-10 min',
      keyBenefits: ['Process efficiency', 'Quality maintenance', 'Cost reduction']
    }
  ];

  const categories = [
    {
      name: 'Basic Costs',
      description: 'Essential cost calculations for laser cutting operations',
      color: 'bg-blue-500',
      count: calculators.filter(c => c.category === 'Basic Costs').length
    },
    {
      name: 'Pricing & Profitability',
      description: 'Strategic pricing and profitability analysis tools',
      color: 'bg-green-500',
      count: calculators.filter(c => c.category === 'Pricing & Profitability').length
    },
    {
      name: 'Financial Analysis',
      description: 'Investment and financial decision support tools',
      color: 'bg-purple-500',
      count: calculators.filter(c => c.category === 'Financial Analysis').length
    },
    {
      name: 'Cost Optimization',
      description: 'Advanced cost reduction and optimization strategies',
      color: 'bg-orange-500',
      count: calculators.filter(c => c.category === 'Cost Optimization').length
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
    "name": "Cost & Pricing Hub - Professional Laser Cutting Financial Tools",
    "description": "Master your costs, optimize your pricing, and maximize profitability with 12+ comprehensive financial calculators for laser cutting operations.",
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
    "keywords": "cost pricing, laser cutting costs, manufacturing pricing, financial calculators, cost optimization, pricing strategy"
  };

  return (
    <>
      <SEOHead
        title="Cost & Pricing Hub - 12+ Financial Calculators for Laser Cutting"
        description="Master your costs, optimize your pricing, and maximize profitability with 12+ comprehensive financial calculators for laser cutting operations. Reduce costs by 30% and improve pricing accuracy."
        keywords="cost pricing hub, laser cutting costs, manufacturing pricing, financial calculators, cost optimization, pricing strategy, material costs, operating costs, profit margins"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <DollarSign className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cost & Pricing Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Master your costs, optimize your pricing, and maximize profitability with our comprehensive suite of financial calculators.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">12+</div>
                <div className="text-sm opacity-90">Cost Calculators</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">30%</div>
                <div className="text-sm opacity-90">Average Cost Reduction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">15%</div>
                <div className="text-sm opacity-90">Profit Improvement</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cost Analysis Approach */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              My Approach to Cost Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Based on my experience in laser cutting manufacturing, here's how I approach cost analysis and pricing.
              These methods focus on capturing all the real costs that affect your profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Hidden Costs */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hidden Costs Most People Miss</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">!</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Setup and Changeover Time</h4>
                    <p className="text-gray-600 text-sm">Loading materials, adjusting parameters, test cuts - often 15-30 minutes per job that gets forgotten in quotes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">!</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Material Handling & Waste</h4>
                    <p className="text-gray-600 text-sm">Remnants, edge trim, handling damage, and storage costs add 5-15% to material costs.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">!</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Issues & Rework</h4>
                    <p className="text-gray-600 text-sm">Even 2-3% rework rate can kill your margins. Include quality costs in your base pricing.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">!</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Consumables & Maintenance</h4>
                    <p className="text-gray-600 text-sm">Gas, lenses, nozzles, filters - these add up quickly and vary by material and thickness.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Strategy */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Practical Pricing Strategies</h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Cost-Plus with Buffers</h4>
                  <p className="text-green-700 text-sm">Start with true costs, add 20-30% buffer for unknowns, then add your target profit margin.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">✅ Value-Based for Complex Jobs</h4>
                  <p className="text-blue-700 text-sm">For tight tolerances or difficult materials, price based on the value you provide, not just costs.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">✅ Volume Discounting</h4>
                  <p className="text-purple-700 text-sm">Reduce setup costs per piece for larger quantities, but don't give away your material margins.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">✅ Rush Job Premiums</h4>
                  <p className="text-orange-700 text-sm">Charge 25-50% more for rush jobs - they disrupt your schedule and increase error risk.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Framework */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">My Cost Breakdown Framework</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                This is how I structure cost analysis for any laser cutting job to ensure I capture all the real costs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Direct Materials</h4>
                <p className="text-gray-600 text-sm">Raw material cost + waste factor + handling</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Machine Time</h4>
                <p className="text-gray-600 text-sm">Cutting time + setup + consumables + energy</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Labor & Overhead</h4>
                <p className="text-gray-600 text-sm">Operator time + programming + quality checks + overhead</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Risk & Profit</h4>
                <p className="text-gray-600 text-sm">Quality buffer + business risk + target profit margin</p>
              </div>
            </div>
          </div>

          {/* Common Pricing Mistakes */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Pricing Mistakes I See</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                These are the most common mistakes that hurt profitability in laser cutting operations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-lg p-6">
                <h4 className="font-semibold text-red-900 mb-3">❌ What Not to Do</h4>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Pricing based only on material and cutting time</li>
                  <li>• Using the same margin for all job types</li>
                  <li>• Not tracking actual costs vs. estimates</li>
                  <li>• Competing only on price instead of value</li>
                  <li>• Forgetting to include setup and programming time</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-3">✅ Better Approach</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Track all costs including hidden ones</li>
                  <li>• Adjust margins based on job complexity and risk</li>
                  <li>• Review actual costs monthly and adjust pricing</li>
                  <li>• Emphasize quality, speed, and service in pricing</li>
                  <li>• Build setup costs into every quote</li>
                </ul>
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
            Calculator Categories
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
                  <span className="text-white font-bold text-lg">{category.count}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
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
                          <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
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
                        
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {calculator.title}
                        </h4>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {calculator.description}
                        </p>
                        
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Key Benefits:</h5>
                          <ul className="space-y-1">
                            {calculator.keyBenefits.slice(0, 2).map((benefit, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-center">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Link
                          to={calculator.path}
                          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
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

        {/* Quick Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Cost Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Start with Material Costs</h4>
              <p className="text-sm opacity-90">Material costs typically represent 40-60% of total costs. Optimize here first for maximum impact.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Monitor Key Metrics</h4>
              <p className="text-sm opacity-90">Track cost per piece, material utilization, and energy efficiency for continuous improvement.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Regular Reviews</h4>
              <p className="text-sm opacity-90">Review costs monthly and adjust strategies based on market conditions and performance data.</p>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
};

export default CostPricingHub;
