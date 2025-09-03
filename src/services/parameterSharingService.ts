/**
 * Parameter Sharing Service
 * Manages sharing of parameter presets between team members with permissions and notifications
 */

import { teamManagementService } from './teamManagementService';
import { teamParameterLibraryService, TeamParameterPreset } from './teamParameterLibraryService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type ShareScope = 'team' | 'public' | 'specific-users';
export type SharePermission = 'view' | 'edit' | 'admin';
export type ShareStatus = 'pending' | 'accepted' | 'declined' | 'revoked';
export type NotificationType = 'share-request' | 'share-accepted' | 'share-declined' | 'preset-updated' | 'preset-commented';

export interface ShareRequest {
  id: string;
  presetId: string;
  fromUserId: string;
  toUserId?: string;
  teamId?: string;
  scope: ShareScope;
  permission: SharePermission;
  message?: string;
  status: ShareStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface ShareLink {
  id: string;
  presetId: string;
  createdBy: string;
  token: string;
  scope: ShareScope;
  permission: SharePermission;
  allowedUsers?: string[];
  allowedTeams?: string[];
  expiresAt?: Date;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface ShareNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CreateShareRequestData {
  presetId: string;
  scope: ShareScope;
  permission: SharePermission;
  toUserId?: string;
  teamId?: string;
  message?: string;
  expiresAt?: Date;
}

export interface CreateShareLinkData {
  presetId: string;
  scope: ShareScope;
  permission: SharePermission;
  allowedUsers?: string[];
  allowedTeams?: string[];
  expiresAt?: Date;
  maxUses?: number;
}

export interface ShareActivity {
  id: string;
  presetId: string;
  userId: string;
  action: 'shared' | 'accessed' | 'edited' | 'commented' | 'rated';
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface ParameterSharingServiceConfig {
  maxSharesPerPreset: number;
  maxShareLinksPerUser: number;
  defaultLinkExpiryDays: number;
  enableNotifications: boolean;
  enableActivityTracking: boolean;
  maxNotificationRetention: number; // days
}

const DEFAULT_CONFIG: ParameterSharingServiceConfig = {
  maxSharesPerPreset: 100,
  maxShareLinksPerUser: 50,
  defaultLinkExpiryDays: 30,
  enableNotifications: true,
  enableActivityTracking: true,
  maxNotificationRetention: 90,
};

// ============================================================================
// Parameter Sharing Service Class
// ============================================================================

export class ParameterSharingService {
  private config: ParameterSharingServiceConfig;
  private shareRequests: Map<string, ShareRequest[]>;
  private shareLinks: Map<string, ShareLink>;
  private notifications: Map<string, ShareNotification[]>;
  private activities: Map<string, ShareActivity[]>;

  constructor(config: Partial<ParameterSharingServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.shareRequests = new Map();
    this.shareLinks = new Map();
    this.notifications = new Map();
    this.activities = new Map();
  }

  // ============================================================================
  // Share Request Management
  // ============================================================================

  /**
   * Create share request
   */
  public async createShareRequest(
    userId: string,
    data: CreateShareRequestData
  ): Promise<ShareRequest> {
    // Validate preset access
    const preset = await this.validatePresetAccess(userId, data.presetId);
    
    // Check sharing limits
    const existingShares = this.shareRequests.get(data.presetId) || [];
    if (existingShares.length >= this.config.maxSharesPerPreset) {
      throw new Error(`Maximum shares per preset (${this.config.maxSharesPerPreset}) reached`);
    }

    // Validate target user/team
    if (data.scope === 'specific-users' && !data.toUserId) {
      throw new Error('Target user required for specific user sharing');
    }
    if (data.scope === 'team' && !data.teamId) {
      throw new Error('Team ID required for team sharing');
    }

    // Create share request
    const shareRequest: ShareRequest = {
      id: this.generateId(),
      presetId: data.presetId,
      fromUserId: userId,
      toUserId: data.toUserId,
      teamId: data.teamId,
      scope: data.scope,
      permission: data.permission,
      message: data.message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: data.expiresAt,
    };

    // Store share request
    if (!this.shareRequests.has(data.presetId)) {
      this.shareRequests.set(data.presetId, []);
    }
    this.shareRequests.get(data.presetId)!.push(shareRequest);

    // Send notification
    if (this.config.enableNotifications) {
      await this.sendShareNotification(shareRequest);
    }

    // Track activity
    if (this.config.enableActivityTracking) {
      await this.trackActivity(data.presetId, userId, 'shared', {
        shareId: shareRequest.id,
        scope: data.scope,
        permission: data.permission,
      });
    }

    return shareRequest;
  }

  /**
   * Accept share request
   */
  public async acceptShareRequest(
    userId: string,
    shareRequestId: string
  ): Promise<ShareRequest> {
    const shareRequest = await this.getShareRequest(shareRequestId);
    if (!shareRequest) {
      throw new Error('Share request not found');
    }

    // Validate user can accept
    if (shareRequest.toUserId && shareRequest.toUserId !== userId) {
      throw new Error('Not authorized to accept this share request');
    }

    if (shareRequest.teamId) {
      const member = await teamManagementService.getTeamMember(shareRequest.teamId, userId);
      if (!member || member.status !== 'active') {
        throw new Error('Not a member of the target team');
      }
    }

    // Update status
    shareRequest.status = 'accepted';
    shareRequest.updatedAt = new Date();

    // Grant access to preset
    await this.grantPresetAccess(shareRequest);

    // Send notification to sharer
    if (this.config.enableNotifications) {
      await this.sendNotification(shareRequest.fromUserId, {
        type: 'share-accepted',
        title: 'Share Request Accepted',
        message: `Your share request has been accepted`,
        data: { shareRequestId, presetId: shareRequest.presetId },
      });
    }

    return shareRequest;
  }

  /**
   * Decline share request
   */
  public async declineShareRequest(
    userId: string,
    shareRequestId: string,
    reason?: string
  ): Promise<ShareRequest> {
    const shareRequest = await this.getShareRequest(shareRequestId);
    if (!shareRequest) {
      throw new Error('Share request not found');
    }

    // Validate user can decline
    if (shareRequest.toUserId && shareRequest.toUserId !== userId) {
      throw new Error('Not authorized to decline this share request');
    }

    // Update status
    shareRequest.status = 'declined';
    shareRequest.updatedAt = new Date();
    if (reason) {
      shareRequest.metadata = { ...shareRequest.metadata, declineReason: reason };
    }

    // Send notification to sharer
    if (this.config.enableNotifications) {
      await this.sendNotification(shareRequest.fromUserId, {
        type: 'share-declined',
        title: 'Share Request Declined',
        message: reason || 'Your share request has been declined',
        data: { shareRequestId, presetId: shareRequest.presetId },
      });
    }

    return shareRequest;
  }

  /**
   * Revoke share request
   */
  public async revokeShareRequest(
    userId: string,
    shareRequestId: string
  ): Promise<ShareRequest> {
    const shareRequest = await this.getShareRequest(shareRequestId);
    if (!shareRequest) {
      throw new Error('Share request not found');
    }

    // Validate user can revoke
    if (shareRequest.fromUserId !== userId) {
      throw new Error('Not authorized to revoke this share request');
    }

    // Update status
    shareRequest.status = 'revoked';
    shareRequest.updatedAt = new Date();

    // Revoke preset access if previously granted
    if (shareRequest.status === 'accepted') {
      await this.revokePresetAccess(shareRequest);
    }

    return shareRequest;
  }

  // ============================================================================
  // Share Link Management
  // ============================================================================

  /**
   * Create share link
   */
  public async createShareLink(
    userId: string,
    data: CreateShareLinkData
  ): Promise<ShareLink> {
    // Validate preset access
    await this.validatePresetAccess(userId, data.presetId);

    // Check user link limits
    const userLinks = Array.from(this.shareLinks.values()).filter(
      link => link.createdBy === userId && link.isActive
    );
    if (userLinks.length >= this.config.maxShareLinksPerUser) {
      throw new Error(`Maximum share links per user (${this.config.maxShareLinksPerUser}) reached`);
    }

    // Create share link
    const shareLink: ShareLink = {
      id: this.generateId(),
      presetId: data.presetId,
      createdBy: userId,
      token: this.generateShareToken(),
      scope: data.scope,
      permission: data.permission,
      allowedUsers: data.allowedUsers,
      allowedTeams: data.allowedTeams,
      expiresAt: data.expiresAt || new Date(Date.now() + this.config.defaultLinkExpiryDays * 24 * 60 * 60 * 1000),
      maxUses: data.maxUses,
      currentUses: 0,
      isActive: true,
      createdAt: new Date(),
    };

    // Store share link
    this.shareLinks.set(shareLink.id, shareLink);

    return shareLink;
  }

  /**
   * Access preset via share link
   */
  public async accessViaShareLink(
    userId: string,
    token: string
  ): Promise<{ preset: TeamParameterPreset; shareLink: ShareLink }> {
    // Find share link by token
    const shareLink = Array.from(this.shareLinks.values()).find(
      link => link.token === token && link.isActive
    );

    if (!shareLink) {
      throw new Error('Invalid or expired share link');
    }

    // Check expiration
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      shareLink.isActive = false;
      throw new Error('Share link has expired');
    }

    // Check usage limits
    if (shareLink.maxUses && shareLink.currentUses >= shareLink.maxUses) {
      shareLink.isActive = false;
      throw new Error('Share link usage limit reached');
    }

    // Check user permissions
    if (shareLink.allowedUsers && !shareLink.allowedUsers.includes(userId)) {
      throw new Error('Not authorized to access this share link');
    }

    // Check team permissions
    if (shareLink.allowedTeams && shareLink.allowedTeams.length > 0) {
      const userTeams = await teamManagementService.getUserTeams(userId);
      const hasTeamAccess = shareLink.allowedTeams.some(teamId =>
        userTeams.some(team => team.id === teamId)
      );
      if (!hasTeamAccess) {
        throw new Error('Not authorized to access this share link');
      }
    }

    // Get preset
    const preset = await this.getPresetById(shareLink.presetId);
    if (!preset) {
      throw new Error('Preset not found');
    }

    // Update usage
    shareLink.currentUses++;
    shareLink.lastUsedAt = new Date();

    // Track activity
    if (this.config.enableActivityTracking) {
      await this.trackActivity(shareLink.presetId, userId, 'accessed', {
        shareLinkId: shareLink.id,
        accessMethod: 'share-link',
      });
    }

    return { preset, shareLink };
  }

  /**
   * Deactivate share link
   */
  public async deactivateShareLink(
    userId: string,
    shareLinkId: string
  ): Promise<ShareLink> {
    const shareLink = this.shareLinks.get(shareLinkId);
    if (!shareLink) {
      throw new Error('Share link not found');
    }

    // Validate user can deactivate
    if (shareLink.createdBy !== userId) {
      throw new Error('Not authorized to deactivate this share link');
    }

    shareLink.isActive = false;
    return shareLink;
  }

  // ============================================================================
  // Notification Management
  // ============================================================================

  /**
   * Get user notifications
   */
  public async getUserNotifications(
    userId: string,
    unreadOnly: boolean = false
  ): Promise<ShareNotification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    
    let filteredNotifications = userNotifications.filter(notification => {
      // Filter expired notifications
      if (notification.expiresAt && notification.expiresAt < new Date()) {
        return false;
      }
      return true;
    });

    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    }

    return filteredNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Mark notification as read
   */
  public async markNotificationAsRead(
    userId: string,
    notificationId: string
  ): Promise<ShareNotification> {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    return notification;
  }

  /**
   * Mark all notifications as read
   */
  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  // ============================================================================
  // Activity Tracking
  // ============================================================================

  /**
   * Get preset activity
   */
  public async getPresetActivity(
    presetId: string,
    limit: number = 50
  ): Promise<ShareActivity[]> {
    const activities = this.activities.get(presetId) || [];
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get user activity
   */
  public async getUserActivity(
    userId: string,
    limit: number = 50
  ): Promise<ShareActivity[]> {
    const allActivities: ShareActivity[] = [];
    
    for (const activities of this.activities.values()) {
      allActivities.push(...activities.filter(a => a.userId === userId));
    }

    return allActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async validatePresetAccess(userId: string, presetId: string): Promise<TeamParameterPreset> {
    // This would integrate with the team parameter library service
    // For now, we'll simulate the validation
    const preset = await this.getPresetById(presetId);
    if (!preset) {
      throw new Error('Preset not found');
    }

    // Check if user has access to the preset
    if (preset.createdBy !== userId) {
      // Check team access
      const member = await teamManagementService.getTeamMember(preset.teamId, userId);
      if (!member || member.status !== 'active') {
        throw new Error('Not authorized to share this preset');
      }
    }

    return preset;
  }

  private async getPresetById(presetId: string): Promise<TeamParameterPreset | null> {
    // This would integrate with the team parameter library service
    // For now, we'll return a mock preset
    return {
      id: presetId,
      name: 'Mock Preset',
      description: 'Mock preset for testing',
      calculatorType: 'laser-cutting-cost',
      parameters: {},
      createdBy: 'user-123',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false,
      teamId: 'team-123',
      visibility: 'team',
      sharedBy: 'user-123',
      sharedAt: new Date(),
      collaborators: [],
      tags: [],
      rating: { averageRating: 0, totalRatings: 0, ratingDistribution: {}, userRatings: {} },
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
      versionHistory: [],
      status: 'active',
    };
  }

  private async getShareRequest(shareRequestId: string): Promise<ShareRequest | null> {
    for (const requests of this.shareRequests.values()) {
      const request = requests.find(r => r.id === shareRequestId);
      if (request) return request;
    }
    return null;
  }

  private async grantPresetAccess(shareRequest: ShareRequest): Promise<void> {
    // This would integrate with the team parameter library service
    // to actually grant access to the preset
    console.log(`Granting ${shareRequest.permission} access to preset ${shareRequest.presetId}`);
  }

  private async revokePresetAccess(shareRequest: ShareRequest): Promise<void> {
    // This would integrate with the team parameter library service
    // to revoke access to the preset
    console.log(`Revoking access to preset ${shareRequest.presetId}`);
  }

  private async sendShareNotification(shareRequest: ShareRequest): Promise<void> {
    const targetUserId = shareRequest.toUserId;
    if (!targetUserId) return;

    await this.sendNotification(targetUserId, {
      type: 'share-request',
      title: 'New Share Request',
      message: shareRequest.message || 'You have received a new parameter preset share request',
      data: { shareRequestId: shareRequest.id, presetId: shareRequest.presetId },
    });
  }

  private async sendNotification(
    userId: string,
    data: Omit<ShareNotification, 'id' | 'userId' | 'isRead' | 'createdAt'>
  ): Promise<ShareNotification> {
    const notification: ShareNotification = {
      id: this.generateId(),
      userId,
      isRead: false,
      createdAt: new Date(),
      ...data,
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    // Clean up old notifications
    await this.cleanupOldNotifications(userId);

    return notification;
  }

  private async cleanupOldNotifications(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    const cutoffDate = new Date(Date.now() - this.config.maxNotificationRetention * 24 * 60 * 60 * 1000);
    
    const filteredNotifications = userNotifications.filter(
      notification => notification.createdAt > cutoffDate
    );
    
    this.notifications.set(userId, filteredNotifications);
  }

  private async trackActivity(
    presetId: string,
    userId: string,
    action: ShareActivity['action'],
    details: Record<string, any>
  ): Promise<void> {
    const activity: ShareActivity = {
      id: this.generateId(),
      presetId,
      userId,
      action,
      details,
      timestamp: new Date(),
    };

    if (!this.activities.has(presetId)) {
      this.activities.set(presetId, []);
    }
    this.activities.get(presetId)!.push(activity);

    // Keep only recent activities (last 1000 per preset)
    const activities = this.activities.get(presetId)!;
    if (activities.length > 1000) {
      activities.splice(0, activities.length - 1000);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateShareToken(): string {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const parameterSharingService = new ParameterSharingService();
