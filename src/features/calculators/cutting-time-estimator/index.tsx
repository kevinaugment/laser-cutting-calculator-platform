'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { CuttingTimeEstimator } from './CuttingTimeEstimator';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new CuttingTimeEstimator();

interface CuttingTimeEstimatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Cutting Time Estimator Page Component
 * Accurate cutting time estimation for production planning
 */
export default function CuttingTimeEstimatorPage({
  initialInputs,
  onCalculationComplete
}: CuttingTimeEstimatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Cutting Time Estimation completed:', {
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
      console.log('Cutting Time Estimator inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="cutting-time-estimator"
        name="Cutting Time Estimator"
        description="Accurate cutting time estimation for laser cutting operations. Calculate piercing time, cutting time, and total cycle time for precise production planning and capacity optimization."
        category="Production Planning"
        keywords={[
          'cutting time estimator',
          'laser cutting time calculator',
          'production time planning',
          'cycle time calculator',
          'piercing time calculator',
          'manufacturing time estimation',
          'production capacity planning',
          'cutting speed optimization'
        ]}
        features={[
          'Accurate time estimation',
          'Piercing time calculation',
          'Cutting speed optimization',
          'Production capacity metrics',
          'Time breakdown analysis',
          'Batch processing support',
          'Material-specific calculations',
          'Export time reports'
        ]}
        difficulty="intermediate"
        estimatedTime="< 1s"
        relatedCalculators={[
          'production-capacity-planner',
          'job-queue-optimizer',
          'batch-processing-calculator',
          'setup-time-calculator'
        ]}
      />
      <div className="cutting-time-estimator-page">

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
            Professional Cutting Time Estimation
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Cutting Time Estimator provides accurate time calculations for laser cutting 
              operations, enabling precise production planning and capacity management. 
              Essential for manufacturing engineers and production planners.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Supported Materials
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Carbon Steel:</strong> 0.5-25mm thickness range</li>
                  <li>• <strong>Stainless Steel:</strong> 0.5-20mm thickness range</li>
                  <li>• <strong>Aluminum:</strong> 0.5-20mm thickness range</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Time Components
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Piercing Time:</strong> Material-specific pierce calculations</li>
                  <li>• <strong>Cutting Time:</strong> Speed-optimized cutting estimates</li>
                  <li>• <strong>Moving Time:</strong> Rapid traverse and positioning</li>
                  <li>• <strong>Total Time:</strong> Complete cycle time analysis</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Production Planning Features
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Accurate time breakdown analysis</li>
                  <li>• Production efficiency calculations</li>
                  <li>• Capacity planning metrics</li>
                  <li>• Pierce density optimization</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Power-to-thickness ratio analysis</li>
                  <li>• Material-specific speed databases</li>
                  <li>• Real-time validation warnings</li>
                  <li>• Professional recommendations</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select your material type and thickness</li>
              <li>Enter total cutting length and pierce count</li>
              <li>Specify laser power setting</li>
              <li>Get detailed time breakdown and analysis</li>
              <li>Review production capacity metrics</li>
              <li>Export results for production planning</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Manufacturing Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Accurate Planning
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Precise time estimates for reliable delivery schedules
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Capacity Management
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize machine utilization and production throughput
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Control
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Better time estimates lead to more accurate cost quotes
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
export { calculator as cuttingTimeEstimator };
