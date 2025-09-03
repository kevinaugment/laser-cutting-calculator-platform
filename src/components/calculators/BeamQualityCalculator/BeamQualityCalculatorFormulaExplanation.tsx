import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const BeamQualityCalculatorFormulaExplanation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('variables');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          Formula Explanation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
          </TabsList>

          <TabsContent value="variables" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Variables</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variable
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Range
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">λ</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Wavelength</div>
                          <div className="text-xs text-gray-500">Laser wavelength</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">nm</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">200 - 12,000</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">w₀</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Beam Radius</div>
                          <div className="text-xs text-gray-500">Beam radius at 1/e² intensity</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">mm</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">0.05 - 25</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">θ</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Divergence Angle</div>
                          <div className="text-xs text-gray-500">Full angle beam divergence</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">mrad</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">0.1 - 100</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">f</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Focal Length</div>
                          <div className="text-xs text-gray-500">Focusing lens focal length</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">mm</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">25 - 500</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">P</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Laser Power</div>
                          <div className="text-xs text-gray-500">Total laser output power</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">W</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">1 - 50,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Grades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-green-900">M² ≤ 1.1</div>
                    <div className="font-medium text-green-800">Excellent</div>
                    <div className="text-sm text-green-700 mt-1">
                      Single mode, near-diffraction limited
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-blue-900">1.1 &lt; M² ≤ 1.3</div>
                    <div className="font-medium text-blue-800">Very Good</div>
                    <div className="text-sm text-blue-700 mt-1">
                      High quality, suitable for precision cutting
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-yellow-900">1.3 &lt; M² ≤ 1.5</div>
                    <div className="font-medium text-yellow-800">Good</div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Good quality, general purpose cutting
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-orange-900">1.5 &lt; M² ≤ 2.0</div>
                    <div className="font-medium text-orange-800">Fair</div>
                    <div className="text-sm text-orange-700 mt-1">
                      Acceptable for thick material cutting
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Beam Quality Formulas</h3>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-900 mb-3">M² Factor Calculation</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>M² =</strong> (w₀ × θ) / (λ/π)
                    </div>
                    <div className="text-sm text-purple-700 mt-2">
                      Where w₀ = beam radius, θ = divergence angle, λ = wavelength
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Focused Spot Size</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>w_f =</strong> (M² × λ × f) / (π × w₀)
                    </div>
                    <div className="text-sm text-blue-700 mt-2">
                      Minimum achievable focused spot radius
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-3">Rayleigh Length</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>z_R =</strong> (π × w₀²) / (M² × λ)
                    </div>
                    <div className="text-sm text-green-700 mt-2">
                      Distance over which beam remains focused
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-semibold text-orange-900 mb-3">Power Density</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>I =</strong> P / (π × w_f²)
                    </div>
                    <div className="text-sm text-orange-700 mt-2">
                      Power density at the focused spot
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Beam Propagation</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="font-mono text-lg bg-white p-4 rounded border mb-4">
                    <strong>w(z) =</strong> w₀ × √(1 + (z/z_R)²)
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2"><strong>Beam radius at distance z from waist</strong></p>
                    <ul className="space-y-1">
                      <li>• At z = 0: w(z) = w₀ (beam waist)</li>
                      <li>• At z = z_R: w(z) = w₀ × √2</li>
                      <li>• At z &gt;&gt; z_R: w(z) ≈ w₀ × z/z_R (far field)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Standards & References</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">ISO Standards</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>ISO 11146-1:</strong> Beam widths, divergence angles and beam propagation ratios</li>
                      <li>• <strong>ISO 11146-2:</strong> General astigmatic beams</li>
                      <li>• <strong>ISO 11146-3:</strong> Intrinsic and geometrical laser beam classification</li>
                      <li>• <strong>ISO 13694:</strong> Test methods for laser beam parameters</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Technical References</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>Siegman, A.E.:</strong> "Lasers" - University Science Books</li>
                      <li>• <strong>Saleh & Teich:</strong> "Fundamentals of Photonics"</li>
                      <li>• <strong>NIST Guidelines:</strong> Laser beam measurement standards</li>
                      <li>• <strong>Laser Institute:</strong> Beam quality measurement practices</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Measurement Equipment</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>Beam Profilers:</strong> CCD/CMOS camera systems</li>
                      <li>• <strong>Knife Edge:</strong> Scanning slit beam analyzers</li>
                      <li>• <strong>Pinhole:</strong> Aperture scanning systems</li>
                      <li>• <strong>Interferometry:</strong> Phase measurement systems</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Calibration Standards</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>NIST Traceable:</strong> Calibrated reference beams</li>
                      <li>• <strong>PTB Standards:</strong> European metrology standards</li>
                      <li>• <strong>Manufacturer Cal:</strong> Equipment-specific calibration</li>
                      <li>• <strong>Cross-validation:</strong> Multiple measurement methods</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Measurement Accuracy</h4>
                <p className="text-sm text-blue-800">
                  Beam quality measurements are typically accurate to ±5% for M² values when using 
                  calibrated equipment and following ISO 11146 standards. Accuracy depends on 
                  measurement method, beam stability, and environmental conditions.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicable Range & Limitations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">✓ Supported</Badge>
                      Laser Types
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Fiber Lasers (1030-1080nm)</li>
                      <li>• CO2 Lasers (9.3-10.6μm)</li>
                      <li>• Nd:YAG Lasers (1064nm)</li>
                      <li>• Disk Lasers (1030nm)</li>
                      <li>• Diode Lasers (800-980nm)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">📏</Badge>
                      Power Range
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Low Power: 1W - 100W</li>
                      <li>• Medium Power: 100W - 5kW</li>
                      <li>• High Power: 5kW - 50kW</li>
                      <li>• All CW and pulsed modes</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">⚠</Badge>
                    Limitations & Assumptions
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="space-y-2 text-sm text-red-800">
                      <li>• <strong>Stable beam:</strong> Assumes temporally and spatially stable laser output</li>
                      <li>• <strong>Gaussian approximation:</strong> Results most accurate for near-Gaussian beams</li>
                      <li>• <strong>Linear propagation:</strong> Assumes free-space propagation without nonlinear effects</li>
                      <li>• <strong>Clean optics:</strong> Assumes high-quality, clean optical components</li>
                      <li>• <strong>Measurement accuracy:</strong> Limited by equipment precision and environmental stability</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Accuracy & Validation</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">±5%</div>
                        <div className="text-sm text-gray-600">M² Factor</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">±3%</div>
                        <div className="text-sm text-gray-600">Focus Spot Size</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">±10%</div>
                        <div className="text-sm text-gray-600">Power Density</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BeamQualityCalculatorFormulaExplanation;
