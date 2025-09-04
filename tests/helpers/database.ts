/**
 * Database Test Helpers
 * Utilities for setting up and cleaning up test database
 */

import { Pool } from 'pg';
import Redis from 'ioredis';

// Test database configuration
const TEST_DB_CONFIG = {
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  database: process.env.TEST_DB_NAME || 'laser_calc_test',
  username: process.env.TEST_DB_USER || 'test_user',
  password: process.env.TEST_DB_PASSWORD || 'test_password',
};

// Test Redis configuration
const TEST_REDIS_CONFIG = {
  host: process.env.TEST_REDIS_HOST || 'localhost',
  port: parseInt(process.env.TEST_REDIS_PORT || '6379'),
  db: parseInt(process.env.TEST_REDIS_DB || '1'), // Use different DB for tests
};

let dbPool: Pool;
let redisClient: Redis;

/**
 * Setup test database with clean state
 */
export async function setupTestDatabase(): Promise<void> {
  try {
    // Initialize database connection
    dbPool = new Pool({
      host: TEST_DB_CONFIG.host,
      port: TEST_DB_CONFIG.port,
      database: TEST_DB_CONFIG.database,
      user: TEST_DB_CONFIG.username,
      password: TEST_DB_CONFIG.password,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Initialize Redis connection
    redisClient = new Redis({
      host: TEST_REDIS_CONFIG.host,
      port: TEST_REDIS_CONFIG.port,
      db: TEST_REDIS_CONFIG.db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    // Wait for connections
    await dbPool.connect();
    await redisClient.ping();

    // Clean existing data
    await cleanDatabase();
    await cleanRedis();

    // Run migrations
    await runMigrations();

    // Seed test data
    await seedTestData();

    console.log('✅ Test database setup completed');
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  }
}

/**
 * Cleanup test database
 */
export async function cleanupTestDatabase(): Promise<void> {
  try {
    if (dbPool) {
      await cleanDatabase();
      await dbPool.end();
    }

    if (redisClient) {
      await cleanRedis();
      await redisClient.quit();
    }

    console.log('✅ Test database cleanup completed');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error);
    throw error;
  }
}

/**
 * Clean all data from database tables
 */
async function cleanDatabase(): Promise<void> {
  const client = await dbPool.connect();
  
  try {
    await client.query('BEGIN');

    // Disable foreign key checks temporarily
    await client.query('SET session_replication_role = replica');

    // Get all table names
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename NOT LIKE 'pg_%'
      AND tablename != 'schema_migrations'
    `);

    // Truncate all tables
    for (const row of tablesResult.rows) {
      await client.query(`TRUNCATE TABLE "${row.tablename}" CASCADE`);
    }

    // Re-enable foreign key checks
    await client.query('SET session_replication_role = DEFAULT');

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Clean Redis test database
 */
async function cleanRedis(): Promise<void> {
  await redisClient.flushdb();
}

/**
 * Run database migrations
 */
async function runMigrations(): Promise<void> {
  const client = await dbPool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        company VARCHAR(255),
        subscription_plan VARCHAR(50) DEFAULT 'free',
        subscription_status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create calculation_history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS calculation_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        calculator_type VARCHAR(100) NOT NULL,
        inputs JSONB NOT NULL,
        result JSONB NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plan_id VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create invoices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(50) NOT NULL,
        invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP,
        paid_at TIMESTAMP
      )
    `);

    // Create API keys table
    await client.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        key_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        permissions JSONB DEFAULT '[]',
        last_used_at TIMESTAMP,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_calculation_history_user_id ON calculation_history(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_calculation_history_calculator_type ON calculation_history(calculator_type)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)');

    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Database migrations failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed test data
 */
async function seedTestData(): Promise<void> {
  const client = await dbPool.connect();
  
  try {
    // Seed subscription plans in Redis
    const plans = [
      {
        id: 'free',
        name: 'Free Plan',
        price: 0,
        features: ['5 calculations per day', 'Basic calculators'],
        limits: { calculationsPerDay: 5 }
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 29.99,
        features: ['Unlimited calculations', 'All calculators', 'Priority support'],
        limits: { calculationsPerDay: -1 }
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 99.99,
        features: ['Unlimited calculations', 'All calculators', 'API access', 'Custom integrations'],
        limits: { calculationsPerDay: -1, apiAccess: true }
      }
    ];

    for (const plan of plans) {
      await redisClient.hset('subscription_plans', plan.id, JSON.stringify(plan));
    }

    // Seed calculator configurations
    const calculatorConfigs = {
      'laser-cutting-cost': {
        name: 'Laser Cutting Cost Calculator',
        description: 'Calculate the cost of laser cutting operations',
        category: 'cost',
        tier: 1,
        requiredFields: ['material', 'thickness', 'length', 'width', 'quantity'],
        optionalFields: ['complexity', 'urgency']
      },
      'cutting-time-estimator': {
        name: 'Cutting Time Estimator',
        description: 'Estimate cutting time for laser operations',
        category: 'time',
        tier: 1,
        requiredFields: ['material', 'thickness', 'perimeter', 'quantity'],
        optionalFields: ['complexity', 'quality']
      }
    };

    for (const [type, config] of Object.entries(calculatorConfigs)) {
      await redisClient.hset('calculator_configs', type, JSON.stringify(config));
    }

    console.log('✅ Test data seeding completed');
  } catch (error) {
    console.error('❌ Test data seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get database pool for direct queries in tests
 */
export function getDbPool(): Pool {
  return dbPool;
}

/**
 * Get Redis client for direct operations in tests
 */
export function getRedisClient(): Redis {
  return redisClient;
}

/**
 * Execute raw SQL query
 */
export async function executeQuery(query: string, params?: any[]): Promise<any> {
  const client = await dbPool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}

/**
 * Create test transaction
 */
export async function withTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Wait for database to be ready
 */
export async function waitForDatabase(maxAttempts: number = 30): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await dbPool.query('SELECT 1');
      console.log('✅ Database is ready');
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Database not ready after ${maxAttempts} attempts`);
      }
      console.log(`⏳ Waiting for database... (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Wait for Redis to be ready
 */
export async function waitForRedis(maxAttempts: number = 30): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await redisClient.ping();
      console.log('✅ Redis is ready');
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw new Error(`Redis not ready after ${maxAttempts} attempts`);
      }
      console.log(`⏳ Waiting for Redis... (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
