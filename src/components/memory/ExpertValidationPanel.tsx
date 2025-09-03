/**
 * Expert Validation Panel Component
 * Interface for managing expert validation requests and results
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { useExpertValidation } from '../../hooks/useExpertValidation';
import { 
  ExpertProfile, 
  ValidationRequest, 
  ValidationResult, 
  ValidationStatus,
  ValidationCategory,
  ExpertLevel 
} from '../../services/expertValidationService';

export interface ExpertValidationPanelProps {
  className?: string;
  userId?: string;
  showExpertProfile?: boolean;
  showValidationRequests?: boolean;
  showValidationResults?: boolean;
  onValidationComplete?: (result: ValidationResult) => void;
}

export function ExpertValidationPanel({
  className = '',
  userId,
  showExpertProfile = true,
  showValidationRequests = true,
  showValidationResults = true,
  onValidationComplete,
}: ExpertValidationPanelProps) {
  const { theme } = useTheme();
  const [state, actions] = useExpertValidation({ userId });
  const [activeTab, setActiveTab] = useState<'profile' | 'requests' | 'results'>('profile');
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);

  // Get status color
  const getStatusColor = useCallback((status: ValidationStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'needs-revision':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-100';
      case 'high':
        return 'text-orange-700 bg-orange-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  }, []);

  // Get expert level badge
  const getExpertLevelBadge = useCallback((level: ExpertLevel) => {
    const colors = {
      apprentice: 'bg-gray-100 text-gray-800',
      journeyman: 'bg-blue-100 text-blue-800',
      expert: 'bg-purple-100 text-purple-800',
      master: 'bg-gold-100 text-gold-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  }, []);

  if (state.loading && !state.initialized) {
    return (
      <div className={`expert-validation-panel ${className}`}>
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
      <div className={`expert-validation-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Expert Validation Error
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
    <div className={`expert-validation-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                Expert Validation
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {state.expertProfile && (
                <div className="flex items-center space-x-2">
                  {getExpertLevelBadge(state.expertProfile.level)}
                  <span className="text-sm text-gray-500">
                    Trust: {Math.round(state.expertProfile.reputation.trustScore * 100)}%
                  </span>
                </div>
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
            {showExpertProfile && (
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Expert Profile
              </button>
            )}
            {showValidationRequests && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Validation Requests
                {state.validationRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {state.validationRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            )}
            {showValidationResults && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'results'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Validation Results
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Expert Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {!state.expertProfile ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Expert Profile</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Register as an expert to validate parameter presets.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {/* Open registration modal */}}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Register as Expert
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile Overview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getExpertLevelBadge(state.expertProfile.level)}
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Expert Profile</h4>
                          <p className="text-sm text-gray-500">
                            {state.expertProfile.experience.yearsOfExperience} years experience
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(state.expertProfile.reputation.trustScore * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Trust Score</div>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Specializations</h5>
                      <div className="flex flex-wrap gap-2">
                        {state.expertProfile.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Validation Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {state.expertProfile.validationStats.totalValidations}
                        </div>
                        <div className="text-xs text-gray-500">Total Validations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {state.expertProfile.validationStats.approvedValidations}
                        </div>
                        <div className="text-xs text-gray-500">Approved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                          {Math.round(state.expertProfile.validationStats.averageScore)}
                        </div>
                        <div className="text-xs text-gray-500">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {Math.round(state.expertProfile.validationStats.averageConfidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  {state.expertProfile.certifications.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Certifications</h5>
                      <div className="space-y-2">
                        {state.expertProfile.certifications.map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{cert.name}</div>
                              <div className="text-sm text-gray-500">{cert.issuer}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {cert.isVerified && (
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className="text-xs text-gray-500">
                                {cert.issuedAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {state.expertProfile.reputation.achievements.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Achievements</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {state.expertProfile.reputation.achievements.map((achievement) => (
                          <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{achievement.title}</div>
                              <div className="text-sm text-gray-500">{achievement.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Validation Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {state.validationRequests.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No validation requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Validation requests will appear here when assigned to you.
                  </p>
                </div>
              ) : (
                state.validationRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                          <span className="text-xs text-gray-500">{request.category}</span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Preset: {request.presetId}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {request.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Created: {request.createdAt.toLocaleDateString()}</span>
                          {request.dueDate && (
                            <span>Due: {request.dueDate.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      {request.status === 'pending' && request.assignedTo === userId && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {/* Open validation form */}}
                            className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 border border-purple-200 rounded hover:bg-purple-200"
                          >
                            Validate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Validation Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-3">
              {state.validationResults.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No validation results</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your validation results will appear here.
                  </p>
                </div>
              ) : (
                state.validationResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                          <span className="text-xs text-gray-500">{result.category}</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="text-sm">
                            <span className="font-medium">Score:</span> {result.score}/100
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Confidence:</span> {Math.round(result.confidence * 100)}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {result.comments}
                        </p>
                        <div className="text-xs text-gray-500">
                          Validated: {result.validatedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Findings and Recommendations */}
                    {(result.findings.length > 0 || result.recommendations.length > 0) && (
                      <div className="mt-4 pt-4 border-t">
                        {result.findings.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-xs font-medium text-gray-700 mb-2">Findings</h5>
                            <div className="space-y-1">
                              {result.findings.slice(0, 3).map((finding) => (
                                <div key={finding.id} className="text-xs text-gray-600">
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                    finding.severity === 'critical' ? 'bg-red-500' :
                                    finding.severity === 'high' ? 'bg-orange-500' :
                                    finding.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></span>
                                  {finding.description}
                                </div>
                              ))}
                              {result.findings.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{result.findings.length - 3} more findings
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {result.recommendations.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-700 mb-2">Recommendations</h5>
                            <div className="space-y-1">
                              {result.recommendations.slice(0, 2).map((rec) => (
                                <div key={rec.id} className="text-xs text-gray-600">
                                  • {rec.title}
                                </div>
                              ))}
                              {result.recommendations.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{result.recommendations.length - 2} more recommendations
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
