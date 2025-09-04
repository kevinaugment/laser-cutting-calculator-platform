/**
 * Pricing Configuration
 * Centralized pricing plans and feature definitions
 */

import { PricingPlan, PricingTier, FeatureGate, UsageLimits } from '../types/billing';

// Available calculators by category
export const CALCULATOR_IDS = {
  // Core Engineering (5 calculators)
  CORE: [
    'laser-cutting-cost',
    'cutting-time-estimator', 
    'laser-parameter-optimizer',
    'material-selection-assistant',
    'gas-consumption-calculator'
  ],
  
  // Quality Control (7 calculators)
  QUALITY: [
    'edge-quality-predictor',
    'warping-risk-calculator',
    'burn-mark-preventer',
    'dross-formation-calculator',
    'tolerance-stack-calculator',
    'heat-affected-zone-calculator',
    'beam-quality-calculator'
  ],
  
  // Process Optimization (8 calculators)
  PROCESS: [
    'power-speed-matching',
    'gas-pressure-setting',
    'focus-height-calculator',
    'frequency-setting-assistant',
    'multiple-pass-calculator',
    'kerf-width-calculator',
    'cut-path-optimizer',
    'material-nesting-optimizer'
  ],
  
  // Advanced Analysis (7 calculators)
  ADVANCED: [
    'production-capacity-planner',
    'batch-processing-calculator',
    'job-queue-optimizer',
    'profit-margin-calculator',
    'energy-cost-calculator',
    'quality-grade-calculator',
    'project-quoting-calculator'
  ]
};

// All calculator IDs
export const ALL_CALCULATORS = [
  ...CALCULATOR_IDS.CORE,
  ...CALCULATOR_IDS.QUALITY,
  ...CALCULATOR_IDS.PROCESS,
  ...CALCULATOR_IDS.ADVANCED
];

// Usage limits by tier
export const USAGE_LIMITS: Record<PricingTier, UsageLimits> = {
  [PricingTier.FREE]: {
    calculationsPerMonth: 10,
    exportsPerMonth: 5,
    apiCallsPerMonth: 0,
    presetsLimit: 0,
    calculatorAccess: CALCULATOR_IDS.CORE,
    features: [
      'basic_calculations',
      'pdf_export',
      'mobile_access',
      'community_support'
    ]
  },
  
  [PricingTier.PRO]: {
    calculationsPerMonth: 'unlimited',
    exportsPerMonth: 'unlimited',
    apiCallsPerMonth: 0,
    presetsLimit: 'unlimited',
    calculatorAccess: ALL_CALCULATORS,
    features: [
      'unlimited_calculations',
      'all_calculators',
      'advanced_exports',
      'parameter_presets',
      'calculation_history',
      'advanced_analytics',
      'priority_support',
      'video_tutorials',
      'mobile_app',
      'offline_mode'
    ]
  },
  
  [PricingTier.ENTERPRISE]: {
    calculationsPerMonth: 'unlimited',
    exportsPerMonth: 'unlimited',
    apiCallsPerMonth: 'unlimited',
    presetsLimit: 'unlimited',
    calculatorAccess: ALL_CALCULATORS,
    features: [
      'everything_in_pro',
      'team_collaboration',
      'shared_libraries',
      'team_analytics',
      'api_access',
      'custom_branding',
      'sso_integration',
      'dedicated_support',
      'custom_training',
      'priority_features',
      'advanced_security',
      'compliance_reporting'
    ]
  }
};

// Pricing plans configuration
export const PRICING_PLANS: Record<PricingTier, PricingPlan> = {
  [PricingTier.FREE]: {
    id: PricingTier.FREE,
    name: 'Free',
    description: 'Perfect for getting started with basic laser cutting calculations',
    prices: {
      monthly: 0,
      yearly: 0
    },
    stripePriceIds: {
      monthly: '', // No Stripe price for free tier
      yearly: ''
    },
    features: [
      '5 core calculators',
      '10 calculations per month',
      'Basic PDF export',
      'Community support',
      'Mobile responsive design',
      'Basic tutorials and guides'
    ],
    limitations: [
      'Limited calculator access',
      'Monthly calculation limit',
      'No parameter presets',
      'No calculation history',
      'No advanced analytics',
      'Community support only'
    ],
    usageLimits: USAGE_LIMITS[PricingTier.FREE],
    trialDays: 0
  },
  
  [PricingTier.PRO]: {
    id: PricingTier.PRO,
    name: 'Professional',
    description: 'For professionals who need full access to all calculators and features',
    prices: {
      monthly: 19,
      yearly: 182 // 20% discount: 19 * 12 * 0.8 = 182.4
    },
    stripePriceIds: {
      monthly: 'price_pro_monthly', // Replace with actual Stripe price IDs
      yearly: 'price_pro_yearly'
    },
    features: [
      'All 27 professional calculators',
      'Unlimited calculations',
      'Advanced export options (PDF, Excel, CSV)',
      'Parameter presets and templates',
      'Complete calculation history',
      'Advanced analytics and insights',
      'Priority email support',
      'Video tutorials and guides',
      'Mobile app access',
      'Offline calculation capability'
    ],
    limitations: [
      'Single user account',
      'No team collaboration',
      'No API access',
      'Standard branding'
    ],
    usageLimits: USAGE_LIMITS[PricingTier.PRO],
    popular: true,
    trialDays: 14
  },
  
  [PricingTier.ENTERPRISE]: {
    id: PricingTier.ENTERPRISE,
    name: 'Enterprise',
    description: 'For teams and organizations requiring collaboration and advanced features',
    prices: {
      monthly: 99,
      yearly: 950 // 20% discount: 99 * 12 * 0.8 = 950.4
    },
    stripePriceIds: {
      monthly: 'price_enterprise_monthly', // Replace with actual Stripe price IDs
      yearly: 'price_enterprise_yearly'
    },
    features: [
      'Everything in Professional',
      'Team collaboration features',
      'Shared parameter libraries',
      'Team analytics dashboard',
      'API access for integrations',
      'Custom branding options',
      'Single Sign-On (SSO)',
      'Dedicated support manager',
      'Custom training sessions',
      'Priority feature requests',
      'Advanced security features',
      'Compliance reporting'
    ],
    limitations: [],
    usageLimits: USAGE_LIMITS[PricingTier.ENTERPRISE],
    trialDays: 14
  }
};

// Feature gates - features that require specific tiers
export const FEATURE_GATES: FeatureGate[] = [
  {
    feature: 'parameter_presets',
    requiredTier: PricingTier.PRO,
    description: 'Save and reuse parameter combinations',
    upgradeMessage: 'Upgrade to Professional to save parameter presets'
  },
  {
    feature: 'calculation_history',
    requiredTier: PricingTier.PRO,
    description: 'Access your complete calculation history',
    upgradeMessage: 'Upgrade to Professional to access calculation history'
  },
  {
    feature: 'advanced_analytics',
    requiredTier: PricingTier.PRO,
    description: 'Detailed analytics and insights',
    upgradeMessage: 'Upgrade to Professional for advanced analytics'
  },
  {
    feature: 'excel_export',
    requiredTier: PricingTier.PRO,
    description: 'Export calculations to Excel format',
    upgradeMessage: 'Upgrade to Professional for Excel export'
  },
  {
    feature: 'csv_export',
    requiredTier: PricingTier.PRO,
    description: 'Export calculations to CSV format',
    upgradeMessage: 'Upgrade to Professional for CSV export'
  },
  {
    feature: 'team_collaboration',
    requiredTier: PricingTier.ENTERPRISE,
    description: 'Collaborate with team members',
    upgradeMessage: 'Upgrade to Enterprise for team collaboration'
  },
  {
    feature: 'api_access',
    requiredTier: PricingTier.ENTERPRISE,
    description: 'Access our REST API',
    upgradeMessage: 'Upgrade to Enterprise for API access'
  },
  {
    feature: 'custom_branding',
    requiredTier: PricingTier.ENTERPRISE,
    description: 'Custom branding and white-label options',
    upgradeMessage: 'Upgrade to Enterprise for custom branding'
  },
  {
    feature: 'sso_integration',
    requiredTier: PricingTier.ENTERPRISE,
    description: 'Single Sign-On integration',
    upgradeMessage: 'Upgrade to Enterprise for SSO integration'
  }
];

// Calculator access by tier
export const CALCULATOR_ACCESS: Record<PricingTier, string[]> = {
  [PricingTier.FREE]: CALCULATOR_IDS.CORE,
  [PricingTier.PRO]: ALL_CALCULATORS,
  [PricingTier.ENTERPRISE]: ALL_CALCULATORS
};

// Export format access by tier
export const EXPORT_FORMATS: Record<PricingTier, string[]> = {
  [PricingTier.FREE]: ['pdf'],
  [PricingTier.PRO]: ['pdf', 'excel', 'csv'],
  [PricingTier.ENTERPRISE]: ['pdf', 'excel', 'csv', 'json', 'xml']
};

// Support levels by tier
export const SUPPORT_LEVELS: Record<PricingTier, string> = {
  [PricingTier.FREE]: 'Community support via forums',
  [PricingTier.PRO]: 'Priority email support (24-48h response)',
  [PricingTier.ENTERPRISE]: 'Dedicated support manager (4h response)'
};

// Utility functions
export const getPricingPlan = (tier: PricingTier): PricingPlan => {
  return PRICING_PLANS[tier];
};

export const getUsageLimits = (tier: PricingTier): UsageLimits => {
  return USAGE_LIMITS[tier];
};

export const hasFeatureAccess = (userTier: PricingTier, feature: string): boolean => {
  const featureGate = FEATURE_GATES.find(gate => gate.feature === feature);
  if (!featureGate) return true; // Feature is available to all tiers
  
  const tierOrder = [PricingTier.FREE, PricingTier.PRO, PricingTier.ENTERPRISE];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(featureGate.requiredTier);
  
  return userTierIndex >= requiredTierIndex;
};

export const hasCalculatorAccess = (userTier: PricingTier, calculatorId: string): boolean => {
  return CALCULATOR_ACCESS[userTier].includes(calculatorId);
};

export const getUpgradeMessage = (feature: string): string => {
  const featureGate = FEATURE_GATES.find(gate => gate.feature === feature);
  return featureGate?.upgradeMessage || 'Upgrade your plan to access this feature';
};

export const calculateYearlyDiscount = (monthlyPrice: number): number => {
  const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
  const savings = (monthlyPrice * 12) - yearlyPrice;
  return Math.round(savings);
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export default {
  PRICING_PLANS,
  USAGE_LIMITS,
  FEATURE_GATES,
  CALCULATOR_ACCESS,
  EXPORT_FORMATS,
  SUPPORT_LEVELS,
  ALL_CALCULATORS,
  getPricingPlan,
  getUsageLimits,
  hasFeatureAccess,
  hasCalculatorAccess,
  getUpgradeMessage,
  calculateYearlyDiscount,
  formatPrice
};
