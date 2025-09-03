import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  Microscope, 
  Target, 
  Zap, 
  TrendingUp, 
  Award,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface BeamQualityCalculatorResultsProps {
  results: any;
  inputs: any;
}

const BeamQualityCalculatorResults: React.FC<BeamQualityCalculatorResultsProps> = ({
  results,
  inputs
}) => {
  if (!results) return null;

  const getQualityColor = (grade: string) => {
    const colors = {
      'Excellent': 'text-green-600 bg-green-100',
      'Very Good': 'text-blue-600 bg-blue-100',
      'Good': 'text-yellow-600 bg-yellow-100',
      'Fair': 'text-orange-600 bg-orange-100',
      'Poor': 'text-red-600 bg-red-100'
    };
    return colors[grade as keyof typeof colors] || colors.Fair;
  };

  const getMSquaredColor = (mSquared: number) => {
    if (mSquared <= 1.1) return 'text-green-600';
    if (mSquared <= 1.3) return 'text-blue-600';
    if (mSquared <= 1.5) return 'text-yellow-600';
    if (mSquared <= 2.0) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Beam Quality Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <Microscope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getMSquaredColor(results.beamQuality?.mSquared || 0)}`}>
              M² = {results.beamQuality?.mSquared || 0}
            </div>
            <div className="text-sm text-purple-700">Beam Quality Factor</div>
            <Badge className={`text-xs mt-1 ${getQualityColor(results.beamQuality?.qualityGrade || 'Fair')}`}>
              {results.beamQuality?.qualityGrade || 'Unknown'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">
              {results.focusCharacteristics?.focusedSpotDiameter || 0}
            </div>
            <div className="text-sm text-blue-700">Focus Spot (mm)</div>
            <div className="text-xs text-blue-600 mt-1">
              @ {inputs.focalLength}mm focal length
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-900">
              {results.focusCharacteristics?.powerDensity || 0}
            </div>
            <div className="text-sm text-orange-700">Power Density</div>
            <div className="text-xs text-orange-600 mt-1">MW/m²</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Beam Quality Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">M² Factor</span>
                <span className={`font-bold ${getMSquaredColor(results.beamQuality?.mSquared || 0)}`}>
                  {results.beamQuality?.mSquared || 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Beam Parameter Product</span>
                <span className="font-bold text-blue-600">
                  {results.beamQuality?.beamParameterProduct || 0} mm·mrad
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Quality Score</span>
                <span className="font-bold text-green-600">
                  {results.beamQuality?.qualityScore || 0}/10
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Theoretical Limit</span>
                <span className="font-bold text-purple-600">
                  {results.beamQuality?.theoreticalLimit || 0} mm·mrad
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Rayleigh Length</span>
                <span className="font-bold text-cyan-600">
                  {results.focusCharacteristics?.rayleighLength || 0} mm
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Confocal Parameter</span>
                <span className="font-bold text-indigo-600">
                  {results.focusCharacteristics?.confocalParameter || 0} mm
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Far Field Divergence</span>
                <span className="font-bold text-pink-600">
                  {results.propagationAnalysis?.farFieldDivergence || 0} mrad
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Beam Waist</span>
                <span className="font-bold text-teal-600">
                  {results.propagationAnalysis?.beamWaist || 0} mm
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cutting Performance Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Cutting Performance Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Speed Factor</span>
                  <span className="text-sm font-bold text-green-600">
                    {results.cuttingPerformance?.speedFactor || 0}x
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((results.cuttingPerformance?.speedFactor || 0) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Relative cutting speed capability</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Edge Quality Factor</span>
                  <span className="text-sm font-bold text-blue-600">
                    {results.cuttingPerformance?.edgeQualityFactor || 0}x
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((results.cuttingPerformance?.edgeQualityFactor || 0) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Edge quality improvement factor</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Thickness Factor</span>
                  <span className="text-sm font-bold text-purple-600">
                    {results.cuttingPerformance?.thicknessFactor || 0}x
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((results.cuttingPerformance?.thicknessFactor || 0) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Maximum thickness capability</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {results.cuttingPerformance?.overallRating || 0}/10
                </div>
                <div className="text-sm text-gray-600">Overall Performance Rating</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beam Quality Interpretation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Quality Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">M² Factor Meaning</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• M² = 1.0: Perfect Gaussian beam (theoretical limit)</p>
                  <p>• M² ≤ 1.1: Excellent quality (single mode)</p>
                  <p>• M² ≤ 1.5: Good quality (near single mode)</p>
                  <p>• M² &gt; 2.0: Multimode beam</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Cutting Implications</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p>• Better beam quality → Smaller focus spot</p>
                  <p>• Higher power density → Faster cutting</p>
                  <p>• Improved edge quality and precision</p>
                  <p>• Greater maximum thickness capability</p>
                </div>
              </div>
            </div>

            {results.beamQuality?.mSquared > 1.5 && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Beam Quality Notice</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Your beam quality (M² = {results.beamQuality?.mSquared}) indicates multimode operation. 
                      Consider beam quality improvement for optimal cutting performance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.recommendations.map((rec: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-green-900">{rec.title}</div>
                    <div className="text-sm text-green-700">{rec.description}</div>
                    {rec.impact && (
                      <div className="text-xs text-green-600 mt-1">
                        Expected improvement: {rec.impact}
                      </div>
                    )}
                    <Badge className={`text-xs mt-2 ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority} priority
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BeamQualityCalculatorResults;
