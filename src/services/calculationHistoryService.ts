/**
 * Calculation History Service
 * Manages calculation history tracking, storage, and retrieval
 * Enhanced with caching and performance monitoring
 */

import { cacheService, CacheKeyGenerator, cached } from './cacheService';
import { performanceMonitoringService } from './performanceMonitoringService';

import { 
  CalculationRecord, 
  CalculationContext, 
  CalculationMetadata,
  SearchCriteria,
  PaginationInfo,
  ApiResponse
} from '../types/memory';
import { generateId } from '../utils/idGenerator';

// ============================================================================
// Service Configuration
// ============================================================================

export interface HistoryServiceConfig {
  maxRecords: number;
  autoCleanupDays: number;
  compressionEnabled: boolean;
  batchSize: number;
  storageKey: string;
}

const DEFAULT_CONFIG: HistoryServiceConfig = {
  maxRecords: 1000,
  autoCleanupDays: 90,
  compressionEnabled: true,
  batchSize: 50,
  storageKey: 'laser-calc-history',
};

// ============================================================================
// History Query Types
// ============================================================================

export interface HistoryQuery {
  calculatorType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'calculatorType' | 'executionTime';
  sortOrder?: 'asc' | 'desc';
}

export interface HistoryStats {
  totalRecords: number;
  calculatorUsage: Record<string, number>;
  averageExecutionTime: number;
  mostUsedParameters: Array<{
    parameter: string;
    count: number;
    averageValue: number;
  }>;
  dailyUsage: Array<{
    date: string;
    count: number;
  }>;
}

// ============================================================================
// Calculation History Service
// ============================================================================

export class CalculationHistoryService {
  private config: HistoryServiceConfig;
  private cache: Map<string, CalculationRecord[]> = new Map();
  private isInitialized = false;

  constructor(config?: Partial<HistoryServiceConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load existing history from localStorage
      await this.loadFromStorage();
      
      // Setup cleanup scheduler
      this.scheduleCleanup();
      
      this.isInitialized = true;
      console.log('✅ Calculation History Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Calculation History Service:', error);
      throw error;
    }
  }

  // ============================================================================
  // Core History Operations
  // ============================================================================

  /**
   * Save a calculation to history
   */
  public async saveCalculation(
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: Partial<CalculationContext>,
    metadata?: Partial<CalculationMetadata>
  ): Promise<string> {
    const startTime = performance.now();

    try {
      const record: CalculationRecord = {
        id: generateId(),
        calculatorType,
        calculatorName,
        timestamp: new Date().toISOString(),
        inputs: { ...inputs },
        outputs: { ...outputs },
        metadata: {
          version: '1.0.0',
          executionTime: performance.now() - startTime,
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId(),
          context: context ? { ...context } : undefined,
          ...metadata,
        },
      };

      // Add to cache
      const userHistory = this.getUserHistory();
      userHistory.unshift(record);

      // Enforce max records limit
      if (userHistory.length > this.config.maxRecords) {
        userHistory.splice(this.config.maxRecords);
      }

      // Save to storage
      await this.saveToStorage();

      console.log(`📊 Calculation saved to history: ${calculatorType} (${record.id})`);
      return record.id;
    } catch (error) {
      console.error('❌ Failed to save calculation to history:', error);
      throw error;
    }
  }

  /**
   * Get calculation history with optional filtering (with caching)
   */
  @cached(2 * 60 * 1000, (query?: HistoryQuery) =>
    CacheKeyGenerator.forUser('current', 'history', query || {}))
  public async getHistory(query?: HistoryQuery): Promise<{
    records: CalculationRecord[];
    total: number;
    pagination: PaginationInfo;
  }> {
    try {
      let records = this.getUserHistory();

      // Apply filters
      if (query) {
        records = this.applyFilters(records, query);
      }

      const total = records.length;
      const limit = query?.limit || 20;
      const offset = query?.offset || 0;

      // Apply pagination
      const paginatedRecords = records.slice(offset, offset + limit);

      const pagination: PaginationInfo = {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        hasNext: offset + limit < total,
        hasPrevious: offset > 0,
      };

      return {
        records: paginatedRecords,
        total,
        pagination,
      };
    } catch (error) {
      console.error('❌ Failed to get calculation history:', error);
      throw error;
    }
  }

  /**
   * Get a specific calculation record by ID
   */
  public async getCalculation(id: string): Promise<CalculationRecord | null> {
    try {
      const userHistory = this.getUserHistory();
      return userHistory.find(record => record.id === id) || null;
    } catch (error) {
      console.error('❌ Failed to get calculation:', error);
      throw error;
    }
  }

  /**
   * Delete a calculation from history
   */
  public async deleteCalculation(id: string): Promise<boolean> {
    try {
      const userHistory = this.getUserHistory();
      const index = userHistory.findIndex(record => record.id === id);
      
      if (index === -1) {
        return false;
      }

      userHistory.splice(index, 1);
      await this.saveToStorage();

      console.log(`🗑️ Calculation deleted from history: ${id}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete calculation:', error);
      throw error;
    }
  }

  /**
   * Clear all calculation history
   */
  public async clearHistory(): Promise<void> {
    try {
      this.cache.set(this.getUserId(), []);
      await this.saveToStorage();
      console.log('🧹 Calculation history cleared');
    } catch (error) {
      console.error('❌ Failed to clear history:', error);
      throw error;
    }
  }

  /**
   * Get history statistics (with caching)
   */
  @cached(10 * 60 * 1000, () => 'history-stats')
  public async getStats(): Promise<HistoryStats> {
    try {
      const records = this.getUserHistory();
      
      // Calculator usage stats
      const calculatorUsage: Record<string, number> = {};
      let totalExecutionTime = 0;
      const parameterUsage: Record<string, { count: number; total: number }> = {};
      const dailyUsage: Record<string, number> = {};

      records.forEach(record => {
        // Calculator usage
        calculatorUsage[record.calculatorType] = (calculatorUsage[record.calculatorType] || 0) + 1;
        
        // Execution time
        totalExecutionTime += record.metadata.executionTime || 0;
        
        // Parameter usage
        Object.entries(record.inputs).forEach(([param, value]) => {
          if (typeof value === 'number') {
            if (!parameterUsage[param]) {
              parameterUsage[param] = { count: 0, total: 0 };
            }
            parameterUsage[param].count++;
            parameterUsage[param].total += value;
          }
        });
        
        // Daily usage
        const date = new Date(record.timestamp).toISOString().split('T')[0];
        dailyUsage[date] = (dailyUsage[date] || 0) + 1;
      });

      // Most used parameters
      const mostUsedParameters = Object.entries(parameterUsage)
        .map(([parameter, usage]) => ({
          parameter,
          count: usage.count,
          averageValue: usage.total / usage.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Daily usage array
      const dailyUsageArray = Object.entries(dailyUsage)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalRecords: records.length,
        calculatorUsage,
        averageExecutionTime: records.length > 0 ? totalExecutionTime / records.length : 0,
        mostUsedParameters,
        dailyUsage: dailyUsageArray,
      };
    } catch (error) {
      console.error('❌ Failed to get history stats:', error);
      throw error;
    }
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private getUserId(): string {
    // In a real app, this would come from authentication
    return 'anonymous-user';
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('laser-calc-session-id');
    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem('laser-calc-session-id', sessionId);
    }
    return sessionId;
  }

  private getUserHistory(): CalculationRecord[] {
    const userId = this.getUserId();
    if (!this.cache.has(userId)) {
      this.cache.set(userId, []);
    }
    return this.cache.get(userId)!;
  }

  private applyFilters(records: CalculationRecord[], query: HistoryQuery): CalculationRecord[] {
    let filtered = [...records];

    // Filter by calculator type
    if (query.calculatorType) {
      filtered = filtered.filter(record => record.calculatorType === query.calculatorType);
    }

    // Filter by date range
    if (query.dateFrom) {
      filtered = filtered.filter(record => new Date(record.timestamp) >= query.dateFrom!);
    }
    if (query.dateTo) {
      filtered = filtered.filter(record => new Date(record.timestamp) <= query.dateTo!);
    }

    // Filter by search term
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filtered = filtered.filter(record => 
        record.calculatorName.toLowerCase().includes(searchTerm) ||
        record.calculatorType.toLowerCase().includes(searchTerm) ||
        JSON.stringify(record.inputs).toLowerCase().includes(searchTerm) ||
        JSON.stringify(record.outputs).toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    const sortBy = query.sortBy || 'timestamp';
    const sortOrder = query.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'calculatorType':
          aValue = a.calculatorType;
          bValue = b.calculatorType;
          break;
        case 'executionTime':
          aValue = a.metadata.executionTime || 0;
          bValue = b.metadata.executionTime || 0;
          break;
        default:
          aValue = a.timestamp;
          bValue = b.timestamp;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load history from storage:', error);
      this.cache = new Map();
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      const data = Object.fromEntries(this.cache.entries());
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save history to storage:', error);
      throw error;
    }
  }

  private scheduleCleanup(): void {
    // Run cleanup every hour
    setInterval(() => {
      this.performCleanup();
    }, 60 * 60 * 1000);
  }

  private performCleanup(): void {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.autoCleanupDays);

      for (const [userId, records] of this.cache.entries()) {
        const filteredRecords = records.filter(record => 
          new Date(record.timestamp) > cutoffDate
        );
        
        if (filteredRecords.length !== records.length) {
          this.cache.set(userId, filteredRecords);
          console.log(`🧹 Cleaned up ${records.length - filteredRecords.length} old records for user ${userId}`);
        }
      }

      this.saveToStorage();
    } catch (error) {
      console.error('Failed to perform cleanup:', error);
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const calculationHistoryService = new CalculationHistoryService();

// Auto-initialize when imported
calculationHistoryService.initialize().catch(console.error);
