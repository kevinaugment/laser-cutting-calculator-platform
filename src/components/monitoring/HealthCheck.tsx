/**
 * Health Check Component
 * 
 * Provides a comprehensive health monitoring dashboard
 * for system administrators and monitoring tools.
 */

import React, { useState, useEffect } from 'react';
import { healthCheckService, HealthCheckResult } from '../../utils/healthCheck';

interface HealthCheckProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  showDetails?: boolean;
}

const HealthCheck: React.FC<HealthCheckProps> = ({
  autoRefresh = false,
  refreshInterval = 30000,
  showDetails = true
}) => {
  const [healthData, setHealthData] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const performHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await healthCheckService.performHealthCheck();
      setHealthData(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performHealthCheck();
  }, []);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(performHealthCheck, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
      case 'warn':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unhealthy':
      case 'fail':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
        return '✅';
      case 'degraded':
      case 'warn':
        return '⚠️';
      case 'unhealthy':
      case 'fail':
        return '❌';
      default:
        return '❓';
    }
  };

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading && !healthData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-3">❌</span>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Health Check Failed</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={performHealthCheck}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className={`p-6 rounded-lg border-2 ${getStatusColor(healthData.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-3xl mr-4">{getStatusIcon(healthData.status)}</span>
            <div>
              <h2 className="text-2xl font-bold capitalize">{healthData.status}</h2>
              <p className="text-sm opacity-75">
                System is {healthData.status} • Uptime: {formatUptime(healthData.uptime)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Version {healthData.version}</p>
            <p className="text-xs opacity-50">
              Last updated: {lastUpdate?.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Memory Usage</h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold">
                {healthData.metrics.memory.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">
                {formatBytes(healthData.metrics.memory.used)} / {formatBytes(healthData.metrics.memory.total)}
              </div>
            </div>
            <div className="w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={healthData.metrics.memory.percentage > 80 ? "#ef4444" : "#10b981"}
                  strokeWidth="3"
                  strokeDasharray={`${healthData.metrics.memory.percentage}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Performance</h3>
          <div className="text-2xl font-bold">
            {healthData.metrics.performance.loadTime.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-500">Load Time</div>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Error Rate</h3>
          <div className="text-2xl font-bold">
            {healthData.metrics.errors.count}
          </div>
          <div className="text-sm text-gray-500">Total Errors</div>
        </div>
      </div>

      {/* Detailed Checks */}
      {showDetails && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">System Checks</h3>
          </div>
          <div className="divide-y">
            {Object.entries(healthData.checks).map(([name, check]) => (
              <div key={name} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{getStatusIcon(check.status)}</span>
                  <div>
                    <h4 className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1')}</h4>
                    <p className="text-sm text-gray-600">{check.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                    {check.status.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {check.duration.toFixed(1)}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={performHealthCheck}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Checking...' : 'Refresh'}
          </button>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => {
                // This would need to be handled by parent component
                console.log('Auto refresh:', e.target.checked);
              }}
              className="mr-2"
            />
            <span className="text-sm">Auto refresh ({refreshInterval / 1000}s)</span>
          </label>
        </div>

        <div className="text-sm text-gray-500">
          Timestamp: {new Date(healthData.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
