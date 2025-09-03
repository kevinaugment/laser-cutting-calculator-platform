/**
 * Parameter Preset Service
 * Manages parameter presets for quick access and sharing
 */

import { ParameterPreset, PresetCategory, PresetVisibility, PresetUsageStats, PresetValidation } from '../types/memory';
import { generateId } from '../utils/idGenerator';

// ============================================================================
// Service Configuration
// ============================================================================

export interface PresetServiceConfig {
  maxPresets: number;
  autoCleanupDays: number;
  storageKey: string;
  enableSharing: boolean;
  enableValidation: boolean;
}

const DEFAULT_CONFIG: PresetServiceConfig = {
  maxPresets: 100,
  autoCleanupDays: 365,
  storageKey: 'laser-calc-presets',
  enableSharing: true,
  enableValidation: true,
};

// ============================================================================
// Preset Query Types
// ============================================================================

export interface PresetQuery {
  calculatorType?: string;
  category?: PresetCategory;
  visibility?: string; // scope from PresetVisibility
  search?: string;
  tags?: string[];
  createdBy?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'createdAt' | 'usageCount' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface PresetStats {
  totalPresets: number;
  categoryDistribution: Record<PresetCategory, number>;
  calculatorUsage: Record<string, number>;
  averageRating: number;
  mostUsedPresets: Array<{
    id: string;
    name: string;
    usageCount: number;
  }>;
  recentPresets: ParameterPreset[];
}

// ============================================================================
// Parameter Preset Service
// ============================================================================

export class ParameterPresetService {
  private config: PresetServiceConfig;
  private presets: Map<string, ParameterPreset[]> = new Map();
  private listeners: Set<(presets: ParameterPreset[]) => void> = new Set();
  private isInitialized = false;

  constructor(config?: Partial<PresetServiceConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load presets from storage
      await this.loadFromStorage();
      
      // Setup cleanup scheduler
      this.scheduleCleanup();
      
      this.isInitialized = true;
      console.log('✅ Parameter Preset Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Parameter Preset Service:', error);
      throw error;
    }
  }

  // ============================================================================
  // Core Preset Operations
  // ============================================================================

  /**
   * Create a new parameter preset
   */
  public async createPreset(
    name: string,
    description: string,
    calculatorType: string,
    parameters: Record<string, any>,
    options?: {
      category?: PresetCategory;
      visibility?: string;
      tags?: string[];
    }
  ): Promise<string> {
    try {
      // Validate parameters if enabled
      if (this.config.enableValidation) {
        this.validateParameters(calculatorType, parameters);
      }

      const preset: ParameterPreset = {
        id: generateId('preset'),
        name: name.trim(),
        description: description.trim(),
        calculatorType,
        parameters: { ...parameters },
        category: options?.category || 'custom',
        visibility: {
          scope: (options?.visibility as any) || 'private',
          sharedWith: [],
          permissions: {
            canView: [this.getUserId()],
            canUse: [this.getUserId()],
            canEdit: [this.getUserId()],
            canShare: [this.getUserId()],
            canDelete: [this.getUserId()],
          },
        },
        tags: options?.tags || [],
        createdBy: this.getUserId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        usageStats: {
          totalUses: 0,
          lastUsed: undefined,
          averageRating: 0,
          ratingCount: 0,
          successRate: 0,
          userFeedback: [],
        },
        validation: {
          isValid: true,
          errors: [],
          warnings: [],
          lastValidated: new Date(),
        },
      };

      // Add to user's presets
      const userPresets = this.getUserPresets();
      userPresets.unshift(preset);

      // Enforce max presets limit
      if (userPresets.length > this.config.maxPresets) {
        userPresets.splice(this.config.maxPresets);
      }

      // Save to storage
      await this.saveToStorage();

      // Notify listeners
      this.notifyListeners();

      console.log(`📋 Preset created: ${name} (${preset.id})`);
      return preset.id;
    } catch (error) {
      console.error('❌ Failed to create preset:', error);
      throw error;
    }
  }

  /**
   * Get presets with optional filtering
   */
  public async getPresets(query?: PresetQuery): Promise<{
    presets: ParameterPreset[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      let allPresets = this.getUserPresets();

      // Apply filters
      if (query) {
        allPresets = this.applyFilters(allPresets, query);
      }

      const total = allPresets.length;
      const limit = query?.limit || 20;
      const offset = query?.offset || 0;

      // Apply pagination
      const paginatedPresets = allPresets.slice(offset, offset + limit);

      return {
        presets: paginatedPresets,
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      console.error('❌ Failed to get presets:', error);
      throw error;
    }
  }

  /**
   * Get a specific preset by ID
   */
  public async getPreset(id: string): Promise<ParameterPreset | null> {
    try {
      const userPresets = this.getUserPresets();
      return userPresets.find(preset => preset.id === id) || null;
    } catch (error) {
      console.error('❌ Failed to get preset:', error);
      throw error;
    }
  }

  /**
   * Update an existing preset
   */
  public async updatePreset(
    id: string,
    updates: Partial<Pick<ParameterPreset, 'name' | 'description' | 'parameters' | 'category' | 'tags'>>
  ): Promise<boolean> {
    try {
      const userPresets = this.getUserPresets();
      const index = userPresets.findIndex(preset => preset.id === id);
      
      if (index === -1) {
        return false;
      }

      // Validate parameters if being updated
      if (updates.parameters && this.config.enableValidation) {
        this.validateParameters(userPresets[index].calculatorType, updates.parameters);
      }

      // Apply updates
      userPresets[index] = {
        ...userPresets[index],
        ...updates,
        updatedAt: new Date(),
      };

      // Save to storage
      await this.saveToStorage();

      // Notify listeners
      this.notifyListeners();

      console.log(`📝 Preset updated: ${id}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update preset:', error);
      throw error;
    }
  }

  /**
   * Delete a preset
   */
  public async deletePreset(id: string): Promise<boolean> {
    try {
      const userPresets = this.getUserPresets();
      const index = userPresets.findIndex(preset => preset.id === id);
      
      if (index === -1) {
        return false;
      }

      userPresets.splice(index, 1);
      await this.saveToStorage();

      // Notify listeners
      this.notifyListeners();

      console.log(`🗑️ Preset deleted: ${id}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete preset:', error);
      throw error;
    }
  }

  /**
   * Use a preset (increment usage count)
   */
  public async usePreset(id: string): Promise<ParameterPreset | null> {
    try {
      const userPresets = this.getUserPresets();
      const preset = userPresets.find(p => p.id === id);
      
      if (!preset) {
        return null;
      }

      // Increment usage count
      preset.usageStats.totalUses++;
      preset.usageStats.lastUsed = new Date();

      await this.saveToStorage();
      this.notifyListeners();

      console.log(`🔄 Preset used: ${preset.name} (${preset.usageStats.totalUses} times)`);
      return { ...preset };
    } catch (error) {
      console.error('❌ Failed to use preset:', error);
      throw error;
    }
  }

  /**
   * Rate a preset
   */
  public async ratePreset(id: string, rating: number): Promise<boolean> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    try {
      const userPresets = this.getUserPresets();
      const preset = userPresets.find(p => p.id === id);
      
      if (!preset) {
        return false;
      }

      // Update rating (simple average for now)
      const totalRating = preset.usageStats.averageRating * preset.usageStats.ratingCount + rating;
      preset.usageStats.ratingCount++;
      preset.usageStats.averageRating = totalRating / preset.usageStats.ratingCount;

      await this.saveToStorage();
      this.notifyListeners();

      console.log(`⭐ Preset rated: ${preset.name} (${preset.usageStats.averageRating.toFixed(1)}/5)`);
      return true;
    } catch (error) {
      console.error('❌ Failed to rate preset:', error);
      throw error;
    }
  }

  /**
   * Duplicate a preset
   */
  public async duplicatePreset(id: string, newName?: string): Promise<string | null> {
    try {
      const originalPreset = await this.getPreset(id);
      if (!originalPreset) {
        return null;
      }

      const duplicatedId = await this.createPreset(
        newName || `${originalPreset.name} (Copy)`,
        originalPreset.description,
        originalPreset.calculatorType,
        originalPreset.parameters,
        {
          category: originalPreset.category,
          visibility: 'private', // Always make copies private
          tags: [...originalPreset.tags],
        }
      );

      return duplicatedId;
    } catch (error) {
      console.error('❌ Failed to duplicate preset:', error);
      throw error;
    }
  }

  /**
   * Get preset statistics
   */
  public async getStats(): Promise<PresetStats> {
    try {
      const userPresets = this.getUserPresets();
      
      // Category distribution
      const categoryDistribution: Record<PresetCategory, number> = {
        standard: 0,
        custom: 0,
        shared: 0,
        template: 0,
      };
      
      // Calculator usage
      const calculatorUsage: Record<string, number> = {};
      
      let totalRating = 0;
      let ratedPresets = 0;

      userPresets.forEach(preset => {
        // Category distribution
        categoryDistribution[preset.category]++;
        
        // Calculator usage
        calculatorUsage[preset.calculatorType] = (calculatorUsage[preset.calculatorType] || 0) + 1;
        
        // Rating calculation
        if (preset.usageStats.averageRating && preset.usageStats.averageRating > 0) {
          totalRating += preset.usageStats.averageRating;
          ratedPresets++;
        }
      });

      // Most used presets
      const mostUsedPresets = userPresets
        .filter(p => p.usageStats.totalUses > 0)
        .sort((a, b) => b.usageStats.totalUses - a.usageStats.totalUses)
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          name: p.name,
          usageCount: p.usageStats.totalUses,
        }));

      // Recent presets
      const recentPresets = userPresets
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      return {
        totalPresets: userPresets.length,
        categoryDistribution,
        calculatorUsage,
        averageRating: ratedPresets > 0 ? totalRating / ratedPresets : 0,
        mostUsedPresets,
        recentPresets,
      };
    } catch (error) {
      console.error('❌ Failed to get preset stats:', error);
      throw error;
    }
  }

  // ============================================================================
  // Event Listeners
  // ============================================================================

  /**
   * Subscribe to preset changes
   */
  public subscribe(listener: (presets: ParameterPreset[]) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of preset changes
   */
  private notifyListeners(): void {
    const userPresets = this.getUserPresets();
    this.listeners.forEach(listener => {
      try {
        listener([...userPresets]);
      } catch (error) {
        console.error('Error in preset listener:', error);
      }
    });
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private getUserId(): string {
    // In a real app, this would come from authentication
    return 'anonymous-user';
  }

  private getUserPresets(): ParameterPreset[] {
    const userId = this.getUserId();
    if (!this.presets.has(userId)) {
      this.presets.set(userId, []);
    }
    return this.presets.get(userId)!;
  }

  private applyFilters(presets: ParameterPreset[], query: PresetQuery): ParameterPreset[] {
    let filtered = [...presets];

    // Filter by calculator type
    if (query.calculatorType) {
      filtered = filtered.filter(preset => preset.calculatorType === query.calculatorType);
    }

    // Filter by category
    if (query.category) {
      filtered = filtered.filter(preset => preset.category === query.category);
    }

    // Filter by visibility
    if (query.visibility) {
      filtered = filtered.filter(preset => preset.visibility.scope === query.visibility);
    }

    // Filter by search term
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filtered = filtered.filter(preset => 
        preset.name.toLowerCase().includes(searchTerm) ||
        preset.description.toLowerCase().includes(searchTerm) ||
        preset.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      filtered = filtered.filter(preset =>
        query.tags!.some(tag => preset.tags.includes(tag))
      );
    }

    // Filter by creator
    if (query.createdBy) {
      filtered = filtered.filter(preset => preset.createdBy === query.createdBy);
    }

    // Apply sorting
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'usageCount':
          aValue = a.usageStats.totalUses;
          bValue = b.usageStats.totalUses;
          break;
        case 'rating':
          aValue = a.usageStats.averageRating || 0;
          bValue = b.usageStats.averageRating || 0;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }

  private validateParameters(calculatorType: string, parameters: Record<string, any>): void {
    // Basic validation - in a real app, this would be more sophisticated
    if (!parameters || Object.keys(parameters).length === 0) {
      throw new Error('Parameters cannot be empty');
    }

    // Check for required parameters based on calculator type
    // This would be expanded based on actual calculator requirements
    const requiredParams = this.getRequiredParameters(calculatorType);
    for (const param of requiredParams) {
      if (!(param in parameters)) {
        throw new Error(`Required parameter missing: ${param}`);
      }
    }
  }

  private getRequiredParameters(calculatorType: string): string[] {
    // This would be expanded based on actual calculator requirements
    const requirements: Record<string, string[]> = {
      'laser-cutting-cost': ['material', 'thickness', 'area'],
      'cutting-time': ['material', 'thickness', 'length'],
      'laser-parameter': ['power', 'speed', 'material'],
    };
    
    return requirements[calculatorType] || [];
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.presets = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Failed to load presets from storage:', error);
      this.presets = new Map();
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      const data = Object.fromEntries(this.presets.entries());
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save presets to storage:', error);
      throw error;
    }
  }

  private scheduleCleanup(): void {
    // Run cleanup every day
    setInterval(() => {
      this.performCleanup();
    }, 24 * 60 * 60 * 1000);
  }

  private performCleanup(): void {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.autoCleanupDays);

      for (const [userId, presets] of this.presets.entries()) {
        const filteredPresets = presets.filter(preset =>
          preset.createdAt > cutoffDate || preset.usageStats.totalUses > 0
        );
        
        if (filteredPresets.length !== presets.length) {
          this.presets.set(userId, filteredPresets);
          console.log(`🧹 Cleaned up ${presets.length - filteredPresets.length} old presets for user ${userId}`);
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

export const parameterPresetService = new ParameterPresetService();

// Auto-initialize when imported
parameterPresetService.initialize().catch(console.error);
