import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const CuttingTimeFormulaExplanation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('variables');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Formula Explanation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
            <TabsTrigger value="data">Data Sources</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
          </TabsList>

          <TabsContent value="variables" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Input Variables</h4>
              
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">L</Badge>
                  <div>
                    <p className="font-medium">Total Cut Length (mm)</p>
                    <p className="text-sm text-gray-600">Sum of all cutting paths in the part geometry</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">V</Badge>
                  <div>
                    <p className="font-medium">Cutting Speed (mm/min)</p>
                    <p className="text-sm text-gray-600">Feed rate of the laser head during cutting</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">N</Badge>
                  <div>
                    <p className="font-medium">Pierce Count</p>
                    <p className="text-sm text-gray-600">Number of pierce points required for the part</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">Tp</Badge>
                  <div>
                    <p className="font-medium">Pierce Time (seconds)</p>
                    <p className="text-sm text-gray-600">Time required to pierce through material at each point</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">Ts</Badge>
                  <div>
                    <p className="font-medium">Setup Time (minutes)</p>
                    <p className="text-sm text-gray-600">Time for material loading, fixturing, and preparation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Modifier Variables</h4>
              
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">Kc</Badge>
                  <div>
                    <p className="font-medium">Complexity Factor</p>
                    <p className="text-sm text-gray-600">Simple: 1.0, Medium: 1.2, Complex: 1.5</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">Kq</Badge>
                  <div>
                    <p className="font-medium">Quality Factor</p>
                    <p className="text-sm text-gray-600">Fast: 0.8, Standard: 1.0, High: 1.3</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Primary Time Calculation</h4>
                <div className="font-mono text-sm bg-white p-3 rounded border">
                  <p><strong>Cutting Time (minutes):</strong></p>
                  <p>Tc = (L / V) × Kc × Kq</p>
                  <br />
                  <p><strong>Pierce Time (minutes):</strong></p>
                  <p>Tpierce = (N × Tp) / 60</p>
                  <br />
                  <p><strong>Positioning Time (minutes):</strong></p>
                  <p>Tpos = (N × 0.5) / 60</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Total Process Time</h4>
                <div className="font-mono text-sm bg-white p-3 rounded border">
                  <p><strong>Total Time:</strong></p>
                  <p>Ttotal = Tc + Tpierce + Tpos + Ts</p>
                  <br />
                  <p><strong>Process Efficiency:</strong></p>
                  <p>Efficiency = (Tc / Ttotal) × 100%</p>
                  <br />
                  <p><strong>Throughput:</strong></p>
                  <p>Throughput = Quantity / (Ttotal / 60) parts/hour</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Modifier Calculations</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Complexity Factor (Kc):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Simple geometry (straight cuts): 1.0</li>
                    <li>Medium complexity (curves, corners): 1.2</li>
                    <li>Complex geometry (intricate patterns): 1.5</li>
                  </ul>
                  
                  <p><strong>Quality Factor (Kq):</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Fast cutting (production priority): 0.8</li>
                    <li>Standard quality (balanced): 1.0</li>
                    <li>High quality (precision priority): 1.3</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Material Database Sources
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-0">NIST:</span>
                    <span>Material properties and thermal characteristics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-0">ISO 9013:</span>
                    <span>Thermal cutting quality standards and classifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-0">AWS D17.1:</span>
                    <span>Specification for fusion welding for aerospace applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-0">Industry Data:</span>
                    <span>Empirical data from laser cutting manufacturers</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Cutting Speed References</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Common Materials:</p>
                    <ul className="space-y-1">
                      <li>Mild Steel: 3000 mm/min</li>
                      <li>Stainless Steel: 2500 mm/min</li>
                      <li>Aluminum: 4000 mm/min</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Specialty Materials:</p>
                    <ul className="space-y-1">
                      <li>Copper: 2000 mm/min</li>
                      <li>Titanium: 1500 mm/min</li>
                      <li>Brass: 2800 mm/min</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Pierce Time Standards</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Gas Type Impact:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Oxygen: 0.8 seconds (fastest, reactive cutting)</li>
                    <li>Compressed Air: 1.0 seconds (balanced performance)</li>
                    <li>Nitrogen: 1.2 seconds (clean cutting, no oxidation)</li>
                    <li>Argon: 1.5 seconds (specialty applications)</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scope" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Calculator Scope
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 2D laser cutting time estimation</li>
                  <li>• Material thickness: 0.1mm to 50mm</li>
                  <li>• Laser power: 500W to 15,000W</li>
                  <li>• Common industrial materials</li>
                  <li>• Standard assist gas types</li>
                  <li>• Production batch calculations</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Limitations</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Estimates based on standard operating conditions</li>
                  <li>• Does not account for machine-specific variations</li>
                  <li>• Assumes optimal laser parameters</li>
                  <li>• Material quality variations not considered</li>
                  <li>• Environmental factors not included</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Accuracy Range</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Typical accuracy: ±15% for standard materials</li>
                  <li>• Best case: ±10% for well-characterized processes</li>
                  <li>• Complex geometries: ±20% due to path optimization</li>
                  <li>• New materials: ±25% until process optimization</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CuttingTimeFormulaExplanation;
