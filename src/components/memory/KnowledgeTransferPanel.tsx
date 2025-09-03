/**
 * Knowledge Transfer Panel Component
 * Interface for capturing and transferring expert knowledge
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { useKnowledgeItems, useLearningPaths, useLearningProgress } from '../../hooks/useKnowledgeTransfer';
import { 
  KnowledgeItem, 
  LearningPath, 
  UserProgress,
  KnowledgeType,
  KnowledgeStatus 
} from '../../services/knowledgeTransferService';

export interface KnowledgeTransferPanelProps {
  className?: string;
  userId?: string;
  showKnowledgeItems?: boolean;
  showLearningPaths?: boolean;
  showProgress?: boolean;
  onKnowledgeItemSelect?: (item: KnowledgeItem) => void;
  onLearningPathSelect?: (path: LearningPath) => void;
}

export function KnowledgeTransferPanel({
  className = '',
  userId,
  showKnowledgeItems = true,
  showLearningPaths = true,
  showProgress = true,
  onKnowledgeItemSelect,
  onLearningPathSelect,
}: KnowledgeTransferPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'knowledge' | 'paths' | 'progress'>('knowledge');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load knowledge items
  const {
    items: knowledgeItems,
    currentItem,
    loading: itemsLoading,
    error: itemsError,
    createItem,
    searchItems,
    clearError: clearItemsError,
  } = useKnowledgeItems({ status: 'published' }, userId);

  // Load learning paths
  const {
    paths: learningPaths,
    currentPath,
    loading: pathsLoading,
    error: pathsError,
    createPath,
    clearError: clearPathsError,
  } = useLearningPaths(userId);

  // Load progress
  const {
    progress: userProgress,
    loading: progressLoading,
    error: progressError,
    startPath,
    updateProgress,
    clearError: clearProgressError,
  } = useLearningProgress(userId);

  // Get knowledge type badge color
  const getKnowledgeTypeBadge = useCallback((type: KnowledgeType) => {
    const colors = {
      'best-practice': 'bg-green-100 text-green-800',
      'troubleshooting': 'bg-red-100 text-red-800',
      'optimization': 'bg-blue-100 text-blue-800',
      'safety': 'bg-yellow-100 text-yellow-800',
      'technique': 'bg-purple-100 text-purple-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  }, []);

  // Get status badge color
  const getStatusBadge = useCallback((status: KnowledgeStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      published: 'bg-blue-100 text-blue-800',
      archived: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }, []);

  // Get difficulty badge color
  const getDifficultyBadge = useCallback((difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  }, []);

  // Format duration
  const formatDuration = useCallback((minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  }, []);

  if ((itemsLoading || pathsLoading || progressLoading) && !knowledgeItems.length && !learningPaths.length) {
    return (
      <div className={`knowledge-transfer-panel ${className}`}>
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

  if (itemsError || pathsError || progressError) {
    return (
      <div className={`knowledge-transfer-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Knowledge Transfer Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{itemsError || pathsError || progressError}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    clearItemsError();
                    clearPathsError();
                    clearProgressError();
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
    <div className={`knowledge-transfer-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                Knowledge Transfer
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex space-x-1">
            {showKnowledgeItems && (
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'knowledge'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Knowledge Items
                {knowledgeItems.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {knowledgeItems.length}
                  </span>
                )}
              </button>
            )}
            {showLearningPaths && (
              <button
                onClick={() => setActiveTab('paths')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'paths'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Learning Paths
                {learningPaths.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {learningPaths.length}
                  </span>
                )}
              </button>
            )}
            {showProgress && (
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'progress'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Progress
                {userProgress.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {userProgress.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Knowledge Items Tab */}
          {activeTab === 'knowledge' && showKnowledgeItems && (
            <div className="space-y-4">
              {knowledgeItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No knowledge items</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start by creating your first knowledge item to share expertise.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create Knowledge Item
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {knowledgeItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onKnowledgeItemSelect?.(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {getKnowledgeTypeBadge(item.type)}
                            {getStatusBadge(item.status)}
                            {getDifficultyBadge(item.difficulty)}
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>By {item.authorName}</span>
                            <span>{formatDuration(item.estimatedReadTime)} read</span>
                            <span>{item.metadata.usageStats.viewCount} views</span>
                            <span>
                              {item.metadata.usageStats.averageRating > 0 && (
                                <>
                                  ⭐ {item.metadata.usageStats.averageRating.toFixed(1)}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {item.tags.slice(0, 5).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 5 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{item.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Learning Paths Tab */}
          {activeTab === 'paths' && showLearningPaths && (
            <div className="space-y-4">
              {learningPaths.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No learning paths</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create structured learning paths to guide knowledge transfer.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create Learning Path
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {learningPaths.map((path) => (
                    <div
                      key={path.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onLearningPathSelect?.(path)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {getDifficultyBadge(path.difficulty)}
                            {path.certification.available && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Certification
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            {path.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {path.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{path.knowledgeItems.length} items</span>
                            <span>{path.estimatedDuration}h duration</span>
                            <span>Created {path.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startPath(path.id);
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && showProgress && (
            <div className="space-y-4">
              {userProgress.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No learning progress</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start a learning path to track your progress.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userProgress.map((progress) => {
                    const path = learningPaths.find(p => p.id === progress.learningPathId);
                    return (
                      <div key={progress.learningPathId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            {path?.title || 'Unknown Path'}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            progress.status === 'completed' ? 'bg-green-100 text-green-800' :
                            progress.status === 'certified' ? 'bg-yellow-100 text-yellow-800' :
                            progress.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {progress.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(progress.overallProgress * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.overallProgress * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Started {progress.startedAt.toLocaleDateString()}</span>
                          <span>{formatDuration(progress.timeSpent)} spent</span>
                          {progress.completedAt && (
                            <span>Completed {progress.completedAt.toLocaleDateString()}</span>
                          )}
                        </div>

                        {/* Achievements */}
                        {progress.achievements.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {progress.achievements.map((achievement) => (
                                <div
                                  key={achievement.id}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                  title={achievement.description}
                                >
                                  🏆 {achievement.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
