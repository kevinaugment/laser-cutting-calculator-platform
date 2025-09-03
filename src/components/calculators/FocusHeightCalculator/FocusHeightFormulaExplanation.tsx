import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const FocusHeightFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Focus Height</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">f</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Distance from material surface to focus point</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Material Thickness</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Thickness of material being cut</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Focal Length</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">FL</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Focal length of focusing lens</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Beam Diameter</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">D</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Laser beam diameter at lens</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Depth of Focus</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">DOF</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Range where beam remains focused</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Power Density</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">PD</td>
                      <td className="border border-gray-300 px-3 py-2">W/mm²</td>
                      <td className="border border-gray-300 px-3 py-2">Laser power per unit area</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Focus Height Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Spot Size Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Spot Size = (4 × λ × FL) / (π × D)
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Where λ = laser wavelength (typically 1.064 μm for fiber lasers)
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Depth of Focus</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    DOF = (8 × λ × FL²) / (π × D²)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Determines the working range for consistent cut quality
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Optimal Focus Position</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Focus Height = t × Focus Factor
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Focus Factor: 0.33 (through cut), 0.0 (surface), 0.6 (thick materials)
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Power Density</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Power Density = Laser Power / (π × (Spot Size/2)²)
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Critical for determining cutting capability and quality
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
                    <li>• ISO 11146 - Laser beam parameters</li>
                    <li>• ANSI Z136.1 - Laser safety standards</li>
                    <li>• AWS C7.1 - Laser cutting guidelines</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Technical References</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Laser cutting physics principles</li>
                    <li>• Gaussian beam optics theory</li>
                    <li>• Material-specific cutting data</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Equipment Specifications</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Laser manufacturer data sheets</li>
                    <li>• Focusing lens specifications</li>
                    <li>• Cutting head parameters</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Production cutting tests</li>
                    <li>• Quality measurement data</li>
                    <li>• Process optimization studies</li>
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
                      <li>• Fiber laser cutting systems</li>
                      <li>• CO2 laser cutting systems</li>
                      <li>• Material thickness: 0.1-50mm</li>
                      <li>• Standard industrial materials</li>
                      <li>• Through-cutting operations</li>
                      <li>• Surface processing operations</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Clean, flat material surfaces</li>
                      <li>• Stable cutting conditions</li>
                      <li>• Calibrated focusing systems</li>
                      <li>• Appropriate assist gas settings</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Assumes Gaussian beam profile</li>
                      <li>• Material surface must be flat</li>
                      <li>• Does not account for thermal effects</li>
                      <li>• Requires stable laser power</li>
                      <li>• Limited to standard wavelengths</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Highly reflective materials</li>
                      <li>• Warped or curved surfaces</li>
                      <li>• Multi-mode laser beams</li>
                      <li>• Exotic laser wavelengths</li>
                      <li>• Plasma cutting processes</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides theoretical focus height calculations based on optical principles. 
                  Actual optimal focus positions may vary ±0.5mm due to material properties, laser beam quality, 
                  and cutting conditions. Always validate results with test cuts for critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FocusHeightFormulaExplanation;
