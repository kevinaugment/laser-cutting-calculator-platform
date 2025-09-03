/**
 * PresetForm Component
 * Modal form for creating and editing presets
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme';
import { Preset, PresetParameters } from '../../types/preset';

export interface PresetFormProps<T extends PresetParameters = PresetParameters> {
  calculatorType: string;
  initialData: Omit<Preset<T>, 'id' | 'createdAt' | 'updatedAt'>;
  onSave: (presetData: Omit<Preset<T>, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function PresetForm<T extends PresetParameters = PresetParameters>({
  calculatorType,
  initialData,
  onSave,
  onCancel,
  isEditing = false,
}: PresetFormProps<T>) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Preset name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Preset name must be 100 characters or less';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save preset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle tags input
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    handleInputChange('tags', tags);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md rounded-lg shadow-xl"
        style={{
          backgroundColor: 'var(--color-neutral-50)',
          border: '1px solid var(--color-neutral-200)',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--color-neutral-200)' }}
        >
          <h2 
            className="text-lg font-semibold"
            style={{ color: 'var(--color-neutral-900)' }}
          >
            {isEditing ? 'Edit Preset' : 'Save New Preset'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-md hover:bg-opacity-50 transition-colors"
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Preset Name */}
          <div>
            <label 
              htmlFor="preset-name"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-neutral-700)' }}
            >
              Preset Name *
            </label>
            <input
              id="preset-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                borderColor: errors.name ? 'var(--color-error-500)' : 'var(--color-neutral-300)',
                color: 'var(--color-neutral-700)',
                focusRingColor: 'var(--color-primary-500)',
              }}
              placeholder="Enter preset name..."
              maxLength={100}
              required
            />
            {errors.name && (
              <p 
                className="text-sm mt-1"
                style={{ color: 'var(--color-error-600)' }}
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="preset-description"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-neutral-700)' }}
            >
              Description
            </label>
            <textarea
              id="preset-description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none"
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                borderColor: errors.description ? 'var(--color-error-500)' : 'var(--color-neutral-300)',
                color: 'var(--color-neutral-700)',
                focusRingColor: 'var(--color-primary-500)',
              }}
              placeholder="Optional description..."
              maxLength={500}
            />
            {errors.description && (
              <p 
                className="text-sm mt-1"
                style={{ color: 'var(--color-error-600)' }}
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label 
              htmlFor="preset-tags"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-neutral-700)' }}
            >
              Tags
            </label>
            <input
              id="preset-tags"
              type="text"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                borderColor: 'var(--color-neutral-300)',
                color: 'var(--color-neutral-700)',
                focusRingColor: 'var(--color-primary-500)',
              }}
              placeholder="Enter tags separated by commas..."
            />
            <p 
              className="text-xs mt-1"
              style={{ color: 'var(--color-neutral-500)' }}
            >
              Separate multiple tags with commas
            </p>
          </div>

          {/* Calculator Type (Read-only) */}
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-neutral-700)' }}
            >
              Calculator Type
            </label>
            <input
              type="text"
              value={calculatorType}
              readOnly
              className="w-full px-3 py-2 rounded-md border"
              style={{
                backgroundColor: 'var(--color-neutral-100)',
                borderColor: 'var(--color-neutral-300)',
                color: 'var(--color-neutral-600)',
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 font-medium rounded-md border transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--color-neutral-300)',
                color: 'var(--color-neutral-700)',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 font-medium rounded-md transition-colors disabled:opacity-50"
              style={{
                backgroundColor: isSubmitting ? 'var(--color-primary-400)' : 'var(--color-primary-600)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-700)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
                }
              }}
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Preset' : 'Save Preset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
