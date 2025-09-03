// 数据导入导出组件 - Phase 3: 功能增强与扩展
// 提供完整的数据导入导出用户界面

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon, 
  TableCellsIcon,
  DocumentTextIcon,
  DocumentIcon,
  CloudArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { dataExportService, ExportData, ExportOptions } from '../../services/dataExportService';

interface DataImportExportProps {
  projectData?: ExportData;
  onImportComplete?: (data: any[]) => void;
  calculatorType?: string;
}

export const DataImportExport: React.FC<DataImportExportProps> = ({
  projectData,
  onImportComplete,
  calculatorType = 'laser-cutting-cost'
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf' | 'json'>('excel');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'excel',
    includeCharts: true,
    includeImages: false,
    template: 'standard'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 导出功能
  const handleExport = async () => {
    if (!projectData) {
      alert('No data available for export');
      return;
    }

    setIsExporting(true);
    try {
      const options = { ...exportOptions, format: exportFormat };
      let blob: Blob;
      let filename: string;

      switch (exportFormat) {
        case 'excel':
          blob = await dataExportService.exportToExcel(projectData, options);
          filename = `${projectData.projectName}_report.xlsx`;
          break;
        case 'csv':
          blob = await dataExportService.exportToCSV(projectData, options);
          filename = `${projectData.projectName}_data.csv`;
          break;
        case 'pdf':
          blob = await dataExportService.exportToPDF(projectData, options);
          filename = `${projectData.projectName}_report.pdf`;
          break;
        case 'json':
          blob = await dataExportService.exportToJSON(projectData);
          filename = `${projectData.projectName}_data.json`;
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // 下载文件
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // 下载模板
  const handleDownloadTemplate = async () => {
    try {
      const blob = await dataExportService.generateImportTemplate(calculatorType);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${calculatorType}_template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Template download failed:', error);
      alert('Template download failed. Please try again.');
    }
  };

  // 导入功能
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);
    setImportErrors([]);

    try {
      const template = dataExportService.getImportTemplate(calculatorType);
      const result = await dataExportService.importFromCSV(file, template);

      setImportResult(result);
      setImportErrors(result.errors);

      if (result.success && onImportComplete) {
        onImportComplete(result.data);
      }

    } catch (error) {
      console.error('Import failed:', error);
      setImportErrors(['Import failed. Please check your file format.']);
    } finally {
      setIsImporting(false);
    }
  };

  const formatIcons = {
    excel: TableCellsIcon,
    csv: DocumentTextIcon,
    pdf: DocumentIcon,
    json: DocumentArrowDownIcon
  };

  const FormatIcon = formatIcons[exportFormat];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Import & Export</h2>
        <p className="text-gray-600">Import data from files or export your calculations to various formats</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('export')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'export'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <DocumentArrowUpIcon className="w-4 h-4 inline mr-2" />
          Export Data
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'import'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <DocumentArrowDownIcon className="w-4 h-4 inline mr-2" />
          Import Data
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'export' && (
          <motion.div
            key="export"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Export Section */}
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['excel', 'csv', 'pdf', 'json'] as const).map((format) => {
                    const Icon = formatIcons[format];
                    return (
                      <button
                        key={format}
                        onClick={() => {
                          setExportFormat(format);
                          setExportOptions(prev => ({ ...prev, format }));
                        }}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          exportFormat === format
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm font-medium capitalize">{format}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Export Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeCharts}
                      onChange={(e) => setExportOptions(prev => ({ 
                        ...prev, 
                        includeCharts: e.target.checked 
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Charts and Graphs</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeImages}
                      onChange={(e) => setExportOptions(prev => ({ 
                        ...prev, 
                        includeImages: e.target.checked 
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Images and Diagrams</span>
                  </label>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Report Template</label>
                    <select
                      value={exportOptions.template}
                      onChange={(e) => setExportOptions(prev => ({ 
                        ...prev, 
                        template: e.target.value as 'standard' | 'detailed' | 'summary'
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="standard">Standard Report</option>
                      <option value="detailed">Detailed Analysis</option>
                      <option value="summary">Executive Summary</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting || !projectData}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FormatIcon className="w-5 h-5 mr-2" />
                    Export as {exportFormat.toUpperCase()}
                  </>
                )}
              </button>

              {!projectData && (
                <div className="text-center text-gray-500 text-sm">
                  No calculation data available. Complete some calculations first.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'import' && (
          <motion.div
            key="import"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Import Section */}
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CloudArrowDownIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-900">Download Template</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Download the CSV template with the correct format and example data.
                    </p>
                    <button
                      onClick={handleDownloadTemplate}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Download Template →
                    </button>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload CSV File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleImport}
                    className="hidden"
                  />
                  <DocumentArrowDownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop your CSV file
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    {isImporting ? 'Processing...' : 'Choose File'}
                  </button>
                </div>
              </div>

              {/* Import Results */}
              {importResult && (
                <div className="space-y-4">
                  {importResult.success ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-green-900">Import Successful</h3>
                          <p className="text-sm text-green-700 mt-1">
                            Successfully imported {importResult.data.length} records.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-red-900">Import Failed</h3>
                          <p className="text-sm text-red-700 mt-1">
                            Please fix the following errors and try again:
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error List */}
                  {importErrors.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {importErrors.slice(0, 10).map((error, index) => (
                          <li key={index} className="flex items-start">
                            <XMarkIcon className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            {error}
                          </li>
                        ))}
                        {importErrors.length > 10 && (
                          <li className="text-gray-500 italic">
                            ... and {importErrors.length - 10} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {importResult.warnings && importResult.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-yellow-900 mb-2">Warnings:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {importResult.warnings.slice(0, 5).map((warning: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataImportExport;
