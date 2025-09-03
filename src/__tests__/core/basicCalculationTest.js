// 基础计算测试 - Phase 4: 质量保证与测试覆盖
// 使用纯JavaScript验证核心计算功能，避免复杂的配置问题

import { enhancedCalculationEngine } from '../../services/enhancedCalculationEngine.ts';

// 简单的测试框架
class SimpleTestFramework {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  async run() {
    console.log('🧪 Running Basic Calculation Tests...\n');
    
    for (const test of this.tests) {
      try {
        await test.testFunction();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
        this.failed++;
      }
    }
    
    console.log(`\n📊 Test Results:`);
    console.log(`   Passed: ${this.passed}`);
    console.log(`   Failed: ${this.failed}`);
    console.log(`   Total: ${this.tests.length}`);
    
    if (this.failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️  Some tests failed.');
    }
    
    return this.failed === 0;
  }
}

// 简单的断言函数
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertApproxEqual(actual, expected, tolerance = 0.01, message) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(message || `Expected ${expected}, got ${actual} (diff: ${diff})`);
  }
}

// 创建测试实例
const testFramework = new SimpleTestFramework();

// 基础计算测试
testFramework.test('Should calculate cost for steel', () => {
  const inputs = {
    material: 'steel',
    thickness: 3,
    length: 100,
    width: 100,
    quantity: 1
  };
  
  const result = enhancedCalculationEngine.calculateCost(inputs);
  
  // 验证结果结构
  assert(typeof result === 'object', 'Result should be an object');
  assert(typeof result.totalCost === 'number', 'totalCost should be a number');
  assert(typeof result.totalTime === 'number', 'totalTime should be a number');
  assert(typeof result.materialCost === 'number', 'materialCost should be a number');
  assert(typeof result.laborCost === 'number', 'laborCost should be a number');
  assert(typeof result.energyCost === 'number', 'energyCost should be a number');
  
  // 验证数值合理性
  assert(result.totalCost > 0, 'totalCost should be positive');
  assert(result.totalTime > 0, 'totalTime should be positive');
  assert(result.materialCost > 0, 'materialCost should be positive');
  assert(result.laborCost > 0, 'laborCost should be positive');
  assert(result.energyCost > 0, 'energyCost should be positive');
  
  // 验证总成本计算
  const calculatedTotal = result.materialCost + result.laborCost + result.energyCost;
  assertApproxEqual(result.totalCost, calculatedTotal, 0.01, 'Total cost should equal sum of components');
});

testFramework.test('Should calculate cost for aluminum', () => {
  const inputs = {
    material: 'aluminum',
    thickness: 2,
    length: 200,
    width: 150,
    quantity: 1
  };
  
  const result = enhancedCalculationEngine.calculateCost(inputs);
  
  assert(result.totalCost > 0, 'Aluminum cost should be positive');
  assert(result.totalTime > 0, 'Aluminum time should be positive');
});

testFramework.test('Should scale with quantity', () => {
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

  // 材料成本应该线性缩放
  assertApproxEqual(
    multipleResult.materialCost,
    singleResult.materialCost * 5,
    0.01,
    'Material cost should scale linearly with quantity'
  );

  // 总成本应该增加，但不是完全线性（因为设置时间）
  assert(
    multipleResult.totalCost > singleResult.totalCost * 1.5,
    'Total cost should increase significantly with quantity'
  );

  assert(
    multipleResult.totalCost < singleResult.totalCost * 5.5,
    'Total cost should not exceed linear scaling by too much'
  );
});

testFramework.test('Should calculate time correctly', () => {
  const inputs = {
    material: 'steel',
    thickness: 3,
    length: 100,
    width: 100,
    quantity: 1
  };

  const result = enhancedCalculationEngine.calculateTime(inputs);

  assert(typeof result === 'number', 'result should be a number');
  assert(result > 0, 'time should be positive');
});

testFramework.test('Should handle different materials', () => {
  const materials = ['steel', 'aluminum', 'stainless_steel', 'copper', 'brass'];
  const baseInputs = {
    thickness: 3,
    length: 100,
    width: 100,
    quantity: 1
  };
  
  materials.forEach(material => {
    const inputs = { ...baseInputs, material };
    const result = enhancedCalculationEngine.calculateCost(inputs);
    
    assert(result.totalCost > 0, `${material} cost should be positive`);
    assert(result.totalTime > 0, `${material} time should be positive`);
  });
});

testFramework.test('Should handle boundary values', () => {
  const inputs = {
    material: 'steel',
    thickness: 0.1,
    length: 1,
    width: 1,
    quantity: 1
  };
  
  const result = enhancedCalculationEngine.calculateCost(inputs);
  
  assert(result.totalCost > 0, 'Minimum values should produce positive cost');
  assert(result.totalTime > 0, 'Minimum values should produce positive time');
});

testFramework.test('Should be performant', () => {
  const inputs = {
    material: 'steel',
    thickness: 3,
    length: 100,
    width: 100,
    quantity: 1
  };
  
  const iterations = 100;
  const startTime = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    enhancedCalculationEngine.calculateCost(inputs);
  }
  
  const endTime = Date.now();
  const avgTime = (endTime - startTime) / iterations;
  
  assert(avgTime < 10, `Average calculation time should be < 10ms, got ${avgTime}ms`);
});

testFramework.test('Should maintain consistency', () => {
  const inputs = {
    material: 'steel',
    thickness: 3,
    length: 100,
    width: 100,
    quantity: 1
  };
  
  const result1 = enhancedCalculationEngine.calculateCost(inputs);
  const result2 = enhancedCalculationEngine.calculateCost(inputs);
  
  assert(result1.totalCost === result2.totalCost, 'Results should be consistent');
  assert(result1.totalTime === result2.totalTime, 'Time results should be consistent');
});

// 运行测试
testFramework.run().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test framework error:', error);
  process.exit(1);
});

export { testFramework, assert, assertApproxEqual };
