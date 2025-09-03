/**
 * Memory System Panel Component
 * Unified interface for all memory system features
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { CalculationHistoryPanel } from './CalculationHistoryPanel';
import { ParameterPresetPanel } from './ParameterPresetPanel';
import { UserPreferencesPanel } from './UserPreferencesPanel';
import { HistoryStatsWidget } from './HistoryStatsWidget';

export interface MemorySystemPanelProps {
  calculatorType?: string;
  currentParameters?: Record<string, any>;
  onParametersApply?: (parameters: Record<string, any>) => void;
  onPreferencesChange?: (preferences: any) => void;
  className?: string;
  defaultTab?: 'history' | 'presets' | 'preferences' | 'stats';
}

type TabType = 'history' | 'presets' | 'preferences' | 'stats';

export function MemorySystemPanel({
  calculatorType,
  currentParameters,
  onParametersApply,
  onPreferencesChange,
  className = '',
  defaultTab = 'history',
}: MemorySystemPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  // Handle tab switching
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // Handle parameter application from presets
  const handleParametersApply = useCallback((parameters: Record<string, any>) => {
    onParametersApply?.(parameters);
  }, [onParametersApply]);

  // Handle preferences changes
  const handlePreferencesChange = useCallback((preferences: any) => {
    onPreferencesChange?.(preferences);
  }, [onPreferencesChange]);

  // Tab configuration
  const tabs = [
    {
      id: 'history' as TabType,
      label: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'View calculation history and results',
    },
    {
      id: 'presets' as TabType,
      label: 'Presets',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'Manage parameter presets and templates',
    },
    {
      id: 'preferences' as TabType,
      label: 'Preferences',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'Configure user preferences and settings',
    },
    {
      id: 'stats' as TabType,
      label: 'Statistics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'View usage statistics and insights',
    },
  ];

  return (
    <div className={`memory-system-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header with Tabs */}
        <div className="border-b">
          <div className="px-4 py-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Memory System
            </h2>
            <p className="text-sm text-gray-600">
              Manage your calculation history, presets, and preferences
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="px-4">
            <nav className="flex space-x-8" aria-label="Memory System Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  title={tab.description}
                >
                  <span className={`mr-2 transition-colors ${
                    activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          {activeTab === 'history' && (
            <div className="p-4">
              <CalculationHistoryPanel
                calculatorType={calculatorType}
                showFilters={true}
                showExport={true}
                className="border-0 shadow-none"
              />
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="p-4">
              <ParameterPresetPanel
                calculatorType={calculatorType}
                onPresetApply={handleParametersApply}
                className="border-0 shadow-none"
              />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="p-4">
              <UserPreferencesPanel
                onPreferencesChange={handlePreferencesChange}
                className="border-0 shadow-none"
              />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Usage Statistics
                  </h3>
                  <HistoryStatsWidget
                    calculatorType={calculatorType}
                    showDetails={true}
                    className="border-0 shadow-none"
                  />
                </div>

                {/* Additional Stats Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Quick Stats
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Calculations:</span>
                        <span className="font-medium text-gray-900">-</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Saved Presets:</span>
                        <span className="font-medium text-gray-900">-</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Most Used Calculator:</span>
                        <span className="font-medium text-gray-900">-</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Recent Activity
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        No recent activity to display
                      </div>
                    </div>
                  </div>
                </div>

                {/* Memory Usage Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        Memory System Tips
                      </h4>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Save frequently used parameter combinations as presets</li>
                          <li>Use the history to track your calculation patterns</li>
                          <li>Configure preferences to customize your experience</li>
                          <li>Export your data for backup and analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick Access Memory Widget for embedding in calculators
export interface MemoryQuickAccessProps {
  calculatorType: string;
  currentParameters?: Record<string, any>;
  onParametersApply?: (parameters: Record<string, any>) => void;
  className?: string;
}

export function MemoryQuickAccess({
  calculatorType,
  currentParameters,
  onParametersApply,
  className = '',
}: MemoryQuickAccessProps) {
  const [showPanel, setShowPanel] = useState(false);

  const handleTogglePanel = useCallback(() => {
    setShowPanel(!showPanel);
  }, [showPanel]);

  return (
    <div className={`memory-quick-access ${className}`}>
      {/* Quick Access Button */}
      <button
        onClick={handleTogglePanel}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        title="Open Memory System"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Memory
      </button>

      {/* Expandable Panel */}
      {showPanel && (
        <div className="absolute z-50 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Memory System
              </h3>
              <button
                onClick={handleTogglePanel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <MemorySystemPanel
              calculatorType={calculatorType}
              currentParameters={currentParameters}
              onParametersApply={onParametersApply}
              className="border-0 shadow-none"
              defaultTab="presets"
            />
          </div>
        </div>
      )}
    </div>
  );
}
