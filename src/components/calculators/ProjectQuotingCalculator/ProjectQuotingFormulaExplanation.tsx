import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const ProjectQuotingFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Direct Material Cost</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_m</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Raw material costs including waste allowance</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Direct Labor Cost</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_l</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Labor costs including setup and processing time</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Machine Operating Cost</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_o</td>
                      <td className="border border-gray-300 px-3 py-2">$/hr</td>
                      <td className="border border-gray-300 px-3 py-2">Machine hourly operating cost including depreciation</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Overhead Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R_oh</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Overhead allocation rate as percentage of direct costs</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Profit Margin</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">M_p</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Target profit margin percentage</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Risk Factor</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R_f</td>
                      <td className="border border-gray-300 px-3 py-2">-</td>
                      <td className="border border-gray-300 px-3 py-2">Risk multiplier based on project complexity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Project Quoting Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Direct Cost Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_direct = C_m + C_l + (C_o × T_machine)
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Sum of material, labor, and machine operating costs
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Overhead Allocation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_overhead = C_direct × (R_oh / 100)
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Overhead costs allocated based on direct cost percentage
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Total Project Cost</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_total = (C_direct + C_overhead) × R_f
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Total cost including risk factor adjustment
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Profit Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    P_target = C_total × (M_p / (100 - M_p))
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Target profit based on desired margin percentage
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Final Quote Price</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    P_quote = C_total + P_target + C_contingency
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Final quoted price including contingency allowance
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Competitive Analysis</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    P_competitive = P_quote × (1 ± adjustment_factor)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Price adjustment based on market conditions and competition
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
                  <h5 className="font-medium mb-2">Cost Accounting Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• GAAP cost accounting principles</li>
                    <li>• Activity-based costing methodologies</li>
                    <li>• Manufacturing cost allocation standards</li>
                    <li>• Project cost management guidelines</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing overhead rate studies</li>
                    <li>• Labor rate surveys and benchmarks</li>
                    <li>• Material cost databases</li>
                    <li>• Profit margin industry standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Risk Assessment</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Project risk evaluation frameworks</li>
                    <li>• Contingency planning methodologies</li>
                    <li>• Market volatility analysis</li>
                    <li>• Customer credit risk assessment</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Competitive Intelligence</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Market pricing analysis</li>
                    <li>• Competitor cost structure studies</li>
                    <li>• Value proposition benchmarking</li>
                    <li>• Win/loss analysis data</li>
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
                      <li>• Custom laser cutting projects</li>
                      <li>• Multi-part manufacturing orders</li>
                      <li>• Prototype and production runs</li>
                      <li>• Value-added services integration</li>
                      <li>• Complex material requirements</li>
                      <li>• Time-sensitive delivery projects</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Detailed project specifications</li>
                      <li>• Accurate material requirements</li>
                      <li>• Clear quality standards</li>
                      <li>• Defined delivery schedules</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on current cost structures</li>
                      <li>• Does not account for material price volatility</li>
                      <li>• Assumes standard quality requirements</li>
                      <li>• Limited to single-location production</li>
                      <li>• Does not include shipping/logistics costs</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Highly volatile material markets</li>
                      <li>• Multi-year contract pricing</li>
                      <li>• International projects with complex logistics</li>
                      <li>• Highly experimental or R&D projects</li>
                      <li>• Projects requiring specialized certifications</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides project cost estimates based on current market conditions and standard manufacturing processes. 
                  Actual costs may vary ±10-15% due to material price fluctuations, process variations, 
                  and unforeseen project complexities. Always validate quotes with detailed engineering analysis for critical projects.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectQuotingFormulaExplanation;
