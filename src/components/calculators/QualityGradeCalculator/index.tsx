import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import QualityGradeCalculatorForm from './QualityGradeCalculatorForm';
import QualityGradeCalculatorResults from './QualityGradeCalculatorResults';
import QualityGradeFormulaExplanation from './QualityGradeFormulaExplanation';
import QualityGradeExportTools from './QualityGradeExportTools';
import QualityGradeRelatedTools from './QualityGradeRelatedTools';
import QualityGradeEducationalContent from './QualityGradeEducationalContent';
import QualityGradeFAQ from './QualityGradeFAQ';
// import { qualityGradePredictor } from '../../../services/calculators/qualityGradePredictor';

const QualityGradeCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!inputs.materialType) {
        throw new Error('Material type must be specified');
      }
      
      if (inputs.thickness <= 0 || inputs.thickness > 100) {
        throw new Error('Thickness must be between 0.1 and 100 mm');
      }

      if (inputs.laserPower <= 0) {
        throw new Error('Laser power must be greater than 0');
      }

      if (inputs.cuttingSpeed <= 0) {
        throw new Error('Cutting speed must be greater than 0');
      }

      if (!inputs.gasType) {
        throw new Error('Gas type must be specified');
      }

      if (inputs.gasPressure <= 0) {
        throw new Error('Gas pressure must be greater than 0');
      }

      if (inputs.beamDiameter <= 0) {
        throw new Error('Beam diameter must be greater than 0');
      }

      if (inputs.nozzleDistance <= 0) {
        throw new Error('Nozzle distance must be greater than 0');
      }

      if (!inputs.targetQuality) {
        throw new Error('Target quality level must be specified');
      }

      // Calculate quality grade prediction - inline calculation
      // Power density calculation
      const beamArea = Math.PI * Math.pow(inputs.beamDiameter / 2, 2);
      const powerDensity = inputs.laserPower / beamArea;

      // Speed-to-power ratio
      const speedToPowerRatio = inputs.cuttingSpeed / inputs.laserPower;

      // Material-specific quality factors
      const materialFactors = {
        'carbon_steel': { baseQuality: 0.8, powerSensitivity: 1.0, speedSensitivity: 0.9 },
        'stainless_steel': { baseQuality: 0.7, powerSensitivity: 1.2, speedSensitivity: 1.1 },
        'aluminum': { baseQuality: 0.9, powerSensitivity: 0.8, speedSensitivity: 0.8 },
        'copper': { baseQuality: 0.6, powerSensitivity: 1.5, speedSensitivity: 1.3 },
        'brass': { baseQuality: 0.7, powerSensitivity: 1.3, speedSensitivity: 1.2 },
        'titanium': { baseQuality: 0.5, powerSensitivity: 1.8, speedSensitivity: 1.5 }
      };

      const materialFactor = materialFactors[inputs.materialType as keyof typeof materialFactors] || materialFactors.carbon_steel;

      // Gas type influence on quality
      const gasFactors = {
        'oxygen': 1.0,
        'nitrogen': 1.2,
        'air': 0.8,
        'argon': 1.1
      };

      const gasFactor = gasFactors[inputs.gasType as keyof typeof gasFactors] || 1.0;

      // Quality score calculation (0-100)
      let qualityScore = materialFactor.baseQuality * 100;

      // Power density influence
      const optimalPowerDensity = 1000; // W/mm²
      const powerDensityRatio = powerDensity / optimalPowerDensity;
      if (powerDensityRatio < 0.5 || powerDensityRatio > 2.0) {
        qualityScore *= 0.7; // Significant penalty for poor power density
      } else if (powerDensityRatio < 0.8 || powerDensityRatio > 1.5) {
        qualityScore *= 0.9; // Minor penalty
      }

      // Speed influence
      const optimalSpeed = 2000; // mm/min for reference
      const speedRatio = inputs.cuttingSpeed / optimalSpeed;
      if (speedRatio > 2.0) {
        qualityScore *= 0.8; // Too fast
      } else if (speedRatio < 0.3) {
        qualityScore *= 0.9; // Too slow
      }

      // Gas pressure influence
      const optimalPressure = 15; // bar
      const pressureRatio = inputs.gasPressure / optimalPressure;
      if (pressureRatio < 0.5 || pressureRatio > 2.0) {
        qualityScore *= 0.9;
      }

      // Apply gas factor
      qualityScore *= gasFactor;

      // Thickness influence
      if (inputs.thickness > 20) {
        qualityScore *= 0.8; // Thick materials are harder to cut cleanly
      } else if (inputs.thickness < 1) {
        qualityScore *= 0.9; // Very thin materials can be challenging
      }

      // Determine quality grade based on ISO 9013
      let qualityGrade = 'Q5';
      let gradeDescription = 'Poor';

      if (qualityScore >= 90) {
        qualityGrade = 'Q1';
        gradeDescription = 'Excellent';
      } else if (qualityScore >= 80) {
        qualityGrade = 'Q2';
        gradeDescription = 'Good';
      } else if (qualityScore >= 70) {
        qualityGrade = 'Q3';
        gradeDescription = 'Fair';
      } else if (qualityScore >= 60) {
        qualityGrade = 'Q4';
        gradeDescription = 'Acceptable';
      }

      // Surface roughness estimation (Ra in μm)
      const baseSurfaceRoughness = 3.2; // μm
      const surfaceRoughness = baseSurfaceRoughness * (100 / qualityScore);

      // Edge quality metrics
      const edgeSquareness = Math.max(0, 100 - (100 - qualityScore) * 1.5);
      const drossAttachment = Math.max(0, (100 - qualityScore) * 0.8);

      const calculationResults = {
        qualityScore: Math.round(qualityScore * 10) / 10,
        qualityGrade,
        gradeDescription,
        powerDensity: Math.round(powerDensity * 100) / 100,
        speedToPowerRatio: Math.round(speedToPowerRatio * 1000) / 1000,
        surfaceRoughness: Math.round(surfaceRoughness * 100) / 100,
        edgeSquareness: Math.round(edgeSquareness * 10) / 10,
        drossAttachment: Math.round(drossAttachment * 10) / 10,

        // Recommendations
        recommendations: [
          qualityScore < 70 ? 'Consider optimizing cutting parameters for better quality' : 'Current parameters should produce good quality cuts',
          powerDensity < 500 ? 'Increase laser power or reduce beam diameter for better power density' : 'Power density is adequate',
          inputs.cuttingSpeed > 3000 ? 'Reduce cutting speed for better edge quality' : 'Cutting speed is appropriate',
          inputs.gasPressure < 10 ? 'Consider increasing gas pressure for better cut quality' : 'Gas pressure is adequate'
        ],

        // Process optimization suggestions
        optimizationSuggestions: [
          {
            parameter: 'Laser Power',
            current: inputs.laserPower,
            recommended: Math.round(inputs.laserPower * (optimalPowerDensity / powerDensity) * 0.8),
            impact: 'High'
          },
          {
            parameter: 'Cutting Speed',
            current: inputs.cuttingSpeed,
            recommended: Math.min(inputs.cuttingSpeed * 1.2, optimalSpeed),
            impact: 'Medium'
          },
          {
            parameter: 'Gas Pressure',
            current: inputs.gasPressure,
            recommended: Math.max(inputs.gasPressure, optimalPressure * 0.8),
            impact: 'Low'
          }
        ]
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
        calculatorId="quality-grade-calculator"
        name="Quality Grade Calculator"
        description="Predict and optimize laser cutting quality based on process parameters. Analyze surface finish, edge quality, and overall cut grade according to ISO 9013 standards."
        category="Quality Control"
        keywords={[
          'quality grade calculator',
          'laser cutting quality assessment',
          'ISO 9013 quality standards',
          'surface finish calculator',
          'edge quality predictor',
          'cut quality optimization',
          'laser cutting quality control',
          'quality grade assessment tool'
        ]}
        features={[
          'ISO 9013 quality grade assessment',
          'Surface finish prediction',
          'Edge quality analysis',
          'Process parameter optimization',
          'Quality improvement recommendations',
          'Cut grade classification',
          'Quality control metrics',
          'Process optimization suggestions'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'edge-quality-predictor',
          'laser-parameter-optimizer',
          'warping-risk-calculator',
          'tolerance-stack-calculator'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Quality Grade Calculator</h1>
          <p className="text-muted-foreground">
            Predict and optimize laser cutting quality based on process parameters. Analyze surface finish, 
            edge quality, and overall cut grade according to ISO 9013 standards.
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
            <QualityGradeCalculatorForm 
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
                    Configure your material specifications, laser parameters, gas settings, and focus position, 
                    then click "Predict Quality Grade" to get detailed quality analysis and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Quality Analysis Complete!</strong> Predicted quality grade is{' '}
                    <strong>{results.predictedQualityGrade.toFixed(1)}/5</strong> with{' '}
                    <strong>{results.qualityAssessment.overallScore}/100</strong> overall score.
                    Surface roughness: <strong>{results.qualityMetrics.surfaceRoughness.toFixed(1)} μm</strong>.
                  </AlertDescription>
                </Alert>
                
                <QualityGradeCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <QualityGradeExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <QualityGradeFormulaExplanation />

          {/* Related Tools - Full container width */}
          <QualityGradeRelatedTools />

          {/* Educational Content - Full container width */}
          <QualityGradeEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <QualityGradeFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Quality Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Parameter Optimization:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Power-Speed Balance:</strong> Optimize for material thickness</li>
                  <li>• <strong>Focus Position:</strong> Typically 1/3 thickness below surface</li>
                  <li>• <strong>Gas Selection:</strong> Nitrogen for clean cuts, oxygen for speed</li>
                  <li>• <strong>Beam Quality:</strong> Lower M² values improve cut quality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Standards:</h4>
                <ul className="space-y-1">
                  <li>• Grade 1-2: Production cutting (rough finish)</li>
                  <li>• Grade 3: Standard quality (most applications)</li>
                  <li>• Grade 4: High quality (precision parts)</li>
                  <li>• Grade 5: Precision cutting (critical applications)</li>
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

export default QualityGradeCalculatorComponent;
