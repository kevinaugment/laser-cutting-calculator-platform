import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface FocusHeightCalculatorInputs extends CalculatorInputs {
  materialType: string;
  thickness: number; // mm
  laserWavelength: number; // nm (e.g., 1064 for fiber, 10600 for CO2)
  beamDiameter: number; // mm at focus
  focalLength: number; // mm of focusing lens
  laserPower: number; // W
  cuttingSpeed: number; // mm/min
  gasType: 'oxygen' | 'nitrogen' | 'air' | 'argon';
  cutType: 'through_cut' | 'marking' | 'engraving' | 'welding';
  surfaceCondition: 'flat' | 'warped' | 'textured' | 'reflective';
  desiredEdgeQuality: 'production' | 'standard' | 'high' | 'precision';
  materialReflectivity: number; // percentage (0-100)
  ambientConditions: {
    temperature: number; // °C
    humidity: number; // percentage
    airPressure: number; // mbar
  };
}

export interface FocusHeightCalculatorResults extends CalculatorResults {
  optimalFocusPosition: {
    recommendedPosition: number; // mm (+ above surface, - below surface)
    positionRange: { min: number; max: number }; // mm
    depthOfFocus: number; // mm
    rayleighLength: number; // mm
    beamWaistDiameter: number; // mm
  };
  focusPositionTable: {
    thickness: number;
    throughCut: number;
    topSurface: number;
    midThickness: number;
    bottomSurface: number;
    qualityGrade: number;
  }[];
  beamCharacteristics: {
    powerDensity: number; // W/mm²
    spotSize: number; // mm at focus
    divergenceAngle: number; // mrad
    confocalParameter: number; // mm
    numericalAperture: number;
  };
  cutQualityPrediction: {
    topEdgeQuality: number; // 1-5 scale
    bottomEdgeQuality: number; // 1-5 scale
    kerfTaper: number; // degrees
    heatAffectedZone: number; // mm
    drossFormation: 'none' | 'minimal' | 'moderate' | 'excessive';
  };
  focusStabilityAnalysis: {
    thermalDrift: number; // mm per hour
    mechanicalStability: number; // mm variation
    atmosphericEffects: number; // mm variation
    recommendedCalibrationFrequency: string;
  };
  setupInstructions: {
    initialSetup: string[];
    calibrationProcedure: string[];
    verificationSteps: string[];
    maintenanceSchedule: string[];
  };
  troubleshootingGuide: {
    poorTopEdge: string[];
    poorBottomEdge: string[];
    incompleteCuts: string[];
    excessiveHAZ: string[];
    focusDrift: string[];
  };
  adaptiveAdjustments: {
    materialVariations: { variation: string; adjustment: number; reason: string }[];
    environmentalFactors: { factor: string; adjustment: number; impact: string }[];
    equipmentAging: { component: string; adjustment: number; frequency: string }[];
  };
}

export class FocusHeightCalculator {
  private materialOpticalProperties = {
    'mild_steel': { absorptivity: 0.85, thermalDiffusivity: 12.0, reflectivity: 0.15 },
    'stainless_steel': { absorptivity: 0.75, thermalDiffusivity: 4.2, reflectivity: 0.25 },
    'aluminum': { absorptivity: 0.25, thermalDiffusivity: 97.0, reflectivity: 0.75 },
    'carbon_steel': { absorptivity: 0.88, thermalDiffusivity: 15.0, reflectivity: 0.12 },
    'copper': { absorptivity: 0.15, thermalDiffusivity: 111.0, reflectivity: 0.85 },
    'brass': { absorptivity: 0.35, thermalDiffusivity: 35.0, reflectivity: 0.65 },
    'titanium': { absorptivity: 0.65, thermalDiffusivity: 9.0, reflectivity: 0.35 }
  };

  private cutTypeFactors = {
    'through_cut': { focusOffset: -0.3, powerRequirement: 1.0, qualityPriority: 0.8 },
    'marking': { focusOffset: 0.0, powerRequirement: 0.3, qualityPriority: 1.0 },
    'engraving': { focusOffset: 0.1, powerRequirement: 0.5, qualityPriority: 0.9 },
    'welding': { focusOffset: -0.5, powerRequirement: 1.2, qualityPriority: 0.6 }
  };

  calculate(inputs: FocusHeightCalculatorInputs): FocusHeightCalculatorResults {
    // Input validation
    this.validateInputs(inputs);

    // Get material properties
    const materialProps = this.getMaterialProperties(inputs.materialType);

    // Calculate optimal focus position
    const optimalFocusPosition = this.calculateOptimalFocusPosition(inputs, materialProps);

    // Generate focus position table
    const focusPositionTable = this.generateFocusPositionTable(inputs, materialProps);

    // Calculate beam characteristics
    const beamCharacteristics = this.calculateBeamCharacteristics(inputs);

    // Predict cut quality
    const cutQualityPrediction = this.predictCutQuality(inputs, optimalFocusPosition, materialProps);

    // Analyze focus stability
    const focusStabilityAnalysis = this.analyzeFocusStability(inputs);

    // Generate setup instructions
    const setupInstructions = this.generateSetupInstructions(inputs, optimalFocusPosition);

    // Create troubleshooting guide
    const troubleshootingGuide = this.createTroubleshootingGuide(inputs);

    // Generate adaptive adjustments
    const adaptiveAdjustments = this.generateAdaptiveAdjustments(inputs, materialProps);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, optimalFocusPosition, cutQualityPrediction);

    // Generate process optimization data
    const processOptimization = this.generateProcessOptimization(inputs, optimalFocusPosition, beamCharacteristics, focusStabilityAnalysis);

    // Generate material specific tips
    const materialSpecificTips = this.generateMaterialSpecificTips(inputs, optimalFocusPosition, cutQualityPrediction);

    // Generate adjustment guidance
    const adjustmentGuidance = this.generateAdjustmentGuidance(inputs, optimalFocusPosition);

    return {
      optimalFocusPosition,
      focusPositionTable,
      beamCharacteristics,
      cutQualityPrediction,
      focusStabilityAnalysis,
      setupInstructions,
      troubleshootingGuide,
      adaptiveAdjustments,
      recommendations,
      processOptimization,
      materialSpecificTips,
      adjustmentGuidance,
      keyMetrics: {
        'Focus Position': `${optimalFocusPosition.recommendedPosition > 0 ? '+' : ''}${optimalFocusPosition.recommendedPosition.toFixed(2)} mm`,
        'Depth of Focus': `${optimalFocusPosition.depthOfFocus.toFixed(2)} mm`,
        'Power Density': `${beamCharacteristics.powerDensity.toFixed(0)} W/mm²`,
        'Top Edge Quality': `${cutQualityPrediction.topEdgeQuality}/5`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: FocusHeightCalculatorInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.laserWavelength <= 0) {
      throw new Error('Laser wavelength must be greater than 0');
    }
    if (inputs.beamDiameter <= 0) {
      throw new Error('Beam diameter must be greater than 0');
    }
    if (inputs.focalLength <= 0) {
      throw new Error('Focal length must be greater than 0');
    }
    if (inputs.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
  }

  private getMaterialProperties(materialType: string): any {
    const normalizedType = materialType.toLowerCase().replace(/\s+/g, '_');
    return this.materialOpticalProperties[normalizedType] || this.materialOpticalProperties['mild_steel'];
  }

  private calculateOptimalFocusPosition(inputs: FocusHeightCalculatorInputs, materialProps: any): any {
    // Calculate Rayleigh length: ZR = π × w₀² / λ
    const beamWaistRadius = inputs.beamDiameter / 2; // mm
    const wavelengthMm = inputs.laserWavelength / 1000000; // convert nm to mm
    const rayleighLength = Math.PI * Math.pow(beamWaistRadius, 2) / wavelengthMm;

    // Depth of focus (2 × Rayleigh length)
    const depthOfFocus = 2 * rayleighLength;

    // Base focus position calculation
    const cutTypeFactor = this.cutTypeFactors[inputs.cutType];
    let baseFocusPosition = inputs.thickness * cutTypeFactor.focusOffset;

    // Material-specific adjustments
    if (materialProps.reflectivity > 0.5) {
      baseFocusPosition -= 0.1; // Move focus slightly below surface for reflective materials
    }

    // Thickness-dependent adjustment
    const thicknessAdjustment = Math.min(0.2, inputs.thickness / 50);
    baseFocusPosition -= thicknessAdjustment;

    // Quality-dependent adjustment
    const qualityFactors = {
      'production': 0.0,
      'standard': -0.05,
      'high': -0.1,
      'precision': -0.15
    };
    baseFocusPosition += qualityFactors[inputs.desiredEdgeQuality];

    // Gas type adjustment
    const gasAdjustments = {
      'oxygen': 0.0,
      'nitrogen': -0.05,
      'air': 0.02,
      'argon': -0.03
    };
    baseFocusPosition += gasAdjustments[inputs.gasType];

    // Calculate position range (±DOF/4)
    const positionRange = {
      min: baseFocusPosition - depthOfFocus / 4,
      max: baseFocusPosition + depthOfFocus / 4
    };

    return {
      recommendedPosition: Math.round(baseFocusPosition * 100) / 100,
      positionRange: {
        min: Math.round(positionRange.min * 100) / 100,
        max: Math.round(positionRange.max * 100) / 100
      },
      depthOfFocus: Math.round(depthOfFocus * 100) / 100,
      rayleighLength: Math.round(rayleighLength * 100) / 100,
      beamWaistDiameter: Math.round(inputs.beamDiameter * 100) / 100
    };
  }

  private generateFocusPositionTable(inputs: FocusHeightCalculatorInputs, materialProps: any): any[] {
    const thicknesses = [1, 2, 3, 5, 8, 10, 15, 20, 25, 30];
    
    return thicknesses.map(thickness => {
      const modifiedInputs = { ...inputs, thickness };
      const focus = this.calculateOptimalFocusPosition(modifiedInputs, materialProps);
      
      // Calculate different focus positions
      const throughCut = focus.recommendedPosition;
      const topSurface = 0;
      const midThickness = -thickness / 2;
      const bottomSurface = -thickness;
      
      // Estimate quality grade for through cut
      const qualityGrade = Math.max(1, Math.min(5, 5 - thickness / 10));

      return {
        thickness,
        throughCut: Math.round(throughCut * 100) / 100,
        topSurface,
        midThickness: Math.round(midThickness * 100) / 100,
        bottomSurface: Math.round(bottomSurface * 100) / 100,
        qualityGrade: Math.round(qualityGrade * 10) / 10
      };
    });
  }

  private calculateBeamCharacteristics(inputs: FocusHeightCalculatorInputs): any {
    // Power density at focus
    const spotArea = Math.PI * Math.pow(inputs.beamDiameter / 2, 2); // mm²
    const powerDensity = inputs.laserPower / spotArea;

    // Beam divergence angle (full angle)
    const divergenceAngle = (inputs.laserWavelength / 1000000) / (Math.PI * inputs.beamDiameter / 2) * 1000; // mrad

    // Confocal parameter (2 × Rayleigh length)
    const wavelengthMm = inputs.laserWavelength / 1000000;
    const rayleighLength = Math.PI * Math.pow(inputs.beamDiameter / 2, 2) / wavelengthMm;
    const confocalParameter = 2 * rayleighLength;

    // Numerical aperture
    const numericalAperture = inputs.beamDiameter / (2 * inputs.focalLength);

    return {
      powerDensity: Math.round(powerDensity),
      spotSize: Math.round(inputs.beamDiameter * 1000) / 1000,
      divergenceAngle: Math.round(divergenceAngle * 10) / 10,
      confocalParameter: Math.round(confocalParameter * 100) / 100,
      numericalAperture: Math.round(numericalAperture * 1000) / 1000
    };
  }

  private predictCutQuality(inputs: FocusHeightCalculatorInputs, focus: any, materialProps: any): any {
    // Top edge quality (better when focus is at or above surface)
    const topEdgeQuality = Math.max(1, Math.min(5, 5 - Math.abs(focus.recommendedPosition) * 2));

    // Bottom edge quality (better when focus is below surface)
    const bottomEdgeQuality = Math.max(1, Math.min(5, 3 + focus.recommendedPosition * 2));

    // Kerf taper calculation
    const kerfTaper = Math.abs(focus.recommendedPosition) * 0.5 + inputs.thickness * 0.1;

    // Heat affected zone
    const heatAffectedZone = (inputs.laserPower / 1000) * (1 / inputs.cuttingSpeed) * 100 * materialProps.thermalDiffusivity / 1000;

    // Dross formation prediction
    let drossFormation: 'none' | 'minimal' | 'moderate' | 'excessive' = 'minimal';
    if (inputs.gasType === 'oxygen' && inputs.thickness > 10 && focus.recommendedPosition > -0.2) {
      drossFormation = 'moderate';
    } else if (focus.recommendedPosition > 0.2) {
      drossFormation = 'moderate';
    }

    return {
      topEdgeQuality: Math.round(topEdgeQuality * 10) / 10,
      bottomEdgeQuality: Math.round(bottomEdgeQuality * 10) / 10,
      kerfTaper: Math.round(kerfTaper * 100) / 100,
      heatAffectedZone: Math.round(heatAffectedZone * 100) / 100,
      drossFormation
    };
  }

  private analyzeFocusStability(inputs: FocusHeightCalculatorInputs): any {
    // Thermal drift estimation
    const thermalDrift = (inputs.laserPower / 1000) * 0.01; // mm per hour

    // Mechanical stability (based on system rigidity)
    const mechanicalStability = inputs.focalLength / 10000; // mm variation

    // Atmospheric effects
    const pressureEffect = Math.abs(inputs.ambientConditions.airPressure - 1013) / 1000;
    const humidityEffect = inputs.ambientConditions.humidity / 1000;
    const atmosphericEffects = pressureEffect + humidityEffect;

    // Calibration frequency recommendation
    let calibrationFrequency = 'Daily';
    if (thermalDrift > 0.05 || mechanicalStability > 0.02) {
      calibrationFrequency = 'Every 4 hours';
    } else if (thermalDrift > 0.02 || mechanicalStability > 0.01) {
      calibrationFrequency = 'Every 8 hours';
    }

    return {
      thermalDrift: Math.round(thermalDrift * 1000) / 1000,
      mechanicalStability: Math.round(mechanicalStability * 1000) / 1000,
      atmosphericEffects: Math.round(atmosphericEffects * 1000) / 1000,
      recommendedCalibrationFrequency: calibrationFrequency
    };
  }

  private generateSetupInstructions(inputs: FocusHeightCalculatorInputs, focus: any): any {
    return {
      initialSetup: [
        `Set focus position to ${focus.recommendedPosition > 0 ? '+' : ''}${focus.recommendedPosition}mm relative to material surface`,
        'Ensure focusing lens is clean and properly aligned',
        'Verify beam path is unobstructed',
        'Check material surface is flat and properly positioned',
        'Calibrate Z-axis positioning system'
      ],
      calibrationProcedure: [
        'Use focus calibration target or test material',
        'Perform focus ramp test across ±0.5mm range',
        'Identify optimal position based on cut quality',
        'Document calibration results and date',
        'Update machine parameters with calibrated values'
      ],
      verificationSteps: [
        'Cut test piece and inspect edge quality',
        'Measure kerf width and taper',
        'Check for complete penetration',
        'Verify absence of excessive dross',
        'Compare results to quality standards'
      ],
      maintenanceSchedule: [
        'Clean focusing optics weekly',
        'Check mechanical alignment monthly',
        'Calibrate focus position per stability analysis',
        'Replace focusing lens annually or as needed',
        'Document all maintenance activities'
      ]
    };
  }

  private createTroubleshootingGuide(inputs: FocusHeightCalculatorInputs): any {
    return {
      poorTopEdge: [
        'Move focus position closer to surface (increase Z)',
        'Reduce cutting speed by 10-15%',
        'Check for beam alignment issues',
        'Verify gas pressure is adequate',
        'Clean focusing optics'
      ],
      poorBottomEdge: [
        'Move focus position below surface (decrease Z)',
        'Increase laser power by 5-10%',
        'Reduce cutting speed',
        'Check for gas flow obstruction',
        'Verify material is properly supported'
      ],
      incompleteCuts: [
        'Move focus significantly below surface',
        'Increase laser power',
        'Reduce cutting speed substantially',
        'Check for focus drift during cutting',
        'Verify adequate depth of focus'
      ],
      excessiveHAZ: [
        'Move focus closer to surface',
        'Increase cutting speed',
        'Reduce laser power if possible',
        'Use assist gas with better cooling properties',
        'Check for thermal lensing effects'
      ],
      focusDrift: [
        'Check for thermal expansion in machine structure',
        'Verify focusing lens mounting stability',
        'Monitor ambient temperature changes',
        'Implement active focus control if available',
        'Increase calibration frequency'
      ]
    };
  }

  private generateAdaptiveAdjustments(inputs: FocusHeightCalculatorInputs, materialProps: any): any {
    return {
      materialVariations: [
        { variation: 'Thickness tolerance +10%', adjustment: -0.05, reason: 'Compensate for increased material depth' },
        { variation: 'Surface oxidation', adjustment: 0.02, reason: 'Oxide layer affects beam absorption' },
        { variation: 'Material warping', adjustment: 0.0, reason: 'Use adaptive focus control if available' },
        { variation: 'Alloy composition change', adjustment: -0.03, reason: 'Different thermal properties' }
      ],
      environmentalFactors: [
        { factor: 'Temperature increase +10°C', adjustment: -0.01, impact: 'Thermal expansion affects focus' },
        { factor: 'Humidity increase +20%', adjustment: 0.005, impact: 'Atmospheric refraction changes' },
        { factor: 'Barometric pressure drop', adjustment: 0.002, impact: 'Air density affects beam propagation' },
        { factor: 'Vibration environment', adjustment: 0.0, impact: 'Increase calibration frequency' }
      ],
      equipmentAging: [
        { component: 'Focusing lens degradation', adjustment: -0.02, frequency: 'Every 6 months' },
        { component: 'Z-axis wear', adjustment: 0.01, frequency: 'Annual inspection' },
        { component: 'Thermal drift increase', adjustment: -0.01, frequency: 'Quarterly assessment' },
        { component: 'Beam quality degradation', adjustment: -0.03, frequency: 'Annual laser service' }
      ]
    };
  }

  private generateRecommendations(inputs: FocusHeightCalculatorInputs, focus: any, quality: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Optimal focus position: ${focus.recommendedPosition > 0 ? '+' : ''}${focus.recommendedPosition}mm from surface`);
    recommendations.push(`Depth of focus: ${focus.depthOfFocus}mm provides positioning tolerance`);

    if (Math.abs(focus.recommendedPosition) > inputs.thickness / 2) {
      recommendations.push('Focus position is deep - verify adequate beam quality at this depth');
    }

    if (quality.kerfTaper > 2) {
      recommendations.push('Significant kerf taper predicted - consider optimizing focus position');
    }

    if (quality.drossFormation !== 'none' && quality.drossFormation !== 'minimal') {
      recommendations.push('Dross formation expected - optimize gas pressure and focus position');
    }

    recommendations.push('Regular focus calibration essential for consistent quality');

    return recommendations;
  }

  private generateAdjustmentGuidance(inputs: FocusHeightCalculatorInputs, optimalFocus: any): any {
    return {
      setupSteps: [
        'Ensure material is flat and properly clamped',
        'Clean focusing lens and check for damage',
        'Set initial focus position using focus finder',
        'Perform test cuts on scrap material',
        'Fine-tune focus based on edge quality',
        'Document optimal settings for future use'
      ],
      calibrationProcedure: [
        'Use focus calibration plate or gauge',
        'Measure actual focus position with dial indicator',
        'Compare with calculated optimal position',
        'Adjust Z-axis offset if necessary',
        'Verify focus position repeatability',
        'Update machine parameters'
      ],
      troubleshooting: [
        {
          issue: 'Poor top edge quality',
          solution: 'Move focus position closer to surface (less negative)',
          priority: 'medium'
        },
        {
          issue: 'Poor bottom edge quality',
          solution: 'Move focus position deeper into material (more negative)',
          priority: 'medium'
        },
        {
          issue: 'Excessive dross formation',
          solution: 'Adjust focus position and check gas pressure',
          priority: 'high'
        },
        {
          issue: 'Inconsistent cut quality',
          solution: 'Check focus stability and material flatness',
          priority: 'high'
        }
      ],
      maintenanceSchedule: [
        'Daily: Check lens cleanliness and focus repeatability',
        'Weekly: Verify focus position accuracy',
        'Monthly: Clean and inspect focusing optics',
        'Quarterly: Calibrate focus measurement system'
      ]
    };
  }

  private generateMaterialSpecificTips(inputs: FocusHeightCalculatorInputs, optimalFocus: any, cutQuality: any): any {
    const materialProps = this.getMaterialProperties(inputs.materialType);

    return {
      focusAdjustments: [
        `For ${inputs.materialType.replace('_', ' ')}: Focus position optimized for material properties`,
        inputs.materialType === 'stainless_steel' ? 'Focus slightly deeper for stainless steel to improve edge quality' : '',
        inputs.materialType === 'aluminum' ? 'Focus slightly higher for aluminum to reduce reflectivity issues' : '',
        inputs.materialType === 'copper' ? 'Focus deeper due to high reflectivity and thermal conductivity' : '',
        inputs.materialType === 'wood' ? 'Focus higher to prevent excessive burning and charring' : '',
        'Adjust focus based on material surface condition and thickness variations'
      ].filter(tip => tip !== ''),
      commonIssues: [
        'Material warping affecting focus distance',
        'Thermal lensing at high power levels',
        'Focus drift due to temperature changes',
        'Inconsistent material thickness',
        'Surface contamination affecting focus accuracy'
      ],
      bestPractices: [
        'Use consistent material preparation and clamping',
        'Monitor focus position during long cutting operations',
        'Implement focus tracking for thick materials',
        'Regular calibration and maintenance of focusing system',
        'Document optimal settings for each material type'
      ],
      qualityIndicators: [
        'Smooth, perpendicular cut edges',
        'Minimal dross formation',
        'Consistent kerf width throughout cut',
        'No burn marks or excessive discoloration',
        'Good dimensional accuracy and repeatability'
      ]
    };
  }

  private generateProcessOptimization(inputs: FocusHeightCalculatorInputs, optimalFocus: any, beamCharacteristics: any, focusStability: any): any {
    return {
      powerRecommendation: {
        current: inputs.laserPower,
        optimal: Math.round(inputs.laserPower * 0.95),
        adjustment: 'Reduce power by 5% to minimize thermal effects and improve focus stability'
      },
      speedRecommendation: {
        current: inputs.cuttingSpeed,
        optimal: Math.round(inputs.cuttingSpeed * 1.05),
        adjustment: 'Increase speed by 5% to reduce heat accumulation'
      },
      focusStability: {
        stabilityIndex: Math.max(0, Math.min(100, 95 - (focusStability.thermalDrift * 1000) - (focusStability.mechanicalStability * 1000))),
        criticalFactors: [
          'Thermal stability of focusing optics',
          'Mechanical stability of Z-axis',
          'Material flatness and clamping',
          'Environmental temperature control'
        ],
        monitoringPoints: [
          'Focus position repeatability',
          'Cut quality consistency',
          'Thermal drift measurement',
          'Vibration monitoring'
        ]
      }
    };
  }

  private performSensitivityAnalysis(inputs: FocusHeightCalculatorInputs): any {
    // Get material properties once
    const materialProps = this.getMaterialProperties(inputs.materialType);

    // Calculate base values without recursion
    const baseOptimalFocus = this.calculateOptimalFocusPosition(inputs, materialProps);
    const baseBeamCharacteristics = this.calculateBeamCharacteristics(inputs);
    const baseCutQuality = this.predictCutQuality(inputs, baseOptimalFocus, materialProps);

    const variations = [-0.1, -0.05, 0.05, 0.1];

    return {
      focusPosition: variations.map(variation => {
        // Simulate focus position change by modifying thickness slightly
        const modifiedInputs = { ...inputs, thickness: inputs.thickness * (1 + variation) };
        const modifiedOptimalFocus = this.calculateOptimalFocusPosition(modifiedInputs, materialProps);
        const modifiedCutQuality = this.predictCutQuality(modifiedInputs, modifiedOptimalFocus, materialProps);

        return {
          variation: `${variation > 0 ? '+' : ''}${(variation * inputs.thickness).toFixed(2)}mm`,
          topQuality: modifiedCutQuality.topEdgeQuality,
          bottomQuality: modifiedCutQuality.bottomEdgeQuality,
          kerfTaper: modifiedCutQuality.kerfTaper
        };
      }),
      beamDiameter: [0.9, 0.95, 1.05, 1.1].map(multiplier => {
        const modifiedInputs = { ...inputs, beamDiameter: inputs.beamDiameter * multiplier };
        const modifiedOptimalFocus = this.calculateOptimalFocusPosition(modifiedInputs, materialProps);
        const modifiedBeamCharacteristics = this.calculateBeamCharacteristics(modifiedInputs);

        return {
          variation: `${((multiplier - 1) * 100) > 0 ? '+' : ''}${((multiplier - 1) * 100).toFixed(0)}%`,
          focusPosition: modifiedOptimalFocus.recommendedPosition,
          depthOfFocus: modifiedOptimalFocus.depthOfFocus,
          powerDensity: modifiedBeamCharacteristics.powerDensity
        };
      })
    };
  }
}

export const focusHeightCalculator = new FocusHeightCalculator();
