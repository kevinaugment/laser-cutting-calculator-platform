// Enhanced Search and Discovery Service for 20 Core Calculators
// Provides intelligent search, filtering, and recommendation capabilities

import { coreCalculatorMetadata, coreCalculatorCategories } from '../data/coreCalculatorConfigs';

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  badge: string;
  features: string[];
  estimatedTime: string;
  relevanceScore: number;
  matchedTerms: string[];
  path: string;
}

export interface SearchFilters {
  category?: string;
  difficulty?: string;
  badge?: string;
  features?: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'calculator' | 'category' | 'feature' | 'keyword';
  count: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: Array<{ query: string; count: number }>;
  popularCalculators: Array<{ id: string; name: string; searches: number }>;
  categoryDistribution: Record<string, number>;
}

export class SearchService {
  private searchIndex: Map<string, SearchResult> = new Map();
  private keywordIndex: Map<string, string[]> = new Map();
  private searchAnalytics: SearchAnalytics = {
    totalSearches: 0,
    popularQueries: [],
    popularCalculators: [],
    categoryDistribution: {}
  };

  constructor() {
    this.buildSearchIndex();
    this.buildKeywordIndex();
  }

  /**
   * Build comprehensive search index for all 20 core calculators
   */
  private buildSearchIndex(): void {
    Object.entries(coreCalculatorMetadata).forEach(([id, metadata]) => {
      const searchResult: SearchResult = {
        id,
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        difficulty: metadata.difficulty,
        badge: metadata.badge,
        features: metadata.features,
        estimatedTime: metadata.estimatedTime,
        relevanceScore: 0,
        matchedTerms: [],
        path: `/calculator/${id}`
      };
      
      this.searchIndex.set(id, searchResult);
    });
  }

  /**
   * Build keyword index for intelligent search suggestions
   */
  private buildKeywordIndex(): void {
    const keywords = new Map<string, Set<string>>();
    
    this.searchIndex.forEach((result, id) => {
      // Index calculator names
      const nameWords = this.extractKeywords(result.name);
      nameWords.forEach(word => {
        if (!keywords.has(word)) keywords.set(word, new Set());
        keywords.get(word)!.add(id);
      });
      
      // Index descriptions
      const descWords = this.extractKeywords(result.description);
      descWords.forEach(word => {
        if (!keywords.has(word)) keywords.set(word, new Set());
        keywords.get(word)!.add(id);
      });
      
      // Index categories
      const categoryWords = this.extractKeywords(result.category);
      categoryWords.forEach(word => {
        if (!keywords.has(word)) keywords.set(word, new Set());
        keywords.get(word)!.add(id);
      });
      
      // Index features
      result.features.forEach(feature => {
        const featureWords = this.extractKeywords(feature);
        featureWords.forEach(word => {
          if (!keywords.has(word)) keywords.set(word, new Set());
          keywords.get(word)!.add(id);
        });
      });
    });
    
    // Convert Sets to Arrays for the keyword index
    keywords.forEach((calculatorIds, keyword) => {
      this.keywordIndex.set(keyword, Array.from(calculatorIds));
    });
  }

  /**
   * Extract searchable keywords from text
   */
  private extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
    return stopWords.includes(word);
  }

  /**
   * Perform intelligent search across all calculators
   */
  search(query: string, filters?: SearchFilters, limit: number = 20): SearchResult[] {
    this.trackSearch(query);
    
    if (!query.trim()) {
      return this.getAllCalculators(filters, limit);
    }
    
    const searchTerms = this.extractKeywords(query);
    const results = new Map<string, SearchResult>();
    
    // Search by keywords
    searchTerms.forEach(term => {
      this.keywordIndex.forEach((calculatorIds, keyword) => {
        if (keyword.includes(term) || term.includes(keyword)) {
          calculatorIds.forEach(id => {
            const calculator = this.searchIndex.get(id);
            if (calculator) {
              const existing = results.get(id);
              if (existing) {
                existing.relevanceScore += this.calculateRelevanceScore(term, keyword, calculator);
                if (!existing.matchedTerms.includes(term)) {
                  existing.matchedTerms.push(term);
                }
              } else {
                const result = { ...calculator };
                result.relevanceScore = this.calculateRelevanceScore(term, keyword, calculator);
                result.matchedTerms = [term];
                results.set(id, result);
              }
            }
          });
        }
      });
    });
    
    // Apply filters
    let filteredResults = Array.from(results.values());
    if (filters) {
      filteredResults = this.applyFilters(filteredResults, filters);
    }
    
    // Sort by relevance score
    filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return filteredResults.slice(0, limit);
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevanceScore(searchTerm: string, keyword: string, calculator: SearchResult): number {
    let score = 0;
    
    // Exact match in name gets highest score
    if (calculator.name.toLowerCase().includes(searchTerm)) {
      score += 100;
    }
    
    // Match in category gets high score
    if (calculator.category.toLowerCase().includes(searchTerm)) {
      score += 80;
    }
    
    // Match in features gets medium score
    if (calculator.features.some(feature => feature.toLowerCase().includes(searchTerm))) {
      score += 60;
    }
    
    // Match in description gets lower score
    if (calculator.description.toLowerCase().includes(searchTerm)) {
      score += 40;
    }
    
    // Keyword similarity bonus
    if (keyword === searchTerm) {
      score += 20;
    } else if (keyword.includes(searchTerm) || searchTerm.includes(keyword)) {
      score += 10;
    }
    
    // Badge bonus (Premium and AI Enhanced get higher scores)
    if (calculator.badge === 'Premium') score += 5;
    if (calculator.badge === 'AI Enhanced') score += 5;
    
    return score;
  }

  /**
   * Apply search filters
   */
  private applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    return results.filter(result => {
      if (filters.category && result.category !== filters.category) return false;
      if (filters.difficulty && result.difficulty !== filters.difficulty) return false;
      if (filters.badge && result.badge !== filters.badge) return false;
      if (filters.features && !filters.features.some(feature => 
        result.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
      )) return false;
      
      return true;
    });
  }

  /**
   * Get all calculators with optional filters
   */
  getAllCalculators(filters?: SearchFilters, limit: number = 20): SearchResult[] {
    let results = Array.from(this.searchIndex.values());
    
    if (filters) {
      results = this.applyFilters(results, filters);
    }
    
    // Sort by category and name
    results.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    return results.slice(0, limit);
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(partialQuery: string, limit: number = 10): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const query = partialQuery.toLowerCase().trim();
    
    if (query.length < 2) return suggestions;
    
    // Calculator name suggestions
    this.searchIndex.forEach(calculator => {
      if (calculator.name.toLowerCase().includes(query)) {
        suggestions.push({
          text: calculator.name,
          type: 'calculator',
          count: 1
        });
      }
    });
    
    // Category suggestions
    Object.keys(coreCalculatorCategories).forEach(category => {
      if (category.toLowerCase().includes(query)) {
        suggestions.push({
          text: category,
          type: 'category',
          count: coreCalculatorCategories[category as keyof typeof coreCalculatorCategories].length
        });
      }
    });
    
    // Feature suggestions
    const allFeatures = new Set<string>();
    this.searchIndex.forEach(calculator => {
      calculator.features.forEach(feature => {
        if (feature.toLowerCase().includes(query)) {
          allFeatures.add(feature);
        }
      });
    });
    
    allFeatures.forEach(feature => {
      suggestions.push({
        text: feature,
        type: 'feature',
        count: 1
      });
    });
    
    // Keyword suggestions
    this.keywordIndex.forEach((calculatorIds, keyword) => {
      if (keyword.includes(query) && keyword !== query) {
        suggestions.push({
          text: keyword,
          type: 'keyword',
          count: calculatorIds.length
        });
      }
    });
    
    // Sort by relevance and limit
    return suggestions
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.text.toLowerCase() === query;
        const bExact = b.text.toLowerCase() === query;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then by type priority
        const typePriority = { calculator: 4, category: 3, feature: 2, keyword: 1 };
        const aPriority = typePriority[a.type];
        const bPriority = typePriority[b.type];
        if (aPriority !== bPriority) return bPriority - aPriority;
        
        // Finally by count
        return b.count - a.count;
      })
      .slice(0, limit);
  }

  /**
   * Get calculators by category
   */
  getCalculatorsByCategory(category: string): SearchResult[] {
    return Array.from(this.searchIndex.values())
      .filter(calc => calc.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get related calculators based on features and category
   */
  getRelatedCalculators(calculatorId: string, limit: number = 5): SearchResult[] {
    const calculator = this.searchIndex.get(calculatorId);
    if (!calculator) return [];
    
    const related = new Map<string, { calculator: SearchResult; score: number }>();
    
    this.searchIndex.forEach((other, otherId) => {
      if (otherId === calculatorId) return;
      
      let score = 0;
      
      // Same category bonus
      if (other.category === calculator.category) {
        score += 50;
      }
      
      // Shared features bonus
      const sharedFeatures = calculator.features.filter(feature =>
        other.features.some(otherFeature => 
          otherFeature.toLowerCase().includes(feature.toLowerCase()) ||
          feature.toLowerCase().includes(otherFeature.toLowerCase())
        )
      );
      score += sharedFeatures.length * 20;
      
      // Same difficulty bonus
      if (other.difficulty === calculator.difficulty) {
        score += 10;
      }
      
      // Same badge bonus
      if (other.badge === calculator.badge) {
        score += 5;
      }
      
      if (score > 0) {
        related.set(otherId, { calculator: other, score });
      }
    });
    
    return Array.from(related.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.calculator);
  }

  /**
   * Track search for analytics
   */
  private trackSearch(query: string): void {
    this.searchAnalytics.totalSearches++;
    
    // Update popular queries
    const existingQuery = this.searchAnalytics.popularQueries.find(q => q.query === query);
    if (existingQuery) {
      existingQuery.count++;
    } else {
      this.searchAnalytics.popularQueries.push({ query, count: 1 });
    }
    
    // Keep only top 100 queries
    this.searchAnalytics.popularQueries.sort((a, b) => b.count - a.count);
    this.searchAnalytics.popularQueries = this.searchAnalytics.popularQueries.slice(0, 100);
  }

  /**
   * Get search analytics
   */
  getAnalytics(): SearchAnalytics {
    return { ...this.searchAnalytics };
  }

  /**
   * Get popular calculators based on search frequency
   */
  getPopularCalculators(limit: number = 10): SearchResult[] {
    // This would typically be based on actual usage data
    // For now, return calculators sorted by category priority
    const categoryPriority = {
      'Core Engineering': 4,
      'Quality Control': 3,
      'Process Optimization': 2,
      'Advanced Analysis': 1
    };
    
    return Array.from(this.searchIndex.values())
      .sort((a, b) => {
        const aPriority = categoryPriority[a.category as keyof typeof categoryPriority] || 0;
        const bPriority = categoryPriority[b.category as keyof typeof categoryPriority] || 0;
        if (aPriority !== bPriority) return bPriority - aPriority;
        return a.name.localeCompare(b.name);
      })
      .slice(0, limit);
  }
}

// Export singleton instance
export const searchService = new SearchService();
