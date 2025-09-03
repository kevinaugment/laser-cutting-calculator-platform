/**
 * Parameter Preset Service Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ParameterPresetService } from '../../services/parameterPresetService';

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

describe('ParameterPresetService', () => {
  let service: ParameterPresetService;

  beforeEach(async () => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null);
    
    // Create new service instance
    service = new ParameterPresetService({
      maxPresets: 10,
      autoCleanupDays: 30,
      storageKey: 'test-presets',
      enableSharing: false,
      enableValidation: true,
    });
    
    await service.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const newService = new ParameterPresetService();
      await expect(newService.initialize()).resolves.not.toThrow();
    });

    it('should load existing presets from storage', async () => {
      const existingData = {
        'anonymous-user': [
          {
            id: 'preset-1',
            name: 'Test Preset',
            description: 'Test Description',
            calculatorType: 'laser-cutting-cost',
            parameters: { thickness: 5, material: 'steel' },
            category: 'custom',
            visibility: { scope: 'private', sharedWith: [], permissions: {} },
            tags: ['test'],
            createdBy: 'anonymous-user',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            usageStats: { totalUses: 0, averageRating: 0, ratingCount: 0, successRate: 0, userFeedback: [] },
            validation: { isValid: true, errors: [], warnings: [], lastValidated: new Date() },
          },
        ],
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));
      
      const newService = new ParameterPresetService();
      await newService.initialize();
      
      const presets = await newService.getPresets();
      expect(presets.presets).toHaveLength(1);
      expect(presets.presets[0].name).toBe('Test Preset');
    });
  });

  describe('createPreset', () => {
    it('should create a preset successfully', async () => {
      const parameters = { thickness: 5, material: 'steel', area: 100 };

      const id = await service.createPreset(
        'Test Preset',
        'Test Description',
        'laser-cutting-cost',
        parameters
      );

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should create preset with options', async () => {
      const parameters = { thickness: 5, material: 'steel', area: 100 };

      const id = await service.createPreset(
        'Test Preset',
        'Test Description',
        'laser-cutting-cost',
        parameters,
        {
          category: 'material-specific',
          visibility: 'team',
          tags: ['steel', 'thick'],
        }
      );

      const preset = await service.getPreset(id);
      expect(preset?.category).toBe('material-specific');
      expect(preset?.visibility.scope).toBe('team');
      expect(preset?.tags).toEqual(['steel', 'thick']);
    });

    it('should enforce max presets limit', async () => {
      // Add more presets than the limit
      for (let i = 0; i < 15; i++) {
        await service.createPreset(
          `Preset ${i}`,
          'Description',
          'test-calculator',
          { value: i }
        );
      }
      
      const presets = await service.getPresets();
      expect(presets.presets.length).toBe(10); // Should be limited to maxPresets
    });

    it('should validate parameters when enabled', async () => {
      await expect(
        service.createPreset(
          'Invalid Preset',
          'Description',
          'laser-cutting-cost',
          {} // Empty parameters should fail validation
        )
      ).rejects.toThrow('Parameters cannot be empty');
    });
  });

  describe('getPresets', () => {
    beforeEach(async () => {
      // Add some test presets
      for (let i = 0; i < 5; i++) {
        await service.createPreset(
          `Preset ${i}`,
          `Description ${i}`,
          i % 2 === 0 ? 'calculator-a' : 'calculator-b',
          { value: i },
          {
            category: i % 2 === 0 ? 'custom' : 'standard',
            tags: [`tag${i}`],
          }
        );
      }
    });

    it('should return all presets without query', async () => {
      const result = await service.getPresets();
      
      expect(result.presets).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.hasMore).toBe(false);
    });

    it('should filter by calculator type', async () => {
      const result = await service.getPresets({
        calculatorType: 'calculator-a',
      });
      
      expect(result.presets).toHaveLength(3);
      expect(result.presets.every(p => p.calculatorType === 'calculator-a')).toBe(true);
    });

    it('should filter by category', async () => {
      const result = await service.getPresets({
        category: 'custom',
      });
      
      expect(result.presets).toHaveLength(3);
      expect(result.presets.every(p => p.category === 'custom')).toBe(true);
    });

    it('should apply pagination', async () => {
      const result = await service.getPresets({
        limit: 2,
        offset: 0,
      });
      
      expect(result.presets).toHaveLength(2);
      expect(result.hasMore).toBe(true);
    });

    it('should search in presets', async () => {
      await service.createPreset(
        'Special Preset',
        'Special Description',
        'special-calculator',
        { specialValue: 42 }
      );
      
      const result = await service.getPresets({
        search: 'special',
      });
      
      expect(result.presets.length).toBeGreaterThan(0);
      expect(result.presets.some(p => p.name.toLowerCase().includes('special'))).toBe(true);
    });

    it('should sort presets correctly', async () => {
      const result = await service.getPresets({
        sortBy: 'name',
        sortOrder: 'asc',
      });
      
      // Should be sorted by name ascending
      for (let i = 1; i < result.presets.length; i++) {
        expect(result.presets[i - 1].name.localeCompare(result.presets[i].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('updatePreset', () => {
    it('should update preset successfully', async () => {
      const id = await service.createPreset(
        'Original Name',
        'Original Description',
        'test-calculator',
        { value: 42 }
      );
      
      const success = await service.updatePreset(id, {
        name: 'Updated Name',
        description: 'Updated Description',
      });
      
      expect(success).toBe(true);
      
      const preset = await service.getPreset(id);
      expect(preset?.name).toBe('Updated Name');
      expect(preset?.description).toBe('Updated Description');
    });

    it('should return false for non-existent preset', async () => {
      const success = await service.updatePreset('non-existent-id', {
        name: 'New Name',
      });
      
      expect(success).toBe(false);
    });
  });

  describe('deletePreset', () => {
    it('should delete preset successfully', async () => {
      const id = await service.createPreset(
        'Test Preset',
        'Description',
        'test-calculator',
        { value: 42 }
      );
      
      const success = await service.deletePreset(id);
      expect(success).toBe(true);
      
      const preset = await service.getPreset(id);
      expect(preset).toBeNull();
    });

    it('should return false for non-existent preset', async () => {
      const success = await service.deletePreset('non-existent-id');
      expect(success).toBe(false);
    });
  });

  describe('usePreset', () => {
    it('should increment usage count', async () => {
      const id = await service.createPreset(
        'Test Preset',
        'Description',
        'test-calculator',
        { value: 42 }
      );
      
      const preset = await service.usePreset(id);
      
      expect(preset).toBeDefined();
      expect(preset?.usageStats.totalUses).toBe(1);
      expect(preset?.usageStats.lastUsed).toBeDefined();
    });

    it('should return null for non-existent preset', async () => {
      const preset = await service.usePreset('non-existent-id');
      expect(preset).toBeNull();
    });
  });

  describe('ratePreset', () => {
    it('should update preset rating', async () => {
      const id = await service.createPreset(
        'Test Preset',
        'Description',
        'test-calculator',
        { value: 42 }
      );
      
      const success = await service.ratePreset(id, 4);
      expect(success).toBe(true);
      
      const preset = await service.getPreset(id);
      expect(preset?.usageStats.averageRating).toBe(4);
      expect(preset?.usageStats.ratingCount).toBe(1);
    });

    it('should calculate average rating correctly', async () => {
      const id = await service.createPreset(
        'Test Preset',
        'Description',
        'test-calculator',
        { value: 42 }
      );
      
      await service.ratePreset(id, 4);
      await service.ratePreset(id, 2);
      
      const preset = await service.getPreset(id);
      expect(preset?.usageStats.averageRating).toBe(3); // (4 + 2) / 2
      expect(preset?.usageStats.ratingCount).toBe(2);
    });

    it('should validate rating range', async () => {
      const id = await service.createPreset(
        'Test Preset',
        'Description',
        'test-calculator',
        { value: 42 }
      );
      
      await expect(service.ratePreset(id, 0)).rejects.toThrow('Rating must be between 1 and 5');
      await expect(service.ratePreset(id, 6)).rejects.toThrow('Rating must be between 1 and 5');
    });
  });

  describe('duplicatePreset', () => {
    it('should duplicate preset successfully', async () => {
      const originalId = await service.createPreset(
        'Original Preset',
        'Original Description',
        'test-calculator',
        { value: 42 },
        { tags: ['original'] }
      );
      
      const duplicatedId = await service.duplicatePreset(originalId, 'Duplicated Preset');
      
      expect(duplicatedId).toBeDefined();
      expect(duplicatedId).not.toBe(originalId);
      
      const duplicated = await service.getPreset(duplicatedId!);
      expect(duplicated?.name).toBe('Duplicated Preset');
      expect(duplicated?.parameters).toEqual({ value: 42 });
      expect(duplicated?.tags).toEqual(['original']);
      expect(duplicated?.visibility.scope).toBe('private'); // Should always be private
    });

    it('should return null for non-existent preset', async () => {
      const duplicatedId = await service.duplicatePreset('non-existent-id');
      expect(duplicatedId).toBeNull();
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      // Create test presets with different categories and usage
      await service.createPreset('Preset A', 'Desc', 'calc-a', { v: 1 }, { category: 'custom' });
      await service.createPreset('Preset B', 'Desc', 'calc-a', { v: 2 }, { category: 'standard' });
      await service.createPreset('Preset C', 'Desc', 'calc-b', { v: 3 }, { category: 'custom' });
    });

    it('should return correct statistics', async () => {
      const stats = await service.getStats();
      
      expect(stats.totalPresets).toBe(3);
      expect(stats.categoryDistribution.custom).toBe(2);
      expect(stats.categoryDistribution.standard).toBe(1);
      expect(stats.calculatorUsage['calc-a']).toBe(2);
      expect(stats.calculatorUsage['calc-b']).toBe(1);
    });

    it('should handle empty presets', async () => {
      // Clear all presets
      const presets = await service.getPresets();
      for (const preset of presets.presets) {
        await service.deletePreset(preset.id);
      }
      
      const stats = await service.getStats();
      expect(stats.totalPresets).toBe(0);
      expect(stats.averageRating).toBe(0);
      expect(stats.mostUsedPresets).toHaveLength(0);
    });
  });

  describe('event listeners', () => {
    it('should notify listeners when presets change', async () => {
      const listener = vi.fn();
      const unsubscribe = service.subscribe(listener);
      
      await service.createPreset('Test', 'Desc', 'calc', { v: 1 });
      
      expect(listener).toHaveBeenCalled();
      
      unsubscribe();
    });

    it('should handle listener errors gracefully', async () => {
      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = vi.fn();
      
      service.subscribe(errorListener);
      service.subscribe(normalListener);
      
      await service.createPreset('Test', 'Desc', 'calc', { v: 1 });
      
      // Both listeners should be called despite the error
      expect(errorListener).toHaveBeenCalled();
      expect(normalListener).toHaveBeenCalled();
    });
  });
});
