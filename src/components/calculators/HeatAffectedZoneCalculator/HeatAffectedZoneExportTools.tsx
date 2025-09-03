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

interface HeatAffectedZoneExportToolsProps {
  results: any;
}

const HeatAffectedZoneExportTools: React.FC<HeatAffectedZoneExportToolsProps> = ({ results }) => {
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
          calculationType: 'Heat Affected Zone Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            hazAnalysis: results.hazAnalysis,
            thermalAnalysis: results.thermalAnalysis,
            materialChanges: results.materialChanges,
            qualityAssessment: results.qualityAssessment,
            optimizedParameters: results.optimizedParameters,
            processControl: results.processControl,
            recommendations: results.recommendations,
            comparisonData: results.comparisonData,
            sensitivityAnalysis: results.sensitivityAnalysis
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
        a.download = `haz-analysis-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Heat Affected Zone Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          [''],
          ['INPUT PARAMETERS'],
          ['Material Type', results.inputs?.material?.type || 'N/A'],
          ['Thickness (mm)', results.inputs?.material?.thickness || 'N/A'],
          ['Thermal Conductivity (W/mm·K)', results.inputs?.material?.thermalConductivity || 'N/A'],
          ['Density (g/cm³)', results.inputs?.material?.density || 'N/A'],
          ['Specific Heat (J/g·K)', results.inputs?.material?.specificHeat || 'N/A'],
          ['Laser Power (W)', results.inputs?.laserParams?.power || 'N/A'],
          ['Cutting Speed (mm/min)', results.inputs?.laserParams?.speed || 'N/A'],
          ['Beam Diameter (mm)', results.inputs?.laserParams?.beamDiameter || 'N/A'],
          [''],
          ['HAZ ANALYSIS RESULTS'],
          ['HAZ Width (mm)', results.hazAnalysis?.width?.toFixed(3) || 'N/A'],
          ['HAZ Depth (mm)', results.hazAnalysis?.depth?.toFixed(3) || 'N/A'],
          ['HAZ Volume (mm³)', results.hazAnalysis?.volume?.toFixed(2) || 'N/A'],
          ['HAZ Classification', results.hazAnalysis?.classification || 'N/A'],
          ['HAZ Acceptability', results.hazAnalysis?.acceptability || 'N/A'],
          [''],
          ['THERMAL ANALYSIS'],
          ['Peak Temperature (°C)', results.thermalAnalysis?.peakTemperature?.toFixed(0) || 'N/A'],
          ['Heating Rate (°C/s)', results.thermalAnalysis?.heatingRate?.toFixed(1) || 'N/A'],
          ['Cooling Rate (°C/s)', results.thermalAnalysis?.coolingRate?.toFixed(1) || 'N/A'],
          ['Time at Temperature (s)', results.thermalAnalysis?.timeAtTemperature?.toFixed(2) || 'N/A'],
          ['Thermal Gradient (°C/mm)', results.thermalAnalysis?.thermalGradient?.toFixed(0) || 'N/A'],
          ['Energy Density (J/mm²)', results.thermalAnalysis?.energyDensity?.toFixed(1) || 'N/A'],
          [''],
          ['MATERIAL CHANGES'],
          ['Hardness Change (%)', results.materialChanges?.hardnessChange?.percentage?.toFixed(1) || 'N/A'],
          ['New Hardness (HV)', results.materialChanges?.hardnessChange?.newHardness?.toFixed(0) || 'N/A'],
          ['Tensile Strength Change (%)', results.materialChanges?.mechanicalProperties?.tensileStrength?.change || 'N/A'],
          ['Yield Strength Change (%)', results.materialChanges?.mechanicalProperties?.yieldStrength?.change || 'N/A'],
          ['Ductility Change (%)', results.materialChanges?.mechanicalProperties?.ductility?.change || 'N/A'],
          ['Residual Stress Level', results.materialChanges?.residualStress?.level || 'N/A'],
          [''],
          ['QUALITY ASSESSMENT'],
          ['Overall Grade', results.qualityAssessment?.overallGrade || 'N/A'],
          ['HAZ Width Compliance', results.qualityAssessment?.hazWidthCompliance ? 'Pass' : 'Fail'],
          ['Hardness Compliance', results.qualityAssessment?.hardnessCompliance ? 'Pass' : 'Fail'],
          ['Microstructure Compliance', results.qualityAssessment?.microstructureCompliance ? 'Pass' : 'Fail'],
          ['Compliance Score (%)', results.qualityAssessment?.complianceScore || 'N/A'],
          ['Risk Level', results.qualityAssessment?.riskLevel || 'N/A'],
          [''],
          ['OPTIMIZATION RECOMMENDATIONS'],
          ['Status', results.optimizedParameters?.status || 'N/A'],
          ['Current HAZ (mm)', results.optimizedParameters?.currentHAZ?.toFixed(3) || 'N/A'],
          ['Target HAZ (mm)', results.optimizedParameters?.targetHAZ?.toFixed(3) || 'N/A'],
          ['Recommended Power (W)', results.optimizedParameters?.recommendedPower || 'N/A'],
          ['Recommended Speed (mm/min)', results.optimizedParameters?.recommendedSpeed || 'N/A'],
          ['Expected Improvement (%)', results.optimizedParameters?.expectedImprovement || 'N/A'],
          [''],
          ['RECOMMENDATIONS'],
          ...(results.recommendations?.immediate || []).map((rec: string) => [`Immediate: ${rec}`]),
          ...(results.recommendations?.processOptimization || []).map((rec: string) => [`Process: ${rec}`]),
          ...(results.recommendations?.qualityImprovement || []).map((rec: string) => [`Quality: ${rec}`])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `haz-analysis-${timestamp}.${format}`;
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
    const params = new URLSearchParams({
      materialType: results.inputs?.material?.type || '',
      thickness: results.inputs?.material?.thickness?.toString() || '',
      thermalConductivity: results.inputs?.material?.thermalConductivity?.toString() || '',
      density: results.inputs?.material?.density?.toString() || '',
      specificHeat: results.inputs?.material?.specificHeat?.toString() || '',
      laserPower: results.inputs?.laserParams?.power?.toString() || '',
      cuttingSpeed: results.inputs?.laserParams?.speed?.toString() || '',
      beamDiameter: results.inputs?.laserParams?.beamDiameter?.toString() || ''
    });
    
    const url = `${window.location.origin}/calculator/heat-affected-zone?${params.toString()}`;
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
  src="${window.location.origin}/calculator/heat-affected-zone" 
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
                <li>• Complete HAZ analysis results and thermal data</li>
                <li>• Material property changes and quality assessment</li>
                <li>• Optimization recommendations and process control</li>
                <li>• Sensitivity analysis and comparison data</li>
                <li>• Input parameters and calculation metadata</li>
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
                      onClick={() => window.location.href = `mailto:?subject=HAZ Analysis Results&body=Check out this heat affected zone analysis: ${shareUrl}`}
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

export default HeatAffectedZoneExportTools;
