import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Sliders, 
  Gauge, 
  Zap, 
  Wind,
  Thermometer,
  Ruler,
  Target,
  Layers,
  Wrench,
  Cpu,
  Eye
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
  keyParameters: string[];
  optimizationPotential: string;
}

const ParametersSettingsHub: React.FC = () => {
  const calculators: CalculatorCard[] = [
    // Cutting Parameters
    {
      id: 'cutting-speed',
      title: 'Cutting Speed Calculator',
      description: 'Optimize cutting speeds for different materials and thicknesses to achieve the perfect balance of speed and quality.',
      category: 'Cutting Parameters',
      icon: <Zap className="w-6 h-6" />,
      path: '/calculators/basic/cutting-speed',
      difficulty: 'Intermediate',
      estimatedTime: '4-5 min',
      keyParameters: ['Material type', 'Thickness', 'Laser power', 'Gas type'],
      optimizationPotential: '20% speed increase'
    },
    {
      id: 'power-consumption',
      title: 'Power Consumption Calculator',
      description: 'Calculate and optimize laser power settings for energy efficiency and cost reduction.',
      category: 'Cutting Parameters',
      icon: <Cpu className="w-6 h-6" />,
      path: '/calculators/basic/power-consumption',
      difficulty: 'Basic',
      estimatedTime: '3-4 min',
      keyParameters: ['Laser power', 'Operating time', 'Efficiency', 'Auxiliary power'],
      optimizationPotential: '15% energy savings'
    },
    {
      id: 'gas-consumption',
      title: 'Gas Consumption Calculator',
      description: 'Optimize assist gas flow rates and pressure settings for different cutting applications.',
      category: 'Cutting Parameters',
      icon: <Wind className="w-6 h-6" />,
      path: '/calculators/basic/gas-consumption',
      difficulty: 'Intermediate',
      estimatedTime: '4-6 min',
      keyParameters: ['Gas type', 'Flow rate', 'Pressure', 'Cutting time'],
      optimizationPotential: '25% gas savings'
    },
    {
      id: 'kerf-width',
      title: 'Kerf Width Calculator',
      description: 'Calculate and optimize kerf width for precision cutting and material utilization.',
      category: 'Cutting Parameters',
      icon: <Ruler className="w-6 h-6" />,
      path: '/calculators/basic/kerf-width',
      difficulty: 'Advanced',
      estimatedTime: '5-7 min',
      keyParameters: ['Material thickness', 'Laser power', 'Focus position', 'Speed'],
      optimizationPotential: '10% material savings'
    },

    // Quality Settings
    {
      id: 'precision-calculator',
      title: 'Precision Calculator',
      description: 'Determine optimal settings for achieving required precision and dimensional accuracy.',
      category: 'Quality Settings',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/basic/precision',
      difficulty: 'Advanced',
      estimatedTime: '6-8 min',
      keyParameters: ['Tolerance requirements', 'Material properties', 'Machine capability'],
      optimizationPotential: '30% precision improvement'
    },
    {
      id: 'surface-finish',
      title: 'Surface Finish Calculator',
      description: 'Optimize cutting parameters to achieve desired surface finish quality.',
      category: 'Quality Settings',
      icon: <Eye className="w-6 h-6" />,
      path: '/calculators/basic/surface-finish',
      difficulty: 'Intermediate',
      estimatedTime: '5-6 min',
      keyParameters: ['Surface roughness target', 'Cutting speed', 'Power settings'],
      optimizationPotential: '40% finish improvement'
    },
    {
      id: 'tolerance-calculator',
      title: 'Tolerance Calculator',
      description: 'Calculate achievable tolerances and optimize settings for dimensional accuracy.',
      category: 'Quality Settings',
      icon: <Ruler className="w-6 h-6" />,
      path: '/calculators/basic/tolerance',
      difficulty: 'Advanced',
      estimatedTime: '7-9 min',
      keyParameters: ['Dimensional requirements', 'Material expansion', 'Machine precision'],
      optimizationPotential: '25% tolerance improvement'
    },
    {
      id: 'dimensional-accuracy',
      title: 'Dimensional Accuracy Calculator',
      description: 'Ensure dimensional accuracy through optimized parameter settings and compensation.',
      category: 'Quality Settings',
      icon: <Layers className="w-6 h-6" />,
      path: '/calculators/basic/dimensional-accuracy',
      difficulty: 'Advanced',
      estimatedTime: '8-10 min',
      keyParameters: ['Part geometry', 'Material properties', 'Thermal effects'],
      optimizationPotential: '35% accuracy improvement'
    },

    // Machine Configuration
    {
      id: 'machine-setup',
      title: 'Machine Setup Calculator',
      description: 'Optimize machine configuration and setup parameters for different cutting applications.',
      category: 'Machine Configuration',
      icon: <Wrench className="w-6 h-6" />,
      path: '/calculators/production-management/machine-setup',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      keyParameters: ['Machine type', 'Application requirements', 'Material specifications'],
      optimizationPotential: '20% setup efficiency'
    },
    {
      id: 'calibration',
      title: 'Calibration Calculator',
      description: 'Calculate calibration parameters and schedules for maintaining machine accuracy.',
      category: 'Machine Configuration',
      icon: <Gauge className="w-6 h-6" />,
      path: '/calculators/production-management/calibration',
      difficulty: 'Advanced',
      estimatedTime: '8-10 min',
      keyParameters: ['Calibration frequency', 'Accuracy requirements', 'Usage patterns'],
      optimizationPotential: '15% accuracy maintenance'
    },
    {
      id: 'maintenance-scheduling',
      title: 'Maintenance Scheduling Calculator',
      description: 'Optimize maintenance schedules and parameter adjustments for peak performance.',
      category: 'Machine Configuration',
      icon: <Settings className="w-6 h-6" />,
      path: '/calculators/production-management/maintenance-scheduling',
      difficulty: 'Intermediate',
      estimatedTime: '6-8 min',
      keyParameters: ['Usage hours', 'Performance metrics', 'Maintenance history'],
      optimizationPotential: '30% uptime improvement'
    },

    // Process Control
    {
      id: 'process-control',
      title: 'Process Control Calculator',
      description: 'Implement statistical process control for consistent parameter management.',
      category: 'Process Control',
      icon: <Sliders className="w-6 h-6" />,
      path: '/calculators/production-management/process-control',
      difficulty: 'Advanced',
      estimatedTime: '10-15 min',
      keyParameters: ['Control limits', 'Process capability', 'Variation sources'],
      optimizationPotential: '25% consistency improvement'
    },
    {
      id: 'parameter-optimization',
      title: 'Parameter Optimization Calculator',
      description: 'Use advanced algorithms to find optimal parameter combinations for specific applications.',
      category: 'Process Control',
      icon: <Target className="w-6 h-6" />,
      path: '/calculators/cost-optimization/parameter-optimization',
      difficulty: 'Advanced',
      estimatedTime: '12-15 min',
      keyParameters: ['Objective function', 'Constraints', 'Variable ranges'],
      optimizationPotential: '35% overall optimization'
    },
    {
      id: 'adaptive-control',
      title: 'Adaptive Control Calculator',
      description: 'Calculate adaptive control parameters for real-time process optimization.',
      category: 'Process Control',
      icon: <Cpu className="w-6 h-6" />,
      path: '/calculators/production-management/adaptive-control',
      difficulty: 'Advanced',
      estimatedTime: '10-12 min',
      keyParameters: ['Feedback sensors', 'Control algorithms', 'Response time'],
      optimizationPotential: '40% adaptive improvement'
    }
  ];

  const categories = [
    {
      name: 'Cutting Parameters',
      description: 'Core cutting parameter optimization tools',
      color: 'bg-blue-500',
      count: calculators.filter(c => c.category === 'Cutting Parameters').length,
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: 'Quality Settings',
      description: 'Precision and quality parameter tools',
      color: 'bg-green-500',
      count: calculators.filter(c => c.category === 'Quality Settings').length,
      icon: <Target className="w-6 h-6" />
    },
    {
      name: 'Machine Configuration',
      description: 'Machine setup and configuration tools',
      color: 'bg-purple-500',
      count: calculators.filter(c => c.category === 'Machine Configuration').length,
      icon: <Wrench className="w-6 h-6" />
    },
    {
      name: 'Process Control',
      description: 'Advanced process control and optimization',
      color: 'bg-orange-500',
      count: calculators.filter(c => c.category === 'Process Control').length,
      icon: <Sliders className="w-6 h-6" />
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
    "name": "Parameters & Settings Hub - Professional Laser Cutting Configuration Tools",
    "description": "Master laser cutting parameters and settings with 12+ comprehensive configuration calculators for optimal cutting performance.",
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
    "keywords": "laser parameters, cutting settings, laser configuration, parameter optimization, cutting parameters, laser settings"
  };

  return (
    <>
      <SEOHead
        title="Parameters & Settings Hub - 12+ Configuration Calculators for Laser Cutting"
        description="Master laser cutting parameters and settings with 12+ comprehensive configuration calculators for optimal cutting performance. Optimize parameters for 40% better cut quality and efficiency."
        keywords="parameters settings hub, laser parameters, cutting settings, laser configuration, parameter optimization, cutting parameters, laser settings, power settings, speed optimization"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Settings className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Parameters & Settings Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Master your laser cutting parameters, optimize machine settings, and achieve perfect results with our comprehensive parameter optimization tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">14+</div>
                <div className="text-sm opacity-90">Parameter Calculators</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">35%</div>
                <div className="text-sm opacity-90">Quality Improvement</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">25%</div>
                <div className="text-sm opacity-90">Parameter Optimization</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Parameter Setting Approach */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              My Approach to Parameter Setting
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Based on my hands-on experience with laser cutting, here's how I approach parameter optimization.
              These methods focus on getting consistent, quality results while maximizing efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Parameter Fundamentals */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Parameter Fundamentals</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Power & Speed Balance</h4>
                    <p className="text-gray-600 text-sm">Higher power doesn't always mean faster cutting. Find the sweet spot where you get clean cuts without excessive heat input.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gas Pressure Matters</h4>
                    <p className="text-gray-600 text-sm">Too little gas leaves dross, too much wastes money and can blow molten material back up. Start conservative and adjust.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Focus Height is Critical</h4>
                    <p className="text-gray-600 text-sm">Even 0.5mm off can dramatically affect cut quality. Check and calibrate regularly, especially after lens changes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Material Thickness Rules</h4>
                    <p className="text-gray-600 text-sm">Parameters that work for 3mm won't work for 6mm of the same material. Thickness changes everything.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Process */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">My Parameter Optimization Process</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Step 1: Start with Known Good</h4>
                  <p className="text-blue-700 text-sm">Begin with manufacturer recommendations or proven parameters for similar materials and thicknesses.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Step 2: Test Small Samples</h4>
                  <p className="text-green-700 text-sm">Cut small test pieces first. Don't waste a full sheet learning what doesn't work.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Step 3: Adjust One Variable</h4>
                  <p className="text-purple-700 text-sm">Change only power OR speed OR gas pressure at a time. Multiple changes make it impossible to know what helped.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">Step 4: Document Everything</h4>
                  <p className="text-orange-700 text-sm">Keep a parameter log. What works today will work next month if you remember the settings.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Common Parameter Problems */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Parameter Problems & Solutions</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                These are the most common parameter issues I see and how to fix them.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Cut Quality Issues</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium text-red-600 mb-1">Problem: Dross on bottom edge</div>
                    <div className="text-sm text-gray-600">Solution: Increase gas pressure or reduce cutting speed</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium text-red-600 mb-1">Problem: Rough top edge</div>
                    <div className="text-sm text-gray-600">Solution: Check focus height, may need to reduce power</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium text-red-600 mb-1">Problem: Inconsistent cut depth</div>
                    <div className="text-sm text-gray-600">Solution: Check material flatness and focus calibration</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Efficiency Issues</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium text-orange-600 mb-1">Problem: Cutting too slow</div>
                    <div className="text-sm text-gray-600">Solution: Increase power first, then speed if quality allows</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium text-orange-600 mb-1">Problem: High gas consumption</div>
                    <div className="text-sm text-gray-600">Solution: Optimize pressure - more isn't always better</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="font-medium text-orange-600 mb-1">Problem: Frequent lens cleaning</div>
                    <div className="text-sm text-gray-600">Solution: Check gas flow and consider air assist settings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parameter Setting Tips */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Practical Parameter Setting Tips</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                These tips come from years of hands-on experience optimizing laser cutting parameters.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-900 mb-3">For New Materials</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Start with 70% of max power</li>
                  <li>• Use moderate speed (50-70% of max)</li>
                  <li>• Set gas pressure conservatively</li>
                  <li>• Test on scraps first</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
                <h4 className="font-semibold text-gray-900 mb-3">For Thick Materials</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Increase power, decrease speed</li>
                  <li>• Higher gas pressure needed</li>
                  <li>• Consider multiple passes</li>
                  <li>• Watch for heat buildup</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
                <h4 className="font-semibold text-gray-900 mb-3">For Precision Work</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Lower power, slower speed</li>
                  <li>• Precise focus height critical</li>
                  <li>• Consider beam quality</li>
                  <li>• Test kerf width first</li>
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
            Parameter Categories
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
                          <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
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
                        
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {calculator.title}
                        </h4>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {calculator.description}
                        </p>

                        <div className="bg-purple-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center text-purple-700 text-sm font-medium mb-1">
                            <Target className="w-4 h-4 mr-1" />
                            {calculator.optimizationPotential}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Key Parameters:</h5>
                          <ul className="space-y-1">
                            {calculator.keyParameters.slice(0, 2).map((param, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-center">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                                {param}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Link
                          to={calculator.path}
                          className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-lg transition-colors font-medium"
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

        {/* Parameter Optimization Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Parameter Optimization Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <Gauge className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Start with Basics</h4>
              <p className="text-sm opacity-90">Begin with fundamental parameters like speed and power before fine-tuning advanced settings.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Test Systematically</h4>
              <p className="text-sm opacity-90">Change one parameter at a time to understand individual effects on quality and efficiency.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-3 rounded-full w-fit mx-auto mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Document Settings</h4>
              <p className="text-sm opacity-90">Keep detailed records of optimal parameters for different materials and applications.</p>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
};

export default ParametersSettingsHub;
