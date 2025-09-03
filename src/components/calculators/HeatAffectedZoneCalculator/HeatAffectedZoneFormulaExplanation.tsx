import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const HeatAffectedZoneFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">HAZ Width</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">W_haz</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Width of heat affected zone</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Heat Input</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">H</td>
                      <td className="border border-gray-300 px-3 py-2">J/mm</td>
                      <td className="border border-gray-300 px-3 py-2">Energy per unit length</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Thermal Diffusivity</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">α</td>
                      <td className="border border-gray-300 px-3 py-2">mm²/s</td>
                      <td className="border border-gray-300 px-3 py-2">Rate of thermal energy transfer</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Thermal Conductivity</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">k</td>
                      <td className="border border-gray-300 px-3 py-2">W/(mm·K)</td>
                      <td className="border border-gray-300 px-3 py-2">Material thermal conductivity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Peak Temperature</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">T_peak</td>
                      <td className="border border-gray-300 px-3 py-2">°C</td>
                      <td className="border border-gray-300 px-3 py-2">Maximum temperature reached</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cooling Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">CR</td>
                      <td className="border border-gray-300 px-3 py-2">°C/s</td>
                      <td className="border border-gray-300 px-3 py-2">Rate of temperature decrease</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">HAZ Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Heat Input Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    H = (P × 60) / v
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Where P = laser power (W), v = cutting speed (mm/min)
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Thermal Diffusivity</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    α = k / (ρ × c)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Where k = thermal conductivity, ρ = density, c = specific heat
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. HAZ Width Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    W_haz = √((H × α) / (π × k × t))
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Where t = material thickness. Minimum value is 2 × beam diameter
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Peak Temperature</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    T_peak = T_ambient + (E_density × A) / (ρ × c × t)
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Where E_density = energy density, A = absorptivity (≈0.3)
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Cooling Rate</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    CR = (k × 100) / t
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Simplified cooling rate based on material thickness and conductivity
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
                  <h5 className="font-medium mb-2">Industry Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• AWS D1.1 - Structural welding code</li>
                    <li>• ISO 15614 - Welding procedure specification</li>
                    <li>• ASTM E384 - Microhardness testing</li>
                    <li>• IIW Guidelines - Heat affected zone</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Technical References</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Heat transfer theory in laser processing</li>
                    <li>• Metallurgical phase transformation data</li>
                    <li>• Material property databases</li>
                    <li>• Thermal analysis research papers</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Material Properties</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ASM Metals Handbook</li>
                    <li>• Material manufacturer data sheets</li>
                    <li>• Thermal property compilations</li>
                    <li>• Phase diagram databases</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Experimental HAZ measurements</li>
                    <li>• Metallographic analysis results</li>
                    <li>• Temperature monitoring data</li>
                    <li>• Industrial case studies</li>
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
                      <li>• Continuous wave laser cutting</li>
                      <li>• Pulsed laser cutting operations</li>
                      <li>• Material thickness: 0.5-50mm</li>
                      <li>• Common structural materials</li>
                      <li>• Quality-critical applications</li>
                      <li>• HAZ-sensitive components</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Stable laser power output</li>
                      <li>• Consistent cutting speed</li>
                      <li>• Known material properties</li>
                      <li>• Controlled ambient conditions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Simplified thermal model</li>
                      <li>• Assumes uniform material properties</li>
                      <li>• Does not account for phase changes</li>
                      <li>• Limited to 2D heat conduction</li>
                      <li>• Requires accurate material data</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Multi-layer materials</li>
                      <li>• Composite materials</li>
                      <li>• Extremely thin foils (&lt;0.1mm)</li>
                      <li>• Materials with unknown properties</li>
                      <li>• Non-metallic materials</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides theoretical HAZ width estimates based on simplified thermal models. 
                  Actual HAZ dimensions may vary ±20% due to material variations, process conditions, and 
                  complex thermal interactions. Always validate results with metallographic analysis for 
                  critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HeatAffectedZoneFormulaExplanation;
