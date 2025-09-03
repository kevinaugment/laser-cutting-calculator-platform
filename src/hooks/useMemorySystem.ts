/**
 * Memory System Integration Hook
 * Unified hook for all memory system functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { useCalculatorHistory } from './useCalculatorHistory';
import { useParameterPresets } from './useParameterPresets';
import { useUserPreferences } from './useUserPreferences';
import { 
  CalculationRecord, 
  ParameterPreset, 
  UserPreferences,
  HistoryQuery,
  PresetQuery
} from '../types/memory';

// ============================================================================
// Memory System State
// ============================================================================

export interface MemorySystemState {
  // History state
  history: {
    records: CalculationRecord[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  
  // Presets state
  presets: {
    presets: ParameterPreset[];
    total: number;
    loading: boolean;
    error: string | null;
  };
  
  // Preferences state
  preferences: {
    data: UserPreferences;
    loading: boolean;
    error: string | null;
  };
  
  // Overall state
  initialized: boolean;
  lastUpdated: string | null;
}

// ============================================================================
// Memory System Actions
// ============================================================================

export interface MemorySystemActions {
  // History actions
  saveCalculation: (
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: any
  ) => Promise<string | null>;
  
  loadHistory: (query?: HistoryQuery) => Promise<void>;
  deleteCalculation: (id: string) => Promise<boolean>;
  clearHistory: () => Promise<void>;
  
  // Preset actions
  createPreset: (
    name: string,
    description: string,
    calculatorType: string,
    parameters: Record<string, any>,
    options?: any
  ) => Promise<string | null>;
  
  loadPresets: (query?: PresetQuery) => Promise<void>;
  updatePreset: (id: string, updates: Partial<ParameterPreset>) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  usePreset: (id: string) => Promise<ParameterPreset | null>;
  ratePreset: (id: string, rating: number) => Promise<boolean>;
  
  // Preference actions
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  
  // Utility actions
  refresh: () => Promise<void>;
  reset: () => void;
}

// ============================================================================
// Memory System Configuration
// ============================================================================

export interface MemorySystemConfig {
  calculatorType?: string;
  autoSave?: boolean;
  autoLoad?: boolean;
  enablePresets?: boolean;
  enableHistory?: boolean;
  enablePreferences?: boolean;
  historyPageSize?: number;
  presetsPageSize?: number;
}

const DEFAULT_CONFIG: Required<MemorySystemConfig> = {
  calculatorType: '',
  autoSave: true,
  autoLoad: true,
  enablePresets: true,
  enableHistory: true,
  enablePreferences: true,
  historyPageSize: 20,
  presetsPageSize: 20,
};

// ============================================================================
// Main Hook
// ============================================================================

export function useMemorySystem(
  config: MemorySystemConfig = {}
): [MemorySystemState, MemorySystemActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Individual hooks
  const [historyState, historyActions] = useCalculatorHistory({
    autoLoad: finalConfig.autoLoad && finalConfig.enableHistory,
    pageSize: finalConfig.historyPageSize,
    calculatorType: finalConfig.calculatorType,
  });
  
  const [presetsState, presetsActions] = useParameterPresets({
    autoLoad: finalConfig.autoLoad && finalConfig.enablePresets,
    pageSize: finalConfig.presetsPageSize,
    calculatorType: finalConfig.calculatorType,
  });
  
  const [preferencesState, preferencesActions] = useUserPreferences({
    autoLoad: finalConfig.autoLoad && finalConfig.enablePreferences,
  });
  
  // Combined state
  const [initialized, setInitialized] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Initialize system
  useEffect(() => {
    if (finalConfig.autoLoad && !initialized) {
      const initializeSystem = async () => {
        try {
          const promises = [];
          
          if (finalConfig.enableHistory) {
            promises.push(historyActions.loadHistory());
          }
          
          if (finalConfig.enablePresets) {
            promises.push(presetsActions.loadPresets());
          }
          
          if (finalConfig.enablePreferences) {
            promises.push(preferencesActions.loadPreferences());
          }
          
          await Promise.all(promises);
          setInitialized(true);
          setLastUpdated(new Date().toISOString());
        } catch (error) {
          console.error('Failed to initialize memory system:', error);
        }
      };
      
      initializeSystem();
    }
  }, [
    finalConfig.autoLoad,
    finalConfig.enableHistory,
    finalConfig.enablePresets,
    finalConfig.enablePreferences,
    initialized,
    historyActions,
    presetsActions,
    preferencesActions,
  ]);
  
  // Combined state object
  const state: MemorySystemState = {
    history: {
      records: historyState.records,
      total: historyState.total,
      loading: historyState.loading,
      error: historyState.error,
    },
    presets: {
      presets: presetsState.presets,
      total: presetsState.total,
      loading: presetsState.loading,
      error: presetsState.error,
    },
    preferences: {
      data: preferencesState.preferences,
      loading: preferencesState.loading,
      error: preferencesState.error,
    },
    initialized,
    lastUpdated,
  };
  
  // Enhanced actions with auto-save and refresh
  const saveCalculation = useCallback(async (
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: any
  ): Promise<string | null> => {
    if (!finalConfig.enableHistory) return null;
    
    const id = await historyActions.saveCalculation(
      calculatorType,
      calculatorName,
      inputs,
      outputs,
      context
    );
    
    if (id) {
      setLastUpdated(new Date().toISOString());
    }
    
    return id;
  }, [finalConfig.enableHistory, historyActions]);
  
  const loadHistory = useCallback(async (query?: HistoryQuery) => {
    if (!finalConfig.enableHistory) return;
    await historyActions.loadHistory(query);
    setLastUpdated(new Date().toISOString());
  }, [finalConfig.enableHistory, historyActions]);
  
  const deleteCalculation = useCallback(async (id: string): Promise<boolean> => {
    if (!finalConfig.enableHistory) return false;
    
    const success = await historyActions.deleteCalculation(id);
    if (success) {
      setLastUpdated(new Date().toISOString());
    }
    return success;
  }, [finalConfig.enableHistory, historyActions]);
  
  const clearHistory = useCallback(async () => {
    if (!finalConfig.enableHistory) return;
    await historyActions.clearHistory();
    setLastUpdated(new Date().toISOString());
  }, [finalConfig.enableHistory, historyActions]);
  
  const createPreset = useCallback(async (
    name: string,
    description: string,
    calculatorType: string,
    parameters: Record<string, any>,
    options?: any
  ): Promise<string | null> => {
    if (!finalConfig.enablePresets) return null;
    
    const id = await presetsActions.createPreset(
      name,
      description,
      calculatorType,
      parameters,
      options
    );
    
    if (id) {
      setLastUpdated(new Date().toISOString());
    }
    
    return id;
  }, [finalConfig.enablePresets, presetsActions]);
  
  const loadPresets = useCallback(async (query?: PresetQuery) => {
    if (!finalConfig.enablePresets) return;
    await presetsActions.loadPresets(query);
    setLastUpdated(new Date().toISOString());
  }, [finalConfig.enablePresets, presetsActions]);
  
  const updatePreset = useCallback(async (
    id: string,
    updates: Partial<ParameterPreset>
  ): Promise<boolean> => {
    if (!finalConfig.enablePresets) return false;
    
    const success = await presetsActions.updatePreset(id, updates);
    if (success) {
      setLastUpdated(new Date().toISOString());
    }
    return success;
  }, [finalConfig.enablePresets, presetsActions]);
  
  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    if (!finalConfig.enablePresets) return false;
    
    const success = await presetsActions.deletePreset(id);
    if (success) {
      setLastUpdated(new Date().toISOString());
    }
    return success;
  }, [finalConfig.enablePresets, presetsActions]);
  
  const usePreset = useCallback(async (id: string): Promise<ParameterPreset | null> => {
    if (!finalConfig.enablePresets) return null;
    
    const preset = await presetsActions.usePreset(id);
    if (preset) {
      setLastUpdated(new Date().toISOString());
    }
    return preset;
  }, [finalConfig.enablePresets, presetsActions]);
  
  const ratePreset = useCallback(async (id: string, rating: number): Promise<boolean> => {
    if (!finalConfig.enablePresets) return false;
    
    const success = await presetsActions.ratePreset(id, rating);
    if (success) {
      setLastUpdated(new Date().toISOString());
    }
    return success;
  }, [finalConfig.enablePresets, presetsActions]);
  
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!finalConfig.enablePreferences) return;
    await preferencesActions.updatePreferences(updates);
    setLastUpdated(new Date().toISOString());
  }, [finalConfig.enablePreferences, preferencesActions]);
  
  const resetPreferences = useCallback(async () => {
    if (!finalConfig.enablePreferences) return;
    await preferencesActions.resetPreferences();
    setLastUpdated(new Date().toISOString());
  }, [finalConfig.enablePreferences, preferencesActions]);
  
  const refresh = useCallback(async () => {
    const promises = [];
    
    if (finalConfig.enableHistory) {
      promises.push(historyActions.loadHistory());
    }
    
    if (finalConfig.enablePresets) {
      promises.push(presetsActions.loadPresets());
    }
    
    if (finalConfig.enablePreferences) {
      promises.push(preferencesActions.loadPreferences());
    }
    
    await Promise.all(promises);
    setLastUpdated(new Date().toISOString());
  }, [
    finalConfig.enableHistory,
    finalConfig.enablePresets,
    finalConfig.enablePreferences,
    historyActions,
    presetsActions,
    preferencesActions,
  ]);
  
  const reset = useCallback(() => {
    historyActions.reset();
    presetsActions.reset();
    preferencesActions.reset();
    setInitialized(false);
    setLastUpdated(null);
  }, [historyActions, presetsActions, preferencesActions]);
  
  // Combined actions object
  const actions: MemorySystemActions = {
    // History actions
    saveCalculation,
    loadHistory,
    deleteCalculation,
    clearHistory,
    
    // Preset actions
    createPreset,
    loadPresets,
    updatePreset,
    deletePreset,
    usePreset,
    ratePreset,
    
    // Preference actions
    updatePreferences,
    resetPreferences,
    
    // Utility actions
    refresh,
    reset,
  };
  
  return [state, actions];
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook for calculator-specific memory system
 */
export function useCalculatorMemorySystem(calculatorType: string) {
  return useMemorySystem({
    calculatorType,
    autoSave: true,
    autoLoad: true,
  });
}

/**
 * Hook for read-only memory system (no auto-save)
 */
export function useReadOnlyMemorySystem(calculatorType?: string) {
  return useMemorySystem({
    calculatorType,
    autoSave: false,
    autoLoad: true,
  });
}

/**
 * Hook for preset-only memory system
 */
export function usePresetOnlyMemorySystem(calculatorType?: string) {
  return useMemorySystem({
    calculatorType,
    enableHistory: false,
    enablePreferences: false,
    enablePresets: true,
  });
}
