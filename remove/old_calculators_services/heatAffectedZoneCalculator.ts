/**
 * Heat Affected Zone Calculator
 * 
 * Calculates and analyzes the heat affected zone (HAZ) in laser cutting operations.
 * Provides thermal analysis, material property changes, and optimization recommendations.
 */

export interface HeatAffectedZoneInputs {
  // Material Properties
  material: {
    type: string;
    thickness: number; // mm
    thermalConductivity: number; // W/m·K
    specificHeat: number; // J/kg·K
    density: number; // kg/m³
    meltingPoint: number; // °C
    vaporization: number; // °C
  };

  // Laser Parameters
  laserParams: {
    power: number; // W
    speed: number; // mm/min
    focusPosition: number; // mm
    beamDiameter: number; // mm
    wavelength: number; // nm
    pulseFrequency?: number; // Hz (for pulsed lasers)
    dutyCycle?: number; // % (for pulsed lasers)
  };

  // Cutting Conditions
  conditions: {
    assistGasType: string;
    gasFlow: number; // l/min
    gasPressure: number; // bar
    ambientTemperature: number; // °C
    coolingMethod: string;
  };

  // Quality Requirements
  requirements: {
    maxHazWidth: number; // mm
    maxHardnessChange: number; // %
    maxMicrostructureChange: number; // %
    acceptableColorChange: boolean;
  };
}

export interface HeatAffectedZoneResults {
  // HAZ Analysis
  hazAnalysis: {
    width: number; // mm
    depth: number; // mm
    volume: number; // mm³
    temperatureProfile: Array<{
      distance: number; // mm from cut edge
      temperature: number; // °C
    }>;
    coolingRate: number; // °C/s
  };

  // Material Property Changes
  materialChanges: {
    hardnessChange: {
      percentage: number; // %
      distribution: Array<{
        distance: number; // mm
        hardness: number; // HV
      }>;
    };
    microstructureChanges: {
      grainSize: number; // μm
      phaseChanges: string[];
      carbideDistribution: string;
    };
    mechanicalProperties: {
      tensileStrength: number; // MPa
      yieldStrength: number; // MPa
      elongation: number; // %
      toughness: number; // J
    };
  };

  // Thermal Analysis
  thermalAnalysis: {
    peakTemperature: number; // °C
    heatingRate: number; // °C/s
    timeAtTemperature: number; // s
    thermalGradient: number; // °C/mm
    energyDensity: number; // J/mm²
  };

  // Quality Assessment
  qualityAssessment: {
    hazWidthCompliance: boolean;
    hardnessCompliance: boolean;
    microstructureCompliance: boolean;
    overallGrade: string; // A, B, C, D
    riskFactors: string[];
  };

  // Optimization Recommendations
  recommendations: {
    parameterAdjustments: Array<{
      parameter: string;
      currentValue: number;
      recommendedValue: number;
      expectedImprovement: string;
    }>;
    processModifications: string[];
    postProcessing: string[];
    qualityControl: string[];
  };

  // Mitigation Strategies
  mitigationStrategies: {
    preheating: {
      recommended: boolean;
      temperature: number; // °C
      duration: number; // min
    };
    postHeating: {
      recommended: boolean;
      temperature: number; // °C
      duration: number; // min
    };
    coolingControl: {
      method: string;
      rate: number; // °C/s
      medium: string;
    };
  };
}

export class HeatAffectedZoneCalculator {
  private materialDatabase = {
    'Carbon Steel': {
      thermalConductivity: 50,
      specificHeat: 460,
      density: 7850,
      meltingPoint: 1500,
      vaporization: 2900
    },
    'Stainless Steel': {
      thermalConductivity: 16,
      specificHeat: 500,
      density: 8000,
      meltingPoint: 1400,
      vaporization: 2800
    },
    'Aluminum': {
      thermalConductivity: 237,
      specificHeat: 900,
      density: 2700,
      meltingPoint: 660,
      vaporization: 2520
    },
    'Titanium': {
      thermalConductivity: 22,
      specificHeat: 520,
      density: 4500,
      meltingPoint: 1670,
      vaporization: 3287
    }
  };

  // Standard calculate method for registry compatibility
  calculate(inputs: HeatAffectedZoneInputs): HeatAffectedZoneResults {
    return this.calculateHeatAffectedZone(inputs);
  }

  calculateHeatAffectedZone(inputs: HeatAffectedZoneInputs): HeatAffectedZoneResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate thermal parameters
    const thermalAnalysis = this.calculateThermalAnalysis(inputs);

    // Calculate HAZ dimensions
    const hazAnalysis = this.calculateHAZDimensions(inputs, thermalAnalysis);

    // Analyze material property changes
    const materialChanges = this.analyzeMaterialChanges(inputs, thermalAnalysis);

    // Assess quality compliance
    const qualityAssessment = this.assessQualityCompliance(inputs, hazAnalysis, materialChanges);

    // Generate optimization recommendations
    const recommendations = this.generateRecommendations(inputs, hazAnalysis, materialChanges);

    // Develop mitigation strategies
    const mitigationStrategies = this.developMitigationStrategies(inputs, hazAnalysis);

    return {
      hazAnalysis,
      materialChanges,
      thermalAnalysis,
      qualityAssessment,
      recommendations,
      mitigationStrategies
    };
  }

  private validateInputs(inputs: HeatAffectedZoneInputs): void {
    if (inputs.material.thickness <= 0) {
      throw new Error('Material thickness must be positive');
    }
    if (inputs.laserParams.power <= 0) {
      throw new Error('Laser power must be positive');
    }
    if (inputs.laserParams.speed <= 0) {
      throw new Error('Cutting speed must be positive');
    }
  }

  private calculateThermalAnalysis(inputs: HeatAffectedZoneInputs): any {
    const { material, laserParams } = inputs;
    
    // Calculate energy density
    const energyDensity = (laserParams.power * 60) / (laserParams.speed * laserParams.beamDiameter);
    
    // Calculate peak temperature
    const peakTemperature = this.calculatePeakTemperature(inputs, energyDensity);
    
    // Calculate heating and cooling rates
    const heatingRate = this.calculateHeatingRate(inputs, energyDensity);
    const coolingRate = this.calculateCoolingRate(inputs);
    
    // Calculate time at temperature
    const timeAtTemperature = laserParams.beamDiameter / (laserParams.speed / 60);
    
    // Calculate thermal gradient
    const thermalGradient = peakTemperature / (laserParams.beamDiameter / 2);

    return {
      peakTemperature,
      heatingRate,
      coolingRate,
      timeAtTemperature,
      thermalGradient,
      energyDensity
    };
  }

  private calculatePeakTemperature(inputs: HeatAffectedZoneInputs, energyDensity: number): number {
    const { material } = inputs;
    const absorptivity = this.getAbsorptivity(material.type, inputs.laserParams.wavelength);
    
    // Simplified peak temperature calculation
    const effectiveEnergy = energyDensity * absorptivity;
    const temperatureRise = effectiveEnergy / (material.density * material.specificHeat * material.thickness);
    
    return inputs.conditions.ambientTemperature + temperatureRise;
  }

  private calculateHeatingRate(inputs: HeatAffectedZoneInputs, energyDensity: number): number {
    const { material, laserParams } = inputs;
    const interactionTime = laserParams.beamDiameter / (laserParams.speed / 60);
    const temperatureRise = energyDensity / (material.density * material.specificHeat);
    
    return temperatureRise / interactionTime;
  }

  private calculateCoolingRate(inputs: HeatAffectedZoneInputs): number {
    const { material, conditions } = inputs;
    
    // Cooling rate depends on material thermal properties and cooling method
    const baseCoolingRate = material.thermalConductivity / (material.density * material.specificHeat);
    
    // Adjust for cooling method
    let coolingMultiplier = 1;
    switch (conditions.coolingMethod.toLowerCase()) {
      case 'air':
        coolingMultiplier = 1;
        break;
      case 'nitrogen':
        coolingMultiplier = 1.5;
        break;
      case 'water':
        coolingMultiplier = 3;
        break;
      default:
        coolingMultiplier = 1;
    }
    
    return baseCoolingRate * coolingMultiplier * 1000; // Convert to °C/s
  }

  private getAbsorptivity(materialType: string, wavelength: number): number {
    // Simplified absorptivity values for different materials and wavelengths
    const absorptivityMap: { [key: string]: number } = {
      'Carbon Steel': 0.8,
      'Stainless Steel': 0.7,
      'Aluminum': 0.1,
      'Titanium': 0.6
    };
    
    return absorptivityMap[materialType] || 0.5;
  }

  private calculateHAZDimensions(inputs: HeatAffectedZoneInputs, thermalAnalysis: any): any {
    const { material, laserParams } = inputs;
    
    // Calculate HAZ width based on thermal diffusion
    const thermalDiffusivity = material.thermalConductivity / (material.density * material.specificHeat);
    const interactionTime = laserParams.beamDiameter / (laserParams.speed / 60);
    const thermalDiffusionLength = Math.sqrt(thermalDiffusivity * interactionTime);
    
    const hazWidth = thermalDiffusionLength * 2; // Total width
    const hazDepth = Math.min(hazWidth * 0.7, material.thickness); // Depth is typically less than width
    const hazVolume = hazWidth * hazDepth * laserParams.beamDiameter;
    
    // Generate temperature profile
    const temperatureProfile = this.generateTemperatureProfile(inputs, thermalAnalysis, hazWidth);
    
    return {
      width: hazWidth,
      depth: hazDepth,
      volume: hazVolume,
      temperatureProfile,
      coolingRate: thermalAnalysis.coolingRate
    };
  }

  private generateTemperatureProfile(inputs: HeatAffectedZoneInputs, thermalAnalysis: any, hazWidth: number): Array<{distance: number, temperature: number}> {
    const profile = [];
    const steps = 10;
    const stepSize = hazWidth / steps;
    
    for (let i = 0; i <= steps; i++) {
      const distance = i * stepSize;
      const temperature = thermalAnalysis.peakTemperature * Math.exp(-Math.pow(distance / (hazWidth / 3), 2));
      profile.push({ distance, temperature });
    }
    
    return profile;
  }

  private analyzeMaterialChanges(inputs: HeatAffectedZoneInputs, thermalAnalysis: any): any {
    // Simplified material property change analysis
    const baseHardness = this.getBaseHardness(inputs.material.type);
    const hardnessChange = this.calculateHardnessChange(thermalAnalysis, baseHardness);
    
    return {
      hardnessChange: {
        percentage: hardnessChange.percentage,
        distribution: hardnessChange.distribution
      },
      microstructureChanges: {
        grainSize: this.calculateGrainSize(thermalAnalysis),
        phaseChanges: this.identifyPhaseChanges(inputs.material.type, thermalAnalysis),
        carbideDistribution: 'Modified'
      },
      mechanicalProperties: this.calculateMechanicalProperties(inputs.material.type, thermalAnalysis)
    };
  }

  private getBaseHardness(materialType: string): number {
    const hardnessMap: { [key: string]: number } = {
      'Carbon Steel': 200,
      'Stainless Steel': 180,
      'Aluminum': 50,
      'Titanium': 300
    };
    
    return hardnessMap[materialType] || 150;
  }

  private calculateHardnessChange(thermalAnalysis: any, baseHardness: number): any {
    // Simplified hardness change calculation
    const temperatureEffect = Math.min(thermalAnalysis.peakTemperature / 1000, 1);
    const coolingEffect = Math.min(thermalAnalysis.coolingRate / 100, 1);
    
    const hardnessChangePercent = temperatureEffect * coolingEffect * 30; // Max 30% change
    
    const distribution = [];
    for (let i = 0; i <= 5; i++) {
      const distance = i * 0.5; // mm
      const hardness = baseHardness * (1 + hardnessChangePercent / 100 * Math.exp(-distance));
      distribution.push({ distance, hardness });
    }
    
    return {
      percentage: hardnessChangePercent,
      distribution
    };
  }

  private calculateGrainSize(thermalAnalysis: any): number {
    // Simplified grain size calculation based on peak temperature
    const baseGrainSize = 10; // μm
    const temperatureEffect = Math.min(thermalAnalysis.peakTemperature / 1500, 2);
    
    return baseGrainSize * temperatureEffect;
  }

  private identifyPhaseChanges(materialType: string, thermalAnalysis: any): string[] {
    const changes = [];
    
    if (thermalAnalysis.peakTemperature > 800) {
      changes.push('Austenite formation');
    }
    if (thermalAnalysis.coolingRate > 50) {
      changes.push('Martensite formation');
    }
    if (thermalAnalysis.peakTemperature > 1200) {
      changes.push('Carbide dissolution');
    }
    
    return changes;
  }

  private calculateMechanicalProperties(materialType: string, thermalAnalysis: any): any {
    // Simplified mechanical property calculations
    const baseTensile = this.getBaseTensileStrength(materialType);
    const temperatureEffect = 1 - (thermalAnalysis.peakTemperature - 20) / 2000;
    
    return {
      tensileStrength: baseTensile * temperatureEffect,
      yieldStrength: baseTensile * 0.7 * temperatureEffect,
      elongation: 20 * temperatureEffect,
      toughness: 50 * temperatureEffect
    };
  }

  private getBaseTensileStrength(materialType: string): number {
    const strengthMap: { [key: string]: number } = {
      'Carbon Steel': 400,
      'Stainless Steel': 520,
      'Aluminum': 200,
      'Titanium': 900
    };
    
    return strengthMap[materialType] || 300;
  }

  private assessQualityCompliance(inputs: HeatAffectedZoneInputs, hazAnalysis: any, materialChanges: any): any {
    const hazWidthCompliance = hazAnalysis.width <= inputs.requirements.maxHazWidth;
    const hardnessCompliance = materialChanges.hardnessChange.percentage <= inputs.requirements.maxHardnessChange;
    const microstructureCompliance = true; // Simplified
    
    const complianceCount = [hazWidthCompliance, hardnessCompliance, microstructureCompliance].filter(Boolean).length;
    
    let overallGrade = 'D';
    if (complianceCount === 3) overallGrade = 'A';
    else if (complianceCount === 2) overallGrade = 'B';
    else if (complianceCount === 1) overallGrade = 'C';
    
    const riskFactors = [];
    if (!hazWidthCompliance) riskFactors.push('Excessive HAZ width');
    if (!hardnessCompliance) riskFactors.push('Significant hardness change');
    
    return {
      hazWidthCompliance,
      hardnessCompliance,
      microstructureCompliance,
      overallGrade,
      riskFactors
    };
  }

  private generateRecommendations(inputs: HeatAffectedZoneInputs, hazAnalysis: any, materialChanges: any): any {
    const recommendations = [];
    
    if (hazAnalysis.width > inputs.requirements.maxHazWidth) {
      recommendations.push({
        parameter: 'Laser Power',
        currentValue: inputs.laserParams.power,
        recommendedValue: inputs.laserParams.power * 0.8,
        expectedImprovement: 'Reduce HAZ width by 20%'
      });
      
      recommendations.push({
        parameter: 'Cutting Speed',
        currentValue: inputs.laserParams.speed,
        recommendedValue: inputs.laserParams.speed * 1.2,
        expectedImprovement: 'Reduce heat input and HAZ'
      });
    }
    
    return {
      parameterAdjustments: recommendations,
      processModifications: [
        'Consider pulsed laser operation',
        'Optimize assist gas flow',
        'Use beam shaping optics'
      ],
      postProcessing: [
        'Stress relief annealing',
        'Surface grinding',
        'Heat treatment'
      ],
      qualityControl: [
        'HAZ width measurement',
        'Hardness testing',
        'Microstructure analysis'
      ]
    };
  }

  private developMitigationStrategies(inputs: HeatAffectedZoneInputs, hazAnalysis: any): any {
    return {
      preheating: {
        recommended: inputs.material.type === 'Carbon Steel' && inputs.material.thickness > 10,
        temperature: 200,
        duration: 30
      },
      postHeating: {
        recommended: hazAnalysis.width > inputs.requirements.maxHazWidth,
        temperature: 600,
        duration: 60
      },
      coolingControl: {
        method: 'Controlled cooling',
        rate: 10,
        medium: 'Air'
      }
    };
  }
}

export const heatAffectedZoneCalculator = new HeatAffectedZoneCalculator();
