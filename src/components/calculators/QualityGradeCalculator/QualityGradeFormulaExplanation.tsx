import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const QualityGradeFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Surface Roughness</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">Ra</td>
                      <td className="border border-gray-300 px-3 py-2">μm</td>
                      <td className="border border-gray-300 px-3 py-2">Average surface roughness of cut edge</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Perpendicularity</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">u</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Deviation from perpendicular cut edge</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Dross Height</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">h</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Height of dross attachment on cut edge</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Heat Affected Zone</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">HAZ</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Width of heat affected zone</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Quality Grade</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">Q</td>
                      <td className="border border-gray-300 px-3 py-2">1-5</td>
                      <td className="border border-gray-300 px-3 py-2">ISO 9013 quality classification</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Kerf Width</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">K</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Width of material removed by laser</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Quality Grade Prediction Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Surface Roughness Prediction</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Ra = k₁ × (P/v)^α × t^β × f(material, gas)
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Where P = power, v = speed, t = thickness, k₁, α, β are material constants
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Perpendicularity Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    u = k₂ × (v/P) × t² × beam_quality_factor
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Perpendicularity increases with speed and thickness, decreases with power
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Dross Formation Assessment</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    h = max(0, k₃ × (P×v/t) - threshold) × gas_factor
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Dross formation depends on energy density and gas type
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Heat Affected Zone Width</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    HAZ = k₄ × √(P/(v × ρ × c)) × thermal_diffusivity
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    HAZ width based on thermal diffusion model
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Quality Grade Classification</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Q = f(Ra, u, h, HAZ) according to ISO 9013 limits
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Grade 1 (poorest) to Grade 5 (best) based on measured parameters
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Overall Quality Score</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Score = w₁×Ra_score + w₂×u_score + w₃×h_score + w₄×HAZ_score
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Weighted composite score (0-100) combining all quality metrics
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
                  <h5 className="font-medium mb-2">Quality Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• ISO 9013 - Thermal cutting quality classification</li>
                    <li>• ANSI/AWS C7.1 - Laser cutting guidelines</li>
                    <li>• DIN 2310 - Thermal cutting tolerances</li>
                    <li>• ASTM F1108 - Laser cutting standards</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Research Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Surface roughness measurement studies</li>
                    <li>• Laser cutting quality databases</li>
                    <li>• Material-specific cutting parameters</li>
                    <li>• Process optimization research</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing quality standards</li>
                    <li>• Laser system performance data</li>
                    <li>• Quality control best practices</li>
                    <li>• Production quality metrics</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Validation Studies</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Experimental cutting trials</li>
                    <li>• Quality prediction model validation</li>
                    <li>• Statistical analysis of cut quality</li>
                    <li>• Cross-validation with measurements</li>
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
                      <li>• CO₂ and fiber laser cutting</li>
                      <li>• Common metals (steel, stainless, aluminum)</li>
                      <li>• Thickness range: 0.5-25mm</li>
                      <li>• Standard cutting gases (O₂, N₂, air)</li>
                      <li>• Production quality assessment</li>
                      <li>• Process parameter optimization</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Stable laser parameters</li>
                      <li>• Known material properties</li>
                      <li>• Consistent gas supply</li>
                      <li>• Proper machine maintenance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Empirical model with material variations</li>
                      <li>• Does not account for machine wear</li>
                      <li>• Limited to straight cuts</li>
                      <li>• Assumes optimal focus position</li>
                      <li>• Does not predict microstructure changes</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Exotic materials or alloys</li>
                      <li>• Extreme thickness ranges (&lt;0.5mm, &gt;25mm)</li>
                      <li>• Complex 3D cutting geometries</li>
                      <li>• Pulsed laser applications</li>
                      <li>• Non-standard gas mixtures</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides quality predictions based on empirical models and industry data. 
                  Actual quality may vary ±15-25% due to machine variations, material inconsistencies, 
                  and environmental factors. Always validate with test cuts for critical applications.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QualityGradeFormulaExplanation;
