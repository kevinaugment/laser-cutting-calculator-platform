import { CalculatorConfig } from '../../types/calculator';

export const strategicPlanningConfig: CalculatorConfig = {
  id: 'strategic-planning',
  name: 'Strategic Planning Calculator',
  description: 'Comprehensive strategic planning calculator for long-term business strategy, goal setting, and strategic initiative planning in laser cutting operations.',
  category: 'enterprise',
  difficulty: 'expert',
  estimatedTime: '10-12 minutes',
  
  inputs: [
    {
      id: 'planningHorizon',
      label: 'Strategic Planning Horizon',
      type: 'select',
      value: 'medium_term',
      options: [
        { value: 'short_term', label: 'Short Term (1-2 years)' },
        { value: 'medium_term', label: 'Medium Term (3-5 years)' },
        { value: 'long_term', label: 'Long Term (5-10 years)' },
        { value: 'visionary', label: 'Visionary (10+ years)' },
      ],
      required: true,
      description: 'Strategic planning time horizon',
    },
    {
      id: 'businessMaturity',
      label: 'Business Maturity Stage',
      type: 'select',
      value: 'growth',
      options: [
        { value: 'startup', label: 'Startup (Establishing market presence)' },
        { value: 'growth', label: 'Growth (Scaling operations)' },
        { value: 'mature', label: 'Mature (Market leadership)' },
        { value: 'transformation', label: 'Transformation (Reinventing business)' },
        { value: 'decline', label: 'Decline (Turnaround needed)' },
      ],
      required: true,
      description: 'Current business maturity stage',
    },
    {
      id: 'marketPosition',
      label: 'Current Market Position',
      type: 'select',
      value: 'challenger',
      options: [
        { value: 'leader', label: 'Market Leader (Dominant position)' },
        { value: 'challenger', label: 'Challenger (Strong competitor)' },
        { value: 'follower', label: 'Follower (Following market trends)' },
        { value: 'niche', label: 'Niche Player (Specialized focus)' },
        { value: 'new_entrant', label: 'New Entrant (Entering market)' },
      ],
      required: true,
      description: 'Current competitive market position',
    },
    {
      id: 'growthAmbition',
      label: 'Growth Ambition',
      type: 'select',
      value: 'aggressive',
      options: [
        { value: 'conservative', label: 'Conservative (Steady, low-risk growth)' },
        { value: 'moderate', label: 'Moderate (Balanced growth approach)' },
        { value: 'aggressive', label: 'Aggressive (High-growth strategy)' },
        { value: 'transformational', label: 'Transformational (Disruptive growth)' },
      ],
      required: true,
      description: 'Desired growth ambition level',
    },
    {
      id: 'strategicFocus',
      label: 'Primary Strategic Focus',
      type: 'select',
      value: 'market_expansion',
      options: [
        { value: 'operational_excellence', label: 'Operational Excellence (Efficiency focus)' },
        { value: 'product_innovation', label: 'Product Innovation (R&D focus)' },
        { value: 'market_expansion', label: 'Market Expansion (Growth focus)' },
        { value: 'customer_intimacy', label: 'Customer Intimacy (Service focus)' },
        { value: 'digital_transformation', label: 'Digital Transformation (Technology focus)' },
        { value: 'sustainability', label: 'Sustainability (Environmental focus)' },
      ],
      required: true,
      description: 'Primary strategic focus area',
    },
    {
      id: 'competitiveIntensity',
      label: 'Competitive Intensity',
      type: 'select',
      value: 'high',
      options: [
        { value: 'low', label: 'Low (Few competitors, stable market)' },
        { value: 'moderate', label: 'Moderate (Some competition, growing market)' },
        { value: 'high', label: 'High (Intense competition, mature market)' },
        { value: 'extreme', label: 'Extreme (Cutthroat competition, declining market)' },
      ],
      required: true,
      description: 'Level of competitive intensity in the market',
    },
    {
      id: 'innovationCapability',
      label: 'Innovation Capability',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'limited', label: 'Limited (Basic innovation capabilities)' },
        { value: 'moderate', label: 'Moderate (Standard innovation processes)' },
        { value: 'strong', label: 'Strong (Advanced innovation capabilities)' },
        { value: 'leading_edge', label: 'Leading Edge (Cutting-edge innovation)' },
      ],
      required: true,
      description: 'Current innovation capability level',
    },
    {
      id: 'resourceAvailability',
      label: 'Resource Availability',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'constrained', label: 'Constrained (Limited resources)' },
        { value: 'moderate', label: 'Moderate (Adequate resources)' },
        { value: 'abundant', label: 'Abundant (Ample resources)' },
        { value: 'unlimited', label: 'Unlimited (No resource constraints)' },
      ],
      required: true,
      description: 'Available resources for strategic initiatives',
    },
    {
      id: 'riskTolerance',
      label: 'Strategic Risk Tolerance',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'conservative', label: 'Conservative (Low risk tolerance)' },
        { value: 'moderate', label: 'Moderate (Balanced risk approach)' },
        { value: 'aggressive', label: 'Aggressive (High risk tolerance)' },
        { value: 'venture', label: 'Venture (Very high risk tolerance)' },
      ],
      required: true,
      description: 'Organizational risk tolerance for strategic decisions',
    },
    {
      id: 'stakeholderAlignment',
      label: 'Stakeholder Alignment',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'low', label: 'Low (Conflicting stakeholder interests)' },
        { value: 'moderate', label: 'Moderate (Some alignment challenges)' },
        { value: 'high', label: 'High (Strong stakeholder alignment)' },
        { value: 'unified', label: 'Unified (Complete stakeholder consensus)' },
      ],
      required: true,
      description: 'Level of stakeholder alignment on strategic direction',
    },
  ],

  outputs: [
    {
      id: 'strategicFramework',
      label: 'Strategic Framework',
      type: 'object',
      format: 'strategic-planning-framework',
      description: 'Comprehensive strategic planning framework and methodology',
    },
    {
      id: 'strategicInitiatives',
      label: 'Strategic Initiatives',
      type: 'object',
      format: 'strategic-initiatives-portfolio',
      description: 'Portfolio of strategic initiatives and action plans',
    },
    {
      id: 'implementationRoadmap',
      label: 'Implementation Roadmap',
      type: 'object',
      format: 'strategic-implementation-plan',
      description: 'Detailed implementation roadmap and timeline',
    },
    {
      id: 'performanceMetrics',
      label: 'Performance Metrics',
      type: 'object',
      format: 'strategic-performance-kpis',
      description: 'Strategic performance indicators and measurement framework',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      planningHorizon,
      businessMaturity,
      marketPosition,
      growthAmbition,
      strategicFocus,
      competitiveIntensity,
      innovationCapability,
      resourceAvailability,
      riskTolerance,
      stakeholderAlignment,
    } = inputs;

    // Develop strategic framework
    const strategicFramework = developStrategicFramework(
      planningHorizon,
      businessMaturity,
      marketPosition,
      strategicFocus,
      stakeholderAlignment
    );

    // Define strategic initiatives
    const strategicInitiatives = defineStrategicInitiatives(
      growthAmbition,
      strategicFocus,
      competitiveIntensity,
      innovationCapability,
      resourceAvailability
    );

    // Create implementation roadmap
    const implementationRoadmap = createImplementationRoadmap(
      planningHorizon,
      resourceAvailability,
      riskTolerance,
      stakeholderAlignment,
      strategicInitiatives
    );

    // Define performance metrics
    const performanceMetrics = defineStrategicMetrics(
      strategicFocus,
      growthAmbition,
      marketPosition,
      planningHorizon
    );

    return {
      strategicFramework,
      strategicInitiatives,
      implementationRoadmap,
      performanceMetrics,
    };
  },

  validation: {},

  examples: [
    {
      name: 'Growth-Focused Manufacturing',
      description: 'Medium-term growth strategy for expanding manufacturing company',
      inputs: {
        planningHorizon: 'medium_term',
        businessMaturity: 'growth',
        marketPosition: 'challenger',
        growthAmbition: 'aggressive',
        strategicFocus: 'market_expansion',
        competitiveIntensity: 'high',
        innovationCapability: 'moderate',
        resourceAvailability: 'moderate',
        riskTolerance: 'moderate',
        stakeholderAlignment: 'moderate',
      },
    },
    {
      name: 'Digital Transformation Strategy',
      description: 'Long-term digital transformation for mature enterprise',
      inputs: {
        planningHorizon: 'long_term',
        businessMaturity: 'transformation',
        marketPosition: 'leader',
        growthAmbition: 'transformational',
        strategicFocus: 'digital_transformation',
        competitiveIntensity: 'extreme',
        innovationCapability: 'strong',
        resourceAvailability: 'abundant',
        riskTolerance: 'aggressive',
        stakeholderAlignment: 'high',
      },
    },
  ],

  tags: ['strategic-planning', 'business-strategy', 'growth', 'innovation', 'transformation'],
  
  relatedCalculators: [
    'market-analysis',
    'competitive-analysis',
    'innovation-planning',
    'growth-strategy',
  ],

  learningResources: [
    {
      title: 'Strategic Planning Best Practices',
      type: 'article',
      url: '/learn/strategic-planning',
    },
    {
      title: 'Strategic Implementation Success',
      type: 'video',
      url: '/learn/strategic-implementation',
    },
  ],
};

// Helper functions
function developStrategicFramework(
  horizon: string,
  maturity: string,
  position: string,
  focus: string,
  alignment: string
) {
  const framework = {
    planningMethodology: getPlanningMethodology(horizon, maturity),
    strategicAnalysis: getStrategicAnalysis(position, maturity),
    visionAndMission: getVisionMission(focus, horizon),
    strategicObjectives: getStrategicObjectives(focus, maturity, position),
    governanceModel: getStrategicGovernance(alignment, horizon),
  };

  return framework;
}

function getPlanningMethodology(horizon: string, maturity: string) {
  const methodologies = {
    startup: {
      short_term: 'Agile strategic planning with rapid iterations',
      medium_term: 'Lean startup methodology with pivot capability',
      long_term: 'Vision-driven planning with flexibility',
      visionary: 'Moonshot planning with breakthrough thinking',
    },
    growth: {
      short_term: 'Growth-focused planning with scaling priorities',
      medium_term: 'Market expansion planning with capability building',
      long_term: 'Sustainable growth planning with market leadership',
      visionary: 'Industry transformation planning',
    },
    mature: {
      short_term: 'Optimization-focused planning',
      medium_term: 'Market defense and efficiency planning',
      long_term: 'Innovation and renewal planning',
      visionary: 'Legacy transformation planning',
    },
    transformation: {
      short_term: 'Turnaround planning with immediate actions',
      medium_term: 'Transformation roadmap with change management',
      long_term: 'Reinvention planning with new business models',
      visionary: 'Disruptive innovation planning',
    },
    decline: {
      short_term: 'Crisis management and stabilization',
      medium_term: 'Recovery planning with restructuring',
      long_term: 'Renewal planning with new directions',
      visionary: 'Phoenix strategy with complete reinvention',
    },
  };

  return methodologies[maturity]?.[horizon] || 'Standard strategic planning methodology';
}

function getStrategicAnalysis(position: string, maturity: string) {
  const analyses = {
    leader: [
      'Market leadership sustainability analysis',
      'Competitive moat assessment',
      'Innovation pipeline evaluation',
      'Market expansion opportunities',
    ],
    challenger: [
      'Competitive gap analysis',
      'Market share growth opportunities',
      'Differentiation strategy assessment',
      'Leapfrog innovation potential',
    ],
    follower: [
      'Fast follower strategy evaluation',
      'Cost leadership opportunities',
      'Niche market identification',
      'Partnership and alliance potential',
    ],
    niche: [
      'Niche market expansion analysis',
      'Specialization deepening opportunities',
      'Adjacent market exploration',
      'Platform strategy potential',
    ],
    new_entrant: [
      'Market entry strategy analysis',
      'Competitive response assessment',
      'Resource requirement evaluation',
      'Go-to-market strategy development',
    ],
  };

  const maturityAnalyses = {
    startup: ['Product-market fit analysis', 'Scalability assessment'],
    growth: ['Growth sustainability analysis', 'Capability gap assessment'],
    mature: ['Market saturation analysis', 'Innovation opportunity assessment'],
    transformation: ['Transformation readiness analysis', 'Change capability assessment'],
    decline: ['Turnaround feasibility analysis', 'Asset optimization assessment'],
  };

  return {
    positionBased: analyses[position] || [],
    maturityBased: maturityAnalyses[maturity] || [],
    coreAnalyses: getCoreStrategicAnalyses(),
  };
}

function getCoreStrategicAnalyses() {
  return [
    'SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)',
    'PESTLE Analysis (Political, Economic, Social, Technological, Legal, Environmental)',
    'Porter\'s Five Forces Analysis',
    'Value Chain Analysis',
    'Stakeholder Analysis',
    'Scenario Planning',
  ];
}

function getVisionMission(focus: string, horizon: string) {
  const visionFrameworks = {
    operational_excellence: {
      theme: 'Operational leadership and efficiency excellence',
      timeframe: horizon === 'visionary' ? '15+ years' : '5-10 years',
      scope: 'Industry-leading operational performance',
    },
    product_innovation: {
      theme: 'Innovation leadership and breakthrough products',
      timeframe: horizon === 'visionary' ? '20+ years' : '7-12 years',
      scope: 'Technology and product innovation leadership',
    },
    market_expansion: {
      theme: 'Market leadership and global expansion',
      timeframe: horizon === 'visionary' ? '15+ years' : '5-10 years',
      scope: 'Geographic and market segment leadership',
    },
    customer_intimacy: {
      theme: 'Customer relationship excellence and loyalty',
      timeframe: horizon === 'visionary' ? '10+ years' : '5-8 years',
      scope: 'Customer experience and relationship leadership',
    },
    digital_transformation: {
      theme: 'Digital leadership and technology excellence',
      timeframe: horizon === 'visionary' ? '15+ years' : '5-10 years',
      scope: 'Digital innovation and transformation leadership',
    },
    sustainability: {
      theme: 'Sustainability leadership and environmental stewardship',
      timeframe: horizon === 'visionary' ? '25+ years' : '10-15 years',
      scope: 'Environmental and social impact leadership',
    },
  };

  return {
    visionFramework: visionFrameworks[focus],
    missionElements: getMissionElements(focus),
    valueProposition: getValueProposition(focus),
  };
}

function getMissionElements(focus: string) {
  const elements = {
    operational_excellence: ['Deliver superior value through operational excellence', 'Optimize efficiency and quality'],
    product_innovation: ['Create breakthrough products and solutions', 'Drive industry innovation'],
    market_expansion: ['Expand market presence and accessibility', 'Serve diverse global markets'],
    customer_intimacy: ['Build lasting customer relationships', 'Deliver exceptional customer experiences'],
    digital_transformation: ['Lead digital innovation and transformation', 'Enable digital-first solutions'],
    sustainability: ['Champion environmental stewardship', 'Create sustainable value for all stakeholders'],
  };

  return elements[focus] || ['Create value for stakeholders', 'Achieve sustainable growth'];
}

function getValueProposition(focus: string) {
  const propositions = {
    operational_excellence: 'Best-in-class efficiency, quality, and reliability',
    product_innovation: 'Cutting-edge products and breakthrough innovations',
    market_expansion: 'Global accessibility and market-leading solutions',
    customer_intimacy: 'Personalized solutions and exceptional service',
    digital_transformation: 'Digital-first solutions and technology leadership',
    sustainability: 'Sustainable solutions with positive environmental impact',
  };

  return propositions[focus] || 'Superior value through excellence';
}

function getStrategicObjectives(focus: string, maturity: string, position: string) {
  const focusObjectives = {
    operational_excellence: [
      'Achieve industry-leading operational efficiency',
      'Implement world-class quality systems',
      'Optimize cost structure and productivity',
    ],
    product_innovation: [
      'Develop breakthrough product innovations',
      'Build advanced R&D capabilities',
      'Create intellectual property portfolio',
    ],
    market_expansion: [
      'Expand into new geographic markets',
      'Develop new customer segments',
      'Build global market presence',
    ],
    customer_intimacy: [
      'Achieve exceptional customer satisfaction',
      'Build long-term customer relationships',
      'Develop customer-centric capabilities',
    ],
    digital_transformation: [
      'Implement digital-first operations',
      'Build advanced technology capabilities',
      'Create digital customer experiences',
    ],
    sustainability: [
      'Achieve carbon neutrality goals',
      'Implement circular economy principles',
      'Build sustainable business practices',
    ],
  };

  const maturityObjectives = {
    startup: ['Achieve product-market fit', 'Build scalable operations', 'Secure growth funding'],
    growth: ['Scale operations efficiently', 'Expand market share', 'Build competitive advantages'],
    mature: ['Maintain market leadership', 'Drive innovation', 'Optimize performance'],
    transformation: ['Execute transformation plan', 'Build new capabilities', 'Achieve cultural change'],
    decline: ['Stabilize operations', 'Restore profitability', 'Rebuild market position'],
  };

  const positionObjectives = {
    leader: ['Defend market leadership', 'Drive industry standards', 'Expand market boundaries'],
    challenger: ['Gain market share', 'Differentiate offerings', 'Challenge market leader'],
    follower: ['Optimize cost position', 'Find profitable niches', 'Build strategic partnerships'],
    niche: ['Dominate niche markets', 'Expand specialization', 'Build platform capabilities'],
    new_entrant: ['Establish market presence', 'Build brand recognition', 'Achieve profitability'],
  };

  return {
    focusBased: focusObjectives[focus] || [],
    maturityBased: maturityObjectives[maturity] || [],
    positionBased: positionObjectives[position] || [],
    financialObjectives: getFinancialObjectives(maturity, position),
  };
}

function getFinancialObjectives(maturity: string, position: string) {
  const objectives = {
    startup: ['Achieve break-even', 'Secure Series A funding', 'Reach $1M ARR'],
    growth: ['Maintain 20%+ growth', 'Improve profit margins', 'Achieve positive cash flow'],
    mature: ['Optimize ROI', 'Maintain dividend payments', 'Achieve cost leadership'],
    transformation: ['Restore profitability', 'Improve cash flow', 'Reduce debt levels'],
    decline: ['Stop losses', 'Preserve cash', 'Restructure debt'],
  };

  return objectives[maturity] || ['Achieve profitable growth', 'Optimize returns', 'Maintain financial health'];
}

function getStrategicGovernance(alignment: string, horizon: string) {
  const governance = {
    structure: getGovernanceStructure(alignment, horizon),
    decisionMaking: getDecisionMaking(alignment),
    communication: getCommunicationFramework(alignment),
    accountability: getAccountabilityFramework(alignment),
  };

  return governance;
}

function getGovernanceStructure(alignment: string, horizon: string) {
  const structures = {
    unified: 'Executive committee with board oversight',
    high: 'Strategic planning committee with cross-functional representation',
    moderate: 'Leadership team with stakeholder input',
    low: 'CEO-led with advisory support',
  };

  const horizonAdjustments = {
    visionary: 'Long-term advisory board with external expertise',
    long_term: 'Strategic advisory committee with industry experts',
    medium_term: 'Cross-functional strategic team',
    short_term: 'Executive leadership team',
  };

  return {
    primary: structures[alignment],
    horizonSpecific: horizonAdjustments[horizon],
    supportingStructures: getSupportingStructures(alignment),
  };
}

function getSupportingStructures(alignment: string) {
  const structures = ['Strategy office', 'Innovation committee', 'Risk committee'];
  
  if (alignment === 'unified' || alignment === 'high') {
    structures.push('Stakeholder advisory board', 'External advisory panel');
  }
  
  return structures;
}

function getDecisionMaking(alignment: string) {
  const processes = {
    unified: 'Consensus-based decision making with clear accountability',
    high: 'Collaborative decision making with stakeholder input',
    moderate: 'Leadership decision making with consultation',
    low: 'Executive decision making with limited input',
  };

  return processes[alignment] || 'Standard decision-making process';
}

function getCommunicationFramework(alignment: string) {
  const frameworks = {
    unified: 'Transparent communication with regular stakeholder updates',
    high: 'Regular communication with structured feedback loops',
    moderate: 'Periodic communication with key stakeholder briefings',
    low: 'Limited communication with essential updates only',
  };

  return frameworks[alignment] || 'Standard communication framework';
}

function getAccountabilityFramework(alignment: string) {
  const frameworks = {
    unified: 'Shared accountability with clear individual responsibilities',
    high: 'Clear accountability with regular performance reviews',
    moderate: 'Standard accountability with periodic assessments',
    low: 'Basic accountability with annual reviews',
  };

  return frameworks[alignment] || 'Standard accountability framework';
}

export default strategicPlanningConfig;
