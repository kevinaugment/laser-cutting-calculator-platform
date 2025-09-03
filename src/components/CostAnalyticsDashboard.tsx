import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { realTimeCostTracker } from '../utils/costTracker';
import type { CostMetrics, Alert as CostAlert } from '../utils/costTracker';

interface CostAnalyticsDashboardProps {
  calculatorResults?: {
    operatingCost?: any;
    consumableCost?: any;
    equipmentUtilization?: any;
    inventoryOptimizer?: any;
    overheadAllocation?: any;
  };
}

export const CostAnalyticsDashboard: React.FC<CostAnalyticsDashboardProps> = ({ calculatorResults }) => {
  const [costMetrics, setCostMetrics] = useState<CostMetrics | null>(null);
  const [alerts, setAlerts] = useState<CostAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    const fetchCostData = async () => {
      try {
        setIsLoading(true);
        const metrics = realTimeCostTracker.trackRealTimeCosts();
        setCostMetrics(metrics);

        // Generate alerts based on thresholds
        const thresholds = {
          hourlyRateMax: 100,
          dailyBudgetMax: 2000,
          varianceThreshold: 15,
          efficiencyMin: 75,
          utilizationMin: 70,
        };

        const newAlerts = realTimeCostTracker.generateAlerts(thresholds);
        setAlerts(newAlerts);
      } catch (error) {
        console.error('Failed to fetch cost data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCostData();
    
    // Update every 5 minutes
    const interval = setInterval(fetchCostData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getAlertIcon = (type: CostAlert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const costBreakdownData = costMetrics ? [
    { name: 'Energy', value: costMetrics.breakdown.energy.current, color: '#8884d8' },
    { name: 'Labor', value: costMetrics.breakdown.labor.current, color: '#82ca9d' },
    { name: 'Materials', value: costMetrics.breakdown.materials.current, color: '#ffc658' },
    { name: 'Overhead', value: costMetrics.breakdown.overhead.current, color: '#ff7300' },
    { name: 'Maintenance', value: costMetrics.breakdown.maintenance.current, color: '#00ff00' },
  ] : [];

  const efficiencyData = costMetrics ? [
    { name: 'Overall', value: costMetrics.efficiency.overallEfficiency },
    { name: 'Energy', value: costMetrics.efficiency.energyEfficiency },
    { name: 'Labor', value: costMetrics.efficiency.laborEfficiency },
    { name: 'Material', value: costMetrics.efficiency.materialEfficiency },
    { name: 'Utilization', value: costMetrics.efficiency.utilizationRate },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Cost Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Button
            variant={selectedTimeframe === 'day' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('day')}
          >
            Day
          </Button>
          <Button
            variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedTimeframe('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert) => (
            <Alert key={alert.id} className={`border-l-4 ${
              alert.type === 'critical' ? 'border-red-500' :
              alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'
            }`}>
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <AlertDescription>
                  <strong>{alert.category}:</strong> {alert.message}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Hourly Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {costMetrics ? formatCurrency(costMetrics.currentHourlyRate) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              vs. budget: {costMetrics ? formatCurrency(costMetrics.currentHourlyRate - 75) : '--'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {costMetrics ? formatCurrency(costMetrics.dailyTotal) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly projected: {costMetrics ? formatCurrency(costMetrics.monthlyProjected) : '--'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Efficiency</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {costMetrics ? formatPercentage(costMetrics.efficiency.overallEfficiency) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 85%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {costMetrics ? formatPercentage(costMetrics.efficiency.utilizationRate) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 75%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Metrics</TabsTrigger>
          <TabsTrigger value="trends">Cost Trends</TabsTrigger>
          <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdownData.map((entry, index) => (
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
                <CardTitle>Cost Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costMetrics && Object.entries(costMetrics.breakdown).map(([key, component]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="capitalize font-medium">{key}</span>
                        {getTrendIcon(component.trend)}
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(component.current)}</div>
                        <div className={`text-sm ${
                          component.variance > 0 ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {component.variance > 0 ? '+' : ''}{formatCurrency(component.variance)}
                        </div>
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
              <CardTitle>Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                Cost trend data will be available after collecting historical data
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costMetrics && Object.entries(costMetrics.breakdown).map(([key, component]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <span className="capitalize font-medium">{key}</span>
                      <Badge variant={component.variance > 0 ? 'destructive' : 'default'}>
                        {component.variance > 0 ? 'Over Budget' : 'Under Budget'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatPercentage(component.variancePercent)}</div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(component.budgeted)} budgeted
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calculator Integration */}
      {calculatorResults && (
        <Card>
          <CardHeader>
            <CardTitle>Calculator Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calculatorResults.operatingCost && (
                <div className="p-3 border rounded">
                  <h4 className="font-medium">Operating Cost Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Hourly Rate: {formatCurrency(calculatorResults.operatingCost.hourlyRates?.totalHourlyRate || 0)}
                  </p>
                </div>
              )}
              {calculatorResults.consumableCost && (
                <div className="p-3 border rounded">
                  <h4 className="font-medium">Consumable Costs</h4>
                  <p className="text-sm text-gray-600">
                    Monthly Total: {formatCurrency(calculatorResults.consumableCost.monthlyCosts?.total || 0)}
                  </p>
                </div>
              )}
              {calculatorResults.equipmentUtilization && (
                <div className="p-3 border rounded">
                  <h4 className="font-medium">Equipment Utilization</h4>
                  <p className="text-sm text-gray-600">
                    Overall: {formatPercentage(calculatorResults.equipmentUtilization.utilizationMetrics?.overallUtilization || 0)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostAnalyticsDashboard;
