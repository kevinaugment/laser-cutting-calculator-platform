/**
 * Recommendation Widget Component
 * Compact widget for displaying quick recommendations
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { useRecommendation } from '../../hooks/useRecommendation';
import { RecommendationType, RecommendationResult } from '../../services/recommendationService';

export interface RecommendationWidgetProps {
  userId?: string;
  calculatorType?: string;
  currentParameters?: Record<string, any>;
  className?: string;
  maxRecommendations?: number;
  showType?: RecommendationType;
  compact?: boolean;
  onRecommendationApply?: (recommendation: RecommendationResult) => void;
}

export function RecommendationWidget({
  userId,
  calculatorType,
  currentParameters,
  className = '',
  maxRecommendations = 3,
  showType = 'parameter-value',
  compact = true,
  onRecommendationApply,
}: RecommendationWidgetProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  const [state, actions] = useRecommendation({
    userId,
    autoGenerate: true,
    defaultRequest: {
      calculatorType,
      currentParameters,
      recommendationType: [showType],
      limit: maxRecommendations,
      minConfidence: 0.5, // Higher threshold for widget
    },
  });

  const { recommendations, loading, error } = state;

  // Handle recommendation apply
  const handleApplyRecommendation = useCallback((recommendation: RecommendationResult) => {
    if (onRecommendationApply) {
      onRecommendationApply(recommendation);
    }
  }, [onRecommendationApply]);

  // Get type display name
  const getTypeDisplayName = useCallback((type: RecommendationType) => {
    const displayNames: Record<RecommendationType, string> = {
      'parameter-value': 'Parameter Suggestions',
      'parameter-combination': 'Parameter Combos',
      'calculator-workflow': 'Next Steps',
      'optimization-suggestion': 'Optimizations',
      'contextual-recommendation': 'Smart Tips',
    };
    return displayNames[type] || type;
  }, []);

  // Get type icon
  const getTypeIcon = useCallback((type: RecommendationType) => {
    switch (type) {
      case 'parameter-value':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'optimization-suggestion':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
    }
  }, []);

  if (loading) {
    return (
      <div className={`recommendation-widget ${className}`}>
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null; // Don't show widget if there are no recommendations
  }

  const topRecommendation = recommendations[0];

  if (compact && !expanded) {
    return (
      <div className={`recommendation-widget ${className}`}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-blue-600">
                {getTypeIcon(showType)}
              </div>
              <h4 className="text-sm font-medium text-blue-900">
                {getTypeDisplayName(showType)}
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {Math.round(topRecommendation.confidence * 100)}%
              </span>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            {topRecommendation.description}
          </p>
          {topRecommendation.actionable && (
            <button
              onClick={() => handleApplyRecommendation(topRecommendation)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`recommendation-widget ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-gray-600">
                {getTypeIcon(showType)}
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                {getTypeDisplayName(showType)}
              </h3>
            </div>
            {compact && (
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="p-4">
          <div className="space-y-3">
            {recommendations.slice(0, maxRecommendations).map((recommendation, index) => (
              <div
                key={recommendation.id}
                className={`${index > 0 ? 'border-t pt-3' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {recommendation.title}
                      </h4>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {Math.round(recommendation.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {recommendation.description}
                    </p>
                    {!compact && (
                      <p className="text-xs text-blue-600 mb-2">
                        {recommendation.explanation}
                      </p>
                    )}
                  </div>
                </div>
                {recommendation.actionable && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleApplyRecommendation(recommendation)}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary-500"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {recommendations.length > maxRecommendations && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                +{recommendations.length - maxRecommendations} more recommendations available
              </p>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="px-4 py-3 border-t bg-gray-50">
          <button
            onClick={() => actions.refreshRecommendations()}
            disabled={loading}
            className="w-full inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
}
