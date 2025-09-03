/**
 * ProjectQuotingCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { ProjectQuotingCalculatorPresetParameters } from '../../../types/preset';
import ProjectQuotingCalculator from './index';

const ProjectQuotingCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: ProjectQuotingCalculatorPresetParameters = {
    projectType: 'standard',
    complexity: 'medium',
    quantity: 1,
    deadline: 'standard',
    materialCost: 100,
    laborHours: 5,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'project-quoting',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: ProjectQuotingCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="project-quoting"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <ProjectQuotingCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default ProjectQuotingCalculatorWithPresets;