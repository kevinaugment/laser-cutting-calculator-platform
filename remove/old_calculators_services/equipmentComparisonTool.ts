import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface EquipmentOption {
  name: string;
  manufacturer: string;
  model: string;
  purchasePrice: number; // $
  laserPower: number; // W
  laserType: 'fiber' | 'co2' | 'disk' | 'diode';
  maxThickness: Record<string, number>; // mm for different materials
  cuttingSpeed: Record<string, number>; // mm/min for different materials
  accuracy: number; // mm
  repeatability: number; // mm
  workAreaSize: { x: number; y: number; z: number }; // mm
  powerConsumption: number; // kW
  maintenanceCost: number; // $ per year
  warrantyPeriod: number; // years
  deliveryTime: number; // weeks
  floorSpace: number; // m²
  operatorSkillRequired: 'low' | 'medium' | 'high';
  serviceAvailability: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface EquipmentComparisonToolInputs extends CalculatorInputs {
  equipmentOptions: EquipmentOption[];
  evaluationCriteria: {
    purchasePrice: number; // weight 0-100
    operatingCost: number; // weight 0-100
    productivity: number; // weight 0-100
    quality: number; // weight 0-100
    reliability: number; // weight 0-100
    serviceSupport: number; // weight 0-100
    futureProofing: number; // weight 0-100
  };
  operatingConditions: {
    annualOperatingHours: number;
    electricityRate: number; // $/kWh
    laborRate: number; // $/hour
    expectedLifespan: number; // years
    financingRate: number; // percentage
    residualValue: number; // percentage of purchase price
  };
  productionRequirements: {
    primaryMaterials: string[];
    typicalThickness: number; // mm
    requiredAccuracy: number; // mm
    annualVolume: number; // parts
    qualityStandard: 'production' | 'standard' | 'high' | 'precision';
  };
}

export interface EquipmentComparisonToolResults extends CalculatorResults {
  overallRanking: {
    rank: number;
    equipmentName: string;
    totalScore: number;
    strengths: string[];
    weaknesses: string[];
  }[];
  totalCostOfOwnership: {
    equipmentName: string;
    purchaseCost: number;
    operatingCost: number;
    maintenanceCost: number;
    financingCost: number;
    totalTCO: number;
    tcoPerPart: number;
  }[];
  performanceComparison: {
    equipmentName: string;
    productivityScore: number;
    qualityScore: number;
    capabilityScore: number;
    efficiencyScore: number;
  }[];
  riskAssessment: {
    equipmentName: string;
    technicalRisk: 'low' | 'medium' | 'high';
    financialRisk: 'low' | 'medium' | 'high';
    operationalRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  }[];
  paybackAnalysis: {
    equipmentName: string;
    paybackPeriod: number; // years
    roi: number; // percentage
    npv: number; // $ net present value
    irr: number; // percentage internal rate of return
  }[];
  decisionMatrix: {
    criteria: string;
    weight: number;
    scores: { equipmentName: string; score: number; weightedScore: number }[];
  }[];
  recommendations: {
    bestOverall: string;
    bestValue: string;
    bestPerformance: string;
    bestForBudget: string;
    reasoning: string[];
  };
}

export class EquipmentComparisonTool {
  private criteriaWeights = {
    purchasePrice: 0.2,
    operatingCost: 0.15,
    productivity: 0.2,
    quality: 0.15,
    reliability: 0.1,
    serviceSupport: 0.1,
    futureProofing: 0.1
  };

  calculate(inputs: EquipmentComparisonToolInputs): EquipmentComparisonToolResults {
    // Input validation
    this.validateInputs(inputs);

    // Normalize criteria weights
    const normalizedWeights = this.normalizeCriteriaWeights(inputs.evaluationCriteria);

    // Calculate TCO for each option
    const totalCostOfOwnership = this.calculateTCO(inputs);

    // Evaluate performance for each option
    const performanceComparison = this.evaluatePerformance(inputs);

    // Assess risks for each option
    const riskAssessment = this.assessRisks(inputs);

    // Calculate payback and financial metrics
    const paybackAnalysis = this.calculatePaybackAnalysis(inputs, totalCostOfOwnership);

    // Create decision matrix
    const decisionMatrix = this.createDecisionMatrix(inputs, normalizedWeights, totalCostOfOwnership, performanceComparison);

    // Calculate overall ranking
    const overallRanking = this.calculateOverallRanking(inputs, decisionMatrix);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, overallRanking, totalCostOfOwnership, performanceComparison);

    // Generate general recommendations
    const generalRecommendations = this.generateGeneralRecommendations(inputs, recommendations);

    return {
      overallRanking,
      totalCostOfOwnership,
      performanceComparison,
      riskAssessment,
      paybackAnalysis,
      decisionMatrix,
      recommendations,
      generalRecommendations,
      keyMetrics: {
        'Best Overall': recommendations.bestOverall,
        'Best Value': recommendations.bestValue,
        'Lowest TCO': totalCostOfOwnership[0]?.equipmentName || 'N/A',
        'Highest Performance': performanceComparison[0]?.equipmentName || 'N/A'
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: EquipmentComparisonToolInputs): void {
    if (inputs.equipmentOptions.length < 2) {
      throw new Error('At least 2 equipment options are required for comparison');
    }
    if (inputs.operatingConditions.annualOperatingHours <= 0) {
      throw new Error('Annual operating hours must be greater than 0');
    }
    if (inputs.operatingConditions.expectedLifespan <= 0) {
      throw new Error('Expected lifespan must be greater than 0');
    }
  }

  private normalizeCriteriaWeights(criteria: any): any {
    const total = Object.values(criteria).reduce((sum: number, weight: any) => sum + weight, 0);
    const normalized: any = {};
    
    Object.keys(criteria).forEach(key => {
      normalized[key] = criteria[key] / total;
    });
    
    return normalized;
  }

  private calculateTCO(inputs: EquipmentComparisonToolInputs): any[] {
    return inputs.equipmentOptions.map(equipment => {
      const lifespan = inputs.operatingConditions.expectedLifespan;
      
      // Purchase cost
      const purchaseCost = equipment.purchasePrice;
      
      // Operating cost (energy + labor)
      const annualEnergyCost = equipment.powerConsumption * 
                              inputs.operatingConditions.annualOperatingHours * 
                              inputs.operatingConditions.electricityRate;
      const operatingCost = annualEnergyCost * lifespan;
      
      // Maintenance cost
      const maintenanceCost = equipment.maintenanceCost * lifespan;
      
      // Financing cost
      const financingCost = purchaseCost * (inputs.operatingConditions.financingRate / 100) * lifespan;
      
      // Residual value
      const residualValue = purchaseCost * (inputs.operatingConditions.residualValue / 100);
      
      // Total TCO
      const totalTCO = purchaseCost + operatingCost + maintenanceCost + financingCost - residualValue;
      
      // TCO per part
      const totalParts = inputs.productionRequirements.annualVolume * lifespan;
      const tcoPerPart = totalTCO / totalParts;

      return {
        equipmentName: equipment.name,
        purchaseCost: Math.round(purchaseCost),
        operatingCost: Math.round(operatingCost),
        maintenanceCost: Math.round(maintenanceCost),
        financingCost: Math.round(financingCost),
        totalTCO: Math.round(totalTCO),
        tcoPerPart: Math.round(tcoPerPart * 1000) / 1000
      };
    }).sort((a, b) => a.totalTCO - b.totalTCO);
  }

  private evaluatePerformance(inputs: EquipmentComparisonToolInputs): any[] {
    return inputs.equipmentOptions.map(equipment => {
      // Productivity score based on cutting speed and work area
      const primaryMaterial = inputs.productionRequirements.primaryMaterials[0] || 'mild_steel';
      const cuttingSpeed = equipment.cuttingSpeed[primaryMaterial] || 1000;
      const workAreaScore = (equipment.workAreaSize.x * equipment.workAreaSize.y) / 1000000; // m²
      const productivityScore = Math.min(100, (cuttingSpeed / 50) + (workAreaScore * 10));
      
      // Quality score based on accuracy and repeatability
      const accuracyScore = Math.max(0, 100 - (equipment.accuracy / inputs.productionRequirements.requiredAccuracy) * 50);
      const repeatabilityScore = Math.max(0, 100 - (equipment.repeatability * 1000));
      const qualityScore = (accuracyScore + repeatabilityScore) / 2;
      
      // Capability score based on power and thickness capability
      const thicknessCapability = equipment.maxThickness[primaryMaterial] || 10;
      const powerScore = Math.min(100, equipment.laserPower / 100);
      const thicknessScore = Math.min(100, (thicknessCapability / inputs.productionRequirements.typicalThickness) * 50);
      const capabilityScore = (powerScore + thicknessScore) / 2;
      
      // Efficiency score based on power consumption
      const efficiencyScore = Math.max(0, 100 - (equipment.powerConsumption / equipment.laserPower) * 50);

      return {
        equipmentName: equipment.name,
        productivityScore: Math.round(productivityScore),
        qualityScore: Math.round(qualityScore),
        capabilityScore: Math.round(capabilityScore),
        efficiencyScore: Math.round(efficiencyScore)
      };
    }).sort((a, b) => (b.productivityScore + b.qualityScore + b.capabilityScore + b.efficiencyScore) - 
                     (a.productivityScore + a.qualityScore + a.capabilityScore + a.efficiencyScore));
  }

  private assessRisks(inputs: EquipmentComparisonToolInputs): any[] {
    return inputs.equipmentOptions.map(equipment => {
      // Technical risk assessment
      let technicalRisk: 'low' | 'medium' | 'high' = 'low';
      if (equipment.laserType === 'co2' && inputs.productionRequirements.typicalThickness < 5) {
        technicalRisk = 'medium'; // CO2 may be overkill for thin materials
      }
      if (equipment.operatorSkillRequired === 'high') {
        technicalRisk = 'high';
      }
      
      // Financial risk assessment
      let financialRisk: 'low' | 'medium' | 'high' = 'low';
      if (equipment.purchasePrice > 500000) financialRisk = 'medium';
      if (equipment.purchasePrice > 1000000) financialRisk = 'high';
      
      // Operational risk assessment
      let operationalRisk: 'low' | 'medium' | 'high' = 'low';
      if (equipment.serviceAvailability === 'poor') operationalRisk = 'high';
      else if (equipment.serviceAvailability === 'fair') operationalRisk = 'medium';
      if (equipment.deliveryTime > 20) operationalRisk = 'medium';
      if (equipment.deliveryTime > 40) operationalRisk = 'high';
      
      // Overall risk (highest of individual risks)
      const riskLevels = { low: 1, medium: 2, high: 3 };
      const maxRisk = Math.max(
        riskLevels[technicalRisk],
        riskLevels[financialRisk],
        riskLevels[operationalRisk]
      );
      const overallRisk = Object.keys(riskLevels)[maxRisk - 1] as 'low' | 'medium' | 'high';

      return {
        equipmentName: equipment.name,
        technicalRisk,
        financialRisk,
        operationalRisk,
        overallRisk
      };
    });
  }

  private calculatePaybackAnalysis(inputs: EquipmentComparisonToolInputs, tcoData: any[]): any[] {
    return inputs.equipmentOptions.map((equipment, index) => {
      const tco = tcoData.find(t => t.equipmentName === equipment.name);
      const annualRevenue = inputs.productionRequirements.annualVolume * 50; // Assume $50 revenue per part
      const annualCost = tco.totalTCO / inputs.operatingConditions.expectedLifespan;
      const annualProfit = annualRevenue - annualCost;
      
      // Payback period
      const paybackPeriod = equipment.purchasePrice / annualProfit;
      
      // ROI
      const roi = (annualProfit / equipment.purchasePrice) * 100;
      
      // NPV calculation (simplified)
      const discountRate = inputs.operatingConditions.financingRate / 100;
      let npv = -equipment.purchasePrice;
      for (let year = 1; year <= inputs.operatingConditions.expectedLifespan; year++) {
        npv += annualProfit / Math.pow(1 + discountRate, year);
      }
      
      // IRR (simplified approximation)
      const irr = (annualProfit / equipment.purchasePrice) * 100;

      return {
        equipmentName: equipment.name,
        paybackPeriod: Math.round(paybackPeriod * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        npv: Math.round(npv),
        irr: Math.round(irr * 100) / 100
      };
    }).sort((a, b) => a.paybackPeriod - b.paybackPeriod);
  }

  private createDecisionMatrix(inputs: EquipmentComparisonToolInputs, weights: any, tco: any[], performance: any[]): any[] {
    const criteria = [
      'Purchase Price',
      'Operating Cost',
      'Productivity',
      'Quality',
      'Reliability',
      'Service Support',
      'Future Proofing'
    ];

    return criteria.map(criterion => {
      const scores = inputs.equipmentOptions.map(equipment => {
        let score = 50; // Base score
        
        switch (criterion) {
          case 'Purchase Price':
            // Lower price = higher score
            const maxPrice = Math.max(...inputs.equipmentOptions.map(e => e.purchasePrice));
            score = 100 - (equipment.purchasePrice / maxPrice) * 100;
            break;
          case 'Operating Cost':
            const equipmentTCO = tco.find(t => t.equipmentName === equipment.name);
            const maxTCO = Math.max(...tco.map(t => t.totalTCO));
            score = 100 - (equipmentTCO.totalTCO / maxTCO) * 100;
            break;
          case 'Productivity':
            const perfData = performance.find(p => p.equipmentName === equipment.name);
            score = perfData.productivityScore;
            break;
          case 'Quality':
            const qualityData = performance.find(p => p.equipmentName === equipment.name);
            score = qualityData.qualityScore;
            break;
          case 'Reliability':
            score = equipment.warrantyPeriod * 20; // 20 points per year of warranty
            break;
          case 'Service Support':
            const serviceScores = { poor: 25, fair: 50, good: 75, excellent: 100 };
            score = serviceScores[equipment.serviceAvailability];
            break;
          case 'Future Proofing':
            score = equipment.laserType === 'fiber' ? 90 : 
                   equipment.laserType === 'disk' ? 80 : 
                   equipment.laserType === 'co2' ? 60 : 40;
            break;
        }
        
        const weight = weights[criterion.toLowerCase().replace(' ', '')] || 0.1;
        const weightedScore = score * weight;
        
        return {
          equipmentName: equipment.name,
          score: Math.round(score),
          weightedScore: Math.round(weightedScore * 100) / 100
        };
      });

      return {
        criteria: criterion,
        weight: Math.round((weights[criterion.toLowerCase().replace(' ', '')] || 0.1) * 100),
        scores
      };
    });
  }

  private calculateOverallRanking(inputs: EquipmentComparisonToolInputs, decisionMatrix: any[]): any[] {
    const equipmentScores: Record<string, number> = {};
    
    // Sum weighted scores for each equipment
    inputs.equipmentOptions.forEach(equipment => {
      equipmentScores[equipment.name] = 0;
      decisionMatrix.forEach(criterion => {
        const equipmentScore = criterion.scores.find((s: any) => s.equipmentName === equipment.name);
        equipmentScores[equipment.name] += equipmentScore.weightedScore;
      });
    });

    // Create ranking with strengths and weaknesses
    const ranking = Object.entries(equipmentScores)
      .map(([name, score]) => {
        const equipment = inputs.equipmentOptions.find(e => e.name === name)!;
        
        // Identify strengths (scores > 80)
        const strengths: string[] = [];
        const weaknesses: string[] = [];
        
        decisionMatrix.forEach(criterion => {
          const equipmentScore = criterion.scores.find((s: any) => s.equipmentName === name);
          if (equipmentScore.score > 80) {
            strengths.push(criterion.criteria);
          } else if (equipmentScore.score < 40) {
            weaknesses.push(criterion.criteria);
          }
        });

        return {
          equipmentName: name,
          totalScore: Math.round(score),
          strengths,
          weaknesses
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return ranking;
  }

  private generateRecommendations(inputs: EquipmentComparisonToolInputs, ranking: any[], tco: any[], performance: any[]): any {
    const bestOverall = ranking[0].equipmentName;
    const bestValue = tco[0].equipmentName;
    const bestPerformance = performance[0].equipmentName;
    
    // Find best for budget (lowest purchase price)
    const bestForBudget = inputs.equipmentOptions
      .sort((a, b) => a.purchasePrice - b.purchasePrice)[0].name;

    const reasoning = [
      `${bestOverall} ranks highest overall with balanced performance across all criteria`,
      `${bestValue} offers the lowest total cost of ownership`,
      `${bestPerformance} provides the best performance capabilities`,
      `${bestForBudget} has the lowest initial investment requirement`
    ];

    return {
      bestOverall,
      bestValue,
      bestPerformance,
      bestForBudget,
      reasoning
    };
  }

  private generateGeneralRecommendations(inputs: EquipmentComparisonToolInputs, recommendations: any): string[] {
    const generalRecs: string[] = [];

    generalRecs.push(`Best overall choice: ${recommendations.bestOverall}`);
    generalRecs.push(`Best value option: ${recommendations.bestValue}`);
    generalRecs.push(`Highest performance: ${recommendations.bestPerformance}`);

    generalRecs.push('Consider total cost of ownership, not just purchase price');
    generalRecs.push('Evaluate vendor support and service capabilities');
    generalRecs.push('Plan for future capacity and technology requirements');

    return generalRecs;
  }

  private performSensitivityAnalysis(inputs: EquipmentComparisonToolInputs): any {
    const baseResult = this.calculate(inputs);
    const criteriaVariations = ['purchasePrice', 'productivity', 'quality'];

    return {
      criteriaWeights: criteriaVariations.map(criteria => {
        // Increase weight by 50%
        const modifiedCriteria = { ...inputs.evaluationCriteria };
        modifiedCriteria[criteria as keyof typeof modifiedCriteria] *= 1.5;
        
        const modifiedInputs = { ...inputs, evaluationCriteria: modifiedCriteria };
        const result = this.calculate(modifiedInputs);
        
        return {
          criteria,
          variation: '+50% weight',
          newWinner: result.overallRanking[0].equipmentName,
          changed: result.overallRanking[0].equipmentName !== baseResult.overallRanking[0].equipmentName
        };
      })
    };
  }
}

export const equipmentComparisonTool = new EquipmentComparisonTool();
