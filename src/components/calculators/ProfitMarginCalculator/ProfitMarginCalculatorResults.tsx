import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Award
} from 'lucide-react';

interface ProfitMarginCalculatorResultsProps {
  results: {
    marginAnalysis: {
      grossMargin: { amount: number; percentage: number };
      operatingMargin: { amount: number; percentage: number };
      netMargin: { amount: number; percentage: number };
      contributionMargin: { amount: number; percentage: number };
      ebitdaMargin: { amount: number; percentage: number };
      marginTrends: Array<{
        period: string;
        grossMargin: number;
        netMargin: number;
      }>;
    };
    costAnalysis: {
      totalCosts: number;
      costBreakdown: {
        directCosts: number;
        indirectCosts: number;
        variableCosts: number;
        fixedCosts: number;
      };
      costEfficiency: number;
      costTrends: Array<{
        category: string;
        current: number;
        trend: string;
        impact: string;
      }>;
    };
    profitabilityDrivers: {
      primaryDrivers: string[];
      revenueDrivers: string[];
      costDrivers: string[];
      operationalDrivers: string[];
      driverImpact: Array<{
        driver: string;
        impact: number;
        priority: string;
      }>;
    };
    benchmarkComparison: {
      industryAverageMargins: {
        gross: number;
        operating: number;
        net: number;
      };
      competitivePosition: string;
      marginGap: {
        gross: number;
        operating: number;
        net: number;
      };
      performanceRating: number;
    };
    scenarioAnalysis: {
      baseCase: { revenue: number; margin: number; profit: number };
      optimisticCase: { revenue: number; margin: number; profit: number };
      pessimisticCase: { revenue: number; margin: number; profit: number };
      breakEvenAnalysis: {
        breakEvenRevenue: number;
        marginOfSafety: number;
        operatingLeverage: number;
      };
    };
    improvementOpportunities: {
      costReduction: Array<{
        opportunity: string;
        potential: number;
        difficulty: string;
        timeframe: string;
      }>;
      revenueEnhancement: Array<{
        opportunity: string;
        potential: number;
        difficulty: string;
        timeframe: string;
      }>;
      operationalEfficiency: Array<{
        opportunity: string;
        potential: number;
        difficulty: string;
        timeframe: string;
      }>;
    };
    strategicRecommendations: {
      marginOptimization: string[];
      costManagement: string[];
      revenueGrowth: string[];
      operationalExcellence: string[];
      riskMitigation: string[];
    };
    alertsAndRecommendations: {
      marginAlerts: string[];
      profitabilityWarnings: string[];
      costOptimizationAlerts: string[];
      strategicInsights: string[];
      actionItems: string[];
    };
  };
}

const ProfitMarginCalculatorResults: React.FC<ProfitMarginCalculatorResultsProps> = ({ results }) => {
  const getMarginColor = (margin: number, benchmark: number) => {
    if (margin >= benchmark * 1.1) return 'text-green-600';
    if (margin >= benchmark * 0.9) return 'text-blue-600';
    if (margin >= benchmark * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-blue-600';
    if (rating >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getMarginColor(results.marginAnalysis.grossMargin.percentage, results.benchmarkComparison.industryAverageMargins.gross)}`} />
            <div className="text-2xl font-bold">{results.marginAnalysis.grossMargin.percentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Gross Margin</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className={`h-8 w-8 mx-auto mb-2 ${getMarginColor(results.marginAnalysis.netMargin.percentage, results.benchmarkComparison.industryAverageMargins.net)}`} />
            <div className="text-2xl font-bold">{results.marginAnalysis.netMargin.percentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Net Margin</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className={`h-8 w-8 mx-auto mb-2 ${getPerformanceColor(results.benchmarkComparison.performanceRating)}`} />
            <div className="text-2xl font-bold">{results.benchmarkComparison.performanceRating.toFixed(1)}/10</div>
            <div className="text-sm text-muted-foreground">Performance</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.marginAnalysis.ebitdaMargin.percentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">EBITDA Margin</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="margins">Margins</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Margin Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gross Margin</span>
                    <span className={`font-semibold ${getMarginColor(results.marginAnalysis.grossMargin.percentage, results.benchmarkComparison.industryAverageMargins.gross)}`}>
                      {results.marginAnalysis.grossMargin.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={results.marginAnalysis.grossMargin.percentage} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Operating Margin:</span>
                    <span className="font-medium">{results.marginAnalysis.operatingMargin.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Margin:</span>
                    <span className="font-medium">{results.marginAnalysis.netMargin.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contribution Margin:</span>
                    <span className="font-medium">{results.marginAnalysis.contributionMargin.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EBITDA Margin:</span>
                    <span className="font-medium">{results.marginAnalysis.ebitdaMargin.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Cost Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Direct Costs:</span>
                  <span className="font-medium">${results.costAnalysis.costBreakdown.directCosts.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Indirect Costs:</span>
                  <span className="font-medium">${results.costAnalysis.costBreakdown.indirectCosts.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Variable Costs:</span>
                  <span className="font-medium">${results.costAnalysis.costBreakdown.variableCosts.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fixed Costs:</span>
                  <span className="font-medium">${results.costAnalysis.costBreakdown.fixedCosts.toFixed(0)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total Costs:</span>
                  <span className="font-bold text-lg">${results.costAnalysis.totalCosts.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profitability Drivers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Key Profitability Drivers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Revenue Drivers</h5>
                  <div className="space-y-1">
                    {results.profitabilityDrivers.revenueDrivers.slice(0, 3).map((driver, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Cost Drivers</h5>
                  <div className="space-y-1">
                    {results.profitabilityDrivers.costDrivers.slice(0, 3).map((driver, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-600 mb-2">Operational Drivers</h5>
                  <div className="space-y-1">
                    {results.profitabilityDrivers.operationalDrivers.slice(0, 3).map((driver, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="margins" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Margin Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Gross Margin</span>
                      <span className="text-sm font-medium">{results.marginAnalysis.grossMargin.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.marginAnalysis.grossMargin.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Amount: ${results.marginAnalysis.grossMargin.amount.toFixed(0)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Operating Margin</span>
                      <span className="text-sm font-medium">{results.marginAnalysis.operatingMargin.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.max(0, results.marginAnalysis.operatingMargin.percentage)} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Amount: ${results.marginAnalysis.operatingMargin.amount.toFixed(0)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Net Margin</span>
                      <span className="text-sm font-medium">{results.marginAnalysis.netMargin.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.max(0, results.marginAnalysis.netMargin.percentage)} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Amount: ${results.marginAnalysis.netMargin.amount.toFixed(0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Margin Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.marginAnalysis.marginTrends.map((trend, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{trend.period}</span>
                      <div className="text-right">
                        <div className="text-sm">Gross: {trend.grossMargin.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Net: {trend.netMargin.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Structure Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Direct Costs:</span>
                    <span className="font-medium">${results.costAnalysis.costBreakdown.directCosts.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Indirect Costs:</span>
                    <span className="font-medium">${results.costAnalysis.costBreakdown.indirectCosts.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Variable Costs:</span>
                    <span className="font-medium">${results.costAnalysis.costBreakdown.variableCosts.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fixed Costs:</span>
                    <span className="font-medium">${results.costAnalysis.costBreakdown.fixedCosts.toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${results.costAnalysis.totalCosts.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold">{results.costAnalysis.costEfficiency.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Cost Efficiency Rating</div>
                </div>
                
                <div className="space-y-2">
                  {results.costAnalysis.costTrends.map((trend, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{trend.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">${trend.current.toFixed(0)}</span>
                        <div className="text-xs text-muted-foreground">{trend.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Industry Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Gross Margin</span>
                      <span>Your: {results.marginAnalysis.grossMargin.percentage.toFixed(1)}% | Industry: {results.benchmarkComparison.industryAverageMargins.gross.toFixed(1)}%</span>
                    </div>
                    <div className={`text-sm ${results.benchmarkComparison.marginGap.gross >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Gap: {results.benchmarkComparison.marginGap.gross > 0 ? '+' : ''}{results.benchmarkComparison.marginGap.gross.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Operating Margin</span>
                      <span>Your: {results.marginAnalysis.operatingMargin.percentage.toFixed(1)}% | Industry: {results.benchmarkComparison.industryAverageMargins.operating.toFixed(1)}%</span>
                    </div>
                    <div className={`text-sm ${results.benchmarkComparison.marginGap.operating >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Gap: {results.benchmarkComparison.marginGap.operating > 0 ? '+' : ''}{results.benchmarkComparison.marginGap.operating.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Net Margin</span>
                      <span>Your: {results.marginAnalysis.netMargin.percentage.toFixed(1)}% | Industry: {results.benchmarkComparison.industryAverageMargins.net.toFixed(1)}%</span>
                    </div>
                    <div className={`text-sm ${results.benchmarkComparison.marginGap.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Gap: {results.benchmarkComparison.marginGap.net > 0 ? '+' : ''}{results.benchmarkComparison.marginGap.net.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${getPerformanceColor(results.benchmarkComparison.performanceRating)}`}>
                    {results.benchmarkComparison.performanceRating.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Overall Performance</div>
                  <Badge variant={results.benchmarkComparison.performanceRating >= 7 ? 'default' : 
                                 results.benchmarkComparison.performanceRating >= 5 ? 'secondary' : 'destructive'}>
                    {results.benchmarkComparison.competitivePosition}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Optimistic Case</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">${results.scenarioAnalysis.optimisticCase.revenue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span className="font-medium">{results.scenarioAnalysis.optimisticCase.margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit:</span>
                    <span className="font-medium">${results.scenarioAnalysis.optimisticCase.profit.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Base Case</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">${results.scenarioAnalysis.baseCase.revenue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span className="font-medium">{results.scenarioAnalysis.baseCase.margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit:</span>
                    <span className="font-medium">${results.scenarioAnalysis.baseCase.profit.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Pessimistic Case</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">${results.scenarioAnalysis.pessimisticCase.revenue.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span className="font-medium">{results.scenarioAnalysis.pessimisticCase.margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit:</span>
                    <span className="font-medium">${results.scenarioAnalysis.pessimisticCase.profit.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Break-Even Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">${results.scenarioAnalysis.breakEvenAnalysis.breakEvenRevenue.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Break-Even Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{results.scenarioAnalysis.breakEvenAnalysis.marginOfSafety.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Margin of Safety</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{results.scenarioAnalysis.breakEvenAnalysis.operatingLeverage.toFixed(1)}x</div>
                  <div className="text-sm text-muted-foreground">Operating Leverage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <Lightbulb className="h-5 w-5" />
                  <span>Cost Reduction Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.improvementOpportunities.costReduction.map((opp, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-3">
                      <div className="font-medium text-sm">{opp.opportunity}</div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Potential: {opp.potential.toFixed(1)}%</span>
                        <span className={getDifficultyColor(opp.difficulty)}>
                          {opp.difficulty} | {opp.timeframe}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                  <span>Revenue Enhancement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.improvementOpportunities.revenueEnhancement.map((opp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3">
                      <div className="font-medium text-sm">{opp.opportunity}</div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Potential: {opp.potential.toFixed(1)}%</span>
                        <span className={getDifficultyColor(opp.difficulty)}>
                          {opp.difficulty} | {opp.timeframe}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-600">
                  <Target className="h-5 w-5" />
                  <span>Margin Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.strategicRecommendations.marginOptimization.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-600">
                  <DollarSign className="h-5 w-5" />
                  <span>Cost Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.strategicRecommendations.costManagement.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Action Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.alertsAndRecommendations.actionItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfitMarginCalculatorResults;
