import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Package, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Settings,
  Zap
} from 'lucide-react';

interface BatchProcessingCalculatorResultsProps {
  results: {
    optimizedBatching: {
      totalBatches: number;
      batchDetails: Array<{
        batchId: string;
        batchNumber: number;
        partTypes: string[];
        totalParts: number;
        materialType: string;
        thickness: number;
        estimatedTime: number;
        setupTime: number;
        materialSheets: number;
        materialUtilization: number;
      }>;
      batchingEfficiency: number;
    };
    timeAnalysis: {
      totalProcessingTime: number;
      totalSetupTime: number;
      totalCuttingTime: number;
      totalQualityTime: number;
      setupPercentage: number;
      productiveTime: number;
      timeOptimization: number;
    };
    materialOptimization: {
      materialUtilization: number;
      totalMaterialCost: number;
      materialWaste: number;
      wasteValue: number;
      materialEfficiency: number;
    };
    throughputAnalysis: {
      partsPerHour: number;
      partsPerShift: number;
      partsPerDay: number;
      throughputImprovement: number;
      bottleneckAnalysis: string[];
      capacityUtilization: number;
    };
    qualityImpact: {
      qualityScore: number;
      defectReduction: number;
      reworkReduction: number;
      qualityImprovement: number;
      qualityRisk: 'low' | 'medium' | 'high';
    };
    costAnalysis: {
      totalCost: number;
      materialCosts: number;
      laborCosts: number;
      setupCosts: number;
      qualityCosts: number;
      costPerPart: number;
      costSavings: number;
    };
    scheduleOptimization: {
      recommendedSequence: Array<{
        batchId: string;
        startTime: string;
        endTime: string;
        priority: string;
      }>;
      criticalPath: string[];
      scheduleFlexibility: number;
      deliveryPerformance: {
        onTimeDelivery: number;
        averageDelay: number;
      };
    };
    riskAssessment: {
      batchingRisk: 'low' | 'medium' | 'high' | 'critical';
      riskFactors: Array<{
        factor: string;
        impact: string;
        probability: number;
        mitigation: string;
      }>;
      contingencyPlans: Array<{
        scenario: string;
        action: string;
        timeImpact: number;
      }>;
    };
    continuousImprovement: {
      performanceMetrics: Array<{
        metric: string;
        current: number;
        target: number;
        improvement: string;
      }>;
      optimizationOpportunities: string[];
      bestPractices: string[];
      learningPoints: string[];
    };
    alertsAndRecommendations: {
      batchingAlerts: string[];
      materialWarnings: string[];
      scheduleOptimizations: string[];
      qualityRecommendations: string[];
      efficiencyImprovements: string[];
    };
  };
}

const BatchProcessingCalculatorResults: React.FC<BatchProcessingCalculatorResultsProps> = ({ results }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.optimizedBatching.totalBatches}</div>
            <div className="text-sm text-muted-foreground">Total Batches</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getEfficiencyColor(results.optimizedBatching.batchingEfficiency)}`} />
            <div className="text-2xl font-bold">{results.optimizedBatching.batchingEfficiency.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Batching Efficiency</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.timeAnalysis.totalProcessingTime.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${results.costAnalysis.costSavings.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Cost Savings</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="improvement">Improvement</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Optimization Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Batching Efficiency</span>
                    <span className={`font-semibold ${getEfficiencyColor(results.optimizedBatching.batchingEfficiency)}`}>
                      {results.optimizedBatching.batchingEfficiency.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={results.optimizedBatching.batchingEfficiency} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Batches:</span>
                    <span className="font-medium">{results.optimizedBatching.totalBatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span className="font-medium">{results.timeAnalysis.totalProcessingTime.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Time:</span>
                    <span className="font-medium">{results.timeAnalysis.setupPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Utilization:</span>
                    <span className="font-medium">{results.materialOptimization.materialUtilization.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance Improvements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {results.throughputAnalysis.throughputImprovement.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Throughput Improvement</div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Parts per Hour:</span>
                    <span className="font-medium">{results.throughputAnalysis.partsPerHour.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parts per Shift:</span>
                    <span className="font-medium">{results.throughputAnalysis.partsPerShift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parts per Day:</span>
                    <span className="font-medium">{results.throughputAnalysis.partsPerDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Saved:</span>
                    <span className="font-medium text-green-600">{results.timeAnalysis.timeOptimization.toFixed(1)} hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality and Risk Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Quality Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{results.qualityImpact.qualityScore}/100</div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                  </div>
                  <div>
                    <Badge variant={results.qualityImpact.qualityRisk === 'low' ? 'default' : 
                                   results.qualityImpact.qualityRisk === 'medium' ? 'secondary' : 'destructive'}>
                      {results.qualityImpact.qualityRisk.toUpperCase()} RISK
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">Quality Risk</div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Defect Reduction:</span>
                    <span className="font-medium text-green-600">{results.qualityImpact.defectReduction.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rework Reduction:</span>
                    <span className="font-medium text-green-600">{results.qualityImpact.reworkReduction.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Badge variant={results.riskAssessment.batchingRisk === 'low' ? 'default' : 
                                 results.riskAssessment.batchingRisk === 'medium' ? 'secondary' : 
                                 results.riskAssessment.batchingRisk === 'high' ? 'destructive' : 'destructive'}>
                    {results.riskAssessment.batchingRisk.toUpperCase()} RISK
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Overall Batching Risk</div>
                </div>
                
                {results.riskAssessment.riskFactors.slice(0, 3).map((risk, index) => (
                  <div key={index} className="mb-2 p-2 bg-muted rounded text-sm">
                    <div className="font-medium">{risk.factor}</div>
                    <div className="text-muted-foreground">{risk.impact}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="grid gap-4">
            {results.optimizedBatching.batchDetails.map((batch) => (
              <Card key={batch.batchId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{batch.batchId}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{batch.materialUtilization.toFixed(1)}% Utilized</Badge>
                      <Badge variant="secondary">{batch.totalParts} parts</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Material</div>
                      <div className="font-medium capitalize">{batch.materialType.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Thickness</div>
                      <div className="font-medium">{batch.thickness}mm</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Estimated Time</div>
                      <div className="font-medium">{batch.estimatedTime} hours</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Setup Time</div>
                      <div className="font-medium">{batch.setupTime} min</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Part Types:</h4>
                    <div className="flex flex-wrap gap-2">
                      {batch.partTypes.map((partType, index) => (
                        <Badge key={index} variant="outline">{partType}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Time Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Total Processing Time</span>
                    <span className="font-semibold">{results.timeAnalysis.totalProcessingTime.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Setup Time</span>
                    <span className="font-semibold">{results.timeAnalysis.totalSetupTime.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cutting Time</span>
                    <span className="font-semibold">{results.timeAnalysis.totalCuttingTime.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quality Time</span>
                    <span className="font-semibold">{results.timeAnalysis.totalQualityTime.toFixed(1)} hours</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold">Productive Time</span>
                    <span className="font-bold text-lg">{results.timeAnalysis.productiveTime.toFixed(1)} hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Throughput Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {results.throughputAnalysis.partsPerHour.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Parts per Hour</div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Parts per Shift:</span>
                      <span className="font-medium">{results.throughputAnalysis.partsPerShift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Parts per Day:</span>
                      <span className="font-medium">{results.throughputAnalysis.partsPerDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity Utilization:</span>
                      <span className="font-medium">{results.throughputAnalysis.capacityUtilization.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bottleneck Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.throughputAnalysis.bottleneckAnalysis.map((bottleneck, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>{bottleneck}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Material Costs</span>
                    <span className="font-semibold">${results.costAnalysis.materialCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Labor Costs</span>
                    <span className="font-semibold">${results.costAnalysis.laborCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Setup Costs</span>
                    <span className="font-semibold">${results.costAnalysis.setupCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quality Costs</span>
                    <span className="font-semibold">${results.costAnalysis.qualityCosts.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold">Total Cost</span>
                    <span className="font-bold text-lg">${results.costAnalysis.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600">
                    ${results.costAnalysis.costSavings.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Cost Savings</div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cost per Part:</span>
                    <span className="font-medium">${results.costAnalysis.costPerPart.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Efficiency:</span>
                    <span className="font-medium">{results.materialOptimization.materialEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Value:</span>
                    <span className="font-medium text-red-600">${results.materialOptimization.wasteValue.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Batch Sequence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.scheduleOptimization.recommendedSequence.map((schedule, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{schedule.batchId}</span>
                      <Badge variant="outline">{schedule.priority} priority</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Start:</span>
                        <span className="ml-1">{new Date(schedule.startTime).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End:</span>
                        <span className="ml-1">{new Date(schedule.endTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Flexibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.scheduleOptimization.scheduleFlexibility.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Hours Buffer Time</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>On-Time Delivery:</span>
                    <span className="font-medium">{results.scheduleOptimization.deliveryPerformance.onTimeDelivery.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Delay:</span>
                    <span className="font-medium">{results.scheduleOptimization.deliveryPerformance.averageDelay.toFixed(1)} hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.continuousImprovement.optimizationOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.continuousImprovement.bestPractices.map((practice, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{practice}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alerts and Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.alertsAndRecommendations.batchingAlerts.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Batching Alerts</h4>
                    <div className="space-y-1">
                      {results.alertsAndRecommendations.batchingAlerts.map((alert, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.alertsAndRecommendations.efficiencyImprovements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600">Efficiency Improvements</h4>
                    <div className="space-y-1">
                      {results.alertsAndRecommendations.efficiencyImprovements.map((improvement, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchProcessingCalculatorResults;
