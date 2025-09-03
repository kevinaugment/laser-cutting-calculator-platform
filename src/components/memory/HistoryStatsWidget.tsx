/**
 * History Statistics Widget
 * Displays calculation history statistics and insights
 */

import React from 'react';
import { useTheme } from '../../theme';
import { useCalculationStats } from '../../hooks/useCalculationHistory';
import { formatNumber, formatDuration, formatCalculatorName } from '../../utils/formatters';

export interface HistoryStatsWidgetProps {
  className?: string;
  compact?: boolean;
}

export function HistoryStatsWidget({ 
  className = '', 
  compact = false 
}: HistoryStatsWidgetProps) {
  const { theme } = useTheme();
  const [stats, loading, error, refreshStats] = useCalculationStats();

  if (loading) {
    return (
      <div className={`history-stats-widget ${className}`}>
        <div className="bg-white border rounded-lg p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`history-stats-widget ${className}`}>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-center text-red-600">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Failed to load statistics</p>
            <button 
              onClick={refreshStats}
              className="text-xs text-primary-600 hover:text-primary-800 mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalRecords === 0) {
    return (
      <div className={`history-stats-widget ${className}`}>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">No calculation data yet</p>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`history-stats-widget ${className}`}>
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {formatNumber(stats.totalRecords, { compact: true })}
              </div>
              <div className="text-xs text-gray-600">Calculations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {formatDuration(stats.averageExecutionTime)}
              </div>
              <div className="text-xs text-gray-600">Avg Time</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get top calculators
  const topCalculators = Object.entries(stats.calculatorUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get recent activity (last 7 days)
  const recentActivity = stats.dailyUsage.slice(-7);

  return (
    <div className={`history-stats-widget ${className}`}>
      <div className="bg-white border rounded-lg">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Usage Statistics
            </h3>
            <button
              onClick={refreshStats}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Refresh statistics"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {formatNumber(stats.totalRecords, { compact: true })}
              </div>
              <div className="text-sm text-primary-700">Total Calculations</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatDuration(stats.averageExecutionTime)}
              </div>
              <div className="text-sm text-green-700">Average Time</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(stats.calculatorUsage).length}
              </div>
              <div className="text-sm text-blue-700">Calculators Used</div>
            </div>
          </div>

          {/* Top Calculators */}
          {topCalculators.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Most Used Calculators
              </h4>
              <div className="space-y-2">
                {topCalculators.map(([calculatorType, count]) => {
                  const percentage = (count / stats.totalRecords) * 100;
                  return (
                    <div key={calculatorType} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {formatCalculatorName(calculatorType)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-4 text-sm text-gray-600">
                        {count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Most Used Parameters */}
          {stats.mostUsedParameters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Most Used Parameters
              </h4>
              <div className="space-y-2">
                {stats.mostUsedParameters.slice(0, 5).map((param) => (
                  <div key={param.parameter} className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 font-medium">{param.parameter}</span>
                    <div className="text-gray-600">
                      <span className="mr-2">{param.count} times</span>
                      <span className="text-xs">
                        (avg: {formatNumber(param.averageValue, { precision: 2 })})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Recent Activity (Last 7 Days)
              </h4>
              <div className="flex items-end justify-between h-20 gap-1">
                {recentActivity.map((day) => {
                  const maxCount = Math.max(...recentActivity.map(d => d.count));
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-primary-600 rounded-t transition-all duration-300"
                        style={{ height: `${height}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                        title={`${day.count} calculations on ${new Date(day.date).toLocaleDateString()}`}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
