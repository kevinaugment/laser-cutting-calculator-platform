import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import EquipmentComparisonCalculatorForm from './EquipmentComparisonCalculatorForm';
import EquipmentComparisonCalculatorResults from './EquipmentComparisonCalculatorResults';
import EquipmentComparisonFormulaExplanation from './EquipmentComparisonFormulaExplanation';
import EquipmentComparisonExportTools from './EquipmentComparisonExportTools';
import EquipmentComparisonRelatedTools from './EquipmentComparisonRelatedTools';
import EquipmentComparisonEducationalContent from './EquipmentComparisonEducationalContent';
import EquipmentComparisonFAQ from './EquipmentComparisonFAQ';
// import { EquipmentComparisonTool } from '../../../services/calculators/equipmentComparisonTool';

const EquipmentComparisonCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!inputs.equipmentOptions || inputs.equipmentOptions.length < 2) {
        throw new Error('At least 2 equipment options are required for comparison');
      }
      
      if (inputs.equipmentOptions.some((eq: any) => eq.purchasePrice <= 0)) {
        throw new Error('All equipment must have a valid purchase price');
      }

      if (inputs.equipmentOptions.some((eq: any) => eq.laserPower <= 0)) {
        throw new Error('All equipment must have a valid laser power rating');
      }

      if (inputs.operatingConditions.annualOperatingHours <= 0) {
        throw new Error('Annual operating hours must be greater than 0');
      }

      if (inputs.operatingConditions.electricityRate <= 0) {
        throw new Error('Electricity rate must be greater than 0');
      }

      if (inputs.operatingConditions.laborRate <= 0) {
        throw new Error('Labor rate must be greater than 0');
      }

      // Calculate equipment comparison - real calculation logic
      const equipmentAnalysis = inputs.equipmentOptions.map((equipment: any) => {
        // Calculate Total Cost of Ownership (TCO)
        const annualOperatingCost = (equipment.laserPower / 1000) * inputs.operatingConditions.annualOperatingHours * inputs.operatingConditions.electricityRate;
        const annualMaintenanceCost = equipment.purchasePrice * 0.03; // 3% of purchase price annually
        const annualLaborCost = inputs.operatingConditions.annualOperatingHours * inputs.operatingConditions.laborRate;

        const totalAnnualCost = annualOperatingCost + annualMaintenanceCost + annualLaborCost;
        const totalTCO = equipment.purchasePrice + (totalAnnualCost * inputs.operatingConditions.expectedLifespan);
        const tcoPerYear = totalTCO / inputs.operatingConditions.expectedLifespan;

        // Calculate performance scores (0-100)
        const productivityScore = Math.min(100, (equipment.laserPower / 6000) * 100); // Normalized to 6kW max
        const qualityScore = Math.min(100, (equipment.beamQuality ? (2 / equipment.beamQuality) * 100 : 80));
        const capabilityScore = Math.min(100, (equipment.maxThickness / 25) * 100); // Normalized to 25mm max
        const efficiencyScore = Math.min(100, (equipment.efficiency || 0.3) * 100 / 0.35); // Normalized to 35% max efficiency

        // Calculate weighted scores based on evaluation criteria
        const purchaseScore = Math.max(0, 100 - ((equipment.purchasePrice - 100000) / 5000)); // Lower price = higher score
        const operatingScore = Math.max(0, 100 - ((annualOperatingCost - 20000) / 1000)); // Lower cost = higher score
        const maintenanceScore = Math.max(0, 100 - ((annualMaintenanceCost - 10000) / 500)); // Lower cost = higher score
        const qualityScoreWeighted = qualityScore;
        const productivityScoreWeighted = productivityScore;
        const reliabilityScore = equipment.reliability || 85; // Default reliability score
        const serviceSupportScore = equipment.serviceSupport || 80; // Default service score
        const futureProofingScore = equipment.futureProofing || 75; // Default future-proofing score

        // Calculate total weighted score
        const totalScore = (
          (purchaseScore * inputs.evaluationCriteria.purchasePrice / 100) +
          (operatingScore * inputs.evaluationCriteria.operatingCost / 100) +
          (maintenanceScore * inputs.evaluationCriteria.maintenanceCost / 100) +
          (qualityScoreWeighted * inputs.evaluationCriteria.quality / 100) +
          (productivityScoreWeighted * inputs.evaluationCriteria.productivity / 100) +
          (reliabilityScore * inputs.evaluationCriteria.reliability / 100) +
          (serviceSupportScore * inputs.evaluationCriteria.serviceSupport / 100) +
          (futureProofingScore * inputs.evaluationCriteria.futureProofing / 100)
        );

        // Determine strengths and weaknesses
        const scores = {
          'Purchase Price': purchaseScore,
          'Operating Cost': operatingScore,
          'Maintenance Cost': maintenanceScore,
          'Quality': qualityScoreWeighted,
          'Productivity': productivityScoreWeighted,
          'Reliability': reliabilityScore,
          'Service Support': serviceSupportScore,
          'Future Proofing': futureProofingScore
        };

        const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
        const strengths = sortedScores.slice(0, 3).map(([name]) => name);
        const weaknesses = sortedScores.slice(-2).map(([name]) => name);

        // Risk assessment
        const technologyRisk = equipment.laserPower > 4000 ? 'Low' : 'Medium'; // Higher power = more proven
        const serviceRisk = serviceSupportScore > 80 ? 'Low' : serviceSupportScore > 60 ? 'Medium' : 'High';
        const obsolescenceRisk = futureProofingScore > 80 ? 'Low' : futureProofingScore > 60 ? 'Medium' : 'High';

        const riskFactors = [
          {
            factor: 'Technology Risk',
            level: technologyRisk,
            impact: technologyRisk === 'Low' ? 10 : technologyRisk === 'Medium' ? 20 : 30,
            mitigation: technologyRisk === 'Low' ? 'Proven technology' : 'Consider technology maturity'
          },
          {
            factor: 'Service Risk',
            level: serviceRisk,
            impact: serviceRisk === 'Low' ? 15 : serviceRisk === 'Medium' ? 25 : 35,
            mitigation: serviceRisk === 'Low' ? 'Excellent service network' : 'Verify local service availability'
          },
          {
            factor: 'Obsolescence Risk',
            level: obsolescenceRisk,
            impact: obsolescenceRisk === 'Low' ? 8 : obsolescenceRisk === 'Medium' ? 15 : 25,
            mitigation: obsolescenceRisk === 'Low' ? 'Future-proof design' : 'Consider upgrade path'
          }
        ];

        const overallRiskScore = riskFactors.reduce((sum, risk) => sum + risk.impact, 0);
        const overallRisk = overallRiskScore < 30 ? 'Low' : overallRiskScore < 50 ? 'Medium' : 'High';

        // Payback analysis
        const annualSavings = inputs.operatingConditions.currentAnnualCost - totalAnnualCost;
        const paybackPeriod = annualSavings > 0 ? equipment.purchasePrice / annualSavings : 999;
        const roi = annualSavings > 0 ? (annualSavings / equipment.purchasePrice) * 100 : -100;

        // NPV calculation (simplified)
        const discountRate = 0.1; // 10% discount rate
        let npv = -equipment.purchasePrice;
        for (let year = 1; year <= inputs.operatingConditions.expectedLifespan; year++) {
          npv += annualSavings / Math.pow(1 + discountRate, year);
        }

        // IRR approximation
        const irr = annualSavings > 0 ? ((annualSavings / equipment.purchasePrice) * 100) + 5 : 0;

        return {
          equipment,
          totalScore: Math.round(totalScore * 10) / 10,
          scores,
          strengths,
          weaknesses,
          tco: {
            purchasePrice: equipment.purchasePrice,
            annualOperatingCost: Math.round(annualOperatingCost),
            annualMaintenanceCost: Math.round(annualMaintenanceCost),
            totalTCO: Math.round(totalTCO),
            tcoPerYear: Math.round(tcoPerYear)
          },
          performance: {
            productivityScore: Math.round(productivityScore),
            qualityScore: Math.round(qualityScore),
            capabilityScore: Math.round(capabilityScore),
            efficiencyScore: Math.round(efficiencyScore)
          },
          risk: {
            overallRisk,
            riskFactors
          },
          payback: {
            paybackPeriod: Math.round(paybackPeriod * 10) / 10,
            roi: Math.round(roi * 10) / 10,
            npv: Math.round(npv),
            irr: Math.round(irr * 10) / 10
          }
        };
      });

      // Sort by total score for ranking
      const rankedEquipment = equipmentAnalysis.sort((a, b) => b.totalScore - a.totalScore);

      const calculationResults = {
        overallRanking: rankedEquipment.map((analysis, index) => ({
          equipmentName: analysis.equipment.name,
          totalScore: analysis.totalScore,
          rank: index + 1,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses
        })),
        totalCostOfOwnership: rankedEquipment.map(analysis => ({
          equipmentName: analysis.equipment.name,
          purchasePrice: analysis.tco.purchasePrice,
          operatingCost: analysis.tco.annualOperatingCost * inputs.operatingConditions.expectedLifespan,
          maintenanceCost: analysis.tco.annualMaintenanceCost * inputs.operatingConditions.expectedLifespan,
          totalTCO: analysis.tco.totalTCO,
          tcoPerYear: analysis.tco.tcoPerYear
        })),
        performanceComparison: rankedEquipment.map(analysis => ({
          equipmentName: analysis.equipment.name,
          productivityScore: analysis.performance.productivityScore,
          qualityScore: analysis.performance.qualityScore,
          capabilityScore: analysis.performance.capabilityScore,
          efficiencyScore: analysis.performance.efficiencyScore
        })),
        riskAssessment: rankedEquipment.map(analysis => ({
          equipmentName: analysis.equipment.name,
          overallRisk: analysis.risk.overallRisk,
          riskFactors: analysis.risk.riskFactors
        })),
        paybackAnalysis: rankedEquipment.map(analysis => ({
          equipmentName: analysis.equipment.name,
          paybackPeriod: analysis.payback.paybackPeriod,
          roi: analysis.payback.roi,
          npv: analysis.payback.npv,
          irr: analysis.payback.irr
        })),
        decisionMatrix: Object.entries(inputs.evaluationCriteria).map(([criteria, weight]) => ({
          criteria: criteria.charAt(0).toUpperCase() + criteria.slice(1).replace(/([A-Z])/g, ' $1'),
          weight: weight,
          scores: rankedEquipment.map(analysis => {
            const score = analysis.scores[criteria.charAt(0).toUpperCase() + criteria.slice(1).replace(/([A-Z])/g, ' $1')] ||
                         analysis.scores[Object.keys(analysis.scores).find(key =>
                           key.toLowerCase().replace(/\s+/g, '') === criteria.toLowerCase()
                         ) || ''] || 50;
            return {
              equipmentName: analysis.equipment.name,
              score: Math.round(score),
              weightedScore: Math.round((score * weight / 100) * 100) / 100
            };
          })
        })),
        recommendations: {
          bestOverall: rankedEquipment[0].equipment.name,
          bestValue: rankedEquipment.sort((a, b) => (a.payback.roi - b.payback.roi))[rankedEquipment.length - 1].equipment.name,
          bestPerformance: rankedEquipment.sort((a, b) =>
            (b.performance.productivityScore + b.performance.qualityScore) -
            (a.performance.productivityScore + a.performance.qualityScore)
          )[0].equipment.name,
          bestForBudget: rankedEquipment.sort((a, b) => a.tco.purchasePrice - b.tco.purchasePrice)[0].equipment.name,
          reasoning: [
            `${rankedEquipment[0].equipment.name} ranks highest overall with a score of ${rankedEquipment[0].totalScore}`,
            rankedEquipment[0].totalScore > rankedEquipment[1]?.totalScore + 5 ?
              'Clear winner with significant advantages' :
              'Close competition - consider specific priorities',
            rankedEquipment[0].payback.paybackPeriod < 4 ?
              'Excellent payback period makes this a financially sound choice' :
              'Consider long-term financial implications',
            rankedEquipment[0].risk.overallRisk === 'Low' ?
              'Low risk profile provides confidence in the investment' :
              'Evaluate risk factors carefully before proceeding',
            'Verify all specifications and negotiate final terms before purchase'
          ]
        },
        keyMetrics: {
          'Best Overall': rankedEquipment[0].equipment.name,
          'Best Value': rankedEquipment.sort((a, b) => b.payback.roi - a.payback.roi)[0].equipment.name,
          'Lowest TCO': rankedEquipment.sort((a, b) => a.tco.totalTCO - b.tco.totalTCO)[0].equipment.name,
          'Highest Performance': rankedEquipment.sort((a, b) =>
            (b.performance.productivityScore + b.performance.qualityScore + b.performance.capabilityScore + b.performance.efficiencyScore) -
            (a.performance.productivityScore + a.performance.qualityScore + a.performance.capabilityScore + a.performance.efficiencyScore)
          )[0].equipment.name
        },
        sensitivityAnalysis: {
          criteriaImpact: Object.entries(inputs.evaluationCriteria)
            .sort(([,a], [,b]) => b - a)
            .map(([criteria, weight]) => ({
              criteria: criteria.charAt(0).toUpperCase() + criteria.slice(1).replace(/([A-Z])/g, ' $1'),
              impact: weight,
              recommendation: weight > 20 ?
                'High impact - ensure accurate estimates' :
                weight > 10 ?
                'Moderate impact - consider carefully' :
                'Lower impact - less critical for decision'
            })),
          costSensitivity: rankedEquipment.map((analysis, index) => ({
            equipmentName: analysis.equipment.name,
            priceChange: 10, // 10% price increase
            rankingChange: index === 0 && rankedEquipment.length > 1 &&
              (rankedEquipment[1].totalScore - rankedEquipment[0].totalScore) < 5 ? 1 : 0
          }))
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Equipment Comparison Calculator</h1>
          <p className="text-muted-foreground">
            Compare multiple laser cutting equipment options using comprehensive analysis including TCO, performance, 
            risk assessment, and financial metrics. Make informed equipment purchase decisions with data-driven insights.
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
            <EquipmentComparisonCalculatorForm 
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Compare</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your equipment options, evaluation criteria, operating conditions, and production requirements, 
                    then click "Compare Equipment" to get comprehensive equipment comparison analysis and recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Comparison Complete!</strong> Best overall choice is{' '}
                    <strong>{results.recommendations.bestOverall}</strong> with a score of{' '}
                    <strong>{results.overallRanking[0].totalScore}</strong>. 
                    Best value: <strong>{results.recommendations.bestValue}</strong>, 
                    Best performance: <strong>{results.recommendations.bestPerformance}</strong>.
                  </AlertDescription>
                </Alert>
                
                <EquipmentComparisonCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <EquipmentComparisonExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <EquipmentComparisonFormulaExplanation />

          {/* Related Tools - Full container width */}
          <EquipmentComparisonRelatedTools />

          {/* Educational Content - Full container width */}
          <EquipmentComparisonEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <EquipmentComparisonFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Equipment Selection Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Evaluation Criteria:</h4>
                <ul className="space-y-1">
                  <li>• <strong>TCO Analysis:</strong> Consider total cost over equipment lifetime</li>
                  <li>• <strong>Performance Metrics:</strong> Productivity, quality, and capability</li>
                  <li>• <strong>Risk Assessment:</strong> Technology, service, and obsolescence risks</li>
                  <li>• <strong>Financial Analysis:</strong> ROI, payback period, and NPV</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Decision Factors:</h4>
                <ul className="space-y-1">
                  <li>• Align equipment capabilities with production requirements</li>
                  <li>• Consider future growth and technology evolution</li>
                  <li>• Evaluate service support and training availability</li>
                  <li>• Factor in installation, training, and integration costs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentComparisonCalculatorComponent;
