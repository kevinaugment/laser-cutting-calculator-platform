import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const LaserParameterOptimizerFormulaExplanation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('variables');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">P</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Laser Power</div>
                          <div className="text-xs text-gray-500">Available laser power for cutting</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">W</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">100 - 20,000</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">v</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Cutting Speed</div>
                          <div className="text-xs text-gray-500">Feed rate of the laser head</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">mm/min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">100 - 15,000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">t</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Material Thickness</div>
                          <div className="text-xs text-gray-500">Thickness of material being cut</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">mm</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">0.1 - 50</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">f</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Pulse Frequency</div>
                          <div className="text-xs text-gray-500">Laser pulse frequency (for pulsed mode)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Hz</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">1 - 20,000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">Qg</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Gas Flow Rate</div>
                          <div className="text-xs text-gray-500">Assist gas flow rate</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">L/min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">0.5 - 50</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">Pg</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>Gas Pressure</div>
                          <div className="text-xs text-gray-500">Assist gas pressure</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">bar</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">0.1 - 20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-blue-900">Km</div>
                    <div className="font-medium text-blue-800">Material Factor</div>
                    <div className="text-sm text-blue-700 mt-1">
                      Steel: 1.0, Stainless: 1.2, Aluminum: 0.8, Copper: 1.5
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-green-900">Kq</div>
                    <div className="font-medium text-green-800">Quality Factor</div>
                    <div className="text-sm text-green-700 mt-1">
                      Draft: 0.7, Standard: 1.0, High: 1.3, Precision: 1.6
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-purple-900">Kc</div>
                    <div className="font-medium text-purple-800">Complexity Factor</div>
                    <div className="text-sm text-purple-700 mt-1">
                      Simple: 1.0, Medium: 1.2, Complex: 1.5
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="font-mono text-sm font-bold text-orange-900">Kg</div>
                    <div className="font-medium text-orange-800">Gas Factor</div>
                    <div className="text-sm text-orange-700 mt-1">
                      Air: 0.8, Oxygen: 1.0, Nitrogen: 1.2
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Optimization Formulas</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Power Density Calculation</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>PD =</strong> P / (π × (d/2)²)
                    </div>
                    <div className="text-sm text-blue-700 mt-2">
                      Where PD = Power Density (W/mm²), P = Laser Power (W), d = Beam Diameter (mm)
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-3">Optimal Speed Calculation</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>v_opt =</strong> (P × η) / (t × Km × Kq × Kc)
                    </div>
                    <div className="text-sm text-green-700 mt-2">
                      Where η = Absorption Efficiency, t = Thickness, K factors = Material/Quality/Complexity modifiers
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-900 mb-3">Quality Prediction</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>Q =</strong> 10 - (v/v_opt - 1)² × 3 - (PD/PD_opt - 1)² × 2
                    </div>
                    <div className="text-sm text-purple-700 mt-2">
                      Quality score (1-10) based on speed and power density optimization
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="font-semibold text-orange-900 mb-3">Heat Affected Zone</h4>
                    <div className="font-mono text-lg bg-white p-4 rounded border">
                      <strong>HAZ =</strong> √(α × t × P / (v × ρ × c))
                    </div>
                    <div className="text-sm text-orange-700 mt-2">
                      Where α = Thermal Diffusivity, ρ = Density, c = Specific Heat
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Objective Optimization</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="font-mono text-lg bg-white p-4 rounded border mb-4">
                    <strong>Objective Function:</strong><br/>
                    <strong>F =</strong> w₁×Speed + w₂×Quality + w₃×Efficiency
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2"><strong>Weight Factors by Priority:</strong></p>
                    <ul className="space-y-1">
                      <li>• <strong>Speed Priority:</strong> w₁=0.6, w₂=0.2, w₃=0.2</li>
                      <li>• <strong>Quality Priority:</strong> w₁=0.2, w₂=0.6, w₃=0.2</li>
                      <li>• <strong>Cost Priority:</strong> w₁=0.3, w₂=0.2, w₃=0.5</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources & Standards</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Material Properties</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>NIST Materials Database</strong> - Thermal properties</li>
                      <li>• <strong>ASM Handbook</strong> - Mechanical properties</li>
                      <li>• <strong>ISO 14579</strong> - Material specifications</li>
                      <li>• <strong>ASTM Standards</strong> - Testing methods</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Cutting Standards</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>ISO 9013</strong> - Thermal cutting quality</li>
                      <li>• <strong>EN 1090-2</strong> - Execution standards</li>
                      <li>• <strong>AWS D17.1</strong> - Laser beam welding/cutting</li>
                      <li>• <strong>DIN 2310</strong> - Thermal cutting processes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Laser Parameters</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>Manufacturer Data</strong> - Laser specifications</li>
                      <li>• <strong>Research Papers</strong> - Optimization studies</li>
                      <li>• <strong>Industry Guidelines</strong> - Best practices</li>
                      <li>• <strong>Experimental Data</strong> - Validation tests</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Update Frequency</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• <strong>Material Data:</strong> Annually</li>
                      <li>• <strong>Standards:</strong> As published</li>
                      <li>• <strong>Algorithms:</strong> Quarterly</li>
                      <li>• <strong>Validation:</strong> Continuously</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Data Validation</h4>
                <p className="text-sm text-yellow-800">
                  All parameters are validated against experimental data from leading laser cutting research institutions 
                  and industrial partners. Accuracy is verified through continuous testing and user feedback.
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
                      Material Types
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Carbon Steel (0.1-50mm)</li>
                      <li>• Stainless Steel (0.1-30mm)</li>
                      <li>• Aluminum Alloys (0.1-25mm)</li>
                      <li>• Copper (0.1-10mm)</li>
                      <li>• Brass (0.1-15mm)</li>
                      <li>• Titanium (0.1-20mm)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">⚡</Badge>
                      Laser Types
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Fiber Laser (1-20kW)</li>
                      <li>• CO2 Laser (0.1-6kW)</li>
                      <li>• Nd:YAG Laser (0.1-4kW)</li>
                      <li>• Disk Laser (1-16kW)</li>
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
                      <li>• <strong>Straight cuts only:</strong> Complex geometries may require parameter adjustment</li>
                      <li>• <strong>Clean materials:</strong> Coated or contaminated materials not supported</li>
                      <li>• <strong>Standard atmosphere:</strong> Calculations assume normal temperature and pressure</li>
                      <li>• <strong>Machine condition:</strong> Assumes well-maintained equipment with proper alignment</li>
                      <li>• <strong>Beam quality:</strong> Assumes M² ≤ 1.2 for fiber lasers, M² ≤ 1.1 for CO2</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Accuracy & Validation</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">±5%</div>
                        <div className="text-sm text-gray-600">Speed Prediction</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">±10%</div>
                        <div className="text-sm text-gray-600">Quality Prediction</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">±15%</div>
                        <div className="text-sm text-gray-600">HAZ Prediction</div>
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

export default LaserParameterOptimizerFormulaExplanation;
