/**
 * JobQueueOptimizer with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { JobQueueOptimizerPresetParameters } from '../../../types/preset';
import JobQueueOptimizer from './index';

const JobQueueOptimizerWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: JobQueueOptimizerPresetParameters = {
    jobCount: 10,
    machineCount: 2,
    priorityWeights: { urgency: 0.4, profit: 0.3, efficiency: 0.3 },
    workingHours: 8,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'job-queue-optimizer',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: JobQueueOptimizerPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="job-queue-optimizer"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <JobQueueOptimizer 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default JobQueueOptimizerWithPresets;