/**
 * Knowledge Transfer Service Tests
 * Comprehensive test suite for knowledge transfer functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeTransferService, knowledgeTransferService } from '../../services/knowledgeTransferService';

describe('KnowledgeTransferService', () => {
  let service: KnowledgeTransferService;

  beforeEach(() => {
    service = new KnowledgeTransferService();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new KnowledgeTransferService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new KnowledgeTransferService({
        maxKnowledgeItems: 5000,
        enableVersioning: false,
        enableCertification: false,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('knowledge item management', () => {
    it('should create knowledge item', async () => {
      const itemData = {
        title: 'Laser Safety Best Practices',
        description: 'Essential safety guidelines for laser cutting operations',
        content: 'Always wear appropriate safety equipment when operating laser cutting machines...',
        type: 'safety' as const,
        format: 'text' as const,
        tags: ['safety', 'laser', 'best-practices'],
        categories: ['safety', 'operations'],
        difficulty: 'beginner' as const,
        prerequisites: [],
        calculatorTypes: ['laser-cutting-cost', 'cutting-time-estimator'],
        materials: ['steel', 'aluminum'],
        processes: ['cutting', 'engraving'],
        equipment: ['CO2 laser', 'fiber laser'],
        parameters: { power: 100, speed: 1000 },
      };

      const item = await service.createKnowledgeItem('author-123', itemData);

      expect(item).toBeDefined();
      expect(item.id).toBeDefined();
      expect(item.title).toBe('Laser Safety Best Practices');
      expect(item.description).toBe('Essential safety guidelines for laser cutting operations');
      expect(item.type).toBe('safety');
      expect(item.format).toBe('text');
      expect(item.status).toBe('draft');
      expect(item.authorId).toBe('author-123');
      expect(item.tags).toEqual(['safety', 'laser', 'best-practices']);
      expect(item.categories).toEqual(['safety', 'operations']);
      expect(item.difficulty).toBe('beginner');
      expect(item.estimatedReadTime).toBeGreaterThan(0);
      expect(item.version).toBe(1);
      expect(item.createdAt).toBeDefined();
      expect(item.updatedAt).toBeDefined();
    });

    it('should get knowledge item', async () => {
      const itemData = {
        title: 'Optimization Techniques',
        description: 'Advanced optimization techniques for laser cutting',
        content: 'To optimize laser cutting performance, consider the following factors...',
        type: 'optimization' as const,
        format: 'text' as const,
        tags: ['optimization', 'performance'],
        categories: ['optimization'],
        difficulty: 'advanced' as const,
        prerequisites: ['basic-laser-knowledge'],
        calculatorTypes: ['laser-parameter-optimizer'],
        materials: ['steel'],
        processes: ['cutting'],
        equipment: ['fiber laser'],
        parameters: {},
      };

      const createdItem = await service.createKnowledgeItem('author-123', itemData);
      const retrievedItem = await service.getKnowledgeItem(createdItem.id, 'user-456');

      expect(retrievedItem).toBeDefined();
      expect(retrievedItem?.id).toBe(createdItem.id);
      expect(retrievedItem?.title).toBe('Optimization Techniques');
      expect(retrievedItem?.metadata.usageStats.viewCount).toBe(1); // Incremented by view
    });

    it('should update knowledge item', async () => {
      const itemData = {
        title: 'Troubleshooting Guide',
        description: 'Common troubleshooting steps',
        content: 'When encountering issues with laser cutting...',
        type: 'troubleshooting' as const,
        format: 'text' as const,
        tags: ['troubleshooting'],
        categories: ['support'],
        difficulty: 'intermediate' as const,
        prerequisites: [],
        calculatorTypes: [],
        materials: [],
        processes: [],
        equipment: [],
        parameters: {},
      };

      const createdItem = await service.createKnowledgeItem('author-123', itemData);

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedItem = await service.updateKnowledgeItem(createdItem.id, 'author-123', {
        title: 'Advanced Troubleshooting Guide',
        content: 'Updated content with more advanced techniques...',
      });

      expect(updatedItem.title).toBe('Advanced Troubleshooting Guide');
      expect(updatedItem.content).toBe('Updated content with more advanced techniques...');
      expect(updatedItem.version).toBe(2); // Version incremented due to content change
      expect(updatedItem.updatedAt.getTime()).toBeGreaterThanOrEqual(createdItem.createdAt.getTime());
    });

    it('should validate knowledge item', async () => {
      const itemData = {
        title: 'Best Practice Guide',
        description: 'Industry best practices',
        content: 'Follow these best practices for optimal results...',
        type: 'best-practice' as const,
        format: 'text' as const,
        tags: ['best-practices'],
        categories: ['guidelines'],
        difficulty: 'intermediate' as const,
        prerequisites: [],
        calculatorTypes: [],
        materials: [],
        processes: [],
        equipment: [],
        parameters: {},
      };

      const createdItem = await service.createKnowledgeItem('author-123', itemData);
      
      // Mock expert profile for validation
      const mockExpertProfile = {
        id: 'expert-456',
        userId: 'expert-456',
        level: 'expert' as const,
        specializations: ['safety'],
        certifications: [],
        experience: {
          yearsOfExperience: 10,
          industriesWorked: [],
          equipmentExperience: [],
          materialExperience: [],
          processExperience: [],
          projectsCompleted: 100,
          companiesWorked: [],
        },
        reputation: {
          overallRating: 4.5,
          totalRatings: 20,
          ratingDistribution: {},
          endorsements: [],
          achievements: [],
          trustScore: 0.9,
        },
        validationStats: {
          totalValidations: 50,
          approvedValidations: 45,
          rejectedValidations: 5,
          averageScore: 85,
          averageConfidence: 0.9,
          specialtyBreakdown: {},
          accuracyRate: 0.9,
          responseTime: 24,
          lastValidation: new Date(),
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the expert validation service
      const { expertValidationService } = await import('../../services/expertValidationService');
      const originalGetExpertProfile = expertValidationService.getExpertProfile;
      expertValidationService.getExpertProfile = async () => mockExpertProfile;

      const validatedItem = await service.validateKnowledgeItem(createdItem.id, 'expert-456');

      expect(validatedItem.metadata.validationData.validatedBy).toContain('expert-456');
      expect(validatedItem.metadata.validationData.validationScore).toBe(90); // Expert level score
      expect(validatedItem.status).toBe('approved'); // Score >= 80

      // Restore original function
      expertValidationService.getExpertProfile = originalGetExpertProfile;
    });

    it('should search knowledge items', async () => {
      // Create multiple items
      const items = [
        {
          title: 'Safety Guidelines',
          description: 'Safety guidelines for laser operations',
          content: 'Safety is paramount...',
          type: 'safety' as const,
          format: 'text' as const,
          tags: ['safety', 'guidelines'],
          categories: ['safety'],
          difficulty: 'beginner' as const,
          prerequisites: [],
          calculatorTypes: ['laser-cutting-cost'],
          materials: ['steel'],
          processes: [],
          equipment: [],
          parameters: {},
        },
        {
          title: 'Optimization Tips',
          description: 'Tips for optimizing laser cutting',
          content: 'To optimize performance...',
          type: 'optimization' as const,
          format: 'text' as const,
          tags: ['optimization', 'tips'],
          categories: ['optimization'],
          difficulty: 'advanced' as const,
          prerequisites: [],
          calculatorTypes: ['laser-parameter-optimizer'],
          materials: ['aluminum'],
          processes: [],
          equipment: [],
          parameters: {},
        },
      ];

      for (const itemData of items) {
        await service.createKnowledgeItem('author-123', itemData);
      }

      // Search by type
      const safetyItems = await service.searchKnowledgeItems({ type: 'safety' });
      expect(safetyItems).toHaveLength(1);
      expect(safetyItems[0].type).toBe('safety');

      // Search by difficulty
      const beginnerItems = await service.searchKnowledgeItems({ difficulty: 'beginner' });
      expect(beginnerItems).toHaveLength(1);
      expect(beginnerItems[0].difficulty).toBe('beginner');

      // Search by tags
      const optimizationItems = await service.searchKnowledgeItems({ tags: ['optimization'] });
      expect(optimizationItems).toHaveLength(1);
      expect(optimizationItems[0].tags).toContain('optimization');

      // Search by calculator types
      const costItems = await service.searchKnowledgeItems({ calculatorTypes: ['laser-cutting-cost'] });
      expect(costItems).toHaveLength(1);
      expect(costItems[0].metadata.calculatorTypes).toContain('laser-cutting-cost');

      // Search by text
      const searchResults = await service.searchKnowledgeItems({ searchTerm: 'safety' });
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toContain('Safety');
    });
  });

  describe('learning path management', () => {
    let knowledgeItemIds: string[];

    beforeEach(async () => {
      // Create knowledge items for learning paths
      const items = [
        {
          title: 'Laser Basics',
          description: 'Introduction to laser cutting',
          content: 'Laser cutting is a technology...',
          type: 'technique' as const,
          format: 'text' as const,
          tags: ['basics'],
          categories: ['introduction'],
          difficulty: 'beginner' as const,
          prerequisites: [],
          calculatorTypes: [],
          materials: [],
          processes: [],
          equipment: [],
          parameters: {},
        },
        {
          title: 'Advanced Techniques',
          description: 'Advanced laser cutting techniques',
          content: 'Advanced techniques include...',
          type: 'technique' as const,
          format: 'text' as const,
          tags: ['advanced'],
          categories: ['techniques'],
          difficulty: 'advanced' as const,
          prerequisites: ['laser-basics'],
          calculatorTypes: [],
          materials: [],
          processes: [],
          equipment: [],
          parameters: {},
        },
      ];

      knowledgeItemIds = [];
      for (const itemData of items) {
        const item = await service.createKnowledgeItem('author-123', itemData);
        knowledgeItemIds.push(item.id);
      }
    });

    it('should create learning path', async () => {
      const pathData = {
        title: 'Laser Cutting Mastery',
        description: 'Complete guide to laser cutting mastery',
        objective: 'Master laser cutting from basics to advanced techniques',
        targetAudience: ['beginners', 'intermediate users'],
        difficulty: 'intermediate' as const,
        knowledgeItemIds,
        prerequisites: [],
        outcomes: ['Understand laser cutting basics', 'Apply advanced techniques'],
        certification: {
          name: 'Laser Cutting Expert',
          description: 'Certification for laser cutting expertise',
          requirements: ['Complete all modules', 'Pass final assessment'],
          validityPeriod: 24,
          renewalRequired: true,
        },
      };

      const path = await service.createLearningPath('creator-123', pathData);

      expect(path).toBeDefined();
      expect(path.id).toBeDefined();
      expect(path.title).toBe('Laser Cutting Mastery');
      expect(path.description).toBe('Complete guide to laser cutting mastery');
      expect(path.difficulty).toBe('intermediate');
      expect(path.knowledgeItems).toHaveLength(2);
      expect(path.knowledgeItems[0].knowledgeItemId).toBe(knowledgeItemIds[0]);
      expect(path.knowledgeItems[1].knowledgeItemId).toBe(knowledgeItemIds[1]);
      expect(path.certification.available).toBe(true);
      expect(path.certification.name).toBe('Laser Cutting Expert');
      expect(path.estimatedDuration).toBeGreaterThan(0);
      expect(path.createdBy).toBe('creator-123');
      expect(path.isActive).toBe(true);
    });

    it('should get learning path', async () => {
      const pathData = {
        title: 'Safety Training',
        description: 'Comprehensive safety training',
        objective: 'Learn safety protocols',
        targetAudience: ['all users'],
        difficulty: 'beginner' as const,
        knowledgeItemIds: [knowledgeItemIds[0]],
        prerequisites: [],
        outcomes: ['Understand safety protocols'],
        certification: {},
      };

      const createdPath = await service.createLearningPath('creator-123', pathData);
      const retrievedPath = await service.getLearningPath(createdPath.id);

      expect(retrievedPath).toBeDefined();
      expect(retrievedPath?.id).toBe(createdPath.id);
      expect(retrievedPath?.title).toBe('Safety Training');
    });

    it('should start learning path', async () => {
      const pathData = {
        title: 'Quick Start Guide',
        description: 'Quick start guide for beginners',
        objective: 'Get started quickly',
        targetAudience: ['beginners'],
        difficulty: 'beginner' as const,
        knowledgeItemIds: [knowledgeItemIds[0]],
        prerequisites: [],
        outcomes: ['Basic understanding'],
        certification: {},
      };

      const path = await service.createLearningPath('creator-123', pathData);
      const progress = await service.startLearningPath('user-456', path.id);

      expect(progress).toBeDefined();
      expect(progress.userId).toBe('user-456');
      expect(progress.learningPathId).toBe(path.id);
      expect(progress.status).toBe('in-progress');
      expect(progress.overallProgress).toBe(0);
      expect(progress.progress).toHaveLength(1);
      expect(progress.progress[0].knowledgeItemId).toBe(knowledgeItemIds[0]);
      expect(progress.progress[0].status).toBe('not-started');
      expect(progress.startedAt).toBeDefined();
    });

    it('should update item progress', async () => {
      const pathData = {
        title: 'Progress Test Path',
        description: 'Path for testing progress updates',
        objective: 'Test progress tracking',
        targetAudience: ['testers'],
        difficulty: 'beginner' as const,
        knowledgeItemIds,
        prerequisites: [],
        outcomes: ['Progress tracking works'],
        certification: { available: true },
      };

      const path = await service.createLearningPath('creator-123', pathData);
      await service.startLearningPath('user-456', path.id);

      // Complete first item
      const progress1 = await service.updateItemProgress(
        'user-456',
        path.id,
        knowledgeItemIds[0],
        'completed',
        30
      );

      expect(progress1.progress[0].status).toBe('completed');
      expect(progress1.progress[0].timeSpent).toBe(30);
      expect(progress1.overallProgress).toBe(0.5); // 1 of 2 items completed
      expect(progress1.timeSpent).toBe(30);

      // Complete second item
      const progress2 = await service.updateItemProgress(
        'user-456',
        path.id,
        knowledgeItemIds[1],
        'completed',
        45
      );

      expect(progress2.progress[1].status).toBe('completed');
      expect(progress2.overallProgress).toBe(1); // All items completed
      expect(progress2.status).toBe('certified'); // Certification available
      expect(progress2.completedAt).toBeDefined();
      expect(progress2.certifiedAt).toBeDefined();
      expect(progress2.achievements).toHaveLength(2); // Completion + Certification
    });

    it('should get user progress', async () => {
      const pathData = {
        title: 'User Progress Test',
        description: 'Test user progress retrieval',
        objective: 'Test progress retrieval',
        targetAudience: ['testers'],
        difficulty: 'beginner' as const,
        knowledgeItemIds: [knowledgeItemIds[0]],
        prerequisites: [],
        outcomes: ['Progress retrieval works'],
        certification: {},
      };

      const path = await service.createLearningPath('creator-123', pathData);
      const startedProgress = await service.startLearningPath('user-456', path.id);
      const retrievedProgress = await service.getUserProgress('user-456', path.id);

      expect(retrievedProgress).toBeDefined();
      expect(retrievedProgress?.userId).toBe('user-456');
      expect(retrievedProgress?.learningPathId).toBe(path.id);
      expect(retrievedProgress?.status).toBe('in-progress');
    });
  });

  describe('knowledge analytics', () => {
    beforeEach(async () => {
      // Create sample knowledge items
      const items = [
        {
          title: 'Safety Item 1',
          description: 'Safety description',
          content: 'Safety content',
          type: 'safety' as const,
          format: 'text' as const,
          tags: ['safety'],
          categories: ['safety'],
          difficulty: 'beginner' as const,
          prerequisites: [],
          calculatorTypes: [],
          materials: [],
          processes: [],
          equipment: [],
          parameters: {},
        },
        {
          title: 'Safety Item 2',
          description: 'Another safety description',
          content: 'More safety content',
          type: 'safety' as const,
          format: 'text' as const,
          tags: ['safety'],
          categories: ['safety'],
          difficulty: 'intermediate' as const,
          prerequisites: [],
          calculatorTypes: [],
          materials: [],
          processes: [],
          equipment: [],
          parameters: {},
        },
        {
          title: 'Optimization Item',
          description: 'Optimization description',
          content: 'Optimization content',
          type: 'optimization' as const,
          format: 'text' as const,
          tags: ['optimization'],
          categories: ['optimization'],
          difficulty: 'advanced' as const,
          prerequisites: [],
          calculatorTypes: [],
          materials: [],
          processes: [],
          equipment: [],
          parameters: {},
        },
      ];

      for (const itemData of items) {
        await service.createKnowledgeItem('author-123', itemData);
      }
    });

    it('should get knowledge analytics', async () => {
      const analytics = await service.getKnowledgeAnalytics();

      expect(analytics).toBeDefined();
      expect(analytics.totalItems).toBe(3);
      expect(analytics.itemsByType.safety).toBe(2);
      expect(analytics.itemsByType.optimization).toBe(1);
      expect(analytics.itemsByStatus.draft).toBe(3); // All items start as draft
      expect(analytics.topAuthors).toHaveLength(1);
      expect(analytics.topAuthors[0].authorId).toBe('author-123');
      expect(analytics.topAuthors[0].itemCount).toBe(3);
      expect(analytics.mostViewed).toHaveLength(3);
      expect(analytics.recentItems).toHaveLength(3);
    });
  });

  describe('edge cases and validation', () => {
    it('should handle non-existent knowledge item', async () => {
      const item = await service.getKnowledgeItem('non-existent-id');
      expect(item).toBeNull();
    });

    it('should handle non-existent learning path', async () => {
      const path = await service.getLearningPath('non-existent-id');
      expect(path).toBeNull();
    });

    it('should prevent unauthorized updates', async () => {
      const itemData = {
        title: 'Test Item',
        description: 'Test description',
        content: 'Test content',
        type: 'technique' as const,
        format: 'text' as const,
        tags: [],
        categories: [],
        difficulty: 'beginner' as const,
        prerequisites: [],
        calculatorTypes: [],
        materials: [],
        processes: [],
        equipment: [],
        parameters: {},
      };

      const item = await service.createKnowledgeItem('author-123', itemData);

      await expect(
        service.updateKnowledgeItem(item.id, 'unauthorized-user', { title: 'Hacked Title' })
      ).rejects.toThrow('Not authorized to update this knowledge item');
    });

    it('should handle invalid knowledge items in learning path', async () => {
      await expect(
        service.createLearningPath('creator-123', {
          title: 'Invalid Path',
          description: 'Path with invalid items',
          objective: 'Test invalid items',
          targetAudience: ['testers'],
          difficulty: 'beginner',
          knowledgeItemIds: ['non-existent-item'],
          prerequisites: [],
          outcomes: [],
          certification: {},
        })
      ).rejects.toThrow('Knowledge item non-existent-item not found');
    });

    it('should handle progress updates for non-existent learning path', async () => {
      await expect(
        service.updateItemProgress('user-123', 'non-existent-path', 'item-123', 'completed')
      ).rejects.toThrow('Learning path not started');
    });

    it('should handle validation by non-expert', async () => {
      const itemData = {
        title: 'Test Item for Validation',
        description: 'Test description',
        content: 'Test content',
        type: 'technique' as const,
        format: 'text' as const,
        tags: [],
        categories: [],
        difficulty: 'beginner' as const,
        prerequisites: [],
        calculatorTypes: [],
        materials: [],
        processes: [],
        equipment: [],
        parameters: {},
      };

      const item = await service.createKnowledgeItem('author-123', itemData);

      // Mock expert validation service to return null (no expert profile)
      const { expertValidationService } = await import('../../services/expertValidationService');
      const originalGetExpertProfile = expertValidationService.getExpertProfile;
      expertValidationService.getExpertProfile = async () => null;

      await expect(
        service.validateKnowledgeItem(item.id, 'non-expert')
      ).rejects.toThrow('Validator must be a registered expert');

      // Restore original function
      expertValidationService.getExpertProfile = originalGetExpertProfile;
    });
  });
});
