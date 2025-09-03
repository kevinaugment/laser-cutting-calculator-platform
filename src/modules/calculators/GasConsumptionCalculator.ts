/**
 * Gas Consumption Calculator Module
 * 
 * Calculates gas consumption for laser cutting operations with support for
 * different gas types, cutting parameters, and optimization recommendations.
 */

import { BaseCalculatorModule } from '../../core/BaseCalculatorModule';
import { 
  ModuleMetadata,
  CalculatorModule 
} from '../../types/calculator-module';
import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

// Specific input interface for gas consumption calculator
export interface GasConsumptionInputs extends CalculatorInputs {
  // Material properties
  materialType: string;
  materialThickness: number; // mm
  
  // Cutting parameters
  cuttingSpeed: number; // mm/min
  cuttingLength: number; // mm
  piercingCount: number;
  
  // Gas settings
  gasType: 'oxygen' | 'nitrogen' | 'air' | 'argon';
  gasFlow: number; // L/min
  gasPressure: number; // bar
  
  // Economic factors
  gasPrice: number; // $/L or $/m³
  
  // Optional optimization parameters
  optimizeForCost?: boolean;
  optimizeForQuality?: boolean;
}

// Specific result interface
export interface GasConsumptionResults extends CalculatorResults {
  // Primary results
  totalGasConsumption: number; // L or m³
  totalGasCost: number; // $
  gasConsumptionRate: number; // L/min
  
  // Breakdown
  cuttingGasConsumption: number;
  piercingGasConsumption: number;
  
  // Efficiency metrics
  gasEfficiency: number; // %
  costPerMeter: number; // $/m
  
  // Optimization suggestions
  optimizationSuggestions: string[];
  alternativeGasOptions: Array<{
    gasType: string;
    estimatedCost: number;
    qualityImpact: string;
  }>;
}

export class GasConsumptionCalculator extends BaseCalculatorModule {
  constructor() {
    const metadata: ModuleMetadata = {
      id: 'gas-consumption-calculator',
      name: 'Gas Consumption Calculator',
      version: '1.0.0',
      description: 'Calculate gas consumption and costs for laser cutting operations',
      category: 'cost',
      tags: ['gas', 'consumption', 'cost', 'optimization'],
      author: 'Laser Calc Platform',
      dependencies: [],
      aiEnhanced: false,
      priority: 8
    };

    super(metadata);
  }

  /**
   * Main calculation method
   */
  async calculate(inputs: CalculatorInputs): Promise<GasConsumptionResults> {
    this.ensureReady();
    
    const startTime = performance.now();
    const gasInputs = inputs as GasConsumptionInputs;
    
    try {
      console.log(`🔧 Calculating gas consumption for ${gasInputs.materialType}`);
      
      // Calculate cutting time
      const cuttingTime = this.calculateCuttingTime(gasInputs);
      
      // Calculate gas consumption
      const gasConsumption = this.calculateGasConsumption(gasInputs, cuttingTime);
      
      // Calculate costs
      const costs = this.calculateCosts(gasInputs, gasConsumption);
      
      // Generate optimization suggestions
      const optimizations = this.generateOptimizations(gasInputs, gasConsumption);
      
      // Calculate efficiency metrics
      const efficiency = this.calculateEfficiency(gasInputs, gasConsumption);
      
      const results: GasConsumptionResults = {
        // Primary results
        totalGasConsumption: gasConsumption.total,
        totalGasCost: costs.total,
        gasConsumptionRate: gasConsumption.rate,
        
        // Breakdown
        cuttingGasConsumption: gasConsumption.cutting,
        piercingGasConsumption: gasConsumption.piercing,
        
        // Efficiency metrics
        gasEfficiency: efficiency.gasEfficiency,
        costPerMeter: costs.costPerMeter,
        
        // Optimization suggestions
        optimizationSuggestions: optimizations.suggestions,
        alternativeGasOptions: optimizations.alternatives,
        
        // Standard summary
        summary: {
          totalCost: costs.total,
          totalTime: cuttingTime.total,
          efficiency: efficiency.gasEfficiency,
          recommendations: optimizations.suggestions
        }
      };
      
      this.logPerformance('calculate', startTime);
      console.log(`✅ Gas consumption calculation completed: ${gasConsumption.total.toFixed(2)}L, $${costs.total.toFixed(2)}`);
      
      return results;
      
    } catch (error) {
      console.error(`❌ Gas consumption calculation failed:`, error);
      this.onError?.(error as Error);
      return this.createErrorResult(error as Error) as GasConsumptionResults;
    }
  }

  /**
   * Validate inputs specific to gas consumption calculation
   */
  protected onValidateInputs(inputs: CalculatorInputs): boolean {
    const gasInputs = inputs as GasConsumptionInputs;
    
    // Check required fields
    const requiredFields = [
      'materialType', 'materialThickness', 'cuttingSpeed', 
      'cuttingLength', 'piercingCount', 'gasType', 
      'gasFlow', 'gasPressure', 'gasPrice'
    ];
    
    if (!this.validateRequiredFields(inputs, requiredFields)) {
      return false;
    }
    
    // Check numeric fields
    const numericFields = [
      'materialThickness', 'cuttingSpeed', 'cuttingLength', 
      'piercingCount', 'gasFlow', 'gasPressure', 'gasPrice'
    ];
    
    if (!this.validateNumericFields(inputs, numericFields)) {
      return false;
    }
    
    // Validate ranges
    if (gasInputs.materialThickness <= 0 || gasInputs.materialThickness > 100) {
      console.error('❌ Material thickness must be between 0 and 100mm');
      return false;
    }
    
    if (gasInputs.cuttingSpeed <= 0 || gasInputs.cuttingSpeed > 10000) {
      console.error('❌ Cutting speed must be between 0 and 10000 mm/min');
      return false;
    }
    
    if (gasInputs.gasFlow <= 0 || gasInputs.gasFlow > 100) {
      console.error('❌ Gas flow must be between 0 and 100 L/min');
      return false;
    }
    
    // Validate gas type
    const validGasTypes = ['oxygen', 'nitrogen', 'air', 'argon'];
    if (!validGasTypes.includes(gasInputs.gasType)) {
      console.error('❌ Invalid gas type:', gasInputs.gasType);
      return false;
    }
    
    return true;
  }

  /**
   * Calculate cutting time components
   */
  private calculateCuttingTime(inputs: GasConsumptionInputs) {
    const cuttingTime = inputs.cuttingLength / inputs.cuttingSpeed; // minutes
    const piercingTime = inputs.piercingCount * this.getPiercingTime(inputs); // minutes
    const total = cuttingTime + piercingTime;
    
    return {
      cutting: cuttingTime,
      piercing: piercingTime,
      total
    };
  }

  /**
   * Calculate gas consumption
   */
  private calculateGasConsumption(inputs: GasConsumptionInputs, cuttingTime: any) {
    const rate = inputs.gasFlow; // L/min
    const cutting = cuttingTime.cutting * rate;
    const piercing = cuttingTime.piercing * rate * this.getPiercingGasMultiplier(inputs);
    const total = cutting + piercing;
    
    return {
      rate,
      cutting,
      piercing,
      total
    };
  }

  /**
   * Calculate costs
   */
  private calculateCosts(inputs: GasConsumptionInputs, gasConsumption: any) {
    const total = gasConsumption.total * inputs.gasPrice;
    const costPerMeter = total / (inputs.cuttingLength / 1000); // per meter
    
    return {
      total,
      costPerMeter
    };
  }

  /**
   * Calculate efficiency metrics
   */
  private calculateEfficiency(inputs: GasConsumptionInputs, gasConsumption: any) {
    // Calculate theoretical minimum gas consumption
    const theoreticalMin = this.getTheoreticalMinConsumption(inputs);
    const gasEfficiency = Math.min(100, (theoreticalMin / gasConsumption.total) * 100);
    
    return {
      gasEfficiency
    };
  }

  /**
   * Generate optimization suggestions
   */
  private generateOptimizations(inputs: GasConsumptionInputs, gasConsumption: any) {
    const suggestions: string[] = [];
    const alternatives: Array<{gasType: string; estimatedCost: number; qualityImpact: string}> = [];
    
    // Gas flow optimization
    if (inputs.gasFlow > this.getOptimalGasFlow(inputs)) {
      suggestions.push(`Reduce gas flow to ${this.getOptimalGasFlow(inputs)}L/min to save costs`);
    }
    
    // Gas type alternatives
    if (inputs.gasType === 'nitrogen') {
      alternatives.push({
        gasType: 'air',
        estimatedCost: gasConsumption.total * inputs.gasPrice * 0.3,
        qualityImpact: 'Slightly reduced edge quality'
      });
    }
    
    if (inputs.gasType === 'oxygen' && inputs.materialThickness < 10) {
      alternatives.push({
        gasType: 'nitrogen',
        estimatedCost: gasConsumption.total * inputs.gasPrice * 1.5,
        qualityImpact: 'Better edge quality, no oxidation'
      });
    }
    
    return {
      suggestions,
      alternatives
    };
  }

  // Helper methods
  private getPiercingTime(inputs: GasConsumptionInputs): number {
    // Base piercing time based on material thickness
    return Math.max(0.1, inputs.materialThickness * 0.05); // minutes
  }

  private getPiercingGasMultiplier(inputs: GasConsumptionInputs): number {
    // Higher gas consumption during piercing
    return inputs.gasType === 'oxygen' ? 2.0 : 1.5;
  }

  private getTheoreticalMinConsumption(inputs: GasConsumptionInputs): number {
    // Theoretical minimum based on cutting volume
    const volume = inputs.cuttingLength * inputs.materialThickness * 0.1; // mm³
    return volume * 0.001; // Convert to L
  }

  private getOptimalGasFlow(inputs: GasConsumptionInputs): number {
    // Optimal gas flow based on material thickness and type
    const baseFlow = inputs.materialThickness * 0.5;
    const gasMultiplier = inputs.gasType === 'oxygen' ? 1.2 : 1.0;
    return Math.min(inputs.gasFlow, baseFlow * gasMultiplier);
  }

  /**
   * Get example inputs for testing
   */
  protected onGetExamples(): CalculatorInputs[] {
    return [
      {
        materialType: 'Steel',
        materialThickness: 5,
        cuttingSpeed: 1000,
        cuttingLength: 2000,
        piercingCount: 10,
        gasType: 'oxygen',
        gasFlow: 15,
        gasPressure: 1.5,
        gasPrice: 0.05
      },
      {
        materialType: 'Aluminum',
        materialThickness: 3,
        cuttingSpeed: 1500,
        cuttingLength: 1500,
        piercingCount: 5,
        gasType: 'nitrogen',
        gasFlow: 20,
        gasPressure: 2.0,
        gasPrice: 0.08
      }
    ];
  }

  /**
   * Get documentation
   */
  protected onGetDocumentation(): string {
    return `
# Gas Consumption Calculator

Calculate gas consumption and costs for laser cutting operations.

## Inputs
- Material type and thickness
- Cutting parameters (speed, length, piercing count)
- Gas settings (type, flow, pressure)
- Gas pricing

## Outputs
- Total gas consumption and cost
- Consumption breakdown (cutting vs piercing)
- Efficiency metrics
- Optimization suggestions
- Alternative gas options

## Supported Gas Types
- Oxygen: Best for steel cutting
- Nitrogen: Clean cuts, no oxidation
- Air: Cost-effective for thin materials
- Argon: Specialized applications
    `;
  }
}

// Export the calculator instance
export const gasConsumptionCalculator = new GasConsumptionCalculator();
