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

const KerfWidthRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize laser parameters to achieve target kerf width and cutting quality',
      badge: 'Parameter Optimization',
      icon: Settings
    },
    {
      id: 'material-nesting-optimizer',
      name: 'Material Nesting Optimizer',
      description: 'Optimize material usage considering kerf width and cutting paths',
      badge: 'Material Efficiency',
      icon: Target
    },
    {
      id: 'focus-height',
      name: 'Focus Height Calculator',
      description: 'Calculate optimal focus position for consistent kerf width control',
      badge: 'Focus Control',
      icon: TrendingUp
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate cutting times considering kerf width and path optimization',
      badge: 'Time Analysis',
      icon: Gauge
    },
    {
      id: 'quality-grade',
      name: 'Quality Grade Calculator',
      description: 'Predict cut quality based on kerf width and edge characteristics',
      badge: 'Quality Analysis',
      icon: Calculator
    },
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate cutting costs including material waste from kerf width',
      badge: 'Cost Analysis',
      icon: Zap
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
          Explore other calculators that complement your kerf width analysis and precision cutting workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete Precision Cutting Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive precision cutting optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Kerf Width</Badge>
            <Badge variant="outline" className="bg-white">2. Parameter Optimizer</Badge>
            <Badge variant="outline" className="bg-white">3. Focus Height</Badge>
            <Badge variant="outline" className="bg-white">4. Material Nesting</Badge>
            <Badge variant="outline" className="bg-white">5. Quality Grade</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KerfWidthRelatedTools;
