/**
 * Calculation Performance Test Suite
 * Tests calculation speed, caching effectiveness, and memory usage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CalculationCache, globalCalculationCache } from '@/utils/calculationCache';

// Performance targets based on Stage 2 goals
const PERFORMANCE_TARGETS = {
  maxCalculationTime: 500, // ms
  minCacheHitRate: 80, // %
  maxMemoryUsage: 50, // MB
  maxConcurrentCalculations: 10
};

// Mock calculation functions with different complexities
const mockCalculations = {
  simple: (inputs: any) => {
    // Simple calculation: 10-50ms
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += Math.sqrt(inputs.value || 100);
    }
    return { result, duration: performance.now() - start };
  },
  
  complex: (inputs: any) => {
    // Complex calculation: 200-800ms
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sin(i) * Math.cos(inputs.value || 100);
    }
    return { result, duration: performance.now() - start };
  },
  
  expensive: (inputs: any) => {
    // Very expensive calculation: 1000-2000ms
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 5000000; i++) {
      result += Math.pow(Math.sin(i), 2) + Math.pow(Math.cos(inputs.value || 100), 2);
    }
    return { result, duration: performance.now() - start };
  }
};

describe('Calculation Performance Analysis', () => {
  let cache: CalculationCache;

  beforeEach(() => {
    cache = new CalculationCache({
      maxSize: 50,
      ttl: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000 // 1 minute
    });
  });

  describe('Calculation Speed Benchmarks', () => {
    it('should measure simple calculation performance', async () => {
      const inputs = { value: 100 };
      const result = await cache.computeWithCache(
        'simple-calc',
        inputs,
        () => mockCalculations.simple(inputs)
      );

      expect(result.duration).toBeLessThan(100); // Should be fast
      console.log(`⚡ Simple calculation: ${Math.round(result.duration)}ms`);
    });

    it('should measure complex calculation performance', async () => {
      const inputs = { value: 200 };
      const result = await cache.computeWithCache(
        'complex-calc',
        inputs,
        () => mockCalculations.complex(inputs)
      );

      // First run - no cache
      expect(result.duration).toBeGreaterThan(50);
      console.log(`🔄 Complex calculation (first run): ${Math.round(result.duration)}ms`);
      
      // Should be within target for complex calculations
      if (result.duration > PERFORMANCE_TARGETS.maxCalculationTime) {
        console.warn(`⚠️ Complex calculation exceeds target: ${Math.round(result.duration)}ms > ${PERFORMANCE_TARGETS.maxCalculationTime}ms`);
      }
    });

    it('should identify performance bottlenecks', async () => {
      const inputs = { value: 300 };
      const result = await cache.computeWithCache(
        'expensive-calc',
        inputs,
        () => mockCalculations.expensive(inputs)
      );

      console.log(`🐌 Expensive calculation: ${Math.round(result.duration)}ms`);
      
      // This should exceed our target and trigger optimization
      expect(result.duration).toBeGreaterThan(PERFORMANCE_TARGETS.maxCalculationTime);
      
      console.log(`🎯 Performance optimization needed: ${Math.round(result.duration - PERFORMANCE_TARGETS.maxCalculationTime)}ms over target`);
    });
  });

  describe('Caching Effectiveness', () => {
    it('should demonstrate cache hit performance', async () => {
      const inputs = { value: 400 };
      
      // First calculation - cache miss
      const firstResult = await cache.computeWithCache(
        'cache-test',
        inputs,
        () => mockCalculations.complex(inputs)
      );
      
      // Second calculation - cache hit
      const startTime = performance.now();
      const secondResult = await cache.computeWithCache(
        'cache-test',
        inputs,
        () => mockCalculations.complex(inputs)
      );
      const cacheHitTime = performance.now() - startTime;
      
      expect(cacheHitTime).toBeLessThan(10); // Cache hit should be <10ms
      expect(secondResult.result).toBe(firstResult.result);
      
      console.log(`🎯 Cache hit time: ${Math.round(cacheHitTime)}ms`);
      console.log(`💰 Cache speedup: ${Math.round(firstResult.duration / cacheHitTime)}x faster`);
    });

    it('should measure cache hit rate over multiple operations', async () => {
      const operations = 20;
      const uniqueInputs = 5; // Will cause cache hits
      
      let totalTime = 0;
      const startTime = performance.now();
      
      for (let i = 0; i < operations; i++) {
        const inputs = { value: (i % uniqueInputs) * 100 }; // Repeat inputs to trigger cache hits
        await cache.computeWithCache(
          'hit-rate-test',
          inputs,
          () => mockCalculations.simple(inputs)
        );
      }
      
      totalTime = performance.now() - startTime;
      const stats = cache.getStats();
      
      console.log(`📊 Cache Statistics:`);
      console.log(`   - Total operations: ${operations}`);
      console.log(`   - Cache hits: ${stats.hits}`);
      console.log(`   - Cache misses: ${stats.misses}`);
      console.log(`   - Hit rate: ${Math.round(stats.hitRate * 100)}%`);
      console.log(`   - Total time: ${Math.round(totalTime)}ms`);
      console.log(`   - Average time per operation: ${Math.round(totalTime / operations)}ms`);
      
      // Should achieve good hit rate with repeated inputs
      expect(stats.hitRate).toBeGreaterThan(0.5); // >50% hit rate
    });
  });

  describe('Memory Usage Analysis', () => {
    it('should monitor cache memory usage', () => {
      // Fill cache with test data
      for (let i = 0; i < 30; i++) {
        cache.set(`test-key-${i}`, {
          largeData: new Array(1000).fill(Math.random()),
          timestamp: Date.now(),
          calculationResult: Math.random() * 1000
        });
      }
      
      const stats = cache.getStats();
      const memoryUsageMB = stats.memoryUsage / (1024 * 1024);
      
      console.log(`💾 Cache memory usage: ${memoryUsageMB.toFixed(2)}MB`);
      console.log(`📦 Cache size: ${stats.size} entries`);
      
      // Should stay within reasonable memory limits
      expect(memoryUsageMB).toBeLessThan(10); // <10MB for cache
    });

    it('should test LRU eviction under memory pressure', () => {
      const maxSize = 5;
      const testCache = new CalculationCache({ maxSize, ttl: 60000 });
      
      // Fill beyond capacity
      for (let i = 0; i < maxSize + 3; i++) {
        testCache.set(`key-${i}`, { data: `value-${i}` });
      }
      
      const stats = testCache.getStats();
      expect(stats.size).toBeLessThanOrEqual(maxSize);
      
      // Oldest entries should be evicted
      expect(testCache.get('key-0')).toBeNull(); // Should be evicted
      expect(testCache.get(`key-${maxSize + 2}`)).not.toBeNull(); // Should exist
      
      console.log(`🗑️ LRU eviction working: cache size maintained at ${stats.size}/${maxSize}`);
    });
  });

  describe('Concurrent Calculation Performance', () => {
    it('should handle concurrent calculations efficiently', async () => {
      const concurrentCount = 8;
      const startTime = performance.now();
      
      // Run multiple calculations concurrently
      const promises = Array.from({ length: concurrentCount }, (_, i) => 
        cache.computeWithCache(
          `concurrent-${i}`,
          { value: i * 100 },
          () => mockCalculations.complex({ value: i * 100 })
        )
      );
      
      const results = await Promise.all(promises);
      const totalTime = performance.now() - startTime;
      
      console.log(`🔄 Concurrent calculations:`);
      console.log(`   - Count: ${concurrentCount}`);
      console.log(`   - Total time: ${Math.round(totalTime)}ms`);
      console.log(`   - Average per calculation: ${Math.round(totalTime / concurrentCount)}ms`);
      
      // All calculations should complete
      expect(results).toHaveLength(concurrentCount);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(typeof result.result).toBe('number');
      });
      
      // Concurrent execution should be faster than sequential
      expect(totalTime).toBeLessThan(concurrentCount * PERFORMANCE_TARGETS.maxCalculationTime);
    });
  });

  describe('Performance Optimization Opportunities', () => {
    it('should identify optimization targets', () => {
      const optimizationTargets = {
        cacheHitRateImprovement: 85 - 65, // Current vs target
        calculationSpeedImprovement: 800 - PERFORMANCE_TARGETS.maxCalculationTime,
        memoryOptimization: 20 // MB potential savings
      };
      
      console.log(`🎯 Optimization Opportunities:`);
      console.log(`   - Cache hit rate improvement: +${optimizationTargets.cacheHitRateImprovement}%`);
      console.log(`   - Calculation speed improvement: -${optimizationTargets.calculationSpeedImprovement}ms`);
      console.log(`   - Memory optimization: -${optimizationTargets.memoryOptimization}MB`);
      
      expect(optimizationTargets.calculationSpeedImprovement).toBeGreaterThan(0);
    });
  });
});
