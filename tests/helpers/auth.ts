/**
 * Authentication Test Helpers
 * Utilities for creating test users and handling authentication in tests
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDbPool } from './database';

export interface TestUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  subscription?: string;
  subscriptionStatus?: string;
}

export interface CreateTestUserOptions {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  subscription?: string;
  subscriptionStatus?: string;
}

/**
 * Create a test user in the database
 */
export async function createTestUser(options: CreateTestUserOptions): Promise<TestUser> {
  const {
    email,
    password,
    firstName = 'Test',
    lastName = 'User',
    company = 'Test Company',
    subscription = 'free',
    subscriptionStatus = 'active'
  } = options;

  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insert user
    await client.query(`
      INSERT INTO users (
        id, email, password_hash, first_name, last_name, 
        company, subscription_plan, subscription_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      userId, email, passwordHash, firstName, lastName,
      company, subscription, subscriptionStatus
    ]);

    // Create subscription record if not free
    if (subscription !== 'free') {
      await client.query(`
        INSERT INTO subscriptions (
          user_id, plan_id, status, current_period_start, current_period_end
        ) VALUES ($1, $2, $3, $4, $5)
      `, [
        userId,
        subscription,
        subscriptionStatus,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      ]);
    }

    return {
      id: userId,
      email,
      firstName,
      lastName,
      company,
      subscription,
      subscriptionStatus
    };
  } finally {
    client.release();
  }
}

/**
 * Get authentication token for a user
 */
export async function getAuthToken(email: string, password: string): Promise<string> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    // Get user from database
    const result = await client.query(
      'SELECT id, email, password_hash, subscription_plan FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        subscription: user.subscription_plan
      },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );

    return token;
  } finally {
    client.release();
  }
}

/**
 * Create multiple test users with different subscription levels
 */
export async function createTestUsers(): Promise<{
  freeUser: TestUser;
  premiumUser: TestUser;
  enterpriseUser: TestUser;
}> {
  const freeUser = await createTestUser({
    email: 'free@test.com',
    password: 'TestPassword123!',
    subscription: 'free'
  });

  const premiumUser = await createTestUser({
    email: 'premium@test.com',
    password: 'TestPassword123!',
    subscription: 'premium'
  });

  const enterpriseUser = await createTestUser({
    email: 'enterprise@test.com',
    password: 'TestPassword123!',
    subscription: 'enterprise'
  });

  return { freeUser, premiumUser, enterpriseUser };
}

/**
 * Create API key for a user
 */
export async function createApiKey(
  userId: string,
  name: string = 'Test API Key',
  permissions: string[] = []
): Promise<string> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    const apiKey = `lc_${uuidv4().replace(/-/g, '')}`;
    const keyHash = await bcrypt.hash(apiKey, 10);

    await client.query(`
      INSERT INTO api_keys (user_id, key_hash, name, permissions)
      VALUES ($1, $2, $3, $4)
    `, [userId, keyHash, name, JSON.stringify(permissions)]);

    return apiKey;
  } finally {
    client.release();
  }
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Create expired token for testing
 */
export function createExpiredToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '-1h' } // Expired 1 hour ago
  );
}

/**
 * Create invalid token for testing
 */
export function createInvalidToken(): string {
  return jwt.sign(
    { userId: 'invalid', email: 'invalid@test.com' },
    'wrong-secret',
    { expiresIn: '1h' }
  );
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<TestUser | null> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    const result = await client.query(`
      SELECT id, email, first_name, last_name, company, 
             subscription_plan, subscription_status
      FROM users 
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      company: user.company,
      subscription: user.subscription_plan,
      subscriptionStatus: user.subscription_status
    };
  } finally {
    client.release();
  }
}

/**
 * Update user subscription
 */
export async function updateUserSubscription(
  userId: string,
  subscription: string,
  status: string = 'active'
): Promise<void> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    await client.query('BEGIN');

    // Update user subscription
    await client.query(`
      UPDATE users 
      SET subscription_plan = $1, subscription_status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [subscription, status, userId]);

    // Update or create subscription record
    const existingSubscription = await client.query(
      'SELECT id FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    if (existingSubscription.rows.length > 0) {
      await client.query(`
        UPDATE subscriptions 
        SET plan_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3
      `, [subscription, status, userId]);
    } else {
      await client.query(`
        INSERT INTO subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        userId,
        subscription,
        status,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Delete test user
 */
export async function deleteTestUser(userId: string): Promise<void> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
  } finally {
    client.release();
  }
}

/**
 * Create calculation history for user
 */
export async function createCalculationHistory(
  userId: string,
  calculatorType: string,
  inputs: any,
  result: any,
  metadata?: any
): Promise<string> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    const historyId = uuidv4();
    
    await client.query(`
      INSERT INTO calculation_history (id, user_id, calculator_type, inputs, result, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      historyId,
      userId,
      calculatorType,
      JSON.stringify(inputs),
      JSON.stringify(result),
      metadata ? JSON.stringify(metadata) : null
    ]);

    return historyId;
  } finally {
    client.release();
  }
}

/**
 * Get calculation history for user
 */
export async function getCalculationHistory(userId: string, limit: number = 10): Promise<any[]> {
  const dbPool = getDbPool();
  const client = await dbPool.connect();

  try {
    const result = await client.query(`
      SELECT id, calculator_type, inputs, result, metadata, created_at
      FROM calculation_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [userId, limit]);

    return result.rows.map(row => ({
      id: row.id,
      calculatorType: row.calculator_type,
      inputs: row.inputs,
      result: row.result,
      metadata: row.metadata,
      createdAt: row.created_at
    }));
  } finally {
    client.release();
  }
}

/**
 * Mock authentication middleware for tests
 */
export function mockAuthMiddleware(user: TestUser) {
  return (req: any, res: any, next: any) => {
    req.user = user;
    next();
  };
}

/**
 * Create test session data
 */
export function createTestSession(user: TestUser): any {
  return {
    userId: user.id,
    email: user.email,
    subscription: user.subscription,
    isAuthenticated: true,
    loginTime: new Date(),
    lastActivity: new Date()
  };
}
