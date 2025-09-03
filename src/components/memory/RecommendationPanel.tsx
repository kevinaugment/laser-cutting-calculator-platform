/**
 * Recommendation Panel Component
 * Displays ML-based recommendations and smart suggestions
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../theme';
import { useRecommendation } from '../../hooks/useRecommendation';
import { RecommendationType, RecommendationResult } from '../../services/recommendationService';

export interface RecommendationPanelProps {
  userId?: string;
  calculatorType?: string;
  currentParameters?: Record<string, any>;
  context?: {
    timeOfDay?: string;
    recentActivity?: string[];
    taskType?: string;
    urgency?: 'low' | 'medium' | 'high';
  };
  className?: string;
  showTypes?: RecommendationType[];
  maxRecommendations?: number;
  onRecommendationApply?: (recommendation: RecommendationResult) => void;
}

export function RecommendationPanel({
  userId,
  calculatorType,
  currentParameters,
  context,
  className = '',
  showTypes = ['parameter-value', 'parameter-combination', 'optimization-suggestion', 'contextual-recommendation'],
  maxRecommendations = 10,
  onRecommendationApply,
}: RecommendationPanelProps) {
  const { theme } = useTheme();
  const [activeType, setActiveType] = useState<RecommendationType | 'all'>('all');
  
  const [state, actions] = useRecommendation({
    userId,
    autoGenerate: true,
    defaultRequest: {
      calculatorType,
      currentParameters,
      context,
      recommendationType: showTypes,
      limit: maxRecommendations,
    },
  });

  const { recommendations, loading, error } = state;

  // Handle type filter change
  const handleTypeChange = useCallback((type: RecommendationType | 'all') => {
    setActiveType(type);
  }, []);

  // Get filtered recommendations
  const getFilteredRecommendations = useCallback(() => {
    if (activeType === 'all') {
      return recommendations;
    }
    return recommendations.filter(r => r.type === activeType);
  }, [activeType, recommendations]);

  const filteredRecommendations = getFilteredRecommendations();

  // Handle recommendation apply
  const handleApplyRecommendation = useCallback((recommendation: RecommendationResult) => {
    if (onRecommendationApply) {
      onRecommendationApply(recommendation);
    }
  }, [onRecommendationApply]);

  // Get recommendation type display name
  const getTypeDisplayName = useCallback((type: RecommendationType) => {
    const displayNames: Record<RecommendationType, string> = {
      'parameter-value': 'Parameter Values',
      'parameter-combination': 'Parameter Combinations',
      'calculator-workflow': 'Calculator Workflow',
      'optimization-suggestion': 'Optimization',
      'contextual-recommendation': 'Contextual',
    };
    return displayNames[type] || type;
  }, []);

  // Get recommendation type icon
  const getTypeIcon = useCallback((type: RecommendationType) => {
    switch (type) {
      case 'parameter-value':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'parameter-combination':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m2 8l-2 2 2 2M9 7l6 6-6 6" />
          </svg>
        );
      case 'calculator-workflow':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'optimization-suggestion':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'contextual-recommendation':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  // Get confidence color
  const getConfidenceColor = useCallback((confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  }, []);

  if (loading) {
    return (
      <div className={`recommendation-panel ${className}`}>
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
      <div className={`recommendation-panel ${className}`}>
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendation Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => actions.refreshRecommendations()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`recommendation-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Smart Recommendations
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered suggestions based on your usage patterns
              </p>
            </div>
            <button
              onClick={() => actions.refreshRecommendations()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Type Filter Tabs */}
        {showTypes.length > 1 && (
          <div className="px-6 py-3 border-b bg-gray-50">
            <nav className="flex space-x-8" aria-label="Recommendation Types">
              <button
                onClick={() => handleTypeChange('all')}
                className={`inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeType === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeType === 'all'
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {recommendations.length}
                </span>
              </button>
              {showTypes.map((type) => {
                const typeRecommendations = recommendations.filter(r => r.type === type);
                return (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeType === type
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{getTypeIcon(type)}</span>
                    {getTypeDisplayName(type)}
                    {typeRecommendations.length > 0 && (
                      <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeType === type
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {typeRecommendations.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Recommendations List */}
        <div className="p-6">
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
              <p className="text-gray-600">
                {activeType === 'all' 
                  ? 'Use the calculators more to generate personalized recommendations.'
                  : `No ${getTypeDisplayName(activeType as RecommendationType).toLowerCase()} recommendations available.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-gray-600">
                          {getTypeIcon(recommendation.type)}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {recommendation.title}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                          {Math.round(recommendation.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="bg-blue-50 rounded-md p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {recommendation.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                  {recommendation.actionable && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleApplyRecommendation(recommendation)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Apply Recommendation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
