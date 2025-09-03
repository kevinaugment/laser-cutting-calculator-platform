import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface MaintenanceCostEstimatorInputs extends CalculatorInputs {
  equipmentValue: number; // $ initial cost
  equipmentAge: number; // years
  operatingHours: number; // hours per year
  maintenanceStrategy: 'reactive' | 'preventive' | 'predictive' | 'reliability_centered';
  laborRate: number; // $ per hour
  spareParts: {
    consumables: number; // $ per year
    wearParts: number; // $ per year
    majorComponents: number; // $ per year
  };
  downtimeRate: number; // $ per hour of downtime
  plannedMaintenanceHours: number; // hours per year
  unplannedDowntimeHours: number; // hours per year
  maintenanceTeamSize: number; // number of technicians
  contractMaintenanceCost: number; // $ per year (if applicable)
  warrantyRemaining: number; // years
  equipmentCriticality: 'low' | 'medium' | 'high' | 'critical';
}

export interface MaintenanceCostEstimatorResults extends CalculatorResults {
  annualMaintenanceCost: {
    laborCost: number; // $
    spareParts: number; // $
    contractCost: number; // $
    downtimeCost: number; // $
    totalCost: number; // $
  };
  costBreakdown: {
    preventiveMaintenance: number; // $
    correctiveMaintenance: number; // $
    emergencyRepairs: number; // $
    upgrades: number; // $
  };
  maintenanceMetrics: {
    costPerOperatingHour: number; // $ per hour
    costAsPercentageOfValue: number; // %
    meanTimeBetweenFailures: number; // hours
    meanTimeToRepair: number; // hours
    availability: number; // %
  };
  strategyComparison: {
    reactive: { cost: number; availability: number };
    preventive: { cost: number; availability: number };
    predictive: { cost: number; availability: number };
    reliability_centered: { cost: number; availability: number };
  };
  optimizationOpportunities: {
    sparesOptimization: number; // $ savings potential
    downtimeReduction: number; // $ savings potential
    strategyImprovement: number; // $ savings potential
    totalPotential: number; // $ total savings
  };
  maintenanceSchedule: {
    dailyTasks: string[];
    weeklyTasks: string[];
    monthlyTasks: string[];
    annualTasks: string[];
  };
  riskAssessment: {
    failureRisk: 'low' | 'medium' | 'high';
    costRisk: 'low' | 'medium' | 'high';
    businessImpact: 'low' | 'medium' | 'high';
    mitigation: string[];
  };
}

export class MaintenanceCostEstimator {
  private strategyFactors = {
    reactive: { cost: 1.0, availability: 0.85, planning: 0.1 },
    preventive: { cost: 0.8, availability: 0.92, planning: 0.7 },
    predictive: { cost: 0.7, availability: 0.95, planning: 0.9 },
    reliability_centered: { cost: 0.6, availability: 0.97, planning: 0.95 }
  };

  private criticalityFactors = {
    low: { cost: 0.8, urgency: 1.0 },
    medium: { cost: 1.0, urgency: 1.2 },
    high: { cost: 1.3, urgency: 1.5 },
    critical: { cost: 1.6, urgency: 2.0 }
  };

  calculate(inputs: MaintenanceCostEstimatorInputs): MaintenanceCostEstimatorResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate annual maintenance costs
    const annualMaintenanceCost = this.calculateAnnualMaintenanceCost(inputs);

    // Break down costs by category
    const costBreakdown = this.calculateCostBreakdown(inputs, annualMaintenanceCost);

    // Calculate maintenance metrics
    const maintenanceMetrics = this.calculateMaintenanceMetrics(inputs, annualMaintenanceCost);

    // Compare maintenance strategies
    const strategyComparison = this.compareMaintenanceStrategies(inputs);

    // Identify optimization opportunities
    const optimizationOpportunities = this.identifyOptimizationOpportunities(inputs, annualMaintenanceCost);

    // Generate maintenance schedule
    const maintenanceSchedule = this.generateMaintenanceSchedule(inputs);

    // Assess risks
    const riskAssessment = this.assessRisks(inputs, maintenanceMetrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, optimizationOpportunities, riskAssessment);

    return {
      annualMaintenanceCost,
      costBreakdown,
      maintenanceMetrics,
      strategyComparison,
      optimizationOpportunities,
      maintenanceSchedule,
      riskAssessment,
      recommendations,
      keyMetrics: {
        'Annual Maintenance Cost': `$${annualMaintenanceCost.totalCost.toFixed(0)}`,
        'Cost per Operating Hour': `$${maintenanceMetrics.costPerOperatingHour.toFixed(2)}`,
        'Equipment Availability': `${maintenanceMetrics.availability.toFixed(1)}%`,
        'Optimization Potential': `$${optimizationOpportunities.totalPotential.toFixed(0)}`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: MaintenanceCostEstimatorInputs): void {
    if (inputs.equipmentValue <= 0) {
      throw new Error('Equipment value must be greater than 0');
    }
    if (inputs.operatingHours < 0) {
      throw new Error('Operating hours cannot be negative');
    }
    if (inputs.laborRate < 0) {
      throw new Error('Labor rate cannot be negative');
    }
    if (inputs.downtimeRate < 0) {
      throw new Error('Downtime rate cannot be negative');
    }
  }

  private calculateAnnualMaintenanceCost(inputs: MaintenanceCostEstimatorInputs): any {
    // Labor cost calculation
    const totalMaintenanceHours = inputs.plannedMaintenanceHours + 
                                 (inputs.unplannedDowntimeHours * 1.5); // Unplanned takes 50% more time
    const laborCost = totalMaintenanceHours * inputs.laborRate;

    // Spare parts cost
    const spareParts = inputs.spareParts.consumables + 
                      inputs.spareParts.wearParts + 
                      inputs.spareParts.majorComponents;

    // Contract maintenance cost
    const contractCost = inputs.contractMaintenanceCost;

    // Downtime cost
    const downtimeCost = inputs.unplannedDowntimeHours * inputs.downtimeRate;

    // Apply strategy and criticality factors
    const strategyFactor = this.strategyFactors[inputs.maintenanceStrategy];
    const criticalityFactor = this.criticalityFactors[inputs.equipmentCriticality];

    const adjustedLaborCost = laborCost * strategyFactor.cost * criticalityFactor.cost;
    const adjustedSpareParts = spareParts * strategyFactor.cost;
    const adjustedDowntimeCost = downtimeCost * (2 - strategyFactor.availability);

    const totalCost = adjustedLaborCost + adjustedSpareParts + contractCost + adjustedDowntimeCost;

    return {
      laborCost: Math.round(adjustedLaborCost),
      spareParts: Math.round(adjustedSpareParts),
      contractCost: Math.round(contractCost),
      downtimeCost: Math.round(adjustedDowntimeCost),
      totalCost: Math.round(totalCost)
    };
  }

  private calculateCostBreakdown(inputs: MaintenanceCostEstimatorInputs, annualCost: any): any {
    const strategyFactor = this.strategyFactors[inputs.maintenanceStrategy];
    
    // Breakdown based on maintenance strategy
    const preventiveMaintenance = annualCost.totalCost * strategyFactor.planning;
    const correctiveMaintenance = annualCost.totalCost * (1 - strategyFactor.planning) * 0.7;
    const emergencyRepairs = annualCost.totalCost * (1 - strategyFactor.planning) * 0.2;
    const upgrades = annualCost.totalCost * (1 - strategyFactor.planning) * 0.1;

    return {
      preventiveMaintenance: Math.round(preventiveMaintenance),
      correctiveMaintenance: Math.round(correctiveMaintenance),
      emergencyRepairs: Math.round(emergencyRepairs),
      upgrades: Math.round(upgrades)
    };
  }

  private calculateMaintenanceMetrics(inputs: MaintenanceCostEstimatorInputs, annualCost: any): any {
    // Cost per operating hour
    const costPerOperatingHour = annualCost.totalCost / inputs.operatingHours;

    // Cost as percentage of equipment value
    const costAsPercentageOfValue = (annualCost.totalCost / inputs.equipmentValue) * 100;

    // Reliability metrics
    const strategyFactor = this.strategyFactors[inputs.maintenanceStrategy];
    const meanTimeBetweenFailures = inputs.operatingHours / (12 * (2 - strategyFactor.availability));
    const meanTimeToRepair = inputs.unplannedDowntimeHours / 12; // Assume 12 failures per year
    const availability = strategyFactor.availability * 100;

    return {
      costPerOperatingHour: Math.round(costPerOperatingHour * 100) / 100,
      costAsPercentageOfValue: Math.round(costAsPercentageOfValue * 100) / 100,
      meanTimeBetweenFailures: Math.round(meanTimeBetweenFailures),
      meanTimeToRepair: Math.round(meanTimeToRepair * 100) / 100,
      availability: Math.round(availability * 100) / 100
    };
  }

  private compareMaintenanceStrategies(inputs: MaintenanceCostEstimatorInputs): any {
    const baseInputs = { ...inputs };
    const comparison: any = {};

    Object.keys(this.strategyFactors).forEach(strategy => {
      const modifiedInputs = { ...baseInputs, maintenanceStrategy: strategy as any };
      const result = this.calculateAnnualMaintenanceCost(modifiedInputs);
      const strategyFactor = this.strategyFactors[strategy as keyof typeof this.strategyFactors];
      
      comparison[strategy] = {
        cost: result.totalCost,
        availability: Math.round(strategyFactor.availability * 100 * 100) / 100
      };
    });

    return comparison;
  }

  private identifyOptimizationOpportunities(inputs: MaintenanceCostEstimatorInputs, annualCost: any): any {
    // Spares optimization potential
    const currentSparesRatio = (inputs.spareParts.consumables + inputs.spareParts.wearParts + inputs.spareParts.majorComponents) / inputs.equipmentValue;
    const optimalSparesRatio = 0.05; // 5% of equipment value
    const sparesOptimization = Math.max(0, (currentSparesRatio - optimalSparesRatio) * inputs.equipmentValue);

    // Downtime reduction potential
    const currentDowntimeRatio = inputs.unplannedDowntimeHours / inputs.operatingHours;
    const targetDowntimeRatio = 0.02; // 2% downtime target
    const downtimeReduction = Math.max(0, (currentDowntimeRatio - targetDowntimeRatio) * inputs.operatingHours * inputs.downtimeRate);

    // Strategy improvement potential
    const currentStrategy = this.strategyFactors[inputs.maintenanceStrategy];
    const bestStrategy = this.strategyFactors.reliability_centered;
    const strategyImprovement = annualCost.totalCost * (currentStrategy.cost - bestStrategy.cost);

    const totalPotential = sparesOptimization + downtimeReduction + Math.max(0, strategyImprovement);

    return {
      sparesOptimization: Math.round(sparesOptimization),
      downtimeReduction: Math.round(downtimeReduction),
      strategyImprovement: Math.round(Math.max(0, strategyImprovement)),
      totalPotential: Math.round(totalPotential)
    };
  }

  private generateMaintenanceSchedule(inputs: MaintenanceCostEstimatorInputs): any {
    const dailyTasks = [
      'Visual inspection of equipment condition',
      'Check safety systems and emergency stops',
      'Monitor operating parameters and alarms',
      'Clean work area and remove debris'
    ];

    const weeklyTasks = [
      'Lubricate moving parts per schedule',
      'Check and clean air filters',
      'Inspect electrical connections',
      'Verify calibration of sensors',
      'Review maintenance logs and trends'
    ];

    const monthlyTasks = [
      'Comprehensive equipment inspection',
      'Replace consumable parts per schedule',
      'Perform precision alignment checks',
      'Update maintenance records and documentation',
      'Analyze performance trends and KPIs'
    ];

    const annualTasks = [
      'Major component overhaul and replacement',
      'Complete electrical system inspection',
      'Precision calibration of all systems',
      'Comprehensive safety system testing',
      'Maintenance strategy review and optimization'
    ];

    return {
      dailyTasks,
      weeklyTasks,
      monthlyTasks,
      annualTasks
    };
  }

  private assessRisks(inputs: MaintenanceCostEstimatorInputs, metrics: any): any {
    // Failure risk assessment
    let failureRisk: 'low' | 'medium' | 'high' = 'low';
    if (inputs.equipmentAge > 10 || metrics.availability < 90) failureRisk = 'high';
    else if (inputs.equipmentAge > 5 || metrics.availability < 95) failureRisk = 'medium';

    // Cost risk assessment
    let costRisk: 'low' | 'medium' | 'high' = 'low';
    if (metrics.costAsPercentageOfValue > 15) costRisk = 'high';
    else if (metrics.costAsPercentageOfValue > 10) costRisk = 'medium';

    // Business impact assessment
    let businessImpact: 'low' | 'medium' | 'high' = inputs.equipmentCriticality === 'critical' ? 'high' :
                                                   inputs.equipmentCriticality === 'high' ? 'high' :
                                                   inputs.equipmentCriticality === 'medium' ? 'medium' : 'low';

    // Risk mitigation strategies
    const mitigation: string[] = [];
    if (failureRisk === 'high') {
      mitigation.push('Implement predictive maintenance technologies');
      mitigation.push('Increase spare parts inventory for critical components');
    }
    if (costRisk === 'high') {
      mitigation.push('Review maintenance contracts and negotiate better terms');
      mitigation.push('Optimize spare parts management and procurement');
    }
    if (businessImpact === 'high') {
      mitigation.push('Develop backup equipment or redundancy plans');
      mitigation.push('Create detailed emergency response procedures');
    }

    return {
      failureRisk,
      costRisk,
      businessImpact,
      mitigation
    };
  }

  private generateRecommendations(inputs: MaintenanceCostEstimatorInputs, optimization: any, risk: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Annual maintenance cost: $${inputs.contractMaintenanceCost + inputs.spareParts.consumables + inputs.spareParts.wearParts + inputs.spareParts.majorComponents}`);

    if (optimization.totalPotential > 0) {
      recommendations.push(`Potential cost savings: $${optimization.totalPotential} per year`);
    }

    if (inputs.maintenanceStrategy === 'reactive') {
      recommendations.push('Consider upgrading to preventive or predictive maintenance strategy');
    }

    if (risk.failureRisk === 'high') {
      recommendations.push('High failure risk detected - immediate attention to maintenance strategy needed');
    }

    recommendations.push('Regular review of maintenance costs and effectiveness recommended');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: MaintenanceCostEstimatorInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      operatingHours: variations.map(variation => {
        const modifiedInputs = { ...inputs, operatingHours: inputs.operatingHours * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalCost: result.annualMaintenanceCost.totalCost,
          change: ((result.annualMaintenanceCost.totalCost - baseResult.annualMaintenanceCost.totalCost) / baseResult.annualMaintenanceCost.totalCost * 100).toFixed(1) + '%'
        };
      }),
      laborRate: variations.map(variation => {
        const modifiedInputs = { ...inputs, laborRate: inputs.laborRate * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalCost: result.annualMaintenanceCost.totalCost,
          change: ((result.annualMaintenanceCost.totalCost - baseResult.annualMaintenanceCost.totalCost) / baseResult.annualMaintenanceCost.totalCost * 100).toFixed(1) + '%'
        };
      })
    };
  }
}

export const maintenanceCostEstimator = new MaintenanceCostEstimator();
