import { CalculatorInputs, CalculatorResults } from '../types/calculator';

export interface CuttingTimeInputs extends CalculatorInputs {
  materialType: string;
  thickness: number;
  laserPower: number;
  cuttingLength: number; // Total cutting length in mm
  piercingPoints: number; // Number of piercing points
  quantity: number;
  setupTime: number; // Minutes
  changeover: boolean; // Whether changeover is required
  changeoverTime: number; // Minutes
  complexity: 'simple' | 'medium' | 'complex'; // Part complexity
}

export interface CuttingTimeResults extends CalculatorResults {
  totalTime: number; // Total time in minutes
  cuttingTime: number; // Pure cutting time
  piercingTime: number; // Time for piercing
  setupTime: number; // Setup time
  changeoverTime: number; // Changeover time
  timePerPiece: number; // Time per individual piece
  productionRate: number; // Pieces per hour
  timeBreakdown: {
    cutting: number; // Percentage
    piercing: number;
    setup: number;
    changeover: number;
  };
  efficiency: {
    cuttingEfficiency: number; // Cutting time / total time
    setupEfficiency: number; // Setup time impact
    throughput: number; // Pieces per hour
  };
}

export class CuttingTimeEstimator {
  // Memoization cache for expensive calculations
  private static calculationCache = new Map<string, any>();
  private static readonly CACHE_SIZE_LIMIT = 100;

  calculate(inputs: CuttingTimeInputs): CuttingTimeResults {
    // Generate cache key for memoization
    const cacheKey = this.generateCacheKey(inputs);

    // Check cache first
    if (CuttingTimeEstimator.calculationCache.has(cacheKey)) {
      return CuttingTimeEstimator.calculationCache.get(cacheKey);
    }

    // Input validation
    this.validateInputs(inputs);

    // Pre-calculate constants to avoid repeated calculations
    const constants = this.preCalculateConstants(inputs);

    // Get cutting speed based on material and thickness using optimized approach
    const cuttingSpeed = this.getCuttingSpeedOptimized(inputs, constants);

    // Calculate piercing time using batch operations
    const piercingTimePerPoint = this.getPiercingTimeOptimized(inputs, constants);
    const totalPiercingTimeSeconds = constants.piercingPointsQuantity * piercingTimePerPoint;

    // Calculate cutting time using pre-calculated values
    const totalCuttingLength = constants.cuttingLengthQuantity;
    const cuttingTimeSeconds = totalCuttingLength / cuttingSpeed;

    // Apply complexity factor using pre-calculated value
    const adjustedCuttingTime = cuttingTimeSeconds * constants.complexityFactor;

    // Convert to minutes using batch operations
    const timeComponents = this.convertToMinutesOptimized(
      adjustedCuttingTime,
      totalPiercingTimeSeconds,
      inputs.setupTime,
      inputs.changeover ? inputs.changeoverTime : 0
    );

    // Calculate total time using optimized components
    const totalTime = timeComponents.cutting + timeComponents.piercing + timeComponents.setup + timeComponents.changeover;
    const timePerPiece = totalTime / inputs.quantity;
    const productionRate = 60 / timePerPiece; // pieces per hour

    // Time breakdown percentages using batch calculations
    const timeBreakdown = {
      cutting: (timeComponents.cutting / totalTime) * 100,
      piercing: (timeComponents.piercing / totalTime) * 100,
      setup: (timeComponents.setup / totalTime) * 100,
      changeover: (timeComponents.changeover / totalTime) * 100,
    };

    // Efficiency calculations using optimized approach
    const cuttingEfficiency = (timeComponents.cutting / totalTime) * 100;
    const setupEfficiency = ((totalTime - timeComponents.setup - timeComponents.changeover) / totalTime) * 100;
    const throughput = productionRate;

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, {
      cuttingEfficiency,
      setupEfficiency,
      timeBreakdown,
      productionRate
    });

    const result = {
      totalTime: Math.round(totalTime * 100) / 100,
      cuttingTime: Math.round(timeComponents.cutting * 100) / 100,
      piercingTime: Math.round(timeComponents.piercing * 100) / 100,
      setupTime: timeComponents.setup,
      changeoverTime: timeComponents.changeover,
      timePerPiece: Math.round(timePerPiece * 100) / 100,
      productionRate: Math.round(productionRate * 100) / 100,
      timeBreakdown: {
        cutting: Math.round(timeBreakdown.cutting * 100) / 100,
        piercing: Math.round(timeBreakdown.piercing * 100) / 100,
        setup: Math.round(timeBreakdown.setup * 100) / 100,
        changeover: Math.round(timeBreakdown.changeover * 100) / 100,
      },
      efficiency: {
        cuttingEfficiency: Math.round(cuttingEfficiency * 100) / 100,
        setupEfficiency: Math.round(setupEfficiency * 100) / 100,
        throughput: Math.round(throughput * 100) / 100,
      },
      recommendations,
      keyMetrics: {
        'Total Time': `${totalTime.toFixed(1)} min`,
        'Time per Piece': `${timePerPiece.toFixed(2)} min`,
        'Production Rate': `${productionRate.toFixed(1)} pieces/hour`,
        'Cutting Efficiency': `${cuttingEfficiency.toFixed(1)}%`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };

    // Cache the result for future use
    this.cacheResult(cacheKey, result);

    return result;
  }

  private validateInputs(inputs: CuttingTimeInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
    if (inputs.cuttingLength <= 0) {
      throw new Error('Cutting length must be greater than 0');
    }
    if (inputs.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (inputs.piercingPoints < 0) {
      throw new Error('Piercing points cannot be negative');
    }
    if (inputs.setupTime < 0) {
      throw new Error('Setup time cannot be negative');
    }
  }

  private getCuttingSpeed(materialType: string, thickness: number, laserPower: number): number {
    // Cutting speed in mm/min based on material, thickness, and power
    const speedTable: { [key: string]: { [key: number]: number } } = {
      'steel': {
        1: 8000, 2: 6000, 3: 4000, 4: 3000, 5: 2500,
        6: 2000, 8: 1500, 10: 1200, 12: 1000, 15: 800
      },
      'aluminum': {
        1: 12000, 2: 9000, 3: 6000, 4: 4500, 5: 4000,
        6: 3500, 8: 2800, 10: 2000, 12: 1500, 15: 1200
      },
      'stainless': {
        1: 6000, 2: 4500, 3: 3000, 4: 2200, 5: 2000,
        6: 1800, 8: 1400, 10: 1000, 12: 800, 15: 600
      }
    };

    const material = materialType.toLowerCase();
    const baseSpeed = speedTable[material] || speedTable['steel'];
    
    // Find closest thickness
    const thicknesses = Object.keys(baseSpeed).map(Number).sort((a, b) => a - b);
    const closestThickness = thicknesses.reduce((prev, curr) => 
      Math.abs(curr - thickness) < Math.abs(prev - thickness) ? curr : prev
    );

    let speed = baseSpeed[closestThickness];

    // Adjust for laser power (assuming 3000W as baseline)
    const powerFactor = Math.sqrt(laserPower / 3000);
    speed *= powerFactor;

    return Math.max(speed, 100); // Minimum speed of 100 mm/min
  }

  private getPiercingTime(materialType: string, thickness: number, laserPower: number): number {
    // Piercing time in seconds based on material and thickness
    const piercingTable: { [key: string]: { [key: number]: number } } = {
      'steel': { 1: 0.5, 2: 0.8, 3: 1.2, 5: 2.0, 8: 3.5, 10: 5.0, 15: 8.0 },
      'aluminum': { 1: 0.3, 2: 0.5, 3: 0.8, 5: 1.5, 8: 2.5, 10: 3.5, 15: 5.5 },
      'stainless': { 1: 0.8, 2: 1.2, 3: 1.8, 5: 3.0, 8: 5.0, 10: 7.0, 15: 12.0 }
    };

    const material = materialType.toLowerCase();
    const baseTime = piercingTable[material] || piercingTable['steel'];
    
    // Find closest thickness
    const thicknesses = Object.keys(baseTime).map(Number).sort((a, b) => a - b);
    const closestThickness = thicknesses.reduce((prev, curr) => 
      Math.abs(curr - thickness) < Math.abs(prev - thickness) ? curr : prev
    );

    let piercingTime = baseTime[closestThickness];

    // Adjust for laser power
    const powerFactor = 3000 / laserPower;
    piercingTime *= powerFactor;

    return Math.max(piercingTime, 0.1); // Minimum piercing time
  }

  private getComplexityFactor(complexity: string): number {
    const factors = {
      'simple': 1.0,
      'medium': 1.2,
      'complex': 1.5
    };
    return factors[complexity] || 1.0;
  }

  private generateRecommendations(
    inputs: CuttingTimeInputs,
    analysis: {
      cuttingEfficiency: number;
      setupEfficiency: number;
      timeBreakdown: any;
      productionRate: number;
    }
  ): string[] {
    const recommendations: string[] = [];

    // Efficiency recommendations
    if (analysis.cuttingEfficiency < 60) {
      recommendations.push('Low cutting efficiency - consider reducing setup and changeover times');
    }
    if (analysis.timeBreakdown.setup > 25) {
      recommendations.push('Setup time is high - consider batch processing or setup optimization');
    }
    if (analysis.timeBreakdown.piercing > 15) {
      recommendations.push('Piercing time is significant - optimize piercing parameters or reduce piercing points');
    }

    // Speed optimization
    const currentSpeed = this.getCuttingSpeed(inputs.materialType, inputs.thickness, inputs.laserPower);
    if (currentSpeed < 3000) {
      recommendations.push('Consider increasing laser power or optimizing cutting parameters for higher speed');
    }

    // Production rate recommendations
    if (analysis.productionRate < 10) {
      recommendations.push('Low production rate - review part design and cutting strategy');
    }

    // Complexity recommendations
    if (inputs.complexity === 'complex') {
      recommendations.push('Complex parts detected - consider design simplification or advanced cutting strategies');
    }

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: CuttingTimeInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20]; // Percentage variations

    return {
      cuttingLength: variations.map(variation => {
        const modifiedInputs = { ...inputs, cuttingLength: inputs.cuttingLength * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalTime: result.totalTime,
          change: ((result.totalTime - baseResult.totalTime) / baseResult.totalTime * 100).toFixed(1) + '%'
        };
      }),
      laserPower: variations.map(variation => {
        const modifiedInputs = { ...inputs, laserPower: inputs.laserPower * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalTime: result.totalTime,
          change: ((result.totalTime - baseResult.totalTime) / baseResult.totalTime * 100).toFixed(1) + '%'
        };
      })
    };
  }

  /**
   * Generate cache key for memoization
   */
  private generateCacheKey(inputs: CuttingTimeInputs): string {
    // Create a stable key from inputs, excluding non-essential properties
    const keyData = {
      materialType: inputs.materialType,
      thickness: inputs.thickness,
      laserPower: inputs.laserPower,
      cuttingLength: inputs.cuttingLength,
      piercingPoints: inputs.piercingPoints,
      quantity: inputs.quantity,
      setupTime: inputs.setupTime,
      changeover: inputs.changeover,
      changeoverTime: inputs.changeoverTime,
      complexity: inputs.complexity,
    };

    return JSON.stringify(keyData);
  }

  /**
   * Pre-calculate constants to avoid repeated calculations
   */
  private preCalculateConstants(inputs: CuttingTimeInputs) {
    return {
      cuttingLengthQuantity: inputs.cuttingLength * inputs.quantity,
      piercingPointsQuantity: inputs.piercingPoints * inputs.quantity,
      complexityFactor: this.getComplexityFactor(inputs.complexity),
      setupTimeHours: inputs.setupTime / 60,
      changeoverTimeHours: inputs.changeover ? inputs.changeoverTime / 60 : 0,
    };
  }

  /**
   * Optimized cutting speed calculation
   */
  private getCuttingSpeedOptimized(inputs: CuttingTimeInputs, constants: any): number {
    // Use existing method but with pre-calculated values
    return this.getCuttingSpeed(inputs.materialType, inputs.thickness, inputs.laserPower);
  }

  /**
   * Optimized piercing time calculation
   */
  private getPiercingTimeOptimized(inputs: CuttingTimeInputs, constants: any): number {
    // Use existing method but with pre-calculated values
    return this.getPiercingTime(inputs.materialType, inputs.thickness, inputs.laserPower);
  }

  /**
   * Optimized time conversion using batch operations
   */
  private convertToMinutesOptimized(
    cuttingTimeSeconds: number,
    piercingTimeSeconds: number,
    setupTimeMinutes: number,
    changeoverTimeMinutes: number
  ) {
    return {
      cutting: cuttingTimeSeconds / 60,
      piercing: piercingTimeSeconds / 60,
      setup: setupTimeMinutes,
      changeover: changeoverTimeMinutes,
    };
  }

  /**
   * Cache result with size limit management
   */
  private cacheResult(key: string, result: any): void {
    // Implement LRU cache behavior
    if (CuttingTimeEstimator.calculationCache.size >= CuttingTimeEstimator.CACHE_SIZE_LIMIT) {
      // Remove oldest entry (first key in Map)
      const firstKey = CuttingTimeEstimator.calculationCache.keys().next().value;
      CuttingTimeEstimator.calculationCache.delete(firstKey);
    }

    CuttingTimeEstimator.calculationCache.set(key, result);
  }
}

export const cuttingTimeEstimator = new CuttingTimeEstimator();
