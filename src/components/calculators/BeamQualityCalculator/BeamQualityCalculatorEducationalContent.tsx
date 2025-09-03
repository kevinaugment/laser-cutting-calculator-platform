import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { BookOpen, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

const BeamQualityCalculatorEducationalContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          Learn & Optimize
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Beam Quality Fundamentals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Beam Quality Fundamentals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">What is M² Factor?</h4>
                  <p className="text-sm text-purple-800">
                    M² (M-squared) is the beam quality factor that compares a real laser beam to an ideal 
                    Gaussian beam. M² = 1.0 represents perfect beam quality, while higher values indicate 
                    lower quality with larger focus spots and higher divergence.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Beam Parameter Product</h4>
                  <p className="text-sm text-blue-800">
                    BPP is the product of beam radius and divergence angle. It's conserved through 
                    ideal optical systems and determines the minimum achievable focus spot size. 
                    Lower BPP means better beam quality and smaller focus spots.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Focus Spot Size Impact</h4>
                  <p className="text-sm text-green-800">
                    Better beam quality (lower M²) enables smaller focus spots, leading to higher power 
                    density, faster cutting speeds, and better edge quality. The focus spot diameter 
                    scales directly with M².
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Rayleigh Length</h4>
                  <p className="text-sm text-orange-800">
                    The Rayleigh length defines the depth of focus - the distance over which the beam 
                    remains well-focused. Longer Rayleigh length provides more tolerance for focus 
                    position but may reduce cutting speed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Laser Type Characteristics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Laser Type Characteristics
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Typical Beam Quality by Laser Type</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Fiber Laser</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• M² = 1.05 - 1.2</li>
                      <li>• Excellent quality</li>
                      <li>• Small core diameter</li>
                      <li>• High power density</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">CO2 Laser</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• M² = 1.0 - 1.1</li>
                      <li>• Near-perfect quality</li>
                      <li>• Large beam diameter</li>
                      <li>• Excellent for thick cuts</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Nd:YAG Laser</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• M² = 1.1 - 1.5</li>
                      <li>• Good to very good</li>
                      <li>• Rod-based design</li>
                      <li>• Pulsed operation</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Disk Laser</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• M² = 1.05 - 1.3</li>
                      <li>• Excellent quality</li>
                      <li>• High power capability</li>
                      <li>• Good thermal management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Measurement Best Practices */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Measurement Best Practices
            </h3>
            <div className="space-y-4">
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Accurate Measurement Requirements</h4>
                <div className="text-sm text-blue-800">
                  <p className="mb-2"><strong>Environmental Control:</strong></p>
                  <ul className="space-y-1 mb-3">
                    <li>• Stable temperature (±1°C)</li>
                    <li>• Low air turbulence</li>
                    <li>• Vibration isolation</li>
                    <li>• Clean optical path</li>
                  </ul>
                  <p><strong>Equipment Requirements:</strong> Calibrated beam profiler, proper sampling rate, 
                  adequate measurement distance, and multiple measurement points for statistical accuracy.</p>
                </div>
              </div>
              
              <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Common Measurement Errors</h4>
                <div className="text-sm text-yellow-800">
                  <p className="mb-2"><strong>Sources of Error:</strong></p>
                  <ul className="space-y-1 mb-3">
                    <li>• Insufficient measurement points</li>
                    <li>• Beam clipping by apertures</li>
                    <li>• Thermal lensing effects</li>
                    <li>• Detector saturation or noise</li>
                    <li>• Incorrect background subtraction</li>
                  </ul>
                  <p><strong>Prevention:</strong> Follow ISO 11146 standards, use multiple measurement methods 
                  for validation, and ensure proper equipment calibration.</p>
                </div>
              </div>
              
              <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Beam Quality Improvement</h4>
                <div className="text-sm text-green-800">
                  <p className="mb-2"><strong>Improvement Strategies:</strong></p>
                  <ul className="space-y-1 mb-3">
                    <li>• Optimize fiber coupling alignment</li>
                    <li>• Use beam shaping optics</li>
                    <li>• Implement active beam control</li>
                    <li>• Maintain clean optical surfaces</li>
                    <li>• Control thermal effects</li>
                  </ul>
                  <p><strong>Expected Results:</strong> Proper optimization can improve M² by 10-20% 
                  and significantly enhance cutting performance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Applications */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Advanced Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Adaptive Beam Control</h4>
                <p className="text-purple-700 mb-2">
                  Real-time beam quality monitoring and correction using adaptive optics systems.
                </p>
                <ul className="space-y-1 text-purple-600">
                  <li>• Deformable mirror correction</li>
                  <li>• Feedback control systems</li>
                  <li>• Dynamic beam shaping</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Multi-Mode Beam Analysis</h4>
                <p className="text-purple-700 mb-2">
                  Advanced analysis techniques for complex beam profiles and multimode operation.
                </p>
                <ul className="space-y-1 text-purple-600">
                  <li>• Modal decomposition</li>
                  <li>• Coherence analysis</li>
                  <li>• Beam quality optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeamQualityCalculatorEducationalContent;
