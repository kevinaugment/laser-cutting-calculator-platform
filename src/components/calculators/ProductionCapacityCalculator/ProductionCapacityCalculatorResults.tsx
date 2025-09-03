import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Factory, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Users,
  Calendar,
  DollarSign,
  Zap
} from 'lucide-react';

interface ProductionCapacityCalculatorResultsProps {
  results: {
    theoreticalCapacity: {
      daily: number;
      weekly: number;
      monthly: number;
      annual: number;
    };
    effectiveCapacity: {
      daily: number;
      weekly: number;
      monthly: number;
      annual: number;
    };
    capacityUtilization: number;
    bottleneckAnalysis: {
      primaryBottleneck: string;
      bottleneckCapacity: number;
      improvementPotential: number;
    };
    demandAnalysis: {
      demandVsCapacity: number;
      capacityGap: number;
      recommendedAction: string;
    };
    resourceOptimization: {
      optimalMachineCount: number;
      optimalOperatorCount: number;
      shiftOptimization: string;
      costPerPart: number;
    };
    scalingRecommendations: {
      shortTerm: string[];
      mediumTerm: string[];
      longTerm: string[];
    };
    seasonalPlanning: {
      peakCapacityNeeded: number;
      lowSeasonCapacity: number;
      flexibilityRecommendations: string[];
    };
    recommendations: string[];
    keyMetrics: {
      [key: string]: string;
    };
    sensitivityAnalysis: {
      machineCount: Array<{
        machines: number;
        capacity: number;
        utilization: number;
        impact: string;
      }>;
      efficiency: Array<{
        efficiency: number;
        capacity: number;
        impact: string;
      }>;
      recommendations: string[];
    };
  };
}

const ProductionCapacityCalculatorResults: React.FC<ProductionCapacityCalculatorResultsProps> = ({ results }) => {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    if (utilization >= 50) return 'text-green-600';
    return 'text-blue-600';
  };

  const getCapacityGapColor = (gap: number) => {
    if (gap < -1000) return 'text-red-600';
    if (gap < 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Factory className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.effectiveCapacity.monthly.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Monthly Capacity</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getUtilizationColor(results.capacityUtilization)}`} />
            <div className="text-2xl font-bold">{results.capacityUtilization.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Utilization</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getCapacityGapColor(results.demandAnalysis.capacityGap)}`} />
            <div className="text-2xl font-bold">
              {results.demandAnalysis.capacityGap > 0 ? '+' : ''}{results.demandAnalysis.capacityGap.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Capacity Gap</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${results.resourceOptimization.costPerPart.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Cost per Part</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
          <TabsTrigger value="demand">Demand</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Capacity Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Capacity Utilization</span>
                    <span className={`font-semibold ${getUtilizationColor(results.capacityUtilization)}`}>
                      {results.capacityUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={results.capacityUtilization} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Theoretical Capacity:</span>
                    <span className="font-medium">{results.theoreticalCapacity.monthly.toLocaleString()} parts/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Capacity:</span>
                    <span className="font-medium">{results.effectiveCapacity.monthly.toLocaleString()} parts/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Output:</span>
                    <span className="font-medium">{results.effectiveCapacity.daily.toLocaleString()} parts/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Capacity:</span>
                    <span className="font-medium">{results.effectiveCapacity.annual.toLocaleString()} parts/year</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Bottleneck Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge variant="destructive" className="mb-2">
                    {results.bottleneckAnalysis.primaryBottleneck}
                  </Badge>
                  <div className="text-sm text-muted-foreground">Primary Bottleneck</div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Bottleneck Capacity:</span>
                    <span className="font-medium">{results.bottleneckAnalysis.bottleneckCapacity.toFixed(1)} parts/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Improvement Potential:</span>
                    <span className="font-medium text-green-600">{results.bottleneckAnalysis.improvementPotential.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demand vs Capacity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Demand Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{results.demandAnalysis.demandVsCapacity.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Demand vs Capacity</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getCapacityGapColor(results.demandAnalysis.capacityGap)}`}>
                    {results.demandAnalysis.capacityGap > 0 ? '+' : ''}{results.demandAnalysis.capacityGap.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Capacity Gap (parts/month)</div>
                </div>
                <div>
                  <Badge variant={results.demandAnalysis.capacityGap > 0 ? 'default' : 'destructive'}>
                    {results.demandAnalysis.capacityGap > 0 ? 'SURPLUS' : 'DEFICIT'}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Capacity Status</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded text-sm">
                <strong>Recommendation:</strong> {results.demandAnalysis.recommendedAction}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Theoretical vs Effective Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Daily</span>
                      <span className="text-sm font-medium">
                        {results.effectiveCapacity.daily.toLocaleString()} / {results.theoreticalCapacity.daily.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(results.effectiveCapacity.daily / results.theoreticalCapacity.daily) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Weekly</span>
                      <span className="text-sm font-medium">
                        {results.effectiveCapacity.weekly.toLocaleString()} / {results.theoreticalCapacity.weekly.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(results.effectiveCapacity.weekly / results.theoreticalCapacity.weekly) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Monthly</span>
                      <span className="text-sm font-medium">
                        {results.effectiveCapacity.monthly.toLocaleString()} / {results.theoreticalCapacity.monthly.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(results.effectiveCapacity.monthly / results.theoreticalCapacity.monthly) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Annual</span>
                      <span className="text-sm font-medium">
                        {results.effectiveCapacity.annual.toLocaleString()} / {results.theoreticalCapacity.annual.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(results.effectiveCapacity.annual / results.theoreticalCapacity.annual) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Machine Efficiency:</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downtime Impact:</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operator Constraint:</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Time Impact:</span>
                    <span className="font-medium">8%</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Overall Effectiveness:</span>
                    <span>{((results.effectiveCapacity.monthly / results.theoreticalCapacity.monthly) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bottlenecks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Bottleneck Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Badge variant="destructive" className="mb-2">PRIMARY</Badge>
                  <div className="font-semibold">{results.bottleneckAnalysis.primaryBottleneck}</div>
                  <div className="text-sm text-muted-foreground">
                    {results.bottleneckAnalysis.bottleneckCapacity.toFixed(1)} parts/hour
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.bottleneckAnalysis.improvementPotential.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Improvement Potential</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {(results.bottleneckAnalysis.bottleneckCapacity * results.bottleneckAnalysis.improvementPotential / 100).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Additional Parts/Hour</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Improvement Actions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <div className="font-medium">Setup Time Reduction</div>
                    <div className="text-sm text-muted-foreground">Implement quick-change tooling</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium">Operator Training</div>
                    <div className="text-sm text-muted-foreground">Improve operator efficiency</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium">Preventive Maintenance</div>
                    <div className="text-sm text-muted-foreground">Reduce unplanned downtime</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="font-medium">Process Optimization</div>
                    <div className="text-sm text-muted-foreground">Streamline workflow</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand vs Capacity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {results.demandAnalysis.demandVsCapacity.toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground">Demand vs Capacity Ratio</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-xl font-bold">{results.effectiveCapacity.monthly.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Monthly Capacity</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-xl font-bold">
                      {Math.round(results.effectiveCapacity.monthly * results.demandAnalysis.demandVsCapacity / 100).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Projected Demand</div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded">
                  <h4 className="font-semibold mb-2">Recommended Action:</h4>
                  <p className="text-sm">{results.demandAnalysis.recommendedAction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Optimal Machine Count:</span>
                    <span className="font-medium">{results.resourceOptimization.optimalMachineCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Optimal Operator Count:</span>
                    <span className="font-medium">{results.resourceOptimization.optimalOperatorCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shift Optimization:</span>
                    <span className="font-medium">{results.resourceOptimization.shiftOptimization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Part:</span>
                    <span className="font-medium">${results.resourceOptimization.costPerPart.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Peak Capacity Needed:</span>
                    <span className="font-medium">{results.seasonalPlanning.peakCapacityNeeded.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Season Capacity:</span>
                    <span className="font-medium">{results.seasonalPlanning.lowSeasonCapacity.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Flexibility Recommendations:</h4>
                  <div className="space-y-1">
                    {results.seasonalPlanning.flexibilityRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Short Term (0-6 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.scalingRecommendations.shortTerm.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medium Term (6-18 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.scalingRecommendations.mediumTerm.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Long Term (18+ months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.scalingRecommendations.longTerm.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Factory className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>General Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionCapacityCalculatorResults;
