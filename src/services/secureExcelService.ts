/**
 * Secure Excel Export Service
 * 
 * This service replaces the vulnerable xlsx library with the more secure exceljs library.
 * It provides the same functionality but with better security and performance.
 */

import * as ExcelJS from 'exceljs';

export interface ExcelExportData {
  projectName: string;
  projectInfo: {
    name: string;
    date: string;
    operator: string;
    description: string;
  };
  inputs: Record<string, any>;
  results: Record<string, any>;
  analysis?: Record<string, any>;
  recommendations?: string[];
}

export class SecureExcelService {
  /**
   * Export data to Excel format using ExcelJS (secure alternative to xlsx)
   */
  async exportToExcel(data: ExcelExportData): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Laser Cutting Calculator Platform';
    workbook.lastModifiedBy = data.projectInfo.operator || 'System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Create Overview worksheet
    const overviewSheet = workbook.addWorksheet('Overview');
    this.createOverviewSheet(overviewSheet, data);

    // Create Input Parameters worksheet
    const inputsSheet = workbook.addWorksheet('Input Parameters');
    this.createInputsSheet(inputsSheet, data.inputs);

    // Create Results worksheet
    const resultsSheet = workbook.addWorksheet('Results');
    this.createResultsSheet(resultsSheet, data.results);

    // Create Analysis worksheet if data exists
    if (data.analysis) {
      const analysisSheet = workbook.addWorksheet('Analysis');
      this.createAnalysisSheet(analysisSheet, data.analysis);
    }

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    return new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  /**
   * Create overview sheet with project information
   */
  private createOverviewSheet(sheet: ExcelJS.Worksheet, data: ExcelExportData) {
    // Title
    sheet.mergeCells('A1:D1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'Laser Cutting Analysis Report';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    // Project Information
    let row = 3;
    sheet.getCell(`A${row}`).value = 'Project Information';
    sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
    row++;

    const projectInfo = [
      ['Project Name', data.projectInfo.name],
      ['Date', data.projectInfo.date],
      ['Operator', data.projectInfo.operator],
      ['Description', data.projectInfo.description]
    ];

    projectInfo.forEach(([label, value]) => {
      sheet.getCell(`A${row}`).value = label;
      sheet.getCell(`B${row}`).value = value;
      sheet.getCell(`A${row}`).font = { bold: true };
      row++;
    });

    // Auto-fit columns
    sheet.columns = [
      { width: 20 },
      { width: 30 },
      { width: 15 },
      { width: 15 }
    ];
  }

  /**
   * Create inputs sheet with parameter details
   */
  private createInputsSheet(sheet: ExcelJS.Worksheet, inputs: Record<string, any>) {
    // Title
    sheet.getCell('A1').value = 'Input Parameters';
    sheet.getCell('A1').font = { size: 14, bold: true };

    // Headers
    sheet.getCell('A3').value = 'Parameter';
    sheet.getCell('B3').value = 'Value';
    sheet.getCell('C3').value = 'Unit';
    
    // Style headers
    ['A3', 'B3', 'C3'].forEach(cell => {
      sheet.getCell(cell).font = { bold: true };
      sheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    });

    // Add input data
    let row = 4;
    Object.entries(inputs).forEach(([key, value]) => {
      sheet.getCell(`A${row}`).value = this.formatParameterName(key);
      sheet.getCell(`B${row}`).value = this.formatValue(value);
      sheet.getCell(`C${row}`).value = this.getUnit(key);
      row++;
    });

    // Auto-fit columns
    sheet.columns = [
      { width: 25 },
      { width: 20 },
      { width: 15 }
    ];
  }

  /**
   * Create results sheet with calculation outputs
   */
  private createResultsSheet(sheet: ExcelJS.Worksheet, results: Record<string, any>) {
    // Title
    sheet.getCell('A1').value = 'Calculation Results';
    sheet.getCell('A1').font = { size: 14, bold: true };

    // Headers
    sheet.getCell('A3').value = 'Result';
    sheet.getCell('B3').value = 'Value';
    sheet.getCell('C3').value = 'Unit';
    
    // Style headers
    ['A3', 'B3', 'C3'].forEach(cell => {
      sheet.getCell(cell).font = { bold: true };
      sheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    });

    // Add results data
    let row = 4;
    Object.entries(results).forEach(([key, value]) => {
      sheet.getCell(`A${row}`).value = this.formatParameterName(key);
      sheet.getCell(`B${row}`).value = this.formatValue(value);
      sheet.getCell(`C${row}`).value = this.getUnit(key);
      
      // Highlight important results
      if (key.includes('cost') || key.includes('total')) {
        sheet.getCell(`B${row}`).font = { bold: true };
      }
      
      row++;
    });

    // Auto-fit columns
    sheet.columns = [
      { width: 25 },
      { width: 20 },
      { width: 15 }
    ];
  }

  /**
   * Create analysis sheet with detailed analysis
   */
  private createAnalysisSheet(sheet: ExcelJS.Worksheet, analysis: Record<string, any>) {
    // Title
    sheet.getCell('A1').value = 'Detailed Analysis';
    sheet.getCell('A1').font = { size: 14, bold: true };

    let row = 3;
    Object.entries(analysis).forEach(([section, data]) => {
      // Section header
      sheet.getCell(`A${row}`).value = this.formatParameterName(section);
      sheet.getCell(`A${row}`).font = { bold: true, size: 12 };
      row++;

      // Section data
      if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
          sheet.getCell(`A${row}`).value = `  ${this.formatParameterName(key)}`;
          sheet.getCell(`B${row}`).value = this.formatValue(value);
          row++;
        });
      } else {
        sheet.getCell(`A${row}`).value = `  ${this.formatValue(data)}`;
        row++;
      }
      
      row++; // Add spacing between sections
    });

    // Auto-fit columns
    sheet.columns = [
      { width: 30 },
      { width: 25 }
    ];
  }

  /**
   * Format parameter names for display
   */
  private formatParameterName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
      .replace(/-/g, ' ');
  }

  /**
   * Format values for display
   */
  private formatValue(value: any): string | number {
    if (typeof value === 'number') {
      return Number(value.toFixed(2));
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  }

  /**
   * Get appropriate unit for parameter
   */
  private getUnit(key: string): string {
    const units: Record<string, string> = {
      thickness: 'mm',
      length: 'mm',
      width: 'mm',
      power: 'W',
      speed: 'mm/min',
      cost: '$',
      time: 'min',
      temperature: '°C',
      pressure: 'bar',
      flow: 'L/min'
    };

    const lowerKey = key.toLowerCase();
    for (const [param, unit] of Object.entries(units)) {
      if (lowerKey.includes(param)) {
        return unit;
      }
    }
    
    return '';
  }
}

// Export singleton instance
export const secureExcelService = new SecureExcelService();
