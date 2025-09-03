// 几何形状计算器 - Phase 3: 功能增强与扩展
// 支持复杂几何形状的激光切割计算

export interface GeometryShape {
  type: 'rectangle' | 'circle' | 'ellipse' | 'polygon' | 'custom';
  dimensions: Record<string, number>;
  holes?: GeometryShape[];
}

export interface CuttingPath {
  totalLength: number; // mm
  pierceCount: number;
  cornerCount: number;
  curveLength: number; // mm
  straightLength: number; // mm
  complexity: number; // 1-5
}

export interface GeometryCalculationResult {
  area: number; // mm²
  perimeter: number; // mm
  cuttingPath: CuttingPath;
  materialUtilization: number; // %
  estimatedTime: number; // minutes
  complexity: 'simple' | 'medium' | 'complex' | 'very_complex';
}

export class GeometryCalculator {
  
  /**
   * 计算矩形
   */
  calculateRectangle(width: number, height: number, holes: GeometryShape[] = []): GeometryCalculationResult {
    const area = width * height;
    const perimeter = 2 * (width + height);
    
    // 计算孔的影响
    let holeArea = 0;
    let holePerimeter = 0;
    let holePierces = 0;
    
    holes.forEach(hole => {
      const holeResult = this.calculateShape(hole);
      holeArea += holeResult.area;
      holePerimeter += holeResult.perimeter;
      holePierces += 1;
    });
    
    const netArea = area - holeArea;
    const totalPerimeter = perimeter + holePerimeter;
    
    const cuttingPath: CuttingPath = {
      totalLength: totalPerimeter,
      pierceCount: 1 + holePierces,
      cornerCount: 4 + holes.length * 4, // 假设孔也是矩形
      curveLength: 0,
      straightLength: totalPerimeter,
      complexity: holes.length > 0 ? 2 : 1
    };
    
    return {
      area: netArea,
      perimeter: totalPerimeter,
      cuttingPath,
      materialUtilization: 100, // 单个零件时为100%
      estimatedTime: this.estimateCuttingTime(cuttingPath),
      complexity: this.getComplexityLevel(cuttingPath.complexity)
    };
  }
  
  /**
   * 计算圆形
   */
  calculateCircle(radius: number, holes: GeometryShape[] = []): GeometryCalculationResult {
    const area = Math.PI * radius * radius;
    const perimeter = 2 * Math.PI * radius;
    
    // 计算孔的影响
    let holeArea = 0;
    let holePerimeter = 0;
    let holePierces = 0;
    
    holes.forEach(hole => {
      const holeResult = this.calculateShape(hole);
      holeArea += holeResult.area;
      holePerimeter += holeResult.perimeter;
      holePierces += 1;
    });
    
    const netArea = area - holeArea;
    const totalPerimeter = perimeter + holePerimeter;
    
    const cuttingPath: CuttingPath = {
      totalLength: totalPerimeter,
      pierceCount: 1 + holePierces,
      cornerCount: 0,
      curveLength: perimeter,
      straightLength: holePerimeter, // 假设孔是直线
      complexity: 2 + holes.length * 0.5
    };
    
    return {
      area: netArea,
      perimeter: totalPerimeter,
      cuttingPath,
      materialUtilization: 100,
      estimatedTime: this.estimateCuttingTime(cuttingPath),
      complexity: this.getComplexityLevel(cuttingPath.complexity)
    };
  }
  
  /**
   * 计算椭圆
   */
  calculateEllipse(majorAxis: number, minorAxis: number, holes: GeometryShape[] = []): GeometryCalculationResult {
    const a = majorAxis / 2;
    const b = minorAxis / 2;
    
    // 椭圆面积
    const area = Math.PI * a * b;
    
    // 椭圆周长近似计算 (Ramanujan's approximation)
    const h = Math.pow((a - b) / (a + b), 2);
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    
    // 计算孔的影响
    let holeArea = 0;
    let holePerimeter = 0;
    let holePierces = 0;
    
    holes.forEach(hole => {
      const holeResult = this.calculateShape(hole);
      holeArea += holeResult.area;
      holePerimeter += holeResult.perimeter;
      holePierces += 1;
    });
    
    const netArea = area - holeArea;
    const totalPerimeter = perimeter + holePerimeter;
    
    const cuttingPath: CuttingPath = {
      totalLength: totalPerimeter,
      pierceCount: 1 + holePierces,
      cornerCount: 0,
      curveLength: perimeter,
      straightLength: holePerimeter,
      complexity: 2.5 + holes.length * 0.5
    };
    
    return {
      area: netArea,
      perimeter: totalPerimeter,
      cuttingPath,
      materialUtilization: 100,
      estimatedTime: this.estimateCuttingTime(cuttingPath),
      complexity: this.getComplexityLevel(cuttingPath.complexity)
    };
  }
  
  /**
   * 计算多边形
   */
  calculatePolygon(vertices: Array<{x: number, y: number}>, holes: GeometryShape[] = []): GeometryCalculationResult {
    if (vertices.length < 3) {
      throw new Error('Polygon must have at least 3 vertices');
    }
    
    // 使用鞋带公式计算面积
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }
    area = Math.abs(area) / 2;
    
    // 计算周长
    let perimeter = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      const dx = vertices[j].x - vertices[i].x;
      const dy = vertices[j].y - vertices[i].y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    
    // 计算孔的影响
    let holeArea = 0;
    let holePerimeter = 0;
    let holePierces = 0;
    
    holes.forEach(hole => {
      const holeResult = this.calculateShape(hole);
      holeArea += holeResult.area;
      holePerimeter += holeResult.perimeter;
      holePierces += 1;
    });
    
    const netArea = area - holeArea;
    const totalPerimeter = perimeter + holePerimeter;
    
    const cuttingPath: CuttingPath = {
      totalLength: totalPerimeter,
      pierceCount: 1 + holePierces,
      cornerCount: vertices.length,
      curveLength: 0,
      straightLength: totalPerimeter,
      complexity: 1 + vertices.length * 0.1 + holes.length * 0.5
    };
    
    return {
      area: netArea,
      perimeter: totalPerimeter,
      cuttingPath,
      materialUtilization: 100,
      estimatedTime: this.estimateCuttingTime(cuttingPath),
      complexity: this.getComplexityLevel(cuttingPath.complexity)
    };
  }
  
  /**
   * 通用形状计算
   */
  calculateShape(shape: GeometryShape): GeometryCalculationResult {
    switch (shape.type) {
      case 'rectangle':
        return this.calculateRectangle(
          shape.dimensions.width,
          shape.dimensions.height,
          shape.holes
        );
      case 'circle':
        return this.calculateCircle(shape.dimensions.radius, shape.holes);
      case 'ellipse':
        return this.calculateEllipse(
          shape.dimensions.majorAxis,
          shape.dimensions.minorAxis,
          shape.holes
        );
      case 'polygon':
        // 需要从dimensions中提取顶点信息
        const vertices = this.extractVertices(shape.dimensions);
        return this.calculatePolygon(vertices, shape.holes);
      default:
        throw new Error(`Unsupported shape type: ${shape.type}`);
    }
  }
  
  /**
   * 批量计算多个形状
   */
  calculateBatch(shapes: GeometryShape[]): {
    individual: GeometryCalculationResult[];
    total: {
      totalArea: number;
      totalPerimeter: number;
      totalPierces: number;
      totalTime: number;
      averageComplexity: number;
    };
  } {
    const individual = shapes.map(shape => this.calculateShape(shape));
    
    const total = {
      totalArea: individual.reduce((sum, result) => sum + result.area, 0),
      totalPerimeter: individual.reduce((sum, result) => sum + result.perimeter, 0),
      totalPierces: individual.reduce((sum, result) => sum + result.cuttingPath.pierceCount, 0),
      totalTime: individual.reduce((sum, result) => sum + result.estimatedTime, 0),
      averageComplexity: individual.reduce((sum, result) => sum + result.cuttingPath.complexity, 0) / individual.length
    };
    
    return { individual, total };
  }
  
  /**
   * 嵌套优化计算
   */
  calculateNesting(shapes: GeometryShape[], sheetWidth: number, sheetHeight: number): {
    layout: Array<{
      shape: GeometryShape;
      position: {x: number, y: number};
      rotation: number;
    }>;
    utilization: number;
    wasteArea: number;
    sheetsRequired: number;
  } {
    // 简化的嵌套算法 - 实际应用中需要更复杂的算法
    const sheetArea = sheetWidth * sheetHeight;
    const totalShapeArea = shapes.reduce((sum, shape) => {
      const result = this.calculateShape(shape);
      return sum + result.area;
    }, 0);
    
    const sheetsRequired = Math.ceil(totalShapeArea / (sheetArea * 0.8)); // 假设80%利用率
    const utilization = (totalShapeArea / (sheetsRequired * sheetArea)) * 100;
    const wasteArea = (sheetsRequired * sheetArea) - totalShapeArea;
    
    // 简化的布局 - 实际需要复杂的嵌套算法
    const layout = shapes.map((shape, index) => ({
      shape,
      position: { x: (index % 3) * 100, y: Math.floor(index / 3) * 100 },
      rotation: 0
    }));
    
    return {
      layout,
      utilization: Math.round(utilization * 100) / 100,
      wasteArea: Math.round(wasteArea),
      sheetsRequired
    };
  }
  
  // 私有辅助方法
  private estimateCuttingTime(cuttingPath: CuttingPath): number {
    // 基础切割时间估算
    const straightTime = cuttingPath.straightLength / 1000; // 假设1000mm/min
    const curveTime = cuttingPath.curveLength / 800; // 曲线稍慢
    const pierceTime = cuttingPath.pierceCount * 0.5; // 每个穿孔0.5分钟
    const cornerTime = cuttingPath.cornerCount * 0.1; // 每个转角0.1分钟
    
    return Math.round((straightTime + curveTime + pierceTime + cornerTime) * 100) / 100;
  }
  
  private getComplexityLevel(complexity: number): 'simple' | 'medium' | 'complex' | 'very_complex' {
    if (complexity <= 1.5) return 'simple';
    if (complexity <= 2.5) return 'medium';
    if (complexity <= 4) return 'complex';
    return 'very_complex';
  }
  
  private extractVertices(dimensions: Record<string, number>): Array<{x: number, y: number}> {
    // 从dimensions中提取顶点信息
    // 这里需要根据实际的数据格式来实现
    const vertices: Array<{x: number, y: number}> = [];
    
    // 示例：假设dimensions包含x1,y1,x2,y2...格式的顶点
    let i = 1;
    while (dimensions[`x${i}`] !== undefined && dimensions[`y${i}`] !== undefined) {
      vertices.push({
        x: dimensions[`x${i}`],
        y: dimensions[`y${i}`]
      });
      i++;
    }
    
    return vertices;
  }
}

// 导出几何计算器实例
export const geometryCalculator = new GeometryCalculator();
