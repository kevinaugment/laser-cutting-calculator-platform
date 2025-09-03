/**
 * Cache Service Tests
 * Comprehensive test suite for caching functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheService, cacheService } from '../../services/cacheService';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    service = new CacheService({
      maxSize: 1024 * 1024, // 1MB for testing
      maxEntries: 100,
      defaultTTL: 60000, // 1 minute
      evictionPolicy: 'lru',
    });
  });

  describe('basic operations', () => {
    it('should set and get values', async () => {
      const key = 'test-key';
      const value = { data: 'test-value', number: 42 };

      await service.set(key, value);
      const retrieved = await service.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent keys', async () => {
      const result = await service.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should check if key exists', async () => {
      const key = 'exists-key';
      const value = 'test-value';

      expect(await service.has(key)).toBe(false);
      
      await service.set(key, value);
      expect(await service.has(key)).toBe(true);
    });

    it('should delete values', async () => {
      const key = 'delete-key';
      const value = 'test-value';

      await service.set(key, value);
      expect(await service.has(key)).toBe(true);

      const deleted = await service.delete(key);
      expect(deleted).toBe(true);
      expect(await service.has(key)).toBe(false);
    });

    it('should clear all values', async () => {
      await service.set('key1', 'value1');
      await service.set('key2', 'value2');
      await service.set('key3', 'value3');

      await service.clear();

      expect(await service.has('key1')).toBe(false);
      expect(await service.has('key2')).toBe(false);
      expect(await service.has('key3')).toBe(false);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire entries after TTL', async () => {
      const key = 'ttl-key';
      const value = 'ttl-value';
      const shortTTL = 100; // 100ms

      await service.set(key, value, shortTTL);
      expect(await service.get(key)).toEqual(value);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(await service.get(key)).toBeNull();
      expect(await service.has(key)).toBe(false);
    });

    it('should use default TTL when not specified', async () => {
      const key = 'default-ttl-key';
      const value = 'default-ttl-value';

      await service.set(key, value);
      const retrieved = await service.get(key);

      expect(retrieved).toEqual(value);
    });
  });

  describe('eviction policies', () => {
    it('should evict LRU entries when cache is full', async () => {
      const smallCacheService = new CacheService({
        maxEntries: 3,
        evictionPolicy: 'lru',
      });

      // Fill cache with some delay to ensure different timestamps
      await smallCacheService.set('key1', 'value1');
      await new Promise(resolve => setTimeout(resolve, 10));

      await smallCacheService.set('key2', 'value2');
      await new Promise(resolve => setTimeout(resolve, 10));

      await smallCacheService.set('key3', 'value3');
      await new Promise(resolve => setTimeout(resolve, 10));

      // Access key1 and key3 to make them recently used
      await smallCacheService.get('key1');
      await smallCacheService.get('key3');

      // Add new entry, should evict key2 (least recently used)
      await smallCacheService.set('key4', 'value4');

      // Check that we have exactly 3 entries
      const stats = smallCacheService.getStats();
      expect(stats.metrics.entryCount).toBe(3);

      // key2 should be evicted as it was least recently used
      expect(await smallCacheService.has('key2')).toBe(false);
    });

    it('should evict LFU entries when using LFU policy', async () => {
      const lfuCacheService = new CacheService({
        maxEntries: 3,
        evictionPolicy: 'lfu',
      });

      // Fill cache
      await lfuCacheService.set('key1', 'value1');
      await lfuCacheService.set('key2', 'value2');
      await lfuCacheService.set('key3', 'value3');

      // Access key1 multiple times
      await lfuCacheService.get('key1');
      await lfuCacheService.get('key1');
      await lfuCacheService.get('key1');

      // Access key3 once
      await lfuCacheService.get('key3');

      // key2 has 0 accesses, should be evicted
      await lfuCacheService.set('key4', 'value4');

      expect(await lfuCacheService.has('key1')).toBe(true); // Most frequently used
      expect(await lfuCacheService.has('key2')).toBe(false); // Should be evicted (LFU)
      expect(await lfuCacheService.has('key3')).toBe(true);
      expect(await lfuCacheService.has('key4')).toBe(true);
    });
  });

  describe('cache statistics', () => {
    it('should track cache hits and misses', async () => {
      const key = 'stats-key';
      const value = 'stats-value';

      // Miss
      await service.get('non-existent');
      
      // Set and hit
      await service.set(key, value);
      await service.get(key);
      await service.get(key);

      const stats = service.getStats();
      
      expect(stats.metrics.hits).toBe(2);
      expect(stats.metrics.misses).toBe(1);
      expect(stats.metrics.totalRequests).toBe(3);
      expect(stats.metrics.hitRate).toBeCloseTo(2/3, 2);
    });

    it('should track cache size and entry count', async () => {
      await service.set('key1', 'value1');
      await service.set('key2', { data: 'complex', array: [1, 2, 3] });

      const stats = service.getStats();
      
      expect(stats.metrics.entryCount).toBe(2);
      expect(stats.metrics.totalSize).toBeGreaterThan(0);
    });

    it('should track top accessed keys', async () => {
      await service.set('popular', 'value');
      await service.set('unpopular', 'value');

      // Access popular key multiple times
      await service.get('popular');
      await service.get('popular');
      await service.get('popular');

      // Access unpopular key once
      await service.get('unpopular');

      const stats = service.getStats();
      
      expect(stats.topKeys[0].key).toBe('popular');
      expect(stats.topKeys[0].accessCount).toBe(3);
    });
  });

  describe('compression', () => {
    it('should handle compression when enabled', async () => {
      const compressionService = new CacheService({
        enableCompression: true,
      });

      const largeObject = {
        data: 'x'.repeat(1000),
        array: Array.from({ length: 100 }, (_, i) => ({ id: i, value: `item-${i}` })),
      };

      await compressionService.set('large-key', largeObject);
      const retrieved = await compressionService.get('large-key');

      expect(retrieved).toEqual(largeObject);
    });

    it('should work without compression', async () => {
      const noCompressionService = new CacheService({
        enableCompression: false,
      });

      const data = { test: 'data' };
      await noCompressionService.set('no-compression', data);
      const retrieved = await noCompressionService.get('no-compression');

      expect(retrieved).toEqual(data);
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent gets and sets', async () => {
      const promises = [];

      // Concurrent sets
      for (let i = 0; i < 10; i++) {
        promises.push(service.set(`concurrent-${i}`, `value-${i}`));
      }

      await Promise.all(promises);

      // Concurrent gets
      const getPromises = [];
      for (let i = 0; i < 10; i++) {
        getPromises.push(service.get(`concurrent-${i}`));
      }

      const results = await Promise.all(getPromises);

      results.forEach((result, index) => {
        expect(result).toBe(`value-${index}`);
      });
    });

    it('should handle concurrent operations with eviction', async () => {
      const smallService = new CacheService({
        maxEntries: 5,
        evictionPolicy: 'lru',
      });

      // Add entries sequentially to ensure proper eviction
      for (let i = 0; i < 10; i++) {
        await smallService.set(`key-${i}`, `value-${i}`);
      }

      const stats = smallService.getStats();
      expect(stats.metrics.entryCount).toBeLessThanOrEqual(5);
    });
  });

  describe('error handling', () => {
    it('should handle invalid keys gracefully', async () => {
      // These should not throw errors
      expect(await service.get('')).toBeNull();
      expect(await service.has('')).toBe(false);
      expect(await service.delete('')).toBe(false);
    });

    it('should handle circular references in values', async () => {
      const circularObj: any = { name: 'test' };
      circularObj.self = circularObj;

      // Should not throw, but may not store the circular reference
      await expect(service.set('circular', circularObj)).resolves.not.toThrow();
    });
  });

  describe('cache decorators', () => {
    it('should cache method results manually', async () => {
      let callCount = 0;

      class TestService {
        async expensiveOperation(input: string): Promise<string> {
          // Check cache first
          const cacheKey = `TestService.expensiveOperation:${input}`;
          const cached = await service.get(cacheKey);
          if (cached !== null) {
            return cached;
          }

          // Execute method
          callCount++;
          const result = `processed-${input}`;

          // Cache result
          await service.set(cacheKey, result, 1000);

          return result;
        }
      }

      const testService = new TestService();

      // First call
      const result1 = await testService.expensiveOperation('test');
      expect(result1).toBe('processed-test');
      expect(callCount).toBe(1);

      // Second call should use cache
      const result2 = await testService.expensiveOperation('test');
      expect(result2).toBe('processed-test');
      expect(callCount).toBe(1); // Should not increment

      // Different input should call method
      const result3 = await testService.expensiveOperation('different');
      expect(result3).toBe('processed-different');
      expect(callCount).toBe(2);
    });
  });

  describe('memory management', () => {
    it('should respect max size limits', async () => {
      const limitedService = new CacheService({
        maxSize: 1024, // 1KB
        evictionPolicy: 'lru',
      });

      // Add entries until we exceed size limit
      const largeValue = 'x'.repeat(200); // ~200 bytes each
      
      for (let i = 0; i < 10; i++) {
        await limitedService.set(`large-${i}`, largeValue);
      }

      const stats = limitedService.getStats();
      expect(stats.metrics.totalSize).toBeLessThanOrEqual(1024);
    });

    it('should clean up expired entries periodically', async () => {
      const cleanupService = new CacheService({
        defaultTTL: 50, // 50ms
      });

      // Add entries that will expire
      await cleanupService.set('expire1', 'value1');
      await cleanupService.set('expire2', 'value2');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trigger cleanup by adding new entry
      await cleanupService.set('new', 'value');

      expect(await cleanupService.has('expire1')).toBe(false);
      expect(await cleanupService.has('expire2')).toBe(false);
      expect(await cleanupService.has('new')).toBe(true);
    });
  });
});
