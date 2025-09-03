import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const EquipmentComparisonFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Purchase Price</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P_purchase</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Initial equipment purchase cost including installation</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Operating Hours</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">H_op</td>
                      <td className="border border-gray-300 px-3 py-2">hrs/year</td>
                      <td className="border border-gray-300 px-3 py-2">Annual operating hours for the equipment</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Laser Power</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P_laser</td>
                      <td className="border border-gray-300 px-3 py-2">W</td>
                      <td className="border border-gray-300 px-3 py-2">Rated laser power output of the equipment</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Productivity Rate</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R_prod</td>
                      <td className="border border-gray-300 px-3 py-2">parts/hr</td>
                      <td className="border border-gray-300 px-3 py-2">Average production rate for typical parts</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Maintenance Cost</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_maint</td>
                      <td className="border border-gray-300 px-3 py-2">$/year</td>
                      <td className="border border-gray-300 px-3 py-2">Annual maintenance and service costs</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Energy Consumption</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">E_cons</td>
                      <td className="border border-gray-300 px-3 py-2">kW</td>
                      <td className="border border-gray-300 px-3 py-2">Total power consumption during operation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Equipment Comparison Analysis Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Total Cost of Ownership (TCO)</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    TCO = P_purchase + (C_maint × years) + (E_cons × H_op × rate × years)
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Complete ownership cost over equipment lifecycle
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Productivity Score</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    PS = (R_prod × H_op × quality_factor) / benchmark_productivity
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Normalized productivity rating compared to benchmark
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Cost per Part</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    CPP = (TCO / lifecycle_years) / (R_prod × H_op)
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Average cost per part produced over equipment lifecycle
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Return on Investment (ROI)</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    ROI = ((revenue_per_year - operating_costs) × years - P_purchase) / P_purchase
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Financial return percentage over investment period
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Weighted Score</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    WS = (TCO_score × w1) + (PS × w2) + (quality_score × w3) + (service_score × w4)
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Overall equipment rating based on weighted criteria
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Payback Period</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    PP = P_purchase / (annual_savings + annual_profit)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Time required to recover initial investment
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
                  <h5 className="font-medium mb-2">Financial Analysis Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• GAAP accounting principles</li>
                    <li>• NPV and IRR calculation methods</li>
                    <li>• Equipment depreciation schedules</li>
                    <li>• Total cost of ownership models</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing equipment productivity data</li>
                    <li>• Laser system performance benchmarks</li>
                    <li>• Industry maintenance cost averages</li>
                    <li>• Equipment lifecycle studies</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Technical Specifications</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturer performance data</li>
                    <li>• Power consumption specifications</li>
                    <li>• Reliability and uptime statistics</li>
                    <li>• Service and support metrics</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Market Analysis</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Equipment pricing trends</li>
                    <li>• Technology advancement rates</li>
                    <li>• Competitive analysis data</li>
                    <li>• Market demand forecasts</li>
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
                      <li>• New equipment purchase decisions</li>
                      <li>• Equipment upgrade evaluations</li>
                      <li>• Lease vs. buy analysis</li>
                      <li>• Multi-vendor comparisons</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate cost data from vendors</li>
                      <li>• Known production requirements</li>
                      <li>• Clear evaluation criteria</li>
                      <li>• Realistic operating assumptions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on vendor-provided specifications</li>
                      <li>• Does not account for market volatility</li>
                      <li>• Assumes consistent operating conditions</li>
                      <li>• Limited to quantifiable factors</li>
                      <li>• Does not include strategic considerations</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Used equipment evaluations</li>
                      <li>• Highly customized systems</li>
                      <li>• Research and development equipment</li>
                      <li>• Single-vendor situations</li>
                      <li>• Non-financial decision factors only</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This comparison tool provides equipment evaluation based on financial and technical criteria. 
                  Results accuracy depends on input data quality and may vary ±10-20% from actual performance. 
                  Consider qualitative factors and conduct site visits before making final decisions.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EquipmentComparisonFormulaExplanation;
