/**
 * Smart Defaults Hook
 * React hook for intelligent default value functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  smartDefaultsService, 
  DefaultValueRequest,
  DefaultValueResult,
  DefaultValueType 
} from '../services/smartDefaultsService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface SmartDefaultsState {
  defaults: DefaultValueResult[];
  loading: boolean;
  error: string | null;
  lastGenerated: string | null;
  generationInProgress: boolean;
}

export interface SmartDefaultsActions {
  getSmartDefaults: (request: DefaultValueRequest) => Promise<DefaultValueResult[]>;
  getDefaultByType: (type: DefaultValueType, request: Omit<DefaultValueRequest, 'options'>) => Promise<DefaultValueResult | null>;
  recordFeedback: (defaultId: string, accepted: boolean, userId?: string) => void;
  refreshDefaults: (request?: DefaultValueRequest) => Promise<void>;
  clearCache: () => void;
  reset: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseSmartDefaultsConfig {
  userId?: string;
  autoGenerate?: boolean;
  refreshInterval?: number; // in milliseconds
  enableRealTimeUpdates?: boolean;
  defaultRequest?: Partial<DefaultValueRequest>;
}

const DEFAULT_CONFIG: Required<UseSmartDefaultsConfig> = {
  userId: 'anonymous-user',
  autoGenerate: false, // Don't auto-generate by default
  refreshInterval: 0, // No auto-refresh by default
  enableRealTimeUpdates: false,
  defaultRequest: {},
};

// ============================================================================
// Main Hook
// ============================================================================

export function useSmartDefaults(
  config: UseSmartDefaultsConfig = {}
): [SmartDefaultsState, SmartDefaultsActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<SmartDefaultsState>({
    defaults: [],
    loading: false,
    error: null,
    lastGenerated: null,
    generationInProgress: false,
  });

  // Get smart defaults
  const getSmartDefaults = useCallback(async (request: DefaultValueRequest): Promise<DefaultValueResult[]> => {
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
      const defaults = await smartDefaultsService.getSmartDefaults(finalRequest);
      
      setState(prev => ({
        ...prev,
        defaults,
        loading: false,
        error: null,
        lastGenerated: new Date().toISOString(),
        generationInProgress: false,
      }));

      return defaults;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Smart defaults generation failed';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        generationInProgress: false,
      }));

      return [];
    }
  }, [finalConfig.userId, finalConfig.defaultRequest]);

  // Get default by type
  const getDefaultByType = useCallback(async (
    type: DefaultValueType, 
    request: Omit<DefaultValueRequest, 'options'>
  ): Promise<DefaultValueResult | null> => {
    const finalRequest = {
      userId: finalConfig.userId,
      ...finalConfig.defaultRequest,
      ...request,
    };
    
    try {
      const defaultValue = await smartDefaultsService.getDefaultByType(type, finalRequest);
      return defaultValue;
    } catch (error) {
      console.error('Failed to get default by type:', error);
      return null;
    }
  }, [finalConfig.userId, finalConfig.defaultRequest]);

  // Record feedback
  const recordFeedback = useCallback((
    defaultId: string,
    accepted: boolean,
    userId?: string
  ): void => {
    smartDefaultsService.recordFeedback(defaultId, accepted, userId || finalConfig.userId);
  }, [finalConfig.userId]);

  // Refresh defaults
  const refreshDefaults = useCallback(async (request?: DefaultValueRequest): Promise<void> => {
    smartDefaultsService.clearCache();
    if (request) {
      await getSmartDefaults(request);
    } else if (finalConfig.defaultRequest) {
      await getSmartDefaults(finalConfig.defaultRequest as DefaultValueRequest);
    }
  }, [getSmartDefaults, finalConfig.defaultRequest]);

  // Clear cache
  const clearCache = useCallback(() => {
    smartDefaultsService.clearCache();
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState({
      defaults: [],
      loading: false,
      error: null,
      lastGenerated: null,
      generationInProgress: false,
    });
    smartDefaultsService.clearCache();
  }, []);

  // Auto-generate on mount
  useEffect(() => {
    if (finalConfig.autoGenerate && finalConfig.defaultRequest) {
      getSmartDefaults(finalConfig.defaultRequest as DefaultValueRequest);
    }
  }, [finalConfig.autoGenerate, finalConfig.defaultRequest, getSmartDefaults]);

  // Set up refresh interval
  useEffect(() => {
    if (finalConfig.refreshInterval > 0 && finalConfig.defaultRequest) {
      const interval = setInterval(() => {
        if (!state.generationInProgress) {
          getSmartDefaults(finalConfig.defaultRequest as DefaultValueRequest);
        }
      }, finalConfig.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [finalConfig.refreshInterval, finalConfig.defaultRequest, state.generationInProgress, getSmartDefaults]);

  // Actions object
  const actions: SmartDefaultsActions = {
    getSmartDefaults,
    getDefaultByType,
    recordFeedback,
    refreshDefaults,
    clearCache,
    reset,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for parameter-specific smart defaults
 */
export function useParameterSmartDefaults(
  calculatorType: string,
  parameterName: string,
  currentParameters?: Record<string, any>,
  context?: DefaultValueRequest['context'],
  userId?: string
) {
  const [state, actions] = useSmartDefaults({
    userId,
    defaultRequest: {
      calculatorType,
      parameterName,
      currentParameters,
      context,
      options: {
        maxResults: 3,
        minConfidence: 0.4,
      },
    },
  });
  
  const getParameterDefaults = useCallback(async () => {
    return await actions.getSmartDefaults({
      calculatorType,
      parameterName,
      currentParameters,
      context,
      options: {
        maxResults: 3,
        minConfidence: 0.4,
      },
    });
  }, [actions, calculatorType, parameterName, currentParameters, context]);

  const getBestDefault = useCallback(async () => {
    const defaults = await getParameterDefaults();
    return defaults.length > 0 ? defaults[0] : null;
  }, [getParameterDefaults]);

  return {
    defaults: state.defaults,
    bestDefault: state.defaults.length > 0 ? state.defaults[0] : null,
    loading: state.loading,
    error: state.error,
    getParameterDefaults,
    getBestDefault,
    recordFeedback: actions.recordFeedback,
    refresh: () => actions.refreshDefaults(),
  };
}

/**
 * Hook for frequency-based defaults
 */
export function useFrequencyBasedDefaults(
  calculatorType: string,
  parameterName: string,
  userId?: string
) {
  const [state, actions] = useSmartDefaults({
    userId,
    defaultRequest: {
      calculatorType,
      parameterName,
      options: {
        includeTypes: ['frequency-based'],
        maxResults: 1,
      },
    },
  });
  
  const getFrequencyDefault = useCallback(async () => {
    return await actions.getDefaultByType('frequency-based', {
      calculatorType,
      parameterName,
    });
  }, [actions, calculatorType, parameterName]);

  return {
    frequencyDefault: state.defaults.find(d => d.type === 'frequency-based') || null,
    loading: state.loading,
    error: state.error,
    getFrequencyDefault,
    refresh: () => actions.refreshDefaults(),
  };
}

/**
 * Hook for context-aware defaults
 */
export function useContextAwareDefaults(
  calculatorType: string,
  parameterName: string,
  context: DefaultValueRequest['context'],
  userId?: string
) {
  const [state, actions] = useSmartDefaults({
    userId,
    defaultRequest: {
      calculatorType,
      parameterName,
      context,
      options: {
        includeTypes: ['context-aware'],
        maxResults: 1,
      },
    },
  });
  
  const getContextDefault = useCallback(async () => {
    return await actions.getDefaultByType('context-aware', {
      calculatorType,
      parameterName,
      context,
    });
  }, [actions, calculatorType, parameterName, context]);

  return {
    contextDefault: state.defaults.find(d => d.type === 'context-aware') || null,
    loading: state.loading,
    error: state.error,
    getContextDefault,
    refresh: () => actions.refreshDefaults(),
  };
}
