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
import { ExportData, ExportMetadata } from '../types/ResultTypes';

// Export Configuration Types
export interface ExportConfig {
  calculatorName: string;
  version: string;
  supportedFormats: ExportFormat[];
  shareOptions: ShareOption[];
  embedOptions: EmbedOption[];
  printOptions: PrintOption[];
}

export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  extension: string;
  mimeType: string;
  icon: React.ComponentType<any>;
  category: 'data' | 'report' | 'image';
}

export interface ShareOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  generateUrl: (data: any) => string;
  supportsQR?: boolean;
}

export interface EmbedOption {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  responsive: boolean;
  generateCode: (url: string, options: any) => string;
}

export interface PrintOption {
  id: string;
  name: string;
  description: string;
  orientation: 'portrait' | 'landscape';
  paperSize: string;
  includeCharts: boolean;
}

// Export Tools Template Props
interface ExportToolsTemplateProps {
  config: ExportConfig;
  data: any;
  results: any;
  onExport: (format: string, data: ExportData) => void;
  onShare?: (url: string, method: string) => void;
  onPrint?: (options: PrintOption) => void;
  className?: string;
}

const ExportToolsTemplate: React.FC<ExportToolsTemplateProps> = ({
  config,
  data,
  results,
  onExport,
  onShare,
  onPrint,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('export');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEmbedOption, setSelectedEmbedOption] = useState(config.embedOptions[0]);

  // Export Data Generation
  const generateExportData = (format: string): ExportData => {
    const metadata: ExportMetadata = {
      calculatorName: config.calculatorName,
      calculatorVersion: config.version,
      generatedAt: new Date().toISOString(),
      format: format,
      title: `${config.calculatorName} Analysis Report`
    };

    return {
      metadata,
      input: data,
      results: results,
      charts: [], // Would be populated with actual chart data
      recommendations: results.recommendations || []
    };
  };

  // Handle Export
  const handleExport = async (formatId: string) => {
    setIsExporting(true);
    try {
      const exportData = generateExportData(formatId);
      await onExport(formatId, exportData);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Share Link Generation
  const handleGenerateShareLink = (optionId: string) => {
    const shareOption = config.shareOptions.find(opt => opt.id === optionId);
    if (shareOption) {
      const url = shareOption.generateUrl({ data, results });
      setShareUrl(url);
      
      if (shareOption.supportsQR) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
        setQrCodeUrl(qrUrl);
      }
      
      if (onShare) {
        onShare(url, optionId);
      }
    }
  };

  // Handle Copy to Clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate Embed Code
  const generateEmbedCode = (option: EmbedOption) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return option.generateCode(baseUrl, {
      width: option.width,
      height: option.height,
      responsive: option.responsive
    });
  };

  return (
    <Card className={className}>
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
              {/* Data Formats */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Data Formats
                </h4>
                
                {config.supportedFormats
                  .filter(format => format.category === 'data')
                  .map((format) => (
                    <Button 
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      variant="outline" 
                      className="w-full justify-start"
                      disabled={isExporting}
                    >
                      <format.icon className="h-4 w-4 mr-2" />
                      {format.name}
                    </Button>
                  ))}
              </div>

              {/* Report Formats */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <FileImage className="h-4 w-4 mr-2" />
                  Report Formats
                </h4>
                
                {config.supportedFormats
                  .filter(format => format.category === 'report')
                  .map((format) => (
                    <Button 
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      variant="outline" 
                      className="w-full justify-start"
                      disabled={isExporting}
                    >
                      <format.icon className="h-4 w-4 mr-2" />
                      {format.name}
                    </Button>
                  ))}
                
                <Button 
                  onClick={() => onPrint && onPrint(config.printOptions[0])}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                
                <Button 
                  onClick={() => handleExport('email')}
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
                <div className="flex space-x-2">
                  {config.shareOptions.map((option) => (
                    <Button 
                      key={option.id}
                      onClick={() => handleGenerateShareLink(option.id)}
                      size="sm"
                      variant="outline"
                    >
                      <option.icon className="h-4 w-4 mr-1" />
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {shareUrl && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Share URL:</span>
                      <Button 
                        onClick={() => handleCopy(shareUrl)}
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
              {/* Embed Options */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Embed Options
                </h4>
                
                <div className="space-y-2">
                  {config.embedOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="embedOption"
                        value={option.id}
                        checked={selectedEmbedOption.id === option.id}
                        onChange={() => setSelectedEmbedOption(option)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-sm">{option.name}</div>
                        <div className="text-xs text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleCopy(generateEmbedCode(selectedEmbedOption))}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Copy Embed Code
                </Button>
              </div>

              {/* Embed Settings */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Embed Settings
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Width:</span>
                    <span className="text-sm font-medium">{selectedEmbedOption.width}px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Height:</span>
                    <span className="text-sm font-medium">{selectedEmbedOption.height}px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Responsive:</span>
                    <span className="text-sm font-medium">
                      {selectedEmbedOption.responsive ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Code Preview:</h5>
                  <code className="text-xs text-gray-600 break-all">
                    {generateEmbedCode(selectedEmbedOption)}
                  </code>
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
                {config.supportedFormats
                  .filter(f => f.category === 'data')
                  .map(format => (
                    <li key={format.id}>• <strong>{format.name}:</strong> {format.description}</li>
                  ))}
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>Sharing Options:</strong></p>
              <ul className="space-y-1 ml-4">
                {config.shareOptions.map(option => (
                  <li key={option.id}>• <strong>{option.name}:</strong> {option.description}</li>
                ))}
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
              <span>Version {config.version}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportToolsTemplate;
