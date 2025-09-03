import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const ProductionCapacityFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Theoretical Capacity</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_theo</td>
                      <td className="border border-gray-300 px-3 py-2">units/time</td>
                      <td className="border border-gray-300 px-3 py-2">Maximum possible production under ideal conditions</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Effective Capacity</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_eff</td>
                      <td className="border border-gray-300 px-3 py-2">units/time</td>
                      <td className="border border-gray-300 px-3 py-2">Realistic production considering efficiency factors</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Machine Efficiency</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">E</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Overall equipment effectiveness (OEE)</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Utilization Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">U</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Percentage of capacity actually used</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cycle Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">T_cycle</td>
                      <td className="border border-gray-300 px-3 py-2">min/unit</td>
                      <td className="border border-gray-300 px-3 py-2">Total time to complete one unit including setup</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Available Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">T_avail</td>
                      <td className="border border-gray-300 px-3 py-2">hours</td>
                      <td className="border border-gray-300 px-3 py-2">Total operational time available per period</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Production Capacity Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Available Operating Time</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    T_avail = Hours/Day × Days/Week × Weeks/Period × Machine_Count
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Total time available for production across all machines
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Theoretical Capacity</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_theo = T_avail / T_cycle
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Maximum units possible if running at 100% efficiency
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Effective Capacity</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_eff = C_theo × E × Availability_Factor
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Realistic capacity considering efficiency and downtime
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Capacity Utilization</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    U = Actual_Output / C_eff × 100%
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Percentage of effective capacity being utilized
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Bottleneck Analysis</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Bottleneck = min(Machine_Capacity, Labor_Capacity, Material_Flow)
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    System capacity limited by the weakest constraint
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Capacity Gap Analysis</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Gap = Demand_Forecast - C_eff
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Difference between required and available capacity
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
                  <h5 className="font-medium mb-2">Manufacturing Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ISO 22400 - Manufacturing operations management KPIs</li>
                    <li>• ANSI/ISA-95 - Enterprise-control system integration</li>
                    <li>• SEMI E10 - Equipment reliability, availability, maintainability</li>
                    <li>• NIST Manufacturing USA guidelines</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Capacity Planning Theory</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Theory of Constraints (TOC) methodology</li>
                    <li>• Overall Equipment Effectiveness (OEE) standards</li>
                    <li>• Capacity requirements planning (CRP)</li>
                    <li>• Rough-cut capacity planning (RCCP)</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing productivity studies</li>
                    <li>• Equipment utilization benchmarks</li>
                    <li>• Capacity planning best practices</li>
                    <li>• Industry-specific efficiency standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Production floor measurements</li>
                    <li>• Historical capacity utilization data</li>
                    <li>• Bottleneck analysis case studies</li>
                    <li>• Capacity expansion ROI studies</li>
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
                      <li>• Manufacturing operations planning</li>
                      <li>• Equipment capacity analysis</li>
                      <li>• Resource allocation decisions</li>
                      <li>• Bottleneck identification</li>
                      <li>• Capacity expansion planning</li>
                      <li>• Production scheduling optimization</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate historical production data</li>
                      <li>• Known equipment efficiency rates</li>
                      <li>• Reliable demand forecasts</li>
                      <li>• Clear operational constraints</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Assumes steady-state operations</li>
                      <li>• Does not account for learning curves</li>
                      <li>• Simplified bottleneck analysis</li>
                      <li>• Limited to single-product scenarios</li>
                      <li>• Does not consider quality variations</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Highly variable production processes</li>
                      <li>• Complex multi-product mix scenarios</li>
                      <li>• Service industry capacity planning</li>
                      <li>• Project-based manufacturing</li>
                      <li>• Real-time dynamic scheduling</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides theoretical capacity analysis based on simplified production models. 
                  Actual capacity may vary ±15-25% due to operational variations, market fluctuations, 
                  and unforeseen constraints. Always validate results with historical data and pilot studies.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductionCapacityFormulaExplanation;
