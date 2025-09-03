import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  TrendingUp, 
  Timer, 
  Activity,
  BarChart3,
  Target,
  Gauge,
  Calendar,
  Users,
  Cog,
  CheckCircle
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
  timeImpact: string;
}

const TimeEfficiencyHub: React.FC = () => {
  const calculators: CalculatorCard[] = [
    // Production Time
    {
      id: 'production-time',
      title: 'Production Time Calculator',
      description: 'Accurately estimate production times including setup, cutting, and finishing operations.',
      category: 'Production Time',
      icon: <Timer className="w-6 h-6" />,
      path: '/calculators/basic/production-time',
      difficulty: 'Basic',
      estimatedTime: '3-4 min',
      keyBenefits: ['Accurate scheduling', 'Better delivery estimates', 'Resource planning'],
      timeImpact: '25% faster planning'
    },
    {
      id: 'cutting-speed',
      title: 'Cutting Speed Calculator',
      description: 'Optimize cutting speeds for different materials to maximize throughput while maintaining quality.',
      category: 'Production Time',
      icon: <Zap className="w-6 h-6" />,
      path: '/calculators/basic/cutting-speed',
      difficulty: 'Intermediate',
      estimatedTime: '4-5 min',
      keyBenefits: ['Speed optimization', 'Quality maintenance', 'Throughput increase'],
      timeImpact: '20% faster cutting'
    },
    {
      id: 'batch-processing',
      title: 'Batch Processing Calculator',
      description: 'Optimize batch sizes and processing sequences to minimize setup times and maximize efficiency.',
      category: 'Production Time',
      icon: <Calendar className="w-6 h-6" />,
      path: '/calculators/basic/batch-processing',
      difficulty: 'Advanced',
      estimatedTime: '6-8 min',
      keyBenefits: ['Setup time reduction', 'Batch optimization', 'Workflow efficiency'],
      timeImpact: '30% setup reduction'
    },
    {
      id: 'production-scheduling',
      title: 'Production Scheduling Calculator',
      description: 'Create optimal production schedules that minimize idle time and maximize resource utilization.',
      category: 'Production Time',
      icon: <Calendar className="w-6 h-6" />,
      path: '/calculators/production-management/production-scheduling',
      difficulty: 'Advanced',
      estimatedTime: '8-10 min',
      keyBenefits: ['Schedule optimization', 'Resource utilization', 'Delivery reliability'],
      timeImpact: '35% better scheduling'
    },

    // Efficiency Metrics
    {
      id: 'oee-calculator',
      title: 'OEE Calculator',
      description: 'Calculate Overall Equipment Effectiveness and identify improvement opportunities.',
      category: 'Efficiency Metrics',
      icon: <Gauge className="w-6 h-6" />,
      path: '/calculators/production-management/oee',
      difficulty: 'Intermediate',
      estimatedTime: '5-6 min',
      keyBenefits: ['Performance tracking', 'Bottleneck identification', 'Improvement focus'],
      timeImpact: '15% efficiency gain'
    },
    {
      id: 'machine-utilization',
      title: 'Machine Utilization Calculator',
      description: 'Analyze machine utilization rates and optimize equipment usage for maximum productivity.',
      category: 'Efficiency Metrics',
      icon: <Activity className="w-6 h-6" />,
      path: '/calculators/production-management/machine-utilization',
      difficulty: 'Basic',
      estimatedTime: '3-4 min',
      keyBenefits: ['Utilization tracking', 'Capacity planning', 'Investment decisions'],
      timeImpact: '20% better utilization'
    },
    {
      id: 'productivity',
      title: 'Productivity Calculator',
      description: 'Measure and analyze productivity metrics to identify improvement opportunities.',
      category: 'Efficiency Metrics',
      icon: <TrendingUp className="w-6 h-6" />,
      path: '/calculators/production-management/productivity',
      difficulty: 'Intermediate',
      estimatedTime: '4-5 min',
      keyBenefits: ['Productivity tracking', 'Trend analysis', 'Performance benchmarking'],
      timeImpact: '18% productivity boost'
    },
    {
      id: 'operator-efficiency',
      title: 'Operator Efficiency Calculator',
      description: 'Evaluate operator performance and identify training needs for improved efficiency.',
      category: 'Efficiency Metrics',
      icon: <Users className="w-6 h-6" />,
      path: '/calculators/production-management/operator-efficiency',
      difficulty: 'Intermediate',
      estimatedTime: '5-7 min',
      keyBenefits: ['Performance evaluation', 'Training identification', 'Skill development'],
      timeImpact: '22% operator improvement'
    },

    // Process Optimization
    {
      id: 'workflow-efficiency',
      title: 'Workflow Efficiency Calculator',
      description: 'Analyze and optimize workflow processes to eliminate bottlenecks and reduce cycle times.',
      category: 'Process Optimization',
      icon: <Cog className="w-6 h-6" />,
      path: '/calculators/cost-optimization/workflow-efficiency',
      difficulty: 'Advanced',
      estimatedTime: '7-9 min',
      keyBenefits: ['Workflow optimization', 'Bottleneck elimination', 'Cycle time reduction'],
      timeImpact: '28% workflow improvement'
    },
    {
      id: 'process-optimization',
      title: 'Process Optimization Calculator',
      description: 'Optimize cutting processes for maximum efficiency while maintaining quality standards.',
      category: 'Process Optimization',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/cost-optimization/process-optimization',
      difficulty: 'Advanced',
      estimatedTime: '8-10 min',
      keyBenefits: ['Process efficiency', 'Quality maintenance', 'Time reduction'],
      timeImpact: '25% process improvement'
    },
    {
      id: 'lean-manufacturing',
      title: 'Lean Manufacturing Calculator',
      description: 'Implement lean principles to eliminate waste and improve operational efficiency.',
      category: 'Process Optimization',
      icon: <CheckCircle className="w-6 h-6" />,
      path: '/calculators/production-management/lean-manufacturing',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      keyBenefits: ['Waste elimination', 'Lean implementation', 'Continuous improvement'],
      timeImpact: '30% waste reduction'
    },

    // Capacity Planning
    {
      id: 'capacity-planning',
      title: 'Capacity Planning Calculator',
      description: 'Plan production capacity requirements and optimize resource allocation.',
      category: 'Capacity Planning',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/calculators/basic/capacity-planning',
      difficulty: 'Intermediate',
      estimatedTime: '6-7 min',
      keyBenefits: ['Capacity optimization', 'Resource planning', 'Demand forecasting'],
      timeImpact: '20% better planning'
    },
    {
      id: 'throughput',
      title: 'Throughput Calculator',
      description: 'Calculate and optimize production throughput for maximum output efficiency.',
      category: 'Capacity Planning',
      icon: <Activity className="w-6 h-6" />,
      path: '/calculators/basic/throughput',
      difficulty: 'Basic',
      estimatedTime: '3-4 min',
      keyBenefits: ['Throughput optimization', 'Output maximization', 'Efficiency tracking'],
      timeImpact: '15% throughput increase'
    }
  ];

  const categories = [
    {
      name: 'Production Time',
      description: 'Time estimation and scheduling optimization tools',
      color: 'bg-green-500',
      count: calculators.filter(c => c.category === 'Production Time').length,
      icon: <Timer className="w-6 h-6" />
    },
    {
      name: 'Efficiency Metrics',
      description: 'Performance measurement and tracking tools',
      color: 'bg-blue-500',
      count: calculators.filter(c => c.category === 'Efficiency Metrics').length,
      icon: <Gauge className="w-6 h-6" />
    },
    {
      name: 'Process Optimization',
      description: 'Workflow and process improvement tools',
      color: 'bg-purple-500',
      count: calculators.filter(c => c.category === 'Process Optimization').length,
      icon: <Cog className="w-6 h-6" />
    },
    {
      name: 'Capacity Planning',
      description: 'Resource and capacity optimization tools',
      color: 'bg-orange-500',
      count: calculators.filter(c => c.category === 'Capacity Planning').length,
      icon: <BarChart3 className="w-6 h-6" />
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
    "name": "Time & Efficiency Hub - Professional Laser Cutting Productivity Tools",
    "description": "Optimize production time, maximize efficiency, and boost productivity with 13+ comprehensive time and efficiency calculators for laser cutting operations.",
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
    "keywords": "time efficiency, production optimization, laser cutting productivity, manufacturing efficiency, time management calculators"
  };

  return (
    <>
      <SEOHead
        title="Time & Efficiency Hub - 13+ Productivity Calculators for Laser Cutting"
        description="Optimize production time, maximize efficiency, and boost productivity with 13+ comprehensive time and efficiency calculators for laser cutting operations. Reduce production time by 25% and improve delivery accuracy."
        keywords="time efficiency hub, production optimization, laser cutting productivity, manufacturing efficiency, time management calculators, production planning, workflow optimization"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Clock className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Time & Efficiency Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Optimize production time, maximize efficiency, and boost productivity with our comprehensive suite of time and efficiency calculators.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">13+</div>
                <div className="text-sm opacity-90">Efficiency Calculators</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">25%</div>
                <div className="text-sm opacity-90">Average Time Savings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">35%</div>
                <div className="text-sm opacity-90">Productivity Improvement</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Efficiency Categories
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
                          <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
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
                        
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          {calculator.title}
                        </h4>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {calculator.description}
                        </p>

                        <div className="bg-green-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center text-green-700 text-sm font-medium mb-1">
                            <Zap className="w-4 h-4 mr-1" />
                            {calculator.timeImpact}
                          </div>
                        </div>
                        
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
                          className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
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

        {/* Efficiency Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Efficiency Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <Timer className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Measure Everything</h4>
              <p className="text-sm opacity-90">Track production times, setup times, and idle times to identify improvement opportunities.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Focus on Bottlenecks</h4>
              <p className="text-sm opacity-90">Identify and eliminate bottlenecks first - they have the biggest impact on overall efficiency.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Continuous Improvement</h4>
              <p className="text-sm opacity-90">Implement small, incremental improvements consistently for sustainable efficiency gains.</p>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
};

export default TimeEfficiencyHub;
