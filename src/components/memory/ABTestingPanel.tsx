/**
 * A/B Testing Panel Component
 * Management interface for A/B testing experiments
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { useABTesting } from '../../hooks/useABTesting';
import { ABExperiment, ExperimentResults } from '../../services/abTestingService';

export interface ABTestingPanelProps {
  className?: string;
  showResults?: boolean;
  showCreateForm?: boolean;
  onExperimentSelect?: (experiment: ABExperiment) => void;
}

export function ABTestingPanel({
  className = '',
  showResults = true,
  showCreateForm = false,
  onExperimentSelect,
}: ABTestingPanelProps) {
  const { theme } = useTheme();
  const [state, actions] = useABTesting();
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [showResultsPanel, setShowResultsPanel] = useState(false);

  // Handle experiment selection
  const handleExperimentSelect = useCallback((experiment: ABExperiment) => {
    setSelectedExperiment(experiment.id);
    if (onExperimentSelect) {
      onExperimentSelect(experiment);
    }
  }, [onExperimentSelect]);

  // Handle view results
  const handleViewResults = useCallback((experimentId: string) => {
    setSelectedExperiment(experimentId);
    setShowResultsPanel(true);
  }, []);

  // Get experiment results
  const getResults = useCallback((experimentId: string): ExperimentResults | null => {
    return actions.getExperimentResults(experimentId);
  }, [actions]);

  // Get status color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'draft':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'completed':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'archived':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  }, []);

  if (state.loading) {
    return (
      <div className={`ab-testing-panel ${className}`}>
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

  if (state.error) {
    return (
      <div className={`ab-testing-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                A/B Testing Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{state.error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ab-testing-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                A/B Testing Experiments
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              {state.experiments.length} active experiments
            </div>
          </div>
        </div>

        {/* Experiments List */}
        <div className="p-4">
          {state.experiments.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No experiments</h3>
              <p className="mt-1 text-sm text-gray-500">
                No A/B testing experiments are currently active.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.experiments.map((experiment) => (
                <div
                  key={experiment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleExperimentSelect(experiment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {experiment.name}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(experiment.status)}`}>
                          {experiment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {experiment.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          {experiment.variants.length} variants
                        </span>
                        <span>
                          {experiment.metrics.length} metrics
                        </span>
                        <span>
                          {experiment.trafficAllocation}% traffic
                        </span>
                        <span>
                          Started {experiment.startDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {actions.isInExperiment(experiment.id) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Participating
                        </span>
                      )}
                      {showResults && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewResults(experiment.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Results
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Variants Preview */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-4">
                      {experiment.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            variant.type === 'control' ? 'bg-gray-400' : 'bg-blue-400'
                          }`}></div>
                          <span className="text-xs text-gray-600">
                            {variant.name} ({variant.trafficWeight}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Panel */}
        {showResultsPanel && selectedExperiment && (
          <div className="border-t bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">
                Experiment Results
              </h4>
              <button
                onClick={() => setShowResultsPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const results = getResults(selectedExperiment);
              if (!results) {
                return (
                  <div className="text-sm text-gray-500">
                    No results available for this experiment.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-xs text-gray-500">Total Participants</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {results.totalParticipants}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-xs text-gray-500">Confidence Level</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(results.statisticalSignificance.confidenceLevel * 100)}%
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-xs text-gray-500">Significance</div>
                      <div className={`text-lg font-semibold ${
                        results.statisticalSignificance.overallSignificance 
                          ? 'text-green-600' 
                          : 'text-gray-600'
                      }`}>
                        {results.statisticalSignificance.overallSignificance ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="text-xs text-gray-500">Recommended Action</div>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {results.statisticalSignificance.recommendedAction.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Variant Results */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">Variant Performance</h5>
                    {results.variantResults.map((variant) => (
                      <div key={variant.variantId} className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {variant.variantName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {variant.participants} participants
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Conversion Rate: {Math.round(variant.conversionRate * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  {results.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {results.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
