/**
 * Laser Cutting Cost Calculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import LaserCuttingCostCalculatorForm from './LaserCuttingCostCalculatorForm';
import LaserCuttingCostCalculatorResults from './LaserCuttingCostCalculatorResults';
import LaserCuttingCostFormulaExplanation from './LaserCuttingCostFormulaExplanation';
import LaserCuttingCostExportTools from './LaserCuttingCostExportTools';
import LaserCuttingCostRelatedTools from './LaserCuttingCostRelatedTools';
import LaserCuttingCostEducationalContent from './LaserCuttingCostEducationalContent';
import LaserCuttingCostFAQ from './LaserCuttingCostFAQ';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { LaserCuttingCostPresetParameters } from '../../../types/preset';

// Simple inline calculator logic
const calculateLaserCuttingCost = (inputs: any) => {
  const {
    materialType = 'Mild Steel',
    thickness = 3,
    length = 1000,
    width = 500,
    quantity = 1,
    materialCost = 2.5,
    laserPower = 1500,
    cuttingSpeed = 2500,
    gasType = 'Oxygen',
    gasConsumption = 0.8,
    gasCost = 0.15,
    electricityRate = 0.12,
    laborRate = 25,
    machineHourlyRate = 45,
    setupTime = 15,
    wasteFactor = 0.1
  } = inputs;

  // Basic calculations
  const area = (length * width) / 1000000; // Convert to m²
  const perimeter = 2 * (length + width) / 1000; // Convert to m
  const cuttingTime = perimeter / (cuttingSpeed / 60); // minutes
  const totalTime = cuttingTime + setupTime;

  const materialCostTotal = area * materialCost * quantity * (1 + wasteFactor);
  const gasCostTotal = (cuttingTime / 60) * gasConsumption * gasCost * quantity;
  const electricityCost = (totalTime / 60) * (laserPower / 1000) * electricityRate * quantity;
  const laborCostTotal = (totalTime / 60) * laborRate * quantity;
  const machineCost = (totalTime / 60) * machineHourlyRate * quantity;

  const totalCost = materialCostTotal + gasCostTotal + electricityCost + laborCostTotal + machineCost;

  return {
    success: true,
    data: {
      totalCost: Math.round(totalCost * 100) / 100,
      breakdown: {
        materialCost: Math.round(materialCostTotal * 100) / 100,
        gasCost: Math.round(gasCostTotal * 100) / 100,
        electricityCost: Math.round(electricityCost * 100) / 100,
        laborCost: Math.round(laborCostTotal * 100) / 100,
        machineCost: Math.round(machineCost * 100) / 100,
      },
      metrics: {
        area: Math.round(area * 10000) / 10000,
        perimeter: Math.round(perimeter * 100) / 100,
        cuttingTime: Math.round(cuttingTime * 100) / 100,
        totalTime: Math.round(totalTime * 100) / 100,
      },
      recommendations: [
        totalCost > 100 ? 'Consider optimizing material usage to reduce costs' : 'Cost is within reasonable range',
        cuttingTime > 30 ? 'Consider increasing cutting speed if quality allows' : 'Cutting time is efficient',
      ]
    }
  };
};

const LaserCuttingCostCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: LaserCuttingCostPresetParameters = {
    materialType: 'Mild Steel',
    thickness: 3,
    length: 1000,
    width: 500,
    quantity: 1,
    complexity: 'medium',
    urgency: 'standard',
    materialCost: 2.5,
    laserPower: 1500,
    cuttingSpeed: 2500,
    gasType: 'Oxygen',
    gasConsumption: 0.8,
    gasCost: 0.15,
    electricityRate: 0.12,
    laborRate: 25,
    machineHourlyRate: 45,
    setupTime: 15,
    wasteFactor: 0.1,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
    availablePresets,
    isLoading,
    error,
  } = useCalculatorPresets({
    calculatorType: 'laser-cutting-cost',
    initialParameters: defaultParameters,
  });

  // Local state for form inputs and results
  const [inputs, setInputs] = useState(currentParameters);
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Update inputs when parameters change
  useEffect(() => {
    setInputs(currentParameters);
    // Recalculate when parameters change
    handleCalculate(currentParameters);
  }, [currentParameters]);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    const newInputs = { ...inputs, [field]: value };
    setInputs(newInputs);
    updateParameter(field as keyof LaserCuttingCostPresetParameters, value);
  };

  // Handle calculation
  const handleCalculate = async (calculationInputs = inputs) => {
    setIsCalculating(true);
    setCalculationError(null);

    try {
      const result = calculateLaserCuttingCost(calculationInputs);
      if (result.success) {
        setResults(result.data);
      } else {
        setCalculationError('Calculation failed. Please check your inputs.');
      }
    } catch (error) {
      setCalculationError('An error occurred during calculation.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle preset loading
  const handlePresetLoad = (parameters: LaserCuttingCostPresetParameters) => {
    setInputs(parameters);
    updateParameters(parameters);
  };

  return (
    <>
      <CalculatorSEOHead
        title="Laser Cutting Cost Calculator with Presets"
        description="Calculate laser cutting costs with preset management. Save and load your frequently used configurations for faster quoting."
        keywords="laser cutting cost, preset calculator, manufacturing cost, laser cutting quote"
        canonicalUrl="/calculators/laser-cutting-cost"
      />

      <CalculatorLayout
        calculatorType="laser-cutting-cost"
        currentParameters={currentParameters}
        onPresetLoad={handlePresetLoad}
        onParametersChange={updateParameters}
        presetPosition="top"
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Laser Cutting Cost Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Calculate accurate laser cutting costs with our advanced calculator. 
              Save your configurations as presets for faster future calculations.
            </p>
          </div>

          {/* Preset Status */}
          {selectedPresetId && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Using preset configuration. 
                {hasUnsavedChanges && ' You have unsaved changes.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {(error || calculationError) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error || calculationError}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Calculator Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <LaserCuttingCostCalculatorForm
                inputs={inputs}
                onInputChange={handleInputChange}
                onCalculate={() => handleCalculate()}
                isCalculating={isCalculating}
              />
            </div>

            {/* Results */}
            <div className="space-y-6">
              {results && (
                <LaserCuttingCostCalculatorResults
                  results={results}
                  inputs={inputs}
                />
              )}
            </div>
          </div>

          {/* Export Tools */}
          {results && (
            <LaserCuttingCostExportTools
              results={results}
              inputs={inputs}
            />
          )}

          {/* Formula Explanation */}
          <LaserCuttingCostFormulaExplanation />

          {/* Related Tools */}
          <LaserCuttingCostRelatedTools />

          {/* Educational Content */}
          <LaserCuttingCostEducationalContent />

          {/* FAQ */}
          <LaserCuttingCostFAQ />
        </div>
      </CalculatorLayout>
    </>
  );
};

export default LaserCuttingCostCalculatorWithPresets;
