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

const QualityGradeRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize laser parameters to achieve target quality grades and surface finish',
      badge: 'Parameter Optimization',
      icon: Settings
    },
    {
      id: 'heat-affected-zone',
      name: 'Heat Affected Zone Calculator',
      description: 'Calculate HAZ width and its impact on cut quality and material properties',
      badge: 'Thermal Analysis',
      icon: Zap
    },
    {
      id: 'edge-quality-predictor',
      name: 'Edge Quality Predictor',
      description: 'Predict edge quality characteristics including roughness and perpendicularity',
      badge: 'Quality Analysis',
      icon: Target
    },
    {
      id: 'focus-height',
      name: 'Focus Height Calculator',
      description: 'Optimize focus position for best cut quality and edge characteristics',
      badge: 'Focus Optimization',
      icon: TrendingUp
    },
    {
      id: 'material-selection-assistant',
      name: 'Material Selection Assistant',
      description: 'Select optimal materials and parameters for required quality standards',
      badge: 'Material Selection',
      icon: Calculator
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate cutting times while maintaining quality requirements',
      badge: 'Time Analysis',
      icon: Gauge
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
          Explore other calculators that complement your quality grade prediction and optimization workflow
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
            <Badge variant="outline" className="bg-white">1. Quality Grade</Badge>
            <Badge variant="outline" className="bg-white">2. Parameter Optimizer</Badge>
            <Badge variant="outline" className="bg-white">3. Focus Height</Badge>
            <Badge variant="outline" className="bg-white">4. Edge Quality</Badge>
            <Badge variant="outline" className="bg-white">5. HAZ Analysis</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityGradeRelatedTools;
