import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Award, 
  CheckCircle,
  Target,
  AlertTriangle,
  Star,
  Trophy,
  Lightbulb
} from 'lucide-react';

interface EquipmentComparisonCalculatorResultsProps {
  results: {
    overallRanking: Array<{
      equipmentName: string;
      totalScore: number;
      rank: number;
      strengths: string[];
      weaknesses: string[];
    }>;
    totalCostOfOwnership: Array<{
      equipmentName: string;
      purchasePrice: number;
      operatingCost: number;
      maintenanceCost: number;
      totalTCO: number;
      tcoPerYear: number;
    }>;
    performanceComparison: Array<{
      equipmentName: string;
      productivityScore: number;
      qualityScore: number;
      capabilityScore: number;
      efficiencyScore: number;
    }>;
    riskAssessment: Array<{
      equipmentName: string;
      overallRisk: string;
      riskFactors: Array<{
        factor: string;
        level: string;
        impact: number;
        mitigation: string;
      }>;
    }>;
    paybackAnalysis: Array<{
      equipmentName: string;
      paybackPeriod: number;
      roi: number;
      npv: number;
      irr: number;
    }>;
    decisionMatrix: Array<{
      criteria: string;
      weight: number;
      scores: Array<{
        equipmentName: string;
        score: number;
        weightedScore: number;
      }>;
    }>;
    recommendations: {
      bestOverall: string;
      bestValue: string;
      bestPerformance: string;
      bestForBudget: string;
      reasoning: string[];
    };
    keyMetrics: {
      'Best Overall': string;
      'Best Value': string;
      'Lowest TCO': string;
      'Highest Performance': string;
    };
    sensitivityAnalysis: {
      criteriaImpact: Array<{
        criteria: string;
        impact: number;
        recommendation: string;
      }>;
      costSensitivity: Array<{
        equipmentName: string;
        priceChange: number;
        rankingChange: number;
      }>;
    };
  };
}

const EquipmentComparisonCalculatorResults: React.FC<EquipmentComparisonCalculatorResultsProps> = ({ results }) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-600';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-600" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-600" />;
    if (rank === 3) return <Star className="h-5 w-5 text-orange-600" />;
    return <Target className="h-5 w-5 text-gray-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 20) return 'text-green-600';
    if (roi >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-lg font-bold">{results.keyMetrics['Best Overall']}</div>
            <div className="text-sm text-muted-foreground">Best Overall</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold">{results.keyMetrics['Best Value']}</div>
            <div className="text-sm text-muted-foreground">Best Value</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold">{results.keyMetrics['Lowest TCO']}</div>
            <div className="text-sm text-muted-foreground">Lowest TCO</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-lg font-bold">{results.keyMetrics['Highest Performance']}</div>
            <div className="text-sm text-muted-foreground">Best Performance</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ranking" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="tco">TCO</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="matrix">Matrix</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Overall Equipment Ranking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.overallRanking.map((equipment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        {getRankIcon(equipment.rank)}
                        <div>
                          <h4 className="font-semibold text-lg">{equipment.equipmentName}</h4>
                          <div className="text-sm text-muted-foreground">Rank #{equipment.rank}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(equipment.totalScore)}`}>
                          {equipment.totalScore}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-green-600 mb-2">Strengths</h5>
                        <div className="space-y-1">
                          {equipment.strengths.length > 0 ? equipment.strengths.map((strength, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{strength}</span>
                            </div>
                          )) : (
                            <div className="text-sm text-muted-foreground">No significant strengths identified</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-red-600 mb-2">Areas for Consideration</h5>
                        <div className="space-y-1">
                          {equipment.weaknesses.length > 0 ? equipment.weaknesses.map((weakness, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              <span className="text-sm">{weakness}</span>
                            </div>
                          )) : (
                            <div className="text-sm text-muted-foreground">No significant weaknesses identified</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tco" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Total Cost of Ownership Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.totalCostOfOwnership.map((equipment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{equipment.equipmentName}</h4>
                      <div className="text-right">
                        <div className="text-xl font-bold">${equipment.totalTCO.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total TCO</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Purchase Price</span>
                          <span className="text-sm font-medium">${equipment.purchasePrice.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(equipment.purchasePrice / equipment.totalTCO) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Operating Cost</span>
                          <span className="text-sm font-medium">${equipment.operatingCost.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(equipment.operatingCost / equipment.totalTCO) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Maintenance Cost</span>
                          <span className="text-sm font-medium">${equipment.maintenanceCost.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(equipment.maintenanceCost / equipment.totalTCO) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="font-medium">TCO per Year:</span>
                          <span className="font-medium">${equipment.tcoPerYear.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Comparison</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.performanceComparison.map((equipment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{equipment.equipmentName}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Productivity Score</span>
                          <span className={`text-sm font-medium ${getScoreColor(equipment.productivityScore)}`}>
                            {equipment.productivityScore}/100
                          </span>
                        </div>
                        <Progress value={equipment.productivityScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Quality Score</span>
                          <span className={`text-sm font-medium ${getScoreColor(equipment.qualityScore)}`}>
                            {equipment.qualityScore}/100
                          </span>
                        </div>
                        <Progress value={equipment.qualityScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Capability Score</span>
                          <span className={`text-sm font-medium ${getScoreColor(equipment.capabilityScore)}`}>
                            {equipment.capabilityScore}/100
                          </span>
                        </div>
                        <Progress value={equipment.capabilityScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Efficiency Score</span>
                          <span className={`text-sm font-medium ${getScoreColor(equipment.efficiencyScore)}`}>
                            {equipment.efficiencyScore}/100
                          </span>
                        </div>
                        <Progress value={equipment.efficiencyScore} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">Overall Performance:</span>
                        <span className={`font-medium ${getScoreColor((equipment.productivityScore + equipment.qualityScore + equipment.capabilityScore + equipment.efficiencyScore) / 4)}`}>
                          {Math.round((equipment.productivityScore + equipment.qualityScore + equipment.capabilityScore + equipment.efficiencyScore) / 4)}/100
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payback Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.paybackAnalysis.map((equipment, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h5 className="font-semibold mb-2">{equipment.equipmentName}</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Payback Period:</span>
                          <div className="font-medium">{equipment.paybackPeriod} years</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ROI:</span>
                          <div className={`font-medium ${getROIColor(equipment.roi)}`}>
                            {equipment.roi.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">NPV:</span>
                          <div className="font-medium">${equipment.npv.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">IRR:</span>
                          <div className="font-medium">{equipment.irr.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.riskAssessment.map((equipment, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-semibold">{equipment.equipmentName}</h5>
                        <Badge variant={equipment.overallRisk === 'Low' ? 'default' : 
                                       equipment.overallRisk === 'Medium' ? 'secondary' : 'destructive'}>
                          {equipment.overallRisk} Risk
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {equipment.riskFactors.slice(0, 3).map((risk, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-muted-foreground">{risk.factor}:</span>
                            <span className={`ml-1 ${getRiskColor(risk.level)}`}>{risk.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Criteria</th>
                      <th className="text-center p-2">Weight</th>
                      {results.decisionMatrix[0]?.scores.map((score, index) => (
                        <th key={index} className="text-center p-2">{score.equipmentName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.decisionMatrix.map((criterion, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{criterion.criteria}</td>
                        <td className="text-center p-2">{criterion.weight}%</td>
                        {criterion.scores.map((score, scoreIndex) => (
                          <td key={scoreIndex} className="text-center p-2">
                            <div className={`font-medium ${getScoreColor(score.score)}`}>
                              {score.score}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ({score.weightedScore})
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <span>Key Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="font-semibold text-yellow-800">Best Overall Choice</div>
                    <div className="text-yellow-700">{results.recommendations.bestOverall}</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <div className="font-semibold text-green-800">Best Value for Money</div>
                    <div className="text-green-700">{results.recommendations.bestValue}</div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="font-semibold text-blue-800">Best Performance</div>
                    <div className="text-blue-700">{results.recommendations.bestPerformance}</div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                    <div className="font-semibold text-purple-800">Best for Budget</div>
                    <div className="text-purple-700">{results.recommendations.bestForBudget}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decision Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.recommendations.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{reason}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sensitivity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-3">Criteria Impact</h5>
                  <div className="space-y-2">
                    {results.sensitivityAnalysis.criteriaImpact.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{item.criteria}</span>
                          <span className="font-medium">{item.impact.toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{item.recommendation}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3">Price Sensitivity</h5>
                  <div className="space-y-2">
                    {results.sensitivityAnalysis.costSensitivity.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{item.equipmentName}</span>
                          <span className="font-medium">
                            {item.priceChange > 0 ? '+' : ''}{item.priceChange}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Ranking change: {item.rankingChange > 0 ? '+' : ''}{item.rankingChange}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentComparisonCalculatorResults;
