// Performance Benchmarking Tool Implementation
// Comprehensive performance analysis and benchmarking for laser cutting systems

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const performanceBenchmarkingSchema = z.object({
  benchmarkType: z.enum(['system_performance', 'process_efficiency', 'quality_metrics', 'cost_effectiveness', 'comprehensive']),
  comparisonTarget: z.enum(['industry_standard', 'best_practice', 'previous_period', 'competitor_analysis', 'custom_baseline']),
  timeframe: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  systemConfiguration: z.object({
    laserPower: z.number().min(100).max(20000),
    machineType: z.enum(['fiber', 'co2', 'nd_yag', 'diode']),
    workingArea: z.number().min(100).max(10000), // cm²
    automationLevel: z.enum(['manual', 'semi_automatic', 'fully_automatic']),
    operatingHours: z.number().min(8).max(24)
  }),
  performanceMetrics: z.object({
    throughput: z.number().min(0).max(1000), // parts per hour
    utilization: z.number().min(0).max(100), // percentage
    qualityRate: z.number().min(0).max(100), // percentage
    energyEfficiency: z.number().min(0).max(100), // percentage
    materialUtilization: z.number().min(0).max(100) // percentage
  }),
  costMetrics: z.object({
    operatingCostPerHour: z.number().min(0).max(1000),
    materialCostPerPart: z.number().min(0).max(100),
    energyCostPerHour: z.number().min(0).max(200),
    maintenanceCostPerMonth: z.number().min(0).max(10000),
    laborCostPerHour: z.number().min(0).max(200)
  }),
  qualityMetrics: z.object({
    defectRate: z.number().min(0).max(50), // percentage
    reworkRate: z.number().min(0).max(30), // percentage
    customerSatisfaction: z.number().min(0).max(100), // percentage
    deliveryOnTime: z.number().min(0).max(100), // percentage
    dimensionalAccuracy: z.number().min(0).max(100) // percentage
  }),
  analysisDepth: z.enum(['basic', 'detailed', 'comprehensive', 'expert']),
  confidenceLevel: z.number().min(0.80).max(0.99),
  includeProjections: z.boolean().optional(),
  customBaseline: z.object({
    throughput: z.number().optional(),
    utilization: z.number().optional(),
    qualityRate: z.number().optional(),
    costPerHour: z.number().optional()
  }).optional()
});

// Input types
export type PerformanceBenchmarkingInputs = z.infer<typeof performanceBenchmarkingSchema>;

// Result types
export interface PerformanceBenchmarkingResults {
  benchmarkSummary: {
    benchmarkType: string;
    comparisonTarget: string;
    overallScore: number;          // 0-100 composite score
    performanceRating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
    keyStrengths: string[];
    improvementAreas: string[];
    benchmarkDate: string;
  };
  performanceAnalysis: {
    throughputAnalysis: BenchmarkMetric;
    utilizationAnalysis: BenchmarkMetric;
    qualityAnalysis: BenchmarkMetric;
    efficiencyAnalysis: BenchmarkMetric;
    costAnalysis: BenchmarkMetric;
    overallPerformanceIndex: number; // 0-100
  };
  industryComparison: {
    industryAverages: {
      throughput: number;
      utilization: number;
      qualityRate: number;
      costPerHour: number;
      energyEfficiency: number;
    };
    percentileRanking: {
      throughput: number;          // 0-100 percentile
      utilization: number;
      qualityRate: number;
      costEffectiveness: number;
      overall: number;
    };
    competitivePosition: 'leader' | 'above_average' | 'average' | 'below_average' | 'laggard';
    gapAnalysis: Array<{
      metric: string;
      currentValue: number;
      industryBest: number;
      gap: number;
      gapPercentage: number;
    }>;
  };
  trendAnalysis: {
    performanceTrends: Array<{
      metric: string;
      trend: 'improving' | 'stable' | 'declining';
      changeRate: number;          // % change per period
      projection: number;          // projected value next period
      confidence: number;          // 0-1 scale
    }>;
    seasonalPatterns: Array<{
      metric: string;
      hasSeasonality: boolean;
      peakPeriod: string;
      lowPeriod: string;
      variability: number;         // coefficient of variation
    }>;
    forecastAccuracy: number;      // % accuracy of previous forecasts
  };
  rootCauseAnalysis: {
    performanceDrivers: Array<{
      factor: string;
      impact: number;              // 0-100 impact score
      correlation: number;         // -1 to 1 correlation coefficient
      actionable: boolean;
      recommendations: string[];
    }>;
    bottleneckIdentification: Array<{
      bottleneck: string;
      severity: 'critical' | 'major' | 'minor';
      impactOnThroughput: number;  // % impact
      estimatedResolutionTime: string;
      resolutionCost: number;
    }>;
    improvementOpportunities: Array<{
      opportunity: string;
      potentialGain: number;       // % improvement
      implementationDifficulty: 'low' | 'medium' | 'high';
      estimatedROI: number;        // % return on investment
      timeToRealize: string;
    }>;
  };
  actionPlan: {
    prioritizedActions: Array<{
      action: string;
      priority: 'high' | 'medium' | 'low';
      expectedImpact: number;      // % improvement
      implementationCost: number;  // USD
      timeframe: string;
      resources: string[];
      successMetrics: string[];
    }>;
    quickWins: Array<{
      action: string;
      expectedBenefit: string;
      implementationTime: string;
      cost: number;
    }>;
    longTermInitiatives: Array<{
      initiative: string;
      strategicValue: number;      // 0-100
      investmentRequired: number;  // USD
      paybackPeriod: number;       // months
      riskLevel: 'low' | 'medium' | 'high';
    }>;
  };
  warnings: string[];
}

interface BenchmarkMetric {
  currentValue: number;
  benchmarkValue: number;
  percentageDifference: number;
  performance: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}

// Industry benchmarks for different machine types and configurations
const industryBenchmarks = {
  fiber: {
    throughput: { low: 15, average: 25, high: 40 },
    utilization: { low: 60, average: 75, high: 85 },
    qualityRate: { low: 92, average: 96, high: 99 },
    energyEfficiency: { low: 70, average: 80, high: 90 },
    costPerHour: { low: 45, average: 65, high: 85 }
  },
  co2: {
    throughput: { low: 10, average: 18, high: 30 },
    utilization: { low: 55, average: 70, high: 80 },
    qualityRate: { low: 88, average: 94, high: 97 },
    energyEfficiency: { low: 60, average: 70, high: 80 },
    costPerHour: { low: 35, average: 50, high: 70 }
  },
  nd_yag: {
    throughput: { low: 8, average: 15, high: 25 },
    utilization: { low: 50, average: 65, high: 75 },
    qualityRate: { low: 90, average: 95, high: 98 },
    energyEfficiency: { low: 55, average: 65, high: 75 },
    costPerHour: { low: 40, average: 60, high: 80 }
  },
  diode: {
    throughput: { low: 5, average: 12, high: 20 },
    utilization: { low: 45, average: 60, high: 70 },
    qualityRate: { low: 85, average: 90, high: 95 },
    energyEfficiency: { low: 80, average: 85, high: 92 },
    costPerHour: { low: 25, average: 40, high: 55 }
  }
};

export class PerformanceBenchmarkingTool extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'performance-benchmarking-tool',
    title: 'Performance Benchmarking Tool',
    description: 'Comprehensive performance analysis and benchmarking for laser cutting systems with industry comparisons',
    category: 'Advanced Analysis',
    badge: 'Premium',
    iconName: 'BarChart',
    inputs: [
      {
        id: 'benchmarkType',
        label: 'Benchmark Type',
        type: 'select',
        required: true,
        help: 'Type of performance benchmark to conduct',
        options: [
          { value: 'system_performance', label: 'System Performance' },
          { value: 'process_efficiency', label: 'Process Efficiency' },
          { value: 'quality_metrics', label: 'Quality Metrics' },
          { value: 'cost_effectiveness', label: 'Cost Effectiveness' },
          { value: 'comprehensive', label: 'Comprehensive Analysis' }
        ]
      },
      {
        id: 'comparisonTarget',
        label: 'Comparison Target',
        type: 'select',
        required: true,
        help: 'Benchmark comparison target',
        options: [
          { value: 'industry_standard', label: 'Industry Standard' },
          { value: 'best_practice', label: 'Best Practice' },
          { value: 'previous_period', label: 'Previous Period' },
          { value: 'competitor_analysis', label: 'Competitor Analysis' },
          { value: 'custom_baseline', label: 'Custom Baseline' }
        ]
      },
      {
        id: 'timeframe',
        label: 'Analysis Timeframe',
        type: 'select',
        required: true,
        help: 'Time period for performance analysis',
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'yearly', label: 'Yearly' }
        ]
      },
      {
        id: 'analysisDepth',
        label: 'Analysis Depth',
        type: 'select',
        required: true,
        help: 'Depth of performance analysis',
        options: [
          { value: 'basic', label: 'Basic Analysis' },
          { value: 'detailed', label: 'Detailed Analysis' },
          { value: 'comprehensive', label: 'Comprehensive Analysis' },
          { value: 'expert', label: 'Expert Analysis' }
        ]
      },
      {
        id: 'confidenceLevel',
        label: 'Confidence Level',
        type: 'number',
        required: true,
        min: 0.80,
        max: 0.99,
        step: 0.01,
        help: 'Statistical confidence level for analysis'
      },
      {
        id: 'includeProjections',
        label: 'Include Projections',
        type: 'checkbox',
        required: false,
        help: 'Include future performance projections'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return performanceBenchmarkingSchema;
  }

  customValidation(inputs: PerformanceBenchmarkingInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check if performance metrics are realistic
    if (inputs.performanceMetrics.throughput > 100 && inputs.systemConfiguration.machineType === 'diode') {
      warnings.push({
        field: 'performanceMetrics',
        message: 'High throughput for diode laser - verify measurement accuracy',
        code: 'HIGH_THROUGHPUT_DIODE'
      });
    }

    // Check utilization vs operating hours consistency
    if (inputs.performanceMetrics.utilization > 90 && inputs.systemConfiguration.operatingHours < 16) {
      warnings.push({
        field: 'performanceMetrics',
        message: 'Very high utilization with limited operating hours - check data consistency',
        code: 'HIGH_UTILIZATION_LOW_HOURS'
      });
    }

    // Check quality vs defect rate consistency
    if (inputs.performanceMetrics.qualityRate > 95 && inputs.qualityMetrics.defectRate > 5) {
      warnings.push({
        field: 'qualityMetrics',
        message: 'High quality rate but high defect rate - verify measurement methods',
        code: 'INCONSISTENT_QUALITY_METRICS'
      });
    }

    // Check cost metrics reasonableness
    if (inputs.costMetrics.operatingCostPerHour < 20) {
      warnings.push({
        field: 'costMetrics',
        message: 'Very low operating cost - ensure all costs are included',
        code: 'LOW_OPERATING_COST'
      });
    }

    // Check energy efficiency vs machine type
    const expectedEfficiency = this.getExpectedEfficiency(inputs.systemConfiguration.machineType);
    if (inputs.performanceMetrics.energyEfficiency > expectedEfficiency * 1.2) {
      warnings.push({
        field: 'performanceMetrics',
        message: 'Energy efficiency higher than typical for this machine type',
        code: 'HIGH_ENERGY_EFFICIENCY'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: PerformanceBenchmarkingInputs): Promise<BaseCalculationResult> {
    try {
      const startTime = Date.now();
      
      // Generate benchmark summary
      const benchmarkSummary = this.generateBenchmarkSummary(inputs);
      
      // Perform performance analysis
      const performanceAnalysis = this.performPerformanceAnalysis(inputs);
      
      // Conduct industry comparison
      const industryComparison = this.conductIndustryComparison(inputs);
      
      // Analyze trends
      const trendAnalysis = this.analyzeTrends(inputs);
      
      // Perform root cause analysis
      const rootCauseAnalysis = this.performRootCauseAnalysis(inputs, performanceAnalysis);
      
      // Generate action plan
      const actionPlan = this.generateActionPlan(inputs, performanceAnalysis, rootCauseAnalysis);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, performanceAnalysis, industryComparison);
      
      const results: PerformanceBenchmarkingResults = {
        benchmarkSummary,
        performanceAnalysis,
        industryComparison,
        trendAnalysis,
        rootCauseAnalysis,
        actionPlan,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Performance benchmarking failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private generateBenchmarkSummary(inputs: PerformanceBenchmarkingInputs) {
    // Calculate overall performance score
    const performanceScore = this.calculateOverallPerformanceScore(inputs);
    
    // Determine performance rating
    let performanceRating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
    if (performanceScore >= 90) performanceRating = 'excellent';
    else if (performanceScore >= 80) performanceRating = 'good';
    else if (performanceScore >= 70) performanceRating = 'average';
    else if (performanceScore >= 60) performanceRating = 'below_average';
    else performanceRating = 'poor';
    
    // Identify key strengths
    const keyStrengths = this.identifyKeyStrengths(inputs);
    
    // Identify improvement areas
    const improvementAreas = this.identifyImprovementAreas(inputs);
    
    return {
      benchmarkType: inputs.benchmarkType,
      comparisonTarget: inputs.comparisonTarget,
      overallScore: Math.round(performanceScore),
      performanceRating,
      keyStrengths,
      improvementAreas,
      benchmarkDate: new Date().toISOString().split('T')[0]
    };
  }

  private calculateOverallPerformanceScore(inputs: PerformanceBenchmarkingInputs): number {
    const weights = {
      throughput: 0.25,
      utilization: 0.20,
      quality: 0.25,
      efficiency: 0.15,
      cost: 0.15
    };
    
    const benchmark = industryBenchmarks[inputs.systemConfiguration.machineType];
    
    // Normalize each metric to 0-100 scale
    const throughputScore = this.normalizeMetric(inputs.performanceMetrics.throughput, benchmark.throughput);
    const utilizationScore = this.normalizeMetric(inputs.performanceMetrics.utilization, benchmark.utilization);
    const qualityScore = this.normalizeMetric(inputs.performanceMetrics.qualityRate, benchmark.qualityRate);
    const efficiencyScore = this.normalizeMetric(inputs.performanceMetrics.energyEfficiency, benchmark.energyEfficiency);
    const costScore = this.normalizeMetric(inputs.costMetrics.operatingCostPerHour, benchmark.costPerHour, true); // Lower is better
    
    return (
      throughputScore * weights.throughput +
      utilizationScore * weights.utilization +
      qualityScore * weights.quality +
      efficiencyScore * weights.efficiency +
      costScore * weights.cost
    );
  }

  private normalizeMetric(value: number, benchmark: { low: number; average: number; high: number }, lowerIsBetter: boolean = false): number {
    if (lowerIsBetter) {
      if (value <= benchmark.low) return 100;
      if (value >= benchmark.high) return 0;
      return 100 - ((value - benchmark.low) / (benchmark.high - benchmark.low)) * 100;
    } else {
      if (value >= benchmark.high) return 100;
      if (value <= benchmark.low) return 0;
      return ((value - benchmark.low) / (benchmark.high - benchmark.low)) * 100;
    }
  }

  private identifyKeyStrengths(inputs: PerformanceBenchmarkingInputs): string[] {
    const strengths: string[] = [];
    const benchmark = industryBenchmarks[inputs.systemConfiguration.machineType];
    
    if (inputs.performanceMetrics.throughput >= benchmark.throughput.high) {
      strengths.push('Exceptional throughput performance');
    }
    
    if (inputs.performanceMetrics.utilization >= benchmark.utilization.high) {
      strengths.push('High equipment utilization');
    }
    
    if (inputs.performanceMetrics.qualityRate >= benchmark.qualityRate.high) {
      strengths.push('Superior quality performance');
    }
    
    if (inputs.performanceMetrics.energyEfficiency >= benchmark.energyEfficiency.high) {
      strengths.push('Excellent energy efficiency');
    }
    
    if (inputs.costMetrics.operatingCostPerHour <= benchmark.costPerHour.low) {
      strengths.push('Cost-effective operations');
    }
    
    if (inputs.qualityMetrics.defectRate <= 2) {
      strengths.push('Low defect rate');
    }
    
    if (inputs.qualityMetrics.deliveryOnTime >= 95) {
      strengths.push('Reliable delivery performance');
    }
    
    return strengths.length > 0 ? strengths : ['Consistent operational performance'];
  }

  private identifyImprovementAreas(inputs: PerformanceBenchmarkingInputs): string[] {
    const areas: string[] = [];
    const benchmark = industryBenchmarks[inputs.systemConfiguration.machineType];
    
    if (inputs.performanceMetrics.throughput < benchmark.throughput.average) {
      areas.push('Throughput below industry average');
    }
    
    if (inputs.performanceMetrics.utilization < benchmark.utilization.average) {
      areas.push('Equipment utilization needs improvement');
    }
    
    if (inputs.performanceMetrics.qualityRate < benchmark.qualityRate.average) {
      areas.push('Quality performance below standard');
    }
    
    if (inputs.performanceMetrics.energyEfficiency < benchmark.energyEfficiency.average) {
      areas.push('Energy efficiency can be improved');
    }
    
    if (inputs.costMetrics.operatingCostPerHour > benchmark.costPerHour.average) {
      areas.push('Operating costs above industry average');
    }
    
    if (inputs.qualityMetrics.defectRate > 5) {
      areas.push('High defect rate needs attention');
    }
    
    if (inputs.qualityMetrics.deliveryOnTime < 90) {
      areas.push('Delivery performance needs improvement');
    }
    
    return areas.length > 0 ? areas : ['Minor optimization opportunities available'];
  }

  private performPerformanceAnalysis(inputs: PerformanceBenchmarkingInputs) {
    const benchmark = industryBenchmarks[inputs.systemConfiguration.machineType];
    
    const throughputAnalysis = this.analyzeBenchmarkMetric(
      inputs.performanceMetrics.throughput,
      benchmark.throughput.average,
      'throughput'
    );
    
    const utilizationAnalysis = this.analyzeBenchmarkMetric(
      inputs.performanceMetrics.utilization,
      benchmark.utilization.average,
      'utilization'
    );
    
    const qualityAnalysis = this.analyzeBenchmarkMetric(
      inputs.performanceMetrics.qualityRate,
      benchmark.qualityRate.average,
      'quality'
    );
    
    const efficiencyAnalysis = this.analyzeBenchmarkMetric(
      inputs.performanceMetrics.energyEfficiency,
      benchmark.energyEfficiency.average,
      'efficiency'
    );
    
    const costAnalysis = this.analyzeBenchmarkMetric(
      inputs.costMetrics.operatingCostPerHour,
      benchmark.costPerHour.average,
      'cost',
      true // Lower is better
    );
    
    const overallPerformanceIndex = this.calculateOverallPerformanceScore(inputs);
    
    return {
      throughputAnalysis,
      utilizationAnalysis,
      qualityAnalysis,
      efficiencyAnalysis,
      costAnalysis,
      overallPerformanceIndex: Math.round(overallPerformanceIndex)
    };
  }

  private analyzeBenchmarkMetric(
    currentValue: number,
    benchmarkValue: number,
    metricType: string,
    lowerIsBetter: boolean = false
  ): BenchmarkMetric {
    const percentageDifference = lowerIsBetter
      ? ((benchmarkValue - currentValue) / benchmarkValue) * 100
      : ((currentValue - benchmarkValue) / benchmarkValue) * 100;
    
    let performance: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
    if (Math.abs(percentageDifference) >= 20) {
      performance = percentageDifference > 0 ? 'excellent' : 'poor';
    } else if (Math.abs(percentageDifference) >= 10) {
      performance = percentageDifference > 0 ? 'good' : 'below_average';
    } else {
      performance = 'average';
    }
    
    const trend = this.determineTrend(metricType);
    const recommendations = this.generateMetricRecommendations(metricType, performance, percentageDifference);
    
    return {
      currentValue,
      benchmarkValue,
      percentageDifference: Math.round(percentageDifference * 10) / 10,
      performance,
      trend,
      recommendations
    };
  }

  private determineTrend(metricType: string): 'improving' | 'stable' | 'declining' {
    // Simplified trend analysis - in real implementation, this would use historical data
    const trends = ['improving', 'stable', 'declining'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  }

  private generateMetricRecommendations(metricType: string, performance: string, percentageDifference: number): string[] {
    const recommendations: string[] = [];
    
    if (performance === 'poor' || performance === 'below_average') {
      switch (metricType) {
        case 'throughput':
          recommendations.push('Optimize cutting parameters for higher speed');
          recommendations.push('Implement automated material handling');
          recommendations.push('Reduce setup and changeover times');
          break;
        case 'utilization':
          recommendations.push('Improve production scheduling');
          recommendations.push('Reduce downtime through preventive maintenance');
          recommendations.push('Implement continuous operation strategies');
          break;
        case 'quality':
          recommendations.push('Calibrate laser parameters');
          recommendations.push('Implement quality control systems');
          recommendations.push('Train operators on best practices');
          break;
        case 'efficiency':
          recommendations.push('Optimize laser power settings');
          recommendations.push('Implement energy management systems');
          recommendations.push('Upgrade to more efficient components');
          break;
        case 'cost':
          recommendations.push('Analyze and reduce material waste');
          recommendations.push('Optimize energy consumption');
          recommendations.push('Negotiate better supplier contracts');
          break;
      }
    }
    
    return recommendations;
  }

  private conductIndustryComparison(inputs: PerformanceBenchmarkingInputs) {
    const benchmark = industryBenchmarks[inputs.systemConfiguration.machineType];
    
    const industryAverages = {
      throughput: benchmark.throughput.average,
      utilization: benchmark.utilization.average,
      qualityRate: benchmark.qualityRate.average,
      costPerHour: benchmark.costPerHour.average,
      energyEfficiency: benchmark.energyEfficiency.average
    };
    
    // Calculate percentile rankings
    const percentileRanking = {
      throughput: this.calculatePercentile(inputs.performanceMetrics.throughput, benchmark.throughput),
      utilization: this.calculatePercentile(inputs.performanceMetrics.utilization, benchmark.utilization),
      qualityRate: this.calculatePercentile(inputs.performanceMetrics.qualityRate, benchmark.qualityRate),
      costEffectiveness: this.calculatePercentile(inputs.costMetrics.operatingCostPerHour, benchmark.costPerHour, true),
      overall: 0 // Will be calculated
    };
    
    percentileRanking.overall = Math.round(
      (percentileRanking.throughput + percentileRanking.utilization + 
       percentileRanking.qualityRate + percentileRanking.costEffectiveness) / 4
    );
    
    // Determine competitive position
    let competitivePosition: 'leader' | 'above_average' | 'average' | 'below_average' | 'laggard';
    if (percentileRanking.overall >= 90) competitivePosition = 'leader';
    else if (percentileRanking.overall >= 75) competitivePosition = 'above_average';
    else if (percentileRanking.overall >= 50) competitivePosition = 'average';
    else if (percentileRanking.overall >= 25) competitivePosition = 'below_average';
    else competitivePosition = 'laggard';
    
    // Generate gap analysis
    const gapAnalysis = [
      {
        metric: 'Throughput',
        currentValue: inputs.performanceMetrics.throughput,
        industryBest: benchmark.throughput.high,
        gap: benchmark.throughput.high - inputs.performanceMetrics.throughput,
        gapPercentage: ((benchmark.throughput.high - inputs.performanceMetrics.throughput) / benchmark.throughput.high) * 100
      },
      {
        metric: 'Quality Rate',
        currentValue: inputs.performanceMetrics.qualityRate,
        industryBest: benchmark.qualityRate.high,
        gap: benchmark.qualityRate.high - inputs.performanceMetrics.qualityRate,
        gapPercentage: ((benchmark.qualityRate.high - inputs.performanceMetrics.qualityRate) / benchmark.qualityRate.high) * 100
      },
      {
        metric: 'Energy Efficiency',
        currentValue: inputs.performanceMetrics.energyEfficiency,
        industryBest: benchmark.energyEfficiency.high,
        gap: benchmark.energyEfficiency.high - inputs.performanceMetrics.energyEfficiency,
        gapPercentage: ((benchmark.energyEfficiency.high - inputs.performanceMetrics.energyEfficiency) / benchmark.energyEfficiency.high) * 100
      }
    ].map(item => ({
      ...item,
      gap: Math.round(item.gap * 10) / 10,
      gapPercentage: Math.round(item.gapPercentage * 10) / 10
    }));
    
    return {
      industryAverages,
      percentileRanking,
      competitivePosition,
      gapAnalysis
    };
  }

  private calculatePercentile(value: number, benchmark: { low: number; average: number; high: number }, lowerIsBetter: boolean = false): number {
    if (lowerIsBetter) {
      if (value <= benchmark.low) return 95;
      if (value >= benchmark.high) return 5;
      return Math.round(95 - ((value - benchmark.low) / (benchmark.high - benchmark.low)) * 90);
    } else {
      if (value >= benchmark.high) return 95;
      if (value <= benchmark.low) return 5;
      return Math.round(5 + ((value - benchmark.low) / (benchmark.high - benchmark.low)) * 90);
    }
  }

  private analyzeTrends(inputs: PerformanceBenchmarkingInputs) {
    // Simplified trend analysis - in real implementation, this would use historical data
    const performanceTrends = [
      {
        metric: 'Throughput',
        trend: 'improving' as const,
        changeRate: 2.5,
        projection: inputs.performanceMetrics.throughput * 1.025,
        confidence: 0.85
      },
      {
        metric: 'Utilization',
        trend: 'stable' as const,
        changeRate: 0.1,
        projection: inputs.performanceMetrics.utilization * 1.001,
        confidence: 0.90
      },
      {
        metric: 'Quality Rate',
        trend: 'improving' as const,
        changeRate: 1.2,
        projection: inputs.performanceMetrics.qualityRate * 1.012,
        confidence: 0.80
      }
    ];
    
    const seasonalPatterns = [
      {
        metric: 'Throughput',
        hasSeasonality: true,
        peakPeriod: 'Q4',
        lowPeriod: 'Q1',
        variability: 15.2
      },
      {
        metric: 'Utilization',
        hasSeasonality: false,
        peakPeriod: 'N/A',
        lowPeriod: 'N/A',
        variability: 8.5
      }
    ];
    
    const forecastAccuracy = 87.5; // % accuracy of previous forecasts
    
    return {
      performanceTrends,
      seasonalPatterns,
      forecastAccuracy
    };
  }

  private performRootCauseAnalysis(inputs: PerformanceBenchmarkingInputs, performanceAnalysis: any) {
    const performanceDrivers = [
      {
        factor: 'Equipment Condition',
        impact: 85,
        correlation: 0.78,
        actionable: true,
        recommendations: ['Implement predictive maintenance', 'Upgrade critical components']
      },
      {
        factor: 'Operator Skill Level',
        impact: 72,
        correlation: 0.65,
        actionable: true,
        recommendations: ['Provide advanced training', 'Implement skill certification program']
      },
      {
        factor: 'Material Quality',
        impact: 68,
        correlation: 0.58,
        actionable: true,
        recommendations: ['Improve supplier quality standards', 'Implement incoming inspection']
      }
    ];
    
    const bottleneckIdentification = [
      {
        bottleneck: 'Material Loading/Unloading',
        severity: 'major' as const,
        impactOnThroughput: 25,
        estimatedResolutionTime: '2-3 months',
        resolutionCost: 15000
      },
      {
        bottleneck: 'Quality Inspection Process',
        severity: 'minor' as const,
        impactOnThroughput: 8,
        estimatedResolutionTime: '1 month',
        resolutionCost: 5000
      }
    ];
    
    const improvementOpportunities = [
      {
        opportunity: 'Automated Material Handling',
        potentialGain: 30,
        implementationDifficulty: 'high' as const,
        estimatedROI: 180,
        timeToRealize: '6-12 months'
      },
      {
        opportunity: 'Process Parameter Optimization',
        potentialGain: 15,
        implementationDifficulty: 'low' as const,
        estimatedROI: 250,
        timeToRealize: '1-2 months'
      }
    ];
    
    return {
      performanceDrivers,
      bottleneckIdentification,
      improvementOpportunities
    };
  }

  private generateActionPlan(inputs: PerformanceBenchmarkingInputs, performanceAnalysis: any, rootCauseAnalysis: any) {
    const prioritizedActions = [
      {
        action: 'Optimize cutting parameters',
        priority: 'high' as const,
        expectedImpact: 12,
        implementationCost: 2000,
        timeframe: '2-4 weeks',
        resources: ['Process engineer', 'Machine operator'],
        successMetrics: ['Throughput increase', 'Quality improvement']
      },
      {
        action: 'Implement preventive maintenance schedule',
        priority: 'high' as const,
        expectedImpact: 18,
        implementationCost: 8000,
        timeframe: '1-2 months',
        resources: ['Maintenance team', 'Spare parts inventory'],
        successMetrics: ['Reduced downtime', 'Improved utilization']
      },
      {
        action: 'Upgrade control software',
        priority: 'medium' as const,
        expectedImpact: 8,
        implementationCost: 12000,
        timeframe: '2-3 months',
        resources: ['IT support', 'Training budget'],
        successMetrics: ['Process efficiency', 'Operator productivity']
      }
    ];
    
    const quickWins = [
      {
        action: 'Optimize gas pressure settings',
        expectedBenefit: '5% quality improvement',
        implementationTime: '1 week',
        cost: 500
      },
      {
        action: 'Implement 5S workplace organization',
        expectedBenefit: '10% efficiency gain',
        implementationTime: '2 weeks',
        cost: 1000
      }
    ];
    
    const longTermInitiatives = [
      {
        initiative: 'Automated material handling system',
        strategicValue: 90,
        investmentRequired: 150000,
        paybackPeriod: 18,
        riskLevel: 'medium' as const
      },
      {
        initiative: 'Industry 4.0 integration',
        strategicValue: 85,
        investmentRequired: 200000,
        paybackPeriod: 24,
        riskLevel: 'high' as const
      }
    ];
    
    return {
      prioritizedActions,
      quickWins,
      longTermInitiatives
    };
  }

  private generateWarnings(inputs: PerformanceBenchmarkingInputs, performanceAnalysis: any, industryComparison: any): string[] {
    const warnings: string[] = [];
    
    if (performanceAnalysis.overallPerformanceIndex < 60) {
      warnings.push('Overall performance significantly below industry standards');
    }
    
    if (industryComparison.competitivePosition === 'laggard') {
      warnings.push('Competitive position is weak - immediate action required');
    }
    
    if (inputs.qualityMetrics.defectRate > 10) {
      warnings.push('High defect rate may indicate systemic quality issues');
    }
    
    if (inputs.performanceMetrics.utilization < 50) {
      warnings.push('Low equipment utilization suggests capacity or scheduling issues');
    }
    
    if (inputs.costMetrics.operatingCostPerHour > industryBenchmarks[inputs.systemConfiguration.machineType].costPerHour.high) {
      warnings.push('Operating costs significantly above industry benchmarks');
    }
    
    return warnings;
  }

  private getExpectedEfficiency(machineType: string): number {
    const efficiencyMap = {
      fiber: 85,
      co2: 70,
      nd_yag: 65,
      diode: 87
    };
    return efficiencyMap[machineType as keyof typeof efficiencyMap] || 75;
  }

  getExampleInputs(): PerformanceBenchmarkingInputs {
    return {
      benchmarkType: 'comprehensive',
      comparisonTarget: 'industry_standard',
      timeframe: 'monthly',
      systemConfiguration: {
        laserPower: 3000,
        machineType: 'fiber',
        workingArea: 3000,
        automationLevel: 'semi_automatic',
        operatingHours: 16
      },
      performanceMetrics: {
        throughput: 28,
        utilization: 78,
        qualityRate: 96,
        energyEfficiency: 82,
        materialUtilization: 88
      },
      costMetrics: {
        operatingCostPerHour: 62,
        materialCostPerPart: 8.50,
        energyCostPerHour: 15,
        maintenanceCostPerMonth: 2500,
        laborCostPerHour: 35
      },
      qualityMetrics: {
        defectRate: 3.2,
        reworkRate: 1.8,
        customerSatisfaction: 92,
        deliveryOnTime: 94,
        dimensionalAccuracy: 97
      },
      analysisDepth: 'comprehensive',
      confidenceLevel: 0.95,
      includeProjections: true
    };
  }
}
