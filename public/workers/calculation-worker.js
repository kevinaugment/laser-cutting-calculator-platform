// 计算Worker - 处理重型计算任务，避免阻塞主线程

// Worker消息类型定义
const MESSAGE_TYPES = {
  CALCULATE: 'CALCULATE',
  BATCH_CALCULATE: 'BATCH_CALCULATE',
  SENSITIVITY_ANALYSIS: 'SENSITIVITY_ANALYSIS',
  OPTIMIZATION: 'OPTIMIZATION',
  RESULT: 'RESULT',
  ERROR: 'ERROR',
  PROGRESS: 'PROGRESS'
};

// 计算器实现映射
const calculatorImplementations = {
  'laser-cutting-cost': calculateLaserCuttingCost,
  'cutting-time-estimator': calculateCuttingTime,
  'material-nesting-optimizer': calculateMaterialNesting,
  'batch-processing': calculateBatchProcessing,
  'sensitivity-analysis': performSensitivityAnalysis
};

// 激光切割成本计算
function calculateLaserCuttingCost(inputs) {
  const {
    materialType,
    thickness,
    length,
    width,
    quantity,
    materialCost,
    laserPower,
    cuttingSpeed,
    setupTime,
    electricityRate,
    laborRate,
    machineHourlyRate
  } = inputs;

  // 基础计算
  const partArea = (length * width) / 1000000; // mm² to m²
  const cuttingLength = 2 * (length + width); // 简化的切割长度
  const actualCuttingSpeed = getCuttingSpeed(materialType, thickness, laserPower);
  const cuttingTime = cuttingLength / actualCuttingSpeed / 60; // 转换为小时

  // 成本计算
  const materialCostTotal = materialCost * partArea * quantity;
  const operatingCost = cuttingTime * machineHourlyRate * quantity;
  const setupCost = (setupTime / 60) * laborRate;
  const electricityCost = (laserPower / 1000) * cuttingTime * electricityRate * quantity;

  const totalCost = materialCostTotal + operatingCost + setupCost + electricityCost;
  const costPerPiece = totalCost / quantity;

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    costPerPiece: Math.round(costPerPiece * 100) / 100,
    breakdown: {
      materialCost: Math.round(materialCostTotal * 100) / 100,
      operatingCost: Math.round(operatingCost * 100) / 100,
      setupCost: Math.round(setupCost * 100) / 100,
      electricityCost: Math.round(electricityCost * 100) / 100
    },
    efficiency: {
      cuttingTime: Math.round(cuttingTime * 100) / 100,
      materialUtilization: Math.min(95, Math.round((partArea / (0.001 * 0.001)) * 100) / 100),
      energyEfficiency: Math.round((actualCuttingSpeed / laserPower * 1000) * 100) / 100
    }
  };
}

// 切割时间估算
function calculateCuttingTime(inputs) {
  const { materialType, thickness, cuttingLength, laserPower, gasType } = inputs;
  
  const baseSpeed = getCuttingSpeed(materialType, thickness, laserPower);
  const gasMultiplier = getGasMultiplier(gasType);
  const actualSpeed = baseSpeed * gasMultiplier;
  
  const cuttingTime = cuttingLength / actualSpeed; // 分钟
  const piercingTime = calculatePiercingTime(thickness, laserPower);
  const totalTime = cuttingTime + piercingTime;

  return {
    cuttingTime: Math.round(cuttingTime * 100) / 100,
    piercingTime: Math.round(piercingTime * 100) / 100,
    totalTime: Math.round(totalTime * 100) / 100,
    cuttingSpeed: Math.round(actualSpeed * 100) / 100
  };
}

// 材料嵌套优化
function calculateMaterialNesting(inputs) {
  const { parts, sheetSize, kerfWidth, margin } = inputs;
  
  // 简化的嵌套算法
  const sheetArea = sheetSize.width * sheetSize.height;
  let totalPartArea = 0;
  let arrangedParts = [];

  for (const part of parts) {
    const partArea = (part.width + kerfWidth) * (part.height + kerfWidth);
    totalPartArea += partArea * part.quantity;
    
    arrangedParts.push({
      ...part,
      adjustedWidth: part.width + kerfWidth,
      adjustedHeight: part.height + kerfWidth,
      area: partArea
    });
  }

  const utilization = (totalPartArea / sheetArea) * 100;
  const wasteArea = sheetArea - totalPartArea;
  const sheetsNeeded = Math.ceil(totalPartArea / (sheetArea * 0.85)); // 85%最大利用率

  return {
    utilization: Math.round(utilization * 100) / 100,
    wasteArea: Math.round(wasteArea),
    sheetsNeeded,
    arrangedParts,
    totalArea: Math.round(totalPartArea),
    recommendations: generateNestingRecommendations(utilization)
  };
}

// 批处理计算
function calculateBatchProcessing(inputs) {
  const { jobs, machineCapacity, setupTime, operatorEfficiency } = inputs;
  
  let totalTime = 0;
  let totalCost = 0;
  const batches = [];

  // 简化的批处理算法
  for (let i = 0; i < jobs.length; i += machineCapacity) {
    const batch = jobs.slice(i, i + machineCapacity);
    const batchTime = setupTime + batch.reduce((sum, job) => sum + job.processingTime, 0);
    const batchCost = batchTime * operatorEfficiency * 50; // 假设每小时50元

    batches.push({
      id: Math.floor(i / machineCapacity) + 1,
      jobs: batch,
      time: batchTime,
      cost: batchCost
    });

    totalTime += batchTime;
    totalCost += batchCost;
  }

  return {
    totalTime: Math.round(totalTime * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    batchCount: batches.length,
    batches,
    efficiency: Math.round((jobs.length / totalTime) * 100) / 100
  };
}

// 敏感度分析
function performSensitivityAnalysis(inputs) {
  const { baseInputs, calculatorType, variableRanges } = inputs;
  const results = [];
  
  for (const [variable, range] of Object.entries(variableRanges)) {
    const variableResults = [];
    const step = (range.max - range.min) / 10;
    
    for (let value = range.min; value <= range.max; value += step) {
      const modifiedInputs = { ...baseInputs, [variable]: value };
      const result = calculatorImplementations[calculatorType](modifiedInputs);
      
      variableResults.push({
        value: Math.round(value * 100) / 100,
        result: result.totalCost || result.totalTime || result.utilization || 0
      });
    }
    
    results.push({
      variable,
      data: variableResults,
      sensitivity: calculateSensitivity(variableResults)
    });
  }
  
  return {
    analysis: results,
    mostSensitive: results.reduce((max, current) => 
      current.sensitivity > max.sensitivity ? current : max
    )
  };
}

// 辅助函数
function getCuttingSpeed(materialType, thickness, laserPower) {
  const speedTable = {
    'Mild Steel': { base: 3000, powerFactor: 1.2, thicknessFactor: 0.8 },
    'Stainless Steel': { base: 2500, powerFactor: 1.1, thicknessFactor: 0.7 },
    'Aluminum': { base: 4000, powerFactor: 1.3, thicknessFactor: 0.9 }
  };
  
  const material = speedTable[materialType] || speedTable['Mild Steel'];
  const powerMultiplier = Math.pow(laserPower / 1000, material.powerFactor);
  const thicknessMultiplier = Math.pow(thickness, -material.thicknessFactor);
  
  return material.base * powerMultiplier * thicknessMultiplier;
}

function getGasMultiplier(gasType) {
  const multipliers = {
    'Oxygen': 1.0,
    'Nitrogen': 0.8,
    'Air': 0.6,
    'Argon': 0.7
  };
  return multipliers[gasType] || 1.0;
}

function calculatePiercingTime(thickness, laserPower) {
  return (thickness * thickness) / (laserPower / 1000) * 0.1;
}

function generateNestingRecommendations(utilization) {
  if (utilization > 85) {
    return ['Excellent utilization', 'Consider this layout for production'];
  } else if (utilization > 70) {
    return ['Good utilization', 'Minor adjustments may improve efficiency'];
  } else {
    return ['Low utilization', 'Consider redesigning part layout', 'Check for better nesting algorithms'];
  }
}

function calculateSensitivity(data) {
  if (data.length < 2) return 0;
  
  const values = data.map(d => d.result);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return max > 0 ? ((max - min) / max) * 100 : 0;
}

// Worker消息处理
self.onmessage = function(e) {
  const { type, id, calculatorType, inputs, options } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case MESSAGE_TYPES.CALCULATE:
        if (calculatorImplementations[calculatorType]) {
          result = calculatorImplementations[calculatorType](inputs);
        } else {
          throw new Error(`Unknown calculator type: ${calculatorType}`);
        }
        break;
        
      case MESSAGE_TYPES.BATCH_CALCULATE:
        result = inputs.map(input => 
          calculatorImplementations[calculatorType](input)
        );
        break;
        
      case MESSAGE_TYPES.SENSITIVITY_ANALYSIS:
        result = performSensitivityAnalysis({
          baseInputs: inputs,
          calculatorType,
          variableRanges: options.variableRanges
        });
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    // 发送结果
    self.postMessage({
      type: MESSAGE_TYPES.RESULT,
      id,
      result,
      timestamp: Date.now()
    });
    
  } catch (error) {
    // 发送错误
    self.postMessage({
      type: MESSAGE_TYPES.ERROR,
      id,
      error: {
        message: error.message,
        stack: error.stack
      },
      timestamp: Date.now()
    });
  }
};
