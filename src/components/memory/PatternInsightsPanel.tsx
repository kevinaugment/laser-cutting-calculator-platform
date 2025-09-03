/**
 * Pattern Insights Panel Component
 * Displays pattern recognition insights and recommendations
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../theme';
import { usePatternInsights, useAnomalyDetectionPatterns } from '../../hooks/usePatternRecognition';

export interface PatternInsightsPanelProps {
  userId?: string;
  className?: string;
  showCategories?: boolean;
  showAnomalies?: boolean;
  maxInsights?: number;
}

interface PatternInsight {
  id: string;
  type: string;
  confidence: number;
  description: string;
  recommendation: string;
  priority: number;
}

export function PatternInsightsPanel({
  userId,
  className = '',
  showCategories = true,
  showAnomalies = true,
  maxInsights = 10,
}: PatternInsightsPanelProps) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const {
    insights,
    topInsights,
    categorizedInsights,
    anomalies,
    loading,
    error,
    refresh,
  } = usePatternInsights(userId);

  const {
    patterns: anomalyPatterns,
    anomalies: highAnomalies,
    warnings,
  } = useAnomalyDetectionPatterns(userId);

  // Handle category selection
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  // Get insights for active category
  const getActiveInsights = useCallback(() => {
    if (activeCategory === 'all') {
      return insights.slice(0, maxInsights);
    }
    
    if (activeCategory === 'anomalies') {
      return anomalies.slice(0, maxInsights);
    }
    
    return categorizedInsights[activeCategory as keyof typeof categorizedInsights]?.slice(0, maxInsights) || [];
  }, [activeCategory, insights, anomalies, categorizedInsights, maxInsights]);

  const activeInsights = getActiveInsights();

  // Get confidence color
  const getConfidenceColor = useCallback((confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: number) => {
    if (priority >= 0.8) return 'border-red-500 bg-red-50';
    if (priority >= 0.6) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  }, []);

  // Get pattern type icon
  const getPatternIcon = useCallback((type: string) => {
    switch (type) {
      case 'parameter-frequency':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'calculator-usage':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'time-activity':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'anomaly-detection':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'behavior-sequence':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'parameter-correlation':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  }, []);

  if (loading) {
    return (
      <div className={`pattern-insights-panel ${className}`}>
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pattern-insights-panel ${className}`}>
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retry Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`pattern-insights-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Pattern Insights
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered insights from your usage patterns
              </p>
            </div>
            <button
              onClick={refresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        {showCategories && (
          <div className="px-6 py-3 border-b bg-gray-50">
            <nav className="flex space-x-8" aria-label="Pattern Categories">
              {[
                { id: 'all', label: 'All Insights', count: insights.length },
                { id: 'optimization', label: 'Optimization', count: categorizedInsights.optimization?.length || 0 },
                { id: 'workflow', label: 'Workflow', count: categorizedInsights.workflow?.length || 0 },
                { id: 'quality', label: 'Quality', count: categorizedInsights.quality?.length || 0 },
                { id: 'usage', label: 'Usage', count: categorizedInsights.usage?.length || 0 },
                ...(showAnomalies ? [{ id: 'anomalies', label: 'Anomalies', count: anomalies.length }] : []),
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeCategory === category.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {category.label}
                  {category.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeCategory === category.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Anomaly Alerts */}
        {showAnomalies && highAnomalies.length > 0 && activeCategory === 'all' && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {highAnomalies.length} High-Priority Anomal{highAnomalies.length === 1 ? 'y' : 'ies'} Detected
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Unusual patterns detected that may require attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Insights List */}
        <div className="p-6">
          {activeInsights.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
              <p className="text-gray-600">
                {activeCategory === 'all' 
                  ? 'Use the calculators more to generate insights from your usage patterns.'
                  : `No insights available in the ${activeCategory} category.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`border rounded-lg p-4 transition-colors ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="text-gray-600">
                        {getPatternIcon(insight.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {insight.type.replace('-', ' ')}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {insight.description}
                      </p>
                      <div className="bg-white bg-opacity-50 rounded-md p-3">
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">Recommendation</p>
                            <p className="text-sm text-blue-800">{insight.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
