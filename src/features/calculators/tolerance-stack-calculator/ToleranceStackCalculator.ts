// Tolerance Stack Calculator Implementation
// Comprehensive tolerance stack analysis and dimensional accuracy control

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const toleranceStackSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  partComplexity: z.enum(['simple', 'moderate', 'complex', 'highly_complex']),
  numberOfFeatures: z.number().min(1).max(50),
  overallDimension: z.number().min(1).max(1000),
  criticalDimension: z.number().min(0.1).max(500),
  toleranceClass: z.enum(['rough', 'standard', 'precision', 'ultra_precision']),
  assemblyRequirement: z.enum(['none', 'loose_fit', 'standard_fit', 'precision_fit', 'interference_fit']),
  measurementMethod: z.enum(['manual', 'cmm', 'optical', 'laser_scanning']),
  environmentalConditions: z.enum(['controlled', 'workshop', 'field', 'harsh']).optional().default('workshop')
});

// Input types
export type ToleranceStackInputs = z.infer<typeof toleranceStackSchema>;

// Result types
export interface ToleranceStackResults {
  toleranceAnalysis: {
    totalStackup: number;           // mm
    worstCaseStackup: number;       // mm
    statisticalStackup: number;     // mm
    stackupMethod: string;
    confidenceLevel: number;        // %
  };
  dimensionalChain: {
    chainLength: number;            // mm
    contributingDimensions: number;
    criticalPath: string[];
    weakestLink: string;
    chainEfficiency: number;        // 0-1 scale
  };
  accuracyPrediction: {
    expectedAccuracy: number;       // mm
    achievableAccuracy: number;     // mm
    accuracyGrade: 'excellent' | 'good' | 'acceptable' | 'poor';
    processCapability: number;      // Cp value
    yieldPrediction: number;        // %
  };
  toleranceAllocation: {
    featureTolerance: number;       // mm per feature
    cumulativeError: number;        // mm
    safetyFactor: number;
    allocationStrategy: string;
    optimizationPotential: number;  // %
  };
  qualityControl: {
    measurementUncertainty: number; // mm
    inspectionStrategy: string;
    samplingPlan: string;
    controlLimits: {
      upper: number;                // mm
      lower: number;                // mm
    };
    spcRecommendations: string[];
  };
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;              // 0-10 scale
    riskFactors: string[];
    mitigationStrategies: string[];
  };
  recommendations: string[];
  warnings: string[];
}

// Material tolerance characteristics
const materialToleranceProperties = {
  steel: {
    thermalStability: 0.8,
    machiningAccuracy: 0.9,
    dimensionalStability: 0.85,
    thermalExpansion: 12e-6,
    achievableAccuracy: 0.02
  },
  stainless_steel: {
    thermalStability: 0.7,
    machiningAccuracy: 0.8,
    dimensionalStability: 0.8,
    thermalExpansion: 17e-6,
    achievableAccuracy: 0.025
  },
  aluminum: {
    thermalStability: 0.6,
    machiningAccuracy: 0.85,
    dimensionalStability: 0.7,
    thermalExpansion: 23e-6,
    achievableAccuracy: 0.03
  },
  copper: {
    thermalStability: 0.65,
    machiningAccuracy: 0.75,
    dimensionalStability: 0.75,
    thermalExpansion: 17e-6,
    achievableAccuracy: 0.035
  },
  titanium: {
    thermalStability: 0.9,
    machiningAccuracy: 0.7,
    dimensionalStability: 0.9,
    thermalExpansion: 8.6e-6,
    achievableAccuracy: 0.04
  },
  brass: {
    thermalStability: 0.75,
    machiningAccuracy: 0.8,
    dimensionalStability: 0.8,
    thermalExpansion: 19e-6,
    achievableAccuracy: 0.03
  }
};

// Tolerance class specifications
const toleranceClassSpecs = {
  rough: {
    baseAccuracy: 0.2,
    multiplier: 2.0,
    processCapability: 1.0,
    description: 'General purpose cutting'
  },
  standard: {
    baseAccuracy: 0.1,
    multiplier: 1.5,
    processCapability: 1.33,
    description: 'Standard manufacturing'
  },
  precision: {
    baseAccuracy: 0.05,
    multiplier: 1.0,
    processCapability: 1.67,
    description: 'Precision manufacturing'
  },
  ultra_precision: {
    baseAccuracy: 0.02,
    multiplier: 0.5,
    processCapability: 2.0,
    description: 'Ultra-precision manufacturing'
  }
};

// Assembly fit requirements
const assemblyFitSpecs = {
  none: { clearance: 0, tolerance: 0.1, description: 'No assembly requirement' },
  loose_fit: { clearance: 0.1, tolerance: 0.05, description: 'Loose clearance fit' },
  standard_fit: { clearance: 0.05, tolerance: 0.02, description: 'Standard clearance fit' },
  precision_fit: { clearance: 0.01, tolerance: 0.01, description: 'Precision clearance fit' },
  interference_fit: { clearance: -0.01, tolerance: 0.005, description: 'Interference fit' }
};

export class ToleranceStackCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'tolerance-stack-calculator',
    title: 'Tolerance Stack Calculator',
    description: 'Analyze tolerance stackup and dimensional accuracy for precision manufacturing',
    category: 'Quality Control',
    badge: 'Standard',
    iconName: 'Target',
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
        id: 'partComplexity',
        label: 'Part Complexity',
        type: 'select',
        required: true,
        help: 'Complexity level of the part geometry',
        options: [
          { value: 'simple', label: 'Simple (Basic shapes)' },
          { value: 'moderate', label: 'Moderate (Multiple features)' },
          { value: 'complex', label: 'Complex (Intricate geometry)' },
          { value: 'highly_complex', label: 'Highly Complex (Precision assembly)' }
        ]
      },
      {
        id: 'numberOfFeatures',
        label: 'Number of Features',
        type: 'number',
        required: true,
        min: 1,
        max: 50,
        step: 1,
        unit: 'features',
        help: 'Total number of dimensional features'
      },
      {
        id: 'overallDimension',
        label: 'Overall Dimension',
        type: 'number',
        required: true,
        min: 1,
        max: 1000,
        step: 0.1,
        unit: 'mm',
        help: 'Overall part dimension'
      },
      {
        id: 'criticalDimension',
        label: 'Critical Dimension',
        type: 'number',
        required: true,
        min: 0.1,
        max: 500,
        step: 0.01,
        unit: 'mm',
        help: 'Most critical dimension for functionality'
      },
      {
        id: 'toleranceClass',
        label: 'Tolerance Class',
        type: 'select',
        required: true,
        help: 'Required tolerance class',
        options: [
          { value: 'rough', label: 'Rough (±0.2mm)' },
          { value: 'standard', label: 'Standard (±0.1mm)' },
          { value: 'precision', label: 'Precision (±0.05mm)' },
          { value: 'ultra_precision', label: 'Ultra Precision (±0.02mm)' }
        ]
      },
      {
        id: 'assemblyRequirement',
        label: 'Assembly Requirement',
        type: 'select',
        required: true,
        help: 'Type of assembly fit required',
        options: [
          { value: 'none', label: 'No Assembly' },
          { value: 'loose_fit', label: 'Loose Fit' },
          { value: 'standard_fit', label: 'Standard Fit' },
          { value: 'precision_fit', label: 'Precision Fit' },
          { value: 'interference_fit', label: 'Interference Fit' }
        ]
      },
      {
        id: 'measurementMethod',
        label: 'Measurement Method',
        type: 'select',
        required: true,
        help: 'Method used for dimensional measurement',
        options: [
          { value: 'manual', label: 'Manual Measurement' },
          { value: 'cmm', label: 'Coordinate Measuring Machine' },
          { value: 'optical', label: 'Optical Measurement' },
          { value: 'laser_scanning', label: 'Laser Scanning' }
        ]
      },
      {
        id: 'environmentalConditions',
        label: 'Environmental Conditions',
        type: 'select',
        required: false,
        help: 'Operating environmental conditions',
        options: [
          { value: 'controlled', label: 'Controlled Environment' },
          { value: 'workshop', label: 'Workshop Environment' },
          { value: 'field', label: 'Field Conditions' },
          { value: 'harsh', label: 'Harsh Environment' }
        ]
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return toleranceStackSchema;
  }

  customValidation(inputs: ToleranceStackInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check if critical dimension is reasonable relative to overall dimension
    const dimensionRatio = inputs.criticalDimension / inputs.overallDimension;
    if (dimensionRatio > 0.8) {
      warnings.push({
        field: 'criticalDimension',
        message: 'Critical dimension is very large relative to overall dimension. Consider if this is correct.',
        code: 'LARGE_CRITICAL_DIMENSION'
      });
    }

    // Check tolerance class vs part complexity
    if (inputs.partComplexity === 'highly_complex' && inputs.toleranceClass === 'rough') {
      warnings.push({
        field: 'toleranceClass',
        message: 'Rough tolerance may not be suitable for highly complex parts',
        code: 'TOLERANCE_COMPLEXITY_MISMATCH'
      });
    }

    // Check number of features vs complexity
    const expectedFeatures = {
      simple: [1, 5],
      moderate: [3, 15],
      complex: [10, 30],
      highly_complex: [20, 50]
    };
    
    const [minFeatures, maxFeatures] = expectedFeatures[inputs.partComplexity];
    if (inputs.numberOfFeatures < minFeatures || inputs.numberOfFeatures > maxFeatures) {
      warnings.push({
        field: 'numberOfFeatures',
        message: `Number of features (${inputs.numberOfFeatures}) seems inconsistent with ${inputs.partComplexity} complexity`,
        code: 'FEATURES_COMPLEXITY_MISMATCH'
      });
    }

    // Check measurement method vs tolerance class
    if (inputs.toleranceClass === 'ultra_precision' && inputs.measurementMethod === 'manual') {
      warnings.push({
        field: 'measurementMethod',
        message: 'Manual measurement may not be adequate for ultra-precision tolerance class',
        code: 'MEASUREMENT_PRECISION_MISMATCH'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: ToleranceStackInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialToleranceProperties[inputs.materialType];
      const toleranceSpec = toleranceClassSpecs[inputs.toleranceClass];
      const assemblySpec = assemblyFitSpecs[inputs.assemblyRequirement];
      
      // Analyze tolerance stackup
      const toleranceAnalysis = this.analyzeToleranceStackup(inputs, material, toleranceSpec);
      
      // Analyze dimensional chain
      const dimensionalChain = this.analyzeDimensionalChain(inputs, material);
      
      // Predict accuracy
      const accuracyPrediction = this.predictAccuracy(inputs, material, toleranceSpec);
      
      // Calculate tolerance allocation
      const toleranceAllocation = this.calculateToleranceAllocation(inputs, toleranceSpec, assemblySpec);
      
      // Assess quality control requirements
      const qualityControl = this.assessQualityControl(inputs, toleranceSpec);
      
      // Assess risks
      const riskAssessment = this.assessRisks(inputs, material, toleranceAnalysis, accuracyPrediction);
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, riskAssessment, accuracyPrediction);
      const warnings = this.generateWarnings(inputs, riskAssessment, accuracyPrediction);

      const results: ToleranceStackResults = {
        toleranceAnalysis,
        dimensionalChain,
        accuracyPrediction,
        toleranceAllocation,
        qualityControl,
        riskAssessment,
        recommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Tolerance stack calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private analyzeToleranceStackup(inputs: ToleranceStackInputs, material: typeof materialToleranceProperties.steel, toleranceSpec: typeof toleranceClassSpecs.standard) {
    // Calculate individual feature tolerance
    const featureTolerance = toleranceSpec.baseAccuracy * toleranceSpec.multiplier;
    
    // Worst case stackup (arithmetic sum)
    const worstCaseStackup = inputs.numberOfFeatures * featureTolerance;
    
    // Statistical stackup (RSS - Root Sum of Squares)
    const statisticalStackup = Math.sqrt(inputs.numberOfFeatures) * featureTolerance;
    
    // Total stackup (considering material and environmental factors)
    const materialFactor = 1 + (1 - material.dimensionalStability) * 0.5;
    const environmentalFactor = this.getEnvironmentalFactor(inputs.environmentalConditions);
    const totalStackup = statisticalStackup * materialFactor * environmentalFactor;
    
    // Determine stackup method
    const stackupMethod = inputs.numberOfFeatures > 10 ? 'Statistical (RSS)' : 'Worst Case';
    
    // Confidence level
    const confidenceLevel = inputs.numberOfFeatures > 10 ? 99.7 : 100; // 3-sigma for statistical
    
    return {
      totalStackup: Math.round(totalStackup * 1000) / 1000,
      worstCaseStackup: Math.round(worstCaseStackup * 1000) / 1000,
      statisticalStackup: Math.round(statisticalStackup * 1000) / 1000,
      stackupMethod,
      confidenceLevel
    };
  }

  private getEnvironmentalFactor(conditions: string): number {
    const factors = {
      controlled: 1.0,
      workshop: 1.1,
      field: 1.3,
      harsh: 1.5
    };
    return factors[conditions] || 1.1;
  }

  private analyzeDimensionalChain(inputs: ToleranceStackInputs, material: typeof materialToleranceProperties.steel) {
    // Chain length (simplified as overall dimension)
    const chainLength = inputs.overallDimension;
    
    // Contributing dimensions
    const contributingDimensions = Math.min(inputs.numberOfFeatures, Math.ceil(chainLength / 10));
    
    // Critical path (simplified)
    const criticalPath = [
      'Primary datum',
      'Critical feature location',
      'Assembly interface',
      'Final dimension'
    ].slice(0, Math.min(4, contributingDimensions));
    
    // Weakest link
    const weakestLink = material.machiningAccuracy < 0.8 ? 'Material machining accuracy' : 
                       inputs.partComplexity === 'highly_complex' ? 'Complex geometry tolerance' :
                       'Standard manufacturing tolerance';
    
    // Chain efficiency
    const complexityPenalty = { simple: 0, moderate: 0.1, complex: 0.2, highly_complex: 0.3 };
    const chainEfficiency = Math.max(0.5, 1 - complexityPenalty[inputs.partComplexity] - (1 - material.dimensionalStability) * 0.3);
    
    return {
      chainLength: Math.round(chainLength * 100) / 100,
      contributingDimensions,
      criticalPath,
      weakestLink,
      chainEfficiency: Math.round(chainEfficiency * 1000) / 1000
    };
  }

  private predictAccuracy(inputs: ToleranceStackInputs, material: typeof materialToleranceProperties.steel, toleranceSpec: typeof toleranceClassSpecs.standard) {
    // Base expected accuracy
    const baseAccuracy = toleranceSpec.baseAccuracy;
    
    // Material effect
    const materialEffect = material.achievableAccuracy;
    
    // Complexity effect
    const complexityMultiplier = { simple: 1.0, moderate: 1.2, complex: 1.5, highly_complex: 2.0 };
    const complexityEffect = complexityMultiplier[inputs.partComplexity];
    
    // Expected accuracy
    const expectedAccuracy = Math.max(baseAccuracy, materialEffect * complexityEffect);
    
    // Achievable accuracy (more conservative)
    const achievableAccuracy = expectedAccuracy * 1.5;
    
    // Accuracy grade
    let accuracyGrade: 'excellent' | 'good' | 'acceptable' | 'poor';
    if (expectedAccuracy <= toleranceSpec.baseAccuracy * 0.5) accuracyGrade = 'excellent';
    else if (expectedAccuracy <= toleranceSpec.baseAccuracy) accuracyGrade = 'good';
    else if (expectedAccuracy <= toleranceSpec.baseAccuracy * 2) accuracyGrade = 'acceptable';
    else accuracyGrade = 'poor';
    
    // Process capability
    const processCapability = toleranceSpec.processCapability * material.machiningAccuracy;
    
    // Yield prediction
    const yieldPrediction = Math.max(70, 100 - (expectedAccuracy / toleranceSpec.baseAccuracy - 1) * 30);
    
    return {
      expectedAccuracy: Math.round(expectedAccuracy * 1000) / 1000,
      achievableAccuracy: Math.round(achievableAccuracy * 1000) / 1000,
      accuracyGrade,
      processCapability: Math.round(processCapability * 100) / 100,
      yieldPrediction: Math.round(yieldPrediction)
    };
  }

  private calculateToleranceAllocation(inputs: ToleranceStackInputs, toleranceSpec: typeof toleranceClassSpecs.standard, assemblySpec: typeof assemblyFitSpecs.standard_fit) {
    // Feature tolerance allocation
    const totalToleranceBudget = toleranceSpec.baseAccuracy;
    const featureTolerance = totalToleranceBudget / Math.sqrt(inputs.numberOfFeatures);
    
    // Cumulative error estimation
    const cumulativeError = featureTolerance * Math.sqrt(inputs.numberOfFeatures);
    
    // Safety factor
    const safetyFactor = assemblySpec.tolerance > 0 ? 1.5 : 2.0;
    
    // Allocation strategy
    const allocationStrategy = inputs.numberOfFeatures > 10 ? 
      'Statistical allocation with equal distribution' :
      'Worst-case allocation with critical feature priority';
    
    // Optimization potential
    const optimizationPotential = Math.min(50, (cumulativeError / totalToleranceBudget - 1) * 100);
    
    return {
      featureTolerance: Math.round(featureTolerance * 1000) / 1000,
      cumulativeError: Math.round(cumulativeError * 1000) / 1000,
      safetyFactor: Math.round(safetyFactor * 100) / 100,
      allocationStrategy,
      optimizationPotential: Math.round(Math.max(0, optimizationPotential))
    };
  }

  private assessQualityControl(inputs: ToleranceStackInputs, toleranceSpec: typeof toleranceClassSpecs.standard) {
    // Measurement uncertainty
    const measurementUncertainties = {
      manual: 0.05,
      cmm: 0.002,
      optical: 0.001,
      laser_scanning: 0.005
    };
    const measurementUncertainty = measurementUncertainties[inputs.measurementMethod];
    
    // Inspection strategy
    const inspectionStrategy = toleranceSpec.baseAccuracy <= 0.05 ? 
      '100% inspection with statistical process control' :
      'Sampling inspection with periodic verification';
    
    // Sampling plan
    const samplingPlan = inputs.numberOfFeatures > 20 ? 
      'AQL 1.0 with reduced inspection' :
      'Normal inspection with AQL 2.5';
    
    // Control limits
    const controlRange = toleranceSpec.baseAccuracy * 0.6; // ±3σ
    const upper = controlRange / 2;
    const lower = -controlRange / 2;
    
    // SPC recommendations
    const spcRecommendations = [
      'Implement X-bar and R charts for dimensional control',
      'Monitor process capability indices (Cp, Cpk)',
      'Establish control limits based on process variation'
    ];
    
    if (toleranceSpec.baseAccuracy <= 0.05) {
      spcRecommendations.push('Use pre-control charts for tight tolerances');
      spcRecommendations.push('Implement real-time SPC monitoring');
    }
    
    return {
      measurementUncertainty: Math.round(measurementUncertainty * 1000) / 1000,
      inspectionStrategy,
      samplingPlan,
      controlLimits: {
        upper: Math.round(upper * 1000) / 1000,
        lower: Math.round(lower * 1000) / 1000
      },
      spcRecommendations
    };
  }

  private assessRisks(inputs: ToleranceStackInputs, material: typeof materialToleranceProperties.steel, toleranceAnalysis: any, accuracyPrediction: any) {
    // Calculate risk score
    let riskScore = 0;
    
    // Complexity risk
    const complexityRisk = { simple: 1, moderate: 3, complex: 6, highly_complex: 8 };
    riskScore += complexityRisk[inputs.partComplexity];
    
    // Material risk
    riskScore += (1 - material.dimensionalStability) * 3;
    
    // Tolerance risk
    if (toleranceAnalysis.totalStackup > accuracyPrediction.achievableAccuracy * 2) {
      riskScore += 3;
    }
    
    // Assembly risk
    if (inputs.assemblyRequirement === 'interference_fit' || inputs.assemblyRequirement === 'precision_fit') {
      riskScore += 2;
    }
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore <= 3) riskLevel = 'low';
    else if (riskScore <= 6) riskLevel = 'medium';
    else if (riskScore <= 9) riskLevel = 'high';
    else riskLevel = 'critical';
    
    // Risk factors
    const riskFactors: string[] = [];
    if (inputs.partComplexity === 'highly_complex') {
      riskFactors.push('High part complexity increases tolerance accumulation');
    }
    if (material.dimensionalStability < 0.8) {
      riskFactors.push('Material has poor dimensional stability');
    }
    if (inputs.numberOfFeatures > 30) {
      riskFactors.push('Large number of features increases stackup risk');
    }
    if (inputs.assemblyRequirement === 'interference_fit') {
      riskFactors.push('Interference fit requires very tight tolerances');
    }
    
    // Mitigation strategies
    const mitigationStrategies: string[] = [
      'Implement statistical process control',
      'Use coordinate measuring machine for verification',
      'Establish process capability studies'
    ];
    
    if (riskLevel === 'high' || riskLevel === 'critical') {
      mitigationStrategies.push('Consider design for manufacturability review');
      mitigationStrategies.push('Implement 100% inspection for critical dimensions');
    }
    
    return {
      riskLevel,
      riskScore: Math.round(riskScore * 10) / 10,
      riskFactors,
      mitigationStrategies
    };
  }

  private generateRecommendations(inputs: ToleranceStackInputs, riskAssessment: any, accuracyPrediction: any): string[] {
    const recommendations: string[] = [];
    
    if (riskAssessment.riskLevel === 'critical') {
      recommendations.push('Critical tolerance risk - review design and manufacturing approach');
    }
    
    if (accuracyPrediction.accuracyGrade === 'poor') {
      recommendations.push('Consider relaxing tolerance requirements or improving process capability');
    }
    
    if (inputs.partComplexity === 'highly_complex' && inputs.toleranceClass === 'ultra_precision') {
      recommendations.push('Consider staged manufacturing approach for complex precision parts');
    }
    
    if (inputs.measurementMethod === 'manual' && inputs.toleranceClass === 'precision') {
      recommendations.push('Upgrade to coordinate measuring machine for precision measurement');
    }
    
    if (inputs.numberOfFeatures > 20) {
      recommendations.push('Implement statistical tolerance analysis for multi-feature parts');
    }
    
    if (inputs.assemblyRequirement !== 'none') {
      recommendations.push('Coordinate tolerance allocation with mating part requirements');
    }
    
    return recommendations;
  }

  private generateWarnings(inputs: ToleranceStackInputs, riskAssessment: any, accuracyPrediction: any): string[] {
    const warnings: string[] = [];
    
    if (riskAssessment.riskLevel === 'critical') {
      warnings.push('Critical tolerance stackup risk - parts may not meet assembly requirements');
    }
    
    if (riskAssessment.riskLevel === 'high') {
      warnings.push('High tolerance risk - implement strict process control');
    }
    
    if (accuracyPrediction.yieldPrediction < 80) {
      warnings.push('Low yield prediction - expect significant scrap or rework');
    }
    
    if (inputs.environmentalConditions === 'harsh' && inputs.toleranceClass === 'ultra_precision') {
      warnings.push('Harsh environment may compromise ultra-precision tolerances');
    }
    
    if (accuracyPrediction.processCapability < 1.33) {
      warnings.push('Process capability below acceptable level - improve process control');
    }
    
    return warnings;
  }

  getExampleInputs(): ToleranceStackInputs {
    return {
      materialType: 'steel',
      partComplexity: 'moderate',
      numberOfFeatures: 8,
      overallDimension: 100,
      criticalDimension: 25,
      toleranceClass: 'precision',
      assemblyRequirement: 'standard_fit',
      measurementMethod: 'cmm',
      environmentalConditions: 'workshop'
    };
  }
}
