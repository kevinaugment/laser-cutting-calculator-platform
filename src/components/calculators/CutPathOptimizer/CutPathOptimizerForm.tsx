import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Route, Settings, Target, Zap, Plus, Trash2 } from 'lucide-react';

interface CutPathOptimizerFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const CutPathOptimizerForm: React.FC<CutPathOptimizerFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('sheet');

  const [sheetDimensions, setSheetDimensions] = useState({
    length: 1000, // mm
    width: 500 // mm
  });

  const [cutFeatures, setCutFeatures] = useState([
    {
      id: 'FEAT001',
      type: 'external' as 'external' | 'internal' | 'hole' | 'slot' | 'notch',
      priority: 'high' as 'low' | 'medium' | 'high' | 'critical',
      startPoint: { x: 50, y: 50 },
      endPoint: { x: 200, y: 50 },
      length: 150, // mm
      complexity: 'simple' as 'simple' | 'moderate' | 'complex',
      thermalSensitive: false,
      requiresPrecision: true,
      partId: 'PART001'
    },
    {
      id: 'FEAT002',
      type: 'hole' as 'external' | 'internal' | 'hole' | 'slot' | 'notch',
      priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
      startPoint: { x: 300, y: 100 },
      endPoint: { x: 300, y: 100 },
      length: 31.4, // mm (circle circumference, diameter 10mm)
      complexity: 'simple' as 'simple' | 'moderate' | 'complex',
      thermalSensitive: true,
      requiresPrecision: true,
      partId: 'PART001'
    }
  ]);

  const [cuttingParameters, setCuttingParameters] = useState({
    cuttingSpeed: 2500, // mm/min
    rapidSpeed: 15000, // mm/min
    pierceTime: 0.8, // seconds
    leadInLength: 2.0, // mm
    leadOutLength: 2.0, // mm
    kerfWidth: 0.15 // mm
  });

  const [optimizationGoals, setOptimizationGoals] = useState({
    minimizeCuttingTime: 40, // weight 0-100
    minimizeThermalDistortion: 25, // weight 0-100
    maximizeQuality: 25, // weight 0-100
    minimizeWear: 10 // weight 0-100
  });

  const [constraints, setConstraints] = useState({
    maxContinuousCuttingTime: 15, // minutes
    coolingBreakDuration: 30, // seconds
    startPosition: { x: 0, y: 0 }, // mm
    endPosition: { x: 0, y: 0 }, // mm
    allowBridging: true,
    bridgeLength: 2.0 // mm
  });

  const [materialProperties, setMaterialProperties] = useState({
    materialType: 'mild_steel',
    thickness: 3.0, // mm
    thermalConductivity: 50, // W/m·K
    heatCapacity: 460, // J/kg·K
    thermalExpansion: 12e-6 // 1/K
  });

  const [qualityRequirements, setQualityRequirements] = useState({
    dimensionalTolerance: 0.1, // mm
    surfaceFinish: 'standard' as 'rough' | 'standard' | 'smooth' | 'mirror',
    edgeQuality: 'standard' as 'production' | 'standard' | 'precision'
  });

  const handleCalculate = () => {
    const inputs = {
      sheetDimensions,
      cutFeatures,
      cuttingParameters,
      optimizationGoals,
      constraints,
      materialProperties,
      qualityRequirements
    };
    onCalculate(inputs);
  };

  const addFeature = () => {
    const newFeature = {
      id: `FEAT${String(cutFeatures.length + 1).padStart(3, '0')}`,
      type: 'external' as 'external' | 'internal' | 'hole' | 'slot' | 'notch',
      priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
      startPoint: { x: 100, y: 100 },
      endPoint: { x: 200, y: 100 },
      length: 100,
      complexity: 'simple' as 'simple' | 'moderate' | 'complex',
      thermalSensitive: false,
      requiresPrecision: false,
      partId: 'PART001'
    };
    setCutFeatures([...cutFeatures, newFeature]);
  };

  const removeFeature = (index: number) => {
    setCutFeatures(cutFeatures.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: string, value: any) => {
    const updatedFeatures = [...cutFeatures];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [parent]: {
          ...updatedFeatures[index][parent],
          [child]: value
        }
      };
    } else {
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    }
    setCutFeatures(updatedFeatures);
  };

  const featureTypeOptions = [
    { value: 'external', label: 'External Contour' },
    { value: 'internal', label: 'Internal Feature' },
    { value: 'hole', label: 'Hole/Circle' },
    { value: 'slot', label: 'Slot' },
    { value: 'notch', label: 'Notch' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical' }
  ];

  const complexityOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'complex', label: 'Complex' }
  ];

  const materialOptions = [
    { value: 'mild_steel', label: 'Mild Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' },
    { value: 'titanium', label: 'Titanium' }
  ];

  const surfaceFinishOptions = [
    { value: 'rough', label: 'Rough Cut' },
    { value: 'standard', label: 'Standard Finish' },
    { value: 'smooth', label: 'Smooth Finish' },
    { value: 'mirror', label: 'Mirror Finish' }
  ];

  const edgeQualityOptions = [
    { value: 'production', label: 'Production Quality' },
    { value: 'standard', label: 'Standard Quality' },
    { value: 'precision', label: 'Precision Quality' }
  ];

  // Update material properties when material type changes
  const handleMaterialTypeChange = (value: string) => {
    const materialProps: Record<string, any> = {
      'mild_steel': { thermalConductivity: 50, heatCapacity: 460, thermalExpansion: 12e-6 },
      'stainless_steel': { thermalConductivity: 16, heatCapacity: 500, thermalExpansion: 17e-6 },
      'aluminum': { thermalConductivity: 237, heatCapacity: 900, thermalExpansion: 23e-6 },
      'copper': { thermalConductivity: 400, heatCapacity: 385, thermalExpansion: 17e-6 },
      'brass': { thermalConductivity: 120, heatCapacity: 380, thermalExpansion: 19e-6 },
      'titanium': { thermalConductivity: 22, heatCapacity: 520, thermalExpansion: 8.6e-6 }
    };
    
    const props = materialProps[value] || materialProps['mild_steel'];
    setMaterialProperties({
      ...materialProperties,
      materialType: value,
      ...props
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Route className="h-5 w-5" />
          <span>Cut Path Optimizer</span>
          <Badge variant="outline">Path Planning</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sheet">Sheet</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
          </TabsList>

          <TabsContent value="sheet" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Sheet Dimensions & Material
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Sheet Length (mm)</Label>
                  <Input
                    type="number"
                    value={sheetDimensions.length}
                    onChange={(e) => setSheetDimensions({
                      ...sheetDimensions,
                      length: Number(e.target.value)
                    })}
                    min="100"
                    max="6000"
                    step="10"
                  />
                </div>
                <div>
                  <Label>Sheet Width (mm)</Label>
                  <Input
                    type="number"
                    value={sheetDimensions.width}
                    onChange={(e) => setSheetDimensions({
                      ...sheetDimensions,
                      width: Number(e.target.value)
                    })}
                    min="100"
                    max="3000"
                    step="10"
                  />
                </div>
                <div>
                  <Label>Material Type</Label>
                  <Select
                    value={materialProperties.materialType}
                    onChange={handleMaterialTypeChange}
                    options={materialOptions}
                  />
                </div>
                <div>
                  <Label>Thickness (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={materialProperties.thickness}
                    onChange={(e) => setMaterialProperties({
                      ...materialProperties,
                      thickness: Number(e.target.value)
                    })}
                    min="0.5"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Thermal Conductivity (W/m·K)</Label>
                  <Input
                    type="number"
                    value={materialProperties.thermalConductivity}
                    onChange={(e) => setMaterialProperties({
                      ...materialProperties,
                      thermalConductivity: Number(e.target.value)
                    })}
                    min="1"
                    max="500"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
                <div>
                  <Label>Heat Capacity (J/kg·K)</Label>
                  <Input
                    type="number"
                    value={materialProperties.heatCapacity}
                    onChange={(e) => setMaterialProperties({
                      ...materialProperties,
                      heatCapacity: Number(e.target.value)
                    })}
                    min="100"
                    max="1000"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
              </div>
            </Card>

            {/* Sheet Visualization */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Sheet Overview</h4>
              <div className="text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong>Sheet Area:</strong> {' '}
                  {(sheetDimensions.length * sheetDimensions.width / 1000000).toFixed(2)} m²
                </div>
                <div className="mb-2">
                  <strong>Aspect Ratio:</strong> {' '}
                  {(sheetDimensions.length / sheetDimensions.width).toFixed(2)}:1
                </div>
                <div>
                  <strong>Diagonal Distance:</strong> {' '}
                  {Math.sqrt(sheetDimensions.length ** 2 + sheetDimensions.width ** 2).toFixed(0)} mm
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Cut Features ({cutFeatures.length} features)
                </h4>
                <Button onClick={addFeature} size="sm" className="flex items-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Feature</span>
                </Button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cutFeatures.map((feature, index) => (
                  <Card key={feature.id} className="p-3 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{feature.id}</h5>
                        <div className="text-sm text-muted-foreground">Part: {feature.partId}</div>
                      </div>
                      <Button 
                        onClick={() => removeFeature(index)} 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Feature Type</Label>
                        <Select
                          value={feature.type}
                          onChange={(value) => updateFeature(index, 'type', value)}
                          options={featureTypeOptions}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Priority</Label>
                        <Select
                          value={feature.priority}
                          onChange={(value) => updateFeature(index, 'priority', value)}
                          options={priorityOptions}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Complexity</Label>
                        <Select
                          value={feature.complexity}
                          onChange={(value) => updateFeature(index, 'complexity', value)}
                          options={complexityOptions}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Start X (mm)</Label>
                        <Input
                          type="number"
                          value={feature.startPoint.x}
                          onChange={(e) => updateFeature(index, 'startPoint.x', Number(e.target.value))}
                          min="0"
                          max={sheetDimensions.length}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Start Y (mm)</Label>
                        <Input
                          type="number"
                          value={feature.startPoint.y}
                          onChange={(e) => updateFeature(index, 'startPoint.y', Number(e.target.value))}
                          min="0"
                          max={sheetDimensions.width}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Length (mm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={feature.length}
                          onChange={(e) => updateFeature(index, 'length', Number(e.target.value))}
                          min="1"
                          max="1000"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`thermal-${index}`}
                          checked={feature.thermalSensitive}
                          onChange={(e) => updateFeature(index, 'thermalSensitive', e.target.checked)}
                        />
                        <Label htmlFor={`thermal-${index}`} className="text-xs">Thermal Sensitive</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`precision-${index}`}
                          checked={feature.requiresPrecision}
                          onChange={(e) => updateFeature(index, 'requiresPrecision', e.target.checked)}
                        />
                        <Label htmlFor={`precision-${index}`} className="text-xs">Requires Precision</Label>
                      </div>
                      <div>
                        <Label className="text-xs">Part ID</Label>
                        <Input
                          type="text"
                          value={feature.partId}
                          onChange={(e) => updateFeature(index, 'partId', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Features Summary */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Features Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-lg font-bold text-blue-600">{cutFeatures.length}</div>
                  <div className="text-muted-foreground">Total Features</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {cutFeatures.reduce((sum, f) => sum + f.length, 0).toFixed(1)}
                  </div>
                  <div className="text-muted-foreground">Total Length (mm)</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {cutFeatures.filter(f => f.thermalSensitive).length}
                  </div>
                  <div className="text-muted-foreground">Thermal Sensitive</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {cutFeatures.filter(f => f.priority === 'high' || f.priority === 'critical').length}
                  </div>
                  <div className="text-muted-foreground">High Priority</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Cutting Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cutting Speed (mm/min)</Label>
                  <Input
                    type="number"
                    value={cuttingParameters.cuttingSpeed}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      cuttingSpeed: Number(e.target.value)
                    })}
                    min="100"
                    max="15000"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Rapid Speed (mm/min)</Label>
                  <Input
                    type="number"
                    value={cuttingParameters.rapidSpeed}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      rapidSpeed: Number(e.target.value)
                    })}
                    min="1000"
                    max="30000"
                    step="500"
                  />
                </div>
                <div>
                  <Label>Pierce Time (seconds)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParameters.pierceTime}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      pierceTime: Number(e.target.value)
                    })}
                    min="0.1"
                    max="5.0"
                  />
                </div>
                <div>
                  <Label>Lead-In Length (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParameters.leadInLength}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      leadInLength: Number(e.target.value)
                    })}
                    min="0.5"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Lead-Out Length (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParameters.leadOutLength}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      leadOutLength: Number(e.target.value)
                    })}
                    min="0.5"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Kerf Width (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cuttingParameters.kerfWidth}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      kerfWidth: Number(e.target.value)
                    })}
                    min="0.05"
                    max="0.5"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Process Constraints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Max Continuous Cutting (min)</Label>
                  <Input
                    type="number"
                    value={constraints.maxContinuousCuttingTime}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      maxContinuousCuttingTime: Number(e.target.value)
                    })}
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <Label>Cooling Break Duration (sec)</Label>
                  <Input
                    type="number"
                    value={constraints.coolingBreakDuration}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      coolingBreakDuration: Number(e.target.value)
                    })}
                    min="10"
                    max="300"
                  />
                </div>
                <div>
                  <Label>Bridge Length (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={constraints.bridgeLength}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      bridgeLength: Number(e.target.value)
                    })}
                    min="0.5"
                    max="10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowBridging"
                    checked={constraints.allowBridging}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      allowBridging: e.target.checked
                    })}
                  />
                  <Label htmlFor="allowBridging">Allow Bridging</Label>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Optimization Goals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Minimize Cutting Time (%)</Label>
                  <Input
                    type="number"
                    value={optimizationGoals.minimizeCuttingTime}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      minimizeCuttingTime: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Minimize Thermal Distortion (%)</Label>
                  <Input
                    type="number"
                    value={optimizationGoals.minimizeThermalDistortion}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      minimizeThermalDistortion: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Maximize Quality (%)</Label>
                  <Input
                    type="number"
                    value={optimizationGoals.maximizeQuality}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      maximizeQuality: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Minimize Wear (%)</Label>
                  <Input
                    type="number"
                    value={optimizationGoals.minimizeWear}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      minimizeWear: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </Card>

            {/* Goals Visualization */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Goals Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cutting Time</span>
                  <span>{optimizationGoals.minimizeCuttingTime}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.minimizeCuttingTime}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Thermal Distortion</span>
                  <span>{optimizationGoals.minimizeThermalDistortion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.minimizeThermalDistortion}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Quality</span>
                  <span>{optimizationGoals.maximizeQuality}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.maximizeQuality}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Minimize Wear</span>
                  <span>{optimizationGoals.minimizeWear}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.minimizeWear}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>Total Weight:</strong> {' '}
                {optimizationGoals.minimizeCuttingTime + optimizationGoals.minimizeThermalDistortion + 
                 optimizationGoals.maximizeQuality + optimizationGoals.minimizeWear}%
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Quality Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Dimensional Tolerance (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={qualityRequirements.dimensionalTolerance}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      dimensionalTolerance: Number(e.target.value)
                    })}
                    min="0.01"
                    max="1.0"
                  />
                </div>
                <div>
                  <Label>Surface Finish</Label>
                  <Select
                    value={qualityRequirements.surfaceFinish}
                    onChange={(value) => setQualityRequirements({
                      ...qualityRequirements,
                      surfaceFinish: value as any
                    })}
                    options={surfaceFinishOptions}
                  />
                </div>
                <div>
                  <Label>Edge Quality</Label>
                  <Select
                    value={qualityRequirements.edgeQuality}
                    onChange={(value) => setQualityRequirements({
                      ...qualityRequirements,
                      edgeQuality: value as any
                    })}
                    options={edgeQualityOptions}
                  />
                </div>
              </div>
            </Card>

            {/* Quality Requirements Guide */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Quality Requirements Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Precision Applications</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Aerospace components (±0.02mm tolerance)</li>
                    <li>• Medical devices (±0.01mm tolerance)</li>
                    <li>• Precision instruments (±0.05mm tolerance)</li>
                    <li>• Tool and die components (±0.03mm tolerance)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">General Applications</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Structural components (±0.2mm tolerance)</li>
                    <li>• Decorative parts (±0.3mm tolerance)</li>
                    <li>• Prototype parts (±0.1mm tolerance)</li>
                    <li>• General fabrication (±0.5mm tolerance)</li>
                  </ul>
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
            {isLoading ? 'Optimizing Cut Path...' : 'Optimize Cut Path'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CutPathOptimizerForm;
