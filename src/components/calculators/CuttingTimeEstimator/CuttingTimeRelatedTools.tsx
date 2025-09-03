import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Calculator, DollarSign, Settings, Target, Zap, TrendingUp } from 'lucide-react';

const CuttingTimeRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate total cutting costs based on estimated time and operational parameters',
      badge: 'Cost Analysis',
      icon: DollarSign
    },
    {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      description: 'Optimize laser parameters to achieve target cutting times and quality',
      badge: 'Parameter Optimization',
      icon: Settings
    },
    {
      id: 'production-capacity',
      name: 'Production Capacity Planner',
      description: 'Plan production schedules based on accurate cutting time estimates',
      badge: 'Capacity Planning',
      icon: Target
    },
    {
      id: 'batch-processing',
      name: 'Batch Processing Calculator',
      description: 'Optimize batch sizes and processing sequences for time efficiency',
      badge: 'Batch Optimization',
      icon: TrendingUp
    },
    {
      id: 'material-nesting-optimizer',
      name: 'Material Nesting Optimizer',
      description: 'Optimize material layouts to minimize total cutting time and waste',
      badge: 'Material Efficiency',
      icon: Target
    },
    {
      id: 'job-queue-optimizer',
      name: 'Job Queue Optimizer',
      description: 'Schedule jobs based on cutting time estimates for optimal throughput',
      badge: 'Schedule Optimization',
      icon: Zap
    }
  ];

  const handleCalculatorClick = (calculatorId: string) => {
    window.open(`/calculator/${calculatorId}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          Related Calculators
        </CardTitle>
        <p className="text-sm text-gray-600">
          Explore other calculators that complement your cutting time analysis workflow
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedCalculators.map((calculator) => {
            const IconComponent = calculator.icon;
            return (
              <div
                key={calculator.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCalculatorClick(calculator.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {calculator.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {calculator.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {calculator.description}
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      Open Calculator
                      <Calculator className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Integration */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Complete Time Analysis Workflow</h3>
          <p className="text-sm text-blue-700 mb-3">
            For comprehensive production time management, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline" className="bg-white">1. Cutting Time</Badge>
            <span className="text-blue-600">→</span>
            <Badge variant="outline" className="bg-white">2. Cost Analysis</Badge>
            <span className="text-blue-600">→</span>
            <Badge variant="outline" className="bg-white">3. Capacity Planning</Badge>
            <span className="text-blue-600">→</span>
            <Badge variant="outline" className="bg-white">4. Job Scheduling</Badge>
            <span className="text-blue-600">→</span>
            <Badge variant="outline" className="bg-white">5. Batch Optimization</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CuttingTimeRelatedTools;
