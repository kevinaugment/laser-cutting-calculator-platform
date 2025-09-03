/**
 * Memory API Mock Service
 * Mock implementation for development and testing
 */

import { 
  CalculationRecord, 
  ParameterPreset, 
  UserPreferences,
  HistoryQuery,
  PresetQuery,
  HistoryStats,
  PresetStats
} from '../types/memory';
import { ApiResponse, PaginatedResponse } from './memoryApi';
import { calculationHistoryService } from '../services/calculationHistoryService';
import { parameterPresetService } from '../services/parameterPresetService';
import { userPreferencesService } from '../services/userPreferencesService';

// ============================================================================
// Mock API Implementation
// ============================================================================

export class MemoryApiMock {
  private delay: number;

  constructor(delay: number = 100) {
    this.delay = delay;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private async mockDelay(): Promise<void> {
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    };
  }

  private createErrorResponse(error: string): ApiResponse {
    return {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      requestId: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    };
  }

  // ============================================================================
  // Calculation History API Mock
  // ============================================================================

  public async saveCalculation(
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, any>,
    outputs: Record<string, any>,
    context?: any
  ): Promise<ApiResponse<{ id: string }>> {
    await this.mockDelay();

    try {
      const id = await calculationHistoryService.saveCalculation(
        calculatorType,
        calculatorName,
        inputs,
        outputs,
        context
      );

      return this.createSuccessResponse({ id });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to save calculation');
    }
  }

  public async getHistory(query?: HistoryQuery): Promise<ApiResponse<any>> {
    await this.mockDelay();

    try {
      const result = await calculationHistoryService.getHistory(query);
      
      return this.createSuccessResponse({
        records: result.records,
        total: result.total,
        pagination: result.pagination,
      });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get history');
    }
  }

  public async getCalculation(id: string): Promise<ApiResponse<CalculationRecord>> {
    await this.mockDelay();

    try {
      const record = await calculationHistoryService.getCalculation(id);
      
      if (!record) {
        return this.createErrorResponse('Calculation not found');
      }

      return this.createSuccessResponse(record);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get calculation');
    }
  }

  public async deleteCalculation(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.mockDelay();

    try {
      const deleted = await calculationHistoryService.deleteCalculation(id);
      return this.createSuccessResponse({ deleted });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to delete calculation');
    }
  }

  public async clearHistory(): Promise<ApiResponse<{ cleared: boolean }>> {
    await this.mockDelay();

    try {
      await calculationHistoryService.clearHistory();
      return this.createSuccessResponse({ cleared: true });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to clear history');
    }
  }

  public async getHistoryStats(): Promise<ApiResponse<HistoryStats>> {
    await this.mockDelay();

    try {
      const stats = await calculationHistoryService.getStats();
      return this.createSuccessResponse(stats);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get history stats');
    }
  }

  // ============================================================================
  // Parameter Presets API Mock
  // ============================================================================

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
    await this.mockDelay();

    try {
      const id = await parameterPresetService.createPreset(
        name,
        description,
        calculatorType,
        parameters,
        options
      );

      return this.createSuccessResponse({ id });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to create preset');
    }
  }

  public async getPresets(query?: PresetQuery): Promise<ApiResponse<PaginatedResponse<ParameterPreset>>> {
    await this.mockDelay();

    try {
      const result = await parameterPresetService.getPresets(query);
      
      const response: PaginatedResponse<ParameterPreset> = {
        items: result.presets,
        total: result.total,
        page: Math.floor((query?.offset || 0) / (query?.limit || 20)) + 1,
        limit: query?.limit || 20,
        hasNext: result.hasMore,
        hasPrevious: (query?.offset || 0) > 0,
      };

      return this.createSuccessResponse(response);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get presets');
    }
  }

  public async getPreset(id: string): Promise<ApiResponse<ParameterPreset>> {
    await this.mockDelay();

    try {
      const preset = await parameterPresetService.getPreset(id);
      
      if (!preset) {
        return this.createErrorResponse('Preset not found');
      }

      return this.createSuccessResponse(preset);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get preset');
    }
  }

  public async updatePreset(
    id: string,
    updates: Partial<ParameterPreset>
  ): Promise<ApiResponse<ParameterPreset>> {
    await this.mockDelay();

    try {
      const success = await parameterPresetService.updatePreset(id, updates);
      
      if (!success) {
        return this.createErrorResponse('Preset not found');
      }

      const updatedPreset = await parameterPresetService.getPreset(id);
      return this.createSuccessResponse(updatedPreset!);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to update preset');
    }
  }

  public async deletePreset(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.mockDelay();

    try {
      const deleted = await parameterPresetService.deletePreset(id);
      return this.createSuccessResponse({ deleted });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to delete preset');
    }
  }

  public async usePreset(id: string): Promise<ApiResponse<ParameterPreset>> {
    await this.mockDelay();

    try {
      const preset = await parameterPresetService.usePreset(id);
      
      if (!preset) {
        return this.createErrorResponse('Preset not found');
      }

      return this.createSuccessResponse(preset);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to use preset');
    }
  }

  public async ratePreset(id: string, rating: number): Promise<ApiResponse<ParameterPreset>> {
    await this.mockDelay();

    try {
      const success = await parameterPresetService.ratePreset(id, rating);
      
      if (!success) {
        return this.createErrorResponse('Preset not found');
      }

      const updatedPreset = await parameterPresetService.getPreset(id);
      return this.createSuccessResponse(updatedPreset!);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to rate preset');
    }
  }

  public async getPresetStats(): Promise<ApiResponse<PresetStats>> {
    await this.mockDelay();

    try {
      const stats = await parameterPresetService.getStats();
      return this.createSuccessResponse(stats);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get preset stats');
    }
  }

  // ============================================================================
  // User Preferences API Mock
  // ============================================================================

  public async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    await this.mockDelay();

    try {
      const preferences = userPreferencesService.getPreferences();
      return this.createSuccessResponse(preferences);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get preferences');
    }
  }

  public async updatePreferences(
    updates: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    await this.mockDelay();

    try {
      await userPreferencesService.updatePreferences(updates);
      const preferences = userPreferencesService.getPreferences();
      return this.createSuccessResponse(preferences);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to update preferences');
    }
  }

  public async resetPreferences(): Promise<ApiResponse<UserPreferences>> {
    await this.mockDelay();

    try {
      await userPreferencesService.resetPreferences();
      const preferences = userPreferencesService.getPreferences();
      return this.createSuccessResponse(preferences);
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to reset preferences');
    }
  }

  // ============================================================================
  // Search API Mock
  // ============================================================================

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
    await this.mockDelay();

    try {
      let history: CalculationRecord[] = [];
      let presets: ParameterPreset[] = [];

      if (!filters?.type || filters.type === 'history' || filters.type === 'all') {
        const historyResult = await calculationHistoryService.getHistory({
          search: query,
          calculatorType: filters?.calculatorType,
          dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
          dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
        });
        history = historyResult.records;
      }

      if (!filters?.type || filters.type === 'presets' || filters.type === 'all') {
        const presetsResult = await parameterPresetService.getPresets({
          search: query,
          calculatorType: filters?.calculatorType,
        });
        presets = presetsResult.presets;
      }

      return this.createSuccessResponse({
        history,
        presets,
        total: history.length + presets.length,
      });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Search failed');
    }
  }

  // ============================================================================
  // Bulk Operations API Mock
  // ============================================================================

  public async exportData(
    options?: {
      includeHistory?: boolean;
      includePresets?: boolean;
      includePreferences?: boolean;
      format?: 'json' | 'csv';
    }
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    await this.mockDelay();

    try {
      // In a real implementation, this would generate a file and return a download URL
      // For mock purposes, we'll just return a mock URL
      const mockUrl = `data:application/json;base64,${btoa(JSON.stringify({
        exported: true,
        timestamp: new Date().toISOString(),
        options,
      }))}`;

      return this.createSuccessResponse({ downloadUrl: mockUrl });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Export failed');
    }
  }

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
    await this.mockDelay();

    try {
      // Mock import process
      return this.createSuccessResponse({
        imported: 10,
        skipped: 2,
        errors: ['Invalid record format in line 5'],
      });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Import failed');
    }
  }

  // ============================================================================
  // Pattern Recognition API Mock
  // ============================================================================

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
    await this.mockDelay();

    try {
      const { patternRecognitionService } = await import('../services/patternRecognitionService');
      const patterns = await patternRecognitionService.analyzeUserPatterns(userId || 'anonymous-user');

      // Filter by pattern types if specified
      let filteredPatterns = patterns;
      if (options?.patternTypes && options.patternTypes.length > 0) {
        filteredPatterns = patterns.filter(p => options.patternTypes!.includes(p.type));
      }

      // Filter by confidence if specified
      if (options?.minConfidence) {
        filteredPatterns = filteredPatterns.filter(p => p.confidence >= options.minConfidence!);
      }

      return this.createSuccessResponse({
        patterns: filteredPatterns,
        analysisTimestamp: new Date().toISOString(),
        totalPatterns: filteredPatterns.length,
      });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Pattern analysis failed');
    }
  }

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
    await this.mockDelay();

    try {
      const { patternRecognitionService } = await import('../services/patternRecognitionService');
      let patterns = await patternRecognitionService.getPatternsByType(
        patternType as any,
        userId || 'anonymous-user'
      );

      // Filter by confidence if specified
      if (options?.minConfidence) {
        patterns = patterns.filter(p => p.confidence >= options.minConfidence!);
      }

      // Apply limit if specified
      if (options?.limit) {
        patterns = patterns.slice(0, options.limit);
      }

      return this.createSuccessResponse({
        patterns,
        total: patterns.length,
      });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get patterns by type');
    }
  }

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
    await this.mockDelay();

    try {
      const { patternRecognitionService } = await import('../services/patternRecognitionService');
      const patterns = await patternRecognitionService.analyzeUserPatterns(userId || 'anonymous-user');

      // Generate insights from patterns
      const insights = patterns.map(pattern => ({
        id: pattern.id,
        type: pattern.type,
        confidence: pattern.confidence,
        description: pattern.description,
        recommendation: this.generateRecommendation(pattern),
        priority: this.calculatePriority(pattern),
      }));

      // Categorize insights
      const categories = {
        optimization: insights.filter(i => ['parameter-frequency', 'parameter-combination', 'parameter-correlation'].includes(i.type)),
        workflow: insights.filter(i => ['behavior-sequence', 'time-activity', 'usage-evolution'].includes(i.type)),
        quality: insights.filter(i => ['anomaly-detection'].includes(i.type)),
        usage: insights.filter(i => ['calculator-usage'].includes(i.type)),
      };

      // Filter categories if specified
      let filteredCategories = categories;
      if (options?.categories && options.categories.length > 0) {
        filteredCategories = {};
        options.categories.forEach(cat => {
          if (categories[cat as keyof typeof categories]) {
            filteredCategories[cat] = categories[cat as keyof typeof categories];
          }
        });
      }

      // Get anomalies
      const anomalies = insights.filter(i => i.type === 'anomaly-detection');

      // Apply limit if specified
      let limitedInsights = insights;
      if (options?.limit) {
        limitedInsights = insights.slice(0, options.limit);
      }

      return this.createSuccessResponse({
        insights: limitedInsights,
        categories: filteredCategories,
        anomalies,
      });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get pattern insights');
    }
  }

  public async getPatternStats(
    userId?: string
  ): Promise<ApiResponse<{
    totalPatterns: number;
    patternsByType: Record<string, number>;
    averageConfidence: number;
    lastAnalysis: string;
  }>> {
    await this.mockDelay();

    try {
      const { patternRecognitionService } = await import('../services/patternRecognitionService');
      const patterns = await patternRecognitionService.analyzeUserPatterns(userId || 'anonymous-user');

      // Calculate statistics
      const patternsByType: Record<string, number> = {};
      patterns.forEach(pattern => {
        patternsByType[pattern.type] = (patternsByType[pattern.type] || 0) + 1;
      });

      const averageConfidence = patterns.length > 0
        ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
        : 0;

      return this.createSuccessResponse({
        totalPatterns: patterns.length,
        patternsByType,
        averageConfidence,
        lastAnalysis: new Date().toISOString(),
      });
    } catch (error) {
      return this.createErrorResponse(error instanceof Error ? error.message : 'Failed to get pattern stats');
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private generateRecommendation(pattern: any): string {
    switch (pattern.type) {
      case 'parameter-frequency':
        return `Consider creating a preset for frequently used parameter: ${pattern.data.parameter}`;
      case 'calculator-usage':
        return `${pattern.data.calculatorType} is your most used calculator - consider bookmarking it`;
      case 'time-activity':
        return `You're most active during ${pattern.data.timeSlot} - schedule complex calculations then`;
      case 'parameter-combination':
        return `This parameter combination works well - consider saving as a preset`;
      case 'behavior-sequence':
        return `You often use calculators in sequence: ${pattern.data.sequence.join(' → ')} - consider creating a workflow`;
      case 'anomaly-detection':
        return pattern.data.suggestedAction;
      case 'parameter-correlation':
        return `Parameters ${pattern.data.parameterA} and ${pattern.data.parameterB} are correlated - adjust them together`;
      case 'usage-evolution':
        return `Your usage is ${pattern.data.trend} - ${pattern.data.trend === 'increasing' ? 'consider upgrading your plan' : 'optimize your workflow'}`;
      default:
        return 'Pattern detected - consider optimizing your workflow';
    }
  }

  private calculatePriority(pattern: any): number {
    const typeWeights = {
      'parameter-frequency': 0.8,
      'calculator-usage': 0.9,
      'time-activity': 0.6,
      'parameter-combination': 0.7,
      'behavior-sequence': 0.5,
      'anomaly-detection': 1.0,
      'parameter-correlation': 0.6,
      'usage-evolution': 0.4,
    };

    const typeWeight = typeWeights[pattern.type as keyof typeof typeWeights] || 0.5;

    // Boost priority for high-severity anomalies
    let severityBoost = 1.0;
    if (pattern.type === 'anomaly-detection' && pattern.data.severity === 'high') {
      severityBoost = 1.5;
    }

    return pattern.confidence * typeWeight * severityBoost;
  }
}

// ============================================================================
// Mock Instance
// ============================================================================

export const memoryApiMock = new MemoryApiMock();

// ============================================================================
// Development Mode Switch
// ============================================================================

const isDevelopment = process.env.NODE_ENV === 'development';
const useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true' || isDevelopment;

export const memoryApiClient = useMockApi ? memoryApiMock : null;
