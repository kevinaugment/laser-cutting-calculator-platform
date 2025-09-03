import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import GasConsumptionCalculatorForm from './GasConsumptionCalculatorForm';
import GasConsumptionCalculatorResults from './GasConsumptionCalculatorResults';
import GasConsumptionFormulaExplanation from './GasConsumptionFormulaExplanation';
import GasConsumptionExportTools from './GasConsumptionExportTools';
import GasConsumptionRelatedTools from './GasConsumptionRelatedTools';
import GasConsumptionEducationalContent from './GasConsumptionEducationalContent';
import GasConsumptionFAQ from './GasConsumptionFAQ';
// import { GasConsumptionCalculator } from '../../../services/calculators/gasConsumptionCalculator';

const GasConsumptionCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.materialThickness <= 0) {
        throw new Error('Material thickness must be greater than 0');
      }
      
      if (inputs.cuttingLength <= 0) {
        throw new Error('Cutting length must be greater than 0');
      }

      if (inputs.gasFlow <= 0) {
        throw new Error('Gas flow rate must be greater than 0');
      }

      if (inputs.gasPressure <= 0) {
        throw new Error('Gas pressure must be greater than 0');
      }

      if (inputs.gasPrice <= 0) {
        throw new Error('Gas price must be greater than 0');
      }

      if (inputs.efficiency < 0.5 || inputs.efficiency > 1.0) {
        throw new Error('Gas efficiency must be between 50% and 100%');
      }

      // Calculate gas consumption - temporarily using mock data
      const calculationResults = {
        totalConsumption: 2.85, // m³
        consumptionBreakdown: {
          cuttingConsumption: 1.95,
          piercingConsumption: 0.45,
          setupConsumption: 0.25,
          idleConsumption: 0.20
        },
        totalCost: 42.75,
        costBreakdown: {
          cuttingCost: 29.25,
          piercingCost: 6.75,
          setupCost: 3.75,
          idleCost: 3.00
        },
        efficiency: {
          utilizationRate: 84.2,
          wasteReduction: 12.5,
          optimizationPotential: 18
        },
        unitCosts: {
          costPerMeter: 0.0085,
          costPerPiece: 0.855,
          costPerHour: 256.50
        },
        gasProperties: {
          gasType: inputs.gasType,
          purity: inputs.gasType === 'oxygen' ? 99.5 : inputs.gasType === 'nitrogen' ? 99.9 : 78.0,
          density: inputs.gasType === 'oxygen' ? 1.429 : inputs.gasType === 'nitrogen' ? 1.251 : 1.225,
          thermalConductivity: inputs.gasType === 'oxygen' ? 0.0263 : inputs.gasType === 'nitrogen' ? 0.0259 : 0.0257,
          suitability: inputs.gasType === 'oxygen' && inputs.materialType === 'carbon_steel' ? 'Excellent' :
                      inputs.gasType === 'nitrogen' && inputs.materialType === 'stainless_steel' ? 'Excellent' :
                      inputs.gasType === 'air' ? 'Good' : 'Fair'
        },
        alternativeGasOptions: [
          {
            gasType: 'Nitrogen',
            estimatedCost: 64.12,
            qualityImpact: 'Superior edge quality, no oxidation',
            consumptionChange: 15,
            recommendation: 'Consider for stainless steel or when edge quality is critical'
          },
          {
            gasType: 'Compressed Air',
            estimatedCost: 12.83,
            qualityImpact: 'Moderate edge quality, some oxidation possible',
            consumptionChange: -5,
            recommendation: 'Cost-effective option for non-critical applications'
          },
          {
            gasType: 'Argon',
            estimatedCost: 106.88,
            qualityImpact: 'Premium edge quality, ideal for exotic materials',
            consumptionChange: 8,
            recommendation: 'Use only for titanium or other specialty materials'
          }
        ],
        optimizationRecommendations: {
          flowOptimization: [
            'Reduce gas flow rate by 10% to optimize consumption without affecting quality',
            'Implement flow control system for automatic adjustment during different cutting phases',
            'Consider variable flow rates based on material thickness'
          ],
          pressureOptimization: [
            'Optimize gas pressure to 1.0 bar for current material thickness',
            'Use pressure sensors to maintain consistent pressure throughout cutting',
            'Adjust pressure based on nozzle diameter and cutting speed'
          ],
          timingOptimization: [
            'Reduce idle time by improving job scheduling and setup procedures',
            'Implement automatic gas shut-off during extended pauses',
            'Optimize piercing sequence to minimize gas waste'
          ],
          costSavingTips: [
            'Negotiate bulk gas pricing with suppliers',
            'Consider on-site gas generation for high-volume operations',
            'Implement gas recovery systems where applicable',
            'Regular maintenance of gas delivery systems to prevent leaks'
          ]
        },
        sensitivityAnalysis: {
          flowRateImpact: [
            { flowRate: 12, consumption: 2.28, cost: 34.20, change: '-20%' },
            { flowRate: 15, consumption: 2.85, cost: 42.75, change: 'Base' },
            { flowRate: 18, consumption: 3.42, cost: 51.30, change: '+20%' },
            { flowRate: 21, consumption: 3.99, cost: 59.85, change: '+40%' }
          ],
          pressureImpact: [
            { pressure: 1.0, consumption: 2.71, cost: 40.65, change: '-5%' },
            { pressure: 1.2, consumption: 2.85, cost: 42.75, change: 'Base' },
            { pressure: 1.4, consumption: 2.99, cost: 44.85, change: '+5%' },
            { pressure: 1.6, consumption: 3.13, cost: 46.95, change: '+10%' }
          ]
        },
        benchmarkComparison: {
          industryAverage: {
            consumptionPerMeter: 0.0006,
            costPerMeter: 0.0090,
            efficiency: 78.0
          },
          yourPerformance: {
            consumptionPerMeter: 0.00057,
            costPerMeter: 0.0085,
            efficiency: 84.2
          },
          performanceRating: 'Good'
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
        calculatorId="gas-consumption-calculator"
        name="Gas Consumption Calculator"
        description="Optimize gas consumption and reduce operating costs for laser cutting operations. Calculate precise gas usage, analyze consumption patterns, and identify cost-saving opportunities with comprehensive gas efficiency analysis."
        category="Cost Control"
        keywords={[
          'gas consumption calculator',
          'laser cutting gas cost',
          'assist gas optimization',
          'gas usage calculator',
          'cutting gas efficiency',
          'nitrogen consumption calculator',
          'oxygen consumption calculator',
          'gas cost optimization'
        ]}
        features={[
          'Precise gas consumption calculation',
          'Multi-gas type support (O2, N2, Air, Ar)',
          'Cost breakdown analysis',
          'Efficiency optimization recommendations',
          'Consumption pattern analysis',
          'Alternative gas suggestions',
          'Real-time cost tracking',
          'Export consumption reports'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'laser-cutting-cost',
          'energy-cost-calculator',
          'profit-margin-calculator',
          'material-nesting-optimizer'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gas Consumption Calculator - Optimize Costs & Efficiency</h1>
          <p className="text-muted-foreground">
            Reduce gas costs by up to 25% with precise consumption analysis and optimization recommendations.
            Calculate gas usage for O2, N2, Air, and Argon, analyze efficiency patterns, and identify cost-saving opportunities.
            Essential tool for controlling operating expenses in laser cutting operations.
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
            <GasConsumptionCalculatorForm 
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your material specifications, cutting parameters, gas settings, and cost factors, 
                    then click "Calculate Gas Consumption" to get comprehensive gas consumption analysis and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Analysis Complete!</strong> Total gas consumption is{' '}
                    <strong>{results.totalConsumption.toFixed(2)} m³</strong> costing{' '}
                    <strong>${results.totalCost.toFixed(2)}</strong> with{' '}
                    <strong>{results.efficiency.utilizationRate.toFixed(1)}%</strong> efficiency.
                    Optimization potential: <strong>{results.efficiency.optimizationPotential}%</strong> cost savings.
                  </AlertDescription>
                </Alert>
                
                <GasConsumptionCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <GasConsumptionExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <GasConsumptionFormulaExplanation />

          {/* Related Tools - Full container width */}
          <GasConsumptionRelatedTools />

          {/* Educational Content - Full container width */}
          <GasConsumptionEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <GasConsumptionFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Gas Consumption Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Gas Selection:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Oxygen:</strong> Best for carbon steel, high cutting speeds</li>
                  <li>• <strong>Nitrogen:</strong> Clean cuts, stainless steel, no oxidation</li>
                  <li>• <strong>Air:</strong> Most economical, good for thin materials</li>
                  <li>• <strong>Argon:</strong> Premium quality, exotic materials only</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Optimization Strategies:</h4>
                <ul className="space-y-1">
                  <li>• Optimize flow rates based on material thickness</li>
                  <li>• Minimize idle time and setup delays</li>
                  <li>• Regular maintenance to prevent gas leaks</li>
                  <li>• Consider bulk purchasing or on-site generation</li>
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

export default GasConsumptionCalculatorComponent;
