import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Plus, Minus, Package, Settings, Target } from 'lucide-react';

interface Part {
  id: string;
  name: string;
  length: number;
  width: number;
  thickness: number;
  quantity: number;
  materialType: string;
  priority: number;
}

interface SheetSpecification {
  id: string;
  name: string;
  length: number;
  width: number;
  thickness: number;
  materialType: string;
  cost: number;
  availability: number;
}

interface MaterialNestingOptimizerFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const MaterialNestingOptimizerForm: React.FC<MaterialNestingOptimizerFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      name: 'Bracket',
      length: 150,
      width: 100,
      thickness: 3,
      quantity: 50,
      materialType: 'mild_steel',
      priority: 1
    }
  ]);

  const [sheets, setSheets] = useState<SheetSpecification[]>([
    {
      id: '1',
      name: 'Standard Sheet',
      length: 3000,
      width: 1500,
      thickness: 3,
      materialType: 'mild_steel',
      cost: 150,
      availability: 10
    }
  ]);

  const [nestingConstraints, setNestingConstraints] = useState({
    minSpacing: 2,
    edgeMargin: 5,
    grainDirection: 'any' as 'any' | 'length' | 'width',
    allowMixedThickness: false,
    allowMixedMaterial: false
  });

  const [optimizationGoal, setOptimizationGoal] = useState<'material_usage' | 'cost_minimization' | 'sheet_count' | 'balanced'>('material_usage');

  const [cuttingParameters, setCuttingParameters] = useState({
    kerfWidth: 0.1,
    leadInLength: 2,
    leadOutLength: 2,
    pierceTime: 0.5,
    cuttingSpeed: 1000
  });

  const [productionConstraints, setProductionConstraints] = useState({
    maxSheetCount: 20,
    deliveryDeadline: 48,
    setupTime: 15
  });

  const [activeTab, setActiveTab] = useState('parts');

  const addPart = () => {
    const newPart: Part = {
      id: Date.now().toString(),
      name: `Part ${parts.length + 1}`,
      length: 100,
      width: 50,
      thickness: 3,
      quantity: 10,
      materialType: 'mild_steel',
      priority: 1
    };
    setParts([...parts, newPart]);
  };

  const removePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, field: keyof Part, value: any) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, [field]: value } : part
    ));
  };

  const addSheet = () => {
    const newSheet: SheetSpecification = {
      id: Date.now().toString(),
      name: `Sheet ${sheets.length + 1}`,
      length: 3000,
      width: 1500,
      thickness: 3,
      materialType: 'mild_steel',
      cost: 150,
      availability: 5
    };
    setSheets([...sheets, newSheet]);
  };

  const removeSheet = (id: string) => {
    setSheets(sheets.filter(sheet => sheet.id !== id));
  };

  const updateSheet = (id: string, field: keyof SheetSpecification, value: any) => {
    setSheets(sheets.map(sheet => 
      sheet.id === id ? { ...sheet, [field]: value } : sheet
    ));
  };

  const handleCalculate = () => {
    const inputs = {
      parts,
      sheetSpecs: sheets,
      nestingConstraints,
      optimizationGoal,
      cuttingParameters,
      productionConstraints
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Material Nesting Optimizer</span>
          <Badge variant="outline">Advanced</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="sheets">Sheets</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
          </TabsList>

          <TabsContent value="parts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Parts to Nest</h3>
              <Button onClick={addPart} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parts.map((part) => (
                <Card key={part.id} className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Part Name</Label>
                      <Input
                        value={part.name}
                        onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                        placeholder="Part name"
                      />
                    </div>
                    <div>
                      <Label>Length (mm)</Label>
                      <Input
                        type="number"
                        value={part.length}
                        onChange={(e) => updatePart(part.id, 'length', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Width (mm)</Label>
                      <Input
                        type="number"
                        value={part.width}
                        onChange={(e) => updatePart(part.id, 'width', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={part.quantity}
                        onChange={(e) => updatePart(part.id, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Material</Label>
                      <Select
                        value={part.materialType}
                        onChange={(value) => updatePart(part.id, 'materialType', value)}
                        options={materialOptions}
                      />
                    </div>
                    <div>
                      <Label>Thickness (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={part.thickness}
                        onChange={(e) => updatePart(part.id, 'thickness', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={part.priority.toString()}
                        onChange={(value) => updatePart(part.id, 'priority', Number(value))}
                        options={[
                          { value: '1', label: 'High' },
                          { value: '2', label: 'Medium' },
                          { value: '3', label: 'Low' }
                        ]}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePart(part.id)}
                        disabled={parts.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sheets" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Available Sheets</h3>
              <Button onClick={addSheet} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Sheet
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sheets.map((sheet) => (
                <Card key={sheet.id} className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Sheet Name</Label>
                      <Input
                        value={sheet.name}
                        onChange={(e) => updateSheet(sheet.id, 'name', e.target.value)}
                        placeholder="Sheet name"
                      />
                    </div>
                    <div>
                      <Label>Length (mm)</Label>
                      <Input
                        type="number"
                        value={sheet.length}
                        onChange={(e) => updateSheet(sheet.id, 'length', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Width (mm)</Label>
                      <Input
                        type="number"
                        value={sheet.width}
                        onChange={(e) => updateSheet(sheet.id, 'width', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Cost ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={sheet.cost}
                        onChange={(e) => updateSheet(sheet.id, 'cost', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Material</Label>
                      <Select
                        value={sheet.materialType}
                        onChange={(value) => updateSheet(sheet.id, 'materialType', value)}
                        options={materialOptions}
                      />
                    </div>
                    <div>
                      <Label>Thickness (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={sheet.thickness}
                        onChange={(e) => updateSheet(sheet.id, 'thickness', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Available</Label>
                      <Input
                        type="number"
                        value={sheet.availability}
                        onChange={(e) => updateSheet(sheet.id, 'availability', Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSheet(sheet.id)}
                        disabled={sheets.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="constraints" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Nesting Constraints
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label>Min Spacing (mm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={nestingConstraints.minSpacing}
                      onChange={(e) => setNestingConstraints({
                        ...nestingConstraints,
                        minSpacing: Number(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Edge Margin (mm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={nestingConstraints.edgeMargin}
                      onChange={(e) => setNestingConstraints({
                        ...nestingConstraints,
                        edgeMargin: Number(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Grain Direction</Label>
                    <Select
                      value={nestingConstraints.grainDirection}
                      onChange={(value: 'any' | 'length' | 'width') =>
                        setNestingConstraints({
                          ...nestingConstraints,
                          grainDirection: value
                        })
                      }
                      options={[
                        { value: 'any', label: 'Any Direction' },
                        { value: 'length', label: 'Length Direction' },
                        { value: 'width', label: 'Width Direction' }
                      ]}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Optimization Goal
                </h4>
                <div className="space-y-3">
                  <Select
                    value={optimizationGoal}
                    onChange={(value: 'material_usage' | 'cost_minimization' | 'sheet_count' | 'balanced') =>
                      setOptimizationGoal(value)
                    }
                    options={[
                      { value: 'material_usage', label: 'Maximize Material Usage' },
                      { value: 'cost_minimization', label: 'Minimize Total Cost' },
                      { value: 'sheet_count', label: 'Minimize Sheet Count' },
                      { value: 'balanced', label: 'Balanced Optimization' }
                    ]}
                  />
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Cutting Parameters</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <Label>Kerf Width (mm)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cuttingParameters.kerfWidth}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      kerfWidth: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Lead In (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParameters.leadInLength}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      leadInLength: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Lead Out (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParameters.leadOutLength}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      leadOutLength: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Pierce Time (s)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cuttingParameters.pierceTime}
                    onChange={(e) => setCuttingParameters({
                      ...cuttingParameters,
                      pierceTime: Number(e.target.value)
                    })}
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
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Production Constraints</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Max Sheet Count</Label>
                  <Input
                    type="number"
                    value={productionConstraints.maxSheetCount}
                    onChange={(e) => setProductionConstraints({
                      ...productionConstraints,
                      maxSheetCount: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Delivery Deadline (hours)</Label>
                  <Input
                    type="number"
                    value={productionConstraints.deliveryDeadline}
                    onChange={(e) => setProductionConstraints({
                      ...productionConstraints,
                      deliveryDeadline: Number(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Setup Time (minutes)</Label>
                  <Input
                    type="number"
                    value={productionConstraints.setupTime}
                    onChange={(e) => setProductionConstraints({
                      ...productionConstraints,
                      setupTime: Number(e.target.value)
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
            disabled={isLoading || parts.length === 0 || sheets.length === 0}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Optimizing Nesting...' : 'Optimize Material Nesting'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialNestingOptimizerForm;
