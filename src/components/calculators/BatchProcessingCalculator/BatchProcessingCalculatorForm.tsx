import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Plus, Minus, Package, Settings, Clock, Target, AlertTriangle } from 'lucide-react';

interface PartSpecification {
  partId: string;
  partName: string;
  quantity: number;
  materialType: string;
  thickness: number;
  dimensions: { length: number; width: number };
  complexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
  cuttingTime: number;
  setupTime: number;
  dueDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  profitMargin: number;
}

interface MaterialInventory {
  materialType: string;
  thickness: number;
  availableSheets: number;
  sheetSize: { length: number; width: number };
  costPerSheet: number;
  leadTime: number;
  minimumStock: number;
}

interface BatchProcessingCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const BatchProcessingCalculatorForm: React.FC<BatchProcessingCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('batch');

  const [batchConfiguration, setBatchConfiguration] = useState({
    batchSize: 50,
    partVariety: 3,
    totalQuantity: 500,
    batchingStrategy: 'material_based' as 'material_based' | 'thickness_based' | 'size_based' | 'mixed_optimization',
    priorityLevel: 'due_date' as 'fifo' | 'due_date' | 'profit_margin' | 'customer_priority'
  });

  const [partSpecifications, setPartSpecifications] = useState<PartSpecification[]>([
    {
      partId: 'P001',
      partName: 'Bracket A',
      quantity: 200,
      materialType: 'mild_steel',
      thickness: 3,
      dimensions: { length: 150, width: 100 },
      complexity: 'moderate',
      cuttingTime: 5,
      setupTime: 15,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'normal',
      profitMargin: 12.5
    }
  ]);

  const [machineConstraints, setMachineConstraints] = useState({
    sheetSize: { length: 3000, width: 1500 },
    maxThickness: 25,
    materialChangeTime: 30,
    thicknessChangeTime: 15,
    programChangeTime: 10,
    qualityCheckTime: 20,
    maxContinuousRunTime: 8
  });

  const [materialInventory, setMaterialInventory] = useState<MaterialInventory[]>([
    {
      materialType: 'mild_steel',
      thickness: 3,
      availableSheets: 50,
      sheetSize: { length: 3000, width: 1500 },
      costPerSheet: 150,
      leadTime: 3,
      minimumStock: 10
    }
  ]);

  const [operationalParameters, setOperationalParameters] = useState({
    shiftDuration: 8,
    shiftsPerDay: 2,
    workingDaysPerWeek: 5,
    setupEfficiency: 85,
    operatorSkillLevel: 'intermediate' as 'basic' | 'intermediate' | 'advanced' | 'expert',
    qualityTargets: { defectRate: 2, reworkRate: 1 }
  });

  const addPart = () => {
    const newPart: PartSpecification = {
      partId: `P${String(partSpecifications.length + 1).padStart(3, '0')}`,
      partName: `Part ${partSpecifications.length + 1}`,
      quantity: 100,
      materialType: 'mild_steel',
      thickness: 3,
      dimensions: { length: 100, width: 50 },
      complexity: 'moderate',
      cuttingTime: 3,
      setupTime: 10,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'normal',
      profitMargin: 10
    };
    setPartSpecifications([...partSpecifications, newPart]);
  };

  const removePart = (partId: string) => {
    setPartSpecifications(partSpecifications.filter(part => part.partId !== partId));
  };

  const updatePart = (partId: string, field: keyof PartSpecification, value: any) => {
    setPartSpecifications(partSpecifications.map(part => 
      part.partId === partId ? { ...part, [field]: value } : part
    ));
  };

  const addMaterial = () => {
    const newMaterial: MaterialInventory = {
      materialType: 'mild_steel',
      thickness: 3,
      availableSheets: 20,
      sheetSize: { length: 3000, width: 1500 },
      costPerSheet: 150,
      leadTime: 3,
      minimumStock: 5
    };
    setMaterialInventory([...materialInventory, newMaterial]);
  };

  const removeMaterial = (index: number) => {
    setMaterialInventory(materialInventory.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof MaterialInventory, value: any) => {
    setMaterialInventory(materialInventory.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    ));
  };

  const handleCalculate = () => {
    const inputs = {
      batchConfiguration,
      partSpecifications,
      machineConstraints,
      materialInventory,
      operationalParameters
    };
    onCalculate(inputs);
  };

  const materialOptions = [
    { value: 'mild_steel', label: 'Mild Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'carbon_steel', label: 'Carbon Steel' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' }
  ];

  const complexityOptions = [
    { value: 'simple', label: 'Simple' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'complex', label: 'Complex' },
    { value: 'very_complex', label: 'Very Complex' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Batch Processing Calculator</span>
          <Badge variant="outline">Production</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="batch">Batch Config</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="machine">Machine</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Batch Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Batch Size</Label>
                  <Input
                    type="number"
                    value={batchConfiguration.batchSize}
                    onChange={(e) => setBatchConfiguration({
                      ...batchConfiguration,
                      batchSize: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Part Variety</Label>
                  <Input
                    type="number"
                    value={batchConfiguration.partVariety}
                    onChange={(e) => setBatchConfiguration({
                      ...batchConfiguration,
                      partVariety: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Total Quantity</Label>
                  <Input
                    type="number"
                    value={batchConfiguration.totalQuantity}
                    onChange={(e) => setBatchConfiguration({
                      ...batchConfiguration,
                      totalQuantity: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Batching Strategy</Label>
                  <Select
                    value={batchConfiguration.batchingStrategy}
                    onChange={(value: 'material_based' | 'thickness_based' | 'size_based' | 'mixed_optimization') => 
                      setBatchConfiguration({
                        ...batchConfiguration,
                        batchingStrategy: value
                      })
                    }
                    options={[
                      { value: 'material_based', label: 'Material Based' },
                      { value: 'thickness_based', label: 'Thickness Based' },
                      { value: 'size_based', label: 'Size Based' },
                      { value: 'mixed_optimization', label: 'Mixed Optimization' }
                    ]}
                  />
                </div>
                <div>
                  <Label>Priority Level</Label>
                  <Select
                    value={batchConfiguration.priorityLevel}
                    onChange={(value: 'fifo' | 'due_date' | 'profit_margin' | 'customer_priority') => 
                      setBatchConfiguration({
                        ...batchConfiguration,
                        priorityLevel: value
                      })
                    }
                    options={[
                      { value: 'fifo', label: 'First In First Out' },
                      { value: 'due_date', label: 'Due Date Priority' },
                      { value: 'profit_margin', label: 'Profit Margin' },
                      { value: 'customer_priority', label: 'Customer Priority' }
                    ]}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="parts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Part Specifications</h3>
              <Button onClick={addPart} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {partSpecifications.map((part) => (
                <Card key={part.partId} className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Part ID</Label>
                      <Input
                        value={part.partId}
                        onChange={(e) => updatePart(part.partId, 'partId', e.target.value)}
                        placeholder="Part ID"
                      />
                    </div>
                    <div>
                      <Label>Part Name</Label>
                      <Input
                        value={part.partName}
                        onChange={(e) => updatePart(part.partId, 'partName', e.target.value)}
                        placeholder="Part name"
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={part.quantity}
                        onChange={(e) => updatePart(part.partId, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Material</Label>
                      <Select
                        value={part.materialType}
                        onChange={(value) => updatePart(part.partId, 'materialType', value)}
                        options={materialOptions}
                      />
                    </div>
                    <div>
                      <Label>Thickness (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={part.thickness}
                        onChange={(e) => updatePart(part.partId, 'thickness', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Length (mm)</Label>
                      <Input
                        type="number"
                        value={part.dimensions.length}
                        onChange={(e) => updatePart(part.partId, 'dimensions', {
                          ...part.dimensions,
                          length: Number(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Width (mm)</Label>
                      <Input
                        type="number"
                        value={part.dimensions.width}
                        onChange={(e) => updatePart(part.partId, 'dimensions', {
                          ...part.dimensions,
                          width: Number(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Complexity</Label>
                      <Select
                        value={part.complexity}
                        onChange={(value) => updatePart(part.partId, 'complexity', value)}
                        options={complexityOptions}
                      />
                    </div>
                    <div>
                      <Label>Cutting Time (min)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={part.cuttingTime}
                        onChange={(e) => updatePart(part.partId, 'cuttingTime', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Setup Time (min)</Label>
                      <Input
                        type="number"
                        value={part.setupTime}
                        onChange={(e) => updatePart(part.partId, 'setupTime', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={part.dueDate}
                        onChange={(e) => updatePart(part.partId, 'dueDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={part.priority}
                        onChange={(value) => updatePart(part.partId, 'priority', value)}
                        options={priorityOptions}
                      />
                    </div>
                    <div>
                      <Label>Profit Margin ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={part.profitMargin}
                        onChange={(e) => updatePart(part.partId, 'profitMargin', Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePart(part.partId)}
                        disabled={partSpecifications.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Material Inventory</h3>
              <Button onClick={addMaterial} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {materialInventory.map((material, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Material Type</Label>
                      <Select
                        value={material.materialType}
                        onChange={(value) => updateMaterial(index, 'materialType', value)}
                        options={materialOptions}
                      />
                    </div>
                    <div>
                      <Label>Thickness (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={material.thickness}
                        onChange={(e) => updateMaterial(index, 'thickness', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Available Sheets</Label>
                      <Input
                        type="number"
                        value={material.availableSheets}
                        onChange={(e) => updateMaterial(index, 'availableSheets', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Cost per Sheet ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={material.costPerSheet}
                        onChange={(e) => updateMaterial(index, 'costPerSheet', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Sheet Length (mm)</Label>
                      <Input
                        type="number"
                        value={material.sheetSize.length}
                        onChange={(e) => updateMaterial(index, 'sheetSize', {
                          ...material.sheetSize,
                          length: Number(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Sheet Width (mm)</Label>
                      <Input
                        type="number"
                        value={material.sheetSize.width}
                        onChange={(e) => updateMaterial(index, 'sheetSize', {
                          ...material.sheetSize,
                          width: Number(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Lead Time (days)</Label>
                      <Input
                        type="number"
                        value={material.leadTime}
                        onChange={(e) => updateMaterial(index, 'leadTime', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Min Stock</Label>
                      <Input
                        type="number"
                        value={material.minimumStock}
                        onChange={(e) => updateMaterial(index, 'minimumStock', Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMaterial(index)}
                        disabled={materialInventory.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="machine" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Machine Constraints
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Sheet Length (mm)</Label>
                  <Input
                    type="number"
                    value={machineConstraints.sheetSize.length}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      sheetSize: {
                        ...machineConstraints.sheetSize,
                        length: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Sheet Width (mm)</Label>
                  <Input
                    type="number"
                    value={machineConstraints.sheetSize.width}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      sheetSize: {
                        ...machineConstraints.sheetSize,
                        width: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Max Thickness (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={machineConstraints.maxThickness}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      maxThickness: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Material Change Time (min)</Label>
                  <Input
                    type="number"
                    value={machineConstraints.materialChangeTime}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      materialChangeTime: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Thickness Change Time (min)</Label>
                  <Input
                    type="number"
                    value={machineConstraints.thicknessChangeTime}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      thicknessChangeTime: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Program Change Time (min)</Label>
                  <Input
                    type="number"
                    value={machineConstraints.programChangeTime}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      programChangeTime: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Quality Check Time (min)</Label>
                  <Input
                    type="number"
                    value={machineConstraints.qualityCheckTime}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      qualityCheckTime: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Max Continuous Run (hours)</Label>
                  <Input
                    type="number"
                    value={machineConstraints.maxContinuousRunTime}
                    onChange={(e) => setMachineConstraints({
                      ...machineConstraints,
                      maxContinuousRunTime: Number(e.target.value)
                    })}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Operational Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Shift Duration (hours)</Label>
                  <Input
                    type="number"
                    value={operationalParameters.shiftDuration}
                    onChange={(e) => setOperationalParameters({
                      ...operationalParameters,
                      shiftDuration: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Shifts per Day</Label>
                  <Input
                    type="number"
                    value={operationalParameters.shiftsPerDay}
                    onChange={(e) => setOperationalParameters({
                      ...operationalParameters,
                      shiftsPerDay: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Working Days per Week</Label>
                  <Input
                    type="number"
                    value={operationalParameters.workingDaysPerWeek}
                    onChange={(e) => setOperationalParameters({
                      ...operationalParameters,
                      workingDaysPerWeek: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Setup Efficiency (%)</Label>
                  <Input
                    type="number"
                    value={operationalParameters.setupEfficiency}
                    onChange={(e) => setOperationalParameters({
                      ...operationalParameters,
                      setupEfficiency: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Operator Skill Level</Label>
                  <Select
                    value={operationalParameters.operatorSkillLevel}
                    onChange={(value: 'basic' | 'intermediate' | 'advanced' | 'expert') => 
                      setOperationalParameters({
                        ...operationalParameters,
                        operatorSkillLevel: value
                      })
                    }
                    options={[
                      { value: 'basic', label: 'Basic' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                      { value: 'expert', label: 'Expert' }
                    ]}
                  />
                </div>
                <div>
                  <Label>Defect Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={operationalParameters.qualityTargets.defectRate}
                    onChange={(e) => setOperationalParameters({
                      ...operationalParameters,
                      qualityTargets: {
                        ...operationalParameters.qualityTargets,
                        defectRate: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Rework Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={operationalParameters.qualityTargets.reworkRate}
                    onChange={(e) => setOperationalParameters({
                      ...operationalParameters,
                      qualityTargets: {
                        ...operationalParameters.qualityTargets,
                        reworkRate: Number(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={handleCalculate} 
            disabled={isLoading || partSpecifications.length === 0}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Optimizing Batches...' : 'Optimize Batch Processing'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchProcessingCalculatorForm;
