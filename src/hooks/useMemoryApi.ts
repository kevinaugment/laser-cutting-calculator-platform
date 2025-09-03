/**
 * Memory API Hook
 * React hook for interacting with Memory API endpoints
 */

import { useState, useCallback } from 'react';
import { memoryApi, ApiResponse } from '../api/memoryApi';
import { memoryApiMock } from '../api/memoryApiMock';
import { 
  CalculationRecord, 
  ParameterPreset, 
  UserPreferences,
  HistoryQuery,
  PresetQuery,
  HistoryStats,
  PresetStats
} from '../types/memory';

// ============================================================================
// Configuration
// ============================================================================

const isDevelopment = process.env.NODE_ENV === 'development';
const useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true' || isDevelopment;

// Select API client based on environment
const apiClient = useMockApi ? memoryApiMock : memoryApi;

// ============================================================================
// Hook State Types
// ============================================================================

export interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface ApiActions<T = any> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

// ============================================================================
// Base API Hook
// ============================================================================

function useApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): [ApiState<T>, ApiActions<T>] {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastUpdated: response.timestamp,
        });
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Unknown error occurred',
        }));
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({
      ...prev,
      data,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const actions: ApiActions<T> = {
    execute,
    reset,
    setData,
    setError,
  };

  return [state, actions];
}

// ============================================================================
// Calculation History Hooks
// ============================================================================

export function useSaveCalculation() {
  return useApiCall(apiClient.saveCalculation.bind(apiClient));
}

export function useGetHistory() {
  return useApiCall(apiClient.getHistory.bind(apiClient));
}

export function useGetCalculation() {
  return useApiCall(apiClient.getCalculation.bind(apiClient));
}

export function useDeleteCalculation() {
  return useApiCall(apiClient.deleteCalculation.bind(apiClient));
}

export function useClearHistory() {
  return useApiCall(apiClient.clearHistory.bind(apiClient));
}

export function useHistoryStats() {
  return useApiCall(apiClient.getHistoryStats.bind(apiClient));
}

// ============================================================================
// Parameter Presets Hooks
// ============================================================================

export function useCreatePreset() {
  return useApiCall(apiClient.createPreset.bind(apiClient));
}

export function useGetPresets() {
  return useApiCall(apiClient.getPresets.bind(apiClient));
}

export function useGetPreset() {
  return useApiCall(apiClient.getPreset.bind(apiClient));
}

export function useUpdatePreset() {
  return useApiCall(apiClient.updatePreset.bind(apiClient));
}

export function useDeletePreset() {
  return useApiCall(apiClient.deletePreset.bind(apiClient));
}

export function useUsePreset() {
  return useApiCall(apiClient.usePreset.bind(apiClient));
}

export function useRatePreset() {
  return useApiCall(apiClient.ratePreset.bind(apiClient));
}

export function usePresetStats() {
  return useApiCall(apiClient.getPresetStats.bind(apiClient));
}

// ============================================================================
// User Preferences Hooks
// ============================================================================

export function useGetPreferences() {
  return useApiCall(apiClient.getPreferences.bind(apiClient));
}

export function useUpdatePreferences() {
  return useApiCall(apiClient.updatePreferences.bind(apiClient));
}

export function useResetPreferences() {
  return useApiCall(apiClient.resetPreferences.bind(apiClient));
}

// ============================================================================
// Search and Utility Hooks
// ============================================================================

export function useSearch() {
  return useApiCall(apiClient.search.bind(apiClient));
}

export function useExportData() {
  return useApiCall(apiClient.exportData.bind(apiClient));
}

export function useImportData() {
  return useApiCall(apiClient.importData.bind(apiClient));
}

// ============================================================================
// Composite Hooks
// ============================================================================

/**
 * Hook for managing calculation history with API integration
 */
export function useCalculationHistoryApi() {
  const [saveState, saveActions] = useSaveCalculation();
  const [historyState, historyActions] = useGetHistory();
  const [deleteState, deleteActions] = useDeleteCalculation();
  const [statsState, statsActions] = useHistoryStats();

  const saveCalculation = useCallback(async (
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: any
  ) => {
    const result = await saveActions.execute(calculatorType, calculatorName, inputs, outputs, context);
    if (result) {
      // Refresh history after saving
      await historyActions.execute();
    }
    return result;
  }, [saveActions, historyActions]);

  const deleteCalculation = useCallback(async (id: string) => {
    const result = await deleteActions.execute(id);
    if (result) {
      // Refresh history after deletion
      await historyActions.execute();
    }
    return result;
  }, [deleteActions, historyActions]);

  const loadHistory = useCallback(async (query?: HistoryQuery) => {
    return await historyActions.execute(query);
  }, [historyActions]);

  const loadStats = useCallback(async () => {
    return await statsActions.execute();
  }, [statsActions]);

  return {
    // States
    saveState,
    historyState,
    deleteState,
    statsState,
    
    // Actions
    saveCalculation,
    deleteCalculation,
    loadHistory,
    loadStats,
    
    // Reset functions
    resetSave: saveActions.reset,
    resetHistory: historyActions.reset,
    resetDelete: deleteActions.reset,
    resetStats: statsActions.reset,
  };
}

/**
 * Hook for managing parameter presets with API integration
 */
export function useParameterPresetsApi() {
  const [createState, createActions] = useCreatePreset();
  const [presetsState, presetsActions] = useGetPresets();
  const [updateState, updateActions] = useUpdatePreset();
  const [deleteState, deleteActions] = useDeletePreset();
  const [useState, useActions] = useUsePreset();
  const [rateState, rateActions] = useRatePreset();
  const [statsState, statsActions] = usePresetStats();

  const createPreset = useCallback(async (
    name: string,
    description: string,
    calculatorType: string,
    parameters: Record<string, any>,
    options?: any
  ) => {
    const result = await createActions.execute(name, description, calculatorType, parameters, options);
    if (result) {
      // Refresh presets after creation
      await presetsActions.execute();
    }
    return result;
  }, [createActions, presetsActions]);

  const updatePreset = useCallback(async (id: string, updates: Partial<ParameterPreset>) => {
    const result = await updateActions.execute(id, updates);
    if (result) {
      // Refresh presets after update
      await presetsActions.execute();
    }
    return result;
  }, [updateActions, presetsActions]);

  const deletePreset = useCallback(async (id: string) => {
    const result = await deleteActions.execute(id);
    if (result) {
      // Refresh presets after deletion
      await presetsActions.execute();
    }
    return result;
  }, [deleteActions, presetsActions]);

  const usePreset = useCallback(async (id: string) => {
    const result = await useActions.execute(id);
    if (result) {
      // Refresh presets after use (to update usage count)
      await presetsActions.execute();
    }
    return result;
  }, [useActions, presetsActions]);

  const ratePreset = useCallback(async (id: string, rating: number) => {
    const result = await rateActions.execute(id, rating);
    if (result) {
      // Refresh presets after rating
      await presetsActions.execute();
    }
    return result;
  }, [rateActions, presetsActions]);

  const loadPresets = useCallback(async (query?: PresetQuery) => {
    return await presetsActions.execute(query);
  }, [presetsActions]);

  const loadStats = useCallback(async () => {
    return await statsActions.execute();
  }, [statsActions]);

  return {
    // States
    createState,
    presetsState,
    updateState,
    deleteState,
    useState,
    rateState,
    statsState,
    
    // Actions
    createPreset,
    updatePreset,
    deletePreset,
    usePreset,
    ratePreset,
    loadPresets,
    loadStats,
    
    // Reset functions
    resetCreate: createActions.reset,
    resetPresets: presetsActions.reset,
    resetUpdate: updateActions.reset,
    resetDelete: deleteActions.reset,
    resetUse: useActions.reset,
    resetRate: rateActions.reset,
    resetStats: statsActions.reset,
  };
}

/**
 * Hook for managing user preferences with API integration
 */
export function useUserPreferencesApi() {
  const [preferencesState, preferencesActions] = useGetPreferences();
  const [updateState, updateActions] = useUpdatePreferences();
  const [resetState, resetActions] = useResetPreferences();

  const loadPreferences = useCallback(async () => {
    return await preferencesActions.execute();
  }, [preferencesActions]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    const result = await updateActions.execute(updates);
    if (result) {
      // Update local state with new preferences
      preferencesActions.setData(result);
    }
    return result;
  }, [updateActions, preferencesActions]);

  const resetPreferences = useCallback(async () => {
    const result = await resetActions.execute();
    if (result) {
      // Update local state with reset preferences
      preferencesActions.setData(result);
    }
    return result;
  }, [resetActions, preferencesActions]);

  return {
    // States
    preferencesState,
    updateState,
    resetState,
    
    // Actions
    loadPreferences,
    updatePreferences,
    resetPreferences,
    
    // Reset functions
    resetPreferencesState: preferencesActions.reset,
    resetUpdateState: updateActions.reset,
    resetResetState: resetActions.reset,
  };
}
