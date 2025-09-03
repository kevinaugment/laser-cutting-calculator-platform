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

interface JobQueueExportToolsProps {
  results: any;
}

const JobQueueExportTools: React.FC<JobQueueExportToolsProps> = ({ results }) => {
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
          calculationType: 'Job Queue Optimizer',
          timestamp: new Date().toISOString(),
          inputs: results.inputs || {},
          results: {
            optimizedSchedule: results.optimizedSchedule,
            performanceMetrics: results.performanceMetrics,
            resourceUtilization: results.resourceUtilization,
            costAnalysis: results.costAnalysis,
            riskAssessment: results.riskAssessment,
            optimizationInsights: results.optimizationInsights,
            alternativeSchedules: results.alternativeSchedules,
            realTimeAdjustments: results.realTimeAdjustments,
            customerImpact: results.customerImpact,
            alertsAndRecommendations: results.alertsAndRecommendations
          },
          metadata: {
            version: '1.0',
            optimizationObjectives: 'Multi-objective scheduling',
            algorithm: 'Priority-based heuristic'
          }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `job-queue-optimization-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // CSV/Excel format
        const csvData = [
          ['Job Queue Optimization Report'],
          ['Generated:', new Date().toLocaleString()],
          ['Algorithm:', 'Priority-based multi-objective optimization'],
          [''],
          ['OPTIMIZED SCHEDULE'],
          ['Job ID', 'Job Name', 'Machine', 'Start Time', 'End Time', 'Duration (min)', 'Setup (min)', 'Priority', 'Sequence'],
          ...(results.optimizedSchedule || []).map((job: any) => [
            job.jobId || 'N/A',
            job.jobName || 'N/A',
            job.assignedMachine || 'N/A',
            job.scheduledStart ? new Date(job.scheduledStart).toLocaleString() : 'N/A',
            job.scheduledEnd ? new Date(job.scheduledEnd).toLocaleString() : 'N/A',
            job.estimatedDuration || 'N/A',
            job.setupTime || 'N/A',
            job.priority || 'N/A',
            job.sequenceNumber || 'N/A'
          ]),
          [''],
          ['PERFORMANCE METRICS'],
          ['Total Makespan (hours)', results.performanceMetrics?.totalMakespan?.toFixed(1) || 'N/A'],
          ['Average Wait Time (hours)', results.performanceMetrics?.averageWaitTime?.toFixed(1) || 'N/A'],
          ['On-Time Delivery Rate (%)', results.performanceMetrics?.onTimeDeliveryRate?.toFixed(1) || 'N/A'],
          ['Total Tardiness (hours)', results.performanceMetrics?.totalTardiness?.toFixed(1) || 'N/A'],
          ['Throughput Rate (jobs/day)', results.performanceMetrics?.throughputRate?.toFixed(1) || 'N/A'],
          ['Average Flow Time (hours)', results.performanceMetrics?.averageFlowTime?.toFixed(1) || 'N/A'],
          [''],
          ['MACHINE UTILIZATION'],
          ['Machine ID', 'Utilization (%)', 'Status'],
          ...(results.performanceMetrics?.machineUtilization || []).map((machine: any) => [
            machine.machineId || 'N/A',
            machine.utilization?.toFixed(1) || 'N/A',
            machine.utilization > 90 ? 'High' : machine.utilization > 70 ? 'Normal' : 'Low'
          ]),
          [''],
          ['RESOURCE UTILIZATION'],
          ['Operator Utilization (%)', results.resourceUtilization?.operatorUtilization?.toFixed(1) || 'N/A'],
          [''],
          ['MACHINE EFFICIENCY'],
          ['Machine ID', 'Efficiency (%)', 'Bottleneck'],
          ...(results.resourceUtilization?.machineEfficiency || []).map((machine: any) => [
            machine.machineId || 'N/A',
            machine.efficiency?.toFixed(1) || 'N/A',
            machine.bottleneck ? 'Yes' : 'No'
          ]),
          [''],
          ['COST ANALYSIS'],
          ['Total Operating Cost ($)', results.costAnalysis?.totalOperatingCost?.toFixed(2) || 'N/A'],
          ['Overtime Cost ($)', results.costAnalysis?.overtimeCost?.toFixed(2) || 'N/A'],
          ['Setup Cost ($)', results.costAnalysis?.setupCost?.toFixed(2) || 'N/A'],
          ['Tardiness Penalty ($)', results.costAnalysis?.tardinessPenalty?.toFixed(2) || 'N/A'],
          ['Opportunity Cost ($)', results.costAnalysis?.opportunityCost?.toFixed(2) || 'N/A'],
          ['Profit Optimization ($)', results.costAnalysis?.profitOptimization?.toFixed(2) || 'N/A'],
          [''],
          ['COST BREAKDOWN'],
          ['Category', 'Amount ($)', 'Percentage (%)'],
          ...(results.costAnalysis?.costBreakdown || []).map((item: any) => [
            item.category || 'N/A',
            item.amount?.toFixed(2) || 'N/A',
            item.percentage?.toFixed(1) || 'N/A'
          ]),
          [''],
          ['RISK ASSESSMENT'],
          ['Schedule Risk Level', results.riskAssessment?.scheduleRisk || 'N/A'],
          ['Buffer Adequacy (%)', results.riskAssessment?.bufferAdequacy?.toFixed(1) || 'N/A'],
          [''],
          ['RISK FACTORS'],
          ...(results.riskAssessment?.riskFactors || []).map((factor: string) => ['Risk Factor', factor]),
          [''],
          ['CONTINGENCY PLANS'],
          ...(results.riskAssessment?.contingencyPlans || []).map((plan: string) => ['Contingency Plan', plan]),
          [''],
          ['OPTIMIZATION INSIGHTS'],
          ['Category', 'Recommendation'],
          ...(results.optimizationInsights?.improvementAreas || []).map((area: string) => ['Improvement Area', area]),
          ...(results.optimizationInsights?.bottleneckIdentification || []).map((bottleneck: string) => ['Bottleneck', bottleneck]),
          ...(results.optimizationInsights?.capacityRecommendations || []).map((rec: string) => ['Capacity Recommendation', rec]),
          ...(results.optimizationInsights?.processImprovements || []).map((improvement: string) => ['Process Improvement', improvement]),
          ...(results.optimizationInsights?.schedulingStrategies || []).map((strategy: string) => ['Scheduling Strategy', strategy]),
          [''],
          ['ALTERNATIVE SCHEDULES'],
          ['Scenario', 'Description', 'Makespan (hours)', 'On-Time Rate (%)', 'Total Cost ($)', 'Trade-offs'],
          ...(results.alternativeSchedules || []).map((scenario: any) => [
            scenario.scenarioName || 'N/A',
            scenario.description || 'N/A',
            scenario.makespan?.toFixed(1) || 'N/A',
            scenario.onTimeRate?.toFixed(1) || 'N/A',
            scenario.totalCost?.toFixed(0) || 'N/A',
            scenario.tradeoffs?.join('; ') || 'N/A'
          ]),
          [''],
          ['CUSTOMER IMPACT'],
          ['Customer Satisfaction Score', results.customerImpact?.customerSatisfactionScore?.toFixed(1) || 'N/A'],
          [''],
          ['DELIVERY PERFORMANCE'],
          ['Customer ID', 'On-Time Rate (%)', 'Satisfaction Score'],
          ...(results.customerImpact?.deliveryPerformance || []).map((perf: any) => [
            perf.customerId || 'N/A',
            perf.onTimeRate?.toFixed(1) || 'N/A',
            perf.satisfaction?.toFixed(1) || 'N/A'
          ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `job-queue-optimization-${timestamp}.${format}`;
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
    
    const url = `${window.location.origin}/calculator/job-queue-optimizer?${params.toString()}`;
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
  src="${window.location.origin}/calculator/job-queue-optimizer" 
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
                <li>• Complete optimized job schedule with timing and machine assignments</li>
                <li>• Performance metrics including makespan, utilization, and delivery rates</li>
                <li>• Resource utilization analysis and bottleneck identification</li>
                <li>• Cost analysis with breakdown and optimization opportunities</li>
                <li>• Risk assessment and contingency planning recommendations</li>
                <li>• Alternative scheduling scenarios and trade-off analysis</li>
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
                      onClick={() => window.location.href = `mailto:?subject=Job Queue Optimization Results&body=Check out this job queue optimization: ${shareUrl}`}
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

export default JobQueueExportTools;
