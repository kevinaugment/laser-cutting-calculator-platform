/**
 * EdgeQualityPredictorCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { EdgeQualityPredictorCalculatorPresetParameters } from '../../../types/preset';
import EdgeQualityPredictorCalculator from './index';

const EdgeQualityPredictorCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: EdgeQualityPredictorCalculatorPresetParameters = {
    materialType: 'steel',
    thickness: 3,
    cuttingSpeed: 2500,
    laserPower: 1500,
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
    calculatorType: 'edge-quality-predictor',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: EdgeQualityPredictorCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="edge-quality-predictor"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <EdgeQualityPredictorCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default EdgeQualityPredictorCalculatorWithPresets;