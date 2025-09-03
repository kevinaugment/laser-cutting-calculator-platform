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

interface CutPathOptimizerExportToolsProps {
  results: any;
}

const CutPathOptimizerExportTools: React.FC<CutPathOptimizerExportToolsProps> = ({ results }) => {
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
          calculationType: 'Cut Path Optimizer',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            optimizedPath: results.optimizedPath,
            pathSummary: results.pathSummary,
            thermalAnalysis: results.thermalAnalysis,
            qualityPrediction: results.qualityPrediction,
            efficiencyMetrics: results.efficiencyMetrics,
            alternativeStrategies: results.alternativeStrategies,
            optimizationRecommendations: results.optimizationRecommendations
          },
          metadata: {
            version: '1.0',
            units: 'metric',
            optimizationAlgorithm: results.inputs?.optimizationMethod || 'genetic_algorithm'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cut-path-optimization-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Cut Path Optimization Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Optimization Method:', results.inputs?.optimizationMethod || 'N/A'],
          [''],
          ['PATH SUMMARY'],
          ['Metric', 'Original', 'Optimized', 'Improvement'],
          ['Total Cutting Time (min)', results.pathSummary?.originalTime?.toFixed(2) || 'N/A', 
           results.pathSummary?.optimizedTime?.toFixed(2) || 'N/A',
           results.pathSummary?.timeImprovement || 'N/A'],
          ['Travel Distance (mm)', results.pathSummary?.originalTravel?.toFixed(0) || 'N/A',
           results.pathSummary?.optimizedTravel?.toFixed(0) || 'N/A',
           results.pathSummary?.travelReduction || 'N/A'],
          ['Path Efficiency (%)', results.pathSummary?.originalEfficiency?.toFixed(1) || 'N/A',
           results.pathSummary?.optimizedEfficiency?.toFixed(1) || 'N/A',
           results.pathSummary?.efficiencyGain || 'N/A'],
          ['Number of Pierces', results.pathSummary?.pierceCount || 'N/A',
           results.pathSummary?.optimizedPierces || 'N/A',
           results.pathSummary?.pierceReduction || 'N/A'],
          [''],
          ['EFFICIENCY METRICS'],
          ['Metric', 'Value', 'Unit', 'Rating'],
          ['Cutting Efficiency', results.efficiencyMetrics?.cuttingEfficiency?.toFixed(1) || 'N/A', '%', 
           results.efficiencyMetrics?.cuttingRating || 'N/A'],
          ['Travel Efficiency', results.efficiencyMetrics?.travelEfficiency?.toFixed(1) || 'N/A', '%',
           results.efficiencyMetrics?.travelRating || 'N/A'],
          ['Thermal Efficiency', results.efficiencyMetrics?.thermalEfficiency?.toFixed(1) || 'N/A', '%',
           results.efficiencyMetrics?.thermalRating || 'N/A'],
          ['Overall Score', results.efficiencyMetrics?.overallScore?.toFixed(1) || 'N/A', 'points',
           results.efficiencyMetrics?.overallRating || 'N/A'],
          [''],
          ['THERMAL ANALYSIS'],
          ['Zone', 'Max Temperature (°C)', 'Heat Accumulation', 'Cooling Time (s)', 'Risk Level'],
          ...(results.thermalAnalysis?.zones || []).map((zone: any) => [
            zone.name || 'N/A',
            zone.maxTemperature?.toFixed(0) || 'N/A',
            zone.heatAccumulation || 'N/A',
            zone.coolingTime?.toFixed(1) || 'N/A',
            zone.riskLevel || 'N/A'
          ]),
          [''],
          ['QUALITY PREDICTION'],
          ['Parameter', 'Predicted Value', 'Target Range', 'Status'],
          ['Edge Quality Grade', results.qualityPrediction?.edgeQuality || 'N/A',
           results.qualityPrediction?.edgeQualityTarget || 'N/A',
           results.qualityPrediction?.edgeQualityStatus || 'N/A'],
          ['Dimensional Accuracy (mm)', results.qualityPrediction?.dimensionalAccuracy?.toFixed(3) || 'N/A',
           results.qualityPrediction?.accuracyTarget || 'N/A',
           results.qualityPrediction?.accuracyStatus || 'N/A'],
          ['Surface Roughness (μm)', results.qualityPrediction?.surfaceRoughness?.toFixed(2) || 'N/A',
           results.qualityPrediction?.roughnessTarget || 'N/A',
           results.qualityPrediction?.roughnessStatus || 'N/A'],
          ['Heat Affected Zone (mm)', results.qualityPrediction?.hazWidth?.toFixed(2) || 'N/A',
           results.qualityPrediction?.hazTarget || 'N/A',
           results.qualityPrediction?.hazStatus || 'N/A'],
          [''],
          ['OPTIMIZATION RECOMMENDATIONS'],
          ['Category', 'Recommendation', 'Expected Benefit', 'Implementation Priority'],
          ...(results.optimizationRecommendations?.pathImprovements || []).map((rec: string, index: number) => [
            'Path Improvement',
            rec,
            results.optimizationRecommendations?.pathBenefits?.[index] || 'N/A',
            results.optimizationRecommendations?.pathPriorities?.[index] || 'Medium'
          ]),
          ...(results.optimizationRecommendations?.parameterAdjustments || []).map((rec: string, index: number) => [
            'Parameter Adjustment',
            rec,
            results.optimizationRecommendations?.parameterBenefits?.[index] || 'N/A',
            results.optimizationRecommendations?.parameterPriorities?.[index] || 'Medium'
          ]),
          [''],
          ['ALTERNATIVE STRATEGIES'],
          ['Strategy', 'Description', 'Time Savings (%)', 'Quality Impact', 'Complexity'],
          ...(results.alternativeStrategies || []).map((strategy: any) => [
            strategy.name || 'N/A',
            strategy.description || 'N/A',
            strategy.timeSavings?.toFixed(1) || 'N/A',
            strategy.qualityImpact || 'N/A',
            strategy.complexity || 'N/A'
          ]),
          [''],
          ['OPTIMIZED PATH COORDINATES'],
          ['Sequence', 'Operation', 'X (mm)', 'Y (mm)', 'Speed (mm/min)', 'Comments'],
          ...(results.optimizedPath?.coordinates || []).map((coord: any, index: number) => [
            index + 1,
            coord.operation || 'N/A',
            coord.x?.toFixed(2) || 'N/A',
            coord.y?.toFixed(2) || 'N/A',
            coord.speed?.toFixed(0) || 'N/A',
            coord.comments || ''
          ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cut-path-optimization-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/cut-path-optimizer?${params.toString()}`;
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
  src="${window.location.origin}/calculator/cut-path-optimizer" 
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
                <li>• Complete path optimization analysis and efficiency metrics</li>
                <li>• Detailed thermal analysis and heat distribution data</li>
                <li>• Quality predictions and dimensional accuracy assessments</li>
                <li>• Optimization recommendations and alternative strategies</li>
                <li>• Optimized path coordinates and cutting sequences</li>
                <li>• Performance comparisons and improvement calculations</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Cut Path Optimization Analysis&body=Check out this cut path optimization analysis: ${shareUrl}`}
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

export default CutPathOptimizerExportTools;
