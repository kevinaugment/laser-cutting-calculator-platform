import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { FileText, Settings, DollarSign, AlertTriangle, Users } from 'lucide-react';

interface ProjectQuotingCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const ProjectQuotingCalculatorForm: React.FC<ProjectQuotingCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('project');

  const [projectSpecs, setProjectSpecs] = useState({
    projectName: 'Custom Laser Cutting Project',
    customerType: 'existing' as 'new' | 'existing' | 'preferred' | 'strategic',
    projectComplexity: 'moderate' as 'simple' | 'moderate' | 'complex' | 'very_complex',
    urgency: 'standard' as 'standard' | 'expedited' | 'rush' | 'emergency',
    deliveryLocation: 'local' as 'local' | 'regional' | 'national' | 'international',
    paymentTerms: 'net_30' as 'net_30' | 'net_60' | 'advance_payment' | 'milestone_based',
    warrantyRequirements: 'standard' as 'standard' | 'extended' | 'premium' | 'custom'
  });

  const [partDetails, setPartDetails] = useState({
    partId: 'PART-001',
    partName: 'Custom Bracket',
    quantity: 100,
    materialType: 'carbon_steel',
    thickness: 6, // mm
    length: 200, // mm
    width: 150, // mm
    complexity: 'moderate' as 'simple' | 'moderate' | 'complex' | 'very_complex',
    toleranceClass: 'standard' as 'standard' | 'precision' | 'high_precision',
    surfaceFinish: 'as_cut' as 'as_cut' | 'deburred' | 'polished' | 'coated',
    cuttingLength: 800 // mm total cutting path
  });

  const [costFactors, setCostFactors] = useState({
    materialCostPerSheet: 45.00,
    sheetLength: 2500, // mm
    sheetWidth: 1250, // mm
    materialUtilization: 75, // %
    wasteFactor: 10, // %
    setupLaborRate: 65.00, // $/hour
    operatingLaborRate: 45.00, // $/hour
    machineHourlyRate: 85.00, // $/hour
    facilityOverhead: 25, // %
    administrativeOverhead: 15, // %
    salesOverhead: 8 // %
  });

  const [profitTargets, setProfitTargets] = useState({
    targetProfitMargin: 25, // %
    competitionLevel: 'moderate' as 'low' | 'moderate' | 'high' | 'intense',
    marketPosition: 'competitive' as 'premium' | 'competitive' | 'value',
    customerNegotiationPower: 'moderate' as 'low' | 'moderate' | 'high',
    riskTolerance: 'moderate' as 'low' | 'moderate' | 'high'
  });

  const handleCalculate = () => {
    const inputs = {
      projectSpecifications: projectSpecs,
      partDetails: [{
        partId: partDetails.partId,
        partName: partDetails.partName,
        quantity: partDetails.quantity,
        materialType: partDetails.materialType,
        thickness: partDetails.thickness,
        dimensions: { length: partDetails.length, width: partDetails.width },
        complexity: partDetails.complexity,
        toleranceClass: partDetails.toleranceClass,
        surfaceFinish: partDetails.surfaceFinish,
        specialRequirements: []
      }],
      materialCosts: [{
        materialType: partDetails.materialType,
        thickness: partDetails.thickness,
        costPerSheet: costFactors.materialCostPerSheet,
        sheetSize: { length: costFactors.sheetLength, width: costFactors.sheetWidth },
        materialUtilization: costFactors.materialUtilization,
        wasteFactor: costFactors.wasteFactor,
        supplierLeadTime: 5
      }],
      laborRates: {
        setupLabor: costFactors.setupLaborRate,
        operatingLabor: costFactors.operatingLaborRate,
        qualityControl: 55.00,
        supervision: 75.00
      },
      machineRates: {
        laserCuttingRate: costFactors.machineHourlyRate,
        setupTime: 0.5,
        operatingTime: partDetails.cuttingLength * partDetails.quantity / 2000, // simplified
        maintenanceRate: 15.00
      },
      overheadFactors: {
        facilityOverhead: costFactors.facilityOverhead,
        administrativeOverhead: costFactors.administrativeOverhead,
        salesOverhead: costFactors.salesOverhead,
        qualityOverhead: 5
      },
      profitTargets: {
        targetProfitMargin: profitTargets.targetProfitMargin,
        minimumMargin: 15,
        maximumMargin: 40
      },
      marketFactors: {
        competitionLevel: profitTargets.competitionLevel,
        marketDemand: 'stable',
        seasonality: 'none',
        economicConditions: 'stable'
      },
      riskFactors: {
        technicalRisk: profitTargets.riskTolerance,
        scheduleRisk: projectSpecs.urgency === 'emergency' ? 'high' : 'moderate',
        customerRisk: projectSpecs.customerType === 'new' ? 'high' : 'low',
        marketRisk: 'moderate'
      }
    };
    onCalculate(inputs);
  };

  const customerTypeOptions = [
    { value: 'new', label: 'New Customer' },
    { value: 'existing', label: 'Existing Customer' },
    { value: 'preferred', label: 'Preferred Customer' },
    { value: 'strategic', label: 'Strategic Partner' }
  ];

  const complexityOptions = [
    { value: 'simple', label: 'Simple (Basic shapes)' },
    { value: 'moderate', label: 'Moderate (Standard complexity)' },
    { value: 'complex', label: 'Complex (Intricate features)' },
    { value: 'very_complex', label: 'Very Complex (High precision)' }
  ];

  const urgencyOptions = [
    { value: 'standard', label: 'Standard (2-3 weeks)' },
    { value: 'expedited', label: 'Expedited (1-2 weeks)' },
    { value: 'rush', label: 'Rush (3-5 days)' },
    { value: 'emergency', label: 'Emergency (1-2 days)' }
  ];

  const deliveryOptions = [
    { value: 'local', label: 'Local (within 50 miles)' },
    { value: 'regional', label: 'Regional (within state)' },
    { value: 'national', label: 'National (domestic)' },
    { value: 'international', label: 'International' }
  ];

  const paymentTermsOptions = [
    { value: 'net_30', label: 'Net 30 days' },
    { value: 'net_60', label: 'Net 60 days' },
    { value: 'advance_payment', label: '50% Advance Payment' },
    { value: 'milestone_based', label: 'Milestone-based' }
  ];

  const warrantyOptions = [
    { value: 'standard', label: 'Standard (90 days)' },
    { value: 'extended', label: 'Extended (6 months)' },
    { value: 'premium', label: 'Premium (1 year)' },
    { value: 'custom', label: 'Custom Terms' }
  ];

  const materialOptions = [
    { value: 'carbon_steel', label: 'Carbon Steel' },
    { value: 'stainless_steel', label: 'Stainless Steel' },
    { value: 'aluminum', label: 'Aluminum' },
    { value: 'copper', label: 'Copper' },
    { value: 'brass', label: 'Brass' },
    { value: 'titanium', label: 'Titanium' }
  ];

  const toleranceOptions = [
    { value: 'standard', label: 'Standard (±0.1mm)' },
    { value: 'precision', label: 'Precision (±0.05mm)' },
    { value: 'high_precision', label: 'High Precision (±0.02mm)' }
  ];

  const finishOptions = [
    { value: 'as_cut', label: 'As Cut' },
    { value: 'deburred', label: 'Deburred' },
    { value: 'polished', label: 'Polished' },
    { value: 'coated', label: 'Coated/Painted' }
  ];

  const competitionOptions = [
    { value: 'low', label: 'Low Competition' },
    { value: 'moderate', label: 'Moderate Competition' },
    { value: 'high', label: 'High Competition' },
    { value: 'intense', label: 'Intense Competition' }
  ];

  const marketPositionOptions = [
    { value: 'premium', label: 'Premium Provider' },
    { value: 'competitive', label: 'Competitive' },
    { value: 'value', label: 'Value Provider' }
  ];

  const riskOptions = [
    { value: 'low', label: 'Low Risk' },
    { value: 'moderate', label: 'Moderate Risk' },
    { value: 'high', label: 'High Risk' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Project Quoting Calculator</span>
          <Badge variant="outline">Quote Generation</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="parts">Parts</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Project Specifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    type="text"
                    value={projectSpecs.projectName}
                    onChange={(e) => setProjectSpecs({
                      ...projectSpecs,
                      projectName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Customer Type</Label>
                  <Select
                    value={projectSpecs.customerType}
                    onChange={(value: 'new' | 'existing' | 'preferred' | 'strategic') => 
                      setProjectSpecs({
                        ...projectSpecs,
                        customerType: value
                      })
                    }
                    options={customerTypeOptions}
                  />
                </div>
                <div>
                  <Label>Project Complexity</Label>
                  <Select
                    value={projectSpecs.projectComplexity}
                    onChange={(value: 'simple' | 'moderate' | 'complex' | 'very_complex') => 
                      setProjectSpecs({
                        ...projectSpecs,
                        projectComplexity: value
                      })
                    }
                    options={complexityOptions}
                  />
                </div>
                <div>
                  <Label>Urgency Level</Label>
                  <Select
                    value={projectSpecs.urgency}
                    onChange={(value: 'standard' | 'expedited' | 'rush' | 'emergency') => 
                      setProjectSpecs({
                        ...projectSpecs,
                        urgency: value
                      })
                    }
                    options={urgencyOptions}
                  />
                </div>
                <div>
                  <Label>Delivery Location</Label>
                  <Select
                    value={projectSpecs.deliveryLocation}
                    onChange={(value: 'local' | 'regional' | 'national' | 'international') => 
                      setProjectSpecs({
                        ...projectSpecs,
                        deliveryLocation: value
                      })
                    }
                    options={deliveryOptions}
                  />
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select
                    value={projectSpecs.paymentTerms}
                    onChange={(value: 'net_30' | 'net_60' | 'advance_payment' | 'milestone_based') => 
                      setProjectSpecs({
                        ...projectSpecs,
                        paymentTerms: value
                      })
                    }
                    options={paymentTermsOptions}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="parts" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Part Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Part ID</Label>
                  <Input
                    type="text"
                    value={partDetails.partId}
                    onChange={(e) => setPartDetails({
                      ...partDetails,
                      partId: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Part Name</Label>
                  <Input
                    type="text"
                    value={partDetails.partName}
                    onChange={(e) => setPartDetails({
                      ...partDetails,
                      partName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={partDetails.quantity}
                    onChange={(e) => setPartDetails({
                      ...partDetails,
                      quantity: Number(e.target.value)
                    })}
                    min="1"
                    max="10000"
                  />
                </div>
                <div>
                  <Label>Material Type</Label>
                  <Select
                    value={partDetails.materialType}
                    onChange={(value: string) => 
                      setPartDetails({
                        ...partDetails,
                        materialType: value
                      })
                    }
                    options={materialOptions}
                  />
                </div>
                <div>
                  <Label>Thickness (mm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={partDetails.thickness}
                    onChange={(e) => setPartDetails({
                      ...partDetails,
                      thickness: Number(e.target.value)
                    })}
                    min="0.5"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Length (mm)</Label>
                  <Input
                    type="number"
                    value={partDetails.length}
                    onChange={(e) => setPartDetails({
                      ...partDetails,
                      length: Number(e.target.value)
                    })}
                    min="10"
                    max="3000"
                  />
                </div>
                <div>
                  <Label>Width (mm)</Label>
                  <Input
                    type="number"
                    value={partDetails.width}
                    onChange={(e) => setPartDetails({
                      ...partDetails,
                      width: Number(e.target.value)
                    })}
                    min="10"
                    max="1500"
                  />
                </div>
                <div>
                  <Label>Cutting Length (mm)</Label>
                  <Input
                    type="number"
                    value={partDetails.cuttingLength}
                    onChange={(e) => setPartDetails({
                      ...partDetails,
                      cuttingLength: Number(e.target.value)
                    })}
                    min="50"
                    max="5000"
                  />
                </div>
                <div>
                  <Label>Tolerance Class</Label>
                  <Select
                    value={partDetails.toleranceClass}
                    onChange={(value: 'standard' | 'precision' | 'high_precision') => 
                      setPartDetails({
                        ...partDetails,
                        toleranceClass: value
                      })
                    }
                    options={toleranceOptions}
                  />
                </div>
                <div>
                  <Label>Surface Finish</Label>
                  <Select
                    value={partDetails.surfaceFinish}
                    onChange={(value: 'as_cut' | 'deburred' | 'polished' | 'coated') => 
                      setPartDetails({
                        ...partDetails,
                        surfaceFinish: value
                      })
                    }
                    options={finishOptions}
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
                  <Label>Material Cost per Sheet ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costFactors.materialCostPerSheet}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      materialCostPerSheet: Number(e.target.value)
                    })}
                    min="10"
                    max="500"
                  />
                </div>
                <div>
                  <Label>Material Utilization (%)</Label>
                  <Input
                    type="number"
                    value={costFactors.materialUtilization}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      materialUtilization: Number(e.target.value)
                    })}
                    min="50"
                    max="95"
                  />
                </div>
                <div>
                  <Label>Setup Labor Rate ($/hour)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costFactors.setupLaborRate}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      setupLaborRate: Number(e.target.value)
                    })}
                    min="30"
                    max="150"
                  />
                </div>
                <div>
                  <Label>Operating Labor Rate ($/hour)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costFactors.operatingLaborRate}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      operatingLaborRate: Number(e.target.value)
                    })}
                    min="25"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Machine Hourly Rate ($/hour)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={costFactors.machineHourlyRate}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      machineHourlyRate: Number(e.target.value)
                    })}
                    min="50"
                    max="200"
                  />
                </div>
                <div>
                  <Label>Facility Overhead (%)</Label>
                  <Input
                    type="number"
                    value={costFactors.facilityOverhead}
                    onChange={(e) => setCostFactors({
                      ...costFactors,
                      facilityOverhead: Number(e.target.value)
                    })}
                    min="10"
                    max="50"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Pricing Strategy
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Target Profit Margin (%)</Label>
                  <Input
                    type="number"
                    value={profitTargets.targetProfitMargin}
                    onChange={(e) => setProfitTargets({
                      ...profitTargets,
                      targetProfitMargin: Number(e.target.value)
                    })}
                    min="10"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Competition Level</Label>
                  <Select
                    value={profitTargets.competitionLevel}
                    onChange={(value: 'low' | 'moderate' | 'high' | 'intense') => 
                      setProfitTargets({
                        ...profitTargets,
                        competitionLevel: value
                      })
                    }
                    options={competitionOptions}
                  />
                </div>
                <div>
                  <Label>Market Position</Label>
                  <Select
                    value={profitTargets.marketPosition}
                    onChange={(value: 'premium' | 'competitive' | 'value') => 
                      setProfitTargets({
                        ...profitTargets,
                        marketPosition: value
                      })
                    }
                    options={marketPositionOptions}
                  />
                </div>
                <div>
                  <Label>Risk Tolerance</Label>
                  <Select
                    value={profitTargets.riskTolerance}
                    onChange={(value: 'low' | 'moderate' | 'high') => 
                      setProfitTargets({
                        ...profitTargets,
                        riskTolerance: value
                      })
                    }
                    options={riskOptions}
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
            {isLoading ? 'Generating Quote...' : 'Generate Project Quote'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectQuotingCalculatorForm;
