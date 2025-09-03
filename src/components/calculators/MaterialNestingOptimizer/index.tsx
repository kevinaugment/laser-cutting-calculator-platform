import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import MaterialNestingOptimizerForm from './MaterialNestingOptimizerForm';
import MaterialNestingOptimizerResults from './MaterialNestingOptimizerResults';
import MaterialNestingFormulaExplanation from './MaterialNestingFormulaExplanation';
import MaterialNestingExportTools from './MaterialNestingExportTools';
import MaterialNestingRelatedTools from './MaterialNestingRelatedTools';
import MaterialNestingEducationalContent from './MaterialNestingEducationalContent';
import MaterialNestingFAQ from './MaterialNestingFAQ';
import { materialNestingOptimizer } from '../../../services/calculators/materialNestingOptimizer';

const MaterialNestingOptimizerComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!inputs.parts || inputs.parts.length === 0) {
        throw new Error('At least one part must be defined');
      }
      
      if (!inputs.sheetSpecs || inputs.sheetSpecs.length === 0) {
        throw new Error('At least one sheet specification must be defined');
      }

      // Check if any parts can fit on any sheets
      const canFit = inputs.parts.some((part: any) => 
        inputs.sheetSpecs.some((sheet: any) => 
          part.length <= sheet.length && part.width <= sheet.width &&
          part.thickness <= sheet.thickness &&
          (inputs.nestingConstraints.allowMixedMaterial || part.materialType === sheet.materialType)
        )
      );

      if (!canFit) {
        throw new Error('No parts can fit on the available sheets. Check part dimensions and material compatibility.');
      }

      // Calculate nesting optimization
      const calculationResults = materialNestingOptimizer.calculate(inputs);
      
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
        calculatorId="material-nesting-optimizer"
        name="Material Nesting Optimizer"
        description="Reduce material waste by 30-50% and save $30K-150K annually with advanced nesting optimization. Calculate optimal part layouts, minimize material costs, and achieve 95%+ sheet utilization with intelligent algorithms for laser cutting operations."
        category="Material Optimization"
        keywords={[
          'material nesting optimizer',
          'laser cutting material optimization',
          'sheet nesting calculator',
          'material waste reduction calculator',
          'sheet utilization optimizer',
          'nesting algorithm software',
          'material cost savings calculator',
          'cutting layout optimization tool',
          'manufacturing waste reduction',
          'optimal part nesting',
          'sheet metal optimization',
          'production cost calculator'
        ]}
        features={[
          'Intelligent nesting algorithms',
          'Material waste reduction up to 50%',
          'Cost savings calculation',
          'Multiple sheet size support',
          'Optimal part layout generation',
          'Utilization rate analysis',
          'Export nesting layouts',
          'Production planning integration'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'kerf-compensation-calculator',
          'sheet-utilization-calculator',
          'remnant-value-calculator',
          'cut-path-optimizer'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Material Nesting Optimizer - Reduce Waste & Save Costs</h1>
          <p className="text-muted-foreground">
            Optimize material usage with intelligent nesting algorithms that reduce waste by up to 50%.
            Find the most efficient layout for cutting multiple parts from sheets, minimize material costs,
            and maximize sheet utilization. Save $30K-150K annually through smart material optimization.
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
            <MaterialNestingOptimizerForm 
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
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Optimize</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your parts and sheet specifications, then click "Optimize Material Nesting" 
                    to see the most efficient layout and cost analysis.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Optimization Complete!</strong> Found optimal nesting solution with{' '}
                    <strong>{results.optimizationSummary.overallUtilization.toFixed(1)}%</strong> material utilization
                    using <strong>{results.optimizationSummary.totalSheets}</strong> sheets.
                  </AlertDescription>
                </Alert>
                
                <MaterialNestingOptimizerResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <MaterialNestingExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <MaterialNestingFormulaExplanation />

          {/* Related Tools - Full container width */}
          <MaterialNestingRelatedTools />

          {/* Educational Content - Full container width */}
          <MaterialNestingEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <MaterialNestingFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Material Efficiency:</h4>
                <ul className="space-y-1">
                  <li>• Allow part rotation when possible for better nesting</li>
                  <li>• Use consistent material types to avoid waste</li>
                  <li>• Consider multiple sheet sizes for different parts</li>
                  <li>• Minimize edge margins while maintaining safety</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cost Optimization:</h4>
                <ul className="space-y-1">
                  <li>• Balance material usage vs. cutting time</li>
                  <li>• Consider setup costs for multiple sheets</li>
                  <li>• Plan for remnant reuse in future projects</li>
                  <li>• Optimize for your primary business goal</li>
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

export default MaterialNestingOptimizerComponent;
