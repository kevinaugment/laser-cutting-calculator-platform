import { CalculatorConfig } from '../../types/calculator';

export const medicalDeviceConfig: CalculatorConfig = {
  id: 'medical-device',
  name: 'Medical Device Calculator',
  description: 'Specialized calculator for medical device components including surgical instruments, implant parts, and diagnostic equipment with biocompatibility and regulatory compliance requirements.',
  category: 'precision',
  difficulty: 'expert',
  estimatedTime: '8-9 minutes',
  
  inputs: [
    {
      id: 'deviceType',
      label: 'Medical Device Type',
      type: 'select',
      value: 'surgical_instrument',
      options: [
        { value: 'surgical_instrument', label: 'Surgical Instrument' },
        { value: 'implant_component', label: 'Implant Component' },
        { value: 'diagnostic_equipment', label: 'Diagnostic Equipment Part' },
        { value: 'dental_instrument', label: 'Dental Instrument' },
        { value: 'orthopedic_tool', label: 'Orthopedic Tool' },
        { value: 'microfluidic_device', label: 'Microfluidic Device' },
        { value: 'prosthetic_component', label: 'Prosthetic Component' },
        { value: 'laboratory_equipment', label: 'Laboratory Equipment' },
      ],
      required: true,
      description: 'Type of medical device component',
    },
    {
      id: 'materialGrade',
      label: 'Material Grade',
      type: 'select',
      value: 'stainless_316l',
      options: [
        { value: 'stainless_316l', label: 'Stainless Steel 316L (Surgical)' },
        { value: 'stainless_316lvm', label: 'Stainless Steel 316LVM (Implant)' },
        { value: 'titanium_grade2', label: 'Titanium Grade 2 (CP)' },
        { value: 'titanium_grade5', label: 'Titanium Grade 5 (Ti-6Al-4V)' },
        { value: 'titanium_grade23', label: 'Titanium Grade 23 (Ti-6Al-4V ELI)' },
        { value: 'cobalt_chrome', label: 'Cobalt Chrome (CoCrMo)' },
        { value: 'nitinol', label: 'Nitinol (Shape Memory)' },
        { value: 'tantalum', label: 'Tantalum (Biocompatible)' },
      ],
      required: true,
      description: 'Biocompatible material for medical application',
    },
    {
      id: 'componentThickness',
      label: 'Component Thickness',
      type: 'number',
      value: 1.0,
      unit: 'mm',
      min: 0.1,
      max: 10.0,
      step: 0.1,
      required: true,
      description: 'Thickness of medical device component',
    },
    {
      id: 'precisionLevel',
      label: 'Precision Level',
      type: 'select',
      value: 'medical_grade',
      options: [
        { value: 'standard_medical', label: 'Standard Medical (±0.1mm)' },
        { value: 'medical_grade', label: 'Medical Grade (±0.05mm)' },
        { value: 'surgical_precision', label: 'Surgical Precision (±0.025mm)' },
        { value: 'implant_grade', label: 'Implant Grade (±0.01mm)' },
        { value: 'micro_medical', label: 'Micro Medical (±0.005mm)' },
      ],
      required: true,
      description: 'Required precision level for medical application',
    },
    {
      id: 'surfaceFinish',
      label: 'Surface Finish Requirement',
      type: 'select',
      value: 'surgical_finish',
      options: [
        { value: 'standard_finish', label: 'Standard Finish (Ra 3.2μm)' },
        { value: 'medical_finish', label: 'Medical Finish (Ra 1.6μm)' },
        { value: 'surgical_finish', label: 'Surgical Finish (Ra 0.8μm)' },
        { value: 'implant_finish', label: 'Implant Finish (Ra 0.4μm)' },
        { value: 'mirror_finish', label: 'Mirror Finish (Ra 0.2μm)' },
      ],
      required: true,
      description: 'Required surface finish quality',
    },
    {
      id: 'sterilizationMethod',
      label: 'Sterilization Method',
      type: 'select',
      value: 'autoclave',
      options: [
        { value: 'autoclave', label: 'Steam Autoclave (121-134°C)' },
        { value: 'gamma_radiation', label: 'Gamma Radiation' },
        { value: 'ethylene_oxide', label: 'Ethylene Oxide (EtO)' },
        { value: 'electron_beam', label: 'Electron Beam (E-beam)' },
        { value: 'hydrogen_peroxide', label: 'Hydrogen Peroxide Plasma' },
        { value: 'dry_heat', label: 'Dry Heat Sterilization' },
        { value: 'chemical_sterilant', label: 'Chemical Sterilant' },
      ],
      required: true,
      description: 'Required sterilization compatibility',
    },
    {
      id: 'regulatoryClass',
      label: 'Regulatory Class',
      type: 'select',
      value: 'class_ii',
      options: [
        { value: 'class_i', label: 'Class I (Low Risk)' },
        { value: 'class_ii', label: 'Class II (Moderate Risk)' },
        { value: 'class_iii', label: 'Class III (High Risk)' },
        { value: 'implantable', label: 'Implantable Device' },
        { value: 'life_supporting', label: 'Life Supporting Device' },
      ],
      required: true,
      description: 'FDA/CE regulatory classification',
    },
    {
      id: 'biocompatibilityTesting',
      label: 'Biocompatibility Testing',
      type: 'select',
      value: 'iso_10993',
      options: [
        { value: 'basic_testing', label: 'Basic Biocompatibility' },
        { value: 'iso_10993', label: 'ISO 10993 Full Battery' },
        { value: 'implant_testing', label: 'Implant Grade Testing' },
        { value: 'blood_contact', label: 'Blood Contact Testing' },
        { value: 'long_term_implant', label: 'Long-term Implant Testing' },
      ],
      required: true,
      description: 'Required biocompatibility testing level',
    },
    {
      id: 'featureComplexity',
      label: 'Feature Complexity',
      type: 'select',
      value: 'high',
      options: [
        { value: 'simple', label: 'Simple (Basic shapes, large features)' },
        { value: 'moderate', label: 'Moderate (Standard medical features)' },
        { value: 'high', label: 'High (Complex geometry, fine features)' },
        { value: 'ultra_high', label: 'Ultra High (Micro features, extreme precision)' },
      ],
      required: true,
      description: 'Complexity of device features and geometry',
    },
    {
      id: 'productionScale',
      label: 'Production Scale',
      type: 'select',
      value: 'small_batch',
      options: [
        { value: 'prototype', label: 'Prototype/R&D (1-10 units)' },
        { value: 'small_batch', label: 'Small Batch (10-100 units)' },
        { value: 'medium_batch', label: 'Medium Batch (100-1000 units)' },
        { value: 'large_scale', label: 'Large Scale (1000+ units)' },
      ],
      required: true,
      description: 'Expected production scale',
    },
  ],

  outputs: [
    {
      id: 'biocompatibilityAnalysis',
      label: 'Biocompatibility Analysis',
      type: 'object',
      format: 'medical-biocompatibility-specs',
      description: 'Biocompatibility and material safety analysis',
    },
    {
      id: 'precisionSpecifications',
      label: 'Precision Specifications',
      type: 'object',
      format: 'medical-precision-specs',
      description: 'Medical-grade precision manufacturing specifications',
    },
    {
      id: 'regulatoryCompliance',
      label: 'Regulatory Compliance',
      type: 'object',
      format: 'medical-regulatory-specs',
      description: 'FDA/CE regulatory compliance requirements',
    },
    {
      id: 'manufacturingCost',
      label: 'Manufacturing Cost',
      type: 'object',
      format: 'medical-cost-analysis',
      description: 'Medical device manufacturing cost analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      deviceType,
      materialGrade,
      componentThickness,
      precisionLevel,
      surfaceFinish,
      sterilizationMethod,
      regulatoryClass,
      biocompatibilityTesting,
      featureComplexity,
      productionScale,
    } = inputs;

    // Analyze biocompatibility requirements
    const biocompatibilityAnalysis = analyzeMedicalBiocompatibility(
      materialGrade,
      deviceType,
      biocompatibilityTesting,
      sterilizationMethod,
      regulatoryClass
    );

    // Define precision specifications
    const precisionSpecifications = defineMedicalPrecision(
      precisionLevel,
      surfaceFinish,
      featureComplexity,
      deviceType,
      materialGrade
    );

    // Analyze regulatory compliance
    const regulatoryCompliance = analyzeMedicalRegulatory(
      regulatoryClass,
      deviceType,
      materialGrade,
      biocompatibilityTesting,
      sterilizationMethod
    );

    // Calculate manufacturing costs
    const manufacturingCost = calculateMedicalManufacturingCost(
      deviceType,
      materialGrade,
      componentThickness,
      precisionLevel,
      surfaceFinish,
      productionScale,
      precisionSpecifications
    );

    return {
      biocompatibilityAnalysis,
      precisionSpecifications,
      regulatoryCompliance,
      manufacturingCost,
    };
  },

  validation: {
    componentThickness: {
      min: 0.1,
      max: 10.0,
      message: 'Component thickness must be between 0.1mm and 10.0mm for medical devices',
    },
  },

  examples: [
    {
      name: 'Surgical Forceps',
      description: 'Precision surgical forceps with fine tips',
      inputs: {
        deviceType: 'surgical_instrument',
        materialGrade: 'stainless_316l',
        componentThickness: 1.5,
        precisionLevel: 'surgical_precision',
        surfaceFinish: 'surgical_finish',
        sterilizationMethod: 'autoclave',
        regulatoryClass: 'class_ii',
        biocompatibilityTesting: 'iso_10993',
        featureComplexity: 'high',
        productionScale: 'medium_batch',
      },
    },
    {
      name: 'Orthopedic Implant',
      description: 'Titanium orthopedic implant component',
      inputs: {
        deviceType: 'implant_component',
        materialGrade: 'titanium_grade23',
        componentThickness: 3.0,
        precisionLevel: 'implant_grade',
        surfaceFinish: 'implant_finish',
        sterilizationMethod: 'gamma_radiation',
        regulatoryClass: 'implantable',
        biocompatibilityTesting: 'long_term_implant',
        featureComplexity: 'ultra_high',
        productionScale: 'small_batch',
      },
    },
  ],

  tags: ['medical', 'biocompatible', 'surgical', 'precision', 'regulatory'],
  
  relatedCalculators: [
    'biocompatibility-analysis',
    'surgical-precision',
    'regulatory-compliance',
    'sterilization-compatibility',
  ],

  learningResources: [
    {
      title: 'Medical Device Manufacturing',
      type: 'article',
      url: '/learn/medical-device-manufacturing',
    },
    {
      title: 'Biocompatible Materials',
      type: 'video',
      url: '/learn/biocompatible-materials',
    },
  ],
};

// Helper functions
function analyzeMedicalBiocompatibility(
  materialGrade: string,
  deviceType: string,
  biocompatibilityTesting: string,
  sterilizationMethod: string,
  regulatoryClass: string
) {
  const materialProperties = getMedicalMaterialProperties(materialGrade);
  const biocompatibilityRequirements = getBiocompatibilityRequirements(deviceType, biocompatibilityTesting);
  const sterilizationCompatibility = getSterilizationCompatibility(materialGrade, sterilizationMethod);
  
  return {
    materialProperties,
    biocompatibilityRequirements,
    sterilizationCompatibility,
    cytotoxicityRisk: assessCytotoxicityRisk(materialGrade, deviceType),
    allergenicPotential: assessAllergenicPotential(materialGrade),
    corrosionResistance: assessCorrosionResistance(materialGrade, deviceType),
  };
}

function getMedicalMaterialProperties(materialGrade: string) {
  const materials = {
    stainless_316l: {
      composition: 'Fe-Cr18-Ni14-Mo3 (Low Carbon)',
      biocompatibility: 'Excellent',
      corrosionResistance: 'Very Good',
      magneticProperties: 'Slightly Magnetic',
      elasticModulus: '200 GPa',
      yieldStrength: '300-400 MPa',
      applications: ['Surgical instruments', 'Temporary implants', 'Dental tools'],
      limitations: ['Not for permanent implants', 'Potential nickel sensitivity'],
    },
    stainless_316lvm: {
      composition: 'Fe-Cr18-Ni14-Mo3 (Vacuum Melted)',
      biocompatibility: 'Outstanding',
      corrosionResistance: 'Excellent',
      magneticProperties: 'Slightly Magnetic',
      elasticModulus: '200 GPa',
      yieldStrength: '350-450 MPa',
      applications: ['Short-term implants', 'Orthopedic hardware', 'Cardiovascular devices'],
      limitations: ['Limited long-term implant use', 'Higher modulus than bone'],
    },
    titanium_grade2: {
      composition: 'Ti (99.2% min)',
      biocompatibility: 'Outstanding',
      corrosionResistance: 'Excellent',
      magneticProperties: 'Non-magnetic',
      elasticModulus: '105 GPa',
      yieldStrength: '275-410 MPa',
      applications: ['Dental implants', 'Cardiovascular implants', 'General surgery'],
      limitations: ['Lower strength than alloys', 'More expensive'],
    },
    titanium_grade5: {
      composition: 'Ti-6Al-4V',
      biocompatibility: 'Very Good',
      corrosionResistance: 'Excellent',
      magneticProperties: 'Non-magnetic',
      elasticModulus: '114 GPa',
      yieldStrength: '880-950 MPa',
      applications: ['Orthopedic implants', 'Aerospace medical', 'High-strength applications'],
      limitations: ['Vanadium concerns', 'Higher modulus'],
    },
    titanium_grade23: {
      composition: 'Ti-6Al-4V ELI (Extra Low Interstitial)',
      biocompatibility: 'Outstanding',
      corrosionResistance: 'Excellent',
      magneticProperties: 'Non-magnetic',
      elasticModulus: '114 GPa',
      yieldStrength: '795-875 MPa',
      applications: ['Long-term implants', 'Orthopedic devices', 'Cardiovascular implants'],
      limitations: ['Most expensive titanium grade', 'Complex processing'],
    },
    cobalt_chrome: {
      composition: 'Co-Cr-Mo',
      biocompatibility: 'Excellent',
      corrosionResistance: 'Outstanding',
      magneticProperties: 'Non-magnetic',
      elasticModulus: '240 GPa',
      yieldStrength: '450-1000 MPa',
      applications: ['Joint replacements', 'Dental prosthetics', 'Cardiovascular stents'],
      limitations: ['High modulus', 'Potential cobalt sensitivity'],
    },
    nitinol: {
      composition: 'Ni-Ti (Shape Memory Alloy)',
      biocompatibility: 'Good (with proper surface treatment)',
      corrosionResistance: 'Very Good',
      magneticProperties: 'Non-magnetic',
      elasticModulus: '28-83 GPa (variable)',
      yieldStrength: '195-690 MPa',
      applications: ['Stents', 'Orthodontic wires', 'Minimally invasive devices'],
      limitations: ['Nickel release concerns', 'Complex processing'],
    },
    tantalum: {
      composition: 'Ta (99.9% min)',
      biocompatibility: 'Outstanding',
      corrosionResistance: 'Outstanding',
      magneticProperties: 'Non-magnetic',
      elasticModulus: '186 GPa',
      yieldStrength: '140-200 MPa',
      applications: ['Bone repair', 'Cardiovascular implants', 'Radiopaque markers'],
      limitations: ['Very expensive', 'Difficult to machine'],
    },
  };
  
  return materials[materialGrade] || materials.stainless_316l;
}

function getBiocompatibilityRequirements(deviceType: string, testingLevel: string) {
  const testingRequirements = {
    basic_testing: [
      'Cytotoxicity (ISO 10993-5)',
      'Sensitization (ISO 10993-10)',
      'Irritation (ISO 10993-10)',
    ],
    iso_10993: [
      'Cytotoxicity (ISO 10993-5)',
      'Sensitization (ISO 10993-10)',
      'Irritation (ISO 10993-10)',
      'Systemic toxicity (ISO 10993-11)',
      'Hemocompatibility (ISO 10993-4)',
      'Genotoxicity (ISO 10993-3)',
    ],
    implant_testing: [
      'Full ISO 10993 battery',
      'Implantation testing (ISO 10993-6)',
      'Chronic toxicity (ISO 10993-11)',
      'Carcinogenicity (ISO 10993-3)',
    ],
    blood_contact: [
      'Hemolysis testing',
      'Thrombogenicity testing',
      'Complement activation',
      'Platelet activation',
    ],
    long_term_implant: [
      'Complete ISO 10993 evaluation',
      'Long-term implantation studies',
      'Wear debris testing',
      'Corrosion product analysis',
    ],
  };
  
  const deviceSpecificRequirements = {
    surgical_instrument: ['Repeated sterilization compatibility', 'Edge retention testing'],
    implant_component: ['Osseointegration studies', 'Mechanical fatigue testing'],
    diagnostic_equipment: ['Electrical safety testing', 'EMC compliance'],
    dental_instrument: ['Oral environment compatibility', 'Fluoride resistance'],
    orthopedic_tool: ['Mechanical strength testing', 'Wear resistance'],
    microfluidic_device: ['Protein adsorption testing', 'Cell adhesion studies'],
    prosthetic_component: ['Skin contact compatibility', 'Long-term wear testing'],
    laboratory_equipment: ['Chemical resistance', 'Cleaning validation'],
  };
  
  return {
    standardTests: testingRequirements[testingLevel] || testingRequirements.iso_10993,
    deviceSpecificTests: deviceSpecificRequirements[deviceType] || [],
    testingTimeline: getTestingTimeline(testingLevel),
    regulatorySubmission: getRegulatorySubmissionRequirements(testingLevel),
  };
}

function getTestingTimeline(testingLevel: string) {
  const timelines = {
    basic_testing: '4-8 weeks',
    iso_10993: '12-16 weeks',
    implant_testing: '20-26 weeks',
    blood_contact: '8-12 weeks',
    long_term_implant: '52-104 weeks',
  };
  
  return timelines[testingLevel] || '12-16 weeks';
}

function getRegulatorySubmissionRequirements(testingLevel: string) {
  const requirements = {
    basic_testing: ['510(k) submission support', 'CE marking technical file'],
    iso_10993: ['Full 510(k) package', 'CE marking compliance', 'ISO 13485 support'],
    implant_testing: ['PMA submission support', 'CE marking notified body review'],
    blood_contact: ['FDA blood contact guidance compliance', 'ISO 10993-4 full evaluation'],
    long_term_implant: ['PMA with clinical data', 'CE marking with clinical evaluation'],
  };
  
  return requirements[testingLevel] || requirements.iso_10993;
}

function getSterilizationCompatibility(materialGrade: string, sterilizationMethod: string) {
  const compatibility = {
    stainless_316l: {
      autoclave: 'Excellent',
      gamma_radiation: 'Excellent',
      ethylene_oxide: 'Excellent',
      electron_beam: 'Good',
      hydrogen_peroxide: 'Good',
      dry_heat: 'Excellent',
      chemical_sterilant: 'Good',
    },
    stainless_316lvm: {
      autoclave: 'Excellent',
      gamma_radiation: 'Excellent',
      ethylene_oxide: 'Excellent',
      electron_beam: 'Good',
      hydrogen_peroxide: 'Good',
      dry_heat: 'Excellent',
      chemical_sterilant: 'Good',
    },
    titanium_grade2: {
      autoclave: 'Excellent',
      gamma_radiation: 'Excellent',
      ethylene_oxide: 'Excellent',
      electron_beam: 'Excellent',
      hydrogen_peroxide: 'Excellent',
      dry_heat: 'Good',
      chemical_sterilant: 'Excellent',
    },
    titanium_grade5: {
      autoclave: 'Excellent',
      gamma_radiation: 'Excellent',
      ethylene_oxide: 'Excellent',
      electron_beam: 'Excellent',
      hydrogen_peroxide: 'Excellent',
      dry_heat: 'Good',
      chemical_sterilant: 'Excellent',
    },
    titanium_grade23: {
      autoclave: 'Excellent',
      gamma_radiation: 'Excellent',
      ethylene_oxide: 'Excellent',
      electron_beam: 'Excellent',
      hydrogen_peroxide: 'Excellent',
      dry_heat: 'Good',
      chemical_sterilant: 'Excellent',
    },
    cobalt_chrome: {
      autoclave: 'Excellent',
      gamma_radiation: 'Excellent',
      ethylene_oxide: 'Good',
      electron_beam: 'Good',
      hydrogen_peroxide: 'Fair',
      dry_heat: 'Good',
      chemical_sterilant: 'Good',
    },
    nitinol: {
      autoclave: 'Good (temperature sensitive)',
      gamma_radiation: 'Good',
      ethylene_oxide: 'Excellent',
      electron_beam: 'Fair',
      hydrogen_peroxide: 'Good',
      dry_heat: 'Poor',
      chemical_sterilant: 'Good',
    },
    tantalum: {
      autoclave: 'Excellent',
      gamma_radiation: 'Excellent',
      ethylene_oxide: 'Excellent',
      electron_beam: 'Excellent',
      hydrogen_peroxide: 'Excellent',
      dry_heat: 'Excellent',
      chemical_sterilant: 'Excellent',
    },
  };
  
  const materialCompatibility = compatibility[materialGrade] || compatibility.stainless_316l;
  const rating = materialCompatibility[sterilizationMethod] || 'Unknown';
  
  return {
    compatibilityRating: rating,
    recommendations: getSterilizationRecommendations(materialGrade, sterilizationMethod, rating),
    cycleLimitations: getSterilizationCycleLimitations(materialGrade, sterilizationMethod),
    validationRequirements: getSterilizationValidationRequirements(sterilizationMethod),
  };
}

function getSterilizationRecommendations(materialGrade: string, method: string, rating: string) {
  const recommendations = [];
  
  if (rating === 'Excellent') {
    recommendations.push('Optimal sterilization method for this material');
    recommendations.push('No special precautions required');
  } else if (rating === 'Good') {
    recommendations.push('Suitable sterilization method with standard protocols');
    recommendations.push('Monitor for any material changes over multiple cycles');
  } else if (rating === 'Fair') {
    recommendations.push('Use with caution - validate material properties after sterilization');
    recommendations.push('Consider alternative sterilization methods');
  } else if (rating === 'Poor') {
    recommendations.push('Not recommended - select alternative sterilization method');
    recommendations.push('Risk of material degradation or property changes');
  }
  
  // Material-specific recommendations
  if (materialGrade === 'nitinol' && method === 'autoclave') {
    recommendations.push('Monitor shape memory properties after sterilization');
    recommendations.push('Validate transformation temperatures');
  }
  
  return recommendations;
}

function getSterilizationCycleLimitations(materialGrade: string, method: string) {
  const limitations = {
    stainless_316l: 'No cycle limitations for standard methods',
    stainless_316lvm: 'No cycle limitations for standard methods',
    titanium_grade2: 'No cycle limitations',
    titanium_grade5: 'No cycle limitations',
    titanium_grade23: 'No cycle limitations',
    cobalt_chrome: 'Monitor for surface changes after 100+ cycles',
    nitinol: 'Validate properties after 10-20 cycles for autoclave',
    tantalum: 'No cycle limitations',
  };
  
  return limitations[materialGrade] || 'Standard cycle limitations apply';
}

function getSterilizationValidationRequirements(method: string) {
  const requirements = {
    autoclave: [
      'Temperature mapping and validation',
      'Bioburden and sterility testing',
      'Package integrity testing',
      'Residual moisture testing',
    ],
    gamma_radiation: [
      'Dose mapping and validation',
      'Material compatibility testing',
      'Sterility assurance level (SAL) validation',
      'Package integrity after irradiation',
    ],
    ethylene_oxide: [
      'Gas concentration validation',
      'Residual EtO testing',
      'Sterility testing',
      'Aeration validation',
    ],
    electron_beam: [
      'Dose uniformity validation',
      'Material degradation assessment',
      'Sterility testing',
      'Package integrity testing',
    ],
    hydrogen_peroxide: [
      'Plasma parameter validation',
      'Residual H2O2 testing',
      'Material compatibility',
      'Sterility testing',
    ],
    dry_heat: [
      'Temperature uniformity validation',
      'Heat penetration studies',
      'Sterility testing',
      'Material stability assessment',
    ],
    chemical_sterilant: [
      'Chemical concentration validation',
      'Contact time verification',
      'Residual chemical testing',
      'Sterility testing',
    ],
  };
  
  return requirements[method] || requirements.autoclave;
}

function assessCytotoxicityRisk(materialGrade: string, deviceType: string) {
  const riskLevels = {
    stainless_316l: 'Low',
    stainless_316lvm: 'Very Low',
    titanium_grade2: 'Very Low',
    titanium_grade5: 'Low',
    titanium_grade23: 'Very Low',
    cobalt_chrome: 'Low',
    nitinol: 'Moderate (nickel release)',
    tantalum: 'Very Low',
  };
  
  const baseRisk = riskLevels[materialGrade] || 'Moderate';
  
  // Adjust risk based on device type
  const deviceRiskFactors = {
    surgical_instrument: 0.8, // Lower risk due to short contact time
    implant_component: 1.5,   // Higher risk due to permanent contact
    diagnostic_equipment: 0.7, // Lower risk, limited contact
    dental_instrument: 1.0,   // Standard risk
    orthopedic_tool: 0.9,     // Slightly lower risk
    microfluidic_device: 1.2, // Higher risk due to cell contact
    prosthetic_component: 1.1, // Slightly higher risk
    laboratory_equipment: 0.6, // Lower risk, indirect contact
  };
  
  return {
    riskLevel: baseRisk,
    deviceAdjustment: deviceRiskFactors[deviceType] || 1.0,
    mitigationStrategies: getCytotoxicityMitigation(materialGrade, deviceType),
    testingRecommendations: getCytotoxicityTestingRecommendations(baseRisk),
  };
}

function getCytotoxicityMitigation(materialGrade: string, deviceType: string) {
  const strategies = [];
  
  if (materialGrade === 'nitinol') {
    strategies.push('Surface passivation to reduce nickel release');
    strategies.push('Electropolishing for smooth surface finish');
    strategies.push('Consider alternative shape memory alloys');
  }
  
  if (['implant_component', 'prosthetic_component'].includes(deviceType)) {
    strategies.push('Biocompatible surface coatings');
    strategies.push('Surface texturing for improved integration');
    strategies.push('Long-term biocompatibility validation');
  }
  
  strategies.push('Proper surface cleaning and preparation');
  strategies.push('Validated sterilization processes');
  strategies.push('Quality control of surface finish');
  
  return strategies;
}

function getCytotoxicityTestingRecommendations(riskLevel: string) {
  const recommendations = {
    'Very Low': [
      'Standard ISO 10993-5 cytotoxicity testing',
      'Single test laboratory acceptable',
    ],
    'Low': [
      'ISO 10993-5 cytotoxicity testing',
      'Consider additional cell lines',
    ],
    'Moderate': [
      'Enhanced cytotoxicity testing',
      'Multiple cell lines recommended',
      'Consider extract testing at multiple time points',
    ],
    'High': [
      'Comprehensive cytotoxicity evaluation',
      'Multiple test methods and cell lines',
      'Long-term exposure studies',
    ],
  };
  
  return recommendations[riskLevel] || recommendations['Low'];
}

function assessAllergenicPotential(materialGrade: string) {
  const allergenicRisks = {
    stainless_316l: {
      risk: 'Moderate',
      allergens: ['Nickel', 'Chromium'],
      prevalence: '10-15% population sensitive to nickel',
    },
    stainless_316lvm: {
      risk: 'Low-Moderate',
      allergens: ['Nickel', 'Chromium'],
      prevalence: '10-15% population sensitive to nickel',
    },
    titanium_grade2: {
      risk: 'Very Low',
      allergens: ['Titanium (rare)'],
      prevalence: '<1% population sensitive',
    },
    titanium_grade5: {
      risk: 'Low',
      allergens: ['Aluminum', 'Vanadium'],
      prevalence: '2-5% population sensitive',
    },
    titanium_grade23: {
      risk: 'Low',
      allergens: ['Aluminum', 'Vanadium'],
      prevalence: '2-5% population sensitive',
    },
    cobalt_chrome: {
      risk: 'Moderate',
      allergens: ['Cobalt', 'Chromium'],
      prevalence: '5-10% population sensitive',
    },
    nitinol: {
      risk: 'High',
      allergens: ['Nickel'],
      prevalence: '10-15% population sensitive to nickel',
    },
    tantalum: {
      risk: 'Very Low',
      allergens: ['None known'],
      prevalence: 'No documented allergic reactions',
    },
  };
  
  return allergenicRisks[materialGrade] || allergenicRisks.stainless_316l;
}

function assessCorrosionResistance(materialGrade: string, deviceType: string) {
  const corrosionData = {
    stainless_316l: {
      generalCorrosion: 'Very Good',
      pittingResistance: 'Good',
      creviceCorrosion: 'Good',
      stressCorrosion: 'Good',
      galvanicCorrosion: 'Moderate',
    },
    stainless_316lvm: {
      generalCorrosion: 'Excellent',
      pittingResistance: 'Very Good',
      creviceCorrosion: 'Very Good',
      stressCorrosion: 'Very Good',
      galvanicCorrosion: 'Good',
    },
    titanium_grade2: {
      generalCorrosion: 'Outstanding',
      pittingResistance: 'Outstanding',
      creviceCorrosion: 'Outstanding',
      stressCorrosion: 'Outstanding',
      galvanicCorrosion: 'Excellent',
    },
    titanium_grade5: {
      generalCorrosion: 'Outstanding',
      pittingResistance: 'Outstanding',
      creviceCorrosion: 'Outstanding',
      stressCorrosion: 'Outstanding',
      galvanicCorrosion: 'Excellent',
    },
    titanium_grade23: {
      generalCorrosion: 'Outstanding',
      pittingResistance: 'Outstanding',
      creviceCorrosion: 'Outstanding',
      stressCorrosion: 'Outstanding',
      galvanicCorrosion: 'Excellent',
    },
    cobalt_chrome: {
      generalCorrosion: 'Excellent',
      pittingResistance: 'Excellent',
      creviceCorrosion: 'Very Good',
      stressCorrosion: 'Excellent',
      galvanicCorrosion: 'Very Good',
    },
    nitinol: {
      generalCorrosion: 'Good',
      pittingResistance: 'Good',
      creviceCorrosion: 'Fair',
      stressCorrosion: 'Good',
      galvanicCorrosion: 'Good',
    },
    tantalum: {
      generalCorrosion: 'Outstanding',
      pittingResistance: 'Outstanding',
      creviceCorrosion: 'Outstanding',
      stressCorrosion: 'Outstanding',
      galvanicCorrosion: 'Outstanding',
    },
  };
  
  const resistance = corrosionData[materialGrade] || corrosionData.stainless_316l;
  
  return {
    corrosionResistance: resistance,
    environmentalFactors: getEnvironmentalFactors(deviceType),
    protectionMethods: getCorrosionProtectionMethods(materialGrade, deviceType),
    testingRequirements: getCorrosionTestingRequirements(deviceType),
  };
}

function getEnvironmentalFactors(deviceType: string) {
  const factors = {
    surgical_instrument: ['Blood contact', 'Cleaning chemicals', 'Sterilization cycles'],
    implant_component: ['Body fluids', 'pH variations', 'Protein deposits'],
    diagnostic_equipment: ['Cleaning solutions', 'Disinfectants', 'Environmental humidity'],
    dental_instrument: ['Saliva', 'Fluoride exposure', 'Cleaning chemicals'],
    orthopedic_tool: ['Blood contact', 'Bone cement', 'Cleaning solutions'],
    microfluidic_device: ['Cell culture media', 'Buffer solutions', 'Protein solutions'],
    prosthetic_component: ['Skin contact', 'Perspiration', 'Environmental exposure'],
    laboratory_equipment: ['Chemical reagents', 'Cleaning solvents', 'pH extremes'],
  };
  
  return factors[deviceType] || factors.surgical_instrument;
}

function getCorrosionProtectionMethods(materialGrade: string, deviceType: string) {
  const methods = [];
  
  if (['stainless_316l', 'stainless_316lvm'].includes(materialGrade)) {
    methods.push('Passivation treatment per ASTM A967');
    methods.push('Electropolishing for smooth surface');
    methods.push('Avoid chloride-rich environments when possible');
  }
  
  if (materialGrade === 'nitinol') {
    methods.push('Surface passivation to form stable oxide layer');
    methods.push('Electropolishing to remove surface defects');
    methods.push('Consider protective coatings for harsh environments');
  }
  
  methods.push('Proper cleaning and maintenance protocols');
  methods.push('Avoid galvanic coupling with dissimilar metals');
  methods.push('Regular inspection for signs of corrosion');
  
  return methods;
}

function getCorrosionTestingRequirements(deviceType: string) {
  const requirements = {
    surgical_instrument: [
      'Cyclic corrosion testing',
      'Cleaning solution compatibility',
      'Sterilization cycle effects',
    ],
    implant_component: [
      'Long-term immersion testing',
      'Simulated body fluid testing',
      'Galvanic corrosion assessment',
    ],
    diagnostic_equipment: [
      'Chemical compatibility testing',
      'Environmental exposure testing',
      'Cleaning validation',
    ],
  };
  
  return requirements[deviceType] || requirements.surgical_instrument;
}

export default medicalDeviceConfig;
