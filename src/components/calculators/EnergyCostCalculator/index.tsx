import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import EnergyCostCalculatorForm from './EnergyCostCalculatorForm';
import EnergyCostCalculatorResults from './EnergyCostCalculatorResults';
import EnergyCostFormulaExplanation from './EnergyCostFormulaExplanation';
import EnergyCostExportTools from './EnergyCostExportTools';
import EnergyCostRelatedTools from './EnergyCostRelatedTools';
import EnergyCostEducationalContent from './EnergyCostEducationalContent';
import EnergyCostFAQ from './EnergyCostFAQ';
// import { energyCostCalculator } from '../../../services/calculators/energyCostCalculator';

const EnergyCostCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.laserPower <= 0) {
        throw new Error('Laser power must be greater than 0');
      }
      
      if (inputs.operatingHours <= 0 || inputs.operatingHours > 24) {
        throw new Error('Operating hours must be between 1 and 24');
      }

      if (inputs.workingDays <= 0 || inputs.workingDays > 31) {
        throw new Error('Working days must be between 1 and 31');
      }

      if (inputs.electricityRate <= 0) {
        throw new Error('Electricity rate must be greater than 0');
      }

      if (inputs.demandCharge < 0) {
        throw new Error('Demand charge cannot be negative');
      }

      if (inputs.powerFactor <= 0 || inputs.powerFactor > 1) {
        throw new Error('Power factor must be between 0 and 1');
      }

      if (inputs.systemEfficiency <= 0 || inputs.systemEfficiency > 1) {
        throw new Error('System efficiency must be between 0 and 1');
      }

      if (inputs.auxiliaryPower < 0) {
        throw new Error('Auxiliary power cannot be negative');
      }

      if (inputs.hvacPower < 0) {
        throw new Error('HVAC power cannot be negative');
      }

      if (inputs.standbyPower < 0) {
        throw new Error('Standby power cannot be negative');
      }

      if (inputs.standbyHours < 0 || inputs.standbyHours > 24) {
        throw new Error('Standby hours must be between 0 and 24');
      }

      if (inputs.peakDemandWindow < 0 || inputs.peakDemandWindow > inputs.operatingHours) {
        throw new Error('Peak demand window cannot exceed operating hours');
      }

      if (inputs.peakRateMultiplier < 1) {
        throw new Error('Peak rate multiplier must be at least 1.0');
      }

      // Calculate energy costs - real calculation logic
      // Convert laser power from watts to kilowatts
      const laserPowerKW = inputs.laserPower / 1000;
      const auxiliaryPowerKW = inputs.auxiliaryPower / 1000;
      const hvacPowerKW = inputs.hvacPower / 1000;
      const standbyPowerKW = inputs.standbyPower / 1000;

      // Calculate daily consumption (kWh)
      const dailyLaserConsumption = laserPowerKW * inputs.operatingHours * inputs.systemEfficiency;
      const dailyAuxiliaryConsumption = auxiliaryPowerKW * inputs.operatingHours;
      const dailyHvacConsumption = hvacPowerKW * inputs.operatingHours;
      const dailyStandbyConsumption = standbyPowerKW * inputs.standbyHours;

      // Calculate monthly consumption (kWh)
      const monthlyLaserConsumption = dailyLaserConsumption * inputs.workingDays;
      const monthlyAuxiliaryConsumption = dailyAuxiliaryConsumption * inputs.workingDays;
      const monthlyHvacConsumption = dailyHvacConsumption * inputs.workingDays;
      const monthlyStandbyConsumption = dailyStandbyConsumption * inputs.workingDays;
      const totalMonthlyConsumption = monthlyLaserConsumption + monthlyAuxiliaryConsumption + monthlyHvacConsumption + monthlyStandbyConsumption;

      // Calculate peak demand (kW)
      const peakDemand = (laserPowerKW + auxiliaryPowerKW + hvacPowerKW) / inputs.powerFactor;
      const averageDemand = totalMonthlyConsumption / (inputs.workingDays * inputs.operatingHours);
      const loadFactor = (averageDemand / peakDemand) * 100;

      // Calculate energy costs
      const baseElectricityRate = inputs.electricityRate;
      const peakRate = baseElectricityRate * inputs.peakRateMultiplier;

      // Assume peak hours are during peak demand window
      const peakHoursPerDay = inputs.peakDemandWindow;
      const offPeakHoursPerDay = inputs.operatingHours - peakHoursPerDay;

      // Calculate costs with time-of-use rates
      const monthlyPeakConsumption = (monthlyLaserConsumption + monthlyAuxiliaryConsumption + monthlyHvacConsumption) * (peakHoursPerDay / inputs.operatingHours);
      const monthlyOffPeakConsumption = (monthlyLaserConsumption + monthlyAuxiliaryConsumption + monthlyHvacConsumption) * (offPeakHoursPerDay / inputs.operatingHours);

      const laserCost = monthlyLaserConsumption * baseElectricityRate;
      const auxiliaryCost = monthlyAuxiliaryConsumption * baseElectricityRate;
      const hvacCost = monthlyHvacConsumption * baseElectricityRate;
      const standbyCost = monthlyStandbyConsumption * baseElectricityRate;
      const demandCost = peakDemand * inputs.demandCharge;

      const peakHoursCost = monthlyPeakConsumption * peakRate;
      const offPeakHoursCost = monthlyOffPeakConsumption * baseElectricityRate;

      const totalMonthlyCost = laserCost + auxiliaryCost + hvacCost + standbyCost + demandCost;
      const annualCost = totalMonthlyCost * 12;

      // Calculate efficiency metrics
      const theoreticalMinConsumption = monthlyLaserConsumption; // Only laser consumption
      const actualConsumption = totalMonthlyConsumption;
      const overallEfficiency = (theoreticalMinConsumption / actualConsumption) * 100;
      const powerUtilization = inputs.systemEfficiency * 100;
      const wastedEnergy = actualConsumption - theoreticalMinConsumption;
      const wastedCost = wastedEnergy * baseElectricityRate;

      // Calculate cost breakdowns
      const energyCostPerHour = totalMonthlyCost / (inputs.workingDays * inputs.operatingHours);
      const energyCostPerPart = inputs.partsPerHour ? energyCostPerHour / inputs.partsPerHour : 0;
      const energyCostPercentage = inputs.totalOperatingCost ? (totalMonthlyCost / inputs.totalOperatingCost) * 100 : 0;

      // Optimization potential
      const demandOptimizationPotential = peakDemand * 0.15 * inputs.demandCharge; // 15% reduction potential
      const shiftingPotential = monthlyPeakConsumption * (peakRate - baseElectricityRate) * 0.3; // 30% shifting potential
      const potentialSavings = demandOptimizationPotential + shiftingPotential + (wastedCost * 0.5);

      const calculationResults = {
        energyConsumption: {
          laserConsumption: Math.round(monthlyLaserConsumption),
          auxiliaryConsumption: Math.round(monthlyAuxiliaryConsumption),
          hvacConsumption: Math.round(monthlyHvacConsumption),
          standbyConsumption: Math.round(monthlyStandbyConsumption),
          totalConsumption: Math.round(totalMonthlyConsumption)
        },
        energyCosts: {
          laserCost: Math.round(laserCost * 100) / 100,
          auxiliaryCost: Math.round(auxiliaryCost * 100) / 100,
          hvacCost: Math.round(hvacCost * 100) / 100,
          standbyCost: Math.round(standbyCost * 100) / 100,
          demandCost: Math.round(demandCost * 100) / 100,
          totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
          annualCost: Math.round(annualCost * 100) / 100
        },
        demandAnalysis: {
          peakDemand: Math.round(peakDemand * 10) / 10,
          averageDemand: Math.round(averageDemand * 10) / 10,
          loadFactor: Math.round(loadFactor * 10) / 10,
          demandOptimizationPotential: Math.round(demandOptimizationPotential * 100) / 100
        },
        costBreakdown: {
          energyCostPerHour: Math.round(energyCostPerHour * 100) / 100,
          energyCostPerPart: Math.round(energyCostPerPart * 1000) / 1000,
          energyCostPercentage: Math.round(energyCostPercentage * 10) / 10
        },
        efficiencyAnalysis: {
          overallEfficiency: Math.round(overallEfficiency * 10) / 10,
          powerUtilization: Math.round(powerUtilization * 10) / 10,
          wastedEnergy: Math.round(wastedEnergy),
          wastedCost: Math.round(wastedCost * 100) / 100
        },
        optimizationRecommendations: {
          demandManagement: [
            peakDemand > 10 ? 'Implement peak demand monitoring and control' : 'Current demand levels are manageable',
            loadFactor < 70 ? 'Schedule high-power operations during off-peak hours' : 'Load factor is good',
            demandCost > totalMonthlyCost * 0.3 ? 'Install demand response automation systems' : 'Demand charges are reasonable'
          ],
          efficiencyImprovements: [
            inputs.systemEfficiency < 0.8 ? 'Upgrade to variable frequency drives for auxiliary systems' : 'System efficiency is good',
            hvacCost > totalMonthlyCost * 0.2 ? 'Optimize HVAC scheduling and setpoints' : 'HVAC costs are reasonable',
            inputs.powerFactor < 0.9 ? 'Implement power factor correction' : 'Power factor is adequate'
          ],
          costReductions: [
            peakHoursCost > offPeakHoursCost ? 'Negotiate time-of-use rate schedules' : 'Current rate structure is favorable',
            peakDemand > 15 ? 'Consider on-site energy storage for peak shaving' : 'Peak shaving may not be cost-effective',
            totalMonthlyCost > 1000 ? 'Implement energy management system' : 'Manual monitoring may be sufficient'
          ],
          potentialSavings: Math.round(potentialSavings * 100) / 100
        },
        timeOfUseAnalysis: {
          peakHoursCost: Math.round(peakHoursCost * 100) / 100,
          offPeakHoursCost: Math.round(offPeakHoursCost * 100) / 100,
          shiftingPotential: Math.round(shiftingPotential * 100) / 100
        }
      };

      setResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="energy-cost-calculator"
        name="Energy Cost Calculator"
        description="Optimize energy costs for laser cutting operations. Analyze consumption patterns, demand charges, and identify opportunities for cost reduction and efficiency improvements."
        category="Cost Management"
        keywords={[
          'energy cost calculator',
          'electricity cost analysis',
          'power consumption calculator',
          'demand charge calculator',
          'energy efficiency tool',
          'utility cost optimization',
          'laser cutting energy costs',
          'industrial energy calculator'
        ]}
        features={[
          'Comprehensive energy cost analysis',
          'Peak demand calculation',
          'Time-of-use rate analysis',
          'Efficiency optimization recommendations',
          'Demand charge management',
          'Cost reduction strategies',
          'Power factor analysis',
          'Energy savings potential'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'gas-consumption-calculator',
          'maintenance-cost-calculator',
          'profit-margin-calculator',
          'laser-cutting-cost'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Energy Cost Calculator</h1>
          <p className="text-muted-foreground">
            Analyze and optimize energy costs for laser cutting operations. Calculate consumption patterns, 
            demand charges, and identify opportunities for cost reduction and efficiency improvements.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>Calculation Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <EnergyCostCalculatorForm 
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div>
            {!results ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-muted-foreground" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your system specifications, operating schedule, energy rates, and optimization options, 
                    then click "Calculate Energy Costs" to get detailed cost analysis and savings recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Analysis Complete!</strong> Monthly energy cost is{' '}
                    <strong>${results.energyCosts.totalMonthlyCost.toFixed(0)}</strong> with{' '}
                    <strong>{results.energyConsumption.totalConsumption.toFixed(0)} kWh</strong> consumption.
                    Potential savings: <strong>${results.optimizationRecommendations.potentialSavings.toFixed(0)}/month</strong>.
                  </AlertDescription>
                </Alert>
                
                <EnergyCostCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <EnergyCostExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <EnergyCostFormulaExplanation />

          {/* Related Tools - Full container width */}
          <EnergyCostRelatedTools />

          {/* Educational Content - Full container width */}
          <EnergyCostEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <EnergyCostFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Energy Cost Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Demand Management:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Peak Shaving:</strong> Reduce maximum demand during peak hours</li>
                  <li>• <strong>Load Scheduling:</strong> Shift operations to off-peak periods</li>
                  <li>• <strong>Power Factor:</strong> Maintain high power factor (&gt;0.9)</li>
                  <li>• <strong>Standby Reduction:</strong> Minimize standby power consumption</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Efficiency Improvements:</h4>
                <ul className="space-y-1">
                  <li>• Monitor and optimize system efficiency regularly</li>
                  <li>• Implement variable frequency drives for auxiliary systems</li>
                  <li>• Optimize HVAC operation and scheduling</li>
                  <li>• Consider energy storage for demand management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default EnergyCostCalculatorComponent;
