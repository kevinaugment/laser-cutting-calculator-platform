'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { ToleranceStackCalculator } from './ToleranceStackCalculator';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new ToleranceStackCalculator();

interface ToleranceStackCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Tolerance Stack Calculator Page Component
 * Comprehensive tolerance stack analysis and dimensional accuracy control
 */
export default function ToleranceStackCalculatorPage({
  initialInputs,
  onCalculationComplete
}: ToleranceStackCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Tolerance Stack Analysis completed:', {
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
      console.log('Tolerance Stack Calculator inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="tolerance-stack-calculator"
        name="Tolerance Stack Calculator"
        description="Analyze tolerance stackup and dimensional accuracy for precision manufacturing. Calculate cumulative tolerances, dimensional chains, and quality control requirements for laser cutting."
        category="Quality Control"
        keywords={[
          'tolerance stack calculator',
          'dimensional accuracy analysis',
          'precision manufacturing tool',
          'tolerance analysis calculator',
          'quality control calculator',
          'dimensional chain analysis',
          'stackup calculation tool',
          'manufacturing tolerance guide'
        ]}
        features={[
          'Comprehensive tolerance stackup analysis',
          'Worst-case and statistical methods',
          'Dimensional chain calculation',
          'Process capability assessment',
          'Quality control planning',
          'Risk assessment and mitigation',
          'Measurement strategy optimization',
          'Manufacturing yield prediction'
        ]}
        difficulty="advanced"
        estimatedTime="< 3s"
        relatedCalculators={[
          'edge-quality-predictor',
          'warping-risk-calculator',
          'dross-formation-calculator',
          'laser-parameter-optimizer'
        ]}
      />
      <div className="tolerance-stack-calculator-page">

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
            Professional Tolerance Stack Analysis
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Tolerance Stack Calculator provides comprehensive analysis of tolerance 
              accumulation and dimensional accuracy for precision manufacturing. Essential 
              for ensuring part functionality, assembly requirements, and quality control 
              in high-precision laser cutting applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Tolerance Analysis
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Stackup Methods:</strong> Worst-case and statistical</li>
                  <li>• <strong>Dimensional Chain:</strong> Critical path analysis</li>
                  <li>• <strong>Accuracy Prediction:</strong> Expected vs achievable</li>
                  <li>• <strong>Process Capability:</strong> Cp/Cpk assessment</li>
                  <li>• <strong>Yield Prediction:</strong> Manufacturing success rate</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Quality Control
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Tolerance Allocation:</strong> Feature-level distribution</li>
                  <li>• <strong>Measurement Strategy:</strong> Inspection planning</li>
                  <li>• <strong>Control Limits:</strong> Statistical process control</li>
                  <li>• <strong>Risk Assessment:</strong> Manufacturing risk analysis</li>
                  <li>• <strong>SPC Recommendations:</strong> Quality monitoring</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Tolerance Stackup Methods
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Worst-Case Analysis</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Arithmetic sum of all tolerances</li>
                    <li>• Conservative approach</li>
                    <li>• Suitable for critical assemblies</li>
                    <li>• 100% confidence level</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Statistical Analysis</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Root sum of squares (RSS)</li>
                    <li>• More realistic for production</li>
                    <li>• Suitable for high-volume parts</li>
                    <li>• 99.7% confidence level (3σ)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Tolerance Classes
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Rough</strong><br/>±0.2mm
                  </div>
                  <p className="mt-1 text-xs">General purpose</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                    <strong>Standard</strong><br/>±0.1mm
                  </div>
                  <p className="mt-1 text-xs">Standard manufacturing</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Precision</strong><br/>±0.05mm
                  </div>
                  <p className="mt-1 text-xs">Precision manufacturing</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Ultra Precision</strong><br/>±0.02mm
                  </div>
                  <p className="mt-1 text-xs">Ultra-precision</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Assembly Fit Requirements
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Clearance Fits</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Loose Fit:</strong> 0.1mm clearance, easy assembly</li>
                  <li>• <strong>Standard Fit:</strong> 0.05mm clearance, normal assembly</li>
                  <li>• <strong>Precision Fit:</strong> 0.01mm clearance, careful assembly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Special Fits</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Interference Fit:</strong> -0.01mm, press fit required</li>
                  <li>• <strong>No Assembly:</strong> Single part, no fit requirement</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and part complexity</li>
              <li>Define number of features and critical dimensions</li>
              <li>Specify tolerance class and assembly requirements</li>
              <li>Choose measurement method and environment</li>
              <li>Get comprehensive tolerance stackup analysis</li>
              <li>Review quality control recommendations</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Quality Control Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Dimensional Accuracy
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Ensure parts meet dimensional requirements and assembly fit
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize tolerance allocation to minimize manufacturing cost
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Quality Assurance
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Implement statistical process control for consistent quality
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
export { calculator as toleranceStackCalculator };
