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

// Additional calculator preset parameter types
export interface CuttingTimeEstimatorPresetParameters extends PresetParameters {
  totalLength: number;
  pierceCount: number;
  materialType: string;
  thickness: number;
  cuttingSpeed: number;
  pierceTime: number;
  setupTime: number;
  gasType: string;
  complexity: string;
}

export interface GasConsumptionPresetParameters extends PresetParameters {
  gasType: string;
  pressure: number;
  flowRate: number;
  cuttingTime: number;
  materialType: string;
  thickness: number;
  nozzleDiameter: number;
  efficiency: number;
}

export interface LaserParameterOptimizerPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  quality: string;
  speed: string;
}

export interface ProductionCapacityPresetParameters extends PresetParameters {
  machineCount: number;
  workingHours: number;
  efficiency: number;
  downtime: number;
}

export interface QualityGradePresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  tolerance: number;
  surfaceFinish: string;
  edgeQuality: string;
}

export interface EnergyCostPresetParameters extends PresetParameters {
  laserPower: number;
  operatingTime: number;
  electricityRate: number;
  efficiency: number;
  auxiliaryPower: number;
}

export interface MaintenanceCostPresetParameters extends PresetParameters {
  machineValue: number;
  operatingHours: number;
  maintenanceRate: number;
  consumables: number;
}

export interface EquipmentComparisonPresetParameters extends PresetParameters {
  machine1: string;
  machine2: string;
  criteria: string;
  weights: string;
}

export interface KerfWidthPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  laserPower: number;
  gasType: string;
  cuttingSpeed: number;
}

// Additional calculator preset parameter types (Batch 2)
export interface BatchProcessingCalculatorPresetParameters extends PresetParameters {
  batchSize: number;
  partCount: number;
  setupTime: number;
  cycleTime: number;
}

export interface BeamQualityCalculatorPresetParameters extends PresetParameters {
  laserPower: number;
  beamDiameter: number;
  focusLength: number;
  wavelength: number;
}

export interface CompetitivePricingCalculatorPresetParameters extends PresetParameters {
  baseCost: number;
  margin: number;
  competitorPrice: number;
  marketFactor: number;
}

export interface CutPathOptimizerPresetParameters extends PresetParameters {
  partCount: number;
  sheetSize: { width: number; height: number };
  materialThickness: number;
  optimizationGoal: string;
}

export interface EdgeQualityPredictorCalculatorPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  cuttingSpeed: number;
  laserPower: number;
  gasType: string;
}

export interface FocusHeightCalculatorPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  lensType: string;
  beamDiameter: number;
}

export interface HeatAffectedZoneCalculatorPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  laserPower: number;
  cuttingSpeed: number;
  thermalConductivity: number;
}

export interface JobQueueOptimizerPresetParameters extends PresetParameters {
  jobCount: number;
  machineCount: number;
  priorityWeights: { urgency: number; profit: number; efficiency: number };
  workingHours: number;
}

export interface MaterialNestingOptimizerPresetParameters extends PresetParameters {
  parts: any[];
  sheetSize: { width: number; height: number };
  materialCost: number;
  wasteFactor: number;
}

export interface PowerRequirementCalculatorPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  cuttingSpeed: number;
  quality: string;
  gasType: string;
}

export interface ProfitMarginCalculatorPresetParameters extends PresetParameters {
  totalCost: number;
  targetMargin: number;
  marketPrice: number;
  competitionLevel: string;
}

export interface ProjectQuotingCalculatorPresetParameters extends PresetParameters {
  projectType: string;
  complexity: string;
  quantity: number;
  deadline: string;
  materialCost: number;
  laborHours: number;
}

export interface WarpingRiskCalculatorPresetParameters extends PresetParameters {
  materialType: string;
  thickness: number;
  partSize: { width: number; height: number };
  cuttingPattern: string;
  coolingRate: string;
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
