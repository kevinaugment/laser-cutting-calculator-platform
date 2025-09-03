import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Settings, BarChart3, DollarSign, Target, Plus, Trash2 } from 'lucide-react';

interface EquipmentComparisonCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const EquipmentComparisonCalculatorForm: React.FC<EquipmentComparisonCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('equipment');

  const [equipmentOptions, setEquipmentOptions] = useState([
    {
      id: 1,
      name: 'Fiber Laser A',
      manufacturer: 'LaserTech',
      model: 'FT-3000',
      purchasePrice: 180000,
      laserPower: 3000,
      laserType: 'fiber' as 'fiber' | 'co2' | 'disk' | 'diode',
      maxThickness: 20, // mm for steel
      cuttingSpeed: 4500, // mm/min for 3mm steel
      accuracy: 0.05, // mm
      repeatability: 0.02, // mm
      workAreaX: 1500, // mm
      workAreaY: 3000, // mm
      powerConsumption: 12, // kW
      maintenanceCost: 8000, // $ per year
      warrantyPeriod: 2, // years
      deliveryTime: 12, // weeks
      floorSpace: 15, // m²
      operatorSkillRequired: 'medium' as 'low' | 'medium' | 'high',
      serviceAvailability: 'good' as 'poor' | 'fair' | 'good' | 'excellent'
    },
    {
      id: 2,
      name: 'Fiber Laser B',
      manufacturer: 'CutMaster',
      model: 'CM-4000',
      purchasePrice: 220000,
      laserPower: 4000,
      laserType: 'fiber' as 'fiber' | 'co2' | 'disk' | 'diode',
      maxThickness: 25, // mm for steel
      cuttingSpeed: 5200, // mm/min for 3mm steel
      accuracy: 0.03, // mm
      repeatability: 0.015, // mm
      workAreaX: 2000, // mm
      workAreaY: 4000, // mm
      powerConsumption: 15, // kW
      maintenanceCost: 10000, // $ per year
      warrantyPeriod: 3, // years
      deliveryTime: 16, // weeks
      floorSpace: 20, // m²
      operatorSkillRequired: 'medium' as 'low' | 'medium' | 'high',
      serviceAvailability: 'excellent' as 'poor' | 'fair' | 'good' | 'excellent'
    }
  ]);

  const [evaluationCriteria, setEvaluationCriteria] = useState({
    purchasePrice: 25, // weight 0-100
    operatingCost: 20, // weight 0-100
    productivity: 25, // weight 0-100
    quality: 15, // weight 0-100
    reliability: 10, // weight 0-100
    serviceSupport: 3, // weight 0-100
    futureProofing: 2 // weight 0-100
  });

  const [operatingConditions, setOperatingConditions] = useState({
    annualOperatingHours: 2000,
    electricityRate: 0.12, // $/kWh
    laborRate: 35.00, // $/hour
    expectedLifespan: 10, // years
    financingRate: 5.5, // percentage
    residualValue: 15 // percentage of purchase price
  });

  const [productionRequirements, setProductionRequirements] = useState({
    primaryMaterials: ['mild_steel', 'stainless_steel'],
    typicalThickness: 5, // mm
    requiredAccuracy: 0.1, // mm
    annualVolume: 50000, // parts per year
    averagePartSize: 200 // mm
  });

  const addEquipment = () => {
    const newId = Math.max(...equipmentOptions.map(e => e.id)) + 1;
    setEquipmentOptions([...equipmentOptions, {
      id: newId,
      name: `Equipment ${newId}`,
      manufacturer: '',
      model: '',
      purchasePrice: 150000,
      laserPower: 2000,
      laserType: 'fiber',
      maxThickness: 15,
      cuttingSpeed: 3000,
      accuracy: 0.1,
      repeatability: 0.05,
      workAreaX: 1500,
      workAreaY: 3000,
      powerConsumption: 10,
      maintenanceCost: 6000,
      warrantyPeriod: 2,
      deliveryTime: 12,
      floorSpace: 12,
      operatorSkillRequired: 'medium',
      serviceAvailability: 'good'
    }]);
  };

  const removeEquipment = (id: number) => {
    if (equipmentOptions.length > 2) {
      setEquipmentOptions(equipmentOptions.filter(e => e.id !== id));
    }
  };

  const updateEquipment = (id: number, field: string, value: any) => {
    setEquipmentOptions(equipmentOptions.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const handleCalculate = () => {
    const inputs = {
      equipmentOptions: equipmentOptions.map(eq => ({
        name: eq.name,
        manufacturer: eq.manufacturer,
        model: eq.model,
        purchasePrice: eq.purchasePrice,
        laserPower: eq.laserPower,
        laserType: eq.laserType,
        maxThickness: { mild_steel: eq.maxThickness, stainless_steel: eq.maxThickness * 0.8 },
        cuttingSpeed: { mild_steel: eq.cuttingSpeed, stainless_steel: eq.cuttingSpeed * 0.7 },
        accuracy: eq.accuracy,
        repeatability: eq.repeatability,
        workAreaSize: { x: eq.workAreaX, y: eq.workAreaY, z: 100 },
        powerConsumption: eq.powerConsumption,
        maintenanceCost: eq.maintenanceCost,
        warrantyPeriod: eq.warrantyPeriod,
        deliveryTime: eq.deliveryTime,
        floorSpace: eq.floorSpace,
        operatorSkillRequired: eq.operatorSkillRequired,
        serviceAvailability: eq.serviceAvailability
      })),
      evaluationCriteria,
      operatingConditions,
      productionRequirements
    };
    onCalculate(inputs);
  };

  const laserTypeOptions = [
    { value: 'fiber', label: 'Fiber Laser' },
    { value: 'co2', label: 'CO₂ Laser' },
    { value: 'disk', label: 'Disk Laser' },
    { value: 'diode', label: 'Diode Laser' }
  ];

  const skillLevelOptions = [
    { value: 'low', label: 'Low (Basic training)' },
    { value: 'medium', label: 'Medium (Experienced)' },
    { value: 'high', label: 'High (Expert level)' }
  ];

  const serviceOptions = [
    { value: 'poor', label: 'Poor (Limited support)' },
    { value: 'fair', label: 'Fair (Standard support)' },
    { value: 'good', label: 'Good (Good support)' },
    { value: 'excellent', label: 'Excellent (24/7 support)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Equipment Comparison Calculator</span>
          <Badge variant="outline">Decision Support</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Equipment Options ({equipmentOptions.length})
              </h4>
              <Button onClick={addEquipment} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Equipment
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {equipmentOptions.map((equipment, index) => (
                <Card key={equipment.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-semibold">Equipment {index + 1}</h5>
                    {equipmentOptions.length > 2 && (
                      <Button 
                        onClick={() => removeEquipment(equipment.id)} 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <Label>Equipment Name</Label>
                      <Input
                        value={equipment.name}
                        onChange={(e) => updateEquipment(equipment.id, 'name', e.target.value)}
                        placeholder="Equipment name"
                      />
                    </div>
                    <div>
                      <Label>Manufacturer</Label>
                      <Input
                        value={equipment.manufacturer}
                        onChange={(e) => updateEquipment(equipment.id, 'manufacturer', e.target.value)}
                        placeholder="Manufacturer"
                      />
                    </div>
                    <div>
                      <Label>Model</Label>
                      <Input
                        value={equipment.model}
                        onChange={(e) => updateEquipment(equipment.id, 'model', e.target.value)}
                        placeholder="Model"
                      />
                    </div>
                    <div>
                      <Label>Purchase Price ($)</Label>
                      <Input
                        type="number"
                        value={equipment.purchasePrice}
                        onChange={(e) => updateEquipment(equipment.id, 'purchasePrice', Number(e.target.value))}
                        min="50000"
                        max="1000000"
                        step="5000"
                      />
                    </div>
                    <div>
                      <Label>Laser Power (W)</Label>
                      <Input
                        type="number"
                        value={equipment.laserPower}
                        onChange={(e) => updateEquipment(equipment.id, 'laserPower', Number(e.target.value))}
                        min="500"
                        max="20000"
                        step="100"
                      />
                    </div>
                    <div>
                      <Label>Laser Type</Label>
                      <Select
                        value={equipment.laserType}
                        onChange={(value: 'fiber' | 'co2' | 'disk' | 'diode') => 
                          updateEquipment(equipment.id, 'laserType', value)
                        }
                        options={laserTypeOptions}
                      />
                    </div>
                    <div>
                      <Label>Max Thickness (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={equipment.maxThickness}
                        onChange={(e) => updateEquipment(equipment.id, 'maxThickness', Number(e.target.value))}
                        min="1"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label>Cutting Speed (mm/min)</Label>
                      <Input
                        type="number"
                        value={equipment.cuttingSpeed}
                        onChange={(e) => updateEquipment(equipment.id, 'cuttingSpeed', Number(e.target.value))}
                        min="500"
                        max="20000"
                        step="100"
                      />
                    </div>
                    <div>
                      <Label>Accuracy (mm)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={equipment.accuracy}
                        onChange={(e) => updateEquipment(equipment.id, 'accuracy', Number(e.target.value))}
                        min="0.01"
                        max="1"
                      />
                    </div>
                    <div>
                      <Label>Work Area X (mm)</Label>
                      <Input
                        type="number"
                        value={equipment.workAreaX}
                        onChange={(e) => updateEquipment(equipment.id, 'workAreaX', Number(e.target.value))}
                        min="500"
                        max="6000"
                        step="100"
                      />
                    </div>
                    <div>
                      <Label>Work Area Y (mm)</Label>
                      <Input
                        type="number"
                        value={equipment.workAreaY}
                        onChange={(e) => updateEquipment(equipment.id, 'workAreaY', Number(e.target.value))}
                        min="500"
                        max="12000"
                        step="100"
                      />
                    </div>
                    <div>
                      <Label>Power Consumption (kW)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={equipment.powerConsumption}
                        onChange={(e) => updateEquipment(equipment.id, 'powerConsumption', Number(e.target.value))}
                        min="5"
                        max="50"
                      />
                    </div>
                    <div>
                      <Label>Maintenance Cost/Year ($)</Label>
                      <Input
                        type="number"
                        value={equipment.maintenanceCost}
                        onChange={(e) => updateEquipment(equipment.id, 'maintenanceCost', Number(e.target.value))}
                        min="2000"
                        max="50000"
                        step="500"
                      />
                    </div>
                    <div>
                      <Label>Warranty (years)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={equipment.warrantyPeriod}
                        onChange={(e) => updateEquipment(equipment.id, 'warrantyPeriod', Number(e.target.value))}
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <Label>Delivery Time (weeks)</Label>
                      <Input
                        type="number"
                        value={equipment.deliveryTime}
                        onChange={(e) => updateEquipment(equipment.id, 'deliveryTime', Number(e.target.value))}
                        min="4"
                        max="52"
                      />
                    </div>
                    <div>
                      <Label>Floor Space (m²)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={equipment.floorSpace}
                        onChange={(e) => updateEquipment(equipment.id, 'floorSpace', Number(e.target.value))}
                        min="5"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label>Operator Skill Required</Label>
                      <Select
                        value={equipment.operatorSkillRequired}
                        onChange={(value: 'low' | 'medium' | 'high') => 
                          updateEquipment(equipment.id, 'operatorSkillRequired', value)
                        }
                        options={skillLevelOptions}
                      />
                    </div>
                    <div>
                      <Label>Service Availability</Label>
                      <Select
                        value={equipment.serviceAvailability}
                        onChange={(value: 'poor' | 'fair' | 'good' | 'excellent') => 
                          updateEquipment(equipment.id, 'serviceAvailability', value)
                        }
                        options={serviceOptions}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="criteria" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Evaluation Criteria Weights (Total: {Object.values(evaluationCriteria).reduce((a, b) => a + b, 0)}%)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Purchase Price Weight (%)</Label>
                  <Input
                    type="number"
                    value={evaluationCriteria.purchasePrice}
                    onChange={(e) => setEvaluationCriteria({
                      ...evaluationCriteria,
                      purchasePrice: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Operating Cost Weight (%)</Label>
                  <Input
                    type="number"
                    value={evaluationCriteria.operatingCost}
                    onChange={(e) => setEvaluationCriteria({
                      ...evaluationCriteria,
                      operatingCost: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Productivity Weight (%)</Label>
                  <Input
                    type="number"
                    value={evaluationCriteria.productivity}
                    onChange={(e) => setEvaluationCriteria({
                      ...evaluationCriteria,
                      productivity: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Quality Weight (%)</Label>
                  <Input
                    type="number"
                    value={evaluationCriteria.quality}
                    onChange={(e) => setEvaluationCriteria({
                      ...evaluationCriteria,
                      quality: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Reliability Weight (%)</Label>
                  <Input
                    type="number"
                    value={evaluationCriteria.reliability}
                    onChange={(e) => setEvaluationCriteria({
                      ...evaluationCriteria,
                      reliability: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Service Support Weight (%)</Label>
                  <Input
                    type="number"
                    value={evaluationCriteria.serviceSupport}
                    onChange={(e) => setEvaluationCriteria({
                      ...evaluationCriteria,
                      serviceSupport: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Future Proofing Weight (%)</Label>
                  <Input
                    type="number"
                    value={evaluationCriteria.futureProofing}
                    onChange={(e) => setEvaluationCriteria({
                      ...evaluationCriteria,
                      futureProofing: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Operating Conditions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Annual Operating Hours</Label>
                  <Input
                    type="number"
                    value={operatingConditions.annualOperatingHours}
                    onChange={(e) => setOperatingConditions({
                      ...operatingConditions,
                      annualOperatingHours: Number(e.target.value)
                    })}
                    min="500"
                    max="8760"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Electricity Rate ($/kWh)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={operatingConditions.electricityRate}
                    onChange={(e) => setOperatingConditions({
                      ...operatingConditions,
                      electricityRate: Number(e.target.value)
                    })}
                    min="0.05"
                    max="0.50"
                  />
                </div>
                <div>
                  <Label>Labor Rate ($/hour)</Label>
                  <Input
                    type="number"
                    step="0.50"
                    value={operatingConditions.laborRate}
                    onChange={(e) => setOperatingConditions({
                      ...operatingConditions,
                      laborRate: Number(e.target.value)
                    })}
                    min="15"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Expected Lifespan (years)</Label>
                  <Input
                    type="number"
                    value={operatingConditions.expectedLifespan}
                    onChange={(e) => setOperatingConditions({
                      ...operatingConditions,
                      expectedLifespan: Number(e.target.value)
                    })}
                    min="5"
                    max="20"
                  />
                </div>
                <div>
                  <Label>Financing Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={operatingConditions.financingRate}
                    onChange={(e) => setOperatingConditions({
                      ...operatingConditions,
                      financingRate: Number(e.target.value)
                    })}
                    min="0"
                    max="15"
                  />
                </div>
                <div>
                  <Label>Residual Value (%)</Label>
                  <Input
                    type="number"
                    value={operatingConditions.residualValue}
                    onChange={(e) => setOperatingConditions({
                      ...operatingConditions,
                      residualValue: Number(e.target.value)
                    })}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Production Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Typical Thickness (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={productionRequirements.typicalThickness}
                    onChange={(e) => setProductionRequirements({
                      ...productionRequirements,
                      typicalThickness: Number(e.target.value)
                    })}
                    min="0.5"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Required Accuracy (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={productionRequirements.requiredAccuracy}
                    onChange={(e) => setProductionRequirements({
                      ...productionRequirements,
                      requiredAccuracy: Number(e.target.value)
                    })}
                    min="0.01"
                    max="1"
                  />
                </div>
                <div>
                  <Label>Annual Volume (parts)</Label>
                  <Input
                    type="number"
                    value={productionRequirements.annualVolume}
                    onChange={(e) => setProductionRequirements({
                      ...productionRequirements,
                      annualVolume: Number(e.target.value)
                    })}
                    min="1000"
                    max="1000000"
                    step="1000"
                  />
                </div>
                <div>
                  <Label>Average Part Size (mm)</Label>
                  <Input
                    type="number"
                    value={productionRequirements.averagePartSize}
                    onChange={(e) => setProductionRequirements({
                      ...productionRequirements,
                      averagePartSize: Number(e.target.value)
                    })}
                    min="10"
                    max="2000"
                    step="10"
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
            {isLoading ? 'Comparing Equipment...' : 'Compare Equipment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentComparisonCalculatorForm;
