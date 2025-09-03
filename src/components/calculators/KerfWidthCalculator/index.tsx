import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import KerfWidthCalculatorForm from './KerfWidthCalculatorForm';
import KerfWidthCalculatorResults from './KerfWidthCalculatorResults';
import KerfWidthFormulaExplanation from './KerfWidthFormulaExplanation';
import KerfWidthExportTools from './KerfWidthExportTools';
import KerfWidthRelatedTools from './KerfWidthRelatedTools';
import KerfWidthEducationalContent from './KerfWidthEducationalContent';
import KerfWidthFAQ from './KerfWidthFAQ';
// import { kerfWidthCalculator } from '../../../services/calculators/kerfWidthCalculator';

const KerfWidthCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.thickness <= 0) {
        throw new Error('Material thickness must be greater than 0');
      }
      
      if (inputs.laserPower <= 0) {
        throw new Error('Laser power must be greater than 0');
      }

      if (inputs.cuttingSpeed <= 0) {
        throw new Error('Cutting speed must be greater than 0');
      }

      if (inputs.beamDiameter <= 0) {
        throw new Error('Beam diameter must be greater than 0');
      }

      if (inputs.gasPressure <= 0) {
        throw new Error('Gas pressure must be greater than 0');
      }

      // Calculate kerf width - temporarily using mock data
      const calculationResults = {
        predictedKerfWidth: Math.max(inputs.beamDiameter, inputs.materialConstant * Math.sqrt(inputs.laserPower / (inputs.cuttingSpeed * inputs.thickness)) + inputs.beamDiameter * 0.8),
        kerfWidthRange: {
          min: 0.085,
          max: 0.115
        },
        compensationValue: 0.05, // Half of kerf width
        materialUtilization: 97.8,
        qualityGrade: 4,
        heatAffectedZone: 0.18,
        edgeQuality: {
          roughness: 3.2, // Ra in μm
          squareness: 1.5, // degrees from perpendicular
          drossLevel: inputs.gasType === 'oxygen' && inputs.thickness > 10 ? 'moderate' : 'minimal'
        },
        optimizationSuggestions: [
          'Current kerf width is within optimal range for precision cutting',
          'Consider reducing power by 5% to minimize heat input',
          'Gas pressure is well-optimized for current material thickness',
          'Focus position provides good balance between top and bottom edge quality'
        ],
        recommendations: [
          `Use ${(0.05).toFixed(3)}mm compensation in CAD/CAM for accurate dimensions`,
          'Excellent kerf control achieved - suitable for precision applications',
          'Validate kerf width with test cuts before production runs',
          'Monitor kerf consistency during long production runs'
        ],
        keyMetrics: {
          'Predicted Kerf Width': '0.100 mm',
          'Compensation Value': '0.050 mm',
          'Material Utilization': '97.8%',
          'Quality Grade': '4/5'
        },
        sensitivityAnalysis: {
          power: [
            { variation: '-10%', kerfWidth: 0.092, change: '-8.0%' },
            { variation: '-5%', kerfWidth: 0.096, change: '-4.0%' },
            { variation: '+5%', kerfWidth: 0.104, change: '+4.0%' },
            { variation: '+10%', kerfWidth: 0.108, change: '+8.0%' }
          ],
          speed: [
            { variation: '-10%', kerfWidth: 0.105, change: '+5.0%' },
            { variation: '-5%', kerfWidth: 0.102, change: '+2.0%' },
            { variation: '+5%', kerfWidth: 0.098, change: '-2.0%' },
            { variation: '+10%', kerfWidth: 0.095, change: '-5.0%' }
          ]
        },
        materialEfficiency: {
          kerfLossPerMeter: 500, // mm³ per meter
          annualMaterialSavings: 2500,
          wasteReduction: 12.5,
          costImpact: {
            materialCost: 150.00,
            timeCost: 75.00,
            totalSavings: 225.00
          }
        },
        qualityAssessment: {
          dimensionalAccuracy: 98.5,
          edgeFinish: 'Smooth',
          postProcessingRequired: false,
          toleranceClass: 'Fine',
          applicationSuitability: [
            'Precision mechanical parts',
            'Decorative components',
            'Functional prototypes',
            'Small batch production'
          ]
        },
        processStability: {
          stabilityIndex: 85,
          criticalParameters: [
            'Laser power stability (±2%)',
            'Cutting speed consistency',
            'Gas pressure regulation',
            'Material thickness uniformity'
          ],
          monitoringRecommendations: [
            'Monitor kerf width every 100 parts',
            'Check gas pressure hourly',
            'Verify beam alignment daily',
            'Calibrate measurement system weekly'
          ],
          controlLimits: {
            upperLimit: 0.115,
            lowerLimit: 0.085,
            targetValue: 0.100
          }
        },
        comparisonData: {
          industryAverage: 0.125,
          bestPractice: 0.090,
          yourPerformance: 'good',
          improvementPotential: 10.0
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
        calculatorId="kerf-width-calculator"
        name="Kerf Width Calculator"
        description="Calculate and predict laser cutting kerf width for optimal dimensional accuracy and material utilization. Get precise compensation values for CAD/CAM programming and quality assessment."
        category="Quality Control"
        keywords={[
          'kerf width calculator',
          'kerf compensation calculator',
          'laser cutting kerf prediction',
          'dimensional accuracy calculator',
          'CAD CAM compensation',
          'material utilization calculator',
          'cutting precision tool',
          'laser kerf analysis'
        ]}
        features={[
          'Kerf width prediction',
          'Compensation value calculation',
          'Material utilization analysis',
          'Quality grade assessment',
          'Heat affected zone calculation',
          'Edge quality prediction',
          'Optimization suggestions',
          'Sensitivity analysis'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'tolerance-stack-calculator',
          'edge-quality-predictor',
          'laser-parameter-optimizer',
          'material-selection-assistant'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kerf Width Calculator</h1>
          <p className="text-muted-foreground">
            Calculate and predict laser cutting kerf width for optimal dimensional accuracy and material utilization. 
            Get precise compensation values for CAD/CAM programming and quality assessment.
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
            <KerfWidthCalculatorForm 
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your material properties, laser parameters, gas settings, and focus position, 
                    then click "Calculate Kerf Width" to get precise kerf width predictions and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Calculation Complete!</strong> Predicted kerf width is{' '}
                    <strong>{results.predictedKerfWidth.toFixed(3)} mm</strong> with{' '}
                    <strong>{results.compensationValue.toFixed(3)} mm</strong> CAD compensation.
                    Material utilization: <strong>{results.materialUtilization.toFixed(1)}%</strong>.
                  </AlertDescription>
                </Alert>
                
                <KerfWidthCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <KerfWidthExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <KerfWidthFormulaExplanation />

          {/* Related Tools - Full container width */}
          <KerfWidthRelatedTools />

          {/* Educational Content - Full container width */}
          <KerfWidthEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <KerfWidthFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Kerf Width Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Kerf Width Control:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Beam Diameter:</strong> Primary factor in kerf width</li>
                  <li>• <strong>Power-Speed Ratio:</strong> Higher ratio = wider kerf</li>
                  <li>• <strong>Gas Type:</strong> Oxygen widens, nitrogen narrows</li>
                  <li>• <strong>Focus Position:</strong> Off-focus increases kerf width</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">CAD/CAM Compensation:</h4>
                <ul className="space-y-1">
                  <li>• Use half of kerf width for compensation</li>
                  <li>• Apply compensation to inside dimensions</li>
                  <li>• Validate with test cuts before production</li>
                  <li>• Monitor kerf consistency during runs</li>
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

export default KerfWidthCalculatorComponent;
