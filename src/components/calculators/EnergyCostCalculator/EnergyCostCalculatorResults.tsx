import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Zap, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Clock,
  Settings,
  Lightbulb
} from 'lucide-react';

interface EnergyCostCalculatorResultsProps {
  results: {
    energyConsumption: {
      laserConsumption: number;
      auxiliaryConsumption: number;
      hvacConsumption: number;
      standbyConsumption: number;
      totalConsumption: number;
    };
    energyCosts: {
      laserCost: number;
      auxiliaryCost: number;
      hvacCost: number;
      standbyCost: number;
      demandCost: number;
      totalMonthlyCost: number;
      annualCost: number;
    };
    demandAnalysis: {
      peakDemand: number;
      averageDemand: number;
      loadFactor: number;
      demandOptimizationPotential: number;
    };
    costBreakdown: {
      energyCostPerHour: number;
      energyCostPerPart: number;
      energyCostPercentage: number;
    };
    efficiencyAnalysis: {
      overallEfficiency: number;
      powerUtilization: number;
      wastedEnergy: number;
      wastedCost: number;
    };
    optimizationRecommendations: {
      demandManagement: string[];
      efficiencyImprovements: string[];
      costReductions: string[];
      potentialSavings: number;
    };
    timeOfUseAnalysis: {
      peakHoursCost: number;
      offPeakHoursCost: number;
      shiftingPotential: number;
    };
  };
}

const EnergyCostCalculatorResults: React.FC<EnergyCostCalculatorResultsProps> = ({ results }) => {
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLoadFactorColor = (loadFactor: number) => {
    if (loadFactor >= 75) return 'text-green-600';
    if (loadFactor >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${results.energyCosts.totalMonthlyCost.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Monthly Cost</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.energyConsumption.totalConsumption.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">kWh/Month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getEfficiencyColor(results.efficiencyAnalysis.overallEfficiency)}`} />
            <div className="text-2xl font-bold">{results.efficiencyAnalysis.overallEfficiency.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">${results.optimizationRecommendations.potentialSavings.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Potential Savings</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="demand">Demand</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Cost Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monthly Energy Cost</span>
                    <span className="font-semibold">${results.energyCosts.totalMonthlyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Energy Cost</span>
                    <span className="font-semibold">${results.energyCosts.annualCost.toFixed(0)}</span>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Laser Cost:</span>
                    <span className="font-medium">${results.energyCosts.laserCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auxiliary Cost:</span>
                    <span className="font-medium">${results.energyCosts.auxiliaryCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HVAC Cost:</span>
                    <span className="font-medium">${results.energyCosts.hvacCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standby Cost:</span>
                    <span className="font-medium">${results.energyCosts.standbyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demand Cost:</span>
                    <span className="font-medium">${results.energyCosts.demandCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Efficiency</span>
                    <span className={`font-semibold ${getEfficiencyColor(results.efficiencyAnalysis.overallEfficiency)}`}>
                      {results.efficiencyAnalysis.overallEfficiency.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={results.efficiencyAnalysis.overallEfficiency} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Load Factor:</span>
                    <span className={`font-medium ${getLoadFactorColor(results.demandAnalysis.loadFactor)}`}>
                      {results.demandAnalysis.loadFactor.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Power Utilization:</span>
                    <span className="font-medium">{results.efficiencyAnalysis.powerUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Hour:</span>
                    <span className="font-medium">${results.costBreakdown.energyCostPerHour.toFixed(2)}</span>
                  </div>
                  {results.costBreakdown.energyCostPerPart > 0 && (
                    <div className="flex justify-between">
                      <span>Cost per Part:</span>
                      <span className="font-medium">${results.costBreakdown.energyCostPerPart.toFixed(3)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Waste Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Energy Waste Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">{results.efficiencyAnalysis.wastedEnergy.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">kWh Wasted/Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">${results.efficiencyAnalysis.wastedCost.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Waste Cost/Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">${results.optimizationRecommendations.potentialSavings.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Potential Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Laser Consumption</span>
                    <span className="text-sm font-medium">{results.energyConsumption.laserConsumption.toFixed(0)} kWh</span>
                  </div>
                  <Progress 
                    value={(results.energyConsumption.laserConsumption / results.energyConsumption.totalConsumption) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Auxiliary Systems</span>
                    <span className="text-sm font-medium">{results.energyConsumption.auxiliaryConsumption.toFixed(0)} kWh</span>
                  </div>
                  <Progress 
                    value={(results.energyConsumption.auxiliaryConsumption / results.energyConsumption.totalConsumption) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">HVAC Systems</span>
                    <span className="text-sm font-medium">{results.energyConsumption.hvacConsumption.toFixed(0)} kWh</span>
                  </div>
                  <Progress 
                    value={(results.energyConsumption.hvacConsumption / results.energyConsumption.totalConsumption) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Standby Power</span>
                    <span className="text-sm font-medium">{results.energyConsumption.standbyConsumption.toFixed(0)} kWh</span>
                  </div>
                  <Progress 
                    value={(results.energyConsumption.standbyConsumption / results.energyConsumption.totalConsumption) * 100} 
                    className="h-2" 
                  />
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Consumption</span>
                    <span className="font-semibold text-lg">{results.energyConsumption.totalConsumption.toFixed(0)} kWh</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Laser Energy Cost:</span>
                    <span className="font-medium">${results.energyCosts.laserCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auxiliary Systems:</span>
                    <span className="font-medium">${results.energyCosts.auxiliaryCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HVAC Systems:</span>
                    <span className="font-medium">${results.energyCosts.hvacCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standby Power:</span>
                    <span className="font-medium">${results.energyCosts.standbyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Demand Charges:</span>
                    <span className="font-medium">${results.energyCosts.demandCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total Monthly:</span>
                    <span className="font-bold text-lg">${results.energyCosts.totalMonthlyCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time-of-Use Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Peak Hours Cost:</span>
                    <span className="font-medium">${results.timeOfUseAnalysis.peakHoursCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Off-Peak Hours Cost:</span>
                    <span className="font-medium">${results.timeOfUseAnalysis.offPeakHoursCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shifting Potential:</span>
                    <span className="font-medium text-green-600">${results.timeOfUseAnalysis.shiftingPotential.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demand" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Demand Characteristics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Peak Demand:</span>
                    <span className="font-medium">{results.demandAnalysis.peakDemand.toFixed(1)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Demand:</span>
                    <span className="font-medium">{results.demandAnalysis.averageDemand.toFixed(1)} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Load Factor:</span>
                    <span className={`font-medium ${getLoadFactorColor(results.demandAnalysis.loadFactor)}`}>
                      {results.demandAnalysis.loadFactor.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Optimization Potential:</span>
                    <span className="font-medium text-green-600">${results.demandAnalysis.demandOptimizationPotential.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demand Cost Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold">${results.energyCosts.demandCost.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Monthly Demand Cost</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {((results.energyCosts.demandCost / results.energyCosts.totalMonthlyCost) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">of Total Energy Cost</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Overall Efficiency</span>
                      <span className="text-sm font-medium">{results.efficiencyAnalysis.overallEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.efficiencyAnalysis.overallEfficiency} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Power Utilization</span>
                      <span className="text-sm font-medium">{results.efficiencyAnalysis.powerUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.efficiencyAnalysis.powerUtilization} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waste Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Wasted Energy:</span>
                    <span className="font-medium text-red-600">{results.efficiencyAnalysis.wastedEnergy.toFixed(0)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Cost:</span>
                    <span className="font-medium text-red-600">${results.efficiencyAnalysis.wastedCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Waste:</span>
                    <span className="font-medium text-red-600">${(results.efficiencyAnalysis.wastedCost * 12).toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <Settings className="h-5 w-5" />
                  <span>Demand Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.optimizationRecommendations.demandManagement.map((rec, index) => (
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
                  <Lightbulb className="h-5 w-5" />
                  <span>Efficiency Improvements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.optimizationRecommendations.efficiencyImprovements.map((rec, index) => (
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
                  <DollarSign className="h-5 w-5" />
                  <span>Cost Reductions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.optimizationRecommendations.costReductions.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Potential Savings Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${results.optimizationRecommendations.potentialSavings.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">Monthly Savings Potential</div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">${(results.optimizationRecommendations.potentialSavings * 12).toFixed(0)}</div>
                    <div className="text-sm text-muted-foreground">Annual Savings</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {((results.optimizationRecommendations.potentialSavings / results.energyCosts.totalMonthlyCost) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Cost Reduction</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {(results.optimizationRecommendations.potentialSavings / results.costBreakdown.energyCostPerHour).toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Hours of Free Operation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnergyCostCalculatorResults;
