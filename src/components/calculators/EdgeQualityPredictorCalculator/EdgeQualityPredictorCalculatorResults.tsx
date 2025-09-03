import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Settings,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';

interface EdgeQualityPredictorCalculatorResultsProps {
  results: {
    qualityPrediction: {
      overallQualityGrade: number; // 1-5
      edgeRoughness: number; // μm Ra
      confidenceLevel: number; // percentage
      qualityClass: string;
      expectedVariation: number; // percentage
    };
    edgeCharacteristics: {
      topEdgeQuality: string;
      bottomEdgeQuality: string;
      kerfTaper: number; // degrees
      kerfWidth: number; // mm
      drossLevel: string;
      heatAffectedZone: number; // mm
      edgeAngle: number; // degrees from perpendicular
    };
    qualityFactors: {
      materialFactor: number;
      powerSpeedFactor: number;
      gasPressureFactor: number;
      focusQualityFactor: number;
      beamQualityFactor: number;
      environmentalFactor: number;
    };
    defectRiskAnalysis: {
      roughnessRisk: string;
      taperRisk: string;
      drossRisk: string;
      burnRisk: string;
      hazRisk: string;
      mitigationStrategies: string[];
    };
    parameterOptimization: {
      powerRecommendation: {
        current: number;
        optimal: number;
        improvement: string;
      };
      speedRecommendation: {
        current: number;
        optimal: number;
        improvement: string;
      };
      focusRecommendation: {
        current: number;
        optimal: number;
        improvement: string;
      };
      pressureRecommendation: {
        current: number;
        optimal: number;
        improvement: string;
      };
    };
    qualityControlPlan: {
      inspectionPoints: string[];
      measurementMethods: string[];
      acceptanceCriteria: string[];
      correctionActions: string[];
    };
    processStability: {
      stabilityIndex: number; // 0-100
      criticalParameters: string[];
      monitoringRecommendations: string[];
      processCapability: string;
    };
    complianceAssessment: {
      industryStandards: Array<{
        standard: string;
        compliance: string;
        requirements: string[];
      }>;
      customerRequirements: string;
      certificationReadiness: string;
      improvementAreas: string[];
    };
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
      qualityImprovement: string[];
    };
    sensitivityAnalysis: {
      power: Array<{
        variation: string;
        qualityGrade: number;
        roughness: number;
        confidence: number;
      }>;
      speed: Array<{
        variation: string;
        qualityGrade: number;
        roughness: number;
        drossLevel: string;
      }>;
      focus: Array<{
        variation: string;
        qualityGrade: number;
        topEdge: string;
        bottomEdge: string;
      }>;
    };
  };
}

const EdgeQualityPredictorCalculatorResults: React.FC<EdgeQualityPredictorCalculatorResultsProps> = ({ results }) => {
  const getQualityColor = (grade: number) => {
    if (grade >= 4.5) return 'text-green-600';
    if (grade >= 3.5) return 'text-blue-600';
    if (grade >= 2.5) return 'text-yellow-600';
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

  const getComplianceColor = (compliance: string) => {
    switch (compliance.toLowerCase()) {
      case 'pass': return 'text-green-600';
      case 'marginal': return 'text-yellow-600';
      case 'fail': return 'text-red-600';
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
            <Target className={`h-8 w-8 mx-auto mb-2 ${getQualityColor(results.qualityPrediction.overallQualityGrade)}`} />
            <div className="text-2xl font-bold">{results.qualityPrediction.overallQualityGrade.toFixed(1)}/5</div>
            <div className="text-sm text-muted-foreground">Quality Grade</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.qualityPrediction.edgeRoughness.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">μm Ra</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.qualityPrediction.confidenceLevel.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getStabilityColor(results.processStability.stabilityIndex)}`} />
            <div className="text-2xl font-bold">{results.processStability.stabilityIndex}</div>
            <div className="text-sm text-muted-foreground">Stability Index</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="prediction" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
          <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="prediction" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quality Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getQualityColor(results.qualityPrediction.overallQualityGrade)}`}>
                    {results.qualityPrediction.overallQualityGrade.toFixed(1)}/5
                  </div>
                  <div className="text-lg font-semibold">{results.qualityPrediction.qualityClass}</div>
                  <div className="text-sm text-muted-foreground">Overall Quality Grade</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Edge Roughness:</span>
                    <span className="font-medium">{results.qualityPrediction.edgeRoughness.toFixed(1)} μm Ra</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence Level:</span>
                    <span className="font-medium">{results.qualityPrediction.confidenceLevel.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Variation:</span>
                    <span className="font-medium">±{results.qualityPrediction.expectedVariation.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Quality Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Material Factor</span>
                      <span className="text-sm font-medium">{(results.qualityFactors.materialFactor * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={results.qualityFactors.materialFactor * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Power-Speed Factor</span>
                      <span className="text-sm font-medium">{(results.qualityFactors.powerSpeedFactor * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={results.qualityFactors.powerSpeedFactor * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Gas Pressure Factor</span>
                      <span className="text-sm font-medium">{(results.qualityFactors.gasPressureFactor * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={results.qualityFactors.gasPressureFactor * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Focus Quality Factor</span>
                      <span className="text-sm font-medium">{(results.qualityFactors.focusQualityFactor * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={results.qualityFactors.focusQualityFactor * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Beam Quality Factor</span>
                      <span className="text-sm font-medium">{(results.qualityFactors.beamQualityFactor * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={results.qualityFactors.beamQualityFactor * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Environmental Factor</span>
                      <span className="text-sm font-medium">{(results.qualityFactors.environmentalFactor * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={results.qualityFactors.environmentalFactor * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Defect Risk Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className={`text-lg font-bold ${getRiskColor(results.defectRiskAnalysis.roughnessRisk)}`}>
                    {results.defectRiskAnalysis.roughnessRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Roughness Risk</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${getRiskColor(results.defectRiskAnalysis.taperRisk)}`}>
                    {results.defectRiskAnalysis.taperRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Taper Risk</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${getRiskColor(results.defectRiskAnalysis.drossRisk)}`}>
                    {results.defectRiskAnalysis.drossRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Dross Risk</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${getRiskColor(results.defectRiskAnalysis.burnRisk)}`}>
                    {results.defectRiskAnalysis.burnRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Burn Risk</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${getRiskColor(results.defectRiskAnalysis.hazRisk)}`}>
                    {results.defectRiskAnalysis.hazRisk.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">HAZ Risk</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Risk Mitigation Strategies</h5>
                <div className="space-y-1">
                  {results.defectRiskAnalysis.mitigationStrategies.map((strategy, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strategy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characteristics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Edge Characteristics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Top Edge Quality:</span>
                    <span className="font-medium">{results.edgeCharacteristics.topEdgeQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bottom Edge Quality:</span>
                    <span className="font-medium">{results.edgeCharacteristics.bottomEdgeQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kerf Taper:</span>
                    <span className="font-medium">{results.edgeCharacteristics.kerfTaper.toFixed(2)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kerf Width:</span>
                    <span className="font-medium">{results.edgeCharacteristics.kerfWidth.toFixed(2)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dross Level:</span>
                    <span className="font-medium">{results.edgeCharacteristics.drossLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heat Affected Zone:</span>
                    <span className="font-medium">{results.edgeCharacteristics.heatAffectedZone.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edge Angle:</span>
                    <span className="font-medium">{results.edgeCharacteristics.edgeAngle.toFixed(1)}°</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Process Stability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className={`text-3xl font-bold ${getStabilityColor(results.processStability.stabilityIndex)}`}>
                    {results.processStability.stabilityIndex}
                  </div>
                  <div className="text-sm text-muted-foreground">Stability Index (0-100)</div>
                  <div className="text-lg font-semibold mt-1">{results.processStability.processCapability}</div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-semibold">Critical Parameters</h5>
                  {results.processStability.criticalParameters.map((param, index) => (
                    <div key={index} className="text-sm text-muted-foreground">• {param}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-600">
                <Settings className="h-5 w-5" />
                <span>Parameter Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Laser Power</h5>
                    <div className="text-sm space-y-1">
                      <div>Current: {results.parameterOptimization.powerRecommendation.current}W</div>
                      <div>Optimal: {results.parameterOptimization.powerRecommendation.optimal}W</div>
                      <div className="text-blue-600">{results.parameterOptimization.powerRecommendation.improvement}</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Cutting Speed</h5>
                    <div className="text-sm space-y-1">
                      <div>Current: {results.parameterOptimization.speedRecommendation.current} mm/min</div>
                      <div>Optimal: {results.parameterOptimization.speedRecommendation.optimal} mm/min</div>
                      <div className="text-blue-600">{results.parameterOptimization.speedRecommendation.improvement}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Focus Position</h5>
                    <div className="text-sm space-y-1">
                      <div>Current: {results.parameterOptimization.focusRecommendation.current.toFixed(1)}mm</div>
                      <div>Optimal: {results.parameterOptimization.focusRecommendation.optimal.toFixed(1)}mm</div>
                      <div className="text-blue-600">{results.parameterOptimization.focusRecommendation.improvement}</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Gas Pressure</h5>
                    <div className="text-sm space-y-1">
                      <div>Current: {results.parameterOptimization.pressureRecommendation.current.toFixed(1)} bar</div>
                      <div>Optimal: {results.parameterOptimization.pressureRecommendation.optimal.toFixed(1)} bar</div>
                      <div className="text-blue-600">{results.parameterOptimization.pressureRecommendation.improvement}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="control" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Inspection Points</h5>
                  <div className="space-y-1">
                    {results.qualityControlPlan.inspectionPoints.map((point, index) => (
                      <div key={index} className="text-sm">• {point}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Measurement Methods</h5>
                  <div className="space-y-1">
                    {results.qualityControlPlan.measurementMethods.map((method, index) => (
                      <div key={index} className="text-sm">• {method}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Acceptance Criteria</h5>
                  <div className="space-y-1">
                    {results.qualityControlPlan.acceptanceCriteria.map((criteria, index) => (
                      <div key={index} className="text-sm">• {criteria}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Correction Actions</h5>
                  <div className="space-y-1">
                    {results.qualityControlPlan.correctionActions.map((action, index) => (
                      <div key={index} className="text-sm">• {action}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">Customer Requirements</div>
                    <div className={`text-2xl font-bold ${getComplianceColor(results.complianceAssessment.customerRequirements)}`}>
                      {results.complianceAssessment.customerRequirements.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Certification Readiness</div>
                    <div className={`text-2xl font-bold ${getComplianceColor(results.complianceAssessment.certificationReadiness)}`}>
                      {results.complianceAssessment.certificationReadiness.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Industry Standards</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.complianceAssessment.industryStandards.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Standards Evaluated</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Industry Standards Compliance</h5>
                  <div className="space-y-2">
                    {results.complianceAssessment.industryStandards.map((standard, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{standard.standard}</span>
                          <Badge variant={standard.compliance === 'pass' ? 'default' : 
                                         standard.compliance === 'marginal' ? 'secondary' : 'destructive'}>
                            {standard.compliance.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {standard.requirements.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {results.complianceAssessment.improvementAreas.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-2">Improvement Areas</h5>
                    <div className="space-y-1">
                      {results.complianceAssessment.improvementAreas.map((area, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Power Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.power.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.variation}</span>
                      <span className="font-medium">Grade: {item.qualityGrade.toFixed(1)}</span>
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
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.variation}</span>
                      <span className="font-medium">Grade: {item.qualityGrade.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Focus Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.focus.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.variation}</span>
                      <span className="font-medium">Grade: {item.qualityGrade.toFixed(1)}</span>
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
                        <Zap className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-yellow-600 mb-2">Short Term</h5>
                  <div className="space-y-1">
                    {results.recommendations.shortTerm.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Settings className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Long Term</h5>
                  <div className="space-y-1">
                    {results.recommendations.longTerm.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EdgeQualityPredictorCalculatorResults;
