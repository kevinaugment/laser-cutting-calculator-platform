'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { MultiplePassCalculator } from './MultiplePassCalculator';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new MultiplePassCalculator();

interface MultiplePassCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Multiple Pass Calculator Page Component
 * Comprehensive multi-pass cutting optimization for thick materials
 */
export default function MultiplePassCalculatorPage({
  initialInputs,
  onCalculationComplete
}: MultiplePassCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Multiple Pass Analysis completed:', {
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
      console.log('Multiple Pass Calculator inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="multiple-pass-calculator"
        name="Multiple Pass Calculator"
        description="Optimize multi-pass cutting strategy for thick materials and complex geometries. Calculate pass parameters, time analysis, quality prediction, and cost optimization."
        category="Process Optimization"
        keywords={[
          'multiple pass calculator',
          'multi-pass cutting optimization',
          'thick material cutting',
          'cutting strategy calculator',
          'pass parameter optimization',
          'laser cutting thick materials',
          'multi-pass laser cutting',
          'cutting process optimization'
        ]}
        features={[
          'Pass strategy optimization',
          'Parameter calculation for each pass',
          'Time analysis and optimization',
          'Quality prediction',
          'Cost analysis and comparison',
          'Material-specific strategies',
          'Process recommendations',
          'Multi-pass efficiency analysis'
        ]}
        difficulty="advanced"
        estimatedTime="< 3s"
        relatedCalculators={[
          'power-speed-matching-calculator',
          'cutting-time-estimator',
          'laser-parameter-optimizer',
          'material-selection-assistant'
        ]}
      />
      <div className="multiple-pass-calculator-page">

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
            Professional Multi-Pass Cutting Optimization
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Multiple Pass Calculator provides comprehensive optimization 
              of multi-pass cutting strategies for thick materials and complex geometries. 
              Essential for achieving optimal pass parameters, time efficiency, 
              quality consistency, and cost control in challenging cutting applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Strategy Analysis
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Pass Strategy:</strong> Optimal number and depth calculation</li>
                  <li>• <strong>Pass Parameters:</strong> Power, speed, pressure per pass</li>
                  <li>• <strong>Time Analysis:</strong> Total time and efficiency metrics</li>
                  <li>• <strong>Quality Prediction:</strong> Edge quality and consistency</li>
                  <li>• <strong>Cost Analysis:</strong> Material, energy, labor costs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Strategy Options:</strong> Progressive, adaptive, uniform</li>
                  <li>• <strong>Parameter Tuning:</strong> Pass-specific optimization</li>
                  <li>• <strong>Quality Control:</strong> Consistency and finish prediction</li>
                  <li>• <strong>Cost Optimization:</strong> Material and time efficiency</li>
                  <li>• <strong>Process Guidance:</strong> Setup and troubleshooting</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Multi-Pass Cutting Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Benefits</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Thick Materials:</strong> Cut beyond single-pass limits</li>
                    <li>• <strong>Quality Control:</strong> Better edge finish and accuracy</li>
                    <li>• <strong>Heat Management:</strong> Reduced thermal effects</li>
                    <li>• <strong>Reliability:</strong> Higher success rate vs single pass</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Applications</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Thick plate cutting (&gt;10mm)</li>
                    <li>• Precision applications</li>
                    <li>• Complex geometries</li>
                    <li>• High-quality requirements</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Cutting Strategies
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Progressive</strong><br/>Power Reduction
                  </div>
                  <p className="mt-1 text-xs">Reduces heat buildup</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Adaptive</strong><br/>Material Based
                  </div>
                  <p className="mt-1 text-xs">Optimizes for properties</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Uniform</strong><br/>Consistent Parameters
                  </div>
                  <p className="mt-1 text-xs">Simple and reliable</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                    <strong>Quality</strong><br/>Finish Focused
                  </div>
                  <p className="mt-1 text-xs">Maximum quality</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Material-Specific Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Low Work-Hardening Materials</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Carbon Steel:</strong> 2-4 passes, progressive power</li>
                  <li>• <strong>Aluminum:</strong> 2-3 passes, higher speeds</li>
                  <li>• <strong>Brass:</strong> 2-4 passes, moderate parameters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">High Work-Hardening Materials</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Stainless Steel:</strong> 3-5 passes, adaptive strategy</li>
                  <li>• <strong>Titanium:</strong> 3-6 passes, quality focused</li>
                  <li>• <strong>Copper:</strong> 2-4 passes, thermal management</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Pass Parameter Optimization
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">First Pass</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• High power (90% max)</li>
                  <li>• Moderate speed</li>
                  <li>• Establish cut path</li>
                  <li>• Remove bulk material</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Middle Passes</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Medium power (70-80%)</li>
                  <li>• Consistent speed</li>
                  <li>• Progressive removal</li>
                  <li>• Heat management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Final Pass</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Lower power (60-70%)</li>
                  <li>• Slower speed</li>
                  <li>• Quality focus</li>
                  <li>• Edge finishing</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and thickness</li>
              <li>Define laser system and single-pass limits</li>
              <li>Choose cutting strategy and quality requirements</li>
              <li>Get optimal pass strategy recommendation</li>
              <li>Review detailed pass-by-pass parameters</li>
              <li>Analyze time, quality, and cost implications</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Process Optimization Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Capability
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Cut materials beyond single-pass thickness limits
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve superior edge quality and dimensional accuracy
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Reliability
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Higher success rate and consistent results
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
export { calculator as multiplePassCalculator };
