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

const ProfitMarginRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'project-quoting',
      name: 'Project Quoting Calculator',
      description: 'Generate accurate project quotes with optimal profit margins',
      badge: 'Pricing Strategy',
      icon: Calculator
    },
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate detailed production costs for margin analysis',
      badge: 'Cost Analysis',
      icon: Target
    },
    {
      id: 'competitive-pricing',
      name: 'Competitive Pricing Calculator',
      description: 'Optimize pricing strategies while maintaining profitability',
      badge: 'Market Analysis',
      icon: TrendingUp
    },
    {
      id: 'break-even-analysis',
      name: 'Break-Even Analysis Calculator',
      description: 'Determine minimum sales volumes for profitability',
      badge: 'Financial Planning',
      icon: Gauge
    },
    {
      id: 'energy-cost',
      name: 'Energy Cost Calculator',
      description: 'Calculate energy costs impact on profit margins',
      badge: 'Cost Control',
      icon: Zap
    },
    {
      id: 'batch-processing',
      name: 'Batch Processing Calculator',
      description: 'Optimize batch sizes to maximize profit margins',
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
          Explore other calculators that complement your profit margin analysis and profitability optimization workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete Profitability Analysis Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive profitability optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Cost Analysis</Badge>
            <Badge variant="outline" className="bg-white">2. Profit Margin</Badge>
            <Badge variant="outline" className="bg-white">3. Break-Even</Badge>
            <Badge variant="outline" className="bg-white">4. Project Quoting</Badge>
            <Badge variant="outline" className="bg-white">5. Competitive Pricing</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitMarginRelatedTools;
