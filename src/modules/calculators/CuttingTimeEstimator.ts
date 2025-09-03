/**
 * Cutting Time Estimator Module
 * 
 * Estimates cutting time for laser cutting operations with support for
 * different materials, thicknesses, and cutting parameters.
 */

import { BaseCalculatorModule } from '../../core/BaseCalculatorModule';
import { 
  ModuleMetadata,
  CalculatorModule 
} from '../../types/calculator-module';
import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

// Specific input interface for cutting time estimator
export interface CuttingTimeInputs extends CalculatorInputs {
  // Material properties
  materialType: 'steel' | 'stainless_steel' | 'aluminum' | 'copper' | 'brass' | 'titanium';
  materialThickness: number; // mm
  
  // Geometry
  cuttingLength: number; // mm
  piercingCount: number;
  complexityFactor: number; // 1.0 = simple, 2.0 = complex
  
  // Machine parameters
  laserPower: number; // W
  maxCuttingSpeed: number; // mm/min
  
  // Quality requirements
  qualityLevel: 'draft' | 'standard' | 'precision';
  
  // Optional parameters
  gasType?: 'oxygen' | 'nitrogen' | 'air';
  focusPosition?: number; // mm
}

// Specific result interface
export interface CuttingTimeResults extends CalculatorResults {
  // Primary results
  totalCuttingTime: number; // minutes
  actualCuttingSpeed: number; // mm/min
  
  // Time breakdown
  cuttingTime: number; // minutes
  piercingTime: number; // minutes
  setupTime: number; // minutes
  
  // Productivity metrics
  productivityRate: number; // mm/min including all operations
  utilizationRate: number; // %
  
  // Optimization suggestions
  speedOptimizations: string[];
  qualityTradeoffs: Array<{
    qualityLevel: string;
    timeReduction: number; // %
    qualityImpact: string;
  }>;
  
  // Machine utilization
  powerUtilization: number; // %
  recommendedPower: number; // W
}

export class CuttingTimeEstimator extends BaseCalculatorModule {
  constructor() {
    const metadata: ModuleMetadata = {
      id: 'cutting-time-estimator',
      name: 'Cutting Time Estimator',
      version: '1.0.0',
      description: 'Estimate cutting time for laser cutting operations with optimization suggestions',
      category: 'time',
      tags: ['time', 'estimation', 'productivity', 'optimization'],
      author: 'Laser Calc Platform',
      dependencies: [],
      aiEnhanced: false,
      priority: 9
    };

    super(metadata);
  }

  /**
   * Main calculation method
   */
  async calculate(inputs: CalculatorInputs): Promise<CuttingTimeResults> {
    this.ensureReady();
    
    const startTime = performance.now();
    const timeInputs = inputs as CuttingTimeInputs;
    
    try {
      console.log(`🔧 Estimating cutting time for ${timeInputs.materialType} ${timeInputs.materialThickness}mm`);
      
      // Calculate optimal cutting speed
      const cuttingSpeed = this.calculateOptimalCuttingSpeed(timeInputs);
      
      // Calculate time components
      const timeBreakdown = this.calculateTimeBreakdown(timeInputs, cuttingSpeed);
      
      // Calculate productivity metrics
      const productivity = this.calculateProductivityMetrics(timeInputs, timeBreakdown);
      
      // Generate optimizations
      const optimizations = this.generateOptimizations(timeInputs, cuttingSpeed);
      
      // Calculate machine utilization
      const utilization = this.calculateMachineUtilization(timeInputs, cuttingSpeed);
      
      const results: CuttingTimeResults = {
        // Primary results
        totalCuttingTime: timeBreakdown.total,
        actualCuttingSpeed: cuttingSpeed.actual,
        
        // Time breakdown
        cuttingTime: timeBreakdown.cutting,
        piercingTime: timeBreakdown.piercing,
        setupTime: timeBreakdown.setup,
        
        // Productivity metrics
        productivityRate: productivity.rate,
        utilizationRate: productivity.utilization,
        
        // Optimization suggestions
        speedOptimizations: optimizations.speedSuggestions,
        qualityTradeoffs: optimizations.qualityTradeoffs,
        
        // Machine utilization
        powerUtilization: utilization.power,
        recommendedPower: utilization.recommendedPower,
        
        // Standard summary
        summary: {
          totalCost: timeBreakdown.total * 2.0, // Assume $2/min machine cost
          totalTime: timeBreakdown.total,
          efficiency: productivity.utilization,
          recommendations: optimizations.speedSuggestions
        }
      };
      
      this.logPerformance('calculate', startTime);
      console.log(`✅ Cutting time estimation completed: ${timeBreakdown.total.toFixed(2)} minutes`);
      
      return results;
      
    } catch (error) {
      console.error(`❌ Cutting time estimation failed:`, error);
      this.onError?.(error as Error);
      return this.createErrorResult(error as Error) as CuttingTimeResults;
    }
  }

  /**
   * Validate inputs specific to cutting time estimation
   */
  protected onValidateInputs(inputs: CalculatorInputs): boolean {
    const timeInputs = inputs as CuttingTimeInputs;
    
    // Check required fields
    const requiredFields = [
      'materialType', 'materialThickness', 'cuttingLength', 
      'piercingCount', 'complexityFactor', 'laserPower', 
      'maxCuttingSpeed', 'qualityLevel'
    ];
    
    if (!this.validateRequiredFields(inputs, requiredFields)) {
      return false;
    }
    
    // Check numeric fields
    const numericFields = [
      'materialThickness', 'cuttingLength', 'piercingCount', 
      'complexityFactor', 'laserPower', 'maxCuttingSpeed'
    ];
    
    if (!this.validateNumericFields(inputs, numericFields)) {
      return false;
    }
    
    // Validate ranges
    if (timeInputs.materialThickness <= 0 || timeInputs.materialThickness > 100) {
      console.error('❌ Material thickness must be between 0 and 100mm');
      return false;
    }
    
    if (timeInputs.laserPower <= 0 || timeInputs.laserPower > 50000) {
      console.error('❌ Laser power must be between 0 and 50000W');
      return false;
    }
    
    if (timeInputs.complexityFactor < 1.0 || timeInputs.complexityFactor > 5.0) {
      console.error('❌ Complexity factor must be between 1.0 and 5.0');
      return false;
    }
    
    // Validate enums
    const validMaterials = ['steel', 'stainless_steel', 'aluminum', 'copper', 'brass', 'titanium'];
    if (!validMaterials.includes(timeInputs.materialType)) {
      console.error('❌ Invalid material type:', timeInputs.materialType);
      return false;
    }
    
    const validQualityLevels = ['draft', 'standard', 'precision'];
    if (!validQualityLevels.includes(timeInputs.qualityLevel)) {
      console.error('❌ Invalid quality level:', timeInputs.qualityLevel);
      return false;
    }
    
    return true;
  }

  /**
   * Calculate optimal cutting speed based on material and parameters
   */
  private calculateOptimalCuttingSpeed(inputs: CuttingTimeInputs) {
    // Base speed calculation based on material and thickness
    const materialFactors = {
      steel: 1.0,
      stainless_steel: 0.8,
      aluminum: 1.2,
      copper: 0.7,
      brass: 0.9,
      titanium: 0.6
    };
    
    const qualityFactors = {
      draft: 1.3,
      standard: 1.0,
      precision: 0.7
    };
    
    const materialFactor = materialFactors[inputs.materialType];
    const qualityFactor = qualityFactors[inputs.qualityLevel];
    
    // Calculate base speed (simplified formula)
    const powerDensity = inputs.laserPower / (inputs.materialThickness * inputs.materialThickness);
    const baseSpeed = Math.sqrt(powerDensity) * 100 * materialFactor;
    
    // Apply quality and complexity factors
    const adjustedSpeed = baseSpeed * qualityFactor / inputs.complexityFactor;
    
    // Limit to machine maximum
    const actual = Math.min(adjustedSpeed, inputs.maxCuttingSpeed);
    
    return {
      base: baseSpeed,
      adjusted: adjustedSpeed,
      actual,
      limitedByMachine: actual === inputs.maxCuttingSpeed
    };
  }

  /**
   * Calculate time breakdown
   */
  private calculateTimeBreakdown(inputs: CuttingTimeInputs, cuttingSpeed: any) {
    // Cutting time
    const cutting = inputs.cuttingLength / cuttingSpeed.actual; // minutes
    
    // Piercing time
    const piercingTimePerHole = this.calculatePiercingTime(inputs);
    const piercing = inputs.piercingCount * piercingTimePerHole;
    
    // Setup time (based on complexity)
    const setup = Math.max(1.0, inputs.complexityFactor * 0.5);
    
    const total = cutting + piercing + setup;
    
    return {
      cutting,
      piercing,
      setup,
      total
    };
  }

  /**
   * Calculate productivity metrics
   */
  private calculateProductivityMetrics(inputs: CuttingTimeInputs, timeBreakdown: any) {
    const totalLength = inputs.cuttingLength;
    const totalTime = timeBreakdown.total;
    
    const rate = totalLength / totalTime; // mm/min including all operations
    const utilization = (timeBreakdown.cutting / totalTime) * 100; // % actual cutting time
    
    return {
      rate,
      utilization
    };
  }

  /**
   * Generate optimization suggestions
   */
  private generateOptimizations(inputs: CuttingTimeInputs, cuttingSpeed: any) {
    const speedSuggestions: string[] = [];
    const qualityTradeoffs: Array<{qualityLevel: string; timeReduction: number; qualityImpact: string}> = [];
    
    // Speed optimization suggestions
    if (cuttingSpeed.limitedByMachine) {
      speedSuggestions.push('Consider upgrading to a higher speed machine for better productivity');
    }
    
    if (inputs.complexityFactor > 2.0) {
      speedSuggestions.push('Simplify part geometry to reduce complexity factor and increase speed');
    }
    
    if (inputs.piercingCount > inputs.cuttingLength / 100) {
      speedSuggestions.push('Reduce number of piercing points by optimizing part layout');
    }
    
    // Quality tradeoffs
    if (inputs.qualityLevel === 'precision') {
      qualityTradeoffs.push({
        qualityLevel: 'standard',
        timeReduction: 30,
        qualityImpact: 'Slightly reduced edge quality, acceptable for most applications'
      });
      
      qualityTradeoffs.push({
        qualityLevel: 'draft',
        timeReduction: 50,
        qualityImpact: 'Reduced edge quality, suitable for prototypes or hidden surfaces'
      });
    } else if (inputs.qualityLevel === 'standard') {
      qualityTradeoffs.push({
        qualityLevel: 'draft',
        timeReduction: 25,
        qualityImpact: 'Reduced edge quality, suitable for prototypes'
      });
    }
    
    return {
      speedSuggestions,
      qualityTradeoffs
    };
  }

  /**
   * Calculate machine utilization
   */
  private calculateMachineUtilization(inputs: CuttingTimeInputs, cuttingSpeed: any) {
    // Calculate power utilization based on material and thickness
    const requiredPower = this.calculateRequiredPower(inputs);
    const powerUtilization = Math.min(100, (requiredPower / inputs.laserPower) * 100);
    
    // Recommend optimal power
    const recommendedPower = Math.max(requiredPower, inputs.laserPower * 0.8);
    
    return {
      power: powerUtilization,
      recommendedPower
    };
  }

  // Helper methods
  private calculatePiercingTime(inputs: CuttingTimeInputs): number {
    // Piercing time based on material thickness and type
    const baseTime = inputs.materialThickness * 0.02; // minutes per mm
    
    const materialMultipliers = {
      steel: 1.0,
      stainless_steel: 1.3,
      aluminum: 0.8,
      copper: 1.5,
      brass: 1.2,
      titanium: 2.0
    };
    
    return baseTime * materialMultipliers[inputs.materialType];
  }

  private calculateRequiredPower(inputs: CuttingTimeInputs): number {
    // Simplified power requirement calculation
    const materialPowerFactors = {
      steel: 1.0,
      stainless_steel: 1.2,
      aluminum: 0.6,
      copper: 1.4,
      brass: 1.1,
      titanium: 1.8
    };
    
    const basePower = inputs.materialThickness * inputs.materialThickness * 50;
    return basePower * materialPowerFactors[inputs.materialType];
  }

  /**
   * Get example inputs for testing
   */
  protected onGetExamples(): CalculatorInputs[] {
    return [
      {
        materialType: 'steel',
        materialThickness: 5,
        cuttingLength: 2000,
        piercingCount: 10,
        complexityFactor: 1.5,
        laserPower: 3000,
        maxCuttingSpeed: 2000,
        qualityLevel: 'standard',
        gasType: 'oxygen'
      },
      {
        materialType: 'aluminum',
        materialThickness: 3,
        cuttingLength: 1500,
        piercingCount: 5,
        complexityFactor: 1.2,
        laserPower: 2000,
        maxCuttingSpeed: 3000,
        qualityLevel: 'precision',
        gasType: 'nitrogen'
      }
    ];
  }

  /**
   * Get documentation
   */
  protected onGetDocumentation(): string {
    return `
# Cutting Time Estimator

Estimate cutting time for laser cutting operations with optimization suggestions.

## Inputs
- Material type and thickness
- Cutting geometry (length, piercing count, complexity)
- Machine parameters (power, max speed)
- Quality requirements

## Outputs
- Total cutting time breakdown
- Actual cutting speed
- Productivity metrics
- Optimization suggestions
- Machine utilization analysis

## Supported Materials
- Steel, Stainless Steel, Aluminum
- Copper, Brass, Titanium

## Quality Levels
- Draft: Fast cutting, reduced quality
- Standard: Balanced speed and quality
- Precision: High quality, slower cutting
    `;
  }
}

// Export the calculator instance
export const cuttingTimeEstimator = new CuttingTimeEstimator();
