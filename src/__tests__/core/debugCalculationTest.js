// 调试计算测试 - Phase 4: 质量保证与测试覆盖
// 用于调试和分析计算引擎的具体问题

import { enhancedCalculationEngine } from '../../services/enhancedCalculationEngine.ts';

// 调试钢材成本计算
console.log('🔍 Debugging Steel Cost Calculation...\n');

const steelInputs = {
  material: 'steel',
  thickness: 3,
  length: 100,
  width: 100,
  quantity: 1
};

console.log('Input parameters:', steelInputs);

const steelResult = enhancedCalculationEngine.calculateCost(steelInputs);
console.log('Steel calculation result:', steelResult);

console.log('\n📊 Detailed breakdown:');
console.log(`  Material Cost: $${steelResult.materialCost}`);
console.log(`  Labor Cost: $${steelResult.laborCost}`);
console.log(`  Energy Cost: $${steelResult.energyCost}`);
console.log(`  Total Cost: $${steelResult.totalCost}`);
console.log(`  Total Time: ${steelResult.totalTime} minutes`);

// 验证总成本计算
const calculatedTotal = steelResult.materialCost + steelResult.laborCost + steelResult.energyCost;
console.log(`  Calculated Total: $${calculatedTotal.toFixed(2)}`);
console.log(`  Difference: $${Math.abs(steelResult.totalCost - calculatedTotal).toFixed(2)}`);

// 调试数量缩放问题
console.log('\n🔍 Debugging Quantity Scaling...\n');

const singleInputs = {
  material: 'steel',
  thickness: 3,
  length: 100,
  width: 100,
  quantity: 1
};

const multipleInputs = {
  ...singleInputs,
  quantity: 5
};

const singleResult = enhancedCalculationEngine.calculateCost(singleInputs);
const multipleResult = enhancedCalculationEngine.calculateCost(multipleInputs);

console.log('Single quantity result:', singleResult);
console.log('Multiple quantity result:', multipleResult);

console.log('\n📊 Scaling analysis:');
console.log(`  Single cost: $${singleResult.totalCost}`);
console.log(`  Multiple cost: $${multipleResult.totalCost}`);
console.log(`  Expected multiple cost: $${(singleResult.totalCost * 5).toFixed(2)}`);
console.log(`  Actual scaling factor: ${(multipleResult.totalCost / singleResult.totalCost).toFixed(2)}`);
console.log(`  Expected scaling factor: 5.00`);

// 调试时间计算
console.log('\n🔍 Debugging Time Calculation...\n');

const timeResult = enhancedCalculationEngine.calculateTime(steelInputs);
console.log('Time calculation result:', timeResult);
console.log('Type of result:', typeof timeResult);

// 检查各个组件是否为正数
console.log('\n🔍 Component Analysis...\n');

// 手动计算各个组件
const volume = (steelInputs.length * steelInputs.width * steelInputs.thickness) / 1000000;
console.log(`Volume: ${volume} dm³`);

const weight = volume * 7.85 * steelInputs.quantity; // 钢的密度
console.log(`Weight: ${weight} kg`);

const materialCost = weight * 2.5; // 默认材料价格
console.log(`Material cost: $${materialCost.toFixed(2)}`);

const perimeter = (steelInputs.length + steelInputs.width) * 2;
console.log(`Perimeter: ${perimeter} mm`);

const cuttingSpeed = 1000; // 钢的默认切割速度
const cuttingTime = perimeter / cuttingSpeed;
console.log(`Cutting time: ${cuttingTime} minutes`);

const setupTime = 5 + (steelInputs.quantity * 0.5);
console.log(`Setup time: ${setupTime} minutes`);

const totalTime = cuttingTime + setupTime;
console.log(`Total time: ${totalTime} minutes`);

const laborCost = (totalTime / 60) * 50; // 默认人工费率
console.log(`Labor cost: $${laborCost.toFixed(2)}`);

const power = 2000; // 钢的默认功率
const energyConsumption = (power / 1000) * (cuttingTime / 60) * 1.0; // 钢的能耗因子
console.log(`Energy consumption: ${energyConsumption} kWh`);

const energyCost = energyConsumption * 0.12;
console.log(`Energy cost: $${energyCost.toFixed(2)}`);

console.log('\n✅ Debug analysis complete!');
