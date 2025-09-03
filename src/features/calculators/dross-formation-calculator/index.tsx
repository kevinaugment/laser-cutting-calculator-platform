'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { DrossFormationCalculator } from './DrossFormationCalculator';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new DrossFormationCalculator();

interface DrossFormationCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Dross Formation Calculator Page Component
 * Comprehensive dross formation analysis and prevention for laser cutting
 */
export default function DrossFormationCalculatorPage({
  initialInputs,
  onCalculationComplete
}: DrossFormationCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Dross Formation Analysis completed:', {
        calculatorId: calculator.config.id,
        timestamp: result.metadata.timestamp,
        calculationTime: result.metadata.calculationTime,
        inputHash: result.metadata.inputHash
      });
    }
    
    onCalculationComplete?.(result);
  };

  const handleInputChange = (inputs: Record<string, any>) => {
    // Optional: Track input changes for analytics
    if (typeof window !== 'undefined') {
      console.log('Dross Formation Calculator inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="dross-formation-calculator"
        name="Dross Formation Calculator"
        description="Analyze and prevent dross formation in laser cutting. Optimize melt ejection, gas flow, and cutting parameters for clean bottom edges and superior cut quality."
        category="Quality Control"
        keywords={[
          'dross formation calculator',
          'bottom edge quality analysis',
          'melt ejection optimization',
          'gas flow optimization tool',
          'laser cutting quality control',
          'dross prevention guide',
          'clean cutting calculator',
          'edge quality predictor'
        ]}
        features={[
          'Comprehensive dross risk assessment',
          'Melt ejection analysis and optimization',
          'Bottom edge quality prediction',
          'Gas flow effectiveness evaluation',
          'Material-specific dross prevention',
          'Severity scoring and classification',
          'Process parameter optimization',
          'Quality control recommendations'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'edge-quality-predictor',
          'burn-mark-preventer',
          'warping-risk-calculator',
          'laser-parameter-optimizer'
        ]}
      />
      <div className="dross-formation-calculator-page">

      {/* Main Calculator Interface */}
      <BaseCalculatorContainer
        calculator={calculator}
        initialInputs={initialInputs}
        onCalculationComplete={handleCalculationComplete}
        onInputChange={handleInputChange}
      />
      
      {/* Additional SEO Content */}
      <div className="seo-content mt-12 max-w-4xl mx-auto px-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Dross Formation Analysis
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Dross Formation Calculator provides comprehensive analysis of dross 
              formation mechanisms and prevention strategies for laser cutting operations. 
              Essential for achieving clean bottom edges, minimizing secondary operations, 
              and ensuring consistent quality in precision manufacturing.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Dross Analysis
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Risk Assessment:</strong> Low, Medium, High, Critical</li>
                  <li>• <strong>Formation Mechanism:</strong> Root cause analysis</li>
                  <li>• <strong>Severity Scoring:</strong> 0-5 scale assessment</li>
                  <li>• <strong>Attachment Strength:</strong> Removal difficulty</li>
                  <li>• <strong>Primary Causes:</strong> Contributing factors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Prevention Strategies
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Parameter Optimization:</strong> Power, speed, pressure</li>
                  <li>• <strong>Gas Flow Control:</strong> Flow rate and pattern</li>
                  <li>• <strong>Nozzle Setup:</strong> Diameter and standoff</li>
                  <li>• <strong>Process Modifications:</strong> Cutting techniques</li>
                  <li>• <strong>Quality Prediction:</strong> Expected outcomes</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Melt Ejection Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Ejection efficiency calculation</li>
                  <li>• Gas flow effectiveness assessment</li>
                  <li>• Melt viscosity analysis</li>
                  <li>• Ejection velocity optimization</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Turbulence level evaluation</li>
                  <li>• Nozzle alignment verification</li>
                  <li>• Pressure stability requirements</li>
                  <li>• Flow pattern optimization</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Dross Risk Classification
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Low Risk</strong><br/>0-3 Score
                  </div>
                  <p className="mt-1 text-xs">Minimal dross expected</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                    <strong>Medium Risk</strong><br/>3-6 Score
                  </div>
                  <p className="mt-1 text-xs">Some prevention needed</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>High Risk</strong><br/>6-8 Score
                  </div>
                  <p className="mt-1 text-xs">Prevention strategies required</p>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Critical Risk</strong><br/>8-10 Score
                  </div>
                  <p className="mt-1 text-xs">Immediate action required</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Material-Specific Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">High Dross Tendency Materials</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Copper:</strong> High melt viscosity, requires nitrogen</li>
                  <li>• <strong>Stainless Steel:</strong> Prone to dross, use high pressure</li>
                  <li>• <strong>Thick Materials:</strong> &gt;15mm requires special attention</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dross Severity Levels</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>None:</strong> Clean cut, no secondary operations</li>
                  <li>• <strong>Minimal:</strong> Light cleaning sufficient</li>
                  <li>• <strong>Moderate:</strong> Mechanical removal required</li>
                  <li>• <strong>Heavy/Severe:</strong> Extensive finishing needed</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and enter cutting parameters</li>
              <li>Specify gas settings and nozzle configuration</li>
              <li>Indicate current dross level (if known)</li>
              <li>Get comprehensive dross formation analysis</li>
              <li>Review melt ejection effectiveness</li>
              <li>Implement prevention strategies</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Quality Control Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Bottom Edge Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve clean bottom edges with minimal dross formation
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Reduction
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Reduce secondary operations and finishing costs
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize gas flow and cutting parameters for clean cuts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}

// Export the calculator instance for testing and integration
export { calculator as drossFormationCalculator };
