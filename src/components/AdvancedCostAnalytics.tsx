import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, Zap } from 'lucide-react';
import { costAnalyticsEngine } from '../utils/costAnalyticsEngine';
import type { TrendAnalysis, VarianceReport, CostForecast, BudgetComparison } from '../utils/costAnalyticsEngine';

interface AdvancedCostAnalyticsProps {
  costData: any[];
  budget?: any;
  actualCosts?: any;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
}

export const AdvancedCostAnalytics: React.FC<AdvancedCostAnalyticsProps> = ({
  costData,
  budget,
  actualCosts,
  timeframe
}) => {
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [varianceReport, setVarianceReport] = useState<VarianceReport | null>(null);
  const [costForecast, setCostForecast] = useState<CostForecast | null>(null);
  const [budgetComparison, setBudgetComparison] = useState<BudgetComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<'trends' | 'variance' | 'forecast' | 'budget'>('trends');

  useEffect(() => {
    const performAnalysis = async () => {
      setIsLoading(true);
      try {
        // Trend Analysis
        if (costData.length > 0) {
          const period = {
            start: new Date(Date.now() - getTimeframeDays(timeframe) * 24 * 60 * 60 * 1000),
            end: new Date(),
            granularity: getGranularity(timeframe),
          };
          
          const trends = costAnalyticsEngine.analyzeCostTrends(costData, period);
          setTrendAnalysis(trends);

          // Cost Forecast
          const forecast = costAnalyticsEngine.predictCosts(costData, getForecastPeriod(timeframe));
          setCostForecast(forecast);
        }

        // Variance Analysis
        if (budget && actualCosts) {
          const variance = costAnalyticsEngine.generateVarianceReport(budget, actualCosts);
          setVarianceReport(variance);

          // Budget Comparison
          const comparison = costAnalyticsEngine.performBudgetComparison(budget, actualCosts);
          setBudgetComparison(comparison);
        }
      } catch (error) {
        console.error('Analytics analysis failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [costData, budget, actualCosts, timeframe]);

  const getTimeframeDays = (tf: string): number => {
    switch (tf) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return 30;
    }
  };

  const getGranularity = (tf: string): 'hour' | 'day' | 'week' | 'month' => {
    switch (tf) {
      case 'week': return 'day';
      case 'month': return 'day';
      case 'quarter': return 'week';
      case 'year': return 'month';
      default: return 'day';
    }
  };

  const getForecastPeriod = (tf: string): number => {
    switch (tf) {
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      case 'year': return 365;
      default: return 30;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pattern':
        return <Brain className="h-4 w-4 text-blue-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Advanced Cost Analytics</h2>
        <div className="flex space-x-2">
          <Button
            variant={selectedAnalysis === 'trends' ? 'default' : 'outline'}
            onClick={() => setSelectedAnalysis('trends')}
          >
            Trends
          </Button>
          <Button
            variant={selectedAnalysis === 'variance' ? 'default' : 'outline'}
            onClick={() => setSelectedAnalysis('variance')}
            disabled={!varianceReport}
          >
            Variance
          </Button>
          <Button
            variant={selectedAnalysis === 'forecast' ? 'default' : 'outline'}
            onClick={() => setSelectedAnalysis('forecast')}
          >
            Forecast
          </Button>
          <Button
            variant={selectedAnalysis === 'budget' ? 'default' : 'outline'}
            onClick={() => setSelectedAnalysis('budget')}
            disabled={!budgetComparison}
          >
            Budget
          </Button>
        </div>
      </div>

      {/* Key Insights */}
      {trendAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Trend</CardTitle>
              {getTrendIcon(trendAnalysis.overallTrend.direction)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {trendAnalysis.overallTrend.direction}
              </div>
              <p className="text-xs text-muted-foreground">
                Confidence: {formatPercentage(trendAnalysis.overallTrend.confidence)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seasonal Patterns</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trendAnalysis.seasonalPatterns.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Patterns detected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Correlations</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trendAnalysis.correlations.filter(c => Math.abs(c.coefficient) > 0.5).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Strong correlations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insights</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trendAnalysis.insights.filter(i => i.impact === 'high' || i.impact === 'critical').length}
              </div>
              <p className="text-xs text-muted-foreground">
                High-impact insights
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis Content */}
      <Tabs value={selectedAnalysis} onValueChange={(value) => setSelectedAnalysis(value as any)}>
        <TabsContent value="trends" className="space-y-4">
          {trendAnalysis && (
            <>
              {/* Trend Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendAnalysis.insights.slice(0, 5).map((insight, index) => (
                      <Alert key={index} className={`border-l-4 ${
                        insight.type === 'risk' ? 'border-red-500' :
                        insight.type === 'opportunity' ? 'border-green-500' : 'border-blue-500'
                      }`}>
                        <div className="flex items-start space-x-2">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <AlertDescription>
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong>{insight.description}</strong>
                                  <p className="text-sm text-gray-600 mt-1">{insight.recommendation}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Badge variant={insight.impact === 'critical' ? 'destructive' : 
                                                insight.impact === 'high' ? 'default' : 'secondary'}>
                                    {insight.impact}
                                  </Badge>
                                  <Badge variant="outline">
                                    {formatPercentage(insight.confidence)} confidence
                                  </Badge>
                                </div>
                              </div>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trendAnalysis.categoryTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'contribution' ? formatPercentage(value as number) : 
                          name === 'volatility' ? formatPercentage(value as number) : value,
                          name
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="contribution" fill="#8884d8" name="Contribution %" />
                      <Bar dataKey="volatility" fill="#82ca9d" name="Volatility %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Correlations */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Correlations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendAnalysis.correlations.map((correlation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium">{correlation.variable1} vs {correlation.variable2}</span>
                          <p className="text-sm text-gray-600">{correlation.relationship} relationship</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{correlation.coefficient.toFixed(3)}</div>
                          <div className="text-sm text-gray-500">
                            Significance: {correlation.significance.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="variance" className="space-y-4">
          {varianceReport && (
            <>
              {/* Variance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Variance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(varianceReport.summary.totalVariance)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage(varianceReport.summary.totalVariancePercent)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Favorable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(varianceReport.summary.favorableVariance)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unfavorable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(varianceReport.summary.unfavorableVariance)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Significant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {varianceReport.summary.significantVariances}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Categories
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Category Variances */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Variance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {varianceReport.categoryVariances.map((variance, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{variance.category}</span>
                          <Badge variant={
                            variance.status === 'favorable' ? 'default' :
                            variance.status === 'unfavorable' ? 'destructive' : 'secondary'
                          }>
                            {variance.status}
                          </Badge>
                          <Badge variant={
                            variance.significance === 'critical' ? 'destructive' :
                            variance.significance === 'high' ? 'default' : 'outline'
                          }>
                            {variance.significance}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatCurrency(variance.variance)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPercentage(variance.variancePercent)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Variance Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {varianceReport.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{rec.category}</span>
                            <p className="text-sm text-gray-600 mt-1">{rec.action}</p>
                            <p className="text-xs text-gray-500 mt-1">Expected: {rec.expectedImpact}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={rec.priority === 'urgent' ? 'destructive' : 
                                          rec.priority === 'high' ? 'default' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline">
                              {rec.timeframe}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          {costForecast && (
            <>
              {/* Forecast Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={costForecast.forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value) => [formatCurrency(value as number), 'Predicted Cost']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="predictedCost" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Predicted Cost"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="upperBound" 
                        stroke="#82ca9d" 
                        strokeDasharray="5 5"
                        name="Upper Bound"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lowerBound" 
                        stroke="#ffc658" 
                        strokeDasharray="5 5"
                        name="Lower Bound"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Forecast Accuracy */}
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Accuracy Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatPercentage(costForecast.accuracy.accuracy)}</div>
                      <div className="text-sm text-gray-500">Overall Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{costForecast.accuracy.mape.toFixed(2)}%</div>
                      <div className="text-sm text-gray-500">MAPE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatCurrency(costForecast.accuracy.mae)}</div>
                      <div className="text-sm text-gray-500">MAE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatCurrency(costForecast.accuracy.rmse)}</div>
                      <div className="text-sm text-gray-500">RMSE</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scenarios */}
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {costForecast.scenarios.map((scenario, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{scenario.name}</span>
                            <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatPercentage(scenario.probability)}</div>
                            <div className="text-sm text-gray-500">Probability</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          {budgetComparison && (
            <>
              {/* Budget Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(budgetComparison.overallPerformance.actual)}
                      </div>
                      <div className="text-sm text-gray-500">Actual</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(budgetComparison.overallPerformance.target)}
                      </div>
                      <div className="text-sm text-gray-500">Target</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        budgetComparison.overallPerformance.variance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(budgetComparison.overallPerformance.variance)}
                      </div>
                      <div className="text-sm text-gray-500">Variance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetComparison.categoryPerformance.map((perf, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{perf.category}</span>
                          <Badge variant={
                            perf.trend === 'improving' ? 'default' :
                            perf.trend === 'declining' ? 'destructive' : 'secondary'
                          }>
                            {perf.trend}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatPercentage(perf.budgetUtilization)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Utilization
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {budgetComparison.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{rec.area}</span>
                            <p className="text-sm text-gray-600 mt-1">{rec.recommendation}</p>
                            <p className="text-xs text-gray-500 mt-1">Impact: {rec.impact}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={rec.effort === 'high' ? 'destructive' : 
                                          rec.effort === 'medium' ? 'default' : 'secondary'}>
                              {rec.effort} effort
                            </Badge>
                            <Badge variant="outline">
                              {rec.timeline}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedCostAnalytics;
