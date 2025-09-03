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

interface ProjectQuotingExportToolsProps {
  results: any;
}

const ProjectQuotingExportTools: React.FC<ProjectQuotingExportToolsProps> = ({ results }) => {
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
          calculationType: 'Project Quoting Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            projectCosts: results.projectCosts,
            pricingAnalysis: results.pricingAnalysis,
            competitiveAnalysis: results.competitiveAnalysis,
            profitabilityAnalysis: results.profitabilityAnalysis,
            riskAssessment: results.riskAssessment,
            recommendations: results.recommendations,
            quoteDetails: results.quoteDetails,
            alternativePricing: results.alternativePricing
          },
          metadata: {
            version: '1.0',
            currency: 'USD',
            quotingMethod: 'Cost-plus with competitive adjustment'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-quote-analysis-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Project Quote Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Quote Method:', 'Cost-plus with competitive adjustment'],
          [''],
          ['PROJECT OVERVIEW'],
          ['Project Name', results.inputs?.projectName || 'N/A'],
          ['Customer', results.inputs?.customerName || 'N/A'],
          ['Quote Date', results.inputs?.quoteDate || new Date().toLocaleDateString()],
          ['Validity Period (days)', results.inputs?.validityPeriod || 'N/A'],
          ['Project Type', results.inputs?.projectType || 'N/A'],
          ['Complexity Level', results.inputs?.complexityLevel || 'N/A'],
          [''],
          ['COST BREAKDOWN'],
          ['Direct Material Cost ($)', results.projectCosts?.directMaterialCost?.toFixed(2) || 'N/A'],
          ['Direct Labor Cost ($)', results.projectCosts?.directLaborCost?.toFixed(2) || 'N/A'],
          ['Machine Operating Cost ($)', results.projectCosts?.machineOperatingCost?.toFixed(2) || 'N/A'],
          ['Total Direct Costs ($)', results.projectCosts?.totalDirectCosts?.toFixed(2) || 'N/A'],
          ['Overhead Allocation ($)', results.projectCosts?.overheadAllocation?.toFixed(2) || 'N/A'],
          ['Total Project Cost ($)', results.projectCosts?.totalProjectCost?.toFixed(2) || 'N/A'],
          [''],
          ['PRICING ANALYSIS'],
          ['Base Quote Price ($)', results.pricingAnalysis?.baseQuotePrice?.toFixed(2) || 'N/A'],
          ['Target Profit Margin (%)', results.pricingAnalysis?.targetProfitMargin?.toFixed(1) || 'N/A'],
          ['Target Profit Amount ($)', results.pricingAnalysis?.targetProfitAmount?.toFixed(2) || 'N/A'],
          ['Risk Adjustment ($)', results.pricingAnalysis?.riskAdjustment?.toFixed(2) || 'N/A'],
          ['Contingency Amount ($)', results.pricingAnalysis?.contingencyAmount?.toFixed(2) || 'N/A'],
          ['Final Quote Price ($)', results.pricingAnalysis?.finalQuotePrice?.toFixed(2) || 'N/A'],
          [''],
          ['COMPETITIVE ANALYSIS'],
          ['Market Position', results.competitiveAnalysis?.marketPosition || 'N/A'],
          ['Competitive Adjustment (%)', results.competitiveAnalysis?.competitiveAdjustment?.toFixed(1) || 'N/A'],
          ['Adjusted Quote Price ($)', results.competitiveAnalysis?.adjustedQuotePrice?.toFixed(2) || 'N/A'],
          ['Win Probability (%)', results.competitiveAnalysis?.winProbability?.toFixed(1) || 'N/A'],
          [''],
          ['COMPETITIVE FACTORS'],
          ...(results.competitiveAnalysis?.competitiveFactors || []).map((factor: string) => ['Competitive Factor', factor]),
          [''],
          ['PROFITABILITY ANALYSIS'],
          ['Gross Profit ($)', results.profitabilityAnalysis?.grossProfit?.toFixed(2) || 'N/A'],
          ['Gross Margin (%)', results.profitabilityAnalysis?.grossMargin?.toFixed(1) || 'N/A'],
          ['Net Profit ($)', results.profitabilityAnalysis?.netProfit?.toFixed(2) || 'N/A'],
          ['Net Margin (%)', results.profitabilityAnalysis?.netMargin?.toFixed(1) || 'N/A'],
          ['ROI (%)', results.profitabilityAnalysis?.roi?.toFixed(1) || 'N/A'],
          ['Break-even Point ($)', results.profitabilityAnalysis?.breakEvenPoint?.toFixed(2) || 'N/A'],
          [''],
          ['PROFITABILITY METRICS'],
          ['Metric', 'Value', 'Industry Benchmark'],
          ...(results.profitabilityAnalysis?.profitabilityMetrics || []).map((metric: any) => [
            metric.name || 'N/A',
            metric.value || 'N/A',
            metric.benchmark || 'N/A'
          ]),
          [''],
          ['RISK ASSESSMENT'],
          ['Overall Risk Level', results.riskAssessment?.overallRiskLevel || 'N/A'],
          ['Risk Score (1-10)', results.riskAssessment?.riskScore?.toFixed(1) || 'N/A'],
          ['Risk Premium (%)', results.riskAssessment?.riskPremium?.toFixed(1) || 'N/A'],
          [''],
          ['RISK FACTORS'],
          ...(results.riskAssessment?.riskFactors || []).map((risk: any) => [
            risk.category || 'Risk Factor',
            risk.description || risk,
            risk.impact || 'N/A'
          ]),
          [''],
          ['MITIGATION STRATEGIES'],
          ...(results.riskAssessment?.mitigationStrategies || []).map((strategy: string) => ['Mitigation Strategy', strategy]),
          [''],
          ['QUOTE DETAILS'],
          ['Quote Number', results.quoteDetails?.quoteNumber || 'N/A'],
          ['Prepared By', results.quoteDetails?.preparedBy || 'N/A'],
          ['Approved By', results.quoteDetails?.approvedBy || 'N/A'],
          ['Terms and Conditions', results.quoteDetails?.termsAndConditions || 'Standard Terms'],
          ['Payment Terms', results.quoteDetails?.paymentTerms || 'N/A'],
          ['Delivery Schedule', results.quoteDetails?.deliverySchedule || 'N/A'],
          ['Warranty Period', results.quoteDetails?.warrantyPeriod || 'N/A'],
          [''],
          ['ALTERNATIVE PRICING OPTIONS'],
          ['Option', 'Description', 'Price ($)', 'Margin (%)', 'Notes'],
          ...(results.alternativePricing || []).map((option: any) => [
            option.optionName || 'N/A',
            option.description || 'N/A',
            option.price?.toFixed(2) || 'N/A',
            option.margin?.toFixed(1) || 'N/A',
            option.notes || 'N/A'
          ]),
          [''],
          ['RECOMMENDATIONS'],
          ['Category', 'Recommendation'],
          ...(results.recommendations?.pricing || []).map((rec: string) => ['Pricing', rec]),
          ...(results.recommendations?.competitive || []).map((rec: string) => ['Competitive', rec]),
          ...(results.recommendations?.risk || []).map((rec: string) => ['Risk Management', rec]),
          ...(results.recommendations?.negotiation || []).map((rec: string) => ['Negotiation', rec])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-quote-analysis-${timestamp}.${format}`;
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
          if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    const url = `${window.location.origin}/calculator/project-quoting?${params.toString()}`;
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
  src="${window.location.origin}/calculator/project-quoting" 
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
                <li>• Complete project cost breakdown and pricing analysis</li>
                <li>• Competitive analysis and market positioning insights</li>
                <li>• Profitability analysis with ROI and margin calculations</li>
                <li>• Risk assessment and mitigation strategies</li>
                <li>• Alternative pricing options and recommendations</li>
                <li>• Professional quote details ready for customer presentation</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Project Quote Analysis&body=Check out this project quote analysis: ${shareUrl}`}
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

export default ProjectQuotingExportTools;
