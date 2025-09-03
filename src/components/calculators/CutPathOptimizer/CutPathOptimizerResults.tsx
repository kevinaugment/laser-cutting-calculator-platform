import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Route, 
  Target, 
  BarChart3, 
  Settings,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  Thermometer
} from 'lucide-react';

interface CutPathOptimizerResultsProps {
  results: {
    optimizedPath: Array<{
      sequenceNumber: number;
      featureId: string;
      featureType: string;
      startTime: number;
      cuttingTime: number;
      travelTime: number;
      pierceTime: number;
      totalTime: number;
      thermalLoad: number;
      qualityRisk: 'low' | 'medium' | 'high';
    }>;
    pathSummary: {
      totalCuttingTime: number;
      totalTravelTime: number;
      totalPierceTime: number;
      totalProcessTime: number;
      totalTravelDistance: number;
      numberOfPierces: number;
      coolingBreaks: number;
    };
    thermalAnalysis: {
      peakThermalLoad: number;
      thermalDistortionRisk: 'low' | 'medium' | 'high';
      hotSpots: Array<{ x: number; y: number; risk: number }>;
      coolingStrategy: string[];
      thermalManagement: string[];
    };
    qualityPrediction: {
      overallQualityScore: number;
      dimensionalAccuracy: number;
      surfaceFinishQuality: number;
      edgeConsistency: number;
      riskAreas: Array<{ featureId: string; risk: string; mitigation: string }>;
    };
    efficiencyMetrics: {
      cuttingEfficiency: number;
      pathEfficiency: number;
      materialUtilization: number;
      energyEfficiency: number;
      productivityIndex: number;
    };
    alternativeStrategies: Array<{
      strategyName: string;
      totalTime: number;
      qualityScore: number;
      thermalRisk: 'low' | 'medium' | 'high';
      description: string;
      tradeoffs: string[];
    }>;
    optimizationRecommendations: {
      pathImprovements: string[];
      parameterAdjustments: string[];
      sequenceOptimizations: string[];
      qualityEnhancements: string[];
    };
    riskMitigation: {
      thermalRisks: Array<{ risk: string; mitigation: string; priority: 'low' | 'medium' | 'high' }>;
      qualityRisks: Array<{ risk: string; mitigation: string; priority: 'low' | 'medium' | 'high' }>;
      productionRisks: Array<{ risk: string; mitigation: string; priority: 'low' | 'medium' | 'high' }>;
    };
  };
}

const CutPathOptimizerResults: React.FC<CutPathOptimizerResultsProps> = ({ results }) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeatureTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'external': return 'bg-blue-100 text-blue-800';
      case 'internal': return 'bg-green-100 text-green-800';
      case 'hole': return 'bg-purple-100 text-purple-800';
      case 'slot': return 'bg-orange-100 text-orange-800';
      case 'notch': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{formatTime(results.pathSummary.totalProcessTime)}</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{results.efficiencyMetrics.cuttingEfficiency.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Cutting Efficiency</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.qualityPrediction.overallQualityScore.toFixed(1)}/10</div>
            <div className="text-sm text-muted-foreground">Quality Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Thermometer className={`h-8 w-8 mx-auto mb-2 ${getRiskColor(results.thermalAnalysis.thermalDistortionRisk)}`} />
            <div className={`text-2xl font-bold ${getRiskColor(results.thermalAnalysis.thermalDistortionRisk)}`}>
              {results.thermalAnalysis.thermalDistortionRisk.toUpperCase()}
            </div>
            <div className="text-sm text-muted-foreground">Thermal Risk</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="path" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="path">Path</TabsTrigger>
          <TabsTrigger value="thermal">Thermal</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="path" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Route className="h-5 w-5" />
                <span>Optimized Cut Path ({results.optimizedPath.length} features)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.optimizedPath.map((step, index) => (
                  <Card key={step.featureId} className="p-3 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">#{step.sequenceNumber}</span>
                        <span className="text-sm text-muted-foreground">{step.featureId}</span>
                        <Badge className={getFeatureTypeColor(step.featureType)}>
                          {step.featureType}
                        </Badge>
                        <Badge className={getRiskBadgeColor(step.qualityRisk)}>
                          {step.qualityRisk} risk
                        </Badge>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium">{formatTime(step.totalTime)}</div>
                        <div className="text-muted-foreground">Total</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Start Time</div>
                        <div className="font-medium">{formatTime(step.startTime)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Cutting</div>
                        <div className="font-medium">{formatTime(step.cuttingTime)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Travel</div>
                        <div className="font-medium">{formatTime(step.travelTime)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Thermal Load</div>
                        <div className="font-medium">{step.thermalLoad.toFixed(1)}/10</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Path Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(results.pathSummary.totalCuttingTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Cutting Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatTime(results.pathSummary.totalTravelTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Travel Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatTime(results.pathSummary.totalPierceTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Pierce Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {results.pathSummary.totalTravelDistance.toFixed(0)} mm
                  </div>
                  <div className="text-sm text-muted-foreground">Travel Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {results.pathSummary.numberOfPierces}
                  </div>
                  <div className="text-sm text-muted-foreground">Pierces</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {results.pathSummary.coolingBreaks}
                  </div>
                  <div className="text-sm text-muted-foreground">Cooling Breaks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thermal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5" />
                  <span>Thermal Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getRiskColor(results.thermalAnalysis.thermalDistortionRisk)}`}>
                      {results.thermalAnalysis.thermalDistortionRisk.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">Thermal Distortion Risk</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Peak Thermal Load</span>
                      <span className="text-sm font-medium">{results.thermalAnalysis.peakThermalLoad}/10</span>
                    </div>
                    <Progress value={results.thermalAnalysis.peakThermalLoad * 10} className="h-2" />
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Hot Spots</h5>
                    <div className="text-sm text-muted-foreground">
                      {results.thermalAnalysis.hotSpots.length} thermal concentration areas identified
                    </div>
                    <div className="space-y-1 mt-2">
                      {results.thermalAnalysis.hotSpots.slice(0, 3).map((spot, index) => (
                        <div key={index} className="text-sm">
                          Position ({spot.x.toFixed(0)}, {spot.y.toFixed(0)}) - Risk: {spot.risk.toFixed(1)}/10
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thermal Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-blue-600 mb-2">Cooling Strategy</h5>
                    <div className="space-y-1">
                      {results.thermalAnalysis.coolingStrategy.map((strategy, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-green-600 mb-2">Thermal Management</h5>
                    <div className="space-y-1">
                      {results.thermalAnalysis.thermalManagement.map((management, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Settings className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{management}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {results.qualityPrediction.overallQualityScore.toFixed(1)}/10
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Quality Score</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Dimensional Accuracy</span>
                        <span className="text-sm font-medium">±{results.qualityPrediction.dimensionalAccuracy.toFixed(3)} mm</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Surface Finish Quality</span>
                        <span className="text-sm font-medium">{results.qualityPrediction.surfaceFinishQuality.toFixed(1)}/5</span>
                      </div>
                      <Progress value={results.qualityPrediction.surfaceFinishQuality * 20} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Edge Consistency</span>
                        <span className="text-sm font-medium">{results.qualityPrediction.edgeConsistency.toFixed(1)}/5</span>
                      </div>
                      <Progress value={results.qualityPrediction.edgeConsistency * 20} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.qualityPrediction.riskAreas.length > 0 ? (
                    results.qualityPrediction.riskAreas.map((area, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{area.featureId}</span>
                          <Badge className={getRiskBadgeColor(area.risk)}>
                            {area.risk}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Mitigation:</strong> {area.mitigation}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-sm text-muted-foreground">No quality risk areas identified</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Efficiency Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Cutting Efficiency</span>
                      <span className="text-sm">{results.efficiencyMetrics.cuttingEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.efficiencyMetrics.cuttingEfficiency} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Cutting time vs total process time
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Path Efficiency</span>
                      <span className="text-sm">{results.efficiencyMetrics.pathEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.efficiencyMetrics.pathEfficiency} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Optimal travel distance vs actual travel
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Material Utilization</span>
                      <span className="text-sm">{results.efficiencyMetrics.materialUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.efficiencyMetrics.materialUtilization} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Cut area vs sheet area
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Energy Efficiency</span>
                      <span className="text-sm">{results.efficiencyMetrics.energyEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={results.efficiencyMetrics.energyEfficiency} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Productive energy vs total energy consumption
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.efficiencyMetrics.productivityIndex.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Parts per Hour</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Productivity Index
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alternative Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.alternativeStrategies.map((strategy, index) => (
                  <Card key={strategy.strategyName} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{strategy.strategyName}</h5>
                        <div className="text-sm text-muted-foreground">{strategy.description}</div>
                      </div>
                      <Badge className={getRiskBadgeColor(strategy.thermalRisk)}>
                        {strategy.thermalRisk} thermal risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <div className="text-muted-foreground">Total Time</div>
                        <div className="font-medium">{formatTime(strategy.totalTime)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Quality Score</div>
                        <div className="font-medium">{strategy.qualityScore}/10</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Thermal Risk</div>
                        <div className={`font-medium ${getRiskColor(strategy.thermalRisk)}`}>
                          {strategy.thermalRisk}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Tradeoffs:</div>
                      <div className="text-sm text-muted-foreground">
                        {strategy.tradeoffs.join(', ')}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-600">
                <Lightbulb className="h-5 w-5" />
                <span>Optimization Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Path Improvements</h5>
                  <div className="space-y-1">
                    {results.optimizationRecommendations.pathImprovements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Parameter Adjustments</h5>
                  <div className="space-y-1">
                    {results.optimizationRecommendations.parameterAdjustments.map((adjustment, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Settings className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{adjustment}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-purple-600 mb-2">Sequence Optimizations</h5>
                  <div className="space-y-1">
                    {results.optimizationRecommendations.sequenceOptimizations.map((optimization, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Route className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{optimization}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-orange-600 mb-2">Quality Enhancements</h5>
                  <div className="space-y-1">
                    {results.optimizationRecommendations.qualityEnhancements.map((enhancement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{enhancement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Risk Mitigation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Thermal Risks</h5>
                  <div className="space-y-2">
                    {results.riskMitigation.thermalRisks.map((risk, index) => (
                      <Card key={index} className="p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium">{risk.risk}</span>
                          <Badge className={getRiskBadgeColor(risk.priority)} size="sm">
                            {risk.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {risk.mitigation}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-yellow-600 mb-2">Quality Risks</h5>
                  <div className="space-y-2">
                    {results.riskMitigation.qualityRisks.map((risk, index) => (
                      <Card key={index} className="p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium">{risk.risk}</span>
                          <Badge className={getRiskBadgeColor(risk.priority)} size="sm">
                            {risk.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {risk.mitigation}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Production Risks</h5>
                  <div className="space-y-2">
                    {results.riskMitigation.productionRisks.map((risk, index) => (
                      <Card key={index} className="p-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium">{risk.risk}</span>
                          <Badge className={getRiskBadgeColor(risk.priority)} size="sm">
                            {risk.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {risk.mitigation}
                        </div>
                      </Card>
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

export default CutPathOptimizerResults;
