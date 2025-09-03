'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { FocusHeightCalculator } from './FocusHeightCalculator';

// Create calculator instance
const calculator = new FocusHeightCalculator();

interface FocusHeightCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Focus Height Calculator Page Component
 * Comprehensive focus height optimization for laser cutting precision
 */
export default function FocusHeightCalculatorPage({
  initialInputs,
  onCalculationComplete
}: FocusHeightCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Focus Height Analysis completed:', {
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
      console.log('Focus Height Calculator inputs changed:', inputs);
    }
  };

  return (
    <div className="focus-height-calculator-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Focus Height Calculator - Laser Focus Position Optimization</title>
        <meta 
          name="description" 
          content="Calculate optimal focus position for precision laser cutting and processing. Optimize focus height for different materials, applications, and quality requirements with beam analysis." 
        />
        <meta 
          name="keywords" 
          content="focus height, laser focus, focus position, beam characteristics, depth of focus, laser precision, focus optimization, cutting quality" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/focus-height-calculator" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Focus Height Calculator - Laser Focus Position Optimization" />
        <meta property="og:description" content="Professional focus height optimization for laser cutting precision" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/focus-height-calculator" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Focus Height Calculator",
            "description": "Professional tool for optimizing laser focus position and beam characteristics",
            "applicationCategory": "Process Optimization Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Focus position optimization",
              "Beam characteristics analysis",
              "Quality prediction",
              "Sensitivity analysis",
              "Adjustment guidance"
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
            Professional Focus Height Optimization
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Focus Height Calculator provides comprehensive optimization 
              of laser focus position for maximum cutting precision and quality. 
              Essential for achieving optimal beam characteristics, depth of focus, 
              and processing results across different materials and applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Focus Analysis
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Optimal Position:</strong> Material-specific calculations</li>
                  <li>• <strong>Beam Characteristics:</strong> Spot size, power density</li>
                  <li>• <strong>Depth of Focus:</strong> Rayleigh range analysis</li>
                  <li>• <strong>Quality Prediction:</strong> Edge quality assessment</li>
                  <li>• <strong>Sensitivity Analysis:</strong> Focus tolerance evaluation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Position Table:</strong> Application-specific options</li>
                  <li>• <strong>Setup Instructions:</strong> Step-by-step guidance</li>
                  <li>• <strong>Calibration Steps:</strong> Precision adjustment</li>
                  <li>• <strong>Troubleshooting:</strong> Common issue solutions</li>
                  <li>• <strong>Maintenance Tips:</strong> System care recommendations</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Focus Position Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Concepts</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Spot Size:</strong> Focused beam diameter</li>
                    <li>• <strong>Rayleigh Range:</strong> Focus depth tolerance</li>
                    <li>• <strong>Power Density:</strong> Energy concentration</li>
                    <li>• <strong>Beam Quality:</strong> M² factor impact</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Applications</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Through cutting optimization</li>
                    <li>• Surface engraving precision</li>
                    <li>• Marking and etching control</li>
                    <li>• Welding focus positioning</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Focus Position Strategies
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Surface</strong><br/>0mm
                  </div>
                  <p className="mt-1 text-xs">Engraving, marking</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Shallow</strong><br/>-t/3
                  </div>
                  <p className="mt-1 text-xs">Thin material cutting</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded">
                    <strong>Mid-thickness</strong><br/>-t/2
                  </div>
                  <p className="mt-1 text-xs">Balanced edge quality</p>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Deep</strong><br/>-0.6t
                  </div>
                  <p className="mt-1 text-xs">Thick material cutting</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Laser Type Characteristics
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fiber Laser (1070nm)</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Spot Size:</strong> Excellent (M² ≈ 1.1)</li>
                  <li>• <strong>Best for:</strong> Metals, precision cutting</li>
                  <li>• <strong>Focus Tolerance:</strong> Tight (±0.1mm)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">CO₂ Laser (10.6μm)</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Spot Size:</strong> Very good (M² ≈ 1.05)</li>
                  <li>• <strong>Best for:</strong> Non-metals, organics</li>
                  <li>• <strong>Focus Tolerance:</strong> Moderate (±0.2mm)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nd:YAG Laser (1064nm)</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Spot Size:</strong> Good (M² ≈ 1.2)</li>
                  <li>• <strong>Best for:</strong> Welding, marking</li>
                  <li>• <strong>Focus Tolerance:</strong> Moderate (±0.15mm)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Diode Laser (808-980nm)</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Spot Size:</strong> Fair (M² ≈ 2.0)</li>
                  <li>• <strong>Best for:</strong> Low-power applications</li>
                  <li>• <strong>Focus Tolerance:</strong> Relaxed (±0.3mm)</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and thickness</li>
              <li>Choose laser type and optical parameters</li>
              <li>Specify cutting application and quality requirements</li>
              <li>Get optimal focus position recommendation</li>
              <li>Review beam characteristics and depth of focus</li>
              <li>Follow setup and calibration guidance</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Process Optimization Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Precision
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve optimal focus position for maximum cutting precision
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize edge quality and minimize heat affected zone
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Consistency
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Maintain consistent results with proper focus control
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
export { calculator as focusHeightCalculator };
