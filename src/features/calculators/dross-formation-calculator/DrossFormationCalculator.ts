// Dross Formation Calculator Implementation
// Comprehensive dross formation analysis and prevention for laser cutting

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const drossFormationSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.5).max(50),
  laserPower: z.number().min(500).max(20000),
  cuttingSpeed: z.number().min(100).max(15000),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  gasPressure: z.number().min(0.1).max(25),
  nozzleDiameter: z.number().min(0.5).max(5.0),
  nozzleStandoff: z.number().min(0.5).max(5.0),
  currentDrossLevel: z.enum(['none', 'minimal', 'moderate', 'heavy', 'severe']).optional().default('moderate')
});

// Input types
export type DrossFormationInputs = z.infer<typeof drossFormationSchema>;

// Result types
export interface DrossFormationResults {
  drossRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  drossRiskScore: number;          // 0-10 scale (10 = highest risk)
  drossAnalysis: {
    formationMechanism: string;
    primaryCauses: string[];
    severityScore: number;         // 0-5 scale
    attachmentStrength: 'weak' | 'moderate' | 'strong';
    removalDifficulty: 'easy' | 'moderate' | 'difficult';
  };
  meltEjectionAnalysis: {
    ejectionEfficiency: number;    // 0-1 scale
    gasFlowEffectiveness: number;  // 0-1 scale
    meltViscosity: number;         // relative scale
    ejectionVelocity: number;      // m/s
    turbulenceLevel: 'low' | 'medium' | 'high';
  };
  bottomEdgeQuality: {
    qualityGrade: number;          // 1-5 scale
    roughness: number;             // Ra in μm
    squareness: number;            // degrees deviation
    drossThickness: number;        // μm
    cleanCutPercentage: number;    // %
  };
  preventionStrategy: {
    parameterOptimization: {
      recommendedPower: number;     // W
      recommendedSpeed: number;     // mm/min
      recommendedPressure: number;  // bar
      recommendedStandoff: number;  // mm
    };
    gasFlowOptimization: {
      optimalFlowRate: number;      // L/min
      flowPattern: string;
      nozzleAlignment: string;
      pressureStability: string;
    };
    processModifications: string[];
    maintenanceActions: string[];
  };
  qualityPrediction: {
    expectedDrossLevel: 'none' | 'minimal' | 'moderate' | 'heavy' | 'severe';
    bottomEdgeImprovement: number; // % improvement
    cleaningRequirement: 'none' | 'minimal' | 'moderate' | 'extensive';
    secondaryOperations: string[];
  };
  recommendations: string[];
  warnings: string[];
}

// Material dross formation properties
const materialDrossProperties = {
  steel: {
    drossFormationTendency: 0.7,
    optimalGas: 'oxygen',
    meltViscosity: 1.0,
    ejectionDifficulty: 0.6,
    optimalPowerSpeedRatio: 0.4,
    gasFlowSensitivity: 0.8
  },
  stainless_steel: {
    drossFormationTendency: 0.8,
    optimalGas: 'nitrogen',
    meltViscosity: 1.2,
    ejectionDifficulty: 0.7,
    optimalPowerSpeedRatio: 0.6,
    gasFlowSensitivity: 0.9
  },
  aluminum: {
    drossFormationTendency: 0.6,
    optimalGas: 'nitrogen',
    meltViscosity: 0.8,
    ejectionDifficulty: 0.5,
    optimalPowerSpeedRatio: 0.3,
    gasFlowSensitivity: 0.7
  },
  copper: {
    drossFormationTendency: 0.9,
    optimalGas: 'nitrogen',
    meltViscosity: 1.1,
    ejectionDifficulty: 0.8,
    optimalPowerSpeedRatio: 0.8,
    gasFlowSensitivity: 0.8
  },
  titanium: {
    drossFormationTendency: 0.5,
    optimalGas: 'argon',
    meltViscosity: 1.3,
    ejectionDifficulty: 0.6,
    optimalPowerSpeedRatio: 0.7,
    gasFlowSensitivity: 0.9
  },
  brass: {
    drossFormationTendency: 0.7,
    optimalGas: 'nitrogen',
    meltViscosity: 0.9,
    ejectionDifficulty: 0.6,
    optimalPowerSpeedRatio: 0.5,
    gasFlowSensitivity: 0.7
  }
};

// Gas ejection properties
const gasEjectionProperties = {
  oxygen: { ejectionEfficiency: 0.9, turbulenceRisk: 0.6, flowStability: 0.8 },
  nitrogen: { ejectionEfficiency: 0.8, turbulenceRisk: 0.4, flowStability: 0.9 },
  air: { ejectionEfficiency: 0.7, turbulenceRisk: 0.7, flowStability: 0.7 },
  argon: { ejectionEfficiency: 0.85, turbulenceRisk: 0.3, flowStability: 0.95 }
};

export class DrossFormationCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'dross-formation-calculator',
    title: 'Dross Formation Calculator',
    description: 'Analyze and prevent dross formation for clean bottom edges',
    category: 'Quality Control',
    badge: 'Standard',
    iconName: 'Layers',
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
        id: 'currentDrossLevel',
        label: 'Current Dross Level',
        type: 'select',
        required: false,
        help: 'Current observed dross level (optional)',
        options: [
          { value: 'none', label: 'No Dross' },
          { value: 'minimal', label: 'Minimal Dross' },
          { value: 'moderate', label: 'Moderate Dross' },
          { value: 'heavy', label: 'Heavy Dross' },
          { value: 'severe', label: 'Severe Dross' }
        ]
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return drossFormationSchema;
  }

  customValidation(inputs: DrossFormationInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check power-speed ratio
    const powerSpeedRatio = (inputs.laserPower * 60) / inputs.cuttingSpeed; // W·s/mm
    const material = materialDrossProperties[inputs.materialType];
    const optimalRatio = material.optimalPowerSpeedRatio * inputs.thickness * 100;
    
    if (Math.abs(powerSpeedRatio - optimalRatio) > optimalRatio * 0.5) {
      warnings.push({
        field: 'laserPower',
        message: 'Power-speed ratio may increase dross formation risk',
        code: 'SUBOPTIMAL_POWER_SPEED'
      });
    }

    // Check gas compatibility
    if (inputs.assistGas !== material.optimalGas) {
      warnings.push({
        field: 'assistGas',
        message: `${material.optimalGas} is recommended for ${inputs.materialType} to minimize dross`,
        code: 'SUBOPTIMAL_GAS'
      });
    }

    // Check gas pressure
    const optimalPressure = this.getOptimalGasPressure(inputs.materialType, inputs.thickness, inputs.assistGas);
    if (Math.abs(inputs.gasPressure - optimalPressure) > optimalPressure * 0.3) {
      warnings.push({
        field: 'gasPressure',
        message: 'Gas pressure significantly deviates from optimal for dross prevention',
        code: 'SUBOPTIMAL_PRESSURE'
      });
    }

    // Check nozzle standoff
    const optimalStandoff = inputs.nozzleDiameter * 0.7;
    if (Math.abs(inputs.nozzleStandoff - optimalStandoff) > 0.5) {
      warnings.push({
        field: 'nozzleStandoff',
        message: 'Nozzle standoff may affect gas flow and dross formation',
        code: 'SUBOPTIMAL_STANDOFF'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: DrossFormationInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialDrossProperties[inputs.materialType];
      const gas = gasEjectionProperties[inputs.assistGas];
      
      // Analyze dross formation
      const drossAnalysis = this.analyzeDrossFormation(inputs, material);
      
      // Analyze melt ejection
      const meltEjectionAnalysis = this.analyzeMeltEjection(inputs, material, gas);
      
      // Assess bottom edge quality
      const bottomEdgeQuality = this.assessBottomEdgeQuality(inputs, drossAnalysis, meltEjectionAnalysis);
      
      // Calculate dross risk score and level
      const drossRiskScore = this.calculateDrossRiskScore(drossAnalysis, meltEjectionAnalysis, material);
      const drossRiskLevel = this.determineDrossRiskLevel(drossRiskScore);
      
      // Generate prevention strategy
      const preventionStrategy = this.generatePreventionStrategy(inputs, material, gas, drossRiskScore);
      
      // Predict quality outcomes
      const qualityPrediction = this.predictQualityOutcomes(inputs, drossAnalysis, preventionStrategy);
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, drossRiskLevel, drossRiskScore);
      const warnings = this.generateWarnings(inputs, drossRiskLevel, drossRiskScore);

      const results: DrossFormationResults = {
        drossRiskLevel,
        drossRiskScore: Math.round(drossRiskScore * 10) / 10,
        drossAnalysis,
        meltEjectionAnalysis,
        bottomEdgeQuality,
        preventionStrategy,
        qualityPrediction,
        recommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Dross formation calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private getOptimalGasPressure(materialType: string, thickness: number, gasType: string): number {
    const basePressures = {
      oxygen: { steel: 1.5, stainless_steel: 2.0, aluminum: 3.0, copper: 4.0, titanium: 2.5, brass: 2.0 },
      nitrogen: { steel: 12, stainless_steel: 15, aluminum: 18, copper: 20, titanium: 16, brass: 14 },
      air: { steel: 3, stainless_steel: 4, aluminum: 5, copper: 6, titanium: 4, brass: 3 },
      argon: { steel: 8, stainless_steel: 10, aluminum: 12, copper: 14, titanium: 10, brass: 9 }
    };
    
    const basePressure = basePressures[gasType][materialType] || 5;
    const thicknessFactor = Math.sqrt(thickness / 5); // Adjust for thickness
    
    return basePressure * thicknessFactor;
  }

  private analyzeDrossFormation(inputs: DrossFormationInputs, material: typeof materialDrossProperties.steel) {
    // Determine formation mechanism
    const powerSpeedRatio = (inputs.laserPower * 60) / inputs.cuttingSpeed;
    const optimalRatio = material.optimalPowerSpeedRatio * inputs.thickness * 100;
    
    let formationMechanism: string;
    if (powerSpeedRatio > optimalRatio * 1.3) {
      formationMechanism = 'Excessive melt pool due to high heat input';
    } else if (inputs.gasPressure < this.getOptimalGasPressure(inputs.materialType, inputs.thickness, inputs.assistGas) * 0.7) {
      formationMechanism = 'Insufficient melt ejection due to low gas pressure';
    } else {
      formationMechanism = 'Normal cutting conditions with material-specific tendency';
    }
    
    // Identify primary causes
    const primaryCauses: string[] = [];
    if (powerSpeedRatio > optimalRatio * 1.2) {
      primaryCauses.push('Excessive power relative to cutting speed');
    }
    if (inputs.gasPressure < this.getOptimalGasPressure(inputs.materialType, inputs.thickness, inputs.assistGas) * 0.8) {
      primaryCauses.push('Insufficient gas pressure for melt ejection');
    }
    if (inputs.assistGas !== material.optimalGas) {
      primaryCauses.push('Suboptimal gas type for material');
    }
    if (inputs.thickness > 15) {
      primaryCauses.push('Thick material increases dross formation tendency');
    }
    
    // Calculate severity score
    const drossLevelScores = { none: 0, minimal: 1, moderate: 3, heavy: 4, severe: 5 };
    const severityScore = drossLevelScores[inputs.currentDrossLevel];
    
    // Determine attachment strength and removal difficulty
    const attachmentStrength = severityScore <= 1 ? 'weak' : severityScore <= 3 ? 'moderate' : 'strong';
    const removalDifficulty = severityScore <= 1 ? 'easy' : severityScore <= 3 ? 'moderate' : 'difficult';
    
    return {
      formationMechanism,
      primaryCauses,
      severityScore,
      attachmentStrength,
      removalDifficulty
    };
  }

  private analyzeMeltEjection(inputs: DrossFormationInputs, material: typeof materialDrossProperties.steel, gas: typeof gasEjectionProperties.oxygen) {
    // Calculate ejection efficiency
    const optimalPressure = this.getOptimalGasPressure(inputs.materialType, inputs.thickness, inputs.assistGas);
    const pressureRatio = inputs.gasPressure / optimalPressure;
    const ejectionEfficiency = gas.ejectionEfficiency * Math.min(1, pressureRatio) * (1 - Math.abs(pressureRatio - 1) * 0.3);
    
    // Calculate gas flow effectiveness
    const standoffOptimal = inputs.nozzleDiameter * 0.7;
    const standoffDeviation = Math.abs(inputs.nozzleStandoff - standoffOptimal) / standoffOptimal;
    const gasFlowEffectiveness = (1 - standoffDeviation) * material.gasFlowSensitivity;
    
    // Calculate melt viscosity (relative)
    const meltViscosity = material.meltViscosity;
    
    // Calculate ejection velocity
    const nozzleArea = Math.PI * Math.pow(inputs.nozzleDiameter / 2000, 2); // m²
    const ejectionVelocity = Math.sqrt(2 * inputs.gasPressure * 100000 / 1.225); // Simplified
    
    // Determine turbulence level
    const turbulenceLevel = gas.turbulenceRisk > 0.6 ? 'high' : gas.turbulenceRisk > 0.4 ? 'medium' : 'low';
    
    return {
      ejectionEfficiency: Math.round(ejectionEfficiency * 1000) / 1000,
      gasFlowEffectiveness: Math.round(gasFlowEffectiveness * 1000) / 1000,
      meltViscosity: Math.round(meltViscosity * 100) / 100,
      ejectionVelocity: Math.round(ejectionVelocity),
      turbulenceLevel
    };
  }

  private assessBottomEdgeQuality(inputs: DrossFormationInputs, drossAnalysis: any, meltEjection: any) {
    // Calculate quality grade (1-5 scale)
    const baseQuality = 5;
    const drossPenalty = drossAnalysis.severityScore * 0.8;
    const ejectionBonus = meltEjection.ejectionEfficiency * 1.0;
    const qualityGrade = Math.max(1, Math.min(5, baseQuality - drossPenalty + ejectionBonus));
    
    // Calculate roughness
    const baseRoughness = 3.2; // μm Ra
    const roughness = baseRoughness * (1 + drossAnalysis.severityScore * 0.3) / meltEjection.ejectionEfficiency;
    
    // Calculate squareness
    const baseSquareness = 0.5; // degrees
    const squareness = baseSquareness * (1 + drossAnalysis.severityScore * 0.2);
    
    // Calculate dross thickness
    const drossThickness = drossAnalysis.severityScore * 20; // μm
    
    // Calculate clean cut percentage
    const cleanCutPercentage = Math.max(0, 100 - drossAnalysis.severityScore * 15);
    
    return {
      qualityGrade: Math.round(qualityGrade * 10) / 10,
      roughness: Math.round(roughness * 10) / 10,
      squareness: Math.round(squareness * 100) / 100,
      drossThickness: Math.round(drossThickness),
      cleanCutPercentage: Math.round(cleanCutPercentage)
    };
  }

  private calculateDrossRiskScore(drossAnalysis: any, meltEjection: any, material: typeof materialDrossProperties.steel): number {
    // Material tendency (0-3)
    const materialRisk = material.drossFormationTendency * 3;
    
    // Ejection efficiency risk (0-2)
    const ejectionRisk = (1 - meltEjection.ejectionEfficiency) * 2;
    
    // Gas flow risk (0-2)
    const gasFlowRisk = (1 - meltEjection.gasFlowEffectiveness) * 2;
    
    // Current severity (0-3)
    const severityRisk = drossAnalysis.severityScore * 0.6;
    
    return Math.min(10, materialRisk + ejectionRisk + gasFlowRisk + severityRisk);
  }

  private determineDrossRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore <= 3) return 'low';
    if (riskScore <= 6) return 'medium';
    if (riskScore <= 8) return 'high';
    return 'critical';
  }

  private generatePreventionStrategy(inputs: DrossFormationInputs, material: typeof materialDrossProperties.steel, gas: typeof gasEjectionProperties.oxygen, riskScore: number) {
    // Parameter optimization
    const powerReduction = riskScore > 6 ? 0.85 : riskScore > 4 ? 0.92 : 1.0;
    const speedIncrease = riskScore > 6 ? 1.15 : riskScore > 4 ? 1.08 : 1.0;
    const pressureOptimal = this.getOptimalGasPressure(inputs.materialType, inputs.thickness, inputs.assistGas);
    const standoffOptimal = inputs.nozzleDiameter * 0.7;
    
    const parameterOptimization = {
      recommendedPower: Math.round(inputs.laserPower * powerReduction),
      recommendedSpeed: Math.round(inputs.cuttingSpeed * speedIncrease),
      recommendedPressure: Math.round(pressureOptimal * 10) / 10,
      recommendedStandoff: Math.round(standoffOptimal * 10) / 10
    };
    
    // Gas flow optimization
    const flowRate = pressureOptimal * inputs.nozzleDiameter * 10; // Simplified calculation
    const gasFlowOptimization = {
      optimalFlowRate: Math.round(flowRate),
      flowPattern: 'Laminar flow with minimal turbulence',
      nozzleAlignment: 'Perpendicular to workpiece surface',
      pressureStability: 'Maintain ±5% pressure variation'
    };
    
    // Process modifications
    const processModifications: string[] = [];
    if (riskScore > 6) {
      processModifications.push('Use multiple passes with reduced power per pass');
      processModifications.push('Implement pulse cutting for better melt control');
    }
    if (inputs.thickness > 15) {
      processModifications.push('Consider pre-heating for thick sections');
    }
    if (material.optimalGas !== inputs.assistGas) {
      processModifications.push(`Switch to ${material.optimalGas} for optimal results`);
    }
    
    // Maintenance actions
    const maintenanceActions: string[] = [
      'Regular nozzle inspection and cleaning',
      'Check gas purity and flow consistency',
      'Verify nozzle alignment and standoff distance'
    ];
    
    if (riskScore > 5) {
      maintenanceActions.push('Increase nozzle replacement frequency');
      maintenanceActions.push('Monitor gas pressure stability');
    }
    
    return {
      parameterOptimization,
      gasFlowOptimization,
      processModifications,
      maintenanceActions
    };
  }

  private predictQualityOutcomes(inputs: DrossFormationInputs, drossAnalysis: any, preventionStrategy: any) {
    // Predict expected dross level after optimization
    const currentSeverity = drossAnalysis.severityScore;
    const improvementPotential = Math.min(3, currentSeverity);
    const newSeverity = Math.max(0, currentSeverity - improvementPotential);
    
    const drossLevels = ['none', 'minimal', 'moderate', 'heavy', 'severe'];
    const expectedDrossLevel = drossLevels[Math.min(4, Math.round(newSeverity))];
    
    // Calculate bottom edge improvement
    const bottomEdgeImprovement = (improvementPotential / currentSeverity) * 100;
    
    // Determine cleaning requirement
    let cleaningRequirement: 'none' | 'minimal' | 'moderate' | 'extensive';
    if (newSeverity <= 1) cleaningRequirement = 'none';
    else if (newSeverity <= 2) cleaningRequirement = 'minimal';
    else if (newSeverity <= 3) cleaningRequirement = 'moderate';
    else cleaningRequirement = 'extensive';
    
    // Identify secondary operations
    const secondaryOperations: string[] = [];
    if (newSeverity > 2) {
      secondaryOperations.push('Mechanical dross removal');
    }
    if (newSeverity > 3) {
      secondaryOperations.push('Edge finishing operations');
      secondaryOperations.push('Quality inspection');
    }
    
    return {
      expectedDrossLevel,
      bottomEdgeImprovement: Math.round(bottomEdgeImprovement),
      cleaningRequirement,
      secondaryOperations
    };
  }

  private generateRecommendations(inputs: DrossFormationInputs, riskLevel: string, riskScore: number): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('Critical dross risk - implement all prevention strategies immediately');
    }
    
    if (riskScore > 6) {
      recommendations.push('Optimize power-speed ratio to reduce melt pool size');
      recommendations.push('Increase gas pressure for better melt ejection');
      recommendations.push('Check and adjust nozzle standoff distance');
    }
    
    const material = materialDrossProperties[inputs.materialType];
    if (inputs.assistGas !== material.optimalGas) {
      recommendations.push(`Switch to ${material.optimalGas} for optimal dross prevention`);
    }
    
    if (inputs.thickness > 15) {
      recommendations.push('Consider multiple pass cutting for thick materials');
    }
    
    if (inputs.currentDrossLevel === 'heavy' || inputs.currentDrossLevel === 'severe') {
      recommendations.push('Implement immediate parameter adjustments');
      recommendations.push('Increase maintenance frequency');
    }
    
    return recommendations;
  }

  private generateWarnings(inputs: DrossFormationInputs, riskLevel: string, riskScore: number): string[] {
    const warnings: string[] = [];
    
    if (riskLevel === 'critical') {
      warnings.push('Critical dross formation risk - parts may require extensive cleaning');
    }
    
    if (riskLevel === 'high') {
      warnings.push('High dross formation risk - implement prevention strategies');
    }
    
    if (inputs.materialType === 'copper' && inputs.assistGas === 'oxygen') {
      warnings.push('Copper with oxygen may cause excessive dross formation');
    }
    
    if (inputs.thickness > 20 && inputs.gasPressure < 10) {
      warnings.push('Thick material with low gas pressure will likely cause heavy dross');
    }
    
    const powerSpeedRatio = (inputs.laserPower * 60) / inputs.cuttingSpeed;
    if (powerSpeedRatio > 200) {
      warnings.push('Very high heat input will cause excessive melt and dross formation');
    }
    
    return warnings;
  }

  getExampleInputs(): DrossFormationInputs {
    return {
      materialType: 'steel',
      thickness: 8,
      laserPower: 2500,
      cuttingSpeed: 2000,
      assistGas: 'oxygen',
      gasPressure: 1.5,
      nozzleDiameter: 1.5,
      nozzleStandoff: 1.0,
      currentDrossLevel: 'moderate'
    };
  }
}
