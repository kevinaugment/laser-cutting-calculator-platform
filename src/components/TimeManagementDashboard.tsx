import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Target } from 'lucide-react';

interface TimeManagementDashboardProps {
  calculatorResults?: {
    setupTimeOptimizer?: any;
    jobSchedulingOptimizer?: any;
    workflowOptimizer?: any;
    downtimeAnalyzer?: any;
    batchOptimizer?: any;
  };
}

export const TimeManagementDashboard: React.FC<TimeManagementDashboardProps> = ({ calculatorResults }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'scheduling' | 'workflow' | 'downtime' | 'batching'>('overview');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-600';
    if (efficiency >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Sample data for demonstration
  const overviewMetrics = {
    totalSetupTime: calculatorResults?.setupTimeOptimizer?.timeImpact?.projectedSetupTime || 45,
    schedulingEfficiency: calculatorResults?.jobSchedulingOptimizer?.aiOptimization?.efficiencyGain || 87.5,
    workflowEfficiency: calculatorResults?.workflowOptimizer?.aiEnhancement?.efficiencyScore || 82.3,
    downtimeReduction: calculatorResults?.downtimeAnalyzer?.aiEnhancement?.riskScore ? (100 - calculatorResults.downtimeAnalyzer.aiEnhancement.riskScore) : 78.9,
    batchOptimization: calculatorResults?.batchOptimizer?.aiEnhancement?.utilizationRate || 91.2,
  };

  const timeDistributionData = [
    { name: 'Setup', value: overviewMetrics.totalSetupTime, color: '#8884d8' },
    { name: 'Production', value: 180, color: '#82ca9d' },
    { name: 'Quality Check', value: 25, color: '#ffc658' },
    { name: 'Material Handling', value: 35, color: '#ff7300' },
    { name: 'Downtime', value: 15, color: '#ff0000' },
  ];

  const efficiencyTrendData = [
    { time: '9:00', setup: 85, scheduling: 88, workflow: 82, batch: 90 },
    { time: '10:00', setup: 87, scheduling: 89, workflow: 84, batch: 91 },
    { time: '11:00', setup: 89, scheduling: 91, workflow: 86, batch: 93 },
    { time: '12:00', setup: 88, scheduling: 90, workflow: 85, batch: 92 },
    { time: '13:00', setup: 90, scheduling: 92, workflow: 87, batch: 94 },
    { time: '14:00', setup: 92, scheduling: 94, workflow: 89, batch: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Time Management Dashboard</h2>
        <div className="flex space-x-2">
          <Button
            variant={timeframe === 'day' ? 'default' : 'outline'}
            onClick={() => setTimeframe('day')}
          >
            Day
          </Button>
          <Button
            variant={timeframe === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeframe('week')}
          >
            Week
          </Button>
          <Button
            variant={timeframe === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeframe('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setup Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(overviewMetrics.totalSetupTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              15% reduction from optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduling Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(overviewMetrics.schedulingEfficiency)}`}>
              {formatPercentage(overviewMetrics.schedulingEfficiency)}
            </div>
            <p className="text-xs text-muted-foreground">
              AI-optimized scheduling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflow Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(overviewMetrics.workflowEfficiency)}`}>
              {formatPercentage(overviewMetrics.workflowEfficiency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Bottleneck analysis active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downtime Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(overviewMetrics.downtimeReduction)}
            </div>
            <p className="text-xs text-muted-foreground">
              Predictive maintenance active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batch Optimization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(overviewMetrics.batchOptimization)}`}>
              {formatPercentage(overviewMetrics.batchOptimization)}
            </div>
            <p className="text-xs text-muted-foreground">
              AI batch grouping
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Insights */}
      {calculatorResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Optimization Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calculatorResults.jobSchedulingOptimizer?.optimization?.recommendations?.slice(0, 3).map((rec: any, index: number) => (
                  <Alert key={index} className="border-l-4 border-blue-500">
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>{rec.type}: </strong>
                          {rec.description}
                        </div>
                        <Badge variant="outline">{rec.effort} effort</Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
                
                {calculatorResults.workflowOptimizer?.enhancement?.predictiveInsights?.slice(0, 2).map((insight: any, index: number) => (
                  <Alert key={`workflow-${index}`} className="border-l-4 border-green-500">
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>Workflow: </strong>
                          {insight.insight}
                        </div>
                        <Badge variant="outline">{insight.confidence}% confidence</Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predictive Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calculatorResults.downtimeAnalyzer?.aiEnhancement?.preventiveActions?.slice(0, 3).map((action: any, index: number) => (
                  <Alert key={index} className={`border-l-4 ${
                    action.priority === 'urgent' ? 'border-red-500' :
                    action.priority === 'high' ? 'border-yellow-500' : 'border-blue-500'
                  }`}>
                    {getStatusIcon(action.priority)}
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>{action.action}</strong>
                          <p className="text-sm text-gray-600 mt-1">{action.expectedImpact}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={action.priority === 'urgent' ? 'destructive' : 'default'}>
                            {action.priority}
                          </Badge>
                          <Badge variant="outline">{action.timeframe}</Badge>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="downtime">Downtime</TabsTrigger>
          <TabsTrigger value="batching">Batching</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={timeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {timeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatTime(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={efficiencyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="setup" stroke="#8884d8" name="Setup" />
                    <Line type="monotone" dataKey="scheduling" stroke="#82ca9d" name="Scheduling" />
                    <Line type="monotone" dataKey="workflow" stroke="#ffc658" name="Workflow" />
                    <Line type="monotone" dataKey="batch" stroke="#ff7300" name="Batching" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          {calculatorResults?.jobSchedulingOptimizer && (
            <Card>
              <CardHeader>
                <CardTitle>Advanced Job Scheduling Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculatorResults.jobSchedulingOptimizer.optimization?.setupReduction || 0}
                    </div>
                    <div className="text-sm text-gray-500">Minutes Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(calculatorResults.jobSchedulingOptimizer.optimization?.efficiencyGain || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Efficiency Gain</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculatorResults.jobSchedulingOptimizer.optimization?.recommendations?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Advanced Recommendations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          {calculatorResults?.workflowOptimizer && (
            <Card>
              <CardHeader>
                <CardTitle>Workflow Bottleneck Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculatorResults.workflowOptimizer.aiEnhancement?.bottleneckAnalysis?.bottlenecks?.slice(0, 5).map((bottleneck: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{bottleneck.stepName}</span>
                        <Badge variant={
                          bottleneck.severity === 'critical' ? 'destructive' :
                          bottleneck.severity === 'high' ? 'default' : 'secondary'
                        }>
                          {bottleneck.severity}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{bottleneck.impact}% impact</div>
                        <div className="text-sm text-gray-500">
                          {bottleneck.solutions?.length || 0} solutions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="downtime" className="space-y-4">
          {calculatorResults?.downtimeAnalyzer && (
            <Card>
              <CardHeader>
                <CardTitle>Predictive Downtime Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {calculatorResults.downtimeAnalyzer.aiEnhancement?.riskScore || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculatorResults.downtimeAnalyzer.aiEnhancement?.predictedEvents?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Predicted Events</div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  {calculatorResults.downtimeAnalyzer.aiEnhancement?.predictedEvents?.slice(0, 3).map((event: any, index: number) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{event.type}</span>
                          <p className="text-sm text-gray-600">Duration: {formatTime(event.estimatedDuration)}</p>
                        </div>
                        <Badge variant="outline">{event.probability}% probability</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="batching" className="space-y-4">
          {calculatorResults?.batchOptimizer && (
            <Card>
              <CardHeader>
                <CardTitle>Advanced Batch Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calculatorResults.batchOptimizer.enhancement?.totalBatches || 0}
                    </div>
                    <div className="text-sm text-gray-500">Optimized Batches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(calculatorResults.batchOptimizer.enhancement?.utilizationRate || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Utilization Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(calculatorResults.batchOptimizer.aiEnhancement?.timeReduction || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Time Reduction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeManagementDashboard;
