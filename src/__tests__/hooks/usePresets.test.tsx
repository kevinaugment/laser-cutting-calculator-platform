/**
 * usePresets Hook Tests
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { usePresets } from '../../hooks/usePresets';
import { Preset, LaserCuttingCostPresetParameters } from '../../types/preset';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock storage utilities
vi.mock('../../utils/storage', () => ({
  isLocalStorageAvailable: () => true,
  getStorageUsage: () => 1000,
  getAvailableStorage: () => 4000000,
  isStorageNearCapacity: () => false,
  getStorageConfig: () => ({
    maxPresets: 1000,
    maxStorageSize: 5 * 1024 * 1024,
    maxPresetNameLength: 100,
    maxDescriptionLength: 500,
    allowedCalculatorTypes: ['laser-cutting-cost', 'cutting-time-estimator'],
    autoCleanup: true,
    cleanupThreshold: 80,
  }),
  validatePreset: (preset: any) => ({
    isValid: true,
    errors: [],
    warnings: [],
  }),
  getPresetStorage: () => ({
    success: true,
    data: {
      metadata: {
        version: '1.0.0',
        totalPresets: 0,
        storageUsed: 1000,
        lastCleanup: new Date().toISOString(),
        collections: {},
      },
      collections: {},
    },
  }),
  savePresetStorage: () => ({ success: true }),
  cleanupStorage: () => ({ success: true, data: { cleaned: 0, spaceSaved: 0 } }),
  STORAGE_KEYS: {
    PRESET_STORAGE: 'laser-calc-presets',
    STORAGE_CONFIG: 'laser-calc-storage-config',
    LAST_BACKUP: 'laser-calc-last-backup',
  },
}));

describe('usePresets', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    vi.clearAllMocks();
  });

  it('initializes with empty presets', async () => {
    const { result } = renderHook(() => usePresets());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].presets).toEqual([]);
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].error).toBe(null);
    expect(result.current[0].metadata).toBeTruthy();
  });

  it('creates a new preset', async () => {
    const { result } = renderHook(() => usePresets<LaserCuttingCostPresetParameters>());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const presetData = {
      name: 'Test Preset',
      description: 'A test preset',
      calculatorType: 'laser-cutting-cost',
      version: '1.0.0',
      parameters: {
        materialType: 'steel',
        thickness: 5,
        length: 100,
        width: 50,
        complexity: 'medium' as const,
        quantity: 10,
        urgency: 'standard' as const,
      },
    };

    let createResult: any;
    await act(async () => {
      createResult = await result.current[1].createPreset(presetData);
    });

    expect(createResult.success).toBe(true);
    expect(createResult.data).toBeTruthy();
    expect(createResult.data.name).toBe('Test Preset');
    expect(createResult.data.id).toBeTruthy();
    expect(createResult.data.createdAt).toBeTruthy();
    expect(createResult.data.updatedAt).toBeTruthy();
  });

  it('updates an existing preset', async () => {
    const { result } = renderHook(() => usePresets<LaserCuttingCostPresetParameters>());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // First create a preset
    const presetData = {
      name: 'Original Preset',
      calculatorType: 'laser-cutting-cost',
      version: '1.0.0',
      parameters: {
        materialType: 'steel',
        thickness: 5,
        length: 100,
        width: 50,
        complexity: 'medium' as const,
        quantity: 10,
        urgency: 'standard' as const,
      },
    };

    let createResult: any;
    await act(async () => {
      createResult = await result.current[1].createPreset(presetData);
    });

    expect(createResult.success).toBe(true);
    const presetId = createResult.data.id;

    // Then update it
    let updateResult: any;
    await act(async () => {
      updateResult = await result.current[1].updatePreset(presetId, {
        name: 'Updated Preset',
        parameters: {
          ...presetData.parameters,
          thickness: 10,
        },
      });
    });

    expect(updateResult.success).toBe(true);
    expect(updateResult.data.name).toBe('Updated Preset');
    expect(updateResult.data.parameters.thickness).toBe(10);
  });

  it('deletes a preset', async () => {
    const { result } = renderHook(() => usePresets<LaserCuttingCostPresetParameters>());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // First create a preset
    const presetData = {
      name: 'To Delete',
      calculatorType: 'laser-cutting-cost',
      version: '1.0.0',
      parameters: {
        materialType: 'steel',
        thickness: 5,
        length: 100,
        width: 50,
        complexity: 'medium' as const,
        quantity: 10,
        urgency: 'standard' as const,
      },
    };

    let createResult: any;
    await act(async () => {
      createResult = await result.current[1].createPreset(presetData);
    });

    expect(createResult.success).toBe(true);
    const presetId = createResult.data.id;

    // Then delete it
    let deleteResult: any;
    await act(async () => {
      deleteResult = await result.current[1].deletePreset(presetId);
    });

    expect(deleteResult.success).toBe(true);

    // Verify it's no longer in the list
    const foundPreset = result.current[1].getPreset(presetId);
    expect(foundPreset).toBe(null);
  });

  it('searches presets by query', async () => {
    const { result } = renderHook(() => usePresets<LaserCuttingCostPresetParameters>());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Create multiple presets
    const presets = [
      {
        name: 'Steel Cutting',
        description: 'For steel materials',
        calculatorType: 'laser-cutting-cost',
        version: '1.0.0',
        parameters: {
          materialType: 'steel',
          thickness: 5,
          length: 100,
          width: 50,
          complexity: 'medium' as const,
          quantity: 10,
          urgency: 'standard' as const,
        },
      },
      {
        name: 'Aluminum Cutting',
        description: 'For aluminum materials',
        calculatorType: 'laser-cutting-cost',
        version: '1.0.0',
        parameters: {
          materialType: 'aluminum',
          thickness: 3,
          length: 200,
          width: 100,
          complexity: 'simple' as const,
          quantity: 5,
          urgency: 'rush' as const,
        },
      },
    ];

    for (const preset of presets) {
      await act(async () => {
        await result.current[1].createPreset(preset);
      });
    }

    // Search for steel
    const searchResult = result.current[1].searchPresets({ query: 'steel' });
    expect(searchResult.presets).toHaveLength(1);
    expect(searchResult.presets[0].name).toBe('Steel Cutting');
    expect(searchResult.total).toBe(1);
    expect(searchResult.hasMore).toBe(false);
  });

  it('filters presets by calculator type', async () => {
    const { result } = renderHook(() => usePresets());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Create presets for different calculator types
    const presets = [
      {
        name: 'Cost Preset',
        calculatorType: 'laser-cutting-cost',
        version: '1.0.0',
        parameters: { test: 'value1' },
      },
      {
        name: 'Time Preset',
        calculatorType: 'cutting-time-estimator',
        version: '1.0.0',
        parameters: { test: 'value2' },
      },
    ];

    for (const preset of presets) {
      await act(async () => {
        await result.current[1].createPreset(preset);
      });
    }

    // Get presets by calculator type
    const costPresets = result.current[1].getPresetsByCalculator('laser-cutting-cost');
    expect(costPresets).toHaveLength(1);
    expect(costPresets[0].name).toBe('Cost Preset');

    const timePresets = result.current[1].getPresetsByCalculator('cutting-time-estimator');
    expect(timePresets).toHaveLength(1);
    expect(timePresets[0].name).toBe('Time Preset');
  });

  it('handles errors gracefully', async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => usePresets({ onError }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Try to create an invalid preset
    const invalidPreset = {
      name: '', // Invalid: empty name
      calculatorType: 'invalid-type', // Invalid: not allowed
      version: '1.0.0',
      parameters: {},
    };

    let createResult: any;
    await act(async () => {
      createResult = await result.current[1].createPreset(invalidPreset);
    });

    expect(createResult.success).toBe(false);
    expect(createResult.error).toBeTruthy();
  });

  it('provides storage usage information', async () => {
    const { result } = renderHook(() => usePresets());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const usage = result.current[1].getStorageUsage();
    expect(usage.used).toBe(1000);
    expect(usage.total).toBe(5 * 1024 * 1024);
    expect(usage.percentage).toBeCloseTo(0.019, 2);

    const totalCount = result.current[1].getTotalPresetCount();
    expect(totalCount).toBe(0);
  });

  it('handles events correctly', async () => {
    const onEvent = vi.fn();
    const { result } = renderHook(() => usePresets({ onEvent }));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const presetData = {
      name: 'Event Test',
      calculatorType: 'laser-cutting-cost',
      version: '1.0.0',
      parameters: { test: 'value' },
    };

    await act(async () => {
      await result.current[1].createPreset(presetData);
    });

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'preset:created',
        payload: expect.objectContaining({
          calculatorType: 'laser-cutting-cost',
        }),
        timestamp: expect.any(String),
      })
    );
  });
});
