// Frequency Setting Assistant Implementation
// Comprehensive pulse frequency optimization for laser cutting precision

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const frequencySettingSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.1).max(50),
  laserType: z.enum(['fiber', 'co2', 'nd_yag', 'diode']),
  laserPower: z.number().min(50).max(20000),
  cuttingSpeed: z.number().min(100).max(15000),
  cuttingMode: z.enum(['continuous', 'pulsed', 'modulated']),
  qualityPriority: z.enum(['speed', 'balanced', 'precision', 'minimal_heat']),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  currentFrequency: z.number().min(0).max(50000).optional()
});

// Input types
export type FrequencySettingInputs = z.infer<typeof frequencySettingSchema>;

// Result types
export interface FrequencySettingResults {
  optimalFrequency: {
    value: number;                  // Hz (0 = CW)
    unit: string;
    mode: string;
    reasoning: string[];
    confidence: number;             // 0-1 scale
    range: {
      minimum: number;              // Hz
      maximum: number;              // Hz
      tolerance: number;            // ±Hz
    };
  };
  pulseCharacteristics: {
    pulseDuration: number;          // μs
    pulseEnergy: number;            // mJ
    peakPower: number;              // W
    averagePower: number;           // W
    dutyCycle: number;              // %
    repetitionRate: number;         // Hz
  };
  materialResponse: {
    heatAffectedZone: {
      width: number;                // mm
      quality: 'excellent' | 'good' | 'fair' | 'poor';
    };
    cutQuality: {
      score: number;                // 0-100
      edgeQuality: 'excellent' | 'good' | 'fair' | 'poor';
      expectedFeatures: string[];
    };
    processingEfficiency: {
      overall: number;              // %
      energyUtilization: number;    // %
      materialRemovalRate: number;  // %
    };
  };
  frequencyOptimization: {
    currentVsOptimal: {
      improvement: number;          // % improvement
      qualityGain: number;          // % quality gain
      efficiencyGain: number;       // % efficiency gain
      heatReduction: number;        // % HAZ reduction
    };
    alternativeFrequencies: Array<{
      name: string;
      frequency: number;            // Hz
      application: string;
      tradeoff: string;
      suitability: number;          // 1-10 scale
    }>;
  };
  processRecommendations: {
    frequencyAdjustments: string[];
    pulseOptimizations: string[];
    qualityImprovements: string[];
    troubleshooting: Array<{
      issue: string;
      cause: string;
      solution: string;
    }>;
  };
  warnings: string[];
}

// Base frequencies by material and laser type
const baseFrequencies = {
  steel: { fiber: 20000, co2: 5000, nd_yag: 15000, diode: 10000 },
  stainless_steel: { fiber: 20000, co2: 5000, nd_yag: 15000, diode: 10000 },
  aluminum: { fiber: 20000, co2: 2000, nd_yag: 15000, diode: 8000 },
  copper: { fiber: 20000, co2: 1000, nd_yag: 12000, diode: 6000 },
  titanium: { fiber: 15000, co2: 3000, nd_yag: 12000, diode: 8000 },
  brass: { fiber: 18000, co2: 2000, nd_yag: 12000, diode: 8000 }
};

// Material thermal properties for frequency optimization
const materialThermalProperties = {
  steel: {
    thermalConductivity: 50,
    meltingPoint: 1538,
    vaporization: 2862,
    absorptivity: 0.85,
    optimalPulseDuration: 100
  },
  stainless_steel: {
    thermalConductivity: 16,
    meltingPoint: 1400,
    vaporization: 2900,
    absorptivity: 0.75,
    optimalPulseDuration: 120
  },
  aluminum: {
    thermalConductivity: 237,
    meltingPoint: 660,
    vaporization: 2519,
    absorptivity: 0.65,
    optimalPulseDuration: 80
  },
  copper: {
    thermalConductivity: 401,
    meltingPoint: 1085,
    vaporization: 2562,
    absorptivity: 0.60,
    optimalPulseDuration: 60
  },
  titanium: {
    thermalConductivity: 22,
    meltingPoint: 1668,
    vaporization: 3287,
    absorptivity: 0.80,
    optimalPulseDuration: 150
  },
  brass: {
    thermalConductivity: 120,
    meltingPoint: 900,
    vaporization: 2562,
    absorptivity: 0.70,
    optimalPulseDuration: 90
  }
};

export class FrequencySettingAssistant extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'frequency-setting-assistant',
    title: 'Frequency Setting Assistant',
    description: 'Optimize pulse frequency for precision laser cutting and heat control',
    category: 'Process Optimization',
    badge: 'Standard',
    iconName: 'Zap',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        help: 'Select the material to be processed',
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
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Thickness of the material'
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
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 50,
        max: 20000,
        step: 50,
        unit: 'W',
        help: 'Available laser power'
      },
      {
        id: 'cuttingSpeed',
        label: 'Cutting Speed',
        type: 'number',
        required: true,
        min: 100,
        max: 15000,
        step: 10,
        unit: 'mm/min',
        help: 'Desired cutting speed'
      },
      {
        id: 'cuttingMode',
        label: 'Cutting Mode',
        type: 'select',
        required: true,
        help: 'Laser operation mode',
        options: [
          { value: 'continuous', label: 'Continuous Wave (CW)' },
          { value: 'pulsed', label: 'Pulsed Mode' },
          { value: 'modulated', label: 'Modulated CW' }
        ]
      },
      {
        id: 'qualityPriority',
        label: 'Quality Priority',
        type: 'select',
        required: true,
        help: 'Primary optimization objective',
        options: [
          { value: 'speed', label: 'Maximum Speed' },
          { value: 'balanced', label: 'Balanced Performance' },
          { value: 'precision', label: 'Precision Quality' },
          { value: 'minimal_heat', label: 'Minimal Heat Effects' }
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
        id: 'currentFrequency',
        label: 'Current Frequency (Optional)',
        type: 'number',
        required: false,
        min: 0,
        max: 50000,
        step: 100,
        unit: 'Hz',
        help: 'Current frequency setting for comparison'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return frequencySettingSchema;
  }

  customValidation(inputs: FrequencySettingInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check cutting mode vs frequency compatibility
    if (inputs.cuttingMode === 'continuous' && inputs.currentFrequency && inputs.currentFrequency > 0) {
      warnings.push({
        field: 'cuttingMode',
        message: 'Continuous wave mode does not use frequency settings',
        code: 'CW_FREQUENCY_MISMATCH'
      });
    }

    // Check power vs speed ratio
    const powerSpeedRatio = inputs.laserPower / (inputs.cuttingSpeed / 1000);
    if (powerSpeedRatio < 0.5) {
      warnings.push({
        field: 'cuttingSpeed',
        message: 'High cutting speed relative to power may require frequency optimization',
        code: 'HIGH_SPEED_LOW_POWER'
      });
    }

    // Check material vs laser type compatibility
    if (inputs.laserType === 'co2' && (inputs.materialType === 'steel' || inputs.materialType === 'stainless_steel')) {
      warnings.push({
        field: 'laserType',
        message: 'CO₂ laser may not be optimal for steel materials',
        code: 'SUBOPTIMAL_LASER_MATERIAL'
      });
    }

    // Check thickness vs quality priority
    if (inputs.thickness > 20 && inputs.qualityPriority === 'speed') {
      warnings.push({
        field: 'qualityPriority',
        message: 'Speed priority on thick material may compromise cut quality',
        code: 'THICK_MATERIAL_SPEED_PRIORITY'
      });
    }

    // Check current frequency range
    if (inputs.currentFrequency !== undefined) {
      const maxReasonableFreq = baseFrequencies[inputs.materialType]?.[inputs.laserType] * 2 || 40000;
      if (inputs.currentFrequency > maxReasonableFreq) {
        warnings.push({
          field: 'currentFrequency',
          message: 'Current frequency is unusually high for this material/laser combination',
          code: 'HIGH_FREQUENCY'
        });
      }
    }

    return { errors, warnings };
  }

  async calculate(inputs: FrequencySettingInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialThermalProperties[inputs.materialType];
      const baseFreq = baseFrequencies[inputs.materialType]?.[inputs.laserType] || 5000;
      
      // Calculate optimal frequency
      const optimalFrequency = this.calculateOptimalFrequency(inputs, material, baseFreq);
      
      // Calculate pulse characteristics
      const pulseCharacteristics = this.calculatePulseCharacteristics(optimalFrequency, inputs, material);
      
      // Analyze material response
      const materialResponse = this.analyzeMaterialResponse(inputs, optimalFrequency, pulseCharacteristics, material);
      
      // Perform frequency optimization analysis
      const frequencyOptimization = this.analyzeFrequencyOptimization(inputs, optimalFrequency, materialResponse);
      
      // Generate process recommendations
      const processRecommendations = this.generateProcessRecommendations(inputs, optimalFrequency, materialResponse);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, optimalFrequency, material);

      const results: FrequencySettingResults = {
        optimalFrequency,
        pulseCharacteristics,
        materialResponse,
        frequencyOptimization,
        processRecommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Frequency setting calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateOptimalFrequency(inputs: FrequencySettingInputs, material: typeof materialThermalProperties.steel, baseFreq: number) {
    let optimalFreq = baseFreq;
    
    // Handle continuous wave mode
    if (inputs.cuttingMode === 'continuous') {
      return {
        value: 0,
        unit: 'CW',
        mode: 'Continuous Wave',
        reasoning: ['Continuous wave mode selected for maximum power delivery'],
        confidence: 0.95,
        range: { minimum: 0, maximum: 0, tolerance: 0 }
      };
    }
    
    // Adjust for thickness
    const thicknessAdjustment = Math.pow(inputs.thickness, -0.3);
    optimalFreq *= thicknessAdjustment;
    
    // Adjust for cutting speed
    const speedAdjustment = Math.sqrt(inputs.cuttingSpeed / 3000);
    optimalFreq *= speedAdjustment;
    
    // Adjust for quality priority
    const qualityAdjustments = {
      speed: 1.2,
      balanced: 1.0,
      precision: 0.8,
      minimal_heat: 0.6
    };
    optimalFreq *= qualityAdjustments[inputs.qualityPriority];
    
    // Adjust for cutting mode
    if (inputs.cuttingMode === 'modulated') {
      optimalFreq *= 0.5;
    }
    
    // Material-specific adjustments
    if (material.thermalConductivity > 200) { // High thermal conductivity materials
      optimalFreq *= 1.2;
    }
    
    const finalFrequency = Math.round(optimalFreq);
    const tolerance = finalFrequency * 0.2; // ±20% tolerance
    
    return {
      value: finalFrequency,
      unit: 'Hz',
      mode: inputs.cuttingMode === 'modulated' ? 'Modulated CW' : 'Pulsed',
      reasoning: this.generateFrequencyReasoning(inputs, material),
      confidence: this.calculateFrequencyConfidence(inputs, material),
      range: {
        minimum: Math.round(finalFrequency * 0.8),
        maximum: Math.round(finalFrequency * 1.2),
        tolerance: Math.round(tolerance)
      }
    };
  }

  private calculatePulseCharacteristics(optimalFreq: any, inputs: FrequencySettingInputs, material: typeof materialThermalProperties.steel) {
    if (optimalFreq.value === 0) {
      // Continuous wave characteristics
      return {
        pulseDuration: 0,
        pulseEnergy: 0,
        peakPower: inputs.laserPower,
        averagePower: inputs.laserPower,
        dutyCycle: 100,
        repetitionRate: 0
      };
    }
    
    // Calculate optimal pulse duration
    const pulseDuration = this.calculateOptimalPulseDuration(optimalFreq.value, inputs.cuttingSpeed, material);
    
    // Calculate duty cycle
    const dutyCycle = Math.min(95, pulseDuration * optimalFreq.value / 10); // Percentage
    
    // Calculate power characteristics
    const averagePower = inputs.laserPower * (dutyCycle / 100);
    const pulseEnergy = averagePower / optimalFreq.value * 1000; // mJ
    const peakPower = pulseEnergy / (pulseDuration / 1000000); // Peak power in watts
    
    return {
      pulseDuration: Math.round(pulseDuration * 10) / 10,
      pulseEnergy: Math.round(pulseEnergy * 1000) / 1000,
      peakPower: Math.round(peakPower),
      averagePower: Math.round(averagePower),
      dutyCycle: Math.round(dutyCycle * 10) / 10,
      repetitionRate: optimalFreq.value
    };
  }

  private calculateOptimalPulseDuration(frequency: number, cuttingSpeed: number, material: typeof materialThermalProperties.steel): number {
    // Base pulse duration from material properties
    let pulseDuration = material.optimalPulseDuration;
    
    // Adjust for frequency
    pulseDuration = Math.min(pulseDuration, 1000000 / frequency * 0.8); // Max 80% of period
    
    // Adjust for cutting speed
    const speedFactor = Math.sqrt(3000 / cuttingSpeed);
    pulseDuration *= speedFactor;
    
    // Adjust for thermal conductivity
    const thermalFactor = Math.sqrt(50 / material.thermalConductivity);
    pulseDuration *= thermalFactor;
    
    return Math.max(10, Math.min(500, pulseDuration)); // Clamp between 10-500 μs
  }

  private analyzeMaterialResponse(inputs: FrequencySettingInputs, optimalFreq: any, pulseChar: any, material: typeof materialThermalProperties.steel) {
    // Calculate heat affected zone
    const heatAffectedZone = this.calculateHAZ(inputs, optimalFreq, pulseChar, material);
    
    // Predict cut quality
    const cutQuality = this.predictCutQuality(inputs, optimalFreq, pulseChar, material);
    
    // Calculate processing efficiency
    const processingEfficiency = this.calculateProcessingEfficiency(optimalFreq, pulseChar, material);
    
    return {
      heatAffectedZone,
      cutQuality,
      processingEfficiency
    };
  }

  private calculateHAZ(inputs: FrequencySettingInputs, optimalFreq: any, pulseChar: any, material: typeof materialThermalProperties.steel) {
    let hazWidth = 0.1; // Base HAZ width in mm
    
    if (optimalFreq.value === 0) {
      // Continuous wave - larger HAZ
      hazWidth = 0.2 + (inputs.thickness * 0.05);
    } else {
      // Pulsed mode - smaller HAZ
      hazWidth = 0.05 + (inputs.thickness * 0.02);
      hazWidth *= (pulseChar.dutyCycle / 100); // Reduce HAZ with lower duty cycle
    }
    
    // Adjust for material thermal conductivity
    hazWidth *= Math.sqrt(material.thermalConductivity / 50);
    
    let quality: 'excellent' | 'good' | 'fair' | 'poor';
    if (hazWidth < 0.1) quality = 'excellent';
    else if (hazWidth < 0.2) quality = 'good';
    else if (hazWidth < 0.3) quality = 'fair';
    else quality = 'poor';
    
    return {
      width: Math.round(hazWidth * 100) / 100,
      quality
    };
  }

  private predictCutQuality(inputs: FrequencySettingInputs, optimalFreq: any, pulseChar: any, material: typeof materialThermalProperties.steel) {
    let qualityScore = 80; // Base quality score
    
    // Adjust for frequency optimization
    if (optimalFreq.value > 0) {
      qualityScore += 10; // Pulsed mode generally better quality
    }
    
    // Adjust for quality priority
    const qualityBonus = {
      speed: -10,
      balanced: 0,
      precision: 15,
      minimal_heat: 20
    };
    qualityScore += qualityBonus[inputs.qualityPriority];
    
    // Adjust for material properties
    qualityScore += material.absorptivity * 10;
    
    // Adjust for pulse characteristics
    if (pulseChar.dutyCycle < 50) {
      qualityScore += 5; // Lower duty cycle = better quality
    }
    
    qualityScore = Math.max(60, Math.min(100, qualityScore));
    
    let edgeQuality: 'excellent' | 'good' | 'fair' | 'poor';
    if (qualityScore > 90) edgeQuality = 'excellent';
    else if (qualityScore > 80) edgeQuality = 'good';
    else if (qualityScore > 70) edgeQuality = 'fair';
    else edgeQuality = 'poor';
    
    const expectedFeatures = this.generateQualityFeatures(inputs, optimalFreq, qualityScore);
    
    return {
      score: Math.round(qualityScore),
      edgeQuality,
      expectedFeatures
    };
  }

  private calculateProcessingEfficiency(optimalFreq: any, pulseChar: any, material: typeof materialThermalProperties.steel) {
    let efficiency = 70; // Base efficiency percentage
    
    if (optimalFreq.value === 0) {
      efficiency = 85; // CW is generally more efficient
    } else {
      efficiency = 60 + (pulseChar.dutyCycle * 0.3); // Higher duty cycle = higher efficiency
    }
    
    // Adjust for material absorptivity
    efficiency *= material.absorptivity;
    
    return {
      overall: Math.round(efficiency),
      energyUtilization: Math.round(efficiency * 0.9),
      materialRemovalRate: Math.round(efficiency * 1.1)
    };
  }

  private analyzeFrequencyOptimization(inputs: FrequencySettingInputs, optimalFreq: any, materialResponse: any) {
    let currentVsOptimal = {
      improvement: 0,
      qualityGain: 0,
      efficiencyGain: 0,
      heatReduction: 0
    };
    
    // Compare with current frequency if provided
    if (inputs.currentFrequency !== undefined) {
      const currentIsOptimal = Math.abs(inputs.currentFrequency - optimalFreq.value) / optimalFreq.value < 0.2;
      
      if (!currentIsOptimal) {
        currentVsOptimal.improvement = 15;
        currentVsOptimal.qualityGain = 10;
        currentVsOptimal.efficiencyGain = 8;
        currentVsOptimal.heatReduction = 12;
      }
    }
    
    // Generate alternative frequencies
    const alternativeFrequencies = this.generateAlternativeFrequencies(optimalFreq, inputs);
    
    return {
      currentVsOptimal,
      alternativeFrequencies
    };
  }

  private generateAlternativeFrequencies(optimalFreq: any, inputs: FrequencySettingInputs) {
    const alternatives = [];
    
    if (optimalFreq.value === 0) {
      // CW mode alternatives
      alternatives.push({
        name: 'Low Frequency Pulsed',
        frequency: 1000,
        application: 'Minimal heat affected zone',
        tradeoff: 'Slower cutting speed',
        suitability: 7
      });
      alternatives.push({
        name: 'Medium Frequency Pulsed',
        frequency: 5000,
        application: 'Balanced approach',
        tradeoff: 'Moderate heat effects',
        suitability: 8
      });
    } else {
      // Pulsed mode alternatives
      alternatives.push({
        name: 'High Speed Option',
        frequency: Math.round(optimalFreq.value * 1.5),
        application: 'Faster cutting',
        tradeoff: 'Increased heat affected zone',
        suitability: 7
      });
      alternatives.push({
        name: 'High Quality Option',
        frequency: Math.round(optimalFreq.value * 0.7),
        application: 'Superior edge quality',
        tradeoff: 'Reduced cutting speed',
        suitability: 9
      });
      alternatives.push({
        name: 'Continuous Wave',
        frequency: 0,
        application: 'Maximum power efficiency',
        tradeoff: 'Larger heat affected zone',
        suitability: 6
      });
    }
    
    return alternatives;
  }

  private generateProcessRecommendations(inputs: FrequencySettingInputs, optimalFreq: any, materialResponse: any) {
    const frequencyAdjustments: string[] = [];
    const pulseOptimizations: string[] = [];
    const qualityImprovements: string[] = [];
    const troubleshooting: Array<{ issue: string; cause: string; solution: string }> = [];
    
    // Frequency adjustments
    if (inputs.currentFrequency && Math.abs(inputs.currentFrequency - optimalFreq.value) > optimalFreq.value * 0.2) {
      frequencyAdjustments.push(`Adjust frequency from ${inputs.currentFrequency}Hz to ${optimalFreq.value}Hz`);
    }
    
    frequencyAdjustments.push('Fine-tune frequency in ±10% range for optimal results');
    frequencyAdjustments.push('Monitor cut quality when adjusting frequency');
    
    // Pulse optimizations
    if (optimalFreq.value > 0) {
      pulseOptimizations.push('Optimize pulse duration for material thickness');
      pulseOptimizations.push('Adjust duty cycle to balance quality and efficiency');
      pulseOptimizations.push('Consider pulse shaping for advanced applications');
    }
    
    // Quality improvements
    qualityImprovements.push('Use lower frequency for better edge quality');
    qualityImprovements.push('Increase frequency for faster cutting speeds');
    if (inputs.qualityPriority === 'minimal_heat') {
      qualityImprovements.push('Use lowest practical frequency to minimize HAZ');
    }
    
    // Troubleshooting
    troubleshooting.push({
      issue: 'Poor cut quality',
      cause: 'Frequency not optimized for material',
      solution: `Use recommended frequency of ${optimalFreq.value}Hz`
    });
    
    troubleshooting.push({
      issue: 'Excessive heat affected zone',
      cause: 'Frequency too low or continuous wave mode',
      solution: 'Increase frequency or switch to pulsed mode'
    });
    
    troubleshooting.push({
      issue: 'Slow cutting speed',
      cause: 'Frequency too low',
      solution: 'Increase frequency within recommended range'
    });
    
    return {
      frequencyAdjustments,
      pulseOptimizations,
      qualityImprovements,
      troubleshooting
    };
  }

  private generateFrequencyReasoning(inputs: FrequencySettingInputs, material: typeof materialThermalProperties.steel): string[] {
    const reasons = [];
    
    if (inputs.cuttingMode === 'continuous') {
      reasons.push('Continuous wave mode selected for maximum power delivery');
    } else {
      reasons.push('Pulsed mode allows precise energy control and heat management');
    }
    
    if (material.thermalConductivity > 200) {
      reasons.push('High thermal conductivity material requires higher frequency');
    }
    
    if (inputs.qualityPriority === 'minimal_heat') {
      reasons.push('Reduced frequency minimizes thermal effects');
    }
    
    if (inputs.qualityPriority === 'speed') {
      reasons.push('Higher frequency optimizes cutting speed');
    }
    
    return reasons;
  }

  private calculateFrequencyConfidence(inputs: FrequencySettingInputs, material: typeof materialThermalProperties.steel): number {
    let confidence = 0.8; // Base confidence
    
    // Increase confidence for common material-laser combinations
    if ((inputs.materialType === 'steel' && inputs.laserType === 'fiber') ||
        (inputs.materialType === 'aluminum' && inputs.laserType === 'fiber')) {
      confidence += 0.1;
    }
    
    // Adjust for thickness range
    if (inputs.thickness >= 1 && inputs.thickness <= 20) {
      confidence += 0.05;
    }
    
    // Adjust for quality priority
    if (inputs.qualityPriority === 'balanced') {
      confidence += 0.05;
    }
    
    return Math.min(1.0, confidence);
  }

  private generateQualityFeatures(inputs: FrequencySettingInputs, optimalFreq: any, qualityScore: number): string[] {
    const features = [];
    
    if (qualityScore > 85) {
      features.push('Smooth edge finish');
      features.push('Minimal dross formation');
    }
    
    if (optimalFreq.value > 0) {
      features.push('Controlled heat input');
      features.push('Precise material removal');
    }
    
    if (inputs.qualityPriority === 'precision') {
      features.push('High dimensional accuracy');
      features.push('Consistent kerf width');
    }
    
    return features;
  }

  private generateWarnings(inputs: FrequencySettingInputs, optimalFreq: any, material: typeof materialThermalProperties.steel): string[] {
    const warnings: string[] = [];
    
    if (inputs.thickness > 25) {
      warnings.push('Very thick material may require multiple passes regardless of frequency');
    }
    
    if (material.thermalConductivity > 300 && optimalFreq.value < 10000) {
      warnings.push('High thermal conductivity material may require higher frequency');
    }
    
    if (inputs.cuttingMode === 'continuous' && inputs.qualityPriority === 'precision') {
      warnings.push('Continuous wave mode may not achieve precision quality requirements');
    }
    
    if (inputs.laserType === 'diode' && optimalFreq.value > 15000) {
      warnings.push('Diode lasers may have frequency limitations at high settings');
    }
    
    return warnings;
  }

  getExampleInputs(): FrequencySettingInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserType: 'fiber',
      laserPower: 2000,
      cuttingSpeed: 3000,
      cuttingMode: 'pulsed',
      qualityPriority: 'balanced',
      assistGas: 'oxygen'
    };
  }
}
