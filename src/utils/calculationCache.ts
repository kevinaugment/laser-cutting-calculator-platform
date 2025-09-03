// 计算结果缓存系统 - 性能优化

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  cleanupInterval: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  memoryUsage: number;
}

/**
 * 高性能计算结果缓存系统
 * 支持LRU淘汰策略、TTL过期、内存管理
 */
export class CalculationCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private stats = {
    hits: 0,
    misses: 0
  };
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 100,
      ttl: config.ttl || 5 * 60 * 1000, // 5分钟默认TTL
      cleanupInterval: config.cleanupInterval || 60 * 1000 // 1分钟清理间隔
    };

    this.startCleanupTimer();
  }

  /**
   * 生成缓存键
   */
  generateKey(calculatorId: string, inputs: any): string {
    // 创建稳定的键，忽略对象属性顺序
    const sortedInputs = this.sortObjectKeys(inputs);
    return `${calculatorId}:${JSON.stringify(sortedInputs)}`;
  }

  /**
   * 获取缓存结果
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // 检查TTL过期
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // 更新访问统计
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;

    return entry.data;
  }

  /**
   * 设置缓存结果
   */
  set(key: string, data: T): void {
    const now = Date.now();
    
    // 如果缓存已满，执行LRU淘汰
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    });
  }

  /**
   * 带缓存的计算执行
   */
  async computeWithCache<R>(
    calculatorId: string,
    inputs: any,
    computeFn: () => Promise<R> | R
  ): Promise<R> {
    const key = this.generateKey(calculatorId, inputs);
    
    // 尝试从缓存获取
    const cached = this.get(key) as R;
    if (cached !== null) {
      console.log(`🎯 Cache hit for ${calculatorId}`);
      return cached;
    }

    // 执行计算
    console.log(`⚡ Computing ${calculatorId}...`);
    const startTime = performance.now();
    
    try {
      const result = await computeFn();
      const computeTime = performance.now() - startTime;
      
      // 缓存结果
      this.set(key, result as T);
      
      console.log(`✅ ${calculatorId} computed in ${Math.round(computeTime)}ms`);
      return result;
    } catch (error) {
      console.error(`❌ ${calculatorId} computation failed:`, error);
      throw error;
    }
  }

  /**
   * 清除特定计算器的缓存
   */
  clearCalculator(calculatorId: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${calculatorId}:`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🧹 Cleared ${keysToDelete.length} cache entries for ${calculatorId}`);
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    console.log('🧹 Cache cleared');
  }

  /**
   * 获取缓存统计
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    
    // 估算内存使用（粗略计算）
    let memoryUsage = 0;
    for (const entry of this.cache.values()) {
      memoryUsage += JSON.stringify(entry.data).length * 2; // UTF-16字符
    }

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage: Math.round(memoryUsage / 1024) // KB
    };
  }

  /**
   * 预热缓存
   */
  async warmup(
    calculatorId: string,
    commonInputs: any[],
    computeFn: (inputs: any) => Promise<any>
  ): Promise<void> {
    console.log(`🔥 Warming up cache for ${calculatorId}...`);
    
    const promises = commonInputs.map(inputs => 
      this.computeWithCache(calculatorId, inputs, () => computeFn(inputs))
    );
    
    await Promise.all(promises);
    console.log(`✅ Cache warmed up for ${calculatorId} with ${commonInputs.length} entries`);
  }

  /**
   * LRU淘汰策略
   */
  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`🗑️ Evicted LRU cache entry: ${oldestKey}`);
    }
  }

  /**
   * 定期清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`🧹 Cleaned up ${keysToDelete.length} expired cache entries`);
    }
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * 停止清理定时器
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.clear();
  }

  /**
   * 对象键排序（确保缓存键稳定）
   */
  private sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }

    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: any = {};
    
    for (const key of sortedKeys) {
      sortedObj[key] = this.sortObjectKeys(obj[key]);
    }

    return sortedObj;
  }
}

// 全局缓存实例
export const globalCalculationCache = new CalculationCache({
  maxSize: 200,
  ttl: 10 * 60 * 1000, // 10分钟
  cleanupInterval: 2 * 60 * 1000 // 2分钟清理
});

// 缓存装饰器
export function withCache<T extends any[], R>(
  calculatorId: string,
  cache: CalculationCache = globalCalculationCache
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<R> | R>
  ) {
    const method = descriptor.value!;
    
    descriptor.value = async function (...args: T): Promise<R> {
      const inputs = args[0]; // 假设第一个参数是输入
      return cache.computeWithCache(calculatorId, inputs, () => method.apply(this, args));
    };
  };
}

// 缓存管理工具
export class CacheManager {
  private caches = new Map<string, CalculationCache>();

  getCache(name: string): CalculationCache {
    if (!this.caches.has(name)) {
      this.caches.set(name, new CalculationCache());
    }
    return this.caches.get(name)!;
  }

  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {};
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats();
    }
    return stats;
  }

  clearAll(): void {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
  }

  destroy(): void {
    for (const cache of this.caches.values()) {
      cache.destroy();
    }
    this.caches.clear();
  }
}

export const globalCacheManager = new CacheManager();

export default CalculationCache;
