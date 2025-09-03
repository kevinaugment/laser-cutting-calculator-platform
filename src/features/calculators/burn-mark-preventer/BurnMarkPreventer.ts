// Burn Mark Preventer Calculator Implementation
// Comprehensive burn mark prevention and thermal damage control

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const burnMarkPreventerSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.5).max(50),
  laserPower: z.number().min(500).max(20000),
  cuttingSpeed: z.number().min(100).max(15000),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  gasPressure: z.number().min(0.1).max(25),
  nozzleStandoff: z.number().min(0.5).max(5.0),
  surfaceCondition: z.enum(['clean', 'oily', 'oxidized', 'coated']),
  ambientTemperature: z.number().min(-10).max(50).optional().default(20)
});

// Input types
export type BurnMarkPreventerInputs = z.infer<typeof burnMarkPreventerSchema>;

// Result types
export interface BurnMarkPreventerResults {
  burnRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  burnRiskScore: number;           // 0-10 scale (10 = highest risk)
  thermalDamageAnalysis: {
    heatInput: number;             // J/mm
    surfaceTemperature: number;    // °C
    oxidationRisk: number;         // 0-1 scale
    thermalStress: number;         // MPa
    coolingRate: number;           // °C/s
  };
  burnMarkFactors: {
    powerDensityFactor: number;    // 0-1 scale
    gasEffectivenessFactor: number; // 0-1 scale
    surfaceConditionFactor: number; // 0-1 scale
    materialSusceptibility: number; // 0-1 scale
    geometryFactor: number;        // 0-1 scale
  };
  preventionStrategy: {
    parameterOptimization: {
      recommendedPower: number;     // W
      recommendedSpeed: number;     // mm/min
      recommendedPressure: number;  // bar
      recommendedStandoff: number;  // mm
    };
    gasOptimization: {
      optimalGasType: string;
      flowRate: number;             // L/min
      purityRequirement: string;
      coolingEffectiveness: number; // 0-1 scale
    };
    surfacePreparation: string[];
    processModifications: string[];
  };
  qualityPrediction: {
    expectedSurfaceQuality: number; // 1-5 scale
    discolorationRisk: 'none' | 'minimal' | 'moderate' | 'severe';
    oxidationDepth: number;        // μm
    heatAffectedZone: number;      // mm
  };
  recommendations: string[];
  warnings: string[];
}

// Material burn susceptibility database
const materialBurnProperties = {
  steel: {
    oxidationThreshold: 600,        // °C
    burnSusceptibility: 0.8,
    optimalGas: 'oxygen',
    heatCapacity: 490,              // J/kg·K
    thermalConductivity: 50,        // W/m·K
    surfaceEmissivity: 0.8,
    coolingEfficiency: 0.7
  },
  stainless_steel: {
    oxidationThreshold: 800,
    burnSusceptibility: 0.6,
    optimalGas: 'nitrogen',
    heatCapacity: 500,
    thermalConductivity: 16,
    surfaceEmissivity: 0.6,
    coolingEfficiency: 0.5
  },
  aluminum: {
    oxidationThreshold: 400,
    burnSusceptibility: 0.9,
    optimalGas: 'nitrogen',
    heatCapacity: 896,
    thermalConductivity: 237,
    surfaceEmissivity: 0.9,
    coolingEfficiency: 0.9
  },
  copper: {
    oxidationThreshold: 500,
    burnSusceptibility: 0.7,
    optimalGas: 'nitrogen',
    heatCapacity: 385,
    thermalConductivity: 401,
    surfaceEmissivity: 0.7,
    coolingEfficiency: 0.8
  },
  titanium: {
    oxidationThreshold: 450,
    burnSusceptibility: 0.95,
    optimalGas: 'argon',
    heatCapacity: 520,
    thermalConductivity: 22,
    surfaceEmissivity: 0.5,
    coolingEfficiency: 0.4
  },
  brass: {
    oxidationThreshold: 550,
    burnSusceptibility: 0.7,
    optimalGas: 'nitrogen',
    heatCapacity: 380,
    thermalConductivity: 120,
    surfaceEmissivity: 0.8,
    coolingEfficiency: 0.7
  }
};

// Gas properties for burn prevention
const gasProperties = {
  oxygen: {
    coolingEffect: 0.6,
    oxidationPrevention: 0.2,
    burnRiskMultiplier: 1.5,
    flowEfficiency: 0.8
  },
  nitrogen: {
    coolingEffect: 0.8,
    oxidationPrevention: 0.9,
    burnRiskMultiplier: 0.6,
    flowEfficiency: 0.9
  },
  air: {
    coolingEffect: 0.7,
    oxidationPrevention: 0.4,
    burnRiskMultiplier: 1.0,
    flowEfficiency: 0.7
  },
  argon: {
    coolingEffect: 0.9,
    oxidationPrevention: 0.95,
    burnRiskMultiplier: 0.4,
    flowEfficiency: 0.85
  }
};

export class BurnMarkPreventer extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'burn-mark-preventer',
    title: 'Burn Mark Preventer',
    description: 'Prevent burn marks and thermal damage with optimized parameters',
    category: 'Quality Control',
    badge: 'Standard',
    iconName: 'Shield',
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
          { value: 'titanium', label: 'Titanium' },
          { value: 'brass', label: 'Brass' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 0.5,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Thickness of the material'
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W',
        help: 'Laser power setting'
      },
      {
        id: 'cuttingSpeed',
        label: 'Cutting Speed',
        type: 'number',
        required: true,
        min: 100,
        max: 15000,
        step: 10,
        unit: 'mm/min',
        help: 'Cutting speed'
      },
      {
        id: 'assistGas',
        label: 'Assist Gas',
        type: 'select',
        required: true,
        help: 'Type of assist gas used',
        options: [
          { value: 'oxygen', label: 'Oxygen' },
          { value: 'nitrogen', label: 'Nitrogen' },
          { value: 'air', label: 'Compressed Air' },
          { value: 'argon', label: 'Argon' }
        ]
      },
      {
        id: 'gasPressure',
        label: 'Gas Pressure',
        type: 'number',
        required: true,
        min: 0.1,
        max: 25,
        step: 0.1,
        unit: 'bar',
        help: 'Assist gas pressure'
      },
      {
        id: 'nozzleStandoff',
        label: 'Nozzle Standoff',
        type: 'number',
        required: true,
        min: 0.5,
        max: 5.0,
        step: 0.1,
        unit: 'mm',
        help: 'Distance from nozzle to workpiece'
      },
      {
        id: 'surfaceCondition',
        label: 'Surface Condition',
        type: 'select',
        required: true,
        help: 'Current surface condition of the material',
        options: [
          { value: 'clean', label: 'Clean' },
          { value: 'oily', label: 'Oily/Greasy' },
          { value: 'oxidized', label: 'Oxidized/Rusty' },
          { value: 'coated', label: 'Coated/Painted' }
        ]
      },
      {
        id: 'ambientTemperature',
        label: 'Ambient Temperature',
        type: 'number',
        required: false,
        min: -10,
        max: 50,
        step: 1,
        unit: '°C',
        help: 'Ambient temperature (optional, default: 20°C)'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return burnMarkPreventerSchema;
  }

  customValidation(inputs: BurnMarkPreventerInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check power density
    const powerDensity = inputs.laserPower / inputs.thickness;
    if (powerDensity > 1000) {
      warnings.push({
        field: 'laserPower',
        message: 'High power density increases burn mark risk. Consider reducing power or increasing thickness.',
        code: 'HIGH_POWER_DENSITY'
      });
    }

    // Check gas compatibility
    const material = materialBurnProperties[inputs.materialType];
    if (inputs.assistGas !== material.optimalGas) {
      warnings.push({
        field: 'assistGas',
        message: `${material.optimalGas} is recommended for ${inputs.materialType} to minimize burn marks.`,
        code: 'SUBOPTIMAL_GAS'
      });
    }

    // Check surface condition
    if (inputs.surfaceCondition === 'oily' || inputs.surfaceCondition === 'coated') {
      warnings.push({
        field: 'surfaceCondition',
        message: 'Oily or coated surfaces significantly increase burn mark risk. Clean surface before cutting.',
        code: 'CONTAMINATED_SURFACE'
      });
    }

    // Check nozzle standoff
    if (inputs.nozzleStandoff > 2.0) {
      warnings.push({
        field: 'nozzleStandoff',
        message: 'Large nozzle standoff reduces gas effectiveness and increases burn risk.',
        code: 'EXCESSIVE_STANDOFF'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: BurnMarkPreventerInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialBurnProperties[inputs.materialType];
      const gas = gasProperties[inputs.assistGas];
      
      // Calculate thermal damage analysis
      const thermalDamageAnalysis = this.calculateThermalDamageAnalysis(inputs, material, gas);
      
      // Calculate burn mark factors
      const burnMarkFactors = this.calculateBurnMarkFactors(inputs, material, gas);
      
      // Calculate burn risk score and level
      const burnRiskScore = this.calculateBurnRiskScore(burnMarkFactors, thermalDamageAnalysis);
      const burnRiskLevel = this.determineBurnRiskLevel(burnRiskScore);
      
      // Generate prevention strategy
      const preventionStrategy = this.generatePreventionStrategy(inputs, material, gas, burnRiskScore);
      
      // Predict quality outcomes
      const qualityPrediction = this.predictQualityOutcomes(inputs, material, thermalDamageAnalysis, burnRiskScore);
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, burnRiskLevel, burnRiskScore);
      const warnings = this.generateWarnings(inputs, burnRiskLevel, burnRiskScore);

      const results: BurnMarkPreventerResults = {
        burnRiskLevel,
        burnRiskScore: Math.round(burnRiskScore * 10) / 10,
        thermalDamageAnalysis,
        burnMarkFactors,
        preventionStrategy,
        qualityPrediction,
        recommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Burn mark prevention calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateThermalDamageAnalysis(inputs: BurnMarkPreventerInputs, material: typeof materialBurnProperties.steel, gas: typeof gasProperties.oxygen) {
    // Calculate heat input per unit length
    const heatInput = (inputs.laserPower * 60) / inputs.cuttingSpeed; // J/mm
    
    // Calculate surface temperature
    const powerDensity = inputs.laserPower / inputs.thickness;
    const temperatureRise = powerDensity / (material.heatCapacity * material.thermalConductivity / 1000);
    const surfaceTemperature = inputs.ambientTemperature + temperatureRise;
    
    // Calculate oxidation risk
    const oxidationRisk = Math.min(1.0, 
      Math.max(0, (surfaceTemperature - material.oxidationThreshold) / material.oxidationThreshold)
    );
    
    // Calculate thermal stress
    const thermalExpansion = 12e-6; // Simplified average
    const elasticModulus = 200000; // MPa
    const thermalStress = thermalExpansion * temperatureRise * elasticModulus;
    
    // Calculate cooling rate
    const coolingRate = gas.coolingEffect * material.coolingEfficiency * inputs.gasPressure * 10;
    
    return {
      heatInput: Math.round(heatInput),
      surfaceTemperature: Math.round(surfaceTemperature),
      oxidationRisk: Math.round(oxidationRisk * 1000) / 1000,
      thermalStress: Math.round(thermalStress),
      coolingRate: Math.round(coolingRate * 10) / 10
    };
  }

  private calculateBurnMarkFactors(inputs: BurnMarkPreventerInputs, material: typeof materialBurnProperties.steel, gas: typeof gasProperties.oxygen) {
    // Power density factor
    const powerDensity = inputs.laserPower / inputs.thickness;
    const powerDensityFactor = Math.min(1.0, powerDensity / 1000);
    
    // Gas effectiveness factor
    const gasCompatibility = inputs.assistGas === material.optimalGas ? 1.0 : 0.7;
    const pressureEffectiveness = Math.min(1.0, inputs.gasPressure / 10);
    const standoffEffectiveness = Math.max(0.3, 1 - (inputs.nozzleStandoff - 1) / 3);
    const gasEffectivenessFactor = gasCompatibility * pressureEffectiveness * standoffEffectiveness;
    
    // Surface condition factor
    const surfaceFactors = { clean: 0.2, oily: 0.8, oxidized: 0.6, coated: 0.9 };
    const surfaceConditionFactor = surfaceFactors[inputs.surfaceCondition];
    
    // Material susceptibility
    const materialSusceptibility = material.burnSusceptibility;
    
    // Geometry factor (thickness effect)
    const geometryFactor = Math.min(1.0, inputs.thickness / 10);
    
    return {
      powerDensityFactor: Math.round(powerDensityFactor * 1000) / 1000,
      gasEffectivenessFactor: Math.round(gasEffectivenessFactor * 1000) / 1000,
      surfaceConditionFactor: Math.round(surfaceConditionFactor * 1000) / 1000,
      materialSusceptibility: Math.round(materialSusceptibility * 1000) / 1000,
      geometryFactor: Math.round(geometryFactor * 1000) / 1000
    };
  }

  private calculateBurnRiskScore(factors: any, thermal: any): number {
    // Weighted burn risk calculation
    const powerRisk = factors.powerDensityFactor * 3;
    const gasRisk = (1 - factors.gasEffectivenessFactor) * 2;
    const surfaceRisk = factors.surfaceConditionFactor * 2;
    const materialRisk = factors.materialSusceptibility * 2;
    const thermalRisk = thermal.oxidationRisk * 1;
    
    return Math.min(10, powerRisk + gasRisk + surfaceRisk + materialRisk + thermalRisk);
  }

  private determineBurnRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore <= 2.5) return 'low';
    if (riskScore <= 5.0) return 'medium';
    if (riskScore <= 7.5) return 'high';
    return 'critical';
  }

  private generatePreventionStrategy(inputs: BurnMarkPreventerInputs, material: typeof materialBurnProperties.steel, gas: typeof gasProperties.oxygen, riskScore: number) {
    // Parameter optimization
    const powerReduction = riskScore > 6 ? 0.8 : riskScore > 4 ? 0.9 : 1.0;
    const speedIncrease = riskScore > 6 ? 1.3 : riskScore > 4 ? 1.15 : 1.0;
    const pressureIncrease = riskScore > 5 ? 1.2 : 1.0;
    const standoffOptimization = Math.min(1.5, inputs.nozzleStandoff);
    
    const parameterOptimization = {
      recommendedPower: Math.round(inputs.laserPower * powerReduction),
      recommendedSpeed: Math.round(inputs.cuttingSpeed * speedIncrease),
      recommendedPressure: Math.round(inputs.gasPressure * pressureIncrease * 10) / 10,
      recommendedStandoff: Math.round(standoffOptimization * 10) / 10
    };
    
    // Gas optimization
    const optimalGasType = material.optimalGas;
    const flowRate = inputs.gasPressure * 15; // Simplified flow calculation
    const purityRequirement = material.burnSusceptibility > 0.8 ? 'High (>99.9%)' : 'Standard (>99.5%)';
    const coolingEffectiveness = gasProperties[optimalGasType].coolingEffect;
    
    const gasOptimization = {
      optimalGasType,
      flowRate: Math.round(flowRate),
      purityRequirement,
      coolingEffectiveness: Math.round(coolingEffectiveness * 1000) / 1000
    };
    
    // Surface preparation
    const surfacePreparation: string[] = [];
    if (inputs.surfaceCondition !== 'clean') {
      surfacePreparation.push('Clean surface thoroughly before cutting');
    }
    if (inputs.surfaceCondition === 'oily') {
      surfacePreparation.push('Degrease with appropriate solvent');
    }
    if (inputs.surfaceCondition === 'oxidized') {
      surfacePreparation.push('Remove rust and scale mechanically or chemically');
    }
    if (inputs.surfaceCondition === 'coated') {
      surfacePreparation.push('Remove coating or adjust parameters for coated material');
    }
    
    // Process modifications
    const processModifications: string[] = [];
    if (riskScore > 6) {
      processModifications.push('Use multiple passes with reduced power');
      processModifications.push('Implement active cooling between passes');
    }
    if (riskScore > 4) {
      processModifications.push('Optimize cutting sequence to minimize heat buildup');
      processModifications.push('Use pulsed mode if available');
    }
    if (inputs.materialType === 'titanium' || inputs.materialType === 'aluminum') {
      processModifications.push('Maintain inert atmosphere during cutting');
    }
    
    return {
      parameterOptimization,
      gasOptimization,
      surfacePreparation,
      processModifications
    };
  }

  private predictQualityOutcomes(inputs: BurnMarkPreventerInputs, material: typeof materialBurnProperties.steel, thermal: any, riskScore: number) {
    // Expected surface quality
    const expectedSurfaceQuality = Math.max(1, Math.min(5, 6 - riskScore));
    
    // Discoloration risk
    let discolorationRisk: 'none' | 'minimal' | 'moderate' | 'severe';
    if (thermal.oxidationRisk < 0.2) discolorationRisk = 'none';
    else if (thermal.oxidationRisk < 0.5) discolorationRisk = 'minimal';
    else if (thermal.oxidationRisk < 0.8) discolorationRisk = 'moderate';
    else discolorationRisk = 'severe';
    
    // Oxidation depth
    const oxidationDepth = thermal.oxidationRisk * 50; // μm
    
    // Heat affected zone
    const heatAffectedZone = Math.sqrt(thermal.heatInput / material.thermalConductivity) * 0.5;
    
    return {
      expectedSurfaceQuality: Math.round(expectedSurfaceQuality),
      discolorationRisk,
      oxidationDepth: Math.round(oxidationDepth * 10) / 10,
      heatAffectedZone: Math.round(heatAffectedZone * 100) / 100
    };
  }

  private generateRecommendations(inputs: BurnMarkPreventerInputs, riskLevel: string, riskScore: number): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('Critical burn risk - implement all prevention strategies immediately');
    }
    
    if (riskScore > 6) {
      recommendations.push('Reduce laser power and increase cutting speed');
      recommendations.push('Switch to optimal assist gas for material');
      recommendations.push('Implement active cooling strategies');
    }
    
    if (inputs.surfaceCondition !== 'clean') {
      recommendations.push('Clean and prepare surface before cutting');
    }
    
    if (inputs.assistGas !== materialBurnProperties[inputs.materialType].optimalGas) {
      recommendations.push(`Switch to ${materialBurnProperties[inputs.materialType].optimalGas} for optimal results`);
    }
    
    if (inputs.nozzleStandoff > 2.0) {
      recommendations.push('Reduce nozzle standoff distance for better gas effectiveness');
    }
    
    if (inputs.materialType === 'titanium' || inputs.materialType === 'aluminum') {
      recommendations.push('Use high-purity inert gas to prevent oxidation');
    }
    
    return recommendations;
  }

  private generateWarnings(inputs: BurnMarkPreventerInputs, riskLevel: string, riskScore: number): string[] {
    const warnings: string[] = [];
    
    if (riskLevel === 'critical') {
      warnings.push('Critical burn risk - parts may have severe surface damage');
    }
    
    if (riskLevel === 'high') {
      warnings.push('High burn risk - implement prevention strategies');
    }
    
    if (inputs.surfaceCondition === 'oily' || inputs.surfaceCondition === 'coated') {
      warnings.push('Surface contamination will significantly increase burn marks');
    }
    
    if (inputs.materialType === 'titanium' && inputs.assistGas === 'oxygen') {
      warnings.push('Oxygen with titanium will cause severe oxidation and burning');
    }
    
    if (inputs.materialType === 'aluminum' && inputs.assistGas === 'oxygen') {
      warnings.push('Oxygen with aluminum may cause excessive oxidation');
    }
    
    const powerDensity = inputs.laserPower / inputs.thickness;
    if (powerDensity > 1500) {
      warnings.push('Very high power density - expect significant thermal damage');
    }
    
    return warnings;
  }

  getExampleInputs(): BurnMarkPreventerInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserPower: 2000,
      cuttingSpeed: 2500,
      assistGas: 'oxygen',
      gasPressure: 1.2,
      nozzleStandoff: 1.5,
      surfaceCondition: 'clean',
      ambientTemperature: 20
    };
  }
}
