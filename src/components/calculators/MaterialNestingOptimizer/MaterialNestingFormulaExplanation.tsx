import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const MaterialNestingFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Material Utilization</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">U</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Percentage of sheet area used for parts</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Sheet Area</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">A_sheet</td>
                      <td className="border border-gray-300 px-3 py-2">mm²</td>
                      <td className="border border-gray-300 px-3 py-2">Total area of material sheet</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Part Area</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">A_part</td>
                      <td className="border border-gray-300 px-3 py-2">mm²</td>
                      <td className="border border-gray-300 px-3 py-2">Area of individual part</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Kerf Width</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">K</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Width of laser cut (material removed)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Edge Margin</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">M</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Minimum distance from part to sheet edge</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Waste Area</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">A_waste</td>
                      <td className="border border-gray-300 px-3 py-2">mm²</td>
                      <td className="border border-gray-300 px-3 py-2">Unusable material area (remnants + kerf)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Nesting Optimization Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Part Area Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    A_part = Length × Width
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Basic rectangular area calculation for each part
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Effective Part Area (with Kerf)</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    A_eff = (Length + K) × (Width + K)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Part area including kerf width for spacing calculations
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Available Sheet Area</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    A_available = (L_sheet - 2×M) × (W_sheet - 2×M)
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Usable sheet area after accounting for edge margins
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Material Utilization</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    U = (Σ A_part) / A_sheet × 100%
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Percentage of sheet area used for actual parts (excluding kerf and waste)
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Waste Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    A_waste = A_sheet - Σ A_part
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Total waste area including remnants and kerf material
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Cost Efficiency</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Cost_per_part = (Sheet_cost × A_part) / (A_sheet × U)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Material cost per part considering utilization efficiency
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
                    <li>• ISO 9013 - Thermal cutting classification</li>
                    <li>• ANSI/AWS C7.1 - Laser cutting guidelines</li>
                    <li>• DIN 2310 - Thermal cutting tolerances</li>
                    <li>• ASTM F1108 - Laser cutting standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Optimization Algorithms</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Bottom-left fill heuristic</li>
                    <li>• Genetic algorithm optimization</li>
                    <li>• Simulated annealing methods</li>
                    <li>• No-fit polygon calculations</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Material Properties</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Material supplier specifications</li>
                    <li>• Standard sheet sizes database</li>
                    <li>• Kerf width measurement data</li>
                    <li>• Cutting parameter databases</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Production nesting case studies</li>
                    <li>• Material utilization benchmarks</li>
                    <li>• Cost analysis validation</li>
                    <li>• Industry best practices</li>
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
                      <li>• Rectangular and simple geometric parts</li>
                      <li>• Standard sheet materials (metal, plastic, wood)</li>
                      <li>• Batch production planning</li>
                      <li>• Material cost optimization</li>
                      <li>• Waste reduction analysis</li>
                      <li>• Production efficiency improvement</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Consistent material thickness</li>
                      <li>• Known kerf width values</li>
                      <li>• Defined edge margin requirements</li>
                      <li>• Clear part orientation constraints</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Simplified rectangular part geometry</li>
                      <li>• Does not account for complex shapes</li>
                      <li>• Limited to 2D nesting optimization</li>
                      <li>• Assumes uniform material properties</li>
                      <li>• Basic heuristic optimization only</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Complex curved or irregular shapes</li>
                      <li>• 3D nesting requirements</li>
                      <li>• Multi-material sheet combinations</li>
                      <li>• Real-time production scheduling</li>
                      <li>• Advanced constraint optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides theoretical nesting optimization based on simplified geometric algorithms. 
                  Actual material utilization may vary ±5-10% due to practical constraints, material variations, 
                  and production requirements. Always validate results with test layouts for critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaterialNestingFormulaExplanation;
