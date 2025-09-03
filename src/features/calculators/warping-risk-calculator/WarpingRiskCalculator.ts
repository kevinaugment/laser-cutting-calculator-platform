// Warping Risk Calculator Implementation
// Comprehensive warping risk analysis for thermal distortion control

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const warpingRiskSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.5).max(50),
  length: z.number().min(10).max(3000),
  width: z.number().min(10).max(3000),
  laserPower: z.number().min(500).max(20000),
  cuttingSpeed: z.number().min(100).max(15000),
  numberOfPasses: z.number().min(1).max(10).optional().default(1),
  supportType: z.enum(['none', 'minimal', 'moderate', 'extensive']),
  coolingMethod: z.enum(['none', 'natural', 'forced', 'controlled']),
  ambientTemperature: z.number().min(-10).max(50).optional().default(20)
});

// Input types
export type WarpingRiskInputs = z.infer<typeof warpingRiskSchema>;

// Result types
export interface WarpingRiskResults {
  overallRiskScore: number;         // 0-10 scale (10 = highest risk)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  thermalAnalysis: {
    peakTemperature: number;        // °C
    temperatureGradient: number;    // °C/mm
    thermalStress: number;          // MPa
    coolingRate: number;            // °C/s
    heatAffectedArea: number;       // mm²
  };
  mechanicalAnalysis: {
    residualStress: number;         // MPa
    elasticDeformation: number;     // mm
    plasticDeformation: number;     // mm
    totalDeformation: number;       // mm
    stressConcentration: number;    // factor
  };
  geometricFactors: {
    aspectRatio: number;            // length/width
    thicknessRatio: number;         // thickness/length
    supportAdequacy: number;        // 0-1 scale
    shapeComplexity: number;        // 0-1 scale
  };
  preventionStrategies: {
    parameterAdjustments: {
      recommendedPower: number;     // W
      recommendedSpeed: number;     // mm/min
      recommendedPasses: number;
    };
    supportRecommendations: string[];
    coolingStrategies: string[];
    sequenceOptimization: string[];
  };
  predictions: {
    expectedFlatness: number;       // mm deviation
    dimensionalAccuracy: number;    // mm tolerance
    warpingDirection: string;
    criticalAreas: string[];
  };
  recommendations: string[];
  warnings: string[];
}

// Material thermal properties database
const materialThermalProperties = {
  steel: {
    thermalExpansion: 12e-6,        // /K
    thermalConductivity: 50,        // W/m·K
    specificHeat: 490,              // J/kg·K
    density: 7850,                  // kg/m³
    yieldStrength: 250,             // MPa
    elasticModulus: 200000,         // MPa
    warpingTendency: 0.7,
    thermalFactor: 1.0
  },
  stainless_steel: {
    thermalExpansion: 17e-6,
    thermalConductivity: 16,
    specificHeat: 500,
    density: 8000,
    yieldStrength: 205,
    elasticModulus: 200000,
    warpingTendency: 0.8,
    thermalFactor: 1.2
  },
  aluminum: {
    thermalExpansion: 23e-6,
    thermalConductivity: 237,
    specificHeat: 896,
    density: 2700,
    yieldStrength: 276,
    elasticModulus: 70000,
    warpingTendency: 0.9,
    thermalFactor: 0.6
  },
  copper: {
    thermalExpansion: 17e-6,
    thermalConductivity: 401,
    specificHeat: 385,
    density: 8960,
    yieldStrength: 70,
    elasticModulus: 110000,
    warpingTendency: 0.6,
    thermalFactor: 0.4
  },
  titanium: {
    thermalExpansion: 8.6e-6,
    thermalConductivity: 22,
    specificHeat: 520,
    density: 4500,
    yieldStrength: 275,
    elasticModulus: 114000,
    warpingTendency: 0.5,
    thermalFactor: 1.1
  },
  brass: {
    thermalExpansion: 19e-6,
    thermalConductivity: 120,
    specificHeat: 380,
    density: 8500,
    yieldStrength: 310,
    elasticModulus: 100000,
    warpingTendency: 0.7,
    thermalFactor: 0.8
  }
};

export class WarpingRiskCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'warping-risk-calculator',
    title: 'Warping Risk Calculator',
    description: 'Analyze thermal distortion and warping risks in laser cutting',
    category: 'Quality Control',
    badge: 'Standard',
    iconName: 'AlertTriangle',
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
        id: 'length',
        label: 'Part Length',
        type: 'number',
        required: true,
        min: 10,
        max: 3000,
        step: 1,
        unit: 'mm',
        help: 'Length of the part to be cut'
      },
      {
        id: 'width',
        label: 'Part Width',
        type: 'number',
        required: true,
        min: 10,
        max: 3000,
        step: 1,
        unit: 'mm',
        help: 'Width of the part to be cut'
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
        id: 'numberOfPasses',
        label: 'Number of Passes',
        type: 'number',
        required: false,
        min: 1,
        max: 10,
        step: 1,
        unit: 'passes',
        help: 'Number of cutting passes (optional, default: 1)'
      },
      {
        id: 'supportType',
        label: 'Support Type',
        type: 'select',
        required: true,
        help: 'Type of workpiece support',
        options: [
          { value: 'none', label: 'No Support' },
          { value: 'minimal', label: 'Minimal Support' },
          { value: 'moderate', label: 'Moderate Support' },
          { value: 'extensive', label: 'Extensive Support' }
        ]
      },
      {
        id: 'coolingMethod',
        label: 'Cooling Method',
        type: 'select',
        required: true,
        help: 'Cooling method used',
        options: [
          { value: 'none', label: 'No Cooling' },
          { value: 'natural', label: 'Natural Cooling' },
          { value: 'forced', label: 'Forced Air Cooling' },
          { value: 'controlled', label: 'Controlled Cooling' }
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
    return warpingRiskSchema;
  }

  customValidation(inputs: WarpingRiskInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check aspect ratio
    const aspectRatio = Math.max(inputs.length, inputs.width) / Math.min(inputs.length, inputs.width);
    if (aspectRatio > 10) {
      warnings.push({
        field: 'length',
        message: 'High aspect ratio (>10:1) significantly increases warping risk',
        code: 'HIGH_ASPECT_RATIO'
      });
    }

    // Check thickness ratio
    const thicknessRatio = inputs.thickness / Math.max(inputs.length, inputs.width);
    if (thicknessRatio < 0.01) {
      warnings.push({
        field: 'thickness',
        message: 'Very thin material relative to dimensions increases warping risk',
        code: 'THIN_MATERIAL'
      });
    }

    // Check power density
    const area = inputs.length * inputs.width;
    const powerDensity = inputs.laserPower / area;
    if (powerDensity > 1.0) {
      warnings.push({
        field: 'laserPower',
        message: 'High power density may cause excessive thermal stress and warping',
        code: 'HIGH_POWER_DENSITY'
      });
    }

    // Check support adequacy
    if (inputs.supportType === 'none' && aspectRatio > 5) {
      warnings.push({
        field: 'supportType',
        message: 'Large parts without support are prone to warping. Consider adding support.',
        code: 'INADEQUATE_SUPPORT'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: WarpingRiskInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialThermalProperties[inputs.materialType];
      
      // Calculate thermal analysis
      const thermalAnalysis = this.calculateThermalAnalysis(inputs, material);
      
      // Calculate mechanical analysis
      const mechanicalAnalysis = this.calculateMechanicalAnalysis(inputs, material, thermalAnalysis);
      
      // Analyze geometric factors
      const geometricFactors = this.analyzeGeometricFactors(inputs);
      
      // Calculate overall risk score
      const overallRiskScore = this.calculateOverallRiskScore(inputs, material, thermalAnalysis, mechanicalAnalysis, geometricFactors);
      
      // Determine risk level
      const riskLevel = this.determineRiskLevel(overallRiskScore);
      
      // Generate prevention strategies
      const preventionStrategies = this.generatePreventionStrategies(inputs, overallRiskScore, material);
      
      // Make predictions
      const predictions = this.makePredictions(inputs, mechanicalAnalysis, geometricFactors);
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, overallRiskScore, riskLevel);
      const warnings = this.generateWarnings(inputs, overallRiskScore, riskLevel);

      const results: WarpingRiskResults = {
        overallRiskScore: Math.round(overallRiskScore * 10) / 10,
        riskLevel,
        thermalAnalysis,
        mechanicalAnalysis,
        geometricFactors,
        preventionStrategies,
        predictions,
        recommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Warping risk calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateThermalAnalysis(inputs: WarpingRiskInputs, material: typeof materialThermalProperties.steel) {
    // Calculate heat input
    const heatInput = (inputs.laserPower * 60) / inputs.cuttingSpeed; // J/mm
    
    // Calculate power density
    const area = inputs.length * inputs.width; // mm²
    const powerDensity = inputs.laserPower / area; // W/mm²
    
    // Calculate peak temperature
    const energyDensity = heatInput / inputs.thickness;
    const temperatureRise = energyDensity / (material.density * material.specificHeat / 1000000);
    const peakTemperature = inputs.ambientTemperature + temperatureRise;
    
    // Calculate temperature gradient
    const temperatureGradient = temperatureRise / (inputs.thickness * 2);
    
    // Calculate thermal stress
    const thermalStress = material.thermalExpansion * temperatureRise * material.elasticModulus;
    
    // Calculate cooling rate
    const coolingFactors = { none: 0.1, natural: 0.3, forced: 0.6, controlled: 1.0 };
    const coolingRate = coolingFactors[inputs.coolingMethod] * material.thermalConductivity / 10;
    
    // Calculate heat affected area
    const heatAffectedArea = Math.PI * Math.pow(inputs.thickness * 3, 2);
    
    return {
      peakTemperature: Math.round(peakTemperature),
      temperatureGradient: Math.round(temperatureGradient * 100) / 100,
      thermalStress: Math.round(thermalStress),
      coolingRate: Math.round(coolingRate * 10) / 10,
      heatAffectedArea: Math.round(heatAffectedArea)
    };
  }

  private calculateMechanicalAnalysis(inputs: WarpingRiskInputs, material: typeof materialThermalProperties.steel, thermal: any) {
    // Calculate residual stress
    const residualStress = thermal.thermalStress * 0.7; // Simplified
    
    // Calculate elastic deformation
    const elasticDeformation = (residualStress / material.elasticModulus) * inputs.length;
    
    // Calculate plastic deformation
    const plasticDeformation = Math.max(0, 
      ((residualStress - material.yieldStrength) / material.elasticModulus) * inputs.length
    );
    
    // Calculate total deformation
    const totalDeformation = elasticDeformation + plasticDeformation;
    
    // Calculate stress concentration factor
    const aspectRatio = Math.max(inputs.length, inputs.width) / Math.min(inputs.length, inputs.width);
    const stressConcentration = 1 + (aspectRatio - 1) * 0.1;
    
    return {
      residualStress: Math.round(residualStress),
      elasticDeformation: Math.round(elasticDeformation * 1000) / 1000,
      plasticDeformation: Math.round(plasticDeformation * 1000) / 1000,
      totalDeformation: Math.round(totalDeformation * 1000) / 1000,
      stressConcentration: Math.round(stressConcentration * 100) / 100
    };
  }

  private analyzeGeometricFactors(inputs: WarpingRiskInputs) {
    // Calculate aspect ratio
    const aspectRatio = Math.max(inputs.length, inputs.width) / Math.min(inputs.length, inputs.width);
    
    // Calculate thickness ratio
    const thicknessRatio = inputs.thickness / Math.max(inputs.length, inputs.width);
    
    // Support adequacy
    const supportFactors = { none: 0.0, minimal: 0.3, moderate: 0.7, extensive: 1.0 };
    const supportAdequacy = supportFactors[inputs.supportType];
    
    // Shape complexity (simplified)
    const shapeComplexity = Math.min(1.0, aspectRatio / 10);
    
    return {
      aspectRatio: Math.round(aspectRatio * 100) / 100,
      thicknessRatio: Math.round(thicknessRatio * 10000) / 10000,
      supportAdequacy: Math.round(supportAdequacy * 100) / 100,
      shapeComplexity: Math.round(shapeComplexity * 100) / 100
    };
  }

  private calculateOverallRiskScore(inputs: WarpingRiskInputs, material: typeof materialThermalProperties.steel, thermal: any, mechanical: any, geometric: any): number {
    // Thermal risk component (0-3)
    const thermalRisk = Math.min(3, (thermal.thermalStress / material.yieldStrength) * 3);
    
    // Geometric risk component (0-3)
    const geometricRisk = Math.min(3, 
      (geometric.aspectRatio / 10) * 2 + 
      (1 - geometric.supportAdequacy) * 1
    );
    
    // Material risk component (0-2)
    const materialRisk = material.warpingTendency * 2;
    
    // Process risk component (0-2)
    const powerDensity = inputs.laserPower / (inputs.length * inputs.width);
    const processRisk = Math.min(2, powerDensity * 2 + (inputs.numberOfPasses - 1) * 0.5);
    
    // Total risk score (0-10)
    return Math.min(10, thermalRisk + geometricRisk + materialRisk + processRisk);
  }

  private determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore <= 3) return 'low';
    if (riskScore <= 6) return 'medium';
    if (riskScore <= 8) return 'high';
    return 'critical';
  }

  private generatePreventionStrategies(inputs: WarpingRiskInputs, riskScore: number, material: typeof materialThermalProperties.steel) {
    // Parameter adjustments
    const powerReduction = riskScore > 6 ? 0.8 : 0.9;
    const speedIncrease = riskScore > 6 ? 1.2 : 1.1;
    const passIncrease = riskScore > 7 ? 1 : 0;
    
    const parameterAdjustments = {
      recommendedPower: Math.round(inputs.laserPower * powerReduction),
      recommendedSpeed: Math.round(inputs.cuttingSpeed * speedIncrease),
      recommendedPasses: inputs.numberOfPasses + passIncrease
    };
    
    // Support recommendations
    const supportRecommendations: string[] = [];
    if (inputs.supportType === 'none' && riskScore > 4) {
      supportRecommendations.push('Add workpiece support to reduce warping');
    }
    if (riskScore > 6) {
      supportRecommendations.push('Use extensive support with clamping');
      supportRecommendations.push('Consider fixture design for thermal expansion');
    }
    
    // Cooling strategies
    const coolingStrategies: string[] = [];
    if (inputs.coolingMethod === 'none' && riskScore > 3) {
      coolingStrategies.push('Implement forced air cooling');
    }
    if (riskScore > 6) {
      coolingStrategies.push('Use controlled cooling between passes');
      coolingStrategies.push('Consider water-cooled fixtures');
    }
    
    // Sequence optimization
    const sequenceOptimization: string[] = [];
    if (riskScore > 5) {
      sequenceOptimization.push('Cut from center outward to balance thermal stress');
      sequenceOptimization.push('Use skip cutting pattern to distribute heat');
      sequenceOptimization.push('Allow cooling time between sections');
    }
    
    return {
      parameterAdjustments,
      supportRecommendations,
      coolingStrategies,
      sequenceOptimization
    };
  }

  private makePredictions(inputs: WarpingRiskInputs, mechanical: any, geometric: any) {
    // Expected flatness deviation
    const expectedFlatness = mechanical.totalDeformation * (1 + geometric.aspectRatio / 10);
    
    // Dimensional accuracy
    const dimensionalAccuracy = mechanical.totalDeformation * 0.5;
    
    // Warping direction
    const warpingDirection = geometric.aspectRatio > 2 ? 
      'Primarily along the longer dimension' : 
      'Uniform in all directions';
    
    // Critical areas
    const criticalAreas: string[] = [];
    if (geometric.aspectRatio > 5) {
      criticalAreas.push('Ends of long dimension');
    }
    if (inputs.supportType === 'none') {
      criticalAreas.push('Unsupported areas');
    }
    if (geometric.supportAdequacy < 0.5) {
      criticalAreas.push('Center of the part');
    }
    
    return {
      expectedFlatness: Math.round(expectedFlatness * 1000) / 1000,
      dimensionalAccuracy: Math.round(dimensionalAccuracy * 1000) / 1000,
      warpingDirection,
      criticalAreas
    };
  }

  private generateRecommendations(inputs: WarpingRiskInputs, riskScore: number, riskLevel: string): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('Critical warping risk - consider alternative cutting strategy');
    }
    
    if (riskScore > 6) {
      recommendations.push('Reduce laser power and increase cutting speed');
      recommendations.push('Implement extensive workpiece support');
      recommendations.push('Use controlled cooling between passes');
    }
    
    if (inputs.supportType === 'none' && riskScore > 3) {
      recommendations.push('Add workpiece support to minimize warping');
    }
    
    if (inputs.coolingMethod === 'none' && riskScore > 4) {
      recommendations.push('Implement active cooling to reduce thermal stress');
    }
    
    const aspectRatio = Math.max(inputs.length, inputs.width) / Math.min(inputs.length, inputs.width);
    if (aspectRatio > 8) {
      recommendations.push('Consider cutting in sections for very long parts');
    }
    
    if (inputs.numberOfPasses > 3) {
      recommendations.push('Allow cooling time between multiple passes');
    }
    
    return recommendations;
  }

  private generateWarnings(inputs: WarpingRiskInputs, riskScore: number, riskLevel: string): string[] {
    const warnings: string[] = [];
    
    if (riskLevel === 'critical') {
      warnings.push('Critical warping risk - parts may not meet dimensional tolerances');
    }
    
    if (riskLevel === 'high') {
      warnings.push('High warping risk - implement prevention strategies');
    }
    
    if (inputs.supportType === 'none' && riskScore > 5) {
      warnings.push('Unsupported cutting with high risk - expect significant warping');
    }
    
    const thicknessRatio = inputs.thickness / Math.max(inputs.length, inputs.width);
    if (thicknessRatio < 0.005) {
      warnings.push('Very thin material - extremely prone to warping');
    }
    
    if (inputs.materialType === 'aluminum' && riskScore > 4) {
      warnings.push('Aluminum has high thermal expansion - warping likely');
    }
    
    return warnings;
  }

  getExampleInputs(): WarpingRiskInputs {
    return {
      materialType: 'steel',
      thickness: 3,
      length: 500,
      width: 200,
      laserPower: 2000,
      cuttingSpeed: 2500,
      numberOfPasses: 1,
      supportType: 'moderate',
      coolingMethod: 'natural',
      ambientTemperature: 20
    };
  }
}
