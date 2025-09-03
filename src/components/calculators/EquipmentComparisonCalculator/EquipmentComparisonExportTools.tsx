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

interface EquipmentComparisonExportToolsProps {
  results: any;
}

const EquipmentComparisonExportTools: React.FC<EquipmentComparisonExportToolsProps> = ({ results }) => {
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
          calculationType: 'Equipment Comparison Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            comparisonResults: results.comparisonResults,
            tcoAnalysis: results.tcoAnalysis,
            roiAnalysis: results.roiAnalysis,
            scoringMatrix: results.scoringMatrix,
            recommendations: results.recommendations,
            riskAssessment: results.riskAssessment,
            financialSummary: results.financialSummary,
            technicalComparison: results.technicalComparison
          },
          metadata: {
            version: '1.0',
            currency: 'USD',
            analysisType: results.inputs?.analysisType || 'N/A'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `equipment-comparison-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Equipment Comparison Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Analysis Type:', results.inputs?.analysisType || 'N/A'],
          [''],
          ['EQUIPMENT COMPARISON SUMMARY'],
          ['Equipment', 'Overall Score', 'TCO ($)', 'ROI (%)', 'Payback (years)', 'Recommendation'],
          ...(results.comparisonResults || []).map((equipment: any) => [
            equipment.name || 'N/A',
            equipment.overallScore?.toFixed(1) || 'N/A',
            equipment.tco?.toFixed(0) || 'N/A',
            equipment.roi?.toFixed(1) || 'N/A',
            equipment.paybackPeriod?.toFixed(1) || 'N/A',
            equipment.recommendation || 'N/A'
          ]),
          [''],
          ['TOTAL COST OF OWNERSHIP ANALYSIS'],
          ['Equipment', 'Purchase Price ($)', 'Annual Operating ($)', '10-Year TCO ($)', 'Cost per Hour ($/hr)'],
          ...(results.tcoAnalysis || []).map((tco: any) => [
            tco.equipmentName || 'N/A',
            tco.purchasePrice?.toFixed(0) || 'N/A',
            tco.annualOperating?.toFixed(0) || 'N/A',
            tco.totalTCO?.toFixed(0) || 'N/A',
            tco.costPerHour?.toFixed(2) || 'N/A'
          ]),
          [''],
          ['TCO BREAKDOWN BY CATEGORY'],
          ['Equipment', 'Purchase (%)', 'Energy (%)', 'Maintenance (%)', 'Labor (%)', 'Consumables (%)'],
          ...(results.tcoAnalysis || []).map((tco: any) => [
            tco.equipmentName || 'N/A',
            tco.purchasePercentage?.toFixed(1) || 'N/A',
            tco.energyPercentage?.toFixed(1) || 'N/A',
            tco.maintenancePercentage?.toFixed(1) || 'N/A',
            tco.laborPercentage?.toFixed(1) || 'N/A',
            tco.consumablesPercentage?.toFixed(1) || 'N/A'
          ]),
          [''],
          ['ROI AND PAYBACK ANALYSIS'],
          ['Equipment', 'Initial Investment ($)', 'Annual Savings ($)', 'ROI (%)', 'Payback Period (years)', 'NPV ($)'],
          ...(results.roiAnalysis || []).map((roi: any) => [
            roi.equipmentName || 'N/A',
            roi.initialInvestment?.toFixed(0) || 'N/A',
            roi.annualSavings?.toFixed(0) || 'N/A',
            roi.roi?.toFixed(1) || 'N/A',
            roi.paybackPeriod?.toFixed(1) || 'N/A',
            roi.npv?.toFixed(0) || 'N/A'
          ]),
          [''],
          ['SCORING MATRIX'],
          ['Criteria', 'Weight (%)', ...((results.scoringMatrix && results.scoringMatrix[0]) ? Object.keys(results.scoringMatrix[0]).filter(key => key !== 'criteria' && key !== 'weight') : [])],
          ...(results.scoringMatrix || []).map((score: any) => [
            score.criteria || 'N/A',
            score.weight?.toFixed(1) || 'N/A',
            ...Object.entries(score).filter(([key]) => key !== 'criteria' && key !== 'weight').map(([, value]: [string, any]) => 
              typeof value === 'number' ? value.toFixed(1) : (value || 'N/A')
            )
          ]),
          [''],
          ['TECHNICAL COMPARISON'],
          ['Specification', ...((results.technicalComparison && results.technicalComparison[0]) ? Object.keys(results.technicalComparison[0]).filter(key => key !== 'specification') : [])],
          ...(results.technicalComparison || []).map((spec: any) => [
            spec.specification || 'N/A',
            ...Object.entries(spec).filter(([key]) => key !== 'specification').map(([, value]: [string, any]) => value || 'N/A')
          ]),
          [''],
          ['RISK ASSESSMENT'],
          ['Equipment', 'Technical Risk', 'Financial Risk', 'Vendor Risk', 'Overall Risk', 'Mitigation Priority'],
          ...(results.riskAssessment || []).map((risk: any) => [
            risk.equipmentName || 'N/A',
            risk.technicalRisk || 'N/A',
            risk.financialRisk || 'N/A',
            risk.vendorRisk || 'N/A',
            risk.overallRisk || 'N/A',
            risk.mitigationPriority || 'N/A'
          ]),
          [''],
          ['RECOMMENDATIONS'],
          ['Priority', 'Equipment', 'Recommendation', 'Rationale', 'Next Steps'],
          ...(results.recommendations || []).map((rec: any, index: number) => [
            `${index + 1}`,
            rec.equipmentName || 'N/A',
            rec.recommendation || 'N/A',
            rec.rationale || 'N/A',
            rec.nextSteps || 'N/A'
          ]),
          [''],
          ['FINANCIAL SUMMARY'],
          ['Metric', 'Best Option', 'Value', 'Comparison vs Alternatives'],
          ['Lowest TCO', results.financialSummary?.lowestTCO?.equipment || 'N/A', 
           results.financialSummary?.lowestTCO?.value?.toFixed(0) || 'N/A',
           results.financialSummary?.lowestTCO?.advantage || 'N/A'],
          ['Highest ROI', results.financialSummary?.highestROI?.equipment || 'N/A',
           results.financialSummary?.highestROI?.value?.toFixed(1) || 'N/A',
           results.financialSummary?.highestROI?.advantage || 'N/A'],
          ['Shortest Payback', results.financialSummary?.shortestPayback?.equipment || 'N/A',
           results.financialSummary?.shortestPayback?.value?.toFixed(1) || 'N/A',
           results.financialSummary?.shortestPayback?.advantage || 'N/A'],
          ['Best Overall Score', results.financialSummary?.bestOverall?.equipment || 'N/A',
           results.financialSummary?.bestOverall?.value?.toFixed(1) || 'N/A',
           results.financialSummary?.bestOverall?.advantage || 'N/A']
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `equipment-comparison-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/equipment-comparison?${params.toString()}`;
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
  src="${window.location.origin}/calculator/equipment-comparison" 
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
                <li>• Complete equipment comparison analysis and scoring</li>
                <li>• Detailed TCO breakdown and cost analysis</li>
                <li>• ROI analysis and payback calculations</li>
                <li>• Technical specification comparison matrix</li>
                <li>• Risk assessment and mitigation strategies</li>
                <li>• Investment recommendations and next steps</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Equipment Comparison Analysis&body=Check out this equipment comparison analysis: ${shareUrl}`}
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

export default EquipmentComparisonExportTools;
