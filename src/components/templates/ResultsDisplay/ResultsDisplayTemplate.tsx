import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  TrendingUp, 
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { 
  ResultsDisplayConfig, 
  CostSummary, 
  SensitivityAnalysis, 
  EfficiencyMetrics, 
  Recommendation,
  DisplayConfig 
} from '../types/ResultTypes';

// CSS Chart Components (avoiding recharts dependency)
interface CSSPieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  total: number;
  centerLabel?: string;
  centerValue?: string;
}

const CSSPieChart: React.FC<CSSPieChartProps> = ({ data, total, centerLabel, centerValue }) => {
  let cumulativePercentage = 0;
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div 
        className="w-full h-full rounded-full overflow-hidden" 
        style={{
          background: `conic-gradient(${data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startPercentage = cumulativePercentage;
            cumulativePercentage += percentage;
            const color = item.color || COLORS[index % COLORS.length];
            return `${color} ${startPercentage}% ${cumulativePercentage}%`;
          }).join(', ')})`
        }}
      >
        <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            {centerValue && <div className="text-2xl font-bold">{centerValue}</div>}
            {centerLabel && <div className="text-sm text-gray-600">{centerLabel}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CSSBarChartProps {
  data: Array<{ name: string; value: number; percentage?: number; color?: string }>;
  maxValue: number;
}

const CSSBarChart: React.FC<CSSBarChartProps> = ({ data, maxValue }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center space-x-3">
          <div className="w-20 text-sm font-medium text-right">{item.name}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
            <div 
              className="h-full rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || COLORS[index % COLORS.length]
              }}
            >
              {item.value}
            </div>
          </div>
          <div className="w-12 text-sm text-gray-600">{item.percentage}%</div>
        </div>
      ))}
    </div>
  );
};

interface CSSSensitivityChartProps {
  data: Array<{ parameter: string; impact: number; change: string }>;
}

const CSSSensitivityChart: React.FC<CSSSensitivityChartProps> = ({ data }) => {
  const maxAbsValue = Math.max(...data.map(item => Math.abs(item.impact)));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.parameter} className="flex items-center space-x-3">
          <div className="w-32 text-sm font-medium text-right">{item.parameter}</div>
          <div className="flex-1 relative">
            <div className="h-6 bg-gray-200 rounded-full relative">
              <div className="absolute left-1/2 w-0.5 h-full bg-gray-400"></div>
              <div 
                className={`absolute h-full rounded-full flex items-center text-white text-xs font-medium ${
                  item.impact > 0 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${(Math.abs(item.impact) / maxAbsValue) * 40}%`,
                  left: item.impact > 0 ? '50%' : `${50 - (Math.abs(item.impact) / maxAbsValue) * 40}%`
                }}
              >
                <span className={`${item.impact > 0 ? 'ml-2' : 'mr-2'}`}>
                  {item.impact > 0 ? '+' : ''}{item.impact}%
                </span>
              </div>
            </div>
          </div>
          <div className="w-16 text-sm text-gray-600">{item.change}</div>
        </div>
      ))}
    </div>
  );
};

// Main Results Display Template
interface ResultsDisplayTemplateProps {
  title: string;
  summary: CostSummary;
  sensitivityAnalysis?: SensitivityAnalysis;
  efficiencyMetrics?: EfficiencyMetrics;
  recommendations?: Recommendation[];
  config: ResultsDisplayConfig;
  displayConfig: DisplayConfig;
  onExport?: (format: string) => void;
  className?: string;
}

const ResultsDisplayTemplate: React.FC<ResultsDisplayTemplateProps> = ({
  title,
  summary,
  sensitivityAnalysis,
  efficiencyMetrics,
  recommendations,
  config,
  displayConfig,
  onExport,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('summary');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(displayConfig.locale, {
      style: 'currency',
      currency: displayConfig.currency,
      minimumFractionDigits: displayConfig.decimalPlaces,
      maximumFractionDigits: displayConfig.decimalPlaces
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Prepare chart data
  const costBreakdownData = Object.entries(summary.breakdown).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value.amount,
    percentage: value.percentage
  }));

  const maxCostValue = Math.max(...costBreakdownData.map(item => item.value));

  const sensitivityData = sensitivityAnalysis?.analysis.map(result => ({
    parameter: result.parameter,
    impact: result.impact,
    change: result.variation,
    newCost: result.newValue
  })) || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {title} Results
            </div>
            <Badge variant="outline">
              {new Date().toLocaleDateString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 bg-blue-50">
              <h4 className="font-semibold mb-2">Total Cost</h4>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(summary.totalCost)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Complete project cost</p>
            </Card>
            
            <Card className="p-4 bg-green-50">
              <h4 className="font-semibold mb-2">Cost per Unit</h4>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(summary.costPerUnit)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Per piece cost</p>
            </Card>
            
            <Card className="p-4 bg-purple-50">
              <h4 className="font-semibold mb-2">Efficiency</h4>
              <p className="text-3xl font-bold text-purple-600">
                {formatPercentage(summary.efficiency || 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Overall efficiency</p>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                {config.showSensitivity && <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>}
                {config.showRecommendations && <TabsTrigger value="recommendations">Recommendations</TabsTrigger>}
              </TabsList>
            </div>

            {/* Summary Tab */}
            <TabsContent value="summary" className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Key Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Total Cost</span>
                      <span className="text-lg font-bold">{formatCurrency(summary.totalCost)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Cost per Unit</span>
                      <span className="text-lg font-bold">{formatCurrency(summary.costPerUnit)}</span>
                    </div>
                    {summary.savings && (
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-800">Potential Savings</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(summary.savings)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {efficiencyMetrics && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Efficiency Metrics</h4>
                    <div className="space-y-3">
                      {efficiencyMetrics.categories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{category.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{category.value}{category.unit}</span>
                            <Badge 
                              variant={
                                category.status === 'excellent' ? 'default' :
                                category.status === 'good' ? 'secondary' :
                                category.status === 'average' ? 'outline' : 'destructive'
                              }
                            >
                              {category.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Breakdown Tab */}
            <TabsContent value="breakdown" className="px-6 pb-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Cost Distribution
                  </h4>
                  <div className="py-6">
                    <CSSPieChart 
                      data={costBreakdownData}
                      total={summary.totalCost}
                      centerValue={formatCurrency(summary.totalCost)}
                      centerLabel="Total Cost"
                    />
                    <div className="mt-6 grid grid-cols-2 gap-2">
                      {costBreakdownData.map((item, index) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6] }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Bar Chart */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Cost Comparison
                  </h4>
                  <div className="py-6">
                    <CSSBarChart data={costBreakdownData} maxValue={maxCostValue} />
                  </div>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Detailed Cost Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {costBreakdownData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.value)}</div>
                        <div className="text-sm text-gray-600">
                          {formatPercentage(item.percentage || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Sensitivity Analysis Tab */}
            {config.showSensitivity && sensitivityAnalysis && (
              <TabsContent value="sensitivity" className="px-6 pb-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Sensitivity Analysis
                  </h4>
                  <Badge variant="outline">Parameter Impact on Total Cost</Badge>
                </div>

                <Card className="p-6">
                  <h5 className="font-medium mb-4">Cost Impact by Parameter Changes</h5>
                  <div className="py-6">
                    <CSSSensitivityChart data={sensitivityData} />
                  </div>
                  <div className="mt-4 flex justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Cost Increase</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Cost Decrease</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50">
                  <h5 className="font-medium mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Key Insights
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h6 className="font-medium text-blue-900 mb-2">Highest Impact Parameters:</h6>
                      <ul className="space-y-1 text-blue-800">
                        <li>• Material cost changes have the largest impact on total cost</li>
                        <li>• Cutting speed optimization can significantly reduce costs</li>
                        <li>• Waste factor control is critical for cost management</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="font-medium text-blue-900 mb-2">Optimization Recommendations:</h6>
                      <ul className="space-y-1 text-blue-800">
                        <li>• Focus on material cost negotiation and sourcing</li>
                        <li>• Invest in cutting speed optimization technology</li>
                        <li>• Implement waste reduction strategies and nesting software</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            )}

            {/* Recommendations Tab */}
            {config.showRecommendations && recommendations && (
              <TabsContent value="recommendations" className="px-6 pb-6 space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Optimization Recommendations
                </h4>
                
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium">{rec.title}</h5>
                          <Badge 
                            variant={rec.impact === 'high' ? 'default' : rec.impact === 'medium' ? 'secondary' : 'outline'}
                          >
                            {rec.impact} impact
                          </Badge>
                        </div>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">Effort: {rec.effort}</span>
                          {rec.timeframe && <span className="text-gray-600">Timeline: {rec.timeframe}</span>}
                        </div>
                        {rec.savings && (
                          <div className="text-green-600 font-medium">
                            Potential savings: {formatCurrency(rec.savings)}
                          </div>
                        )}
                      </div>
                      
                      {rec.steps && rec.steps.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h6 className="font-medium text-sm mb-2">Implementation Steps:</h6>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                            {rec.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplayTemplate;
export { CSSPieChart, CSSBarChart, CSSSensitivityChart };
