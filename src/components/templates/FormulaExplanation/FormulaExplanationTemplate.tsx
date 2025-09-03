import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { 
  Calculator, 
  BookOpen, 
  Database, 
  Target, 
  Info,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Types
export interface Variable {
  symbol: string;
  name: string;
  description: string;
  unit: string;
  type: 'input' | 'output' | 'constant';
  defaultValue?: number;
  range?: {
    min: number;
    max: number;
  };
}

export interface CalculationStep {
  id: string;
  title: string;
  formula: string;
  description: string;
  example?: {
    input: { [key: string]: number };
    output: number;
  };
}

export interface DataSource {
  name: string;
  description: string;
  type: 'industry_standard' | 'research' | 'manufacturer' | 'empirical';
  reliability: 'high' | 'medium' | 'low';
  lastUpdated?: string;
  reference?: string;
  url?: string;
}

export interface ScopeDefinition {
  includes: string[];
  excludes: string[];
  assumptions: string[];
  limitations: string[];
  applicability: string[];
}

export interface FormulaExplanationConfig {
  calculatorName: string;
  version: string;
  lastUpdated: string;
  variables: Variable[];
  calculationSteps: CalculationStep[];
  dataSources: DataSource[];
  scope: ScopeDefinition;
  references?: string[];
  notes?: string[];
}

interface FormulaExplanationTemplateProps {
  config: FormulaExplanationConfig;
  className?: string;
}

const FormulaExplanationTemplate: React.FC<FormulaExplanationTemplateProps> = ({
  config,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('variables');

  const getVariableTypeColor = (type: string) => {
    switch (type) {
      case 'input': return 'bg-blue-100 text-blue-800';
      case 'output': return 'bg-green-100 text-green-800';
      case 'constant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getReliabilityIcon = (reliability: string) => {
    switch (reliability) {
      case 'high': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Formula Explanation
        </CardTitle>
        <p className="text-sm text-gray-600">
          Detailed breakdown of calculation methodology and data sources
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
          </TabsList>

          {/* Variables Tab */}
          <TabsContent value="variables" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Variable Definitions
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Symbol</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Unit</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.variables.map((variable, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-mono font-semibold">
                          {variable.symbol}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 font-medium">
                          {variable.name}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">
                          {variable.description}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">
                          {variable.unit}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Badge className={getVariableTypeColor(variable.type)}>
                            {variable.type}
                          </Badge>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-sm">
                          {variable.range ? 
                            `${variable.range.min} - ${variable.range.max}` : 
                            variable.defaultValue || 'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Formulas Tab */}
          <TabsContent value="formulas" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Calculator className="h-4 w-4 mr-2" />
                Calculation Steps
              </h4>
              
              <div className="space-y-4">
                {config.calculationSteps.map((step, index) => (
                  <Card key={step.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <h5 className="font-medium">{step.title}</h5>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <code className="text-sm font-mono">{step.formula}</code>
                      </div>
                      
                      <p className="text-sm text-gray-600">{step.description}</p>
                      
                      {step.example && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h6 className="font-medium text-blue-900 mb-2">Example:</h6>
                          <div className="text-sm text-blue-800">
                            <div className="mb-1">
                              <strong>Input:</strong> {JSON.stringify(step.example.input, null, 2)}
                            </div>
                            <div>
                              <strong>Output:</strong> {step.example.output}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="sources" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Data Sources & References
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.dataSources.map((source, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{source.name}</h5>
                        <div className={`flex items-center space-x-1 ${getReliabilityColor(source.reliability)}`}>
                          {getReliabilityIcon(source.reliability)}
                          <span className="text-sm capitalize">{source.reliability}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{source.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <Badge variant="outline">{source.type.replace('_', ' ')}</Badge>
                        {source.lastUpdated && (
                          <span>Updated: {source.lastUpdated}</span>
                        )}
                      </div>
                      
                      {source.url && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Source
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Scope Tab */}
          <TabsContent value="scope" className="space-y-4">
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Scope & Limitations
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">✓ Includes</h5>
                    <ul className="space-y-1">
                      {config.scope.includes.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">📋 Assumptions</h5>
                    <ul className="space-y-1">
                      {config.scope.assumptions.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <Info className="h-3 w-3 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">✗ Excludes</h5>
                    <ul className="space-y-1">
                      {config.scope.excludes.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <AlertTriangle className="h-3 w-3 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-yellow-800 mb-2">⚠ Limitations</h5>
                    <ul className="space-y-1">
                      {config.scope.limitations.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <AlertTriangle className="h-3 w-3 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Applicability</h5>
                <div className="flex flex-wrap gap-2">
                  {config.scope.applicability.map((item, index) => (
                    <Badge key={index} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Information */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span className="font-medium">{config.calculatorName}</span> v{config.version}
            </div>
            <div>
              Last updated: {config.lastUpdated}
            </div>
          </div>
          
          {config.notes && config.notes.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
              <h6 className="font-medium text-yellow-900 mb-1">Notes:</h6>
              <ul className="space-y-1">
                {config.notes.map((note, index) => (
                  <li key={index} className="text-sm text-yellow-800">• {note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulaExplanationTemplate;
