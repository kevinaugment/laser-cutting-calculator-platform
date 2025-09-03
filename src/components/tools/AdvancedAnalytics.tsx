// 高级分析工具组件 - Phase 3: 功能增强与扩展
// 提供参数敏感性分析、成本优化和趋势分析功能

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CogIcon, 
  TrendingUpIcon,
  LightBulbIcon,
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { enhancedCalculationEngine, BasicCalculationInputs } from '../../services/enhancedCalculationEngine';

interface SensitivityResult {
  parameter: string;
  baseValue: number;
  variations: Array<{
    value: number;
    cost: number;
    time: number;
    change: number;
  }>;
  sensitivity: number;
  impact: 'low' | 'medium' | 'high';
}

interface OptimizationResult {
  parameter: string;
  currentValue: number;
  optimizedValue: number;
  improvement: number;
  reasoning: string;
}

interface AdvancedAnalyticsProps {
  baseInputs: BasicCalculationInputs;
  onOptimizationApply?: (optimizedInputs: BasicCalculationInputs) => void;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ 
  baseInputs, 
  onOptimizationApply 
}) => {
  const [activeTab, setActiveTab] = useState<'sensitivity' | 'optimization' | 'trends'>('sensitivity');
  const [sensitivityResults, setSensitivityResults] = useState<SensitivityResult[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<string>('thickness');

  // 参数定义
  const parameters = [
    { key: 'thickness', name: 'Thickness', unit: 'mm', min: 0.5, max: 20, step: 0.5 },
    { key: 'length', name: 'Length', unit: 'mm', min: 10, max: 1000, step: 10 },
    { key: 'width', name: 'Width', unit: 'mm', min: 10, max: 1000, step: 10 },
    { key: 'quantity', name: 'Quantity', unit: 'pcs', min: 1, max: 100, step: 1 }
  ];

  // 执行敏感性分析
  const performSensitivityAnalysis = async () => {
    setIsAnalyzing(true);
    const results: SensitivityResult[] = [];

    for (const param of parameters) {
      const baseValue = baseInputs[param.key as keyof BasicCalculationInputs] as number;
      const variations = [];
      
      // 生成变化范围 (-50% to +50%)
      const range = Math.max(baseValue * 0.5, param.step * 5);
      const steps = 11; // 11个点，包括基准值
      
      for (let i = 0; i < steps; i++) {
        const factor = 0.5 + (i / (steps - 1)); // 0.5 to 1.5
        const value = Math.max(param.min, Math.min(param.max, baseValue * factor));
        
        const testInputs = { 
          ...baseInputs, 
          [param.key]: param.key === 'quantity' ? Math.round(value) : value 
        };
        
        try {
          const result = enhancedCalculationEngine.calculateCost(testInputs);
          const baseResult = enhancedCalculationEngine.calculateCost(baseInputs);
          
          variations.push({
            value,
            cost: result.totalCost,
            time: result.totalTime,
            change: ((result.totalCost - baseResult.totalCost) / baseResult.totalCost) * 100
          });
        } catch (error) {
          console.error(`Error calculating for ${param.key}:`, error);
        }
      }

      // 计算敏感性
      const changes = variations.map(v => Math.abs(v.change));
      const maxChange = Math.max(...changes);
      const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
      
      const sensitivity = avgChange;
      const impact = sensitivity > 20 ? 'high' : sensitivity > 10 ? 'medium' : 'low';

      results.push({
        parameter: param.name,
        baseValue,
        variations,
        sensitivity,
        impact
      });
    }

    setSensitivityResults(results);
    setIsAnalyzing(false);
  };

  // 执行优化分析
  const performOptimization = async () => {
    setIsAnalyzing(true);
    const results: OptimizationResult[] = [];
    
    // 材料选择优化
    const materials = ['steel', 'aluminum', 'stainless_steel', 'copper', 'brass'];
    let bestMaterial = baseInputs.material;
    let bestCost = Infinity;
    
    for (const material of materials) {
      try {
        const testInputs = { ...baseInputs, material };
        const result = enhancedCalculationEngine.calculateCost(testInputs);
        
        if (result.totalCost < bestCost) {
          bestCost = result.totalCost;
          bestMaterial = material;
        }
      } catch (error) {
        console.error(`Error testing material ${material}:`, error);
      }
    }
    
    if (bestMaterial !== baseInputs.material) {
      const currentResult = enhancedCalculationEngine.calculateCost(baseInputs);
      const improvement = ((currentResult.totalCost - bestCost) / currentResult.totalCost) * 100;
      
      results.push({
        parameter: 'Material',
        currentValue: baseInputs.material as any,
        optimizedValue: bestMaterial as any,
        improvement,
        reasoning: `${bestMaterial} offers ${improvement.toFixed(1)}% cost reduction while maintaining quality`
      });
    }

    // 厚度优化
    const currentResult = enhancedCalculationEngine.calculateCost(baseInputs);
    const thicknessRange = [
      Math.max(0.5, baseInputs.thickness - 1),
      baseInputs.thickness,
      Math.min(20, baseInputs.thickness + 1)
    ];
    
    let bestThickness = baseInputs.thickness;
    let bestThicknessCost = currentResult.totalCost;
    
    for (const thickness of thicknessRange) {
      try {
        const testInputs = { ...baseInputs, thickness };
        const result = enhancedCalculationEngine.calculateCost(testInputs);
        
        if (result.totalCost < bestThicknessCost) {
          bestThicknessCost = result.totalCost;
          bestThickness = thickness;
        }
      } catch (error) {
        console.error(`Error testing thickness ${thickness}:`, error);
      }
    }
    
    if (bestThickness !== baseInputs.thickness) {
      const improvement = ((currentResult.totalCost - bestThicknessCost) / currentResult.totalCost) * 100;
      
      results.push({
        parameter: 'Thickness',
        currentValue: baseInputs.thickness,
        optimizedValue: bestThickness,
        improvement,
        reasoning: `Adjusting thickness to ${bestThickness}mm reduces cost by ${improvement.toFixed(1)}%`
      });
    }

    // 数量优化（批量折扣）
    const quantities = [
      Math.max(1, Math.floor(baseInputs.quantity * 0.8)),
      baseInputs.quantity,
      Math.ceil(baseInputs.quantity * 1.2),
      Math.ceil(baseInputs.quantity * 1.5)
    ];
    
    let bestQuantityEfficiency = 0;
    let bestQuantity = baseInputs.quantity;
    
    for (const quantity of quantities) {
      try {
        const testInputs = { ...baseInputs, quantity };
        const result = enhancedCalculationEngine.calculateCost(testInputs);
        const efficiency = quantity / result.totalCost; // parts per dollar
        
        if (efficiency > bestQuantityEfficiency) {
          bestQuantityEfficiency = efficiency;
          bestQuantity = quantity;
        }
      } catch (error) {
        console.error(`Error testing quantity ${quantity}:`, error);
      }
    }
    
    if (bestQuantity !== baseInputs.quantity) {
      const currentEfficiency = baseInputs.quantity / currentResult.totalCost;
      const improvement = ((bestQuantityEfficiency - currentEfficiency) / currentEfficiency) * 100;
      
      results.push({
        parameter: 'Quantity',
        currentValue: baseInputs.quantity,
        optimizedValue: bestQuantity,
        improvement,
        reasoning: `Adjusting quantity to ${bestQuantity} improves cost efficiency by ${improvement.toFixed(1)}%`
      });
    }

    setOptimizationResults(results);
    setIsAnalyzing(false);
  };

  // 应用优化建议
  const applyOptimization = () => {
    let optimizedInputs = { ...baseInputs };
    
    optimizationResults.forEach(result => {
      switch (result.parameter) {
        case 'Material':
          optimizedInputs.material = result.optimizedValue as string;
          break;
        case 'Thickness':
          optimizedInputs.thickness = result.optimizedValue as number;
          break;
        case 'Quantity':
          optimizedInputs.quantity = result.optimizedValue as number;
          break;
      }
    });
    
    if (onOptimizationApply) {
      onOptimizationApply(optimizedInputs);
    }
  };

  // 自动执行分析
  useEffect(() => {
    if (baseInputs) {
      performSensitivityAnalysis();
      performOptimization();
    }
  }, [baseInputs]);

  // 获取选中参数的敏感性数据
  const selectedSensitivityData = useMemo(() => {
    return sensitivityResults.find(result => 
      result.parameter.toLowerCase() === selectedParameter.toLowerCase()
    );
  }, [sensitivityResults, selectedParameter]);

  const tabs = [
    { id: 'sensitivity', name: 'Sensitivity Analysis', icon: AdjustmentsHorizontalIcon },
    { id: 'optimization', name: 'Optimization', icon: LightBulbIcon },
    { id: 'trends', name: 'Trends', icon: TrendingUpIcon }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
        <p className="text-gray-600">Analyze parameter sensitivity and optimize your calculations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing parameters...</p>
        </div>
      )}

      {/* Sensitivity Analysis Tab */}
      {activeTab === 'sensitivity' && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Parameter Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Parameter to Analyze
            </label>
            <select
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {parameters.map(param => (
                <option key={param.key} value={param.key}>
                  {param.name} ({param.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Sensitivity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sensitivityResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  result.parameter.toLowerCase() === selectedParameter.toLowerCase()
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedParameter(result.parameter.toLowerCase())}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{result.parameter}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.impact === 'high' ? 'bg-red-100 text-red-800' :
                    result.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {result.impact} impact
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Sensitivity: {result.sensitivity.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  Base: {result.baseValue}
                </div>
              </div>
            ))}
          </div>

          {/* Sensitivity Chart */}
          {selectedSensitivityData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedSensitivityData.parameter} Sensitivity Chart
              </h3>
              <div className="space-y-2">
                {selectedSensitivityData.variations.map((variation, index) => {
                  const isBase = Math.abs(variation.value - selectedSensitivityData.baseValue) < 0.01;
                  const changeAbs = Math.abs(variation.change);
                  const maxChange = Math.max(...selectedSensitivityData.variations.map(v => Math.abs(v.change)));
                  const barWidth = maxChange > 0 ? (changeAbs / maxChange) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-16 text-sm text-gray-600">
                        {variation.value.toFixed(1)}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className={`h-4 rounded-full ${
                            variation.change > 0 ? 'bg-red-400' : 'bg-green-400'
                          } ${isBase ? 'bg-blue-500' : ''}`}
                          style={{ width: `${barWidth}%` }}
                        />
                        {isBase && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                            BASE
                          </div>
                        )}
                      </div>
                      <div className="w-20 text-sm text-right">
                        <span className={`${
                          variation.change > 0 ? 'text-red-600' : 'text-green-600'
                        } ${isBase ? 'text-blue-600 font-medium' : ''}`}>
                          {variation.change > 0 ? '+' : ''}{variation.change.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-20 text-sm text-gray-600 text-right">
                        ${variation.cost.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Optimization Tab */}
      {activeTab === 'optimization' && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {optimizationResults.length > 0 ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <LightBulbIcon className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-green-900">Optimization Opportunities</h3>
                </div>
                <p className="text-sm text-green-700">
                  Found {optimizationResults.length} optimization opportunities that could improve your results.
                </p>
              </div>

              <div className="space-y-4">
                {optimizationResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{result.parameter}</h4>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {result.improvement.toFixed(1)}% improvement
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-500">Current:</span>
                        <div className="font-medium">{result.currentValue}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Optimized:</span>
                        <div className="font-medium text-green-600">{result.optimizedValue}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{result.reasoning}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={applyOptimization}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <CogIcon className="w-5 h-5 mr-2" />
                Apply All Optimizations
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <LightBulbIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Optimizations Found</h3>
              <p className="text-gray-600">Your current parameters are already well optimized!</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center py-8">
            <ArrowTrendingUpIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Analysis</h3>
            <p className="text-gray-600">Historical trend analysis will be available with more calculation data.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
