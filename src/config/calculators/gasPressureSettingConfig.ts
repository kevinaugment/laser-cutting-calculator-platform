import { CalculatorConfig } from '../../types/calculator';

export const gasPressureSettingConfig: CalculatorConfig = {
  id: 'gas-pressure-setting',
  name: 'Gas Pressure Setting Guide',
  description: 'Determine optimal assist gas pressure settings to avoid excessive kerf width, dross formation, and achieve clean cuts.',
  category: 'parameters-settings',
  difficulty: 'intermediate',
  estimatedTime: '2-3 minutes',
  
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
      id: 'assistGas',
      label: 'Assist Gas Type',
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
      id: 'nozzleDiameter',
      label: 'Nozzle Diameter',
      type: 'number',
      value: 1.5,
      unit: 'mm',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      required: true,
      description: 'Diameter of the cutting nozzle',
    },
    {
      id: 'cuttingSpeed',
      label: 'Cutting Speed',
      type: 'number',
      value: 3000,
      unit: 'mm/min',
      min: 100,
      max: 15000,
      step: 100,
      required: true,
      description: 'Planned cutting speed',
    },
    {
      id: 'laserPower',
      label: 'Laser Power',
      type: 'number',
      value: 1000,
      unit: 'W',
      min: 50,
      max: 15000,
      step: 50,
      required: true,
      description: 'Laser power setting',
    },
    {
      id: 'cutQuality',
      label: 'Desired Cut Quality',
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
      id: 'recommendedPressure',
      label: 'Recommended Gas Pressure',
      type: 'object',
      format: 'pressure-settings',
      description: 'Optimal gas pressure settings',
    },
    {
      id: 'pressureRange',
      label: 'Acceptable Pressure Range',
      type: 'object',
      format: 'pressure-range',
      description: 'Safe operating pressure range',
    },
    {
      id: 'gasFlowRate',
      label: 'Gas Flow Rate',
      type: 'object',
      format: 'flow-analysis',
      description: 'Calculated gas flow rate and consumption',
    },
    {
      id: 'troubleshooting',
      label: 'Troubleshooting Guide',
      type: 'array',
      format: 'troubleshooting-tips',
      description: 'Common issues and solutions',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      assistGas,
      nozzleDiameter,
      cuttingSpeed,
      laserPower,
      cutQuality,
    } = inputs;

    // Calculate optimal pressure based on material and parameters
    const recommendedPressure = calculateOptimalPressure(
      materialType,
      thickness,
      assistGas,
      nozzleDiameter,
      cuttingSpeed,
      laserPower,
      cutQuality
    );

    // Calculate acceptable pressure range
    const pressureRange = calculatePressureRange(recommendedPressure, materialType, assistGas);

    // Calculate gas flow rate
    const gasFlowRate = calculateGasFlowRate(
      recommendedPressure.optimal,
      nozzleDiameter,
      assistGas
    );

    // Generate troubleshooting tips
    const troubleshooting = generateTroubleshootingTips(
      materialType,
      thickness,
      assistGas,
      recommendedPressure
    );

    return {
      recommendedPressure,
      pressureRange,
      gasFlowRate,
      troubleshooting,
    };
  },

  validation: {
    thickness: {
      min: 0.1,
      max: 50,
      message: 'Thickness must be between 0.1mm and 50mm',
    },
    nozzleDiameter: {
      min: 0.5,
      max: 5.0,
      message: 'Nozzle diameter must be between 0.5mm and 5.0mm',
    },
    cuttingSpeed: {
      min: 100,
      max: 15000,
      message: 'Cutting speed must be between 100 and 15000 mm/min',
    },
    laserPower: {
      min: 50,
      max: 15000,
      message: 'Laser power must be between 50W and 15000W',
    },
  },

  examples: [
    {
      name: '3mm Steel with Oxygen',
      description: 'Standard carbon steel cutting with oxygen assist',
      inputs: {
        materialType: 'carbon_steel',
        thickness: 3,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 1000,
        cutQuality: 'standard',
      },
    },
    {
      name: '5mm Stainless with Nitrogen',
      description: 'Precision stainless steel cutting with nitrogen',
      inputs: {
        materialType: 'stainless_steel',
        thickness: 5,
        assistGas: 'nitrogen',
        nozzleDiameter: 2.0,
        cuttingSpeed: 2000,
        laserPower: 2000,
        cutQuality: 'precision',
      },
    },
  ],

  tags: ['gas', 'pressure', 'assist', 'kerf', 'quality'],
  
  relatedCalculators: [
    'power-speed-matching',
    'gas-consumption',
    'kerf-width',
    'quality-grade',
  ],

  learningResources: [
    {
      title: 'Assist Gas Fundamentals',
      type: 'article',
      url: '/learn/assist-gas-basics',
    },
    {
      title: 'Gas Pressure Optimization',
      type: 'video',
      url: '/learn/gas-pressure-optimization',
    },
  ],
};

// Helper functions
function calculateOptimalPressure(
  materialType: string,
  thickness: number,
  assistGas: string,
  nozzleDiameter: number,
  cuttingSpeed: number,
  laserPower: number,
  cutQuality: string
) {
  // Base pressure settings by material and gas type
  const basePressures = {
    carbon_steel: {
      oxygen: { base: 0.8, factor: 0.15 },
      nitrogen: { base: 12, factor: 2.0 },
      air: { base: 6, factor: 1.0 },
    },
    stainless_steel: {
      nitrogen: { base: 15, factor: 2.5 },
      oxygen: { base: 0.6, factor: 0.12 },
      air: { base: 8, factor: 1.2 },
    },
    aluminum: {
      nitrogen: { base: 18, factor: 3.0 },
      air: { base: 10, factor: 1.5 },
    },
    acrylic: {
      air: { base: 2, factor: 0.3 },
      nitrogen: { base: 5, factor: 0.5 },
    },
  };

  const materialGas = basePressures[materialType]?.[assistGas] || { base: 5, factor: 1.0 };
  
  // Calculate base pressure
  let optimalPressure = materialGas.base + (thickness * materialGas.factor);
  
  // Adjust for nozzle diameter
  const nozzleFactor = Math.pow(1.5 / nozzleDiameter, 2);
  optimalPressure *= nozzleFactor;
  
  // Adjust for cutting speed
  const speedFactor = Math.sqrt(cuttingSpeed / 3000);
  optimalPressure *= speedFactor;
  
  // Adjust for quality requirements
  const qualityFactors = {
    rough: 0.8,
    standard: 1.0,
    precision: 1.2,
    mirror: 1.4,
  };
  optimalPressure *= qualityFactors[cutQuality] || 1.0;
  
  // Adjust for laser power
  const powerFactor = Math.sqrt(laserPower / 1000);
  optimalPressure *= Math.min(powerFactor, 1.5);

  return {
    optimal: Math.round(optimalPressure * 10) / 10,
    unit: assistGas === 'oxygen' ? 'bar' : 'bar',
    reasoning: generatePressureReasoning(materialType, assistGas, thickness),
  };
}

function calculatePressureRange(recommendedPressure: any, materialType: string, assistGas: string) {
  const tolerance = assistGas === 'oxygen' ? 0.2 : 2.0;
  
  return {
    minimum: Math.max(0.1, recommendedPressure.optimal - tolerance),
    maximum: recommendedPressure.optimal + tolerance,
    optimal: recommendedPressure.optimal,
    warning: `Pressure outside this range may cause cut quality issues`,
  };
}

function calculateGasFlowRate(pressure: number, nozzleDiameter: number, assistGas: string) {
  // Flow rate calculation based on nozzle diameter and pressure
  const nozzleArea = Math.PI * Math.pow(nozzleDiameter / 2, 2);
  const gasConstants = {
    oxygen: { density: 1.429, flowFactor: 0.6 },
    nitrogen: { density: 1.251, flowFactor: 0.65 },
    air: { density: 1.225, flowFactor: 0.62 },
    argon: { density: 1.784, flowFactor: 0.58 },
  };
  
  const gasProps = gasConstants[assistGas] || gasConstants.air;
  const flowRate = nozzleArea * pressure * gasProps.flowFactor * 60; // L/min
  
  return {
    flowRate: Math.round(flowRate * 10) / 10,
    unit: 'L/min',
    hourlyConsumption: Math.round(flowRate * 60 * 10) / 10,
    costPerHour: calculateGasCost(flowRate * 60, assistGas),
  };
}

function generatePressureReasoning(materialType: string, assistGas: string, thickness: number) {
  const reasons = [];
  
  if (assistGas === 'oxygen') {
    reasons.push('Oxygen pressure optimized for exothermic cutting reaction');
    if (thickness > 6) {
      reasons.push('Higher pressure needed for thick material evacuation');
    }
  } else if (assistGas === 'nitrogen') {
    reasons.push('Nitrogen pressure set for inert atmosphere and melt ejection');
    reasons.push('Higher pressure prevents oxidation');
  }
  
  if (materialType === 'stainless_steel') {
    reasons.push('Pressure adjusted for stainless steel thermal properties');
  }
  
  return reasons;
}

function generateTroubleshootingTips(materialType: string, thickness: number, assistGas: string, pressure: any) {
  const tips = [];
  
  tips.push({
    issue: 'Excessive kerf width',
    cause: 'Gas pressure too high',
    solution: `Reduce pressure by 10-20% from ${pressure.optimal} bar`,
  });
  
  tips.push({
    issue: 'Dross formation',
    cause: 'Insufficient gas pressure or flow',
    solution: `Increase pressure to ${pressure.optimal + 0.5} bar or check nozzle condition`,
  });
  
  tips.push({
    issue: 'Rough cut edges',
    cause: 'Gas pressure not optimized',
    solution: 'Fine-tune pressure within recommended range',
  });
  
  if (assistGas === 'nitrogen' && materialType.includes('steel')) {
    tips.push({
      issue: 'Oxidation on cut edges',
      cause: 'Nitrogen pressure too low',
      solution: 'Increase nitrogen pressure to maintain inert atmosphere',
    });
  }
  
  if (thickness > 10) {
    tips.push({
      issue: 'Incomplete cuts on thick material',
      cause: 'Insufficient melt ejection',
      solution: 'Increase gas pressure and check nozzle alignment',
    });
  }
  
  return tips;
}

function calculateGasCost(hourlyFlow: number, gasType: string) {
  const gasCosts = {
    oxygen: 0.15, // USD per m³
    nitrogen: 0.12,
    air: 0.02,
    argon: 0.25,
  };
  
  const costPerCubicMeter = gasCosts[gasType] || 0.10;
  return Math.round(hourlyFlow * costPerCubicMeter * 100) / 100;
}

export default gasPressureSettingConfig;
