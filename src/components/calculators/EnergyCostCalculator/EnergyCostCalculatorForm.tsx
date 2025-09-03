import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Zap, Settings, Clock, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface EnergyCostCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const EnergyCostCalculatorForm: React.FC<EnergyCostCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('system');

  const [systemSpecs, setSystemSpecs] = useState({
    laserPower: 6000, // W
    systemEfficiency: 0.25, // 25%
    powerFactor: 0.9,
    auxiliaryPower: 2000, // W
    hvacPower: 3000, // W
    standbyPower: 500 // W
  });

  const [operatingSchedule, setOperatingSchedule] = useState({
    operatingHours: 8, // hours per day
    workingDays: 22, // days per month
    standbyHours: 16, // hours per day in standby
    quantity: 1000 // parts per month (optional)
  });

  const [energyRates, setEnergyRates] = useState({
    electricityRate: 0.12, // $/kWh
    demandCharge: 15.00, // $/kW per month
    peakDemandWindow: 4, // hours of peak demand pricing
    peakRateMultiplier: 1.8 // multiplier for peak hours
  });

  const [costOptimization, setCostOptimization] = useState({
    timeOfUseScheduling: 'standard' as 'standard' | 'peak_avoidance' | 'off_peak_only',
    demandManagement: 'none' as 'none' | 'basic' | 'advanced',
    efficiencyUpgrades: 'current' as 'current' | 'planned' | 'maximum'
  });

  const handleCalculate = () => {
    const inputs = {
      laserPower: systemSpecs.laserPower,
      operatingHours: operatingSchedule.operatingHours,
      workingDays: operatingSchedule.workingDays,
      electricityRate: energyRates.electricityRate,
      demandCharge: energyRates.demandCharge,
      powerFactor: systemSpecs.powerFactor,
      systemEfficiency: systemSpecs.systemEfficiency,
      auxiliaryPower: systemSpecs.auxiliaryPower,
      hvacPower: systemSpecs.hvacPower,
      standbyPower: systemSpecs.standbyPower,
      standbyHours: operatingSchedule.standbyHours,
      peakDemandWindow: energyRates.peakDemandWindow,
      peakRateMultiplier: energyRates.peakRateMultiplier,
      quantity: operatingSchedule.quantity
    };
    onCalculate(inputs);
  };

  const timeOfUseOptions = [
    { value: 'standard', label: 'Standard Schedule' },
    { value: 'peak_avoidance', label: 'Peak Avoidance' },
    { value: 'off_peak_only', label: 'Off-Peak Only' }
  ];

  const demandManagementOptions = [
    { value: 'none', label: 'No Management' },
    { value: 'basic', label: 'Basic Load Control' },
    { value: 'advanced', label: 'Advanced Demand Response' }
  ];

  const efficiencyOptions = [
    { value: 'current', label: 'Current System' },
    { value: 'planned', label: 'Planned Upgrades' },
    { value: 'maximum', label: 'Maximum Efficiency' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Energy Cost Calculator</span>
          <Badge variant="outline">Cost Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                System Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Laser Power (W)</Label>
                  <Input
                    type="number"
                    value={systemSpecs.laserPower}
                    onChange={(e) => setSystemSpecs({
                      ...systemSpecs,
                      laserPower: Number(e.target.value)
                    })}
                    min="500"
                    max="30000"
                  />
                </div>
                <div>
                  <Label>System Efficiency (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={systemSpecs.systemEfficiency * 100}
                    onChange={(e) => setSystemSpecs({
                      ...systemSpecs,
                      systemEfficiency: Number(e.target.value) / 100
                    })}
                    min="15"
                    max="45"
                  />
                </div>
                <div>
                  <Label>Power Factor</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={systemSpecs.powerFactor}
                    onChange={(e) => setSystemSpecs({
                      ...systemSpecs,
                      powerFactor: Number(e.target.value)
                    })}
                    min="0.7"
                    max="1.0"
                  />
                </div>
                <div>
                  <Label>Auxiliary Power (W)</Label>
                  <Input
                    type="number"
                    value={systemSpecs.auxiliaryPower}
                    onChange={(e) => setSystemSpecs({
                      ...systemSpecs,
                      auxiliaryPower: Number(e.target.value)
                    })}
                    min="500"
                    max="10000"
                  />
                </div>
                <div>
                  <Label>HVAC Power (W)</Label>
                  <Input
                    type="number"
                    value={systemSpecs.hvacPower}
                    onChange={(e) => setSystemSpecs({
                      ...systemSpecs,
                      hvacPower: Number(e.target.value)
                    })}
                    min="1000"
                    max="15000"
                  />
                </div>
                <div>
                  <Label>Standby Power (W)</Label>
                  <Input
                    type="number"
                    value={systemSpecs.standbyPower}
                    onChange={(e) => setSystemSpecs({
                      ...systemSpecs,
                      standbyPower: Number(e.target.value)
                    })}
                    min="100"
                    max="2000"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Operating Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Operating Hours per Day</Label>
                  <Input
                    type="number"
                    value={operatingSchedule.operatingHours}
                    onChange={(e) => setOperatingSchedule({
                      ...operatingSchedule,
                      operatingHours: Number(e.target.value)
                    })}
                    min="1"
                    max="24"
                  />
                </div>
                <div>
                  <Label>Working Days per Month</Label>
                  <Input
                    type="number"
                    value={operatingSchedule.workingDays}
                    onChange={(e) => setOperatingSchedule({
                      ...operatingSchedule,
                      workingDays: Number(e.target.value)
                    })}
                    min="1"
                    max="31"
                  />
                </div>
                <div>
                  <Label>Standby Hours per Day</Label>
                  <Input
                    type="number"
                    value={operatingSchedule.standbyHours}
                    onChange={(e) => setOperatingSchedule({
                      ...operatingSchedule,
                      standbyHours: Number(e.target.value)
                    })}
                    min="0"
                    max="23"
                  />
                </div>
                <div>
                  <Label>Parts per Month (Optional)</Label>
                  <Input
                    type="number"
                    value={operatingSchedule.quantity}
                    onChange={(e) => setOperatingSchedule({
                      ...operatingSchedule,
                      quantity: Number(e.target.value)
                    })}
                    min="1"
                    max="100000"
                    placeholder="For cost per part calculation"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rates" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Energy Rates & Charges
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Electricity Rate ($/kWh)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={energyRates.electricityRate}
                    onChange={(e) => setEnergyRates({
                      ...energyRates,
                      electricityRate: Number(e.target.value)
                    })}
                    min="0.05"
                    max="0.50"
                  />
                </div>
                <div>
                  <Label>Demand Charge ($/kW/month)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={energyRates.demandCharge}
                    onChange={(e) => setEnergyRates({
                      ...energyRates,
                      demandCharge: Number(e.target.value)
                    })}
                    min="5"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Peak Demand Window (hours)</Label>
                  <Input
                    type="number"
                    value={energyRates.peakDemandWindow}
                    onChange={(e) => setEnergyRates({
                      ...energyRates,
                      peakDemandWindow: Number(e.target.value)
                    })}
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <Label>Peak Rate Multiplier</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={energyRates.peakRateMultiplier}
                    onChange={(e) => setEnergyRates({
                      ...energyRates,
                      peakRateMultiplier: Number(e.target.value)
                    })}
                    min="1.0"
                    max="5.0"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Cost Optimization Options
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Time-of-Use Scheduling</Label>
                  <Select
                    value={costOptimization.timeOfUseScheduling}
                    onChange={(value: 'standard' | 'peak_avoidance' | 'off_peak_only') => 
                      setCostOptimization({
                        ...costOptimization,
                        timeOfUseScheduling: value
                      })
                    }
                    options={timeOfUseOptions}
                  />
                </div>
                <div>
                  <Label>Demand Management</Label>
                  <Select
                    value={costOptimization.demandManagement}
                    onChange={(value: 'none' | 'basic' | 'advanced') => 
                      setCostOptimization({
                        ...costOptimization,
                        demandManagement: value
                      })
                    }
                    options={demandManagementOptions}
                  />
                </div>
                <div>
                  <Label>Efficiency Upgrades</Label>
                  <Select
                    value={costOptimization.efficiencyUpgrades}
                    onChange={(value: 'current' | 'planned' | 'maximum') => 
                      setCostOptimization({
                        ...costOptimization,
                        efficiencyUpgrades: value
                      })
                    }
                    options={efficiencyOptions}
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
            {isLoading ? 'Calculating Energy Costs...' : 'Calculate Energy Costs'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyCostCalculatorForm;
