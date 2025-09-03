/**
 * useCalculatorPresets Hook
 * Specialized hook for managing presets in calculator components
 */

import { useState, useEffect, useCallback } from 'react';
import { usePresets } from './usePresets';
import { Preset, PresetParameters } from '../types/preset';

export interface UseCalculatorPresetsOptions<T extends PresetParameters = PresetParameters> {
  calculatorType: string;
  initialParameters: T;
  onParametersChange?: (parameters: T) => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export interface UseCalculatorPresetsReturn<T extends PresetParameters = PresetParameters> {
  // Current state
  currentParameters: T;
  selectedPresetId: string | null;
  hasUnsavedChanges: boolean;
  
  // Preset operations
  loadPreset: (presetId: string) => Promise<boolean>;
  saveCurrentAsPreset: (name: string, description?: string, tags?: string[]) => Promise<boolean>;
  updateCurrentPreset: () => Promise<boolean>;
  clearSelection: () => void;
  
  // Parameter management
  updateParameter: <K extends keyof T>(key: K, value: T[K]) => void;
  updateParameters: (parameters: Partial<T>) => void;
  resetToDefaults: () => void;
  
  // Preset data
  availablePresets: Preset<T>[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing calculator presets with automatic parameter tracking
 */
export function useCalculatorPresets<T extends PresetParameters = PresetParameters>({
  calculatorType,
  initialParameters,
  onParametersChange,
  autoSave = false,
  autoSaveDelay = 2000,
}: UseCalculatorPresetsOptions<T>): UseCalculatorPresetsReturn<T> {
  const [presetsState, presetActions] = usePresets<T>({ calculatorType });
  
  // Local state
  const [currentParameters, setCurrentParameters] = useState<T>(initialParameters);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Get available presets for this calculator
  const availablePresets = presetActions.getPresetsByCalculator(calculatorType);

  // Update parameters and track changes
  const updateParameter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setCurrentParameters(prev => {
      const newParameters = { ...prev, [key]: value };
      
      // Check if this creates unsaved changes
      if (selectedPresetId) {
        const selectedPreset = presetActions.getPreset(selectedPresetId);
        if (selectedPreset) {
          const hasChanges = JSON.stringify(newParameters) !== JSON.stringify(selectedPreset.parameters);
          setHasUnsavedChanges(hasChanges);
        }
      } else {
        setHasUnsavedChanges(true);
      }
      
      // Notify parent component
      onParametersChange?.(newParameters);
      
      return newParameters;
    });
  }, [selectedPresetId, presetActions, onParametersChange]);

  // Update multiple parameters at once
  const updateParameters = useCallback((parameters: Partial<T>) => {
    setCurrentParameters(prev => {
      const newParameters = { ...prev, ...parameters };
      
      // Check if this creates unsaved changes
      if (selectedPresetId) {
        const selectedPreset = presetActions.getPreset(selectedPresetId);
        if (selectedPreset) {
          const hasChanges = JSON.stringify(newParameters) !== JSON.stringify(selectedPreset.parameters);
          setHasUnsavedChanges(hasChanges);
        }
      } else {
        setHasUnsavedChanges(true);
      }
      
      // Notify parent component
      onParametersChange?.(newParameters);
      
      return newParameters;
    });
  }, [selectedPresetId, presetActions, onParametersChange]);

  // Load a preset
  const loadPreset = useCallback(async (presetId: string): Promise<boolean> => {
    try {
      const preset = presetActions.getPreset(presetId);
      if (!preset) {
        return false;
      }

      setCurrentParameters(preset.parameters);
      setSelectedPresetId(presetId);
      setHasUnsavedChanges(false);
      
      // Clear any pending auto-save
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
        setAutoSaveTimeout(null);
      }
      
      // Notify parent component
      onParametersChange?.(preset.parameters);
      
      return true;
    } catch (error) {
      console.error('Failed to load preset:', error);
      return false;
    }
  }, [presetActions, onParametersChange, autoSaveTimeout]);

  // Save current parameters as a new preset
  const saveCurrentAsPreset = useCallback(async (
    name: string, 
    description?: string, 
    tags?: string[]
  ): Promise<boolean> => {
    try {
      const result = await presetActions.createPreset({
        name,
        description,
        calculatorType,
        version: '1.0.0',
        parameters: currentParameters,
        tags,
      });

      if (result.success && result.data) {
        setSelectedPresetId(result.data.id);
        setHasUnsavedChanges(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to save preset:', error);
      return false;
    }
  }, [presetActions, calculatorType, currentParameters]);

  // Update the currently selected preset
  const updateCurrentPreset = useCallback(async (): Promise<boolean> => {
    if (!selectedPresetId) {
      return false;
    }

    try {
      const result = await presetActions.updatePreset(selectedPresetId, {
        parameters: currentParameters,
      });

      if (result.success) {
        setHasUnsavedChanges(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update preset:', error);
      return false;
    }
  }, [selectedPresetId, presetActions, currentParameters]);

  // Clear preset selection
  const clearSelection = useCallback(() => {
    setSelectedPresetId(null);
    setHasUnsavedChanges(false);
    
    // Clear any pending auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
  }, [autoSaveTimeout]);

  // Reset to default parameters
  const resetToDefaults = useCallback(() => {
    setCurrentParameters(initialParameters);
    setSelectedPresetId(null);
    setHasUnsavedChanges(false);
    
    // Clear any pending auto-save
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
      setAutoSaveTimeout(null);
    }
    
    // Notify parent component
    onParametersChange?.(initialParameters);
  }, [initialParameters, onParametersChange, autoSaveTimeout]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !selectedPresetId || !hasUnsavedChanges) {
      return;
    }

    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      updateCurrentPreset();
    }, autoSaveDelay);

    setAutoSaveTimeout(timeout);

    // Cleanup on unmount
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [autoSave, selectedPresetId, hasUnsavedChanges, autoSaveDelay, updateCurrentPreset, autoSaveTimeout]);

  // Update current parameters when initial parameters change
  useEffect(() => {
    if (!selectedPresetId) {
      setCurrentParameters(initialParameters);
      onParametersChange?.(initialParameters);
    }
  }, [initialParameters, selectedPresetId, onParametersChange]);

  return {
    // Current state
    currentParameters,
    selectedPresetId,
    hasUnsavedChanges,
    
    // Preset operations
    loadPreset,
    saveCurrentAsPreset,
    updateCurrentPreset,
    clearSelection,
    
    // Parameter management
    updateParameter,
    updateParameters,
    resetToDefaults,
    
    // Preset data
    availablePresets,
    isLoading: presetsState.loading,
    error: presetsState.error,
  };
}
