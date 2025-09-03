import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Wrench, 
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

interface MaintenanceCostCalculatorResultsProps {
  results: {
    annualMaintenanceCost: {
      laborCost: number;
      spareParts: number;
      contractCost: number;
      downtimeCost: number;
      totalCost: number;
    };
    costBreakdown: {
      preventiveMaintenance: number;
      correctiveMaintenance: number;
      emergencyRepairs: number;
      upgrades: number;
    };
    maintenanceMetrics: {
      costPerOperatingHour: number;
      costAsPercentageOfValue: number;
      meanTimeBetweenFailures: number;
      meanTimeToRepair: number;
      availability: number;
    };
    strategyComparison: Array<{
      strategy: string;
      annualCost: number;
      availability: number;
      riskLevel: string;
      implementation: string;
    }>;
    optimizationOpportunities: {
      sparesOptimization: number;
      downtimeReduction: number;
      strategyImprovement: number;
      totalPotential: number;
      recommendations: string[];
    };
    maintenanceSchedule: {
      dailyTasks: string[];
      weeklyTasks: string[];
      monthlyTasks: string[];
      quarterlyTasks: string[];
      annualTasks: string[];
    };
    riskAssessment: {
      overallRisk: string;
      riskFactors: Array<{
        factor: string;
        level: string;
        impact: number;
        mitigation: string;
      }>;
      criticalComponents: string[];
    };
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
      costSaving: string[];
    };
    sensitivityAnalysis: {
      laborRateImpact: Array<{
        rate: number;
        cost: number;
        change: string;
      }>;
      downtimeImpact: Array<{
        hours: number;
        cost: number;
        change: string;
      }>;
      recommendations: string[];
    };
  };
}

const MaintenanceCostCalculatorResults: React.FC<MaintenanceCostCalculatorResultsProps> = ({ results }) => {
  const getCostColor = (percentage: number) => {
    if (percentage <= 3) return 'text-green-600';
    if (percentage <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 95) return 'text-green-600';
    if (availability >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy.toLowerCase()) {
      case 'reactive': return 'text-red-600';
      case 'preventive': return 'text-yellow-600';
      case 'predictive': return 'text-blue-600';
      case 'reliability_centered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${results.annualMaintenanceCost.totalCost.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Annual Cost</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className={`h-8 w-8 mx-auto mb-2 ${getAvailabilityColor(results.maintenanceMetrics.availability)}`} />
            <div className="text-2xl font-bold">{results.maintenanceMetrics.availability.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Availability</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getCostColor(results.maintenanceMetrics.costAsPercentageOfValue)}`} />
            <div className="text-2xl font-bold">{results.maintenanceMetrics.costAsPercentageOfValue.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">% of Asset Value</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">${results.optimizationOpportunities.totalPotential.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Savings Potential</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Annual Maintenance Cost</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Annual Cost</span>
                    <span className="font-semibold">${results.annualMaintenanceCost.totalCost.toFixed(0)}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Labor Cost:</span>
                    <span className="font-medium">${results.annualMaintenanceCost.laborCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spare Parts:</span>
                    <span className="font-medium">${results.annualMaintenanceCost.spareParts.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contract Cost:</span>
                    <span className="font-medium">${results.annualMaintenanceCost.contractCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downtime Cost:</span>
                    <span className="font-medium">${results.annualMaintenanceCost.downtimeCost.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Key Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Cost per Operating Hour:</span>
                  <span className="font-medium">${results.maintenanceMetrics.costPerOperatingHour.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>% of Asset Value:</span>
                  <span className={`font-medium ${getCostColor(results.maintenanceMetrics.costAsPercentageOfValue)}`}>
                    {results.maintenanceMetrics.costAsPercentageOfValue.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>MTBF:</span>
                  <span className="font-medium">{results.maintenanceMetrics.meanTimeBetweenFailures.toFixed(0)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>MTTR:</span>
                  <span className="font-medium">{results.maintenanceMetrics.meanTimeToRepair.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className={`font-medium ${getAvailabilityColor(results.maintenanceMetrics.availability)}`}>
                    {results.maintenanceMetrics.availability.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Maintenance Type Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">${results.costBreakdown.preventiveMaintenance.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Preventive</div>
                  <div className="text-xs text-muted-foreground">
                    {((results.costBreakdown.preventiveMaintenance / results.annualMaintenanceCost.totalCost) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">${results.costBreakdown.correctiveMaintenance.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Corrective</div>
                  <div className="text-xs text-muted-foreground">
                    {((results.costBreakdown.correctiveMaintenance / results.annualMaintenanceCost.totalCost) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">${results.costBreakdown.emergencyRepairs.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Emergency</div>
                  <div className="text-xs text-muted-foreground">
                    {((results.costBreakdown.emergencyRepairs / results.annualMaintenanceCost.totalCost) * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">${results.costBreakdown.upgrades.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Upgrades</div>
                  <div className="text-xs text-muted-foreground">
                    {((results.costBreakdown.upgrades / results.annualMaintenanceCost.totalCost) * 100).toFixed(0)}%
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
                <CardTitle>Cost Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Labor Cost</span>
                      <span className="text-sm font-medium">${results.annualMaintenanceCost.laborCost.toFixed(0)}</span>
                    </div>
                    <Progress 
                      value={(results.annualMaintenanceCost.laborCost / results.annualMaintenanceCost.totalCost) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Spare Parts</span>
                      <span className="text-sm font-medium">${results.annualMaintenanceCost.spareParts.toFixed(0)}</span>
                    </div>
                    <Progress 
                      value={(results.annualMaintenanceCost.spareParts / results.annualMaintenanceCost.totalCost) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Contract Cost</span>
                      <span className="text-sm font-medium">${results.annualMaintenanceCost.contractCost.toFixed(0)}</span>
                    </div>
                    <Progress 
                      value={(results.annualMaintenanceCost.contractCost / results.annualMaintenanceCost.totalCost) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Downtime Cost</span>
                      <span className="text-sm font-medium">${results.annualMaintenanceCost.downtimeCost.toFixed(0)}</span>
                    </div>
                    <Progress 
                      value={(results.annualMaintenanceCost.downtimeCost / results.annualMaintenanceCost.totalCost) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <div className="text-sm font-semibold text-green-800">Industry Best Practice</div>
                    <div className="text-xs text-green-700">2-4% of asset value annually</div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-sm font-semibold text-yellow-800">Your Current Cost</div>
                    <div className="text-xs text-yellow-700">
                      {results.maintenanceMetrics.costAsPercentageOfValue.toFixed(1)}% of asset value
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant={results.maintenanceMetrics.costAsPercentageOfValue <= 4 ? 'default' : 
                                   results.maintenanceMetrics.costAsPercentageOfValue <= 6 ? 'secondary' : 'destructive'}>
                      {results.maintenanceMetrics.costAsPercentageOfValue <= 4 ? 'EXCELLENT' :
                       results.maintenanceMetrics.costAsPercentageOfValue <= 6 ? 'GOOD' : 'NEEDS IMPROVEMENT'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Strategy Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.strategyComparison.map((strategy, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className={`font-semibold ${getStrategyColor(strategy.strategy)}`}>
                          {strategy.strategy.replace('_', ' ').toUpperCase()}
                        </h4>
                        <div className="text-sm text-muted-foreground">{strategy.implementation}</div>
                      </div>
                      <Badge variant={strategy.riskLevel === 'Low' ? 'default' : 
                                     strategy.riskLevel === 'Medium' ? 'secondary' : 'destructive'}>
                        {strategy.riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Annual Cost:</span>
                        <span className="font-medium ml-2">${strategy.annualCost.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Availability:</span>
                        <span className="font-medium ml-2">{strategy.availability.toFixed(1)}%</span>
                      </div>
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
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <Lightbulb className="h-5 w-5" />
                  <span>Optimization Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Spares Optimization:</span>
                    <span className="font-medium text-green-600">${results.optimizationOpportunities.sparesOptimization.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downtime Reduction:</span>
                    <span className="font-medium text-green-600">${results.optimizationOpportunities.downtimeReduction.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strategy Improvement:</span>
                    <span className="font-medium text-green-600">${results.optimizationOpportunities.strategyImprovement.toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total Potential:</span>
                    <span className="font-bold text-green-600">${results.optimizationOpportunities.totalPotential.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className={`text-2xl font-bold ${getRiskColor(results.riskAssessment.overallRisk)}`}>
                    {results.riskAssessment.overallRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Risk Level</div>
                </div>
                
                <div className="space-y-2">
                  {results.riskAssessment.riskFactors.slice(0, 3).map((risk, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span>{risk.factor}</span>
                        <Badge variant={risk.level === 'Low' ? 'default' : 
                                       risk.level === 'Medium' ? 'secondary' : 'destructive'}>
                          {risk.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.optimizationOpportunities.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily & Weekly Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-blue-600 mb-2">Daily Tasks</h5>
                    <div className="space-y-1">
                      {results.maintenanceSchedule.dailyTasks.map((task, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Settings className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-green-600 mb-2">Weekly Tasks</h5>
                    <div className="space-y-1">
                      {results.maintenanceSchedule.weeklyTasks.map((task, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Wrench className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly & Quarterly Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-yellow-600 mb-2">Monthly Tasks</h5>
                    <div className="space-y-1">
                      {results.maintenanceSchedule.monthlyTasks.map((task, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-purple-600 mb-2">Quarterly Tasks</h5>
                    <div className="space-y-1">
                      {results.maintenanceSchedule.quarterlyTasks.map((task, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Target className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Labor Rate Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.laborRateImpact.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">${item.rate}/hr</span>
                      <span className="text-sm font-medium">${item.cost.toFixed(0)}</span>
                      <span className="text-xs text-muted-foreground">{item.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Downtime Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.downtimeImpact.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.hours} hrs</span>
                      <span className="text-sm font-medium">${item.cost.toFixed(0)}</span>
                      <span className="text-xs text-muted-foreground">{item.change}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Action Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Immediate (0-30 days)</h5>
                  <div className="space-y-1">
                    {results.recommendations.immediate.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-yellow-600 mb-2">Short Term (1-6 months)</h5>
                  <div className="space-y-1">
                    {results.recommendations.shortTerm.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Long Term (6+ months)</h5>
                  <div className="space-y-1">
                    {results.recommendations.longTerm.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
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

export default MaintenanceCostCalculatorResults;
