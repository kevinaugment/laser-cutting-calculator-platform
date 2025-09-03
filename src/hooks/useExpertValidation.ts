/**
 * Expert Validation Hook
 * React hook for expert validation functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  expertValidationService,
  ExpertProfile,
  ValidationRequest,
  ValidationResult,
  CreateValidationRequestData,
  SubmitValidationResultData,
  ValidationStatus,
  ValidationCategory,
  ExpertLevel
} from '../services/expertValidationService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface ExpertValidationState {
  expertProfile: ExpertProfile | null;
  validationRequests: ValidationRequest[];
  validationResults: ValidationResult[];
  availableExperts: ExpertProfile[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface ExpertValidationActions {
  registerExpert: (profileData: Omit<ExpertProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<ExpertProfile>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<ExpertProfile>;
  createValidationRequest: (data: CreateValidationRequestData) => Promise<ValidationRequest>;
  assignValidationRequest: (requestId: string, expertUserId: string) => Promise<ValidationRequest>;
  submitValidationResult: (data: SubmitValidationResultData) => Promise<ValidationResult>;
  getValidationRequests: (status?: ValidationStatus) => Promise<ValidationRequest[]>;
  getValidationResults: (requestId: string) => Promise<ValidationResult[]>;
  getPresetValidationSummary: (presetId: string) => Promise<any>;
  getAvailableExperts: (category?: ValidationCategory, minLevel?: ExpertLevel) => Promise<ExpertProfile[]>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseExpertValidationConfig {
  userId?: string;
  autoLoadProfile?: boolean;
  autoLoadRequests?: boolean;
}

const DEFAULT_CONFIG: Required<UseExpertValidationConfig> = {
  userId: 'anonymous-user',
  autoLoadProfile: true,
  autoLoadRequests: true,
};

// ============================================================================
// Main Hook
// ============================================================================

export function useExpertValidation(
  config: UseExpertValidationConfig = {}
): [ExpertValidationState, ExpertValidationActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<ExpertValidationState>({
    expertProfile: null,
    validationRequests: [],
    validationResults: [],
    availableExperts: [],
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

      if (finalConfig.autoLoadProfile) {
        promises.push(expertValidationService.getExpertProfile(finalConfig.userId));
      }

      if (finalConfig.autoLoadRequests) {
        promises.push(expertValidationService.getExpertValidationRequests(finalConfig.userId));
      }

      const results = await Promise.all(promises);
      
      setState(prev => ({
        ...prev,
        expertProfile: finalConfig.autoLoadProfile ? results[0] : null,
        validationRequests: finalConfig.autoLoadRequests ? (results[finalConfig.autoLoadProfile ? 1 : 0] || []) : [],
        loading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize expert validation data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig.userId, finalConfig.autoLoadProfile, finalConfig.autoLoadRequests]);

  // Register expert
  const registerExpert = useCallback(async (
    profileData: Omit<ExpertProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<ExpertProfile> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const expert = await expertValidationService.registerExpert(finalConfig.userId, profileData);
      
      setState(prev => ({
        ...prev,
        expertProfile: expert,
        loading: false,
      }));

      return expert;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register expert';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Update expert profile
  const updateExpertProfile = useCallback(async (
    updates: Partial<ExpertProfile>
  ): Promise<ExpertProfile> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const expert = await expertValidationService.updateExpertProfile(finalConfig.userId, updates);
      
      setState(prev => ({
        ...prev,
        expertProfile: expert,
        loading: false,
      }));

      return expert;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update expert profile';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Create validation request
  const createValidationRequest = useCallback(async (
    data: CreateValidationRequestData
  ): Promise<ValidationRequest> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const request = await expertValidationService.createValidationRequest(finalConfig.userId, data);
      
      setState(prev => ({
        ...prev,
        validationRequests: [request, ...prev.validationRequests],
        loading: false,
      }));

      return request;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create validation request';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Assign validation request
  const assignValidationRequest = useCallback(async (
    requestId: string,
    expertUserId: string
  ): Promise<ValidationRequest> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const request = await expertValidationService.assignValidationRequest(
        requestId,
        expertUserId,
        finalConfig.userId
      );
      
      setState(prev => ({
        ...prev,
        validationRequests: prev.validationRequests.map(r => 
          r.id === requestId ? request : r
        ),
        loading: false,
      }));

      return request;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign validation request';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Submit validation result
  const submitValidationResult = useCallback(async (
    data: SubmitValidationResultData
  ): Promise<ValidationResult> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await expertValidationService.submitValidationResult(finalConfig.userId, data);
      
      setState(prev => ({
        ...prev,
        validationResults: [result, ...prev.validationResults],
        validationRequests: prev.validationRequests.map(r => 
          r.id === data.requestId ? { ...r, status: data.status, updatedAt: new Date() } : r
        ),
        loading: false,
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit validation result';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get validation requests
  const getValidationRequests = useCallback(async (
    status?: ValidationStatus
  ): Promise<ValidationRequest[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const requests = await expertValidationService.getExpertValidationRequests(
        finalConfig.userId,
        status
      );
      
      setState(prev => ({
        ...prev,
        validationRequests: requests,
        loading: false,
      }));

      return requests;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get validation requests';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, [finalConfig.userId]);

  // Get validation results
  const getValidationResults = useCallback(async (
    requestId: string
  ): Promise<ValidationResult[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const results = await expertValidationService.getValidationResults(requestId);
      
      setState(prev => ({
        ...prev,
        validationResults: results,
        loading: false,
      }));

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get validation results';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, []);

  // Get preset validation summary
  const getPresetValidationSummary = useCallback(async (presetId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const summary = await expertValidationService.getPresetValidationSummary(presetId);
      
      setState(prev => ({ ...prev, loading: false }));

      return summary;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get preset validation summary';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  // Get available experts
  const getAvailableExperts = useCallback(async (
    category?: ValidationCategory,
    minLevel?: ExpertLevel
  ): Promise<ExpertProfile[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const experts = await expertValidationService.getAvailableExperts(category, minLevel);
      
      setState(prev => ({
        ...prev,
        availableExperts: experts,
        loading: false,
      }));

      return experts;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get available experts';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
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
  const actions: ExpertValidationActions = {
    registerExpert,
    updateExpertProfile,
    createValidationRequest,
    assignValidationRequest,
    submitValidationResult,
    getValidationRequests,
    getValidationResults,
    getPresetValidationSummary,
    getAvailableExperts,
    refreshData,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for expert profile management
 */
export function useExpertProfile(userId?: string) {
  const [state, actions] = useExpertValidation({ 
    userId, 
    autoLoadProfile: true, 
    autoLoadRequests: false 
  });

  return {
    profile: state.expertProfile,
    loading: state.loading,
    error: state.error,
    registerExpert: actions.registerExpert,
    updateProfile: actions.updateExpertProfile,
    refresh: actions.refreshData,
  };
}

/**
 * Hook for validation requests management
 */
export function useValidationRequests(userId?: string) {
  const [state, actions] = useExpertValidation({ 
    userId, 
    autoLoadProfile: false, 
    autoLoadRequests: true 
  });

  return {
    requests: state.validationRequests,
    loading: state.loading,
    error: state.error,
    createRequest: actions.createValidationRequest,
    assignRequest: actions.assignValidationRequest,
    getRequests: actions.getValidationRequests,
    refresh: actions.refreshData,
  };
}

/**
 * Hook for validation results management
 */
export function useValidationResults(requestId?: string) {
  const [state, actions] = useExpertValidation({ autoLoadProfile: false, autoLoadRequests: false });

  useEffect(() => {
    if (requestId) {
      actions.getValidationResults(requestId);
    }
  }, [requestId, actions]);

  return {
    results: state.validationResults,
    loading: state.loading,
    error: state.error,
    submitResult: actions.submitValidationResult,
    refresh: () => requestId ? actions.getValidationResults(requestId) : Promise.resolve([]),
  };
}

/**
 * Hook for preset validation summary
 */
export function usePresetValidation(presetId: string) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await expertValidationService.getPresetValidationSummary(presetId);
      setSummary(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load validation summary';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [presetId]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return {
    summary,
    loading,
    error,
    refresh: loadSummary,
  };
}
