/**
 * Hooks Export
 * Unified export for all custom hooks
 */

// Theme Hooks
export { useTheme } from '../theme';

// Calculator Hooks
export { useCalculator } from './useCalculator';
export { useUnitConverter } from './useUnitConverter';

// Memory System Hooks
export { useCalculatorHistory } from './useCalculatorHistory';
export { useParameterPresets } from './useParameterPresets';
export { useUserPreferences } from './useUserPreferences';
export {
  useMemorySystem,
  useCalculatorMemorySystem,
  useReadOnlyMemorySystem,
  usePresetOnlyMemorySystem
} from './useMemorySystem';

// Pattern Recognition Hooks
export {
  usePatternRecognition,
  useParameterFrequencyPatterns,
  useCalculatorUsagePatterns,
  useTimeActivityPatterns,
  useParameterCombinationPatterns,
  useBehaviorSequencePatterns,
  useAnomalyDetectionPatterns,
  useParameterCorrelationPatterns,
  useUsageEvolutionPatterns,
  usePatternInsights
} from './usePatternRecognition';

// Recommendation Hooks
export {
  useRecommendation,
  useParameterValueRecommendations,
  useParameterCombinationRecommendations,
  useCalculatorWorkflowRecommendations,
  useOptimizationSuggestions,
  useContextualRecommendations
} from './useRecommendation';

// Smart Defaults Hooks
export {
  useSmartDefaults,
  useParameterSmartDefaults,
  useFrequencyBasedDefaults,
  useContextAwareDefaults
} from './useSmartDefaults';

// Confidence Scoring Hooks
export {
  useConfidenceScoring,
  useRecommendationConfidence,
  usePatternConfidence,
  useDefaultConfidence
} from './useConfidenceScoring';

// A/B Testing Hooks
export {
  useABTesting,
  useExperiment,
  useAlgorithmExperiment,
  useUIExperiment,
  useFeatureFlag
} from './useABTesting';

// Team Management Hooks
export {
  useTeamManagement,
  useCurrentTeam,
  useTeamMembers
} from './useTeamManagement';

// Team Parameter Library Hooks
export {
  useTeamParameterLibrary,
  useTeamPreset,
  useTeamPresetSearch
} from './useTeamParameterLibrary';

// Parameter Sharing Hooks
export {
  useParameterSharing,
  useShareNotifications,
  usePresetSharing
} from './useParameterSharing';

// API Hooks
export {
  // Base hooks
  useSaveCalculation,
  useGetHistory,
  useGetCalculation,
  useDeleteCalculation,
  useClearHistory,
  useHistoryStats,
  useCreatePreset,
  useGetPresets,
  useGetPreset,
  useUpdatePreset,
  useDeletePreset,
  useUsePreset,
  useRatePreset,
  usePresetStats,
  useGetPreferences,
  useUpdatePreferences,
  useResetPreferences,
  useSearch,
  useExportData,
  useImportData,
  
  // Composite hooks
  useCalculationHistoryApi,
  useParameterPresetsApi,
  useUserPreferencesApi,
} from './useMemoryApi';

// Types
export type { MemorySystemState, MemorySystemActions, MemorySystemConfig } from './useMemorySystem';
export type { ApiState, ApiActions } from './useMemoryApi';
