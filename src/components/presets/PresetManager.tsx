/**
 * PresetManager Component
 * Main interface for managing calculator presets
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { usePresets } from '../../hooks/usePresets';
import { Preset, PresetParameters } from '../../types/preset';
import { PresetDropdown } from './PresetDropdown';
import { PresetForm } from './PresetForm';
import { PresetList } from './PresetList';

export interface PresetManagerProps<T extends PresetParameters = PresetParameters> {
  calculatorType: string;
  currentParameters: T;
  onPresetLoad: (preset: Preset<T>) => void;
  onParametersChange: (parameters: T) => void;
  className?: string;
  compact?: boolean;
  showAdvanced?: boolean;
}

export function PresetManager<T extends PresetParameters = PresetParameters>({
  calculatorType,
  currentParameters,
  onPresetLoad,
  onParametersChange,
  className = '',
  compact = false,
  showAdvanced = false,
}: PresetManagerProps<T>) {
  const { theme } = useTheme();
  const [presetsState, presetActions] = usePresets<T>({ calculatorType });
  
  // UI state
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset<T> | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Get presets for current calculator
  const calculatorPresets = presetActions.getPresetsByCalculator(calculatorType);

  // Handle preset selection
  const handlePresetSelect = useCallback((presetId: string | null) => {
    setSelectedPresetId(presetId);
    if (presetId) {
      const preset = presetActions.getPreset(presetId);
      if (preset) {
        onPresetLoad(preset);
      }
    }
  }, [presetActions, onPresetLoad]);

  // Handle saving current parameters as new preset
  const handleSaveAsNew = useCallback(() => {
    setEditingPreset(null);
    setShowForm(true);
  }, []);

  // Handle editing existing preset
  const handleEditPreset = useCallback((preset: Preset<T>) => {
    setEditingPreset(preset);
    setShowForm(true);
  }, []);

  // Handle preset form submission
  const handlePresetSave = useCallback(async (presetData: Omit<Preset<T>, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingPreset) {
        // Update existing preset
        const result = await presetActions.updatePreset(editingPreset.id, presetData);
        if (result.success) {
          setShowForm(false);
          setEditingPreset(null);
        }
      } else {
        // Create new preset
        const result = await presetActions.createPreset(presetData);
        if (result.success && result.data) {
          setShowForm(false);
          setSelectedPresetId(result.data.id);
        }
      }
    } catch (error) {
      console.error('Failed to save preset:', error);
    }
  }, [editingPreset, presetActions]);

  // Handle preset deletion
  const handlePresetDelete = useCallback(async (presetId: string) => {
    try {
      const result = await presetActions.deletePreset(presetId);
      if (result.success) {
        if (selectedPresetId === presetId) {
          setSelectedPresetId(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete preset:', error);
    }
  }, [presetActions, selectedPresetId]);

  // Compact view for calculator interfaces
  if (compact) {
    return (
      <div className={`preset-manager-compact ${className}`}>
        <div className="flex items-center space-x-2">
          <PresetDropdown
            presets={calculatorPresets}
            selectedPresetId={selectedPresetId}
            onPresetSelect={handlePresetSelect}
            placeholder="Load preset..."
            className="flex-1"
          />
          <button
            onClick={handleSaveAsNew}
            className="px-3 py-2 text-sm font-medium rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--color-primary-600)',
              color: 'white',
            }}
            title="Save current parameters as preset"
          >
            Save
          </button>
          {showAdvanced && (
            <button
              onClick={() => setShowList(true)}
              className="px-3 py-2 text-sm font-medium rounded-md border transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-primary-600)',
                borderColor: 'var(--color-primary-600)',
              }}
              title="Manage presets"
            >
              Manage
            </button>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <PresetForm
            calculatorType={calculatorType}
            initialData={editingPreset || {
              name: '',
              description: '',
              calculatorType,
              version: '1.0.0',
              parameters: currentParameters,
            }}
            onSave={handlePresetSave}
            onCancel={() => {
              setShowForm(false);
              setEditingPreset(null);
            }}
            isEditing={!!editingPreset}
          />
        )}

        {/* List Modal */}
        {showList && (
          <PresetList
            calculatorType={calculatorType}
            selectedPresetId={selectedPresetId}
            onPresetSelect={handlePresetSelect}
            onPresetEdit={handleEditPreset}
            onPresetDelete={handlePresetDelete}
            onClose={() => setShowList(false)}
          />
        )}
      </div>
    );
  }

  // Full view for dedicated preset management pages
  return (
    <div 
      className={`preset-manager ${className}`}
      style={{
        backgroundColor: 'var(--color-neutral-50)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--color-neutral-200)',
        padding: 'var(--spacing-lg)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-xl font-semibold"
            style={{ color: 'var(--color-neutral-900)' }}
          >
            Preset Manager
          </h2>
          <p 
            className="text-sm mt-1"
            style={{ color: 'var(--color-neutral-600)' }}
          >
            Save and manage your calculator configurations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <PresetDropdown
            presets={calculatorPresets}
            selectedPresetId={selectedPresetId}
            onPresetSelect={handlePresetSelect}
            placeholder="Select preset..."
            className="min-w-48"
          />
          <button
            onClick={handleSaveAsNew}
            className="px-4 py-2 font-medium rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--color-primary-600)',
              color: 'white',
            }}
          >
            Save New Preset
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Parameters */}
        <div 
          className="lg:col-span-1 p-4 rounded-md"
          style={{
            backgroundColor: 'var(--color-neutral-100)',
            border: '1px solid var(--color-neutral-200)',
          }}
        >
          <h3 
            className="font-medium mb-3"
            style={{ color: 'var(--color-neutral-800)' }}
          >
            Current Parameters
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(currentParameters).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span style={{ color: 'var(--color-neutral-600)' }}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </span>
                <span style={{ color: 'var(--color-neutral-800)' }}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preset List */}
        <div className="lg:col-span-2">
          <PresetList
            calculatorType={calculatorType}
            selectedPresetId={selectedPresetId}
            onPresetSelect={handlePresetSelect}
            onPresetEdit={handleEditPreset}
            onPresetDelete={handlePresetDelete}
            embedded={true}
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <PresetForm
          calculatorType={calculatorType}
          initialData={editingPreset || {
            name: '',
            description: '',
            calculatorType,
            version: '1.0.0',
            parameters: currentParameters,
          }}
          onSave={handlePresetSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPreset(null);
          }}
          isEditing={!!editingPreset}
        />
      )}
    </div>
  );
}
