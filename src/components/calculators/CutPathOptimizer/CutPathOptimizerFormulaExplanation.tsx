import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const CutPathOptimizerFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cutting Speed</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">V_cut</td>
                      <td className="border border-gray-300 px-3 py-2">mm/min</td>
                      <td className="border border-gray-300 px-3 py-2">Speed of laser cutting through material</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Rapid Speed</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">V_rapid</td>
                      <td className="border border-gray-300 px-3 py-2">mm/min</td>
                      <td className="border border-gray-300 px-3 py-2">Speed of non-cutting movements</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cut Length</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">L_cut</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Total length of cutting paths</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Travel Distance</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">L_travel</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Total distance of rapid movements</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Pierce Time</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">T_pierce</td>
                      <td className="border border-gray-300 px-3 py-2">s</td>
                      <td className="border border-gray-300 px-3 py-2">Time required for each pierce operation</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Number of Pierces</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">N_pierce</td>
                      <td className="border border-gray-300 px-3 py-2">count</td>
                      <td className="border border-gray-300 px-3 py-2">Total number of pierce operations required</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Cut Path Optimization Analysis Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Total Cutting Time</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    T_total = (L_cut / V_cut) + (L_travel / V_rapid) + (N_pierce × T_pierce)
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Complete time including cutting, travel, and pierce operations
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Path Efficiency</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    E_path = L_cut / (L_cut + L_travel) × 100%
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Percentage of productive cutting vs. non-productive travel
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Thermal Load Distribution</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    TLD = Σ(Heat_input × Time_interval) / Area_affected
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Heat distribution across the material during cutting
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Optimization Score</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    OS = (w1 × E_path) + (w2 × Q_score) + (w3 × T_efficiency)
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Weighted score combining efficiency, quality, and time factors
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Travel Distance Optimization</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    L_optimal = min(Σ distance(feature_i, feature_j))
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Minimum total travel distance using optimization algorithms
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Quality Impact Factor</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    QIF = (1 - thermal_stress_factor) × (1 - distortion_factor)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Quality degradation due to thermal effects and distortion
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
                  <h5 className="font-medium mb-2">Optimization Algorithms</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Traveling Salesman Problem (TSP) solutions</li>
                    <li>• Genetic algorithm optimization</li>
                    <li>• Simulated annealing methods</li>
                    <li>• Nearest neighbor heuristics</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Manufacturing Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ISO 9013 cutting quality standards</li>
                    <li>• ANSI/AWS cutting specifications</li>
                    <li>• Industry thermal management practices</li>
                    <li>• CNC programming standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Thermal Analysis</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Heat transfer coefficient data</li>
                    <li>• Material thermal properties</li>
                    <li>• Cooling rate calculations</li>
                    <li>• Distortion prediction models</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Performance Metrics</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Industry productivity benchmarks</li>
                    <li>• Quality measurement standards</li>
                    <li>• Efficiency calculation methods</li>
                    <li>• Cost optimization models</li>
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
                      <li>• 2D laser cutting operations</li>
                      <li>• Sheet metal fabrication</li>
                      <li>• Multiple part nesting layouts</li>
                      <li>• Production optimization</li>
                      <li>• CNC programming assistance</li>
                      <li>• Quality improvement projects</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate part geometry data</li>
                      <li>• Known material properties</li>
                      <li>• Defined quality requirements</li>
                      <li>• Realistic cutting parameters</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on 2D cutting paths only</li>
                      <li>• Does not account for machine-specific constraints</li>
                      <li>• Assumes uniform material properties</li>
                      <li>• Limited to single-sheet operations</li>
                      <li>• Does not include setup time variations</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• 3D cutting operations</li>
                      <li>• Tube and pipe cutting</li>
                      <li>• Multi-axis machining</li>
                      <li>• Welding path optimization</li>
                      <li>• Non-laser cutting processes</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This optimization tool provides path analysis based on geometric and thermal considerations. 
                  Results accuracy depends on input data quality and may vary ±5-15% from actual performance. 
                  Consider machine-specific factors and conduct test cuts for critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CutPathOptimizerFormulaExplanation;
