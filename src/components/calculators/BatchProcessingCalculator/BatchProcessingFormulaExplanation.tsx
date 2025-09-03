import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const BatchProcessingFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Batch Size</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">B</td>
                      <td className="border border-gray-300 px-3 py-2">units</td>
                      <td className="border border-gray-300 px-3 py-2">Number of parts processed in one batch</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Setup Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">S</td>
                      <td className="border border-gray-300 px-3 py-2">min</td>
                      <td className="border border-gray-300 px-3 py-2">Time required to setup for each batch</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Processing Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P</td>
                      <td className="border border-gray-300 px-3 py-2">min/unit</td>
                      <td className="border border-gray-300 px-3 py-2">Time to process one unit</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Changeover Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C</td>
                      <td className="border border-gray-300 px-3 py-2">min</td>
                      <td className="border border-gray-300 px-3 py-2">Time to change between different materials/parts</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Batch Efficiency</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">E</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Ratio of productive time to total time</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Total Quantity</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">Q</td>
                      <td className="border border-gray-300 px-3 py-2">units</td>
                      <td className="border border-gray-300 px-3 py-2">Total number of parts to be produced</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Batch Processing Optimization Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Number of Batches</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    N_batches = ⌈Q / B⌉
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Ceiling function ensures all parts are included in batches
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Total Processing Time</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    T_process = Q × P
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Pure processing time without setup or changeover
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Total Setup Time</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    T_setup = N_batches × S
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Setup time required for all batches
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Total Changeover Time</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    T_changeover = (N_materials - 1) × C
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Time for material/part type changes between batches
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Batch Efficiency</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    E = T_process / (T_process + T_setup + T_changeover) × 100%
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Percentage of time spent on actual production
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Optimal Batch Size</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    B_optimal = √(2 × Q × S / H)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Economic Order Quantity (EOQ) model adapted for batch processing, where H = holding cost per unit
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
                    <li>• ISO 9001 - Quality management systems</li>
                    <li>• ANSI/ISA-95 - Manufacturing operations management</li>
                    <li>• NIST Manufacturing Extension Partnership</li>
                    <li>• Lean Manufacturing Institute guidelines</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Optimization Theory</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Economic Order Quantity (EOQ) models</li>
                    <li>• Operations research methodologies</li>
                    <li>• Production scheduling algorithms</li>
                    <li>• Batch sizing optimization theory</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing productivity studies</li>
                    <li>• Laser cutting industry reports</li>
                    <li>• Setup time reduction case studies</li>
                    <li>• Efficiency improvement benchmarks</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Production floor time studies</li>
                    <li>• Batch processing case studies</li>
                    <li>• Efficiency measurement data</li>
                    <li>• Cost-benefit analysis results</li>
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
                      <li>• Repetitive production runs</li>
                      <li>• Multiple part types and materials</li>
                      <li>• Setup-intensive operations</li>
                      <li>• Medium to high volume production</li>
                      <li>• Cost-sensitive manufacturing</li>
                      <li>• Efficiency optimization projects</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate setup time measurements</li>
                      <li>• Consistent processing times</li>
                      <li>• Known changeover requirements</li>
                      <li>• Clear production priorities</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Assumes consistent processing times</li>
                      <li>• Does not account for machine breakdowns</li>
                      <li>• Limited to single-machine scenarios</li>
                      <li>• Simplified inventory cost model</li>
                      <li>• Does not consider quality variations</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• One-off or prototype production</li>
                      <li>• Highly variable processing times</li>
                      <li>• Complex multi-machine workflows</li>
                      <li>• Just-in-time production systems</li>
                      <li>• Real-time adaptive scheduling</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides theoretical batch optimization based on simplified production models. 
                  Actual efficiency improvements may vary ±10-15% due to operational variations, quality issues, 
                  and unforeseen delays. Always validate results with pilot runs for critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BatchProcessingFormulaExplanation;
