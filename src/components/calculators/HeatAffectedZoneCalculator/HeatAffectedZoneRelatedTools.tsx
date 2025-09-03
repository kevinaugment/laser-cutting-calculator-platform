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

const HeatAffectedZoneRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'focus-height',
      name: 'Focus Height Calculator',
      description: 'Optimize focus position to control heat input and minimize HAZ formation',
      badge: 'Parameters',
      icon: Target
    },
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize power, speed, and frequency settings for minimal thermal effects',
      badge: 'Optimization',
      icon: Settings
    },
    {
      id: 'edge-quality-predictor',
      name: 'Edge Quality Predictor',
      description: 'Predict cutting edge quality based on HAZ characteristics and thermal effects',
      badge: 'Quality',
      icon: TrendingUp
    },
    {
      id: 'warping-risk',
      name: 'Warping Risk Calculator',
      description: 'Assess thermal distortion risk based on HAZ width and material properties',
      badge: 'Quality',
      icon: Zap
    },
    {
      id: 'material-selection-assistant',
      name: 'Material Selection Assistant',
      description: 'Select materials with optimal thermal properties for HAZ control',
      badge: 'Materials',
      icon: Calculator
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate cutting time with HAZ-optimized parameters and thermal considerations',
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
          Explore other calculators that complement your heat affected zone analysis workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete HAZ Control Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive thermal management in laser cutting, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. HAZ Analysis</Badge>
            <Badge variant="outline" className="bg-white">2. Parameter Optimizer</Badge>
            <Badge variant="outline" className="bg-white">3. Focus Height</Badge>
            <Badge variant="outline" className="bg-white">4. Edge Quality</Badge>
            <Badge variant="outline" className="bg-white">5. Warping Risk</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatAffectedZoneRelatedTools;
