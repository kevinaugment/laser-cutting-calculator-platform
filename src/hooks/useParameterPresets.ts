/**
 * Parameter Presets Hook
 * React hook for managing parameter presets
 */

import { useState, useEffect, useCallback } from 'react';
import { ParameterPreset, PresetCategory } from '../types/memory';
import { parameterPresetService, PresetQuery, PresetStats } from '../services/parameterPresetService';

export interface UseParameterPresetsState {
  presets: ParameterPreset[];
  total: number;
  loading: boolean;
  error: string | null;
  stats: PresetStats | null;
  hasMore: boolean;
}

export interface UseParameterPresetsActions {
  createPreset: (
    name: string,
    description: string,
    calculatorType: string,
    parameters: Record<string, any>,
    options?: {
      category?: PresetCategory;
      visibility?: string;
      tags?: string[];
    }
  ) => Promise<string>;
  updatePreset: (
    id: string,
    updates: Partial<Pick<ParameterPreset, 'name' | 'description' | 'parameters' | 'category' | 'tags'>>
  ) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  usePreset: (id: string) => Promise<ParameterPreset | null>;
  ratePreset: (id: string, rating: number) => Promise<boolean>;
  duplicatePreset: (id: string, newName?: string) => Promise<string | null>;
  loadPresets: (query?: PresetQuery) => Promise<void>;
  loadMore: () => Promise<void>;
  search: (searchTerm: string) => Promise<void>;
  filterByCalculator: (calculatorType: string) => Promise<void>;
  filterByCategory: (category: PresetCategory) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export interface UseParameterPresetsOptions {
  autoLoad?: boolean;
  pageSize?: number;
  enableStats?: boolean;
  calculatorType?: string;
}

/**
 * Hook for managing parameter presets
 */
export function useParameterPresets(
  options: UseParameterPresetsOptions = {}
): [UseParameterPresetsState, UseParameterPresetsActions] {
  const { autoLoad = true, pageSize = 20, enableStats = true, calculatorType } = options;

  // State
  const [state, setState] = useState<UseParameterPresetsState>({
    presets: [],
    total: 0,
    loading: false,
    error: null,
    stats: null,
    hasMore: false,
  });

  const [currentQuery, setCurrentQuery] = useState<PresetQuery>({
    calculatorType,
    limit: pageSize,
    offset: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Create preset
  const createPreset = useCallback(async (
    name: string,
    description: string,
    calculatorType: string,
    parameters: Record<string, any>,
    options?: {
      category?: PresetCategory;
      visibility?: string;
      tags?: string[];
    }
  ): Promise<string> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const id = await parameterPresetService.createPreset(
        name,
        description,
        calculatorType,
        parameters,
        options
      );

      // Refresh the current view
      await loadPresets(currentQuery);
      
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create preset';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [currentQuery]);

  // Update preset
  const updatePreset = useCallback(async (
    id: string,
    updates: Partial<Pick<ParameterPreset, 'name' | 'description' | 'parameters' | 'category' | 'tags'>>
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const success = await parameterPresetService.updatePreset(id, updates);
      
      if (success) {
        // Refresh the current view
        await loadPresets(currentQuery);
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preset';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [currentQuery]);

  // Delete preset
  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const success = await parameterPresetService.deletePreset(id);
      
      if (success) {
        // Remove from current presets
        setState(prev => ({
          ...prev,
          presets: prev.presets.filter(preset => preset.id !== id),
          total: prev.total - 1,
        }));
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete preset';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  // Use preset
  const usePreset = useCallback(async (id: string): Promise<ParameterPreset | null> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const preset = await parameterPresetService.usePreset(id);
      
      if (preset) {
        // Update the preset in current list
        setState(prev => ({
          ...prev,
          presets: prev.presets.map(p => p.id === id ? preset : p),
        }));
      }
      
      return preset;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to use preset';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  // Rate preset
  const ratePreset = useCallback(async (id: string, rating: number): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const success = await parameterPresetService.ratePreset(id, rating);
      
      if (success) {
        // Refresh the current view to get updated rating
        await loadPresets(currentQuery);
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to rate preset';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [currentQuery]);

  // Duplicate preset
  const duplicatePreset = useCallback(async (id: string, newName?: string): Promise<string | null> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const newId = await parameterPresetService.duplicatePreset(id, newName);
      
      if (newId) {
        // Refresh the current view
        await loadPresets(currentQuery);
      }
      
      return newId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate preset';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, [currentQuery]);

  // Load presets with query
  const loadPresets = useCallback(async (query?: PresetQuery): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const finalQuery = query || currentQuery;
      const result = await parameterPresetService.getPresets(finalQuery);
      
      setState(prev => ({
        ...prev,
        presets: result.presets,
        total: result.total,
        hasMore: result.hasMore,
        loading: false,
      }));

      if (query) {
        setCurrentQuery(query);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load presets';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [currentQuery]);

  // Load more presets (pagination)
  const loadMore = useCallback(async (): Promise<void> => {
    if (!state.hasMore || state.loading) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const nextQuery = {
        ...currentQuery,
        offset: (currentQuery.offset || 0) + (currentQuery.limit || pageSize),
      };
      
      const result = await parameterPresetService.getPresets(nextQuery);
      
      setState(prev => ({
        ...prev,
        presets: [...prev.presets, ...result.presets],
        hasMore: result.hasMore,
        loading: false,
      }));

      setCurrentQuery(nextQuery);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load more presets';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [state.hasMore, state.loading, currentQuery, pageSize]);

  // Search functionality
  const search = useCallback(async (searchTerm: string): Promise<void> => {
    const searchQuery: PresetQuery = {
      ...currentQuery,
      search: searchTerm,
      offset: 0, // Reset to first page
    };
    
    await loadPresets(searchQuery);
  }, [currentQuery, loadPresets]);

  // Filter by calculator type
  const filterByCalculator = useCallback(async (calculatorType: string): Promise<void> => {
    const filterQuery: PresetQuery = {
      ...currentQuery,
      calculatorType,
      offset: 0, // Reset to first page
    };
    
    await loadPresets(filterQuery);
  }, [currentQuery, loadPresets]);

  // Filter by category
  const filterByCategory = useCallback(async (category: PresetCategory): Promise<void> => {
    const categoryQuery: PresetQuery = {
      ...currentQuery,
      category,
      offset: 0, // Reset to first page
    };
    
    await loadPresets(categoryQuery);
  }, [currentQuery, loadPresets]);

  // Refresh statistics
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!enableStats) return;

    try {
      const stats = await parameterPresetService.getStats();
      setState(prev => ({ ...prev, stats }));
    } catch (error) {
      console.error('Failed to refresh preset stats:', error);
    }
  }, [enableStats]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadPresets();
      if (enableStats) {
        refreshStats();
      }
    }
  }, [autoLoad, enableStats]); // Only run on mount

  // Subscribe to preset changes
  useEffect(() => {
    const unsubscribe = parameterPresetService.subscribe((presets) => {
      // Only update if we're showing all presets or the specific calculator type
      if (!currentQuery.calculatorType || currentQuery.calculatorType === calculatorType) {
        setState(prev => ({
          ...prev,
          presets: presets.slice(0, currentQuery.limit || pageSize),
          total: presets.length,
        }));
      }
    });

    return unsubscribe;
  }, [currentQuery.calculatorType, calculatorType, currentQuery.limit, pageSize]);

  // Actions object
  const actions: UseParameterPresetsActions = {
    createPreset,
    updatePreset,
    deletePreset,
    usePreset,
    ratePreset,
    duplicatePreset,
    loadPresets,
    loadMore,
    search,
    filterByCalculator,
    filterByCategory,
    refreshStats,
  };

  return [state, actions];
}

/**
 * Hook for getting preset statistics only
 */
export function usePresetStats(): [PresetStats | null, boolean, string | null, () => Promise<void>] {
  const [stats, setStats] = useState<PresetStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const newStats = await parameterPresetService.getStats();
      setStats(newStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load preset stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return [stats, loading, error, refreshStats];
}
