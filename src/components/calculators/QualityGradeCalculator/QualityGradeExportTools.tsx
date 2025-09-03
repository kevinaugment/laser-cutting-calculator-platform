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

interface QualityGradeExportToolsProps {
  results: any;
}

const QualityGradeExportTools: React.FC<QualityGradeExportToolsProps> = ({ results }) => {
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
          calculationType: 'Quality Grade Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            predictedQualityGrade: results.predictedQualityGrade,
            qualityMetrics: results.qualityMetrics,
            qualityAssessment: results.qualityAssessment,
            parameterAnalysis: results.parameterAnalysis,
            optimizationSuggestions: results.optimizationSuggestions,
            complianceCheck: results.complianceCheck,
            recommendations: results.recommendations
          },
          metadata: {
            version: '1.0',
            units: 'metric',
            standard: 'ISO 9013'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quality-grade-analysis-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Quality Grade Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Standard:', 'ISO 9013'],
          [''],
          ['INPUT PARAMETERS'],
          ['Material Type', results.inputs?.materialType || 'N/A'],
          ['Thickness (mm)', results.inputs?.thickness || 'N/A'],
          ['Laser Power (W)', results.inputs?.laserPower || 'N/A'],
          ['Cutting Speed (mm/min)', results.inputs?.cuttingSpeed || 'N/A'],
          ['Gas Type', results.inputs?.gasType || 'N/A'],
          ['Gas Pressure (bar)', results.inputs?.gasPressure || 'N/A'],
          ['Beam Diameter (mm)', results.inputs?.beamDiameter || 'N/A'],
          ['Nozzle Distance (mm)', results.inputs?.nozzleDistance || 'N/A'],
          ['Target Quality', results.inputs?.targetQuality || 'N/A'],
          [''],
          ['QUALITY PREDICTION RESULTS'],
          ['Predicted Quality Grade', results.predictedQualityGrade?.toFixed(1) || 'N/A'],
          ['Overall Quality Score', results.qualityAssessment?.overallScore || 'N/A'],
          ['Quality Classification', results.qualityAssessment?.classification || 'N/A'],
          ['Meets Target Quality', results.qualityAssessment?.meetsTarget ? 'Yes' : 'No'],
          [''],
          ['QUALITY METRICS'],
          ['Surface Roughness (μm)', results.qualityMetrics?.surfaceRoughness?.toFixed(1) || 'N/A'],
          ['Perpendicularity (mm)', results.qualityMetrics?.perpendicularity?.toFixed(3) || 'N/A'],
          ['Dross Height (mm)', results.qualityMetrics?.drossHeight?.toFixed(3) || 'N/A'],
          ['HAZ Width (mm)', results.qualityMetrics?.hazWidth?.toFixed(3) || 'N/A'],
          ['Kerf Width (mm)', results.qualityMetrics?.kerfWidth?.toFixed(3) || 'N/A'],
          ['Edge Angle (degrees)', results.qualityMetrics?.edgeAngle?.toFixed(1) || 'N/A'],
          [''],
          ['PARAMETER ANALYSIS'],
          ['Energy Density (J/mm²)', results.parameterAnalysis?.energyDensity?.toFixed(1) || 'N/A'],
          ['Power Density (W/mm²)', results.parameterAnalysis?.powerDensity?.toFixed(0) || 'N/A'],
          ['Interaction Time (ms)', results.parameterAnalysis?.interactionTime?.toFixed(2) || 'N/A'],
          ['Heat Input Rating', results.parameterAnalysis?.heatInputRating || 'N/A'],
          ['Parameter Balance', results.parameterAnalysis?.parameterBalance || 'N/A'],
          [''],
          ['COMPLIANCE CHECK'],
          ['ISO 9013 Grade', results.complianceCheck?.iso9013Grade || 'N/A'],
          ['Surface Roughness Compliance', results.complianceCheck?.surfaceRoughnessCompliance ? 'Pass' : 'Fail'],
          ['Perpendicularity Compliance', results.complianceCheck?.perpendicularityCompliance ? 'Pass' : 'Fail'],
          ['Dross Compliance', results.complianceCheck?.drossCompliance ? 'Pass' : 'Fail'],
          ['HAZ Compliance', results.complianceCheck?.hazCompliance ? 'Pass' : 'Fail'],
          ['Overall Compliance', results.complianceCheck?.overallCompliance ? 'Pass' : 'Fail'],
          [''],
          ['OPTIMIZATION SUGGESTIONS'],
          ['Priority', 'Suggestion', 'Expected Improvement'],
          ...(results.optimizationSuggestions || []).map((suggestion: any) => [
            suggestion.priority || 'Medium',
            suggestion.description || suggestion,
            suggestion.expectedImprovement || 'N/A'
          ]),
          [''],
          ['RECOMMENDATIONS'],
          ['Category', 'Recommendation'],
          ...(results.recommendations?.immediate || []).map((rec: string) => [`Immediate`, rec]),
          ...(results.recommendations?.parameterAdjustment || []).map((rec: string) => [`Parameter`, rec]),
          ...(results.recommendations?.processImprovement || []).map((rec: string) => [`Process`, rec]),
          ...(results.recommendations?.qualityControl || []).map((rec: string) => [`Quality Control`, rec])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quality-grade-analysis-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/quality-grade?${params.toString()}`;
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
  src="${window.location.origin}/calculator/quality-grade" 
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
                <li>• Complete quality grade prediction and analysis results</li>
                <li>• Quality metrics including surface roughness and perpendicularity</li>
                <li>• ISO 9013 compliance check and grade classification</li>
                <li>• Parameter analysis and optimization suggestions</li>
                <li>• Quality improvement recommendations and action items</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Quality Grade Analysis Results&body=Check out this quality grade analysis: ${shareUrl}`}
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

export default QualityGradeExportTools;
