/**
 * WarpingRiskCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { WarpingRiskCalculatorPresetParameters } from '../../../types/preset';
import WarpingRiskCalculator from './index';

const WarpingRiskCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: WarpingRiskCalculatorPresetParameters = {
    materialType: 'steel',
    thickness: 3,
    partSize: { width: 100, height: 100 },
    cuttingPattern: 'standard',
    coolingRate: 'medium',
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'warping-risk',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: WarpingRiskCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="warping-risk"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <WarpingRiskCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default WarpingRiskCalculatorWithPresets;