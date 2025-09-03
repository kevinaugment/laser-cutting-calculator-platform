/**
 * Usage Analytics Dashboard Component
 * Comprehensive dashboard for tracking parameter usage, success rates, and team performance
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { useDashboardStatistics, useTeamAnalyticsDashboard } from '../../hooks/useUsageAnalytics';
import { AnalyticsTimeframe } from '../../services/usageAnalyticsService';

export interface UsageAnalyticsDashboardProps {
  className?: string;
  userId?: string;
  teamId?: string;
  showTeamAnalytics?: boolean;
  showPerformanceMetrics?: boolean;
  showUserActivity?: boolean;
  defaultTimeframe?: AnalyticsTimeframe;
}

export function UsageAnalyticsDashboard({
  className = '',
  userId,
  teamId,
  showTeamAnalytics = true,
  showPerformanceMetrics = true,
  showUserActivity = true,
  defaultTimeframe = 'week',
}: UsageAnalyticsDashboardProps) {
  const { theme } = useTheme();
  const [activeTimeframe, setActiveTimeframe] = useState<AnalyticsTimeframe>(defaultTimeframe);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculators' | 'users' | 'performance' | 'team'>('overview');

  // Load statistics
  const {
    statistics,
    loading: statsLoading,
    error: statsError,
    refresh: refreshStats,
    clearError: clearStatsError,
  } = useDashboardStatistics(activeTimeframe, userId);

  // Load team analytics if team ID is provided
  const {
    teamAnalytics,
    loading: teamLoading,
    error: teamError,
    refresh: refreshTeam,
    clearError: clearTeamError,
  } = useTeamAnalyticsDashboard(teamId || '', userId);

  // Handle timeframe change
  const handleTimeframeChange = useCallback((timeframe: AnalyticsTimeframe) => {
    setActiveTimeframe(timeframe);
    refreshStats(timeframe);
  }, [refreshStats]);

  // Format number with appropriate units
  const formatNumber = useCallback((value: number, unit?: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${unit ? ` ${unit}` : ''}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${unit ? ` ${unit}` : ''}`;
    }
    return `${value.toFixed(0)}${unit ? ` ${unit}` : ''}`;
  }, []);

  // Format percentage
  const formatPercentage = useCallback((value: number) => {
    return `${(value * 100).toFixed(1)}%`;
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

  if (statsLoading && !statistics) {
    return (
      <div className={`usage-analytics-dashboard ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className={`usage-analytics-dashboard ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Analytics Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{statsError}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={clearStatsError}
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
    <div className={`usage-analytics-dashboard ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">Usage Analytics</h2>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Timeframe:</span>
              <select
                value={activeTimeframe}
                onChange={(e) => handleTimeframeChange(e.target.value as AnalyticsTimeframe)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <button
                onClick={() => refreshStats()}
                className="text-gray-400 hover:text-gray-600"
                title="Refresh"
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
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('calculators')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'calculators'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Calculators
            </button>
            {showUserActivity && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
            )}
            {showPerformanceMetrics && (
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'performance'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Performance
              </button>
            )}
            {showTeamAnalytics && teamId && (
              <button
                onClick={() => setActiveTab('team')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'team'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Team
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && statistics && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Usage</p>
                      <p className="text-2xl font-bold">{formatNumber(statistics.totalUsage)}</p>
                    </div>
                    <svg className="w-8 h-8 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold">{formatPercentage(statistics.successRate)}</p>
                    </div>
                    <svg className="w-8 h-8 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Unique Users</p>
                      <p className="text-2xl font-bold">{formatNumber(statistics.uniqueUsers)}</p>
                    </div>
                    <svg className="w-8 h-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Avg Session</p>
                      <p className="text-2xl font-bold">{formatDuration(statistics.averageSessionDuration)}</p>
                    </div>
                    <svg className="w-8 h-8 text-orange-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Over Time</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="mt-2 text-sm">Chart visualization would be implemented here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Calculator Distribution</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      <p className="mt-2 text-sm">Pie chart visualization would be implemented here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calculators Tab */}
          {activeTab === 'calculators' && statistics && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Top Calculators</h3>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Calculator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unique Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Success Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statistics.topCalculators.map((calculator, index) => (
                      <tr key={calculator.calculatorType} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {calculator.calculatorType.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(calculator.usageCount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(calculator.uniqueUsers)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            calculator.successRate >= 0.9 
                              ? 'bg-green-100 text-green-800'
                              : calculator.successRate >= 0.7
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {formatPercentage(calculator.successRate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDuration(calculator.averageDuration)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && statistics && showUserActivity && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">User Activity</h3>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Calculators Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Success Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contribution Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {statistics.userActivity.map((user, index) => (
                      <tr key={user.userId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.username || user.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(user.totalUsage)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.uniqueCalculators}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.successRate >= 0.9 
                              ? 'bg-green-100 text-green-800'
                              : user.successRate >= 0.7
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {formatPercentage(user.successRate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${user.contributionScore}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{user.contributionScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && statistics && showPerformanceMetrics && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Average Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDuration(statistics.performanceMetrics.averageResponseTime)}
                      </p>
                    </div>
                    <div className="text-blue-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">95th Percentile</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDuration(statistics.performanceMetrics.p95ResponseTime)}
                      </p>
                    </div>
                    <div className="text-orange-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPercentage(statistics.performanceMetrics.availability)}
                      </p>
                    </div>
                    <div className="text-green-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && teamAnalytics && showTeamAnalytics && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Team Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900">{teamAnalytics.memberCount}</p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Collaboration Score</p>
                    <p className="text-2xl font-bold text-gray-900">{teamAnalytics.collaborationScore}</p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Shared Presets</p>
                    <p className="text-2xl font-bold text-gray-900">{teamAnalytics.sharedPresets}</p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Knowledge Share Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPercentage(teamAnalytics.knowledgeShareRate / 100)}</p>
                  </div>
                </div>
              </div>

              {/* Top Contributors */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Top Contributors</h4>
                <div className="space-y-3">
                  {teamAnalytics.topContributors.map((contributor, index) => (
                    <div key={contributor.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {contributor.username || contributor.userId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatNumber(contributor.totalUsage)} calculations
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Score: {contributor.contributionScore}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPercentage(contributor.successRate)} success
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
