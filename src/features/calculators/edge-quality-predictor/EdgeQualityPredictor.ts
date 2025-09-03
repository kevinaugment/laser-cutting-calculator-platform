// Edge Quality Predictor Calculator Implementation
// Comprehensive edge quality prediction for laser cutting optimization

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const edgeQualitySchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.5).max(50),
  laserPower: z.number().min(500).max(20000),
  cuttingSpeed: z.number().min(100).max(15000),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  gasPressure: z.number().min(0.1).max(25),
  focusPosition: z.number().min(-5).max(5),
  beamQuality: z.number().min(1.0).max(3.0).optional().default(1.1)
});

// Input types
export type EdgeQualityInputs = z.infer<typeof edgeQualitySchema>;

// Result types
export interface EdgeQualityResults {
  qualityGrade: number;             // 1-5 scale (5 = excellent)
  surfaceRoughness: number;         // Ra in μm
  edgeCharacteristics: {
    topEdgeQuality: number;         // 1-5 scale
    bottomEdgeQuality: number;      // 1-5 scale
    kerfTaper: number;              // degrees
    kerfWidth: number;              // mm
    edgeAngle: number;              // degrees from vertical
  };
  defectRisks: {
    drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive';
    burnRisk: 'low' | 'medium' | 'high';
    roughnessRisk: 'low' | 'medium' | 'high';
    taperRisk: 'low' | 'medium' | 'high';
  };
  qualityFactors: {
    materialFactor: number;         // 0-1 scale
    powerSpeedRatio: number;        // W·s/mm
    gasPressureEffect: number;      // 0-1 scale
    focusQuality: number;           // 0-1 scale
    beamQualityEffect: number;      // 0-1 scale
  };
  recommendations: string[];
  warnings: string[];
  optimizationSuggestions: {
    powerAdjustment: number;        // % change
    speedAdjustment: number;        // % change
    pressureAdjustment: number;     // % change
    focusAdjustment: number;        // mm change
  };
}

// Material properties database
const materialProperties = {
  steel: {
    baseFactor: 0.85,
    roughnessFactor: 1.0,
    optimalPowerSpeedRatio: 0.4,
    gasCompatibility: { oxygen: 1.0, nitrogen: 0.8, air: 0.9, argon: 0.7 },
    drossResistance: 0.7
  },
  stainless_steel: {
    baseFactor: 0.90,
    roughnessFactor: 0.9,
    optimalPowerSpeedRatio: 0.6,
    gasCompatibility: { oxygen: 0.7, nitrogen: 1.0, air: 0.8, argon: 0.9 },
    drossResistance: 0.8
  },
  aluminum: {
    baseFactor: 0.75,
    roughnessFactor: 1.1,
    optimalPowerSpeedRatio: 0.3,
    gasCompatibility: { oxygen: 0.6, nitrogen: 1.0, air: 0.7, argon: 0.8 },
    drossResistance: 0.9
  },
  copper: {
    baseFactor: 0.70,
    roughnessFactor: 1.2,
    optimalPowerSpeedRatio: 0.8,
    gasCompatibility: { oxygen: 0.5, nitrogen: 0.9, air: 0.6, argon: 0.8 },
    drossResistance: 0.6
  },
  titanium: {
    baseFactor: 0.95,
    roughnessFactor: 0.8,
    optimalPowerSpeedRatio: 0.7,
    gasCompatibility: { oxygen: 0.3, nitrogen: 0.9, air: 0.4, argon: 1.0 },
    drossResistance: 0.9
  },
  brass: {
    baseFactor: 0.80,
    roughnessFactor: 1.0,
    optimalPowerSpeedRatio: 0.5,
    gasCompatibility: { oxygen: 0.8, nitrogen: 1.0, air: 0.9, argon: 0.8 },
    drossResistance: 0.8
  }
};

// Gas properties
const gasProperties = {
  oxygen: { roughnessMultiplier: 1.2, drossReduction: 0.8, burnRisk: 1.5 },
  nitrogen: { roughnessMultiplier: 0.8, drossReduction: 1.2, burnRisk: 0.6 },
  air: { roughnessMultiplier: 1.0, drossReduction: 1.0, burnRisk: 1.0 },
  argon: { roughnessMultiplier: 0.9, drossReduction: 1.1, burnRisk: 0.7 }
};

export class EdgeQualityPredictor extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'edge-quality-predictor',
    title: 'Edge Quality Predictor',
    description: 'Predict edge quality and surface characteristics for laser cutting',
    category: 'Quality Control',
    badge: 'Standard',
    iconName: 'Ruler',
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
        help: 'Thickness of the material in millimeters'
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
        help: 'Laser power setting in watts'
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
        help: 'Cutting speed in millimeters per minute'
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
        help: 'Assist gas pressure in bar'
      },
      {
        id: 'focusPosition',
        label: 'Focus Position',
        type: 'number',
        required: true,
        min: -5,
        max: 5,
        step: 0.1,
        unit: 'mm',
        help: 'Focus position relative to surface (negative = below surface)'
      },
      {
        id: 'beamQuality',
        label: 'Beam Quality (M²)',
        type: 'number',
        required: false,
        min: 1.0,
        max: 3.0,
        step: 0.1,
        unit: 'M²',
        help: 'Beam quality factor (optional, default: 1.1)'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return edgeQualitySchema;
  }

  customValidation(inputs: EdgeQualityInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check power-speed ratio
    const powerSpeedRatio = (inputs.laserPower * 60) / inputs.cuttingSpeed; // W·s/mm
    const material = materialProperties[inputs.materialType];
    const optimalRatio = material.optimalPowerSpeedRatio * inputs.thickness * 100;
    
    if (Math.abs(powerSpeedRatio - optimalRatio) > optimalRatio * 0.5) {
      warnings.push({
        field: 'laserPower',
        message: `Power-speed ratio may not be optimal for ${inputs.materialType}. Consider adjusting parameters.`,
        code: 'SUBOPTIMAL_POWER_SPEED'
      });
    }

    // Check gas compatibility
    const gasCompatibility = material.gasCompatibility[inputs.assistGas];
    if (gasCompatibility < 0.7) {
      warnings.push({
        field: 'assistGas',
        message: `${inputs.assistGas} may not be optimal for ${inputs.materialType}. Consider nitrogen or argon.`,
        code: 'SUBOPTIMAL_GAS'
      });
    }

    // Check focus position
    const optimalFocus = -inputs.thickness / 3;
    if (Math.abs(inputs.focusPosition - optimalFocus) > 1.0) {
      warnings.push({
        field: 'focusPosition',
        message: 'Focus position may be suboptimal. Consider adjusting closer to optimal position.',
        code: 'SUBOPTIMAL_FOCUS'
      });
    }

    // Check gas pressure
    if (inputs.assistGas === 'nitrogen' && inputs.gasPressure < 8) {
      warnings.push({
        field: 'gasPressure',
        message: 'Low nitrogen pressure may result in poor edge quality. Consider increasing pressure.',
        code: 'LOW_NITROGEN_PRESSURE'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: EdgeQualityInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialProperties[inputs.materialType];
      const gas = gasProperties[inputs.assistGas];
      
      // Calculate quality factors
      const qualityFactors = this.calculateQualityFactors(inputs, material, gas);
      
      // Predict overall quality grade
      const qualityGrade = this.calculateQualityGrade(qualityFactors, material, gas);
      
      // Calculate surface roughness
      const surfaceRoughness = this.calculateSurfaceRoughness(inputs, qualityFactors, material, gas);
      
      // Analyze edge characteristics
      const edgeCharacteristics = this.analyzeEdgeCharacteristics(inputs, qualityFactors, material);
      
      // Assess defect risks
      const defectRisks = this.assessDefectRisks(inputs, qualityFactors, material, gas);
      
      // Generate optimization suggestions
      const optimizationSuggestions = this.generateOptimizationSuggestions(inputs, qualityFactors, material);
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, qualityGrade, defectRisks);
      const warnings = this.generateWarnings(inputs, qualityGrade, defectRisks);

      const results: EdgeQualityResults = {
        qualityGrade: Math.round(qualityGrade * 10) / 10,
        surfaceRoughness: Math.round(surfaceRoughness * 10) / 10,
        edgeCharacteristics,
        defectRisks,
        qualityFactors,
        recommendations,
        warnings,
        optimizationSuggestions
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Edge quality prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateQualityFactors(inputs: EdgeQualityInputs, material: typeof materialProperties.steel, gas: typeof gasProperties.oxygen) {
    // Material factor
    const materialFactor = material.baseFactor;
    
    // Power-speed ratio factor
    const powerSpeedRatio = (inputs.laserPower * 60) / inputs.cuttingSpeed; // W·s/mm
    const optimalRatio = material.optimalPowerSpeedRatio * inputs.thickness * 100;
    const ratioDeviation = Math.abs(powerSpeedRatio - optimalRatio) / optimalRatio;
    const powerSpeedEffect = Math.exp(-Math.pow(ratioDeviation, 2));
    
    // Gas pressure effect
    const optimalPressure = inputs.assistGas === 'nitrogen' ? 12 : 
                           inputs.assistGas === 'oxygen' ? 1.5 : 3;
    const pressureDeviation = Math.abs(inputs.gasPressure - optimalPressure) / optimalPressure;
    const gasPressureEffect = Math.exp(-Math.pow(pressureDeviation, 2));
    
    // Focus quality
    const optimalFocus = -inputs.thickness / 3;
    const focusDeviation = Math.abs(inputs.focusPosition - optimalFocus) / 1.0;
    const focusQuality = Math.exp(-Math.pow(focusDeviation, 2));
    
    // Beam quality effect
    const beamQualityEffect = 1 / inputs.beamQuality;
    
    return {
      materialFactor: Math.round(materialFactor * 1000) / 1000,
      powerSpeedRatio: Math.round(powerSpeedRatio * 100) / 100,
      gasPressureEffect: Math.round(gasPressureEffect * 1000) / 1000,
      focusQuality: Math.round(focusQuality * 1000) / 1000,
      beamQualityEffect: Math.round(beamQualityEffect * 1000) / 1000
    };
  }

  private calculateQualityGrade(factors: any, material: typeof materialProperties.steel, gas: typeof gasProperties.oxygen): number {
    // Base quality from material
    let quality = material.baseFactor;
    
    // Apply all factors
    quality *= factors.gasPressureEffect;
    quality *= factors.focusQuality;
    quality *= factors.beamQualityEffect;
    
    // Gas compatibility
    const gasCompatibility = material.gasCompatibility[Object.keys(gasProperties).find(key => 
      gasProperties[key as keyof typeof gasProperties] === gas) as keyof typeof material.gasCompatibility] || 0.8;
    quality *= gasCompatibility;
    
    // Convert to 1-5 scale
    return Math.max(1, Math.min(5, quality * 5));
  }

  private calculateSurfaceRoughness(inputs: EdgeQualityInputs, factors: any, material: typeof materialProperties.steel, gas: typeof gasProperties.oxygen): number {
    // Base roughness
    const baseRoughness = 3.2; // μm Ra
    
    // Material effect
    let roughness = baseRoughness * material.roughnessFactor;
    
    // Gas effect
    roughness *= gas.roughnessMultiplier;
    
    // Quality factors effect
    roughness /= (factors.gasPressureEffect * factors.focusQuality * factors.beamQualityEffect);
    
    // Power-speed effect
    const powerSpeedDeviation = Math.abs(factors.powerSpeedRatio - material.optimalPowerSpeedRatio * inputs.thickness * 100) / 
                               (material.optimalPowerSpeedRatio * inputs.thickness * 100);
    roughness *= (1 + powerSpeedDeviation);
    
    return Math.max(0.8, roughness);
  }

  private analyzeEdgeCharacteristics(inputs: EdgeQualityInputs, factors: any, material: typeof materialProperties.steel) {
    // Top edge quality (usually better)
    const topEdgeQuality = Math.min(5, this.calculateQualityGrade(factors, material, gasProperties[inputs.assistGas]) + 0.5);
    
    // Bottom edge quality (usually worse due to dross)
    const bottomEdgeQuality = Math.max(1, topEdgeQuality - 1);
    
    // Kerf taper
    const baseTaper = 0.5; // degrees
    const taper = baseTaper * (1 + (1 - factors.focusQuality)) * (1 + (1 - factors.gasPressureEffect));
    
    // Kerf width
    const baseKerf = 0.2; // mm
    const kerfWidth = baseKerf + inputs.thickness * 0.02;
    
    // Edge angle
    const edgeAngle = 90 - taper;
    
    return {
      topEdgeQuality: Math.round(topEdgeQuality * 10) / 10,
      bottomEdgeQuality: Math.round(bottomEdgeQuality * 10) / 10,
      kerfTaper: Math.round(taper * 100) / 100,
      kerfWidth: Math.round(kerfWidth * 1000) / 1000,
      edgeAngle: Math.round(edgeAngle * 100) / 100
    };
  }

  private assessDefectRisks(inputs: EdgeQualityInputs, factors: any, material: typeof materialProperties.steel, gas: typeof gasProperties.oxygen) {
    // Dross level
    const drossResistance = material.drossResistance * gas.drossReduction * factors.gasPressureEffect;
    let drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive';
    if (drossResistance > 0.9) drossLevel = 'none';
    else if (drossResistance > 0.7) drossLevel = 'minimal';
    else if (drossResistance > 0.5) drossLevel = 'moderate';
    else drossLevel = 'excessive';
    
    // Burn risk
    const burnFactor = gas.burnRisk * factors.powerSpeedRatio / 100;
    const burnRisk = burnFactor > 2 ? 'high' : burnFactor > 1 ? 'medium' : 'low';
    
    // Roughness risk
    const roughnessRisk = factors.focusQuality < 0.7 ? 'high' : 
                         factors.focusQuality < 0.85 ? 'medium' : 'low';
    
    // Taper risk
    const taperRisk = factors.gasPressureEffect < 0.7 ? 'high' :
                     factors.gasPressureEffect < 0.85 ? 'medium' : 'low';
    
    return { drossLevel, burnRisk, roughnessRisk, taperRisk };
  }

  private generateOptimizationSuggestions(inputs: EdgeQualityInputs, factors: any, material: typeof materialProperties.steel) {
    const optimalRatio = material.optimalPowerSpeedRatio * inputs.thickness * 100;
    const currentRatio = factors.powerSpeedRatio;
    
    // Power adjustment
    const powerAdjustment = currentRatio > optimalRatio ? -10 : 
                           currentRatio < optimalRatio * 0.8 ? 15 : 0;
    
    // Speed adjustment
    const speedAdjustment = currentRatio > optimalRatio ? 10 : 
                           currentRatio < optimalRatio * 0.8 ? -10 : 0;
    
    // Pressure adjustment
    const pressureAdjustment = factors.gasPressureEffect < 0.8 ? 20 : 
                              factors.gasPressureEffect > 0.95 ? -5 : 0;
    
    // Focus adjustment
    const optimalFocus = -inputs.thickness / 3;
    const focusAdjustment = Math.round((optimalFocus - inputs.focusPosition) * 10) / 10;
    
    return {
      powerAdjustment,
      speedAdjustment,
      pressureAdjustment,
      focusAdjustment
    };
  }

  private generateRecommendations(inputs: EdgeQualityInputs, qualityGrade: number, defectRisks: any): string[] {
    const recommendations: string[] = [];
    
    if (qualityGrade < 3) {
      recommendations.push('Overall quality is below acceptable level - review all parameters');
    }
    
    if (defectRisks.drossLevel === 'excessive' || defectRisks.drossLevel === 'moderate') {
      recommendations.push('Increase gas pressure or adjust cutting speed to reduce dross formation');
    }
    
    if (defectRisks.burnRisk === 'high') {
      recommendations.push('Reduce laser power or increase cutting speed to prevent burn marks');
    }
    
    if (defectRisks.roughnessRisk === 'high') {
      recommendations.push('Optimize focus position and beam quality for better surface finish');
    }
    
    if (defectRisks.taperRisk === 'high') {
      recommendations.push('Adjust gas pressure and focus position to minimize kerf taper');
    }
    
    if (inputs.assistGas === 'air' && inputs.materialType === 'stainless_steel') {
      recommendations.push('Consider using nitrogen for better edge quality on stainless steel');
    }
    
    return recommendations;
  }

  private generateWarnings(inputs: EdgeQualityInputs, qualityGrade: number, defectRisks: any): string[] {
    const warnings: string[] = [];
    
    if (qualityGrade < 2) {
      warnings.push('Very poor quality predicted - parts may not meet specifications');
    }
    
    if (defectRisks.drossLevel === 'excessive') {
      warnings.push('Excessive dross formation expected - secondary operations may be required');
    }
    
    if (defectRisks.burnRisk === 'high') {
      warnings.push('High risk of burn marks and heat damage');
    }
    
    if (inputs.thickness > 20 && inputs.cuttingSpeed > 1000) {
      warnings.push('High speed on thick material may result in incomplete cuts');
    }
    
    return warnings;
  }

  getExampleInputs(): EdgeQualityInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserPower: 2000,
      cuttingSpeed: 2500,
      assistGas: 'oxygen',
      gasPressure: 1.2,
      focusPosition: -1.5,
      beamQuality: 1.1
    };
  }
}
