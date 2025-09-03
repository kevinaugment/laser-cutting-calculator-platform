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

const EquipmentComparisonRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate operating costs for different equipment options',
      badge: 'Cost Analysis',
      icon: Calculator
    },
    {
      id: 'maintenance-cost',
      name: 'Maintenance Cost Calculator',
      description: 'Compare maintenance costs and schedules across equipment',
      badge: 'Maintenance Analysis',
      icon: Settings
    },
    {
      id: 'energy-cost',
      name: 'Energy Cost Calculator',
      description: 'Analyze energy consumption and costs for equipment comparison',
      badge: 'Energy Analysis',
      icon: Zap
    },
    {
      id: 'production-capacity',
      name: 'Production Capacity Calculator',
      description: 'Compare production capabilities and throughput rates',
      badge: 'Capacity Planning',
      icon: Gauge
    },
    {
      id: 'profit-margin',
      name: 'Profit Margin Calculator',
      description: 'Analyze profitability impact of different equipment choices',
      badge: 'Profitability',
      icon: TrendingUp
    },
    {
      id: 'project-quoting',
      name: 'Project Quoting Calculator',
      description: 'Generate quotes based on selected equipment capabilities',
      badge: 'Project Analysis',
      icon: Target
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
          Explore other calculators that complement your equipment comparison and investment decision workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete Equipment Evaluation Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive equipment selection, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Equipment Comparison</Badge>
            <Badge variant="outline" className="bg-white">2. Cost Analysis</Badge>
            <Badge variant="outline" className="bg-white">3. Maintenance Planning</Badge>
            <Badge variant="outline" className="bg-white">4. Capacity Planning</Badge>
            <Badge variant="outline" className="bg-white">5. Profit Analysis</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentComparisonRelatedTools;
