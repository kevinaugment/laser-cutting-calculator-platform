import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Wind, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Lightbulb,
  Settings
} from 'lucide-react';

interface GasConsumptionCalculatorResultsProps {
  results: {
    totalConsumption: number; // m³
    consumptionBreakdown: {
      cuttingConsumption: number;
      piercingConsumption: number;
      setupConsumption: number;
      idleConsumption: number;
    };
    totalCost: number;
    costBreakdown: {
      cuttingCost: number;
      piercingCost: number;
      setupCost: number;
      idleCost: number;
    };
    efficiency: {
      utilizationRate: number; // %
      wasteReduction: number; // potential reduction %
      optimizationPotential: number; // cost savings %
    };
    unitCosts: {
      costPerMeter: number;
      costPerPiece: number;
      costPerHour: number;
    };
    gasProperties: {
      gasType: string;
      purity: number;
      density: number;
      thermalConductivity: number;
      suitability: string;
    };
    alternativeGasOptions: Array<{
      gasType: string;
      estimatedCost: number;
      qualityImpact: string;
      consumptionChange: number;
      recommendation: string;
    }>;
    optimizationRecommendations: {
      flowOptimization: string[];
      pressureOptimization: string[];
      timingOptimization: string[];
      costSavingTips: string[];
    };
    sensitivityAnalysis: {
      flowRateImpact: Array<{
        flowRate: number;
        consumption: number;
        cost: number;
        change: string;
      }>;
      pressureImpact: Array<{
        pressure: number;
        consumption: number;
        cost: number;
        change: string;
      }>;
    };
    benchmarkComparison: {
      industryAverage: {
        consumptionPerMeter: number;
        costPerMeter: number;
        efficiency: number;
      };
      yourPerformance: {
        consumptionPerMeter: number;
        costPerMeter: number;
        efficiency: number;
      };
      performanceRating: string;
    };
  };
}

const GasConsumptionCalculatorResults: React.FC<GasConsumptionCalculatorResultsProps> = ({ results }) => {
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Wind className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.totalConsumption.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">m³ Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${results.totalCost.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Cost</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getEfficiencyColor(results.efficiency.utilizationRate)}`} />
            <div className="text-2xl font-bold">{results.efficiency.utilizationRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.efficiency.optimizationPotential.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Savings Potential</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Consumption Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Consumption</span>
                    <span className="font-semibold">{results.totalConsumption.toFixed(2)} m³</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cutting:</span>
                    <span className="font-medium">{results.consumptionBreakdown.cuttingConsumption.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Piercing:</span>
                    <span className="font-medium">{results.consumptionBreakdown.piercingConsumption.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup:</span>
                    <span className="font-medium">{results.consumptionBreakdown.setupConsumption.toFixed(2)} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idle:</span>
                    <span className="font-medium">{results.consumptionBreakdown.idleConsumption.toFixed(2)} m³</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Cost Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">${results.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost per Meter:</span>
                  <span className="font-medium">${results.unitCosts.costPerMeter.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost per Piece:</span>
                  <span className="font-medium">${results.unitCosts.costPerPiece.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost per Hour:</span>
                  <span className="font-medium">${results.unitCosts.costPerHour.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gas Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Gas Properties - {results.gasProperties.gasType.toUpperCase()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{results.gasProperties.purity.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Purity</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{results.gasProperties.density.toFixed(3)}</div>
                  <div className="text-sm text-muted-foreground">Density (kg/m³)</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{results.gasProperties.thermalConductivity.toFixed(3)}</div>
                  <div className="text-sm text-muted-foreground">Thermal Conductivity</div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${getSuitabilityColor(results.gasProperties.suitability)}`}>
                    {results.gasProperties.suitability}
                  </div>
                  <div className="text-sm text-muted-foreground">Suitability</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Consumption Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Cutting</span>
                      <span className="text-sm font-medium">{results.consumptionBreakdown.cuttingConsumption.toFixed(2)} m³</span>
                    </div>
                    <Progress 
                      value={(results.consumptionBreakdown.cuttingConsumption / results.totalConsumption) * 100} 
                      className="h-2" 
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {((results.consumptionBreakdown.cuttingConsumption / results.totalConsumption) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Piercing</span>
                      <span className="text-sm font-medium">{results.consumptionBreakdown.piercingConsumption.toFixed(2)} m³</span>
                    </div>
                    <Progress 
                      value={(results.consumptionBreakdown.piercingConsumption / results.totalConsumption) * 100} 
                      className="h-2" 
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {((results.consumptionBreakdown.piercingConsumption / results.totalConsumption) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Setup</span>
                      <span className="text-sm font-medium">{results.consumptionBreakdown.setupConsumption.toFixed(2)} m³</span>
                    </div>
                    <Progress 
                      value={(results.consumptionBreakdown.setupConsumption / results.totalConsumption) * 100} 
                      className="h-2" 
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {((results.consumptionBreakdown.setupConsumption / results.totalConsumption) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Idle Time</span>
                      <span className="text-sm font-medium">{results.consumptionBreakdown.idleConsumption.toFixed(2)} m³</span>
                    </div>
                    <Progress 
                      value={(results.consumptionBreakdown.idleConsumption / results.totalConsumption) * 100} 
                      className="h-2" 
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {((results.consumptionBreakdown.idleConsumption / results.totalConsumption) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Cutting Cost:</span>
                    <span className="font-medium">${results.costBreakdown.cuttingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Piercing Cost:</span>
                    <span className="font-medium">${results.costBreakdown.piercingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Cost:</span>
                    <span className="font-medium">${results.costBreakdown.setupCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idle Cost:</span>
                    <span className="font-medium">${results.costBreakdown.idleCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${results.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-2xl font-bold ${getEfficiencyColor(results.efficiency.utilizationRate)}`}>
                    {results.efficiency.utilizationRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Utilization Rate</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Productive vs total consumption
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{results.efficiency.wasteReduction.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Waste Reduction</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Potential waste elimination
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{results.efficiency.optimizationPotential.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Cost Savings</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Optimization potential
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alternatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alternative Gas Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.alternativeGasOptions.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-blue-600">{option.gasType.toUpperCase()}</h4>
                        <div className="text-sm text-muted-foreground">{option.qualityImpact}</div>
                      </div>
                      <Badge variant={option.consumptionChange < 0 ? 'default' : 'secondary'}>
                        {option.consumptionChange > 0 ? '+' : ''}{option.consumptionChange.toFixed(0)}% consumption
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Estimated Cost:</span>
                        <span className="font-medium ml-2">${option.estimatedCost.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost Change:</span>
                        <span className={`font-medium ml-2 ${option.estimatedCost < results.totalCost ? 'text-green-600' : 'text-red-600'}`}>
                          {option.estimatedCost < results.totalCost ? '-' : '+'}${Math.abs(option.estimatedCost - results.totalCost).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-blue-800 bg-blue-50 p-2 rounded">
                      <strong>Recommendation:</strong> {option.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <Settings className="h-5 w-5" />
                  <span>Flow Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.optimizationRecommendations.flowOptimization.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <Target className="h-5 w-5" />
                  <span>Pressure Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.optimizationRecommendations.pressureOptimization.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-600">
                  <Lightbulb className="h-5 w-5" />
                  <span>Timing Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.optimizationRecommendations.timingOptimization.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600">
                  <DollarSign className="h-5 w-5" />
                  <span>Cost Saving Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.optimizationRecommendations.costSavingTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Flow Rate Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.flowRateImpact.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.flowRate} L/min</span>
                      <span className="text-sm font-medium">${item.cost.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">{item.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pressure Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.pressureImpact.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.pressure} bar</span>
                      <span className="text-sm font-medium">${item.cost.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">{item.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Consumption per Meter</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Industry Average</div>
                      <div className="text-lg font-semibold">{results.benchmarkComparison.industryAverage.consumptionPerMeter.toFixed(3)} m³/m</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Your Performance</div>
                      <div className="text-lg font-semibold text-blue-600">{results.benchmarkComparison.yourPerformance.consumptionPerMeter.toFixed(3)} m³/m</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Cost per Meter</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Industry Average</div>
                      <div className="text-lg font-semibold">${results.benchmarkComparison.industryAverage.costPerMeter.toFixed(3)}/m</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Your Performance</div>
                      <div className="text-lg font-semibold text-blue-600">${results.benchmarkComparison.yourPerformance.costPerMeter.toFixed(3)}/m</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Efficiency</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Industry Average</div>
                      <div className="text-lg font-semibold">{results.benchmarkComparison.industryAverage.efficiency.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Your Performance</div>
                      <div className={`text-lg font-semibold ${getEfficiencyColor(results.benchmarkComparison.yourPerformance.efficiency)}`}>
                        {results.benchmarkComparison.yourPerformance.efficiency.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Badge variant={results.benchmarkComparison.performanceRating === 'Excellent' ? 'default' : 
                               results.benchmarkComparison.performanceRating === 'Good' ? 'secondary' : 'outline'}>
                  {results.benchmarkComparison.performanceRating} Performance
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GasConsumptionCalculatorResults;
