/**
 * Smart Defaults Widget Component
 * Compact widget for displaying smart default values
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { useParameterSmartDefaults } from '../../hooks/useSmartDefaults';
import { DefaultValueIndicator } from './DefaultValueIndicator';

export interface SmartDefaultsWidgetProps {
  calculatorType: string;
  parameterName: string;
  currentParameters?: Record<string, any>;
  context?: {
    timeOfDay?: string;
    taskType?: string;
    deviceType?: string;
    urgency?: 'low' | 'medium' | 'high';
  };
  userId?: string;
  className?: string;
  onApplyDefault?: (parameterName: string, value: any) => void;
  compact?: boolean;
  showMultiple?: boolean;
}

export function SmartDefaultsWidget({
  calculatorType,
  parameterName,
  currentParameters,
  context,
  userId,
  className = '',
  onApplyDefault,
  compact = true,
  showMultiple = false,
}: SmartDefaultsWidgetProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  const {
    defaults,
    bestDefault,
    loading,
    error,
    recordFeedback,
    refresh,
  } = useParameterSmartDefaults(
    calculatorType,
    parameterName,
    currentParameters,
    context,
    userId
  );

  // Handle apply default value
  const handleApplyDefault = useCallback((defaultValue: any) => {
    if (onApplyDefault) {
      onApplyDefault(parameterName, defaultValue.value);
    }
  }, [onApplyDefault, parameterName]);

  // Handle feedback
  const handleFeedback = useCallback((defaultId: string, accepted: boolean) => {
    recordFeedback(defaultId, accepted, userId);
  }, [recordFeedback, userId]);

  if (loading) {
    return (
      <div className={`smart-defaults-widget ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (error || !bestDefault) {
    return null; // Don't show widget if there are no defaults or errors
  }

  if (compact && !expanded) {
    return (
      <div className={`smart-defaults-widget ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">Smart:</div>
          <DefaultValueIndicator
            defaultValue={bestDefault}
            onApply={handleApplyDefault}
            onFeedback={handleFeedback}
            compact={true}
            showConfidence={true}
            showExplanation={false}
          />
          {defaults.length > 1 && (
            <button
              onClick={() => setExpanded(true)}
              className="text-xs text-blue-600 hover:text-blue-700 focus:outline-none"
              title={`${defaults.length - 1} more defaults available`}
            >
              +{defaults.length - 1}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`smart-defaults-widget ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-3 py-2 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">
                Smart Defaults for {parameterName}
              </h3>
            </div>
            <div className="flex items-center space-x-1">
              {compact && (
                <button
                  onClick={() => setExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
              <button
                onClick={refresh}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                title="Refresh defaults"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Defaults List */}
        <div className="p-3">
          <div className="space-y-3">
            {(showMultiple ? defaults : [bestDefault]).map((defaultValue, index) => (
              <DefaultValueIndicator
                key={defaultValue.id}
                defaultValue={defaultValue}
                onApply={handleApplyDefault}
                onFeedback={handleFeedback}
                compact={false}
                showConfidence={true}
                showExplanation={true}
              />
            ))}
          </div>

          {!showMultiple && defaults.length > 1 && (
            <div className="mt-3 pt-3 border-t">
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-blue-600 hover:text-blue-700 focus:outline-none"
              >
                Show {defaults.length - 1} more default{defaults.length > 2 ? 's' : ''}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Based on your usage patterns
            </div>
            <div className="text-xs text-gray-400">
              {defaults.length} suggestion{defaults.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
