// Performance Dashboard Component
// Real-time performance monitoring dashboard for the platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Icon } from '../ui/Icon';
import { performanceMonitoringService } from '../../services/performanceMonitoringService';

interface PerformanceDashboardProps {
  isVisible?: boolean;
  autoStart?: boolean;
  refreshInterval?: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  status,
  trend,
  description
}) => {
  const statusColors = {
    good: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  const trendIcons = {
    up: 'trendingUp',
    down: 'trendingDown',
    stable: 'minus'
  };

  return (
    <Card className={`${statusColors[status]} border-2`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {trend && (
            <Icon 
              name={trendIcons[trend]} 
              size="sm" 
              className={`${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-sm font-normal ml-1">{unit}</span>
        </div>
        {description && (
          <p className="text-xs mt-1 opacity-75">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isVisible = true,
  autoStart = true,
  refreshInterval = 5000
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentSnapshot, setCurrentSnapshot] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [averageScore, setAverageScore] = useState(0);

  // Initialize monitoring
  useEffect(() => {
    if (autoStart && isVisible) {
      handleStartMonitoring();
    }

    return () => {
      if (isMonitoring) {
        performanceMonitoringService.stopMonitoring();
      }
    };
  }, [autoStart, isVisible]);

  // Subscribe to performance updates
  useEffect(() => {
    const unsubscribe = performanceMonitoringService.subscribe((snapshot) => {
      setCurrentSnapshot(snapshot);
      updateDashboardData();
    });

    return unsubscribe;
  }, []);

  const handleStartMonitoring = () => {
    performanceMonitoringService.startMonitoring(refreshInterval);
    setIsMonitoring(true);
    updateDashboardData();
  };

  const handleStopMonitoring = () => {
    performanceMonitoringService.stopMonitoring();
    setIsMonitoring(false);
  };

  const updateDashboardData = () => {
    const status = performanceMonitoringService.getCurrentStatus();
    setCurrentSnapshot(status.latestSnapshot);
    setAlerts(status.activeAlerts);
    setAverageScore(status.averageScore);
    
    const recentHistory = performanceMonitoringService.getHistory(10);
    setHistory(recentHistory);
  };

  const getMetricStatus = (value: number, threshold: number, isHigherBetter: boolean = false): 'good' | 'warning' | 'critical' => {
    if (isHigherBetter) {
      if (value >= threshold) return 'good';
      if (value >= threshold * 0.8) return 'warning';
      return 'critical';
    } else {
      if (value <= threshold) return 'good';
      if (value <= threshold * 1.2) return 'warning';
      return 'critical';
    }
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'green', label: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: 'blue', label: 'Good' };
    if (score >= 70) return { grade: 'C', color: 'yellow', label: 'Fair' };
    if (score >= 60) return { grade: 'D', color: 'orange', label: 'Poor' };
    return { grade: 'F', color: 'red', label: 'Critical' };
  };

  if (!isVisible) return null;

  const scoreGrade = getScoreGrade(currentSnapshot?.score || 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
          <p className="text-gray-600">Real-time platform performance monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge 
            variant={scoreGrade.color as any}
            className="text-sm px-3 py-1"
          >
            Grade {scoreGrade.grade} - {scoreGrade.label}
          </Badge>
          {isMonitoring ? (
            <Button 
              onClick={handleStopMonitoring}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Icon name="pause" size="sm" className="mr-2" />
              Stop Monitoring
            </Button>
          ) : (
            <Button 
              onClick={handleStartMonitoring}
              size="sm"
              className="flex items-center"
            >
              <Icon name="play" size="sm" className="mr-2" />
              Start Monitoring
            </Button>
          )}
        </div>
      </div>

      {/* Overall Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="gauge" size="sm" className="mr-2" />
            Overall Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {currentSnapshot?.score?.toFixed(0) || 0}/100
              </div>
              <Progress 
                value={currentSnapshot?.score || 0} 
                className="h-3 mb-2" 
              />
              <p className="text-sm text-gray-600">
                Average over last 24h: {averageScore.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-6xl font-bold text-${scoreGrade.color}-600`}>
                {scoreGrade.grade}
              </div>
              <p className="text-sm text-gray-600">{scoreGrade.label}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Icon name="zap" size="sm" className="mr-2" />
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="First Contentful Paint"
            value={currentSnapshot?.coreWebVitals?.fcp || 0}
            unit="ms"
            status={getMetricStatus(currentSnapshot?.coreWebVitals?.fcp || 0, 1800)}
            description="Time to first content render"
          />
          <MetricCard
            title="Largest Contentful Paint"
            value={currentSnapshot?.coreWebVitals?.lcp || 0}
            unit="ms"
            status={getMetricStatus(currentSnapshot?.coreWebVitals?.lcp || 0, 2500)}
            description="Time to largest content render"
          />
          <MetricCard
            title="First Input Delay"
            value={currentSnapshot?.coreWebVitals?.fid || 0}
            unit="ms"
            status={getMetricStatus(currentSnapshot?.coreWebVitals?.fid || 0, 100)}
            description="Time to first user interaction"
          />
          <MetricCard
            title="Cumulative Layout Shift"
            value={currentSnapshot?.coreWebVitals?.cls || 0}
            status={getMetricStatus(currentSnapshot?.coreWebVitals?.cls || 0, 0.1)}
            description="Visual stability score"
          />
        </div>
      </div>

      {/* Application Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Icon name="cpu" size="sm" className="mr-2" />
          Application Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Page Load Time"
            value={currentSnapshot?.applicationMetrics?.pageLoadTime || 0}
            unit="ms"
            status={getMetricStatus(currentSnapshot?.applicationMetrics?.pageLoadTime || 0, 3000)}
            description="Total page load duration"
          />
          <MetricCard
            title="Calculation Time"
            value={currentSnapshot?.applicationMetrics?.calculationTime || 0}
            unit="ms"
            status={getMetricStatus(currentSnapshot?.applicationMetrics?.calculationTime || 0, 500)}
            description="Average calculation duration"
          />
          <MetricCard
            title="Memory Usage"
            value={currentSnapshot?.applicationMetrics?.memoryUsage || 0}
            unit="%"
            status={getMetricStatus(currentSnapshot?.applicationMetrics?.memoryUsage || 0, 80)}
            description="JavaScript heap utilization"
          />
          <MetricCard
            title="Cache Hit Rate"
            value={currentSnapshot?.applicationMetrics?.cacheHitRate || 0}
            unit="%"
            status={getMetricStatus(currentSnapshot?.applicationMetrics?.cacheHitRate || 0, 60, true)}
            description="Calculation cache efficiency"
          />
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="alertTriangle" size="sm" className="mr-2" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert, index) => (
                <div 
                  key={alert.id || index}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'bg-red-50 border-red-400' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{alert.metric}</p>
                      <p className="text-xs text-gray-600">{alert.message}</p>
                    </div>
                    <Badge 
                      variant={alert.type === 'critical' ? 'destructive' : 
                              alert.type === 'warning' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {alert.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {alerts.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  +{alerts.length - 5} more alerts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Icon name="server" size="sm" className="mr-2" />
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Monitoring Status"
            value={isMonitoring ? "Active" : "Inactive"}
            status={isMonitoring ? 'good' : 'warning'}
            description={isMonitoring ? "Real-time monitoring enabled" : "Monitoring is paused"}
          />
          <MetricCard
            title="Active Calculators"
            value={currentSnapshot?.systemMetrics?.activeCalculators || 21}
            status="good"
            description="Total calculators available"
          />
          <MetricCard
            title="JS Heap Size"
            value={(currentSnapshot?.systemMetrics?.jsHeapSize || 0) / 1024 / 1024}
            unit="MB"
            status={getMetricStatus(
              (currentSnapshot?.systemMetrics?.jsHeapSize || 0) / (currentSnapshot?.systemMetrics?.jsHeapSizeLimit || 1),
              0.8
            )}
            description="JavaScript memory usage"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Last updated: {currentSnapshot?.timestamp ? 
            new Date(currentSnapshot.timestamp).toLocaleTimeString() : 
            'Never'
          }
        </p>
        <p className="mt-1">
          Monitoring interval: {refreshInterval / 1000}s | 
          History: {history.length} snapshots
        </p>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
