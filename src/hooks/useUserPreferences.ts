/**
 * User Preferences Hook
 * React hook for managing user preferences and settings
 */

import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, NotificationSettings, PrivacySettings } from '../types/memory';
import { userPreferencesService, PreferenceCategory } from '../services/userPreferencesService';

export interface UseUserPreferencesState {
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface UseUserPreferencesActions {
  updatePreference: <T = any>(key: keyof UserPreferences, value: T) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  resetCategory: (category: PreferenceCategory) => Promise<void>;
  addFavoriteCalculator: (calculatorType: string) => Promise<void>;
  removeFavoriteCalculator: (calculatorType: string) => Promise<void>;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => Promise<void>;
  exportPreferences: () => string;
  importPreferences: (jsonData: string) => Promise<void>;
  saveToStorage: () => Promise<void>;
}

/**
 * Hook for managing user preferences
 */
export function useUserPreferences(): [UseUserPreferencesState, UseUserPreferencesActions] {
  const [state, setState] = useState<UseUserPreferencesState>({
    preferences: userPreferencesService.getPreferences(),
    loading: false,
    error: null,
    isInitialized: false,
  });

  // Initialize and subscribe to preference changes
  useEffect(() => {
    let mounted = true;

    const initializePreferences = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Service should already be initialized, but ensure it's ready
        await userPreferencesService.initialize();
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            preferences: userPreferencesService.getPreferences(),
            loading: false,
            isInitialized: true,
          }));
        }
      } catch (error) {
        if (mounted) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to initialize preferences';
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
        }
      }
    };

    // Subscribe to preference changes
    const unsubscribe = userPreferencesService.subscribe((preferences) => {
      if (mounted) {
        setState(prev => ({
          ...prev,
          preferences,
          error: null,
        }));
      }
    });

    initializePreferences();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Update a single preference
  const updatePreference = useCallback(async <T = any>(
    key: keyof UserPreferences, 
    value: T
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.setPreference(key, value);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preference';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Update multiple preferences
  const updatePreferences = useCallback(async (
    updates: Partial<UserPreferences>
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.updatePreferences(updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Reset all preferences
  const resetPreferences = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.resetPreferences();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset preferences';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Reset preferences by category
  const resetCategory = useCallback(async (category: PreferenceCategory): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.resetCategory(category);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to reset ${category} preferences`;
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Add favorite calculator
  const addFavoriteCalculator = useCallback(async (calculatorType: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.addFavoriteCalculator(calculatorType);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add favorite calculator';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Remove favorite calculator
  const removeFavoriteCalculator = useCallback(async (calculatorType: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.removeFavoriteCalculator(calculatorType);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove favorite calculator';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Update notification settings
  const updateNotificationSettings = useCallback(async (
    updates: Partial<NotificationSettings>
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.updateNotificationSettings(updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update notification settings';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Update privacy settings
  const updatePrivacySettings = useCallback(async (
    updates: Partial<PrivacySettings>
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.updatePrivacySettings(updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update privacy settings';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Export preferences
  const exportPreferences = useCallback((): string => {
    return userPreferencesService.exportPreferences();
  }, []);

  // Import preferences
  const importPreferences = useCallback(async (jsonData: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.importPreferences(jsonData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import preferences';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Save to storage
  const saveToStorage = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await userPreferencesService.saveToStorage();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save preferences';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Actions object
  const actions: UseUserPreferencesActions = {
    updatePreference,
    updatePreferences,
    resetPreferences,
    resetCategory,
    addFavoriteCalculator,
    removeFavoriteCalculator,
    updateNotificationSettings,
    updatePrivacySettings,
    exportPreferences,
    importPreferences,
    saveToStorage,
  };

  return [state, actions];
}

/**
 * Hook for accessing specific preference values with type safety
 */
export function usePreference<T = any>(key: keyof UserPreferences): [T, (value: T) => Promise<void>] {
  const [state, actions] = useUserPreferences();
  
  const value = state.preferences[key] as T;
  const setValue = useCallback(async (newValue: T) => {
    await actions.updatePreference(key, newValue);
  }, [actions, key]);

  return [value, setValue];
}

/**
 * Hook for managing favorite calculators
 */
export function useFavoriteCalculators(): {
  favorites: string[];
  isFavorite: (calculatorType: string) => boolean;
  addFavorite: (calculatorType: string) => Promise<void>;
  removeFavorite: (calculatorType: string) => Promise<void>;
  toggleFavorite: (calculatorType: string) => Promise<void>;
} {
  const [state, actions] = useUserPreferences();
  
  const favorites = state.preferences.favoriteCalculators;
  
  const isFavorite = useCallback((calculatorType: string): boolean => {
    return userPreferencesService.isFavoriteCalculator(calculatorType);
  }, []);

  const toggleFavorite = useCallback(async (calculatorType: string): Promise<void> => {
    if (isFavorite(calculatorType)) {
      await actions.removeFavoriteCalculator(calculatorType);
    } else {
      await actions.addFavoriteCalculator(calculatorType);
    }
  }, [isFavorite, actions]);

  return {
    favorites,
    isFavorite,
    addFavorite: actions.addFavoriteCalculator,
    removeFavorite: actions.removeFavoriteCalculator,
    toggleFavorite,
  };
}

/**
 * Hook for managing notification settings
 */
export function useNotificationSettings(): [
  NotificationSettings,
  (updates: Partial<NotificationSettings>) => Promise<void>
] {
  const [state, actions] = useUserPreferences();
  
  return [
    state.preferences.notificationSettings,
    actions.updateNotificationSettings,
  ];
}

/**
 * Hook for managing privacy settings
 */
export function usePrivacySettings(): [
  PrivacySettings,
  (updates: Partial<PrivacySettings>) => Promise<void>
] {
  const [state, actions] = useUserPreferences();
  
  return [
    state.preferences.privacySettings,
    actions.updatePrivacySettings,
  ];
}
