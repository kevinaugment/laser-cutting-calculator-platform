/**
 * Enhanced Cost Calculation Engine for Direct Cost Control
 * Provides optimized calculation algorithms with industry benchmarks
 */

export interface CostCalculationEngine {
  calculateDirectCosts(inputs: DirectCostInputs): DirectCostResults;
  validateInputs(inputs: any): ValidationResult;
  generateBenchmarks(results: any): BenchmarkData;
  optimizeCosts(currentCosts: any): OptimizationSuggestions;
}

export interface DirectCostInputs {
  operatingHours: number;
  powerRating: number;
  electricityRate: number;
  laborRate: number;
  materialCosts: number;
  overheadRate: number;
}

export interface DirectCostResults {
  totalCost: number;
  costBreakdown: CostBreakdown;
  hourlyRate: number;
  benchmarkComparison: BenchmarkComparison;
  optimizationOpportunities: OptimizationOpportunity[];
}

export interface CostBreakdown {
  energy: number;
  labor: number;
  materials: number;
  overhead: number;
  maintenance: number;
  percentages: Record<string, number>;
}

export interface BenchmarkComparison {
  industryAverage: number;
  topQuartile: number;
  currentPerformance: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
  improvementPotential: number;
}

export interface OptimizationOpportunity {
  category: string;
  description: string;
  potentialSaving: number;
  difficulty: 'low' | 'medium' | 'high';
  implementationTime: string;
  actions: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

export interface BenchmarkData {
  industryBenchmarks: IndustryBenchmark[];
  performanceMetrics: PerformanceMetric[];
  competitivePosition: CompetitivePosition;
}

export interface IndustryBenchmark {
  metric: string;
  value: number;
  unit: string;
  source: string;
  lastUpdated: Date;
}

export interface PerformanceMetric {
  name: string;
  current: number;
  target: number;
  benchmark: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface CompetitivePosition {
  percentile: number;
  ranking: string;
  gapToLeader: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

export class EnhancedCostCalculationEngine implements CostCalculationEngine {
  private benchmarkCache: Map<string, BenchmarkData> = new Map();
  private lastBenchmarkUpdate: Date = new Date();

  calculateDirectCosts(inputs: DirectCostInputs): DirectCostResults {
    const validation = this.validateInputs(inputs);
    if (!validation.isValid) {
      throw new Error(`Invalid inputs: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const costBreakdown = this.calculateCostBreakdown(inputs);
    const hourlyRate = costBreakdown.totalCost / inputs.operatingHours;
    const benchmarkComparison = this.generateBenchmarkComparison(hourlyRate, inputs.powerRating);
    const optimizationOpportunities = this.identifyOptimizationOpportunities(costBreakdown, inputs);

    return {
      totalCost: costBreakdown.totalCost,
      costBreakdown: costBreakdown,
      hourlyRate,
      benchmarkComparison,
      optimizationOpportunities,
    };
  }

  validateInputs(inputs: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate operating hours
    if (!inputs.operatingHours || inputs.operatingHours <= 0) {
      errors.push({
        field: 'operatingHours',
        message: 'Operating hours must be greater than 0',
        code: 'INVALID_OPERATING_HOURS'
      });
    } else if (inputs.operatingHours > 8760) { // More than hours in a year
      warnings.push({
        field: 'operatingHours',
        message: 'Operating hours exceed annual maximum',
        suggestion: 'Consider if this represents annual or monthly hours'
      });
    }

    // Validate power rating
    if (!inputs.powerRating || inputs.powerRating < 500 || inputs.powerRating > 15000) {
      errors.push({
        field: 'powerRating',
        message: 'Power rating must be between 500W and 15000W',
        code: 'INVALID_POWER_RATING'
      });
    }

    // Validate electricity rate
    if (!inputs.electricityRate || inputs.electricityRate < 0.05 || inputs.electricityRate > 1.0) {
      errors.push({
        field: 'electricityRate',
        message: 'Electricity rate must be between $0.05 and $1.00 per kWh',
        code: 'INVALID_ELECTRICITY_RATE'
      });
    }

    // Validate labor rate
    if (!inputs.laborRate || inputs.laborRate < 10 || inputs.laborRate > 100) {
      warnings.push({
        field: 'laborRate',
        message: 'Labor rate seems unusual',
        suggestion: 'Typical rates are between $15-$50 per hour'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  generateBenchmarks(results: any): BenchmarkData {
    const cacheKey = `benchmark_${results.powerRating}_${Date.now()}`;
    
    if (this.benchmarkCache.has(cacheKey) && 
        Date.now() - this.lastBenchmarkUpdate.getTime() < 24 * 60 * 60 * 1000) {
      return this.benchmarkCache.get(cacheKey)!;
    }

    const benchmarkData = this.fetchIndustryBenchmarks(results.powerRating);
    this.benchmarkCache.set(cacheKey, benchmarkData);
    this.lastBenchmarkUpdate = new Date();

    return benchmarkData;
  }

  optimizeCosts(currentCosts: any): OptimizationSuggestions {
    const opportunities: OptimizationOpportunity[] = [];

    // Energy optimization
    if (currentCosts.energy > currentCosts.total * 0.25) {
      opportunities.push({
        category: 'Energy Efficiency',
        description: 'High energy costs detected - implement power optimization strategies',
        potentialSaving: currentCosts.energy * 0.15,
        difficulty: 'medium',
        implementationTime: '2-4 weeks',
        actions: [
          'Optimize cutting parameters for energy efficiency',
          'Implement power management systems',
          'Consider variable frequency drives',
          'Upgrade to more efficient laser sources'
        ]
      });
    }

    // Labor optimization
    if (currentCosts.labor > currentCosts.total * 0.40) {
      opportunities.push({
        category: 'Labor Efficiency',
        description: 'High labor costs - improve automation and workflow efficiency',
        potentialSaving: currentCosts.labor * 0.10,
        difficulty: 'high',
        implementationTime: '3-6 months',
        actions: [
          'Implement automated material handling',
          'Optimize job scheduling and batching',
          'Cross-train operators for flexibility',
          'Implement lean manufacturing principles'
        ]
      });
    }

    // Material optimization
    if (currentCosts.materials > currentCosts.total * 0.30) {
      opportunities.push({
        category: 'Material Efficiency',
        description: 'High material costs - optimize material usage and sourcing',
        potentialSaving: currentCosts.materials * 0.08,
        difficulty: 'low',
        implementationTime: '1-2 weeks',
        actions: [
          'Optimize nesting algorithms',
          'Negotiate better material pricing',
          'Implement material waste tracking',
          'Consider alternative materials'
        ]
      });
    }

    return { opportunities };
  }

  private calculateCostBreakdown(inputs: DirectCostInputs): CostBreakdown & { totalCost: number } {
    // Enhanced calculation with auxiliary system considerations
    const powerConsumption = (inputs.powerRating / 1000) * 1.35; // Include auxiliary systems
    const energyCost = powerConsumption * inputs.operatingHours * inputs.electricityRate;
    
    const laborCost = inputs.laborRate * inputs.operatingHours;
    const materialCost = inputs.materialCosts;
    const overheadCost = inputs.overheadRate * inputs.operatingHours;
    
    // Maintenance cost estimation (3-5% of equipment value per year)
    const maintenanceCost = (inputs.powerRating * 100) * 0.04 * (inputs.operatingHours / 8760);
    
    const totalCost = energyCost + laborCost + materialCost + overheadCost + maintenanceCost;

    return {
      energy: Math.round(energyCost * 100) / 100,
      labor: Math.round(laborCost * 100) / 100,
      materials: Math.round(materialCost * 100) / 100,
      overhead: Math.round(overheadCost * 100) / 100,
      maintenance: Math.round(maintenanceCost * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      percentages: {
        energy: Math.round((energyCost / totalCost) * 100),
        labor: Math.round((laborCost / totalCost) * 100),
        materials: Math.round((materialCost / totalCost) * 100),
        overhead: Math.round((overheadCost / totalCost) * 100),
        maintenance: Math.round((maintenanceCost / totalCost) * 100),
      },
    };
  }

  private generateBenchmarkComparison(hourlyRate: number, powerRating: number): BenchmarkComparison {
    const benchmarks = this.getIndustryBenchmarks(powerRating);
    
    let performance: BenchmarkComparison['currentPerformance'] = 'average';
    if (hourlyRate <= benchmarks.excellent) performance = 'excellent';
    else if (hourlyRate <= benchmarks.good) performance = 'good';
    else if (hourlyRate <= benchmarks.average) performance = 'average';
    else if (hourlyRate <= benchmarks.belowAverage) performance = 'below_average';
    else performance = 'poor';

    return {
      industryAverage: benchmarks.average,
      topQuartile: benchmarks.excellent,
      currentPerformance: performance,
      improvementPotential: Math.max(0, hourlyRate - benchmarks.excellent),
    };
  }

  private identifyOptimizationOpportunities(
    costBreakdown: CostBreakdown, 
    inputs: DirectCostInputs
  ): OptimizationOpportunity[] {
    const opportunities: OptimizationOpportunity[] = [];

    // Check each cost category for optimization potential
    Object.entries(costBreakdown.percentages).forEach(([category, percentage]) => {
      const thresholds = {
        energy: 25,
        labor: 40,
        materials: 30,
        overhead: 20,
        maintenance: 15,
      };

      if (percentage > thresholds[category as keyof typeof thresholds]) {
        opportunities.push(this.generateOptimizationOpportunity(category, percentage, costBreakdown));
      }
    });

    return opportunities;
  }

  private generateOptimizationOpportunity(
    category: string, 
    percentage: number, 
    costBreakdown: CostBreakdown
  ): OptimizationOpportunity {
    const categoryData = {
      energy: {
        description: 'High energy consumption detected',
        difficulty: 'medium' as const,
        implementationTime: '2-4 weeks',
        savingRate: 0.15,
        actions: ['Optimize cutting parameters', 'Implement power management', 'Upgrade equipment']
      },
      labor: {
        description: 'High labor costs detected',
        difficulty: 'high' as const,
        implementationTime: '3-6 months',
        savingRate: 0.10,
        actions: ['Increase automation', 'Optimize workflows', 'Cross-train operators']
      },
      materials: {
        description: 'High material costs detected',
        difficulty: 'low' as const,
        implementationTime: '1-2 weeks',
        savingRate: 0.08,
        actions: ['Optimize nesting', 'Negotiate pricing', 'Reduce waste']
      },
      overhead: {
        description: 'High overhead allocation detected',
        difficulty: 'medium' as const,
        implementationTime: '4-8 weeks',
        savingRate: 0.12,
        actions: ['Review allocation methods', 'Optimize facility usage', 'Reduce fixed costs']
      },
      maintenance: {
        description: 'High maintenance costs detected',
        difficulty: 'medium' as const,
        implementationTime: '2-6 weeks',
        savingRate: 0.20,
        actions: ['Implement preventive maintenance', 'Operator training', 'Parts optimization']
      },
    };

    const data = categoryData[category as keyof typeof categoryData];
    const categoryValue = costBreakdown[category as keyof CostBreakdown] as number;

    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      description: data.description,
      potentialSaving: Math.round(categoryValue * data.savingRate * 100) / 100,
      difficulty: data.difficulty,
      implementationTime: data.implementationTime,
      actions: data.actions,
    };
  }

  private getIndustryBenchmarks(powerRating: number) {
    // Industry benchmarks by power range (hourly rates in USD)
    if (powerRating < 2000) {
      return { excellent: 35, good: 45, average: 55, belowAverage: 65 };
    } else if (powerRating < 6000) {
      return { excellent: 50, good: 65, average: 80, belowAverage: 95 };
    } else {
      return { excellent: 65, good: 85, average: 105, belowAverage: 125 };
    }
  }

  private fetchIndustryBenchmarks(powerRating: number): BenchmarkData {
    // Simulated industry benchmark data
    const benchmarks = this.getIndustryBenchmarks(powerRating);
    
    return {
      industryBenchmarks: [
        {
          metric: 'Hourly Operating Cost',
          value: benchmarks.average,
          unit: 'USD/hour',
          source: 'Industry Survey 2024',
          lastUpdated: new Date(),
        },
        {
          metric: 'Energy Efficiency',
          value: 0.75,
          unit: 'kWh/part',
          source: 'Manufacturing Excellence Report',
          lastUpdated: new Date(),
        },
      ],
      performanceMetrics: [
        {
          name: 'Cost Efficiency',
          current: 0,
          target: benchmarks.good,
          benchmark: benchmarks.excellent,
          trend: 'stable',
        },
      ],
      competitivePosition: {
        percentile: 50,
        ranking: 'Average',
        gapToLeader: 0,
        strengthAreas: [],
        improvementAreas: [],
      },
    };
  }
}

export interface OptimizationSuggestions {
  opportunities: OptimizationOpportunity[];
}

// Export singleton instance
export const costCalculationEngine = new EnhancedCostCalculationEngine();
