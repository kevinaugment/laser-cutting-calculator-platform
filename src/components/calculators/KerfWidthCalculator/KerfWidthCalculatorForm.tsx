import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Ruler, Settings, Zap, Target } from 'lucide-react';

interface KerfWidthCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const KerfWidthCalculatorForm: React.FC<KerfWidthCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('material');

  const [materialSpecs, setMaterialSpecs] = useState({
    materialType: 'carbon_steel',
    thickness: 5.0, // mm
    materialConstant: 0.16 // Auto-set based on material
  });

  const [laserParams, setLaserParams] = useState({
    laserPower: 1500, // W
    cuttingSpeed: 2500, // mm/min
    beamDiameter: 0.12, // mm
    pulseFrequency: 0 // Hz (0 for continuous wave)
  });

  const [gasSettings, setGasSettings] = useState({
    gasType: 'oxygen' as 'oxygen' | 'nitrogen' | 'air' | 'argon',
    gasPressure: 1.0 // bar
  });

  const [focusSettings, setFocusSettings] = useState({
    focusPosition: -1.67 // mm (relative to surface)
  });

  const handleCalculate = () => {
    const inputs = {
      // Material properties
      materialType: materialSpecs.materialType,
      thickness: materialSpecs.thickness,
      materialConstant: materialSpecs.materialConstant,
      
      // Laser parameters
      laserPower: laserParams.laserPower,
      cuttingSpeed: laserParams.cuttingSpeed,
      beamDiameter: laserParams.beamDiameter,
      pulseFrequency: laserParams.pulseFrequency,
      
      // Gas settings
      gasType: gasSettings.gasType,
      gasPressure: gasSettings.gasPressure,
      
      // Focus settings
      focusPosition: focusSettings.focusPosition
    };
    onCalculate(inputs);
  };

  const materialOptions = [
    { value: 'carbon_steel', label: 'Carbon Steel' },
    { value: 'mild_steel', label: 'Mild Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' },
    { value: 'titanium', label: 'Titanium' }
  ];

  const gasTypeOptions = [
    { value: 'oxygen', label: 'Oxygen (O₂)' },
    { value: 'nitrogen', label: 'Nitrogen (N₂)' },
    { value: 'air', label: 'Compressed Air' },
    { value: 'argon', label: 'Argon (Ar)' }
  ];

  // Update material constant when material type changes
  const handleMaterialTypeChange = (value: string) => {
    const materialConstants: Record<string, number> = {
      'mild_steel': 0.15,
      'stainless_steel': 0.18,
      'aluminum': 0.12,
      'carbon_steel': 0.16,
      'copper': 0.20,
      'brass': 0.17,
      'titanium': 0.22
    };
    
    setMaterialSpecs({
      ...materialSpecs,
      materialType: value,
      materialConstant: materialConstants[value] || 0.16
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Ruler className="h-5 w-5" />
          <span>Kerf Width Calculator</span>
          <Badge variant="outline">Precision Cutting</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="laser">Laser</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
          </TabsList>

          <TabsContent value="material" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Material Properties
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Material Type</Label>
                  <Select
                    value={materialSpecs.materialType}
                    onChange={handleMaterialTypeChange}
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
                    min="0.5"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Material Constant</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={materialSpecs.materialConstant}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      materialConstant: Number(e.target.value)
                    })}
                    min="0.05"
                    max="0.50"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
              </div>
            </Card>

            {/* Material Constants Reference */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Material Constants Reference</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="font-medium text-blue-600">Aluminum</div>
                  <div className="text-muted-foreground">0.12</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Mild Steel</div>
                  <div className="text-muted-foreground">0.15</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Carbon Steel</div>
                  <div className="text-muted-foreground">0.16</div>
                </div>
                <div>
                  <div className="font-medium text-yellow-600">Brass</div>
                  <div className="text-muted-foreground">0.17</div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">Stainless Steel</div>
                  <div className="text-muted-foreground">0.18</div>
                </div>
                <div>
                  <div className="font-medium text-orange-600">Copper</div>
                  <div className="text-muted-foreground">0.20</div>
                </div>
                <div>
                  <div className="font-medium text-purple-600">Titanium</div>
                  <div className="text-muted-foreground">0.22</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="laser" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Laser Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Laser Power (W)</Label>
                  <Input
                    type="number"
                    value={laserParams.laserPower}
                    onChange={(e) => setLaserParams({
                      ...laserParams,
                      laserPower: Number(e.target.value)
                    })}
                    min="100"
                    max="20000"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Cutting Speed (mm/min)</Label>
                  <Input
                    type="number"
                    value={laserParams.cuttingSpeed}
                    onChange={(e) => setLaserParams({
                      ...laserParams,
                      cuttingSpeed: Number(e.target.value)
                    })}
                    min="100"
                    max="20000"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Beam Diameter (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={laserParams.beamDiameter}
                    onChange={(e) => setLaserParams({
                      ...laserParams,
                      beamDiameter: Number(e.target.value)
                    })}
                    min="0.05"
                    max="1.0"
                  />
                </div>
                <div>
                  <Label>Pulse Frequency (Hz)</Label>
                  <Input
                    type="number"
                    value={laserParams.pulseFrequency}
                    onChange={(e) => setLaserParams({
                      ...laserParams,
                      pulseFrequency: Number(e.target.value)
                    })}
                    min="0"
                    max="50000"
                    step="100"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    0 for continuous wave (CW) mode
                  </div>
                </div>
              </div>
            </Card>

            {/* Power Density Calculation */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Power Density Calculation</h4>
              <div className="text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong>Current Power Density:</strong> {' '}
                  {(laserParams.laserPower / (Math.PI * Math.pow(laserParams.beamDiameter / 2, 2))).toFixed(0)} W/mm²
                </div>
                <div>
                  Power Density = Laser Power ÷ (π × (Beam Diameter ÷ 2)²)
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gas" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Gas Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gas Type</Label>
                  <Select
                    value={gasSettings.gasType}
                    onChange={(value: 'oxygen' | 'nitrogen' | 'air' | 'argon') => 
                      setGasSettings({
                        ...gasSettings,
                        gasType: value
                      })
                    }
                    options={gasTypeOptions}
                  />
                </div>
                <div>
                  <Label>Gas Pressure (bar)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={gasSettings.gasPressure}
                    onChange={(e) => setGasSettings({
                      ...gasSettings,
                      gasPressure: Number(e.target.value)
                    })}
                    min="0.1"
                    max="20"
                  />
                </div>
              </div>
            </Card>

            {/* Gas Type Effects */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Gas Type Effects on Kerf Width</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Oxygen (O₂)</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Slightly wider kerf (+10%)</li>
                    <li>• Combustion assistance</li>
                    <li>• Good for carbon steel</li>
                    <li>• Oxidized edge surface</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Nitrogen (N₂)</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Narrower kerf (-5%)</li>
                    <li>• Clean, oxide-free cuts</li>
                    <li>• Best for stainless steel</li>
                    <li>• Premium surface finish</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-yellow-600 mb-2">Compressed Air</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Moderate kerf width (+5%)</li>
                    <li>• Most economical option</li>
                    <li>• Good for thin materials</li>
                    <li>• Some oxidation possible</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-600 mb-2">Argon (Ar)</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Narrowest kerf (-10%)</li>
                    <li>• Inert gas protection</li>
                    <li>• Specialty applications</li>
                    <li>• High cost</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="focus" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Focus Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Focus Position (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={focusSettings.focusPosition}
                    onChange={(e) => setFocusSettings({
                      ...focusSettings,
                      focusPosition: Number(e.target.value)
                    })}
                    min="-10"
                    max="5"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Negative: below surface, Positive: above surface
                  </div>
                </div>
              </div>
            </Card>

            {/* Focus Position Effects */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Focus Position Effects</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-semibold text-blue-600">On Surface (0mm)</h5>
                  <p className="text-muted-foreground">Narrowest kerf, best for thin materials and marking</p>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600">Below Surface (negative)</h5>
                  <p className="text-muted-foreground">Optimal for through cutting, kerf width increases with depth</p>
                </div>
                <div>
                  <h5 className="font-semibold text-yellow-600">Above Surface (positive)</h5>
                  <p className="text-muted-foreground">Wider kerf, used for special applications</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> For {materialSpecs.thickness}mm material, optimal focus is typically around{' '}
                    {(-materialSpecs.thickness / 3).toFixed(1)}mm (1/3 into material thickness)
                  </p>
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
            {isLoading ? 'Calculating Kerf Width...' : 'Calculate Kerf Width'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KerfWidthCalculatorForm;
