import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const GasConsumptionFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Gas Flow Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">Q</td>
                      <td className="border border-gray-300 px-3 py-2">L/min</td>
                      <td className="border border-gray-300 px-3 py-2">Volumetric flow rate of assist gas</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cutting Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t_c</td>
                      <td className="border border-gray-300 px-3 py-2">min</td>
                      <td className="border border-gray-300 px-3 py-2">Active cutting time with gas flow</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Piercing Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t_p</td>
                      <td className="border border-gray-300 px-3 py-2">min</td>
                      <td className="border border-gray-300 px-3 py-2">Time for piercing operations</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Setup Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t_s</td>
                      <td className="border border-gray-300 px-3 py-2">min</td>
                      <td className="border border-gray-300 px-3 py-2">Setup and preparation time with gas flow</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Gas Pressure</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P</td>
                      <td className="border border-gray-300 px-3 py-2">bar</td>
                      <td className="border border-gray-300 px-3 py-2">Operating pressure of assist gas</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Gas Price</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_g</td>
                      <td className="border border-gray-300 px-3 py-2">$/m³</td>
                      <td className="border border-gray-300 px-3 py-2">Unit cost of assist gas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Gas Consumption Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Cutting Gas Consumption</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    V_cutting = Q × t_c × (P/P_std) × efficiency_factor
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Gas volume consumed during active cutting operations
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Piercing Gas Consumption</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    V_piercing = Q_pierce × t_p × n_holes × (P/P_std)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Gas volume consumed during piercing operations
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Setup Gas Consumption</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    V_setup = Q_setup × t_s × (P/P_std)
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Gas volume consumed during setup and preparation
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Idle Gas Consumption</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    V_idle = Q_idle × t_idle × (P/P_std)
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Gas volume consumed during idle periods with gas flow
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Total Gas Consumption</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    V_total = V_cutting + V_piercing + V_setup + V_idle
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Total gas volume consumed for the complete operation
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Total Gas Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Cost_total = V_total × C_g × waste_factor
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Total cost including waste and inefficiency factors
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
                    <li>• ISO 11145 - Gas consumption measurement</li>
                    <li>• ANSI/AWS C7.1 - Laser cutting gas standards</li>
                    <li>• DIN 2310 - Industrial gas specifications</li>
                    <li>• ASTM F1108 - Gas flow measurement standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Gas supplier consumption charts</li>
                    <li>• Laser manufacturer specifications</li>
                    <li>• Process optimization studies</li>
                    <li>• Energy efficiency benchmarks</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Measurement Methods</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Flow meter calibration standards</li>
                    <li>• Pressure measurement protocols</li>
                    <li>• Temperature compensation methods</li>
                    <li>• Volumetric conversion factors</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Cost Analysis</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Gas pricing market data</li>
                    <li>• Supply contract analysis</li>
                    <li>• Bulk purchasing economics</li>
                    <li>• Alternative gas cost comparisons</li>
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
                      <li>• CO₂ and fiber laser cutting systems</li>
                      <li>• Standard assist gases (O₂, N₂, air, Ar)</li>
                      <li>• Production and job shop operations</li>
                      <li>• Material thickness 0.5-25mm</li>
                      <li>• Continuous and pulsed cutting modes</li>
                      <li>• Single and multi-head systems</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate flow rate measurements</li>
                      <li>• Consistent operating pressures</li>
                      <li>• Known cutting parameters</li>
                      <li>• Regular system maintenance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on standard temperature and pressure</li>
                      <li>• Does not account for gas leakage</li>
                      <li>• Assumes consistent gas quality</li>
                      <li>• Limited to single gas type per calculation</li>
                      <li>• Does not include delivery and storage costs</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Plasma cutting applications</li>
                      <li>• Waterjet cutting systems</li>
                      <li>• Mixed gas applications</li>
                      <li>• Extreme environmental conditions</li>
                      <li>• Research or experimental setups</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides gas consumption estimates based on standard operating conditions and typical system efficiencies. 
                  Actual consumption may vary ±15-25% due to system variations, environmental conditions, 
                  and operational practices. Regular measurement and calibration are recommended for optimal accuracy.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GasConsumptionFormulaExplanation;
