import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/Button';
import { ArrowRight, Settings, Target, Zap, Gauge, Focus, Microscope } from 'lucide-react';

const BeamQualityCalculatorRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-parameter-optimizer',
      title: 'Laser Parameter Optimizer',
      category: 'Parameter Optimization',
      description: 'Optimize cutting parameters based on beam quality analysis',
      icon: Settings,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'focus-height',
      title: 'Focus Height Calculator',
      category: 'Optical Setup',
      description: 'Calculate optimal focus position for your beam quality',
      icon: Focus,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'power-requirement',
      title: 'Power Requirement Calculator',
      category: 'Power Analysis',
      description: 'Determine required power based on beam quality and material',
      icon: Zap,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 'cutting-time-estimator',
      title: 'Cutting Time Estimator',
      category: 'Performance Analysis',
      description: 'Estimate cutting performance with beam quality factors',
      icon: Gauge,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'quality-grade-predictor',
      title: 'Quality Grade Predictor',
      category: 'Quality Control',
      description: 'Predict cutting quality based on beam characteristics',
      icon: Target,
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      id: 'heat-affected-zone',
      title: 'Heat Affected Zone Calculator',
      category: 'Thermal Analysis',
      description: 'Analyze thermal effects with beam quality considerations',
      icon: Microscope,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-600" />
          Related Calculators
        </CardTitle>
        <p className="text-gray-600">
          Explore other calculators that work with beam quality analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <div
                key={calc.id}
                className="group border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${calc.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        {calc.title}
                      </h3>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">{calc.category}</div>
                    <p className="text-sm text-gray-600 mb-3">{calc.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full group-hover:bg-purple-50 group-hover:border-purple-300"
                      onClick={() => window.location.href = `/calculator/${calc.id}`}
                    >
                      Open Calculator
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Complete Beam Quality Workflow
          </h3>
          <p className="text-gray-600 mb-4">
            For comprehensive laser system optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">1. Beam Quality Analysis</span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">2. Parameter Optimization</span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">3. Focus Setup</span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">4. Performance Testing</span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">5. Quality Validation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeamQualityCalculatorRelatedTools;
