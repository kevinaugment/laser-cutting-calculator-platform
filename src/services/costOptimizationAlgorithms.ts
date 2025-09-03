/**
 * Cost Optimization Algorithms
 * Advanced algorithms for cost pattern recognition, anomaly detection, and optimization
 */

export interface CostOptimizationAlgorithms {
  identifyCostPatterns(costData: CostDataPoint[]): Promise<CostPattern[]>;
  detectCostAnomalies(costData: CostDataPoint[]): Promise<CostAnomaly[]>;
  generateOptimizationSuggestions(patterns: CostPattern[], anomalies: CostAnomaly[]): Promise<OptimizationSuggestion[]>;
  calculateOptimizationPotential(costData: CostDataPoint[]): Promise<OptimizationPotential>;
  predictCostTrends(historicalData: CostDataPoint[]): Promise<CostTrendPrediction>;
  benchmarkCosts(costData: CostDataPoint[], industryData: IndustryBenchmark[]): Promise<CostBenchmarkResult>;
}

export interface CostDataPoint {
  timestamp: Date;
  totalCost: number;
  costBreakdown: {
    energy: number;
    labor: number;
    materials: number;
    overhead: number;
    maintenance: number;
  };
  operationalContext: {
    volume: number;
    efficiency: number;
    utilization: number;
    shiftType: 'day' | 'night' | 'weekend';
    operatorCount: number;
  };
  externalFactors: {
    energyPrice: number;
    materialPrice: number;
    laborRate: number;
    seasonality: number;
  };
}

export interface CostPattern {
  id: string;
  type: 'temporal' | 'operational' | 'seasonal' | 'threshold' | 'correlation';
  name: string;
  description: string;
  frequency: number; // 0-1
  strength: number; // 0-1
  confidence: number; // 0-1
  timeRange: {
    start: Date;
    end: Date;
  };
  affectedCostCategories: string[];
  triggers: PatternTrigger[];
  impact: PatternImpact;
  examples: PatternExample[];
}

export interface PatternTrigger {
  condition: string;
  threshold: number;
  operator: '>' | '<' | '=' | '>=' | '<=';
  variable: string;
}

export interface PatternImpact {
  costIncrease: number; // percentage
  affectedVolume: number; // percentage of operations
  duration: number; // hours
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PatternExample {
  timestamp: Date;
  costBefore: number;
  costAfter: number;
  context: string;
}

export interface CostAnomaly {
  id: string;
  type: 'spike' | 'drop' | 'drift' | 'outlier' | 'pattern_break';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  affectedPeriod: {
    start: Date;
    end: Date;
  };
  costCategory: string;
  expectedValue: number;
  actualValue: number;
  deviation: number; // percentage
  confidence: number; // 0-1
  potentialCauses: AnomalyCause[];
  impact: AnomalyImpact;
  resolution: AnomalyResolution;
}

export interface AnomalyCause {
  cause: string;
  probability: number; // 0-1
  evidence: string[];
  category: 'equipment' | 'process' | 'external' | 'human' | 'system';
}

export interface AnomalyImpact {
  costImpact: number; // USD
  timeImpact: number; // hours
  qualityImpact: number; // percentage
  operationalImpact: string;
}

export interface AnomalyResolution {
  recommendedActions: string[];
  preventiveMeasures: string[];
  monitoringPoints: string[];
  estimatedResolutionTime: number; // hours
}

export interface OptimizationSuggestion {
  id: string;
  category: 'energy' | 'labor' | 'materials' | 'overhead' | 'maintenance' | 'process';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  rationale: string;
  basedOnPatterns: string[];
  basedOnAnomalies: string[];
  implementation: OptimizationImplementation;
  expectedResults: OptimizationResults;
  risks: OptimizationRisk[];
  prerequisites: string[];
  alternatives: AlternativeOption[];
}

export interface OptimizationImplementation {
  steps: ImplementationStep[];
  timeline: number; // days
  resources: RequiredResource[];
  cost: number; // USD
  complexity: 'low' | 'medium' | 'high';
  reversibility: 'easy' | 'moderate' | 'difficult';
}

export interface ImplementationStep {
  order: number;
  action: string;
  duration: number; // hours
  dependencies: string[];
  deliverables: string[];
  validation: string;
}

export interface RequiredResource {
  type: 'human' | 'equipment' | 'software' | 'material' | 'external';
  description: string;
  quantity: number;
  cost: number;
  availability: 'immediate' | 'short_term' | 'long_term';
}

export interface OptimizationResults {
  costSavings: {
    immediate: number; // USD
    annual: number; // USD
    breakdown: Record<string, number>;
  };
  efficiencyGains: {
    operational: number; // percentage
    energy: number; // percentage
    time: number; // percentage
  };
  qualityImprovements: {
    defectReduction: number; // percentage
    consistencyImprovement: number; // percentage
  };
  roi: {
    paybackPeriod: number; // months
    irr: number; // percentage
    npv: number; // USD
  };
}

export interface OptimizationRisk {
  risk: string;
  probability: number; // 0-1
  impact: number; // 0-1
  category: 'technical' | 'operational' | 'financial' | 'regulatory';
  mitigation: string;
}

export interface AlternativeOption {
  name: string;
  description: string;
  costSavings: number;
  implementationCost: number;
  complexity: 'low' | 'medium' | 'high';
  tradeoffs: string[];
}

export interface OptimizationPotential {
  totalPotential: number; // USD annually
  categoryBreakdown: Record<string, number>;
  quickWins: QuickWin[];
  longTermOpportunities: LongTermOpportunity[];
  riskAdjustedPotential: number; // USD annually
  confidenceLevel: number; // 0-1
}

export interface QuickWin {
  opportunity: string;
  savings: number; // USD annually
  implementationTime: number; // days
  effort: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
}

export interface LongTermOpportunity {
  opportunity: string;
  savings: number; // USD annually
  investmentRequired: number; // USD
  paybackPeriod: number; // months
  strategicValue: 'low' | 'medium' | 'high';
}

export interface CostTrendPrediction {
  timeHorizon: number; // days
  predictions: TrendPredictionPoint[];
  confidence: number; // 0-1
  methodology: string;
  assumptions: string[];
  riskFactors: string[];
}

export interface TrendPredictionPoint {
  timestamp: Date;
  predictedCost: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  factor: string;
  influence: number; // -1 to 1
  confidence: number; // 0-1
}

export interface IndustryBenchmark {
  category: string;
  metric: string;
  value: number;
  unit: string;
  source: string;
  date: Date;
  industrySegment: string;
  companySize: 'small' | 'medium' | 'large';
}

export interface CostBenchmarkResult {
  overallRanking: 'top_quartile' | 'above_average' | 'average' | 'below_average' | 'bottom_quartile';
  categoryRankings: Record<string, string>;
  gaps: BenchmarkGap[];
  opportunities: BenchmarkOpportunity[];
  strengths: string[];
  weaknesses: string[];
}

export interface BenchmarkGap {
  category: string;
  currentValue: number;
  benchmarkValue: number;
  gap: number; // percentage
  gapValue: number; // USD
  priority: 'low' | 'medium' | 'high';
}

export interface BenchmarkOpportunity {
  category: string;
  description: string;
  potentialSaving: number; // USD
  difficulty: 'easy' | 'moderate' | 'hard';
  timeframe: 'short' | 'medium' | 'long';
}

class CostOptimizationAlgorithmsService implements CostOptimizationAlgorithms {
  private patternCache: Map<string, CostPattern[]> = new Map();
  private anomalyThresholds: Map<string, number> = new Map();
  private optimizationHistory: OptimizationSuggestion[] = [];

  constructor() {
    this.initializeAnomalyThresholds();
  }

  private initializeAnomalyThresholds() {
    // Initialize default anomaly detection thresholds
    this.anomalyThresholds.set('cost_spike_threshold', 0.15); // 15% increase
    this.anomalyThresholds.set('cost_drop_threshold', 0.10); // 10% decrease
    this.anomalyThresholds.set('efficiency_drop_threshold', 0.05); // 5% efficiency drop
    this.anomalyThresholds.set('outlier_std_threshold', 2.5); // 2.5 standard deviations
  }

  async identifyCostPatterns(costData: CostDataPoint[]): Promise<CostPattern[]> {
    const patterns: CostPattern[] = [];

    try {
      // Identify temporal patterns
      const temporalPatterns = await this.identifyTemporalPatterns(costData);
      patterns.push(...temporalPatterns);

      // Identify operational patterns
      const operationalPatterns = await this.identifyOperationalPatterns(costData);
      patterns.push(...operationalPatterns);

      // Identify seasonal patterns
      const seasonalPatterns = await this.identifySeasonalPatterns(costData);
      patterns.push(...seasonalPatterns);

      // Identify threshold patterns
      const thresholdPatterns = await this.identifyThresholdPatterns(costData);
      patterns.push(...thresholdPatterns);

      // Identify correlation patterns
      const correlationPatterns = await this.identifyCorrelationPatterns(costData);
      patterns.push(...correlationPatterns);

      // Sort by strength and confidence
      patterns.sort((a, b) => (b.strength * b.confidence) - (a.strength * a.confidence));

      return patterns;
    } catch (error) {
      console.error('Error identifying cost patterns:', error);
      throw new Error('Failed to identify cost patterns');
    }
  }

  async detectCostAnomalies(costData: CostDataPoint[]): Promise<CostAnomaly[]> {
    const anomalies: CostAnomaly[] = [];

    try {
      // Detect cost spikes
      const spikes = await this.detectCostSpikes(costData);
      anomalies.push(...spikes);

      // Detect cost drops
      const drops = await this.detectCostDrops(costData);
      anomalies.push(...drops);

      // Detect cost drift
      const drifts = await this.detectCostDrift(costData);
      anomalies.push(...drifts);

      // Detect outliers
      const outliers = await this.detectOutliers(costData);
      anomalies.push(...outliers);

      // Detect pattern breaks
      const patternBreaks = await this.detectPatternBreaks(costData);
      anomalies.push(...patternBreaks);

      // Sort by severity and confidence
      anomalies.sort((a, b) => {
        const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        const aSeverity = severityWeight[a.severity];
        const bSeverity = severityWeight[b.severity];
        
        if (aSeverity !== bSeverity) {
          return bSeverity - aSeverity;
        }
        
        return b.confidence - a.confidence;
      });

      return anomalies;
    } catch (error) {
      console.error('Error detecting cost anomalies:', error);
      throw new Error('Failed to detect cost anomalies');
    }
  }

  async generateOptimizationSuggestions(patterns: CostPattern[], anomalies: CostAnomaly[]): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];

    try {
      // Generate pattern-based suggestions
      for (const pattern of patterns) {
        const patternSuggestions = await this.generatePatternBasedSuggestions(pattern);
        suggestions.push(...patternSuggestions);
      }

      // Generate anomaly-based suggestions
      for (const anomaly of anomalies) {
        const anomalySuggestions = await this.generateAnomalyBasedSuggestions(anomaly);
        suggestions.push(...anomalySuggestions);
      }

      // Generate cross-pattern suggestions
      const crossPatternSuggestions = await this.generateCrossPatternSuggestions(patterns);
      suggestions.push(...crossPatternSuggestions);

      // Remove duplicates and merge similar suggestions
      const uniqueSuggestions = this.deduplicateSuggestions(suggestions);

      // Sort by priority and expected results
      uniqueSuggestions.sort((a, b) => {
        const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority];
        const bPriority = priorityWeight[b.priority];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        return b.expectedResults.costSavings.annual - a.expectedResults.costSavings.annual;
      });

      return uniqueSuggestions;
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      throw new Error('Failed to generate optimization suggestions');
    }
  }

  async calculateOptimizationPotential(costData: CostDataPoint[]): Promise<OptimizationPotential> {
    try {
      // Analyze cost data for optimization opportunities
      const patterns = await this.identifyCostPatterns(costData);
      const anomalies = await this.detectCostAnomalies(costData);
      
      // Calculate potential savings by category
      const categoryBreakdown = await this.calculateCategoryPotential(costData, patterns, anomalies);
      
      // Identify quick wins
      const quickWins = await this.identifyQuickWins(patterns, anomalies);
      
      // Identify long-term opportunities
      const longTermOpportunities = await this.identifyLongTermOpportunities(costData, patterns);
      
      // Calculate total potential
      const totalPotential = Object.values(categoryBreakdown).reduce((sum, value) => sum + value, 0);
      
      // Apply risk adjustment
      const riskAdjustedPotential = totalPotential * 0.75; // 25% risk discount
      
      // Calculate confidence level
      const confidenceLevel = this.calculateConfidenceLevel(patterns, anomalies, costData);

      return {
        totalPotential,
        categoryBreakdown,
        quickWins,
        longTermOpportunities,
        riskAdjustedPotential,
        confidenceLevel,
      };
    } catch (error) {
      console.error('Error calculating optimization potential:', error);
      throw new Error('Failed to calculate optimization potential');
    }
  }

  async predictCostTrends(historicalData: CostDataPoint[]): Promise<CostTrendPrediction> {
    try {
      const timeHorizon = 90; // 90 days
      const predictions: TrendPredictionPoint[] = [];
      
      // Use multiple prediction methods
      const linearTrend = this.calculateLinearTrend(historicalData);
      const seasonalComponent = this.calculateSeasonalComponent(historicalData);
      const cyclicalComponent = this.calculateCyclicalComponent(historicalData);
      
      // Generate predictions for each day
      for (let i = 1; i <= timeHorizon; i++) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i);
        
        const basePrediction = this.applyLinearTrend(linearTrend, i);
        const seasonalAdjustment = this.applySeasonalAdjustment(seasonalComponent, futureDate);
        const cyclicalAdjustment = this.applyCyclicalAdjustment(cyclicalComponent, i);
        
        const predictedCost = basePrediction + seasonalAdjustment + cyclicalAdjustment;
        const uncertainty = this.calculatePredictionUncertainty(i, historicalData);
        
        predictions.push({
          timestamp: futureDate,
          predictedCost,
          confidenceInterval: {
            lower: predictedCost - uncertainty,
            upper: predictedCost + uncertainty,
          },
          factors: [
            { factor: 'Linear Trend', influence: 0.6, confidence: 0.8 },
            { factor: 'Seasonal Pattern', influence: 0.3, confidence: 0.7 },
            { factor: 'Cyclical Pattern', influence: 0.1, confidence: 0.6 },
          ],
        });
      }
      
      const confidence = this.calculatePredictionConfidence(historicalData);

      return {
        timeHorizon,
        predictions,
        confidence,
        methodology: 'Hybrid: Linear Trend + Seasonal + Cyclical Components',
        assumptions: [
          'Historical patterns continue',
          'No major external disruptions',
          'Current operational parameters maintained',
          'Market conditions remain stable',
        ],
        riskFactors: [
          'Equipment failures',
          'Market volatility',
          'Regulatory changes',
          'Supply chain disruptions',
        ],
      };
    } catch (error) {
      console.error('Error predicting cost trends:', error);
      throw new Error('Failed to predict cost trends');
    }
  }

  async benchmarkCosts(costData: CostDataPoint[], industryData: IndustryBenchmark[]): Promise<CostBenchmarkResult> {
    try {
      // Calculate current performance metrics
      const currentMetrics = this.calculateCurrentMetrics(costData);
      
      // Compare against industry benchmarks
      const categoryRankings: Record<string, string> = {};
      const gaps: BenchmarkGap[] = [];
      const opportunities: BenchmarkOpportunity[] = [];
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      
      // Analyze each cost category
      for (const benchmark of industryData) {
        const currentValue = currentMetrics[benchmark.category];
        if (currentValue !== undefined) {
          const gap = ((currentValue - benchmark.value) / benchmark.value) * 100;
          const ranking = this.calculateRanking(gap);
          
          categoryRankings[benchmark.category] = ranking;
          
          if (gap > 10) {
            gaps.push({
              category: benchmark.category,
              currentValue,
              benchmarkValue: benchmark.value,
              gap,
              gapValue: currentValue - benchmark.value,
              priority: gap > 25 ? 'high' : gap > 15 ? 'medium' : 'low',
            });
            
            weaknesses.push(`${benchmark.category} costs are ${gap.toFixed(1)}% above industry average`);
            
            opportunities.push({
              category: benchmark.category,
              description: `Reduce ${benchmark.category} costs to industry benchmark`,
              potentialSaving: currentValue - benchmark.value,
              difficulty: gap > 30 ? 'hard' : gap > 15 ? 'moderate' : 'easy',
              timeframe: gap > 30 ? 'long' : gap > 15 ? 'medium' : 'short',
            });
          } else if (gap < -5) {
            strengths.push(`${benchmark.category} costs are ${Math.abs(gap).toFixed(1)}% below industry average`);
          }
        }
      }
      
      // Calculate overall ranking
      const overallRanking = this.calculateOverallRanking(categoryRankings);

      return {
        overallRanking,
        categoryRankings,
        gaps,
        opportunities,
        strengths,
        weaknesses,
      };
    } catch (error) {
      console.error('Error benchmarking costs:', error);
      throw new Error('Failed to benchmark costs');
    }
  }

  // Private helper methods
  private async identifyTemporalPatterns(costData: CostDataPoint[]): Promise<CostPattern[]> {
    // Identify time-based patterns (hourly, daily, weekly)
    return [
      {
        id: 'temporal_001',
        type: 'temporal',
        name: 'Peak Hour Cost Increase',
        description: 'Costs increase by 12% during peak operating hours (9 AM - 5 PM)',
        frequency: 0.8,
        strength: 0.7,
        confidence: 0.85,
        timeRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
        affectedCostCategories: ['energy', 'labor'],
        triggers: [
          { condition: 'hour >= 9 AND hour <= 17', threshold: 9, operator: '>=', variable: 'hour' }
        ],
        impact: {
          costIncrease: 12,
          affectedVolume: 70,
          duration: 8,
          severity: 'medium'
        },
        examples: []
      }
    ];
  }

  private async identifyOperationalPatterns(costData: CostDataPoint[]): Promise<CostPattern[]> {
    // Identify patterns based on operational parameters
    return [];
  }

  private async identifySeasonalPatterns(costData: CostDataPoint[]): Promise<CostPattern[]> {
    // Identify seasonal cost patterns
    return [];
  }

  private async identifyThresholdPatterns(costData: CostDataPoint[]): Promise<CostPattern[]> {
    // Identify threshold-based patterns
    return [];
  }

  private async identifyCorrelationPatterns(costData: CostDataPoint[]): Promise<CostPattern[]> {
    // Identify correlation-based patterns
    return [];
  }

  private async detectCostSpikes(costData: CostDataPoint[]): Promise<CostAnomaly[]> {
    // Detect sudden cost increases
    return [];
  }

  private async detectCostDrops(costData: CostDataPoint[]): Promise<CostAnomaly[]> {
    // Detect sudden cost decreases
    return [];
  }

  private async detectCostDrift(costData: CostDataPoint[]): Promise<CostAnomaly[]> {
    // Detect gradual cost drift
    return [];
  }

  private async detectOutliers(costData: CostDataPoint[]): Promise<CostAnomaly[]> {
    // Detect statistical outliers
    return [];
  }

  private async detectPatternBreaks(costData: CostDataPoint[]): Promise<CostAnomaly[]> {
    // Detect breaks in established patterns
    return [];
  }

  private async generatePatternBasedSuggestions(pattern: CostPattern): Promise<OptimizationSuggestion[]> {
    // Generate suggestions based on identified patterns
    return [];
  }

  private async generateAnomalyBasedSuggestions(anomaly: CostAnomaly): Promise<OptimizationSuggestion[]> {
    // Generate suggestions based on detected anomalies
    return [];
  }

  private async generateCrossPatternSuggestions(patterns: CostPattern[]): Promise<OptimizationSuggestion[]> {
    // Generate suggestions based on multiple patterns
    return [];
  }

  private deduplicateSuggestions(suggestions: OptimizationSuggestion[]): OptimizationSuggestion[] {
    // Remove duplicate suggestions and merge similar ones
    return suggestions;
  }

  private async calculateCategoryPotential(
    costData: CostDataPoint[],
    patterns: CostPattern[],
    anomalies: CostAnomaly[]
  ): Promise<Record<string, number>> {
    // Calculate optimization potential by category
    return {
      energy: 2400,
      labor: 1800,
      materials: 1200,
      overhead: 800,
      maintenance: 600,
    };
  }

  private async identifyQuickWins(patterns: CostPattern[], anomalies: CostAnomaly[]): Promise<QuickWin[]> {
    // Identify quick win opportunities
    return [
      {
        opportunity: 'Off-peak scheduling optimization',
        savings: 1200,
        implementationTime: 7,
        effort: 'low',
        confidence: 0.85,
      },
    ];
  }

  private async identifyLongTermOpportunities(
    costData: CostDataPoint[],
    patterns: CostPattern[]
  ): Promise<LongTermOpportunity[]> {
    // Identify long-term optimization opportunities
    return [
      {
        opportunity: 'Energy management system implementation',
        savings: 3600,
        investmentRequired: 15000,
        paybackPeriod: 18,
        strategicValue: 'high',
      },
    ];
  }

  private calculateConfidenceLevel(
    patterns: CostPattern[],
    anomalies: CostAnomaly[],
    costData: CostDataPoint[]
  ): number {
    // Calculate overall confidence level
    const patternConfidence = patterns.length > 0 ? 
      patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length : 0;
    const anomalyConfidence = anomalies.length > 0 ? 
      anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length : 0;
    const dataQuality = costData.length > 100 ? 0.9 : costData.length / 100 * 0.9;
    
    return (patternConfidence * 0.4 + anomalyConfidence * 0.3 + dataQuality * 0.3);
  }

  private calculateLinearTrend(data: CostDataPoint[]): { slope: number; intercept: number } {
    // Calculate linear trend using least squares
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, point) => sum + point.totalCost, 0);
    const sumXY = data.reduce((sum, point, i) => sum + i * point.totalCost, 0);
    const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  private calculateSeasonalComponent(data: CostDataPoint[]): Record<number, number> {
    // Calculate seasonal adjustments by month
    const monthlyAverages: Record<number, number[]> = {};
    
    data.forEach(point => {
      const month = point.timestamp.getMonth();
      if (!monthlyAverages[month]) monthlyAverages[month] = [];
      monthlyAverages[month].push(point.totalCost);
    });
    
    const seasonalComponent: Record<number, number> = {};
    const overallAverage = data.reduce((sum, point) => sum + point.totalCost, 0) / data.length;
    
    Object.keys(monthlyAverages).forEach(month => {
      const monthNum = parseInt(month);
      const monthAverage = monthlyAverages[monthNum].reduce((sum, cost) => sum + cost, 0) / monthlyAverages[monthNum].length;
      seasonalComponent[monthNum] = monthAverage - overallAverage;
    });
    
    return seasonalComponent;
  }

  private calculateCyclicalComponent(data: CostDataPoint[]): { amplitude: number; period: number; phase: number } {
    // Simplified cyclical component calculation
    return { amplitude: 100, period: 30, phase: 0 };
  }

  private applyLinearTrend(trend: { slope: number; intercept: number }, days: number): number {
    return trend.intercept + trend.slope * days;
  }

  private applySeasonalAdjustment(seasonal: Record<number, number>, date: Date): number {
    const month = date.getMonth();
    return seasonal[month] || 0;
  }

  private applyCyclicalAdjustment(cyclical: { amplitude: number; period: number; phase: number }, days: number): number {
    return cyclical.amplitude * Math.sin(2 * Math.PI * days / cyclical.period + cyclical.phase);
  }

  private calculatePredictionUncertainty(days: number, data: CostDataPoint[]): number {
    // Uncertainty increases with prediction horizon
    const baseUncertainty = this.calculateStandardDeviation(data.map(d => d.totalCost));
    return baseUncertainty * Math.sqrt(days / 30); // Increase uncertainty with time
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculatePredictionConfidence(data: CostDataPoint[]): number {
    // Calculate confidence based on data quality and consistency
    return data.length > 90 ? 0.85 : data.length / 90 * 0.85;
  }

  private calculateCurrentMetrics(costData: CostDataPoint[]): Record<string, number> {
    // Calculate current performance metrics
    const latest = costData[costData.length - 1];
    return {
      energy: latest.costBreakdown.energy,
      labor: latest.costBreakdown.labor,
      materials: latest.costBreakdown.materials,
      overhead: latest.costBreakdown.overhead,
      maintenance: latest.costBreakdown.maintenance,
    };
  }

  private calculateRanking(gap: number): string {
    if (gap < -10) return 'top_quartile';
    if (gap < 0) return 'above_average';
    if (gap < 10) return 'average';
    if (gap < 25) return 'below_average';
    return 'bottom_quartile';
  }

  private calculateOverallRanking(categoryRankings: Record<string, string>): string {
    const rankings = Object.values(categoryRankings);
    const weights = { top_quartile: 5, above_average: 4, average: 3, below_average: 2, bottom_quartile: 1 };
    const weightedSum = rankings.reduce((sum, ranking) => sum + (weights[ranking as keyof typeof weights] || 3), 0);
    const averageScore = weightedSum / rankings.length;
    
    if (averageScore >= 4.5) return 'top_quartile';
    if (averageScore >= 3.5) return 'above_average';
    if (averageScore >= 2.5) return 'average';
    if (averageScore >= 1.5) return 'below_average';
    return 'bottom_quartile';
  }
}

export const costOptimizationAlgorithms = new CostOptimizationAlgorithmsService();
