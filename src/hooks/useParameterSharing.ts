/**
 * Parameter Sharing Hook
 * React hook for parameter sharing functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  parameterSharingService,
  ShareRequest,
  ShareLink,
  ShareNotification,
  ShareActivity,
  CreateShareRequestData,
  CreateShareLinkData,
  ShareScope,
  SharePermission
} from '../services/parameterSharingService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface ParameterSharingState {
  shareRequests: ShareRequest[];
  shareLinks: ShareLink[];
  notifications: ShareNotification[];
  activities: ShareActivity[];
  loading: boolean;
  error: string | null;
  unreadNotificationCount: number;
}

export interface ParameterSharingActions {
  createShareRequest: (data: CreateShareRequestData) => Promise<ShareRequest>;
  acceptShareRequest: (shareRequestId: string) => Promise<ShareRequest>;
  declineShareRequest: (shareRequestId: string, reason?: string) => Promise<ShareRequest>;
  revokeShareRequest: (shareRequestId: string) => Promise<ShareRequest>;
  createShareLink: (data: CreateShareLinkData) => Promise<ShareLink>;
  accessViaShareLink: (token: string) => Promise<{ preset: any; shareLink: ShareLink }>;
  deactivateShareLink: (shareLinkId: string) => Promise<ShareLink>;
  getUserNotifications: (unreadOnly?: boolean) => Promise<ShareNotification[]>;
  markNotificationAsRead: (notificationId: string) => Promise<ShareNotification>;
  markAllNotificationsAsRead: () => Promise<void>;
  getPresetActivity: (presetId: string, limit?: number) => Promise<ShareActivity[]>;
  getUserActivity: (limit?: number) => Promise<ShareActivity[]>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseParameterSharingConfig {
  userId?: string;
  autoLoadNotifications?: boolean;
  notificationPollingInterval?: number;
}

const DEFAULT_CONFIG: Required<UseParameterSharingConfig> = {
  userId: 'anonymous-user',
  autoLoadNotifications: true,
  notificationPollingInterval: 30000, // 30 seconds
};

// ============================================================================
// Main Hook
// ============================================================================

export function useParameterSharing(
  config: UseParameterSharingConfig = {}
): [ParameterSharingState, ParameterSharingActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<ParameterSharingState>({
    shareRequests: [],
    shareLinks: [],
    notifications: [],
    activities: [],
    loading: false,
    error: null,
    unreadNotificationCount: 0,
  });

  // Auto-load notifications
  useEffect(() => {
    if (finalConfig.autoLoadNotifications) {
      loadNotifications();
    }
  }, [finalConfig.autoLoadNotifications]);

  // Notification polling
  useEffect(() => {
    if (finalConfig.notificationPollingInterval > 0) {
      const interval = setInterval(() => {
        if (!state.loading) {
          loadNotifications();
        }
      }, finalConfig.notificationPollingInterval);

      return () => clearInterval(interval);
    }
  }, [finalConfig.notificationPollingInterval, state.loading]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      const notifications = await parameterSharingService.getUserNotifications(finalConfig.userId);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      setState(prev => ({
        ...prev,
        notifications,
        unreadNotificationCount: unreadCount,
      }));
    } catch (error) {
      console.warn('Failed to load notifications:', error);
    }
  }, [finalConfig.userId]);

  // Create share request
  const createShareRequest = useCallback(async (
    data: CreateShareRequestData
  ): Promise<ShareRequest> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const shareRequest = await parameterSharingService.createShareRequest(
        finalConfig.userId,
        data
      );

      setState(prev => ({
        ...prev,
        shareRequests: [shareRequest, ...prev.shareRequests],
        loading: false,
      }));

      return shareRequest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create share request';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Accept share request
  const acceptShareRequest = useCallback(async (
    shareRequestId: string
  ): Promise<ShareRequest> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const shareRequest = await parameterSharingService.acceptShareRequest(
        finalConfig.userId,
        shareRequestId
      );

      setState(prev => ({
        ...prev,
        shareRequests: prev.shareRequests.map(sr => 
          sr.id === shareRequestId ? shareRequest : sr
        ),
        loading: false,
      }));

      // Refresh notifications
      await loadNotifications();

      return shareRequest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept share request';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId, loadNotifications]);

  // Decline share request
  const declineShareRequest = useCallback(async (
    shareRequestId: string,
    reason?: string
  ): Promise<ShareRequest> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const shareRequest = await parameterSharingService.declineShareRequest(
        finalConfig.userId,
        shareRequestId,
        reason
      );

      setState(prev => ({
        ...prev,
        shareRequests: prev.shareRequests.map(sr => 
          sr.id === shareRequestId ? shareRequest : sr
        ),
        loading: false,
      }));

      return shareRequest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decline share request';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Revoke share request
  const revokeShareRequest = useCallback(async (
    shareRequestId: string
  ): Promise<ShareRequest> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const shareRequest = await parameterSharingService.revokeShareRequest(
        finalConfig.userId,
        shareRequestId
      );

      setState(prev => ({
        ...prev,
        shareRequests: prev.shareRequests.map(sr => 
          sr.id === shareRequestId ? shareRequest : sr
        ),
        loading: false,
      }));

      return shareRequest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to revoke share request';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Create share link
  const createShareLink = useCallback(async (
    data: CreateShareLinkData
  ): Promise<ShareLink> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const shareLink = await parameterSharingService.createShareLink(
        finalConfig.userId,
        data
      );

      setState(prev => ({
        ...prev,
        shareLinks: [shareLink, ...prev.shareLinks],
        loading: false,
      }));

      return shareLink;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create share link';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Access via share link
  const accessViaShareLink = useCallback(async (
    token: string
  ): Promise<{ preset: any; shareLink: ShareLink }> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await parameterSharingService.accessViaShareLink(
        finalConfig.userId,
        token
      );

      setState(prev => ({ ...prev, loading: false }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to access share link';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Deactivate share link
  const deactivateShareLink = useCallback(async (
    shareLinkId: string
  ): Promise<ShareLink> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const shareLink = await parameterSharingService.deactivateShareLink(
        finalConfig.userId,
        shareLinkId
      );

      setState(prev => ({
        ...prev,
        shareLinks: prev.shareLinks.map(sl => 
          sl.id === shareLinkId ? shareLink : sl
        ),
        loading: false,
      }));

      return shareLink;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to deactivate share link';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get user notifications
  const getUserNotifications = useCallback(async (
    unreadOnly: boolean = false
  ): Promise<ShareNotification[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const notifications = await parameterSharingService.getUserNotifications(
        finalConfig.userId,
        unreadOnly
      );

      setState(prev => ({
        ...prev,
        notifications,
        unreadNotificationCount: notifications.filter(n => !n.isRead).length,
        loading: false,
      }));

      return notifications;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get notifications';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, [finalConfig.userId]);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (
    notificationId: string
  ): Promise<ShareNotification> => {
    try {
      const notification = await parameterSharingService.markNotificationAsRead(
        finalConfig.userId,
        notificationId
      );

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === notificationId ? notification : n
        ),
        unreadNotificationCount: Math.max(0, prev.unreadNotificationCount - 1),
      }));

      return notification;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async (): Promise<void> => {
    try {
      await parameterSharingService.markAllNotificationsAsRead(finalConfig.userId);

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
        unreadNotificationCount: 0,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Get preset activity
  const getPresetActivity = useCallback(async (
    presetId: string,
    limit: number = 50
  ): Promise<ShareActivity[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const activities = await parameterSharingService.getPresetActivity(presetId, limit);

      setState(prev => ({
        ...prev,
        activities,
        loading: false,
      }));

      return activities;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get preset activity';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, []);

  // Get user activity
  const getUserActivity = useCallback(async (
    limit: number = 50
  ): Promise<ShareActivity[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const activities = await parameterSharingService.getUserActivity(finalConfig.userId, limit);

      setState(prev => ({
        ...prev,
        activities,
        loading: false,
      }));

      return activities;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user activity';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return [];
    }
  }, [finalConfig.userId]);

  // Refresh data
  const refreshData = useCallback(async (): Promise<void> => {
    await loadNotifications();
  }, [loadNotifications]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: ParameterSharingActions = {
    createShareRequest,
    acceptShareRequest,
    declineShareRequest,
    revokeShareRequest,
    createShareLink,
    accessViaShareLink,
    deactivateShareLink,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getPresetActivity,
    getUserActivity,
    refreshData,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for share notifications
 */
export function useShareNotifications(userId?: string) {
  const [state, actions] = useParameterSharing({ 
    userId, 
    autoLoadNotifications: true,
    notificationPollingInterval: 30000 
  });

  return {
    notifications: state.notifications,
    unreadCount: state.unreadNotificationCount,
    loading: state.loading,
    error: state.error,
    markAsRead: actions.markNotificationAsRead,
    markAllAsRead: actions.markAllNotificationsAsRead,
    refresh: actions.refreshData,
  };
}

/**
 * Hook for preset sharing
 */
export function usePresetSharing(presetId: string, userId?: string) {
  const [state, actions] = useParameterSharing({ userId });

  const shareWithUser = useCallback((
    targetUserId: string,
    permission: SharePermission = 'view',
    message?: string
  ) => {
    return actions.createShareRequest({
      presetId,
      scope: 'specific-users',
      permission,
      toUserId: targetUserId,
      message,
    });
  }, [actions, presetId]);

  const shareWithTeam = useCallback((
    teamId: string,
    permission: SharePermission = 'view',
    message?: string
  ) => {
    return actions.createShareRequest({
      presetId,
      scope: 'team',
      permission,
      teamId,
      message,
    });
  }, [actions, presetId]);

  const createPublicLink = useCallback((
    permission: SharePermission = 'view',
    expiresAt?: Date,
    maxUses?: number
  ) => {
    return actions.createShareLink({
      presetId,
      scope: 'public',
      permission,
      expiresAt,
      maxUses,
    });
  }, [actions, presetId]);

  const getActivity = useCallback((limit?: number) => {
    return actions.getPresetActivity(presetId, limit);
  }, [actions, presetId]);

  return {
    loading: state.loading,
    error: state.error,
    shareWithUser,
    shareWithTeam,
    createPublicLink,
    getActivity,
    clearError: actions.clearError,
  };
}
