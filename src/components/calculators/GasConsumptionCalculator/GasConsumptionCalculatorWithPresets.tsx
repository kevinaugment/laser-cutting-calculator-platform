/**
 * GasConsumptionCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { GasConsumptionPresetParameters } from '../../../types/preset';
import GasConsumptionCalculator from './index';

const GasConsumptionCalculatorWithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: GasConsumptionPresetParameters = {
    {
    gasType: 'oxygen',
    pressure: 1.5,
    flowRate: 0.8,
    cuttingTime: 60,
    materialType: 'steel',
    thickness: 3,
    nozzleDiameter: 1.5,
    efficiency: 0.85,
  }
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'gas-consumption',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: GasConsumptionPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="gas-consumption"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <GasConsumptionCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default GasConsumptionCalculatorWithPresets;