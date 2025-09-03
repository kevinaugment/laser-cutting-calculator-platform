'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { PerformanceBenchmarkingTool } from './PerformanceBenchmarkingTool';

// Create calculator instance
const calculator = new PerformanceBenchmarkingTool();

interface PerformanceBenchmarkingToolPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Performance Benchmarking Tool Page Component
 * Comprehensive performance analysis and benchmarking for laser cutting systems
 */
export default function PerformanceBenchmarkingToolPage({
  initialInputs,
  onCalculationComplete
}: PerformanceBenchmarkingToolPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Performance Benchmarking completed:', {
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
      console.log('Performance Benchmarking Tool inputs changed:', inputs);
    }
  };

  return (
    <div className="performance-benchmarking-tool-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Performance Benchmarking Tool - Comprehensive Laser Cutting Performance Analysis</title>
        <meta 
          name="description" 
          content="Comprehensive performance analysis and benchmarking for laser cutting systems. Industry comparisons, trend analysis, and actionable improvement recommendations." 
        />
        <meta 
          name="keywords" 
          content="performance benchmarking, laser cutting performance, industry comparison, performance analysis, KPI benchmarking, operational excellence" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/performance-benchmarking-tool" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Performance Benchmarking Tool - Comprehensive Laser Cutting Performance Analysis" />
        <meta property="og:description" content="Professional performance benchmarking tool for laser cutting systems with comprehensive industry analysis" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/performance-benchmarking-tool" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Performance Benchmarking Tool",
            "description": "Professional tool for comprehensive performance analysis and benchmarking of laser cutting systems",
            "applicationCategory": "Advanced Analysis Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Performance benchmarking",
              "Industry comparisons",
              "Trend analysis",
              "Root cause analysis",
              "Action planning"
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
            Professional Performance Benchmarking for Laser Cutting Systems
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Performance Benchmarking Tool provides comprehensive analysis 
              of laser cutting system performance against industry standards. 
              Essential for identifying improvement opportunities, tracking progress, 
              and maintaining competitive advantage in manufacturing operations.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Benchmarking Categories
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>System Performance:</strong> Throughput, utilization, and efficiency</li>
                  <li>• <strong>Process Efficiency:</strong> Cycle times, setup, and changeover</li>
                  <li>• <strong>Quality Metrics:</strong> Defect rates, rework, and accuracy</li>
                  <li>• <strong>Cost Effectiveness:</strong> Operating costs and resource utilization</li>
                  <li>• <strong>Comprehensive Analysis:</strong> All-inclusive performance review</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Analysis Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Industry Comparison:</strong> Percentile ranking and gap analysis</li>
                  <li>• <strong>Trend Analysis:</strong> Performance trends and projections</li>
                  <li>• <strong>Root Cause Analysis:</strong> Performance driver identification</li>
                  <li>• <strong>Action Planning:</strong> Prioritized improvement recommendations</li>
                  <li>• <strong>Competitive Positioning:</strong> Market position assessment</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Performance Benchmarking Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Metrics</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>Throughput:</strong> Parts per hour production rate</li>
                    <li>• <strong>Utilization:</strong> Equipment usage percentage</li>
                    <li>• <strong>Quality Rate:</strong> First-pass yield percentage</li>
                    <li>• <strong>Efficiency:</strong> Energy and resource utilization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Comparison Targets</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Industry standards and averages</li>
                    <li>• Best practice benchmarks</li>
                    <li>• Historical performance trends</li>
                    <li>• Competitor analysis data</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Laser Technology Benchmarks
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Fiber Laser</strong><br/>High Performance
                  </div>
                  <p className="mt-1 text-xs">25-40 parts/hour</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>CO2 Laser</strong><br/>Versatile
                  </div>
                  <p className="mt-1 text-xs">18-30 parts/hour</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>Nd:YAG Laser</strong><br/>Precision
                  </div>
                  <p className="mt-1 text-xs">15-25 parts/hour</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                    <strong>Diode Laser</strong><br/>Efficient
                  </div>
                  <p className="mt-1 text-xs">12-20 parts/hour</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Performance Analysis Framework
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">System Metrics</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Throughput:</strong> Production rate and capacity utilization</li>
                  <li>• <strong>Availability:</strong> Uptime and downtime analysis</li>
                  <li>• <strong>Performance:</strong> Speed and efficiency metrics</li>
                  <li>• <strong>Quality:</strong> First-pass yield and defect rates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cost Metrics</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Operating Costs:</strong> Per hour operational expenses</li>
                  <li>• <strong>Material Costs:</strong> Raw material and consumables</li>
                  <li>• <strong>Energy Costs:</strong> Power consumption and efficiency</li>
                  <li>• <strong>Maintenance Costs:</strong> Preventive and corrective maintenance</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Competitive Analysis Framework
            </h3>
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Leader</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Top 10% performance</li>
                  <li>• Industry benchmark</li>
                  <li>• Best practices</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Above Average</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• 75-90% percentile</li>
                  <li>• Strong performance</li>
                  <li>• Competitive advantage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Average</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• 25-75% percentile</li>
                  <li>• Industry standard</li>
                  <li>• Improvement potential</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Below Average</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• 10-25% percentile</li>
                  <li>• Performance gaps</li>
                  <li>• Action required</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Laggard</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Bottom 10%</li>
                  <li>• Critical issues</li>
                  <li>• Urgent intervention</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Input system configuration and current performance metrics</li>
              <li>Select benchmark type and comparison target</li>
              <li>Analyze performance against industry standards</li>
              <li>Identify performance gaps and improvement opportunities</li>
              <li>Conduct root cause analysis of performance drivers</li>
              <li>Generate prioritized action plan with recommendations</li>
              <li>Track progress and monitor performance trends</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Performance Benchmarking Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Competitive Intelligence
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Understand market position and competitive advantages
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Performance Optimization
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Identify and prioritize improvement opportunities
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Strategic Planning
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Data-driven decision making for operational excellence
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
export { calculator as performanceBenchmarkingTool };
