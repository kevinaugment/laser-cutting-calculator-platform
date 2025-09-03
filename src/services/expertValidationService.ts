/**
 * Expert Validation Service
 * Manages expert validation of parameter presets with authority indicators and recommendations
 */

import { teamManagementService } from './teamManagementService';
import { TeamParameterPreset } from './teamParameterLibraryService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type ExpertLevel = 'apprentice' | 'journeyman' | 'expert' | 'master';
export type ValidationStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';
export type ValidationCategory = 'safety' | 'efficiency' | 'quality' | 'cost' | 'general';

export interface ExpertProfile {
  id: string;
  userId: string;
  level: ExpertLevel;
  specializations: string[];
  certifications: ExpertCertification[];
  experience: ExpertExperience;
  reputation: ExpertReputation;
  validationStats: ValidationStats;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpertCertification {
  id: string;
  name: string;
  issuer: string;
  issuedAt: Date;
  expiresAt?: Date;
  credentialId?: string;
  verificationUrl?: string;
  isVerified: boolean;
}

export interface ExpertExperience {
  yearsOfExperience: number;
  industriesWorked: string[];
  equipmentExperience: string[];
  materialExperience: string[];
  processExperience: string[];
  projectsCompleted: number;
  companiesWorked: string[];
}

export interface ExpertReputation {
  overallRating: number;
  totalRatings: number;
  ratingDistribution: Record<number, number>;
  endorsements: ExpertEndorsement[];
  achievements: ExpertAchievement[];
  trustScore: number;
}

export interface ExpertEndorsement {
  id: string;
  fromUserId: string;
  skill: string;
  message: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface ExpertAchievement {
  id: string;
  type: 'validation-count' | 'accuracy-rate' | 'community-contribution' | 'innovation';
  title: string;
  description: string;
  earnedAt: Date;
  metadata: Record<string, any>;
}

export interface ValidationRequest {
  id: string;
  presetId: string;
  requestedBy: string;
  assignedTo?: string;
  category: ValidationCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: ValidationStatus;
  description: string;
  requirements: string[];
  attachments: ValidationAttachment[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface ValidationAttachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
}

export interface ValidationResult {
  id: string;
  requestId: string;
  validatedBy: string;
  status: ValidationStatus;
  score: number; // 0-100
  category: ValidationCategory;
  findings: ValidationFinding[];
  recommendations: ValidationRecommendation[];
  approvedParameters: Record<string, any>;
  rejectedParameters: Record<string, any>;
  comments: string;
  validatedAt: Date;
  confidence: number; // 0-1
  methodology: string;
  references: string[];
}

export interface ValidationFinding {
  id: string;
  type: 'issue' | 'warning' | 'suggestion' | 'improvement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  parameter: string;
  currentValue: any;
  suggestedValue?: any;
  description: string;
  reasoning: string;
  impact: string;
  references: string[];
}

export interface ValidationRecommendation {
  id: string;
  type: 'parameter-change' | 'process-improvement' | 'safety-enhancement' | 'efficiency-boost';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  implementation: string;
  expectedBenefit: string;
  estimatedCost?: string;
  timeframe?: string;
  prerequisites: string[];
}

export interface ValidationStats {
  totalValidations: number;
  approvedValidations: number;
  rejectedValidations: number;
  averageScore: number;
  averageConfidence: number;
  specialtyBreakdown: Record<string, number>;
  accuracyRate: number;
  responseTime: number; // average hours
  lastValidation: Date;
}

export interface CreateValidationRequestData {
  presetId: string;
  category: ValidationCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requirements: string[];
  dueDate?: Date;
  preferredExpert?: string;
}

export interface SubmitValidationResultData {
  requestId: string;
  status: ValidationStatus;
  score: number;
  findings: Omit<ValidationFinding, 'id'>[];
  recommendations: Omit<ValidationRecommendation, 'id'>[];
  approvedParameters: Record<string, any>;
  rejectedParameters: Record<string, any>;
  comments: string;
  confidence: number;
  methodology: string;
  references: string[];
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface ExpertValidationServiceConfig {
  maxValidationRequests: number;
  defaultValidationTimeout: number; // hours
  minExpertLevel: ExpertLevel;
  enableAutoAssignment: boolean;
  requireMultipleValidations: boolean;
  minValidationsForApproval: number;
}

const DEFAULT_CONFIG: ExpertValidationServiceConfig = {
  maxValidationRequests: 100,
  defaultValidationTimeout: 72, // 3 days
  minExpertLevel: 'journeyman',
  enableAutoAssignment: true,
  requireMultipleValidations: false,
  minValidationsForApproval: 1,
};

// ============================================================================
// Expert Validation Service Class
// ============================================================================

export class ExpertValidationService {
  private config: ExpertValidationServiceConfig;
  private experts: Map<string, ExpertProfile>;
  private validationRequests: Map<string, ValidationRequest>;
  private validationResults: Map<string, ValidationResult[]>;

  constructor(config: Partial<ExpertValidationServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.experts = new Map();
    this.validationRequests = new Map();
    this.validationResults = new Map();
  }

  // ============================================================================
  // Expert Profile Management
  // ============================================================================

  /**
   * Register expert profile
   */
  public async registerExpert(
    userId: string,
    profileData: Omit<ExpertProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<ExpertProfile> {
    const expert: ExpertProfile = {
      id: this.generateId(),
      userId,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.experts.set(userId, expert);
    return expert;
  }

  /**
   * Get expert profile
   */
  public async getExpertProfile(userId: string): Promise<ExpertProfile | null> {
    return this.experts.get(userId) || null;
  }

  /**
   * Update expert profile
   */
  public async updateExpertProfile(
    userId: string,
    updates: Partial<ExpertProfile>
  ): Promise<ExpertProfile> {
    const expert = this.experts.get(userId);
    if (!expert) {
      throw new Error('Expert profile not found');
    }

    const updatedExpert = {
      ...expert,
      ...updates,
      updatedAt: new Date(),
    };

    this.experts.set(userId, updatedExpert);
    return updatedExpert;
  }

  /**
   * Get available experts for validation
   */
  public async getAvailableExperts(
    category?: ValidationCategory,
    minLevel?: ExpertLevel
  ): Promise<ExpertProfile[]> {
    const experts = Array.from(this.experts.values()).filter(expert => {
      if (!expert.isActive) return false;
      
      if (minLevel) {
        const levelOrder: ExpertLevel[] = ['apprentice', 'journeyman', 'expert', 'master'];
        const expertLevelIndex = levelOrder.indexOf(expert.level);
        const minLevelIndex = levelOrder.indexOf(minLevel);
        if (expertLevelIndex < minLevelIndex) return false;
      }

      if (category && expert.specializations.length > 0) {
        return expert.specializations.includes(category);
      }

      return true;
    });

    // Sort by reputation and availability
    return experts.sort((a, b) => {
      const aScore = a.reputation.trustScore * a.reputation.overallRating;
      const bScore = b.reputation.trustScore * b.reputation.overallRating;
      return bScore - aScore;
    });
  }

  // ============================================================================
  // Validation Request Management
  // ============================================================================

  /**
   * Create validation request
   */
  public async createValidationRequest(
    userId: string,
    data: CreateValidationRequestData
  ): Promise<ValidationRequest> {
    // Check if user has permission to request validation
    // This would integrate with team management or preset ownership

    const request: ValidationRequest = {
      id: this.generateId(),
      presetId: data.presetId,
      requestedBy: userId,
      category: data.category,
      priority: data.priority,
      status: 'pending',
      description: data.description,
      requirements: data.requirements,
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: data.dueDate || new Date(Date.now() + this.config.defaultValidationTimeout * 60 * 60 * 1000),
    };

    // Auto-assign expert if enabled
    if (this.config.enableAutoAssignment) {
      const availableExperts = await this.getAvailableExperts(data.category, this.config.minExpertLevel);
      if (availableExperts.length > 0) {
        // Assign to expert with best match and availability
        request.assignedTo = data.preferredExpert && 
          availableExperts.find(e => e.userId === data.preferredExpert) 
          ? data.preferredExpert 
          : availableExperts[0].userId;
      }
    }

    this.validationRequests.set(request.id, request);
    return request;
  }

  /**
   * Get validation request
   */
  public async getValidationRequest(requestId: string): Promise<ValidationRequest | null> {
    return this.validationRequests.get(requestId) || null;
  }

  /**
   * Assign validation request to expert
   */
  public async assignValidationRequest(
    requestId: string,
    expertUserId: string,
    assignedBy: string
  ): Promise<ValidationRequest> {
    const request = this.validationRequests.get(requestId);
    if (!request) {
      throw new Error('Validation request not found');
    }

    const expert = this.experts.get(expertUserId);
    if (!expert || !expert.isActive) {
      throw new Error('Expert not found or inactive');
    }

    request.assignedTo = expertUserId;
    request.updatedAt = new Date();

    return request;
  }

  /**
   * Get validation requests for expert
   */
  public async getExpertValidationRequests(
    expertUserId: string,
    status?: ValidationStatus
  ): Promise<ValidationRequest[]> {
    const requests = Array.from(this.validationRequests.values()).filter(request => {
      if (request.assignedTo !== expertUserId) return false;
      if (status && request.status !== status) return false;
      return true;
    });

    return requests.sort((a, b) => {
      // Sort by priority and due date
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0);
    });
  }

  // ============================================================================
  // Validation Result Management
  // ============================================================================

  /**
   * Submit validation result
   */
  public async submitValidationResult(
    expertUserId: string,
    data: SubmitValidationResultData
  ): Promise<ValidationResult> {
    const request = this.validationRequests.get(data.requestId);
    if (!request) {
      throw new Error('Validation request not found');
    }

    if (request.assignedTo !== expertUserId) {
      throw new Error('Not authorized to validate this request');
    }

    const expert = this.experts.get(expertUserId);
    if (!expert) {
      throw new Error('Expert profile not found');
    }

    const result: ValidationResult = {
      id: this.generateId(),
      requestId: data.requestId,
      validatedBy: expertUserId,
      status: data.status,
      score: data.score,
      category: request.category,
      findings: data.findings.map(finding => ({
        ...finding,
        id: this.generateId(),
      })),
      recommendations: data.recommendations.map(rec => ({
        ...rec,
        id: this.generateId(),
      })),
      approvedParameters: data.approvedParameters,
      rejectedParameters: data.rejectedParameters,
      comments: data.comments,
      validatedAt: new Date(),
      confidence: data.confidence,
      methodology: data.methodology,
      references: data.references,
    };

    // Store result
    if (!this.validationResults.has(data.requestId)) {
      this.validationResults.set(data.requestId, []);
    }
    this.validationResults.get(data.requestId)!.push(result);

    // Update request status
    request.status = data.status;
    request.updatedAt = new Date();

    // Update expert stats
    await this.updateExpertStats(expertUserId, result);

    return result;
  }

  /**
   * Get validation results for request
   */
  public async getValidationResults(requestId: string): Promise<ValidationResult[]> {
    return this.validationResults.get(requestId) || [];
  }

  /**
   * Get validation summary for preset
   */
  public async getPresetValidationSummary(presetId: string): Promise<{
    totalValidations: number;
    approvedValidations: number;
    averageScore: number;
    averageConfidence: number;
    latestValidation?: ValidationResult;
    expertConsensus: boolean;
  }> {
    const allResults: ValidationResult[] = [];
    
    // Find all validation requests for this preset
    for (const request of this.validationRequests.values()) {
      if (request.presetId === presetId) {
        const results = this.validationResults.get(request.id) || [];
        allResults.push(...results);
      }
    }

    if (allResults.length === 0) {
      return {
        totalValidations: 0,
        approvedValidations: 0,
        averageScore: 0,
        averageConfidence: 0,
        expertConsensus: false,
      };
    }

    const approvedResults = allResults.filter(r => r.status === 'approved');
    const totalScore = allResults.reduce((sum, r) => sum + r.score, 0);
    const totalConfidence = allResults.reduce((sum, r) => sum + r.confidence, 0);
    const latestValidation = allResults.sort((a, b) => b.validatedAt.getTime() - a.validatedAt.getTime())[0];

    // Check for expert consensus (simplified)
    const expertConsensus = allResults.length >= 2 && 
      approvedResults.length / allResults.length >= 0.8;

    return {
      totalValidations: allResults.length,
      approvedValidations: approvedResults.length,
      averageScore: totalScore / allResults.length,
      averageConfidence: totalConfidence / allResults.length,
      latestValidation,
      expertConsensus,
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async updateExpertStats(expertUserId: string, result: ValidationResult): Promise<void> {
    const expert = this.experts.get(expertUserId);
    if (!expert) return;

    const stats = expert.validationStats;
    stats.totalValidations++;
    
    if (result.status === 'approved') {
      stats.approvedValidations++;
    } else if (result.status === 'rejected') {
      stats.rejectedValidations++;
    }

    // Update averages
    const totalScores = stats.averageScore * (stats.totalValidations - 1) + result.score;
    stats.averageScore = totalScores / stats.totalValidations;

    const totalConfidence = stats.averageConfidence * (stats.totalValidations - 1) + result.confidence;
    stats.averageConfidence = totalConfidence / stats.totalValidations;

    // Update specialty breakdown
    if (!stats.specialtyBreakdown[result.category]) {
      stats.specialtyBreakdown[result.category] = 0;
    }
    stats.specialtyBreakdown[result.category]++;

    stats.lastValidation = result.validatedAt;

    // Update reputation based on validation quality
    await this.updateExpertReputation(expertUserId, result);
  }

  private async updateExpertReputation(expertUserId: string, result: ValidationResult): Promise<void> {
    const expert = this.experts.get(expertUserId);
    if (!expert) return;

    // Simplified reputation update based on validation quality
    const qualityScore = (result.score / 100) * result.confidence;
    const reputationImpact = qualityScore * 0.1; // Small incremental changes

    expert.reputation.trustScore = Math.min(1.0, expert.reputation.trustScore + reputationImpact);
    
    // Check for achievements
    await this.checkForAchievements(expertUserId);
  }

  private async checkForAchievements(expertUserId: string): Promise<void> {
    const expert = this.experts.get(expertUserId);
    if (!expert) return;

    const stats = expert.validationStats;
    const achievements = expert.reputation.achievements;

    // Check for validation count milestones
    const validationMilestones = [10, 50, 100, 500, 1000];
    for (const milestone of validationMilestones) {
      if (stats.totalValidations >= milestone) {
        const existingAchievement = achievements.find(
          a => a.type === 'validation-count' && a.metadata.milestone === milestone
        );
        
        if (!existingAchievement) {
          achievements.push({
            id: this.generateId(),
            type: 'validation-count',
            title: `${milestone} Validations`,
            description: `Completed ${milestone} parameter validations`,
            earnedAt: new Date(),
            metadata: { milestone },
          });
        }
      }
    }

    // Check for high accuracy rate
    if (stats.totalValidations >= 20 && stats.accuracyRate >= 0.95) {
      const existingAchievement = achievements.find(a => a.type === 'accuracy-rate');
      if (!existingAchievement) {
        achievements.push({
          id: this.generateId(),
          type: 'accuracy-rate',
          title: 'High Accuracy Expert',
          description: 'Maintained 95%+ accuracy rate over 20+ validations',
          earnedAt: new Date(),
          metadata: { accuracyRate: stats.accuracyRate },
        });
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const expertValidationService = new ExpertValidationService();
