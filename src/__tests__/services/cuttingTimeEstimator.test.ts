// Cutting Time Estimator 测试套件 - Phase 4: 质量保证与测试覆盖
// 全面测试切割时间估算器的功能、准确性和性能

import { describe, it, expect, beforeEach } from 'vitest';
import { enhancedCalculationEngine } from '../../services/enhancedCalculationEngine';
import { calculatorTestFramework, CalculatorTestSuite } from '../utils/calculatorTestFramework';
import { testDataGenerator } from '../utils/testDataGenerator';

describe('Cutting Time Estimator', () => {
  let testSuite: CalculatorTestSuite;

  beforeEach(() => {
    testSuite = {
      calculatorName: 'Cutting Time Estimator',
      calculatorFunction: enhancedCalculationEngine.calculateTime.bind(enhancedCalculationEngine),
      testCases: [
        // 标准有效输入测试
        {
          name: 'should estimate time for standard steel cutting',
          description: '标准钢材切割时间估算',
          inputs: {
            material: 'steel',
            thickness: 3,
            length: 100,
            width: 100,
            quantity: 1
          },
          expectedOutputs: {
            totalTime: 5.0, // 基于实际计算逻辑的期望值
          },
          tolerance: 0.2,
          category: 'valid'
        },
        
        {
          name: 'should estimate time for aluminum cutting',
          description: '铝材切割时间估算',
          inputs: {
            material: 'aluminum',
            thickness: 2,
            length: 200,
            width: 150,
            quantity: 1
          },
          expectedOutputs: {
            totalTime: 7.5,
          },
          tolerance: 0.3,
          category: 'valid'
        },
        
        {
          name: 'should estimate time for thick stainless steel',
          description: '厚不锈钢切割时间估算',
          inputs: {
            material: 'stainless_steel',
            thickness: 8,
            length: 50,
            width: 50,
            quantity: 1
          },
          expectedOutputs: {
            totalTime: 8.0,
          },
          tolerance: 0.4,
          category: 'valid'
        },
        
        // 边界值测试
        {
          name: 'should handle minimum thickness timing',
          description: '最小厚度时间计算',
          inputs: {
            material: 'steel',
            thickness: 0.1,
            length: 100,
            width: 100,
            quantity: 1
          },
          category: 'boundary'
        },
        
        {
          name: 'should handle maximum thickness timing',
          description: '最大厚度时间计算',
          inputs: {
            material: 'steel',
            thickness: 25,
            length: 100,
            width: 100,
            quantity: 1
          },
          category: 'boundary'
        },
        
        {
          name: 'should handle large perimeter cutting',
          description: '大周长切割时间',
          inputs: {
            material: 'steel',
            thickness: 3,
            length: 1000,
            width: 1000,
            quantity: 1
          },
          category: 'boundary'
        },
        
        {
          name: 'should handle batch cutting time',
          description: '批量切割时间',
          inputs: {
            material: 'steel',
            thickness: 3,
            length: 100,
            width: 100,
            quantity: 100
          },
          category: 'boundary'
        },
        
        // 无效输入测试
        {
          name: 'should reject negative thickness for timing',
          description: '拒绝负厚度时间计算',
          inputs: {
            material: 'steel',
            thickness: -1,
            length: 100,
            width: 100,
            quantity: 1
          },
          expectedErrors: ['Invalid thickness'],
          category: 'invalid'
        },
        
        {
          name: 'should reject zero dimensions for timing',
          description: '拒绝零尺寸时间计算',
          inputs: {
            material: 'steel',
            thickness: 3,
            length: 0,
            width: 100,
            quantity: 1
          },
          expectedErrors: ['Invalid dimensions'],
          category: 'invalid'
        },
        
        // 边缘情况测试
        {
          name: 'should handle copper precision cutting time',
          description: '铜材精密切割时间',
          inputs: {
            material: 'copper',
            thickness: 1,
            length: 25,
            width: 25,
            quantity: 50
          },
          category: 'edge'
        },
        
        {
          name: 'should handle brass complex geometry time',
          description: '黄铜复杂几何时间',
          inputs: {
            material: 'brass',
            thickness: 5,
            length: 200,
            width: 100,
            quantity: 10
          },
          category: 'edge'
        }
      ]
    };
  });

  // 运行标准测试套件
  calculatorTestFramework.runTestSuite(testSuite);

  // 额外的专项测试
  describe('Time Calculation Logic Tests', () => {
    it('should calculate cutting time based on perimeter', () => {
      const inputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 验证时间计算包含切割路径长度因素
      const perimeter = 2 * (inputs.length + inputs.width);
      expect(result.totalTime).toBeGreaterThan(perimeter / 1000); // 至少基于周长的基础时间
    });

    it('should scale time with quantity correctly', () => {
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
      
      const singleResult = enhancedCalculationEngine.calculateTime(singleInputs);
      const multipleResult = enhancedCalculationEngine.calculateTime(multipleInputs);
      
      // 验证时间随数量正确缩放
      expect(multipleResult.totalTime).toBeCloseTo(singleResult.totalTime * 5, 1);
    });

    it('should account for material-specific cutting speeds', () => {
      const baseInputs = {
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const steelResult = enhancedCalculationEngine.calculateTime({
        ...baseInputs,
        material: 'steel'
      });
      
      const aluminumResult = enhancedCalculationEngine.calculateTime({
        ...baseInputs,
        material: 'aluminum'
      });
      
      const stainlessResult = enhancedCalculationEngine.calculateTime({
        ...baseInputs,
        material: 'stainless_steel'
      });
      
      // 不同材料应该有不同的切割时间
      // 铝材通常切割更快，不锈钢更慢
      expect(aluminumResult.totalTime).toBeLessThan(steelResult.totalTime);
      expect(stainlessResult.totalTime).toBeGreaterThan(steelResult.totalTime);
    });

    it('should increase time with thickness exponentially', () => {
      const thinInputs = {
        material: 'steel',
        thickness: 1,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const thickInputs = {
        ...thinInputs,
        thickness: 10
      };
      
      const thinResult = enhancedCalculationEngine.calculateTime(thinInputs);
      const thickResult = enhancedCalculationEngine.calculateTime(thickInputs);
      
      // 厚度增加应该导致时间显著增加（非线性关系）
      const thicknessRatio = thickInputs.thickness / thinInputs.thickness;
      const timeRatio = thickResult.totalTime / thinResult.totalTime;
      
      expect(timeRatio).toBeGreaterThan(thicknessRatio); // 时间增长应该超过厚度比例
    });
  });

  describe('Material-Specific Time Tests', () => {
    it('should handle aluminum fast cutting speeds', () => {
      const inputs = {
        material: 'aluminum',
        thickness: 2,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 铝材切割速度较快，时间应该相对较短
      expect(result.totalTime).toBeLessThan(10);
      expect(result.totalTime).toBeGreaterThan(1);
    });

    it('should handle stainless steel slower cutting', () => {
      const inputs = {
        material: 'stainless_steel',
        thickness: 5,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 不锈钢切割较慢，时间应该相对较长
      expect(result.totalTime).toBeGreaterThan(5);
    });

    it('should handle copper precision requirements', () => {
      const inputs = {
        material: 'copper',
        thickness: 2,
        length: 50,
        width: 50,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 铜材需要精密切割，时间应该考虑精度要求
      expect(result.totalTime).toBeGreaterThan(2);
    });
  });

  describe('Geometry Impact on Time', () => {
    it('should increase time with larger perimeter', () => {
      const smallInputs = {
        material: 'steel',
        thickness: 3,
        length: 50,
        width: 50,
        quantity: 1
      };
      
      const largeInputs = {
        ...smallInputs,
        length: 200,
        width: 200
      };
      
      const smallResult = enhancedCalculationEngine.calculateTime(smallInputs);
      const largeResult = enhancedCalculationEngine.calculateTime(largeInputs);
      
      // 更大的周长应该需要更多时间
      expect(largeResult.totalTime).toBeGreaterThan(smallResult.totalTime);
    });

    it('should handle complex aspect ratios', () => {
      const squareInputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const rectangleInputs = {
        ...squareInputs,
        length: 200,
        width: 50
      };
      
      const squareResult = enhancedCalculationEngine.calculateTime(squareInputs);
      const rectangleResult = enhancedCalculationEngine.calculateTime(rectangleInputs);
      
      // 相同面积但不同形状应该有相似的时间（周长相同）
      expect(Math.abs(rectangleResult.totalTime - squareResult.totalTime)).toBeLessThan(1);
    });

    it('should handle very thin strips', () => {
      const inputs = {
        material: 'steel',
        thickness: 1,
        length: 1000,
        width: 10,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 细长条应该需要相当的切割时间
      expect(result.totalTime).toBeGreaterThan(5);
    });
  });

  describe('Performance and Efficiency Tests', () => {
    it('should calculate time efficiently for large batches', () => {
      const inputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1000
      };
      
      const startTime = performance.now();
      const result = enhancedCalculationEngine.calculateTime(inputs);
      const endTime = performance.now();
      
      // 大批量时间计算应该快速完成
      expect(endTime - startTime).toBeLessThan(50);
      expect(result.totalTime).toBeGreaterThan(0);
    });

    it('should maintain precision with decimal inputs', () => {
      const inputs = {
        material: 'steel',
        thickness: 3.14159,
        length: 100.5,
        width: 99.7,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 应该能处理小数输入并保持精度
      expect(result.totalTime).toBeGreaterThan(0);
      expect(Number.isFinite(result.totalTime)).toBe(true);
      expect(result.totalTime % 1).not.toBe(0); // 应该有小数部分
    });

    it('should handle rapid successive time calculations', () => {
      const inputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const iterations = 500;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        enhancedCalculationEngine.calculateTime(inputs);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      // 平均每次时间计算应该在3ms内完成
      expect(avgTime).toBeLessThan(3);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum viable cutting time', () => {
      const inputs = {
        material: 'aluminum',
        thickness: 0.1,
        length: 1,
        width: 1,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 即使最小的切割也应该有合理的最小时间
      expect(result.totalTime).toBeGreaterThan(0.1);
      expect(result.totalTime).toBeLessThan(1);
    });

    it('should handle maximum practical cutting time', () => {
      const inputs = {
        material: 'stainless_steel',
        thickness: 20,
        length: 1000,
        width: 1000,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateTime(inputs);
      
      // 大型厚板应该需要相当长的时间
      expect(result.totalTime).toBeGreaterThan(60); // 至少1小时
    });

    it('should handle zero-area edge case gracefully', () => {
      // 这个测试验证错误处理
      const inputs = {
        material: 'steel',
        thickness: 3,
        length: 0.001,
        width: 0.001,
        quantity: 1
      };
      
      // 应该要么返回最小时间，要么抛出合理错误
      expect(() => {
        const result = enhancedCalculationEngine.calculateTime(inputs);
        if (result) {
          expect(result.totalTime).toBeGreaterThan(0);
        }
      }).not.toThrow();
    });
  });

  // 使用测试数据生成器的验证测试
  describe('Generated Test Data Time Validation', () => {
    it('should handle all performance test datasets', () => {
      const performanceDataSets = testDataGenerator.generatePerformanceTestData();
      
      performanceDataSets.forEach(dataSet => {
        const result = enhancedCalculationEngine.calculateTime(dataSet.inputs);
        
        // 验证时间计算的基本合理性
        expect(result.totalTime).toBeGreaterThan(0);
        expect(Number.isFinite(result.totalTime)).toBe(true);
        
        // 验证时间与输入参数的合理关系
        const area = dataSet.inputs.length * dataSet.inputs.width;
        const volume = area * dataSet.inputs.thickness;
        
        // 时间应该与体积有某种正相关关系
        expect(result.totalTime).toBeGreaterThan(volume / 100000); // 基础时间下限
      });
    });

    it('should maintain time consistency across similar inputs', () => {
      const baseInputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      // 多次计算相同输入应该得到一致结果
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(enhancedCalculationEngine.calculateTime(baseInputs));
      }
      
      // 所有结果应该完全一致
      const firstResult = results[0];
      results.forEach(result => {
        expect(result.totalTime).toBe(firstResult.totalTime);
      });
    });
  });
});
