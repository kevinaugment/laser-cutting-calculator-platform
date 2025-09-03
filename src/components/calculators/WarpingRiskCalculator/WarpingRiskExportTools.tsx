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

interface WarpingRiskExportToolsProps {
  results: any;
}

const WarpingRiskExportTools: React.FC<WarpingRiskExportToolsProps> = ({ results }) => {
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
          calculationType: 'Warping Risk Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            warpingRiskAssessment: results.warpingRiskAssessment,
            thermalAnalysis: results.thermalAnalysis,
            materialAnalysis: results.materialAnalysis,
            geometricAnalysis: results.geometricAnalysis,
            preventionRecommendations: results.preventionRecommendations,
            qualityImpact: results.qualityImpact,
            mitigationStrategies: results.mitigationStrategies
          },
          metadata: {
            version: '1.0',
            units: 'metric',
            riskModel: results.inputs?.riskModel || 'comprehensive'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warping-risk-assessment-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Warping Risk Assessment Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Risk Model:', results.inputs?.riskModel || 'N/A'],
          [''],
          ['WARPING RISK SUMMARY'],
          ['Metric', 'Value', 'Risk Level', 'Confidence'],
          ['Overall Risk Score', results.warpingRiskAssessment?.riskScore?.toFixed(1) || 'N/A',
           results.warpingRiskAssessment?.overallRiskLevel || 'N/A',
           `${results.warpingRiskAssessment?.confidenceLevel || 'N/A'}%`],
          ['Thermal Risk', results.warpingRiskAssessment?.riskDistribution?.thermalRisk?.toFixed(1) || 'N/A',
           results.thermalAnalysis?.riskLevel || 'N/A', ''],
          ['Geometric Risk', results.warpingRiskAssessment?.riskDistribution?.geometricRisk?.toFixed(1) || 'N/A',
           results.geometricAnalysis?.riskLevel || 'N/A', ''],
          ['Material Risk', results.warpingRiskAssessment?.riskDistribution?.materialRisk?.toFixed(1) || 'N/A',
           results.materialAnalysis?.riskLevel || 'N/A', ''],
          ['Process Risk', results.warpingRiskAssessment?.riskDistribution?.processRisk?.toFixed(1) || 'N/A',
           results.thermalAnalysis?.processRiskLevel || 'N/A', ''],
          [''],
          ['PRIMARY RISK FACTORS'],
          ['Factor', 'Impact Level', 'Description', 'Mitigation Priority'],
          ...(results.warpingRiskAssessment?.primaryRiskFactors || []).map((factor: any) => [
            factor.name || 'N/A',
            factor.impact || 'N/A',
            factor.description || 'N/A',
            factor.priority || 'Medium'
          ]),
          [''],
          ['THERMAL ANALYSIS'],
          ['Parameter', 'Value', 'Unit', 'Risk Contribution'],
          ['Heat Input Density', results.thermalAnalysis?.heatInputDensity?.toFixed(2) || 'N/A', 'J/mm³',
           results.thermalAnalysis?.heatInputRisk || 'N/A'],
          ['Thermal Gradient', results.thermalAnalysis?.thermalGradient?.toFixed(1) || 'N/A', '°C/mm',
           results.thermalAnalysis?.gradientRisk || 'N/A'],
          ['Cooling Rate', results.thermalAnalysis?.coolingRate?.toFixed(1) || 'N/A', '°C/s',
           results.thermalAnalysis?.coolingRisk || 'N/A'],
          ['Heat Affected Zone', results.thermalAnalysis?.hazWidth?.toFixed(2) || 'N/A', 'mm',
           results.thermalAnalysis?.hazRisk || 'N/A'],
          ['Thermal Stress', results.thermalAnalysis?.thermalStress?.toFixed(1) || 'N/A', 'MPa',
           results.thermalAnalysis?.stressRisk || 'N/A'],
          [''],
          ['GEOMETRIC ANALYSIS'],
          ['Geometric Factor', 'Value', 'Risk Level', 'Impact'],
          ['Aspect Ratio', results.geometricAnalysis?.aspectRatio?.toFixed(2) || 'N/A',
           results.geometricAnalysis?.aspectRatioRisk || 'N/A',
           results.geometricAnalysis?.aspectRatioImpact || 'N/A'],
          ['Length-to-Thickness', results.geometricAnalysis?.lengthToThickness?.toFixed(1) || 'N/A',
           results.geometricAnalysis?.ltRisk || 'N/A',
           results.geometricAnalysis?.ltImpact || 'N/A'],
          ['Width-to-Thickness', results.geometricAnalysis?.widthToThickness?.toFixed(1) || 'N/A',
           results.geometricAnalysis?.wtRisk || 'N/A',
           results.geometricAnalysis?.wtImpact || 'N/A'],
          ['Part Area', results.geometricAnalysis?.partArea?.toFixed(0) || 'N/A',
           results.geometricAnalysis?.areaRisk || 'N/A',
           results.geometricAnalysis?.areaImpact || 'N/A'],
          [''],
          ['MATERIAL ANALYSIS'],
          ['Material Property', 'Value', 'Unit', 'Risk Contribution'],
          ['Thermal Expansion', results.materialAnalysis?.thermalExpansion?.toFixed(1) || 'N/A', '×10⁻⁶/°C',
           results.materialAnalysis?.expansionRisk || 'N/A'],
          ['Thermal Conductivity', results.materialAnalysis?.thermalConductivity?.toFixed(1) || 'N/A', 'W/m·K',
           results.materialAnalysis?.conductivityRisk || 'N/A'],
          ['Elastic Modulus', results.materialAnalysis?.elasticModulus?.toFixed(0) || 'N/A', 'GPa',
           results.materialAnalysis?.modulusRisk || 'N/A'],
          ['Yield Strength', results.materialAnalysis?.yieldStrength?.toFixed(0) || 'N/A', 'MPa',
           results.materialAnalysis?.strengthRisk || 'N/A'],
          ['Material Susceptibility', results.materialAnalysis?.susceptibilityIndex?.toFixed(2) || 'N/A', 'index',
           results.materialAnalysis?.susceptibilityRisk || 'N/A'],
          [''],
          ['QUALITY IMPACT ASSESSMENT'],
          ['Quality Aspect', 'Predicted Impact', 'Tolerance Effect', 'Severity'],
          ['Dimensional Accuracy', results.qualityImpact?.dimensionalAccuracy || 'N/A',
           results.qualityImpact?.toleranceEffect || 'N/A',
           results.qualityImpact?.dimensionalSeverity || 'N/A'],
          ['Flatness Deviation', results.qualityImpact?.flatnessDeviation || 'N/A',
           results.qualityImpact?.flatnessEffect || 'N/A',
           results.qualityImpact?.flatnessSeverity || 'N/A'],
          ['Edge Straightness', results.qualityImpact?.edgeStraightness || 'N/A',
           results.qualityImpact?.straightnessEffect || 'N/A',
           results.qualityImpact?.edgeSeverity || 'N/A'],
          ['Assembly Fit', results.qualityImpact?.assemblyFit || 'N/A',
           results.qualityImpact?.fitEffect || 'N/A',
           results.qualityImpact?.assemblySeverity || 'N/A'],
          [''],
          ['PREVENTION RECOMMENDATIONS'],
          ['Category', 'Recommendation', 'Expected Benefit', 'Implementation Priority'],
          ...(results.preventionRecommendations?.parameterAdjustments || []).map((rec: string, index: number) => [
            'Parameter Adjustment',
            rec,
            results.preventionRecommendations?.parameterBenefits?.[index] || 'N/A',
            results.preventionRecommendations?.parameterPriorities?.[index] || 'Medium'
          ]),
          ...(results.preventionRecommendations?.processModifications || []).map((rec: string, index: number) => [
            'Process Modification',
            rec,
            results.preventionRecommendations?.processBenefits?.[index] || 'N/A',
            results.preventionRecommendations?.processPriorities?.[index] || 'Medium'
          ]),
          ...(results.preventionRecommendations?.designChanges || []).map((rec: string, index: number) => [
            'Design Change',
            rec,
            results.preventionRecommendations?.designBenefits?.[index] || 'N/A',
            results.preventionRecommendations?.designPriorities?.[index] || 'Medium'
          ]),
          [''],
          ['MITIGATION STRATEGIES'],
          ['Strategy', 'Description', 'Effectiveness', 'Implementation Complexity'],
          ...(results.mitigationStrategies || []).map((strategy: any) => [
            strategy.name || 'N/A',
            strategy.description || 'N/A',
            strategy.effectiveness || 'N/A',
            strategy.complexity || 'N/A'
          ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warping-risk-assessment-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/warping-risk?${params.toString()}`;
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
  src="${window.location.origin}/calculator/warping-risk" 
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
                <li>• Complete warping risk assessment and scoring analysis</li>
                <li>• Detailed thermal, geometric, and material analysis</li>
                <li>• Quality impact predictions and tolerance effects</li>
                <li>• Prevention recommendations and mitigation strategies</li>
                <li>• Risk factor breakdown and priority assessments</li>
                <li>• Implementation guidelines and best practices</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Warping Risk Assessment&body=Check out this warping risk assessment: ${shareUrl}`}
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

export default WarpingRiskExportTools;
