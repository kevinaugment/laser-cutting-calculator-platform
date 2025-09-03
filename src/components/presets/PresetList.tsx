/**
 * PresetList Component
 * List view for organizing and displaying saved presets
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../theme';
import { usePresets } from '../../hooks/usePresets';
import { Preset, PresetParameters, PresetSearchOptions } from '../../types/preset';

export interface PresetListProps<T extends PresetParameters = PresetParameters> {
  calculatorType: string;
  selectedPresetId: string | null;
  onPresetSelect: (presetId: string | null) => void;
  onPresetEdit: (preset: Preset<T>) => void;
  onPresetDelete: (presetId: string) => void;
  onClose?: () => void;
  embedded?: boolean;
  className?: string;
}

export function PresetList<T extends PresetParameters = PresetParameters>({
  calculatorType,
  selectedPresetId,
  onPresetSelect,
  onPresetEdit,
  onPresetDelete,
  onClose,
  embedded = false,
  className = '',
}: PresetListProps<T>) {
  const { theme } = useTheme();
  const [presetsState, presetActions] = usePresets<T>({ calculatorType });
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Search options
  const searchOptions: PresetSearchOptions = useMemo(() => ({
    query: searchQuery,
    calculatorType,
    sortBy,
    sortOrder,
  }), [searchQuery, calculatorType, sortBy, sortOrder]);

  // Get filtered and sorted presets
  const searchResult = presetActions.searchPresets(searchOptions);
  const presets = searchResult.presets as Preset<T>[];

  // Handle delete confirmation
  const handleDeleteClick = (presetId: string) => {
    setShowDeleteConfirm(presetId);
  };

  const handleDeleteConfirm = async (presetId: string) => {
    await onPresetDelete(presetId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Content component
  const ListContent = () => (
    <div className="preset-list-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 
            className="text-lg font-medium"
            style={{ color: 'var(--color-neutral-900)' }}
          >
            Saved Presets
          </h3>
          <p 
            className="text-sm mt-1"
            style={{ color: 'var(--color-neutral-600)' }}
          >
            {presets.length} preset{presets.length !== 1 ? 's' : ''} for {calculatorType}
          </p>
        </div>
        {!embedded && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-opacity-50 transition-colors"
            style={{ color: 'var(--color-neutral-500)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search presets..."
            className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: 'var(--color-neutral-50)',
              borderColor: 'var(--color-neutral-300)',
              color: 'var(--color-neutral-700)',
              focusRingColor: 'var(--color-primary-500)',
            }}
          />
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: 'var(--color-neutral-50)',
              borderColor: 'var(--color-neutral-300)',
              color: 'var(--color-neutral-700)',
              focusRingColor: 'var(--color-primary-500)',
            }}
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Date Created</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 text-sm rounded-md border transition-colors"
            style={{
              backgroundColor: 'var(--color-neutral-50)',
              borderColor: 'var(--color-neutral-300)',
              color: 'var(--color-neutral-700)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)';
            }}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preset List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {presets.length > 0 ? (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-3 rounded-md border transition-colors cursor-pointer"
              style={{
                backgroundColor: selectedPresetId === preset.id 
                  ? 'var(--color-primary-50)' 
                  : 'var(--color-neutral-50)',
                borderColor: selectedPresetId === preset.id 
                  ? 'var(--color-primary-200)' 
                  : 'var(--color-neutral-200)',
              }}
              onClick={() => onPresetSelect(preset.id)}
              onMouseEnter={(e) => {
                if (selectedPresetId !== preset.id) {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPresetId !== preset.id) {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)';
                }
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 
                    className="font-medium truncate"
                    style={{ 
                      color: selectedPresetId === preset.id 
                        ? 'var(--color-primary-800)' 
                        : 'var(--color-neutral-900)' 
                    }}
                  >
                    {preset.name}
                  </h4>
                  {preset.isDefault && (
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded"
                      style={{
                        backgroundColor: 'var(--color-success-100)',
                        color: 'var(--color-success-700)',
                      }}
                    >
                      Default
                    </span>
                  )}
                </div>
                {preset.description && (
                  <p 
                    className="text-sm mt-1 truncate"
                    style={{ color: 'var(--color-neutral-600)' }}
                  >
                    {preset.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span style={{ color: 'var(--color-neutral-500)' }}>
                    Modified: {formatDate(preset.updatedAt)}
                  </span>
                  {preset.tags && preset.tags.length > 0 && (
                    <div className="flex gap-1">
                      {preset.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded"
                          style={{
                            backgroundColor: 'var(--color-neutral-200)',
                            color: 'var(--color-neutral-600)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {preset.tags.length > 2 && (
                        <span style={{ color: 'var(--color-neutral-500)' }}>
                          +{preset.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 ml-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPresetEdit(preset);
                  }}
                  className="p-2 rounded-md hover:bg-opacity-50 transition-colors"
                  style={{ color: 'var(--color-neutral-500)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Edit preset"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(preset.id);
                  }}
                  className="p-2 rounded-md hover:bg-opacity-50 transition-colors"
                  style={{ color: 'var(--color-error-500)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-error-100)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Delete preset"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div 
            className="text-center py-8"
            style={{ color: 'var(--color-neutral-500)' }}
          >
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a1 1 0 011-1h6a1 1 0 011 1v2M7 7h10" />
            </svg>
            <p className="text-sm">
              {searchQuery ? 'No presets found matching your search' : 'No presets saved yet'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleDeleteCancel}
          />
          <div 
            className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"
            style={{
              backgroundColor: 'var(--color-neutral-50)',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            <h3 
              className="text-lg font-medium mb-2"
              style={{ color: 'var(--color-neutral-900)' }}
            >
              Delete Preset
            </h3>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--color-neutral-600)' }}
            >
              Are you sure you want to delete this preset? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium rounded-md border transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--color-neutral-300)',
                  color: 'var(--color-neutral-700)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--color-error-600)',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-error-700)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-error-600)';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render embedded or modal version
  if (embedded) {
    return (
      <div className={`preset-list-embedded ${className}`}>
        <ListContent />
      </div>
    );
  }

  // Modal version
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div 
        className={`relative w-full max-w-2xl max-h-[80vh] rounded-lg shadow-xl overflow-hidden ${className}`}
        style={{
          backgroundColor: 'var(--color-neutral-50)',
          border: '1px solid var(--color-neutral-200)',
        }}
      >
        <div className="p-6 overflow-y-auto max-h-full">
          <ListContent />
        </div>
      </div>
    </div>
  );
}
