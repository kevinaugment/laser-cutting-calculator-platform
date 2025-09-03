/**
 * Advanced Cost Analytics Engine
 * Provides comprehensive cost analysis, trend prediction, and variance reporting
 * Enhanced with machine learning capabilities and predictive modeling
 */

export interface CostAnalyticsEngine {
  analyzeCostTrends(data: CostData[], period: TimePeriod): TrendAnalysis;
  generateVarianceReport(budget: Budget, actual: ActualCosts): VarianceReport;
  predictCosts(historicalData: CostData[], forecastPeriod: number): CostForecast;
  performBudgetComparison(budget: Budget, actual: ActualCosts): BudgetComparison;
  identifyAnomalies(data: CostData[]): CostAnomaly[];
  generateCostOptimizationRecommendations(data: CostData[]): OptimizationRecommendation[];
  performRootCauseAnalysis(variance: Variance): RootCauseAnalysis;
  calculateCostElasticity(data: CostData[]): ElasticityAnalysis;
  generatePredictiveInsights(data: CostData[]): PredictiveInsight[];
}

export interface CostData {
  timestamp: Date;
  totalCost: number;
  energyCost: number;
  laborCost: number;
  materialCost: number;
  overheadCost: number;
  maintenanceCost: number;
  volume: number;
  efficiency: number;
}

export interface TimePeriod {
  start: Date;
  end: Date;
  granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface TrendAnalysis {
  overallTrend: Trend;
  categoryTrends: CategoryTrend[];
  seasonalPatterns: SeasonalPattern[];
  correlations: Correlation[];
  insights: TrendInsight[];
}

export interface Trend {
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  magnitude: number;
  confidence: number;
  r2: number;
  equation: string;
}

export interface CategoryTrend {
  category: string;
  trend: Trend;
  contribution: number;
  volatility: number;
}

export interface SeasonalPattern {
  pattern: string;
  strength: number;
  period: string;
  peaks: Date[];
  troughs: Date[];
}

export interface Correlation {
  variable1: string;
  variable2: string;
  coefficient: number;
  significance: number;
  relationship: string;
}

export interface TrendInsight {
  type: 'opportunity' | 'risk' | 'pattern' | 'anomaly';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  confidence: number;
}

// Enhanced interfaces for advanced analytics
export interface OptimizationRecommendation {
  id: string;
  category: 'cost_reduction' | 'efficiency_improvement' | 'process_optimization' | 'resource_allocation';
  title: string;
  description: string;
  potentialSaving: number;
  implementationCost: number;
  paybackPeriod: number; // in months
  difficulty: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actions: string[];
  kpis: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface RootCauseAnalysis {
  variance: Variance;
  primaryCauses: CauseAnalysis[];
  contributingFactors: ContributingFactor[];
  correlatedEvents: CorrelatedEvent[];
  recommendations: string[];
  confidence: number;
}

export interface CauseAnalysis {
  cause: string;
  category: 'operational' | 'market' | 'technical' | 'human' | 'external';
  impact: number; // percentage contribution to variance
  evidence: string[];
  likelihood: number; // 0-100
}

export interface ContributingFactor {
  factor: string;
  contribution: number; // percentage
  trend: 'increasing' | 'decreasing' | 'stable';
  controllable: boolean;
}

export interface CorrelatedEvent {
  event: string;
  timestamp: Date;
  correlation: number; // -1 to 1
  significance: number; // 0-100
}

export interface ElasticityAnalysis {
  priceElasticity: number;
  volumeElasticity: number;
  costElasticity: number;
  demandSensitivity: DemandSensitivity[];
  optimalPriceRange: PriceRange;
  revenueOptimization: RevenueOptimization;
}

export interface DemandSensitivity {
  factor: string;
  elasticity: number;
  threshold: number;
  impact: 'linear' | 'exponential' | 'logarithmic' | 'step';
}

export interface PriceRange {
  minimum: number;
  optimal: number;
  maximum: number;
  confidence: number;
}

export interface RevenueOptimization {
  currentRevenue: number;
  optimizedRevenue: number;
  improvementPotential: number;
  recommendedActions: string[];
}

export interface PredictiveInsight {
  type: 'cost_spike' | 'efficiency_drop' | 'opportunity' | 'risk' | 'trend_change';
  title: string;
  description: string;
  probability: number; // 0-100
  timeframe: string; // e.g., "next 30 days"
  impact: number; // financial impact
  confidence: number; // 0-100
  indicators: string[];
  preventiveActions: string[];
  monitoringMetrics: string[];
}

export interface VarianceReport {
  summary: VarianceSummary;
  categoryVariances: CategoryVariance[];
  rootCauseAnalysis: RootCauseAnalysis[];
  recommendations: VarianceRecommendation[];
  alerts: VarianceAlert[];
}

export interface VarianceSummary {
  totalVariance: number;
  totalVariancePercent: number;
  favorableVariance: number;
  unfavorableVariance: number;
  significantVariances: number;
}

export interface CategoryVariance {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'favorable' | 'unfavorable' | 'neutral';
  significance: 'low' | 'medium' | 'high' | 'critical';
}

export interface RootCauseAnalysis {
  category: string;
  primaryCause: string;
  contributingFactors: string[];
  impact: number;
  likelihood: number;
  preventable: boolean;
}

export interface VarianceRecommendation {
  category: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expectedImpact: string;
  timeframe: string;
  resources: string[];
}

export interface VarianceAlert {
  level: 'info' | 'warning' | 'critical';
  category: string;
  message: string;
  threshold: number;
  actual: number;
  action: string;
}

export interface CostForecast {
  forecastData: ForecastPoint[];
  confidence: ConfidenceInterval[];
  scenarios: ForecastScenario[];
  assumptions: ForecastAssumption[];
  accuracy: ForecastAccuracy;
}

export interface ForecastPoint {
  timestamp: Date;
  predictedCost: number;
  upperBound: number;
  lowerBound: number;
  components: ComponentForecast[];
}

export interface ComponentForecast {
  category: string;
  value: number;
  confidence: number;
}

export interface ConfidenceInterval {
  timestamp: Date;
  confidence95Upper: number;
  confidence95Lower: number;
  confidence80Upper: number;
  confidence80Lower: number;
}

export interface ForecastScenario {
  name: string;
  description: string;
  probability: number;
  impact: number;
  forecastAdjustment: number;
}

export interface ForecastAssumption {
  assumption: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  sensitivity: number;
}

export interface ForecastAccuracy {
  mape: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
  mae: number;  // Mean Absolute Error
  accuracy: number;
}

export interface Budget {
  period: TimePeriod;
  totalBudget: number;
  categoryBudgets: CategoryBudget[];
  assumptions: BudgetAssumption[];
}

export interface CategoryBudget {
  category: string;
  amount: number;
  allocation: number;
  flexibility: 'fixed' | 'variable' | 'semi-variable';
}

export interface BudgetAssumption {
  assumption: string;
  value: number;
  impact: string;
}

export interface ActualCosts {
  period: TimePeriod;
  totalActual: number;
  categoryActuals: CategoryActual[];
  drivers: CostDriver[];
}

export interface CategoryActual {
  category: string;
  amount: number;
  allocation: number;
  variance: number;
}

export interface CostDriver {
  driver: string;
  impact: number;
  controllable: boolean;
}

export interface BudgetComparison {
  overallPerformance: PerformanceMetric;
  categoryPerformance: CategoryPerformance[];
  trends: BudgetTrend[];
  efficiency: EfficiencyMetric[];
  recommendations: BudgetRecommendation[];
}

export interface PerformanceMetric {
  metric: string;
  target: number;
  actual: number;
  variance: number;
  performance: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface CategoryPerformance {
  category: string;
  budgetUtilization: number;
  efficiency: number;
  trend: 'improving' | 'stable' | 'declining';
  ranking: number;
}

export interface BudgetTrend {
  period: string;
  budgetAccuracy: number;
  varianceReduction: number;
  forecastImprovement: number;
}

export interface EfficiencyMetric {
  metric: string;
  value: number;
  benchmark: number;
  percentile: number;
}

export interface BudgetRecommendation {
  area: string;
  recommendation: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
}

export interface CostAnomaly {
  timestamp: Date;
  category: string;
  anomalyType: 'spike' | 'drop' | 'pattern_break' | 'outlier';
  severity: 'low' | 'medium' | 'high' | 'critical';
  value: number;
  expectedValue: number;
  deviation: number;
  possibleCauses: string[];
  investigation: AnomalyInvestigation;
}

export interface AnomalyInvestigation {
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  findings: string[];
  actions: string[];
  resolution: string;
}

export class AdvancedCostAnalyticsEngine implements CostAnalyticsEngine {
  private readonly SIGNIFICANCE_THRESHOLD = 0.05;
  private readonly ANOMALY_THRESHOLD = 2.5; // Standard deviations

  analyzeCostTrends(data: CostData[], period: TimePeriod): TrendAnalysis {
    // Calculate overall trend
    const overallTrend = this.calculateTrend(data.map(d => ({ x: d.timestamp.getTime(), y: d.totalCost })));
    
    // Analyze category trends
    const categoryTrends = this.analyzeCategoryTrends(data);
    
    // Identify seasonal patterns
    const seasonalPatterns = this.identifySeasonalPatterns(data, period);
    
    // Calculate correlations
    const correlations = this.calculateCorrelations(data);
    
    // Generate insights
    const insights = this.generateTrendInsights(overallTrend, categoryTrends, seasonalPatterns);
    
    return {
      overallTrend,
      categoryTrends,
      seasonalPatterns,
      correlations,
      insights,
    };
  }

  generateVarianceReport(budget: Budget, actual: ActualCosts): VarianceReport {
    // Calculate summary statistics
    const summary = this.calculateVarianceSummary(budget, actual);
    
    // Analyze category variances
    const categoryVariances = this.analyzeCategoryVariances(budget, actual);
    
    // Perform root cause analysis
    const rootCauseAnalysis = this.performRootCauseAnalysis(categoryVariances, actual);
    
    // Generate recommendations
    const recommendations = this.generateVarianceRecommendations(categoryVariances, rootCauseAnalysis);
    
    // Create alerts
    const alerts = this.generateVarianceAlerts(categoryVariances);
    
    return {
      summary,
      categoryVariances,
      rootCauseAnalysis,
      recommendations,
      alerts,
    };
  }

  predictCosts(historicalData: CostData[], forecastPeriod: number): CostForecast {
    // Prepare time series data
    const timeSeriesData = this.prepareTimeSeriesData(historicalData);
    
    // Apply forecasting models
    const forecastData = this.generateForecast(timeSeriesData, forecastPeriod);
    
    // Calculate confidence intervals
    const confidence = this.calculateConfidenceIntervals(forecastData, historicalData);
    
    // Generate scenarios
    const scenarios = this.generateForecastScenarios();
    
    // Define assumptions
    const assumptions = this.defineForecastAssumptions();
    
    // Calculate accuracy metrics
    const accuracy = this.calculateForecastAccuracy(historicalData);
    
    return {
      forecastData,
      confidence,
      scenarios,
      assumptions,
      accuracy,
    };
  }

  performBudgetComparison(budget: Budget, actual: ActualCosts): BudgetComparison {
    // Calculate overall performance
    const overallPerformance = this.calculateOverallPerformance(budget, actual);
    
    // Analyze category performance
    const categoryPerformance = this.analyzeCategoryPerformance(budget, actual);
    
    // Identify trends
    const trends = this.identifyBudgetTrends(budget, actual);
    
    // Calculate efficiency metrics
    const efficiency = this.calculateEfficiencyMetrics(budget, actual);
    
    // Generate recommendations
    const recommendations = this.generateBudgetRecommendations(overallPerformance, categoryPerformance);
    
    return {
      overallPerformance,
      categoryPerformance,
      trends,
      efficiency,
      recommendations,
    };
  }

  identifyAnomalies(data: CostData[]): CostAnomaly[] {
    const anomalies: CostAnomaly[] = [];
    
    // Check each cost category for anomalies
    const categories = ['totalCost', 'energyCost', 'laborCost', 'materialCost', 'overheadCost', 'maintenanceCost'];
    
    categories.forEach(category => {
      const categoryAnomalies = this.detectCategoryAnomalies(data, category);
      anomalies.push(...categoryAnomalies);
    });
    
    return anomalies.sort((a, b) => b.severity.localeCompare(a.severity));
  }

  private calculateTrend(points: { x: number; y: number }[]): Trend {
    if (points.length < 2) {
      return {
        direction: 'stable',
        magnitude: 0,
        confidence: 0,
        r2: 0,
        equation: 'Insufficient data',
      };
    }

    // Linear regression
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R²
    const yMean = sumY / n;
    const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
    const ssResidual = points.reduce((sum, p) => {
      const predicted = slope * p.x + intercept;
      return sum + Math.pow(p.y - predicted, 2);
    }, 0);
    const r2 = 1 - (ssResidual / ssTotal);

    // Determine direction and magnitude
    const direction = Math.abs(slope) < 0.001 ? 'stable' : 
                     slope > 0 ? 'increasing' : 'decreasing';
    const magnitude = Math.abs(slope);
    const confidence = r2 * 100;

    return {
      direction,
      magnitude,
      confidence,
      r2,
      equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(2)}`,
    };
  }

  private analyzeCategoryTrends(data: CostData[]): CategoryTrend[] {
    const categories = [
      { name: 'Energy', accessor: (d: CostData) => d.energyCost },
      { name: 'Labor', accessor: (d: CostData) => d.laborCost },
      { name: 'Material', accessor: (d: CostData) => d.materialCost },
      { name: 'Overhead', accessor: (d: CostData) => d.overheadCost },
      { name: 'Maintenance', accessor: (d: CostData) => d.maintenanceCost },
    ];

    return categories.map(category => {
      const points = data.map(d => ({ x: d.timestamp.getTime(), y: category.accessor(d) }));
      const trend = this.calculateTrend(points);
      const contribution = this.calculateContribution(data, category.accessor);
      const volatility = this.calculateVolatility(points.map(p => p.y));

      return {
        category: category.name,
        trend,
        contribution,
        volatility,
      };
    });
  }

  private calculateContribution(data: CostData[], accessor: (d: CostData) => number): number {
    const categoryTotal = data.reduce((sum, d) => sum + accessor(d), 0);
    const grandTotal = data.reduce((sum, d) => sum + d.totalCost, 0);
    return (categoryTotal / grandTotal) * 100;
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return (stdDev / mean) * 100; // Coefficient of variation
  }

  private identifySeasonalPatterns(data: CostData[], period: TimePeriod): SeasonalPattern[] {
    // Simplified seasonal analysis - in practice, would use more sophisticated methods
    const patterns: SeasonalPattern[] = [];
    
    if (data.length < 12) return patterns; // Need at least a year of data
    
    // Monthly pattern analysis
    const monthlyData = this.groupByMonth(data);
    const monthlyPattern = this.analyzeMonthlyPattern(monthlyData);
    
    if (monthlyPattern.strength > 0.3) {
      patterns.push(monthlyPattern);
    }
    
    return patterns;
  }

  private groupByMonth(data: CostData[]): Map<number, CostData[]> {
    const grouped = new Map<number, CostData[]>();
    
    data.forEach(d => {
      const month = d.timestamp.getMonth();
      if (!grouped.has(month)) {
        grouped.set(month, []);
      }
      grouped.get(month)!.push(d);
    });
    
    return grouped;
  }

  private analyzeMonthlyPattern(monthlyData: Map<number, CostData[]>): SeasonalPattern {
    const monthlyAverages = new Map<number, number>();
    
    monthlyData.forEach((data, month) => {
      const average = data.reduce((sum, d) => sum + d.totalCost, 0) / data.length;
      monthlyAverages.set(month, average);
    });
    
    const values = Array.from(monthlyAverages.values());
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const strength = Math.sqrt(variance) / mean;
    
    // Find peaks and troughs
    const peaks: Date[] = [];
    const troughs: Date[] = [];
    
    monthlyAverages.forEach((avg, month) => {
      if (avg > mean * 1.1) {
        peaks.push(new Date(2024, month, 1)); // Example year
      } else if (avg < mean * 0.9) {
        troughs.push(new Date(2024, month, 1));
      }
    });
    
    return {
      pattern: 'Monthly Seasonality',
      strength,
      period: 'Monthly',
      peaks,
      troughs,
    };
  }

  private calculateCorrelations(data: CostData[]): Correlation[] {
    const correlations: Correlation[] = [];
    
    // Cost vs Volume correlation
    const costVolumeCorr = this.calculateCorrelation(
      data.map(d => d.totalCost),
      data.map(d => d.volume)
    );
    
    correlations.push({
      variable1: 'Total Cost',
      variable2: 'Volume',
      coefficient: costVolumeCorr,
      significance: this.calculateSignificance(costVolumeCorr, data.length),
      relationship: this.interpretCorrelation(costVolumeCorr),
    });
    
    // Cost vs Efficiency correlation
    const costEfficiencyCorr = this.calculateCorrelation(
      data.map(d => d.totalCost),
      data.map(d => d.efficiency)
    );
    
    correlations.push({
      variable1: 'Total Cost',
      variable2: 'Efficiency',
      coefficient: costEfficiencyCorr,
      significance: this.calculateSignificance(costEfficiencyCorr, data.length),
      relationship: this.interpretCorrelation(costEfficiencyCorr),
    });
    
    return correlations;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateSignificance(correlation: number, sampleSize: number): number {
    // Simplified significance test
    const t = correlation * Math.sqrt((sampleSize - 2) / (1 - correlation * correlation));
    return Math.abs(t);
  }

  private interpretCorrelation(coefficient: number): string {
    const abs = Math.abs(coefficient);
    if (abs > 0.8) return 'Very Strong';
    if (abs > 0.6) return 'Strong';
    if (abs > 0.4) return 'Moderate';
    if (abs > 0.2) return 'Weak';
    return 'Very Weak';
  }

  private generateTrendInsights(
    overallTrend: Trend,
    categoryTrends: CategoryTrend[],
    seasonalPatterns: SeasonalPattern[]
  ): TrendInsight[] {
    const insights: TrendInsight[] = [];
    
    // Overall trend insights
    if (overallTrend.direction === 'increasing' && overallTrend.confidence > 70) {
      insights.push({
        type: 'risk',
        description: 'Costs are trending upward with high confidence',
        impact: 'high',
        recommendation: 'Implement cost control measures immediately',
        confidence: overallTrend.confidence,
      });
    }
    
    // Category-specific insights
    categoryTrends.forEach(trend => {
      if (trend.volatility > 30) {
        insights.push({
          type: 'risk',
          description: `${trend.category} costs show high volatility`,
          impact: 'medium',
          recommendation: `Investigate ${trend.category} cost drivers and implement stabilization measures`,
          confidence: 80,
        });
      }
      
      if (trend.contribution > 40 && trend.trend.direction === 'increasing') {
        insights.push({
          type: 'opportunity',
          description: `${trend.category} is a major cost driver with increasing trend`,
          impact: 'high',
          recommendation: `Focus optimization efforts on ${trend.category} costs`,
          confidence: trend.trend.confidence,
        });
      }
    });
    
    // Seasonal insights
    seasonalPatterns.forEach(pattern => {
      if (pattern.strength > 0.5) {
        insights.push({
          type: 'pattern',
          description: `Strong ${pattern.period.toLowerCase()} seasonal pattern detected`,
          impact: 'medium',
          recommendation: 'Plan budget and operations around seasonal variations',
          confidence: pattern.strength * 100,
        });
      }
    });
    
    return insights;
  }

  // Additional helper methods would continue here...
  private calculateVarianceSummary(budget: Budget, actual: ActualCosts): VarianceSummary {
    const totalVariance = actual.totalActual - budget.totalBudget;
    const totalVariancePercent = (totalVariance / budget.totalBudget) * 100;
    
    let favorableVariance = 0;
    let unfavorableVariance = 0;
    let significantVariances = 0;
    
    budget.categoryBudgets.forEach((budgetCat, index) => {
      const actualCat = actual.categoryActuals[index];
      if (actualCat) {
        const variance = actualCat.amount - budgetCat.amount;
        if (variance < 0) {
          favorableVariance += Math.abs(variance);
        } else {
          unfavorableVariance += variance;
        }
        
        if (Math.abs(variance / budgetCat.amount) > 0.1) { // 10% threshold
          significantVariances++;
        }
      }
    });
    
    return {
      totalVariance,
      totalVariancePercent,
      favorableVariance,
      unfavorableVariance,
      significantVariances,
    };
  }

  private analyzeCategoryVariances(budget: Budget, actual: ActualCosts): CategoryVariance[] {
    return budget.categoryBudgets.map(budgetCat => {
      const actualCat = actual.categoryActuals.find(a => a.category === budgetCat.category);
      const actualAmount = actualCat ? actualCat.amount : 0;
      const variance = actualAmount - budgetCat.amount;
      const variancePercent = (variance / budgetCat.amount) * 100;
      
      let status: 'favorable' | 'unfavorable' | 'neutral' = 'neutral';
      if (variance < -budgetCat.amount * 0.05) status = 'favorable';
      else if (variance > budgetCat.amount * 0.05) status = 'unfavorable';
      
      let significance: 'low' | 'medium' | 'high' | 'critical' = 'low';
      const absVariancePercent = Math.abs(variancePercent);
      if (absVariancePercent > 25) significance = 'critical';
      else if (absVariancePercent > 15) significance = 'high';
      else if (absVariancePercent > 10) significance = 'medium';
      
      return {
        category: budgetCat.category,
        budgeted: budgetCat.amount,
        actual: actualAmount,
        variance,
        variancePercent,
        status,
        significance,
      };
    });
  }

  // Enhanced methods for advanced analytics
  generateCostOptimizationRecommendations(data: CostData[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Analyze cost patterns
    const trendAnalysis = this.analyzeCostTrends(data, 'monthly');
    const anomalies = this.identifyAnomalies(data);

    // Energy cost optimization
    const avgEnergyCost = data.reduce((sum, d) => sum + d.energyCost, 0) / data.length;
    const energyTrend = trendAnalysis.categoryTrends.find(t => t.category === 'energy');

    if (energyTrend && energyTrend.trend.direction === 'increasing') {
      recommendations.push({
        id: 'energy_optimization_001',
        category: 'cost_reduction',
        title: 'Energy Cost Optimization',
        description: 'Energy costs are trending upward. Implement energy efficiency measures.',
        potentialSaving: avgEnergyCost * 0.15, // 15% potential saving
        implementationCost: avgEnergyCost * 0.05, // 5% implementation cost
        paybackPeriod: 4, // 4 months
        difficulty: 'medium',
        priority: 'high',
        actions: [
          'Optimize laser power settings',
          'Implement energy monitoring system',
          'Schedule operations during off-peak hours',
          'Upgrade to energy-efficient equipment'
        ],
        kpis: ['Energy cost per hour', 'Power consumption efficiency', 'Peak demand reduction'],
        riskLevel: 'low',
        confidence: 85
      });
    }

    // Labor cost optimization
    const avgLaborCost = data.reduce((sum, d) => sum + d.laborCost, 0) / data.length;
    const laborTrend = trendAnalysis.categoryTrends.find(t => t.category === 'labor');

    if (laborTrend && laborTrend.volatility > 25) {
      recommendations.push({
        id: 'labor_optimization_001',
        category: 'efficiency_improvement',
        title: 'Labor Cost Stabilization',
        description: 'Labor costs show high volatility. Implement workforce optimization.',
        potentialSaving: avgLaborCost * 0.12, // 12% potential saving
        implementationCost: avgLaborCost * 0.08, // 8% implementation cost
        paybackPeriod: 6, // 6 months
        difficulty: 'high',
        priority: 'medium',
        actions: [
          'Implement cross-training programs',
          'Optimize shift scheduling',
          'Automate routine tasks',
          'Improve workflow efficiency'
        ],
        kpis: ['Labor cost per unit', 'Productivity rate', 'Overtime percentage'],
        riskLevel: 'medium',
        confidence: 75
      });
    }

    // Material cost optimization
    const avgMaterialCost = data.reduce((sum, d) => sum + d.materialCost, 0) / data.length;
    const materialAnomalies = anomalies.filter(a => a.category === 'material');

    if (materialAnomalies.length > 0) {
      recommendations.push({
        id: 'material_optimization_001',
        category: 'cost_reduction',
        title: 'Material Cost Control',
        description: 'Material cost anomalies detected. Implement better procurement strategies.',
        potentialSaving: avgMaterialCost * 0.10, // 10% potential saving
        implementationCost: avgMaterialCost * 0.03, // 3% implementation cost
        paybackPeriod: 3, // 3 months
        difficulty: 'low',
        priority: 'high',
        actions: [
          'Negotiate better supplier contracts',
          'Implement just-in-time inventory',
          'Optimize material utilization',
          'Explore alternative materials'
        ],
        kpis: ['Material cost per unit', 'Waste percentage', 'Supplier performance'],
        riskLevel: 'low',
        confidence: 90
      });
    }

    return recommendations;
  }

  performRootCauseAnalysis(variance: Variance): RootCauseAnalysis {
    const primaryCauses: CauseAnalysis[] = [];
    const contributingFactors: ContributingFactor[] = [];
    const correlatedEvents: CorrelatedEvent[] = [];

    // Analyze variance magnitude and direction
    if (Math.abs(variance.amount) > variance.threshold * 0.5) {
      // Significant variance - analyze potential causes

      if (variance.category === 'energy') {
        primaryCauses.push({
          cause: 'Equipment efficiency degradation',
          category: 'technical',
          impact: 35,
          evidence: ['Increased power consumption', 'Longer processing times'],
          likelihood: 80
        });

        contributingFactors.push({
          factor: 'Maintenance schedule adherence',
          contribution: 25,
          trend: 'decreasing',
          controllable: true
        });
      }

      if (variance.category === 'labor') {
        primaryCauses.push({
          cause: 'Skill level variations',
          category: 'human',
          impact: 40,
          evidence: ['Setup time variations', 'Quality rework rates'],
          likelihood: 75
        });

        contributingFactors.push({
          factor: 'Training effectiveness',
          contribution: 30,
          trend: 'stable',
          controllable: true
        });
      }

      if (variance.category === 'material') {
        primaryCauses.push({
          cause: 'Market price volatility',
          category: 'market',
          impact: 50,
          evidence: ['Supplier price changes', 'Raw material market trends'],
          likelihood: 90
        });

        contributingFactors.push({
          factor: 'Supplier diversification',
          contribution: 20,
          trend: 'stable',
          controllable: true
        });
      }
    }

    const recommendations = this.generateRootCauseRecommendations(primaryCauses, contributingFactors);

    return {
      variance,
      primaryCauses,
      contributingFactors,
      correlatedEvents,
      recommendations,
      confidence: 85
    };
  }

  private generateRootCauseRecommendations(
    causes: CauseAnalysis[],
    factors: ContributingFactor[]
  ): string[] {
    const recommendations: string[] = [];

    causes.forEach(cause => {
      switch (cause.category) {
        case 'technical':
          recommendations.push('Implement predictive maintenance program');
          recommendations.push('Upgrade equipment monitoring systems');
          break;
        case 'human':
          recommendations.push('Enhance training programs');
          recommendations.push('Implement skill assessment protocols');
          break;
        case 'market':
          recommendations.push('Diversify supplier base');
          recommendations.push('Implement hedging strategies');
          break;
        case 'operational':
          recommendations.push('Review and optimize processes');
          recommendations.push('Implement quality control measures');
          break;
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  // More helper methods would continue...
}

// Export singleton instance
export const costAnalyticsEngine = new AdvancedCostAnalyticsEngine();
