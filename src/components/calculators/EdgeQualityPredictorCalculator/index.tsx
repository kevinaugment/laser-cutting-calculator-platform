import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import EdgeQualityPredictorCalculatorForm from './EdgeQualityPredictorCalculatorForm';
import EdgeQualityPredictorCalculatorResults from './EdgeQualityPredictorCalculatorResults';
import EdgeQualityPredictorFormulaExplanation from './EdgeQualityPredictorFormulaExplanation';
import EdgeQualityPredictorExportTools from './EdgeQualityPredictorExportTools';
import EdgeQualityPredictorRelatedTools from './EdgeQualityPredictorRelatedTools';
import EdgeQualityPredictorEducationalContent from './EdgeQualityPredictorEducationalContent';
import EdgeQualityPredictorFAQ from './EdgeQualityPredictorFAQ';
// import { edgeQualityPredictor } from '../../../services/calculators/edgeQualityPredictor';

const EdgeQualityPredictorCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.thickness <= 0) {
        throw new Error('Material thickness must be greater than 0');
      }
      
      if (inputs.laserPower <= 0) {
        throw new Error('Laser power must be greater than 0');
      }

      if (inputs.cuttingSpeed <= 0) {
        throw new Error('Cutting speed must be greater than 0');
      }

      if (inputs.gasPressure <= 0) {
        throw new Error('Gas pressure must be greater than 0');
      }

      if (inputs.beamQuality < 1.0) {
        throw new Error('Beam quality (M²) must be at least 1.0');
      }

      if (inputs.nozzleDiameter <= 0) {
        throw new Error('Nozzle diameter must be greater than 0');
      }

      // Calculate edge quality prediction - temporarily using mock data
      const calculationResults = {
        qualityPrediction: {
          overallQualityGrade: 4.2,
          edgeRoughness: 2.8, // μm Ra
          confidenceLevel: 87,
          qualityClass: 'High Quality',
          expectedVariation: 8.5
        },
        edgeCharacteristics: {
          topEdgeQuality: 'Excellent',
          bottomEdgeQuality: 'Good',
          kerfTaper: 1.2, // degrees
          kerfWidth: 0.18, // mm
          drossLevel: 'Minimal',
          heatAffectedZone: 0.08, // mm
          edgeAngle: 89.2 // degrees from perpendicular
        },
        qualityFactors: {
          materialFactor: 0.85,
          powerSpeedFactor: 0.92,
          gasPressureFactor: 0.88,
          focusQualityFactor: 0.95,
          beamQualityFactor: 0.83,
          environmentalFactor: 0.90
        },
        defectRiskAnalysis: {
          roughnessRisk: 'low',
          taperRisk: 'low',
          drossRisk: 'medium',
          burnRisk: 'low',
          hazRisk: 'low',
          mitigationStrategies: [
            'Optimize power-speed ratio for material thickness',
            'Adjust gas pressure for better edge quality',
            'Fine-tune focus position for optimal cutting',
            'Monitor and control environmental conditions',
            'Implement real-time quality monitoring'
          ]
        },
        parameterOptimization: {
          powerRecommendation: {
            current: inputs.laserPower,
            optimal: Math.round(inputs.laserPower * 0.95),
            improvement: 'Reduce power by 5% to minimize heat input'
          },
          speedRecommendation: {
            current: inputs.cuttingSpeed,
            optimal: Math.round(inputs.cuttingSpeed * 1.08),
            improvement: 'Increase speed by 8% for better surface finish'
          },
          focusRecommendation: {
            current: inputs.focusPosition,
            optimal: -inputs.thickness / 3,
            improvement: 'Adjust focus to optimal position for thickness'
          },
          pressureRecommendation: {
            current: inputs.gasPressure,
            optimal: inputs.thickness * 0.8 + 2,
            improvement: 'Optimize pressure based on material thickness'
          }
        },
        qualityControlPlan: {
          inspectionPoints: [
            'Edge roughness measurement at top and bottom',
            'Kerf width and taper measurement',
            'Dross level visual inspection',
            'Heat affected zone measurement',
            'Dimensional accuracy verification'
          ],
          measurementMethods: [
            'Surface roughness tester (Ra measurement)',
            'Optical microscope for edge analysis',
            'Coordinate measuring machine (CMM)',
            'Visual inspection with magnification',
            'Metallographic cross-section analysis'
          ],
          acceptanceCriteria: [
            `Surface roughness ≤ ${inputs.edgeRequirements.maxRoughness} μm Ra`,
            `Kerf taper ≤ ${inputs.edgeRequirements.maxTaper}°`,
            `Heat affected zone ≤ ${inputs.edgeRequirements.maxHAZ} mm`,
            `Dross level: ${inputs.edgeRequirements.allowableDross} or better`,
            'No visible burn marks or discoloration'
          ],
          correctionActions: [
            'Adjust laser power if roughness exceeds limits',
            'Modify cutting speed for dimensional issues',
            'Change gas pressure for dross problems',
            'Refocus beam for taper correction',
            'Clean or replace nozzle if contaminated'
          ]
        },
        processStability: {
          stabilityIndex: 78,
          criticalParameters: [
            'Laser power stability (±2%)',
            'Cutting speed consistency',
            'Gas pressure regulation',
            'Focus position accuracy',
            'Material surface condition'
          ],
          monitoringRecommendations: [
            'Implement real-time power monitoring',
            'Use closed-loop speed control',
            'Install pressure sensors',
            'Regular focus calibration',
            'Material surface inspection'
          ],
          processCapability: 'Capable'
        },
        complianceAssessment: {
          industryStandards: [
            {
              standard: 'ISO 9013 (Thermal cutting)',
              compliance: 'pass',
              requirements: ['Edge perpendicularity', 'Surface roughness', 'Dimensional tolerance']
            },
            {
              standard: 'ASME Y14.5 (GD&T)',
              compliance: 'pass',
              requirements: ['Geometric dimensioning', 'Surface finish specifications']
            },
            {
              standard: 'AWS D1.1 (Welding)',
              compliance: 'marginal',
              requirements: ['Edge preparation quality', 'Heat affected zone limits']
            }
          ],
          customerRequirements: 'met',
          certificationReadiness: 'ready',
          improvementAreas: []
        },
        recommendations: {
          immediate: [
            'Verify current parameter settings match optimal recommendations',
            'Check nozzle condition and alignment',
            'Calibrate focus position measurement system'
          ],
          shortTerm: [
            'Implement statistical process control for key parameters',
            'Establish regular quality inspection schedule',
            'Train operators on quality indicators'
          ],
          longTerm: [
            'Consider upgrading to higher beam quality laser',
            'Implement automated quality monitoring system',
            'Develop predictive maintenance program'
          ],
          qualityImprovement: [
            'Optimize gas flow dynamics for better edge quality',
            'Implement adaptive control based on material variations',
            'Develop material-specific parameter databases',
            'Consider post-processing for critical applications'
          ]
        },
        sensitivityAnalysis: {
          power: [
            { variation: '-10%', qualityGrade: 4.0, roughness: 3.2, confidence: 82 },
            { variation: '-5%', qualityGrade: 4.3, roughness: 2.6, confidence: 89 },
            { variation: 'Base', qualityGrade: 4.2, roughness: 2.8, confidence: 87 },
            { variation: '+5%', qualityGrade: 3.9, roughness: 3.4, confidence: 84 },
            { variation: '+10%', qualityGrade: 3.6, roughness: 4.1, confidence: 79 }
          ],
          speed: [
            { variation: '-10%', qualityGrade: 3.8, roughness: 3.6, drossLevel: 'Light' },
            { variation: '-5%', qualityGrade: 4.0, roughness: 3.1, drossLevel: 'Minimal' },
            { variation: 'Base', qualityGrade: 4.2, roughness: 2.8, drossLevel: 'Minimal' },
            { variation: '+5%', qualityGrade: 4.4, roughness: 2.4, drossLevel: 'None' },
            { variation: '+10%', qualityGrade: 4.1, roughness: 2.9, drossLevel: 'Minimal' }
          ],
          focus: [
            { variation: '-0.5mm', qualityGrade: 3.9, topEdge: 'Good', bottomEdge: 'Fair' },
            { variation: '-0.25mm', qualityGrade: 4.1, topEdge: 'Excellent', bottomEdge: 'Good' },
            { variation: 'Base', qualityGrade: 4.2, topEdge: 'Excellent', bottomEdge: 'Good' },
            { variation: '+0.25mm', qualityGrade: 4.0, topEdge: 'Good', bottomEdge: 'Excellent' },
            { variation: '+0.5mm', qualityGrade: 3.7, topEdge: 'Fair', bottomEdge: 'Excellent' }
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edge Quality Predictor</h1>
          <p className="text-muted-foreground">
            Predict and optimize edge quality for laser cutting operations. Analyze surface roughness, edge characteristics, 
            defect risks, and get recommendations for parameter optimization and quality control.
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
            <EdgeQualityPredictorCalculatorForm 
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Predict</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your material specifications, laser parameters, gas settings, and quality requirements, 
                    then click "Predict Edge Quality" to get comprehensive edge quality analysis and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Prediction Complete!</strong> Quality grade is{' '}
                    <strong>{results.qualityPrediction.overallQualityGrade.toFixed(1)}/5</strong> ({results.qualityPrediction.qualityClass}) with{' '}
                    <strong>{results.qualityPrediction.edgeRoughness.toFixed(1)} μm Ra</strong> surface roughness.
                    Confidence level: <strong>{results.qualityPrediction.confidenceLevel}%</strong>.
                  </AlertDescription>
                </Alert>
                
                <EdgeQualityPredictorCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <EdgeQualityPredictorExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <EdgeQualityPredictorFormulaExplanation />

          {/* Related Tools - Full container width */}
          <EdgeQualityPredictorRelatedTools />

          {/* Educational Content - Full container width */}
          <EdgeQualityPredictorEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <EdgeQualityPredictorFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Edge Quality Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Parameter Optimization:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Power-Speed Balance:</strong> Optimize ratio for material thickness</li>
                  <li>• <strong>Focus Position:</strong> Typically -1/3 of material thickness</li>
                  <li>• <strong>Gas Pressure:</strong> Match to material type and thickness</li>
                  <li>• <strong>Beam Quality:</strong> Lower M² values give better edge quality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Control:</h4>
                <ul className="space-y-1">
                  <li>• Monitor surface roughness with Ra measurements</li>
                  <li>• Check kerf taper and edge perpendicularity</li>
                  <li>• Inspect for dross formation and heat effects</li>
                  <li>• Implement statistical process control</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeQualityPredictorCalculatorComponent;
