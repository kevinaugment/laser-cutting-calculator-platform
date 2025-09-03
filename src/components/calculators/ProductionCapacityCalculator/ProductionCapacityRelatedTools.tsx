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

const ProductionCapacityRelatedTools: React.FC = () => {
  const relatedCalculators = [
    {
      id: 'batch-processing',
      name: 'Batch Processing Calculator',
      description: 'Optimize batch sizes and processing efficiency to maximize production capacity',
      badge: 'Efficiency',
      icon: Settings
    },
    {
      id: 'job-queue-optimizer',
      name: 'Job Queue Optimizer',
      description: 'Optimize job scheduling and queue management for maximum throughput',
      badge: 'Scheduling',
      icon: Target
    },
    {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      description: 'Estimate processing times for accurate capacity planning and scheduling',
      badge: 'Time Analysis',
      icon: Gauge
    },
    {
      id: 'material-nesting-optimizer',
      name: 'Material Nesting Optimizer',
      description: 'Optimize material usage to reduce waste and improve capacity utilization',
      badge: 'Material Optimization',
      icon: TrendingUp
    },
    {
      id: 'laser-cutting-cost',
      name: 'Laser Cutting Cost Calculator',
      description: 'Calculate production costs and analyze capacity investment ROI',
      badge: 'Cost Analysis',
      icon: Calculator
    },
    {
      id: 'quality-grade-predictor',
      name: 'Quality Grade Calculator',
      description: 'Predict quality outcomes and their impact on effective capacity',
      badge: 'Quality Control',
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
          Explore other calculators that complement your production capacity planning and optimization workflow
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
          <h3 className="font-semibold text-blue-900 mb-2">Complete Capacity Planning Workflow</h3>
          <p className="text-sm text-blue-800 mb-3">
            For comprehensive production capacity optimization, use these calculators in sequence:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white">1. Production Capacity</Badge>
            <Badge variant="outline" className="bg-white">2. Batch Processing</Badge>
            <Badge variant="outline" className="bg-white">3. Job Queue</Badge>
            <Badge variant="outline" className="bg-white">4. Time Estimator</Badge>
            <Badge variant="outline" className="bg-white">5. Cost Analysis</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionCapacityRelatedTools;
