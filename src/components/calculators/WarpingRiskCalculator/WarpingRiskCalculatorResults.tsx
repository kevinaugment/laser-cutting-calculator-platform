import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  AlertTriangle, 
  Target, 
  BarChart3, 
  Settings,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Zap,
  Shield,
  Activity
} from 'lucide-react';

interface WarpingRiskCalculatorResultsProps {
  results: {
    warpingRiskAssessment: {
      overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
      riskScore: number; // 1-10 scale
      confidenceLevel: number; // percentage
      primaryRiskFactors: string[];
      riskDistribution: {
        thermalRisk: number; // percentage
        geometricRisk: number; // percentage
        materialRisk: number; // percentage
        processRisk: number; // percentage
      };
    };
    thermalAnalysis: {
      peakTemperature: number; // °C
      temperatureGradient: number; // °C/mm
      coolingRate: number; // °C/s
      thermalStress: number; // MPa
      heatAffectedArea: number; // mm²
      thermalDistortionPrediction: number; // mm
    };
    mechanicalAnalysis: {
      totalDeformation: number; // mm
      stressDistribution: {
        maxStress: number; // MPa
        avgStress: number; // MPa
        stressConcentration: number;
      };
      elasticDeformation: number; // mm
      plasticDeformation: number; // mm
      residualStress: number; // MPa
    };
    geometricFactors: {
      aspectRatioEffect: number;
      thicknessEffect: number;
      openingEffect: number;
      shapeComplexity: number;
      supportAdequacy: number;
      geometricStabilityIndex: number;
    };
    preventionStrategies: {
      parameterAdjustments: {
        recommendedPower: number; // W
        recommendedSpeed: number; // mm/min
        recommendedPasses: number;
        coolingStrategy: string;
      };
      sequenceOptimization: {
        optimalCutSequence: string;
        stressReliefPattern: string[];
        supportRecommendations: string[];
      };
      fixtureDesign: {
        fixturingStrategy: string;
        supportPoints: { x: number; y: number; force: number }[];
        clampingForce: number; // N
        releaseSequence: string[];
      };
    };
    mitigationTechniques: {
      preProcessing: string[];
      duringProcess: string[];
      postProcessing: string[];
      emergencyActions: string[];
    };
    qualityPrediction: {
      expectedFlatness: number; // mm deviation
      dimensionalAccuracy: number; // mm tolerance
      repeatability: number; // percentage
      processCapability: number; // Cpk equivalent
      qualityGrade: 'excellent' | 'good' | 'acceptable' | 'poor';
    };
    monitoringPlan: {
      criticalParameters: string[];
      measurementPoints: { x: number; y: number; parameter: string }[];
      inspectionFrequency: string;
      correctionTriggers: string[];
    };
    recommendations: {
      immediate: string[];
      processOptimization: string[];
      qualityImprovement: string[];
      preventiveMeasures: string[];
    };
    comparisonData: {
      industryStandard: number;
      bestPractice: number;
      yourPerformance: string;
      improvementPotential: number;
    };
    sensitivityAnalysis: {
      power: Array<{
        variation: string;
        riskScore: number;
        deformation: number;
        riskLevel: string;
      }>;
      thickness: Array<{
        variation: string;
        riskScore: number;
        thermalStress: number;
        qualityGrade: string;
      }>;
    };
  };
}

const WarpingRiskCalculatorResults: React.FC<WarpingRiskCalculatorResultsProps> = ({ results }) => {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-red-700';
      default: return 'text-gray-600';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'acceptable': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
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

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${getRiskColor(results.warpingRiskAssessment.overallRiskLevel)}`} />
            <div className={`text-2xl font-bold ${getRiskColor(results.warpingRiskAssessment.overallRiskLevel)}`}>
              {results.warpingRiskAssessment.overallRiskLevel.toUpperCase()}
            </div>
            <div className="text-sm text-muted-foreground">Risk Level</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.warpingRiskAssessment.riskScore.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Risk Score (/10)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{results.mechanicalAnalysis.totalDeformation.toFixed(3)}</div>
            <div className="text-sm text-muted-foreground">Deformation (mm)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getQualityColor(results.qualityPrediction.qualityGrade)}`} />
            <div className={`text-2xl font-bold ${getQualityColor(results.qualityPrediction.qualityGrade)}`}>
              {results.qualityPrediction.qualityGrade.toUpperCase()}
            </div>
            <div className="text-sm text-muted-foreground">Quality Grade</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessment" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="thermal">Thermal</TabsTrigger>
          <TabsTrigger value="mechanical">Mechanical</TabsTrigger>
          <TabsTrigger value="prevention">Prevention</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getRiskColor(results.warpingRiskAssessment.overallRiskLevel)}`}>
                    {results.warpingRiskAssessment.overallRiskLevel.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Risk Level</div>
                  <div className="text-2xl font-bold mt-2">
                    {results.warpingRiskAssessment.riskScore.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Confidence Level</span>
                    <span className="text-sm font-medium">{results.warpingRiskAssessment.confidenceLevel}%</span>
                  </div>
                  <Progress value={results.warpingRiskAssessment.confidenceLevel} className="h-2" />
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Primary Risk Factors</h5>
                  <div className="space-y-1">
                    {results.warpingRiskAssessment.primaryRiskFactors.map((factor, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Thermal Risk</span>
                      <span className="text-sm font-medium">{results.warpingRiskAssessment.riskDistribution.thermalRisk}%</span>
                    </div>
                    <Progress value={results.warpingRiskAssessment.riskDistribution.thermalRisk} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Geometric Risk</span>
                      <span className="text-sm font-medium">{results.warpingRiskAssessment.riskDistribution.geometricRisk}%</span>
                    </div>
                    <Progress value={results.warpingRiskAssessment.riskDistribution.geometricRisk} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Material Risk</span>
                      <span className="text-sm font-medium">{results.warpingRiskAssessment.riskDistribution.materialRisk}%</span>
                    </div>
                    <Progress value={results.warpingRiskAssessment.riskDistribution.materialRisk} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Process Risk</span>
                      <span className="text-sm font-medium">{results.warpingRiskAssessment.riskDistribution.processRisk}%</span>
                    </div>
                    <Progress value={results.warpingRiskAssessment.riskDistribution.processRisk} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Geometric Factors Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{results.geometricFactors.aspectRatioEffect}</div>
                  <div className="text-sm text-muted-foreground">Aspect Ratio Effect</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{results.geometricFactors.thicknessEffect}</div>
                  <div className="text-sm text-muted-foreground">Thickness Effect</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{results.geometricFactors.openingEffect}</div>
                  <div className="text-sm text-muted-foreground">Opening Effect</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{results.geometricFactors.shapeComplexity}</div>
                  <div className="text-sm text-muted-foreground">Shape Complexity</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{results.geometricFactors.supportAdequacy}</div>
                  <div className="text-sm text-muted-foreground">Support Adequacy</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{results.geometricFactors.geometricStabilityIndex}</div>
                  <div className="text-sm text-muted-foreground">Stability Index</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thermal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Thermal Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Peak Temperature:</span>
                    <span className="font-medium">{results.thermalAnalysis.peakTemperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature Gradient:</span>
                    <span className="font-medium">{results.thermalAnalysis.temperatureGradient} °C/mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cooling Rate:</span>
                    <span className="font-medium">{results.thermalAnalysis.coolingRate} °C/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Stress:</span>
                    <span className="font-medium">{results.thermalAnalysis.thermalStress} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heat Affected Area:</span>
                    <span className="font-medium">{results.thermalAnalysis.heatAffectedArea} mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Distortion:</span>
                    <span className="font-medium">{results.thermalAnalysis.thermalDistortionPrediction} mm</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getQualityColor(results.qualityPrediction.qualityGrade)}`}>
                      {results.qualityPrediction.qualityGrade.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">Quality Grade</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Expected Flatness:</span>
                      <span className="font-medium">{results.qualityPrediction.expectedFlatness} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimensional Accuracy:</span>
                      <span className="font-medium">±{results.qualityPrediction.dimensionalAccuracy} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repeatability:</span>
                      <span className="font-medium">{results.qualityPrediction.repeatability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Process Capability:</span>
                      <span className="font-medium">{results.qualityPrediction.processCapability}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mechanical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mechanical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {results.mechanicalAnalysis.totalDeformation.toFixed(3)} mm
                    </div>
                    <div className="text-sm text-muted-foreground">Total Deformation</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Elastic Deformation:</span>
                      <span className="font-medium">{results.mechanicalAnalysis.elasticDeformation.toFixed(3)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plastic Deformation:</span>
                      <span className="font-medium">{results.mechanicalAnalysis.plasticDeformation.toFixed(3)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Residual Stress:</span>
                      <span className="font-medium">{results.mechanicalAnalysis.residualStress} MPa</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Maximum Stress:</span>
                    <span className="font-medium">{results.mechanicalAnalysis.stressDistribution.maxStress} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Stress:</span>
                    <span className="font-medium">{results.mechanicalAnalysis.stressDistribution.avgStress} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stress Concentration:</span>
                    <span className="font-medium">{results.mechanicalAnalysis.stressDistribution.stressConcentration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prevention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-600">
                <Settings className="h-5 w-5" />
                <span>Prevention Strategies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold mb-2">Parameter Adjustments</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Recommended Power</div>
                      <div className="text-lg font-bold text-blue-600">{results.preventionStrategies.parameterAdjustments.recommendedPower}W</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Recommended Speed</div>
                      <div className="text-lg font-bold text-blue-600">{results.preventionStrategies.parameterAdjustments.recommendedSpeed} mm/min</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Recommended Passes</div>
                      <div className="text-lg font-bold text-blue-600">{results.preventionStrategies.parameterAdjustments.recommendedPasses}</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">Cooling Strategy</div>
                      <div className="text-sm font-medium">{results.preventionStrategies.parameterAdjustments.coolingStrategy}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Sequence Optimization</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Optimal Cut Sequence:</span> {results.preventionStrategies.sequenceOptimization.optimalCutSequence}
                    </div>
                    <div>
                      <span className="font-medium">Stress Relief Pattern:</span>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {results.preventionStrategies.sequenceOptimization.stressReliefPattern.map((pattern, index) => (
                          <li key={index} className="text-sm">{pattern}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">Fixture Design</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Strategy:</span> {results.preventionStrategies.fixtureDesign.fixturingStrategy}
                    </div>
                    <div>
                      <span className="font-medium">Clamping Force:</span> {results.preventionStrategies.fixtureDesign.clampingForce} N
                    </div>
                    <div>
                      <span className="font-medium">Support Points:</span> {results.preventionStrategies.fixtureDesign.supportPoints.length} locations
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mitigation Techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-green-600 mb-2">Pre-processing</h5>
                    <div className="space-y-1">
                      {results.mitigationTechniques.preProcessing.map((technique, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{technique}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-blue-600 mb-2">During Process</h5>
                    <div className="space-y-1">
                      {results.mitigationTechniques.duringProcess.map((technique, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Activity className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{technique}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Post-processing & Emergency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-purple-600 mb-2">Post-processing</h5>
                    <div className="space-y-1">
                      {results.mitigationTechniques.postProcessing.map((technique, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Settings className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{technique}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-red-600 mb-2">Emergency Actions</h5>
                    <div className="space-y-1">
                      {results.mitigationTechniques.emergencyActions.map((action, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-2">Critical Parameters</h5>
                    <div className="space-y-1">
                      {results.monitoringPlan.criticalParameters.map((param, index) => (
                        <div key={index} className="text-sm text-blue-600">• {param}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Inspection Frequency</h5>
                    <div className="text-sm">{results.monitoringPlan.inspectionFrequency}</div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Measurement Points</h5>
                    <div className="text-sm">{results.monitoringPlan.measurementPoints.length} strategic locations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Correction Triggers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {results.monitoringPlan.correctionTriggers.map((trigger, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{trigger}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Industry Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">Industry Standard</div>
                    <div className="text-2xl font-bold text-gray-600">{results.comparisonData.industryStandard.toFixed(3)} mm</div>
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
                    Potential reduction in warping risk through optimization
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                        <div>Risk: {item.riskScore.toFixed(1)}/10</div>
                        <div className="text-xs text-muted-foreground">{item.riskLevel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thickness Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.thickness.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                      <span className="font-medium">{item.variation}</span>
                      <div className="text-right">
                        <div>Risk: {item.riskScore.toFixed(1)}/10</div>
                        <div className="text-xs text-muted-foreground">{item.qualityGrade}</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Immediate Actions</h5>
                  <div className="space-y-1">
                    {results.recommendations.immediate.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Process Optimization</h5>
                  <div className="space-y-1">
                    {results.recommendations.processOptimization.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Settings className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Quality Improvement</h5>
                  <div className="space-y-1">
                    {results.recommendations.qualityImprovement.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-purple-600 mb-2">Preventive Measures</h5>
                  <div className="space-y-1">
                    {results.recommendations.preventiveMeasures.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
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

export default WarpingRiskCalculatorResults;
