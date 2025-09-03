import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface ProductionCapacityPlannerInputs extends CalculatorInputs {
  machineCount: number;
  operatingHoursPerDay: number;
  workingDaysPerWeek: number;
  averagePartCuttingTime: number; // minutes
  setupTimePerJob: number; // minutes
  averageJobSize: number; // parts per job
  machineEfficiency: number; // 0.7-0.95
  plannedDowntime: number; // hours per week
  unplannedDowntime: number; // hours per week
  operatorCount: number;
  shiftPattern: 'single' | 'double' | 'triple' | 'continuous';
  seasonalVariation: number; // percentage (±20%)
  demandForecast: number; // parts per month
}

export interface ProductionCapacityPlannerResults extends CalculatorResults {
  theoreticalCapacity: {
    daily: number; // parts per day
    weekly: number; // parts per week
    monthly: number; // parts per month
    annual: number; // parts per year
  };
  effectiveCapacity: {
    daily: number;
    weekly: number;
    monthly: number;
    annual: number;
  };
  capacityUtilization: number; // percentage
  bottleneckAnalysis: {
    primaryBottleneck: string;
    bottleneckCapacity: number; // parts per hour
    improvementPotential: number; // percentage
  };
  demandAnalysis: {
    demandVsCapacity: number; // percentage
    capacityGap: number; // parts per month (positive = surplus, negative = deficit)
    recommendedAction: string;
  };
  resourceOptimization: {
    optimalMachineCount: number;
    optimalOperatorCount: number;
    shiftOptimization: string;
    costPerPart: number;
  };
  scalingRecommendations: string[];
  seasonalPlanning: {
    peakCapacityNeeded: number;
    lowCapacityNeeded: number;
    flexibilityStrategy: string;
  };
}

export class ProductionCapacityPlanner {
  private shiftMultipliers: Record<string, number> = {
    'single': 1.0,
    'double': 1.8,  // Not quite 2x due to shift change inefficiencies
    'triple': 2.6,  // Not quite 3x due to night shift inefficiencies
    'continuous': 3.2 // 24/7 with maintenance windows
  };

  calculate(inputs: ProductionCapacityPlannerInputs): ProductionCapacityPlannerResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate theoretical capacity
    const theoreticalCapacity = this.calculateTheoreticalCapacity(inputs);

    // Calculate effective capacity
    const effectiveCapacity = this.calculateEffectiveCapacity(inputs, theoreticalCapacity);

    // Calculate capacity utilization
    const capacityUtilization = this.calculateCapacityUtilization(inputs, effectiveCapacity);

    // Perform bottleneck analysis
    const bottleneckAnalysis = this.performBottleneckAnalysis(inputs);

    // Analyze demand vs capacity
    const demandAnalysis = this.analyzeDemandVsCapacity(inputs, effectiveCapacity);

    // Optimize resources
    const resourceOptimization = this.optimizeResources(inputs, effectiveCapacity);

    // Generate scaling recommendations
    const scalingRecommendations = this.generateScalingRecommendations(inputs, demandAnalysis);

    // Plan for seasonal variations
    const seasonalPlanning = this.planSeasonalCapacity(inputs, effectiveCapacity);

    // Generate general recommendations
    const recommendations = this.generateRecommendations(inputs, effectiveCapacity, demandAnalysis);

    return {
      theoreticalCapacity,
      effectiveCapacity,
      capacityUtilization: Math.round(capacityUtilization * 100) / 100,
      bottleneckAnalysis,
      demandAnalysis,
      resourceOptimization,
      scalingRecommendations,
      seasonalPlanning,
      recommendations,
      keyMetrics: {
        'Monthly Capacity': `${effectiveCapacity.monthly.toLocaleString()} parts`,
        'Capacity Utilization': `${capacityUtilization.toFixed(1)}%`,
        'Demand Gap': `${demandAnalysis.capacityGap > 0 ? '+' : ''}${demandAnalysis.capacityGap.toLocaleString()} parts`,
        'Primary Bottleneck': bottleneckAnalysis.primaryBottleneck
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: ProductionCapacityPlannerInputs): void {
    if (inputs.machineCount <= 0) {
      throw new Error('Machine count must be greater than 0');
    }
    if (inputs.operatingHoursPerDay <= 0 || inputs.operatingHoursPerDay > 24) {
      throw new Error('Operating hours per day must be between 0 and 24');
    }
    if (inputs.averagePartCuttingTime <= 0) {
      throw new Error('Average part cutting time must be greater than 0');
    }
    if (inputs.machineEfficiency <= 0 || inputs.machineEfficiency > 1) {
      throw new Error('Machine efficiency must be between 0 and 1');
    }
    if (inputs.demandForecast < 0) {
      throw new Error('Demand forecast cannot be negative');
    }
  }

  private calculateTheoreticalCapacity(inputs: ProductionCapacityPlannerInputs): any {
    // Calculate time per job including setup
    const timePerJob = inputs.setupTimePerJob + (inputs.averageJobSize * inputs.averagePartCuttingTime);
    const jobsPerHour = 60 / timePerJob;
    const partsPerHour = jobsPerHour * inputs.averageJobSize;

    // Apply shift multiplier
    const shiftMultiplier = this.shiftMultipliers[inputs.shiftPattern];
    const effectiveHoursPerDay = inputs.operatingHoursPerDay * shiftMultiplier;

    // Calculate capacities
    const dailyCapacityPerMachine = partsPerHour * effectiveHoursPerDay;
    const daily = dailyCapacityPerMachine * inputs.machineCount;
    const weekly = daily * inputs.workingDaysPerWeek;
    const monthly = weekly * 4.33; // Average weeks per month
    const annual = monthly * 12;

    return {
      daily: Math.round(daily),
      weekly: Math.round(weekly),
      monthly: Math.round(monthly),
      annual: Math.round(annual)
    };
  }

  private calculateEffectiveCapacity(inputs: ProductionCapacityPlannerInputs, theoretical: any): any {
    // Apply efficiency factor
    let efficiencyFactor = inputs.machineEfficiency;

    // Apply downtime factor
    const totalWeeklyHours = inputs.operatingHoursPerDay * inputs.workingDaysPerWeek * this.shiftMultipliers[inputs.shiftPattern];
    const totalDowntime = inputs.plannedDowntime + inputs.unplannedDowntime;
    const downtimeFactor = Math.max(0, (totalWeeklyHours - totalDowntime) / totalWeeklyHours);

    // Apply operator constraint
    const operatorFactor = Math.min(1, inputs.operatorCount / inputs.machineCount);

    // Combined effectiveness factor
    const effectivenessFactor = efficiencyFactor * downtimeFactor * operatorFactor;

    return {
      daily: Math.round(theoretical.daily * effectivenessFactor),
      weekly: Math.round(theoretical.weekly * effectivenessFactor),
      monthly: Math.round(theoretical.monthly * effectivenessFactor),
      annual: Math.round(theoretical.annual * effectivenessFactor)
    };
  }

  private calculateCapacityUtilization(inputs: ProductionCapacityPlannerInputs, effective: any): number {
    if (effective.monthly === 0) return 0;
    return (inputs.demandForecast / effective.monthly) * 100;
  }

  private performBottleneckAnalysis(inputs: ProductionCapacityPlannerInputs): any {
    // Analyze different potential bottlenecks
    const machineCapacity = inputs.machineCount * (60 / inputs.averagePartCuttingTime);
    const operatorCapacity = inputs.operatorCount * (60 / inputs.averagePartCuttingTime);
    const setupCapacity = 60 / (inputs.setupTimePerJob / inputs.averageJobSize);

    let primaryBottleneck = 'Machines';
    let bottleneckCapacity = machineCapacity;

    if (operatorCapacity < bottleneckCapacity) {
      primaryBottleneck = 'Operators';
      bottleneckCapacity = operatorCapacity;
    }

    if (setupCapacity < bottleneckCapacity) {
      primaryBottleneck = 'Setup Time';
      bottleneckCapacity = setupCapacity;
    }

    // Calculate improvement potential
    const maxCapacity = Math.max(machineCapacity, operatorCapacity, setupCapacity);
    const improvementPotential = ((maxCapacity - bottleneckCapacity) / bottleneckCapacity) * 100;

    return {
      primaryBottleneck,
      bottleneckCapacity: Math.round(bottleneckCapacity),
      improvementPotential: Math.round(improvementPotential * 100) / 100
    };
  }

  private analyzeDemandVsCapacity(inputs: ProductionCapacityPlannerInputs, effective: any): any {
    const demandVsCapacity = (inputs.demandForecast / effective.monthly) * 100;
    const capacityGap = effective.monthly - inputs.demandForecast;

    let recommendedAction = '';
    if (capacityGap > effective.monthly * 0.2) {
      recommendedAction = 'Significant overcapacity - consider reducing resources or finding new markets';
    } else if (capacityGap > 0) {
      recommendedAction = 'Adequate capacity with good buffer for growth';
    } else if (capacityGap > -effective.monthly * 0.1) {
      recommendedAction = 'Near capacity - monitor closely and plan for expansion';
    } else {
      recommendedAction = 'Capacity deficit - immediate expansion or demand management needed';
    }

    return {
      demandVsCapacity: Math.round(demandVsCapacity * 100) / 100,
      capacityGap: Math.round(capacityGap),
      recommendedAction
    };
  }

  private optimizeResources(inputs: ProductionCapacityPlannerInputs, effective: any): any {
    // Calculate optimal machine count based on demand
    const partsPerMachinePerMonth = effective.monthly / inputs.machineCount;
    const optimalMachineCount = Math.ceil(inputs.demandForecast / partsPerMachinePerMonth);

    // Calculate optimal operator count
    const optimalOperatorCount = Math.min(optimalMachineCount, inputs.operatorCount);

    // Suggest shift optimization
    let shiftOptimization = '';
    const utilizationRate = inputs.demandForecast / effective.monthly;
    if (utilizationRate > 0.9) {
      shiftOptimization = 'Consider additional shifts to meet demand';
    } else if (utilizationRate < 0.6) {
      shiftOptimization = 'Consider reducing shifts to optimize costs';
    } else {
      shiftOptimization = 'Current shift pattern is appropriate';
    }

    // Estimate cost per part (simplified)
    const totalHourlyOperatingCost = (inputs.machineCount * 50) + (inputs.operatorCount * 25); // Simplified rates
    const costPerPart = totalHourlyOperatingCost / (effective.monthly / (inputs.operatingHoursPerDay * 22));

    return {
      optimalMachineCount,
      optimalOperatorCount,
      shiftOptimization,
      costPerPart: Math.round(costPerPart * 100) / 100
    };
  }

  private generateScalingRecommendations(inputs: ProductionCapacityPlannerInputs, demandAnalysis: any): string[] {
    const recommendations: string[] = [];

    if (demandAnalysis.capacityGap < 0) {
      recommendations.push('Increase capacity through additional machines or extended operating hours');
      recommendations.push('Consider outsourcing overflow demand to maintain service levels');
      recommendations.push('Implement efficiency improvements to maximize existing capacity');
    } else if (demandAnalysis.capacityGap > inputs.demandForecast * 0.3) {
      recommendations.push('Significant overcapacity detected - consider market expansion');
      recommendations.push('Evaluate reducing fixed costs or finding alternative revenue streams');
    }

    if (inputs.machineEfficiency < 0.8) {
      recommendations.push('Focus on improving machine efficiency through maintenance and training');
    }

    if (inputs.unplannedDowntime > inputs.plannedDowntime) {
      recommendations.push('Implement predictive maintenance to reduce unplanned downtime');
    }

    return recommendations;
  }

  private planSeasonalCapacity(inputs: ProductionCapacityPlannerInputs, effective: any): any {
    const peakCapacityNeeded = effective.monthly * (1 + inputs.seasonalVariation / 100);
    const lowCapacityNeeded = effective.monthly * (1 - inputs.seasonalVariation / 100);

    let flexibilityStrategy = '';
    if (inputs.seasonalVariation > 20) {
      flexibilityStrategy = 'High seasonal variation - consider flexible staffing and overtime strategies';
    } else if (inputs.seasonalVariation > 10) {
      flexibilityStrategy = 'Moderate seasonal variation - plan for capacity adjustments';
    } else {
      flexibilityStrategy = 'Low seasonal variation - maintain steady capacity';
    }

    return {
      peakCapacityNeeded: Math.round(peakCapacityNeeded),
      lowCapacityNeeded: Math.round(lowCapacityNeeded),
      flexibilityStrategy
    };
  }

  private generateRecommendations(inputs: ProductionCapacityPlannerInputs, effective: any, demandAnalysis: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Current effective capacity: ${effective.monthly.toLocaleString()} parts per month`);
    recommendations.push(`Demand forecast: ${inputs.demandForecast.toLocaleString()} parts per month`);

    if (demandAnalysis.capacityGap > 0) {
      recommendations.push('Capacity exceeds demand - good position for growth or cost optimization');
    } else {
      recommendations.push('Demand exceeds capacity - expansion or efficiency improvements needed');
    }

    recommendations.push('Regular capacity planning reviews recommended to adapt to changing demand');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: ProductionCapacityPlannerInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      efficiency: variations.map(variation => {
        const modifiedInputs = { ...inputs, machineEfficiency: inputs.machineEfficiency * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          capacity: result.effectiveCapacity.monthly,
          change: ((result.effectiveCapacity.monthly - baseResult.effectiveCapacity.monthly) / baseResult.effectiveCapacity.monthly * 100).toFixed(1) + '%'
        };
      }),
      demand: variations.map(variation => {
        const modifiedInputs = { ...inputs, demandForecast: inputs.demandForecast * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          utilization: result.capacityUtilization,
          gap: result.demandAnalysis.capacityGap
        };
      })
    };
  }
}

export const productionCapacityPlanner = new ProductionCapacityPlanner();
