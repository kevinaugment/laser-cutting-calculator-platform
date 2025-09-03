// Core Calculator Configurations - 20 Essential Calculators Only
// English-first interface with i18n support for DE/JP markets

export interface InputField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  badge: 'Standard' | 'AI Enhanced';
  iconName: string;
  category: string;
  inputs: InputField[];
  resultType: 'price' | 'time' | 'parameters' | 'selection' | 'analysis';
}

// Core 20 Calculator Configurations
export const coreCalculatorConfigs: Record<string, CalculatorConfig> = {
  // Epic 1: Core Engineering Calculators (5)
  'laser-parameter-optimizer': {
    id: 'laser-parameter-optimizer',
    title: 'Laser Parameter Optimizer',
    description: 'Optimize laser cutting parameters for maximum efficiency and quality',
    badge: 'AI Enhanced',
    iconName: 'Settings',
    category: 'Core Engineering',
    resultType: 'parameters',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'copper', label: 'Copper' },
          { value: 'brass', label: 'Brass' },
          { value: 'titanium', label: 'Titanium' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 0.1,
        max: 100,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'laserType',
        label: 'Laser Type',
        type: 'select',
        required: true,
        options: [
          { value: 'fiber', label: 'Fiber Laser' },
          { value: 'co2', label: 'CO2 Laser' },
          { value: 'nd_yag', label: 'Nd:YAG Laser' },
          { value: 'disk', label: 'Disk Laser' }
        ]
      },
      {
        id: 'maxPower',
        label: 'Maximum Laser Power',
        type: 'number',
        required: true,
        min: 100,
        max: 50000,
        step: 100,
        unit: 'W'
      },
      {
        id: 'qualityRequirement',
        label: 'Quality Requirement',
        type: 'select',
        required: true,
        options: [
          { value: 'draft', label: 'Draft Quality' },
          { value: 'standard', label: 'Standard Quality' },
          { value: 'precision', label: 'Precision Quality' },
          { value: 'ultra_precision', label: 'Ultra Precision' }
        ]
      }
    ]
  },

  'cutting-time-estimator': {
    id: 'cutting-time-estimator',
    title: 'Cutting Time Estimator',
    description: 'Estimate cutting time for accurate production planning',
    badge: 'Standard',
    iconName: 'Clock',
    category: 'Core Engineering',
    resultType: 'time',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
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
        unit: 'mm'
      },
      {
        id: 'cuttingLength',
        label: 'Total Cutting Length',
        type: 'number',
        required: true,
        min: 1,
        max: 100000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'pierceCount',
        label: 'Number of Pierces',
        type: 'number',
        required: true,
        min: 1,
        max: 1000,
        step: 1,
        unit: 'pieces'
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W'
      }
    ]
  },

  'material-selection-assistant': {
    id: 'material-selection-assistant',
    title: 'Material Selection Assistant',
    description: 'Select optimal materials based on application requirements',
    badge: 'AI Enhanced',
    iconName: 'Layers',
    category: 'Core Engineering',
    resultType: 'selection',
    inputs: [
      {
        id: 'application',
        label: 'Application Type',
        type: 'select',
        required: true,
        options: [
          { value: 'structural', label: 'Structural Components' },
          { value: 'decorative', label: 'Decorative Elements' },
          { value: 'functional', label: 'Functional Parts' },
          { value: 'prototype', label: 'Prototyping' }
        ]
      },
      {
        id: 'strengthRequirement',
        label: 'Strength Requirement',
        type: 'select',
        required: true,
        options: [
          { value: 'low', label: 'Low Strength' },
          { value: 'medium', label: 'Medium Strength' },
          { value: 'high', label: 'High Strength' },
          { value: 'ultra_high', label: 'Ultra High Strength' }
        ]
      },
      {
        id: 'corrosionResistance',
        label: 'Corrosion Resistance',
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'Not Required' },
          { value: 'mild', label: 'Mild Resistance' },
          { value: 'moderate', label: 'Moderate Resistance' },
          { value: 'high', label: 'High Resistance' }
        ]
      },
      {
        id: 'budget',
        label: 'Budget per Unit',
        type: 'number',
        required: true,
        min: 1,
        max: 1000,
        step: 0.1,
        unit: 'USD'
      }
    ]
  },

  'heat-affected-zone-calculator': {
    id: 'heat-affected-zone-calculator',
    title: 'Heat Affected Zone Calculator',
    description: 'Calculate and analyze heat affected zone for thermal control',
    badge: 'Standard',
    iconName: 'Thermometer',
    category: 'Core Engineering',
    resultType: 'analysis',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 1,
        max: 50,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W'
      },
      {
        id: 'cuttingSpeed',
        label: 'Cutting Speed',
        type: 'number',
        required: true,
        min: 100,
        max: 15000,
        step: 100,
        unit: 'mm/min'
      }
    ]
  },

  'beam-quality-calculator': {
    id: 'beam-quality-calculator',
    title: 'Beam Quality Calculator',
    description: 'Analyze laser beam quality and optical performance',
    badge: 'Standard',
    iconName: 'Zap',
    category: 'Core Engineering',
    resultType: 'analysis',
    inputs: [
      {
        id: 'laserType',
        label: 'Laser Type',
        type: 'select',
        required: true,
        options: [
          { value: 'fiber', label: 'Fiber Laser' },
          { value: 'co2', label: 'CO2 Laser' },
          { value: 'nd_yag', label: 'Nd:YAG Laser' },
          { value: 'disk', label: 'Disk Laser' }
        ]
      },
      {
        id: 'wavelength',
        label: 'Wavelength',
        type: 'number',
        required: true,
        min: 800,
        max: 11000,
        step: 1,
        unit: 'nm'
      },
      {
        id: 'power',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 100,
        max: 50000,
        step: 100,
        unit: 'W'
      },
      {
        id: 'beamDiameter',
        label: 'Beam Diameter',
        type: 'number',
        required: true,
        min: 1,
        max: 50,
        step: 0.1,
        unit: 'mm'
      }
    ]
  }
};

// Additional calculator configurations (legacy - to be cleaned up)
export const legacyCalculatorConfigs = {
  // Epic 2: Quality Control Calculators (5)
  'cutting-quality-predictor': {
    id: 'cutting-quality-predictor',
    title: 'Cutting Quality Predictor',
    description: 'Predict cutting quality based on parameters and material properties',
    badge: 'AI Enhanced',
    iconName: 'Target',
    category: 'Quality Control',
    resultType: 'analysis',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
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
        unit: 'mm'
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W'
      },
      {
        id: 'cuttingSpeed',
        label: 'Cutting Speed',
        type: 'number',
        required: true,
        min: 100,
        max: 15000,
        step: 100,
        unit: 'mm/min'
      },
      {
        id: 'gasType',
        label: 'Assist Gas Type',
        type: 'select',
        required: true,
        options: [
          { value: 'oxygen', label: 'Oxygen' },
          { value: 'nitrogen', label: 'Nitrogen' },
          { value: 'air', label: 'Compressed Air' },
          { value: 'argon', label: 'Argon' }
        ]
      }
    ]
  },

  'edge-quality-predictor': {
    id: 'edge-quality-predictor',
    title: 'Edge Quality Predictor',
    description: 'Analyze and predict edge quality characteristics',
    badge: 'Standard',
    iconName: 'Scissors',
    category: 'Quality Control',
    resultType: 'analysis',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 1,
        max: 50,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'cuttingSpeed',
        label: 'Cutting Speed',
        type: 'number',
        required: true,
        min: 100,
        max: 15000,
        step: 100,
        unit: 'mm/min'
      },
      {
        id: 'focusPosition',
        label: 'Focus Position',
        type: 'number',
        required: true,
        min: -5,
        max: 5,
        step: 0.1,
        unit: 'mm'
      }
    ]
  },

  'warping-risk-calculator': {
    id: 'warping-risk-calculator',
    title: 'Warping Risk Calculator',
    description: 'Calculate thermal distortion and warping risk',
    badge: 'Standard',
    iconName: 'AlertTriangle',
    category: 'Quality Control',
    resultType: 'analysis',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 0.5,
        max: 25,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'partLength',
        label: 'Part Length',
        type: 'number',
        required: true,
        min: 10,
        max: 3000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'partWidth',
        label: 'Part Width',
        type: 'number',
        required: true,
        min: 10,
        max: 1500,
        step: 1,
        unit: 'mm'
      }
    ]
  },

  'burn-mark-preventer': {
    id: 'burn-mark-preventer',
    title: 'Burn Mark Preventer',
    description: 'Prevent burn marks with optimized cutting parameters',
    badge: 'Standard',
    iconName: 'Shield',
    category: 'Quality Control',
    resultType: 'parameters',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 0.5,
        max: 20,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'surfaceFinish',
        label: 'Required Surface Finish',
        type: 'select',
        required: true,
        options: [
          { value: 'standard', label: 'Standard Finish' },
          { value: 'smooth', label: 'Smooth Finish' },
          { value: 'mirror', label: 'Mirror Finish' }
        ]
      }
    ]
  },

  'dross-formation-calculator': {
    id: 'dross-formation-calculator',
    title: 'Dross Formation Calculator',
    description: 'Calculate and minimize dross formation',
    badge: 'Standard',
    iconName: 'Droplets',
    category: 'Quality Control',
    resultType: 'analysis',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 1,
        max: 50,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'gasType',
        label: 'Assist Gas Type',
        type: 'select',
        required: true,
        options: [
          { value: 'oxygen', label: 'Oxygen' },
          { value: 'nitrogen', label: 'Nitrogen' },
          { value: 'air', label: 'Compressed Air' }
        ]
      },
      {
        id: 'gasPressure',
        label: 'Gas Pressure',
        type: 'number',
        required: true,
        min: 0.5,
        max: 20,
        step: 0.1,
        unit: 'bar'
      }
    ]
  },

  // Epic 3: Process Optimization Calculators (5)
  'material-thickness-optimizer': {
    id: 'material-thickness-optimizer',
    title: 'Material Thickness Optimizer',
    description: 'Optimize material thickness for cost and performance balance',
    badge: 'AI Enhanced',
    iconName: 'Layers',
    category: 'Process Optimization',
    resultType: 'selection',
    inputs: [
      {
        id: 'application',
        label: 'Application Type',
        type: 'select',
        required: true,
        options: [
          { value: 'structural', label: 'Structural Component' },
          { value: 'decorative', label: 'Decorative Element' },
          { value: 'functional', label: 'Functional Part' }
        ]
      },
      {
        id: 'loadRequirement',
        label: 'Load Requirement',
        type: 'number',
        required: true,
        min: 0,
        max: 10000,
        step: 1,
        unit: 'N'
      },
      {
        id: 'budgetConstraint',
        label: 'Budget per Unit',
        type: 'number',
        required: true,
        min: 1,
        max: 500,
        step: 0.1,
        unit: 'USD'
      }
    ]
  },

  'nozzle-selection-guide': {
    id: 'nozzle-selection-guide',
    title: 'Nozzle Selection Guide',
    description: 'Select optimal nozzle type and size for cutting application',
    badge: 'Standard',
    iconName: 'Circle',
    category: 'Process Optimization',
    resultType: 'selection',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
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
        unit: 'mm'
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W'
      },
      {
        id: 'gasType',
        label: 'Assist Gas Type',
        type: 'select',
        required: true,
        options: [
          { value: 'oxygen', label: 'Oxygen' },
          { value: 'nitrogen', label: 'Nitrogen' },
          { value: 'air', label: 'Compressed Air' }
        ]
      }
    ]
  },

  'cut-path-optimizer': {
    id: 'cut-path-optimizer',
    title: 'Cut Path Optimizer',
    description: 'Optimize cutting path for minimum time and maximum efficiency',
    badge: 'AI Enhanced',
    iconName: 'Route',
    category: 'Process Optimization',
    resultType: 'parameters',
    inputs: [
      {
        id: 'partCount',
        label: 'Number of Parts',
        type: 'number',
        required: true,
        min: 1,
        max: 100,
        step: 1,
        unit: 'pieces'
      },
      {
        id: 'sheetLength',
        label: 'Sheet Length',
        type: 'number',
        required: true,
        min: 100,
        max: 6000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'sheetWidth',
        label: 'Sheet Width',
        type: 'number',
        required: true,
        min: 100,
        max: 3000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'partComplexity',
        label: 'Part Complexity',
        type: 'select',
        required: true,
        options: [
          { value: 'simple', label: 'Simple Geometry' },
          { value: 'moderate', label: 'Moderate Complexity' },
          { value: 'complex', label: 'Complex Geometry' }
        ]
      }
    ]
  },

  'material-nesting-optimizer': {
    id: 'material-nesting-optimizer',
    title: 'Material Nesting Optimizer',
    description: 'Optimize part nesting for maximum material utilization',
    badge: 'AI Enhanced',
    iconName: 'Grid',
    category: 'Process Optimization',
    resultType: 'analysis',
    inputs: [
      {
        id: 'sheetLength',
        label: 'Sheet Length',
        type: 'number',
        required: true,
        min: 100,
        max: 6000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'sheetWidth',
        label: 'Sheet Width',
        type: 'number',
        required: true,
        min: 100,
        max: 3000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'partLength',
        label: 'Part Length',
        type: 'number',
        required: true,
        min: 10,
        max: 1000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'partWidth',
        label: 'Part Width',
        type: 'number',
        required: true,
        min: 10,
        max: 1000,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'quantity',
        label: 'Quantity Needed',
        type: 'number',
        required: true,
        min: 1,
        max: 1000,
        step: 1,
        unit: 'pieces'
      }
    ]
  },

  'sheet-utilization-calculator': {
    id: 'sheet-utilization-calculator',
    title: 'Sheet Utilization Calculator',
    description: 'Calculate material utilization efficiency and waste analysis',
    badge: 'Standard',
    iconName: 'PieChart',
    category: 'Process Optimization',
    resultType: 'analysis',
    inputs: [
      {
        id: 'sheetArea',
        label: 'Total Sheet Area',
        type: 'number',
        required: true,
        min: 1000,
        max: 18000000,
        step: 1000,
        unit: 'mm²'
      },
      {
        id: 'usedArea',
        label: 'Used Area',
        type: 'number',
        required: true,
        min: 100,
        max: 18000000,
        step: 100,
        unit: 'mm²'
      },
      {
        id: 'materialCost',
        label: 'Material Cost per Sheet',
        type: 'number',
        required: true,
        min: 1,
        max: 1000,
        step: 0.1,
        unit: 'USD'
      }
    ]
  },

  // Epic 4: Advanced Analysis Calculators (5)
  'power-requirement-calculator': {
    id: 'power-requirement-calculator',
    title: 'Power Requirement Calculator',
    description: 'Calculate optimal laser power requirements for specific applications',
    badge: 'Standard',
    iconName: 'Zap',
    category: 'Advanced Analysis',
    resultType: 'parameters',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'copper', label: 'Copper' },
          { value: 'titanium', label: 'Titanium' }
        ]
      },
      {
        id: 'thickness',
        label: 'Maximum Thickness',
        type: 'number',
        required: true,
        min: 0.5,
        max: 100,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'cuttingSpeed',
        label: 'Required Cutting Speed',
        type: 'number',
        required: true,
        min: 100,
        max: 15000,
        step: 100,
        unit: 'mm/min'
      },
      {
        id: 'qualityLevel',
        label: 'Quality Level',
        type: 'select',
        required: true,
        options: [
          { value: 'production', label: 'Production Quality' },
          { value: 'precision', label: 'Precision Quality' },
          { value: 'ultra_precision', label: 'Ultra Precision' }
        ]
      }
    ]
  },

  'gas-consumption-calculator': {
    id: 'gas-consumption-calculator',
    title: 'Gas Consumption Calculator',
    description: 'Calculate assist gas consumption and optimize usage efficiency',
    badge: 'Standard',
    iconName: 'Wind',
    category: 'Advanced Analysis',
    resultType: 'analysis',
    inputs: [
      {
        id: 'gasType',
        label: 'Assist Gas Type',
        type: 'select',
        required: true,
        options: [
          { value: 'oxygen', label: 'Oxygen' },
          { value: 'nitrogen', label: 'Nitrogen' },
          { value: 'air', label: 'Compressed Air' },
          { value: 'argon', label: 'Argon' }
        ]
      },
      {
        id: 'gasPressure',
        label: 'Gas Pressure',
        type: 'number',
        required: true,
        min: 0.5,
        max: 20,
        step: 0.1,
        unit: 'bar'
      },
      {
        id: 'cuttingTime',
        label: 'Total Cutting Time',
        type: 'number',
        required: true,
        min: 1,
        max: 480,
        step: 1,
        unit: 'minutes'
      },
      {
        id: 'nozzleDiameter',
        label: 'Nozzle Diameter',
        type: 'number',
        required: true,
        min: 0.5,
        max: 5,
        step: 0.1,
        unit: 'mm'
      }
    ]
  },

  'tolerance-stack-calculator': {
    id: 'tolerance-stack-calculator',
    title: 'Tolerance Stack Calculator',
    description: 'Analyze tolerance accumulation and precision requirements',
    badge: 'Standard',
    iconName: 'Ruler',
    category: 'Advanced Analysis',
    resultType: 'analysis',
    inputs: [
      {
        id: 'partCount',
        label: 'Number of Parts in Assembly',
        type: 'number',
        required: true,
        min: 2,
        max: 20,
        step: 1,
        unit: 'pieces'
      },
      {
        id: 'individualTolerance',
        label: 'Individual Part Tolerance',
        type: 'number',
        required: true,
        min: 0.01,
        max: 1,
        step: 0.01,
        unit: 'mm'
      },
      {
        id: 'assemblyMethod',
        label: 'Assembly Method',
        type: 'select',
        required: true,
        options: [
          { value: 'worst_case', label: 'Worst Case Analysis' },
          { value: 'rss', label: 'Root Sum Square' },
          { value: 'statistical', label: 'Statistical Analysis' }
        ]
      }
    ]
  },

  'equipment-comparison-tool': {
    id: 'equipment-comparison-tool',
    title: 'Equipment Comparison Tool',
    description: 'Compare laser cutting equipment specifications and capabilities',
    badge: 'Standard',
    iconName: 'BarChart',
    category: 'Advanced Analysis',
    resultType: 'analysis',
    inputs: [
      {
        id: 'maxThickness',
        label: 'Maximum Thickness Requirement',
        type: 'number',
        required: true,
        min: 1,
        max: 100,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'workingArea',
        label: 'Required Working Area',
        type: 'select',
        required: true,
        options: [
          { value: 'small', label: 'Small (1m x 1m)' },
          { value: 'medium', label: 'Medium (2m x 1m)' },
          { value: 'large', label: 'Large (3m x 1.5m)' },
          { value: 'extra_large', label: 'Extra Large (6m x 2m)' }
        ]
      },
      {
        id: 'budget',
        label: 'Budget Range',
        type: 'select',
        required: true,
        options: [
          { value: 'entry', label: 'Entry Level ($50k-$150k)' },
          { value: 'mid', label: 'Mid Range ($150k-$500k)' },
          { value: 'high', label: 'High End ($500k-$1M)' },
          { value: 'premium', label: 'Premium ($1M+)' }
        ]
      },
      {
        id: 'primaryMaterial',
        label: 'Primary Material',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'mixed', label: 'Mixed Materials' }
        ]
      }
    ]
  },

  'production-capacity-planner': {
    id: 'production-capacity-planner',
    title: 'Production Capacity Planner',
    description: 'Plan and analyze production capacity and throughput',
    badge: 'AI Enhanced',
    iconName: 'TrendingUp',
    category: 'Advanced Analysis',
    resultType: 'analysis',
    inputs: [
      {
        id: 'workingHours',
        label: 'Working Hours per Day',
        type: 'number',
        required: true,
        min: 1,
        max: 24,
        step: 0.5,
        unit: 'hours'
      },
      {
        id: 'workingDays',
        label: 'Working Days per Week',
        type: 'number',
        required: true,
        min: 1,
        max: 7,
        step: 1,
        unit: 'days'
      },
      {
        id: 'averagePartTime',
        label: 'Average Part Processing Time',
        type: 'number',
        required: true,
        min: 0.1,
        max: 60,
        step: 0.1,
        unit: 'minutes'
      },
      {
        id: 'setupTime',
        label: 'Setup Time per Job',
        type: 'number',
        required: true,
        min: 1,
        max: 120,
        step: 1,
        unit: 'minutes'
      },
      {
        id: 'efficiency',
        label: 'Expected Efficiency',
        type: 'number',
        required: true,
        min: 50,
        max: 95,
        step: 1,
        unit: '%'
      }
    ]
  }
};

// Export array format for compatibility
export const coreCalculatorConfigsArray: CalculatorConfig[] = Object.values(coreCalculatorConfigs);

// Category mapping for navigation - Updated for 20 Core Calculators
export const calculatorCategories = {
  'Core Engineering': [
    'laser-cutting-cost',
    'cutting-time-estimator',
    'laser-parameter-optimizer',
    'material-selection-assistant',
    'gas-consumption-calculator'
  ],
  'Quality Control': [
    'edge-quality-predictor',
    'warping-risk-calculator',
    'burn-mark-preventer',
    'dross-formation-calculator',
    'tolerance-stack-calculator'
  ],
  'Process Optimization': [
    'focus-height-calculator',
    'gas-pressure-setting-guide',
    'frequency-setting-assistant',
    'multiple-pass-calculator',
    'power-speed-matching'
  ],
  'Advanced Analysis': [
    'sensitivity-analysis-calculator',
    'process-optimization-engine',
    'predictive-quality-model',
    'cost-benefit-analyzer',
    'performance-benchmarking-tool'
  ]
};

// Complete calculator metadata for all 20 core calculators
export const coreCalculatorMetadata = {
  // Epic 1: Core Engineering (5 calculators)
  'laser-cutting-cost': {
    id: 'laser-cutting-cost',
    name: 'Laser Cutting Cost Calculator',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Calculate comprehensive laser cutting costs including materials, labor, and overhead',
    features: ['Cost Analysis', 'Material Optimization', 'Labor Calculation'],
    estimatedTime: '< 1s',
    version: '1.0.0'
  },
  'cutting-time-estimator': {
    id: 'cutting-time-estimator',
    name: 'Cutting Time Estimator',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Estimate cutting time based on material properties and laser parameters',
    features: ['Time Estimation', 'Parameter Analysis', 'Efficiency Optimization'],
    estimatedTime: '< 1s',
    version: '1.0.0'
  },
  'laser-parameter-optimizer': {
    id: 'laser-parameter-optimizer',
    name: 'Laser Parameter Optimizer',
    category: 'Core Engineering',
    difficulty: 'Advanced',
    badge: 'AI Enhanced',
    description: 'Optimize laser cutting parameters for maximum efficiency and quality',
    features: ['AI Optimization', 'Parameter Tuning', 'Quality Prediction'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },
  'material-selection-assistant': {
    id: 'material-selection-assistant',
    name: 'Material Selection Assistant',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'AI Enhanced',
    description: 'AI-powered material selection based on cutting requirements and constraints',
    features: ['Material Database', 'AI Recommendations', 'Cost Analysis'],
    estimatedTime: '< 1s',
    version: '1.0.0'
  },
  'gas-consumption-calculator': {
    id: 'gas-consumption-calculator',
    name: 'Gas Consumption Calculator',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Calculate assist gas consumption and costs for laser cutting operations',
    features: ['Gas Analysis', 'Cost Calculation', 'Efficiency Metrics'],
    estimatedTime: '< 1s',
    version: '1.0.0'
  },

  // Epic 2: Quality Control (5 calculators)
  'edge-quality-predictor': {
    id: 'edge-quality-predictor',
    name: 'Edge Quality Predictor',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'AI Enhanced',
    description: 'Predict and optimize edge quality using machine learning algorithms',
    features: ['ML Prediction', 'Quality Analysis', 'Parameter Optimization'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },
  'warping-risk-calculator': {
    id: 'warping-risk-calculator',
    name: 'Warping Risk Calculator',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate thermal warping risk and provide prevention strategies',
    features: ['Thermal Analysis', 'Risk Assessment', 'Prevention Strategies'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },
  'burn-mark-preventer': {
    id: 'burn-mark-preventer',
    name: 'Burn Mark Preventer',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Prevent burn marks through optimized cutting parameters and techniques',
    features: ['Burn Prevention', 'Parameter Optimization', 'Quality Control'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },
  'dross-formation-calculator': {
    id: 'dross-formation-calculator',
    name: 'Dross Formation Calculator',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate and minimize dross formation for clean cuts',
    features: ['Dross Analysis', 'Parameter Optimization', 'Quality Improvement'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },
  'tolerance-stack-calculator': {
    id: 'tolerance-stack-calculator',
    name: 'Tolerance Stack Calculator',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate dimensional tolerance stack-up for precision cutting',
    features: ['Tolerance Analysis', 'Precision Control', 'Quality Assurance'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },

  // Epic 3: Process Optimization (5 calculators)
  'focus-height-calculator': {
    id: 'focus-height-calculator',
    name: 'Focus Height Calculator',
    category: 'Process Optimization',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Calculate optimal focus height for different materials and thicknesses',
    features: ['Focus Optimization', 'Material Analysis', 'Parameter Tuning'],
    estimatedTime: '< 1s',
    version: '1.0.0'
  },
  'gas-pressure-setting-guide': {
    id: 'gas-pressure-setting-guide',
    name: 'Gas Pressure Setting Guide',
    category: 'Process Optimization',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Optimize assist gas pressure settings for different cutting scenarios',
    features: ['Pressure Optimization', 'Gas Analysis', 'Cutting Quality'],
    estimatedTime: '< 1s',
    version: '1.0.0'
  },
  'frequency-setting-assistant': {
    id: 'frequency-setting-assistant',
    name: 'Frequency Setting Assistant',
    category: 'Process Optimization',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Optimize laser frequency settings for different materials and applications',
    features: ['Frequency Optimization', 'Material Matching', 'Quality Control'],
    estimatedTime: '< 1s',
    version: '1.0.0'
  },
  'multiple-pass-calculator': {
    id: 'multiple-pass-calculator',
    name: 'Multiple Pass Calculator',
    category: 'Process Optimization',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate optimal multiple pass strategies for thick materials',
    features: ['Multi-Pass Strategy', 'Thick Material Cutting', 'Quality Optimization'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },
  'power-speed-matching': {
    id: 'power-speed-matching',
    name: 'Power-Speed Matching Calculator',
    category: 'Process Optimization',
    difficulty: 'Advanced',
    badge: 'AI Enhanced',
    description: 'AI-powered optimization of laser power and cutting speed relationships',
    features: ['AI Optimization', 'Power-Speed Matching', 'Efficiency Maximization'],
    estimatedTime: '< 2s',
    version: '1.0.0'
  },

  // Epic 4: Advanced Analysis (5 calculators)
  'sensitivity-analysis-calculator': {
    id: 'sensitivity-analysis-calculator',
    name: 'Sensitivity Analysis Calculator',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'Premium',
    description: 'Advanced sensitivity analysis of cutting parameters and their impact',
    features: ['Sensitivity Analysis', 'Parameter Impact', 'Statistical Analysis'],
    estimatedTime: '< 3s',
    version: '1.0.0'
  },
  'process-optimization-engine': {
    id: 'process-optimization-engine',
    name: 'Process Optimization Engine',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'AI Enhanced',
    description: 'AI-powered comprehensive process optimization using advanced algorithms',
    features: ['AI Optimization', 'Multi-Objective Optimization', 'Advanced Analytics'],
    estimatedTime: '< 5s',
    version: '1.0.0'
  },
  'predictive-quality-model': {
    id: 'predictive-quality-model',
    name: 'Predictive Quality Model',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'AI Enhanced',
    description: 'Machine learning-based quality prediction and optimization',
    features: ['ML Prediction', 'Quality Forecasting', 'Predictive Analytics'],
    estimatedTime: '< 5s',
    version: '1.0.0'
  },
  'cost-benefit-analyzer': {
    id: 'cost-benefit-analyzer',
    name: 'Cost-Benefit Analyzer',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'Premium',
    description: 'Comprehensive cost-benefit analysis for laser cutting investments',
    features: ['Financial Analysis', 'ROI Calculation', 'Investment Planning'],
    estimatedTime: '< 3s',
    version: '1.0.0'
  },
  'performance-benchmarking-tool': {
    id: 'performance-benchmarking-tool',
    name: 'Performance Benchmarking Tool',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'Premium',
    description: 'Comprehensive performance benchmarking against industry standards',
    features: ['Performance Analysis', 'Industry Benchmarking', 'Competitive Analysis'],
    estimatedTime: '< 3s',
    version: '1.0.0'
  }
};

// Export calculator count for verification
export const CORE_CALCULATOR_COUNT = Object.keys(coreCalculatorMetadata).length; // Should be 20

// Export categories with counts
export const categoryStats = {
  'Core Engineering': calculatorCategories['Core Engineering'].length,
  'Quality Control': calculatorCategories['Quality Control'].length,
  'Process Optimization': calculatorCategories['Process Optimization'].length,
  'Advanced Analysis': calculatorCategories['Advanced Analysis'].length,
  total: CORE_CALCULATOR_COUNT
};
