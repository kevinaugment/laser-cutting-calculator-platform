import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Download, FileText, Table, Share2, Copy, Check } from 'lucide-react';

interface CuttingTimeResults {
  totalCuttingTime: number;
  totalPierceTime: number;
  totalProcessTime: number;
  timeBreakdown: {
    cutting: number;
    piercing: number;
    positioning: number;
    setup: number;
  };
  efficiency: number;
  throughput: number;
  recommendations: string[];
  sensitivityAnalysis: {
    parameter: string;
    impact: number;
    suggestion: string;
  }[];
}

interface CuttingTimeExportToolsProps {
  results: CuttingTimeResults;
}

const CuttingTimeExportTools: React.FC<CuttingTimeExportToolsProps> = ({ results }) => {
  const [copied, setCopied] = useState(false);

  const formatTime = (minutes: number): string => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`;
    } else if (minutes < 60) {
      return `${minutes.toFixed(1)}min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h ${mins}min`;
    }
  };

  const generateCSVData = () => {
    const csvData = [
      ['Cutting Time Analysis Report', ''],
      ['Generated on', new Date().toLocaleDateString()],
      ['', ''],
      ['Time Results', ''],
      ['Total Process Time', formatTime(results.totalProcessTime)],
      ['Total Cutting Time', formatTime(results.totalCuttingTime)],
      ['Total Pierce Time', formatTime(results.totalPierceTime)],
      ['Process Efficiency', `${results.efficiency.toFixed(1)}%`],
      ['Throughput', `${results.throughput.toFixed(1)} parts/hour`],
      ['', ''],
      ['Time Breakdown', ''],
      ['Cutting Time', formatTime(results.timeBreakdown.cutting)],
      ['Pierce Time', formatTime(results.timeBreakdown.piercing)],
      ['Positioning Time', formatTime(results.timeBreakdown.positioning)],
      ['Setup Time', formatTime(results.timeBreakdown.setup)],
      ['', ''],
      ['Recommendations', ''],
      ...results.recommendations.map(rec => ['', rec]),
      ['', ''],
      ['Sensitivity Analysis', ''],
      ['Parameter', 'Impact', 'Suggestion'],
      ...results.sensitivityAnalysis.map(analysis => [
        analysis.parameter,
        `${analysis.impact > 0 ? '+' : ''}${(analysis.impact * 100).toFixed(1)}%`,
        analysis.suggestion
      ])
    ];

    return csvData.map(row => row.join(',')).join('\n');
  };

  const generateTextSummary = () => {
    return `CUTTING TIME ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

SUMMARY RESULTS:
• Total Process Time: ${formatTime(results.totalProcessTime)}
• Cutting Time: ${formatTime(results.totalCuttingTime)}
• Process Efficiency: ${results.efficiency.toFixed(1)}%
• Throughput: ${results.throughput.toFixed(1)} parts/hour

TIME BREAKDOWN:
• Cutting: ${formatTime(results.timeBreakdown.cutting)} (${((results.timeBreakdown.cutting / results.totalProcessTime) * 100).toFixed(1)}%)
• Piercing: ${formatTime(results.timeBreakdown.piercing)} (${((results.timeBreakdown.piercing / results.totalProcessTime) * 100).toFixed(1)}%)
• Positioning: ${formatTime(results.timeBreakdown.positioning)} (${((results.timeBreakdown.positioning / results.totalProcessTime) * 100).toFixed(1)}%)
• Setup: ${formatTime(results.timeBreakdown.setup)} (${((results.timeBreakdown.setup / results.totalProcessTime) * 100).toFixed(1)}%)

OPTIMIZATION RECOMMENDATIONS:
${results.recommendations.map(rec => `• ${rec}`).join('\n')}

SENSITIVITY ANALYSIS:
${results.sensitivityAnalysis.map(analysis => 
  `• ${analysis.parameter}: ${analysis.impact > 0 ? '+' : ''}${(analysis.impact * 100).toFixed(1)}% - ${analysis.suggestion}`
).join('\n')}`;
  };

  const downloadCSV = () => {
    const csvContent = generateCSVData();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cutting-time-analysis-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    // In a real implementation, you would use a PDF library like jsPDF
    alert('PDF export functionality would be implemented with a PDF library like jsPDF');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateTextSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Cutting Time Analysis Results',
        text: generateTextSummary(),
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-green-600" />
          Export & Share Results
        </CardTitle>
        <p className="text-sm text-gray-600">
          Export your cutting time analysis for reporting and documentation
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Export Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={downloadCSV}
              variant="outline"
              className="flex items-center gap-2 h-auto p-3"
            >
              <Table className="h-4 w-4 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Export to CSV</div>
                <div className="text-xs text-gray-500">Spreadsheet format</div>
              </div>
            </Button>

            <Button
              onClick={downloadPDF}
              variant="outline"
              className="flex items-center gap-2 h-auto p-3"
            >
              <FileText className="h-4 w-4 text-red-600" />
              <div className="text-left">
                <div className="font-medium">Export to PDF</div>
                <div className="text-xs text-gray-500">Professional report</div>
              </div>
            </Button>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center gap-2 h-auto p-3"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-blue-600" />
              )}
              <div className="text-left">
                <div className="font-medium">
                  {copied ? 'Copied!' : 'Copy Summary'}
                </div>
                <div className="text-xs text-gray-500">Text format</div>
              </div>
            </Button>

            <Button
              onClick={shareResults}
              variant="outline"
              className="flex items-center gap-2 h-auto p-3"
            >
              <Share2 className="h-4 w-4 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Share Results</div>
                <div className="text-xs text-gray-500">Send to team</div>
              </div>
            </Button>
          </div>

          {/* Quick Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Process Time:</span>
                <span className="ml-2 font-medium">{formatTime(results.totalProcessTime)}</span>
              </div>
              <div>
                <span className="text-gray-600">Efficiency:</span>
                <span className="ml-2 font-medium">{results.efficiency.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Throughput:</span>
                <span className="ml-2 font-medium">{results.throughput.toFixed(1)} parts/hr</span>
              </div>
              <div>
                <span className="text-gray-600">Recommendations:</span>
                <span className="ml-2 font-medium">{results.recommendations.length}</span>
              </div>
            </div>
          </div>

          {/* Export Features */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Export Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">CSV</Badge>
                <span>Detailed data for analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">PDF</Badge>
                <span>Professional report format</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Copy</Badge>
                <span>Quick text summary</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Share</Badge>
                <span>Team collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CuttingTimeExportTools;
