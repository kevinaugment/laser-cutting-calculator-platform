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

const EnergyCostRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate total cutting costs including energy costs and operational expenses',
      badge: 'Total Cost Analysis',
      icon: Calculator
    },
    {
      id: 'production-capacity',
      name: 'Production Capacity Calculator',
      description: 'Analyze production capacity and energy consumption relationships',
      badge: 'Capacity Planning',
      icon: TrendingUp
    },
    {
      id: 'batch-processing',
      name: 'Batch Processing Calculator',
      description: 'Optimize batch sizes to minimize energy costs and improve efficiency',
      badge: 'Efficiency Optimization',
      icon: Settings
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate cutting times to calculate energy consumption and costs',
      badge: 'Time Analysis',
      icon: Gauge
    },
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize laser parameters for energy efficiency and cost reduction',
      badge: 'Parameter Optimization',
      icon: Target
    },
    {
      id: 'profit-margin',
      name: 'Profit Margin Calculator',
      description: 'Analyze profit margins considering energy costs and operational expenses',
      badge: 'Profitability',
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
          Explore other calculators that complement your energy cost analysis and optimization workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete Cost Management Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive cost optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Energy Cost</Badge>
            <Badge variant="outline" className="bg-white">2. Cutting Cost</Badge>
            <Badge variant="outline" className="bg-white">3. Parameter Optimizer</Badge>
            <Badge variant="outline" className="bg-white">4. Batch Processing</Badge>
            <Badge variant="outline" className="bg-white">5. Profit Margin</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyCostRelatedTools;
