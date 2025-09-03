import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface ProjectQuotingCalculatorInputs extends CalculatorInputs {
  projectSpecifications: {
    projectName: string;
    customerType: 'new' | 'existing' | 'preferred' | 'strategic';
    projectComplexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
    urgency: 'standard' | 'expedited' | 'rush' | 'emergency';
    deliveryLocation: 'local' | 'regional' | 'national' | 'international';
    paymentTerms: 'net_30' | 'net_60' | 'advance_payment' | 'milestone_based';
    warrantyRequirements: 'standard' | 'extended' | 'premium' | 'custom';
  };
  partDetails: {
    partId: string;
    partName: string;
    quantity: number;
    materialType: string;
    thickness: number; // mm
    dimensions: { length: number; width: number }; // mm
    complexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
    toleranceClass: 'standard' | 'precision' | 'high_precision';
    surfaceFinish: 'as_cut' | 'deburred' | 'polished' | 'coated';
    specialRequirements: string[];
  }[];
  materialCosts: {
    materialType: string;
    thickness: number; // mm
    costPerSheet: number; // $
    sheetSize: { length: number; width: number }; // mm
    materialUtilization: number; // percentage
    wasteFactor: number; // percentage
    supplierLeadTime: number; // days
  }[];
  laborRates: {
    setupLabor: number; // $ per hour
    operatingLabor: number; // $ per hour
    qualityInspection: number; // $ per hour
    packaging: number; // $ per hour
    supervision: number; // $ per hour
    engineeringSupport: number; // $ per hour
  };
  machineRates: {
    machineType: string;
    hourlyRate: number; // $ per hour
    setupTime: number; // hours
    cuttingSpeed: number; // mm/min
    utilization: number; // percentage
    maintenanceFactor: number; // percentage
  }[];
  overheadFactors: {
    facilityOverhead: number; // percentage of direct costs
    administrativeOverhead: number; // percentage of direct costs
    salesOverhead: number; // percentage of direct costs
    insuranceAndLegal: number; // percentage of direct costs
    equipmentDepreciation: number; // percentage of direct costs
    utilities: number; // percentage of direct costs
  };
  marketFactors: {
    competitionLevel: 'low' | 'moderate' | 'high' | 'intense';
    marketDemand: 'low' | 'moderate' | 'high' | 'very_high';
    seasonalFactor: number; // multiplier (0.8-1.2)
    economicConditions: 'recession' | 'stable' | 'growth' | 'boom';
    customerBudget: 'tight' | 'moderate' | 'flexible' | 'unlimited';
  };
  riskFactors: {
    technicalRisk: 'low' | 'medium' | 'high' | 'very_high';
    scheduleRisk: 'low' | 'medium' | 'high' | 'very_high';
    qualityRisk: 'low' | 'medium' | 'high' | 'very_high';
    paymentRisk: 'low' | 'medium' | 'high' | 'very_high';
    scopeChangeRisk: 'low' | 'medium' | 'high' | 'very_high';
  };
  profitTargets: {
    minimumProfitMargin: number; // percentage
    targetProfitMargin: number; // percentage
    strategicProfitMargin: number; // percentage
    volumeDiscountThreshold: number; // quantity
    volumeDiscountRate: number; // percentage
  };
}

export interface ProjectQuotingCalculatorResults extends CalculatorResults {
  costBreakdown: {
    totalProjectCost: number; // $
    directCosts: {
      materialCost: number; // $
      laborCost: number; // $
      machineCost: number; // $
      subcontractingCost: number; // $
      totalDirectCost: number; // $
    };
    indirectCosts: {
      overheadCost: number; // $
      administrativeCost: number; // $
      salesCost: number; // $
      engineeringCost: number; // $
      totalIndirectCost: number; // $
    };
    riskContingency: number; // $
    profitMargin: number; // $
  };
  pricingAnalysis: {
    basePrice: number; // $
    adjustedPrice: number; // $
    competitivePrice: number; // $
    recommendedPrice: number; // $
    pricePerPart: number; // $
    pricePerPound: number; // $ per lb
    pricePerSquareFoot: number; // $ per sq ft
  };
  profitabilityAnalysis: {
    grossProfitMargin: number; // percentage
    netProfitMargin: number; // percentage
    contributionMargin: number; // $
    breakEvenQuantity: number; // parts
    returnOnInvestment: number; // percentage
    paybackPeriod: number; // months
  };
  competitiveAnalysis: {
    marketPosition: 'premium' | 'competitive' | 'value' | 'budget';
    priceCompetitiveness: number; // 1-10 scale
    valueProposition: string[];
    competitiveAdvantages: string[];
    pricingStrategy: string;
  };
  riskAssessment: {
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskPremium: number; // $ added to price
    riskMitigation: { risk: string; mitigation: string; cost: number }[];
    contingencyRecommendation: number; // percentage
  };
  scenarioAnalysis: {
    optimisticScenario: { price: number; margin: number; probability: number };
    mostLikelyScenario: { price: number; margin: number; probability: number };
    pessimisticScenario: { price: number; margin: number; probability: number };
    sensitivityFactors: { factor: string; impact: number }[];
  };
  quotingStrategy: {
    recommendedApproach: string;
    negotiationPoints: string[];
    valueAddServices: { service: string; cost: number; value: number }[];
    paymentTermsImpact: { terms: string; priceAdjustment: number }[];
    deliveryOptions: { option: string; cost: number; timeframe: string }[];
  };
  documentationRequirements: {
    quotingDocuments: string[];
    technicalSpecifications: string[];
    qualityStandards: string[];
    deliverySchedule: string[];
    termsAndConditions: string[];
  };
  alertsAndRecommendations: {
    pricingAlerts: string[];
    profitabilityWarnings: string[];
    competitiveInsights: string[];
    riskMitigations: string[];
    strategicRecommendations: string[];
  };
}

export class ProjectQuotingCalculator {
  private complexityMultipliers = {
    'simple': 1.0,
    'moderate': 1.2,
    'complex': 1.5,
    'very_complex': 2.0
  };

  private urgencyMultipliers = {
    'standard': 1.0,
    'expedited': 1.15,
    'rush': 1.3,
    'emergency': 1.5
  };

  private customerTypeFactors = {
    'new': { riskFactor: 1.2, negotiationPower: 0.8 },
    'existing': { riskFactor: 1.0, negotiationPower: 1.0 },
    'preferred': { riskFactor: 0.9, negotiationPower: 1.1 },
    'strategic': { riskFactor: 0.8, negotiationPower: 1.2 }
  };

  private riskPremiums = {
    'low': 0.02,
    'medium': 0.05,
    'high': 0.10,
    'very_high': 0.15,
    'critical': 0.25
  };

  calculate(inputs: ProjectQuotingCalculatorInputs): ProjectQuotingCalculatorResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate cost breakdown
    const costBreakdown = this.calculateCostBreakdown(inputs);

    // Analyze pricing
    const pricingAnalysis = this.analyzePricing(inputs, costBreakdown);

    // Analyze profitability
    const profitabilityAnalysis = this.analyzeProfitability(inputs, costBreakdown, pricingAnalysis);

    // Competitive analysis
    const competitiveAnalysis = this.performCompetitiveAnalysis(inputs, pricingAnalysis);

    // Risk assessment
    const riskAssessment = this.assessRisks(inputs, costBreakdown);

    // Scenario analysis
    const scenarioAnalysis = this.performScenarioAnalysis(inputs, pricingAnalysis);

    // Quoting strategy
    const quotingStrategy = this.developQuotingStrategy(inputs, competitiveAnalysis);

    // Documentation requirements
    const documentationRequirements = this.defineDocumentationRequirements(inputs);

    // Alerts and recommendations
    const alertsAndRecommendations = this.generateAlertsAndRecommendations(inputs, profitabilityAnalysis, riskAssessment);

    // Generate general recommendations
    const recommendations = this.generateRecommendations(inputs, pricingAnalysis, competitiveAnalysis);

    return {
      costBreakdown,
      pricingAnalysis,
      profitabilityAnalysis,
      competitiveAnalysis,
      riskAssessment,
      scenarioAnalysis,
      quotingStrategy,
      documentationRequirements,
      alertsAndRecommendations,
      recommendations,
      keyMetrics: {
        'Recommended Price': `$${pricingAnalysis.recommendedPrice.toFixed(2)}`,
        'Profit Margin': `${profitabilityAnalysis.grossProfitMargin.toFixed(1)}%`,
        'Risk Level': riskAssessment.overallRiskLevel,
        'Market Position': competitiveAnalysis.marketPosition
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: ProjectQuotingCalculatorInputs): void {
    if (inputs.partDetails.length === 0) {
      throw new Error('At least one part must be specified');
    }
    if (inputs.materialCosts.length === 0) {
      throw new Error('Material cost information is required');
    }
    if (inputs.profitTargets.minimumProfitMargin < 0) {
      throw new Error('Minimum profit margin cannot be negative');
    }
  }

  private calculateCostBreakdown(inputs: ProjectQuotingCalculatorInputs): any {
    // Calculate material costs
    const materialCost = this.calculateMaterialCosts(inputs);

    // Calculate labor costs
    const laborCost = this.calculateLaborCosts(inputs);

    // Calculate machine costs
    const machineCost = this.calculateMachineCosts(inputs);

    // Subcontracting costs (simplified)
    const subcontractingCost = 0;

    const totalDirectCost = materialCost + laborCost + machineCost + subcontractingCost;

    // Calculate indirect costs
    const overheadCost = totalDirectCost * (inputs.overheadFactors.facilityOverhead / 100);
    const administrativeCost = totalDirectCost * (inputs.overheadFactors.administrativeOverhead / 100);
    const salesCost = totalDirectCost * (inputs.overheadFactors.salesOverhead / 100);
    const engineeringCost = totalDirectCost * 0.05; // 5% for engineering support

    const totalIndirectCost = overheadCost + administrativeCost + salesCost + engineeringCost;

    // Risk contingency
    const riskLevel = this.calculateOverallRiskLevel(inputs);
    const riskContingency = totalDirectCost * this.riskPremiums[riskLevel];

    // Profit margin
    const profitMargin = (totalDirectCost + totalIndirectCost + riskContingency) * 
                        (inputs.profitTargets.targetProfitMargin / 100);

    const totalProjectCost = totalDirectCost + totalIndirectCost + riskContingency + profitMargin;

    return {
      totalProjectCost: Math.round(totalProjectCost),
      directCosts: {
        materialCost: Math.round(materialCost),
        laborCost: Math.round(laborCost),
        machineCost: Math.round(machineCost),
        subcontractingCost: Math.round(subcontractingCost),
        totalDirectCost: Math.round(totalDirectCost)
      },
      indirectCosts: {
        overheadCost: Math.round(overheadCost),
        administrativeCost: Math.round(administrativeCost),
        salesCost: Math.round(salesCost),
        engineeringCost: Math.round(engineeringCost),
        totalIndirectCost: Math.round(totalIndirectCost)
      },
      riskContingency: Math.round(riskContingency),
      profitMargin: Math.round(profitMargin)
    };
  }

  private calculateMaterialCosts(inputs: ProjectQuotingCalculatorInputs): number {
    return inputs.partDetails.reduce((total, part) => {
      const materialInfo = inputs.materialCosts.find(m => 
        m.materialType === part.materialType && m.thickness === part.thickness
      );
      
      if (!materialInfo) return total;

      const partArea = part.dimensions.length * part.dimensions.width; // mm²
      const sheetArea = materialInfo.sheetSize.length * materialInfo.sheetSize.width; // mm²
      const sheetsNeeded = Math.ceil((partArea * part.quantity) / (sheetArea * materialInfo.materialUtilization / 100));
      const materialCost = sheetsNeeded * materialInfo.costPerSheet;
      const wasteCost = materialCost * (materialInfo.wasteFactor / 100);

      return total + materialCost + wasteCost;
    }, 0);
  }

  private calculateLaborCosts(inputs: ProjectQuotingCalculatorInputs): number {
    const totalQuantity = inputs.partDetails.reduce((sum, part) => sum + part.quantity, 0);
    const complexityFactor = this.complexityMultipliers[inputs.projectSpecifications.projectComplexity];
    
    // Setup labor
    const setupHours = inputs.partDetails.length * 0.5 * complexityFactor; // 0.5 hours per part type
    const setupCost = setupHours * inputs.laborRates.setupLabor;

    // Operating labor
    const operatingHours = totalQuantity * 0.1 * complexityFactor; // 0.1 hours per part
    const operatingCost = operatingHours * inputs.laborRates.operatingLabor;

    // Quality inspection
    const inspectionHours = totalQuantity * 0.02; // 0.02 hours per part
    const inspectionCost = inspectionHours * inputs.laborRates.qualityInspection;

    // Packaging
    const packagingHours = totalQuantity * 0.01; // 0.01 hours per part
    const packagingCost = packagingHours * inputs.laborRates.packaging;

    return setupCost + operatingCost + inspectionCost + packagingCost;
  }

  private calculateMachineCosts(inputs: ProjectQuotingCalculatorInputs): number {
    const machine = inputs.machineRates[0]; // Use first machine for simplicity
    if (!machine) return 0;

    const totalCuttingLength = inputs.partDetails.reduce((total, part) => {
      const perimeter = 2 * (part.dimensions.length + part.dimensions.width);
      return total + (perimeter * part.quantity);
    }, 0);

    const cuttingHours = totalCuttingLength / (machine.cuttingSpeed * 60); // Convert mm/min to mm/hour
    const setupHours = machine.setupTime * inputs.partDetails.length;
    const totalMachineHours = (cuttingHours + setupHours) / (machine.utilization / 100);

    return totalMachineHours * machine.hourlyRate;
  }

  private calculateOverallRiskLevel(inputs: ProjectQuotingCalculatorInputs): 'low' | 'medium' | 'high' | 'very_high' | 'critical' {
    const riskScores = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'very_high': 4,
      'critical': 5
    };

    const risks = [
      inputs.riskFactors.technicalRisk,
      inputs.riskFactors.scheduleRisk,
      inputs.riskFactors.qualityRisk,
      inputs.riskFactors.paymentRisk,
      inputs.riskFactors.scopeChangeRisk
    ];

    const averageScore = risks.reduce((sum, risk) => sum + riskScores[risk], 0) / risks.length;

    if (averageScore <= 1.5) return 'low';
    if (averageScore <= 2.5) return 'medium';
    if (averageScore <= 3.5) return 'high';
    if (averageScore <= 4.5) return 'very_high';
    return 'critical';
  }

  private analyzePricing(inputs: ProjectQuotingCalculatorInputs, costs: any): any {
    const basePrice = costs.totalProjectCost;
    
    // Apply urgency multiplier
    const urgencyMultiplier = this.urgencyMultipliers[inputs.projectSpecifications.urgency];
    const adjustedPrice = basePrice * urgencyMultiplier;

    // Market-based competitive price
    const marketMultiplier = inputs.marketFactors.competitionLevel === 'intense' ? 0.9 :
                            inputs.marketFactors.competitionLevel === 'high' ? 0.95 :
                            inputs.marketFactors.competitionLevel === 'moderate' ? 1.0 : 1.05;
    const competitivePrice = adjustedPrice * marketMultiplier;

    // Recommended price considering all factors
    const customerFactor = this.customerTypeFactors[inputs.projectSpecifications.customerType];
    const recommendedPrice = competitivePrice * customerFactor.negotiationPower;

    // Calculate per-unit prices
    const totalQuantity = inputs.partDetails.reduce((sum, part) => sum + part.quantity, 0);
    const pricePerPart = recommendedPrice / totalQuantity;

    // Calculate price per weight (simplified)
    const totalWeight = inputs.partDetails.reduce((sum, part) => {
      const volume = part.dimensions.length * part.dimensions.width * part.thickness; // mm³
      const density = 0.008; // kg per cm³ for steel (simplified)
      return sum + (volume / 1000000 * density * part.quantity); // Convert to kg
    }, 0);
    const pricePerPound = totalWeight > 0 ? recommendedPrice / (totalWeight * 2.20462) : 0;

    // Calculate price per area
    const totalArea = inputs.partDetails.reduce((sum, part) => {
      const area = part.dimensions.length * part.dimensions.width; // mm²
      return sum + (area * part.quantity / 92903); // Convert to sq ft
    }, 0);
    const pricePerSquareFoot = totalArea > 0 ? recommendedPrice / totalArea : 0;

    return {
      basePrice: Math.round(basePrice),
      adjustedPrice: Math.round(adjustedPrice),
      competitivePrice: Math.round(competitivePrice),
      recommendedPrice: Math.round(recommendedPrice),
      pricePerPart: Math.round(pricePerPart * 100) / 100,
      pricePerPound: Math.round(pricePerPound * 100) / 100,
      pricePerSquareFoot: Math.round(pricePerSquareFoot * 100) / 100
    };
  }

  private analyzeProfitability(inputs: ProjectQuotingCalculatorInputs, costs: any, pricing: any): any {
    const revenue = pricing.recommendedPrice;
    const totalCosts = costs.directCosts.totalDirectCost + costs.indirectCosts.totalIndirectCost;
    
    const grossProfit = revenue - totalCosts;
    const grossProfitMargin = (grossProfit / revenue) * 100;
    
    const netProfit = grossProfit - costs.riskContingency;
    const netProfitMargin = (netProfit / revenue) * 100;
    
    const contributionMargin = revenue - costs.directCosts.totalDirectCost;
    
    // Break-even analysis
    const fixedCosts = costs.indirectCosts.totalIndirectCost;
    const variableCostPerUnit = costs.directCosts.totalDirectCost / inputs.partDetails.reduce((sum, part) => sum + part.quantity, 0);
    const pricePerUnit = pricing.pricePerPart;
    const breakEvenQuantity = fixedCosts / (pricePerUnit - variableCostPerUnit);
    
    // ROI calculation (simplified)
    const investment = costs.directCosts.totalDirectCost;
    const returnOnInvestment = (netProfit / investment) * 100;
    
    // Payback period (simplified)
    const monthlyProfit = netProfit / 12; // Assume annual project
    const paybackPeriod = investment / monthlyProfit;

    return {
      grossProfitMargin: Math.round(grossProfitMargin * 10) / 10,
      netProfitMargin: Math.round(netProfitMargin * 10) / 10,
      contributionMargin: Math.round(contributionMargin),
      breakEvenQuantity: Math.round(breakEvenQuantity),
      returnOnInvestment: Math.round(returnOnInvestment * 10) / 10,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10
    };
  }

  private performCompetitiveAnalysis(inputs: ProjectQuotingCalculatorInputs, pricing: any): any {
    // Market position based on pricing
    let marketPosition: 'premium' | 'competitive' | 'value' | 'budget';
    const priceLevel = pricing.pricePerPart;
    
    if (priceLevel > 100) marketPosition = 'premium';
    else if (priceLevel > 50) marketPosition = 'competitive';
    else if (priceLevel > 25) marketPosition = 'value';
    else marketPosition = 'budget';

    // Price competitiveness (1-10 scale)
    const competitionLevel = inputs.marketFactors.competitionLevel;
    const priceCompetitiveness = competitionLevel === 'intense' ? 6 :
                                competitionLevel === 'high' ? 7 :
                                competitionLevel === 'moderate' ? 8 : 9;

    const valueProposition = [
      'High-quality laser cutting services',
      'Competitive pricing with excellent value',
      'Reliable delivery and customer service',
      'Technical expertise and support'
    ];

    const competitiveAdvantages = [
      'Advanced laser cutting technology',
      'Experienced engineering team',
      'Quality assurance processes',
      'Flexible production capabilities'
    ];

    const pricingStrategy = marketPosition === 'premium' ? 'Value-based pricing with premium positioning' :
                           marketPosition === 'competitive' ? 'Market-competitive pricing strategy' :
                           marketPosition === 'value' ? 'Value pricing for cost-conscious customers' :
                           'Budget pricing for price-sensitive market';

    return {
      marketPosition,
      priceCompetitiveness,
      valueProposition,
      competitiveAdvantages,
      pricingStrategy
    };
  }

  private assessRisks(inputs: ProjectQuotingCalculatorInputs, costs: any): any {
    const overallRiskLevel = this.calculateOverallRiskLevel(inputs);
    const riskPremium = costs.totalProjectCost * this.riskPremiums[overallRiskLevel];

    const riskMitigation = [
      {
        risk: 'Technical complexity',
        mitigation: 'Detailed engineering review and prototyping',
        cost: 1000
      },
      {
        risk: 'Schedule delays',
        mitigation: 'Buffer time and resource allocation',
        cost: 500
      },
      {
        risk: 'Quality issues',
        mitigation: 'Enhanced quality control procedures',
        cost: 750
      }
    ];

    const contingencyRecommendation = overallRiskLevel === 'critical' ? 25 :
                                     overallRiskLevel === 'very_high' ? 20 :
                                     overallRiskLevel === 'high' ? 15 :
                                     overallRiskLevel === 'medium' ? 10 : 5;

    return {
      overallRiskLevel,
      riskPremium: Math.round(riskPremium),
      riskMitigation,
      contingencyRecommendation
    };
  }

  private performScenarioAnalysis(inputs: ProjectQuotingCalculatorInputs, pricing: any): any {
    const basePrice = pricing.recommendedPrice;
    
    const optimisticScenario = {
      price: Math.round(basePrice * 1.15),
      margin: 35,
      probability: 25
    };

    const mostLikelyScenario = {
      price: Math.round(basePrice),
      margin: 25,
      probability: 50
    };

    const pessimisticScenario = {
      price: Math.round(basePrice * 0.85),
      margin: 15,
      probability: 25
    };

    const sensitivityFactors = [
      { factor: 'Material cost changes', impact: 15 },
      { factor: 'Labor rate fluctuations', impact: 10 },
      { factor: 'Competition pricing', impact: 20 },
      { factor: 'Customer negotiation', impact: 12 },
      { factor: 'Project scope changes', impact: 18 }
    ];

    return {
      optimisticScenario,
      mostLikelyScenario,
      pessimisticScenario,
      sensitivityFactors
    };
  }

  private developQuotingStrategy(inputs: ProjectQuotingCalculatorInputs, competitive: any): any {
    const recommendedApproach = competitive.marketPosition === 'premium' ?
      'Emphasize quality and value proposition' :
      competitive.marketPosition === 'competitive' ?
      'Focus on competitive advantages and service' :
      'Highlight cost-effectiveness and reliability';

    const negotiationPoints = [
      'Volume discounts for larger quantities',
      'Payment terms flexibility',
      'Delivery schedule optimization',
      'Value-added services inclusion'
    ];

    const valueAddServices = [
      { service: 'Design optimization', cost: 500, value: 1500 },
      { service: 'Quality certification', cost: 300, value: 800 },
      { service: 'Expedited delivery', cost: 200, value: 1000 },
      { service: 'Technical support', cost: 400, value: 1200 }
    ];

    const paymentTermsImpact = [
      { terms: 'Net 30', priceAdjustment: 0 },
      { terms: 'Net 60', priceAdjustment: 2 },
      { terms: 'Advance payment', priceAdjustment: -3 },
      { terms: 'Milestone based', priceAdjustment: 1 }
    ];

    const deliveryOptions = [
      { option: 'Standard delivery', cost: 0, timeframe: '2-3 weeks' },
      { option: 'Expedited delivery', cost: 500, timeframe: '1-2 weeks' },
      { option: 'Rush delivery', cost: 1000, timeframe: '3-5 days' }
    ];

    return {
      recommendedApproach,
      negotiationPoints,
      valueAddServices,
      paymentTermsImpact,
      deliveryOptions
    };
  }

  private defineDocumentationRequirements(inputs: ProjectQuotingCalculatorInputs): any {
    return {
      quotingDocuments: [
        'Formal quote with detailed breakdown',
        'Technical specifications document',
        'Terms and conditions',
        'Delivery schedule',
        'Quality standards certification'
      ],
      technicalSpecifications: [
        'Material specifications and certifications',
        'Dimensional tolerances and inspection criteria',
        'Surface finish requirements',
        'Packaging and shipping specifications'
      ],
      qualityStandards: [
        'ISO 9001 quality management compliance',
        'Industry-specific standards adherence',
        'Inspection and testing procedures',
        'Quality documentation and traceability'
      ],
      deliverySchedule: [
        'Production timeline with milestones',
        'Delivery dates and logistics',
        'Installation and commissioning schedule',
        'Training and support timeline'
      ],
      termsAndConditions: [
        'Payment terms and conditions',
        'Warranty and service agreements',
        'Change order procedures',
        'Liability and insurance requirements'
      ]
    };
  }

  private generateAlertsAndRecommendations(inputs: ProjectQuotingCalculatorInputs, profitability: any, risks: any): any {
    const pricingAlerts: string[] = [];
    const profitabilityWarnings: string[] = [];
    const competitiveInsights: string[] = [];
    const riskMitigations: string[] = [];
    const strategicRecommendations: string[] = [];

    // Pricing alerts
    if (profitability.grossProfitMargin < inputs.profitTargets.minimumProfitMargin) {
      pricingAlerts.push('Profit margin below minimum target - review pricing strategy');
    }

    // Profitability warnings
    if (profitability.netProfitMargin < 10) {
      profitabilityWarnings.push('Low net profit margin - consider cost optimization');
    }

    // Competitive insights
    competitiveInsights.push('Monitor competitor pricing and adjust strategy accordingly');

    // Risk mitigations
    if (risks.overallRiskLevel === 'high' || risks.overallRiskLevel === 'critical') {
      riskMitigations.push('High project risk - implement comprehensive risk management');
    }

    // Strategic recommendations
    strategicRecommendations.push('Develop long-term customer relationships for repeat business');
    strategicRecommendations.push('Consider value-added services to differentiate offering');

    return {
      pricingAlerts,
      profitabilityWarnings,
      competitiveInsights,
      riskMitigations,
      strategicRecommendations
    };
  }

  private generateRecommendations(inputs: ProjectQuotingCalculatorInputs, pricing: any, competitive: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Recommended project price: $${pricing.recommendedPrice.toFixed(2)}`);
    recommendations.push(`Market position: ${competitive.marketPosition} with ${competitive.pricingStrategy}`);

    if (pricing.pricePerPart > 50) {
      recommendations.push('Consider volume discounts for large quantity orders');
    }

    recommendations.push('Include value-added services to enhance competitiveness');
    recommendations.push('Regular market analysis recommended for pricing optimization');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: ProjectQuotingCalculatorInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      materialCosts: variations.map(variation => {
        const modifiedInputs = {
          ...inputs,
          materialCosts: inputs.materialCosts.map(material => ({
            ...material,
            costPerSheet: material.costPerSheet * (1 + variation / 100)
          }))
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          recommendedPrice: result.pricingAnalysis.recommendedPrice,
          profitMargin: result.profitabilityAnalysis.grossProfitMargin,
          impact: ((result.pricingAnalysis.recommendedPrice - baseResult.pricingAnalysis.recommendedPrice) / baseResult.pricingAnalysis.recommendedPrice * 100).toFixed(1) + '%'
        };
      }),
      laborRates: variations.map(variation => {
        const modifiedInputs = {
          ...inputs,
          laborRates: Object.fromEntries(
            Object.entries(inputs.laborRates).map(([key, rate]) => 
              [key, rate * (1 + variation / 100)]
            )
          )
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          recommendedPrice: result.pricingAnalysis.recommendedPrice,
          laborCost: result.costBreakdown.directCosts.laborCost,
          profitability: result.profitabilityAnalysis.grossProfitMargin
        };
      }),
      competitionLevel: [
        {
          level: 'Low competition',
          priceAdjustment: 5,
          marketPosition: 'Premium positioning possible'
        },
        {
          level: 'Intense competition',
          priceAdjustment: -10,
          marketPosition: 'Aggressive pricing required'
        }
      ]
    };
  }
}

export const projectQuotingCalculator = new ProjectQuotingCalculator();
