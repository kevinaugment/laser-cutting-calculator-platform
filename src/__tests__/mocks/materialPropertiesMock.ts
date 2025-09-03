/**
 * 材料属性模拟模块
 * 
 * 这个模块提供了统一的材料属性数据模拟，
 * 可以在测试中替换各种不同的材料属性导入。
 */

import { unifiedMaterialProperties, applicationRequirements } from '../data/unifiedMaterialProperties';

// 模拟 EdgeQualityPredictor 使用的 materialProperties
export const materialProperties = {
  steel: {
    baseFactor: unifiedMaterialProperties.steel.baseFactor,
    roughnessFactor: unifiedMaterialProperties.steel.roughnessFactor,
    optimalPowerSpeedRatio: unifiedMaterialProperties.steel.optimalPowerSpeedRatio,
    gasCompatibility: unifiedMaterialProperties.steel.gasCompatibility,
    drossResistance: unifiedMaterialProperties.steel.drossResistance
  },
  stainless_steel: {
    baseFactor: unifiedMaterialProperties.stainless_steel.baseFactor,
    roughnessFactor: unifiedMaterialProperties.stainless_steel.roughnessFactor,
    optimalPowerSpeedRatio: unifiedMaterialProperties.stainless_steel.optimalPowerSpeedRatio,
    gasCompatibility: unifiedMaterialProperties.stainless_steel.gasCompatibility,
    drossResistance: unifiedMaterialProperties.stainless_steel.drossResistance
  },
  aluminum: {
    baseFactor: unifiedMaterialProperties.aluminum.baseFactor,
    roughnessFactor: unifiedMaterialProperties.aluminum.roughnessFactor,
    optimalPowerSpeedRatio: unifiedMaterialProperties.aluminum.optimalPowerSpeedRatio,
    gasCompatibility: unifiedMaterialProperties.aluminum.gasCompatibility,
    drossResistance: unifiedMaterialProperties.aluminum.drossResistance
  },
  copper: {
    baseFactor: unifiedMaterialProperties.copper.baseFactor,
    roughnessFactor: unifiedMaterialProperties.copper.roughnessFactor,
    optimalPowerSpeedRatio: unifiedMaterialProperties.copper.optimalPowerSpeedRatio,
    gasCompatibility: unifiedMaterialProperties.copper.gasCompatibility,
    drossResistance: unifiedMaterialProperties.copper.drossResistance
  }
};

// 模拟 ProcessOptimizationEngine 使用的 materialOptimizationProperties
export const materialOptimizationProperties = {
  steel: {
    powerRange: unifiedMaterialProperties.steel.powerRange,
    speedRange: unifiedMaterialProperties.steel.speedRange,
    gasPressureRange: unifiedMaterialProperties.steel.gasPressureRange,
    focusRange: unifiedMaterialProperties.steel.focusRange,
    qualityWeight: unifiedMaterialProperties.steel.qualityWeight,
    costWeight: unifiedMaterialProperties.steel.costWeight,
    energyWeight: unifiedMaterialProperties.steel.energyWeight
  },
  stainless_steel: {
    powerRange: unifiedMaterialProperties.stainless_steel.powerRange,
    speedRange: unifiedMaterialProperties.stainless_steel.speedRange,
    gasPressureRange: unifiedMaterialProperties.stainless_steel.gasPressureRange,
    focusRange: unifiedMaterialProperties.stainless_steel.focusRange,
    qualityWeight: unifiedMaterialProperties.stainless_steel.qualityWeight,
    costWeight: unifiedMaterialProperties.stainless_steel.costWeight,
    energyWeight: unifiedMaterialProperties.stainless_steel.energyWeight
  },
  aluminum: {
    powerRange: unifiedMaterialProperties.aluminum.powerRange,
    speedRange: unifiedMaterialProperties.aluminum.speedRange,
    gasPressureRange: unifiedMaterialProperties.aluminum.gasPressureRange,
    focusRange: unifiedMaterialProperties.aluminum.focusRange,
    qualityWeight: unifiedMaterialProperties.aluminum.qualityWeight,
    costWeight: unifiedMaterialProperties.aluminum.costWeight,
    energyWeight: unifiedMaterialProperties.aluminum.energyWeight
  },
  copper: {
    powerRange: unifiedMaterialProperties.copper.powerRange,
    speedRange: unifiedMaterialProperties.copper.speedRange,
    gasPressureRange: unifiedMaterialProperties.copper.gasPressureRange,
    focusRange: unifiedMaterialProperties.copper.focusRange,
    qualityWeight: unifiedMaterialProperties.copper.qualityWeight,
    costWeight: unifiedMaterialProperties.copper.costWeight,
    energyWeight: unifiedMaterialProperties.copper.energyWeight
  }
};

// 模拟 GasPressureSettingGuide 使用的 materialGasPressureProperties
export const materialGasPressureProperties = {
  steel: unifiedMaterialProperties.steel.gasPressureProperties,
  stainless_steel: unifiedMaterialProperties.stainless_steel.gasPressureProperties,
  aluminum: unifiedMaterialProperties.aluminum.gasPressureProperties,
  copper: unifiedMaterialProperties.copper.gasPressureProperties
};

// 模拟 MaterialSelectionAssistant 使用的 applicationRequirements
export { applicationRequirements };

// 模拟 LaserParameterOptimizer 使用的材料属性
export const laserParameterMaterialProperties = {
  steel: {
    absorptivity: unifiedMaterialProperties.steel.absorptivity,
    powerRange: unifiedMaterialProperties.steel.powerRange,
    speedRange: unifiedMaterialProperties.steel.speedRange,
    optimalPowerDensity: unifiedMaterialProperties.steel.optimalPowerDensity,
    thermalConductivity: unifiedMaterialProperties.steel.thermalConductivity
  },
  stainless_steel: {
    absorptivity: unifiedMaterialProperties.stainless_steel.absorptivity,
    powerRange: unifiedMaterialProperties.stainless_steel.powerRange,
    speedRange: unifiedMaterialProperties.stainless_steel.speedRange,
    optimalPowerDensity: unifiedMaterialProperties.stainless_steel.optimalPowerDensity,
    thermalConductivity: unifiedMaterialProperties.stainless_steel.thermalConductivity
  },
  aluminum: {
    absorptivity: unifiedMaterialProperties.aluminum.absorptivity,
    powerRange: unifiedMaterialProperties.aluminum.powerRange,
    speedRange: unifiedMaterialProperties.aluminum.speedRange,
    optimalPowerDensity: unifiedMaterialProperties.aluminum.optimalPowerDensity,
    thermalConductivity: unifiedMaterialProperties.aluminum.thermalConductivity
  },
  copper: {
    absorptivity: unifiedMaterialProperties.copper.absorptivity,
    powerRange: unifiedMaterialProperties.copper.powerRange,
    speedRange: unifiedMaterialProperties.copper.speedRange,
    optimalPowerDensity: unifiedMaterialProperties.copper.optimalPowerDensity,
    thermalConductivity: unifiedMaterialProperties.copper.thermalConductivity
  }
};

// 通用材料属性获取函数
export function getMaterialProperty(materialName: string, propertyPath: string): any {
  const material = unifiedMaterialProperties[materialName];
  if (!material) return null;
  
  const pathParts = propertyPath.split('.');
  let value = material as any;
  
  for (const part of pathParts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return null;
    }
  }
  
  return value;
}

// 检查材料是否支持特定气体
export function isMaterialGasCompatible(materialName: string, gasType: string): boolean {
  const material = unifiedMaterialProperties[materialName];
  if (!material) return false;
  
  return gasType in material.gasPressureProperties;
}

// 获取材料的最佳激光类型
export function getOptimalLaserType(materialName: string): 'fiber' | 'co2' {
  const material = unifiedMaterialProperties[materialName];
  if (!material) return 'fiber';
  
  const fiberAbsorption = material.absorptivity.fiber;
  const co2Absorption = material.absorptivity.co2;
  
  return fiberAbsorption > co2Absorption ? 'fiber' : 'co2';
}
