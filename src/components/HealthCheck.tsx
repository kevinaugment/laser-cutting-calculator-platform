import React, { useEffect, useState } from 'react';
import { handleHealthCheck, HealthCheckResponse } from '../api/health';

const HealthCheck: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performHealthCheck = async () => {
      try {
        const data = await handleHealthCheck();
        setHealthData(data);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performHealthCheck();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Performing health check...</p>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Health Check Failed</h1>
          <p className="text-gray-600">Unable to retrieve system health status</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
        return 'text-green-600 bg-green-100';
      case 'degraded':
      case 'warn':
        return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy':
      case 'fail':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getStatusIcon(healthData.status)}</div>
          <h1 className="text-3xl font-bold mb-2">System Health Status</h1>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(healthData.status)}`}>
            {healthData.status.toUpperCase()}
          </div>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Version</h3>
            <p className="text-lg font-semibold">{healthData.version}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Environment</h3>
            <p className="text-lg font-semibold">{healthData.environment}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Uptime</h3>
            <p className="text-lg font-semibold">{Math.floor(healthData.uptime / 1000)}s</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Check</h3>
            <p className="text-lg font-semibold">{new Date(healthData.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Services</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(healthData.services).map(([serviceName, service]) => (
                <div key={serviceName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">{serviceName.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)} {service.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Response: {service.responseTime}ms</p>
                    <p>Last Check: {new Date(service.lastCheck).toLocaleTimeString()}</p>
                    {service.error && <p className="text-red-600 mt-1">Error: {service.error}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Memory Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Memory Usage</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Used</span>
                  <span>{healthData.metrics.memory.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      healthData.metrics.memory.percentage > 90 ? 'bg-red-500' :
                      healthData.metrics.memory.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${healthData.metrics.memory.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Used: {(healthData.metrics.memory.used / 1024 / 1024).toFixed(1)} MB</p>
                <p>Total: {(healthData.metrics.memory.total / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Avg Response Time</span>
                  <p className="text-lg font-semibold">{healthData.metrics.performance.averageResponseTime.toFixed(1)}ms</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Requests/sec</span>
                  <p className="text-lg font-semibold">{healthData.metrics.performance.requestsPerSecond.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Error Rate</span>
                  <p className="text-lg font-semibold">{healthData.metrics.performance.errorRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Requests</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Total</span>
                  <p className="text-lg font-semibold">{healthData.metrics.requests.total}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Successful</span>
                  <p className="text-lg font-semibold text-green-600">{healthData.metrics.requests.successful}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Failed</span>
                  <p className="text-lg font-semibold text-red-600">{healthData.metrics.requests.failed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Checks */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Health Checks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {healthData.checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getStatusIcon(check.status)}</span>
                    <div>
                      <h3 className="font-medium capitalize">{check.name}</h3>
                      {check.message && <p className="text-sm text-gray-600">{check.message}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                      {check.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{check.duration}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
