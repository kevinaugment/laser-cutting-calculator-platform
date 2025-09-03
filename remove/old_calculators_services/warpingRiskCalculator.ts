import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface WarpingRiskCalculatorInputs extends CalculatorInputs {
  materialType: string;
  dimensions: {
    length: number; // mm
    width: number; // mm
    thickness: number; // mm
  };
  partGeometry: {
    shape: 'rectangular' | 'circular' | 'complex' | 'thin_strip' | 'large_plate';
    aspectRatio: number; // length/width
    openings: { count: number; totalArea: number }; // mm²
    supportStructure: 'none' | 'minimal' | 'moderate' | 'extensive';
  };
  cuttingParameters: {
    laserPower: number; // W
    cuttingSpeed: number; // mm/min
    numberOfPasses: number;
    cutSequence: 'outside_first' | 'inside_first' | 'balanced' | 'optimized';
    coolingTime: number; // seconds between passes
  };
  thermalProperties: {
    thermalConductivity: number; // W/m·K
    thermalExpansion: number; // 1/K
    specificHeat: number; // J/kg·K
    density: number; // kg/m³
    yieldStrength: number; // MPa
  };
  environmentalConditions: {
    ambientTemperature: number; // °C
    airflow: 'none' | 'natural' | 'forced' | 'high_velocity';
    humidity: number; // percentage
    supportMethod: 'full_support' | 'edge_support' | 'point_support' | 'minimal_support';
  };
  constraintConditions: {
    fixturingMethod: 'clamps' | 'magnets' | 'vacuum' | 'gravity' | 'none';
    fixturingForce: number; // N
    allowableDeformation: number; // mm
    stressReliefCuts: boolean;
  };
  qualityRequirements: {
    flatnessTolerance: number; // mm
    dimensionalStability: 'low' | 'medium' | 'high' | 'critical';
    postProcessing: 'none' | 'stress_relief' | 'machining' | 'heat_treatment';
  };
}

export interface WarpingRiskCalculatorResults extends CalculatorResults {
  warpingRiskAssessment: {
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number; // 1-10 scale
    confidenceLevel: number; // percentage
    primaryRiskFactors: string[];
    riskDistribution: {
      thermalRisk: number; // percentage
      geometricRisk: number; // percentage
      materialRisk: number; // percentage
      processRisk: number; // percentage
    };
  };
  thermalAnalysis: {
    peakTemperature: number; // °C
    temperatureGradient: number; // °C/mm
    coolingRate: number; // °C/s
    thermalStress: number; // MPa
    heatAffectedArea: number; // mm²
    thermalDistortionPrediction: number; // mm
  };
  mechanicalAnalysis: {
    residualStress: number; // MPa
    elasticDeformation: number; // mm
    plasticDeformation: number; // mm
    totalDeformation: number; // mm
    stressConcentrationFactor: number;
    criticalStressPoints: { x: number; y: number; stress: number }[];
  };
  geometricFactors: {
    aspectRatioEffect: number; // 0-1 scale
    thicknessEffect: number; // 0-1 scale
    openingEffect: number; // 0-1 scale
    shapeComplexity: number; // 0-1 scale
    supportAdequacy: number; // 0-1 scale
    geometricStabilityIndex: number; // 0-10 scale
  };
  preventionStrategies: {
    parameterAdjustments: {
      recommendedPower: number; // W
      recommendedSpeed: number; // mm/min
      recommendedPasses: number;
      coolingStrategy: string;
    };
    sequenceOptimization: {
      optimalCutSequence: string;
      stressReliefPattern: string[];
      supportRecommendations: string[];
    };
    fixtureDesign: {
      fixturingStrategy: string;
      supportPoints: { x: number; y: number; force: number }[];
      clampingForce: number; // N
      releaseSequence: string[];
    };
  };
  mitigationTechniques: {
    preProcessing: string[];
    duringProcess: string[];
    postProcessing: string[];
    emergencyActions: string[];
  };
  qualityPrediction: {
    expectedFlatness: number; // mm deviation
    dimensionalAccuracy: number; // mm tolerance
    repeatability: number; // percentage
    processCapability: number; // Cpk equivalent
    qualityGrade: 'excellent' | 'good' | 'acceptable' | 'poor';
  };
  monitoringPlan: {
    criticalParameters: string[];
    measurementPoints: { x: number; y: number; parameter: string }[];
    inspectionFrequency: string;
    correctionTriggers: string[];
  };
}

export class WarpingRiskCalculator {
  private materialWarpingFactors = {
    'mild_steel': { thermalFactor: 1.0, stiffnessFactor: 1.0, expansionFactor: 1.0 },
    'stainless_steel': { thermalFactor: 1.3, stiffnessFactor: 0.9, expansionFactor: 1.4 },
    'aluminum': { thermalFactor: 2.0, stiffnessFactor: 0.7, expansionFactor: 2.3 },
    'carbon_steel': { thermalFactor: 1.1, stiffnessFactor: 1.1, expansionFactor: 1.0 },
    'copper': { thermalFactor: 3.0, stiffnessFactor: 0.4, expansionFactor: 1.7 },
    'brass': { thermalFactor: 2.5, stiffnessFactor: 0.5, expansionFactor: 1.9 },
    'titanium': { thermalFactor: 0.8, stiffnessFactor: 1.3, expansionFactor: 0.9 }
  };

  private geometryRiskFactors = {
    'rectangular': { baseRisk: 0.3, aspectRatioSensitivity: 0.5 },
    'circular': { baseRisk: 0.2, aspectRatioSensitivity: 0.2 },
    'complex': { baseRisk: 0.7, aspectRatioSensitivity: 0.8 },
    'thin_strip': { baseRisk: 0.9, aspectRatioSensitivity: 1.0 },
    'large_plate': { baseRisk: 0.6, aspectRatioSensitivity: 0.4 }
  };

  calculate(inputs: WarpingRiskCalculatorInputs): WarpingRiskCalculatorResults {
    // Input validation
    this.validateInputs(inputs);

    // Get material properties
    const materialProps = this.getMaterialProperties(inputs.materialType);

    // Assess warping risk
    const warpingRiskAssessment = this.assessWarpingRisk(inputs, materialProps);

    // Analyze thermal effects
    const thermalAnalysis = this.analyzeThermalEffects(inputs, materialProps);

    // Analyze mechanical effects
    const mechanicalAnalysis = this.analyzeMechanicalEffects(inputs, thermalAnalysis);

    // Evaluate geometric factors
    const geometricFactors = this.evaluateGeometricFactors(inputs);

    // Generate prevention strategies
    const preventionStrategies = this.generatePreventionStrategies(inputs, warpingRiskAssessment);

    // Create mitigation techniques
    const mitigationTechniques = this.createMitigationTechniques(inputs, warpingRiskAssessment);

    // Predict quality outcomes
    const qualityPrediction = this.predictQuality(inputs, warpingRiskAssessment, mechanicalAnalysis);

    // Create monitoring plan
    const monitoringPlan = this.createMonitoringPlan(inputs, warpingRiskAssessment);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, warpingRiskAssessment, preventionStrategies);

    return {
      warpingRiskAssessment,
      thermalAnalysis,
      mechanicalAnalysis,
      geometricFactors,
      preventionStrategies,
      mitigationTechniques,
      qualityPrediction,
      monitoringPlan,
      recommendations,
      keyMetrics: {
        'Risk Level': warpingRiskAssessment.overallRiskLevel,
        'Risk Score': `${warpingRiskAssessment.riskScore}/10`,
        'Expected Deformation': `${mechanicalAnalysis.totalDeformation.toFixed(2)} mm`,
        'Quality Grade': qualityPrediction.qualityGrade
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: WarpingRiskCalculatorInputs): void {
    if (inputs.dimensions.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.dimensions.length <= 0 || inputs.dimensions.width <= 0) {
      throw new Error('Length and width must be greater than 0');
    }
    if (inputs.cuttingParameters.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
    if (inputs.cuttingParameters.cuttingSpeed <= 0) {
      throw new Error('Cutting speed must be greater than 0');
    }
  }

  private getMaterialProperties(materialType: string): any {
    const normalizedType = materialType.toLowerCase().replace(/\s+/g, '_');
    return this.materialWarpingFactors[normalizedType] || this.materialWarpingFactors['mild_steel'];
  }

  private assessWarpingRisk(inputs: WarpingRiskCalculatorInputs, materialProps: any): any {
    // Calculate individual risk components
    const thermalRisk = this.calculateThermalRisk(inputs, materialProps);
    const geometricRisk = this.calculateGeometricRisk(inputs);
    const materialRisk = this.calculateMaterialRisk(inputs, materialProps);
    const processRisk = this.calculateProcessRisk(inputs);

    // Weighted risk score
    const riskScore = (thermalRisk * 0.3 + geometricRisk * 0.25 + materialRisk * 0.25 + processRisk * 0.2) * 10;

    // Determine overall risk level
    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 8) overallRiskLevel = 'critical';
    else if (riskScore >= 6) overallRiskLevel = 'high';
    else if (riskScore >= 4) overallRiskLevel = 'medium';
    else overallRiskLevel = 'low';

    // Identify primary risk factors
    const riskFactors = [
      { name: 'High thermal expansion', value: thermalRisk },
      { name: 'Unfavorable geometry', value: geometricRisk },
      { name: 'Material properties', value: materialRisk },
      { name: 'Process parameters', value: processRisk }
    ];
    const primaryRiskFactors = riskFactors
      .filter(factor => factor.value > 0.6)
      .map(factor => factor.name);

    // Calculate confidence level
    const confidenceLevel = Math.min(95, 70 + (10 - riskScore) * 3);

    // Risk distribution
    const totalRisk = thermalRisk + geometricRisk + materialRisk + processRisk;
    const riskDistribution = {
      thermalRisk: Math.round((thermalRisk / totalRisk) * 100),
      geometricRisk: Math.round((geometricRisk / totalRisk) * 100),
      materialRisk: Math.round((materialRisk / totalRisk) * 100),
      processRisk: Math.round((processRisk / totalRisk) * 100)
    };

    return {
      overallRiskLevel,
      riskScore: Math.round(riskScore * 10) / 10,
      confidenceLevel: Math.round(confidenceLevel),
      primaryRiskFactors,
      riskDistribution
    };
  }

  private calculateThermalRisk(inputs: WarpingRiskCalculatorInputs, materialProps: any): number {
    // Power density effect
    const area = inputs.dimensions.length * inputs.dimensions.width;
    const powerDensity = inputs.cuttingParameters.laserPower / area * 1000000; // W/m²

    // Thermal expansion effect
    const expansionRisk = inputs.thermalProperties.thermalExpansion * materialProps.expansionFactor;

    // Cooling rate effect
    const coolingRisk = inputs.environmentalConditions.airflow === 'none' ? 1.0 : 
                       inputs.environmentalConditions.airflow === 'natural' ? 0.8 :
                       inputs.environmentalConditions.airflow === 'forced' ? 0.6 : 0.4;

    // Thickness effect (thinner = higher risk)
    const thicknessRisk = Math.max(0.1, 5 / inputs.dimensions.thickness);

    return Math.min(1.0, (powerDensity / 1000 + expansionRisk * 1000 + coolingRisk + thicknessRisk) / 4);
  }

  private calculateGeometricRisk(inputs: WarpingRiskCalculatorInputs): number {
    const geometryProps = this.geometryRiskFactors[inputs.partGeometry.shape];
    
    // Base geometric risk
    let geometricRisk = geometryProps.baseRisk;

    // Aspect ratio effect
    const aspectRatioEffect = Math.min(1.0, inputs.partGeometry.aspectRatio / 5) * geometryProps.aspectRatioSensitivity;
    geometricRisk += aspectRatioEffect;

    // Opening effect
    const openingRatio = inputs.partGeometry.openings.totalArea / (inputs.dimensions.length * inputs.dimensions.width);
    const openingEffect = Math.min(0.3, openingRatio * 2);
    geometricRisk += openingEffect;

    // Support structure effect
    const supportFactors = { 'none': 0.3, 'minimal': 0.2, 'moderate': 0.1, 'extensive': 0.0 };
    geometricRisk += supportFactors[inputs.partGeometry.supportStructure];

    return Math.min(1.0, geometricRisk);
  }

  private calculateMaterialRisk(inputs: WarpingRiskCalculatorInputs, materialProps: any): number {
    // Thermal conductivity effect (lower = higher risk)
    const conductivityRisk = Math.max(0.1, 1 - inputs.thermalProperties.thermalConductivity / 400);

    // Yield strength effect (lower = higher risk)
    const strengthRisk = Math.max(0.1, 1 - inputs.thermalProperties.yieldStrength / 500);

    // Material factor
    const materialFactor = materialProps.thermalFactor;

    return Math.min(1.0, (conductivityRisk + strengthRisk + materialFactor) / 3);
  }

  private calculateProcessRisk(inputs: WarpingRiskCalculatorInputs): number {
    // Power-speed ratio risk
    const powerSpeedRatio = inputs.cuttingParameters.laserPower / (inputs.cuttingParameters.cuttingSpeed / 1000);
    const ratioRisk = Math.min(1.0, powerSpeedRatio / 1000);

    // Multiple passes risk
    const passRisk = Math.min(0.5, inputs.cuttingParameters.numberOfPasses / 10);

    // Cut sequence risk
    const sequenceRisks = { 'outside_first': 0.1, 'inside_first': 0.3, 'balanced': 0.2, 'optimized': 0.0 };
    const sequenceRisk = sequenceRisks[inputs.cuttingParameters.cutSequence];

    // Fixturing risk
    const fixturingRisks = { 'clamps': 0.1, 'magnets': 0.2, 'vacuum': 0.15, 'gravity': 0.4, 'none': 0.5 };
    const fixturingRisk = fixturingRisks[inputs.constraintConditions.fixturingMethod];

    return Math.min(1.0, (ratioRisk + passRisk + sequenceRisk + fixturingRisk) / 4);
  }

  private analyzeThermalEffects(inputs: WarpingRiskCalculatorInputs, materialProps: any): any {
    // Peak temperature estimation
    const powerDensity = inputs.cuttingParameters.laserPower / (inputs.dimensions.thickness * 10); // Simplified
    const peakTemperature = inputs.environmentalConditions.ambientTemperature + powerDensity * materialProps.thermalFactor;

    // Temperature gradient
    const temperatureGradient = (peakTemperature - inputs.environmentalConditions.ambientTemperature) / inputs.dimensions.thickness;

    // Cooling rate
    const airflowFactors = { 'none': 0.1, 'natural': 0.3, 'forced': 0.6, 'high_velocity': 1.0 };
    const coolingRate = airflowFactors[inputs.environmentalConditions.airflow] * 10;

    // Thermal stress
    const thermalStress = inputs.thermalProperties.thermalExpansion * temperatureGradient * 200000; // Simplified E = 200 GPa

    // Heat affected area
    const heatAffectedArea = Math.PI * Math.pow(inputs.dimensions.thickness * 2, 2);

    // Thermal distortion prediction
    const thermalDistortionPrediction = thermalStress / inputs.thermalProperties.yieldStrength * inputs.dimensions.length / 1000;

    return {
      peakTemperature: Math.round(peakTemperature),
      temperatureGradient: Math.round(temperatureGradient * 10) / 10,
      coolingRate: Math.round(coolingRate * 10) / 10,
      thermalStress: Math.round(thermalStress),
      heatAffectedArea: Math.round(heatAffectedArea),
      thermalDistortionPrediction: Math.round(thermalDistortionPrediction * 1000) / 1000
    };
  }

  private analyzeMechanicalEffects(inputs: WarpingRiskCalculatorInputs, thermal: any): any {
    // Residual stress calculation
    const residualStress = thermal.thermalStress * 0.7; // Simplified

    // Elastic deformation
    const elasticModulus = 200000; // MPa (simplified)
    const elasticDeformation = residualStress / elasticModulus * inputs.dimensions.length;

    // Plastic deformation
    const plasticDeformation = Math.max(0, (residualStress - inputs.thermalProperties.yieldStrength) / elasticModulus * inputs.dimensions.length);

    // Total deformation
    const totalDeformation = elasticDeformation + plasticDeformation;

    // Stress concentration factor
    const openingRatio = inputs.partGeometry.openings.totalArea / (inputs.dimensions.length * inputs.dimensions.width);
    const stressConcentrationFactor = 1 + openingRatio * 2;

    // Critical stress points (simplified)
    const criticalStressPoints = [
      { x: inputs.dimensions.length / 4, y: inputs.dimensions.width / 4, stress: residualStress * 1.2 },
      { x: inputs.dimensions.length * 3 / 4, y: inputs.dimensions.width * 3 / 4, stress: residualStress * 1.1 },
      { x: inputs.dimensions.length / 2, y: inputs.dimensions.width / 2, stress: residualStress }
    ];

    return {
      residualStress: Math.round(residualStress),
      elasticDeformation: Math.round(elasticDeformation * 1000) / 1000,
      plasticDeformation: Math.round(plasticDeformation * 1000) / 1000,
      totalDeformation: Math.round(totalDeformation * 1000) / 1000,
      stressConcentrationFactor: Math.round(stressConcentrationFactor * 100) / 100,
      criticalStressPoints
    };
  }

  private evaluateGeometricFactors(inputs: WarpingRiskCalculatorInputs): any {
    // Aspect ratio effect
    const aspectRatioEffect = Math.min(1.0, 1 / inputs.partGeometry.aspectRatio);

    // Thickness effect
    const thicknessEffect = Math.min(1.0, inputs.dimensions.thickness / 10);

    // Opening effect
    const openingRatio = inputs.partGeometry.openings.totalArea / (inputs.dimensions.length * inputs.dimensions.width);
    const openingEffect = Math.max(0, 1 - openingRatio * 3);

    // Shape complexity
    const complexityFactors = { 'rectangular': 0.9, 'circular': 1.0, 'complex': 0.6, 'thin_strip': 0.4, 'large_plate': 0.7 };
    const shapeComplexity = complexityFactors[inputs.partGeometry.shape];

    // Support adequacy
    const supportFactors = { 'none': 0.2, 'minimal': 0.5, 'moderate': 0.8, 'extensive': 1.0 };
    const supportAdequacy = supportFactors[inputs.partGeometry.supportStructure];

    // Geometric stability index
    const geometricStabilityIndex = (aspectRatioEffect + thicknessEffect + openingEffect + shapeComplexity + supportAdequacy) * 2;

    return {
      aspectRatioEffect: Math.round(aspectRatioEffect * 100) / 100,
      thicknessEffect: Math.round(thicknessEffect * 100) / 100,
      openingEffect: Math.round(openingEffect * 100) / 100,
      shapeComplexity: Math.round(shapeComplexity * 100) / 100,
      supportAdequacy: Math.round(supportAdequacy * 100) / 100,
      geometricStabilityIndex: Math.round(geometricStabilityIndex * 10) / 10
    };
  }

  private generatePreventionStrategies(inputs: WarpingRiskCalculatorInputs, risk: any): any {
    // Parameter adjustments
    const powerReduction = risk.riskScore > 6 ? 0.8 : 0.9;
    const speedIncrease = risk.riskScore > 6 ? 1.2 : 1.1;
    
    const parameterAdjustments = {
      recommendedPower: Math.round(inputs.cuttingParameters.laserPower * powerReduction),
      recommendedSpeed: Math.round(inputs.cuttingParameters.cuttingSpeed * speedIncrease),
      recommendedPasses: risk.riskScore > 7 ? inputs.cuttingParameters.numberOfPasses + 1 : inputs.cuttingParameters.numberOfPasses,
      coolingStrategy: risk.riskScore > 6 ? 'Extended cooling between passes' : 'Standard cooling'
    };

    // Sequence optimization
    const sequenceOptimization = {
      optimalCutSequence: 'Start with internal features, finish with external perimeter',
      stressReliefPattern: [
        'Add stress relief cuts at corners',
        'Use progressive cutting sequence',
        'Implement balanced heat distribution'
      ],
      supportRecommendations: [
        'Use distributed support points',
        'Implement progressive clamping release',
        'Add temporary support structures'
      ]
    };

    // Fixture design
    const fixtureDesign = {
      fixturingStrategy: risk.riskScore > 6 ? 'Multi-point vacuum with backup clamps' : 'Standard clamping',
      supportPoints: [
        { x: inputs.dimensions.length * 0.25, y: inputs.dimensions.width * 0.25, force: 100 },
        { x: inputs.dimensions.length * 0.75, y: inputs.dimensions.width * 0.25, force: 100 },
        { x: inputs.dimensions.length * 0.25, y: inputs.dimensions.width * 0.75, force: 100 },
        { x: inputs.dimensions.length * 0.75, y: inputs.dimensions.width * 0.75, force: 100 }
      ],
      clampingForce: Math.min(500, inputs.constraintConditions.fixturingForce * 1.2),
      releaseSequence: [
        'Release corner clamps first',
        'Gradually reduce clamping force',
        'Final release after complete cooling'
      ]
    };

    return {
      parameterAdjustments,
      sequenceOptimization,
      fixtureDesign
    };
  }

  private createMitigationTechniques(inputs: WarpingRiskCalculatorInputs, risk: any): any {
    const preProcessing = [
      'Pre-heat material to reduce thermal shock',
      'Stress relief annealing for high-stress materials',
      'Surface preparation to ensure uniform heating'
    ];

    const duringProcess = [
      'Real-time temperature monitoring',
      'Adaptive power control based on thermal feedback',
      'Progressive clamping force adjustment',
      'Cooling gas application between passes'
    ];

    const postProcessing = [
      'Controlled cooling under constraint',
      'Stress relief heat treatment if required',
      'Mechanical straightening if within tolerance',
      'Quality inspection and documentation'
    ];

    const emergencyActions = [
      'Immediate process stop if excessive deformation detected',
      'Emergency cooling application',
      'Fixture adjustment to prevent further warping',
      'Part salvage procedures'
    ];

    return {
      preProcessing,
      duringProcess,
      postProcessing,
      emergencyActions
    };
  }

  private predictQuality(inputs: WarpingRiskCalculatorInputs, risk: any, mechanical: any): any {
    // Expected flatness
    const expectedFlatness = mechanical.totalDeformation;

    // Dimensional accuracy
    const dimensionalAccuracy = inputs.qualityRequirements.flatnessTolerance * (1 + risk.riskScore / 10);

    // Repeatability
    const repeatability = Math.max(70, 95 - risk.riskScore * 3);

    // Process capability
    const processCapability = Math.max(0.5, 2 - risk.riskScore / 5);

    // Quality grade
    let qualityGrade: 'excellent' | 'good' | 'acceptable' | 'poor';
    if (expectedFlatness <= inputs.qualityRequirements.flatnessTolerance * 0.5) qualityGrade = 'excellent';
    else if (expectedFlatness <= inputs.qualityRequirements.flatnessTolerance) qualityGrade = 'good';
    else if (expectedFlatness <= inputs.qualityRequirements.flatnessTolerance * 2) qualityGrade = 'acceptable';
    else qualityGrade = 'poor';

    return {
      expectedFlatness: Math.round(expectedFlatness * 1000) / 1000,
      dimensionalAccuracy: Math.round(dimensionalAccuracy * 1000) / 1000,
      repeatability: Math.round(repeatability),
      processCapability: Math.round(processCapability * 100) / 100,
      qualityGrade
    };
  }

  private createMonitoringPlan(inputs: WarpingRiskCalculatorInputs, risk: any): any {
    const criticalParameters = [
      'Part temperature during cutting',
      'Dimensional changes in real-time',
      'Clamping force variations',
      'Ambient temperature fluctuations'
    ];

    const measurementPoints = [
      { x: inputs.dimensions.length / 4, y: inputs.dimensions.width / 4, parameter: 'Temperature' },
      { x: inputs.dimensions.length / 2, y: inputs.dimensions.width / 2, parameter: 'Displacement' },
      { x: inputs.dimensions.length * 3 / 4, y: inputs.dimensions.width * 3 / 4, parameter: 'Temperature' },
      { x: 0, y: 0, parameter: 'Clamping force' }
    ];

    const inspectionFrequency = risk.riskScore > 6 ? 'Continuous monitoring' : 'Every 5 minutes';

    const correctionTriggers = [
      'Temperature exceeds 150°C above ambient',
      'Displacement exceeds 0.1mm during cutting',
      'Clamping force drops below 80% of set value',
      'Visible part movement or vibration'
    ];

    return {
      criticalParameters,
      measurementPoints,
      inspectionFrequency,
      correctionTriggers
    };
  }

  private generateRecommendations(inputs: WarpingRiskCalculatorInputs, risk: any, prevention: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Warping risk level: ${risk.overallRiskLevel} (${risk.riskScore}/10)`);
    recommendations.push(`Primary risk factors: ${risk.primaryRiskFactors.join(', ')}`);

    if (risk.riskScore > 6) {
      recommendations.push('High warping risk - implement comprehensive prevention strategies');
      recommendations.push(`Reduce laser power to ${prevention.parameterAdjustments.recommendedPower}W`);
    }

    if (risk.riskDistribution.thermalRisk > 40) {
      recommendations.push('Thermal effects dominate - focus on cooling and heat management');
    }

    if (risk.riskDistribution.geometricRisk > 40) {
      recommendations.push('Geometric factors critical - optimize support and fixturing');
    }

    recommendations.push('Continuous monitoring recommended for consistent quality');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: WarpingRiskCalculatorInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      power: variations.map(variation => {
        const modifiedInputs = { 
          ...inputs, 
          cuttingParameters: { 
            ...inputs.cuttingParameters, 
            laserPower: inputs.cuttingParameters.laserPower * (1 + variation / 100) 
          } 
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          riskScore: result.warpingRiskAssessment.riskScore,
          deformation: result.mechanicalAnalysis.totalDeformation,
          riskLevel: result.warpingRiskAssessment.overallRiskLevel
        };
      }),
      thickness: variations.map(variation => {
        const modifiedInputs = { 
          ...inputs, 
          dimensions: { 
            ...inputs.dimensions, 
            thickness: inputs.dimensions.thickness * (1 + variation / 100) 
          } 
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          riskScore: result.warpingRiskAssessment.riskScore,
          thermalStress: result.thermalAnalysis.thermalStress,
          qualityGrade: result.qualityPrediction.qualityGrade
        };
      })
    };
  }
}

export const warpingRiskCalculator = new WarpingRiskCalculator();
