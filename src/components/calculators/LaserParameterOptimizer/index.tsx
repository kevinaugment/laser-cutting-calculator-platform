import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import LaserParameterOptimizerForm from './LaserParameterOptimizerForm';
import LaserParameterOptimizerResults from './LaserParameterOptimizerResults';
import LaserParameterOptimizerFormulaExplanation from './LaserParameterOptimizerFormulaExplanation';
import LaserParameterOptimizerExportTools from './LaserParameterOptimizerExportTools';
import LaserParameterOptimizerRelatedTools from './LaserParameterOptimizerRelatedTools';
import LaserParameterOptimizerEducationalContent from './LaserParameterOptimizerEducationalContent';
import LaserParameterOptimizerFAQ from './LaserParameterOptimizerFAQ';
import { LaserParameterOptimizer } from '../../../services/calculators/laserParameterOptimizer';

interface LaserParameterInputs {
  materialType: string;
  thickness: number;
  laserType: 'fiber' | 'co2' | 'nd_yag';
  maxPower: number;
  qualityRequirement: 'draft' | 'standard' | 'high' | 'precision';
  gasType: 'air' | 'oxygen' | 'nitrogen';
  focusLensLength: number;
  nozzleDiameter: number;
  partComplexity: 'simple' | 'medium' | 'complex';
  productionPriority: 'speed' | 'quality' | 'cost';
}

const LaserParameterOptimizerComponent: React.FC = () => {
  const [inputs, setInputs] = useState<LaserParameterInputs>({
    materialType: 'mild_steel',
    thickness: 3.0,
    laserType: 'fiber',
    maxPower: 3000,
    qualityRequirement: 'standard',
    gasType: 'oxygen',
    focusLensLength: 125,
    nozzleDiameter: 1.5,
    partComplexity: 'medium',
    productionPriority: 'quality'
  });

  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (newInputs: LaserParameterInputs) => {
    setIsLoading(true);
    setError(null);
    setInputs(newInputs);

    try {
      console.log('🔧 Starting laser parameter optimization...', newInputs);
      
      const optimizer = new LaserParameterOptimizer();
      const calculationResults = optimizer.calculate(newInputs);
      
      console.log('✅ Parameter optimization completed:', calculationResults);
      setResults(calculationResults);
    } catch (err) {
      console.error('❌ Parameter optimization failed:', err);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Laser Parameter Optimizer
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Advanced parameter optimization for laser cutting processes. 
              Optimize power, speed, and gas settings for best quality, efficiency, and cost balance.
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-20 rounded-full">
              <span className="text-blue-100">🎯 Parameter Optimization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span>/</span>
            <a href="/calculator" className="hover:text-blue-600">Calculator</a>
            <span>/</span>
            <span className="text-gray-900">Laser Parameter Optimizer</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button className="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
              Parameter Optimizer
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
              Learn & Optimize
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
              FAQ & Support
            </button>
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Optimization Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {results && !error && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Optimization Complete!</strong> 
              Optimized Power: {results.optimizedParameters?.power}W | 
              Speed: {results.optimizedParameters?.speed}mm/min | 
              Quality Score: {results.expectedResults?.edgeQuality}/10
            </AlertDescription>
          </Alert>
        )}

        {/* Main Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Form - Left Column */}
          <div className="lg:col-span-1">
            <LaserParameterOptimizerForm
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </div>

          {/* Results - Right Columns */}
          <div className="lg:col-span-2">
            {results ? (
              <LaserParameterOptimizerResults results={results} inputs={inputs} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Optimize</h3>
                <p className="text-gray-600">
                  Enter your material and machine parameters to get optimized laser cutting settings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formula Explanation Section */}
        <div className="mt-12">
          <LaserParameterOptimizerFormulaExplanation />
        </div>

        {/* Related Tools Section */}
        <div className="mt-12">
          <LaserParameterOptimizerRelatedTools />
        </div>

        {/* Export Tools Section */}
        {results && (
          <div className="mt-12">
            <LaserParameterOptimizerExportTools results={results} inputs={inputs} />
          </div>
        )}

        {/* Educational Content Section */}
        <div className="mt-12">
          <LaserParameterOptimizerEducationalContent />
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <LaserParameterOptimizerFAQ />
        </div>
      </div>
    </div>
  );
};

export default LaserParameterOptimizerComponent;
