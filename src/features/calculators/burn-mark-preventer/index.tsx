'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { BurnMarkPreventer } from './BurnMarkPreventer';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new BurnMarkPreventer();

interface BurnMarkPreventerPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Burn Mark Preventer Page Component
 * Comprehensive burn mark prevention and thermal damage control
 */
export default function BurnMarkPreventerPage({
  initialInputs,
  onCalculationComplete
}: BurnMarkPreventerPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Burn Mark Prevention Analysis completed:', {
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
      console.log('Burn Mark Preventer inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="burn-mark-preventer"
        name="Burn Mark Preventer"
        description="Prevent burn marks and thermal damage in laser cutting. Optimize parameters, gas selection, and surface preparation for superior cut quality and minimal heat damage."
        category="Quality Control"
        keywords={[
          'burn mark preventer',
          'thermal damage prevention',
          'laser cutting quality control',
          'oxidation prevention tool',
          'surface protection calculator',
          'heat damage control',
          'cutting optimization guide',
          'burn risk assessment'
        ]}
        features={[
          'Comprehensive burn risk assessment',
          'Thermal damage analysis and prediction',
          'Parameter optimization recommendations',
          'Gas selection and flow guidance',
          'Surface preparation strategies',
          'Material-specific prevention methods',
          'Quality control guidelines',
          'Process optimization suggestions'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'edge-quality-predictor',
          'warping-risk-calculator',
          'laser-parameter-optimizer',
          'dross-formation-calculator'
        ]}
      />
      <div className="burn-mark-preventer-page">

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
            Professional Burn Mark Prevention
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Burn Mark Preventer provides comprehensive analysis and prevention 
              strategies for thermal damage in laser cutting operations. Essential for 
              maintaining surface quality, preventing oxidation, and ensuring consistent 
              results in precision manufacturing applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Risk Assessment
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Burn Risk Level:</strong> Low, Medium, High, Critical</li>
                  <li>• <strong>Risk Score:</strong> 0-10 scale assessment</li>
                  <li>• <strong>Thermal Analysis:</strong> Heat input and temperature</li>
                  <li>• <strong>Oxidation Risk:</strong> Surface damage prediction</li>
                  <li>• <strong>Factor Analysis:</strong> Multi-dimensional risk factors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Prevention Strategies
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Parameter Optimization:</strong> Power, speed, pressure</li>
                  <li>• <strong>Gas Selection:</strong> Optimal gas type and flow</li>
                  <li>• <strong>Surface Preparation:</strong> Cleaning and conditioning</li>
                  <li>• <strong>Process Modifications:</strong> Cutting techniques</li>
                  <li>• <strong>Quality Prediction:</strong> Expected outcomes</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Thermal Damage Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Heat input calculation (J/mm)</li>
                  <li>• Surface temperature prediction</li>
                  <li>• Oxidation risk assessment</li>
                  <li>• Thermal stress evaluation</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Cooling rate optimization</li>
                  <li>• Material susceptibility analysis</li>
                  <li>• Gas effectiveness evaluation</li>
                  <li>• Surface condition impact</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Burn Risk Classification
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Low Risk</strong><br/>0-2.5 Score
                  </div>
                  <p className="mt-1 text-xs">Minimal burn marks expected</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                    <strong>Medium Risk</strong><br/>2.5-5.0 Score
                  </div>
                  <p className="mt-1 text-xs">Some prevention needed</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>High Risk</strong><br/>5.0-7.5 Score
                  </div>
                  <p className="mt-1 text-xs">Prevention strategies required</p>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Critical Risk</strong><br/>7.5-10 Score
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
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">High Susceptibility Materials</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Titanium:</strong> Use argon, avoid oxygen completely</li>
                  <li>• <strong>Aluminum:</strong> Use nitrogen, high purity required</li>
                  <li>• <strong>Stainless Steel:</strong> Nitrogen preferred for clean cuts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Surface Preparation</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Clean:</strong> Optimal cutting conditions</li>
                  <li>• <strong>Oily:</strong> Degrease before cutting</li>
                  <li>• <strong>Oxidized:</strong> Remove rust and scale</li>
                  <li>• <strong>Coated:</strong> Remove or adjust parameters</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and enter dimensions</li>
              <li>Specify cutting parameters and gas settings</li>
              <li>Indicate surface condition and environment</li>
              <li>Get comprehensive burn risk assessment</li>
              <li>Review thermal damage analysis</li>
              <li>Implement prevention strategies</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Quality Control Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Surface Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Prevent burn marks and maintain superior surface finish
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Reduction
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Reduce rework and scrap through better process control
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize parameters for minimal thermal damage
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
export { calculator as burnMarkPreventer };
