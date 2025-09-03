/**
 * FocusHeightCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { FocusHeightCalculatorPresetParameters } from '../../../types/preset';
import FocusHeightCalculator from './index';

const FocusHeightCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: FocusHeightCalculatorPresetParameters = {
    materialType: 'steel',
    thickness: 3,
    lensType: 'standard',
    beamDiameter: 0.1,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'focus-height',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: FocusHeightCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="focus-height"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <FocusHeightCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default FocusHeightCalculatorWithPresets;