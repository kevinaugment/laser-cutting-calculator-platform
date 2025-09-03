'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { LaserParameterOptimizer } from './LaserParameterOptimizer';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new LaserParameterOptimizer();

interface LaserParameterOptimizerPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Laser Parameter Optimizer Page Component
 * Flagship AI-enhanced calculator for optimizing laser cutting parameters
 */
export default function LaserParameterOptimizerPage({
  initialInputs,
  onCalculationComplete
}: LaserParameterOptimizerPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Laser Parameter Optimization completed:', {
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
      console.log('Laser Parameter Optimizer inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="laser-parameter-optimizer"
        name="Laser Parameter Optimizer"
        description="AI-enhanced laser parameter optimization for superior cutting performance. Optimize power, speed, gas settings, and focus position for any material and thickness combination with precision engineering."
        category="Process Optimization"
        keywords={[
          'laser parameter optimizer',
          'laser cutting parameter optimization',
          'cutting parameter calculator',
          'laser power optimization',
          'cutting speed optimization',
          'gas pressure settings',
          'focus position calculator',
          'laser cutting optimization'
        ]}
        features={[
          'AI-enhanced parameter optimization',
          'Multi-material support',
          'Power and speed optimization',
          'Gas pressure and flow settings',
          'Focus position calculation',
          'Quality prediction analysis',
          'Alternative parameter sets',
          'Performance comparison tools'
        ]}
        difficulty="advanced"
        estimatedTime="< 3s"
        relatedCalculators={[
          'edge-quality-predictor',
          'cutting-time-estimator',
          'power-speed-matching',
          'gas-pressure-setting-guide'
        ]}
      />
      <div className="laser-parameter-optimizer-page">

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
            Professional Laser Parameter Optimization
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our AI-enhanced Laser Parameter Optimizer is the industry's most advanced tool for 
              optimizing laser cutting parameters. Designed for professional engineers and 
              manufacturing specialists, it provides precise parameter recommendations for 
              maximum efficiency and quality.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Supported Laser Types
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Fiber Lasers:</strong> Optimal for metals, high efficiency</li>
                  <li>• <strong>CO2 Lasers:</strong> Versatile for various materials</li>
                  <li>• <strong>Nd:YAG Lasers:</strong> Precision applications</li>
                  <li>• <strong>Disk Lasers:</strong> High-power industrial cutting</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Material Coverage
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Carbon Steel:</strong> Construction and fabrication</li>
                  <li>• <strong>Stainless Steel:</strong> Food grade and medical</li>
                  <li>• <strong>Aluminum:</strong> Aerospace and automotive</li>
                  <li>• <strong>Copper & Brass:</strong> Electrical and decorative</li>
                  <li>• <strong>Titanium:</strong> High-performance applications</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                AI-Enhanced Optimization Features
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Intelligent power optimization</li>
                  <li>• Speed-quality balance analysis</li>
                  <li>• Material-laser compatibility checking</li>
                  <li>• Gas pressure recommendations</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Focus position calculation</li>
                  <li>• Quality prediction modeling</li>
                  <li>• Efficiency optimization</li>
                  <li>• Real-time parameter validation</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select your material type and laser system</li>
              <li>Enter material thickness and maximum available power</li>
              <li>Choose your required quality level</li>
              <li>Get AI-optimized parameters instantly</li>
              <li>Review recommendations and warnings</li>
              <li>Export results for production use</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Professional Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Increased Efficiency
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize cutting speed and power for maximum throughput
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Better Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve consistent, high-quality cuts with minimal defects
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Reduction
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Reduce material waste and energy consumption
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
export { calculator as laserParameterOptimizer };
