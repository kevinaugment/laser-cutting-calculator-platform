/**
 * Default Value Indicator Component
 * Displays smart default values with confidence indicators
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { DefaultValueResult } from '../../services/smartDefaultsService';
import { useDefaultConfidence } from '../../hooks/useConfidenceScoring';
import { ConfidenceIndicator } from './ConfidenceIndicator';

export interface DefaultValueIndicatorProps {
  defaultValue: DefaultValueResult | null;
  loading?: boolean;
  onApply?: (defaultValue: DefaultValueResult) => void;
  onFeedback?: (defaultId: string, accepted: boolean) => void;
  className?: string;
  compact?: boolean;
  showConfidence?: boolean;
  showExplanation?: boolean;
}

export function DefaultValueIndicator({
  defaultValue,
  loading = false,
  onApply,
  onFeedback,
  className = '',
  compact = false,
  showConfidence = true,
  showExplanation = true,
}: DefaultValueIndicatorProps) {
  const { theme } = useTheme();
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Handle apply default value
  const handleApply = useCallback(() => {
    if (defaultValue && onApply) {
      onApply(defaultValue);
      if (onFeedback) {
        onFeedback(defaultValue.id, true);
        setFeedbackGiven(true);
      }
    }
  }, [defaultValue, onApply, onFeedback]);

  // Handle reject default value
  const handleReject = useCallback(() => {
    if (defaultValue && onFeedback) {
      onFeedback(defaultValue.id, false);
      setFeedbackGiven(true);
    }
  }, [defaultValue, onFeedback]);

  // Get confidence color
  const getConfidenceColor = useCallback((confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100 border-green-200';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-orange-600 bg-orange-100 border-orange-200';
  }, []);

  // Get type icon
  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'frequency-based':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'context-aware':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pattern-based':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'recommendation-integrated':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'fallback':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  }, []);

  // Get type display name
  const getTypeDisplayName = useCallback((type: string) => {
    const displayNames: Record<string, string> = {
      'frequency-based': 'Frequent',
      'context-aware': 'Context',
      'pattern-based': 'Pattern',
      'recommendation-integrated': 'Recommended',
      'adaptive-learning': 'Learned',
      'fallback': 'Default',
    };
    return displayNames[type] || type;
  }, []);

  if (loading) {
    return (
      <div className={`default-value-indicator ${className}`}>
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (!defaultValue) {
    return null;
  }

  if (compact) {
    return (
      <div className={`default-value-indicator ${className}`}>
        <div className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium ${getConfidenceColor(defaultValue.confidence)}`}>
          <span className="mr-1">{getTypeIcon(defaultValue.type)}</span>
          <span className="mr-2">{defaultValue.value}</span>
          {showConfidence && (
            <span className="text-xs opacity-75">
              {Math.round(defaultValue.confidence * 100)}%
            </span>
          )}
          {onApply && (
            <button
              onClick={handleApply}
              className="ml-2 hover:opacity-75 focus:outline-none"
              title="Apply this default value"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`default-value-indicator ${className}`}>
      <div className={`border rounded-lg p-3 ${getConfidenceColor(defaultValue.confidence)}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-shrink-0">
                {getTypeIcon(defaultValue.type)}
              </div>
              <div>
                <h4 className="text-sm font-medium">
                  Smart Default: {defaultValue.value}
                </h4>
                <p className="text-xs opacity-75">
                  {getTypeDisplayName(defaultValue.type)} • {defaultValue.source}
                </p>
              </div>
              {showConfidence && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-50">
                  {Math.round(defaultValue.confidence * 100)}% confidence
                </span>
              )}
            </div>
            
            {showExplanation && (
              <p className="text-xs mb-3 opacity-90">
                {defaultValue.explanation}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {onApply && (
              <button
                onClick={handleApply}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-current bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
              >
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply
              </button>
            )}
          </div>

          {onFeedback && !feedbackGiven && (
            <div className="flex items-center space-x-1">
              <span className="text-xs opacity-75">Helpful?</span>
              <button
                onClick={handleApply}
                className="p-1 hover:bg-white hover:bg-opacity-50 rounded focus:outline-none"
                title="Yes, this is helpful"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <button
                onClick={handleReject}
                className="p-1 hover:bg-white hover:bg-opacity-50 rounded focus:outline-none"
                title="No, this is not helpful"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </button>
            </div>
          )}

          {feedbackGiven && (
            <span className="text-xs opacity-75">Thanks for your feedback!</span>
          )}
        </div>
      </div>
    </div>
  );
}
