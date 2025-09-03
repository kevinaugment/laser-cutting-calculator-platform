// Cutting Time Estimator Calculator Implementation
// Accurate cutting time estimation for production planning

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const cuttingTimeSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum']),
  thickness: z.number().min(0.5).max(50),
  cuttingLength: z.number().min(1).max(100000),
  pierceCount: z.number().min(1).max(1000),
  laserPower: z.number().min(500).max(20000)
});

// Input types
export type CuttingTimeInputs = z.infer<typeof cuttingTimeSchema>;

// Result types
export interface CuttingTimeResults {
  piercingTime: number;        // minutes
  cuttingTime: number;         // minutes
  movingTime: number;          // minutes
  totalTime: number;           // minutes
  efficiency: number;          // percentage
  timeBreakdown: {
    piercing: number;          // percentage
    cutting: number;           // percentage
    moving: number;            // percentage
  };
  recommendations: string[];
  warnings: string[];
  productionMetrics: {
    partsPerHour: number;
    dailyCapacity: number;     // 8-hour day
    weeklyCapacity: number;    // 5-day week
  };
}

// Material cutting speed database (mm/min)
const materialCuttingSpeeds = {
  steel: {
    1: { 1000: 8000, 2000: 12000, 3000: 15000, 4000: 16000, 6000: 18000 },
    2: { 1000: 6000, 2000: 9000, 3000: 12000, 4000: 14000, 6000: 16000 },
    3: { 1000: 4500, 2000: 7000, 3000: 9500, 4000: 11000, 6000: 13000 },
    5: { 1000: 3000, 2000: 5000, 3000: 7000, 4000: 8500, 6000: 10000 },
    8: { 1000: 2000, 2000: 3500, 3000: 5000, 4000: 6000, 6000: 7500 },
    10: { 1000: 1500, 2000: 2800, 3000: 4000, 4000: 5000, 6000: 6200 },
    15: { 1000: 1000, 2000: 1800, 3000: 2500, 4000: 3200, 6000: 4000 },
    20: { 1000: 700, 2000: 1200, 3000: 1800, 4000: 2300, 6000: 2800 },
    25: { 1000: 500, 2000: 900, 3000: 1300, 4000: 1700, 6000: 2100 }
  },
  stainless_steel: {
    1: { 1000: 6000, 2000: 9000, 3000: 11000, 4000: 12000, 6000: 13000 },
    2: { 1000: 4500, 2000: 6500, 3000: 8500, 4000: 9500, 6000: 11000 },
    3: { 1000: 3500, 2000: 5000, 3000: 6500, 4000: 7500, 6000: 8500 },
    5: { 1000: 2200, 2000: 3500, 3000: 4500, 4000: 5500, 6000: 6500 },
    8: { 1000: 1400, 2000: 2200, 3000: 3000, 4000: 3800, 6000: 4500 },
    10: { 1000: 1000, 2000: 1700, 3000: 2300, 4000: 2900, 6000: 3500 },
    15: { 1000: 600, 2000: 1000, 3000: 1400, 4000: 1800, 6000: 2200 },
    20: { 1000: 400, 2000: 700, 3000: 1000, 4000: 1300, 6000: 1600 }
  },
  aluminum: {
    1: { 1000: 10000, 2000: 15000, 3000: 18000, 4000: 20000, 6000: 22000 },
    2: { 1000: 8000, 2000: 12000, 3000: 15000, 4000: 17000, 6000: 19000 },
    3: { 1000: 6500, 2000: 9500, 3000: 12000, 4000: 14000, 6000: 16000 },
    5: { 1000: 4500, 2000: 7000, 3000: 9000, 4000: 11000, 6000: 13000 },
    8: { 1000: 3000, 2000: 4500, 3000: 6000, 4000: 7500, 6000: 9000 },
    10: { 1000: 2200, 2000: 3500, 3000: 4500, 4000: 5500, 6000: 6500 },
    15: { 1000: 1500, 2000: 2300, 3000: 3000, 4000: 3700, 6000: 4500 },
    20: { 1000: 1000, 2000: 1600, 3000: 2100, 4000: 2600, 6000: 3200 }
  }
};

// Piercing time database (seconds per pierce)
const piercingTimes = {
  steel: {
    1: 0.1, 2: 0.2, 3: 0.3, 5: 0.5, 8: 0.8, 10: 1.2, 15: 2.0, 20: 3.0, 25: 4.5
  },
  stainless_steel: {
    1: 0.15, 2: 0.3, 3: 0.45, 5: 0.7, 8: 1.2, 10: 1.8, 15: 3.0, 20: 4.5
  },
  aluminum: {
    1: 0.08, 2: 0.15, 3: 0.25, 5: 0.4, 8: 0.6, 10: 0.9, 15: 1.5, 20: 2.2
  }
};

export class CuttingTimeEstimator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'cutting-time-estimator',
    title: 'Cutting Time Estimator',
    description: 'Estimate cutting time for accurate production planning',
    category: 'Core Engineering',
    badge: 'Standard',
    iconName: 'Clock',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        help: 'Select the material to be cut',
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 0.5,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Thickness of the material in millimeters'
      },
      {
        id: 'cuttingLength',
        label: 'Total Cutting Length',
        type: 'number',
        required: true,
        min: 1,
        max: 100000,
        step: 1,
        unit: 'mm',
        help: 'Total length of all cuts in millimeters'
      },
      {
        id: 'pierceCount',
        label: 'Number of Pierces',
        type: 'number',
        required: true,
        min: 1,
        max: 1000,
        step: 1,
        unit: 'pieces',
        help: 'Total number of pierce points required'
      },
      {
        id: 'laserPower',
        label: 'Laser Power',
        type: 'number',
        required: true,
        min: 500,
        max: 20000,
        step: 100,
        unit: 'W',
        help: 'Laser power setting in watts'
      }
    ],
    resultType: 'time',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return cuttingTimeSchema;
  }

  customValidation(inputs: CuttingTimeInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check if thickness is supported for material
    const materialData = materialCuttingSpeeds[inputs.materialType];
    const supportedThicknesses = Object.keys(materialData).map(Number);
    const maxThickness = Math.max(...supportedThicknesses);
    
    if (inputs.thickness > maxThickness) {
      warnings.push({
        field: 'thickness',
        message: `Thickness ${inputs.thickness}mm may not be optimal for ${inputs.materialType}. Maximum recommended: ${maxThickness}mm`,
        code: 'THICKNESS_WARNING'
      });
    }

    // Check power vs thickness ratio
    const powerDensity = inputs.laserPower / inputs.thickness;
    if (powerDensity < 200) {
      warnings.push({
        field: 'laserPower',
        message: 'Low power-to-thickness ratio may result in slow cutting speeds',
        code: 'LOW_POWER_DENSITY'
      });
    }

    // Check for very long cutting lengths
    if (inputs.cuttingLength > 50000) {
      warnings.push({
        field: 'cuttingLength',
        message: 'Very long cutting length - consider breaking into multiple jobs',
        code: 'LONG_CUTTING_LENGTH'
      });
    }

    // Check pierce density
    const pierceDensity = inputs.pierceCount / (inputs.cuttingLength / 1000); // pierces per meter
    if (pierceDensity > 50) {
      warnings.push({
        field: 'pierceCount',
        message: 'High pierce density may significantly increase processing time',
        code: 'HIGH_PIERCE_DENSITY'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: CuttingTimeInputs): Promise<BaseCalculationResult> {
    try {
      // Get cutting speed for material, thickness, and power
      const cuttingSpeed = this.getCuttingSpeed(inputs);
      
      // Calculate piercing time
      const piercingTimePerPoint = this.getPiercingTime(inputs);
      const totalPiercingTime = (inputs.pierceCount * piercingTimePerPoint) / 60; // Convert to minutes
      
      // Calculate cutting time
      const cuttingTime = inputs.cuttingLength / cuttingSpeed; // minutes
      
      // Calculate moving time (estimated 10% of cutting time for rapid moves)
      const movingTime = cuttingTime * 0.1;
      
      // Calculate total time
      const totalTime = cuttingTime + totalPiercingTime + movingTime;
      
      // Calculate efficiency (actual cutting vs total time)
      const efficiency = (cuttingTime / totalTime) * 100;
      
      // Calculate time breakdown percentages
      const timeBreakdown = {
        cutting: (cuttingTime / totalTime) * 100,
        piercing: (totalPiercingTime / totalTime) * 100,
        moving: (movingTime / totalTime) * 100
      };
      
      // Calculate production metrics
      const partsPerHour = totalTime > 0 ? 60 / totalTime : 0;
      const dailyCapacity = partsPerHour * 8; // 8-hour day
      const weeklyCapacity = dailyCapacity * 5; // 5-day week
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, cuttingSpeed, totalTime);
      const warnings = this.generateWarnings(inputs, cuttingSpeed, efficiency);

      const results: CuttingTimeResults = {
        piercingTime: Math.round(totalPiercingTime * 100) / 100,
        cuttingTime: Math.round(cuttingTime * 100) / 100,
        movingTime: Math.round(movingTime * 100) / 100,
        totalTime: Math.round(totalTime * 100) / 100,
        efficiency: Math.round(efficiency * 100) / 100,
        timeBreakdown: {
          cutting: Math.round(timeBreakdown.cutting * 100) / 100,
          piercing: Math.round(timeBreakdown.piercing * 100) / 100,
          moving: Math.round(timeBreakdown.moving * 100) / 100
        },
        recommendations,
        warnings,
        productionMetrics: {
          partsPerHour: Math.round(partsPerHour * 100) / 100,
          dailyCapacity: Math.round(dailyCapacity),
          weeklyCapacity: Math.round(weeklyCapacity)
        }
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private getCuttingSpeed(inputs: CuttingTimeInputs): number {
    const materialData = materialCuttingSpeeds[inputs.materialType];
    
    // Find closest thickness
    const thicknesses = Object.keys(materialData).map(Number).sort((a, b) => a - b);
    const closestThickness = thicknesses.reduce((prev, curr) => 
      Math.abs(curr - inputs.thickness) < Math.abs(prev - inputs.thickness) ? curr : prev
    );
    
    const speedData = materialData[closestThickness];
    
    // Find closest power
    const powers = Object.keys(speedData).map(Number).sort((a, b) => a - b);
    const closestPower = powers.reduce((prev, curr) => 
      Math.abs(curr - inputs.laserPower) < Math.abs(prev - inputs.laserPower) ? curr : prev
    );
    
    let speed = speedData[closestPower];
    
    // Interpolate for thickness if not exact match
    if (closestThickness !== inputs.thickness) {
      const thicknessRatio = inputs.thickness / closestThickness;
      speed = speed / Math.pow(thicknessRatio, 0.8); // Empirical scaling factor
    }
    
    // Interpolate for power if not exact match
    if (closestPower !== inputs.laserPower) {
      const powerRatio = inputs.laserPower / closestPower;
      speed = speed * Math.pow(powerRatio, 0.6); // Empirical scaling factor
    }
    
    return Math.max(speed, 100); // Minimum speed of 100 mm/min
  }

  private getPiercingTime(inputs: CuttingTimeInputs): number {
    const materialData = piercingTimes[inputs.materialType];
    
    // Find closest thickness
    const thicknesses = Object.keys(materialData).map(Number).sort((a, b) => a - b);
    const closestThickness = thicknesses.reduce((prev, curr) => 
      Math.abs(curr - inputs.thickness) < Math.abs(prev - inputs.thickness) ? curr : prev
    );
    
    let piercingTime = materialData[closestThickness];
    
    // Interpolate for thickness if not exact match
    if (closestThickness !== inputs.thickness) {
      const thicknessRatio = inputs.thickness / closestThickness;
      piercingTime = piercingTime * Math.pow(thicknessRatio, 1.2); // Empirical scaling factor
    }
    
    // Adjust for power (higher power = faster piercing)
    const powerFactor = Math.min(inputs.laserPower / 3000, 2); // Normalize to 3kW, max 2x improvement
    piercingTime = piercingTime / Math.pow(powerFactor, 0.3);
    
    return Math.max(piercingTime, 0.05); // Minimum 0.05 seconds per pierce
  }

  private generateRecommendations(
    inputs: CuttingTimeInputs,
    cuttingSpeed: number,
    totalTime: number
  ): string[] {
    const recommendations: string[] = [];

    if (cuttingSpeed < 1000) {
      recommendations.push('Consider increasing laser power for faster cutting speeds');
    }

    if (totalTime > 60) {
      recommendations.push('Long processing time - consider optimizing cut path or nesting');
    }

    const pierceDensity = inputs.pierceCount / (inputs.cuttingLength / 1000);
    if (pierceDensity > 20) {
      recommendations.push('High pierce count - consider common line cutting to reduce pierces');
    }

    if (inputs.thickness > 15 && inputs.materialType === 'aluminum') {
      recommendations.push('For thick aluminum, consider nitrogen assist gas for better edge quality');
    }

    return recommendations;
  }

  private generateWarnings(
    inputs: CuttingTimeInputs,
    cuttingSpeed: number,
    efficiency: number
  ): string[] {
    const warnings: string[] = [];

    if (efficiency < 60) {
      warnings.push('Low cutting efficiency - high proportion of non-cutting time');
    }

    if (cuttingSpeed < 500) {
      warnings.push('Very slow cutting speed may cause heat buildup and poor edge quality');
    }

    if (inputs.pierceCount > 500) {
      warnings.push('Very high pierce count will significantly increase processing time');
    }

    return warnings;
  }

  getExampleInputs(): CuttingTimeInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      cuttingLength: 2000,
      pierceCount: 10,
      laserPower: 3000
    };
  }
}
