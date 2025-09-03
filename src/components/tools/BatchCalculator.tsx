// 批量计算器组件 - Phase 3: 功能增强与扩展
// 支持多个项目的批量计算和对比分析

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  PlayIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { enhancedCalculationEngine, BasicCalculationInputs, BasicCalculationResults } from '../../services/enhancedCalculationEngine';
import { dataExportService } from '../../services/dataExportService';

interface BatchItem {
  id: string;
  name: string;
  inputs: BasicCalculationInputs;
  results?: BasicCalculationResults;
  status: 'pending' | 'calculating' | 'completed' | 'error';
  error?: string;
}

interface BatchCalculatorProps {
  onResultsReady?: (results: BatchItem[]) => void;
}

export const BatchCalculator: React.FC<BatchCalculatorProps> = ({ onResultsReady }) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);

  // 添加新的批量项目
  const addBatchItem = useCallback(() => {
    const newItem: BatchItem = {
      id: `batch_${Date.now()}`,
      name: `Project ${batchItems.length + 1}`,
      inputs: {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      },
      status: 'pending'
    };
    setBatchItems(prev => [...prev, newItem]);
  }, [batchItems.length]);

  // 删除批量项目
  const removeBatchItem = useCallback((id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // 更新批量项目
  const updateBatchItem = useCallback((id: string, updates: Partial<BatchItem>) => {
    setBatchItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // 执行批量计算
  const executeBatchCalculation = useCallback(async () => {
    if (batchItems.length === 0) return;

    setIsCalculating(true);
    
    // 重置所有项目状态
    setBatchItems(prev => prev.map(item => ({ 
      ...item, 
      status: 'calculating' as const,
      results: undefined,
      error: undefined
    })));

    // 逐个计算每个项目
    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      
      try {
        const results = enhancedCalculationEngine.calculateCost(item.inputs);
        
        setBatchItems(prev => prev.map(batchItem => 
          batchItem.id === item.id 
            ? { ...batchItem, results, status: 'completed' as const }
            : batchItem
        ));
        
        // 添加小延迟以显示进度
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        setBatchItems(prev => prev.map(batchItem => 
          batchItem.id === item.id 
            ? { 
                ...batchItem, 
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Calculation failed'
              }
            : batchItem
        ));
      }
    }

    setIsCalculating(false);
    
    // 通知父组件结果已准备好
    if (onResultsReady) {
      const completedItems = batchItems.filter(item => item.status === 'completed');
      onResultsReady(completedItems);
    }
  }, [batchItems, onResultsReady]);

  // 生成对比分析
  const generateComparison = useCallback(() => {
    const completedItems = batchItems.filter(item => item.results);
    
    if (completedItems.length < 2) {
      alert('Need at least 2 completed calculations for comparison');
      return;
    }

    const comparison = {
      summary: {
        totalProjects: completedItems.length,
        totalCost: completedItems.reduce((sum, item) => sum + (item.results?.totalCost || 0), 0),
        totalTime: completedItems.reduce((sum, item) => sum + (item.results?.totalTime || 0), 0),
        averageCost: 0,
        averageTime: 0
      },
      projects: completedItems.map(item => ({
        name: item.name,
        inputs: item.inputs,
        results: item.results,
        costPerUnit: (item.results?.totalCost || 0) / item.inputs.quantity,
        timePerUnit: (item.results?.totalTime || 0) / item.inputs.quantity
      })),
      insights: [] as string[]
    };

    comparison.summary.averageCost = comparison.summary.totalCost / completedItems.length;
    comparison.summary.averageTime = comparison.summary.totalTime / completedItems.length;

    // 生成洞察
    const costs = completedItems.map(item => item.results?.totalCost || 0);
    const times = completedItems.map(item => item.results?.totalTime || 0);
    
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    const cheapestProject = completedItems.find(item => item.results?.totalCost === minCost);
    const fastestProject = completedItems.find(item => item.results?.totalTime === minTime);
    
    if (cheapestProject) {
      comparison.insights.push(`${cheapestProject.name} has the lowest cost at $${minCost.toFixed(2)}`);
    }
    
    if (fastestProject) {
      comparison.insights.push(`${fastestProject.name} has the shortest time at ${minTime.toFixed(2)} minutes`);
    }
    
    if (maxCost > minCost * 1.5) {
      comparison.insights.push(`Cost variation is significant (${((maxCost - minCost) / minCost * 100).toFixed(1)}% difference)`);
    }

    setComparisonData(comparison);
    setShowComparison(true);
  }, [batchItems]);

  // 导出批量结果
  const exportBatchResults = useCallback(async () => {
    const completedItems = batchItems.filter(item => item.results);
    
    if (completedItems.length === 0) {
      alert('No completed calculations to export');
      return;
    }

    const exportData = {
      projectName: 'Batch Calculation Results',
      timestamp: new Date(),
      calculations: completedItems.map(item => ({
        calculatorType: 'laser-cutting-cost',
        inputs: item.inputs,
        results: item.results!,
        notes: item.name
      })),
      summary: {
        totalCost: completedItems.reduce((sum, item) => sum + (item.results?.totalCost || 0), 0),
        totalTime: completedItems.reduce((sum, item) => sum + (item.results?.totalTime || 0), 0),
        materialCount: completedItems.length,
        averageUtilization: 85 // 简化值
      }
    };

    try {
      const blob = await dataExportService.exportToExcel(exportData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'batch_calculation_results.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }, [batchItems]);

  const getStatusIcon = (status: BatchItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'calculating':
        return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const completedCount = batchItems.filter(item => item.status === 'completed').length;
  const errorCount = batchItems.filter(item => item.status === 'error').length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch Calculator</h2>
        <p className="text-gray-600">Calculate multiple projects simultaneously and compare results</p>
      </div>

      {/* Control Panel */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={addBatchItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Project
        </button>
        
        <button
          onClick={executeBatchCalculation}
          disabled={batchItems.length === 0 || isCalculating}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <PlayIcon className="w-4 h-4 mr-2" />
          {isCalculating ? 'Calculating...' : 'Calculate All'}
        </button>
        
        <button
          onClick={generateComparison}
          disabled={completedCount < 2}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <DocumentChartBarIcon className="w-4 h-4 mr-2" />
          Compare Results
        </button>
        
        <button
          onClick={exportBatchResults}
          disabled={completedCount === 0}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Export Results
        </button>
      </div>

      {/* Progress Summary */}
      {batchItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span>Progress: {completedCount + errorCount} / {batchItems.length} projects</span>
            <div className="flex space-x-4">
              <span className="text-green-600">✓ {completedCount} completed</span>
              {errorCount > 0 && <span className="text-red-600">✗ {errorCount} errors</span>}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((completedCount + errorCount) / batchItems.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Batch Items List */}
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {batchItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateBatchItem(item.id, { name: e.target.value })}
                    className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  />
                </div>
                <button
                  onClick={() => removeBatchItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Material</label>
                  <select
                    value={item.inputs.material}
                    onChange={(e) => updateBatchItem(item.id, { 
                      inputs: { ...item.inputs, material: e.target.value }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="steel">Steel</option>
                    <option value="aluminum">Aluminum</option>
                    <option value="stainless_steel">Stainless Steel</option>
                    <option value="copper">Copper</option>
                    <option value="brass">Brass</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Thickness (mm)</label>
                  <input
                    type="number"
                    value={item.inputs.thickness}
                    onChange={(e) => updateBatchItem(item.id, { 
                      inputs: { ...item.inputs, thickness: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Length (mm)</label>
                  <input
                    type="number"
                    value={item.inputs.length}
                    onChange={(e) => updateBatchItem(item.id, { 
                      inputs: { ...item.inputs, length: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width (mm)</label>
                  <input
                    type="number"
                    value={item.inputs.width}
                    onChange={(e) => updateBatchItem(item.id, { 
                      inputs: { ...item.inputs, width: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={item.inputs.quantity}
                    onChange={(e) => updateBatchItem(item.id, { 
                      inputs: { ...item.inputs, quantity: parseInt(e.target.value) || 1 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Results Display */}
              {item.results && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Total Cost:</span>
                      <div className="font-medium text-green-700">${item.results.totalCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Time:</span>
                      <div className="font-medium text-green-700">{item.results.totalTime.toFixed(1)} min</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Material Cost:</span>
                      <div className="font-medium text-green-700">${item.results.materialCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Labor Cost:</span>
                      <div className="font-medium text-green-700">${item.results.laborCost.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {item.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="text-sm text-red-700">
                    <strong>Error:</strong> {item.error}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {batchItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <DocumentChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No projects added yet</p>
          <p className="text-sm">Click "Add Project" to start batch calculations</p>
        </div>
      )}

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && comparisonData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Batch Comparison Analysis</h3>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Total Projects</div>
                  <div className="text-2xl font-bold text-blue-900">{comparisonData.summary.totalProjects}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Total Cost</div>
                  <div className="text-2xl font-bold text-green-900">${comparisonData.summary.totalCost.toFixed(2)}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600">Total Time</div>
                  <div className="text-2xl font-bold text-purple-900">{comparisonData.summary.totalTime.toFixed(1)} min</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600">Avg Cost</div>
                  <div className="text-2xl font-bold text-orange-900">${comparisonData.summary.averageCost.toFixed(2)}</div>
                </div>
              </div>

              {/* Insights */}
              {comparisonData.insights.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Key Insights</h4>
                  <ul className="space-y-2">
                    {comparisonData.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Project Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Project</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Material</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Dimensions</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Total Cost</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Cost/Unit</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Time/Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.projects.map((project: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{project.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{project.inputs.material}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {project.inputs.length} × {project.inputs.width} × {project.inputs.thickness}mm
                        </td>
                        <td className="border border-gray-300 px-4 py-2">${project.results.totalCost.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">${project.costPerUnit.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">{project.timePerUnit.toFixed(1)} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatchCalculator;
