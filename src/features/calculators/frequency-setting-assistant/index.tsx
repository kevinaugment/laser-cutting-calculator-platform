'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { FrequencySettingAssistant } from './FrequencySettingAssistant';

// Create calculator instance
const calculator = new FrequencySettingAssistant();

interface FrequencySettingAssistantPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Frequency Setting Assistant Page Component
 * Comprehensive pulse frequency optimization for laser cutting precision
 */
export default function FrequencySettingAssistantPage({
  initialInputs,
  onCalculationComplete
}: FrequencySettingAssistantPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Frequency Setting Analysis completed:', {
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
      console.log('Frequency Setting Assistant inputs changed:', inputs);
    }
  };

  return (
    <div className="frequency-setting-assistant-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Frequency Setting Assistant - Pulse Frequency Optimization</title>
        <meta 
          name="description" 
          content="Optimize pulse frequency for precision laser cutting and heat control. Calculate optimal frequency settings, pulse characteristics, and material response analysis." 
        />
        <meta 
          name="keywords" 
          content="pulse frequency, laser frequency, frequency optimization, pulse characteristics, heat control, cutting precision, laser parameters" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/frequency-setting-assistant" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Frequency Setting Assistant - Pulse Frequency Optimization" />
        <meta property="og:description" content="Professional frequency optimization for laser cutting precision and heat control" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/frequency-setting-assistant" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Frequency Setting Assistant",
            "description": "Professional tool for optimizing laser pulse frequency and characteristics",
            "applicationCategory": "Process Optimization Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Frequency optimization",
              "Pulse characteristics analysis",
              "Material response prediction",
              "Heat control optimization",
              "Process recommendations"
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
            Professional Frequency Setting Optimization
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Frequency Setting Assistant provides comprehensive optimization 
              of laser pulse frequency for maximum cutting precision and heat control. 
              Essential for achieving optimal pulse characteristics, material response, 
              and processing efficiency across different materials and applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Frequency Analysis
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Optimal Frequency:</strong> Material-specific calculations</li>
                  <li>• <strong>Pulse Characteristics:</strong> Duration, energy, peak power</li>
                  <li>• <strong>Material Response:</strong> HAZ, quality, efficiency</li>
                  <li>• <strong>Heat Control:</strong> Thermal effect minimization</li>
                  <li>• <strong>Mode Selection:</strong> CW vs pulsed optimization</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Frequency Adjustments:</strong> Fine-tuning recommendations</li>
                  <li>• <strong>Pulse Optimizations:</strong> Duration and duty cycle</li>
                  <li>• <strong>Quality Improvements:</strong> Edge finish optimization</li>
                  <li>• <strong>Alternative Settings:</strong> Speed vs quality trade-offs</li>
                  <li>• <strong>Troubleshooting:</strong> Common issue solutions</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Frequency Setting Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Concepts</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Pulse Duration:</strong> Energy delivery time</li>
                    <li>• <strong>Duty Cycle:</strong> On-time percentage</li>
                    <li>• <strong>Peak Power:</strong> Maximum instantaneous power</li>
                    <li>• <strong>Repetition Rate:</strong> Pulses per second</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Benefits</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Precise heat control</li>
                    <li>• Reduced HAZ width</li>
                    <li>• Improved edge quality</li>
                    <li>• Enhanced processing efficiency</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Cutting Mode Strategies
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
                    <strong>Continuous Wave</strong><br/>0 Hz
                  </div>
                  <p className="mt-1 text-xs">Maximum power efficiency</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Pulsed Mode</strong><br/>1-50kHz
                  </div>
                  <p className="mt-1 text-xs">Precision heat control</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Modulated CW</strong><br/>Low frequency
                  </div>
                  <p className="mt-1 text-xs">Balanced approach</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Material-Specific Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">High Thermal Conductivity</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Aluminum:</strong> 20kHz, short pulses</li>
                  <li>• <strong>Copper:</strong> 20kHz, minimal duty cycle</li>
                  <li>• <strong>Brass:</strong> 18kHz, balanced approach</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Low Thermal Conductivity</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Steel:</strong> 20kHz, standard pulses</li>
                  <li>• <strong>Stainless Steel:</strong> 20kHz, longer pulses</li>
                  <li>• <strong>Titanium:</strong> 15kHz, extended pulses</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Quality Priority Effects
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Speed Priority</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Higher frequency (+20%)</li>
                  <li>• Increased duty cycle</li>
                  <li>• Faster material removal</li>
                  <li>• Acceptable quality trade-off</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Precision Priority</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Lower frequency (-20%)</li>
                  <li>• Reduced duty cycle</li>
                  <li>• Superior edge quality</li>
                  <li>• Minimal heat effects</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Select material type and thickness</li>
              <li>Choose laser type and power settings</li>
              <li>Specify cutting mode and quality priority</li>
              <li>Get optimal frequency recommendation</li>
              <li>Review pulse characteristics and material response</li>
              <li>Apply frequency adjustments and optimizations</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Process Optimization Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Heat Control
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Minimize heat affected zone with optimized pulse frequency
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Precision
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve superior edge quality with controlled energy delivery
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Efficiency
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize processing speed while maintaining quality standards
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
export { calculator as frequencySettingAssistant };
