// 基础计算引擎 - 纯计算功能，无AI
// 提供准确的激光切割计算功能

export interface BasicCalculationInputs {
  material: string;
  thickness: number;
  length: number;
  width: number;
  quantity: number;
  laserPower?: number;
  cuttingSpeed?: number;
  materialPricePerKg?: number;
  laborRatePerHour?: number;
}

export interface BasicCalculationResults {
  totalCost: number;
  materialCost: number;
  laborCost: number;
  energyCost: number;
  totalTime: number;
  cuttingTime: number;
  setupTime: number;
}

// 扩展材料属性数据库 - Phase 3: 功能增强与扩展
const MATERIAL_PROPERTIES = {
  // 钢材类
  steel: {
    name: 'Carbon Steel',
    category: 'steel',
    density: 7.85, // kg/dm³
    defaultPower: 2000, // W
    defaultSpeed: 1000, // mm/min
    energyFactor: 1.0,
    thermalConductivity: 50.2, // W/(m·K)
    meltingPoint: 1538, // °C
    reflectivity: 0.65, // at 1064nm
    absorptivity: 0.35,
    gasRecommendation: 'oxygen',
    maxThickness: 25, // mm
    qualityGrade: 'standard'
  },
  stainless_steel: {
    name: 'Stainless Steel',
    category: 'steel',
    density: 8.0,
    defaultPower: 2500,
    defaultSpeed: 800,
    energyFactor: 1.2,
    thermalConductivity: 16.2,
    meltingPoint: 1400,
    reflectivity: 0.72,
    absorptivity: 0.28,
    gasRecommendation: 'nitrogen',
    maxThickness: 20,
    qualityGrade: 'high'
  },

  // 有色金属类
  aluminum: {
    name: 'Aluminum',
    category: 'non_ferrous',
    density: 2.70,
    defaultPower: 1500,
    defaultSpeed: 1500,
    energyFactor: 0.8,
    thermalConductivity: 237,
    meltingPoint: 660,
    reflectivity: 0.92,
    absorptivity: 0.08,
    gasRecommendation: 'nitrogen',
    maxThickness: 12,
    qualityGrade: 'standard'
  },
  copper: {
    name: 'Copper',
    category: 'non_ferrous',
    density: 8.96,
    defaultPower: 3000,
    defaultSpeed: 600,
    energyFactor: 1.5,
    thermalConductivity: 401,
    meltingPoint: 1085,
    reflectivity: 0.95,
    absorptivity: 0.05,
    gasRecommendation: 'nitrogen',
    maxThickness: 8,
    qualityGrade: 'high'
  },
  brass: {
    name: 'Brass',
    category: 'non_ferrous',
    density: 8.5,
    defaultPower: 2200,
    defaultSpeed: 900,
    energyFactor: 1.1,
    thermalConductivity: 120,
    meltingPoint: 930,
    reflectivity: 0.85,
    absorptivity: 0.15,
    gasRecommendation: 'nitrogen',
    maxThickness: 10,
    qualityGrade: 'standard'
  },

  // 高级合金类
  titanium: {
    name: 'Titanium',
    category: 'advanced_alloy',
    density: 4.51,
    defaultPower: 2800,
    defaultSpeed: 700,
    energyFactor: 1.3,
    thermalConductivity: 21.9,
    meltingPoint: 1668,
    reflectivity: 0.58,
    absorptivity: 0.42,
    gasRecommendation: 'argon',
    maxThickness: 15,
    qualityGrade: 'premium'
  },
  inconel: {
    name: 'Inconel',
    category: 'advanced_alloy',
    density: 8.19,
    defaultPower: 3200,
    defaultSpeed: 500,
    energyFactor: 1.6,
    thermalConductivity: 11.4,
    meltingPoint: 1413,
    reflectivity: 0.68,
    absorptivity: 0.32,
    gasRecommendation: 'argon',
    maxThickness: 12,
    qualityGrade: 'premium'
  },

  // 复合材料类
  carbon_fiber: {
    name: 'Carbon Fiber',
    category: 'composite',
    density: 1.60,
    defaultPower: 800,
    defaultSpeed: 2000,
    energyFactor: 0.6,
    thermalConductivity: 7.0,
    meltingPoint: 3650, // 升华点
    reflectivity: 0.15,
    absorptivity: 0.85,
    gasRecommendation: 'air',
    maxThickness: 5,
    qualityGrade: 'specialty'
  },

  // 陶瓷类
  alumina_ceramic: {
    name: 'Alumina Ceramic',
    category: 'ceramic',
    density: 3.95,
    defaultPower: 1800,
    defaultSpeed: 300,
    energyFactor: 1.4,
    thermalConductivity: 30.0,
    meltingPoint: 2072,
    reflectivity: 0.25,
    absorptivity: 0.75,
    gasRecommendation: 'air',
    maxThickness: 3,
    qualityGrade: 'specialty'
  }
};
export class BasicCalculationEngine {

  /**
   * 基础成本计算
   */
  calculateCost(inputs: BasicCalculationInputs): BasicCalculationResults {
    const material = MATERIAL_PROPERTIES[inputs.material as keyof typeof MATERIAL_PROPERTIES] || MATERIAL_PROPERTIES.steel;

    // 计算材料重量 (kg)
    const volume = (inputs.length * inputs.width * inputs.thickness) / 1000000; // mm³ to dm³
    const weight = volume * material.density * inputs.quantity;

    // 材料成本
    const materialCost = weight * (inputs.materialPricePerKg || 2.5);

    // 切割时间计算
    const perimeter = (inputs.length + inputs.width) * 2; // mm
    const totalCuttingLength = perimeter * inputs.quantity; // mm
    const cuttingSpeed = inputs.cuttingSpeed || material.defaultSpeed; // mm/min
    const cuttingTime = totalCuttingLength / cuttingSpeed; // minutes

    // 设置时间 (固定5分钟 + 每件0.5分钟)
    const setupTime = 5 + (inputs.quantity * 0.5);
    const totalTime = cuttingTime + setupTime;

    // 人工成本
    const laborCost = (totalTime / 60) * (inputs.laborRatePerHour || 50);

    // 能耗成本 (简化计算)
    const power = inputs.laserPower || material.defaultPower;
    const energyConsumption = (power / 1000) * (cuttingTime / 60) * material.energyFactor; // kWh
    const energyCost = energyConsumption * 0.12; // $0.12/kWh

    const totalCost = materialCost + laborCost + energyCost;

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      materialCost: Math.round(materialCost * 100) / 100,
      laborCost: Math.round(laborCost * 100) / 100,
      energyCost: Math.round(energyCost * 1000) / 1000, // 更高精度，保留3位小数
      totalTime: Math.round(totalTime * 100) / 100,
      cuttingTime: Math.round(cuttingTime * 100) / 100,
      setupTime: Math.round(setupTime * 100) / 100
    };
  }

  /**
   * 时间估算
   */
  calculateTime(inputs: BasicCalculationInputs): number {
    const material = MATERIAL_PROPERTIES[inputs.material as keyof typeof MATERIAL_PROPERTIES] || MATERIAL_PROPERTIES.steel;
    const perimeter = (inputs.length + inputs.width) * 2;
    const totalLength = perimeter * inputs.quantity;
    const speed = inputs.cuttingSpeed || material.defaultSpeed;

    const cuttingTime = totalLength / speed; // minutes
    const setupTime = 5 + (inputs.quantity * 0.5); // minutes
    const piercingTime = inputs.quantity * 0.2; // minutes per pierce

    return Math.round((cuttingTime + setupTime + piercingTime) * 100) / 100;
  }

  /**
   * 功率推荐
   */
  recommendPower(material: string, thickness: number): number {
    const materialProps = MATERIAL_PROPERTIES[material as keyof typeof MATERIAL_PROPERTIES] || MATERIAL_PROPERTIES.steel;

    // 基于厚度调整功率
    let powerMultiplier = 1.0;
    if (thickness <= 1) powerMultiplier = 0.6;
    else if (thickness <= 3) powerMultiplier = 0.8;
    else if (thickness <= 6) powerMultiplier = 1.0;
    else if (thickness <= 10) powerMultiplier = 1.3;
    else if (thickness <= 15) powerMultiplier = 1.6;
    else powerMultiplier = 2.0;

    return Math.round(materialProps.defaultPower * powerMultiplier);
  }

  /**
   * 速度推荐
   */
  recommendSpeed(material: string, thickness: number, power?: number): number {
    const materialProps = MATERIAL_PROPERTIES[material as keyof typeof MATERIAL_PROPERTIES] || MATERIAL_PROPERTIES.steel;

    // 基于厚度调整速度
    let speedMultiplier = 1.0;
    if (thickness <= 1) speedMultiplier = 2.0;
    else if (thickness <= 3) speedMultiplier = 1.5;
    else if (thickness <= 6) speedMultiplier = 1.0;
    else if (thickness <= 10) speedMultiplier = 0.7;
    else if (thickness <= 15) speedMultiplier = 0.5;
    else speedMultiplier = 0.3;

    // 如果提供了功率，根据功率调整
    if (power) {
      const powerRatio = power / materialProps.defaultPower;
      speedMultiplier *= Math.sqrt(powerRatio); // 功率增加，速度可以适当增加
    }

    return Math.round(materialProps.defaultSpeed * speedMultiplier);
  }

  /**
   * 材料利用率计算
   */
  calculateMaterialUtilization(partLength: number, partWidth: number, sheetLength: number, sheetWidth: number): {
    partsPerSheet: number;
    utilization: number;
    wasteArea: number;
  } {
    // 简单的矩形嵌套计算
    const partsX = Math.floor(sheetLength / partLength);
    const partsY = Math.floor(sheetWidth / partWidth);
    const partsPerSheet = partsX * partsY;

    const usedArea = partsPerSheet * partLength * partWidth;
    const sheetArea = sheetLength * sheetWidth;
    const utilization = (usedArea / sheetArea) * 100;
    const wasteArea = sheetArea - usedArea;

    return {
      partsPerSheet,
      utilization: Math.round(utilization * 100) / 100,
      wasteArea: Math.round(wasteArea)
    };
  }

  /**
   * 气体消耗计算
   */
  calculateGasConsumption(cuttingTime: number, gasType: string = 'nitrogen'): {
    volume: number; // L
    cost: number; // USD
  } {
    const gasRates = {
      nitrogen: { flowRate: 15, costPerL: 0.002 }, // L/min, $/L
      oxygen: { flowRate: 12, costPerL: 0.001 },
      air: { flowRate: 20, costPerL: 0.0005 },
      argon: { flowRate: 10, costPerL: 0.005 }
    };

    const gas = gasRates[gasType as keyof typeof gasRates] || gasRates.nitrogen;
    const volume = cuttingTime * gas.flowRate;
    const cost = volume * gas.costPerL;

    return {
      volume: Math.round(volume * 100) / 100,
      cost: Math.round(cost * 100) / 100
    };
  }

  /**
   * 材料选择建议 - Phase 3新功能
   */
  suggestMaterial(requirements: {
    thickness: number;
    strength?: 'low' | 'medium' | 'high' | 'extreme';
    corrosionResistance?: 'low' | 'medium' | 'high';
    weight?: 'light' | 'medium' | 'heavy';
    cost?: 'low' | 'medium' | 'high';
    application?: 'general' | 'aerospace' | 'marine' | 'automotive' | 'electronics';
  }): {
    recommended: string[];
    alternatives: string[];
    reasons: string[];
  } {
    const materials = Object.keys(MATERIAL_PROPERTIES);
    const recommended: string[] = [];
    const alternatives: string[] = [];
    const reasons: string[] = [];

    // 根据厚度筛选
    const suitableMaterials = materials.filter(material => {
      const props = MATERIAL_PROPERTIES[material as keyof typeof MATERIAL_PROPERTIES];
      return requirements.thickness <= props.maxThickness;
    });

    // 根据应用场景推荐
    if (requirements.application === 'aerospace') {
      if (suitableMaterials.includes('titanium')) {
        recommended.push('titanium');
        reasons.push('Titanium offers excellent strength-to-weight ratio for aerospace applications');
      }
      if (suitableMaterials.includes('carbon_fiber')) {
        recommended.push('carbon_fiber');
        reasons.push('Carbon fiber provides ultra-light weight and high strength');
      }
      if (suitableMaterials.includes('aluminum')) {
        alternatives.push('aluminum');
      }
    } else if (requirements.application === 'marine') {
      if (suitableMaterials.includes('stainless_steel')) {
        recommended.push('stainless_steel');
        reasons.push('Stainless steel offers excellent corrosion resistance for marine environments');
      }
      if (suitableMaterials.includes('aluminum')) {
        recommended.push('aluminum');
        reasons.push('Aluminum provides good corrosion resistance and light weight');
      }
    } else if (requirements.application === 'automotive') {
      if (suitableMaterials.includes('steel')) {
        recommended.push('steel');
        reasons.push('Steel provides good strength and cost-effectiveness for automotive parts');
      }
      if (suitableMaterials.includes('aluminum')) {
        recommended.push('aluminum');
        reasons.push('Aluminum offers weight reduction for fuel efficiency');
      }
    } else {
      // 通用应用
      if (suitableMaterials.includes('steel')) {
        recommended.push('steel');
        reasons.push('Steel is versatile and cost-effective for general applications');
      }
      if (suitableMaterials.includes('aluminum')) {
        alternatives.push('aluminum');
      }
    }

    // 如果没有推荐材料，添加通用选择
    if (recommended.length === 0) {
      const fallback = suitableMaterials.find(m => ['steel', 'aluminum', 'stainless_steel'].includes(m));
      if (fallback) {
        recommended.push(fallback);
        reasons.push('Suitable for the specified thickness requirements');
      }
    }

    return {
      recommended,
      alternatives,
      reasons
    };
  }

  /**
   * 材料属性对比 - Phase 3新功能
   */
  compareMaterials(materialIds: string[]): {
    comparison: Array<{
      material: string;
      name: string;
      density: number;
      maxThickness: number;
      thermalConductivity: number;
      meltingPoint: number;
      qualityGrade: string;
      costFactor: number;
    }>;
    recommendations: string[];
  } {
    const comparison = materialIds.map(materialId => {
      const props = MATERIAL_PROPERTIES[materialId as keyof typeof MATERIAL_PROPERTIES];
      if (!props) return null;

      // 简化的成本因子计算
      let costFactor = 1.0;
      if (props.category === 'advanced_alloy') costFactor = 3.0;
      else if (props.category === 'composite' || props.category === 'ceramic') costFactor = 2.5;
      else if (props.category === 'non_ferrous') costFactor = 1.5;

      return {
        material: materialId,
        name: props.name,
        density: props.density,
        maxThickness: props.maxThickness,
        thermalConductivity: props.thermalConductivity,
        meltingPoint: props.meltingPoint,
        qualityGrade: props.qualityGrade,
        costFactor
      };
    }).filter(Boolean) as any[];

    const recommendations: string[] = [];

    // 生成对比建议
    if (comparison.length > 1) {
      const lightest = comparison.reduce((prev, curr) => prev.density < curr.density ? prev : curr);
      const strongest = comparison.reduce((prev, curr) => prev.meltingPoint > curr.meltingPoint ? prev : curr);
      const mostEconomical = comparison.reduce((prev, curr) => prev.costFactor < curr.costFactor ? prev : curr);

      recommendations.push(`${lightest.name} is the lightest option (${lightest.density} kg/dm³)`);
      recommendations.push(`${strongest.name} has the highest melting point (${strongest.meltingPoint}°C)`);
      recommendations.push(`${mostEconomical.name} is the most economical choice`);
    }

    return {
      comparison,
      recommendations
    };
  }

  /**
   * 获取所有可用材料 - Phase 3新功能
   */
  getAvailableMaterials(): Array<{
    id: string;
    name: string;
    category: string;
    maxThickness: number;
    qualityGrade: string;
  }> {
    return Object.entries(MATERIAL_PROPERTIES).map(([id, props]) => ({
      id,
      name: props.name,
      category: props.category,
      maxThickness: props.maxThickness,
      qualityGrade: props.qualityGrade
    }));
  }
}

// 导出计算引擎实例
export const enhancedCalculationEngine = new BasicCalculationEngine();