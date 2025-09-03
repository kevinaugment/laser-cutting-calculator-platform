'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { HeatAffectedZoneCalculator } from './HeatAffectedZoneCalculator';

// Create calculator instance
const calculator = new HeatAffectedZoneCalculator();

interface HeatAffectedZoneCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Heat Affected Zone Calculator Page Component
 * Comprehensive HAZ analysis for thermal control in laser cutting
 */
export default function HeatAffectedZoneCalculatorPage({
  initialInputs,
  onCalculationComplete
}: HeatAffectedZoneCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Heat Affected Zone Analysis completed:', {
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
      console.log('Heat Affected Zone Calculator inputs changed:', inputs);
    }
  };

  return (
    <div className="heat-affected-zone-calculator-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Heat Affected Zone Calculator - Thermal Analysis for Laser Cutting</title>
        <meta 
          name="description" 
          content="Calculate and analyze heat affected zone (HAZ) in laser cutting. Comprehensive thermal analysis including temperature profiles, microstructure changes, and control recommendations." 
        />
        <meta 
          name="keywords" 
          content="heat affected zone, HAZ calculator, thermal analysis, laser cutting, microstructure, temperature profile, thermal stress, cooling rate" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/heat-affected-zone-calculator" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Heat Affected Zone Calculator - Thermal Analysis Tool" />
        <meta property="og:description" content="Professional HAZ analysis for laser cutting thermal control" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/heat-affected-zone-calculator" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Heat Affected Zone Calculator",
            "description": "Professional tool for analyzing heat affected zones in laser cutting",
            "applicationCategory": "Engineering Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "HAZ dimension calculation",
              "Temperature profile analysis",
              "Microstructure change prediction",
              "Thermal stress analysis",
              "Control recommendations"
            ]
          })}
        </script>
      </head>

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
            Professional Heat Affected Zone Analysis
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Heat Affected Zone Calculator provides comprehensive thermal analysis 
              for laser cutting operations. Essential for quality control, material 
              property prediction, and process optimization in precision manufacturing.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Supported Materials
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Carbon Steel:</strong> Structural applications</li>
                  <li>• <strong>Stainless Steel:</strong> Corrosion-resistant alloys</li>
                  <li>• <strong>Aluminum:</strong> Lightweight applications</li>
                  <li>• <strong>Copper:</strong> High conductivity materials</li>
                  <li>• <strong>Titanium:</strong> Aerospace-grade alloys</li>
                  <li>• <strong>Brass:</strong> Decorative and marine applications</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Analysis Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>HAZ Dimensions:</strong> Width, depth, and volume</li>
                  <li>• <strong>Temperature Profile:</strong> Spatial temperature distribution</li>
                  <li>• <strong>Cooling Rate:</strong> Thermal cycle analysis</li>
                  <li>• <strong>Microstructure:</strong> Grain growth and phase changes</li>
                  <li>• <strong>Thermal Stress:</strong> Distortion risk assessment</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Thermal Analysis Capabilities
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Peak temperature calculation</li>
                  <li>• Heat input per unit length</li>
                  <li>• Energy density analysis</li>
                  <li>• Thermal diffusion modeling</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Pulse frequency effects</li>
                  <li>• Material-specific factors</li>
                  <li>• Thermal stress prediction</li>
                  <li>• Process optimization guidance</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and enter dimensions</li>
              <li>Specify laser power and cutting speed</li>
              <li>Set beam diameter and pulse frequency (optional)</li>
              <li>Get comprehensive HAZ analysis</li>
              <li>Review temperature profiles and microstructure changes</li>
              <li>Implement control recommendations</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Quality Control Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Material Properties
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Predict changes in hardness, strength, and microstructure
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Control
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize parameters to minimize HAZ and thermal effects
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Quality Assurance
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Ensure consistent quality and meet specifications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Export the calculator instance for testing and integration
export { calculator as heatAffectedZoneCalculator };
