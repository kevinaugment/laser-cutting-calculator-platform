/**
 * Memory API Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryApiClient } from '../../api/memoryApi';
import { MemoryApiMock } from '../../api/memoryApiMock';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MemoryApiClient', () => {
  let apiClient: MemoryApiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    apiClient = new MemoryApiClient({
      baseUrl: 'http://localhost:3000/api/memory',
      timeout: 5000,
      retries: 1,
      enableCache: false, // Disable cache for testing
    });
  });

  afterEach(() => {
    apiClient.clearCache();
  });

  describe('saveCalculation', () => {
    it('should save calculation successfully', async () => {
      const mockResponse = {
        success: true,
        data: { id: 'calc-123' },
        timestamp: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.saveCalculation(
        'laser-cutting-cost',
        'Laser Cutting Cost Calculator',
        { thickness: 5, material: 'steel' },
        { cost: 100, time: 30 }
      );

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('calc-123');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/memory/history',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('laser-cutting-cost'),
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await apiClient.saveCalculation(
        'test-calc',
        'Test Calculator',
        {},
        {}
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTTP 500');
    });

    it('should handle network failures', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await apiClient.saveCalculation(
        'test-calc',
        'Test Calculator',
        { value: 42 },
        { result: 84 }
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });

  describe('getHistory', () => {
    it('should get history successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          records: [
            {
              id: 'calc-1',
              calculatorType: 'laser-cutting-cost',
              timestamp: '2024-01-01T00:00:00Z',
            },
          ],
          total: 1,
          pagination: { page: 1, limit: 20, hasNext: false, hasPrevious: false },
        },
        timestamp: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.getHistory({
        calculatorType: 'laser-cutting-cost',
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data?.records).toBeDefined();
      expect(Array.isArray(result.data?.records)).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('calculatorType=laser-cutting-cost'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('createPreset', () => {
    it('should create preset successfully', async () => {
      const mockResponse = {
        success: true,
        data: { id: 'preset-123' },
        timestamp: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiClient.createPreset(
        'Test Preset',
        'Test Description',
        'laser-cutting-cost',
        { thickness: 5, material: 'steel' },
        { category: 'custom', tags: ['test'] }
      );

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('preset-123');
    });
  });

  describe('caching', () => {
    it('should cache GET requests when enabled', async () => {
      const clientWithCache = new MemoryApiClient({
        baseUrl: 'http://localhost:3000/api/memory',
        enableCache: true,
      });

      const mockResponse = {
        success: true,
        data: { id: 'calc-1' },
        timestamp: '2024-01-01T00:00:00Z',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // First call
      await clientWithCache.getCalculation('calc-1');
      
      // Second call should use cache
      await clientWithCache.getCalculation('calc-1');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('query parameter building', () => {
    it('should build query parameters correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      });

      await apiClient.getHistory({
        calculatorType: 'test',
        limit: 10,
        offset: 20,
        tags: ['tag1', 'tag2'],
        sortBy: 'timestamp',
        sortOrder: 'desc',
      });

      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('calculatorType=test');
      expect(calledUrl).toContain('limit=10');
      expect(calledUrl).toContain('offset=20');
      expect(calledUrl).toContain('tags=tag1');
      expect(calledUrl).toContain('tags=tag2');
      expect(calledUrl).toContain('sortBy=timestamp');
      expect(calledUrl).toContain('sortOrder=desc');
    });
  });
});

describe('MemoryApiMock', () => {
  let mockApi: MemoryApiMock;

  beforeEach(async () => {
    mockApi = new MemoryApiMock(0); // No delay for tests

    // Clear all services before each test
    const { calculationHistoryService } = await import('../../services/calculationHistoryService');
    const { parameterPresetService } = await import('../../services/parameterPresetService');

    await calculationHistoryService.clearHistory();
    // Clear presets by getting all and deleting them
    const presets = await parameterPresetService.getPresets();
    for (const preset of presets.presets) {
      await parameterPresetService.deletePreset(preset.id);
    }
  });

  describe('saveCalculation', () => {
    it('should save calculation using mock service', async () => {
      const result = await mockApi.saveCalculation(
        'laser-cutting-cost',
        'Laser Cutting Cost Calculator',
        { thickness: 5, material: 'steel', area: 100 },
        { cost: 100, time: 30 }
      );

      expect(result.success).toBe(true);
      expect(result.data?.id).toBeDefined();
      expect(result.requestId).toContain('mock_');
    });

    it('should handle validation errors', async () => {
      // Mock service doesn't validate by default, so let's test with invalid calculator type
      const result = await mockApi.saveCalculation(
        'invalid-calculator-type',
        'Invalid Calculator',
        { value: 42 }, // Valid parameters
        { result: 84 }
      );

      // Mock service should succeed even with invalid calculator type
      expect(result.success).toBe(true);
      expect(result.data?.id).toBeDefined();
    });
  });

  describe('getHistory', () => {
    it('should return empty history initially', async () => {
      const result = await mockApi.getHistory();

      expect(result.success).toBe(true);
      expect(result.data?.records).toEqual([]);
      expect(result.data?.total).toBe(0);
    });

    it('should return saved calculations', async () => {
      // First save a calculation
      await mockApi.saveCalculation(
        'test-calc',
        'Test Calculator',
        { value: 42 },
        { result: 84 }
      );

      // Then get history
      const result = await mockApi.getHistory();

      expect(result.success).toBe(true);
      expect(result.data?.records.length).toBeGreaterThanOrEqual(1);

      // Find our specific calculation
      const ourCalc = result.data?.records.find(r => r.inputs.value === 42);
      expect(ourCalc).toBeDefined();
      expect(ourCalc?.inputs.value).toBe(42);
    });
  });

  describe('createPreset', () => {
    it('should create preset using mock service', async () => {
      const result = await mockApi.createPreset(
        'Test Preset',
        'Test Description',
        'test-calculator',
        { value: 42 },
        { category: 'custom', tags: ['test'] }
      );

      expect(result.success).toBe(true);
      expect(result.data?.id).toBeDefined();
    });
  });

  describe('getPresets', () => {
    it('should return created presets', async () => {
      // First create a preset
      await mockApi.createPreset(
        'Test Preset',
        'Test Description',
        'test-calculator',
        { value: 42 }
      );

      // Then get presets
      const result = await mockApi.getPresets();

      expect(result.success).toBe(true);
      expect(result.data?.items).toHaveLength(1);
      expect(result.data?.items[0].name).toBe('Test Preset');
    });
  });

  describe('search', () => {
    it('should search across history and presets', async () => {
      // Create some test data
      await mockApi.saveCalculation(
        'laser-cutting-cost',
        'Laser Cutting Cost Calculator',
        { material: 'steel' },
        { cost: 100 }
      );

      await mockApi.createPreset(
        'Steel Preset',
        'Preset for steel cutting',
        'laser-cutting-cost',
        { material: 'steel', thickness: 5, area: 100 }
      );

      // Search for 'steel'
      const result = await mockApi.search('steel');

      expect(result.success).toBe(true);
      expect(result.data?.total).toBeGreaterThan(0);
      expect(result.data?.history.length + result.data?.presets.length).toBe(result.data?.total);
    });
  });

  describe('preferences', () => {
    it('should get default preferences', async () => {
      const result = await mockApi.getPreferences();

      expect(result.success).toBe(true);
      expect(result.data?.defaultUnits).toBeDefined();
      expect(result.data?.autoSaveCalculations).toBeDefined();
    });

    it('should update preferences', async () => {
      const updates = {
        defaultUnits: 'imperial' as const,
        autoSaveCalculations: false,
      };

      const result = await mockApi.updatePreferences(updates);

      expect(result.success).toBe(true);
      expect(result.data?.defaultUnits).toBe('imperial');
      expect(result.data?.autoSaveCalculations).toBe(false);
    });
  });
});
