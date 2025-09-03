/**
 * Parameter Sharing Service Tests
 * Comprehensive test suite for parameter sharing functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ParameterSharingService, parameterSharingService } from '../../services/parameterSharingService';

describe('ParameterSharingService', () => {
  let service: ParameterSharingService;

  beforeEach(() => {
    service = new ParameterSharingService();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new ParameterSharingService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new ParameterSharingService({
        maxSharesPerPreset: 50,
        maxShareLinksPerUser: 25,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('share request management', () => {
    it('should create share request for specific user', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
        message: 'Check out this preset!',
      };

      const shareRequest = await service.createShareRequest('user-123', shareData);

      expect(shareRequest).toBeDefined();
      expect(shareRequest.id).toBeDefined();
      expect(shareRequest.presetId).toBe('preset-123');
      expect(shareRequest.fromUserId).toBe('user-123');
      expect(shareRequest.toUserId).toBe('user-456');
      expect(shareRequest.scope).toBe('specific-users');
      expect(shareRequest.permission).toBe('view');
      expect(shareRequest.status).toBe('pending');
      expect(shareRequest.message).toBe('Check out this preset!');
    });

    it('should create share request for team', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'team' as const,
        permission: 'edit' as const,
        teamId: 'team-789',
        message: 'Team preset for collaboration',
      };

      const shareRequest = await service.createShareRequest('user-123', shareData);

      expect(shareRequest).toBeDefined();
      expect(shareRequest.teamId).toBe('team-789');
      expect(shareRequest.scope).toBe('team');
      expect(shareRequest.permission).toBe('edit');
    });

    it('should validate required fields for specific user sharing', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        // Missing toUserId
      };

      await expect(
        service.createShareRequest('user-123', shareData)
      ).rejects.toThrow('Target user required for specific user sharing');
    });

    it('should validate required fields for team sharing', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'team' as const,
        permission: 'view' as const,
        // Missing teamId
      };

      await expect(
        service.createShareRequest('user-123', shareData)
      ).rejects.toThrow('Team ID required for team sharing');
    });

    it('should accept share request', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
      };

      const shareRequest = await service.createShareRequest('user-123', shareData);

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const acceptedRequest = await service.acceptShareRequest('user-456', shareRequest.id);

      expect(acceptedRequest.status).toBe('accepted');
      expect(acceptedRequest.updatedAt.getTime()).toBeGreaterThanOrEqual(shareRequest.createdAt.getTime());
    });

    it('should decline share request', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
      };

      const shareRequest = await service.createShareRequest('user-123', shareData);
      const declinedRequest = await service.declineShareRequest('user-456', shareRequest.id, 'Not interested');

      expect(declinedRequest.status).toBe('declined');
      expect(declinedRequest.metadata?.declineReason).toBe('Not interested');
    });

    it('should revoke share request', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
      };

      const shareRequest = await service.createShareRequest('user-123', shareData);
      const revokedRequest = await service.revokeShareRequest('user-123', shareRequest.id);

      expect(revokedRequest.status).toBe('revoked');
    });

    it('should prevent unauthorized users from accepting share requests', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
      };

      const shareRequest = await service.createShareRequest('user-123', shareData);

      await expect(
        service.acceptShareRequest('user-789', shareRequest.id)
      ).rejects.toThrow('Not authorized to accept this share request');
    });

    it('should prevent unauthorized users from revoking share requests', async () => {
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
      };

      const shareRequest = await service.createShareRequest('user-123', shareData);

      await expect(
        service.revokeShareRequest('user-789', shareRequest.id)
      ).rejects.toThrow('Not authorized to revoke this share request');
    });
  });

  describe('share link management', () => {
    it('should create share link', async () => {
      const linkData = {
        presetId: 'preset-123',
        scope: 'public' as const,
        permission: 'view' as const,
        maxUses: 10,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };

      const shareLink = await service.createShareLink('user-123', linkData);

      expect(shareLink).toBeDefined();
      expect(shareLink.id).toBeDefined();
      expect(shareLink.token).toBeDefined();
      expect(shareLink.presetId).toBe('preset-123');
      expect(shareLink.createdBy).toBe('user-123');
      expect(shareLink.scope).toBe('public');
      expect(shareLink.permission).toBe('view');
      expect(shareLink.maxUses).toBe(10);
      expect(shareLink.currentUses).toBe(0);
      expect(shareLink.isActive).toBe(true);
    });

    it('should access preset via share link', async () => {
      const linkData = {
        presetId: 'preset-123',
        scope: 'public' as const,
        permission: 'view' as const,
      };

      const shareLink = await service.createShareLink('user-123', linkData);
      const result = await service.accessViaShareLink('user-456', shareLink.token);

      expect(result).toBeDefined();
      expect(result.preset).toBeDefined();
      expect(result.shareLink).toBeDefined();
      expect(result.shareLink.currentUses).toBe(1);
      expect(result.shareLink.lastUsedAt).toBeDefined();
    });

    it('should enforce usage limits on share links', async () => {
      const linkData = {
        presetId: 'preset-123',
        scope: 'public' as const,
        permission: 'view' as const,
        maxUses: 1,
      };

      const shareLink = await service.createShareLink('user-123', linkData);
      
      // First access should succeed
      await service.accessViaShareLink('user-456', shareLink.token);
      
      // Second access should fail
      await expect(
        service.accessViaShareLink('user-789', shareLink.token)
      ).rejects.toThrow('Share link usage limit reached');
    });

    it('should enforce expiration on share links', async () => {
      const linkData = {
        presetId: 'preset-123',
        scope: 'public' as const,
        permission: 'view' as const,
        expiresAt: new Date(Date.now() - 1000), // Already expired
      };

      const shareLink = await service.createShareLink('user-123', linkData);
      
      await expect(
        service.accessViaShareLink('user-456', shareLink.token)
      ).rejects.toThrow('Share link has expired');
    });

    it('should deactivate share link', async () => {
      const linkData = {
        presetId: 'preset-123',
        scope: 'public' as const,
        permission: 'view' as const,
      };

      const shareLink = await service.createShareLink('user-123', linkData);
      const deactivatedLink = await service.deactivateShareLink('user-123', shareLink.id);

      expect(deactivatedLink.isActive).toBe(false);
    });

    it('should prevent unauthorized users from deactivating share links', async () => {
      const linkData = {
        presetId: 'preset-123',
        scope: 'public' as const,
        permission: 'view' as const,
      };

      const shareLink = await service.createShareLink('user-123', linkData);

      await expect(
        service.deactivateShareLink('user-456', shareLink.id)
      ).rejects.toThrow('Not authorized to deactivate this share link');
    });

    it('should handle invalid share link tokens', async () => {
      await expect(
        service.accessViaShareLink('user-456', 'invalid-token')
      ).rejects.toThrow('Invalid or expired share link');
    });
  });

  describe('notification management', () => {
    it('should get user notifications', async () => {
      const notifications = await service.getUserNotifications('user-123');
      expect(Array.isArray(notifications)).toBe(true);
    });

    it('should get only unread notifications', async () => {
      const notifications = await service.getUserNotifications('user-123', true);
      expect(Array.isArray(notifications)).toBe(true);
      // All notifications should be unread
      notifications.forEach(notification => {
        expect(notification.isRead).toBe(false);
      });
    });

    it('should mark notification as read', async () => {
      // Create a share request to generate a notification
      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
      };

      await service.createShareRequest('user-123', shareData);
      
      const notifications = await service.getUserNotifications('user-456');
      if (notifications.length > 0) {
        const notification = notifications[0];
        const readNotification = await service.markNotificationAsRead('user-456', notification.id);
        expect(readNotification.isRead).toBe(true);
      }
    });

    it('should mark all notifications as read', async () => {
      await service.markAllNotificationsAsRead('user-123');
      
      const notifications = await service.getUserNotifications('user-123');
      notifications.forEach(notification => {
        expect(notification.isRead).toBe(true);
      });
    });
  });

  describe('activity tracking', () => {
    it('should get preset activity', async () => {
      const activities = await service.getPresetActivity('preset-123');
      expect(Array.isArray(activities)).toBe(true);
    });

    it('should get user activity', async () => {
      const activities = await service.getUserActivity('user-123');
      expect(Array.isArray(activities)).toBe(true);
    });

    it('should limit activity results', async () => {
      const activities = await service.getPresetActivity('preset-123', 5);
      expect(activities.length).toBeLessThanOrEqual(5);
    });
  });

  describe('edge cases and validation', () => {
    it('should handle non-existent share request', async () => {
      await expect(
        service.acceptShareRequest('user-123', 'non-existent-id')
      ).rejects.toThrow('Share request not found');
    });

    it('should handle non-existent share link', async () => {
      await expect(
        service.deactivateShareLink('user-123', 'non-existent-id')
      ).rejects.toThrow('Share link not found');
    });

    it('should handle non-existent notification', async () => {
      await expect(
        service.markNotificationAsRead('user-123', 'non-existent-id')
      ).rejects.toThrow('Notification not found');
    });

    it('should enforce share limits per preset', async () => {
      const customService = new ParameterSharingService({
        maxSharesPerPreset: 1,
      });

      const shareData = {
        presetId: 'preset-123',
        scope: 'specific-users' as const,
        permission: 'view' as const,
        toUserId: 'user-456',
      };

      // First share should succeed
      await customService.createShareRequest('user-123', shareData);

      // Second share should fail
      const shareData2 = {
        ...shareData,
        toUserId: 'user-789',
      };

      await expect(
        customService.createShareRequest('user-123', shareData2)
      ).rejects.toThrow('Maximum shares per preset (1) reached');
    });

    it('should enforce share link limits per user', async () => {
      const customService = new ParameterSharingService({
        maxShareLinksPerUser: 1,
      });

      const linkData = {
        presetId: 'preset-123',
        scope: 'public' as const,
        permission: 'view' as const,
      };

      // First link should succeed
      await customService.createShareLink('user-123', linkData);

      // Second link should fail
      const linkData2 = {
        ...linkData,
        presetId: 'preset-456',
      };

      await expect(
        customService.createShareLink('user-123', linkData2)
      ).rejects.toThrow('Maximum share links per user (1) reached');
    });
  });
});
