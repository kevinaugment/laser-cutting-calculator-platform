/**
 * Knowledge Transfer Hook
 * React hook for knowledge transfer functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  knowledgeTransferService,
  KnowledgeItem,
  LearningPath,
  UserProgress,
  KnowledgeQuery,
  CreateKnowledgeItemData,
  CreateLearningPathData,
  KnowledgeType,
  KnowledgeStatus
} from '../services/knowledgeTransferService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface KnowledgeTransferState {
  knowledgeItems: KnowledgeItem[];
  learningPaths: LearningPath[];
  userProgress: UserProgress[];
  currentItem: KnowledgeItem | null;
  currentPath: LearningPath | null;
  currentProgress: UserProgress | null;
  analytics: any;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface KnowledgeTransferActions {
  createKnowledgeItem: (data: CreateKnowledgeItemData) => Promise<KnowledgeItem>;
  updateKnowledgeItem: (itemId: string, updates: Partial<KnowledgeItem>) => Promise<KnowledgeItem>;
  validateKnowledgeItem: (itemId: string) => Promise<KnowledgeItem>;
  getKnowledgeItem: (itemId: string) => Promise<KnowledgeItem | null>;
  searchKnowledgeItems: (query: KnowledgeQuery) => Promise<KnowledgeItem[]>;
  createLearningPath: (data: CreateLearningPathData) => Promise<LearningPath>;
  getLearningPath: (pathId: string) => Promise<LearningPath | null>;
  startLearningPath: (pathId: string) => Promise<UserProgress>;
  updateItemProgress: (pathId: string, itemId: string, status: 'in-progress' | 'completed', timeSpent?: number) => Promise<UserProgress>;
  getUserProgress: (pathId: string) => Promise<UserProgress | null>;
  getAnalytics: () => Promise<any>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseKnowledgeTransferConfig {
  userId?: string;
  autoLoadItems?: boolean;
  autoLoadPaths?: boolean;
  autoLoadProgress?: boolean;
  defaultQuery?: Partial<KnowledgeQuery>;
}

const DEFAULT_CONFIG: Required<UseKnowledgeTransferConfig> = {
  userId: 'anonymous-user',
  autoLoadItems: true,
  autoLoadPaths: true,
  autoLoadProgress: true,
  defaultQuery: { status: 'published', limit: 20 },
};

// ============================================================================
// Main Hook
// ============================================================================

export function useKnowledgeTransfer(
  config: UseKnowledgeTransferConfig = {}
): [KnowledgeTransferState, KnowledgeTransferActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<KnowledgeTransferState>({
    knowledgeItems: [],
    learningPaths: [],
    userProgress: [],
    currentItem: null,
    currentPath: null,
    currentProgress: null,
    analytics: null,
    loading: false,
    error: null,
    initialized: false,
  });

  // Initialize data
  useEffect(() => {
    if (!state.initialized) {
      initializeData();
    }
  }, [state.initialized]);

  // Initialize data
  const initializeData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const promises: Promise<any>[] = [];

      if (finalConfig.autoLoadItems) {
        promises.push(knowledgeTransferService.searchKnowledgeItems(finalConfig.defaultQuery));
      }

      // Note: Learning paths and user progress would require additional API endpoints
      // For now, we'll initialize with empty arrays

      const results = await Promise.all(promises);
      
      setState(prev => ({
        ...prev,
        knowledgeItems: finalConfig.autoLoadItems ? results[0] : [],
        learningPaths: [],
        userProgress: [],
        loading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize knowledge transfer data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig]);

  // Create knowledge item
  const createKnowledgeItem = useCallback(async (
    data: CreateKnowledgeItemData
  ): Promise<KnowledgeItem> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const item = await knowledgeTransferService.createKnowledgeItem(finalConfig.userId, data);
      
      setState(prev => ({
        ...prev,
        knowledgeItems: [item, ...prev.knowledgeItems],
        currentItem: item,
        loading: false,
      }));

      return item;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create knowledge item';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Update knowledge item
  const updateKnowledgeItem = useCallback(async (
    itemId: string,
    updates: Partial<KnowledgeItem>
  ): Promise<KnowledgeItem> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const item = await knowledgeTransferService.updateKnowledgeItem(itemId, finalConfig.userId, updates);
      
      setState(prev => ({
        ...prev,
        knowledgeItems: prev.knowledgeItems.map(i => i.id === itemId ? item : i),
        currentItem: prev.currentItem?.id === itemId ? item : prev.currentItem,
        loading: false,
      }));

      return item;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update knowledge item';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Validate knowledge item
  const validateKnowledgeItem = useCallback(async (itemId: string): Promise<KnowledgeItem> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const item = await knowledgeTransferService.validateKnowledgeItem(itemId, finalConfig.userId);
      
      setState(prev => ({
        ...prev,
        knowledgeItems: prev.knowledgeItems.map(i => i.id === itemId ? item : i),
        currentItem: prev.currentItem?.id === itemId ? item : prev.currentItem,
        loading: false,
      }));

      return item;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate knowledge item';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get knowledge item
  const getKnowledgeItem = useCallback(async (itemId: string): Promise<KnowledgeItem | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const item = await knowledgeTransferService.getKnowledgeItem(itemId, finalConfig.userId);
      
      setState(prev => ({
        ...prev,
        currentItem: item,
        loading: false,
      }));

      return item;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get knowledge item';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [finalConfig.userId]);

  // Search knowledge items
  const searchKnowledgeItems = useCallback(async (
    query: KnowledgeQuery
  ): Promise<KnowledgeItem[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const items = await knowledgeTransferService.searchKnowledgeItems(query);
      
      setState(prev => ({
        ...prev,
        knowledgeItems: items,
        loading: false,
      }));

      return items;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search knowledge items';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, []);

  // Create learning path
  const createLearningPath = useCallback(async (
    data: CreateLearningPathData
  ): Promise<LearningPath> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const path = await knowledgeTransferService.createLearningPath(finalConfig.userId, data);
      
      setState(prev => ({
        ...prev,
        learningPaths: [path, ...prev.learningPaths],
        currentPath: path,
        loading: false,
      }));

      return path;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create learning path';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get learning path
  const getLearningPath = useCallback(async (pathId: string): Promise<LearningPath | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const path = await knowledgeTransferService.getLearningPath(pathId);
      
      setState(prev => ({
        ...prev,
        currentPath: path,
        loading: false,
      }));

      return path;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get learning path';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  // Start learning path
  const startLearningPath = useCallback(async (pathId: string): Promise<UserProgress> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const progress = await knowledgeTransferService.startLearningPath(finalConfig.userId, pathId);
      
      setState(prev => ({
        ...prev,
        userProgress: [progress, ...prev.userProgress.filter(p => p.learningPathId !== pathId)],
        currentProgress: progress,
        loading: false,
      }));

      return progress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start learning path';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Update item progress
  const updateItemProgress = useCallback(async (
    pathId: string,
    itemId: string,
    status: 'in-progress' | 'completed',
    timeSpent: number = 0
  ): Promise<UserProgress> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const progress = await knowledgeTransferService.updateItemProgress(
        finalConfig.userId,
        pathId,
        itemId,
        status,
        timeSpent
      );
      
      setState(prev => ({
        ...prev,
        userProgress: prev.userProgress.map(p => p.learningPathId === pathId ? progress : p),
        currentProgress: prev.currentProgress?.learningPathId === pathId ? progress : prev.currentProgress,
        loading: false,
      }));

      return progress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item progress';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get user progress
  const getUserProgress = useCallback(async (pathId: string): Promise<UserProgress | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const progress = await knowledgeTransferService.getUserProgress(finalConfig.userId, pathId);
      
      setState(prev => ({
        ...prev,
        currentProgress: progress,
        loading: false,
      }));

      return progress;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user progress';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [finalConfig.userId]);

  // Get analytics
  const getAnalytics = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const analytics = await knowledgeTransferService.getKnowledgeAnalytics();
      
      setState(prev => ({
        ...prev,
        analytics,
        loading: false,
      }));

      return analytics;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get analytics';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async (): Promise<void> => {
    await initializeData();
  }, [initializeData]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: KnowledgeTransferActions = {
    createKnowledgeItem,
    updateKnowledgeItem,
    validateKnowledgeItem,
    getKnowledgeItem,
    searchKnowledgeItems,
    createLearningPath,
    getLearningPath,
    startLearningPath,
    updateItemProgress,
    getUserProgress,
    getAnalytics,
    refreshData,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for knowledge item management
 */
export function useKnowledgeItems(
  query: Partial<KnowledgeQuery> = {},
  userId?: string
) {
  const [state, actions] = useKnowledgeTransfer({ 
    userId, 
    autoLoadItems: true,
    defaultQuery: query,
  });

  return {
    items: state.knowledgeItems,
    currentItem: state.currentItem,
    loading: state.loading,
    error: state.error,
    createItem: actions.createKnowledgeItem,
    updateItem: actions.updateKnowledgeItem,
    validateItem: actions.validateKnowledgeItem,
    getItem: actions.getKnowledgeItem,
    searchItems: actions.searchKnowledgeItems,
    clearError: actions.clearError,
  };
}

/**
 * Hook for learning path management
 */
export function useLearningPaths(userId?: string) {
  const [state, actions] = useKnowledgeTransfer({ 
    userId, 
    autoLoadPaths: true,
  });

  return {
    paths: state.learningPaths,
    currentPath: state.currentPath,
    loading: state.loading,
    error: state.error,
    createPath: actions.createLearningPath,
    getPath: actions.getLearningPath,
    clearError: actions.clearError,
  };
}

/**
 * Hook for learning progress tracking
 */
export function useLearningProgress(userId?: string) {
  const [state, actions] = useKnowledgeTransfer({ 
    userId, 
    autoLoadProgress: true,
  });

  return {
    progress: state.userProgress,
    currentProgress: state.currentProgress,
    loading: state.loading,
    error: state.error,
    startPath: actions.startLearningPath,
    updateProgress: actions.updateItemProgress,
    getProgress: actions.getUserProgress,
    clearError: actions.clearError,
  };
}

/**
 * Hook for knowledge analytics
 */
export function useKnowledgeAnalytics() {
  const [state, actions] = useKnowledgeTransfer({ 
    autoLoadItems: false,
    autoLoadPaths: false,
    autoLoadProgress: false,
  });

  useEffect(() => {
    actions.getAnalytics();
  }, []);

  return {
    analytics: state.analytics,
    loading: state.loading,
    error: state.error,
    refresh: actions.getAnalytics,
    clearError: actions.clearError,
  };
}
