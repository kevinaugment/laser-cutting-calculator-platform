import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Package, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Layers,
  Target
} from 'lucide-react';

interface MaterialNestingOptimizerResultsProps {
  results: {
    nestingPlan: Array<{
      sheetNumber: number;
      sheetSpec: any;
      partsPlaced: Array<{
        partId: string;
        partName: string;
        x: number;
        y: number;
        rotation: number;
        quantity: number;
      }>;
      utilization: number;
      wasteArea: number;
      cuttingTime: number;
      materialCost: number;
    }>;
    optimizationSummary: {
      totalSheets: number;
      totalMaterialCost: number;
      totalCuttingTime: number;
      overallUtilization: number;
      totalWasteArea: number;
      wasteValue: number;
    };
    materialEfficiency: {
      utilizationByMaterial: Array<{
        material: string;
        utilization: number;
        sheets: number;
      }>;
      wasteAnalysis: Array<{
        sheetNumber: number;
        wasteArea: number;
        wasteValue: number;
        reuseability: string;
      }>;
      improvementOpportunities: string[];
    };
    costAnalysis: {
      materialCosts: number;
      cuttingCosts: number;
      setupCosts: number;
      totalCosts: number;
      costPerPart: number;
      savingsVsWorstCase: number;
    };
    productionSchedule: Array<{
      sheetNumber: number;
      setupTime: number;
      cuttingTime: number;
      totalTime: number;
      startTime: number;
      completionTime: number;
    }>;
    qualityConsiderations: {
      grainDirectionCompliance: number;
      spacingAdequacy: number;
      thermalDistortionRisk: 'low' | 'medium' | 'high';
      recommendations: string[];
    };
    alternativeLayouts: Array<{
      layoutName: string;
      sheets: number;
      utilization: number;
      cost: number;
      time: number;
      description: string;
    }>;
  };
}

const MaterialNestingOptimizerResults: React.FC<MaterialNestingOptimizerResultsProps> = ({ results }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 85) return 'text-green-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Layers className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.optimizationSummary.totalSheets}</div>
            <div className="text-sm text-muted-foreground">Total Sheets</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getUtilizationColor(results.optimizationSummary.overallUtilization)}`} />
            <div className="text-2xl font-bold">{results.optimizationSummary.overallUtilization.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Material Utilization</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${results.costAnalysis.totalCosts.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{Math.round(results.optimizationSummary.totalCuttingTime)}</div>
            <div className="text-sm text-muted-foreground">Minutes</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="sheets">Sheet Layout</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
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
                    <span>Material Utilization</span>
                    <span className={`font-semibold ${getUtilizationColor(results.optimizationSummary.overallUtilization)}`}>
                      {results.optimizationSummary.overallUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={results.optimizationSummary.overallUtilization} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Sheets Required:</span>
                    <span className="font-medium">{results.optimizationSummary.totalSheets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cutting Time:</span>
                    <span className="font-medium">{Math.round(results.optimizationSummary.totalCuttingTime)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Area:</span>
                    <span className="font-medium">{Math.round(results.optimizationSummary.totalWasteArea / 1000)} cm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Value:</span>
                    <span className="font-medium text-red-600">${results.optimizationSummary.wasteValue.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Cost Savings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ${results.costAnalysis.savingsVsWorstCase.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Savings vs Worst Case</div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Material Costs:</span>
                    <span className="font-medium">${results.costAnalysis.materialCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cutting Costs:</span>
                    <span className="font-medium">${results.costAnalysis.cuttingCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Costs:</span>
                    <span className="font-medium">${results.costAnalysis.setupCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-semibold">Total Cost:</span>
                    <span className="font-semibold">${results.costAnalysis.totalCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Part:</span>
                    <span className="font-medium">${results.costAnalysis.costPerPart.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Quality Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.qualityConsiderations.grainDirectionCompliance.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Grain Direction Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.qualityConsiderations.spacingAdequacy}/5</div>
                  <div className="text-sm text-muted-foreground">Spacing Adequacy</div>
                </div>
                <div className="text-center">
                  <Badge variant={results.qualityConsiderations.thermalDistortionRisk === 'low' ? 'default' : 
                                 results.qualityConsiderations.thermalDistortionRisk === 'medium' ? 'secondary' : 'destructive'}>
                    {results.qualityConsiderations.thermalDistortionRisk.toUpperCase()} RISK
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Thermal Distortion</div>
                </div>
              </div>
              
              {results.qualityConsiderations.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Quality Recommendations:</h4>
                  <ul className="space-y-1 text-sm">
                    {results.qualityConsiderations.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sheets" className="space-y-4">
          <div className="grid gap-4">
            {results.nestingPlan.map((sheet) => (
              <Card key={sheet.sheetNumber}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Sheet #{sheet.sheetNumber}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{sheet.utilization.toFixed(1)}% Utilized</Badge>
                      <Badge variant="secondary">${sheet.materialCost.toFixed(2)}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Sheet Size</div>
                      <div className="font-medium">{sheet.sheetSpec.length} × {sheet.sheetSpec.width} mm</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Parts Count</div>
                      <div className="font-medium">{sheet.partsPlaced.reduce((sum, part) => sum + part.quantity, 0)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Cutting Time</div>
                      <div className="font-medium">{sheet.cuttingTime.toFixed(1)} min</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Waste Area</div>
                      <div className="font-medium">{Math.round(sheet.wasteArea / 1000)} cm²</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Parts Placed:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {sheet.partsPlaced.map((part, index) => (
                        <div key={index} className="flex justify-between p-2 bg-muted rounded">
                          <span>{part.partName} (×{part.quantity})</span>
                          <span className="text-muted-foreground">
                            {part.rotation > 0 && `${part.rotation}° rotated`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                    <span>Cutting Costs</span>
                    <span className="font-semibold">${results.costAnalysis.cuttingCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Setup Costs</span>
                    <span className="font-semibold">${results.costAnalysis.setupCosts.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-bold">Total Cost</span>
                    <span className="font-bold text-lg">${results.costAnalysis.totalCosts.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternative Layouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.alternativeLayouts.map((layout, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="font-semibold">{layout.layoutName}</div>
                      <div className="text-sm text-muted-foreground">{layout.description}</div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>Sheets: {layout.sheets}</div>
                        <div>Cost: ${layout.cost.toFixed(2)}</div>
                        <div>Utilization: {layout.utilization.toFixed(1)}%</div>
                        <div>Time: {layout.time.toFixed(0)} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Efficiency Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Utilization by Material</h4>
                  <div className="space-y-2">
                    {results.materialEfficiency.utilizationByMaterial.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="capitalize">{material.material.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <span>{material.utilization.toFixed(1)}%</span>
                          <Badge variant="outline">{material.sheets} sheets</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {results.materialEfficiency.improvementOpportunities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Improvement Opportunities</h4>
                    <ul className="space-y-1 text-sm">
                      {results.materialEfficiency.improvementOpportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.productionSchedule.map((schedule) => (
                  <div key={schedule.sheetNumber} className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Sheet #{schedule.sheetNumber}</span>
                      <Badge variant="outline">{schedule.totalTime.toFixed(0)} min total</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Setup:</span>
                        <span className="ml-1">{schedule.setupTime.toFixed(0)} min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cutting:</span>
                        <span className="ml-1">{schedule.cuttingTime.toFixed(0)} min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Start:</span>
                        <span className="ml-1">{schedule.startTime.toFixed(1)}h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Complete:</span>
                        <span className="ml-1">{schedule.completionTime.toFixed(1)}h</span>
                      </div>
                    </div>
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

export default MaterialNestingOptimizerResults;
