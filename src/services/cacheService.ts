/**
 * Cache Service
 * Unified caching management service for performance optimization
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export type CacheStrategy = 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
export type CacheEvictionPolicy = 'lru' | 'lfu' | 'ttl' | 'fifo';

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
  size: number; // Estimated size in bytes
}

export interface CacheOptions {
  strategy: CacheStrategy;
  maxSize: number; // Maximum cache size in bytes
  maxEntries: number; // Maximum number of entries
  defaultTTL: number; // Default TTL in milliseconds
  evictionPolicy: CacheEvictionPolicy;
  enableCompression: boolean;
  enableMetrics: boolean;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  totalSize: number;
  entryCount: number;
  evictions: number;
  compressionRatio: number;
  averageAccessTime: number;
  lastCleanup: number;
}

export interface CacheStats {
  strategy: CacheStrategy;
  metrics: CacheMetrics;
  topKeys: Array<{ key: string; accessCount: number; size: number }>;
  recentEvictions: Array<{ key: string; reason: string; timestamp: number }>;
}

// ============================================================================
// Cache Service Configuration
// ============================================================================

const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  strategy: 'memory',
  maxSize: 50 * 1024 * 1024, // 50MB
  maxEntries: 10000,
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  evictionPolicy: 'lru',
  enableCompression: true,
  enableMetrics: true,
};

// ============================================================================
// Cache Service Class
// ============================================================================

export class CacheService {
  private cache: Map<string, CacheEntry>;
  private options: CacheOptions;
  private metrics: CacheMetrics;
  private evictionHistory: Array<{ key: string; reason: string; timestamp: number }>;
  private accessTimes: number[];

  constructor(options: Partial<CacheOptions> = {}) {
    this.options = { ...DEFAULT_CACHE_OPTIONS, ...options };
    this.cache = new Map();
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      totalSize: 0,
      entryCount: 0,
      evictions: 0,
      compressionRatio: 1,
      averageAccessTime: 0,
      lastCleanup: Date.now(),
    };
    this.evictionHistory = [];
    this.accessTimes = [];

    // Start periodic cleanup
    this.startPeriodicCleanup();
  }

  // ============================================================================
  // Core Cache Operations
  // ============================================================================

  /**
   * Get value from cache
   */
  public async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.recordMiss();
        return null;
      }

      // Check TTL
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.recordEviction(key, 'expired');
        this.recordMiss();
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      
      this.recordHit();
      
      // Decompress if needed
      const value = this.options.enableCompression ? 
        this.decompress(entry.value) : entry.value;
      
      return value as T;
    } finally {
      this.recordAccessTime(performance.now() - startTime);
    }
  }

  /**
   * Set value in cache
   */
  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Compress if enabled
      const compressedValue = this.options.enableCompression ? 
        this.compress(value) : value;
      
      const size = this.estimateSize(compressedValue);
      const entry: CacheEntry<T> = {
        key,
        value: compressedValue,
        timestamp: Date.now(),
        ttl: ttl || this.options.defaultTTL,
        accessCount: 0,
        lastAccessed: Date.now(),
        size,
      };

      // Check if we need to evict entries
      await this.ensureCapacity(size);
      
      // Remove existing entry if present
      if (this.cache.has(key)) {
        const oldEntry = this.cache.get(key)!;
        this.metrics.totalSize -= oldEntry.size;
      }

      // Add new entry
      this.cache.set(key, entry);
      this.metrics.totalSize += size;
      this.metrics.entryCount = this.cache.size;
      
    } finally {
      this.recordAccessTime(performance.now() - startTime);
    }
  }

  /**
   * Delete value from cache
   */
  public async delete(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.metrics.totalSize -= entry.size;
      this.metrics.entryCount = this.cache.size;
      this.recordEviction(key, 'manual');
      return true;
    }
    return false;
  }

  /**
   * Check if key exists in cache
   */
  public async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.recordEviction(key, 'expired');
      return false;
    }
    
    return true;
  }

  /**
   * Clear all cache entries
   */
  public async clear(): Promise<void> {
    const count = this.cache.size;
    this.cache.clear();
    this.metrics.totalSize = 0;
    this.metrics.entryCount = 0;
    this.metrics.evictions += count;
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    this.updateMetrics();
    
    const topKeys = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        size: entry.size,
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10);

    return {
      strategy: this.options.strategy,
      metrics: { ...this.metrics },
      topKeys,
      recentEvictions: this.evictionHistory.slice(-10),
    };
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  /**
   * Ensure cache has capacity for new entry
   */
  private async ensureCapacity(newEntrySize: number): Promise<void> {
    // Check entry count limit first
    while (this.cache.size >= this.options.maxEntries) {
      await this.evictEntry('count-limit');
    }

    // Check size limit
    while (this.metrics.totalSize + newEntrySize > this.options.maxSize) {
      await this.evictEntry('size-limit');
    }
  }

  /**
   * Evict entry based on eviction policy
   */
  private async evictEntry(reason: string): Promise<void> {
    if (this.cache.size === 0) return;

    let keyToEvict: string;
    
    switch (this.options.evictionPolicy) {
      case 'lru':
        keyToEvict = this.findLRUKey();
        break;
      case 'lfu':
        keyToEvict = this.findLFUKey();
        break;
      case 'ttl':
        keyToEvict = this.findExpiredKey() || this.findLRUKey();
        break;
      case 'fifo':
        keyToEvict = this.findFIFOKey();
        break;
      default:
        keyToEvict = this.findLRUKey();
    }

    const entry = this.cache.get(keyToEvict);
    if (entry) {
      this.cache.delete(keyToEvict);
      this.metrics.totalSize -= entry.size;
      this.recordEviction(keyToEvict, reason);
    }
  }

  /**
   * Find least recently used key
   */
  private findLRUKey(): string {
    if (this.cache.size === 0) return '';

    let oldestKey = '';
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  /**
   * Find least frequently used key
   */
  private findLFUKey(): string {
    let leastUsedKey = '';
    let leastCount = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < leastCount) {
        leastCount = entry.accessCount;
        leastUsedKey = key;
      }
    }
    
    return leastUsedKey;
  }

  /**
   * Find expired key
   */
  private findExpiredKey(): string | null {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        return key;
      }
    }
    return null;
  }

  /**
   * Find first in, first out key
   */
  private findFIFOKey(): string {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    return oldestKey;
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) return false;
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Start periodic cleanup
   */
  private startPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      const entry = this.cache.get(key);
      if (entry) {
        this.cache.delete(key);
        this.metrics.totalSize -= entry.size;
        this.recordEviction(key, 'expired');
      }
    }
    
    this.metrics.entryCount = this.cache.size;
    this.metrics.lastCleanup = Date.now();
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Compress value (simple JSON compression)
   */
  private compress<T>(value: T): T {
    if (!this.options.enableCompression) return value;
    
    try {
      // Simple compression by removing whitespace from JSON
      if (typeof value === 'object') {
        const json = JSON.stringify(value);
        const compressed = json.replace(/\s+/g, '');
        return JSON.parse(compressed) as T;
      }
    } catch (error) {
      // Fallback to original value
    }
    
    return value;
  }

  /**
   * Decompress value
   */
  private decompress<T>(value: T): T {
    // For simple compression, no decompression needed
    return value;
  }

  /**
   * Estimate size of value in bytes
   */
  private estimateSize(value: any): number {
    try {
      const json = JSON.stringify(value);
      return new Blob([json]).size;
    } catch (error) {
      // Fallback estimation
      return 1024; // 1KB default
    }
  }

  /**
   * Record cache hit
   */
  private recordHit(): void {
    if (!this.options.enableMetrics) return;
    
    this.metrics.hits++;
    this.metrics.totalRequests++;
    this.updateHitRate();
  }

  /**
   * Record cache miss
   */
  private recordMiss(): void {
    if (!this.options.enableMetrics) return;
    
    this.metrics.misses++;
    this.metrics.totalRequests++;
    this.updateHitRate();
  }

  /**
   * Record eviction
   */
  private recordEviction(key: string, reason: string): void {
    if (!this.options.enableMetrics) return;
    
    this.metrics.evictions++;
    this.evictionHistory.push({
      key,
      reason,
      timestamp: Date.now(),
    });
    
    // Keep only recent evictions
    if (this.evictionHistory.length > 100) {
      this.evictionHistory = this.evictionHistory.slice(-50);
    }
  }

  /**
   * Record access time
   */
  private recordAccessTime(time: number): void {
    if (!this.options.enableMetrics) return;
    
    this.accessTimes.push(time);
    
    // Keep only recent access times
    if (this.accessTimes.length > 1000) {
      this.accessTimes = this.accessTimes.slice(-500);
    }
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    if (this.metrics.totalRequests > 0) {
      this.metrics.hitRate = this.metrics.hits / this.metrics.totalRequests;
    }
  }

  /**
   * Update metrics
   */
  private updateMetrics(): void {
    if (this.accessTimes.length > 0) {
      const sum = this.accessTimes.reduce((a, b) => a + b, 0);
      this.metrics.averageAccessTime = sum / this.accessTimes.length;
    }
    
    this.metrics.entryCount = this.cache.size;
  }
}

// ============================================================================
// Cache Service Instance
// ============================================================================

export const cacheService = new CacheService();

// ============================================================================
// Cache Decorators and Utilities
// ============================================================================

/**
 * Cache decorator for methods
 */
export function cached(ttl?: number, keyGenerator?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator ? 
        keyGenerator(...args) : 
        `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = await cacheService.get(cacheKey);
      if (cached !== null) {
        return cached;
      }
      
      // Execute method and cache result
      const result = await method.apply(this, args);
      await cacheService.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

/**
 * Generate cache key for common patterns
 */
export class CacheKeyGenerator {
  static forUser(userId: string, operation: string, ...params: any[]): string {
    return `user:${userId}:${operation}:${JSON.stringify(params)}`;
  }
  
  static forCalculation(calculatorType: string, parameters: any): string {
    return `calc:${calculatorType}:${JSON.stringify(parameters)}`;
  }
  
  static forAnalytics(type: string, timeframe: string, filters: any): string {
    return `analytics:${type}:${timeframe}:${JSON.stringify(filters)}`;
  }
  
  static forRecommendation(userId: string, context: any): string {
    return `rec:${userId}:${JSON.stringify(context)}`;
  }
}
