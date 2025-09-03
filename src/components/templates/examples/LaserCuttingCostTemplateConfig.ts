// Example configuration for Laser Cutting Cost Calculator using templates
import { 
  CalculatorConfig, 
  CalculatorMetadata, 
  BreadcrumbItem, 
  InputTabConfig,
  InputGroup,
  InputParameter,
  TemplateConfig
} from '../types/CalculatorTypes';
import { ResultsDisplayConfig, DisplayConfig } from '../types/ResultTypes';
import { FormulaExplanationConfig } from '../FormulaExplanation/FormulaExplanationTemplate';
import { RelatedToolsConfig } from '../RelatedTools/RelatedToolsTemplate';
import { ExportConfig } from '../ExportTools/ExportToolsTemplate';
import { 
  Calculator, 
  Settings, 
  Zap, 
  DollarSign,
  FileText,
  FileSpreadsheet,
  Code,
  Mail,
  MessageCircle,
  Phone,
  BookOpen
} from 'lucide-react';

// Calculator Configuration
export const laserCuttingCostCalculatorConfig: CalculatorConfig = {
  id: 'laser-cutting-cost',
  name: 'Laser Cutting Cost Calculator',
  description: 'Comprehensive cost analysis for laser cutting operations',
  category: 'Cost Analysis',
  icon: 'Calculator',
  tags: ['laser cutting', 'cost analysis', 'manufacturing', 'optimization'],
  version: '2.0.0'
};

// Metadata Configuration
export const laserCuttingCostMetadata: CalculatorMetadata = {
  title: 'Laser Cutting Cost Calculator',
  subtitle: 'Professional Cost Analysis & Optimization Tool',
  description: 'Calculate comprehensive laser cutting costs including materials, energy, labor, and operational expenses. Get detailed breakdowns, sensitivity analysis, and optimization recommendations.',
  category: 'Manufacturing Cost Analysis',
  difficulty: 'intermediate',
  estimatedTime: '5-10 minutes',
  lastUpdated: '2024-01-15'
};

// Breadcrumbs Configuration
export const laserCuttingCostBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Calculators', href: '/calculators' },
  { label: 'Cost Analysis', href: '/calculators/cost-analysis' },
  { label: 'Laser Cutting Cost', active: true }
];

// Input Parameters Configuration
const materialParameters: InputParameter[] = [
  {
    id: 'materialType',
    name: 'materialType',
    label: 'Material Type',
    type: 'select',
    required: true,
    tooltip: 'Select the type of material to be cut',
    options: [
      { value: 'steel', label: 'Steel', description: 'Carbon steel sheets' },
      { value: 'stainless', label: 'Stainless Steel', description: 'Stainless steel sheets' },
      { value: 'aluminum', label: 'Aluminum', description: 'Aluminum sheets' },
      { value: 'brass', label: 'Brass', description: 'Brass sheets' },
      { value: 'copper', label: 'Copper', description: 'Copper sheets' }
    ]
  },
  {
    id: 'thickness',
    name: 'thickness',
    label: 'Material Thickness',
    type: 'number',
    required: true,
    min: 0.1,
    max: 50,
    step: 0.1,
    defaultValue: 3,
    tooltip: 'Thickness of the material in millimeters',
    unit: {
      primary: 'mm',
      alternatives: ['in', 'cm'],
      converter: (value: number, from: string, to: string) => {
        // Simple unit conversion logic
        if (from === 'mm' && to === 'in') return value / 25.4;
        if (from === 'in' && to === 'mm') return value * 25.4;
        if (from === 'mm' && to === 'cm') return value / 10;
        if (from === 'cm' && to === 'mm') return value * 10;
        return value;
      }
    }
  },
  {
    id: 'materialCost',
    name: 'materialCost',
    label: 'Material Cost per kg',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
    defaultValue: 2.5,
    tooltip: 'Cost of raw material per kilogram'
  }
];

const cuttingParameters: InputParameter[] = [
  {
    id: 'cuttingLength',
    name: 'cuttingLength',
    label: 'Total Cutting Length',
    type: 'number',
    required: true,
    min: 0,
    step: 0.1,
    defaultValue: 1000,
    tooltip: 'Total length of cuts required in millimeters',
    unit: {
      primary: 'mm',
      alternatives: ['m', 'in', 'ft'],
      converter: (value: number, from: string, to: string) => {
        // Unit conversion logic
        return value; // Simplified for example
      }
    }
  },
  {
    id: 'cuttingSpeed',
    name: 'cuttingSpeed',
    label: 'Cutting Speed',
    type: 'number',
    required: true,
    min: 1,
    max: 10000,
    step: 1,
    defaultValue: 1500,
    tooltip: 'Cutting speed in mm/min'
  },
  {
    id: 'laserPower',
    name: 'laserPower',
    label: 'Laser Power',
    type: 'number',
    required: true,
    min: 100,
    max: 20000,
    step: 100,
    defaultValue: 3000,
    tooltip: 'Laser power in watts'
  }
];

// Input Groups Configuration
const materialGroup: InputGroup = {
  id: 'material',
  title: 'Material Properties',
  description: 'Define the material specifications and costs',
  icon: '🔧',
  parameters: materialParameters,
  defaultExpanded: true
};

const cuttingGroup: InputGroup = {
  id: 'cutting',
  title: 'Cutting Parameters',
  description: 'Configure laser cutting settings and requirements',
  icon: '⚡',
  parameters: cuttingParameters,
  defaultExpanded: true
};

// Input Tabs Configuration
export const laserCuttingCostInputTabs: InputTabConfig[] = [
  {
    id: 'basic',
    label: 'Basic Parameters',
    icon: '⚙️',
    groups: [materialGroup, cuttingGroup]
  },
  {
    id: 'advanced',
    label: 'Advanced Settings',
    icon: '🔬',
    groups: [
      {
        id: 'costs',
        title: 'Cost Parameters',
        description: 'Advanced cost configuration',
        parameters: [
          {
            id: 'energyCost',
            name: 'energyCost',
            label: 'Energy Cost per kWh',
            type: 'number',
            required: true,
            min: 0,
            step: 0.001,
            defaultValue: 0.12,
            tooltip: 'Cost of electricity per kilowatt-hour'
          }
        ]
      }
    ]
  }
];

// Template Configuration
export const laserCuttingCostTemplateConfig: TemplateConfig = {
  showFormulaExplanation: true,
  showRelatedTools: true,
  showExportTools: true,
  showBreadcrumbs: true,
  enableRealTimeCalculation: false,
  enableInputValidation: true,
  customSections: []
};

// Formula Explanation Configuration
export const laserCuttingCostFormulaConfig: FormulaExplanationConfig = {
  calculatorName: 'Laser Cutting Cost Calculator',
  version: '2.0.0',
  lastUpdated: '2024-01-15',
  variables: [
    {
      symbol: 'TC',
      name: 'Total Cost',
      description: 'Complete cost for laser cutting operation',
      unit: 'USD',
      type: 'output'
    },
    {
      symbol: 'MC',
      name: 'Material Cost',
      description: 'Cost of raw material consumed',
      unit: 'USD',
      type: 'output'
    },
    {
      symbol: 'EC',
      name: 'Energy Cost',
      description: 'Cost of electricity consumed during cutting',
      unit: 'USD',
      type: 'output'
    },
    {
      symbol: 't',
      name: 'Material Thickness',
      description: 'Thickness of material being cut',
      unit: 'mm',
      type: 'input',
      range: { min: 0.1, max: 50 }
    },
    {
      symbol: 'L',
      name: 'Cutting Length',
      description: 'Total length of cuts required',
      unit: 'mm',
      type: 'input',
      range: { min: 1, max: 100000 }
    }
  ],
  calculationSteps: [
    {
      id: 'step1',
      title: 'Calculate Cutting Time',
      formula: 'T = L / S',
      description: 'Calculate total cutting time based on cutting length and speed',
      example: {
        input: { L: 1000, S: 1500 },
        output: 0.67
      }
    },
    {
      id: 'step2',
      title: 'Calculate Energy Cost',
      formula: 'EC = (P × T × R) / 1000',
      description: 'Calculate energy cost based on power consumption and time',
      example: {
        input: { P: 3000, T: 0.67, R: 0.12 },
        output: 0.24
      }
    }
  ],
  dataSources: [
    {
      name: 'Industry Material Costs',
      description: 'Current market prices for common materials',
      type: 'industry_standard',
      reliability: 'high',
      lastUpdated: '2024-01-01'
    },
    {
      name: 'Energy Efficiency Standards',
      description: 'Laser cutting machine efficiency data',
      type: 'manufacturer',
      reliability: 'high'
    }
  ],
  scope: {
    includes: [
      'Material costs based on current market prices',
      'Energy consumption during active cutting',
      'Basic labor costs for operation',
      'Machine depreciation and maintenance'
    ],
    excludes: [
      'Setup and programming time',
      'Material handling and logistics',
      'Quality control and inspection',
      'Overhead costs and facility expenses'
    ],
    assumptions: [
      'Standard cutting conditions and parameters',
      'Experienced operator with minimal waste',
      'Regular machine maintenance and calibration',
      'Stable material supply and pricing'
    ],
    limitations: [
      'Results are estimates based on typical conditions',
      'Actual costs may vary with specific applications',
      'Does not account for complex geometries',
      'Market price fluctuations not considered'
    ],
    applicability: [
      'Sheet metal fabrication',
      'Prototype development',
      'Small to medium production runs',
      'Standard industrial materials'
    ]
  },
  references: [
    'AWS D1.1 Structural Welding Code',
    'ISO 9013 Thermal cutting classification',
    'Industry cost analysis reports 2024'
  ],
  notes: [
    'Costs are calculated in USD and may need adjustment for local currencies',
    'Regular calibration of input parameters is recommended for accuracy'
  ]
};

// Related Tools Configuration
export const laserCuttingCostRelatedToolsConfig: RelatedToolsConfig = {
  calculatorName: 'Laser Cutting Cost Calculator',
  relatedCalculators: [
    {
      id: 'cutting-time',
      name: 'Cutting Time Estimator',
      description: 'Estimate cutting time for different materials and thicknesses',
      category: 'Time Analysis',
      icon: 'Clock',
      difficulty: 'beginner',
      estimatedTime: '3-5 minutes',
      popularity: 85,
      href: '/calculator/cutting-time',
      tags: ['time', 'estimation', 'planning']
    },
    {
      id: 'material-selection',
      name: 'Material Selection Assistant',
      description: 'Choose optimal materials for your laser cutting project',
      category: 'Material Analysis',
      icon: 'Layers',
      difficulty: 'intermediate',
      estimatedTime: '5-8 minutes',
      popularity: 72,
      href: '/calculator/material-selection',
      tags: ['materials', 'selection', 'optimization']
    }
  ],
  educationalResources: [
    {
      id: 'cost-optimization-guide',
      title: 'Laser Cutting Cost Optimization Guide',
      description: 'Comprehensive guide to reducing laser cutting costs through process optimization',
      type: 'guide',
      readTime: '15 min read',
      difficulty: 'intermediate',
      topics: ['cost reduction', 'process optimization', 'efficiency'],
      href: '/guides/cost-optimization'
    }
  ],
  faqItems: [
    {
      id: 'faq1',
      question: 'How accurate are the cost calculations?',
      answer: 'Our calculations are based on industry standards and typical operating conditions. Actual costs may vary by ±10-15% depending on specific equipment, materials, and local conditions.',
      category: 'accuracy',
      popularity: 95,
      tags: ['accuracy', 'reliability']
    }
  ],
  supportOptions: [
    {
      type: 'email',
      title: 'Email Support',
      description: 'Get detailed help via email',
      availability: '24/7',
      responseTime: 'Within 4 hours',
      icon: Mail,
      action: () => window.location.href = 'mailto:support@lasercalc.com'
    },
    {
      type: 'chat',
      title: 'Live Chat',
      description: 'Chat with our experts',
      availability: 'Mon-Fri 8AM-6PM EST',
      responseTime: 'Immediate',
      icon: MessageCircle,
      action: () => console.log('Open chat widget')
    }
  ]
};

// Results Display Configuration
export const laserCuttingCostResultsConfig: ResultsDisplayConfig = {
  showCharts: true,
  showBreakdown: true,
  showSensitivity: true,
  showMetrics: true,
  showRecommendations: true,
  chartTypes: ['pie', 'bar'],
  customSections: []
};

// Export Configuration
export const laserCuttingCostExportConfig: ExportConfig = {
  calculatorName: 'Laser Cutting Cost Calculator',
  version: '2.0.0',
  supportedFormats: [
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Comma-separated values for spreadsheet analysis',
      extension: 'csv',
      mimeType: 'text/csv',
      icon: FileText,
      category: 'data'
    },
    {
      id: 'excel',
      name: 'Excel Export',
      description: 'Microsoft Excel format with charts and formatting',
      extension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      icon: FileSpreadsheet,
      category: 'data'
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Professional formatted report for presentations',
      extension: 'pdf',
      mimeType: 'application/pdf',
      icon: FileText,
      category: 'report'
    }
  ],
  shareOptions: [
    {
      id: 'direct-link',
      name: 'Direct Link',
      description: 'Share calculation results via URL',
      icon: BookOpen,
      generateUrl: (data) => `${window.location.origin}/shared/${btoa(JSON.stringify(data))}`,
      supportsQR: true
    }
  ],
  embedOptions: [
    {
      id: 'standard',
      name: 'Standard Embed',
      description: 'Standard calculator embed for websites',
      width: 800,
      height: 600,
      responsive: true,
      generateCode: (url, options) => 
        `<iframe src="${url}" width="${options.width}" height="${options.height}" frameborder="0" ${options.responsive ? 'style="width:100%;height:auto;"' : ''}></iframe>`
    }
  ],
  printOptions: [
    {
      id: 'standard-print',
      name: 'Standard Print',
      description: 'Standard report format for printing',
      orientation: 'portrait',
      paperSize: 'A4',
      includeCharts: true
    }
  ]
};

// Display Configuration
export const laserCuttingCostDisplayConfig: DisplayConfig = {
  currency: 'USD',
  locale: 'en-US',
  decimalPlaces: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.',
  percentageFormat: 'percentage',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h'
};

// Initial Values
export const laserCuttingCostInitialValues = {
  materialType: 'steel',
  thickness: 3,
  materialCost: 2.5,
  cuttingLength: 1000,
  cuttingSpeed: 1500,
  laserPower: 3000,
  energyCost: 0.12
};
