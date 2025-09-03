import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Focus, 
  Target, 
  BarChart3, 
  Settings,
  Lightbulb,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface FocusHeightCalculatorResultsProps {
  results: {
    optimalFocusPosition: {
      recommendedPosition: number; // mm
      positionRange: {
        min: number;
        max: number;
      };
      depthOfFocus: number; // mm
      rayleighLength: number; // mm
      beamWaistDiameter: number; // mm
    };
    focusPositionTable: Array<{
      thickness: number;
      throughCut: number;
      topSurface: number;
      midThickness: number;
      bottomSurface: number;
      qualityGrade: number;
    }>;
    beamCharacteristics: {
      spotSize: number; // mm
      powerDensity: number; // W/mm²
      divergenceAngle: number; // mrad
      confocalParameter: number; // mm
      numericalAperture: number;
      beamQualityFactor: number; // M²
    };
    cutQualityPrediction: {
      topEdgeQuality: number; // 1-5
      bottomEdgeQuality: number; // 1-5
      kerfTaper: number; // degrees
      heatAffectedZone: number; // mm
      drossFormation: 'none' | 'minimal' | 'moderate' | 'excessive';
    };
    adjustmentGuidance: {
      setupSteps: string[];
      calibrationProcedure: string[];
      troubleshooting: Array<{
        issue: string;
        solution: string;
        priority: 'low' | 'medium' | 'high';
      }>;
      maintenanceSchedule: string[];
    };
    materialSpecificTips: {
      focusAdjustments: string[];
      commonIssues: string[];
      bestPractices: string[];
      qualityIndicators: string[];
    };
    processOptimization: {
      powerRecommendation: {
        current: number;
        optimal: number;
        adjustment: string;
      };
      speedRecommendation: {
        current: number;
        optimal: number;
        adjustment: string;
      };
      focusStability: {
        stabilityIndex: number; // 0-100
        criticalFactors: string[];
        monitoringPoints: string[];
      };
    };
    sensitivityAnalysis: {
      focusPosition: Array<{
        variation: string;
        topQuality: number;
        bottomQuality: number;
        kerfTaper: number;
      }>;
      beamDiameter: Array<{
        variation: string;
        focusPosition: number;
        depthOfFocus: number;
        powerDensity: number;
      }>;
    };
  };
}

const FocusHeightCalculatorResults: React.FC<FocusHeightCalculatorResultsProps> = ({ results }) => {
  // Safety check for results structure
  if (!results || !results.optimalFocusPosition || !results.beamCharacteristics || !results.cutQualityPrediction) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Invalid calculation results. Please try again.</p>
      </div>
    );
  }

  // Safe number formatting with fallbacks
  const safeToFixed = (value: any, decimals: number = 2) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(decimals);
    }
    return '0.' + '0'.repeat(decimals);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 4.5) return 'text-green-600';
    if (quality >= 3.5) return 'text-blue-600';
    if (quality >= 2.5) return 'text-yellow-600';
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
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
            <Focus className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{safeToFixed(results.optimalFocusPosition.recommendedPosition, 1)}</div>
            <div className="text-sm text-muted-foreground">Focus Position (mm)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{safeToFixed(results.optimalFocusPosition.depthOfFocus, 2)}</div>
            <div className="text-sm text-muted-foreground">Depth of Focus (mm)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{safeToFixed(results.beamCharacteristics.powerDensity, 0)}</div>
            <div className="text-sm text-muted-foreground">Power Density (W/mm²)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getStabilityColor(results.processOptimization.focusStability.stabilityIndex)}`} />
            <div className="text-2xl font-bold">{results.processOptimization.focusStability.stabilityIndex}</div>
            <div className="text-sm text-muted-foreground">Stability Index</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="focus" onValueChange={() => {}} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="beam">Beam</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="focus" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Focus className="h-5 w-5" />
                  <span>Optimal Focus Position</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {safeToFixed(results.optimalFocusPosition.recommendedPosition, 1)} mm
                  </div>
                  <div className="text-sm text-muted-foreground">Recommended Position</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    (Negative = below surface, Positive = above surface)
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Position Range:</span>
                    <span className="font-medium">
                      {safeToFixed(results.optimalFocusPosition.positionRange?.min, 1)} to {safeToFixed(results.optimalFocusPosition.positionRange?.max, 1)} mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depth of Focus:</span>
                    <span className="font-medium">{safeToFixed(results.optimalFocusPosition.depthOfFocus, 2)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rayleigh Length:</span>
                    <span className="font-medium">{safeToFixed(results.optimalFocusPosition.rayleighLength, 2)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beam Waist Diameter:</span>
                    <span className="font-medium">{safeToFixed(results.optimalFocusPosition.beamWaistDiameter, 2)} mm</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Cut Quality Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Top Edge Quality</span>
                      <span className={`text-sm font-medium ${getQualityColor(results.cutQualityPrediction.topEdgeQuality || 0)}`}>
                        {safeToFixed(results.cutQualityPrediction.topEdgeQuality, 1)}/5
                      </span>
                    </div>
                    <Progress value={(results.cutQualityPrediction.topEdgeQuality || 0) * 20} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Bottom Edge Quality</span>
                      <span className={`text-sm font-medium ${getQualityColor(results.cutQualityPrediction.bottomEdgeQuality || 0)}`}>
                        {safeToFixed(results.cutQualityPrediction.bottomEdgeQuality, 1)}/5
                      </span>
                    </div>
                    <Progress value={(results.cutQualityPrediction.bottomEdgeQuality || 0) * 20} className="h-2" />
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span>Kerf Taper:</span>
                      <span className="font-medium">{safeToFixed(results.cutQualityPrediction.kerfTaper, 2)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heat Affected Zone:</span>
                      <span className="font-medium">{safeToFixed(results.cutQualityPrediction.heatAffectedZone, 3)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dross Formation:</span>
                      <span className={`font-medium capitalize ${getDrossColor(results.cutQualityPrediction.drossFormation)}`}>
                        {results.cutQualityPrediction.drossFormation}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="beam" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beam Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Spot Size:</span>
                    <span className="font-medium">{safeToFixed(results.beamCharacteristics.spotSize, 3)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Power Density:</span>
                    <span className="font-medium">{safeToFixed(results.beamCharacteristics.powerDensity, 0)} W/mm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Divergence Angle:</span>
                    <span className="font-medium">{safeToFixed(results.beamCharacteristics.divergenceAngle, 2)} mrad</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Confocal Parameter:</span>
                    <span className="font-medium">{safeToFixed(results.beamCharacteristics.confocalParameter, 2)} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Numerical Aperture:</span>
                    <span className="font-medium">{safeToFixed(results.beamCharacteristics.numericalAperture, 3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beam Quality (M²):</span>
                    <span className="font-medium">{safeToFixed(results.beamCharacteristics.beamQualityFactor, 2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Power Optimization</h5>
                    <div className="text-sm space-y-1">
                      <div>Current: {results.processOptimization.powerRecommendation.current}W</div>
                      <div>Optimal: {results.processOptimization.powerRecommendation.optimal}W</div>
                      <div className="text-blue-600">{results.processOptimization.powerRecommendation.adjustment}</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Speed Optimization</h5>
                    <div className="text-sm space-y-1">
                      <div>Current: {results.processOptimization.speedRecommendation.current} mm/min</div>
                      <div>Optimal: {results.processOptimization.speedRecommendation.optimal} mm/min</div>
                      <div className="text-blue-600">{results.processOptimization.speedRecommendation.adjustment}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold mb-2">Focus Stability</h5>
                    <div className="text-center mb-3">
                      <div className={`text-3xl font-bold ${getStabilityColor(results.processOptimization.focusStability.stabilityIndex)}`}>
                        {results.processOptimization.focusStability.stabilityIndex}
                      </div>
                      <div className="text-sm text-muted-foreground">Stability Index (0-100)</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h6 className="font-semibold text-sm">Critical Factors</h6>
                      {results.processOptimization.focusStability.criticalFactors.map((factor, index) => (
                        <div key={index} className="text-sm text-muted-foreground">• {factor}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material-Specific Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Focus Adjustments</h5>
                  <div className="space-y-1">
                    {results.materialSpecificTips.focusAdjustments.map((tip, index) => (
                      <div key={index} className="text-sm">• {tip}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Best Practices</h5>
                  <div className="space-y-1">
                    {results.materialSpecificTips.bestPractices.map((practice, index) => (
                      <div key={index} className="text-sm">• {practice}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Common Issues</h5>
                  <div className="space-y-1">
                    {results.materialSpecificTips.commonIssues.map((issue, index) => (
                      <div key={index} className="text-sm text-yellow-600">• {issue}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Quality Indicators</h5>
                  <div className="space-y-1">
                    {results.materialSpecificTips.qualityIndicators.map((indicator, index) => (
                      <div key={index} className="text-sm text-green-600">• {indicator}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Focus Position Reference Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Thickness (mm)</th>
                      <th className="text-left p-2">Through Cut</th>
                      <th className="text-left p-2">Top Surface</th>
                      <th className="text-left p-2">Mid Thickness</th>
                      <th className="text-left p-2">Bottom Surface</th>
                      <th className="text-left p-2">Quality Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.focusPositionTable.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{row.thickness}</td>
                        <td className="p-2">{row.throughCut} mm</td>
                        <td className="p-2">{row.topSurface} mm</td>
                        <td className="p-2">{row.midThickness} mm</td>
                        <td className="p-2">{row.bottomSurface} mm</td>
                        <td className={`p-2 font-medium ${getQualityColor(row.qualityGrade)}`}>
                          {row.qualityGrade}/5
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Setup Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.adjustmentGuidance.setupSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calibration Procedure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.adjustmentGuidance.calibrationProcedure.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.adjustmentGuidance.troubleshooting.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold">{item.issue}</h5>
                      <Badge variant={item.priority === 'high' ? 'destructive' : 
                                   item.priority === 'medium' ? 'secondary' : 'default'}>
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Focus Position Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.focusPosition.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                      <span className="font-medium">{item.variation}</span>
                      <div className="text-right">
                        <div>Top: {item.topQuality.toFixed(1)}</div>
                        <div>Bottom: {item.bottomQuality.toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beam Diameter Sensitivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.sensitivityAnalysis.beamDiameter.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                      <span className="font-medium">{item.variation}</span>
                      <div className="text-right">
                        <div>Focus: {item.focusPosition.toFixed(1)}mm</div>
                        <div>DOF: {item.depthOfFocus.toFixed(2)}mm</div>
                      </div>
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

export default FocusHeightCalculatorResults;
