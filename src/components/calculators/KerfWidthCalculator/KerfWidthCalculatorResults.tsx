import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Ruler, 
  Target, 
  BarChart3, 
  Settings,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface KerfWidthCalculatorResultsProps {
  results: {
    predictedKerfWidth: number; // mm
    kerfWidthRange: { min: number; max: number }; // mm
    compensationValue: number; // mm (for CAD/CAM)
    materialUtilization: number; // percentage
    qualityGrade: number; // 1-5 scale
    heatAffectedZone: number; // mm
    edgeQuality: {
      roughness: number; // Ra in μm
      squareness: number; // degrees from perpendicular
      drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive';
    };
    optimizationSuggestions: string[];
    recommendations: string[];
    keyMetrics: {
      'Predicted Kerf Width': string;
      'Compensation Value': string;
      'Material Utilization': string;
      'Quality Grade': string;
    };
    sensitivityAnalysis: {
      power: Array<{
        variation: string;
        kerfWidth: number;
        change: string;
      }>;
      speed: Array<{
        variation: string;
        kerfWidth: number;
        change: string;
      }>;
    };
    materialEfficiency: {
      kerfLossPerMeter: number; // mm³ per meter of cutting
      annualMaterialSavings: number; // USD
      wasteReduction: number; // percentage
      costImpact: {
        materialCost: number;
        timeCost: number;
        totalSavings: number;
      };
    };
    qualityAssessment: {
      dimensionalAccuracy: number; // percentage
      edgeFinish: string;
      postProcessingRequired: boolean;
      toleranceClass: string;
      applicationSuitability: string[];
    };
    processStability: {
      stabilityIndex: number; // 0-100
      criticalParameters: string[];
      monitoringRecommendations: string[];
      controlLimits: {
        upperLimit: number;
        lowerLimit: number;
        targetValue: number;
      };
    };
    comparisonData: {
      industryAverage: number;
      bestPractice: number;
      yourPerformance: string;
      improvementPotential: number;
    };
  };
}

const KerfWidthCalculatorResults: React.FC<KerfWidthCalculatorResultsProps> = ({ results }) => {
  const getQualityColor = (grade: number) => {
    if (grade >= 4.5) return 'text-green-600';
    if (grade >= 3.5) return 'text-blue-600';
    if (grade >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDrossColor = (dross: string) => {
    switch (dross) {
      case 'none': return 'text-green-600';
      case 'minimal': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'excessive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStabilityColor = (stability: number) => {
    if (stability >= 80) return 'text-green-600';
    if (stability >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Ruler className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.predictedKerfWidth.toFixed(3)}</div>
            <div className="text-sm text-muted-foreground">Kerf Width (mm)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{results.compensationValue.toFixed(3)}</div>
            <div className="text-sm text-muted-foreground">Compensation (mm)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.materialUtilization.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Material Utilization</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getQualityColor(results.qualityGrade)}`} />
            <div className="text-2xl font-bold">{results.qualityGrade}/5</div>
            <div className="text-sm text-muted-foreground">Quality Grade</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="prediction" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="stability">Stability</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="prediction" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ruler className="h-5 w-5" />
                  <span>Kerf Width Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {results.predictedKerfWidth.toFixed(3)} mm
                  </div>
                  <div className="text-sm text-muted-foreground">Predicted Kerf Width</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Range (±15%):</span>
                    <span className="font-medium">
                      {results.kerfWidthRange.min.toFixed(3)} - {results.kerfWidthRange.max.toFixed(3)} mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CAD Compensation:</span>
                    <span className="font-medium">{results.compensationValue.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heat Affected Zone:</span>
                    <span className="font-medium">{results.heatAffectedZone.toFixed(3)} mm</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Edge Quality Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Quality Grade</span>
                      <span className={`text-sm font-medium ${getQualityColor(results.qualityGrade)}`}>
                        {results.qualityGrade}/5
                      </span>
                    </div>
                    <Progress value={results.qualityGrade * 20} className="h-2" />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span>Surface Roughness:</span>
                      <span className="font-medium">{results.edgeQuality.roughness} μm Ra</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Edge Squareness:</span>
                      <span className="font-medium">{results.edgeQuality.squareness}° deviation</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dross Level:</span>
                      <span className={`font-medium capitalize ${getDrossColor(results.edgeQuality.drossLevel)}`}>
                        {results.edgeQuality.drossLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Optimization Suggestions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.optimizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Dimensional Accuracy:</span>
                    <span className="font-medium">{results.qualityAssessment.dimensionalAccuracy.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edge Finish:</span>
                    <span className="font-medium">{results.qualityAssessment.edgeFinish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Post-Processing:</span>
                    <span className={`font-medium ${results.qualityAssessment.postProcessingRequired ? 'text-yellow-600' : 'text-green-600'}`}>
                      {results.qualityAssessment.postProcessingRequired ? 'Required' : 'Not Required'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tolerance Class:</span>
                    <span className="font-medium">{results.qualityAssessment.toleranceClass}</span>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Application Suitability</h5>
                  <div className="space-y-1">
                    {results.qualityAssessment.applicationSuitability.map((app, index) => (
                      <div key={index} className="text-sm text-green-600">• {app}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Material Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Material Utilization:</span>
                    <span className="font-medium">{results.materialUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kerf Loss per Meter:</span>
                    <span className="font-medium">{results.materialEfficiency.kerfLossPerMeter.toFixed(1)} mm³/m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Reduction:</span>
                    <span className="font-medium text-green-600">{results.materialEfficiency.wasteReduction.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Savings:</span>
                    <span className="font-medium text-green-600">${results.materialEfficiency.annualMaterialSavings.toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Material Cost Impact:</span>
                    <span className="font-medium">${results.materialEfficiency.costImpact.materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Cost Impact:</span>
                    <span className="font-medium">${results.materialEfficiency.costImpact.timeCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total Savings:</span>
                    <span className="font-bold text-green-600">${results.materialEfficiency.costImpact.totalSavings.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Process Stability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-center mb-4">
                    <div className={`text-3xl font-bold ${getStabilityColor(results.processStability.stabilityIndex)}`}>
                      {results.processStability.stabilityIndex}
                    </div>
                    <div className="text-sm text-muted-foreground">Stability Index (0-100)</div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-semibold">Control Limits</h5>
                    <div className="text-sm space-y-1">
                      <div>Target: {results.processStability.controlLimits.targetValue.toFixed(3)} mm</div>
                      <div>Upper: {results.processStability.controlLimits.upperLimit.toFixed(3)} mm</div>
                      <div>Lower: {results.processStability.controlLimits.lowerLimit.toFixed(3)} mm</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Critical Parameters</h5>
                  <div className="space-y-1">
                    {results.processStability.criticalParameters.map((param, index) => (
                      <div key={index} className="text-sm">• {param}</div>
                    ))}
                  </div>
                  
                  <h5 className="font-semibold mb-2 mt-4">Monitoring Recommendations</h5>
                  <div className="space-y-1">
                    {results.processStability.monitoringRecommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-blue-600">• {rec}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Industry Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">Industry Average</div>
                    <div className="text-2xl font-bold text-gray-600">{results.comparisonData.industryAverage.toFixed(3)} mm</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Best Practice</div>
                    <div className="text-2xl font-bold text-green-600">{results.comparisonData.bestPractice.toFixed(3)} mm</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Your Performance</div>
                    <div className={`text-2xl font-bold ${getPerformanceColor(results.comparisonData.yourPerformance)}`}>
                      {results.comparisonData.yourPerformance.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Improvement Potential</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {results.comparisonData.improvementPotential.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Potential reduction in kerf width through optimization
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Power Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.power.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                      <span className="font-medium">{item.variation}</span>
                      <div className="text-right">
                        <div>{item.kerfWidth.toFixed(3)} mm</div>
                        <div className="text-xs text-muted-foreground">{item.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Speed Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.speed.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                      <span className="font-medium">{item.variation}</span>
                      <div className="text-right">
                        <div>{item.kerfWidth.toFixed(3)} mm</div>
                        <div className="text-xs text-muted-foreground">{item.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <Lightbulb className="h-5 w-5" />
                <span>Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
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

export default KerfWidthCalculatorResults;
