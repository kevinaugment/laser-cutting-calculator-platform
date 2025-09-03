/**
 * Pattern Recognition Hook
 * React hook for pattern recognition functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  patternRecognitionService, 
  PatternAnalysisResult, 
  PatternType 
} from '../services/patternRecognitionService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface PatternRecognitionState {
  patterns: PatternAnalysisResult[];
  loading: boolean;
  error: string | null;
  lastAnalyzed: string | null;
  analysisInProgress: boolean;
}

export interface PatternRecognitionActions {
  analyzePatterns: (userId?: string) => Promise<PatternAnalysisResult[]>;
  getPatternsByType: (type: PatternType, userId?: string) => Promise<PatternAnalysisResult[]>;
  refreshPatterns: (userId?: string) => Promise<void>;
  clearCache: () => void;
  reset: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UsePatternRecognitionConfig {
  userId?: string;
  autoAnalyze?: boolean;
  refreshInterval?: number; // in milliseconds
  enableRealTimeUpdates?: boolean;
}

const DEFAULT_CONFIG: Required<UsePatternRecognitionConfig> = {
  userId: 'anonymous-user',
  autoAnalyze: true,
  refreshInterval: 300000, // 5 minutes
  enableRealTimeUpdates: false,
};

// ============================================================================
// Main Hook
// ============================================================================

export function usePatternRecognition(
  config: UsePatternRecognitionConfig = {}
): [PatternRecognitionState, PatternRecognitionActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<PatternRecognitionState>({
    patterns: [],
    loading: false,
    error: null,
    lastAnalyzed: null,
    analysisInProgress: false,
  });

  // Analyze patterns
  const analyzePatterns = useCallback(async (userId?: string): Promise<PatternAnalysisResult[]> => {
    const targetUserId = userId || finalConfig.userId;
    
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      analysisInProgress: true 
    }));

    try {
      const patterns = await patternRecognitionService.analyzeUserPatterns(targetUserId);
      
      setState(prev => ({
        ...prev,
        patterns,
        loading: false,
        error: null,
        lastAnalyzed: new Date().toISOString(),
        analysisInProgress: false,
      }));

      return patterns;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Pattern analysis failed';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        analysisInProgress: false,
      }));

      return [];
    }
  }, [finalConfig.userId]);

  // Get patterns by type
  const getPatternsByType = useCallback(async (
    type: PatternType, 
    userId?: string
  ): Promise<PatternAnalysisResult[]> => {
    const targetUserId = userId || finalConfig.userId;
    
    try {
      const patterns = await patternRecognitionService.getPatternsByType(type, targetUserId);
      return patterns;
    } catch (error) {
      console.error('Failed to get patterns by type:', error);
      return [];
    }
  }, [finalConfig.userId]);

  // Refresh patterns
  const refreshPatterns = useCallback(async (userId?: string): Promise<void> => {
    patternRecognitionService.clearCache();
    await analyzePatterns(userId);
  }, [analyzePatterns]);

  // Clear cache
  const clearCache = useCallback(() => {
    patternRecognitionService.clearCache();
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState({
      patterns: [],
      loading: false,
      error: null,
      lastAnalyzed: null,
      analysisInProgress: false,
    });
    patternRecognitionService.clearCache();
  }, []);

  // Auto-analyze on mount
  useEffect(() => {
    if (finalConfig.autoAnalyze) {
      analyzePatterns();
    }
  }, [finalConfig.autoAnalyze, analyzePatterns]);

  // Set up refresh interval
  useEffect(() => {
    if (finalConfig.refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!state.analysisInProgress) {
          analyzePatterns();
        }
      }, finalConfig.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [finalConfig.refreshInterval, state.analysisInProgress, analyzePatterns]);

  // Actions object
  const actions: PatternRecognitionActions = {
    analyzePatterns,
    getPatternsByType,
    refreshPatterns,
    clearCache,
    reset,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for parameter frequency patterns
 */
export function useParameterFrequencyPatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });
  
  const parameterPatterns = state.patterns.filter(p => p.type === 'parameter-frequency');
  
  const getFrequencyPatterns = useCallback(async () => {
    return await actions.getPatternsByType('parameter-frequency', userId);
  }, [actions, userId]);

  return {
    patterns: parameterPatterns,
    loading: state.loading,
    error: state.error,
    getFrequencyPatterns,
    refresh: () => actions.refreshPatterns(userId),
  };
}

/**
 * Hook for calculator usage patterns
 */
export function useCalculatorUsagePatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });
  
  const usagePatterns = state.patterns.filter(p => p.type === 'calculator-usage');
  
  const getUsagePatterns = useCallback(async () => {
    return await actions.getPatternsByType('calculator-usage', userId);
  }, [actions, userId]);

  return {
    patterns: usagePatterns,
    loading: state.loading,
    error: state.error,
    getUsagePatterns,
    refresh: () => actions.refreshPatterns(userId),
  };
}

/**
 * Hook for time activity patterns
 */
export function useTimeActivityPatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });
  
  const timePatterns = state.patterns.filter(p => p.type === 'time-activity');
  
  const getTimePatterns = useCallback(async () => {
    return await actions.getPatternsByType('time-activity', userId);
  }, [actions, userId]);

  return {
    patterns: timePatterns,
    loading: state.loading,
    error: state.error,
    getTimePatterns,
    refresh: () => actions.refreshPatterns(userId),
  };
}

/**
 * Hook for parameter combination patterns
 */
export function useParameterCombinationPatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });
  
  const combinationPatterns = state.patterns.filter(p => p.type === 'parameter-combination');
  
  const getCombinationPatterns = useCallback(async () => {
    return await actions.getPatternsByType('parameter-combination', userId);
  }, [actions, userId]);

  return {
    patterns: combinationPatterns,
    loading: state.loading,
    error: state.error,
    getCombinationPatterns,
    refresh: () => actions.refreshPatterns(userId),
  };
}

/**
 * Hook for pattern insights and recommendations
 */
export function usePatternInsights(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });
  
  // Generate insights from patterns
  const insights = state.patterns.map(pattern => ({
    id: pattern.id,
    type: pattern.type,
    confidence: pattern.confidence,
    description: pattern.description,
    recommendation: generateRecommendation(pattern),
    priority: calculatePriority(pattern),
  }));

  // Sort by priority and confidence
  const sortedInsights = insights
    .sort((a, b) => b.priority - a.priority || b.confidence - a.confidence);

  return {
    insights: sortedInsights,
    topInsights: sortedInsights.slice(0, 5),
    loading: state.loading,
    error: state.error,
    refresh: () => actions.refreshPatterns(userId),
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateRecommendation(pattern: PatternAnalysisResult): string {
  switch (pattern.type) {
    case 'parameter-frequency':
      return `Consider creating a preset for frequently used parameter: ${pattern.data.parameter}`;
    case 'calculator-usage':
      return `${pattern.data.calculatorType} is your most used calculator - consider bookmarking it`;
    case 'time-activity':
      return `You're most active during ${pattern.data.timeSlot} - schedule complex calculations then`;
    case 'parameter-combination':
      return `This parameter combination works well - consider saving as a preset`;
    default:
      return 'Pattern detected - consider optimizing your workflow';
  }
}

function calculatePriority(pattern: PatternAnalysisResult): number {
  // Priority based on confidence and pattern type
  const typeWeights = {
    'parameter-frequency': 0.8,
    'calculator-usage': 0.9,
    'time-activity': 0.6,
    'parameter-combination': 0.7,
    'behavior-sequence': 0.5,
    'anomaly-detection': 1.0,
  };

  const typeWeight = typeWeights[pattern.type] || 0.5;
  return pattern.confidence * typeWeight;
}
