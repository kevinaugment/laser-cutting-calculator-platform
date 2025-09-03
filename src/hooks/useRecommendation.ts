/**
 * Recommendation Hook
 * React hook for recommendation system functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  recommendationService, 
  RecommendationRequest,
  RecommendationResult,
  RecommendationType 
} from '../services/recommendationService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface RecommendationState {
  recommendations: RecommendationResult[];
  loading: boolean;
  error: string | null;
  lastGenerated: string | null;
  generationInProgress: boolean;
}

export interface RecommendationActions {
  generateRecommendations: (request: RecommendationRequest) => Promise<RecommendationResult[]>;
  getRecommendationsByType: (type: RecommendationType, request: Omit<RecommendationRequest, 'recommendationType'>) => Promise<RecommendationResult[]>;
  refreshRecommendations: (request?: RecommendationRequest) => Promise<void>;
  clearCache: () => void;
  reset: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseRecommendationConfig {
  userId?: string;
  autoGenerate?: boolean;
  refreshInterval?: number; // in milliseconds
  enableRealTimeUpdates?: boolean;
  defaultRequest?: Partial<RecommendationRequest>;
}

const DEFAULT_CONFIG: Required<UseRecommendationConfig> = {
  userId: 'anonymous-user',
  autoGenerate: false, // Don't auto-generate by default
  refreshInterval: 0, // No auto-refresh by default
  enableRealTimeUpdates: false,
  defaultRequest: {},
};

// ============================================================================
// Main Hook
// ============================================================================

export function useRecommendation(
  config: UseRecommendationConfig = {}
): [RecommendationState, RecommendationActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<RecommendationState>({
    recommendations: [],
    loading: false,
    error: null,
    lastGenerated: null,
    generationInProgress: false,
  });

  // Generate recommendations
  const generateRecommendations = useCallback(async (request: RecommendationRequest): Promise<RecommendationResult[]> => {
    const finalRequest = {
      userId: finalConfig.userId,
      ...finalConfig.defaultRequest,
      ...request,
    };
    
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      generationInProgress: true 
    }));

    try {
      const recommendations = await recommendationService.generateRecommendations(finalRequest);
      
      setState(prev => ({
        ...prev,
        recommendations,
        loading: false,
        error: null,
        lastGenerated: new Date().toISOString(),
        generationInProgress: false,
      }));

      return recommendations;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Recommendation generation failed';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        generationInProgress: false,
      }));

      return [];
    }
  }, [finalConfig.userId, finalConfig.defaultRequest]);

  // Get recommendations by type
  const getRecommendationsByType = useCallback(async (
    type: RecommendationType, 
    request: Omit<RecommendationRequest, 'recommendationType'>
  ): Promise<RecommendationResult[]> => {
    const finalRequest = {
      userId: finalConfig.userId,
      ...finalConfig.defaultRequest,
      ...request,
    };
    
    try {
      const recommendations = await recommendationService.getRecommendationsByType(type, finalRequest);
      return recommendations;
    } catch (error) {
      console.error('Failed to get recommendations by type:', error);
      return [];
    }
  }, [finalConfig.userId, finalConfig.defaultRequest]);

  // Refresh recommendations
  const refreshRecommendations = useCallback(async (request?: RecommendationRequest): Promise<void> => {
    recommendationService.clearCache();
    if (request) {
      await generateRecommendations(request);
    } else if (finalConfig.defaultRequest) {
      await generateRecommendations(finalConfig.defaultRequest as RecommendationRequest);
    }
  }, [generateRecommendations, finalConfig.defaultRequest]);

  // Clear cache
  const clearCache = useCallback(() => {
    recommendationService.clearCache();
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState({
      recommendations: [],
      loading: false,
      error: null,
      lastGenerated: null,
      generationInProgress: false,
    });
    recommendationService.clearCache();
  }, []);

  // Auto-generate on mount
  useEffect(() => {
    if (finalConfig.autoGenerate && finalConfig.defaultRequest) {
      generateRecommendations(finalConfig.defaultRequest as RecommendationRequest);
    }
  }, [finalConfig.autoGenerate, finalConfig.defaultRequest, generateRecommendations]);

  // Set up refresh interval
  useEffect(() => {
    if (finalConfig.refreshInterval > 0 && finalConfig.defaultRequest) {
      const interval = setInterval(() => {
        if (!state.generationInProgress) {
          generateRecommendations(finalConfig.defaultRequest as RecommendationRequest);
        }
      }, finalConfig.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [finalConfig.refreshInterval, finalConfig.defaultRequest, state.generationInProgress, generateRecommendations]);

  // Actions object
  const actions: RecommendationActions = {
    generateRecommendations,
    getRecommendationsByType,
    refreshRecommendations,
    clearCache,
    reset,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for parameter value recommendations
 */
export function useParameterValueRecommendations(
  calculatorType?: string,
  currentParameters?: Record<string, any>,
  userId?: string
) {
  const [state, actions] = useRecommendation({
    userId,
    defaultRequest: {
      calculatorType,
      currentParameters,
      recommendationType: ['parameter-value'],
      limit: 5,
    },
  });
  
  const getParameterRecommendations = useCallback(async (parameter?: string) => {
    return await actions.getRecommendationsByType('parameter-value', {
      calculatorType,
      currentParameters,
      limit: parameter ? 3 : 5,
    });
  }, [actions, calculatorType, currentParameters]);

  return {
    recommendations: state.recommendations.filter(r => r.type === 'parameter-value'),
    loading: state.loading,
    error: state.error,
    getParameterRecommendations,
    refresh: () => actions.refreshRecommendations(),
  };
}

/**
 * Hook for parameter combination recommendations
 */
export function useParameterCombinationRecommendations(
  calculatorType?: string,
  partialParameters?: Record<string, any>,
  userId?: string
) {
  const [state, actions] = useRecommendation({
    userId,
    defaultRequest: {
      calculatorType,
      currentParameters: partialParameters,
      recommendationType: ['parameter-combination'],
      limit: 3,
    },
  });
  
  const getCombinationRecommendations = useCallback(async () => {
    return await actions.getRecommendationsByType('parameter-combination', {
      calculatorType,
      currentParameters: partialParameters,
      limit: 3,
    });
  }, [actions, calculatorType, partialParameters]);

  return {
    recommendations: state.recommendations.filter(r => r.type === 'parameter-combination'),
    loading: state.loading,
    error: state.error,
    getCombinationRecommendations,
    refresh: () => actions.refreshRecommendations(),
  };
}

/**
 * Hook for calculator workflow recommendations
 */
export function useCalculatorWorkflowRecommendations(
  currentCalculator?: string,
  userId?: string
) {
  const [state, actions] = useRecommendation({
    userId,
    defaultRequest: {
      calculatorType: currentCalculator,
      recommendationType: ['calculator-workflow'],
      limit: 3,
    },
  });
  
  const getWorkflowRecommendations = useCallback(async () => {
    return await actions.getRecommendationsByType('calculator-workflow', {
      calculatorType: currentCalculator,
      limit: 3,
    });
  }, [actions, currentCalculator]);

  return {
    recommendations: state.recommendations.filter(r => r.type === 'calculator-workflow'),
    loading: state.loading,
    error: state.error,
    getWorkflowRecommendations,
    refresh: () => actions.refreshRecommendations(),
  };
}

/**
 * Hook for optimization suggestions
 */
export function useOptimizationSuggestions(
  calculatorType?: string,
  currentParameters?: Record<string, any>,
  userId?: string
) {
  const [state, actions] = useRecommendation({
    userId,
    defaultRequest: {
      calculatorType,
      currentParameters,
      recommendationType: ['optimization-suggestion'],
      limit: 5,
    },
  });
  
  const getOptimizationSuggestions = useCallback(async () => {
    return await actions.getRecommendationsByType('optimization-suggestion', {
      calculatorType,
      currentParameters,
      limit: 5,
    });
  }, [actions, calculatorType, currentParameters]);

  return {
    suggestions: state.recommendations.filter(r => r.type === 'optimization-suggestion'),
    loading: state.loading,
    error: state.error,
    getOptimizationSuggestions,
    refresh: () => actions.refreshRecommendations(),
  };
}

/**
 * Hook for contextual recommendations
 */
export function useContextualRecommendations(
  context?: {
    timeOfDay?: string;
    recentActivity?: string[];
    taskType?: string;
    urgency?: 'low' | 'medium' | 'high';
  },
  userId?: string
) {
  const [state, actions] = useRecommendation({
    userId,
    defaultRequest: {
      context,
      recommendationType: ['contextual-recommendation'],
      limit: 3,
    },
  });
  
  const getContextualRecommendations = useCallback(async () => {
    return await actions.getRecommendationsByType('contextual-recommendation', {
      context,
      limit: 3,
    });
  }, [actions, context]);

  return {
    recommendations: state.recommendations.filter(r => r.type === 'contextual-recommendation'),
    loading: state.loading,
    error: state.error,
    getContextualRecommendations,
    refresh: () => actions.refreshRecommendations(),
  };
}
