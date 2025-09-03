/**
 * MaterialNestingOptimizer with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { MaterialNestingOptimizerPresetParameters } from '../../../types/preset';
import MaterialNestingOptimizer from './index';

const MaterialNestingOptimizerWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: MaterialNestingOptimizerPresetParameters = {
    parts: [],
    sheetSize: { width: 1500, height: 3000 },
    materialCost: 2.5,
    wasteFactor: 0.1,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'material-nesting-optimizer',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: MaterialNestingOptimizerPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="material-nesting-optimizer"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <MaterialNestingOptimizer 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default MaterialNestingOptimizerWithPresets;