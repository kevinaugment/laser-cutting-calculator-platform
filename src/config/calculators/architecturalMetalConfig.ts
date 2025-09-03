import { CalculatorConfig } from '../../types/calculator';

export const architecturalMetalConfig: CalculatorConfig = {
  id: 'architectural-metal',
  name: 'Architectural Metal Calculator',
  description: 'Specialized calculator for architectural metalwork including facades, structural elements, and decorative features with building code compliance and aesthetic requirements.',
  category: 'construction',
  difficulty: 'advanced',
  estimatedTime: '6-7 minutes',
  
  inputs: [
    {
      id: 'architecturalElement',
      label: 'Architectural Element',
      type: 'select',
      value: 'facade_panel',
      options: [
        { value: 'facade_panel', label: 'Facade Panel/Cladding' },
        { value: 'structural_beam', label: 'Structural Beam/Column' },
        { value: 'decorative_screen', label: 'Decorative Screen/Grille' },
        { value: 'window_frame', label: 'Window Frame Component' },
        { value: 'canopy_structure', label: 'Canopy/Awning Structure' },
        { value: 'balustrade', label: 'Balustrade/Railing' },
        { value: 'architectural_feature', label: 'Custom Architectural Feature' },
      ],
      required: true,
      description: 'Type of architectural metal element',
    },
    {
      id: 'materialType',
      label: 'Material Type',
      type: 'select',
      value: 'aluminum_6061',
      options: [
        { value: 'aluminum_6061', label: 'Aluminum 6061-T6' },
        { value: 'aluminum_5052', label: 'Aluminum 5052-H32' },
        { value: 'aluminum_3003', label: 'Aluminum 3003-H14' },
        { value: 'stainless_304', label: 'Stainless Steel 304' },
        { value: 'stainless_316', label: 'Stainless Steel 316' },
        { value: 'weathering_steel', label: 'Weathering Steel (Corten)' },
        { value: 'galvanized_steel', label: 'Galvanized Steel' },
        { value: 'carbon_steel', label: 'Carbon Steel (Painted)' },
      ],
      required: true,
      description: 'Material for architectural application',
    },
    {
      id: 'materialThickness',
      label: 'Material Thickness',
      type: 'number',
      value: 3.0,
      unit: 'mm',
      min: 1.0,
      max: 12.0,
      step: 0.5,
      required: true,
      description: 'Thickness of architectural metal',
    },
    {
      id: 'elementLength',
      label: 'Element Length',
      type: 'number',
      value: 2400,
      unit: 'mm',
      min: 300,
      max: 6000,
      step: 100,
      required: true,
      description: 'Length of architectural element',
    },
    {
      id: 'elementWidth',
      label: 'Element Width',
      type: 'number',
      value: 1200,
      unit: 'mm',
      min: 200,
      max: 3000,
      step: 50,
      required: true,
      description: 'Width of architectural element',
    },
    {
      id: 'designComplexity',
      label: 'Design Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (Basic shapes, minimal features)' },
        { value: 'moderate', label: 'Moderate (Patterns, openings, bends)' },
        { value: 'complex', label: 'Complex (Intricate patterns, 3D forms)' },
        { value: 'artistic', label: 'Artistic (Custom designs, sculptures)' },
      ],
      required: true,
      description: 'Complexity of architectural design',
    },
    {
      id: 'weatherExposure',
      label: 'Weather Exposure',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'interior', label: 'Interior (No weather exposure)' },
        { value: 'covered', label: 'Covered Exterior (Protected)' },
        { value: 'moderate', label: 'Moderate Exposure (Standard)' },
        { value: 'severe', label: 'Severe (Coastal, Industrial)' },
        { value: 'extreme', label: 'Extreme (Marine, Chemical)' },
      ],
      required: true,
      description: 'Level of weather and environmental exposure',
    },
    {
      id: 'buildingCode',
      label: 'Building Code',
      type: 'select',
      value: 'ibc',
      options: [
        { value: 'ibc', label: 'IBC (International Building Code)' },
        { value: 'nbc', label: 'NBC (National Building Code)' },
        { value: 'eurocode', label: 'Eurocode (European Standards)' },
        { value: 'local', label: 'Local Building Code' },
        { value: 'custom', label: 'Custom Specifications' },
      ],
      required: true,
      description: 'Applicable building code or standard',
    },
    {
      id: 'fireRating',
      label: 'Fire Rating Requirement',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'none', label: 'No Fire Rating Required' },
        { value: 'standard', label: 'Standard Fire Resistance' },
        { value: 'one_hour', label: '1-Hour Fire Rating' },
        { value: 'two_hour', label: '2-Hour Fire Rating' },
        { value: 'four_hour', label: '4-Hour Fire Rating' },
      ],
      required: true,
      description: 'Required fire resistance rating',
    },
    {
      id: 'projectScale',
      label: 'Project Scale',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'small', label: 'Small Project (< 100 pieces)' },
        { value: 'medium', label: 'Medium Project (100-500 pieces)' },
        { value: 'large', label: 'Large Project (500-2000 pieces)' },
        { value: 'mega', label: 'Mega Project (2000+ pieces)' },
      ],
      required: true,
      description: 'Scale of architectural project',
    },
  ],

  outputs: [
    {
      id: 'structuralAnalysis',
      label: 'Structural Analysis',
      type: 'object',
      format: 'architectural-structural-specs',
      description: 'Structural performance analysis for architectural loads',
    },
    {
      id: 'cuttingSpecification',
      label: 'Cutting Specification',
      type: 'object',
      format: 'architectural-cutting-params',
      description: 'Optimized cutting parameters for architectural metals',
    },
    {
      id: 'complianceRequirements',
      label: 'Compliance Requirements',
      type: 'object',
      format: 'architectural-compliance-specs',
      description: 'Building code compliance and certification requirements',
    },
    {
      id: 'projectCost',
      label: 'Project Cost',
      type: 'object',
      format: 'architectural-cost-analysis',
      description: 'Comprehensive cost analysis for architectural metalwork project',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      architecturalElement,
      materialType,
      materialThickness,
      elementLength,
      elementWidth,
      designComplexity,
      weatherExposure,
      buildingCode,
      fireRating,
      projectScale,
    } = inputs;

    // Analyze structural requirements
    const structuralAnalysis = analyzeArchitecturalStructural(
      architecturalElement,
      materialType,
      materialThickness,
      elementLength,
      elementWidth,
      weatherExposure
    );

    // Calculate cutting specifications
    const cuttingSpecification = calculateArchitecturalCutting(
      materialType,
      materialThickness,
      designComplexity,
      architecturalElement
    );

    // Define compliance requirements
    const complianceRequirements = defineArchitecturalCompliance(
      buildingCode,
      fireRating,
      architecturalElement,
      materialType,
      weatherExposure
    );

    // Calculate project costs
    const projectCost = calculateArchitecturalProjectCost(
      elementLength,
      elementWidth,
      materialThickness,
      materialType,
      designComplexity,
      projectScale,
      weatherExposure,
      cuttingSpecification
    );

    return {
      structuralAnalysis,
      cuttingSpecification,
      complianceRequirements,
      projectCost,
    };
  },

  validation: {
    materialThickness: {
      min: 1.0,
      max: 12.0,
      message: 'Material thickness must be between 1.0mm and 12.0mm for architectural applications',
    },
    elementLength: {
      min: 300,
      max: 6000,
      message: 'Element length must be between 300mm and 6000mm',
    },
    elementWidth: {
      min: 200,
      max: 3000,
      message: 'Element width must be between 200mm and 3000mm',
    },
  },

  examples: [
    {
      name: 'Facade Cladding Panel',
      description: 'Aluminum facade panel for commercial building',
      inputs: {
        architecturalElement: 'facade_panel',
        materialType: 'aluminum_6061',
        materialThickness: 4.0,
        elementLength: 3000,
        elementWidth: 1500,
        designComplexity: 'moderate',
        weatherExposure: 'moderate',
        buildingCode: 'ibc',
        fireRating: 'standard',
        projectScale: 'large',
      },
    },
    {
      name: 'Decorative Screen',
      description: 'Stainless steel decorative screen with intricate pattern',
      inputs: {
        architecturalElement: 'decorative_screen',
        materialType: 'stainless_304',
        materialThickness: 2.0,
        elementLength: 2400,
        elementWidth: 1200,
        designComplexity: 'artistic',
        weatherExposure: 'severe',
        buildingCode: 'ibc',
        fireRating: 'none',
        projectScale: 'medium',
      },
    },
  ],

  tags: ['architectural', 'construction', 'facade', 'structural', 'building-code'],
  
  relatedCalculators: [
    'structural-analysis',
    'wind-load-analysis',
    'thermal-expansion',
    'corrosion-resistance',
  ],

  learningResources: [
    {
      title: 'Architectural Metal Design Guide',
      type: 'article',
      url: '/learn/architectural-metal-design',
    },
    {
      title: 'Building Code Compliance',
      type: 'video',
      url: '/learn/building-code-compliance',
    },
  ],
};

// Helper functions
function analyzeArchitecturalStructural(
  elementType: string,
  materialType: string,
  thickness: number,
  length: number,
  width: number,
  weatherExposure: string
) {
  const materialProperties = getArchitecturalMaterialProperties(materialType);
  const loadAnalysis = calculateArchitecturalLoads(elementType, length, width, weatherExposure);
  const structuralCapacity = calculateStructuralCapacity(materialType, thickness, length, width);
  
  return {
    materialProperties,
    loadAnalysis,
    structuralCapacity,
    deflectionAnalysis: calculateDeflectionAnalysis(materialType, thickness, length, width, loadAnalysis),
    connectionRequirements: getConnectionRequirements(elementType, loadAnalysis),
    thermalConsiderations: getThermalConsiderations(materialType, length, weatherExposure),
  };
}

function getArchitecturalMaterialProperties(materialType: string) {
  const materials = {
    aluminum_6061: {
      tensileStrength: '310 MPa',
      yieldStrength: '276 MPa',
      elasticModulus: '69 GPa',
      density: '2700 kg/m³',
      thermalExpansion: '23.6 × 10⁻⁶ /°C',
      corrosionResistance: 'Excellent',
      weldability: 'Good',
      machinability: 'Excellent',
      cost: 'Medium',
      applications: ['Facades', 'Window frames', 'Structural elements'],
    },
    aluminum_5052: {
      tensileStrength: '228 MPa',
      yieldStrength: '193 MPa',
      elasticModulus: '70 GPa',
      density: '2680 kg/m³',
      thermalExpansion: '23.8 × 10⁻⁶ /°C',
      corrosionResistance: 'Excellent',
      weldability: 'Excellent',
      machinability: 'Good',
      cost: 'Medium',
      applications: ['Marine applications', 'Decorative panels'],
    },
    aluminum_3003: {
      tensileStrength: '145 MPa',
      yieldStrength: '125 MPa',
      elasticModulus: '69 GPa',
      density: '2730 kg/m³',
      thermalExpansion: '23.2 × 10⁻⁶ /°C',
      corrosionResistance: 'Very Good',
      weldability: 'Excellent',
      machinability: 'Excellent',
      cost: 'Low-Medium',
      applications: ['General purpose', 'Non-structural panels'],
    },
    stainless_304: {
      tensileStrength: '515 MPa',
      yieldStrength: '205 MPa',
      elasticModulus: '200 GPa',
      density: '8000 kg/m³',
      thermalExpansion: '17.3 × 10⁻⁶ /°C',
      corrosionResistance: 'Excellent',
      weldability: 'Excellent',
      machinability: 'Good',
      cost: 'High',
      applications: ['Decorative elements', 'High-end facades'],
    },
    stainless_316: {
      tensileStrength: '580 MPa',
      yieldStrength: '290 MPa',
      elasticModulus: '200 GPa',
      density: '8000 kg/m³',
      thermalExpansion: '16.0 × 10⁻⁶ /°C',
      corrosionResistance: 'Outstanding',
      weldability: 'Excellent',
      machinability: 'Good',
      cost: 'Very High',
      applications: ['Marine environments', 'Chemical exposure'],
    },
    weathering_steel: {
      tensileStrength: '485 MPa',
      yieldStrength: '345 MPa',
      elasticModulus: '200 GPa',
      density: '7850 kg/m³',
      thermalExpansion: '12.0 × 10⁻⁶ /°C',
      corrosionResistance: 'Self-protecting',
      weldability: 'Good',
      machinability: 'Good',
      cost: 'Medium',
      applications: ['Exposed structures', 'Artistic elements'],
    },
    galvanized_steel: {
      tensileStrength: '400 MPa',
      yieldStrength: '275 MPa',
      elasticModulus: '200 GPa',
      density: '7850 kg/m³',
      thermalExpansion: '12.0 × 10⁻⁶ /°C',
      corrosionResistance: 'Very Good',
      weldability: 'Fair',
      machinability: 'Good',
      cost: 'Low-Medium',
      applications: ['Structural elements', 'Cost-effective solutions'],
    },
    carbon_steel: {
      tensileStrength: '400 MPa',
      yieldStrength: '250 MPa',
      elasticModulus: '200 GPa',
      density: '7850 kg/m³',
      thermalExpansion: '12.0 × 10⁻⁶ /°C',
      corrosionResistance: 'Poor (requires coating)',
      weldability: 'Excellent',
      machinability: 'Excellent',
      cost: 'Low',
      applications: ['Painted structures', 'Interior elements'],
    },
  };
  
  return materials[materialType] || materials.aluminum_6061;
}

function calculateArchitecturalLoads(elementType: string, length: number, width: number, weatherExposure: string) {
  const area = (length * width) / 1000000; // m²
  
  // Wind loads based on exposure
  const windLoads = {
    interior: 0,
    covered: 0.5,
    moderate: 1.5,
    severe: 2.5,
    extreme: 4.0,
  };
  
  const windPressure = windLoads[weatherExposure] || 1.5; // kPa
  const windLoad = windPressure * area; // kN
  
  // Dead loads (self-weight and attachments)
  const deadLoadFactors = {
    facade_panel: 0.5,
    structural_beam: 2.0,
    decorative_screen: 0.3,
    window_frame: 0.8,
    canopy_structure: 1.5,
    balustrade: 1.0,
    architectural_feature: 0.7,
  };
  
  const deadLoadFactor = deadLoadFactors[elementType] || 0.5;
  const deadLoad = area * deadLoadFactor; // kN
  
  // Live loads (maintenance, snow, etc.)
  const liveLoadFactors = {
    facade_panel: 0.2,
    structural_beam: 2.5,
    decorative_screen: 0.1,
    window_frame: 0.3,
    canopy_structure: 2.0,
    balustrade: 1.5,
    architectural_feature: 0.5,
  };
  
  const liveLoadFactor = liveLoadFactors[elementType] || 0.2;
  const liveLoad = area * liveLoadFactor; // kN
  
  return {
    windLoad: Math.round(windLoad * 10) / 10,
    deadLoad: Math.round(deadLoad * 10) / 10,
    liveLoad: Math.round(liveLoad * 10) / 10,
    totalLoad: Math.round((windLoad + deadLoad + liveLoad) * 10) / 10,
    designLoad: Math.round((windLoad * 1.6 + deadLoad * 1.2 + liveLoad * 1.6) * 10) / 10, // Load factors
    loadCombinations: getLoadCombinations(windLoad, deadLoad, liveLoad),
  };
}

function getLoadCombinations(wind: number, dead: number, live: number) {
  return [
    {
      combination: 'Dead + Live',
      load: Math.round((dead * 1.2 + live * 1.6) * 10) / 10,
      description: 'Standard gravity load combination',
    },
    {
      combination: 'Dead + Wind',
      load: Math.round((dead * 1.2 + wind * 1.6) * 10) / 10,
      description: 'Wind load combination',
    },
    {
      combination: 'Dead + Live + Wind',
      load: Math.round((dead * 1.2 + live * 1.0 + wind * 1.0) * 10) / 10,
      description: 'Combined load case',
    },
  ];
}

function calculateStructuralCapacity(materialType: string, thickness: number, length: number, width: number) {
  const materialProps = getArchitecturalMaterialProperties(materialType);
  
  // Extract yield strength
  const yieldStrength = parseFloat(materialProps.yieldStrength.split(' ')[0]); // MPa
  
  // Calculate section properties
  const area = thickness * width; // mm²
  const momentOfInertia = (width * Math.pow(thickness, 3)) / 12; // mm⁴
  const sectionModulus = momentOfInertia / (thickness / 2); // mm³
  
  // Calculate capacities
  const tensileCapacity = (area * yieldStrength) / 1000; // kN
  const bendingCapacity = (sectionModulus * yieldStrength) / 1000000; // kN⋅m
  
  return {
    crossSectionalArea: Math.round(area),
    momentOfInertia: Math.round(momentOfInertia),
    sectionModulus: Math.round(sectionModulus),
    tensileCapacity: Math.round(tensileCapacity * 10) / 10,
    bendingCapacity: Math.round(bendingCapacity * 10) / 10,
    allowableStress: Math.round(yieldStrength / 2.5), // Factor of safety 2.5
    capacityRating: getCapacityRating(tensileCapacity, bendingCapacity),
  };
}

function getCapacityRating(tensile: number, bending: number) {
  const totalCapacity = tensile + bending * 10; // Weighted combination
  
  if (totalCapacity > 1000) return 'Very High Capacity';
  if (totalCapacity > 500) return 'High Capacity';
  if (totalCapacity > 200) return 'Moderate Capacity';
  if (totalCapacity > 50) return 'Low Capacity';
  return 'Very Low Capacity';
}

function calculateDeflectionAnalysis(
  materialType: string,
  thickness: number,
  length: number,
  width: number,
  loadAnalysis: any
) {
  const materialProps = getArchitecturalMaterialProperties(materialType);
  const elasticModulus = parseFloat(materialProps.elasticModulus.split(' ')[0]) * 1000; // MPa
  
  const momentOfInertia = (width * Math.pow(thickness, 3)) / 12; // mm⁴
  const span = length; // mm
  const load = loadAnalysis.designLoad * 1000; // N
  
  // Simply supported beam deflection: δ = 5wL⁴/(384EI)
  const deflection = (5 * load * Math.pow(span, 3)) / (384 * elasticModulus * momentOfInertia);
  const deflectionRatio = span / deflection;
  
  // Allowable deflection limits
  const allowableRatio = 250; // L/250 for architectural elements
  
  return {
    calculatedDeflection: Math.round(deflection * 100) / 100,
    deflectionRatio: Math.round(deflectionRatio),
    allowableDeflection: Math.round(span / allowableRatio * 100) / 100,
    allowableRatio,
    compliance: deflectionRatio > allowableRatio ? 'Compliant' : 'Non-compliant',
    recommendation: getDeflectionRecommendation(deflectionRatio, allowableRatio),
  };
}

function getDeflectionRecommendation(actual: number, allowable: number) {
  if (actual > allowable * 1.5) {
    return 'Excellent stiffness - consider optimization';
  } else if (actual > allowable) {
    return 'Adequate stiffness - meets requirements';
  } else if (actual > allowable * 0.8) {
    return 'Marginal stiffness - consider reinforcement';
  } else {
    return 'Insufficient stiffness - increase thickness or add support';
  }
}

function getConnectionRequirements(elementType: string, loadAnalysis: any) {
  const connectionTypes = {
    facade_panel: {
      primary: 'Structural glazing or mechanical fasteners',
      spacing: '600-800mm centers',
      capacity: 'Design for wind uplift and thermal movement',
    },
    structural_beam: {
      primary: 'Welded or bolted connections',
      spacing: 'Per structural analysis',
      capacity: 'Full moment and shear transfer',
    },
    decorative_screen: {
      primary: 'Mechanical fasteners with thermal breaks',
      spacing: '400-600mm centers',
      capacity: 'Wind load resistance',
    },
    window_frame: {
      primary: 'Structural anchors and sealants',
      spacing: '300-400mm centers',
      capacity: 'Structural and weather seal',
    },
    canopy_structure: {
      primary: 'Structural connections to building frame',
      spacing: 'Per structural design',
      capacity: 'Full load transfer including uplift',
    },
    balustrade: {
      primary: 'Code-compliant structural connections',
      spacing: 'Maximum 1200mm centers',
      capacity: 'Life safety load requirements',
    },
    architectural_feature: {
      primary: 'Custom engineered connections',
      spacing: 'Per specific design requirements',
      capacity: 'Aesthetic and structural performance',
    },
  };
  
  const requirements = connectionTypes[elementType] || connectionTypes.facade_panel;
  
  return {
    connectionType: requirements.primary,
    spacing: requirements.spacing,
    capacityRequirement: requirements.capacity,
    fastenerSize: getFastenerSize(loadAnalysis.designLoad),
    sealingRequirements: getSealingRequirements(elementType),
    thermalBreaks: getThermalBreakRequirements(elementType),
  };
}

function getFastenerSize(designLoad: number) {
  if (designLoad > 50) return 'M12 or larger structural bolts';
  if (designLoad > 20) return 'M10 structural bolts';
  if (designLoad > 10) return 'M8 bolts or equivalent';
  if (designLoad > 5) return 'M6 bolts or #10 screws';
  return '#8 screws or equivalent';
}

function getSealingRequirements(elementType: string) {
  const sealingReqs = {
    facade_panel: 'Weather seal with structural glazing tape',
    structural_beam: 'Fire-rated sealants at penetrations',
    decorative_screen: 'Minimal sealing, drainage provisions',
    window_frame: 'Primary and secondary weather seals',
    canopy_structure: 'Weather sealing at all connections',
    balustrade: 'Drainage and ventilation provisions',
    architectural_feature: 'Custom sealing per design requirements',
  };
  
  return sealingReqs[elementType] || 'Standard weather sealing';
}

function getThermalBreakRequirements(elementType: string) {
  const thermalReqs = {
    facade_panel: 'Thermal breaks at all structural connections',
    structural_beam: 'Thermal isolation where required by energy code',
    decorative_screen: 'Thermal breaks recommended for comfort',
    window_frame: 'Thermal breaks required for energy performance',
    canopy_structure: 'Thermal breaks at building interface',
    balustrade: 'Thermal breaks for condensation control',
    architectural_feature: 'Thermal breaks per specific requirements',
  };
  
  return thermalReqs[elementType] || 'Standard thermal break provisions';
}

function getThermalConsiderations(materialType: string, length: number, weatherExposure: string) {
  const materialProps = getArchitecturalMaterialProperties(materialType);
  const expansionCoeff = parseFloat(materialProps.thermalExpansion.split(' ')[0]); // × 10⁻⁶ /°C
  
  // Temperature ranges based on exposure
  const tempRanges = {
    interior: 10,    // ±10°C variation
    covered: 30,     // ±30°C variation
    moderate: 50,    // ±50°C variation
    severe: 70,      // ±70°C variation
    extreme: 90,     // ±90°C variation
  };
  
  const tempRange = tempRanges[weatherExposure] || 50;
  const thermalMovement = (expansionCoeff * tempRange * length) / 1000; // mm
  
  return {
    thermalExpansionCoeff: expansionCoeff,
    temperatureRange: tempRange,
    thermalMovement: Math.round(thermalMovement * 10) / 10,
    movementJoints: getThermalJointRequirements(thermalMovement, length),
    materialSuitability: getThermalSuitability(materialType, weatherExposure),
  };
}

function getThermalJointRequirements(movement: number, length: number) {
  const requirements = [];
  
  if (movement > 25) {
    requirements.push('Expansion joints required at maximum 12m centers');
    requirements.push('Sliding connections recommended');
  } else if (movement > 15) {
    requirements.push('Expansion joints recommended at 18m centers');
    requirements.push('Flexible connections at ends');
  } else if (movement > 8) {
    requirements.push('Flexible sealants and connections');
    requirements.push('Monitor for thermal stress');
  } else {
    requirements.push('Standard connections adequate');
  }
  
  return requirements;
}

function getThermalSuitability(materialType: string, weatherExposure: string) {
  const suitabilityMatrix = {
    aluminum_6061: {
      interior: 'Excellent',
      covered: 'Excellent',
      moderate: 'Very Good',
      severe: 'Good',
      extreme: 'Fair',
    },
    stainless_304: {
      interior: 'Excellent',
      covered: 'Excellent',
      moderate: 'Excellent',
      severe: 'Excellent',
      extreme: 'Very Good',
    },
    weathering_steel: {
      interior: 'Good',
      covered: 'Very Good',
      moderate: 'Excellent',
      severe: 'Excellent',
      extreme: 'Very Good',
    },
  };
  
  return suitabilityMatrix[materialType]?.[weatherExposure] || 'Good';
}

export default architecturalMetalConfig;
