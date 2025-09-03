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
  iconName: string; // Changed from React.ReactNode to string
  category: string;
  inputs: InputField[];
  resultType: 'price' | 'time' | 'parameters' | 'selection' | 'analysis';
}

export const calculatorConfigs: Record<string, CalculatorConfig> = {
  'laser-cutting-cost': {
    id: 'laser-cutting-cost',
    title: 'Laser Cutting Cost Calculator',
    description: 'Calculate comprehensive laser cutting costs with AI optimization',
    badge: 'AI Enhanced',
    iconName: 'DollarSign',
    category: 'Cost & Pricing',
    resultType: 'price',
    inputs: [
      {
        id: 'directMaterialCost',
        label: 'Direct Material Cost',
        type: 'number',
        placeholder: '30.00',
        required: true,
        min: 0,
        step: 0.01,
        unit: '$'
      },
      {
        id: 'directLaborCost',
        label: 'Direct Labor Cost',
        type: 'number',
        placeholder: '20.00',
        required: true,
        min: 0,
        step: 0.01,
        unit: '$'
      },
      {
        id: 'overheadCost',
        label: 'Overhead Cost',
        type: 'number',
        placeholder: '15.00',
        required: true,
        min: 0,
        step: 0.01,
        unit: '$'
      },
      {
        id: 'targetProfitMargin',
        label: 'Target Profit Margin',
        type: 'number',
        placeholder: '25',
        required: true,
        min: 0,
        max: 100,
        step: 1,
        unit: '%'
      }
    ]
  },

  'cutting-time-estimator': {
    id: 'cutting-time-estimator',
    title: 'Cutting Time Estimator',
    description: 'Estimate laser cutting time with precision algorithms',
    badge: 'Standard',
    iconName: 'Clock',
    category: 'Time & Efficiency',
    resultType: 'time',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'stainless', label: 'Stainless Steel' },
          { value: 'brass', label: 'Brass' },
          { value: 'copper', label: 'Copper' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        placeholder: '3.0',
        required: true,
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'cuttingLength',
        label: 'Total Cutting Length',
        type: 'number',
        placeholder: '1000',
        required: true,
        min: 1,
        step: 1,
        unit: 'mm'
      },
      {
        id: 'piercingPoints',
        label: 'Number of Piercing Points',
        type: 'number',
        placeholder: '5',
        required: true,
        min: 1,
        step: 1
      },
      {
        id: 'quantity',
        label: 'Quantity',
        type: 'number',
        placeholder: '1',
        required: true,
        min: 1,
        step: 1
      }
    ]
  },

  'laser-parameter-optimizer': {
    id: 'laser-parameter-optimizer',
    title: 'Laser Parameter Optimizer',
    description: 'Optimize laser parameters for best cutting quality',
    badge: 'AI Enhanced',
    iconName: 'Settings',
    category: 'Parameters & Settings',
    resultType: 'parameters',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        options: [
          { value: 'steel', label: 'Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'stainless', label: 'Stainless Steel' },
          { value: 'brass', label: 'Brass' },
          { value: 'copper', label: 'Copper' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        placeholder: '3.0',
        required: true,
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'laserPower',
        label: 'Available Laser Power',
        type: 'number',
        placeholder: '2000',
        required: true,
        min: 500,
        max: 10000,
        step: 100,
        unit: 'W'
      },
      {
        id: 'qualityRequirement',
        label: 'Quality Requirement',
        type: 'select',
        required: true,
        options: [
          { value: 'high', label: 'High Quality' },
          { value: 'medium', label: 'Medium Quality' },
          { value: 'fast', label: 'Fast Cutting' }
        ]
      }
    ]
  },

  'material-selection-assistant': {
    id: 'material-selection-assistant',
    title: 'Material Selection Assistant',
    description: 'Find the best material for your laser cutting project',
    badge: 'AI Enhanced',
    iconName: 'Target',
    category: 'Material & Quality',
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
          { value: 'functional', label: 'Functional Part' },
          { value: 'prototype', label: 'Prototype' }
        ]
      },
      {
        id: 'thickness',
        label: 'Required Thickness',
        type: 'number',
        placeholder: '3.0',
        required: true,
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mm'
      },
      {
        id: 'budget',
        label: 'Budget per Unit',
        type: 'number',
        placeholder: '50.00',
        required: true,
        min: 1,
        step: 0.01,
        unit: '$'
      },
      {
        id: 'environment',
        label: 'Operating Environment',
        type: 'select',
        required: true,
        options: [
          { value: 'indoor', label: 'Indoor' },
          { value: 'outdoor', label: 'Outdoor' },
          { value: 'marine', label: 'Marine' },
          { value: 'industrial', label: 'Industrial' }
        ]
      },
      {
        id: 'strength',
        label: 'Strength Requirement',
        type: 'select',
        required: true,
        options: [
          { value: 'low', label: 'Low Strength' },
          { value: 'medium', label: 'Medium Strength' },
          { value: 'high', label: 'High Strength' }
        ]
      }
    ]
  }
};

// Helper function to get calculator config
export const getCalculatorConfig = (calculatorId: string): CalculatorConfig | null => {
  return calculatorConfigs[calculatorId] || null;
};

// Helper function to get all calculator configs
export const getAllCalculatorConfigs = (): CalculatorConfig[] => {
  return Object.values(calculatorConfigs);
};
