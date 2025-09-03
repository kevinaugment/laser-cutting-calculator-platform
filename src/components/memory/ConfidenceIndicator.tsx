/**
 * Confidence Indicator Component
 * Visual indicator for confidence scores with detailed breakdown
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { ConfidenceScore, ConfidenceLevel } from '../../services/confidenceScoringService';

export interface ConfidenceIndicatorProps {
  confidence: ConfidenceScore;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  showFactors?: boolean;
  interactive?: boolean;
  onDetailsToggle?: (expanded: boolean) => void;
}

export function ConfidenceIndicator({
  confidence,
  className = '',
  size = 'medium',
  showDetails = false,
  showFactors = false,
  interactive = true,
  onDetailsToggle,
}: ConfidenceIndicatorProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(showDetails);

  // Handle expand/collapse
  const handleToggle = useCallback(() => {
    if (!interactive) return;
    
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    if (onDetailsToggle) {
      onDetailsToggle(newExpanded);
    }
  }, [expanded, interactive, onDetailsToggle]);

  // Get size classes
  const getSizeClasses = useCallback(() => {
    switch (size) {
      case 'small':
        return {
          container: 'text-xs',
          badge: 'px-2 py-0.5 text-xs',
          icon: 'w-3 h-3',
          score: 'text-xs',
        };
      case 'large':
        return {
          container: 'text-base',
          badge: 'px-4 py-2 text-sm',
          icon: 'w-6 h-6',
          score: 'text-lg',
        };
      default: // medium
        return {
          container: 'text-sm',
          badge: 'px-3 py-1 text-sm',
          icon: 'w-4 h-4',
          score: 'text-sm',
        };
    }
  }, [size]);

  // Get confidence icon
  const getConfidenceIcon = useCallback((level: ConfidenceLevel) => {
    const iconClasses = getSizeClasses().icon;
    
    switch (level) {
      case 'very-high':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'high':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'medium':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'low':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'very-low':
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  }, [getSizeClasses]);

  const sizeClasses = getSizeClasses();

  return (
    <div className={`confidence-indicator ${className}`}>
      {/* Main Confidence Badge */}
      <div
        className={`inline-flex items-center rounded-full border font-medium cursor-pointer transition-all duration-200 ${confidence.visualIndicator.cssClass} ${sizeClasses.badge} ${
          interactive ? 'hover:shadow-sm' : ''
        }`}
        onClick={handleToggle}
        title={confidence.visualIndicator.description}
      >
        <span className="mr-1">
          {getConfidenceIcon(confidence.level)}
        </span>
        <span className={sizeClasses.score}>
          {Math.round(confidence.score * 100)}%
        </span>
        <span className="ml-1 opacity-75">
          {confidence.visualIndicator.label}
        </span>
        {interactive && (
          <span className="ml-1 opacity-50">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </span>
        )}
      </div>

      {/* Detailed Breakdown */}
      {expanded && (
        <div className="mt-3 p-3 bg-white border rounded-lg shadow-sm">
          {/* Explanation */}
          <div className="mb-3">
            <p className="text-sm text-gray-700">
              {confidence.explanation}
            </p>
          </div>

          {/* Confidence Factors */}
          {showFactors && confidence.factors.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Contributing Factors
              </h4>
              <div className="space-y-2">
                {confidence.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          {factor.name}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          factor.impact === 'positive' 
                            ? 'bg-green-100 text-green-800'
                            : factor.impact === 'negative'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {factor.impact}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {factor.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            factor.value >= 0.8 ? 'bg-green-500' :
                            factor.value >= 0.6 ? 'bg-yellow-500' :
                            factor.value >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${factor.value * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-10 text-right">
                        {Math.round(factor.value * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reliability Indicator */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Confidence Reliability
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-12 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      confidence.reliability >= 0.8 ? 'bg-blue-500' :
                      confidence.reliability >= 0.6 ? 'bg-blue-400' :
                      confidence.reliability >= 0.4 ? 'bg-blue-300' : 'bg-blue-200'
                    }`}
                    style={{ width: `${confidence.reliability * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(confidence.reliability * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
