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

interface EdgeQualityPredictorExportToolsProps {
  results: any;
}

const EdgeQualityPredictorExportTools: React.FC<EdgeQualityPredictorExportToolsProps> = ({ results }) => {
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
          calculationType: 'Edge Quality Predictor',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            qualityPrediction: results.qualityPrediction,
            edgeCharacteristics: results.edgeCharacteristics,
            qualityGrading: results.qualityGrading,
            parameterAnalysis: results.parameterAnalysis,
            optimizationRecommendations: results.optimizationRecommendations,
            qualityBenchmark: results.qualityBenchmark,
            processStability: results.processStability,
            riskAssessment: results.riskAssessment
          },
          metadata: {
            version: '1.0',
            units: 'metric',
            materialType: results.inputs?.materialType || 'N/A'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edge-quality-prediction-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Edge Quality Prediction Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Material Type:', results.inputs?.materialType || 'N/A'],
          [''],
          ['INPUT PARAMETERS'],
          ['Material Type', results.inputs?.materialType || 'N/A'],
          ['Material Thickness (mm)', results.inputs?.thickness || 'N/A'],
          ['Laser Power (W)', results.inputs?.laserPower || 'N/A'],
          ['Cutting Speed (mm/min)', results.inputs?.cuttingSpeed || 'N/A'],
          ['Gas Type', results.inputs?.gasType || 'N/A'],
          ['Gas Pressure (bar)', results.inputs?.gasPressure || 'N/A'],
          ['Beam Quality (M²)', results.inputs?.beamQuality || 'N/A'],
          ['Focus Position (mm)', results.inputs?.focusPosition || 'N/A'],
          ['Nozzle Diameter (mm)', results.inputs?.nozzleDiameter || 'N/A'],
          [''],
          ['QUALITY PREDICTION RESULTS'],
          ['Overall Quality Grade', results.qualityPrediction?.overallQualityGrade?.toFixed(1) || 'N/A'],
          ['Edge Roughness (μm Ra)', results.qualityPrediction?.edgeRoughness?.toFixed(2) || 'N/A'],
          ['Confidence Level (%)', results.qualityPrediction?.confidenceLevel || 'N/A'],
          ['Quality Class', results.qualityPrediction?.qualityClass || 'N/A'],
          ['Expected Variation (%)', results.qualityPrediction?.expectedVariation?.toFixed(1) || 'N/A'],
          [''],
          ['EDGE CHARACTERISTICS'],
          ['Characteristic', 'Predicted Value', 'Unit', 'Quality Impact'],
          ...(results.edgeCharacteristics || []).map((char: any) => [
            char.name || 'N/A',
            char.value?.toFixed(2) || 'N/A',
            char.unit || 'N/A',
            char.qualityImpact || 'N/A'
          ]),
          [''],
          ['QUALITY GRADING BREAKDOWN'],
          ['ISO 9013 Grade', results.qualityGrading?.iso9013Grade || 'N/A'],
          ['Surface Roughness Grade', results.qualityGrading?.roughnessGrade || 'N/A'],
          ['Perpendicularity Grade', results.qualityGrading?.perpendicularityGrade || 'N/A'],
          ['Dross Formation Grade', results.qualityGrading?.drossGrade || 'N/A'],
          ['HAZ Width Grade', results.qualityGrading?.hazGrade || 'N/A'],
          ['Overall Score (1-10)', results.qualityGrading?.overallScore?.toFixed(1) || 'N/A'],
          [''],
          ['PARAMETER ANALYSIS'],
          ['Parameter', 'Current Value', 'Optimal Range', 'Quality Impact'],
          ...(results.parameterAnalysis || []).map((param: any) => [
            param.parameter || 'N/A',
            param.currentValue || 'N/A',
            param.optimalRange || 'N/A',
            param.qualityImpact || 'N/A'
          ]),
          [''],
          ['QUALITY BENCHMARK COMPARISON'],
          ['Industry Standard Grade', results.qualityBenchmark?.industryStandard || 'N/A'],
          ['Best Practice Grade', results.qualityBenchmark?.bestPractice || 'N/A'],
          ['Your Predicted Grade', results.qualityBenchmark?.predictedGrade || 'N/A'],
          ['Performance vs Standard (%)', results.qualityBenchmark?.vsStandard?.toFixed(1) || 'N/A'],
          ['Performance vs Best Practice (%)', results.qualityBenchmark?.vsBestPractice?.toFixed(1) || 'N/A'],
          ['Quality Ranking', results.qualityBenchmark?.qualityRanking || 'N/A'],
          [''],
          ['PROCESS STABILITY ANALYSIS'],
          ['Stability Index (1-10)', results.processStability?.stabilityIndex?.toFixed(1) || 'N/A'],
          ['Parameter Sensitivity', results.processStability?.parameterSensitivity || 'N/A'],
          ['Process Window Size', results.processStability?.processWindow || 'N/A'],
          ['Robustness Rating', results.processStability?.robustnessRating || 'N/A'],
          ['Variation Risk Level', results.processStability?.variationRisk || 'N/A'],
          [''],
          ['RISK ASSESSMENT'],
          ['Overall Risk Level', results.riskAssessment?.overallRisk || 'N/A'],
          ['Quality Risk Score (1-10)', results.riskAssessment?.qualityRisk || 'N/A'],
          ['Process Risk Score (1-10)', results.riskAssessment?.processRisk || 'N/A'],
          ['Equipment Risk Score (1-10)', results.riskAssessment?.equipmentRisk || 'N/A'],
          ['Material Risk Score (1-10)', results.riskAssessment?.materialRisk || 'N/A'],
          ['Risk Mitigation Priority', results.riskAssessment?.mitigationPriority || 'N/A'],
          [''],
          ['OPTIMIZATION RECOMMENDATIONS'],
          ['Category', 'Recommendation', 'Expected Improvement', 'Implementation Difficulty'],
          ...(results.optimizationRecommendations?.immediate || []).map((rec: any) => [
            'Immediate',
            rec.recommendation || rec,
            rec.expectedImprovement || 'N/A',
            rec.difficulty || 'Low'
          ]),
          ...(results.optimizationRecommendations?.shortTerm || []).map((rec: any) => [
            'Short Term',
            rec.recommendation || rec,
            rec.expectedImprovement || 'N/A',
            rec.difficulty || 'Medium'
          ]),
          ...(results.optimizationRecommendations?.longTerm || []).map((rec: any) => [
            'Long Term',
            rec.recommendation || rec,
            rec.expectedImprovement || 'N/A',
            rec.difficulty || 'High'
          ]),
          [''],
          ['QUALITY IMPROVEMENT SUMMARY'],
          ['Current Quality Level', results.qualityPrediction?.qualityClass || 'N/A'],
          ['Achievable Quality Level', results.optimizationSummary?.achievableQuality || 'N/A'],
          ['Quality Improvement Potential (%)', results.optimizationSummary?.improvementPotential?.toFixed(1) || 'N/A'],
          ['Parameter Optimization Priority', results.optimizationSummary?.optimizationPriority || 'N/A'],
          ['Expected Implementation Time', results.optimizationSummary?.implementationTime || 'N/A']
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edge-quality-prediction-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/edge-quality-predictor?${params.toString()}`;
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
  src="${window.location.origin}/calculator/edge-quality-predictor" 
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
                <li>• Complete edge quality prediction and analysis</li>
                <li>• Detailed edge characteristics and quality grading</li>
                <li>• Parameter analysis and optimization recommendations</li>
                <li>• Quality benchmark comparison and performance metrics</li>
                <li>• Process stability analysis and risk assessment</li>
                <li>• Quality improvement strategies and implementation guidance</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Edge Quality Prediction&body=Check out this edge quality analysis: ${shareUrl}`}
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

export default EdgeQualityPredictorExportTools;
