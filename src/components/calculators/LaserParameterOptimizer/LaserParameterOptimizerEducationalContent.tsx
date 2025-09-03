import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { BookOpen, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

const LaserParameterOptimizerEducationalContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Learn & Optimize
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Parameter Optimization Fundamentals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Parameter Optimization Fundamentals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Power vs Speed Balance</h4>
                  <p className="text-sm text-blue-800">
                    The relationship between laser power and cutting speed is critical. Higher power allows 
                    faster speeds but may reduce quality. The optimizer finds the sweet spot for your requirements.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Gas Selection Impact</h4>
                  <p className="text-sm text-green-800">
                    Oxygen provides faster cutting for steel but creates oxidized edges. Nitrogen gives 
                    clean edges but requires higher power. Air is economical for thin materials.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Focus Position Effects</h4>
                  <p className="text-sm text-purple-800">
                    Focus position affects kerf width and edge quality. Positive offset (above surface) 
                    gives wider kerf, negative offset (below surface) gives narrower kerf.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Frequency Optimization</h4>
                  <p className="text-sm text-orange-800">
                    Pulse frequency affects heat input and edge quality. Higher frequency gives smoother 
                    cuts but may reduce penetration. CW mode is fastest for thick materials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Optimization Best Practices
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Material-Specific Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Carbon Steel</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Use oxygen for speed</li>
                      <li>• Higher power density</li>
                      <li>• Moderate gas pressure</li>
                      <li>• Focus on surface</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Stainless Steel</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Use nitrogen for quality</li>
                      <li>• Higher gas pressure</li>
                      <li>• Lower power density</li>
                      <li>• Focus slightly below</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Aluminum</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Use nitrogen only</li>
                      <li>• High power required</li>
                      <li>• Fast cutting speeds</li>
                      <li>• Precise focus control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Common Issues & Solutions
            </h3>
            <div className="space-y-4">
              <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Poor Edge Quality</h4>
                <div className="text-sm text-red-800">
                  <p className="mb-2"><strong>Symptoms:</strong> Rough edges, excessive dross, poor squareness</p>
                  <p><strong>Solutions:</strong> Reduce cutting speed, optimize gas pressure, check focus position, 
                  consider nitrogen assist gas for clean cuts</p>
                </div>
              </div>
              
              <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Incomplete Cuts</h4>
                <div className="text-sm text-yellow-800">
                  <p className="mb-2"><strong>Symptoms:</strong> Material not fully penetrated, tabs remaining</p>
                  <p><strong>Solutions:</strong> Increase laser power, reduce cutting speed, check beam alignment, 
                  verify material thickness settings</p>
                </div>
              </div>
              
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Excessive Heat Affected Zone</h4>
                <div className="text-sm text-blue-800">
                  <p className="mb-2"><strong>Symptoms:</strong> Wide HAZ, material discoloration, warping</p>
                  <p><strong>Solutions:</strong> Increase cutting speed, reduce power, use pulsed mode, 
                  optimize gas flow for better cooling</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">Advanced Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-indigo-800 mb-2">Multi-Pass Strategies</h4>
                <p className="text-indigo-700 mb-2">
                  For thick materials, consider multiple passes with optimized parameters for each pass.
                </p>
                <ul className="space-y-1 text-indigo-600">
                  <li>• First pass: High speed, moderate power</li>
                  <li>• Final pass: Optimized for quality</li>
                  <li>• Adjust focus between passes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-indigo-800 mb-2">Dynamic Parameter Control</h4>
                <p className="text-indigo-700 mb-2">
                  Modern systems allow parameter changes during cutting for optimal results.
                </p>
                <ul className="space-y-1 text-indigo-600">
                  <li>• Corner speed reduction</li>
                  <li>• Power ramping for starts/stops</li>
                  <li>• Adaptive gas pressure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaserParameterOptimizerEducationalContent;
