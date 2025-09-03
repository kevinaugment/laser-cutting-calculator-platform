/**
 * ML Models Hook
 * React hook for ML model management and inference
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  mlModelService,
  MLModel,
  ModelPrediction,
  ModelMonitoring,
  ModelType,
  ModelStatus,
  ModelFramework
} from '../services/mlModelService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface MLModelsState {
  models: MLModel[];
  deployedModels: MLModel[];
  monitoring: ModelMonitoring[];
  currentModel: MLModel | null;
  currentPrediction: ModelPrediction | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface MLModelsActions {
  registerModel: (modelData: Omit<MLModel, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MLModel>;
  deployModel: (modelId: string) => Promise<MLModel>;
  rollbackModel: (modelId: string) => Promise<MLModel>;
  getModel: (modelId: string) => Promise<MLModel | null>;
  listModels: (filters?: { type?: ModelType; status?: ModelStatus; framework?: ModelFramework }) => Promise<MLModel[]>;
  predict: (modelId: string, input: any) => Promise<ModelPrediction>;
  batchPredict: (modelId: string, inputs: any[]) => Promise<ModelPrediction[]>;
  getModelMonitoring: (modelId: string) => Promise<ModelMonitoring | null>;
  checkModelHealth: (modelId: string) => Promise<{ healthy: boolean; issues: string[]; recommendations: string[] }>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseMLModelsConfig {
  autoLoadModels?: boolean;
  autoLoadMonitoring?: boolean;
  enableRealTimeUpdates?: boolean;
  updateInterval?: number;
}

const DEFAULT_CONFIG: Required<UseMLModelsConfig> = {
  autoLoadModels: true,
  autoLoadMonitoring: true,
  enableRealTimeUpdates: true,
  updateInterval: 30000, // 30 seconds
};

// ============================================================================
// Main Hook
// ============================================================================

export function useMLModels(
  config: UseMLModelsConfig = {}
): [MLModelsState, MLModelsActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<MLModelsState>({
    models: [],
    deployedModels: [],
    monitoring: [],
    currentModel: null,
    currentPrediction: null,
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

  // Real-time updates
  useEffect(() => {
    if (finalConfig.enableRealTimeUpdates && state.initialized) {
      const interval = setInterval(() => {
        refreshMonitoring();
      }, finalConfig.updateInterval);

      return () => clearInterval(interval);
    }
  }, [finalConfig.enableRealTimeUpdates, finalConfig.updateInterval, state.initialized]);

  // Initialize data
  const initializeData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const promises: Promise<any>[] = [];

      if (finalConfig.autoLoadModels) {
        promises.push(mlModelService.listModels());
        promises.push(mlModelService.listModels({ status: 'deployed' }));
      }

      if (finalConfig.autoLoadMonitoring) {
        promises.push(mlModelService.getAllModelMonitoring());
      }

      const results = await Promise.all(promises);
      
      setState(prev => ({
        ...prev,
        models: finalConfig.autoLoadModels ? results[0] : [],
        deployedModels: finalConfig.autoLoadModels ? results[1] : [],
        monitoring: finalConfig.autoLoadMonitoring ? results[results.length - 1] : [],
        loading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize ML models data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig]);

  // Register model
  const registerModel = useCallback(async (
    modelData: Omit<MLModel, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MLModel> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const model = await mlModelService.registerModel(modelData);
      
      setState(prev => ({
        ...prev,
        models: [model, ...prev.models],
        currentModel: model,
        loading: false,
      }));

      return model;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register model';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Deploy model
  const deployModel = useCallback(async (modelId: string): Promise<MLModel> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const model = await mlModelService.deployModel(modelId);
      
      setState(prev => ({
        ...prev,
        models: prev.models.map(m => m.id === modelId ? model : m),
        deployedModels: [model, ...prev.deployedModels.filter(m => m.id !== modelId)],
        currentModel: model,
        loading: false,
      }));

      return model;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to deploy model';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Rollback model
  const rollbackModel = useCallback(async (modelId: string): Promise<MLModel> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const model = await mlModelService.rollbackModel(modelId);
      
      // Refresh deployed models
      const deployedModels = await mlModelService.listModels({ status: 'deployed' });
      
      setState(prev => ({
        ...prev,
        deployedModels,
        currentModel: model,
        loading: false,
      }));

      return model;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to rollback model';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Get model
  const getModel = useCallback(async (modelId: string): Promise<MLModel | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const model = await mlModelService.getModel(modelId);
      
      setState(prev => ({
        ...prev,
        currentModel: model,
        loading: false,
      }));

      return model;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get model';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  // List models
  const listModels = useCallback(async (
    filters: { type?: ModelType; status?: ModelStatus; framework?: ModelFramework } = {}
  ): Promise<MLModel[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const models = await mlModelService.listModels(filters);
      
      setState(prev => ({
        ...prev,
        models,
        loading: false,
      }));

      return models;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to list models';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, []);

  // Make prediction
  const predict = useCallback(async (modelId: string, input: any): Promise<ModelPrediction> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const prediction = await mlModelService.predict(modelId, input);
      
      setState(prev => ({
        ...prev,
        currentPrediction: prediction,
        loading: false,
      }));

      return prediction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to make prediction';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Batch predict
  const batchPredict = useCallback(async (modelId: string, inputs: any[]): Promise<ModelPrediction[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const predictions = await mlModelService.batchPredict(modelId, inputs);
      
      setState(prev => ({
        ...prev,
        currentPrediction: predictions[0] || null,
        loading: false,
      }));

      return predictions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to make batch predictions';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Get model monitoring
  const getModelMonitoring = useCallback(async (modelId: string): Promise<ModelMonitoring | null> => {
    try {
      const monitoring = await mlModelService.getModelMonitoring(modelId);
      
      if (monitoring) {
        setState(prev => ({
          ...prev,
          monitoring: prev.monitoring.map(m => m.modelId === modelId ? monitoring : m),
        }));
      }

      return monitoring;
    } catch (error) {
      console.warn('Failed to get model monitoring:', error);
      return null;
    }
  }, []);

  // Check model health
  const checkModelHealth = useCallback(async (modelId: string) => {
    try {
      return await mlModelService.checkModelHealth(modelId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check model health';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Refresh monitoring data
  const refreshMonitoring = useCallback(async () => {
    if (!finalConfig.autoLoadMonitoring) return;

    try {
      const monitoring = await mlModelService.getAllModelMonitoring();
      setState(prev => ({ ...prev, monitoring }));
    } catch (error) {
      console.warn('Failed to refresh monitoring data:', error);
    }
  }, [finalConfig.autoLoadMonitoring]);

  // Refresh data
  const refreshData = useCallback(async (): Promise<void> => {
    await initializeData();
  }, [initializeData]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: MLModelsActions = {
    registerModel,
    deployModel,
    rollbackModel,
    getModel,
    listModels,
    predict,
    batchPredict,
    getModelMonitoring,
    checkModelHealth,
    refreshData,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for model inference
 */
export function useModelInference(modelId?: string) {
  const [state, actions] = useMLModels({
    autoLoadModels: false,
    autoLoadMonitoring: false,
    enableRealTimeUpdates: false,
  });

  return {
    currentPrediction: state.currentPrediction,
    loading: state.loading,
    error: state.error,
    predict: actions.predict,
    batchPredict: actions.batchPredict,
    clearError: actions.clearError,
  };
}

/**
 * Hook for model monitoring
 */
export function useModelMonitoring(modelId?: string) {
  const [state, actions] = useMLModels({
    autoLoadModels: false,
    autoLoadMonitoring: true,
    enableRealTimeUpdates: true,
  });

  const modelMonitoring = modelId ? 
    state.monitoring.find(m => m.modelId === modelId) : null;

  return {
    monitoring: state.monitoring,
    modelMonitoring,
    loading: state.loading,
    error: state.error,
    getModelMonitoring: actions.getModelMonitoring,
    checkModelHealth: actions.checkModelHealth,
    clearError: actions.clearError,
  };
}

/**
 * Hook for model management
 */
export function useModelManagement() {
  const [state, actions] = useMLModels({
    autoLoadModels: true,
    autoLoadMonitoring: false,
    enableRealTimeUpdates: false,
  });

  return {
    models: state.models,
    deployedModels: state.deployedModels,
    currentModel: state.currentModel,
    loading: state.loading,
    error: state.error,
    registerModel: actions.registerModel,
    deployModel: actions.deployModel,
    rollbackModel: actions.rollbackModel,
    getModel: actions.getModel,
    listModels: actions.listModels,
    refreshData: actions.refreshData,
    clearError: actions.clearError,
  };
}
