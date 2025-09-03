import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const MaintenanceCostFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Equipment Value</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">V_eq</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Initial purchase value of laser cutting equipment</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Operating Hours</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">H_op</td>
                      <td className="border border-gray-300 px-3 py-2">hrs/year</td>
                      <td className="border border-gray-300 px-3 py-2">Annual operating hours of the equipment</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Labor Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R_labor</td>
                      <td className="border border-gray-300 px-3 py-2">$/hr</td>
                      <td className="border border-gray-300 px-3 py-2">Hourly rate for maintenance technicians</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Downtime Cost Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R_down</td>
                      <td className="border border-gray-300 px-3 py-2">$/hr</td>
                      <td className="border border-gray-300 px-3 py-2">Cost per hour of equipment downtime</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Maintenance Factor</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">F_maint</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Annual maintenance cost as percentage of equipment value</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Equipment Age</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">A_eq</td>
                      <td className="border border-gray-300 px-3 py-2">years</td>
                      <td className="border border-gray-300 px-3 py-2">Age of equipment since installation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Maintenance Cost Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Planned Maintenance Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_planned = (V_eq × F_maint) + (H_planned × R_labor)
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Cost of scheduled preventive maintenance activities
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Unplanned Maintenance Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_unplanned = (H_unplanned × R_labor) + (Parts_cost × Failure_rate)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Cost of reactive maintenance and emergency repairs
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Downtime Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_downtime = (H_planned + H_unplanned) × R_down
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Lost production value during maintenance periods
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Age-Related Adjustment</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Age_factor = 1 + (A_eq × 0.05)
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Adjustment factor for increasing maintenance costs with age
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Total Annual Maintenance Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_total = (C_planned + C_unplanned + C_downtime) × Age_factor
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Complete annual maintenance cost including all factors
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Cost per Operating Hour</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_per_hour = C_total / H_op
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Maintenance cost allocated per hour of operation
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
                  <h5 className="font-medium mb-2">Maintenance Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ISO 14224 - Reliability data collection</li>
                    <li>• ANSI/ISA-18.2 - Management of alarm systems</li>
                    <li>• IEC 60300 - Dependability management</li>
                    <li>• NFPA 79 - Electrical standard for industrial machinery</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing equipment maintenance costs</li>
                    <li>• Laser system reliability databases</li>
                    <li>• Preventive maintenance scheduling guides</li>
                    <li>• Equipment lifecycle cost studies</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Cost Analysis Methods</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Life cycle cost analysis (LCCA)</li>
                    <li>• Total cost of ownership (TCO)</li>
                    <li>• Reliability-centered maintenance (RCM)</li>
                    <li>• Condition-based maintenance (CBM)</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Economic Factors</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Labor rate surveys and trends</li>
                    <li>• Equipment depreciation schedules</li>
                    <li>• Downtime cost calculations</li>
                    <li>• Spare parts inventory optimization</li>
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
                      <li>• Industrial manufacturing equipment</li>
                      <li>• Production and job shop operations</li>
                      <li>• Equipment age 1-20 years</li>
                      <li>• Single and multi-head systems</li>
                      <li>• Automated and manual operations</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate equipment purchase records</li>
                      <li>• Historical maintenance data</li>
                      <li>• Known operating schedules</li>
                      <li>• Established maintenance procedures</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on historical cost patterns</li>
                      <li>• Does not predict catastrophic failures</li>
                      <li>• Assumes consistent operating conditions</li>
                      <li>• Limited to standard maintenance practices</li>
                      <li>• Does not include facility overhead costs</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Brand new equipment without history</li>
                      <li>• Highly experimental systems</li>
                      <li>• Equipment with major modifications</li>
                      <li>• Extreme operating environments</li>
                      <li>• Research and development applications</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides maintenance cost estimates based on industry standards and historical data patterns. 
                  Actual costs may vary ±20-30% due to equipment condition, operating environment, 
                  and maintenance strategy variations. Regular validation against actual costs is recommended for optimal accuracy.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCostFormulaExplanation;
