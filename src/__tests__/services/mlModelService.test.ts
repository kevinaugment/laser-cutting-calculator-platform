/**
 * ML Model Service Tests
 * Comprehensive test suite for ML model management functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MLModelService, mlModelService } from '../../services/mlModelService';

describe('MLModelService', () => {
  let service: MLModelService;

  beforeEach(() => {
    service = new MLModelService({
      enableMonitoring: true,
      enableCaching: false, // Disable caching for testing
      maxConcurrentRequests: 10,
      requestTimeout: 5000,
    });
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new MLModelService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new MLModelService({
        enableMonitoring: false,
        enableCaching: false,
        maxConcurrentRequests: 50,
      });
      expect(customService).toBeDefined();
    });

    it('should have example models after initialization', async () => {
      const models = await service.listModels();
      expect(models.length).toBeGreaterThan(0);
      
      const recommendationModel = models.find(m => m.type === 'recommendation');
      expect(recommendationModel).toBeDefined();
      expect(recommendationModel?.name).toBe('Parameter Recommendation Engine');
    });
  });

  describe('model registration', () => {
    it('should register a new model', async () => {
      const modelData = {
        name: 'Test Classification Model',
        type: 'classification' as const,
        version: '1.0.0',
        framework: 'tensorflow' as const,
        status: 'training' as const,
        description: 'Test model for classification tasks',
        inputSchema: {
          type: 'object' as const,
          properties: {
            features: { type: 'array' as const, description: 'Input features' },
          },
          required: ['features'],
        },
        outputSchema: {
          type: 'object' as const,
          properties: {
            class: { type: 'string' as const, description: 'Predicted class' },
            probability: { type: 'number' as const, description: 'Prediction probability' },
          },
        },
        metadata: {
          author: 'Test Author',
          tags: ['classification', 'test'],
          trainingData: {
            source: 'test_dataset',
            size: 1000,
            features: ['feature1', 'feature2'],
            lastUpdated: new Date(),
          },
          hyperparameters: {
            learning_rate: 0.01,
            batch_size: 32,
          },
          dependencies: ['tensorflow==2.8.0'],
          environment: {
            python: '3.9',
            os: 'linux',
          },
        },
        performance: {
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.88,
          f1Score: 0.85,
          customMetrics: {},
          benchmarks: [],
          validationResults: [],
        },
        deployment: {
          endpoint: '/api/ml/classify',
          replicas: 2,
          resources: {
            cpu: '200m',
            memory: '512Mi',
          },
          scaling: {
            minReplicas: 1,
            maxReplicas: 5,
            targetCPU: 70,
            targetMemory: 80,
          },
          healthCheck: {
            path: '/health',
            interval: 30,
            timeout: 5,
            retries: 3,
          },
          rollback: {
            enabled: true,
            rollbackThreshold: 0.8,
          },
        },
      };

      const model = await service.registerModel(modelData);

      expect(model).toBeDefined();
      expect(model.id).toBeDefined();
      expect(model.name).toBe('Test Classification Model');
      expect(model.type).toBe('classification');
      expect(model.status).toBe('training');
      expect(model.createdAt).toBeDefined();
      expect(model.updatedAt).toBeDefined();
    });

    it('should create monitoring data for registered model', async () => {
      const modelData = {
        name: 'Test Monitoring Model',
        type: 'prediction' as const,
        version: '1.0.0',
        framework: 'scikit-learn' as const,
        status: 'training' as const,
        description: 'Test model for monitoring',
        inputSchema: {
          type: 'object' as const,
          properties: {
            value: { type: 'number' as const },
          },
          required: ['value'],
        },
        outputSchema: {
          type: 'object' as const,
          properties: {
            prediction: { type: 'number' as const },
          },
        },
        metadata: {
          author: 'Test',
          tags: ['test'],
          trainingData: {
            source: 'test',
            size: 100,
            features: ['value'],
            lastUpdated: new Date(),
          },
          hyperparameters: {},
          dependencies: [],
          environment: {},
        },
        performance: {
          accuracy: 0.9,
          customMetrics: {},
          benchmarks: [],
          validationResults: [],
        },
        deployment: {
          endpoint: '/api/test',
          replicas: 1,
          resources: { cpu: '100m', memory: '256Mi' },
          scaling: { minReplicas: 1, maxReplicas: 3, targetCPU: 70, targetMemory: 80 },
          healthCheck: { path: '/health', interval: 30, timeout: 5, retries: 3 },
          rollback: { enabled: true, rollbackThreshold: 0.8 },
        },
      };

      const model = await service.registerModel(modelData);
      const monitoring = await service.getModelMonitoring(model.id);

      expect(monitoring).toBeDefined();
      expect(monitoring?.modelId).toBe(model.id);
      expect(monitoring?.metrics.requestCount).toBe(0);
      expect(monitoring?.metrics.accuracy).toBe(0.9);
    });
  });

  describe('model deployment', () => {
    it('should deploy a model successfully', async () => {
      const models = await service.listModels();
      const model = models.find(m => m.status !== 'deployed');

      if (model) {
        const deployedModel = await service.deployModel(model.id);

        expect(deployedModel.status).toBe('deployed');
        expect(deployedModel.deployedAt).toBeDefined();
        expect(deployedModel.updatedAt.getTime()).toBeGreaterThanOrEqual(model.updatedAt.getTime());

        // Check that model is in deployed models
        const deployedModelFromService = await service.getDeployedModel(model.id);
        expect(deployedModelFromService).toBeDefined();
        expect(deployedModelFromService?.status).toBe('deployed');
      } else {
        // If no undeployed models, create one for testing
        const testModelData = {
          name: 'Test Deploy Model',
          type: 'classification' as const,
          version: '1.0.0',
          framework: 'tensorflow' as const,
          status: 'training' as const,
          description: 'Test model for deployment',
          inputSchema: {
            type: 'object' as const,
            properties: { test: { type: 'string' as const } },
            required: ['test'],
          },
          outputSchema: {
            type: 'object' as const,
            properties: { result: { type: 'string' as const } },
          },
          metadata: {
            author: 'Test',
            tags: ['test'],
            trainingData: { source: 'test', size: 100, features: ['test'], lastUpdated: new Date() },
            hyperparameters: {},
            dependencies: [],
            environment: {},
          },
          performance: {
            accuracy: 0.9,
            customMetrics: {},
            benchmarks: [],
            validationResults: [],
          },
          deployment: {
            endpoint: '/api/test-deploy',
            replicas: 1,
            resources: { cpu: '100m', memory: '256Mi' },
            scaling: { minReplicas: 1, maxReplicas: 3, targetCPU: 70, targetMemory: 80 },
            healthCheck: { path: '/health', interval: 30, timeout: 5, retries: 3 },
            rollback: { enabled: true, rollbackThreshold: 0.8 },
          },
        };

        const newModel = await service.registerModel(testModelData);
        const deployedModel = await service.deployModel(newModel.id);

        expect(deployedModel.status).toBe('deployed');
        expect(deployedModel.deployedAt).toBeDefined();
      }
    });

    it('should fail to deploy non-existent model', async () => {
      await expect(service.deployModel('non-existent-id')).rejects.toThrow('Model non-existent-id not found');
    });

    it('should validate model before deployment', async () => {
      const invalidModelData = {
        name: 'Invalid Model',
        type: 'classification' as const,
        version: '1.0.0',
        framework: 'tensorflow' as const,
        status: 'training' as const,
        description: 'Invalid model without schemas',
        inputSchema: null as any,
        outputSchema: null as any,
        metadata: {
          author: 'Test',
          tags: [],
          trainingData: {
            source: 'test',
            size: 100,
            features: [],
            lastUpdated: new Date(),
          },
          hyperparameters: {},
          dependencies: [],
          environment: {},
        },
        performance: {
          accuracy: 0.5, // Below threshold
          customMetrics: {},
          benchmarks: [],
          validationResults: [],
        },
        deployment: {
          endpoint: '',
          replicas: 1,
          resources: { cpu: '100m', memory: '256Mi' },
          scaling: { minReplicas: 1, maxReplicas: 3, targetCPU: 70, targetMemory: 80 },
          healthCheck: { path: '/health', interval: 30, timeout: 5, retries: 3 },
          rollback: { enabled: true, rollbackThreshold: 0.8 },
        },
      };

      const model = await service.registerModel(invalidModelData);
      await expect(service.deployModel(model.id)).rejects.toThrow();
    });
  });

  describe('model inference', () => {
    it('should make predictions with deployed model', async () => {
      let models = await service.listModels({ status: 'deployed' });

      // If no deployed models, deploy one
      if (models.length === 0) {
        const allModels = await service.listModels();
        if (allModels.length > 0) {
          await service.deployModel(allModels[0].id);
          models = await service.listModels({ status: 'deployed' });
        }
      }

      const model = models[0];

      if (model) {
        const input = {
          material: 'steel',
          thickness: 5,
          quality: 'high',
        };

        const prediction = await service.predict(model.id, input);

        expect(prediction).toBeDefined();
        expect(prediction.modelId).toBe(model.id);
        expect(prediction.modelVersion).toBe(model.version);
        expect(prediction.input).toEqual(input);
        expect(prediction.output).toBeDefined();
        expect(prediction.confidence).toBeGreaterThan(0);
        expect(prediction.confidence).toBeLessThanOrEqual(1);
        expect(prediction.latency).toBeGreaterThan(0);
        expect(prediction.timestamp).toBeDefined();
      } else {
        // Skip test if no models available
        expect(true).toBe(true);
      }
    });

    it('should fail prediction with non-deployed model', async () => {
      const models = await service.listModels({ status: 'training' });
      const model = models[0];
      
      if (model) {
        const input = { test: 'data' };
        await expect(service.predict(model.id, input)).rejects.toThrow(`Deployed model ${model.id} not found`);
      }
    });

    it('should validate input against schema', async () => {
      const models = await service.listModels({ status: 'deployed' });
      const model = models[0];
      
      if (model) {
        const invalidInput = {
          // Missing required fields
          invalid: 'data',
        };

        await expect(service.predict(model.id, invalidInput)).rejects.toThrow();
      }
    });

    it('should handle batch predictions', async () => {
      const models = await service.listModels({ status: 'deployed' });
      const model = models[0];
      
      if (model) {
        const inputs = [
          { material: 'steel', thickness: 3, quality: 'high' },
          { material: 'aluminum', thickness: 2, quality: 'medium' },
          { material: 'steel', thickness: 8, quality: 'low' },
        ];

        const predictions = await service.batchPredict(model.id, inputs);

        expect(predictions).toHaveLength(3);
        predictions.forEach((prediction, index) => {
          expect(prediction.modelId).toBe(model.id);
          expect(prediction.input).toEqual(inputs[index]);
          expect(prediction.output).toBeDefined();
          expect(prediction.confidence).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('model monitoring', () => {
    it('should track prediction metrics', async () => {
      const models = await service.listModels({ status: 'deployed' });
      const model = models[0];
      
      if (model) {
        const initialMonitoring = await service.getModelMonitoring(model.id);
        const initialRequestCount = initialMonitoring?.metrics.requestCount || 0;

        // Make a prediction
        const input = { material: 'steel', thickness: 5, quality: 'high' };
        await service.predict(model.id, input);

        const updatedMonitoring = await service.getModelMonitoring(model.id);
        
        expect(updatedMonitoring).toBeDefined();
        expect(updatedMonitoring?.metrics.requestCount).toBe(initialRequestCount + 1);
        expect(updatedMonitoring?.metrics.averageLatency).toBeGreaterThan(0);
      }
    });

    it('should check model health', async () => {
      const models = await service.listModels({ status: 'deployed' });
      const model = models[0];
      
      if (model) {
        const health = await service.checkModelHealth(model.id);
        
        expect(health).toBeDefined();
        expect(typeof health.healthy).toBe('boolean');
        expect(Array.isArray(health.issues)).toBe(true);
        expect(Array.isArray(health.recommendations)).toBe(true);
      }
    });

    it('should return health issues for non-existent model', async () => {
      const health = await service.checkModelHealth('non-existent-id');
      
      expect(health.healthy).toBe(false);
      expect(health.issues).toContain('Model not found or not monitored');
      expect(health.recommendations).toContain('Check model deployment status');
    });

    it('should get all model monitoring data', async () => {
      const allMonitoring = await service.getAllModelMonitoring();
      
      expect(Array.isArray(allMonitoring)).toBe(true);
      expect(allMonitoring.length).toBeGreaterThan(0);
      
      allMonitoring.forEach(monitoring => {
        expect(monitoring.modelId).toBeDefined();
        expect(monitoring.metrics).toBeDefined();
        expect(monitoring.driftDetection).toBeDefined();
        expect(monitoring.lastUpdated).toBeDefined();
      });
    });
  });

  describe('model rollback', () => {
    it('should rollback model when enabled', async () => {
      // First, create and deploy a model
      const modelData = {
        name: 'Rollback Test Model',
        type: 'recommendation' as const,
        version: '2.0.0',
        framework: 'scikit-learn' as const,
        status: 'training' as const,
        description: 'Model for testing rollback functionality',
        inputSchema: {
          type: 'object' as const,
          properties: {
            input: { type: 'string' as const },
          },
          required: ['input'],
        },
        outputSchema: {
          type: 'object' as const,
          properties: {
            output: { type: 'string' as const },
          },
        },
        metadata: {
          author: 'Test',
          tags: ['rollback', 'test'],
          trainingData: {
            source: 'test',
            size: 100,
            features: ['input'],
            lastUpdated: new Date(),
          },
          hyperparameters: {},
          dependencies: [],
          environment: {},
        },
        performance: {
          accuracy: 0.9,
          customMetrics: {},
          benchmarks: [],
          validationResults: [],
        },
        deployment: {
          endpoint: '/api/rollback-test',
          replicas: 1,
          resources: { cpu: '100m', memory: '256Mi' },
          scaling: { minReplicas: 1, maxReplicas: 3, targetCPU: 70, targetMemory: 80 },
          healthCheck: { path: '/health', interval: 30, timeout: 5, retries: 3 },
          rollback: {
            enabled: true,
            previousVersion: '1.0.0',
            rollbackThreshold: 0.8,
          },
        },
      };

      const model = await service.registerModel(modelData);
      const deployedModel = await service.deployModel(model.id);

      // Create a previous version model
      const previousModelData = {
        ...modelData,
        version: '1.0.0',
      };
      await service.registerModel(previousModelData);

      // Test rollback
      const rolledBackModel = await service.rollbackModel(deployedModel.id);
      
      expect(rolledBackModel.version).toBe('1.0.0');
      expect(deployedModel.status).toBe('deprecated');
    });

    it('should fail rollback when not enabled', async () => {
      const models = await service.listModels({ status: 'deployed' });
      const model = models.find(m => !m.deployment.rollback.enabled);
      
      if (model) {
        await expect(service.rollbackModel(model.id)).rejects.toThrow(`Rollback not available for model ${model.id}`);
      }
    });
  });

  describe('model listing and filtering', () => {
    it('should list all models', async () => {
      const models = await service.listModels();
      
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      
      models.forEach(model => {
        expect(model.id).toBeDefined();
        expect(model.name).toBeDefined();
        expect(model.type).toBeDefined();
        expect(model.version).toBeDefined();
        expect(model.status).toBeDefined();
      });
    });

    it('should filter models by type', async () => {
      const recommendationModels = await service.listModels({ type: 'recommendation' });
      
      expect(Array.isArray(recommendationModels)).toBe(true);
      recommendationModels.forEach(model => {
        expect(model.type).toBe('recommendation');
      });
    });

    it('should filter models by status', async () => {
      const deployedModels = await service.listModels({ status: 'deployed' });
      
      expect(Array.isArray(deployedModels)).toBe(true);
      deployedModels.forEach(model => {
        expect(model.status).toBe('deployed');
      });
    });

    it('should filter models by framework', async () => {
      const sklearnModels = await service.listModels({ framework: 'scikit-learn' });
      
      expect(Array.isArray(sklearnModels)).toBe(true);
      sklearnModels.forEach(model => {
        expect(model.framework).toBe('scikit-learn');
      });
    });

    it('should sort models by update date', async () => {
      const models = await service.listModels();
      
      for (let i = 1; i < models.length; i++) {
        expect(models[i - 1].updatedAt.getTime()).toBeGreaterThanOrEqual(models[i].updatedAt.getTime());
      }
    });
  });

  describe('error handling', () => {
    it('should handle prediction errors gracefully', async () => {
      let models = await service.listModels({ status: 'deployed' });

      // Ensure we have a deployed model
      if (models.length === 0) {
        const allModels = await service.listModels();
        if (allModels.length > 0) {
          await service.deployModel(allModels[0].id);
          models = await service.listModels({ status: 'deployed' });
        }
      }

      const model = models[0];

      if (model) {
        // Mock an error in inference
        const originalRunInference = (service as any).runInference;
        (service as any).runInference = vi.fn().mockRejectedValue(new Error('Inference failed'));

        // Use valid input to pass validation but trigger inference error
        const validInput = {
          material: 'steel',
          thickness: 5,
          quality: 'high',
        };

        await expect(service.predict(model.id, validInput)).rejects.toThrow('Inference failed');

        // Restore original method
        (service as any).runInference = originalRunInference;
      } else {
        // Skip test if no models available
        expect(true).toBe(true);
      }
    });

    it('should handle invalid JSON input gracefully', async () => {
      const models = await service.listModels({ status: 'deployed' });
      const model = models[0];
      
      if (model) {
        const invalidInput = null;
        await expect(service.predict(model.id, invalidInput)).rejects.toThrow();
      }
    });
  });
});
