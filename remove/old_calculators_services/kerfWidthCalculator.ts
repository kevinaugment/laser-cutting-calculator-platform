import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface KerfWidthInputs extends CalculatorInputs {
  materialType: string;
  thickness: number; // mm
  laserPower: number; // W
  cuttingSpeed: number; // mm/min
  beamDiameter: number; // mm
  gasType: 'oxygen' | 'nitrogen' | 'air' | 'argon';
  gasPressure: number; // bar
  focusPosition: number; // mm (relative to surface)
  pulseFrequency?: number; // Hz (for pulsed lasers)
  materialConstant?: number; // Material-specific constant
}

export interface KerfWidthResults extends CalculatorResults {
  predictedKerfWidth: number; // mm
  kerfWidthRange: { min: number; max: number }; // mm
  compensationValue: number; // mm (for CAD/CAM)
  materialUtilization: number; // percentage
  qualityGrade: number; // 1-5 scale
  heatAffectedZone: number; // mm
  edgeQuality: {
    roughness: number; // Ra in μm
    squareness: number; // degrees from perpendicular
    drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive';
  };
  optimizationSuggestions: string[];
}

export class KerfWidthCalculator {
  private materialConstants: Record<string, number> = {
    'mild_steel': 0.15,
    'stainless_steel': 0.18,
    'aluminum': 0.12,
    'carbon_steel': 0.16,
    'copper': 0.20,
    'brass': 0.17,
    'titanium': 0.22
  };

  calculate(inputs: KerfWidthInputs): KerfWidthResults {
    // Input validation
    this.validateInputs(inputs);

    // Get material constant
    const materialConstant = inputs.materialConstant || this.getMaterialConstant(inputs.materialType);

    // Calculate predicted kerf width
    const predictedKerfWidth = this.calculateKerfWidth(inputs, materialConstant);

    // Calculate kerf width range (±15% variation)
    const kerfWidthRange = {
      min: predictedKerfWidth * 0.85,
      max: predictedKerfWidth * 1.15
    };

    // Calculate compensation value (half of kerf width)
    const compensationValue = predictedKerfWidth / 2;

    // Calculate material utilization impact
    const materialUtilization = this.calculateMaterialUtilization(inputs, predictedKerfWidth);

    // Assess quality grade
    const qualityGrade = this.assessQualityGrade(inputs, predictedKerfWidth);

    // Calculate heat affected zone
    const heatAffectedZone = this.calculateHAZ(inputs, predictedKerfWidth);

    // Assess edge quality
    const edgeQuality = this.assessEdgeQuality(inputs, predictedKerfWidth);

    // Generate optimization suggestions
    const optimizationSuggestions = this.generateOptimizationSuggestions(inputs, predictedKerfWidth);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, predictedKerfWidth);

    return {
      predictedKerfWidth: Math.round(predictedKerfWidth * 1000) / 1000,
      kerfWidthRange: {
        min: Math.round(kerfWidthRange.min * 1000) / 1000,
        max: Math.round(kerfWidthRange.max * 1000) / 1000
      },
      compensationValue: Math.round(compensationValue * 1000) / 1000,
      materialUtilization: Math.round(materialUtilization * 100) / 100,
      qualityGrade,
      heatAffectedZone: Math.round(heatAffectedZone * 1000) / 1000,
      edgeQuality,
      optimizationSuggestions,
      recommendations,
      keyMetrics: {
        'Predicted Kerf Width': `${predictedKerfWidth.toFixed(3)} mm`,
        'Compensation Value': `${compensationValue.toFixed(3)} mm`,
        'Material Utilization': `${materialUtilization.toFixed(1)}%`,
        'Quality Grade': `${qualityGrade}/5`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: KerfWidthInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
    if (inputs.cuttingSpeed <= 0) {
      throw new Error('Cutting speed must be greater than 0');
    }
    if (inputs.beamDiameter <= 0) {
      throw new Error('Beam diameter must be greater than 0');
    }
    if (inputs.gasPressure < 0) {
      throw new Error('Gas pressure cannot be negative');
    }
  }

  private getMaterialConstant(materialType: string): number {
    const normalizedType = materialType.toLowerCase().replace(/\s+/g, '_');
    return this.materialConstants[normalizedType] || 0.15; // Default for unknown materials
  }

  private calculateKerfWidth(inputs: KerfWidthInputs, materialConstant: number): number {
    // Base kerf width calculation using power density and material properties
    const powerDensity = inputs.laserPower / (Math.PI * Math.pow(inputs.beamDiameter / 2, 2));
    const speedFactor = Math.sqrt(inputs.laserPower / (inputs.cuttingSpeed * inputs.thickness));
    
    // Base kerf width
    let kerfWidth = materialConstant * speedFactor;
    
    // Beam diameter contribution
    kerfWidth += inputs.beamDiameter * 0.8;
    
    // Gas type adjustment
    const gasAdjustment = this.getGasAdjustment(inputs.gasType);
    kerfWidth *= gasAdjustment;
    
    // Thickness adjustment
    const thicknessAdjustment = 1 + (inputs.thickness / 50); // Slight increase with thickness
    kerfWidth *= thicknessAdjustment;
    
    // Focus position adjustment
    const focusAdjustment = 1 + Math.abs(inputs.focusPosition) * 0.02;
    kerfWidth *= focusAdjustment;
    
    return Math.max(kerfWidth, inputs.beamDiameter); // Minimum kerf is beam diameter
  }

  private getGasAdjustment(gasType: string): number {
    const adjustments = {
      'oxygen': 1.1,    // Slightly wider due to combustion
      'nitrogen': 0.95, // Cleaner cut, slightly narrower
      'air': 1.05,      // Moderate widening
      'argon': 0.9      // Inert gas, minimal widening
    };
    return adjustments[gasType] || 1.0;
  }

  private calculateMaterialUtilization(inputs: KerfWidthInputs, kerfWidth: number): number {
    // Assume a typical part with 1000mm of cutting length
    const typicalCuttingLength = 1000; // mm
    const kerfLoss = typicalCuttingLength * kerfWidth * inputs.thickness;
    const totalMaterial = 100000; // mm³ (example sheet volume)
    
    return ((totalMaterial - kerfLoss) / totalMaterial) * 100;
  }

  private assessQualityGrade(inputs: KerfWidthInputs, kerfWidth: number): number {
    let grade = 5; // Start with highest grade
    
    // Penalize for excessive kerf width
    if (kerfWidth > inputs.thickness * 0.1) grade -= 1;
    if (kerfWidth > inputs.thickness * 0.15) grade -= 1;
    
    // Adjust for cutting speed (too fast reduces quality)
    const speedRatio = inputs.cuttingSpeed / (inputs.laserPower / inputs.thickness);
    if (speedRatio > 2) grade -= 1;
    if (speedRatio > 3) grade -= 1;
    
    return Math.max(1, grade);
  }

  private calculateHAZ(inputs: KerfWidthInputs, kerfWidth: number): number {
    // Heat affected zone is typically 1.5-3 times the kerf width
    const hazFactor = inputs.gasType === 'oxygen' ? 2.5 : 1.8;
    return kerfWidth * hazFactor;
  }

  private assessEdgeQuality(inputs: KerfWidthInputs, kerfWidth: number): any {
    // Surface roughness estimation
    const roughness = 2 + (kerfWidth / inputs.thickness) * 5; // Ra in μm
    
    // Edge squareness (deviation from 90 degrees)
    const squareness = 0.5 + (kerfWidth / inputs.thickness) * 2;
    
    // Dross level assessment
    let drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive' = 'minimal';
    if (inputs.gasType === 'oxygen' && inputs.thickness > 10) {
      drossLevel = 'moderate';
    } else if (inputs.gasType === 'air' && inputs.thickness > 5) {
      drossLevel = 'moderate';
    }
    
    return {
      roughness: Math.round(roughness * 10) / 10,
      squareness: Math.round(squareness * 10) / 10,
      drossLevel
    };
  }

  private generateOptimizationSuggestions(inputs: KerfWidthInputs, kerfWidth: number): string[] {
    const suggestions: string[] = [];
    
    if (kerfWidth > inputs.thickness * 0.12) {
      suggestions.push('Consider reducing laser power or increasing cutting speed to minimize kerf width');
    }
    
    if (inputs.gasType === 'air' && inputs.thickness > 3) {
      suggestions.push('Switch to nitrogen assist gas for better edge quality and narrower kerf');
    }
    
    if (Math.abs(inputs.focusPosition) > 0.5) {
      suggestions.push('Optimize focus position closer to material surface for better kerf control');
    }
    
    if (inputs.cuttingSpeed > inputs.laserPower / inputs.thickness * 2) {
      suggestions.push('Reduce cutting speed to improve edge quality and kerf consistency');
    }
    
    return suggestions;
  }

  private generateRecommendations(inputs: KerfWidthInputs, kerfWidth: number): string[] {
    const recommendations: string[] = [];
    
    recommendations.push(`Use ${(kerfWidth/2).toFixed(3)}mm compensation in CAD/CAM for accurate dimensions`);
    
    if (kerfWidth < 0.1) {
      recommendations.push('Excellent kerf control achieved - suitable for precision applications');
    } else if (kerfWidth > 0.3) {
      recommendations.push('Wide kerf detected - review parameters for material efficiency');
    }
    
    recommendations.push('Validate kerf width with test cuts before production runs');
    
    return recommendations;
  }

  private performSensitivityAnalysis(inputs: KerfWidthInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-10, -5, 5, 10];
    
    return {
      power: variations.map(variation => {
        const modifiedInputs = { ...inputs, laserPower: inputs.laserPower * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          kerfWidth: result.predictedKerfWidth,
          change: ((result.predictedKerfWidth - baseResult.predictedKerfWidth) / baseResult.predictedKerfWidth * 100).toFixed(1) + '%'
        };
      }),
      speed: variations.map(variation => {
        const modifiedInputs = { ...inputs, cuttingSpeed: inputs.cuttingSpeed * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          kerfWidth: result.predictedKerfWidth,
          change: ((result.predictedKerfWidth - baseResult.predictedKerfWidth) / baseResult.predictedKerfWidth * 100).toFixed(1) + '%'
        };
      })
    };
  }
}

export const kerfWidthCalculator = new KerfWidthCalculator();
