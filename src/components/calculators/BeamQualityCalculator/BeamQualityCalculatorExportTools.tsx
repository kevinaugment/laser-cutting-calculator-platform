import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/Button';
import { Download, Share2, Copy, FileText } from 'lucide-react';

interface BeamQualityCalculatorExportToolsProps {
  results: any;
  inputs: any;
}

const BeamQualityCalculatorExportTools: React.FC<BeamQualityCalculatorExportToolsProps> = ({
  results,
  inputs
}) => {
  const handleExportCSV = () => {
    console.log('Exporting beam quality analysis to CSV...');
  };

  const handleExportPDF = () => {
    console.log('Exporting beam quality report to PDF...');
  };

  const handleCopySummary = () => {
    console.log('Copying beam quality summary...');
  };

  const handleShare = () => {
    console.log('Sharing beam quality results...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-purple-600" />
          Export & Share Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Export your beam quality analysis results for documentation and reporting
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
                <div className="text-xs opacity-80">Data analysis format</div>
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
          <h4 className="font-medium text-gray-900 mb-2">Analysis Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">M² Factor:</span>
              <span className="font-medium ml-1">{results?.beamQuality?.mSquared || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Quality:</span>
              <span className="font-medium ml-1">{results?.beamQuality?.qualityGrade || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-gray-600">Focus Spot:</span>
              <span className="font-medium ml-1">{results?.focusCharacteristics?.focusedSpotDiameter || 0}mm</span>
            </div>
            <div>
              <span className="text-gray-600">Power Density:</span>
              <span className="font-medium ml-1">{results?.focusCharacteristics?.powerDensity || 0}MW/m²</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeamQualityCalculatorExportTools;
