import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import EnhancedInput from '../../ui/EnhancedInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Icon, StatusIcon } from '../../ui/IconRegistry';
import { InputValidator, VALIDATION_TEMPLATES } from '../../../utils/inputValidation';
import { useLoadingState } from '../../../hooks/useLoadingState';
import ErrorBoundary from '../../ui/ErrorBoundary';

interface LaserCuttingCostCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const LaserCuttingCostCalculatorForm: React.FC<LaserCuttingCostCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  // Tab state
  const [activeTab, setActiveTab] = useState('material');

  // 验证状态
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string[]>>({});

  // 加载状态管理
  const loadingState = useLoadingState({
    message: 'Calculating laser cutting costs...',
    estimatedDuration: 1500
  });

  // 创建验证器
  const validator = new InputValidator([
    { ...VALIDATION_TEMPLATES.materialThickness, field: 'thickness' },
    { ...VALIDATION_TEMPLATES.dimension, field: 'length' },
    { ...VALIDATION_TEMPLATES.dimension, field: 'width' },
    { ...VALIDATION_TEMPLATES.quantity, field: 'quantity' },
    { ...VALIDATION_TEMPLATES.materialCost, field: 'materialCost' },
    { ...VALIDATION_TEMPLATES.laserPower, field: 'laserPower' },
    { ...VALIDATION_TEMPLATES.cuttingSpeed, field: 'cuttingSpeed' },
    { ...VALIDATION_TEMPLATES.timeMinutes, field: 'setupTime' }
  ]);

  // Material parameters
  const [material, setMaterial] = useState({
    materialType: 'Mild Steel',
    thickness: 3,
    length: 1000,
    width: 500,
    quantity: 1,
    materialCost: 2.5,
    wasteFactor: 0.1
  });

  // Laser parameters
  const [laser, setLaser] = useState({
    laserPower: 1500,
    cuttingSpeed: 2500,
    setupTime: 15
  });

  // Gas parameters
  const [gas, setGas] = useState({
    gasType: 'Oxygen',
    gasConsumption: 0.8,
    gasCost: 0.15
  });

  // Cost parameters
  const [costs, setCosts] = useState({
    electricityRate: 0.12,
    laborRate: 25,
    machineHourlyRate: 45
  });

  // 验证输入字段
  const validateField = (field: string, value: any) => {
    const result = validator.validateField(field, value);

    setValidationErrors(prev => ({
      ...prev,
      [field]: result.errors
    }));

    setValidationWarnings(prev => ({
      ...prev,
      [field]: result.warnings
    }));

    return result.isValid;
  };

  // 验证所有字段
  const validateAllFields = () => {
    const allData = { ...material, ...laser, ...gas, ...costs };
    const results = validator.validateFields(allData);

    const errors: Record<string, string[]> = {};
    const warnings: Record<string, string[]> = {};

    Object.entries(results).forEach(([field, result]) => {
      if (result.errors.length > 0) {
        errors[field] = result.errors;
      }
      if (result.warnings.length > 0) {
        warnings[field] = result.warnings;
      }
    });

    setValidationErrors(errors);
    setValidationWarnings(warnings);

    return Object.keys(errors).length === 0;
  };

  // 处理输入变化
  const handleInputChange = (section: string, field: string, value: any) => {
    const setValue = {
      material: setMaterial,
      laser: setLaser,
      gas: setGas,
      costs: setCosts
    }[section];

    if (setValue) {
      setValue((prev: any) => ({ ...prev, [field]: value }));
      validateField(field, value);
    }
  };

  const materialOptions = [
    { value: 'Mild Steel', label: 'Mild Steel' },
    { value: 'Stainless Steel', label: 'Stainless Steel' },
    { value: 'Aluminum', label: 'Aluminum' },
    { value: 'Carbon Steel', label: 'Carbon Steel' },
    { value: 'Copper', label: 'Copper' },
    { value: 'Brass', label: 'Brass' }
  ];

  const gasOptions = [
    { value: 'Oxygen', label: 'Oxygen' },
    { value: 'Nitrogen', label: 'Nitrogen' },
    { value: 'Air', label: 'Compressed Air' },
    { value: 'Argon', label: 'Argon' }
  ];

  // Unit definitions for enhanced inputs
  const lengthUnits = [
    { value: 'mm', label: 'mm', factor: 1 },
    { value: 'cm', label: 'cm', factor: 10 },
    { value: 'in', label: 'in', factor: 25.4 }
  ];

  const thicknessUnits = [
    { value: 'mm', label: 'mm', factor: 1 },
    { value: 'in', label: 'in', factor: 25.4 },
    { value: 'gauge', label: 'gauge', factor: 1 } // Special handling needed
  ];

  const powerUnits = [
    { value: 'W', label: 'W', factor: 1 },
    { value: 'kW', label: 'kW', factor: 1000 }
  ];

  const speedUnits = [
    { value: 'mm/min', label: 'mm/min', factor: 1 },
    { value: 'm/min', label: 'm/min', factor: 1000 },
    { value: 'in/min', label: 'in/min', factor: 25.4 }
  ];

  const costUnits = [
    { value: '$/m²', label: '$/m²', factor: 1 },
    { value: '$/ft²', label: '$/ft²', factor: 10.764 }
  ];

  const handleCalculate = async () => {
    // 验证所有字段
    if (!validateAllFields()) {
      // 切换到第一个有错误的标签页
      const errorFields = Object.keys(validationErrors);
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0];
        if (['thickness', 'length', 'width', 'quantity', 'materialCost', 'wasteFactor'].includes(firstErrorField)) {
          setActiveTab('material');
        } else if (['laserPower', 'cuttingSpeed', 'setupTime'].includes(firstErrorField)) {
          setActiveTab('laser');
        } else if (['gasType', 'gasConsumption', 'gasCost'].includes(firstErrorField)) {
          setActiveTab('gas');
        } else {
          setActiveTab('costs');
        }
      }
      return;
    }

    const inputs = {
      ...material,
      ...laser,
      ...gas,
      ...costs
    };

    try {
      await loadingState.withLoading(async () => {
        await onCalculate(inputs);
      }, {
        message: 'Calculating laser cutting costs...',
        estimatedDuration: 1500
      });
    } catch (error) {
      console.error('Calculation failed:', error);
    }
  };

  return (
    <ErrorBoundary name="LaserCuttingCostCalculatorForm" level="component">
      <Card className="calculator-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="dollar" size="md" color="primary" className="mr-2" />
            Cost Calculation Parameters
          </CardTitle>
          {Object.keys(validationErrors).length > 0 && (
            <Alert variant="destructive" className="mt-2">
              <Icon name="warning" size="sm" className="mr-2" />
              <AlertDescription>
                Please fix the validation errors before calculating costs.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="calculator-form">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full calculator-tabs">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="material" className="flex items-center gap-2">
                <Icon name="layers" size="sm" />
                Material
              </TabsTrigger>
              <TabsTrigger value="laser" className="flex items-center gap-2">
                <Icon name="zap" size="sm" />
                Laser
              </TabsTrigger>
              <TabsTrigger value="gas" className="flex items-center gap-2">
                <Icon name="activity" size="sm" />
                Gas
              </TabsTrigger>
              <TabsTrigger value="costs" className="flex items-center gap-2">
                <Icon name="dollar" size="sm" />
                Costs
              </TabsTrigger>
            </TabsList>

          <TabsContent value="material" className="calculator-tab-content space-y-4">
            <Card className="p-4 calculator-form-section">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="layers" size="sm" color="primary" className="mr-2" />
                Material Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="calculator-form-field">
                  <Label>Material Type</Label>
                  <Select
                    value={material.materialType}
                    onChange={(value: string) => handleInputChange('material', 'materialType', value)}
                    options={materialOptions}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {validator.getFieldHint('materialType') || 'Select the material you want to cut'}
                  </p>
                </div>
                <div className="calculator-form-field">
                  <EnhancedInput
                    label="Thickness"
                    value={material.thickness}
                    onChange={(value) => handleInputChange('material', 'thickness', Number(value))}
                    type="number"
                    step="0.1"
                    units={thicknessUnits}
                    defaultUnit="mm"
                    validation={{
                      min: 0.1,
                      max: 50,
                      required: true
                    }}
                    helpText={validator.getFieldHint('thickness') || "Material thickness affects cutting speed and quality"}
                    error={validationErrors.thickness?.[0]}
                    warning={validationWarnings.thickness?.[0]}
                  />
                </div>
                <EnhancedInput
                  label="Length"
                  value={material.length}
                  onChange={(value) => setMaterial({...material, length: Number(value)})}
                  type="number"
                  units={lengthUnits}
                  defaultUnit="mm"
                  validation={{
                    min: 10,
                    max: 6000,
                    required: true
                  }}
                  helpText="Maximum cutting length depends on your machine bed size. Standard industrial machines support up to 6000mm."
                />
                <EnhancedInput
                  label="Width"
                  value={material.width}
                  onChange={(value) => setMaterial({...material, width: Number(value)})}
                  type="number"
                  units={lengthUnits}
                  defaultUnit="mm"
                  validation={{
                    min: 10,
                    max: 3000,
                    required: true
                  }}
                  helpText="Maximum cutting width depends on your machine bed size. Standard industrial machines support up to 3000mm."
                />
                <EnhancedInput
                  label="Quantity"
                  value={material.quantity}
                  onChange={(value) => setMaterial({...material, quantity: Number(value)})}
                  type="number"
                  validation={{
                    min: 1,
                    max: 10000,
                    required: true
                  }}
                  helpText="Number of identical parts to be cut. Larger quantities benefit from batch processing optimization."
                />
                <EnhancedInput
                  label="Material Cost"
                  value={material.materialCost}
                  onChange={(value) => setMaterial({...material, materialCost: Number(value)})}
                  type="number"
                  step="0.01"
                  units={costUnits}
                  defaultUnit="$/m²"
                  validation={{
                    min: 0.1,
                    max: 100,
                    required: true
                  }}
                  helpText="Cost per unit area of raw material. Check with your supplier for current pricing."
                />
                <EnhancedInput
                  label="Waste Factor"
                  value={material.wasteFactor * 100}
                  onChange={(value) => setMaterial({...material, wasteFactor: Number(value) / 100})}
                  type="number"
                  step="1"
                  validation={{
                    min: 5,
                    max: 50,
                    required: true
                  }}
                  helpText="Percentage of material lost due to cutting patterns, edge trimming, and defects. 10-15% is typical for efficient nesting."
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="laser" className="calculator-tab-content space-y-4">
            <Card className="p-4 calculator-form-section">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="zap" size="sm" color="primary" className="mr-2" />
                Laser Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedInput
                  label="Laser Power"
                  value={laser.laserPower}
                  onChange={(value) => setLaser({...laser, laserPower: Number(value)})}
                  type="number"
                  units={powerUnits}
                  defaultUnit="W"
                  validation={{
                    min: 500,
                    max: 8000,
                    required: true
                  }}
                  helpText="Higher power enables faster cutting and thicker materials. Match power to material type and thickness."
                />
                <EnhancedInput
                  label="Cutting Speed"
                  value={laser.cuttingSpeed}
                  onChange={(value) => setLaser({...laser, cuttingSpeed: Number(value)})}
                  type="number"
                  units={speedUnits}
                  defaultUnit="mm/min"
                  validation={{
                    min: 100,
                    max: 10000,
                    required: true
                  }}
                  helpText="Optimal speed balances cutting quality and productivity. Higher speeds may reduce edge quality."
                />
                <EnhancedInput
                  label="Setup Time"
                  value={laser.setupTime}
                  onChange={(value) => setLaser({...laser, setupTime: Number(value)})}
                  type="number"
                  validation={{
                    min: 5,
                    max: 120,
                    required: true
                  }}
                  helpText="Time required for material loading, program setup, and machine preparation. Varies by job complexity."
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gas" className="calculator-tab-content space-y-4">
            <Card className="p-4 calculator-form-section">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="activity" size="sm" color="primary" className="mr-2" />
                Gas Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gas Type</Label>
                  <Select
                    value={gas.gasType}
                    onChange={(value: string) => setGas({...gas, gasType: value})}
                    options={gasOptions}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    <div className="flex items-start space-x-1">
                      <span>💡</span>
                      <span>Oxygen: Best for carbon steel. Nitrogen: Stainless steel and aluminum. Air: Cost-effective for thin materials.</span>
                    </div>
                  </div>
                </div>
                <EnhancedInput
                  label="Gas Consumption"
                  value={gas.gasConsumption}
                  onChange={(value) => setGas({...gas, gasConsumption: Number(value)})}
                  type="number"
                  step="0.1"
                  validation={{
                    min: 0.1,
                    max: 5,
                    required: true
                  }}
                  helpText="Gas flow rate in m³/hour. Higher flow rates improve cut quality but increase costs."
                />
                <EnhancedInput
                  label="Gas Cost"
                  value={gas.gasCost}
                  onChange={(value) => setGas({...gas, gasCost: Number(value)})}
                  type="number"
                  step="0.01"
                  validation={{
                    min: 0.05,
                    max: 2,
                    required: true
                  }}
                  helpText="Cost per cubic meter of assist gas. Prices vary by gas type and supplier contracts."
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="calculator-tab-content space-y-4">
            <Card className="p-4 calculator-form-section">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="settings" size="sm" color="primary" className="mr-2" />
                Operating Costs
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedInput
                  label="Electricity Rate"
                  value={costs.electricityRate}
                  onChange={(value) => setCosts({...costs, electricityRate: Number(value)})}
                  type="number"
                  step="0.01"
                  validation={{
                    min: 0.05,
                    max: 0.5,
                    required: true
                  }}
                  helpText="Cost per kilowatt-hour of electricity. Check your utility bill for current rates including demand charges."
                />
                <EnhancedInput
                  label="Labor Rate"
                  value={costs.laborRate}
                  onChange={(value) => setCosts({...costs, laborRate: Number(value)})}
                  type="number"
                  step="0.5"
                  validation={{
                    min: 15,
                    max: 100,
                    required: true
                  }}
                  helpText="Hourly wage including benefits and overhead. Skilled laser operators typically earn $20-40/hour."
                />
                <EnhancedInput
                  label="Machine Hourly Rate"
                  value={costs.machineHourlyRate}
                  onChange={(value) => setCosts({...costs, machineHourlyRate: Number(value)})}
                  type="number"
                  step="0.5"
                  validation={{
                    min: 20,
                    max: 150,
                    required: true
                  }}
                  helpText="Machine operating cost including depreciation, maintenance, and facility costs. Typically $40-80/hour for industrial machines."
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 calculator-button-group">
          {/* 显示验证摘要 */}
          {Object.keys(validationErrors).length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <Icon name="warning" size="sm" className="mr-2" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-sm">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {errors[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 显示警告摘要 */}
          {Object.keys(validationWarnings).length > 0 && Object.keys(validationErrors).length === 0 && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <Icon name="info" size="sm" className="mr-2 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="space-y-1">
                  <p className="font-medium">Please review these warnings:</p>
                  <ul className="list-disc list-inside text-sm">
                    {Object.entries(validationWarnings).map(([field, warnings]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {warnings[0]}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleCalculate}
            disabled={isLoading || loadingState.isLoading || Object.keys(validationErrors).length > 0}
            className="w-full calculator-button"
            size="lg"
          >
            {loadingState.isLoading ? (
              <div className="flex items-center">
                <StatusIcon status="loading" size="sm" className="mr-2" />
                {loadingState.message}
                {loadingState.progress > 0 && (
                  <span className="ml-2">({Math.round(loadingState.progress)}%)</span>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <Icon name="calculator" size="sm" className="mr-2" />
                Calculate Laser Cutting Cost
              </div>
            )}
          </Button>

          {/* 显示加载进度 */}
          {loadingState.isLoading && loadingState.progress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingState.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </ErrorBoundary>
  );
};

export default LaserCuttingCostCalculatorForm;
