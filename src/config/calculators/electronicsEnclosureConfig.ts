import { CalculatorConfig } from '../../types/calculator';

export const electronicsEnclosureConfig: CalculatorConfig = {
  id: 'electronics-enclosure',
  name: 'Electronics Enclosure Calculator',
  description: 'Specialized calculator for electronics enclosures including chassis, panels, and housings with EMI shielding, thermal management, and precision requirements.',
  category: 'precision',
  difficulty: 'expert',
  estimatedTime: '7-8 minutes',
  
  inputs: [
    {
      id: 'enclosureType',
      label: 'Enclosure Type',
      type: 'select',
      value: 'rack_mount_chassis',
      options: [
        { value: 'rack_mount_chassis', label: 'Rack Mount Chassis' },
        { value: 'desktop_enclosure', label: 'Desktop Enclosure' },
        { value: 'wall_mount_box', label: 'Wall Mount Box' },
        { value: 'instrument_case', label: 'Instrument Case' },
        { value: 'control_panel', label: 'Control Panel' },
        { value: 'rf_shielded_box', label: 'RF Shielded Enclosure' },
        { value: 'outdoor_cabinet', label: 'Outdoor Cabinet' },
        { value: 'custom_housing', label: 'Custom Housing' },
      ],
      required: true,
      description: 'Type of electronics enclosure',
    },
    {
      id: 'materialSpecification',
      label: 'Material Specification',
      type: 'select',
      value: 'aluminum_6061',
      options: [
        { value: 'aluminum_6061', label: 'Aluminum 6061-T6' },
        { value: 'aluminum_5052', label: 'Aluminum 5052-H32' },
        { value: 'stainless_304', label: 'Stainless Steel 304' },
        { value: 'stainless_316', label: 'Stainless Steel 316' },
        { value: 'carbon_steel', label: 'Carbon Steel (Plated)' },
        { value: 'copper', label: 'Copper (EMI Shielding)' },
        { value: 'brass', label: 'Brass (RF Applications)' },
        { value: 'titanium', label: 'Titanium (Aerospace)' },
      ],
      required: true,
      description: 'Material for electronics application',
    },
    {
      id: 'panelThickness',
      label: 'Panel Thickness',
      type: 'number',
      value: 2.0,
      unit: 'mm',
      min: 0.5,
      max: 6.0,
      step: 0.1,
      required: true,
      description: 'Thickness of enclosure panels',
    },
    {
      id: 'enclosureSize',
      label: 'Enclosure Size',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'small', label: 'Small (< 1U or < 200mm)' },
        { value: 'medium', label: 'Medium (1-4U or 200-600mm)' },
        { value: 'large', label: 'Large (4-8U or 600-1200mm)' },
        { value: 'extra_large', label: 'Extra Large (> 8U or > 1200mm)' },
      ],
      required: true,
      description: 'Overall size category of enclosure',
    },
    {
      id: 'precisionRequirement',
      label: 'Precision Requirement',
      type: 'select',
      value: 'high_precision',
      options: [
        { value: 'standard', label: 'Standard (±0.2mm)' },
        { value: 'high_precision', label: 'High Precision (±0.1mm)' },
        { value: 'ultra_precision', label: 'Ultra Precision (±0.05mm)' },
        { value: 'micro_precision', label: 'Micro Precision (±0.02mm)' },
      ],
      required: true,
      description: 'Required dimensional precision',
    },
    {
      id: 'emiShielding',
      label: 'EMI Shielding Requirement',
      type: 'select',
      value: 'standard_shielding',
      options: [
        { value: 'none', label: 'No EMI Shielding Required' },
        { value: 'basic_shielding', label: 'Basic Shielding (40-60 dB)' },
        { value: 'standard_shielding', label: 'Standard Shielding (60-80 dB)' },
        { value: 'high_shielding', label: 'High Shielding (80-100 dB)' },
        { value: 'military_grade', label: 'Military Grade (> 100 dB)' },
      ],
      required: true,
      description: 'Electromagnetic interference shielding requirements',
    },
    {
      id: 'thermalManagement',
      label: 'Thermal Management',
      type: 'select',
      value: 'active_cooling',
      options: [
        { value: 'passive_only', label: 'Passive Cooling Only' },
        { value: 'enhanced_passive', label: 'Enhanced Passive (Heat Sinks)' },
        { value: 'active_cooling', label: 'Active Cooling (Fans)' },
        { value: 'liquid_cooling', label: 'Liquid Cooling Ready' },
        { value: 'extreme_cooling', label: 'Extreme Cooling Requirements' },
      ],
      required: true,
      description: 'Thermal management requirements',
    },
    {
      id: 'environmentalRating',
      label: 'Environmental Rating',
      type: 'select',
      value: 'ip54',
      options: [
        { value: 'ip20', label: 'IP20 (Indoor, Basic Protection)' },
        { value: 'ip40', label: 'IP40 (Indoor, Enhanced Protection)' },
        { value: 'ip54', label: 'IP54 (Dust/Water Resistant)' },
        { value: 'ip65', label: 'IP65 (Dust/Water Proof)' },
        { value: 'ip67', label: 'IP67 (Submersion Resistant)' },
        { value: 'nema_4x', label: 'NEMA 4X (Corrosion Resistant)' },
      ],
      required: true,
      description: 'Required environmental protection rating',
    },
    {
      id: 'featureComplexity',
      label: 'Feature Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (Basic box, minimal features)' },
        { value: 'moderate', label: 'Moderate (Mounting holes, ventilation)' },
        { value: 'complex', label: 'Complex (Multiple panels, intricate features)' },
        { value: 'ultra_complex', label: 'Ultra Complex (Precision features, tight tolerances)' },
      ],
      required: true,
      description: 'Complexity of enclosure features and geometry',
    },
    {
      id: 'productionVolume',
      label: 'Production Volume',
      type: 'select',
      value: 'medium_volume',
      options: [
        { value: 'prototype', label: 'Prototype (1-5 units)' },
        { value: 'low_volume', label: 'Low Volume (5-50 units)' },
        { value: 'medium_volume', label: 'Medium Volume (50-500 units)' },
        { value: 'high_volume', label: 'High Volume (500+ units)' },
      ],
      required: true,
      description: 'Expected production volume',
    },
  ],

  outputs: [
    {
      id: 'precisionAnalysis',
      label: 'Precision Analysis',
      type: 'object',
      format: 'electronics-precision-specs',
      description: 'Precision manufacturing and tolerance analysis',
    },
    {
      id: 'shieldingDesign',
      label: 'Shielding Design',
      type: 'object',
      format: 'electronics-shielding-specs',
      description: 'EMI shielding design and material specifications',
    },
    {
      id: 'thermalDesign',
      label: 'Thermal Design',
      type: 'object',
      format: 'electronics-thermal-specs',
      description: 'Thermal management and heat dissipation analysis',
    },
    {
      id: 'manufacturingCost',
      label: 'Manufacturing Cost',
      type: 'object',
      format: 'electronics-cost-analysis',
      description: 'Precision manufacturing cost analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      enclosureType,
      materialSpecification,
      panelThickness,
      enclosureSize,
      precisionRequirement,
      emiShielding,
      thermalManagement,
      environmentalRating,
      featureComplexity,
      productionVolume,
    } = inputs;

    // Analyze precision requirements
    const precisionAnalysis = analyzeElectronicsPrecision(
      precisionRequirement,
      featureComplexity,
      materialSpecification,
      panelThickness,
      enclosureType
    );

    // Design EMI shielding
    const shieldingDesign = designEMIShielding(
      emiShielding,
      materialSpecification,
      enclosureType,
      environmentalRating,
      panelThickness
    );

    // Analyze thermal requirements
    const thermalDesign = analyzeThermalDesign(
      thermalManagement,
      enclosureSize,
      materialSpecification,
      panelThickness,
      environmentalRating
    );

    // Calculate manufacturing costs
    const manufacturingCost = calculateElectronicsManufacturingCost(
      enclosureSize,
      materialSpecification,
      panelThickness,
      precisionRequirement,
      featureComplexity,
      productionVolume,
      precisionAnalysis
    );

    return {
      precisionAnalysis,
      shieldingDesign,
      thermalDesign,
      manufacturingCost,
    };
  },

  validation: {
    panelThickness: {
      min: 0.5,
      max: 6.0,
      message: 'Panel thickness must be between 0.5mm and 6.0mm for electronics enclosures',
    },
  },

  examples: [
    {
      name: '19" Rack Mount Chassis',
      description: 'Standard 19-inch rack mount chassis for server applications',
      inputs: {
        enclosureType: 'rack_mount_chassis',
        materialSpecification: 'aluminum_6061',
        panelThickness: 2.0,
        enclosureSize: 'large',
        precisionRequirement: 'high_precision',
        emiShielding: 'standard_shielding',
        thermalManagement: 'active_cooling',
        environmentalRating: 'ip40',
        featureComplexity: 'complex',
        productionVolume: 'medium_volume',
      },
    },
    {
      name: 'RF Test Equipment Housing',
      description: 'High-performance RF shielded enclosure for test equipment',
      inputs: {
        enclosureType: 'rf_shielded_box',
        materialSpecification: 'copper',
        panelThickness: 1.5,
        enclosureSize: 'medium',
        precisionRequirement: 'ultra_precision',
        emiShielding: 'military_grade',
        thermalManagement: 'enhanced_passive',
        environmentalRating: 'ip54',
        featureComplexity: 'ultra_complex',
        productionVolume: 'low_volume',
      },
    },
  ],

  tags: ['electronics', 'enclosure', 'precision', 'emi-shielding', 'thermal'],
  
  relatedCalculators: [
    'precision-cutting',
    'emi-shielding',
    'thermal-analysis',
    'tolerance-analysis',
  ],

  learningResources: [
    {
      title: 'Electronics Enclosure Design',
      type: 'article',
      url: '/learn/electronics-enclosure-design',
    },
    {
      title: 'EMI Shielding Fundamentals',
      type: 'video',
      url: '/learn/emi-shielding',
    },
  ],
};

// Helper functions
function analyzeElectronicsPrecision(
  precisionReq: string,
  complexity: string,
  material: string,
  thickness: number,
  enclosureType: string
) {
  const toleranceSpecs = getPrecisionTolerances(precisionReq);
  const manufacturingRequirements = getManufacturingRequirements(precisionReq, complexity);
  const materialConsiderations = getMaterialPrecisionFactors(material, thickness);
  
  return {
    toleranceSpecifications: toleranceSpecs,
    manufacturingRequirements,
    materialConsiderations,
    qualityControl: getQualityControlRequirements(precisionReq, enclosureType),
    cuttingParameters: getPrecisionCuttingParameters(precisionReq, material, thickness),
    postProcessing: getPostProcessingRequirements(precisionReq, material),
  };
}

function getPrecisionTolerances(precisionReq: string) {
  const tolerances = {
    standard: {
      linear: '±0.2mm',
      angular: '±1°',
      flatness: '0.2mm per 100mm',
      straightness: '0.1mm per 100mm',
      perpendicularity: '±0.3mm',
      concentricity: '±0.4mm',
    },
    high_precision: {
      linear: '±0.1mm',
      angular: '±0.5°',
      flatness: '0.1mm per 100mm',
      straightness: '0.05mm per 100mm',
      perpendicularity: '±0.15mm',
      concentricity: '±0.2mm',
    },
    ultra_precision: {
      linear: '±0.05mm',
      angular: '±0.25°',
      flatness: '0.05mm per 100mm',
      straightness: '0.025mm per 100mm',
      perpendicularity: '±0.075mm',
      concentricity: '±0.1mm',
    },
    micro_precision: {
      linear: '±0.02mm',
      angular: '±0.1°',
      flatness: '0.02mm per 100mm',
      straightness: '0.01mm per 100mm',
      perpendicularity: '±0.03mm',
      concentricity: '±0.04mm',
    },
  };
  
  return tolerances[precisionReq] || tolerances.high_precision;
}

function getManufacturingRequirements(precisionReq: string, complexity: string) {
  const requirements = [];
  
  if (precisionReq === 'micro_precision') {
    requirements.push('Ultra-precision laser cutting with beam quality M² < 1.1');
    requirements.push('Temperature-controlled manufacturing environment');
    requirements.push('Coordinate measuring machine (CMM) inspection');
    requirements.push('Specialized fixturing and workholding');
  } else if (precisionReq === 'ultra_precision') {
    requirements.push('High-precision laser cutting with stable beam');
    requirements.push('Climate-controlled manufacturing area');
    requirements.push('Precision measurement equipment');
    requirements.push('Careful material handling procedures');
  } else if (precisionReq === 'high_precision') {
    requirements.push('Precision laser cutting with quality optics');
    requirements.push('Stable manufacturing environment');
    requirements.push('Calibrated measuring instruments');
    requirements.push('Standard precision practices');
  } else {
    requirements.push('Standard laser cutting equipment');
    requirements.push('Normal manufacturing environment');
    requirements.push('Standard measuring tools');
    requirements.push('Basic quality control procedures');
  }
  
  if (complexity === 'ultra_complex') {
    requirements.push('Multi-axis machining capabilities');
    requirements.push('Advanced CAM programming');
    requirements.push('Specialized tooling design');
  }
  
  return requirements;
}

function getMaterialPrecisionFactors(material: string, thickness: number) {
  const materialFactors = {
    aluminum_6061: {
      stability: 'Excellent',
      machinability: 'Excellent',
      thermalExpansion: '23.6 × 10⁻⁶ /°C',
      considerations: ['Good dimensional stability', 'Easy to machine to tight tolerances'],
    },
    aluminum_5052: {
      stability: 'Very Good',
      machinability: 'Good',
      thermalExpansion: '23.8 × 10⁻⁶ /°C',
      considerations: ['Good formability', 'Moderate precision capability'],
    },
    stainless_304: {
      stability: 'Good',
      machinability: 'Moderate',
      thermalExpansion: '17.3 × 10⁻⁶ /°C',
      considerations: ['Work hardening tendency', 'Requires sharp tools'],
    },
    stainless_316: {
      stability: 'Good',
      machinability: 'Moderate',
      thermalExpansion: '16.0 × 10⁻⁶ /°C',
      considerations: ['Superior corrosion resistance', 'Challenging to machine'],
    },
    carbon_steel: {
      stability: 'Good',
      machinability: 'Excellent',
      thermalExpansion: '12.0 × 10⁻⁶ /°C',
      considerations: ['Good precision capability', 'Requires corrosion protection'],
    },
    copper: {
      stability: 'Fair',
      machinability: 'Good',
      thermalExpansion: '17.0 × 10⁻⁶ /°C',
      considerations: ['High thermal conductivity', 'Soft material challenges'],
    },
    brass: {
      stability: 'Good',
      machinability: 'Excellent',
      thermalExpansion: '19.0 × 10⁻⁶ /°C',
      considerations: ['Excellent machinability', 'Good precision potential'],
    },
    titanium: {
      stability: 'Excellent',
      machinability: 'Challenging',
      thermalExpansion: '8.6 × 10⁻⁶ /°C',
      considerations: ['Superior stability', 'Requires specialized techniques'],
    },
  };
  
  const factors = materialFactors[material] || materialFactors.aluminum_6061;
  
  // Add thickness considerations
  if (thickness < 1.0) {
    factors.considerations.push('Thin material requires careful handling');
    factors.considerations.push('Risk of distortion during processing');
  } else if (thickness > 4.0) {
    factors.considerations.push('Thick material may require multiple passes');
    factors.considerations.push('Heat management critical for precision');
  }
  
  return factors;
}

function getQualityControlRequirements(precisionReq: string, enclosureType: string) {
  const requirements = {
    inspection: [],
    documentation: [],
    testing: [],
    certification: [],
  };
  
  // Inspection requirements
  if (precisionReq === 'micro_precision') {
    requirements.inspection.push('CMM inspection of all critical dimensions');
    requirements.inspection.push('Surface roughness measurement');
    requirements.inspection.push('Geometric tolerance verification');
    requirements.inspection.push('100% dimensional inspection');
  } else if (precisionReq === 'ultra_precision') {
    requirements.inspection.push('Precision measurement of critical features');
    requirements.inspection.push('Statistical sampling inspection');
    requirements.inspection.push('Geometric tolerance checking');
  } else {
    requirements.inspection.push('Standard dimensional inspection');
    requirements.inspection.push('Visual quality inspection');
    requirements.inspection.push('Functional fit testing');
  }
  
  // Documentation requirements
  requirements.documentation.push('Dimensional inspection reports');
  requirements.documentation.push('Material certificates');
  requirements.documentation.push('Process parameter records');
  
  if (['rf_shielded_box', 'military_grade'].includes(enclosureType)) {
    requirements.documentation.push('Traceability documentation');
    requirements.documentation.push('Special process certifications');
  }
  
  // Testing requirements
  if (enclosureType === 'rf_shielded_box') {
    requirements.testing.push('EMI shielding effectiveness testing');
    requirements.testing.push('RF leakage testing');
  }
  
  requirements.testing.push('Fit and function testing');
  requirements.testing.push('Environmental testing (if required)');
  
  return requirements;
}

function getPrecisionCuttingParameters(precisionReq: string, material: string, thickness: number) {
  const baseParams = {
    standard: {
      speedReduction: 1.0,
      powerIncrease: 1.0,
      passCount: 1,
      focusAccuracy: '±0.1mm',
    },
    high_precision: {
      speedReduction: 0.8,
      powerIncrease: 1.1,
      passCount: 1,
      focusAccuracy: '±0.05mm',
    },
    ultra_precision: {
      speedReduction: 0.6,
      powerIncrease: 1.2,
      passCount: 2,
      focusAccuracy: '±0.025mm',
    },
    micro_precision: {
      speedReduction: 0.4,
      powerIncrease: 1.3,
      passCount: 3,
      focusAccuracy: '±0.01mm',
    },
  };
  
  const params = baseParams[precisionReq] || baseParams.high_precision;
  
  return {
    cuttingSpeed: `${Math.round(params.speedReduction * 100)}% of standard speed`,
    laserPower: `${Math.round(params.powerIncrease * 100)}% of standard power`,
    numberOfPasses: params.passCount,
    focusAccuracy: params.focusAccuracy,
    beamQuality: precisionReq === 'micro_precision' ? 'M² < 1.1' : 'M² < 1.3',
    assistGas: getOptimalAssistGas(material, precisionReq),
    nozzleSize: getPrecisionNozzleSize(thickness, precisionReq),
  };
}

function getOptimalAssistGas(material: string, precisionReq: string) {
  const gasRecommendations = {
    aluminum_6061: 'Nitrogen (high purity)',
    aluminum_5052: 'Nitrogen (high purity)',
    stainless_304: 'Nitrogen (ultra-high purity)',
    stainless_316: 'Nitrogen (ultra-high purity)',
    carbon_steel: precisionReq === 'micro_precision' ? 'Nitrogen' : 'Oxygen',
    copper: 'Nitrogen (high purity)',
    brass: 'Nitrogen (high purity)',
    titanium: 'Argon (ultra-high purity)',
  };
  
  return gasRecommendations[material] || 'Nitrogen (high purity)';
}

function getPrecisionNozzleSize(thickness: number, precisionReq: string) {
  if (precisionReq === 'micro_precision') {
    return thickness <= 1.0 ? '0.8mm' : '1.0mm';
  } else if (precisionReq === 'ultra_precision') {
    return thickness <= 2.0 ? '1.0mm' : '1.2mm';
  } else {
    return thickness <= 3.0 ? '1.2mm' : '1.5mm';
  }
}

function getPostProcessingRequirements(precisionReq: string, material: string) {
  const requirements = [];
  
  // Deburring
  if (precisionReq === 'micro_precision') {
    requirements.push({
      process: 'Precision Deburring',
      method: 'Manual with precision tools',
      specification: 'Edge radius < 0.05mm',
    });
  } else {
    requirements.push({
      process: 'Standard Deburring',
      method: 'Tumbling or manual',
      specification: 'No sharp edges',
    });
  }
  
  // Surface treatment
  if (['stainless_304', 'stainless_316'].includes(material)) {
    requirements.push({
      process: 'Passivation',
      method: 'Chemical passivation',
      specification: 'ASTM A967 compliance',
    });
  }
  
  // Precision cleaning
  if (precisionReq === 'micro_precision' || precisionReq === 'ultra_precision') {
    requirements.push({
      process: 'Precision Cleaning',
      method: 'Ultrasonic cleaning',
      specification: 'Residue-free surface',
    });
  }
  
  return requirements;
}

export default electronicsEnclosureConfig;
