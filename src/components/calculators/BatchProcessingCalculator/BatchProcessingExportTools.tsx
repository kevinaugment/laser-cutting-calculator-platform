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

interface BatchProcessingExportToolsProps {
  results: any;
}

const BatchProcessingExportTools: React.FC<BatchProcessingExportToolsProps> = ({ results }) => {
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
          calculationType: 'Batch Processing Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            optimizedBatching: results.optimizedBatching,
            timeAnalysis: results.timeAnalysis,
            costAnalysis: results.costAnalysis,
            efficiencyMetrics: results.efficiencyMetrics,
            productionSchedule: results.productionSchedule,
            recommendations: results.recommendations,
            alternativeStrategies: results.alternativeStrategies
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
        a.download = `batch-processing-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Batch Processing Optimization Report'],
          ['Generated:', new Date().toLocaleString()],
          [''],
          ['OPTIMIZED BATCHING SUMMARY'],
          ['Total Batches', results.optimizedBatching?.totalBatches || 'N/A'],
          ['Optimal Batch Size', results.optimizedBatching?.optimalBatchSize || 'N/A'],
          ['Batching Efficiency (%)', results.optimizedBatching?.batchingEfficiency?.toFixed(1) || 'N/A'],
          ['Total Production Time (hours)', results.optimizedBatching?.totalProductionTime?.toFixed(1) || 'N/A'],
          ['Setup Time Ratio (%)', results.optimizedBatching?.setupTimeRatio?.toFixed(1) || 'N/A'],
          [''],
          ['TIME ANALYSIS'],
          ['Total Processing Time (hours)', results.timeAnalysis?.totalProcessingTime?.toFixed(1) || 'N/A'],
          ['Total Setup Time (hours)', results.timeAnalysis?.totalSetupTime?.toFixed(1) || 'N/A'],
          ['Total Changeover Time (hours)', results.timeAnalysis?.totalChangeoverTime?.toFixed(1) || 'N/A'],
          ['Time Optimization (hours saved)', results.timeAnalysis?.timeOptimization?.toFixed(1) || 'N/A'],
          ['Efficiency Improvement (%)', results.timeAnalysis?.efficiencyImprovement?.toFixed(1) || 'N/A'],
          [''],
          ['COST ANALYSIS'],
          ['Total Production Cost', results.costAnalysis?.totalProductionCost?.toFixed(2) || 'N/A'],
          ['Setup Cost', results.costAnalysis?.setupCost?.toFixed(2) || 'N/A'],
          ['Processing Cost', results.costAnalysis?.processingCost?.toFixed(2) || 'N/A'],
          ['Inventory Holding Cost', results.costAnalysis?.inventoryHoldingCost?.toFixed(2) || 'N/A'],
          ['Cost per Unit', results.costAnalysis?.costPerUnit?.toFixed(2) || 'N/A'],
          ['Cost Savings vs Basic Batching', results.costAnalysis?.costSavings?.toFixed(2) || 'N/A'],
          [''],
          ['EFFICIENCY METRICS'],
          ['Overall Equipment Effectiveness (%)', results.efficiencyMetrics?.overallEquipmentEffectiveness?.toFixed(1) || 'N/A'],
          ['Utilization Rate (%)', results.efficiencyMetrics?.utilizationRate?.toFixed(1) || 'N/A'],
          ['Throughput (units/hour)', results.efficiencyMetrics?.throughput?.toFixed(1) || 'N/A'],
          ['Quality Rate (%)', results.efficiencyMetrics?.qualityRate?.toFixed(1) || 'N/A'],
          ['Performance Efficiency (%)', results.efficiencyMetrics?.performanceEfficiency?.toFixed(1) || 'N/A'],
          [''],
          ['PRODUCTION SCHEDULE'],
          ['Batch #', 'Part Type', 'Quantity', 'Start Time', 'Duration (min)', 'Material'],
          ...(results.productionSchedule?.batches || []).map((batch: any, index: number) => [
            `Batch ${index + 1}`,
            batch.partType || 'N/A',
            batch.quantity || 0,
            batch.startTime || 'N/A',
            batch.duration?.toFixed(0) || 'N/A',
            batch.material || 'N/A'
          ]),
          [''],
          ['RECOMMENDATIONS'],
          ['Category', 'Recommendation'],
          ...(results.recommendations?.immediate || []).map((rec: string) => [`Immediate`, rec]),
          ...(results.recommendations?.processOptimization || []).map((rec: string) => [`Process`, rec]),
          ...(results.recommendations?.costReduction || []).map((rec: string) => [`Cost`, rec]),
          ...(results.recommendations?.efficiencyImprovement || []).map((rec: string) => [`Efficiency`, rec])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `batch-processing-${timestamp}.${format}`;
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
    
    // Add batch configuration
    if (results.inputs?.batchConfiguration) {
      const config = results.inputs.batchConfiguration;
      params.append('batchSize', config.batchSize?.toString() || '');
      params.append('totalQuantity', config.totalQuantity?.toString() || '');
      params.append('batchingStrategy', config.batchingStrategy || '');
    }
    
    // Add operational parameters
    if (results.inputs?.operationalParameters) {
      const ops = results.inputs.operationalParameters;
      params.append('shiftDuration', ops.shiftDuration?.toString() || '');
      params.append('shiftsPerDay', ops.shiftsPerDay?.toString() || '');
      params.append('setupTime', ops.setupTime?.toString() || '');
      params.append('changeoverTime', ops.changeoverTime?.toString() || '');
    }
    
    const url = `${window.location.origin}/calculator/batch-processing?${params.toString()}`;
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
  src="${window.location.origin}/calculator/batch-processing" 
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
                <li>• Complete batch processing optimization results and schedules</li>
                <li>• Time analysis and efficiency metrics</li>
                <li>• Cost analysis and savings calculations</li>
                <li>• Production schedule with batch details</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Batch Processing Optimization Results&body=Check out this batch processing optimization analysis: ${shareUrl}`}
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

export default BatchProcessingExportTools;
