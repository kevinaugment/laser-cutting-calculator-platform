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
 * Hook for behavior sequence patterns
 */
export function useBehaviorSequencePatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });

  const sequencePatterns = state.patterns.filter(p => p.type === 'behavior-sequence');

  const getSequencePatterns = useCallback(async () => {
    return await actions.getPatternsByType('behavior-sequence', userId);
  }, [actions, userId]);

  return {
    patterns: sequencePatterns,
    loading: state.loading,
    error: state.error,
    getSequencePatterns,
    refresh: () => actions.refreshPatterns(userId),
  };
}

/**
 * Hook for anomaly detection patterns
 */
export function useAnomalyDetectionPatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });

  const anomalyPatterns = state.patterns.filter(p => p.type === 'anomaly-detection');

  const getAnomalyPatterns = useCallback(async () => {
    return await actions.getPatternsByType('anomaly-detection', userId);
  }, [actions, userId]);

  return {
    patterns: anomalyPatterns,
    anomalies: anomalyPatterns.filter(p => p.data.severity === 'high'),
    warnings: anomalyPatterns.filter(p => p.data.severity === 'medium'),
    loading: state.loading,
    error: state.error,
    getAnomalyPatterns,
    refresh: () => actions.refreshPatterns(userId),
  };
}

/**
 * Hook for parameter correlation patterns
 */
export function useParameterCorrelationPatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });

  const correlationPatterns = state.patterns.filter(p => p.type === 'parameter-correlation');

  const getCorrelationPatterns = useCallback(async () => {
    return await actions.getPatternsByType('parameter-correlation', userId);
  }, [actions, userId]);

  return {
    patterns: correlationPatterns,
    strongCorrelations: correlationPatterns.filter(p => Math.abs(p.data.correlationCoefficient) > 0.7),
    loading: state.loading,
    error: state.error,
    getCorrelationPatterns,
    refresh: () => actions.refreshPatterns(userId),
  };
}

/**
 * Hook for usage evolution patterns
 */
export function useUsageEvolutionPatterns(userId?: string) {
  const [state, actions] = usePatternRecognition({ userId, autoAnalyze: true });

  const evolutionPatterns = state.patterns.filter(p => p.type === 'usage-evolution');

  const getEvolutionPatterns = useCallback(async () => {
    return await actions.getPatternsByType('usage-evolution', userId);
  }, [actions, userId]);

  return {
    patterns: evolutionPatterns,
    trends: evolutionPatterns.map(p => ({
      metric: p.data.metric,
      trend: p.data.trend,
      changeRate: p.data.changeRate,
      prediction: p.data.prediction,
    })),
    loading: state.loading,
    error: state.error,
    getEvolutionPatterns,
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

  // Categorize insights
  const categorizedInsights = {
    optimization: insights.filter(i => ['parameter-frequency', 'parameter-combination', 'parameter-correlation'].includes(i.type)),
    workflow: insights.filter(i => ['behavior-sequence', 'time-activity', 'usage-evolution'].includes(i.type)),
    quality: insights.filter(i => ['anomaly-detection'].includes(i.type)),
    usage: insights.filter(i => ['calculator-usage'].includes(i.type)),
  };

  return {
    insights: sortedInsights,
    topInsights: sortedInsights.slice(0, 5),
    categorizedInsights,
    anomalies: insights.filter(i => i.type === 'anomaly-detection'),
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
    case 'behavior-sequence':
      return `You often use calculators in sequence: ${pattern.data.sequence.join(' → ')} - consider creating a workflow`;
    case 'anomaly-detection':
      return pattern.data.suggestedAction;
    case 'parameter-correlation':
      return `Parameters ${pattern.data.parameterA} and ${pattern.data.parameterB} are correlated - adjust them together`;
    case 'usage-evolution':
      return `Your usage is ${pattern.data.trend} - ${pattern.data.trend === 'increasing' ? 'consider upgrading your plan' : 'optimize your workflow'}`;
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
    'parameter-correlation': 0.6,
    'usage-evolution': 0.4,
  };

  const typeWeight = typeWeights[pattern.type] || 0.5;

  // Boost priority for high-severity anomalies
  let severityBoost = 1.0;
  if (pattern.type === 'anomaly-detection' && pattern.data.severity === 'high') {
    severityBoost = 1.5;
  }

  return pattern.confidence * typeWeight * severityBoost;
}
