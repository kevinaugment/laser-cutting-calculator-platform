/**
 * Expert Validation Service Tests
 * Comprehensive test suite for expert validation functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ExpertValidationService, expertValidationService } from '../../services/expertValidationService';

describe('ExpertValidationService', () => {
  let service: ExpertValidationService;

  beforeEach(() => {
    service = new ExpertValidationService();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new ExpertValidationService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new ExpertValidationService({
        maxValidationRequests: 50,
        defaultValidationTimeout: 48,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('expert profile management', () => {
    it('should register expert profile', async () => {
      const profileData = {
        level: 'expert' as const,
        specializations: ['safety', 'efficiency'],
        certifications: [{
          id: 'cert-1',
          name: 'Laser Safety Certification',
          issuer: 'Laser Institute',
          issuedAt: new Date(),
          isVerified: true,
        }],
        experience: {
          yearsOfExperience: 10,
          industriesWorked: ['Manufacturing', 'Aerospace'],
          equipmentExperience: ['CO2 Laser', 'Fiber Laser'],
          materialExperience: ['Steel', 'Aluminum'],
          processExperience: ['Cutting', 'Engraving'],
          projectsCompleted: 500,
          companiesWorked: ['Company A', 'Company B'],
        },
        reputation: {
          overallRating: 4.8,
          totalRatings: 25,
          ratingDistribution: { 5: 20, 4: 5 },
          endorsements: [],
          achievements: [],
          trustScore: 0.95,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: true,
      };

      const expert = await service.registerExpert('user-123', profileData);

      expect(expert).toBeDefined();
      expect(expert.id).toBeDefined();
      expect(expert.userId).toBe('user-123');
      expect(expert.level).toBe('expert');
      expect(expert.specializations).toEqual(['safety', 'efficiency']);
      expect(expert.experience.yearsOfExperience).toBe(10);
      expect(expert.reputation.trustScore).toBe(0.95);
      expect(expert.isActive).toBe(true);
    });

    it('should get expert profile', async () => {
      const profileData = {
        level: 'journeyman' as const,
        specializations: ['quality'],
        certifications: [],
        experience: {
          yearsOfExperience: 5,
          industriesWorked: ['Manufacturing'],
          equipmentExperience: ['CO2 Laser'],
          materialExperience: ['Steel'],
          processExperience: ['Cutting'],
          projectsCompleted: 100,
          companiesWorked: ['Company A'],
        },
        reputation: {
          overallRating: 4.0,
          totalRatings: 10,
          ratingDistribution: { 4: 10 },
          endorsements: [],
          achievements: [],
          trustScore: 0.8,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: true,
      };

      await service.registerExpert('user-123', profileData);
      const retrievedExpert = await service.getExpertProfile('user-123');

      expect(retrievedExpert).toBeDefined();
      expect(retrievedExpert?.userId).toBe('user-123');
      expect(retrievedExpert?.level).toBe('journeyman');
    });

    it('should update expert profile', async () => {
      const profileData = {
        level: 'apprentice' as const,
        specializations: ['general'],
        certifications: [],
        experience: {
          yearsOfExperience: 2,
          industriesWorked: ['Manufacturing'],
          equipmentExperience: ['CO2 Laser'],
          materialExperience: ['Steel'],
          processExperience: ['Cutting'],
          projectsCompleted: 50,
          companiesWorked: ['Company A'],
        },
        reputation: {
          overallRating: 3.5,
          totalRatings: 5,
          ratingDistribution: { 3: 2, 4: 3 },
          endorsements: [],
          achievements: [],
          trustScore: 0.7,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: true,
      };

      await service.registerExpert('user-123', profileData);

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedExpert = await service.updateExpertProfile('user-123', {
        level: 'journeyman',
        specializations: ['safety', 'quality'],
      });

      expect(updatedExpert.level).toBe('journeyman');
      expect(updatedExpert.specializations).toEqual(['safety', 'quality']);
      expect(updatedExpert.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedExpert.createdAt.getTime());
    });

    it('should get available experts', async () => {
      // Register multiple experts
      const expert1Data = {
        level: 'expert' as const,
        specializations: ['safety'],
        certifications: [],
        experience: {
          yearsOfExperience: 10,
          industriesWorked: ['Manufacturing'],
          equipmentExperience: ['CO2 Laser'],
          materialExperience: ['Steel'],
          processExperience: ['Cutting'],
          projectsCompleted: 500,
          companiesWorked: ['Company A'],
        },
        reputation: {
          overallRating: 4.8,
          totalRatings: 25,
          ratingDistribution: { 5: 20, 4: 5 },
          endorsements: [],
          achievements: [],
          trustScore: 0.95,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: true,
      };

      const expert2Data = {
        ...expert1Data,
        level: 'journeyman' as const,
        specializations: ['efficiency'],
        reputation: {
          ...expert1Data.reputation,
          trustScore: 0.8,
        },
      };

      await service.registerExpert('expert-1', expert1Data);
      await service.registerExpert('expert-2', expert2Data);

      const allExperts = await service.getAvailableExperts();
      expect(allExperts).toHaveLength(2);

      const safetyExperts = await service.getAvailableExperts('safety');
      expect(safetyExperts).toHaveLength(1);
      expect(safetyExperts[0].userId).toBe('expert-1');

      const expertLevelExperts = await service.getAvailableExperts(undefined, 'expert');
      expect(expertLevelExperts).toHaveLength(1);
      expect(expertLevelExperts[0].level).toBe('expert');
    });
  });

  describe('validation request management', () => {
    beforeEach(async () => {
      // Register an expert for testing
      const expertData = {
        level: 'expert' as const,
        specializations: ['safety', 'efficiency'],
        certifications: [],
        experience: {
          yearsOfExperience: 10,
          industriesWorked: ['Manufacturing'],
          equipmentExperience: ['CO2 Laser'],
          materialExperience: ['Steel'],
          processExperience: ['Cutting'],
          projectsCompleted: 500,
          companiesWorked: ['Company A'],
        },
        reputation: {
          overallRating: 4.8,
          totalRatings: 25,
          ratingDistribution: { 5: 20, 4: 5 },
          endorsements: [],
          achievements: [],
          trustScore: 0.95,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: true,
      };

      await service.registerExpert('expert-123', expertData);
    });

    it('should create validation request', async () => {
      const requestData = {
        presetId: 'preset-123',
        category: 'safety' as const,
        priority: 'high' as const,
        description: 'Please validate these laser cutting parameters for safety compliance',
        requirements: ['Check power levels', 'Verify safety margins'],
      };

      const request = await service.createValidationRequest('user-123', requestData);

      expect(request).toBeDefined();
      expect(request.id).toBeDefined();
      expect(request.presetId).toBe('preset-123');
      expect(request.requestedBy).toBe('user-123');
      expect(request.category).toBe('safety');
      expect(request.priority).toBe('high');
      expect(request.status).toBe('pending');
      expect(request.description).toBe('Please validate these laser cutting parameters for safety compliance');
      expect(request.requirements).toEqual(['Check power levels', 'Verify safety margins']);
      expect(request.dueDate).toBeDefined();
    });

    it('should auto-assign expert when enabled', async () => {
      const requestData = {
        presetId: 'preset-123',
        category: 'safety' as const,
        priority: 'medium' as const,
        description: 'Safety validation needed',
        requirements: ['Safety check'],
      };

      const request = await service.createValidationRequest('user-123', requestData);

      expect(request.assignedTo).toBe('expert-123');
    });

    it('should assign validation request to expert', async () => {
      const requestData = {
        presetId: 'preset-123',
        category: 'efficiency' as const,
        priority: 'low' as const,
        description: 'Efficiency validation needed',
        requirements: ['Efficiency check'],
      };

      const request = await service.createValidationRequest('user-123', requestData);

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const assignedRequest = await service.assignValidationRequest(
        request.id,
        'expert-123',
        'admin-456'
      );

      expect(assignedRequest.assignedTo).toBe('expert-123');
      expect(assignedRequest.updatedAt.getTime()).toBeGreaterThanOrEqual(request.createdAt.getTime());
    });

    it('should get expert validation requests', async () => {
      const requestData1 = {
        presetId: 'preset-123',
        category: 'safety' as const,
        priority: 'high' as const,
        description: 'Safety validation 1',
        requirements: ['Safety check'],
      };

      const requestData2 = {
        presetId: 'preset-456',
        category: 'efficiency' as const,
        priority: 'medium' as const,
        description: 'Efficiency validation 2',
        requirements: ['Efficiency check'],
      };

      await service.createValidationRequest('user-123', requestData1);
      await service.createValidationRequest('user-456', requestData2);

      const expertRequests = await service.getExpertValidationRequests('expert-123');
      expect(expertRequests).toHaveLength(2);

      const pendingRequests = await service.getExpertValidationRequests('expert-123', 'pending');
      expect(pendingRequests).toHaveLength(2);
      expect(pendingRequests.every(r => r.status === 'pending')).toBe(true);

      // Check priority sorting (high priority first)
      expect(pendingRequests[0].priority).toBe('high');
      expect(pendingRequests[1].priority).toBe('medium');
    });
  });

  describe('validation result management', () => {
    let validationRequest: any;

    beforeEach(async () => {
      // Register expert and create validation request
      const expertData = {
        level: 'expert' as const,
        specializations: ['safety'],
        certifications: [],
        experience: {
          yearsOfExperience: 10,
          industriesWorked: ['Manufacturing'],
          equipmentExperience: ['CO2 Laser'],
          materialExperience: ['Steel'],
          processExperience: ['Cutting'],
          projectsCompleted: 500,
          companiesWorked: ['Company A'],
        },
        reputation: {
          overallRating: 4.8,
          totalRatings: 25,
          ratingDistribution: { 5: 20, 4: 5 },
          endorsements: [],
          achievements: [],
          trustScore: 0.95,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: true,
      };

      await service.registerExpert('expert-123', expertData);

      const requestData = {
        presetId: 'preset-123',
        category: 'safety' as const,
        priority: 'high' as const,
        description: 'Safety validation needed',
        requirements: ['Safety check'],
      };

      validationRequest = await service.createValidationRequest('user-123', requestData);
    });

    it('should submit validation result', async () => {
      const resultData = {
        requestId: validationRequest.id,
        status: 'approved' as const,
        score: 85,
        findings: [{
          type: 'suggestion' as const,
          severity: 'low' as const,
          parameter: 'power',
          currentValue: 100,
          suggestedValue: 95,
          description: 'Consider reducing power slightly',
          reasoning: 'Better safety margin',
          impact: 'Improved safety',
          references: ['Safety Standard 123'],
        }],
        recommendations: [{
          type: 'safety-enhancement' as const,
          priority: 'medium' as const,
          title: 'Add safety monitoring',
          description: 'Implement real-time safety monitoring',
          implementation: 'Install safety sensors',
          expectedBenefit: 'Enhanced safety',
          prerequisites: ['Safety training'],
        }],
        approvedParameters: { power: 95, speed: 1000 },
        rejectedParameters: {},
        comments: 'Parameters are generally safe with minor adjustments',
        confidence: 0.9,
        methodology: 'Safety standards review',
        references: ['Safety Standard 123', 'Best Practices Guide'],
      };

      const result = await service.submitValidationResult('expert-123', resultData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.requestId).toBe(validationRequest.id);
      expect(result.validatedBy).toBe('expert-123');
      expect(result.status).toBe('approved');
      expect(result.score).toBe(85);
      expect(result.confidence).toBe(0.9);
      expect(result.findings).toHaveLength(1);
      expect(result.recommendations).toHaveLength(1);
      expect(result.findings[0].id).toBeDefined();
      expect(result.recommendations[0].id).toBeDefined();
    });

    it('should get validation results for request', async () => {
      const resultData = {
        requestId: validationRequest.id,
        status: 'approved' as const,
        score: 90,
        findings: [],
        recommendations: [],
        approvedParameters: { power: 100 },
        rejectedParameters: {},
        comments: 'All parameters approved',
        confidence: 0.95,
        methodology: 'Standard review',
        references: [],
      };

      await service.submitValidationResult('expert-123', resultData);
      const results = await service.getValidationResults(validationRequest.id);

      expect(results).toHaveLength(1);
      expect(results[0].score).toBe(90);
      expect(results[0].status).toBe('approved');
    });

    it('should get preset validation summary', async () => {
      const resultData = {
        requestId: validationRequest.id,
        status: 'approved' as const,
        score: 88,
        findings: [],
        recommendations: [],
        approvedParameters: { power: 100 },
        rejectedParameters: {},
        comments: 'Approved with confidence',
        confidence: 0.92,
        methodology: 'Comprehensive review',
        references: [],
      };

      await service.submitValidationResult('expert-123', resultData);
      const summary = await service.getPresetValidationSummary('preset-123');

      expect(summary).toBeDefined();
      expect(summary.totalValidations).toBe(1);
      expect(summary.approvedValidations).toBe(1);
      expect(summary.averageScore).toBe(88);
      expect(summary.averageConfidence).toBe(0.92);
      expect(summary.latestValidation).toBeDefined();
      expect(summary.expertConsensus).toBe(false); // Only one validation
    });

    it('should update expert stats after validation', async () => {
      const resultData = {
        requestId: validationRequest.id,
        status: 'approved' as const,
        score: 92,
        findings: [],
        recommendations: [],
        approvedParameters: { power: 100 },
        rejectedParameters: {},
        comments: 'Excellent parameters',
        confidence: 0.98,
        methodology: 'Thorough analysis',
        references: [],
      };

      await service.submitValidationResult('expert-123', resultData);
      const expert = await service.getExpertProfile('expert-123');

      expect(expert).toBeDefined();
      expect(expert!.validationStats.totalValidations).toBe(1);
      expect(expert!.validationStats.approvedValidations).toBe(1);
      expect(expert!.validationStats.averageScore).toBe(92);
      expect(expert!.validationStats.averageConfidence).toBe(0.98);
      expect(expert!.validationStats.specialtyBreakdown.safety).toBe(1);
    });
  });

  describe('edge cases and validation', () => {
    it('should handle non-existent expert profile', async () => {
      const profile = await service.getExpertProfile('non-existent-user');
      expect(profile).toBeNull();
    });

    it('should handle non-existent validation request', async () => {
      const request = await service.getValidationRequest('non-existent-id');
      expect(request).toBeNull();
    });

    it('should prevent unauthorized validation submission', async () => {
      const expertData = {
        level: 'expert' as const,
        specializations: ['safety'],
        certifications: [],
        experience: {
          yearsOfExperience: 10,
          industriesWorked: ['Manufacturing'],
          equipmentExperience: ['CO2 Laser'],
          materialExperience: ['Steel'],
          processExperience: ['Cutting'],
          projectsCompleted: 500,
          companiesWorked: ['Company A'],
        },
        reputation: {
          overallRating: 4.8,
          totalRatings: 25,
          ratingDistribution: { 5: 20, 4: 5 },
          endorsements: [],
          achievements: [],
          trustScore: 0.95,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: true,
      };

      await service.registerExpert('expert-123', expertData);

      const requestData = {
        presetId: 'preset-123',
        category: 'safety' as const,
        priority: 'high' as const,
        description: 'Safety validation needed',
        requirements: ['Safety check'],
      };

      const request = await service.createValidationRequest('user-123', requestData);

      const resultData = {
        requestId: request.id,
        status: 'approved' as const,
        score: 85,
        findings: [],
        recommendations: [],
        approvedParameters: {},
        rejectedParameters: {},
        comments: 'Unauthorized validation attempt',
        confidence: 0.9,
        methodology: 'Standard review',
        references: [],
      };

      await expect(
        service.submitValidationResult('unauthorized-expert', resultData)
      ).rejects.toThrow('Not authorized to validate this request');
    });

    it('should handle assignment to inactive expert', async () => {
      const expertData = {
        level: 'expert' as const,
        specializations: ['safety'],
        certifications: [],
        experience: {
          yearsOfExperience: 10,
          industriesWorked: ['Manufacturing'],
          equipmentExperience: ['CO2 Laser'],
          materialExperience: ['Steel'],
          processExperience: ['Cutting'],
          projectsCompleted: 500,
          companiesWorked: ['Company A'],
        },
        reputation: {
          overallRating: 4.8,
          totalRatings: 25,
          ratingDistribution: { 5: 20, 4: 5 },
          endorsements: [],
          achievements: [],
          trustScore: 0.95,
        },
        validationStats: {
          totalValidations: 0,
          approvedValidations: 0,
          rejectedValidations: 0,
          averageScore: 0,
          averageConfidence: 0,
          specialtyBreakdown: {},
          accuracyRate: 0,
          responseTime: 0,
          lastValidation: new Date(),
        },
        isActive: false, // Inactive expert
      };

      await service.registerExpert('inactive-expert', expertData);

      const requestData = {
        presetId: 'preset-123',
        category: 'safety' as const,
        priority: 'high' as const,
        description: 'Safety validation needed',
        requirements: ['Safety check'],
      };

      const request = await service.createValidationRequest('user-123', requestData);

      await expect(
        service.assignValidationRequest(request.id, 'inactive-expert', 'admin-123')
      ).rejects.toThrow('Expert not found or inactive');
    });
  });
});
