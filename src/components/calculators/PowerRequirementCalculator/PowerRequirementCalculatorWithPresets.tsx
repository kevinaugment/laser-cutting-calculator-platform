/**
 * PowerRequirementCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { PowerRequirementCalculatorPresetParameters } from '../../../types/preset';
import PowerRequirementCalculator from './index';

const PowerRequirementCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: PowerRequirementCalculatorPresetParameters = {
    materialType: 'steel',
    thickness: 3,
    cuttingSpeed: 2500,
    quality: 'medium',
    gasType: 'oxygen',
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'power-requirement',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: PowerRequirementCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="power-requirement"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <PowerRequirementCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default PowerRequirementCalculatorWithPresets;