import type { CalculatorConfig, CalculatorResult, CalculationContext, Material } from '../types/calculator';
import PerformanceMonitor from './performanceMonitor';
import PerformanceOptimizationService from '../services/performanceOptimizationService';
import MaterialService from '../services/materialService';
import AlgorithmRegistry from '../algorithms/algorithmRegistry';
import UnitConversionService from '../services/unitConversionService';
import { LASER_CUTTING_CONSTANTS } from '../data/constants';

export class CalculationEngine {
  private static instance: CalculationEngine;
  private calculators: Map<string, CalculatorConfig> = new Map();
  private cache: Map<string, { result: CalculatorResult; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private performanceMonitor: PerformanceMonitor;
  private performanceOptimizationService: PerformanceOptimizationService;

  static getInstance(): CalculationEngine {
    if (!CalculationEngine.instance) {
      CalculationEngine.instance = new CalculationEngine();
    }
    return CalculationEngine.instance;
  }

  private constructor() {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.performanceOptimizationService = PerformanceOptimizationService.getInstance();
    this.materialService = MaterialService.getInstance();
    this.algorithmRegistry = AlgorithmRegistry.getInstance();
    this.unitConversionService = UnitConversionService.getInstance();
  }

  private materialService: MaterialService;
  private algorithmRegistry: AlgorithmRegistry;
  private unitConversionService: UnitConversionService;

  registerCalculator(config: CalculatorConfig): void {
    this.calculators.set(config.id, config);
  }

  getCalculator(id: string): CalculatorConfig | undefined {
    return this.calculators.get(id);
  }

  getAllCalculators(): CalculatorConfig[] {
    return Array.from(this.calculators.values());
  }

  getCalculatorsByCategory(category: string): CalculatorConfig[] {
    return Array.from(this.calculators.values()).filter(calc => calc.category === category);
  }

  async calculate(
    calculatorId: string,
    inputs: Record<string, any>,
    context?: CalculationContext
  ): Promise<CalculatorResult> {
    const calculator = this.getCalculator(calculatorId);
    if (!calculator) {
      throw new Error(`Calculator with id "${calculatorId}" not found`);
    }

    // Use performance optimization service for caching and optimization
    return this.performanceOptimizationService.executeOptimizedCalculation(
      calculatorId,
      inputs,
      () => this.performCalculation(calculatorId, inputs, context)
    );
  }

  private async performCalculation(
    calculatorId: string,
    inputs: Record<string, any>,
    context?: CalculationContext
  ): Promise<CalculatorResult> {
    const startTime = performance.now();
    const calculator = this.getCalculator(calculatorId);

    if (!calculator) {
      throw new Error(`Calculator with id "${calculatorId}" not found`);
    }

    // Validate inputs
    const validationErrors = this.validateInputs(calculator, inputs);
    if (validationErrors.length > 0) {
      throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
    }

    // Perform calculation using algorithm registry or fallback methods
    let result: CalculatorResult;

    if (this.algorithmRegistry.hasAlgorithm(calculatorId)) {
      // Use dedicated algorithm from registry
      result = this.algorithmRegistry.executeAlgorithm(calculatorId, inputs);
    } else {
      // Fallback to legacy calculation methods
      switch (calculatorId) {
        case 'laser-cutting-cost':
          result = this.calculateLaserCuttingCost(inputs, context);
          break;
        case 'cutting-time':
          result = this.calculateCuttingTime(inputs, context);
          break;
        case 'laser-parameters':
          result = this.optimizeLaserParameters(inputs, context);
          break;
        case 'material-selection':
          result = this.recommendMaterial(inputs, context);
          break;
        default:
          throw new Error(`Calculator "${calculatorId}" not implemented`);
      }
    }

    const calculationTime = performance.now() - startTime;
    result.metadata = {
      calculationTime,
      accuracy: calculationTime < 100 ? 'high' : calculationTime < 500 ? 'medium' : 'low',
      lastUpdated: new Date()
    };

    // Record performance metrics
    this.performanceMonitor.recordMetric(calculatorId, calculationTime, Object.keys(inputs).length, false);

    return result;
  }

  private validateInputs(calculator: CalculatorConfig, inputs: Record<string, any>): string[] {
    const errors: string[] = [];

    for (const input of calculator.inputs) {
      const value = inputs[input.id];

      if (input.required && (value === undefined || value === null || value === '')) {
        errors.push(`${input.label} is required`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (input.type === 'number') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors.push(`${input.label} must be a valid number`);
          } else {
            if (input.min !== undefined && numValue < input.min) {
              errors.push(`${input.label} must be at least ${input.min}`);
            }
            if (input.max !== undefined && numValue > input.max) {
              errors.push(`${input.label} must be at most ${input.max}`);
            }
          }
        }
      }
    }

    // Custom validation rules
    if (calculator.validationRules) {
      for (const [field, rule] of Object.entries(calculator.validationRules)) {
        const error = rule(inputs[field], inputs);
        if (error) {
          errors.push(error);
        }
      }
    }

    return errors;
  }

  private calculateLaserCuttingCost(inputs: Record<string, any>, context?: CalculationContext): CalculatorResult {
    const {
      materialType,
      thickness,
      length,
      width,
      quantity,
      cuttingLength,
      laborRate,
      machineRate,
      materialCostPerKg
    } = inputs;

    // Get material using MaterialService
    const material = this.materialService.getMaterial(materialType);
    if (!material) {
      throw new Error(`Material ${materialType} not found`);
    }

    // Material cost calculation using MaterialService
    const materialCostData = this.materialService.calculateMaterialCost(
      material, length, width, thickness, quantity
    );
    const materialCost = materialCostData.totalCost * (1 + LASER_CUTTING_CONSTANTS.COST.OVERHEAD_FACTORS.MATERIAL_WASTE);

    // Enhanced cutting time estimation using MaterialService
    const laserPower = inputs.laserPower || 1000;
    const cuttingSpeed = this.materialService.estimateCuttingSpeed(material, thickness, laserPower);
    const cuttingTime = (cuttingLength / cuttingSpeed) * quantity / 60; // Convert to hours

    // Enhanced piercing time calculation
    const piercingCount = Math.max(1, Math.floor(cuttingLength / 100));
    const piercingTimePerPierce = thickness < 1 ? 0.001 : thickness < 5 ? 0.002 : thickness < 10 ? 0.005 : 0.01;
    const piercingTime = piercingCount * piercingTimePerPierce * quantity / 3600; // Convert to hours

    // Setup time based on complexity
    const setupTime = LASER_CUTTING_CONSTANTS.TIME.SETUP_TIMES.STANDARD;

    const totalMachineTime = cuttingTime + piercingTime + setupTime;
    const machineTimeCost = totalMachineTime * machineRate;
    const laborCost = totalMachineTime * laborRate;

    // Gas cost calculation using recommended assist gas
    const assistGas = this.materialService.getRecommendedAssistGas(material, thickness);
    const gasCost = this.calculateGasCost(assistGas, totalMachineTime);

    // Enhanced consumables cost
    const consumablesCost = machineTimeCost * LASER_CUTTING_CONSTANTS.COST.OVERHEAD_FACTORS.CONSUMABLES_RATE;

    const subtotal = materialCost + machineTimeCost + laborCost + gasCost + consumablesCost;
    const totalCost = subtotal * (1 + LASER_CUTTING_CONSTANTS.COST.OVERHEAD_FACTORS.PROFIT_MARGIN);

    // Generate enhanced recommendations
    const recommendations = this.generateCostRecommendations(material, inputs, materialCostData, totalMachineTime);

    return {
      primaryValue: totalCost,
      primaryUnit: 'USD',
      primaryLabel: 'Total Cost',
      breakdown: [
        { label: 'Material Cost', value: materialCost, unit: 'USD', percentage: (materialCost / totalCost) * 100 },
        { label: 'Machine Time', value: machineTimeCost, unit: 'USD', percentage: (machineTimeCost / totalCost) * 100 },
        { label: 'Labor Cost', value: laborCost, unit: 'USD', percentage: (laborCost / totalCost) * 100 },
        { label: 'Gas Cost', value: gasCost, unit: 'USD', percentage: (gasCost / totalCost) * 100 },
        { label: 'Consumables', value: consumablesCost, unit: 'USD', percentage: (consumablesCost / totalCost) * 100 }
      ],
      recommendations,
      metadata: {
        calculationTime: 0,
        accuracy: 'high',
        lastUpdated: new Date(),
        additionalData: {
          materialWeight: materialCostData.weight,
          cuttingTime: totalMachineTime,
          assistGas: assistGas,
        }
      }
    };
  }

  private calculateCuttingTime(inputs: Record<string, any>, context?: CalculationContext): CalculatorResult {
    const { materialType, thickness, cuttingLength, laserPower, quantity } = inputs;

    const cuttingSpeed = this.estimateCuttingSpeed(materialType, thickness, laserPower);
    const cuttingTime = (cuttingLength / cuttingSpeed) * quantity;
    
    // Add piercing time
    const piercingCount = Math.max(1, Math.floor(cuttingLength / 100));
    const piercingTime = piercingCount * 0.002 * quantity;
    
    // Add setup time
    const setupTime = 0.1; // 6 minutes setup time
    
    const totalTime = cuttingTime + piercingTime + setupTime;

    return {
      primaryValue: totalTime,
      primaryUnit: 'hours',
      primaryLabel: 'Total Cutting Time',
      breakdown: [
        { label: 'Cutting Time', value: cuttingTime, unit: 'hours', percentage: (cuttingTime / totalTime) * 100 },
        { label: 'Piercing Time', value: piercingTime, unit: 'hours', percentage: (piercingTime / totalTime) * 100 },
        { label: 'Setup Time', value: setupTime, unit: 'hours', percentage: (setupTime / totalTime) * 100 }
      ],
      recommendations: [
        cuttingSpeed < 1000 ? 'Consider increasing laser power for faster cutting' : '',
        piercingTime > cuttingTime * 0.2 ? 'High piercing time - optimize part design to reduce holes' : ''
      ].filter(Boolean)
    };
  }

  private optimizeLaserParameters(inputs: Record<string, any>, context?: CalculationContext): CalculatorResult {
    const { materialType, thickness, qualityGrade } = inputs;

    // Simplified parameter optimization
    const material = context?.material;
    if (!material) {
      throw new Error('Material context required for parameter optimization');
    }

    const powerRange = material.cuttingParameters.powerRange;
    const speedRange = material.cuttingParameters.speedRange;
    
    // Quality-based parameter adjustment
    const qualityFactor = qualityGrade === 1 ? 0.7 : qualityGrade === 2 ? 0.8 : qualityGrade === 3 ? 0.9 : 1.0;
    
    const optimalPower = powerRange[0] + (powerRange[1] - powerRange[0]) * (thickness / 20) * qualityFactor;
    const optimalSpeed = speedRange[1] - (speedRange[1] - speedRange[0]) * (thickness / 20) * qualityFactor;

    return {
      primaryValue: optimalPower,
      primaryUnit: 'W',
      primaryLabel: 'Optimal Laser Power',
      breakdown: [
        { label: 'Laser Power', value: optimalPower, unit: 'W' },
        { label: 'Cutting Speed', value: optimalSpeed, unit: 'mm/min' },
        { label: 'Gas Pressure', value: material.cuttingParameters.gasPressure[0], unit: 'bar' },
        { label: 'Focus Offset', value: material.cuttingParameters.focusOffset, unit: 'mm' }
      ],
      recommendations: [
        'Start with these parameters and fine-tune based on cut quality',
        'Monitor edge quality and adjust speed if necessary',
        'Ensure proper gas flow for optimal results'
      ]
    };
  }

  private recommendMaterial(inputs: Record<string, any>, context?: CalculationContext): CalculatorResult {
    const { application, budget, strengthRequired, corrosionResistance } = inputs;

    // Simplified material recommendation logic
    let score = 0;
    let recommendedMaterial = 'Mild Steel';

    if (budget === 'low') {
      score += 10;
      recommendedMaterial = 'Mild Steel';
    } else if (budget === 'medium') {
      score += 8;
      recommendedMaterial = corrosionResistance ? 'Stainless Steel 304' : 'Aluminum 6061';
    } else {
      score += 6;
      recommendedMaterial = strengthRequired ? 'Titanium Grade 2' : 'Stainless Steel 304';
    }

    return {
      primaryValue: score,
      primaryUnit: 'score',
      primaryLabel: 'Recommendation Score',
      breakdown: [
        { label: 'Cost Efficiency', value: budget === 'low' ? 10 : budget === 'medium' ? 7 : 4, unit: 'points' },
        { label: 'Performance Match', value: strengthRequired ? 8 : 6, unit: 'points' },
        { label: 'Availability', value: 8, unit: 'points' }
      ],
      recommendations: [
        `Recommended material: ${recommendedMaterial}`,
        'Consider material availability in your region',
        'Verify material specifications meet your requirements'
      ]
    };
  }

  private estimateCuttingSpeed(materialType: string, thickness: number, power?: number): number {
    // Simplified cutting speed estimation (mm/min)
    const baseSpeeds: Record<string, number> = {
      'mild-steel': 3000,
      'stainless-steel-304': 2000,
      'aluminum-6061': 4000,
      'acrylic': 1500,
      'plywood': 2500
    };

    const baseSpeed = baseSpeeds[materialType] || 2000;
    const thicknessFactor = Math.max(0.1, 1 - (thickness - 1) * 0.1);
    const powerFactor = power ? Math.min(2, power / 1000) : 1;

    return baseSpeed * thicknessFactor * powerFactor;
  }

  private generateCacheKey(calculatorId: string, inputs: Record<string, any>, context?: CalculationContext): string {
    const inputsStr = JSON.stringify(inputs, Object.keys(inputs).sort());
    const contextStr = context ? JSON.stringify(context) : '';
    return `${calculatorId}-${btoa(inputsStr + contextStr)}`;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getPerformanceStats(calculatorId?: string) {
    if (calculatorId) {
      return this.performanceMonitor.getCalculatorStats(calculatorId);
    }
    return this.performanceMonitor.getSystemStats();
  }

  getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }

  getAlgorithmRegistry(): AlgorithmRegistry {
    return this.algorithmRegistry;
  }

  getUnitConversionService(): UnitConversionService {
    return this.unitConversionService;
  }

  /**
   * Calculate gas cost based on assist gas recommendations
   */
  private calculateGasCost(assistGas: any, machineTimeHours: number): number {
    const gasProperties = LASER_CUTTING_CONSTANTS.LASER.ASSIST_GASES[assistGas.gasType.toUpperCase() as keyof typeof LASER_CUTTING_CONSTANTS.LASER.ASSIST_GASES];

    if (!gasProperties) {
      return machineTimeHours * 5; // Default gas cost per hour
    }

    // Calculate gas consumption (simplified)
    const flowRateM3PerHour = assistGas.flowRate / 1000; // Convert l/min to m³/h
    const gasVolume = flowRateM3PerHour * machineTimeHours * 60; // m³

    // Gas cost estimation (varies by gas type)
    const gasCostPerM3 = assistGas.gasType === 'oxygen' ? 0.5 :
                        assistGas.gasType === 'nitrogen' ? 1.2 :
                        assistGas.gasType === 'argon' ? 3.0 : 0.8;

    return gasVolume * gasCostPerM3;
  }

  /**
   * Generate cost optimization recommendations
   */
  private generateCostRecommendations(
    material: Material,
    inputs: Record<string, any>,
    materialCostData: any,
    machineTime: number
  ): string[] {
    const recommendations: string[] = [];
    const totalCost = materialCostData.totalCost;
    const quantity = Number(inputs.quantity);

    // Material cost optimization
    if (materialCostData.costPerPart > 10) {
      recommendations.push('Consider bulk purchasing to reduce material cost per unit');
    }

    // Machine time optimization
    if (machineTime > 2) {
      recommendations.push('Consider batch processing to reduce setup time overhead');
    }

    // Quantity-based recommendations
    if (quantity > 100) {
      recommendations.push('High quantity order - optimize nesting to minimize material waste');
    }

    // Material-specific recommendations
    if (material.availability === 'specialty') {
      recommendations.push('Specialty material - consider lead time for procurement');
    }

    if (material.costPerKg > 20) {
      recommendations.push('High-cost material - verify design requirements and consider alternatives');
    }

    // General optimization
    recommendations.push('Optimize part nesting to reduce material waste');

    if (machineTime < 0.1) {
      recommendations.push('Short cutting time - consider combining with other jobs to improve efficiency');
    }

    return recommendations;
  }
}
