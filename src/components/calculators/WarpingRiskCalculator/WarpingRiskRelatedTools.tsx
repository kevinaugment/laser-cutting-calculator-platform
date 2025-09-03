import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Calculator, 
  Thermometer, 
  Target, 
  Settings,
  Zap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const WarpingRiskRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'edge-quality-predictor',
      name: 'Edge Quality Predictor',
      description: 'Predict edge quality and thermal effects that contribute to warping',
      badge: 'Quality Analysis',
      icon: Target
    },
    {
      id: 'heat-affected-zone',
      name: 'Heat Affected Zone Calculator',
      description: 'Calculate HAZ dimensions and thermal impact on material',
      badge: 'Thermal Analysis',
      icon: Thermometer
    },
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize cutting parameters to minimize warping risk',
      badge: 'Parameter Optimization',
      icon: Settings
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate cutting time and thermal exposure duration',
      badge: 'Time Analysis',
      icon: Calculator
    },
    {
      id: 'energy-cost',
      name: 'Energy Cost Calculator',
      description: 'Analyze energy input and its relationship to thermal stress',
      badge: 'Energy Analysis',
      icon: Zap
    },
    {
      id: 'quality-grade-predictor',
      name: 'Quality Grade Predictor',
      description: 'Predict overall part quality including dimensional stability',
      badge: 'Quality Control',
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
          Explore other calculators that complement your warping risk assessment and quality control workflow
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
            For comprehensive quality assurance, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Parameter Optimization</Badge>
            <Badge variant="outline" className="bg-white">2. Warping Risk Assessment</Badge>
            <Badge variant="outline" className="bg-white">3. Thermal Analysis</Badge>
            <Badge variant="outline" className="bg-white">4. Quality Prediction</Badge>
            <Badge variant="outline" className="bg-white">5. Edge Quality Control</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarpingRiskRelatedTools;
