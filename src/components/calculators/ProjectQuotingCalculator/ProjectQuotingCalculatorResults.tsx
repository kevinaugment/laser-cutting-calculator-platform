import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Shield,
  Users,
  Calculator
} from 'lucide-react';

interface ProjectQuotingCalculatorResultsProps {
  results: {
    costBreakdown: {
      totalProjectCost: number;
      directCosts: {
        materialCost: number;
        laborCost: number;
        machineCost: number;
        subcontractingCost: number;
        totalDirectCost: number;
      };
      indirectCosts: {
        overheadCost: number;
        administrativeCost: number;
        salesCost: number;
        engineeringCost: number;
        totalIndirectCost: number;
      };
      riskContingency: number;
      profitMargin: number;
    };
    pricingAnalysis: {
      basePrice: number;
      adjustedPrice: number;
      competitivePrice: number;
      recommendedPrice: number;
      pricePerPart: number;
      pricePerPound: number;
      pricePerSquareFoot: number;
    };
    profitabilityAnalysis: {
      grossProfit: number;
      grossProfitMargin: number;
      netProfit: number;
      netProfitMargin: number;
      breakEvenQuantity: number;
      returnOnInvestment: number;
      paybackPeriod: number;
    };
    competitiveAnalysis: {
      marketPosition: string;
      competitiveAdvantage: string[];
      pricingRecommendations: string[];
      marketShare: number;
      competitorComparison: Array<{
        competitor: string;
        estimatedPrice: number;
        marketShare: number;
        strengths: string[];
      }>;
    };
    riskAssessment: {
      overallRiskLevel: string;
      riskFactors: Array<{
        factor: string;
        level: string;
        impact: number;
        mitigation: string;
      }>;
      contingencyRecommendation: number;
      insuranceRequirements: string[];
    };
    scenarioAnalysis: {
      optimisticScenario: { price: number; margin: number; probability: number };
      mostLikelyScenario: { price: number; margin: number; probability: number };
      pessimisticScenario: { price: number; margin: number; probability: number };
      sensitivityFactors: Array<{
        factor: string;
        impact: number;
      }>;
    };
    quotingStrategy: {
      recommendedApproach: string;
      negotiationPoints: string[];
      valueProposition: string[];
      riskMitigationStrategies: string[];
    };
    documentationRequirements: {
      technicalDrawings: boolean;
      materialCertificates: boolean;
      qualityPlan: boolean;
      deliverySchedule: boolean;
      warrantyTerms: string;
      paymentSchedule: string;
    };
    alertsAndRecommendations: {
      criticalAlerts: string[];
      recommendations: string[];
      actionItems: string[];
    };
  };
}

const ProjectQuotingCalculatorResults: React.FC<ProjectQuotingCalculatorResultsProps> = ({ results }) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 25) return 'text-green-600';
    if (margin >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 40) return 'text-green-600';
    if (probability >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${results.pricingAnalysis.recommendedPrice.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Recommended Price</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getMarginColor(results.profitabilityAnalysis.grossProfitMargin)}`} />
            <div className="text-2xl font-bold">{results.profitabilityAnalysis.grossProfitMargin.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Profit Margin</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className={`h-8 w-8 mx-auto mb-2 ${getRiskColor(results.riskAssessment.overallRiskLevel)}`} />
            <div className="text-2xl font-bold">{results.riskAssessment.overallRiskLevel}</div>
            <div className="text-sm text-muted-foreground">Risk Level</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calculator className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">${results.pricingAnalysis.pricePerPart.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Price per Part</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Cost Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Project Cost</span>
                    <span className="font-semibold">${results.costBreakdown.totalProjectCost.toFixed(0)}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Direct Costs:</span>
                    <span className="font-medium">${results.costBreakdown.directCosts.totalDirectCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Indirect Costs:</span>
                    <span className="font-medium">${results.costBreakdown.indirectCosts.totalIndirectCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Contingency:</span>
                    <span className="font-medium">${results.costBreakdown.riskContingency.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin:</span>
                    <span className="font-medium">${results.costBreakdown.profitMargin.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Profitability Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Gross Profit:</span>
                  <span className="font-medium">${results.profitabilityAnalysis.grossProfit.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Margin:</span>
                  <span className={`font-medium ${getMarginColor(results.profitabilityAnalysis.grossProfitMargin)}`}>
                    {results.profitabilityAnalysis.grossProfitMargin.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net Profit:</span>
                  <span className="font-medium">${results.profitabilityAnalysis.netProfit.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI:</span>
                  <span className="font-medium">{results.profitabilityAnalysis.returnOnInvestment.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Break-even Qty:</span>
                  <span className="font-medium">{results.profitabilityAnalysis.breakEvenQuantity.toFixed(0)} parts</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Pricing Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">${results.pricingAnalysis.basePrice.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Base Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">${results.pricingAnalysis.competitivePrice.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Competitive Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">${results.pricingAnalysis.recommendedPrice.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Recommended Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">${results.pricingAnalysis.pricePerPart.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Price per Part</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Direct Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Material Cost:</span>
                    <span className="font-medium">${results.costBreakdown.directCosts.materialCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor Cost:</span>
                    <span className="font-medium">${results.costBreakdown.directCosts.laborCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Machine Cost:</span>
                    <span className="font-medium">${results.costBreakdown.directCosts.machineCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subcontracting:</span>
                    <span className="font-medium">${results.costBreakdown.directCosts.subcontractingCost.toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total Direct:</span>
                    <span className="font-bold">${results.costBreakdown.directCosts.totalDirectCost.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indirect Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Overhead:</span>
                    <span className="font-medium">${results.costBreakdown.indirectCosts.overheadCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Administrative:</span>
                    <span className="font-medium">${results.costBreakdown.indirectCosts.administrativeCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales:</span>
                    <span className="font-medium">${results.costBreakdown.indirectCosts.salesCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engineering:</span>
                    <span className="font-medium">${results.costBreakdown.indirectCosts.engineeringCost.toFixed(0)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Total Indirect:</span>
                    <span className="font-bold">${results.costBreakdown.indirectCosts.totalIndirectCost.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">${results.costBreakdown.riskContingency.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Risk Contingency</div>
                  <div className="text-xs text-muted-foreground">
                    {((results.costBreakdown.riskContingency / results.costBreakdown.totalProjectCost) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">${results.costBreakdown.profitMargin.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Profit Margin</div>
                  <div className="text-xs text-muted-foreground">
                    {((results.costBreakdown.profitMargin / results.costBreakdown.totalProjectCost) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">${results.costBreakdown.totalProjectCost.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Total Project Cost</div>
                  <div className="text-xs text-muted-foreground">All costs included</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Base Price</span>
                      <span className="text-sm font-medium">${results.pricingAnalysis.basePrice.toFixed(0)}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Adjusted Price</span>
                      <span className="text-sm font-medium">${results.pricingAnalysis.adjustedPrice.toFixed(0)}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Competitive Price</span>
                      <span className="text-sm font-medium">${results.pricingAnalysis.competitivePrice.toFixed(0)}</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold">Recommended Price</span>
                      <span className="text-sm font-bold text-green-600">${results.pricingAnalysis.recommendedPrice.toFixed(0)}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unit Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Price per Part:</span>
                    <span className="font-medium">${results.pricingAnalysis.pricePerPart.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Pound:</span>
                    <span className="font-medium">${results.pricingAnalysis.pricePerPound.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per Sq Ft:</span>
                    <span className="font-medium">${results.pricingAnalysis.pricePerSquareFoot.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-center">
                  <Badge variant={results.competitiveAnalysis.marketPosition === 'Strong' ? 'default' : 
                                 results.competitiveAnalysis.marketPosition === 'Competitive' ? 'secondary' : 'outline'}>
                    {results.competitiveAnalysis.marketPosition} Market Position
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Competitive Advantages</h5>
                  <div className="space-y-1">
                    {results.competitiveAnalysis.competitiveAdvantage.map((advantage, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Pricing Recommendations</h5>
                  <div className="space-y-1">
                    {results.competitiveAnalysis.pricingRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Risk Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className={`text-3xl font-bold ${getRiskColor(results.riskAssessment.overallRiskLevel)}`}>
                  {results.riskAssessment.overallRiskLevel}
                </div>
                <div className="text-sm text-muted-foreground">Overall Risk Level</div>
              </div>
              
              <div className="space-y-3">
                {results.riskAssessment.riskFactors.map((risk, index) => (
                  <div key={index} className="border-l-4 border-yellow-500 pl-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{risk.factor}</div>
                        <div className="text-xs text-muted-foreground">{risk.mitigation}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={risk.level === 'High' ? 'destructive' : 
                                      risk.level === 'Medium' ? 'secondary' : 'outline'}>
                          {risk.level}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Impact: {risk.impact.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Mitigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Contingency Recommendation</h5>
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-2xl font-bold text-yellow-600">
                      {results.riskAssessment.contingencyRecommendation.toFixed(1)}%
                    </div>
                    <div className="text-sm text-yellow-800">Additional Contingency</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Insurance Requirements</h5>
                  <div className="space-y-1">
                    {results.riskAssessment.insuranceRequirements.map((req, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Optimistic Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${results.scenarioAnalysis.optimisticScenario.price.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span className="font-medium">{results.scenarioAnalysis.optimisticScenario.margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Probability:</span>
                    <span className={`font-medium ${getProbabilityColor(results.scenarioAnalysis.optimisticScenario.probability)}`}>
                      {results.scenarioAnalysis.optimisticScenario.probability.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Most Likely Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${results.scenarioAnalysis.mostLikelyScenario.price.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span className="font-medium">{results.scenarioAnalysis.mostLikelyScenario.margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Probability:</span>
                    <span className={`font-medium ${getProbabilityColor(results.scenarioAnalysis.mostLikelyScenario.probability)}`}>
                      {results.scenarioAnalysis.mostLikelyScenario.probability.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Pessimistic Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${results.scenarioAnalysis.pessimisticScenario.price.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin:</span>
                    <span className="font-medium">{results.scenarioAnalysis.pessimisticScenario.margin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Probability:</span>
                    <span className={`font-medium ${getProbabilityColor(results.scenarioAnalysis.pessimisticScenario.probability)}`}>
                      {results.scenarioAnalysis.pessimisticScenario.probability.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sensitivity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.scenarioAnalysis.sensitivityFactors.map((factor, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{factor.factor}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24">
                        <Progress value={Math.abs(factor.impact)} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Quoting Strategy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Recommended Approach</h5>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">{results.quotingStrategy.recommendedApproach}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Value Proposition</h5>
                  <div className="space-y-1">
                    {results.quotingStrategy.valueProposition.map((value, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Negotiation Points</h5>
                  <div className="space-y-1">
                    {results.quotingStrategy.negotiationPoints.map((point, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.alertsAndRecommendations.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectQuotingCalculatorResults;
