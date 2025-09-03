import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Target, Settings, Zap, Thermometer } from 'lucide-react';

interface EdgeQualityPredictorCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const EdgeQualityPredictorCalculatorForm: React.FC<EdgeQualityPredictorCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('material');

  const [materialSpecs, setMaterialSpecs] = useState({
    materialType: 'carbon_steel',
    thickness: 5.0, // mm
    surfaceCondition: 'clean' as 'clean' | 'oxidized' | 'oily' | 'painted' | 'galvanized'
  });

  const [laserParams, setLaserParams] = useState({
    laserPower: 1500, // W
    cuttingSpeed: 2500, // mm/min
    focusPosition: -1.5, // mm (+ above surface, - below surface)
    beamQuality: 1.2, // M² factor
    pulseFrequency: 0 // Hz (0 for continuous wave)
  });

  const [gasSettings, setGasSettings] = useState({
    gasType: 'oxygen' as 'oxygen' | 'nitrogen' | 'air' | 'argon' | 'helium',
    gasPressure: 1.0, // bar
    nozzleType: 'single' as 'single' | 'double' | 'coaxial',
    nozzleDiameter: 1.5, // mm
    nozzleDistance: 1.0 // mm from surface
  });

  const [qualityRequirements, setQualityRequirements] = useState({
    qualityTarget: 'high' as 'standard' | 'high' | 'precision' | 'ultra_precision',
    maxRoughness: 3.2, // μm Ra
    maxTaper: 2.0, // degrees
    maxHAZ: 0.1, // mm
    allowableDross: 'minimal' as 'none' | 'minimal' | 'light' | 'moderate'
  });

  const [environmentalConditions, setEnvironmentalConditions] = useState({
    temperature: 20, // °C
    humidity: 50, // percentage
    airflow: 'low' as 'none' | 'low' | 'medium' | 'high'
  });

  const handleCalculate = () => {
    const inputs = {
      // Material properties
      materialType: materialSpecs.materialType,
      thickness: materialSpecs.thickness,
      surfaceCondition: materialSpecs.surfaceCondition,
      
      // Laser parameters
      laserPower: laserParams.laserPower,
      cuttingSpeed: laserParams.cuttingSpeed,
      focusPosition: laserParams.focusPosition,
      beamQuality: laserParams.beamQuality,
      pulseFrequency: laserParams.pulseFrequency,
      
      // Gas settings
      gasType: gasSettings.gasType,
      gasPressure: gasSettings.gasPressure,
      nozzleType: gasSettings.nozzleType,
      nozzleDiameter: gasSettings.nozzleDiameter,
      nozzleDistance: gasSettings.nozzleDistance,
      
      // Quality requirements
      qualityTarget: qualityRequirements.qualityTarget,
      edgeRequirements: {
        maxRoughness: qualityRequirements.maxRoughness,
        maxTaper: qualityRequirements.maxTaper,
        maxHAZ: qualityRequirements.maxHAZ,
        allowableDross: qualityRequirements.allowableDross
      },
      
      // Environmental conditions
      ambientConditions: {
        temperature: environmentalConditions.temperature,
        humidity: environmentalConditions.humidity,
        airflow: environmentalConditions.airflow
      }
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

  const surfaceConditionOptions = [
    { value: 'clean', label: 'Clean (No contamination)' },
    { value: 'oxidized', label: 'Oxidized (Surface rust)' },
    { value: 'oily', label: 'Oily (Cutting fluid residue)' },
    { value: 'painted', label: 'Painted (Coating present)' },
    { value: 'galvanized', label: 'Galvanized (Zinc coating)' }
  ];

  const gasTypeOptions = [
    { value: 'oxygen', label: 'Oxygen (O₂)' },
    { value: 'nitrogen', label: 'Nitrogen (N₂)' },
    { value: 'air', label: 'Compressed Air' },
    { value: 'argon', label: 'Argon (Ar)' },
    { value: 'helium', label: 'Helium (He)' }
  ];

  const nozzleTypeOptions = [
    { value: 'single', label: 'Single Flow' },
    { value: 'double', label: 'Double Flow' },
    { value: 'coaxial', label: 'Coaxial' }
  ];

  const qualityTargetOptions = [
    { value: 'standard', label: 'Standard (General purpose)' },
    { value: 'high', label: 'High (Precision parts)' },
    { value: 'precision', label: 'Precision (Critical components)' },
    { value: 'ultra_precision', label: 'Ultra Precision (Aerospace/Medical)' }
  ];

  const drossLevelOptions = [
    { value: 'none', label: 'None (Dross-free)' },
    { value: 'minimal', label: 'Minimal (Easily removable)' },
    { value: 'light', label: 'Light (Some cleanup required)' },
    { value: 'moderate', label: 'Moderate (Significant cleanup)' }
  ];

  const airflowOptions = [
    { value: 'none', label: 'None (Still air)' },
    { value: 'low', label: 'Low (Natural ventilation)' },
    { value: 'medium', label: 'Medium (Forced ventilation)' },
    { value: 'high', label: 'High (Strong airflow)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Edge Quality Predictor</span>
          <Badge variant="outline">Quality Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="laser">Laser</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
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
                    min="0.5"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Surface Condition</Label>
                  <Select
                    value={materialSpecs.surfaceCondition}
                    onChange={(value: 'clean' | 'oxidized' | 'oily' | 'painted' | 'galvanized') => 
                      setMaterialSpecs({
                        ...materialSpecs,
                        surfaceCondition: value
                      })
                    }
                    options={surfaceConditionOptions}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Thermometer className="h-4 w-4 mr-2" />
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
                  <Label>Airflow</Label>
                  <Select
                    value={environmentalConditions.airflow}
                    onChange={(value: 'none' | 'low' | 'medium' | 'high') => 
                      setEnvironmentalConditions({
                        ...environmentalConditions,
                        airflow: value
                      })
                    }
                    options={airflowOptions}
                  />
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
                    min="500"
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
                  <Label>Focus Position (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={laserParams.focusPosition}
                    onChange={(e) => setLaserParams({
                      ...laserParams,
                      focusPosition: Number(e.target.value)
                    })}
                    min="-10"
                    max="5"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Negative: below surface, Positive: above surface
                  </div>
                </div>
                <div>
                  <Label>Beam Quality (M²)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={laserParams.beamQuality}
                    onChange={(e) => setLaserParams({
                      ...laserParams,
                      beamQuality: Number(e.target.value)
                    })}
                    min="1.0"
                    max="5.0"
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
          </TabsContent>

          <TabsContent value="gas" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Gas and Nozzle Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gas Type</Label>
                  <Select
                    value={gasSettings.gasType}
                    onChange={(value: 'oxygen' | 'nitrogen' | 'air' | 'argon' | 'helium') => 
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
                <div>
                  <Label>Nozzle Type</Label>
                  <Select
                    value={gasSettings.nozzleType}
                    onChange={(value: 'single' | 'double' | 'coaxial') => 
                      setGasSettings({
                        ...gasSettings,
                        nozzleType: value
                      })
                    }
                    options={nozzleTypeOptions}
                  />
                </div>
                <div>
                  <Label>Nozzle Diameter (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={gasSettings.nozzleDiameter}
                    onChange={(e) => setGasSettings({
                      ...gasSettings,
                      nozzleDiameter: Number(e.target.value)
                    })}
                    min="0.5"
                    max="5.0"
                  />
                </div>
                <div>
                  <Label>Nozzle Distance (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={gasSettings.nozzleDistance}
                    onChange={(e) => setGasSettings({
                      ...gasSettings,
                      nozzleDistance: Number(e.target.value)
                    })}
                    min="0.5"
                    max="5.0"
                  />
                </div>
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
                  <Label>Quality Target</Label>
                  <Select
                    value={qualityRequirements.qualityTarget}
                    onChange={(value: 'standard' | 'high' | 'precision' | 'ultra_precision') => 
                      setQualityRequirements({
                        ...qualityRequirements,
                        qualityTarget: value
                      })
                    }
                    options={qualityTargetOptions}
                  />
                </div>
                <div>
                  <Label>Max Surface Roughness (μm Ra)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={qualityRequirements.maxRoughness}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      maxRoughness: Number(e.target.value)
                    })}
                    min="0.8"
                    max="25"
                  />
                </div>
                <div>
                  <Label>Max Kerf Taper (degrees)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={qualityRequirements.maxTaper}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      maxTaper: Number(e.target.value)
                    })}
                    min="0.5"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Max Heat Affected Zone (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={qualityRequirements.maxHAZ}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      maxHAZ: Number(e.target.value)
                    })}
                    min="0.01"
                    max="1.0"
                  />
                </div>
                <div>
                  <Label>Allowable Dross Level</Label>
                  <Select
                    value={qualityRequirements.allowableDross}
                    onChange={(value: 'none' | 'minimal' | 'light' | 'moderate') => 
                      setQualityRequirements({
                        ...qualityRequirements,
                        allowableDross: value
                      })
                    }
                    options={drossLevelOptions}
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
            {isLoading ? 'Predicting Edge Quality...' : 'Predict Edge Quality'}
          </Button>
        </div>

        {/* Gas Type Information */}
        <div className="mt-6">
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Gas Type Effects on Edge Quality</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-blue-600 mb-2">Oxygen (O₂)</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Best for carbon steel cutting</li>
                  <li>• Creates oxidized edge (may affect quality)</li>
                  <li>• High cutting speeds possible</li>
                  <li>• Good for thick materials</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-600 mb-2">Nitrogen (N₂)</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Clean, oxide-free cuts</li>
                  <li>• Best edge quality for stainless steel</li>
                  <li>• Higher gas consumption</li>
                  <li>• Premium surface finish</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-yellow-600 mb-2">Compressed Air</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Most economical option</li>
                  <li>• Moderate edge quality</li>
                  <li>• Good for thin materials</li>
                  <li>• Some oxidation possible</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-600 mb-2">Argon/Helium</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Specialty applications</li>
                  <li>• Excellent edge quality</li>
                  <li>• High cost</li>
                  <li>• Used for exotic materials</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default EdgeQualityPredictorCalculatorForm;
