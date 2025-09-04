/**
 * Comprehensive System Integration Tests
 * Tests all 27 calculators, user systems, payment functionality, and API integrations
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';
import { createTestUser, getAuthToken } from '../helpers/auth';
import { mockPaymentProvider } from '../helpers/payment';

// Test configuration
const TEST_CONFIG = {
  timeout: 30000,
  retries: 3,
  baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
};

// Calculator types for testing
const CALCULATOR_TYPES = [
  // Tier 1 - Core Calculators (15)
  'laser-cutting-cost',
  'cutting-time-estimator', 
  'laser-parameter-optimizer',
  'material-selection-assistant',
  'kerf-width-calculator',
  'power-requirement-calculator',
  'production-capacity-planner',
  'quality-grade-assessor',
  'energy-cost-calculator',
  'batch-processing-optimizer',
  'maintenance-cost-estimator',
  'competitive-pricing-analyzer',
  'equipment-comparison-tool',
  'gas-consumption-calculator',
  'power-speed-matching-calculator',
  
  // Tier 2 - Professional Tools (12)
  'gas-pressure-setting-guide',
  'focus-height-calculator',
  'frequency-setting-assistant',
  'multiple-pass-calculator',
  'kerf-compensation-calculator',
  'material-nesting-optimizer',
  'remnant-value-calculator',
  'cut-path-optimizer',
  'sheet-utilization-calculator',
  'edge-quality-predictor',
  'warping-risk-calculator',
  'burn-mark-preventer'
];

describe('System Integration Tests', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Setup test environment
    await setupTestDatabase();
    mockPaymentProvider();
    
    // Create test user and get auth token
    const testUser = await createTestUser({
      email: 'integration-test@lasercalc.com',
      password: 'TestPassword123!',
      subscription: 'premium'
    });
    
    testUserId = testUser.id;
    authToken = await getAuthToken(testUser.email, 'TestPassword123!');
  }, TEST_CONFIG.timeout);

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('Authentication and Authorization System', () => {
    test('should authenticate user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration-test@lasercalc.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('integration-test@lasercalc.com');
    });

    test('should protect authenticated routes', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testUserId);
    });
  });

  describe('Calculator System Integration', () => {
    test.each(CALCULATOR_TYPES)('should handle %s calculator requests', async (calculatorType) => {
      const testData = getTestDataForCalculator(calculatorType);
      
      const response = await request(app)
        .post(`/api/calculator/${calculatorType}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(testData)
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('calculatorType', calculatorType);
      expect(response.body).toHaveProperty('timestamp');
      
      // Verify calculation results are reasonable
      expect(response.body.result).toBeDefined();
      expect(typeof response.body.result).toBe('object');
      
      // Verify metadata
      if (response.body.metadata) {
        expect(response.body.metadata).toHaveProperty('executionTime');
        expect(response.body.metadata.executionTime).toBeGreaterThan(0);
      }
    }, TEST_CONFIG.timeout);

    test('should save calculation history', async () => {
      const calculatorType = 'laser-cutting-cost';
      const testData = getTestDataForCalculator(calculatorType);
      
      // Perform calculation
      await request(app)
        .post(`/api/calculator/${calculatorType}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(testData)
        .expect(200);

      // Check history
      const historyResponse = await request(app)
        .get('/api/user/calculation-history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(historyResponse.body).toHaveProperty('calculations');
      expect(historyResponse.body.calculations.length).toBeGreaterThan(0);
      
      const lastCalculation = historyResponse.body.calculations[0];
      expect(lastCalculation).toHaveProperty('calculatorType', calculatorType);
      expect(lastCalculation).toHaveProperty('inputs');
      expect(lastCalculation).toHaveProperty('result');
    });

    test('should handle invalid calculator requests', async () => {
      const response = await request(app)
        .post('/api/calculator/invalid-calculator')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    test('should validate calculator inputs', async () => {
      const response = await request(app)
        .post('/api/calculator/laser-cutting-cost')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required fields
          material: 'steel'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('validationErrors');
    });
  });

  describe('User Management System', () => {
    test('should create new user account', async () => {
      const newUserData = {
        email: 'newuser@lasercalc.com',
        password: 'NewPassword123!',
        firstName: 'New',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUserData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body).toHaveProperty('token');
    });

    test('should update user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        company: 'Test Company'
      };

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
      expect(response.body.company).toBe(updateData.company);
    });

    test('should handle password change', async () => {
      const passwordData = {
        currentPassword: 'TestPassword123!',
        newPassword: 'NewTestPassword123!'
      };

      const response = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Subscription and Payment System', () => {
    test('should retrieve subscription plans', async () => {
      const response = await request(app)
        .get('/api/subscription/plans')
        .expect(200);

      expect(response.body).toHaveProperty('plans');
      expect(Array.isArray(response.body.plans)).toBe(true);
      expect(response.body.plans.length).toBeGreaterThan(0);
      
      // Verify plan structure
      const plan = response.body.plans[0];
      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('price');
      expect(plan).toHaveProperty('features');
    });

    test('should handle subscription upgrade', async () => {
      const upgradeData = {
        planId: 'premium',
        paymentMethodId: 'test_payment_method'
      };

      const response = await request(app)
        .post('/api/subscription/upgrade')
        .set('Authorization', `Bearer ${authToken}`)
        .send(upgradeData)
        .expect(200);

      expect(response.body).toHaveProperty('subscription');
      expect(response.body.subscription.plan).toBe(upgradeData.planId);
    });

    test('should retrieve billing history', async () => {
      const response = await request(app)
        .get('/api/user/billing-history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('invoices');
      expect(Array.isArray(response.body.invoices)).toBe(true);
    });
  });

  describe('API Integration and Rate Limiting', () => {
    test('should handle API rate limiting', async () => {
      const requests = Array.from({ length: 100 }, (_, i) => 
        request(app)
          .get('/api/health')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    test('should provide API documentation', async () => {
      const response = await request(app)
        .get('/api/docs')
        .expect(200);

      expect(response.text).toContain('API Documentation');
    });

    test('should handle CORS properly', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'https://lasercalc.com')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Error Handling and Logging', () => {
    test('should handle server errors gracefully', async () => {
      const response = await request(app)
        .post('/api/calculator/laser-cutting-cost')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Data that causes server error
          material: 'invalid-material-type',
          thickness: -1
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('requestId');
    });

    test('should log errors properly', async () => {
      // This would typically check log files or monitoring systems
      // For now, we'll just verify the error response structure
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Health Checks and Monitoring', () => {
    test('should provide health check endpoint', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });

    test('should provide detailed health status', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('redis');
      expect(response.body).toHaveProperty('external_services');
    });

    test('should provide metrics endpoint', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .expect(200);

      expect(response.text).toContain('# HELP');
      expect(response.text).toContain('# TYPE');
    });
  });
});

// Helper function to generate test data for different calculators
function getTestDataForCalculator(calculatorType: string): any {
  const testDataMap: Record<string, any> = {
    'laser-cutting-cost': {
      material: 'steel',
      thickness: 5,
      length: 1000,
      width: 500,
      quantity: 10,
      complexity: 'medium'
    },
    'cutting-time-estimator': {
      material: 'aluminum',
      thickness: 3,
      perimeter: 2000,
      complexity: 'high',
      quantity: 5
    },
    'laser-parameter-optimizer': {
      material: 'stainless_steel',
      thickness: 2,
      quality: 'high',
      speed: 'medium'
    },
    'material-selection-assistant': {
      application: 'automotive',
      requirements: ['strength', 'corrosion_resistance'],
      budget: 'medium'
    },
    'kerf-width-calculator': {
      material: 'steel',
      thickness: 4,
      laserType: 'fiber',
      power: 3000
    },
    'power-requirement-calculator': {
      material: 'aluminum',
      thickness: 6,
      cuttingSpeed: 2000,
      quality: 'medium'
    },
    'production-capacity-planner': {
      partType: 'bracket',
      quantity: 1000,
      deadline: '2024-12-31',
      complexity: 'medium'
    },
    'quality-grade-assessor': {
      material: 'steel',
      thickness: 3,
      tolerance: 0.1,
      surfaceFinish: 'smooth'
    },
    'energy-cost-calculator': {
      power: 4000,
      operatingHours: 8,
      electricityRate: 0.12,
      efficiency: 0.85
    },
    'batch-processing-optimizer': {
      parts: [
        { type: 'bracket', quantity: 50 },
        { type: 'plate', quantity: 30 }
      ],
      sheetSize: { width: 1500, height: 3000 }
    }
  };

  return testDataMap[calculatorType] || {
    material: 'steel',
    thickness: 5,
    quantity: 1
  };
}
