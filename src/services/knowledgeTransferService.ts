/**
 * Knowledge Transfer Service
 * Captures and transfers expert knowledge through the memory system
 */

import { expertValidationService } from './expertValidationService';
import { teamManagementService } from './teamManagementService';
import { TeamParameterPreset } from './teamParameterLibraryService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type KnowledgeType = 'best-practice' | 'troubleshooting' | 'optimization' | 'safety' | 'technique';
export type KnowledgeFormat = 'text' | 'video' | 'image' | 'document' | 'interactive';
export type KnowledgeStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type LearningPathStatus = 'not-started' | 'in-progress' | 'completed' | 'certified';

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  content: string;
  type: KnowledgeType;
  format: KnowledgeFormat;
  status: KnowledgeStatus;
  authorId: string;
  authorName: string;
  expertLevel: string;
  tags: string[];
  categories: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedReadTime: number; // minutes
  prerequisites: string[];
  relatedItems: string[];
  attachments: KnowledgeAttachment[];
  metadata: KnowledgeMetadata;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  version: number;
}

export interface KnowledgeAttachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  description?: string;
  uploadedAt: Date;
}

export interface KnowledgeMetadata {
  calculatorTypes: string[];
  materials: string[];
  processes: string[];
  equipment: string[];
  parameters: Record<string, any>;
  successMetrics: Record<string, number>;
  validationData: ValidationData;
  usageStats: UsageStats;
}

export interface ValidationData {
  validatedBy: string[];
  validationDate: Date;
  validationScore: number;
  validationComments: string[];
  testResults: TestResult[];
}

export interface TestResult {
  testId: string;
  testName: string;
  parameters: Record<string, any>;
  expectedResults: Record<string, any>;
  actualResults: Record<string, any>;
  success: boolean;
  notes: string;
  testedBy: string;
  testedAt: Date;
}

export interface UsageStats {
  viewCount: number;
  likeCount: number;
  shareCount: number;
  bookmarkCount: number;
  implementationCount: number;
  successRate: number;
  averageRating: number;
  totalRatings: number;
  lastAccessed: Date;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  objective: string;
  targetAudience: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number; // hours
  knowledgeItems: LearningPathItem[];
  prerequisites: string[];
  outcomes: string[];
  certification: CertificationInfo;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface LearningPathItem {
  knowledgeItemId: string;
  order: number;
  isRequired: boolean;
  estimatedTime: number;
  completionCriteria: CompletionCriteria;
}

export interface CompletionCriteria {
  type: 'read' | 'quiz' | 'practice' | 'project' | 'assessment';
  requirements: Record<string, any>;
  passingScore?: number;
}

export interface CertificationInfo {
  available: boolean;
  name: string;
  description: string;
  requirements: string[];
  validityPeriod: number; // months
  renewalRequired: boolean;
}

export interface UserProgress {
  userId: string;
  learningPathId: string;
  status: LearningPathStatus;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  certifiedAt?: Date;
  progress: ItemProgress[];
  overallProgress: number; // 0-1
  timeSpent: number; // minutes
  achievements: Achievement[];
}

export interface ItemProgress {
  knowledgeItemId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number;
  attempts: number;
  bestScore?: number;
  notes: string;
}

export interface Achievement {
  id: string;
  type: 'completion' | 'streak' | 'mastery' | 'contribution' | 'collaboration';
  title: string;
  description: string;
  earnedAt: Date;
  metadata: Record<string, any>;
}

export interface KnowledgeQuery {
  type?: KnowledgeType;
  format?: KnowledgeFormat;
  status?: KnowledgeStatus;
  difficulty?: string;
  tags?: string[];
  categories?: string[];
  authorId?: string;
  calculatorTypes?: string[];
  materials?: string[];
  searchTerm?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'rating' | 'usage';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateKnowledgeItemData {
  title: string;
  description: string;
  content: string;
  type: KnowledgeType;
  format: KnowledgeFormat;
  tags: string[];
  categories: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites: string[];
  calculatorTypes: string[];
  materials: string[];
  processes: string[];
  equipment: string[];
  parameters: Record<string, any>;
}

export interface CreateLearningPathData {
  title: string;
  description: string;
  objective: string;
  targetAudience: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  knowledgeItemIds: string[];
  prerequisites: string[];
  outcomes: string[];
  certification: Partial<CertificationInfo>;
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface KnowledgeTransferServiceConfig {
  maxKnowledgeItems: number;
  maxLearningPaths: number;
  enableVersioning: boolean;
  enableCollaboration: boolean;
  enableCertification: boolean;
  autoValidation: boolean;
}

const DEFAULT_CONFIG: KnowledgeTransferServiceConfig = {
  maxKnowledgeItems: 10000,
  maxLearningPaths: 1000,
  enableVersioning: true,
  enableCollaboration: true,
  enableCertification: true,
  autoValidation: false,
};

// ============================================================================
// Knowledge Transfer Service Class
// ============================================================================

export class KnowledgeTransferService {
  private config: KnowledgeTransferServiceConfig;
  private knowledgeItems: Map<string, KnowledgeItem>;
  private learningPaths: Map<string, LearningPath>;
  private userProgress: Map<string, UserProgress[]>;

  constructor(config: Partial<KnowledgeTransferServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.knowledgeItems = new Map();
    this.learningPaths = new Map();
    this.userProgress = new Map();
  }

  // ============================================================================
  // Knowledge Item Management
  // ============================================================================

  /**
   * Create knowledge item
   */
  public async createKnowledgeItem(
    authorId: string,
    data: CreateKnowledgeItemData
  ): Promise<KnowledgeItem> {
    // Get author information
    const expertProfile = await expertValidationService.getExpertProfile(authorId);
    const authorName = expertProfile?.userId || authorId;
    const expertLevel = expertProfile?.level || 'apprentice';

    // Calculate estimated read time (average 200 words per minute)
    const wordCount = data.content.split(/\s+/).length;
    const estimatedReadTime = Math.ceil(wordCount / 200);

    const knowledgeItem: KnowledgeItem = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      content: data.content,
      type: data.type,
      format: data.format,
      status: 'draft',
      authorId,
      authorName,
      expertLevel,
      tags: data.tags,
      categories: data.categories,
      difficulty: data.difficulty,
      estimatedReadTime,
      prerequisites: data.prerequisites,
      relatedItems: [],
      attachments: [],
      metadata: {
        calculatorTypes: data.calculatorTypes,
        materials: data.materials,
        processes: data.processes,
        equipment: data.equipment,
        parameters: data.parameters,
        successMetrics: {},
        validationData: {
          validatedBy: [],
          validationDate: new Date(),
          validationScore: 0,
          validationComments: [],
          testResults: [],
        },
        usageStats: {
          viewCount: 0,
          likeCount: 0,
          shareCount: 0,
          bookmarkCount: 0,
          implementationCount: 0,
          successRate: 0,
          averageRating: 0,
          totalRatings: 0,
          lastAccessed: new Date(),
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    this.knowledgeItems.set(knowledgeItem.id, knowledgeItem);

    // Auto-validation if enabled
    if (this.config.autoValidation && expertProfile && expertProfile.level !== 'apprentice') {
      await this.validateKnowledgeItem(knowledgeItem.id, authorId);
    }

    return knowledgeItem;
  }

  /**
   * Get knowledge item
   */
  public async getKnowledgeItem(itemId: string, userId?: string): Promise<KnowledgeItem | null> {
    const item = this.knowledgeItems.get(itemId);
    if (!item) return null;

    // Update usage stats
    if (userId) {
      item.metadata.usageStats.viewCount++;
      item.metadata.usageStats.lastAccessed = new Date();
    }

    return item;
  }

  /**
   * Update knowledge item
   */
  public async updateKnowledgeItem(
    itemId: string,
    userId: string,
    updates: Partial<KnowledgeItem>
  ): Promise<KnowledgeItem> {
    const item = this.knowledgeItems.get(itemId);
    if (!item) {
      throw new Error('Knowledge item not found');
    }

    // Check permissions
    if (item.authorId !== userId) {
      const expertProfile = await expertValidationService.getExpertProfile(userId);
      if (!expertProfile || expertProfile.level === 'apprentice') {
        throw new Error('Not authorized to update this knowledge item');
      }
    }

    // Create new version if versioning is enabled
    if (this.config.enableVersioning && updates.content && updates.content !== item.content) {
      item.version++;
    }

    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: new Date(),
    };

    this.knowledgeItems.set(itemId, updatedItem);
    return updatedItem;
  }

  /**
   * Validate knowledge item
   */
  public async validateKnowledgeItem(itemId: string, validatorId: string): Promise<KnowledgeItem> {
    const item = this.knowledgeItems.get(itemId);
    if (!item) {
      throw new Error('Knowledge item not found');
    }

    const expertProfile = await expertValidationService.getExpertProfile(validatorId);
    if (!expertProfile) {
      throw new Error('Validator must be a registered expert');
    }

    // Add validation
    item.metadata.validationData.validatedBy.push(validatorId);
    item.metadata.validationData.validationDate = new Date();
    
    // Calculate validation score based on expert level
    const levelScores = { apprentice: 60, journeyman: 75, expert: 90, master: 100 };
    const score = levelScores[expertProfile.level] || 60;
    item.metadata.validationData.validationScore = Math.max(
      item.metadata.validationData.validationScore,
      score
    );

    // Update status based on validation score
    if (item.metadata.validationData.validationScore >= 80) {
      item.status = 'approved';
    } else if (item.metadata.validationData.validationScore >= 60) {
      item.status = 'review';
    }

    item.updatedAt = new Date();
    return item;
  }

  /**
   * Search knowledge items
   */
  public async searchKnowledgeItems(query: KnowledgeQuery): Promise<KnowledgeItem[]> {
    let items = Array.from(this.knowledgeItems.values());

    // Apply filters
    if (query.type) {
      items = items.filter(item => item.type === query.type);
    }

    if (query.format) {
      items = items.filter(item => item.format === query.format);
    }

    if (query.status) {
      items = items.filter(item => item.status === query.status);
    }

    if (query.difficulty) {
      items = items.filter(item => item.difficulty === query.difficulty);
    }

    if (query.tags && query.tags.length > 0) {
      items = items.filter(item => 
        query.tags!.some(tag => item.tags.includes(tag))
      );
    }

    if (query.categories && query.categories.length > 0) {
      items = items.filter(item => 
        query.categories!.some(category => item.categories.includes(category))
      );
    }

    if (query.authorId) {
      items = items.filter(item => item.authorId === query.authorId);
    }

    if (query.calculatorTypes && query.calculatorTypes.length > 0) {
      items = items.filter(item => 
        query.calculatorTypes!.some(type => item.metadata.calculatorTypes.includes(type))
      );
    }

    if (query.searchTerm) {
      const searchTerm = query.searchTerm.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.content.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort results
    const sortBy = query.sortBy || 'relevance';
    const sortOrder = query.sortOrder || 'desc';

    items.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'rating':
          comparison = a.metadata.usageStats.averageRating - b.metadata.usageStats.averageRating;
          break;
        case 'usage':
          comparison = a.metadata.usageStats.viewCount - b.metadata.usageStats.viewCount;
          break;
        default: // relevance
          comparison = a.metadata.validationData.validationScore - b.metadata.validationData.validationScore;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    
    return items.slice(offset, offset + limit);
  }

  // ============================================================================
  // Learning Path Management
  // ============================================================================

  /**
   * Create learning path
   */
  public async createLearningPath(
    creatorId: string,
    data: CreateLearningPathData
  ): Promise<LearningPath> {
    // Validate knowledge items exist
    for (const itemId of data.knowledgeItemIds) {
      if (!this.knowledgeItems.has(itemId)) {
        throw new Error(`Knowledge item ${itemId} not found`);
      }
    }

    // Calculate estimated duration
    let estimatedDuration = 0;
    const knowledgeItems: LearningPathItem[] = data.knowledgeItemIds.map((itemId, index) => {
      const item = this.knowledgeItems.get(itemId)!;
      const estimatedTime = item.estimatedReadTime + 10; // Add 10 minutes for practice
      estimatedDuration += estimatedTime;

      return {
        knowledgeItemId: itemId,
        order: index + 1,
        isRequired: true,
        estimatedTime,
        completionCriteria: {
          type: 'read',
          requirements: { readComplete: true },
        },
      };
    });

    const learningPath: LearningPath = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      objective: data.objective,
      targetAudience: data.targetAudience,
      difficulty: data.difficulty,
      estimatedDuration: Math.ceil(estimatedDuration / 60), // Convert to hours
      knowledgeItems,
      prerequisites: data.prerequisites,
      outcomes: data.outcomes,
      certification: {
        available: this.config.enableCertification,
        name: data.certification.name || `${data.title} Certification`,
        description: data.certification.description || `Certification for completing ${data.title}`,
        requirements: data.certification.requirements || ['Complete all required items'],
        validityPeriod: data.certification.validityPeriod || 12,
        renewalRequired: data.certification.renewalRequired || false,
      },
      createdBy: creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    this.learningPaths.set(learningPath.id, learningPath);
    return learningPath;
  }

  /**
   * Get learning path
   */
  public async getLearningPath(pathId: string): Promise<LearningPath | null> {
    return this.learningPaths.get(pathId) || null;
  }

  /**
   * Get user progress
   */
  public async getUserProgress(userId: string, pathId: string): Promise<UserProgress | null> {
    const userProgressList = this.userProgress.get(userId) || [];
    return userProgressList.find(progress => progress.learningPathId === pathId) || null;
  }

  /**
   * Start learning path
   */
  public async startLearningPath(userId: string, pathId: string): Promise<UserProgress> {
    const learningPath = this.learningPaths.get(pathId);
    if (!learningPath) {
      throw new Error('Learning path not found');
    }

    // Check if already started
    let progress = await this.getUserProgress(userId, pathId);
    if (progress) {
      return progress;
    }

    // Create new progress
    progress = {
      userId,
      learningPathId: pathId,
      status: 'in-progress',
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      progress: learningPath.knowledgeItems.map(item => ({
        knowledgeItemId: item.knowledgeItemId,
        status: 'not-started',
        timeSpent: 0,
        attempts: 0,
        notes: '',
      })),
      overallProgress: 0,
      timeSpent: 0,
      achievements: [],
    };

    // Store progress
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, []);
    }
    this.userProgress.get(userId)!.push(progress);

    return progress;
  }

  /**
   * Update item progress
   */
  public async updateItemProgress(
    userId: string,
    pathId: string,
    itemId: string,
    status: 'in-progress' | 'completed',
    timeSpent: number = 0
  ): Promise<UserProgress> {
    const progress = await this.getUserProgress(userId, pathId);
    if (!progress) {
      throw new Error('Learning path not started');
    }

    // Update item progress
    const itemProgress = progress.progress.find(p => p.knowledgeItemId === itemId);
    if (!itemProgress) {
      throw new Error('Knowledge item not found in learning path');
    }

    itemProgress.status = status;
    itemProgress.timeSpent += timeSpent;
    itemProgress.attempts++;

    if (status === 'completed' && !itemProgress.completedAt) {
      itemProgress.completedAt = new Date();
    }

    // Update overall progress
    const completedItems = progress.progress.filter(p => p.status === 'completed').length;
    progress.overallProgress = completedItems / progress.progress.length;
    progress.timeSpent += timeSpent;
    progress.lastAccessedAt = new Date();

    // Check if path is completed
    if (progress.overallProgress === 1 && progress.status !== 'completed') {
      progress.status = 'completed';
      progress.completedAt = new Date();

      // Award completion achievement
      progress.achievements.push({
        id: this.generateId(),
        type: 'completion',
        title: 'Path Completed',
        description: `Completed learning path: ${pathId}`,
        earnedAt: new Date(),
        metadata: { pathId, timeSpent: progress.timeSpent },
      });

      // Award certification if available
      const learningPath = this.learningPaths.get(pathId);
      if (learningPath?.certification.available) {
        progress.status = 'certified';
        progress.certifiedAt = new Date();

        progress.achievements.push({
          id: this.generateId(),
          type: 'mastery',
          title: 'Certified',
          description: `Earned certification: ${learningPath.certification.name}`,
          earnedAt: new Date(),
          metadata: { 
            pathId, 
            certificationName: learningPath.certification.name,
            validUntil: new Date(Date.now() + learningPath.certification.validityPeriod * 30 * 24 * 60 * 60 * 1000)
          },
        });
      }
    }

    return progress;
  }

  // ============================================================================
  // Knowledge Analytics
  // ============================================================================

  /**
   * Get knowledge analytics
   */
  public async getKnowledgeAnalytics(): Promise<{
    totalItems: number;
    itemsByType: Record<KnowledgeType, number>;
    itemsByStatus: Record<KnowledgeStatus, number>;
    topAuthors: Array<{ authorId: string; itemCount: number }>;
    mostViewed: KnowledgeItem[];
    recentItems: KnowledgeItem[];
  }> {
    const items = Array.from(this.knowledgeItems.values());

    // Count by type
    const itemsByType = items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<KnowledgeType, number>);

    // Count by status
    const itemsByStatus = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<KnowledgeStatus, number>);

    // Top authors
    const authorCounts = items.reduce((acc, item) => {
      acc[item.authorId] = (acc[item.authorId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topAuthors = Object.entries(authorCounts)
      .map(([authorId, itemCount]) => ({ authorId, itemCount }))
      .sort((a, b) => b.itemCount - a.itemCount)
      .slice(0, 10);

    // Most viewed
    const mostViewed = items
      .sort((a, b) => b.metadata.usageStats.viewCount - a.metadata.usageStats.viewCount)
      .slice(0, 10);

    // Recent items
    const recentItems = items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    return {
      totalItems: items.length,
      itemsByType,
      itemsByStatus,
      topAuthors,
      mostViewed,
      recentItems,
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const knowledgeTransferService = new KnowledgeTransferService();
