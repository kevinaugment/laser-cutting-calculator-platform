'use client';

import React from 'react';
import { BaseCalculatorContainer } from '@/components/calculator/BaseCalculatorComponents';
import { CostBenefitAnalyzer } from './CostBenefitAnalyzer';

// Create calculator instance
const calculator = new CostBenefitAnalyzer();

interface CostBenefitAnalyzerPageProps {
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: any) => void;
}

/**
 * Cost-Benefit Analyzer Page Component
 * Comprehensive financial analysis for laser cutting investment decisions
 */
export default function CostBenefitAnalyzerPage({
  initialInputs,
  onCalculationComplete
}: CostBenefitAnalyzerPageProps) {
  
  const handleCalculationComplete = (result: any) => {
    // Log calculation for analytics
    if (typeof window !== 'undefined' && result.success) {
      console.log('Cost-Benefit Analysis completed:', {
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
      console.log('Cost-Benefit Analyzer inputs changed:', inputs);
    }
  };

  return (
    <div className="cost-benefit-analyzer-page">
      {/* SEO and Meta Tags */}
      <head>
        <title>Cost-Benefit Analyzer - Financial Analysis for Laser Cutting Investments</title>
        <meta 
          name="description" 
          content="Comprehensive financial analysis for laser cutting investment decisions. NPV, IRR, ROI calculations with risk assessment and scenario analysis." 
        />
        <meta 
          name="keywords" 
          content="cost benefit analysis, NPV, IRR, ROI, financial analysis, investment analysis, laser cutting ROI, payback period, risk assessment" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/calculators/cost-benefit-analyzer" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Cost-Benefit Analyzer - Financial Analysis for Laser Cutting Investments" />
        <meta property="og:description" content="Professional financial analysis tool for laser cutting investment decisions with comprehensive risk assessment" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/calculators/cost-benefit-analyzer" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Cost-Benefit Analyzer",
            "description": "Professional tool for comprehensive financial analysis of laser cutting investment decisions",
            "applicationCategory": "Advanced Analysis Calculator",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "NPV and IRR calculations",
              "ROI and payback analysis",
              "Risk assessment",
              "Scenario analysis",
              "Sensitivity analysis"
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
            Professional Financial Analysis for Laser Cutting Investments
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our Cost-Benefit Analyzer provides comprehensive financial analysis 
              for laser cutting investment decisions. Essential for evaluating 
              equipment purchases, process improvements, and technology upgrades 
              with rigorous financial modeling and risk assessment.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Financial Metrics
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Net Present Value (NPV):</strong> Time-value adjusted profitability</li>
                  <li>• <strong>Internal Rate of Return (IRR):</strong> Project yield calculation</li>
                  <li>• <strong>Return on Investment (ROI):</strong> Percentage return analysis</li>
                  <li>• <strong>Payback Period:</strong> Investment recovery timeline</li>
                  <li>• <strong>Profitability Index:</strong> Value creation ratio</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Analysis Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• <strong>Cash Flow Analysis:</strong> Year-by-year financial projection</li>
                  <li>• <strong>Scenario Analysis:</strong> Best, worst, and most likely cases</li>
                  <li>• <strong>Sensitivity Analysis:</strong> Parameter impact assessment</li>
                  <li>• <strong>Risk Assessment:</strong> Comprehensive risk evaluation</li>
                  <li>• <strong>Benchmark Comparison:</strong> Industry standard comparison</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                Financial Analysis Fundamentals
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Key Concepts</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• <strong>NPV:</strong> Present value of future cash flows minus initial investment</li>
                    <li>• <strong>IRR:</strong> Discount rate that makes NPV equal to zero</li>
                    <li>• <strong>ROI:</strong> (Total Benefits - Total Costs) / Total Costs</li>
                    <li>• <strong>Payback:</strong> Time to recover initial investment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Decision Criteria</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• NPV &gt; 0: Project creates value</li>
                    <li>• IRR &gt; Cost of Capital: Acceptable return</li>
                    <li>• ROI &gt; Hurdle Rate: Meets requirements</li>
                    <li>• Payback &lt; Project Life: Recoverable</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Investment Project Types
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
                    <strong>Equipment Purchase</strong><br/>Capital Investment
                  </div>
                  <p className="mt-1 text-xs">New machinery acquisition</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-2 rounded">
                    <strong>Process Improvement</strong><br/>Efficiency Gains
                  </div>
                  <p className="mt-1 text-xs">Operational optimization</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 p-2 rounded">
                    <strong>Capacity Expansion</strong><br/>Growth Investment
                  </div>
                  <p className="mt-1 text-xs">Production scaling</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 p-2 rounded">
                    <strong>Technology Upgrade</strong><br/>Innovation Investment
                  </div>
                  <p className="mt-1 text-xs">Technology advancement</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Cost and Benefit Categories
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cost Categories</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Material Costs:</strong> Raw material and consumables</li>
                  <li>• <strong>Energy Costs:</strong> Electricity and utilities</li>
                  <li>• <strong>Labor Costs:</strong> Direct and indirect labor</li>
                  <li>• <strong>Maintenance Costs:</strong> Equipment upkeep and repairs</li>
                  <li>• <strong>Overhead Costs:</strong> Facility and administrative costs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Benefit Categories</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Cost Savings:</strong> Reduced operating expenses</li>
                  <li>• <strong>Revenue Increase:</strong> Additional sales and capacity</li>
                  <li>• <strong>Quality Improvements:</strong> Reduced defects and rework</li>
                  <li>• <strong>Efficiency Gains:</strong> Productivity improvements</li>
                  <li>• <strong>Market Share:</strong> Competitive advantage gains</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Risk Assessment Framework
            </h3>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technology Risk</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Performance uncertainty</li>
                  <li>• Integration challenges</li>
                  <li>• Obsolescence risk</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Market Risk</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Demand fluctuations</li>
                  <li>• Price volatility</li>
                  <li>• Economic conditions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Operational Risk</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Implementation delays</li>
                  <li>• Training requirements</li>
                  <li>• Process disruption</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Competitive Risk</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Competitor response</li>
                  <li>• Market saturation</li>
                  <li>• Technology leapfrog</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              How It Works
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Define project parameters and investment requirements</li>
              <li>Input current operating costs and projected savings</li>
              <li>Estimate revenue impact and growth projections</li>
              <li>Assess risk factors across multiple categories</li>
              <li>Calculate financial metrics (NPV, IRR, ROI, Payback)</li>
              <li>Perform scenario and sensitivity analysis</li>
              <li>Compare with industry benchmarks and generate recommendations</li>
            </ol>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                Financial Analysis Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Investment Confidence
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Make informed decisions with comprehensive financial modeling
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Risk Management
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Identify and quantify risks before making commitments
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Strategic Planning
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Optimize investment timing and resource allocation
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
export { calculator as costBenefitAnalyzer };
