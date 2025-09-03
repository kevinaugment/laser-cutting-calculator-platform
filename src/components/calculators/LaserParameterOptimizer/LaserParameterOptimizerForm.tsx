import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Settings, Zap, Target, Gauge } from 'lucide-react';

interface LaserParameterOptimizerFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const LaserParameterOptimizerForm: React.FC<LaserParameterOptimizerFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [inputs, setInputs] = useState({
    materialType: 'mild_steel',
    thickness: 3.0,
    laserType: 'fiber',
    maxPower: 3000,
    qualityRequirement: 'standard',
    gasType: 'oxygen',
    focusLensLength: 125,
    nozzleDiameter: 1.5,
    partComplexity: 'medium',
    productionPriority: 'quality'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    if (!inputs.thickness || inputs.thickness < 0.1 || inputs.thickness > 50) {
      newErrors.thickness = 'Thickness must be between 0.1 and 50mm';
    }

    if (!inputs.maxPower || inputs.maxPower < 100 || inputs.maxPower > 20000) {
      newErrors.maxPower = 'Max power must be between 100 and 20,000W';
    }

    if (!inputs.focusLensLength || inputs.focusLensLength < 50 || inputs.focusLensLength > 300) {
      newErrors.focusLensLength = 'Focus lens length must be between 50 and 300mm';
    }

    if (!inputs.nozzleDiameter || inputs.nozzleDiameter < 0.5 || inputs.nozzleDiameter > 5) {
      newErrors.nozzleDiameter = 'Nozzle diameter must be between 0.5 and 5mm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      onCalculate(inputs);
    }
  };

  const materialOptions = [
    { value: 'mild_steel', label: 'Mild Steel (Carbon Steel)' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum Alloy' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' },
    { value: 'titanium', label: 'Titanium' }
  ];

  const laserTypeOptions = [
    { value: 'fiber', label: 'Fiber Laser' },
    { value: 'co2', label: 'CO2 Laser' },
    { value: 'nd_yag', label: 'Nd:YAG Laser' }
  ];

  const qualityOptions = [
    { value: 'draft', label: 'Draft - Fast cutting' },
    { value: 'standard', label: 'Standard - Balanced' },
    { value: 'high', label: 'High - Fine quality' },
    { value: 'precision', label: 'Precision - Ultra fine' }
  ];

  const gasTypeOptions = [
    { value: 'oxygen', label: 'Oxygen (O2)' },
    { value: 'nitrogen', label: 'Nitrogen (N2)' },
    { value: 'air', label: 'Compressed Air' }
  ];

  const complexityOptions = [
    { value: 'simple', label: 'Simple - Straight cuts' },
    { value: 'medium', label: 'Medium - Curves & details' },
    { value: 'complex', label: 'Complex - Intricate patterns' }
  ];

  const priorityOptions = [
    { value: 'speed', label: 'Speed - Maximize throughput' },
    { value: 'quality', label: 'Quality - Best edge finish' },
    { value: 'cost', label: 'Cost - Minimize operating cost' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          Parameter Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="material" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="material" className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                Material
              </TabsTrigger>
              <TabsTrigger value="laser" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Laser
              </TabsTrigger>
              <TabsTrigger value="quality" className="flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                Quality
              </TabsTrigger>
              <TabsTrigger value="optimization" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Goals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="material" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="materialType">Material Type</Label>
                  <Select
                    value={inputs.materialType}
                    onValueChange={(value) => handleInputChange('materialType', value)}
                    options={materialOptions}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Material affects cutting parameters and gas selection
                  </p>
                </div>

                <div>
                  <Label htmlFor="thickness">Material Thickness (mm)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    value={inputs.thickness}
                    onChange={(e) => handleInputChange('thickness', parseFloat(e.target.value))}
                    min="0.1"
                    max="50"
                    step="0.1"
                    className={errors.thickness ? 'border-red-500' : ''}
                  />
                  {errors.thickness && (
                    <p className="text-xs text-red-500 mt-1">{errors.thickness}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Range: 0.1 - 50mm
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="laser" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="laserType">Laser Type</Label>
                  <Select
                    value={inputs.laserType}
                    onValueChange={(value) => handleInputChange('laserType', value)}
                    options={laserTypeOptions}
                  />
                </div>

                <div>
                  <Label htmlFor="maxPower">Maximum Laser Power (W)</Label>
                  <Input
                    id="maxPower"
                    type="number"
                    value={inputs.maxPower}
                    onChange={(e) => handleInputChange('maxPower', parseInt(e.target.value))}
                    min="100"
                    max="20000"
                    step="100"
                    className={errors.maxPower ? 'border-red-500' : ''}
                  />
                  {errors.maxPower && (
                    <p className="text-xs text-red-500 mt-1">{errors.maxPower}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="focusLensLength">Focus Lens Length (mm)</Label>
                  <Input
                    id="focusLensLength"
                    type="number"
                    value={inputs.focusLensLength}
                    onChange={(e) => handleInputChange('focusLensLength', parseFloat(e.target.value))}
                    min="50"
                    max="300"
                    step="5"
                    className={errors.focusLensLength ? 'border-red-500' : ''}
                  />
                  {errors.focusLensLength && (
                    <p className="text-xs text-red-500 mt-1">{errors.focusLensLength}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nozzleDiameter">Nozzle Diameter (mm)</Label>
                  <Input
                    id="nozzleDiameter"
                    type="number"
                    value={inputs.nozzleDiameter}
                    onChange={(e) => handleInputChange('nozzleDiameter', parseFloat(e.target.value))}
                    min="0.5"
                    max="5"
                    step="0.1"
                    className={errors.nozzleDiameter ? 'border-red-500' : ''}
                  />
                  {errors.nozzleDiameter && (
                    <p className="text-xs text-red-500 mt-1">{errors.nozzleDiameter}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="qualityRequirement">Quality Requirement</Label>
                  <Select
                    value={inputs.qualityRequirement}
                    onValueChange={(value) => handleInputChange('qualityRequirement', value)}
                    options={qualityOptions}
                  />
                </div>

                <div>
                  <Label htmlFor="gasType">Assist Gas Type</Label>
                  <Select
                    value={inputs.gasType}
                    onValueChange={(value) => handleInputChange('gasType', value)}
                    options={gasTypeOptions}
                  />
                </div>

                <div>
                  <Label htmlFor="partComplexity">Part Complexity</Label>
                  <Select
                    value={inputs.partComplexity}
                    onValueChange={(value) => handleInputChange('partComplexity', value)}
                    options={complexityOptions}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              <div>
                <Label htmlFor="productionPriority">Production Priority</Label>
                <Select
                  value={inputs.productionPriority}
                  onValueChange={(value) => handleInputChange('productionPriority', value)}
                  options={priorityOptions}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This determines the optimization strategy for your parameters
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Optimization Strategy</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  {inputs.productionPriority === 'speed' && (
                    <p>• Maximize cutting speed and throughput</p>
                  )}
                  {inputs.productionPriority === 'quality' && (
                    <p>• Optimize for best edge quality and precision</p>
                  )}
                  {inputs.productionPriority === 'cost' && (
                    <p>• Minimize gas consumption and power usage</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Optimizing Parameters...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Optimize Parameters
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LaserParameterOptimizerForm;
