import { CalculatorConfig } from '../../types/calculator';

export const focusHeightConfig: CalculatorConfig = {
  id: 'focus-height',
  name: 'Focus Height Calculator',
  description: 'Calculate precise focus position to avoid incomplete cuts or burning, optimizing beam focus for different materials and thicknesses.',
  category: 'parameters-settings',
  difficulty: 'advanced',
  estimatedTime: '3-4 minutes',
  
  inputs: [
    {
      id: 'materialType',
      label: 'Material Type',
      type: 'select',
      value: 'carbon_steel',
      options: [
        { value: 'carbon_steel', label: 'Carbon Steel' },
        { value: 'stainless_steel', label: 'Stainless Steel' },
        { value: 'aluminum', label: 'Aluminum' },
        { value: 'copper', label: 'Copper' },
        { value: 'brass', label: 'Brass' },
        { value: 'titanium', label: 'Titanium' },
        { value: 'acrylic', label: 'Acrylic' },
        { value: 'wood', label: 'Wood' },
        { value: 'plywood', label: 'Plywood' },
      ],
      required: true,
      description: 'Select the material to be cut',
    },
    {
      id: 'thickness',
      label: 'Material Thickness',
      type: 'number',
      value: 3,
      unit: 'mm',
      min: 0.1,
      max: 50,
      step: 0.1,
      required: true,
      description: 'Thickness of the material in millimeters',
    },
    {
      id: 'laserType',
      label: 'Laser Type',
      type: 'select',
      value: 'fiber',
      options: [
        { value: 'fiber', label: 'Fiber Laser (1070nm)' },
        { value: 'co2', label: 'CO₂ Laser (10.6μm)' },
        { value: 'nd_yag', label: 'Nd:YAG Laser (1064nm)' },
        { value: 'diode', label: 'Diode Laser (808-980nm)' },
      ],
      required: true,
      description: 'Type of laser system being used',
    },
    {
      id: 'focalLength',
      label: 'Focal Length of Lens',
      type: 'number',
      value: 127,
      unit: 'mm',
      min: 50,
      max: 500,
      step: 1,
      required: true,
      description: 'Focal length of the focusing lens',
    },
    {
      id: 'beamDiameter',
      label: 'Raw Beam Diameter',
      type: 'number',
      value: 6,
      unit: 'mm',
      min: 1,
      max: 25,
      step: 0.1,
      required: true,
      description: 'Diameter of the laser beam before focusing',
    },
    {
      id: 'cuttingApplication',
      label: 'Cutting Application',
      type: 'select',
      value: 'through_cut',
      options: [
        { value: 'through_cut', label: 'Through Cutting' },
        { value: 'engraving', label: 'Surface Engraving' },
        { value: 'marking', label: 'Marking/Etching' },
        { value: 'welding', label: 'Laser Welding' },
        { value: 'drilling', label: 'Hole Drilling' },
      ],
      required: true,
      description: 'Type of laser processing application',
    },
    {
      id: 'assistGas',
      label: 'Assist Gas',
      type: 'select',
      value: 'oxygen',
      options: [
        { value: 'oxygen', label: 'Oxygen (O₂)' },
        { value: 'nitrogen', label: 'Nitrogen (N₂)' },
        { value: 'air', label: 'Compressed Air' },
        { value: 'argon', label: 'Argon (Ar)' },
      ],
      required: true,
      description: 'Type of assist gas being used',
    },
    {
      id: 'qualityRequirement',
      label: 'Quality Requirement',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'rough', label: 'Rough Cut (Fast)' },
        { value: 'standard', label: 'Standard Quality' },
        { value: 'precision', label: 'Precision Cut' },
        { value: 'mirror', label: 'Mirror Finish' },
      ],
      required: true,
      description: 'Required cut quality level',
    },
  ],

  outputs: [
    {
      id: 'focusPosition',
      label: 'Optimal Focus Position',
      type: 'object',
      format: 'focus-settings',
      description: 'Recommended focus height settings',
    },
    {
      id: 'beamCharacteristics',
      label: 'Beam Characteristics',
      type: 'object',
      format: 'beam-analysis',
      description: 'Focused beam properties and spot size',
    },
    {
      id: 'depthOfFocus',
      label: 'Depth of Focus Analysis',
      type: 'object',
      format: 'focus-depth',
      description: 'Rayleigh range and working tolerance',
    },
    {
      id: 'adjustmentGuidance',
      label: 'Focus Adjustment Guidance',
      type: 'array',
      format: 'adjustment-tips',
      description: 'Step-by-step focus adjustment instructions',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      laserType,
      focalLength,
      beamDiameter,
      cuttingApplication,
      assistGas,
      qualityRequirement,
    } = inputs;

    // Calculate optimal focus position
    const focusPosition = calculateOptimalFocus(
      materialType,
      thickness,
      laserType,
      cuttingApplication,
      qualityRequirement
    );

    // Calculate beam characteristics
    const beamCharacteristics = calculateBeamCharacteristics(
      laserType,
      focalLength,
      beamDiameter
    );

    // Calculate depth of focus
    const depthOfFocus = calculateDepthOfFocus(
      beamCharacteristics.spotSize,
      laserType,
      focalLength
    );

    // Generate adjustment guidance
    const adjustmentGuidance = generateAdjustmentGuidance(
      focusPosition,
      materialType,
      thickness,
      cuttingApplication
    );

    return {
      focusPosition,
      beamCharacteristics,
      depthOfFocus,
      adjustmentGuidance,
    };
  },

  validation: {
    thickness: {
      min: 0.1,
      max: 50,
      message: 'Thickness must be between 0.1mm and 50mm',
    },
    focalLength: {
      min: 50,
      max: 500,
      message: 'Focal length must be between 50mm and 500mm',
    },
    beamDiameter: {
      min: 1,
      max: 25,
      message: 'Beam diameter must be between 1mm and 25mm',
    },
  },

  examples: [
    {
      name: '3mm Steel Through Cut',
      description: 'Standard through cutting of 3mm carbon steel',
      inputs: {
        materialType: 'carbon_steel',
        thickness: 3,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
      },
    },
    {
      name: 'Acrylic Engraving',
      description: 'Surface engraving on 5mm acrylic',
      inputs: {
        materialType: 'acrylic',
        thickness: 5,
        laserType: 'co2',
        focalLength: 101.6,
        beamDiameter: 8,
        cuttingApplication: 'engraving',
        assistGas: 'air',
        qualityRequirement: 'precision',
      },
    },
  ],

  tags: ['focus', 'height', 'beam', 'optics', 'precision'],
  
  relatedCalculators: [
    'power-speed-matching',
    'gas-pressure-setting',
    'kerf-width',
    'quality-grade',
  ],

  learningResources: [
    {
      title: 'Laser Focus Fundamentals',
      type: 'article',
      url: '/learn/laser-focus-basics',
    },
    {
      title: 'Focus Height Optimization',
      type: 'video',
      url: '/learn/focus-optimization',
    },
  ],
};

// Helper functions
function calculateOptimalFocus(
  materialType: string,
  thickness: number,
  laserType: string,
  application: string,
  quality: string
) {
  // Base focus positions by application
  const baseFocusPositions = {
    through_cut: {
      thin: -thickness / 3,      // Focus 1/3 into material
      medium: -thickness / 2,    // Focus at middle
      thick: -thickness * 0.6,  // Focus deeper for thick materials
    },
    engraving: 0,               // Focus on surface
    marking: 0,                 // Focus on surface
    welding: 0,                 // Focus on surface
    drilling: -thickness / 4,   // Slightly into material
  };

  let focusOffset = 0;
  
  if (application === 'through_cut') {
    if (thickness <= 2) {
      focusOffset = baseFocusPositions.through_cut.thin;
    } else if (thickness <= 8) {
      focusOffset = baseFocusPositions.through_cut.medium;
    } else {
      focusOffset = baseFocusPositions.through_cut.thick;
    }
  } else {
    focusOffset = baseFocusPositions[application] || 0;
  }

  // Material-specific adjustments
  const materialAdjustments = {
    carbon_steel: 0,
    stainless_steel: -0.2,     // Slightly deeper
    aluminum: 0.1,             // Slightly higher
    copper: -0.3,              // Deeper due to reflectivity
    brass: -0.2,
    titanium: -0.1,
    acrylic: 0,
    wood: 0.2,                 // Higher to avoid burning
    plywood: 0.1,
  };

  focusOffset += materialAdjustments[materialType] || 0;

  // Quality adjustments
  const qualityAdjustments = {
    rough: 0.1,
    standard: 0,
    precision: -0.1,
    mirror: -0.2,
  };

  focusOffset += qualityAdjustments[quality] || 0;

  // Laser type adjustments
  const laserAdjustments = {
    fiber: 0,
    co2: 0.1,
    nd_yag: 0,
    diode: 0.2,
  };

  focusOffset += laserAdjustments[laserType] || 0;

  return {
    position: Math.round(focusOffset * 10) / 10,
    unit: 'mm',
    reference: 'Material surface (negative = into material)',
    reasoning: generateFocusReasoning(application, materialType, thickness),
    tolerance: calculateFocusTolerance(thickness, quality),
  };
}

function calculateBeamCharacteristics(laserType: string, focalLength: number, beamDiameter: number) {
  // Wavelengths in micrometers
  const wavelengths = {
    fiber: 1.07,
    co2: 10.6,
    nd_yag: 1.064,
    diode: 0.9,
  };

  const wavelength = wavelengths[laserType] || 1.07;
  
  // Calculate focused spot size using diffraction-limited formula
  const spotSize = (4 * wavelength * focalLength) / (Math.PI * beamDiameter * 1000); // mm
  
  // Calculate beam quality factor (M²) - typical values
  const beamQualityFactors = {
    fiber: 1.1,
    co2: 1.05,
    nd_yag: 1.2,
    diode: 2.0,
  };

  const mSquared = beamQualityFactors[laserType] || 1.1;
  const actualSpotSize = spotSize * mSquared;

  // Calculate power density (assuming 1kW for reference)
  const spotArea = Math.PI * Math.pow(actualSpotSize / 2, 2); // mm²
  const powerDensity = 1000 / spotArea; // W/mm²

  return {
    spotSize: Math.round(actualSpotSize * 1000) / 1000, // μm
    spotArea: Math.round(spotArea * 1000) / 1000,
    powerDensity: Math.round(powerDensity),
    beamQuality: mSquared,
    wavelength: wavelength,
  };
}

function calculateDepthOfFocus(spotSize: number, laserType: string, focalLength: number) {
  const wavelengths = {
    fiber: 1.07,
    co2: 10.6,
    nd_yag: 1.064,
    diode: 0.9,
  };

  const wavelength = wavelengths[laserType] || 1.07;
  
  // Rayleigh range calculation
  const rayleighRange = (Math.PI * Math.pow(spotSize / 2, 2)) / wavelength; // mm
  const depthOfFocus = 2 * rayleighRange; // Total depth of focus

  return {
    rayleighRange: Math.round(rayleighRange * 100) / 100,
    depthOfFocus: Math.round(depthOfFocus * 100) / 100,
    workingTolerance: Math.round(rayleighRange * 0.5 * 100) / 100,
    unit: 'mm',
    explanation: 'Working tolerance is ±50% of Rayleigh range for practical applications',
  };
}

function generateFocusReasoning(application: string, materialType: string, thickness: number) {
  const reasons = [];
  
  if (application === 'through_cut') {
    if (thickness <= 2) {
      reasons.push('Thin material: Focus near top surface for clean entry');
    } else if (thickness <= 8) {
      reasons.push('Medium thickness: Focus at material center for balanced cut');
    } else {
      reasons.push('Thick material: Focus deeper to ensure complete penetration');
    }
  } else if (application === 'engraving') {
    reasons.push('Surface application: Focus exactly on material surface');
  }
  
  if (materialType === 'copper' || materialType === 'brass') {
    reasons.push('Reflective material: Deeper focus compensates for beam reflection');
  }
  
  if (materialType === 'wood') {
    reasons.push('Organic material: Higher focus prevents excessive burning');
  }
  
  return reasons;
}

function calculateFocusTolerance(thickness: number, quality: string) {
  const baseTolerances = {
    rough: 0.5,
    standard: 0.3,
    precision: 0.2,
    mirror: 0.1,
  };
  
  let tolerance = baseTolerances[quality] || 0.3;
  
  // Adjust for thickness
  if (thickness > 10) {
    tolerance *= 1.5; // More tolerance for thick materials
  } else if (thickness < 1) {
    tolerance *= 0.5; // Less tolerance for thin materials
  }
  
  return {
    value: Math.round(tolerance * 10) / 10,
    unit: 'mm',
    note: 'Focus position tolerance for maintaining cut quality',
  };
}

function generateAdjustmentGuidance(focusPosition: any, materialType: string, thickness: number, application: string) {
  const guidance = [];
  
  guidance.push({
    step: 1,
    action: 'Initial Setup',
    instruction: `Set focus position to ${focusPosition.position}mm from material surface`,
    note: 'Use focus gauge or auto-focus system if available',
  });
  
  guidance.push({
    step: 2,
    action: 'Test Cut',
    instruction: 'Perform a small test cut to verify focus quality',
    note: 'Look for consistent kerf width and clean edges',
  });
  
  if (application === 'through_cut') {
    guidance.push({
      step: 3,
      action: 'Check Penetration',
      instruction: 'Verify complete cut-through with no uncut areas',
      note: 'If incomplete, move focus deeper by 0.2-0.5mm',
    });
  }
  
  guidance.push({
    step: 4,
    action: 'Edge Quality Check',
    instruction: 'Inspect cut edge for smoothness and perpendicularity',
    note: 'Rough edges may indicate incorrect focus position',
  });
  
  if (materialType === 'acrylic' || materialType === 'wood') {
    guidance.push({
      step: 5,
      action: 'Burn Check',
      instruction: 'Check for excessive burning or charring',
      note: 'If present, raise focus position by 0.1-0.3mm',
    });
  }
  
  guidance.push({
    step: 6,
    action: 'Fine Tuning',
    instruction: `Adjust focus within ±${focusPosition.tolerance.value}mm tolerance`,
    note: 'Make small adjustments (0.1mm) and test each change',
  });
  
  return guidance;
}

export default focusHeightConfig;
