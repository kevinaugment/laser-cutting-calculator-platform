/**
 * Parameter Preset Panel Component
 * Manages parameter presets with create, edit, and organize functionality
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { ParameterPreset, PresetCategory } from '../../types/memory';
import { useParameterPresets } from '../../hooks/useParameterPresets';
import { formatDate, formatParameterValue } from '../../utils/formatters';

export interface ParameterPresetPanelProps {
  calculatorType?: string;
  onPresetSelect?: (preset: ParameterPreset) => void;
  onPresetApply?: (parameters: Record<string, any>) => void;
  className?: string;
}

export function ParameterPresetPanel({
  calculatorType,
  onPresetSelect,
  onPresetApply,
  className = '',
}: ParameterPresetPanelProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPreset, setEditingPreset] = useState<ParameterPreset | null>(null);

  // Use parameter presets hook
  const [state, actions] = useParameterPresets({
    autoLoad: true,
    pageSize: 20,
    enableStats: true,
    calculatorType,
  });

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    category: 'custom' as PresetCategory,
    tags: '',
  });

  // Handle search
  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      await actions.search(term);
    } else {
      await actions.loadPresets();
    }
  }, [actions]);

  // Handle preset selection
  const handlePresetClick = useCallback((preset: ParameterPreset) => {
    setSelectedPreset(preset.id);
    onPresetSelect?.(preset);
  }, [onPresetSelect]);

  // Handle preset application
  const handleApplyPreset = useCallback(async (preset: ParameterPreset) => {
    await actions.usePreset(preset.id);
    onPresetApply?.(preset.parameters);
  }, [actions, onPresetApply]);

  // Handle preset creation
  const handleCreatePreset = useCallback(async (parameters: Record<string, any>) => {
    if (!createForm.name.trim() || !calculatorType) return;

    try {
      await actions.createPreset(
        createForm.name,
        createForm.description,
        calculatorType,
        parameters,
        {
          category: createForm.category,
          tags: createForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }
      );

      // Reset form
      setCreateForm({
        name: '',
        description: '',
        category: 'custom',
        tags: '',
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create preset:', error);
    }
  }, [actions, createForm, calculatorType]);

  // Handle preset deletion
  const handleDeletePreset = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      await actions.deletePreset(id);
    }
  }, [actions]);

  // Handle preset duplication
  const handleDuplicatePreset = useCallback(async (id: string) => {
    const newName = prompt('Enter name for the duplicated preset:');
    if (newName) {
      await actions.duplicatePreset(id, newName);
    }
  }, [actions]);

  // Handle preset rating
  const handleRatePreset = useCallback(async (id: string, rating: number) => {
    await actions.ratePreset(id, rating);
  }, [actions]);

  // Get key parameters for preview
  const getKeyParameters = (preset: ParameterPreset): Array<{ key: string; value: any }> => {
    const params = Object.entries(preset.parameters);
    return params.slice(0, 3).map(([key, value]) => ({ key, value }));
  };

  // Render star rating
  const renderStarRating = (preset: ParameterPreset) => {
    const rating = preset.usageStats.averageRating;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleRatePreset(preset.id, i)}
          className={`text-sm ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500`}
        >
          ★
        </button>
      );
    }
    
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className={`parameter-preset-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Parameter Presets
              </h3>
              <p className="text-sm text-gray-600">
                {state.total} preset{state.total !== 1 ? 's' : ''} available
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              {showCreateForm ? 'Cancel' : 'Create Preset'}
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search presets..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="border-b p-4 bg-gray-50">
            <h4 className="text-md font-medium text-gray-900 mb-3">Create New Preset</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter preset name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter preset description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value as PresetCategory }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="custom">Custom</option>
                    <option value="standard">Standard</option>
                    <option value="material-specific">Material Specific</option>
                    <option value="project-type">Project Type</option>
                    <option value="quality-focused">Quality Focused</option>
                    <option value="speed-optimized">Speed Optimized</option>
                    <option value="cost-effective">Cost Effective</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={createForm.tags}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="steel, thick, precision"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreatePreset({})} // This would need current calculator parameters
                  disabled={!createForm.name.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Save Preset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {state.loading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading presets...</p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm">{state.error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!state.loading && state.presets.length === 0 && (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No presets yet</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No presets match your search.' : 'Create your first parameter preset to get started.'}
            </p>
          </div>
        )}

        {/* Presets List */}
        {!state.loading && state.presets.length > 0 && (
          <div className="divide-y divide-gray-200">
            {state.presets.map((preset) => (
              <div
                key={preset.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedPreset === preset.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                }`}
                onClick={() => handlePresetClick(preset)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Preset Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {preset.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        preset.category === 'standard' ? 'bg-blue-100 text-blue-700' :
                        preset.category === 'custom' ? 'bg-gray-100 text-gray-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {preset.category}
                      </span>
                    </div>

                    {/* Description */}
                    {preset.description && (
                      <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                    )}

                    {/* Key Parameters */}
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-2">
                        {getKeyParameters(preset).map(({ key, value }) => (
                          <span key={key} className="text-xs text-gray-600">
                            <span className="font-medium">{key}:</span> {formatParameterValue(value)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    {preset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {preset.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats and Rating */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDate(preset.createdAt)}</span>
                      <span>{preset.usageStats.totalUses} uses</span>
                      {preset.usageStats.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <span>{preset.usageStats.averageRating.toFixed(1)}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyPreset(preset);
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded"
                      title="Apply preset"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicatePreset(preset.id);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      title="Duplicate preset"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(preset.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete preset"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Rating Section */}
                {selectedPreset === preset.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Rate this preset:</span>
                      {renderStarRating(preset)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {state.hasMore && !state.loading && (
          <div className="p-4 border-t">
            <button
              onClick={actions.loadMore}
              className="w-full px-4 py-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
