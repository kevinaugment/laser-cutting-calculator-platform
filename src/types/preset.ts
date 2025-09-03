/**
 * Preset Storage System Types
 * TypeScript interfaces for calculator parameter presets
 */

// Base preset interface
export interface BasePreset {
  id: string;
  name: string;
  description?: string;
  calculatorType: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isDefault?: boolean;
  version: string;
}

// Generic preset parameters (can be extended for specific calculators)
export interface PresetParameters {
  [key: string]: any;
}

// Complete preset with parameters
export interface Preset<T extends PresetParameters = PresetParameters> extends BasePreset {
  parameters: T;
}

// Preset collection for a specific calculator type
export interface PresetCollection {
  calculatorType: string;
  presets: Preset[];
  lastModified: string;
}

// Storage metadata
export interface StorageMetadata {
  version: string;
  totalPresets: number;
  storageUsed: number; // in bytes
  lastCleanup: string;
  collections: {
    [calculatorType: string]: {
      count: number;
      lastModified: string;
    };
  };
}

// Complete storage structure
export interface PresetStorage {
  metadata: StorageMetadata;
  collections: {
    [calculatorType: string]: PresetCollection;
  };
}

// Preset validation result
export interface PresetValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Export/Import structures
export interface PresetExport {
  version: string;
  exportedAt: string;
  calculatorType?: string; // If exporting specific calculator presets
  presets: Preset[];
  metadata?: {
    source: string;
    description?: string;
  };
}

export interface PresetImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  warnings: string[];
}

// Storage operation results
export interface StorageOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warning?: string;
}

// Storage limits and configuration
export interface StorageConfig {
  maxPresets: number;
  maxStorageSize: number; // in bytes
  maxPresetNameLength: number;
  maxDescriptionLength: number;
  allowedCalculatorTypes: string[];
  autoCleanup: boolean;
  cleanupThreshold: number; // percentage of storage used
}

// Preset search and filter options
export interface PresetSearchOptions {
  query?: string;
  calculatorType?: string;
  tags?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Preset search result
export interface PresetSearchResult {
  presets: Preset[];
  total: number;
  hasMore: boolean;
}

// Hook state interfaces
export interface UsePresetsState {
  presets: Preset[];
  loading: boolean;
  error: string | null;
  metadata: StorageMetadata | null;
}

export interface UseLocalStorageState<T> {
  value: T | null;
  loading: boolean;
  error: string | null;
}

// Event types for preset operations
export type PresetEventType = 
  | 'preset:created'
  | 'preset:updated'
  | 'preset:deleted'
  | 'preset:imported'
  | 'preset:exported'
  | 'storage:cleanup'
  | 'storage:error';

export interface PresetEvent {
  type: PresetEventType;
  payload: {
    presetId?: string;
    calculatorType?: string;
    data?: any;
    error?: string;
  };
  timestamp: string;
}

// Calculator-specific preset parameter types (examples)
export interface LaserCuttingCostPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  length: number;
  width: number;
  complexity: 'simple' | 'medium' | 'complex';
  quantity: number;
  urgency: 'standard' | 'rush';
}

export interface CuttingTimePresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  cuttingLength: number;
  piercingCount: number;
  cuttingSpeed: number;
  setupTime: number;
}

export interface GasConsumptionPresetParameters extends PresetParameters {
  gasType: 'oxygen' | 'nitrogen' | 'air';
  pressure: number;
  flowRate: number;
  cuttingTime: number;
  materialType: string;
  thickness: number;
}

// Type guards for runtime type checking
export const isValidPreset = (obj: any): obj is Preset => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.calculatorType === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    typeof obj.version === 'string' &&
    obj.parameters &&
    typeof obj.parameters === 'object'
  );
};

export const isValidPresetCollection = (obj: any): obj is PresetCollection => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.calculatorType === 'string' &&
    Array.isArray(obj.presets) &&
    typeof obj.lastModified === 'string' &&
    obj.presets.every(isValidPreset)
  );
};

export const isValidStorageMetadata = (obj: any): obj is StorageMetadata => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.version === 'string' &&
    typeof obj.totalPresets === 'number' &&
    typeof obj.storageUsed === 'number' &&
    typeof obj.lastCleanup === 'string' &&
    obj.collections &&
    typeof obj.collections === 'object'
  );
};
