'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { PowerSpeedMatchingCalculator } from './PowerSpeedMatchingCalculator';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new PowerSpeedMatchingCalculator();

interface PowerSpeedMatchingCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Power-Speed Matching Calculator Page Component
 * Comprehensive power-speed optimization for laser cutting parameters
 */
export default function PowerSpeedMatchingCalculatorPage({
  initialInputs,
  onCalculationComplete
}: PowerSpeedMatchingCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Power-Speed Matching Analysis completed:', {
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
      console.log('Power-Speed Matching Calculator inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="power-speed-matching-calculator"
        name="Power-Speed Matching Calculator"
        description="Optimize laser power and cutting speed for ideal cutting performance. Calculate optimal power-speed combinations for different materials, thicknesses, and quality requirements."
        category="Process Optimization"
        keywords={[
          'power speed matching calculator',
          'laser parameter optimization',
          'cutting speed optimization',
          'power density calculator',
          'laser efficiency optimization',
          'process parameter matching',
          'cutting performance optimization',
          'laser power calculator'
        ]}
        features={[
          'Power-speed optimization',
          'Performance prediction',
          'Alternative settings analysis',
          'Efficiency analysis',
          'Process recommendations',
          'Material-specific optimization',
          'Quality requirement matching',
          'Multi-goal optimization'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'laser-parameter-optimizer',
          'cutting-time-estimator',
          'edge-quality-predictor',
          'gas-consumption-calculator'
        ]}
      />
      <div className="power-speed-matching-calculator-page">

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
            Professional Power-Speed Optimization
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Power-Speed Matching Calculator provides comprehensive optimization 
              of laser power and cutting speed combinations for maximum cutting performance. 
              Essential for achieving optimal productivity, quality, and efficiency in 
              laser cutting operations across different materials and applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Analysis
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Optimal Settings:</strong> Power, speed, density calculations</li>
                  <li>• <strong>Performance Prediction:</strong> Efficiency and quality metrics</li>
                  <li>• <strong>Alternative Options:</strong> Speed, quality, efficiency variants</li>
                  <li>• <strong>Utilization Analysis:</strong> Power and speed optimization</li>
                  <li>• <strong>Energy Efficiency:</strong> Specific energy calculations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Process Recommendations
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Parameter Adjustments:</strong> Fine-tuning suggestions</li>
                  <li>• <strong>Quality Tips:</strong> Cut quality optimization</li>
                  <li>• <strong>Efficiency Tips:</strong> Productivity improvements</li>
                  <li>• <strong>Troubleshooting:</strong> Common issue solutions</li>
                  <li>• <strong>Material Compatibility:</strong> Laser-material matching</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Power-Speed Optimization Strategies
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Priority Goals</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Maximum Speed:</strong> Highest productivity</li>
                    <li>• <strong>Best Quality:</strong> Superior edge finish</li>
                    <li>• <strong>Energy Efficiency:</strong> Lowest power consumption</li>
                    <li>• <strong>Balanced:</strong> Optimal overall performance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Metrics</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Power density (W/mm²)</li>
                    <li>• Specific energy (J/mm³)</li>
                    <li>• Cutting efficiency (%)</li>
                    <li>• Edge quality (1-10 scale)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Quality Requirements
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Rough Cut</strong><br/>Ra 6.3
                  </div>
                  <p className="mt-1 text-xs">High speed, basic quality</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                    <strong>Standard</strong><br/>Ra 3.2
                  </div>
                  <p className="mt-1 text-xs">Balanced performance</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Precision</strong><br/>Ra 1.6
                  </div>
                  <p className="mt-1 text-xs">High quality finish</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Mirror</strong><br/>Ra 0.8
                  </div>
                  <p className="mt-1 text-xs">Premium finish</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Laser Type Compatibility
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fiber Laser</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Best for:</strong> Steel, stainless steel</li>
                  <li>• <strong>Wavelength:</strong> 1.06 μm</li>
                  <li>• <strong>Efficiency:</strong> 90%</li>
                  <li>• <strong>Beam Quality:</strong> Excellent</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">CO2 Laser</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Best for:</strong> Aluminum, copper, organics</li>
                  <li>• <strong>Wavelength:</strong> 10.6 μm</li>
                  <li>• <strong>Efficiency:</strong> 70%</li>
                  <li>• <strong>Beam Quality:</strong> Good</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Diode Laser</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Best for:</strong> Thin materials</li>
                  <li>• <strong>Wavelength:</strong> 0.98 μm</li>
                  <li>• <strong>Efficiency:</strong> 80%</li>
                  <li>• <strong>Beam Quality:</strong> Moderate</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and thickness</li>
              <li>Choose laser type and maximum power</li>
              <li>Specify assist gas and quality requirements</li>
              <li>Set optimization priority goal</li>
              <li>Get optimal power-speed combination</li>
              <li>Review alternative settings and recommendations</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Process Optimization Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Productivity
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Maximize cutting speed while maintaining quality standards
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Efficiency
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize energy consumption and reduce operating costs
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve consistent cut quality with optimal parameters
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
export { calculator as powerSpeedMatchingCalculator };
