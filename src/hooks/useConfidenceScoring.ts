/**
 * Confidence Scoring Hook
 * React hook for confidence scoring functionality
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  confidenceScoringService, 
  ConfidenceScore,
  ConfidenceContext,
  ConfidenceLevel 
} from '../services/confidenceScoringService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface ConfidenceScoringState {
  scores: Map<string, ConfidenceScore>;
  loading: boolean;
  error: string | null;
  lastCalculated: string | null;
}

export interface ConfidenceScoringActions {
  calculateRecommendationConfidence: (
    id: string,
    data: {
      frequency: number;
      successRate: number;
      recency: number;
      similarity: number;
      userFeedback?: number;
    },
    context: ConfidenceContext
  ) => ConfidenceScore;
  calculatePatternConfidence: (
    id: string,
    data: {
      frequency: number;
      consistency: number;
      significance: number;
      coverage: number;
    },
    context: ConfidenceContext
  ) => ConfidenceScore;
  calculateDefaultConfidence: (
    id: string,
    data: {
      frequency: number;
      contextMatch: number;
      patternStrength: number;
      userAcceptance?: number;
    },
    context: ConfidenceContext
  ) => ConfidenceScore;
  getConfidenceScore: (id: string) => ConfidenceScore | null;
  clearScores: () => void;
  getScoresByLevel: (level: ConfidenceLevel) => ConfidenceScore[];
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseConfidenceScoringConfig {
  autoCalculate?: boolean;
  cacheResults?: boolean;
  updateInterval?: number; // in milliseconds
}

const DEFAULT_CONFIG: Required<UseConfidenceScoringConfig> = {
  autoCalculate: true,
  cacheResults: true,
  updateInterval: 0, // No auto-update by default
};

// ============================================================================
// Main Hook
// ============================================================================

export function useConfidenceScoring(
  config: UseConfidenceScoringConfig = {}
): [ConfidenceScoringState, ConfidenceScoringActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<ConfidenceScoringState>({
    scores: new Map(),
    loading: false,
    error: null,
    lastCalculated: null,
  });

  // Calculate recommendation confidence
  const calculateRecommendationConfidence = useCallback((
    id: string,
    data: {
      frequency: number;
      successRate: number;
      recency: number;
      similarity: number;
      userFeedback?: number;
    },
    context: ConfidenceContext
  ): ConfidenceScore => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const score = confidenceScoringService.calculateRecommendationConfidence(data, context);
      
      if (finalConfig.cacheResults) {
        setState(prev => ({
          ...prev,
          scores: new Map(prev.scores).set(id, score),
          loading: false,
          lastCalculated: new Date().toISOString(),
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          lastCalculated: new Date().toISOString(),
        }));
      }
      
      return score;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Confidence calculation failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      // Return a fallback score
      return {
        score: 0.5,
        level: 'medium',
        factors: [],
        explanation: 'Unable to calculate confidence score',
        visualIndicator: {
          color: '#D97706',
          icon: 'exclamation',
          label: 'Unknown',
          description: 'Confidence calculation failed',
          cssClass: 'confidence-medium text-yellow-600 bg-yellow-100 border-yellow-200',
        },
        reliability: 0.3,
      };
    }
  }, [finalConfig.cacheResults]);

  // Calculate pattern confidence
  const calculatePatternConfidence = useCallback((
    id: string,
    data: {
      frequency: number;
      consistency: number;
      significance: number;
      coverage: number;
    },
    context: ConfidenceContext
  ): ConfidenceScore => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const score = confidenceScoringService.calculatePatternConfidence(data, context);
      
      if (finalConfig.cacheResults) {
        setState(prev => ({
          ...prev,
          scores: new Map(prev.scores).set(id, score),
          loading: false,
          lastCalculated: new Date().toISOString(),
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          lastCalculated: new Date().toISOString(),
        }));
      }
      
      return score;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Pattern confidence calculation failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      // Return a fallback score
      return {
        score: 0.4,
        level: 'low',
        factors: [],
        explanation: 'Unable to calculate pattern confidence',
        visualIndicator: {
          color: '#DC2626',
          icon: 'question-mark-circle',
          label: 'Unknown',
          description: 'Pattern confidence calculation failed',
          cssClass: 'confidence-low text-orange-600 bg-orange-100 border-orange-200',
        },
        reliability: 0.2,
      };
    }
  }, [finalConfig.cacheResults]);

  // Calculate default confidence
  const calculateDefaultConfidence = useCallback((
    id: string,
    data: {
      frequency: number;
      contextMatch: number;
      patternStrength: number;
      userAcceptance?: number;
    },
    context: ConfidenceContext
  ): ConfidenceScore => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const score = confidenceScoringService.calculateDefaultConfidence(data, context);
      
      if (finalConfig.cacheResults) {
        setState(prev => ({
          ...prev,
          scores: new Map(prev.scores).set(id, score),
          loading: false,
          lastCalculated: new Date().toISOString(),
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          lastCalculated: new Date().toISOString(),
        }));
      }
      
      return score;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Default confidence calculation failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      // Return a fallback score
      return {
        score: 0.3,
        level: 'low',
        factors: [],
        explanation: 'Unable to calculate default confidence',
        visualIndicator: {
          color: '#DC2626',
          icon: 'question-mark-circle',
          label: 'Unknown',
          description: 'Default confidence calculation failed',
          cssClass: 'confidence-low text-orange-600 bg-orange-100 border-orange-200',
        },
        reliability: 0.2,
      };
    }
  }, [finalConfig.cacheResults]);

  // Get confidence score by ID
  const getConfidenceScore = useCallback((id: string): ConfidenceScore | null => {
    return state.scores.get(id) || null;
  }, [state.scores]);

  // Clear all scores
  const clearScores = useCallback(() => {
    setState(prev => ({
      ...prev,
      scores: new Map(),
      error: null,
    }));
  }, []);

  // Get scores by confidence level
  const getScoresByLevel = useCallback((level: ConfidenceLevel): ConfidenceScore[] => {
    return Array.from(state.scores.values()).filter(score => score.level === level);
  }, [state.scores]);

  // Actions object
  const actions: ConfidenceScoringActions = {
    calculateRecommendationConfidence,
    calculatePatternConfidence,
    calculateDefaultConfidence,
    getConfidenceScore,
    clearScores,
    getScoresByLevel,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for recommendation confidence scoring
 */
export function useRecommendationConfidence(
  recommendationId: string,
  data?: {
    frequency: number;
    successRate: number;
    recency: number;
    similarity: number;
    userFeedback?: number;
  },
  context?: ConfidenceContext
) {
  const [state, actions] = useConfidenceScoring({ cacheResults: true });
  
  const confidence = useMemo(() => {
    if (!data || !context) return null;
    
    return actions.calculateRecommendationConfidence(recommendationId, data, context);
  }, [actions, recommendationId, data, context]);

  return {
    confidence,
    loading: state.loading,
    error: state.error,
    recalculate: (newData: typeof data, newContext: typeof context) => {
      if (newData && newContext) {
        return actions.calculateRecommendationConfidence(recommendationId, newData, newContext);
      }
      return null;
    },
  };
}

/**
 * Hook for pattern confidence scoring
 */
export function usePatternConfidence(
  patternId: string,
  data?: {
    frequency: number;
    consistency: number;
    significance: number;
    coverage: number;
  },
  context?: ConfidenceContext
) {
  const [state, actions] = useConfidenceScoring({ cacheResults: true });
  
  const confidence = useMemo(() => {
    if (!data || !context) return null;
    
    return actions.calculatePatternConfidence(patternId, data, context);
  }, [actions, patternId, data, context]);

  return {
    confidence,
    loading: state.loading,
    error: state.error,
    recalculate: (newData: typeof data, newContext: typeof context) => {
      if (newData && newContext) {
        return actions.calculatePatternConfidence(patternId, newData, newContext);
      }
      return null;
    },
  };
}

/**
 * Hook for default value confidence scoring
 */
export function useDefaultConfidence(
  defaultId: string,
  data?: {
    frequency: number;
    contextMatch: number;
    patternStrength: number;
    userAcceptance?: number;
  },
  context?: ConfidenceContext
) {
  const [state, actions] = useConfidenceScoring({ cacheResults: true });
  
  const confidence = useMemo(() => {
    if (!data || !context) return null;
    
    return actions.calculateDefaultConfidence(defaultId, data, context);
  }, [actions, defaultId, data, context]);

  return {
    confidence,
    loading: state.loading,
    error: state.error,
    recalculate: (newData: typeof data, newContext: typeof context) => {
      if (newData && newContext) {
        return actions.calculateDefaultConfidence(defaultId, newData, newContext);
      }
      return null;
    },
  };
}
