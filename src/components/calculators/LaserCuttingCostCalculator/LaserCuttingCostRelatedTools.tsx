import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Calculator,
  ExternalLink,
  Clock,
  Settings,
  TrendingUp
} from 'lucide-react';

const LaserCuttingCostRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate cutting time and optimize production scheduling',
      badge: 'Time Analysis',
      icon: Clock
    },
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize cutting parameters for cost and quality',
      badge: 'Optimization',
      icon: Settings
    },
    {
      id: 'profit-margin-optimizer',
      name: 'Profit Margin Calculator',
      description: 'Calculate profit margins and pricing strategies',
      badge: 'Business',
      icon: TrendingUp
    },
    {
      id: 'material-selection-assistant',
      name: 'Material Selection Assistant',
      description: 'Choose the optimal material for your cutting requirements',
      badge: 'Materials',
      icon: Settings
    },
    {
      id: 'energy-cost',
      name: 'Energy Cost Calculator',
      description: 'Analyze and optimize energy consumption costs',
      badge: 'Energy',
      icon: TrendingUp
    },
    {
      id: 'batch-processing',
      name: 'Batch Processing Calculator',
      description: 'Optimize batch sizes and production scheduling',
      badge: 'Production',
      icon: Clock
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
          Explore other calculators that complement your cost analysis workflow
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
                    <Badge variant="secondary" className="text-xs">{calc.badge}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{calc.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{calc.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Open Calculator
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Complete Cost Analysis Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive cost optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Cost Calculator</Badge>
            <Badge variant="outline" className="bg-white">2. Time Estimator</Badge>
            <Badge variant="outline" className="bg-white">3. Parameter Optimizer</Badge>
            <Badge variant="outline" className="bg-white">4. Profit Margin</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaserCuttingCostRelatedTools;
