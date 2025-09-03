/**
 * CuttingTimeEstimator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { cutting-time-estimatorPresetParameters } from '../../../types/preset';
import CuttingTimeEstimator from './index';

const CuttingTimeEstimatorWithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: cutting-time-estimatorPresetParameters = {
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
    calculatorType: 'cutting-time-estimator',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: cutting-time-estimatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="cutting-time-estimator"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <CuttingTimeEstimator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default CuttingTimeEstimatorWithPresets;