import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterPlot, Scatter, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, Zap, DollarSign, BarChart3, Activity, Lightbulb } from 'lucide-react';

interface AdvancedCostAnalyticsDashboardProps {
  calculatorResults?: {
    directCostControl?: any;
    timeManagement?: any;
    pricing?: any;
  };
}

export const AdvancedCostAnalyticsDashboard: React.FC<AdvancedCostAnalyticsDashboardProps> = ({ calculatorResults }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'variance' | 'predictions' | 'optimization'>('overview');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Sample data for demonstration
  const costMetrics = {
    totalCost: 12450.75,
    costTrend: 2.3, // percentage change
    efficiency: 87.5,
    variance: -5.2, // negative means under budget
    predictedCost: 13200.00,
    optimizationPotential: 1850.25,
  };

  const costBreakdown = [
    { category: 'Energy', current: 3200, budget: 3000, variance: 6.7, color: '#8884d8' },
    { category: 'Labor', current: 4500, budget: 4800, variance: -6.3, color: '#82ca9d' },
    { category: 'Materials', current: 3800, budget: 3600, variance: 5.6, color: '#ffc658' },
    { category: 'Overhead', current: 950, budget: 1000, variance: -5.0, color: '#ff7300' },
  ];

  const trendData = [
    { period: 'Jan', actual: 11200, budget: 11000, predicted: 11150 },
    { period: 'Feb', actual: 11800, budget: 11200, predicted: 11750 },
    { period: 'Mar', actual: 12100, budget: 11500, predicted: 12050 },
    { period: 'Apr', actual: 12450, budget: 11800, predicted: 12400 },
    { period: 'May', actual: 0, budget: 12000, predicted: 12800 },
    { period: 'Jun', actual: 0, budget: 12200, predicted: 13200 },
  ];

  const varianceAnalysis = [
    {
      category: 'Energy Costs',
      variance: 6.7,
      impact: 'High',
      rootCause: 'Equipment efficiency degradation',
      recommendation: 'Schedule maintenance and optimize power settings',
      status: 'warning'
    },
    {
      category: 'Labor Efficiency',
      variance: -6.3,
      impact: 'Medium',
      rootCause: 'Improved training programs',
      recommendation: 'Continue current training initiatives',
      status: 'good'
    },
    {
      category: 'Material Utilization',
      variance: 5.6,
      impact: 'Medium',
      rootCause: 'Market price volatility',
      recommendation: 'Negotiate fixed-price contracts',
      status: 'warning'
    }
  ];

  const optimizationRecommendations = [
    {
      id: 'energy_001',
      title: 'Energy Cost Optimization',
      description: 'Implement energy monitoring and optimization system',
      potentialSaving: 480.00,
      implementationCost: 150.00,
      paybackPeriod: 3,
      priority: 'High',
      confidence: 85
    },
    {
      id: 'workflow_001',
      title: 'Workflow Efficiency Improvement',
      description: 'Optimize job scheduling and reduce setup times',
      potentialSaving: 720.00,
      implementationCost: 200.00,
      paybackPeriod: 2,
      priority: 'High',
      confidence: 90
    },
    {
      id: 'material_001',
      title: 'Material Cost Control',
      description: 'Implement better procurement strategies',
      potentialSaving: 380.00,
      implementationCost: 80.00,
      paybackPeriod: 2,
      priority: 'Medium',
      confidence: 75
    }
  ];

  const predictiveInsights = [
    {
      type: 'cost_spike',
      title: 'Energy Cost Spike Alert',
      description: 'Energy costs may increase by 15% in the next 2 weeks',
      probability: 78,
      timeframe: '14 days',
      impact: 480.00,
      preventiveActions: ['Optimize power settings', 'Schedule off-peak operations']
    },
    {
      type: 'efficiency_drop',
      title: 'Efficiency Decline Warning',
      description: 'Production efficiency showing signs of decline',
      probability: 65,
      timeframe: '7 days',
      impact: 320.00,
      preventiveActions: ['Schedule equipment maintenance', 'Review operator training']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Advanced Cost Analytics</h2>
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
          <Button
            variant={timeframe === 'quarter' ? 'default' : 'outline'}
            onClick={() => setTimeframe('quarter')}
          >
            Quarter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(costMetrics.totalCost)}
            </div>
            <p className={`text-xs ${costMetrics.costTrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {costMetrics.costTrend > 0 ? '+' : ''}{formatPercentage(costMetrics.costTrend)} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor('good')}`}>
              {formatPercentage(costMetrics.efficiency)}
            </div>
            <p className="text-xs text-muted-foreground">
              Above target (85%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${costMetrics.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(Math.abs(costMetrics.variance))}
            </div>
            <p className="text-xs text-muted-foreground">
              {costMetrics.variance < 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Cost</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(costMetrics.predictedCost)}
            </div>
            <p className="text-xs text-muted-foreground">
              Next period forecast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Potential</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(costMetrics.optimizationPotential)}
            </div>
            <p className="text-xs text-muted-foreground">
              Potential savings identified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {predictiveInsights.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active predictions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Predictive Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictiveInsights.map((insight, index) => (
                <Alert key={index} className={`border-l-4 ${
                  insight.probability > 75 ? 'border-red-500' :
                  insight.probability > 60 ? 'border-yellow-500' : 'border-blue-500'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <strong>{insight.title}</strong>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                          <span>Impact: {formatCurrency(insight.impact)}</span>
                          <span>Timeframe: {insight.timeframe}</span>
                        </div>
                      </div>
                      <Badge variant={insight.probability > 75 ? 'destructive' : 'default'}>
                        {insight.probability}% probability
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>Optimization Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {optimizationRecommendations.slice(0, 3).map((rec, index) => (
                <Alert key={index} className="border-l-4 border-green-500">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <strong>{rec.title}</strong>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                          <span>Saving: {formatCurrency(rec.potentialSaving)}</span>
                          <span>Payback: {rec.paybackPeriod} months</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={rec.priority === 'High' ? 'default' : 'secondary'}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline">{rec.confidence}% confidence</Badge>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="variance">Variance</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, current }) => `${category}: ${formatCurrency(current)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="current"
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                    <Bar dataKey="current" fill="#82ca9d" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Trends & Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Area type="monotone" dataKey="budget" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Budget" />
                  <Area type="monotone" dataKey="actual" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Actual" />
                  <Line type="monotone" dataKey="predicted" stroke="#ff7300" strokeDasharray="5 5" name="Predicted" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {varianceAnalysis.map((variance, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(variance.status)}
                      <div>
                        <h4 className="font-semibold">{variance.category}</h4>
                        <p className="text-sm text-gray-600">{variance.rootCause}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${variance.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {variance.variance > 0 ? '+' : ''}{formatPercentage(variance.variance)}
                      </div>
                      <div className="text-sm text-gray-500">{variance.impact} Impact</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {predictiveInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>{insight.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">{insight.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Probability:</span>
                        <div className="text-lg font-bold">{insight.probability}%</div>
                      </div>
                      <div>
                        <span className="font-medium">Impact:</span>
                        <div className="text-lg font-bold">{formatCurrency(insight.impact)}</div>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Preventive Actions:</span>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {insight.preventiveActions.map((action, actionIndex) => (
                          <li key={actionIndex}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="space-y-4">
            {optimizationRecommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{rec.title}</span>
                    <Badge variant={rec.priority === 'High' ? 'default' : 'secondary'}>
                      {rec.priority} Priority
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(rec.potentialSaving)}
                      </div>
                      <div className="text-sm text-gray-500">Potential Saving</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(rec.implementationCost)}
                      </div>
                      <div className="text-sm text-gray-500">Implementation Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {rec.paybackPeriod}
                      </div>
                      <div className="text-sm text-gray-500">Months Payback</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {rec.confidence}%
                      </div>
                      <div className="text-sm text-gray-500">Confidence</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">{rec.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCostAnalyticsDashboard;
