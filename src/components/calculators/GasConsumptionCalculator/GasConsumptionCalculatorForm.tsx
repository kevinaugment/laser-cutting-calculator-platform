import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Wind, Settings, DollarSign, BarChart3 } from 'lucide-react';

interface GasConsumptionCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const GasConsumptionCalculatorForm: React.FC<GasConsumptionCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('material');

  const [materialSpecs, setMaterialSpecs] = useState({
    materialType: 'carbon_steel',
    thickness: 3.0, // mm
    cuttingLength: 5000, // mm total cutting path
    piercingPoints: 25,
    quantity: 50 // number of parts
  });

  const [cuttingParams, setCuttingParams] = useState({
    cuttingSpeed: 3000, // mm/min
    cuttingTime: 10, // minutes
    setupTime: 5, // minutes
    idleTime: 3 // minutes with gas flowing but not cutting
  });

  const [gasSettings, setGasSettings] = useState({
    gasType: 'oxygen' as 'oxygen' | 'nitrogen' | 'air' | 'argon',
    gasFlow: 15, // L/min
    gasPressure: 1.2, // bar
    efficiency: 0.85 // gas utilization efficiency
  });

  const [costFactors, setCostFactors] = useState({
    gasPrice: 0.15, // $ per m³
    optimizeForCost: true,
    optimizeForQuality: false
  });

  const handleCalculate = () => {
    const inputs = {
      // Material properties
      materialType: materialSpecs.materialType,
      materialThickness: materialSpecs.thickness,
      thickness: materialSpecs.thickness, // for compatibility
      
      // Cutting parameters
      cuttingLength: materialSpecs.cuttingLength,
      cuttingSpeed: cuttingParams.cuttingSpeed,
      cuttingTime: cuttingParams.cuttingTime,
      piercingPoints: materialSpecs.piercingPoints,
      piercingCount: materialSpecs.piercingPoints, // for compatibility
      setupTime: cuttingParams.setupTime,
      idleTime: cuttingParams.idleTime,
      
      // Gas settings
      gasType: gasSettings.gasType,
      gasFlow: gasSettings.gasFlow,
      gasPressure: gasSettings.gasPressure,
      efficiency: gasSettings.efficiency,
      
      // Economic factors
      gasPrice: costFactors.gasPrice,
      quantity: materialSpecs.quantity,
      
      // Optimization parameters
      optimizeForCost: costFactors.optimizeForCost,
      optimizeForQuality: costFactors.optimizeForQuality
    };
    onCalculate(inputs);
  };

  const materialOptions = [
    { value: 'carbon_steel', label: 'Carbon Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' },
    { value: 'titanium', label: 'Titanium' },
    { value: 'acrylic', label: 'Acrylic' },
    { value: 'wood', label: 'Wood' }
  ];

  const gasTypeOptions = [
    { value: 'oxygen', label: 'Oxygen (O₂)' },
    { value: 'nitrogen', label: 'Nitrogen (N₂)' },
    { value: 'air', label: 'Compressed Air' },
    { value: 'argon', label: 'Argon (Ar)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wind className="h-5 w-5" />
          <span>Gas Consumption Calculator</span>
          <Badge variant="outline">Cost Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="cutting">Cutting</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
          </TabsList>

          <TabsContent value="material" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Material Specifications
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
                  <Label>Total Cutting Length (mm)</Label>
                  <Input
                    type="number"
                    value={materialSpecs.cuttingLength}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      cuttingLength: Number(e.target.value)
                    })}
                    min="100"
                    max="100000"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Piercing Points</Label>
                  <Input
                    type="number"
                    value={materialSpecs.piercingPoints}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      piercingPoints: Number(e.target.value)
                    })}
                    min="1"
                    max="500"
                  />
                </div>
                <div>
                  <Label>Quantity (parts)</Label>
                  <Input
                    type="number"
                    value={materialSpecs.quantity}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      quantity: Number(e.target.value)
                    })}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cutting" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Cutting Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cutting Speed (mm/min)</Label>
                  <Input
                    type="number"
                    value={cuttingParams.cuttingSpeed}
                    onChange={(e) => setCuttingParams({
                      ...cuttingParams,
                      cuttingSpeed: Number(e.target.value)
                    })}
                    min="100"
                    max="20000"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Cutting Time (minutes)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParams.cuttingTime}
                    onChange={(e) => setCuttingParams({
                      ...cuttingParams,
                      cuttingTime: Number(e.target.value)
                    })}
                    min="0.1"
                    max="480"
                  />
                </div>
                <div>
                  <Label>Setup Time (minutes)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParams.setupTime}
                    onChange={(e) => setCuttingParams({
                      ...cuttingParams,
                      setupTime: Number(e.target.value)
                    })}
                    min="0"
                    max="60"
                  />
                </div>
                <div>
                  <Label>Idle Time (minutes)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParams.idleTime}
                    onChange={(e) => setCuttingParams({
                      ...cuttingParams,
                      idleTime: Number(e.target.value)
                    })}
                    min="0"
                    max="120"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gas" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Wind className="h-4 w-4 mr-2" />
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
                  <Label>Gas Flow Rate (L/min)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={gasSettings.gasFlow}
                    onChange={(e) => setGasSettings({
                      ...gasSettings,
                      gasFlow: Number(e.target.value)
                    })}
                    min="1"
                    max="100"
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
                <div>
                  <Label>Gas Efficiency (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={gasSettings.efficiency * 100}
                    onChange={(e) => setGasSettings({
                      ...gasSettings,
                      efficiency: Number(e.target.value) / 100
                    })}
                    min="70"
                    max="95"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cost" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Cost Factors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gas Price ($/m³)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costFactors.gasPrice}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      gasPrice: Number(e.target.value)
                    })}
                    min="0.01"
                    max="1.00"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="optimizeForCost"
                      checked={costFactors.optimizeForCost}
                      onChange={(e) => setCostFactors({
                        ...costFactors,
                        optimizeForCost: e.target.checked
                      })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="optimizeForCost">Optimize for Cost</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="optimizeForQuality"
                      checked={costFactors.optimizeForQuality}
                      onChange={(e) => setCostFactors({
                        ...costFactors,
                        optimizeForQuality: e.target.checked
                      })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="optimizeForQuality">Optimize for Quality</Label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Gas Type Information */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Gas Type Characteristics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">Oxygen (O₂)</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Best for carbon steel cutting</li>
                    <li>• High cutting speeds</li>
                    <li>• Creates oxidized edge</li>
                    <li>• Lower gas consumption</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Nitrogen (N₂)</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Clean, oxide-free cuts</li>
                    <li>• Best for stainless steel</li>
                    <li>• Higher gas consumption</li>
                    <li>• Premium edge quality</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-yellow-600 mb-2">Compressed Air</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Most economical option</li>
                    <li>• Good for thin materials</li>
                    <li>• Moderate edge quality</li>
                    <li>• Widely available</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-600 mb-2">Argon (Ar)</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Specialty applications</li>
                    <li>• Titanium and exotic alloys</li>
                    <li>• Highest cost</li>
                    <li>• Superior edge quality</li>
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
            {isLoading ? 'Calculating Gas Consumption...' : 'Calculate Gas Consumption'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GasConsumptionCalculatorForm;
