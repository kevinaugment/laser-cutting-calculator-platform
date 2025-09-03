/**
 * BeamQualityCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { BeamQualityCalculatorPresetParameters } from '../../../types/preset';
import BeamQualityCalculator from './index';

const BeamQualityCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: BeamQualityCalculatorPresetParameters = {
    laserPower: 1500,
    beamDiameter: 0.1,
    focusLength: 127,
    wavelength: 1064,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'beam-quality',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: BeamQualityCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="beam-quality"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <BeamQualityCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default BeamQualityCalculatorWithPresets;