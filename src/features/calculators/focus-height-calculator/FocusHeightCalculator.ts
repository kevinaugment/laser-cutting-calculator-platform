// Focus Height Calculator Implementation
// Comprehensive focus height optimization for laser cutting precision

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const focusHeightSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.1).max(50),
  laserType: z.enum(['fiber', 'co2', 'nd_yag', 'diode']),
  focalLength: z.number().min(50).max(500),
  beamDiameter: z.number().min(1).max(25),
  cuttingApplication: z.enum(['through_cut', 'engraving', 'marking', 'welding', 'drilling']),
  qualityRequirement: z.enum(['rough', 'standard', 'precision', 'mirror']),
  assistGas: z.enum(['oxygen', 'nitrogen', 'air', 'argon']),
  currentFocusHeight: z.number().min(-50).max(50).optional()
});

// Input types
export type FocusHeightInputs = z.infer<typeof focusHeightSchema>;

// Result types
export interface FocusHeightResults {
  optimalFocus: {
    position: number;               // mm (negative = into material)
    unit: string;
    reference: string;
    reasoning: string[];
    tolerance: number;              // ±mm
    confidence: number;             // 0-1 scale
  };
  beamCharacteristics: {
    spotSize: number;               // mm
    powerDensity: number;           // W/mm²
    rayleighRange: number;          // mm
    depthOfFocus: number;           // mm
    beamQuality: number;            // M² factor
    numericalAperture: number;
  };
  focusPositionTable: Array<{
    application: string;
    position: number;               // mm
    description: string;
    qualityImpact: number;          // 1-10 scale
    suitability: 'excellent' | 'good' | 'acceptable' | 'poor';
  }>;
  qualityPrediction: {
    topEdgeQuality: number;         // 1-10 scale
    bottomEdgeQuality: number;      // 1-10 scale
    kerfTaper: number;              // degrees
    heatAffectedZone: number;       // mm
    overallQuality: 'excellent' | 'good' | 'acceptable' | 'poor';
  };
  adjustmentGuidance: {
    setupInstructions: string[];
    calibrationSteps: string[];
    troubleshooting: Array<{
      issue: string;
      cause: string;
      solution: string;
    }>;
    maintenanceTips: string[];
  };
  sensitivityAnalysis: {
    focusVariation: Array<{
      offset: number;               // mm
      qualityImpact: number;        // % change
      description: string;
    }>;
    toleranceRecommendation: string;
  };
  warnings: string[];
}

// Laser wavelengths in micrometers
const laserWavelengths = {
  fiber: 1.07,
  co2: 10.6,
  nd_yag: 1.064,
  diode: 0.9
};

// Beam quality factors (M²)
const beamQualityFactors = {
  fiber: 1.1,
  co2: 1.05,
  nd_yag: 1.2,
  diode: 2.0
};

// Material optical properties
const materialOpticalProperties = {
  steel: {
    absorptivity: 0.85,
    reflectivity: 0.15,
    thermalConductivity: 50,
    focusAdjustment: 0
  },
  stainless_steel: {
    absorptivity: 0.75,
    reflectivity: 0.25,
    thermalConductivity: 16,
    focusAdjustment: -0.2
  },
  aluminum: {
    absorptivity: 0.65,
    reflectivity: 0.35,
    thermalConductivity: 237,
    focusAdjustment: 0.1
  },
  copper: {
    absorptivity: 0.60,
    reflectivity: 0.40,
    thermalConductivity: 401,
    focusAdjustment: -0.3
  },
  titanium: {
    absorptivity: 0.80,
    reflectivity: 0.20,
    thermalConductivity: 22,
    focusAdjustment: -0.1
  },
  brass: {
    absorptivity: 0.70,
    reflectivity: 0.30,
    thermalConductivity: 120,
    focusAdjustment: -0.2
  }
};

// Application-specific focus strategies
const applicationFocusStrategies = {
  through_cut: {
    thin: (thickness: number) => -thickness / 3,      // Focus 1/3 into material
    medium: (thickness: number) => -thickness / 2,    // Focus at middle
    thick: (thickness: number) => -thickness * 0.6    // Focus deeper for thick materials
  },
  engraving: () => 0,                                 // Focus on surface
  marking: () => 0,                                   // Focus on surface
  welding: () => 0,                                   // Focus on surface
  drilling: (thickness: number) => -thickness / 4     // Slightly into material
};

export class FocusHeightCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'focus-height-calculator',
    title: 'Focus Height Calculator',
    description: 'Calculate optimal focus position for precision laser cutting and processing',
    category: 'Process Optimization',
    badge: 'Standard',
    iconName: 'Target',
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
          { value: 'fiber', label: 'Fiber Laser (1070nm)' },
          { value: 'co2', label: 'CO₂ Laser (10.6μm)' },
          { value: 'nd_yag', label: 'Nd:YAG Laser (1064nm)' },
          { value: 'diode', label: 'Diode Laser (808-980nm)' }
        ]
      },
      {
        id: 'focalLength',
        label: 'Focal Length',
        type: 'number',
        required: true,
        min: 50,
        max: 500,
        step: 1,
        unit: 'mm',
        help: 'Focal length of the focusing lens'
      },
      {
        id: 'beamDiameter',
        label: 'Raw Beam Diameter',
        type: 'number',
        required: true,
        min: 1,
        max: 25,
        step: 0.1,
        unit: 'mm',
        help: 'Diameter of the laser beam before focusing'
      },
      {
        id: 'cuttingApplication',
        label: 'Cutting Application',
        type: 'select',
        required: true,
        help: 'Type of laser processing application',
        options: [
          { value: 'through_cut', label: 'Through Cutting' },
          { value: 'engraving', label: 'Surface Engraving' },
          { value: 'marking', label: 'Marking/Etching' },
          { value: 'welding', label: 'Laser Welding' },
          { value: 'drilling', label: 'Hole Drilling' }
        ]
      },
      {
        id: 'qualityRequirement',
        label: 'Quality Requirement',
        type: 'select',
        required: true,
        help: 'Required processing quality level',
        options: [
          { value: 'rough', label: 'Rough Processing' },
          { value: 'standard', label: 'Standard Quality' },
          { value: 'precision', label: 'Precision Processing' },
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
        id: 'currentFocusHeight',
        label: 'Current Focus Height (Optional)',
        type: 'number',
        required: false,
        min: -50,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Current focus height setting for comparison'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return focusHeightSchema;
  }

  customValidation(inputs: FocusHeightInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check beam diameter vs focal length ratio
    const fNumber = inputs.focalLength / inputs.beamDiameter;
    if (fNumber < 2) {
      warnings.push({
        field: 'focalLength',
        message: 'Very low f-number may result in large spot size and poor focusing',
        code: 'LOW_F_NUMBER'
      });
    }

    // Check application vs material compatibility
    if (inputs.cuttingApplication === 'welding' && inputs.materialType === 'copper') {
      warnings.push({
        field: 'materialType',
        message: 'Copper welding requires special considerations due to high thermal conductivity',
        code: 'CHALLENGING_WELDING'
      });
    }

    // Check laser type vs material compatibility
    if (inputs.laserType === 'co2' && (inputs.materialType === 'steel' || inputs.materialType === 'stainless_steel')) {
      warnings.push({
        field: 'laserType',
        message: 'CO₂ laser may not be optimal for steel materials. Consider fiber laser.',
        code: 'SUBOPTIMAL_LASER_MATERIAL'
      });
    }

    // Check thickness vs application
    if (inputs.cuttingApplication === 'engraving' && inputs.thickness > 10) {
      warnings.push({
        field: 'thickness',
        message: 'Thick material for engraving - ensure proper focus control',
        code: 'THICK_ENGRAVING'
      });
    }

    // Check current focus height if provided
    if (inputs.currentFocusHeight !== undefined) {
      if (Math.abs(inputs.currentFocusHeight) > inputs.thickness * 2) {
        warnings.push({
          field: 'currentFocusHeight',
          message: 'Current focus height seems unusually far from material surface',
          code: 'EXTREME_FOCUS_HEIGHT'
        });
      }
    }

    return { errors, warnings };
  }

  async calculate(inputs: FocusHeightInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialOpticalProperties[inputs.materialType];
      const wavelength = laserWavelengths[inputs.laserType];
      const beamQuality = beamQualityFactors[inputs.laserType];
      
      // Calculate optimal focus position
      const optimalFocus = this.calculateOptimalFocus(inputs, material);
      
      // Calculate beam characteristics
      const beamCharacteristics = this.calculateBeamCharacteristics(inputs, wavelength, beamQuality);
      
      // Generate focus position table
      const focusPositionTable = this.generateFocusPositionTable(inputs, material);
      
      // Predict quality outcomes
      const qualityPrediction = this.predictQualityOutcomes(inputs, optimalFocus, beamCharacteristics);
      
      // Generate adjustment guidance
      const adjustmentGuidance = this.generateAdjustmentGuidance(inputs, optimalFocus);
      
      // Perform sensitivity analysis
      const sensitivityAnalysis = this.performSensitivityAnalysis(inputs, optimalFocus, beamCharacteristics);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, optimalFocus, material);

      const results: FocusHeightResults = {
        optimalFocus,
        beamCharacteristics,
        focusPositionTable,
        qualityPrediction,
        adjustmentGuidance,
        sensitivityAnalysis,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Focus height calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateOptimalFocus(inputs: FocusHeightInputs, material: typeof materialOpticalProperties.steel) {
    let focusPosition = 0;
    
    // Application-specific base position
    if (inputs.cuttingApplication === 'through_cut') {
      if (inputs.thickness <= 2) {
        focusPosition = applicationFocusStrategies.through_cut.thin(inputs.thickness);
      } else if (inputs.thickness <= 8) {
        focusPosition = applicationFocusStrategies.through_cut.medium(inputs.thickness);
      } else {
        focusPosition = applicationFocusStrategies.through_cut.thick(inputs.thickness);
      }
    } else {
      const strategy = applicationFocusStrategies[inputs.cuttingApplication];
      focusPosition = typeof strategy === 'function' ? strategy(inputs.thickness) : strategy();
    }
    
    // Material-specific adjustments
    focusPosition += material.focusAdjustment;
    
    // Quality adjustments
    const qualityAdjustments = {
      rough: 0.1,
      standard: 0,
      precision: -0.1,
      mirror: -0.2
    };
    focusPosition += qualityAdjustments[inputs.qualityRequirement];
    
    // Laser type adjustments
    const laserAdjustments = {
      fiber: 0,
      co2: 0.1,
      nd_yag: 0,
      diode: 0.2
    };
    focusPosition += laserAdjustments[inputs.laserType];
    
    // Gas type adjustments
    const gasAdjustments = {
      oxygen: 0,
      nitrogen: -0.05,
      air: 0.02,
      argon: -0.03
    };
    focusPosition += gasAdjustments[inputs.assistGas];
    
    // Calculate tolerance based on depth of focus
    const wavelength = laserWavelengths[inputs.laserType];
    const beamQuality = beamQualityFactors[inputs.laserType];
    const spotSize = this.calculateSpotSize(inputs.focalLength, inputs.beamDiameter, wavelength, beamQuality);
    const rayleighRange = (Math.PI * Math.pow(spotSize / 2, 2)) / (wavelength / 1000);
    const tolerance = rayleighRange * 0.5; // ±50% of Rayleigh range
    
    // Generate reasoning
    const reasoning = this.generateFocusReasoning(inputs, focusPosition);
    
    // Calculate confidence
    const confidence = this.calculateFocusConfidence(inputs, material);
    
    return {
      position: Math.round(focusPosition * 100) / 100,
      unit: 'mm',
      reference: 'Material surface (negative = into material)',
      reasoning,
      tolerance: Math.round(tolerance * 100) / 100,
      confidence: Math.round(confidence * 100) / 100
    };
  }

  private calculateBeamCharacteristics(inputs: FocusHeightInputs, wavelength: number, beamQuality: number) {
    // Calculate focused spot size
    const spotSize = this.calculateSpotSize(inputs.focalLength, inputs.beamDiameter, wavelength, beamQuality);
    
    // Calculate power density (assuming 1kW for reference)
    const referencePower = 1000; // W
    const spotArea = Math.PI * Math.pow(spotSize / 2, 2); // mm²
    const powerDensity = referencePower / spotArea;
    
    // Calculate Rayleigh range
    const rayleighRange = (Math.PI * Math.pow(spotSize / 2, 2)) / (wavelength / 1000);
    
    // Depth of focus (2 × Rayleigh range)
    const depthOfFocus = 2 * rayleighRange;
    
    // Numerical aperture
    const numericalAperture = inputs.beamDiameter / (2 * inputs.focalLength);
    
    return {
      spotSize: Math.round(spotSize * 1000) / 1000,
      powerDensity: Math.round(powerDensity),
      rayleighRange: Math.round(rayleighRange * 100) / 100,
      depthOfFocus: Math.round(depthOfFocus * 100) / 100,
      beamQuality: Math.round(beamQuality * 100) / 100,
      numericalAperture: Math.round(numericalAperture * 1000) / 1000
    };
  }

  private calculateSpotSize(focalLength: number, beamDiameter: number, wavelength: number, beamQuality: number): number {
    // Diffraction-limited spot size formula: d = 4λf/(πD) × M²
    return (4 * wavelength * focalLength * beamQuality) / (Math.PI * beamDiameter * 1000);
  }

  private generateFocusPositionTable(inputs: FocusHeightInputs, material: typeof materialOpticalProperties.steel) {
    const positions = [
      {
        application: 'Surface Focus',
        position: 0,
        description: 'Focus on material surface',
        qualityImpact: inputs.cuttingApplication === 'engraving' ? 10 : 6,
        suitability: inputs.cuttingApplication === 'engraving' ? 'excellent' : 'acceptable'
      },
      {
        application: 'Shallow Focus',
        position: -inputs.thickness * 0.2,
        description: 'Focus slightly into material',
        qualityImpact: inputs.thickness <= 3 ? 9 : 7,
        suitability: inputs.thickness <= 3 ? 'excellent' : 'good'
      },
      {
        application: 'Mid-thickness',
        position: -inputs.thickness / 2,
        description: 'Focus at material center',
        qualityImpact: inputs.thickness > 5 ? 8 : 6,
        suitability: inputs.thickness > 5 ? 'good' : 'acceptable'
      },
      {
        application: 'Deep Focus',
        position: -inputs.thickness * 0.8,
        description: 'Focus deep into material',
        qualityImpact: inputs.thickness > 10 ? 7 : 5,
        suitability: inputs.thickness > 10 ? 'acceptable' : 'poor'
      }
    ];
    
    return positions.map(pos => ({
      ...pos,
      position: Math.round(pos.position * 100) / 100,
      suitability: pos.suitability as 'excellent' | 'good' | 'acceptable' | 'poor'
    }));
  }

  private predictQualityOutcomes(inputs: FocusHeightInputs, optimalFocus: any, beamCharacteristics: any) {
    // Quality prediction based on focus position and beam characteristics
    const baseQuality = 8;
    
    // Application-specific quality factors
    const applicationFactors = {
      through_cut: 1.0,
      engraving: 1.1,
      marking: 1.2,
      welding: 0.9,
      drilling: 0.8
    };
    
    const applicationFactor = applicationFactors[inputs.cuttingApplication];
    
    // Material-specific quality factors
    const material = materialOpticalProperties[inputs.materialType];
    const materialFactor = material.absorptivity;
    
    // Calculate quality metrics
    const topEdgeQuality = Math.min(10, baseQuality * applicationFactor * materialFactor);
    const bottomEdgeQuality = Math.max(1, topEdgeQuality - inputs.thickness * 0.2);
    
    // Kerf taper calculation
    const kerfTaper = Math.max(0, inputs.thickness * 0.1 - beamCharacteristics.depthOfFocus * 0.5);
    
    // Heat affected zone
    const heatAffectedZone = beamCharacteristics.spotSize * 2 + inputs.thickness * 0.05;
    
    // Overall quality assessment
    const averageQuality = (topEdgeQuality + bottomEdgeQuality) / 2;
    let overallQuality: 'excellent' | 'good' | 'acceptable' | 'poor';
    if (averageQuality >= 8.5) overallQuality = 'excellent';
    else if (averageQuality >= 7) overallQuality = 'good';
    else if (averageQuality >= 5) overallQuality = 'acceptable';
    else overallQuality = 'poor';
    
    return {
      topEdgeQuality: Math.round(topEdgeQuality * 10) / 10,
      bottomEdgeQuality: Math.round(bottomEdgeQuality * 10) / 10,
      kerfTaper: Math.round(kerfTaper * 100) / 100,
      heatAffectedZone: Math.round(heatAffectedZone * 100) / 100,
      overallQuality
    };
  }

  private generateAdjustmentGuidance(inputs: FocusHeightInputs, optimalFocus: any) {
    const setupInstructions = [
      'Ensure laser head is properly aligned and perpendicular to workpiece',
      'Clean focusing lens and check for damage or contamination',
      'Verify beam path alignment through focusing optics',
      `Set initial focus height to ${optimalFocus.position}mm from material surface`
    ];
    
    const calibrationSteps = [
      'Use focus test pattern or gauge to verify focus position',
      'Perform test cuts on sample material',
      'Adjust focus height in ±0.1mm increments if needed',
      'Document optimal settings for future reference'
    ];
    
    const troubleshooting = [
      {
        issue: 'Poor cut quality at top edge',
        cause: 'Focus position too high (above surface)',
        solution: 'Lower focus position by 0.1-0.2mm increments'
      },
      {
        issue: 'Poor cut quality at bottom edge',
        cause: 'Focus position too low (too deep)',
        solution: 'Raise focus position by 0.1-0.2mm increments'
      },
      {
        issue: 'Inconsistent cut quality',
        cause: 'Focus drift or mechanical instability',
        solution: 'Check mechanical stability and recalibrate focus system'
      },
      {
        issue: 'Large kerf taper',
        cause: 'Focus position not optimized for material thickness',
        solution: 'Adjust focus to mid-thickness position for thick materials'
      }
    ];
    
    const maintenanceTips = [
      'Clean focusing lens weekly or as needed',
      'Check focus calibration monthly',
      'Inspect beam path alignment quarterly',
      'Replace focusing lens if damaged or heavily contaminated'
    ];
    
    return {
      setupInstructions,
      calibrationSteps,
      troubleshooting,
      maintenanceTips
    };
  }

  private performSensitivityAnalysis(inputs: FocusHeightInputs, optimalFocus: any, beamCharacteristics: any) {
    const focusVariations = [-0.2, -0.1, 0.1, 0.2];
    
    const focusVariation = focusVariations.map(offset => {
      const qualityImpact = Math.abs(offset) * 20; // 20% impact per 0.1mm deviation
      let description: string;
      
      if (Math.abs(offset) <= 0.1) {
        description = 'Minimal impact on cut quality';
      } else if (Math.abs(offset) <= 0.2) {
        description = 'Noticeable impact on edge quality';
      } else {
        description = 'Significant quality degradation';
      }
      
      return {
        offset,
        qualityImpact: Math.round(qualityImpact),
        description
      };
    });
    
    const toleranceRecommendation = `Maintain focus position within ±${optimalFocus.tolerance}mm for optimal results`;
    
    return {
      focusVariation,
      toleranceRecommendation
    };
  }

  private generateFocusReasoning(inputs: FocusHeightInputs, position: number): string[] {
    const reasons = [];
    
    if (inputs.cuttingApplication === 'through_cut') {
      if (inputs.thickness <= 2) {
        reasons.push('Shallow focus for thin material to maintain edge quality');
      } else if (inputs.thickness <= 8) {
        reasons.push('Mid-thickness focus for balanced top and bottom edge quality');
      } else {
        reasons.push('Deep focus for thick material to ensure complete penetration');
      }
    } else if (inputs.cuttingApplication === 'engraving') {
      reasons.push('Surface focus for precise engraving depth control');
    }
    
    if (inputs.materialType === 'copper' || inputs.materialType === 'aluminum') {
      reasons.push('Adjusted for high thermal conductivity material');
    }
    
    if (inputs.qualityRequirement === 'precision' || inputs.qualityRequirement === 'mirror') {
      reasons.push('Fine-tuned for high precision requirements');
    }
    
    return reasons;
  }

  private calculateFocusConfidence(inputs: FocusHeightInputs, material: typeof materialOpticalProperties.steel): number {
    let confidence = 0.8; // Base confidence
    
    // Increase confidence for common applications
    if (inputs.cuttingApplication === 'through_cut') {
      confidence += 0.1;
    }
    
    // Adjust for material properties
    if (material.absorptivity > 0.7) {
      confidence += 0.05;
    }
    
    // Adjust for thickness range
    if (inputs.thickness >= 1 && inputs.thickness <= 20) {
      confidence += 0.05;
    }
    
    return Math.min(1.0, confidence);
  }

  private generateWarnings(inputs: FocusHeightInputs, optimalFocus: any, material: typeof materialOpticalProperties.steel): string[] {
    const warnings: string[] = [];
    
    if (inputs.thickness > 25) {
      warnings.push('Very thick material - consider multiple pass cutting for better quality');
    }
    
    if (material.reflectivity > 0.3 && inputs.laserType === 'fiber') {
      warnings.push('High reflectivity material may require special focus considerations');
    }
    
    if (inputs.cuttingApplication === 'welding' && inputs.thickness < 1) {
      warnings.push('Very thin material welding requires precise focus control');
    }
    
    if (Math.abs(optimalFocus.position) > inputs.thickness) {
      warnings.push('Focus position extends beyond material thickness - verify settings');
    }
    
    if (inputs.laserType === 'diode' && inputs.qualityRequirement === 'mirror') {
      warnings.push('Diode lasers may not achieve mirror finish quality due to beam quality limitations');
    }
    
    return warnings;
  }

  getExampleInputs(): FocusHeightInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserType: 'fiber',
      focalLength: 127,
      beamDiameter: 6,
      cuttingApplication: 'through_cut',
      qualityRequirement: 'standard',
      assistGas: 'oxygen'
    };
  }
}
