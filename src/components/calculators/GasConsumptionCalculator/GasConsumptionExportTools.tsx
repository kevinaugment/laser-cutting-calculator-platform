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

interface GasConsumptionExportToolsProps {
  results: any;
}

const GasConsumptionExportTools: React.FC<GasConsumptionExportToolsProps> = ({ results }) => {
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
          calculationType: 'Gas Consumption Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            totalConsumption: results.totalConsumption,
            consumptionBreakdown: results.consumptionBreakdown,
            costAnalysis: results.costAnalysis,
            efficiencyAnalysis: results.efficiencyAnalysis,
            optimizationRecommendations: results.optimizationRecommendations,
            benchmarkComparison: results.benchmarkComparison,
            environmentalImpact: results.environmentalImpact,
            alternativeGasAnalysis: results.alternativeGasAnalysis
          },
          metadata: {
            version: '1.0',
            units: 'metric',
            gasType: results.inputs?.gasType || 'N/A'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gas-consumption-analysis-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Gas Consumption Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Gas Type:', results.inputs?.gasType || 'N/A'],
          [''],
          ['INPUT PARAMETERS'],
          ['Material Type', results.inputs?.materialType || 'N/A'],
          ['Material Thickness (mm)', results.inputs?.materialThickness || 'N/A'],
          ['Cutting Length (m)', results.inputs?.cuttingLength || 'N/A'],
          ['Gas Flow Rate (L/min)', results.inputs?.gasFlow || 'N/A'],
          ['Gas Pressure (bar)', results.inputs?.gasPressure || 'N/A'],
          ['Gas Price ($/m³)', results.inputs?.gasPrice || 'N/A'],
          ['System Efficiency (%)', (results.inputs?.efficiency * 100)?.toFixed(1) || 'N/A'],
          ['Number of Pierces', results.inputs?.numberOfPierces || 'N/A'],
          ['Setup Time (min)', results.inputs?.setupTime || 'N/A'],
          ['Idle Time (min)', results.inputs?.idleTime || 'N/A'],
          [''],
          ['GAS CONSUMPTION RESULTS'],
          ['Total Gas Consumption (m³)', results.totalConsumption?.toFixed(3) || 'N/A'],
          ['Cutting Consumption (m³)', results.consumptionBreakdown?.cuttingConsumption?.toFixed(3) || 'N/A'],
          ['Piercing Consumption (m³)', results.consumptionBreakdown?.piercingConsumption?.toFixed(3) || 'N/A'],
          ['Setup Consumption (m³)', results.consumptionBreakdown?.setupConsumption?.toFixed(3) || 'N/A'],
          ['Idle Consumption (m³)', results.consumptionBreakdown?.idleConsumption?.toFixed(3) || 'N/A'],
          [''],
          ['CONSUMPTION BREAKDOWN (%)'],
          ['Cutting Percentage (%)', results.consumptionBreakdown?.cuttingPercentage?.toFixed(1) || 'N/A'],
          ['Piercing Percentage (%)', results.consumptionBreakdown?.piercingPercentage?.toFixed(1) || 'N/A'],
          ['Setup Percentage (%)', results.consumptionBreakdown?.setupPercentage?.toFixed(1) || 'N/A'],
          ['Idle Percentage (%)', results.consumptionBreakdown?.idlePercentage?.toFixed(1) || 'N/A'],
          [''],
          ['COST ANALYSIS'],
          ['Total Gas Cost ($)', results.costAnalysis?.totalCost?.toFixed(2) || 'N/A'],
          ['Cost per Linear Meter ($/m)', results.costAnalysis?.costPerMeter?.toFixed(3) || 'N/A'],
          ['Cost per Part ($)', results.costAnalysis?.costPerPart?.toFixed(3) || 'N/A'],
          ['Cost per Hour ($/hr)', results.costAnalysis?.costPerHour?.toFixed(2) || 'N/A'],
          ['Annual Cost Projection ($)', results.costAnalysis?.annualCostProjection?.toFixed(2) || 'N/A'],
          [''],
          ['COST BREAKDOWN'],
          ['Category', 'Cost ($)', 'Percentage (%)'],
          ...(results.costAnalysis?.costBreakdown || []).map((cost: any) => [
            cost.category || 'N/A',
            cost.cost?.toFixed(2) || 'N/A',
            cost.percentage?.toFixed(1) || 'N/A'
          ]),
          [''],
          ['EFFICIENCY ANALYSIS'],
          ['System Efficiency (%)', results.efficiencyAnalysis?.systemEfficiency?.toFixed(1) || 'N/A'],
          ['Gas Utilization Rate (%)', results.efficiencyAnalysis?.gasUtilizationRate?.toFixed(1) || 'N/A'],
          ['Waste Factor (%)', results.efficiencyAnalysis?.wasteFactor?.toFixed(1) || 'N/A'],
          ['Efficiency Rating (1-10)', results.efficiencyAnalysis?.efficiencyRating?.toFixed(1) || 'N/A'],
          [''],
          ['EFFICIENCY METRICS'],
          ['Metric', 'Value', 'Unit', 'Benchmark'],
          ...(results.efficiencyAnalysis?.efficiencyMetrics || []).map((metric: any) => [
            metric.name || 'N/A',
            metric.value?.toFixed(2) || 'N/A',
            metric.unit || 'N/A',
            metric.benchmark || 'N/A'
          ]),
          [''],
          ['BENCHMARK COMPARISON'],
          ['Industry Average Consumption (m³/m)', results.benchmarkComparison?.industryAverage?.toFixed(3) || 'N/A'],
          ['Best Practice Consumption (m³/m)', results.benchmarkComparison?.bestPractice?.toFixed(3) || 'N/A'],
          ['Your Performance vs Average (%)', results.benchmarkComparison?.vsAverage?.toFixed(1) || 'N/A'],
          ['Your Performance vs Best Practice (%)', results.benchmarkComparison?.vsBestPractice?.toFixed(1) || 'N/A'],
          ['Performance Rating', results.benchmarkComparison?.performanceRating || 'N/A'],
          ['Improvement Potential (m³)', results.benchmarkComparison?.improvementPotential?.toFixed(3) || 'N/A'],
          ['Cost Savings Potential ($)', results.benchmarkComparison?.costSavingsPotential?.toFixed(2) || 'N/A'],
          [''],
          ['ENVIRONMENTAL IMPACT'],
          ['CO₂ Equivalent (kg)', results.environmentalImpact?.co2Equivalent?.toFixed(2) || 'N/A'],
          ['Environmental Cost ($)', results.environmentalImpact?.environmentalCost?.toFixed(2) || 'N/A'],
          ['Carbon Footprint Rating', results.environmentalImpact?.carbonFootprintRating || 'N/A'],
          [''],
          ['ALTERNATIVE GAS ANALYSIS'],
          ['Gas Type', 'Consumption (m³)', 'Cost ($)', 'Quality Impact', 'Recommendation'],
          ...(results.alternativeGasAnalysis || []).map((alt: any) => [
            alt.gasType || 'N/A',
            alt.consumption?.toFixed(3) || 'N/A',
            alt.cost?.toFixed(2) || 'N/A',
            alt.qualityImpact || 'N/A',
            alt.recommendation || 'N/A'
          ]),
          [''],
          ['OPTIMIZATION RECOMMENDATIONS'],
          ['Category', 'Recommendation', 'Potential Savings ($)', 'Implementation Difficulty'],
          ...(results.optimizationRecommendations?.immediate || []).map((rec: any) => [
            'Immediate',
            rec.recommendation || rec,
            rec.potentialSavings?.toFixed(2) || 'N/A',
            rec.difficulty || 'Low'
          ]),
          ...(results.optimizationRecommendations?.shortTerm || []).map((rec: any) => [
            'Short Term',
            rec.recommendation || rec,
            rec.potentialSavings?.toFixed(2) || 'N/A',
            rec.difficulty || 'Medium'
          ]),
          ...(results.optimizationRecommendations?.longTerm || []).map((rec: any) => [
            'Long Term',
            rec.recommendation || rec,
            rec.potentialSavings?.toFixed(2) || 'N/A',
            rec.difficulty || 'High'
          ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gas-consumption-analysis-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/gas-consumption?${params.toString()}`;
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
  src="${window.location.origin}/calculator/gas-consumption" 
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
                <li>• Complete gas consumption analysis and cost breakdown</li>
                <li>• Efficiency analysis with system performance metrics</li>
                <li>• Industry benchmark comparison and improvement potential</li>
                <li>• Environmental impact assessment and carbon footprint</li>
                <li>• Alternative gas analysis and recommendations</li>
                <li>• Detailed optimization strategies with potential savings</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Gas Consumption Analysis&body=Check out this gas consumption analysis: ${shareUrl}`}
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

export default GasConsumptionExportTools;
