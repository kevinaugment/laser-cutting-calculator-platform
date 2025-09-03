import { CalculatorConfig } from '../../types/calculator';

export const enterpriseResourcePlanningConfig: CalculatorConfig = {
  id: 'enterprise-resource-planning',
  name: 'Enterprise Resource Planning Calculator',
  description: 'Comprehensive ERP integration calculator for enterprise resource planning, workflow optimization, and cross-departmental coordination in laser cutting operations.',
  category: 'enterprise',
  difficulty: 'expert',
  estimatedTime: '10-12 minutes',
  
  inputs: [
    {
      id: 'organizationSize',
      label: 'Organization Size',
      type: 'select',
      value: 'medium_enterprise',
      options: [
        { value: 'small_business', label: 'Small Business (< 50 employees)' },
        { value: 'medium_enterprise', label: 'Medium Enterprise (50-500 employees)' },
        { value: 'large_enterprise', label: 'Large Enterprise (500-5000 employees)' },
        { value: 'multinational', label: 'Multinational Corporation (> 5000 employees)' },
      ],
      required: true,
      description: 'Size and scale of the organization',
    },
    {
      id: 'departmentCount',
      label: 'Number of Departments',
      type: 'number',
      value: 8,
      min: 3,
      max: 50,
      step: 1,
      required: true,
      description: 'Number of departments requiring ERP integration',
    },
    {
      id: 'productionVolume',
      label: 'Monthly Production Volume',
      type: 'select',
      value: 'high_volume',
      options: [
        { value: 'low_volume', label: 'Low Volume (< 1000 parts/month)' },
        { value: 'medium_volume', label: 'Medium Volume (1000-10000 parts/month)' },
        { value: 'high_volume', label: 'High Volume (10000-100000 parts/month)' },
        { value: 'mass_production', label: 'Mass Production (> 100000 parts/month)' },
      ],
      required: true,
      description: 'Monthly production volume scale',
    },
    {
      id: 'integrationComplexity',
      label: 'Integration Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'basic', label: 'Basic (Standard modules only)' },
        { value: 'moderate', label: 'Moderate (Some customization)' },
        { value: 'complex', label: 'Complex (Extensive customization)' },
        { value: 'enterprise_grade', label: 'Enterprise Grade (Full integration)' },
      ],
      required: true,
      description: 'Level of ERP integration complexity required',
    },
    {
      id: 'existingSystems',
      label: 'Existing Systems Count',
      type: 'number',
      value: 5,
      min: 0,
      max: 20,
      step: 1,
      required: true,
      description: 'Number of existing systems requiring integration',
    },
    {
      id: 'dataVolume',
      label: 'Daily Data Volume',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'low', label: 'Low (< 1GB/day)' },
        { value: 'medium', label: 'Medium (1-10GB/day)' },
        { value: 'high', label: 'High (10-100GB/day)' },
        { value: 'enterprise', label: 'Enterprise (> 100GB/day)' },
      ],
      required: true,
      description: 'Daily data processing volume',
    },
    {
      id: 'complianceRequirements',
      label: 'Compliance Requirements',
      type: 'select',
      value: 'iso_standards',
      options: [
        { value: 'basic', label: 'Basic Compliance' },
        { value: 'iso_standards', label: 'ISO Standards (9001, 14001)' },
        { value: 'industry_specific', label: 'Industry Specific (AS9100, ISO 13485)' },
        { value: 'regulatory', label: 'Regulatory (FDA, CE, etc.)' },
        { value: 'comprehensive', label: 'Comprehensive (All standards)' },
      ],
      required: true,
      description: 'Required compliance and certification standards',
    },
    {
      id: 'geographicScope',
      label: 'Geographic Scope',
      type: 'select',
      value: 'national',
      options: [
        { value: 'local', label: 'Local (Single location)' },
        { value: 'regional', label: 'Regional (Multiple locations, same region)' },
        { value: 'national', label: 'National (Multiple locations, same country)' },
        { value: 'international', label: 'International (Multiple countries)' },
        { value: 'global', label: 'Global (Worldwide operations)' },
      ],
      required: true,
      description: 'Geographic scope of operations',
    },
    {
      id: 'implementationTimeline',
      label: 'Implementation Timeline',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'rapid', label: 'Rapid (3-6 months)' },
        { value: 'standard', label: 'Standard (6-12 months)' },
        { value: 'phased', label: 'Phased (12-24 months)' },
        { value: 'enterprise', label: 'Enterprise (24+ months)' },
      ],
      required: true,
      description: 'Desired implementation timeline',
    },
    {
      id: 'budgetRange',
      label: 'Budget Range',
      type: 'select',
      value: 'medium_budget',
      options: [
        { value: 'small_budget', label: 'Small Budget (< $100K)' },
        { value: 'medium_budget', label: 'Medium Budget ($100K - $500K)' },
        { value: 'large_budget', label: 'Large Budget ($500K - $2M)' },
        { value: 'enterprise_budget', label: 'Enterprise Budget (> $2M)' },
      ],
      required: true,
      description: 'Available budget for ERP implementation',
    },
  ],

  outputs: [
    {
      id: 'systemArchitecture',
      label: 'System Architecture',
      type: 'object',
      format: 'erp-architecture-specs',
      description: 'Recommended ERP system architecture and integration design',
    },
    {
      id: 'implementationPlan',
      label: 'Implementation Plan',
      type: 'object',
      format: 'erp-implementation-plan',
      description: 'Detailed implementation roadmap and timeline',
    },
    {
      id: 'resourceRequirements',
      label: 'Resource Requirements',
      type: 'object',
      format: 'erp-resource-specs',
      description: 'Required resources, personnel, and infrastructure',
    },
    {
      id: 'costAnalysis',
      label: 'Cost Analysis',
      type: 'object',
      format: 'erp-cost-analysis',
      description: 'Comprehensive cost breakdown and ROI analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      organizationSize,
      departmentCount,
      productionVolume,
      integrationComplexity,
      existingSystems,
      dataVolume,
      complianceRequirements,
      geographicScope,
      implementationTimeline,
      budgetRange,
    } = inputs;

    // Analyze system architecture requirements
    const systemArchitecture = analyzeERPArchitecture(
      organizationSize,
      departmentCount,
      integrationComplexity,
      existingSystems,
      dataVolume
    );

    // Create implementation plan
    const implementationPlan = createERPImplementationPlan(
      implementationTimeline,
      integrationComplexity,
      organizationSize,
      complianceRequirements
    );

    // Calculate resource requirements
    const resourceRequirements = calculateERPResources(
      organizationSize,
      departmentCount,
      integrationComplexity,
      geographicScope
    );

    // Analyze costs and ROI
    const costAnalysis = analyzeERPCosts(
      budgetRange,
      organizationSize,
      integrationComplexity,
      implementationTimeline,
      resourceRequirements
    );

    return {
      systemArchitecture,
      implementationPlan,
      resourceRequirements,
      costAnalysis,
    };
  },

  validation: {
    departmentCount: {
      min: 3,
      max: 50,
      message: 'Department count must be between 3 and 50',
    },
    existingSystems: {
      min: 0,
      max: 20,
      message: 'Existing systems count must be between 0 and 20',
    },
  },

  examples: [
    {
      name: 'Medium Manufacturing Enterprise',
      description: 'Medium-sized manufacturing company with moderate complexity',
      inputs: {
        organizationSize: 'medium_enterprise',
        departmentCount: 8,
        productionVolume: 'high_volume',
        integrationComplexity: 'moderate',
        existingSystems: 5,
        dataVolume: 'medium',
        complianceRequirements: 'iso_standards',
        geographicScope: 'national',
        implementationTimeline: 'standard',
        budgetRange: 'medium_budget',
      },
    },
    {
      name: 'Large Multinational Corporation',
      description: 'Large corporation with complex integration requirements',
      inputs: {
        organizationSize: 'multinational',
        departmentCount: 15,
        productionVolume: 'mass_production',
        integrationComplexity: 'enterprise_grade',
        existingSystems: 12,
        dataVolume: 'enterprise',
        complianceRequirements: 'comprehensive',
        geographicScope: 'global',
        implementationTimeline: 'enterprise',
        budgetRange: 'enterprise_budget',
      },
    },
  ],

  tags: ['erp', 'enterprise', 'integration', 'planning', 'workflow'],
  
  relatedCalculators: [
    'supply-chain-management',
    'quality-management-system',
    'performance-analytics',
    'financial-planning',
  ],

  learningResources: [
    {
      title: 'ERP Implementation Best Practices',
      type: 'article',
      url: '/learn/erp-implementation',
    },
    {
      title: 'Enterprise Integration Strategies',
      type: 'video',
      url: '/learn/enterprise-integration',
    },
  ],
};

// Helper functions
function analyzeERPArchitecture(
  orgSize: string,
  deptCount: number,
  complexity: string,
  existingSystems: number,
  dataVolume: string
) {
  const architecture = {
    recommendedPlatform: getRecommendedPlatform(orgSize, complexity),
    coreModules: getCoreModules(deptCount, complexity),
    integrationLayer: getIntegrationLayer(existingSystems, complexity),
    dataManagement: getDataManagement(dataVolume, orgSize),
    securityRequirements: getSecurityRequirements(orgSize, complexity),
    scalabilityPlan: getScalabilityPlan(orgSize, dataVolume),
  };

  return architecture;
}

function getRecommendedPlatform(orgSize: string, complexity: string) {
  const platforms = {
    small_business: {
      basic: 'Cloud-based SaaS ERP (e.g., NetSuite, Odoo)',
      moderate: 'Mid-market ERP (e.g., Acumatica, Epicor)',
      complex: 'Enterprise ERP (e.g., SAP Business One)',
      enterprise_grade: 'Full Enterprise ERP (e.g., SAP S/4HANA)',
    },
    medium_enterprise: {
      basic: 'Mid-market ERP (e.g., Microsoft Dynamics 365)',
      moderate: 'Enterprise ERP (e.g., SAP Business ByDesign)',
      complex: 'Full Enterprise ERP (e.g., SAP S/4HANA, Oracle Cloud)',
      enterprise_grade: 'Tier 1 ERP (e.g., SAP S/4HANA, Oracle ERP Cloud)',
    },
    large_enterprise: {
      basic: 'Enterprise ERP (e.g., Microsoft Dynamics 365)',
      moderate: 'Tier 1 ERP (e.g., SAP S/4HANA)',
      complex: 'Tier 1 ERP with customization',
      enterprise_grade: 'Best-of-breed enterprise suite',
    },
    multinational: {
      basic: 'Global ERP (e.g., SAP S/4HANA)',
      moderate: 'Tier 1 global ERP with localization',
      complex: 'Multi-instance global ERP',
      enterprise_grade: 'Custom enterprise architecture',
    },
  };

  return platforms[orgSize]?.[complexity] || 'Mid-market ERP solution';
}

function getCoreModules(deptCount: number, complexity: string) {
  const baseModules = [
    'Financial Management',
    'Production Planning',
    'Inventory Management',
    'Sales & CRM',
    'Purchasing',
    'Quality Management',
  ];

  const additionalModules = [
    'Human Resources',
    'Project Management',
    'Business Intelligence',
    'Document Management',
    'Workflow Management',
    'Asset Management',
    'Compliance Management',
    'Supply Chain Management',
  ];

  let modules = [...baseModules];
  
  if (deptCount > 5) {
    modules.push(...additionalModules.slice(0, 3));
  }
  
  if (deptCount > 10) {
    modules.push(...additionalModules.slice(3, 6));
  }
  
  if (complexity === 'enterprise_grade') {
    modules.push(...additionalModules.slice(6));
  }

  return modules;
}

function getIntegrationLayer(existingSystems: number, complexity: string) {
  const integrationApproaches = {
    basic: 'Standard API connections',
    moderate: 'Enterprise Service Bus (ESB)',
    complex: 'Microservices architecture',
    enterprise_grade: 'Hybrid integration platform',
  };

  return {
    approach: integrationApproaches[complexity],
    systemsToIntegrate: existingSystems,
    integrationMethods: getIntegrationMethods(existingSystems, complexity),
    dataFlowDesign: getDataFlowDesign(existingSystems),
  };
}

function getIntegrationMethods(systemCount: number, complexity: string) {
  const methods = [];
  
  if (systemCount > 0) {
    methods.push('REST API integration');
    methods.push('Database synchronization');
  }
  
  if (systemCount > 3) {
    methods.push('Message queue integration');
    methods.push('File-based data exchange');
  }
  
  if (complexity === 'complex' || complexity === 'enterprise_grade') {
    methods.push('Real-time data streaming');
    methods.push('Event-driven architecture');
  }
  
  return methods;
}

function getDataFlowDesign(systemCount: number) {
  if (systemCount <= 2) return 'Point-to-point integration';
  if (systemCount <= 5) return 'Hub-and-spoke architecture';
  return 'Enterprise service bus architecture';
}

function getDataManagement(dataVolume: string, orgSize: string) {
  const strategies = {
    low: 'Standard database with daily backups',
    medium: 'Clustered database with real-time replication',
    high: 'Distributed database with data warehousing',
    enterprise: 'Big data platform with analytics',
  };

  return {
    strategy: strategies[dataVolume],
    backupRequirements: getBackupRequirements(dataVolume, orgSize),
    performanceOptimization: getPerformanceOptimization(dataVolume),
    dataGovernance: getDataGovernance(orgSize),
  };
}

function getBackupRequirements(dataVolume: string, orgSize: string) {
  const requirements = {
    frequency: dataVolume === 'enterprise' ? 'Continuous' : 'Daily',
    retention: orgSize === 'multinational' ? '7 years' : '3 years',
    recovery: dataVolume === 'enterprise' ? '< 1 hour' : '< 4 hours',
  };
  
  return requirements;
}

function getPerformanceOptimization(dataVolume: string) {
  const optimizations = [];
  
  if (dataVolume === 'medium' || dataVolume === 'high') {
    optimizations.push('Database indexing optimization');
    optimizations.push('Query performance tuning');
  }
  
  if (dataVolume === 'high' || dataVolume === 'enterprise') {
    optimizations.push('Data partitioning');
    optimizations.push('Caching strategies');
    optimizations.push('Load balancing');
  }
  
  return optimizations;
}

function getDataGovernance(orgSize: string) {
  const governance = [];
  
  governance.push('Data quality standards');
  governance.push('Access control policies');
  
  if (orgSize === 'large_enterprise' || orgSize === 'multinational') {
    governance.push('Data privacy compliance');
    governance.push('Master data management');
    governance.push('Data lifecycle management');
  }
  
  return governance;
}

function getSecurityRequirements(orgSize: string, complexity: string) {
  const requirements = {
    authentication: getAuthenticationRequirements(orgSize),
    authorization: getAuthorizationRequirements(complexity),
    dataProtection: getDataProtectionRequirements(orgSize),
    networkSecurity: getNetworkSecurityRequirements(orgSize),
    compliance: getComplianceRequirements(orgSize),
  };
  
  return requirements;
}

function getAuthenticationRequirements(orgSize: string) {
  if (orgSize === 'small_business') return 'Multi-factor authentication';
  if (orgSize === 'medium_enterprise') return 'Single sign-on (SSO)';
  return 'Enterprise identity management';
}

function getAuthorizationRequirements(complexity: string) {
  if (complexity === 'basic') return 'Role-based access control';
  if (complexity === 'moderate') return 'Attribute-based access control';
  return 'Dynamic authorization with policy engine';
}

function getDataProtectionRequirements(orgSize: string) {
  const requirements = ['Data encryption at rest', 'Data encryption in transit'];
  
  if (orgSize === 'large_enterprise' || orgSize === 'multinational') {
    requirements.push('Key management system');
    requirements.push('Data loss prevention');
  }
  
  return requirements;
}

function getNetworkSecurityRequirements(orgSize: string) {
  const requirements = ['Firewall protection', 'VPN access'];
  
  if (orgSize === 'large_enterprise' || orgSize === 'multinational') {
    requirements.push('Network segmentation');
    requirements.push('Intrusion detection system');
    requirements.push('Security monitoring');
  }
  
  return requirements;
}

function getComplianceRequirements(orgSize: string) {
  const requirements = ['SOX compliance', 'GDPR compliance'];
  
  if (orgSize === 'large_enterprise' || orgSize === 'multinational') {
    requirements.push('Industry-specific compliance');
    requirements.push('Regular security audits');
    requirements.push('Compliance reporting');
  }
  
  return requirements;
}

function getScalabilityPlan(orgSize: string, dataVolume: string) {
  return {
    horizontalScaling: orgSize === 'multinational' ? 'Required' : 'Optional',
    verticalScaling: dataVolume === 'enterprise' ? 'Required' : 'Standard',
    cloudStrategy: getCloudStrategy(orgSize, dataVolume),
    growthProjection: getGrowthProjection(orgSize),
  };
}

function getCloudStrategy(orgSize: string, dataVolume: string) {
  if (orgSize === 'small_business') return 'Cloud-first approach';
  if (dataVolume === 'enterprise') return 'Hybrid cloud strategy';
  return 'Cloud-enabled with on-premise options';
}

function getGrowthProjection(orgSize: string) {
  const projections = {
    small_business: '50% growth capacity',
    medium_enterprise: '100% growth capacity',
    large_enterprise: '200% growth capacity',
    multinational: 'Unlimited scalability',
  };
  
  return projections[orgSize] || '100% growth capacity';
}

export default enterpriseResourcePlanningConfig;
