// 统一输入验证系统 - 激光切割计算器平台

// 验证规则类型定义
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'range' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FieldValidation {
  field: string;
  rules: ValidationRule[];
  hint?: string;
  unit?: string;
  defaultValue?: any;
}

// 常用验证规则模板
export const VALIDATION_TEMPLATES = {
  // 材料厚度验证
  materialThickness: {
    field: 'thickness',
    rules: [
      { type: 'required', message: 'Material thickness is required' },
      { type: 'min', value: 0.1, message: 'Thickness must be at least 0.1mm' },
      { type: 'max', value: 50, message: 'Thickness cannot exceed 50mm' }
    ],
    hint: 'Typical range: 0.5-25mm for most materials',
    unit: 'mm',
    defaultValue: 1.0
  } as FieldValidation,

  // 激光功率验证
  laserPower: {
    field: 'power',
    rules: [
      { type: 'required', message: 'Laser power is required' },
      { type: 'min', value: 100, message: 'Power must be at least 100W' },
      { type: 'max', value: 20000, message: 'Power cannot exceed 20kW' }
    ],
    hint: 'Common ranges: 1-6kW for fiber, 100W-2kW for CO2',
    unit: 'W',
    defaultValue: 3000
  } as FieldValidation,

  // 切割速度验证
  cuttingSpeed: {
    field: 'speed',
    rules: [
      { type: 'required', message: 'Cutting speed is required' },
      { type: 'min', value: 0.1, message: 'Speed must be at least 0.1 m/min' },
      { type: 'max', value: 50, message: 'Speed cannot exceed 50 m/min' }
    ],
    hint: 'Typical range: 0.5-20 m/min depending on material and thickness',
    unit: 'm/min',
    defaultValue: 5.0
  } as FieldValidation,

  // 材料成本验证
  materialCost: {
    field: 'materialCost',
    rules: [
      { type: 'required', message: 'Material cost is required' },
      { type: 'min', value: 0, message: 'Cost cannot be negative' },
      { type: 'max', value: 10000, message: 'Cost seems unreasonably high' }
    ],
    hint: 'Cost per unit area or weight of material',
    unit: '$/unit',
    defaultValue: 10.0
  } as FieldValidation,

  // 数量验证
  quantity: {
    field: 'quantity',
    rules: [
      { type: 'required', message: 'Quantity is required' },
      { type: 'min', value: 1, message: 'Quantity must be at least 1' },
      { type: 'max', value: 100000, message: 'Quantity cannot exceed 100,000' },
      { 
        type: 'custom', 
        message: 'Quantity must be a whole number',
        validator: (value: number) => Number.isInteger(value)
      }
    ],
    hint: 'Number of parts to produce',
    unit: 'pieces',
    defaultValue: 1
  } as FieldValidation,

  // 时间验证（分钟）
  timeMinutes: {
    field: 'time',
    rules: [
      { type: 'required', message: 'Time is required' },
      { type: 'min', value: 0.1, message: 'Time must be at least 0.1 minutes' },
      { type: 'max', value: 1440, message: 'Time cannot exceed 24 hours' }
    ],
    hint: 'Time in minutes',
    unit: 'min',
    defaultValue: 10.0
  } as FieldValidation,

  // 百分比验证
  percentage: {
    field: 'percentage',
    rules: [
      { type: 'required', message: 'Percentage is required' },
      { type: 'min', value: 0, message: 'Percentage cannot be negative' },
      { type: 'max', value: 100, message: 'Percentage cannot exceed 100%' }
    ],
    hint: 'Value as percentage (0-100)',
    unit: '%',
    defaultValue: 50
  } as FieldValidation,

  // 温度验证
  temperature: {
    field: 'temperature',
    rules: [
      { type: 'required', message: 'Temperature is required' },
      { type: 'min', value: -273, message: 'Temperature cannot be below absolute zero' },
      { type: 'max', value: 5000, message: 'Temperature seems unreasonably high' }
    ],
    hint: 'Temperature in Celsius',
    unit: '°C',
    defaultValue: 20
  } as FieldValidation,

  // 压力验证
  pressure: {
    field: 'pressure',
    rules: [
      { type: 'required', message: 'Pressure is required' },
      { type: 'min', value: 0, message: 'Pressure cannot be negative' },
      { type: 'max', value: 50, message: 'Pressure cannot exceed 50 bar' }
    ],
    hint: 'Gas pressure in bar',
    unit: 'bar',
    defaultValue: 1.0
  } as FieldValidation,

  // 尺寸验证
  dimension: {
    field: 'dimension',
    rules: [
      { type: 'required', message: 'Dimension is required' },
      { type: 'min', value: 0.1, message: 'Dimension must be at least 0.1mm' },
      { type: 'max', value: 10000, message: 'Dimension cannot exceed 10m' }
    ],
    hint: 'Dimension in millimeters',
    unit: 'mm',
    defaultValue: 100
  } as FieldValidation
};

// 验证器类
export class InputValidator {
  private validationRules: Map<string, FieldValidation> = new Map();

  constructor(rules: FieldValidation[] = []) {
    rules.forEach(rule => this.addRule(rule));
  }

  // 添加验证规则
  addRule(rule: FieldValidation): void {
    this.validationRules.set(rule.field, rule);
  }

  // 添加模板规则
  addTemplate(field: string, templateName: keyof typeof VALIDATION_TEMPLATES): void {
    const template = VALIDATION_TEMPLATES[templateName];
    if (template) {
      this.addRule({ ...template, field });
    }
  }

  // 验证单个字段
  validateField(field: string, value: any): ValidationResult {
    const rule = this.validationRules.get(field);
    if (!rule) {
      return { isValid: true, errors: [], warnings: [] };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    for (const validationRule of rule.rules) {
      const result = this.applyRule(validationRule, value);
      if (!result.isValid) {
        errors.push(result.message);
      }
    }

    // 添加警告逻辑
    if (errors.length === 0) {
      const warning = this.checkWarnings(field, value, rule);
      if (warning) {
        warnings.push(warning);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 验证多个字段
  validateFields(data: Record<string, any>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};
    
    for (const [field, value] of Object.entries(data)) {
      results[field] = this.validateField(field, value);
    }

    return results;
  }

  // 检查所有字段是否有效
  isValid(data: Record<string, any>): boolean {
    const results = this.validateFields(data);
    return Object.values(results).every(result => result.isValid);
  }

  // 获取所有错误
  getAllErrors(data: Record<string, any>): string[] {
    const results = this.validateFields(data);
    return Object.values(results).flatMap(result => result.errors);
  }

  // 获取字段提示
  getFieldHint(field: string): string | undefined {
    return this.validationRules.get(field)?.hint;
  }

  // 获取字段单位
  getFieldUnit(field: string): string | undefined {
    return this.validationRules.get(field)?.unit;
  }

  // 获取字段默认值
  getFieldDefault(field: string): any {
    return this.validationRules.get(field)?.defaultValue;
  }

  // 应用单个验证规则
  private applyRule(rule: ValidationRule, value: any): { isValid: boolean; message: string } {
    switch (rule.type) {
      case 'required':
        return {
          isValid: value !== null && value !== undefined && value !== '',
          message: rule.message
        };

      case 'min':
        return {
          isValid: Number(value) >= rule.value,
          message: rule.message
        };

      case 'max':
        return {
          isValid: Number(value) <= rule.value,
          message: rule.message
        };

      case 'range':
        const [min, max] = rule.value;
        return {
          isValid: Number(value) >= min && Number(value) <= max,
          message: rule.message
        };

      case 'pattern':
        const regex = new RegExp(rule.value);
        return {
          isValid: regex.test(String(value)),
          message: rule.message
        };

      case 'custom':
        return {
          isValid: rule.validator ? rule.validator(value) : true,
          message: rule.message
        };

      default:
        return { isValid: true, message: '' };
    }
  }

  // 检查警告条件
  private checkWarnings(field: string, value: any, rule: FieldValidation): string | null {
    const numValue = Number(value);
    
    // 通用警告逻辑
    if (field.includes('thickness') && numValue > 20) {
      return 'Thick materials may require special cutting parameters';
    }
    
    if (field.includes('power') && numValue > 10000) {
      return 'High power settings require careful safety considerations';
    }
    
    if (field.includes('speed') && numValue > 20) {
      return 'High cutting speeds may affect quality';
    }
    
    if (field.includes('cost') && numValue > 1000) {
      return 'High cost detected - please verify the value';
    }

    return null;
  }
}

// 预定义验证器实例
export const materialValidator = new InputValidator([
  VALIDATION_TEMPLATES.materialThickness,
  VALIDATION_TEMPLATES.dimension
]);

export const laserValidator = new InputValidator([
  VALIDATION_TEMPLATES.laserPower,
  VALIDATION_TEMPLATES.cuttingSpeed,
  VALIDATION_TEMPLATES.pressure
]);

export const costValidator = new InputValidator([
  VALIDATION_TEMPLATES.materialCost,
  VALIDATION_TEMPLATES.quantity,
  VALIDATION_TEMPLATES.percentage
]);

export const timeValidator = new InputValidator([
  VALIDATION_TEMPLATES.timeMinutes,
  VALIDATION_TEMPLATES.percentage
]);

// 工具函数
export const createValidator = (templates: (keyof typeof VALIDATION_TEMPLATES)[]): InputValidator => {
  const validator = new InputValidator();
  templates.forEach(template => {
    validator.addTemplate(template, template);
  });
  return validator;
};

export const validateInput = (value: any, templateName: keyof typeof VALIDATION_TEMPLATES): ValidationResult => {
  const validator = new InputValidator([VALIDATION_TEMPLATES[templateName]]);
  return validator.validateField(templateName, value);
};

export default InputValidator;
