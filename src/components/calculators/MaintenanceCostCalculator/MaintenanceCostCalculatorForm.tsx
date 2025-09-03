import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Wrench, Settings, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface MaintenanceCostCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const MaintenanceCostCalculatorForm: React.FC<MaintenanceCostCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('equipment');

  const [equipmentSpecs, setEquipmentSpecs] = useState({
    equipmentValue: 250000, // $ initial cost
    equipmentAge: 3, // years
    operatingHours: 2000, // hours per year
    equipmentCriticality: 'high' as 'low' | 'medium' | 'high' | 'critical',
    warrantyRemaining: 0 // years
  });

  const [maintenanceStrategy, setMaintenanceStrategy] = useState({
    strategy: 'preventive' as 'reactive' | 'preventive' | 'predictive' | 'reliability_centered',
    plannedMaintenanceHours: 120, // hours per year
    unplannedDowntimeHours: 48, // hours per year
    maintenanceTeamSize: 2, // number of technicians
    contractMaintenanceCost: 5000 // $ per year
  });

  const [costFactors, setCostFactors] = useState({
    laborRate: 75.00, // $ per hour
    downtimeRate: 500.00, // $ per hour of downtime
    consumables: 3000, // $ per year
    wearParts: 8000, // $ per year
    majorComponents: 15000 // $ per year
  });

  const [riskFactors, setRiskFactors] = useState({
    environmentalConditions: 'normal' as 'clean' | 'normal' | 'harsh' | 'extreme',
    operatorSkillLevel: 'experienced' as 'novice' | 'intermediate' | 'experienced' | 'expert',
    maintenanceQuality: 'good' as 'poor' | 'fair' | 'good' | 'excellent',
    sparePartsAvailability: 'good' as 'poor' | 'fair' | 'good' | 'excellent'
  });

  const handleCalculate = () => {
    const inputs = {
      equipmentValue: equipmentSpecs.equipmentValue,
      equipmentAge: equipmentSpecs.equipmentAge,
      operatingHours: equipmentSpecs.operatingHours,
      maintenanceStrategy: maintenanceStrategy.strategy,
      laborRate: costFactors.laborRate,
      spareParts: {
        consumables: costFactors.consumables,
        wearParts: costFactors.wearParts,
        majorComponents: costFactors.majorComponents
      },
      downtimeRate: costFactors.downtimeRate,
      plannedMaintenanceHours: maintenanceStrategy.plannedMaintenanceHours,
      unplannedDowntimeHours: maintenanceStrategy.unplannedDowntimeHours,
      maintenanceTeamSize: maintenanceStrategy.maintenanceTeamSize,
      contractMaintenanceCost: maintenanceStrategy.contractMaintenanceCost,
      warrantyRemaining: equipmentSpecs.warrantyRemaining,
      equipmentCriticality: equipmentSpecs.equipmentCriticality,
      // Additional factors for enhanced analysis
      environmentalConditions: riskFactors.environmentalConditions,
      operatorSkillLevel: riskFactors.operatorSkillLevel,
      maintenanceQuality: riskFactors.maintenanceQuality,
      sparePartsAvailability: riskFactors.sparePartsAvailability
    };
    onCalculate(inputs);
  };

  const strategyOptions = [
    { value: 'reactive', label: 'Reactive (Fix when broken)' },
    { value: 'preventive', label: 'Preventive (Scheduled maintenance)' },
    { value: 'predictive', label: 'Predictive (Condition-based)' },
    { value: 'reliability_centered', label: 'Reliability-Centered (RCM)' }
  ];

  const criticalityOptions = [
    { value: 'low', label: 'Low (Non-critical)' },
    { value: 'medium', label: 'Medium (Important)' },
    { value: 'high', label: 'High (Critical)' },
    { value: 'critical', label: 'Critical (Mission-critical)' }
  ];

  const environmentalOptions = [
    { value: 'clean', label: 'Clean (Controlled environment)' },
    { value: 'normal', label: 'Normal (Standard shop)' },
    { value: 'harsh', label: 'Harsh (Dusty/humid)' },
    { value: 'extreme', label: 'Extreme (Corrosive/high temp)' }
  ];

  const skillLevelOptions = [
    { value: 'novice', label: 'Novice (0-1 years)' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)' },
    { value: 'experienced', label: 'Experienced (3-7 years)' },
    { value: 'expert', label: 'Expert (7+ years)' }
  ];

  const qualityOptions = [
    { value: 'poor', label: 'Poor (Minimal maintenance)' },
    { value: 'fair', label: 'Fair (Basic maintenance)' },
    { value: 'good', label: 'Good (Standard procedures)' },
    { value: 'excellent', label: 'Excellent (Best practices)' }
  ];

  const availabilityOptions = [
    { value: 'poor', label: 'Poor (Long lead times)' },
    { value: 'fair', label: 'Fair (Some delays)' },
    { value: 'good', label: 'Good (Usually available)' },
    { value: 'excellent', label: 'Excellent (Always in stock)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wrench className="h-5 w-5" />
          <span>Maintenance Cost Calculator</span>
          <Badge variant="outline">Cost Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Equipment Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Equipment Value ($)</Label>
                  <Input
                    type="number"
                    value={equipmentSpecs.equipmentValue}
                    onChange={(e) => setEquipmentSpecs({
                      ...equipmentSpecs,
                      equipmentValue: Number(e.target.value)
                    })}
                    min="10000"
                    max="5000000"
                    step="1000"
                  />
                </div>
                <div>
                  <Label>Equipment Age (years)</Label>
                  <Input
                    type="number"
                    value={equipmentSpecs.equipmentAge}
                    onChange={(e) => setEquipmentSpecs({
                      ...equipmentSpecs,
                      equipmentAge: Number(e.target.value)
                    })}
                    min="0"
                    max="30"
                    step="0.5"
                  />
                </div>
                <div>
                  <Label>Operating Hours per Year</Label>
                  <Input
                    type="number"
                    value={equipmentSpecs.operatingHours}
                    onChange={(e) => setEquipmentSpecs({
                      ...equipmentSpecs,
                      operatingHours: Number(e.target.value)
                    })}
                    min="500"
                    max="8760"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Equipment Criticality</Label>
                  <Select
                    value={equipmentSpecs.equipmentCriticality}
                    onChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                      setEquipmentSpecs({
                        ...equipmentSpecs,
                        equipmentCriticality: value
                      })
                    }
                    options={criticalityOptions}
                  />
                </div>
                <div>
                  <Label>Warranty Remaining (years)</Label>
                  <Input
                    type="number"
                    value={equipmentSpecs.warrantyRemaining}
                    onChange={(e) => setEquipmentSpecs({
                      ...equipmentSpecs,
                      warrantyRemaining: Number(e.target.value)
                    })}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Maintenance Strategy
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Maintenance Strategy</Label>
                  <Select
                    value={maintenanceStrategy.strategy}
                    onChange={(value: 'reactive' | 'preventive' | 'predictive' | 'reliability_centered') => 
                      setMaintenanceStrategy({
                        ...maintenanceStrategy,
                        strategy: value
                      })
                    }
                    options={strategyOptions}
                  />
                </div>
                <div>
                  <Label>Maintenance Team Size</Label>
                  <Input
                    type="number"
                    value={maintenanceStrategy.maintenanceTeamSize}
                    onChange={(e) => setMaintenanceStrategy({
                      ...maintenanceStrategy,
                      maintenanceTeamSize: Number(e.target.value)
                    })}
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Planned Maintenance Hours/Year</Label>
                  <Input
                    type="number"
                    value={maintenanceStrategy.plannedMaintenanceHours}
                    onChange={(e) => setMaintenanceStrategy({
                      ...maintenanceStrategy,
                      plannedMaintenanceHours: Number(e.target.value)
                    })}
                    min="20"
                    max="1000"
                    step="10"
                  />
                </div>
                <div>
                  <Label>Unplanned Downtime Hours/Year</Label>
                  <Input
                    type="number"
                    value={maintenanceStrategy.unplannedDowntimeHours}
                    onChange={(e) => setMaintenanceStrategy({
                      ...maintenanceStrategy,
                      unplannedDowntimeHours: Number(e.target.value)
                    })}
                    min="0"
                    max="500"
                    step="5"
                  />
                </div>
                <div>
                  <Label>Contract Maintenance Cost/Year ($)</Label>
                  <Input
                    type="number"
                    value={maintenanceStrategy.contractMaintenanceCost}
                    onChange={(e) => setMaintenanceStrategy({
                      ...maintenanceStrategy,
                      contractMaintenanceCost: Number(e.target.value)
                    })}
                    min="0"
                    max="100000"
                    step="500"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Cost Factors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Labor Rate ($/hour)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costFactors.laborRate}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      laborRate: Number(e.target.value)
                    })}
                    min="25"
                    max="200"
                  />
                </div>
                <div>
                  <Label>Downtime Rate ($/hour)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costFactors.downtimeRate}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      downtimeRate: Number(e.target.value)
                    })}
                    min="100"
                    max="2000"
                  />
                </div>
                <div>
                  <Label>Consumables Cost/Year ($)</Label>
                  <Input
                    type="number"
                    value={costFactors.consumables}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      consumables: Number(e.target.value)
                    })}
                    min="500"
                    max="50000"
                    step="100"
                  />
                </div>
                <div>
                  <Label>Wear Parts Cost/Year ($)</Label>
                  <Input
                    type="number"
                    value={costFactors.wearParts}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      wearParts: Number(e.target.value)
                    })}
                    min="1000"
                    max="100000"
                    step="500"
                  />
                </div>
                <div>
                  <Label>Major Components Cost/Year ($)</Label>
                  <Input
                    type="number"
                    value={costFactors.majorComponents}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      majorComponents: Number(e.target.value)
                    })}
                    min="2000"
                    max="200000"
                    step="1000"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk Factors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Environmental Conditions</Label>
                  <Select
                    value={riskFactors.environmentalConditions}
                    onChange={(value: 'clean' | 'normal' | 'harsh' | 'extreme') => 
                      setRiskFactors({
                        ...riskFactors,
                        environmentalConditions: value
                      })
                    }
                    options={environmentalOptions}
                  />
                </div>
                <div>
                  <Label>Operator Skill Level</Label>
                  <Select
                    value={riskFactors.operatorSkillLevel}
                    onChange={(value: 'novice' | 'intermediate' | 'experienced' | 'expert') => 
                      setRiskFactors({
                        ...riskFactors,
                        operatorSkillLevel: value
                      })
                    }
                    options={skillLevelOptions}
                  />
                </div>
                <div>
                  <Label>Maintenance Quality</Label>
                  <Select
                    value={riskFactors.maintenanceQuality}
                    onChange={(value: 'poor' | 'fair' | 'good' | 'excellent') => 
                      setRiskFactors({
                        ...riskFactors,
                        maintenanceQuality: value
                      })
                    }
                    options={qualityOptions}
                  />
                </div>
                <div>
                  <Label>Spare Parts Availability</Label>
                  <Select
                    value={riskFactors.sparePartsAvailability}
                    onChange={(value: 'poor' | 'fair' | 'good' | 'excellent') => 
                      setRiskFactors({
                        ...riskFactors,
                        sparePartsAvailability: value
                      })
                    }
                    options={availabilityOptions}
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
            {isLoading ? 'Calculating Maintenance Costs...' : 'Calculate Maintenance Costs'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCostCalculatorForm;
