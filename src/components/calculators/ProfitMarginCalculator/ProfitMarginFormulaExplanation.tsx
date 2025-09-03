import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Calculator, Database, Target } from 'lucide-react';

const ProfitMarginFormulaExplanation: React.FC = () => {
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
                      <td className="border border-gray-300 px-3 py-2 font-medium">Total Revenue</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">R</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Total sales revenue from all sources</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Cost of Goods Sold</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">COGS</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Direct costs of producing goods or services</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Operating Expenses</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">OpEx</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Indirect costs of running the business</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Interest & Taxes</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">I&T</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Interest expenses and tax obligations</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-3 py-2 font-medium">Fixed Costs</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">FC</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Costs that don't vary with production volume</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-3 py-2 font-medium">Variable Costs</td>
                      <td className="border border-gray-300 px-3 py-2 font-mono">VC</td>
                      <td className="border border-gray-300 px-3 py-2">$</td>
                      <td className="border border-gray-300 px-3 py-2">Costs that vary directly with production volume</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Profit Margin Calculation Steps</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">1. Gross Profit Margin</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Gross Margin % = ((R - COGS) / R) × 100
                  </div>
                  <p className="text-sm text-blue-800 mt-2">
                    Measures profitability after direct production costs
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">2. Operating Profit Margin</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Operating Margin % = ((R - COGS - OpEx) / R) × 100
                  </div>
                  <p className="text-sm text-green-800 mt-2">
                    Measures profitability after all operating expenses
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">3. Net Profit Margin</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Net Margin % = ((R - COGS - OpEx - I&T) / R) × 100
                  </div>
                  <p className="text-sm text-purple-800 mt-2">
                    Final profitability after all expenses and taxes
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-900 mb-2">4. Contribution Margin</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Contribution Margin % = ((R - VC) / R) × 100
                  </div>
                  <p className="text-sm text-orange-800 mt-2">
                    Contribution to covering fixed costs and profit
                  </p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-900 mb-2">5. EBITDA Margin</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    EBITDA Margin % = ((EBITDA) / R) × 100
                  </div>
                  <p className="text-sm text-red-800 mt-2">
                    Earnings before interest, taxes, depreciation, and amortization
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-900 mb-2">6. Break-Even Analysis</h5>
                  <div className="font-mono text-sm bg-white p-2 rounded border">
                    Break-Even Revenue = FC / (Contribution Margin %)
                  </div>
                  <p className="text-sm text-indigo-800 mt-2">
                    Revenue needed to cover all fixed costs
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
                  <h5 className="font-medium mb-2">Accounting Standards</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• GAAP financial reporting standards</li>
                    <li>• IFRS international accounting standards</li>
                    <li>• Management accounting principles</li>
                    <li>• Cost accounting methodologies</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Industry Benchmarks</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Manufacturing industry margin studies</li>
                    <li>• Small business profitability surveys</li>
                    <li>• Sector-specific performance metrics</li>
                    <li>• Economic research databases</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Financial Analysis</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Financial ratio analysis frameworks</li>
                    <li>• Profitability assessment models</li>
                    <li>• Break-even analysis methodologies</li>
                    <li>• Sensitivity analysis techniques</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Market Research</h5>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Competitive pricing analysis</li>
                    <li>• Market elasticity studies</li>
                    <li>• Customer value perception research</li>
                    <li>• Economic trend analysis</li>
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
                      <li>• Manufacturing businesses</li>
                      <li>• Service-based companies</li>
                      <li>• Product and project pricing</li>
                      <li>• Financial performance analysis</li>
                      <li>• Strategic planning and budgeting</li>
                      <li>• Investment decision making</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📋 Best Results With</h5>
                    <ul className="text-sm space-y-1 text-blue-800">
                      <li>• Accurate financial data</li>
                      <li>• Clear cost categorization</li>
                      <li>• Consistent accounting methods</li>
                      <li>• Regular performance tracking</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-2">⚠️ Limitations</h5>
                    <ul className="text-sm space-y-1 text-yellow-800">
                      <li>• Based on historical cost data</li>
                      <li>• Does not predict future market changes</li>
                      <li>• Assumes linear cost relationships</li>
                      <li>• Limited to quantitative factors</li>
                      <li>• Does not include opportunity costs</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-900 mb-2">❌ Not Suitable For</h5>
                    <ul className="text-sm space-y-1 text-red-800">
                      <li>• Highly volatile markets</li>
                      <li>• Start-up businesses without history</li>
                      <li>• Complex multi-product scenarios</li>
                      <li>• Non-profit organizations</li>
                      <li>• Businesses with irregular revenue</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium mb-2">Accuracy and Validation</h5>
                <p className="text-sm text-gray-600">
                  This calculator provides profit margin analysis based on standard accounting principles and industry benchmarks. 
                  Results should be validated against actual financial performance and adjusted for business-specific factors. 
                  Regular review and updating of assumptions is recommended for optimal accuracy.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfitMarginFormulaExplanation;
