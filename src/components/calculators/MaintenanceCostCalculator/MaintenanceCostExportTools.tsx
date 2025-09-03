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

interface MaintenanceCostExportToolsProps {
  results: any;
}

const MaintenanceCostExportTools: React.FC<MaintenanceCostExportToolsProps> = ({ results }) => {
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
          calculationType: 'Maintenance Cost Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            totalAnnualCost: results.totalAnnualCost,
            costBreakdown: results.costBreakdown,
            costPerHour: results.costPerHour,
            maintenanceMetrics: results.maintenanceMetrics,
            benchmarkComparison: results.benchmarkComparison,
            optimizationRecommendations: results.optimizationRecommendations,
            lifecycleCostAnalysis: results.lifecycleCostAnalysis,
            riskAssessment: results.riskAssessment
          },
          metadata: {
            version: '1.0',
            units: 'USD',
            equipmentType: results.inputs?.equipmentType || 'N/A'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maintenance-cost-analysis-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Maintenance Cost Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Equipment Type:', results.inputs?.equipmentType || 'N/A'],
          [''],
          ['INPUT PARAMETERS'],
          ['Equipment Value ($)', results.inputs?.equipmentValue || 'N/A'],
          ['Equipment Age (years)', results.inputs?.equipmentAge || 'N/A'],
          ['Operating Hours (hrs/year)', results.inputs?.operatingHours || 'N/A'],
          ['Labor Rate ($/hr)', results.inputs?.laborRate || 'N/A'],
          ['Downtime Cost Rate ($/hr)', results.inputs?.downtimeRate || 'N/A'],
          ['Planned Maintenance Hours (hrs/year)', results.inputs?.plannedMaintenanceHours || 'N/A'],
          ['Unplanned Downtime Hours (hrs/year)', results.inputs?.unplannedDowntimeHours || 'N/A'],
          ['Maintenance Team Size', results.inputs?.maintenanceTeamSize || 'N/A'],
          ['Parts Cost Factor (%)', results.inputs?.partsCostFactor || 'N/A'],
          [''],
          ['MAINTENANCE COST RESULTS'],
          ['Total Annual Maintenance Cost ($)', results.totalAnnualCost?.toFixed(2) || 'N/A'],
          ['Maintenance Cost per Operating Hour ($/hr)', results.costPerHour?.toFixed(2) || 'N/A'],
          ['Maintenance Cost as % of Equipment Value (%)', results.maintenancePercentage?.toFixed(1) || 'N/A'],
          [''],
          ['COST BREAKDOWN'],
          ['Category', 'Annual Cost ($)', 'Percentage (%)', 'Cost per Hour ($/hr)'],
          ...(results.costBreakdown || []).map((cost: any) => [
            cost.category || 'N/A',
            cost.annualCost?.toFixed(2) || 'N/A',
            cost.percentage?.toFixed(1) || 'N/A',
            cost.costPerHour?.toFixed(2) || 'N/A'
          ]),
          [''],
          ['MAINTENANCE METRICS'],
          ['Metric', 'Value', 'Unit', 'Industry Benchmark'],
          ...(results.maintenanceMetrics || []).map((metric: any) => [
            metric.name || 'N/A',
            metric.value?.toFixed(2) || 'N/A',
            metric.unit || 'N/A',
            metric.benchmark || 'N/A'
          ]),
          [''],
          ['BENCHMARK COMPARISON'],
          ['Industry Average Cost (% of equipment value)', results.benchmarkComparison?.industryAverage?.toFixed(1) || 'N/A'],
          ['Best Practice Cost (% of equipment value)', results.benchmarkComparison?.bestPractice?.toFixed(1) || 'N/A'],
          ['Your Performance vs Average (%)', results.benchmarkComparison?.vsAverage?.toFixed(1) || 'N/A'],
          ['Your Performance vs Best Practice (%)', results.benchmarkComparison?.vsBestPractice?.toFixed(1) || 'N/A'],
          ['Performance Rating', results.benchmarkComparison?.performanceRating || 'N/A'],
          ['Cost Reduction Potential ($)', results.benchmarkComparison?.costReductionPotential?.toFixed(2) || 'N/A'],
          [''],
          ['LIFECYCLE COST ANALYSIS'],
          ['Equipment Remaining Life (years)', results.lifecycleCostAnalysis?.remainingLife || 'N/A'],
          ['Total Remaining Maintenance Cost ($)', results.lifecycleCostAnalysis?.totalRemainingCost?.toFixed(2) || 'N/A'],
          ['Annual Cost Escalation Rate (%)', results.lifecycleCostAnalysis?.escalationRate?.toFixed(1) || 'N/A'],
          ['Replacement Threshold Cost ($)', results.lifecycleCostAnalysis?.replacementThreshold?.toFixed(2) || 'N/A'],
          ['Years to Replacement Threshold', results.lifecycleCostAnalysis?.yearsToThreshold || 'N/A'],
          [''],
          ['RISK ASSESSMENT'],
          ['Overall Risk Level', results.riskAssessment?.overallRisk || 'N/A'],
          ['Financial Risk Score (1-10)', results.riskAssessment?.financialRisk || 'N/A'],
          ['Operational Risk Score (1-10)', results.riskAssessment?.operationalRisk || 'N/A'],
          ['Reliability Risk Score (1-10)', results.riskAssessment?.reliabilityRisk || 'N/A'],
          ['Risk Mitigation Priority', results.riskAssessment?.mitigationPriority || 'N/A'],
          [''],
          ['OPTIMIZATION RECOMMENDATIONS'],
          ['Category', 'Recommendation', 'Potential Savings ($)', 'Implementation Timeline'],
          ...(results.optimizationRecommendations?.immediate || []).map((rec: any) => [
            'Immediate (0-3 months)',
            rec.recommendation || rec,
            rec.potentialSavings?.toFixed(2) || 'N/A',
            rec.timeline || '0-3 months'
          ]),
          ...(results.optimizationRecommendations?.shortTerm || []).map((rec: any) => [
            'Short Term (3-12 months)',
            rec.recommendation || rec,
            rec.potentialSavings?.toFixed(2) || 'N/A',
            rec.timeline || '3-12 months'
          ]),
          ...(results.optimizationRecommendations?.longTerm || []).map((rec: any) => [
            'Long Term (1-3 years)',
            rec.recommendation || rec,
            rec.potentialSavings?.toFixed(2) || 'N/A',
            rec.timeline || '1-3 years'
          ]),
          [''],
          ['COST OPTIMIZATION SUMMARY'],
          ['Total Potential Annual Savings ($)', results.optimizationSummary?.totalPotentialSavings?.toFixed(2) || 'N/A'],
          ['Payback Period (months)', results.optimizationSummary?.paybackPeriod || 'N/A'],
          ['ROI on Optimization Efforts (%)', results.optimizationSummary?.roi?.toFixed(1) || 'N/A'],
          ['Implementation Cost ($)', results.optimizationSummary?.implementationCost?.toFixed(2) || 'N/A'],
          ['Net Annual Benefit ($)', results.optimizationSummary?.netAnnualBenefit?.toFixed(2) || 'N/A']
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maintenance-cost-analysis-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/maintenance-cost?${params.toString()}`;
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
  src="${window.location.origin}/calculator/maintenance-cost" 
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
                <li>• Complete maintenance cost analysis and breakdown</li>
                <li>• Performance metrics and industry benchmarking</li>
                <li>• Lifecycle cost analysis and replacement planning</li>
                <li>• Risk assessment and mitigation strategies</li>
                <li>• Detailed optimization recommendations with ROI analysis</li>
                <li>• Cost reduction potential and implementation timeline</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Maintenance Cost Analysis&body=Check out this maintenance cost analysis: ${shareUrl}`}
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

export default MaintenanceCostExportTools;
