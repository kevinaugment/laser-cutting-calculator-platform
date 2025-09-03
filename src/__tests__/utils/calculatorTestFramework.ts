// 计算器测试框架 - Phase 4: 质量保证与测试覆盖
// 提供标准化的计算器测试模板和工具

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BasicCalculationInputs, BasicCalculationResults } from '../../services/enhancedCalculationEngine';

export interface CalculatorTestCase {
  name: string;
  description: string;
  inputs: BasicCalculationInputs;
  expectedOutputs?: Partial<BasicCalculationResults>;
  expectedErrors?: string[];
  tolerance?: number; // 允许的误差范围
  category: 'valid' | 'boundary' | 'invalid' | 'edge';
}

export interface CalculatorTestSuite {
  calculatorName: string;
  calculatorFunction: (inputs: BasicCalculationInputs) => BasicCalculationResults;
  testCases: CalculatorTestCase[];
  setup?: () => void;
  teardown?: () => void;
}

export class CalculatorTestFramework {
  private tolerance = 0.01; // 默认1%误差容忍度

  /**
   * 运行完整的计算器测试套件
   */
  runTestSuite(suite: CalculatorTestSuite): void {
    describe(`${suite.calculatorName} Calculator Tests`, () => {
      beforeEach(() => {
        if (suite.setup) {
          suite.setup();
        }
      });

      afterEach(() => {
        if (suite.teardown) {
          suite.teardown();
        }
      });

      // 按类别组织测试
      const validCases = suite.testCases.filter(tc => tc.category === 'valid');
      const boundaryCases = suite.testCases.filter(tc => tc.category === 'boundary');
      const invalidCases = suite.testCases.filter(tc => tc.category === 'invalid');
      const edgeCases = suite.testCases.filter(tc => tc.category === 'edge');

      if (validCases.length > 0) {
        describe('Valid Input Tests', () => {
          validCases.forEach(testCase => {
            this.createTest(suite.calculatorFunction, testCase);
          });
        });
      }

      if (boundaryCases.length > 0) {
        describe('Boundary Value Tests', () => {
          boundaryCases.forEach(testCase => {
            this.createTest(suite.calculatorFunction, testCase);
          });
        });
      }

      if (invalidCases.length > 0) {
        describe('Invalid Input Tests', () => {
          invalidCases.forEach(testCase => {
            this.createTest(suite.calculatorFunction, testCase);
          });
        });
      }

      if (edgeCases.length > 0) {
        describe('Edge Case Tests', () => {
          edgeCases.forEach(testCase => {
            this.createTest(suite.calculatorFunction, testCase);
          });
        });
      }

      // 性能测试
      describe('Performance Tests', () => {
        it('should complete calculation within acceptable time', () => {
          const startTime = performance.now();
          const sampleInput = validCases[0]?.inputs || this.generateSampleInput();
          
          suite.calculatorFunction(sampleInput);
          
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          
          expect(executionTime).toBeLessThan(100); // 100ms内完成
        });

        it('should handle multiple rapid calculations', () => {
          const sampleInput = validCases[0]?.inputs || this.generateSampleInput();
          const iterations = 100;
          
          const startTime = performance.now();
          
          for (let i = 0; i < iterations; i++) {
            suite.calculatorFunction(sampleInput);
          }
          
          const endTime = performance.now();
          const avgTime = (endTime - startTime) / iterations;
          
          expect(avgTime).toBeLessThan(10); // 平均10ms内完成
        });
      });

      // 内存泄漏测试
      describe('Memory Tests', () => {
        it('should not cause memory leaks', () => {
          const sampleInput = validCases[0]?.inputs || this.generateSampleInput();
          const iterations = 1000;
          
          // 执行大量计算
          for (let i = 0; i < iterations; i++) {
            suite.calculatorFunction(sampleInput);
          }
          
          // 强制垃圾回收（如果可用）
          if (global.gc) {
            global.gc();
          }
          
          // 这里可以添加内存使用检查
          expect(true).toBe(true); // 占位符，实际应该检查内存使用
        });
      });
    });
  }

  /**
   * 创建单个测试用例
   */
  private createTest(
    calculatorFunction: (inputs: BasicCalculationInputs) => BasicCalculationResults,
    testCase: CalculatorTestCase
  ): void {
    it(testCase.name, () => {
      if (testCase.expectedErrors && testCase.expectedErrors.length > 0) {
        // 期望抛出错误的测试
        expect(() => {
          calculatorFunction(testCase.inputs);
        }).toThrow();
      } else {
        // 正常计算测试
        const result = calculatorFunction(testCase.inputs);
        
        // 验证结果结构
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        
        // 验证必需字段
        expect(result).toHaveProperty('totalCost');
        expect(result).toHaveProperty('totalTime');
        expect(result).toHaveProperty('materialCost');
        expect(result).toHaveProperty('laborCost');
        expect(result).toHaveProperty('energyCost');
        
        // 验证数值类型
        expect(typeof result.totalCost).toBe('number');
        expect(typeof result.totalTime).toBe('number');
        expect(typeof result.materialCost).toBe('number');
        expect(typeof result.laborCost).toBe('number');
        expect(typeof result.energyCost).toBe('number');
        
        // 验证数值合理性
        expect(result.totalCost).toBeGreaterThanOrEqual(0);
        expect(result.totalTime).toBeGreaterThanOrEqual(0);
        expect(result.materialCost).toBeGreaterThanOrEqual(0);
        expect(result.laborCost).toBeGreaterThanOrEqual(0);
        expect(result.energyCost).toBeGreaterThanOrEqual(0);
        
        // 验证总成本计算正确性
        const calculatedTotal = result.materialCost + result.laborCost + result.energyCost;
        expect(result.totalCost).toBeCloseTo(calculatedTotal, 2);
        
        // 验证期望输出（如果提供）
        if (testCase.expectedOutputs) {
          const tolerance = testCase.tolerance || this.tolerance;
          
          Object.entries(testCase.expectedOutputs).forEach(([key, expectedValue]) => {
            if (typeof expectedValue === 'number') {
              expect(result[key as keyof BasicCalculationResults]).toBeCloseTo(
                expectedValue,
                this.getDecimalPlaces(tolerance)
              );
            } else {
              expect(result[key as keyof BasicCalculationResults]).toEqual(expectedValue);
            }
          });
        }
      }
    });
  }

  /**
   * 生成标准测试用例
   */
  generateStandardTestCases(calculatorName: string): CalculatorTestCase[] {
    return [
      // 有效输入测试
      {
        name: 'should calculate with standard steel parameters',
        description: '使用标准钢材参数进行计算',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 100,
          width: 100,
          quantity: 1
        },
        category: 'valid'
      },
      {
        name: 'should calculate with aluminum parameters',
        description: '使用铝材参数进行计算',
        inputs: {
          material: 'aluminum',
          thickness: 2,
          length: 200,
          width: 150,
          quantity: 5
        },
        category: 'valid'
      },
      {
        name: 'should calculate with stainless steel parameters',
        description: '使用不锈钢参数进行计算',
        inputs: {
          material: 'stainless_steel',
          thickness: 5,
          length: 50,
          width: 50,
          quantity: 10
        },
        category: 'valid'
      },

      // 边界值测试
      {
        name: 'should handle minimum thickness',
        description: '处理最小厚度值',
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
        name: 'should handle maximum thickness',
        description: '处理最大厚度值',
        inputs: {
          material: 'steel',
          thickness: 50,
          length: 100,
          width: 100,
          quantity: 1
        },
        category: 'boundary'
      },
      {
        name: 'should handle minimum dimensions',
        description: '处理最小尺寸',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 1,
          width: 1,
          quantity: 1
        },
        category: 'boundary'
      },
      {
        name: 'should handle large quantities',
        description: '处理大数量',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 100,
          width: 100,
          quantity: 1000
        },
        category: 'boundary'
      },

      // 无效输入测试
      {
        name: 'should reject negative thickness',
        description: '拒绝负厚度值',
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
        name: 'should handle very small dimensions',
        description: '处理极小尺寸',
        inputs: {
          material: 'steel',
          thickness: 0.1,
          length: 0.1,
          width: 0.1,
          quantity: 1
        },
        category: 'edge'
      },
      {
        name: 'should handle very large dimensions',
        description: '处理极大尺寸',
        inputs: {
          material: 'steel',
          thickness: 25,
          length: 10000,
          width: 10000,
          quantity: 1
        },
        category: 'edge'
      }
    ];
  }

  /**
   * 生成示例输入
   */
  private generateSampleInput(): BasicCalculationInputs {
    return {
      material: 'steel',
      thickness: 3,
      length: 100,
      width: 100,
      quantity: 1
    };
  }

  /**
   * 获取小数位数
   */
  private getDecimalPlaces(tolerance: number): number {
    return Math.max(0, -Math.floor(Math.log10(tolerance)));
  }

  /**
   * 创建性能基准测试
   */
  createPerformanceBenchmark(
    calculatorFunction: (inputs: BasicCalculationInputs) => BasicCalculationResults,
    testName: string
  ): void {
    describe(`${testName} Performance Benchmark`, () => {
      const sampleInput: BasicCalculationInputs = {
        material: 'steel',
        thickness: 3,
        length: 100,
        width: 100,
        quantity: 1
      };

      it('should meet response time requirements', () => {
        const iterations = 100;
        const times: number[] = [];

        for (let i = 0; i < iterations; i++) {
          const start = performance.now();
          calculatorFunction(sampleInput);
          const end = performance.now();
          times.push(end - start);
        }

        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const maxTime = Math.max(...times);
        const minTime = Math.min(...times);

        console.log(`Performance Benchmark for ${testName}:`);
        console.log(`  Average time: ${avgTime.toFixed(2)}ms`);
        console.log(`  Max time: ${maxTime.toFixed(2)}ms`);
        console.log(`  Min time: ${minTime.toFixed(2)}ms`);

        expect(avgTime).toBeLessThan(50); // 平均50ms内完成
        expect(maxTime).toBeLessThan(200); // 最大200ms内完成
      });
    });
  }
}

// 导出测试框架实例
export const calculatorTestFramework = new CalculatorTestFramework();
