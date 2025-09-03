import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Download, Share2, Copy, FileText } from 'lucide-react';

interface LaserParameterOptimizerExportToolsProps {
  results: any;
  inputs: any;
}

const LaserParameterOptimizerExportTools: React.FC<LaserParameterOptimizerExportToolsProps> = ({
  results,
  inputs
}) => {
  const handleExportCSV = () => {
    // CSV export logic
    console.log('Exporting to CSV...');
  };

  const handleExportPDF = () => {
    // PDF export logic
    console.log('Exporting to PDF...');
  };

  const handleCopySummary = () => {
    // Copy summary logic
    console.log('Copying summary...');
  };

  const handleShare = () => {
    // Share logic
    console.log('Sharing results...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-green-600" />
          Export & Share Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Export your parameter optimization results for reporting and documentation
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Button
              onClick={handleExportCSV}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div>Export to CSV</div>
                <div className="text-xs opacity-80">Spreadsheet format</div>
              </div>
            </Button>
            
            <Button
              onClick={handleExportPDF}
              className="w-full justify-start bg-red-600 hover:bg-red-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div>Export to PDF</div>
                <div className="text-xs opacity-80">Professional report</div>
              </div>
            </Button>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleCopySummary}
              variant="outline"
              className="w-full justify-start"
            >
              <Copy className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div>Copy Summary</div>
                <div className="text-xs text-gray-500">Text format</div>
              </div>
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full justify-start"
            >
              <Share2 className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div>Share Results</div>
                <div className="text-xs text-gray-500">Send to team</div>
              </div>
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Power:</span>
              <span className="font-medium ml-1">{results?.optimizedParameters?.power || 0}W</span>
            </div>
            <div>
              <span className="text-gray-600">Speed:</span>
              <span className="font-medium ml-1">{results?.optimizedParameters?.speed || 0}mm/min</span>
            </div>
            <div>
              <span className="text-gray-600">Quality:</span>
              <span className="font-medium ml-1">{results?.expectedResults?.edgeQuality || 0}/10</span>
            </div>
            <div>
              <span className="text-gray-600">Efficiency:</span>
              <span className="font-medium ml-1">{results?.efficiency?.cutting || 0}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaserParameterOptimizerExportTools;
