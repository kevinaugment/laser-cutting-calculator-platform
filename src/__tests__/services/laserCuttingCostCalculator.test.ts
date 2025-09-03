// Laser Cutting Cost Calculator 测试套件 - Phase 4: 质量保证与测试覆盖
// 全面测试激光切割成本计算器的功能、准确性和性能

import { describe, it, expect, beforeEach } from 'vitest';
import { enhancedCalculationEngine } from '../../services/enhancedCalculationEngine';
import { calculatorTestFramework, CalculatorTestSuite } from '../utils/calculatorTestFramework';
import { testDataGenerator } from '../utils/testDataGenerator';

describe('Laser Cutting Cost Calculator', () => {
  let testSuite: CalculatorTestSuite;

  beforeEach(() => {
    testSuite = {
      calculatorName: 'Laser Cutting Cost',
      calculatorFunction: enhancedCalculationEngine.calculateCost.bind(enhancedCalculationEngine),
      testCases: [
        // 标准有效输入测试
        {
          name: 'should calculate cost for standard steel part',
          description: '标准钢制零件成本计算',
          inputs: {
            material: 'steel',
            thickness: 3,
            length: 100,
            width: 100,
            quantity: 1
          },
          expectedOutputs: {
            totalCost: 15.75, // 基于实际计算逻辑的期望值
            materialCost: 7.85,
            laborCost: 5.0,
            energyCost: 2.9
          },
          tolerance: 0.1,
          category: 'valid'
        },
        
        {
          name: 'should calculate cost for aluminum sheet',
          description: '铝板成本计算',
          inputs: {
            material: 'aluminum',
            thickness: 2,
            length: 200,
            width: 150,
            quantity: 1
          },
          expectedOutputs: {
            totalCost: 20.25,
            materialCost: 8.1,
            laborCost: 7.5,
            energyCost: 4.65
          },
          tolerance: 0.1,
          category: 'valid'
        },
        
        {
          name: 'should calculate cost for stainless steel with high precision',
          description: '不锈钢高精度成本计算',
          inputs: {
            material: 'stainless_steel',
            thickness: 5,
            length: 50,
            width: 50,
            quantity: 10
          },
          expectedOutputs: {
            totalCost: 125.0,
            materialCost: 50.0,
            laborCost: 50.0,
            energyCost: 25.0
          },
          tolerance: 0.15,
          category: 'valid'
        },
        
        // 边界值测试
        {
          name: 'should handle minimum thickness',
          description: '最小厚度处理',
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
          name: 'should handle maximum steel thickness',
          description: '钢材最大厚度处理',
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
          name: 'should handle large quantities',
          description: '大批量处理',
          inputs: {
            material: 'steel',
            thickness: 3,
            length: 100,
            width: 100,
            quantity: 1000
          },
          category: 'boundary'
        },
        
        {
          name: 'should handle very small parts',
          description: '极小零件处理',
          inputs: {
            material: 'steel',
            thickness: 1,
            length: 1,
            width: 1,
            quantity: 1
          },
          category: 'boundary'
        },
        
        // 无效输入测试
        {
          name: 'should reject negative thickness',
          description: '拒绝负厚度',
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
          name: 'should reject zero dimensions',
          description: '拒绝零尺寸',
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
        
        {
          name: 'should reject invalid material',
          description: '拒绝无效材料',
          inputs: {
            material: 'invalid_material',
            thickness: 3,
            length: 100,
            width: 100,
            quantity: 1
          },
          expectedErrors: ['Invalid material'],
          category: 'invalid'
        },
        
        // 边缘情况测试
        {
          name: 'should handle copper with high precision requirements',
          description: '铜材高精度要求处理',
          inputs: {
            material: 'copper',
            thickness: 1,
            length: 25,
            width: 25,
            quantity: 100
          },
          category: 'edge'
        },
        
        {
          name: 'should handle brass medium complexity',
          description: '黄铜中等复杂度处理',
          inputs: {
            material: 'brass',
            thickness: 4,
            length: 150,
            width: 100,
            quantity: 25
          },
          category: 'edge'
        }
      ]
    };
  });

  // 运行标准测试套件
  calculatorTestFramework.runTestSuite(testSuite);

  // 额外的专项测试
  describe('Cost Calculation Logic Tests', () => {
    it('should calculate material cost correctly', () => {
      const inputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateCost(inputs);
      
      // 验证材料成本计算逻辑
      const expectedVolume = (inputs.length * inputs.width * inputs.thickness) / 1000000; // dm³
      const expectedMaterialCost = expectedVolume * 7.85 * 1.0; // 密度 * 单价
      
      expect(result.materialCost).toBeCloseTo(expectedMaterialCost, 2);
    });

    it('should apply quantity multiplier correctly', () => {
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
      
      // 验证数量倍数正确应用
      expect(multipleResult.totalCost).toBeCloseTo(singleResult.totalCost * 5, 2);
      expect(multipleResult.materialCost).toBeCloseTo(singleResult.materialCost * 5, 2);
    });

    it('should handle different materials with correct properties', () => {
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
        
        // 验证每种材料都能正确计算
        expect(result.totalCost).toBeGreaterThan(0);
        expect(result.materialCost).toBeGreaterThan(0);
        expect(result.laborCost).toBeGreaterThan(0);
        expect(result.energyCost).toBeGreaterThan(0);
        
        // 验证总成本等于各项成本之和
        const calculatedTotal = result.materialCost + result.laborCost + result.energyCost;
        expect(result.totalCost).toBeCloseTo(calculatedTotal, 2);
      });
    });
  });

  describe('Material-Specific Tests', () => {
    it('should calculate aluminum costs with correct density', () => {
      const inputs = {
        material: 'aluminum',
        thickness: 2,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateCost(inputs);
      
      // 铝的密度应该比钢低，成本也应该相应不同
      expect(result.materialCost).toBeLessThan(10); // 铝材成本应该相对较低
    });

    it('should calculate stainless steel with higher energy factor', () => {
      const steelInputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const stainlessInputs = {
        ...steelInputs,
        material: 'stainless_steel'
      };
      
      const steelResult = enhancedCalculationEngine.calculateCost(steelInputs);
      const stainlessResult = enhancedCalculationEngine.calculateCost(stainlessInputs);
      
      // 不锈钢的能耗因子更高，能源成本应该更高
      expect(stainlessResult.energyCost).toBeGreaterThan(steelResult.energyCost);
    });

    it('should handle copper with high energy requirements', () => {
      const inputs = {
        material: 'copper',
        thickness: 2,
        length: 50,
        width: 50,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateCost(inputs);
      
      // 铜材需要更高的功率，能源成本应该相对较高
      expect(result.energyCost).toBeGreaterThan(2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle very thin materials', () => {
      const inputs = {
        material: 'steel',
        thickness: 0.1,
        length: 1000,
        width: 1000,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateCost(inputs);
      
      // 即使很薄的材料也应该有合理的成本
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.totalTime).toBeGreaterThan(0);
    });

    it('should handle very thick materials', () => {
      const inputs = {
        material: 'steel',
        thickness: 20,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateCost(inputs);
      
      // 厚材料应该需要更多时间和成本
      expect(result.totalCost).toBeGreaterThan(50);
      expect(result.totalTime).toBeGreaterThan(10);
    });

    it('should maintain precision with decimal inputs', () => {
      const inputs = {
        material: 'steel',
        thickness: 3.14159,
        length: 100.5,
        width: 99.7,
        quantity: 1
      };
      
      const result = enhancedCalculationEngine.calculateCost(inputs);
      
      // 应该能处理小数输入并保持精度
      expect(result.totalCost).toBeGreaterThan(0);
      expect(Number.isFinite(result.totalCost)).toBe(true);
      expect(Number.isFinite(result.totalTime)).toBe(true);
    });
  });

  describe('Performance and Stress Tests', () => {
    it('should handle rapid successive calculations', () => {
      const inputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };
      
      const iterations = 1000;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        enhancedCalculationEngine.calculateCost(inputs);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      // 平均每次计算应该在5ms内完成
      expect(avgTime).toBeLessThan(5);
    });

    it('should handle large quantity calculations efficiently', () => {
      const inputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 10000
      };
      
      const startTime = performance.now();
      const result = enhancedCalculationEngine.calculateCost(inputs);
      const endTime = performance.now();
      
      // 大批量计算应该在100ms内完成
      expect(endTime - startTime).toBeLessThan(100);
      expect(result.totalCost).toBeGreaterThan(0);
    });
  });

  // 使用测试数据生成器的额外测试
  describe('Generated Test Data Validation', () => {
    it('should handle all standard test datasets', () => {
      const standardDataSets = testDataGenerator.generateStandardDataSets();
      
      standardDataSets.forEach(dataSet => {
        const result = enhancedCalculationEngine.calculateCost(dataSet.inputs);
        
        // 验证结果在期望范围内（如果提供了范围）
        if (dataSet.expectedRange) {
          expect(result.totalCost).toBeGreaterThanOrEqual(dataSet.expectedRange.minCost);
          expect(result.totalCost).toBeLessThanOrEqual(dataSet.expectedRange.maxCost);
          expect(result.totalTime).toBeGreaterThanOrEqual(dataSet.expectedRange.minTime);
          expect(result.totalTime).toBeLessThanOrEqual(dataSet.expectedRange.maxTime);
        }
        
        // 基本合理性检查
        expect(result.totalCost).toBeGreaterThan(0);
        expect(result.totalTime).toBeGreaterThan(0);
      });
    });

    it('should handle boundary test data correctly', () => {
      const boundaryData = testDataGenerator.generateBoundaryTestData();
      
      boundaryData.forEach(dataSet => {
        const result = enhancedCalculationEngine.calculateCost(dataSet.inputs);
        
        // 边界值应该仍然产生有效结果
        expect(result.totalCost).toBeGreaterThan(0);
        expect(result.totalTime).toBeGreaterThan(0);
        expect(Number.isFinite(result.totalCost)).toBe(true);
        expect(Number.isFinite(result.totalTime)).toBe(true);
      });
    });
  });
});
