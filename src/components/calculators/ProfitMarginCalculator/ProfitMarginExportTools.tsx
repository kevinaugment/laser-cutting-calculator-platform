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

interface ProfitMarginExportToolsProps {
  results: any;
}

const ProfitMarginExportTools: React.FC<ProfitMarginExportToolsProps> = ({ results }) => {
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
          calculationType: 'Profit Margin Calculator',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            marginAnalysis: results.marginAnalysis,
            profitabilityMetrics: results.profitabilityMetrics,
            costAnalysis: results.costAnalysis,
            benchmarkComparison: results.benchmarkComparison,
            scenarioAnalysis: results.scenarioAnalysis,
            trendAnalysis: results.trendAnalysis,
            strategicRecommendations: results.strategicRecommendations,
            alertsAndRecommendations: results.alertsAndRecommendations
          },
          metadata: {
            version: '1.0',
            currency: 'USD',
            analysisMethod: 'Comprehensive profitability analysis'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profit-margin-analysis-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Profit Margin Analysis Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Analysis Method:', 'Comprehensive profitability analysis'],
          [''],
          ['MARGIN ANALYSIS'],
          ['Gross Margin Amount ($)', results.marginAnalysis?.grossMargin?.amount?.toFixed(2) || 'N/A'],
          ['Gross Margin Percentage (%)', results.marginAnalysis?.grossMargin?.percentage?.toFixed(1) || 'N/A'],
          ['Operating Margin Amount ($)', results.marginAnalysis?.operatingMargin?.amount?.toFixed(2) || 'N/A'],
          ['Operating Margin Percentage (%)', results.marginAnalysis?.operatingMargin?.percentage?.toFixed(1) || 'N/A'],
          ['Net Margin Amount ($)', results.marginAnalysis?.netMargin?.amount?.toFixed(2) || 'N/A'],
          ['Net Margin Percentage (%)', results.marginAnalysis?.netMargin?.percentage?.toFixed(1) || 'N/A'],
          ['Contribution Margin Amount ($)', results.marginAnalysis?.contributionMargin?.amount?.toFixed(2) || 'N/A'],
          ['Contribution Margin Percentage (%)', results.marginAnalysis?.contributionMargin?.percentage?.toFixed(1) || 'N/A'],
          ['EBITDA Margin Amount ($)', results.marginAnalysis?.ebitdaMargin?.amount?.toFixed(2) || 'N/A'],
          ['EBITDA Margin Percentage (%)', results.marginAnalysis?.ebitdaMargin?.percentage?.toFixed(1) || 'N/A'],
          [''],
          ['MARGIN TRENDS'],
          ['Period', 'Gross Margin (%)', 'Net Margin (%)'],
          ...(results.marginAnalysis?.marginTrends || []).map((trend: any) => [
            trend.period || 'N/A',
            trend.grossMargin?.toFixed(1) || 'N/A',
            trend.netMargin?.toFixed(1) || 'N/A'
          ]),
          [''],
          ['PROFITABILITY METRICS'],
          ['Return on Investment (%)', results.profitabilityMetrics?.roi?.toFixed(1) || 'N/A'],
          ['Return on Assets (%)', results.profitabilityMetrics?.roa?.toFixed(1) || 'N/A'],
          ['Return on Equity (%)', results.profitabilityMetrics?.roe?.toFixed(1) || 'N/A'],
          ['Asset Turnover Ratio', results.profitabilityMetrics?.assetTurnover?.toFixed(2) || 'N/A'],
          ['Profit per Employee ($)', results.profitabilityMetrics?.profitPerEmployee?.toFixed(2) || 'N/A'],
          ['Revenue per Employee ($)', results.profitabilityMetrics?.revenuePerEmployee?.toFixed(2) || 'N/A'],
          [''],
          ['COST ANALYSIS'],
          ['Total Direct Costs ($)', results.costAnalysis?.totalDirectCosts?.toFixed(2) || 'N/A'],
          ['Total Indirect Costs ($)', results.costAnalysis?.totalIndirectCosts?.toFixed(2) || 'N/A'],
          ['Fixed Costs ($)', results.costAnalysis?.fixedCosts?.toFixed(2) || 'N/A'],
          ['Variable Costs ($)', results.costAnalysis?.variableCosts?.toFixed(2) || 'N/A'],
          ['Cost per Unit ($)', results.costAnalysis?.costPerUnit?.toFixed(2) || 'N/A'],
          ['Break-even Point (units)', results.costAnalysis?.breakEvenUnits?.toFixed(0) || 'N/A'],
          ['Break-even Revenue ($)', results.costAnalysis?.breakEvenRevenue?.toFixed(2) || 'N/A'],
          [''],
          ['COST BREAKDOWN'],
          ['Category', 'Amount ($)', 'Percentage (%)'],
          ...(results.costAnalysis?.costBreakdown || []).map((cost: any) => [
            cost.category || 'N/A',
            cost.amount?.toFixed(2) || 'N/A',
            cost.percentage?.toFixed(1) || 'N/A'
          ]),
          [''],
          ['BENCHMARK COMPARISON'],
          ['Industry Average Gross Margin (%)', results.benchmarkComparison?.industryAverageMargins?.gross?.toFixed(1) || 'N/A'],
          ['Industry Average Operating Margin (%)', results.benchmarkComparison?.industryAverageMargins?.operating?.toFixed(1) || 'N/A'],
          ['Industry Average Net Margin (%)', results.benchmarkComparison?.industryAverageMargins?.net?.toFixed(1) || 'N/A'],
          ['Competitive Position', results.benchmarkComparison?.competitivePosition || 'N/A'],
          ['Gross Margin Gap (%)', results.benchmarkComparison?.marginGap?.gross?.toFixed(1) || 'N/A'],
          ['Operating Margin Gap (%)', results.benchmarkComparison?.marginGap?.operating?.toFixed(1) || 'N/A'],
          ['Net Margin Gap (%)', results.benchmarkComparison?.marginGap?.net?.toFixed(1) || 'N/A'],
          ['Performance Rating (1-10)', results.benchmarkComparison?.performanceRating?.toFixed(1) || 'N/A'],
          [''],
          ['SCENARIO ANALYSIS'],
          ['Base Case Revenue ($)', results.scenarioAnalysis?.baseCase?.revenue?.toFixed(2) || 'N/A'],
          ['Base Case Margin (%)', results.scenarioAnalysis?.baseCase?.margin?.toFixed(1) || 'N/A'],
          ['Base Case Profit ($)', results.scenarioAnalysis?.baseCase?.profit?.toFixed(2) || 'N/A'],
          ['Optimistic Case Revenue ($)', results.scenarioAnalysis?.optimisticCase?.revenue?.toFixed(2) || 'N/A'],
          ['Optimistic Case Margin (%)', results.scenarioAnalysis?.optimisticCase?.margin?.toFixed(1) || 'N/A'],
          ['Optimistic Case Profit ($)', results.scenarioAnalysis?.optimisticCase?.profit?.toFixed(2) || 'N/A'],
          ['Pessimistic Case Revenue ($)', results.scenarioAnalysis?.pessimisticCase?.revenue?.toFixed(2) || 'N/A'],
          ['Pessimistic Case Margin (%)', results.scenarioAnalysis?.pessimisticCase?.margin?.toFixed(1) || 'N/A'],
          ['Pessimistic Case Profit ($)', results.scenarioAnalysis?.pessimisticCase?.profit?.toFixed(2) || 'N/A'],
          ['Break-even Revenue ($)', results.scenarioAnalysis?.breakEvenAnalysis?.breakEvenRevenue?.toFixed(2) || 'N/A'],
          ['Margin of Safety (%)', results.scenarioAnalysis?.breakEvenAnalysis?.marginOfSafety?.toFixed(1) || 'N/A'],
          ['Operating Leverage', results.scenarioAnalysis?.breakEvenAnalysis?.operatingLeverage?.toFixed(1) || 'N/A'],
          [''],
          ['TREND ANALYSIS'],
          ['Revenue Growth Rate (%)', results.trendAnalysis?.revenueGrowthRate?.toFixed(1) || 'N/A'],
          ['Margin Trend', results.trendAnalysis?.marginTrend || 'N/A'],
          ['Cost Trend', results.trendAnalysis?.costTrend || 'N/A'],
          ['Profitability Outlook', results.trendAnalysis?.profitabilityOutlook || 'N/A'],
          [''],
          ['STRATEGIC RECOMMENDATIONS'],
          ['Category', 'Recommendation'],
          ...(results.strategicRecommendations?.marginOptimization || []).map((rec: string) => ['Margin Optimization', rec]),
          ...(results.strategicRecommendations?.costManagement || []).map((rec: string) => ['Cost Management', rec]),
          ...(results.strategicRecommendations?.revenueGrowth || []).map((rec: string) => ['Revenue Growth', rec]),
          ...(results.strategicRecommendations?.operationalExcellence || []).map((rec: string) => ['Operational Excellence', rec]),
          ...(results.strategicRecommendations?.riskMitigation || []).map((rec: string) => ['Risk Mitigation', rec]),
          [''],
          ['ALERTS AND RECOMMENDATIONS'],
          ['Alert Type', 'Description'],
          ...(results.alertsAndRecommendations?.marginAlerts || []).map((alert: string) => ['Margin Alert', alert]),
          ...(results.alertsAndRecommendations?.profitabilityWarnings || []).map((warning: string) => ['Profitability Warning', warning]),
          ...(results.alertsAndRecommendations?.costOptimizationAlerts || []).map((alert: string) => ['Cost Optimization Alert', alert]),
          ...(results.alertsAndRecommendations?.strategicInsights || []).map((insight: string) => ['Strategic Insight', insight]),
          ...(results.alertsAndRecommendations?.actionItems || []).map((item: string) => ['Action Item', item])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profit-margin-analysis-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/profit-margin?${params.toString()}`;
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
  src="${window.location.origin}/calculator/profit-margin" 
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
                <li>• Complete profit margin analysis with all key metrics</li>
                <li>• Profitability metrics including ROI, ROA, and efficiency ratios</li>
                <li>• Detailed cost analysis and breakdown by category</li>
                <li>• Industry benchmark comparison and competitive positioning</li>
                <li>• Scenario analysis with optimistic, base, and pessimistic cases</li>
                <li>• Strategic recommendations and actionable insights</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Profit Margin Analysis&body=Check out this profit margin analysis: ${shareUrl}`}
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

export default ProfitMarginExportTools;
