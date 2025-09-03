import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Thermometer, 
  Target, 
  BarChart3, 
  Settings,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface HeatAffectedZoneCalculatorResultsProps {
  results: {
    hazAnalysis: {
      width: number; // mm
      depth: number; // mm
      volume: number; // mm³
      classification: string;
      acceptability: string;
      temperatureProfile: Array<{
        distance: number;
        temperature: number;
      }>;
    };
    thermalAnalysis: {
      peakTemperature: number; // °C
      heatingRate: number; // °C/s
      coolingRate: number; // °C/s
      timeAtTemperature: number; // seconds
      thermalGradient: number; // °C/mm
      energyDensity: number; // J/mm²
    };
    materialChanges: {
      hardnessChange: {
        percentage: number;
        newHardness: number;
        originalHardness: number;
      };
      microstructureChanges: string[];
      mechanicalProperties: {
        tensileStrength: { change: number; unit: string };
        yieldStrength: { change: number; unit: string };
        ductility: { change: number; unit: string };
      };
      residualStress: {
        level: string;
        magnitude: number; // MPa
        distribution: string;
      };
    };
    qualityAssessment: {
      overallGrade: string;
      hazWidthCompliance: boolean;
      hardnessCompliance: boolean;
      microstructureCompliance: boolean;
      complianceScore: number; // 0-100
      riskLevel: string;
    };
    optimizedParameters: {
      status: string;
      currentHAZ: number;
      targetHAZ: number;
      improvements: string[];
      recommendedPower: number;
      recommendedSpeed: number;
      recommendedFrequency: number;
      expectedImprovement: number; // percentage
    };
    processControl: {
      criticalParameters: string[];
      monitoringPoints: string[];
      controlLimits: {
        hazWidth: { min: number; max: number; target: number };
        temperature: { min: number; max: number; target: number };
        coolingRate: { min: number; max: number; target: number };
      };
      qualityIndicators: string[];
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
        hazWidth: number;
        peakTemp: number;
        compliance: string;
      }>;
      speed: Array<{
        variation: string;
        hazWidth: number;
        coolingRate: number;
        quality: string;
      }>;
    };
  };
}

const HeatAffectedZoneCalculatorResults: React.FC<HeatAffectedZoneCalculatorResultsProps> = ({ results }) => {
  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'a': case 'excellent': return 'text-green-600';
      case 'b': case 'good': return 'text-blue-600';
      case 'c': case 'acceptable': return 'text-yellow-600';
      case 'd': case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-red-700';
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

  const getComplianceColor = (compliance: boolean) => {
    return compliance ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Thermometer className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{results.hazAnalysis.width.toFixed(3)}</div>
            <div className="text-sm text-muted-foreground">HAZ Width (mm)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{results.thermalAnalysis.peakTemperature.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Peak Temp (°C)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className={`h-8 w-8 mx-auto mb-2 ${getGradeColor(results.qualityAssessment.overallGrade)}`} />
            <div className="text-2xl font-bold">{results.qualityAssessment.overallGrade}</div>
            <div className="text-sm text-muted-foreground">Quality Grade</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.qualityAssessment.complianceScore}</div>
            <div className="text-sm text-muted-foreground">Compliance Score</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analysis" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="thermal">Thermal</TabsTrigger>
          <TabsTrigger value="material">Material</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5" />
                  <span>HAZ Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600">
                    {results.hazAnalysis.width.toFixed(3)} mm
                  </div>
                  <div className="text-sm text-muted-foreground">HAZ Width</div>
                  <div className={`text-lg font-semibold mt-1 ${getGradeColor(results.hazAnalysis.classification)}`}>
                    {results.hazAnalysis.classification}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>HAZ Depth:</span>
                    <span className="font-medium">{results.hazAnalysis.depth.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HAZ Volume:</span>
                    <span className="font-medium">{results.hazAnalysis.volume.toFixed(2)} mm³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acceptability:</span>
                    <span className={`font-medium ${getGradeColor(results.hazAnalysis.acceptability)}`}>
                      {results.hazAnalysis.acceptability}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Quality Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getGradeColor(results.qualityAssessment.overallGrade)}`}>
                      {results.qualityAssessment.overallGrade}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Grade</div>
                    <div className={`text-lg font-semibold mt-1 ${getRiskColor(results.qualityAssessment.riskLevel)}`}>
                      {results.qualityAssessment.riskLevel} Risk
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>HAZ Width Compliance:</span>
                      <span className={`font-medium ${getComplianceColor(results.qualityAssessment.hazWidthCompliance)}`}>
                        {results.qualityAssessment.hazWidthCompliance ? 'Pass' : 'Fail'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hardness Compliance:</span>
                      <span className={`font-medium ${getComplianceColor(results.qualityAssessment.hardnessCompliance)}`}>
                        {results.qualityAssessment.hardnessCompliance ? 'Pass' : 'Fail'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Microstructure Compliance:</span>
                      <span className={`font-medium ${getComplianceColor(results.qualityAssessment.microstructureCompliance)}`}>
                        {results.qualityAssessment.microstructureCompliance ? 'Pass' : 'Fail'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Compliance Score</span>
                      <span className="text-sm font-medium">{results.qualityAssessment.complianceScore}%</span>
                    </div>
                    <Progress value={results.qualityAssessment.complianceScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                    <span className="font-medium">{results.thermalAnalysis.peakTemperature.toFixed(0)} °C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heating Rate:</span>
                    <span className="font-medium">{results.thermalAnalysis.heatingRate.toFixed(0)} °C/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cooling Rate:</span>
                    <span className="font-medium">{results.thermalAnalysis.coolingRate.toFixed(0)} °C/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time at Temperature:</span>
                    <span className="font-medium">{results.thermalAnalysis.timeAtTemperature.toFixed(3)} s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Gradient:</span>
                    <span className="font-medium">{results.thermalAnalysis.thermalGradient.toFixed(0)} °C/mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Density:</span>
                    <span className="font-medium">{results.thermalAnalysis.energyDensity.toFixed(0)} J/mm²</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-semibold mb-2">Distance from Cut Edge</div>
                  {results.hazAnalysis.temperatureProfile.slice(0, 6).map((point, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{point.distance.toFixed(2)} mm:</span>
                      <span className="font-medium">{point.temperature.toFixed(0)} °C</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="material" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Material Property Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-2">Hardness Changes</h5>
                    <div className="space-y-1 text-sm">
                      <div>Original: {results.materialChanges.hardnessChange.originalHardness} HRC</div>
                      <div>New: {results.materialChanges.hardnessChange.newHardness} HRC</div>
                      <div className={`font-medium ${results.materialChanges.hardnessChange.percentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Change: {results.materialChanges.hardnessChange.percentage > 0 ? '+' : ''}{results.materialChanges.hardnessChange.percentage}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Mechanical Properties</h5>
                    <div className="space-y-1 text-sm">
                      <div>Tensile Strength: {results.materialChanges.mechanicalProperties.tensileStrength.change > 0 ? '+' : ''}{results.materialChanges.mechanicalProperties.tensileStrength.change}%</div>
                      <div>Yield Strength: {results.materialChanges.mechanicalProperties.yieldStrength.change > 0 ? '+' : ''}{results.materialChanges.mechanicalProperties.yieldStrength.change}%</div>
                      <div>Ductility: {results.materialChanges.mechanicalProperties.ductility.change > 0 ? '+' : ''}{results.materialChanges.mechanicalProperties.ductility.change}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Microstructure & Stress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-2">Microstructure Changes</h5>
                    <div className="space-y-1">
                      {results.materialChanges.microstructureChanges.map((change, index) => (
                        <div key={index} className="text-sm">• {change}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Residual Stress</h5>
                    <div className="space-y-1 text-sm">
                      <div>Level: <span className={`font-medium ${getRiskColor(results.materialChanges.residualStress.level)}`}>{results.materialChanges.residualStress.level}</span></div>
                      <div>Magnitude: {results.materialChanges.residualStress.magnitude} MPa</div>
                      <div>Distribution: {results.materialChanges.residualStress.distribution}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
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
                    Potential reduction in HAZ width through optimization
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">{results.optimizedParameters.status}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Current HAZ</div>
                      <div className="text-2xl font-bold text-red-600">{results.optimizedParameters.currentHAZ.toFixed(3)} mm</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Target HAZ</div>
                      <div className="text-2xl font-bold text-green-600">{results.optimizedParameters.targetHAZ.toFixed(3)} mm</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Recommended Power</h5>
                    <div className="text-lg font-bold text-blue-600">{results.optimizedParameters.recommendedPower}W</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Recommended Speed</h5>
                    <div className="text-lg font-bold text-blue-600">{results.optimizedParameters.recommendedSpeed} mm/min</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Recommended Frequency</h5>
                    <div className="text-lg font-bold text-blue-600">{results.optimizedParameters.recommendedFrequency} Hz</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Expected Improvement: {results.optimizedParameters.expectedImprovement}%</h5>
                  <div className="space-y-1">
                    {results.optimizedParameters.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
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
                        <div>HAZ: {item.hazWidth.toFixed(3)} mm</div>
                        <div className="text-xs text-muted-foreground">{item.compliance}</div>
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
                        <div>HAZ: {item.hazWidth.toFixed(3)} mm</div>
                        <div className="text-xs text-muted-foreground">{item.quality}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="control" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Process Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-2">Critical Parameters</h5>
                    <div className="space-y-1">
                      {results.processControl.criticalParameters.map((param, index) => (
                        <div key={index} className="text-sm">• {param}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Monitoring Points</h5>
                    <div className="space-y-1">
                      {results.processControl.monitoringPoints.map((point, index) => (
                        <div key={index} className="text-sm text-blue-600">• {point}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Control Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-2">HAZ Width Control</h5>
                    <div className="text-sm space-y-1">
                      <div>Target: {results.processControl.controlLimits.hazWidth.target.toFixed(3)} mm</div>
                      <div>Min: {results.processControl.controlLimits.hazWidth.min.toFixed(3)} mm</div>
                      <div>Max: {results.processControl.controlLimits.hazWidth.max.toFixed(3)} mm</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Temperature Control</h5>
                    <div className="text-sm space-y-1">
                      <div>Target: {results.processControl.controlLimits.temperature.target.toFixed(0)} °C</div>
                      <div>Min: {results.processControl.controlLimits.temperature.min.toFixed(0)} °C</div>
                      <div>Max: {results.processControl.controlLimits.temperature.max.toFixed(0)} °C</div>
                    </div>
                  </div>
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

export default HeatAffectedZoneCalculatorResults;
