/**
 * Mobile Optimization Panel Component
 * Dashboard for monitoring and managing mobile experience optimization
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { 
  useDeviceDetection, 
  useMobileAnalytics, 
  useTouchInteractions 
} from '../../hooks/useMobileOptimization';
import { DeviceType } from '../../services/mobileOptimizationService';

export interface MobileOptimizationPanelProps {
  className?: string;
  showDeviceInfo?: boolean;
  showAnalytics?: boolean;
  showTouchTracking?: boolean;
  showOptimizationSettings?: boolean;
}

export function MobileOptimizationPanel({
  className = '',
  showDeviceInfo = true,
  showAnalytics = true,
  showTouchTracking = true,
  showOptimizationSettings = true,
}: MobileOptimizationPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'device' | 'analytics' | 'touch' | 'settings'>('device');

  // Load device detection data
  const {
    deviceInfo,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isPortrait,
    isLandscape,
    isLoading: deviceLoading,
    error: deviceError,
    detectDevice,
    clearError: clearDeviceError,
  } = useDeviceDetection();

  // Load analytics data
  const {
    analytics,
    deviceDistribution,
    orientationUsage,
    performanceMetrics,
    usabilityMetrics,
    isLoading: analyticsLoading,
    error: analyticsError,
    resetAnalytics,
    clearError: clearAnalyticsError,
  } = useMobileAnalytics();

  // Load touch interaction data
  const {
    touchInteractions,
    isLoading: touchLoading,
    error: touchError,
    clearError: clearTouchError,
  } = useTouchInteractions();

  // Format percentage
  const formatPercentage = useCallback((value: number, total: number) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  }, []);

  // Format number
  const formatNumber = useCallback((value: number, decimals: number = 1) => {
    return value.toFixed(decimals);
  }, []);

  // Get device type icon
  const getDeviceIcon = useCallback((type: DeviceType) => {
    switch (type) {
      case 'mobile':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
          </svg>
        );
      case 'tablet':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        );
      case 'desktop':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  }, []);

  if ((deviceLoading || analyticsLoading || touchLoading) && !deviceInfo) {
    return (
      <div className={`mobile-optimization-panel ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (deviceError || analyticsError || touchError) {
    return (
      <div className={`mobile-optimization-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Mobile Optimization Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{deviceError || analyticsError || touchError}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    clearDeviceError();
                    clearAnalyticsError();
                    clearTouchError();
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
    <div className={`mobile-optimization-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                Mobile Optimization
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {deviceInfo && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  {getDeviceIcon(deviceInfo.type)}
                  <span className="capitalize">{deviceInfo.type}</span>
                </div>
              )}
              <button
                onClick={detectDevice}
                className="text-gray-400 hover:text-gray-600"
                title="Refresh Device Info"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex space-x-1">
            {showDeviceInfo && (
              <button
                onClick={() => setActiveTab('device')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'device'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Device Info
              </button>
            )}
            {showAnalytics && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
            )}
            {showTouchTracking && (
              <button
                onClick={() => setActiveTab('touch')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'touch'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Touch Tracking
              </button>
            )}
            {showOptimizationSettings && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Device Info Tab */}
          {activeTab === 'device' && showDeviceInfo && deviceInfo && (
            <div className="space-y-4">
              {/* Device Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Device Type</p>
                      <p className="text-2xl font-bold capitalize">{deviceInfo.type}</p>
                    </div>
                    {getDeviceIcon(deviceInfo.type)}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Orientation</p>
                      <p className="text-2xl font-bold capitalize">{deviceInfo.orientation}</p>
                    </div>
                    <svg className="w-8 h-8 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Touch Support</p>
                      <p className="text-2xl font-bold">{deviceInfo.touchSupport ? 'Yes' : 'No'}</p>
                    </div>
                    <svg className="w-8 h-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Device Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Device Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Screen Resolution</p>
                    <p className="text-lg font-medium">{deviceInfo.screenWidth} × {deviceInfo.screenHeight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pixel Ratio</p>
                    <p className="text-lg font-medium">{deviceInfo.pixelRatio}x</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Platform</p>
                    <p className="text-lg font-medium">{deviceInfo.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Browser</p>
                    <p className="text-lg font-medium">{deviceInfo.browserName} {deviceInfo.browserVersion}</p>
                  </div>
                </div>

                {/* OS Indicators */}
                <div className="mt-4 flex items-center space-x-4">
                  {deviceInfo.isIOS && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      iOS Device
                    </span>
                  )}
                  {deviceInfo.isAndroid && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Android Device
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && showAnalytics && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900">Mobile Analytics</h4>
                <button
                  onClick={resetAnalytics}
                  className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                >
                  Reset Analytics
                </button>
              </div>

              {/* Device Distribution */}
              <div className="bg-white border rounded-lg p-4">
                <h5 className="text-md font-medium text-gray-900 mb-3">Device Distribution</h5>
                <div className="space-y-3">
                  {Object.entries(deviceDistribution).map(([device, count]) => {
                    const total = Object.values(deviceDistribution).reduce((sum, val) => sum + val, 0);
                    const percentage = formatPercentage(count, total);
                    
                    return (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(device as DeviceType)}
                          <span className="capitalize text-sm font-medium">{device}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{count}</span>
                          <span className="text-sm font-medium">{percentage}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="text-md font-medium text-gray-900 mb-3">Performance</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Load Time</span>
                      <span className="text-sm font-medium">{formatNumber(performanceMetrics.averageLoadTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bounce Rate</span>
                      <span className="text-sm font-medium">{formatNumber(performanceMetrics.bounceRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Session Duration</span>
                      <span className="text-sm font-medium">{formatNumber(performanceMetrics.sessionDuration / 1000)}s</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h5 className="text-md font-medium text-gray-900 mb-3">Usability</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Task Completion</span>
                      <span className="text-sm font-medium">{formatNumber(usabilityMetrics.taskCompletionRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="text-sm font-medium">{formatNumber(usabilityMetrics.errorRate * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User Satisfaction</span>
                      <span className="text-sm font-medium">{formatNumber(usabilityMetrics.userSatisfaction * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Touch Tracking Tab */}
          {activeTab === 'touch' && showTouchTracking && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Touch Interactions</h4>

              {!isTouchDevice ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0a7.962 7.962 0 016 2.562M9 6.306a7.962 7.962 0 00-6 2.562" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Touch Support</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This device does not support touch interactions.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(touchInteractions).map(([gesture, count]) => (
                    <div key={gesture} className="bg-white border rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 capitalize">{gesture.replace('-', ' ')}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && showOptimizationSettings && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Optimization Settings</h4>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Mobile optimization settings are automatically applied based on device detection.
                  Advanced configuration options will be available in future updates.
                </p>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Touch Optimization</span>
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Responsive Design</span>
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Performance Optimization</span>
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Accessibility Features</span>
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
