import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Calculator, Settings, Zap, Target, Clock } from 'lucide-react';

interface CuttingTimeInputs {
  totalLength: number;
  pierceCount: number;
  complexity: 'simple' | 'medium' | 'complex';
  materialType: string;
  thickness: number;
  laserPower: number;
  cuttingSpeed: number;
  pierceTime: number;
  gasType: string;
  qualityLevel: 'fast' | 'standard' | 'high';
  setupTime: number;
  partQuantity: number;
}

interface CuttingTimeEstimatorFormProps {
  inputs: CuttingTimeInputs;
  onInputsChange: (inputs: CuttingTimeInputs) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

const CuttingTimeEstimatorForm: React.FC<CuttingTimeEstimatorFormProps> = ({
  inputs,
  onInputsChange,
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('geometry');

  const updateInput = (field: keyof CuttingTimeInputs, value: any) => {
    onInputsChange({
      ...inputs,
      [field]: value
    });
  };

  const materialTypes = [
    { value: 'mild_steel', label: 'Mild Steel', speed: 3000 },
    { value: 'stainless_steel', label: 'Stainless Steel', speed: 2500 },
    { value: 'aluminum', label: 'Aluminum', speed: 4000 },
    { value: 'copper', label: 'Copper', speed: 2000 },
    { value: 'brass', label: 'Brass', speed: 2800 },
    { value: 'titanium', label: 'Titanium', speed: 1500 }
  ];

  const gasTypes = [
    { value: 'oxygen', label: 'Oxygen', pierceTime: 0.8 },
    { value: 'nitrogen', label: 'Nitrogen', pierceTime: 1.2 },
    { value: 'air', label: 'Compressed Air', pierceTime: 1.0 },
    { value: 'argon', label: 'Argon', pierceTime: 1.5 }
  ];

  // Auto-update cutting speed when material changes
  const handleMaterialChange = (materialType: string) => {
    const material = materialTypes.find(m => m.value === materialType);
    if (material) {
      updateInput('materialType', materialType);
      updateInput('cuttingSpeed', material.speed);
    }
  };

  // Auto-update pierce time when gas changes
  const handleGasChange = (gasType: string) => {
    const gas = gasTypes.find(g => g.value === gasType);
    if (gas) {
      updateInput('gasType', gasType);
      updateInput('pierceTime', gas.pierceTime);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geometry" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Geometry
          </TabsTrigger>
          <TabsTrigger value="material" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Material
          </TabsTrigger>
          <TabsTrigger value="laser" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Laser
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Production
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geometry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Geometry Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalLength">Total Cut Length (mm)</Label>
                  <Input
                    id="totalLength"
                    type="number"
                    value={inputs.totalLength}
                    onChange={(e) => updateInput('totalLength', parseFloat(e.target.value) || 0)}
                    placeholder="1000"
                    min="1"
                    step="1"
                  />
                  <p className="text-sm text-gray-500">Total length of all cutting paths</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pierceCount">Number of Pierces</Label>
                  <Input
                    id="pierceCount"
                    type="number"
                    value={inputs.pierceCount}
                    onChange={(e) => updateInput('pierceCount', parseInt(e.target.value) || 0)}
                    placeholder="4"
                    min="1"
                    step="1"
                  />
                  <p className="text-sm text-gray-500">Number of pierce points required</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complexity">Geometry Complexity</Label>
                  <Select
                    value={inputs.complexity}
                    onChange={(value: string) => updateInput('complexity', value)}
                    options={[
                      { value: 'simple', label: 'Simple - Straight cuts, basic shapes' },
                      { value: 'medium', label: 'Medium - Curves, moderate detail' },
                      { value: 'complex', label: 'Complex - Intricate patterns, tight tolerances' }
                    ]}
                    placeholder="Select complexity level"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="material" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Material Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materialType">Material Type</Label>
                  <Select
                    value={inputs.materialType}
                    onChange={handleMaterialChange}
                    options={materialTypes}
                    placeholder="Select material"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thickness">Thickness (mm)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    value={inputs.thickness}
                    onChange={(e) => updateInput('thickness', parseFloat(e.target.value) || 0)}
                    placeholder="3.0"
                    min="0.1"
                    max="50"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gasType">Assist Gas</Label>
                  <Select
                    value={inputs.gasType}
                    onChange={handleGasChange}
                    options={gasTypes}
                    placeholder="Select gas type"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualityLevel">Quality Level</Label>
                  <Select
                    value={inputs.qualityLevel}
                    onChange={(value: string) => updateInput('qualityLevel', value)}
                    options={[
                      { value: 'fast', label: 'Fast - Production speed priority' },
                      { value: 'standard', label: 'Standard - Balanced speed/quality' },
                      { value: 'high', label: 'High - Quality priority' }
                    ]}
                    placeholder="Select quality"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="laser" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Laser Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laserPower">Laser Power (W)</Label>
                  <Input
                    id="laserPower"
                    type="number"
                    value={inputs.laserPower}
                    onChange={(e) => updateInput('laserPower', parseFloat(e.target.value) || 0)}
                    placeholder="2000"
                    min="500"
                    max="15000"
                    step="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuttingSpeed">Cutting Speed (mm/min)</Label>
                  <Input
                    id="cuttingSpeed"
                    type="number"
                    value={inputs.cuttingSpeed}
                    onChange={(e) => updateInput('cuttingSpeed', parseFloat(e.target.value) || 0)}
                    placeholder="3000"
                    min="100"
                    max="10000"
                    step="100"
                  />
                  <p className="text-sm text-gray-500">Auto-updated based on material selection</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pierceTime">Pierce Time (seconds)</Label>
                  <Input
                    id="pierceTime"
                    type="number"
                    value={inputs.pierceTime}
                    onChange={(e) => updateInput('pierceTime', parseFloat(e.target.value) || 0)}
                    placeholder="0.8"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500">Auto-updated based on gas selection</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Production Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="setupTime">Setup Time (minutes)</Label>
                  <Input
                    id="setupTime"
                    type="number"
                    value={inputs.setupTime}
                    onChange={(e) => updateInput('setupTime', parseFloat(e.target.value) || 0)}
                    placeholder="5"
                    min="0"
                    max="60"
                    step="0.5"
                  />
                  <p className="text-sm text-gray-500">Time for material loading and setup</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partQuantity">Part Quantity</Label>
                  <Input
                    id="partQuantity"
                    type="number"
                    value={inputs.partQuantity}
                    onChange={(e) => updateInput('partQuantity', parseInt(e.target.value) || 1)}
                    placeholder="1"
                    min="1"
                    max="1000"
                    step="1"
                  />
                  <p className="text-sm text-gray-500">Number of parts to produce</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calculate Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={onCalculate}
          disabled={isLoading}
          size="lg"
          className="px-8 py-3 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Calculator className="mr-2 h-5 w-5 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Cutting Time
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CuttingTimeEstimatorForm;
