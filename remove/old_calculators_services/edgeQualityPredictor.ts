import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface EdgeQualityPredictorInputs extends CalculatorInputs {
  materialType: string;
  thickness: number; // mm
  laserPower: number; // W
  cuttingSpeed: number; // mm/min
  gasType: 'oxygen' | 'nitrogen' | 'air' | 'argon' | 'helium';
  gasPressure: number; // bar
  focusPosition: number; // mm (+ above surface, - below surface)
  beamQuality: number; // M² factor
  nozzleType: 'single' | 'double' | 'coaxial';
  nozzleDiameter: number; // mm
  nozzleDistance: number; // mm from surface
  surfaceCondition: 'clean' | 'oxidized' | 'oily' | 'painted' | 'galvanized';
  ambientConditions: {
    temperature: number; // °C
    humidity: number; // percentage
    airflow: 'none' | 'low' | 'medium' | 'high';
  };
  qualityTarget: 'production' | 'standard' | 'precision' | 'mirror';
  edgeRequirements: {
    maxRoughness: number; // Ra in μm
    maxTaper: number; // degrees
    maxHAZ: number; // mm
    allowableDross: 'none' | 'minimal' | 'moderate';
  };
}

export interface EdgeQualityPredictorResults extends CalculatorResults {
  qualityPrediction: {
    overallQualityGrade: number; // 1-5 scale
    edgeRoughness: number; // Ra in μm
    surfaceFinish: 'excellent' | 'good' | 'acceptable' | 'poor';
    dimensionalAccuracy: number; // mm tolerance
    confidenceLevel: number; // percentage
  };
  edgeCharacteristics: {
    topEdgeQuality: number; // 1-5 scale
    bottomEdgeQuality: number; // 1-5 scale
    kerfTaper: number; // degrees
    kerfWidth: number; // mm
    heatAffectedZone: number; // mm
    drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive';
  };
  qualityFactors: {
    materialFactor: number; // 0-1 scale
    powerSpeedRatio: number; // W·min/mm
    gasPressureEffect: number; // 0-1 scale
    focusQuality: number; // 0-1 scale
    beamQualityEffect: number; // 0-1 scale
    environmentalImpact: number; // 0-1 scale
  };
  defectRiskAnalysis: {
    roughnessRisk: 'low' | 'medium' | 'high';
    taperRisk: 'low' | 'medium' | 'high';
    drossRisk: 'low' | 'medium' | 'high';
    burnRisk: 'low' | 'medium' | 'high';
    hazRisk: 'low' | 'medium' | 'high';
    mitigationStrategies: string[];
  };
  parameterOptimization: {
    recommendedPower: number; // W
    recommendedSpeed: number; // mm/min
    recommendedPressure: number; // bar
    recommendedFocus: number; // mm
    expectedImprovement: number; // percentage
    optimizationRationale: string[];
  };
  qualityControlPlan: {
    inspectionPoints: string[];
    measurementMethods: string[];
    acceptanceCriteria: string[];
    correctionActions: string[];
  };
  processStability: {
    parameterSensitivity: {
      powerSensitivity: 'low' | 'medium' | 'high';
      speedSensitivity: 'low' | 'medium' | 'high';
      pressureSensitivity: 'low' | 'medium' | 'high';
      focusSensitivity: 'low' | 'medium' | 'high';
    };
    stabilityScore: number; // 1-10 scale
    repeatabilityFactor: number; // percentage
    processCapability: number; // Cpk equivalent
  };
  complianceAssessment: {
    industryStandards: { standard: string; compliance: 'pass' | 'fail' | 'marginal' }[];
    customerRequirements: 'met' | 'exceeded' | 'not_met';
    certificationReadiness: 'ready' | 'needs_improvement' | 'not_ready';
    improvementAreas: string[];
  };
}

export class EdgeQualityPredictor {
  private materialQualityFactors = {
    'mild_steel': { baseFactor: 0.85, roughnessFactor: 1.0, taperFactor: 1.0 },
    'stainless_steel': { baseFactor: 0.75, roughnessFactor: 1.2, taperFactor: 0.9 },
    'aluminum': { baseFactor: 0.90, roughnessFactor: 0.8, taperFactor: 1.1 },
    'carbon_steel': { baseFactor: 0.88, roughnessFactor: 0.95, taperFactor: 0.95 },
    'copper': { baseFactor: 0.65, roughnessFactor: 1.5, taperFactor: 1.3 },
    'brass': { baseFactor: 0.70, roughnessFactor: 1.3, taperFactor: 1.2 },
    'titanium': { baseFactor: 0.80, roughnessFactor: 1.1, taperFactor: 0.8 }
  };

  private gasQualityEffects = {
    'oxygen': { roughness: 1.2, dross: 1.5, haz: 1.3, cost: 1.0 },
    'nitrogen': { roughness: 0.8, dross: 0.3, haz: 0.7, cost: 3.0 },
    'air': { roughness: 1.0, dross: 1.0, haz: 1.0, cost: 0.2 },
    'argon': { roughness: 0.7, dross: 0.2, haz: 0.6, cost: 5.0 },
    'helium': { roughness: 0.6, dross: 0.1, haz: 0.5, cost: 10.0 }
  };

  private qualityTargets = {
    'production': { roughness: 12.5, taper: 2.0, haz: 0.3, grade: 2 },
    'standard': { roughness: 6.3, taper: 1.0, haz: 0.2, grade: 3 },
    'precision': { roughness: 3.2, taper: 0.5, haz: 0.1, grade: 4 },
    'mirror': { roughness: 1.6, taper: 0.2, haz: 0.05, grade: 5 }
  };

  calculate(inputs: EdgeQualityPredictorInputs): EdgeQualityPredictorResults {
    // Input validation
    this.validateInputs(inputs);

    // Get material and gas properties
    const materialProps = this.getMaterialProperties(inputs.materialType);
    const gasProps = this.gasQualityEffects[inputs.gasType];

    // Predict quality characteristics
    const qualityPrediction = this.predictQuality(inputs, materialProps, gasProps);

    // Analyze edge characteristics
    const edgeCharacteristics = this.analyzeEdgeCharacteristics(inputs, materialProps, gasProps);

    // Calculate quality factors
    const qualityFactors = this.calculateQualityFactors(inputs, materialProps, gasProps);

    // Assess defect risks
    const defectRiskAnalysis = this.assessDefectRisks(inputs, qualityPrediction, edgeCharacteristics);

    // Optimize parameters
    const parameterOptimization = this.optimizeParameters(inputs, qualityPrediction);

    // Create quality control plan
    const qualityControlPlan = this.createQualityControlPlan(inputs, qualityPrediction);

    // Assess process stability
    const processStability = this.assessProcessStability(inputs, qualityFactors);

    // Evaluate compliance
    const complianceAssessment = this.evaluateCompliance(inputs, qualityPrediction, edgeCharacteristics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, qualityPrediction, defectRiskAnalysis);

    return {
      qualityPrediction,
      edgeCharacteristics,
      qualityFactors,
      defectRiskAnalysis,
      parameterOptimization,
      qualityControlPlan,
      processStability,
      complianceAssessment,
      recommendations,
      keyMetrics: {
        'Quality Grade': `${qualityPrediction.overallQualityGrade}/5`,
        'Edge Roughness': `${qualityPrediction.edgeRoughness.toFixed(1)} μm Ra`,
        'Confidence': `${qualityPrediction.confidenceLevel.toFixed(0)}%`,
        'Defect Risk': defectRiskAnalysis.roughnessRisk
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: EdgeQualityPredictorInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
    if (inputs.cuttingSpeed <= 0) {
      throw new Error('Cutting speed must be greater than 0');
    }
    if (inputs.gasPressure <= 0) {
      throw new Error('Gas pressure must be greater than 0');
    }
    if (inputs.beamQuality < 1) {
      throw new Error('Beam quality M² must be >= 1');
    }
  }

  private getMaterialProperties(materialType: string): any {
    const normalizedType = materialType.toLowerCase().replace(/\s+/g, '_');
    return this.materialQualityFactors[normalizedType] || this.materialQualityFactors['mild_steel'];
  }

  private predictQuality(inputs: EdgeQualityPredictorInputs, materialProps: any, gasProps: any): any {
    // Base quality calculation
    let baseQuality = materialProps.baseFactor;

    // Power-speed ratio effect
    const powerSpeedRatio = inputs.laserPower / (inputs.cuttingSpeed / 1000); // W·s/mm
    const optimalRatio = inputs.thickness * 50; // Optimal ratio for thickness
    const ratioEffect = Math.exp(-Math.pow((powerSpeedRatio - optimalRatio) / optimalRatio, 2));
    baseQuality *= ratioEffect;

    // Gas pressure effect
    const optimalPressure = inputs.thickness * 0.8 + 2; // Optimal pressure for thickness
    const pressureEffect = Math.exp(-Math.pow((inputs.gasPressure - optimalPressure) / optimalPressure, 2));
    baseQuality *= pressureEffect;

    // Focus position effect
    const optimalFocus = -inputs.thickness / 3; // Optimal focus position
    const focusEffect = Math.exp(-Math.pow((inputs.focusPosition - optimalFocus) / 0.5, 2));
    baseQuality *= focusEffect;

    // Beam quality effect
    const beamEffect = 1 / inputs.beamQuality;
    baseQuality *= beamEffect;

    // Gas type effect
    baseQuality *= (2 - gasProps.roughness) / 2;

    // Environmental effects
    const tempEffect = Math.exp(-Math.pow((inputs.ambientConditions.temperature - 20) / 30, 2));
    const humidityEffect = Math.exp(-Math.pow((inputs.ambientConditions.humidity - 50) / 40, 2));
    baseQuality *= tempEffect * humidityEffect;

    // Convert to quality grade (1-5)
    const overallQualityGrade = Math.max(1, Math.min(5, baseQuality * 5));

    // Calculate edge roughness
    const baseRoughness = 12.5; // μm Ra baseline
    const edgeRoughness = baseRoughness * materialProps.roughnessFactor * gasProps.roughness / baseQuality;

    // Determine surface finish
    let surfaceFinish: 'excellent' | 'good' | 'acceptable' | 'poor';
    if (edgeRoughness <= 1.6) surfaceFinish = 'excellent';
    else if (edgeRoughness <= 3.2) surfaceFinish = 'good';
    else if (edgeRoughness <= 6.3) surfaceFinish = 'acceptable';
    else surfaceFinish = 'poor';

    // Calculate dimensional accuracy
    const dimensionalAccuracy = 0.05 + (1 - baseQuality) * 0.2; // mm

    // Calculate confidence level
    const confidenceLevel = Math.min(95, baseQuality * 85 + 10);

    return {
      overallQualityGrade: Math.round(overallQualityGrade * 10) / 10,
      edgeRoughness: Math.round(edgeRoughness * 10) / 10,
      surfaceFinish,
      dimensionalAccuracy: Math.round(dimensionalAccuracy * 1000) / 1000,
      confidenceLevel: Math.round(confidenceLevel)
    };
  }

  private analyzeEdgeCharacteristics(inputs: EdgeQualityPredictorInputs, materialProps: any, gasProps: any): any {
    // Top edge quality (better with positive focus)
    const topEdgeQuality = Math.max(1, Math.min(5, 4 + inputs.focusPosition * 2));

    // Bottom edge quality (better with negative focus)
    const bottomEdgeQuality = Math.max(1, Math.min(5, 4 - inputs.focusPosition * 2));

    // Kerf taper calculation
    const kerfTaper = Math.abs(inputs.focusPosition) * materialProps.taperFactor * 0.5 + inputs.thickness * 0.02;

    // Kerf width calculation
    const baseKerfWidth = 0.1 + inputs.thickness / 100;
    const kerfWidth = baseKerfWidth * (1 + inputs.laserPower / 5000) * (1 + 1 / inputs.cuttingSpeed * 1000);

    // Heat affected zone
    const heatAffectedZone = kerfWidth * gasProps.haz * (inputs.laserPower / 1000) / (inputs.cuttingSpeed / 1000);

    // Dross level assessment
    let drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive' = 'minimal';
    const drossRisk = gasProps.dross * inputs.thickness / 10 * (inputs.laserPower / inputs.cuttingSpeed * 1000);
    if (drossRisk > 3) drossLevel = 'excessive';
    else if (drossRisk > 2) drossLevel = 'moderate';
    else if (drossRisk > 1) drossLevel = 'minimal';
    else drossLevel = 'none';

    return {
      topEdgeQuality: Math.round(topEdgeQuality * 10) / 10,
      bottomEdgeQuality: Math.round(bottomEdgeQuality * 10) / 10,
      kerfTaper: Math.round(kerfTaper * 100) / 100,
      kerfWidth: Math.round(kerfWidth * 1000) / 1000,
      heatAffectedZone: Math.round(heatAffectedZone * 1000) / 1000,
      drossLevel
    };
  }

  private calculateQualityFactors(inputs: EdgeQualityPredictorInputs, materialProps: any, gasProps: any): any {
    const materialFactor = materialProps.baseFactor;
    const powerSpeedRatio = inputs.laserPower / (inputs.cuttingSpeed / 1000);
    const gasPressureEffect = Math.min(1, inputs.gasPressure / 10);
    const focusQuality = Math.exp(-Math.pow(inputs.focusPosition / 2, 2));
    const beamQualityEffect = 1 / inputs.beamQuality;
    const environmentalImpact = Math.exp(-Math.pow((inputs.ambientConditions.temperature - 20) / 30, 2)) *
                               Math.exp(-Math.pow((inputs.ambientConditions.humidity - 50) / 40, 2));

    return {
      materialFactor: Math.round(materialFactor * 100) / 100,
      powerSpeedRatio: Math.round(powerSpeedRatio * 100) / 100,
      gasPressureEffect: Math.round(gasPressureEffect * 100) / 100,
      focusQuality: Math.round(focusQuality * 100) / 100,
      beamQualityEffect: Math.round(beamQualityEffect * 100) / 100,
      environmentalImpact: Math.round(environmentalImpact * 100) / 100
    };
  }

  private assessDefectRisks(inputs: EdgeQualityPredictorInputs, quality: any, edge: any): any {
    // Roughness risk
    const roughnessRisk = quality.edgeRoughness > inputs.edgeRequirements.maxRoughness ? 'high' :
                         quality.edgeRoughness > inputs.edgeRequirements.maxRoughness * 0.8 ? 'medium' : 'low';

    // Taper risk
    const taperRisk = edge.kerfTaper > inputs.edgeRequirements.maxTaper ? 'high' :
                     edge.kerfTaper > inputs.edgeRequirements.maxTaper * 0.8 ? 'medium' : 'low';

    // Dross risk
    const drossRisk = edge.drossLevel === 'excessive' ? 'high' :
                     edge.drossLevel === 'moderate' ? 'medium' : 'low';

    // Burn risk (based on power and speed)
    const burnRisk = inputs.laserPower / inputs.cuttingSpeed > 0.5 ? 'high' :
                    inputs.laserPower / inputs.cuttingSpeed > 0.3 ? 'medium' : 'low';

    // HAZ risk
    const hazRisk = edge.heatAffectedZone > inputs.edgeRequirements.maxHAZ ? 'high' :
                   edge.heatAffectedZone > inputs.edgeRequirements.maxHAZ * 0.8 ? 'medium' : 'low';

    const mitigationStrategies = [
      'Optimize power-speed ratio for material thickness',
      'Adjust gas pressure for better edge quality',
      'Fine-tune focus position for optimal cutting',
      'Monitor and control environmental conditions',
      'Implement real-time quality monitoring'
    ];

    return {
      roughnessRisk,
      taperRisk,
      drossRisk,
      burnRisk,
      hazRisk,
      mitigationStrategies
    };
  }

  private optimizeParameters(inputs: EdgeQualityPredictorInputs, quality: any): any {
    // Optimize power for target quality
    const targetQuality = this.qualityTargets[inputs.qualityTarget];
    const currentQuality = quality.overallQualityGrade;
    
    let recommendedPower = inputs.laserPower;
    let recommendedSpeed = inputs.cuttingSpeed;
    let recommendedPressure = inputs.gasPressure;
    let recommendedFocus = inputs.focusPosition;

    // Power optimization
    if (currentQuality < targetQuality.grade) {
      recommendedPower *= 0.9; // Reduce power for better quality
      recommendedSpeed *= 0.9; // Reduce speed for better quality
    }

    // Pressure optimization
    const optimalPressure = inputs.thickness * 0.8 + 2;
    recommendedPressure = optimalPressure;

    // Focus optimization
    const optimalFocus = -inputs.thickness / 3;
    recommendedFocus = optimalFocus;

    const expectedImprovement = Math.min(30, (targetQuality.grade - currentQuality) / targetQuality.grade * 100);

    const optimizationRationale = [
      'Power reduced to minimize heat input and improve edge quality',
      'Speed adjusted to optimize power density',
      'Gas pressure set to optimal value for material thickness',
      'Focus position optimized for best edge quality balance'
    ];

    return {
      recommendedPower: Math.round(recommendedPower),
      recommendedSpeed: Math.round(recommendedSpeed),
      recommendedPressure: Math.round(recommendedPressure * 10) / 10,
      recommendedFocus: Math.round(recommendedFocus * 100) / 100,
      expectedImprovement: Math.round(expectedImprovement),
      optimizationRationale
    };
  }

  private createQualityControlPlan(inputs: EdgeQualityPredictorInputs, quality: any): any {
    const inspectionPoints = [
      'First article inspection after setup',
      'Edge roughness measurement every 10 parts',
      'Dimensional accuracy check every 25 parts',
      'Visual inspection for dross and burn marks',
      'Final quality audit before shipment'
    ];

    const measurementMethods = [
      'Surface roughness tester for Ra measurement',
      'Coordinate measuring machine for dimensions',
      'Visual inspection with magnification',
      'Kerf width measurement with calipers',
      'Heat affected zone measurement'
    ];

    const acceptanceCriteria = [
      `Surface roughness ≤ ${inputs.edgeRequirements.maxRoughness} μm Ra`,
      `Kerf taper ≤ ${inputs.edgeRequirements.maxTaper}°`,
      `Heat affected zone ≤ ${inputs.edgeRequirements.maxHAZ} mm`,
      `Dross level: ${inputs.edgeRequirements.allowableDross} or better`,
      'No visible burn marks or discoloration'
    ];

    const correctionActions = [
      'Adjust laser power if roughness exceeds limits',
      'Modify cutting speed for dimensional issues',
      'Change gas pressure for dross problems',
      'Refocus beam for taper correction',
      'Clean or replace nozzle if contaminated'
    ];

    return {
      inspectionPoints,
      measurementMethods,
      acceptanceCriteria,
      correctionActions
    };
  }

  private assessProcessStability(inputs: EdgeQualityPredictorInputs, factors: any): any {
    // Parameter sensitivity assessment
    const powerSensitivity = factors.beamQualityEffect < 0.8 ? 'high' : factors.beamQualityEffect < 0.9 ? 'medium' : 'low';
    const speedSensitivity = factors.powerSpeedRatio > 100 ? 'high' : factors.powerSpeedRatio > 50 ? 'medium' : 'low';
    const pressureSensitivity = factors.gasPressureEffect < 0.8 ? 'high' : factors.gasPressureEffect < 0.9 ? 'medium' : 'low';
    const focusSensitivity = factors.focusQuality < 0.8 ? 'high' : factors.focusQuality < 0.9 ? 'medium' : 'low';

    // Overall stability score
    const stabilityScore = (factors.materialFactor + factors.focusQuality + factors.beamQualityEffect + factors.environmentalImpact) * 2.5;

    // Repeatability factor
    const repeatabilityFactor = Math.min(99, stabilityScore * 10 + 80);

    // Process capability (simplified Cpk)
    const processCapability = Math.min(2.0, stabilityScore / 5 * 2);

    return {
      parameterSensitivity: {
        powerSensitivity,
        speedSensitivity,
        pressureSensitivity,
        focusSensitivity
      },
      stabilityScore: Math.round(stabilityScore * 10) / 10,
      repeatabilityFactor: Math.round(repeatabilityFactor * 10) / 10,
      processCapability: Math.round(processCapability * 100) / 100
    };
  }

  private evaluateCompliance(inputs: EdgeQualityPredictorInputs, quality: any, edge: any): any {
    const industryStandards = [
      {
        standard: 'ISO 9013 (Thermal cutting quality)',
        compliance: quality.overallQualityGrade >= 3 ? 'pass' : 'fail'
      },
      {
        standard: 'AWS D1.1 (Structural welding code)',
        compliance: edge.heatAffectedZone <= 0.5 ? 'pass' : 'marginal'
      },
      {
        standard: 'ASME Section IX (Welding qualifications)',
        compliance: quality.edgeRoughness <= 6.3 ? 'pass' : 'fail'
      }
    ];

    const customerRequirements = quality.overallQualityGrade >= this.qualityTargets[inputs.qualityTarget].grade ? 'met' : 'not_met';

    const certificationReadiness = industryStandards.every(s => s.compliance === 'pass') ? 'ready' : 
                                  industryStandards.some(s => s.compliance === 'fail') ? 'not_ready' : 'needs_improvement';

    const improvementAreas = [];
    if (quality.edgeRoughness > inputs.edgeRequirements.maxRoughness) {
      improvementAreas.push('Surface roughness improvement needed');
    }
    if (edge.kerfTaper > inputs.edgeRequirements.maxTaper) {
      improvementAreas.push('Kerf taper reduction required');
    }
    if (edge.heatAffectedZone > inputs.edgeRequirements.maxHAZ) {
      improvementAreas.push('Heat affected zone minimization needed');
    }

    return {
      industryStandards,
      customerRequirements,
      certificationReadiness,
      improvementAreas
    };
  }

  private generateRecommendations(inputs: EdgeQualityPredictorInputs, quality: any, risks: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Predicted edge quality: ${quality.overallQualityGrade}/5 with ${quality.confidenceLevel}% confidence`);
    recommendations.push(`Expected surface roughness: ${quality.edgeRoughness} μm Ra`);

    if (risks.roughnessRisk === 'high') {
      recommendations.push('High roughness risk - reduce cutting speed and optimize gas pressure');
    }

    if (risks.drossRisk === 'high') {
      recommendations.push('High dross risk - increase gas pressure and check nozzle condition');
    }

    if (risks.taperRisk === 'high') {
      recommendations.push('High taper risk - optimize focus position and beam alignment');
    }

    recommendations.push('Implement continuous quality monitoring for consistent results');
    recommendations.push('Regular parameter validation recommended for process stability');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: EdgeQualityPredictorInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-10, -5, 5, 10];

    return {
      power: variations.map(variation => {
        const modifiedInputs = { ...inputs, laserPower: inputs.laserPower * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          qualityGrade: result.qualityPrediction.overallQualityGrade,
          roughness: result.qualityPrediction.edgeRoughness,
          confidence: result.qualityPrediction.confidenceLevel
        };
      }),
      speed: variations.map(variation => {
        const modifiedInputs = { ...inputs, cuttingSpeed: inputs.cuttingSpeed * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          qualityGrade: result.qualityPrediction.overallQualityGrade,
          roughness: result.qualityPrediction.edgeRoughness,
          drossLevel: result.edgeCharacteristics.drossLevel
        };
      }),
      focus: variations.map(variation => {
        const modifiedInputs = { ...inputs, focusPosition: inputs.focusPosition + (variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${(variation / 100).toFixed(2)}mm`,
          qualityGrade: result.qualityPrediction.overallQualityGrade,
          topEdge: result.edgeCharacteristics.topEdgeQuality,
          bottomEdge: result.edgeCharacteristics.bottomEdgeQuality
        };
      })
    };
  }
}

export const edgeQualityPredictor = new EdgeQualityPredictor();
