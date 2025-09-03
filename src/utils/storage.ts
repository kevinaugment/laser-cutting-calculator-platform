/**
 * Storage Utilities
 * Core localStorage utilities with error handling and validation
 */

import { 
  PresetStorage, 
  StorageMetadata, 
  StorageOperationResult, 
  StorageConfig,
  PresetValidationResult,
  Preset,
  PresetCollection
} from '../types/preset';

// Default storage configuration
export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  maxPresets: 1000,
  maxStorageSize: 5 * 1024 * 1024, // 5MB
  maxPresetNameLength: 100,
  maxDescriptionLength: 500,
  allowedCalculatorTypes: [
    'laser-cutting-cost',
    'cutting-time-estimator',
    'gas-consumption',
    'material-selection',
    'laser-parameter-optimizer',
    'production-capacity',
    'quality-grade',
    'energy-cost',
    'maintenance-cost',
    'equipment-comparison'
  ],
  autoCleanup: true,
  cleanupThreshold: 80, // 80% of storage used
};

// Storage keys
export const STORAGE_KEYS = {
  PRESET_STORAGE: 'laser-calc-presets',
  STORAGE_CONFIG: 'laser-calc-storage-config',
  LAST_BACKUP: 'laser-calc-last-backup',
} as const;

/**
 * Check if localStorage is available and working
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
}

/**
 * Get current storage usage in bytes
 */
export function getStorageUsage(): number {
  if (!isLocalStorageAvailable()) return 0;
  
  let totalSize = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }
  return totalSize;
}

/**
 * Get available storage space
 */
export function getAvailableStorage(): number {
  const config = getStorageConfig();
  const used = getStorageUsage();
  return Math.max(0, config.maxStorageSize - used);
}

/**
 * Check if storage is near capacity
 */
export function isStorageNearCapacity(): boolean {
  const config = getStorageConfig();
  const used = getStorageUsage();
  const usagePercentage = (used / config.maxStorageSize) * 100;
  return usagePercentage >= config.cleanupThreshold;
}

/**
 * Get storage configuration
 */
export function getStorageConfig(): StorageConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STORAGE_CONFIG);
    if (stored) {
      const config = JSON.parse(stored);
      return { ...DEFAULT_STORAGE_CONFIG, ...config };
    }
  } catch (error) {
    console.warn('Failed to load storage config:', error);
  }
  return DEFAULT_STORAGE_CONFIG;
}

/**
 * Update storage configuration
 */
export function updateStorageConfig(updates: Partial<StorageConfig>): StorageOperationResult<StorageConfig> {
  try {
    const currentConfig = getStorageConfig();
    const newConfig = { ...currentConfig, ...updates };
    
    localStorage.setItem(STORAGE_KEYS.STORAGE_CONFIG, JSON.stringify(newConfig));
    
    return {
      success: true,
      data: newConfig,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update storage config: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validate preset data
 */
export function validatePreset(preset: any): PresetValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config = getStorageConfig();

  // Required fields
  if (!preset.id || typeof preset.id !== 'string') {
    errors.push('Preset ID is required and must be a string');
  }

  if (!preset.name || typeof preset.name !== 'string') {
    errors.push('Preset name is required and must be a string');
  } else if (preset.name.length > config.maxPresetNameLength) {
    errors.push(`Preset name exceeds maximum length of ${config.maxPresetNameLength} characters`);
  }

  if (!preset.calculatorType || typeof preset.calculatorType !== 'string') {
    errors.push('Calculator type is required and must be a string');
  } else if (!config.allowedCalculatorTypes.includes(preset.calculatorType)) {
    errors.push(`Calculator type '${preset.calculatorType}' is not allowed`);
  }

  if (!preset.parameters || typeof preset.parameters !== 'object') {
    errors.push('Preset parameters are required and must be an object');
  }

  if (!preset.version || typeof preset.version !== 'string') {
    errors.push('Preset version is required and must be a string');
  }

  // Optional fields validation
  if (preset.description && typeof preset.description !== 'string') {
    errors.push('Preset description must be a string');
  } else if (preset.description && preset.description.length > config.maxDescriptionLength) {
    errors.push(`Preset description exceeds maximum length of ${config.maxDescriptionLength} characters`);
  }

  if (preset.tags && !Array.isArray(preset.tags)) {
    errors.push('Preset tags must be an array');
  }

  // Date validation
  try {
    if (preset.createdAt) new Date(preset.createdAt);
    if (preset.updatedAt) new Date(preset.updatedAt);
  } catch (error) {
    errors.push('Invalid date format in createdAt or updatedAt');
  }

  // Warnings
  if (!preset.description) {
    warnings.push('Preset description is recommended for better organization');
  }

  if (!preset.tags || preset.tags.length === 0) {
    warnings.push('Adding tags helps with preset organization and search');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get preset storage data
 */
export function getPresetStorage(): StorageOperationResult<PresetStorage> {
  try {
    if (!isLocalStorageAvailable()) {
      return {
        success: false,
        error: 'localStorage is not available',
      };
    }

    const stored = localStorage.getItem(STORAGE_KEYS.PRESET_STORAGE);
    if (!stored) {
      // Initialize empty storage
      const emptyStorage: PresetStorage = {
        metadata: {
          version: '1.0.0',
          totalPresets: 0,
          storageUsed: 0,
          lastCleanup: new Date().toISOString(),
          collections: {},
        },
        collections: {},
      };
      return {
        success: true,
        data: emptyStorage,
      };
    }

    const storage: PresetStorage = JSON.parse(stored);
    return {
      success: true,
      data: storage,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to load preset storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Save preset storage data
 */
export function savePresetStorage(storage: PresetStorage): StorageOperationResult<void> {
  try {
    if (!isLocalStorageAvailable()) {
      return {
        success: false,
        error: 'localStorage is not available',
      };
    }

    // Update metadata
    storage.metadata.storageUsed = getStorageUsage();
    storage.metadata.totalPresets = Object.values(storage.collections)
      .reduce((total, collection) => total + collection.presets.length, 0);

    const serialized = JSON.stringify(storage);
    
    // Check if we have enough space
    const requiredSpace = serialized.length;
    const availableSpace = getAvailableStorage();
    
    if (requiredSpace > availableSpace) {
      return {
        success: false,
        error: `Not enough storage space. Required: ${requiredSpace} bytes, Available: ${availableSpace} bytes`,
      };
    }

    localStorage.setItem(STORAGE_KEYS.PRESET_STORAGE, serialized);
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to save preset storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Clear all preset storage data
 */
export function clearPresetStorage(): StorageOperationResult<void> {
  try {
    if (!isLocalStorageAvailable()) {
      return {
        success: false,
        error: 'localStorage is not available',
      };
    }

    localStorage.removeItem(STORAGE_KEYS.PRESET_STORAGE);
    localStorage.removeItem(STORAGE_KEYS.LAST_BACKUP);
    
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to clear preset storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Cleanup old or unused presets
 */
export function cleanupStorage(): StorageOperationResult<{ cleaned: number; spaceSaved: number }> {
  try {
    const storageResult = getPresetStorage();
    if (!storageResult.success || !storageResult.data) {
      return {
        success: false,
        error: 'Failed to load storage for cleanup',
      };
    }

    const storage = storageResult.data;
    const config = getStorageConfig();
    let cleaned = 0;
    let spaceSaved = 0;

    // Remove presets that exceed the limit (keep most recent)
    for (const [calculatorType, collection] of Object.entries(storage.collections)) {
      const maxPresetsPerType = Math.floor(config.maxPresets / config.allowedCalculatorTypes.length);
      
      if (collection.presets.length > maxPresetsPerType) {
        // Sort by updatedAt descending and keep only the most recent
        collection.presets.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        
        const toRemove = collection.presets.splice(maxPresetsPerType);
        cleaned += toRemove.length;
        spaceSaved += JSON.stringify(toRemove).length;
        
        collection.lastModified = new Date().toISOString();
      }
    }

    // Update cleanup timestamp
    storage.metadata.lastCleanup = new Date().toISOString();

    // Save cleaned storage
    const saveResult = savePresetStorage(storage);
    if (!saveResult.success) {
      return saveResult;
    }

    return {
      success: true,
      data: { cleaned, spaceSaved },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to cleanup storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
