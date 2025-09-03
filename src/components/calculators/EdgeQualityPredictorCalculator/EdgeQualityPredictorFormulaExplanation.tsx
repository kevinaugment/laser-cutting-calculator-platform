import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const EdgeQualityPredictorFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Material Thickness</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">t</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Thickness of material being cut</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Laser Power</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">P</td>
                      <td className="border border-gray-300 px-3 py-2">W</td>
                      <td className="border border-gray-300 px-3 py-2">Laser output power at the workpiece</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cutting Speed</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">v</td>
                      <td className="border border-gray-300 px-3 py-2">mm/min</td>
                      <td className="border border-gray-300 px-3 py-2">Linear cutting speed of the laser head</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Gas Pressure</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">p_g</td>
                      <td className="border border-gray-300 px-3 py-2">bar</td>
                      <td className="border border-gray-300 px-3 py-2">Assist gas pressure at the nozzle</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Beam Quality</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">M²</td>
                      <td className="border border-gray-300 px-3 py-2">-</td>
                      <td className="border border-gray-300 px-3 py-2">Beam quality factor (1.0 = perfect Gaussian beam)</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Focus Position</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">f_pos</td>
                      <td className="border border-gray-300 px-3 py-2">mm</td>
                      <td className="border border-gray-300 px-3 py-2">Focus position relative to material surface</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Edge Quality Prediction Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Power Density Calculation</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    I = P / (π × (d/2)²) × M²_factor
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Calculate laser power density at the focus point
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Heat Input Parameter</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    HI = P / (v × t) × efficiency_factor
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Calculate specific heat input per unit volume
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Gas Flow Effectiveness</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    GFE = (p_g × A_nozzle) / (ρ × v_gas) × flow_coefficient
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Evaluate assist gas effectiveness for melt removal
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Thermal Gradient Factor</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    TGF = (k × ΔT) / (t × α) × material_factor
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Calculate thermal gradient effects on edge formation
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. Edge Roughness Prediction</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Ra = base_roughness × (HI_factor + GFE_factor + TGF_factor)
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Predict surface roughness based on process parameters
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Quality Grade Assessment</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    QG = f(Ra, perpendicularity, dross_formation, HAZ_width)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Overall quality grade based on multiple edge characteristics
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
                    <li>• DIN EN ISO 9013 - Edge quality requirements</li>
                    <li>• ANSI/AWS C7.1 - Laser cutting quality standards</li>
                    <li>• JIS B 0417 - Surface roughness measurement</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Research Data</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Laser cutting process optimization studies</li>
                    <li>• Material-specific cutting parameter databases</li>
                    <li>• Edge quality correlation research</li>
                    <li>• Industrial cutting quality benchmarks</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Measurement Methods</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Surface roughness measurement standards</li>
                    <li>• Perpendicularity measurement protocols</li>
                    <li>• Dross formation assessment criteria</li>
                    <li>• Heat-affected zone measurement methods</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Process Models</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Thermal modeling of laser cutting</li>
                    <li>• Fluid dynamics of assist gas flow</li>
                    <li>• Material removal mechanisms</li>
                    <li>• Edge formation physics models</li>
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
                      <li>• Standard industrial materials (steel, stainless, aluminum)</li>
                      <li>• Material thickness 0.5-25mm</li>
                      <li>• Continuous wave and pulsed cutting modes</li>
                      <li>• Standard assist gases (O₂, N₂, air)</li>
                      <li>• Production and prototype cutting</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Calibrated laser systems</li>
                      <li>• Known material properties</li>
                      <li>• Stable cutting conditions</li>
                      <li>• Proper beam alignment</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on ideal cutting conditions</li>
                      <li>• Does not account for machine wear</li>
                      <li>• Limited to standard material grades</li>
                      <li>• Assumes consistent material properties</li>
                      <li>• Does not predict catastrophic failures</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Plasma or waterjet cutting</li>
                      <li>• Exotic or composite materials</li>
                      <li>• Extremely thick materials (&gt;25mm)</li>
                      <li>• Research or experimental setups</li>
                      <li>• Severely degraded equipment</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This predictor provides edge quality estimates based on established cutting theory and empirical data. 
                  Actual results may vary ±15-25% due to machine condition, material variations, 
                  and environmental factors. Regular validation with actual measurements is recommended for optimal accuracy.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EdgeQualityPredictorFormulaExplanation;
