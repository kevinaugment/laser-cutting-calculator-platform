import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Settings,
  Zap,
  DollarSign,
  Eye
} from 'lucide-react';

interface QualityGradeCalculatorResultsProps {
  results: {
    predictedQualityGrade: number;
    qualityMetrics: {
      surfaceRoughness: number;
      edgeSquareness: number;
      drossLevel: 'none' | 'minimal' | 'moderate' | 'excessive';
      kerfWidth: number;
      heatAffectedZone: number;
    };
    qualityAssessment: {
      overallScore: number;
      strengthAreas: string[];
      improvementAreas: string[];
      qualityRisk: 'low' | 'medium' | 'high';
    };
    parameterOptimization: {
      recommendedPower: number;
      recommendedSpeed: number;
      recommendedGasPressure: number;
      recommendedFocusPosition: number;
      expectedImprovement: number;
    };
    qualityControl: {
      criticalParameters: string[];
      toleranceRanges: {
        [key: string]: {
          min: number;
          max: number;
          unit: string;
        };
      };
      inspectionPoints: string[];
      qualityCheckFrequency: string;
    };
    costQualityAnalysis: {
      qualityPremium: number;
      timeImpact: number;
      materialWaste: number;
      reworkRisk: number;
    };
    recommendations: string[];
    keyMetrics: {
      [key: string]: string;
    };
    sensitivityAnalysis: {
      powerSensitivity: Array<{
        power: number;
        quality: number;
        impact: string;
      }>;
      speedSensitivity: Array<{
        speed: number;
        quality: number;
        impact: string;
      }>;
      recommendations: string[];
    };
  };
}

const QualityGradeCalculatorResults: React.FC<QualityGradeCalculatorResultsProps> = ({ results }) => {
  const getQualityGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'text-green-600';
    if (grade >= 3.5) return 'text-blue-600';
    if (grade >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityGradeBadge = (grade: number) => {
    if (grade >= 4.5) return { variant: 'default' as const, label: 'EXCELLENT' };
    if (grade >= 3.5) return { variant: 'secondary' as const, label: 'GOOD' };
    if (grade >= 2.5) return { variant: 'outline' as const, label: 'ACCEPTABLE' };
    return { variant: 'destructive' as const, label: 'POOR' };
  };

  const getDrossLevelColor = (level: string) => {
    switch (level) {
      case 'none': return 'text-green-600';
      case 'minimal': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      case 'excessive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const qualityBadge = getQualityGradeBadge(results.predictedQualityGrade);

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className={`h-8 w-8 mx-auto mb-2 ${getQualityGradeColor(results.predictedQualityGrade)}`} />
            <div className="text-2xl font-bold">{results.predictedQualityGrade.toFixed(1)}/5</div>
            <div className="text-sm text-muted-foreground">Quality Grade</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{results.qualityAssessment.overallScore}</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{results.qualityMetrics.surfaceRoughness.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Roughness (μm)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{results.parameterOptimization.expectedImprovement.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Improvement</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Quality Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getQualityGradeColor(results.predictedQualityGrade)}`}>
                    {results.predictedQualityGrade.toFixed(1)}/5
                  </div>
                  <Badge variant={qualityBadge.variant} className="mb-2">
                    {qualityBadge.label}
                  </Badge>
                  <div className="text-sm text-muted-foreground">ISO 9013 Quality Grade</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Score</span>
                    <span className="font-semibold">{results.qualityAssessment.overallScore}/100</span>
                  </div>
                  <Progress value={results.qualityAssessment.overallScore} className="h-2" />
                </div>
                
                <div className="text-center">
                  <Badge variant={results.qualityAssessment.qualityRisk === 'low' ? 'default' : 
                                 results.qualityAssessment.qualityRisk === 'medium' ? 'secondary' : 'destructive'}>
                    {results.qualityAssessment.qualityRisk.toUpperCase()} RISK
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Quality Risk Level</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Quality Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Surface Roughness:</span>
                  <span className="font-medium">{results.qualityMetrics.surfaceRoughness.toFixed(1)} μm</span>
                </div>
                <div className="flex justify-between">
                  <span>Edge Squareness:</span>
                  <span className="font-medium">{results.qualityMetrics.edgeSquareness.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Dross Level:</span>
                  <span className={`font-medium capitalize ${getDrossLevelColor(results.qualityMetrics.drossLevel)}`}>
                    {results.qualityMetrics.drossLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kerf Width:</span>
                  <span className="font-medium">{results.qualityMetrics.kerfWidth.toFixed(3)} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>HAZ Width:</span>
                  <span className="font-medium">{results.qualityMetrics.heatAffectedZone.toFixed(3)} mm</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Strength Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.qualityAssessment.strengthAreas.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Improvement Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.qualityAssessment.improvementAreas.map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Surface Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Surface Roughness</span>
                      <span className="text-sm font-medium">{results.qualityMetrics.surfaceRoughness.toFixed(1)} μm</span>
                    </div>
                    <Progress value={Math.min(100, (12.5 - results.qualityMetrics.surfaceRoughness) / 12.5 * 100)} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">Target: &lt; 6.3 μm for standard quality</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Edge Squareness</span>
                      <span className="text-sm font-medium">{results.qualityMetrics.edgeSquareness.toFixed(2)}°</span>
                    </div>
                    <Progress value={Math.min(100, (4.0 - results.qualityMetrics.edgeSquareness) / 4.0 * 100)} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">Target: &lt; 2.0° for standard quality</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cut Geometry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Kerf Width:</span>
                    <span className="font-medium">{results.qualityMetrics.kerfWidth.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heat Affected Zone:</span>
                    <span className="font-medium">{results.qualityMetrics.heatAffectedZone.toFixed(3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dross Formation:</span>
                    <span className={`font-medium capitalize ${getDrossLevelColor(results.qualityMetrics.drossLevel)}`}>
                      {results.qualityMetrics.drossLevel}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quality Standards Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                {[1, 2, 3, 4, 5].map((grade) => (
                  <div key={grade} className={`p-3 border rounded ${
                    Math.round(results.predictedQualityGrade) === grade ? 'border-blue-500 bg-blue-50' : ''
                  }`}>
                    <div className="font-bold text-lg">Grade {grade}</div>
                    <div className="text-xs text-muted-foreground">
                      {grade === 1 && 'Rough Cut'}
                      {grade === 2 && 'Standard Cut'}
                      {grade === 3 && 'Good Cut'}
                      {grade === 4 && 'High Quality'}
                      {grade === 5 && 'Precision Cut'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Parameter Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Recommended Parameters</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Laser Power:</span>
                      <span className="font-medium">{results.parameterOptimization.recommendedPower} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cutting Speed:</span>
                      <span className="font-medium">{results.parameterOptimization.recommendedSpeed} mm/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Pressure:</span>
                      <span className="font-medium">{results.parameterOptimization.recommendedGasPressure.toFixed(1)} bar</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Focus Position:</span>
                      <span className="font-medium">{results.parameterOptimization.recommendedFocusPosition.toFixed(1)} mm</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Expected Improvement</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      +{results.parameterOptimization.expectedImprovement.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Quality Score Improvement</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="control" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Critical Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.qualityControl.criticalParameters.map((param, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{param}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tolerance Ranges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(results.qualityControl.toleranceRanges).map(([param, range]) => (
                    <div key={param} className="text-sm">
                      <div className="font-medium">{param}</div>
                      <div className="text-muted-foreground">
                        {range.min.toFixed(1)} - {range.max.toFixed(1)} {range.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inspection Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {results.qualityControl.inspectionPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{results.costQualityAnalysis.qualityPremium}%</div>
                <div className="text-sm text-muted-foreground">Quality Premium</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{results.costQualityAnalysis.timeImpact}%</div>
                <div className="text-sm text-muted-foreground">Time Impact</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{results.costQualityAnalysis.materialWaste}%</div>
                <div className="text-sm text-muted-foreground">Material Waste</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{results.costQualityAnalysis.reworkRisk}%</div>
                <div className="text-sm text-muted-foreground">Rework Risk</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost-Quality Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-semibold text-blue-900 mb-2">Quality Premium</h4>
                  <p className="text-sm text-blue-800">
                    Higher quality grades command a {results.costQualityAnalysis.qualityPremium}% premium in the market, 
                    but require {results.costQualityAnalysis.timeImpact}% more processing time.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="font-semibold text-yellow-900 mb-2">Risk Assessment</h4>
                  <p className="text-sm text-yellow-800">
                    Current parameters carry a {results.costQualityAnalysis.reworkRisk}% rework risk and 
                    {results.costQualityAnalysis.materialWaste}% material waste potential.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensitivity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Power Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.powerSensitivity.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.power}W</span>
                      <span className="text-sm font-medium">Grade {item.quality.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">{item.impact}</span>
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
                  {results.sensitivityAnalysis.speedSensitivity.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.speed} mm/min</span>
                      <span className="text-sm font-medium">Grade {item.quality.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">{item.impact}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sensitivity Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.sensitivityAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
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

export default QualityGradeCalculatorResults;
