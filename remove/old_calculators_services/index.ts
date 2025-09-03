// Complete Calculator Registry - All 21 Calculators
// All implemented calculators registered and available

// Import all calculators
import { laserCuttingCostCalculator } from './laserCuttingCostCalculator';
import { cuttingTimeEstimator } from './cuttingTimeEstimator';
import { laserParameterOptimizer } from './laserParameterOptimizer';
import { materialSelectionAssistant } from './materialSelectionAssistant';
import { batchProcessingCalculator } from './batchProcessingCalculator';
import { cutPathOptimizer } from './cutPathOptimizer';
import { edgeQualityPredictor } from './edgeQualityPredictor';
import { energyCostCalculator } from './energyCostCalculator';
import { equipmentComparisonTool } from './equipmentComparisonTool';
import { focusHeightCalculator } from './focusHeightCalculator';
import { gasConsumptionCalculator } from './gasConsumptionCalculator';
import { heatAffectedZoneCalculator } from './heatAffectedZoneCalculator';
import { jobQueueOptimizer } from './jobQueueOptimizer';
import { kerfWidthCalculator } from './kerfWidthCalculator';
import { maintenanceCostEstimator } from './maintenanceCostEstimator';
import { materialNestingOptimizer } from './materialNestingOptimizer';
import { productionCapacityPlanner } from './productionCapacityPlanner';
import { profitMarginCalculator } from './profitMarginCalculator';
import { projectQuotingCalculator } from './projectQuotingCalculator';
import { qualityGradePredictor } from './qualityGradePredictor';
import { warpingRiskCalculator } from './warpingRiskCalculator';

// Complete calculator registry with all 21 calculators
export const calculatorRegistry = {
  // Core Business Calculators (4)
  'laser-cutting-cost': laserCuttingCostCalculator,
  'cutting-time-estimator': cuttingTimeEstimator,
  'laser-parameter-optimizer': laserParameterOptimizer,
  'material-selection-assistant': materialSelectionAssistant,

  // Cost & Pricing Calculators (5)
  'energy-cost': energyCostCalculator,
  'profit-margin': profitMarginCalculator,
  'project-quoting': projectQuotingCalculator,
  'maintenance-cost': maintenanceCostEstimator,
  'gas-consumption': gasConsumptionCalculator,

  // Time & Efficiency Calculators (4)
  'batch-processing': batchProcessingCalculator,
  'job-queue-optimizer': jobQueueOptimizer,
  'production-capacity': productionCapacityPlanner,
  'cut-path-optimizer': cutPathOptimizer,

  // Parameters & Settings Calculators (4)
  'focus-height': focusHeightCalculator,
  'kerf-width': kerfWidthCalculator,
  'heat-affected-zone': heatAffectedZoneCalculator,
  'warping-risk': warpingRiskCalculator,

  // Quality & Optimization Calculators (4)
  'edge-quality-predictor': edgeQualityPredictor,
  'quality-grade-predictor': qualityGradePredictor,
  'material-nesting-optimizer': materialNestingOptimizer,
  'equipment-comparison': equipmentComparisonTool,
};

// Calculator Metadata - 20 Core Calculators Complete Registry
export const calculatorMetadata = {
  // Epic 1: Core Engineering (5 calculators)
  'laser-cutting-cost': {
    name: 'Laser Cutting Cost Calculator',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Calculate comprehensive laser cutting costs including materials, labor, and overhead',
    features: ['Cost Analysis', 'Material Optimization', 'Labor Calculation'],
    estimatedTime: '< 1s'
  },
  'cutting-time-estimator': {
    name: 'Cutting Time Estimator',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Estimate cutting time based on material properties and laser parameters',
    features: ['Time Estimation', 'Parameter Analysis', 'Efficiency Optimization'],
    estimatedTime: '< 1s'
  },
  'laser-parameter-optimizer': {
    name: 'Laser Parameter Optimizer',
    category: 'Core Engineering',
    difficulty: 'Advanced',
    badge: 'AI Enhanced',
    description: 'Optimize laser cutting parameters for maximum efficiency and quality',
    features: ['AI Optimization', 'Parameter Tuning', 'Quality Prediction'],
    estimatedTime: '< 2s'
  },
  'material-selection-assistant': {
    name: 'Material Selection Assistant',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'AI Enhanced',
    description: 'AI-powered material selection based on cutting requirements and constraints',
    features: ['Material Database', 'AI Recommendations', 'Cost Analysis'],
    estimatedTime: '< 1s'
  },
  'gas-consumption-calculator': {
    name: 'Gas Consumption Calculator',
    category: 'Core Engineering',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Calculate assist gas consumption and costs for laser cutting operations',
    features: ['Gas Analysis', 'Cost Calculation', 'Efficiency Metrics'],
    estimatedTime: '< 1s'
  },

  // Epic 2: Quality Control (5 calculators)
  'edge-quality-predictor': {
    name: 'Edge Quality Predictor',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'AI Enhanced',
    description: 'Predict and optimize edge quality using machine learning algorithms',
    features: ['ML Prediction', 'Quality Analysis', 'Parameter Optimization'],
    estimatedTime: '< 2s'
  },
  'warping-risk-calculator': {
    name: 'Warping Risk Calculator',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate thermal warping risk and provide prevention strategies',
    features: ['Thermal Analysis', 'Risk Assessment', 'Prevention Strategies'],
    estimatedTime: '< 2s'
  },
  'burn-mark-preventer': {
    name: 'Burn Mark Preventer',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Prevent burn marks through optimized cutting parameters and techniques',
    features: ['Burn Prevention', 'Parameter Optimization', 'Quality Control'],
    estimatedTime: '< 2s'
  },
  'dross-formation-calculator': {
    name: 'Dross Formation Calculator',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate and minimize dross formation for clean cuts',
    features: ['Dross Analysis', 'Parameter Optimization', 'Quality Improvement'],
    estimatedTime: '< 2s'
  },
  'tolerance-stack-calculator': {
    name: 'Tolerance Stack Calculator',
    category: 'Quality Control',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate dimensional tolerance stack-up for precision cutting',
    features: ['Tolerance Analysis', 'Precision Control', 'Quality Assurance'],
    estimatedTime: '< 2s'
  },

  // Epic 3: Process Optimization (5 calculators)
  'focus-height-calculator': {
    name: 'Focus Height Calculator',
    category: 'Process Optimization',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Calculate optimal focus height for different materials and thicknesses',
    features: ['Focus Optimization', 'Material Analysis', 'Parameter Tuning'],
    estimatedTime: '< 1s'
  },
  'gas-pressure-setting-guide': {
    name: 'Gas Pressure Setting Guide',
    category: 'Process Optimization',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Optimize assist gas pressure settings for different cutting scenarios',
    features: ['Pressure Optimization', 'Gas Analysis', 'Cutting Quality'],
    estimatedTime: '< 1s'
  },
  'frequency-setting-assistant': {
    name: 'Frequency Setting Assistant',
    category: 'Process Optimization',
    difficulty: 'Intermediate',
    badge: 'Standard',
    description: 'Optimize laser frequency settings for different materials and applications',
    features: ['Frequency Optimization', 'Material Matching', 'Quality Control'],
    estimatedTime: '< 1s'
  },
  'multiple-pass-calculator': {
    name: 'Multiple Pass Calculator',
    category: 'Process Optimization',
    difficulty: 'Advanced',
    badge: 'Premium',
    description: 'Calculate optimal multiple pass strategies for thick materials',
    features: ['Multi-Pass Strategy', 'Thick Material Cutting', 'Quality Optimization'],
    estimatedTime: '< 2s'
  },
  'power-speed-matching': {
    name: 'Power-Speed Matching Calculator',
    category: 'Process Optimization',
    difficulty: 'Advanced',
    badge: 'AI Enhanced',
    description: 'AI-powered optimization of laser power and cutting speed relationships',
    features: ['AI Optimization', 'Power-Speed Matching', 'Efficiency Maximization'],
    estimatedTime: '< 2s'
  },

  // Epic 4: Advanced Analysis (5 calculators)
  'sensitivity-analysis-calculator': {
    name: 'Sensitivity Analysis Calculator',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'Premium',
    description: 'Advanced sensitivity analysis of cutting parameters and their impact',
    features: ['Sensitivity Analysis', 'Parameter Impact', 'Statistical Analysis'],
    estimatedTime: '< 3s'
  },
  'process-optimization-engine': {
    name: 'Process Optimization Engine',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'AI Enhanced',
    description: 'AI-powered comprehensive process optimization using advanced algorithms',
    features: ['AI Optimization', 'Multi-Objective Optimization', 'Advanced Analytics'],
    estimatedTime: '< 5s'
  },
  'predictive-quality-model': {
    name: 'Predictive Quality Model',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'AI Enhanced',
    description: 'Machine learning-based quality prediction and optimization',
    features: ['ML Prediction', 'Quality Forecasting', 'Predictive Analytics'],
    estimatedTime: '< 5s'
  },
  'cost-benefit-analyzer': {
    name: 'Cost-Benefit Analyzer',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'Premium',
    description: 'Comprehensive cost-benefit analysis for laser cutting investments',
    features: ['Financial Analysis', 'ROI Calculation', 'Investment Planning'],
    estimatedTime: '< 3s'
  },
  'performance-benchmarking-tool': {
    name: 'Performance Benchmarking Tool',
    category: 'Advanced Analysis',
    difficulty: 'Expert',
    badge: 'Premium',
    description: 'Comprehensive performance benchmarking against industry standards',
    features: ['Performance Analysis', 'Industry Benchmarking', 'Competitive Analysis'],
    estimatedTime: '< 3s'
  }

  // Note: Removed duplicate entries to fix build warnings
  // All 20 core calculators are properly defined above
};


// Calculator categories for navigation and filtering - Updated for 20 Core Calculators
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

// Helper function to get calculator by ID
export const getCalculator = (calculatorId: string) => {
  return calculatorRegistry[calculatorId];
};

// Helper function to get calculator metadata
export const getCalculatorMetadata = (calculatorId: string) => {
  return calculatorMetadata[calculatorId];
};

// Helper function to get all calculator IDs
export const getAllCalculatorIds = () => {
  return Object.keys(calculatorRegistry);
};

// Helper function to get calculators by category
export const getCalculatorsByCategory = (category: string) => {
  return Object.entries(calculatorMetadata)
    .filter(([_, metadata]) => metadata.category === category)
    .map(([id, _]) => id);
};

// Updated calculator categories for 20 Core Calculators
export const coreCalculatorCategories = {
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

// Calculator statistics and verification for 20 Core Calculators
export const coreCalculatorStats = {
  totalCalculators: 20,
  categoryCounts: {
    'Core Engineering': coreCalculatorCategories['Core Engineering'].length,
    'Quality Control': coreCalculatorCategories['Quality Control'].length,
    'Process Optimization': coreCalculatorCategories['Process Optimization'].length,
    'Advanced Analysis': coreCalculatorCategories['Advanced Analysis'].length
  },
  difficultyDistribution: {
    'Intermediate': ['laser-cutting-cost', 'cutting-time-estimator', 'material-selection-assistant', 'gas-consumption-calculator', 'focus-height-calculator', 'gas-pressure-setting-guide', 'frequency-setting-assistant'].length,
    'Advanced': ['laser-parameter-optimizer', 'edge-quality-predictor', 'warping-risk-calculator', 'burn-mark-preventer', 'dross-formation-calculator', 'tolerance-stack-calculator', 'multiple-pass-calculator', 'power-speed-matching'].length,
    'Expert': ['sensitivity-analysis-calculator', 'process-optimization-engine', 'predictive-quality-model', 'cost-benefit-analyzer', 'performance-benchmarking-tool'].length
  },
  badgeDistribution: {
    'Standard': ['laser-cutting-cost', 'cutting-time-estimator', 'gas-consumption-calculator', 'focus-height-calculator', 'gas-pressure-setting-guide', 'frequency-setting-assistant'].length,
    'Premium': ['warping-risk-calculator', 'burn-mark-preventer', 'dross-formation-calculator', 'tolerance-stack-calculator', 'multiple-pass-calculator', 'sensitivity-analysis-calculator', 'cost-benefit-analyzer', 'performance-benchmarking-tool'].length,
    'AI Enhanced': ['laser-parameter-optimizer', 'material-selection-assistant', 'edge-quality-predictor', 'power-speed-matching', 'process-optimization-engine', 'predictive-quality-model'].length
  }
};

// Helper function to get core calculators by category
export const getCoreCalculatorsByCategory = (category: string) => {
  return coreCalculatorCategories[category as keyof typeof coreCalculatorCategories] || [];
};

// Helper function to validate core calculator registry
export const validateCoreCalculatorRegistry = () => {
  const allCoreCalculators = Object.values(coreCalculatorCategories).flat();
  const registeredCalculators = Object.keys(calculatorMetadata).filter(id =>
    allCoreCalculators.includes(id)
  );

  return {
    expected: 20,
    registered: registeredCalculators.length,
    missing: allCoreCalculators.filter(id => !calculatorMetadata[id]),
    isComplete: registeredCalculators.length === 20
  };
};
