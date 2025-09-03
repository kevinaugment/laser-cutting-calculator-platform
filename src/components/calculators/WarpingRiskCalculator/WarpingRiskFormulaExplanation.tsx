import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const WarpingRiskFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Part Length</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">L</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Maximum dimension of the part</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Part Width</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">W</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Secondary dimension of the part</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Thickness</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Material thickness</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Laser Power</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P</td>
                      <td className="border border-gray-300 px-3 py-2">W</td>
                      <td className="border border-gray-300 px-3 py-2">Laser power setting</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cutting Speed</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">v</td>
                      <td className="border border-gray-300 px-3 py-2">mm/min</td>
                      <td className="border border-gray-300 px-3 py-2">Feed rate during cutting</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Thermal Conductivity</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">k</td>
                      <td className="border border-gray-300 px-3 py-2">W/m·K</td>
                      <td className="border border-gray-300 px-3 py-2">Material thermal conductivity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Warping Risk Analysis Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Aspect Ratio Factor</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    AR = max(L/W, W/L) × (L×W)/(t²)
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Geometric factor considering part proportions and thickness
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Heat Input Density</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    HID = P / (v × t × beam_width)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Energy density per unit volume of material removed
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Thermal Gradient Factor</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    TGF = HID / (k × density × specific_heat)
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Temperature gradient magnitude in the material
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Constraint Factor</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    CF = (cut_length / perimeter) × support_factor
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Degree of constraint and support during cutting
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Material Susceptibility</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    MS = (thermal_expansion × yield_strength) / elastic_modulus
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Material's inherent tendency to warp under thermal stress
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Overall Warping Risk</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    WR = (AR × TGF × MS) / (CF × thickness_factor)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Combined risk score from all contributing factors
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
                  <h5 className="font-medium mb-2">Material Properties</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ASTM material property databases</li>
                    <li>• Thermal expansion coefficient tables</li>
                    <li>• Elastic modulus and yield strength data</li>
                    <li>• Thermal conductivity measurements</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Thermal Analysis</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Finite element analysis studies</li>
                    <li>• Heat transfer modeling research</li>
                    <li>• Thermal stress calculation methods</li>
                    <li>• Temperature distribution patterns</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Manufacturing Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ISO 9013 cutting quality standards</li>
                    <li>• AWS welding distortion guidelines</li>
                    <li>• ASME fabrication tolerances</li>
                    <li>• Industry best practice guides</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Experimental Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Warping measurement studies</li>
                    <li>• Process parameter optimization</li>
                    <li>• Material-specific test results</li>
                    <li>• Validation case studies</li>
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
                      <li>• Sheet metal laser cutting operations</li>
                      <li>• Flat plate and panel fabrication</li>
                      <li>• Structural steel components</li>
                      <li>• Precision part manufacturing</li>
                      <li>• Quality control planning</li>
                      <li>• Process parameter optimization</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Known material properties</li>
                      <li>• Accurate part geometry</li>
                      <li>• Defined cutting parameters</li>
                      <li>• Controlled support conditions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on simplified thermal models</li>
                      <li>• Does not account for residual stresses</li>
                      <li>• Assumes uniform material properties</li>
                      <li>• Limited to single-pass cutting</li>
                      <li>• Does not include fixture effects</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• 3D cutting operations</li>
                      <li>• Multi-layer assemblies</li>
                      <li>• Pre-stressed materials</li>
                      <li>• Non-metallic materials</li>
                      <li>• Extremely thin foils (&lt;0.1mm)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This warping risk assessment provides predictive analysis based on thermal and mechanical principles. 
                  Results accuracy depends on material data quality and may vary ±15-25% from actual warping behavior. 
                  Consider conducting test cuts for critical applications and high-risk scenarios.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WarpingRiskFormulaExplanation;
