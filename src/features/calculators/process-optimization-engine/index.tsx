'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { ProcessOptimizationEngine } from './ProcessOptimizationEngine';

// Create calculator instance
const calculator = new ProcessOptimizationEngine();

interface ProcessOptimizationEnginePageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Process Optimization Engine Page Component
 * Advanced multi-objective optimization for laser cutting processes
 */
export default function ProcessOptimizationEnginePage({
  initialInputs,
  onCalculationComplete
}: ProcessOptimizationEnginePageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Process Optimization completed:', {
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
      console.log('Process Optimization Engine inputs changed:', inputs);
    }
  };

  return (
    <div className="process-optimization-engine-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Process Optimization Engine - Multi-Objective Laser Cutting Optimization</title>
        <meta 
          name="description" 
          content="Advanced multi-objective optimization for laser cutting processes using evolutionary algorithms. Genetic algorithms, particle swarm optimization, and Pareto front analysis." 
        />
        <meta 
          name="keywords" 
          content="process optimization, multi-objective optimization, genetic algorithm, particle swarm, evolutionary algorithms, laser cutting optimization, Pareto front" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/process-optimization-engine" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Process Optimization Engine - Multi-Objective Laser Cutting Optimization" />
        <meta property="og:description" content="Professional multi-objective optimization engine for laser cutting processes using advanced evolutionary algorithms" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/process-optimization-engine" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Process Optimization Engine",
            "description": "Professional tool for multi-objective optimization of laser cutting processes using evolutionary algorithms",
            "applicationCategory": "Advanced Analysis Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Multi-objective optimization",
              "Genetic algorithms",
              "Particle swarm optimization",
              "Pareto front analysis",
              "Convergence tracking"
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
            Advanced Multi-Objective Process Optimization
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Process Optimization Engine provides state-of-the-art multi-objective 
              optimization for laser cutting processes using evolutionary algorithms. 
              Essential for finding optimal parameter combinations that balance cost, 
              time, quality, and energy efficiency across complex manufacturing scenarios.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Algorithms
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Genetic Algorithm:</strong> Population-based evolutionary search</li>
                  <li>• <strong>Particle Swarm:</strong> Swarm intelligence optimization</li>
                  <li>• <strong>Simulated Annealing:</strong> Probabilistic optimization method</li>
                  <li>• <strong>NSGA-II:</strong> Multi-objective Pareto optimization</li>
                  <li>• <strong>Convergence Analysis:</strong> Real-time optimization tracking</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Optimization Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Multi-Objective:</strong> Simultaneous cost, time, quality, energy</li>
                  <li>• <strong>Pareto Front:</strong> Trade-off analysis and solution ranking</li>
                  <li>• <strong>Constraint Handling:</strong> Feasible solution enforcement</li>
                  <li>• <strong>Alternative Solutions:</strong> Multiple optimal configurations</li>
                  <li>• <strong>Sensitivity Analysis:</strong> Parameter importance ranking</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Evolutionary Algorithm Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Concepts</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Population:</strong> Set of candidate solutions</li>
                    <li>• <strong>Fitness:</strong> Solution quality measure</li>
                    <li>• <strong>Selection:</strong> Best solution survival</li>
                    <li>• <strong>Crossover:</strong> Solution combination</li>
                    <li>• <strong>Mutation:</strong> Random variation introduction</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Optimization Goals</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Minimize total processing cost</li>
                    <li>• Minimize cutting time</li>
                    <li>• Maximize cut quality</li>
                    <li>• Minimize energy consumption</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Optimization Algorithms Comparison
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Genetic Algorithm</strong><br/>Population Evolution
                  </div>
                  <p className="mt-1 text-xs">Best for complex landscapes</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Particle Swarm</strong><br/>Swarm Intelligence
                  </div>
                  <p className="mt-1 text-xs">Fast convergence</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>Simulated Annealing</strong><br/>Probabilistic Search
                  </div>
                  <p className="mt-1 text-xs">Avoids local optima</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                    <strong>NSGA-II</strong><br/>Multi-Objective
                  </div>
                  <p className="mt-1 text-xs">Pareto front analysis</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Optimization Objectives
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Primary Objectives</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Cost Minimization:</strong> Material, energy, labor costs</li>
                  <li>• <strong>Time Minimization:</strong> Processing and setup time</li>
                  <li>• <strong>Quality Maximization:</strong> Edge quality and precision</li>
                  <li>• <strong>Energy Minimization:</strong> Power consumption optimization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Constraint Types</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Time Constraints:</strong> Maximum processing time</li>
                  <li>• <strong>Cost Constraints:</strong> Budget limitations</li>
                  <li>• <strong>Quality Constraints:</strong> Minimum quality requirements</li>
                  <li>• <strong>Energy Constraints:</strong> Power consumption limits</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Parameter Optimization Space
            </h3>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Laser Power</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Range: 100-20,000W</li>
                  <li>• Impact: High on all objectives</li>
                  <li>• Constraints: Material limits</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cutting Speed</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Range: 100-15,000 mm/min</li>
                  <li>• Impact: Critical for time/quality</li>
                  <li>• Constraints: Power coupling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Gas Pressure</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Range: 0.1-30 bar</li>
                  <li>• Impact: Medium on quality</li>
                  <li>• Constraints: Material type</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Focus Height</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Range: -10 to +10 mm</li>
                  <li>• Impact: Medium on quality</li>
                  <li>• Constraints: Thickness dependent</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Define optimization objectives and constraints</li>
              <li>Select optimization algorithm and parameters</li>
              <li>Initialize population of candidate solutions</li>
              <li>Evaluate fitness of each solution</li>
              <li>Apply selection, crossover, and mutation operators</li>
              <li>Track convergence and generate Pareto front</li>
              <li>Extract optimal parameters and alternative solutions</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Advanced Optimization Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Global Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Find globally optimal solutions avoiding local minima
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Multi-Objective Balance
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Simultaneously optimize multiple conflicting objectives
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Robust Solutions
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Generate multiple high-quality alternative solutions
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
export { calculator as processOptimizationEngine };
