/**
 * QualityGradeCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { QualityGradePresetParameters } from '../../../types/preset';
import QualityGradeCalculator from './index';

const QualityGradeCalculatorWithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: QualityGradePresetParameters = {
    {
    materialType: 'steel',
    thickness: 3,
    tolerance: 0.1,
    surfaceFinish: 'standard',
    edgeQuality: 'good',
  }
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'quality-grade',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: QualityGradePresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="quality-grade"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <QualityGradeCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default QualityGradeCalculatorWithPresets;