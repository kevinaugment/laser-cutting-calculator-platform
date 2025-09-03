/**
 * HeatAffectedZoneCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { HeatAffectedZoneCalculatorPresetParameters } from '../../../types/preset';
import HeatAffectedZoneCalculator from './index';

const HeatAffectedZoneCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: HeatAffectedZoneCalculatorPresetParameters = {
    materialType: 'steel',
    thickness: 3,
    laserPower: 1500,
    cuttingSpeed: 2500,
    thermalConductivity: 50,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'heat-affected-zone',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: HeatAffectedZoneCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="heat-affected-zone"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <HeatAffectedZoneCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default HeatAffectedZoneCalculatorWithPresets;