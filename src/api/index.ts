/**
 * API Layer Export
 * Unified export for all API clients and utilities
 */

// Memory API
export { 
  MemoryApiClient,
  memoryApi,
  memoryApiHelpers,
  type ApiResponse,
  type PaginatedResponse,
  type ApiConfig
} from './memoryApi';

export { 
  MemoryApiMock,
  memoryApiMock,
  memoryApiClient
} from './memoryApiMock';

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
  
  // Types
  type ApiState,
  type ApiActions
} from '../hooks/useMemoryApi';
