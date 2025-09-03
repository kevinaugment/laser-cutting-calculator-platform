// Heat Affected Zone Calculator Implementation
// Comprehensive HAZ analysis for thermal control in laser cutting

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const hazCalculatorSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.5).max(50),
  laserPower: z.number().min(500).max(20000),
  cuttingSpeed: z.number().min(100).max(15000),
  beamDiameter: z.number().min(0.05).max(2.0).optional().default(0.2),
  pulseFrequency: z.number().min(0).max(50000).optional().default(0)
});

// Input types
export type HeatAffectedZoneInputs = z.infer<typeof hazCalculatorSchema>;

// Result types
export interface HeatAffectedZoneResults {
  hazWidth: number;           // mm
  hazDepth: number;           // mm
  hazVolume: number;          // mm³
  temperatureProfile: Array<{
    distance: number;         // mm from cut edge
    temperature: number;      // °C
  }>;
  coolingRate: number;        // °C/s
  microstructureChanges: {
    grainGrowth: string;
    hardnessChange: string;
    phaseTransformation: string;
    severity: 'low' | 'medium' | 'high';
  };
  controlRecommendations: string[];
  warnings: string[];
  thermalAnalysis: {
    peakTemperature: number;  // °C
    heatInput: number;        // J/mm
    thermalStress: number;    // MPa
    energyDensity: number;    // J/mm²
  };
}

// Material thermal properties database
const materialThermalProperties = {
  steel: {
    thermalConductivity: 50,    // W/m·K
    specificHeat: 490,          // J/kg·K
    density: 7850,              // kg/m³
    meltingPoint: 1538,         // °C
    thermalDiffusivity: 13e-6,  // m²/s
    thermalExpansion: 12e-6,    // /K
    absorptivity: 0.85,         // for fiber laser
    yieldStrength: 250,         // MPa
    elasticModulus: 200000      // MPa
  },
  stainless_steel: {
    thermalConductivity: 16,
    specificHeat: 500,
    density: 8000,
    meltingPoint: 1400,
    thermalDiffusivity: 4e-6,
    thermalExpansion: 17e-6,
    absorptivity: 0.80,
    yieldStrength: 205,
    elasticModulus: 200000
  },
  aluminum: {
    thermalConductivity: 237,
    specificHeat: 896,
    density: 2700,
    meltingPoint: 660,
    thermalDiffusivity: 97e-6,
    thermalExpansion: 23e-6,
    absorptivity: 0.75,
    yieldStrength: 276,
    elasticModulus: 70000
  },
  copper: {
    thermalConductivity: 401,
    specificHeat: 385,
    density: 8960,
    meltingPoint: 1085,
    thermalDiffusivity: 117e-6,
    thermalExpansion: 17e-6,
    absorptivity: 0.70,
    yieldStrength: 70,
    elasticModulus: 110000
  },
  titanium: {
    thermalConductivity: 22,
    specificHeat: 520,
    density: 4500,
    meltingPoint: 1668,
    thermalDiffusivity: 9e-6,
    thermalExpansion: 8.6e-6,
    absorptivity: 0.78,
    yieldStrength: 275,
    elasticModulus: 114000
  },
  brass: {
    thermalConductivity: 120,
    specificHeat: 380,
    density: 8500,
    meltingPoint: 930,
    thermalDiffusivity: 37e-6,
    thermalExpansion: 19e-6,
    absorptivity: 0.72,
    yieldStrength: 310,
    elasticModulus: 100000
  }
};

export class HeatAffectedZoneCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'heat-affected-zone-calculator',
    title: 'Heat Affected Zone Calculator',
    description: 'Calculate and analyze heat affected zone for thermal control',
    category: 'Core Engineering',
    badge: 'Standard',
    iconName: 'Thermometer',
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
        min: 0.5,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Thickness of the material in millimeters'
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W',
        help: 'Laser power setting in watts'
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
        help: 'Cutting speed in millimeters per minute'
      },
      {
        id: 'beamDiameter',
        label: 'Beam Diameter',
        type: 'number',
        required: false,
        min: 0.05,
        max: 2.0,
        step: 0.01,
        unit: 'mm',
        help: 'Focused beam diameter (optional, default: 0.2mm)'
      },
      {
        id: 'pulseFrequency',
        label: 'Pulse Frequency',
        type: 'number',
        required: false,
        min: 0,
        max: 50000,
        step: 100,
        unit: 'Hz',
        help: 'Pulse frequency (0 for continuous wave)'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return hazCalculatorSchema;
  }

  customValidation(inputs: HeatAffectedZoneInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check power vs speed ratio for heat input
    const heatInput = (inputs.laserPower * 60) / inputs.cuttingSpeed;
    if (heatInput > 1000) {
      warnings.push({
        field: 'laserPower',
        message: 'High heat input may result in large HAZ. Consider reducing power or increasing speed.',
        code: 'HIGH_HEAT_INPUT'
      });
    }

    // Check material-specific considerations
    if (inputs.materialType === 'aluminum' && inputs.laserPower < 2000) {
      warnings.push({
        field: 'laserPower',
        message: 'Low power for aluminum may result in poor cut quality due to high thermal conductivity.',
        code: 'LOW_POWER_ALUMINUM'
      });
    }

    if (inputs.materialType === 'copper' && inputs.laserPower < 3000) {
      warnings.push({
        field: 'laserPower',
        message: 'Copper requires high power due to high thermal conductivity and low absorptivity.',
        code: 'LOW_POWER_COPPER'
      });
    }

    // Check thickness vs power relationship
    const powerDensity = inputs.laserPower / inputs.thickness;
    if (powerDensity < 200) {
      warnings.push({
        field: 'thickness',
        message: 'Low power-to-thickness ratio may result in incomplete penetration.',
        code: 'LOW_POWER_DENSITY'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: HeatAffectedZoneInputs): Promise<BaseCalculationResult> {
    try {
      const material = materialThermalProperties[inputs.materialType];
      
      // Calculate thermal analysis
      const thermalAnalysis = this.calculateThermalAnalysis(inputs, material);
      
      // Calculate HAZ dimensions
      const hazDimensions = this.calculateHAZDimensions(inputs, material, thermalAnalysis);
      
      // Generate temperature profile
      const temperatureProfile = this.generateTemperatureProfile(hazDimensions.hazWidth, thermalAnalysis.peakTemperature);
      
      // Calculate cooling rate
      const coolingRate = this.calculateCoolingRate(inputs, material, thermalAnalysis);
      
      // Analyze microstructure changes
      const microstructureChanges = this.analyzeMicrostructureChanges(inputs, material, thermalAnalysis);
      
      // Generate control recommendations
      const controlRecommendations = this.generateControlRecommendations(inputs, hazDimensions, thermalAnalysis);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, hazDimensions, thermalAnalysis);

      const results: HeatAffectedZoneResults = {
        hazWidth: Math.round(hazDimensions.hazWidth * 1000) / 1000,
        hazDepth: Math.round(hazDimensions.hazDepth * 1000) / 1000,
        hazVolume: Math.round(hazDimensions.hazVolume * 1000) / 1000,
        temperatureProfile,
        coolingRate: Math.round(coolingRate),
        microstructureChanges,
        controlRecommendations,
        warnings,
        thermalAnalysis: {
          peakTemperature: Math.round(thermalAnalysis.peakTemperature),
          heatInput: Math.round(thermalAnalysis.heatInput),
          thermalStress: Math.round(thermalAnalysis.thermalStress),
          energyDensity: Math.round(thermalAnalysis.energyDensity)
        }
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `HAZ calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateThermalAnalysis(inputs: HeatAffectedZoneInputs, material: typeof materialThermalProperties.steel) {
    // Calculate heat input per unit length
    const heatInput = (inputs.laserPower * 60) / inputs.cuttingSpeed; // J/mm
    
    // Calculate energy density
    const beamArea = Math.PI * Math.pow(inputs.beamDiameter / 2, 2); // mm²
    const energyDensity = inputs.laserPower / (inputs.cuttingSpeed / 60 * inputs.beamDiameter); // J/mm²
    
    // Calculate peak temperature (simplified model)
    const absorptivity = material.absorptivity;
    const effectiveEnergy = heatInput * absorptivity;
    const temperatureRise = effectiveEnergy / (material.density * material.specificHeat * inputs.thickness / 1000);
    const peakTemperature = 20 + temperatureRise; // Assuming 20°C ambient
    
    // Calculate thermal stress
    const thermalStress = material.thermalExpansion * temperatureRise * material.elasticModulus;
    
    return {
      heatInput,
      energyDensity,
      peakTemperature: Math.min(peakTemperature, material.meltingPoint),
      thermalStress
    };
  }

  private calculateHAZDimensions(inputs: HeatAffectedZoneInputs, material: typeof materialThermalProperties.steel, thermalAnalysis: any) {
    // Calculate interaction time
    const interactionTime = inputs.beamDiameter / (inputs.cuttingSpeed / 60); // seconds
    
    // Calculate thermal diffusion length
    const thermalDiffusionLength = Math.sqrt(material.thermalDiffusivity * interactionTime * 1000); // mm
    
    // Calculate HAZ width based on thermal diffusion
    let hazWidth = thermalDiffusionLength * 2;
    
    // Minimum HAZ is beam diameter
    hazWidth = Math.max(hazWidth, inputs.beamDiameter * 1.5);
    
    // Pulse frequency effects (pulsed mode reduces HAZ)
    if (inputs.pulseFrequency > 0) {
      const dutyCycle = Math.min(50, inputs.pulseFrequency / 1000); // Simplified duty cycle estimation
      hazWidth *= Math.sqrt(dutyCycle / 100);
    }
    
    // Material-specific factors
    const materialFactors = {
      steel: 1.0,
      stainless_steel: 1.2,
      aluminum: 0.8,
      copper: 1.5,
      titanium: 0.9,
      brass: 1.1
    };
    
    hazWidth *= materialFactors[inputs.materialType];
    
    // Calculate HAZ depth (typically 70% of width, limited by thickness)
    const hazDepth = Math.min(hazWidth * 0.7, inputs.thickness);
    
    // Calculate HAZ volume (simplified as rectangular)
    const hazVolume = hazWidth * hazDepth * inputs.beamDiameter;
    
    return { hazWidth, hazDepth, hazVolume };
  }

  private generateTemperatureProfile(hazWidth: number, peakTemperature: number) {
    const profile = [];
    const steps = 10;
    const stepSize = hazWidth / steps;
    
    for (let i = 0; i <= steps; i++) {
      const distance = i * stepSize;
      // Gaussian temperature distribution
      const temperature = peakTemperature * Math.exp(-Math.pow(distance / (hazWidth / 3), 2));
      profile.push({ 
        distance: Math.round(distance * 1000) / 1000, 
        temperature: Math.round(temperature) 
      });
    }
    
    return profile;
  }

  private calculateCoolingRate(inputs: HeatAffectedZoneInputs, material: typeof materialThermalProperties.steel, thermalAnalysis: any): number {
    // Simplified cooling rate calculation
    const thermalDiffusivity = material.thermalDiffusivity;
    const characteristicLength = inputs.thickness / 1000; // Convert to meters
    const coolingRate = thermalAnalysis.peakTemperature / (characteristicLength * characteristicLength / thermalDiffusivity);
    
    return Math.min(coolingRate, 10000); // Cap at reasonable value
  }

  private analyzeMicrostructureChanges(inputs: HeatAffectedZoneInputs, material: typeof materialThermalProperties.steel, thermalAnalysis: any) {
    const peakTemp = thermalAnalysis.peakTemperature;
    const meltingPoint = material.meltingPoint;
    
    let grainGrowth = 'Minimal';
    let hardnessChange = 'No significant change';
    let phaseTransformation = 'None';
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    if (peakTemp > meltingPoint * 0.8) {
      grainGrowth = 'Significant grain growth';
      hardnessChange = 'Softening in HAZ';
      severity = 'high';
      
      if (inputs.materialType === 'steel') {
        phaseTransformation = 'Austenite formation and transformation';
      }
    } else if (peakTemp > meltingPoint * 0.6) {
      grainGrowth = 'Moderate grain growth';
      hardnessChange = 'Slight softening';
      severity = 'medium';
      
      if (inputs.materialType === 'steel') {
        phaseTransformation = 'Partial austenite formation';
      }
    } else if (peakTemp > meltingPoint * 0.4) {
      grainGrowth = 'Minor grain growth';
      hardnessChange = 'Minimal change';
      severity = 'low';
    }
    
    return { grainGrowth, hardnessChange, phaseTransformation, severity };
  }

  private generateControlRecommendations(inputs: HeatAffectedZoneInputs, hazDimensions: any, thermalAnalysis: any): string[] {
    const recommendations: string[] = [];
    
    if (hazDimensions.hazWidth > 0.5) {
      recommendations.push('Consider reducing laser power or increasing cutting speed to minimize HAZ');
    }
    
    if (inputs.pulseFrequency === 0 && hazDimensions.hazWidth > 0.3) {
      recommendations.push('Use pulsed mode to reduce heat input and HAZ size');
    }
    
    if (thermalAnalysis.peakTemperature > materialThermalProperties[inputs.materialType].meltingPoint * 0.8) {
      recommendations.push('High peak temperature detected - consider using assist gas cooling');
    }
    
    if (inputs.materialType === 'aluminum' || inputs.materialType === 'copper') {
      recommendations.push('Use nitrogen assist gas to prevent oxidation in HAZ');
    }
    
    if (inputs.thickness > 10 && hazDimensions.hazWidth > 0.4) {
      recommendations.push('For thick sections, consider multiple pass cutting to reduce HAZ');
    }
    
    return recommendations;
  }

  private generateWarnings(inputs: HeatAffectedZoneInputs, hazDimensions: any, thermalAnalysis: any): string[] {
    const warnings: string[] = [];
    
    if (hazDimensions.hazWidth > 1.0) {
      warnings.push('Large HAZ detected - may affect material properties significantly');
    }
    
    if (thermalAnalysis.thermalStress > materialThermalProperties[inputs.materialType].yieldStrength) {
      warnings.push('Thermal stress exceeds yield strength - risk of distortion');
    }
    
    if (thermalAnalysis.peakTemperature > materialThermalProperties[inputs.materialType].meltingPoint * 0.9) {
      warnings.push('Peak temperature near melting point - risk of excessive melting');
    }
    
    return warnings;
  }

  getExampleInputs(): HeatAffectedZoneInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserPower: 3000,
      cuttingSpeed: 2000,
      beamDiameter: 0.2,
      pulseFrequency: 0
    };
  }
}
