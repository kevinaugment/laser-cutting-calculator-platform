// Core calculator interfaces and types

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'boolean';
  value: any;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  required?: boolean;
  description?: string;
}

export interface CalculatorResult {
  primaryValue: number;
  primaryUnit: string;
  primaryLabel: string;
  breakdown?: {
    label: string;
    value: number;
    unit: string;
    percentage?: number;
  }[];
  recommendations?: string[];
  warnings?: string[];
  metadata?: {
    calculationTime: number;
    accuracy: 'high' | 'medium' | 'low';
    lastUpdated: Date;
  };
}

export interface SensitivityAnalysis {
  parameter: string;
  baseValue: number;
  variations: {
    change: number; // percentage change
    newValue: number;
    impact: number; // impact on result
  }[];
}

export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  inputs: CalculatorInput[];
  formula: string;
  units: {
    input: Record<string, string>;
    output: string;
  };
  validationRules?: {
    [key: string]: (value: any, allInputs: Record<string, any>) => string | null;
  };
  examples?: {
    name: string;
    description: string;
    inputs: Record<string, any>;
    expectedResult: number;
  }[];
}

export interface Material {
  id: string;
  name: string;
  category: 'metal' | 'plastic' | 'wood' | 'ceramic' | 'composite';
  properties: {
    density: number; // kg/m³
    meltingPoint?: number; // °C
    thermalConductivity: number; // W/m·K
    specificHeat: number; // J/kg·K
    absorptivity: number; // laser absorption coefficient
    reflectivity: number; // laser reflection coefficient
  };
  cuttingParameters: {
    powerRange: [number, number]; // watts
    speedRange: [number, number]; // mm/min
    gasType: 'oxygen' | 'nitrogen' | 'air' | 'argon';
    gasPressure: [number, number]; // bar
    focusOffset: number; // mm
  };
  costPerKg: number; // USD per kg
  availability: 'common' | 'specialty' | 'rare';
}

export interface LaserMachine {
  id: string;
  name: string;
  manufacturer: string;
  type: 'CO2' | 'fiber' | 'diode';
  maxPower: number; // watts
  workingArea: {
    x: number; // mm
    y: number; // mm
    z: number; // mm
  };
  accuracy: number; // mm
  operatingCost: {
    powerConsumption: number; // kW
    maintenanceCostPerHour: number; // USD
    gasConsumptionRate: number; // L/min
  };
}

export interface CalculationContext {
  material: Material;
  machine?: LaserMachine;
  operatorSkill: 'beginner' | 'intermediate' | 'expert';
  environmentalFactors: {
    temperature: number; // °C
    humidity: number; // %
    altitude: number; // m
  };
  qualityRequirements: {
    edgeQuality: 1 | 2 | 3 | 4 | 5; // ISO 9013 quality grades
    toleranceClass: 'rough' | 'medium' | 'fine' | 'precision';
    surfaceFinish: 'standard' | 'smooth' | 'polished';
  };
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  includeCalculationSteps: boolean;
  includeRecommendations: boolean;
  companyInfo?: {
    name: string;
    logo?: string;
    address: string;
    contact: string;
  };
}

export interface CalculatorState {
  inputs: Record<string, any>;
  result: CalculatorResult | null;
  isCalculating: boolean;
  errors: Record<string, string>;
  warnings: string[];
  lastCalculated: Date | null;
  sensitivityAnalysis: SensitivityAnalysis[] | null;
}
