/**
 * Parameter Sharing Panel Component
 * Interface for managing parameter preset sharing and notifications
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { useParameterSharing } from '../../hooks/useParameterSharing';
import { ShareRequest, ShareLink, ShareNotification, ShareScope, SharePermission } from '../../services/parameterSharingService';

export interface ParameterSharingPanelProps {
  className?: string;
  userId?: string;
  showNotifications?: boolean;
  showShareRequests?: boolean;
  showShareLinks?: boolean;
  onShareRequestAction?: (request: ShareRequest, action: 'accept' | 'decline') => void;
}

export function ParameterSharingPanel({
  className = '',
  userId,
  showNotifications = true,
  showShareRequests = true,
  showShareLinks = true,
  onShareRequestAction,
}: ParameterSharingPanelProps) {
  const { theme } = useTheme();
  const [state, actions] = useParameterSharing({ userId });
  const [activeTab, setActiveTab] = useState<'notifications' | 'requests' | 'links'>('notifications');
  const [showCreateShareModal, setShowCreateShareModal] = useState(false);

  // Handle share request action
  const handleShareRequestAction = useCallback(async (
    request: ShareRequest,
    action: 'accept' | 'decline'
  ) => {
    try {
      if (action === 'accept') {
        await actions.acceptShareRequest(request.id);
      } else {
        await actions.declineShareRequest(request.id);
      }
      
      if (onShareRequestAction) {
        onShareRequestAction(request, action);
      }
    } catch (error) {
      console.error(`Failed to ${action} share request:`, error);
    }
  }, [actions, onShareRequestAction]);

  // Handle notification click
  const handleNotificationClick = useCallback(async (notification: ShareNotification) => {
    if (!notification.isRead) {
      await actions.markNotificationAsRead(notification.id);
    }
  }, [actions]);

  // Get status color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'accepted':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'declined':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'revoked':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  }, []);

  // Get permission icon
  const getPermissionIcon = useCallback((permission: SharePermission) => {
    switch (permission) {
      case 'view':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'edit':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'admin':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  }, []);

  if (state.loading && state.notifications.length === 0) {
    return (
      <div className={`parameter-sharing-panel ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={`parameter-sharing-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Parameter Sharing Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{state.error}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={actions.clearError}
                  className="text-sm font-medium text-red-800 hover:text-red-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`parameter-sharing-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                Parameter Sharing
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {state.unreadNotificationCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {state.unreadNotificationCount} unread
                </span>
              )}
              <button
                onClick={actions.refreshData}
                className="text-gray-400 hover:text-gray-600"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex space-x-1">
            {showNotifications && (
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notifications
                {state.unreadNotificationCount > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {state.unreadNotificationCount}
                  </span>
                )}
              </button>
            )}
            {showShareRequests && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Share Requests
              </button>
            )}
            {showShareLinks && (
              <button
                onClick={() => setActiveTab('links')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'links'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Share Links
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              {state.notifications.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5zM12 3v18" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You'll see sharing notifications here when they arrive.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {state.notifications.length} notifications
                    </span>
                    {state.unreadNotificationCount > 0 && (
                      <button
                        onClick={actions.markAllNotificationsAsRead}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {state.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        notification.isRead 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Share Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {state.shareRequests.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No share requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Share requests will appear here when you receive them.
                  </p>
                </div>
              ) : (
                state.shareRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-500">
                            {getPermissionIcon(request.permission)}
                            <span className="text-xs">{request.permission}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">
                          Preset: {request.presetId}
                        </p>
                        {request.message && (
                          <p className="text-sm text-gray-600 mb-2">
                            "{request.message}"
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {request.createdAt.toLocaleString()}
                        </p>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleShareRequestAction(request, 'accept')}
                            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded hover:bg-green-200"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleShareRequestAction(request, 'decline')}
                            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded hover:bg-red-200"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Share Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-3">
              {state.shareLinks.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No share links</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create share links to easily share parameter presets.
                  </p>
                </div>
              ) : (
                state.shareLinks.map((link) => (
                  <div key={link.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {link.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-500">
                            {getPermissionIcon(link.permission)}
                            <span className="text-xs">{link.permission}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-900 mb-1">
                          Preset: {link.presetId}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          Uses: {link.currentUses}{link.maxUses ? `/${link.maxUses}` : ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {link.createdAt.toLocaleString()}
                        </p>
                        {link.expiresAt && (
                          <p className="text-xs text-gray-500">
                            Expires: {link.expiresAt.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {link.isActive && (
                        <button
                          onClick={() => actions.deactivateShareLink(link.id)}
                          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded hover:bg-red-200 ml-4"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
