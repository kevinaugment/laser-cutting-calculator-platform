// Gas Pressure Setting Guide Implementation
// Comprehensive gas pressure optimization for laser cutting parameters

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const gasPressureSettingSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.1).max(50),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  nozzleDiameter: z.number().min(0.5).max(5.0),
  cuttingSpeed: z.number().min(100).max(15000),
  laserPower: z.number().min(50).max(20000),
  cutQuality: z.enum(['rough', 'standard', 'precision', 'mirror']),
  currentPressure: z.number().min(0).max(30).optional()
});

// Input types
export type GasPressureSettingInputs = z.infer<typeof gasPressureSettingSchema>;

// Result types
export interface GasPressureSettingResults {
  optimalPressure: {
    value: number;                  // bar
    unit: string;
    confidence: number;             // 0-1 scale
    reasoning: string[];
  };
  pressureRange: {
    minimum: number;                // bar
    maximum: number;                // bar
    optimal: number;                // bar
    tolerance: number;              // ±bar
  };
  gasFlowAnalysis: {
    flowRate: number;               // L/min
    velocity: number;               // m/s
    efficiency: number;             // %
    hourlyConsumption: number;      // L/h
    costPerHour: number;            // USD/h
  };
  pressureEffects: {
    kerfWidth: number;              // mm
    edgeQuality: number;            // 1-10 scale
    drossRisk: 'low' | 'medium' | 'high';
    penetrationDepth: number;       // mm
    gasUtilization: number;         // %
  };
  optimizationRecommendations: {
    pressureAdjustments: string[];
    qualityImprovements: string[];
    costOptimizations: string[];
    troubleshooting: Array<{
      issue: string;
      cause: string;
      solution: string;
    }>;
  };
  alternativeSettings: Array<{
    name: string;
    pressure: number;               // bar
    tradeoff: string;
    qualityImpact: number;          // 1-10 scale
    costImpact: number;             // % change
  }>;
  warnings: string[];
}

// Material gas pressure properties
const materialGasPressureProperties = {
  steel: {
    oxygen: { basePressure: 0.8, thicknessFactor: 0.15, maxPressure: 3.0, qualityFactor: 0.85 },
    nitrogen: { basePressure: 12, thicknessFactor: 2.0, maxPressure: 25, qualityFactor: 0.95 },
    air: { basePressure: 6, thicknessFactor: 1.0, maxPressure: 15, qualityFactor: 0.75 },
    argon: { basePressure: 8, thicknessFactor: 1.5, maxPressure: 20, qualityFactor: 0.90 }
  },
  stainless_steel: {
    nitrogen: { basePressure: 15, thicknessFactor: 2.5, maxPressure: 25, qualityFactor: 0.95 },
    oxygen: { basePressure: 0.6, thicknessFactor: 0.12, maxPressure: 2.5, qualityFactor: 0.80 },
    air: { basePressure: 8, thicknessFactor: 1.2, maxPressure: 18, qualityFactor: 0.70 },
    argon: { basePressure: 12, thicknessFactor: 2.0, maxPressure: 22, qualityFactor: 0.92 }
  },
  aluminum: {
    nitrogen: { basePressure: 18, thicknessFactor: 3.0, maxPressure: 25, qualityFactor: 0.90 },
    air: { basePressure: 10, thicknessFactor: 1.5, maxPressure: 20, qualityFactor: 0.75 },
    argon: { basePressure: 15, thicknessFactor: 2.5, maxPressure: 25, qualityFactor: 0.88 }
  },
  copper: {
    nitrogen: { basePressure: 20, thicknessFactor: 3.5, maxPressure: 25, qualityFactor: 0.85 },
    air: { basePressure: 12, thicknessFactor: 2.0, maxPressure: 22, qualityFactor: 0.70 },
    argon: { basePressure: 18, thicknessFactor: 3.0, maxPressure: 25, qualityFactor: 0.82 }
  },
  titanium: {
    argon: { basePressure: 16, thicknessFactor: 2.8, maxPressure: 25, qualityFactor: 0.95 },
    nitrogen: { basePressure: 14, thicknessFactor: 2.5, maxPressure: 22, qualityFactor: 0.88 }
  },
  brass: {
    nitrogen: { basePressure: 16, thicknessFactor: 2.2, maxPressure: 24, qualityFactor: 0.88 },
    air: { basePressure: 9, thicknessFactor: 1.3, maxPressure: 18, qualityFactor: 0.75 },
    argon: { basePressure: 14, thicknessFactor: 2.0, maxPressure: 22, qualityFactor: 0.85 }
  }
};

// Gas properties for flow calculations
const gasFlowProperties = {
  oxygen: { density: 1.429, flowFactor: 0.6, cost: 0.15 },
  nitrogen: { density: 1.251, flowFactor: 0.65, cost: 0.12 },
  air: { density: 1.225, flowFactor: 0.62, cost: 0.02 },
  argon: { density: 1.784, flowFactor: 0.58, cost: 0.25 }
};

// Quality requirement factors
const qualityPressureFactors = {
  rough: 0.8,
  standard: 1.0,
  precision: 1.2,
  mirror: 1.4
};

export class GasPressureSettingGuide extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'gas-pressure-setting-guide',
    title: 'Gas Pressure Setting Guide',
    description: 'Optimize assist gas pressure for material thickness and cutting quality',
    category: 'Process Optimization',
    badge: 'Standard',
    iconName: 'Wind',
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
        id: 'assistGas',
        label: 'Assist Gas Type',
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
        id: 'nozzleDiameter',
        label: 'Nozzle Diameter',
        type: 'number',
        required: true,
        min: 0.5,
        max: 5.0,
        step: 0.1,
        unit: 'mm',
        help: 'Cutting nozzle diameter'
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
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 50,
        max: 20000,
        step: 50,
        unit: 'W',
        help: 'Laser power setting'
      },
      {
        id: 'cutQuality',
        label: 'Cut Quality Requirement',
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
        id: 'currentPressure',
        label: 'Current Pressure (Optional)',
        type: 'number',
        required: false,
        min: 0,
        max: 30,
        step: 0.1,
        unit: 'bar',
        help: 'Current gas pressure for comparison'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return gasPressureSettingSchema;
  }

  customValidation(inputs: GasPressureSettingInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check gas compatibility with material
    const materialGasProps = materialGasPressureProperties[inputs.materialType];
    if (!materialGasProps) {
      errors.push({
        field: 'materialType',
        message: `Material type '${inputs.materialType}' is not supported. Please select a valid material.`,
        code: 'INVALID_MATERIAL'
      });
      return { errors, warnings };
    }

    if (!materialGasProps[inputs.assistGas]) {
      warnings.push({
        field: 'assistGas',
        message: `${inputs.assistGas} is not commonly used with ${inputs.materialType}. Consider alternative gas types.`,
        code: 'UNCOMMON_GAS_MATERIAL'
      });
    }

    // Check nozzle diameter vs thickness
    if (inputs.nozzleDiameter < inputs.thickness * 0.2) {
      warnings.push({
        field: 'nozzleDiameter',
        message: 'Small nozzle diameter relative to material thickness may cause flow restrictions',
        code: 'SMALL_NOZZLE_DIAMETER'
      });
    }

    // Check cutting speed vs thickness
    const speedThicknessRatio = inputs.cuttingSpeed / inputs.thickness;
    if (speedThicknessRatio > 2000) {
      warnings.push({
        field: 'cuttingSpeed',
        message: 'High cutting speed for material thickness may require higher gas pressure',
        code: 'HIGH_SPEED_THICKNESS_RATIO'
      });
    }

    // Check current pressure if provided
    if (inputs.currentPressure !== undefined) {
      const gasProps = materialGasProps[inputs.assistGas];
      if (gasProps) {
        const estimatedOptimal = gasProps.basePressure + (inputs.thickness * gasProps.thicknessFactor);
        if (Math.abs(inputs.currentPressure - estimatedOptimal) > estimatedOptimal * 0.5) {
          warnings.push({
            field: 'currentPressure',
            message: 'Current pressure significantly deviates from typical range for this material/gas combination',
            code: 'PRESSURE_DEVIATION'
          });
        }
      }
    }

    return { errors, warnings };
  }

  async calculate(inputs: GasPressureSettingInputs): Promise<BaseCalculationResult> {
    try {
      const materialGasProps = materialGasPressureProperties[inputs.materialType];
      const gasProps = materialGasProps[inputs.assistGas];
      const flowProps = gasFlowProperties[inputs.assistGas];
      
      if (!gasProps) {
        throw new Error(`Gas type ${inputs.assistGas} not supported for material ${inputs.materialType}`);
      }
      
      // Calculate optimal pressure
      const optimalPressure = this.calculateOptimalPressure(inputs, gasProps);
      
      // Calculate pressure range
      const pressureRange = this.calculatePressureRange(optimalPressure, inputs.assistGas);
      
      // Analyze gas flow
      const gasFlowAnalysis = this.analyzeGasFlow(optimalPressure, inputs, flowProps);
      
      // Analyze pressure effects
      const pressureEffects = this.analyzePressureEffects(optimalPressure, inputs, gasProps);
      
      // Generate optimization recommendations
      const optimizationRecommendations = this.generateOptimizationRecommendations(inputs, optimalPressure, gasProps);
      
      // Generate alternative settings
      const alternativeSettings = this.generateAlternativeSettings(optimalPressure, inputs, gasProps);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, optimalPressure, gasProps);

      const results: GasPressureSettingResults = {
        optimalPressure,
        pressureRange,
        gasFlowAnalysis,
        pressureEffects,
        optimizationRecommendations,
        alternativeSettings,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Gas pressure setting calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateOptimalPressure(inputs: GasPressureSettingInputs, gasProps: any) {
    // Base pressure calculation
    let optimalPressure = gasProps.basePressure + (inputs.thickness * gasProps.thicknessFactor);
    
    // Adjust for nozzle diameter
    const nozzleFactor = Math.pow(1.5 / inputs.nozzleDiameter, 2);
    optimalPressure *= nozzleFactor;
    
    // Adjust for cutting speed
    const speedFactor = Math.sqrt(inputs.cuttingSpeed / 3000);
    optimalPressure *= speedFactor;
    
    // Adjust for quality requirements
    const qualityFactor = qualityPressureFactors[inputs.cutQuality];
    optimalPressure *= qualityFactor;
    
    // Adjust for laser power
    const powerFactor = Math.sqrt(inputs.laserPower / 1000);
    optimalPressure *= Math.min(powerFactor, 1.5);
    
    // Limit to maximum pressure
    optimalPressure = Math.min(optimalPressure, gasProps.maxPressure);
    
    // Generate reasoning
    const reasoning = this.generatePressureReasoning(inputs, gasProps, optimalPressure);
    
    // Calculate confidence based on how well parameters align
    const confidence = this.calculateConfidence(inputs, gasProps, optimalPressure);
    
    return {
      value: Math.round(optimalPressure * 10) / 10,
      unit: 'bar',
      confidence: Math.round(confidence * 100) / 100,
      reasoning
    };
  }

  private calculatePressureRange(optimalPressure: any, gasType: string) {
    const tolerance = gasType === 'oxygen' ? 0.2 : 2.0;
    
    return {
      minimum: Math.max(0.1, optimalPressure.value - tolerance),
      maximum: optimalPressure.value + tolerance,
      optimal: optimalPressure.value,
      tolerance: tolerance
    };
  }

  private analyzeGasFlow(optimalPressure: any, inputs: GasPressureSettingInputs, flowProps: any) {
    // Calculate flow rate
    const nozzleArea = Math.PI * Math.pow(inputs.nozzleDiameter / 2, 2); // mm²
    const flowRate = nozzleArea * optimalPressure.value * flowProps.flowFactor * 60; // L/min
    
    // Calculate gas velocity
    const velocity = Math.sqrt(2 * optimalPressure.value * 100000 / flowProps.density); // m/s
    
    // Calculate efficiency
    const theoreticalMaxFlow = nozzleArea * 25 * flowProps.flowFactor * 60; // L/min at max pressure
    const efficiency = Math.min(100, (flowRate / theoreticalMaxFlow) * 100);
    
    // Calculate consumption and cost
    const hourlyConsumption = flowRate * 60;
    const costPerHour = hourlyConsumption * flowProps.cost / 1000; // Convert L to m³
    
    return {
      flowRate: Math.round(flowRate * 10) / 10,
      velocity: Math.round(velocity),
      efficiency: Math.round(efficiency),
      hourlyConsumption: Math.round(hourlyConsumption),
      costPerHour: Math.round(costPerHour * 100) / 100
    };
  }

  private analyzePressureEffects(optimalPressure: any, inputs: GasPressureSettingInputs, gasProps: any) {
    // Calculate kerf width effect
    const baseKerf = 0.1 + inputs.thickness * 0.02;
    const pressureEffect = (optimalPressure.value / gasProps.basePressure - 1) * 0.05;
    const kerfWidth = baseKerf + pressureEffect;
    
    // Calculate edge quality
    const qualityBase = gasProps.qualityFactor * 10;
    const pressureOptimality = 1 - Math.abs(optimalPressure.value / gasProps.basePressure - 1) * 0.2;
    const edgeQuality = Math.max(1, Math.min(10, qualityBase * pressureOptimality));
    
    // Assess dross risk
    let drossRisk: 'low' | 'medium' | 'high';
    if (optimalPressure.value > gasProps.basePressure * 1.5) drossRisk = 'low';
    else if (optimalPressure.value > gasProps.basePressure * 0.8) drossRisk = 'medium';
    else drossRisk = 'high';
    
    // Calculate penetration depth
    const penetrationDepth = inputs.thickness * (optimalPressure.value / gasProps.basePressure) * 0.9;
    
    // Calculate gas utilization
    const gasUtilization = Math.min(100, (optimalPressure.value / gasProps.maxPressure) * 100);
    
    return {
      kerfWidth: Math.round(kerfWidth * 100) / 100,
      edgeQuality: Math.round(edgeQuality * 10) / 10,
      drossRisk,
      penetrationDepth: Math.round(penetrationDepth * 100) / 100,
      gasUtilization: Math.round(gasUtilization)
    };
  }

  private generateOptimizationRecommendations(inputs: GasPressureSettingInputs, optimalPressure: any, gasProps: any) {
    const pressureAdjustments: string[] = [];
    const qualityImprovements: string[] = [];
    const costOptimizations: string[] = [];
    const troubleshooting: Array<{ issue: string; cause: string; solution: string }> = [];
    
    // Pressure adjustments
    if (inputs.currentPressure && Math.abs(inputs.currentPressure - optimalPressure.value) > 0.5) {
      const direction = inputs.currentPressure < optimalPressure.value ? 'increase' : 'decrease';
      pressureAdjustments.push(`${direction.charAt(0).toUpperCase() + direction.slice(1)} pressure from ${inputs.currentPressure} to ${optimalPressure.value} bar`);
    }
    
    if (optimalPressure.value > gasProps.maxPressure * 0.9) {
      pressureAdjustments.push('Operating near maximum pressure - monitor system stability');
    }
    
    // Quality improvements
    qualityImprovements.push('Maintain consistent gas pressure for uniform cut quality');
    qualityImprovements.push('Check nozzle condition regularly for optimal gas flow');
    
    if (inputs.cutQuality === 'precision' || inputs.cutQuality === 'mirror') {
      qualityImprovements.push('Use high-purity gas for best surface finish');
      qualityImprovements.push('Monitor pressure stability within ±5% tolerance');
    }
    
    // Cost optimizations
    if (inputs.assistGas === 'nitrogen' && inputs.materialType === 'steel') {
      costOptimizations.push('Consider oxygen for cost reduction on carbon steel');
    }
    
    costOptimizations.push('Optimize cutting sequence to minimize gas consumption');
    costOptimizations.push('Regular maintenance ensures efficient gas utilization');
    
    // Troubleshooting
    troubleshooting.push({
      issue: 'Excessive kerf width',
      cause: 'Gas pressure too high',
      solution: `Reduce pressure by 10-20% from ${optimalPressure.value} bar`
    });
    
    troubleshooting.push({
      issue: 'Dross formation',
      cause: 'Insufficient gas pressure or flow',
      solution: `Increase pressure to ${optimalPressure.value + 0.5} bar or check nozzle condition`
    });
    
    troubleshooting.push({
      issue: 'Rough cut edges',
      cause: 'Gas pressure not optimized',
      solution: 'Fine-tune pressure within recommended range'
    });
    
    if (inputs.assistGas === 'nitrogen' && inputs.materialType.includes('steel')) {
      troubleshooting.push({
        issue: 'Oxidation on cut edges',
        cause: 'Nitrogen pressure too low',
        solution: 'Increase nitrogen pressure to maintain inert atmosphere'
      });
    }
    
    return {
      pressureAdjustments,
      qualityImprovements,
      costOptimizations,
      troubleshooting
    };
  }

  private generateAlternativeSettings(optimalPressure: any, inputs: GasPressureSettingInputs, gasProps: any) {
    const alternatives = [];
    
    // High pressure alternative
    alternatives.push({
      name: 'High Pressure',
      pressure: Math.min(optimalPressure.value * 1.3, gasProps.maxPressure),
      tradeoff: 'Better melt ejection, higher gas consumption',
      qualityImpact: 8.5,
      costImpact: 30
    });
    
    // Low pressure alternative
    alternatives.push({
      name: 'Economy Setting',
      pressure: optimalPressure.value * 0.8,
      tradeoff: 'Lower gas costs, may affect cut quality',
      qualityImpact: 7.0,
      costImpact: -20
    });
    
    // Balanced alternative
    alternatives.push({
      name: 'Balanced',
      pressure: optimalPressure.value * 0.95,
      tradeoff: 'Good balance of quality and cost',
      qualityImpact: 8.0,
      costImpact: -5
    });
    
    return alternatives.map(alt => ({
      ...alt,
      pressure: Math.round(alt.pressure * 10) / 10
    }));
  }

  private generatePressureReasoning(inputs: GasPressureSettingInputs, gasProps: any, pressure: number): string[] {
    const reasons = [];
    
    if (inputs.assistGas === 'oxygen') {
      reasons.push('Oxygen pressure optimized for exothermic cutting reaction');
      if (inputs.thickness > 6) {
        reasons.push('Higher pressure needed for thick material melt evacuation');
      }
    } else if (inputs.assistGas === 'nitrogen') {
      reasons.push('Nitrogen pressure set for inert atmosphere and melt ejection');
      reasons.push('Higher pressure prevents oxidation and improves edge quality');
    }
    
    if (inputs.materialType === 'stainless_steel') {
      reasons.push('Pressure adjusted for stainless steel thermal properties');
    }
    
    if (inputs.cutQuality === 'precision' || inputs.cutQuality === 'mirror') {
      reasons.push('Higher pressure required for precision cut quality');
    }
    
    return reasons;
  }

  private calculateConfidence(inputs: GasPressureSettingInputs, gasProps: any, pressure: number): number {
    let confidence = 0.8; // Base confidence
    
    // Increase confidence for common material-gas combinations
    if ((inputs.materialType === 'steel' && inputs.assistGas === 'oxygen') ||
        (inputs.materialType === 'stainless_steel' && inputs.assistGas === 'nitrogen') ||
        (inputs.materialType === 'aluminum' && inputs.assistGas === 'nitrogen')) {
      confidence += 0.15;
    }
    
    // Adjust for thickness range
    if (inputs.thickness >= 1 && inputs.thickness <= 20) {
      confidence += 0.05;
    }
    
    return Math.min(1.0, confidence);
  }

  private generateWarnings(inputs: GasPressureSettingInputs, optimalPressure: any, gasProps: any): string[] {
    const warnings: string[] = [];
    
    if (optimalPressure.value > gasProps.maxPressure * 0.95) {
      warnings.push('Operating near maximum pressure limit - monitor system performance');
    }
    
    if (inputs.assistGas === 'oxygen' && inputs.materialType === 'aluminum') {
      warnings.push('Oxygen with aluminum may cause excessive oxidation');
    }
    
    if (inputs.assistGas === 'oxygen' && inputs.materialType === 'titanium') {
      warnings.push('Oxygen with titanium will cause severe oxidation - use argon instead');
    }
    
    if (inputs.thickness > 20 && optimalPressure.value < gasProps.basePressure * 2) {
      warnings.push('Thick material may require higher pressure for complete penetration');
    }
    
    if (inputs.nozzleDiameter < 1.0 && optimalPressure.value > 15) {
      warnings.push('Small nozzle with high pressure may cause turbulent flow');
    }
    
    return warnings;
  }

  getExampleInputs(): GasPressureSettingInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      assistGas: 'oxygen',
      nozzleDiameter: 1.5,
      cuttingSpeed: 3000,
      laserPower: 2000,
      cutQuality: 'standard'
    };
  }
}
