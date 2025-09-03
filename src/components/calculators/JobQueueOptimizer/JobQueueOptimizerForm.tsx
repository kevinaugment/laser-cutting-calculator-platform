import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Clock, Settings, Users, Target, Plus, Trash2 } from 'lucide-react';

interface JobQueueOptimizerFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const JobQueueOptimizerForm: React.FC<JobQueueOptimizerFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('jobs');

  const [jobQueue, setJobQueue] = useState([
    {
      jobId: 'JOB001',
      jobName: 'Steel Bracket Production',
      priority: 'high' as 'low' | 'normal' | 'high' | 'urgent' | 'critical',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
      estimatedDuration: 120, // minutes
      materialType: 'mild_steel',
      thickness: 3.0, // mm
      setupTime: 15, // minutes
      partCount: 50,
      customerImportance: 'preferred' as 'standard' | 'preferred' | 'vip',
      profitMargin: 25, // percentage
      dependencies: [] as string[]
    },
    {
      jobId: 'JOB002',
      jobName: 'Aluminum Panel Cutting',
      priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent' | 'critical',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      estimatedDuration: 90, // minutes
      materialType: 'aluminum',
      thickness: 2.0, // mm
      setupTime: 10, // minutes
      partCount: 30,
      customerImportance: 'vip' as 'standard' | 'preferred' | 'vip',
      profitMargin: 35, // percentage
      dependencies: [] as string[]
    }
  ]);

  const [machineCapabilities, setMachineCapabilities] = useState([
    {
      machineId: 'LASER001',
      machineName: 'Fiber Laser 3kW',
      maxPower: 3000, // W
      materialCompatibility: ['mild_steel', 'stainless_steel', 'aluminum', 'copper'],
      thicknessRange: { min: 0.5, max: 12 }, // mm
      currentStatus: 'available' as 'available' | 'busy' | 'maintenance' | 'offline',
      efficiency: 85, // percentage
      setupTimeMultiplier: 1.0, // factor for setup time
      operatorSkillLevel: 'advanced' as 'basic' | 'intermediate' | 'advanced' | 'expert'
    },
    {
      machineId: 'LASER002',
      machineName: 'CO2 Laser 2kW',
      maxPower: 2000, // W
      materialCompatibility: ['mild_steel', 'stainless_steel', 'aluminum'],
      thicknessRange: { min: 1.0, max: 8 }, // mm
      currentStatus: 'available' as 'available' | 'busy' | 'maintenance' | 'offline',
      efficiency: 80, // percentage
      setupTimeMultiplier: 1.2, // factor for setup time
      operatorSkillLevel: 'intermediate' as 'basic' | 'intermediate' | 'advanced' | 'expert'
    }
  ]);

  const [operationalConstraints, setOperationalConstraints] = useState({
    workingHours: { start: '08:00', end: '18:00' },
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    maxOvertimeHours: 10, // hours per week
    minimumBreakTime: 15, // minutes between jobs
    maxContinuousRunTime: 8, // hours before mandatory break
    maintenanceWindows: [
      { start: '18:00', end: '20:00', frequency: 'daily' as 'daily' | 'weekly' | 'monthly' }
    ]
  });

  const [optimizationGoals, setOptimizationGoals] = useState({
    primaryObjective: 'minimize_makespan' as 'minimize_makespan' | 'maximize_throughput' | 'minimize_tardiness' | 'maximize_profit' | 'balance_workload',
    secondaryObjectives: ['maximize_throughput', 'minimize_tardiness'],
    customerSatisfactionWeight: 0.3, // 0-1
    profitabilityWeight: 0.25, // 0-1
    efficiencyWeight: 0.25, // 0-1
    urgencyWeight: 0.2 // 0-1
  });

  const [resourceConstraints, setResourceConstraints] = useState({
    availableOperators: 3,
    operatorShifts: [
      { shiftId: 'SHIFT1', startTime: '08:00', endTime: '16:00', operatorCount: 2 },
      { shiftId: 'SHIFT2', startTime: '16:00', endTime: '24:00', operatorCount: 1 }
    ],
    materialAvailability: [
      { materialType: 'mild_steel', availableQuantity: 1000, leadTime: 1 },
      { materialType: 'aluminum', availableQuantity: 500, leadTime: 2 }
    ],
    toolingAvailability: [
      { toolType: 'standard_nozzle', available: true, setupTime: 5 },
      { toolType: 'precision_nozzle', available: true, setupTime: 10 }
    ]
  });

  const [qualityRequirements, setQualityRequirements] = useState({
    allowableRework: 5, // percentage
    qualityCheckTime: 10, // minutes per job
    inspectionRequirements: 'sampling' as 'none' | 'sampling' | 'full' | 'critical_only',
    qualityGateThreshold: 7 // 1-10 scale
  });

  const handleCalculate = () => {
    const inputs = {
      jobQueue,
      machineCapabilities,
      operationalConstraints,
      optimizationGoals,
      resourceConstraints,
      qualityRequirements
    };
    onCalculate(inputs);
  };

  const addJob = () => {
    const newJob = {
      jobId: `JOB${String(jobQueue.length + 1).padStart(3, '0')}`,
      jobName: `New Job ${jobQueue.length + 1}`,
      priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent' | 'critical',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedDuration: 60,
      materialType: 'mild_steel',
      thickness: 3.0,
      setupTime: 15,
      partCount: 10,
      customerImportance: 'standard' as 'standard' | 'preferred' | 'vip',
      profitMargin: 20,
      dependencies: [] as string[]
    };
    setJobQueue([...jobQueue, newJob]);
  };

  const removeJob = (index: number) => {
    setJobQueue(jobQueue.filter((_, i) => i !== index));
  };

  const updateJob = (index: number, field: string, value: any) => {
    const updatedJobs = [...jobQueue];
    updatedJobs[index] = { ...updatedJobs[index], [field]: value };
    setJobQueue(updatedJobs);
  };

  const addMachine = () => {
    const newMachine = {
      machineId: `LASER${String(machineCapabilities.length + 1).padStart(3, '0')}`,
      machineName: `Laser Machine ${machineCapabilities.length + 1}`,
      maxPower: 2000,
      materialCompatibility: ['mild_steel', 'aluminum'],
      thicknessRange: { min: 0.5, max: 10 },
      currentStatus: 'available' as 'available' | 'busy' | 'maintenance' | 'offline',
      efficiency: 80,
      setupTimeMultiplier: 1.0,
      operatorSkillLevel: 'intermediate' as 'basic' | 'intermediate' | 'advanced' | 'expert'
    };
    setMachineCapabilities([...machineCapabilities, newMachine]);
  };

  const removeMachine = (index: number) => {
    setMachineCapabilities(machineCapabilities.filter((_, i) => i !== index));
  };

  const updateMachine = (index: number, field: string, value: any) => {
    const updatedMachines = [...machineCapabilities];
    updatedMachines[index] = { ...updatedMachines[index], [field]: value };
    setMachineCapabilities(updatedMachines);
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'critical', label: 'Critical' }
  ];

  const customerImportanceOptions = [
    { value: 'standard', label: 'Standard Customer' },
    { value: 'preferred', label: 'Preferred Customer' },
    { value: 'vip', label: 'VIP Customer' }
  ];

  const materialOptions = [
    { value: 'mild_steel', label: 'Mild Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'offline', label: 'Offline' }
  ];

  const skillLevelOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const objectiveOptions = [
    { value: 'minimize_makespan', label: 'Minimize Makespan' },
    { value: 'maximize_throughput', label: 'Maximize Throughput' },
    { value: 'minimize_tardiness', label: 'Minimize Tardiness' },
    { value: 'maximize_profit', label: 'Maximize Profit' },
    { value: 'balance_workload', label: 'Balance Workload' }
  ];

  const inspectionOptions = [
    { value: 'none', label: 'No Inspection' },
    { value: 'sampling', label: 'Sampling Inspection' },
    { value: 'full', label: 'Full Inspection' },
    { value: 'critical_only', label: 'Critical Parts Only' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Job Queue Optimizer</span>
          <Badge variant="outline">Schedule Optimization</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="constraints">Constraints</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Job Queue ({jobQueue.length} jobs)
                </h4>
                <Button onClick={addJob} size="sm" className="flex items-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Job</span>
                </Button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {jobQueue.map((job, index) => (
                  <Card key={job.jobId} className="p-3 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{job.jobName}</h5>
                        <div className="text-sm text-muted-foreground">ID: {job.jobId}</div>
                      </div>
                      <Button 
                        onClick={() => removeJob(index)} 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Priority</Label>
                        <Select
                          value={job.priority}
                          onChange={(value) => updateJob(index, 'priority', value)}
                          options={priorityOptions}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Due Date</Label>
                        <Input
                          type="date"
                          value={job.dueDate}
                          onChange={(e) => updateJob(index, 'dueDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Duration (min)</Label>
                        <Input
                          type="number"
                          value={job.estimatedDuration}
                          onChange={(e) => updateJob(index, 'estimatedDuration', Number(e.target.value))}
                          min="1"
                          max="1440"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Material</Label>
                        <Select
                          value={job.materialType}
                          onChange={(value) => updateJob(index, 'materialType', value)}
                          options={materialOptions}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Thickness (mm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={job.thickness}
                          onChange={(e) => updateJob(index, 'thickness', Number(e.target.value))}
                          min="0.1"
                          max="50"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Part Count</Label>
                        <Input
                          type="number"
                          value={job.partCount}
                          onChange={(e) => updateJob(index, 'partCount', Number(e.target.value))}
                          min="1"
                          max="10000"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Customer Type</Label>
                        <Select
                          value={job.customerImportance}
                          onChange={(value) => updateJob(index, 'customerImportance', value)}
                          options={customerImportanceOptions}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Profit Margin (%)</Label>
                        <Input
                          type="number"
                          value={job.profitMargin}
                          onChange={(e) => updateJob(index, 'profitMargin', Number(e.target.value))}
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Setup Time (min)</Label>
                        <Input
                          type="number"
                          value={job.setupTime}
                          onChange={(e) => updateJob(index, 'setupTime', Number(e.target.value))}
                          min="0"
                          max="120"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Job Queue Summary */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Queue Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-lg font-bold text-blue-600">{jobQueue.length}</div>
                  <div className="text-muted-foreground">Total Jobs</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {jobQueue.reduce((sum, job) => sum + job.estimatedDuration, 0)}
                  </div>
                  <div className="text-muted-foreground">Total Minutes</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {jobQueue.reduce((sum, job) => sum + job.partCount, 0)}
                  </div>
                  <div className="text-muted-foreground">Total Parts</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {jobQueue.filter(job => job.priority === 'urgent' || job.priority === 'critical').length}
                  </div>
                  <div className="text-muted-foreground">Urgent Jobs</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="machines" className="space-y-4">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Machine Capabilities ({machineCapabilities.length} machines)
                </h4>
                <Button onClick={addMachine} size="sm" className="flex items-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Machine</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                {machineCapabilities.map((machine, index) => (
                  <Card key={machine.machineId} className="p-3 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{machine.machineName}</h5>
                        <div className="text-sm text-muted-foreground">ID: {machine.machineId}</div>
                      </div>
                      <Button 
                        onClick={() => removeMachine(index)} 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Max Power (W)</Label>
                        <Input
                          type="number"
                          value={machine.maxPower}
                          onChange={(e) => updateMachine(index, 'maxPower', Number(e.target.value))}
                          min="500"
                          max="15000"
                          step="100"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Status</Label>
                        <Select
                          value={machine.currentStatus}
                          onChange={(value) => updateMachine(index, 'currentStatus', value)}
                          options={statusOptions}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Efficiency (%)</Label>
                        <Input
                          type="number"
                          value={machine.efficiency}
                          onChange={(e) => updateMachine(index, 'efficiency', Number(e.target.value))}
                          min="50"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Min Thickness (mm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={machine.thicknessRange.min}
                          onChange={(e) => updateMachine(index, 'thicknessRange', {
                            ...machine.thicknessRange,
                            min: Number(e.target.value)
                          })}
                          min="0.1"
                          max="10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Max Thickness (mm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={machine.thicknessRange.max}
                          onChange={(e) => updateMachine(index, 'thicknessRange', {
                            ...machine.thicknessRange,
                            max: Number(e.target.value)
                          })}
                          min="1"
                          max="50"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Operator Skill</Label>
                        <Select
                          value={machine.operatorSkillLevel}
                          onChange={(value) => updateMachine(index, 'operatorSkillLevel', value)}
                          options={skillLevelOptions}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="constraints" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Operational Constraints
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Working Hours Start</Label>
                  <Input
                    type="time"
                    value={operationalConstraints.workingHours.start}
                    onChange={(e) => setOperationalConstraints({
                      ...operationalConstraints,
                      workingHours: {
                        ...operationalConstraints.workingHours,
                        start: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Working Hours End</Label>
                  <Input
                    type="time"
                    value={operationalConstraints.workingHours.end}
                    onChange={(e) => setOperationalConstraints({
                      ...operationalConstraints,
                      workingHours: {
                        ...operationalConstraints.workingHours,
                        end: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Max Overtime Hours/Week</Label>
                  <Input
                    type="number"
                    value={operationalConstraints.maxOvertimeHours}
                    onChange={(e) => setOperationalConstraints({
                      ...operationalConstraints,
                      maxOvertimeHours: Number(e.target.value)
                    })}
                    min="0"
                    max="40"
                  />
                </div>
                <div>
                  <Label>Minimum Break Time (min)</Label>
                  <Input
                    type="number"
                    value={operationalConstraints.minimumBreakTime}
                    onChange={(e) => setOperationalConstraints({
                      ...operationalConstraints,
                      minimumBreakTime: Number(e.target.value)
                    })}
                    min="5"
                    max="60"
                  />
                </div>
                <div>
                  <Label>Max Continuous Run Time (hours)</Label>
                  <Input
                    type="number"
                    value={operationalConstraints.maxContinuousRunTime}
                    onChange={(e) => setOperationalConstraints({
                      ...operationalConstraints,
                      maxContinuousRunTime: Number(e.target.value)
                    })}
                    min="1"
                    max="24"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Resource Constraints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Available Operators</Label>
                  <Input
                    type="number"
                    value={resourceConstraints.availableOperators}
                    onChange={(e) => setResourceConstraints({
                      ...resourceConstraints,
                      availableOperators: Number(e.target.value)
                    })}
                    min="1"
                    max="20"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Optimization Goals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Primary Objective</Label>
                  <Select
                    value={optimizationGoals.primaryObjective}
                    onChange={(value) => setOptimizationGoals({
                      ...optimizationGoals,
                      primaryObjective: value as any
                    })}
                    options={objectiveOptions}
                  />
                </div>
                <div>
                  <Label>Customer Satisfaction Weight</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={optimizationGoals.customerSatisfactionWeight}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      customerSatisfactionWeight: Number(e.target.value)
                    })}
                    min="0"
                    max="1"
                  />
                </div>
                <div>
                  <Label>Profitability Weight</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={optimizationGoals.profitabilityWeight}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      profitabilityWeight: Number(e.target.value)
                    })}
                    min="0"
                    max="1"
                  />
                </div>
                <div>
                  <Label>Efficiency Weight</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={optimizationGoals.efficiencyWeight}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      efficiencyWeight: Number(e.target.value)
                    })}
                    min="0"
                    max="1"
                  />
                </div>
                <div>
                  <Label>Urgency Weight</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={optimizationGoals.urgencyWeight}
                    onChange={(e) => setOptimizationGoals({
                      ...optimizationGoals,
                      urgencyWeight: Number(e.target.value)
                    })}
                    min="0"
                    max="1"
                  />
                </div>
              </div>
            </Card>

            {/* Weight Distribution Visualization */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Weight Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Customer Satisfaction</span>
                  <span>{(optimizationGoals.customerSatisfactionWeight * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.customerSatisfactionWeight * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Profitability</span>
                  <span>{(optimizationGoals.profitabilityWeight * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.profitabilityWeight * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Efficiency</span>
                  <span>{(optimizationGoals.efficiencyWeight * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.efficiencyWeight * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Urgency</span>
                  <span>{(optimizationGoals.urgencyWeight * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${optimizationGoals.urgencyWeight * 100}%` }}
                  ></div>
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
                  <Label>Allowable Rework (%)</Label>
                  <Input
                    type="number"
                    value={qualityRequirements.allowableRework}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      allowableRework: Number(e.target.value)
                    })}
                    min="0"
                    max="20"
                  />
                </div>
                <div>
                  <Label>Quality Check Time (min/job)</Label>
                  <Input
                    type="number"
                    value={qualityRequirements.qualityCheckTime}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      qualityCheckTime: Number(e.target.value)
                    })}
                    min="0"
                    max="60"
                  />
                </div>
                <div>
                  <Label>Inspection Requirements</Label>
                  <Select
                    value={qualityRequirements.inspectionRequirements}
                    onChange={(value) => setQualityRequirements({
                      ...qualityRequirements,
                      inspectionRequirements: value as any
                    })}
                    options={inspectionOptions}
                  />
                </div>
                <div>
                  <Label>Quality Gate Threshold (1-10)</Label>
                  <Input
                    type="number"
                    value={qualityRequirements.qualityGateThreshold}
                    onChange={(e) => setQualityRequirements({
                      ...qualityRequirements,
                      qualityGateThreshold: Number(e.target.value)
                    })}
                    min="1"
                    max="10"
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
            {isLoading ? 'Optimizing Job Queue...' : 'Optimize Job Queue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobQueueOptimizerForm;
