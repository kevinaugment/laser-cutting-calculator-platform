/**
 * Publish Scheduler Component
 * Schedule posts for future publication with advanced options
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../../theme';
import { BlogPost, BlogPostStatus } from '../../types/content';

export interface PublishSchedulerProps {
  post: Partial<BlogPost>;
  onStatusChange: (status: BlogPostStatus, publishedAt?: string) => void;
  onSave: () => void;
  onPublish: () => void;
  className?: string;
}

interface ScheduleOption {
  value: string;
  label: string;
  description: string;
}

export function PublishScheduler({
  post,
  onStatusChange,
  onSave,
  onPublish,
  className = '',
}: PublishSchedulerProps) {
  const { theme } = useTheme();
  const [scheduleType, setScheduleType] = useState<'now' | 'later' | 'draft'>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Initialize with current post data
  useEffect(() => {
    if (post.status === 'published') {
      setScheduleType('now');
    } else if (post.status === 'scheduled' && post.publishedAt) {
      setScheduleType('later');
      const publishDate = new Date(post.publishedAt);
      setScheduledDate(publishDate.toISOString().split('T')[0]);
      setScheduledTime(publishDate.toTimeString().slice(0, 5));
    } else {
      setScheduleType('draft');
    }
  }, [post.status, post.publishedAt]);

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get current time
  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5);
  };

  // Handle schedule type change
  const handleScheduleTypeChange = useCallback((type: 'now' | 'later' | 'draft') => {
    setScheduleType(type);
    
    if (type === 'later' && !scheduledDate) {
      // Set default to tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      setScheduledDate(tomorrow.toISOString().split('T')[0]);
      setScheduledTime('09:00');
    }
  }, [scheduledDate]);

  // Handle publish action
  const handlePublish = useCallback(() => {
    switch (scheduleType) {
      case 'now':
        onStatusChange('published', new Date().toISOString());
        onPublish();
        break;
      case 'later':
        if (scheduledDate && scheduledTime) {
          const publishDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
          onStatusChange('scheduled', publishDateTime.toISOString());
          onSave();
        }
        break;
      case 'draft':
        onStatusChange('draft');
        onSave();
        break;
    }
  }, [scheduleType, scheduledDate, scheduledTime, onStatusChange, onPublish, onSave]);

  // Validate scheduled time
  const isValidSchedule = () => {
    if (scheduleType !== 'later') return true;
    
    if (!scheduledDate || !scheduledTime) return false;
    
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();
    
    return scheduledDateTime > now;
  };

  // Get schedule summary
  const getScheduleSummary = () => {
    switch (scheduleType) {
      case 'now':
        return 'Publish immediately';
      case 'later':
        if (scheduledDate && scheduledTime) {
          const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
          return `Scheduled for ${scheduledDateTime.toLocaleDateString()} at ${scheduledDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return 'Schedule for later';
      case 'draft':
        return 'Save as draft';
    }
  };

  // Get popular publishing times
  const getPopularTimes = () => [
    { time: '09:00', label: '9:00 AM', description: 'Morning commute' },
    { time: '12:00', label: '12:00 PM', description: 'Lunch break' },
    { time: '15:00', label: '3:00 PM', description: 'Afternoon break' },
    { time: '18:00', label: '6:00 PM', description: 'Evening commute' },
    { time: '20:00', label: '8:00 PM', description: 'Evening reading' },
  ];

  return (
    <div className={`publish-scheduler ${className}`}>
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Publish Settings</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose when to publish your post
            </p>
          </div>
          
          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              post.status === 'published' ? 'bg-green-100 text-green-800' :
              post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {post.status || 'draft'}
            </span>
          </div>
        </div>

        {/* Schedule Options */}
        <div className="space-y-4 mb-6">
          {/* Publish Now */}
          <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="schedule-type"
              value="now"
              checked={scheduleType === 'now'}
              onChange={() => handleScheduleTypeChange('now')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Publish Now</div>
              <div className="text-sm text-gray-600">
                Make your post live immediately
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleString()}
            </div>
          </label>

          {/* Schedule for Later */}
          <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="schedule-type"
              value="later"
              checked={scheduleType === 'later'}
              onChange={() => handleScheduleTypeChange('later')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Schedule for Later</div>
              <div className="text-sm text-gray-600">
                Choose a specific date and time to publish
              </div>
              
              {scheduleType === 'later' && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={getMinDate()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Popular Times */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Popular Publishing Times
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getPopularTimes().map((timeOption) => (
                        <button
                          key={timeOption.time}
                          onClick={() => setScheduledTime(timeOption.time)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            scheduledTime === timeOption.time
                              ? 'bg-primary-100 text-primary-800 border-primary-200'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                          title={timeOption.description}
                        >
                          {timeOption.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Validation Message */}
                  {scheduledDate && scheduledTime && !isValidSchedule() && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Scheduled time must be in the future
                    </div>
                  )}
                </div>
              )}
            </div>
          </label>

          {/* Save as Draft */}
          <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="schedule-type"
              value="draft"
              checked={scheduleType === 'draft'}
              onChange={() => handleScheduleTypeChange('draft')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">Save as Draft</div>
              <div className="text-sm text-gray-600">
                Keep working on your post without publishing
              </div>
            </div>
          </label>
        </div>

        {/* Advanced Options */}
        <div className="border-t pt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mb-4"
          >
            <span>Advanced Publishing Options</span>
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Auto-publish Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Auto-publish Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      Send notification email when published
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      Share on social media automatically
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      Update sitemap after publishing
                    </span>
                  </label>
                </div>
              </div>

              {/* Publishing History */}
              {post.publishedAt && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Publishing History</h4>
                  <div className="text-sm text-gray-600">
                    <p>Originally published: {new Date(post.publishedAt).toLocaleString()}</p>
                    {post.updatedAt && post.updatedAt !== post.publishedAt && (
                      <p>Last updated: {new Date(post.updatedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Summary */}
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {getScheduleSummary()}
              </p>
              {scheduleType === 'later' && scheduledDate && scheduledTime && isValidSchedule() && (
                <p className="text-xs text-gray-500 mt-1">
                  Your post will be automatically published at the scheduled time
                </p>
              )}
            </div>
            
            <button
              onClick={handlePublish}
              disabled={scheduleType === 'later' && !isValidSchedule()}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                scheduleType === 'now'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : scheduleType === 'later'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {scheduleType === 'now' ? 'Publish Now' :
               scheduleType === 'later' ? 'Schedule Post' :
               'Save Draft'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
