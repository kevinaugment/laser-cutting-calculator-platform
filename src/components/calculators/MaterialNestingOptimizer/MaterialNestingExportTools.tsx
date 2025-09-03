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

interface MaterialNestingExportToolsProps {
  results: any;
}

const MaterialNestingExportTools: React.FC<MaterialNestingExportToolsProps> = ({ results }) => {
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
          calculationType: 'Material Nesting Optimizer',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            optimizationSummary: results.optimizationSummary,
            nestingLayouts: results.nestingLayouts,
            materialUtilization: results.materialUtilization,
            costAnalysis: results.costAnalysis,
            wasteAnalysis: results.wasteAnalysis,
            recommendations: results.recommendations,
            alternativeLayouts: results.alternativeLayouts
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
        a.download = `nesting-optimization-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Material Nesting Optimization Report'],
          ['Generated:', new Date().toLocaleString()],
          [''],
          ['OPTIMIZATION SUMMARY'],
          ['Total Sheets Used', results.optimizationSummary?.totalSheets || 'N/A'],
          ['Overall Utilization (%)', results.optimizationSummary?.overallUtilization?.toFixed(1) || 'N/A'],
          ['Total Material Cost', results.optimizationSummary?.totalMaterialCost?.toFixed(2) || 'N/A'],
          ['Total Waste Cost', results.optimizationSummary?.totalWasteCost?.toFixed(2) || 'N/A'],
          ['Cost per Part', results.optimizationSummary?.costPerPart?.toFixed(2) || 'N/A'],
          [''],
          ['MATERIAL UTILIZATION'],
          ['Used Area (mm²)', results.materialUtilization?.usedArea?.toFixed(0) || 'N/A'],
          ['Total Area (mm²)', results.materialUtilization?.totalArea?.toFixed(0) || 'N/A'],
          ['Waste Area (mm²)', results.materialUtilization?.wasteArea?.toFixed(0) || 'N/A'],
          ['Utilization Rate (%)', results.materialUtilization?.utilizationRate?.toFixed(1) || 'N/A'],
          ['Efficiency Grade', results.materialUtilization?.efficiencyGrade || 'N/A'],
          [''],
          ['COST ANALYSIS'],
          ['Material Cost per Sheet', results.costAnalysis?.materialCostPerSheet?.toFixed(2) || 'N/A'],
          ['Total Material Cost', results.costAnalysis?.totalMaterialCost?.toFixed(2) || 'N/A'],
          ['Waste Cost', results.costAnalysis?.wasteCost?.toFixed(2) || 'N/A'],
          ['Cost Savings vs Basic Nesting', results.costAnalysis?.costSavings?.toFixed(2) || 'N/A'],
          ['ROI of Optimization (%)', results.costAnalysis?.optimizationROI?.toFixed(1) || 'N/A'],
          [''],
          ['WASTE ANALYSIS'],
          ['Total Waste (mm²)', results.wasteAnalysis?.totalWaste?.toFixed(0) || 'N/A'],
          ['Kerf Waste (mm²)', results.wasteAnalysis?.kerfWaste?.toFixed(0) || 'N/A'],
          ['Edge Waste (mm²)', results.wasteAnalysis?.edgeWaste?.toFixed(0) || 'N/A'],
          ['Remnant Waste (mm²)', results.wasteAnalysis?.remnantWaste?.toFixed(0) || 'N/A'],
          ['Waste Reduction vs Basic (%)', results.wasteAnalysis?.wasteReduction?.toFixed(1) || 'N/A'],
          [''],
          ['SHEET LAYOUTS'],
          ['Sheet #', 'Material Type', 'Dimensions (mm)', 'Parts Count', 'Utilization (%)'],
          ...(results.nestingLayouts || []).map((layout: any, index: number) => [
            `Sheet ${index + 1}`,
            layout.materialType || 'N/A',
            `${layout.dimensions?.length || 0} × ${layout.dimensions?.width || 0}`,
            layout.partsCount || 0,
            layout.utilization?.toFixed(1) || 'N/A'
          ]),
          [''],
          ['RECOMMENDATIONS'],
          ...(results.recommendations?.immediate || []).map((rec: string) => [`Immediate: ${rec}`]),
          ...(results.recommendations?.processOptimization || []).map((rec: string) => [`Process: ${rec}`]),
          ...(results.recommendations?.costReduction || []).map((rec: string) => [`Cost: ${rec}`])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nesting-optimization-${timestamp}.${format}`;
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
    
    // Add parts data
    if (results.inputs?.parts) {
      results.inputs.parts.forEach((part: any, index: number) => {
        params.append(`part${index}_length`, part.length?.toString() || '');
        params.append(`part${index}_width`, part.width?.toString() || '');
        params.append(`part${index}_quantity`, part.quantity?.toString() || '');
        params.append(`part${index}_material`, part.materialType || '');
      });
    }
    
    // Add sheet specifications
    if (results.inputs?.sheetSpecs) {
      results.inputs.sheetSpecs.forEach((sheet: any, index: number) => {
        params.append(`sheet${index}_length`, sheet.length?.toString() || '');
        params.append(`sheet${index}_width`, sheet.width?.toString() || '');
        params.append(`sheet${index}_cost`, sheet.cost?.toString() || '');
        params.append(`sheet${index}_material`, sheet.materialType || '');
      });
    }
    
    const url = `${window.location.origin}/calculator/material-nesting-optimizer?${params.toString()}`;
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
  src="${window.location.origin}/calculator/material-nesting-optimizer" 
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
                <li>• Complete nesting optimization results and layouts</li>
                <li>• Material utilization analysis and efficiency metrics</li>
                <li>• Cost analysis and waste reduction calculations</li>
                <li>• Sheet-by-sheet layout details and part placement</li>
                <li>• Optimization recommendations and improvement suggestions</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Material Nesting Optimization Results&body=Check out this nesting optimization analysis: ${shareUrl}`}
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

export default MaterialNestingExportTools;
