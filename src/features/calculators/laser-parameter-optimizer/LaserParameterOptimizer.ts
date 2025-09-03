// Laser Parameter Optimizer Calculator Implementation
// Flagship AI-enhanced calculator for optimizing laser cutting parameters

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const laserParameterSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'brass', 'titanium']),
  thickness: z.number().min(0.1).max(100),
  laserType: z.enum(['fiber', 'co2', 'nd_yag', 'disk']),
  maxPower: z.number().min(100).max(50000),
  qualityRequirement: z.enum(['draft', 'standard', 'precision', 'ultra_precision'])
});

// Input types
export type LaserParameterInputs = z.infer<typeof laserParameterSchema>;

// Result types
export interface LaserParameterResults {
  optimalPower: number;        // Watts
  cuttingSpeed: number;        // mm/min
  gasPressure: number;         // bar
  focusPosition: number;       // mm
  qualityPrediction: number;   // 0-1 scale
  efficiency: number;          // percentage
  gasType: string;             // recommended gas
  nozzleDiameter: number;      // mm
  recommendations: string[];
  warnings: string[];
}

// Material properties database
const materialProperties = {
  steel: {
    density: 7.85,           // g/cm³
    meltingPoint: 1538,      // °C
    thermalConductivity: 50, // W/m·K
    absorptivity: {
      fiber: 0.85,
      co2: 0.15,
      nd_yag: 0.75,
      disk: 0.85
    },
    cuttingSpeedFactor: 1.0,
    recommendedGas: 'oxygen'
  },
  stainless_steel: {
    density: 8.0,
    meltingPoint: 1400,
    thermalConductivity: 16,
    absorptivity: {
      fiber: 0.80,
      co2: 0.12,
      nd_yag: 0.70,
      disk: 0.80
    },
    cuttingSpeedFactor: 0.8,
    recommendedGas: 'nitrogen'
  },
  aluminum: {
    density: 2.7,
    meltingPoint: 660,
    thermalConductivity: 237,
    absorptivity: {
      fiber: 0.75,
      co2: 0.08,
      nd_yag: 0.65,
      disk: 0.75
    },
    cuttingSpeedFactor: 1.2,
    recommendedGas: 'nitrogen'
  },
  copper: {
    density: 8.96,
    meltingPoint: 1085,
    thermalConductivity: 401,
    absorptivity: {
      fiber: 0.70,
      co2: 0.05,
      nd_yag: 0.60,
      disk: 0.70
    },
    cuttingSpeedFactor: 0.6,
    recommendedGas: 'nitrogen'
  },
  brass: {
    density: 8.5,
    meltingPoint: 930,
    thermalConductivity: 120,
    absorptivity: {
      fiber: 0.72,
      co2: 0.06,
      nd_yag: 0.62,
      disk: 0.72
    },
    cuttingSpeedFactor: 0.7,
    recommendedGas: 'nitrogen'
  },
  titanium: {
    density: 4.5,
    meltingPoint: 1668,
    thermalConductivity: 22,
    absorptivity: {
      fiber: 0.78,
      co2: 0.10,
      nd_yag: 0.68,
      disk: 0.78
    },
    cuttingSpeedFactor: 0.5,
    recommendedGas: 'argon'
  }
};

// Quality factors
const qualityFactors = {
  draft: { speedMultiplier: 1.5, powerMultiplier: 1.2, qualityScore: 0.6 },
  standard: { speedMultiplier: 1.0, powerMultiplier: 1.0, qualityScore: 0.8 },
  precision: { speedMultiplier: 0.7, powerMultiplier: 0.9, qualityScore: 0.95 },
  ultra_precision: { speedMultiplier: 0.5, powerMultiplier: 0.8, qualityScore: 0.98 }
};

export class LaserParameterOptimizer extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'laser-parameter-optimizer',
    title: 'Laser Parameter Optimizer',
    description: 'AI-enhanced optimization of laser cutting parameters for maximum efficiency and quality',
    category: 'Core Engineering',
    badge: 'AI Enhanced',
    iconName: 'Settings',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        help: 'Select the material to be cut',
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'copper', label: 'Copper' },
          { value: 'brass', label: 'Brass' },
          { value: 'titanium', label: 'Titanium' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 0.1,
        max: 100,
        step: 0.1,
        unit: 'mm',
        help: 'Thickness of the material in millimeters'
      },
      {
        id: 'laserType',
        label: 'Laser Type',
        type: 'select',
        required: true,
        help: 'Type of laser system being used',
        options: [
          { value: 'fiber', label: 'Fiber Laser' },
          { value: 'co2', label: 'CO2 Laser' },
          { value: 'nd_yag', label: 'Nd:YAG Laser' },
          { value: 'disk', label: 'Disk Laser' }
        ]
      },
      {
        id: 'maxPower',
        label: 'Maximum Laser Power',
        type: 'number',
        required: true,
        min: 100,
        max: 50000,
        step: 100,
        unit: 'W',
        help: 'Maximum available laser power in watts'
      },
      {
        id: 'qualityRequirement',
        label: 'Quality Requirement',
        type: 'select',
        required: true,
        help: 'Required cutting quality level',
        options: [
          { value: 'draft', label: 'Draft Quality' },
          { value: 'standard', label: 'Standard Quality' },
          { value: 'precision', label: 'Precision Quality' },
          { value: 'ultra_precision', label: 'Ultra Precision' }
        ]
      }
    ],
    resultType: 'parameters',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return laserParameterSchema;
  }

  customValidation(inputs: LaserParameterInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check material-laser compatibility
    const material = materialProperties[inputs.materialType];
    if (!material) {
      errors.push({
        field: 'materialType',
        message: `Material type '${inputs.materialType}' is not supported. Please select a valid material.`,
        code: 'INVALID_MATERIAL'
      });
      return { errors, warnings };
    }

    const absorptivity = material.absorptivity[inputs.laserType];
    if (absorptivity < 0.1) {
      warnings.push({
        field: 'laserType',
        message: `${inputs.laserType} laser has low absorptivity for ${inputs.materialType}. Consider fiber laser for better efficiency.`,
        code: 'LOW_ABSORPTIVITY'
      });
    }

    // Check power vs thickness ratio
    const powerDensity = inputs.maxPower / (inputs.thickness * inputs.thickness);
    if (powerDensity < 50) {
      warnings.push({
        field: 'maxPower',
        message: 'Low power density may result in poor cut quality or inability to cut through material.',
        code: 'LOW_POWER_DENSITY'
      });
    }

    // Check extreme thickness
    if (inputs.thickness > 50 && inputs.qualityRequirement === 'ultra_precision') {
      warnings.push({
        field: 'thickness',
        message: 'Ultra precision cutting may not be achievable at this thickness.',
        code: 'THICKNESS_PRECISION_CONFLICT'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: LaserParameterInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialProperties[inputs.materialType];
      const qualityFactor = qualityFactors[inputs.qualityRequirement];
      
      // Calculate optimal power (60-90% of max power for efficiency)
      const optimalPowerRatio = this.calculateOptimalPowerRatio(inputs, material);
      const optimalPower = Math.min(
        inputs.maxPower * optimalPowerRatio,
        inputs.maxPower * 0.9
      );

      // Calculate cutting speed using advanced algorithm
      const baseCuttingSpeed = this.calculateBaseCuttingSpeed(inputs, material, optimalPower);
      const cuttingSpeed = baseCuttingSpeed * qualityFactor.speedMultiplier;

      // Calculate gas pressure
      const gasPressure = this.calculateGasPressure(inputs, material);

      // Calculate focus position
      const focusPosition = this.calculateFocusPosition(inputs, material);

      // Calculate quality prediction
      const qualityPrediction = this.calculateQualityPrediction(
        inputs, material, optimalPower, cuttingSpeed
      );

      // Calculate efficiency
      const efficiency = this.calculateEfficiency(
        optimalPower, inputs.maxPower, cuttingSpeed, material
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        inputs, material, optimalPower, cuttingSpeed, qualityPrediction
      );

      // Generate warnings
      const warnings = this.generateWarnings(
        inputs, material, optimalPower, cuttingSpeed
      );

      const results: LaserParameterResults = {
        optimalPower: Math.round(optimalPower),
        cuttingSpeed: Math.round(cuttingSpeed),
        gasPressure: Math.round(gasPressure * 10) / 10,
        focusPosition: Math.round(focusPosition * 10) / 10,
        qualityPrediction: Math.round(qualityPrediction * 100) / 100,
        efficiency: Math.round(efficiency * 100) / 100,
        gasType: material.recommendedGas,
        nozzleDiameter: this.calculateNozzleDiameter(inputs.thickness),
        recommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateOptimalPowerRatio(
    inputs: LaserParameterInputs, 
    material: typeof materialProperties.steel
  ): number {
    const absorptivity = material.absorptivity[inputs.laserType];
    const thicknessFactor = Math.pow(inputs.thickness, 0.8);
    const basePowerRatio = 0.6 + (thicknessFactor / 100) * absorptivity;
    
    return Math.min(Math.max(basePowerRatio, 0.4), 0.9);
  }

  private calculateBaseCuttingSpeed(
    inputs: LaserParameterInputs,
    material: typeof materialProperties.steel,
    power: number
  ): number {
    const absorptivity = material.absorptivity[inputs.laserType];
    const effectivePower = power * absorptivity;
    const thicknessFactor = Math.pow(inputs.thickness, -1.2);
    const materialFactor = material.cuttingSpeedFactor;
    
    return effectivePower * thicknessFactor * materialFactor * 0.5;
  }

  private calculateGasPressure(
    inputs: LaserParameterInputs,
    material: typeof materialProperties.steel
  ): number {
    const basePressure = material.recommendedGas === 'oxygen' ? 0.8 : 12;
    const thicknessFactor = Math.sqrt(inputs.thickness);
    
    return basePressure * thicknessFactor;
  }

  private calculateFocusPosition(
    inputs: LaserParameterInputs,
    material: typeof materialProperties.steel
  ): number {
    // Focus position relative to material surface (negative = below surface)
    return -inputs.thickness * 0.3;
  }

  private calculateQualityPrediction(
    inputs: LaserParameterInputs,
    material: typeof materialProperties.steel,
    power: number,
    speed: number
  ): number {
    const qualityFactor = qualityFactors[inputs.qualityRequirement];
    const powerEfficiency = power / inputs.maxPower;
    const speedOptimality = 1 - Math.abs(speed - 3000) / 3000;
    const materialCompatibility = material.absorptivity[inputs.laserType];
    
    return (qualityFactor.qualityScore + powerEfficiency + speedOptimality + materialCompatibility) / 4;
  }

  private calculateEfficiency(
    power: number,
    maxPower: number,
    speed: number,
    material: typeof materialProperties.steel
  ): number {
    const powerEfficiency = (power / maxPower) * 100;
    const speedEfficiency = Math.min(speed / 5000, 1) * 100;
    
    return (powerEfficiency + speedEfficiency) / 2;
  }

  private calculateNozzleDiameter(thickness: number): number {
    if (thickness <= 3) return 1.0;
    if (thickness <= 6) return 1.5;
    if (thickness <= 12) return 2.0;
    if (thickness <= 20) return 2.5;
    return 3.0;
  }

  private generateRecommendations(
    inputs: LaserParameterInputs,
    material: typeof materialProperties.steel,
    power: number,
    speed: number,
    quality: number
  ): string[] {
    const recommendations: string[] = [];

    if (quality < 0.7) {
      recommendations.push('Consider reducing cutting speed for better quality');
    }

    if (power / inputs.maxPower > 0.85) {
      recommendations.push('High power usage - ensure adequate cooling');
    }

    if (material.recommendedGas === 'nitrogen' && inputs.thickness > 10) {
      recommendations.push('Consider using high-pressure nitrogen for thick sections');
    }

    if (inputs.laserType === 'co2' && inputs.materialType === 'aluminum') {
      recommendations.push('Fiber laser recommended for aluminum cutting');
    }

    return recommendations;
  }

  private generateWarnings(
    inputs: LaserParameterInputs,
    material: typeof materialProperties.steel,
    power: number,
    speed: number
  ): string[] {
    const warnings: string[] = [];

    if (speed < 500) {
      warnings.push('Very slow cutting speed may cause excessive heat buildup');
    }

    if (power > inputs.maxPower * 0.9) {
      warnings.push('Operating near maximum power - monitor for overheating');
    }

    if (inputs.thickness > 25 && inputs.qualityRequirement === 'ultra_precision') {
      warnings.push('Ultra precision may not be achievable at this thickness');
    }

    return warnings;
  }

  getExampleInputs(): LaserParameterInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserType: 'fiber',
      maxPower: 3000,
      qualityRequirement: 'standard'
    };
  }
}
