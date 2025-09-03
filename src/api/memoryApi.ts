/**
 * Memory System API
 * REST API endpoints for memory operations
 */

import { 
  CalculationRecord, 
  ParameterPreset, 
  UserPreferences,
  HistoryQuery,
  PresetQuery,
  MemoryServiceResponse,
  HistoryListResponse,
  PresetStats,
  HistoryStats
} from '../types/memory';

// ============================================================================
// API Configuration
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  enableCache: boolean;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: '/api/memory',
  timeout: 10000,
  retries: 3,
  enableCache: true,
};

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// Memory API Client
// ============================================================================

export class MemoryApiClient {
  private config: ApiConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor(config?: Partial<ApiConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Calculation History API
  // ============================================================================

  /**
   * Save calculation to history
   */
  public async saveCalculation(
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: any
  ): Promise<ApiResponse<{ id: string }>> {
    const payload = {
      calculatorType,
      calculatorName,
      inputs,
      outputs,
      context,
      timestamp: new Date().toISOString(),
    };

    return this.request('POST', '/history', payload);
  }

  /**
   * Get calculation history
   */
  public async getHistory(query?: HistoryQuery): Promise<ApiResponse<HistoryListResponse>> {
    const params = this.buildQueryParams(query);
    const cacheKey = `history:${params}`;
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.request('GET', `/history?${params}`);
    
    if (this.config.enableCache && response.success) {
      this.setCache(cacheKey, response, 60000); // 1 minute TTL
    }

    return response;
  }

  /**
   * Get specific calculation by ID
   */
  public async getCalculation(id: string): Promise<ApiResponse<CalculationRecord>> {
    const cacheKey = `calculation:${id}`;
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.request('GET', `/history/${id}`);
    
    if (this.config.enableCache && response.success) {
      this.setCache(cacheKey, response, 300000); // 5 minutes TTL
    }

    return response;
  }

  /**
   * Delete calculation from history
   */
  public async deleteCalculation(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const response = await this.request('DELETE', `/history/${id}`);
    
    if (response.success) {
      this.invalidateCache(`calculation:${id}`);
      this.invalidateCachePattern('history:');
    }

    return response;
  }

  /**
   * Clear all calculation history
   */
  public async clearHistory(): Promise<ApiResponse<{ cleared: boolean }>> {
    const response = await this.request('DELETE', '/history');
    
    if (response.success) {
      this.invalidateCachePattern('history:');
      this.invalidateCachePattern('calculation:');
    }

    return response;
  }

  /**
   * Get history statistics
   */
  public async getHistoryStats(): Promise<ApiResponse<HistoryStats>> {
    const cacheKey = 'history:stats';
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.request('GET', '/history/stats');
    
    if (this.config.enableCache && response.success) {
      this.setCache(cacheKey, response, 300000); // 5 minutes TTL
    }

    return response;
  }

  // ============================================================================
  // Parameter Presets API
  // ============================================================================

  /**
   * Create parameter preset
   */
  public async createPreset(
    name: string,
    description: string,
    calculatorType: string,
    parameters: Record<string, any>,
    options?: {
      category?: string;
      visibility?: string;
      tags?: string[];
    }
  ): Promise<ApiResponse<{ id: string }>> {
    const payload = {
      name,
      description,
      calculatorType,
      parameters,
      ...options,
    };

    const response = await this.request('POST', '/presets', payload);
    
    if (response.success) {
      this.invalidateCachePattern('presets:');
    }

    return response;
  }

  /**
   * Get parameter presets
   */
  public async getPresets(query?: PresetQuery): Promise<ApiResponse<PaginatedResponse<ParameterPreset>>> {
    const params = this.buildQueryParams(query);
    const cacheKey = `presets:${params}`;
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.request('GET', `/presets?${params}`);
    
    if (this.config.enableCache && response.success) {
      this.setCache(cacheKey, response, 60000); // 1 minute TTL
    }

    return response;
  }

  /**
   * Get specific preset by ID
   */
  public async getPreset(id: string): Promise<ApiResponse<ParameterPreset>> {
    const cacheKey = `preset:${id}`;
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.request('GET', `/presets/${id}`);
    
    if (this.config.enableCache && response.success) {
      this.setCache(cacheKey, response, 300000); // 5 minutes TTL
    }

    return response;
  }

  /**
   * Update parameter preset
   */
  public async updatePreset(
    id: string,
    updates: Partial<ParameterPreset>
  ): Promise<ApiResponse<ParameterPreset>> {
    const response = await this.request('PUT', `/presets/${id}`, updates);
    
    if (response.success) {
      this.invalidateCache(`preset:${id}`);
      this.invalidateCachePattern('presets:');
    }

    return response;
  }

  /**
   * Delete parameter preset
   */
  public async deletePreset(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const response = await this.request('DELETE', `/presets/${id}`);
    
    if (response.success) {
      this.invalidateCache(`preset:${id}`);
      this.invalidateCachePattern('presets:');
    }

    return response;
  }

  /**
   * Use parameter preset (increment usage count)
   */
  public async usePreset(id: string): Promise<ApiResponse<ParameterPreset>> {
    const response = await this.request('POST', `/presets/${id}/use`);
    
    if (response.success) {
      this.invalidateCache(`preset:${id}`);
      this.invalidateCachePattern('presets:');
    }

    return response;
  }

  /**
   * Rate parameter preset
   */
  public async ratePreset(id: string, rating: number): Promise<ApiResponse<ParameterPreset>> {
    const payload = { rating };
    const response = await this.request('POST', `/presets/${id}/rate`, payload);
    
    if (response.success) {
      this.invalidateCache(`preset:${id}`);
      this.invalidateCachePattern('presets:');
    }

    return response;
  }

  /**
   * Get preset statistics
   */
  public async getPresetStats(): Promise<ApiResponse<PresetStats>> {
    const cacheKey = 'presets:stats';
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.request('GET', '/presets/stats');
    
    if (this.config.enableCache && response.success) {
      this.setCache(cacheKey, response, 300000); // 5 minutes TTL
    }

    return response;
  }

  // ============================================================================
  // User Preferences API
  // ============================================================================

  /**
   * Get user preferences
   */
  public async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    const cacheKey = 'preferences';
    
    if (this.config.enableCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    const response = await this.request('GET', '/preferences');
    
    if (this.config.enableCache && response.success) {
      this.setCache(cacheKey, response, 600000); // 10 minutes TTL
    }

    return response;
  }

  /**
   * Update user preferences
   */
  public async updatePreferences(
    updates: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    const response = await this.request('PUT', '/preferences', updates);
    
    if (response.success) {
      this.invalidateCache('preferences');
    }

    return response;
  }

  /**
   * Reset user preferences
   */
  public async resetPreferences(): Promise<ApiResponse<UserPreferences>> {
    const response = await this.request('POST', '/preferences/reset');
    
    if (response.success) {
      this.invalidateCache('preferences');
    }

    return response;
  }

  // ============================================================================
  // Search API
  // ============================================================================

  /**
   * Search across all memory data
   */
  public async search(
    query: string,
    filters?: {
      type?: 'history' | 'presets' | 'all';
      calculatorType?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<ApiResponse<{
    history: CalculationRecord[];
    presets: ParameterPreset[];
    total: number;
  }>> {
    const payload = { query, filters };
    return this.request('POST', '/search', payload);
  }

  // ============================================================================
  // Bulk Operations API
  // ============================================================================

  /**
   * Export memory data
   */
  public async exportData(
    options?: {
      includeHistory?: boolean;
      includePresets?: boolean;
      includePreferences?: boolean;
      format?: 'json' | 'csv';
    }
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const params = this.buildQueryParams(options);
    return this.request('GET', `/export?${params}`);
  }

  /**
   * Import memory data
   */
  public async importData(
    data: FormData | object,
    options?: {
      overwrite?: boolean;
      validate?: boolean;
    }
  ): Promise<ApiResponse<{
    imported: number;
    skipped: number;
    errors: string[];
  }>> {
    const payload = data instanceof FormData ? data : { data, options };
    return this.request('POST', '/import', payload);
  }

  // ============================================================================
  // Pattern Recognition API
  // ============================================================================

  /**
   * Analyze user patterns
   */
  public async analyzePatterns(
    userId?: string,
    options?: {
      patternTypes?: string[];
      analysisWindowDays?: number;
      minConfidence?: number;
    }
  ): Promise<ApiResponse<{
    patterns: any[];
    analysisTimestamp: string;
    totalPatterns: number;
  }>> {
    const payload = { userId, options };
    return this.request('POST', '/patterns/analyze', payload);
  }

  /**
   * Get patterns by type
   */
  public async getPatternsByType(
    patternType: string,
    userId?: string,
    options?: {
      limit?: number;
      minConfidence?: number;
    }
  ): Promise<ApiResponse<{
    patterns: any[];
    total: number;
  }>> {
    const params = this.buildQueryParams({ patternType, userId, ...options });
    return this.request('GET', `/patterns/type?${params}`);
  }

  /**
   * Get pattern insights
   */
  public async getPatternInsights(
    userId?: string,
    options?: {
      categories?: string[];
      limit?: number;
    }
  ): Promise<ApiResponse<{
    insights: any[];
    categories: Record<string, any[]>;
    anomalies: any[];
  }>> {
    const params = this.buildQueryParams({ userId, ...options });
    return this.request('GET', `/patterns/insights?${params}`);
  }

  /**
   * Get pattern statistics
   */
  public async getPatternStats(
    userId?: string
  ): Promise<ApiResponse<{
    totalPatterns: number;
    patternsByType: Record<string, number>;
    averageConfidence: number;
    lastAnalysis: string;
  }>> {
    const params = this.buildQueryParams({ userId });
    return this.request('GET', `/patterns/stats?${params}`);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const requestId = this.generateRequestId();

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
      },
    };

    // Add timeout signal if supported
    if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
      options.signal = AbortSignal.timeout(this.config.timeout);
    }

    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        delete options.headers!['Content-Type'];
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return {
          ...result,
          requestId,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.config.retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Request failed',
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  private buildQueryParams(params?: Record<string, any>): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private invalidateCache(key: string): void {
    this.cache.delete(key);
  }

  private invalidateCachePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const memoryApi = new MemoryApiClient();

// ============================================================================
// Convenience Functions
// ============================================================================

export const memoryApiHelpers = {
  // History helpers
  saveCalculation: memoryApi.saveCalculation.bind(memoryApi),
  getHistory: memoryApi.getHistory.bind(memoryApi),
  getCalculation: memoryApi.getCalculation.bind(memoryApi),
  deleteCalculation: memoryApi.deleteCalculation.bind(memoryApi),
  clearHistory: memoryApi.clearHistory.bind(memoryApi),
  getHistoryStats: memoryApi.getHistoryStats.bind(memoryApi),

  // Preset helpers
  createPreset: memoryApi.createPreset.bind(memoryApi),
  getPresets: memoryApi.getPresets.bind(memoryApi),
  getPreset: memoryApi.getPreset.bind(memoryApi),
  updatePreset: memoryApi.updatePreset.bind(memoryApi),
  deletePreset: memoryApi.deletePreset.bind(memoryApi),
  usePreset: memoryApi.usePreset.bind(memoryApi),
  ratePreset: memoryApi.ratePreset.bind(memoryApi),
  getPresetStats: memoryApi.getPresetStats.bind(memoryApi),

  // Preferences helpers
  getPreferences: memoryApi.getPreferences.bind(memoryApi),
  updatePreferences: memoryApi.updatePreferences.bind(memoryApi),
  resetPreferences: memoryApi.resetPreferences.bind(memoryApi),

  // Utility helpers
  search: memoryApi.search.bind(memoryApi),
  exportData: memoryApi.exportData.bind(memoryApi),
  importData: memoryApi.importData.bind(memoryApi),
};
