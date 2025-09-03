/**
 * CutPathOptimizer with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { CutPathOptimizerPresetParameters } from '../../../types/preset';
import CutPathOptimizer from './index';

const CutPathOptimizerWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: CutPathOptimizerPresetParameters = {
    partCount: 10,
    sheetSize: { width: 1500, height: 3000 },
    materialThickness: 3,
    optimizationGoal: 'time',
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'cut-path-optimizer',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: CutPathOptimizerPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="cut-path-optimizer"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <CutPathOptimizer 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default CutPathOptimizerWithPresets;