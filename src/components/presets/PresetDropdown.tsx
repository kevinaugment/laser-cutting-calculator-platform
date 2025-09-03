/**
 * PresetDropdown Component
 * Dropdown selector for quick preset selection
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme';
import { Preset, PresetParameters } from '../../types/preset';

export interface PresetDropdownProps<T extends PresetParameters = PresetParameters> {
  presets: Preset<T>[];
  selectedPresetId: string | null;
  onPresetSelect: (presetId: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showClearOption?: boolean;
}

export function PresetDropdown<T extends PresetParameters = PresetParameters>({
  presets,
  selectedPresetId,
  onPresetSelect,
  placeholder = 'Select preset...',
  className = '',
  disabled = false,
  showClearOption = true,
}: PresetDropdownProps<T>) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected preset
  const selectedPreset = selectedPresetId 
    ? presets.find(p => p.id === selectedPresetId) 
    : null;

  // Filter presets based on search query
  const filteredPresets = presets.filter(preset =>
    preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (preset.description && preset.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle preset selection
  const handlePresetSelect = (presetId: string | null) => {
    onPresetSelect(presetId);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    } else if (event.key === 'Enter' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={`preset-dropdown relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: disabled ? 'var(--color-neutral-100)' : 'var(--color-neutral-50)',
          borderColor: isOpen ? 'var(--color-primary-500)' : 'var(--color-neutral-300)',
          color: disabled ? 'var(--color-neutral-400)' : 'var(--color-neutral-700)',
          focusRingColor: 'var(--color-primary-500)',
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select preset"
      >
        <span className="block truncate">
          {selectedPreset ? selectedPreset.name : placeholder}
        </span>
        <svg
          className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 rounded-md shadow-lg"
          style={{
            backgroundColor: 'var(--color-neutral-50)',
            border: '1px solid var(--color-neutral-200)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Search Input */}
          {presets.length > 5 && (
            <div className="p-2 border-b" style={{ borderColor: 'var(--color-neutral-200)' }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presets..."
                className="w-full px-3 py-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{
                  backgroundColor: 'var(--color-neutral-50)',
                  borderColor: 'var(--color-neutral-300)',
                  color: 'var(--color-neutral-700)',
                  focusRingColor: 'var(--color-primary-500)',
                }}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-auto py-1" role="listbox">
            {/* Clear Selection Option */}
            {showClearOption && selectedPresetId && (
              <>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(null)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-opacity-50 transition-colors"
                  style={{
                    color: 'var(--color-neutral-500)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  role="option"
                  aria-selected={false}
                >
                  <span className="italic">Clear selection</span>
                </button>
                <div 
                  className="border-t mx-2"
                  style={{ borderColor: 'var(--color-neutral-200)' }}
                />
              </>
            )}

            {/* Preset Options */}
            {filteredPresets.length > 0 ? (
              filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className="w-full text-left px-3 py-2 hover:bg-opacity-50 transition-colors"
                  style={{
                    backgroundColor: selectedPresetId === preset.id 
                      ? 'var(--color-primary-100)' 
                      : 'transparent',
                    color: selectedPresetId === preset.id 
                      ? 'var(--color-primary-800)' 
                      : 'var(--color-neutral-700)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPresetId !== preset.id) {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPresetId !== preset.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  role="option"
                  aria-selected={selectedPresetId === preset.id}
                >
                  <div>
                    <div className="font-medium">{preset.name}</div>
                    {preset.description && (
                      <div 
                        className="text-xs mt-1 truncate"
                        style={{ color: 'var(--color-neutral-500)' }}
                      >
                        {preset.description}
                      </div>
                    )}
                    <div 
                      className="text-xs mt-1"
                      style={{ color: 'var(--color-neutral-400)' }}
                    >
                      {new Date(preset.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div 
                className="px-3 py-2 text-sm text-center"
                style={{ color: 'var(--color-neutral-500)' }}
              >
                {searchQuery ? 'No presets found' : 'No presets available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
