import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface QualityGradePredictorInputs extends CalculatorInputs {
  materialType: string;
  thickness: number; // mm
  laserPower: number; // W
  cuttingSpeed: number; // mm/min
  gasType: 'oxygen' | 'nitrogen' | 'air' | 'argon';
  gasPressure: number; // bar
  focusPosition: number; // mm (relative to surface)
  beamDiameter: number; // mm
  pulseFrequency?: number; // Hz (for pulsed lasers)
  nozzleDistance: number; // mm
  targetQuality: 'production' | 'standard' | 'high' | 'precision';
}

export interface QualityGradePredictorResults extends CalculatorResults {
  predictedQualityGrade: number; // 1-5 scale (ISO 9013)
  qualityMetrics: {
    surfaceRoughness: number; // Ra in μm
    edgeSquareness: number; // degrees deviation from 90°
    drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive';
    kerfWidth: number; // mm
    heatAffectedZone: number; // mm
  };
  qualityAssessment: {
    overallScore: number; // 0-100
    strengthAreas: string[];
    improvementAreas: string[];
    qualityRisk: 'low' | 'medium' | 'high';
  };
  parameterOptimization: {
    recommendedPower: number; // W
    recommendedSpeed: number; // mm/min
    recommendedGasPressure: number; // bar
    recommendedFocusPosition: number; // mm
    expectedImprovement: number; // percentage
  };
  qualityControl: {
    criticalParameters: string[];
    toleranceRanges: Record<string, { min: number; max: number; unit: string }>;
    inspectionPoints: string[];
    qualityChecklist: string[];
  };
  costQualityAnalysis: {
    qualityPremium: number; // percentage cost increase for higher quality
    timeImpact: number; // percentage time increase for higher quality
    materialWaste: number; // percentage due to quality issues
    reworkRisk: number; // percentage probability
  };
}

export class QualityGradePredictor {
  private materialQualityFactors: Record<string, number> = {
    'mild_steel': 1.0,
    'stainless_steel': 0.9,
    'aluminum': 1.1,
    'carbon_steel': 0.95,
    'copper': 0.8,
    'brass': 0.85,
    'titanium': 0.7
  };

  private qualityStandards = {
    1: { roughness: 12.5, squareness: 4.0, description: 'Rough cut' },
    2: { roughness: 6.3, squareness: 2.0, description: 'Standard cut' },
    3: { roughness: 3.2, squareness: 1.0, description: 'Good cut' },
    4: { roughness: 1.6, squareness: 0.5, description: 'High quality cut' },
    5: { roughness: 0.8, squareness: 0.25, description: 'Precision cut' }
  };

  calculate(inputs: QualityGradePredictorInputs): QualityGradePredictorResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate quality metrics
    const qualityMetrics = this.calculateQualityMetrics(inputs);

    // Predict quality grade
    const predictedQualityGrade = this.predictQualityGrade(inputs, qualityMetrics);

    // Assess overall quality
    const qualityAssessment = this.assessQuality(inputs, qualityMetrics, predictedQualityGrade);

    // Optimize parameters
    const parameterOptimization = this.optimizeParameters(inputs, qualityMetrics);

    // Generate quality control guidelines
    const qualityControl = this.generateQualityControl(inputs, qualityMetrics);

    // Analyze cost-quality relationship
    const costQualityAnalysis = this.analyzeCostQuality(inputs, predictedQualityGrade);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, qualityAssessment, parameterOptimization);

    return {
      predictedQualityGrade,
      qualityMetrics,
      qualityAssessment,
      parameterOptimization,
      qualityControl,
      costQualityAnalysis,
      recommendations,
      keyMetrics: {
        'Quality Grade': `${predictedQualityGrade}/5`,
        'Surface Roughness': `${qualityMetrics.surfaceRoughness.toFixed(1)} μm`,
        'Edge Squareness': `${qualityMetrics.edgeSquareness.toFixed(2)}°`,
        'Overall Score': `${qualityAssessment.overallScore}/100`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: QualityGradePredictorInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
    if (inputs.cuttingSpeed <= 0) {
      throw new Error('Cutting speed must be greater than 0');
    }
    if (inputs.gasPressure < 0) {
      throw new Error('Gas pressure cannot be negative');
    }
    if (inputs.beamDiameter <= 0) {
      throw new Error('Beam diameter must be greater than 0');
    }
  }

  private calculateQualityMetrics(inputs: QualityGradePredictorInputs): any {
    // Calculate surface roughness
    const surfaceRoughness = this.calculateSurfaceRoughness(inputs);

    // Calculate edge squareness
    const edgeSquareness = this.calculateEdgeSquareness(inputs);

    // Assess dross level
    const drossLevel = this.assessDrossLevel(inputs);

    // Calculate kerf width
    const kerfWidth = this.calculateKerfWidth(inputs);

    // Calculate heat affected zone
    const heatAffectedZone = this.calculateHAZ(inputs);

    return {
      surfaceRoughness: Math.round(surfaceRoughness * 10) / 10,
      edgeSquareness: Math.round(edgeSquareness * 100) / 100,
      drossLevel,
      kerfWidth: Math.round(kerfWidth * 1000) / 1000,
      heatAffectedZone: Math.round(heatAffectedZone * 1000) / 1000
    };
  }

  private calculateSurfaceRoughness(inputs: QualityGradePredictorInputs): number {
    // Base roughness calculation
    const materialFactor = this.getMaterialQualityFactor(inputs.materialType);
    const speedFactor = Math.pow(inputs.cuttingSpeed / 1000, 0.3);
    const powerFactor = Math.pow(inputs.laserPower / 1000, -0.2);
    const thicknessFactor = Math.pow(inputs.thickness, 0.15);

    let roughness = 2.5 * materialFactor * speedFactor * powerFactor * thicknessFactor;

    // Gas type adjustment
    const gasAdjustment = this.getGasQualityAdjustment(inputs.gasType);
    roughness *= gasAdjustment;

    // Focus position adjustment
    const focusAdjustment = 1 + Math.abs(inputs.focusPosition) * 0.1;
    roughness *= focusAdjustment;

    return Math.max(0.5, roughness);
  }

  private calculateEdgeSquareness(inputs: QualityGradePredictorInputs): number {
    // Base squareness calculation (deviation from 90 degrees)
    const thicknessFactor = inputs.thickness / 10;
    const speedFactor = inputs.cuttingSpeed / 2000;
    const powerRatio = inputs.laserPower / (inputs.thickness * 200);

    let squareness = 0.5 + thicknessFactor * 0.3 + speedFactor * 0.2;

    // Power adequacy adjustment
    if (powerRatio < 1) {
      squareness *= (2 - powerRatio); // Insufficient power increases deviation
    }

    // Gas pressure adjustment
    const optimalPressure = this.getOptimalGasPressure(inputs.gasType, inputs.thickness);
    const pressureDeviation = Math.abs(inputs.gasPressure - optimalPressure) / optimalPressure;
    squareness *= (1 + pressureDeviation * 0.5);

    return Math.max(0.1, squareness);
  }

  private assessDrossLevel(inputs: QualityGradePredictorInputs): 'none' | 'minimal' | 'moderate' | 'excessive' {
    let drossScore = 0;

    // Material contribution
    if (inputs.materialType.toLowerCase().includes('steel')) {
      drossScore += 2;
    } else if (inputs.materialType.toLowerCase().includes('aluminum')) {
      drossScore += 1;
    }

    // Thickness contribution
    if (inputs.thickness > 10) drossScore += 2;
    else if (inputs.thickness > 5) drossScore += 1;

    // Gas type contribution
    if (inputs.gasType === 'oxygen') drossScore += 2;
    else if (inputs.gasType === 'air') drossScore += 1;

    // Speed contribution
    if (inputs.cuttingSpeed > 3000) drossScore += 1;

    if (drossScore <= 1) return 'none';
    if (drossScore <= 3) return 'minimal';
    if (drossScore <= 5) return 'moderate';
    return 'excessive';
  }

  private calculateKerfWidth(inputs: QualityGradePredictorInputs): number {
    // Simplified kerf width calculation
    const baseFactor = 0.15;
    const speedFactor = Math.sqrt(inputs.laserPower / (inputs.cuttingSpeed * inputs.thickness));
    return Math.max(inputs.beamDiameter, baseFactor * speedFactor + inputs.beamDiameter * 0.8);
  }

  private calculateHAZ(inputs: QualityGradePredictorInputs): number {
    // Heat affected zone calculation
    const kerfWidth = this.calculateKerfWidth(inputs);
    const hazFactor = inputs.gasType === 'oxygen' ? 2.5 : 1.8;
    return kerfWidth * hazFactor;
  }

  private predictQualityGrade(inputs: QualityGradePredictorInputs, metrics: any): number {
    let grade = 5; // Start with highest grade

    // Check against quality standards
    for (let i = 5; i >= 1; i--) {
      const standard = this.qualityStandards[i];
      if (metrics.surfaceRoughness <= standard.roughness && 
          metrics.edgeSquareness <= standard.squareness) {
        grade = i;
        break;
      }
    }

    // Adjust for dross level
    if (metrics.drossLevel === 'excessive') grade = Math.min(grade, 2);
    else if (metrics.drossLevel === 'moderate') grade = Math.min(grade, 3);

    // Adjust for HAZ
    if (metrics.heatAffectedZone > inputs.thickness * 0.3) grade = Math.min(grade, 3);

    return Math.max(1, grade);
  }

  private assessQuality(inputs: QualityGradePredictorInputs, metrics: any, grade: number): any {
    const overallScore = (grade / 5) * 100;

    const strengthAreas: string[] = [];
    const improvementAreas: string[] = [];

    // Assess individual metrics
    if (metrics.surfaceRoughness < 3.2) strengthAreas.push('Excellent surface finish');
    else improvementAreas.push('Surface roughness needs improvement');

    if (metrics.edgeSquareness < 1.0) strengthAreas.push('Good edge squareness');
    else improvementAreas.push('Edge squareness needs improvement');

    if (metrics.drossLevel === 'none' || metrics.drossLevel === 'minimal') {
      strengthAreas.push('Minimal dross formation');
    } else {
      improvementAreas.push('Dross formation needs control');
    }

    // Determine quality risk
    let qualityRisk: 'low' | 'medium' | 'high' = 'low';
    if (grade <= 2) qualityRisk = 'high';
    else if (grade <= 3) qualityRisk = 'medium';

    return {
      overallScore: Math.round(overallScore),
      strengthAreas,
      improvementAreas,
      qualityRisk
    };
  }

  private optimizeParameters(inputs: QualityGradePredictorInputs, metrics: any): any {
    // Calculate optimized parameters for better quality
    let recommendedPower = inputs.laserPower;
    let recommendedSpeed = inputs.cuttingSpeed;
    let recommendedGasPressure = inputs.gasPressure;
    let recommendedFocusPosition = inputs.focusPosition;

    // Optimize based on current quality issues
    if (metrics.surfaceRoughness > 3.2) {
      recommendedSpeed *= 0.9; // Reduce speed for better surface finish
      recommendedPower *= 0.95; // Slightly reduce power
    }

    if (metrics.edgeSquareness > 1.0) {
      recommendedFocusPosition = Math.abs(recommendedFocusPosition) * 0.5; // Optimize focus
      recommendedGasPressure = this.getOptimalGasPressure(inputs.gasType, inputs.thickness);
    }

    if (metrics.drossLevel === 'moderate' || metrics.drossLevel === 'excessive') {
      recommendedGasPressure *= 1.1; // Increase gas pressure
      recommendedSpeed *= 0.85; // Reduce speed
    }

    // Calculate expected improvement
    const currentScore = (metrics.surfaceRoughness <= 3.2 ? 1 : 0) + 
                        (metrics.edgeSquareness <= 1.0 ? 1 : 0) + 
                        (metrics.drossLevel === 'none' || metrics.drossLevel === 'minimal' ? 1 : 0);
    const expectedImprovement = Math.min(30, (3 - currentScore) * 10);

    return {
      recommendedPower: Math.round(recommendedPower),
      recommendedSpeed: Math.round(recommendedSpeed),
      recommendedGasPressure: Math.round(recommendedGasPressure * 10) / 10,
      recommendedFocusPosition: Math.round(recommendedFocusPosition * 10) / 10,
      expectedImprovement: Math.round(expectedImprovement)
    };
  }

  private generateQualityControl(inputs: QualityGradePredictorInputs, metrics: any): any {
    const criticalParameters = ['Laser Power', 'Cutting Speed', 'Gas Pressure', 'Focus Position'];

    const toleranceRanges = {
      'Laser Power': { min: inputs.laserPower * 0.95, max: inputs.laserPower * 1.05, unit: 'W' },
      'Cutting Speed': { min: inputs.cuttingSpeed * 0.9, max: inputs.cuttingSpeed * 1.1, unit: 'mm/min' },
      'Gas Pressure': { min: inputs.gasPressure * 0.9, max: inputs.gasPressure * 1.1, unit: 'bar' },
      'Focus Position': { min: inputs.focusPosition - 0.2, max: inputs.focusPosition + 0.2, unit: 'mm' }
    };

    const inspectionPoints = [
      'Surface roughness measurement',
      'Edge squareness check',
      'Dross level assessment',
      'Dimensional accuracy verification'
    ];

    const qualityChecklist = [
      'Verify laser power stability',
      'Check gas purity and flow rate',
      'Confirm focus position accuracy',
      'Monitor cutting speed consistency',
      'Inspect edge quality regularly'
    ];

    return {
      criticalParameters,
      toleranceRanges,
      inspectionPoints,
      qualityChecklist
    };
  }

  private analyzeCostQuality(inputs: QualityGradePredictorInputs, grade: number): any {
    // Calculate quality premium
    const qualityPremium = Math.max(0, (grade - 2) * 15); // 15% per grade above standard

    // Calculate time impact
    const timeImpact = Math.max(0, (grade - 2) * 20); // 20% per grade above standard

    // Calculate material waste
    const materialWaste = Math.max(0, (5 - grade) * 5); // 5% per grade below maximum

    // Calculate rework risk
    const reworkRisk = Math.max(0, (5 - grade) * 10); // 10% per grade below maximum

    return {
      qualityPremium: Math.round(qualityPremium),
      timeImpact: Math.round(timeImpact),
      materialWaste: Math.round(materialWaste),
      reworkRisk: Math.round(reworkRisk)
    };
  }

  private getMaterialQualityFactor(materialType: string): number {
    const normalizedType = materialType.toLowerCase().replace(/\s+/g, '_');
    return this.materialQualityFactors[normalizedType] || 1.0;
  }

  private getGasQualityAdjustment(gasType: string): number {
    const adjustments = {
      'oxygen': 1.1,    // Slightly rougher due to oxidation
      'nitrogen': 0.9,  // Cleaner cut
      'air': 1.05,      // Moderate quality
      'argon': 0.85     // Very clean cut
    };
    return adjustments[gasType] || 1.0;
  }

  private getOptimalGasPressure(gasType: string, thickness: number): number {
    const basePressures = {
      'oxygen': 1.5 + thickness * 0.2,
      'nitrogen': 2.0 + thickness * 0.3,
      'air': 1.2 + thickness * 0.15,
      'argon': 1.8 + thickness * 0.25
    };
    return basePressures[gasType] || 2.0;
  }

  private generateRecommendations(inputs: QualityGradePredictorInputs, assessment: any, optimization: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Predicted quality grade: ${this.predictQualityGrade(inputs, this.calculateQualityMetrics(inputs))}/5`);

    if (assessment.qualityRisk === 'high') {
      recommendations.push('High quality risk detected - review and optimize cutting parameters');
    }

    if (optimization.expectedImprovement > 10) {
      recommendations.push(`Parameter optimization could improve quality by ${optimization.expectedImprovement}%`);
    }

    recommendations.push('Regular quality monitoring and parameter validation recommended');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: QualityGradePredictorInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-10, -5, 5, 10];

    return {
      power: variations.map(variation => {
        const modifiedInputs = { ...inputs, laserPower: inputs.laserPower * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          qualityGrade: result.predictedQualityGrade,
          change: result.predictedQualityGrade - baseResult.predictedQualityGrade
        };
      }),
      speed: variations.map(variation => {
        const modifiedInputs = { ...inputs, cuttingSpeed: inputs.cuttingSpeed * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          qualityGrade: result.predictedQualityGrade,
          change: result.predictedQualityGrade - baseResult.predictedQualityGrade
        };
      })
    };
  }
}

export const qualityGradePredictor = new QualityGradePredictor();
