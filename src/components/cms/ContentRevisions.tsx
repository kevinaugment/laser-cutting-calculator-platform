/**
 * Content Revisions Component
 * Display and manage content revision history
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { ContentRevision, BlogPost } from '../../types/content';

export interface ContentRevisionsProps {
  postId: string;
  revisions: ContentRevision[];
  currentPost: BlogPost;
  onRestore: (revision: ContentRevision) => void;
  onCompare: (revisionA: ContentRevision, revisionB: ContentRevision) => void;
  className?: string;
}

export function ContentRevisions({
  postId,
  revisions,
  currentPost,
  onRestore,
  onCompare,
  className = '',
}: ContentRevisionsProps) {
  const { theme } = useTheme();
  const [selectedRevisions, setSelectedRevisions] = useState<string[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [expandedRevision, setExpandedRevision] = useState<string | null>(null);

  // Handle revision selection for comparison
  const handleRevisionSelect = useCallback((revisionId: string) => {
    setSelectedRevisions(prev => {
      if (prev.includes(revisionId)) {
        return prev.filter(id => id !== revisionId);
      } else if (prev.length < 2) {
        return [...prev, revisionId];
      } else {
        // Replace the first selection with the new one
        return [prev[1], revisionId];
      }
    });
  }, []);

  // Handle compare action
  const handleCompare = useCallback(() => {
    if (selectedRevisions.length === 2) {
      const revA = revisions.find(r => r.id === selectedRevisions[0]);
      const revB = revisions.find(r => r.id === selectedRevisions[1]);
      if (revA && revB) {
        onCompare(revA, revB);
        setShowDiff(true);
      }
    }
  }, [selectedRevisions, revisions, onCompare]);

  // Handle restore action
  const handleRestore = useCallback((revision: ContentRevision) => {
    if (confirm(`Are you sure you want to restore to version ${revision.version}? This will create a new revision.`)) {
      onRestore(revision);
    }
  }, [onRestore]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date),
    };
  };

  // Get relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get content preview
  const getContentPreview = (content: string, maxLength: number = 100) => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  // Sort revisions by version (newest first)
  const sortedRevisions = [...revisions].sort((a, b) => b.version - a.version);

  return (
    <div className={`content-revisions ${className}`}>
      <div className="bg-white border rounded-lg">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revision History</h3>
              <p className="text-sm text-gray-600 mt-1">
                {revisions.length} revision{revisions.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            {selectedRevisions.length === 2 && (
              <button
                onClick={handleCompare}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Compare Selected
              </button>
            )}
          </div>
          
          {selectedRevisions.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              {selectedRevisions.length === 1 
                ? 'Select another revision to compare'
                : `Comparing ${selectedRevisions.length} revisions`
              }
            </div>
          )}
        </div>

        {/* Current Version */}
        <div className="border-b bg-green-50">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Current
                  </span>
                  <span className="font-medium text-gray-900">
                    Version {currentPost.version}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(currentPost.updatedAt).relative}
                  </span>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-gray-900">{currentPost.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {getContentPreview(currentPost.content)}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {formatDate(currentPost.updatedAt).date} at {formatDate(currentPost.updatedAt).time}
              </div>
            </div>
          </div>
        </div>

        {/* Revision List */}
        <div className="divide-y">
          {sortedRevisions.map((revision) => {
            const isSelected = selectedRevisions.includes(revision.id);
            const isExpanded = expandedRevision === revision.id;
            const formatted = formatDate(revision.createdAt);
            
            return (
              <div
                key={revision.id}
                className={`transition-colors ${
                  isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRevisionSelect(revision.id)}
                        className="mt-1 rounded border-gray-300"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">
                            Version {revision.version}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatted.relative}
                          </span>
                          {revision.changeDescription && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {revision.changeDescription}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-900">{revision.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {getContentPreview(revision.content)}
                          </p>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">Full Content</h5>
                                <div 
                                  className="mt-1 text-sm text-gray-700 prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: revision.content }}
                                />
                              </div>
                              
                              {revision.contentMarkdown && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">Markdown</h5>
                                  <pre className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                                    {revision.contentMarkdown}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-gray-500">
                        {formatted.date} at {formatted.time}
                      </span>
                      
                      <button
                        onClick={() => setExpandedRevision(isExpanded ? null : revision.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleRestore(revision)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        title="Restore this version"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {revisions.length === 0 && (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Revisions Yet</h3>
            <p className="text-gray-500">
              Revisions will appear here as you make changes to your content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
