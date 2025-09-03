import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Zap,
  Gauge,
  Wind,
  Target,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings
} from 'lucide-react';

interface LaserParameterOptimizerResultsProps {
  results: any;
  inputs: any;
}

const LaserParameterOptimizerResults: React.FC<LaserParameterOptimizerResultsProps> = ({
  results,
  inputs
}) => {
  if (!results) return null;

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBurrLevel = (level: string) => {
    const levels = {
      'none': { color: 'text-green-600 bg-green-100', text: 'No Burr' },
      'minimal': { color: 'text-blue-600 bg-blue-100', text: 'Minimal' },
      'moderate': { color: 'text-yellow-600 bg-yellow-100', text: 'Moderate' },
      'significant': { color: 'text-red-600 bg-red-100', text: 'Significant' }
    };
    return levels[level as keyof typeof levels] || levels.moderate;
  };

  return (
    <div className="space-y-6">
      {/* Optimized Parameters Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">
              {results.optimizedParameters?.power || 0}W
            </div>
            <div className="text-sm text-blue-700">Optimized Power</div>
            <div className="text-xs text-blue-600 mt-1">
              {((results.optimizedParameters?.power / inputs.maxPower) * 100).toFixed(1)}% of max
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <Gauge className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">
              {results.optimizedParameters?.speed || 0}
            </div>
            <div className="text-sm text-green-700">Speed (mm/min)</div>
            <div className="text-xs text-green-600 mt-1">
              Optimized for {inputs.productionPriority}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">
              {results.expectedResults?.edgeQuality || 0}/10
            </div>
            <div className="text-sm text-purple-700">Edge Quality</div>
            <Badge className={`text-xs mt-1 ${getQualityColor(results.expectedResults?.edgeQuality || 0)}`}>
              {results.expectedResults?.edgeQuality >= 8 ? 'Excellent' : 
               results.expectedResults?.edgeQuality >= 6 ? 'Good' : 'Fair'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Optimized Parameter Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Laser Power</span>
                <span className="font-bold text-blue-600">
                  {results.optimizedParameters?.power}W
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Cutting Speed</span>
                <span className="font-bold text-green-600">
                  {results.optimizedParameters?.speed} mm/min
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Frequency</span>
                <span className="font-bold text-purple-600">
                  {results.optimizedParameters?.frequency} Hz
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Pulse Width</span>
                <span className="font-bold text-orange-600">
                  {results.optimizedParameters?.pulseWidth} ms
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Gas Flow</span>
                <span className="font-bold text-cyan-600">
                  {results.optimizedParameters?.gasFlow} L/min
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Gas Pressure</span>
                <span className="font-bold text-indigo-600">
                  {results.optimizedParameters?.gasPressure} bar
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Focus Offset</span>
                <span className="font-bold text-pink-600">
                  {results.optimizedParameters?.focusOffset} mm
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Gas Type</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {inputs.gasType.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Quality Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Edge Quality</span>
                  <span className="text-sm font-bold text-green-600">
                    {results.expectedResults?.edgeQuality}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(results.expectedResults?.edgeQuality / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Surface Roughness</span>
                  <span className="text-sm font-bold text-blue-600">
                    {results.qualityPrediction?.surfaceRoughness} μm Ra
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Lower is better for smooth finish
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Kerf Width</span>
                  <span className="text-sm font-bold text-purple-600">
                    {results.expectedResults?.kerfWidth} mm
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Heat Affected Zone</span>
                  <span className="text-sm font-bold text-orange-600">
                    {results.expectedResults?.heatAffectedZone} mm
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Dimensional Accuracy</span>
                  <span className="text-sm font-bold text-green-600">
                    ±{results.qualityPrediction?.dimensionalAccuracy} mm
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Burr Level</span>
                  <Badge className={getBurrLevel(results.qualityPrediction?.burr).color}>
                    {getBurrLevel(results.qualityPrediction?.burr).text}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Efficiency Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className={`text-2xl font-bold ${getEfficiencyColor(results.efficiency?.cutting || 0)}`}>
                {results.efficiency?.cutting || 0}%
              </div>
              <div className="text-sm text-gray-600">Cutting Efficiency</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className={`text-2xl font-bold ${getEfficiencyColor(results.efficiency?.power || 0)}`}>
                {results.efficiency?.power || 0}%
              </div>
              <div className="text-sm text-gray-600">Power Efficiency</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className={`text-2xl font-bold ${getEfficiencyColor(results.efficiency?.gas || 0)}`}>
                {results.efficiency?.gas || 0}%
              </div>
              <div className="text-sm text-gray-600">Gas Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.recommendations.map((rec: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-900">{rec.title}</div>
                    <div className="text-sm text-blue-700">{rec.description}</div>
                    {rec.impact && (
                      <div className="text-xs text-blue-600 mt-1">
                        Expected improvement: {rec.impact}
                      </div>
                    )}
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

export default LaserParameterOptimizerResults;
