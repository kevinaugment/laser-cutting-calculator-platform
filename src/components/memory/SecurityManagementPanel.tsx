/**
 * Security Management Panel Component
 * Dashboard for security monitoring, privacy settings, and GDPR compliance
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { 
  useSecurityMonitoring, 
  usePrivacyCompliance, 
  useAuditLogging 
} from '../../hooks/useSecurity';
import { GDPRRequest } from '../../services/securityService';

export interface SecurityManagementPanelProps {
  className?: string;
  userId?: string;
  showSecurityMetrics?: boolean;
  showAuditLogs?: boolean;
  showPrivacySettings?: boolean;
  showGDPRCompliance?: boolean;
}

export function SecurityManagementPanel({
  className = '',
  userId,
  showSecurityMetrics = true,
  showAuditLogs = true,
  showPrivacySettings = true,
  showGDPRCompliance = true,
}: SecurityManagementPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'metrics' | 'audit' | 'privacy' | 'gdpr'>('metrics');
  const [gdprRequestType, setGdprRequestType] = useState<GDPRRequest['type']>('access');
  const [gdprRequestDetails, setGdprRequestDetails] = useState('');

  // Load security monitoring data
  const {
    securityMetrics,
    auditLogs: monitoringAuditLogs,
    isLoading: metricsLoading,
    error: metricsError,
    getSecurityMetrics,
    resetSecurityMetrics,
    clearError: clearMetricsError,
  } = useSecurityMonitoring();

  // Load audit logging data
  const {
    auditLogs,
    isLoading: auditLoading,
    error: auditError,
    logSecurityEvent,
    getAuditLogs,
    clearError: clearAuditError,
  } = useAuditLogging();

  // Load privacy compliance data
  const {
    privacySettings,
    gdprRequests,
    isLoading: privacyLoading,
    error: privacyError,
    setPrivacySettings,
    createGDPRRequest,
    processGDPRRequest,
    completeGDPRRequest,
    maskData,
    clearError: clearPrivacyError,
  } = usePrivacyCompliance(userId);

  // Format percentage
  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(1)}%`;
  }, []);

  // Format number
  const formatNumber = useCallback((value: number, decimals: number = 0) => {
    return value.toFixed(decimals);
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }, []);

  // Get security score color
  const getSecurityScoreColor = useCallback((score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  }, []);

  // Get risk level badge
  const getRiskLevelBadge = useCallback((riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[riskLevel as keyof typeof colors] || colors.low}`}>
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
      </span>
    );
  }, []);

  // Get GDPR status badge
  const getGDPRStatusBadge = useCallback((status: GDPRRequest['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }, []);

  // Handle GDPR request creation
  const handleCreateGDPRRequest = useCallback(async () => {
    if (!userId || !gdprRequestDetails.trim()) return;

    try {
      await createGDPRRequest(userId, gdprRequestType, gdprRequestDetails);
      setGdprRequestDetails('');
    } catch (error) {
      console.error('Failed to create GDPR request:', error);
    }
  }, [userId, gdprRequestType, gdprRequestDetails, createGDPRRequest]);

  if ((metricsLoading || auditLoading || privacyLoading) && !securityMetrics.totalRequests) {
    return (
      <div className={`security-management-panel ${className}`}>
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

  if (metricsError || auditError || privacyError) {
    return (
      <div className={`security-management-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Security Management Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{metricsError || auditError || privacyError}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    clearMetricsError();
                    clearAuditError();
                    clearPrivacyError();
                  }}
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
    <div className={`security-management-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                Security Management
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-2xl font-bold ${getSecurityScoreColor(securityMetrics.securityScore)}`}>
                {formatNumber(securityMetrics.securityScore)}
              </div>
              <span className="text-sm text-gray-500">Security Score</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex space-x-1">
            {showSecurityMetrics && (
              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'metrics'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Security Metrics
              </button>
            )}
            {showAuditLogs && (
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'audit'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Audit Logs
                {auditLogs.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {auditLogs.length}
                  </span>
                )}
              </button>
            )}
            {showPrivacySettings && (
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Privacy Settings
              </button>
            )}
            {showGDPRCompliance && (
              <button
                onClick={() => setActiveTab('gdpr')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'gdpr'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                GDPR Compliance
                {gdprRequests.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {gdprRequests.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Security Metrics Tab */}
          {activeTab === 'metrics' && showSecurityMetrics && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900">Security Metrics</h4>
                <button
                  onClick={resetSecurityMetrics}
                  className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                >
                  Reset Metrics
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Requests</p>
                      <p className="text-2xl font-bold">{formatNumber(securityMetrics.totalRequests)}</p>
                    </div>
                    <svg className="w-8 h-8 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Blocked Requests</p>
                      <p className="text-2xl font-bold">{formatNumber(securityMetrics.blockedRequests)}</p>
                    </div>
                    <svg className="w-8 h-8 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Failed Logins</p>
                      <p className="text-2xl font-bold">{formatNumber(securityMetrics.failedLogins)}</p>
                    </div>
                    <svg className="w-8 h-8 text-yellow-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Encrypted Data</p>
                      <p className="text-2xl font-bold">{formatFileSize(securityMetrics.encryptedDataSize)}</p>
                    </div>
                    <svg className="w-8 h-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="text-md font-medium text-gray-900 mb-3">Security Activity</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Suspicious Activities</span>
                      <span className="text-sm font-medium">{formatNumber(securityMetrics.suspiciousActivities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Audit Log Entries</span>
                      <span className="text-sm font-medium">{formatNumber(securityMetrics.auditLogEntries)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">GDPR Requests</span>
                      <span className="text-sm font-medium">{formatNumber(securityMetrics.gdprRequests)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h5 className="text-md font-medium text-gray-900 mb-3">Performance</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Response Time</span>
                      <span className="text-sm font-medium">{formatNumber(securityMetrics.averageResponseTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Security Score</span>
                      <span className={`text-sm font-medium ${getSecurityScoreColor(securityMetrics.securityScore)}`}>
                        {formatPercentage(securityMetrics.securityScore)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && showAuditLogs && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Security Audit Logs</h4>

              {auditLogs.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0a7.962 7.962 0 016 2.562M9 6.306a7.962 7.962 0 00-6 2.562" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Security events will appear here when they occur.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.slice(0, 20).map((log) => (
                    <div key={log.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {getRiskLevelBadge(log.riskLevel)}
                            <span className="text-sm text-gray-500">
                              {log.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">
                            {log.action} - {log.resource}
                          </h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Session: {log.sessionId}</p>
                            <p>IP: {maskData(log.ipAddress, 'ip')}</p>
                            {log.userId && <p>User: {log.userId}</p>}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {log.success ? 'Success' : 'Failed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Privacy Settings Tab */}
          {activeTab === 'privacy' && showPrivacySettings && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Privacy Settings</h4>
              
              {!userId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Please provide a user ID to manage privacy settings.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Privacy settings management will be available in the next update. 
                    Current settings are automatically applied based on GDPR compliance requirements.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Data Encryption</span>
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Audit Logging</span>
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Data Masking</span>
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">GDPR Compliance</span>
                      <span className="text-sm text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GDPR Compliance Tab */}
          {activeTab === 'gdpr' && showGDPRCompliance && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">GDPR Compliance</h4>

              {!userId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Please provide a user ID to manage GDPR requests.
                  </p>
                </div>
              ) : (
                <>
                  {/* Create GDPR Request */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-md font-medium text-gray-900 mb-3">Create GDPR Request</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Request Type
                        </label>
                        <select
                          value={gdprRequestType}
                          onChange={(e) => setGdprRequestType(e.target.value as GDPRRequest['type'])}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="access">Data Access Request</option>
                          <option value="rectification">Data Rectification</option>
                          <option value="erasure">Data Erasure (Right to be Forgotten)</option>
                          <option value="portability">Data Portability</option>
                          <option value="restriction">Processing Restriction</option>
                          <option value="objection">Processing Objection</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Request Details
                        </label>
                        <textarea
                          value={gdprRequestDetails}
                          onChange={(e) => setGdprRequestDetails(e.target.value)}
                          placeholder="Please provide details about your request..."
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <button
                        onClick={handleCreateGDPRRequest}
                        disabled={!gdprRequestDetails.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Request
                      </button>
                    </div>
                  </div>

                  {/* GDPR Requests List */}
                  <div>
                    <h5 className="text-md font-medium text-gray-900 mb-3">Your GDPR Requests</h5>
                    
                    {gdprRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0a7.962 7.962 0 016 2.562M9 6.306a7.962 7.962 0 00-6 2.562" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No GDPR requests</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You haven't submitted any GDPR requests yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {gdprRequests.map((request) => (
                          <div key={request.id} className="bg-white border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getGDPRStatusBadge(request.status)}
                                  <span className="text-sm text-gray-500">
                                    {request.requestedAt.toLocaleDateString()}
                                  </span>
                                </div>
                                <h5 className="text-sm font-medium text-gray-900 mb-1 capitalize">
                                  {request.type.replace('-', ' ')} Request
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">
                                  {request.details}
                                </p>
                                {request.response && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded">
                                    <p className="text-sm text-gray-700">
                                      <strong>Response:</strong> {request.response}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
