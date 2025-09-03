import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import ProfitMarginCalculatorForm from './ProfitMarginCalculatorForm';
import ProfitMarginCalculatorResults from './ProfitMarginCalculatorResults';
import ProfitMarginFormulaExplanation from './ProfitMarginFormulaExplanation';
import ProfitMarginExportTools from './ProfitMarginExportTools';
import ProfitMarginRelatedTools from './ProfitMarginRelatedTools';
import ProfitMarginEducationalContent from './ProfitMarginEducationalContent';
import ProfitMarginFAQ from './ProfitMarginFAQ';
// import { ProfitMarginCalculator } from '../../../services/calculators/profitMarginCalculator';

const ProfitMarginCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!inputs.revenueStructure?.totalRevenue || inputs.revenueStructure.totalRevenue <= 0) {
        throw new Error('Total revenue must be greater than 0');
      }
      
      if (!inputs.costStructure?.directCosts) {
        throw new Error('Direct costs must be specified');
      }

      if (inputs.strategicObjectives?.targetGrossMargin < 10 || inputs.strategicObjectives?.targetGrossMargin > 60) {
        throw new Error('Target gross margin must be between 10% and 60%');
      }

      if (inputs.strategicObjectives?.targetNetMargin < 5 || inputs.strategicObjectives?.targetNetMargin > 30) {
        throw new Error('Target net margin must be between 5% and 30%');
      }

      if (inputs.marketFactors?.priceElasticity > 0) {
        throw new Error('Price elasticity should be negative (demand decreases as price increases)');
      }

      if (inputs.marketFactors?.marketGrowthRate < -10 || inputs.marketFactors?.marketGrowthRate > 50) {
        throw new Error('Market growth rate must be between -10% and 50%');
      }

      // Calculate profit margin analysis - temporarily using mock data
      const calculationResults = {
        marginAnalysis: {
          grossMargin: { amount: 42000, percentage: 35.0 },
          operatingMargin: { amount: 18000, percentage: 15.0 },
          netMargin: { amount: 12000, percentage: 10.0 },
          contributionMargin: { amount: 54000, percentage: 45.0 },
          ebitdaMargin: { amount: 21000, percentage: 17.5 },
          marginTrends: [
            { period: 'Q1', grossMargin: 33.0, netMargin: 8.5 },
            { period: 'Q2', grossMargin: 34.0, netMargin: 9.5 },
            { period: 'Q3', grossMargin: 35.5, netMargin: 10.3 },
            { period: 'Q4', grossMargin: 35.0, netMargin: 10.0 }
          ]
        },
        costAnalysis: {
          totalCosts: 108000,
          costBreakdown: {
            directCosts: 50000,
            indirectCosts: 23000,
            variableCosts: 48000,
            fixedCosts: 35000
          },
          costEfficiency: 78.5,
          costTrends: [
            { category: 'Materials', current: 30000, trend: 'Stable', impact: 'Medium' },
            { category: 'Labor', current: 20000, trend: 'Increasing', impact: 'High' },
            { category: 'Overhead', current: 15000, trend: 'Decreasing', impact: 'Low' },
            { category: 'Fixed Costs', current: 35000, trend: 'Stable', impact: 'Medium' }
          ]
        },
        profitabilityDrivers: {
          primaryDrivers: ['Material cost optimization', 'Labor efficiency', 'Pricing strategy'],
          revenueDrivers: ['Premium pricing for quality', 'Volume discounts', 'Value-added services'],
          costDrivers: ['Material sourcing', 'Process automation', 'Overhead allocation'],
          operationalDrivers: ['Equipment utilization', 'Quality improvements', 'Delivery performance'],
          driverImpact: [
            { driver: 'Material costs', impact: 8.5, priority: 'High' },
            { driver: 'Labor efficiency', impact: 6.2, priority: 'High' },
            { driver: 'Pricing optimization', impact: 4.8, priority: 'Medium' }
          ]
        },
        benchmarkComparison: {
          industryAverageMargins: { gross: 32.0, operating: 12.0, net: 8.0 },
          competitivePosition: 'Above Average',
          marginGap: { gross: 3.0, operating: 3.0, net: 2.0 },
          performanceRating: 7.5
        },
        scenarioAnalysis: {
          baseCase: { revenue: 120000, margin: 10.0, profit: 12000 },
          optimisticCase: { revenue: 138000, margin: 12.5, profit: 17250 },
          pessimisticCase: { revenue: 102000, margin: 7.5, profit: 7650 },
          breakEvenAnalysis: {
            breakEvenRevenue: 87500,
            marginOfSafety: 27.1,
            operatingLeverage: 1.8
          }
        },
        improvementOpportunities: {
          costReduction: [
            { opportunity: 'Negotiate better material prices', potential: 5.2, difficulty: 'Moderate', timeframe: '3-6 months' },
            { opportunity: 'Implement lean manufacturing', potential: 8.1, difficulty: 'Hard', timeframe: '6-12 months' },
            { opportunity: 'Optimize overhead allocation', potential: 3.5, difficulty: 'Easy', timeframe: '1-3 months' }
          ],
          revenueEnhancement: [
            { opportunity: 'Premium service offerings', potential: 12.0, difficulty: 'Moderate', timeframe: '3-6 months' },
            { opportunity: 'Market expansion', potential: 18.5, difficulty: 'Hard', timeframe: '12+ months' },
            { opportunity: 'Value-based pricing', potential: 6.8, difficulty: 'Easy', timeframe: '1-3 months' }
          ],
          operationalEfficiency: [
            { opportunity: 'Process automation', potential: 15.2, difficulty: 'Hard', timeframe: '6-12 months' },
            { opportunity: 'Quality improvements', potential: 4.5, difficulty: 'Moderate', timeframe: '3-6 months' },
            { opportunity: 'Equipment optimization', potential: 7.3, difficulty: 'Moderate', timeframe: '3-6 months' }
          ]
        },
        strategicRecommendations: {
          marginOptimization: [
            'Focus on high-margin product lines and services',
            'Implement value-based pricing strategies',
            'Optimize product mix for profitability'
          ],
          costManagement: [
            'Negotiate volume discounts with suppliers',
            'Implement cost tracking and control systems',
            'Reduce waste through lean practices'
          ],
          revenueGrowth: [
            'Develop premium service offerings',
            'Expand into adjacent markets',
            'Strengthen customer relationships'
          ],
          operationalExcellence: [
            'Invest in process automation',
            'Improve quality control systems',
            'Optimize equipment utilization'
          ],
          riskMitigation: [
            'Diversify customer base',
            'Monitor market conditions closely',
            'Maintain adequate cash reserves'
          ]
        },
        alertsAndRecommendations: {
          marginAlerts: ['Gross margin below industry average in Q1-Q2'],
          profitabilityWarnings: ['Fixed cost ratio increasing'],
          costOptimizationAlerts: ['Material costs trending upward'],
          strategicInsights: ['Premium pricing opportunity identified'],
          actionItems: [
            'Review material sourcing strategy within 30 days',
            'Implement cost tracking system by Q2',
            'Evaluate premium service opportunities'
          ]
        }
      };
      
      setResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="profit-margin-calculator"
        name="Profit Margin Calculator"
        description="Maximize profitability with comprehensive profit margin analysis and optimization. Calculate gross, operating, and net margins, benchmark performance, and identify opportunities to improve profitability by 15-30%."
        category="Financial Analysis"
        keywords={[
          'profit margin calculator',
          'profitability analysis',
          'margin optimization',
          'financial performance calculator',
          'gross margin calculator',
          'net margin analysis',
          'business profitability tool',
          'margin improvement calculator'
        ]}
        features={[
          'Comprehensive margin analysis',
          'Multi-margin calculations (Gross, Operating, Net)',
          'Industry benchmark comparison',
          'Profitability optimization recommendations',
          'Scenario analysis and forecasting',
          'Cost structure analysis',
          'Break-even analysis',
          'Performance rating system'
        ]}
        difficulty="intermediate"
        estimatedTime="< 3s"
        relatedCalculators={[
          'project-quoting-calculator',
          'competitive-pricing-calculator',
          'laser-cutting-cost',
          'gas-consumption-calculator'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profit Margin Calculator - Maximize Business Profitability</h1>
          <p className="text-muted-foreground">
            Boost profitability by 15-30% with comprehensive margin analysis and optimization strategies.
            Calculate gross, operating, and net margins, benchmark against industry standards, and identify
            actionable opportunities for sustainable profit improvement in laser cutting operations.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>Calculation Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <ProfitMarginCalculatorForm 
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div>
            {!results ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-muted-foreground" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your cost structure, revenue details, market factors, and strategic objectives, 
                    then click "Analyze Profit Margins" to get comprehensive profitability analysis and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Analysis Complete!</strong> Gross margin is{' '}
                    <strong>{results.marginAnalysis.grossMargin.percentage.toFixed(1)}%</strong> with{' '}
                    <strong>{results.marginAnalysis.netMargin.percentage.toFixed(1)}%</strong> net margin.
                    Performance rating: <strong>{results.benchmarkComparison.performanceRating.toFixed(1)}/10</strong>.
                  </AlertDescription>
                </Alert>
                
                <ProfitMarginCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <ProfitMarginExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <ProfitMarginFormulaExplanation />

          {/* Related Tools - Full container width */}
          <ProfitMarginRelatedTools />

          {/* Educational Content - Full container width */}
          <ProfitMarginEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <ProfitMarginFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Profit Margin Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Margin Improvement:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Value-Based Pricing:</strong> Price based on customer value, not just cost</li>
                  <li>• <strong>Product Mix:</strong> Focus on high-margin products and services</li>
                  <li>• <strong>Cost Control:</strong> Monitor and control variable costs closely</li>
                  <li>• <strong>Efficiency Gains:</strong> Invest in automation and process improvements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Strategic Considerations:</h4>
                <ul className="space-y-1">
                  <li>• Balance growth and profitability objectives</li>
                  <li>• Monitor industry benchmarks and competitive position</li>
                  <li>• Consider market conditions and price elasticity</li>
                  <li>• Implement regular margin analysis and review processes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProfitMarginCalculatorComponent;
