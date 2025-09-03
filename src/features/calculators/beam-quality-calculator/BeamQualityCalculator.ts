// Beam Quality Calculator Implementation
// Comprehensive beam quality analysis for laser cutting optimization

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const beamQualitySchema = z.object({
  laserType: z.enum(['fiber', 'co2', 'nd_yag', 'disk', 'diode']),
  wavelength: z.number().min(0.8).max(12),
  power: z.number().min(100).max(50000),
  beamDiameter: z.number().min(0.01).max(5.0),
  divergenceAngle: z.number().min(0.1).max(50).optional().default(1.0),
  focalLength: z.number().min(10).max(500).optional().default(100)
});

// Input types
export type BeamQualityInputs = z.infer<typeof beamQualitySchema>;

// Result types
export interface BeamQualityResults {
  mSquaredFactor: number;           // M² beam quality factor
  beamParameterProduct: number;     // mm·mrad
  rayleighLength: number;           // mm
  focusedSpotSize: number;          // μm
  powerDensity: number;             // MW/cm²
  beamQualityGrade: 'excellent' | 'good' | 'fair' | 'poor';
  opticalAnalysis: {
    diffrationLimit: number;        // μm
    focusability: number;           // 0-1 scale
    beamPropagation: {
      nearField: number;            // mm
      farField: number;             // mrad
      waistPosition: number;        // mm
    };
  };
  cuttingPerformance: {
    edgeQuality: 'excellent' | 'good' | 'fair' | 'poor';
    cuttingSpeed: 'very_fast' | 'fast' | 'medium' | 'slow';
    thicknessCapability: number;    // mm
    precisionLevel: 'ultra' | 'high' | 'medium' | 'standard';
  };
  recommendations: string[];
  warnings: string[];
  laserCharacteristics: {
    coherenceLength: number;        // mm
    brightness: number;             // W/(cm²·sr)
    beamDivergence: number;         // mrad
    numericalAperture: number;
  };
}

// Laser type characteristics database
const laserCharacteristics = {
  fiber: {
    typicalWavelength: 1.064,       // μm
    typicalMSquared: 1.1,
    maxPowerDensity: 100,           // MW/cm²
    beamQualityRange: { min: 1.05, max: 1.3 },
    advantages: ['Excellent beam quality', 'High efficiency', 'Compact design'],
    limitations: ['Limited wavelength options', 'Fiber damage risk']
  },
  co2: {
    typicalWavelength: 10.6,
    typicalMSquared: 1.05,
    maxPowerDensity: 50,
    beamQualityRange: { min: 1.02, max: 1.15 },
    advantages: ['Near-diffraction limited', 'High power capability', 'Mature technology'],
    limitations: ['Large size', 'Lower efficiency', 'Beam delivery complexity']
  },
  nd_yag: {
    typicalWavelength: 1.064,
    typicalMSquared: 1.2,
    maxPowerDensity: 80,
    beamQualityRange: { min: 1.1, max: 1.5 },
    advantages: ['Good beam quality', 'Reliable operation', 'Flexible pumping'],
    limitations: ['Lower efficiency', 'Thermal lensing', 'Maintenance requirements']
  },
  disk: {
    typicalWavelength: 1.030,
    typicalMSquared: 1.15,
    maxPowerDensity: 120,
    beamQualityRange: { min: 1.08, max: 1.25 },
    advantages: ['Excellent beam quality', 'High power', 'Good thermal management'],
    limitations: ['Complex design', 'Higher cost', 'Limited availability']
  },
  diode: {
    typicalWavelength: 0.808,
    typicalMSquared: 2.5,
    maxPowerDensity: 20,
    beamQualityRange: { min: 1.8, max: 4.0 },
    advantages: ['High efficiency', 'Compact', 'Low cost'],
    limitations: ['Poor beam quality', 'Limited power', 'Wavelength drift']
  }
};

export class BeamQualityCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'beam-quality-calculator',
    title: 'Beam Quality Calculator',
    description: 'Analyze laser beam quality and optical performance for cutting optimization',
    category: 'Core Engineering',
    badge: 'Standard',
    iconName: 'Zap',
    inputs: [
      {
        id: 'laserType',
        label: 'Laser Type',
        type: 'select',
        required: true,
        help: 'Select the type of laser system',
        options: [
          { value: 'fiber', label: 'Fiber Laser' },
          { value: 'co2', label: 'CO2 Laser' },
          { value: 'nd_yag', label: 'Nd:YAG Laser' },
          { value: 'disk', label: 'Disk Laser' },
          { value: 'diode', label: 'Diode Laser' }
        ]
      },
      {
        id: 'wavelength',
        label: 'Wavelength',
        type: 'number',
        required: true,
        min: 0.8,
        max: 12,
        step: 0.001,
        unit: 'μm',
        help: 'Laser wavelength in micrometers'
      },
      {
        id: 'power',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 100,
        max: 50000,
        step: 100,
        unit: 'W',
        help: 'Laser output power in watts'
      },
      {
        id: 'beamDiameter',
        label: 'Beam Diameter',
        type: 'number',
        required: true,
        min: 0.01,
        max: 5.0,
        step: 0.01,
        unit: 'mm',
        help: 'Beam diameter at 1/e² intensity'
      },
      {
        id: 'divergenceAngle',
        label: 'Divergence Angle',
        type: 'number',
        required: false,
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mrad',
        help: 'Full-angle beam divergence (optional)'
      },
      {
        id: 'focalLength',
        label: 'Focal Length',
        type: 'number',
        required: false,
        min: 10,
        max: 500,
        step: 1,
        unit: 'mm',
        help: 'Focusing lens focal length (optional)'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return beamQualitySchema;
  }

  customValidation(inputs: BeamQualityInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check wavelength vs laser type consistency
    const laserChar = laserCharacteristics[inputs.laserType];
    const wavelengthDiff = Math.abs(inputs.wavelength - laserChar.typicalWavelength);
    
    if (wavelengthDiff > laserChar.typicalWavelength * 0.1) {
      warnings.push({
        field: 'wavelength',
        message: `Wavelength ${inputs.wavelength}μm is unusual for ${inputs.laserType} laser (typical: ${laserChar.typicalWavelength}μm)`,
        code: 'UNUSUAL_WAVELENGTH'
      });
    }

    // Check beam diameter vs power relationship
    const beamArea = Math.PI * Math.pow(inputs.beamDiameter / 2, 2); // mm²
    const powerDensity = inputs.power / beamArea; // W/mm²
    
    if (powerDensity > 10000) {
      warnings.push({
        field: 'beamDiameter',
        message: 'Very high power density may cause optical damage or nonlinear effects',
        code: 'HIGH_POWER_DENSITY'
      });
    }

    // Check divergence angle reasonableness
    if (inputs.divergenceAngle && inputs.divergenceAngle > 10) {
      warnings.push({
        field: 'divergenceAngle',
        message: 'High divergence angle indicates poor beam quality',
        code: 'HIGH_DIVERGENCE'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: BeamQualityInputs): Promise<BaseCalculationResult> {
    try {
      const laserChar = laserCharacteristics[inputs.laserType];
      
      // Calculate M² factor
      const mSquaredFactor = this.calculateMSquaredFactor(inputs, laserChar);
      
      // Calculate beam parameter product
      const beamParameterProduct = this.calculateBeamParameterProduct(inputs, mSquaredFactor);
      
      // Calculate Rayleigh length
      const rayleighLength = this.calculateRayleighLength(inputs, mSquaredFactor);
      
      // Calculate focused spot size
      const focusedSpotSize = this.calculateFocusedSpotSize(inputs, mSquaredFactor);
      
      // Calculate power density
      const powerDensity = this.calculatePowerDensity(inputs, focusedSpotSize);
      
      // Determine beam quality grade
      const beamQualityGrade = this.determineBeamQualityGrade(mSquaredFactor);
      
      // Analyze optical characteristics
      const opticalAnalysis = this.analyzeOpticalCharacteristics(inputs, mSquaredFactor);
      
      // Assess cutting performance
      const cuttingPerformance = this.assessCuttingPerformance(inputs, mSquaredFactor, powerDensity);
      
      // Calculate laser characteristics
      const laserCharacteristicsResult = this.calculateLaserCharacteristics(inputs, mSquaredFactor);
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, mSquaredFactor, powerDensity);
      const warnings = this.generateWarnings(inputs, mSquaredFactor, powerDensity);

      const results: BeamQualityResults = {
        mSquaredFactor: Math.round(mSquaredFactor * 1000) / 1000,
        beamParameterProduct: Math.round(beamParameterProduct * 1000) / 1000,
        rayleighLength: Math.round(rayleighLength * 100) / 100,
        focusedSpotSize: Math.round(focusedSpotSize * 10) / 10,
        powerDensity: Math.round(powerDensity * 100) / 100,
        beamQualityGrade,
        opticalAnalysis,
        cuttingPerformance,
        recommendations,
        warnings,
        laserCharacteristics: laserCharacteristicsResult
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Beam quality calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateMSquaredFactor(inputs: BeamQualityInputs, laserChar: typeof laserCharacteristics.fiber): number {
    // If divergence angle is provided, calculate M² from beam propagation
    if (inputs.divergenceAngle) {
      const wavelengthMm = inputs.wavelength / 1000; // Convert μm to mm
      const waistRadius = inputs.beamDiameter / 2;
      const divergenceRad = inputs.divergenceAngle / 1000; // Convert mrad to rad
      
      // M² = (π * w₀ * θ) / λ
      const mSquared = (Math.PI * waistRadius * divergenceRad) / wavelengthMm;
      return Math.max(mSquared, 1.0); // M² cannot be less than 1
    }
    
    // Otherwise, use typical values for laser type with some variation
    const baseMSquared = laserChar.typicalMSquared;
    const variation = 0.1 * (Math.random() - 0.5); // ±5% variation
    return Math.max(baseMSquared + variation, 1.0);
  }

  private calculateBeamParameterProduct(inputs: BeamQualityInputs, mSquared: number): number {
    const waistRadius = inputs.beamDiameter / 2; // mm
    const divergenceAngle = inputs.divergenceAngle || this.estimateDivergenceAngle(inputs, mSquared);
    
    // BPP = w₀ * θ (in mm·mrad)
    return waistRadius * divergenceAngle;
  }

  private calculateRayleighLength(inputs: BeamQualityInputs, mSquared: number): number {
    const wavelengthMm = inputs.wavelength / 1000; // Convert μm to mm
    const waistRadius = inputs.beamDiameter / 2;
    
    // z_R = (π * w₀²) / (M² * λ)
    return (Math.PI * Math.pow(waistRadius, 2)) / (mSquared * wavelengthMm);
  }

  private calculateFocusedSpotSize(inputs: BeamQualityInputs, mSquared: number): number {
    const wavelengthUm = inputs.wavelength; // μm
    const focalLength = inputs.focalLength || 100; // mm
    const beamDiameter = inputs.beamDiameter; // mm
    
    // w_f = (4 * M² * λ * f) / (π * D)
    const focusedSpotSize = (4 * mSquared * wavelengthUm * focalLength) / (Math.PI * beamDiameter);
    
    return Math.max(focusedSpotSize, wavelengthUm / 2); // Minimum spot size is λ/2
  }

  private calculatePowerDensity(inputs: BeamQualityInputs, focusedSpotSize: number): number {
    const spotAreaCm2 = Math.PI * Math.pow(focusedSpotSize / 20000, 2); // Convert μm to cm
    return (inputs.power / 1000000) / spotAreaCm2; // MW/cm²
  }

  private determineBeamQualityGrade(mSquared: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (mSquared <= 1.1) return 'excellent';
    if (mSquared <= 1.3) return 'good';
    if (mSquared <= 2.0) return 'fair';
    return 'poor';
  }

  private analyzeOpticalCharacteristics(inputs: BeamQualityInputs, mSquared: number) {
    const wavelengthUm = inputs.wavelength;
    const diffrationLimit = wavelengthUm / 2; // Theoretical minimum spot size
    const focusability = 1 / mSquared; // Higher M² = lower focusability
    
    const divergenceAngle = inputs.divergenceAngle || this.estimateDivergenceAngle(inputs, mSquared);
    const rayleighLength = this.calculateRayleighLength(inputs, mSquared);
    
    return {
      diffrationLimit: Math.round(diffrationLimit * 10) / 10,
      focusability: Math.round(focusability * 1000) / 1000,
      beamPropagation: {
        nearField: Math.round(inputs.beamDiameter * 100) / 100,
        farField: Math.round(divergenceAngle * 100) / 100,
        waistPosition: Math.round(rayleighLength * 100) / 100
      }
    };
  }

  private assessCuttingPerformance(inputs: BeamQualityInputs, mSquared: number, powerDensity: number) {
    // Edge quality assessment
    let edgeQuality: 'excellent' | 'good' | 'fair' | 'poor';
    if (mSquared <= 1.1 && powerDensity > 10) edgeQuality = 'excellent';
    else if (mSquared <= 1.3 && powerDensity > 5) edgeQuality = 'good';
    else if (mSquared <= 2.0 && powerDensity > 2) edgeQuality = 'fair';
    else edgeQuality = 'poor';
    
    // Cutting speed assessment
    let cuttingSpeed: 'very_fast' | 'fast' | 'medium' | 'slow';
    if (powerDensity > 20) cuttingSpeed = 'very_fast';
    else if (powerDensity > 10) cuttingSpeed = 'fast';
    else if (powerDensity > 5) cuttingSpeed = 'medium';
    else cuttingSpeed = 'slow';
    
    // Thickness capability (empirical relationship)
    const thicknessCapability = Math.sqrt(powerDensity * 10) / mSquared;
    
    // Precision level
    let precisionLevel: 'ultra' | 'high' | 'medium' | 'standard';
    if (mSquared <= 1.05) precisionLevel = 'ultra';
    else if (mSquared <= 1.2) precisionLevel = 'high';
    else if (mSquared <= 1.5) precisionLevel = 'medium';
    else precisionLevel = 'standard';
    
    return {
      edgeQuality,
      cuttingSpeed,
      thicknessCapability: Math.round(thicknessCapability * 100) / 100,
      precisionLevel
    };
  }

  private calculateLaserCharacteristics(inputs: BeamQualityInputs, mSquared: number) {
    const wavelengthMm = inputs.wavelength / 1000;
    
    // Coherence length (simplified)
    const coherenceLength = wavelengthMm * 1000; // Assume high coherence
    
    // Brightness (radiance)
    const beamArea = Math.PI * Math.pow(inputs.beamDiameter / 2, 2); // mm²
    const solidAngle = Math.pow(inputs.divergenceAngle || 1, 2) / 1000000; // sr
    const brightness = inputs.power / (beamArea * solidAngle / 100); // W/(cm²·sr)
    
    // Beam divergence
    const beamDivergence = inputs.divergenceAngle || this.estimateDivergenceAngle(inputs, mSquared);
    
    // Numerical aperture
    const numericalAperture = beamDivergence / 2000; // Approximate conversion
    
    return {
      coherenceLength: Math.round(coherenceLength * 100) / 100,
      brightness: Math.round(brightness),
      beamDivergence: Math.round(beamDivergence * 100) / 100,
      numericalAperture: Math.round(numericalAperture * 10000) / 10000
    };
  }

  private estimateDivergenceAngle(inputs: BeamQualityInputs, mSquared: number): number {
    const wavelengthMm = inputs.wavelength / 1000;
    const waistRadius = inputs.beamDiameter / 2;
    
    // θ = (M² * λ) / (π * w₀)
    return (mSquared * wavelengthMm) / (Math.PI * waistRadius) * 1000; // Convert to mrad
  }

  private generateRecommendations(inputs: BeamQualityInputs, mSquared: number, powerDensity: number): string[] {
    const recommendations: string[] = [];
    
    if (mSquared > 1.5) {
      recommendations.push('Consider beam shaping optics to improve beam quality');
    }
    
    if (powerDensity < 5) {
      recommendations.push('Increase power or reduce focal spot size for better cutting performance');
    }
    
    if (inputs.laserType === 'diode' && mSquared > 3) {
      recommendations.push('Consider fiber coupling or beam combining for better beam quality');
    }
    
    if (inputs.wavelength > 5 && inputs.laserType !== 'co2') {
      recommendations.push('Long wavelength may require special optics and safety considerations');
    }
    
    if (powerDensity > 50) {
      recommendations.push('Very high power density - ensure adequate cooling and damage prevention');
    }
    
    return recommendations;
  }

  private generateWarnings(inputs: BeamQualityInputs, mSquared: number, powerDensity: number): string[] {
    const warnings: string[] = [];
    
    if (mSquared > 2.0) {
      warnings.push('Poor beam quality may result in reduced cutting performance');
    }
    
    if (powerDensity > 100) {
      warnings.push('Extremely high power density - risk of optical damage');
    }
    
    if (inputs.beamDiameter < 0.05) {
      warnings.push('Very small beam diameter may be difficult to maintain and measure');
    }
    
    if (inputs.divergenceAngle && inputs.divergenceAngle > 20) {
      warnings.push('High beam divergence limits focusing capability');
    }
    
    return warnings;
  }

  getExampleInputs(): BeamQualityInputs {
    return {
      laserType: 'fiber',
      wavelength: 1.064,
      power: 3000,
      beamDiameter: 0.2,
      divergenceAngle: 1.0,
      focalLength: 100
    };
  }
}
