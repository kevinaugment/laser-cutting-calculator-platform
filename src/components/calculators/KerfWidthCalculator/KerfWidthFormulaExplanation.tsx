import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const KerfWidthFormulaExplanation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Formula Explanation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="variables" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
          </TabsList>

          <TabsContent value="variables" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Variable Definitions
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-left font-medium">Variable</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-medium">Symbol</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-medium">Unit</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Kerf Width</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">K</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Width of material removed by laser beam</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Beam Diameter</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">d₀</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Focused laser beam diameter at material surface</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Laser Power</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P</td>
                      <td className="border border-gray-300 px-3 py-2">W</td>
                      <td className="border border-gray-300 px-3 py-2">Laser output power</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cutting Speed</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">v</td>
                      <td className="border border-gray-300 px-3 py-2">mm/min</td>
                      <td className="border border-gray-300 px-3 py-2">Linear cutting speed</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Material Thickness</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Thickness of material being cut</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Material Constant</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">k_m</td>
                      <td className="border border-gray-300 px-3 py-2">-</td>
                      <td className="border border-gray-300 px-3 py-2">Material-specific thermal constant</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Kerf Width Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Theoretical Kerf Width</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    K_theoretical = d₀ + k_m × √(P/(v × t))
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Base kerf width considering beam diameter and thermal effects
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Heat Affected Zone Correction</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    HAZ_factor = α × √(thermal_diffusivity × interaction_time)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Correction for heat affected zone expansion
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Gas Pressure Effect</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Gas_factor = 1 + β × (P_gas - P_optimal)/P_optimal
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Adjustment for assist gas pressure effects on kerf geometry
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Material Property Correction</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Material_factor = f(thermal_conductivity, melting_point, density)
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Material-specific correction based on thermal properties
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Final Kerf Width</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    K_actual = K_theoretical × HAZ_factor × Gas_factor × Material_factor
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Final kerf width with all correction factors applied
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Compensation Value</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Compensation = K_actual / 2
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Path compensation value for CAD/CAM programming
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data Sources and References
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Technical Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ISO 9013 - Thermal cutting quality classification</li>
                    <li>• ANSI/AWS C7.1 - Laser cutting guidelines</li>
                    <li>• DIN 2310 - Thermal cutting tolerances</li>
                    <li>• ASTM F1108 - Laser cutting standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Research Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Laser cutting kerf width studies</li>
                    <li>• Material thermal property databases</li>
                    <li>• Beam quality measurement standards</li>
                    <li>• Process parameter optimization research</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing tolerance standards</li>
                    <li>• Laser system performance data</li>
                    <li>• Quality control best practices</li>
                    <li>• Production accuracy metrics</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Studies</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Experimental kerf width measurements</li>
                    <li>• Model validation with real cutting data</li>
                    <li>• Statistical analysis of kerf variations</li>
                    <li>• Cross-validation with different materials</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Application Scope and Limitations
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-2">✓ Applicable For</h5>
                    <ul className="text-sm space-y-1 text-green-800">
                      <li>• CO₂ and fiber laser cutting</li>
                      <li>• Common metals (steel, stainless, aluminum)</li>
                      <li>• Thickness range: 0.5-25mm</li>
                      <li>• Standard cutting gases (O₂, N₂, air)</li>
                      <li>• Straight line and simple curve cutting</li>
                      <li>• Production and prototype applications</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Stable laser parameters</li>
                      <li>• Known material properties</li>
                      <li>• Consistent gas supply</li>
                      <li>• Proper beam alignment</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Empirical model with material variations</li>
                      <li>• Does not account for beam quality degradation</li>
                      <li>• Limited to steady-state cutting conditions</li>
                      <li>• Assumes optimal focus position</li>
                      <li>• Does not predict kerf taper</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Exotic materials or alloys</li>
                      <li>• Extreme thickness ranges (&lt;0.5mm, &gt;25mm)</li>
                      <li>• Complex 3D cutting geometries</li>
                      <li>• Pulsed laser applications</li>
                      <li>• Non-standard gas mixtures</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides kerf width predictions based on empirical models and thermal cutting theory. 
                  Actual kerf width may vary ±10-20% due to machine variations, material inconsistencies, 
                  and process conditions. Always validate with test cuts for critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KerfWidthFormulaExplanation;
