/**
 * Pattern Statistics Widget Component
 * Displays pattern recognition statistics and metrics
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { usePatternRecognition } from '../../hooks/usePatternRecognition';

export interface PatternStatsWidgetProps {
  userId?: string;
  className?: string;
  showDetails?: boolean;
  refreshInterval?: number;
}

export function PatternStatsWidget({
  userId,
  className = '',
  showDetails = false,
  refreshInterval = 300000, // 5 minutes
}: PatternStatsWidgetProps) {
  const { theme } = useTheme();
  const [showAllStats, setShowAllStats] = useState(false);
  
  const [state, actions] = usePatternRecognition({
    userId,
    autoAnalyze: true,
    refreshInterval,
  });

  const { patterns, loading, error, lastAnalyzed } = state;

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (patterns.length === 0) {
      return {
        totalPatterns: 0,
        averageConfidence: 0,
        patternsByType: {},
        highConfidencePatterns: 0,
        anomaliesDetected: 0,
        lastAnalysis: lastAnalyzed,
      };
    }

    const patternsByType: Record<string, number> = {};
    let totalConfidence = 0;
    let highConfidenceCount = 0;
    let anomaliesCount = 0;

    patterns.forEach(pattern => {
      // Count by type
      patternsByType[pattern.type] = (patternsByType[pattern.type] || 0) + 1;
      
      // Sum confidence
      totalConfidence += pattern.confidence;
      
      // Count high confidence patterns
      if (pattern.confidence >= 0.8) {
        highConfidenceCount++;
      }
      
      // Count anomalies
      if (pattern.type === 'anomaly-detection') {
        anomaliesCount++;
      }
    });

    return {
      totalPatterns: patterns.length,
      averageConfidence: totalConfidence / patterns.length,
      patternsByType,
      highConfidencePatterns: highConfidenceCount,
      anomaliesDetected: anomaliesCount,
      lastAnalysis: lastAnalyzed,
    };
  }, [patterns, lastAnalyzed]);

  // Get pattern type display name
  const getPatternTypeDisplayName = useCallback((type: string) => {
    const displayNames: Record<string, string> = {
      'parameter-frequency': 'Parameter Frequency',
      'calculator-usage': 'Calculator Usage',
      'time-activity': 'Time Activity',
      'parameter-combination': 'Parameter Combinations',
      'behavior-sequence': 'Behavior Sequences',
      'anomaly-detection': 'Anomalies',
      'parameter-correlation': 'Parameter Correlations',
      'usage-evolution': 'Usage Evolution',
    };
    return displayNames[type] || type;
  }, []);

  // Get pattern type color
  const getPatternTypeColor = useCallback((type: string) => {
    const colors: Record<string, string> = {
      'parameter-frequency': 'bg-blue-100 text-blue-800',
      'calculator-usage': 'bg-green-100 text-green-800',
      'time-activity': 'bg-purple-100 text-purple-800',
      'parameter-combination': 'bg-yellow-100 text-yellow-800',
      'behavior-sequence': 'bg-indigo-100 text-indigo-800',
      'anomaly-detection': 'bg-red-100 text-red-800',
      'parameter-correlation': 'bg-pink-100 text-pink-800',
      'usage-evolution': 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }, []);

  if (loading) {
    return (
      <div className={`pattern-stats-widget ${className}`}>
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pattern-stats-widget ${className}`}>
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`pattern-stats-widget ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Pattern Statistics
            </h3>
            {showDetails && (
              <button
                onClick={() => setShowAllStats(!showAllStats)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {showAllStats ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
          {stats.lastAnalysis && (
            <p className="text-xs text-gray-500 mt-1">
              Last analyzed: {new Date(stats.lastAnalysis).toLocaleString()}
            </p>
          )}
        </div>

        {/* Main Stats */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Total Patterns */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Total Patterns</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPatterns}</p>
                </div>
              </div>
            </div>

            {/* Average Confidence */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Avg Confidence</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(stats.averageConfidence * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* High Confidence Patterns */}
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">High Confidence</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.highConfidencePatterns}</p>
                </div>
              </div>
            </div>

            {/* Anomalies Detected */}
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-900">Anomalies</p>
                  <p className="text-2xl font-bold text-red-600">{stats.anomaliesDetected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Types Breakdown */}
          {(showAllStats || showDetails) && Object.keys(stats.patternsByType).length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Pattern Types</h4>
              <div className="space-y-2">
                {Object.entries(stats.patternsByType)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPatternTypeColor(type)}`}>
                          {getPatternTypeDisplayName(type)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* No Patterns Message */}
          {stats.totalPatterns === 0 && (
            <div className="text-center py-4">
              <div className="text-gray-400 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                No patterns detected yet. Use the calculators to generate insights.
              </p>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="px-4 py-3 border-t bg-gray-50">
          <button
            onClick={() => actions.refreshPatterns(userId)}
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>
      </div>
    </div>
  );
}
