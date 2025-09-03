// 数据导入导出服务 - Phase 3: 功能增强与扩展
// 支持Excel、CSV、PDF等多种格式的数据导入导出

import { BasicCalculationResults } from './enhancedCalculationEngine';
import { GeometryCalculationResult } from './geometryCalculator';

export interface ExportData {
  projectName: string;
  timestamp: Date;
  calculations: Array<{
    calculatorType: string;
    inputs: Record<string, any>;
    results: BasicCalculationResults | GeometryCalculationResult;
    notes?: string;
  }>;
  summary: {
    totalCost: number;
    totalTime: number;
    materialCount: number;
    averageUtilization: number;
  };
}

export interface ImportTemplate {
  headers: string[];
  requiredFields: string[];
  optionalFields: string[];
  dataTypes: Record<string, 'number' | 'string' | 'boolean'>;
  validationRules: Record<string, any>;
}

export interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf' | 'json';
  includeCharts: boolean;
  includeImages: boolean;
  template: 'standard' | 'detailed' | 'summary';
  customFields?: string[];
}

export class DataExportService {
  
  /**
   * 导出为Excel格式
   */
  async exportToExcel(data: ExportData, options: ExportOptions = { 
    format: 'excel', 
    includeCharts: true, 
    includeImages: false, 
    template: 'standard' 
  }): Promise<Blob> {
    // 创建工作簿数据
    const workbookData = this.prepareExcelData(data, options);
    
    // 使用简化的Excel生成逻辑
    const csvContent = this.generateCSVContent(workbookData);
    
    // 在实际应用中，这里应该使用如 xlsx 库来生成真正的Excel文件
    const blob = new Blob([csvContent], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    return blob;
  }
  
  /**
   * 导出为CSV格式
   */
  async exportToCSV(data: ExportData, options: ExportOptions = { 
    format: 'csv', 
    includeCharts: false, 
    includeImages: false, 
    template: 'standard' 
  }): Promise<Blob> {
    const csvData = this.prepareCSVData(data, options);
    const csvContent = this.generateCSVContent(csvData);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return blob;
  }
  
  /**
   * 导出为PDF格式
   */
  async exportToPDF(data: ExportData, options: ExportOptions = { 
    format: 'pdf', 
    includeCharts: true, 
    includeImages: true, 
    template: 'detailed' 
  }): Promise<Blob> {
    // 生成HTML内容
    const htmlContent = this.generateHTMLReport(data, options);
    
    // 在实际应用中，这里应该使用如 jsPDF 或 puppeteer 来生成PDF
    // 现在返回HTML作为示例
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return blob;
  }
  
  /**
   * 导出为JSON格式
   */
  async exportToJSON(data: ExportData): Promise<Blob> {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    return blob;
  }
  
  /**
   * 从CSV导入数据
   */
  async importFromCSV(file: File, template: ImportTemplate): Promise<{
    success: boolean;
    data: any[];
    errors: string[];
    warnings: string[];
  }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csvContent = event.target?.result as string;
          const result = this.parseCSVContent(csvContent, template);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            data: [],
            errors: [`Failed to parse CSV: ${error}`],
            warnings: []
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          data: [],
          errors: ['Failed to read file'],
          warnings: []
        });
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * 获取导入模板
   */
  getImportTemplate(calculatorType: string): ImportTemplate {
    const templates: Record<string, ImportTemplate> = {
      'laser-cutting-cost': {
        headers: ['Material', 'Thickness', 'Length', 'Width', 'Quantity', 'Power', 'Speed'],
        requiredFields: ['Material', 'Thickness', 'Length', 'Width', 'Quantity'],
        optionalFields: ['Power', 'Speed', 'Notes'],
        dataTypes: {
          'Material': 'string',
          'Thickness': 'number',
          'Length': 'number',
          'Width': 'number',
          'Quantity': 'number',
          'Power': 'number',
          'Speed': 'number'
        },
        validationRules: {
          'Thickness': { min: 0.1, max: 50 },
          'Length': { min: 1, max: 10000 },
          'Width': { min: 1, max: 10000 },
          'Quantity': { min: 1, max: 10000 },
          'Power': { min: 100, max: 10000 },
          'Speed': { min: 100, max: 5000 }
        }
      },
      'geometry': {
        headers: ['Shape', 'Dimension1', 'Dimension2', 'Dimension3', 'Holes'],
        requiredFields: ['Shape', 'Dimension1'],
        optionalFields: ['Dimension2', 'Dimension3', 'Holes'],
        dataTypes: {
          'Shape': 'string',
          'Dimension1': 'number',
          'Dimension2': 'number',
          'Dimension3': 'number',
          'Holes': 'number'
        },
        validationRules: {
          'Shape': { values: ['rectangle', 'circle', 'ellipse', 'polygon'] },
          'Dimension1': { min: 0.1, max: 10000 },
          'Dimension2': { min: 0.1, max: 10000 },
          'Dimension3': { min: 0.1, max: 10000 }
        }
      }
    };
    
    return templates[calculatorType] || templates['laser-cutting-cost'];
  }
  
  /**
   * 生成导入模板文件
   */
  async generateImportTemplate(calculatorType: string): Promise<Blob> {
    const template = this.getImportTemplate(calculatorType);
    
    // 创建示例数据
    const exampleData = this.generateExampleData(template);
    
    // 生成CSV内容
    const headers = template.headers.join(',');
    const examples = exampleData.map(row => 
      template.headers.map(header => row[header] || '').join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${examples}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return blob;
  }
  
  /**
   * 批量处理计算
   */
  async processBatchCalculations(importedData: any[], calculatorType: string): Promise<{
    results: any[];
    errors: string[];
    summary: {
      total: number;
      successful: number;
      failed: number;
      totalCost: number;
      totalTime: number;
    };
  }> {
    const results: any[] = [];
    const errors: string[] = [];
    let totalCost = 0;
    let totalTime = 0;
    let successful = 0;
    
    for (let i = 0; i < importedData.length; i++) {
      try {
        const item = importedData[i];
        const result = await this.calculateSingle(item, calculatorType);
        
        results.push({
          input: item,
          result,
          rowIndex: i + 1
        });
        
        if (result.totalCost) totalCost += result.totalCost;
        if (result.totalTime) totalTime += result.totalTime;
        successful++;
        
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error}`);
        results.push({
          input: importedData[i],
          result: null,
          error: String(error),
          rowIndex: i + 1
        });
      }
    }
    
    return {
      results,
      errors,
      summary: {
        total: importedData.length,
        successful,
        failed: importedData.length - successful,
        totalCost: Math.round(totalCost * 100) / 100,
        totalTime: Math.round(totalTime * 100) / 100
      }
    };
  }
  
  // 私有辅助方法
  private prepareExcelData(data: ExportData, options: ExportOptions): any[][] {
    const rows: any[][] = [];
    
    // 添加标题行
    rows.push(['Project:', data.projectName]);
    rows.push(['Date:', data.timestamp.toLocaleDateString()]);
    rows.push(['Time:', data.timestamp.toLocaleTimeString()]);
    rows.push([]); // 空行
    
    // 添加摘要
    rows.push(['Summary']);
    rows.push(['Total Cost:', data.summary.totalCost]);
    rows.push(['Total Time:', data.summary.totalTime]);
    rows.push(['Material Count:', data.summary.materialCount]);
    rows.push(['Average Utilization:', `${data.summary.averageUtilization}%`]);
    rows.push([]); // 空行
    
    // 添加详细数据
    rows.push(['Calculator Type', 'Material', 'Thickness', 'Length', 'Width', 'Quantity', 'Total Cost', 'Total Time']);
    
    data.calculations.forEach(calc => {
      const inputs = calc.inputs;
      const results = calc.results as BasicCalculationResults;
      
      rows.push([
        calc.calculatorType,
        inputs.material || '',
        inputs.thickness || '',
        inputs.length || '',
        inputs.width || '',
        inputs.quantity || '',
        results.totalCost || '',
        results.totalTime || ''
      ]);
    });
    
    return rows;
  }
  
  private prepareCSVData(data: ExportData, options: ExportOptions): any[][] {
    return this.prepareExcelData(data, options);
  }
  
  private generateCSVContent(data: any[][]): string {
    return data.map(row => 
      row.map(cell => {
        const cellStr = String(cell);
        // 如果包含逗号、引号或换行符，需要用引号包围
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');
  }
  
  private generateHTMLReport(data: ExportData, options: ExportOptions): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Laser Cutting Report - ${data.projectName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .cost { color: #2e7d32; font-weight: bold; }
        .time { color: #1976d2; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laser Cutting Calculation Report</h1>
        <h2>${data.projectName}</h2>
        <p>Generated on: ${data.timestamp.toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <h3>Summary</h3>
        <p><strong>Total Cost:</strong> <span class="cost">$${data.summary.totalCost.toFixed(2)}</span></p>
        <p><strong>Total Time:</strong> <span class="time">${data.summary.totalTime.toFixed(2)} minutes</span></p>
        <p><strong>Material Count:</strong> ${data.summary.materialCount}</p>
        <p><strong>Average Utilization:</strong> ${data.summary.averageUtilization.toFixed(1)}%</p>
    </div>
    
    <h3>Detailed Calculations</h3>
    <table>
        <thead>
            <tr>
                <th>Calculator</th>
                <th>Material</th>
                <th>Dimensions</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            ${data.calculations.map(calc => {
              const inputs = calc.inputs;
              const results = calc.results as BasicCalculationResults;
              return `
                <tr>
                    <td>${calc.calculatorType}</td>
                    <td>${inputs.material || 'N/A'}</td>
                    <td>${inputs.length || 'N/A'} × ${inputs.width || 'N/A'} × ${inputs.thickness || 'N/A'}</td>
                    <td>${inputs.quantity || 'N/A'}</td>
                    <td class="cost">$${(results.totalCost || 0).toFixed(2)}</td>
                    <td class="time">${(results.totalTime || 0).toFixed(2)} min</td>
                </tr>
              `;
            }).join('')}
        </tbody>
    </table>
</body>
</html>
    `;
  }
  
  private parseCSVContent(csvContent: string, template: ImportTemplate): {
    success: boolean;
    data: any[];
    errors: string[];
    warnings: string[];
  } {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    const warnings: string[] = [];
    const data: any[] = [];
    
    if (lines.length === 0) {
      return { success: false, data: [], errors: ['Empty file'], warnings: [] };
    }
    
    // 解析标题行
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // 验证必需字段
    const missingFields = template.requiredFields.filter(field => !headers.includes(field));
    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // 解析数据行
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        if (values[index] !== undefined) {
          const dataType = template.dataTypes[header];
          let value: any = values[index];
          
          if (dataType === 'number' && value !== '') {
            value = parseFloat(value);
            if (isNaN(value)) {
              errors.push(`Row ${i + 1}, ${header}: Invalid number format`);
              return;
            }
          } else if (dataType === 'boolean') {
            value = value.toLowerCase() === 'true' || value === '1';
          }
          
          row[header] = value;
        }
      });
      
      // 验证数据
      const validation = this.validateRow(row, template);
      if (validation.errors.length > 0) {
        errors.push(...validation.errors.map(err => `Row ${i + 1}: ${err}`));
      }
      if (validation.warnings.length > 0) {
        warnings.push(...validation.warnings.map(warn => `Row ${i + 1}: ${warn}`));
      }
      
      data.push(row);
    }
    
    return {
      success: errors.length === 0,
      data,
      errors,
      warnings
    };
  }
  
  private validateRow(row: any, template: ImportTemplate): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // 检查必需字段
    template.requiredFields.forEach(field => {
      if (row[field] === undefined || row[field] === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });
    
    // 检查验证规则
    Object.entries(template.validationRules).forEach(([field, rules]) => {
      const value = row[field];
      if (value !== undefined && value !== '') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${field} must be at most ${rules.max}`);
        }
        if (rules.values && !rules.values.includes(value)) {
          errors.push(`${field} must be one of: ${rules.values.join(', ')}`);
        }
      }
    });
    
    return { errors, warnings };
  }
  
  private generateExampleData(template: ImportTemplate): any[] {
    const examples: any[] = [];
    
    // 生成3行示例数据
    for (let i = 0; i < 3; i++) {
      const example: any = {};
      
      template.headers.forEach(header => {
        const dataType = template.dataTypes[header];
        
        if (header === 'Material') {
          example[header] = ['steel', 'aluminum', 'stainless_steel'][i];
        } else if (header === 'Shape') {
          example[header] = ['rectangle', 'circle', 'ellipse'][i];
        } else if (dataType === 'number') {
          example[header] = (i + 1) * 10;
        } else if (dataType === 'boolean') {
          example[header] = i % 2 === 0;
        } else {
          example[header] = `Example ${i + 1}`;
        }
      });
      
      examples.push(example);
    }
    
    return examples;
  }
  
  private async calculateSingle(item: any, calculatorType: string): Promise<any> {
    // 这里应该调用相应的计算器
    // 简化实现，返回模拟结果
    return {
      totalCost: Math.random() * 100 + 50,
      totalTime: Math.random() * 30 + 10,
      materialCost: Math.random() * 60 + 30,
      laborCost: Math.random() * 30 + 15,
      energyCost: Math.random() * 10 + 5
    };
  }
}

// 导出数据服务实例
export const dataExportService = new DataExportService();
