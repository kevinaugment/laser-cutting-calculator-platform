/**
 * Calculation History Hook
 * React hook for managing calculation history operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  CalculationRecord, 
  CalculationContext, 
  CalculationMetadata 
} from '../types/memory';
import { calculationHistoryService, HistoryQuery, HistoryStats } from '../services/calculationHistoryService';

export interface UseCalculationHistoryState {
  records: CalculationRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  stats: HistoryStats | null;
  hasMore: boolean;
}

export interface UseCalculationHistoryActions {
  saveCalculation: (
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: Partial<CalculationContext>,
    metadata?: Partial<CalculationMetadata>
  ) => Promise<string>;
  loadHistory: (query?: HistoryQuery) => Promise<void>;
  loadMore: () => Promise<void>;
  deleteCalculation: (id: string) => Promise<boolean>;
  clearHistory: () => Promise<void>;
  getCalculation: (id: string) => Promise<CalculationRecord | null>;
  refreshStats: () => Promise<void>;
  search: (searchTerm: string) => Promise<void>;
  filterByCalculator: (calculatorType: string) => Promise<void>;
  filterByDateRange: (dateFrom: Date, dateTo: Date) => Promise<void>;
}

export interface UseCalculationHistoryOptions {
  autoLoad?: boolean;
  pageSize?: number;
  enableStats?: boolean;
}

/**
 * Hook for managing calculation history
 */
export function useCalculationHistory(
  options: UseCalculationHistoryOptions = {}
): [UseCalculationHistoryState, UseCalculationHistoryActions] {
  const { autoLoad = true, pageSize = 20, enableStats = true } = options;

  // State
  const [state, setState] = useState<UseCalculationHistoryState>({
    records: [],
    total: 0,
    loading: false,
    error: null,
    stats: null,
    hasMore: false,
  });

  const [currentQuery, setCurrentQuery] = useState<HistoryQuery>({
    limit: pageSize,
    offset: 0,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  // Save calculation to history
  const saveCalculation = useCallback(async (
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: Partial<CalculationContext>,
    metadata?: Partial<CalculationMetadata>
  ): Promise<string> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const id = await calculationHistoryService.saveCalculation(
        calculatorType,
        calculatorName,
        inputs,
        outputs,
        context,
        metadata
      );

      // Refresh the current view
      await loadHistory(currentQuery);
      
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save calculation';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [currentQuery]);

  // Load history with query
  const loadHistory = useCallback(async (query?: HistoryQuery): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const finalQuery = query || currentQuery;
      const result = await calculationHistoryService.getHistory(finalQuery);
      
      setState(prev => ({
        ...prev,
        records: result.records,
        total: result.total,
        hasMore: result.pagination.hasNext,
        loading: false,
      }));

      if (query) {
        setCurrentQuery(query);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load history';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [currentQuery]);

  // Load more records (pagination)
  const loadMore = useCallback(async (): Promise<void> => {
    if (!state.hasMore || state.loading) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const nextQuery = {
        ...currentQuery,
        offset: (currentQuery.offset || 0) + (currentQuery.limit || pageSize),
      };
      
      const result = await calculationHistoryService.getHistory(nextQuery);
      
      setState(prev => ({
        ...prev,
        records: [...prev.records, ...result.records],
        hasMore: result.pagination.hasNext,
        loading: false,
      }));

      setCurrentQuery(nextQuery);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load more records';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [state.hasMore, state.loading, currentQuery, pageSize]);

  // Delete calculation
  const deleteCalculation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const success = await calculationHistoryService.deleteCalculation(id);
      
      if (success) {
        // Remove from current records
        setState(prev => ({
          ...prev,
          records: prev.records.filter(record => record.id !== id),
          total: prev.total - 1,
        }));
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete calculation';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  // Clear all history
  const clearHistory = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await calculationHistoryService.clearHistory();
      
      setState(prev => ({
        ...prev,
        records: [],
        total: 0,
        hasMore: false,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear history';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  // Get specific calculation
  const getCalculation = useCallback(async (id: string): Promise<CalculationRecord | null> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      return await calculationHistoryService.getCalculation(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get calculation';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  // Refresh statistics
  const refreshStats = useCallback(async (): Promise<void> => {
    if (!enableStats) return;

    try {
      const stats = await calculationHistoryService.getStats();
      setState(prev => ({ ...prev, stats }));
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }, [enableStats]);

  // Search functionality
  const search = useCallback(async (searchTerm: string): Promise<void> => {
    const searchQuery: HistoryQuery = {
      ...currentQuery,
      search: searchTerm,
      offset: 0, // Reset to first page
    };
    
    await loadHistory(searchQuery);
  }, [currentQuery, loadHistory]);

  // Filter by calculator type
  const filterByCalculator = useCallback(async (calculatorType: string): Promise<void> => {
    const filterQuery: HistoryQuery = {
      ...currentQuery,
      calculatorType,
      offset: 0, // Reset to first page
    };
    
    await loadHistory(filterQuery);
  }, [currentQuery, loadHistory]);

  // Filter by date range
  const filterByDateRange = useCallback(async (dateFrom: Date, dateTo: Date): Promise<void> => {
    const dateQuery: HistoryQuery = {
      ...currentQuery,
      dateFrom,
      dateTo,
      offset: 0, // Reset to first page
    };
    
    await loadHistory(dateQuery);
  }, [currentQuery, loadHistory]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadHistory();
      if (enableStats) {
        refreshStats();
      }
    }
  }, [autoLoad, enableStats]); // Only run on mount

  // Actions object
  const actions: UseCalculationHistoryActions = {
    saveCalculation,
    loadHistory,
    loadMore,
    deleteCalculation,
    clearHistory,
    getCalculation,
    refreshStats,
    search,
    filterByCalculator,
    filterByDateRange,
  };

  return [state, actions];
}

/**
 * Hook for getting calculation history statistics only
 */
export function useCalculationStats(): [HistoryStats | null, boolean, string | null, () => Promise<void>] {
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const newStats = await calculationHistoryService.getStats();
      setStats(newStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stats';
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
