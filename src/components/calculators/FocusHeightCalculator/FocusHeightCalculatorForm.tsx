import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Alert, AlertDescription } from '../../ui/alert';
import { Icon, StatusIcon } from '../../ui/IconRegistry';
import { InputValidator, VALIDATION_TEMPLATES } from '../../../utils/inputValidation';
import { useLoadingState } from '../../../hooks/useLoadingState';
import ErrorBoundary from '../../ui/ErrorBoundary';
import EnhancedInput from '../../ui/EnhancedInput';

interface FocusHeightCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const FocusHeightCalculatorForm: React.FC<FocusHeightCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('material');

  // 验证状态
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string[]>>({});

  // 加载状态管理
  const loadingState = useLoadingState({
    message: 'Calculating optimal focus height...',
    estimatedDuration: 2000
  });

  // 创建验证器
  const validator = new InputValidator([
    { ...VALIDATION_TEMPLATES.materialThickness, field: 'thickness' },
    { ...VALIDATION_TEMPLATES.laserPower, field: 'laserPower' },
    { ...VALIDATION_TEMPLATES.cuttingSpeed, field: 'cuttingSpeed' },
    { ...VALIDATION_TEMPLATES.dimension, field: 'focalLength' },
    { ...VALIDATION_TEMPLATES.dimension, field: 'beamDiameter' },
    { ...VALIDATION_TEMPLATES.percentage, field: 'materialReflectivity' },
    { ...VALIDATION_TEMPLATES.temperature, field: 'temperature' },
    { ...VALIDATION_TEMPLATES.percentage, field: 'humidity' },
    { ...VALIDATION_TEMPLATES.pressure, field: 'airPressure' }
  ]);

  const [materialSpecs, setMaterialSpecs] = useState({
    materialType: 'carbon_steel',
    thickness: 5.0, // mm
    surfaceCondition: 'flat' as 'flat' | 'warped' | 'textured' | 'reflective',
    materialReflectivity: 10 // percentage
  });

  const [laserSpecs, setLaserSpecs] = useState({
    laserType: 'fiber' as 'fiber' | 'co2' | 'nd_yag' | 'diode',
    laserWavelength: 1070, // nm
    laserPower: 1500, // W
    focalLength: 127, // mm
    beamDiameter: 6.0, // mm
    cuttingSpeed: 2500 // mm/min
  });

  const [cuttingParams, setCuttingParams] = useState({
    cutType: 'through_cut' as 'through_cut' | 'marking' | 'engraving' | 'welding',
    gasType: 'oxygen' as 'oxygen' | 'nitrogen' | 'air' | 'argon',
    desiredEdgeQuality: 'standard' as 'production' | 'standard' | 'high' | 'precision'
  });

  const [environmentalConditions, setEnvironmentalConditions] = useState({
    temperature: 20, // °C
    humidity: 50, // percentage
    airPressure: 1013 // mbar
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
    const allData = {
      ...materialSpecs,
      ...laserSpecs,
      ...cuttingParams,
      ...environmentalConditions
    };
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
      material: setMaterialSpecs,
      laser: setLaserSpecs,
      cutting: setCuttingParams,
      environmental: setEnvironmentalConditions
    }[section];

    if (setValue) {
      setValue((prev: any) => ({ ...prev, [field]: value }));
      validateField(field, value);
    }
  };

  const handleCalculate = async () => {
    // 验证所有字段
    if (!validateAllFields()) {
      // 切换到第一个有错误的标签页
      const errorFields = Object.keys(validationErrors);
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0];
        if (['materialType', 'thickness', 'surfaceCondition', 'materialReflectivity'].includes(firstErrorField)) {
          setActiveTab('material');
        } else if (['laserType', 'laserPower', 'focalLength', 'beamDiameter', 'cuttingSpeed'].includes(firstErrorField)) {
          setActiveTab('laser');
        } else if (['cutType', 'gasType', 'desiredEdgeQuality'].includes(firstErrorField)) {
          setActiveTab('cutting');
        } else {
          setActiveTab('environmental');
        }
      }
      return;
    }
    const inputs = {
      // Material properties
      materialType: materialSpecs.materialType,
      thickness: materialSpecs.thickness,
      surfaceCondition: materialSpecs.surfaceCondition,
      materialReflectivity: materialSpecs.materialReflectivity,

      // Laser specifications
      laserWavelength: laserSpecs.laserWavelength,
      laserPower: laserSpecs.laserPower,
      focalLength: laserSpecs.focalLength,
      beamDiameter: laserSpecs.beamDiameter,
      cuttingSpeed: laserSpecs.cuttingSpeed,

      // Cutting parameters
      cutType: cuttingParams.cutType,
      gasType: cuttingParams.gasType,
      desiredEdgeQuality: cuttingParams.desiredEdgeQuality,

      // Environmental conditions
      ambientConditions: {
        temperature: environmentalConditions.temperature,
        humidity: environmentalConditions.humidity,
        airPressure: environmentalConditions.airPressure
      }
    };

    try {
      await loadingState.withLoading(async () => {
        await onCalculate(inputs);
      }, {
        message: 'Calculating optimal focus height...',
        estimatedDuration: 2000
      });
    } catch (error) {
      console.error('Focus height calculation failed:', error);
    }
  };

  const materialOptions = [
    { value: 'carbon_steel', label: 'Carbon Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' },
    { value: 'titanium', label: 'Titanium' },
    { value: 'acrylic', label: 'Acrylic' },
    { value: 'wood', label: 'Wood' },
    { value: 'plywood', label: 'Plywood' }
  ];

  const surfaceConditionOptions = [
    { value: 'flat', label: 'Flat (Smooth surface)' },
    { value: 'warped', label: 'Warped (Uneven surface)' },
    { value: 'textured', label: 'Textured (Rough surface)' },
    { value: 'reflective', label: 'Reflective (Mirror-like)' }
  ];

  const laserTypeOptions = [
    { value: 'fiber', label: 'Fiber Laser (1070nm)' },
    { value: 'co2', label: 'CO₂ Laser (10.6μm)' },
    { value: 'nd_yag', label: 'Nd:YAG Laser (1064nm)' },
    { value: 'diode', label: 'Diode Laser (808-980nm)' }
  ];

  const cutTypeOptions = [
    { value: 'through_cut', label: 'Through Cut (Complete cutting)' },
    { value: 'marking', label: 'Marking (Surface marking)' },
    { value: 'engraving', label: 'Engraving (Material removal)' },
    { value: 'welding', label: 'Welding (Material joining)' }
  ];

  const gasTypeOptions = [
    { value: 'oxygen', label: 'Oxygen (O₂)' },
    { value: 'nitrogen', label: 'Nitrogen (N₂)' },
    { value: 'air', label: 'Compressed Air' },
    { value: 'argon', label: 'Argon (Ar)' }
  ];

  const qualityOptions = [
    { value: 'production', label: 'Production (Fast cutting)' },
    { value: 'standard', label: 'Standard (Good quality)' },
    { value: 'high', label: 'High (Premium quality)' },
    { value: 'precision', label: 'Precision (Maximum quality)' }
  ];

  // Update wavelength when laser type changes
  const handleLaserTypeChange = (value: 'fiber' | 'co2' | 'nd_yag' | 'diode') => {
    const wavelengths = {
      fiber: 1070,
      co2: 10600,
      nd_yag: 1064,
      diode: 940
    };
    
    setLaserSpecs({
      ...laserSpecs,
      laserType: value,
      laserWavelength: wavelengths[value]
    });
  };

  return (
    <ErrorBoundary name="FocusHeightCalculatorForm" level="component">
      <Card className="calculator-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="target" size="md" color="primary" />
            <span>Focus Height Calculator</span>
            <Badge variant="outline">Precision Setup</Badge>
          </CardTitle>
          {Object.keys(validationErrors).length > 0 && (
            <Alert variant="destructive" className="mt-2">
              <Icon name="warning" size="sm" className="mr-2" />
              <AlertDescription>
                Please fix the validation errors before calculating focus height.
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
              <TabsTrigger value="cutting" className="flex items-center gap-2">
                <Icon name="settings" size="sm" />
                Cutting
              </TabsTrigger>
              <TabsTrigger value="environment" className="flex items-center gap-2">
                <Icon name="globe" size="sm" />
                Environment
              </TabsTrigger>
            </TabsList>

          <TabsContent value="material" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="layers" size="sm" color="primary" className="mr-2" />
                Material Properties
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Material Type</Label>
                  <Select
                    value={materialSpecs.materialType}
                    onChange={(value: string) => 
                      setMaterialSpecs({
                        ...materialSpecs,
                        materialType: value
                      })
                    }
                    options={materialOptions}
                  />
                </div>
                <div>
                  <Label>Thickness (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={materialSpecs.thickness}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      thickness: Number(e.target.value)
                    })}
                    min="0.1"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Surface Condition</Label>
                  <Select
                    value={materialSpecs.surfaceCondition}
                    onChange={(value: 'flat' | 'warped' | 'textured' | 'reflective') => 
                      setMaterialSpecs({
                        ...materialSpecs,
                        surfaceCondition: value
                      })
                    }
                    options={surfaceConditionOptions}
                  />
                </div>
                <div>
                  <Label>Material Reflectivity (%)</Label>
                  <Input
                    type="number"
                    value={materialSpecs.materialReflectivity}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      materialReflectivity: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="laser" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="zap" size="sm" color="primary" className="mr-2" />
                Laser Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Laser Type</Label>
                  <Select
                    value={laserSpecs.laserType}
                    onChange={handleLaserTypeChange}
                    options={laserTypeOptions}
                  />
                </div>
                <div>
                  <Label>Wavelength (nm)</Label>
                  <Input
                    type="number"
                    value={laserSpecs.laserWavelength}
                    onChange={(e) => setLaserSpecs({
                      ...laserSpecs,
                      laserWavelength: Number(e.target.value)
                    })}
                    min="400"
                    max="15000"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on laser type
                  </div>
                </div>
                <div>
                  <Label>Laser Power (W)</Label>
                  <Input
                    type="number"
                    value={laserSpecs.laserPower}
                    onChange={(e) => setLaserSpecs({
                      ...laserSpecs,
                      laserPower: Number(e.target.value)
                    })}
                    min="100"
                    max="20000"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Focal Length (mm)</Label>
                  <Input
                    type="number"
                    value={laserSpecs.focalLength}
                    onChange={(e) => setLaserSpecs({
                      ...laserSpecs,
                      focalLength: Number(e.target.value)
                    })}
                    min="50"
                    max="500"
                  />
                </div>
                <div>
                  <Label>Beam Diameter (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={laserSpecs.beamDiameter}
                    onChange={(e) => setLaserSpecs({
                      ...laserSpecs,
                      beamDiameter: Number(e.target.value)
                    })}
                    min="1"
                    max="25"
                  />
                </div>
                <div>
                  <Label>Cutting Speed (mm/min)</Label>
                  <Input
                    type="number"
                    value={laserSpecs.cuttingSpeed}
                    onChange={(e) => setLaserSpecs({
                      ...laserSpecs,
                      cuttingSpeed: Number(e.target.value)
                    })}
                    min="100"
                    max="20000"
                    step="100"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cutting" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="target" size="sm" color="primary" className="mr-2" />
                Cutting Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cut Type</Label>
                  <Select
                    value={cuttingParams.cutType}
                    onChange={(value: 'through_cut' | 'marking' | 'engraving' | 'welding') => 
                      setCuttingParams({
                        ...cuttingParams,
                        cutType: value
                      })
                    }
                    options={cutTypeOptions}
                  />
                </div>
                <div>
                  <Label>Assist Gas</Label>
                  <Select
                    value={cuttingParams.gasType}
                    onChange={(value: 'oxygen' | 'nitrogen' | 'air' | 'argon') => 
                      setCuttingParams({
                        ...cuttingParams,
                        gasType: value
                      })
                    }
                    options={gasTypeOptions}
                  />
                </div>
                <div>
                  <Label>Desired Edge Quality</Label>
                  <Select
                    value={cuttingParams.desiredEdgeQuality}
                    onChange={(value: 'production' | 'standard' | 'high' | 'precision') => 
                      setCuttingParams({
                        ...cuttingParams,
                        desiredEdgeQuality: value
                      })
                    }
                    options={qualityOptions}
                  />
                </div>
              </div>
            </Card>

            {/* Cut Type Information */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Cut Type Focus Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Through Cut</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Focus 1/3 into material (thin)</li>
                    <li>• Focus at middle (medium thickness)</li>
                    <li>• Focus deeper for thick materials</li>
                    <li>• Optimizes edge quality balance</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Surface Operations</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Marking: Focus on surface</li>
                    <li>• Engraving: Focus on surface</li>
                    <li>• Welding: Focus on surface</li>
                    <li>• Maximizes surface interaction</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Icon name="globe" size="sm" color="primary" className="mr-2" />
                Environmental Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Temperature (°C)</Label>
                  <Input
                    type="number"
                    value={environmentalConditions.temperature}
                    onChange={(e) => setEnvironmentalConditions({
                      ...environmentalConditions,
                      temperature: Number(e.target.value)
                    })}
                    min="-10"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Humidity (%)</Label>
                  <Input
                    type="number"
                    value={environmentalConditions.humidity}
                    onChange={(e) => setEnvironmentalConditions({
                      ...environmentalConditions,
                      humidity: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Air Pressure (mbar)</Label>
                  <Input
                    type="number"
                    value={environmentalConditions.airPressure}
                    onChange={(e) => setEnvironmentalConditions({
                      ...environmentalConditions,
                      airPressure: Number(e.target.value)
                    })}
                    min="800"
                    max="1200"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={handleCalculate} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Calculating Focus Height...' : 'Calculate Optimal Focus Height'}
          </Button>
        </div>
      </CardContent>
    </Card>
    </ErrorBoundary>
  );
};

export default FocusHeightCalculatorForm;
