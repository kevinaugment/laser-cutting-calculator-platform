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

const JobQueueRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'production-capacity',
      name: 'Production Capacity Calculator',
      description: 'Analyze production capacity and bottlenecks to optimize job scheduling',
      badge: 'Capacity Planning',
      icon: TrendingUp
    },
    {
      id: 'batch-processing',
      name: 'Batch Processing Calculator',
      description: 'Optimize batch sizes and processing sequences for efficient job execution',
      badge: 'Batch Optimization',
      icon: Settings
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate accurate processing times for better job queue scheduling',
      badge: 'Time Estimation',
      icon: Gauge
    },
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate job costs to optimize profitability in queue scheduling',
      badge: 'Cost Analysis',
      icon: Calculator
    },
    {
      id: 'energy-cost',
      name: 'Energy Cost Calculator',
      description: 'Optimize energy consumption patterns through intelligent job scheduling',
      badge: 'Energy Optimization',
      icon: Zap
    },
    {
      id: 'material-nesting-optimizer',
      name: 'Material Nesting Optimizer',
      description: 'Optimize material usage and reduce waste through smart job grouping',
      badge: 'Material Efficiency',
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
          Explore other calculators that complement your job queue optimization and production scheduling workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete Production Optimization Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive production optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Job Queue</Badge>
            <Badge variant="outline" className="bg-white">2. Production Capacity</Badge>
            <Badge variant="outline" className="bg-white">3. Batch Processing</Badge>
            <Badge variant="outline" className="bg-white">4. Material Nesting</Badge>
            <Badge variant="outline" className="bg-white">5. Cost Analysis</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobQueueRelatedTools;
