/**
 * A/B Testing Service
 * Framework for testing different recommendation algorithms and UI approaches
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export type ExperimentStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type VariantType = 'control' | 'treatment';
export type MetricType = 'conversion' | 'engagement' | 'performance' | 'satisfaction' | 'custom';

export interface ABExperiment {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  startDate: Date;
  endDate?: Date;
  targetAudience: AudienceSegment;
  variants: ExperimentVariant[];
  metrics: ExperimentMetric[];
  trafficAllocation: number; // Percentage of users to include (0-100)
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  type: VariantType;
  description: string;
  trafficWeight: number; // Percentage of experiment traffic (0-100)
  configuration: VariantConfiguration;
  isActive: boolean;
}

export interface VariantConfiguration {
  algorithmType?: 'frequency-based' | 'context-aware' | 'pattern-based' | 'ml-enhanced';
  uiComponent?: string;
  parameters?: Record<string, any>;
  features?: string[];
  overrides?: Record<string, any>;
}

export interface ExperimentMetric {
  id: string;
  name: string;
  type: MetricType;
  description: string;
  targetValue?: number;
  improvementThreshold: number; // Minimum improvement to consider significant
  isPrimary: boolean;
}

export interface AudienceSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria[];
  estimatedSize?: number;
}

export interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

export interface UserAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: Date;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ExperimentEvent {
  id: string;
  userId: string;
  sessionId: string;
  experimentId: string;
  variantId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ExperimentResults {
  experimentId: string;
  generatedAt: Date;
  totalParticipants: number;
  variantResults: VariantResults[];
  statisticalSignificance: StatisticalSignificance;
  recommendations: string[];
}

export interface VariantResults {
  variantId: string;
  variantName: string;
  participants: number;
  conversionRate: number;
  metrics: MetricResult[];
  confidence: number;
}

export interface MetricResult {
  metricId: string;
  metricName: string;
  value: number;
  improvement: number; // Percentage improvement over control
  pValue: number;
  isSignificant: boolean;
}

export interface StatisticalSignificance {
  overallSignificance: boolean;
  confidenceLevel: number;
  sampleSizeAdequate: boolean;
  recommendedAction: 'continue' | 'stop_winner' | 'stop_no_winner' | 'extend_duration';
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface ABTestingServiceConfig {
  defaultConfidenceLevel: number;
  minSampleSize: number;
  maxExperimentDuration: number; // in days
  enableAutoStop: boolean;
  significanceThreshold: number;
  cookieExpiration: number; // in days
  trackingEnabled: boolean;
}

const DEFAULT_CONFIG: ABTestingServiceConfig = {
  defaultConfidenceLevel: 0.95,
  minSampleSize: 100,
  maxExperimentDuration: 30,
  enableAutoStop: true,
  significanceThreshold: 0.05,
  cookieExpiration: 30,
  trackingEnabled: true,
};

// ============================================================================
// A/B Testing Service Class
// ============================================================================

export class ABTestingService {
  private config: ABTestingServiceConfig;
  private experiments: Map<string, ABExperiment>;
  private userAssignments: Map<string, UserAssignment[]>;
  private events: ExperimentEvent[];

  constructor(config: Partial<ABTestingServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.experiments = new Map();
    this.userAssignments = new Map();
    this.events = [];
  }

  // ============================================================================
  // Experiment Management
  // ============================================================================

  /**
   * Create a new A/B experiment
   */
  public createExperiment(experiment: Omit<ABExperiment, 'id' | 'createdAt' | 'updatedAt'>): ABExperiment {
    const newExperiment: ABExperiment = {
      ...experiment,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate experiment configuration
    this.validateExperiment(newExperiment);

    this.experiments.set(newExperiment.id, newExperiment);
    return newExperiment;
  }

  /**
   * Get experiment by ID
   */
  public getExperiment(experimentId: string): ABExperiment | null {
    return this.experiments.get(experimentId) || null;
  }

  /**
   * Get all active experiments
   */
  public getActiveExperiments(): ABExperiment[] {
    return Array.from(this.experiments.values()).filter(exp => exp.status === 'active');
  }

  /**
   * Start an experiment
   */
  public startExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'draft') {
      return false;
    }

    experiment.status = 'active';
    experiment.startDate = new Date();
    experiment.updatedAt = new Date();

    return true;
  }

  /**
   * Stop an experiment
   */
  public stopExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'active') {
      return false;
    }

    experiment.status = 'completed';
    experiment.endDate = new Date();
    experiment.updatedAt = new Date();

    return true;
  }

  // ============================================================================
  // User Assignment
  // ============================================================================

  /**
   * Assign user to experiment variant
   */
  public assignUserToExperiment(
    userId: string,
    experimentId: string,
    sessionId?: string
  ): UserAssignment | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'active') {
      return null;
    }

    // Check if user is already assigned
    const existingAssignment = this.getUserAssignment(userId, experimentId);
    if (existingAssignment) {
      return existingAssignment;
    }

    // Check if user qualifies for experiment
    if (!this.userQualifiesForExperiment(userId, experiment)) {
      return null;
    }

    // Assign to variant based on traffic allocation
    const variant = this.selectVariantForUser(userId, experiment);
    if (!variant) {
      return null;
    }

    const assignment: UserAssignment = {
      userId,
      experimentId,
      variantId: variant.id,
      assignedAt: new Date(),
      sessionId,
      metadata: {
        variantName: variant.name,
        variantType: variant.type,
      },
    };

    // Store assignment
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, []);
    }
    this.userAssignments.get(userId)!.push(assignment);

    return assignment;
  }

  /**
   * Get user's assignment for an experiment
   */
  public getUserAssignment(userId: string, experimentId: string): UserAssignment | null {
    const assignments = this.userAssignments.get(userId) || [];
    return assignments.find(a => a.experimentId === experimentId) || null;
  }

  /**
   * Get user's variant for an experiment
   */
  public getUserVariant(userId: string, experimentId: string): ExperimentVariant | null {
    const assignment = this.getUserAssignment(userId, experimentId);
    if (!assignment) {
      return null;
    }

    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    return experiment.variants.find(v => v.id === assignment.variantId) || null;
  }

  // ============================================================================
  // Event Tracking
  // ============================================================================

  /**
   * Track experiment event
   */
  public trackEvent(
    userId: string,
    sessionId: string,
    experimentId: string,
    eventType: string,
    eventData: Record<string, any> = {},
    metadata?: Record<string, any>
  ): void {
    if (!this.config.trackingEnabled) {
      return;
    }

    const assignment = this.getUserAssignment(userId, experimentId);
    if (!assignment) {
      return;
    }

    const event: ExperimentEvent = {
      id: this.generateId(),
      userId,
      sessionId,
      experimentId,
      variantId: assignment.variantId,
      eventType,
      eventData,
      timestamp: new Date(),
      metadata,
    };

    this.events.push(event);
  }

  /**
   * Track conversion event
   */
  public trackConversion(
    userId: string,
    sessionId: string,
    experimentId: string,
    conversionData: Record<string, any> = {}
  ): void {
    this.trackEvent(userId, sessionId, experimentId, 'conversion', conversionData);
  }

  // ============================================================================
  // Results and Analysis
  // ============================================================================

  /**
   * Get experiment results
   */
  public getExperimentResults(experimentId: string): ExperimentResults | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    const experimentEvents = this.events.filter(e => e.experimentId === experimentId);
    const assignments = Array.from(this.userAssignments.values())
      .flat()
      .filter(a => a.experimentId === experimentId);

    const variantResults = experiment.variants.map(variant => {
      const variantAssignments = assignments.filter(a => a.variantId === variant.id);
      const variantEvents = experimentEvents.filter(e => e.variantId === variant.id);
      
      const participants = variantAssignments.length;
      const conversions = variantEvents.filter(e => e.eventType === 'conversion').length;
      const conversionRate = participants > 0 ? conversions / participants : 0;

      const metrics = experiment.metrics.map(metric => {
        const metricEvents = variantEvents.filter(e => e.eventType === metric.name);
        const value = this.calculateMetricValue(metric, metricEvents);
        
        return {
          metricId: metric.id,
          metricName: metric.name,
          value,
          improvement: 0, // Will be calculated relative to control
          pValue: 0.5, // Simplified - would need proper statistical calculation
          isSignificant: false,
        };
      });

      return {
        variantId: variant.id,
        variantName: variant.name,
        participants,
        conversionRate,
        metrics,
        confidence: 0.95,
      };
    });

    // Calculate improvements relative to control
    const controlVariant = variantResults.find(v => 
      experiment.variants.find(variant => variant.id === v.variantId)?.type === 'control'
    );

    if (controlVariant) {
      variantResults.forEach(variant => {
        if (variant.variantId !== controlVariant.variantId) {
          variant.metrics.forEach((metric, index) => {
            const controlMetric = controlVariant.metrics[index];
            if (controlMetric && controlMetric.value > 0) {
              metric.improvement = ((metric.value - controlMetric.value) / controlMetric.value) * 100;
              metric.isSignificant = Math.abs(metric.improvement) > experiment.metrics[index].improvementThreshold;
            }
          });
        }
      });
    }

    const totalParticipants = variantResults.reduce((sum, v) => sum + v.participants, 0);
    const hasSignificantResults = variantResults.some(v => 
      v.metrics.some(m => m.isSignificant)
    );

    const statisticalSignificance: StatisticalSignificance = {
      overallSignificance: hasSignificantResults,
      confidenceLevel: this.config.defaultConfidenceLevel,
      sampleSizeAdequate: totalParticipants >= this.config.minSampleSize,
      recommendedAction: this.getRecommendedAction(experiment, variantResults),
    };

    return {
      experimentId,
      generatedAt: new Date(),
      totalParticipants,
      variantResults,
      statisticalSignificance,
      recommendations: this.generateRecommendations(experiment, variantResults),
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private validateExperiment(experiment: ABExperiment): void {
    // Validate traffic allocation
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.trafficWeight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error('Variant traffic weights must sum to 100%');
    }

    // Validate at least one control variant
    const hasControl = experiment.variants.some(v => v.type === 'control');
    if (!hasControl) {
      throw new Error('Experiment must have at least one control variant');
    }

    // Validate metrics
    if (experiment.metrics.length === 0) {
      throw new Error('Experiment must have at least one metric');
    }
  }

  private userQualifiesForExperiment(userId: string, experiment: ABExperiment): boolean {
    // Simplified qualification check
    // In a real implementation, this would check against audience criteria
    return Math.random() < (experiment.trafficAllocation / 100);
  }

  private selectVariantForUser(userId: string, experiment: ABExperiment): ExperimentVariant | null {
    // Use consistent hashing based on user ID for stable assignment
    const hash = this.hashString(userId + experiment.id);
    const normalizedHash = hash / 0xffffffff; // Normalize to 0-1

    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      if (!variant.isActive) continue;
      
      cumulativeWeight += variant.trafficWeight / 100;
      if (normalizedHash <= cumulativeWeight) {
        return variant;
      }
    }

    return null;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateMetricValue(metric: ExperimentMetric, events: ExperimentEvent[]): number {
    switch (metric.type) {
      case 'conversion':
        return events.length;
      case 'engagement':
        return events.reduce((sum, e) => sum + (e.eventData.duration || 0), 0) / Math.max(events.length, 1);
      case 'performance':
        return events.reduce((sum, e) => sum + (e.eventData.responseTime || 0), 0) / Math.max(events.length, 1);
      case 'satisfaction':
        return events.reduce((sum, e) => sum + (e.eventData.rating || 0), 0) / Math.max(events.length, 1);
      default:
        return events.reduce((sum, e) => sum + (e.eventData.value || 0), 0) / Math.max(events.length, 1);
    }
  }

  private getRecommendedAction(
    experiment: ABExperiment,
    results: VariantResults[]
  ): StatisticalSignificance['recommendedAction'] {
    const totalParticipants = results.reduce((sum, r) => sum + r.participants, 0);
    
    if (totalParticipants < this.config.minSampleSize) {
      return 'continue';
    }

    const hasSignificantWinner = results.some(r => 
      r.metrics.some(m => m.isSignificant && m.improvement > 0)
    );

    if (hasSignificantWinner) {
      return 'stop_winner';
    }

    const daysSinceStart = (Date.now() - experiment.startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceStart >= this.config.maxExperimentDuration) {
      return 'stop_no_winner';
    }

    return 'continue';
  }

  private generateRecommendations(
    experiment: ABExperiment,
    results: VariantResults[]
  ): string[] {
    const recommendations: string[] = [];
    
    const winner = results.find(r => 
      r.metrics.some(m => m.isSignificant && m.improvement > 0)
    );

    if (winner) {
      recommendations.push(`Implement variant "${winner.variantName}" as the winner`);
    } else {
      recommendations.push('No significant winner found - consider running longer or with different variants');
    }

    const lowParticipation = results.filter(r => r.participants < 50);
    if (lowParticipation.length > 0) {
      recommendations.push('Some variants have low participation - consider adjusting traffic allocation');
    }

    return recommendations;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const abTestingService = new ABTestingService();
