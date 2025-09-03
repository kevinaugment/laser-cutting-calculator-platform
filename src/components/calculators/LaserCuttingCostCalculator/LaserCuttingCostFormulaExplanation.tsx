import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Info } from 'lucide-react';

const LaserCuttingCostFormulaExplanation: React.FC = () => {
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
              
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-medium text-gray-900">Material Variables</h5>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p><strong>A</strong> = Part area (m²) = Length × Width ÷ 1,000,000</p>
                    <p><strong>Q</strong> = Quantity (pieces)</p>
                    <p><strong>W</strong> = Waste factor (decimal, e.g., 0.1 = 10%)</p>
                    <p><strong>Cm</strong> = Material cost per m² ($/m²)</p>
                    <p><strong>t</strong> = Material thickness (mm)</p>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-medium text-gray-900">Cutting Variables</h5>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p><strong>P</strong> = Perimeter per part (mm) = 2 × (Length + Width)</p>
                    <p><strong>V</strong> = Cutting speed (mm/min)</p>
                    <p><strong>Tc</strong> = Cutting time (hours) = (P × Q ÷ V) ÷ 60</p>
                    <p><strong>Ts</strong> = Setup time (hours) = Setup minutes ÷ 60</p>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-medium text-gray-900">Cost Variables</h5>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p><strong>Pw</strong> = Laser power (W)</p>
                    <p><strong>Re</strong> = Electricity rate ($/kWh)</p>
                    <p><strong>Rl</strong> = Labor rate ($/hour)</p>
                    <p><strong>Rm</strong> = Machine hourly rate ($/hour)</p>
                    <p><strong>Gc</strong> = Gas consumption (m³/hour)</p>
                    <p><strong>Rg</strong> = Gas cost ($/m³)</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Calculation Steps</h4>
              
              <div className="space-y-4">
                <Card className="p-4 bg-blue-50">
                  <h5 className="font-medium text-blue-900 mb-2">1. Material Cost Calculation</h5>
                  <div className="space-y-1 text-sm">
                    <p className="font-mono bg-white p-2 rounded">Total Material Area = A × Q × (1 + W)</p>
                    <p className="font-mono bg-white p-2 rounded">Material Cost = Total Material Area × Cm</p>
                  </div>
                </Card>

                <Card className="p-4 bg-green-50">
                  <h5 className="font-medium text-green-900 mb-2">2. Time Calculations</h5>
                  <div className="space-y-1 text-sm">
                    <p className="font-mono bg-white p-2 rounded">Cutting Time = (P × Q ÷ V) ÷ 60</p>
                    <p className="font-mono bg-white p-2 rounded">Total Time = Cutting Time + Setup Time</p>
                  </div>
                </Card>

                <Card className="p-4 bg-purple-50">
                  <h5 className="font-medium text-purple-900 mb-2">3. Operating Cost Calculations</h5>
                  <div className="space-y-1 text-sm">
                    <p className="font-mono bg-white p-2 rounded">Energy Cost = (Pw ÷ 1000) × Total Time × Re</p>
                    <p className="font-mono bg-white p-2 rounded">Gas Cost = Gc × Cutting Time × Rg</p>
                    <p className="font-mono bg-white p-2 rounded">Labor Cost = Total Time × Rl</p>
                    <p className="font-mono bg-white p-2 rounded">Machine Cost = Total Time × Rm</p>
                  </div>
                </Card>

                <Card className="p-4 bg-orange-50">
                  <h5 className="font-medium text-orange-900 mb-2">4. Total Cost</h5>
                  <div className="space-y-1 text-sm">
                    <p className="font-mono bg-white p-2 rounded">Total Cost = Material + Energy + Gas + Labor + Machine</p>
                    <p className="font-mono bg-white p-2 rounded">Cost per Piece = Total Cost ÷ Q</p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data Sources & Standards
              </h4>
              
              <div className="space-y-3">
                <Card className="p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Default Values Source</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• <strong>Material costs:</strong> Based on current market prices from major steel suppliers</p>
                    <p>• <strong>Cutting speeds:</strong> Optimized values from laser manufacturer specifications</p>
                    <p>• <strong>Gas consumption:</strong> Industry standard consumption rates by material type</p>
                    <p>• <strong>Labor rates:</strong> Regional manufacturing labor cost averages</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Industry Standards</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• <strong>Waste factors:</strong> NIST manufacturing efficiency guidelines</p>
                    <p>• <strong>Setup times:</strong> Lean manufacturing best practices</p>
                    <p>• <strong>Machine efficiency:</strong> OEE (Overall Equipment Effectiveness) standards</p>
                    <p>• <strong>Cost accounting:</strong> Activity-based costing principles</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Update Frequency</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• <strong>Material prices:</strong> Updated monthly</p>
                    <p>• <strong>Energy rates:</strong> Updated quarterly</p>
                    <p>• <strong>Labor rates:</strong> Updated annually</p>
                    <p>• <strong>Technology parameters:</strong> Updated with new equipment releases</p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Applicable Scope & Limitations
              </h4>
              
              <div className="space-y-3">
                <Card className="p-4 border-green-200 bg-green-50">
                  <h5 className="font-medium text-green-900 mb-2">✅ Suitable For</h5>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>• 2D laser cutting operations (CO₂, Fiber, YAG lasers)</p>
                    <p>• Material thickness: 0.1mm - 50mm</p>
                    <p>• Common materials: Steel, Stainless Steel, Aluminum, Copper, Brass</p>
                    <p>• Production quantities: 1 - 10,000 pieces</p>
                    <p>• Standard cutting gases: Oxygen, Nitrogen, Air, Argon</p>
                  </div>
                </Card>

                <Card className="p-4 border-yellow-200 bg-yellow-50">
                  <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                  <div className="space-y-1 text-sm text-yellow-800">
                    <p>• Does not include 3D cutting or tube cutting</p>
                    <p>• Assumes standard rectangular nesting patterns</p>
                    <p>• Does not account for complex part geometries</p>
                    <p>• Quality requirements may affect actual cutting speeds</p>
                    <p>• Regional cost variations may require adjustment</p>
                  </div>
                </Card>

                <Card className="p-4 border-red-200 bg-red-50">
                  <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                  <div className="space-y-1 text-sm text-red-800">
                    <p>• Plasma or waterjet cutting</p>
                    <p>• Exotic materials (titanium, inconel, etc.)</p>
                    <p>• Micro-machining applications (&lt;0.1mm)</p>
                    <p>• Heavy plate cutting (&gt;50mm)</p>
                    <p>• Prototype or one-off custom work</p>
                  </div>
                </Card>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Accuracy:</strong> Cost estimates are typically within ±10% of actual costs when input parameters match real operating conditions.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LaserCuttingCostFormulaExplanation;
