/**
 * Confidence Scoring Service
 * Provides confidence indicators for recommendations, patterns, and smart defaults
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export type ConfidenceLevel = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

export interface ConfidenceScore {
  score: number; // 0-1 range
  level: ConfidenceLevel;
  factors: ConfidenceFactor[];
  explanation: string;
  visualIndicator: VisualIndicator;
  reliability: number; // How reliable is this confidence score itself
}

export interface ConfidenceFactor {
  name: string;
  weight: number;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface VisualIndicator {
  color: string;
  icon: string;
  label: string;
  description: string;
  cssClass: string;
}

export interface ConfidenceContext {
  dataSource: string;
  sampleSize: number;
  timeRange: string;
  userExperience: 'novice' | 'intermediate' | 'expert';
  domainComplexity: 'simple' | 'moderate' | 'complex';
  historicalAccuracy?: number;
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface ConfidenceScoringConfig {
  thresholds: {
    veryLow: number;
    low: number;
    medium: number;
    high: number;
    veryHigh: number;
  };
  factorWeights: {
    dataQuality: number;
    sampleSize: number;
    recency: number;
    consistency: number;
    userFeedback: number;
    domainExpertise: number;
  };
  visualTheme: 'default' | 'colorblind-friendly' | 'high-contrast';
}

const DEFAULT_CONFIG: ConfidenceScoringConfig = {
  thresholds: {
    veryLow: 0.2,
    low: 0.4,
    medium: 0.6,
    high: 0.8,
    veryHigh: 1.0,
  },
  factorWeights: {
    dataQuality: 0.25,
    sampleSize: 0.2,
    recency: 0.15,
    consistency: 0.15,
    userFeedback: 0.15,
    domainExpertise: 0.1,
  },
  visualTheme: 'default',
};

// ============================================================================
// Confidence Scoring Service Class
// ============================================================================

export class ConfidenceScoringService {
  private config: ConfidenceScoringConfig;

  constructor(config: Partial<ConfidenceScoringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Public API Methods
  // ============================================================================

  /**
   * Calculate confidence score for recommendations
   */
  public calculateRecommendationConfidence(
    recommendationData: {
      frequency: number;
      successRate: number;
      recency: number;
      similarity: number;
      userFeedback?: number;
    },
    context: ConfidenceContext
  ): ConfidenceScore {
    const factors: ConfidenceFactor[] = [
      {
        name: 'Data Quality',
        weight: this.config.factorWeights.dataQuality,
        value: this.assessDataQuality(recommendationData, context),
        impact: 'positive',
        description: 'Quality and completeness of underlying data',
      },
      {
        name: 'Sample Size',
        weight: this.config.factorWeights.sampleSize,
        value: this.assessSampleSize(context.sampleSize),
        impact: 'positive',
        description: 'Amount of historical data available',
      },
      {
        name: 'Recency',
        weight: this.config.factorWeights.recency,
        value: recommendationData.recency,
        impact: 'positive',
        description: 'How recent the supporting data is',
      },
      {
        name: 'Consistency',
        weight: this.config.factorWeights.consistency,
        value: recommendationData.successRate,
        impact: 'positive',
        description: 'Consistency of results across similar cases',
      },
    ];

    if (recommendationData.userFeedback !== undefined) {
      factors.push({
        name: 'User Feedback',
        weight: this.config.factorWeights.userFeedback,
        value: recommendationData.userFeedback,
        impact: 'positive',
        description: 'User acceptance rate for similar recommendations',
      });
    }

    factors.push({
      name: 'Domain Expertise',
      weight: this.config.factorWeights.domainExpertise,
      value: this.assessDomainExpertise(context),
      impact: 'positive',
      description: 'System expertise in this domain area',
    });

    const score = this.calculateWeightedScore(factors);
    const level = this.getConfidenceLevel(score);
    const visualIndicator = this.getVisualIndicator(level);
    const explanation = this.generateExplanation(factors, level);
    const reliability = this.calculateReliability(factors, context);

    return {
      score,
      level,
      factors,
      explanation,
      visualIndicator,
      reliability,
    };
  }

  /**
   * Calculate confidence score for pattern recognition
   */
  public calculatePatternConfidence(
    patternData: {
      frequency: number;
      consistency: number;
      significance: number;
      coverage: number;
    },
    context: ConfidenceContext
  ): ConfidenceScore {
    const factors: ConfidenceFactor[] = [
      {
        name: 'Pattern Frequency',
        weight: 0.3,
        value: Math.min(patternData.frequency / 10, 1), // Normalize to 0-1
        impact: 'positive',
        description: 'How often this pattern occurs',
      },
      {
        name: 'Consistency',
        weight: 0.25,
        value: patternData.consistency,
        impact: 'positive',
        description: 'How consistent the pattern is across data',
      },
      {
        name: 'Statistical Significance',
        weight: 0.25,
        value: patternData.significance,
        impact: 'positive',
        description: 'Statistical significance of the pattern',
      },
      {
        name: 'Data Coverage',
        weight: 0.2,
        value: patternData.coverage,
        impact: 'positive',
        description: 'Percentage of data that supports this pattern',
      },
    ];

    const score = this.calculateWeightedScore(factors);
    const level = this.getConfidenceLevel(score);
    const visualIndicator = this.getVisualIndicator(level);
    const explanation = this.generateExplanation(factors, level);
    const reliability = this.calculateReliability(factors, context);

    return {
      score,
      level,
      factors,
      explanation,
      visualIndicator,
      reliability,
    };
  }

  /**
   * Calculate confidence score for smart defaults
   */
  public calculateDefaultConfidence(
    defaultData: {
      frequency: number;
      contextMatch: number;
      patternStrength: number;
      userAcceptance?: number;
    },
    context: ConfidenceContext
  ): ConfidenceScore {
    const factors: ConfidenceFactor[] = [
      {
        name: 'Usage Frequency',
        weight: 0.35,
        value: Math.min(defaultData.frequency / 10, 1),
        impact: 'positive',
        description: 'How frequently this value has been used',
      },
      {
        name: 'Context Match',
        weight: 0.3,
        value: defaultData.contextMatch,
        impact: 'positive',
        description: 'How well this matches current context',
      },
      {
        name: 'Pattern Strength',
        weight: 0.25,
        value: defaultData.patternStrength,
        impact: 'positive',
        description: 'Strength of supporting usage patterns',
      },
    ];

    if (defaultData.userAcceptance !== undefined) {
      factors.push({
        name: 'User Acceptance',
        weight: 0.1,
        value: defaultData.userAcceptance,
        impact: 'positive',
        description: 'Rate at which users accept this default',
      });
    }

    const score = this.calculateWeightedScore(factors);
    const level = this.getConfidenceLevel(score);
    const visualIndicator = this.getVisualIndicator(level);
    const explanation = this.generateExplanation(factors, level);
    const reliability = this.calculateReliability(factors, context);

    return {
      score,
      level,
      factors,
      explanation,
      visualIndicator,
      reliability,
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private calculateWeightedScore(factors: ConfidenceFactor[]): number {
    const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
    const weightedSum = factors.reduce((sum, factor) => {
      const adjustedValue = factor.impact === 'negative' ? 1 - factor.value : factor.value;
      return sum + (adjustedValue * factor.weight);
    }, 0);

    return Math.min(Math.max(weightedSum / totalWeight, 0), 1);
  }

  private getConfidenceLevel(score: number): ConfidenceLevel {
    const thresholds = this.config.thresholds;
    
    if (score >= thresholds.veryHigh) return 'very-high';
    if (score >= thresholds.high) return 'high';
    if (score >= thresholds.medium) return 'medium';
    if (score >= thresholds.low) return 'low';
    return 'very-low';
  }

  private getVisualIndicator(level: ConfidenceLevel): VisualIndicator {
    const indicators: Record<ConfidenceLevel, VisualIndicator> = {
      'very-high': {
        color: '#10B981', // Green
        icon: 'check-circle',
        label: 'Very High',
        description: 'Highly confident recommendation',
        cssClass: 'confidence-very-high text-green-600 bg-green-100 border-green-200',
      },
      'high': {
        color: '#059669', // Dark Green
        icon: 'check',
        label: 'High',
        description: 'Confident recommendation',
        cssClass: 'confidence-high text-green-700 bg-green-50 border-green-300',
      },
      'medium': {
        color: '#D97706', // Orange
        icon: 'exclamation',
        label: 'Medium',
        description: 'Moderately confident',
        cssClass: 'confidence-medium text-yellow-600 bg-yellow-100 border-yellow-200',
      },
      'low': {
        color: '#DC2626', // Red
        icon: 'question-mark-circle',
        label: 'Low',
        description: 'Low confidence - use with caution',
        cssClass: 'confidence-low text-orange-600 bg-orange-100 border-orange-200',
      },
      'very-low': {
        color: '#991B1B', // Dark Red
        icon: 'x-circle',
        label: 'Very Low',
        description: 'Very low confidence - not recommended',
        cssClass: 'confidence-very-low text-red-600 bg-red-100 border-red-200',
      },
    };

    return indicators[level];
  }

  private generateExplanation(factors: ConfidenceFactor[], level: ConfidenceLevel): string {
    const topFactors = factors
      .sort((a, b) => (b.value * b.weight) - (a.value * a.weight))
      .slice(0, 2);

    const levelDescriptions: Record<ConfidenceLevel, string> = {
      'very-high': 'This recommendation has very high confidence based on',
      'high': 'This recommendation has high confidence based on',
      'medium': 'This recommendation has moderate confidence based on',
      'low': 'This recommendation has low confidence due to',
      'very-low': 'This recommendation has very low confidence due to',
    };

    const factorDescriptions = topFactors.map(factor => 
      `${factor.name.toLowerCase()} (${Math.round(factor.value * 100)}%)`
    ).join(' and ');

    return `${levelDescriptions[level]} ${factorDescriptions}.`;
  }

  private assessDataQuality(data: any, context: ConfidenceContext): number {
    let quality = 0.5; // Base quality

    // Assess completeness
    const completeness = Object.values(data).filter(v => v !== undefined && v !== null).length / Object.keys(data).length;
    quality += completeness * 0.3;

    // Assess recency
    if (data.recency > 0.7) quality += 0.1;
    if (data.recency < 0.3) quality -= 0.1;

    // Assess sample size impact
    if (context.sampleSize > 100) quality += 0.1;
    if (context.sampleSize < 10) quality -= 0.2;

    return Math.min(Math.max(quality, 0), 1);
  }

  private assessSampleSize(sampleSize: number): number {
    // Logarithmic scaling for sample size confidence
    if (sampleSize <= 1) return 0.1;
    if (sampleSize >= 1000) return 1.0;
    
    return Math.log10(sampleSize) / 3; // Log scale from 1 to 1000
  }

  private assessDomainExpertise(context: ConfidenceContext): number {
    const complexityPenalty: Record<string, number> = {
      'simple': 0.9,
      'moderate': 0.7,
      'complex': 0.5,
    };

    const experienceBonus: Record<string, number> = {
      'novice': 0.6,
      'intermediate': 0.8,
      'expert': 1.0,
    };

    return complexityPenalty[context.domainComplexity] * experienceBonus[context.userExperience];
  }

  private calculateReliability(factors: ConfidenceFactor[], context: ConfidenceContext): number {
    // Reliability of the confidence score itself
    let reliability = 0.7; // Base reliability

    // More factors = more reliable
    reliability += Math.min(factors.length * 0.05, 0.2);

    // Larger sample size = more reliable
    reliability += Math.min(context.sampleSize / 1000, 0.1);

    // Historical accuracy improves reliability
    if (context.historicalAccuracy) {
      reliability += context.historicalAccuracy * 0.2;
    }

    return Math.min(Math.max(reliability, 0), 1);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const confidenceScoringService = new ConfidenceScoringService();
