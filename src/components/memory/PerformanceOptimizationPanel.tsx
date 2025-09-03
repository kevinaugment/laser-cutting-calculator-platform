/**
 * Performance Optimization Panel Component
 * Dashboard for monitoring and optimizing system performance
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { 
  usePerformanceDashboard, 
  useCacheManagement, 
  usePerformanceAlerts 
} from '../../hooks/usePerformanceOptimization';

export interface PerformanceOptimizationPanelProps {
  className?: string;
  showRealTimeMetrics?: boolean;
  showCacheManagement?: boolean;
  showAlerts?: boolean;
  refreshInterval?: number;
}

export function PerformanceOptimizationPanel({
  className = '',
  showRealTimeMetrics = true,
  showCacheManagement = true,
  showAlerts = true,
  refreshInterval = 30000,
}: PerformanceOptimizationPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'cache' | 'alerts'>('overview');

  // Load performance data
  const {
    report,
    realTimeMetrics,
    loading: performanceLoading,
    error: performanceError,
    generateReport,
    refreshMetrics,
    clearError: clearPerformanceError,
  } = usePerformanceDashboard(refreshInterval);

  // Load cache data
  const {
    cacheStats,
    loading: cacheLoading,
    error: cacheError,
    clearCache,
    refreshStats,
    clearError: clearCacheError,
  } = useCacheManagement();

  // Load alerts
  const {
    activeAlerts,
    resolvedAlerts,
    totalAlerts,
    loading: alertsLoading,
    error: alertsError,
    resolveAlert,
    clearError: clearAlertsError,
  } = usePerformanceAlerts();

  // Format number with units
  const formatNumber = useCallback((value: number, unit?: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${unit ? ` ${unit}` : ''}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${unit ? ` ${unit}` : ''}`;
    }
    return `${value.toFixed(1)}${unit ? ` ${unit}` : ''}`;
  }, []);

  // Format percentage
  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(1)}%`;
  }, []);

  // Format duration
  const formatDuration = useCallback((milliseconds: number) => {
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(0)}ms`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}s`;
    } else {
      return `${(milliseconds / 60000).toFixed(1)}m`;
    }
  }, []);

  // Format bytes
  const formatBytes = useCallback((bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
  }, []);

  if ((performanceLoading || cacheLoading || alertsLoading) && !report && !cacheStats) {
    return (
      <div className={`performance-optimization-panel ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  if (performanceError || cacheError || alertsError) {
    return (
      <div className={`performance-optimization-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Performance Monitoring Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{performanceError || cacheError || alertsError}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    clearPerformanceError();
                    clearCacheError();
                    clearAlertsError();
                  }}
                  className="text-sm font-medium text-red-800 hover:text-red-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`performance-optimization-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">Performance Optimization</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => generateReport('1h')}
                className="text-gray-400 hover:text-gray-600"
                title="Refresh Report"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            {showCacheManagement && (
              <button
                onClick={() => setActiveTab('cache')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'cache'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cache
              </button>
            )}
            {showAlerts && (
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'alerts'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Alerts
                {activeAlerts.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {activeAlerts.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Real-time Metrics */}
              {showRealTimeMetrics && realTimeMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Response Time</p>
                        <p className="text-2xl font-bold">{formatDuration(realTimeMetrics.responseTime)}</p>
                      </div>
                      <svg className="w-8 h-8 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Throughput</p>
                        <p className="text-2xl font-bold">{formatNumber(realTimeMetrics.throughput)}</p>
                      </div>
                      <svg className="w-8 h-8 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm">Error Rate</p>
                        <p className="text-2xl font-bold">{formatPercentage(realTimeMetrics.errorRate)}</p>
                      </div>
                      <svg className="w-8 h-8 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Cache Hit Rate</p>
                        <p className="text-2xl font-bold">{formatPercentage(realTimeMetrics.cacheHitRate)}</p>
                      </div>
                      <svg className="w-8 h-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm">Active Alerts</p>
                        <p className="text-2xl font-bold">{realTimeMetrics.activeAlerts}</p>
                      </div>
                      <svg className="w-8 h-8 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.343 12.344l1.414 1.414L12 7.515l6.243 6.243 1.414-1.414L12 4.686z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Report Summary */}
              {report && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Average Response Time</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatDuration(report.metrics.responseTime.average)}
                        </p>
                        <p className="text-xs text-gray-400">
                          95th: {formatDuration(report.metrics.responseTime.p95)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Requests/Second</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatNumber(report.metrics.throughput.requestsPerSecond)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Total: {formatNumber(report.metrics.throughput.totalRequests)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Memory Usage</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatBytes(report.metrics.memoryUsage.current)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Peak: {formatBytes(report.metrics.memoryUsage.peak)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {report.recommendations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {report.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-700">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cache Tab */}
          {activeTab === 'cache' && showCacheManagement && cacheStats && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Cache Management</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={refreshStats}
                    className="text-gray-400 hover:text-gray-600"
                    title="Refresh Stats"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={clearCache}
                    className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>

              {/* Cache Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Hit Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercentage(cacheStats.metrics.hitRate * 100)}
                    </p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Size</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatBytes(cacheStats.metrics.totalSize)}
                    </p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Entry Count</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(cacheStats.metrics.entryCount)}
                    </p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Access Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDuration(cacheStats.metrics.averageAccessTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Cache Keys */}
              {cacheStats.topKeys.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Top Cache Keys</h4>
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Access Count
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cacheStats.topKeys.slice(0, 5).map((item, index) => (
                          <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.key.length > 50 ? `${item.key.substring(0, 50)}...` : item.key}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatNumber(item.accessCount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatBytes(item.size)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && showAlerts && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Performance Alerts</h3>
                <div className="text-sm text-gray-500">
                  {activeAlerts.length} active, {resolvedAlerts.length} resolved
                </div>
              </div>

              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Active Alerts</h4>
                  <div className="space-y-3">
                    {activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`border-l-4 p-4 rounded-md ${
                          alert.level === 'critical' ? 'bg-red-50 border-red-400' :
                          alert.level === 'error' ? 'bg-red-50 border-red-400' :
                          alert.level === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                          'bg-blue-50 border-blue-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                alert.level === 'critical' ? 'bg-red-100 text-red-800' :
                                alert.level === 'error' ? 'bg-red-100 text-red-800' :
                                alert.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.level.toUpperCase()}
                              </span>
                              <span className="ml-2 text-sm font-medium text-gray-900">
                                {alert.message}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              Threshold: {alert.threshold}, Current: {alert.currentValue.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="ml-4 px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Active Alerts */}
              {activeAlerts.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Active Alerts</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    System performance is within acceptable thresholds.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
