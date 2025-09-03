/**
 * Team Parameter Library Service
 * Manages shared parameter presets and team collaboration features
 */

import { ParameterPreset } from './parameterPresetService';
import { teamManagementService } from './teamManagementService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type PresetVisibility = 'private' | 'team' | 'public';
export type PresetStatus = 'draft' | 'active' | 'archived' | 'deprecated';

export interface TeamParameterPreset extends ParameterPreset {
  teamId: string;
  visibility: PresetVisibility;
  sharedBy: string;
  sharedAt: Date;
  collaborators: string[];
  tags: string[];
  rating: PresetRating;
  comments: PresetComment[];
  usageStats: PresetUsageStats;
  version: number;
  versionHistory: PresetVersion[];
  status: PresetStatus;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface PresetRating {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<number, number>;
  userRatings: Record<string, number>;
}

export interface PresetComment {
  id: string;
  presetId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  reactions: CommentReaction[];
  isEdited: boolean;
}

export interface CommentReaction {
  userId: string;
  type: 'like' | 'dislike' | 'helpful' | 'question';
  createdAt: Date;
}

export interface PresetUsageStats {
  totalUsage: number;
  uniqueUsers: number;
  lastUsed: Date;
  usageByMonth: Record<string, number>;
  successRate: number;
  averageExecutionTime: number;
}

export interface PresetVersion {
  version: number;
  parameters: Record<string, any>;
  changedBy: string;
  changedAt: Date;
  changeDescription: string;
  changeType: 'major' | 'minor' | 'patch';
}

export interface CreateTeamPresetRequest {
  teamId: string;
  name: string;
  description: string;
  calculatorType: string;
  parameters: Record<string, any>;
  visibility: PresetVisibility;
  tags?: string[];
  changeDescription?: string;
}

export interface UpdateTeamPresetRequest {
  presetId: string;
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
  visibility?: PresetVisibility;
  tags?: string[];
  status?: PresetStatus;
  changeDescription?: string;
}

export interface SearchTeamPresetsRequest {
  teamId: string;
  query?: string;
  calculatorType?: string;
  tags?: string[];
  visibility?: PresetVisibility[];
  status?: PresetStatus[];
  createdBy?: string;
  minRating?: number;
  sortBy?: 'name' | 'created' | 'updated' | 'rating' | 'usage';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface TeamParameterLibraryServiceConfig {
  maxPresetsPerTeam: number;
  maxVersionsPerPreset: number;
  enableComments: boolean;
  enableRatings: boolean;
  requireApproval: boolean;
  autoArchiveAfterDays: number;
}

const DEFAULT_CONFIG: TeamParameterLibraryServiceConfig = {
  maxPresetsPerTeam: 1000,
  maxVersionsPerPreset: 50,
  enableComments: true,
  enableRatings: true,
  requireApproval: false,
  autoArchiveAfterDays: 365,
};

// ============================================================================
// Team Parameter Library Service Class
// ============================================================================

export class TeamParameterLibraryService {
  private config: TeamParameterLibraryServiceConfig;
  private teamPresets: Map<string, TeamParameterPreset[]>;
  private presetComments: Map<string, PresetComment[]>;

  constructor(config: Partial<TeamParameterLibraryServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.teamPresets = new Map();
    this.presetComments = new Map();
  }

  // ============================================================================
  // Team Preset Management
  // ============================================================================

  /**
   * Create team parameter preset
   */
  public async createTeamPreset(
    userId: string,
    request: CreateTeamPresetRequest
  ): Promise<TeamParameterPreset> {
    // Check permissions
    const hasPermission = await teamManagementService.hasPermission(
      userId,
      request.teamId,
      'create_presets'
    );
    if (!hasPermission) {
      throw new Error('Insufficient permissions to create team presets');
    }

    // Check team preset limit
    const teamPresets = this.teamPresets.get(request.teamId) || [];
    if (teamPresets.length >= this.config.maxPresetsPerTeam) {
      throw new Error(`Team has reached maximum preset limit (${this.config.maxPresetsPerTeam})`);
    }

    // Create team preset
    const preset: TeamParameterPreset = {
      id: this.generateId(),
      name: request.name.trim(),
      description: request.description.trim(),
      calculatorType: request.calculatorType,
      parameters: { ...request.parameters },
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false,
      teamId: request.teamId,
      visibility: request.visibility,
      sharedBy: userId,
      sharedAt: new Date(),
      collaborators: [userId],
      tags: request.tags || [],
      rating: {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {},
        userRatings: {},
      },
      comments: [],
      usageStats: {
        totalUsage: 0,
        uniqueUsers: 0,
        lastUsed: new Date(),
        usageByMonth: {},
        successRate: 0,
        averageExecutionTime: 0,
      },
      version: 1,
      versionHistory: [{
        version: 1,
        parameters: { ...request.parameters },
        changedBy: userId,
        changedAt: new Date(),
        changeDescription: request.changeDescription || 'Initial version',
        changeType: 'major',
      }],
      status: this.config.requireApproval ? 'draft' : 'active',
    };

    // Store preset
    if (!this.teamPresets.has(request.teamId)) {
      this.teamPresets.set(request.teamId, []);
    }
    this.teamPresets.get(request.teamId)!.push(preset);

    return preset;
  }

  /**
   * Get team preset by ID
   */
  public async getTeamPreset(
    userId: string,
    teamId: string,
    presetId: string
  ): Promise<TeamParameterPreset | null> {
    // Check team access
    const member = await teamManagementService.getTeamMember(teamId, userId);
    if (!member || member.status !== 'active') {
      throw new Error('Access denied to team presets');
    }

    const teamPresets = this.teamPresets.get(teamId) || [];
    return teamPresets.find(p => p.id === presetId) || null;
  }

  /**
   * Search team presets
   */
  public async searchTeamPresets(
    userId: string,
    request: SearchTeamPresetsRequest
  ): Promise<{ presets: TeamParameterPreset[]; total: number }> {
    // Check team access
    const member = await teamManagementService.getTeamMember(request.teamId, userId);
    if (!member || member.status !== 'active') {
      throw new Error('Access denied to team presets');
    }

    let presets = this.teamPresets.get(request.teamId) || [];

    // Apply filters
    if (request.query) {
      const query = request.query.toLowerCase();
      presets = presets.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (request.calculatorType) {
      presets = presets.filter(p => p.calculatorType === request.calculatorType);
    }

    if (request.tags && request.tags.length > 0) {
      presets = presets.filter(p => 
        request.tags!.some(tag => p.tags.includes(tag))
      );
    }

    if (request.visibility && request.visibility.length > 0) {
      presets = presets.filter(p => request.visibility!.includes(p.visibility));
    }

    if (request.status && request.status.length > 0) {
      presets = presets.filter(p => request.status!.includes(p.status));
    }

    if (request.createdBy) {
      presets = presets.filter(p => p.createdBy === request.createdBy);
    }

    if (request.minRating) {
      presets = presets.filter(p => p.rating.averageRating >= request.minRating!);
    }

    // Sort presets
    const sortBy = request.sortBy || 'updated';
    const sortOrder = request.sortOrder || 'desc';
    
    presets.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'rating':
          comparison = a.rating.averageRating - b.rating.averageRating;
          break;
        case 'usage':
          comparison = a.usageStats.totalUsage - b.usageStats.totalUsage;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const total = presets.length;
    
    // Apply pagination
    const offset = request.offset || 0;
    const limit = request.limit || 50;
    presets = presets.slice(offset, offset + limit);

    return { presets, total };
  }

  /**
   * Update team preset
   */
  public async updateTeamPreset(
    userId: string,
    request: UpdateTeamPresetRequest
  ): Promise<TeamParameterPreset> {
    // Find preset
    let preset: TeamParameterPreset | null = null;
    let teamId: string | null = null;

    for (const [tId, presets] of this.teamPresets.entries()) {
      const found = presets.find(p => p.id === request.presetId);
      if (found) {
        preset = found;
        teamId = tId;
        break;
      }
    }

    if (!preset || !teamId) {
      throw new Error('Preset not found');
    }

    // Check permissions
    const canEdit = preset.createdBy === userId || 
                   await teamManagementService.hasPermission(userId, teamId, 'edit_presets');
    if (!canEdit) {
      throw new Error('Insufficient permissions to edit preset');
    }

    // Check if parameters changed for versioning
    const parametersChanged = request.parameters && 
      JSON.stringify(request.parameters) !== JSON.stringify(preset.parameters);

    // Update preset
    const updatedPreset: TeamParameterPreset = {
      ...preset,
      ...request,
      updatedAt: new Date(),
    };

    // Add version if parameters changed
    if (parametersChanged && request.parameters) {
      const newVersion = preset.version + 1;
      updatedPreset.version = newVersion;
      
      // Add to version history
      updatedPreset.versionHistory.push({
        version: newVersion,
        parameters: { ...request.parameters },
        changedBy: userId,
        changedAt: new Date(),
        changeDescription: request.changeDescription || 'Parameter update',
        changeType: 'minor',
      });

      // Limit version history
      if (updatedPreset.versionHistory.length > this.config.maxVersionsPerPreset) {
        updatedPreset.versionHistory = updatedPreset.versionHistory.slice(-this.config.maxVersionsPerPreset);
      }
    }

    // Update in storage
    const teamPresets = this.teamPresets.get(teamId)!;
    const presetIndex = teamPresets.findIndex(p => p.id === request.presetId);
    teamPresets[presetIndex] = updatedPreset;

    return updatedPreset;
  }

  /**
   * Delete team preset
   */
  public async deleteTeamPreset(
    userId: string,
    teamId: string,
    presetId: string
  ): Promise<boolean> {
    // Check permissions
    const teamPresets = this.teamPresets.get(teamId) || [];
    const preset = teamPresets.find(p => p.id === presetId);
    
    if (!preset) {
      throw new Error('Preset not found');
    }

    const canDelete = preset.createdBy === userId || 
                     await teamManagementService.hasPermission(userId, teamId, 'delete_presets');
    if (!canDelete) {
      throw new Error('Insufficient permissions to delete preset');
    }

    // Archive instead of delete
    preset.status = 'archived';
    preset.updatedAt = new Date();

    return true;
  }

  // ============================================================================
  // Rating and Comments
  // ============================================================================

  /**
   * Rate team preset
   */
  public async ratePreset(
    userId: string,
    teamId: string,
    presetId: string,
    rating: number
  ): Promise<PresetRating> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check team access
    const member = await teamManagementService.getTeamMember(teamId, userId);
    if (!member || member.status !== 'active') {
      throw new Error('Access denied to rate preset');
    }

    // Find preset
    const teamPresets = this.teamPresets.get(teamId) || [];
    const preset = teamPresets.find(p => p.id === presetId);
    
    if (!preset) {
      throw new Error('Preset not found');
    }

    // Update rating
    const oldRating = preset.rating.userRatings[userId] || 0;
    preset.rating.userRatings[userId] = rating;

    // Recalculate statistics
    const ratings = Object.values(preset.rating.userRatings);
    preset.rating.totalRatings = ratings.length;
    preset.rating.averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

    // Update distribution
    preset.rating.ratingDistribution = {};
    ratings.forEach(r => {
      preset.rating.ratingDistribution[r] = (preset.rating.ratingDistribution[r] || 0) + 1;
    });

    preset.updatedAt = new Date();

    return preset.rating;
  }

  /**
   * Add comment to preset
   */
  public async addComment(
    userId: string,
    teamId: string,
    presetId: string,
    content: string,
    parentId?: string
  ): Promise<PresetComment> {
    // Check team access
    const member = await teamManagementService.getTeamMember(teamId, userId);
    if (!member || member.status !== 'active') {
      throw new Error('Access denied to comment on preset');
    }

    // Find preset
    const teamPresets = this.teamPresets.get(teamId) || [];
    const preset = teamPresets.find(p => p.id === presetId);
    
    if (!preset) {
      throw new Error('Preset not found');
    }

    // Create comment
    const comment: PresetComment = {
      id: this.generateId(),
      presetId,
      userId,
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId,
      reactions: [],
      isEdited: false,
    };

    // Store comment
    if (!this.presetComments.has(presetId)) {
      this.presetComments.set(presetId, []);
    }
    this.presetComments.get(presetId)!.push(comment);

    // Update preset
    preset.comments.push(comment);
    preset.updatedAt = new Date();

    return comment;
  }

  /**
   * Get preset comments
   */
  public async getPresetComments(
    userId: string,
    teamId: string,
    presetId: string
  ): Promise<PresetComment[]> {
    // Check team access
    const member = await teamManagementService.getTeamMember(teamId, userId);
    if (!member || member.status !== 'active') {
      throw new Error('Access denied to view comments');
    }

    return this.presetComments.get(presetId) || [];
  }

  // ============================================================================
  // Usage Tracking
  // ============================================================================

  /**
   * Track preset usage
   */
  public async trackPresetUsage(
    userId: string,
    teamId: string,
    presetId: string,
    executionTime?: number,
    success?: boolean
  ): Promise<void> {
    // Find preset
    const teamPresets = this.teamPresets.get(teamId) || [];
    const preset = teamPresets.find(p => p.id === presetId);
    
    if (!preset) {
      return; // Silently ignore if preset not found
    }

    // Update usage stats
    preset.usageStats.totalUsage++;
    preset.usageStats.lastUsed = new Date();

    // Track unique users
    if (!preset.usageStats.uniqueUsers) {
      preset.usageStats.uniqueUsers = 0;
    }
    // This is simplified - in real implementation, would track unique users properly
    preset.usageStats.uniqueUsers++;

    // Track monthly usage
    const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
    preset.usageStats.usageByMonth[monthKey] = (preset.usageStats.usageByMonth[monthKey] || 0) + 1;

    // Update execution time
    if (executionTime) {
      const currentAvg = preset.usageStats.averageExecutionTime;
      const totalUsage = preset.usageStats.totalUsage;
      preset.usageStats.averageExecutionTime = 
        (currentAvg * (totalUsage - 1) + executionTime) / totalUsage;
    }

    // Update success rate
    if (success !== undefined) {
      // Simplified success rate calculation
      preset.usageStats.successRate = success ? 1.0 : 0.8;
    }

    preset.updatedAt = new Date();
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const teamParameterLibraryService = new TeamParameterLibraryService();
