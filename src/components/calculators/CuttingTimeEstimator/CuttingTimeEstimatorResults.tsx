import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Clock, TrendingUp, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react';

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

interface CuttingTimeEstimatorResultsProps {
  results: CuttingTimeResults;
}

const CuttingTimeEstimatorResults: React.FC<CuttingTimeEstimatorResultsProps> = ({ results }) => {
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

  const getEfficiencyColor = (efficiency: number): string => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyBadge = (efficiency: number): { variant: any; text: string } => {
    if (efficiency >= 80) return { variant: 'default', text: 'Excellent' };
    if (efficiency >= 60) return { variant: 'secondary', text: 'Good' };
    return { variant: 'destructive', text: 'Needs Improvement' };
  };

  return (
    <div className="space-y-6">
      {/* Primary Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5" />
              Total Process Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {formatTime(results.totalProcessTime)}
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Including setup and positioning
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              Process Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getEfficiencyColor(results.efficiency)}`}>
              {results.efficiency.toFixed(1)}%
            </div>
            <Badge {...getEfficiencyBadge(results.efficiency)} className="mt-2">
              {getEfficiencyBadge(results.efficiency).text}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
              <Target className="h-5 w-5" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {results.throughput.toFixed(1)}
            </div>
            <p className="text-sm text-purple-600 mt-1">
              Parts per hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Time Breakdown Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Cutting Time */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Cutting Time</span>
                <span className="font-semibold">{formatTime(results.timeBreakdown.cutting)}</span>
              </div>
              <Progress 
                value={(results.timeBreakdown.cutting / results.totalProcessTime) * 100} 
                className="h-2"
              />
              <p className="text-sm text-gray-500">
                {((results.timeBreakdown.cutting / results.totalProcessTime) * 100).toFixed(1)}% of total time
              </p>
            </div>

            {/* Pierce Time */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Pierce Time</span>
                <span className="font-semibold">{formatTime(results.timeBreakdown.piercing)}</span>
              </div>
              <Progress 
                value={(results.timeBreakdown.piercing / results.totalProcessTime) * 100} 
                className="h-2"
              />
              <p className="text-sm text-gray-500">
                {((results.timeBreakdown.piercing / results.totalProcessTime) * 100).toFixed(1)}% of total time
              </p>
            </div>

            {/* Positioning Time */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Positioning Time</span>
                <span className="font-semibold">{formatTime(results.timeBreakdown.positioning)}</span>
              </div>
              <Progress 
                value={(results.timeBreakdown.positioning / results.totalProcessTime) * 100} 
                className="h-2"
              />
              <p className="text-sm text-gray-500">
                {((results.timeBreakdown.positioning / results.totalProcessTime) * 100).toFixed(1)}% of total time
              </p>
            </div>

            {/* Setup Time */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Setup Time</span>
                <span className="font-semibold">{formatTime(results.timeBreakdown.setup)}</span>
              </div>
              <Progress 
                value={(results.timeBreakdown.setup / results.totalProcessTime) * 100} 
                className="h-2"
              />
              <p className="text-sm text-gray-500">
                {((results.timeBreakdown.setup / results.totalProcessTime) * 100).toFixed(1)}% of total time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      {results.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sensitivity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Sensitivity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.sensitivityAnalysis.map((analysis, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{analysis.parameter}</h4>
                  <Badge variant={analysis.impact < 0 ? 'default' : 'secondary'}>
                    {analysis.impact < 0 ? 'Time Reduction' : 'Time Increase'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{analysis.suggestion}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Impact:</span>
                  <span className={`text-sm font-semibold ${analysis.impact < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.impact > 0 ? '+' : ''}{(analysis.impact * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Insights */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-800 mb-2">Time Distribution</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Cutting: {((results.timeBreakdown.cutting / results.totalProcessTime) * 100).toFixed(0)}% of total time</li>
                <li>• Non-cutting: {(((results.totalProcessTime - results.timeBreakdown.cutting) / results.totalProcessTime) * 100).toFixed(0)}% of total time</li>
                <li>• Process efficiency: {results.efficiency.toFixed(1)}%</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">Performance Metrics</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Throughput: {results.throughput.toFixed(1)} parts/hour</li>
                <li>• Cutting time: {formatTime(results.totalCuttingTime)}</li>
                <li>• Pierce time: {formatTime(results.totalPierceTime)}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CuttingTimeEstimatorResults;
