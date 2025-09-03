/**
 * Team Parameter Library Hook
 * React hook for team parameter library functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  teamParameterLibraryService,
  TeamParameterPreset,
  CreateTeamPresetRequest,
  UpdateTeamPresetRequest,
  SearchTeamPresetsRequest,
  PresetComment,
  PresetRating
} from '../services/teamParameterLibraryService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface TeamParameterLibraryState {
  presets: TeamParameterPreset[];
  currentPreset: TeamParameterPreset | null;
  comments: PresetComment[];
  searchResults: {
    presets: TeamParameterPreset[];
    total: number;
  };
  loading: boolean;
  error: string | null;
  lastSearch: SearchTeamPresetsRequest | null;
}

export interface TeamParameterLibraryActions {
  createPreset: (request: CreateTeamPresetRequest) => Promise<TeamParameterPreset>;
  getPreset: (teamId: string, presetId: string) => Promise<TeamParameterPreset | null>;
  updatePreset: (request: UpdateTeamPresetRequest) => Promise<TeamParameterPreset>;
  deletePreset: (teamId: string, presetId: string) => Promise<boolean>;
  searchPresets: (request: SearchTeamPresetsRequest) => Promise<{ presets: TeamParameterPreset[]; total: number }>;
  ratePreset: (teamId: string, presetId: string, rating: number) => Promise<PresetRating>;
  addComment: (teamId: string, presetId: string, content: string, parentId?: string) => Promise<PresetComment>;
  getComments: (teamId: string, presetId: string) => Promise<PresetComment[]>;
  trackUsage: (teamId: string, presetId: string, executionTime?: number, success?: boolean) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseTeamParameterLibraryConfig {
  userId?: string;
  teamId?: string;
  autoLoadPresets?: boolean;
  defaultSearchParams?: Partial<SearchTeamPresetsRequest>;
}

const DEFAULT_CONFIG: Required<UseTeamParameterLibraryConfig> = {
  userId: 'anonymous-user',
  teamId: '',
  autoLoadPresets: true,
  defaultSearchParams: {
    sortBy: 'updated',
    sortOrder: 'desc',
    limit: 20,
  },
};

// ============================================================================
// Main Hook
// ============================================================================

export function useTeamParameterLibrary(
  config: UseTeamParameterLibraryConfig = {}
): [TeamParameterLibraryState, TeamParameterLibraryActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<TeamParameterLibraryState>({
    presets: [],
    currentPreset: null,
    comments: [],
    searchResults: { presets: [], total: 0 },
    loading: false,
    error: null,
    lastSearch: null,
  });

  // Auto-load presets
  useEffect(() => {
    if (finalConfig.autoLoadPresets && finalConfig.teamId) {
      searchPresets({
        teamId: finalConfig.teamId,
        ...finalConfig.defaultSearchParams,
      });
    }
  }, [finalConfig.autoLoadPresets, finalConfig.teamId]);

  // Create preset
  const createPreset = useCallback(async (
    request: CreateTeamPresetRequest
  ): Promise<TeamParameterPreset> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const preset = await teamParameterLibraryService.createTeamPreset(
        finalConfig.userId,
        request
      );

      setState(prev => ({
        ...prev,
        presets: [preset, ...prev.presets],
        searchResults: {
          presets: [preset, ...prev.searchResults.presets],
          total: prev.searchResults.total + 1,
        },
        loading: false,
      }));

      return preset;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create preset';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get preset
  const getPreset = useCallback(async (
    teamId: string,
    presetId: string
  ): Promise<TeamParameterPreset | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const preset = await teamParameterLibraryService.getTeamPreset(
        finalConfig.userId,
        teamId,
        presetId
      );

      setState(prev => ({
        ...prev,
        currentPreset: preset,
        loading: false,
      }));

      return preset;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get preset';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [finalConfig.userId]);

  // Update preset
  const updatePreset = useCallback(async (
    request: UpdateTeamPresetRequest
  ): Promise<TeamParameterPreset> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const updatedPreset = await teamParameterLibraryService.updateTeamPreset(
        finalConfig.userId,
        request
      );

      setState(prev => ({
        ...prev,
        presets: prev.presets.map(p => p.id === request.presetId ? updatedPreset : p),
        searchResults: {
          ...prev.searchResults,
          presets: prev.searchResults.presets.map(p => 
            p.id === request.presetId ? updatedPreset : p
          ),
        },
        currentPreset: prev.currentPreset?.id === request.presetId ? updatedPreset : prev.currentPreset,
        loading: false,
      }));

      return updatedPreset;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preset';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Delete preset
  const deletePreset = useCallback(async (
    teamId: string,
    presetId: string
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const success = await teamParameterLibraryService.deleteTeamPreset(
        finalConfig.userId,
        teamId,
        presetId
      );

      if (success) {
        setState(prev => ({
          ...prev,
          presets: prev.presets.filter(p => p.id !== presetId),
          searchResults: {
            ...prev.searchResults,
            presets: prev.searchResults.presets.filter(p => p.id !== presetId),
            total: Math.max(0, prev.searchResults.total - 1),
          },
          currentPreset: prev.currentPreset?.id === presetId ? null : prev.currentPreset,
          loading: false,
        }));
      }

      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete preset';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Search presets
  const searchPresets = useCallback(async (
    request: SearchTeamPresetsRequest
  ): Promise<{ presets: TeamParameterPreset[]; total: number }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const results = await teamParameterLibraryService.searchTeamPresets(
        finalConfig.userId,
        request
      );

      setState(prev => ({
        ...prev,
        searchResults: results,
        presets: request.offset === 0 ? results.presets : [...prev.presets, ...results.presets],
        lastSearch: request,
        loading: false,
      }));

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search presets';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { presets: [], total: 0 };
    }
  }, [finalConfig.userId]);

  // Rate preset
  const ratePreset = useCallback(async (
    teamId: string,
    presetId: string,
    rating: number
  ): Promise<PresetRating> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const presetRating = await teamParameterLibraryService.ratePreset(
        finalConfig.userId,
        teamId,
        presetId,
        rating
      );

      // Update preset rating in state
      setState(prev => ({
        ...prev,
        presets: prev.presets.map(p => 
          p.id === presetId ? { ...p, rating: presetRating } : p
        ),
        searchResults: {
          ...prev.searchResults,
          presets: prev.searchResults.presets.map(p => 
            p.id === presetId ? { ...p, rating: presetRating } : p
          ),
        },
        currentPreset: prev.currentPreset?.id === presetId 
          ? { ...prev.currentPreset, rating: presetRating }
          : prev.currentPreset,
        loading: false,
      }));

      return presetRating;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to rate preset';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Add comment
  const addComment = useCallback(async (
    teamId: string,
    presetId: string,
    content: string,
    parentId?: string
  ): Promise<PresetComment> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const comment = await teamParameterLibraryService.addComment(
        finalConfig.userId,
        teamId,
        presetId,
        content,
        parentId
      );

      setState(prev => ({
        ...prev,
        comments: [comment, ...prev.comments],
        loading: false,
      }));

      return comment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get comments
  const getComments = useCallback(async (
    teamId: string,
    presetId: string
  ): Promise<PresetComment[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const comments = await teamParameterLibraryService.getPresetComments(
        finalConfig.userId,
        teamId,
        presetId
      );

      setState(prev => ({
        ...prev,
        comments,
        loading: false,
      }));

      return comments;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get comments';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, [finalConfig.userId]);

  // Track usage
  const trackUsage = useCallback(async (
    teamId: string,
    presetId: string,
    executionTime?: number,
    success?: boolean
  ): Promise<void> => {
    try {
      await teamParameterLibraryService.trackPresetUsage(
        finalConfig.userId,
        teamId,
        presetId,
        executionTime,
        success
      );
    } catch (error) {
      // Silently ignore tracking errors
      console.warn('Failed to track preset usage:', error);
    }
  }, [finalConfig.userId]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Refresh
  const refresh = useCallback(async (): Promise<void> => {
    if (state.lastSearch) {
      await searchPresets(state.lastSearch);
    } else if (finalConfig.teamId) {
      await searchPresets({
        teamId: finalConfig.teamId,
        ...finalConfig.defaultSearchParams,
      });
    }
  }, [state.lastSearch, finalConfig.teamId, finalConfig.defaultSearchParams, searchPresets]);

  // Actions object
  const actions: TeamParameterLibraryActions = {
    createPreset,
    getPreset,
    updatePreset,
    deletePreset,
    searchPresets,
    ratePreset,
    addComment,
    getComments,
    trackUsage,
    clearError,
    refresh,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for specific team preset
 */
export function useTeamPreset(
  teamId: string,
  presetId: string,
  userId?: string
) {
  const [state, actions] = useTeamParameterLibrary({ userId, teamId });

  useEffect(() => {
    if (presetId && presetId !== state.currentPreset?.id) {
      actions.getPreset(teamId, presetId);
      actions.getComments(teamId, presetId);
    }
  }, [teamId, presetId, state.currentPreset?.id, actions]);

  return {
    preset: state.currentPreset,
    comments: state.comments,
    loading: state.loading,
    error: state.error,
    updatePreset: (updates: Omit<UpdateTeamPresetRequest, 'presetId'>) =>
      actions.updatePreset({ ...updates, presetId }),
    deletePreset: () => actions.deletePreset(teamId, presetId),
    ratePreset: (rating: number) => actions.ratePreset(teamId, presetId, rating),
    addComment: (content: string, parentId?: string) =>
      actions.addComment(teamId, presetId, content, parentId),
    trackUsage: (executionTime?: number, success?: boolean) =>
      actions.trackUsage(teamId, presetId, executionTime, success),
  };
}

/**
 * Hook for team preset search
 */
export function useTeamPresetSearch(
  teamId: string,
  initialSearch?: Partial<SearchTeamPresetsRequest>,
  userId?: string
) {
  const [state, actions] = useTeamParameterLibrary({ 
    userId, 
    teamId, 
    autoLoadPresets: false 
  });

  const search = useCallback((searchParams: Partial<SearchTeamPresetsRequest>) => {
    return actions.searchPresets({
      teamId,
      ...searchParams,
    });
  }, [actions, teamId]);

  useEffect(() => {
    if (initialSearch) {
      search(initialSearch);
    }
  }, [search, initialSearch]);

  return {
    results: state.searchResults,
    loading: state.loading,
    error: state.error,
    search,
    loadMore: (offset: number) => search({ ...state.lastSearch, offset }),
  };
}
