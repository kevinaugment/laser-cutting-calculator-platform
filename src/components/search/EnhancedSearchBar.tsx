// Enhanced Search Bar Component for 20 Core Calculators
// Provides intelligent search with suggestions, filters, and analytics

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  TrendingUp, 
  Calculator,
  Tag,
  ChevronDown,
  Star
} from 'lucide-react';
import { searchService, SearchResult, SearchSuggestion, SearchFilters } from '../../services/searchService';

interface EnhancedSearchBarProps {
  onSearchResults?: (results: SearchResult[]) => void;
  placeholder?: string;
  showFilters?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearchResults,
  placeholder = "Search 20 core calculators...",
  showFilters = true,
  showSuggestions = true,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Handle search with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        const searchResults = searchService.search(query, filters, 10);
        setResults(searchResults);
        onSearchResults?.(searchResults);
        
        if (showSuggestions) {
          const searchSuggestions = searchService.getSuggestions(query, 8);
          setSuggestions(searchSuggestions);
        }
        setIsSearching(false);
      } else {
        setResults([]);
        setSuggestions([]);
        onSearchResults?.([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, filters, onSearchResults, showSuggestions]);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestionDropdown(false);
    inputRef.current?.focus();
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setFilters({});
    onSearchResults?.([]);
    inputRef.current?.focus();
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionDropdown(false);
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get badge color
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Premium': return 'bg-green-100 text-green-800';
      case 'AI Enhanced': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get suggestion icon
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'calculator': return <Calculator className="h-4 w-4" />;
      case 'category': return <Tag className="h-4 w-4" />;
      case 'feature': return <Star className="h-4 w-4" />;
      case 'keyword': return <Search className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestionDropdown(true);
          }}
          onFocus={() => {
            if (query.trim() && suggestions.length > 0) {
              setShowSuggestionDropdown(true);
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {/* Clear Button */}
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Filter Button */}
          {showFilters && (
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`p-2 mr-1 rounded-md transition-colors ${
                Object.keys(filters).some(key => filters[key as keyof SearchFilters])
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
          
          {/* Loading Indicator */}
          {isSearching && (
            <div className="p-2 mr-1">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && showSuggestionDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.text}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <div className="text-gray-400">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {suggestion.type} {suggestion.count > 1 && `(${suggestion.count})`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Dropdown */}
      {showFilters && showFilterDropdown && (
        <div className="absolute z-50 right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilterDropdown(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Core Engineering">Core Engineering (5)</option>
                  <option value="Quality Control">Quality Control (5)</option>
                  <option value="Process Optimization">Process Optimization (5)</option>
                  <option value="Advanced Analysis">Advanced Analysis (5)</option>
                </select>
              </div>
              
              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty || 'all'}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              
              {/* Badge Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Badge
                </label>
                <select
                  value={filters.badge || 'all'}
                  onChange={(e) => handleFilterChange('badge', e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Badges</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="AI Enhanced">AI Enhanced</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters */}
            {Object.keys(filters).some(key => filters[key as keyof SearchFilters]) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results Preview */}
      {query && results.length > 0 && !showSuggestionDropdown && (
        <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              Found {results.length} calculator{results.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="py-2">
            {results.slice(0, 5).map((result) => (
              <Link
                key={result.id}
                to={result.path}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowSuggestionDropdown(false);
                  setQuery('');
                }}
              >
                <div className="flex items-start space-x-3">
                  <Calculator className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.name}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(result.badge)}`}>
                        {result.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {result.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {result.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {result.difficulty}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {result.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {results.length > 5 && (
              <div className="px-4 py-2 text-center border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  +{results.length - 5} more results
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
