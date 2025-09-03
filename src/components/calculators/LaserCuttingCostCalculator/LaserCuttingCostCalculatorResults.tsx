import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { DollarSign, TrendingUp, BarChart3, Target, AlertCircle, CheckCircle, PieChart, Activity, Zap } from 'lucide-react';
// Using CSS-based charts to avoid recharts dependency issues

interface LaserCuttingCostCalculatorResultsProps {
  results: any;
}

const LaserCuttingCostCalculatorResults: React.FC<LaserCuttingCostCalculatorResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState('breakdown');

  if (!results) return null;

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Prepare data for cost breakdown pie chart
  const costBreakdownData = [
    { name: 'Material', value: results.materialCost || 0, color: '#3B82F6' },
    { name: 'Energy', value: results.energyCost || 0, color: '#10B981' },
    { name: 'Gas', value: results.gasCost || 0, color: '#F59E0B' },
    { name: 'Labor', value: results.laborCost || 0, color: '#EF4444' },
    { name: 'Machine', value: results.machineCost || 0, color: '#8B5CF6' },
    { name: 'Setup', value: results.setupCost || 0, color: '#06B6D4' }
  ].filter(item => item.value > 0);

  // Prepare data for cost comparison bar chart
  const costComparisonData = costBreakdownData.map(item => ({
    name: item.name,
    cost: item.value,
    percentage: ((item.value / results.totalCost) * 100).toFixed(1)
  }));

  // Prepare sensitivity analysis data
  const sensitivityData = [
    { parameter: 'Material Cost', impact: 45, change: '+10%', newCost: results.totalCost * 1.045 },
    { parameter: 'Cutting Speed', impact: -25, change: '+20%', newCost: results.totalCost * 0.975 },
    { parameter: 'Laser Power', impact: 15, change: '+10%', newCost: results.totalCost * 1.015 },
    { parameter: 'Setup Time', impact: 8, change: '+30%', newCost: results.totalCost * 1.008 },
    { parameter: 'Waste Factor', impact: 12, change: '+5%', newCost: results.totalCost * 1.012 }
  ];

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Simple CSS-based chart components
  const CSSPieChart = ({ data }: { data: any[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <div className="w-full h-full rounded-full overflow-hidden" style={{
          background: `conic-gradient(${data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startPercentage = cumulativePercentage;
            cumulativePercentage += percentage;
            return `${COLORS[index % COLORS.length]} ${startPercentage}% ${cumulativePercentage}%`;
          }).join(', ')})`
        }}>
          <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatCurrency(total)}</div>
              <div className="text-sm text-gray-600">Total Cost</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CSSBarChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(item => item.cost));

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-3">
            <div className="w-20 text-sm font-medium text-right">{item.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                style={{
                  width: `${(item.cost / maxValue) * 100}%`,
                  backgroundColor: COLORS[index % COLORS.length]
                }}
              >
                {formatCurrency(item.cost)}
              </div>
            </div>
            <div className="w-12 text-sm text-gray-600">{item.percentage}%</div>
          </div>
        ))}
      </div>
    );
  };

  const CSSSensitivityChart = ({ data }: { data: any[] }) => {
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

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.totalCost)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost per Piece</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.costPerPiece)}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Material Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(results.profitabilityAnalysis?.materialUtilization || 0)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(results.profitabilityAnalysis?.timeEfficiency || 0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
              <TabsTrigger value="analysis">Profitability</TabsTrigger>
              <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="breakdown" className="space-y-6">
              {/* Chart Toggle Buttons */}
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('breakdown')}
                  className="flex items-center space-x-2"
                >
                  <PieChart className="h-4 w-4" />
                  <span>Pie Chart</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('breakdown')}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Bar Chart</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Breakdown Pie Chart */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Cost Distribution
                  </h4>
                  <div className="py-6">
                    <CSSPieChart data={costBreakdownData} />
                    <div className="mt-6 grid grid-cols-2 gap-2">
                      {costBreakdownData.map((item, index) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Cost Breakdown Bar Chart */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Cost Comparison
                  </h4>
                  <div className="py-6">
                    <CSSBarChart data={costComparisonData} />
                  </div>
                </Card>
              </div>

              {/* Detailed Cost List */}
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Detailed Cost Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {costBreakdownData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(item.value)}</div>
                        <div className="text-sm text-gray-600">
                          {formatPercentage((item.value / results.totalCost) * 100)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Cost per m²</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.profitabilityAnalysis?.costPerSquareMeter || 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Per square meter</p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Material Efficiency</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPercentage(results.profitabilityAnalysis?.materialUtilization || 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Material utilization</p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Time Efficiency</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPercentage(results.profitabilityAnalysis?.timeEfficiency || 0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Productive time ratio</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sensitivity" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Sensitivity Analysis
                  </h4>
                  <Badge variant="outline">Parameter Impact on Total Cost</Badge>
                </div>

                {/* Sensitivity Chart */}
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

                {/* Sensitivity Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sensitivityData.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-medium text-sm">{item.parameter}</h6>
                        <Badge variant={item.impact > 0 ? "destructive" : "default"}>
                          {item.change}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Cost:</span>
                          <span className="font-medium">{formatCurrency(results.totalCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">New Cost:</span>
                          <span className="font-medium">{formatCurrency(item.newCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Impact:</span>
                          <span className={`font-medium ${item.impact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {item.impact > 0 ? '+' : ''}{item.impact}%
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Sensitivity Insights */}
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
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Optimization Recommendations</h4>
                {results.recommendations && results.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {results.recommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-gray-700">Your current parameters are well optimized!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaserCuttingCostCalculatorResults;
