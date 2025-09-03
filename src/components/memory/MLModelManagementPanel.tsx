/**
 * ML Model Management Panel Component
 * Interface for managing ML models, deployments, and monitoring
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { 
  useModelManagement, 
  useModelMonitoring, 
  useModelInference 
} from '../../hooks/useMLModels';
import { MLModel, ModelStatus, ModelType } from '../../services/mlModelService';

export interface MLModelManagementPanelProps {
  className?: string;
  showModelList?: boolean;
  showMonitoring?: boolean;
  showInference?: boolean;
  onModelSelect?: (model: MLModel) => void;
}

export function MLModelManagementPanel({
  className = '',
  showModelList = true,
  showMonitoring = true,
  showInference = true,
  onModelSelect,
}: MLModelManagementPanelProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'models' | 'monitoring' | 'inference'>('models');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [inferenceInput, setInferenceInput] = useState<string>('');

  // Load model management data
  const {
    models,
    deployedModels,
    currentModel,
    loading: modelsLoading,
    error: modelsError,
    deployModel,
    rollbackModel,
    getModel,
    clearError: clearModelsError,
  } = useModelManagement();

  // Load monitoring data
  const {
    monitoring,
    modelMonitoring,
    loading: monitoringLoading,
    error: monitoringError,
    checkModelHealth,
    clearError: clearMonitoringError,
  } = useModelMonitoring(selectedModelId || undefined);

  // Load inference functionality
  const {
    currentPrediction,
    loading: inferenceLoading,
    error: inferenceError,
    predict,
    clearError: clearInferenceError,
  } = useModelInference();

  // Get status badge color
  const getStatusBadge = useCallback((status: ModelStatus) => {
    const colors = {
      training: 'bg-yellow-100 text-yellow-800',
      validating: 'bg-blue-100 text-blue-800',
      deployed: 'bg-green-100 text-green-800',
      deprecated: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }, []);

  // Get type badge color
  const getTypeBadge = useCallback((type: ModelType) => {
    const colors = {
      recommendation: 'bg-purple-100 text-purple-800',
      'pattern-recognition': 'bg-indigo-100 text-indigo-800',
      optimization: 'bg-green-100 text-green-800',
      prediction: 'bg-blue-100 text-blue-800',
      classification: 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  }, []);

  // Format percentage
  const formatPercentage = useCallback((value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  }, []);

  // Format number
  const formatNumber = useCallback((value: number, decimals: number = 1) => {
    return value.toFixed(decimals);
  }, []);

  // Handle model selection
  const handleModelSelect = useCallback((model: MLModel) => {
    setSelectedModelId(model.id);
    onModelSelect?.(model);
  }, [onModelSelect]);

  // Handle deploy model
  const handleDeployModel = useCallback(async (modelId: string) => {
    try {
      await deployModel(modelId);
    } catch (error) {
      console.error('Failed to deploy model:', error);
    }
  }, [deployModel]);

  // Handle rollback model
  const handleRollbackModel = useCallback(async (modelId: string) => {
    try {
      await rollbackModel(modelId);
    } catch (error) {
      console.error('Failed to rollback model:', error);
    }
  }, [rollbackModel]);

  // Handle inference
  const handleInference = useCallback(async () => {
    if (!selectedModelId || !inferenceInput.trim()) return;

    try {
      const input = JSON.parse(inferenceInput);
      await predict(selectedModelId, input);
    } catch (error) {
      console.error('Failed to make prediction:', error);
    }
  }, [selectedModelId, inferenceInput, predict]);

  if ((modelsLoading || monitoringLoading) && !models.length && !monitoring.length) {
    return (
      <div className={`ml-model-management-panel ${className}`}>
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

  if (modelsError || monitoringError || inferenceError) {
    return (
      <div className={`ml-model-management-panel ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ML Model Management Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{modelsError || monitoringError || inferenceError}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    clearModelsError();
                    clearMonitoringError();
                    clearInferenceError();
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
    <div className={`ml-model-management-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                ML Model Management
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              {deployedModels.length} deployed, {models.length} total
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex space-x-1">
            {showModelList && (
              <button
                onClick={() => setActiveTab('models')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'models'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Models
                {models.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {models.length}
                  </span>
                )}
              </button>
            )}
            {showMonitoring && (
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'monitoring'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monitoring
                {monitoring.length > 0 && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {monitoring.length}
                  </span>
                )}
              </button>
            )}
            {showInference && (
              <button
                onClick={() => setActiveTab('inference')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'inference'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Inference
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Models Tab */}
          {activeTab === 'models' && showModelList && (
            <div className="space-y-4">
              {models.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No ML models</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Register your first ML model to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        selectedModelId === model.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleModelSelect(model)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeBadge(model.type)}
                            {getStatusBadge(model.status)}
                            <span className="text-xs text-gray-500">v{model.version}</span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            {model.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {model.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Framework: {model.framework}</span>
                            {model.performance.accuracy && (
                              <span>Accuracy: {formatPercentage(model.performance.accuracy)}</span>
                            )}
                            <span>Created: {model.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4 space-x-2">
                          {model.status !== 'deployed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeployModel(model.id);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              Deploy
                            </button>
                          )}
                          {model.status === 'deployed' && model.deployment.rollback.enabled && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRollbackModel(model.id);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Rollback
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      {model.performance && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {model.performance.accuracy && (
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Accuracy</p>
                              <p className="text-sm font-medium">{formatPercentage(model.performance.accuracy)}</p>
                            </div>
                          )}
                          {model.performance.precision && (
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Precision</p>
                              <p className="text-sm font-medium">{formatPercentage(model.performance.precision)}</p>
                            </div>
                          )}
                          {model.performance.recall && (
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Recall</p>
                              <p className="text-sm font-medium">{formatPercentage(model.performance.recall)}</p>
                            </div>
                          )}
                          {model.performance.f1Score && (
                            <div className="text-center">
                              <p className="text-xs text-gray-500">F1 Score</p>
                              <p className="text-sm font-medium">{formatPercentage(model.performance.f1Score)}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && showMonitoring && (
            <div className="space-y-4">
              {monitoring.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No monitoring data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Deploy models to see monitoring data.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {monitoring.map((monitor) => {
                    const model = models.find(m => m.id === monitor.modelId);
                    return (
                      <div key={monitor.modelId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {model?.name || monitor.modelId}
                          </h4>
                          <span className="text-sm text-gray-500">
                            Last updated: {monitor.lastUpdated.toLocaleString()}
                          </span>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Requests</p>
                            <p className="text-lg font-medium">{monitor.metrics.requestCount}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Avg Latency</p>
                            <p className="text-lg font-medium">{formatNumber(monitor.metrics.averageLatency)}ms</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Error Rate</p>
                            <p className="text-lg font-medium">{formatPercentage(monitor.metrics.errorRate)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Throughput</p>
                            <p className="text-lg font-medium">{formatNumber(monitor.metrics.throughput)} req/s</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Accuracy</p>
                            <p className="text-lg font-medium">{formatPercentage(monitor.metrics.accuracy)}</p>
                          </div>
                        </div>

                        {/* Drift Detection */}
                        {monitor.driftDetection.detected && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-yellow-800">Data Drift Detected</p>
                                <p className="text-sm text-yellow-700">
                                  Score: {formatNumber(monitor.driftDetection.score, 3)} | {monitor.driftDetection.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Alerts */}
                        {monitor.alerts.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-900">Active Alerts</h5>
                            {monitor.alerts.filter(alert => !alert.resolved).map((alert) => (
                              <div key={alert.id} className={`border-l-4 p-3 rounded-md ${
                                alert.severity === 'critical' ? 'bg-red-50 border-red-400' :
                                alert.severity === 'high' ? 'bg-orange-50 border-orange-400' :
                                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                                'bg-blue-50 border-blue-400'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">{alert.message}</p>
                                    <p className="text-xs text-gray-600">
                                      Threshold: {alert.threshold} | Current: {formatNumber(alert.currentValue)}
                                    </p>
                                  </div>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {alert.severity.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Inference Tab */}
          {activeTab === 'inference' && showInference && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Model Inference</h4>
                
                {/* Model Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Model
                  </label>
                  <select
                    value={selectedModelId || ''}
                    onChange={(e) => setSelectedModelId(e.target.value || null)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a deployed model...</option>
                    {deployedModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} (v{model.version})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input (JSON)
                  </label>
                  <textarea
                    value={inferenceInput}
                    onChange={(e) => setInferenceInput(e.target.value)}
                    placeholder='{"material": "steel", "thickness": 5, "quality": "high"}'
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleInference}
                  disabled={!selectedModelId || !inferenceInput.trim() || inferenceLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inferenceLoading ? 'Processing...' : 'Make Prediction'}
                </button>
              </div>

              {/* Prediction Result */}
              {currentPrediction && (
                <div className="bg-white border rounded-lg p-4">
                  <h5 className="text-lg font-medium text-gray-900 mb-3">Prediction Result</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Confidence</p>
                      <p className="text-lg font-medium">{formatPercentage(currentPrediction.confidence)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Latency</p>
                      <p className="text-lg font-medium">{formatNumber(currentPrediction.latency)}ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Model Version</p>
                      <p className="text-lg font-medium">v{currentPrediction.modelVersion}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Input:</p>
                      <pre className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(currentPrediction.input, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Output:</p>
                      <pre className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(currentPrediction.output, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
