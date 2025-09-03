/**
 * EnergyCostCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { EnergyCostPresetParameters } from '../../../types/preset';
import EnergyCostCalculator from './index';

const EnergyCostCalculatorWithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: EnergyCostPresetParameters = {
    {
    laserPower: 1500,
    operatingTime: 8,
    electricityRate: 0.12,
    efficiency: 0.85,
    auxiliaryPower: 200,
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
    calculatorType: 'energy-cost',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: EnergyCostPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="energy-cost"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <EnergyCostCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default EnergyCostCalculatorWithPresets;