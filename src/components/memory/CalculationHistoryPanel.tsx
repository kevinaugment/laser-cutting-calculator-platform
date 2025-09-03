/**
 * Calculation History Panel Component
 * Displays and manages calculation history with search and filtering
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../../theme';
import { CalculationRecord } from '../../types/memory';
import { useCalculationHistory } from '../../hooks/useCalculationHistory';
import { formatDate, formatDuration } from '../../utils/formatters';

export interface CalculationHistoryPanelProps {
  onRecordSelect?: (record: CalculationRecord) => void;
  onRecordRestore?: (record: CalculationRecord) => void;
  calculatorType?: string;
  className?: string;
}

export function CalculationHistoryPanel({
  onRecordSelect,
  onRecordRestore,
  calculatorType,
  className = '',
}: CalculationHistoryPanelProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Use calculation history hook
  const [state, actions] = useCalculationHistory({
    autoLoad: true,
    pageSize: 20,
    enableStats: true,
  });

  // Handle search
  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      await actions.search(term);
    } else {
      await actions.loadHistory();
    }
  }, [actions]);

  // Handle record selection
  const handleRecordClick = useCallback((record: CalculationRecord) => {
    setSelectedRecord(record.id);
    onRecordSelect?.(record);
  }, [onRecordSelect]);

  // Handle record restore
  const handleRestore = useCallback((record: CalculationRecord) => {
    onRecordRestore?.(record);
  }, [onRecordRestore]);

  // Handle delete
  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this calculation from history?')) {
      await actions.deleteCalculation(id);
    }
  }, [actions]);

  // Filter by calculator type on mount
  React.useEffect(() => {
    if (calculatorType) {
      actions.filterByCalculator(calculatorType);
    }
  }, [calculatorType, actions]);

  // Format parameter value for display
  const formatParameterValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, { maximumFractionDigits: 3 });
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  // Get key parameters for preview
  const getKeyParameters = (record: CalculationRecord): Array<{ key: string; value: any }> => {
    const inputs = Object.entries(record.inputs);
    return inputs.slice(0, 3).map(([key, value]) => ({ key, value }));
  };

  return (
    <div className={`calculation-history-panel ${className}`}>
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Calculation History
              </h3>
              <p className="text-sm text-gray-600">
                {state.total} calculation{state.total !== 1 ? 's' : ''} saved
              </p>
            </div>
            
            {state.total > 0 && (
              <button
                onClick={() => actions.clearHistory()}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search calculations..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {state.loading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading history...</p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm">{state.error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!state.loading && state.records.length === 0 && (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No calculations yet</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No calculations match your search.' : 'Your calculation history will appear here.'}
            </p>
          </div>
        )}

        {/* History List */}
        {!state.loading && state.records.length > 0 && (
          <div className="divide-y divide-gray-200">
            {state.records.map((record) => (
              <div
                key={record.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedRecord === record.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                }`}
                onClick={() => handleRecordClick(record)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Calculator Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {record.calculatorName}
                      </h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {record.calculatorType}
                      </span>
                    </div>

                    {/* Key Parameters */}
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-2">
                        {getKeyParameters(record).map(({ key, value }) => (
                          <span key={key} className="text-xs text-gray-600">
                            <span className="font-medium">{key}:</span> {formatParameterValue(value)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Timestamp and Execution Time */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDate(record.timestamp)}</span>
                      <span>
                        {formatDuration(record.metadata.executionTime || 0)}
                      </span>
                      {record.metadata.context?.projectName && (
                        <span>Project: {record.metadata.context.projectName}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(record);
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded"
                      title="Restore calculation"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDetails(!showDetails);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="View details"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete calculation"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedRecord === record.id && showDetails && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Inputs */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Inputs</h5>
                        <div className="space-y-1">
                          {Object.entries(record.inputs).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-gray-600">{key}:</span>
                              <span className="text-gray-900 font-medium">
                                {formatParameterValue(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outputs */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Results</h5>
                        <div className="space-y-1">
                          {Object.entries(record.outputs).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span className="text-gray-600">{key}:</span>
                              <span className="text-gray-900 font-medium">
                                {formatParameterValue(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Context Information */}
                    {record.metadata.context && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Context</h5>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          {Object.entries(record.metadata.context).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">{key}:</span>
                              <span className="text-gray-900">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {state.hasMore && !state.loading && (
          <div className="p-4 border-t">
            <button
              onClick={actions.loadMore}
              className="w-full px-4 py-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
