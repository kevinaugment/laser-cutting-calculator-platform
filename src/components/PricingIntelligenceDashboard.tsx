import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterPlot, Scatter, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, Brain, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface PricingIntelligenceDashboardProps {
  calculatorResults?: {
    competitivePricing?: any;
    valueBasedPricing?: any;
    profitMarginOptimizer?: any;
    breakEvenAnalysis?: any;
    costPlusPricing?: any;
  };
}

export const PricingIntelligenceDashboard: React.FC<PricingIntelligenceDashboardProps> = ({ calculatorResults }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'competitive' | 'value' | 'margin' | 'breakeven'>('overview');
  const [priceRange, setPriceRange] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMarketPositionIcon = (position: string) => {
    switch (position) {
      case 'premium':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'competitive':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'value':
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case 'discount':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  // Sample data for demonstration
  const pricingMetrics = {
    competitivePrice: calculatorResults?.competitivePricing?.enhancement?.pricingRecommendation?.recommendedPrice || 125.50,
    valueBasedPrice: calculatorResults?.valueBasedPricing?.enhancement?.capturedValue || 142.75,
    marginOptimizedPrice: calculatorResults?.profitMarginOptimizer?.optimalPrice || 135.25,
    breakEvenPrice: calculatorResults?.breakEvenAnalysis?.breakEvenPrice || 98.50,
    costPlusPrice: calculatorResults?.costPlusPricing?.recommendedPrice || 115.75,
  };

  const confidenceScores = {
    competitive: calculatorResults?.competitivePricing?.enhancement?.confidence || 87,
    valueBased: 92,
    marginOptimized: 85,
    breakEven: 95,
    costPlus: 78,
  };

  const pricingComparisonData = [
    { method: 'Competitive', price: pricingMetrics.competitivePrice, confidence: confidenceScores.competitive },
    { method: 'Value-Based', price: pricingMetrics.valueBasedPrice, confidence: confidenceScores.valueBased },
    { method: 'Margin Optimized', price: pricingMetrics.marginOptimizedPrice, confidence: confidenceScores.marginOptimized },
    { method: 'Break-Even', price: pricingMetrics.breakEvenPrice, confidence: confidenceScores.breakEven },
    { method: 'Cost-Plus', price: pricingMetrics.costPlusPrice, confidence: confidenceScores.costPlus },
  ];

  const marketPositionData = [
    { position: 'Premium', value: 25, color: '#8884d8' },
    { position: 'Competitive', value: 45, color: '#82ca9d' },
    { position: 'Value', value: 20, color: '#ffc658' },
    { position: 'Discount', value: 10, color: '#ff7300' },
  ];

  const priceOptimizationTrend = [
    { time: 'Week 1', competitive: 120, valueBased: 140, margin: 130 },
    { time: 'Week 2', competitive: 122, valueBased: 142, margin: 132 },
    { time: 'Week 3', competitive: 125, valueBased: 143, margin: 135 },
    { time: 'Week 4', competitive: 126, valueBased: 145, margin: 136 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Pricing Intelligence Dashboard</h2>
        <div className="flex space-x-2">
          <Button
            variant={priceRange === 'low' ? 'default' : 'outline'}
            onClick={() => setPriceRange('low')}
          >
            Low Range
          </Button>
          <Button
            variant={priceRange === 'medium' ? 'default' : 'outline'}
            onClick={() => setPriceRange('medium')}
          >
            Medium Range
          </Button>
          <Button
            variant={priceRange === 'high' ? 'default' : 'outline'}
            onClick={() => setPriceRange('high')}
          >
            High Range
          </Button>
        </div>
      </div>

      {/* Key Pricing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advanced Competitive Price</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pricingMetrics.competitivePrice)}
            </div>
            <p className={`text-xs ${getConfidenceColor(confidenceScores.competitive)}`}>
              {confidenceScores.competitive}% confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value-Based Price</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pricingMetrics.valueBasedPrice)}
            </div>
            <p className={`text-xs ${getConfidenceColor(confidenceScores.valueBased)}`}>
              {confidenceScores.valueBased}% confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margin Optimized</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pricingMetrics.marginOptimizedPrice)}
            </div>
            <p className={`text-xs ${getConfidenceColor(confidenceScores.marginOptimized)}`}>
              {confidenceScores.marginOptimized}% confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break-Even Price</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pricingMetrics.breakEvenPrice)}
            </div>
            <p className={`text-xs ${getConfidenceColor(confidenceScores.breakEven)}`}>
              {confidenceScores.breakEven}% confidence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost-Plus Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(pricingMetrics.costPlusPrice)}
            </div>
            <p className={`text-xs ${getConfidenceColor(confidenceScores.costPlus)}`}>
              {confidenceScores.costPlus}% confidence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Pricing Insights */}
      {calculatorResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Pricing Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calculatorResults.competitivePricing?.enhancement?.reasoning?.slice(0, 3).map((reason: string, index: number) => (
                  <Alert key={index} className="border-l-4 border-blue-500">
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>Competitive Analysis: </strong>
                          {reason}
                        </div>
                        <Badge variant="outline">Advanced Analysis</Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
                
                {calculatorResults.valueBasedPricing?.aiEnhancement?.adjustments?.slice(0, 2).map((adjustment: any, index: number) => (
                  <Alert key={`value-${index}`} className="border-l-4 border-green-500">
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>Value Adjustment: </strong>
                          {adjustment.factor} - {adjustment.reasoning}
                        </div>
                        <Badge variant="outline">{formatPercentage(adjustment.adjustment * 100)}</Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calculatorResults.competitivePricing?.aiEnhancement?.riskFactors?.slice(0, 3).map((risk: any, index: number) => (
                  <Alert key={index} className={`border-l-4 ${
                    risk.probability > 70 ? 'border-red-500' :
                    risk.probability > 50 ? 'border-yellow-500' : 'border-blue-500'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <strong>{risk.risk}</strong>
                          <p className="text-sm text-gray-600 mt-1">{risk.mitigation}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={risk.probability > 70 ? 'destructive' : 'default'}>
                            {risk.probability}% risk
                          </Badge>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="value">Value-Based</TabsTrigger>
          <TabsTrigger value="margin">Margin</TabsTrigger>
          <TabsTrigger value="breakeven">Break-Even</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Method Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pricingComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Price']} />
                    <Bar dataKey="price" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Position Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketPositionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ position, percent }) => `${position} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {marketPositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Price Optimization Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceOptimizationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Price']} />
                  <Legend />
                  <Line type="monotone" dataKey="competitive" stroke="#8884d8" name="Competitive" />
                  <Line type="monotone" dataKey="valueBased" stroke="#82ca9d" name="Value-Based" />
                  <Line type="monotone" dataKey="margin" stroke="#ffc658" name="Margin Optimized" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          {calculatorResults?.competitivePricing && (
            <Card>
              <CardHeader>
                <CardTitle>AI Competitive Pricing Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculatorResults.competitivePricing.aiEnhancement?.aiPricingRecommendation?.recommendedPrice || 0)}
                    </div>
                    <div className="text-sm text-gray-500">AI Recommended Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {calculatorResults.competitivePricing.aiEnhancement?.marketPosition || 'Competitive'}
                    </div>
                    <div className="text-sm text-gray-500">Market Position</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculatorResults.competitivePricing.aiEnhancement?.confidence || 0}%
                    </div>
                    <div className="text-sm text-gray-500">Confidence Level</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Price Range Analysis</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="font-bold">Minimum</div>
                      <div>{formatCurrency(calculatorResults.competitivePricing.aiEnhancement?.priceRange?.minimum || 0)}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold">Optimal</div>
                      <div>{formatCurrency(calculatorResults.competitivePricing.aiEnhancement?.priceRange?.optimal || 0)}</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold">Maximum</div>
                      <div>{formatCurrency(calculatorResults.competitivePricing.aiEnhancement?.priceRange?.maximum || 0)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="value" className="space-y-4">
          {calculatorResults?.valueBasedPricing && (
            <Card>
              <CardHeader>
                <CardTitle>AI Value-Based Pricing Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculatorResults.valueBasedPricing.aiEnhancement?.totalValue || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Customer Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculatorResults.valueBasedPricing.aiEnhancement?.capturedValue || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Captured Value</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Value Multiplier: {calculatorResults.valueBasedPricing.aiEnhancement?.valueMultiplier?.toFixed(2) || 'N/A'}</h4>
                  <div className="text-sm text-gray-600">
                    Strategy: {calculatorResults.valueBasedPricing.aiEnhancement?.strategy || 'Value-based approach'}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold">Value Adjustments:</h4>
                  {calculatorResults.valueBasedPricing.aiEnhancement?.adjustments?.map((adjustment: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{adjustment.factor}</span>
                      <span className="text-green-600">{formatPercentage(adjustment.adjustment * 100)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="margin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-lg text-gray-600">Margin optimization analysis will be displayed here</div>
                <div className="text-sm text-gray-500 mt-2">Enhanced with AI-powered margin calculations</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakeven" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Break-Even Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-lg text-gray-600">Break-even analysis will be displayed here</div>
                <div className="text-sm text-gray-500 mt-2">Enhanced with predictive break-even modeling</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingIntelligenceDashboard;
