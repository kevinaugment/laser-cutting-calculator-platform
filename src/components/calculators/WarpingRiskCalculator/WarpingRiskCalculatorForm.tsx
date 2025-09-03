import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { AlertTriangle, Settings, Zap, Target, Ruler } from 'lucide-react';

interface WarpingRiskCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const WarpingRiskCalculatorForm: React.FC<WarpingRiskCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('material');

  const [materialSpecs, setMaterialSpecs] = useState({
    materialType: 'mild_steel',
    dimensions: {
      length: 200, // mm
      width: 100, // mm
      thickness: 3.0 // mm
    }
  });

  const [partGeometry, setPartGeometry] = useState({
    shape: 'rectangular' as 'rectangular' | 'circular' | 'complex' | 'thin_strip' | 'large_plate',
    aspectRatio: 2.0, // length/width (auto-calculated)
    openings: {
      count: 2,
      totalArea: 500 // mm²
    },
    supportStructure: 'moderate' as 'none' | 'minimal' | 'moderate' | 'extensive'
  });

  const [cuttingParameters, setCuttingParameters] = useState({
    laserPower: 1500, // W
    cuttingSpeed: 2500, // mm/min
    numberOfPasses: 1,
    cutSequence: 'optimized' as 'outside_first' | 'inside_first' | 'balanced' | 'optimized',
    coolingTime: 5 // seconds between passes
  });

  const [thermalProperties, setThermalProperties] = useState({
    thermalExpansion: 12e-6, // /°C (auto-set based on material)
    yieldStrength: 250, // MPa (auto-set based on material)
    elasticModulus: 200000 // MPa (auto-set based on material)
  });

  const [environmentalConditions, setEnvironmentalConditions] = useState({
    ambientTemperature: 20, // °C
    airflow: 'natural' as 'none' | 'natural' | 'forced' | 'controlled',
    humidity: 50 // %
  });

  const [constraintConditions, setConstraintConditions] = useState({
    fixturingForce: 200, // N
    clampingStrategy: 'distributed' as 'point' | 'line' | 'distributed' | 'vacuum',
    supportDensity: 'medium' as 'low' | 'medium' | 'high' | 'maximum'
  });

  const [qualityRequirements, setQualityRequirements] = useState({
    flatnessTolerance: 0.1, // mm
    dimensionalStability: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    postProcessing: 'none' as 'none' | 'stress_relief' | 'machining' | 'heat_treatment'
  });

  const handleCalculate = () => {
    const inputs = {
      materialType: materialSpecs.materialType,
      dimensions: materialSpecs.dimensions,
      partGeometry: {
        ...partGeometry,
        aspectRatio: materialSpecs.dimensions.length / materialSpecs.dimensions.width
      },
      cuttingParameters,
      thermalProperties,
      environmentalConditions,
      constraintConditions,
      qualityRequirements
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

  const shapeOptions = [
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'circular', label: 'Circular' },
    { value: 'complex', label: 'Complex Shape' },
    { value: 'thin_strip', label: 'Thin Strip' },
    { value: 'large_plate', label: 'Large Plate' }
  ];

  const supportOptions = [
    { value: 'none', label: 'No Support' },
    { value: 'minimal', label: 'Minimal Support' },
    { value: 'moderate', label: 'Moderate Support' },
    { value: 'extensive', label: 'Extensive Support' }
  ];

  const cutSequenceOptions = [
    { value: 'outside_first', label: 'Outside First' },
    { value: 'inside_first', label: 'Inside First' },
    { value: 'balanced', label: 'Balanced Sequence' },
    { value: 'optimized', label: 'Optimized Sequence' }
  ];

  const airflowOptions = [
    { value: 'none', label: 'No Airflow' },
    { value: 'natural', label: 'Natural Convection' },
    { value: 'forced', label: 'Forced Air Cooling' },
    { value: 'controlled', label: 'Controlled Environment' }
  ];

  const clampingOptions = [
    { value: 'point', label: 'Point Clamping' },
    { value: 'line', label: 'Line Clamping' },
    { value: 'distributed', label: 'Distributed Clamping' },
    { value: 'vacuum', label: 'Vacuum Clamping' }
  ];

  const stabilityOptions = [
    { value: 'low', label: 'Low (General purpose)' },
    { value: 'medium', label: 'Medium (Functional parts)' },
    { value: 'high', label: 'High (Precision components)' },
    { value: 'critical', label: 'Critical (Aerospace/Medical)' }
  ];

  const postProcessingOptions = [
    { value: 'none', label: 'No Post-processing' },
    { value: 'stress_relief', label: 'Stress Relief' },
    { value: 'machining', label: 'Machining' },
    { value: 'heat_treatment', label: 'Heat Treatment' }
  ];

  // Update material properties when material type changes
  const handleMaterialTypeChange = (value: string) => {
    const materialProperties: Record<string, any> = {
      'mild_steel': { thermalExpansion: 12e-6, yieldStrength: 250, elasticModulus: 200000 },
      'stainless_steel': { thermalExpansion: 17e-6, yieldStrength: 300, elasticModulus: 200000 },
      'aluminum': { thermalExpansion: 23e-6, yieldStrength: 120, elasticModulus: 70000 },
      'carbon_steel': { thermalExpansion: 12e-6, yieldStrength: 400, elasticModulus: 200000 },
      'copper': { thermalExpansion: 17e-6, yieldStrength: 70, elasticModulus: 110000 },
      'brass': { thermalExpansion: 19e-6, yieldStrength: 200, elasticModulus: 100000 },
      'titanium': { thermalExpansion: 8.6e-6, yieldStrength: 880, elasticModulus: 114000 }
    };
    
    const props = materialProperties[value] || materialProperties['mild_steel'];
    setMaterialSpecs({
      ...materialSpecs,
      materialType: value
    });
    setThermalProperties({
      ...thermalProperties,
      ...props
    });
  };

  // Update aspect ratio when dimensions change
  const handleDimensionChange = (field: string, value: number) => {
    const newDimensions = {
      ...materialSpecs.dimensions,
      [field]: value
    };
    setMaterialSpecs({
      ...materialSpecs,
      dimensions: newDimensions
    });
    setPartGeometry({
      ...partGeometry,
      aspectRatio: newDimensions.length / newDimensions.width
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Warping Risk Calculator</span>
          <Badge variant="outline">Distortion Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="material">Material</TabsTrigger>
            <TabsTrigger value="geometry">Geometry</TabsTrigger>
            <TabsTrigger value="cutting">Cutting</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
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
                  <Label>Length (mm)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={materialSpecs.dimensions.length}
                    onChange={(e) => handleDimensionChange('length', Number(e.target.value))}
                    min="10"
                    max="3000"
                  />
                </div>
                <div>
                  <Label>Width (mm)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={materialSpecs.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                    min="10"
                    max="2000"
                  />
                </div>
                <div>
                  <Label>Thickness (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={materialSpecs.dimensions.thickness}
                    onChange={(e) => handleDimensionChange('thickness', Number(e.target.value))}
                    min="0.5"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Thermal Expansion (/°C)</Label>
                  <Input
                    type="number"
                    step="1e-6"
                    value={thermalProperties.thermalExpansion}
                    onChange={(e) => setThermalProperties({
                      ...thermalProperties,
                      thermalExpansion: Number(e.target.value)
                    })}
                    min="1e-6"
                    max="50e-6"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
                <div>
                  <Label>Yield Strength (MPa)</Label>
                  <Input
                    type="number"
                    value={thermalProperties.yieldStrength}
                    onChange={(e) => setThermalProperties({
                      ...thermalProperties,
                      yieldStrength: Number(e.target.value)
                    })}
                    min="50"
                    max="2000"
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically set based on material type
                  </div>
                </div>
              </div>
            </Card>

            {/* Material Warping Factors Reference */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Material Warping Risk Factors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">High Risk Materials</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Copper:</strong> High thermal expansion, low stiffness</li>
                    <li>• <strong>Brass:</strong> High thermal expansion, moderate stiffness</li>
                    <li>• <strong>Aluminum:</strong> High thermal expansion, low stiffness</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">Low Risk Materials</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>Titanium:</strong> Low thermal expansion, high stiffness</li>
                    <li>• <strong>Mild Steel:</strong> Moderate expansion, good stiffness</li>
                    <li>• <strong>Carbon Steel:</strong> Moderate expansion, high stiffness</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="geometry" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Ruler className="h-4 w-4 mr-2" />
                Part Geometry
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Part Shape</Label>
                  <Select
                    value={partGeometry.shape}
                    onChange={(value: 'rectangular' | 'circular' | 'complex' | 'thin_strip' | 'large_plate') => 
                      setPartGeometry({
                        ...partGeometry,
                        shape: value
                      })
                    }
                    options={shapeOptions}
                  />
                </div>
                <div>
                  <Label>Aspect Ratio (L/W)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={partGeometry.aspectRatio.toFixed(1)}
                    disabled
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Automatically calculated from dimensions
                  </div>
                </div>
                <div>
                  <Label>Number of Openings</Label>
                  <Input
                    type="number"
                    value={partGeometry.openings.count}
                    onChange={(e) => setPartGeometry({
                      ...partGeometry,
                      openings: {
                        ...partGeometry.openings,
                        count: Number(e.target.value)
                      }
                    })}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Total Opening Area (mm²)</Label>
                  <Input
                    type="number"
                    value={partGeometry.openings.totalArea}
                    onChange={(e) => setPartGeometry({
                      ...partGeometry,
                      openings: {
                        ...partGeometry.openings,
                        totalArea: Number(e.target.value)
                      }
                    })}
                    min="0"
                    max="10000"
                  />
                </div>
                <div>
                  <Label>Support Structure</Label>
                  <Select
                    value={partGeometry.supportStructure}
                    onChange={(value: 'none' | 'minimal' | 'moderate' | 'extensive') => 
                      setPartGeometry({
                        ...partGeometry,
                        supportStructure: value
                      })
                    }
                    options={supportOptions}
                  />
                </div>
              </div>
            </Card>

            {/* Geometry Risk Factors */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Geometry Risk Analysis</h4>
              <div className="text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong>Part Area:</strong> {' '}
                  {(materialSpecs.dimensions.length * materialSpecs.dimensions.width).toFixed(0)} mm²
                </div>
                <div className="mb-2">
                  <strong>Opening Ratio:</strong> {' '}
                  {((partGeometry.openings.totalArea / (materialSpecs.dimensions.length * materialSpecs.dimensions.width)) * 100).toFixed(1)}%
                </div>
                <div>
                  <strong>Slenderness Ratio:</strong> {' '}
                  {(Math.max(materialSpecs.dimensions.length, materialSpecs.dimensions.width) / materialSpecs.dimensions.thickness).toFixed(1)}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cutting" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Cutting Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Laser Power (W)</Label>
                  <Input
                    type="number"
                    value={cuttingParameters.laserPower}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
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
                  <Label>Number of Passes</Label>
                  <Input
                    type="number"
                    value={cuttingParameters.numberOfPasses}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      numberOfPasses: Number(e.target.value)
                    })}
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Cut Sequence</Label>
                  <Select
                    value={cuttingParameters.cutSequence}
                    onChange={(value: 'outside_first' | 'inside_first' | 'balanced' | 'optimized') => 
                      setCuttingParameters({
                        ...cuttingParameters,
                        cutSequence: value
                      })
                    }
                    options={cutSequenceOptions}
                  />
                </div>
                <div>
                  <Label>Cooling Time Between Passes (s)</Label>
                  <Input
                    type="number"
                    value={cuttingParameters.coolingTime}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      coolingTime: Number(e.target.value)
                    })}
                    min="0"
                    max="60"
                  />
                </div>
              </div>
            </Card>

            {/* Power Density Analysis */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Power Density Analysis</h4>
              <div className="text-sm text-muted-foreground">
                <div className="mb-2">
                  <strong>Power Density:</strong> {' '}
                  {((cuttingParameters.laserPower / (materialSpecs.dimensions.length * materialSpecs.dimensions.width)) * 1000000).toFixed(0)} W/m²
                </div>
                <div className="mb-2">
                  <strong>Power-Speed Ratio:</strong> {' '}
                  {(cuttingParameters.laserPower / (cuttingParameters.cuttingSpeed / 1000)).toFixed(1)} W·s/mm
                </div>
                <div>
                  Power Density = Laser Power ÷ Part Area
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Environmental Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ambient Temperature (°C)</Label>
                  <Input
                    type="number"
                    value={environmentalConditions.ambientTemperature}
                    onChange={(e) => setEnvironmentalConditions({
                      ...environmentalConditions,
                      ambientTemperature: Number(e.target.value)
                    })}
                    min="-10"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Airflow Condition</Label>
                  <Select
                    value={environmentalConditions.airflow}
                    onChange={(value: 'none' | 'natural' | 'forced' | 'controlled') => 
                      setEnvironmentalConditions({
                        ...environmentalConditions,
                        airflow: value
                      })
                    }
                    options={airflowOptions}
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
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Constraint Conditions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Fixturing Force (N)</Label>
                  <Input
                    type="number"
                    value={constraintConditions.fixturingForce}
                    onChange={(e) => setConstraintConditions({
                      ...constraintConditions,
                      fixturingForce: Number(e.target.value)
                    })}
                    min="10"
                    max="1000"
                  />
                </div>
                <div>
                  <Label>Clamping Strategy</Label>
                  <Select
                    value={constraintConditions.clampingStrategy}
                    onChange={(value: 'point' | 'line' | 'distributed' | 'vacuum') => 
                      setConstraintConditions({
                        ...constraintConditions,
                        clampingStrategy: value
                      })
                    }
                    options={clampingOptions}
                  />
                </div>
                <div>
                  <Label>Support Density</Label>
                  <Select
                    value={constraintConditions.supportDensity}
                    onChange={(value: 'low' | 'medium' | 'high' | 'maximum') => 
                      setConstraintConditions({
                        ...constraintConditions,
                        supportDensity: value
                      })
                    }
                    options={[
                      { value: 'low', label: 'Low Density' },
                      { value: 'medium', label: 'Medium Density' },
                      { value: 'high', label: 'High Density' },
                      { value: 'maximum', label: 'Maximum Density' }
                    ]}
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
                  <Label>Flatness Tolerance (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={qualityRequirements.flatnessTolerance}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      flatnessTolerance: Number(e.target.value)
                    })}
                    min="0.01"
                    max="5.0"
                  />
                </div>
                <div>
                  <Label>Dimensional Stability</Label>
                  <Select
                    value={qualityRequirements.dimensionalStability}
                    onChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                      setQualityRequirements({
                        ...qualityRequirements,
                        dimensionalStability: value
                      })
                    }
                    options={stabilityOptions}
                  />
                </div>
                <div>
                  <Label>Post-processing</Label>
                  <Select
                    value={qualityRequirements.postProcessing}
                    onChange={(value: 'none' | 'stress_relief' | 'machining' | 'heat_treatment') => 
                      setQualityRequirements({
                        ...qualityRequirements,
                        postProcessing: value
                      })
                    }
                    options={postProcessingOptions}
                  />
                </div>
              </div>
            </Card>

            {/* Quality Requirements Guide */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Quality Requirements Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold text-red-600 mb-2">Critical Applications</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Aerospace components (&lt; 0.05mm flatness)</li>
                    <li>• Medical devices (&lt; 0.02mm flatness)</li>
                    <li>• Precision instruments (&lt; 0.01mm flatness)</li>
                    <li>• Optical components (&lt; 0.005mm flatness)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-600 mb-2">General Applications</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Structural components (&lt; 0.5mm flatness)</li>
                    <li>• Decorative parts (&lt; 1.0mm flatness)</li>
                    <li>• Prototype parts (&lt; 0.2mm flatness)</li>
                    <li>• General fabrication (&lt; 0.3mm flatness)</li>
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
            {isLoading ? 'Analyzing Warping Risk...' : 'Analyze Warping Risk'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarpingRiskCalculatorForm;
