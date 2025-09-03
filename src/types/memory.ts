/**
 * Memory System Type Definitions
 * Comprehensive type definitions for the laser cutting calculator memory system
 */

// ============================================================================
// Core Memory Types
// ============================================================================

/**
 * User profile containing preferences and learning data
 */
export interface UserProfile {
  id: string;
  userId: string;
  preferences: UserPreferences;
  learningModel: UserLearningModel;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User preferences for personalization
 */
export interface UserPreferences {
  defaultUnits: 'metric' | 'imperial';
  autoSaveCalculations: boolean;
  showRecommendations: boolean;
  confidenceThreshold: number; // 0-1, minimum confidence for showing suggestions
  favoriteCalculators: string[];
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
}

/**
 * Notification preferences
 */
export interface NotificationSettings {
  newRecommendations: boolean;
  parameterOptimizations: boolean;
  teamUpdates: boolean;
  systemUpdates: boolean;
}

/**
 * Privacy settings for data sharing
 */
export interface PrivacySettings {
  shareUsageData: boolean;
  allowTeamSharing: boolean;
  anonymousAnalytics: boolean;
  dataRetentionDays: number;
}

/**
 * User learning model for personalized recommendations
 */
export interface UserLearningModel {
  parameterPatterns: ParameterPattern[];
  materialPreferences: MaterialPreference[];
  calculatorUsage: CalculatorUsage[];
  optimizationHistory: OptimizationRecord[];
  lastModelUpdate: Date;
}

/**
 * Pattern in user's parameter usage
 */
export interface ParameterPattern {
  calculatorType: string;
  parameterName: string;
  frequentValues: Array<{
    value: any;
    frequency: number;
    context: ParameterContext;
  }>;
  trends: ParameterTrend[];
}

/**
 * Context information for parameter usage
 */
export interface ParameterContext {
  materialType?: string;
  thickness?: number;
  projectType?: string;
  timeOfDay?: string;
  seasonality?: string;
}

/**
 * Trend in parameter usage over time
 */
export interface ParameterTrend {
  direction: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  timeframe: string;
  significance: number;
}

/**
 * User's material preferences and success rates
 */
export interface MaterialPreference {
  materialType: string;
  usageCount: number;
  successRate: number;
  averageParameters: Record<string, number>;
  lastUsed: Date;
}

/**
 * Calculator usage statistics
 */
export interface CalculatorUsage {
  calculatorType: string;
  usageCount: number;
  averageSessionTime: number;
  successRate: number;
  lastUsed: Date;
  favoritePresets: string[];
}

/**
 * Record of optimization attempts and results
 */
export interface OptimizationRecord {
  id: string;
  calculatorType: string;
  originalParameters: Record<string, any>;
  optimizedParameters: Record<string, any>;
  improvementMetrics: ImprovementMetrics;
  userFeedback: OptimizationFeedback;
  timestamp: Date;
}

/**
 * Metrics showing improvement from optimization
 */
export interface ImprovementMetrics {
  timeSaving?: number; // percentage
  costSaving?: number; // percentage
  qualityImprovement?: number; // score 0-10
  efficiencyGain?: number; // percentage
}

/**
 * User feedback on optimization suggestions
 */
export interface OptimizationFeedback {
  accepted: boolean;
  rating: number; // 1-5 stars
  comment?: string;
  actualResults?: ImprovementMetrics;
}

// ============================================================================
// Calculation History Types
// ============================================================================

/**
 * Complete record of a calculation session
 */
export interface CalculationRecord {
  id: string;
  userId: string;
  sessionId: string;
  calculatorType: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  context: CalculationContext;
  metadata: CalculationMetadata;
  timestamp: Date;
}

/**
 * Context information for the calculation
 */
export interface CalculationContext {
  projectName?: string;
  materialType: string;
  thickness: number;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  qualityRequirement: 'standard' | 'high' | 'precision';
  environment: 'development' | 'production';
}

/**
 * Metadata about the calculation session
 */
export interface CalculationMetadata {
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browserInfo: string;
  location?: GeolocationCoordinates;
  referrer?: string;
  sessionDuration: number; // milliseconds
  iterationCount: number; // how many times parameters were adjusted
}

// ============================================================================
// Parameter Preset Types
// ============================================================================

/**
 * Saved parameter configuration
 */
export interface ParameterPreset {
  id: string;
  name: string;
  description: string;
  calculatorType: string;
  parameters: Record<string, any>;
  tags: string[];
  category: PresetCategory;
  visibility: PresetVisibility;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageStats: PresetUsageStats;
  validation: PresetValidation;
}

/**
 * Category classification for presets
 */
export type PresetCategory = 
  | 'material-specific'
  | 'project-type'
  | 'quality-focused'
  | 'speed-optimized'
  | 'cost-effective'
  | 'experimental'
  | 'standard'
  | 'custom';

/**
 * Visibility and sharing settings for presets
 */
export interface PresetVisibility {
  scope: 'private' | 'team' | 'organization' | 'public';
  sharedWith: string[]; // user IDs or team IDs
  permissions: PresetPermissions;
}

/**
 * Permissions for preset access and modification
 */
export interface PresetPermissions {
  canView: string[];
  canUse: string[];
  canEdit: string[];
  canShare: string[];
  canDelete: string[];
}

/**
 * Usage statistics for a preset
 */
export interface PresetUsageStats {
  totalUsage: number;
  uniqueUsers: number;
  averageRating: number;
  successRate: number;
  lastUsed: Date;
  popularityTrend: 'rising' | 'stable' | 'declining';
}

/**
 * Validation information for presets
 */
export interface PresetValidation {
  isValidated: boolean;
  validatedBy?: string; // expert user ID
  validationDate?: Date;
  validationNotes?: string;
  expertRating?: number; // 1-5 stars
  recommendationLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// ============================================================================
// Recommendation Types
// ============================================================================

/**
 * AI-generated recommendation for parameter optimization
 */
export interface Recommendation {
  id: string;
  userId: string;
  type: RecommendationType;
  calculatorType: string;
  currentParameters: Record<string, any>;
  suggestedParameters: Record<string, any>;
  reasoning: RecommendationReasoning;
  confidence: number; // 0-1
  potentialImpact: ImprovementMetrics;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Types of recommendations the system can generate
 */
export type RecommendationType =
  | 'parameter-optimization'
  | 'material-suggestion'
  | 'preset-recommendation'
  | 'workflow-improvement'
  | 'cost-reduction'
  | 'quality-enhancement'
  | 'speed-optimization'
  | 'safety-improvement';

/**
 * Explanation for why a recommendation was made
 */
export interface RecommendationReasoning {
  primaryFactors: string[];
  dataPoints: RecommendationDataPoint[];
  similarCases: string[]; // IDs of similar successful cases
  expertValidation?: string; // reference to expert who validated this approach
  confidence_breakdown: {
    historical_data: number;
    pattern_matching: number;
    expert_knowledge: number;
    statistical_significance: number;
  };
}

/**
 * Data point supporting a recommendation
 */
export interface RecommendationDataPoint {
  metric: string;
  currentValue: number;
  suggestedValue: number;
  improvement: number;
  confidence: number;
  source: 'historical' | 'pattern' | 'expert' | 'simulation';
}

// ============================================================================
// Team Collaboration Types
// ============================================================================

/**
 * Team or organization for collaborative features
 */
export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  settings: TeamSettings;
  sharedLibrary: SharedLibrary;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Team member with role and permissions
 */
export interface TeamMember {
  userId: string;
  role: TeamRole;
  permissions: TeamPermissions;
  joinedAt: Date;
  lastActive: Date;
  contributionStats: ContributionStats;
}

/**
 * Team roles with different access levels
 */
export type TeamRole = 'owner' | 'admin' | 'expert' | 'member' | 'viewer';

/**
 * Specific permissions for team operations
 */
export interface TeamPermissions {
  canCreatePresets: boolean;
  canEditSharedPresets: boolean;
  canDeletePresets: boolean;
  canInviteMembers: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
}

/**
 * Statistics about a team member's contributions
 */
export interface ContributionStats {
  presetsCreated: number;
  presetsShared: number;
  validationsProvided: number;
  helpfulRatings: number;
  knowledgeScore: number; // calculated expertise score
}

/**
 * Team-wide settings and preferences
 */
export interface TeamSettings {
  defaultVisibility: PresetVisibility['scope'];
  requireValidation: boolean;
  allowExternalSharing: boolean;
  dataRetentionPolicy: number; // days
  qualityThreshold: number; // minimum rating for shared presets
  notificationSettings: TeamNotificationSettings;
}

/**
 * Team notification preferences
 */
export interface TeamNotificationSettings {
  newPresets: boolean;
  presetUpdates: boolean;
  memberActivity: boolean;
  performanceReports: boolean;
  systemAlerts: boolean;
}

/**
 * Shared library of team resources
 */
export interface SharedLibrary {
  presets: ParameterPreset[];
  templates: CalculationTemplate[];
  bestPractices: BestPractice[];
  knowledgeBase: KnowledgeArticle[];
}

/**
 * Template for common calculation scenarios
 */
export interface CalculationTemplate {
  id: string;
  name: string;
  description: string;
  calculatorType: string;
  parameterTemplate: Record<string, ParameterTemplate>;
  usageInstructions: string;
  createdBy: string;
  createdAt: Date;
}

/**
 * Template for individual parameters
 */
export interface ParameterTemplate {
  defaultValue?: any;
  suggestedRange?: [number, number];
  validationRules?: ValidationRule[];
  helpText?: string;
  dependencies?: string[]; // other parameters this depends on
}

/**
 * Validation rule for parameter values
 */
export interface ValidationRule {
  type: 'range' | 'enum' | 'pattern' | 'custom';
  constraint: any;
  errorMessage: string;
}

/**
 * Best practice documentation
 */
export interface BestPractice {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  applicableCalculators: string[];
  authorId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Knowledge base article
 */
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // minutes
  authorId: string;
  rating: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Analytics and Reporting Types
// ============================================================================

/**
 * Analytics data for usage patterns and performance
 */
export interface AnalyticsData {
  userId?: string;
  teamId?: string;
  timeframe: AnalyticsTimeframe;
  metrics: AnalyticsMetrics;
  trends: AnalyticsTrend[];
  insights: AnalyticsInsight[];
  generatedAt: Date;
}

/**
 * Time period for analytics reporting
 */
export interface AnalyticsTimeframe {
  start: Date;
  end: Date;
  granularity: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
}

/**
 * Key performance metrics
 */
export interface AnalyticsMetrics {
  totalCalculations: number;
  uniqueUsers: number;
  averageSessionTime: number;
  parameterAccuracy: number;
  recommendationAcceptanceRate: number;
  userSatisfactionScore: number;
  systemPerformance: PerformanceMetrics;
}

/**
 * System performance metrics
 */
export interface PerformanceMetrics {
  averageResponseTime: number; // milliseconds
  errorRate: number; // percentage
  uptime: number; // percentage
  cacheHitRate: number; // percentage
  databaseQueryTime: number; // milliseconds
}

/**
 * Trend analysis over time
 */
export interface AnalyticsTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  magnitude: number; // percentage change
  significance: number; // statistical significance
  timeframe: string;
}

/**
 * AI-generated insights from analytics data
 */
export interface AnalyticsInsight {
  type: 'opportunity' | 'warning' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedActions?: string[];
  confidence: number;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

/**
 * API error information
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

/**
 * Response metadata for pagination and additional info
 */
export interface ResponseMetadata {
  pagination?: PaginationInfo;
  performance?: {
    queryTime: number;
    cacheHit: boolean;
  };
  version: string;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// Search and Filter Types
// ============================================================================

/**
 * Search criteria for memory system queries
 */
export interface SearchCriteria {
  query?: string;
  filters: SearchFilters;
  sorting: SortOptions;
  pagination: PaginationOptions;
}

/**
 * Available filters for search operations
 */
export interface SearchFilters {
  calculatorTypes?: string[];
  materialTypes?: string[];
  dateRange?: DateRange;
  tags?: string[];
  categories?: string[];
  ratings?: RatingRange;
  users?: string[];
  teams?: string[];
}

/**
 * Date range filter
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Rating range filter
 */
export interface RatingRange {
  min: number;
  max: number;
}

/**
 * Sorting options for search results
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
  secondary?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

/**
 * Pagination options for search results
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

// ============================================================================
// Export all types
// ============================================================================

export * from './memory';
