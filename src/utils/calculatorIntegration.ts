/**
 * Calculator Integration Utilities
 * Tools for integrating preset functionality into existing calculators
 */

import { PresetParameters } from '../types/preset';
import { CalculatorType, CALCULATOR_PARAMETER_MAPS } from './calculatorPresetMapping';

// Calculator integration status tracking
export interface CalculatorIntegrationStatus {
  calculatorType: CalculatorType;
  componentPath: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'tested';
  presetSupport: boolean;
  parameterMapping: boolean;
  uiIntegration: boolean;
  testCoverage: boolean;
  notes?: string;
}

// Complete list of calculators to integrate
export const CALCULATOR_INTEGRATION_PLAN: CalculatorIntegrationStatus[] = [
  // Batch 1: Core Calculators (9)
  {
    calculatorType: 'laser-cutting-cost',
    componentPath: 'src/components/calculators/LaserCuttingCostCalculator',
    status: 'in-progress',
    presetSupport: true,
    parameterMapping: true,
    uiIntegration: true,
    testCoverage: true,
    notes: 'Primary calculator - full integration with preset management'
  },
  {
    calculatorType: 'cutting-time-estimator',
    componentPath: 'src/components/calculators/CuttingTimeEstimator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Time-based calculations with material and geometry parameters'
  },
  {
    calculatorType: 'gas-consumption',
    componentPath: 'src/components/calculators/GasConsumptionCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Gas usage calculations for different cutting operations'
  },
  {
    calculatorType: 'material-selection',
    componentPath: 'src/components/calculators/MaterialSelectionAssistant',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Material recommendation based on application requirements'
  },
  {
    calculatorType: 'laser-parameter-optimizer',
    componentPath: 'src/components/calculators/LaserParameterOptimizer',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Optimization of laser settings for different materials'
  },
  {
    calculatorType: 'production-capacity',
    componentPath: 'src/components/calculators/ProductionCapacityCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Production planning and capacity calculations'
  },
  {
    calculatorType: 'quality-grade',
    componentPath: 'src/components/calculators/QualityGradeCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Quality assessment and grading system'
  },
  {
    calculatorType: 'energy-cost',
    componentPath: 'src/components/calculators/EnergyCostCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Energy consumption and cost calculations'
  },
  {
    calculatorType: 'maintenance-cost',
    componentPath: 'src/components/calculators/MaintenanceCostCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Maintenance scheduling and cost estimation'
  },

  // Batch 2: Advanced Calculators (9)
  {
    calculatorType: 'equipment-comparison',
    componentPath: 'src/components/calculators/EquipmentComparisonCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Equipment comparison and selection tool'
  },
  {
    calculatorType: 'kerf-width',
    componentPath: 'src/components/calculators/KerfWidthCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Kerf width calculation for different materials and settings'
  },
  {
    calculatorType: 'power-requirement',
    componentPath: 'src/components/calculators/PowerRequirementCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Laser power requirement calculations'
  },
  {
    calculatorType: 'batch-processing',
    componentPath: 'src/components/calculators/BatchProcessingCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Batch processing optimization and scheduling'
  },
  {
    calculatorType: 'competitive-pricing',
    componentPath: 'src/components/calculators/CompetitivePricingCalculator',
    status: 'not-started',
    presetSupport: false,
    parameterMapping: true,
    uiIntegration: false,
    testCoverage: false,
    notes: 'Competitive pricing analysis and strategy'
  },
];

/**
 * Get integration status for a specific calculator
 */
export function getCalculatorIntegrationStatus(calculatorType: CalculatorType): CalculatorIntegrationStatus | null {
  return CALCULATOR_INTEGRATION_PLAN.find(calc => calc.calculatorType === calculatorType) || null;
}

/**
 * Update integration status for a calculator
 */
export function updateCalculatorIntegrationStatus(
  calculatorType: CalculatorType,
  updates: Partial<CalculatorIntegrationStatus>
): void {
  const index = CALCULATOR_INTEGRATION_PLAN.findIndex(calc => calc.calculatorType === calculatorType);
  if (index !== -1) {
    CALCULATOR_INTEGRATION_PLAN[index] = { ...CALCULATOR_INTEGRATION_PLAN[index], ...updates };
  }
}

/**
 * Get calculators by integration status
 */
export function getCalculatorsByStatus(status: CalculatorIntegrationStatus['status']): CalculatorIntegrationStatus[] {
  return CALCULATOR_INTEGRATION_PLAN.filter(calc => calc.status === status);
}

/**
 * Get integration progress statistics
 */
export function getIntegrationProgress(): {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  tested: number;
  percentage: number;
} {
  const total = CALCULATOR_INTEGRATION_PLAN.length;
  const completed = CALCULATOR_INTEGRATION_PLAN.filter(calc => calc.status === 'completed').length;
  const inProgress = CALCULATOR_INTEGRATION_PLAN.filter(calc => calc.status === 'in-progress').length;
  const notStarted = CALCULATOR_INTEGRATION_PLAN.filter(calc => calc.status === 'not-started').length;
  const tested = CALCULATOR_INTEGRATION_PLAN.filter(calc => calc.status === 'tested').length;
  const percentage = Math.round(((completed + tested) / total) * 100);

  return {
    total,
    completed,
    inProgress,
    notStarted,
    tested,
    percentage,
  };
}

/**
 * Generate integration checklist for a calculator
 */
export function generateIntegrationChecklist(calculatorType: CalculatorType): {
  tasks: Array<{
    id: string;
    description: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  estimatedHours: number;
} {
  const status = getCalculatorIntegrationStatus(calculatorType);
  const config = CALCULATOR_PARAMETER_MAPS[calculatorType];

  const tasks = [
    {
      id: 'parameter-mapping',
      description: 'Define parameter mapping and validation rules',
      completed: status?.parameterMapping || false,
      priority: 'high' as const,
    },
    {
      id: 'preset-support',
      description: 'Integrate useCalculatorPresets hook',
      completed: status?.presetSupport || false,
      priority: 'high' as const,
    },
    {
      id: 'ui-integration',
      description: 'Add CalculatorLayout wrapper and preset UI',
      completed: status?.uiIntegration || false,
      priority: 'high' as const,
    },
    {
      id: 'parameter-sync',
      description: 'Implement parameter synchronization with presets',
      completed: false,
      priority: 'medium' as const,
    },
    {
      id: 'validation',
      description: 'Add preset parameter validation',
      completed: false,
      priority: 'medium' as const,
    },
    {
      id: 'testing',
      description: 'Write integration tests',
      completed: status?.testCoverage || false,
      priority: 'medium' as const,
    },
    {
      id: 'documentation',
      description: 'Update component documentation',
      completed: false,
      priority: 'low' as const,
    },
  ];

  // Estimate hours based on complexity
  const complexityMultiplier = config ? (config.requiredFields.length + config.optionalFields.length) / 10 : 1;
  const baseHours = 4; // Base integration time
  const estimatedHours = Math.ceil(baseHours * complexityMultiplier);

  return {
    tasks,
    estimatedHours,
  };
}

/**
 * Validate calculator integration completeness
 */
export function validateCalculatorIntegration(calculatorType: CalculatorType): {
  isComplete: boolean;
  missingComponents: string[];
  recommendations: string[];
} {
  const status = getCalculatorIntegrationStatus(calculatorType);
  const config = CALCULATOR_PARAMETER_MAPS[calculatorType];
  
  const missingComponents: string[] = [];
  const recommendations: string[] = [];

  if (!status) {
    return {
      isComplete: false,
      missingComponents: ['Integration status not found'],
      recommendations: ['Add calculator to integration plan'],
    };
  }

  if (!config) {
    missingComponents.push('Parameter mapping configuration');
    recommendations.push('Define parameter mapping in calculatorPresetMapping.ts');
  }

  if (!status.presetSupport) {
    missingComponents.push('Preset hook integration');
    recommendations.push('Integrate useCalculatorPresets hook');
  }

  if (!status.uiIntegration) {
    missingComponents.push('UI integration');
    recommendations.push('Wrap component with CalculatorLayout');
  }

  if (!status.parameterMapping) {
    missingComponents.push('Parameter mapping');
    recommendations.push('Implement parameter mapping logic');
  }

  if (!status.testCoverage) {
    missingComponents.push('Test coverage');
    recommendations.push('Add integration tests');
  }

  const isComplete = missingComponents.length === 0 && status.status === 'tested';

  return {
    isComplete,
    missingComponents,
    recommendations,
  };
}
