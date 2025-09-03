import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DollarSign, Clock, Settings, TrendingUp, Brain, Zap } from 'lucide-react';

interface HubPageProps {
  hubType: 'cost-pricing' | 'time-efficiency' | 'parameters-settings' | 'quality-optimization' | 'business-roi';
}

const HubPage: React.FC<HubPageProps> = ({ hubType }) => {
  const hubConfig = {
    'cost-pricing': {
      title: 'Cost & Pricing Hub',
      description: 'Comprehensive cost analysis and pricing strategies for laser cutting operations',
      icon: <DollarSign className="h-8 w-8" />,
      color: 'bg-blue-500',
      calculators: [
        {
          id: 'competitive-pricing',
          title: 'Competitive Pricing Analysis',
          description: 'Advanced competitive pricing analysis with market data',
          badge: 'Professional',
          featured: true,
        },
        {
          id: 'value-based-pricing',
          title: 'Value-Based Pricing',
          description: 'Dynamic value capture optimization with detailed analysis',
          badge: 'Advanced',
          featured: true,
        },
        {
          id: 'profit-margin-optimizer',
          title: 'Profit Margin Optimizer',
          description: 'Optimize profit margins with scenario analysis',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'break-even-analysis',
          title: 'Break-Even Analysis',
          description: 'Comprehensive break-even calculations',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'cost-plus-pricing',
          title: 'Cost-Plus Pricing',
          description: 'Traditional cost-plus pricing with benchmarks',
          badge: 'Standard',
          featured: false,
        },
      ],
    },
    'time-efficiency': {
      title: 'Time & Efficiency Hub',
      description: 'Time management and operational efficiency optimization tools',
      icon: <Clock className="h-8 w-8" />,
      color: 'bg-green-500',
      calculators: [
        {
          id: 'setup-time-optimizer',
          title: 'Setup Time Optimizer',
          description: 'AI-powered setup time optimization',
          badge: 'AI Enhanced',
          featured: true,
        },
        {
          id: 'job-scheduling-optimizer',
          title: 'Job Scheduling Optimizer',
          description: 'Advanced scheduling algorithms',
          badge: 'AI Enhanced',
          featured: true,
        },
        {
          id: 'workflow-optimizer',
          title: 'Workflow Optimizer',
          description: 'Bottleneck analysis and workflow optimization',
          badge: 'AI Enhanced',
          featured: true,
        },
        {
          id: 'downtime-analyzer',
          title: 'Downtime Analyzer',
          description: 'Predictive downtime analysis',
          badge: 'AI Enhanced',
          featured: true,
        },
        {
          id: 'batch-optimizer',
          title: 'Batch Optimizer',
          description: 'AI batch configuration optimization',
          badge: 'AI Enhanced',
          featured: true,
        },
      ],
    },
    'parameters-settings': {
      title: 'Parameters & Settings Hub',
      description: 'Laser parameter optimization and quality control tools',
      icon: <Settings className="h-8 w-8" />,
      color: 'bg-purple-500',
      calculators: [
        {
          id: 'power-speed-matching',
          title: 'Power-Speed Matching',
          description: 'Optimize power and speed combinations',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'gas-pressure-setting',
          title: 'Gas Pressure Setting',
          description: 'Optimal gas pressure calculations',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'focus-height',
          title: 'Focus Height Calculator',
          description: 'Precise focus height optimization',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'frequency-setting',
          title: 'Frequency Setting',
          description: 'Pulse frequency optimization',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'multiple-pass',
          title: 'Multiple Pass Calculator',
          description: 'Multi-pass cutting optimization',
          badge: 'Standard',
          featured: false,
        },
      ],
    },
    'quality-optimization': {
      title: 'Quality & Optimization Hub',
      description: 'Quality control, material optimization, and equipment comparison tools',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-orange-500',
      calculators: [
        {
          id: 'edge-quality-predictor',
          title: 'Edge Quality Predictor',
          description: 'Advanced edge quality prediction and optimization analysis',
          badge: 'Professional',
          featured: true,
        },
        {
          id: 'quality-grade-predictor',
          title: 'Quality Grade Predictor',
          description: 'Predict and optimize cutting quality grades with detailed analysis',
          badge: 'Advanced',
          featured: true,
        },
        {
          id: 'material-nesting-optimizer',
          title: 'Material Nesting Optimizer',
          description: 'Optimize material usage and reduce waste',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'equipment-comparison',
          title: 'Equipment Comparison Tool',
          description: 'Compare laser cutting equipment specifications',
          badge: 'Standard',
          featured: false,
        },
      ],
    },
    'business-roi': {
      title: 'Business & ROI Hub',
      description: 'Business analysis and return on investment tools',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-orange-500',
      calculators: [
        {
          id: 'equipment-roi',
          title: 'Equipment ROI Calculator',
          description: 'Calculate equipment return on investment',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'customer-profitability',
          title: 'Customer Profitability',
          description: 'Analyze customer profitability',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'market-expansion',
          title: 'Market Expansion',
          description: 'Market expansion analysis',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'capacity-planning',
          title: 'Capacity Planning',
          description: 'Production capacity planning',
          badge: 'Standard',
          featured: false,
        },
        {
          id: 'financial-planning',
          title: 'Financial Planning',
          description: 'Comprehensive financial planning',
          badge: 'Standard',
          featured: false,
        },
      ],
    },
  };

  const currentHub = hubConfig[hubType];
  const featuredCalculators = currentHub.calculators.filter(calc => calc.featured);
  const allCalculators = currentHub.calculators;

  return (
    <div className="space-y-8">
      {/* Hub Header */}
      <div className="text-center space-y-4">
        <div className={`w-20 h-20 rounded-full ${currentHub.color} text-white flex items-center justify-center mx-auto`}>
          {currentHub.icon}
        </div>
        <h1 className="text-4xl font-bold">{currentHub.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {currentHub.description}
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="secondary">
            {allCalculators.length} calculators
          </Badge>
          <Badge variant="secondary">
            {featuredCalculators.length} advanced tools
          </Badge>
        </div>
      </div>

      {/* Hub Concept Explanation */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Hub-Based Organization?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            I organized calculators into Hubs based on the actual workflow stages in laser cutting manufacturing.
            Each Hub addresses specific challenges you encounter at different points in your work process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Real Manufacturing Workflow</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 mt-1 text-sm">•</span>
                <span className="text-gray-700 text-sm">
                  <strong>Cost & Pricing:</strong> Start here for project estimation and pricing decisions
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-500 mt-1 text-sm">•</span>
                <span className="text-gray-700 text-sm">
                  <strong>Parameters & Settings:</strong> Optimize your machine settings for the job
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-500 mt-1 text-sm">•</span>
                <span className="text-gray-700 text-sm">
                  <strong>Quality Optimization:</strong> Ensure cut quality meets requirements
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-orange-500 mt-1 text-sm">•</span>
                <span className="text-gray-700 text-sm">
                  <strong>Time & Efficiency:</strong> Maximize productivity and meet deadlines
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">This Hub: {currentHub.title}</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 text-sm mb-3">
                {hubType === 'cost-pricing' &&
                  "Use these tools at the beginning of any project for accurate cost estimation, competitive pricing analysis, and profit optimization. Essential for quotes and business decisions."
                }
                {hubType === 'parameters-settings' &&
                  "These calculators help you determine the optimal laser parameters for your specific material and thickness. Use them to set up your machine for the best results."
                }
                {hubType === 'quality-optimization' &&
                  "Focus on achieving the best possible cut quality. These tools help predict and prevent quality issues before they occur."
                }
                {hubType === 'time-efficiency' &&
                  "Maximize your productivity with tools for time estimation, production planning, and workflow optimization."
                }
                {hubType === 'business-roi' &&
                  "Business intelligence tools for analyzing profitability, ROI, and making strategic decisions about your laser cutting operations."
                }
              </p>
              <div className="text-xs text-gray-500">
                Best used: {hubType === 'cost-pricing' ? 'Before starting any project' :
                          hubType === 'parameters-settings' ? 'During machine setup' :
                          hubType === 'quality-optimization' ? 'When quality is critical' :
                          hubType === 'time-efficiency' ? 'For production planning' :
                          'For business analysis'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Calculators */}
      {featuredCalculators.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>AI-Enhanced Calculators</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCalculators.map((calculator) => (
              <Card key={calculator.id} className="hover:shadow-lg transition-shadow border-2 border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                      <Brain className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {calculator.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{calculator.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {calculator.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-blue-600">AI Powered</span>
                    </div>
                    <Link to={`/calculator/${calculator.id}`}>
                      <Button size="sm">
                        Try Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Calculators */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">All Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCalculators.map((calculator) => (
            <Card key={calculator.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${currentHub.color} text-white`}>
                    {currentHub.icon}
                  </div>
                  <Badge 
                    variant={calculator.badge === 'AI Enhanced' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {calculator.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{calculator.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {calculator.description}
                </p>
                <div className="flex justify-between items-center">
                  <Link to={`/learn/${calculator.id}`}>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </Link>
                  <Link to={`/calculator/${calculator.id}`}>
                    <Button size="sm">
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
        <h3 className="text-xl font-bold mb-6 text-center">Hub Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">{allCalculators.length}</div>
            <div className="text-sm text-muted-foreground">Total Calculators</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{featuredCalculators.length}</div>
            <div className="text-sm text-muted-foreground">AI Enhanced</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">&lt;200ms</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HubPage;
