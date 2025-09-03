'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { WarpingRiskCalculator } from './WarpingRiskCalculator';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new WarpingRiskCalculator();

interface WarpingRiskCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Warping Risk Calculator Page Component
 * Comprehensive warping risk analysis for thermal distortion control
 */
export default function WarpingRiskCalculatorPage({
  initialInputs,
  onCalculationComplete
}: WarpingRiskCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Warping Risk Analysis completed:', {
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
      console.log('Warping Risk Calculator inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="warping-risk-calculator"
        name="Warping Risk Calculator"
        description="Analyze warping risks and thermal distortion in laser cutting. Predict deformation, assess risk factors, and get prevention strategies for dimensional accuracy."
        category="Quality Control"
        keywords={[
          'warping risk calculator',
          'thermal distortion analysis',
          'laser cutting deformation',
          'residual stress calculator',
          'thermal stress analysis',
          'dimensional accuracy tool',
          'flatness tolerance calculator',
          'distortion prediction tool'
        ]}
        features={[
          'Comprehensive warping risk assessment',
          'Thermal stress and temperature analysis',
          'Deformation prediction and modeling',
          'Risk factor identification and scoring',
          'Prevention strategies and recommendations',
          'Support structure optimization',
          'Process parameter optimization',
          'Quality control guidelines'
        ]}
        difficulty="advanced"
        estimatedTime="< 3s"
        relatedCalculators={[
          'edge-quality-predictor',
          'laser-parameter-optimizer',
          'burn-mark-preventer',
          'tolerance-stack-calculator'
        ]}
      />
      <div className="warping-risk-calculator-page">

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
            Professional Warping Risk Analysis
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Warping Risk Calculator provides comprehensive analysis of thermal 
              distortion and warping risks in laser cutting operations. Essential for 
              maintaining dimensional accuracy, preventing costly rework, and ensuring 
              consistent quality in precision manufacturing.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Risk Assessment
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Overall Risk Score:</strong> 0-10 scale assessment</li>
                  <li>• <strong>Risk Level:</strong> Low, Medium, High, Critical</li>
                  <li>• <strong>Thermal Analysis:</strong> Temperature and stress</li>
                  <li>• <strong>Mechanical Analysis:</strong> Deformation prediction</li>
                  <li>• <strong>Geometric Factors:</strong> Shape and support effects</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Prevention Strategies
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Parameter Optimization:</strong> Power, speed, passes</li>
                  <li>• <strong>Support Design:</strong> Fixture recommendations</li>
                  <li>• <strong>Cooling Strategies:</strong> Thermal management</li>
                  <li>• <strong>Sequence Planning:</strong> Cut order optimization</li>
                  <li>• <strong>Distortion Prediction:</strong> Expected deformation</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Thermal Distortion Analysis
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Peak temperature calculation</li>
                  <li>• Temperature gradient analysis</li>
                  <li>• Thermal stress evaluation</li>
                  <li>• Cooling rate assessment</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Residual stress prediction</li>
                  <li>• Elastic/plastic deformation</li>
                  <li>• Stress concentration factors</li>
                  <li>• Heat affected area calculation</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Risk Level Classification
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Low Risk</strong><br/>0-3 Score
                  </div>
                  <p className="mt-1 text-xs">Minimal warping expected</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                    <strong>Medium Risk</strong><br/>3-6 Score
                  </div>
                  <p className="mt-1 text-xs">Some precautions needed</p>
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
                  <p className="mt-1 text-xs">Alternative approach needed</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Key Risk Factors
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Geometric Factors</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Aspect Ratio:</strong> Length to width ratio</li>
                  <li>• <strong>Thickness Ratio:</strong> Thickness to dimension ratio</li>
                  <li>• <strong>Support Adequacy:</strong> Workpiece support level</li>
                  <li>• <strong>Shape Complexity:</strong> Geometric complexity factor</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Process Factors</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Power Density:</strong> Heat input concentration</li>
                  <li>• <strong>Cutting Speed:</strong> Heat exposure time</li>
                  <li>• <strong>Number of Passes:</strong> Cumulative heat input</li>
                  <li>• <strong>Cooling Method:</strong> Heat dissipation rate</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Enter material type and part dimensions</li>
              <li>Specify cutting parameters and process settings</li>
              <li>Select support type and cooling method</li>
              <li>Get comprehensive warping risk assessment</li>
              <li>Review thermal and mechanical analysis</li>
              <li>Implement prevention strategies</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Quality Control Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Predictive Analysis
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Predict warping before cutting to prevent dimensional issues
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Reduction
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Reduce scrap and rework through better process planning
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize parameters and support for minimal distortion
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
export { calculator as warpingRiskCalculator };
