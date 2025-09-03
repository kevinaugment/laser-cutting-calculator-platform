import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Award, Settings, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface QualityGradeCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const QualityGradeCalculatorForm: React.FC<QualityGradeCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('material');

  const [materialSpecs, setMaterialSpecs] = useState({
    materialType: 'mild_steel',
    thickness: 5.0, // mm
    surfaceCondition: 'clean' as 'clean' | 'oxidized' | 'coated' | 'rough',
    materialGrade: 'standard' as 'standard' | 'premium' | 'industrial'
  });

  const [laserParams, setLaserParams] = useState({
    laserPower: 1500, // W
    cuttingSpeed: 2500, // mm/min
    beamDiameter: 0.15, // mm
    pulseFrequency: 0, // Hz (0 for continuous)
    beamQuality: 1.2 // M²
  });

  const [gasSettings, setGasSettings] = useState({
    gasType: 'oxygen' as 'oxygen' | 'nitrogen' | 'air' | 'argon',
    gasPressure: 1.0, // bar
    gasFlow: 150, // l/min
    nozzleDistance: 1.0 // mm
  });

  const [focusSettings, setFocusSettings] = useState({
    focusPosition: -1.5, // mm (relative to surface)
    lensType: 'standard' as 'standard' | 'high_power' | 'precision',
    focalLength: 127, // mm
    beamAlignment: 'optimal' as 'optimal' | 'good' | 'poor'
  });

  const [qualityTargets, setQualityTargets] = useState({
    targetQuality: 'standard' as 'production' | 'standard' | 'high' | 'precision',
    applicationRequirements: 'general' as 'general' | 'structural' | 'decorative' | 'precision',
    toleranceClass: 'IT12' as 'IT12' | 'IT10' | 'IT8' | 'IT6',
    surfaceFinishReq: 6.3 // Ra in μm
  });

  const handleCalculate = () => {
    const inputs = {
      materialType: materialSpecs.materialType,
      thickness: materialSpecs.thickness,
      laserPower: laserParams.laserPower,
      cuttingSpeed: laserParams.cuttingSpeed,
      gasType: gasSettings.gasType,
      gasPressure: gasSettings.gasPressure,
      focusPosition: focusSettings.focusPosition,
      beamDiameter: laserParams.beamDiameter,
      pulseFrequency: laserParams.pulseFrequency,
      nozzleDistance: gasSettings.nozzleDistance,
      targetQuality: qualityTargets.targetQuality
    };
    onCalculate(inputs);
  };

  const materialOptions = [
    { value: 'mild_steel', label: 'Mild Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'carbon_steel', label: 'Carbon Steel' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' },
    { value: 'titanium', label: 'Titanium' }
  ];

  const gasOptions = [
    { value: 'oxygen', label: 'Oxygen (O₂)' },
    { value: 'nitrogen', label: 'Nitrogen (N₂)' },
    { value: 'air', label: 'Compressed Air' },
    { value: 'argon', label: 'Argon (Ar)' }
  ];

  const qualityOptions = [
    { value: 'production', label: 'Production (Fast)' },
    { value: 'standard', label: 'Standard Quality' },
    { value: 'high', label: 'High Quality' },
    { value: 'precision', label: 'Precision (Slow)' }
  ];

  const surfaceConditionOptions = [
    { value: 'clean', label: 'Clean Surface' },
    { value: 'oxidized', label: 'Oxidized' },
    { value: 'coated', label: 'Coated' },
    { value: 'rough', label: 'Rough Surface' }
  ];

  const lensOptions = [
    { value: 'standard', label: 'Standard Lens' },
    { value: 'high_power', label: 'High Power Lens' },
    { value: 'precision', label: 'Precision Lens' }
  ];

  const applicationOptions = [
    { value: 'general', label: 'General Purpose' },
    { value: 'structural', label: 'Structural Components' },
    { value: 'decorative', label: 'Decorative Parts' },
    { value: 'precision', label: 'Precision Components' }
  ];

  const toleranceOptions = [
    { value: 'IT12', label: 'IT12 (Rough)' },
    { value: 'IT10', label: 'IT10 (Standard)' },
    { value: 'IT8', label: 'IT8 (Precise)' },
    { value: 'IT6', label: 'IT6 (High Precision)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>Quality Grade Calculator</span>
          <Badge variant="outline">Quality</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="laser">Laser</TabsTrigger>
            <TabsTrigger value="gas">Gas</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
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
                    onChange={(value) => setMaterialSpecs({
                      ...materialSpecs,
                      materialType: value
                    })}
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
                    onChange={(value: 'clean' | 'oxidized' | 'coated' | 'rough') => 
                      setMaterialSpecs({
                        ...materialSpecs,
                        surfaceCondition: value
                      })
                    }
                    options={surfaceConditionOptions}
                  />
                </div>
                <div>
                  <Label>Material Grade</Label>
                  <Select
                    value={materialSpecs.materialGrade}
                    onChange={(value: 'standard' | 'premium' | 'industrial') => 
                      setMaterialSpecs({
                        ...materialSpecs,
                        materialGrade: value
                      })
                    }
                    options={[
                      { value: 'standard', label: 'Standard Grade' },
                      { value: 'premium', label: 'Premium Grade' },
                      { value: 'industrial', label: 'Industrial Grade' }
                    ]}
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
                    min="100"
                    max="10000"
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
                    placeholder="0 for continuous"
                  />
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
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gas" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
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
                    options={gasOptions}
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
                  <Label>Gas Flow (l/min)</Label>
                  <Input
                    type="number"
                    value={gasSettings.gasFlow}
                    onChange={(e) => setGasSettings({
                      ...gasSettings,
                      gasFlow: Number(e.target.value)
                    })}
                    min="10"
                    max="500"
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
                    placeholder="Negative = below surface"
                  />
                </div>
                <div>
                  <Label>Lens Type</Label>
                  <Select
                    value={focusSettings.lensType}
                    onChange={(value: 'standard' | 'high_power' | 'precision') => 
                      setFocusSettings({
                        ...focusSettings,
                        lensType: value
                      })
                    }
                    options={lensOptions}
                  />
                </div>
                <div>
                  <Label>Focal Length (mm)</Label>
                  <Input
                    type="number"
                    value={focusSettings.focalLength}
                    onChange={(e) => setFocusSettings({
                      ...focusSettings,
                      focalLength: Number(e.target.value)
                    })}
                    min="50"
                    max="300"
                  />
                </div>
                <div>
                  <Label>Beam Alignment</Label>
                  <Select
                    value={focusSettings.beamAlignment}
                    onChange={(value: 'optimal' | 'good' | 'poor') => 
                      setFocusSettings({
                        ...focusSettings,
                        beamAlignment: value
                      })
                    }
                    options={[
                      { value: 'optimal', label: 'Optimal Alignment' },
                      { value: 'good', label: 'Good Alignment' },
                      { value: 'poor', label: 'Poor Alignment' }
                    ]}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Quality Targets
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Target Quality Level</Label>
                  <Select
                    value={qualityTargets.targetQuality}
                    onChange={(value: 'production' | 'standard' | 'high' | 'precision') => 
                      setQualityTargets({
                        ...qualityTargets,
                        targetQuality: value
                      })
                    }
                    options={qualityOptions}
                  />
                </div>
                <div>
                  <Label>Application Requirements</Label>
                  <Select
                    value={qualityTargets.applicationRequirements}
                    onChange={(value: 'general' | 'structural' | 'decorative' | 'precision') => 
                      setQualityTargets({
                        ...qualityTargets,
                        applicationRequirements: value
                      })
                    }
                    options={applicationOptions}
                  />
                </div>
                <div>
                  <Label>Tolerance Class</Label>
                  <Select
                    value={qualityTargets.toleranceClass}
                    onChange={(value: 'IT12' | 'IT10' | 'IT8' | 'IT6') => 
                      setQualityTargets({
                        ...qualityTargets,
                        toleranceClass: value
                      })
                    }
                    options={toleranceOptions}
                  />
                </div>
                <div>
                  <Label>Surface Finish Req. (Ra μm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={qualityTargets.surfaceFinishReq}
                    onChange={(e) => setQualityTargets({
                      ...qualityTargets,
                      surfaceFinishReq: Number(e.target.value)
                    })}
                    min="0.8"
                    max="25"
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
            {isLoading ? 'Analyzing Quality...' : 'Predict Quality Grade'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityGradeCalculatorForm;
