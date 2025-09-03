import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import WarpingRiskCalculatorForm from './WarpingRiskCalculatorForm';
import WarpingRiskCalculatorResults from './WarpingRiskCalculatorResults';
import WarpingRiskFormulaExplanation from './WarpingRiskFormulaExplanation';
import WarpingRiskExportTools from './WarpingRiskExportTools';
import WarpingRiskRelatedTools from './WarpingRiskRelatedTools';
import WarpingRiskEducationalContent from './WarpingRiskEducationalContent';
import WarpingRiskFAQ from './WarpingRiskFAQ';
// import { warpingRiskCalculator } from '../../../services/calculators/warpingRiskCalculator';

const WarpingRiskCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.dimensions.length <= 0) {
        throw new Error('Part length must be greater than 0');
      }
      
      if (inputs.dimensions.width <= 0) {
        throw new Error('Part width must be greater than 0');
      }

      if (inputs.dimensions.thickness <= 0) {
        throw new Error('Part thickness must be greater than 0');
      }

      if (inputs.cuttingParameters.laserPower <= 0) {
        throw new Error('Laser power must be greater than 0');
      }

      if (inputs.cuttingParameters.cuttingSpeed <= 0) {
        throw new Error('Cutting speed must be greater than 0');
      }

      // Calculate warping risk - temporarily using mock data
      const calculationResults = {
        warpingRiskAssessment: {
          overallRiskLevel: calculateRiskLevel(inputs),
          riskScore: calculateRiskScore(inputs),
          confidenceLevel: 85,
          primaryRiskFactors: getPrimaryRiskFactors(inputs),
          riskDistribution: {
            thermalRisk: calculateThermalRisk(inputs),
            geometricRisk: calculateGeometricRisk(inputs),
            materialRisk: calculateMaterialRisk(inputs),
            processRisk: calculateProcessRisk(inputs)
          }
        },
        thermalAnalysis: {
          peakTemperature: calculatePeakTemperature(inputs),
          temperatureGradient: calculateTemperatureGradient(inputs),
          coolingRate: calculateCoolingRate(inputs),
          thermalStress: calculateThermalStress(inputs),
          heatAffectedArea: calculateHeatAffectedArea(inputs),
          thermalDistortionPrediction: calculateThermalDistortion(inputs)
        },
        mechanicalAnalysis: {
          totalDeformation: calculateTotalDeformation(inputs),
          stressDistribution: {
            maxStress: calculateThermalStress(inputs) * 1.5,
            avgStress: calculateThermalStress(inputs) * 0.8,
            stressConcentration: 2.5
          },
          elasticDeformation: calculateTotalDeformation(inputs) * 0.7,
          plasticDeformation: calculateTotalDeformation(inputs) * 0.3,
          residualStress: calculateThermalStress(inputs) * 0.6
        },
        geometricFactors: {
          aspectRatioEffect: Math.min(1.0, 1 / inputs.partGeometry.aspectRatio),
          thicknessEffect: Math.min(1.0, inputs.dimensions.thickness / 10),
          openingEffect: Math.max(0, 1 - (inputs.partGeometry.openings.totalArea / (inputs.dimensions.length * inputs.dimensions.width)) * 3),
          shapeComplexity: getShapeComplexity(inputs.partGeometry.shape),
          supportAdequacy: getSupportAdequacy(inputs.partGeometry.supportStructure),
          geometricStabilityIndex: 7.5
        },
        preventionStrategies: {
          parameterAdjustments: {
            recommendedPower: Math.round(inputs.cuttingParameters.laserPower * 0.85),
            recommendedSpeed: Math.round(inputs.cuttingParameters.cuttingSpeed * 1.15),
            recommendedPasses: inputs.cuttingParameters.numberOfPasses + (calculateRiskScore(inputs) > 6 ? 1 : 0),
            coolingStrategy: calculateRiskScore(inputs) > 6 ? 'Extended cooling between passes' : 'Standard cooling'
          },
          sequenceOptimization: {
            optimalCutSequence: 'Optimized stress-relief sequence',
            stressReliefPattern: [
              'Start with internal features',
              'Progress to external contours',
              'Use balanced cutting approach',
              'Implement stress relief cuts'
            ],
            supportRecommendations: [
              'Increase support density near stress concentrations',
              'Use distributed clamping strategy',
              'Implement progressive release sequence'
            ]
          },
          fixtureDesign: {
            fixturingStrategy: calculateRiskScore(inputs) > 6 ? 'Multi-point vacuum with backup clamps' : 'Standard distributed clamping',
            supportPoints: [
              { x: inputs.dimensions.length * 0.25, y: inputs.dimensions.width * 0.25, force: 100 },
              { x: inputs.dimensions.length * 0.75, y: inputs.dimensions.width * 0.25, force: 100 },
              { x: inputs.dimensions.length * 0.25, y: inputs.dimensions.width * 0.75, force: 100 },
              { x: inputs.dimensions.length * 0.75, y: inputs.dimensions.width * 0.75, force: 100 }
            ],
            clampingForce: Math.min(500, inputs.constraintConditions.fixturingForce * 1.2),
            releaseSequence: [
              'Release corner clamps first',
              'Gradually reduce clamping force',
              'Final release after complete cooling'
            ]
          }
        },
        mitigationTechniques: {
          preProcessing: [
            'Pre-stress material to counteract warping',
            'Use material with lower thermal expansion',
            'Optimize part orientation on cutting bed',
            'Pre-heat material to reduce thermal shock'
          ],
          duringProcess: [
            'Monitor temperature distribution in real-time',
            'Adjust cutting parameters based on thermal feedback',
            'Use active cooling during cutting',
            'Implement progressive clamping release'
          ],
          postProcessing: [
            'Stress relief heat treatment',
            'Mechanical straightening if needed',
            'Dimensional inspection and correction',
            'Surface finishing to remove stress concentrations'
          ],
          emergencyActions: [
            'Stop cutting if excessive warping detected',
            'Increase clamping force temporarily',
            'Switch to lower power settings',
            'Implement emergency cooling'
          ]
        },
        qualityPrediction: {
          expectedFlatness: calculateExpectedFlatness(inputs),
          dimensionalAccuracy: calculateDimensionalAccuracy(inputs),
          repeatability: 92,
          processCapability: 1.33,
          qualityGrade: getQualityGrade(inputs)
        },
        monitoringPlan: {
          criticalParameters: [
            'Part temperature during cutting',
            'Clamping force distribution',
            'Real-time deformation measurement',
            'Cutting speed consistency',
            'Power stability'
          ],
          measurementPoints: [
            { x: inputs.dimensions.length * 0.1, y: inputs.dimensions.width * 0.1, parameter: 'Temperature' },
            { x: inputs.dimensions.length * 0.5, y: inputs.dimensions.width * 0.5, parameter: 'Deformation' },
            { x: inputs.dimensions.length * 0.9, y: inputs.dimensions.width * 0.9, parameter: 'Temperature' }
          ],
          inspectionFrequency: 'Every 5 parts or hourly',
          correctionTriggers: [
            'Flatness deviation > 50% of tolerance',
            'Temperature gradient > 100°C/mm',
            'Clamping force loss > 20%',
            'Visible part distortion during cutting'
          ]
        },
        recommendations: {
          immediate: [
            'Verify current clamping force and distribution',
            'Check material surface condition and flatness',
            'Calibrate temperature monitoring system',
            'Review cutting sequence optimization'
          ],
          processOptimization: [
            'Implement closed-loop temperature control',
            'Optimize fixture design for better support',
            'Develop material-specific parameter database',
            'Use predictive warping models'
          ],
          qualityImprovement: [
            'Implement statistical process control',
            'Regular flatness measurement and documentation',
            'Operator training on warping prevention',
            'Preventive maintenance of clamping systems'
          ],
          preventiveMeasures: [
            'Pre-stress parts before cutting',
            'Use backing plates for thin materials',
            'Implement part rotation for uniform cooling',
            'Monitor ambient temperature variations'
          ]
        },
        comparisonData: {
          industryStandard: 0.15,
          bestPractice: 0.05,
          yourPerformance: calculateTotalDeformation(inputs) <= 0.08 ? 'good' : calculateTotalDeformation(inputs) <= 0.15 ? 'average' : 'poor',
          improvementPotential: Math.max(0, ((calculateTotalDeformation(inputs) - 0.05) / calculateTotalDeformation(inputs)) * 100)
        },
        sensitivityAnalysis: {
          power: [
            { variation: '-20%', riskScore: calculateRiskScore(inputs) * 0.8, deformation: calculateTotalDeformation(inputs) * 0.85, riskLevel: 'Low' },
            { variation: '-10%', riskScore: calculateRiskScore(inputs) * 0.9, deformation: calculateTotalDeformation(inputs) * 0.92, riskLevel: 'Medium' },
            { variation: '+10%', riskScore: calculateRiskScore(inputs) * 1.1, deformation: calculateTotalDeformation(inputs) * 1.08, riskLevel: 'Medium' },
            { variation: '+20%', riskScore: calculateRiskScore(inputs) * 1.2, deformation: calculateTotalDeformation(inputs) * 1.15, riskLevel: 'High' }
          ],
          thickness: [
            { variation: '-20%', riskScore: calculateRiskScore(inputs) * 1.3, thermalStress: calculateThermalStress(inputs) * 1.4, qualityGrade: 'poor' },
            { variation: '-10%', riskScore: calculateRiskScore(inputs) * 1.15, thermalStress: calculateThermalStress(inputs) * 1.2, qualityGrade: 'acceptable' },
            { variation: '+10%', riskScore: calculateRiskScore(inputs) * 0.9, thermalStress: calculateThermalStress(inputs) * 0.85, qualityGrade: 'good' },
            { variation: '+20%', riskScore: calculateRiskScore(inputs) * 0.8, thermalStress: calculateThermalStress(inputs) * 0.7, qualityGrade: 'excellent' }
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

  // Helper functions for calculations
  const calculateRiskScore = (inputs: any): number => {
    const powerDensity = inputs.cuttingParameters.laserPower / (inputs.dimensions.length * inputs.dimensions.width) * 1000000;
    const aspectRatio = inputs.partGeometry.aspectRatio;
    const thicknessRatio = Math.max(inputs.dimensions.length, inputs.dimensions.width) / inputs.dimensions.thickness;
    
    let riskScore = (powerDensity / 1000 + aspectRatio / 5 + thicknessRatio / 50) * 2;
    
    // Material factor
    const materialFactors = { 'aluminum': 1.5, 'copper': 1.8, 'brass': 1.6, 'mild_steel': 1.0, 'stainless_steel': 1.2, 'carbon_steel': 1.1, 'titanium': 0.8 };
    riskScore *= materialFactors[inputs.materialType] || 1.0;
    
    return Math.min(10, Math.max(1, riskScore));
  };

  const calculateRiskLevel = (inputs: any): 'low' | 'medium' | 'high' | 'critical' => {
    const score = calculateRiskScore(inputs);
    if (score <= 3) return 'low';
    if (score <= 6) return 'medium';
    if (score <= 8) return 'high';
    return 'critical';
  };

  const calculateThermalRisk = (inputs: any): number => {
    const powerDensity = inputs.cuttingParameters.laserPower / (inputs.dimensions.length * inputs.dimensions.width) * 1000000;
    return Math.min(100, (powerDensity / 1000) * 30);
  };

  const calculateGeometricRisk = (inputs: any): number => {
    const aspectRatio = inputs.partGeometry.aspectRatio;
    const thicknessRatio = Math.max(inputs.dimensions.length, inputs.dimensions.width) / inputs.dimensions.thickness;
    return Math.min(100, (aspectRatio * 5 + thicknessRatio / 2));
  };

  const calculateMaterialRisk = (inputs: any): number => {
    const materialRisks = { 'aluminum': 35, 'copper': 40, 'brass': 38, 'mild_steel': 20, 'stainless_steel': 25, 'carbon_steel': 22, 'titanium': 15 };
    return materialRisks[inputs.materialType] || 25;
  };

  const calculateProcessRisk = (inputs: any): number => {
    const powerSpeedRatio = inputs.cuttingParameters.laserPower / (inputs.cuttingParameters.cuttingSpeed / 1000);
    const passRisk = inputs.cuttingParameters.numberOfPasses * 5;
    return Math.min(100, powerSpeedRatio / 50 + passRisk);
  };

  const calculatePeakTemperature = (inputs: any): number => {
    const energyDensity = inputs.cuttingParameters.laserPower / (inputs.dimensions.length * inputs.dimensions.width) * 1000000;
    return inputs.environmentalConditions.ambientTemperature + energyDensity / 10000;
  };

  const calculateTemperatureGradient = (inputs: any): number => {
    return calculatePeakTemperature(inputs) / (inputs.dimensions.thickness * 2);
  };

  const calculateCoolingRate = (inputs: any): number => {
    const airflowFactors = { 'none': 50, 'natural': 100, 'forced': 200, 'controlled': 300 };
    return airflowFactors[inputs.environmentalConditions.airflow] || 100;
  };

  const calculateThermalStress = (inputs: any): number => {
    return inputs.thermalProperties.thermalExpansion * calculateTemperatureGradient(inputs) * inputs.thermalProperties.elasticModulus / 1000;
  };

  const calculateHeatAffectedArea = (inputs: any): number => {
    return Math.PI * Math.pow(inputs.dimensions.thickness * 3, 2);
  };

  const calculateThermalDistortion = (inputs: any): number => {
    return calculateThermalStress(inputs) / inputs.thermalProperties.yieldStrength * inputs.dimensions.length / 1000;
  };

  const calculateTotalDeformation = (inputs: any): number => {
    const thermalDeformation = calculateThermalDistortion(inputs);
    const mechanicalDeformation = calculateThermalStress(inputs) / inputs.thermalProperties.elasticModulus * inputs.dimensions.length / 1000;
    return thermalDeformation + mechanicalDeformation;
  };

  const calculateExpectedFlatness = (inputs: any): number => {
    return Math.max(inputs.qualityRequirements.flatnessTolerance, calculateTotalDeformation(inputs));
  };

  const calculateDimensionalAccuracy = (inputs: any): number => {
    return calculateTotalDeformation(inputs) * 0.5;
  };

  const getPrimaryRiskFactors = (inputs: any): string[] => {
    const factors = [];
    if (inputs.partGeometry.aspectRatio > 3) factors.push('High aspect ratio increases warping risk');
    if (inputs.dimensions.thickness < 2) factors.push('Thin material prone to thermal distortion');
    if (inputs.cuttingParameters.laserPower / (inputs.dimensions.length * inputs.dimensions.width) > 0.01) factors.push('High power density causes excessive heating');
    if (inputs.partGeometry.supportStructure === 'none' || inputs.partGeometry.supportStructure === 'minimal') factors.push('Insufficient support structure');
    return factors.length > 0 ? factors : ['No major risk factors identified'];
  };

  const getShapeComplexity = (shape: string): number => {
    const complexities = { 'rectangular': 0.9, 'circular': 1.0, 'complex': 0.6, 'thin_strip': 0.4, 'large_plate': 0.7 };
    return complexities[shape] || 0.8;
  };

  const getSupportAdequacy = (support: string): number => {
    const adequacies = { 'none': 0.2, 'minimal': 0.5, 'moderate': 0.8, 'extensive': 1.0 };
    return adequacies[support] || 0.6;
  };

  const getQualityGrade = (inputs: any): 'excellent' | 'good' | 'acceptable' | 'poor' => {
    const deformation = calculateTotalDeformation(inputs);
    if (deformation <= 0.05) return 'excellent';
    if (deformation <= 0.1) return 'good';
    if (deformation <= 0.2) return 'acceptable';
    return 'poor';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Warping Risk Calculator</h1>
          <p className="text-muted-foreground">
            Predict and prevent thermal distortion and warping during laser cutting. 
            Get comprehensive risk assessment, prevention strategies, and quality predictions for optimal part flatness.
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
            <WarpingRiskCalculatorForm 
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
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your material properties, part geometry, cutting parameters, environmental conditions, and quality requirements, 
                    then click "Analyze Warping Risk" to get comprehensive distortion analysis and prevention strategies.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Analysis Complete!</strong> Warping risk level is{' '}
                    <strong>{results.warpingRiskAssessment.overallRiskLevel}</strong> with{' '}
                    <strong>{results.mechanicalAnalysis.totalDeformation.toFixed(3)} mm</strong> predicted deformation.
                    Quality grade: <strong>{results.qualityPrediction.qualityGrade}</strong>.
                  </AlertDescription>
                </Alert>
                
                <WarpingRiskCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <WarpingRiskExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <WarpingRiskFormulaExplanation />

          {/* Related Tools - Full container width */}
          <WarpingRiskRelatedTools />

          {/* Educational Content - Full container width */}
          <WarpingRiskEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <WarpingRiskFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Warping Prevention Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Risk Reduction:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Lower Heat Input:</strong> Reduce power or increase speed</li>
                  <li>• <strong>Better Support:</strong> Use distributed clamping strategy</li>
                  <li>• <strong>Sequence Optimization:</strong> Cut internal features first</li>
                  <li>• <strong>Cooling Control:</strong> Implement active cooling systems</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Control:</h4>
                <ul className="space-y-1">
                  <li>• Monitor part temperature during cutting</li>
                  <li>• Check flatness with regular measurements</li>
                  <li>• Implement real-time deformation monitoring</li>
                  <li>• Document optimal parameters for each material</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarpingRiskCalculatorComponent;
