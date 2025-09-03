import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Download, 
  Share2, 
  FileSpreadsheet, 
  FileText, 
  Code, 
  Copy,
  QrCode,
  Mail
} from 'lucide-react';

interface EnergyCostExportToolsProps {
  results: any;
}

const EnergyCostExportTools: React.FC<EnergyCostExportToolsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async (format: 'csv' | 'excel' | 'json') => {
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (format === 'json') {
        const exportData = {
          calculationType: 'Energy Cost Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            energyConsumption: results.energyConsumption,
            costBreakdown: results.costBreakdown,
            demandAnalysis: results.demandAnalysis,
            efficiencyMetrics: results.efficiencyMetrics,
            costOptimization: results.costOptimization,
            recommendations: results.recommendations,
            benchmarkComparison: results.benchmarkComparison
          },
          metadata: {
            version: '1.0',
            units: 'metric',
            currency: 'USD'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `energy-cost-analysis-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Energy Cost Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          [''],
          ['INPUT PARAMETERS'],
          ['Laser Power (kW)', results.inputs?.laserPower || 'N/A'],
          ['System Efficiency (%)', results.inputs?.systemEfficiency || 'N/A'],
          ['Operating Hours/Day', results.inputs?.operatingHoursPerDay || 'N/A'],
          ['Operating Days/Month', results.inputs?.operatingDaysPerMonth || 'N/A'],
          ['Electricity Rate ($/kWh)', results.inputs?.electricityRate || 'N/A'],
          ['Demand Charge ($/kW)', results.inputs?.demandCharge || 'N/A'],
          ['Power Factor', results.inputs?.powerFactor || 'N/A'],
          ['Auxiliary Power (kW)', results.inputs?.auxiliaryPower || 'N/A'],
          ['HVAC Power (kW)', results.inputs?.hvacPower || 'N/A'],
          ['Standby Power (kW)', results.inputs?.standbyPower || 'N/A'],
          [''],
          ['ENERGY CONSUMPTION'],
          ['Daily Energy Consumption (kWh)', results.energyConsumption?.daily?.toFixed(1) || 'N/A'],
          ['Monthly Energy Consumption (kWh)', results.energyConsumption?.monthly?.toFixed(0) || 'N/A'],
          ['Annual Energy Consumption (kWh)', results.energyConsumption?.annual?.toFixed(0) || 'N/A'],
          ['Peak Demand (kW)', results.energyConsumption?.peakDemand?.toFixed(1) || 'N/A'],
          ['Average Load Factor (%)', results.energyConsumption?.loadFactor?.toFixed(1) || 'N/A'],
          [''],
          ['COST BREAKDOWN'],
          ['Monthly Energy Cost ($)', results.costBreakdown?.monthlyEnergyCost?.toFixed(2) || 'N/A'],
          ['Monthly Demand Cost ($)', results.costBreakdown?.monthlyDemandCost?.toFixed(2) || 'N/A'],
          ['Monthly Fixed Charges ($)', results.costBreakdown?.monthlyFixedCharges?.toFixed(2) || 'N/A'],
          ['Monthly Total Cost ($)', results.costBreakdown?.monthlyTotalCost?.toFixed(2) || 'N/A'],
          ['Annual Total Cost ($)', results.costBreakdown?.annualTotalCost?.toFixed(0) || 'N/A'],
          ['Cost per Operating Hour ($/hr)', results.costBreakdown?.costPerOperatingHour?.toFixed(2) || 'N/A'],
          ['Cost per kWh ($/kWh)', results.costBreakdown?.effectiveRate?.toFixed(3) || 'N/A'],
          [''],
          ['DEMAND ANALYSIS'],
          ['Peak Demand Period', results.demandAnalysis?.peakDemandPeriod || 'N/A'],
          ['Demand Utilization (%)', results.demandAnalysis?.demandUtilization?.toFixed(1) || 'N/A'],
          ['Power Factor Penalty ($)', results.demandAnalysis?.powerFactorPenalty?.toFixed(2) || 'N/A'],
          ['Demand Cost Percentage (%)', results.demandAnalysis?.demandCostPercentage?.toFixed(1) || 'N/A'],
          ['Peak Shaving Potential (kW)', results.demandAnalysis?.peakShavingPotential?.toFixed(1) || 'N/A'],
          [''],
          ['EFFICIENCY METRICS'],
          ['Overall System Efficiency (%)', results.efficiencyMetrics?.overallSystemEfficiency?.toFixed(1) || 'N/A'],
          ['Energy Intensity (kWh/part)', results.efficiencyMetrics?.energyIntensity?.toFixed(3) || 'N/A'],
          ['Cost Intensity ($/part)', results.efficiencyMetrics?.costIntensity?.toFixed(3) || 'N/A'],
          ['Benchmark Comparison', results.efficiencyMetrics?.benchmarkComparison || 'N/A'],
          ['Efficiency Grade', results.efficiencyMetrics?.efficiencyGrade || 'N/A'],
          [''],
          ['COST OPTIMIZATION'],
          ['Potential Monthly Savings ($)', results.costOptimization?.potentialMonthlySavings?.toFixed(2) || 'N/A'],
          ['Potential Annual Savings ($)', results.costOptimization?.potentialAnnualSavings?.toFixed(0) || 'N/A'],
          ['ROI Period (months)', results.costOptimization?.roiPeriod?.toFixed(1) || 'N/A'],
          ['Optimization Priority', results.costOptimization?.optimizationPriority || 'N/A'],
          ['Implementation Cost ($)', results.costOptimization?.implementationCost?.toFixed(0) || 'N/A'],
          [''],
          ['RECOMMENDATIONS'],
          ['Priority', 'Recommendation', 'Savings Potential', 'Implementation Cost'],
          ...(results.recommendations?.immediate || []).map((rec: any) => [
            'Immediate',
            rec.description || rec,
            rec.savingsPotential || 'N/A',
            rec.implementationCost || 'Low'
          ]),
          ...(results.recommendations?.shortTerm || []).map((rec: any) => [
            'Short Term',
            rec.description || rec,
            rec.savingsPotential || 'N/A',
            rec.implementationCost || 'Medium'
          ]),
          ...(results.recommendations?.longTerm || []).map((rec: any) => [
            'Long Term',
            rec.description || rec,
            rec.savingsPotential || 'N/A',
            rec.implementationCost || 'High'
          ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `energy-cost-analysis-${timestamp}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateShareLink = () => {
    const params = new URLSearchParams();
    
    // Add input parameters
    if (results.inputs) {
      Object.entries(results.inputs).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${window.location.origin}/calculator/energy-cost?${params.toString()}`;
    setShareUrl(url);
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateEmbedCode = () => {
    return `<iframe 
  src="${window.location.origin}/calculator/energy-cost" 
  width="800" 
  height="600" 
  frameborder="0">
</iframe>`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export & Share Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="share">Share Results</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => handleExportData('csv')}
                disabled={isExporting}
                className="flex items-center justify-center p-4 h-auto flex-col space-y-2"
              >
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Export CSV</div>
                  <div className="text-xs text-gray-500">Spreadsheet format</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExportData('excel')}
                disabled={isExporting}
                className="flex items-center justify-center p-4 h-auto flex-col space-y-2"
              >
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Export Excel</div>
                  <div className="text-xs text-gray-500">Excel workbook</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExportData('json')}
                disabled={isExporting}
                className="flex items-center justify-center p-4 h-auto flex-col space-y-2"
              >
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Export JSON</div>
                  <div className="text-xs text-gray-500">Data format</div>
                </div>
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Export Includes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Complete energy consumption analysis and cost breakdown</li>
                <li>• Demand analysis and peak usage patterns</li>
                <li>• Efficiency metrics and benchmark comparisons</li>
                <li>• Cost optimization opportunities and savings potential</li>
                <li>• Detailed recommendations and implementation strategies</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <div className="space-y-4">
              <Button
                onClick={handleGenerateShareLink}
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Generate Share Link
              </Button>

              {shareUrl && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-gray-600 truncate flex-1 mr-2">
                        {shareUrl}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyToClipboard(shareUrl)}
                      >
                        {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `mailto:?subject=Energy Cost Analysis Results&body=Check out this energy cost analysis: ${shareUrl}`}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Link
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`, '_blank')}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Embed Code:</label>
                <div className="p-3 bg-gray-50 rounded border">
                  <code className="text-sm text-gray-800 block whitespace-pre-wrap">
                    {generateEmbedCode()}
                  </code>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => handleCopyToClipboard(generateEmbedCode())}
                >
                  <Code className="h-4 w-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Embed Options:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Responsive design adapts to container width</li>
                  <li>• Minimum recommended width: 800px</li>
                  <li>• Minimum recommended height: 600px</li>
                  <li>• All calculator features included</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnergyCostExportTools;
