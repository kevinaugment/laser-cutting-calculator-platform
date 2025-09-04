/**
 * Featured Calculators Section for HomePage
 * 
 * Displays the most popular and essential calculators with lazy loading.
 */

import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calculator, Clock, Settings, DollarSign, Zap, ArrowRight } from 'lucide-react';

// Lazy load calculator metadata to reduce initial bundle
const CalculatorMetadata = lazy(() => import('../../data/coreCalculatorConfigs').then(module => ({
  default: { coreCalculatorMetadata: module.coreCalculatorMetadata }
})));

const LoadingCard = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </CardContent>
  </Card>
);

// Featured calculators - hardcoded to avoid loading all metadata
const featuredCalculators = [
  {
    id: 'laser-cutting-cost',
    title: 'Laser Cutting Cost Calculator',
    description: 'Calculate precise cutting costs including material, energy, gas, and labor expenses with advanced optimization algorithms.',
    icon: <DollarSign className="h-6 w-6" />,
    category: 'Cost & Pricing',
    difficulty: 'Beginner',
    estimatedTime: '2-3 minutes',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'cutting-time-estimator',
    title: 'Cutting Time Estimator',
    description: 'Estimate cutting time based on material properties, thickness, cutting speed, and path complexity.',
    icon: <Clock className="h-6 w-6" />,
    category: 'Time & Efficiency',
    difficulty: 'Beginner',
    estimatedTime: '1-2 minutes',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'laser-parameter-optimizer',
    title: 'Laser Parameter Optimizer',
    description: 'Optimize laser parameters (power, speed, frequency) for different materials and thicknesses.',
    icon: <Settings className="h-6 w-6" />,
    category: 'Parameters & Settings',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 minutes',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'material-nesting-optimizer',
    title: 'Material Nesting Optimizer',
    description: 'Optimize material usage and reduce waste with intelligent nesting algorithms and layout planning.',
    icon: <Zap className="h-6 w-6" />,
    category: 'Quality & Optimization',
    difficulty: 'Advanced',
    estimatedTime: '4-5 minutes',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'production-capacity-planner',
    title: 'Production Capacity Planner',
    description: 'Plan production capacity, schedule jobs, and optimize machine utilization for maximum efficiency.',
    icon: <Calculator className="h-6 w-6" />,
    category: 'Business & ROI',
    difficulty: 'Intermediate',
    estimatedTime: '3-4 minutes',
    color: 'from-teal-500 to-green-600'
  },
  {
    id: 'edge-quality-predictor',
    title: 'Edge Quality Predictor',
    description: 'Predict and optimize edge quality based on cutting parameters, material properties, and machine settings.',
    icon: <Settings className="h-6 w-6" />,
    category: 'Quality & Optimization',
    difficulty: 'Advanced',
    estimatedTime: '4-5 minutes',
    color: 'from-pink-500 to-rose-600'
  }
];

export const FeaturedCalculators: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Most Popular Calculators
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Start with these essential tools used by thousands of professionals daily.
          Each calculator provides instant results with detailed explanations and optimization recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredCalculators.map((calculator) => (
          <Link
            key={calculator.id}
            to={`/calculator/${calculator.id}`}
            className="block group"
            title={`${calculator.title} - ${calculator.description}`}
            aria-label={`Access ${calculator.title} for ${calculator.category.toLowerCase()}`}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-1 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${calculator.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {calculator.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {calculator.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {calculator.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {calculator.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {calculator.category}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {calculator.estimatedTime}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                >
                  Calculate Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/calculators"
          title="View All 27 Professional Laser Cutting Calculators"
          aria-label="Browse complete collection of 27 specialized calculators"
        >
          <Button size="lg" variant="outline" className="px-8 py-3">
            View All 27 Calculators
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedCalculators;
