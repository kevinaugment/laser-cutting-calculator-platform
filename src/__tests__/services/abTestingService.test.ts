/**
 * A/B Testing Service Tests
 * Comprehensive test suite for the A/B testing framework
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ABTestingService, abTestingService } from '../../services/abTestingService';

describe('ABTestingService', () => {
  let service: ABTestingService;

  beforeEach(() => {
    service = new ABTestingService();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new ABTestingService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new ABTestingService({
        defaultConfidenceLevel: 0.99,
        minSampleSize: 200,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('experiment management', () => {
    it('should create a new experiment', () => {
      const experimentData = {
        name: 'Test Experiment',
        description: 'Testing recommendation algorithms',
        status: 'draft' as const,
        startDate: new Date(),
        targetAudience: {
          id: 'all-users',
          name: 'All Users',
          criteria: [],
        },
        variants: [
          {
            id: 'control',
            name: 'Control',
            type: 'control' as const,
            description: 'Current algorithm',
            trafficWeight: 50,
            configuration: { algorithmType: 'frequency-based' as const },
            isActive: true,
          },
          {
            id: 'treatment',
            name: 'Treatment',
            type: 'treatment' as const,
            description: 'New ML algorithm',
            trafficWeight: 50,
            configuration: { algorithmType: 'ml-enhanced' as const },
            isActive: true,
          },
        ],
        metrics: [
          {
            id: 'conversion',
            name: 'Conversion Rate',
            type: 'conversion' as const,
            description: 'User conversion rate',
            improvementThreshold: 5,
            isPrimary: true,
          },
        ],
        trafficAllocation: 100,
        createdBy: 'test-user',
      };

      const experiment = service.createExperiment(experimentData);

      expect(experiment).toBeDefined();
      expect(experiment.id).toBeDefined();
      expect(experiment.name).toBe('Test Experiment');
      expect(experiment.variants).toHaveLength(2);
      expect(experiment.status).toBe('draft');
    });

    it('should validate experiment configuration', () => {
      const invalidExperimentData = {
        name: 'Invalid Experiment',
        description: 'Testing validation',
        status: 'draft' as const,
        startDate: new Date(),
        targetAudience: {
          id: 'all-users',
          name: 'All Users',
          criteria: [],
        },
        variants: [
          {
            id: 'control',
            name: 'Control',
            type: 'control' as const,
            description: 'Current algorithm',
            trafficWeight: 60, // Invalid: doesn't sum to 100
            configuration: {},
            isActive: true,
          },
          {
            id: 'treatment',
            name: 'Treatment',
            type: 'treatment' as const,
            description: 'New algorithm',
            trafficWeight: 30, // Invalid: doesn't sum to 100
            configuration: {},
            isActive: true,
          },
        ],
        metrics: [], // Invalid: no metrics
        trafficAllocation: 100,
        createdBy: 'test-user',
      };

      expect(() => service.createExperiment(invalidExperimentData)).toThrow();
    });

    it('should start and stop experiments', () => {
      const experimentData = {
        name: 'Test Experiment',
        description: 'Testing start/stop',
        status: 'draft' as const,
        startDate: new Date(),
        targetAudience: {
          id: 'all-users',
          name: 'All Users',
          criteria: [],
        },
        variants: [
          {
            id: 'control',
            name: 'Control',
            type: 'control' as const,
            description: 'Control variant',
            trafficWeight: 100,
            configuration: {},
            isActive: true,
          },
        ],
        metrics: [
          {
            id: 'conversion',
            name: 'Conversion',
            type: 'conversion' as const,
            description: 'Conversion metric',
            improvementThreshold: 5,
            isPrimary: true,
          },
        ],
        trafficAllocation: 100,
        createdBy: 'test-user',
      };

      const experiment = service.createExperiment(experimentData);
      
      // Start experiment
      const started = service.startExperiment(experiment.id);
      expect(started).toBe(true);
      
      const startedExperiment = service.getExperiment(experiment.id);
      expect(startedExperiment?.status).toBe('active');

      // Stop experiment
      const stopped = service.stopExperiment(experiment.id);
      expect(stopped).toBe(true);
      
      const stoppedExperiment = service.getExperiment(experiment.id);
      expect(stoppedExperiment?.status).toBe('completed');
    });

    it('should get active experiments', () => {
      const experimentData = {
        name: 'Active Experiment',
        description: 'Testing active experiments',
        status: 'draft' as const,
        startDate: new Date(),
        targetAudience: {
          id: 'all-users',
          name: 'All Users',
          criteria: [],
        },
        variants: [
          {
            id: 'control',
            name: 'Control',
            type: 'control' as const,
            description: 'Control variant',
            trafficWeight: 100,
            configuration: {},
            isActive: true,
          },
        ],
        metrics: [
          {
            id: 'conversion',
            name: 'Conversion',
            type: 'conversion' as const,
            description: 'Conversion metric',
            improvementThreshold: 5,
            isPrimary: true,
          },
        ],
        trafficAllocation: 100,
        createdBy: 'test-user',
      };

      const experiment = service.createExperiment(experimentData);
      service.startExperiment(experiment.id);

      const activeExperiments = service.getActiveExperiments();
      expect(activeExperiments).toHaveLength(1);
      expect(activeExperiments[0].id).toBe(experiment.id);
    });
  });

  describe('user assignment', () => {
    let experiment: any;

    beforeEach(() => {
      const experimentData = {
        name: 'Assignment Test',
        description: 'Testing user assignment',
        status: 'draft' as const,
        startDate: new Date(),
        targetAudience: {
          id: 'all-users',
          name: 'All Users',
          criteria: [],
        },
        variants: [
          {
            id: 'control',
            name: 'Control',
            type: 'control' as const,
            description: 'Control variant',
            trafficWeight: 50,
            configuration: { algorithmType: 'frequency-based' as const },
            isActive: true,
          },
          {
            id: 'treatment',
            name: 'Treatment',
            type: 'treatment' as const,
            description: 'Treatment variant',
            trafficWeight: 50,
            configuration: { algorithmType: 'ml-enhanced' as const },
            isActive: true,
          },
        ],
        metrics: [
          {
            id: 'conversion',
            name: 'Conversion',
            type: 'conversion' as const,
            description: 'Conversion metric',
            improvementThreshold: 5,
            isPrimary: true,
          },
        ],
        trafficAllocation: 100,
        createdBy: 'test-user',
      };

      experiment = service.createExperiment(experimentData);
      service.startExperiment(experiment.id);
    });

    it('should assign user to experiment variant', () => {
      const assignment = service.assignUserToExperiment('user-123', experiment.id, 'session-456');
      
      expect(assignment).toBeDefined();
      expect(assignment?.userId).toBe('user-123');
      expect(assignment?.experimentId).toBe(experiment.id);
      expect(assignment?.variantId).toBeDefined();
      expect(assignment?.sessionId).toBe('session-456');
    });

    it('should return consistent assignment for same user', () => {
      const assignment1 = service.assignUserToExperiment('user-123', experiment.id);
      const assignment2 = service.assignUserToExperiment('user-123', experiment.id);
      
      expect(assignment1?.variantId).toBe(assignment2?.variantId);
    });

    it('should get user assignment', () => {
      service.assignUserToExperiment('user-123', experiment.id);
      
      const assignment = service.getUserAssignment('user-123', experiment.id);
      expect(assignment).toBeDefined();
      expect(assignment?.userId).toBe('user-123');
    });

    it('should get user variant', () => {
      service.assignUserToExperiment('user-123', experiment.id);
      
      const variant = service.getUserVariant('user-123', experiment.id);
      expect(variant).toBeDefined();
      expect(['control', 'treatment']).toContain(variant?.id);
    });
  });

  describe('event tracking', () => {
    let experiment: any;

    beforeEach(() => {
      const experimentData = {
        name: 'Tracking Test',
        description: 'Testing event tracking',
        status: 'draft' as const,
        startDate: new Date(),
        targetAudience: {
          id: 'all-users',
          name: 'All Users',
          criteria: [],
        },
        variants: [
          {
            id: 'control',
            name: 'Control',
            type: 'control' as const,
            description: 'Control variant',
            trafficWeight: 100,
            configuration: {},
            isActive: true,
          },
        ],
        metrics: [
          {
            id: 'conversion',
            name: 'Conversion',
            type: 'conversion' as const,
            description: 'Conversion metric',
            improvementThreshold: 5,
            isPrimary: true,
          },
        ],
        trafficAllocation: 100,
        createdBy: 'test-user',
      };

      experiment = service.createExperiment(experimentData);
      service.startExperiment(experiment.id);
      service.assignUserToExperiment('user-123', experiment.id, 'session-456');
    });

    it('should track experiment events', () => {
      service.trackEvent('user-123', 'session-456', experiment.id, 'click', { button: 'submit' });
      
      // Event tracking is internal, so we test through results
      const results = service.getExperimentResults(experiment.id);
      expect(results).toBeDefined();
    });

    it('should track conversion events', () => {
      service.trackConversion('user-123', 'session-456', experiment.id, { value: 100 });
      
      const results = service.getExperimentResults(experiment.id);
      expect(results).toBeDefined();
    });
  });

  describe('results and analysis', () => {
    let experiment: any;

    beforeEach(() => {
      const experimentData = {
        name: 'Results Test',
        description: 'Testing results analysis',
        status: 'draft' as const,
        startDate: new Date(),
        targetAudience: {
          id: 'all-users',
          name: 'All Users',
          criteria: [],
        },
        variants: [
          {
            id: 'control',
            name: 'Control',
            type: 'control' as const,
            description: 'Control variant',
            trafficWeight: 50,
            configuration: {},
            isActive: true,
          },
          {
            id: 'treatment',
            name: 'Treatment',
            type: 'treatment' as const,
            description: 'Treatment variant',
            trafficWeight: 50,
            configuration: {},
            isActive: true,
          },
        ],
        metrics: [
          {
            id: 'conversion',
            name: 'Conversion',
            type: 'conversion' as const,
            description: 'Conversion metric',
            improvementThreshold: 5,
            isPrimary: true,
          },
        ],
        trafficAllocation: 100,
        createdBy: 'test-user',
      };

      experiment = service.createExperiment(experimentData);
      service.startExperiment(experiment.id);
    });

    it('should generate experiment results', () => {
      // Assign some users and track events
      service.assignUserToExperiment('user-1', experiment.id);
      service.assignUserToExperiment('user-2', experiment.id);
      service.trackConversion('user-1', 'session-1', experiment.id);
      
      const results = service.getExperimentResults(experiment.id);
      
      expect(results).toBeDefined();
      expect(results?.experimentId).toBe(experiment.id);
      expect(results?.variantResults).toHaveLength(2);
      expect(results?.totalParticipants).toBeGreaterThan(0);
      expect(results?.statisticalSignificance).toBeDefined();
      expect(results?.recommendations).toBeDefined();
    });

    it('should calculate variant performance', () => {
      service.assignUserToExperiment('user-1', experiment.id);
      service.trackConversion('user-1', 'session-1', experiment.id);
      
      const results = service.getExperimentResults(experiment.id);
      const variantWithConversion = results?.variantResults.find(v => v.participants > 0);
      
      expect(variantWithConversion).toBeDefined();
      expect(variantWithConversion?.conversionRate).toBeGreaterThan(0);
    });

    it('should provide statistical significance', () => {
      const results = service.getExperimentResults(experiment.id);
      
      expect(results?.statisticalSignificance).toBeDefined();
      expect(results?.statisticalSignificance.confidenceLevel).toBeGreaterThan(0);
      expect(results?.statisticalSignificance.recommendedAction).toBeDefined();
    });

    it('should generate recommendations', () => {
      const results = service.getExperimentResults(experiment.id);
      
      expect(results?.recommendations).toBeDefined();
      expect(Array.isArray(results?.recommendations)).toBe(true);
    });
  });
});
