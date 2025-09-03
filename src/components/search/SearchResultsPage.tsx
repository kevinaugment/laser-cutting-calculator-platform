// Search Results Page Component for 20 Core Calculators
// Displays comprehensive search results with filtering and sorting

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Clock, 
  Star, 
  TrendingUp,
  Calculator,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { searchService, SearchResult, SearchFilters } from '../../services/searchService';
import { EnhancedSearchBar } from './EnhancedSearchBar';

interface SearchResultsPageProps {
  initialQuery?: string;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  initialQuery = ''
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'category' | 'difficulty'>('relevance');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get('q') || initialQuery;
    const category = searchParams.get('category') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const badge = searchParams.get('badge') || undefined;

    const initialFilters: SearchFilters = {
      category,
      difficulty,
      badge
    };

    setFilters(initialFilters);
    
    if (query) {
      performSearch(query, initialFilters);
    } else {
      // Show all calculators if no query
      const allCalculators = searchService.getAllCalculators(initialFilters);
      setResults(allCalculators);
      setFilteredResults(allCalculators);
    }
  }, [searchParams, initialQuery]);

  // Perform search
  const performSearch = (query: string, searchFilters: SearchFilters = filters) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const searchResults = query 
        ? searchService.search(query, searchFilters, 50)
        : searchService.getAllCalculators(searchFilters);
      
      setResults(searchResults);
      setFilteredResults(searchResults);
      setIsLoading(false);
    }, 100);
  };

  // Handle search results from search bar
  const handleSearchResults = (searchResults: SearchResult[]) => {
    setResults(searchResults);
    setFilteredResults(searchResults);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value
    };
    
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    setSearchParams(newSearchParams);
    
    // Re-perform search with new filters
    const query = searchParams.get('q') || '';
    performSearch(query, newFilters);
  };

  // Handle sorting
  const handleSort = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    
    const sorted = [...filteredResults].sort((a, b) => {
      switch (newSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'Intermediate': 1, 'Advanced': 2, 'Expert': 3 };
          const aDiff = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
          const bDiff = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
          if (aDiff !== bDiff) return aDiff - bDiff;
          return a.name.localeCompare(b.name);
        case 'relevance':
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });
    
    setFilteredResults(sorted);
  };

  // Get badge color
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Premium': return 'bg-green-100 text-green-800 border-green-200';
      case 'AI Enhanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Expert': return 'text-red-600';
      case 'Advanced': return 'text-orange-600';
      case 'Intermediate': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Calculators
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find the perfect calculator from our collection of 20 core laser cutting tools
          </p>
          
          {/* Enhanced Search Bar */}
          <EnhancedSearchBar
            onSearchResults={handleSearchResults}
            placeholder="Search 20 core calculators..."
            showFilters={true}
            showSuggestions={true}
            className="max-w-2xl"
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-sm text-gray-600">
              {isLoading ? 'Searching...' : `${filteredResults.length} calculator${filteredResults.length !== 1 ? 's' : ''} found`}
            </span>
            
            {/* Active Filters */}
            {Object.entries(filters).some(([_, value]) => value) && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Filters:</span>
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {value}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value as typeof sortBy)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="difficulty">Sort by Difficulty</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Searching calculators...</span>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No calculators found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setFilters({});
                setSearchParams({});
                performSearch('');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Show all calculators
            </button>
          </div>
        )}

        {/* Results Grid/List */}
        {!isLoading && filteredResults.length > 0 && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredResults.map((calculator) => (
              <Link
                key={calculator.id}
                to={calculator.path}
                className={`block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 ${
                  viewMode === 'grid' ? 'p-6' : 'p-4'
                }`}
              >
                <div className={viewMode === 'grid' ? '' : 'flex items-start space-x-4'}>
                  {viewMode === 'grid' && (
                    <div className="flex items-center justify-between mb-4">
                      <Calculator className="h-8 w-8 text-blue-500" />
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(calculator.badge)}`}>
                        {calculator.badge}
                      </span>
                    </div>
                  )}
                  
                  {viewMode === 'list' && (
                    <div className="flex-shrink-0">
                      <Calculator className="h-6 w-6 text-blue-500 mt-1" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold text-gray-900 ${viewMode === 'grid' ? 'text-lg' : 'text-base'}`}>
                        {calculator.name}
                      </h3>
                      {viewMode === 'list' && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(calculator.badge)}`}>
                          {calculator.badge}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-gray-600 mb-4 ${viewMode === 'grid' ? 'text-sm' : 'text-sm'}`}>
                      {calculator.description}
                    </p>
                    
                    <div className={`flex items-center justify-between ${viewMode === 'grid' ? 'flex-col items-start space-y-3' : 'space-x-4'}`}>
                      <div className={`flex items-center space-x-4 text-sm text-gray-500 ${viewMode === 'grid' ? 'w-full' : ''}`}>
                        <span className="font-medium">{calculator.category}</span>
                        <span className={`font-medium ${getDifficultyColor(calculator.difficulty)}`}>
                          {calculator.difficulty}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {calculator.estimatedTime}
                        </span>
                      </div>
                      
                      {calculator.features.length > 0 && (
                        <div className={`flex flex-wrap gap-1 ${viewMode === 'grid' ? 'w-full' : ''}`}>
                          {calculator.features.slice(0, viewMode === 'grid' ? 3 : 2).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {feature}
                            </span>
                          ))}
                          {calculator.features.length > (viewMode === 'grid' ? 3 : 2) && (
                            <span className="text-xs text-gray-500">
                              +{calculator.features.length - (viewMode === 'grid' ? 3 : 2)} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Popular Calculators Section */}
        {!searchParams.get('q') && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Calculators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchService.getPopularCalculators(4).map((calculator) => (
                <Link
                  key={calculator.id}
                  to={calculator.path}
                  className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {calculator.name}
                      </h4>
                      <p className="text-xs text-gray-500">{calculator.category}</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
