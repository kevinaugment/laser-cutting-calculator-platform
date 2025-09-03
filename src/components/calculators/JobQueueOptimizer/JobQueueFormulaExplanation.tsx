import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const JobQueueFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Makespan</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">C_max</td>
                      <td className="border border-gray-300 px-3 py-2">hours</td>
                      <td className="border border-gray-300 px-3 py-2">Total time to complete all jobs</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Processing Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">p_ij</td>
                      <td className="border border-gray-300 px-3 py-2">minutes</td>
                      <td className="border border-gray-300 px-3 py-2">Time for job i on machine j</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Setup Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">s_ij</td>
                      <td className="border border-gray-300 px-3 py-2">minutes</td>
                      <td className="border border-gray-300 px-3 py-2">Setup time for job i on machine j</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Due Date</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">d_i</td>
                      <td className="border border-gray-300 px-3 py-2">datetime</td>
                      <td className="border border-gray-300 px-3 py-2">Due date for job i</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Priority Weight</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">w_i</td>
                      <td className="border border-gray-300 px-3 py-2">-</td>
                      <td className="border border-gray-300 px-3 py-2">Priority weight for job i</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Machine Utilization</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">U_j</td>
                      <td className="border border-gray-300 px-3 py-2">%</td>
                      <td className="border border-gray-300 px-3 py-2">Utilization rate of machine j</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Job Queue Optimization Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Priority Score Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    PS_i = w_p × P_i + w_u × U_i + w_c × C_i + w_m × M_i
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Where P_i = priority, U_i = urgency, C_i = customer importance, M_i = profit margin
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Machine Assignment</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    M_opt = argmin(p_ij + s_ij) subject to constraints
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Assign job to machine with minimum total processing time
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Makespan Minimization</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    C_max = max(C_j) for all machines j
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Minimize the maximum completion time across all machines
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Tardiness Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    T_i = max(0, C_i - d_i)
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Calculate lateness penalty for each job
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Resource Utilization</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    U_j = (Σ p_ij + Σ s_ij) / T_available × 100%
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Calculate utilization rate for each machine
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Multi-Objective Optimization</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    min(α × C_max + β × Σ T_i + γ × Cost)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Weighted combination of makespan, tardiness, and cost objectives
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
                  <h5 className="font-medium mb-2">Scheduling Theory</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Operations Research literature</li>
                    <li>• Job shop scheduling algorithms</li>
                    <li>• Multi-objective optimization methods</li>
                    <li>• Heuristic and metaheuristic approaches</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing execution systems (MES)</li>
                    <li>• Lean manufacturing principles</li>
                    <li>• Theory of Constraints (TOC)</li>
                    <li>• Six Sigma methodologies</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Performance Metrics</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing KPI benchmarks</li>
                    <li>• OEE (Overall Equipment Effectiveness)</li>
                    <li>• Throughput and cycle time studies</li>
                    <li>• Customer satisfaction metrics</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing case studies</li>
                    <li>• Production scheduling benchmarks</li>
                    <li>• Real-world implementation results</li>
                    <li>• Academic research validation</li>
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
                      <li>• Job shop and flow shop scheduling</li>
                      <li>• Multi-machine production environments</li>
                      <li>• Batch and discrete manufacturing</li>
                      <li>• Make-to-order production systems</li>
                      <li>• Resource-constrained scheduling</li>
                      <li>• Multi-objective optimization scenarios</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate job processing times</li>
                      <li>• Clear priority definitions</li>
                      <li>• Known machine capabilities</li>
                      <li>• Defined resource constraints</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Assumes deterministic processing times</li>
                      <li>• Limited to finite capacity scheduling</li>
                      <li>• Does not account for machine breakdowns</li>
                      <li>• Simplified setup time modeling</li>
                      <li>• Static optimization (no real-time updates)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Continuous process manufacturing</li>
                      <li>• Highly stochastic environments</li>
                      <li>• Real-time dynamic scheduling</li>
                      <li>• Complex assembly operations</li>
                      <li>• Multi-site production networks</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This optimizer provides scheduling recommendations based on established operations research algorithms and manufacturing best practices. 
                  Actual performance may vary ±10-25% due to unforeseen disruptions, processing time variations, 
                  and dynamic changes in priorities. Always validate with pilot implementations and continuous monitoring.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default JobQueueFormulaExplanation;
