/**
 * 统一材料属性数据结构 - 测试环境专用
 * 
 * 这个文件包含了所有计算器需要的材料属性数据，
 * 统一了不同计算器使用的各种数据结构格式。
 */

// 基础材料属性接口
export interface UnifiedMaterialProperties {
  // 基础物理属性
  density: number; // kg/m³
  thermalConductivity: number; // W/m·K
  meltingPoint?: number; // °C
  specificHeat?: number; // J/kg·K
  
  // 激光相关属性
  absorptivity: {
    fiber: number;
    co2: number;
  };
  reflectivity?: number;
  
  // 切割参数范围
  powerRange: [number, number]; // watts
  speedRange: [number, number]; // mm/min
  gasPressureRange: [number, number]; // bar
  focusRange: [number, number]; // mm
  
  // 优化相关属性
  optimalPowerDensity: number;
  optimalPowerSpeedRatio: number;
  qualityWeight: number;
  costWeight: number;
  energyWeight: number;
  
  // 气体兼容性
  gasCompatibility: {
    oxygen: number;
    nitrogen: number;
    air: number;
    argon: number;
  };
  
  // 气体压力属性
  gasPressureProperties: {
    oxygen: { basePressure: number; thicknessFactor: number; maxPressure: number; qualityFactor: number };
    nitrogen: { basePressure: number; thicknessFactor: number; maxPressure: number; qualityFactor: number };
    air: { basePressure: number; thicknessFactor: number; maxPressure: number; qualityFactor: number };
    argon: { basePressure: number; thicknessFactor: number; maxPressure: number; qualityFactor: number };
  };
  
  // 质量相关属性
  baseFactor: number;
  roughnessFactor: number;
  drossResistance: number;
  
  // 成本属性
  costPerKg: number; // USD per kg
  
  // 应用兼容性
  applications: string[];
  
  // 切割难度
  cuttingDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

// 统一的材料属性数据库
export const unifiedMaterialProperties: Record<string, UnifiedMaterialProperties> = {
  steel: {
    density: 7.85,
    thermalConductivity: 50,
    meltingPoint: 1538,
    specificHeat: 490,
    absorptivity: { fiber: 0.8, co2: 0.6 },
    reflectivity: 0.65,
    powerRange: [500, 6000],
    speedRange: [500, 8000],
    gasPressureRange: [0.5, 20],
    focusRange: [-5, 2],
    optimalPowerDensity: 100,
    optimalPowerSpeedRatio: 0.4,
    qualityWeight: 0.8,
    costWeight: 1.0,
    energyWeight: 0.9,
    gasCompatibility: { oxygen: 1.0, nitrogen: 0.8, air: 0.9, argon: 0.7 },
    gasPressureProperties: {
      oxygen: { basePressure: 0.8, thicknessFactor: 0.15, maxPressure: 3.0, qualityFactor: 0.85 },
      nitrogen: { basePressure: 12, thicknessFactor: 2.0, maxPressure: 25, qualityFactor: 0.95 },
      air: { basePressure: 6, thicknessFactor: 1.0, maxPressure: 15, qualityFactor: 0.75 },
      argon: { basePressure: 8, thicknessFactor: 1.5, maxPressure: 20, qualityFactor: 0.90 }
    },
    baseFactor: 0.85,
    roughnessFactor: 1.0,
    drossResistance: 0.7,
    costPerKg: 2.5,
    applications: ['structural', 'automotive', 'general'],
    cuttingDifficulty: 'easy'
  },
  
  stainless_steel: {
    density: 8.0,
    thermalConductivity: 16,
    meltingPoint: 1400,
    specificHeat: 500,
    absorptivity: { fiber: 0.85, co2: 0.65 },
    reflectivity: 0.72,
    powerRange: [800, 8000],
    speedRange: [300, 6000],
    gasPressureRange: [8, 25],
    focusRange: [-6, 1],
    optimalPowerDensity: 120,
    optimalPowerSpeedRatio: 0.6,
    qualityWeight: 0.9,
    costWeight: 1.2,
    energyWeight: 1.0,
    gasCompatibility: { oxygen: 0.7, nitrogen: 1.0, air: 0.8, argon: 0.9 },
    gasPressureProperties: {
      oxygen: { basePressure: 0.6, thicknessFactor: 0.12, maxPressure: 2.5, qualityFactor: 0.80 },
      nitrogen: { basePressure: 15, thicknessFactor: 2.5, maxPressure: 25, qualityFactor: 0.95 },
      air: { basePressure: 8, thicknessFactor: 1.2, maxPressure: 18, qualityFactor: 0.78 },
      argon: { basePressure: 10, thicknessFactor: 1.8, maxPressure: 22, qualityFactor: 0.92 }
    },
    baseFactor: 0.90,
    roughnessFactor: 0.9,
    drossResistance: 0.8,
    costPerKg: 4.5,
    applications: ['food', 'medical', 'chemical', 'marine'],
    cuttingDifficulty: 'medium'
  },
  
  aluminum: {
    density: 2.7,
    thermalConductivity: 200,
    meltingPoint: 660,
    specificHeat: 896,
    absorptivity: { fiber: 0.9, co2: 0.3 },
    reflectivity: 0.9,
    powerRange: [300, 4000],
    speedRange: [1000, 12000],
    gasPressureRange: [5, 25],
    focusRange: [-3, 3],
    optimalPowerDensity: 150,
    optimalPowerSpeedRatio: 0.3,
    qualityWeight: 0.7,
    costWeight: 0.8,
    energyWeight: 0.8,
    gasCompatibility: { oxygen: 0.6, nitrogen: 1.0, air: 0.7, argon: 0.8 },
    gasPressureProperties: {
      oxygen: { basePressure: 0.4, thicknessFactor: 0.10, maxPressure: 2.0, qualityFactor: 0.70 },
      nitrogen: { basePressure: 18, thicknessFactor: 3.0, maxPressure: 25, qualityFactor: 0.95 },
      air: { basePressure: 10, thicknessFactor: 1.5, maxPressure: 20, qualityFactor: 0.75 },
      argon: { basePressure: 12, thicknessFactor: 2.0, maxPressure: 22, qualityFactor: 0.88 }
    },
    baseFactor: 0.75,
    roughnessFactor: 1.1,
    drossResistance: 0.9,
    costPerKg: 3.2,
    applications: ['aerospace', 'automotive', 'electronics'],
    cuttingDifficulty: 'medium'
  },
  
  copper: {
    density: 8.96,
    thermalConductivity: 401,
    meltingPoint: 1085,
    specificHeat: 385,
    absorptivity: { fiber: 0.7, co2: 0.2 },
    reflectivity: 0.85,
    powerRange: [1000, 10000],
    speedRange: [200, 4000],
    gasPressureRange: [10, 25],
    focusRange: [-4, 2],
    optimalPowerDensity: 200,
    optimalPowerSpeedRatio: 0.6,
    qualityWeight: 0.6,
    costWeight: 1.5,
    energyWeight: 1.2,
    gasCompatibility: { oxygen: 0.5, nitrogen: 1.0, air: 0.6, argon: 0.9 },
    gasPressureProperties: {
      oxygen: { basePressure: 0.3, thicknessFactor: 0.08, maxPressure: 1.5, qualityFactor: 0.65 },
      nitrogen: { basePressure: 20, thicknessFactor: 3.5, maxPressure: 25, qualityFactor: 0.95 },
      air: { basePressure: 12, thicknessFactor: 2.0, maxPressure: 22, qualityFactor: 0.70 },
      argon: { basePressure: 15, thicknessFactor: 2.5, maxPressure: 25, qualityFactor: 0.90 }
    },
    baseFactor: 0.70,
    roughnessFactor: 1.2,
    drossResistance: 0.6,
    costPerKg: 9.2,
    applications: ['electrical', 'plumbing', 'decorative'],
    cuttingDifficulty: 'hard'
  }
};

// 应用需求数据库
export const applicationRequirements = {
  automotive: {
    maxCost: 1000,
    qualityRequirement: 'high',
    toleranceRequirement: 'tight',
  },
  aerospace: {
    maxCost: 5000,
    qualityRequirement: 'precision',
    toleranceRequirement: 'ultra-tight',
  },
  general: {
    maxCost: 500,
    qualityRequirement: 'standard',
    toleranceRequirement: 'normal',
  },
  structural: {
    maxCost: 800,
    qualityRequirement: 'standard',
    toleranceRequirement: 'normal',
  },
  food: {
    maxCost: 2000,
    qualityRequirement: 'high',
    toleranceRequirement: 'tight',
  },
  medical: {
    maxCost: 3000,
    qualityRequirement: 'precision',
    toleranceRequirement: 'ultra-tight',
  },
  electronics: {
    maxCost: 1500,
    qualityRequirement: 'precision',
    toleranceRequirement: 'tight',
  },
  electrical: {
    maxCost: 1200,
    qualityRequirement: 'high',
    toleranceRequirement: 'tight',
  }
};

// 兼容性映射 - 将不同计算器使用的材料名称映射到统一名称
export const materialNameMapping = {
  // 标准名称
  'steel': 'steel',
  'stainless_steel': 'stainless_steel',
  'aluminum': 'aluminum',
  'copper': 'copper',
  
  // 变体名称
  'carbon_steel': 'steel',
  'mild_steel': 'steel',
  'stainless-steel': 'stainless_steel',
  'stainless-steel-304': 'stainless_steel',
  'aluminum-6061': 'aluminum',
  'aluminium': 'aluminum',
  
  // 其他常见名称
  'brass': 'copper', // 临时映射到copper，因为属性相似
  'bronze': 'copper'
};

// 获取统一材料属性的辅助函数
export function getUnifiedMaterialProperties(materialName: string): UnifiedMaterialProperties | null {
  const normalizedName = materialNameMapping[materialName] || materialName;
  return unifiedMaterialProperties[normalizedName] || null;
}

// 检查材料是否支持的辅助函数
export function isMaterialSupported(materialName: string): boolean {
  const normalizedName = materialNameMapping[materialName] || materialName;
  return normalizedName in unifiedMaterialProperties;
}
