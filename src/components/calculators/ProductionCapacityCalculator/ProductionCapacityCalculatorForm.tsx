import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Factory, Settings, Users, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';

interface ProductionCapacityCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const ProductionCapacityCalculatorForm: React.FC<ProductionCapacityCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('equipment');

  const [equipmentConfig, setEquipmentConfig] = useState({
    machineCount: 3,
    operatingHoursPerDay: 8,
    workingDaysPerWeek: 5,
    shiftPattern: 'single' as 'single' | 'double' | 'triple' | 'continuous',
    machineEfficiency: 85
  });

  const [productionParams, setProductionParams] = useState({
    averagePartCuttingTime: 5.5, // minutes
    setupTimePerJob: 15, // minutes
    averageJobSize: 25, // parts per job
    plannedDowntime: 4, // hours per week
    unplannedDowntime: 2 // hours per week
  });

  const [staffing, setStaffing] = useState({
    operatorCount: 4,
    skillLevel: 'intermediate' as 'basic' | 'intermediate' | 'advanced' | 'expert',
    trainingHours: 40,
    overtimeCapacity: 20 // percentage
  });

  const [demandForecast, setDemandForecast] = useState({
    currentDemand: 2500, // parts per month
    projectedDemand: 3200, // parts per month
    seasonalVariation: 15, // percentage
    growthRate: 8 // percentage per year
  });

  const [constraints, setConstraints] = useState({
    floorSpace: 500, // square meters
    powerCapacity: 150, // kW
    budgetLimit: 250000, // USD
    deliveryRequirements: 'standard' as 'rush' | 'standard' | 'flexible'
  });

  const handleCalculate = () => {
    const inputs = {
      machineCount: equipmentConfig.machineCount,
      operatingHoursPerDay: equipmentConfig.operatingHoursPerDay,
      workingDaysPerWeek: equipmentConfig.workingDaysPerWeek,
      averagePartCuttingTime: productionParams.averagePartCuttingTime,
      setupTimePerJob: productionParams.setupTimePerJob,
      averageJobSize: productionParams.averageJobSize,
      machineEfficiency: equipmentConfig.machineEfficiency / 100,
      plannedDowntime: productionParams.plannedDowntime,
      unplannedDowntime: productionParams.unplannedDowntime,
      operatorCount: staffing.operatorCount,
      shiftPattern: equipmentConfig.shiftPattern,
      seasonalVariation: demandForecast.seasonalVariation,
      demandForecast: demandForecast.projectedDemand
    };
    onCalculate(inputs);
  };

  const shiftPatternOptions = [
    { value: 'single', label: 'Single Shift (8 hours)' },
    { value: 'double', label: 'Double Shift (16 hours)' },
    { value: 'triple', label: 'Triple Shift (24 hours)' },
    { value: 'continuous', label: 'Continuous (24/7)' }
  ];

  const skillLevelOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const deliveryOptions = [
    { value: 'rush', label: 'Rush Orders (< 24h)' },
    { value: 'standard', label: 'Standard (2-5 days)' },
    { value: 'flexible', label: 'Flexible (1-2 weeks)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Factory className="h-5 w-5" />
          <span>Production Capacity Calculator</span>
          <Badge variant="outline">Planning</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="staffing">Staffing</TabsTrigger>
            <TabsTrigger value="demand">Demand</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Equipment Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Number of Machines</Label>
                  <Input
                    type="number"
                    value={equipmentConfig.machineCount}
                    onChange={(e) => setEquipmentConfig({
                      ...equipmentConfig,
                      machineCount: Number(e.target.value)
                    })}
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <Label>Operating Hours per Day</Label>
                  <Input
                    type="number"
                    value={equipmentConfig.operatingHoursPerDay}
                    onChange={(e) => setEquipmentConfig({
                      ...equipmentConfig,
                      operatingHoursPerDay: Number(e.target.value)
                    })}
                    min="1"
                    max="24"
                  />
                </div>
                <div>
                  <Label>Working Days per Week</Label>
                  <Input
                    type="number"
                    value={equipmentConfig.workingDaysPerWeek}
                    onChange={(e) => setEquipmentConfig({
                      ...equipmentConfig,
                      workingDaysPerWeek: Number(e.target.value)
                    })}
                    min="1"
                    max="7"
                  />
                </div>
                <div>
                  <Label>Shift Pattern</Label>
                  <Select
                    value={equipmentConfig.shiftPattern}
                    onChange={(value: 'single' | 'double' | 'triple' | 'continuous') => 
                      setEquipmentConfig({
                        ...equipmentConfig,
                        shiftPattern: value
                      })
                    }
                    options={shiftPatternOptions}
                  />
                </div>
                <div>
                  <Label>Machine Efficiency (%)</Label>
                  <Input
                    type="number"
                    value={equipmentConfig.machineEfficiency}
                    onChange={(e) => setEquipmentConfig({
                      ...equipmentConfig,
                      machineEfficiency: Number(e.target.value)
                    })}
                    min="50"
                    max="100"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Production Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Average Part Cutting Time (min)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={productionParams.averagePartCuttingTime}
                    onChange={(e) => setProductionParams({
                      ...productionParams,
                      averagePartCuttingTime: Number(e.target.value)
                    })}
                    min="0.1"
                    max="60"
                  />
                </div>
                <div>
                  <Label>Setup Time per Job (min)</Label>
                  <Input
                    type="number"
                    value={productionParams.setupTimePerJob}
                    onChange={(e) => setProductionParams({
                      ...productionParams,
                      setupTimePerJob: Number(e.target.value)
                    })}
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <Label>Average Job Size (parts)</Label>
                  <Input
                    type="number"
                    value={productionParams.averageJobSize}
                    onChange={(e) => setProductionParams({
                      ...productionParams,
                      averageJobSize: Number(e.target.value)
                    })}
                    min="1"
                    max="1000"
                  />
                </div>
                <div>
                  <Label>Planned Downtime (hours/week)</Label>
                  <Input
                    type="number"
                    value={productionParams.plannedDowntime}
                    onChange={(e) => setProductionParams({
                      ...productionParams,
                      plannedDowntime: Number(e.target.value)
                    })}
                    min="0"
                    max="40"
                  />
                </div>
                <div>
                  <Label>Unplanned Downtime (hours/week)</Label>
                  <Input
                    type="number"
                    value={productionParams.unplannedDowntime}
                    onChange={(e) => setProductionParams({
                      ...productionParams,
                      unplannedDowntime: Number(e.target.value)
                    })}
                    min="0"
                    max="20"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="staffing" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Staffing Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Number of Operators</Label>
                  <Input
                    type="number"
                    value={staffing.operatorCount}
                    onChange={(e) => setStaffing({
                      ...staffing,
                      operatorCount: Number(e.target.value)
                    })}
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Operator Skill Level</Label>
                  <Select
                    value={staffing.skillLevel}
                    onChange={(value: 'basic' | 'intermediate' | 'advanced' | 'expert') => 
                      setStaffing({
                        ...staffing,
                        skillLevel: value
                      })
                    }
                    options={skillLevelOptions}
                  />
                </div>
                <div>
                  <Label>Training Hours (per operator)</Label>
                  <Input
                    type="number"
                    value={staffing.trainingHours}
                    onChange={(e) => setStaffing({
                      ...staffing,
                      trainingHours: Number(e.target.value)
                    })}
                    min="0"
                    max="200"
                  />
                </div>
                <div>
                  <Label>Overtime Capacity (%)</Label>
                  <Input
                    type="number"
                    value={staffing.overtimeCapacity}
                    onChange={(e) => setStaffing({
                      ...staffing,
                      overtimeCapacity: Number(e.target.value)
                    })}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="demand" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Demand Forecast
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Monthly Demand (parts)</Label>
                  <Input
                    type="number"
                    value={demandForecast.currentDemand}
                    onChange={(e) => setDemandForecast({
                      ...demandForecast,
                      currentDemand: Number(e.target.value)
                    })}
                    min="100"
                    max="50000"
                  />
                </div>
                <div>
                  <Label>Projected Monthly Demand (parts)</Label>
                  <Input
                    type="number"
                    value={demandForecast.projectedDemand}
                    onChange={(e) => setDemandForecast({
                      ...demandForecast,
                      projectedDemand: Number(e.target.value)
                    })}
                    min="100"
                    max="100000"
                  />
                </div>
                <div>
                  <Label>Seasonal Variation (%)</Label>
                  <Input
                    type="number"
                    value={demandForecast.seasonalVariation}
                    onChange={(e) => setDemandForecast({
                      ...demandForecast,
                      seasonalVariation: Number(e.target.value)
                    })}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Annual Growth Rate (%)</Label>
                  <Input
                    type="number"
                    value={demandForecast.growthRate}
                    onChange={(e) => setDemandForecast({
                      ...demandForecast,
                      growthRate: Number(e.target.value)
                    })}
                    min="-10"
                    max="50"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="constraints" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Operational Constraints
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Available Floor Space (m²)</Label>
                  <Input
                    type="number"
                    value={constraints.floorSpace}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      floorSpace: Number(e.target.value)
                    })}
                    min="50"
                    max="5000"
                  />
                </div>
                <div>
                  <Label>Power Capacity (kW)</Label>
                  <Input
                    type="number"
                    value={constraints.powerCapacity}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      powerCapacity: Number(e.target.value)
                    })}
                    min="50"
                    max="1000"
                  />
                </div>
                <div>
                  <Label>Budget Limit (USD)</Label>
                  <Input
                    type="number"
                    value={constraints.budgetLimit}
                    onChange={(e) => setConstraints({
                      ...constraints,
                      budgetLimit: Number(e.target.value)
                    })}
                    min="50000"
                    max="2000000"
                  />
                </div>
                <div>
                  <Label>Delivery Requirements</Label>
                  <Select
                    value={constraints.deliveryRequirements}
                    onChange={(value: 'rush' | 'standard' | 'flexible') => 
                      setConstraints({
                        ...constraints,
                        deliveryRequirements: value
                      })
                    }
                    options={deliveryOptions}
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
            {isLoading ? 'Analyzing Capacity...' : 'Analyze Production Capacity'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionCapacityCalculatorForm;
