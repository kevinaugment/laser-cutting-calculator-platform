import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Clock, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
// import { ErrorBoundary } from '../../ui/error-boundary';
import CuttingTimeEstimatorForm from './CuttingTimeEstimatorForm';
import CuttingTimeEstimatorResults from './CuttingTimeEstimatorResults';
import CuttingTimeFormulaExplanation from './CuttingTimeFormulaExplanation';
import CuttingTimeRelatedTools from './CuttingTimeRelatedTools';
import CuttingTimeEducationalContent from './CuttingTimeEducationalContent';
import CuttingTimeFAQ from './CuttingTimeFAQ';
import CuttingTimeExportTools from './CuttingTimeExportTools';

interface CuttingTimeInputs {
  // Geometry Parameters
  totalLength: number;
  pierceCount: number;
  complexity: 'simple' | 'medium' | 'complex';
  
  // Material Properties
  materialType: string;
  thickness: number;
  
  // Laser Parameters
  laserPower: number;
  cuttingSpeed: number;
  pierceTime: number;
  
  // Process Parameters
  gasType: string;
  qualityLevel: 'fast' | 'standard' | 'high';
  
  // Production Parameters
  setupTime: number;
  partQuantity: number;
}

interface CuttingTimeResults {
  // Primary Results
  totalCuttingTime: number;
  totalPierceTime: number;
  totalProcessTime: number;
  
  // Breakdown
  timeBreakdown: {
    cutting: number;
    piercing: number;
    positioning: number;
    setup: number;
  };
  
  // Performance Metrics
  efficiency: number;
  throughput: number;
  
  // Optimization Suggestions
  recommendations: string[];
  
  // Sensitivity Analysis
  sensitivityAnalysis: {
    parameter: string;
    impact: number;
    suggestion: string;
  }[];
}

const CuttingTimeEstimatorComponent: React.FC = () => {
  const [inputs, setInputs] = useState<CuttingTimeInputs>({
    totalLength: 1000,
    pierceCount: 4,
    complexity: 'medium',
    materialType: 'mild_steel',
    thickness: 3.0,
    laserPower: 2000,
    cuttingSpeed: 3000,
    pierceTime: 0.8,
    gasType: 'oxygen',
    qualityLevel: 'standard',
    setupTime: 5,
    partQuantity: 1
  });

  const [results, setResults] = useState<CuttingTimeResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'calculator' | 'education' | 'faq'>('calculator');

  const calculateCuttingTime = async () => {
    setIsLoading(true);
    
    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate cutting time based on inputs
      const cuttingTime = inputs.totalLength / inputs.cuttingSpeed; // minutes
      const pierceTime = inputs.pierceCount * inputs.pierceTime; // seconds
      const positioningTime = inputs.pierceCount * 0.5; // seconds between cuts
      const setupTime = inputs.setupTime; // minutes
      
      // Apply complexity and quality modifiers
      const complexityModifier = {
        'simple': 1.0,
        'medium': 1.2,
        'complex': 1.5
      }[inputs.complexity];
      
      const qualityModifier = {
        'fast': 0.8,
        'standard': 1.0,
        'high': 1.3
      }[inputs.qualityLevel];
      
      const adjustedCuttingTime = cuttingTime * complexityModifier * qualityModifier;
      const totalProcessTime = adjustedCuttingTime + (pierceTime + positioningTime) / 60 + setupTime;
      
      // Calculate efficiency and throughput
      const efficiency = (adjustedCuttingTime / totalProcessTime) * 100;
      const throughput = inputs.partQuantity / (totalProcessTime / 60); // parts per hour
      
      // Generate recommendations
      const recommendations = [];
      if (efficiency < 70) {
        recommendations.push('Consider reducing setup time to improve efficiency');
      }
      if (inputs.pierceCount > 10) {
        recommendations.push('High pierce count detected - consider design optimization');
      }
      if (inputs.cuttingSpeed < 2000) {
        recommendations.push('Cutting speed may be conservative - consider optimization');
      }
      
      // Sensitivity analysis
      const sensitivityAnalysis = [
        {
          parameter: 'Cutting Speed',
          impact: -0.5,
          suggestion: 'Increase speed by 20% to reduce time by 10 minutes'
        },
        {
          parameter: 'Pierce Count',
          impact: 0.3,
          suggestion: 'Reduce pierces by combining features where possible'
        },
        {
          parameter: 'Setup Time',
          impact: 0.2,
          suggestion: 'Standardize fixtures to reduce setup time'
        }
      ];
      
      const calculatedResults: CuttingTimeResults = {
        totalCuttingTime: adjustedCuttingTime,
        totalPierceTime: pierceTime / 60,
        totalProcessTime: totalProcessTime,
        timeBreakdown: {
          cutting: adjustedCuttingTime,
          piercing: pierceTime / 60,
          positioning: positioningTime / 60,
          setup: setupTime
        },
        efficiency: efficiency,
        throughput: throughput,
        recommendations: recommendations,
        sensitivityAnalysis: sensitivityAnalysis
      };
      
      setResults(calculatedResults);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-600" />
                Cutting Time Estimator
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Accurate cutting time estimation for production planning and scheduling optimization
              </p>
            </div>
            <Badge variant="secondary" className="text-sm font-medium">
              Time Analysis
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('calculator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'calculator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calculator className="h-4 w-4 inline mr-2" />
              Time Calculator
            </button>
            <button
              onClick={() => setActiveSection('education')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'education'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Learn & Optimize
            </button>
            <button
              onClick={() => setActiveSection('faq')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'faq'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <AlertCircle className="h-4 w-4 inline mr-2" />
              FAQ & Support
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Cutting Time Estimation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CuttingTimeEstimatorForm
                    inputs={inputs}
                    onInputsChange={setInputs}
                    onCalculate={calculateCuttingTime}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>

              {/* Results */}
              {results && (
                <div className="mt-8">
                  <CuttingTimeEstimatorResults results={results} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <CuttingTimeFormulaExplanation />
              <CuttingTimeRelatedTools />
              {results && <CuttingTimeExportTools results={results} />}
            </div>
          </div>
        )}

        {activeSection === 'education' && <CuttingTimeEducationalContent />}
        {activeSection === 'faq' && <CuttingTimeFAQ />}
      </div>
    </div>
  );
};

export default CuttingTimeEstimatorComponent;
