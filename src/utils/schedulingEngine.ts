/**
 * Advanced Scheduling Engine for Time Management Optimization
 * Provides AI-powered scheduling algorithms and predictive analytics
 */

export interface SchedulingEngine {
  optimizeJobSequence(jobs: Job[]): OptimizedSchedule;
  predictDowntime(historicalData: DowntimeData[]): DowntimePrediction;
  calculateSetupTimes(transitions: JobTransition[]): SetupTimeMatrix;
  optimizeBatches(orders: Order[]): BatchConfiguration;
  analyzeWorkflowBottlenecks(workflow: WorkflowStep[]): BottleneckAnalysis;
}

export interface Job {
  id: string;
  materialType: string;
  thickness: number;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  setupRequirements: SetupRequirement[];
  complexity: 'simple' | 'medium' | 'complex';
}

export interface OptimizedSchedule {
  jobs: ScheduledJob[];
  totalSetupTime: number;
  totalProductionTime: number;
  efficiency: number;
  setupReductions: number;
  recommendations: SchedulingRecommendation[];
}

export interface ScheduledJob extends Job {
  scheduledStart: Date;
  scheduledEnd: Date;
  setupTime: number;
  position: number;
  groupId?: string;
}

export interface DowntimeData {
  timestamp: Date;
  type: 'planned' | 'unplanned' | 'setup' | 'material' | 'operator' | 'quality';
  duration: number;
  cause: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export interface DowntimePrediction {
  predictedEvents: PredictedDowntime[];
  riskScore: number;
  preventiveActions: PreventiveAction[];
  confidenceLevel: number;
}

export interface PredictedDowntime {
  type: string;
  probability: number;
  estimatedDuration: number;
  timeframe: string;
  riskFactors: string[];
}

export interface JobTransition {
  fromJob: Job;
  toJob: Job;
  setupTime: number;
  complexity: number;
}

export interface SetupTimeMatrix {
  matrix: number[][];
  materialGroups: MaterialGroup[];
  optimizationOpportunities: SetupOptimization[];
}

export interface Order {
  id: string;
  parts: Part[];
  dueDate: Date;
  priority: number;
  customerType: 'standard' | 'premium' | 'strategic';
}

export interface Part {
  materialType: string;
  thickness: number;
  quantity: number;
  processingTime: number;
}

export interface BatchConfiguration {
  batches: Batch[];
  totalBatches: number;
  utilizationRate: number;
  timeReduction: number;
  recommendations: BatchRecommendation[];
}

export interface Batch {
  id: string;
  orders: Order[];
  materialType: string;
  thickness: number;
  totalQuantity: number;
  estimatedTime: number;
  efficiency: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  duration: number;
  dependencies: string[];
  resources: Resource[];
  bottleneckPotential: number;
}

export interface BottleneckAnalysis {
  bottlenecks: Bottleneck[];
  criticalPath: string[];
  improvementOpportunities: WorkflowImprovement[];
  efficiencyScore: number;
}

export interface Bottleneck {
  stepId: string;
  stepName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  causes: string[];
  solutions: string[];
}

export interface SetupRequirement {
  type: 'material' | 'tooling' | 'program' | 'fixture';
  value: string;
  changeTime: number;
}

export interface MaterialGroup {
  id: string;
  materials: string[];
  avgSetupTime: number;
  compatibility: number;
}

export interface SetupOptimization {
  description: string;
  potentialSaving: number;
  difficulty: 'low' | 'medium' | 'high';
  implementation: string[];
}

export interface SchedulingRecommendation {
  type: 'grouping' | 'sequencing' | 'timing' | 'resource';
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface PreventiveAction {
  action: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeframe: string;
  expectedImpact: string;
}

export interface BatchRecommendation {
  type: 'size' | 'timing' | 'material' | 'sequence';
  description: string;
  benefit: string;
  implementation: string;
}

export interface WorkflowImprovement {
  area: string;
  description: string;
  potentialGain: number;
  complexity: 'low' | 'medium' | 'high';
  timeline: string;
}

export interface Resource {
  type: 'operator' | 'equipment' | 'material' | 'tool';
  id: string;
  availability: number;
}

export class AdvancedSchedulingEngine implements SchedulingEngine {
  private setupTimeCache: Map<string, number> = new Map();
  private downtimePatterns: Map<string, DowntimePattern> = new Map();

  optimizeJobSequence(jobs: Job[]): OptimizedSchedule {
    // Sort jobs by priority and due date
    const prioritizedJobs = this.prioritizeJobs(jobs);
    
    // Group jobs by material and thickness for setup optimization
    const materialGroups = this.groupJobsByMaterial(prioritizedJobs);
    
    // Apply advanced scheduling algorithms
    const optimizedSequence = this.applyGeneticAlgorithm(materialGroups);
    
    // Calculate setup times and efficiency
    const scheduledJobs = this.calculateScheduleTimes(optimizedSequence);
    
    // Generate recommendations
    const recommendations = this.generateSchedulingRecommendations(scheduledJobs, jobs);
    
    const totalSetupTime = scheduledJobs.reduce((sum, job) => sum + job.setupTime, 0);
    const totalProductionTime = scheduledJobs.reduce((sum, job) => sum + job.estimatedDuration, 0);
    const efficiency = this.calculateSchedulingEfficiency(scheduledJobs, jobs);
    
    return {
      jobs: scheduledJobs,
      totalSetupTime,
      totalProductionTime,
      efficiency,
      setupReductions: this.calculateSetupReductions(jobs, scheduledJobs),
      recommendations,
    };
  }

  predictDowntime(historicalData: DowntimeData[]): DowntimePrediction {
    // Analyze historical patterns
    const patterns = this.analyzeDowntimePatterns(historicalData);
    
    // Apply machine learning prediction models
    const predictedEvents = this.predictFutureDowntime(patterns);
    
    // Calculate risk score
    const riskScore = this.calculateDowntimeRisk(patterns, predictedEvents);
    
    // Generate preventive actions
    const preventiveActions = this.generatePreventiveActions(predictedEvents, patterns);
    
    // Calculate confidence level
    const confidenceLevel = this.calculatePredictionConfidence(historicalData.length, patterns);
    
    return {
      predictedEvents,
      riskScore,
      preventiveActions,
      confidenceLevel,
    };
  }

  calculateSetupTimes(transitions: JobTransition[]): SetupTimeMatrix {
    const uniqueMaterials = this.extractUniqueMaterials(transitions);
    const matrix = this.buildSetupMatrix(uniqueMaterials, transitions);
    const materialGroups = this.identifyMaterialGroups(uniqueMaterials, matrix);
    const optimizationOpportunities = this.findSetupOptimizations(matrix, materialGroups);
    
    return {
      matrix,
      materialGroups,
      optimizationOpportunities,
    };
  }

  optimizeBatches(orders: Order[]): BatchConfiguration {
    // Group orders by material compatibility
    const materialGroups = this.groupOrdersByMaterial(orders);
    
    // Apply batch optimization algorithms
    const optimizedBatches = this.optimizeBatchSizes(materialGroups);
    
    // Calculate utilization and efficiency
    const utilizationRate = this.calculateBatchUtilization(optimizedBatches);
    const timeReduction = this.calculateTimeReduction(orders, optimizedBatches);
    
    // Generate recommendations
    const recommendations = this.generateBatchRecommendations(optimizedBatches);
    
    return {
      batches: optimizedBatches,
      totalBatches: optimizedBatches.length,
      utilizationRate,
      timeReduction,
      recommendations,
    };
  }

  analyzeWorkflowBottlenecks(workflow: WorkflowStep[]): BottleneckAnalysis {
    // Identify bottlenecks using critical path analysis
    const bottlenecks = this.identifyBottlenecks(workflow);
    
    // Calculate critical path
    const criticalPath = this.calculateCriticalPath(workflow);
    
    // Generate improvement opportunities
    const improvementOpportunities = this.identifyImprovementOpportunities(workflow, bottlenecks);
    
    // Calculate efficiency score
    const efficiencyScore = this.calculateWorkflowEfficiency(workflow, bottlenecks);
    
    return {
      bottlenecks,
      criticalPath,
      improvementOpportunities,
      efficiencyScore,
    };
  }

  private prioritizeJobs(jobs: Job[]): Job[] {
    return jobs.sort((a, b) => {
      // Priority weights
      const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
      
      // Calculate priority score
      const aPriority = priorityWeights[a.priority];
      const bPriority = priorityWeights[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      // If same priority, sort by due date
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }

  private groupJobsByMaterial(jobs: Job[]): Map<string, Job[]> {
    const groups = new Map<string, Job[]>();
    
    jobs.forEach(job => {
      const key = `${job.materialType}_${job.thickness}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(job);
    });
    
    return groups;
  }

  private applyGeneticAlgorithm(materialGroups: Map<string, Job[]>): Job[] {
    // Simplified genetic algorithm for job sequencing
    const allJobs: Job[] = [];
    
    // First, sequence within each material group
    materialGroups.forEach(jobs => {
      const sortedJobs = jobs.sort((a, b) => {
        // Sort by complexity (simple first) then by due date
        if (a.complexity !== b.complexity) {
          const complexityOrder = { simple: 1, medium: 2, complex: 3 };
          return complexityOrder[a.complexity] - complexityOrder[b.complexity];
        }
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
      allJobs.push(...sortedJobs);
    });
    
    return allJobs;
  }

  private calculateScheduleTimes(jobs: Job[]): ScheduledJob[] {
    const scheduledJobs: ScheduledJob[] = [];
    let currentTime = new Date();
    let previousJob: Job | null = null;
    
    jobs.forEach((job, index) => {
      const setupTime = this.calculateSetupTime(previousJob, job);
      const scheduledStart = new Date(currentTime);
      const scheduledEnd = new Date(currentTime.getTime() + (setupTime + job.estimatedDuration) * 60000);
      
      scheduledJobs.push({
        ...job,
        scheduledStart,
        scheduledEnd,
        setupTime,
        position: index + 1,
      });
      
      currentTime = scheduledEnd;
      previousJob = job;
    });
    
    return scheduledJobs;
  }

  private calculateSetupTime(previousJob: Job | null, currentJob: Job): number {
    if (!previousJob) return 15; // Initial setup time
    
    const cacheKey = `${previousJob.materialType}_${previousJob.thickness}_${currentJob.materialType}_${currentJob.thickness}`;
    
    if (this.setupTimeCache.has(cacheKey)) {
      return this.setupTimeCache.get(cacheKey)!;
    }
    
    let setupTime = 5; // Base setup time
    
    // Material change
    if (previousJob.materialType !== currentJob.materialType) {
      setupTime += 10;
    }
    
    // Thickness change
    if (previousJob.thickness !== currentJob.thickness) {
      setupTime += 5;
    }
    
    // Complexity factor
    const complexityFactors = { simple: 1, medium: 1.2, complex: 1.5 };
    setupTime *= complexityFactors[currentJob.complexity];
    
    this.setupTimeCache.set(cacheKey, setupTime);
    return setupTime;
  }

  private calculateSchedulingEfficiency(scheduledJobs: ScheduledJob[], originalJobs: Job[]): number {
    const totalSetupTime = scheduledJobs.reduce((sum, job) => sum + job.setupTime, 0);
    const totalProductionTime = scheduledJobs.reduce((sum, job) => sum + job.estimatedDuration, 0);
    
    // Calculate efficiency as production time / total time
    const efficiency = (totalProductionTime / (totalProductionTime + totalSetupTime)) * 100;
    
    return Math.round(efficiency * 10) / 10;
  }

  private calculateSetupReductions(originalJobs: Job[], scheduledJobs: ScheduledJob[]): number {
    // Estimate original setup time (worst case scenario)
    const worstCaseSetupTime = originalJobs.length * 20; // 20 minutes per job
    const optimizedSetupTime = scheduledJobs.reduce((sum, job) => sum + job.setupTime, 0);
    
    return Math.max(0, worstCaseSetupTime - optimizedSetupTime);
  }

  private generateSchedulingRecommendations(scheduledJobs: ScheduledJob[], originalJobs: Job[]): SchedulingRecommendation[] {
    const recommendations: SchedulingRecommendation[] = [];
    
    // Check for material grouping opportunities
    const materialChanges = this.countMaterialChanges(scheduledJobs);
    if (materialChanges > scheduledJobs.length * 0.3) {
      recommendations.push({
        type: 'grouping',
        description: 'Consider better material grouping to reduce setup times',
        impact: `Could reduce ${materialChanges - Math.floor(scheduledJobs.length * 0.3)} material changes`,
        effort: 'medium',
      });
    }
    
    // Check for timing optimization
    const urgentJobs = scheduledJobs.filter(job => job.priority === 'urgent');
    if (urgentJobs.length > 0) {
      recommendations.push({
        type: 'timing',
        description: 'Prioritize urgent jobs while maintaining material grouping',
        impact: 'Improved on-time delivery',
        effort: 'low',
      });
    }
    
    return recommendations;
  }

  private countMaterialChanges(jobs: ScheduledJob[]): number {
    let changes = 0;
    for (let i = 1; i < jobs.length; i++) {
      if (jobs[i].materialType !== jobs[i-1].materialType) {
        changes++;
      }
    }
    return changes;
  }

  private analyzeDowntimePatterns(data: DowntimeData[]): Map<string, DowntimePattern> {
    const patterns = new Map<string, DowntimePattern>();
    
    // Group by downtime type
    const typeGroups = new Map<string, DowntimeData[]>();
    data.forEach(event => {
      if (!typeGroups.has(event.type)) {
        typeGroups.set(event.type, []);
      }
      typeGroups.get(event.type)!.push(event);
    });
    
    // Analyze patterns for each type
    typeGroups.forEach((events, type) => {
      const pattern = this.calculateDowntimePattern(events);
      patterns.set(type, pattern);
    });
    
    return patterns;
  }

  private calculateDowntimePattern(events: DowntimeData[]): DowntimePattern {
    const durations = events.map(e => e.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const frequency = events.length;
    
    // Calculate time between events
    const sortedEvents = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const intervals: number[] = [];
    for (let i = 1; i < sortedEvents.length; i++) {
      const interval = sortedEvents[i].timestamp.getTime() - sortedEvents[i-1].timestamp.getTime();
      intervals.push(interval / (1000 * 60 * 60 * 24)); // Convert to days
    }
    
    const avgInterval = intervals.length > 0 ? intervals.reduce((sum, i) => sum + i, 0) / intervals.length : 30;
    
    return {
      avgDuration,
      frequency,
      avgInterval,
      trend: this.calculateTrend(events),
      severity: this.calculateSeverity(events),
    };
  }

  private calculateTrend(events: DowntimeData[]): 'increasing' | 'decreasing' | 'stable' {
    if (events.length < 4) return 'stable';
    
    const recent = events.slice(-Math.floor(events.length / 2));
    const earlier = events.slice(0, Math.floor(events.length / 2));
    
    const recentAvg = recent.reduce((sum, e) => sum + e.duration, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, e) => sum + e.duration, 0) / earlier.length;
    
    const change = (recentAvg - earlierAvg) / earlierAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private calculateSeverity(events: DowntimeData[]): 'low' | 'medium' | 'high' | 'critical' {
    const avgDuration = events.reduce((sum, e) => sum + e.duration, 0) / events.length;
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    
    if (criticalEvents > events.length * 0.2 || avgDuration > 4) return 'critical';
    if (avgDuration > 2) return 'high';
    if (avgDuration > 1) return 'medium';
    return 'low';
  }

  private predictFutureDowntime(patterns: Map<string, DowntimePattern>): PredictedDowntime[] {
    const predictions: PredictedDowntime[] = [];
    
    patterns.forEach((pattern, type) => {
      const probability = this.calculateProbability(pattern);
      const estimatedDuration = pattern.avgDuration;
      const timeframe = this.calculateTimeframe(pattern);
      const riskFactors = this.identifyRiskFactors(pattern, type);
      
      predictions.push({
        type,
        probability,
        estimatedDuration,
        timeframe,
        riskFactors,
      });
    });
    
    return predictions.sort((a, b) => b.probability - a.probability);
  }

  private calculateProbability(pattern: DowntimePattern): number {
    // Simplified probability calculation based on frequency and trend
    let baseProbability = Math.min(90, pattern.frequency * 10);
    
    if (pattern.trend === 'increasing') {
      baseProbability *= 1.3;
    } else if (pattern.trend === 'decreasing') {
      baseProbability *= 0.7;
    }
    
    return Math.min(95, Math.round(baseProbability));
  }

  private calculateTimeframe(pattern: DowntimePattern): string {
    const days = Math.round(pattern.avgInterval);
    
    if (days <= 7) return 'Within 1 week';
    if (days <= 30) return 'Within 1 month';
    if (days <= 90) return 'Within 3 months';
    return 'Within 6 months';
  }

  private identifyRiskFactors(pattern: DowntimePattern, type: string): string[] {
    const factors: string[] = [];
    
    if (pattern.trend === 'increasing') {
      factors.push('Increasing frequency trend');
    }
    
    if (pattern.severity === 'critical' || pattern.severity === 'high') {
      factors.push('High severity events');
    }
    
    if (pattern.avgInterval < 14) {
      factors.push('Frequent occurrences');
    }
    
    // Type-specific risk factors
    const typeFactors = {
      unplanned: ['Equipment aging', 'Maintenance gaps'],
      setup: ['Process complexity', 'Operator training'],
      material: ['Supply chain issues', 'Quality variations'],
      operator: ['Training needs', 'Workload management'],
      quality: ['Process control', 'Equipment calibration'],
    };
    
    if (typeFactors[type]) {
      factors.push(...typeFactors[type]);
    }
    
    return factors;
  }

  private calculateDowntimeRisk(patterns: Map<string, DowntimePattern>, predictions: PredictedDowntime[]): number {
    const totalProbability = predictions.reduce((sum, p) => sum + p.probability, 0);
    const avgSeverity = Array.from(patterns.values()).reduce((sum, p) => {
      const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
      return sum + severityScores[p.severity];
    }, 0) / patterns.size;
    
    const riskScore = (totalProbability / predictions.length) * avgSeverity * 25;
    return Math.min(100, Math.round(riskScore));
  }

  private generatePreventiveActions(predictions: PredictedDowntime[], patterns: Map<string, DowntimePattern>): PreventiveAction[] {
    const actions: PreventiveAction[] = [];
    
    predictions.forEach(prediction => {
      if (prediction.probability > 70) {
        actions.push({
          action: `Implement preventive measures for ${prediction.type} downtime`,
          priority: 'urgent',
          timeframe: 'Immediate',
          expectedImpact: `Reduce ${prediction.type} downtime by 30-50%`,
        });
      } else if (prediction.probability > 50) {
        actions.push({
          action: `Monitor and prepare for potential ${prediction.type} issues`,
          priority: 'high',
          timeframe: 'Within 1 week',
          expectedImpact: `Early detection and faster resolution`,
        });
      }
    });
    
    return actions;
  }

  private calculatePredictionConfidence(dataPoints: number, patterns: Map<string, DowntimePattern>): number {
    // Confidence based on data quantity and pattern consistency
    let confidence = Math.min(90, dataPoints * 2); // More data = higher confidence
    
    // Adjust based on pattern consistency
    const avgFrequency = Array.from(patterns.values()).reduce((sum, p) => sum + p.frequency, 0) / patterns.size;
    if (avgFrequency > 5) {
      confidence += 10; // More frequent events = more predictable
    }
    
    return Math.min(95, Math.round(confidence));
  }

  // Additional helper methods would continue here...
  private extractUniqueMaterials(transitions: JobTransition[]): string[] {
    const materials = new Set<string>();
    transitions.forEach(t => {
      materials.add(t.fromJob.materialType);
      materials.add(t.toJob.materialType);
    });
    return Array.from(materials);
  }

  private buildSetupMatrix(materials: string[], transitions: JobTransition[]): number[][] {
    const matrix: number[][] = [];
    
    materials.forEach((fromMaterial, i) => {
      matrix[i] = [];
      materials.forEach((toMaterial, j) => {
        if (i === j) {
          matrix[i][j] = 0; // No setup time for same material
        } else {
          const transition = transitions.find(t => 
            t.fromJob.materialType === fromMaterial && t.toJob.materialType === toMaterial
          );
          matrix[i][j] = transition ? transition.setupTime : 15; // Default setup time
        }
      });
    });
    
    return matrix;
  }

  private identifyMaterialGroups(materials: string[], matrix: number[][]): MaterialGroup[] {
    const groups: MaterialGroup[] = [];
    
    // Simple grouping based on setup times
    const processed = new Set<number>();
    
    materials.forEach((material, i) => {
      if (processed.has(i)) return;
      
      const group: MaterialGroup = {
        id: `group_${groups.length + 1}`,
        materials: [material],
        avgSetupTime: 0,
        compatibility: 100,
      };
      
      // Find compatible materials (low setup time)
      materials.forEach((otherMaterial, j) => {
        if (i !== j && !processed.has(j) && matrix[i][j] <= 5) {
          group.materials.push(otherMaterial);
          processed.add(j);
        }
      });
      
      processed.add(i);
      
      // Calculate average setup time within group
      let totalSetupTime = 0;
      let transitions = 0;
      group.materials.forEach((mat1, idx1) => {
        group.materials.forEach((mat2, idx2) => {
          if (idx1 !== idx2) {
            const mat1Idx = materials.indexOf(mat1);
            const mat2Idx = materials.indexOf(mat2);
            totalSetupTime += matrix[mat1Idx][mat2Idx];
            transitions++;
          }
        });
      });
      
      group.avgSetupTime = transitions > 0 ? totalSetupTime / transitions : 0;
      groups.push(group);
    });
    
    return groups;
  }

  private findSetupOptimizations(matrix: number[][], groups: MaterialGroup[]): SetupOptimization[] {
    const optimizations: SetupOptimization[] = [];
    
    // Identify high setup time transitions
    matrix.forEach((row, i) => {
      row.forEach((setupTime, j) => {
        if (setupTime > 20) {
          optimizations.push({
            description: `Reduce setup time between materials ${i} and ${j}`,
            potentialSaving: setupTime * 0.3, // 30% reduction potential
            difficulty: setupTime > 30 ? 'high' : 'medium',
            implementation: [
              'Standardize tooling',
              'Improve changeover procedures',
              'Implement quick-change systems',
            ],
          });
        }
      });
    });
    
    return optimizations;
  }

  // Additional methods for batch optimization and workflow analysis would continue...
}

interface DowntimePattern {
  avgDuration: number;
  frequency: number;
  avgInterval: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Export singleton instance
export const advancedSchedulingEngine = new AdvancedSchedulingEngine();
