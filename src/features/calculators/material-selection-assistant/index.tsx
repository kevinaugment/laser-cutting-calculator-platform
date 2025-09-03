'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { MaterialSelectionAssistant } from './MaterialSelectionAssistant';
import CalculatorSEOHead from '@/components/seo/CalculatorSEOHead';

// Create calculator instance
const calculator = new MaterialSelectionAssistant();

interface MaterialSelectionAssistantPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Material Selection Assistant Page Component
 * AI-enhanced material selection based on application requirements
 */
export default function MaterialSelectionAssistantPage({
  initialInputs,
  onCalculationComplete
}: MaterialSelectionAssistantPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Material Selection completed:', {
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
      console.log('Material Selection Assistant inputs changed:', inputs);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="material-selection-assistant"
        name="Material Selection Assistant"
        description="AI-enhanced material selection assistant for laser cutting. Get expert recommendations based on application requirements, strength needs, corrosion resistance, and budget constraints."
        category="Engineering Support"
        keywords={[
          'material selection assistant',
          'laser cutting materials',
          'steel selection calculator',
          'aluminum selection guide',
          'stainless steel selection',
          'material properties calculator',
          'engineering materials guide',
          'material recommendation system'
        ]}
        features={[
          'AI-enhanced material recommendations',
          'Multi-criteria analysis and scoring',
          'Cost-performance optimization',
          'Comprehensive material database',
          'Application-specific guidance',
          'Cutting parameter recommendations',
          'Material property comparisons',
          'Budget-conscious suggestions'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'laser-parameter-optimizer',
          'cutting-time-estimator',
          'laser-cutting-cost',
          'edge-quality-predictor'
        ]}
      />
      <div className="material-selection-assistant-page">

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
            AI-Enhanced Material Selection
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Material Selection Assistant uses advanced AI algorithms to recommend 
              the optimal materials for your laser cutting projects. Get expert guidance 
              based on application requirements, performance needs, and budget constraints.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Supported Applications
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Structural:</strong> Construction and framework</li>
                  <li>• <strong>Decorative:</strong> Architectural and aesthetic</li>
                  <li>• <strong>Automotive:</strong> Vehicle components</li>
                  <li>• <strong>Aerospace:</strong> High-performance applications</li>
                  <li>• <strong>Marine:</strong> Saltwater environments</li>
                  <li>• <strong>Food Grade:</strong> Hygienic applications</li>
                  <li>• <strong>Medical:</strong> Biocompatible requirements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Material Database
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Carbon Steel:</strong> Cost-effective structural</li>
                  <li>• <strong>Stainless Steel 304/316:</strong> Corrosion resistant</li>
                  <li>• <strong>Aluminum 6061/7075:</strong> Lightweight options</li>
                  <li>• <strong>Titanium:</strong> High-performance alloys</li>
                  <li>• <strong>Copper:</strong> Conductive applications</li>
                  <li>• <strong>Brass:</strong> Decorative and marine</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                AI Selection Criteria
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Mechanical strength requirements</li>
                  <li>• Corrosion resistance needs</li>
                  <li>• Application-specific suitability</li>
                  <li>• Cost-effectiveness analysis</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Cutting parameter compatibility</li>
                  <li>• Weldability and formability</li>
                  <li>• Industry standards compliance</li>
                  <li>• Availability and sourcing</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select your application type and requirements</li>
              <li>Specify strength and corrosion resistance needs</li>
              <li>Set your budget constraints</li>
              <li>Get AI-ranked material recommendations</li>
              <li>Review detailed pros/cons analysis</li>
              <li>Access cutting parameter guidance</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Engineering Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Optimal Selection
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    AI-driven recommendations ensure the best material for your needs
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Balance performance requirements with budget constraints
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Expert Guidance
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Professional insights on material properties and applications
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
export { calculator as materialSelectionAssistant };
