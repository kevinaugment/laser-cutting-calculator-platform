/**
 * BatchProcessingCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { BatchProcessingCalculatorPresetParameters } from '../../../types/preset';
import BatchProcessingCalculator from './index';

const BatchProcessingCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: BatchProcessingCalculatorPresetParameters = {
    batchSize: 10,
    partCount: 100,
    setupTime: 30,
    cycleTime: 5,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'batch-processing',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: BatchProcessingCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="batch-processing"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <BatchProcessingCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default BatchProcessingCalculatorWithPresets;