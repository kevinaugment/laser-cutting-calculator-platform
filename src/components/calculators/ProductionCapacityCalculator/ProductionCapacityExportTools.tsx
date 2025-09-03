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

interface ProductionCapacityExportToolsProps {
  results: any;
}

const ProductionCapacityExportTools: React.FC<ProductionCapacityExportToolsProps> = ({ results }) => {
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
          calculationType: 'Production Capacity Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            capacityAnalysis: results.capacityAnalysis,
            bottleneckAnalysis: results.bottleneckAnalysis,
            utilizationMetrics: results.utilizationMetrics,
            resourceAnalysis: results.resourceAnalysis,
            demandAnalysis: results.demandAnalysis,
            recommendations: results.recommendations,
            scenarioAnalysis: results.scenarioAnalysis
          },
          metadata: {
            version: '1.0',
            units: 'metric'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `production-capacity-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Production Capacity Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          [''],
          ['CAPACITY ANALYSIS SUMMARY'],
          ['Theoretical Capacity (monthly)', results.capacityAnalysis?.theoreticalCapacity?.monthly?.toLocaleString() || 'N/A'],
          ['Effective Capacity (monthly)', results.capacityAnalysis?.effectiveCapacity?.monthly?.toLocaleString() || 'N/A'],
          ['Current Utilization (%)', results.capacityAnalysis?.currentUtilization?.toFixed(1) || 'N/A'],
          ['Available Capacity (monthly)', results.capacityAnalysis?.availableCapacity?.monthly?.toLocaleString() || 'N/A'],
          ['Capacity Gap (monthly)', results.capacityAnalysis?.capacityGap?.monthly?.toLocaleString() || 'N/A'],
          [''],
          ['BOTTLENECK ANALYSIS'],
          ['Primary Bottleneck', results.bottleneckAnalysis?.primaryBottleneck || 'N/A'],
          ['Bottleneck Utilization (%)', results.bottleneckAnalysis?.bottleneckUtilization?.toFixed(1) || 'N/A'],
          ['Bottleneck Impact', results.bottleneckAnalysis?.bottleneckImpact || 'N/A'],
          ['Constraint Type', results.bottleneckAnalysis?.constraintType || 'N/A'],
          ['Improvement Potential (%)', results.bottleneckAnalysis?.improvementPotential?.toFixed(1) || 'N/A'],
          [''],
          ['UTILIZATION METRICS'],
          ['Overall Equipment Effectiveness (%)', results.utilizationMetrics?.overallEquipmentEffectiveness?.toFixed(1) || 'N/A'],
          ['Machine Utilization (%)', results.utilizationMetrics?.machineUtilization?.toFixed(1) || 'N/A'],
          ['Labor Utilization (%)', results.utilizationMetrics?.laborUtilization?.toFixed(1) || 'N/A'],
          ['Availability (%)', results.utilizationMetrics?.availability?.toFixed(1) || 'N/A'],
          ['Performance Efficiency (%)', results.utilizationMetrics?.performanceEfficiency?.toFixed(1) || 'N/A'],
          ['Quality Rate (%)', results.utilizationMetrics?.qualityRate?.toFixed(1) || 'N/A'],
          [''],
          ['RESOURCE ANALYSIS'],
          ['Machine Count', results.resourceAnalysis?.machineCount || 'N/A'],
          ['Operator Count', results.resourceAnalysis?.operatorCount || 'N/A'],
          ['Shifts per Day', results.resourceAnalysis?.shiftsPerDay || 'N/A'],
          ['Operating Hours per Day', results.resourceAnalysis?.operatingHoursPerDay || 'N/A'],
          ['Working Days per Week', results.resourceAnalysis?.workingDaysPerWeek || 'N/A'],
          ['Machine-to-Operator Ratio', results.resourceAnalysis?.machineToOperatorRatio?.toFixed(1) || 'N/A'],
          [''],
          ['DEMAND ANALYSIS'],
          ['Current Demand (monthly)', results.demandAnalysis?.currentDemand?.monthly?.toLocaleString() || 'N/A'],
          ['Forecasted Demand (monthly)', results.demandAnalysis?.forecastedDemand?.monthly?.toLocaleString() || 'N/A'],
          ['Demand Growth Rate (%)', results.demandAnalysis?.demandGrowthRate?.toFixed(1) || 'N/A'],
          ['Capacity vs Demand Gap', results.demandAnalysis?.capacityDemandGap?.toLocaleString() || 'N/A'],
          ['Service Level (%)', results.demandAnalysis?.serviceLevel?.toFixed(1) || 'N/A'],
          [''],
          ['RECOMMENDATIONS'],
          ['Category', 'Recommendation', 'Priority', 'Impact'],
          ...(results.recommendations?.immediate || []).map((rec: any) => [
            'Immediate',
            rec.description || rec,
            rec.priority || 'High',
            rec.impact || 'N/A'
          ]),
          ...(results.recommendations?.shortTerm || []).map((rec: any) => [
            'Short Term',
            rec.description || rec,
            rec.priority || 'Medium',
            rec.impact || 'N/A'
          ]),
          ...(results.recommendations?.longTerm || []).map((rec: any) => [
            'Long Term',
            rec.description || rec,
            rec.priority || 'Low',
            rec.impact || 'N/A'
          ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `production-capacity-${timestamp}.${format}`;
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
    
    // Add equipment configuration
    if (results.inputs?.equipment) {
      const equipment = results.inputs.equipment;
      params.append('machineCount', equipment.machineCount?.toString() || '');
      params.append('operatingHoursPerDay', equipment.operatingHoursPerDay?.toString() || '');
      params.append('workingDaysPerWeek', equipment.workingDaysPerWeek?.toString() || '');
      params.append('machineEfficiency', equipment.machineEfficiency?.toString() || '');
    }
    
    // Add production parameters
    if (results.inputs?.production) {
      const production = results.inputs.production;
      params.append('averagePartCuttingTime', production.averagePartCuttingTime?.toString() || '');
      params.append('setupTimePerJob', production.setupTimePerJob?.toString() || '');
      params.append('averageJobSize', production.averageJobSize?.toString() || '');
    }
    
    // Add staffing
    if (results.inputs?.staffing) {
      const staffing = results.inputs.staffing;
      params.append('operatorCount', staffing.operatorCount?.toString() || '');
      params.append('shiftsPerDay', staffing.shiftsPerDay?.toString() || '');
    }
    
    const url = `${window.location.origin}/calculator/production-capacity?${params.toString()}`;
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
  src="${window.location.origin}/calculator/production-capacity" 
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
                <li>• Complete production capacity analysis and metrics</li>
                <li>• Bottleneck analysis and constraint identification</li>
                <li>• Utilization metrics and performance indicators</li>
                <li>• Resource analysis and demand forecasting</li>
                <li>• Optimization recommendations and improvement strategies</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Production Capacity Analysis Results&body=Check out this production capacity analysis: ${shareUrl}`}
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

export default ProductionCapacityExportTools;
