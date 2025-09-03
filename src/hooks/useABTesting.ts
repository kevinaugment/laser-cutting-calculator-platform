/**
 * A/B Testing Hook
 * React hook for A/B testing functionality
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  abTestingService, 
  ABExperiment,
  ExperimentVariant,
  UserAssignment,
  ExperimentResults,
  VariantConfiguration
} from '../services/abTestingService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface ABTestingState {
  experiments: ABExperiment[];
  userAssignments: Map<string, UserAssignment>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface ABTestingActions {
  getExperiment: (experimentId: string) => ABExperiment | null;
  getUserVariant: (experimentId: string) => ExperimentVariant | null;
  getVariantConfig: (experimentId: string) => VariantConfiguration | null;
  trackEvent: (experimentId: string, eventType: string, eventData?: Record<string, any>) => void;
  trackConversion: (experimentId: string, conversionData?: Record<string, any>) => void;
  getExperimentResults: (experimentId: string) => ExperimentResults | null;
  isInExperiment: (experimentId: string) => boolean;
  getActiveExperiments: () => ABExperiment[];
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseABTestingConfig {
  userId?: string;
  sessionId?: string;
  autoAssign?: boolean;
  trackingEnabled?: boolean;
  experiments?: string[]; // Specific experiments to participate in
}

const DEFAULT_CONFIG: Required<UseABTestingConfig> = {
  userId: 'anonymous-user',
  sessionId: 'default-session',
  autoAssign: true,
  trackingEnabled: true,
  experiments: [],
};

// ============================================================================
// Main Hook
// ============================================================================

export function useABTesting(
  config: UseABTestingConfig = {}
): [ABTestingState, ABTestingActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<ABTestingState>({
    experiments: [],
    userAssignments: new Map(),
    loading: false,
    error: null,
    initialized: false,
  });

  // Initialize A/B testing
  useEffect(() => {
    if (state.initialized) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      // Get active experiments
      const activeExperiments = abTestingService.getActiveExperiments();
      
      // Auto-assign user to experiments if enabled
      const assignments = new Map<string, UserAssignment>();
      
      if (finalConfig.autoAssign) {
        const experimentsToJoin = finalConfig.experiments.length > 0 
          ? activeExperiments.filter(exp => finalConfig.experiments.includes(exp.id))
          : activeExperiments;

        experimentsToJoin.forEach(experiment => {
          const assignment = abTestingService.assignUserToExperiment(
            finalConfig.userId,
            experiment.id,
            finalConfig.sessionId
          );
          
          if (assignment) {
            assignments.set(experiment.id, assignment);
          }
        });
      }

      setState(prev => ({
        ...prev,
        experiments: activeExperiments,
        userAssignments: assignments,
        loading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'A/B testing initialization failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig.userId, finalConfig.sessionId, finalConfig.autoAssign, finalConfig.experiments, state.initialized]);

  // Get experiment by ID
  const getExperiment = useCallback((experimentId: string): ABExperiment | null => {
    return abTestingService.getExperiment(experimentId);
  }, []);

  // Get user's variant for an experiment
  const getUserVariant = useCallback((experimentId: string): ExperimentVariant | null => {
    return abTestingService.getUserVariant(finalConfig.userId, experimentId);
  }, [finalConfig.userId]);

  // Get variant configuration
  const getVariantConfig = useCallback((experimentId: string): VariantConfiguration | null => {
    const variant = getUserVariant(experimentId);
    return variant ? variant.configuration : null;
  }, [getUserVariant]);

  // Track experiment event
  const trackEvent = useCallback((
    experimentId: string,
    eventType: string,
    eventData: Record<string, any> = {}
  ): void => {
    if (!finalConfig.trackingEnabled) return;

    abTestingService.trackEvent(
      finalConfig.userId,
      finalConfig.sessionId,
      experimentId,
      eventType,
      eventData
    );
  }, [finalConfig.userId, finalConfig.sessionId, finalConfig.trackingEnabled]);

  // Track conversion event
  const trackConversion = useCallback((
    experimentId: string,
    conversionData: Record<string, any> = {}
  ): void => {
    if (!finalConfig.trackingEnabled) return;

    abTestingService.trackConversion(
      finalConfig.userId,
      finalConfig.sessionId,
      experimentId,
      conversionData
    );
  }, [finalConfig.userId, finalConfig.sessionId, finalConfig.trackingEnabled]);

  // Get experiment results
  const getExperimentResults = useCallback((experimentId: string): ExperimentResults | null => {
    return abTestingService.getExperimentResults(experimentId);
  }, []);

  // Check if user is in experiment
  const isInExperiment = useCallback((experimentId: string): boolean => {
    return state.userAssignments.has(experimentId);
  }, [state.userAssignments]);

  // Get active experiments
  const getActiveExperiments = useCallback((): ABExperiment[] => {
    return state.experiments;
  }, [state.experiments]);

  // Actions object
  const actions: ABTestingActions = {
    getExperiment,
    getUserVariant,
    getVariantConfig,
    trackEvent,
    trackConversion,
    getExperimentResults,
    isInExperiment,
    getActiveExperiments,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for specific experiment participation
 */
export function useExperiment(
  experimentId: string,
  userId?: string,
  sessionId?: string
) {
  const [state, actions] = useABTesting({
    userId,
    sessionId,
    experiments: [experimentId],
  });

  const experiment = useMemo(() => 
    actions.getExperiment(experimentId), 
    [actions, experimentId]
  );

  const variant = useMemo(() => 
    actions.getUserVariant(experimentId), 
    [actions, experimentId]
  );

  const config = useMemo(() => 
    actions.getVariantConfig(experimentId), 
    [actions, experimentId]
  );

  const isParticipating = useMemo(() => 
    actions.isInExperiment(experimentId), 
    [actions, experimentId]
  );

  return {
    experiment,
    variant,
    config,
    isParticipating,
    isControl: variant?.type === 'control',
    isTreatment: variant?.type === 'treatment',
    trackEvent: (eventType: string, eventData?: Record<string, any>) => 
      actions.trackEvent(experimentId, eventType, eventData),
    trackConversion: (conversionData?: Record<string, any>) => 
      actions.trackConversion(experimentId, conversionData),
    loading: state.loading,
    error: state.error,
  };
}

/**
 * Hook for algorithm A/B testing
 */
export function useAlgorithmExperiment(
  experimentId: string,
  defaultAlgorithm: string = 'frequency-based',
  userId?: string
) {
  const { config, isParticipating, trackEvent, trackConversion } = useExperiment(
    experimentId,
    userId
  );

  const algorithmType = useMemo(() => {
    if (!isParticipating || !config) {
      return defaultAlgorithm;
    }
    return config.algorithmType || defaultAlgorithm;
  }, [isParticipating, config, defaultAlgorithm]);

  const parameters = useMemo(() => {
    return config?.parameters || {};
  }, [config]);

  return {
    algorithmType,
    parameters,
    isParticipating,
    trackAlgorithmUsage: (usageData: Record<string, any>) => 
      trackEvent('algorithm_usage', usageData),
    trackAlgorithmSuccess: (successData: Record<string, any>) => 
      trackConversion(successData),
  };
}

/**
 * Hook for UI component A/B testing
 */
export function useUIExperiment(
  experimentId: string,
  defaultComponent: string,
  userId?: string
) {
  const { config, isParticipating, trackEvent, trackConversion } = useExperiment(
    experimentId,
    userId
  );

  const componentName = useMemo(() => {
    if (!isParticipating || !config) {
      return defaultComponent;
    }
    return config.uiComponent || defaultComponent;
  }, [isParticipating, config, defaultComponent]);

  const features = useMemo(() => {
    return config?.features || [];
  }, [config]);

  const overrides = useMemo(() => {
    return config?.overrides || {};
  }, [config]);

  return {
    componentName,
    features,
    overrides,
    isParticipating,
    hasFeature: (featureName: string) => features.includes(featureName),
    getOverride: (key: string, defaultValue?: any) => overrides[key] || defaultValue,
    trackUIInteraction: (interactionData: Record<string, any>) => 
      trackEvent('ui_interaction', interactionData),
    trackUIConversion: (conversionData: Record<string, any>) => 
      trackConversion(conversionData),
  };
}

/**
 * Hook for feature flag A/B testing
 */
export function useFeatureFlag(
  experimentId: string,
  featureName: string,
  defaultEnabled: boolean = false,
  userId?: string
) {
  const { config, isParticipating, trackEvent } = useExperiment(
    experimentId,
    userId
  );

  const isEnabled = useMemo(() => {
    if (!isParticipating || !config) {
      return defaultEnabled;
    }
    
    const features = config.features || [];
    const overrides = config.overrides || {};
    
    // Check overrides first
    if (featureName in overrides) {
      return Boolean(overrides[featureName]);
    }
    
    // Check features array
    return features.includes(featureName);
  }, [isParticipating, config, featureName, defaultEnabled]);

  const trackFeatureUsage = useCallback((usageData: Record<string, any> = {}) => {
    trackEvent('feature_usage', {
      featureName,
      enabled: isEnabled,
      ...usageData,
    });
  }, [trackEvent, featureName, isEnabled]);

  return {
    isEnabled,
    isParticipating,
    trackFeatureUsage,
  };
}
