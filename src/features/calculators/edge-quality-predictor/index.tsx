'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { EdgeQualityPredictor } from './EdgeQualityPredictor';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new EdgeQualityPredictor();

interface EdgeQualityPredictorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Edge Quality Predictor Page Component
 * Comprehensive edge quality prediction for laser cutting optimization
 */
export default function EdgeQualityPredictorPage({
  initialInputs,
  onCalculationComplete
}: EdgeQualityPredictorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Edge Quality Prediction completed:', {
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
      console.log('Edge Quality Predictor inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="edge-quality-predictor"
        name="Edge Quality Predictor"
        description="Predict edge quality and surface characteristics for laser cutting operations. Analyze surface roughness, defect risks, kerf taper, and optimize cutting parameters for superior edge quality and precision manufacturing."
        category="Quality Control"
        keywords={[
          'edge quality predictor',
          'laser cutting quality analysis',
          'surface roughness calculator',
          'defect prediction tool',
          'dross formation analysis',
          'burn mark prevention',
          'kerf taper calculator',
          'cutting quality optimization'
        ]}
        features={[
          'Surface roughness prediction',
          'Edge characteristic analysis',
          'Defect risk assessment',
          'Quality grade prediction',
          'Parameter optimization suggestions',
          'Real-time quality monitoring',
          'Material-specific analysis',
          'Quality control recommendations'
        ]}
        difficulty="advanced"
        estimatedTime="< 2s"
        relatedCalculators={[
          'warping-risk-calculator',
          'burn-mark-preventer',
          'laser-parameter-optimizer',
          'dross-formation-calculator'
        ]}
      />
      <div className="edge-quality-predictor-page">

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
            Professional Edge Quality Prediction
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Edge Quality Predictor provides comprehensive analysis of laser cutting 
              edge quality and surface characteristics. Essential for quality control, 
              process optimization, and ensuring consistent cutting results in precision 
              manufacturing applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Quality Metrics
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Quality Grade:</strong> 1-5 scale assessment</li>
                  <li>• <strong>Surface Roughness:</strong> Ra measurement in μm</li>
                  <li>• <strong>Edge Characteristics:</strong> Top/bottom quality analysis</li>
                  <li>• <strong>Kerf Analysis:</strong> Taper and width measurements</li>
                  <li>• <strong>Defect Risks:</strong> Dross, burn, roughness prediction</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Analysis Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Material Compatibility:</strong> 6 material types</li>
                  <li>• <strong>Gas Optimization:</strong> O₂, N₂, Air, Ar analysis</li>
                  <li>• <strong>Parameter Effects:</strong> Power, speed, pressure impact</li>
                  <li>• <strong>Focus Analysis:</strong> Position optimization</li>
                  <li>• <strong>Beam Quality:</strong> M² factor consideration</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Quality Prediction Capabilities
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Surface roughness prediction (Ra)</li>
                  <li>• Edge angle and taper analysis</li>
                  <li>• Dross formation assessment</li>
                  <li>• Burn mark risk evaluation</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Quality factor decomposition</li>
                  <li>• Parameter optimization suggestions</li>
                  <li>• Defect prevention strategies</li>
                  <li>• Process stability indicators</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Quality Grade Scale
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Grade 1</strong><br/>Poor
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>Grade 2</strong><br/>Fair
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                    <strong>Grade 3</strong><br/>Good
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Grade 4</strong><br/>Very Good
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Grade 5</strong><br/>Excellent
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and enter thickness</li>
              <li>Specify laser power and cutting speed</li>
              <li>Choose assist gas type and pressure</li>
              <li>Set focus position and beam quality</li>
              <li>Get comprehensive quality prediction</li>
              <li>Review optimization suggestions</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Quality Control Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Predictive Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Predict edge quality before cutting to prevent defects
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize parameters for consistent high-quality results
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Reduction
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Reduce scrap and rework through better process control
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
export { calculator as edgeQualityPredictor };
