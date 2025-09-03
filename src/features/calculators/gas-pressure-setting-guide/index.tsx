'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { GasPressureSettingGuide } from './GasPressureSettingGuide';

// Create calculator instance
const calculator = new GasPressureSettingGuide();

interface GasPressureSettingGuidePageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Gas Pressure Setting Guide Page Component
 * Comprehensive gas pressure optimization for laser cutting parameters
 */
export default function GasPressureSettingGuidePage({
  initialInputs,
  onCalculationComplete
}: GasPressureSettingGuidePageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Gas Pressure Setting Analysis completed:', {
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
      console.log('Gas Pressure Setting Guide inputs changed:', inputs);
    }
  };

  return (
    <div className="gas-pressure-setting-guide-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Gas Pressure Setting Guide - Assist Gas Optimization</title>
        <meta 
          name="description" 
          content="Optimize assist gas pressure for material thickness and cutting quality. Calculate optimal pressure settings, flow rates, and cost analysis for laser cutting operations." 
        />
        <meta 
          name="keywords" 
          content="gas pressure, assist gas, pressure optimization, gas flow, cutting parameters, laser cutting, pressure setting, gas consumption" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/gas-pressure-setting-guide" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Gas Pressure Setting Guide - Assist Gas Optimization" />
        <meta property="og:description" content="Professional gas pressure optimization for laser cutting performance" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/gas-pressure-setting-guide" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Gas Pressure Setting Guide",
            "description": "Professional tool for optimizing assist gas pressure in laser cutting",
            "applicationCategory": "Process Optimization Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Pressure optimization",
              "Gas flow analysis",
              "Cost calculation",
              "Quality prediction",
              "Troubleshooting guide"
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
            Professional Gas Pressure Optimization
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Gas Pressure Setting Guide provides comprehensive optimization 
              of assist gas pressure for maximum cutting performance and quality. 
              Essential for achieving optimal melt ejection, edge quality, and 
              cost efficiency in laser cutting operations across different materials.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Pressure Analysis
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Optimal Pressure:</strong> Material-specific calculations</li>
                  <li>• <strong>Pressure Range:</strong> Minimum, maximum, tolerance</li>
                  <li>• <strong>Flow Analysis:</strong> Rate, velocity, efficiency</li>
                  <li>• <strong>Pressure Effects:</strong> Kerf, quality, dross risk</li>
                  <li>• <strong>Cost Analysis:</strong> Consumption and hourly costs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Pressure Adjustments:</strong> Fine-tuning recommendations</li>
                  <li>• <strong>Quality Improvements:</strong> Edge finish optimization</li>
                  <li>• <strong>Cost Optimizations:</strong> Gas consumption reduction</li>
                  <li>• <strong>Troubleshooting:</strong> Common issue solutions</li>
                  <li>• <strong>Alternative Settings:</strong> Performance trade-offs</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Gas Pressure Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Pressure Functions</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Melt Ejection:</strong> Remove molten material</li>
                    <li>• <strong>Atmosphere Control:</strong> Prevent oxidation</li>
                    <li>• <strong>Cooling Effect:</strong> Reduce heat damage</li>
                    <li>• <strong>Kerf Control:</strong> Maintain cut width</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Factors</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Material thickness and type</li>
                    <li>• Nozzle diameter and standoff</li>
                    <li>• Cutting speed and power</li>
                    <li>• Quality requirements</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Gas Type Recommendations
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Oxygen</strong><br/>0.5-3 bar
                  </div>
                  <p className="mt-1 text-xs">Carbon steel cutting</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Nitrogen</strong><br/>8-25 bar
                  </div>
                  <p className="mt-1 text-xs">Stainless, aluminum</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 p-2 rounded">
                    <strong>Air</strong><br/>5-20 bar
                  </div>
                  <p className="mt-1 text-xs">General purpose</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                    <strong>Argon</strong><br/>8-25 bar
                  </div>
                  <p className="mt-1 text-xs">Titanium, reactive metals</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Material-Specific Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Carbon Steel</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Oxygen:</strong> 0.8-2.5 bar, exothermic reaction</li>
                  <li>• <strong>Nitrogen:</strong> 12-20 bar, oxidation-free edges</li>
                  <li>• <strong>Pressure increases:</strong> With thickness</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Stainless Steel</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Nitrogen:</strong> 15-25 bar, prevents oxidation</li>
                  <li>• <strong>Argon:</strong> 12-22 bar, premium finish</li>
                  <li>• <strong>High pressure:</strong> Required for quality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Aluminum</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Nitrogen:</strong> 18-25 bar, high thermal conductivity</li>
                  <li>• <strong>Air:</strong> 10-20 bar, cost-effective option</li>
                  <li>• <strong>Avoid oxygen:</strong> Causes excessive oxidation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Titanium</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Argon:</strong> 16-25 bar, prevents contamination</li>
                  <li>• <strong>Nitrogen:</strong> 14-22 bar, alternative option</li>
                  <li>• <strong>Never oxygen:</strong> Causes severe oxidation</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and thickness</li>
              <li>Choose assist gas type and nozzle diameter</li>
              <li>Enter cutting speed and laser power</li>
              <li>Specify quality requirements</li>
              <li>Get optimal pressure recommendation</li>
              <li>Review flow analysis and cost implications</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Process Optimization Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cut Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize pressure for superior edge quality and minimal dross
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cost Efficiency
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Minimize gas consumption while maintaining performance
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Stability
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve consistent results with optimized pressure settings
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
export { calculator as gasPressureSettingGuide };
