import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface CutFeature {
  id: string;
  type: 'external' | 'internal' | 'hole' | 'slot' | 'notch';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startPoint: { x: number; y: number }; // mm
  endPoint: { x: number; y: number }; // mm
  length: number; // mm
  complexity: 'simple' | 'moderate' | 'complex';
  thermalSensitive: boolean;
  requiresPrecision: boolean;
  partId: string;
}

export interface CutPathOptimizerInputs extends CalculatorInputs {
  sheetDimensions: { length: number; width: number }; // mm
  cutFeatures: CutFeature[];
  cuttingParameters: {
    cuttingSpeed: number; // mm/min
    rapidSpeed: number; // mm/min
    pierceTime: number; // seconds
    leadInLength: number; // mm
    leadOutLength: number; // mm
    kerfWidth: number; // mm
  };
  optimizationGoals: {
    minimizeCuttingTime: number; // weight 0-100
    minimizeThermalDistortion: number; // weight 0-100
    maximizeQuality: number; // weight 0-100
    minimizeWear: number; // weight 0-100
  };
  constraints: {
    maxContinuousCuttingTime: number; // minutes
    coolingBreakDuration: number; // seconds
    startPosition: { x: number; y: number }; // mm
    endPosition: { x: number; y: number }; // mm
    allowBridging: boolean;
    bridgeLength: number; // mm
  };
  materialProperties: {
    materialType: string;
    thickness: number; // mm
    thermalConductivity: number; // W/m·K
    heatCapacity: number; // J/kg·K
    thermalExpansion: number; // 1/K
  };
  qualityRequirements: {
    dimensionalTolerance: number; // mm
    surfaceFinish: 'rough' | 'standard' | 'smooth' | 'mirror';
    edgeQuality: 'production' | 'standard' | 'precision';
  };
}

export interface CutPathOptimizerResults extends CalculatorResults {
  optimizedPath: {
    sequenceNumber: number;
    featureId: string;
    featureType: string;
    startTime: number; // minutes from start
    cuttingTime: number; // minutes
    travelTime: number; // minutes
    pierceTime: number; // minutes
    totalTime: number; // minutes
    thermalLoad: number; // 1-10 scale
    qualityRisk: 'low' | 'medium' | 'high';
  }[];
  pathSummary: {
    totalCuttingTime: number; // minutes
    totalTravelTime: number; // minutes
    totalPierceTime: number; // minutes
    totalProcessTime: number; // minutes
    totalTravelDistance: number; // mm
    numberOfPierces: number;
    coolingBreaks: number;
  };
  thermalAnalysis: {
    peakThermalLoad: number; // 1-10 scale
    thermalDistortionRisk: 'low' | 'medium' | 'high';
    hotSpots: { x: number; y: number; risk: number }[];
    coolingStrategy: string[];
    thermalManagement: string[];
  };
  qualityPrediction: {
    overallQualityScore: number; // 1-10 scale
    dimensionalAccuracy: number; // mm expected deviation
    surfaceFinishQuality: number; // 1-5 scale
    edgeConsistency: number; // 1-5 scale
    riskAreas: { featureId: string; risk: string; mitigation: string }[];
  };
  efficiencyMetrics: {
    cuttingEfficiency: number; // percentage
    pathEfficiency: number; // percentage
    materialUtilization: number; // percentage
    energyEfficiency: number; // percentage
    productivityIndex: number; // parts per hour
  };
  alternativeStrategies: {
    strategyName: string;
    totalTime: number; // minutes
    qualityScore: number; // 1-10
    thermalRisk: 'low' | 'medium' | 'high';
    description: string;
    tradeoffs: string[];
  }[];
  optimizationRecommendations: {
    pathImprovements: string[];
    parameterAdjustments: string[];
    sequenceOptimizations: string[];
    qualityEnhancements: string[];
  };
  riskMitigation: {
    thermalRisks: { risk: string; mitigation: string; priority: 'low' | 'medium' | 'high' }[];
    qualityRisks: { risk: string; mitigation: string; priority: 'low' | 'medium' | 'high' }[];
    productionRisks: { risk: string; mitigation: string; priority: 'low' | 'medium' | 'high' }[];
  };
}

export class CutPathOptimizer {
  private featureTypeWeights = {
    'external': { complexity: 1.0, thermal: 1.2, quality: 1.0 },
    'internal': { complexity: 1.1, thermal: 1.0, quality: 1.1 },
    'hole': { complexity: 0.8, thermal: 0.8, quality: 1.2 },
    'slot': { complexity: 1.2, thermal: 1.1, quality: 1.1 },
    'notch': { complexity: 0.9, thermal: 0.9, quality: 1.0 }
  };

  private materialThermalFactors = {
    'mild_steel': { conductivity: 50.2, expansion: 12e-6, heatCapacity: 490 },
    'stainless_steel': { conductivity: 16.2, expansion: 17e-6, heatCapacity: 500 },
    'aluminum': { conductivity: 237, expansion: 23e-6, heatCapacity: 900 },
    'carbon_steel': { conductivity: 54, expansion: 12e-6, heatCapacity: 490 },
    'copper': { conductivity: 401, expansion: 17e-6, heatCapacity: 385 }
  };

  calculate(inputs: CutPathOptimizerInputs): CutPathOptimizerResults {
    // Input validation
    this.validateInputs(inputs);

    // Optimize cutting sequence
    const optimizedPath = this.optimizeCuttingSequence(inputs);

    // Calculate path summary
    const pathSummary = this.calculatePathSummary(optimizedPath, inputs);

    // Analyze thermal effects
    const thermalAnalysis = this.analyzeThermalEffects(optimizedPath, inputs);

    // Predict quality outcomes
    const qualityPrediction = this.predictQuality(optimizedPath, inputs);

    // Calculate efficiency metrics
    const efficiencyMetrics = this.calculateEfficiencyMetrics(pathSummary, inputs);

    // Generate alternative strategies
    const alternativeStrategies = this.generateAlternativeStrategies(inputs);

    // Create optimization recommendations
    const optimizationRecommendations = this.createOptimizationRecommendations(inputs, pathSummary, thermalAnalysis);

    // Assess and mitigate risks
    const riskMitigation = this.assessRiskMitigation(inputs, thermalAnalysis, qualityPrediction);

    // Generate general recommendations
    const recommendations = this.generateRecommendations(inputs, pathSummary, efficiencyMetrics);

    return {
      optimizedPath,
      pathSummary,
      thermalAnalysis,
      qualityPrediction,
      efficiencyMetrics,
      alternativeStrategies,
      optimizationRecommendations,
      riskMitigation,
      recommendations,
      keyMetrics: {
        'Total Process Time': `${pathSummary.totalProcessTime.toFixed(1)} min`,
        'Cutting Efficiency': `${efficiencyMetrics.cuttingEfficiency.toFixed(1)}%`,
        'Quality Score': `${qualityPrediction.overallQualityScore}/10`,
        'Thermal Risk': thermalAnalysis.thermalDistortionRisk
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: CutPathOptimizerInputs): void {
    if (inputs.cutFeatures.length === 0) {
      throw new Error('At least one cut feature must be specified');
    }
    if (inputs.cuttingParameters.cuttingSpeed <= 0) {
      throw new Error('Cutting speed must be greater than 0');
    }
    if (inputs.cuttingParameters.rapidSpeed <= 0) {
      throw new Error('Rapid speed must be greater than 0');
    }
    if (inputs.sheetDimensions.length <= 0 || inputs.sheetDimensions.width <= 0) {
      throw new Error('Sheet dimensions must be greater than 0');
    }
  }

  private optimizeCuttingSequence(inputs: CutPathOptimizerInputs): any[] {
    // Sort features by priority and optimization criteria
    const sortedFeatures = this.sortFeaturesByPriority(inputs.cutFeatures, inputs.optimizationGoals);
    
    const optimizedPath: any[] = [];
    let currentPosition = inputs.constraints.startPosition;
    let currentTime = 0;
    let thermalLoad = 0;

    for (let i = 0; i < sortedFeatures.length; i++) {
      const feature = sortedFeatures[i];
      
      // Calculate travel time and distance
      const travelDistance = this.calculateDistance(currentPosition, feature.startPoint);
      const travelTime = travelDistance / inputs.cuttingParameters.rapidSpeed;
      
      // Calculate cutting time
      const cuttingTime = feature.length / inputs.cuttingParameters.cuttingSpeed;
      
      // Calculate pierce time
      const pierceTime = inputs.cuttingParameters.pierceTime / 60; // Convert to minutes
      
      // Calculate thermal load
      const featureWeight = this.featureTypeWeights[feature.type];
      const newThermalLoad = this.calculateThermalLoad(feature, inputs, thermalLoad);
      
      // Determine quality risk
      const qualityRisk = this.assessQualityRisk(feature, newThermalLoad, inputs);
      
      // Check if cooling break is needed
      const needsCoolingBreak = this.needsCoolingBreak(currentTime, cuttingTime, inputs.constraints.maxContinuousCuttingTime);
      if (needsCoolingBreak) {
        currentTime += inputs.constraints.coolingBreakDuration / 60; // Convert to minutes
        thermalLoad *= 0.7; // Reduce thermal load after cooling
      }

      const totalTime = travelTime + cuttingTime + pierceTime;

      optimizedPath.push({
        sequenceNumber: i + 1,
        featureId: feature.id,
        featureType: feature.type,
        startTime: Math.round(currentTime * 100) / 100,
        cuttingTime: Math.round(cuttingTime * 100) / 100,
        travelTime: Math.round(travelTime * 100) / 100,
        pierceTime: Math.round(pierceTime * 100) / 100,
        totalTime: Math.round(totalTime * 100) / 100,
        thermalLoad: Math.round(newThermalLoad * 10) / 10,
        qualityRisk
      });

      currentTime += totalTime;
      currentPosition = feature.endPoint;
      thermalLoad = newThermalLoad;
    }

    return optimizedPath;
  }

  private sortFeaturesByPriority(features: CutFeature[], goals: any): CutFeature[] {
    return [...features].sort((a, b) => {
      // Priority sorting
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Feature type sorting (external first for thermal management)
      const typeOrder = { 'external': 5, 'internal': 4, 'slot': 3, 'notch': 2, 'hole': 1 };
      const typeDiff = typeOrder[b.type] - typeOrder[a.type];
      if (typeDiff !== 0) return typeDiff;

      // Thermal sensitivity (less sensitive first)
      if (a.thermalSensitive !== b.thermalSensitive) {
        return a.thermalSensitive ? 1 : -1;
      }

      return 0;
    });
  }

  private calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  }

  private calculateThermalLoad(feature: CutFeature, inputs: CutPathOptimizerInputs, currentLoad: number): number {
    const featureWeight = this.featureTypeWeights[feature.type];
    const materialFactor = this.getMaterialThermalFactor(inputs.materialProperties.materialType);
    
    // Base thermal contribution
    const baseThermal = (feature.length / 1000) * featureWeight.thermal * (1 / materialFactor.conductivity) * 100;
    
    // Accumulate with current load (with decay)
    const newLoad = currentLoad * 0.9 + baseThermal;
    
    return Math.min(10, Math.max(0, newLoad));
  }

  private getMaterialThermalFactor(materialType: string): any {
    const normalizedType = materialType.toLowerCase().replace(/\s+/g, '_');
    return this.materialThermalFactors[normalizedType] || this.materialThermalFactors['mild_steel'];
  }

  private assessQualityRisk(feature: CutFeature, thermalLoad: number, inputs: CutPathOptimizerInputs): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Thermal load contribution
    if (thermalLoad > 7) riskScore += 3;
    else if (thermalLoad > 5) riskScore += 2;
    else if (thermalLoad > 3) riskScore += 1;

    // Feature complexity contribution
    if (feature.complexity === 'complex') riskScore += 2;
    else if (feature.complexity === 'moderate') riskScore += 1;

    // Precision requirement contribution
    if (feature.requiresPrecision) riskScore += 1;

    // Thermal sensitivity contribution
    if (feature.thermalSensitive) riskScore += 2;

    if (riskScore >= 5) return 'high';
    if (riskScore >= 3) return 'medium';
    return 'low';
  }

  private needsCoolingBreak(currentTime: number, nextCuttingTime: number, maxContinuous: number): boolean {
    return (currentTime % maxContinuous) + nextCuttingTime > maxContinuous;
  }

  private calculatePathSummary(optimizedPath: any[], inputs: CutPathOptimizerInputs): any {
    const totalCuttingTime = optimizedPath.reduce((sum, step) => sum + step.cuttingTime, 0);
    const totalTravelTime = optimizedPath.reduce((sum, step) => sum + step.travelTime, 0);
    const totalPierceTime = optimizedPath.reduce((sum, step) => sum + step.pierceTime, 0);
    const totalProcessTime = totalCuttingTime + totalTravelTime + totalPierceTime;

    // Calculate total travel distance
    let totalTravelDistance = 0;
    let currentPos = inputs.constraints.startPosition;
    
    for (const step of optimizedPath) {
      const feature = inputs.cutFeatures.find(f => f.id === step.featureId);
      if (feature) {
        totalTravelDistance += this.calculateDistance(currentPos, feature.startPoint);
        currentPos = feature.endPoint;
      }
    }

    const numberOfPierces = optimizedPath.length;
    const coolingBreaks = optimizedPath.filter((_, index) => 
      index > 0 && optimizedPath[index].startTime > optimizedPath[index - 1].startTime + optimizedPath[index - 1].totalTime + 0.1
    ).length;

    return {
      totalCuttingTime: Math.round(totalCuttingTime * 100) / 100,
      totalTravelTime: Math.round(totalTravelTime * 100) / 100,
      totalPierceTime: Math.round(totalPierceTime * 100) / 100,
      totalProcessTime: Math.round(totalProcessTime * 100) / 100,
      totalTravelDistance: Math.round(totalTravelDistance),
      numberOfPierces,
      coolingBreaks
    };
  }

  private analyzeThermalEffects(optimizedPath: any[], inputs: CutPathOptimizerInputs): any {
    const peakThermalLoad = Math.max(...optimizedPath.map(step => step.thermalLoad));
    
    let thermalDistortionRisk: 'low' | 'medium' | 'high' = 'low';
    if (peakThermalLoad > 7) thermalDistortionRisk = 'high';
    else if (peakThermalLoad > 5) thermalDistortionRisk = 'medium';

    // Identify hot spots (simplified)
    const hotSpots = optimizedPath
      .filter(step => step.thermalLoad > 6)
      .map(step => {
        const feature = inputs.cutFeatures.find(f => f.id === step.featureId);
        return {
          x: feature ? feature.startPoint.x : 0,
          y: feature ? feature.startPoint.y : 0,
          risk: step.thermalLoad
        };
      });

    const coolingStrategy = [
      'Implement cooling breaks between high-thermal operations',
      'Use optimized gas flow for heat dissipation',
      'Consider water cooling for thick materials'
    ];

    const thermalManagement = [
      'Monitor material temperature during cutting',
      'Adjust cutting speed based on thermal load',
      'Use thermal barriers for sensitive areas'
    ];

    return {
      peakThermalLoad: Math.round(peakThermalLoad * 10) / 10,
      thermalDistortionRisk,
      hotSpots,
      coolingStrategy,
      thermalManagement
    };
  }

  private predictQuality(optimizedPath: any[], inputs: CutPathOptimizerInputs): any {
    // Overall quality score based on thermal and sequence optimization
    const avgThermalLoad = optimizedPath.reduce((sum, step) => sum + step.thermalLoad, 0) / optimizedPath.length;
    const highRiskSteps = optimizedPath.filter(step => step.qualityRisk === 'high').length;
    
    let overallQualityScore = 8; // Base score
    overallQualityScore -= avgThermalLoad * 0.3; // Thermal penalty
    overallQualityScore -= highRiskSteps * 0.5; // Risk penalty
    overallQualityScore = Math.max(1, Math.min(10, overallQualityScore));

    // Dimensional accuracy prediction
    const thermalExpansion = inputs.materialProperties.thermalExpansion * avgThermalLoad * 100;
    const dimensionalAccuracy = inputs.qualityRequirements.dimensionalTolerance + thermalExpansion;

    // Surface finish quality
    const surfaceFinishQuality = Math.max(1, 5 - avgThermalLoad * 0.3);

    // Edge consistency
    const edgeConsistency = Math.max(1, 5 - highRiskSteps * 0.2);

    // Risk areas
    const riskAreas = optimizedPath
      .filter(step => step.qualityRisk !== 'low')
      .map(step => ({
        featureId: step.featureId,
        risk: step.qualityRisk,
        mitigation: step.qualityRisk === 'high' ? 'Reduce speed and add cooling' : 'Monitor closely'
      }));

    return {
      overallQualityScore: Math.round(overallQualityScore * 10) / 10,
      dimensionalAccuracy: Math.round(dimensionalAccuracy * 1000) / 1000,
      surfaceFinishQuality: Math.round(surfaceFinishQuality * 10) / 10,
      edgeConsistency: Math.round(edgeConsistency * 10) / 10,
      riskAreas
    };
  }

  private calculateEfficiencyMetrics(pathSummary: any, inputs: CutPathOptimizerInputs): any {
    // Cutting efficiency (cutting time vs total time)
    const cuttingEfficiency = (pathSummary.totalCuttingTime / pathSummary.totalProcessTime) * 100;

    // Path efficiency (optimal travel vs actual travel)
    const totalCutLength = inputs.cutFeatures.reduce((sum, feature) => sum + feature.length, 0);
    const optimalTravelDistance = Math.sqrt(inputs.sheetDimensions.length ** 2 + inputs.sheetDimensions.width ** 2);
    const pathEfficiency = Math.min(100, (optimalTravelDistance / pathSummary.totalTravelDistance) * 100);

    // Material utilization (simplified)
    const sheetArea = inputs.sheetDimensions.length * inputs.sheetDimensions.width;
    const cutArea = totalCutLength * inputs.cuttingParameters.kerfWidth;
    const materialUtilization = Math.min(100, (cutArea / sheetArea) * 100 * 10); // Scaled for visibility

    // Energy efficiency (based on cutting vs travel time)
    const energyEfficiency = cuttingEfficiency; // Simplified

    // Productivity index
    const totalParts = new Set(inputs.cutFeatures.map(f => f.partId)).size;
    const productivityIndex = (totalParts / pathSummary.totalProcessTime) * 60; // Parts per hour

    return {
      cuttingEfficiency: Math.round(cuttingEfficiency * 10) / 10,
      pathEfficiency: Math.round(pathEfficiency * 10) / 10,
      materialUtilization: Math.round(materialUtilization * 10) / 10,
      energyEfficiency: Math.round(energyEfficiency * 10) / 10,
      productivityIndex: Math.round(productivityIndex * 10) / 10
    };
  }

  private generateAlternativeStrategies(inputs: CutPathOptimizerInputs): any[] {
    return [
      {
        strategyName: 'Speed Optimized',
        totalTime: 45,
        qualityScore: 7,
        thermalRisk: 'high',
        description: 'Minimize total cutting time',
        tradeoffs: ['Higher thermal load', 'Potential quality issues']
      },
      {
        strategyName: 'Quality Optimized',
        totalTime: 65,
        qualityScore: 9,
        thermalRisk: 'low',
        description: 'Maximize cut quality',
        tradeoffs: ['Longer processing time', 'Higher cost']
      },
      {
        strategyName: 'Thermal Managed',
        totalTime: 55,
        qualityScore: 8,
        thermalRisk: 'low',
        description: 'Minimize thermal distortion',
        tradeoffs: ['Moderate time increase', 'Complex sequencing']
      },
      {
        strategyName: 'Balanced',
        totalTime: 50,
        qualityScore: 8,
        thermalRisk: 'medium',
        description: 'Balance all factors',
        tradeoffs: ['Compromise on all metrics']
      }
    ];
  }

  private createOptimizationRecommendations(inputs: CutPathOptimizerInputs, pathSummary: any, thermalAnalysis: any): any {
    const pathImprovements = [
      'Optimize travel paths using shortest distance algorithms',
      'Group nearby features to minimize travel time',
      'Consider common line cutting for adjacent parts'
    ];

    const parameterAdjustments = [
      'Adjust cutting speed based on thermal load',
      'Optimize pierce parameters for different feature types',
      'Fine-tune lead-in/lead-out lengths'
    ];

    const sequenceOptimizations = [
      'Prioritize external cuts before internal features',
      'Sequence cuts to minimize thermal buildup',
      'Plan cooling breaks strategically'
    ];

    const qualityEnhancements = [
      'Implement adaptive parameter control',
      'Add quality checkpoints for critical features',
      'Use thermal monitoring for real-time adjustments'
    ];

    return {
      pathImprovements,
      parameterAdjustments,
      sequenceOptimizations,
      qualityEnhancements
    };
  }

  private assessRiskMitigation(inputs: CutPathOptimizerInputs, thermalAnalysis: any, qualityPrediction: any): any {
    const thermalRisks = [
      {
        risk: 'Thermal distortion in thin materials',
        mitigation: 'Use lower power and higher speed settings',
        priority: thermalAnalysis.thermalDistortionRisk === 'high' ? 'high' : 'medium'
      },
      {
        risk: 'Heat accumulation in dense cutting areas',
        mitigation: 'Implement strategic cooling breaks',
        priority: 'medium'
      }
    ];

    const qualityRisks = [
      {
        risk: 'Dimensional accuracy degradation',
        mitigation: 'Monitor and compensate for thermal expansion',
        priority: qualityPrediction.overallQualityScore < 7 ? 'high' : 'low'
      },
      {
        risk: 'Edge quality variation',
        mitigation: 'Maintain consistent cutting parameters',
        priority: 'medium'
      }
    ];

    const productionRisks = [
      {
        risk: 'Extended processing time',
        mitigation: 'Optimize cutting sequence and parameters',
        priority: 'medium'
      },
      {
        risk: 'Equipment wear from excessive travel',
        mitigation: 'Minimize rapid movements and optimize paths',
        priority: 'low'
      }
    ];

    return {
      thermalRisks,
      qualityRisks,
      productionRisks
    };
  }

  private generateRecommendations(inputs: CutPathOptimizerInputs, pathSummary: any, efficiency: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Optimized cutting sequence reduces total time to ${pathSummary.totalProcessTime.toFixed(1)} minutes`);
    recommendations.push(`Cutting efficiency: ${efficiency.cuttingEfficiency.toFixed(1)}%`);

    if (efficiency.pathEfficiency < 70) {
      recommendations.push('Path efficiency is low - consider optimizing travel routes');
    }

    if (pathSummary.coolingBreaks > 3) {
      recommendations.push('Multiple cooling breaks required - consider thermal management strategies');
    }

    if (efficiency.productivityIndex < 5) {
      recommendations.push('Low productivity index - review cutting parameters and sequence');
    }

    recommendations.push('Regular path optimization recommended for complex parts');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: CutPathOptimizerInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      cuttingSpeed: variations.map(variation => {
        const modifiedInputs = {
          ...inputs,
          cuttingParameters: {
            ...inputs.cuttingParameters,
            cuttingSpeed: inputs.cuttingParameters.cuttingSpeed * (1 + variation / 100)
          }
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalTime: result.pathSummary.totalProcessTime,
          efficiency: result.efficiencyMetrics.cuttingEfficiency,
          thermalRisk: result.thermalAnalysis.thermalDistortionRisk
        };
      }),
      thermalSensitivity: variations.map(variation => {
        // Modify thermal sensitivity of features
        const modifiedFeatures = inputs.cutFeatures.map(feature => ({
          ...feature,
          thermalSensitive: variation > 0 ? true : feature.thermalSensitive
        }));
        const modifiedInputs = { ...inputs, cutFeatures: modifiedFeatures };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}% sensitive features`,
          qualityScore: result.qualityPrediction.overallQualityScore,
          thermalLoad: result.thermalAnalysis.peakThermalLoad,
          totalTime: result.pathSummary.totalProcessTime
        };
      })
    };
  }
}

export const cutPathOptimizer = new CutPathOptimizer();
