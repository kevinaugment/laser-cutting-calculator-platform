import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface GasConsumptionInputs extends CalculatorInputs {
  gasType: 'oxygen' | 'nitrogen' | 'air' | 'argon';
  materialType: string;
  thickness: number;
  cuttingLength: number; // Total cutting length in mm
  cuttingTime: number; // Total cutting time in minutes
  piercingPoints: number;
  gasFlow: number; // l/min
  gasPressure: number; // bar
  gasPrice: number; // Price per m³
  efficiency: number; // Gas utilization efficiency (0.8-0.95)
  setupTime: number; // Minutes
  idleTime: number; // Minutes with gas flowing but not cutting
}

export interface GasConsumptionResults extends CalculatorResults {
  totalConsumption: number; // Total gas consumption in m³
  cuttingConsumption: number; // Gas used during cutting
  piercingConsumption: number; // Gas used during piercing
  setupConsumption: number; // Gas used during setup
  idleConsumption: number; // Gas used during idle time
  totalCost: number; // Total gas cost
  costPerMeter: number; // Cost per meter of cutting
  costPerPiece: number; // Cost per piece (if quantity provided)
  efficiency: {
    utilizationRate: number; // Percentage of productive gas use
    wasteReduction: number; // Potential waste reduction
    optimizationPotential: number; // Cost savings potential
  };
  gasProperties: {
    purity: string;
    density: number; // kg/m³
    thermalConductivity: number; // W/m·K
    suitability: string; // Suitability for material/thickness
  };
}

export class GasConsumptionCalculator {
  private gasProperties = {
    oxygen: {
      density: 1.429,
      thermalConductivity: 0.0263,
      purity: '99.5%',
      applications: ['Steel cutting', 'Fast cutting', 'Thick materials']
    },
    nitrogen: {
      density: 1.251,
      thermalConductivity: 0.0259,
      purity: '99.9%',
      applications: ['Stainless steel', 'Aluminum', 'High quality cuts']
    },
    air: {
      density: 1.225,
      thermalConductivity: 0.0257,
      purity: '78% N2, 21% O2',
      applications: ['Thin materials', 'Cost-sensitive applications']
    },
    argon: {
      density: 1.784,
      thermalConductivity: 0.0177,
      purity: '99.9%',
      applications: ['Titanium', 'Special alloys', 'Research applications']
    }
  };

  calculate(inputs: GasConsumptionInputs): GasConsumptionResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate consumption for different phases
    const cuttingConsumption = this.calculateCuttingConsumption(inputs);
    const piercingConsumption = this.calculatePiercingConsumption(inputs);
    const setupConsumption = this.calculateSetupConsumption(inputs);
    const idleConsumption = this.calculateIdleConsumption(inputs);

    // Total consumption
    const totalConsumption = cuttingConsumption + piercingConsumption + setupConsumption + idleConsumption;
    
    // Cost calculations
    const totalCost = totalConsumption * inputs.gasPrice;
    const costPerMeter = totalCost / (inputs.cuttingLength / 1000); // Convert mm to m
    const costPerPiece = inputs.quantity ? totalCost / inputs.quantity : 0;

    // Efficiency calculations
    const productiveConsumption = cuttingConsumption + piercingConsumption;
    const utilizationRate = (productiveConsumption / totalConsumption) * 100;
    const wasteReduction = this.calculateWasteReduction(inputs, totalConsumption);
    const optimizationPotential = this.calculateOptimizationPotential(inputs, totalCost);

    // Gas properties
    const gasProps = this.gasProperties[inputs.gasType];
    const suitability = this.assessSuitability(inputs);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, {
      totalConsumption,
      utilizationRate,
      totalCost,
      suitability
    });

    return {
      totalConsumption: Math.round(totalConsumption * 1000) / 1000,
      cuttingConsumption: Math.round(cuttingConsumption * 1000) / 1000,
      piercingConsumption: Math.round(piercingConsumption * 1000) / 1000,
      setupConsumption: Math.round(setupConsumption * 1000) / 1000,
      idleConsumption: Math.round(idleConsumption * 1000) / 1000,
      totalCost: Math.round(totalCost * 100) / 100,
      costPerMeter: Math.round(costPerMeter * 100) / 100,
      costPerPiece: Math.round(costPerPiece * 100) / 100,
      efficiency: {
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        wasteReduction: Math.round(wasteReduction * 100) / 100,
        optimizationPotential: Math.round(optimizationPotential * 100) / 100
      },
      gasProperties: {
        purity: gasProps.purity,
        density: gasProps.density,
        thermalConductivity: gasProps.thermalConductivity,
        suitability: suitability
      },
      recommendations,
      keyMetrics: {
        'Total Consumption': `${totalConsumption.toFixed(2)} m³`,
        'Total Cost': `$${totalCost.toFixed(2)}`,
        'Utilization Rate': `${utilizationRate.toFixed(1)}%`,
        'Cost per Meter': `$${costPerMeter.toFixed(3)}/m`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: GasConsumptionInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.cuttingLength <= 0) {
      throw new Error('Cutting length must be greater than 0');
    }
    if (inputs.gasFlow <= 0) {
      throw new Error('Gas flow must be greater than 0');
    }
    if (inputs.gasPrice < 0) {
      throw new Error('Gas price cannot be negative');
    }
    if (inputs.efficiency < 0.5 || inputs.efficiency > 1) {
      throw new Error('Efficiency must be between 0.5 and 1.0');
    }
  }

  private calculateCuttingConsumption(inputs: GasConsumptionInputs): number {
    // Gas consumption during cutting = flow rate × time × efficiency
    const consumptionM3 = (inputs.gasFlow * inputs.cuttingTime) / 1000; // Convert l to m³
    return consumptionM3 * inputs.efficiency;
  }

  private calculatePiercingConsumption(inputs: GasConsumptionInputs): number {
    // Piercing typically uses higher gas flow for a short duration
    const piercingFlowMultiplier = this.getPiercingFlowMultiplier(inputs.gasType, inputs.thickness);
    const piercingTimePerPoint = this.getPiercingTime(inputs.materialType, inputs.thickness);
    const totalPiercingTime = (inputs.piercingPoints * piercingTimePerPoint) / 60; // Convert to minutes
    
    const piercingFlow = inputs.gasFlow * piercingFlowMultiplier;
    return (piercingFlow * totalPiercingTime) / 1000; // Convert to m³
  }

  private calculateSetupConsumption(inputs: GasConsumptionInputs): number {
    // Gas used during setup (purging, testing, etc.)
    const setupFlowRate = inputs.gasFlow * 0.5; // Reduced flow during setup
    return (setupFlowRate * inputs.setupTime) / 1000; // Convert to m³
  }

  private calculateIdleConsumption(inputs: GasConsumptionInputs): number {
    // Gas used during idle time (standby flow)
    const idleFlowRate = inputs.gasFlow * 0.2; // Minimal flow during idle
    return (idleFlowRate * inputs.idleTime) / 1000; // Convert to m³
  }

  private getPiercingFlowMultiplier(gasType: string, thickness: number): number {
    // Piercing requires higher gas flow, especially for thicker materials
    const baseMultiplier = {
      'oxygen': 1.5,
      'nitrogen': 1.8,
      'air': 1.3,
      'argon': 2.0
    };
    
    const thicknessMultiplier = 1 + (thickness / 20); // Increase with thickness
    return (baseMultiplier[gasType] || 1.5) * thicknessMultiplier;
  }

  private getPiercingTime(materialType: string, thickness: number): number {
    // Piercing time in seconds based on material and thickness
    const baseTimes = {
      'steel': 0.5 + thickness * 0.3,
      'stainless': 0.8 + thickness * 0.4,
      'aluminum': 0.3 + thickness * 0.2
    };
    
    const material = materialType.toLowerCase();
    return baseTimes[material] || baseTimes['steel'];
  }

  private calculateWasteReduction(inputs: GasConsumptionInputs, totalConsumption: number): number {
    // Calculate potential waste reduction through optimization
    const currentWaste = totalConsumption * (1 - inputs.efficiency);
    const optimizedEfficiency = Math.min(0.95, inputs.efficiency + 0.1);
    const optimizedWaste = totalConsumption * (1 - optimizedEfficiency);
    
    return ((currentWaste - optimizedWaste) / currentWaste) * 100;
  }

  private calculateOptimizationPotential(inputs: GasConsumptionInputs, totalCost: number): number {
    // Calculate potential cost savings through optimization
    let savingsPotential = 0;
    
    // Flow rate optimization
    if (inputs.gasFlow > this.getOptimalFlow(inputs.gasType, inputs.thickness)) {
      savingsPotential += 15; // 15% savings potential
    }
    
    // Pressure optimization
    if (inputs.gasPressure > this.getOptimalPressure(inputs.gasType, inputs.thickness)) {
      savingsPotential += 10; // 10% savings potential
    }
    
    // Idle time reduction
    if (inputs.idleTime > inputs.cuttingTime * 0.2) {
      savingsPotential += 8; // 8% savings potential
    }
    
    return Math.min(savingsPotential, 30); // Cap at 30% potential savings
  }

  private getOptimalFlow(gasType: string, thickness: number): number {
    // Optimal flow rates based on gas type and thickness
    const optimalFlows = {
      'oxygen': 15 + thickness * 2,
      'nitrogen': 20 + thickness * 3,
      'air': 12 + thickness * 1.5,
      'argon': 18 + thickness * 2.5
    };
    
    return optimalFlows[gasType] || 20;
  }

  private getOptimalPressure(gasType: string, thickness: number): number {
    // Optimal pressures based on gas type and thickness
    const optimalPressures = {
      'oxygen': 1.5 + thickness * 0.2,
      'nitrogen': 2.0 + thickness * 0.3,
      'air': 1.2 + thickness * 0.15,
      'argon': 1.8 + thickness * 0.25
    };
    
    return optimalPressures[gasType] || 2.0;
  }

  private assessSuitability(inputs: GasConsumptionInputs): string {
    const material = inputs.materialType.toLowerCase();
    const thickness = inputs.thickness;
    const gasType = inputs.gasType;
    
    // Suitability matrix
    const suitabilityMatrix = {
      'oxygen': {
        'steel': thickness <= 25 ? 'Excellent' : 'Good',
        'aluminum': 'Poor',
        'stainless': thickness <= 6 ? 'Fair' : 'Poor'
      },
      'nitrogen': {
        'steel': 'Good',
        'aluminum': 'Excellent',
        'stainless': 'Excellent'
      },
      'air': {
        'steel': thickness <= 3 ? 'Good' : 'Fair',
        'aluminum': thickness <= 2 ? 'Fair' : 'Poor',
        'stainless': 'Poor'
      }
    };
    
    return suitabilityMatrix[gasType]?.[material] || 'Fair';
  }

  private generateRecommendations(inputs: GasConsumptionInputs, analysis: any): string[] {
    const recommendations: string[] = [];

    // Gas type recommendations
    if (analysis.suitability === 'Poor') {
      recommendations.push(`Consider switching from ${inputs.gasType} to a more suitable gas for ${inputs.materialType}`);
    }

    // Flow rate recommendations
    const optimalFlow = this.getOptimalFlow(inputs.gasType, inputs.thickness);
    if (inputs.gasFlow > optimalFlow * 1.2) {
      recommendations.push('Gas flow rate is high - consider reducing flow for cost savings');
    }

    // Utilization recommendations
    if (analysis.utilizationRate < 70) {
      recommendations.push('Low gas utilization - review idle time and setup procedures');
    }

    // Cost optimization recommendations
    if (analysis.totalCost > 50) {
      recommendations.push('High gas costs detected - consider bulk purchasing or alternative suppliers');
    }

    // Efficiency recommendations
    if (inputs.efficiency < 0.85) {
      recommendations.push('Gas efficiency is low - check for leaks and optimize cutting parameters');
    }

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: GasConsumptionInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      gasFlow: variations.map(variation => {
        const modifiedInputs = { ...inputs, gasFlow: inputs.gasFlow * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalCost: result.totalCost,
          change: ((result.totalCost - baseResult.totalCost) / baseResult.totalCost * 100).toFixed(1) + '%'
        };
      }),
      gasPrice: variations.map(variation => {
        const modifiedInputs = { ...inputs, gasPrice: inputs.gasPrice * (1 + variation / 100) };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          totalCost: result.totalCost,
          change: ((result.totalCost - baseResult.totalCost) / baseResult.totalCost * 100).toFixed(1) + '%'
        };
      })
    };
  }
}

export const gasConsumptionCalculator = new GasConsumptionCalculator();
