import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface LaserParameterInputs extends CalculatorInputs {
  materialType: string;
  thickness: number;
  laserType: 'fiber' | 'co2' | 'nd_yag';
  maxPower: number; // Maximum available laser power
  qualityRequirement: 'draft' | 'standard' | 'high' | 'precision';
  gasType: 'air' | 'oxygen' | 'nitrogen';
  focusLensLength: number; // mm
  nozzleDiameter: number; // mm
  partComplexity: 'simple' | 'medium' | 'complex';
  productionPriority: 'speed' | 'quality' | 'cost';
}

export interface LaserParameterResults extends CalculatorResults {
  optimizedParameters: {
    power: number; // Watts
    speed: number; // mm/min
    frequency: number; // Hz
    pulseWidth: number; // ms (for pulsed lasers)
    gasFlow: number; // l/min
    gasPressure: number; // bar
    focusOffset: number; // mm
  };
  expectedResults: {
    cuttingSpeed: number; // mm/min
    edgeQuality: number; // 1-10 scale
    kerfWidth: number; // mm
    heatAffectedZone: number; // mm
    drossLevel: number; // 1-5 scale
  };
  qualityPrediction: {
    surfaceRoughness: number; // Ra in μm
    dimensionalAccuracy: number; // ±mm
    edgeSquareness: number; // degrees
    burr: 'none' | 'minimal' | 'moderate' | 'significant';
  };
  efficiency: {
    materialUtilization: number; // %
    energyEfficiency: number; // %
    gasEfficiency: number; // %
    timeEfficiency: number; // %
  };
}

export class LaserParameterOptimizer {
  calculate(inputs: LaserParameterInputs): LaserParameterResults {
    // Input validation
    this.validateInputs(inputs);

    // Get base parameters for material and thickness
    const baseParams = this.getBaseParameters(inputs.materialType, inputs.thickness, inputs.laserType);
    
    // Optimize parameters based on requirements
    const optimizedParams = this.optimizeParameters(baseParams, inputs);
    
    // Predict cutting results
    const expectedResults = this.predictCuttingResults(optimizedParams, inputs);
    
    // Predict quality metrics
    const qualityPrediction = this.predictQuality(optimizedParams, inputs);
    
    // Calculate efficiency metrics
    const efficiency = this.calculateEfficiency(optimizedParams, inputs);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, optimizedParams, expectedResults);

    return {
      optimizedParameters: optimizedParams,
      expectedResults: expectedResults,
      qualityPrediction: qualityPrediction,
      efficiency: efficiency,
      recommendations,
      keyMetrics: {
        'Cutting Speed': `${expectedResults.cuttingSpeed.toFixed(0)} mm/min`,
        'Edge Quality': `${expectedResults.edgeQuality.toFixed(1)}/10`,
        'Energy Efficiency': `${efficiency.energyEfficiency.toFixed(1)}%`,
        'Time Efficiency': `${efficiency.timeEfficiency.toFixed(1)}%`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: LaserParameterInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.maxPower <= 0) {
      throw new Error('Maximum power must be greater than 0');
    }
    if (inputs.focusLensLength <= 0) {
      throw new Error('Focus lens length must be greater than 0');
    }
    if (inputs.nozzleDiameter <= 0) {
      throw new Error('Nozzle diameter must be greater than 0');
    }
  }

  private getBaseParameters(materialType: string, thickness: number, laserType: string): any {
    // Base parameter tables for different materials and laser types
    const parameterTables: any = {
      'fiber': {
        'steel': {
          1: { power: 1000, speed: 8000, frequency: 20000, gasFlow: 15, gasPressure: 1.5 },
          2: { power: 1500, speed: 6000, frequency: 15000, gasFlow: 18, gasPressure: 1.8 },
          3: { power: 2000, speed: 4000, frequency: 12000, gasFlow: 20, gasPressure: 2.0 },
          5: { power: 3000, speed: 2500, frequency: 8000, gasFlow: 25, gasPressure: 2.5 },
          10: { power: 4000, speed: 1200, frequency: 5000, gasFlow: 30, gasPressure: 3.0 }
        },
        'aluminum': {
          1: { power: 800, speed: 12000, frequency: 25000, gasFlow: 20, gasPressure: 1.2 },
          2: { power: 1200, speed: 9000, frequency: 20000, gasFlow: 25, gasPressure: 1.5 },
          3: { power: 1600, speed: 6000, frequency: 15000, gasFlow: 30, gasPressure: 1.8 },
          5: { power: 2500, speed: 4000, frequency: 10000, gasFlow: 35, gasPressure: 2.2 },
          10: { power: 3500, speed: 2000, frequency: 6000, gasFlow: 40, gasPressure: 2.8 }
        },
        'stainless': {
          1: { power: 1200, speed: 6000, frequency: 18000, gasFlow: 18, gasPressure: 1.8 },
          2: { power: 1800, speed: 4500, frequency: 14000, gasFlow: 22, gasPressure: 2.2 },
          3: { power: 2400, speed: 3000, frequency: 10000, gasFlow: 25, gasPressure: 2.5 },
          5: { power: 3200, speed: 2000, frequency: 7000, gasFlow: 30, gasPressure: 3.0 },
          10: { power: 4200, speed: 1000, frequency: 4000, gasFlow: 35, gasPressure: 3.5 }
        }
      }
    };

    const material = materialType.toLowerCase();
    const laser = laserType.toLowerCase();
    
    if (!parameterTables[laser] || !parameterTables[laser][material]) {
      // Default to steel parameters if material not found
      const defaultParams = parameterTables[laser]?.['steel'] || parameterTables['fiber']['steel'];
      return this.interpolateParameters(defaultParams, thickness);
    }

    return this.interpolateParameters(parameterTables[laser][material], thickness);
  }

  private interpolateParameters(paramTable: any, thickness: number): any {
    const thicknesses = Object.keys(paramTable).map(Number).sort((a, b) => a - b);
    
    // Find surrounding thicknesses
    let lowerThickness = thicknesses[0];
    let upperThickness = thicknesses[thicknesses.length - 1];
    
    for (let i = 0; i < thicknesses.length - 1; i++) {
      if (thickness >= thicknesses[i] && thickness <= thicknesses[i + 1]) {
        lowerThickness = thicknesses[i];
        upperThickness = thicknesses[i + 1];
        break;
      }
    }

    if (lowerThickness === upperThickness) {
      return { ...paramTable[lowerThickness], pulseWidth: 0.1, focusOffset: 0 };
    }

    // Linear interpolation
    const ratio = (thickness - lowerThickness) / (upperThickness - lowerThickness);
    const lowerParams = paramTable[lowerThickness];
    const upperParams = paramTable[upperThickness];

    return {
      power: lowerParams.power + (upperParams.power - lowerParams.power) * ratio,
      speed: lowerParams.speed + (upperParams.speed - lowerParams.speed) * ratio,
      frequency: lowerParams.frequency + (upperParams.frequency - lowerParams.frequency) * ratio,
      gasFlow: lowerParams.gasFlow + (upperParams.gasFlow - lowerParams.gasFlow) * ratio,
      gasPressure: lowerParams.gasPressure + (upperParams.gasPressure - lowerParams.gasPressure) * ratio,
      pulseWidth: 0.1,
      focusOffset: 0
    };
  }

  private optimizeParameters(baseParams: any, inputs: LaserParameterInputs): any {
    let optimized = { ...baseParams };

    // Adjust power based on available power
    optimized.power = Math.min(optimized.power, inputs.maxPower);

    // Optimize based on production priority
    switch (inputs.productionPriority) {
      case 'speed':
        optimized.power = Math.min(inputs.maxPower, optimized.power * 1.2);
        optimized.speed *= 1.15;
        break;
      case 'quality':
        optimized.power *= 0.9;
        optimized.speed *= 0.85;
        optimized.frequency *= 1.2;
        break;
      case 'cost':
        optimized.power *= 0.8;
        optimized.gasFlow *= 0.9;
        break;
    }

    // Adjust for quality requirements
    const qualityFactors = {
      'draft': { power: 1.1, speed: 1.2, frequency: 0.8 },
      'standard': { power: 1.0, speed: 1.0, frequency: 1.0 },
      'high': { power: 0.95, speed: 0.9, frequency: 1.1 },
      'precision': { power: 0.9, speed: 0.8, frequency: 1.3 }
    };

    const factors = qualityFactors[inputs.qualityRequirement];
    optimized.power *= factors.power;
    optimized.speed *= factors.speed;
    optimized.frequency *= factors.frequency;

    // Adjust for gas type
    if (inputs.gasType === 'nitrogen') {
      optimized.gasFlow *= 1.5;
      optimized.gasPressure *= 1.2;
    } else if (inputs.gasType === 'air') {
      optimized.gasFlow *= 0.7;
      optimized.gasPressure *= 0.8;
    }

    // Adjust for part complexity
    const complexityFactors = {
      'simple': 1.0,
      'medium': 0.9,
      'complex': 0.8
    };
    optimized.speed *= complexityFactors[inputs.partComplexity];

    // Round values to practical precision
    return {
      power: Math.round(optimized.power),
      speed: Math.round(optimized.speed),
      frequency: Math.round(optimized.frequency),
      pulseWidth: Math.round(optimized.pulseWidth * 100) / 100,
      gasFlow: Math.round(optimized.gasFlow * 10) / 10,
      gasPressure: Math.round(optimized.gasPressure * 10) / 10,
      focusOffset: Math.round(optimized.focusOffset * 10) / 10
    };
  }

  private predictCuttingResults(params: any, inputs: LaserParameterInputs): any {
    // Predict cutting performance based on optimized parameters
    const powerDensity = params.power / (Math.PI * Math.pow(inputs.nozzleDiameter / 2, 2));
    
    return {
      cuttingSpeed: params.speed,
      edgeQuality: this.calculateEdgeQuality(params, inputs),
      kerfWidth: this.calculateKerfWidth(params, inputs),
      heatAffectedZone: this.calculateHAZ(params, inputs),
      drossLevel: this.calculateDrossLevel(params, inputs)
    };
  }

  private predictQuality(params: any, inputs: LaserParameterInputs): any {
    const baseRoughness = inputs.thickness * 0.5; // Base roughness in μm
    const qualityFactor = inputs.qualityRequirement === 'precision' ? 0.5 : 
                         inputs.qualityRequirement === 'high' ? 0.7 :
                         inputs.qualityRequirement === 'standard' ? 1.0 : 1.3;

    return {
      surfaceRoughness: Math.round(baseRoughness * qualityFactor * 100) / 100,
      dimensionalAccuracy: Math.round(inputs.thickness * 0.02 * qualityFactor * 100) / 100,
      edgeSquareness: Math.round((2 - qualityFactor) * 100) / 100,
      burr: this.predictBurr(params, inputs)
    };
  }

  private calculateEfficiency(params: any, inputs: LaserParameterInputs): any {
    const powerEfficiency = (params.power / inputs.maxPower) * 100;
    const speedEfficiency = Math.min((params.speed / 10000) * 100, 100);
    
    return {
      materialUtilization: 95 - inputs.thickness * 0.5, // Simplified calculation
      energyEfficiency: Math.round(powerEfficiency * 100) / 100,
      gasEfficiency: Math.round((20 / params.gasFlow) * 100 * 100) / 100,
      timeEfficiency: Math.round(speedEfficiency * 100) / 100
    };
  }

  private calculateEdgeQuality(params: any, inputs: LaserParameterInputs): number {
    // Edge quality on 1-10 scale (10 = best)
    let quality = 8;
    
    if (inputs.qualityRequirement === 'precision') quality += 1.5;
    else if (inputs.qualityRequirement === 'draft') quality -= 2;
    
    if (inputs.gasType === 'nitrogen') quality += 0.5;
    else if (inputs.gasType === 'air') quality -= 1;
    
    return Math.max(1, Math.min(10, Math.round(quality * 10) / 10));
  }

  private calculateKerfWidth(params: any, inputs: LaserParameterInputs): number {
    // Kerf width in mm
    const baseKerf = inputs.nozzleDiameter * 0.8;
    const powerFactor = Math.sqrt(params.power / 2000);
    return Math.round(baseKerf * powerFactor * 100) / 100;
  }

  private calculateHAZ(params: any, inputs: LaserParameterInputs): number {
    // Heat affected zone in mm
    const baseHAZ = inputs.thickness * 0.1;
    const speedFactor = 5000 / params.speed;
    return Math.round(baseHAZ * speedFactor * 100) / 100;
  }

  private calculateDrossLevel(params: any, inputs: LaserParameterInputs): number {
    // Dross level on 1-5 scale (1 = minimal, 5 = significant)
    let dross = 2;
    
    if (inputs.thickness > 10) dross += 1;
    if (inputs.gasType === 'air') dross += 1;
    if (params.speed > 5000) dross += 0.5;
    
    return Math.max(1, Math.min(5, Math.round(dross * 10) / 10));
  }

  private predictBurr(params: any, inputs: LaserParameterInputs): string {
    if (inputs.gasType === 'nitrogen' && inputs.qualityRequirement === 'precision') return 'none';
    if (inputs.thickness < 3 && params.speed < 8000) return 'minimal';
    if (inputs.thickness > 10 || inputs.gasType === 'air') return 'moderate';
    return 'minimal';
  }

  private generateRecommendations(inputs: LaserParameterInputs, params: any, results: any): string[] {
    const recommendations: string[] = [];

    // Power recommendations
    if (params.power > inputs.maxPower * 0.9) {
      recommendations.push('Operating near maximum power - consider upgrading laser for better efficiency');
    }

    // Speed recommendations
    if (params.speed < 2000) {
      recommendations.push('Low cutting speed detected - consider reducing thickness or increasing power');
    }

    // Quality recommendations
    if (results.edgeQuality < 6) {
      recommendations.push('Edge quality may be suboptimal - consider reducing speed or changing gas type');
    }

    // Gas recommendations
    if (inputs.gasType === 'air' && inputs.qualityRequirement === 'high') {
      recommendations.push('Consider nitrogen gas for better edge quality with high-quality requirements');
    }

    // Efficiency recommendations
    if (params.gasFlow > 30) {
      recommendations.push('High gas consumption - optimize gas flow for cost efficiency');
    }

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: LaserParameterInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-10, -5, 5, 10];

    return {
      power: variations.map(variation => {
        const modifiedInputs = { ...inputs, maxPower: inputs.maxPower * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          cuttingSpeed: result.expectedResults.cuttingSpeed,
          edgeQuality: result.expectedResults.edgeQuality
        };
      })
    };
  }
}

export const laserParameterOptimizer = new LaserParameterOptimizer();
