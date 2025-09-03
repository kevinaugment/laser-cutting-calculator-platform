/**
 * User Preferences Service
 * Manages user preferences, settings, and personalization data
 */

import { UserPreferences, NotificationSettings, PrivacySettings } from '../types/memory';
import { generateId } from '../utils/idGenerator';

// ============================================================================
// Service Configuration
// ============================================================================

export interface PreferencesServiceConfig {
  storageKey: string;
  autoSave: boolean;
  syncAcrossTabs: boolean;
  encryptionEnabled: boolean;
  validationEnabled: boolean;
}

const DEFAULT_CONFIG: PreferencesServiceConfig = {
  storageKey: 'laser-calc-preferences',
  autoSave: true,
  syncAcrossTabs: true,
  encryptionEnabled: false,
  validationEnabled: true,
};

// ============================================================================
// Default Preferences
// ============================================================================

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  newRecommendations: true,
  parameterOptimizations: true,
  teamUpdates: false,
  systemUpdates: true,
};

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  shareUsageData: false,
  allowTeamSharing: false,
  anonymousAnalytics: true,
  dataRetentionDays: 90,
};

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultUnits: 'metric',
  autoSaveCalculations: true,
  showRecommendations: true,
  confidenceThreshold: 0.7,
  favoriteCalculators: [],
  notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
  privacySettings: DEFAULT_PRIVACY_SETTINGS,
};

// ============================================================================
// Preference Categories
// ============================================================================

export type PreferenceCategory = 
  | 'units'
  | 'calculations'
  | 'interface'
  | 'notifications'
  | 'privacy'
  | 'advanced';

export interface PreferenceDefinition {
  key: string;
  category: PreferenceCategory;
  type: 'boolean' | 'string' | 'number' | 'array' | 'object';
  defaultValue: any;
  validation?: (value: any) => boolean;
  description: string;
  requiresRestart?: boolean;
}

// ============================================================================
// User Preferences Service
// ============================================================================

export class UserPreferencesService {
  private config: PreferencesServiceConfig;
  private preferences: UserPreferences;
  private listeners: Set<(preferences: UserPreferences) => void> = new Set();
  private isInitialized = false;

  constructor(config?: Partial<PreferencesServiceConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.preferences = { ...DEFAULT_USER_PREFERENCES };
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load preferences from storage
      await this.loadFromStorage();
      
      // Setup cross-tab synchronization
      if (this.config.syncAcrossTabs) {
        this.setupStorageListener();
      }
      
      this.isInitialized = true;
      console.log('✅ User Preferences Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize User Preferences Service:', error);
      throw error;
    }
  }

  // ============================================================================
  // Core Preference Operations
  // ============================================================================

  /**
   * Get all user preferences
   */
  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  /**
   * Get a specific preference value
   */
  public getPreference<T = any>(key: keyof UserPreferences): T {
    return this.preferences[key] as T;
  }

  /**
   * Set a specific preference value
   */
  public async setPreference<T = any>(
    key: keyof UserPreferences, 
    value: T
  ): Promise<void> {
    try {
      // Validate the value if validation is enabled
      if (this.config.validationEnabled) {
        this.validatePreferenceValue(key, value);
      }

      // Update the preference
      this.preferences = {
        ...this.preferences,
        [key]: value,
      };

      // Auto-save if enabled
      if (this.config.autoSave) {
        await this.saveToStorage();
      }

      // Notify listeners
      this.notifyListeners();

      console.log(`📝 Preference updated: ${String(key)} = ${JSON.stringify(value)}`);
    } catch (error) {
      console.error(`❌ Failed to set preference ${String(key)}:`, error);
      throw error;
    }
  }

  /**
   * Update multiple preferences at once
   */
  public async updatePreferences(updates: Partial<UserPreferences>): Promise<void> {
    try {
      // Validate all updates if validation is enabled
      if (this.config.validationEnabled) {
        Object.entries(updates).forEach(([key, value]) => {
          this.validatePreferenceValue(key as keyof UserPreferences, value);
        });
      }

      // Apply all updates
      this.preferences = {
        ...this.preferences,
        ...updates,
      };

      // Auto-save if enabled
      if (this.config.autoSave) {
        await this.saveToStorage();
      }

      // Notify listeners
      this.notifyListeners();

      console.log(`📝 Multiple preferences updated: ${Object.keys(updates).join(', ')}`);
    } catch (error) {
      console.error('❌ Failed to update preferences:', error);
      throw error;
    }
  }

  /**
   * Reset preferences to defaults
   */
  public async resetPreferences(): Promise<void> {
    try {
      this.preferences = { ...DEFAULT_USER_PREFERENCES };

      // Auto-save if enabled
      if (this.config.autoSave) {
        await this.saveToStorage();
      }

      // Notify listeners
      this.notifyListeners();

      console.log('🔄 Preferences reset to defaults');
    } catch (error) {
      console.error('❌ Failed to reset preferences:', error);
      throw error;
    }
  }

  /**
   * Reset a specific category of preferences
   */
  public async resetCategory(category: PreferenceCategory): Promise<void> {
    try {
      const updates: Partial<UserPreferences> = {};

      switch (category) {
        case 'units':
          updates.defaultUnits = DEFAULT_USER_PREFERENCES.defaultUnits;
          break;
        case 'calculations':
          updates.autoSaveCalculations = DEFAULT_USER_PREFERENCES.autoSaveCalculations;
          updates.showRecommendations = DEFAULT_USER_PREFERENCES.showRecommendations;
          updates.confidenceThreshold = DEFAULT_USER_PREFERENCES.confidenceThreshold;
          break;
        case 'interface':
          updates.favoriteCalculators = DEFAULT_USER_PREFERENCES.favoriteCalculators;
          break;
        case 'notifications':
          updates.notificationSettings = DEFAULT_USER_PREFERENCES.notificationSettings;
          break;
        case 'privacy':
          updates.privacySettings = DEFAULT_USER_PREFERENCES.privacySettings;
          break;
      }

      await this.updatePreferences(updates);
      console.log(`🔄 ${category} preferences reset to defaults`);
    } catch (error) {
      console.error(`❌ Failed to reset ${category} preferences:`, error);
      throw error;
    }
  }

  // ============================================================================
  // Specific Preference Helpers
  // ============================================================================

  /**
   * Add a calculator to favorites
   */
  public async addFavoriteCalculator(calculatorType: string): Promise<void> {
    const favorites = [...this.preferences.favoriteCalculators];
    if (!favorites.includes(calculatorType)) {
      favorites.push(calculatorType);
      await this.setPreference('favoriteCalculators', favorites);
    }
  }

  /**
   * Remove a calculator from favorites
   */
  public async removeFavoriteCalculator(calculatorType: string): Promise<void> {
    const favorites = this.preferences.favoriteCalculators.filter(
      calc => calc !== calculatorType
    );
    await this.setPreference('favoriteCalculators', favorites);
  }

  /**
   * Check if a calculator is in favorites
   */
  public isFavoriteCalculator(calculatorType: string): boolean {
    return this.preferences.favoriteCalculators.includes(calculatorType);
  }

  /**
   * Update notification settings
   */
  public async updateNotificationSettings(
    updates: Partial<NotificationSettings>
  ): Promise<void> {
    const newSettings = {
      ...this.preferences.notificationSettings,
      ...updates,
    };
    await this.setPreference('notificationSettings', newSettings);
  }

  /**
   * Update privacy settings
   */
  public async updatePrivacySettings(
    updates: Partial<PrivacySettings>
  ): Promise<void> {
    const newSettings = {
      ...this.preferences.privacySettings,
      ...updates,
    };
    await this.setPreference('privacySettings', newSettings);
  }

  // ============================================================================
  // Event Listeners
  // ============================================================================

  /**
   * Subscribe to preference changes
   */
  public subscribe(listener: (preferences: UserPreferences) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of preference changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getPreferences());
      } catch (error) {
        console.error('Error in preference listener:', error);
      }
    });
  }

  // ============================================================================
  // Storage Operations
  // ============================================================================

  /**
   * Save preferences to storage
   */
  public async saveToStorage(): Promise<void> {
    try {
      const data = JSON.stringify(this.preferences);
      localStorage.setItem(this.config.storageKey, data);
    } catch (error) {
      console.error('Failed to save preferences to storage:', error);
      throw error;
    }
  }

  /**
   * Load preferences from storage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Merge with defaults to handle new preference keys
        this.preferences = {
          ...DEFAULT_USER_PREFERENCES,
          ...data,
          // Ensure nested objects are properly merged
          notificationSettings: {
            ...DEFAULT_NOTIFICATION_SETTINGS,
            ...data.notificationSettings,
          },
          privacySettings: {
            ...DEFAULT_PRIVACY_SETTINGS,
            ...data.privacySettings,
          },
        };
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
      this.preferences = { ...DEFAULT_USER_PREFERENCES };
    }
  }

  /**
   * Setup cross-tab storage synchronization
   */
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.config.storageKey && event.newValue) {
        try {
          const newPreferences = JSON.parse(event.newValue);
          this.preferences = newPreferences;
          this.notifyListeners();
          console.log('🔄 Preferences synchronized from another tab');
        } catch (error) {
          console.error('Failed to sync preferences from storage event:', error);
        }
      }
    });
  }

  // ============================================================================
  // Validation
  // ============================================================================

  /**
   * Validate a preference value
   */
  private validatePreferenceValue(key: keyof UserPreferences, value: any): void {
    switch (key) {
      case 'defaultUnits':
        if (!['metric', 'imperial'].includes(value)) {
          throw new Error(`Invalid units: ${value}. Must be 'metric' or 'imperial'`);
        }
        break;
      case 'confidenceThreshold':
        if (typeof value !== 'number' || value < 0 || value > 1) {
          throw new Error(`Invalid confidence threshold: ${value}. Must be between 0 and 1`);
        }
        break;
      case 'favoriteCalculators':
        if (!Array.isArray(value)) {
          throw new Error(`Invalid favorite calculators: ${value}. Must be an array`);
        }
        break;
      case 'autoSaveCalculations':
      case 'showRecommendations':
        if (typeof value !== 'boolean') {
          throw new Error(`Invalid boolean value for ${String(key)}: ${value}`);
        }
        break;
    }
  }

  // ============================================================================
  // Export/Import
  // ============================================================================

  /**
   * Export preferences as JSON
   */
  public exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  /**
   * Import preferences from JSON
   */
  public async importPreferences(jsonData: string): Promise<void> {
    try {
      const importedPreferences = JSON.parse(jsonData);
      
      // Validate the imported data structure
      if (typeof importedPreferences !== 'object') {
        throw new Error('Invalid preferences data format');
      }

      // Merge with current preferences
      await this.updatePreferences(importedPreferences);
      
      console.log('📥 Preferences imported successfully');
    } catch (error) {
      console.error('❌ Failed to import preferences:', error);
      throw error;
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const userPreferencesService = new UserPreferencesService();

// Auto-initialize when imported
userPreferencesService.initialize().catch(console.error);
