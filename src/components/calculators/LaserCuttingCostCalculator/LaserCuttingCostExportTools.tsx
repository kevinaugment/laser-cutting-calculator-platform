import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  Download,
  FileText,
  Share2,
  Code,
  Mail,
  Copy,
  CheckCircle,
  Printer,
  FileSpreadsheet,
  FileImage,
  Link,
  QrCode,
  Settings,
  Calendar,
  User
} from 'lucide-react';

interface LaserCuttingCostExportToolsProps {
  results: any;
}

const LaserCuttingCostExportTools: React.FC<LaserCuttingCostExportToolsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async (format: 'csv' | 'excel' | 'json') => {
    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const reportData = {
        metadata: {
          title: 'Laser Cutting Cost Analysis Report',
          generatedOn: new Date().toLocaleDateString(),
          generatedAt: new Date().toLocaleTimeString(),
          version: '1.0',
          calculator: 'Laser Cutting Cost Calculator'
        },
        summary: {
          totalCost: results.totalCost?.toFixed(2) || '0.00',
          costPerPiece: results.costPerPiece?.toFixed(2) || '0.00',
          totalPieces: results.quantity || 1,
          costPerSquareMeter: results.profitabilityAnalysis?.costPerSquareMeter?.toFixed(2) || '0.00'
        },
        costBreakdown: {
          material: {
            cost: results.materialCost?.toFixed(2) || '0.00',
            percentage: results.costBreakdown?.material?.toFixed(1) || '0.0'
          },
          energy: {
            cost: results.energyCost?.toFixed(2) || '0.00',
            percentage: results.costBreakdown?.energy?.toFixed(1) || '0.0'
          },
          gas: {
            cost: results.gasCost?.toFixed(2) || '0.00',
            percentage: results.costBreakdown?.gas?.toFixed(1) || '0.0'
          },
          labor: {
            cost: results.laborCost?.toFixed(2) || '0.00',
            percentage: results.costBreakdown?.labor?.toFixed(1) || '0.0'
          },
          machine: {
            cost: results.machineCost?.toFixed(2) || '0.00',
            percentage: results.costBreakdown?.machine?.toFixed(1) || '0.0'
          },
          setup: {
            cost: results.setupCost?.toFixed(2) || '0.00',
            percentage: results.costBreakdown?.setup?.toFixed(1) || '0.0'
          }
        },
        efficiency: {
          materialUtilization: results.profitabilityAnalysis?.materialUtilization?.toFixed(1) || '0.0',
          timeEfficiency: results.profitabilityAnalysis?.timeEfficiency?.toFixed(1) || '0.0',
          energyEfficiency: results.profitabilityAnalysis?.energyEfficiency?.toFixed(1) || '0.0'
        },
        recommendations: results.recommendations || []
      };

      if (format === 'json') {
        const jsonContent = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laser-cutting-cost-data-${timestamp}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Create CSV data
        const csvData = [
          ['Laser Cutting Cost Analysis Report'],
          ['Generated on:', reportData.metadata.generatedOn],
          ['Generated at:', reportData.metadata.generatedAt],
          [''],
          ['COST SUMMARY'],
          ['Total Cost', `$${reportData.summary.totalCost}`],
          ['Cost per Piece', `$${reportData.summary.costPerPiece}`],
          ['Total Pieces', reportData.summary.totalPieces],
          ['Cost per m²', `$${reportData.summary.costPerSquareMeter}`],
          [''],
          ['COST BREAKDOWN'],
          ['Component', 'Cost', 'Percentage'],
          ['Material', `$${reportData.costBreakdown.material.cost}`, `${reportData.costBreakdown.material.percentage}%`],
          ['Energy', `$${reportData.costBreakdown.energy.cost}`, `${reportData.costBreakdown.energy.percentage}%`],
          ['Gas', `$${reportData.costBreakdown.gas.cost}`, `${reportData.costBreakdown.gas.percentage}%`],
          ['Labor', `$${reportData.costBreakdown.labor.cost}`, `${reportData.costBreakdown.labor.percentage}%`],
          ['Machine', `$${reportData.costBreakdown.machine.cost}`, `${reportData.costBreakdown.machine.percentage}%`],
          ['Setup', `$${reportData.costBreakdown.setup.cost}`, `${reportData.costBreakdown.setup.percentage}%`],
          [''],
          ['EFFICIENCY ANALYSIS'],
          ['Material Utilization', `${reportData.efficiency.materialUtilization}%`],
          ['Time Efficiency', `${reportData.efficiency.timeEfficiency}%`],
          ['Energy Efficiency', `${reportData.efficiency.energyEfficiency}%`],
          [''],
          ['RECOMMENDATIONS'],
          ...reportData.recommendations.map((rec: string) => [rec])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laser-cutting-cost-analysis-${timestamp}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    // Create a simple HTML report for PDF generation
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laser Cutting Cost Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .cost-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Laser Cutting Cost Analysis Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h2>Cost Summary</h2>
          <div class="cost-item total">
            <span>Total Cost:</span>
            <span>$${results.totalCost?.toFixed(2) || '0.00'}</span>
          </div>
          <div class="cost-item total">
            <span>Cost per Piece:</span>
            <span>$${results.costPerPiece?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <div class="section">
          <h2>Cost Breakdown</h2>
          <table>
            <tr><th>Component</th><th>Cost</th><th>Percentage</th></tr>
            <tr><td>Material</td><td>$${results.materialCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.material?.toFixed(1) || '0.0'}%</td></tr>
            <tr><td>Energy</td><td>$${results.energyCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.energy?.toFixed(1) || '0.0'}%</td></tr>
            <tr><td>Gas</td><td>$${results.gasCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.gas?.toFixed(1) || '0.0'}%</td></tr>
            <tr><td>Labor</td><td>$${results.laborCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.labor?.toFixed(1) || '0.0'}%</td></tr>
            <tr><td>Machine</td><td>$${results.machineCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.machine?.toFixed(1) || '0.0'}%</td></tr>
            <tr><td>Setup</td><td>$${results.setupCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.setup?.toFixed(1) || '0.0'}%</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>Efficiency Analysis</h2>
          <div class="cost-item">
            <span>Material Utilization:</span>
            <span>${results.profitabilityAnalysis?.materialUtilization?.toFixed(1) || '0.0'}%</span>
          </div>
          <div class="cost-item">
            <span>Time Efficiency:</span>
            <span>${results.profitabilityAnalysis?.timeEfficiency?.toFixed(1) || '0.0'}%</span>
          </div>
          <div class="cost-item">
            <span>Cost per m²:</span>
            <span>$${results.profitabilityAnalysis?.costPerSquareMeter?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laser-cutting-cost-report-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laser Cutting Cost Analysis Report</title>
        <style>
          @media print {
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .no-print { display: none; }
            .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .print-section { margin-bottom: 25px; page-break-inside: avoid; }
            .cost-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .cost-table th, .cost-table td { padding: 8px 12px; text-align: left; border: 1px solid #ddd; }
            .cost-table th { background-color: #f5f5f5; font-weight: bold; }
            .total-row { font-weight: bold; background-color: #e3f2fd; }
            .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Laser Cutting Cost Analysis Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Laser Calc Professional Cutting Calculator</p>
        </div>

        <div class="print-section">
          <h2>Cost Summary</h2>
          <table class="cost-table">
            <tr class="total-row">
              <td><strong>Total Cost</strong></td>
              <td><strong>$${results.totalCost?.toFixed(2) || '0.00'}</strong></td>
            </tr>
            <tr class="total-row">
              <td><strong>Cost per Piece</strong></td>
              <td><strong>$${results.costPerPiece?.toFixed(2) || '0.00'}</strong></td>
            </tr>
          </table>
        </div>

        <div class="print-section">
          <h2>Detailed Cost Breakdown</h2>
          <table class="cost-table">
            <thead>
              <tr>
                <th>Cost Component</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Material Cost</td><td>$${results.materialCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.material?.toFixed(1) || '0.0'}%</td></tr>
              <tr><td>Energy Cost</td><td>$${results.energyCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.energy?.toFixed(1) || '0.0'}%</td></tr>
              <tr><td>Gas Cost</td><td>$${results.gasCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.gas?.toFixed(1) || '0.0'}%</td></tr>
              <tr><td>Labor Cost</td><td>$${results.laborCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.labor?.toFixed(1) || '0.0'}%</td></tr>
              <tr><td>Machine Cost</td><td>$${results.machineCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.machine?.toFixed(1) || '0.0'}%</td></tr>
              <tr><td>Setup Cost</td><td>$${results.setupCost?.toFixed(2) || '0.00'}</td><td>${results.costBreakdown?.setup?.toFixed(1) || '0.0'}%</td></tr>
            </tbody>
          </table>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <h3>Efficiency Metrics</h3>
            <p><strong>Material Utilization:</strong> ${results.profitabilityAnalysis?.materialUtilization?.toFixed(1) || '0.0'}%</p>
            <p><strong>Time Efficiency:</strong> ${results.profitabilityAnalysis?.timeEfficiency?.toFixed(1) || '0.0'}%</p>
            <p><strong>Cost per m²:</strong> $${results.profitabilityAnalysis?.costPerSquareMeter?.toFixed(2) || '0.00'}</p>
          </div>
          <div class="summary-card">
            <h3>Report Information</h3>
            <p><strong>Calculator:</strong> Laser Cutting Cost Calculator</p>
            <p><strong>Version:</strong> 1.0</p>
            <p><strong>Generated by:</strong> Laser Calc Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleGenerateShareLink = () => {
    // Generate a shareable URL with calculation parameters
    const params = new URLSearchParams({
      totalCost: results.totalCost?.toFixed(2) || '0',
      costPerPiece: results.costPerPiece?.toFixed(2) || '0',
      materialCost: results.materialCost?.toFixed(2) || '0',
      timestamp: Date.now().toString()
    });

    const shareableUrl = `${window.location.origin}/calculator/laser-cutting-cost?shared=true&${params.toString()}`;
    setShareUrl(shareableUrl);

    // Generate QR code URL (using a simple QR code service)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableUrl)}`;
    setQrCodeUrl(qrUrl);
  };

  const handleCopyShareLink = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleEmailReport = () => {
    const subject = encodeURIComponent('Laser Cutting Cost Analysis Report');
    const body = encodeURIComponent(`
Laser Cutting Cost Analysis Report
Generated on ${new Date().toLocaleDateString()}

COST SUMMARY:
• Total Cost: $${results.totalCost?.toFixed(2) || '0.00'}
• Cost per Piece: $${results.costPerPiece?.toFixed(2) || '0.00'}

COST BREAKDOWN:
• Material: $${results.materialCost?.toFixed(2) || '0.00'} (${results.costBreakdown?.material?.toFixed(1) || '0.0'}%)
• Energy: $${results.energyCost?.toFixed(2) || '0.00'} (${results.costBreakdown?.energy?.toFixed(1) || '0.0'}%)
• Gas: $${results.gasCost?.toFixed(2) || '0.00'} (${results.costBreakdown?.gas?.toFixed(1) || '0.0'}%)
• Labor: $${results.laborCost?.toFixed(2) || '0.00'} (${results.costBreakdown?.labor?.toFixed(1) || '0.0'}%)
• Machine: $${results.machineCost?.toFixed(2) || '0.00'} (${results.costBreakdown?.machine?.toFixed(1) || '0.0'}%)

EFFICIENCY METRICS:
• Material Utilization: ${results.profitabilityAnalysis?.materialUtilization?.toFixed(1) || '0.0'}%
• Time Efficiency: ${results.profitabilityAnalysis?.timeEfficiency?.toFixed(1) || '0.0'}%
• Cost per m²: $${results.profitabilityAnalysis?.costPerSquareMeter?.toFixed(2) || '0.00'}

Generated by Laser Cutting Calculator Platform
    `);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const getEmbedCode = () => {
    return `<iframe 
  src="${window.location.origin}/calculator/laser-cutting-cost" 
  width="800" 
  height="600" 
  frameborder="0"
  title="Laser Cutting Cost Calculator">
</iframe>`;
  };

  const handleCopyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy embed code:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export & Share Tools
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Export your calculation results in multiple formats or share with your team
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="share">Share & Link</TabsTrigger>
            <TabsTrigger value="embed">Embed & Print</TabsTrigger>
          </TabsList>

          {/* Export Data Tab */}
          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Data Formats
                </h4>

                <Button
                  onClick={() => handleExportData('csv')}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isExporting}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export to CSV
                </Button>

                <Button
                  onClick={() => handleExportData('excel')}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isExporting}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>

                <Button
                  onClick={() => handleExportData('json')}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isExporting}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Export to JSON
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileImage className="h-4 w-4 mr-2" />
                  Report Formats
                </h4>

                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF Report
                </Button>

                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>

                <Button
                  onClick={handleEmailReport}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report
                </Button>
              </div>
            </div>

            {isExporting && (
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-blue-800">Preparing export...</span>
              </div>
            )}
          </TabsContent>

          {/* Share & Link Tab */}
          <TabsContent value="share" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </h4>
                <Button
                  onClick={handleGenerateShareLink}
                  size="sm"
                  variant="outline"
                >
                  Generate Link
                </Button>
              </div>

              {shareUrl && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Share URL:</span>
                      <Button
                        onClick={handleCopyShareLink}
                        size="sm"
                        variant="ghost"
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600 break-all">{shareUrl}</div>
                  </div>

                  {qrCodeUrl && (
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code
                      </h5>
                      <img src={qrCodeUrl} alt="QR Code" className="border rounded" />
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        Scan to open calculation results
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Embed & Print Tab */}
          <TabsContent value="embed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Embed Options
                </h4>

                <Button
                  onClick={handleCopyEmbedCode}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </Button>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Embed Code Preview:</h5>
                  <code className="text-xs text-gray-600 break-all">
                    {getEmbedCode()}
                  </code>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Embed Settings
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Width:</span>
                    <span className="text-sm font-medium">800px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Height:</span>
                    <span className="text-sm font-medium">600px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Responsive:</span>
                    <span className="text-sm font-medium">Yes</span>
                  </div>
                </div>
              </div>
            </div>

            {copied && (
              <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm text-green-800">Copied to clipboard!</span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Export Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-3 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Export Information
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <p><strong>Data Formats:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>CSV:</strong> Spreadsheet-compatible data</li>
                <li>• <strong>Excel:</strong> Advanced spreadsheet format</li>
                <li>• <strong>JSON:</strong> Structured data for developers</li>
                <li>• <strong>PDF:</strong> Professional report format</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>Sharing Options:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Share Link:</strong> Direct URL to results</li>
                <li>• <strong>QR Code:</strong> Mobile-friendly sharing</li>
                <li>• <strong>Embed Code:</strong> Website integration</li>
                <li>• <strong>Email:</strong> Send via email client</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Report generated on {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaserCuttingCostExportTools;
