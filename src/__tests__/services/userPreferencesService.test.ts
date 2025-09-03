/**
 * User Preferences Service Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UserPreferencesService } from '../../services/userPreferencesService';
import { UserPreferences } from '../../types/memory';

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

// Mock addEventListener for storage events
const addEventListenerMock = vi.fn();
Object.defineProperty(window, 'addEventListener', {
  value: addEventListenerMock,
});

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;

  beforeEach(async () => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null);
    
    // Create new service instance
    service = new UserPreferencesService({
      storageKey: 'test-preferences',
      autoSave: true,
      syncAcrossTabs: false, // Disable for testing
      encryptionEnabled: false,
      validationEnabled: true,
    });
    
    await service.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default preferences', async () => {
      const preferences = service.getPreferences();
      
      expect(preferences.defaultUnits).toBe('metric');
      expect(preferences.autoSaveCalculations).toBe(true);
      expect(preferences.showRecommendations).toBe(true);
      expect(preferences.confidenceThreshold).toBe(0.7);
      expect(preferences.favoriteCalculators).toEqual([]);
      expect(preferences.notificationSettings).toBeDefined();
      expect(preferences.privacySettings).toBeDefined();
    });

    it('should load existing preferences from storage', async () => {
      const existingPreferences: Partial<UserPreferences> = {
        defaultUnits: 'imperial',
        autoSaveCalculations: false,
        favoriteCalculators: ['laser-cutting-cost', 'cutting-time'],
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPreferences));
      
      const newService = new UserPreferencesService({
        storageKey: 'test-preferences-2',
        autoSave: false,
      });
      await newService.initialize();
      
      const preferences = newService.getPreferences();
      expect(preferences.defaultUnits).toBe('imperial');
      expect(preferences.autoSaveCalculations).toBe(false);
      expect(preferences.favoriteCalculators).toEqual(['laser-cutting-cost', 'cutting-time']);
    });

    it('should handle corrupted storage data gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const newService = new UserPreferencesService({
        storageKey: 'test-preferences-3',
      });
      await newService.initialize();
      
      const preferences = newService.getPreferences();
      expect(preferences.defaultUnits).toBe('metric'); // Should fall back to defaults
    });
  });

  describe('preference operations', () => {
    it('should get specific preference values', () => {
      const units = service.getPreference('defaultUnits');
      const autoSave = service.getPreference('autoSaveCalculations');
      
      expect(units).toBe('metric');
      expect(autoSave).toBe(true);
    });

    it('should set specific preference values', async () => {
      await service.setPreference('defaultUnits', 'imperial');
      await service.setPreference('confidenceThreshold', 0.8);
      
      expect(service.getPreference('defaultUnits')).toBe('imperial');
      expect(service.getPreference('confidenceThreshold')).toBe(0.8);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should update multiple preferences at once', async () => {
      const updates: Partial<UserPreferences> = {
        defaultUnits: 'imperial',
        autoSaveCalculations: false,
        showRecommendations: false,
      };
      
      await service.updatePreferences(updates);
      
      const preferences = service.getPreferences();
      expect(preferences.defaultUnits).toBe('imperial');
      expect(preferences.autoSaveCalculations).toBe(false);
      expect(preferences.showRecommendations).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should reset all preferences to defaults', async () => {
      // First, change some preferences
      await service.setPreference('defaultUnits', 'imperial');
      await service.setPreference('autoSaveCalculations', false);
      
      // Then reset
      await service.resetPreferences();
      
      const preferences = service.getPreferences();
      expect(preferences.defaultUnits).toBe('metric');
      expect(preferences.autoSaveCalculations).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should reset preferences by category', async () => {
      // Change some preferences
      await service.setPreference('defaultUnits', 'imperial');
      await service.setPreference('autoSaveCalculations', false);
      
      // Reset only units category
      await service.resetCategory('units');
      
      const preferences = service.getPreferences();
      expect(preferences.defaultUnits).toBe('metric'); // Should be reset
      expect(preferences.autoSaveCalculations).toBe(false); // Should remain unchanged
    });
  });

  describe('favorite calculators', () => {
    it('should add favorite calculators', async () => {
      await service.addFavoriteCalculator('laser-cutting-cost');
      await service.addFavoriteCalculator('cutting-time');
      
      const favorites = service.getPreference('favoriteCalculators');
      expect(favorites).toEqual(['laser-cutting-cost', 'cutting-time']);
    });

    it('should not add duplicate favorites', async () => {
      await service.addFavoriteCalculator('laser-cutting-cost');
      await service.addFavoriteCalculator('laser-cutting-cost'); // Duplicate
      
      const favorites = service.getPreference('favoriteCalculators');
      expect(favorites).toEqual(['laser-cutting-cost']);
    });

    it('should remove favorite calculators', async () => {
      await service.addFavoriteCalculator('laser-cutting-cost');
      await service.addFavoriteCalculator('cutting-time');
      await service.removeFavoriteCalculator('laser-cutting-cost');
      
      const favorites = service.getPreference('favoriteCalculators');
      expect(favorites).toEqual(['cutting-time']);
    });

    it('should check if calculator is favorite', async () => {
      await service.addFavoriteCalculator('laser-cutting-cost');
      
      expect(service.isFavoriteCalculator('laser-cutting-cost')).toBe(true);
      expect(service.isFavoriteCalculator('cutting-time')).toBe(false);
    });
  });

  describe('notification settings', () => {
    it('should update notification settings', async () => {
      await service.updateNotificationSettings({
        newRecommendations: false,
        parameterOptimizations: false,
      });
      
      const settings = service.getPreference('notificationSettings');
      expect(settings.newRecommendations).toBe(false);
      expect(settings.parameterOptimizations).toBe(false);
      expect(settings.teamUpdates).toBe(false); // Should remain default
      expect(settings.systemUpdates).toBe(true); // Should remain default
    });
  });

  describe('privacy settings', () => {
    it('should update privacy settings', async () => {
      await service.updatePrivacySettings({
        shareUsageData: true,
        dataRetentionDays: 180,
      });
      
      const settings = service.getPreference('privacySettings');
      expect(settings.shareUsageData).toBe(true);
      expect(settings.dataRetentionDays).toBe(180);
      expect(settings.allowTeamSharing).toBe(false); // Should remain default
    });
  });

  describe('validation', () => {
    it('should validate units preference', async () => {
      await expect(service.setPreference('defaultUnits', 'invalid')).rejects.toThrow();
      await expect(service.setPreference('defaultUnits', 'metric')).resolves.not.toThrow();
      await expect(service.setPreference('defaultUnits', 'imperial')).resolves.not.toThrow();
    });

    it('should validate confidence threshold', async () => {
      await expect(service.setPreference('confidenceThreshold', -0.1)).rejects.toThrow();
      await expect(service.setPreference('confidenceThreshold', 1.1)).rejects.toThrow();
      await expect(service.setPreference('confidenceThreshold', 0.5)).resolves.not.toThrow();
    });

    it('should validate favorite calculators array', async () => {
      await expect(service.setPreference('favoriteCalculators', 'not-an-array')).rejects.toThrow();
      await expect(service.setPreference('favoriteCalculators', ['valid', 'array'])).resolves.not.toThrow();
    });

    it('should validate boolean preferences', async () => {
      await expect(service.setPreference('autoSaveCalculations', 'not-boolean')).rejects.toThrow();
      await expect(service.setPreference('showRecommendations', 'not-boolean')).rejects.toThrow();
      await expect(service.setPreference('autoSaveCalculations', true)).resolves.not.toThrow();
      await expect(service.setPreference('showRecommendations', false)).resolves.not.toThrow();
    });
  });

  describe('event listeners', () => {
    it('should notify listeners when preferences change', async () => {
      const listener = vi.fn();
      const unsubscribe = service.subscribe(listener);
      
      await service.setPreference('defaultUnits', 'imperial');
      
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultUnits: 'imperial',
        })
      );
      
      unsubscribe();
    });

    it('should handle listener errors gracefully', async () => {
      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = vi.fn();
      
      service.subscribe(errorListener);
      service.subscribe(normalListener);
      
      await service.setPreference('defaultUnits', 'imperial');
      
      // Both listeners should be called despite the error
      expect(errorListener).toHaveBeenCalled();
      expect(normalListener).toHaveBeenCalled();
    });

    it('should unsubscribe listeners correctly', async () => {
      const listener = vi.fn();
      const unsubscribe = service.subscribe(listener);
      
      unsubscribe();
      await service.setPreference('defaultUnits', 'imperial');
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('export/import', () => {
    it('should export preferences as JSON', async () => {
      await service.setPreference('defaultUnits', 'imperial');
      await service.addFavoriteCalculator('test-calculator');
      
      const exported = service.exportPreferences();
      const parsed = JSON.parse(exported);
      
      expect(parsed.defaultUnits).toBe('imperial');
      expect(parsed.favoriteCalculators).toContain('test-calculator');
    });

    it('should import preferences from JSON', async () => {
      const importData = JSON.stringify({
        defaultUnits: 'imperial',
        autoSaveCalculations: false,
        favoriteCalculators: ['imported-calculator'],
      });
      
      await service.importPreferences(importData);
      
      const preferences = service.getPreferences();
      expect(preferences.defaultUnits).toBe('imperial');
      expect(preferences.autoSaveCalculations).toBe(false);
      expect(preferences.favoriteCalculators).toContain('imported-calculator');
    });

    it('should handle invalid import data', async () => {
      await expect(service.importPreferences('invalid json')).rejects.toThrow();
      await expect(service.importPreferences('null')).rejects.toThrow();
    });
  });

  describe('storage operations', () => {
    it('should save preferences to storage', async () => {
      await service.saveToStorage();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-preferences',
        expect.any(String)
      );
    });

    it('should handle storage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      await expect(service.saveToStorage()).rejects.toThrow('Storage error');
    });
  });
});
