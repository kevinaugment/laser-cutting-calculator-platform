// Power-Speed Matching Calculator Implementation
// Comprehensive power-speed optimization for laser cutting parameters

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const powerSpeedMatchingSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.1).max(50),
  laserType: z.enum(['fiber', 'co2', 'diode']),
  maxPower: z.number().min(50).max(20000),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  qualityRequirement: z.enum(['rough', 'standard', 'precision', 'mirror']),
  priorityGoal: z.enum(['speed', 'quality', 'efficiency', 'balanced']),
  currentPower: z.number().min(0).max(20000).optional(),
  currentSpeed: z.number().min(0).max(15000).optional()
});

// Input types
export type PowerSpeedMatchingInputs = z.infer<typeof powerSpeedMatchingSchema>;

// Result types
export interface PowerSpeedMatchingResults {
  optimalSettings: {
    power: number;                  // W
    speed: number;                  // mm/min
    powerPercentage: number;        // % of max power
    powerDensity: number;           // W/mm²
    specificEnergy: number;         // J/mm³
  };
  performancePrediction: {
    cuttingEfficiency: number;      // %
    edgeQuality: number;            // 1-10 scale
    expectedKerf: number;           // mm
    surfaceRoughness: string;       // Ra value
    heatAffectedZone: number;       // mm
  };
  alternativeSettings: Array<{
    name: string;
    power: number;                  // W
    speed: number;                  // mm/min
    tradeoff: string;
    efficiency: number;             // %
    qualityScore: number;           // 1-10 scale
  }>;
  optimizationAnalysis: {
    powerUtilization: number;       // %
    speedOptimization: number;      // %
    energyEfficiency: number;       // %
    productivityGain: number;       // %
    qualityImprovement: number;     // %
  };
  processRecommendations: {
    parameterAdjustments: string[];
    qualityTips: string[];
    efficiencyTips: string[];
    troubleshooting: string[];
  };
  warnings: string[];
}

// Material cutting properties
const materialCuttingProperties = {
  steel: {
    basePowerFactor: 0.8,
    baseSpeedFactor: 1.0,
    optimalPowerDensity: 2.5,
    thermalConductivity: 50,
    absorptionCoefficient: 0.85,
    qualityFactor: 0.85
  },
  stainless_steel: {
    basePowerFactor: 1.0,
    baseSpeedFactor: 0.8,
    optimalPowerDensity: 3.0,
    thermalConductivity: 16,
    absorptionCoefficient: 0.75,
    qualityFactor: 0.90
  },
  aluminum: {
    basePowerFactor: 1.2,
    baseSpeedFactor: 1.5,
    optimalPowerDensity: 4.0,
    thermalConductivity: 237,
    absorptionCoefficient: 0.65,
    qualityFactor: 0.80
  },
  copper: {
    basePowerFactor: 1.5,
    baseSpeedFactor: 1.2,
    optimalPowerDensity: 5.0,
    thermalConductivity: 401,
    absorptionCoefficient: 0.60,
    qualityFactor: 0.75
  },
  titanium: {
    basePowerFactor: 1.1,
    baseSpeedFactor: 0.7,
    optimalPowerDensity: 3.5,
    thermalConductivity: 22,
    absorptionCoefficient: 0.80,
    qualityFactor: 0.85
  },
  brass: {
    basePowerFactor: 1.3,
    baseSpeedFactor: 1.1,
    optimalPowerDensity: 4.5,
    thermalConductivity: 120,
    absorptionCoefficient: 0.70,
    qualityFactor: 0.80
  }
};

// Laser type characteristics
const laserTypeProperties = {
  fiber: {
    wavelength: 1.06,
    beamQuality: 1.1,
    absorptionMultiplier: { steel: 1.0, stainless_steel: 1.0, aluminum: 0.8, copper: 0.7, titanium: 1.0, brass: 0.8 },
    efficiencyFactor: 0.9
  },
  co2: {
    wavelength: 10.6,
    beamQuality: 1.2,
    absorptionMultiplier: { steel: 0.8, stainless_steel: 0.8, aluminum: 1.2, copper: 1.3, titanium: 0.9, brass: 1.1 },
    efficiencyFactor: 0.7
  },
  diode: {
    wavelength: 0.98,
    beamQuality: 1.5,
    absorptionMultiplier: { steel: 0.9, stainless_steel: 0.9, aluminum: 0.7, copper: 0.6, titanium: 0.9, brass: 0.7 },
    efficiencyFactor: 0.8
  }
};

// Quality requirement factors
const qualityFactors = {
  rough: { powerMultiplier: 1.2, speedMultiplier: 1.5, qualityScore: 6 },
  standard: { powerMultiplier: 1.0, speedMultiplier: 1.0, qualityScore: 7.5 },
  precision: { powerMultiplier: 0.8, speedMultiplier: 0.7, qualityScore: 9 },
  mirror: { powerMultiplier: 0.6, speedMultiplier: 0.5, qualityScore: 10 }
};

export class PowerSpeedMatchingCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'power-speed-matching-calculator',
    title: 'Power-Speed Matching Calculator',
    description: 'Optimize laser power and cutting speed for ideal cutting performance',
    category: 'Process Optimization',
    badge: 'Standard',
    iconName: 'Zap',
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
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Thickness of the material'
      },
      {
        id: 'laserType',
        label: 'Laser Type',
        type: 'select',
        required: true,
        help: 'Type of laser system',
        options: [
          { value: 'fiber', label: 'Fiber Laser' },
          { value: 'co2', label: 'CO2 Laser' },
          { value: 'diode', label: 'Diode Laser' }
        ]
      },
      {
        id: 'maxPower',
        label: 'Maximum Laser Power',
        type: 'number',
        required: true,
        min: 50,
        max: 20000,
        step: 50,
        unit: 'W',
        help: 'Maximum available laser power'
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
        id: 'qualityRequirement',
        label: 'Quality Requirement',
        type: 'select',
        required: true,
        help: 'Required cut quality level',
        options: [
          { value: 'rough', label: 'Rough Cut' },
          { value: 'standard', label: 'Standard Quality' },
          { value: 'precision', label: 'Precision Cut' },
          { value: 'mirror', label: 'Mirror Finish' }
        ]
      },
      {
        id: 'priorityGoal',
        label: 'Priority Goal',
        type: 'select',
        required: true,
        help: 'Primary optimization objective',
        options: [
          { value: 'speed', label: 'Maximum Speed' },
          { value: 'quality', label: 'Best Quality' },
          { value: 'efficiency', label: 'Energy Efficiency' },
          { value: 'balanced', label: 'Balanced Performance' }
        ]
      },
      {
        id: 'currentPower',
        label: 'Current Power (Optional)',
        type: 'number',
        required: false,
        min: 0,
        max: 20000,
        step: 50,
        unit: 'W',
        help: 'Current power setting for comparison'
      },
      {
        id: 'currentSpeed',
        label: 'Current Speed (Optional)',
        type: 'number',
        required: false,
        min: 0,
        max: 15000,
        step: 10,
        unit: 'mm/min',
        help: 'Current cutting speed for comparison'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return powerSpeedMatchingSchema;
  }

  customValidation(inputs: PowerSpeedMatchingInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check laser type compatibility with material
    const material = materialCuttingProperties[inputs.materialType];
    if (!material) {
      errors.push({
        field: 'materialType',
        message: `Material type '${inputs.materialType}' is not supported. Please select a valid material.`,
        code: 'INVALID_MATERIAL'
      });
      return { errors, warnings };
    }

    const laser = laserTypeProperties[inputs.laserType];
    const absorptionMultiplier = laser.absorptionMultiplier[inputs.materialType];

    if (absorptionMultiplier < 0.7) {
      warnings.push({
        field: 'laserType',
        message: `${inputs.laserType} laser may not be optimal for ${inputs.materialType}. Consider alternative laser type.`,
        code: 'SUBOPTIMAL_LASER_MATERIAL'
      });
    }

    // Check power adequacy for thickness
    const requiredPowerDensity = material.optimalPowerDensity * inputs.thickness;
    if (inputs.maxPower < requiredPowerDensity * 100) {
      warnings.push({
        field: 'maxPower',
        message: `Available power may be insufficient for optimal cutting of ${inputs.thickness}mm ${inputs.materialType}`,
        code: 'INSUFFICIENT_POWER'
      });
    }

    // Check gas compatibility
    const gasCompatibility = this.checkGasCompatibility(inputs.materialType, inputs.assistGas);
    if (!gasCompatibility.optimal) {
      warnings.push({
        field: 'assistGas',
        message: gasCompatibility.message,
        code: 'SUBOPTIMAL_GAS'
      });
    }

    // Check current settings if provided
    if (inputs.currentPower && inputs.currentSpeed) {
      const currentPowerDensity = inputs.currentPower / (inputs.thickness * inputs.thickness);
      if (currentPowerDensity > material.optimalPowerDensity * 2) {
        warnings.push({
          field: 'currentPower',
          message: 'Current power setting is very high and may cause quality issues',
          code: 'HIGH_CURRENT_POWER'
        });
      }
    }

    return { errors, warnings };
  }

  async calculate(inputs: PowerSpeedMatchingInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialCuttingProperties[inputs.materialType];
      const laser = laserTypeProperties[inputs.laserType];
      const quality = qualityFactors[inputs.qualityRequirement];
      
      // Calculate optimal settings
      const optimalSettings = this.calculateOptimalSettings(inputs, material, laser, quality);
      
      // Predict performance
      const performancePrediction = this.predictPerformance(optimalSettings, inputs, material);
      
      // Generate alternative settings
      const alternativeSettings = this.generateAlternativeSettings(optimalSettings, inputs, material, laser);
      
      // Analyze optimization potential
      const optimizationAnalysis = this.analyzeOptimization(inputs, optimalSettings, performancePrediction);
      
      // Generate recommendations
      const processRecommendations = this.generateProcessRecommendations(inputs, optimalSettings, material);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, optimalSettings, material);

      const results: PowerSpeedMatchingResults = {
        optimalSettings,
        performancePrediction,
        alternativeSettings,
        optimizationAnalysis,
        processRecommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Power-speed matching calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateOptimalSettings(inputs: PowerSpeedMatchingInputs, material: typeof materialCuttingProperties.steel, laser: typeof laserTypeProperties.fiber, quality: typeof qualityFactors.standard) {
    // Calculate base power requirement
    const thicknessFactor = Math.pow(inputs.thickness, 1.2);
    const absorptionFactor = laser.absorptionMultiplier[inputs.materialType];
    const basePower = material.basePowerFactor * thicknessFactor * 100 * absorptionFactor;
    
    // Apply quality and priority adjustments
    let optimalPower = basePower * quality.powerMultiplier;
    
    // Priority-based adjustments
    const priorityAdjustments = {
      speed: { powerMult: 1.2, speedMult: 1.4 },
      quality: { powerMult: 0.8, speedMult: 0.7 },
      efficiency: { powerMult: 0.9, speedMult: 1.1 },
      balanced: { powerMult: 1.0, speedMult: 1.0 }
    };
    
    const adjustment = priorityAdjustments[inputs.priorityGoal];
    optimalPower *= adjustment.powerMult;
    
    // Limit to available power
    optimalPower = Math.min(optimalPower, inputs.maxPower * 0.95);
    
    // Calculate optimal speed
    const baseSpeed = material.baseSpeedFactor * 3000 / Math.sqrt(inputs.thickness);
    let optimalSpeed = baseSpeed * quality.speedMultiplier * adjustment.speedMult;
    
    // Power density calculation
    const powerDensity = optimalPower / (inputs.thickness * inputs.thickness);
    
    // Specific energy calculation (energy per unit volume)
    const specificEnergy = (optimalPower * 60) / (optimalSpeed * inputs.thickness * 1); // J/mm³
    
    return {
      power: Math.round(optimalPower),
      speed: Math.round(optimalSpeed),
      powerPercentage: Math.round((optimalPower / inputs.maxPower) * 100),
      powerDensity: Math.round(powerDensity * 100) / 100,
      specificEnergy: Math.round(specificEnergy * 100) / 100
    };
  }

  private predictPerformance(settings: any, inputs: PowerSpeedMatchingInputs, material: typeof materialCuttingProperties.steel) {
    // Cutting efficiency
    const theoreticalMaxSpeed = 5000 / Math.sqrt(inputs.thickness);
    const cuttingEfficiency = Math.min(100, (settings.speed / theoreticalMaxSpeed) * 100);
    
    // Edge quality prediction
    const powerDensityRatio = settings.powerDensity / material.optimalPowerDensity;
    const edgeQuality = Math.max(1, Math.min(10, 8 - Math.abs(powerDensityRatio - 1) * 3));
    
    // Kerf width prediction
    const expectedKerf = 0.1 + inputs.thickness * 0.02 + settings.powerDensity * 0.01;
    
    // Surface roughness
    const surfaceRoughness = edgeQuality > 8 ? 'Ra 1.6' : edgeQuality > 6 ? 'Ra 3.2' : 'Ra 6.3';
    
    // Heat affected zone
    const heatAffectedZone = inputs.thickness * 0.1 * (settings.powerDensity / material.optimalPowerDensity);
    
    return {
      cuttingEfficiency: Math.round(cuttingEfficiency),
      edgeQuality: Math.round(edgeQuality * 10) / 10,
      expectedKerf: Math.round(expectedKerf * 100) / 100,
      surfaceRoughness,
      heatAffectedZone: Math.round(heatAffectedZone * 100) / 100
    };
  }

  private generateAlternativeSettings(optimal: any, inputs: PowerSpeedMatchingInputs, material: typeof materialCuttingProperties.steel, laser: typeof laserTypeProperties.fiber) {
    const alternatives = [];
    
    // High speed alternative
    alternatives.push({
      name: 'High Speed',
      power: Math.min(optimal.power * 1.3, inputs.maxPower),
      speed: optimal.speed * 1.5,
      tradeoff: 'Faster cutting, slightly lower edge quality',
      efficiency: 85,
      qualityScore: Math.max(6, optimal.power > inputs.maxPower * 0.8 ? 6.5 : 7.5)
    });
    
    // High quality alternative
    alternatives.push({
      name: 'High Quality',
      power: optimal.power * 0.7,
      speed: optimal.speed * 0.6,
      tradeoff: 'Superior edge quality, slower cutting',
      efficiency: 70,
      qualityScore: 9.5
    });
    
    // Energy efficient alternative
    alternatives.push({
      name: 'Energy Efficient',
      power: optimal.power * 0.8,
      speed: optimal.speed * 1.1,
      tradeoff: 'Lower energy consumption, good balance',
      efficiency: 95,
      qualityScore: 8.0
    });
    
    // Conservative alternative
    alternatives.push({
      name: 'Conservative',
      power: optimal.power * 0.6,
      speed: optimal.speed * 0.8,
      tradeoff: 'Safe parameters, extended equipment life',
      efficiency: 75,
      qualityScore: 8.5
    });
    
    return alternatives.map(alt => ({
      ...alt,
      power: Math.round(alt.power),
      speed: Math.round(alt.speed)
    }));
  }

  private analyzeOptimization(inputs: PowerSpeedMatchingInputs, optimal: any, performance: any) {
    let powerUtilization = optimal.powerPercentage;
    let speedOptimization = 85; // Default good optimization
    let energyEfficiency = 80;
    let productivityGain = 0;
    let qualityImprovement = 0;
    
    // Compare with current settings if provided
    if (inputs.currentPower && inputs.currentSpeed) {
      const currentPowerUtil = (inputs.currentPower / inputs.maxPower) * 100;
      powerUtilization = Math.max(powerUtilization, currentPowerUtil);
      
      productivityGain = ((optimal.speed - inputs.currentSpeed) / inputs.currentSpeed) * 100;
      
      // Estimate current quality
      const currentPowerDensity = inputs.currentPower / (inputs.thickness * inputs.thickness);
      const material = materialCuttingProperties[inputs.materialType];
      const currentQuality = Math.max(1, Math.min(10, 8 - Math.abs(currentPowerDensity / material.optimalPowerDensity - 1) * 3));
      qualityImprovement = ((performance.edgeQuality - currentQuality) / currentQuality) * 100;
    }
    
    // Energy efficiency based on specific energy
    energyEfficiency = Math.max(60, 100 - optimal.specificEnergy * 5);
    
    return {
      powerUtilization: Math.round(powerUtilization),
      speedOptimization: Math.round(speedOptimization),
      energyEfficiency: Math.round(energyEfficiency),
      productivityGain: Math.round(Math.max(0, productivityGain)),
      qualityImprovement: Math.round(Math.max(0, qualityImprovement))
    };
  }

  private generateProcessRecommendations(inputs: PowerSpeedMatchingInputs, optimal: any, material: typeof materialCuttingProperties.steel) {
    const parameterAdjustments: string[] = [];
    const qualityTips: string[] = [];
    const efficiencyTips: string[] = [];
    const troubleshooting: string[] = [];
    
    // Parameter adjustments
    if (optimal.powerPercentage > 90) {
      parameterAdjustments.push('Consider reducing power slightly to extend laser life');
    }
    if (optimal.powerDensity > material.optimalPowerDensity * 1.5) {
      parameterAdjustments.push('Power density is high - monitor for heat damage');
    }
    
    // Quality tips
    qualityTips.push('Maintain consistent gas pressure for uniform cut quality');
    qualityTips.push('Ensure proper focus position for optimal beam delivery');
    if (inputs.qualityRequirement === 'precision' || inputs.qualityRequirement === 'mirror') {
      qualityTips.push('Use multiple passes for thick materials to improve quality');
    }
    
    // Efficiency tips
    efficiencyTips.push('Monitor actual cutting speed and adjust parameters as needed');
    efficiencyTips.push('Regular maintenance ensures consistent performance');
    if (inputs.priorityGoal === 'efficiency') {
      efficiencyTips.push('Consider batch cutting to maximize material utilization');
    }
    
    // Troubleshooting
    troubleshooting.push('If cut quality is poor, reduce speed before increasing power');
    troubleshooting.push('Excessive dross indicates need for gas pressure adjustment');
    troubleshooting.push('Inconsistent cuts may indicate focus or gas flow issues');
    
    return {
      parameterAdjustments,
      qualityTips,
      efficiencyTips,
      troubleshooting
    };
  }

  private generateWarnings(inputs: PowerSpeedMatchingInputs, optimal: any, material: typeof materialCuttingProperties.steel): string[] {
    const warnings: string[] = [];
    
    if (optimal.powerPercentage > 95) {
      warnings.push('Very high power utilization - monitor laser performance closely');
    }
    
    if (optimal.powerDensity > material.optimalPowerDensity * 2) {
      warnings.push('High power density may cause excessive heat damage');
    }
    
    if (inputs.thickness > 20 && optimal.speed > 1000) {
      warnings.push('High speed on thick material may result in incomplete cuts');
    }
    
    if (inputs.materialType === 'copper' && inputs.laserType === 'fiber') {
      warnings.push('Copper has low absorption for fiber lasers - expect reduced efficiency');
    }
    
    if (inputs.assistGas === 'oxygen' && inputs.materialType === 'aluminum') {
      warnings.push('Oxygen with aluminum may cause excessive oxidation');
    }
    
    return warnings;
  }

  private checkGasCompatibility(materialType: string, assistGas: string) {
    const compatibility = {
      steel: { optimal: ['oxygen'], acceptable: ['air'], poor: ['nitrogen', 'argon'] },
      stainless_steel: { optimal: ['nitrogen'], acceptable: ['argon'], poor: ['oxygen', 'air'] },
      aluminum: { optimal: ['nitrogen', 'argon'], acceptable: ['air'], poor: ['oxygen'] },
      copper: { optimal: ['nitrogen', 'argon'], acceptable: ['air'], poor: ['oxygen'] },
      titanium: { optimal: ['argon'], acceptable: ['nitrogen'], poor: ['oxygen', 'air'] },
      brass: { optimal: ['nitrogen'], acceptable: ['air', 'argon'], poor: ['oxygen'] }
    };
    
    const material = compatibility[materialType];
    if (material.optimal.includes(assistGas)) {
      return { optimal: true, message: 'Optimal gas choice for this material' };
    } else if (material.acceptable.includes(assistGas)) {
      return { optimal: false, message: 'Acceptable gas choice, but not optimal for best results' };
    } else {
      return { optimal: false, message: 'Poor gas choice for this material - consider switching' };
    }
  }

  getExampleInputs(): PowerSpeedMatchingInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserType: 'fiber',
      maxPower: 3000,
      assistGas: 'oxygen',
      qualityRequirement: 'standard',
      priorityGoal: 'balanced'
    };
  }
}
