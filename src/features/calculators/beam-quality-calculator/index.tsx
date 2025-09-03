'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { BeamQualityCalculator } from './BeamQualityCalculator';

// Create calculator instance
const calculator = new BeamQualityCalculator();

interface BeamQualityCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Beam Quality Calculator Page Component
 * Comprehensive beam quality analysis for laser cutting optimization
 */
export default function BeamQualityCalculatorPage({
  initialInputs,
  onCalculationComplete
}: BeamQualityCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Beam Quality Analysis completed:', {
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
      console.log('Beam Quality Calculator inputs changed:', inputs);
    }
  };

  return (
    <div className="beam-quality-calculator-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Beam Quality Calculator - Laser Optical Performance Analysis</title>
        <meta 
          name="description" 
          content="Analyze laser beam quality with M² factor, beam parameter product, and optical performance metrics. Optimize cutting performance through comprehensive beam analysis." 
        />
        <meta 
          name="keywords" 
          content="beam quality, M squared factor, laser optics, beam parameter product, Rayleigh length, power density, laser performance, optical analysis" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/beam-quality-calculator" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Beam Quality Calculator - Laser Optical Analysis Tool" />
        <meta property="og:description" content="Professional beam quality analysis for laser cutting optimization" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/beam-quality-calculator" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Beam Quality Calculator",
            "description": "Professional tool for analyzing laser beam quality and optical performance",
            "applicationCategory": "Engineering Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "M² factor calculation",
              "Beam parameter product analysis",
              "Power density calculation",
              "Optical performance assessment",
              "Cutting performance prediction"
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
            Professional Beam Quality Analysis
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Beam Quality Calculator provides comprehensive optical analysis 
              for laser systems. Essential for optimizing cutting performance, 
              understanding beam propagation, and ensuring optimal laser utilization 
              in precision manufacturing applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Supported Laser Types
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Fiber Lasers:</strong> Excellent beam quality (M² ≈ 1.1)</li>
                  <li>• <strong>CO2 Lasers:</strong> Near-diffraction limited (M² ≈ 1.05)</li>
                  <li>• <strong>Nd:YAG Lasers:</strong> Good beam quality (M² ≈ 1.2)</li>
                  <li>• <strong>Disk Lasers:</strong> High power, excellent quality</li>
                  <li>• <strong>Diode Lasers:</strong> Cost-effective, moderate quality</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Key Metrics
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>M² Factor:</strong> Beam quality parameter</li>
                  <li>• <strong>BPP:</strong> Beam parameter product</li>
                  <li>• <strong>Rayleigh Length:</strong> Beam propagation distance</li>
                  <li>• <strong>Spot Size:</strong> Focused beam diameter</li>
                  <li>• <strong>Power Density:</strong> Intensity at focus</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Optical Analysis Features
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Diffraction limit calculation</li>
                  <li>• Beam propagation modeling</li>
                  <li>• Focusability assessment</li>
                  <li>• Numerical aperture analysis</li>
                </ul>
                <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                  <li>• Coherence length estimation</li>
                  <li>• Brightness calculation</li>
                  <li>• Cutting performance prediction</li>
                  <li>• Quality grade classification</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Understanding Beam Quality
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">M² Factor Interpretation:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• <strong>M² ≤ 1.1:</strong> Excellent beam quality (near-diffraction limited)</li>
                <li>• <strong>1.1 &lt; M² ≤ 1.3:</strong> Good beam quality (high-performance cutting)</li>
                <li>• <strong>1.3 &lt; M² ≤ 2.0:</strong> Fair beam quality (general applications)</li>
                <li>• <strong>M² &gt; 2.0:</strong> Poor beam quality (limited precision)</li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select laser type and specify wavelength</li>
              <li>Enter power and beam diameter measurements</li>
              <li>Provide divergence angle and focal length (optional)</li>
              <li>Get comprehensive beam quality analysis</li>
              <li>Review optical performance metrics</li>
              <li>Implement optimization recommendations</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Performance Optimization Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Cutting Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Better beam quality leads to superior edge quality and precision
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Efficiency
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize power density for maximum cutting speed
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    System Design
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Select optimal optics and laser parameters
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
export { calculator as beamQualityCalculator };
