import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface EnergyCostCalculatorInputs extends CalculatorInputs {
  laserPower: number; // W
  operatingHours: number; // hours per day
  workingDays: number; // days per month
  electricityRate: number; // $/kWh
  demandCharge: number; // $/kW per month
  powerFactor: number; // 0.8-1.0
  systemEfficiency: number; // 0.2-0.4
  auxiliaryPower: number; // W (pumps, compressors, etc.)
  hvacPower: number; // W (heating, ventilation, cooling)
  standbyPower: number; // W (when not cutting)
  standbyHours: number; // hours per day in standby
  peakDemandWindow: number; // hours of peak demand pricing
  peakRateMultiplier: number; // multiplier for peak hours (1.5-3.0)
}

export interface EnergyCostCalculatorResults extends CalculatorResults {
  energyConsumption: {
    laserConsumption: number; // kWh per month
    auxiliaryConsumption: number; // kWh per month
    hvacConsumption: number; // kWh per month
    standbyConsumption: number; // kWh per month
    totalConsumption: number; // kWh per month
  };
  energyCosts: {
    laserCost: number; // $ per month
    auxiliaryCost: number; // $ per month
    hvacCost: number; // $ per month
    standbyCost: number; // $ per month
    demandCost: number; // $ per month
    totalMonthlyCost: number; // $ per month
    annualCost: number; // $ per year
  };
  demandAnalysis: {
    peakDemand: number; // kW
    averageDemand: number; // kW
    loadFactor: number; // percentage
    demandOptimizationPotential: number; // $ per month
  };
  costBreakdown: {
    energyCostPerHour: number; // $ per operating hour
    energyCostPerPart: number; // $ per part (if quantity provided)
    energyCostPercentage: number; // % of total operating cost
  };
  efficiencyAnalysis: {
    overallEfficiency: number; // percentage
    powerUtilization: number; // percentage
    wastedEnergy: number; // kWh per month
    wastedCost: number; // $ per month
  };
  optimizationRecommendations: {
    demandManagement: string[];
    efficiencyImprovements: string[];
    costReductions: string[];
    potentialSavings: number; // $ per month
  };
  timeOfUseAnalysis: {
    peakHoursCost: number; // $ per month
    offPeakHoursCost: number; // $ per month
    shiftingPotential: number; // $ per month savings
  };
}

export class EnergyCostCalculator {
  calculate(inputs: EnergyCostCalculatorInputs): EnergyCostCalculatorResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate energy consumption
    const energyConsumption = this.calculateEnergyConsumption(inputs);

    // Calculate energy costs
    const energyCosts = this.calculateEnergyCosts(inputs, energyConsumption);

    // Analyze demand characteristics
    const demandAnalysis = this.analyzeDemand(inputs);

    // Calculate cost breakdown
    const costBreakdown = this.calculateCostBreakdown(inputs, energyCosts);

    // Analyze efficiency
    const efficiencyAnalysis = this.analyzeEfficiency(inputs, energyConsumption);

    // Generate optimization recommendations
    const optimizationRecommendations = this.generateOptimizationRecommendations(inputs, energyCosts, efficiencyAnalysis);

    // Analyze time-of-use patterns
    const timeOfUseAnalysis = this.analyzeTimeOfUse(inputs, energyConsumption);

    // Generate general recommendations
    const recommendations = this.generateRecommendations(inputs, energyCosts, optimizationRecommendations);

    return {
      energyConsumption,
      energyCosts,
      demandAnalysis,
      costBreakdown,
      efficiencyAnalysis,
      optimizationRecommendations,
      timeOfUseAnalysis,
      recommendations,
      keyMetrics: {
        'Monthly Energy Cost': `$${energyCosts.totalMonthlyCost.toFixed(2)}`,
        'Annual Energy Cost': `$${energyCosts.annualCost.toFixed(0)}`,
        'Cost per Operating Hour': `$${costBreakdown.energyCostPerHour.toFixed(3)}`,
        'Overall Efficiency': `${efficiencyAnalysis.overallEfficiency.toFixed(1)}%`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: EnergyCostCalculatorInputs): void {
    if (inputs.laserPower <= 0) {
      throw new Error('Laser power must be greater than 0');
    }
    if (inputs.operatingHours < 0 || inputs.operatingHours > 24) {
      throw new Error('Operating hours must be between 0 and 24');
    }
    if (inputs.electricityRate < 0) {
      throw new Error('Electricity rate cannot be negative');
    }
    if (inputs.systemEfficiency <= 0 || inputs.systemEfficiency > 1) {
      throw new Error('System efficiency must be between 0 and 1');
    }
    if (inputs.powerFactor < 0.5 || inputs.powerFactor > 1) {
      throw new Error('Power factor must be between 0.5 and 1');
    }
  }

  private calculateEnergyConsumption(inputs: EnergyCostCalculatorInputs): any {
    // Laser consumption (accounting for efficiency)
    const laserConsumption = (inputs.laserPower / inputs.systemEfficiency / 1000) * 
                            inputs.operatingHours * inputs.workingDays;

    // Auxiliary systems consumption
    const auxiliaryConsumption = (inputs.auxiliaryPower / 1000) * 
                                 inputs.operatingHours * inputs.workingDays;

    // HVAC consumption (runs longer than laser)
    const hvacHours = Math.min(24, inputs.operatingHours + 4); // HVAC runs 4 hours extra
    const hvacConsumption = (inputs.hvacPower / 1000) * hvacHours * inputs.workingDays;

    // Standby consumption
    const standbyConsumption = (inputs.standbyPower / 1000) * 
                              inputs.standbyHours * inputs.workingDays;

    // Total consumption
    const totalConsumption = laserConsumption + auxiliaryConsumption + 
                            hvacConsumption + standbyConsumption;

    return {
      laserConsumption: Math.round(laserConsumption * 100) / 100,
      auxiliaryConsumption: Math.round(auxiliaryConsumption * 100) / 100,
      hvacConsumption: Math.round(hvacConsumption * 100) / 100,
      standbyConsumption: Math.round(standbyConsumption * 100) / 100,
      totalConsumption: Math.round(totalConsumption * 100) / 100
    };
  }

  private calculateEnergyCosts(inputs: EnergyCostCalculatorInputs, consumption: any): any {
    // Calculate costs with time-of-use considerations
    const peakHoursFraction = inputs.peakDemandWindow / inputs.operatingHours;
    const offPeakHoursFraction = 1 - peakHoursFraction;

    // Weighted average rate considering peak pricing
    const weightedRate = inputs.electricityRate * 
                        (peakHoursFraction * inputs.peakRateMultiplier + offPeakHoursFraction);

    // Individual component costs
    const laserCost = consumption.laserConsumption * weightedRate;
    const auxiliaryCost = consumption.auxiliaryConsumption * weightedRate;
    const hvacCost = consumption.hvacConsumption * inputs.electricityRate; // HVAC typically off-peak
    const standbyCost = consumption.standbyConsumption * inputs.electricityRate;

    // Demand cost calculation
    const peakDemand = this.calculatePeakDemand(inputs);
    const demandCost = peakDemand * inputs.demandCharge;

    // Total costs
    const totalMonthlyCost = laserCost + auxiliaryCost + hvacCost + standbyCost + demandCost;
    const annualCost = totalMonthlyCost * 12;

    return {
      laserCost: Math.round(laserCost * 100) / 100,
      auxiliaryCost: Math.round(auxiliaryCost * 100) / 100,
      hvacCost: Math.round(hvacCost * 100) / 100,
      standbyCost: Math.round(standbyCost * 100) / 100,
      demandCost: Math.round(demandCost * 100) / 100,
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      annualCost: Math.round(annualCost * 100) / 100
    };
  }

  private calculatePeakDemand(inputs: EnergyCostCalculatorInputs): number {
    // Peak demand occurs when all systems are running simultaneously
    const laserDemand = (inputs.laserPower / inputs.systemEfficiency) / 1000;
    const auxiliaryDemand = inputs.auxiliaryPower / 1000;
    const hvacDemand = inputs.hvacPower / 1000;
    
    // Apply power factor correction
    const totalDemand = (laserDemand + auxiliaryDemand + hvacDemand) / inputs.powerFactor;
    
    return Math.round(totalDemand * 100) / 100;
  }

  private analyzeDemand(inputs: EnergyCostCalculatorInputs): any {
    const peakDemand = this.calculatePeakDemand(inputs);
    
    // Calculate average demand
    const totalPower = (inputs.laserPower / inputs.systemEfficiency) + 
                      inputs.auxiliaryPower + inputs.hvacPower;
    const averageDemand = (totalPower * inputs.operatingHours / 24) / 1000;
    
    // Load factor calculation
    const loadFactor = (averageDemand / peakDemand) * 100;
    
    // Demand optimization potential
    const currentDemandCost = peakDemand * inputs.demandCharge;
    const optimizedDemand = peakDemand * 0.9; // 10% reduction potential
    const demandOptimizationPotential = (peakDemand - optimizedDemand) * inputs.demandCharge;

    return {
      peakDemand: Math.round(peakDemand * 100) / 100,
      averageDemand: Math.round(averageDemand * 100) / 100,
      loadFactor: Math.round(loadFactor * 100) / 100,
      demandOptimizationPotential: Math.round(demandOptimizationPotential * 100) / 100
    };
  }

  private calculateCostBreakdown(inputs: EnergyCostCalculatorInputs, costs: any): any {
    // Cost per operating hour
    const energyCostPerHour = costs.totalMonthlyCost / (inputs.operatingHours * inputs.workingDays);
    
    // Cost per part (if quantity provided)
    const energyCostPerPart = inputs.quantity ? 
      costs.totalMonthlyCost / inputs.quantity : 0;
    
    // Energy cost as percentage of total operating cost (estimated)
    const estimatedTotalOperatingCost = costs.totalMonthlyCost * 3; // Energy typically 30-40% of total
    const energyCostPercentage = (costs.totalMonthlyCost / estimatedTotalOperatingCost) * 100;

    return {
      energyCostPerHour: Math.round(energyCostPerHour * 1000) / 1000,
      energyCostPerPart: Math.round(energyCostPerPart * 1000) / 1000,
      energyCostPercentage: Math.round(energyCostPercentage * 100) / 100
    };
  }

  private analyzeEfficiency(inputs: EnergyCostCalculatorInputs, consumption: any): any {
    // Overall system efficiency
    const theoreticalConsumption = (inputs.laserPower / 1000) * inputs.operatingHours * inputs.workingDays;
    const overallEfficiency = (theoreticalConsumption / consumption.totalConsumption) * 100;
    
    // Power utilization (productive vs total power)
    const productivePower = inputs.laserPower / inputs.systemEfficiency;
    const totalPower = productivePower + inputs.auxiliaryPower + inputs.hvacPower + inputs.standbyPower;
    const powerUtilization = (productivePower / totalPower) * 100;
    
    // Wasted energy calculation
    const wastedEnergy = consumption.totalConsumption - theoreticalConsumption;
    const wastedCost = wastedEnergy * inputs.electricityRate;

    return {
      overallEfficiency: Math.round(overallEfficiency * 100) / 100,
      powerUtilization: Math.round(powerUtilization * 100) / 100,
      wastedEnergy: Math.round(wastedEnergy * 100) / 100,
      wastedCost: Math.round(wastedCost * 100) / 100
    };
  }

  private generateOptimizationRecommendations(inputs: EnergyCostCalculatorInputs, costs: any, efficiency: any): any {
    const demandManagement: string[] = [];
    const efficiencyImprovements: string[] = [];
    const costReductions: string[] = [];
    let potentialSavings = 0;

    // Demand management recommendations
    if (inputs.demandCharge > 10) {
      demandManagement.push('Implement load shedding during peak demand periods');
      demandManagement.push('Stagger equipment startup to avoid simultaneous peak loads');
      potentialSavings += costs.demandCost * 0.15; // 15% demand reduction potential
    }

    // Efficiency improvements
    if (inputs.systemEfficiency < 0.3) {
      efficiencyImprovements.push('Upgrade laser system for better electrical efficiency');
      potentialSavings += costs.laserCost * 0.2; // 20% efficiency improvement potential
    }

    if (efficiency.powerUtilization < 60) {
      efficiencyImprovements.push('Optimize auxiliary systems operation');
      potentialSavings += costs.auxiliaryCost * 0.25; // 25% auxiliary optimization potential
    }

    // Cost reduction strategies
    if (inputs.peakRateMultiplier > 1.5) {
      costReductions.push('Consider shifting production to off-peak hours');
      potentialSavings += costs.totalMonthlyCost * 0.1; // 10% time-shifting potential
    }

    costReductions.push('Negotiate better electricity rates or consider renewable energy');
    costReductions.push('Implement energy monitoring systems for real-time optimization');

    return {
      demandManagement,
      efficiencyImprovements,
      costReductions,
      potentialSavings: Math.round(potentialSavings * 100) / 100
    };
  }

  private analyzeTimeOfUse(inputs: EnergyCostCalculatorInputs, consumption: any): any {
    // Calculate peak vs off-peak costs
    const peakHoursFraction = inputs.peakDemandWindow / inputs.operatingHours;
    const peakConsumption = consumption.totalConsumption * peakHoursFraction;
    const offPeakConsumption = consumption.totalConsumption * (1 - peakHoursFraction);

    const peakHoursCost = peakConsumption * inputs.electricityRate * inputs.peakRateMultiplier;
    const offPeakHoursCost = offPeakConsumption * inputs.electricityRate;

    // Calculate shifting potential
    const currentPeakCost = peakHoursCost;
    const shiftedCost = peakConsumption * inputs.electricityRate; // If shifted to off-peak
    const shiftingPotential = currentPeakCost - shiftedCost;

    return {
      peakHoursCost: Math.round(peakHoursCost * 100) / 100,
      offPeakHoursCost: Math.round(offPeakHoursCost * 100) / 100,
      shiftingPotential: Math.round(shiftingPotential * 100) / 100
    };
  }

  private generateRecommendations(inputs: EnergyCostCalculatorInputs, costs: any, optimization: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Monthly energy cost: $${costs.totalMonthlyCost.toFixed(2)}`);
    recommendations.push(`Annual energy cost: $${costs.annualCost.toFixed(0)}`);

    if (optimization.potentialSavings > costs.totalMonthlyCost * 0.1) {
      recommendations.push(`Significant savings potential: $${optimization.potentialSavings.toFixed(2)}/month`);
    }

    if (costs.demandCost > costs.totalMonthlyCost * 0.3) {
      recommendations.push('Demand charges are significant - focus on peak demand management');
    }

    recommendations.push('Regular energy audits recommended to identify additional savings opportunities');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: EnergyCostCalculatorInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      electricityRate: variations.map(variation => {
        const modifiedInputs = { ...inputs, electricityRate: inputs.electricityRate * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          monthlyCost: result.energyCosts.totalMonthlyCost,
          change: ((result.energyCosts.totalMonthlyCost - baseResult.energyCosts.totalMonthlyCost) / baseResult.energyCosts.totalMonthlyCost * 100).toFixed(1) + '%'
        };
      }),
      operatingHours: variations.map(variation => {
        const modifiedInputs = { ...inputs, operatingHours: inputs.operatingHours * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          monthlyCost: result.energyCosts.totalMonthlyCost,
          change: ((result.energyCosts.totalMonthlyCost - baseResult.energyCosts.totalMonthlyCost) / baseResult.energyCosts.totalMonthlyCost * 100).toFixed(1) + '%'
        };
      })
    };
  }
}

export const energyCostCalculator = new EnergyCostCalculator();
