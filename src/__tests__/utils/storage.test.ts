/**
 * Storage Utilities Tests
 */

import { vi } from 'vitest';
import { 
  isLocalStorageAvailable, 
  getStorageUsage, 
  validatePreset,
  getPresetStorage,
  savePresetStorage,
  DEFAULT_STORAGE_CONFIG
} from '../../utils/storage';
import { Preset } from '../../types/preset';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('isLocalStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('returns false when localStorage throws an error', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(isLocalStorageAvailable()).toBe(false);
    });
  });

  describe('validatePreset', () => {
    it('validates a correct preset', () => {
      const validPreset: Preset = {
        id: 'test-id',
        name: 'Test Preset',
        description: 'A test preset',
        calculatorType: 'laser-cutting-cost',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
        parameters: {
          materialType: 'steel',
          thickness: 5,
        },
      };

      const result = validatePreset(validPreset);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects preset with missing required fields', () => {
      const invalidPreset = {
        name: 'Test Preset',
        // Missing id, calculatorType, version, parameters
      };

      const result = validatePreset(invalidPreset);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(error => error.includes('ID is required'))).toBe(true);
    });

    it('rejects preset with invalid calculator type', () => {
      const invalidPreset = {
        id: 'test-id',
        name: 'Test Preset',
        calculatorType: 'invalid-calculator-type',
        version: '1.0.0',
        parameters: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = validatePreset(invalidPreset);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('not allowed'))).toBe(true);
    });

    it('rejects preset with name too long', () => {
      const invalidPreset = {
        id: 'test-id',
        name: 'A'.repeat(DEFAULT_STORAGE_CONFIG.maxPresetNameLength + 1),
        calculatorType: 'laser-cutting-cost',
        version: '1.0.0',
        parameters: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = validatePreset(invalidPreset);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('exceeds maximum length'))).toBe(true);
    });

    it('provides warnings for missing optional fields', () => {
      const presetWithoutOptionals = {
        id: 'test-id',
        name: 'Test Preset',
        calculatorType: 'laser-cutting-cost',
        version: '1.0.0',
        parameters: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = validatePreset(presetWithoutOptionals);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(warning => warning.includes('description is recommended'))).toBe(true);
    });
  });

  describe('getPresetStorage', () => {
    it('returns empty storage when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getPresetStorage();
      expect(result.success).toBe(true);
      expect(result.data).toBeTruthy();
      expect(result.data!.metadata.totalPresets).toBe(0);
      expect(result.data!.collections).toEqual({});
    });

    it('returns stored data when localStorage has data', () => {
      const mockStorage = {
        metadata: {
          version: '1.0.0',
          totalPresets: 1,
          storageUsed: 1000,
          lastCleanup: new Date().toISOString(),
          collections: {
            'laser-cutting-cost': {
              count: 1,
              lastModified: new Date().toISOString(),
            },
          },
        },
        collections: {
          'laser-cutting-cost': {
            calculatorType: 'laser-cutting-cost',
            presets: [{
              id: 'test-preset',
              name: 'Test Preset',
              calculatorType: 'laser-cutting-cost',
              version: '1.0.0',
              parameters: {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }],
            lastModified: new Date().toISOString(),
          },
        },
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStorage));

      const result = getPresetStorage();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockStorage);
    });

    it('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = getPresetStorage();
      expect(result.success).toBe(false);
      expect(result.error).toContain('localStorage error');
    });

    it('handles JSON parsing errors', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const result = getPresetStorage();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to load preset storage');
    });
  });

  describe('savePresetStorage', () => {
    it('saves storage data successfully', () => {
      const mockStorage = {
        metadata: {
          version: '1.0.0',
          totalPresets: 0,
          storageUsed: 0,
          lastCleanup: new Date().toISOString(),
          collections: {},
        },
        collections: {},
      };

      const result = savePresetStorage(mockStorage);
      expect(result.success).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'laser-calc-presets',
        expect.any(String)
      );
    });

    it('handles localStorage errors when saving', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage full');
      });

      const mockStorage = {
        metadata: {
          version: '1.0.0',
          totalPresets: 0,
          storageUsed: 0,
          lastCleanup: new Date().toISOString(),
          collections: {},
        },
        collections: {},
      };

      const result = savePresetStorage(mockStorage);
      expect(result.success).toBe(false);
      expect(result.error).toContain('localStorage full');
    });
  });
});
