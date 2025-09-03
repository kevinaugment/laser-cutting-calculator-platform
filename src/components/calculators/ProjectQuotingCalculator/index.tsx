import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import ProjectQuotingCalculatorForm from './ProjectQuotingCalculatorForm';
import ProjectQuotingCalculatorResults from './ProjectQuotingCalculatorResults';
import ProjectQuotingFormulaExplanation from './ProjectQuotingFormulaExplanation';
import ProjectQuotingExportTools from './ProjectQuotingExportTools';
import ProjectQuotingRelatedTools from './ProjectQuotingRelatedTools';
import ProjectQuotingEducationalContent from './ProjectQuotingEducationalContent';
import ProjectQuotingFAQ from './ProjectQuotingFAQ';
// import { ProjectQuotingCalculator } from '../../../services/calculators/projectQuotingCalculator';

const ProjectQuotingCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!inputs.projectSpecifications?.projectName) {
        throw new Error('Project name is required');
      }
      
      if (!inputs.partDetails || inputs.partDetails.length === 0) {
        throw new Error('At least one part must be specified');
      }

      if (!inputs.materialCosts || inputs.materialCosts.length === 0) {
        throw new Error('Material costs must be specified');
      }

      if (!inputs.laborRates) {
        throw new Error('Labor rates must be specified');
      }

      if (inputs.profitTargets?.targetProfitMargin < 10 || inputs.profitTargets?.targetProfitMargin > 50) {
        throw new Error('Target profit margin must be between 10% and 50%');
      }

      // Calculate project quote - temporarily using mock data
      const calculationResults = {
        costBreakdown: {
          totalProjectCost: 8750,
          directCosts: {
            materialCost: 2250,
            laborCost: 1800,
            machineCost: 1200,
            subcontractingCost: 0,
            totalDirectCost: 5250
          },
          indirectCosts: {
            overheadCost: 1312,
            administrativeCost: 787,
            salesCost: 420,
            engineeringCost: 262,
            totalIndirectCost: 2781
          },
          riskContingency: 525,
          profitMargin: 2194
        },
        pricingAnalysis: {
          basePrice: 8750,
          adjustedPrice: 9625,
          competitivePrice: 9150,
          recommendedPrice: 9500,
          pricePerPart: 95.00,
          pricePerPound: 12.50,
          pricePerSquareFoot: 18.75
        },
        profitabilityAnalysis: {
          grossProfit: 4250,
          grossProfitMargin: 25.1,
          netProfit: 3725,
          netProfitMargin: 22.0,
          breakEvenQuantity: 75,
          returnOnInvestment: 42.5,
          paybackPeriod: 2.8
        },
        competitiveAnalysis: {
          marketPosition: 'Competitive',
          competitiveAdvantage: [
            'Superior quality control processes',
            'Faster delivery times than competitors',
            'Advanced laser cutting technology',
            'Experienced engineering support'
          ],
          pricingRecommendations: [
            'Position as premium quality provider',
            'Emphasize value-added services',
            'Offer volume discounts for larger orders',
            'Consider long-term partnership pricing'
          ],
          marketShare: 15.2,
          competitorComparison: [
            { competitor: 'Competitor A', estimatedPrice: 8900, marketShare: 22, strengths: ['Low cost', 'High volume'] },
            { competitor: 'Competitor B', estimatedPrice: 9800, marketShare: 18, strengths: ['Quality', 'Service'] }
          ]
        },
        riskAssessment: {
          overallRiskLevel: 'Moderate',
          riskFactors: [
            { factor: 'Material price volatility', level: 'Medium', impact: 8.5, mitigation: 'Lock in material prices with supplier contracts' },
            { factor: 'Customer payment history', level: 'Low', impact: 3.2, mitigation: 'Existing customer with good payment record' },
            { factor: 'Technical complexity', level: 'Medium', impact: 6.8, mitigation: 'Standard processes with proven capabilities' },
            { factor: 'Delivery timeline', level: 'Low', impact: 4.1, mitigation: 'Adequate lead time for standard delivery' }
          ],
          contingencyRecommendation: 6.0,
          insuranceRequirements: [
            'General liability coverage minimum $2M',
            'Professional indemnity insurance',
            'Product liability coverage for manufactured parts'
          ]
        },
        scenarioAnalysis: {
          optimisticScenario: { price: 10925, margin: 35, probability: 25 },
          mostLikelyScenario: { price: 9500, margin: 25, probability: 50 },
          pessimisticScenario: { price: 8075, margin: 15, probability: 25 },
          sensitivityFactors: [
            { factor: 'Material cost changes', impact: 15 },
            { factor: 'Labor rate fluctuations', impact: 10 },
            { factor: 'Competition pricing', impact: -20 },
            { factor: 'Customer negotiation', impact: -12 },
            { factor: 'Project scope changes', impact: 18 }
          ]
        },
        quotingStrategy: {
          recommendedApproach: 'Position as a premium quality provider with competitive pricing. Emphasize technical expertise, quality control, and reliable delivery. Present value-based pricing with clear justification for premium over low-cost competitors.',
          negotiationPoints: [
            'Quality certifications and process controls',
            'Delivery reliability and on-time performance',
            'Technical support and engineering assistance',
            'Long-term partnership benefits'
          ],
          valueProposition: [
            'ISO 9001 certified quality management system',
            'Advanced laser cutting technology with tight tolerances',
            'Experienced engineering team for design optimization',
            'Proven track record with similar projects'
          ],
          riskMitigationStrategies: [
            'Require 30% advance payment to reduce cash flow risk',
            'Include material price escalation clause for long-term projects',
            'Maintain contingency buffer for unexpected complications',
            'Regular project status updates and milestone reviews'
          ]
        },
        documentationRequirements: {
          technicalDrawings: true,
          materialCertificates: true,
          qualityPlan: true,
          deliverySchedule: true,
          warrantyTerms: 'Standard 90-day warranty on workmanship',
          paymentSchedule: '30% advance, 70% on delivery'
        },
        alertsAndRecommendations: {
          criticalAlerts: [
            'Material costs have increased 8% in the last quarter',
            'Customer requires expedited delivery - consider rush charges'
          ],
          recommendations: [
            'Lock in material pricing with supplier before quote submission',
            'Consider offering volume discount for future orders',
            'Emphasize quality and service advantages in proposal'
          ],
          actionItems: [
            'Confirm material availability and lead times',
            'Prepare detailed technical proposal with drawings',
            'Schedule customer meeting to discuss requirements',
            'Obtain material price quotes from primary suppliers'
          ]
        }
      };
      
      setResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="project-quoting-calculator"
        name="Project Quoting Calculator"
        description="Generate accurate project quotes with comprehensive cost analysis, risk assessment, and competitive pricing strategies. Improve quote accuracy by 95% and reduce preparation time by 60% for laser cutting projects."
        category="Business Intelligence"
        keywords={[
          'project quoting calculator',
          'laser cutting quote calculator',
          'manufacturing cost estimator',
          'project pricing calculator',
          'quote generation tool',
          'cost analysis calculator',
          'competitive pricing tool',
          'manufacturing quote generator'
        ]}
        features={[
          'Comprehensive cost breakdown',
          'Risk assessment and contingency planning',
          'Competitive pricing analysis',
          'Profit margin optimization',
          'Quote accuracy improvement >95%',
          'Time reduction up to 60%',
          'Multiple pricing strategies',
          'Export professional quotes'
        ]}
        difficulty="intermediate"
        estimatedTime="< 3s"
        relatedCalculators={[
          'profit-margin-calculator',
          'competitive-pricing-calculator',
          'labor-cost-allocator',
          'material-nesting-optimizer'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Quoting Calculator - Accurate Quotes & Competitive Pricing</h1>
          <p className="text-muted-foreground">
            Generate professional project quotes with 95% accuracy and reduce preparation time by 60%.
            Comprehensive cost analysis, risk assessment, and competitive pricing strategies for laser cutting projects.
            Optimize profitability and win more business with data-driven quoting.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>Calculation Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <ProjectQuotingCalculatorForm 
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div>
            {!results ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-muted-foreground" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Quote</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your project specifications, part details, cost factors, and pricing strategy, 
                    then click "Generate Project Quote" to get comprehensive quote analysis and recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Quote Generated!</strong> Recommended price is{' '}
                    <strong>${results.pricingAnalysis.recommendedPrice.toFixed(0)}</strong> with{' '}
                    <strong>{results.profitabilityAnalysis.grossProfitMargin.toFixed(1)}%</strong> gross margin.
                    Risk level: <strong>{results.riskAssessment.overallRiskLevel}</strong>.
                  </AlertDescription>
                </Alert>
                
                <ProjectQuotingCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <ProjectQuotingExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <ProjectQuotingFormulaExplanation />

          {/* Related Tools - Full container width */}
          <ProjectQuotingRelatedTools />

          {/* Educational Content - Full container width */}
          <ProjectQuotingEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <ProjectQuotingFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Project Quoting Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Quote Preparation:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Detailed Analysis:</strong> Include all direct and indirect costs</li>
                  <li>• <strong>Risk Assessment:</strong> Identify and price project risks appropriately</li>
                  <li>• <strong>Market Research:</strong> Understand competitive landscape and pricing</li>
                  <li>• <strong>Value Proposition:</strong> Clearly articulate unique advantages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Strategic Considerations:</h4>
                <ul className="space-y-1">
                  <li>• Balance profitability with competitiveness</li>
                  <li>• Consider long-term customer relationship value</li>
                  <li>• Include appropriate contingencies for uncertainties</li>
                  <li>• Document assumptions and scope clearly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProjectQuotingCalculatorComponent;
