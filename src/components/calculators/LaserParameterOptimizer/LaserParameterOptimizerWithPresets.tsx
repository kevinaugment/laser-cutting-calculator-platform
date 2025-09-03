/**
 * LaserParameterOptimizer with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { laser-parameter-optimizerPresetParameters } from '../../../types/preset';
import LaserParameterOptimizer from './index';

const LaserParameterOptimizerWithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: laser-parameter-optimizerPresetParameters = {
    // TODO: Define default parameters based on calculator type
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'laser-parameter-optimizer',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: laser-parameter-optimizerPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="laser-parameter-optimizer"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <LaserParameterOptimizer 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default LaserParameterOptimizerWithPresets;