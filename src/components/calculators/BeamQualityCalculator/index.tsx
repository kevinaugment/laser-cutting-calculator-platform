import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import BeamQualityCalculatorForm from './BeamQualityCalculatorForm';
import BeamQualityCalculatorResults from './BeamQualityCalculatorResults';
import BeamQualityCalculatorFormulaExplanation from './BeamQualityCalculatorFormulaExplanation';
import BeamQualityCalculatorExportTools from './BeamQualityCalculatorExportTools';
import BeamQualityCalculatorRelatedTools from './BeamQualityCalculatorRelatedTools';
import BeamQualityCalculatorEducationalContent from './BeamQualityCalculatorEducationalContent';
import BeamQualityCalculatorFAQ from './BeamQualityCalculatorFAQ';

interface BeamQualityInputs {
  laserType: 'fiber' | 'co2' | 'nd_yag' | 'disk';
  wavelength: number;
  power: number;
  beamDiameter: number;
  divergenceAngle: number;
  focalLength: number;
  measurementDistance: number;
  beamProfile: 'gaussian' | 'top_hat' | 'multimode';
  measurementMethod: 'knife_edge' | 'ccd_camera' | 'beam_profiler';
}

const BeamQualityCalculatorComponent: React.FC = () => {
  const [inputs, setInputs] = useState<BeamQualityInputs>({
    laserType: 'fiber',
    wavelength: 1070,
    power: 3000,
    beamDiameter: 6.0,
    divergenceAngle: 8.0,
    focalLength: 125,
    measurementDistance: 1000,
    beamProfile: 'gaussian',
    measurementMethod: 'beam_profiler'
  });

  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateBeamQuality = (inputs: BeamQualityInputs) => {
    // Beam Quality Calculations
    const wavelengthM = inputs.wavelength * 1e-9; // Convert nm to m
    const beamRadiusM = (inputs.beamDiameter / 2) * 1e-3; // Convert mm to m
    const divergenceRad = (inputs.divergenceAngle / 1000) * (Math.PI / 180); // Convert mrad to rad
    const focalLengthM = inputs.focalLength * 1e-3; // Convert mm to m

    // M² Factor Calculation
    const beamParameterProduct = beamRadiusM * divergenceRad;
    const theoreticalBPP = wavelengthM / Math.PI;
    const mSquared = beamParameterProduct / theoreticalBPP;

    // Rayleigh Length
    const rayleighLength = (Math.PI * Math.pow(beamRadiusM, 2)) / (mSquared * wavelengthM);

    // Focused Spot Size
    const focusedSpotRadius = (mSquared * wavelengthM * focalLengthM) / (Math.PI * beamRadiusM);
    const focusedSpotDiameter = focusedSpotRadius * 2 * 1e3; // Convert to mm

    // Power Density at Focus
    const focusedArea = Math.PI * Math.pow(focusedSpotRadius, 2);
    const powerDensity = inputs.power / focusedArea; // W/m²
    const powerDensityMW = powerDensity / 1e6; // MW/m²

    // Beam Quality Assessment
    let qualityGrade = 'Excellent';
    let qualityScore = 10;
    
    if (mSquared <= 1.1) {
      qualityGrade = 'Excellent';
      qualityScore = 10;
    } else if (mSquared <= 1.3) {
      qualityGrade = 'Very Good';
      qualityScore = 8;
    } else if (mSquared <= 1.5) {
      qualityGrade = 'Good';
      qualityScore = 6;
    } else if (mSquared <= 2.0) {
      qualityGrade = 'Fair';
      qualityScore = 4;
    } else {
      qualityGrade = 'Poor';
      qualityScore = 2;
    }

    // Cutting Performance Impact
    const cuttingSpeedFactor = 1 / Math.sqrt(mSquared);
    const edgeQualityFactor = 1 / mSquared;
    const thicknessFactor = Math.sqrt(1 / mSquared);

    // Beam Propagation Analysis
    const confocalParameter = 2 * rayleighLength;
    const farFieldDivergence = (mSquared * wavelengthM) / (Math.PI * beamRadiusM);

    return {
      beamQuality: {
        mSquared: Number(mSquared.toFixed(3)),
        beamParameterProduct: Number((beamParameterProduct * 1e6).toFixed(2)), // mm·mrad
        qualityGrade,
        qualityScore,
        theoreticalLimit: Number(theoreticalBPP.toFixed(6))
      },
      focusCharacteristics: {
        focusedSpotDiameter: Number(focusedSpotDiameter.toFixed(3)),
        powerDensity: Number(powerDensityMW.toFixed(1)),
        rayleighLength: Number((rayleighLength * 1e3).toFixed(2)), // mm
        confocalParameter: Number((confocalParameter * 1e3).toFixed(2)) // mm
      },
      propagationAnalysis: {
        farFieldDivergence: Number((farFieldDivergence * 1000).toFixed(2)), // mrad
        beamWaist: Number((beamRadiusM * 2 * 1e3).toFixed(3)), // mm
        divergenceAngle: inputs.divergenceAngle,
        beamDiameter: inputs.beamDiameter
      },
      cuttingPerformance: {
        speedFactor: Number(cuttingSpeedFactor.toFixed(3)),
        edgeQualityFactor: Number(edgeQualityFactor.toFixed(3)),
        thicknessFactor: Number(thicknessFactor.toFixed(3)),
        overallRating: Number(((cuttingSpeedFactor + edgeQualityFactor + thicknessFactor) / 3 * 10).toFixed(1))
      },
      recommendations: generateRecommendations(mSquared, qualityGrade, inputs.laserType)
    };
  };

  const generateRecommendations = (mSquared: number, grade: string, laserType: string) => {
    const recommendations = [];

    if (mSquared > 1.5) {
      recommendations.push({
        title: 'Improve Beam Quality',
        description: 'Consider beam shaping optics or fiber coupling optimization',
        priority: 'high',
        impact: 'Significant improvement in cutting performance'
      });
    }

    if (mSquared > 1.2 && laserType === 'fiber') {
      recommendations.push({
        title: 'Check Fiber Coupling',
        description: 'Verify fiber alignment and coupling efficiency',
        priority: 'medium',
        impact: 'Better beam quality and power stability'
      });
    }

    if (grade === 'Poor' || grade === 'Fair') {
      recommendations.push({
        title: 'Beam Delivery Optimization',
        description: 'Inspect and clean beam delivery optics, check for thermal lensing',
        priority: 'high',
        impact: 'Restore optimal beam quality'
      });
    }

    return recommendations;
  };

  const handleCalculate = async (newInputs: BeamQualityInputs) => {
    setIsLoading(true);
    setError(null);
    setInputs(newInputs);

    try {
      console.log('🔬 Starting beam quality analysis...', newInputs);
      
      const calculationResults = calculateBeamQuality(newInputs);
      
      console.log('✅ Beam quality analysis completed:', calculationResults);
      setResults(calculationResults);
    } catch (err) {
      console.error('❌ Beam quality analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Beam Quality Calculator
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Analyze laser beam quality parameters including M² factor, power density, 
              and cutting performance impact. Professional beam characterization for optimal results.
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-purple-500 bg-opacity-20 rounded-full">
              <span className="text-purple-100">🔬 Beam Quality Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-purple-600">Home</a>
            <span>/</span>
            <a href="/calculator" className="hover:text-purple-600">Calculator</a>
            <span>/</span>
            <span className="text-gray-900">Beam Quality Calculator</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button className="py-4 px-1 border-b-2 border-purple-500 font-medium text-sm text-purple-600">
              Beam Quality Analysis
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
              Learn & Optimize
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
              FAQ & Support
            </button>
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Analysis Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {results && !error && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Analysis Complete!</strong> 
              M² Factor: {results.beamQuality?.mSquared} | 
              Quality Grade: {results.beamQuality?.qualityGrade} | 
              Focus Spot: {results.focusCharacteristics?.focusedSpotDiameter}mm
            </AlertDescription>
          </Alert>
        )}

        {/* Main Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Form - Left Column */}
          <div className="lg:col-span-1">
            <BeamQualityCalculatorForm
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </div>

          {/* Results - Right Columns */}
          <div className="lg:col-span-2">
            {results ? (
              <BeamQualityCalculatorResults results={results} inputs={inputs} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">
                  Enter your laser beam parameters to get comprehensive beam quality analysis.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formula Explanation Section */}
        <div className="mt-12">
          <BeamQualityCalculatorFormulaExplanation />
        </div>

        {/* Related Tools Section */}
        <div className="mt-12">
          <BeamQualityCalculatorRelatedTools />
        </div>

        {/* Export Tools Section */}
        {results && (
          <div className="mt-12">
            <BeamQualityCalculatorExportTools results={results} inputs={inputs} />
          </div>
        )}

        {/* Educational Content Section */}
        <div className="mt-12">
          <BeamQualityCalculatorEducationalContent />
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <BeamQualityCalculatorFAQ />
        </div>
      </div>
    </div>
  );
};

export default BeamQualityCalculatorComponent;
