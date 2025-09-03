/**
 * User Preferences Panel Component
 * Comprehensive settings interface for user preferences
 */

import React, { useState } from 'react';
import { useTheme } from '../../theme';
import { useUserPreferences, useFavoriteCalculators, useNotificationSettings, usePrivacySettings } from '../../hooks/useUserPreferences';
import { PreferenceCategory } from '../../services/userPreferencesService';

export interface UserPreferencesPanelProps {
  className?: string;
  onClose?: () => void;
}

export function UserPreferencesPanel({ 
  className = '', 
  onClose 
}: UserPreferencesPanelProps) {
  const { theme } = useTheme();
  const [state, actions] = useUserPreferences();
  const { favorites, toggleFavorite } = useFavoriteCalculators();
  const [notificationSettings, updateNotificationSettings] = useNotificationSettings();
  const [privacySettings, updatePrivacySettings] = usePrivacySettings();
  
  const [activeTab, setActiveTab] = useState<PreferenceCategory>('units');
  const [showImportExport, setShowImportExport] = useState(false);
  const [importData, setImportData] = useState('');

  // Handle preference updates
  const handleUnitChange = async (units: 'metric' | 'imperial') => {
    await actions.updatePreference('defaultUnits', units);
  };

  const handleConfidenceThresholdChange = async (threshold: number) => {
    await actions.updatePreference('confidenceThreshold', threshold);
  };

  const handleResetCategory = async (category: PreferenceCategory) => {
    if (confirm(`Are you sure you want to reset all ${category} preferences to defaults?`)) {
      await actions.resetCategory(category);
    }
  };

  const handleResetAll = async () => {
    if (confirm('Are you sure you want to reset ALL preferences to defaults? This cannot be undone.')) {
      await actions.resetPreferences();
    }
  };

  const handleExport = () => {
    const data = actions.exportPreferences();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laser-calc-preferences.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    try {
      await actions.importPreferences(importData);
      setImportData('');
      setShowImportExport(false);
      alert('Preferences imported successfully!');
    } catch (error) {
      alert('Failed to import preferences. Please check the file format.');
    }
  };

  const tabs: Array<{ id: PreferenceCategory; label: string; icon: string }> = [
    { id: 'units', label: 'Units & Display', icon: '📏' },
    { id: 'calculations', label: 'Calculations', icon: '🧮' },
    { id: 'interface', label: 'Interface', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' },
  ];

  if (state.loading) {
    return (
      <div className={`user-preferences-panel ${className}`}>
        <div className="bg-white border rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-preferences-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">User Preferences</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImportExport(!showImportExport)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Import/Export
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {state.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm">{state.error}</p>
              </div>
            </div>
          )}

          {/* Import/Export Panel */}
          {showImportExport && (
            <div className="mt-4 p-4 bg-gray-50 border rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Import/Export Preferences</h3>
              <div className="space-y-3">
                <div>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                  >
                    Export Preferences
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import Preferences (JSON)
                  </label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your preferences JSON here..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleImport}
                      disabled={!importData.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Import
                    </button>
                    <button
                      onClick={() => setImportData('')}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r bg-gray-50">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {/* Units & Display Tab */}
            {activeTab === 'units' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Units & Display</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Unit System
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="units"
                            value="metric"
                            checked={state.preferences.defaultUnits === 'metric'}
                            onChange={() => handleUnitChange('metric')}
                            className="mr-2"
                          />
                          <span>Metric (mm, kg, °C)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="units"
                            value="imperial"
                            checked={state.preferences.defaultUnits === 'imperial'}
                            onChange={() => handleUnitChange('imperial')}
                            className="mr-2"
                          />
                          <span>Imperial (inch, lb, °F)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleResetCategory('units')}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Reset Units Settings
                  </button>
                </div>
              </div>
            )}

            {/* Calculations Tab */}
            {activeTab === 'calculations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Auto-save calculations
                        </label>
                        <p className="text-sm text-gray-500">
                          Automatically save calculation results to history
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={state.preferences.autoSaveCalculations}
                        onChange={(e) => actions.updatePreference('autoSaveCalculations', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Show recommendations
                        </label>
                        <p className="text-sm text-gray-500">
                          Display AI-powered parameter recommendations
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={state.preferences.showRecommendations}
                        onChange={(e) => actions.updatePreference('showRecommendations', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recommendation Confidence Threshold: {Math.round(state.preferences.confidenceThreshold * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={state.preferences.confidenceThreshold}
                        onChange={(e) => handleConfidenceThresholdChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Show all</span>
                        <span>High confidence only</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleResetCategory('calculations')}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Reset Calculation Settings
                  </button>
                </div>
              </div>
            )}

            {/* Interface Tab */}
            {activeTab === 'interface' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Interface Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favorite Calculators ({favorites.length})
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Your favorite calculators will appear at the top of lists
                    </p>
                    
                    {favorites.length > 0 ? (
                      <div className="space-y-2">
                        {favorites.map((calculatorType) => (
                          <div key={calculatorType} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-900">{calculatorType}</span>
                            <button
                              onClick={() => toggleFavorite(calculatorType)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No favorite calculators yet. Use the star icon on calculators to add them here.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleResetCategory('interface')}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Reset Interface Settings
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          New recommendations
                        </label>
                        <p className="text-sm text-gray-500">
                          Notify when new parameter recommendations are available
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.newRecommendations}
                        onChange={(e) => updateNotificationSettings({ newRecommendations: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Parameter optimizations
                        </label>
                        <p className="text-sm text-gray-500">
                          Notify about potential parameter improvements
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.parameterOptimizations}
                        onChange={(e) => updateNotificationSettings({ parameterOptimizations: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Team updates
                        </label>
                        <p className="text-sm text-gray-500">
                          Notify about team activity and shared parameters
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.teamUpdates}
                        onChange={(e) => updateNotificationSettings({ teamUpdates: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          System updates
                        </label>
                        <p className="text-sm text-gray-500">
                          Notify about system updates and new features
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.systemUpdates}
                        onChange={(e) => updateNotificationSettings({ systemUpdates: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleResetCategory('notifications')}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Reset Notification Settings
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Share usage data
                        </label>
                        <p className="text-sm text-gray-500">
                          Help improve the platform by sharing anonymous usage data
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.shareUsageData}
                        onChange={(e) => updatePrivacySettings({ shareUsageData: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Allow team sharing
                        </label>
                        <p className="text-sm text-gray-500">
                          Allow sharing of parameters and calculations with team members
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.allowTeamSharing}
                        onChange={(e) => updatePrivacySettings({ allowTeamSharing: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Anonymous analytics
                        </label>
                        <p className="text-sm text-gray-500">
                          Allow collection of anonymous analytics data
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacySettings.anonymousAnalytics}
                        onChange={(e) => updatePrivacySettings({ anonymousAnalytics: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data retention: {privacySettings.dataRetentionDays} days
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="365"
                        step="30"
                        value={privacySettings.dataRetentionDays}
                        onChange={(e) => updatePrivacySettings({ dataRetentionDays: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>30 days</span>
                        <span>1 year</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleResetCategory('privacy')}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition-colors"
                  >
                    Reset Privacy Settings
                  </button>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex">
                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Resetting all preferences will permanently delete your current settings and cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={handleResetAll}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Reset All Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
