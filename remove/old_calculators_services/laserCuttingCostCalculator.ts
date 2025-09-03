import { CalculatorInputs, CalculatorResults } from '../types/calculator';
import { enhancedCalculationEngine, PrecisionCalculationInputs } from '../enhancedCalculationEngine';

export interface LaserCuttingCostInputs extends CalculatorInputs {
  materialType: string;
  thickness: number;
  dimensions: {
    length: number;
    width: number;
  };
  quantity: number;
  materialCost: number; // Cost per unit area
  laserPower: number;
  cuttingSpeed: number;
  gasType: string;
  gasConsumption: number; // m³/hour
  gasCost: number; // Cost per m³
  electricityRate: number; // Cost per kWh
  laborRate: number; // Cost per hour
  machineHourlyRate: number; // Machine operating cost per hour
  setupTime: number; // Minutes
  wasteFactor: number; // Percentage as decimal (0.1 = 10%)
}

export interface LaserCuttingCostResults extends CalculatorResults {
  totalCost: number;
  costPerPiece: number;
  materialCost: number;
  energyCost: number;
  gasCost: number;
  laborCost: number;
  machineCost: number;
  setupCost: number;
  costBreakdown: {
    material: number;
    energy: number;
    gas: number;
    labor: number;
    machine: number;
    setup: number;
  };
  profitabilityAnalysis: {
    costPerSquareMeter: number;
    materialUtilization: number;
    timeEfficiency: number;
  };
}

export class LaserCuttingCostCalculator {
  // Memoization cache for expensive calculations
  private static calculationCache = new Map<string, any>();
  private static readonly CACHE_SIZE_LIMIT = 100;

  calculate(inputs: LaserCuttingCostInputs): LaserCuttingCostResults {
    // Generate cache key for memoization
    const cacheKey = this.generateCacheKey(inputs);

    // Check cache first
    if (LaserCuttingCostCalculator.calculationCache.has(cacheKey)) {
      return LaserCuttingCostCalculator.calculationCache.get(cacheKey);
    }

    // Input validation
    this.validateInputs(inputs);

    // Check if enhanced calculation is available and beneficial
    if (this.shouldUseEnhancedCalculation(inputs)) {
      return this.calculateWithEnhancedEngine(inputs);
    }

    // Pre-calculate constants to avoid repeated calculations
    const constants = this.preCalculateConstants(inputs);

    // Calculate basic metrics using optimized approach
    const partArea = constants.lengthWidthProduct / 1000000; // Convert mm² to m²
    const totalPartArea = partArea * inputs.quantity;
    const totalMaterialArea = totalPartArea * constants.wasteMultiplier;

    // Calculate cutting perimeter and time with optimized math
    const perimeter = constants.perimeterFactor; // Pre-calculated 2 * (length + width)
    const totalPerimeter = perimeter * inputs.quantity;
    const cuttingTimeHours = totalPerimeter / constants.cuttingSpeedPerHour; // Pre-converted to hours
    const totalTimeHours = cuttingTimeHours + constants.setupTimeHours;

    // Optimized cost calculations using batch operations
    const costs = this.calculateCostsOptimized(inputs, constants, totalMaterialArea, totalTimeHours, cuttingTimeHours);

    const totalCost = costs.material + costs.energy + costs.gas + costs.labor + costs.machine + costs.setup;
    const costPerPiece = totalCost / inputs.quantity;

    // Cost breakdown percentages using optimized costs
    const costBreakdown = {
      material: (costs.material / totalCost) * 100,
      energy: (costs.energy / totalCost) * 100,
      gas: (costs.gas / totalCost) * 100,
      labor: (costs.labor / totalCost) * 100,
      machine: (costs.machine / totalCost) * 100,
      setup: (costs.setup / totalCost) * 100,
    };

    // Profitability analysis
    const costPerSquareMeter = totalCost / totalPartArea;
    const materialUtilization = (totalPartArea / totalMaterialArea) * 100;
    const timeEfficiency = (cuttingTimeHours / totalTimeHours) * 100;

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, {
      materialUtilization,
      timeEfficiency,
      costBreakdown,
      costPerPiece
    });

    const result = {
      totalCost: Math.round(totalCost * 100) / 100,
      costPerPiece: Math.round(costPerPiece * 100) / 100,
      materialCost: Math.round(costs.material * 100) / 100,
      energyCost: Math.round(costs.energy * 100) / 100,
      gasCost: Math.round(costs.gas * 100) / 100,
      laborCost: Math.round(costs.labor * 100) / 100,
      machineCost: Math.round(costs.machine * 100) / 100,
      setupCost: Math.round(costs.setup * 100) / 100,
      costBreakdown,
      profitabilityAnalysis: {
        costPerSquareMeter: Math.round(costPerSquareMeter * 100) / 100,
        materialUtilization: Math.round(materialUtilization * 100) / 100,
        timeEfficiency: Math.round(timeEfficiency * 100) / 100,
      },
      recommendations,
      keyMetrics: {
        'Total Cost': `$${totalCost.toFixed(2)}`,
        'Cost per Piece': `$${costPerPiece.toFixed(2)}`,
        'Material Utilization': `${materialUtilization.toFixed(1)}%`,
        'Time Efficiency': `${timeEfficiency.toFixed(1)}%`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };

    // Cache the result for future use
    this.cacheResult(cacheKey, result);

    return result;
  }

  /**
   * 判断是否应该使用增强计算引擎
   */
  private shouldUseEnhancedCalculation(inputs: LaserCuttingCostInputs): boolean {
    // 当需要高精度计算时使用增强引擎
    return inputs.thickness > 0 &&
           inputs.material &&
           inputs.laserType &&
           (inputs.thickness > 10 || inputs.quality === 'precision' || inputs.quality === 'ultra-precision');
  }

  /**
   * 使用增强计算引擎进行计算
   */
  private calculateWithEnhancedEngine(inputs: LaserCuttingCostInputs): LaserCuttingCostResults {
    try {
      // 转换输入参数格式
      const enhancedInputs: PrecisionCalculationInputs = {
        materialId: this.mapMaterialToId(inputs.material),
        thickness: inputs.thickness,
        laserType: inputs.laserType as 'fiber' | 'co2' | 'green',
        maxPower: inputs.laserPower || 6000,
        beamQuality: 1.1, // 默认光束质量
        focusLength: 150, // 默认焦距
        beamDiameter: 0.1, // 默认光束直径
        qualityLevel: this.mapQualityLevel(inputs.quality),
        edgeQualityTarget: inputs.quality === 'precision' ? 8 : inputs.quality === 'ultra-precision' ? 9 : 6,
        toleranceRequirement: 0.1,
        cuttingLength: (inputs.length + inputs.width) * 2 * inputs.quantity, // 周长
        pierceCount: inputs.quantity,
        cornerCount: inputs.quantity * 4, // 假设矩形
        complexityFactor: 1.0,
        ambientTemperature: 20,
        humidity: 50,
        altitude: 0,
        electricityRate: inputs.electricityRate || 0.12,
        gasPrice: inputs.gasPrice || 0.5,
        laborRate: inputs.laborRate || 25,
        machineRate: inputs.machineRate || 50
      };

      // 执行增强计算
      const enhancedResults = enhancedCalculationEngine.calculate(enhancedInputs);

      // 转换结果格式
      const result: LaserCuttingCostResults = {
        totalCost: enhancedResults.costAnalysis.totalCost,
        costPerPiece: enhancedResults.costAnalysis.totalCost / inputs.quantity,
        materialCost: enhancedResults.costAnalysis.materialCost,
        energyCost: enhancedResults.costAnalysis.energyCost,
        gasCost: enhancedResults.costAnalysis.gasCost,
        laborCost: enhancedResults.costAnalysis.laborCost,
        machineCost: enhancedResults.costAnalysis.machineCost,
        setupCost: enhancedResults.costAnalysis.machineCost * 0.1, // 估算
        cuttingTime: enhancedResults.timeAnalysis.cuttingTime,
        totalTime: enhancedResults.timeAnalysis.totalTime,
        materialUtilization: enhancedResults.efficiencyAnalysis.materialUtilization,
        energyConsumption: (enhancedResults.optimalParameters.power / 1000) * (enhancedResults.timeAnalysis.totalTime / 60),
        gasConsumption: enhancedResults.optimalParameters.gasFlow * (enhancedResults.timeAnalysis.cuttingTime / 60),
        recommendations: enhancedResults.recommendations,
        warnings: enhancedResults.warnings,
        optimizedParameters: {
          power: enhancedResults.optimalParameters.power,
          speed: enhancedResults.optimalParameters.speed,
          focusOffset: enhancedResults.optimalParameters.focusOffset,
          gasFlow: enhancedResults.optimalParameters.gasFlow,
          gasPressure: enhancedResults.optimalParameters.gasPressure
        },
        qualityPrediction: {
          edgeQuality: enhancedResults.qualityPrediction.edgeQuality,
          surfaceRoughness: enhancedResults.qualityPrediction.surfaceRoughness,
          toleranceAchievable: enhancedResults.qualityPrediction.toleranceAchievable,
          heatAffectedZone: enhancedResults.qualityPrediction.heatAffectedZone
        },
        sensitivityAnalysis: enhancedResults.sensitivityAnalysis
      };

      // 缓存结果
      const cacheKey = this.generateCacheKey(inputs);
      LaserCuttingCostCalculator.calculationCache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.warn('Enhanced calculation failed, falling back to standard calculation:', error);
      // 回退到标准计算
      return this.calculateStandard(inputs);
    }
  }

  /**
   * 映射材料名称到材料ID
   */
  private mapMaterialToId(material: string): string {
    const materialMap: Record<string, string> = {
      'mild steel': 'mild-steel-a36',
      'stainless steel': 'stainless-steel-304',
      'aluminum': 'aluminum-6061',
      'carbon steel': 'mild-steel-a36',
      'steel': 'mild-steel-a36'
    };

    const normalizedMaterial = material.toLowerCase();
    return materialMap[normalizedMaterial] || 'mild-steel-a36';
  }

  /**
   * 映射质量等级
   */
  private mapQualityLevel(quality: string): 'draft' | 'standard' | 'precision' | 'ultraPrecision' {
    switch (quality?.toLowerCase()) {
      case 'draft':
      case 'rough':
        return 'draft';
      case 'precision':
      case 'high':
        return 'precision';
      case 'ultra-precision':
      case 'ultra':
        return 'ultraPrecision';
      default:
        return 'standard';
    }
  }

  /**
   * 标准计算方法（原有逻辑）
   */
  private calculateStandard(inputs: LaserCuttingCostInputs): LaserCuttingCostResults {
    // 原有的计算逻辑保持不变
    const constants = this.preCalculateConstants(inputs);
    const partArea = constants.lengthWidthProduct / 1000000;
    const totalPartArea = partArea * inputs.quantity;
    const totalMaterialArea = totalPartArea * constants.wasteMultiplier;
    const perimeter = constants.perimeterFactor;
    const totalPerimeter = perimeter * inputs.quantity;
    const cuttingTimeHours = totalPerimeter / constants.cuttingSpeedPerHour;
    const totalTimeHours = cuttingTimeHours + constants.setupTimeHours;
    const costs = this.calculateCostsOptimized(inputs, constants, totalMaterialArea, totalTimeHours, cuttingTimeHours);
    const totalCost = costs.material + costs.energy + costs.gas + costs.labor + costs.machine + costs.setup;
    const costPerPiece = totalCost / inputs.quantity;

    const result: LaserCuttingCostResults = {
      totalCost,
      costPerPiece,
      materialCost: costs.material,
      energyCost: costs.energy,
      gasCost: costs.gas,
      laborCost: costs.labor,
      machineCost: costs.machine,
      setupCost: costs.setup,
      cuttingTime: cuttingTimeHours * 60,
      totalTime: totalTimeHours * 60,
      materialUtilization: (1 - constants.wasteMultiplier + 1) * 100,
      energyConsumption: (inputs.laserPower || 3000) * cuttingTimeHours / 1000,
      gasConsumption: constants.gasFlowRate * cuttingTimeHours,
      recommendations: this.generateRecommendations(inputs, costs),
      warnings: this.generateWarnings(inputs, costs)
    };

    const cacheKey = this.generateCacheKey(inputs);
    LaserCuttingCostCalculator.calculationCache.set(cacheKey, result);

    return result;
  }

  private validateInputs(inputs: LaserCuttingCostInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.dimensions.length <= 0 || inputs.dimensions.width <= 0) {
      throw new Error('Dimensions must be greater than 0');
    }
    if (inputs.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (inputs.materialCost < 0) {
      throw new Error('Material cost cannot be negative');
    }
    if (inputs.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
    if (inputs.cuttingSpeed <= 0) {
      throw new Error('Cutting speed must be greater than 0');
    }
    if (inputs.wasteFactor < 0 || inputs.wasteFactor > 1) {
      throw new Error('Waste factor must be between 0 and 1');
    }
  }

  private generateRecommendations(
    inputs: LaserCuttingCostInputs,
    analysis: {
      materialUtilization: number;
      timeEfficiency: number;
      costBreakdown: any;
      costPerPiece: number;
    }
  ): string[] {
    const recommendations: string[] = [];

    // Material utilization recommendations
    if (analysis.materialUtilization < 80) {
      recommendations.push('Consider nesting optimization to improve material utilization above 80%');
    }
    if (inputs.wasteFactor > 0.15) {
      recommendations.push('Waste factor is high - review cutting patterns and material handling');
    }

    // Cost optimization recommendations
    if (analysis.costBreakdown.material > 60) {
      recommendations.push('Material costs dominate - consider alternative materials or bulk purchasing');
    }
    if (analysis.costBreakdown.setup > 20) {
      recommendations.push('Setup costs are high - consider batch processing to amortize setup time');
    }

    // Speed and efficiency recommendations
    if (analysis.timeEfficiency < 70) {
      recommendations.push('Low time efficiency - review cutting parameters and reduce non-cutting time');
    }
    if (inputs.cuttingSpeed < this.getOptimalSpeed(inputs.materialType, inputs.thickness)) {
      recommendations.push('Cutting speed may be suboptimal - consider speed optimization');
    }

    // Energy efficiency recommendations
    if (analysis.costBreakdown.energy > 15) {
      recommendations.push('Energy costs are significant - consider power optimization or off-peak scheduling');
    }

    return recommendations;
  }

  private getOptimalSpeed(materialType: string, thickness: number): number {
    // Simplified optimal speed lookup
    const speedTable: { [key: string]: { [key: number]: number } } = {
      'steel': { 1: 8000, 2: 6000, 3: 4000, 5: 2500, 10: 1200 },
      'aluminum': { 1: 12000, 2: 9000, 3: 6000, 5: 4000, 10: 2000 },
      'stainless': { 1: 6000, 2: 4500, 3: 3000, 5: 2000, 10: 1000 }
    };

    const material = materialType.toLowerCase();
    if (!speedTable[material]) return 5000; // Default speed

    // Find closest thickness
    const thicknesses = Object.keys(speedTable[material]).map(Number).sort((a, b) => a - b);
    const closestThickness = thicknesses.reduce((prev, curr) => 
      Math.abs(curr - thickness) < Math.abs(prev - thickness) ? curr : prev
    );

    return speedTable[material][closestThickness];
  }

  private performSensitivityAnalysis(inputs: LaserCuttingCostInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-10, -5, 5, 10]; // Percentage variations

    return {
      materialCost: variations.map(variation => {
        const modifiedInputs = { ...inputs, materialCost: inputs.materialCost * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalCost: result.totalCost,
          change: ((result.totalCost - baseResult.totalCost) / baseResult.totalCost * 100).toFixed(1) + '%'
        };
      }),
      cuttingSpeed: variations.map(variation => {
        const modifiedInputs = { ...inputs, cuttingSpeed: inputs.cuttingSpeed * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalCost: result.totalCost,
          change: ((result.totalCost - baseResult.totalCost) / baseResult.totalCost * 100).toFixed(1) + '%'
        };
      })
    };
  }

  /**
   * Generate cache key for memoization
   */
  private generateCacheKey(inputs: LaserCuttingCostInputs): string {
    // Create a stable key from inputs, excluding non-essential properties
    const keyData = {
      dimensions: inputs.dimensions,
      quantity: inputs.quantity,
      materialCost: inputs.materialCost,
      wasteFactor: inputs.wasteFactor,
      laserPower: inputs.laserPower,
      cuttingSpeed: inputs.cuttingSpeed,
      setupTime: inputs.setupTime,
      electricityRate: inputs.electricityRate,
      gasConsumption: inputs.gasConsumption,
      gasCost: inputs.gasCost,
      laborRate: inputs.laborRate,
      machineHourlyRate: inputs.machineHourlyRate,
    };

    return JSON.stringify(keyData);
  }

  /**
   * Pre-calculate constants to avoid repeated calculations
   */
  private preCalculateConstants(inputs: LaserCuttingCostInputs) {
    return {
      lengthWidthProduct: inputs.dimensions.length * inputs.dimensions.width,
      wasteMultiplier: 1 + inputs.wasteFactor,
      perimeterFactor: 2 * (inputs.dimensions.length + inputs.dimensions.width),
      cuttingSpeedPerHour: inputs.cuttingSpeed * 60, // Convert mm/min to mm/hour
      setupTimeHours: inputs.setupTime / 60,
      laserPowerKW: inputs.laserPower / 1000,
      laborMachineRate: inputs.laborRate + inputs.machineHourlyRate,
    };
  }

  /**
   * Optimized cost calculations using batch operations
   */
  private calculateCostsOptimized(
    inputs: LaserCuttingCostInputs,
    constants: any,
    totalMaterialArea: number,
    totalTimeHours: number,
    cuttingTimeHours: number
  ) {
    // Calculate all costs in a single pass to minimize object access
    const energyConsumption = constants.laserPowerKW * totalTimeHours;
    const gasConsumption = inputs.gasConsumption * cuttingTimeHours;

    return {
      material: totalMaterialArea * inputs.materialCost,
      energy: energyConsumption * inputs.electricityRate,
      gas: gasConsumption * inputs.gasCost,
      labor: totalTimeHours * inputs.laborRate,
      machine: totalTimeHours * inputs.machineHourlyRate,
      setup: constants.setupTimeHours * constants.laborMachineRate,
      energyConsumption,
      gasConsumption,
    };
  }

  /**
   * Cache result with size limit management
   */
  private cacheResult(key: string, result: any): void {
    // Implement LRU cache behavior
    if (LaserCuttingCostCalculator.calculationCache.size >= LaserCuttingCostCalculator.CACHE_SIZE_LIMIT) {
      // Remove oldest entry (first key in Map)
      const firstKey = LaserCuttingCostCalculator.calculationCache.keys().next().value;
      LaserCuttingCostCalculator.calculationCache.delete(firstKey);
    }

    LaserCuttingCostCalculator.calculationCache.set(key, result);
  }
}

export const laserCuttingCostCalculator = new LaserCuttingCostCalculator();
