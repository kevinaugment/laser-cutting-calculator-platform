import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Clock, 
  Target, 
  BarChart3, 
  Settings,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

interface JobQueueOptimizerResultsProps {
  results: {
    optimizedSchedule: Array<{
      jobId: string;
      jobName: string;
      assignedMachine: string;
      scheduledStart: string;
      scheduledEnd: string;
      estimatedDuration: number;
      setupTime: number;
      priority: string;
      sequenceNumber: number;
      bufferTime: number;
    }>;
    performanceMetrics: {
      totalMakespan: number;
      averageWaitTime: number;
      machineUtilization: Array<{ machineId: string; utilization: number }>;
      onTimeDeliveryRate: number;
      totalTardiness: number;
      throughputRate: number;
      averageFlowTime: number;
    };
    resourceUtilization: {
      operatorUtilization: number;
      machineEfficiency: { machineId: string; efficiency: number; bottleneck: boolean }[];
      materialUsage: { materialType: string; utilization: number; shortage: boolean }[];
      toolingUtilization: { toolType: string; utilization: number; availability: boolean }[];
      shiftCoverage: { shiftId: string; coverage: number; overtime: boolean }[];
    };
    costAnalysis: {
      totalOperatingCost: number;
      overtimeCost: number;
      setupCost: number;
      tardinessPenalty: number;
      opportunityCost: number;
      profitOptimization: number;
      costBreakdown: { category: string; amount: number; percentage: number }[];
    };
    riskAssessment: {
      scheduleRisk: 'low' | 'medium' | 'high' | 'critical';
      riskFactors: string[];
      contingencyPlans: string[];
      bufferAdequacy: number;
      deliveryRisk: { jobId: string; riskLevel: string; mitigation: string }[];
    };
    optimizationInsights: {
      improvementAreas: string[];
      bottleneckIdentification: string[];
      capacityRecommendations: string[];
      processImprovements: string[];
      schedulingStrategies: string[];
    };
    alternativeSchedules: Array<{
      scenarioName: string;
      description: string;
      makespan: number;
      onTimeRate: number;
      totalCost: number;
      tradeoffs: string[];
    }>;
    realTimeAdjustments: {
      dynamicRescheduling: boolean;
      triggerConditions: string[];
      adjustmentStrategies: string[];
      monitoringParameters: string[];
    };
    customerImpact: {
      customerSatisfactionScore: number;
      deliveryPerformance: Array<{ customerId: string; onTimeRate: number; satisfaction: number }>;
      communicationPlan: Array<{ jobId: string; customerNotification: string; timing: string }>;
    };
    alertsAndRecommendations: {
      urgentActions: string[];
      capacityWarnings: string[];
      qualityAlerts: string[];
      efficiencyImprovements: string[];
      schedulingTips: string[];
    };
  };
}

const JobQueueOptimizerResults: React.FC<JobQueueOptimizerResultsProps> = ({ results }) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.performanceMetrics.totalMakespan.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Total Hours</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{results.performanceMetrics.onTimeDeliveryRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">On-Time Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {(results.performanceMetrics.machineUtilization.reduce((sum, m) => sum + m.utilization, 0) / results.performanceMetrics.machineUtilization.length).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Utilization</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${getRiskColor(results.riskAssessment.scheduleRisk)}`} />
            <div className={`text-2xl font-bold ${getRiskColor(results.riskAssessment.scheduleRisk)}`}>
              {results.riskAssessment.scheduleRisk.toUpperCase()}
            </div>
            <div className="text-sm text-muted-foreground">Schedule Risk</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Optimized Schedule ({results.optimizedSchedule.length} jobs)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.optimizedSchedule.map((job, index) => (
                  <Card key={job.jobId} className="p-3 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{job.jobName}</span>
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Sequence #{job.sequenceNumber} • Machine: {job.assignedMachine}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{formatDuration(job.estimatedDuration)}</div>
                        <div className="text-muted-foreground">Duration</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Start Time</div>
                        <div className="font-medium">{formatDateTime(job.scheduledStart)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">End Time</div>
                        <div className="font-medium">{formatDateTime(job.scheduledEnd)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Setup Time</div>
                        <div className="font-medium">{formatDuration(job.setupTime)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Buffer Time</div>
                        <div className="font-medium">{formatDuration(job.bufferTime)}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Makespan:</span>
                    <span className="font-medium">{results.performanceMetrics.totalMakespan.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Wait Time:</span>
                    <span className="font-medium">{results.performanceMetrics.averageWaitTime.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-Time Delivery Rate:</span>
                    <span className="font-medium">{results.performanceMetrics.onTimeDeliveryRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Tardiness:</span>
                    <span className="font-medium">{results.performanceMetrics.totalTardiness.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput Rate:</span>
                    <span className="font-medium">{results.performanceMetrics.throughputRate.toFixed(1)} jobs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Flow Time:</span>
                    <span className="font-medium">{results.performanceMetrics.averageFlowTime.toFixed(1)} hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Machine Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.performanceMetrics.machineUtilization.map((machine, index) => (
                    <div key={machine.machineId}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{machine.machineId}</span>
                        <span className="text-sm">{machine.utilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={machine.utilization} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {results.customerImpact.customerSatisfactionScore.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Customer Satisfaction Score</div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Delivery Performance</h5>
                  <div className="space-y-2">
                    {results.customerImpact.deliveryPerformance.map((customer, index) => (
                      <div key={customer.customerId} className="flex justify-between items-center text-sm">
                        <span>{customer.customerId}</span>
                        <div className="text-right">
                          <div>On-Time: {customer.onTimeRate}%</div>
                          <div className="text-muted-foreground">Satisfaction: {customer.satisfaction}/10</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Operator Utilization</span>
                      <span className="text-sm">{results.resourceUtilization.operatorUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.resourceUtilization.operatorUtilization} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Machine Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.resourceUtilization.machineEfficiency.map((machine, index) => (
                    <div key={machine.machineId} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{machine.machineId}</span>
                        {machine.bottleneck && (
                          <Badge variant="outline" className="text-red-600">Bottleneck</Badge>
                        )}
                      </div>
                      <span className="font-medium">{machine.efficiency.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Material Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.resourceUtilization.materialUsage.map((material, index) => (
                    <div key={material.materialType} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{material.materialType}</span>
                        {material.shortage && (
                          <Badge variant="outline" className="text-red-600">Shortage</Badge>
                        )}
                      </div>
                      <span className="font-medium">{material.utilization.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shift Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.resourceUtilization.shiftCoverage.map((shift, index) => (
                    <div key={shift.shiftId} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{shift.shiftId}</span>
                        {shift.overtime && (
                          <Badge variant="outline" className="text-orange-600">Overtime</Badge>
                        )}
                      </div>
                      <span className="font-medium">{shift.coverage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Cost Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      ${results.costAnalysis.totalOperatingCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Operating Cost</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overtime Cost:</span>
                      <span className="font-medium">${results.costAnalysis.overtimeCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Setup Cost:</span>
                      <span className="font-medium">${results.costAnalysis.setupCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tardiness Penalty:</span>
                      <span className="font-medium">${results.costAnalysis.tardinessPenalty.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Opportunity Cost:</span>
                      <span className="font-medium">${results.costAnalysis.opportunityCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Profit Optimization:</span>
                      <span className="font-medium">+${results.costAnalysis.profitOptimization.toLocaleString()}</span>
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
                  {results.costAnalysis.costBreakdown.map((item, index) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm">{item.percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        ${item.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Risk Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getRiskColor(results.riskAssessment.scheduleRisk)}`}>
                    {results.riskAssessment.scheduleRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Schedule Risk Level</div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Risk Factors</h5>
                  <div className="space-y-1">
                    {results.riskAssessment.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Contingency Plans</h5>
                  <div className="space-y-1">
                    {results.riskAssessment.contingencyPlans.map((plan, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{plan}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Buffer Adequacy</span>
                    <span className="text-sm">{results.riskAssessment.bufferAdequacy.toFixed(1)}%</span>
                  </div>
                  <Progress value={results.riskAssessment.bufferAdequacy} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.riskAssessment.deliveryRisk.map((risk, index) => (
                  <Card key={risk.jobId} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{risk.jobId}</span>
                      <Badge className={getRiskColor(risk.riskLevel).replace('text-', 'bg-').replace('-600', '-100') + ' ' + getRiskColor(risk.riskLevel).replace('-600', '-800')}>
                        {risk.riskLevel}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-600">
                <Lightbulb className="h-5 w-5" />
                <span>Optimization Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Improvement Areas</h5>
                  <div className="space-y-1">
                    {results.optimizationInsights.improvementAreas.map((area, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Bottleneck Identification</h5>
                  <div className="space-y-1">
                    {results.optimizationInsights.bottleneckIdentification.map((bottleneck, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{bottleneck}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Capacity Recommendations</h5>
                  <div className="space-y-1">
                    {results.optimizationInsights.capacityRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Settings className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-purple-600 mb-2">Process Improvements</h5>
                  <div className="space-y-1">
                    {results.optimizationInsights.processImprovements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Activity className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alternative Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.alternativeSchedules.map((scenario, index) => (
                  <Card key={scenario.scenarioName} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{scenario.scenarioName}</h5>
                        <div className="text-sm text-muted-foreground">{scenario.description}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                      <div>
                        <div className="text-muted-foreground">Makespan</div>
                        <div className="font-medium">{scenario.makespan} hours</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">On-Time Rate</div>
                        <div className="font-medium">{scenario.onTimeRate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total Cost</div>
                        <div className="font-medium">${scenario.totalCost.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Tradeoffs:</div>
                      <div className="text-sm text-muted-foreground">
                        {scenario.tradeoffs.join(', ')}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-Time Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Dynamic Rescheduling Enabled</span>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Trigger Conditions</h5>
                  <div className="space-y-1">
                    {results.realTimeAdjustments.triggerConditions.map((condition, index) => (
                      <div key={index} className="text-sm text-muted-foreground">• {condition}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Adjustment Strategies</h5>
                  <div className="space-y-1">
                    {results.realTimeAdjustments.adjustmentStrategies.map((strategy, index) => (
                      <div key={index} className="text-sm text-muted-foreground">• {strategy}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Monitoring Parameters</h5>
                  <div className="space-y-1">
                    {results.realTimeAdjustments.monitoringParameters.map((param, index) => (
                      <div key={index} className="text-sm text-muted-foreground">• {param}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Alerts & Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Urgent Actions</h5>
                  <div className="space-y-1">
                    {results.alertsAndRecommendations.urgentActions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-yellow-600 mb-2">Capacity Warnings</h5>
                  <div className="space-y-1">
                    {results.alertsAndRecommendations.capacityWarnings.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Efficiency Improvements</h5>
                  <div className="space-y-1">
                    {results.alertsAndRecommendations.efficiencyImprovements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Scheduling Tips</h5>
                  <div className="space-y-1">
                    {results.alertsAndRecommendations.schedulingTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
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

export default JobQueueOptimizerResults;
