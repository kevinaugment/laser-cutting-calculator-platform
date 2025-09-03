# New Preset Type Definitions

Add these to src/types/preset.ts:

```typescript
export interface BatchProcessingCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  batchSize: any;
  partCount: any;
  setupTime: any;
  cycleTime: any;
}

export interface BeamQualityCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  laserPower: any;
  beamDiameter: any;
  focusLength: any;
  wavelength: any;
}

export interface CompetitivePricingCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  baseCost: any;
  margin: any;
  competitorPrice: any;
  marketFactor: any;
}

export interface CutPathOptimizerPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  partCount: any;
  sheetSize: any;
  width: any;
  height: any;
  materialThickness: any;
  optimizationGoal: any;
}

export interface EdgeQualityPredictorCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  materialType: any;
  thickness: any;
  cuttingSpeed: any;
  laserPower: any;
  gasType: any;
}

export interface FocusHeightCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  materialType: any;
  thickness: any;
  lensType: any;
  beamDiameter: any;
}

export interface HeatAffectedZoneCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  materialType: any;
  thickness: any;
  laserPower: any;
  cuttingSpeed: any;
  thermalConductivity: any;
}

export interface JobQueueOptimizerPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  jobCount: any;
  machineCount: any;
  priorityWeights: any;
  urgency: any;
  profit: any;
  efficiency: any;
  workingHours: any;
}

export interface MaterialNestingOptimizerPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  parts: any;
  sheetSize: any;
  width: any;
  height: any;
  materialCost: any;
  wasteFactor: any;
}

export interface PowerRequirementCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  materialType: any;
  thickness: any;
  cuttingSpeed: any;
  quality: any;
  gasType: any;
}

export interface ProfitMarginCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  totalCost: any;
  targetMargin: any;
  marketPrice: any;
  competitionLevel: any;
}

export interface ProjectQuotingCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  projectType: any;
  complexity: any;
  quantity: any;
  deadline: any;
  materialCost: any;
  laborHours: any;
}

export interface WarpingRiskCalculatorPresetParameters extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  materialType: any;
  thickness: any;
  partSize: any;
  width: any;
  height: any;
  cuttingPattern: any;
  coolingRate: any;
}

```