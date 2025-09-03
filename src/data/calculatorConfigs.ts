import { CalculatorConfig } from '../types/calculator';
import materialSelectionConfig from '../config/calculators/materialSelectionConfig';
import kerfWidthConfig from '../config/calculators/kerfWidthConfig';
import powerRequirementConfig from '../config/calculators/powerRequirementConfig';
import gasConsumptionConfig from '../config/calculators/gasConsumptionConfig';
import roiProfitConfig from '../config/calculators/roiProfitConfig';
import energyCostConfig from '../config/calculators/energyCostConfig';
import productionCapacityConfig from '../config/calculators/productionCapacityConfig';
import qualityGradeConfig from '../config/calculators/qualityGradeConfig';
import batchOptimizerConfig from '../config/calculators/batchOptimizerConfig';
import maintenanceCostConfig from '../config/calculators/maintenanceCostConfig';
import competitivePricingConfig from '../config/calculators/competitivePricingConfig';
import equipmentComparisonConfig from '../config/calculators/equipmentComparisonConfig';
import parameterOptimizerConfig from '../config/calculators/parameterOptimizerConfig';
// Phase 2 Batch 1: Parameter Setting Pain Points
import powerSpeedMatchingConfig from '../config/calculators/powerSpeedMatchingConfig';
import gasPressureSettingConfig from '../config/calculators/gasPressureSettingConfig';
import focusHeightConfig from '../config/calculators/focusHeightConfig';
import frequencySettingConfig from '../config/calculators/frequencySettingConfig';
import multiplePassConfig from '../config/calculators/multiplePassConfig';
// Phase 2 Batch 2: Material Waste Problems
import kerfCompensationConfig from '../config/calculators/kerfCompensationConfig';
import materialNestingConfig from '../config/calculators/materialNestingConfig';
import scrapUtilizationConfig from '../config/calculators/scrapUtilizationConfig';
import sheetOptimizationConfig from '../config/calculators/sheetOptimizationConfig';
import materialYieldConfig from '../config/calculators/materialYieldConfig';
// Phase 2 Batch 3: Quality Problem Prevention
import drossPreventionConfig from '../config/calculators/drossPreventionConfig';
import edgeQualityPredictorConfig from '../config/calculators/edgeQualityPredictorConfig';
import heatAffectedZoneConfig from '../config/calculators/heatAffectedZoneConfig';
import thermalDistortionConfig from '../config/calculators/thermalDistortionConfig';
import surfaceFinishOptimizerConfig from '../config/calculators/surfaceFinishOptimizerConfig';
// Phase 3 Batch 1: Direct Cost Control
import operatingCostAnalyzerConfig from '../config/calculators/operatingCostAnalyzerConfig';
import consumableCostTrackerConfig from '../config/calculators/consumableCostTrackerConfig';
import equipmentUtilizationConfig from '../config/calculators/equipmentUtilizationConfig';
import inventoryOptimizerConfig from '../config/calculators/inventoryOptimizerConfig';
import overheadAllocationConfig from '../config/calculators/overheadAllocationConfig';
// Phase 3 Batch 2: Time Management Pain Points
import setupTimeOptimizerConfig from '../config/calculators/setupTimeOptimizerConfig';
import jobSchedulingOptimizerConfig from '../config/calculators/jobSchedulingOptimizerConfig';
import workflowOptimizerConfig from '../config/calculators/workflowOptimizerConfig';
import downtimeAnalyzerConfig from '../config/calculators/downtimeAnalyzerConfig';
import batchOptimizerConfig from '../config/calculators/batchOptimizerConfig';
// Phase 3 Batch 3: Pricing Difficulties
import competitivePricingConfig from '../config/calculators/competitivePricingConfig';
import valueBasedPricingConfig from '../config/calculators/valueBased PricingConfig';
import profitMarginOptimizerConfig from '../config/calculators/profitMarginOptimizerConfig';
import breakEvenAnalysisConfig from '../config/calculators/breakEvenAnalysisConfig';
import costPlusPricingConfig from '../config/calculators/costPlusPricingConfig';
// Phase 4 Batch 1: Customer Acquisition Tools
import quoteGeneratorConfig from '../config/calculators/quoteGeneratorConfig';
import leadQualificationConfig from '../config/calculators/leadQualificationConfig';
import customerLifetimeValueConfig from '../config/calculators/customerLifetimeValueConfig';
import marketPenetrationConfig from '../config/calculators/marketPenetrationConfig';
import salesForecastingConfig from '../config/calculators/salesForecastingConfig';
// Phase 4 Batch 2: Capacity Planning Tools
import demandForecastingConfig from '../config/calculators/demandForecastingConfig';
import resourceAllocationConfig from '../config/calculators/resourceAllocationConfig';
import expansionPlanningConfig from '../config/calculators/expansionPlanningConfig';
import bottleneckAnalysisConfig from '../config/calculators/bottleneckAnalysisConfig';
import scalabilityAssessmentConfig from '../config/calculators/scalabilityAssessmentConfig';
// Phase 4 Batch 3: Market Analysis Tools
import competitorAnalysisConfig from '../config/calculators/competitorAnalysisConfig';
import marketSizingConfig from '../config/calculators/marketSizingConfig';
import pricingBenchmarksConfig from '../config/calculators/pricingBenchmarksConfig';
import trendAnalysisConfig from '../config/calculators/trendAnalysisConfig';
import opportunityAssessmentConfig from '../config/calculators/opportunityAssessmentConfig';
// Phase 5 Batch 1: Automotive Industry Tools
import automotiveSheetMetalConfig from '../config/calculators/automotiveSheetMetalConfig';
import chassisComponentConfig from '../config/calculators/chassisComponentConfig';
import interiorTrimConfig from '../config/calculators/interiorTrimConfig';
import exhaustSystemConfig from '../config/calculators/exhaustSystemConfig';
import safetyComponentConfig from '../config/calculators/safetyComponentConfig';
// Phase 5 Batch 2: Construction/Decoration Tools
import architecturalMetalConfig from '../config/calculators/architecturalMetalConfig';
import decorativePanelConfig from '../config/calculators/decorativePanelConfig';
import hvacDuctworkConfig from '../config/calculators/hvacDuctworkConfig';
import stairRailingConfig from '../config/calculators/stairRailingConfig';
import signageConfig from '../config/calculators/signageConfig';
// Phase 5 Batch 3: Precision Manufacturing Tools
import electronicsEnclosureConfig from '../config/calculators/electronicsEnclosureConfig';
import medicalDeviceConfig from '../config/calculators/medicalDeviceConfig';
import aerospaceComponentConfig from '../config/calculators/aerospaceComponentConfig';
import precisionInstrumentConfig from '../config/calculators/precisionInstrumentConfig';
import microComponentConfig from '../config/calculators/microComponentConfig';
// Phase 6: Final Integration
import customProjectConfig from '../config/calculators/customProjectConfig';

// Import core calculator configurations
import { coreCalculatorConfigsArray, calculatorCategories } from './coreCalculatorConfigs';

// Legacy interface for backward compatibility
export interface LegacyCalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  formula?: string;
  units?: any;
  inputs?: any[];
}

// Convert new format to legacy format for backward compatibility
function convertToLegacyFormat(newConfig: any): LegacyCalculatorConfig {
  return {
    id: newConfig.id,
    name: newConfig.title,
    description: newConfig.description,
    category: newConfig.category,
    icon: newConfig.iconName,
    formula: `${newConfig.title} - Professional laser cutting calculation`,
    units: {
      input: newConfig.inputs.reduce((acc: any, input: any) => {
        if (input.unit) {
          acc[input.id] = input.unit;
        }
        return acc;
      }, {}),
      output: newConfig.resultType
    },
    inputs: newConfig.inputs || []
  };
}

// Export the 20 core calculators in legacy format for backward compatibility
export const calculatorConfigs: LegacyCalculatorConfig[] = coreCalculatorConfigsArray.map(convertToLegacyFormat);

// Export categories for navigation
export const categories = calculatorCategories;

// Export count for verification
export const TOTAL_CALCULATORS = calculatorConfigs.length; // Should be 20

// Validation function to ensure we only have core calculators
export function validateCalculatorCount(): boolean {
  const expectedCount = 20;
  const actualCount = calculatorConfigs.length;

  if (actualCount !== expectedCount) {
    console.error(`Calculator count mismatch: expected ${expectedCount}, got ${actualCount}`);
    return false;
  }

  console.log(`✅ Calculator validation passed: ${actualCount} core calculators loaded`);
  return true;
}

// Initialize validation on module load
validateCalculatorCount();
      {
        id: 'length',
        label: 'Part Length',
        type: 'number',
        value: 100,
        unit: 'mm',
        min: 1,
        max: 3000,
        step: 1,
        required: true,
        description: 'Length of the part to be cut'
      },
      {
        id: 'width',
        label: 'Part Width',
        type: 'number',
        value: 100,
        unit: 'mm',
        min: 1,
        max: 1500,
        step: 1,
        required: true,
        description: 'Width of the part to be cut'
      },
      {
        id: 'cuttingLength',
        label: 'Total Cutting Length',
        type: 'number',
        value: 400,
        unit: 'mm',
        min: 1,
        max: 10000,
        step: 1,
        required: true,
        description: 'Total length of cuts required (perimeter + internal cuts)'
      },
      {
        id: 'quantity',
        label: 'Quantity',
        type: 'number',
        value: 1,
        min: 1,
        max: 10000,
        step: 1,
        required: true,
        description: 'Number of parts to produce'
      },
      {
        id: 'laborRate',
        label: 'Labor Rate',
        type: 'number',
        value: 25,
        unit: 'USD/hour',
        min: 5,
        max: 200,
        step: 1,
        required: true,
        description: 'Hourly labor cost including benefits'
      },
      {
        id: 'machineRate',
        label: 'Machine Rate',
        type: 'number',
        value: 75,
        unit: 'USD/hour',
        min: 10,
        max: 500,
        step: 1,
        required: true,
        description: 'Hourly machine operating cost'
      },
      {
        id: 'materialCostPerKg',
        label: 'Material Cost per kg',
        type: 'number',
        value: 0.8,
        unit: 'USD/kg',
        min: 0.1,
        max: 100,
        step: 0.1,
        required: true,
        description: 'Cost of raw material per kilogram'
      }
    ],
    examples: [
      {
        name: 'Small Steel Bracket',
        description: '3mm mild steel bracket, 50x50mm',
        inputs: {
          materialType: 'mild-steel',
          thickness: 3,
          length: 50,
          width: 50,
          cuttingLength: 200,
          quantity: 10,
          laborRate: 25,
          machineRate: 75,
          materialCostPerKg: 0.8
        },
        expectedResult: 15.2
      }
    ]
  },
  {
    id: 'cutting-time',
    name: 'Cutting Time Estimator',
    description: 'Estimate total cutting time including piercing, cutting, and setup time',
    category: 'Time & Efficiency',
    icon: 'Clock',
    formula: 'Total Time = Cutting Time + Piercing Time + Setup Time',
    units: {
      input: {
        thickness: 'mm',
        cuttingLength: 'mm',
        laserPower: 'W'
      },
      output: 'hours'
    },
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        value: 'mild-steel',
        options: [
          { value: 'mild-steel', label: 'Mild Steel' },
          { value: 'stainless-steel-304', label: 'Stainless Steel 304' },
          { value: 'aluminum-6061', label: 'Aluminum 6061' },
          { value: 'acrylic', label: 'Acrylic (PMMA)' },
          { value: 'plywood', label: 'Plywood' }
        ],
        required: true
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        value: 3,
        unit: 'mm',
        min: 0.1,
        max: 50,
        step: 0.1,
        required: true
      },
      {
        id: 'cuttingLength',
        label: 'Total Cutting Length',
        type: 'number',
        value: 400,
        unit: 'mm',
        min: 1,
        max: 10000,
        step: 1,
        required: true
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        value: 1000,
        unit: 'W',
        min: 50,
        max: 15000,
        step: 50,
        required: true
      },
      {
        id: 'quantity',
        label: 'Quantity',
        type: 'number',
        value: 1,
        min: 1,
        max: 10000,
        step: 1,
        required: true
      }
    ],
    examples: [
      {
        name: 'Standard Steel Cut',
        description: '3mm steel, 400mm cutting length',
        inputs: {
          materialType: 'mild-steel',
          thickness: 3,
          cuttingLength: 400,
          laserPower: 1000,
          quantity: 1
        },
        expectedResult: 0.25
      }
    ]
  },
  // Add new calculators from Batch 1
  materialSelectionConfig,
  kerfWidthConfig,
  powerRequirementConfig,
  gasConsumptionConfig,
  // Add new calculators from Batch 2
  roiProfitConfig,
  energyCostConfig,
  productionCapacityConfig,
  qualityGradeConfig,
  // Add new calculators from Batch 3
  batchOptimizerConfig,
  maintenanceCostConfig,
  competitivePricingConfig,
  equipmentComparisonConfig,
  parameterOptimizerConfig,
  // Phase 2 Batch 1: Parameter Setting Pain Points (5 calculators)
  powerSpeedMatchingConfig,
  gasPressureSettingConfig,
  focusHeightConfig,
  frequencySettingConfig,
  multiplePassConfig,
  // Phase 2 Batch 2: Material Waste Problems (5 calculators)
  kerfCompensationConfig,
  materialNestingConfig,
  scrapUtilizationConfig,
  sheetOptimizationConfig,
  materialYieldConfig,
  // Phase 2 Batch 3: Quality Problem Prevention (5 calculators)
  drossPreventionConfig,
  edgeQualityPredictorConfig,
  heatAffectedZoneConfig,
  thermalDistortionConfig,
  surfaceFinishOptimizerConfig,
  // Phase 3 Batch 1: Direct Cost Control (5 calculators)
  operatingCostAnalyzerConfig,
  consumableCostTrackerConfig,
  equipmentUtilizationConfig,
  inventoryOptimizerConfig,
  overheadAllocationConfig,
  // Phase 3 Batch 2: Time Management Pain Points (5 calculators)
  setupTimeOptimizerConfig,
  jobSchedulingOptimizerConfig,
  workflowOptimizerConfig,
  downtimeAnalyzerConfig,
  batchOptimizerConfig,
  // Phase 3 Batch 3: Pricing Difficulties (5 calculators)
  competitivePricingConfig,
  valueBasedPricingConfig,
  profitMarginOptimizerConfig,
  breakEvenAnalysisConfig,
  costPlusPricingConfig,
  // Phase 4 Batch 1: Customer Acquisition Tools (5 calculators)
  quoteGeneratorConfig,
  leadQualificationConfig,
  customerLifetimeValueConfig,
  marketPenetrationConfig,
  salesForecastingConfig,
  // Phase 4 Batch 2: Capacity Planning Tools (5 calculators)
  demandForecastingConfig,
  resourceAllocationConfig,
  expansionPlanningConfig,
  bottleneckAnalysisConfig,
  scalabilityAssessmentConfig,
  // Phase 4 Batch 3: Market Analysis Tools (5 calculators)
  competitorAnalysisConfig,
  marketSizingConfig,
  pricingBenchmarksConfig,
  trendAnalysisConfig,
  opportunityAssessmentConfig,
  // Phase 5 Batch 1: Automotive Industry Tools (5 calculators)
  automotiveSheetMetalConfig,
  chassisComponentConfig,
  interiorTrimConfig,
  exhaustSystemConfig,
  safetyComponentConfig,
  // Phase 5 Batch 2: Construction/Decoration Tools (5 calculators)
  architecturalMetalConfig,
  decorativePanelConfig,
  hvacDuctworkConfig,
  stairRailingConfig,
  signageConfig,
  // Phase 5 Batch 3: Precision Manufacturing Tools (5 calculators)
  electronicsEnclosureConfig,
  medicalDeviceConfig,
  aerospaceComponentConfig,
  precisionInstrumentConfig,
  microComponentConfig,
  // Phase 6: Final Integration (1 calculator)
  customProjectConfig,
];

export const getCalculatorConfig = (id: string): CalculatorConfig | undefined => {
  return calculatorConfigs.find(config => config.id === id);
};

export const getCalculatorsByCategory = (category: string): CalculatorConfig[] => {
  return calculatorConfigs.filter(config => config.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(calculatorConfigs.map(config => config.category)));
};
