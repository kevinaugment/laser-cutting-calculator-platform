import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import FocusHeightCalculatorForm from './FocusHeightCalculatorForm';
import FocusHeightCalculatorResults from './FocusHeightCalculatorResults';
import FocusHeightFormulaExplanation from './FocusHeightFormulaExplanation';
import FocusHeightExportTools from './FocusHeightExportTools';
import FocusHeightRelatedTools from './FocusHeightRelatedTools';
import FocusHeightEducationalContent from './FocusHeightEducationalContent';
import FocusHeightFAQ from './FocusHeightFAQ';
import { focusHeightCalculator } from '../../../services/calculators/focusHeightCalculator';

const FocusHeightCalculatorComponent: React.FC = () => {
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

      if (inputs.focalLength <= 0) {
        throw new Error('Focal length must be greater than 0');
      }

      if (inputs.beamDiameter <= 0) {
        throw new Error('Beam diameter must be greater than 0');
      }

      if (inputs.cuttingSpeed <= 0) {
        throw new Error('Cutting speed must be greater than 0');
      }

      // Calculate focus height using the actual service
      const calculationResults = focusHeightCalculator.calculate(inputs);

      
      setResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Focus Height Calculator</h1>
          <p className="text-muted-foreground">
            Calculate optimal focus height for laser cutting operations. Determine the best focus position based on 
            material properties, laser specifications, and cutting requirements for maximum edge quality and process stability.
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
            <FocusHeightCalculatorForm 
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
                    Configure your material properties, laser specifications, cutting parameters, and environmental conditions, 
                    then click "Calculate Optimal Focus Height" to get precise focus positioning recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Calculation Complete!</strong> Optimal focus position is{' '}
                    <strong>{results.optimalFocusPosition.recommendedPosition > 0 ? '+' : ''}{results.optimalFocusPosition.recommendedPosition.toFixed(2)} mm</strong> with{' '}
                    <strong>{results.optimalFocusPosition.depthOfFocus.toFixed(2)} mm</strong> depth of focus.
                    Power density: <strong>{results.beamCharacteristics.powerDensity.toFixed(0)} W/mm²</strong>.
                  </AlertDescription>
                </Alert>
                
                <FocusHeightCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <FocusHeightExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <FocusHeightFormulaExplanation />

          {/* Related Tools - Full container width */}
          <FocusHeightRelatedTools />

          {/* Educational Content - Full container width */}
          <FocusHeightEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <FocusHeightFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Focus Height Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Focus Position Guidelines:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Through Cut:</strong> Focus 1/3 into material thickness</li>
                  <li>• <strong>Surface Operations:</strong> Focus on material surface</li>
                  <li>• <strong>Thick Materials:</strong> Focus deeper (up to 60% of thickness)</li>
                  <li>• <strong>Quality Priority:</strong> Adjust focus for top vs bottom edge</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Setup and Maintenance:</h4>
                <ul className="space-y-1">
                  <li>• Regular focus calibration and verification</li>
                  <li>• Clean focusing optics for consistent performance</li>
                  <li>• Monitor focus stability during operation</li>
                  <li>• Document optimal settings for each material</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusHeightCalculatorComponent;
