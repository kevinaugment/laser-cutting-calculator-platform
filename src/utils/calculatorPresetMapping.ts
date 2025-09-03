/**
 * Calculator Preset Mapping Utilities
 * Tools for mapping and validating calculator-specific preset parameters
 */

import { PresetParameters } from '../types/preset';

// Calculator type definitions
export type CalculatorType = 
  | 'laser-cutting-cost'
  | 'cutting-time-estimator'
  | 'gas-consumption'
  | 'material-selection'
  | 'laser-parameter-optimizer'
  | 'production-capacity'
  | 'quality-grade'
  | 'energy-cost'
  | 'maintenance-cost'
  | 'equipment-comparison'
  | 'kerf-width'
  | 'power-requirement'
  | 'batch-processing'
  | 'competitive-pricing';

// Parameter mapping configurations for each calculator
export const CALCULATOR_PARAMETER_MAPS: Record<CalculatorType, {
  requiredFields: string[];
  optionalFields: string[];
  defaultValues: Record<string, any>;
  validation: Record<string, (value: any) => boolean>;
  displayNames: Record<string, string>;
}> = {
  'laser-cutting-cost': {
    requiredFields: ['materialType', 'thickness', 'length', 'width', 'quantity'],
    optionalFields: ['materialCost', 'laserPower', 'cuttingSpeed', 'gasType', 'gasConsumption', 'gasCost', 'electricityRate', 'laborRate', 'machineHourlyRate', 'setupTime', 'wasteFactor'],
    defaultValues: {
      materialType: 'Mild Steel',
      thickness: 3,
      length: 1000,
      width: 500,
      quantity: 1,
      materialCost: 2.5,
      laserPower: 1500,
      cuttingSpeed: 2500,
      gasType: 'Oxygen',
      gasConsumption: 0.8,
      gasCost: 0.15,
      electricityRate: 0.12,
      laborRate: 25,
      machineHourlyRate: 45,
      setupTime: 15,
      wasteFactor: 0.1,
    },
    validation: {
      thickness: (value) => value > 0 && value <= 100,
      length: (value) => value > 0 && value <= 10000,
      width: (value) => value > 0 && value <= 10000,
      quantity: (value) => value > 0 && value <= 10000,
      materialCost: (value) => value >= 0,
      laserPower: (value) => value > 0 && value <= 10000,
      cuttingSpeed: (value) => value > 0 && value <= 20000,
    },
    displayNames: {
      materialType: 'Material Type',
      thickness: 'Thickness (mm)',
      length: 'Length (mm)',
      width: 'Width (mm)',
      quantity: 'Quantity',
      materialCost: 'Material Cost ($/m²)',
      laserPower: 'Laser Power (W)',
      cuttingSpeed: 'Cutting Speed (mm/min)',
      gasType: 'Gas Type',
      gasConsumption: 'Gas Consumption (m³/h)',
      gasCost: 'Gas Cost ($/m³)',
      electricityRate: 'Electricity Rate ($/kWh)',
      laborRate: 'Labor Rate ($/h)',
      machineHourlyRate: 'Machine Rate ($/h)',
      setupTime: 'Setup Time (min)',
      wasteFactor: 'Waste Factor',
    },
  },
  
  'cutting-time-estimator': {
    requiredFields: ['totalLength', 'pierceCount', 'materialType', 'thickness'],
    optionalFields: ['cuttingSpeed', 'pierceTime', 'setupTime', 'gasType', 'complexity'],
    defaultValues: {
      totalLength: 1000,
      pierceCount: 4,
      materialType: 'steel',
      thickness: 3,
      cuttingSpeed: 2500,
      pierceTime: 0.8,
      setupTime: 15,
      gasType: 'oxygen',
      complexity: 'medium',
    },
    validation: {
      totalLength: (value) => value > 0 && value <= 100000,
      pierceCount: (value) => value >= 0 && value <= 1000,
      thickness: (value) => value > 0 && value <= 100,
      cuttingSpeed: (value) => value > 0 && value <= 20000,
      pierceTime: (value) => value >= 0 && value <= 10,
      setupTime: (value) => value >= 0 && value <= 300,
    },
    displayNames: {
      totalLength: 'Total Cut Length (mm)',
      pierceCount: 'Number of Pierces',
      materialType: 'Material Type',
      thickness: 'Thickness (mm)',
      cuttingSpeed: 'Cutting Speed (mm/min)',
      pierceTime: 'Pierce Time (s)',
      setupTime: 'Setup Time (min)',
      gasType: 'Gas Type',
      complexity: 'Geometry Complexity',
    },
  },
  
  'gas-consumption': {
    requiredFields: ['gasType', 'pressure', 'flowRate', 'cuttingTime'],
    optionalFields: ['materialType', 'thickness', 'nozzleDiameter', 'efficiency'],
    defaultValues: {
      gasType: 'oxygen',
      pressure: 1.5,
      flowRate: 0.8,
      cuttingTime: 60,
      materialType: 'steel',
      thickness: 3,
      nozzleDiameter: 1.5,
      efficiency: 0.85,
    },
    validation: {
      pressure: (value) => value > 0 && value <= 20,
      flowRate: (value) => value > 0 && value <= 10,
      cuttingTime: (value) => value > 0 && value <= 1440,
      thickness: (value) => value > 0 && value <= 100,
      nozzleDiameter: (value) => value > 0 && value <= 10,
      efficiency: (value) => value > 0 && value <= 1,
    },
    displayNames: {
      gasType: 'Gas Type',
      pressure: 'Pressure (bar)',
      flowRate: 'Flow Rate (m³/h)',
      cuttingTime: 'Cutting Time (min)',
      materialType: 'Material Type',
      thickness: 'Thickness (mm)',
      nozzleDiameter: 'Nozzle Diameter (mm)',
      efficiency: 'Efficiency Factor',
    },
  },

  // Add more calculator mappings as needed...
  'material-selection': {
    requiredFields: ['application', 'thickness', 'strength'],
    optionalFields: ['corrosionResistance', 'cost', 'availability'],
    defaultValues: {
      application: 'structural',
      thickness: 5,
      strength: 'medium',
      corrosionResistance: 'standard',
      cost: 'medium',
      availability: 'good',
    },
    validation: {
      thickness: (value) => value > 0 && value <= 100,
    },
    displayNames: {
      application: 'Application Type',
      thickness: 'Thickness (mm)',
      strength: 'Strength Requirement',
      corrosionResistance: 'Corrosion Resistance',
      cost: 'Cost Consideration',
      availability: 'Material Availability',
    },
  },

  // Placeholder mappings for other calculators
  'laser-parameter-optimizer': {
    requiredFields: ['materialType', 'thickness'],
    optionalFields: ['quality', 'speed'],
    defaultValues: { materialType: 'steel', thickness: 3, quality: 'medium', speed: 'medium' },
    validation: { thickness: (value) => value > 0 && value <= 100 },
    displayNames: { materialType: 'Material', thickness: 'Thickness (mm)', quality: 'Quality', speed: 'Speed' },
  },

  'production-capacity': {
    requiredFields: ['machineCount', 'workingHours'],
    optionalFields: ['efficiency', 'downtime'],
    defaultValues: { machineCount: 1, workingHours: 8, efficiency: 0.85, downtime: 0.1 },
    validation: { machineCount: (value) => value > 0, workingHours: (value) => value > 0 && value <= 24 },
    displayNames: { machineCount: 'Machine Count', workingHours: 'Working Hours', efficiency: 'Efficiency', downtime: 'Downtime' },
  },

  'quality-grade': {
    requiredFields: ['materialType', 'thickness', 'tolerance'],
    optionalFields: ['surfaceFinish', 'edgeQuality'],
    defaultValues: { materialType: 'steel', thickness: 3, tolerance: 0.1, surfaceFinish: 'standard', edgeQuality: 'good' },
    validation: { thickness: (value) => value > 0, tolerance: (value) => value > 0 },
    displayNames: { materialType: 'Material', thickness: 'Thickness (mm)', tolerance: 'Tolerance (mm)', surfaceFinish: 'Surface Finish', edgeQuality: 'Edge Quality' },
  },

  'energy-cost': {
    requiredFields: ['laserPower', 'operatingTime', 'electricityRate'],
    optionalFields: ['efficiency', 'auxiliaryPower'],
    defaultValues: { laserPower: 1500, operatingTime: 8, electricityRate: 0.12, efficiency: 0.85, auxiliaryPower: 200 },
    validation: { laserPower: (value) => value > 0, operatingTime: (value) => value > 0, electricityRate: (value) => value >= 0 },
    displayNames: { laserPower: 'Laser Power (W)', operatingTime: 'Operating Time (h)', electricityRate: 'Electricity Rate ($/kWh)', efficiency: 'Efficiency', auxiliaryPower: 'Auxiliary Power (W)' },
  },

  'maintenance-cost': {
    requiredFields: ['machineValue', 'operatingHours'],
    optionalFields: ['maintenanceRate', 'consumables'],
    defaultValues: { machineValue: 500000, operatingHours: 2000, maintenanceRate: 0.05, consumables: 1000 },
    validation: { machineValue: (value) => value > 0, operatingHours: (value) => value > 0 },
    displayNames: { machineValue: 'Machine Value ($)', operatingHours: 'Operating Hours', maintenanceRate: 'Maintenance Rate', consumables: 'Consumables Cost ($)' },
  },

  'equipment-comparison': {
    requiredFields: ['machine1', 'machine2'],
    optionalFields: ['criteria', 'weights'],
    defaultValues: { machine1: 'Machine A', machine2: 'Machine B', criteria: 'cost,speed,quality', weights: '1,1,1' },
    validation: {},
    displayNames: { machine1: 'Machine 1', machine2: 'Machine 2', criteria: 'Comparison Criteria', weights: 'Criteria Weights' },
  },

  'kerf-width': {
    requiredFields: ['materialType', 'thickness', 'laserPower'],
    optionalFields: ['gasType', 'cuttingSpeed'],
    defaultValues: { materialType: 'steel', thickness: 3, laserPower: 1500, gasType: 'oxygen', cuttingSpeed: 2500 },
    validation: { thickness: (value) => value > 0, laserPower: (value) => value > 0 },
    displayNames: { materialType: 'Material', thickness: 'Thickness (mm)', laserPower: 'Laser Power (W)', gasType: 'Gas Type', cuttingSpeed: 'Cutting Speed (mm/min)' },
  },

  'power-requirement': {
    requiredFields: ['materialType', 'thickness', 'cuttingSpeed'],
    optionalFields: ['quality', 'gasType'],
    defaultValues: { materialType: 'steel', thickness: 3, cuttingSpeed: 2500, quality: 'medium', gasType: 'oxygen' },
    validation: { thickness: (value) => value > 0, cuttingSpeed: (value) => value > 0 },
    displayNames: { materialType: 'Material', thickness: 'Thickness (mm)', cuttingSpeed: 'Cutting Speed (mm/min)', quality: 'Quality', gasType: 'Gas Type' },
  },

  'batch-processing': {
    requiredFields: ['batchSize', 'partCount'],
    optionalFields: ['setupTime', 'cycleTime'],
    defaultValues: { batchSize: 10, partCount: 100, setupTime: 30, cycleTime: 5 },
    validation: { batchSize: (value) => value > 0, partCount: (value) => value > 0 },
    displayNames: { batchSize: 'Batch Size', partCount: 'Part Count', setupTime: 'Setup Time (min)', cycleTime: 'Cycle Time (min)' },
  },

  'competitive-pricing': {
    requiredFields: ['baseCost', 'margin'],
    optionalFields: ['competitorPrice', 'marketFactor'],
    defaultValues: { baseCost: 100, margin: 0.3, competitorPrice: 150, marketFactor: 1.0 },
    validation: { baseCost: (value) => value > 0, margin: (value) => value >= 0 },
    displayNames: { baseCost: 'Base Cost ($)', margin: 'Profit Margin', competitorPrice: 'Competitor Price ($)', marketFactor: 'Market Factor' },
  },
};

/**
 * Validate preset parameters for a specific calculator type
 */
export function validateCalculatorPreset<T extends PresetParameters>(
  calculatorType: CalculatorType,
  parameters: T
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const config = CALCULATOR_PARAMETER_MAPS[calculatorType];
  if (!config) {
    return {
      isValid: false,
      errors: [`Unknown calculator type: ${calculatorType}`],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  for (const field of config.requiredFields) {
    if (!(field in parameters) || parameters[field] === undefined || parameters[field] === null) {
      errors.push(`Required field '${config.displayNames[field] || field}' is missing`);
    }
  }

  // Validate field values
  for (const [field, validator] of Object.entries(config.validation)) {
    if (field in parameters && parameters[field] !== undefined && parameters[field] !== null) {
      if (!validator(parameters[field])) {
        errors.push(`Invalid value for '${config.displayNames[field] || field}'`);
      }
    }
  }

  // Check for unknown fields (warnings)
  const knownFields = [...config.requiredFields, ...config.optionalFields];
  for (const field of Object.keys(parameters)) {
    if (!knownFields.includes(field)) {
      warnings.push(`Unknown field '${field}' will be ignored`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get default parameters for a calculator type
 */
export function getDefaultParameters<T extends PresetParameters>(
  calculatorType: CalculatorType
): T {
  const config = CALCULATOR_PARAMETER_MAPS[calculatorType];
  return (config?.defaultValues || {}) as T;
}

/**
 * Merge parameters with defaults for a calculator type
 */
export function mergeWithDefaults<T extends PresetParameters>(
  calculatorType: CalculatorType,
  parameters: Partial<T>
): T {
  const defaults = getDefaultParameters<T>(calculatorType);
  return { ...defaults, ...parameters };
}

/**
 * Get display name for a parameter field
 */
export function getParameterDisplayName(
  calculatorType: CalculatorType,
  fieldName: string
): string {
  const config = CALCULATOR_PARAMETER_MAPS[calculatorType];
  return config?.displayNames[fieldName] || fieldName;
}
