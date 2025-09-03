import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Switch } from '../components/ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { 
  Activity, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Clock, 
  Zap, Target, Bell, Download, RefreshCw, Settings, Eye, EyeOff,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon
} from 'lucide-react';

interface RealTimeCostMonitoringDashboardProps {
  calculatorResults?: {
    directCostControl?: any;
    timeManagement?: any;
    pricing?: any;
  };
}

export const RealTimeCostMonitoringDashboard: React.FC<RealTimeCostMonitoringDashboardProps> = ({ calculatorResults }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'alerts' | 'trends' | 'reports' | 'settings'>('overview');
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);

  // Real-time data state
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [costTrends, setCostTrends] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-500 bg-gray-50';
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

  // Fetch real-time data
  const fetchRealTimeData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate real-time data aggregation from all Phase 3 calculators
      const aggregatedMetrics = await aggregatePhase3Data();
      setRealTimeMetrics(aggregatedMetrics);

      // Generate alerts based on current metrics
      const alerts = await generateRealTimeAlerts(aggregatedMetrics);
      setActiveAlerts(alerts);

      // Update cost trends
      const trends = await fetchCostTrends();
      setCostTrends(trends);

      // Update performance metrics
      const performance = await fetchPerformanceMetrics();
      setPerformanceMetrics(performance);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchRealTimeData();

    if (isAutoRefresh) {
      const interval = setInterval(fetchRealTimeData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchRealTimeData, isAutoRefresh, refreshInterval]);

  // Sample data generation functions
  const aggregatePhase3Data = async () => {
    // Aggregate data from all Phase 3 calculators
    return {
      totalCost: 15750.25,
      hourlyRate: 125.50,
      dailyTotal: 2850.75,
      monthlyProjected: 62500.00,
      efficiency: 87.3,
      utilization: 82.5,
      costBreakdown: {
        directCosts: 8500.00,
        timeManagement: 4250.00,
        pricing: 3000.25,
      },
      trends: {
        costTrend: 2.1, // percentage change
        efficiencyTrend: -1.5,
        utilizationTrend: 3.2,
      },
      calculatorStatus: {
        operatingCostAnalyzer: 'active',
        consumableCostTracker: 'active',
        equipmentUtilization: 'warning',
        inventoryOptimizer: 'active',
        overheadAllocation: 'active',
        setupTimeOptimizer: 'active',
        jobSchedulingOptimizer: 'active',
        workflowOptimizer: 'warning',
        downtimeAnalyzer: 'active',
        batchOptimizer: 'active',
        competitivePricing: 'active',
        valueBasedPricing: 'active',
        profitMarginOptimizer: 'active',
        breakEvenAnalysis: 'active',
        costPlusPricing: 'active',
      }
    };
  };

  const generateRealTimeAlerts = async (metrics: any) => {
    const alerts = [];
    
    // Cost overrun alerts
    if (metrics.hourlyRate > 120) {
      alerts.push({
        id: 'cost_overrun_001',
        severity: 'warning',
        title: 'Hourly Rate Above Target',
        message: `Current hourly rate (${formatCurrency(metrics.hourlyRate)}) exceeds target ($120.00)`,
        timestamp: new Date(),
        source: 'Cost Monitoring',
        actions: ['Review operations', 'Check equipment efficiency', 'Optimize parameters']
      });
    }

    // Efficiency alerts
    if (metrics.efficiency < 85) {
      alerts.push({
        id: 'efficiency_001',
        severity: 'warning',
        title: 'Efficiency Below Target',
        message: `Current efficiency (${formatPercentage(metrics.efficiency)}) below target (85%)`,
        timestamp: new Date(),
        source: 'Performance Monitoring',
        actions: ['Analyze bottlenecks', 'Review workflow', 'Check equipment status']
      });
    }

    // Calculator status alerts
    Object.entries(metrics.calculatorStatus).forEach(([calculator, status]) => {
      if (status === 'warning') {
        alerts.push({
          id: `calc_${calculator}`,
          severity: 'info',
          title: `${calculator} Status Warning`,
          message: `${calculator} requires attention`,
          timestamp: new Date(),
          source: calculator,
          actions: ['Check calculator', 'Review inputs', 'Validate results']
        });
      }
    });

    return alerts;
  };

  const fetchCostTrends = async () => {
    // Generate sample trend data
    const now = new Date();
    const trends = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Last 24 hours
      trends.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        totalCost: 15000 + Math.random() * 2000,
        directCosts: 8000 + Math.random() * 1000,
        timeManagement: 4000 + Math.random() * 500,
        pricing: 3000 + Math.random() * 300,
        efficiency: 85 + Math.random() * 10,
        utilization: 80 + Math.random() * 15,
      });
    }
    
    return trends;
  };

  const fetchPerformanceMetrics = async () => {
    return {
      responseTime: 145, // ms
      uptime: 99.8, // percentage
      dataAccuracy: 98.5, // percentage
      alertsGenerated: 12,
      alertsResolved: 10,
      calculatorsActive: 15,
      calculatorsTotal: 15,
    };
  };

  const exportReport = () => {
    // Export functionality
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics: realTimeMetrics,
      alerts: activeAlerts,
      trends: costTrends,
      performance: performanceMetrics,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-monitoring-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!realTimeMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading real-time cost monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Real-Time Cost Monitoring</h2>
          <p className="text-muted-foreground">
            Last updated: {formatTime(lastUpdated)} | 
            Auto-refresh: {isAutoRefresh ? 'ON' : 'OFF'} | 
            Interval: {refreshInterval}s
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchRealTimeData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={exportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">System Status: Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Auto-refresh:</span>
            <Switch
              checked={isAutoRefresh}
              onCheckedChange={setIsAutoRefresh}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Bell className={`h-4 w-4 ${alertsEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
            <span className="text-sm">Alerts:</span>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline">
            {performanceMetrics?.calculatorsActive || 0}/{performanceMetrics?.calculatorsTotal || 0} Calculators Active
          </Badge>
          <Badge variant={activeAlerts.length > 0 ? 'destructive' : 'secondary'}>
            {activeAlerts.length} Active Alerts
          </Badge>
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
              {formatCurrency(realTimeMetrics.totalCost)}
            </div>
            <p className={`text-xs ${realTimeMetrics.trends.costTrend > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {realTimeMetrics.trends.costTrend > 0 ? '+' : ''}{formatPercentage(realTimeMetrics.trends.costTrend)} from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(realTimeMetrics.hourlyRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current operating rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${realTimeMetrics.efficiency >= 85 ? 'text-green-600' : 'text-yellow-600'}`}>
              {formatPercentage(realTimeMetrics.efficiency)}
            </div>
            <p className={`text-xs ${realTimeMetrics.trends.efficiencyTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {realTimeMetrics.trends.efficiencyTrend > 0 ? '+' : ''}{formatPercentage(realTimeMetrics.trends.efficiencyTrend)} trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${realTimeMetrics.utilization >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
              {formatPercentage(realTimeMetrics.utilization)}
            </div>
            <p className={`text-xs ${realTimeMetrics.trends.utilizationTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {realTimeMetrics.trends.utilizationTrend > 0 ? '+' : ''}{formatPercentage(realTimeMetrics.trends.utilizationTrend)} trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Total</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(realTimeMetrics.dailyTotal)}
            </div>
            <p className="text-xs text-muted-foreground">
              Today's accumulated cost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Projected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(realTimeMetrics.monthlyProjected)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current trends
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && alertsEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Active Alerts ({activeAlerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.slice(0, 5).map((alert, index) => (
                <Alert key={alert.id} className={getAlertSeverityColor(alert.severity)}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <strong>{alert.title}</strong>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex space-x-2 mt-2">
                          {alert.actions.slice(0, 2).map((action: string, actionIndex: number) => (
                            <Badge key={actionIndex} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                          {alert.severity}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatTime(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
              {activeAlerts.length > 5 && (
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    View All {activeAlerts.length} Alerts
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analytics */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Direct Costs', value: realTimeMetrics.costBreakdown.directCosts, color: '#8884d8' },
                        { name: 'Time Management', value: realTimeMetrics.costBreakdown.timeManagement, color: '#82ca9d' },
                        { name: 'Pricing', value: realTimeMetrics.costBreakdown.pricing, color: '#ffc658' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Direct Costs', value: realTimeMetrics.costBreakdown.directCosts, color: '#8884d8' },
                        { name: 'Time Management', value: realTimeMetrics.costBreakdown.timeManagement, color: '#82ca9d' },
                        { name: 'Pricing', value: realTimeMetrics.costBreakdown.pricing, color: '#ffc658' },
                      ].map((entry, index) => (
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
                <CardTitle>Calculator Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(realTimeMetrics.calculatorStatus).map(([calculator, status]) => (
                    <div key={calculator} className="flex items-center space-x-2 p-2 border rounded">
                      {getStatusIcon(status as string)}
                      <span className="text-xs truncate" title={calculator}>
                        {calculator.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Cost Trends (Last 24 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={costTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Area type="monotone" dataKey="directCosts" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Direct Costs" />
                  <Area type="monotone" dataKey="timeManagement" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Time Management" />
                  <Area type="monotone" dataKey="pricing" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} name="Pricing" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={costTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line type="monotone" dataKey="efficiency" stroke="#8884d8" name="Efficiency" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilization Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={costTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line type="monotone" dataKey="utilization" stroke="#82ca9d" name="Utilization" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert, index) => (
                  <Alert key={alert.id} className={getAlertSeverityColor(alert.severity)}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <strong>{alert.title}</strong>
                            <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.source}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                          <div className="space-y-1">
                            <span className="text-xs font-medium">Recommended Actions:</span>
                            {alert.actions.map((action: string, actionIndex: number) => (
                              <div key={actionIndex} className="text-xs text-gray-600">
                                • {action}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xs text-gray-500 mb-2">
                            {formatTime(alert.timestamp)}
                          </div>
                          <div className="space-x-2">
                            <Button size="sm" variant="outline">
                              Acknowledge
                            </Button>
                            <Button size="sm" variant="outline">
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
                {activeAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active alerts</p>
                    <p className="text-sm">System is operating normally</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Executive Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Cost Today:</span>
                      <span className="font-medium">{formatCurrency(realTimeMetrics.dailyTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Efficiency:</span>
                      <span className="font-medium">{formatPercentage(realTimeMetrics.efficiency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilization Rate:</span>
                      <span className="font-medium">{formatPercentage(realTimeMetrics.utilization)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Alerts:</span>
                      <span className="font-medium">{activeAlerts.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">{performanceMetrics?.responseTime || 0}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Uptime:</span>
                      <span className="font-medium">{formatPercentage(performanceMetrics?.uptime || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Accuracy:</span>
                      <span className="font-medium">{formatPercentage(performanceMetrics?.dataAccuracy || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calculators Active:</span>
                      <span className="font-medium">{performanceMetrics?.calculatorsActive || 0}/{performanceMetrics?.calculatorsTotal || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <Button onClick={exportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Full Report
                </Button>
                <Button variant="outline">
                  Schedule Report
                </Button>
                <Button variant="outline">
                  Email Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Refresh Interval</label>
                  <select 
                    value={refreshInterval} 
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  >
                    <option value={10}>10 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                    <option value={600}>10 minutes</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto Refresh</label>
                    <p className="text-xs text-muted-foreground">Automatically refresh data at set intervals</p>
                  </div>
                  <Switch
                    checked={isAutoRefresh}
                    onCheckedChange={setIsAutoRefresh}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Alert Notifications</label>
                    <p className="text-xs text-muted-foreground">Show alert notifications on dashboard</p>
                  </div>
                  <Switch
                    checked={alertsEnabled}
                    onCheckedChange={setAlertsEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Thresholds</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs">Max Hourly Rate ($)</label>
                      <input type="number" defaultValue={120} className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div>
                      <label className="text-xs">Min Efficiency (%)</label>
                      <input type="number" defaultValue={85} className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div>
                      <label className="text-xs">Min Utilization (%)</label>
                      <input type="number" defaultValue={80} className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div>
                      <label className="text-xs">Max Daily Budget ($)</label>
                      <input type="number" defaultValue={3000} className="w-full p-2 border rounded text-sm" />
                    </div>
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

export default RealTimeCostMonitoringDashboard;
