// 测试数据生成器 - Phase 4: 质量保证与测试覆盖
// 为计算器测试提供标准化的测试数据

import { BasicCalculationInputs } from '../../services/enhancedCalculationEngine';
import { GeometryShape } from '../../services/geometryCalculator';

export interface TestDataSet {
  name: string;
  description: string;
  inputs: BasicCalculationInputs;
  expectedRange?: {
    minCost: number;
    maxCost: number;
    minTime: number;
    maxTime: number;
  };
}

export class TestDataGenerator {
  private materials = ['steel', 'aluminum', 'stainless_steel', 'copper', 'brass'];
  private thicknessRanges = {
    steel: { min: 0.5, max: 25 },
    aluminum: { min: 0.5, max: 12 },
    stainless_steel: { min: 0.5, max: 20 },
    copper: { min: 0.5, max: 8 },
    brass: { min: 0.5, max: 10 }
  };

  /**
   * 生成标准测试数据集
   */
  generateStandardDataSets(): TestDataSet[] {
    return [
      // 小型零件测试数据
      {
        name: 'Small Steel Part',
        description: '小型钢制零件',
        inputs: {
          material: 'steel',
          thickness: 2,
          length: 50,
          width: 30,
          quantity: 1
        },
        expectedRange: {
          minCost: 5,
          maxCost: 20,
          minTime: 2,
          maxTime: 10
        }
      },
      
      // 中型零件测试数据
      {
        name: 'Medium Aluminum Plate',
        description: '中型铝板',
        inputs: {
          material: 'aluminum',
          thickness: 5,
          length: 200,
          width: 150,
          quantity: 1
        },
        expectedRange: {
          minCost: 20,
          maxCost: 80,
          minTime: 10,
          maxTime: 30
        }
      },
      
      // 大型零件测试数据
      {
        name: 'Large Stainless Steel Sheet',
        description: '大型不锈钢板',
        inputs: {
          material: 'stainless_steel',
          thickness: 8,
          length: 500,
          width: 400,
          quantity: 1
        },
        expectedRange: {
          minCost: 100,
          maxCost: 300,
          minTime: 30,
          maxTime: 90
        }
      },
      
      // 批量生产测试数据
      {
        name: 'Batch Production Steel Parts',
        description: '批量生产钢制零件',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 100,
          width: 100,
          quantity: 50
        },
        expectedRange: {
          minCost: 200,
          maxCost: 800,
          minTime: 100,
          maxTime: 400
        }
      },
      
      // 精密零件测试数据
      {
        name: 'Precision Copper Component',
        description: '精密铜制组件',
        inputs: {
          material: 'copper',
          thickness: 1,
          length: 25,
          width: 25,
          quantity: 10
        },
        expectedRange: {
          minCost: 50,
          maxCost: 150,
          minTime: 20,
          maxTime: 60
        }
      }
    ];
  }

  /**
   * 生成边界值测试数据
   */
  generateBoundaryTestData(): TestDataSet[] {
    return [
      // 最小值边界
      {
        name: 'Minimum Values',
        description: '最小值边界测试',
        inputs: {
          material: 'steel',
          thickness: 0.1,
          length: 1,
          width: 1,
          quantity: 1
        }
      },
      
      // 最大值边界
      {
        name: 'Maximum Steel Thickness',
        description: '钢材最大厚度',
        inputs: {
          material: 'steel',
          thickness: 25,
          length: 1000,
          width: 1000,
          quantity: 1
        }
      },
      
      // 铝材边界
      {
        name: 'Maximum Aluminum Thickness',
        description: '铝材最大厚度',
        inputs: {
          material: 'aluminum',
          thickness: 12,
          length: 500,
          width: 500,
          quantity: 1
        }
      },
      
      // 大批量边界
      {
        name: 'Large Quantity',
        description: '大批量边界测试',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 100,
          width: 100,
          quantity: 1000
        }
      }
    ];
  }

  /**
   * 生成无效输入测试数据
   */
  generateInvalidTestData(): Array<{
    name: string;
    description: string;
    inputs: any;
    expectedError: string;
  }> {
    return [
      {
        name: 'Negative Thickness',
        description: '负厚度值',
        inputs: {
          material: 'steel',
          thickness: -1,
          length: 100,
          width: 100,
          quantity: 1
        },
        expectedError: 'thickness must be positive'
      },
      
      {
        name: 'Zero Length',
        description: '零长度',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 0,
          width: 100,
          quantity: 1
        },
        expectedError: 'length must be positive'
      },
      
      {
        name: 'Zero Width',
        description: '零宽度',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 100,
          width: 0,
          quantity: 1
        },
        expectedError: 'width must be positive'
      },
      
      {
        name: 'Zero Quantity',
        description: '零数量',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 100,
          width: 100,
          quantity: 0
        },
        expectedError: 'quantity must be positive'
      },
      
      {
        name: 'Invalid Material',
        description: '无效材料',
        inputs: {
          material: 'invalid_material',
          thickness: 3,
          length: 100,
          width: 100,
          quantity: 1
        },
        expectedError: 'invalid material type'
      },
      
      {
        name: 'Excessive Thickness for Aluminum',
        description: '铝材厚度超限',
        inputs: {
          material: 'aluminum',
          thickness: 50,
          length: 100,
          width: 100,
          quantity: 1
        },
        expectedError: 'thickness exceeds material limit'
      }
    ];
  }

  /**
   * 生成随机测试数据
   */
  generateRandomTestData(count: number = 10): TestDataSet[] {
    const testData: TestDataSet[] = [];
    
    for (let i = 0; i < count; i++) {
      const material = this.getRandomMaterial();
      const thickness = this.getRandomThickness(material);
      const length = this.getRandomDimension(10, 1000);
      const width = this.getRandomDimension(10, 1000);
      const quantity = this.getRandomQuantity();
      
      testData.push({
        name: `Random Test ${i + 1}`,
        description: `随机测试数据 ${i + 1}`,
        inputs: {
          material,
          thickness,
          length,
          width,
          quantity
        }
      });
    }
    
    return testData;
  }

  /**
   * 生成几何形状测试数据
   */
  generateGeometryTestData(): Array<{
    name: string;
    shape: GeometryShape;
    expectedArea?: number;
    expectedPerimeter?: number;
  }> {
    return [
      {
        name: 'Rectangle 100x50',
        shape: {
          type: 'rectangle',
          dimensions: { width: 100, height: 50 }
        },
        expectedArea: 5000,
        expectedPerimeter: 300
      },
      
      {
        name: 'Circle Radius 25',
        shape: {
          type: 'circle',
          dimensions: { radius: 25 }
        },
        expectedArea: Math.PI * 25 * 25,
        expectedPerimeter: 2 * Math.PI * 25
      },
      
      {
        name: 'Ellipse 40x30',
        shape: {
          type: 'ellipse',
          dimensions: { majorAxis: 40, minorAxis: 30 }
        },
        expectedArea: Math.PI * 20 * 15
      },
      
      {
        name: 'Rectangle with Circular Hole',
        shape: {
          type: 'rectangle',
          dimensions: { width: 100, height: 100 },
          holes: [{
            type: 'circle',
            dimensions: { radius: 10 }
          }]
        },
        expectedArea: 10000 - Math.PI * 100
      }
    ];
  }

  /**
   * 生成性能测试数据
   */
  generatePerformanceTestData(): TestDataSet[] {
    return [
      // 快速计算测试
      {
        name: 'Quick Calculation',
        description: '快速计算测试',
        inputs: {
          material: 'steel',
          thickness: 3,
          length: 100,
          width: 100,
          quantity: 1
        }
      },
      
      // 复杂计算测试
      {
        name: 'Complex Calculation',
        description: '复杂计算测试',
        inputs: {
          material: 'stainless_steel',
          thickness: 15,
          length: 2000,
          width: 1500,
          quantity: 100
        }
      },
      
      // 极限计算测试
      {
        name: 'Extreme Calculation',
        description: '极限计算测试',
        inputs: {
          material: 'copper',
          thickness: 8,
          length: 5000,
          width: 3000,
          quantity: 1000
        }
      }
    ];
  }

  /**
   * 生成压力测试数据
   */
  generateStressTestData(): TestDataSet[] {
    const stressData: TestDataSet[] = [];
    
    // 生成大量不同的测试用例
    for (let i = 0; i < 100; i++) {
      stressData.push({
        name: `Stress Test ${i + 1}`,
        description: `压力测试 ${i + 1}`,
        inputs: {
          material: this.getRandomMaterial(),
          thickness: this.getRandomThickness(),
          length: this.getRandomDimension(50, 2000),
          width: this.getRandomDimension(50, 2000),
          quantity: this.getRandomQuantity(1, 500)
        }
      });
    }
    
    return stressData;
  }

  // 私有辅助方法
  private getRandomMaterial(): string {
    return this.materials[Math.floor(Math.random() * this.materials.length)];
  }

  private getRandomThickness(material?: string): number {
    if (material && this.thicknessRanges[material as keyof typeof this.thicknessRanges]) {
      const range = this.thicknessRanges[material as keyof typeof this.thicknessRanges];
      return Math.round((Math.random() * (range.max - range.min) + range.min) * 10) / 10;
    }
    return Math.round((Math.random() * 24.5 + 0.5) * 10) / 10;
  }

  private getRandomDimension(min: number = 1, max: number = 1000): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  private getRandomQuantity(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * 验证测试数据的有效性
   */
  validateTestData(inputs: BasicCalculationInputs): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!inputs.material || !this.materials.includes(inputs.material)) {
      errors.push('Invalid material');
    }

    if (inputs.thickness <= 0) {
      errors.push('Thickness must be positive');
    }

    if (inputs.length <= 0) {
      errors.push('Length must be positive');
    }

    if (inputs.width <= 0) {
      errors.push('Width must be positive');
    }

    if (inputs.quantity <= 0) {
      errors.push('Quantity must be positive');
    }

    // 检查材料厚度限制
    if (inputs.material && this.thicknessRanges[inputs.material as keyof typeof this.thicknessRanges]) {
      const range = this.thicknessRanges[inputs.material as keyof typeof this.thicknessRanges];
      if (inputs.thickness > range.max) {
        errors.push(`Thickness exceeds ${inputs.material} limit of ${range.max}mm`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 生成测试报告数据
   */
  generateTestReportData() {
    return {
      standardTests: this.generateStandardDataSets().length,
      boundaryTests: this.generateBoundaryTestData().length,
      invalidTests: this.generateInvalidTestData().length,
      performanceTests: this.generatePerformanceTestData().length,
      totalTestCases: this.generateStandardDataSets().length + 
                     this.generateBoundaryTestData().length + 
                     this.generateInvalidTestData().length + 
                     this.generatePerformanceTestData().length,
      materials: this.materials,
      thicknessRanges: this.thicknessRanges
    };
  }
}

// 导出测试数据生成器实例
export const testDataGenerator = new TestDataGenerator();
