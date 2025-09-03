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
