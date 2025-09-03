import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Thermometer, Settings, Zap, Target } from 'lucide-react';

interface HeatAffectedZoneCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const HeatAffectedZoneCalculatorForm: React.FC<HeatAffectedZoneCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('material');

  const [materialSpecs, setMaterialSpecs] = useState({
    materialType: 'carbon_steel',
    thickness: 5.0, // mm
    thermalConductivity: 50, // W/m·K (auto-set based on material)
    specificHeat: 460, // J/kg·K (auto-set based on material)
    density: 7850, // kg/m³ (auto-set based on material)
    meltingPoint: 1500 // °C (auto-set based on material)
  });

  const [laserParams, setLaserParams] = useState({
    laserPower: 1500, // W
    cuttingSpeed: 2500, // mm/min
    focusPosition: -1.67, // mm
    beamDiameter: 0.12, // mm
    wavelength: 1070, // nm
    pulseFrequency: 0, // Hz (0 for continuous wave)
    dutyCycle: 50 // % (for pulsed mode)
  });

  const [cuttingConditions, setCuttingConditions] = useState({
    assistGasType: 'oxygen' as 'oxygen' | 'nitrogen' | 'air' | 'argon',
    gasFlow: 15, // l/min
    gasPressure: 1.0, // bar
    ambientTemperature: 20, // °C
    coolingMethod: 'natural' as 'natural' | 'forced_air' | 'water_cooling'
  });

  const [hazRequirements, setHazRequirements] = useState({
    maxHazWidth: 0.2, // mm
    maxHardnessChange: 15, // percentage
    hazRequirement: 'standard' as 'minimal' | 'standard' | 'acceptable' | 'relaxed',
    applicationCriticality: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  const handleCalculate = () => {
    const inputs = {
      // Material properties
      material: {
        type: materialSpecs.materialType,
        thickness: materialSpecs.thickness,
        thermalConductivity: materialSpecs.thermalConductivity,
        specificHeat: materialSpecs.specificHeat,
        density: materialSpecs.density,
        meltingPoint: materialSpecs.meltingPoint,
        vaporization: materialSpecs.meltingPoint + 1400 // Simplified
      },
      
      // Laser parameters
      laserParams: {
        power: laserParams.laserPower,
        speed: laserParams.cuttingSpeed,
        focusPosition: laserParams.focusPosition,
        beamDiameter: laserParams.beamDiameter,
        wavelength: laserParams.wavelength,
        pulseFrequency: laserParams.pulseFrequency,
        dutyCycle: laserParams.dutyCycle
      },
      
      // Cutting conditions
      conditions: {
        assistGasType: cuttingConditions.assistGasType,
        gasFlow: cuttingConditions.gasFlow,
        gasPressure: cuttingConditions.gasPressure,
        ambientTemperature: cuttingConditions.ambientTemperature,
        coolingMethod: cuttingConditions.coolingMethod
      },
      
      // HAZ requirements
      requirements: {
        maxHazWidth: hazRequirements.maxHazWidth,
        maxHardnessChange: hazRequirements.maxHardnessChange,
        hazRequirement: hazRequirements.hazRequirement,
        applicationCriticality: hazRequirements.applicationCriticality
      }
    };
    onCalculate(inputs);
  };

  const materialOptions = [
    { value: 'carbon_steel', label: 'Carbon Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'titanium', label: 'Titanium' },
    { value: 'tool_steel', label: 'Tool Steel' },
    { value: 'brass', label: 'Brass' }
  ];

  const gasTypeOptions = [
    { value: 'oxygen', label: 'Oxygen (O₂)' },
    { value: 'nitrogen', label: 'Nitrogen (N₂)' },
    { value: 'air', label: 'Compressed Air' },
    { value: 'argon', label: 'Argon (Ar)' }
  ];

  const coolingMethodOptions = [
    { value: 'natural', label: 'Natural Cooling' },
    { value: 'forced_air', label: 'Forced Air Cooling' },
    { value: 'water_cooling', label: 'Water Cooling' }
  ];

  const hazRequirementOptions = [
    { value: 'minimal', label: 'Minimal HAZ (< 0.1mm)' },
    { value: 'standard', label: 'Standard HAZ (< 0.2mm)' },
    { value: 'acceptable', label: 'Acceptable HAZ (< 0.3mm)' },
    { value: 'relaxed', label: 'Relaxed HAZ (< 0.5mm)' }
  ];

  const criticalityOptions = [
    { value: 'low', label: 'Low (General purpose)' },
    { value: 'medium', label: 'Medium (Functional parts)' },
    { value: 'high', label: 'High (Precision components)' },
    { value: 'critical', label: 'Critical (Aerospace/Medical)' }
  ];

  // Update material properties when material type changes
  const handleMaterialTypeChange = (value: string) => {
    const materialProperties: Record<string, any> = {
      'carbon_steel': { thermalConductivity: 50, specificHeat: 460, density: 7850, meltingPoint: 1500 },
      'stainless_steel': { thermalConductivity: 16, specificHeat: 500, density: 8000, meltingPoint: 1400 },
      'aluminum': { thermalConductivity: 237, specificHeat: 900, density: 2700, meltingPoint: 660 },
      'copper': { thermalConductivity: 400, specificHeat: 385, density: 8960, meltingPoint: 1085 },
      'titanium': { thermalConductivity: 22, specificHeat: 520, density: 4500, meltingPoint: 1670 },
      'tool_steel': { thermalConductivity: 42, specificHeat: 470, density: 7800, meltingPoint: 1450 },
      'brass': { thermalConductivity: 120, specificHeat: 380, density: 8500, meltingPoint: 900 }
    };
    
    const props = materialProperties[value] || materialProperties['carbon_steel'];
    setMaterialSpecs({
      ...materialSpecs,
      materialType: value,
      ...props
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="h-5 w-5" />
          <span>Heat Affected Zone Calculator</span>
          <Badge variant="outline">Thermal Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="laser">Laser</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
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
                  <Label>Thermal Conductivity (W/m·K)</Label>
                  <Input
                    type="number"
                    value={materialSpecs.thermalConductivity}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
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
                  <Label>Specific Heat (J/kg·K)</Label>
                  <Input
                    type="number"
                    value={materialSpecs.specificHeat}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      specificHeat: Number(e.target.value)
                    })}
                    min="100"
                    max="1000"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
                <div>
                  <Label>Density (kg/m³)</Label>
                  <Input
                    type="number"
                    value={materialSpecs.density}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      density: Number(e.target.value)
                    })}
                    min="1000"
                    max="20000"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
                <div>
                  <Label>Melting Point (°C)</Label>
                  <Input
                    type="number"
                    value={materialSpecs.meltingPoint}
                    onChange={(e) => setMaterialSpecs({
                      ...materialSpecs,
                      meltingPoint: Number(e.target.value)
                    })}
                    min="200"
                    max="3000"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
              </div>
            </Card>

            {/* Thermal Properties Reference */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Thermal Properties Reference</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-blue-600 mb-2">High Conductivity Materials</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Copper:</strong> 400 W/m·K (Largest HAZ)</li>
                    <li>• <strong>Aluminum:</strong> 237 W/m·K (Large HAZ)</li>
                    <li>• <strong>Brass:</strong> 120 W/m·K (Medium HAZ)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Low Conductivity Materials</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Stainless Steel:</strong> 16 W/m·K (Small HAZ)</li>
                    <li>• <strong>Titanium:</strong> 22 W/m·K (Small HAZ)</li>
                    <li>• <strong>Carbon Steel:</strong> 50 W/m·K (Medium HAZ)</li>
                  </ul>
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
                    max="15000"
                    step="50"
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
                    max="15000"
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
                  <Label>Wavelength (nm)</Label>
                  <Input
                    type="number"
                    value={laserParams.wavelength}
                    onChange={(e) => setLaserParams({
                      ...laserParams,
                      wavelength: Number(e.target.value)
                    })}
                    min="400"
                    max="15000"
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
                {laserParams.pulseFrequency > 0 && (
                  <div>
                    <Label>Duty Cycle (%)</Label>
                    <Input
                      type="number"
                      value={laserParams.dutyCycle}
                      onChange={(e) => setLaserParams({
                        ...laserParams,
                        dutyCycle: Number(e.target.value)
                      })}
                      min="1"
                      max="100"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Heat Input Calculation */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Heat Input Analysis</h4>
              <div className="text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong>Heat Input per Unit Length:</strong> {' '}
                  {((laserParams.laserPower * 60) / laserParams.cuttingSpeed).toFixed(0)} J/mm
                </div>
                <div className="mb-2">
                  <strong>Energy Density:</strong> {' '}
                  {((laserParams.laserPower * 60) / (laserParams.cuttingSpeed * laserParams.beamDiameter)).toFixed(0)} J/mm²
                </div>
                <div>
                  Heat Input = (Laser Power × 60) ÷ Cutting Speed
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Cutting Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Assist Gas Type</Label>
                  <Select
                    value={cuttingConditions.assistGasType}
                    onChange={(value: 'oxygen' | 'nitrogen' | 'air' | 'argon') => 
                      setCuttingConditions({
                        ...cuttingConditions,
                        assistGasType: value
                      })
                    }
                    options={gasTypeOptions}
                  />
                </div>
                <div>
                  <Label>Gas Flow Rate (l/min)</Label>
                  <Input
                    type="number"
                    value={cuttingConditions.gasFlow}
                    onChange={(e) => setCuttingConditions({
                      ...cuttingConditions,
                      gasFlow: Number(e.target.value)
                    })}
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Gas Pressure (bar)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingConditions.gasPressure}
                    onChange={(e) => setCuttingConditions({
                      ...cuttingConditions,
                      gasPressure: Number(e.target.value)
                    })}
                    min="0.1"
                    max="20"
                  />
                </div>
                <div>
                  <Label>Ambient Temperature (°C)</Label>
                  <Input
                    type="number"
                    value={cuttingConditions.ambientTemperature}
                    onChange={(e) => setCuttingConditions({
                      ...cuttingConditions,
                      ambientTemperature: Number(e.target.value)
                    })}
                    min="-10"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Cooling Method</Label>
                  <Select
                    value={cuttingConditions.coolingMethod}
                    onChange={(value: 'natural' | 'forced_air' | 'water_cooling') => 
                      setCuttingConditions({
                        ...cuttingConditions,
                        coolingMethod: value
                      })
                    }
                    options={coolingMethodOptions}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                HAZ Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>HAZ Requirement Level</Label>
                  <Select
                    value={hazRequirements.hazRequirement}
                    onChange={(value: 'minimal' | 'standard' | 'acceptable' | 'relaxed') => 
                      setHazRequirements({
                        ...hazRequirements,
                        hazRequirement: value
                      })
                    }
                    options={hazRequirementOptions}
                  />
                </div>
                <div>
                  <Label>Application Criticality</Label>
                  <Select
                    value={hazRequirements.applicationCriticality}
                    onChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                      setHazRequirements({
                        ...hazRequirements,
                        applicationCriticality: value
                      })
                    }
                    options={criticalityOptions}
                  />
                </div>
                <div>
                  <Label>Max HAZ Width (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={hazRequirements.maxHazWidth}
                    onChange={(e) => setHazRequirements({
                      ...hazRequirements,
                      maxHazWidth: Number(e.target.value)
                    })}
                    min="0.01"
                    max="1.0"
                  />
                </div>
                <div>
                  <Label>Max Hardness Change (%)</Label>
                  <Input
                    type="number"
                    value={hazRequirements.maxHardnessChange}
                    onChange={(e) => setHazRequirements({
                      ...hazRequirements,
                      maxHardnessChange: Number(e.target.value)
                    })}
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            </Card>

            {/* HAZ Requirements Guide */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">HAZ Requirements Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Critical Applications</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Aerospace components (&lt; 0.05mm)</li>
                    <li>• Medical devices (&lt; 0.08mm)</li>
                    <li>• Precision instruments (&lt; 0.1mm)</li>
                    <li>• Tool steel cutting (&lt; 0.1mm)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">General Applications</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Structural components (&lt; 0.3mm)</li>
                    <li>• Decorative parts (&lt; 0.5mm)</li>
                    <li>• Prototype parts (&lt; 0.4mm)</li>
                    <li>• General fabrication (&lt; 0.5mm)</li>
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
            {isLoading ? 'Analyzing Heat Affected Zone...' : 'Analyze Heat Affected Zone'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatAffectedZoneCalculatorForm;
