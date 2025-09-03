'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { SensitivityAnalysisCalculator } from './SensitivityAnalysisCalculator';

// Create calculator instance
const calculator = new SensitivityAnalysisCalculator();

interface SensitivityAnalysisCalculatorPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Sensitivity Analysis Calculator Page Component
 * Comprehensive parameter sensitivity analysis for laser cutting optimization
 */
export default function SensitivityAnalysisCalculatorPage({
  initialInputs,
  onCalculationComplete
}: SensitivityAnalysisCalculatorPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Sensitivity Analysis completed:', {
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
      console.log('Sensitivity Analysis Calculator inputs changed:', inputs);
    }
  };

  return (
    <div className="sensitivity-analysis-calculator-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Sensitivity Analysis Calculator - Parameter Impact Analysis</title>
        <meta 
          name="description" 
          content="Analyze parameter sensitivity and identify critical factors for laser cutting optimization. Comprehensive sensitivity analysis with tornado charts, spider diagrams, and risk assessment." 
        />
        <meta 
          name="keywords" 
          content="sensitivity analysis, parameter analysis, laser cutting optimization, tornado chart, spider diagram, risk analysis, process optimization" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/sensitivity-analysis-calculator" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Sensitivity Analysis Calculator - Parameter Impact Analysis" />
        <meta property="og:description" content="Professional sensitivity analysis for laser cutting parameter optimization and risk assessment" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/sensitivity-analysis-calculator" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Sensitivity Analysis Calculator",
            "description": "Professional tool for analyzing parameter sensitivity and identifying critical factors in laser cutting processes",
            "applicationCategory": "Advanced Analysis Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Parameter sensitivity analysis",
              "Tornado chart generation",
              "Spider diagram visualization",
              "Risk assessment",
              "Optimization insights"
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
            Professional Sensitivity Analysis for Laser Cutting
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Sensitivity Analysis Calculator provides comprehensive parameter 
              impact analysis for laser cutting optimization. Essential for identifying 
              critical parameters, assessing process robustness, and optimizing 
              control strategies for consistent, high-quality results.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Analysis Capabilities
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Parameter Sensitivity:</strong> Quantify impact of each parameter</li>
                  <li>• <strong>Tornado Charts:</strong> Visual ranking of parameter importance</li>
                  <li>• <strong>Spider Diagrams:</strong> Multi-parameter scenario comparison</li>
                  <li>• <strong>Interaction Effects:</strong> Parameter coupling analysis</li>
                  <li>• <strong>Risk Assessment:</strong> Process robustness evaluation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Critical Parameter ID:</strong> Identify most influential factors</li>
                  <li>• <strong>Control Priorities:</strong> Rank parameters by importance</li>
                  <li>• <strong>Mitigation Strategies:</strong> Risk reduction recommendations</li>
                  <li>• <strong>Optimization Insights:</strong> Process improvement guidance</li>
                  <li>• <strong>Robustness Metrics:</strong> Process stability assessment</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Sensitivity Analysis Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Metrics</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Sensitivity:</strong> % output change per % input change</li>
                    <li>• <strong>Elasticity:</strong> Responsiveness coefficient</li>
                    <li>• <strong>Impact Classification:</strong> Low, medium, high, critical</li>
                    <li>• <strong>Interaction Strength:</strong> Parameter coupling effects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Analysis Types</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Single parameter analysis</li>
                    <li>• Multi-parameter analysis</li>
                    <li>• Monte Carlo simulation</li>
                    <li>• Tornado chart analysis</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Analysis Types and Applications
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Single Parameter</strong><br/>Individual Impact
                  </div>
                  <p className="mt-1 text-xs">Isolate parameter effects</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Multi-Parameter</strong><br/>Combined Effects
                  </div>
                  <p className="mt-1 text-xs">Analyze interactions</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                    <strong>Monte Carlo</strong><br/>Statistical Analysis
                  </div>
                  <p className="mt-1 text-xs">Uncertainty quantification</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>Tornado Chart</strong><br/>Visual Ranking
                  </div>
                  <p className="mt-1 text-xs">Parameter importance</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Parameter Impact Classification
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">High Sensitivity Parameters</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Cutting Speed:</strong> Direct impact on time and quality</li>
                  <li>• <strong>Laser Power:</strong> Energy delivery and penetration</li>
                  <li>• <strong>Material Thickness:</strong> Process complexity driver</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Medium Sensitivity Parameters</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Focus Height:</strong> Quality and consistency impact</li>
                  <li>• <strong>Gas Pressure:</strong> Melt ejection and edge quality</li>
                  <li>• <strong>Feed Rate:</strong> Surface finish influence</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Visualization and Interpretation
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tornado Charts</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Parameter ranking by impact</li>
                  <li>• Visual impact comparison</li>
                  <li>• Range-based analysis</li>
                  <li>• Priority identification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Spider Diagrams</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Multi-parameter visualization</li>
                  <li>• Scenario comparison</li>
                  <li>• Balance assessment</li>
                  <li>• Trade-off analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Assessment</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Critical parameter identification</li>
                  <li>• Robustness evaluation</li>
                  <li>• Mitigation strategies</li>
                  <li>• Control recommendations</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Define base case parameters and analysis scope</li>
              <li>Select analysis type and output metrics</li>
              <li>Set parameter variation ranges and analysis points</li>
              <li>Execute sensitivity analysis calculations</li>
              <li>Generate tornado charts and spider diagrams</li>
              <li>Analyze interaction effects and risk factors</li>
              <li>Review optimization insights and recommendations</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Advanced Analysis Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Understanding
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Identify which parameters have the greatest impact on outcomes
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Risk Management
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Assess process robustness and identify critical control points
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Optimization Focus
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Prioritize improvement efforts on high-impact parameters
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
export { calculator as sensitivityAnalysisCalculator };
