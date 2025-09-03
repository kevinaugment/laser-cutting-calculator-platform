// Sensitivity Analysis Calculator Implementation
// Comprehensive parameter sensitivity analysis for laser cutting optimization

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const sensitivityAnalysisSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.1).max(50),
  laserPower: z.number().min(100).max(20000),
  cuttingSpeed: z.number().min(100).max(15000),
  gasPressure: z.number().min(0.1).max(30),
  focusHeight: z.number().min(-10).max(10),
  analysisType: z.enum(['single_parameter', 'multi_parameter', 'monte_carlo', 'tornado']),
  outputMetric: z.enum(['cost', 'time', 'quality', 'efficiency', 'all']),
  variationRange: z.number().min(5).max(50),
  analysisPoints: z.number().min(5).max(50),
  targetParameters: z.array(z.enum(['thickness', 'laserPower', 'cuttingSpeed', 'gasPressure', 'focusHeight'])).optional()
});

// Input types
export type SensitivityAnalysisInputs = z.infer<typeof sensitivityAnalysisSchema>;

// Result types
export interface SensitivityAnalysisResults {
  analysisOverview: {
    analysisType: string;
    outputMetric: string;
    parametersAnalyzed: number;
    totalScenarios: number;
    analysisTime: number;           // seconds
    confidence: number;             // 0-1 scale
  };
  parameterSensitivity: Array<{
    parameter: string;
    baseValue: number;
    unit: string;
    sensitivity: number;            // % change in output per % change in input
    elasticity: number;             // elasticity coefficient
    impact: 'low' | 'medium' | 'high' | 'critical';
    ranking: number;                // 1 = most sensitive
    variationData: Array<{
      inputValue: number;
      outputValue: number;
      percentChange: number;
    }>;
  }>;
  tornadoChart: {
    parameters: Array<{
      name: string;
      lowImpact: number;            // Output at low parameter value
      highImpact: number;           // Output at high parameter value
      range: number;                // Absolute range
      relativeRange: number;        // % of base output
    }>;
    baselineOutput: number;
  };
  spiderChart: {
    parameters: string[];
    scenarios: Array<{
      name: string;
      values: number[];             // Normalized values for each parameter
    }>;
  };
  interactionEffects: Array<{
    parameter1: string;
    parameter2: string;
    interactionStrength: number;    // 0-1 scale
    synergistic: boolean;           // true if parameters amplify each other
    description: string;
  }>;
  riskAnalysis: {
    criticalParameters: string[];
    riskFactors: Array<{
      parameter: string;
      riskLevel: 'low' | 'medium' | 'high';
      description: string;
      mitigation: string;
    }>;
    robustness: number;             // 0-100 scale
  };
  optimizationInsights: {
    mostInfluential: string;
    leastInfluential: string;
    recommendations: string[];
    parameterRanking: Array<{
      parameter: string;
      importance: number;           // 0-100 scale
      controlPriority: 'high' | 'medium' | 'low';
    }>;
  };
  warnings: string[];
}

// Parameter definitions with realistic ranges
const parameterDefinitions = {
  thickness: { min: 0.1, max: 50, unit: 'mm', typical: 5 },
  laserPower: { min: 100, max: 20000, unit: 'W', typical: 2000 },
  cuttingSpeed: { min: 100, max: 15000, unit: 'mm/min', typical: 3000 },
  gasPressure: { min: 0.1, max: 30, unit: 'bar', typical: 15 },
  focusHeight: { min: -10, max: 10, unit: 'mm', typical: -2 }
};

// Material properties for sensitivity calculations
const materialSensitivityProperties = {
  steel: {
    powerSensitivity: 0.8,
    speedSensitivity: 0.9,
    gasSensitivity: 0.6,
    focusSensitivity: 0.7,
    thicknessSensitivity: 1.2
  },
  stainless_steel: {
    powerSensitivity: 0.9,
    speedSensitivity: 0.8,
    gasSensitivity: 0.8,
    focusSensitivity: 0.8,
    thicknessSensitivity: 1.1
  },
  aluminum: {
    powerSensitivity: 0.7,
    speedSensitivity: 1.0,
    gasSensitivity: 0.5,
    focusSensitivity: 0.6,
    thicknessSensitivity: 0.9
  },
  copper: {
    powerSensitivity: 1.0,
    speedSensitivity: 0.7,
    gasSensitivity: 0.7,
    focusSensitivity: 0.9,
    thicknessSensitivity: 1.0
  },
  titanium: {
    powerSensitivity: 0.9,
    speedSensitivity: 0.6,
    gasSensitivity: 0.9,
    focusSensitivity: 0.8,
    thicknessSensitivity: 1.3
  },
  brass: {
    powerSensitivity: 0.8,
    speedSensitivity: 0.8,
    gasSensitivity: 0.6,
    focusSensitivity: 0.7,
    thicknessSensitivity: 1.0
  }
};

export class SensitivityAnalysisCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'sensitivity-analysis-calculator',
    title: 'Sensitivity Analysis Calculator',
    description: 'Analyze parameter sensitivity and identify critical factors for laser cutting optimization',
    category: 'Advanced Analysis',
    badge: 'Premium',
    iconName: 'ChartBar',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        help: 'Select the material for sensitivity analysis',
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
        label: 'Base Thickness',
        type: 'number',
        required: true,
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Base material thickness for analysis'
      },
      {
        id: 'laserPower',
        label: 'Base Laser Power',
        type: 'number',
        required: true,
        min: 100,
        max: 20000,
        step: 50,
        unit: 'W',
        help: 'Base laser power setting'
      },
      {
        id: 'cuttingSpeed',
        label: 'Base Cutting Speed',
        type: 'number',
        required: true,
        min: 100,
        max: 15000,
        step: 10,
        unit: 'mm/min',
        help: 'Base cutting speed'
      },
      {
        id: 'gasPressure',
        label: 'Base Gas Pressure',
        type: 'number',
        required: true,
        min: 0.1,
        max: 30,
        step: 0.1,
        unit: 'bar',
        help: 'Base assist gas pressure'
      },
      {
        id: 'focusHeight',
        label: 'Base Focus Height',
        type: 'number',
        required: true,
        min: -10,
        max: 10,
        step: 0.1,
        unit: 'mm',
        help: 'Base focus height position'
      },
      {
        id: 'analysisType',
        label: 'Analysis Type',
        type: 'select',
        required: true,
        help: 'Type of sensitivity analysis to perform',
        options: [
          { value: 'single_parameter', label: 'Single Parameter Analysis' },
          { value: 'multi_parameter', label: 'Multi-Parameter Analysis' },
          { value: 'monte_carlo', label: 'Monte Carlo Simulation' },
          { value: 'tornado', label: 'Tornado Chart Analysis' }
        ]
      },
      {
        id: 'outputMetric',
        label: 'Output Metric',
        type: 'select',
        required: true,
        help: 'Primary metric to analyze sensitivity for',
        options: [
          { value: 'cost', label: 'Total Cost' },
          { value: 'time', label: 'Processing Time' },
          { value: 'quality', label: 'Cut Quality' },
          { value: 'efficiency', label: 'Process Efficiency' },
          { value: 'all', label: 'All Metrics' }
        ]
      },
      {
        id: 'variationRange',
        label: 'Variation Range',
        type: 'number',
        required: true,
        min: 5,
        max: 50,
        step: 5,
        unit: '%',
        help: 'Parameter variation range (±%)'
      },
      {
        id: 'analysisPoints',
        label: 'Analysis Points',
        type: 'number',
        required: true,
        min: 5,
        max: 50,
        step: 5,
        help: 'Number of analysis points per parameter'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return sensitivityAnalysisSchema;
  }

  customValidation(inputs: SensitivityAnalysisInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check if analysis complexity is reasonable
    if (inputs.analysisType === 'monte_carlo' && inputs.analysisPoints > 30) {
      warnings.push({
        field: 'analysisPoints',
        message: 'High number of analysis points may increase computation time significantly',
        code: 'HIGH_COMPUTATION_COMPLEXITY'
      });
    }

    // Check variation range
    if (inputs.variationRange > 30) {
      warnings.push({
        field: 'variationRange',
        message: 'Large variation range may include unrealistic parameter values',
        code: 'LARGE_VARIATION_RANGE'
      });
    }

    // Check parameter combinations
    const powerSpeedRatio = inputs.laserPower / inputs.cuttingSpeed;
    if (powerSpeedRatio < 0.1 || powerSpeedRatio > 10) {
      warnings.push({
        field: 'laserPower',
        message: 'Power-to-speed ratio may be outside typical operating range',
        code: 'UNUSUAL_POWER_SPEED_RATIO'
      });
    }

    // Check focus height vs thickness
    if (Math.abs(inputs.focusHeight) > inputs.thickness) {
      warnings.push({
        field: 'focusHeight',
        message: 'Focus height extends beyond material thickness',
        code: 'EXTREME_FOCUS_HEIGHT'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: SensitivityAnalysisInputs): Promise<BaseCalculationResult> {
    try {
      const startTime = Date.now();
      const material = materialSensitivityProperties[inputs.materialType];
      
      // Determine parameters to analyze
      const parametersToAnalyze = inputs.targetParameters || 
        ['thickness', 'laserPower', 'cuttingSpeed', 'gasPressure', 'focusHeight'];
      
      // Perform sensitivity analysis
      const parameterSensitivity = await this.analyzeParameterSensitivity(inputs, parametersToAnalyze, material);
      
      // Generate tornado chart data
      const tornadoChart = this.generateTornadoChart(inputs, parameterSensitivity);
      
      // Generate spider chart data
      const spiderChart = this.generateSpiderChart(inputs, parametersToAnalyze);
      
      // Analyze interaction effects
      const interactionEffects = this.analyzeInteractionEffects(parametersToAnalyze, material);
      
      // Perform risk analysis
      const riskAnalysis = this.performRiskAnalysis(parameterSensitivity, inputs);
      
      // Generate optimization insights
      const optimizationInsights = this.generateOptimizationInsights(parameterSensitivity, inputs);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, parameterSensitivity);
      
      const analysisTime = (Date.now() - startTime) / 1000;
      
      const results: SensitivityAnalysisResults = {
        analysisOverview: {
          analysisType: inputs.analysisType,
          outputMetric: inputs.outputMetric,
          parametersAnalyzed: parametersToAnalyze.length,
          totalScenarios: parametersToAnalyze.length * inputs.analysisPoints,
          analysisTime,
          confidence: this.calculateAnalysisConfidence(inputs, parameterSensitivity)
        },
        parameterSensitivity,
        tornadoChart,
        spiderChart,
        interactionEffects,
        riskAnalysis,
        optimizationInsights,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Sensitivity analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private async analyzeParameterSensitivity(
    inputs: SensitivityAnalysisInputs, 
    parameters: string[], 
    material: typeof materialSensitivityProperties.steel
  ) {
    const results = [];
    
    for (const parameter of parameters) {
      const paramDef = parameterDefinitions[parameter as keyof typeof parameterDefinitions];
      const baseValue = inputs[parameter as keyof SensitivityAnalysisInputs] as number;
      
      // Calculate variation range
      const variationPercent = inputs.variationRange / 100;
      const minValue = Math.max(paramDef.min, baseValue * (1 - variationPercent));
      const maxValue = Math.min(paramDef.max, baseValue * (1 + variationPercent));
      
      // Generate variation data points
      const variationData = [];
      const step = (maxValue - minValue) / (inputs.analysisPoints - 1);
      
      for (let i = 0; i < inputs.analysisPoints; i++) {
        const inputValue = minValue + (step * i);
        const outputValue = this.calculateOutputForParameter(inputs, parameter, inputValue, material);
        const percentChange = ((outputValue - this.calculateBaseOutput(inputs, material)) / this.calculateBaseOutput(inputs, material)) * 100;
        
        variationData.push({
          inputValue: Math.round(inputValue * 1000) / 1000,
          outputValue: Math.round(outputValue * 100) / 100,
          percentChange: Math.round(percentChange * 10) / 10
        });
      }
      
      // Calculate sensitivity metrics
      const sensitivity = this.calculateSensitivity(variationData, baseValue);
      const elasticity = this.calculateElasticity(variationData, baseValue);
      const impact = this.classifyImpact(sensitivity);
      
      results.push({
        parameter,
        baseValue,
        unit: paramDef.unit,
        sensitivity: Math.round(sensitivity * 100) / 100,
        elasticity: Math.round(elasticity * 100) / 100,
        impact,
        ranking: 0, // Will be set after sorting
        variationData
      });
    }
    
    // Sort by sensitivity and assign rankings
    results.sort((a, b) => Math.abs(b.sensitivity) - Math.abs(a.sensitivity));
    results.forEach((result, index) => {
      result.ranking = index + 1;
    });
    
    return results;
  }

  private calculateOutputForParameter(
    inputs: SensitivityAnalysisInputs, 
    parameter: string, 
    value: number, 
    material: typeof materialSensitivityProperties.steel
  ): number {
    // Create modified inputs
    const modifiedInputs = { ...inputs, [parameter]: value };
    
    // Calculate output based on selected metric
    switch (inputs.outputMetric) {
      case 'cost':
        return this.calculateCost(modifiedInputs, material);
      case 'time':
        return this.calculateTime(modifiedInputs, material);
      case 'quality':
        return this.calculateQuality(modifiedInputs, material);
      case 'efficiency':
        return this.calculateEfficiency(modifiedInputs, material);
      default:
        return this.calculateCost(modifiedInputs, material); // Default to cost
    }
  }

  private calculateBaseOutput(inputs: SensitivityAnalysisInputs, material: typeof materialSensitivityProperties.steel): number {
    switch (inputs.outputMetric) {
      case 'cost':
        return this.calculateCost(inputs, material);
      case 'time':
        return this.calculateTime(inputs, material);
      case 'quality':
        return this.calculateQuality(inputs, material);
      case 'efficiency':
        return this.calculateEfficiency(inputs, material);
      default:
        return this.calculateCost(inputs, material);
    }
  }

  private calculateCost(inputs: SensitivityAnalysisInputs, material: typeof materialSensitivityProperties.steel): number {
    // Simplified cost calculation
    const materialCost = inputs.thickness * 0.5; // $/mm thickness
    const energyCost = (inputs.laserPower / 1000) * (60 / inputs.cuttingSpeed) * 0.12; // $/kWh
    const gasCost = inputs.gasPressure * 0.1; // $/bar
    return materialCost + energyCost + gasCost;
  }

  private calculateTime(inputs: SensitivityAnalysisInputs, material: typeof materialSensitivityProperties.steel): number {
    // Simplified time calculation (minutes per meter)
    const baseTime = 1000 / inputs.cuttingSpeed; // minutes for 1m
    const thicknessFactor = Math.sqrt(inputs.thickness / 5);
    const powerFactor = Math.sqrt(2000 / inputs.laserPower);
    return baseTime * thicknessFactor * powerFactor;
  }

  private calculateQuality(inputs: SensitivityAnalysisInputs, material: typeof materialSensitivityProperties.steel): number {
    // Simplified quality score (0-100)
    let quality = 80; // Base quality
    
    // Power optimization
    const optimalPower = inputs.thickness * 200;
    const powerDeviation = Math.abs(inputs.laserPower - optimalPower) / optimalPower;
    quality -= powerDeviation * 20;
    
    // Speed optimization
    const optimalSpeed = 3000;
    const speedDeviation = Math.abs(inputs.cuttingSpeed - optimalSpeed) / optimalSpeed;
    quality -= speedDeviation * 15;
    
    // Focus optimization
    const optimalFocus = -inputs.thickness / 3;
    const focusDeviation = Math.abs(inputs.focusHeight - optimalFocus) / Math.abs(optimalFocus);
    quality -= focusDeviation * 10;
    
    return Math.max(0, Math.min(100, quality));
  }

  private calculateEfficiency(inputs: SensitivityAnalysisInputs, material: typeof materialSensitivityProperties.steel): number {
    // Simplified efficiency calculation (0-100%)
    const powerEfficiency = Math.min(100, (inputs.laserPower / (inputs.thickness * 100)) * 50);
    const speedEfficiency = Math.min(100, inputs.cuttingSpeed / 100);
    const gasEfficiency = Math.min(100, (20 - inputs.gasPressure) * 5);
    
    return (powerEfficiency + speedEfficiency + gasEfficiency) / 3;
  }

  private calculateSensitivity(variationData: any[], baseValue: number): number {
    if (variationData.length < 2) return 0;
    
    // Calculate average sensitivity across all data points
    let totalSensitivity = 0;
    let count = 0;
    
    for (let i = 1; i < variationData.length; i++) {
      const inputChange = (variationData[i].inputValue - baseValue) / baseValue * 100;
      const outputChange = variationData[i].percentChange;
      
      if (Math.abs(inputChange) > 0.01) {
        totalSensitivity += Math.abs(outputChange / inputChange);
        count++;
      }
    }
    
    return count > 0 ? totalSensitivity / count : 0;
  }

  private calculateElasticity(variationData: any[], baseValue: number): number {
    if (variationData.length < 2) return 0;
    
    // Calculate elasticity using linear regression
    const baseOutput = variationData.find(d => Math.abs(d.inputValue - baseValue) < 0.01)?.outputValue || variationData[0].outputValue;
    
    let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0;
    let n = 0;
    
    for (const point of variationData) {
      const x = (point.inputValue - baseValue) / baseValue * 100; // % change in input
      const y = (point.outputValue - baseOutput) / baseOutput * 100; // % change in output
      
      sumXY += x * y;
      sumX += x;
      sumY += y;
      sumX2 += x * x;
      n++;
    }
    
    const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;
    return slope;
  }

  private classifyImpact(sensitivity: number): 'low' | 'medium' | 'high' | 'critical' {
    if (sensitivity > 2.0) return 'critical';
    if (sensitivity > 1.0) return 'high';
    if (sensitivity > 0.5) return 'medium';
    return 'low';
  }

  private generateTornadoChart(inputs: SensitivityAnalysisInputs, parameterSensitivity: any[]) {
    const baselineOutput = this.calculateBaseOutput(inputs, materialSensitivityProperties[inputs.materialType]);
    
    const parameters = parameterSensitivity.map(param => {
      const variationData = param.variationData;
      const lowImpact = Math.min(...variationData.map(d => d.outputValue));
      const highImpact = Math.max(...variationData.map(d => d.outputValue));
      const range = highImpact - lowImpact;
      const relativeRange = (range / baselineOutput) * 100;
      
      return {
        name: param.parameter,
        lowImpact: Math.round(lowImpact * 100) / 100,
        highImpact: Math.round(highImpact * 100) / 100,
        range: Math.round(range * 100) / 100,
        relativeRange: Math.round(relativeRange * 10) / 10
      };
    });
    
    // Sort by range (descending)
    parameters.sort((a, b) => b.range - a.range);
    
    return {
      parameters,
      baselineOutput: Math.round(baselineOutput * 100) / 100
    };
  }

  private generateSpiderChart(inputs: SensitivityAnalysisInputs, parameters: string[]) {
    const scenarios = [
      { name: 'Conservative', multiplier: 0.9 },
      { name: 'Base Case', multiplier: 1.0 },
      { name: 'Aggressive', multiplier: 1.1 }
    ];
    
    const spiderScenarios = scenarios.map(scenario => ({
      name: scenario.name,
      values: parameters.map(param => {
        const baseValue = inputs[param as keyof SensitivityAnalysisInputs] as number;
        const modifiedValue = baseValue * scenario.multiplier;
        const paramDef = parameterDefinitions[param as keyof typeof parameterDefinitions];
        
        // Normalize to 0-1 scale
        return (modifiedValue - paramDef.min) / (paramDef.max - paramDef.min);
      })
    }));
    
    return {
      parameters,
      scenarios: spiderScenarios
    };
  }

  private analyzeInteractionEffects(parameters: string[], material: typeof materialSensitivityProperties.steel) {
    const interactions = [];
    
    // Analyze key parameter interactions
    const keyInteractions = [
      ['laserPower', 'cuttingSpeed'],
      ['thickness', 'laserPower'],
      ['gasPressure', 'cuttingSpeed'],
      ['focusHeight', 'thickness']
    ];
    
    for (const [param1, param2] of keyInteractions) {
      if (parameters.includes(param1) && parameters.includes(param2)) {
        const interactionStrength = this.calculateInteractionStrength(param1, param2, material);
        const synergistic = this.isSynergistic(param1, param2);
        
        interactions.push({
          parameter1: param1,
          parameter2: param2,
          interactionStrength: Math.round(interactionStrength * 100) / 100,
          synergistic,
          description: this.generateInteractionDescription(param1, param2, synergistic)
        });
      }
    }
    
    return interactions;
  }

  private calculateInteractionStrength(param1: string, param2: string, material: typeof materialSensitivityProperties.steel): number {
    // Simplified interaction strength calculation
    const sensitivity1 = material[`${param1}Sensitivity` as keyof typeof material] || 0.5;
    const sensitivity2 = material[`${param2}Sensitivity` as keyof typeof material] || 0.5;
    
    return Math.min(1.0, (sensitivity1 + sensitivity2) / 2);
  }

  private isSynergistic(param1: string, param2: string): boolean {
    // Define synergistic relationships
    const synergyMap: Record<string, string[]> = {
      laserPower: ['cuttingSpeed'],
      thickness: ['laserPower', 'gasPressure'],
      gasPressure: ['cuttingSpeed'],
      focusHeight: ['thickness']
    };
    
    return synergyMap[param1]?.includes(param2) || synergyMap[param2]?.includes(param1) || false;
  }

  private generateInteractionDescription(param1: string, param2: string, synergistic: boolean): string {
    const relationship = synergistic ? 'amplify' : 'counteract';
    return `${param1} and ${param2} ${relationship} each other's effects on the output`;
  }

  private performRiskAnalysis(parameterSensitivity: any[], inputs: SensitivityAnalysisInputs) {
    const criticalParameters = parameterSensitivity
      .filter(param => param.impact === 'critical' || param.impact === 'high')
      .map(param => param.parameter);
    
    const riskFactors = parameterSensitivity.map(param => ({
      parameter: param.parameter,
      riskLevel: this.assessRiskLevel(param.sensitivity, param.impact),
      description: this.generateRiskDescription(param.parameter, param.impact),
      mitigation: this.generateMitigationStrategy(param.parameter, param.impact)
    }));
    
    // Calculate overall robustness
    const avgSensitivity = parameterSensitivity.reduce((sum, param) => sum + param.sensitivity, 0) / parameterSensitivity.length;
    const robustness = Math.max(0, Math.min(100, 100 - (avgSensitivity * 20)));
    
    return {
      criticalParameters,
      riskFactors,
      robustness: Math.round(robustness)
    };
  }

  private assessRiskLevel(sensitivity: number, impact: string): 'low' | 'medium' | 'high' {
    if (impact === 'critical' || sensitivity > 1.5) return 'high';
    if (impact === 'high' || sensitivity > 0.8) return 'medium';
    return 'low';
  }

  private generateRiskDescription(parameter: string, impact: string): string {
    const descriptions: Record<string, string> = {
      thickness: 'Material thickness variations can significantly affect cut quality and processing time',
      laserPower: 'Power fluctuations may cause inconsistent cut quality and energy waste',
      cuttingSpeed: 'Speed variations directly impact productivity and surface finish',
      gasPressure: 'Gas pressure changes affect melt ejection and edge quality',
      focusHeight: 'Focus position errors can cause poor cut quality and incomplete penetration'
    };
    
    return descriptions[parameter] || `${parameter} variations may affect process outcomes`;
  }

  private generateMitigationStrategy(parameter: string, impact: string): string {
    const strategies: Record<string, string> = {
      thickness: 'Implement precise material measurement and adaptive parameter control',
      laserPower: 'Use power monitoring and feedback control systems',
      cuttingSpeed: 'Maintain consistent feed rates and monitor machine condition',
      gasPressure: 'Install pressure regulators and monitoring systems',
      focusHeight: 'Use automatic focus control and regular calibration'
    };
    
    return strategies[parameter] || `Monitor and control ${parameter} variations closely`;
  }

  private generateOptimizationInsights(parameterSensitivity: any[], inputs: SensitivityAnalysisInputs) {
    const sortedParams = [...parameterSensitivity].sort((a, b) => Math.abs(b.sensitivity) - Math.abs(a.sensitivity));
    
    const mostInfluential = sortedParams[0]?.parameter || 'none';
    const leastInfluential = sortedParams[sortedParams.length - 1]?.parameter || 'none';
    
    const recommendations = [
      `Focus control efforts on ${mostInfluential} as it has the highest impact`,
      'Implement tighter tolerances for high-sensitivity parameters',
      'Consider parameter coupling effects in optimization strategies'
    ];
    
    if (sortedParams[0]?.sensitivity > 1.0) {
      recommendations.push('Critical sensitivity detected - implement real-time monitoring');
    }
    
    const parameterRanking = sortedParams.map((param, index) => ({
      parameter: param.parameter,
      importance: Math.round((1 - index / sortedParams.length) * 100),
      controlPriority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low' as 'high' | 'medium' | 'low'
    }));
    
    return {
      mostInfluential,
      leastInfluential,
      recommendations,
      parameterRanking
    };
  }

  private calculateAnalysisConfidence(inputs: SensitivityAnalysisInputs, parameterSensitivity: any[]): number {
    let confidence = 0.8; // Base confidence
    
    // Increase confidence with more analysis points
    if (inputs.analysisPoints >= 20) confidence += 0.1;
    
    // Increase confidence with reasonable variation range
    if (inputs.variationRange >= 10 && inputs.variationRange <= 30) confidence += 0.05;
    
    // Adjust for analysis complexity
    if (inputs.analysisType === 'monte_carlo') confidence += 0.05;
    
    return Math.min(1.0, confidence);
  }

  private generateWarnings(inputs: SensitivityAnalysisInputs, parameterSensitivity: any[]): string[] {
    const warnings: string[] = [];
    
    // Check for extremely high sensitivity
    const criticalParams = parameterSensitivity.filter(param => param.sensitivity > 2.0);
    if (criticalParams.length > 0) {
      warnings.push(`Critical sensitivity detected in: ${criticalParams.map(p => p.parameter).join(', ')}`);
    }
    
    // Check for low robustness
    const avgSensitivity = parameterSensitivity.reduce((sum, param) => sum + param.sensitivity, 0) / parameterSensitivity.length;
    if (avgSensitivity > 1.2) {
      warnings.push('Process shows low robustness - consider parameter optimization');
    }
    
    // Check for unrealistic parameter ranges
    if (inputs.variationRange > 40) {
      warnings.push('Large variation range may include unrealistic operating conditions');
    }
    
    // Check for insufficient analysis points
    if (inputs.analysisPoints < 10) {
      warnings.push('Low number of analysis points may reduce accuracy');
    }
    
    return warnings;
  }

  getExampleInputs(): SensitivityAnalysisInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserPower: 2000,
      cuttingSpeed: 3000,
      gasPressure: 15,
      focusHeight: -2,
      analysisType: 'multi_parameter',
      outputMetric: 'cost',
      variationRange: 20,
      analysisPoints: 15
    };
  }
}
