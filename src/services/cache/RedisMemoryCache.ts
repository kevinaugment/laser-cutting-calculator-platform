/**
 * Redis Memory Cache Service
 * High-performance caching layer for the memory system
 */

import Redis from 'ioredis';
import { 
  UserProfile, 
  CalculationRecord, 
  ParameterPreset, 
  Recommendation,
  AnalyticsData,
  SearchCriteria 
} from '../../types/memory';

// ============================================================================
// Cache Configuration
// ============================================================================

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  defaultTTL: number; // seconds
  maxRetries: number;
  retryDelayOnFailover: number;
  enableReadyCheck: boolean;
  lazyConnect: boolean;
}

export interface CacheKeyConfig {
  userProfile: string;
  calculationHistory: string;
  parameterPresets: string;
  recommendations: string;
  analytics: string;
  searchResults: string;
  sessionData: string;
  performanceMetrics: string;
}

// ============================================================================
// Cache Key Patterns
// ============================================================================

const CACHE_KEYS: CacheKeyConfig = {
  userProfile: 'memory:user:{userId}:profile',
  calculationHistory: 'memory:user:{userId}:history:{calculatorType}',
  parameterPresets: 'memory:presets:{calculatorType}:{category}',
  recommendations: 'memory:user:{userId}:recommendations',
  analytics: 'memory:analytics:{userId}:{timeframe}',
  searchResults: 'memory:search:{hash}',
  sessionData: 'memory:session:{sessionId}',
  performanceMetrics: 'memory:metrics:{metricType}:{timeframe}'
};

// ============================================================================
// Cache TTL Configuration (in seconds)
// ============================================================================

const CACHE_TTL = {
  userProfile: 3600, // 1 hour
  calculationHistory: 1800, // 30 minutes
  parameterPresets: 7200, // 2 hours
  recommendations: 900, // 15 minutes
  analytics: 3600, // 1 hour
  searchResults: 600, // 10 minutes
  sessionData: 1800, // 30 minutes
  performanceMetrics: 300, // 5 minutes
  shortTerm: 300, // 5 minutes
  mediumTerm: 1800, // 30 minutes
  longTerm: 7200 // 2 hours
};

// ============================================================================
// Redis Memory Cache Class
// ============================================================================

export class RedisMemoryCache {
  private redis: Redis;
  private config: CacheConfig;
  private isConnected: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(config: CacheConfig) {
    this.config = config;
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      keyPrefix: config.keyPrefix,
      maxRetriesPerRequest: config.maxRetries,
      retryDelayOnFailover: config.retryDelayOnFailover,
      enableReadyCheck: config.enableReadyCheck,
      lazyConnect: config.lazyConnect,
      // Connection pool settings
      maxLoadingTimeout: 5000,
      // Serialization settings
      stringNumbers: true,
      // Error handling
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100
    });

    this.setupEventHandlers();
  }

  // ============================================================================
  // Connection Management
  // ============================================================================

  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      console.log('✅ Redis Memory Cache connected');
      this.isConnected = true;
    });

    this.redis.on('ready', () => {
      console.log('🚀 Redis Memory Cache ready');
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis Memory Cache error:', error);
      this.isConnected = false;
    });

    this.redis.on('close', () => {
      console.log('🔌 Redis Memory Cache connection closed');
      this.isConnected = false;
    });

    this.redis.on('reconnecting', () => {
      console.log('🔄 Redis Memory Cache reconnecting...');
    });
  }

  public async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.redis.connect();
    return this.connectionPromise;
  }

  public async disconnect(): Promise<void> {
    await this.redis.quit();
    this.isConnected = false;
    this.connectionPromise = null;
  }

  public isHealthy(): boolean {
    return this.isConnected && this.redis.status === 'ready';
  }

  // ============================================================================
  // User Profile Caching
  // ============================================================================

  public async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const key = this.buildKey(CACHE_KEYS.userProfile, { userId });
      const cached = await this.redis.get(key);
      
      if (cached) {
        return JSON.parse(cached) as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile from cache:', error);
      return null;
    }
  }

  public async setUserProfile(userId: string, profile: UserProfile, ttl?: number): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.userProfile, { userId });
      const serialized = JSON.stringify(profile);
      const cacheTTL = ttl || CACHE_TTL.userProfile;
      
      await this.redis.setex(key, cacheTTL, serialized);
      return true;
    } catch (error) {
      console.error('Error setting user profile in cache:', error);
      return false;
    }
  }

  public async invalidateUserProfile(userId: string): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.userProfile, { userId });
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Error invalidating user profile cache:', error);
      return false;
    }
  }

  // ============================================================================
  // Calculation History Caching
  // ============================================================================

  public async getCalculationHistory(
    userId: string, 
    calculatorType: string, 
    limit: number = 50
  ): Promise<CalculationRecord[]> {
    try {
      const key = this.buildKey(CACHE_KEYS.calculationHistory, { userId, calculatorType });
      const cached = await this.redis.lrange(key, 0, limit - 1);
      
      return cached.map(item => JSON.parse(item) as CalculationRecord);
    } catch (error) {
      console.error('Error getting calculation history from cache:', error);
      return [];
    }
  }

  public async addCalculationToHistory(
    userId: string, 
    calculatorType: string, 
    record: CalculationRecord
  ): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.calculationHistory, { userId, calculatorType });
      const serialized = JSON.stringify(record);
      
      // Add to the beginning of the list (most recent first)
      await this.redis.lpush(key, serialized);
      
      // Trim to keep only the most recent 100 records
      await this.redis.ltrim(key, 0, 99);
      
      // Set expiration
      await this.redis.expire(key, CACHE_TTL.calculationHistory);
      
      return true;
    } catch (error) {
      console.error('Error adding calculation to history cache:', error);
      return false;
    }
  }

  public async clearCalculationHistory(userId: string, calculatorType?: string): Promise<boolean> {
    try {
      if (calculatorType) {
        const key = this.buildKey(CACHE_KEYS.calculationHistory, { userId, calculatorType });
        await this.redis.del(key);
      } else {
        // Clear all calculation history for user
        const pattern = this.buildKey(CACHE_KEYS.calculationHistory, { userId, calculatorType: '*' });
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }
      return true;
    } catch (error) {
      console.error('Error clearing calculation history cache:', error);
      return false;
    }
  }

  // ============================================================================
  // Parameter Presets Caching
  // ============================================================================

  public async getParameterPresets(
    calculatorType: string, 
    category?: string
  ): Promise<ParameterPreset[]> {
    try {
      const key = this.buildKey(CACHE_KEYS.parameterPresets, { 
        calculatorType, 
        category: category || 'all' 
      });
      const cached = await this.redis.get(key);
      
      if (cached) {
        return JSON.parse(cached) as ParameterPreset[];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting parameter presets from cache:', error);
      return [];
    }
  }

  public async setParameterPresets(
    calculatorType: string, 
    category: string, 
    presets: ParameterPreset[],
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.parameterPresets, { calculatorType, category });
      const serialized = JSON.stringify(presets);
      const cacheTTL = ttl || CACHE_TTL.parameterPresets;
      
      await this.redis.setex(key, cacheTTL, serialized);
      return true;
    } catch (error) {
      console.error('Error setting parameter presets in cache:', error);
      return false;
    }
  }

  public async invalidateParameterPresets(calculatorType?: string): Promise<boolean> {
    try {
      const pattern = calculatorType 
        ? this.buildKey(CACHE_KEYS.parameterPresets, { calculatorType, category: '*' })
        : this.buildKey(CACHE_KEYS.parameterPresets, { calculatorType: '*', category: '*' });
      
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Error invalidating parameter presets cache:', error);
      return false;
    }
  }

  // ============================================================================
  // Recommendations Caching
  // ============================================================================

  public async getUserRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      const key = this.buildKey(CACHE_KEYS.recommendations, { userId });
      const cached = await this.redis.get(key);
      
      if (cached) {
        return JSON.parse(cached) as Recommendation[];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting recommendations from cache:', error);
      return [];
    }
  }

  public async setUserRecommendations(
    userId: string, 
    recommendations: Recommendation[],
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.recommendations, { userId });
      const serialized = JSON.stringify(recommendations);
      const cacheTTL = ttl || CACHE_TTL.recommendations;
      
      await this.redis.setex(key, cacheTTL, serialized);
      return true;
    } catch (error) {
      console.error('Error setting recommendations in cache:', error);
      return false;
    }
  }

  public async invalidateUserRecommendations(userId: string): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.recommendations, { userId });
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Error invalidating recommendations cache:', error);
      return false;
    }
  }

  // ============================================================================
  // Search Results Caching
  // ============================================================================

  public async getSearchResults(criteria: SearchCriteria): Promise<any[] | null> {
    try {
      const hash = this.hashSearchCriteria(criteria);
      const key = this.buildKey(CACHE_KEYS.searchResults, { hash });
      const cached = await this.redis.get(key);
      
      if (cached) {
        return JSON.parse(cached);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting search results from cache:', error);
      return null;
    }
  }

  public async setSearchResults(
    criteria: SearchCriteria, 
    results: any[],
    ttl?: number
  ): Promise<boolean> {
    try {
      const hash = this.hashSearchCriteria(criteria);
      const key = this.buildKey(CACHE_KEYS.searchResults, { hash });
      const serialized = JSON.stringify(results);
      const cacheTTL = ttl || CACHE_TTL.searchResults;
      
      await this.redis.setex(key, cacheTTL, serialized);
      return true;
    } catch (error) {
      console.error('Error setting search results in cache:', error);
      return false;
    }
  }

  // ============================================================================
  // Session Data Caching
  // ============================================================================

  public async getSessionData(sessionId: string): Promise<any | null> {
    try {
      const key = this.buildKey(CACHE_KEYS.sessionData, { sessionId });
      const cached = await this.redis.get(key);
      
      if (cached) {
        return JSON.parse(cached);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting session data from cache:', error);
      return null;
    }
  }

  public async setSessionData(
    sessionId: string, 
    data: any,
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.sessionData, { sessionId });
      const serialized = JSON.stringify(data);
      const cacheTTL = ttl || CACHE_TTL.sessionData;
      
      await this.redis.setex(key, cacheTTL, serialized);
      return true;
    } catch (error) {
      console.error('Error setting session data in cache:', error);
      return false;
    }
  }

  public async extendSessionTTL(sessionId: string, ttl?: number): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.sessionData, { sessionId });
      const cacheTTL = ttl || CACHE_TTL.sessionData;
      
      await this.redis.expire(key, cacheTTL);
      return true;
    } catch (error) {
      console.error('Error extending session TTL:', error);
      return false;
    }
  }

  // ============================================================================
  // Analytics Caching
  // ============================================================================

  public async getAnalyticsData(userId: string, timeframe: string): Promise<AnalyticsData | null> {
    try {
      const key = this.buildKey(CACHE_KEYS.analytics, { userId, timeframe });
      const cached = await this.redis.get(key);
      
      if (cached) {
        return JSON.parse(cached) as AnalyticsData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting analytics data from cache:', error);
      return null;
    }
  }

  public async setAnalyticsData(
    userId: string, 
    timeframe: string, 
    data: AnalyticsData,
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.buildKey(CACHE_KEYS.analytics, { userId, timeframe });
      const serialized = JSON.stringify(data);
      const cacheTTL = ttl || CACHE_TTL.analytics;
      
      await this.redis.setex(key, cacheTTL, serialized);
      return true;
    } catch (error) {
      console.error('Error setting analytics data in cache:', error);
      return false;
    }
  }

  // ============================================================================
  // Cache Management and Utilities
  // ============================================================================

  public async flushUserCache(userId: string): Promise<boolean> {
    try {
      const patterns = [
        this.buildKey(CACHE_KEYS.userProfile, { userId }),
        this.buildKey(CACHE_KEYS.calculationHistory, { userId, calculatorType: '*' }),
        this.buildKey(CACHE_KEYS.recommendations, { userId }),
        this.buildKey(CACHE_KEYS.analytics, { userId, timeframe: '*' })
      ];

      for (const pattern of patterns) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }

      return true;
    } catch (error) {
      console.error('Error flushing user cache:', error);
      return false;
    }
  }

  public async getCacheStats(): Promise<any> {
    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        memory: this.parseRedisInfo(info),
        keyspace: this.parseRedisInfo(keyspace),
        connected: this.isConnected,
        status: this.redis.status
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private buildKey(template: string, params: Record<string, string>): string {
    let key = template;
    for (const [param, value] of Object.entries(params)) {
      key = key.replace(`{${param}}`, value);
    }
    return key;
  }

  private hashSearchCriteria(criteria: SearchCriteria): string {
    const normalized = JSON.stringify(criteria, Object.keys(criteria).sort());
    return Buffer.from(normalized).toString('base64').substring(0, 32);
  }

  private parseRedisInfo(info: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = info.split('\r\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = isNaN(Number(value)) ? value : Number(value);
      }
    }
    
    return result;
  }
}

// ============================================================================
// Cache Factory and Configuration
// ============================================================================

export function createMemoryCache(config?: Partial<CacheConfig>): RedisMemoryCache {
  const defaultConfig: CacheConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'laser-calc:memory:',
    defaultTTL: parseInt(process.env.REDIS_DEFAULT_TTL || '3600'),
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
    retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY || '100'),
    enableReadyCheck: true,
    lazyConnect: true
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new RedisMemoryCache(finalConfig);
}

// Export cache instance
export const memoryCache = createMemoryCache();
