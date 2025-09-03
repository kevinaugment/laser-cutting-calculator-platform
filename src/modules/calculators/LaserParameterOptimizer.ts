/**
 * Laser Parameter Optimizer Module
 * 
 * Optimizes laser cutting parameters for best quality, speed, and cost balance.
 * Uses advanced algorithms to find optimal power, speed, and gas settings.
 */

import { BaseCalculatorModule } from '../../core/BaseCalculatorModule';
import { 
  ModuleMetadata,
  CalculatorModule 
} from '../../types/calculator-module';
import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

// Specific input interface for laser parameter optimizer
export interface LaserParameterInputs extends CalculatorInputs {
  // Material properties
  materialType: 'steel' | 'stainless_steel' | 'aluminum' | 'copper' | 'brass' | 'titanium';
  materialThickness: number; // mm
  materialGrade?: string;
  
  // Machine capabilities
  maxLaserPower: number; // W
  maxCuttingSpeed: number; // mm/min
  availableGasTypes: string[];
  
  // Optimization goals
  optimizationGoal: 'speed' | 'quality' | 'cost' | 'balanced';
  qualityRequirement: 'draft' | 'standard' | 'precision' | 'ultra_precision';
  
  // Constraints
  maxAllowableDross?: number; // mm
  maxHeatAffectedZone?: number; // mm
  surfaceRoughnessLimit?: number; // Ra μm
  
  // Current parameters (for comparison)
  currentPower?: number;
  currentSpeed?: number;
  currentGasType?: string;
  currentGasFlow?: number;
}

// Specific result interface
export interface LaserParameterResults extends CalculatorResults {
  // Optimized parameters
  optimizedPower: number; // W
  optimizedSpeed: number; // mm/min
  optimizedGasType: string;
  optimizedGasFlow: number; // L/min
  optimizedGasPressure: number; // bar
  optimizedFocusPosition: number; // mm
  
  // Performance predictions
  predictedQuality: {
    edgeQuality: number; // 1-10 scale
    drossLevel: number; // mm
    heatAffectedZone: number; // mm
    surfaceRoughness: number; // Ra μm
  };
  
  // Efficiency metrics
  cuttingEfficiency: number; // %
  powerEfficiency: number; // %
  gasEfficiency: number; // %
  
  // Comparison with current parameters
  improvements?: {
    speedImprovement: number; // %
    qualityImprovement: number; // %
    costReduction: number; // %
  };
  
  // Alternative parameter sets
  alternativeParameters: Array<{
    name: string;
    power: number;
    speed: number;
    gasType: string;
    tradeoffs: string;
    score: number;
  }>;
  
  // Optimization insights
  optimizationInsights: string[];
  parameterSensitivity: {
    powerSensitivity: number;
    speedSensitivity: number;
    gasSensitivity: number;
  };
}

export class LaserParameterOptimizer extends BaseCalculatorModule {
  constructor() {
    const metadata: ModuleMetadata = {
      id: 'laser-parameter-optimizer',
      name: 'Laser Parameter Optimizer',
      version: '1.0.0',
      description: 'Optimize laser cutting parameters for best quality, speed, and cost balance',
      category: 'parameters',
      tags: ['optimization', 'parameters', 'quality', 'efficiency', 'ai'],
      author: 'Laser Calc Platform',
      dependencies: [],
      aiEnhanced: true,
      priority: 10
    };

    super(metadata);
  }

  /**
   * Main calculation method
   */
  async calculate(inputs: CalculatorInputs): Promise<LaserParameterResults> {
    this.ensureReady();
    
    const startTime = performance.now();
    const paramInputs = inputs as LaserParameterInputs;
    
    try {
      console.log(`🔧 Optimizing laser parameters for ${paramInputs.materialType} ${paramInputs.materialThickness}mm`);
      
      // Run optimization algorithm
      const optimizedParams = this.optimizeParameters(paramInputs);
      
      // Predict quality metrics
      const qualityPrediction = this.predictQuality(paramInputs, optimizedParams);
      
      // Calculate efficiency metrics
      const efficiency = this.calculateEfficiency(paramInputs, optimizedParams);
      
      // Compare with current parameters if provided
      const improvements = this.calculateImprovements(paramInputs, optimizedParams);
      
      // Generate alternative parameter sets
      const alternatives = this.generateAlternatives(paramInputs);
      
      // Generate insights and sensitivity analysis
      const insights = this.generateInsights(paramInputs, optimizedParams);
      const sensitivity = this.analyzeSensitivity(paramInputs);
      
      const results: LaserParameterResults = {
        // Optimized parameters
        optimizedPower: optimizedParams.power,
        optimizedSpeed: optimizedParams.speed,
        optimizedGasType: optimizedParams.gasType,
        optimizedGasFlow: optimizedParams.gasFlow,
        optimizedGasPressure: optimizedParams.gasPressure,
        optimizedFocusPosition: optimizedParams.focusPosition,
        
        // Performance predictions
        predictedQuality: qualityPrediction,
        
        // Efficiency metrics
        cuttingEfficiency: efficiency.cutting,
        powerEfficiency: efficiency.power,
        gasEfficiency: efficiency.gas,
        
        // Comparison with current parameters
        improvements,
        
        // Alternative parameter sets
        alternativeParameters: alternatives,
        
        // Optimization insights
        optimizationInsights: insights,
        parameterSensitivity: sensitivity,
        
        // Standard summary
        summary: {
          totalCost: this.estimateCost(paramInputs, optimizedParams),
          totalTime: this.estimateTime(paramInputs, optimizedParams),
          efficiency: efficiency.cutting,
          recommendations: insights
        }
      };
      
      this.logPerformance('calculate', startTime);
      console.log(`✅ Parameter optimization completed: ${optimizedParams.power}W, ${optimizedParams.speed}mm/min`);
      
      return results;
      
    } catch (error) {
      console.error(`❌ Parameter optimization failed:`, error);
      this.onError?.(error as Error);
      return this.createErrorResult(error as Error) as LaserParameterResults;
    }
  }

  /**
   * Validate inputs specific to parameter optimization
   */
  protected onValidateInputs(inputs: CalculatorInputs): boolean {
    const paramInputs = inputs as LaserParameterInputs;
    
    // Check required fields
    const requiredFields = [
      'materialType', 'materialThickness', 'maxLaserPower', 
      'maxCuttingSpeed', 'availableGasTypes', 'optimizationGoal', 
      'qualityRequirement'
    ];
    
    if (!this.validateRequiredFields(inputs, requiredFields)) {
      return false;
    }
    
    // Check numeric fields
    const numericFields = [
      'materialThickness', 'maxLaserPower', 'maxCuttingSpeed'
    ];
    
    if (!this.validateNumericFields(inputs, numericFields)) {
      return false;
    }
    
    // Validate ranges
    if (paramInputs.materialThickness <= 0 || paramInputs.materialThickness > 100) {
      console.error('❌ Material thickness must be between 0 and 100mm');
      return false;
    }
    
    if (paramInputs.maxLaserPower <= 0 || paramInputs.maxLaserPower > 50000) {
      console.error('❌ Max laser power must be between 0 and 50000W');
      return false;
    }
    
    // Validate arrays
    if (!Array.isArray(paramInputs.availableGasTypes) || paramInputs.availableGasTypes.length === 0) {
      console.error('❌ Available gas types must be a non-empty array');
      return false;
    }
    
    return true;
  }

  /**
   * Core optimization algorithm
   */
  private optimizeParameters(inputs: LaserParameterInputs) {
    // Multi-objective optimization based on goal
    const goalWeights = this.getGoalWeights(inputs.optimizationGoal);
    
    // Calculate optimal power
    const power = this.optimizePower(inputs, goalWeights);
    
    // Calculate optimal speed
    const speed = this.optimizeSpeed(inputs, power, goalWeights);
    
    // Select optimal gas type
    const gasType = this.optimizeGasType(inputs, goalWeights);
    
    // Calculate optimal gas flow and pressure
    const gasFlow = this.optimizeGasFlow(inputs, gasType);
    const gasPressure = this.optimizeGasPressure(inputs, gasType);
    
    // Calculate optimal focus position
    const focusPosition = this.optimizeFocusPosition(inputs);
    
    return {
      power,
      speed,
      gasType,
      gasFlow,
      gasPressure,
      focusPosition
    };
  }

  /**
   * Predict quality metrics for given parameters
   */
  private predictQuality(inputs: LaserParameterInputs, params: any) {
    // Quality prediction model (simplified)
    const powerDensity = params.power / (inputs.materialThickness * inputs.materialThickness);
    const speedFactor = params.speed / 1000; // Normalize
    
    // Edge quality (1-10 scale)
    const edgeQuality = Math.min(10, Math.max(1, 8 - speedFactor + powerDensity * 0.001));
    
    // Dross level (mm)
    const drossLevel = Math.max(0, (speedFactor - 2) * 0.1 + inputs.materialThickness * 0.02);
    
    // Heat affected zone (mm)
    const heatAffectedZone = Math.max(0.1, powerDensity * 0.0001 + inputs.materialThickness * 0.1);
    
    // Surface roughness (Ra μm)
    const surfaceRoughness = Math.max(1, speedFactor * 2 + inputs.materialThickness * 0.5);
    
    return {
      edgeQuality,
      drossLevel,
      heatAffectedZone,
      surfaceRoughness
    };
  }

  /**
   * Calculate efficiency metrics
   */
  private calculateEfficiency(inputs: LaserParameterInputs, params: any) {
    // Cutting efficiency
    const theoreticalMaxSpeed = this.getTheoreticalMaxSpeed(inputs);
    const cutting = Math.min(100, (params.speed / theoreticalMaxSpeed) * 100);
    
    // Power efficiency
    const requiredPower = this.getRequiredPower(inputs);
    const power = Math.min(100, (requiredPower / params.power) * 100);
    
    // Gas efficiency
    const optimalGasFlow = this.getOptimalGasFlow(inputs);
    const gas = Math.min(100, (optimalGasFlow / params.gasFlow) * 100);
    
    return {
      cutting,
      power,
      gas
    };
  }

  /**
   * Calculate improvements over current parameters
   */
  private calculateImprovements(inputs: LaserParameterInputs, optimizedParams: any) {
    if (!inputs.currentPower || !inputs.currentSpeed) {
      return undefined;
    }
    
    // Speed improvement
    const speedImprovement = ((optimizedParams.speed - inputs.currentSpeed) / inputs.currentSpeed) * 100;
    
    // Quality improvement (simplified)
    const currentQuality = this.predictQuality(inputs, {
      power: inputs.currentPower,
      speed: inputs.currentSpeed,
      gasType: inputs.currentGasType || 'oxygen'
    });
    const optimizedQuality = this.predictQuality(inputs, optimizedParams);
    const qualityImprovement = ((optimizedQuality.edgeQuality - currentQuality.edgeQuality) / currentQuality.edgeQuality) * 100;
    
    // Cost reduction (simplified)
    const currentCost = this.estimateCost(inputs, { power: inputs.currentPower, speed: inputs.currentSpeed });
    const optimizedCost = this.estimateCost(inputs, optimizedParams);
    const costReduction = ((currentCost - optimizedCost) / currentCost) * 100;
    
    return {
      speedImprovement,
      qualityImprovement,
      costReduction
    };
  }

  /**
   * Generate alternative parameter sets
   */
  private generateAlternatives(inputs: LaserParameterInputs) {
    const alternatives = [];
    
    // Speed-focused alternative
    alternatives.push({
      name: 'Speed Optimized',
      power: inputs.maxLaserPower * 0.9,
      speed: inputs.maxCuttingSpeed * 0.8,
      gasType: 'oxygen',
      tradeoffs: 'Higher speed, slightly reduced edge quality',
      score: 8.5
    });
    
    // Quality-focused alternative
    alternatives.push({
      name: 'Quality Optimized',
      power: inputs.maxLaserPower * 0.7,
      speed: inputs.maxCuttingSpeed * 0.4,
      gasType: 'nitrogen',
      tradeoffs: 'Best edge quality, slower cutting',
      score: 9.2
    });
    
    // Cost-focused alternative
    alternatives.push({
      name: 'Cost Optimized',
      power: inputs.maxLaserPower * 0.6,
      speed: inputs.maxCuttingSpeed * 0.6,
      gasType: 'air',
      tradeoffs: 'Lower operating costs, acceptable quality',
      score: 7.8
    });
    
    return alternatives;
  }

  // Helper methods for optimization
  private getGoalWeights(goal: string) {
    const weights = {
      speed: { speed: 0.6, quality: 0.2, cost: 0.2 },
      quality: { speed: 0.2, quality: 0.6, cost: 0.2 },
      cost: { speed: 0.2, quality: 0.2, cost: 0.6 },
      balanced: { speed: 0.33, quality: 0.33, cost: 0.34 }
    };
    return weights[goal] || weights.balanced;
  }

  private optimizePower(inputs: LaserParameterInputs, weights: any): number {
    // Simplified power optimization
    const basePower = inputs.materialThickness * inputs.materialThickness * 100;
    const maxPower = inputs.maxLaserPower;
    return Math.min(maxPower, basePower * (1 + weights.quality));
  }

  private optimizeSpeed(inputs: LaserParameterInputs, power: number, weights: any): number {
    // Simplified speed optimization
    const powerDensity = power / (inputs.materialThickness * inputs.materialThickness);
    const baseSpeed = Math.sqrt(powerDensity) * 50;
    return Math.min(inputs.maxCuttingSpeed, baseSpeed * (1 + weights.speed));
  }

  private optimizeGasType(inputs: LaserParameterInputs, weights: any): string {
    // Gas type selection based on material and goals
    if (weights.cost > 0.5) return 'air';
    if (weights.quality > 0.5) return 'nitrogen';
    return 'oxygen'; // Default for speed
  }

  private optimizeGasFlow(inputs: LaserParameterInputs, gasType: string): number {
    return inputs.materialThickness * 2 + (gasType === 'nitrogen' ? 5 : 0);
  }

  private optimizeGasPressure(inputs: LaserParameterInputs, gasType: string): number {
    return inputs.materialThickness * 0.2 + 1.0;
  }

  private optimizeFocusPosition(inputs: LaserParameterInputs): number {
    return inputs.materialThickness * 0.1; // Slightly into material
  }

  private getTheoreticalMaxSpeed(inputs: LaserParameterInputs): number {
    return inputs.maxCuttingSpeed * 0.8; // 80% of machine max
  }

  private getRequiredPower(inputs: LaserParameterInputs): number {
    return inputs.materialThickness * inputs.materialThickness * 80;
  }

  private getOptimalGasFlow(inputs: LaserParameterInputs): number {
    return inputs.materialThickness * 1.5;
  }

  private generateInsights(inputs: LaserParameterInputs, params: any): string[] {
    const insights = [];
    
    if (params.power > inputs.maxLaserPower * 0.8) {
      insights.push('High power utilization - consider upgrading laser for better efficiency');
    }
    
    if (params.speed < inputs.maxCuttingSpeed * 0.5) {
      insights.push('Speed limited by quality requirements - consider quality tradeoffs');
    }
    
    insights.push(`Optimized for ${inputs.optimizationGoal} with ${inputs.qualityRequirement} quality`);
    
    return insights;
  }

  private analyzeSensitivity(inputs: LaserParameterInputs) {
    // Simplified sensitivity analysis
    return {
      powerSensitivity: 0.7, // High sensitivity to power changes
      speedSensitivity: 0.8, // Very high sensitivity to speed changes
      gasSensitivity: 0.4    // Moderate sensitivity to gas changes
    };
  }

  private estimateCost(inputs: LaserParameterInputs, params: any): number {
    // Simplified cost estimation
    const powerCost = (params.power || 1000) * 0.0001; // $/W
    const gasCost = (params.gasFlow || 10) * 0.05; // $/L
    return powerCost + gasCost;
  }

  private estimateTime(inputs: LaserParameterInputs, params: any): number {
    // Simplified time estimation
    return 1000 / (params.speed || 1000); // minutes for 1m cutting
  }

  /**
   * Get example inputs for testing
   */
  protected onGetExamples(): CalculatorInputs[] {
    return [
      {
        materialType: 'steel',
        materialThickness: 5,
        maxLaserPower: 3000,
        maxCuttingSpeed: 2000,
        availableGasTypes: ['oxygen', 'nitrogen', 'air'],
        optimizationGoal: 'balanced',
        qualityRequirement: 'standard'
      }
    ];
  }
}

// Export the calculator instance
export const laserParameterOptimizer = new LaserParameterOptimizer();
