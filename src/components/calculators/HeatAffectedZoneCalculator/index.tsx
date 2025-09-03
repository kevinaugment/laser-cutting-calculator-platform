import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { Icon, StatusIcon } from '../../ui/IconRegistry';
import HeatAffectedZoneCalculatorForm from './HeatAffectedZoneCalculatorForm';
import HeatAffectedZoneCalculatorResults from './HeatAffectedZoneCalculatorResults';
import HeatAffectedZoneFormulaExplanation from './HeatAffectedZoneFormulaExplanation';
import HeatAffectedZoneExportTools from './HeatAffectedZoneExportTools';
import HeatAffectedZoneRelatedTools from './HeatAffectedZoneRelatedTools';
import HeatAffectedZoneEducationalContent from './HeatAffectedZoneEducationalContent';
import HeatAffectedZoneFAQ from './HeatAffectedZoneFAQ';
import ErrorBoundary from '../../ui/ErrorBoundary';
// import { heatAffectedZoneCalculator } from '../../../services/calculators/heatAffectedZoneCalculator';

const HeatAffectedZoneCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.material.thickness <= 0) {
        throw new Error('Material thickness must be greater than 0');
      }
      
      if (inputs.laserParams.power <= 0) {
        throw new Error('Laser power must be greater than 0');
      }

      if (inputs.laserParams.speed <= 0) {
        throw new Error('Cutting speed must be greater than 0');
      }

      if (inputs.laserParams.beamDiameter <= 0) {
        throw new Error('Beam diameter must be greater than 0');
      }

      if (inputs.conditions.gasPressure <= 0) {
        throw new Error('Gas pressure must be greater than 0');
      }

      // Calculate heat affected zone - temporarily using mock data
      const calculationResults = {
        hazAnalysis: {
          width: calculateHAZWidth(inputs),
          depth: calculateHAZWidth(inputs) * 0.7,
          volume: calculateHAZWidth(inputs) * calculateHAZWidth(inputs) * 0.7 * inputs.laserParams.beamDiameter,
          classification: getHAZClassification(calculateHAZWidth(inputs)),
          acceptability: getHAZAcceptability(calculateHAZWidth(inputs), inputs.requirements.hazRequirement),
          temperatureProfile: generateTemperatureProfile(inputs)
        },
        thermalAnalysis: {
          peakTemperature: calculatePeakTemperature(inputs),
          heatingRate: (inputs.laserParams.power * 60) / (inputs.laserParams.speed * inputs.material.specificHeat * inputs.material.density),
          coolingRate: inputs.material.thermalConductivity * 100 / inputs.material.thickness,
          timeAtTemperature: inputs.laserParams.beamDiameter / (inputs.laserParams.speed / 60),
          thermalGradient: calculatePeakTemperature(inputs) / (inputs.laserParams.beamDiameter / 2),
          energyDensity: (inputs.laserParams.power * 60) / (inputs.laserParams.speed * inputs.laserParams.beamDiameter)
        },
        materialChanges: {
          hardnessChange: {
            percentage: Math.min(25, calculateHAZWidth(inputs) * 100),
            newHardness: 45 + calculateHAZWidth(inputs) * 50,
            originalHardness: 45
          },
          microstructureChanges: [
            'Grain growth in HAZ region',
            'Possible carbide precipitation',
            'Thermal stress formation',
            'Localized hardness variation'
          ],
          mechanicalProperties: {
            tensileStrength: { change: -5, unit: '%' },
            yieldStrength: { change: -8, unit: '%' },
            ductility: { change: -12, unit: '%' }
          },
          residualStress: {
            level: calculateHAZWidth(inputs) > 0.2 ? 'High' : calculateHAZWidth(inputs) > 0.1 ? 'Medium' : 'Low',
            magnitude: calculateHAZWidth(inputs) * 1000,
            distribution: 'Tensile at surface, compressive in core'
          }
        },
        qualityAssessment: {
          overallGrade: getQualityGrade(inputs, calculateHAZWidth(inputs)),
          hazWidthCompliance: calculateHAZWidth(inputs) <= inputs.requirements.maxHazWidth,
          hardnessCompliance: Math.min(25, calculateHAZWidth(inputs) * 100) <= inputs.requirements.maxHardnessChange,
          microstructureCompliance: calculateHAZWidth(inputs) <= 0.15,
          complianceScore: getComplianceScore(inputs, calculateHAZWidth(inputs)),
          riskLevel: getRiskLevel(calculateHAZWidth(inputs), inputs.requirements.applicationCriticality)
        },
        optimizedParameters: {
          status: calculateHAZWidth(inputs) <= inputs.requirements.maxHazWidth ? 'Already Optimized' : 'Optimization Needed',
          currentHAZ: calculateHAZWidth(inputs),
          targetHAZ: inputs.requirements.maxHazWidth,
          improvements: [
            'Reduce laser power by 15% to minimize heat input',
            'Increase cutting speed by 20% to reduce interaction time',
            'Consider pulsed mode operation for better heat control',
            'Implement active cooling for critical applications'
          ],
          recommendedPower: Math.round(inputs.laserParams.power * 0.85),
          recommendedSpeed: Math.round(inputs.laserParams.speed * 1.2),
          recommendedFrequency: inputs.laserParams.pulseFrequency === 0 ? 15000 : inputs.laserParams.pulseFrequency * 1.5,
          expectedImprovement: 25
        },
        processControl: {
          criticalParameters: [
            'Laser power stability (±2%)',
            'Cutting speed consistency',
            'Focus position accuracy',
            'Gas pressure regulation',
            'Material temperature control'
          ],
          monitoringPoints: [
            'Real-time temperature monitoring',
            'HAZ width measurement',
            'Hardness testing at intervals',
            'Visual inspection for discoloration',
            'Dimensional accuracy verification'
          ],
          controlLimits: {
            hazWidth: { 
              min: 0, 
              max: inputs.requirements.maxHazWidth * 1.1, 
              target: inputs.requirements.maxHazWidth * 0.8 
            },
            temperature: { 
              min: inputs.conditions.ambientTemperature, 
              max: inputs.material.meltingPoint * 0.8, 
              target: inputs.material.meltingPoint * 0.6 
            },
            coolingRate: { 
              min: 50, 
              max: 500, 
              target: 200 
            }
          },
          qualityIndicators: [
            'No visible discoloration beyond HAZ limit',
            'Hardness variation within specification',
            'No cracking or thermal damage',
            'Dimensional stability maintained'
          ]
        },
        recommendations: {
          immediate: [
            'Verify current parameter settings match requirements',
            'Check material surface condition and cleanliness',
            'Calibrate temperature monitoring system'
          ],
          processOptimization: [
            'Implement closed-loop temperature control',
            'Optimize gas flow for better cooling',
            'Consider beam shaping for uniform heating',
            'Develop material-specific parameter database'
          ],
          qualityImprovement: [
            'Implement statistical process control',
            'Regular HAZ measurement and documentation',
            'Operator training on thermal effects',
            'Preventive maintenance schedule'
          ],
          preventiveMeasures: [
            'Pre-heat thick materials to reduce thermal shock',
            'Use backing plates for heat dissipation',
            'Implement part rotation for uniform cooling',
            'Monitor ambient temperature variations'
          ]
        },
        comparisonData: {
          industryStandard: 0.25,
          bestPractice: 0.12,
          yourPerformance: calculateHAZWidth(inputs) <= 0.15 ? 'good' : calculateHAZWidth(inputs) <= 0.25 ? 'average' : 'poor',
          improvementPotential: Math.max(0, ((calculateHAZWidth(inputs) - 0.12) / calculateHAZWidth(inputs)) * 100)
        },
        sensitivityAnalysis: {
          power: [
            { variation: '-20%', hazWidth: calculateHAZWidth(inputs) * 0.85, peakTemp: calculatePeakTemperature(inputs) * 0.8, compliance: 'Pass' },
            { variation: '-10%', hazWidth: calculateHAZWidth(inputs) * 0.92, peakTemp: calculatePeakTemperature(inputs) * 0.9, compliance: 'Pass' },
            { variation: '+10%', hazWidth: calculateHAZWidth(inputs) * 1.08, peakTemp: calculatePeakTemperature(inputs) * 1.1, compliance: 'Marginal' },
            { variation: '+20%', hazWidth: calculateHAZWidth(inputs) * 1.15, peakTemp: calculatePeakTemperature(inputs) * 1.2, compliance: 'Fail' }
          ],
          speed: [
            { variation: '-20%', hazWidth: calculateHAZWidth(inputs) * 1.12, coolingRate: 150, quality: 'Poor' },
            { variation: '-10%', hazWidth: calculateHAZWidth(inputs) * 1.06, coolingRate: 175, quality: 'Fair' },
            { variation: '+10%', hazWidth: calculateHAZWidth(inputs) * 0.94, coolingRate: 225, quality: 'Good' },
            { variation: '+20%', hazWidth: calculateHAZWidth(inputs) * 0.88, coolingRate: 250, quality: 'Excellent' }
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
  const calculateHAZWidth = (inputs: any): number => {
    const heatInput = (inputs.laserParams.power * 60) / inputs.laserParams.speed;
    const thermalDiffusivity = inputs.material.thermalConductivity / (inputs.material.density * inputs.material.specificHeat);
    const interactionTime = inputs.laserParams.beamDiameter / (inputs.laserParams.speed / 60);
    
    let hazWidth = Math.sqrt((heatInput * thermalDiffusivity) / (Math.PI * inputs.material.thermalConductivity * inputs.material.thickness));
    hazWidth = Math.max(hazWidth, inputs.laserParams.beamDiameter * 2);
    
    // Pulse frequency effects
    if (inputs.laserParams.pulseFrequency > 0) {
      const dutyCycle = inputs.laserParams.dutyCycle / 100;
      hazWidth *= Math.sqrt(dutyCycle);
    }
    
    return Math.round(hazWidth * 1000) / 1000;
  };

  const calculatePeakTemperature = (inputs: any): number => {
    const energyDensity = (inputs.laserParams.power * 60) / (inputs.laserParams.speed * inputs.laserParams.beamDiameter);
    const absorptivity = 0.3; // Simplified
    const effectiveEnergy = energyDensity * absorptivity;
    const temperatureRise = effectiveEnergy / (inputs.material.density * inputs.material.specificHeat * inputs.material.thickness);
    
    return inputs.conditions.ambientTemperature + temperatureRise;
  };

  const generateTemperatureProfile = (inputs: any): Array<{distance: number, temperature: number}> => {
    const profile = [];
    const hazWidth = calculateHAZWidth(inputs);
    const peakTemp = calculatePeakTemperature(inputs);
    const steps = 10;
    const stepSize = hazWidth / steps;
    
    for (let i = 0; i <= steps; i++) {
      const distance = i * stepSize;
      const temperature = peakTemp * Math.exp(-Math.pow(distance / (hazWidth / 3), 2));
      profile.push({ distance, temperature });
    }
    
    return profile;
  };

  const getHAZClassification = (hazWidth: number): string => {
    if (hazWidth < 0.05) return 'Minimal';
    if (hazWidth < 0.1) return 'Small';
    if (hazWidth < 0.2) return 'Moderate';
    if (hazWidth < 0.3) return 'Large';
    return 'Excessive';
  };

  const getHAZAcceptability = (hazWidth: number, requirement: string): string => {
    const limits = { minimal: 0.1, standard: 0.2, acceptable: 0.3, relaxed: 0.5 };
    return hazWidth <= limits[requirement] ? 'Acceptable' : 'Unacceptable';
  };

  const getQualityGrade = (inputs: any, hazWidth: number): string => {
    const compliance = [
      hazWidth <= inputs.requirements.maxHazWidth,
      Math.min(25, hazWidth * 100) <= inputs.requirements.maxHardnessChange,
      hazWidth <= 0.15
    ].filter(Boolean).length;
    
    if (compliance === 3) return 'A';
    if (compliance === 2) return 'B';
    if (compliance === 1) return 'C';
    return 'D';
  };

  const getComplianceScore = (inputs: any, hazWidth: number): number => {
    const compliance = [
      hazWidth <= inputs.requirements.maxHazWidth,
      Math.min(25, hazWidth * 100) <= inputs.requirements.maxHardnessChange,
      hazWidth <= 0.15
    ].filter(Boolean).length;
    
    return Math.round((compliance / 3) * 100);
  };

  const getRiskLevel = (hazWidth: number, criticality: string): string => {
    const riskMatrix = {
      low: hazWidth > 0.3 ? 'Medium' : 'Low',
      medium: hazWidth > 0.2 ? 'High' : hazWidth > 0.1 ? 'Medium' : 'Low',
      high: hazWidth > 0.15 ? 'High' : hazWidth > 0.08 ? 'Medium' : 'Low',
      critical: hazWidth > 0.1 ? 'Critical' : hazWidth > 0.05 ? 'High' : 'Medium'
    };
    
    return riskMatrix[criticality] || 'Medium';
  };

  return (
    <ErrorBoundary name="HeatAffectedZoneCalculator" level="component">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Heat Affected Zone Calculator</h1>
          <p className="text-muted-foreground">
            Analyze and minimize heat affected zone (HAZ) width to prevent material property changes and thermal distortion. 
            Get comprehensive thermal analysis, material property predictions, and optimization recommendations.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <Icon name="warning" size="sm" className="mr-2" />
            <AlertDescription className="text-red-800">
              <strong>Calculation Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <HeatAffectedZoneCalculatorForm 
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
                    Configure your material properties, laser parameters, cutting conditions, and HAZ requirements, 
                    then click "Analyze Heat Affected Zone" to get comprehensive thermal analysis and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <Icon name="checkCircle" size="sm" className="mr-2" />
                  <AlertDescription className="text-green-800">
                    <strong>Analysis Complete!</strong> HAZ width is{' '}
                    <strong>{results.hazAnalysis.width.toFixed(3)} mm</strong> with{' '}
                    <strong>{results.thermalAnalysis.peakTemperature.toFixed(0)}°C</strong> peak temperature.
                    Quality grade: <strong>{results.qualityAssessment.overallGrade}</strong>.
                  </AlertDescription>
                </Alert>
                
                <HeatAffectedZoneCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <HeatAffectedZoneExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <HeatAffectedZoneFormulaExplanation />

          {/* Related Tools - Full container width */}
          <HeatAffectedZoneRelatedTools />

          {/* Educational Content - Full container width */}
          <HeatAffectedZoneEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <HeatAffectedZoneFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Heat Affected Zone Control Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">HAZ Minimization:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Lower Heat Input:</strong> Reduce power or increase speed</li>
                  <li>• <strong>Pulsed Mode:</strong> Use pulsing to reduce average heat</li>
                  <li>• <strong>Better Cooling:</strong> Optimize gas flow and cooling</li>
                  <li>• <strong>Focus Control:</strong> Maintain precise focus position</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quality Control:</h4>
                <ul className="space-y-1">
                  <li>• Monitor HAZ width with regular measurements</li>
                  <li>• Check hardness changes in critical applications</li>
                  <li>• Implement temperature monitoring systems</li>
                  <li>• Document optimal parameters for each material</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default HeatAffectedZoneCalculatorComponent;
