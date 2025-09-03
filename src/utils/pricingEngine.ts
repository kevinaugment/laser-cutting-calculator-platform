/**
 * Advanced Pricing Engine for Dynamic Pricing Optimization
 * Provides AI-powered pricing algorithms and market intelligence
 */

export interface PricingEngine {
  calculateCompetitivePricing(marketData: MarketData): PricingRecommendation;
  calculateValueBasedPricing(valueProps: ValueProposition[]): PricingStrategy;
  optimizeProfitMargins(costs: CostStructure, constraints: PricingConstraints): OptimalPricing;
  performBreakEvenAnalysis(fixedCosts: number, variableCosts: number): BreakEvenPoint;
  calculateDynamicPricing(marketConditions: MarketConditions): DynamicPricingModel;
}

export interface MarketData {
  competitorPrices: CompetitorPrice[];
  marketTrends: MarketTrend[];
  demandElasticity: number;
  seasonalFactors: SeasonalFactor[];
  customerSegments: CustomerSegment[];
}

export interface CompetitorPrice {
  competitor: string;
  price: number;
  marketShare: number;
  serviceLevel: 'basic' | 'standard' | 'premium';
  lastUpdated: Date;
}

export interface MarketTrend {
  period: string;
  priceChange: number;
  volumeChange: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface ValueProposition {
  category: string;
  value: number;
  confidence: number;
  timeframe: string;
  measurable: boolean;
}

export interface PricingRecommendation {
  recommendedPrice: number;
  priceRange: PriceRange;
  confidence: number;
  marketPosition: 'premium' | 'competitive' | 'value' | 'discount';
  reasoning: string[];
  riskFactors: RiskFactor[];
}

export interface PriceRange {
  minimum: number;
  optimal: number;
  maximum: number;
}

export interface PricingStrategy {
  basePrice: number;
  valueMultiplier: number;
  adjustments: PriceAdjustment[];
  totalValue: number;
  capturedValue: number;
  strategy: string;
}

export interface PriceAdjustment {
  factor: string;
  adjustment: number;
  reasoning: string;
}

export interface CostStructure {
  fixedCosts: number;
  variableCosts: number;
  overheadRate: number;
  targetMargin: number;
}

export interface PricingConstraints {
  minimumMargin: number;
  maximumPrice: number;
  competitorPrices: number[];
  customerBudget?: number;
}

export interface OptimalPricing {
  optimalPrice: number;
  achievedMargin: number;
  volumeImpact: number;
  revenueProjection: number;
  scenarios: PricingScenario[];
}

export interface PricingScenario {
  name: string;
  price: number;
  margin: number;
  volume: number;
  revenue: number;
  probability: number;
}

export interface BreakEvenPoint {
  units: number;
  revenue: number;
  timeToBreakEven: number;
  marginOfSafety: number;
  sensitivityAnalysis: SensitivityAnalysis;
}

export interface SensitivityAnalysis {
  priceChange: { change: number; impact: number }[];
  volumeChange: { change: number; impact: number }[];
  costChange: { change: number; impact: number }[];
}

export interface MarketConditions {
  demand: 'low' | 'medium' | 'high' | 'peak';
  competition: 'low' | 'medium' | 'high' | 'intense';
  seasonality: number;
  economicIndicators: EconomicIndicator[];
}

export interface DynamicPricingModel {
  basePrice: number;
  dynamicAdjustments: DynamicAdjustment[];
  finalPrice: number;
  updateFrequency: string;
  triggers: PricingTrigger[];
}

export interface DynamicAdjustment {
  factor: string;
  multiplier: number;
  impact: number;
}

export interface SeasonalFactor {
  period: string;
  multiplier: number;
  confidence: number;
}

export interface CustomerSegment {
  segment: string;
  priceElasticity: number;
  averageOrderValue: number;
  loyaltyFactor: number;
}

export interface RiskFactor {
  risk: string;
  probability: number;
  impact: string;
  mitigation: string;
}

export interface EconomicIndicator {
  indicator: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  impact: number;
}

export interface PricingTrigger {
  condition: string;
  threshold: number;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

export class AdvancedPricingEngine implements PricingEngine {
  private marketCache: Map<string, MarketData> = new Map();
  private pricingHistory: Map<string, PricingRecommendation[]> = new Map();

  calculateCompetitivePricing(marketData: MarketData): PricingRecommendation {
    // Analyze competitor pricing patterns
    const competitorAnalysis = this.analyzeCompetitorPricing(marketData.competitorPrices);
    
    // Calculate market position
    const marketPosition = this.determineMarketPosition(competitorAnalysis);
    
    // Apply market trends
    const trendAdjustment = this.calculateTrendAdjustment(marketData.marketTrends);
    
    // Calculate recommended price
    const basePrice = competitorAnalysis.averagePrice;
    const adjustedPrice = basePrice * (1 + trendAdjustment);
    
    // Determine price range
    const priceRange = this.calculatePriceRange(adjustedPrice, competitorAnalysis);
    
    // Assess confidence and risks
    const confidence = this.calculatePricingConfidence(marketData);
    const riskFactors = this.identifyRiskFactors(marketData, adjustedPrice);
    
    return {
      recommendedPrice: Math.round(adjustedPrice * 100) / 100,
      priceRange,
      confidence,
      marketPosition,
      reasoning: this.generatePricingReasoning(competitorAnalysis, trendAdjustment),
      riskFactors,
    };
  }

  calculateValueBasedPricing(valueProps: ValueProposition[]): PricingStrategy {
    // Calculate total customer value
    const totalValue = valueProps.reduce((sum, prop) => sum + prop.value, 0);
    
    // Apply confidence weighting
    const weightedValue = valueProps.reduce((sum, prop) => {
      return sum + (prop.value * prop.confidence / 100);
    }, 0);
    
    // Determine value capture rate
    const captureRate = this.calculateValueCaptureRate(valueProps);
    
    // Calculate base price from value
    const basePrice = weightedValue * captureRate;
    
    // Apply adjustments
    const adjustments = this.calculateValueAdjustments(valueProps);
    
    // Determine strategy
    const strategy = this.determineValueStrategy(totalValue, captureRate);
    
    return {
      basePrice: Math.round(basePrice * 100) / 100,
      valueMultiplier: captureRate,
      adjustments,
      totalValue: Math.round(totalValue * 100) / 100,
      capturedValue: Math.round(basePrice * 100) / 100,
      strategy,
    };
  }

  optimizeProfitMargins(costs: CostStructure, constraints: PricingConstraints): OptimalPricing {
    // Calculate minimum viable price
    const minimumPrice = costs.variableCosts * (1 + constraints.minimumMargin / 100);
    
    // Generate pricing scenarios
    const scenarios = this.generatePricingScenarios(costs, constraints);
    
    // Find optimal scenario
    const optimalScenario = this.findOptimalScenario(scenarios);
    
    // Calculate volume impact
    const volumeImpact = this.calculateVolumeImpact(optimalScenario.price, constraints);
    
    // Project revenue
    const revenueProjection = optimalScenario.price * optimalScenario.volume;
    
    return {
      optimalPrice: optimalScenario.price,
      achievedMargin: optimalScenario.margin,
      volumeImpact,
      revenueProjection,
      scenarios,
    };
  }

  performBreakEvenAnalysis(fixedCosts: number, variableCosts: number, sellingPrice: number): BreakEvenPoint {
    // Calculate break-even units
    const contributionMargin = sellingPrice - variableCosts;
    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
    
    // Calculate break-even revenue
    const breakEvenRevenue = breakEvenUnits * sellingPrice;
    
    // Estimate time to break-even (assuming monthly fixed costs)
    const timeToBreakEven = this.estimateTimeToBreakEven(breakEvenUnits);
    
    // Calculate margin of safety
    const marginOfSafety = this.calculateMarginOfSafety(contributionMargin, fixedCosts);
    
    // Perform sensitivity analysis
    const sensitivityAnalysis = this.performSensitivityAnalysis(
      fixedCosts,
      variableCosts,
      sellingPrice
    );
    
    return {
      units: breakEvenUnits,
      revenue: Math.round(breakEvenRevenue * 100) / 100,
      timeToBreakEven,
      marginOfSafety,
      sensitivityAnalysis,
    };
  }

  calculateDynamicPricing(marketConditions: MarketConditions): DynamicPricingModel {
    // Calculate base price (this would typically come from other pricing methods)
    const basePrice = 100; // Placeholder
    
    // Apply dynamic adjustments
    const dynamicAdjustments = this.calculateDynamicAdjustments(marketConditions);
    
    // Calculate final price
    const finalPrice = dynamicAdjustments.reduce((price, adj) => {
      return price * adj.multiplier;
    }, basePrice);
    
    // Define update frequency
    const updateFrequency = this.determineUpdateFrequency(marketConditions);
    
    // Set pricing triggers
    const triggers = this.definePricingTriggers(marketConditions);
    
    return {
      basePrice,
      dynamicAdjustments,
      finalPrice: Math.round(finalPrice * 100) / 100,
      updateFrequency,
      triggers,
    };
  }

  private analyzeCompetitorPricing(competitors: CompetitorPrice[]) {
    const prices = competitors.map(c => c.price);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Calculate weighted average by market share
    const weightedAverage = competitors.reduce((sum, comp) => {
      return sum + (comp.price * comp.marketShare / 100);
    }, 0);
    
    return {
      averagePrice,
      weightedAverage,
      minPrice,
      maxPrice,
      priceSpread: maxPrice - minPrice,
      competitorCount: competitors.length,
    };
  }

  private determineMarketPosition(analysis: any): 'premium' | 'competitive' | 'value' | 'discount' {
    const { averagePrice, minPrice, maxPrice } = analysis;
    const range = maxPrice - minPrice;
    
    if (range < averagePrice * 0.1) return 'competitive'; // Tight market
    if (averagePrice > minPrice + range * 0.7) return 'premium';
    if (averagePrice < minPrice + range * 0.3) return 'discount';
    return 'value';
  }

  private calculateTrendAdjustment(trends: MarketTrend[]): number {
    if (trends.length === 0) return 0;
    
    const recentTrends = trends.slice(-3); // Last 3 periods
    const avgPriceChange = recentTrends.reduce((sum, trend) => sum + trend.priceChange, 0) / recentTrends.length;
    
    // Apply dampening factor to avoid overreaction
    return avgPriceChange * 0.5;
  }

  private calculatePriceRange(basePrice: number, analysis: any): PriceRange {
    const spread = analysis.priceSpread * 0.1; // 10% of market spread
    
    return {
      minimum: Math.max(basePrice - spread, analysis.minPrice * 0.95),
      optimal: basePrice,
      maximum: Math.min(basePrice + spread, analysis.maxPrice * 1.05),
    };
  }

  private calculatePricingConfidence(marketData: MarketData): number {
    let confidence = 70; // Base confidence
    
    // More competitors = higher confidence
    if (marketData.competitorPrices.length > 5) confidence += 10;
    
    // Recent data = higher confidence
    const recentData = marketData.competitorPrices.filter(
      c => Date.now() - c.lastUpdated.getTime() < 30 * 24 * 60 * 60 * 1000 // 30 days
    );
    confidence += (recentData.length / marketData.competitorPrices.length) * 20;
    
    return Math.min(95, confidence);
  }

  private identifyRiskFactors(marketData: MarketData, price: number): RiskFactor[] {
    const risks: RiskFactor[] = [];
    
    // Price volatility risk
    const priceVolatility = this.calculatePriceVolatility(marketData.marketTrends);
    if (priceVolatility > 0.1) {
      risks.push({
        risk: 'High price volatility in market',
        probability: 60,
        impact: 'Medium revenue variance',
        mitigation: 'Implement dynamic pricing adjustments',
      });
    }
    
    // Competition risk
    if (marketData.competitorPrices.length > 10) {
      risks.push({
        risk: 'Intense competition may pressure prices',
        probability: 70,
        impact: 'Margin compression',
        mitigation: 'Focus on value differentiation',
      });
    }
    
    return risks;
  }

  private calculatePriceVolatility(trends: MarketTrend[]): number {
    if (trends.length < 2) return 0;
    
    const changes = trends.map(t => t.priceChange);
    const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / changes.length;
    
    return Math.sqrt(variance);
  }

  private generatePricingReasoning(analysis: any, trendAdjustment: number): string[] {
    const reasoning: string[] = [];
    
    reasoning.push(`Market average price: $${analysis.averagePrice.toFixed(2)}`);
    
    if (Math.abs(trendAdjustment) > 0.02) {
      const direction = trendAdjustment > 0 ? 'upward' : 'downward';
      reasoning.push(`Applied ${direction} trend adjustment of ${(trendAdjustment * 100).toFixed(1)}%`);
    }
    
    if (analysis.priceSpread > analysis.averagePrice * 0.2) {
      reasoning.push('Wide price spread indicates pricing flexibility');
    }
    
    return reasoning;
  }

  private calculateValueCaptureRate(valueProps: ValueProposition[]): number {
    // Base capture rate
    let captureRate = 0.3; // 30% default
    
    // Adjust based on measurability
    const measurableProps = valueProps.filter(p => p.measurable);
    if (measurableProps.length / valueProps.length > 0.7) {
      captureRate += 0.1; // Higher capture for measurable value
    }
    
    // Adjust based on confidence
    const avgConfidence = valueProps.reduce((sum, p) => sum + p.confidence, 0) / valueProps.length;
    captureRate += (avgConfidence - 70) / 1000; // Adjust based on confidence
    
    return Math.min(0.6, Math.max(0.2, captureRate)); // Cap between 20-60%
  }

  private calculateValueAdjustments(valueProps: ValueProposition[]): PriceAdjustment[] {
    const adjustments: PriceAdjustment[] = [];
    
    // Time-sensitive value gets premium
    const urgentValue = valueProps.filter(p => p.timeframe === 'immediate');
    if (urgentValue.length > 0) {
      adjustments.push({
        factor: 'Urgency Premium',
        adjustment: 0.15,
        reasoning: 'Time-sensitive value justifies premium pricing',
      });
    }
    
    // High-confidence value gets premium
    const highConfidenceValue = valueProps.filter(p => p.confidence > 90);
    if (highConfidenceValue.length > valueProps.length * 0.5) {
      adjustments.push({
        factor: 'Confidence Premium',
        adjustment: 0.1,
        reasoning: 'High confidence in value delivery',
      });
    }
    
    return adjustments;
  }

  private determineValueStrategy(totalValue: number, captureRate: number): string {
    if (captureRate > 0.5) return 'Premium Value Capture';
    if (captureRate > 0.4) return 'High Value Strategy';
    if (captureRate > 0.3) return 'Balanced Value Strategy';
    return 'Conservative Value Strategy';
  }

  private generatePricingScenarios(costs: CostStructure, constraints: PricingConstraints): PricingScenario[] {
    const scenarios: PricingScenario[] = [];
    const basePrice = costs.variableCosts * (1 + costs.targetMargin / 100);
    
    // Conservative scenario
    scenarios.push({
      name: 'Conservative',
      price: basePrice * 0.95,
      margin: (basePrice * 0.95 - costs.variableCosts) / (basePrice * 0.95) * 100,
      volume: 120, // Higher volume due to lower price
      revenue: basePrice * 0.95 * 120,
      probability: 80,
    });
    
    // Optimal scenario
    scenarios.push({
      name: 'Optimal',
      price: basePrice,
      margin: costs.targetMargin,
      volume: 100,
      revenue: basePrice * 100,
      probability: 70,
    });
    
    // Aggressive scenario
    scenarios.push({
      name: 'Aggressive',
      price: basePrice * 1.1,
      margin: (basePrice * 1.1 - costs.variableCosts) / (basePrice * 1.1) * 100,
      volume: 80, // Lower volume due to higher price
      revenue: basePrice * 1.1 * 80,
      probability: 50,
    });
    
    return scenarios;
  }

  private findOptimalScenario(scenarios: PricingScenario[]): PricingScenario {
    // Find scenario with highest expected value (revenue * probability)
    return scenarios.reduce((best, current) => {
      const currentExpectedValue = current.revenue * (current.probability / 100);
      const bestExpectedValue = best.revenue * (best.probability / 100);
      return currentExpectedValue > bestExpectedValue ? current : best;
    });
  }

  private calculateVolumeImpact(price: number, constraints: PricingConstraints): number {
    // Simplified price elasticity calculation
    const avgCompetitorPrice = constraints.competitorPrices.reduce((sum, p) => sum + p, 0) / constraints.competitorPrices.length;
    const priceRatio = price / avgCompetitorPrice;
    
    // Assume elasticity of -1.5 (15% volume decrease for 10% price increase)
    return (1 - priceRatio) * 1.5 * 100;
  }

  private estimateTimeToBreakEven(units: number): number {
    // Assume average production rate of 50 units per month
    const monthlyProduction = 50;
    return Math.ceil(units / monthlyProduction);
  }

  private calculateMarginOfSafety(contributionMargin: number, fixedCosts: number): number {
    // Margin of safety as percentage
    const breakEvenRevenue = fixedCosts / (contributionMargin / 100); // Assuming 100 as base price
    const currentRevenue = 150 * 100; // Assumed current volume * price
    
    return ((currentRevenue - breakEvenRevenue) / currentRevenue) * 100;
  }

  private performSensitivityAnalysis(fixedCosts: number, variableCosts: number, sellingPrice: number): SensitivityAnalysis {
    const baseBreakEven = fixedCosts / (sellingPrice - variableCosts);
    
    return {
      priceChange: [
        { change: -10, impact: this.calculateBreakEvenChange(fixedCosts, variableCosts, sellingPrice * 0.9, baseBreakEven) },
        { change: -5, impact: this.calculateBreakEvenChange(fixedCosts, variableCosts, sellingPrice * 0.95, baseBreakEven) },
        { change: 5, impact: this.calculateBreakEvenChange(fixedCosts, variableCosts, sellingPrice * 1.05, baseBreakEven) },
        { change: 10, impact: this.calculateBreakEvenChange(fixedCosts, variableCosts, sellingPrice * 1.1, baseBreakEven) },
      ],
      volumeChange: [
        { change: -20, impact: -20 },
        { change: -10, impact: -10 },
        { change: 10, impact: 10 },
        { change: 20, impact: 20 },
      ],
      costChange: [
        { change: -10, impact: this.calculateBreakEvenChange(fixedCosts * 0.9, variableCosts, sellingPrice, baseBreakEven) },
        { change: -5, impact: this.calculateBreakEvenChange(fixedCosts * 0.95, variableCosts, sellingPrice, baseBreakEven) },
        { change: 5, impact: this.calculateBreakEvenChange(fixedCosts * 1.05, variableCosts, sellingPrice, baseBreakEven) },
        { change: 10, impact: this.calculateBreakEvenChange(fixedCosts * 1.1, variableCosts, sellingPrice, baseBreakEven) },
      ],
    };
  }

  private calculateBreakEvenChange(fixedCosts: number, variableCosts: number, sellingPrice: number, baseBreakEven: number): number {
    const newBreakEven = fixedCosts / (sellingPrice - variableCosts);
    return ((newBreakEven - baseBreakEven) / baseBreakEven) * 100;
  }

  private calculateDynamicAdjustments(conditions: MarketConditions): DynamicAdjustment[] {
    const adjustments: DynamicAdjustment[] = [];
    
    // Demand adjustment
    const demandMultipliers = { low: 0.9, medium: 1.0, high: 1.1, peak: 1.2 };
    adjustments.push({
      factor: 'Demand Level',
      multiplier: demandMultipliers[conditions.demand],
      impact: (demandMultipliers[conditions.demand] - 1) * 100,
    });
    
    // Competition adjustment
    const competitionMultipliers = { low: 1.1, medium: 1.0, high: 0.95, intense: 0.9 };
    adjustments.push({
      factor: 'Competition Level',
      multiplier: competitionMultipliers[conditions.competition],
      impact: (competitionMultipliers[conditions.competition] - 1) * 100,
    });
    
    // Seasonal adjustment
    adjustments.push({
      factor: 'Seasonality',
      multiplier: 1 + conditions.seasonality,
      impact: conditions.seasonality * 100,
    });
    
    return adjustments;
  }

  private determineUpdateFrequency(conditions: MarketConditions): string {
    if (conditions.demand === 'peak' || conditions.competition === 'intense') {
      return 'Daily';
    } else if (conditions.demand === 'high' || conditions.competition === 'high') {
      return 'Weekly';
    } else {
      return 'Monthly';
    }
  }

  private definePricingTriggers(conditions: MarketConditions): PricingTrigger[] {
    const triggers: PricingTrigger[] = [];
    
    triggers.push({
      condition: 'Competitor price change',
      threshold: 5, // 5% change
      action: 'Review and adjust pricing',
      priority: 'high',
    });
    
    triggers.push({
      condition: 'Demand surge',
      threshold: 20, // 20% increase
      action: 'Increase prices by 5-10%',
      priority: 'medium',
    });
    
    triggers.push({
      condition: 'Capacity utilization',
      threshold: 90, // 90% utilization
      action: 'Implement premium pricing',
      priority: 'high',
    });
    
    return triggers;
  }
}

// Export singleton instance
export const advancedPricingEngine = new AdvancedPricingEngine();
