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

const ProjectQuotingRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate detailed cutting costs for accurate project pricing',
      badge: 'Cost Analysis',
      icon: Calculator
    },
    {
      id: 'profit-margin',
      name: 'Profit Margin Calculator',
      description: 'Optimize profit margins and pricing strategies for projects',
      badge: 'Profitability',
      icon: TrendingUp
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate processing times for accurate labor cost calculation',
      badge: 'Time Analysis',
      icon: Gauge
    },
    {
      id: 'material-selection-assistant',
      name: 'Material Selection Assistant',
      description: 'Select optimal materials to balance cost and performance',
      badge: 'Material Optimization',
      icon: Target
    },
    {
      id: 'energy-cost',
      name: 'Energy Cost Calculator',
      description: 'Calculate energy costs to include in project overhead',
      badge: 'Energy Analysis',
      icon: Zap
    },
    {
      id: 'batch-processing',
      name: 'Batch Processing Calculator',
      description: 'Optimize batch sizes to reduce per-part costs in quotes',
      badge: 'Efficiency Optimization',
      icon: Settings
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
          Explore other calculators that complement your project quoting and pricing workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete Project Pricing Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive project pricing, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Material Selection</Badge>
            <Badge variant="outline" className="bg-white">2. Cutting Cost</Badge>
            <Badge variant="outline" className="bg-white">3. Time Estimation</Badge>
            <Badge variant="outline" className="bg-white">4. Project Quoting</Badge>
            <Badge variant="outline" className="bg-white">5. Profit Margin</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectQuotingRelatedTools;
