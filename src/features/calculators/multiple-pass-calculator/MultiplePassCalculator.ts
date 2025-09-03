// Multiple Pass Calculator Implementation
// Comprehensive multi-pass cutting optimization for thick materials

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const multiplePassSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(5).max(100),
  laserType: z.enum(['fiber', 'co2', 'nd_yag', 'diode']),
  maxLaserPower: z.number().min(500).max(20000),
  singlePassLimit: z.number().min(2).max(25),
  cuttingStrategy: z.enum(['progressive_power', 'adaptive', 'uniform', 'quality_focused']),
  qualityRequirement: z.enum(['rough', 'standard', 'precision', 'mirror']),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  cuttingLength: z.number().min(10).max(10000),
  currentPasses: z.number().min(1).max(10).optional()
});

// Input types
export type MultiplePassInputs = z.infer<typeof multiplePassSchema>;

// Result types
export interface MultiplePassResults {
  passStrategy: {
    totalPasses: number;
    depthPerPass: number;
    strategy: string;
    reasoning: string[];
    efficiency: number;              // %
    confidence: number;              // 0-1 scale
  };
  passParameters: Array<{
    passNumber: number;
    depth: number;                   // mm
    cumulativeDepth: number;         // mm
    power: number;                   // W
    powerPercentage: number;         // %
    speed: number;                   // mm/min
    gasPressure: number;             // bar
    focusPosition: number;           // mm
    estimatedTime: number;           // minutes
    notes: string;
  }>;
  timeAnalysis: {
    totalCuttingTime: number;        // minutes
    timePerPass: number[];           // minutes per pass
    setupTime: number;               // minutes
    totalTime: number;               // minutes
    timeOptimization: number;        // % vs single pass attempts
    productionRate: number;          // parts per hour
  };
  qualityPrediction: {
    overallScore: number;            // 0-100
    edgeQuality: 'excellent' | 'good' | 'fair' | 'poor';
    expectedFeatures: string[];
    potentialIssues: string[];
    qualityConsistency: number;      // %
  };
  costAnalysis: {
    materialCost: number;            // USD
    energyCost: number;              // USD
    gasCost: number;                 // USD
    laborCost: number;               // USD
    totalCost: number;               // USD
    costPerMm: number;               // USD/mm
    costComparison: {
      singlePassAttempt: number;     // USD (estimated)
      multiPassSavings: number;      // USD
      savingsPercentage: number;     // %
    };
  };
  processRecommendations: {
    strategyOptimizations: string[];
    parameterAdjustments: string[];
    qualityImprovements: string[];
    troubleshooting: Array<{
      issue: string;
      cause: string;
      solution: string;
    }>;
  };
  warnings: string[];
}

// Material single-pass limits and properties
const materialSinglePassLimits = {
  steel: { fiber: 20, co2: 15, nd_yag: 18, diode: 8 },
  stainless_steel: { fiber: 15, co2: 12, nd_yag: 14, diode: 6 },
  aluminum: { fiber: 12, co2: 8, nd_yag: 10, diode: 5 },
  copper: { fiber: 8, co2: 6, nd_yag: 7, diode: 4 },
  titanium: { fiber: 10, co2: 8, nd_yag: 9, diode: 5 },
  brass: { fiber: 10, co2: 8, nd_yag: 9, diode: 5 }
};

// Material cutting properties for multi-pass
const materialMultiPassProperties = {
  steel: {
    thermalConductivity: 50,
    workHardening: 0.1,
    optimalPassRatio: 0.6,
    qualityFactor: 0.85,
    costFactor: 1.0
  },
  stainless_steel: {
    thermalConductivity: 16,
    workHardening: 0.3,
    optimalPassRatio: 0.5,
    qualityFactor: 0.90,
    costFactor: 1.2
  },
  aluminum: {
    thermalConductivity: 237,
    workHardening: 0.05,
    optimalPassRatio: 0.7,
    qualityFactor: 0.80,
    costFactor: 0.8
  },
  copper: {
    thermalConductivity: 401,
    workHardening: 0.02,
    optimalPassRatio: 0.4,
    qualityFactor: 0.75,
    costFactor: 1.5
  },
  titanium: {
    thermalConductivity: 22,
    workHardening: 0.4,
    optimalPassRatio: 0.5,
    qualityFactor: 0.95,
    costFactor: 2.0
  },
  brass: {
    thermalConductivity: 120,
    workHardening: 0.15,
    optimalPassRatio: 0.6,
    qualityFactor: 0.80,
    costFactor: 1.1
  }
};

export class MultiplePassCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'multiple-pass-calculator',
    title: 'Multiple Pass Calculator',
    description: 'Optimize multi-pass cutting strategy for thick materials and complex geometries',
    category: 'Process Optimization',
    badge: 'Standard',
    iconName: 'Layers',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        help: 'Select the material to be cut',
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'copper', label: 'Copper' },
          { value: 'titanium', label: 'Titanium' },
          { value: 'brass', label: 'Brass' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 5,
        max: 100,
        step: 0.5,
        unit: 'mm',
        help: 'Thickness requiring multi-pass cutting'
      },
      {
        id: 'laserType',
        label: 'Laser Type',
        type: 'select',
        required: true,
        help: 'Type of laser system',
        options: [
          { value: 'fiber', label: 'Fiber Laser' },
          { value: 'co2', label: 'CO₂ Laser' },
          { value: 'nd_yag', label: 'Nd:YAG Laser' },
          { value: 'diode', label: 'Diode Laser' }
        ]
      },
      {
        id: 'maxLaserPower',
        label: 'Maximum Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W',
        help: 'Maximum available laser power'
      },
      {
        id: 'singlePassLimit',
        label: 'Single Pass Limit',
        type: 'number',
        required: true,
        min: 2,
        max: 25,
        step: 0.5,
        unit: 'mm',
        help: 'Maximum thickness achievable in single pass'
      },
      {
        id: 'cuttingStrategy',
        label: 'Cutting Strategy',
        type: 'select',
        required: true,
        help: 'Multi-pass cutting approach',
        options: [
          { value: 'progressive_power', label: 'Progressive Power' },
          { value: 'adaptive', label: 'Adaptive Strategy' },
          { value: 'uniform', label: 'Uniform Parameters' },
          { value: 'quality_focused', label: 'Quality Focused' }
        ]
      },
      {
        id: 'qualityRequirement',
        label: 'Quality Requirement',
        type: 'select',
        required: true,
        help: 'Required cut quality level',
        options: [
          { value: 'rough', label: 'Rough Cut' },
          { value: 'standard', label: 'Standard Quality' },
          { value: 'precision', label: 'Precision Cut' },
          { value: 'mirror', label: 'Mirror Finish' }
        ]
      },
      {
        id: 'assistGas',
        label: 'Assist Gas',
        type: 'select',
        required: true,
        help: 'Type of assist gas used',
        options: [
          { value: 'oxygen', label: 'Oxygen' },
          { value: 'nitrogen', label: 'Nitrogen' },
          { value: 'air', label: 'Compressed Air' },
          { value: 'argon', label: 'Argon' }
        ]
      },
      {
        id: 'cuttingLength',
        label: 'Cutting Length',
        type: 'number',
        required: true,
        min: 10,
        max: 10000,
        step: 10,
        unit: 'mm',
        help: 'Total length of cut path'
      },
      {
        id: 'currentPasses',
        label: 'Current Passes (Optional)',
        type: 'number',
        required: false,
        min: 1,
        max: 10,
        step: 1,
        help: 'Current number of passes for comparison'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return multiplePassSchema;
  }

  customValidation(inputs: MultiplePassInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check if multi-pass is actually needed
    const materialLimit = materialSinglePassLimits[inputs.materialType]?.[inputs.laserType] || 10;
    if (inputs.thickness <= materialLimit) {
      warnings.push({
        field: 'thickness',
        message: `Material thickness may be achievable in single pass. Consider single-pass cutting first.`,
        code: 'SINGLE_PASS_POSSIBLE'
      });
    }

    // Check single pass limit vs material thickness
    if (inputs.singlePassLimit >= inputs.thickness) {
      warnings.push({
        field: 'singlePassLimit',
        message: 'Single pass limit exceeds material thickness',
        code: 'EXCESSIVE_SINGLE_PASS_LIMIT'
      });
    }

    // Check power vs material compatibility
    const minPowerRequired = inputs.thickness * 100; // Rough estimate
    if (inputs.maxLaserPower < minPowerRequired) {
      warnings.push({
        field: 'maxLaserPower',
        message: 'Laser power may be insufficient for this material thickness',
        code: 'INSUFFICIENT_POWER'
      });
    }

    // Check strategy vs quality compatibility
    if (inputs.cuttingStrategy === 'progressive_power' && inputs.qualityRequirement === 'mirror') {
      warnings.push({
        field: 'cuttingStrategy',
        message: 'Progressive power strategy may not achieve mirror finish quality',
        code: 'STRATEGY_QUALITY_MISMATCH'
      });
    }

    // Check current passes if provided
    if (inputs.currentPasses !== undefined) {
      const estimatedOptimal = Math.ceil(inputs.thickness / inputs.singlePassLimit);
      if (Math.abs(inputs.currentPasses - estimatedOptimal) > 2) {
        warnings.push({
          field: 'currentPasses',
          message: 'Current pass count significantly differs from estimated optimal',
          code: 'SUBOPTIMAL_PASS_COUNT'
        });
      }
    }

    return { errors, warnings };
  }

  async calculate(inputs: MultiplePassInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialMultiPassProperties[inputs.materialType];
      
      // Calculate optimal pass strategy
      const passStrategy = this.calculatePassStrategy(inputs, material);
      
      // Calculate parameters for each pass
      const passParameters = this.calculatePassParameters(passStrategy, inputs, material);
      
      // Analyze time requirements
      const timeAnalysis = this.analyzeTimeRequirements(passParameters, inputs);
      
      // Predict quality outcomes
      const qualityPrediction = this.predictQualityOutcomes(passParameters, inputs, material);
      
      // Analyze costs
      const costAnalysis = this.analyzeCosts(passParameters, inputs, material);
      
      // Generate process recommendations
      const processRecommendations = this.generateProcessRecommendations(inputs, passStrategy, material);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, passStrategy, material);

      const results: MultiplePassResults = {
        passStrategy,
        passParameters,
        timeAnalysis,
        qualityPrediction,
        costAnalysis,
        processRecommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Multiple pass calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculatePassStrategy(inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel) {
    // Calculate minimum passes required
    const minPasses = Math.ceil(inputs.thickness / inputs.singlePassLimit);
    
    // Optimize based on strategy
    let optimalPasses = minPasses;
    
    switch (inputs.cuttingStrategy) {
      case 'progressive_power':
        // May benefit from additional passes for power progression
        optimalPasses = Math.min(minPasses + 1, 6);
        break;
      case 'adaptive':
        // Adapt based on material properties
        const adaptiveFactor = 1 + material.workHardening;
        optimalPasses = Math.ceil(minPasses * adaptiveFactor);
        break;
      case 'quality_focused':
        // More passes for better quality
        optimalPasses = Math.min(minPasses + 2, 8);
        break;
      case 'uniform':
      default:
        optimalPasses = minPasses;
        break;
    }
    
    // Adjust for quality requirements
    const qualityAdjustments = {
      rough: 0,
      standard: 0,
      precision: 1,
      mirror: 2
    };
    optimalPasses += qualityAdjustments[inputs.qualityRequirement];
    
    // Limit maximum passes
    optimalPasses = Math.min(optimalPasses, 8);
    
    const depthPerPass = inputs.thickness / optimalPasses;
    const efficiency = this.calculateStrategyEfficiency(optimalPasses, minPasses, inputs.cuttingStrategy);
    const confidence = this.calculateStrategyConfidence(inputs, material, optimalPasses);
    
    return {
      totalPasses: optimalPasses,
      depthPerPass: Math.round(depthPerPass * 100) / 100,
      strategy: inputs.cuttingStrategy,
      reasoning: this.generateStrategyReasoning(optimalPasses, inputs, material),
      efficiency: Math.round(efficiency * 10) / 10,
      confidence: Math.round(confidence * 100) / 100
    };
  }

  private calculatePassParameters(passStrategy: any, inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel) {
    const passes = [];
    const totalPasses = passStrategy.totalPasses;
    
    for (let i = 1; i <= totalPasses; i++) {
      const passDepth = passStrategy.depthPerPass;
      const cumulativeDepth = i * passDepth;
      
      // Calculate power for this pass
      const power = this.calculatePassPower(i, totalPasses, inputs, material);
      
      // Calculate speed for this pass
      const speed = this.calculatePassSpeed(i, totalPasses, passDepth, inputs, material);
      
      // Calculate gas pressure for this pass
      const gasPressure = this.calculatePassGasPressure(i, totalPasses, inputs, passDepth);
      
      // Calculate focus position for this pass
      const focusPosition = this.calculatePassFocus(i, passDepth, cumulativeDepth);
      
      // Calculate estimated time for this pass
      const estimatedTime = this.calculatePassTime(speed, inputs.cuttingLength);
      
      passes.push({
        passNumber: i,
        depth: Math.round(passDepth * 100) / 100,
        cumulativeDepth: Math.round(cumulativeDepth * 100) / 100,
        power: Math.round(power),
        powerPercentage: Math.round((power / inputs.maxLaserPower) * 100),
        speed: Math.round(speed),
        gasPressure: Math.round(gasPressure * 10) / 10,
        focusPosition: Math.round(focusPosition * 100) / 100,
        estimatedTime: Math.round(estimatedTime * 10) / 10,
        notes: this.generatePassNotes(i, totalPasses, inputs.cuttingStrategy)
      });
    }
    
    return passes;
  }

  private calculatePassPower(passNumber: number, totalPasses: number, inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel): number {
    let powerFactor = 1.0;
    
    switch (inputs.cuttingStrategy) {
      case 'progressive_power':
        // Reduce power for later passes
        powerFactor = 1.0 - ((passNumber - 1) / totalPasses) * 0.4;
        break;
      case 'adaptive':
        // Adaptive power based on material and pass
        if (passNumber === 1) {
          powerFactor = 0.9; // Slightly lower for first pass
        } else if (passNumber === totalPasses) {
          powerFactor = 0.6; // Lower for final pass
        } else {
          powerFactor = 0.8; // Medium for middle passes
        }
        break;
      case 'quality_focused':
        // Lower power for better quality
        powerFactor = 0.7 + (passNumber / totalPasses) * 0.2;
        break;
      case 'uniform':
      default:
        powerFactor = 0.8; // Consistent power
        break;
    }
    
    // Adjust for material properties
    powerFactor *= (1 + material.workHardening * (passNumber - 1) * 0.1);
    
    return Math.min(inputs.maxLaserPower * powerFactor, inputs.maxLaserPower);
  }

  private calculatePassSpeed(passNumber: number, totalPasses: number, passDepth: number, inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel): number {
    // Base speeds by material and laser type
    const baseSpeeds = {
      steel: { fiber: 2000, co2: 1500, nd_yag: 1800, diode: 1000 },
      stainless_steel: { fiber: 1800, co2: 1200, nd_yag: 1500, diode: 800 },
      aluminum: { fiber: 3000, co2: 800, nd_yag: 2000, diode: 1200 },
      copper: { fiber: 1500, co2: 600, nd_yag: 1200, diode: 600 },
      titanium: { fiber: 1200, co2: 800, nd_yag: 1000, diode: 500 },
      brass: { fiber: 2000, co2: 1000, nd_yag: 1500, diode: 800 }
    };
    
    let baseSpeed = baseSpeeds[inputs.materialType]?.[inputs.laserType] || 1500;
    
    // Adjust for pass depth
    baseSpeed *= Math.sqrt(5 / passDepth);
    
    // Adjust for pass number and strategy
    if (inputs.cuttingStrategy === 'quality_focused' || passNumber === totalPasses) {
      baseSpeed *= 0.7; // Slower for quality
    }
    
    // Adjust for quality requirements
    const qualityFactors = {
      rough: 1.2,
      standard: 1.0,
      precision: 0.8,
      mirror: 0.6
    };
    baseSpeed *= qualityFactors[inputs.qualityRequirement];
    
    return Math.max(200, Math.min(8000, baseSpeed));
  }

  private calculatePassGasPressure(passNumber: number, totalPasses: number, inputs: MultiplePassInputs, passDepth: number): number {
    // Base pressures by gas type
    const basePressures = {
      oxygen: 1.0,
      nitrogen: 15.0,
      air: 8.0,
      argon: 12.0
    };
    
    let pressure = basePressures[inputs.assistGas];
    
    // Adjust for pass depth
    pressure += passDepth * 0.2;
    
    // Adjust for pass number
    if (passNumber === totalPasses) {
      pressure *= 1.1; // Slightly higher for final pass
    }
    
    return Math.max(0.5, Math.min(25, pressure));
  }

  private calculatePassFocus(passNumber: number, passDepth: number, cumulativeDepth: number): number {
    // Focus position relative to current pass depth
    return -(cumulativeDepth - passDepth / 2);
  }

  private calculatePassTime(speed: number, cuttingLength: number): number {
    return (cuttingLength / speed) * 60; // Convert to minutes
  }

  private analyzeTimeRequirements(passParameters: any[], inputs: MultiplePassInputs) {
    const timePerPass = passParameters.map(pass => pass.estimatedTime);
    const totalCuttingTime = timePerPass.reduce((sum, time) => sum + time, 0);
    const setupTime = passParameters.length * 2; // 2 minutes setup per pass
    const totalTime = totalCuttingTime + setupTime;
    
    // Calculate time optimization vs single pass attempts
    const singlePassAttemptTime = inputs.cuttingLength / 500 * 60; // Estimated slow single pass
    const timeOptimization = ((singlePassAttemptTime - totalTime) / singlePassAttemptTime) * 100;
    
    const productionRate = 60 / totalTime; // parts per hour
    
    return {
      totalCuttingTime: Math.round(totalCuttingTime * 10) / 10,
      timePerPass: timePerPass.map(t => Math.round(t * 10) / 10),
      setupTime: Math.round(setupTime * 10) / 10,
      totalTime: Math.round(totalTime * 10) / 10,
      timeOptimization: Math.round(timeOptimization * 10) / 10,
      productionRate: Math.round(productionRate * 100) / 100
    };
  }

  private predictQualityOutcomes(passParameters: any[], inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel) {
    let qualityScore = 75; // Base quality score
    
    // Multi-pass generally improves quality
    qualityScore += 15;
    
    // More passes = better quality (up to a point)
    const passCount = passParameters.length;
    if (passCount >= 3) qualityScore += 5;
    if (passCount >= 5) qualityScore += 3;
    
    // Strategy affects quality
    const strategyBonus = {
      progressive_power: 5,
      adaptive: 8,
      uniform: 3,
      quality_focused: 12
    };
    qualityScore += strategyBonus[inputs.cuttingStrategy];
    
    // Quality requirement affects achievable score
    const qualityTargets = {
      rough: 70,
      standard: 80,
      precision: 90,
      mirror: 95
    };
    const targetScore = qualityTargets[inputs.qualityRequirement];
    qualityScore = Math.min(qualityScore, targetScore + 5);
    
    // Material factor
    qualityScore *= material.qualityFactor;
    
    qualityScore = Math.max(60, Math.min(100, qualityScore));
    
    let edgeQuality: 'excellent' | 'good' | 'fair' | 'poor';
    if (qualityScore >= 90) edgeQuality = 'excellent';
    else if (qualityScore >= 80) edgeQuality = 'good';
    else if (qualityScore >= 70) edgeQuality = 'fair';
    else edgeQuality = 'poor';
    
    const expectedFeatures = this.generateQualityFeatures(qualityScore, passCount, inputs.cuttingStrategy);
    const potentialIssues = this.predictPotentialIssues(passParameters, inputs, material);
    const qualityConsistency = Math.min(95, qualityScore - 5 + passCount * 2);
    
    return {
      overallScore: Math.round(qualityScore),
      edgeQuality,
      expectedFeatures,
      potentialIssues,
      qualityConsistency: Math.round(qualityConsistency)
    };
  }

  private analyzeCosts(passParameters: any[], inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel) {
    // Material cost (simplified)
    const materialVolume = inputs.thickness * inputs.cuttingLength * 0.003; // Assume 3mm kerf
    const materialDensity = 7.8; // kg/m³ for steel (simplified)
    const materialPrice = 2.5; // USD/kg (simplified)
    const materialCost = materialVolume * materialDensity * materialPrice * material.costFactor;
    
    // Energy cost
    const totalEnergy = passParameters.reduce((sum, pass) => {
      return sum + (pass.power * pass.estimatedTime / 60 / 1000); // kWh
    }, 0);
    const energyRate = 0.12; // USD/kWh
    const energyCost = totalEnergy * energyRate;
    
    // Gas cost
    const totalGasTime = passParameters.reduce((sum, pass) => sum + pass.estimatedTime, 0);
    const gasFlowRate = 20; // L/min (simplified)
    const gasPrice = inputs.assistGas === 'nitrogen' ? 0.15 : inputs.assistGas === 'oxygen' ? 0.10 : 0.02; // USD/L
    const gasCost = totalGasTime * gasFlowRate * gasPrice / 1000;
    
    // Labor cost
    const laborRate = 25; // USD/hour
    const totalLaborTime = passParameters.reduce((sum, pass) => sum + pass.estimatedTime, 0) / 60;
    const laborCost = totalLaborTime * laborRate;
    
    const totalCost = materialCost + energyCost + gasCost + laborCost;
    const costPerMm = totalCost / inputs.cuttingLength;
    
    // Cost comparison with single pass attempt
    const singlePassAttemptCost = totalCost * 1.5; // Estimated higher cost due to rework
    const multiPassSavings = singlePassAttemptCost - totalCost;
    const savingsPercentage = (multiPassSavings / singlePassAttemptCost) * 100;
    
    return {
      materialCost: Math.round(materialCost * 100) / 100,
      energyCost: Math.round(energyCost * 100) / 100,
      gasCost: Math.round(gasCost * 100) / 100,
      laborCost: Math.round(laborCost * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      costPerMm: Math.round(costPerMm * 1000) / 1000,
      costComparison: {
        singlePassAttempt: Math.round(singlePassAttemptCost * 100) / 100,
        multiPassSavings: Math.round(multiPassSavings * 100) / 100,
        savingsPercentage: Math.round(savingsPercentage * 10) / 10
      }
    };
  }

  private generateProcessRecommendations(inputs: MultiplePassInputs, passStrategy: any, material: typeof materialMultiPassProperties.steel) {
    const strategyOptimizations: string[] = [];
    const parameterAdjustments: string[] = [];
    const qualityImprovements: string[] = [];
    const troubleshooting: Array<{ issue: string; cause: string; solution: string }> = [];
    
    // Strategy optimizations
    if (passStrategy.totalPasses > 5) {
      strategyOptimizations.push('Consider reducing passes by increasing single-pass capability');
    }
    strategyOptimizations.push('Monitor heat accumulation between passes');
    strategyOptimizations.push('Allow cooling time between passes for thick sections');
    
    // Parameter adjustments
    parameterAdjustments.push('Fine-tune power progression between passes');
    parameterAdjustments.push('Adjust focus position for each pass depth');
    if (inputs.qualityRequirement === 'precision' || inputs.qualityRequirement === 'mirror') {
      parameterAdjustments.push('Use slower speeds on final pass for quality');
    }
    
    // Quality improvements
    qualityImprovements.push('Maintain consistent gas flow throughout all passes');
    qualityImprovements.push('Check and clean nozzle between passes if needed');
    if (material.workHardening > 0.2) {
      qualityImprovements.push('Consider stress relief between passes for work-hardening materials');
    }
    
    // Troubleshooting
    troubleshooting.push({
      issue: 'Inconsistent kerf width between passes',
      cause: 'Power or speed variation between passes',
      solution: 'Standardize parameters or use adaptive strategy'
    });
    
    troubleshooting.push({
      issue: 'Heat accumulation causing warping',
      cause: 'Insufficient cooling between passes',
      solution: 'Increase delay between passes or use cooling assistance'
    });
    
    troubleshooting.push({
      issue: 'Poor final pass quality',
      cause: 'Excessive heat buildup or wrong parameters',
      solution: 'Reduce final pass power and speed, ensure proper focus'
    });
    
    if (material.workHardening > 0.3) {
      troubleshooting.push({
        issue: 'Difficulty cutting later passes',
        cause: 'Material work hardening from previous passes',
        solution: 'Increase power for later passes or use stress relief'
      });
    }
    
    return {
      strategyOptimizations,
      parameterAdjustments,
      qualityImprovements,
      troubleshooting
    };
  }

  private calculateStrategyEfficiency(optimalPasses: number, minPasses: number, strategy: string): number {
    let efficiency = 85; // Base efficiency
    
    // Efficiency decreases with more passes
    efficiency -= (optimalPasses - minPasses) * 5;
    
    // Strategy affects efficiency
    const strategyEfficiency = {
      progressive_power: 90,
      adaptive: 95,
      uniform: 85,
      quality_focused: 80
    };
    
    efficiency = (efficiency + strategyEfficiency[strategy]) / 2;
    
    return Math.max(60, Math.min(100, efficiency));
  }

  private calculateStrategyConfidence(inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel, passes: number): number {
    let confidence = 0.8; // Base confidence
    
    // Increase confidence for common scenarios
    if (passes >= 2 && passes <= 4) {
      confidence += 0.1;
    }
    
    // Adjust for material properties
    if (material.workHardening < 0.2) {
      confidence += 0.05;
    }
    
    // Adjust for strategy
    if (inputs.cuttingStrategy === 'adaptive') {
      confidence += 0.05;
    }
    
    return Math.min(1.0, confidence);
  }

  private generateStrategyReasoning(passes: number, inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel): string[] {
    const reasons = [];
    
    reasons.push(`${passes} passes recommended for ${inputs.thickness}mm ${inputs.materialType}`);
    
    if (inputs.cuttingStrategy === 'progressive_power') {
      reasons.push('Progressive power strategy reduces heat accumulation');
    } else if (inputs.cuttingStrategy === 'quality_focused') {
      reasons.push('Quality-focused approach prioritizes edge finish over speed');
    } else if (inputs.cuttingStrategy === 'adaptive') {
      reasons.push('Adaptive strategy optimizes for material properties');
    }
    
    if (material.workHardening > 0.2) {
      reasons.push('Multiple passes help manage work hardening effects');
    }
    
    if (inputs.qualityRequirement === 'precision' || inputs.qualityRequirement === 'mirror') {
      reasons.push('Additional passes ensure high quality requirements are met');
    }
    
    return reasons;
  }

  private generatePassNotes(passNumber: number, totalPasses: number, strategy: string): string {
    if (passNumber === 1) {
      return 'Initial pass - establish cut path and remove bulk material';
    } else if (passNumber === totalPasses) {
      return 'Final pass - focus on quality and edge finish';
    } else {
      return `Intermediate pass ${passNumber} - progressive material removal`;
    }
  }

  private generateQualityFeatures(score: number, passCount: number, strategy: string): string[] {
    const features = [];
    
    if (score > 85) {
      features.push('Excellent edge quality');
      features.push('Minimal heat affected zone');
    }
    
    if (passCount >= 3) {
      features.push('Consistent kerf width');
      features.push('Controlled heat input');
    }
    
    if (strategy === 'quality_focused') {
      features.push('Superior surface finish');
      features.push('Precise dimensional accuracy');
    }
    
    features.push('Reduced thermal stress');
    features.push('Improved cut straightness');
    
    return features;
  }

  private predictPotentialIssues(passParameters: any[], inputs: MultiplePassInputs, material: typeof materialMultiPassProperties.steel): string[] {
    const issues = [];
    
    if (passParameters.length > 5) {
      issues.push('Multiple passes may cause heat accumulation');
    }
    
    if (inputs.thickness > 50) {
      issues.push('Very thick material may have kerf taper');
    }
    
    if (material.workHardening > 0.3) {
      issues.push('Material may work-harden between passes');
    }
    
    const powerVariation = Math.max(...passParameters.map(p => p.power)) - Math.min(...passParameters.map(p => p.power));
    if (powerVariation > 800) {
      issues.push('Large power variation may cause inconsistent results');
    }
    
    if (inputs.cuttingLength > 5000) {
      issues.push('Long cutting paths may accumulate thermal effects');
    }
    
    return issues;
  }

  private generateWarnings(inputs: MultiplePassInputs, passStrategy: any, material: typeof materialMultiPassProperties.steel): string[] {
    const warnings: string[] = [];
    
    if (passStrategy.totalPasses > 6) {
      warnings.push('High number of passes may reduce overall efficiency');
    }
    
    if (inputs.thickness > 75) {
      warnings.push('Extremely thick material - consider alternative cutting methods');
    }
    
    if (material.workHardening > 0.4) {
      warnings.push('High work-hardening material may require stress relief between passes');
    }
    
    if (inputs.maxLaserPower < inputs.thickness * 80) {
      warnings.push('Laser power may be insufficient for optimal multi-pass cutting');
    }
    
    if (inputs.cuttingStrategy === 'uniform' && inputs.qualityRequirement === 'mirror') {
      warnings.push('Uniform strategy may not achieve mirror finish - consider quality-focused approach');
    }
    
    return warnings;
  }

  getExampleInputs(): MultiplePassInputs {
    return {
      materialType: 'steel',
      thickness: 15,
      laserType: 'fiber',
      maxLaserPower: 3000,
      singlePassLimit: 8,
      cuttingStrategy: 'adaptive',
      qualityRequirement: 'standard',
      assistGas: 'oxygen',
      cuttingLength: 1000
    };
  }
}
