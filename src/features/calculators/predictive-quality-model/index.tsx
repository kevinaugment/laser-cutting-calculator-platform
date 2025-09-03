'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { PredictiveQualityModel } from './PredictiveQualityModel';

// Create calculator instance
const calculator = new PredictiveQualityModel();

interface PredictiveQualityModelPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Predictive Quality Model Page Component
 * Advanced machine learning-based quality prediction for laser cutting processes
 */
export default function PredictiveQualityModelPage({
  initialInputs,
  onCalculationComplete
}: PredictiveQualityModelPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Predictive Quality Model completed:', {
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
      console.log('Predictive Quality Model inputs changed:', inputs);
    }
  };

  return (
    <div className="predictive-quality-model-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Predictive Quality Model - AI-Powered Laser Cutting Quality Prediction</title>
        <meta 
          name="description" 
          content="Advanced machine learning-based quality prediction for laser cutting processes. Neural networks, random forest, and ensemble models for comprehensive quality analysis." 
        />
        <meta 
          name="keywords" 
          content="predictive quality model, machine learning, neural network, quality prediction, laser cutting AI, surface roughness prediction, edge quality analysis" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/predictive-quality-model" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Predictive Quality Model - AI-Powered Laser Cutting Quality Prediction" />
        <meta property="og:description" content="Professional AI-powered quality prediction system for laser cutting processes using advanced machine learning algorithms" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/predictive-quality-model" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Predictive Quality Model",
            "description": "Professional AI-powered tool for predicting laser cutting quality using advanced machine learning algorithms",
            "applicationCategory": "Advanced Analysis Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Machine learning quality prediction",
              "Neural network analysis",
              "Defect probability assessment",
              "Process stability analysis",
              "Quality optimization recommendations"
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
            AI-Powered Quality Prediction for Laser Cutting
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Predictive Quality Model leverages advanced machine learning 
              algorithms to predict laser cutting quality with unprecedented accuracy. 
              Essential for proactive quality control, defect prevention, and 
              process optimization in modern manufacturing environments.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Machine Learning Models
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Neural Networks:</strong> Deep learning for complex pattern recognition</li>
                  <li>• <strong>Random Forest:</strong> Ensemble method for robust predictions</li>
                  <li>• <strong>Support Vector Machine:</strong> High-dimensional classification</li>
                  <li>• <strong>Ensemble Models:</strong> Combined algorithms for maximum accuracy</li>
                  <li>• <strong>Feature Engineering:</strong> Automated parameter importance analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Quality Predictions
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Surface Roughness:</strong> Ra prediction with confidence intervals</li>
                  <li>• <strong>Edge Quality:</strong> Squareness, straightness, and dross analysis</li>
                  <li>• <strong>Dimensional Accuracy:</strong> Tolerance and repeatability prediction</li>
                  <li>• <strong>Heat Affected Zone:</strong> HAZ width and microstructure impact</li>
                  <li>• <strong>Defect Probabilities:</strong> Risk assessment for common defects</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Machine Learning Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Model Types</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Neural Network:</strong> Multi-layer perceptron with backpropagation</li>
                    <li>• <strong>Random Forest:</strong> Bootstrap aggregating decision trees</li>
                    <li>• <strong>SVM:</strong> Kernel-based classification and regression</li>
                    <li>• <strong>Ensemble:</strong> Weighted combination of multiple models</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Quality Metrics</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Surface roughness (Ra, μm)</li>
                    <li>• Edge squareness (degrees)</li>
                    <li>• Dimensional tolerance (±μm)</li>
                    <li>• Heat affected zone (mm)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Machine Learning Models Comparison
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Neural Network</strong><br/>Deep Learning
                  </div>
                  <p className="mt-1 text-xs">Complex patterns, high accuracy</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Random Forest</strong><br/>Ensemble Trees
                  </div>
                  <p className="mt-1 text-xs">Robust, interpretable</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>SVM</strong><br/>Kernel Methods
                  </div>
                  <p className="mt-1 text-xs">High-dimensional data</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                    <strong>Ensemble</strong><br/>Combined Models
                  </div>
                  <p className="mt-1 text-xs">Maximum accuracy</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Quality Prediction Categories
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Surface Quality</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Surface Roughness:</strong> Ra prediction with confidence intervals</li>
                  <li>• <strong>Surface Finish:</strong> Texture and appearance quality</li>
                  <li>• <strong>Oxidation Risk:</strong> Surface discoloration probability</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Edge Quality</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Edge Squareness:</strong> Perpendicularity deviation</li>
                  <li>• <strong>Edge Straightness:</strong> Linear deviation measurement</li>
                  <li>• <strong>Dross Formation:</strong> Molten material attachment risk</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Defect Probability Analysis
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Common Defects</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Dross formation</li>
                  <li>• Burn marks</li>
                  <li>• Micro cracks</li>
                  <li>• Warping distortion</li>
                  <li>• Incomplete cuts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Risk Factors</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Power density</li>
                  <li>• Cutting speed</li>
                  <li>• Gas pressure</li>
                  <li>• Focus position</li>
                  <li>• Material properties</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Prevention</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Parameter optimization</li>
                  <li>• Process monitoring</li>
                  <li>• Predictive maintenance</li>
                  <li>• Quality control</li>
                  <li>• Real-time feedback</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Input process parameters and material specifications</li>
              <li>Select machine learning model and prediction scope</li>
              <li>Feature engineering and parameter normalization</li>
              <li>Model inference and quality prediction generation</li>
              <li>Uncertainty analysis and confidence interval calculation</li>
              <li>Defect probability assessment and risk analysis</li>
              <li>Optimization recommendations and alternative settings</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                AI-Powered Quality Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Predictive Accuracy
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Achieve 90%+ prediction accuracy with advanced ML models
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Defect Prevention
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Proactive quality control through defect probability analysis
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Process Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Data-driven parameter recommendations for quality improvement
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
export { calculator as predictiveQualityModel };
