import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Calculator, 
  Settings, 
  Zap, 
  Target,
  Gauge,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const EdgeQualityPredictorRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize cutting parameters to achieve desired edge quality',
      badge: 'Parameter Optimization',
      icon: Settings
    },
    {
      id: 'quality-grade-predictor',
      name: 'Quality Grade Calculator',
      description: 'Comprehensive quality assessment and grading system',
      badge: 'Quality Analysis',
      icon: Target
    },
    {
      id: 'warping-risk',
      name: 'Warping Risk Calculator',
      description: 'Predict and prevent thermal warping that affects edge quality',
      badge: 'Risk Assessment',
      icon: Gauge
    },
    {
      id: 'heat-affected-zone',
      name: 'Heat Affected Zone Calculator',
      description: 'Calculate HAZ width and its impact on edge characteristics',
      badge: 'Thermal Analysis',
      icon: Zap
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Balance cutting speed with quality requirements',
      badge: 'Time Analysis',
      icon: Calculator
    },
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Analyze cost implications of quality requirements',
      badge: 'Cost Analysis',
      icon: TrendingUp
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Related Calculators
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Explore other calculators that complement your edge quality prediction and process optimization workflow
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <Card key={calc.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/calculator/${calc.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">
                      {calc.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {calc.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Open Calculator
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Complete Quality Control Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive quality optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Edge Quality Predictor</Badge>
            <Badge variant="outline" className="bg-white">2. Parameter Optimizer</Badge>
            <Badge variant="outline" className="bg-white">3. Quality Grade</Badge>
            <Badge variant="outline" className="bg-white">4. Warping Risk</Badge>
            <Badge variant="outline" className="bg-white">5. Cost Analysis</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EdgeQualityPredictorRelatedTools;
