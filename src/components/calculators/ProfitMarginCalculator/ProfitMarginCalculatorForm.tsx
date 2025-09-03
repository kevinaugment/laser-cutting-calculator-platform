import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { DollarSign, TrendingUp, Target, BarChart3, AlertTriangle } from 'lucide-react';

interface ProfitMarginCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const ProfitMarginCalculatorForm: React.FC<ProfitMarginCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('costs');

  const [costStructure, setCostStructure] = useState({
    directMaterialCost: 30,
    directLaborCost: 20,
    overheadCost: 15,
    equipmentDepreciation: 5,
    facilityRent: 8,
    utilities: 3,
    insurance: 2
  });

  const [revenueStructure, setRevenueStructure] = useState({
    totalRevenue: 120000, // annual
    currentSellingPrice: 85,
    orderVolume: 100,
    averageProjectSize: 1200,
    recurringRevenue: 60000,
    projectBasedRevenue: 60000
  });

  const [marketFactors, setMarketFactors] = useState({
    competitivePressure: 'moderate' as 'low' | 'moderate' | 'high' | 'intense',
    priceElasticity: -0.8,
    marketGrowthRate: 5.5,
    marketFlexibility: 'moderate' as 'rigid' | 'limited' | 'moderate' | 'flexible',
    customerPaymentTerms: 30,
    badDebtRate: 2.5
  });

  const [strategicObjectives, setStrategicObjectives] = useState({
    targetGrossMargin: 35,
    targetNetMargin: 12,
    growthTarget: 15,
    profitabilityTimeframe: 'medium_term' as 'short_term' | 'medium_term' | 'long_term',
    investmentPriority: 'profitability' as 'growth' | 'profitability' | 'market_share' | 'efficiency',
    costReductionPotential: 'moderate' as 'low' | 'moderate' | 'high'
  });

  const handleCalculate = () => {
    const inputs = {
      revenueStructure: {
        totalRevenue: revenueStructure.totalRevenue,
        revenueBySegment: [
          { segment: 'Recurring', revenue: revenueStructure.recurringRevenue, growth: 8 },
          { segment: 'Project-based', revenue: revenueStructure.projectBasedRevenue, growth: 12 }
        ],
        recurringRevenue: revenueStructure.recurringRevenue,
        projectBasedRevenue: revenueStructure.projectBasedRevenue,
        seasonalityFactor: 15,
        averageProjectSize: revenueStructure.averageProjectSize,
        customerConcentration: 35
      },
      costStructure: {
        directCosts: {
          materials: costStructure.directMaterialCost,
          labor: costStructure.directLaborCost,
          subcontracting: 0
        },
        indirectCosts: {
          overhead: costStructure.overheadCost,
          administration: 5,
          sales: 3
        },
        variableCosts: {
          materials: costStructure.directMaterialCost,
          labor: costStructure.directLaborCost * 0.8,
          utilities: costStructure.utilities
        },
        fixedCosts: {
          facilityRent: costStructure.facilityRent,
          equipmentDepreciation: costStructure.equipmentDepreciation,
          insurance: costStructure.insurance,
          salaries: 25
        }
      },
      marketFactors: marketFactors,
      strategicObjectives: strategicObjectives,
      // Additional fields for compatibility
      directMaterialCost: costStructure.directMaterialCost,
      directLaborCost: costStructure.directLaborCost,
      overheadCost: costStructure.overheadCost,
      currentSellingPrice: revenueStructure.currentSellingPrice,
      targetMargin: strategicObjectives.targetGrossMargin,
      orderVolume: revenueStructure.orderVolume,
      marketFlexibility: marketFactors.marketFlexibility,
      costReductionPotential: strategicObjectives.costReductionPotential
    };
    onCalculate(inputs);
  };

  const competitivePressureOptions = [
    { value: 'low', label: 'Low Competition' },
    { value: 'moderate', label: 'Moderate Competition' },
    { value: 'high', label: 'High Competition' },
    { value: 'intense', label: 'Intense Competition' }
  ];

  const marketFlexibilityOptions = [
    { value: 'rigid', label: 'Rigid (No flexibility)' },
    { value: 'limited', label: 'Limited (±5%)' },
    { value: 'moderate', label: 'Moderate (±10%)' },
    { value: 'flexible', label: 'Flexible (±20%)' }
  ];

  const timeframeOptions = [
    { value: 'short_term', label: 'Short Term (6-12 months)' },
    { value: 'medium_term', label: 'Medium Term (1-2 years)' },
    { value: 'long_term', label: 'Long Term (2+ years)' }
  ];

  const priorityOptions = [
    { value: 'growth', label: 'Revenue Growth' },
    { value: 'profitability', label: 'Profit Maximization' },
    { value: 'market_share', label: 'Market Share' },
    { value: 'efficiency', label: 'Operational Efficiency' }
  ];

  const costReductionOptions = [
    { value: 'low', label: 'Low (0-5%)' },
    { value: 'moderate', label: 'Moderate (5-15%)' },
    { value: 'high', label: 'High (15%+)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Profit Margin Calculator</span>
          <Badge variant="outline">Profitability Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="costs" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Cost Structure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Direct Material Cost ($)</Label>
                  <Input
                    type="number"
                    value={costStructure.directMaterialCost}
                    onChange={(e) => setCostStructure({
                      ...costStructure,
                      directMaterialCost: Number(e.target.value)
                    })}
                    min="1"
                    max="500"
                  />
                </div>
                <div>
                  <Label>Direct Labor Cost ($)</Label>
                  <Input
                    type="number"
                    value={costStructure.directLaborCost}
                    onChange={(e) => setCostStructure({
                      ...costStructure,
                      directLaborCost: Number(e.target.value)
                    })}
                    min="1"
                    max="200"
                  />
                </div>
                <div>
                  <Label>Overhead Cost ($)</Label>
                  <Input
                    type="number"
                    value={costStructure.overheadCost}
                    onChange={(e) => setCostStructure({
                      ...costStructure,
                      overheadCost: Number(e.target.value)
                    })}
                    min="1"
                    max="150"
                  />
                </div>
                <div>
                  <Label>Equipment Depreciation ($)</Label>
                  <Input
                    type="number"
                    value={costStructure.equipmentDepreciation}
                    onChange={(e) => setCostStructure({
                      ...costStructure,
                      equipmentDepreciation: Number(e.target.value)
                    })}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Facility Rent ($)</Label>
                  <Input
                    type="number"
                    value={costStructure.facilityRent}
                    onChange={(e) => setCostStructure({
                      ...costStructure,
                      facilityRent: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Utilities ($)</Label>
                  <Input
                    type="number"
                    value={costStructure.utilities}
                    onChange={(e) => setCostStructure({
                      ...costStructure,
                      utilities: Number(e.target.value)
                    })}
                    min="0"
                    max="20"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Revenue Structure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Total Annual Revenue ($)</Label>
                  <Input
                    type="number"
                    value={revenueStructure.totalRevenue}
                    onChange={(e) => setRevenueStructure({
                      ...revenueStructure,
                      totalRevenue: Number(e.target.value)
                    })}
                    min="10000"
                    max="10000000"
                  />
                </div>
                <div>
                  <Label>Current Selling Price ($)</Label>
                  <Input
                    type="number"
                    value={revenueStructure.currentSellingPrice}
                    onChange={(e) => setRevenueStructure({
                      ...revenueStructure,
                      currentSellingPrice: Number(e.target.value)
                    })}
                    min="10"
                    max="1000"
                  />
                </div>
                <div>
                  <Label>Order Volume (parts)</Label>
                  <Input
                    type="number"
                    value={revenueStructure.orderVolume}
                    onChange={(e) => setRevenueStructure({
                      ...revenueStructure,
                      orderVolume: Number(e.target.value)
                    })}
                    min="1"
                    max="10000"
                  />
                </div>
                <div>
                  <Label>Average Project Size ($)</Label>
                  <Input
                    type="number"
                    value={revenueStructure.averageProjectSize}
                    onChange={(e) => setRevenueStructure({
                      ...revenueStructure,
                      averageProjectSize: Number(e.target.value)
                    })}
                    min="100"
                    max="100000"
                  />
                </div>
                <div>
                  <Label>Recurring Revenue ($)</Label>
                  <Input
                    type="number"
                    value={revenueStructure.recurringRevenue}
                    onChange={(e) => setRevenueStructure({
                      ...revenueStructure,
                      recurringRevenue: Number(e.target.value)
                    })}
                    min="0"
                    max="5000000"
                  />
                </div>
                <div>
                  <Label>Project-based Revenue ($)</Label>
                  <Input
                    type="number"
                    value={revenueStructure.projectBasedRevenue}
                    onChange={(e) => setRevenueStructure({
                      ...revenueStructure,
                      projectBasedRevenue: Number(e.target.value)
                    })}
                    min="0"
                    max="5000000"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Market Factors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Competitive Pressure</Label>
                  <Select
                    value={marketFactors.competitivePressure}
                    onChange={(value: 'low' | 'moderate' | 'high' | 'intense') => 
                      setMarketFactors({
                        ...marketFactors,
                        competitivePressure: value
                      })
                    }
                    options={competitivePressureOptions}
                  />
                </div>
                <div>
                  <Label>Market Flexibility</Label>
                  <Select
                    value={marketFactors.marketFlexibility}
                    onChange={(value: 'rigid' | 'limited' | 'moderate' | 'flexible') => 
                      setMarketFactors({
                        ...marketFactors,
                        marketFlexibility: value
                      })
                    }
                    options={marketFlexibilityOptions}
                  />
                </div>
                <div>
                  <Label>Price Elasticity</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={marketFactors.priceElasticity}
                    onChange={(e) => setMarketFactors({
                      ...marketFactors,
                      priceElasticity: Number(e.target.value)
                    })}
                    min="-3.0"
                    max="0"
                  />
                </div>
                <div>
                  <Label>Market Growth Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={marketFactors.marketGrowthRate}
                    onChange={(e) => setMarketFactors({
                      ...marketFactors,
                      marketGrowthRate: Number(e.target.value)
                    })}
                    min="-10"
                    max="50"
                  />
                </div>
                <div>
                  <Label>Payment Terms (days)</Label>
                  <Input
                    type="number"
                    value={marketFactors.customerPaymentTerms}
                    onChange={(e) => setMarketFactors({
                      ...marketFactors,
                      customerPaymentTerms: Number(e.target.value)
                    })}
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <Label>Bad Debt Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={marketFactors.badDebtRate}
                    onChange={(e) => setMarketFactors({
                      ...marketFactors,
                      badDebtRate: Number(e.target.value)
                    })}
                    min="0"
                    max="20"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="strategy" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Strategic Objectives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Target Gross Margin (%)</Label>
                  <Input
                    type="number"
                    value={strategicObjectives.targetGrossMargin}
                    onChange={(e) => setStrategicObjectives({
                      ...strategicObjectives,
                      targetGrossMargin: Number(e.target.value)
                    })}
                    min="10"
                    max="60"
                  />
                </div>
                <div>
                  <Label>Target Net Margin (%)</Label>
                  <Input
                    type="number"
                    value={strategicObjectives.targetNetMargin}
                    onChange={(e) => setStrategicObjectives({
                      ...strategicObjectives,
                      targetNetMargin: Number(e.target.value)
                    })}
                    min="5"
                    max="30"
                  />
                </div>
                <div>
                  <Label>Growth Target (%)</Label>
                  <Input
                    type="number"
                    value={strategicObjectives.growthTarget}
                    onChange={(e) => setStrategicObjectives({
                      ...strategicObjectives,
                      growthTarget: Number(e.target.value)
                    })}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label>Profitability Timeframe</Label>
                  <Select
                    value={strategicObjectives.profitabilityTimeframe}
                    onChange={(value: 'short_term' | 'medium_term' | 'long_term') => 
                      setStrategicObjectives({
                        ...strategicObjectives,
                        profitabilityTimeframe: value
                      })
                    }
                    options={timeframeOptions}
                  />
                </div>
                <div>
                  <Label>Investment Priority</Label>
                  <Select
                    value={strategicObjectives.investmentPriority}
                    onChange={(value: 'growth' | 'profitability' | 'market_share' | 'efficiency') => 
                      setStrategicObjectives({
                        ...strategicObjectives,
                        investmentPriority: value
                      })
                    }
                    options={priorityOptions}
                  />
                </div>
                <div>
                  <Label>Cost Reduction Potential</Label>
                  <Select
                    value={strategicObjectives.costReductionPotential}
                    onChange={(value: 'low' | 'moderate' | 'high') => 
                      setStrategicObjectives({
                        ...strategicObjectives,
                        costReductionPotential: value
                      })
                    }
                    options={costReductionOptions}
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
            {isLoading ? 'Analyzing Profit Margins...' : 'Analyze Profit Margins'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitMarginCalculatorForm;
