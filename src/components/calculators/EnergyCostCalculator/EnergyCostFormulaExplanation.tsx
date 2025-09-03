import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const EnergyCostFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Laser Power</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P_laser</td>
                      <td className="border border-gray-300 px-3 py-2">kW</td>
                      <td className="border border-gray-300 px-3 py-2">Rated laser power consumption</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">System Efficiency</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">η</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Overall system electrical efficiency</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Operating Hours</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t_op</td>
                      <td className="border border-gray-300 px-3 py-2">hours</td>
                      <td className="border border-gray-300 px-3 py-2">Daily operating hours</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Electricity Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R_e</td>
                      <td className="border border-gray-300 px-3 py-2">$/kWh</td>
                      <td className="border border-gray-300 px-3 py-2">Energy cost per kilowatt-hour</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Demand Charge</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R_d</td>
                      <td className="border border-gray-300 px-3 py-2">$/kW</td>
                      <td className="border border-gray-300 px-3 py-2">Peak demand charge rate</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Power Factor</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">PF</td>
                      <td className="border border-gray-300 px-3 py-2">-</td>
                      <td className="border border-gray-300 px-3 py-2">Ratio of real to apparent power</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Energy Cost Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Total Power Consumption</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    P_total = P_laser/η + P_auxiliary + P_hvac + P_standby
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Sum of all system power requirements including inefficiencies
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Energy Consumption</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    E_daily = P_total × t_op + P_standby × (24 - t_op)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Daily energy consumption including operating and standby periods
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Peak Demand</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    P_peak = max(P_total) during billing period
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Maximum power demand during utility billing period
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Energy Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_energy = E_monthly × R_e × TOU_factor
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Monthly energy cost with time-of-use rate adjustments
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Demand Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_demand = P_peak × R_d × PF_penalty
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Monthly demand charge with power factor penalties
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Total Monthly Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_total = C_energy + C_demand + C_fixed + C_taxes
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Complete monthly electricity cost including all charges
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
                  <h5 className="font-medium mb-2">Utility Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• IEEE 1459 - Power quality measurement</li>
                    <li>• ANSI C12.1 - Electric meter standards</li>
                    <li>• IEC 61000 - Electromagnetic compatibility</li>
                    <li>• NEMA MG1 - Motor efficiency standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Energy Management</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ISO 50001 - Energy management systems</li>
                    <li>• ASHRAE 90.1 - Energy efficiency standards</li>
                    <li>• DOE energy efficiency guidelines</li>
                    <li>• ENERGY STAR industrial programs</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Rate Structures</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Utility tariff schedules</li>
                    <li>• Time-of-use rate databases</li>
                    <li>• Demand charge methodologies</li>
                    <li>• Regional electricity market data</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Industrial energy consumption studies</li>
                    <li>• Laser system power measurements</li>
                    <li>• Energy audit case studies</li>
                    <li>• Cost optimization benchmarks</li>
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
                      <li>• Industrial laser cutting systems</li>
                      <li>• Commercial electricity rate structures</li>
                      <li>• Single and three-phase power systems</li>
                      <li>• Standard utility billing periods</li>
                      <li>• Energy cost budgeting and planning</li>
                      <li>• Demand management optimization</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate power consumption data</li>
                      <li>• Current utility rate schedules</li>
                      <li>• Known operating patterns</li>
                      <li>• Power quality measurements</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Simplified power factor calculations</li>
                      <li>• Does not account for harmonics</li>
                      <li>• Assumes stable utility rates</li>
                      <li>• Limited to standard rate structures</li>
                      <li>• Does not include renewable energy credits</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Complex multi-site installations</li>
                      <li>• Custom utility contracts</li>
                      <li>• Renewable energy integration</li>
                      <li>• Real-time pricing structures</li>
                      <li>• Power quality penalty calculations</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides energy cost estimates based on standard utility rate structures and typical system efficiencies. 
                  Actual costs may vary ±10-20% due to rate changes, seasonal adjustments, power quality factors, 
                  and operational variations. Always validate with actual utility bills for critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnergyCostFormulaExplanation;
